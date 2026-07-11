import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { QRCodeCanvas } from "qrcode.react";
import { supabase } from "../../lib/supabase";
import "./Fattening.css";

interface Props {
  session: Session;
}

interface FatteningCage {
  id: string;
  cage_number: string;
  males: number;
  females: number;
  unknown: number;
  breed: string;
  birth_year: string;
  birth_date: string;
  slaughter_date: string;
  notes: string;
}

const emptyForm = {
  cage_number: "",
  males: "",
  females: "",
  unknown: "",
  breed: "",
  birth_year: "",
  birth_date: "",
  slaughter_date: "",
  notes: "",
};

function calcSlaughterDate(birthDate: string): string {
  if (!birthDate) return "";
  const d = new Date(birthDate);
  d.setDate(d.getDate() + 110);
  return d.toISOString().split("T")[0];
}

function todayIso(): string {
  return new Date().toISOString().split("T")[0];
}

export default function Fattening({ session }: Props) {
  const [cages, setCages] = useState<FatteningCage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [editingCage, setEditingCage] = useState<FatteningCage | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showNote, setShowNote] = useState(false);

  // Модалка забою
  const [slaughterCage, setSlaughterCage] = useState<FatteningCage | null>(
    null,
  );
  const [slaughterDate, setSlaughterDate] = useState(todayIso());
  const [slaughterSaving, setSlaughterSaving] = useState(false);

  // Модалка продажу
  const [sellCage, setSellCage] = useState<FatteningCage | null>(null);
  const [sellMales, setSellMales] = useState("");
  const [sellFemales, setSellFemales] = useState("");
  const [sellUnknown, setSellUnknown] = useState("");
  const [sellSaving, setSellSaving] = useState(false);
  const [sellError, setSellError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    supabase
      .from("fattening")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("is_active", true)
      .order("cage_number", { ascending: true })
      .then(({ data }) => {
        setCages(data || []);
        setLoading(false);
      });
  }, [session.user.id]);

  async function fetchCages() {
    const { data } = await supabase
      .from("fattening")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("is_active", true)
      .order("cage_number", { ascending: true });
    setCages(data || []);
  }

  async function handleAdd() {
    setSaving(true);
    setError("");
    const { error } = await supabase.from("fattening").insert({
      user_id: session.user.id,
      cage_number: form.cage_number,
      males: Number(form.males) || 0,
      females: Number(form.females) || 0,
      unknown: Number(form.unknown) || 0,
      breed: form.breed || null,
      birth_year: form.birth_year || null,
      birth_date: form.birth_date || null,
      slaughter_date: form.slaughter_date || null,
      notes: form.notes || null,
    });
    if (error) {
      setError("Помилка збереження");
    } else {
      setForm(emptyForm);
      setShowForm(false);
      fetchCages();
    }
    setSaving(false);
  }

  async function handleEdit() {
    if (!editingCage) return;
    setSaving(true);
    setError("");
    const { error } = await supabase
      .from("fattening")
      .update({
        cage_number: editingCage.cage_number,
        males: Number(editingCage.males) || 0,
        females: Number(editingCage.females) || 0,
        unknown: Number(editingCage.unknown) || 0,
        breed: editingCage.breed || null,
        birth_year: editingCage.birth_year || null,
        birth_date: editingCage.birth_date || null,
        slaughter_date: editingCage.slaughter_date || null,
        notes: editingCage.notes || null,
      })
      .eq("id", editingCage.id);
    if (error) {
      setError("Помилка збереження");
    } else {
      setEditingCage(null);
      fetchCages();
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Видалити клітку?")) return;
    await supabase.from("fattening").update({ is_active: false }).eq("id", id);
    fetchCages();
  }

  function openSlaughterModal(cage: FatteningCage) {
    setSlaughterCage(cage);
    setSlaughterDate(todayIso());
  }

  function openSellModal(cage: FatteningCage) {
    setSellCage(cage);
    setSellMales("");
    setSellFemales("");
    setSellUnknown("");
    setSellError("");
  }

  async function handleSell() {
    if (!sellCage) return;
    const m = Number(sellMales) || 0;
    const f = Number(sellFemales) || 0;
    const u = Number(sellUnknown) || 0;

    if (m === 0 && f === 0 && u === 0) {
      setSellError("Вкажіть кількість проданих");
      return;
    }
    if (m > sellCage.males || f > sellCage.females || u > sellCage.unknown) {
      setSellError("Продано більше, ніж є в клітці");
      return;
    }

    setSellSaving(true);

    // 1. Записуємо факт продажу в окрему таблицю
    const { error: saleError } = await supabase.from("sales").insert({
      user_id: session.user.id,
      fattening_id: sellCage.id,
      cage_number: sellCage.cage_number,
      breed: sellCage.breed || null,
      males: m,
      females: f,
      unknown: u,
      sold_at: todayIso(),
    });

    if (saleError) {
      setSellError("Помилка збереження продажу");
      setSellSaving(false);
      return;
    }

    // 2. Оновлюємо залишок у клітці
    const newMales = sellCage.males - m;
    const newFemales = sellCage.females - f;
    const newUnknown = sellCage.unknown - u;
    const allSold = newMales === 0 && newFemales === 0 && newUnknown === 0;

    if (allSold) {
      await supabase
        .from("fattening")
        .update({ is_active: false })
        .eq("id", sellCage.id);
    } else {
      await supabase
        .from("fattening")
        .update({
          males: newMales,
          females: newFemales,
          unknown: newUnknown,
        })
        .eq("id", sellCage.id);
    }

    setSellCage(null);
    setSellSaving(false);
    fetchCages();
  }

  async function handleSlaughter() {
    if (!slaughterCage) return;
    setSlaughterSaving(true);
    await supabase
      .from("fattening")
      .update({ is_active: false, slaughtered_at: slaughterDate })
      .eq("id", slaughterCage.id);
    setSlaughterCage(null);
    setSlaughterSaving(false);
    fetchCages();
  }

  function downloadQr(cage: FatteningCage) {
    const canvas = document.getElementById(
      `qr-fat-${cage.id}`,
    ) as HTMLCanvasElement | null;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `qr-відгодівля-клітка-${cage.cage_number}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  const baseUrl = window.location.origin;
  const totalMales = cages.reduce((s, c) => s + (c.males || 0), 0);
  const totalFemales = cages.reduce((s, c) => s + (c.females || 0), 0);
  const totalUnknown = cages.reduce((s, c) => s + (c.unknown || 0), 0);
  const total = totalMales + totalFemales + totalUnknown;

  return (
    <div className="fattening-page">
      <div className="fattening-header">
        <h1>🥩 Відгодівля</h1>
        <button
          className="fattening-back-btn"
          onClick={() => navigate("/registry")}
        >
          ⬅ Мої кролики
        </button>
      </div>

      {/* МОДАЛКА ЗАБОЮ */}
      {slaughterCage && (
        <div className="help-overlay" onClick={() => setSlaughterCage(null)}>
          <div
            className="help-modal"
            style={{ maxWidth: 380 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="help-modal-header">
              <h2>Підтвердити забій</h2>
              <button
                className="help-close"
                onClick={() => setSlaughterCage(null)}
              >
                ✕
              </button>
            </div>
            <p style={{ margin: "12px 0 8px" }}>
              Клітка <strong>№ {slaughterCage.cage_number}</strong>
              {slaughterCage.breed ? ` · ${slaughterCage.breed}` : ""}
            </p>
            <div className="fattening-form-field" style={{ marginBottom: 16 }}>
              <label>Дата забою</label>
              <input
                type="date"
                value={slaughterDate}
                onChange={(e) => setSlaughterDate(e.target.value)}
              />
            </div>
            <div className="fattening-edit-actions">
              <button
                className="fattening-cancel-btn"
                onClick={() => setSlaughterCage(null)}
              >
                Скасувати
              </button>
              <button
                className="fattening-save-btn"
                onClick={handleSlaughter}
                disabled={slaughterSaving}
              >
                {slaughterSaving ? "Збереження..." : "✅ Підтвердити"}
              </button>
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
              <h2>QR-коди — Відгодівля</h2>
              <button
                className="help-close"
                onClick={() => setShowQrModal(false)}
              >
                ✕
              </button>
            </div>
            <p className="qr-modal-desc">
              Збережіть QR-код, роздрукуйте і прикріпіть на клітку. При
              скануванні відкриється паспорт клітки відгодівлі.
            </p>
            {cages.length === 0 ? (
              <p className="qr-modal-empty">Немає кліток у відгодівлі.</p>
            ) : (
              <div className="qr-grid">
                {cages.map((cage) => (
                  <div key={cage.id} className="qr-item">
                    <div className="qr-item-title">
                      Клітка № {cage.cage_number}
                    </div>
                    <div className="qr-item-name">
                      {cage.breed || "Відгодівля"}
                    </div>
                    <QRCodeCanvas
                      id={`qr-fat-${cage.id}`}
                      value={`${baseUrl}/fattening-public/${cage.id}`}
                      size={180}
                      bgColor="#fffef5"
                      fgColor="#27500A"
                      level="H"
                      marginSize={2}
                    />
                    <button
                      className="qr-download-btn"
                      onClick={() => downloadQr(cage)}
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

      {/* МОДАЛКА ПРОДАЖУ */}
      {sellCage && (
        <div className="help-overlay" onClick={() => setSellCage(null)}>
          <div
            className="help-modal"
            style={{ maxWidth: 380 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="help-modal-header">
              <h2>Продано з клітки</h2>
              <button className="help-close" onClick={() => setSellCage(null)}>
                ✕
              </button>
            </div>
            <p style={{ margin: "12px 0 8px" }}>
              Клітка <strong>№ {sellCage.cage_number}</strong>
              {sellCage.breed ? ` · ${sellCage.breed}` : ""}
            </p>
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--gray)",
                margin: "0 0 12px",
              }}
            >
              В наявності: ♂ {sellCage.males} · ♀ {sellCage.females}
              {sellCage.unknown > 0 ? ` · ? ${sellCage.unknown}` : ""}
            </p>
            <div
              className="fattening-form-grid"
              style={{ gridTemplateColumns: "1fr 1fr" }}
            >
              <div className="fattening-form-field">
                <label>Продано самців</label>
                <input
                  type="number"
                  min={0}
                  max={sellCage.males}
                  value={sellMales}
                  onChange={(e) => setSellMales(e.target.value)}
                />
              </div>
              <div className="fattening-form-field">
                <label>Продано самиць</label>
                <input
                  type="number"
                  min={0}
                  max={sellCage.females}
                  value={sellFemales}
                  onChange={(e) => setSellFemales(e.target.value)}
                />
              </div>
              {sellCage.unknown > 0 && (
                <div className="fattening-form-field">
                  <label>Продано (стать невід.)</label>
                  <input
                    type="number"
                    min={0}
                    max={sellCage.unknown}
                    value={sellUnknown}
                    onChange={(e) => setSellUnknown(e.target.value)}
                  />
                </div>
              )}
            </div>
            {sellError && <p className="fattening-error">{sellError}</p>}
            <div className="fattening-edit-actions">
              <button
                className="fattening-cancel-btn"
                onClick={() => setSellCage(null)}
              >
                Скасувати
              </button>
              <button
                className="fattening-save-btn"
                onClick={handleSell}
                disabled={sellSaving}
              >
                {sellSaving ? "Збереження..." : "💰 Підтвердити"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fattening-stats">
        <div className="fattening-stat">
          <span className="fattening-stat-value">{total}</span>
          <span className="fattening-stat-label">Всього</span>
        </div>
        <div className="fattening-stat male">
          <span className="fattening-stat-value">{totalMales}</span>
          <span className="fattening-stat-label">Самців</span>
        </div>
        <div className="fattening-stat female">
          <span className="fattening-stat-value">{totalFemales}</span>
          <span className="fattening-stat-label">Самиць</span>
        </div>
        {totalUnknown > 0 && (
          <div className="fattening-stat unknown">
            <span className="fattening-stat-value">{totalUnknown}</span>
            <span className="fattening-stat-label">Стать невід.</span>
          </div>
        )}
      </div>

      <div className="fattening-top-actions">
        <button
          className="fattening-add-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "✕ Скасувати" : "+ Додати клітку"}
        </button>
        <button
          className="fattening-qr-btn"
          onClick={() => setShowQrModal(true)}
        >
          📷 QR-коди
        </button>
      </div>

      {/* ── Форма додавання ── */}
      {showForm && (
        <div className="fattening-form">
          <div className="fattening-form-grid">
            <input
              placeholder="Номер клітки *"
              value={form.cage_number}
              onChange={(e) =>
                setForm({ ...form, cage_number: e.target.value })
              }
            />
            <input
              placeholder="Порода"
              value={form.breed}
              onChange={(e) => setForm({ ...form, breed: e.target.value })}
            />
            <input
              placeholder="Рік народження"
              value={form.birth_year}
              onChange={(e) => setForm({ ...form, birth_year: e.target.value })}
            />
            <div></div>
            <div className="fattening-form-field">
              <label>Дата народження</label>
              <input
                type="date"
                value={form.birth_date}
                onChange={(e) =>
                  setForm({
                    ...form,
                    birth_date: e.target.value,
                    slaughter_date: calcSlaughterDate(e.target.value),
                  })
                }
              />
            </div>
            <div className="fattening-form-field">
              <label>Планова дата забою (авто +110 днів)</label>
              <input
                type="date"
                value={form.slaughter_date}
                onChange={(e) =>
                  setForm({ ...form, slaughter_date: e.target.value })
                }
              />
            </div>
            <input
              type="number"
              placeholder="Самців"
              value={form.males}
              onChange={(e) => setForm({ ...form, males: e.target.value })}
            />
            <input
              type="number"
              placeholder="Самиць"
              value={form.females}
              onChange={(e) => setForm({ ...form, females: e.target.value })}
            />
            <input
              type="number"
              placeholder="Стать невідома"
              value={form.unknown}
              onChange={(e) => setForm({ ...form, unknown: e.target.value })}
            />
            <div></div>
            <input
              placeholder="Нотатки"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="fattening-form-full"
            />
          </div>
          {error && <p className="fattening-error">{error}</p>}
          <button
            className="fattening-save-btn"
            onClick={handleAdd}
            disabled={saving || !form.cage_number}
          >
            {saving ? "Збереження..." : "Зберегти"}
          </button>
        </div>
      )}

      {/* ── Форма редагування ── */}
      {editingCage && (
        <div className="fattening-form fattening-edit-form">
          <h3>✏️ Редагування клітки {editingCage.cage_number}</h3>
          <div className="fattening-form-grid">
            <input
              placeholder="Номер клітки *"
              value={editingCage.cage_number}
              onChange={(e) =>
                setEditingCage({ ...editingCage, cage_number: e.target.value })
              }
            />
            <input
              placeholder="Порода"
              value={editingCage.breed || ""}
              onChange={(e) =>
                setEditingCage({ ...editingCage, breed: e.target.value })
              }
            />
            <input
              placeholder="Рік народження"
              value={editingCage.birth_year || ""}
              onChange={(e) =>
                setEditingCage({ ...editingCage, birth_year: e.target.value })
              }
            />
            <div></div>
            <div className="fattening-form-field">
              <label>Дата народження</label>
              <input
                type="date"
                value={editingCage.birth_date || ""}
                onChange={(e) =>
                  setEditingCage({
                    ...editingCage,
                    birth_date: e.target.value,
                    slaughter_date: calcSlaughterDate(e.target.value),
                  })
                }
              />
            </div>
            <div className="fattening-form-field">
              <label>Планова дата забою (авто +110 днів)</label>
              <input
                type="date"
                value={editingCage.slaughter_date || ""}
                onChange={(e) =>
                  setEditingCage({
                    ...editingCage,
                    slaughter_date: e.target.value,
                  })
                }
              />
            </div>
            <input
              type="number"
              placeholder="Самців"
              value={editingCage.males || ""}
              onChange={(e) =>
                setEditingCage({
                  ...editingCage,
                  males: Number(e.target.value),
                })
              }
            />
            <input
              type="number"
              placeholder="Самиць"
              value={editingCage.females || ""}
              onChange={(e) =>
                setEditingCage({
                  ...editingCage,
                  females: Number(e.target.value),
                })
              }
            />
            <input
              type="number"
              placeholder="Стать невідома"
              value={editingCage.unknown || ""}
              onChange={(e) =>
                setEditingCage({
                  ...editingCage,
                  unknown: Number(e.target.value),
                })
              }
            />
            <div></div>
            <input
              placeholder="Нотатки"
              value={editingCage.notes || ""}
              onChange={(e) =>
                setEditingCage({ ...editingCage, notes: e.target.value })
              }
              className="fattening-form-full"
            />
          </div>
          {error && <p className="fattening-error">{error}</p>}
          <div className="fattening-edit-actions">
            <button
              className="fattening-cancel-btn"
              onClick={() => setEditingCage(null)}
            >
              Скасувати
            </button>
            <button
              className="fattening-save-btn"
              onClick={handleEdit}
              disabled={saving}
            >
              {saving ? "Збереження..." : "Зберегти зміни"}
            </button>
          </div>
        </div>
      )}

      {/* ── Список кліток ── */}
      {loading ? (
        <p className="fattening-loading">Завантаження...</p>
      ) : cages.length === 0 ? (
        <div className="fattening-empty-state">
          <div className="fattening-empty-illustration">🥩</div>
          <h3 className="fattening-empty-title">Кліток відгодівлі ще немає</h3>
          <p className="fattening-empty-desc">
            Додайте першу клітку відгодівлі, вкажіть кількість кролів, дату
            народження та система автоматично розрахує рекомендований термін
            забою.
          </p>
        </div>
      ) : (
        <div className="fattening-grid">
          {cages.map((cage) => {
            const today = new Date();

            const parseBirthYear = (val: string): string => {
              if (!val) return "";
              const parts = val.split(".");
              if (parts.length === 3)
                return `${parts[2]}-${parts[1]}-${parts[0]}`;
              return "";
            };

            const birthIso = cage.birth_date || parseBirthYear(cage.birth_year);

            const slaughterStr =
              cage.slaughter_date ||
              (birthIso ? calcSlaughterDate(birthIso) : null);

            const slaughter = slaughterStr ? new Date(slaughterStr) : null;
            const daysLeft = slaughter
              ? Math.ceil(
                  (slaughter.getTime() - today.getTime()) /
                    (1000 * 60 * 60 * 24),
                )
              : null;

            const ageInDays = birthIso
              ? Math.floor(
                  (today.getTime() - new Date(birthIso).getTime()) /
                    (1000 * 60 * 60 * 24),
                )
              : null;

            return (
              <div key={cage.id} className="fattening-card">
                <div className="fattening-card-top">
                  <span className="fattening-cage-num">
                    Клітка {cage.cage_number}
                  </span>
                  <div className="fattening-card-btns">
                    <button
                      className="fattening-edit-btn"
                      onClick={() => setEditingCage(cage)}
                    >
                      Редагувати
                    </button>
                    <button
                      className="fattening-sell-btn"
                      onClick={() => openSellModal(cage)}
                    >
                      Продано
                    </button>
                    <button
                      className="fattening-slaughter-btn"
                      onClick={() => openSlaughterModal(cage)}
                    >
                      Забій
                    </button>
                    <button
                      className="fattening-delete-btn"
                      onClick={() => handleDelete(cage.id)}
                    >
                      Видалити
                    </button>
                  </div>
                </div>
                {cage.breed && (
                  <p className="fattening-breed">
                    Порода: <strong>{cage.breed}</strong>
                  </p>
                )}
                {cage.birth_year && (
                  <p className="fattening-year">
                    Рік нар.: <strong>{cage.birth_year}</strong>
                  </p>
                )}
                {cage.birth_date && (
                  <p className="fattening-year">
                    Нар.:{" "}
                    <strong>
                      {new Date(cage.birth_date).toLocaleDateString("uk-UA")}
                    </strong>
                  </p>
                )}
                {ageInDays !== null && (
                  <p className="fattening-year">
                    Вік:{" "}
                    <strong>
                      {ageInDays} дн.
                      {ageInDays >= 30 &&
                        (() => {
                          const months = Math.floor(ageInDays / 30);
                          const days = ageInDays % 30;
                          return ` (${months} міс.${days > 0 ? ` ${days} дн.` : ""})`;
                        })()}
                    </strong>
                  </p>
                )}
                {slaughter && daysLeft !== null && (
                  <p
                    className={`fattening-slaughter ${daysLeft <= 7 ? "soon" : ""}`}
                  >
                    Забій:{" "}
                    <strong>{slaughter.toLocaleDateString("uk-UA")}</strong>
                    {daysLeft > 0
                      ? ` (через ${daysLeft} дн.)`
                      : daysLeft === 0
                        ? " (сьогодні!)"
                        : ` (прострочено на ${Math.abs(daysLeft)} дн.)`}
                  </p>
                )}
                <div className="fattening-card-stats">
                  {cage.males > 0 && <span>♂ {cage.males} самців</span>}
                  {cage.females > 0 && <span>♀ {cage.females} самиць</span>}
                  {cage.unknown > 0 && <span>? {cage.unknown} невід.</span>}
                </div>
                {cage.notes && <p className="fattening-notes">{cage.notes}</p>}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Зноска ── */}
      <div className="fattening-note">
        <button
          className="fattening-note-toggle"
          onClick={() => setShowNote(!showNote)}
        >
          <span>📋 Рекомендовані терміни забою</span>
          <span>{showNote ? "▲" : "▼"}</span>
        </button>

        {showNote && (
          <>
            <p>
              Оптимальний вік забою кроликів залежить від породи та мети
              розведення. Загальне правило —{" "}
              <strong>не раніше 3 місяців (90 днів)</strong> від народження.
            </p>
            <div className="fattening-note-grid">
              <div className="fattening-note-item">
                <span className="fattening-note-icon">🥩</span>
                <div>
                  <strong>М'ясні породи</strong>
                  <span>Каліфорнійський, Новозеландський, HYLA</span>
                  <span className="fattening-note-days">70–90 днів</span>
                </div>
              </div>
              <div className="fattening-note-item">
                <span className="fattening-note-icon">🐇</span>
                <div>
                  <strong>Універсальні породи</strong>
                  <span>Бургундський, Віденський, Термонський</span>
                  <span className="fattening-note-days">90–120 днів</span>
                </div>
              </div>
              <div className="fattening-note-item">
                <span className="fattening-note-icon">🦁</span>
                <div>
                  <strong>Великі породи</strong>
                  <span>Фландр, Сірий велетень, Білий велетень</span>
                  <span className="fattening-note-days">120–150 днів</span>
                </div>
              </div>
              <div className="fattening-note-item">
                <span className="fattening-note-icon">✂️</span>
                <div>
                  <strong>Хутрові породи</strong>
                  <span>Рекс, Шиншила, Віденський блакитний</span>
                  <span className="fattening-note-days">
                    після линьки (4–7 міс)
                  </span>
                </div>
              </div>
            </div>
            <div className="fattening-note-warn">
              ⚠️ <strong>Важливо:</strong> Не забивайте під час линьки — шкурка
              втратить товарний вигляд. У молодняку перша линька закінчується до
              4–4.5 місяців, друга — до 7–7.5 місяців.
            </div>
            <div
              className="fattening-note-warn"
              style={{
                background: "#e8f5e9",
                borderColor: "#a5d6a7",
                color: "#1b5e20",
              }}
            >
              ✅ <strong>Оптимальний вік для домашнього господарства:</strong>{" "}
              Для звичайних порід в домашніх умовах найкращий результат за
              якістю м'яса і рентабельністю — <strong>100–120 днів</strong>.
              Система автоматично пропонує <strong>110 днів</strong> як середнє
              значення, але ви завжди можете скоригувати дату вручну.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
