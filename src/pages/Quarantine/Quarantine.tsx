import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import "./Quarantine.css";

interface Props {
  session: Session;
}

interface QuarantineAnimal {
  id: string;
  name: string;
  gender: "male" | "female" | "unknown";
  breed: string;
  from_cage: string;
  moved_date: string;
  reason: string;
  end_date: string;
  result: "recovered" | "slaughter" | "died" | null;
  notes: string;
  is_active: boolean;
}

const emptyForm = {
  name: "",
  gender: "unknown" as "male" | "female" | "unknown",
  breed: "",
  from_cage: "",
  moved_date: "",
  reason: "",
  end_date: "",
  notes: "",
};

const resultLabels = {
  recovered: "Видужав",
  slaughter: "Пішов на забій",
  died: "Згинув",
};

export default function Quarantine({ session }: Props) {
  const [animals, setAnimals] = useState<QuarantineAnimal[]>([]);
  const [archived, setArchived] = useState<QuarantineAnimal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState<QuarantineAnimal | null>(
    null,
  );
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    supabase
      .from("quarantine")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("is_active", true)
      .order("moved_date", { ascending: false })
      .then(({ data }) => {
        setAnimals(data || []);
        setLoading(false);
      });
  }, [session.user.id]);

  async function fetchAnimals() {
    const { data } = await supabase
      .from("quarantine")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("is_active", true)
      .order("moved_date", { ascending: false });
    setAnimals(data || []);
  }

  async function fetchArchived() {
    const { data } = await supabase
      .from("quarantine")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("is_active", false)
      .order("moved_date", { ascending: false });
    setArchived(data || []);
  }

  async function handleAdd() {
    setSaving(true);
    setError("");
    const { error } = await supabase.from("quarantine").insert({
      ...form,
      user_id: session.user.id,
      end_date: form.end_date || null,
      breed: form.breed || null,
      from_cage: form.from_cage || null,
      reason: form.reason || null,
      notes: form.notes || null,
    });
    if (error) {
      setError("Помилка збереження");
    } else {
      setForm(emptyForm);
      setShowForm(false);
      fetchAnimals();
    }
    setSaving(false);
  }

  async function handleEdit() {
    if (!editingAnimal) return;
    setSaving(true);
    setError("");
    const { error } = await supabase
      .from("quarantine")
      .update({
        name: editingAnimal.name,
        gender: editingAnimal.gender,
        breed: editingAnimal.breed || null,
        from_cage: editingAnimal.from_cage || null,
        moved_date: editingAnimal.moved_date,
        reason: editingAnimal.reason || null,
        end_date: editingAnimal.end_date || null,
        result: editingAnimal.result || null,
        notes: editingAnimal.notes || null,
      })
      .eq("id", editingAnimal.id);
    if (error) {
      setError("Помилка збереження");
    } else {
      setEditingAnimal(null);
      fetchAnimals();
    }
    setSaving(false);
  }

  async function handleArchive(
    animal: QuarantineAnimal,
    result: "recovered" | "slaughter" | "died",
  ) {
    await supabase
      .from("quarantine")
      .update({ is_active: false, result })
      .eq("id", animal.id);
    fetchAnimals();
    if (showArchive) fetchArchived();
  }

  async function handleDelete(id: string) {
    if (!confirm("Видалити запис?")) return;
    await supabase.from("quarantine").delete().eq("id", id);
    fetchAnimals();
  }

  function toggleArchive() {
    if (!showArchive) fetchArchived();
    setShowArchive(!showArchive);
  }

  const males = animals.filter((a) => a.gender === "male").length;
  const females = animals.filter((a) => a.gender === "female").length;
  const unknown = animals.filter((a) => a.gender === "unknown").length;

  const genderLabel = (g: string) =>
    g === "male" ? "♂" : g === "female" ? "♀" : "?";

  return (
    <div className="quarantine-page">
      <div className="quarantine-header">
        <h1>🔒 Карантин</h1>
        <button
          className="quarantine-back-btn"
          onClick={() => navigate("/registry")}
        >
          ⬅ Мої кролики
        </button>
      </div>

      <div className="quarantine-stats">
        <div className="quarantine-stat">
          <span className="quarantine-stat-value">{animals.length}</span>
          <span className="quarantine-stat-label">В карантині</span>
        </div>
        {males > 0 && (
          <div className="quarantine-stat male">
            <span className="quarantine-stat-value">{males}</span>
            <span className="quarantine-stat-label">♂ Самців</span>
          </div>
        )}
        {females > 0 && (
          <div className="quarantine-stat female">
            <span className="quarantine-stat-value">{females}</span>
            <span className="quarantine-stat-label">♀ Самиць</span>
          </div>
        )}
        {unknown > 0 && (
          <div className="quarantine-stat unknown">
            <span className="quarantine-stat-value">{unknown}</span>
            <span className="quarantine-stat-label">? Невід.</span>
          </div>
        )}
      </div>

      <div className="quarantine-actions">
        <button
          className="quarantine-add-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "✕ Скасувати" : "+ Додати в карантин"}
        </button>
        <button className="quarantine-archive-btn" onClick={toggleArchive}>
          {showArchive ? "Сховати архів" : "📦 Архів"}
        </button>
      </div>

      {showForm && (
        <div className="quarantine-form">
          <h3>Новий запис</h3>
          <div className="quarantine-form-grid">
            <input
              placeholder="Кличка / номер *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <select
              value={form.gender}
              onChange={(e) =>
                setForm({
                  ...form,
                  gender: e.target.value as "male" | "female" | "unknown",
                })
              }
            >
              <option value="unknown">Стать невідома</option>
              <option value="female">♀ Самиця</option>
              <option value="male">♂ Самець</option>
            </select>
            <input
              placeholder="Порода"
              value={form.breed}
              onChange={(e) => setForm({ ...form, breed: e.target.value })}
            />
            <input
              placeholder="З якої клітки"
              value={form.from_cage}
              onChange={(e) => setForm({ ...form, from_cage: e.target.value })}
            />
            <div className="quarantine-form-field">
              <label>Дата переміщення *</label>
              <input
                type="date"
                value={form.moved_date}
                onChange={(e) =>
                  setForm({ ...form, moved_date: e.target.value })
                }
              />
            </div>
            <div className="quarantine-form-field">
              <label>Дата завершення карантину</label>
              <input
                type="date"
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              />
            </div>
            <input
              placeholder="Причина переміщення"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              className="quarantine-form-full"
            />
            <input
              placeholder="Нотатки"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="quarantine-form-full"
            />
          </div>
          {error && <p className="quarantine-error">{error}</p>}
          <button
            className="quarantine-save-btn"
            onClick={handleAdd}
            disabled={saving || !form.name || !form.moved_date}
          >
            {saving ? "Збереження..." : "Зберегти"}
          </button>
        </div>
      )}

      {editingAnimal && (
        <div className="quarantine-form quarantine-edit-form">
          <h3>✏️ Редагування</h3>
          <div className="quarantine-form-grid">
            <input
              placeholder="Кличка / номер *"
              value={editingAnimal.name}
              onChange={(e) =>
                setEditingAnimal({ ...editingAnimal, name: e.target.value })
              }
            />
            <select
              value={editingAnimal.gender}
              onChange={(e) =>
                setEditingAnimal({
                  ...editingAnimal,
                  gender: e.target.value as "male" | "female" | "unknown",
                })
              }
            >
              <option value="unknown">Стать невідома</option>
              <option value="female">♀ Самиця</option>
              <option value="male">♂ Самець</option>
            </select>
            <input
              placeholder="Порода"
              value={editingAnimal.breed || ""}
              onChange={(e) =>
                setEditingAnimal({ ...editingAnimal, breed: e.target.value })
              }
            />
            <input
              placeholder="З якої клітки"
              value={editingAnimal.from_cage || ""}
              onChange={(e) =>
                setEditingAnimal({
                  ...editingAnimal,
                  from_cage: e.target.value,
                })
              }
            />
            <div className="quarantine-form-field">
              <label>Дата переміщення</label>
              <input
                type="date"
                value={editingAnimal.moved_date}
                onChange={(e) =>
                  setEditingAnimal({
                    ...editingAnimal,
                    moved_date: e.target.value,
                  })
                }
              />
            </div>
            <div className="quarantine-form-field">
              <label>Дата завершення</label>
              <input
                type="date"
                value={editingAnimal.end_date || ""}
                onChange={(e) =>
                  setEditingAnimal({
                    ...editingAnimal,
                    end_date: e.target.value,
                  })
                }
              />
            </div>
            <input
              placeholder="Причина"
              value={editingAnimal.reason || ""}
              onChange={(e) =>
                setEditingAnimal({ ...editingAnimal, reason: e.target.value })
              }
              className="quarantine-form-full"
            />
            <input
              placeholder="Нотатки"
              value={editingAnimal.notes || ""}
              onChange={(e) =>
                setEditingAnimal({ ...editingAnimal, notes: e.target.value })
              }
              className="quarantine-form-full"
            />
          </div>
          {error && <p className="quarantine-error">{error}</p>}
          <div className="quarantine-edit-actions">
            <button
              className="quarantine-cancel-btn"
              onClick={() => setEditingAnimal(null)}
            >
              Скасувати
            </button>
            <button
              className="quarantine-save-btn"
              onClick={handleEdit}
              disabled={saving}
            >
              {saving ? "Збереження..." : "Зберегти зміни"}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="quarantine-loading">Завантаження...</p>
      ) : animals.length === 0 ? (
        <p className="quarantine-empty">В карантині нікого немає.</p>
      ) : (
        <div className="quarantine-list">
          {animals.map((a) => (
            <div key={a.id} className="quarantine-card">
              <div className="quarantine-card-top">
                <span className="quarantine-name">
                  {genderLabel(a.gender)} {a.name}
                  {a.breed ? ` (${a.breed})` : ""}
                </span>
                <div className="quarantine-card-btns">
                  <button
                    className="quarantine-edit-btn"
                    onClick={() => setEditingAnimal(a)}
                  >
                    ✏️
                  </button>
                  <button
                    className="quarantine-delete-btn"
                    onClick={() => handleDelete(a.id)}
                  >
                    ✕
                  </button>
                </div>
              </div>
              {a.from_cage && (
                <p className="quarantine-info">
                  З клітки: <strong>{a.from_cage}</strong>
                </p>
              )}
              <p className="quarantine-info">
                Переміщено:{" "}
                <strong>
                  {new Date(a.moved_date).toLocaleDateString("uk-UA")}
                </strong>
                {a.end_date && (
                  <>
                    {" "}
                    → Завершення:{" "}
                    <strong>
                      {new Date(a.end_date).toLocaleDateString("uk-UA")}
                    </strong>
                  </>
                )}
              </p>
              {a.reason && (
                <p className="quarantine-reason">Причина: {a.reason}</p>
              )}
              {a.notes && <p className="quarantine-notes">{a.notes}</p>}
              <div className="quarantine-result-btns">
                <span className="quarantine-result-label">Результат:</span>
                <button
                  className="quarantine-result-btn recovered"
                  onClick={() => handleArchive(a, "recovered")}
                >
                  Видужав
                </button>
                <button
                  className="quarantine-result-btn slaughter"
                  onClick={() => handleArchive(a, "slaughter")}
                >
                  На забій
                </button>
                <button
                  className="quarantine-result-btn died"
                  onClick={() => handleArchive(a, "died")}
                >
                  Згинув
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showArchive && (
        <div className="quarantine-archive-section">
          <h2>📦 Архів</h2>
          {archived.length === 0 ? (
            <p className="quarantine-empty">Архів порожній.</p>
          ) : (
            <div className="quarantine-list">
              {archived.map((a) => (
                <div
                  key={a.id}
                  className={`quarantine-card archived ${a.result || ""}`}
                >
                  <div className="quarantine-card-top">
                    <span className="quarantine-name">
                      {genderLabel(a.gender)} {a.name}
                      {a.breed ? ` (${a.breed})` : ""}
                    </span>
                    <span className={`quarantine-result-tag ${a.result || ""}`}>
                      {a.result ? resultLabels[a.result] : ""}
                    </span>
                  </div>
                  {a.from_cage && (
                    <p className="quarantine-info">
                      З клітки: <strong>{a.from_cage}</strong>
                    </p>
                  )}
                  <p className="quarantine-info">
                    Переміщено:{" "}
                    <strong>
                      {new Date(a.moved_date).toLocaleDateString("uk-UA")}
                    </strong>
                    {a.end_date && (
                      <>
                        {" "}
                        →{" "}
                        <strong>
                          {new Date(a.end_date).toLocaleDateString("uk-UA")}
                        </strong>
                      </>
                    )}
                  </p>
                  {a.reason && (
                    <p className="quarantine-reason">Причина: {a.reason}</p>
                  )}
                  {a.notes && <p className="quarantine-notes">{a.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
