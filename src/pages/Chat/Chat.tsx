import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Handshake, ThumbsDown, ThumbsUp } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { logError } from "../../lib/logError";
import { CHAT_READ_EVENT } from "../../hooks/useChatUnread";
import { CHAT_RULES } from "./chatRules";
import {
  buildReactionMap,
  toggleReactionLocally,
  myReaction,
} from "./reactions";
import type { ReactionCountRow, ReactionKind, ReactionMap } from "./reactions";
import "./Chat.css";

// Ліміти збігаються з правилами в базі (крок 1 міграції):
// текст 1-1000 символів, життя повідомлення 3 дні.
const MAX_LENGTH = 1000;
const LIFETIME_MS = 3 * 24 * 60 * 60 * 1000;
// Як часто тихо підтягувати нові повідомлення, поки вкладка відкрита
const POLL_MS = 30_000;
// Скільки останніх повідомлень показувати (за 3 дні їх буде небагато)
const LOAD_LIMIT = 300;

// Додано: реакції під повідомленням (іконки замість емодзі, щоб вигляд був
// однаковим на всіх пристроях)
const REACTION_BUTTONS = [
  { kind: "up", label: "Подобається", Icon: ThumbsUp },
  { kind: "down", label: "Не подобається", Icon: ThumbsDown },
  { kind: "handshake", label: "Рукостискання", Icon: Handshake },
] as const;

interface ChatMessage {
  id: string;
  user_id: string;
  body: string;
  reply_to: string | null;
  created_at: string;
  edited_at: string | null;
  // Додано: чи був автор засновником (прапорець ставить база при створенні)
  author_is_founder: boolean;
}

// "зникне через 2 д 5 год" / "через 5 год 10 хв" / "через 12 хв"
function formatTimeLeft(createdAt: string, now: number): string {
  const left = new Date(createdAt).getTime() + LIFETIME_MS - now;
  if (left <= 60_000) return "зникне за хвилину";
  const totalMinutes = Math.floor(left / 60_000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return `зникне через ${days} д ${hours} год`;
  if (hours > 0) return `зникне через ${hours} год ${minutes} хв`;
  return `зникне через ${minutes} хв`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("uk-UA", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  // Додано: чи я засновник (тоді можна видаляти будь-які повідомлення)
  const [isFounder, setIsFounder] = useState(false);
  // Додано: правила чату згорнуті за замовчуванням (акордеон)
  const [rulesOpen, setRulesOpen] = useState(false);
  // Додано: реакції (кількості й моя) по повідомленнях
  const [reactions, setReactions] = useState<ReactionMap>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  // "Зараз" для підписів "зникне через ..." — оновлюється раз на хвилину
  const [now, setNow] = useState(() => Date.now());
  const endRef = useRef<HTMLDivElement | null>(null);
  const scrolledRef = useRef(false);
  // Додано: час найновішого повідомлення, яке вже позначили прочитаним
  const markedRef = useRef<string | null>(null);

  const load = useCallback(async () => {
    // RLS у базі сама віддає лише повідомлення молодші за 3 дні.
    // Беремо найновіші й розвертаємо, щоб нові були внизу.
    // Змінено: повідомлення і реакції беремо одночасно. Збій реакцій не
    // критичний: чат працює, просто без цифр під повідомленнями.
    const [messagesRes, reactionsRes] = await Promise.all([
      supabase
        .from("chat_messages")
        .select(
          "id, user_id, body, reply_to, created_at, edited_at, author_is_founder",
        )
        .order("created_at", { ascending: false })
        .limit(LOAD_LIMIT),
      supabase.rpc("chat_reaction_counts"),
    ]);
    const { data, error } = messagesRes;
    if (reactionsRes.error) {
      logError("Chat.loadReactions", reactionsRes.error);
    } else {
      setReactions(
        buildReactionMap((reactionsRes.data ?? []) as ReactionCountRow[]),
      );
    }
    if (error) {
      logError("Chat.load", error);
      setLoadError(true);
      return;
    }
    setLoadError(false);
    const rows = (data ?? []) as ChatMessage[];
    setMessages([...rows].reverse());
    setNow(Date.now());

    // Додано: якщо вкладку видно і з'явилось щось нове, позначаємо чат
    // прочитаним (час ставить база). Хедер за подією скидає кружечок.
    const newest = rows[0]?.created_at ?? null;
    if (!document.hidden && newest && newest !== markedRef.current) {
      markedRef.current = newest;
      const { error: readError } = await supabase.rpc("chat_mark_read");
      if (readError) {
        logError("Chat.markRead", readError);
        markedRef.current = null; // спробуємо ще раз при наступному оновленні
      } else {
        window.dispatchEvent(new Event(CHAT_READ_EVENT));
      }
    }
  }, []);

  // Перше завантаження: хто я + список повідомлень
  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        const { data } = await supabase.auth.getSession();
        if (cancelled) return;
        setUserId(data.session?.user.id ?? null);
        // Додано: запитуємо в бази, чи я засновник. Помилка не критична:
        // тоді просто не показуємо кнопки видалення чужого (база все одно
        // не дозволить, це лише вигляд).
        const founderRes = await supabase.rpc("is_founder");
        if (cancelled) return;
        if (founderRes.error) {
          logError("Chat.isFounder", founderRes.error);
        } else {
          setIsFounder(founderRes.data === true);
        }
        await load();
      } catch (error) {
        logError("Chat.init", error);
        if (!cancelled) setLoadError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    init();
    return () => {
      cancelled = true;
    };
  }, [load]);

  // Тихе оновлення: раз на 30 с, і одразу коли користувач повернувся на вкладку
  useEffect(() => {
    const tick = () => {
      if (!document.hidden) void load();
    };
    const timer = window.setInterval(tick, POLL_MS);
    document.addEventListener("visibilitychange", tick);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [load]);

  // Годинник для підписів часу
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  // Після першого завантаження гортаємо вниз, до найновіших
  useEffect(() => {
    if (!loading && !scrolledRef.current) {
      scrolledRef.current = true;
      endRef.current?.scrollIntoView?.({ block: "end" });
    }
  }, [loading]);

  async function handleSend(event: FormEvent) {
    event.preventDefault();
    const body = text.trim();
    if (!body || body.length > MAX_LENGTH || sending) return;
    setSending(true);
    setActionError(null);
    // user_id база підставляє сама з сесії, з клієнта його не надсилаємо
    const { error } = await supabase
      .from("chat_messages")
      .insert({ body, reply_to: replyTo?.id ?? null });
    setSending(false);
    if (error) {
      logError("Chat.send", error);
      setActionError("Не вдалося надіслати. Спробуйте ще раз.");
      return;
    }
    setText("");
    setReplyTo(null);
    await load();
    endRef.current?.scrollIntoView?.({ behavior: "smooth", block: "end" });
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Видалити повідомлення?")) return;
    setActionError(null);
    // .select("id") потрібен, щоб побачити, чи рядок справді видалено:
    // якщо RLS не дозволила, помилки не буде, але масив буде порожній
    const { data, error } = await supabase
      .from("chat_messages")
      .delete()
      .eq("id", id)
      .select("id");
    if (error || !data || data.length === 0) {
      if (error) logError("Chat.delete", error);
      setActionError("Не вдалося видалити повідомлення.");
      return;
    }
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (replyTo?.id === id) setReplyTo(null);
  }

  // Додано: поставити / замінити / зняти реакцію. Спочатку міняємо екран
  // (щоб кнопка реагувала миттєво), потім запитуємо базу; при помилці
  // повертаємо реальний стан із бази.
  async function handleReact(messageId: string, kind: ReactionKind) {
    setActionError(null);
    setReactions((prev) => toggleReactionLocally(prev, messageId, kind));
    const { error } = await supabase.rpc("chat_set_reaction", {
      p_message_id: messageId,
      p_kind: kind,
    });
    if (error) {
      logError("Chat.react", error);
      setActionError("Не вдалося поставити реакцію.");
      await load();
    }
  }

  function startEdit(message: ChatMessage) {
    setEditingId(message.id);
    setEditText(message.body);
    setActionError(null);
  }

  async function saveEdit(id: string) {
    const body = editText.trim();
    if (!body || body.length > MAX_LENGTH) return;
    const { data, error } = await supabase
      .from("chat_messages")
      .update({ body })
      .eq("id", id)
      .select("id");
    if (error || !data || data.length === 0) {
      if (error) logError("Chat.edit", error);
      setActionError("Не вдалося зберегти зміни.");
      return;
    }
    setEditingId(null);
    await load();
  }

  const left = MAX_LENGTH - text.length;

  return (
    <main className="chat-page">
      <div className="chat-shell">
        <header className="chat-head">
          <h1 className="chat-title">Чат</h1>
          <p className="chat-subtitle">
            Закрите спілкування учасників. Повідомлення зникають через 3 дні.
          </p>
        </header>

        {/* Закріплений пост з правилами: текст береться з chatRules.ts.
            Змінено: тепер це акордеон, за замовчуванням згорнутий. */}
        <section className="chat-pinned" aria-label="Закріплене повідомлення">
          <h2 className="chat-pinned-heading">
            <button
              type="button"
              className="chat-pinned-toggle"
              aria-expanded={rulesOpen}
              aria-controls="chat-rules-panel"
              onClick={() => setRulesOpen((prev) => !prev)}
            >
              <span className="chat-pinned-head-text">
                <span className="chat-pinned-tag">Закріплено</span>
                <span className="chat-pinned-title">{CHAT_RULES.title}</span>
              </span>
              <span className="chat-pinned-chevron" aria-hidden="true" />
            </button>
          </h2>
          <div
            id="chat-rules-panel"
            className={
              rulesOpen
                ? "chat-pinned-panel chat-pinned-panel--open"
                : "chat-pinned-panel"
            }
          >
            <div className="chat-pinned-panel-inner">
              <p className="chat-pinned-text">{CHAT_RULES.intro}</p>
              <ul className="chat-pinned-list">
                {CHAT_RULES.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {loading && <p className="chat-state">Завантаження...</p>}

        {!loading && loadError && (
          <div className="chat-state chat-state--error">
            <p>Не вдалося завантажити повідомлення.</p>
            <button
              type="button"
              className="chat-btn"
              onClick={() => void load()}
            >
              Спробувати ще раз
            </button>
          </div>
        )}

        {!loading && !loadError && messages.length === 0 && (
          <p className="chat-state">
            Поки що повідомлень немає. Напишіть першим.
          </p>
        )}

        <ul className="chat-list">
          {messages.map((message) => {
            const own = message.user_id === userId;
            // Додано: видаляти можна своє, а засновник може видаляти будь-яке
            const canDelete = own || isFounder;
            const parent = message.reply_to
              ? messages.find((m) => m.id === message.reply_to)
              : undefined;
            const isEditing = editingId === message.id;
            return (
              <li
                key={message.id}
                className={own ? "chat-msg chat-msg--own" : "chat-msg"}
              >
                <div className="chat-msg-top">
                  {/* Змінено: бейдж "Засновник" замість підпису "Учасник" */}
                  <span className="chat-author">
                    {own ? "Ви" : message.author_is_founder ? "" : "Учасник"}
                    {message.author_is_founder && (
                      <span className="chat-badge">Засновник</span>
                    )}
                  </span>
                  <time className="chat-time" dateTime={message.created_at}>
                    {formatDate(message.created_at)}
                  </time>
                </div>

                {message.reply_to && (
                  <blockquote className="chat-quote">
                    {parent ? parent.body : "Повідомлення вже видалено"}
                  </blockquote>
                )}

                {isEditing ? (
                  <div className="chat-edit">
                    <textarea
                      className="chat-textarea"
                      value={editText}
                      maxLength={MAX_LENGTH}
                      rows={3}
                      onChange={(e) => setEditText(e.target.value)}
                      aria-label="Редагування повідомлення"
                      id="chat-edit-textarea"
                      name="chat-edit-textarea"
                    />
                    <div className="chat-actions">
                      <button
                        type="button"
                        className="chat-btn"
                        onClick={() => void saveEdit(message.id)}
                        disabled={!editText.trim()}
                      >
                        Зберегти
                      </button>
                      <button
                        type="button"
                        className="chat-link"
                        onClick={() => setEditingId(null)}
                      >
                        Скасувати
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="chat-body">{message.body}</p>
                )}

                {!isEditing && (
                  <div
                    className="chat-reactions"
                    role="group"
                    aria-label="Реакції"
                  >
                    {REACTION_BUTTONS.map(({ kind, label, Icon }) => {
                      const state = reactions[message.id]?.[kind];
                      const mine = myReaction(reactions, message.id) === kind;
                      return (
                        <button
                          key={kind}
                          type="button"
                          className={
                            mine ? "chat-react chat-react--on" : "chat-react"
                          }
                          aria-pressed={mine}
                          aria-label={label}
                          title={label}
                          onClick={() => void handleReact(message.id, kind)}
                        >
                          <Icon size={15} aria-hidden="true" />
                          {state && state.count > 0 && (
                            <span className="chat-react-count">
                              {state.count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {!isEditing && (
                  <div className="chat-msg-bottom">
                    <span className="chat-expire">
                      {message.edited_at ? "змінено · " : ""}
                      {formatTimeLeft(message.created_at, now)}
                    </span>
                    <div className="chat-actions">
                      <button
                        type="button"
                        className="chat-link"
                        onClick={() => setReplyTo(message)}
                      >
                        Відповісти
                      </button>
                      {own && (
                        <button
                          type="button"
                          className="chat-link"
                          onClick={() => startEdit(message)}
                        >
                          Редагувати
                        </button>
                      )}
                      {canDelete && (
                        <button
                          type="button"
                          className="chat-link chat-link--danger"
                          onClick={() => void handleDelete(message.id)}
                        >
                          Видалити
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <form className="chat-composer" onSubmit={handleSend}>
          {replyTo && (
            <div className="chat-replying">
              <span>
                Відповідь на: <em>{replyTo.body.slice(0, 80)}</em>
              </span>
              <button
                type="button"
                className="chat-link"
                onClick={() => setReplyTo(null)}
              >
                Скасувати
              </button>
            </div>
          )}
          {actionError && (
            <p className="chat-error" role="alert">
              {actionError}
            </p>
          )}
          <textarea
            className="chat-textarea"
            value={text}
            maxLength={MAX_LENGTH}
            rows={3}
            placeholder="Напишіть повідомлення..."
            onChange={(e) => setText(e.target.value)}
            aria-label="Нове повідомлення"
            id="chat-composer-textarea"
            name="chat-composer-textarea"
          />
          <div className="chat-composer-row">
            <span
              className={
                left < 100 ? "chat-count chat-count--low" : "chat-count"
              }
            >
              {left}
            </span>
            <button
              type="submit"
              className="chat-btn chat-btn--primary"
              disabled={sending || !text.trim()}
            >
              {sending ? "Надсилаю..." : "Надіслати"}
            </button>
          </div>
        </form>

        {/* Змінено: маркер "кінець сторінки" тепер після форми, а не перед нею,
            інакше липка форма перекривала б останнє повідомлення при прокрутці вниз */}
        <div ref={endRef} />
      </div>
    </main>
  );
}
