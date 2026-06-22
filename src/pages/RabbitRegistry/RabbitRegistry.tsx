import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { QRCodeCanvas } from "qrcode.react";
import { supabase } from "../../lib/supabase";
import SkeletonCard from "./SkeletonCard";
import "./RabbitRegistry.css";

interface Props {
  session: Session;
}

interface Rabbit {
  id: string;
  name: string;
  breed: string;
  gender: "male" | "female";
  birth_date: string;
  cage_number: string;
  notes: string;
  is_active: boolean;
}

interface Stats {
  total: number;
  males: number;
  females: number;
  youngTotal: number;
  youngFromCages: number;
  youngFromPaddocks: number;
  paddockFemales: number;
  fatteningMales: number;
  fatteningFemales: number;
  fatteningUnknown: number;
  fatteningTotal: number;
  quarantineMales: number;
  quarantineFemales: number;
  quarantineUnknown: number;
  quarantineTotal: number;
}

const emptyForm = {
  name: "",
  breed: "",
  gender: "female" as "male" | "female",
  birth_date: "",
  cage_number: "",
  notes: "",
};

const helpItems = [
  {
    icon: "🐇",
    title: "Мої кролики",
    desc: "Реєстр дорослих тварин. Додавай кожного кролика з кличкою, породою, кліткою і датою народження. Вік розраховується автоматично.",
  },
  {
    icon: "📦",
    title: "Архів",
    desc: "Архівовані кролики. Тварини яких прибрав з активного реєстру. Можна відновити або видалити назавжди.",
  },
  {
    icon: "🐇",
    title: "Розведення",
    desc: "Індивідуальні злучки. Вказуєш коєць + кроличка, дату злучки — система автоматично розраховує контрольну дату і очікуваний окріл. Після окролу вносиш скільки народилось і коли відлучив.",
  },
  {
    icon: "🏠",
    title: "Підлогове утримання",
    desc: "Групове розведення в загоні. Один коєць + кілька самок. Самок додаєш вручну. Так само вносиш злучки і окроли для всього загону.",
  },
  {
    icon: "🥩",
    title: "Відгодівля",
    desc: "Клітки з кроликами на забій. Вказуєш номер клітки, кількість, породу і дату народження. Система показує скільки днів до планової дати забою.",
  },
  {
    icon: "🔒",
    title: "Карантин",
    desc: "Ізольовані тварини. Вказуєш з якої клітки, причину і дату переміщення. Після карантину фіксуєш результат: видужав, пішов на забій або загинув.",
  },
  {
    icon: "📊",
    title: "Лічильник",
    desc: "Блок з цифрами вгорі автоматично рахує всіх тварин з усіх розділів: реєстр + молодняк з окролів + підлогове + відгодівля + карантин.",
  },
];

export default function RabbitRegistry({ session }: Props) {
  const [rabbits, setRabbits] = useState<Rabbit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const [confirmArchiveId, setConfirmArchiveId] = useState<string | null>(null);
  const currentLabel =
    session.user.user_metadata?.display_name || session.user.email;
  const [stats, setStats] = useState<Stats>({
    total: 0,
    males: 0,
    females: 0,
    youngTotal: 0,
    youngFromCages: 0,
    youngFromPaddocks: 0,
    paddockFemales: 0,
    fatteningMales: 0,
    fatteningFemales: 0,
    fatteningUnknown: 0,
    fatteningTotal: 0,
    quarantineMales: 0,
    quarantineFemales: 0,
    quarantineUnknown: 0,
    quarantineTotal: 0,
  });
  const [showSettings, setShowSettings] = useState(false);
  const [displayName, setDisplayName] = useState(
    session.user.user_metadata?.display_name || "",
  );
  const [displayNameSaving, setDisplayNameSaving] = useState(false);
  const [displayNameSaved, setDisplayNameSaved] = useState(false);
  const [displayNameError, setDisplayNameError] = useState("");
  const navigate = useNavigate();

  const loadStats = useCallback(
    (list: Rabbit[]) => {
      Promise.all([
        supabase
          .from("litters")
          .select("alive, weaned_males, weaned_females, weaned_date")
          .eq("user_id", session.user.id),
        supabase
          .from("paddock_litters")
          .select("alive, weaned_males, weaned_females, weaned_date")
          .eq("user_id", session.user.id),
        supabase
          .from("paddock_females")
          .select("id")
          .not("paddock_id", "is", null),
        supabase
          .from("fattening")
          .select("males, females, unknown")
          .eq("user_id", session.user.id)
          .eq("is_active", true),
        supabase
          .from("quarantine")
          .select("gender")
          .eq("user_id", session.user.id)
          .eq("is_active", true),
      ]).then(
        ([
          { data: littersData },
          { data: paddockLittersData },
          { data: paddockFemalesData },
          { data: fatteningData },
          { data: quarantineData },
        ]) => {
          let youngFromCages = 0,
            youngFromPaddocks = 0,
            youngTotal = 0;

          (littersData || []).forEach((l) => {
            if (l.weaned_date) return;
            const alive = l.alive || 0;
            youngFromCages += alive;
            youngTotal += alive;
          });

          (paddockLittersData || []).forEach((l) => {
            if (l.weaned_date) return;
            const alive = l.alive || 0;
            youngFromPaddocks += alive;
            youngTotal += alive;
          });

          const paddockFemales = (paddockFemalesData || []).length;
          let fatteningMales = 0,
            fatteningFemales = 0,
            fatteningUnknown = 0;
          (fatteningData || []).forEach((f) => {
            fatteningMales += f.males || 0;
            fatteningFemales += f.females || 0;
            fatteningUnknown += f.unknown || 0;
          });
          const fatteningTotal =
            fatteningMales + fatteningFemales + fatteningUnknown;
          let quarantineMales = 0,
            quarantineFemales = 0,
            quarantineUnknown = 0;
          (quarantineData || []).forEach((q) => {
            if (q.gender === "male") quarantineMales++;
            else if (q.gender === "female") quarantineFemales++;
            else quarantineUnknown++;
          });
          const quarantineTotal =
            quarantineMales + quarantineFemales + quarantineUnknown;

          setStats({
            total:
              list.length +
              youngTotal +
              paddockFemales +
              fatteningTotal +
              quarantineTotal,
            males: list.filter((r) => r.gender === "male").length,
            females: list.filter((r) => r.gender === "female").length,
            youngTotal,
            youngFromCages,
            youngFromPaddocks,
            paddockFemales,
            fatteningMales,
            fatteningFemales,
            fatteningUnknown,
            fatteningTotal,
            quarantineMales,
            quarantineFemales,
            quarantineUnknown,
            quarantineTotal,
          });
          setLoading(false);
        },
      );
    },
    [session.user.id],
  );

  const loadData = useCallback(() => {
    supabase
      .from("rabbits")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("is_active", true)
      .order("cage_number", { ascending: true })
      .then(({ data: rabbitsData }) => {
        const list = rabbitsData || [];
        setRabbits(list);
        loadStats(list);
      });
  }, [session.user.id, loadStats]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleAdd() {
    setSaving(true);
    setError("");
    const { error } = await supabase
      .from("rabbits")
      .insert({ ...form, user_id: session.user.id });
    if (error) {
      setError("Помилка збереження");
    } else {
      setForm(emptyForm);
      setShowForm(false);
      loadData();
    }
    setSaving(false);
  }

  async function confirmArchive() {
    if (!confirmArchiveId) return;
    await supabase
      .from("rabbits")
      .update({ is_active: false })
      .eq("id", confirmArchiveId);
    setConfirmArchiveId(null);
    loadData();
  }

  function downloadQr(rabbit: Rabbit) {
    const canvas = document.getElementById(
      `qr-canvas-${rabbit.id}`,
    ) as HTMLCanvasElement | null;
    if (!canvas) return;
    const link = document.createElement("a");
    const cageLabel = rabbit.cage_number
      ? `клітка-${rabbit.cage_number}`
      : rabbit.name;
    link.download = `qr-${cageLabel}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  const baseUrl = window.location.origin;

  async function handleSaveDisplayName() {
    setDisplayNameSaving(true);
    setDisplayNameError("");
    setDisplayNameSaved(false);
    const { error } = await supabase.auth.updateUser({
      data: { display_name: displayName.trim() },
    });
    if (error) {
      setDisplayNameError("Помилка збереження. Спробуй ще раз.");
    } else {
      setDisplayNameSaved(true);
      setTimeout(() => setDisplayNameSaved(false), 3000);
    }
    setDisplayNameSaving(false);
  }

  function exportCSV() {
    const headers = [
      "Кличка",
      "Стать",
      "Порода",
      "Дата нар.",
      "Клітка",
      "Нотатки",
    ];
    const rows = rabbits.map((r) => [
      r.name,
      r.gender === "female" ? "Самиця" : "Самець",
      r.breed || "",
      r.birth_date || "",
      r.cage_number || "",
      r.notes || "",
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `кролики-${new Date().toLocaleDateString("uk-UA")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="registry-page">
      {/* HELP MODAL */}
      {showHelp && (
        <div className="help-overlay" onClick={() => setShowHelp(false)}>
          <div className="help-modal" onClick={(e) => e.stopPropagation()}>
            <div className="help-modal-header">
              <h2>Як користуватись</h2>
              <button className="help-close" onClick={() => setShowHelp(false)}>
                ✕
              </button>
            </div>
            <div className="help-list">
              {helpItems.map((item) => (
                <div key={item.title} className="help-item">
                  <span className="help-icon">{item.icon}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* QR MODAL */}
      {showQrModal && (
        <div className="help-overlay" onClick={() => setShowQrModal(false)}>
          <div
            className="help-modal qr-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="help-modal-header">
              <h2>QR-коди кроликів</h2>
              <button
                className="help-close"
                onClick={() => setShowQrModal(false)}
              >
                ✕
              </button>
            </div>
            <p className="qr-modal-desc">
              Збережіть QR-код, роздрукуйте і прикріпіть на клітку. При
              скануванні відкриється паспорт кроля.
            </p>
            {rabbits.length === 0 ? (
              <p className="qr-modal-empty">Немає кроликів у реєстрі.</p>
            ) : (
              <div className="qr-grid">
                {rabbits.map((rabbit) => (
                  <div key={rabbit.id} className="qr-item">
                    <div className="qr-item-title">
                      {rabbit.cage_number
                        ? `Клітка № ${rabbit.cage_number}`
                        : rabbit.name}
                    </div>
                    <div className="qr-item-name">{rabbit.name}</div>
                    <QRCodeCanvas
                      id={`qr-canvas-${rabbit.id}`}
                      value={`${baseUrl}/rabbit/${rabbit.id}`}
                      size={180}
                      bgColor="#fffef5"
                      fgColor="#27500A"
                      level="H"
                      marginSize={2}
                    />
                    <button
                      className="qr-download-btn"
                      onClick={() => downloadQr(rabbit)}
                    >
                      Зберегти PNG
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="registry-header">
        <h1>🐇 Мої кролики</h1>
        <button
          className="registry-email"
          onClick={() => setShowSettings(true)}
          title="Налаштування"
        >
          {currentLabel}
        </button>
        <button
          className="registry-archive-link"
          onClick={() => navigate("/archive")}
        >
          📦 Архів
        </button>
        <button
          className="registry-archive-link"
          onClick={() => navigate("/matings")}
        >
          🐇 Розведення
        </button>
        <button
          className="registry-archive-link"
          onClick={() => navigate("/paddocks")}
        >
          🏠 Підлогове
        </button>
        <button
          className="registry-archive-link"
          onClick={() => navigate("/fattening")}
        >
          🥩 Відгодівля
        </button>
        <button
          className="registry-archive-link"
          onClick={() => navigate("/quarantine")}
        >
          🔒 Карантин
        </button>
        <button
          className="registry-archive-link"
          onClick={() => navigate("/statistics")}
        >
          📊 Статистика
        </button>
        <button
          className="registry-archive-link"
          onClick={() => navigate("/my-vaccinations")}
        >
          💉 Вакцинація
        </button>
        <button
          className="registry-archive-link"
          onClick={() => navigate("/my-treatments")}
        >
          💊 Пропойка
        </button>
        <button
          className="registry-archive-link qr-nav-btn"
          onClick={() => setShowQrModal(true)}
        >
          📷 QR-коди
        </button>
        <button className="registry-archive-link" onClick={exportCSV}>
          📥 Експорт CSV
        </button>
        <button className="registry-help-btn" onClick={() => setShowHelp(true)}>
          ? Довідка
        </button>
        <button
          className="registry-add-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "✕ Скасувати" : "+ Додати кролика"}
        </button>
      </div>

      <div className="registry-stats">
        <div className="registry-stat-card total">
          <span className="registry-stat-value">{stats.total}</span>
          <span className="registry-stat-label">Всього</span>
        </div>
        <div className="registry-stat-card male">
          <span className="registry-stat-value">{stats.males}</span>
          <span className="registry-stat-label">Самців</span>
        </div>
        <div className="registry-stat-card female">
          <span className="registry-stat-value">{stats.females}</span>
          <span className="registry-stat-label">Самиць</span>
        </div>
        <div className="registry-stat-card young">
          <span className="registry-stat-value">{stats.youngTotal}</span>
          <span className="registry-stat-label">Молодняк</span>
          {stats.youngFromCages > 0 && (
            <span className="registry-stat-sub">
              в маточ.: {stats.youngFromCages}
            </span>
          )}
          {stats.youngFromPaddocks > 0 && (
            <span className="registry-stat-sub">
              З підлог.: {stats.youngFromPaddocks}
            </span>
          )}
        </div>
        {stats.paddockFemales > 0 && (
          <div className="registry-stat-card paddock">
            <span className="registry-stat-value">{stats.paddockFemales}</span>
            <span className="registry-stat-label">Підлогове</span>
            <span className="registry-stat-sub">
              ♀ самок: {stats.paddockFemales}
            </span>
          </div>
        )}
        {stats.fatteningTotal > 0 && (
          <div className="registry-stat-card fattening">
            <span className="registry-stat-value">{stats.fatteningTotal}</span>
            <span className="registry-stat-label">Відгодівля</span>
            <span className="registry-stat-sub">
              {stats.fatteningMales > 0 && `♂ ${stats.fatteningMales} `}
              {stats.fatteningFemales > 0 && `♀ ${stats.fatteningFemales} `}
              {stats.fatteningUnknown > 0 && `? ${stats.fatteningUnknown}`}
            </span>
          </div>
        )}
        <div className="registry-stat-card quarantine">
          <span className="registry-stat-value">{stats.quarantineTotal}</span>
          <span className="registry-stat-label">Карантин</span>
          {stats.quarantineTotal > 0 && (
            <span className="registry-stat-sub">
              {stats.quarantineMales > 0 && `♂ ${stats.quarantineMales} `}
              {stats.quarantineFemales > 0 && `♀ ${stats.quarantineFemales} `}
              {stats.quarantineUnknown > 0 && `? ${stats.quarantineUnknown}`}
            </span>
          )}
        </div>
      </div>

      {showForm && (
        <div className="registry-form">
          <h2>Новий кролик</h2>
          <div className="registry-form-grid">
            <input
              placeholder="Кличка *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              placeholder="Порода"
              value={form.breed}
              onChange={(e) => setForm({ ...form, breed: e.target.value })}
            />
            <select
              value={form.gender}
              onChange={(e) =>
                setForm({
                  ...form,
                  gender: e.target.value as "male" | "female",
                })
              }
            >
              <option value="female">Самиця</option>
              <option value="male">Самець</option>
            </select>
            <input
              type="date"
              value={form.birth_date}
              onChange={(e) => setForm({ ...form, birth_date: e.target.value })}
            />
            <input
              placeholder="Номер клітки"
              value={form.cage_number}
              onChange={(e) =>
                setForm({ ...form, cage_number: e.target.value })
              }
            />
            <input
              placeholder="Нотатки"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          {error && <p className="registry-error">{error}</p>}
          <button
            className="registry-save-btn"
            onClick={handleAdd}
            disabled={saving || !form.name}
          >
            {saving ? "Збереження..." : "Зберегти"}
          </button>
        </div>
      )}

      {loading ? (
        <div className="registry-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : rabbits.length === 0 ? (
        <div className="registry-empty-state">
          <div className="registry-empty-illustration">🐇</div>
          <h3 className="registry-empty-title">Поки що кроликів немає</h3>
          <p className="registry-empty-desc">
            Додайте першого кролика — вкажіть кличку, породу, клітку і дату
            народження.
          </p>
          <button
            className="registry-add-btn"
            onClick={() => setShowForm(true)}
          >
            + Додати кролика
          </button>
        </div>
      ) : (
        <div className="registry-grid">
          {rabbits.map((rabbit) => (
            <div key={rabbit.id} className="rabbit-card">
              <div className="rabbit-card-header">
                <span className="rabbit-gender">
                  {rabbit.gender === "female" ? "♀" : "♂"}
                </span>
                <h3>{rabbit.name}</h3>
                {rabbit.cage_number && (
                  <span className="rabbit-cage">
                    Клітка {rabbit.cage_number}
                  </span>
                )}
              </div>
              <div className="rabbit-card-body">
                {rabbit.breed && (
                  <p>
                    <strong>Порода:</strong> {rabbit.breed}
                  </p>
                )}
                {rabbit.birth_date &&
                  (() => {
                    const birth = new Date(rabbit.birth_date);
                    const today = new Date();
                    const days = Math.floor(
                      (today.getTime() - birth.getTime()) /
                        (1000 * 60 * 60 * 24),
                    );
                    const months = Math.floor(days / 30);
                    const years = Math.floor(days / 365);
                    let age = "";
                    if (years >= 1) {
                      const remMonths = Math.floor((days - years * 365) / 30);
                      age =
                        remMonths > 0
                          ? `${years} р. ${remMonths} міс.`
                          : `${years} р.`;
                    } else if (months >= 1) {
                      const remDays = days - months * 30;
                      age =
                        remDays > 0
                          ? `${months} міс. ${remDays} дн.`
                          : `${months} міс.`;
                    } else {
                      age = `${days} дн.`;
                    }
                    return (
                      <>
                        <p>
                          <strong>Нар.:</strong>{" "}
                          {birth.toLocaleDateString("uk-UA")}
                        </p>
                        <p className="rabbit-age">Вік: {age}</p>
                      </>
                    );
                  })()}
                {rabbit.notes && <p className="rabbit-notes">{rabbit.notes}</p>}
              </div>
              <div className="rabbit-card-actions">
                <button
                  className="rabbit-edit-btn"
                  onClick={() => navigate(`/registry/edit/${rabbit.id}`)}
                >
                  Редагувати
                </button>
                <button
                  className="rabbit-archive-btn"
                  onClick={() => setConfirmArchiveId(rabbit.id)}
                >
                  Архівувати
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Зноска: вік утримання у племінному стаді ── */}
      <div className="registry-info">
        <button
          className="registry-info-toggle"
          onClick={() => setShowInfo(!showInfo)}
        >
          <span>📋 Рекомендований вік утримання у племінному стаді</span>
          <span>{showInfo ? "▲" : "▼"}</span>
        </button>

        {showInfo && (
          <>
            <p className="registry-info-text">
              Правильний підбір племінних тварин за віком безпосередньо впливає
              на якість потомства та продуктивність стада.
            </p>

            <div className="registry-info-grid">
              <div className="registry-info-item">
                <span className="registry-info-icon">♀</span>

                <div>
                  <strong>Самки — перша злучка</strong>

                  <span>Середні породи: 5–6 міс., вага не менше 2,5 кг</span>

                  <span>
                    Великі породи (Фландр, Велетень): 6–7 міс., від 3,5 кг
                  </span>

                  <span className="registry-info-badge">
                    після першої линьки
                  </span>
                </div>
              </div>

              <div className="registry-info-item">
                <span className="registry-info-icon">♂</span>

                <div>
                  <strong>Самці — перша злучка</strong>

                  <span>Середні породи: 6–7 міс.</span>

                  <span>Великі породи: 7–8 міс.</span>

                  <span className="registry-info-badge">
                    після другої линьки
                  </span>
                </div>
              </div>

              <div className="registry-info-item">
                <span className="registry-info-icon">📅</span>

                <div>
                  <strong>Самки — строк використання</strong>

                  <span>В середньому 3 роки у продуктивному стаді</span>

                  <span>За хорошого здоров'я — до 4–5 років</span>

                  <span className="registry-info-badge">
                    вибраковка після 3 р.
                  </span>
                </div>
              </div>

              <div className="registry-info-item">
                <span className="registry-info-icon">📅</span>

                <div>
                  <strong>Самці — строк використання</strong>

                  <span>Зазвичай не більше 3 років</span>

                  <span>1 самець на 8–10 самок</span>

                  <span className="registry-info-badge">
                    вибраковка після 3 р.
                  </span>
                </div>
              </div>
            </div>

            <div className="registry-info-warning">
              ⚠️ <strong>Підбір пар:</strong> За молодими самками закріплюють
              старшого самця, за старими — молодого. Не допускайте до злучки
              тварин, які не досягли 2/3 живої маси дорослих особин своєї
              породи.
            </div>

            <div className="registry-info-success">
              ✅ <strong>Причини дострокового вибракування самок:</strong> з'їла
              кроленят двічі поспіль, не завагітніла після контрольної злучки,
              менше 4–5 кроленят в двох окролах поспіль, погане здоров'я або
              надмірна агресивність.
            </div>
          </>
        )}
      </div>
      {showSettings && (
        <div className="help-overlay" onClick={() => setShowSettings(false)}>
          <div
            className="help-modal settings-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="help-modal-header">
              <h2>⚙️ Налаштування</h2>
              <button
                className="help-close"
                onClick={() => setShowSettings(false)}
              >
                ✕
              </button>
            </div>
            <div className="settings-body">
              <label className="settings-label">
                Відображуване ім'я або назва господарства
              </label>
              <p className="settings-hint">
                Замінить електронну пошту у заголовку. Наприклад: «Вухані у
                Петровича» або «ФГ Прозоро».
              </p>
              <input
                className="settings-input"
                type="text"
                placeholder="Введіть нік або назву..."
                value={displayName}
                maxLength={60}
                onChange={(e) => setDisplayName(e.target.value)}
              />
              {displayNameError && (
                <p className="settings-error">{displayNameError}</p>
              )}
              {displayNameSaved && (
                <p className="settings-success">✓ Збережено</p>
              )}
              <div className="settings-actions">
                <button
                  className="registry-save-btn"
                  onClick={handleSaveDisplayName}
                  disabled={displayNameSaving}
                >
                  {displayNameSaving ? "Збереження..." : "Зберегти"}
                </button>
                <button
                  className="registry-archive-link"
                  onClick={() => setShowSettings(false)}
                >
                  Закрити
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {confirmArchiveId && (
        <div className="help-overlay" onClick={() => setConfirmArchiveId(null)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <p className="confirm-text">Архівувати цього кролика?</p>
            <div className="confirm-actions">
              <button
                className="confirm-cancel"
                onClick={() => setConfirmArchiveId(null)}
              >
                Скасувати
              </button>
              <button className="confirm-ok" onClick={confirmArchive}>
                Архівувати
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
