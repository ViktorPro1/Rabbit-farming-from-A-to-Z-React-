import { useState } from "react";

interface Props {
  accessToken: string;
}

const MAX_TITLE = 100;
const MAX_BODY = 500;

type Status = { kind: "success" | "error"; text: string } | null;

/** Посилання має вести на сторінку сайту або на https-адресу (так само перевіряє сервер). */
function isValidUrl(url: string): boolean {
  return (url.startsWith("/") && !url.startsWith("//")) || url.startsWith("https://");
}

export function PushBroadcastSection({ accessToken }: Props) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const canSend = title.trim() !== "" && body.trim() !== "" && !sending;

  async function handleSend() {
    const cleanUrl = url.trim();
    if (cleanUrl !== "" && !isValidUrl(cleanUrl)) {
      setStatus({
        kind: "error",
        text: "Посилання має починатися з «/» (сторінка сайту) або з «https://».",
      });
      return;
    }

    if (!window.confirm("Надіслати це сповіщення ВСІМ користувачам?")) return;

    setSending(true);
    setStatus(null);
    try {
      const res = await fetch("/api/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim(),
          ...(cleanUrl !== "" && { url: cleanUrl }),
        }),
      });

      if (res.ok) {
        const data = (await res.json()) as { sent: number; total: number };
        setStatus({
          kind: "success",
          text: `Надіслано: ${data.sent} з ${data.total} підписок.`,
        });
        // Очищаємо форму, щоб випадково не надіслати те саме двічі
        setTitle("");
        setBody("");
        setUrl("");
      } else if (res.status === 400) {
        setStatus({
          kind: "error",
          text: "Сервер відхилив дані. Перевірте заголовок, текст і посилання.",
        });
      } else if (res.status === 401) {
        setStatus({
          kind: "error",
          text: "Немає прав на розсилку. Увійдіть в акаунт адміністратора ще раз.",
        });
      } else {
        setStatus({
          kind: "error",
          text: "Не вдалося надіслати. Спробуйте ще раз.",
        });
      }
    } catch {
      setStatus({
        kind: "error",
        text: "Не вдалося надіслати. Перевірте з'єднання і спробуйте ще раз.",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="admin-section">
      <h2>🔔 Розсилка push-сповіщень</h2>
      <p className="admin-push-hint">
        Сповіщення отримають усі користувачі, які дозволили їх на своєму
        пристрої.
      </p>

      <div className="admin-push-form">
        <label htmlFor="push-title">
          Заголовок
          <span className="admin-push-counter">
            {title.length}/{MAX_TITLE}
          </span>
        </label>
        <input
          id="push-title"
          name="pushTitle"
          maxLength={MAX_TITLE}
          placeholder="Наприклад: Нова функція"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="push-body">
          Текст
          <span className="admin-push-counter">
            {body.length}/{MAX_BODY}
          </span>
        </label>
        <textarea
          id="push-body"
          name="pushBody"
          rows={3}
          maxLength={MAX_BODY}
          placeholder="Наприклад: Додали калькулятор кормів"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        <label htmlFor="push-url">Посилання (необов'язково)</label>
        <input
          id="push-url"
          name="pushUrl"
          placeholder="/calculator, за замовчуванням головна"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button
          type="button"
          className="admin-btn-add admin-push-send"
          onClick={handleSend}
          disabled={!canSend}
        >
          {sending ? "Надсилаю..." : "Надіслати всім"}
        </button>
      </div>

      {status && (
        <p
          className={
            status.kind === "success" ? "admin-success" : "admin-error"
          }
          role={status.kind === "error" ? "alert" : "status"}
        >
          {status.text}
        </p>
      )}
    </div>
  );
}
