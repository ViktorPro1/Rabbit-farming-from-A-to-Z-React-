import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import "./GrainRecipesHistory.css";

interface Props {
  session: Session;
}

interface RecipeItem {
  name: string;
  icon: string;
  kg: number;
  pct: number | null;
}

interface RecipeRow {
  id: string;
  created_at: string;
  mode: "breeding" | "fattening";
  total_kg: number;
  items: RecipeItem[];
}

// Список культур для ручного внесення — назва + іконка як в калькуляторі
const manualGrainOptions = [
  { name: "Овес", icon: "🌾" },
  { name: "Ячмінь", icon: "🌾" },
  { name: "Пшениця", icon: "🌾" },
  { name: "Висівка/Ґрис", icon: "🟫" },
  { name: "Кукурудза", icon: "🌽" },
  { name: "Горох", icon: "🟡" },
  { name: "Жито", icon: "🌾" },
  { name: "Гречка", icon: "⚫" },
  { name: "Соєва макуха", icon: "🟤" },
  { name: "Соняшникова макуха", icon: "🌻" },
  { name: "Люцерна подрібнена", icon: "🌿" },
];

interface ManualRow {
  name: string;
  kg: string;
}

const emptyManualRow: ManualRow = { name: manualGrainOptions[0].name, kg: "" };

export default function GrainRecipesHistory({ session }: Props) {
  const [recipes, setRecipes] = useState<RecipeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ── Ручне внесення ──
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualDate, setManualDate] = useState("");
  const [manualMode, setManualMode] = useState<"breeding" | "fattening">(
    "breeding",
  );
  const [manualRows, setManualRows] = useState<ManualRow[]>([
    { ...emptyManualRow },
  ]);
  const [manualSaving, setManualSaving] = useState(false);
  const [manualMsg, setManualMsg] = useState("");

  // ── Акордеон: секції "По місяцях" та "Історія" згортаються цілком ──
  const [monthsOpen, setMonthsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const loadRecipes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("grain_recipes")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setRecipes(data || []);
    } catch (err) {
      console.error(err);
      setError("Не вдалося завантажити раціони.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const addManualRow = () => {
    setManualRows((prev) => [...prev, { ...emptyManualRow }]);
  };

  const removeManualRow = (idx: number) => {
    setManualRows((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateManualRow = (
    idx: number,
    field: keyof ManualRow,
    value: string,
  ) => {
    setManualRows((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row)),
    );
  };

  const handleSaveManual = async () => {
    setManualMsg("");

    if (!manualDate) {
      setManualMsg("Вкажіть дату.");
      return;
    }

    const validRows = manualRows.filter(
      (r) => r.name && r.kg && Number(r.kg) > 0,
    );
    if (!validRows.length) {
      setManualMsg("Додайте хоча б одну культуру з вагою.");
      return;
    }

    const items: RecipeItem[] = validRows.map((r) => {
      const option = manualGrainOptions.find((o) => o.name === r.name);
      return {
        name: r.name,
        icon: option?.icon || "🌾",
        kg: Number(r.kg),
        pct: null,
      };
    });

    const totalKg = items.reduce((sum, item) => sum + item.kg, 0);

    setManualSaving(true);
    try {
      const { error } = await supabase.from("grain_recipes").insert({
        user_id: session.user.id,
        mode: manualMode,
        total_kg: totalKg,
        items,
        created_at: new Date(manualDate).toISOString(),
      });
      if (error) throw error;
      setManualMsg("Запис додано!");
      setManualRows([{ ...emptyManualRow }]);
      setManualDate("");
      loadRecipes();
    } catch (err) {
      console.error(err);
      setManualMsg("Помилка збереження. Спробуйте ще раз.");
    } finally {
      setManualSaving(false);
    }
  };

  // ── Загальний підсумок за весь час ──
  const totals: Record<string, { icon: string; kg: number }> = {};
  let totalAll = 0;
  recipes.forEach((r) =>
    r.items.forEach((item) => {
      if (!totals[item.name]) totals[item.name] = { icon: item.icon, kg: 0 };
      totals[item.name].kg += item.kg;
      totalAll += item.kg;
    }),
  );

  // ── Підсумок по місяцях ──
  interface MonthGroup {
    key: string;
    label: string;
    totals: Record<string, { icon: string; kg: number }>;
    totalKg: number;
  }

  const monthMap: Record<string, MonthGroup> = {};
  recipes.forEach((r) => {
    const d = new Date(r.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!monthMap[key]) {
      const label = d.toLocaleDateString("uk-UA", {
        month: "long",
        year: "numeric",
      });
      monthMap[key] = {
        key,
        label: label.charAt(0).toUpperCase() + label.slice(1),
        totals: {},
        totalKg: 0,
      };
    }
    r.items.forEach((item) => {
      if (!monthMap[key].totals[item.name]) {
        monthMap[key].totals[item.name] = { icon: item.icon, kg: 0 };
      }
      monthMap[key].totals[item.name].kg += item.kg;
      monthMap[key].totalKg += item.kg;
    });
  });

  const monthGroups = Object.values(monthMap).sort((a, b) =>
    b.key.localeCompare(a.key),
  );

  return (
    <main className="grh-page">
      <div className="grh-header-row">
        <div className="grh-header">
          <h1>🧾 Раціони</h1>
          <p>Історія розрахованих сумішей і загальні підсумки</p>
        </div>
        <button className="grh-back-btn" onClick={() => navigate("/registry")}>
          ⬅ Мої кролики
        </button>
      </div>

      <div className="grh-wrap">
        {/* ── РУЧНЕ ВНЕСЕННЯ (для записів з листочка) ── */}
        <div className="grh-card">
          <button
            className="grh-manual-toggle"
            onClick={() => setShowManualForm((v) => !v)}
          >
            <span>✏️ Додати запис вручну (заднім числом)</span>
            <span
              className={`grh-manual-arrow ${showManualForm ? "open" : ""}`}
            >
              ▾
            </span>
          </button>

          {showManualForm && (
            <div className="grh-manual-form">
              <label className="grh-manual-label">Дата</label>
              <input
                type="date"
                className="grh-manual-date"
                value={manualDate}
                onChange={(e) => setManualDate(e.target.value)}
              />

              <label className="grh-manual-label">Тип раціону</label>
              <select
                className="grh-manual-select"
                value={manualMode}
                onChange={(e) =>
                  setManualMode(e.target.value as "breeding" | "fattening")
                }
              >
                <option value="breeding">Племінне стадо</option>
                <option value="fattening">Відгодівля</option>
              </select>

              <label className="grh-manual-label">Культури і кг</label>
              {manualRows.map((row, idx) => (
                <div key={idx} className="grh-manual-row">
                  <select
                    className="grh-manual-select"
                    value={row.name}
                    onChange={(e) =>
                      updateManualRow(idx, "name", e.target.value)
                    }
                  >
                    {manualGrainOptions.map((o) => (
                      <option key={o.name} value={o.name}>
                        {o.icon} {o.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="кг"
                    className="grh-manual-kg-input"
                    value={row.kg}
                    onChange={(e) => updateManualRow(idx, "kg", e.target.value)}
                  />
                  {manualRows.length > 1 && (
                    <button
                      type="button"
                      className="grh-manual-remove"
                      onClick={() => removeManualRow(idx)}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                className="grh-manual-add-row"
                onClick={addManualRow}
              >
                + Додати культуру
              </button>

              {manualMsg && (
                <p
                  className={
                    manualMsg.startsWith("Запис")
                      ? "calc-alert ok"
                      : "calc-error"
                  }
                >
                  {manualMsg}
                </p>
              )}

              <button
                className="calc-btn"
                style={{ marginTop: "10px" }}
                onClick={handleSaveManual}
                disabled={manualSaving}
              >
                {manualSaving ? "Збереження..." : "Зберегти запис"}
              </button>
            </div>
          )}
        </div>

        {loading && <p className="grh-loading">Завантаження...</p>}
        {error && <p className="grh-error">{error}</p>}

        {!loading && !error && recipes.length === 0 && (
          <div className="grh-card grh-empty">
            <div className="grh-empty-icon">🧾</div>
            <p className="grh-empty-title">Ще немає збережених раціонів.</p>
            <p className="grh-empty-hint">
              Розрахуйте суміш у калькуляторі і натисніть «Додати відмітку», або
              додайте запис вручну вище.
            </p>
          </div>
        )}

        {!loading && !error && recipes.length > 0 && (
          <>
            {/* ── Загальний підсумок ── */}
            <div className="grh-card">
              <h2>Разом використано (за весь час)</h2>
              {Object.entries(totals)
                .sort((a, b) => b[1].kg - a[1].kg)
                .map(([name, t]) => (
                  <div key={name} className="grh-row">
                    <span className="grh-icon">{t.icon}</span>
                    <span className="grh-name">{name}</span>
                    <span className="grh-kg">
                      {Math.round(t.kg * 10) / 10} кг
                    </span>
                  </div>
                ))}
              <div className="grh-row grh-total-row">
                <span className="grh-name">Всього суміші</span>
                <span className="grh-kg">
                  {Math.round(totalAll * 10) / 10} кг
                </span>
              </div>
            </div>

            {/* ── Підсумок по місяцях (згортається цілком) ── */}
            <div className="grh-card">
              <button
                type="button"
                className="grh-section-toggle"
                onClick={() => setMonthsOpen((v) => !v)}
                aria-expanded={monthsOpen}
              >
                <h2>По місяцях</h2>
                <span
                  className={`grh-manual-arrow ${monthsOpen ? "open" : ""}`}
                >
                  ▾
                </span>
              </button>

              {monthsOpen &&
                monthGroups.map((m) => (
                  <div key={m.key} className="grh-month-block">
                    <div className="grh-month-header">
                      <span>{m.label}</span>
                      <span className="grh-kg">
                        {Math.round(m.totalKg * 10) / 10} кг
                      </span>
                    </div>
                    {Object.entries(m.totals)
                      .sort((a, b) => b[1].kg - a[1].kg)
                      .map(([name, t]) => (
                        <div key={name} className="grh-row">
                          <span className="grh-icon">{t.icon}</span>
                          <span className="grh-name">{name}</span>
                          <span className="grh-kg">
                            {Math.round(t.kg * 10) / 10} кг
                          </span>
                        </div>
                      ))}
                  </div>
                ))}
            </div>

            {/* ── Повна історія (згортається цілком) ── */}
            <div className="grh-card">
              <button
                type="button"
                className="grh-section-toggle"
                onClick={() => setHistoryOpen((v) => !v)}
                aria-expanded={historyOpen}
              >
                <h2>Історія</h2>
                <span
                  className={`grh-manual-arrow ${historyOpen ? "open" : ""}`}
                >
                  ▾
                </span>
              </button>

              {historyOpen &&
                recipes.map((r) => (
                  <div key={r.id} className="grh-entry">
                    <div className="grh-entry-header">
                      <span className="grh-entry-date">
                        {new Date(r.created_at).toLocaleDateString("uk-UA")}
                      </span>
                      <span className="grh-entry-mode">
                        {r.mode === "breeding"
                          ? "Племінне стадо"
                          : "Відгодівля"}{" "}
                        — {r.total_kg} кг
                      </span>
                    </div>
                    {r.items.map((item, i) => (
                      <div key={i} className="grh-row">
                        <span className="grh-icon">{item.icon}</span>
                        <span className="grh-name">{item.name}</span>
                        <span className="grh-kg">{item.kg} кг</span>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
