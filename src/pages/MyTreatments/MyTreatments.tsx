import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import "./MyTreatments.css";

interface Props {
  session: Session;
}

interface TreatmentRecord {
  id: string;
  cage_number: string;
  drug_name: string;
  date: string;
  next_date: string | null;
  notes: string | null;
}

const emptyForm = {
  cage_number: "",
  drug_name: "",
  date: "",
  next_date: "",
  notes: "",
};

export default function MyTreatments({ session }: Props) {
  const [records, setRecords] = useState<TreatmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadData = useCallback(() => {
    supabase
      .from("treatments")
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
    const { error } = await supabase.from("treatments").insert({
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
    await supabase.from("treatments").delete().eq("id", id);
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
    <div className="mytreat-page">
      <div className="mytreat-header">
        <button
          className="mytreat-back-btn"
          onClick={() => navigate("/registry")}
        >
          ← Реєстр
        </button>
        <h1>💊 Пропойка</h1>
        <button
          className="mytreat-add-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "✕ Скасувати" : "+ Додати запис"}
        </button>
      </div>

      {showForm && (
        <div className="mytreat-form">
          <h2>Новий запис</h2>
          <div className="mytreat-form-grid">
            <input
              placeholder="Номер клітки *"
              value={form.cage_number}
              onChange={(e) =>
                setForm({ ...form, cage_number: e.target.value })
              }
            />
            <input
              placeholder="Препарат *"
              value={form.drug_name}
              onChange={(e) => setForm({ ...form, drug_name: e.target.value })}
            />
            <div className="mytreat-field-wrap">
              <label>Дата прийому</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div className="mytreat-field-wrap">
              <label>Наступний прийом</label>
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
          {error && <p className="mytreat-error">{error}</p>}
          <button
            className="mytreat-save-btn"
            onClick={handleAdd}
            disabled={
              saving || !form.cage_number || !form.drug_name || !form.date
            }
          >
            {saving ? "Збереження..." : "Зберегти"}
          </button>
        </div>
      )}

      {loading ? (
        <p className="mytreat-loading">Завантаження...</p>
      ) : records.length === 0 ? (
        <p className="mytreat-empty">Записів ще немає.</p>
      ) : (
        <div className="mytreat-grid">
          {records.map((r) => (
            <div
              key={r.id}
              className={`mytreat-card ${isOverdue(r.next_date) ? "overdue" : isSoon(r.next_date) ? "soon" : ""}`}
            >
              <div className="mytreat-card-top">
                <span className="mytreat-cage">Клітка {r.cage_number}</span>
              </div>
              <p className="mytreat-drug">{r.drug_name}</p>
              <p className="mytreat-date">
                Дата: {new Date(r.date).toLocaleDateString("uk-UA")}
              </p>
              {r.next_date && (
                <p
                  className={`mytreat-next ${isOverdue(r.next_date) ? "text-overdue" : isSoon(r.next_date) ? "text-soon" : ""}`}
                >
                  Наступний: {new Date(r.next_date).toLocaleDateString("uk-UA")}
                  {isOverdue(r.next_date) && " ⚠️ Прострочено"}
                  {isSoon(r.next_date) &&
                    !isOverdue(r.next_date) &&
                    " ⏰ Скоро"}
                </p>
              )}
              {r.notes && <p className="mytreat-notes">{r.notes}</p>}
              <button
                className="mytreat-delete-btn"
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
