import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./RabbitPublic.css";

interface Rabbit {
  id: string;
  name: string;
  breed: string;
  gender: "male" | "female";
  birth_date: string;
  cage_number: string;
  notes: string;
}

export default function RabbitPublic() {
  const { id } = useParams<{ id: string }>();
  const [rabbit, setRabbit] = useState<Rabbit | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("rabbits")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (data) {
          setRabbit(data);
        } else {
          setNotFound(true);
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="rp-wrap">
        <div className="rp-loading">Завантаження...</div>
      </div>
    );
  }

  if (notFound || !rabbit) {
    return (
      <div className="rp-wrap">
        <div className="rp-not-found">
          <div className="rp-not-found-icon">🐇</div>
          <h2>Кролика не знайдено</h2>
          <p>Можливо, його було видалено або архівовано.</p>
        </div>
      </div>
    );
  }

  const birth = rabbit.birth_date ? new Date(rabbit.birth_date) : null;
  let age = "";
  if (birth) {
    const today = new Date();
    const days = Math.floor(
      (today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24),
    );
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
    if (years >= 1) {
      const remMonths = Math.floor((days - years * 365) / 30);
      age = remMonths > 0 ? `${years} р. ${remMonths} міс.` : `${years} р.`;
    } else if (months >= 1) {
      const remDays = days - months * 30;
      age = remDays > 0 ? `${months} міс. ${remDays} дн.` : `${months} міс.`;
    } else {
      age = `${days} дн.`;
    }
  }

  return (
    <div className="rp-wrap">
      <div className="rp-card">
        <div className="rp-cage-header">
          <span className="rp-cage-label">Клітка</span>
          <span className="rp-cage-number">
            {rabbit.cage_number ? `№ ${rabbit.cage_number}` : "—"}
          </span>
        </div>

        <div className="rp-gender-badge">
          {rabbit.gender === "female" ? "♀ Самиця" : "♂ Самець"}
        </div>

        <h1 className="rp-name">{rabbit.name}</h1>

        <div className="rp-info">
          {rabbit.breed && (
            <div className="rp-row">
              <span className="rp-row-label">Порода</span>
              <span className="rp-row-value">{rabbit.breed}</span>
            </div>
          )}
          {birth && (
            <div className="rp-row">
              <span className="rp-row-label">Дата народження</span>
              <span className="rp-row-value">
                {birth.toLocaleDateString("uk-UA")}
              </span>
            </div>
          )}
          {age && (
            <div className="rp-row">
              <span className="rp-row-label">Вік</span>
              <span className="rp-row-value">{age}</span>
            </div>
          )}
          {rabbit.notes && (
            <div className="rp-row rp-row--notes">
              <span className="rp-row-label">Нотатки</span>
              <span className="rp-row-value">{rabbit.notes}</span>
            </div>
          )}
        </div>

        <div className="rp-footer">
          <span>🐇 Кролівництво від А до Я</span>
        </div>
      </div>
    </div>
  );
}
