import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import "./Archive.css";

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
}

export default function Archive({ session }: Props) {
  const [rabbits, setRabbits] = useState<Rabbit[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase
      .from("rabbits")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("is_active", false)
      .order("cage_number", { ascending: true })
      .then(({ data }) => {
        setRabbits(data || []);
        setLoading(false);
      });
  }, [session.user.id]);

  async function handleRestore(id: string) {
    await supabase.from("rabbits").update({ is_active: true }).eq("id", id);
    setRabbits((prev) => prev.filter((r) => r.id !== id));
  }

  async function handleDelete(id: string) {
    if (!confirm("Видалити назавжди?")) return;
    await supabase.from("rabbits").delete().eq("id", id);
    setRabbits((prev) => prev.filter((r) => r.id !== id));
  }

  if (loading) return <p style={{ padding: "2rem" }}>Завантаження...</p>;

  return (
    <div className="archive-page">
      <div className="archive-header">
        <h1>📦 Архів кроликів</h1>
        <button
          className="archive-back-btn"
          onClick={() => navigate("/registry")}
        >
          ⬅ Мої кролики
        </button>
      </div>

      {rabbits.length === 0 ? (
        <p className="archive-empty">Архів порожній.</p>
      ) : (
        <div className="archive-grid">
          {rabbits.map((rabbit) => (
            <div key={rabbit.id} className="archive-card">
              <div className="archive-card-header">
                <span className="archive-gender">
                  {rabbit.gender === "female" ? "♀" : "♂"}
                </span>
                <h3>{rabbit.name}</h3>
                {rabbit.cage_number && (
                  <span className="archive-cage">
                    Клітка {rabbit.cage_number}
                  </span>
                )}
              </div>
              <div className="archive-card-body">
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
                {rabbit.notes && (
                  <p className="archive-notes">{rabbit.notes}</p>
                )}
              </div>
              <div className="archive-card-actions">
                <button
                  className="archive-restore-btn"
                  onClick={() => handleRestore(rabbit.id)}
                >
                  Відновити
                </button>
                <button
                  className="archive-delete-btn"
                  onClick={() => handleDelete(rabbit.id)}
                >
                  Видалити
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
