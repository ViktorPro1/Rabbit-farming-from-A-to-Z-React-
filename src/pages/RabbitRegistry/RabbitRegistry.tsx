import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import "./RabbitRegistry.css";

interface Props {
  session: Session;
}

interface Rabbit {
  id: string;
  name: string;
  breed: string;
  gender: "male" | "female";
  birth_date: string;
  cage_number: string;
  notes: string;
  is_active: boolean;
}

const emptyForm = {
  name: "",
  breed: "",
  gender: "female" as "male" | "female",
  birth_date: "",
  cage_number: "",
  notes: "",
};

export default function RabbitRegistry({ session }: Props) {
  const [rabbits, setRabbits] = useState<Rabbit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    supabase
      .from("rabbits")
      .select("*")
      .eq("is_active", true)
      .order("cage_number", { ascending: true })
      .then(({ data }) => {
        setRabbits(data || []);
        setLoading(false);
      });
  }, []);

  async function fetchRabbits() {
    const { data } = await supabase
      .from("rabbits")
      .select("*")
      .eq("is_active", true)
      .order("cage_number", { ascending: true });
    setRabbits(data || []);
  }

  async function handleAdd() {
    setSaving(true);
    setError("");
    const { error } = await supabase.from("rabbits").insert({
      ...form,
      user_id: session.user.id,
    });
    if (error) {
      setError("Помилка збереження");
    } else {
      setForm(emptyForm);
      setShowForm(false);
      fetchRabbits();
    }
    setSaving(false);
  }

  async function handleArchive(id: string) {
    await supabase.from("rabbits").update({ is_active: false }).eq("id", id);
    fetchRabbits();
  }

  return (
    <div className="registry-page">
      <div className="registry-header">
        <h1>🐇 Мої кролики</h1>
        <p className="registry-email">{session.user.email}</p>
        <button
          className="registry-archive-link"
          onClick={() => navigate("/archive")}
        >
          📦 Архів
        </button>
        <button
          className="registry-add-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "✕ Скасувати" : "+ Додати кролика"}
        </button>
        <button
          className="registry-archive-link"
          onClick={() => navigate("/matings")}
        >
          🐇 Розведення
        </button>
      </div>

      {showForm && (
        <div className="registry-form">
          <h2>Новий кролик</h2>
          <div className="registry-form-grid">
            <input
              placeholder="Кличка *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              placeholder="Порода"
              value={form.breed}
              onChange={(e) => setForm({ ...form, breed: e.target.value })}
            />
            <select
              value={form.gender}
              onChange={(e) =>
                setForm({
                  ...form,
                  gender: e.target.value as "male" | "female",
                })
              }
            >
              <option value="female">Самиця</option>
              <option value="male">Самець</option>
            </select>
            <input
              type="date"
              value={form.birth_date}
              onChange={(e) => setForm({ ...form, birth_date: e.target.value })}
            />
            <input
              placeholder="Номер клітки"
              value={form.cage_number}
              onChange={(e) =>
                setForm({ ...form, cage_number: e.target.value })
              }
            />
            <input
              placeholder="Нотатки"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          {error && <p className="registry-error">{error}</p>}
          <button
            className="registry-save-btn"
            onClick={handleAdd}
            disabled={saving || !form.name}
          >
            {saving ? "Збереження..." : "Зберегти"}
          </button>
        </div>
      )}

      {loading ? (
        <p className="registry-loading">Завантаження...</p>
      ) : rabbits.length === 0 ? (
        <p className="registry-empty">Кроликів ще немає. Додайте першого!</p>
      ) : (
        <div className="registry-grid">
          {rabbits.map((rabbit) => (
            <div key={rabbit.id} className="rabbit-card">
              <div className="rabbit-card-header">
                <span className="rabbit-gender">
                  {rabbit.gender === "female" ? "♀" : "♂"}
                </span>
                <h3>{rabbit.name}</h3>
                {rabbit.cage_number && (
                  <span className="rabbit-cage">
                    Клітка {rabbit.cage_number}
                  </span>
                )}
              </div>
              <div className="rabbit-card-body">
                {rabbit.breed && (
                  <p>
                    <strong>Порода:</strong> {rabbit.breed}
                  </p>
                )}
                {rabbit.birth_date && (
                  <p>
                    <strong>Нар.:</strong>{" "}
                    {new Date(rabbit.birth_date).toLocaleDateString("uk-UA")}
                  </p>
                )}
                {rabbit.notes && <p className="rabbit-notes">{rabbit.notes}</p>}
              </div>
              <div className="rabbit-card-actions">
                <button
                  className="rabbit-edit-btn"
                  onClick={() => navigate(`/registry/edit/${rabbit.id}`)}
                >
                  Редагувати
                </button>
                <button
                  className="rabbit-archive-btn"
                  onClick={() => handleArchive(rabbit.id)}
                >
                  Архівувати
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
