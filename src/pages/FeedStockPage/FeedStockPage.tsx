import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import { logError } from "../../lib/logError";
import { todayKyiv } from "../../utils/kyivDate";
import "./FeedStockPage.css";

interface Props {
  session: Session;
}

interface FeedBatch {
  id: string;
  expense_id: string | null;
  name: string;
  purchase_date: string;
  quantity_purchased: number | null;
  quantity_remaining: number | null;
  needs_details: boolean;
  used_up: boolean;
}

// Партія вважається такою, що закінчується, коли лишилось 20% і менше
const LOW_STOCK_RATIO = 0.2;

type Unit = "g" | "kg";

// У базі все зберігається в кілограмах. Грами лише для введення й показу.
// Показ: менше 1 кг виводиться в грамах (250 г), від 1 кг у кілограмах (1,25 кг)
function formatQty(kg: number) {
  if (kg > 0 && kg < 1) {
    return `${Math.round(kg * 1000).toLocaleString("uk-UA")} г`;
  }
  return `${Number(kg.toFixed(3)).toLocaleString("uk-UA")} кг`;
}

// Точність до грама (0,001 кг)
function round3(value: number) {
  return Math.round(value * 1000) / 1000;
}

function toKg(value: number, unit: Unit) {
  return round3(unit === "g" ? value / 1000 : value);
}

// Невеликі партії (до 5 кг, наприклад премікс) зручніше вести в грамах
function defaultUnit(b: FeedBatch): Unit {
  return b.quantity_purchased !== null && b.quantity_purchased <= 5
    ? "g"
    : "kg";
}

function UnitSelect({
  id,
  value,
  onChange,
}: {
  id: string;
  value: Unit;
  onChange: (unit: Unit) => void;
}) {
  return (
    <select
      id={id}
      name={id}
      aria-label="Одиниця виміру"
      className="feedstock-unit-select"
      value={value}
      onChange={(e) => onChange(e.target.value as Unit)}
    >
      <option value="g">г</option>
      <option value="kg">кг</option>
    </select>
  );
}

function newForm() {
  return {
    name: "",
    quantity: "",
    unit: "kg" as Unit,
    purchase_date: todayKyiv(),
  };
}

function isLow(b: FeedBatch) {
  return (
    b.quantity_purchased !== null &&
    b.quantity_purchased > 0 &&
    b.quantity_remaining !== null &&
    b.quantity_remaining <= b.quantity_purchased * LOW_STOCK_RATIO
  );
}

export default function FeedStockPage({ session }: Props) {
  const [batches, setBatches] = useState<FeedBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(newForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  // Одне поле вводу на партію: або кількість закупленого (для партій без
  // кількості), або кількість для списання (для партій у наявності)
  const [inputs, setInputs] = useState<Record<string, string>>({});
  // Обрана одиниця (г або кг) для поля вводу кожної партії
  const [units, setUnits] = useState<Record<string, Unit>>({});
  const [showUsed, setShowUsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    supabase
      .from("feed_batches")
      .select(
        "id, expense_id, name, purchase_date, quantity_purchased, quantity_remaining, needs_details, used_up",
      )
      .eq("user_id", session.user.id)
      .order("purchase_date", { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          logError("FeedStockPage.load", error);
          setPageError("Не вдалося завантажити облік кормів. Оновіть сторінку");
          setLoading(false);
          return;
        }
        setPageError("");
        setBatches((data as FeedBatch[]) || []);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [session.user.id, refreshKey]);

  function reload() {
    setRefreshKey((k) => k + 1);
  }

  function setInput(id: string, value: string) {
    setInputs((prev) => ({ ...prev, [id]: value }));
  }

  function clearInput(id: string) {
    setInputs((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function unitOf(b: FeedBatch): Unit {
    return units[b.id] ?? defaultUnit(b);
  }

  async function handleAddBatch() {
    const quantity = toKg(Number(form.quantity), form.unit);
    if (!form.name.trim() || !quantity || quantity <= 0) return;
    setSaving(true);
    setFormError("");
    const { error } = await supabase.from("feed_batches").insert({
      user_id: session.user.id,
      name: form.name.trim(),
      purchase_date: form.purchase_date,
      quantity_purchased: quantity,
    });
    if (error) {
      logError("FeedStockPage.handleAddBatch", error);
      setFormError("Помилка збереження");
    } else {
      setForm(newForm());
      setShowForm(false);
      reload();
    }
    setSaving(false);
  }

  // Вписати, скільки куплено в грамах або кілограмах (для партій з витрат)
  async function handleSaveQuantity(batch: FeedBatch) {
    const value = toKg(Number(inputs[batch.id]), unitOf(batch));
    if (!value || value <= 0) return;
    setPageError("");
    const { error } = await supabase
      .from("feed_batches")
      .update({ quantity_purchased: value })
      .eq("id", batch.id);
    if (error) {
      logError("FeedStockPage.handleSaveQuantity", error);
      setPageError("Не вдалося зберегти кількість. Спробуйте ще раз");
      return;
    }
    clearInput(batch.id);
    reload();
  }

  async function handleWriteOff(batch: FeedBatch) {
    const value = toKg(Number(inputs[batch.id]), unitOf(batch));
    if (!value || value <= 0) return;
    const remaining = batch.quantity_remaining ?? 0;
    if (value > remaining) {
      setPageError(
        `Не можна списати ${formatQty(value)}: у партії «${batch.name}» лишилось ${formatQty(remaining)}`,
      );
      return;
    }
    setPageError("");
    const { error } = await supabase
      .from("feed_batches")
      .update({ quantity_remaining: round3(remaining - value) })
      .eq("id", batch.id);
    if (error) {
      logError("FeedStockPage.handleWriteOff", error);
      setPageError("Не вдалося списати корм. Спробуйте ще раз");
      return;
    }
    clearInput(batch.id);
    reload();
  }

  async function handleUsedUp(batch: FeedBatch) {
    if (!confirm(`Позначити «${batch.name}» як повністю використане?`)) return;
    setPageError("");
    const { error } = await supabase
      .from("feed_batches")
      .update({ used_up: true })
      .eq("id", batch.id);
    if (error) {
      logError("FeedStockPage.handleUsedUp", error);
      setPageError("Не вдалося оновити партію. Спробуйте ще раз");
      return;
    }
    reload();
  }

  async function handleDelete(batch: FeedBatch) {
    if (!confirm(`Видалити партію «${batch.name}»?`)) return;
    setPageError("");
    const { error } = await supabase
      .from("feed_batches")
      .delete()
      .eq("id", batch.id);
    if (error) {
      logError("FeedStockPage.handleDelete", error);
      setPageError("Не вдалося видалити партію. Спробуйте ще раз");
      return;
    }
    reload();
  }

  const needsDetails = batches.filter(
    (b) => !b.used_up && b.quantity_purchased === null,
  );
  const inStock = batches.filter(
    (b) => !b.used_up && b.quantity_purchased !== null,
  );
  const used = batches.filter((b) => b.used_up);

  const totalRemaining = inStock.reduce(
    (s, b) => s + (b.quantity_remaining ?? 0),
    0,
  );
  const lowCount = inStock.filter(isLow).length;

  function renderDate(value: string) {
    return new Date(value).toLocaleDateString("uk-UA");
  }

  return (
    <div className="feedstock-page">
      <div className="feedstock-header">
        <h1>🌾 Запаси кормів</h1>
        <button
          className="feedstock-back-btn"
          onClick={() => navigate("/registry")}
        >
          ⬅ Мої кролики
        </button>
      </div>

      {pageError && <p className="feedstock-error">{pageError}</p>}

      {loading ? (
        <div className="feedstock-loading">Завантаження...</div>
      ) : pageError && batches.length === 0 ? null : (
        <>
          <div className="feedstock-summary">
            <div className="feedstock-summary-card">
              <span className="feedstock-summary-val">
                {formatQty(totalRemaining)}
              </span>
              <span className="feedstock-summary-label">
                Всього в наявності
              </span>
            </div>
            <div className="feedstock-summary-card">
              <span
                className="feedstock-summary-val"
                style={{ color: lowCount > 0 ? "#b71c1c" : undefined }}
              >
                {lowCount}
              </span>
              <span className="feedstock-summary-label">Закінчуються</span>
            </div>
            <div className="feedstock-summary-card">
              <span className="feedstock-summary-val">
                {needsDetails.length}
              </span>
              <span className="feedstock-summary-label">Без кількості</span>
            </div>
          </div>

          <button
            className="feedstock-add-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Скасувати" : "+ Додати корм вручну"}
          </button>

          {showForm && (
            <div className="feedstock-form">
              <div className="feedstock-form-field">
                <label htmlFor="feed-name">Назва *</label>
                <input
                  id="feed-name"
                  placeholder="Наприклад: ячмінь, лучерна, премікс"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="feedstock-form-field">
                <label htmlFor="feed-quantity">Кількість *</label>
                <div className="feedstock-qty-row">
                  <input
                    id="feed-quantity"
                    type="number"
                    inputMode="decimal"
                    placeholder="0"
                    value={form.quantity}
                    onChange={(e) =>
                      setForm({ ...form, quantity: e.target.value })
                    }
                  />
                  <UnitSelect
                    id="feed-unit"
                    value={form.unit}
                    onChange={(unit) => setForm({ ...form, unit })}
                  />
                </div>
              </div>
              <div className="feedstock-form-field">
                <label htmlFor="feed-date">Дата надходження *</label>
                <input
                  id="feed-date"
                  type="date"
                  value={form.purchase_date}
                  onChange={(e) =>
                    setForm({ ...form, purchase_date: e.target.value })
                  }
                />
              </div>
              <p className="feedstock-hint">
                Корм, який уже внесено у Фінанси як витрату категорії «Корм»,
                додавати тут не потрібно: він з'являється сам.
              </p>
              {formError && <p className="feedstock-error">{formError}</p>}
              <button
                className="feedstock-save-btn"
                onClick={handleAddBatch}
                disabled={
                  saving ||
                  !form.name.trim() ||
                  !form.quantity ||
                  !form.purchase_date
                }
              >
                {saving ? "Збереження..." : "Зберегти"}
              </button>
            </div>
          )}

          {batches.length === 0 && (
            <div className="feedstock-empty">
              <h3>Записів ще немає</h3>
              <p>
                Внесіть витрату з категорією «Корм» у розділі Фінанси: партія
                з'явиться тут автоматично. Або додайте корм вручну.
              </p>
            </div>
          )}

          {needsDetails.length > 0 && (
            <section className="feedstock-section">
              <h2>Потребують уточнення</h2>
              <p className="feedstock-hint">
                Ці партії створені з витрат. Впишіть, скільки куплено (в грамах
                або кілограмах), щоб вони потрапили в облік залишку.
              </p>
              {needsDetails.map((b) => (
                <div key={b.id} className="feedstock-row attention">
                  <div className="feedstock-row-main">
                    <span className="feedstock-row-name">{b.name}</span>
                    <span className="feedstock-row-meta">
                      Куплено {renderDate(b.purchase_date)}
                    </span>
                  </div>
                  <div className="feedstock-row-actions">
                    <input
                      id={`feed-qty-${b.id}`}
                      name={`feed-qty-${b.id}`}
                      type="number"
                      inputMode="decimal"
                      placeholder="Кількість"
                      value={inputs[b.id] ?? ""}
                      onChange={(e) => setInput(b.id, e.target.value)}
                    />
                    <UnitSelect
                      id={`feed-qty-unit-${b.id}`}
                      value={unitOf(b)}
                      onChange={(unit) =>
                        setUnits((prev) => ({ ...prev, [b.id]: unit }))
                      }
                    />
                    <button
                      className="feedstock-save-btn small"
                      onClick={() => handleSaveQuantity(b)}
                      disabled={!inputs[b.id]}
                    >
                      Зберегти
                    </button>
                    <button
                      className="feedstock-link-btn"
                      onClick={() => handleDelete(b)}
                    >
                      Видалити
                    </button>
                  </div>
                </div>
              ))}
            </section>
          )}

          {inStock.length > 0 && (
            <section className="feedstock-section">
              <h2>У наявності</h2>
              {inStock.map((b) => {
                const remaining = b.quantity_remaining ?? 0;
                const purchased = b.quantity_purchased ?? 0;
                const percent =
                  purchased > 0
                    ? Math.min(100, Math.round((remaining / purchased) * 100))
                    : 0;
                const low = isLow(b);
                return (
                  <div
                    key={b.id}
                    className={`feedstock-row ${low ? "low" : ""}`}
                  >
                    <div className="feedstock-row-main">
                      <span className="feedstock-row-name">{b.name}</span>
                      <span className="feedstock-row-meta">
                        Куплено {renderDate(b.purchase_date)},{" "}
                        {formatQty(purchased)}
                      </span>
                      <div className="feedstock-bar">
                        <div
                          className="feedstock-bar-fill"
                          style={{
                            width: `${percent}%`,
                            background: low ? "#b71c1c" : undefined,
                          }}
                        />
                      </div>
                      <span
                        className="feedstock-row-remaining"
                        style={{ color: low ? "#b71c1c" : undefined }}
                      >
                        Лишилось {formatQty(remaining)}
                        {low ? " (закінчується)" : ""}
                      </span>
                    </div>
                    <div className="feedstock-row-actions">
                      <input
                        id={`feed-writeoff-${b.id}`}
                        name={`feed-writeoff-${b.id}`}
                        type="number"
                        inputMode="decimal"
                        placeholder="Списати"
                        value={inputs[b.id] ?? ""}
                        onChange={(e) => setInput(b.id, e.target.value)}
                      />
                      <UnitSelect
                        id={`feed-writeoff-unit-${b.id}`}
                        value={unitOf(b)}
                        onChange={(unit) =>
                          setUnits((prev) => ({ ...prev, [b.id]: unit }))
                        }
                      />
                      <button
                        className="feedstock-save-btn small"
                        onClick={() => handleWriteOff(b)}
                        disabled={!inputs[b.id]}
                      >
                        Списати
                      </button>
                      <button
                        className="feedstock-link-btn"
                        onClick={() => handleUsedUp(b)}
                      >
                        Використано все
                      </button>
                      <button
                        className="feedstock-link-btn"
                        onClick={() => handleDelete(b)}
                      >
                        Видалити
                      </button>
                    </div>
                  </div>
                );
              })}
            </section>
          )}

          {used.length > 0 && (
            <section className="feedstock-section">
              <button
                className="feedstock-toggle"
                onClick={() => setShowUsed(!showUsed)}
              >
                <span>Використано ({used.length})</span>
                <span>{showUsed ? "Згорнути" : "Показати"}</span>
              </button>
              {showUsed &&
                used.map((b) => (
                  <div key={b.id} className="feedstock-row used">
                    <div className="feedstock-row-main">
                      <span className="feedstock-row-name">{b.name}</span>
                      <span className="feedstock-row-meta">
                        Куплено {renderDate(b.purchase_date)}
                        {b.quantity_purchased !== null
                          ? `, ${formatQty(b.quantity_purchased)}`
                          : ""}
                      </span>
                    </div>
                    <div className="feedstock-row-actions">
                      <button
                        className="feedstock-link-btn"
                        onClick={() => handleDelete(b)}
                      >
                        Видалити
                      </button>
                    </div>
                  </div>
                ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}
