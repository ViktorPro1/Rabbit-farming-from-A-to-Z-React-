import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import "./RabbitEdit.css";

interface Props {
  session: Session;
}

const emptyForm = {
  name: "",
  breed: "",
  gender: "female" as "male" | "female",
  birth_date: "",
  cage_number: "",
  notes: "",
};

export default function RabbitEdit({ session }: Props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    supabase
      .from("rabbits")
      .select("*")
      .eq("id", id)
      .eq("user_id", session.user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setForm({
            name: data.name || "",
            breed: data.breed || "",
            gender: data.gender || "female",
            birth_date: data.birth_date || "",
            cage_number: data.cage_number || "",
            notes: data.notes || "",
          });
        }
        setLoading(false);
      });
  }, [id, session.user.id]);

  async function handleSave() {
    if (!form.name.trim()) return;
    setSaving(true);
    setError("");
    const { error } = await supabase
      .from("rabbits")
      .update(form)
      .eq("id", id)
      .eq("user_id", session.user.id);
    if (error) {
      setError("Помилка збереження");
    } else {
      navigate("/registry");
    }
    setSaving(false);
  }

  if (loading) return <p style={{ padding: "2rem" }}>Завантаження...</p>;

  return (
    <div className="edit-page">
      <div className="edit-header">
        <h1>✏️ Редагування кролика</h1>
      </div>

      <div className="edit-form">
        <div className="edit-form-grid">
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
              setForm({ ...form, gender: e.target.value as "male" | "female" })
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
            onChange={(e) => setForm({ ...form, cage_number: e.target.value })}
          />
          <input
            placeholder="Нотатки"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>

        {error && <p className="edit-error">{error}</p>}

        <div className="edit-actions">
          <button className="edit-cancel" onClick={() => navigate("/registry")}>
            Скасувати
          </button>
          <button
            className="edit-save"
            onClick={handleSave}
            disabled={saving || !form.name}
          >
            {saving ? "Збереження..." : "Зберегти"}
          </button>
        </div>
      </div>
    </div>
  );
}
