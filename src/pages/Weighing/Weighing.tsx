import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import "./Weighing.css";

interface Props {
  session: Session;
}

interface WeighingRecord {
  id: string;
  litter_label: string;
  rabbit_name: string;
  weighing_date: string;
  weight_g: number;
  notes: string;
}

const emptyForm = {
  litter_label: "",
  rabbit_name: "",
  weighing_date: "",
  weight_g: "",
  notes: "",
};

export default function Weighing({ session }: Props) {
  const [records, setRecords] = useState<WeighingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<WeighingRecord | null>(
    null,
  );
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.user.id]);

  async function fetchRecords() {
    setLoading(true);
    const { data } = await supabase
      .from("weighings")
      .select("*")
      .eq("user_id", session.user.id)
      .order("weighing_date", { ascending: true });
    setRecords(data || []);
    setLoading(false);
  }

  async function handleAdd() {
    setSaving(true);
    setError("");
    const { error } = await supabase.from("weighings").insert({
      litter_label: form.litter_label,
      rabbit_name: form.rabbit_name || null,
      weighing_date: form.weighing_date,
      weight_g: Number(form.weight_g),
      notes: form.notes || null,
      user_id: session.user.id,
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
      .from("weighings")
      .update({
        litter_label: editingRecord.litter_label,
        rabbit_name: editingRecord.rabbit_name || null,
        weighing_date: editingRecord.weighing_date,
        weight_g: Number(editingRecord.weight_g),
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
    if (!confirm("Видалити запис?")) return;
    await supabase.from("weighings").delete().eq("id", id);
    fetchRecords();
  }

  // Групування по гніздах
  const groups = records.reduce<Record<string, WeighingRecord[]>>((acc, r) => {
    const key = r.litter_label || "Без назви";
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  function dailyGain(prev: WeighingRecord, curr: WeighingRecord): string {
    const days =
      (new Date(curr.weighing_date).getTime() -
        new Date(prev.weighing_date).getTime()) /
      (1000 * 60 * 60 * 24);
    if (days <= 0) return "—";
    const gain = (curr.weight_g - prev.weight_g) / days;
    return `${gain >= 0 ? "+" : ""}${gain.toFixed(1)} г/добу`;
  }

  const litterCount = Object.keys(groups).length;
  const lastMonth = records.length
    ? new Date(
        Math.max(...records.map((r) => new Date(r.weighing_date).getTime())),
      ).toLocaleDateString("uk-UA", { month: "long", year: "numeric" })
    : "—";

  return (
    <div className="weighing-page">
      <div className="weighing-header">
        <h1>⚖️ Зважування</h1>
        <button
          className="weighing-back-btn"
          onClick={() => navigate("/registry")}
        >
          ⬅ Мої кролики
        </button>
      </div>

      <div className="weighing-stats">
        <div className="weighing-stat">
          <span className="weighing-stat-value">{records.length}</span>
          <span className="weighing-stat-label">Записів</span>
        </div>
        <div className="weighing-stat">
          <span className="weighing-stat-value">{litterCount}</span>
          <span className="weighing-stat-label">Гнізд / груп</span>
        </div>
        <div className="weighing-stat wide">
          <span className="weighing-stat-value small">{lastMonth}</span>
          <span className="weighing-stat-label">Останнє зважування</span>
        </div>
      </div>

      <div className="weighing-actions">
        <button
          className="weighing-add-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "✕ Скасувати" : "+ Додати зважування"}
        </button>
      </div>

      {showForm && (
        <div className="weighing-form">
          <h3>Нове зважування</h3>
          <div className="weighing-form-grid">
            <input
              placeholder="Гніздо / кролятник *"
              value={form.litter_label}
              onChange={(e) =>
                setForm({ ...form, litter_label: e.target.value })
              }
            />
            <input
              placeholder="Кличка / номер кролика"
              value={form.rabbit_name}
              onChange={(e) =>
                setForm({ ...form, rabbit_name: e.target.value })
              }
            />
            <div className="weighing-form-field">
              <label>Дата зважування *</label>
              <input
                type="date"
                value={form.weighing_date}
                onChange={(e) =>
                  setForm({ ...form, weighing_date: e.target.value })
                }
              />
            </div>
            <div className="weighing-form-field">
              <label>Вага (г) *</label>
              <input
                type="number"
                min="0"
                placeholder="Наприклад 1450"
                value={form.weight_g}
                onChange={(e) => setForm({ ...form, weight_g: e.target.value })}
              />
            </div>
            <input
              placeholder="Нотатки"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="weighing-form-full"
            />
          </div>
          {error && <p className="weighing-error">{error}</p>}
          <button
            className="weighing-save-btn"
            onClick={handleAdd}
            disabled={
              saving ||
              !form.litter_label ||
              !form.weighing_date ||
              !form.weight_g
            }
          >
            {saving ? "Збереження..." : "Зберегти"}
          </button>
        </div>
      )}

      {editingRecord && (
        <div className="weighing-form weighing-edit-form">
          <h3>✏️ Редагування</h3>
          <div className="weighing-form-grid">
            <input
              placeholder="Гніздо / кролятник *"
              value={editingRecord.litter_label}
              onChange={(e) =>
                setEditingRecord({
                  ...editingRecord,
                  litter_label: e.target.value,
                })
              }
            />
            <input
              placeholder="Кличка / номер кролика"
              value={editingRecord.rabbit_name || ""}
              onChange={(e) =>
                setEditingRecord({
                  ...editingRecord,
                  rabbit_name: e.target.value,
                })
              }
            />
            <div className="weighing-form-field">
              <label>Дата зважування</label>
              <input
                type="date"
                value={editingRecord.weighing_date}
                onChange={(e) =>
                  setEditingRecord({
                    ...editingRecord,
                    weighing_date: e.target.value,
                  })
                }
              />
            </div>
            <div className="weighing-form-field">
              <label>Вага (г)</label>
              <input
                type="number"
                min="0"
                value={editingRecord.weight_g}
                onChange={(e) =>
                  setEditingRecord({
                    ...editingRecord,
                    weight_g: Number(e.target.value),
                  })
                }
              />
            </div>
            <input
              placeholder="Нотатки"
              value={editingRecord.notes || ""}
              onChange={(e) =>
                setEditingRecord({ ...editingRecord, notes: e.target.value })
              }
              className="weighing-form-full"
            />
          </div>
          {error && <p className="weighing-error">{error}</p>}
          <div className="weighing-edit-actions">
            <button
              className="weighing-cancel-btn"
              onClick={() => setEditingRecord(null)}
            >
              Скасувати
            </button>
            <button
              className="weighing-save-btn"
              onClick={handleEdit}
              disabled={saving}
            >
              {saving ? "Збереження..." : "Зберегти зміни"}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="weighing-loading">Завантаження...</p>
      ) : records.length === 0 ? (
        <div className="weighing-empty-state">
          <div className="weighing-empty-illustration">⚖️</div>
          <h3 className="weighing-empty-title">Записів зважування ще немає</h3>
          <p className="weighing-empty-desc">
            Додайте перше зважування показового кролика з гнізда — так почнеться
            відстеження приросту по місяцях.
          </p>
        </div>
      ) : (
        <div className="weighing-groups">
          {Object.entries(groups).map(([litter, list]) => {
            const sorted = [...list].sort(
              (a, b) =>
                new Date(a.weighing_date).getTime() -
                new Date(b.weighing_date).getTime(),
            );
            return (
              <div key={litter} className="weighing-group">
                <h2 className="weighing-group-title">🐇 {litter}</h2>
                <div className="weighing-list">
                  {sorted.map((r, idx) => (
                    <div key={r.id} className="weighing-card">
                      <div className="weighing-card-top">
                        <span className="weighing-name">
                          {new Date(r.weighing_date).toLocaleDateString(
                            "uk-UA",
                          )}
                          {r.rabbit_name ? ` · ${r.rabbit_name}` : ""}
                        </span>
                        <div className="weighing-card-btns">
                          <button
                            className="weighing-edit-btn"
                            onClick={() => setEditingRecord(r)}
                          >
                            ✏️
                          </button>
                          <button
                            className="weighing-delete-btn"
                            onClick={() => handleDelete(r.id)}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                      <p className="weighing-info">
                        Вага: <strong>{r.weight_g} г</strong>
                        {idx > 0 && (
                          <span className="weighing-gain">
                            {" "}
                            ({dailyGain(sorted[idx - 1], r)})
                          </span>
                        )}
                      </p>
                      {r.notes && <p className="weighing-notes">{r.notes}</p>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
