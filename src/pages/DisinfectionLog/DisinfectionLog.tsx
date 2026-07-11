import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import "./DisinfectionLog.css";

interface Props {
  session: Session;
}

interface DisinfectionRecord {
  id: string;
  cage_number: string;
  disinfection_date: string;
  product: string;
  notes: string;
}

const emptyForm = {
  cage_number: "",
  disinfection_date: "",
  product: "",
  notes: "",
};

function todayIso(): string {
  return new Date().toISOString().split("T")[0];
}

export default function DisinfectionLog({ session }: Props) {
  const [records, setRecords] = useState<DisinfectionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DisinfectionRecord | null>(
    null,
  );
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showInfo, setShowInfo] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchRecords() {
    setLoading(true);
    const { data } = await supabase
      .from("cage_disinfections")
      .select("*")
      .eq("user_id", session.user.id)
      .order("disinfection_date", { ascending: false });
    setRecords(data || []);
    setLoading(false);
  }

  async function handleAdd() {
    setSaving(true);
    setError("");
    const { error } = await supabase.from("cage_disinfections").insert({
      user_id: session.user.id,
      cage_number: form.cage_number,
      disinfection_date: form.disinfection_date || todayIso(),
      product: form.product || null,
      notes: form.notes || null,
    });
    if (error) {
      setError("Помилка збереження");
    } else {
      setForm(emptyForm);
      setShowForm(false);
      fetchRecords();
    }
    setSaving(false);
  }

  async function handleEdit() {
    if (!editingRecord) return;
    setSaving(true);
    setError("");
    const { error } = await supabase
      .from("cage_disinfections")
      .update({
        cage_number: editingRecord.cage_number,
        disinfection_date: editingRecord.disinfection_date,
        product: editingRecord.product || null,
        notes: editingRecord.notes || null,
      })
      .eq("id", editingRecord.id);
    if (error) {
      setError("Помилка збереження");
    } else {
      setEditingRecord(null);
      fetchRecords();
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Видалити запис про дезінфекцію?")) return;
    await supabase.from("cage_disinfections").delete().eq("id", id);
    fetchRecords();
  }

  async function handleMarkDoneAgain(record: DisinfectionRecord) {
    // Швидко фіксуємо повторну дезінфекцію тієї ж клітки сьогодні
    await supabase.from("cage_disinfections").insert({
      user_id: session.user.id,
      cage_number: record.cage_number,
      disinfection_date: todayIso(),
      product: record.product || null,
      notes: null,
    });
    fetchRecords();
  }

  return (
    <div className="disinfection-log-page">
      <div className="disinfection-log-content">
        <div className="disinfection-log-header">
          <h1>🧴 Дезінфекція</h1>
          <button
            className="disinfection-log-back-btn"
            onClick={() => navigate("/registry")}
          >
            ⬅ Мої кролики
          </button>
        </div>

        <div className="disinfection-log-stats">
          <div className="disinfection-log-stat">
            <span className="disinfection-log-stat-value">
              {new Set(records.map((r) => r.cage_number)).size}
            </span>
            <span className="disinfection-log-stat-label">
              Кліток обліковано
            </span>
          </div>
          <div className="disinfection-log-stat">
            <span className="disinfection-log-stat-value">
              {records.length}
            </span>
            <span className="disinfection-log-stat-label">Всього записів</span>
          </div>
        </div>

        <button
          className="disinfection-log-add-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "✕ Скасувати" : "+ Додати запис"}
        </button>

        {/* ── Форма додавання ── */}
        {showForm && (
          <div className="disinfection-log-form">
            <div className="disinfection-log-form-grid">
              <input
                id="disinfection-cage-number"
                name="cage_number"
                placeholder="Номер клітки *"
                value={form.cage_number}
                onChange={(e) =>
                  setForm({ ...form, cage_number: e.target.value })
                }
              />
              <input
                id="disinfection-product"
                name="product"
                placeholder="Засіб (напр. Віркон С)"
                value={form.product}
                onChange={(e) => setForm({ ...form, product: e.target.value })}
              />
              <div className="disinfection-log-form-field">
                <label htmlFor="disinfection-date">Дата дезінфекції</label>
                <input
                  id="disinfection-date"
                  name="disinfection_date"
                  type="date"
                  value={form.disinfection_date}
                  onChange={(e) =>
                    setForm({ ...form, disinfection_date: e.target.value })
                  }
                />
              </div>
              <div></div>
              <input
                id="disinfection-notes"
                name="notes"
                placeholder="Нотатки"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="disinfection-log-form-full"
              />
            </div>
            {error && <p className="disinfection-log-error">{error}</p>}
            <button
              className="disinfection-log-save-btn"
              onClick={handleAdd}
              disabled={saving || !form.cage_number || !form.disinfection_date}
            >
              {saving ? "Збереження..." : "Зберегти"}
            </button>
          </div>
        )}

        {/* ── Форма редагування ── */}
        {editingRecord && (
          <div className="disinfection-log-form disinfection-log-edit-form">
            <h3>✏️ Редагування — клітка {editingRecord.cage_number}</h3>
            <div className="disinfection-log-form-grid">
              <input
                id="disinfection-edit-cage-number"
                name="cage_number"
                placeholder="Номер клітки *"
                value={editingRecord.cage_number}
                onChange={(e) =>
                  setEditingRecord({
                    ...editingRecord,
                    cage_number: e.target.value,
                  })
                }
              />
              <input
                id="disinfection-edit-product"
                name="product"
                placeholder="Засіб"
                value={editingRecord.product || ""}
                onChange={(e) =>
                  setEditingRecord({
                    ...editingRecord,
                    product: e.target.value,
                  })
                }
              />
              <div className="disinfection-log-form-field">
                <label htmlFor="disinfection-edit-date">Дата дезінфекції</label>
                <input
                  id="disinfection-edit-date"
                  name="disinfection_date"
                  type="date"
                  value={editingRecord.disinfection_date || ""}
                  onChange={(e) =>
                    setEditingRecord({
                      ...editingRecord,
                      disinfection_date: e.target.value,
                    })
                  }
                />
              </div>
              <div></div>
              <input
                id="disinfection-edit-notes"
                name="notes"
                placeholder="Нотатки"
                value={editingRecord.notes || ""}
                onChange={(e) =>
                  setEditingRecord({ ...editingRecord, notes: e.target.value })
                }
                className="disinfection-log-form-full"
              />
            </div>
            {error && <p className="disinfection-log-error">{error}</p>}
            <div className="disinfection-log-edit-actions">
              <button
                className="disinfection-log-cancel-btn"
                onClick={() => setEditingRecord(null)}
              >
                Скасувати
              </button>
              <button
                className="disinfection-log-save-btn"
                onClick={handleEdit}
                disabled={saving}
              >
                {saving ? "Збереження..." : "Зберегти зміни"}
              </button>
            </div>
          </div>
        )}

        {/* ── Список ── */}
        {loading ? (
          <p className="disinfection-log-loading">Завантаження...</p>
        ) : records.length === 0 ? (
          <div className="disinfection-log-empty-state">
            <div className="disinfection-log-empty-illustration">🧴</div>
            <h3 className="disinfection-log-empty-title">
              Записів про дезінфекцію ще немає
            </h3>
            <p className="disinfection-log-empty-desc">
              Додайте першу дезінфекцію клітки — просто журнал фактів, без
              нагадувань. Фіксуй кожну обробку разом з засобом.
            </p>
          </div>
        ) : (
          <div className="disinfection-log-grid">
            {records.map((r) => (
              <div key={r.id} className="disinfection-log-card">
                <div className="disinfection-log-card-top">
                  <span className="disinfection-log-cage-num">
                    Клітка {r.cage_number}
                  </span>
                  <div className="disinfection-log-card-btns">
                    <button
                      className="disinfection-log-edit-btn"
                      onClick={() => setEditingRecord(r)}
                    >
                      Редагувати
                    </button>
                    <button
                      className="disinfection-log-done-btn"
                      onClick={() => handleMarkDoneAgain(r)}
                    >
                      ✅ Ще раз сьогодні
                    </button>
                    <button
                      className="disinfection-log-delete-btn"
                      onClick={() => handleDelete(r.id)}
                    >
                      Видалити
                    </button>
                  </div>
                </div>
                {r.product && (
                  <p className="disinfection-log-product">
                    Засіб: <strong>{r.product}</strong>
                  </p>
                )}
                <p className="disinfection-log-date">
                  Дата:{" "}
                  <strong>
                    {new Date(r.disinfection_date).toLocaleDateString("uk-UA")}
                  </strong>
                </p>
                {r.notes && <p className="disinfection-log-notes">{r.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Зноска: як робиться дезінфекція ── */}
      <div className="disinfection-log-note">
        <button
          className="disinfection-log-note-toggle"
          onClick={() => setShowInfo(!showInfo)}
        >
          <span>📋 Як робиться дезінфекція та які препарати є</span>
          <span>{showInfo ? "▲" : "▼"}</span>
        </button>

        {showInfo && (
          <>
            <p className="disinfection-log-note-text">
              Спочатку — механічне прибирання: приберіть тварину, послід і
              підстилку. Без цього ефективність будь-якого засобу падає на
              80–90%. Далі наносите розчин, витримуєте 30 хв–2 год, змиваєте
              чистою водою і провітрюєте клітку мінімум 2–3 год перед
              поверненням тварини.
            </p>

            <div className="disinfection-log-note-example">
              💧 <strong>Наприклад, Бровадез Плюс:</strong> профілактична
              обробка — 5 мл на 1 л води (1:200), витримка 1–2 год. Після
              хвороби — 10 мл на 1 л (1:100), витримка 3 год.
            </div>

            <div className="disinfection-log-note-grid">
              <div className="disinfection-log-note-item">
                <span className="disinfection-log-note-icon">🟦</span>
                <div>
                  <strong>Бровадез Плюс / Глютекс</strong>
                  <span>Концентрат, глутаральдегід + ЧАС</span>
                  <span className="disinfection-log-note-dose">
                    5–10 мл на 1 л води
                  </span>
                </div>
              </div>
              <div className="disinfection-log-note-item">
                <span className="disinfection-log-note-icon">🟥</span>
                <div>
                  <strong>Вірокон С</strong>
                  <span>Порошок, м'якший, з колірним індикатором</span>
                  <span className="disinfection-log-note-dose">
                    10–20 г на 1 л води
                  </span>
                </div>
              </div>
              <div className="disinfection-log-note-item">
                <span className="disinfection-log-note-icon">🟩</span>
                <div>
                  <strong>Хлорамін Б</strong>
                  <span>Найдешевший, роз'їдає метал</span>
                  <span className="disinfection-log-note-dose">
                    20–50 г на 1 л води
                  </span>
                </div>
              </div>
              <div className="disinfection-log-note-item">
                <span className="disinfection-log-note-icon">🤍</span>
                <div>
                  <strong>Вапно</strong>
                  <span>Для побілки стін, не знищує віруси</span>
                  <span className="disinfection-log-note-dose">
                    200 г на 1 л (побілка)
                  </span>
                </div>
              </div>
            </div>

            <div className="disinfection-log-note-warn">
              ⚠️ <strong>Важливо:</strong> не змішуйте різні дезінфектанти між
              собою, чергуйте препарати кожні 2–3 місяці (щоб не виникала
              стійкість у збудників), і завжди працюйте в рукавичках.
            </div>

            <Link to="/disinfection" className="disinfection-log-note-link">
              Детальна стаття про всі препарати та схеми обробки →
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
