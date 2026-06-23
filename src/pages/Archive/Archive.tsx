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
  const [showInfo, setShowInfo] = useState(false);
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

    const { error } = await supabase
      .from("rabbits")
      .delete()
      .eq("id", id)
      .eq("user_id", session.user.id);

    if (error) {
      if (error.code === "23503") {
        alert(
          "❌ Неможливо видалити — цей кролик задіяний у записах розведення.",
        );
      } else {
        alert("Помилка видалення: " + error.message);
      }
      return;
    }

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
        <div className="archive-empty-state">
          <div className="archive-empty-illustration">📦</div>
          <h3 className="archive-empty-title">Архів порожній</h3>
          <p className="archive-empty-desc">
            Тут з'являться кролики яких ти перемістив з активного реєстру.
            Архівовані тварини не враховуються в статистиці.
          </p>
        </div>
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
      <div className="archive-info">
        <button
          className="archive-info-toggle"
          onClick={() => setShowInfo(!showInfo)}
        >
          <span>📋 Чому не можна видалити деяких кроликів?</span>
          <span>{showInfo ? "▲" : "▼"}</span>
        </button>

        {showInfo && (
          <div className="archive-info-body">
            <p>
              Якщо при видаленні з'являється повідомлення{" "}
              <strong>"кролик задіяний у записах розведення"</strong> — це
              означає що цей кролик фігурує в одному або кількох записах злучок
              чи окролів.
            </p>
            <p>
              Видалення заблоковане автоматично щоб не зламати історію
              розведення. Що можна зробити:
            </p>
            <ul>
              <li>
                Залишити в архіві — займає мінімум місця і зберігає повну
                історію
              </li>
              <li>
                Спочатку видалити пов'язані злучки в розділі{" "}
                <strong>Розведення</strong> або{" "}
                <strong>Підлогове утримання</strong>, потім повернутись і
                видалити кролика
              </li>
            </ul>
            <p className="archive-info-tip">
              💡 Рекомендуємо просто залишати таких тварин в архіві — це не
              впливає на роботу реєстру і статистики.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
