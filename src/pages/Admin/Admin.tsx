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
}

interface RegisteredUser {
  id: string;
  email: string;
  created_at: string;
  invite_code: string | null;
  invite_code_id: string | null;
}

interface DeactivatedUser {
  id: string;
  email: string;
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

interface OnlineVisitor {
  session_id: string;
  page: string;
  joined_at: string;
}

const DB_LIMIT_BYTES = 500 * 1024 * 1024;
const MAU_LIMIT = 50000;
const PRESENCE_CHANNEL = "public-site-presence";

const TABLE_LIST: { name: string; label: string }[] = [
  { name: "rabbits", label: "Кролики" },
  { name: "matings", label: "Парування" },
  { name: "litters", label: "Окроли" },
  { name: "fattening", label: "Відгодівля" },
  { name: "quarantine", label: "Карантин" },
  { name: "paddocks", label: "Вольєри" },
  { name: "paddock_matings", label: "Вольєр. паруванні" },
  { name: "paddock_litters", label: "Вольєр. окроли" },
  { name: "weight_log", label: "Вага" },
  { name: "health_log", label: "Здоров'я" },
  { name: "treatments", label: "Лікування" },
  { name: "vaccinations", label: "Вакцинації" },
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
  const [newCode, setNewCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<BackendStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [onlineVisitors, setOnlineVisitors] = useState<OnlineVisitor[]>([]);
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
      .select("id, email, created_at");

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
        };
      });
      setUsers(mapped);
    } else {
      setUsers([]);
    }
  }

  async function fetchDeactivated() {
    const { data } = await supabase.rpc("get_deactivated_users");
    setDeactivated(data || []);
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

  useEffect(() => {
    supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", session.user.id)
      .single()
      .then(async ({ data }) => {
        if (data) {
          setIsAdmin(true);
          const allCodes = await fetchCodes();
          await fetchUsers(allCodes);
          await fetchDeactivated();
          const { count: profileCount } = await supabase
            .from("profiles")
            .select("*", { count: "exact", head: true });
          await fetchStats(allCodes, profileCount ?? 0);
        }
        setLoading(false);
      });
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

            <div className="stats-tables">
              <div className="stats-tables-title">Записи у таблицях</div>
              <div className="stats-tables-grid">
                {stats.tableCounts.map((t) => (
                  <div key={t.name} className="stats-table-card">
                    <div className="stats-table-label">{t.label}</div>
                    <div className="stats-table-count">{t.count}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <p style={{ opacity: 0.6 }}>Статистика недоступна</p>
        )}
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
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", opacity: 0.5 }}>
                    Немає користувачів
                  </td>
                </tr>
              ) : (
                users.map((user, i) => (
                  <tr key={user.id}>
                    <td>{i + 1}</td>
                    <td>{user.email}</td>
                    <td className="code-text">{user.invite_code}</td>
                    <td>
                      {new Date(user.created_at).toLocaleDateString("uk-UA")}
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
                ))
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

        <div className="admin-add">
          <input
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
    </div>
  );
}
