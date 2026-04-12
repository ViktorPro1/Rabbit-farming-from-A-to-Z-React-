import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
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
  notes: string;
}

const emptyForm = {
  cage_number: "",
  males: "",
  females: "",
  unknown: "",
  breed: "",
  birth_year: "",
  notes: "",
};

export default function Fattening({ session }: Props) {
  const [cages, setCages] = useState<FatteningCage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCage, setEditingCage] = useState<FatteningCage | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
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

      <button
        className="fattening-add-btn"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "✕ Скасувати" : "+ Додати клітку"}
      </button>

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

      {loading ? (
        <p className="fattening-loading">Завантаження...</p>
      ) : cages.length === 0 ? (
        <p className="fattening-empty">Кліток ще немає.</p>
      ) : (
        <div className="fattening-grid">
          {cages.map((cage) => (
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
              <div className="fattening-card-stats">
                {cage.males > 0 && <span>♂ {cage.males} самців</span>}
                {cage.females > 0 && <span>♀ {cage.females} самиць</span>}
                {cage.unknown > 0 && <span>? {cage.unknown} невід.</span>}
              </div>
              {cage.notes && <p className="fattening-notes">{cage.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
