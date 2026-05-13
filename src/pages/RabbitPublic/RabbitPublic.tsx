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

interface MatingInfo {
  mating_date: string;
  control_date: string | null;
  expected_birth: string | null;
  last_litter_birth: string | null;
  last_litter_alive: number | null;
}

export default function RabbitPublic() {
  const { id } = useParams<{ id: string }>();
  const [rabbit, setRabbit] = useState<Rabbit | null>(null);
  const [mating, setMating] = useState<MatingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;

    supabase
      .from("rabbits")
      .select("*")
      .eq("id", id)
      .single()
      .then(async ({ data: rabbitData }) => {
        if (!rabbitData) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        setRabbit(rabbitData);

        // Остання злучка де цей кролик є самцем або самицею
        const { data: matingsData } = await supabase
          .from("matings")
          .select("id, mating_date, control_date, expected_birth")
          .or(`male_id.eq.${id},female_id.eq.${id}`)
          .order("mating_date", { ascending: false })
          .limit(1);

        if (matingsData && matingsData.length > 0) {
          const lastMating = matingsData[0];

          // Останній окріл по цій злучці
          const { data: littersData } = await supabase
            .from("litters")
            .select("birth_date, alive")
            .eq("mating_id", lastMating.id)
            .order("birth_date", { ascending: false })
            .limit(1);

          const lastLitter =
            littersData && littersData.length > 0 ? littersData[0] : null;

          setMating({
            mating_date: lastMating.mating_date,
            control_date: lastMating.control_date || null,
            expected_birth: lastMating.expected_birth || null,
            last_litter_birth: lastLitter?.birth_date || null,
            last_litter_alive: lastLitter?.alive ?? null,
          });
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
        {/* ── Клітка ── */}
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

        {/* ── Основна інформація ── */}
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

        {/* ── Остання злучка ── */}
        {mating && (
          <div className="rp-mating-block">
            <div className="rp-mating-title">🐇 Остання злучка</div>
            <div className="rp-info rp-info--mating">
              <div className="rp-row">
                <span className="rp-row-label">Дата злучки</span>
                <span className="rp-row-value">
                  {new Date(mating.mating_date).toLocaleDateString("uk-UA")}
                </span>
              </div>

              {mating.control_date && (
                <div className="rp-row">
                  <span className="rp-row-label">Контрольна дата</span>
                  <span className="rp-row-value">
                    {new Date(mating.control_date).toLocaleDateString("uk-UA")}
                  </span>
                </div>
              )}

              {mating.expected_birth && (
                <div className="rp-row">
                  <span className="rp-row-label">Очікуваний окріл</span>
                  <span className="rp-row-value rp-expected">
                    {new Date(mating.expected_birth).toLocaleDateString(
                      "uk-UA",
                    )}
                  </span>
                </div>
              )}

              {mating.last_litter_birth && (
                <div className="rp-row">
                  <span className="rp-row-label">Окріл відбувся</span>
                  <span className="rp-row-value rp-born">
                    {new Date(mating.last_litter_birth).toLocaleDateString(
                      "uk-UA",
                    )}
                    {mating.last_litter_alive !== null &&
                      mating.last_litter_alive > 0 &&
                      ` · живих: ${mating.last_litter_alive}`}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="rp-footer">
          <span>🐇 Кролівництво від А до Я</span>
        </div>
      </div>
    </div>
  );
}
