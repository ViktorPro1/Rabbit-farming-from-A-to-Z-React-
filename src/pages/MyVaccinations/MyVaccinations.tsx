import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import "./MyVaccinations.css";

interface Props {
  session: Session;
}

interface VaccinationRecord {
  id: string;
  cage_number: string;
  vaccine_type: string;
  vaccine_name: string;
  date: string;
  next_date: string | null;
  notes: string | null;
}

const emptyForm = {
  cage_number: "",
  vaccine_type: "ВГХК",
  vaccine_name: "",
  date: "",
  next_date: "",
  notes: "",
};

export default function MyVaccinations({ session }: Props) {
  const [records, setRecords] = useState<VaccinationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadData = useCallback(() => {
    supabase
      .from("vaccinations")
      .select("*")
      .eq("user_id", session.user.id)
      .order("date", { ascending: false })
      .then(({ data }) => {
        setRecords(data || []);
        setLoading(false);
      });
  }, [session.user.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleAdd() {
    setSaving(true);
    setError("");
    const { error } = await supabase.from("vaccinations").insert({
      ...form,
      next_date: form.next_date || null,
      notes: form.notes || null,
      user_id: session.user.id,
    });
    if (error) {
      setError("Помилка збереження");
    } else {
      setForm(emptyForm);
      setShowForm(false);
      loadData();
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Видалити запис?")) return;
    await supabase.from("vaccinations").delete().eq("id", id);
    loadData();
  }

  function isOverdue(next_date: string | null) {
    if (!next_date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(next_date) < today;
  }

  function isSoon(next_date: string | null) {
    if (!next_date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff =
      (new Date(next_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 14;
  }

  return (
    <div className="myvac-page">
      <div className="myvac-header">
        <button
          className="myvac-back-btn"
          onClick={() => navigate("/registry")}
        >
          ← Реєстр
        </button>
        <h1>💉 Вакцинація</h1>
        <button
          className="myvac-add-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "✕ Скасувати" : "+ Додати запис"}
        </button>
      </div>

      {showForm && (
        <div className="myvac-form">
          <h2>Новий запис</h2>
          <div className="myvac-form-grid">
            <input
              placeholder="Номер клітки *"
              value={form.cage_number}
              onChange={(e) =>
                setForm({ ...form, cage_number: e.target.value })
              }
            />
            <select
              value={form.vaccine_type}
              onChange={(e) =>
                setForm({ ...form, vaccine_type: e.target.value })
              }
            >
              <option value="ВГХК">ВГХК</option>
              <option value="Міксоматоз">Міксоматоз</option>
              <option value="ВГХК + Міксоматоз">ВГХК + Міксоматоз</option>
              <option value="Інше">Інше</option>
            </select>
            <input
              placeholder="Назва препарату *"
              value={form.vaccine_name}
              onChange={(e) =>
                setForm({ ...form, vaccine_name: e.target.value })
              }
            />
            <div className="myvac-field-wrap">
              <label>Дата вакцинації</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div className="myvac-field-wrap">
              <label>Наступна дата</label>
              <input
                type="date"
                value={form.next_date}
                onChange={(e) =>
                  setForm({ ...form, next_date: e.target.value })
                }
              />
            </div>
            <input
              placeholder="Нотатки"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          {error && <p className="myvac-error">{error}</p>}
          <button
            className="myvac-save-btn"
            onClick={handleAdd}
            disabled={
              saving || !form.cage_number || !form.vaccine_name || !form.date
            }
          >
            {saving ? "Збереження..." : "Зберегти"}
          </button>
        </div>
      )}

      {loading ? (
        <p className="myvac-loading">Завантаження...</p>
      ) : records.length === 0 ? (
        <p className="myvac-empty">Записів ще немає.</p>
      ) : (
        <div className="myvac-grid">
          {records.map((r) => (
            <div
              key={r.id}
              className={`myvac-card ${isOverdue(r.next_date) ? "overdue" : isSoon(r.next_date) ? "soon" : ""}`}
            >
              <div className="myvac-card-top">
                <span className="myvac-cage">Клітка {r.cage_number}</span>
                <span className="myvac-type">{r.vaccine_type}</span>
              </div>
              <p className="myvac-drug">{r.vaccine_name}</p>
              <p className="myvac-date">
                Дата: {new Date(r.date).toLocaleDateString("uk-UA")}
              </p>
              {r.next_date && (
                <p
                  className={`myvac-next ${isOverdue(r.next_date) ? "text-overdue" : isSoon(r.next_date) ? "text-soon" : ""}`}
                >
                  Наступна: {new Date(r.next_date).toLocaleDateString("uk-UA")}
                  {isOverdue(r.next_date) && " ⚠️ Прострочено"}
                  {isSoon(r.next_date) &&
                    !isOverdue(r.next_date) &&
                    " ⏰ Скоро"}
                </p>
              )}
              {r.notes && <p className="myvac-notes">{r.notes}</p>}
              <button
                className="myvac-delete-btn"
                onClick={() => handleDelete(r.id)}
              >
                Видалити
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
