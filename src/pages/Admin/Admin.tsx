import { useEffect, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import { createClient } from "@supabase/supabase-js";
import { todayKyiv } from "../../utils/kyivDate";
import type {
  OnlineVisitor,
  UserDataUsage,
  LeadRow,
  NpsFeedbackRow,
  DeactivatedUser,
  TableStat,
  BackendStats,
} from "./types";
import { OnlineVisitorsSection } from "./OnlineVisitorsSection";
import { UserUsageSection } from "./UserUsageSection";
import { VizytkaSection } from "./VizytkaSection";
import { LeadsSection } from "./LeadsSection";
import { NpsSection } from "./NpsSection";
import { DeactivatedUsersSection } from "./DeactivatedUsersSection";
import { DocsSection } from "./DocsSection";
import { BackendStatsSection } from "./BackendStatsSection";
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

// Додано: єдиний тип плану, щоб не дублювати об'єднання в кількох місцях
type PlanType = "trial" | "paid" | "founder" | "vip";

interface Profile {
  id: string;
  email: string | null;
  created_at: string;
  access_until: string | null;
  plan_type: PlanType;
}

interface RegisteredUser {
  id: string;
  email: string;
  created_at: string;
  invite_code: string | null;
  invite_code_id: string | null;
  access_until: string | null;
  plan_type: PlanType;
}

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
  // Змінено: повідомлення про помилки завантаження й дій над користувачами
  // показується угорі сторінки (а не лише біля поля коду, далеко від кнопок,
  // які його викликали). Раніше ці помилки ігнорувались.
  const [pageError, setPageError] = useState("");
  const [adminCheckFailed, setAdminCheckFailed] = useState(false);
  const [stats, setStats] = useState<BackendStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [onlineVisitors, setOnlineVisitors] = useState<OnlineVisitor[]>([]);
  const [userUsage, setUserUsage] = useState<UserDataUsage[]>([]);
  const [userUsageLoading, setUserUsageLoading] = useState(false);
  // Додано: лічильник завантажень візитки для блоку в адмінці
  const [vizytkaDownloads, setVizytkaDownloads] = useState<number | null>(null);
  const presenceChannelRef = useRef<ReturnType<
    typeof adminSupabase.channel
  > | null>(null);

  async function fetchCodes() {
    const { data, error } = await supabase
      .from("invite_codes")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      // Змінено: при помилці лишаємо поточний список (раніше він
      // очищався до порожнього без жодного повідомлення). Повертаємо null,
      // щоб виклики не оновлювали користувачів за неактуальними кодами.
      console.error("Не вдалося завантажити коди запрошень:", error);
      setPageError("Не вдалося завантажити коди запрошень");
      return null;
    }
    setCodes(data || []);
    return data || [];
  }

  async function fetchUsers(allCodes: InviteCode[]) {
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, email, created_at, access_until, plan_type");

    if (profilesError) {
      // Змінено: при помилці лишаємо поточний список користувачів
      console.error("Не вдалося завантажити користувачів:", profilesError);
      setPageError("Не вдалося завантажити список користувачів");
      return;
    }

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
  // на блокування доступу не впливає — те регулюється access_until).
  // Виняток — "VIP": він завжди безстроковий, тому разом із міткою
  // скидається і access_until.
  async function handleSetPlanType(userId: string, planType: PlanType) {
    const target = users.find((u) => u.id === userId);
    const previousPlanType = target?.plan_type;

    setPageError("");
    // Додано: VIP завжди безстроковий — разом із типом скидаємо access_until
    const planUpdate: { plan_type: PlanType; access_until?: null } = {
      plan_type: planType,
    };
    if (planType === "vip") planUpdate.access_until = null;
    const { error } = await supabase
      .from("profiles")
      .update(planUpdate)
      .eq("id", userId);
    if (error) {
      console.error("Не вдалося оновити тип плану:", error);
      setPageError("Не вдалося оновити тип плану");
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
    // "Пробний" для того, хто вже й так пробний.
    // Змінено: VIP -> "Пробний" не вважається скасуванням підписки,
    // лист другу не надсилаємо
    if (
      planType === "trial" &&
      previousPlanType &&
      previousPlanType !== "trial" &&
      previousPlanType !== "vip"
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
    if (allCodes) await fetchUsers(allCodes);
  }

  // Оновити дату доступу (порожньо/null = безстроково)
  async function handleSetAccessUntil(userId: string, dateValue: string) {
    const isoValue = dateValue ? new Date(dateValue).toISOString() : null;
    setPageError("");
    const { error } = await supabase
      .from("profiles")
      .update({ access_until: isoValue })
      .eq("id", userId);
    if (error) {
      console.error("Не вдалося оновити термін доступу:", error);
      setPageError("Не вдалося оновити термін доступу");
      return;
    }
    const allCodes = await fetchCodes();
    if (allCodes) await fetchUsers(allCodes);
  }

  // Швидка кнопка: +1 місяць від сьогодні
  async function handleGrantOneMonth(userId: string) {
    // Змінено: "сьогодні" за Києвом (раніше UTC: вночі виходила дата на день
    // менша). Місяць додається до дати без часу в UTC, пояс пристрою не впливає.
    const until = new Date(`${todayKyiv()}T00:00:00Z`);
    until.setUTCMonth(until.getUTCMonth() + 1);
    await handleSetAccessUntil(userId, until.toISOString().slice(0, 10));
  }

  // Прибрати обмеження — безстроковий доступ
  async function handleMakeUnlimited(userId: string) {
    await handleSetAccessUntil(userId, "");
  }

  async function fetchDeactivated() {
    const { data, error } = await supabase.rpc("get_deactivated_users");
    if (error) {
      console.error(
        "Не вдалося завантажити деактивованих користувачів:",
        error,
      );
      setPageError("Не вдалося завантажити список деактивованих користувачів");
      return;
    }
    setDeactivated(data || []);
  }

  async function fetchLeads() {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Не вдалося завантажити заявки:", error);
      setPageError("Не вдалося завантажити заявки");
      return;
    }
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

  // Додано: кількість завантажень візитки (рахує рядки в vizytka_downloads)
  async function fetchVizytkaDownloads() {
    const { count, error } = await supabase
      .from("vizytka_downloads")
      .select("*", { count: "exact", head: true });
    if (error) {
      console.error("Не вдалося завантажити лічильник візитки:", error);
      return;
    }
    setVizytkaDownloads(count ?? 0);
  }

  async function fetchStats(allCodes: InviteCode[], userCount: number) {
    setStatsLoading(true);

    let dbSizeBytes: number | null = null;
    const { data: sizeData } = await supabase.rpc("get_db_size");
    if (typeof sizeData === "number") dbSizeBytes = sizeData;

    // Додано: розмір і кількість файлів у сховищі (функція get_storage_usage)
    let storageBytes: number | null = null;
    let storageFiles: number | null = null;
    const { data: storageData, error: storageError } =
      await supabase.rpc("get_storage_usage");
    if (storageError) {
      console.error("Не вдалося завантажити розмір сховища:", storageError);
    } else if (storageData) {
      storageBytes = Number(storageData.total_bytes ?? 0);
      storageFiles = Number(storageData.file_count ?? 0);
    }

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
      storageBytes,
      storageFiles,
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
            data_bytes: number;
          }) => ({
            userId: row.user_id,
            email: row.email,
            totalBytes: Number(row.total_bytes ?? 0),
            dataBytes: Number(row.data_bytes ?? 0),
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
      // Змінено: maybeSingle замість single — відсутній рядок (звичайний
      // користувач) це не помилка, а справжні збої тепер відрізняються від
      // "доступ заборонено"
      .maybeSingle()
      .then(
        async ({ data, error }) => {
          if (error) {
            console.error("Не вдалося перевірити права адміністратора:", error);
            setAdminCheckFailed(true);
            setLoading(false);
            return;
          }
          if (data) {
            setIsAdmin(true);
            try {
              // Змінено: 8 незалежних запитів ішли по черзі (8 обертів
              // мережі замість щонайбільше 2). fetchUsers і fetchStats
              // потребують allCodes/profileCount, тому лишаються другим
              // кроком; решта не залежить одне від одного і йде паралельно
              // (Promise.all).
              const [allCodesResult, , , , profilesCountRes] =
                await Promise.all([
                  fetchCodes(),
                  fetchDeactivated(),
                  fetchLeads(),
                  fetchNpsFeedback(),
                  supabase
                    .from("profiles")
                    .select("*", { count: "exact", head: true }),
                  fetchUserUsage(),
                  // Додано: лічильник завантажень візитки паралельно з рештою
                  fetchVizytkaDownloads(),
                ]);
              // Якщо коди не завантажились, користувачів усе одно показуємо
              // (без прив'язаного коду), а помилка видна в повідомленні угорі
              const allCodes = allCodesResult ?? [];
              const profileCount = profilesCountRes.count ?? 0;
              await Promise.all([
                fetchUsers(allCodes),
                fetchStats(allCodes, profileCount),
              ]);
            } catch (err) {
              // Змінено: раніше неочікуваний виняток під час завантаження
              // (напр. збій мережі) лишав панель на "Завантаження..."
              // назавжди, бо setLoading(false) нижче не встигав
              // виконатись
              console.error("Не вдалося завантажити дані адмін-панелі:", err);
              setPageError(
                "Не вдалося завантажити дані адмін-панелі. Оновіть сторінку",
              );
            }
          }
          setLoading(false);
        },
        (err) => {
          console.error("Не вдалося завантажити дані адмін-панелі:", err);
          setAdminCheckFailed(true);
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
      if (allCodes) await fetchUsers(allCodes);
    }
  }

  async function handleDelete(id: string) {
    setError("");
    const { error } = await supabase.from("invite_codes").delete().eq("id", id);
    if (error) {
      // Змінено: раніше помилка ігнорувалась, код мовчки лишався
      console.error("Не вдалося видалити код запрошення:", error);
      setError("Не вдалося видалити код");
      return;
    }
    const allCodes = await fetchCodes();
    if (allCodes) await fetchUsers(allCodes);
  }

  async function handleDeleteUser(user: RegisteredUser) {
    const confirm = window.confirm(
      `Видалити користувача ${user.email}?\nВін втратить доступ до додатку.`,
    );
    if (!confirm) return;

    setPageError("");
    const { error: profileError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", user.id);
    if (profileError) {
      // Змінено: раніше помилка ігнорувалась, і далі код запрошення
      // звільнявся, хоча профіль користувача лишався
      console.error("Не вдалося видалити профіль користувача:", profileError);
      setPageError("Не вдалося видалити користувача");
      return;
    }

    if (user.invite_code_id) {
      // .select("id"): оновлення, заблоковане політикою RLS, не повертає
      // помилки, лише 0 рядків. Зараз для invite_codes немає політики UPDATE
      // для адміністраторів, тому код фактично лишається використаним.
      const { data: released, error: codeError } = await supabase
        .from("invite_codes")
        .update({ is_used: false, used_by: null })
        .eq("id", user.invite_code_id)
        .select("id");
      if (codeError) {
        console.error("Не вдалося звільнити код запрошення:", codeError);
        setPageError(
          "Користувача видалено, але не вдалося звільнити код запрошення",
        );
      } else if (!released || released.length === 0) {
        setPageError(
          "Користувача видалено. Код запрошення не вдалося звільнити: він лишається використаним",
        );
      }
    }

    const allCodes = await fetchCodes();
    if (allCodes) await fetchUsers(allCodes);
    await fetchDeactivated();
  }

  async function handleRestoreUser(user: DeactivatedUser) {
    const confirm = window.confirm(`Відновити доступ для ${user.email}?`);
    if (!confirm) return;

    setPageError("");
    const { error } = await supabase
      .from("profiles")
      .insert({ id: user.id, email: user.email });
    if (error) {
      // Змінено: раніше помилка ігнорувалась, доступ не відновлювався мовчки
      console.error("Не вдалося відновити доступ користувача:", error);
      setPageError("Не вдалося відновити доступ");
      return;
    }

    const allCodes = await fetchCodes();
    if (allCodes) await fetchUsers(allCodes);
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
  if (!isAdmin) {
    return (
      <p style={{ padding: "2rem" }}>
        {adminCheckFailed
          ? "Не вдалося перевірити права доступу. Оновіть сторінку."
          : "Доступ заборонено."}
      </p>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>⚙️ Адмін панель</h1>
      </div>

      {pageError && <p className="admin-error">{pageError}</p>}

      <OnlineVisitorsSection visitors={onlineVisitors} />
      <BackendStatsSection stats={stats} loading={statsLoading} />
      <UserUsageSection usage={userUsage} loading={userUsageLoading} />
      <VizytkaSection downloads={vizytkaDownloads} />
      <NpsSection feedback={npsFeedback} loading={npsLoading} />
      <LeadsSection leads={leads} />

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
                              e.target.value as PlanType,
                            )
                          }
                        >
                          <option value="trial">Пробний</option>
                          <option value="paid">Платний</option>
                          <option value="founder">Засновник</option>
                          <option value="vip">VIP</option>
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

      <DeactivatedUsersSection
        users={deactivated}
        onRestore={handleRestoreUser}
      />

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

      <DocsSection />
    </div>
  );
}
