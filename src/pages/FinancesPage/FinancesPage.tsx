import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import "./FinancesPage.css";

interface Props {
  session: Session;
}

type ExpenseCategory = "feed" | "vet" | "equipment" | "transport" | "other";
type OtherIncomeCategory = "hides" | "manure" | "other";

interface ExpenseRecord {
  id: string;
  category: ExpenseCategory;
  amount: number;
  expense_date: string;
  description: string | null;
}

interface SaleRecord {
  id: string;
  price: number | null;
  sold_at: string;
  cage_number: string;
  buyer: string | null;
}

interface SelfConsumptionRecord {
  id: string;
  cage_number: string;
  breed: string;
  males: number;
  females: number;
  unknown: number;
  slaughtered_at: string;
  carcass_weight_kg: number | null;
  carcass_price_per_kg: number | null;
}

interface OtherIncomeRecord {
  id: string;
  category: OtherIncomeCategory;
  amount: number;
  income_date: string;
  description: string | null;
}

interface MonthlyFinance {
  month: string; // "2026-08"
  income: number;
  expenses: number;
  profit: number;
  slaughtered: number;
  slaughteredValue: number; // оцінна вартість власного споживання, якби продали
}

const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  feed: "🌾 Корм",
  vet: "💊 Ветеринарія",
  equipment: "🏠 Обладнання",
  transport: "🚗 Транспорт",
  other: "📦 Інше",
};

const OTHER_INCOME_LABELS: Record<OtherIncomeCategory, string> = {
  hides: "🐇 Шкурки",
  manure: "🌱 Послід/добриво",
  other: "📦 Інше",
};

const MONTH_NAMES = [
  "Січень",
  "Лютий",
  "Березень",
  "Квітень",
  "Травень",
  "Червень",
  "Липень",
  "Серпень",
  "Вересень",
  "Жовтень",
  "Листопад",
  "Грудень",
];

const MONTH_NAMES_SHORT = [
  "Січ",
  "Лют",
  "Бер",
  "Кві",
  "Тра",
  "Чер",
  "Лип",
  "Сер",
  "Вер",
  "Жов",
  "Лис",
  "Гру",
];

function monthLabelFull(key: string) {
  const [y, m] = key.split("-");
  return `${MONTH_NAMES[parseInt(m, 10) - 1]} ${y}`;
}

function monthLabelShort(key: string) {
  const [y, m] = key.split("-");
  return `${MONTH_NAMES_SHORT[parseInt(m, 10) - 1]} ${y.slice(2)}`;
}

function formatUAH(value: number) {
  return `${Math.round(value).toLocaleString("uk-UA")} грн`;
}

const emptyExpenseForm = {
  category: "feed" as ExpenseCategory,
  amount: "",
  expense_date: new Date().toISOString().split("T")[0],
  description: "",
};

const emptyOtherIncomeForm = {
  category: "hides" as OtherIncomeCategory,
  amount: "",
  income_date: new Date().toISOString().split("T")[0],
  description: "",
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 640 : false,
  );
  useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth <= 640);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isMobile;
}

function OverviewChart({ data }: { data: MonthlyFinance[] }) {
  const isMobile = useIsMobile();
  // slaughteredValue (грн) тепер теж звичайний стовпчик, тому враховуємо
  // його в спільній шкалі поруч із доходом/витратами.
  const max = Math.max(
    ...data.map((d) =>
      Math.max(d.income, d.expenses, d.slaughtered, d.slaughteredValue),
    ),
    1,
  );
  // На мобільному груп менше пікселів — інакше графік вилазить за екран
  // і видно лише обрізаний шматок замість повних чисел.
  const groupW = isMobile ? 104 : 160;
  const barW = isMobile ? 16 : 26;
  const gap = isMobile ? 5 : 8;
  const chartW = data.length * groupW + 20;
  const chartH = isMobile ? 140 : 200;
  const topPadding = isMobile ? 20 : 26;
  const valueFontSize = isMobile ? 9 : 11;
  const labelFontSize = isMobile ? 10 : 12;

  function bar(x: number, value: number, color: string, key: string) {
    const h = Math.round((value / max) * chartH);
    const y = topPadding + (chartH - h);
    return (
      <g key={key}>
        <rect
          x={x}
          y={y}
          width={barW}
          height={h}
          rx={isMobile ? 4 : 5}
          fill={color}
          opacity={0.85}
        />
        {value > 0 && (
          <text
            x={x + barW / 2}
            y={y - 5}
            textAnchor="middle"
            fontSize={valueFontSize}
            fill="var(--gray)"
          >
            {Math.round(value)}
          </text>
        )}
      </g>
    );
  }

  return (
    <div className="finances-chart-scroll">
      <svg
        width={chartW}
        height={chartH + 60 + topPadding}
        style={{ overflow: "visible" }}
      >
        {data.map((d, i) => {
          const groupX = 10 + i * groupW;
          const incomeX = groupX;
          const expenseX = groupX + barW + gap;
          const slaughteredX = groupX + (barW + gap) * 2;
          const slaughteredValueX = groupX + (barW + gap) * 3;
          return (
            <g key={d.month}>
              {bar(incomeX, d.income, "#4caf50", `${d.month}-income`)}
              {bar(expenseX, d.expenses, "#b71c1c", `${d.month}-expense`)}
              {bar(
                slaughteredX,
                d.slaughtered,
                "#8d6e63",
                `${d.month}-slaughtered`,
              )}
              {/* Умовна вартість "якби продали" — навмисно НЕ зелений,
                  щоб господар, який тримає кроликів для себе, не сплутав
                  цю оцінку з реальним доходом від продажу. */}
              {bar(
                slaughteredValueX,
                d.slaughteredValue,
                "#ffb300",
                `${d.month}-slaughtered-value`,
              )}
              <text
                x={groupX + (barW * 4 + gap * 3) / 2}
                y={topPadding + chartH + 20}
                textAnchor="middle"
                fontSize={labelFontSize}
                fill="var(--gray)"
              >
                {monthLabelShort(d.month)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function FinancesPage({ session }: Props) {
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [selfConsumption, setSelfConsumption] = useState<
    SelfConsumptionRecord[]
  >([]);
  const [otherIncome, setOtherIncome] = useState<OtherIncomeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "expenses" | "income"
  >("overview");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyExpenseForm);
  const [showOtherIncomeForm, setShowOtherIncomeForm] = useState(false);
  const [otherIncomeForm, setOtherIncomeForm] = useState(emptyOtherIncomeForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [editingPriceValue, setEditingPriceValue] = useState("");
  // ── Редагування ваги туші та ціни за кг для власного споживання ──
  const [editingCarcassId, setEditingCarcassId] = useState<string | null>(null);
  const [editingWeightValue, setEditingWeightValue] = useState("");
  const [editingPriceKgValue, setEditingPriceKgValue] = useState("210");
  const [showNote, setShowNote] = useState(false);
  const navigate = useNavigate();

  // Примітка: setLoading(true) навмисно НЕ викликається тут синхронно
  // (eslint: react-hooks/set-state-in-effect). Початкове значення loading
  // вже true (useState(true)), а перед кожним повторним завантоженням
  // (refreshKey++) ми виставляємо setLoading(true) у відповідному
  // обробнику події.
  useEffect(() => {
    let cancelled = false;

    Promise.all([
      supabase
        .from("expenses")
        .select("id, category, amount, expense_date, description")
        .eq("user_id", session.user.id)
        .order("expense_date", { ascending: false }),
      supabase
        .from("sales")
        .select("id, price, sold_at, cage_number, buyer")
        .eq("user_id", session.user.id)
        .order("sold_at", { ascending: false }),
      // "Власне споживання" — беремо напряму із забитих кліток Відгодівлі
      // (is_active=false + slaughtered_at заповнено), без окремого запису.
      // carcass_weight_kg / carcass_price_per_kg — вага туші (не жива вага
      // із Зважування) та ціна за кг, вносяться вручну на цій сторінці.
      supabase
        .from("fattening")
        .select(
          "id, cage_number, breed, males, females, unknown, slaughtered_at, carcass_weight_kg, carcass_price_per_kg",
        )
        .eq("user_id", session.user.id)
        .eq("is_active", false)
        .not("slaughtered_at", "is", null)
        .order("slaughtered_at", { ascending: false }),
      // Інший дохід (шкурки, послід тощо) — вноситься вручну
      supabase
        .from("other_income")
        .select("id, category, amount, income_date, description")
        .eq("user_id", session.user.id)
        .order("income_date", { ascending: false }),
    ]).then(([expensesRes, salesRes, slaughteredRes, otherIncomeRes]) => {
      if (cancelled) return;
      setExpenses(expensesRes.data || []);
      setSales(salesRes.data || []);
      setSelfConsumption(slaughteredRes.data || []);
      setOtherIncome(otherIncomeRes.data || []);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [session.user.id, refreshKey]);

  async function handleAddExpense() {
    setSaving(true);
    setError("");
    const { error } = await supabase.from("expenses").insert({
      user_id: session.user.id,
      category: form.category,
      amount: Number(form.amount),
      expense_date: form.expense_date,
      description: form.description || null,
    });
    if (error) {
      setError("Помилка збереження");
    } else {
      setForm(emptyExpenseForm);
      setShowForm(false);
      setLoading(true);
      setRefreshKey((k) => k + 1);
    }
    setSaving(false);
  }

  async function handleDeleteExpense(id: string) {
    if (!confirm("Видалити витрату?")) return;
    await supabase.from("expenses").delete().eq("id", id);
    setLoading(true);
    setRefreshKey((k) => k + 1);
  }

  async function handleAddOtherIncome() {
    setSaving(true);
    setError("");
    const { error } = await supabase.from("other_income").insert({
      user_id: session.user.id,
      category: otherIncomeForm.category,
      amount: Number(otherIncomeForm.amount),
      income_date: otherIncomeForm.income_date,
      description: otherIncomeForm.description || null,
    });
    if (error) {
      setError("Помилка збереження");
    } else {
      setOtherIncomeForm(emptyOtherIncomeForm);
      setShowOtherIncomeForm(false);
      setLoading(true);
      setRefreshKey((k) => k + 1);
    }
    setSaving(false);
  }

  async function handleDeleteOtherIncome(id: string) {
    if (!confirm("Видалити запис доходу?")) return;
    await supabase.from("other_income").delete().eq("id", id);
    setLoading(true);
    setRefreshKey((k) => k + 1);
  }

  function startEditPrice(sale: SaleRecord) {
    setEditingPriceId(sale.id);
    setEditingPriceValue(sale.price ? String(sale.price) : "");
  }

  async function handleSavePrice(id: string) {
    const value = Number(editingPriceValue);
    if (!value || value <= 0) return;
    await supabase.from("sales").update({ price: value }).eq("id", id);
    setEditingPriceId(null);
    setEditingPriceValue("");
    setLoading(true);
    setRefreshKey((k) => k + 1);
  }

  // ── Вага туші та ціна за кг для власного споживання ──
  function startEditCarcass(record: SelfConsumptionRecord) {
    setEditingCarcassId(record.id);
    setEditingWeightValue(
      record.carcass_weight_kg ? String(record.carcass_weight_kg) : "",
    );
    setEditingPriceKgValue(
      record.carcass_price_per_kg ? String(record.carcass_price_per_kg) : "210",
    );
  }

  async function handleSaveCarcass(id: string) {
    const weight = Number(editingWeightValue);
    const price = Number(editingPriceKgValue);
    if (!weight || weight <= 0 || !price || price <= 0) return;
    await supabase
      .from("fattening")
      .update({ carcass_weight_kg: weight, carcass_price_per_kg: price })
      .eq("id", id);
    setEditingCarcassId(null);
    setLoading(true);
    setRefreshKey((k) => k + 1);
  }

  // ── Агрегація по місяцях (дохід/витрати/прибуток/забито/вартість забитого) ──
  const monthlyMap: Record<string, MonthlyFinance> = {};
  function ensureMonth(key: string) {
    if (!monthlyMap[key]) {
      monthlyMap[key] = {
        month: key,
        income: 0,
        expenses: 0,
        profit: 0,
        slaughtered: 0,
        slaughteredValue: 0,
      };
    }
    return monthlyMap[key];
  }
  sales.forEach((s) => {
    if (!s.sold_at || !s.price) return;
    ensureMonth(s.sold_at.slice(0, 7)).income += s.price;
  });
  otherIncome.forEach((oi) => {
    if (!oi.income_date) return;
    ensureMonth(oi.income_date.slice(0, 7)).income += oi.amount;
  });
  expenses.forEach((e) => {
    if (!e.expense_date) return;
    ensureMonth(e.expense_date.slice(0, 7)).expenses += e.amount;
  });
  selfConsumption.forEach((c) => {
    if (!c.slaughtered_at) return;
    const m = ensureMonth(c.slaughtered_at.slice(0, 7));
    const count = (c.males || 0) + (c.females || 0) + (c.unknown || 0);
    m.slaughtered += count;
    if (c.carcass_weight_kg && c.carcass_price_per_kg) {
      // ФІКС: вага/ціна вказуються за ОДНУ голову, тому множимо на
      // кількість голів у партії — інакше сума занижена в count разів.
      m.slaughteredValue +=
        c.carcass_weight_kg * c.carcass_price_per_kg * count;
    }
  });
  const monthlyStats = Object.values(monthlyMap)
    .map((m) => ({ ...m, profit: m.income - m.expenses }))
    .sort((a, b) => a.month.localeCompare(b.month));

  const totalSalesIncome = sales.reduce((s, r) => s + (r.price || 0), 0);
  const totalOtherIncome = otherIncome.reduce((s, r) => s + r.amount, 0);
  const totalIncome = totalSalesIncome + totalOtherIncome;
  const totalExpenses = expenses.reduce((s, r) => s + r.amount, 0);
  const totalProfit = totalIncome - totalExpenses;

  // ── Власне споживання: підсумок голів, оцінна вартість і групування по місяцях ──
  const selfConsumptionTotal = selfConsumption.reduce(
    (s, c) => s + (c.males || 0) + (c.females || 0) + (c.unknown || 0),
    0,
  );
  const selfConsumptionValue = selfConsumption.reduce((s, c) => {
    const count = (c.males || 0) + (c.females || 0) + (c.unknown || 0);
    // ФІКС: те саме множення на кількість голів
    return (
      s +
      (c.carcass_weight_kg && c.carcass_price_per_kg
        ? c.carcass_weight_kg * c.carcass_price_per_kg * count
        : 0)
    );
  }, 0);
  const selfConsumptionByMonth: Record<string, SelfConsumptionRecord[]> = {};
  selfConsumption.forEach((c) => {
    if (!c.slaughtered_at) return;
    const key = c.slaughtered_at.slice(0, 7);
    if (!selfConsumptionByMonth[key]) selfConsumptionByMonth[key] = [];
    selfConsumptionByMonth[key].push(c);
  });
  const selfConsumptionMonths = Object.keys(selfConsumptionByMonth).sort(
    (a, b) => b.localeCompare(a),
  );

  // ── Групування витрат по місяцях для вкладки "Витрати" ──
  const expensesByMonth: Record<string, ExpenseRecord[]> = {};
  expenses.forEach((e) => {
    if (!e.expense_date) return;
    const key = e.expense_date.slice(0, 7);
    if (!expensesByMonth[key]) expensesByMonth[key] = [];
    expensesByMonth[key].push(e);
  });
  const expenseMonths = Object.keys(expensesByMonth).sort((a, b) =>
    b.localeCompare(a),
  );

  // ── Групування продажів по місяцях для вкладки "Доходи" ──
  const salesByMonth: Record<string, SaleRecord[]> = {};
  sales.forEach((s) => {
    if (!s.sold_at) return;
    const key = s.sold_at.slice(0, 7);
    if (!salesByMonth[key]) salesByMonth[key] = [];
    salesByMonth[key].push(s);
  });
  const salesMonths = Object.keys(salesByMonth).sort((a, b) =>
    b.localeCompare(a),
  );

  // ── Групування іншого доходу по місяцях ──
  const otherIncomeByMonth: Record<string, OtherIncomeRecord[]> = {};
  otherIncome.forEach((oi) => {
    if (!oi.income_date) return;
    const key = oi.income_date.slice(0, 7);
    if (!otherIncomeByMonth[key]) otherIncomeByMonth[key] = [];
    otherIncomeByMonth[key].push(oi);
  });
  const otherIncomeMonths = Object.keys(otherIncomeByMonth).sort((a, b) =>
    b.localeCompare(a),
  );

  return (
    <div className="finances-page">
      <div className="finances-header">
        <h1>💰 Фінанси</h1>
        <button
          className="finances-back-btn"
          onClick={() => navigate("/registry")}
        >
          ⬅ Мої кролики
        </button>
      </div>

      {loading ? (
        <div className="finances-loading">Завантаження...</div>
      ) : (
        <>
          <div className="finances-summary">
            <div className="finances-summary-card income">
              <span
                className="finances-summary-val"
                style={{ color: "#4caf50" }}
              >
                {formatUAH(totalIncome)}
              </span>
              <span className="finances-summary-label">Дохід</span>
            </div>
            <div className="finances-summary-card expense">
              <span
                className="finances-summary-val"
                style={{ color: "#b71c1c" }}
              >
                {formatUAH(totalExpenses)}
              </span>
              <span className="finances-summary-label">Витрати</span>
            </div>
            <div className="finances-summary-card self-consumption">
              <span
                className="finances-summary-val"
                style={{ color: "#8d6e63" }}
              >
                {selfConsumptionTotal} гол.
              </span>
              <span className="finances-summary-label">
                🍖 Власне споживання
              </span>
              {selfConsumptionValue > 0 && (
                <span
                  className="finances-row-desc"
                  style={{ color: "#8d6e63" }}
                >
                  ≈ {formatUAH(selfConsumptionValue)}
                </span>
              )}
            </div>
            <div className="finances-summary-card profit">
              <span
                className="finances-summary-val"
                style={{ color: totalProfit >= 0 ? "#4caf50" : "#b71c1c" }}
              >
                {totalProfit >= 0 ? "+" : ""}
                {formatUAH(totalProfit)}
              </span>
              <span className="finances-summary-label">Прибуток</span>
            </div>
          </div>

          <div className="finances-tabs">
            <button
              className={`finances-tab ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              📈 Огляд
            </button>
            <button
              className={`finances-tab ${activeTab === "expenses" ? "active" : ""}`}
              onClick={() => setActiveTab("expenses")}
            >
              🔻 Витрати
            </button>
            <button
              className={`finances-tab ${activeTab === "income" ? "active" : ""}`}
              onClick={() => setActiveTab("income")}
            >
              🔺 Доходи
            </button>
          </div>

          {activeTab === "overview" &&
            (monthlyStats.length === 0 ? (
              <div className="finances-empty-state">
                <div className="finances-empty-illustration">📈</div>
                <h3 className="finances-empty-title">Даних ще немає</h3>
                <p className="finances-empty-desc">
                  Огляд з'явиться, коли буде хоча б один продаж, забій або
                  записана витрата.
                </p>
              </div>
            ) : (
              <div className="finances-chart-block">
                <div className="finances-legend">
                  <span className="finances-legend-item">
                    <span
                      className="finances-legend-dot"
                      style={{ background: "#4caf50" }}
                    />
                    Дохід
                  </span>
                  <span className="finances-legend-item">
                    <span
                      className="finances-legend-dot"
                      style={{ background: "#b71c1c" }}
                    />
                    Витрати
                  </span>
                  <span className="finances-legend-item">
                    <span
                      className="finances-legend-dot"
                      style={{ background: "#8d6e63" }}
                    />
                    Забито (гол.)
                  </span>
                  <span className="finances-legend-item">
                    <span
                      className="finances-legend-dot"
                      style={{ background: "#ffb300" }}
                    />
                    Умовна вартість "якби продали"
                  </span>
                </div>
                <h3 className="finances-chart-title">
                  Дохід / Витрати / Забито по місяцях
                </h3>
                <OverviewChart data={monthlyStats} />

                <div style={{ marginTop: "1.5rem" }}>
                  {monthlyStats
                    .slice()
                    .reverse()
                    .map((m) => (
                      <div key={m.month} className="finances-row">
                        <div className="finances-row-left">
                          <span className="finances-row-category">
                            {monthLabelFull(m.month)}
                          </span>
                          {m.slaughtered > 0 && (
                            <span className="finances-row-desc">
                              🍖 забито: {m.slaughtered} гол.
                              {m.slaughteredValue > 0 &&
                                ` (умовно ≈${formatUAH(m.slaughteredValue)}, якби продали)`}
                            </span>
                          )}
                        </div>
                        <div className="finances-row-right">
                          <span
                            className="finances-row-amount"
                            style={{
                              color: m.profit >= 0 ? "#4caf50" : "#b71c1c",
                            }}
                          >
                            {m.profit >= 0 ? "+" : ""}
                            {formatUAH(m.profit)}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}

          {activeTab === "expenses" && (
            <>
              <button
                className="finances-add-btn"
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? "✕ Скасувати" : "+ Додати витрату"}
              </button>

              {showForm && (
                <div className="finances-form">
                  <div className="finances-form-grid">
                    <div className="finances-form-field">
                      <label>Категорія</label>
                      <select
                        value={form.category}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            category: e.target.value as ExpenseCategory,
                          })
                        }
                      >
                        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="finances-form-field">
                      <label>Сума, грн *</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={form.amount}
                        onChange={(e) =>
                          setForm({ ...form, amount: e.target.value })
                        }
                      />
                    </div>
                    <div className="finances-form-field">
                      <label>Дата *</label>
                      <input
                        type="date"
                        value={form.expense_date}
                        onChange={(e) =>
                          setForm({ ...form, expense_date: e.target.value })
                        }
                      />
                    </div>
                    <div className="finances-form-field finances-form-full">
                      <label>Опис</label>
                      <input
                        placeholder="Наприклад: комбікорм 50 кг"
                        value={form.description}
                        onChange={(e) =>
                          setForm({ ...form, description: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  {error && <p className="finances-error">{error}</p>}
                  <button
                    className="finances-save-btn"
                    onClick={handleAddExpense}
                    disabled={saving || !form.amount || !form.expense_date}
                  >
                    {saving ? "Збереження..." : "Зберегти"}
                  </button>
                </div>
              )}

              {expenseMonths.length === 0 ? (
                <div className="finances-empty-state">
                  <div className="finances-empty-illustration">🔻</div>
                  <h3 className="finances-empty-title">Витрат ще немає</h3>
                  <p className="finances-empty-desc">
                    Додай першу витрату — кожна нова буде видна тут по місяцях.
                  </p>
                </div>
              ) : (
                expenseMonths.map((month) => {
                  const group = expensesByMonth[month];
                  const groupTotal = group.reduce((s, e) => s + e.amount, 0);
                  return (
                    <div key={month} className="finances-month">
                      <div className="finances-month-header">
                        <span>{monthLabelFull(month)}</span>
                        <span>{formatUAH(groupTotal)}</span>
                      </div>
                      <div className="finances-list">
                        {group.map((e) => (
                          <div key={e.id} className="finances-row">
                            <div className="finances-row-left">
                              <span className="finances-row-category">
                                {CATEGORY_LABELS[e.category]}
                              </span>
                              {e.description && (
                                <span className="finances-row-desc">
                                  {e.description}
                                </span>
                              )}
                            </div>
                            <div className="finances-row-right">
                              <span className="finances-row-amount expense">
                                −{formatUAH(e.amount)}
                              </span>
                              <span className="finances-row-date">
                                {new Date(e.expense_date).toLocaleDateString(
                                  "uk-UA",
                                )}
                              </span>
                              <button
                                className="finances-delete-btn"
                                onClick={() => handleDeleteExpense(e.id)}
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}

          {activeTab === "income" && (
            <>
              <button
                className="finances-add-btn"
                onClick={() => setShowOtherIncomeForm(!showOtherIncomeForm)}
              >
                {showOtherIncomeForm
                  ? "✕ Скасувати"
                  : "+ Додати дохід (шкурки, послід...)"}
              </button>

              {showOtherIncomeForm && (
                <div className="finances-form">
                  <div className="finances-form-grid">
                    <div className="finances-form-field">
                      <label>Категорія</label>
                      <select
                        value={otherIncomeForm.category}
                        onChange={(e) =>
                          setOtherIncomeForm({
                            ...otherIncomeForm,
                            category: e.target.value as OtherIncomeCategory,
                          })
                        }
                      >
                        {Object.entries(OTHER_INCOME_LABELS).map(
                          ([key, label]) => (
                            <option key={key} value={key}>
                              {label}
                            </option>
                          ),
                        )}
                      </select>
                    </div>
                    <div className="finances-form-field">
                      <label>Сума, грн *</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={otherIncomeForm.amount}
                        onChange={(e) =>
                          setOtherIncomeForm({
                            ...otherIncomeForm,
                            amount: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="finances-form-field">
                      <label>Дата *</label>
                      <input
                        type="date"
                        value={otherIncomeForm.income_date}
                        onChange={(e) =>
                          setOtherIncomeForm({
                            ...otherIncomeForm,
                            income_date: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="finances-form-field finances-form-full">
                      <label>Опис</label>
                      <input
                        placeholder="Наприклад: 12 шкурок висушено і продано"
                        value={otherIncomeForm.description}
                        onChange={(e) =>
                          setOtherIncomeForm({
                            ...otherIncomeForm,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  {error && <p className="finances-error">{error}</p>}
                  <button
                    className="finances-save-btn"
                    onClick={handleAddOtherIncome}
                    disabled={
                      saving ||
                      !otherIncomeForm.amount ||
                      !otherIncomeForm.income_date
                    }
                  >
                    {saving ? "Збереження..." : "Зберегти"}
                  </button>
                </div>
              )}

              {salesMonths.length === 0 &&
              otherIncomeMonths.length === 0 &&
              selfConsumptionMonths.length === 0 ? (
                <div className="finances-empty-state">
                  <div className="finances-empty-illustration">🔺</div>
                  <h3 className="finances-empty-title">Доходів ще не було</h3>
                  <p className="finances-empty-desc">
                    Дохід рахується з розділу Відгодівля (кнопка «Продано»), або
                    додай його вручну — наприклад, за шкурки чи послід.
                  </p>
                </div>
              ) : (
                <>
                  {salesMonths.map((month) => {
                    const group = salesByMonth[month];
                    const groupTotal = group.reduce(
                      (s, r) => s + (r.price || 0),
                      0,
                    );
                    return (
                      <div key={month} className="finances-month">
                        <div className="finances-month-header">
                          <span>{monthLabelFull(month)}</span>
                          <span>{formatUAH(groupTotal)}</span>
                        </div>
                        <div className="finances-list">
                          {group.map((s) => (
                            <div key={s.id} className="finances-row">
                              <div className="finances-row-left">
                                <span className="finances-row-category">
                                  Клітка {s.cage_number || "?"}
                                </span>
                                {s.buyer && (
                                  <span className="finances-row-desc">
                                    Покупець: {s.buyer}
                                  </span>
                                )}
                              </div>
                              <div className="finances-row-right">
                                {editingPriceId === s.id ? (
                                  <>
                                    <input
                                      type="number"
                                      placeholder="Ціна, грн"
                                      autoFocus
                                      value={editingPriceValue}
                                      onChange={(e) =>
                                        setEditingPriceValue(e.target.value)
                                      }
                                      style={{
                                        width: "90px",
                                        padding: "0.3rem 0.5rem",
                                        border: "1px solid var(--gray-light)",
                                        borderRadius: "6px",
                                      }}
                                    />
                                    <button
                                      className="finances-save-btn"
                                      style={{ padding: "0.3rem 0.7rem" }}
                                      onClick={() => handleSavePrice(s.id)}
                                    >
                                      ✓
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    className="finances-row-amount income"
                                    style={{
                                      background: "none",
                                      border: "none",
                                      cursor: "pointer",
                                      padding: 0,
                                      font: "inherit",
                                    }}
                                    onClick={() => startEditPrice(s)}
                                    title="Клікни, щоб вписати ціну"
                                  >
                                    {s.price
                                      ? `+${formatUAH(s.price)}`
                                      : "➕ Вказати ціну"}
                                  </button>
                                )}
                                <span className="finances-row-date">
                                  {new Date(s.sold_at).toLocaleDateString(
                                    "uk-UA",
                                  )}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  {/* ── Інший дохід: шкурки, послід тощо ── */}
                  {otherIncomeMonths.length > 0 && (
                    <div style={{ marginTop: "1.5rem" }}>
                      <h3 className="finances-chart-title">
                        🐇 Інший дохід (шкурки, послід тощо)
                      </h3>
                      {otherIncomeMonths.map((month) => {
                        const group = otherIncomeByMonth[month];
                        const groupTotal = group.reduce(
                          (s, oi) => s + oi.amount,
                          0,
                        );
                        return (
                          <div key={month} className="finances-month">
                            <div className="finances-month-header">
                              <span>{monthLabelFull(month)}</span>
                              <span>{formatUAH(groupTotal)}</span>
                            </div>
                            <div className="finances-list">
                              {group.map((oi) => (
                                <div key={oi.id} className="finances-row">
                                  <div className="finances-row-left">
                                    <span className="finances-row-category">
                                      {OTHER_INCOME_LABELS[oi.category]}
                                    </span>
                                    {oi.description && (
                                      <span className="finances-row-desc">
                                        {oi.description}
                                      </span>
                                    )}
                                  </div>
                                  <div className="finances-row-right">
                                    <span className="finances-row-amount income">
                                      +{formatUAH(oi.amount)}
                                    </span>
                                    <span className="finances-row-date">
                                      {new Date(
                                        oi.income_date,
                                      ).toLocaleDateString("uk-UA")}
                                    </span>
                                    <button
                                      className="finances-delete-btn"
                                      onClick={() =>
                                        handleDeleteOtherIncome(oi.id)
                                      }
                                    >
                                      ✕
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* ── Власне споживання (окремо від грошового доходу) ── */}
                  {selfConsumptionMonths.length > 0 && (
                    <div style={{ marginTop: "1.5rem" }}>
                      <h3 className="finances-chart-title">
                        🍖 Власне споживання ({selfConsumptionTotal} гол.
                        {selfConsumptionValue > 0 &&
                          `, ≈${formatUAH(selfConsumptionValue)}`}
                        )
                      </h3>
                      {selfConsumptionMonths.map((month) => {
                        const group = selfConsumptionByMonth[month];
                        const groupTotal = group.reduce(
                          (s, c) =>
                            s +
                            (c.males || 0) +
                            (c.females || 0) +
                            (c.unknown || 0),
                          0,
                        );
                        const groupValue = group.reduce((s, c) => {
                          const count =
                            (c.males || 0) +
                            (c.females || 0) +
                            (c.unknown || 0);
                          // ФІКС: множення на кількість голів
                          return (
                            s +
                            (c.carcass_weight_kg && c.carcass_price_per_kg
                              ? c.carcass_weight_kg *
                                c.carcass_price_per_kg *
                                count
                              : 0)
                          );
                        }, 0);
                        return (
                          <div key={month} className="finances-month">
                            <div
                              className="finances-month-header"
                              style={{ background: "#8d6e63" }}
                            >
                              <span>{monthLabelFull(month)}</span>
                              <span>
                                {groupTotal} гол.
                                {groupValue > 0 &&
                                  ` · ≈${formatUAH(groupValue)}`}
                              </span>
                            </div>
                            <div className="finances-list">
                              {group.map((c) => {
                                const count =
                                  (c.males || 0) +
                                  (c.females || 0) +
                                  (c.unknown || 0);
                                return (
                                  <div
                                    key={c.id}
                                    className="finances-row"
                                    style={{ borderLeftColor: "#8d6e63" }}
                                  >
                                    <div className="finances-row-left">
                                      <span className="finances-row-category">
                                        Клітка {c.cage_number || "?"}
                                      </span>
                                      {c.breed && (
                                        <span className="finances-row-desc">
                                          {c.breed}
                                        </span>
                                      )}
                                    </div>
                                    <div className="finances-row-right">
                                      {editingCarcassId === c.id ? (
                                        <>
                                          <input
                                            type="number"
                                            placeholder="Вага туші, кг"
                                            autoFocus
                                            value={editingWeightValue}
                                            onChange={(e) =>
                                              setEditingWeightValue(
                                                e.target.value,
                                              )
                                            }
                                            style={{
                                              width: "90px",
                                              padding: "0.3rem 0.5rem",
                                              border:
                                                "1px solid var(--gray-light)",
                                              borderRadius: "6px",
                                            }}
                                          />
                                          <input
                                            type="number"
                                            placeholder="Грн/кг"
                                            value={editingPriceKgValue}
                                            onChange={(e) =>
                                              setEditingPriceKgValue(
                                                e.target.value,
                                              )
                                            }
                                            style={{
                                              width: "80px",
                                              padding: "0.3rem 0.5rem",
                                              border:
                                                "1px solid var(--gray-light)",
                                              borderRadius: "6px",
                                            }}
                                          />
                                          <button
                                            className="finances-save-btn"
                                            style={{ padding: "0.3rem 0.7rem" }}
                                            onClick={() =>
                                              handleSaveCarcass(c.id)
                                            }
                                          >
                                            ✓
                                          </button>
                                        </>
                                      ) : c.carcass_weight_kg &&
                                        c.carcass_price_per_kg ? (
                                        <button
                                          className="finances-row-amount"
                                          style={{
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            padding: 0,
                                            font: "inherit",
                                            color: "#8d6e63",
                                          }}
                                          onClick={() => startEditCarcass(c)}
                                          title="Клікни, щоб змінити вагу/ціну (за 1 голову)"
                                        >
                                          {c.carcass_weight_kg} кг × {count} гол
                                          · ≈
                                          {formatUAH(
                                            c.carcass_weight_kg *
                                              c.carcass_price_per_kg *
                                              count,
                                          )}
                                        </button>
                                      ) : (
                                        <button
                                          className="finances-row-amount"
                                          style={{
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            padding: 0,
                                            font: "inherit",
                                            color: "#8d6e63",
                                          }}
                                          onClick={() => startEditCarcass(c)}
                                          title="Клікни, щоб вказати вагу туші (за 1 голову) і ціну"
                                        >
                                          ➕ Вказати вагу/ціну
                                        </button>
                                      )}
                                      <span
                                        className="finances-row-amount"
                                        style={{ color: "#8d6e63" }}
                                      >
                                        {count} гол.
                                      </span>
                                      <span className="finances-row-date">
                                        {new Date(
                                          c.slaughtered_at,
                                        ).toLocaleDateString("uk-UA")}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* ── Зноска: як це працює ── */}
          <div className="finances-note">
            <button
              className="finances-note-toggle"
              onClick={() => setShowNote(!showNote)}
            >
              <span>❓ Як рахуються дохід, витрати і прибуток</span>
              <span>{showNote ? "▲" : "▼"}</span>
            </button>

            {showNote && (
              <>
                <p>
                  Дохід і витрати збираються з різних розділів автоматично або
                  вносяться вручну, а прибуток система рахує сама.
                </p>
                <div className="finances-note-grid">
                  <div className="finances-note-item">
                    <span className="finances-note-icon">🥩</span>
                    <div>
                      <strong>Дохід від продажу кроликів</strong>
                      <span>
                        З'являється автоматично з розділу «Відгодівля» після
                        натискання кнопки «Продано» на клітці.
                      </span>
                    </div>
                  </div>
                  <div className="finances-note-item">
                    <span className="finances-note-icon">💰</span>
                    <div>
                      <strong>Вказати ціну</strong>
                      <span>
                        Одразу після продажу запис з'являється тут без ціни. У
                        вкладці «Доходи» клікни «➕ Вказати ціну» і впиши суму —
                        вона одразу врахується в загальний дохід.
                      </span>
                    </div>
                  </div>
                  <div className="finances-note-item">
                    <span className="finances-note-icon">🐇</span>
                    <div>
                      <strong>Інший дохід</strong>
                      <span>
                        Шкурки, послід, гній та інше вносяться вручну у вкладці
                        «Доходи» кнопкою «+ Додати дохід» — так само
                        враховується в загальному доході й прибутку.
                      </span>
                    </div>
                  </div>
                  <div className="finances-note-item">
                    <span className="finances-note-icon">🍖</span>
                    <div>
                      <strong>Власне споживання</strong>
                      <span>
                        Рахується автоматично з кнопки «Забій» у Відгодівлі — це
                        м'ясо для себе, не гроші, тому воно не входить у дохід і
                        прибуток. У вкладці «Доходи» можна вказати вагу туші за
                        одну голову (не жива вага, а саме м'ясо після обробки) і
                        ціну за кг — тоді система порахує умовну вартість усієї
                        партії, «якби продали» (вага × ціна × кількість голів).
                        Кількість голів і ця оцінна вартість видно на графіку
                        "Огляду" зеленою лінією.
                      </span>
                    </div>
                  </div>
                  <div className="finances-note-item">
                    <span className="finances-note-icon">🔻</span>
                    <div>
                      <strong>Витрати</strong>
                      <span>
                        Додаються вручну у вкладці «Витрати»: категорія (корм,
                        вет, обладнання, транспорт, інше), сума, дата та опис.
                      </span>
                    </div>
                  </div>
                  <div className="finances-note-item">
                    <span className="finances-note-icon">📈</span>
                    <div>
                      <strong>Прибуток</strong>
                      <span>
                        Розраховується автоматично: весь дохід (продажі + інший
                        дохід) мінус витрати — як загалом, так і по кожному
                        місяцю у вкладці «Огляд». Власне споживання на прибуток
                        не впливає — воно показується лише як окрема умовна
                        оцінка.
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
