import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import "./AptechkaPage.css";

interface Props {
  session: Session;
}

interface MedicationBatch {
  id: string;
  expense_id: string | null;
  name: string;
  purchase_date: string;
  expiry_date: string | null;
  quantity_purchased: number | null;
  quantity_remaining: number | null;
  unit: string;
  needs_details: boolean;
  used_up: boolean;
}

const UNIT_OPTIONS = ["мл", "г", "кг", "табл.", "доз", "уп.", "од."];

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function isExpired(expiry_date: string | null) {
  if (!expiry_date) return false;
  return new Date(expiry_date) < new Date(todayStr());
}

function isExpiringSoon(expiry_date: string | null) {
  if (!expiry_date) return false;
  const diff =
    (new Date(expiry_date).getTime() - new Date(todayStr()).getTime()) /
    (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= 14;
}

const emptyManualForm = {
  name: "",
  quantity_purchased: "",
  unit: "мл",
  expiry_date: "",
  purchase_date: todayStr(),
};

const emptyDetailsForm = {
  quantity_purchased: "",
  unit: "мл",
  expiry_date: "",
};

export default function AptechkaPage({ session }: Props) {
  const [batches, setBatches] = useState<MedicationBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualForm, setManualForm] = useState(emptyManualForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [detailsEditId, setDetailsEditId] = useState<string | null>(null);
  const [detailsForm, setDetailsForm] = useState(emptyDetailsForm);

  const [remainingEditId, setRemainingEditId] = useState<string | null>(null);
  const [remainingValue, setRemainingValue] = useState("");

  const [showUsedUp, setShowUsedUp] = useState(false);
  const [showNote, setShowNote] = useState(false);

  const navigate = useNavigate();

  const loadData = useCallback(() => {
    supabase
      .from("medication_batches")
      .select("*")
      .eq("user_id", session.user.id)
      .order("purchase_date", { ascending: false })
      .then(
        ({ data }) => {
          setBatches(data || []);
          setLoading(false);
        },
        (err) => {
          console.error("Не вдалося завантажити аптечку:", err);
          setLoading(false);
        },
      );
  }, [session.user.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleAddManual() {
    setSaving(true);
    setError("");
    const hasDetails = Boolean(
      manualForm.quantity_purchased && manualForm.expiry_date,
    );
    const { error: dbErr } = await supabase.from("medication_batches").insert({
      user_id: session.user.id,
      name: manualForm.name,
      purchase_date: manualForm.purchase_date,
      expiry_date: manualForm.expiry_date || null,
      quantity_purchased: manualForm.quantity_purchased
        ? Number(manualForm.quantity_purchased)
        : null,
      quantity_remaining: manualForm.quantity_purchased
        ? Number(manualForm.quantity_purchased)
        : null,
      unit: manualForm.unit,
      needs_details: !hasDetails,
    });
    if (dbErr) {
      setError("Помилка збереження");
    } else {
      setManualForm(emptyManualForm);
      setShowManualForm(false);
      loadData();
    }
    setSaving(false);
  }

  function openDetailsEdit(b: MedicationBatch) {
    setDetailsEditId(b.id);
    setDetailsForm({
      quantity_purchased: b.quantity_purchased
        ? String(b.quantity_purchased)
        : "",
      unit: b.unit || "мл",
      expiry_date: b.expiry_date || "",
    });
  }

  async function handleSaveDetails(id: string) {
    if (!detailsForm.quantity_purchased || !detailsForm.expiry_date) return;
    await supabase
      .from("medication_batches")
      .update({
        quantity_purchased: Number(detailsForm.quantity_purchased),
        quantity_remaining: Number(detailsForm.quantity_purchased),
        unit: detailsForm.unit,
        expiry_date: detailsForm.expiry_date,
      })
      .eq("id", id);
    setDetailsEditId(null);
    loadData();
  }

  async function handleMarkUsedUp(id: string) {
    if (!confirm("Позначити препарат як повністю використаний?")) return;
    await supabase
      .from("medication_batches")
      .update({ used_up: true })
      .eq("id", id);
    loadData();
  }

  function openRemainingEdit(b: MedicationBatch) {
    setRemainingEditId(b.id);
    setRemainingValue(
      b.quantity_remaining !== null ? String(b.quantity_remaining) : "",
    );
  }

  async function handleSaveRemaining(id: string) {
    const value = Number(remainingValue);
    if (Number.isNaN(value) || value < 0) return;
    await supabase
      .from("medication_batches")
      .update({ quantity_remaining: value, used_up: value === 0 })
      .eq("id", id);
    setRemainingEditId(null);
    loadData();
  }

  async function handleDelete(id: string) {
    if (!confirm("Видалити запис з аптечки?")) return;
    await supabase.from("medication_batches").delete().eq("id", id);
    loadData();
  }

  const needsDetails = batches.filter((b) => b.needs_details && !b.used_up);
  const inStock = batches.filter((b) => !b.needs_details && !b.used_up);
  const usedUp = batches.filter((b) => b.used_up);

  return (
    <div className="aptechka-page">
      <div className="aptechka-header">
        <h1>&#128137; Аптечка</h1>
        <button
          className="aptechka-back-btn"
          onClick={() => navigate("/registry")}
        >
          &#8592; Мої кролики
        </button>
        <button
          className="aptechka-add-btn"
          onClick={() => setShowManualForm(!showManualForm)}
        >
          {showManualForm ? "\u2715 Скасувати" : "+ Додати вручну"}
        </button>
      </div>

      {showManualForm && (
        <div className="aptechka-form">
          <h2>Додати препарат вручну</h2>
          <p className="aptechka-form-hint">
            Для препаратів, куплених раніше, або отриманих без запису витрати.
            Витрати категорії "Ветеринарія" додаються сюди автоматично.
          </p>
          <div className="aptechka-form-grid">
            <input
              id="aptechka-manual-name"
              name="aptechka-manual-name"
              placeholder="Назва препарату *"
              value={manualForm.name}
              onChange={(e) =>
                setManualForm({ ...manualForm, name: e.target.value })
              }
            />
            <input
              id="aptechka-manual-quantity"
              name="aptechka-manual-quantity"
              type="number"
              min="0"
              placeholder="Кількість"
              value={manualForm.quantity_purchased}
              onChange={(e) =>
                setManualForm({
                  ...manualForm,
                  quantity_purchased: e.target.value,
                })
              }
            />
            <select
              id="aptechka-manual-unit"
              name="aptechka-manual-unit"
              value={manualForm.unit}
              onChange={(e) =>
                setManualForm({ ...manualForm, unit: e.target.value })
              }
            >
              {UNIT_OPTIONS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
            <div className="aptechka-field-wrap">
              <label htmlFor="aptechka-expiry">Термін придатності</label>
              <input
                id="aptechka-expiry"
                name="aptechka-expiry"
                type="date"
                value={manualForm.expiry_date}
                onChange={(e) =>
                  setManualForm({ ...manualForm, expiry_date: e.target.value })
                }
              />
            </div>
            <div className="aptechka-field-wrap">
              <label htmlFor="aptechka-purchase-date">Дата закупівлі</label>
              <input
                id="aptechka-purchase-date"
                name="aptechka-purchase-date"
                type="date"
                value={manualForm.purchase_date}
                onChange={(e) =>
                  setManualForm({
                    ...manualForm,
                    purchase_date: e.target.value,
                  })
                }
              />
            </div>
          </div>
          {error && <p className="aptechka-error">{error}</p>}
          <button
            className="aptechka-save-btn"
            onClick={handleAddManual}
            disabled={saving || !manualForm.name}
          >
            {saving ? "Збереження..." : "Зберегти"}
          </button>
        </div>
      )}

      {loading ? (
        <p className="aptechka-loading">Завантаження...</p>
      ) : (
        <>
          {needsDetails.length > 0 && (
            <div className="aptechka-needs-block">
              <h2 className="aptechka-needs-title">
                &#9888;&#65039; Потребує уточнення ({needsDetails.length})
              </h2>
              <p className="aptechka-needs-hint">
                Витрати категорії "Ветеринарія" потрапляють сюди автоматично.
                Впиши кількість і термін придатності, щоб препарат з'явився на
                складі.
              </p>
              <div className="aptechka-grid">
                {needsDetails.map((b) => (
                  <div key={b.id} className="aptechka-card needs">
                    <div className="aptechka-card-top">
                      <span className="aptechka-name">{b.name}</span>
                    </div>
                    <p className="aptechka-date">
                      Куплено:{" "}
                      {new Date(b.purchase_date).toLocaleDateString("uk-UA")}
                    </p>
                    {detailsEditId === b.id ? (
                      <div className="aptechka-inline-form">
                        <input
                          id={`aptechka-details-qty-${b.id}`}
                          name={`aptechka-details-qty-${b.id}`}
                          type="number"
                          min="0"
                          placeholder="Кількість"
                          value={detailsForm.quantity_purchased}
                          onChange={(e) =>
                            setDetailsForm({
                              ...detailsForm,
                              quantity_purchased: e.target.value,
                            })
                          }
                        />
                        <select
                          id={`aptechka-details-unit-${b.id}`}
                          name={`aptechka-details-unit-${b.id}`}
                          value={detailsForm.unit}
                          onChange={(e) =>
                            setDetailsForm({
                              ...detailsForm,
                              unit: e.target.value,
                            })
                          }
                        >
                          {UNIT_OPTIONS.map((u) => (
                            <option key={u} value={u}>
                              {u}
                            </option>
                          ))}
                        </select>
                        <input
                          id={`aptechka-details-expiry-${b.id}`}
                          name={`aptechka-details-expiry-${b.id}`}
                          type="date"
                          value={detailsForm.expiry_date}
                          onChange={(e) =>
                            setDetailsForm({
                              ...detailsForm,
                              expiry_date: e.target.value,
                            })
                          }
                        />
                        <div className="aptechka-inline-actions">
                          <button
                            className="aptechka-save-btn small"
                            onClick={() => handleSaveDetails(b.id)}
                            disabled={
                              !detailsForm.quantity_purchased ||
                              !detailsForm.expiry_date
                            }
                          >
                            &#10003; Зберегти
                          </button>
                          <button
                            className="aptechka-cancel-btn small"
                            onClick={() => setDetailsEditId(null)}
                          >
                            Скасувати
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="aptechka-fill-btn"
                        onClick={() => openDetailsEdit(b)}
                      >
                        &#10133; Вказати кількість і термін
                      </button>
                    )}
                    <button
                      className="aptechka-delete-link"
                      onClick={() => handleDelete(b.id)}
                    >
                      Видалити
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <h2 className="aptechka-all-title">
            На складі {inStock.length > 0 && `(${inStock.length})`}
          </h2>
          {inStock.length === 0 ? (
            <div className="aptechka-empty-state">
              <div className="aptechka-empty-illustration">&#128137;</div>
              <h3 className="aptechka-empty-title">Порожньо</h3>
              <p className="aptechka-empty-desc">
                Тут з'являться препарати, для яких вказано кількість і термін
                придатності.
              </p>
            </div>
          ) : (
            <div className="aptechka-grid">
              {inStock.map((b) => (
                <div
                  key={b.id}
                  className={`aptechka-card ${
                    isExpired(b.expiry_date)
                      ? "expired"
                      : isExpiringSoon(b.expiry_date)
                        ? "expiring"
                        : ""
                  }`}
                >
                  <div className="aptechka-card-top">
                    <span className="aptechka-name">{b.name}</span>
                    {isExpired(b.expiry_date) && (
                      <span className="badge badge-expired">Прострочено</span>
                    )}
                    {isExpiringSoon(b.expiry_date) &&
                      !isExpired(b.expiry_date) && (
                        <span className="badge badge-expiring">
                          Спливає термін
                        </span>
                      )}
                  </div>
                  {remainingEditId === b.id ? (
                    <div className="aptechka-inline-form row">
                      <input
                        id={`aptechka-remaining-${b.id}`}
                        name={`aptechka-remaining-${b.id}`}
                        type="number"
                        min="0"
                        value={remainingValue}
                        onChange={(e) => setRemainingValue(e.target.value)}
                        style={{ width: "80px" }}
                      />
                      <span>{b.unit}</span>
                      <button
                        className="aptechka-save-btn small"
                        onClick={() => handleSaveRemaining(b.id)}
                      >
                        &#10003;
                      </button>
                      <button
                        className="aptechka-cancel-btn small"
                        onClick={() => setRemainingEditId(null)}
                      >
                        &#10005;
                      </button>
                    </div>
                  ) : (
                    <button
                      className="aptechka-remaining-btn"
                      onClick={() => openRemainingEdit(b)}
                    >
                      &#128202; Залишок: {b.quantity_remaining ?? "?"} {b.unit}{" "}
                      із {b.quantity_purchased} {b.unit}
                    </button>
                  )}
                  {b.expiry_date && (
                    <p className="aptechka-expiry">
                      Термін до:{" "}
                      {new Date(b.expiry_date).toLocaleDateString("uk-UA")}
                    </p>
                  )}
                  <div className="aptechka-card-actions">
                    <button
                      className="aptechka-usedup-btn"
                      onClick={() => handleMarkUsedUp(b.id)}
                    >
                      Використано все
                    </button>
                    <button
                      className="aptechka-delete-btn"
                      onClick={() => handleDelete(b.id)}
                    >
                      Видалити
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {usedUp.length > 0 && (
            <div className="aptechka-usedup-block">
              <button
                className="aptechka-usedup-toggle"
                onClick={() => setShowUsedUp(!showUsedUp)}
              >
                <span>Використані ({usedUp.length})</span>
                <span>{showUsedUp ? "▲" : "▼"}</span>
              </button>
              {showUsedUp && (
                <div className="aptechka-grid">
                  {usedUp.map((b) => (
                    <div key={b.id} className="aptechka-card used">
                      <span className="aptechka-name">{b.name}</span>
                      <p className="aptechka-date">
                        Куплено:{" "}
                        {new Date(b.purchase_date).toLocaleDateString("uk-UA")}
                      </p>
                      <button
                        className="aptechka-delete-link"
                        onClick={() => handleDelete(b.id)}
                      >
                        Видалити
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Зноска: звідки беруться записи в аптечці ── */}
          <div className="aptechka-note">
            <button
              className="aptechka-note-toggle"
              onClick={() => setShowNote(!showNote)}
            >
              <span>&#10067; Звідки беруться записи в аптечці</span>
              <span>{showNote ? "▲" : "▼"}</span>
            </button>

            {showNote && (
              <>
                <p>
                  Записи з'являються тут автоматично або вносяться вручну, а
                  статус (потребує уточнення / на складі / використано) система
                  визначає сама.
                </p>
                <div className="aptechka-note-grid">
                  <div className="aptechka-note-item">
                    <span className="aptechka-note-icon">&#128176;</span>
                    <div>
                      <strong>Автоматично з "Фінансів"</strong>
                      <span>
                        Щойно додаєте витрати в категорією "Ветеринарія" на
                        сторінці "Фінанси", запис одразу з'являється тут у блоці
                        "Потребує уточнення" — назва підтягується з опису
                        витрати.
                      </span>
                    </div>
                  </div>
                  <div className="aptechka-note-item">
                    <span className="aptechka-note-icon">&#9888;&#65039;</span>
                    <div>
                      <strong>Потребує уточнення</strong>
                      <span>
                        Поки не вказано кількість і термін придатності, препарат
                        висить у цьому блоці. Тисніть "Вказати кількість і
                        термін" — після збереження запис сам переходить на
                        склад.
                      </span>
                    </div>
                  </div>
                  <div className="aptechka-note-item">
                    <span className="aptechka-note-icon">&#128230;</span>
                    <div>
                      <strong>На складі</strong>
                      <span>
                        Показує залишок кожного препарату і термін придатності.
                        Бейджі "Прострочено"/"Спливає термін" з'являються
                        автоматично — за 14 днів до і після дати.
                      </span>
                    </div>
                  </div>
                  <div className="aptechka-note-item">
                    <span className="aptechka-note-icon">&#9997;&#65039;</span>
                    <div>
                      <strong>Додати вручну</strong>
                      <span>
                        Для препаратів, куплених раніше або отриманих без запису
                        витрати — не пов'язується з "Фінансами", але з'являється
                        в тих самих списках.
                      </span>
                    </div>
                  </div>
                  <div className="aptechka-note-item">
                    <span className="aptechka-note-icon">&#9989;</span>
                    <div>
                      <strong>Використано все / залишок</strong>
                      <span>
                        Клікніть на залишок, щоб вписати точну кількість, або
                        тисніть "Використано все" — тоді запис переходить в
                        архів "Використані" внизу сторінки.
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
