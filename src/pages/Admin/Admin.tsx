import { useEffect, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import { createClient } from "@supabase/supabase-js";
import "./Admin.css";

const adminSupabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      storageKey: "admin-presence-client",
      persistSession: false,
    },
  },
);

interface Props {
  session: Session;
}

interface InviteCode {
  id: string;
  code: string;
  is_used: boolean;
  used_by: string | null;
  created_at: string;
}

interface Profile {
  id: string;
  email: string | null;
  created_at: string;
  access_until: string | null;
  plan_type: "trial" | "paid" | "founder";
}

interface RegisteredUser {
  id: string;
  email: string;
  created_at: string;
  invite_code: string | null;
  invite_code_id: string | null;
  access_until: string | null;
  plan_type: "trial" | "paid" | "founder";
}

interface DeactivatedUser {
  id: string;
  email: string;
}

interface LeadRow {
  id: string;
  email: string;
  source: string;
  created_at: string;
}

interface NpsFeedbackRow {
  id: string;
  score: number;
  category: "detractor" | "passive" | "promoter";
  comment: string | null;
  created_at: string;
}

interface TableStat {
  name: string;
  label: string;
  count: number;
}

interface BackendStats {
  dbSizeBytes: number | null;
  tableCounts: TableStat[];
  totalUsers: number;
  totalCodes: number;
  usedCodes: number;
  freeCodes: number;
}

interface UserDataUsage {
  userId: string;
  email: string | null;
  totalBytes: number;
}

interface OnlineVisitor {
  session_id: string;
  page: string;
  joined_at: string;
}

const DB_LIMIT_BYTES = 500 * 1024 * 1024;
const MAU_LIMIT = 50000;
const PRESENCE_CHANNEL = "public-site-presence";

// Замінив існуючий масив TABLE_LIST у Admin.tsx на цей.
// Відповідає оновленій get_table_counts() у базі (weight_log -> weighings,
// плюс усі таблиці, яких раніше не було в підрахунку).
const TABLE_LIST: { name: string; label: string }[] = [
  { name: "rabbits", label: "Кролики" },
  { name: "matings", label: "Парування" },
  { name: "litters", label: "Окроли" },
  { name: "fattening", label: "Відгодівля" },
  { name: "quarantine", label: "Карантин" },
  { name: "paddocks", label: "Вольєри" },
  { name: "paddock_matings", label: "Вольєр. парування" },
  { name: "paddock_litters", label: "Вольєр. окроли" },
  { name: "paddock_females", label: "Вольєр. самки" },
  { name: "weighings", label: "Вага" },
  { name: "health_log", label: "Здоров'я" },
  { name: "treatments", label: "Лікування" },
  { name: "vaccinations", label: "Вакцинації" },
  { name: "medication_batches", label: "Аптечка" },
  { name: "cage_disinfections", label: "Дезінфекція" },
  { name: "sales", label: "Продажі" },
  { name: "expenses", label: "Витрати" },
  { name: "other_income", label: "Інші доходи" },
  { name: "grain_recipes", label: "Рецепти гранул" },
  { name: "profiles", label: "Профілі" },
  { name: "invite_codes", label: "Інвайт коди" },
];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} МБ`;
}

function UsageBar({
  used,
  total,
  label,
  color = "#4caf50",
}: {
  used: number;
  total: number;
  label: string;
  color?: string;
}) {
  const pct = Math.min((used / total) * 100, 100);
  const isWarn = pct >= 70;
  const isDanger = pct >= 90;
  const barColor = isDanger ? "#e53935" : isWarn ? "#ff9800" : color;

  return (
    <div className="stats-bar-row">
      <div className="stats-bar-label">{label}</div>
      <div className="stats-bar-track">
        <div
          className="stats-bar-fill"
          style={{ width: `${pct}%`, background: barColor }}
        />
      </div>
      <div className="stats-bar-pct">{pct.toFixed(1)}%</div>
    </div>
  );
}

export default function Admin({ session }: Props) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [codes, setCodes] = useState<InviteCode[]>([]);
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [deactivated, setDeactivated] = useState<DeactivatedUser[]>([]);
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [npsFeedback, setNpsFeedback] = useState<NpsFeedbackRow[]>([]);
  const [npsLoading, setNpsLoading] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<BackendStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [onlineVisitors, setOnlineVisitors] = useState<OnlineVisitor[]>([]);
  const [userUsage, setUserUsage] = useState<UserDataUsage[]>([]);
  const [userUsageLoading, setUserUsageLoading] = useState(false);
  const [tablesOpen, setTablesOpen] = useState(false);
  const presenceChannelRef = useRef<ReturnType<
    typeof adminSupabase.channel
  > | null>(null);

  async function fetchCodes() {
    const { data } = await supabase
      .from("invite_codes")
      .select("*")
      .order("created_at", { ascending: false });
    setCodes(data || []);
    return data || [];
  }

  async function fetchUsers(allCodes: InviteCode[]) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, email, created_at, access_until, plan_type");

    if (profiles && profiles.length > 0) {
      const usedCodes = allCodes.filter((c) => c.is_used);
      const mapped: RegisteredUser[] = profiles.map((p: Profile) => {
        const matchedCode = usedCodes.find((c) => c.used_by === p.id);
        return {
          id: p.id,
          email: p.email || "—",
          created_at: p.created_at,
          invite_code: matchedCode?.code || "—",
          invite_code_id: matchedCode?.id || null,
          access_until: p.access_until,
          plan_type: p.plan_type,
        };
      });
      setUsers(mapped);
    } else {
      setUsers([]);
    }
  }

  // Позначити користувача як пробного/платного (лише мітка для адмінки,
  // на блокування доступу не впливає — те регулюється access_until)
  async function handleSetPlanType(
    userId: string,
    planType: "trial" | "paid" | "founder",
  ) {
    const target = users.find((u) => u.id === userId);
    const previousPlanType = target?.plan_type;

    const { error } = await supabase
      .from("profiles")
      .update({ plan_type: planType })
      .eq("id", userId);
    if (error) {
      console.error("Не вдалося оновити тип плану:", error);
      setError("Не вдалося оновити тип плану");
      return;
    }

    // Додано: лист про активацію підписки при переведенні на "Платний"
    if (planType === "paid") {
      if (target?.email && target.email !== "—") {
        fetch("/api/notify-subscription-activated", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ email: target.email }),
        }).catch((err) =>
          console.error(
            "Не вдалося надіслати лист про активацію підписки:",
            err,
          ),
        );

        // Додано: разом з активацією — квитанція про оплату (фіксована ціна
        // з env, бо реальної платіжки поки немає)
        fetch("/api/notify-payment-receipt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ email: target.email }),
        }).catch((err) =>
          console.error("Не вдалося надіслати квитанцію про оплату:", err),
        );
      }
    }

    // Додано: лист про скасування підписки — лише якщо реально був перехід
    // з платного/засновницького типу назад на пробний, а не повторний вибір
    // "Пробний" для того, хто вже й так пробний
    if (
      planType === "trial" &&
      previousPlanType &&
      previousPlanType !== "trial"
    ) {
      if (target?.email && target.email !== "—") {
        fetch("/api/notify-subscription-cancelled", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ email: target.email }),
        }).catch((err) =>
          console.error(
            "Не вдалося надіслати лист про скасування підписки:",
            err,
          ),
        );
      }
    }

    const allCodes = await fetchCodes();
    await fetchUsers(allCodes);
  }

  // Оновити дату доступу (порожньо/null = безстроково)
  async function handleSetAccessUntil(userId: string, dateValue: string) {
    const isoValue = dateValue ? new Date(dateValue).toISOString() : null;
    const { error } = await supabase
      .from("profiles")
      .update({ access_until: isoValue })
      .eq("id", userId);
    if (error) {
      console.error("Не вдалося оновити термін доступу:", error);
      setError("Не вдалося оновити термін доступу");
      return;
    }
    const allCodes = await fetchCodes();
    await fetchUsers(allCodes);
  }

  // Швидка кнопка: +1 місяць від сьогодні
  async function handleGrantOneMonth(userId: string) {
    const until = new Date();
    until.setMonth(until.getMonth() + 1);
    await handleSetAccessUntil(userId, until.toISOString().slice(0, 10));
  }

  // Прибрати обмеження — безстроковий доступ
  async function handleMakeUnlimited(userId: string) {
    await handleSetAccessUntil(userId, "");
  }

  async function fetchDeactivated() {
    const { data } = await supabase.rpc("get_deactivated_users");
    setDeactivated(data || []);
  }

  async function fetchLeads() {
    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    setLeads(data || []);
  }

  async function fetchNpsFeedback() {
    setNpsLoading(true);
    const { data, error: rpcError } = await supabase
      .from("nps_feedback")
      .select("*")
      .order("created_at", { ascending: false });
    if (rpcError) {
      console.error("Не вдалося завантажити NPS-відгуки:", rpcError);
      setNpsFeedback([]);
    } else {
      setNpsFeedback(data || []);
    }
    setNpsLoading(false);
  }

  async function fetchStats(allCodes: InviteCode[], userCount: number) {
    setStatsLoading(true);

    let dbSizeBytes: number | null = null;
    const { data: sizeData } = await supabase.rpc("get_db_size");
    if (typeof sizeData === "number") dbSizeBytes = sizeData;

    const tableCounts: TableStat[] = [];
    const { data: countsData } = await supabase.rpc("get_table_counts");
    if (countsData) {
      for (const t of TABLE_LIST) {
        tableCounts.push({
          name: t.name,
          label: t.label,
          count: Number(countsData[t.name] ?? 0),
        });
      }
    } else {
      for (const t of TABLE_LIST) {
        tableCounts.push({ name: t.name, label: t.label, count: 0 });
      }
    }

    const usedCodes = allCodes.filter((c) => c.is_used).length;

    setStats({
      dbSizeBytes,
      tableCounts,
      totalUsers: userCount,
      totalCodes: allCodes.length,
      usedCodes,
      freeCodes: allCodes.length - usedCodes,
    });
    setStatsLoading(false);
  }

  async function fetchUserUsage() {
    setUserUsageLoading(true);
    const { data, error: rpcError } = await supabase.rpc("get_user_data_usage");
    if (rpcError) {
      console.error(
        "Не вдалося завантажити використання по користувачах:",
        rpcError,
      );
      setUserUsage([]);
    } else if (data) {
      setUserUsage(
        data.map(
          (row: {
            user_id: string;
            email: string | null;
            total_bytes: number;
          }) => ({
            userId: row.user_id,
            email: row.email,
            totalBytes: Number(row.total_bytes ?? 0),
          }),
        ),
      );
    }
    setUserUsageLoading(false);
  }

  useEffect(() => {
    supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", session.user.id)
      .single()
      .then(
        async ({ data }) => {
          if (data) {
            setIsAdmin(true);
            const allCodes = await fetchCodes();
            await fetchUsers(allCodes);
            await fetchDeactivated();
            await fetchLeads();
            await fetchNpsFeedback();
            const { count: profileCount } = await supabase
              .from("profiles")
              .select("*", { count: "exact", head: true });
            await fetchStats(allCodes, profileCount ?? 0);
            await fetchUserUsage();
          }
          setLoading(false);
        },
        (err) => {
          console.error("Не вдалося завантажити дані адмін-панелі:", err);
          setLoading(false);
        },
      );
  }, [session.user.id]);

  useEffect(() => {
    if (!isAdmin) return;

    const channel = adminSupabase.channel(PRESENCE_CHANNEL);

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState<OnlineVisitor>();
        const visitors = Object.values(state).flat();
        setOnlineVisitors(visitors);
      })
      .subscribe();

    presenceChannelRef.current = channel;

    return () => {
      adminSupabase.removeChannel(channel);
    };
  }, [isAdmin]);

  async function handleAdd() {
    if (!newCode.trim()) return;
    setError("");
    const { error } = await supabase
      .from("invite_codes")
      .insert({ code: newCode.trim().toUpperCase() });
    if (error) {
      setError("Код вже існує або помилка збереження");
    } else {
      setNewCode("");
      const allCodes = await fetchCodes();
      await fetchUsers(allCodes);
    }
  }

  async function handleDelete(id: string) {
    await supabase.from("invite_codes").delete().eq("id", id);
    const allCodes = await fetchCodes();
    await fetchUsers(allCodes);
  }

  async function handleDeleteUser(user: RegisteredUser) {
    const confirm = window.confirm(
      `Видалити користувача ${user.email}?\nВін втратить доступ до додатку.`,
    );
    if (!confirm) return;

    await supabase.from("profiles").delete().eq("id", user.id);

    if (user.invite_code_id) {
      await supabase
        .from("invite_codes")
        .update({ is_used: false, used_by: null })
        .eq("id", user.invite_code_id);
    }

    const allCodes = await fetchCodes();
    await fetchUsers(allCodes);
    await fetchDeactivated();
  }

  async function handleRestoreUser(user: DeactivatedUser) {
    const confirm = window.confirm(`Відновити доступ для ${user.email}?`);
    if (!confirm) return;

    await supabase.from("profiles").insert({ id: user.id, email: user.email });

    const allCodes = await fetchCodes();
    await fetchUsers(allCodes);
    await fetchDeactivated();
  }

  function generateCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "KROL-";
    for (let i = 0; i < 8; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    setNewCode(code);
  }

  if (loading) return <p style={{ padding: "2rem" }}>Завантаження...</p>;
  if (!isAdmin) return <p style={{ padding: "2rem" }}>Доступ заборонено.</p>;

  const npsTotal = npsFeedback.length;
  const npsPromoters = npsFeedback.filter(
    (f) => f.category === "promoter",
  ).length;
  const npsPassives = npsFeedback.filter(
    (f) => f.category === "passive",
  ).length;
  const npsDetractors = npsFeedback.filter(
    (f) => f.category === "detractor",
  ).length;
  const npsAverage =
    npsTotal > 0
      ? (npsFeedback.reduce((sum, f) => sum + f.score, 0) / npsTotal).toFixed(1)
      : "—";
  const npsScore =
    npsTotal > 0
      ? Math.round(((npsPromoters - npsDetractors) / npsTotal) * 100)
      : null;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>⚙️ Адмін панель</h1>
      </div>

      {/* Онлайн відвідувачі довідника */}
      <div className="admin-section">
        <h2>
          🟢 Зараз онлайн у довіднику{" "}
          <span className="admin-count">{onlineVisitors.length}</span>
        </h2>

        {onlineVisitors.length === 0 ? (
          <p className="online-empty">Немає активних відвідувачів</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Сторінка</th>
                  <th>Зайшов</th>
                </tr>
              </thead>
              <tbody>
                {onlineVisitors.map((v, i) => (
                  <tr key={v.session_id}>
                    <td>{i + 1}</td>
                    <td className="online-page">{v.page || "/"}</td>
                    <td>
                      {new Date(v.joined_at).toLocaleTimeString("uk-UA", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Статистика бекенду */}
      <div className="admin-section">
        <h2>📊 Статистика бекенду (Supabase Free)</h2>

        {statsLoading ? (
          <p style={{ opacity: 0.6 }}>Завантаження статистики...</p>
        ) : stats ? (
          <>
            <div className="stats-limits">
              <div className="stats-limit-card">
                <div className="stats-limit-title">База даних</div>
                <div className="stats-limit-value">
                  {stats.dbSizeBytes !== null
                    ? formatBytes(stats.dbSizeBytes)
                    : "—"}
                </div>
                <div className="stats-limit-max">ліміт 500 МБ</div>
                {stats.dbSizeBytes !== null && (
                  <UsageBar
                    used={stats.dbSizeBytes}
                    total={DB_LIMIT_BYTES}
                    label=""
                  />
                )}
              </div>

              <div className="stats-limit-card">
                <div className="stats-limit-title">Користувачі</div>
                <div className="stats-limit-value">{stats.totalUsers}</div>
                <div className="stats-limit-max">
                  ліміт {MAU_LIMIT.toLocaleString()} MAU
                </div>
                <UsageBar
                  used={stats.totalUsers}
                  total={MAU_LIMIT}
                  label=""
                  color="#2196f3"
                />
              </div>

              <div className="stats-limit-card">
                <div className="stats-limit-title">Файлове сховище</div>
                <div className="stats-limit-value">1 ГБ</div>
                <div className="stats-limit-max">ліміт 1 ГБ</div>
                <div className="stats-limit-note">
                  Моніторинг — у Supabase Dashboard
                </div>
              </div>

              <div className="stats-limit-card">
                <div className="stats-limit-title">Bandwidth</div>
                <div className="stats-limit-value">10 ГБ</div>
                <div className="stats-limit-max">ліміт / місяць</div>
                <div className="stats-limit-note">
                  Моніторинг — у Supabase Dashboard
                </div>
              </div>
            </div>

            {/* Записи у таблицях — акордеон (згорнуто за замовчуванням) */}
            <div className="stats-tables">
              <button
                type="button"
                className="stats-tables-title stats-tables-toggle"
                onClick={() => setTablesOpen((open) => !open)}
                aria-expanded={tablesOpen}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  font: "inherit",
                  color: "inherit",
                }}
              >
                <span>Записи у таблицях</span>
                <span
                  aria-hidden="true"
                  style={{
                    display: "inline-block",
                    transition: "transform 0.2s ease",
                    transform: tablesOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  ▾
                </span>
              </button>

              {tablesOpen && (
                <div className="stats-tables-grid">
                  {stats.tableCounts.map((t) => (
                    <div key={t.name} className="stats-table-card">
                      <div className="stats-table-label">{t.label}</div>
                      <div className="stats-table-count">{t.count}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <p style={{ opacity: 0.6 }}>Статистика недоступна</p>
        )}
      </div>

      {/* Використання по користувахах */}
      <div className="admin-section">
        <h2>
          💾 Використання по користувачах{" "}
          <span className="admin-count">{userUsage.length}</span>
        </h2>

        {userUsageLoading ? (
          <p style={{ opacity: 0.6 }}>Завантаження...</p>
        ) : userUsage.length === 0 ? (
          <p style={{ opacity: 0.6 }}>Немає даних</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Email</th>
                  <th>Обсяг даних</th>
                </tr>
              </thead>
              <tbody>
                {userUsage.map((u, i) => (
                  <tr key={u.userId}>
                    <td>{i + 1}</td>
                    <td>{u.email || "—"}</td>
                    <td>{formatBytes(u.totalBytes)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Опитування NPS */}
      <div className="admin-section">
        <h2>
          ⭐ Опитування NPS{" "}
          <span className="admin-count">{npsFeedback.length}</span>
        </h2>

        {npsTotal > 0 && (
          <>
            <div className="stats-limits">
              <div className="stats-limit-card">
                <div className="stats-limit-title">Середня оцінка</div>
                <div className="stats-limit-value">{npsAverage}</div>
                <div className="stats-limit-max">з 10</div>
              </div>
              <div className="stats-limit-card">
                <div className="stats-limit-title">NPS-індекс</div>
                <div className="stats-limit-value">{npsScore}</div>
                <div className="stats-limit-max">
                  % промоутерів − % детракторів
                </div>
              </div>
            </div>

            <div className="stats-codes-row">
              <div className="stats-code-badge free">
                Промоутери (9–10): <strong>{npsPromoters}</strong>
              </div>
              <div className="stats-code-badge used">
                Нейтральні (7–8): <strong>{npsPassives}</strong>
              </div>
              <div className="stats-code-badge detractor">
                Детрактори (0–6): <strong>{npsDetractors}</strong>
              </div>
            </div>
          </>
        )}

        {npsLoading ? (
          <p style={{ opacity: 0.6 }}>Завантаження...</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Оцінка</th>
                  <th>Коментар</th>
                  <th>Дата</th>
                </tr>
              </thead>
              <tbody>
                {npsFeedback.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      style={{ textAlign: "center", opacity: 0.5 }}
                    >
                      Ще немає відповідей
                    </td>
                  </tr>
                ) : (
                  npsFeedback.map((f, i) => (
                    <tr key={f.id}>
                      <td>{i + 1}</td>
                      <td>
                        <span
                          className={`nps-score-badge nps-score-badge--${f.category}`}
                        >
                          {f.score}
                        </span>
                      </td>
                      <td>{f.comment || "—"}</td>
                      <td>
                        {new Date(f.created_at).toLocaleDateString("uk-UA")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ліди з лід-магніту */}
      <div className="admin-section">
        <h2>
          📧 Ліди (лід-магніт){" "}
          <span className="admin-count">{leads.length}</span>
        </h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Джерело</th>
                <th>Дата</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", opacity: 0.5 }}>
                    Ще немає лідів
                  </td>
                </tr>
              ) : (
                leads.map((lead, i) => (
                  <tr key={lead.id}>
                    <td>{i + 1}</td>
                    <td>{lead.email}</td>
                    <td className="code-text">{lead.source}</td>
                    <td>
                      {new Date(lead.created_at).toLocaleDateString("uk-UA")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Активні користувачі */}
      <div className="admin-section">
        <h2>
          👥 Зареєстровані користувачі{" "}
          <span className="admin-count">{users.length}</span>
        </h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Інвайт код</th>
                <th>Дата реєстрації</th>
                <th>Тип</th>
                <th>Доступ до</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", opacity: 0.5 }}>
                    Немає користувачів
                  </td>
                </tr>
              ) : (
                users.map((user, i) => {
                  const isExpired =
                    !!user.access_until &&
                    new Date(user.access_until) < new Date();
                  return (
                    <tr key={user.id}>
                      <td>{i + 1}</td>
                      <td>{user.email}</td>
                      <td className="code-text">{user.invite_code}</td>
                      <td>
                        {new Date(user.created_at).toLocaleDateString("uk-UA")}
                      </td>
                      <td>
                        <select
                          id={`plan-type-${user.id}`}
                          name={`plan-type-${user.id}`}
                          className="access-plan-select"
                          value={user.plan_type}
                          onChange={(e) =>
                            handleSetPlanType(
                              user.id,
                              e.target.value as "trial" | "paid" | "founder",
                            )
                          }
                        >
                          <option value="trial">Пробний</option>
                          <option value="paid">Платний</option>
                          <option value="founder">Засновник</option>
                        </select>
                      </td>
                      <td>
                        {user.access_until ? (
                          <span
                            className={`code-status access-status ${isExpired ? "used" : "free"}`}
                            title={new Date(user.access_until).toLocaleString(
                              "uk-UA",
                            )}
                          >
                            {new Date(user.access_until).toLocaleDateString(
                              "uk-UA",
                            )}
                            {isExpired ? " (прострочено)" : ""}
                          </span>
                        ) : (
                          <span className="code-status access-status free">
                            Безстроково
                          </span>
                        )}
                        <div className="access-controls">
                          <input
                            id={`access-until-${user.id}`}
                            name={`access-until-${user.id}`}
                            type="date"
                            className="access-date-input"
                            defaultValue={
                              user.access_until
                                ? user.access_until.slice(0, 10)
                                : ""
                            }
                            onChange={(e) =>
                              handleSetAccessUntil(user.id, e.target.value)
                            }
                          />
                          <button
                            className="admin-btn-add access-btn-mini"
                            title="Продовжити на 1 місяць від сьогодні"
                            onClick={() => handleGrantOneMonth(user.id)}
                          >
                            +1 міс
                          </button>
                          {user.access_until && (
                            <button
                              className="admin-btn-generate access-btn-mini"
                              title="Зробити безстроковим"
                              onClick={() => handleMakeUnlimited(user.id)}
                            >
                              ∞
                            </button>
                          )}
                        </div>
                      </td>
                      <td>
                        {user.id !== session.user.id && (
                          <button
                            className="admin-btn-delete"
                            onClick={() => handleDeleteUser(user)}
                          >
                            Видалити
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Деактивовані користувачі */}
      {deactivated.length > 0 && (
        <div className="admin-section">
          <h2>
            🔒 Деактивовані користувачі{" "}
            <span className="admin-count">{deactivated.length}</span>
          </h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Email</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {deactivated.map((user, i) => (
                  <tr key={user.id}>
                    <td>{i + 1}</td>
                    <td>{user.email}</td>
                    <td>
                      <button
                        className="admin-btn-add"
                        onClick={() => handleRestoreUser(user)}
                      >
                        Відновити
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Інвайт коди */}
      <div className="admin-section">
        <h2>🎟️ Інвайт коди</h2>

        {stats && (
          <div className="stats-codes-row">
            <div className="stats-code-badge total">
              Всього кодів: <strong>{stats.totalCodes}</strong>
            </div>
            <div className="stats-code-badge used">
              Використано: <strong>{stats.usedCodes}</strong>
            </div>
            <div className="stats-code-badge free">
              Вільних: <strong>{stats.freeCodes}</strong>
            </div>
          </div>
        )}

        <div className="admin-add">
          <input
            id="new-invite-code"
            name="newInviteCode"
            placeholder="Новий код"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value.toUpperCase())}
          />
          <button className="admin-btn-generate" onClick={generateCode}>
            Генерувати
          </button>
          <button
            className="admin-btn-add"
            onClick={handleAdd}
            disabled={!newCode.trim()}
          >
            Додати
          </button>
        </div>

        {error && <p className="admin-error">{error}</p>}

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Код</th>
                <th>Статус</th>
                <th>Створено</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {codes.map((code) => (
                <tr key={code.id} className={code.is_used ? "used" : ""}>
                  <td className="code-text">{code.code}</td>
                  <td>
                    <span
                      className={`code-status ${code.is_used ? "used" : "free"}`}
                    >
                      {code.is_used ? "Використано" : "Вільний"}
                    </span>
                  </td>
                  <td>
                    {new Date(code.created_at).toLocaleDateString("uk-UA")}
                  </td>
                  <td>
                    {!code.is_used && (
                      <button
                        className="admin-btn-delete"
                        onClick={() => handleDelete(code.id)}
                      >
                        Видалити
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Документація: як працюють email-сповіщення */}
      <div className="admin-section">
        <h2>📧 Документація — Email-сповіщення</h2>

        <details className="docs-details">
          <summary className="docs-summary">
            Як це працює (натисніть, щоб розгорнути)
          </summary>

          <div className="docs-body">
            <p>
              <strong>Автоматично, без участі (щодня о 08:00):</strong>
            </p>
            <ul>
              <li>нагадування про пробний період за 3 дні до кінця</li>
              <li>лист "пробний завершено" у день завершення</li>
              <li>
                прохання відгуку через 2 дні після пробного (якщо не оформив
                підписку)
              </li>
              <li>реактивація неактивних (14 днів без входу)</li>
              <li>
                нагадування про кінець оплаченого доступу за 3 дні (тип
                "Платний", не "Засновник")
              </li>
            </ul>

            <p>
              <strong>
                За вашою дією в адмінці (не саме по собі — тригер це ваш клік):
              </strong>
            </p>
            <ul>
              <li>
                Коли у випадаючому списку "Тип" нижче вибираєте{" "}
                <strong>"Платний"</strong> — в момент цього кліку відбувається
                одразу три речі: в базі змінюється
                <code>plan_type</code> на <code>paid</code>, автоматично йде
                лист "Вашу підписку активовано!", і додатково йде ще один
                окремий лист — квитанція, з сьогоднішньою датою, фіксованою
                ціною і фразою "переказ на картку". Людина отримує обидва листи
                майже одночасно.
              </li>
              <li>
                При поверненні типу назад на <strong>"Пробний"</strong> (з
                "Платного" чи "Засновника") — тим самим кліком іде лист про
                скасування підписки.
              </li>
            </ul>

            <p>
              <strong>Вручну, командою в терміналі:</strong>
            </p>
            <ul>
              <li>
                анонс нової функції всім користувачам:{" "}
                <code>node scripts/announce-feature.mjs "опис"</code>
              </li>
              <li>
                тест окремого шаблону на одну адресу:{" "}
                <code>
                  node scripts/test-send-email.mjs файл.html "Тема" email
                </code>
              </li>
            </ul>

            <p>
              <strong>⚠️ Не забути:</strong>
            </p>
            <ul>
              <li>
                Ціна підписки в листах-нагадуваннях і квитанціях береться зі
                змінної <code>SUBSCRIPTION_PRICE</code> у Vercel (Settings →
                Environment Variables), а не з коду. Якщо міняється вартість
                підписки — треба вручну оновити значення там (наприклад{" "}
                <code>99 грн/міс</code>), інакше в листах лишиться стара ціна.
              </li>
            </ul>
          </div>
        </details>
      </div>
    </div>
  );
}
