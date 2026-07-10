import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./FatteningPublic.css";

interface FatteningCage {
  id: string;
  cage_number: string;
  males: number;
  females: number;
  unknown: number;
  breed: string;
  birth_date: string;
  slaughter_date: string;
  notes: string;
}

function calcSlaughterDate(birthDate: string): string {
  if (!birthDate) return "";
  const d = new Date(birthDate);
  d.setDate(d.getDate() + 110);
  return d.toISOString().split("T")[0];
}

export default function FatteningPublic() {
  const { id } = useParams<{ id: string }>();
  const [cage, setCage] = useState<FatteningCage | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("fattening")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (data) {
          setCage(data);
        } else {
          setNotFound(true);
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="fp-wrap">
        <div className="fp-loading">Завантаження...</div>
      </div>
    );
  }

  if (notFound || !cage) {
    return (
      <div className="fp-wrap">
        <div className="fp-not-found">
          <div className="fp-not-found-icon">🥩</div>
          <h2>Клітку не знайдено</h2>
          <p>Можливо, її було видалено.</p>
        </div>
      </div>
    );
  }

  const total = (cage.males || 0) + (cage.females || 0) + (cage.unknown || 0);

  const birth = cage.birth_date ? new Date(cage.birth_date) : null;

  const slaughterStr =
    cage.slaughter_date ||
    (cage.birth_date ? calcSlaughterDate(cage.birth_date) : null);
  const slaughter = slaughterStr ? new Date(slaughterStr) : null;

  const today = new Date();
  const daysLeft = slaughter
    ? Math.ceil((slaughter.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const ageInDays = birth
    ? Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="fp-wrap">
      <div className="fp-card">
        <div className="fp-cage-header">
          <span className="fp-section-label">Відгодівля</span>
          <span className="fp-cage-label">Клітка</span>
          <span className="fp-cage-number">
            {cage.cage_number ? `№ ${cage.cage_number}` : "—"}
          </span>
        </div>

        <div className="fp-total-badge">Всього: {total} гол.</div>

        <div className="fp-info">
          {(cage.males > 0 || cage.females > 0 || cage.unknown > 0) && (
            <div className="fp-row">
              <span className="fp-row-label">Склад</span>
              <span className="fp-row-value fp-gender-row">
                {cage.males > 0 && <span>♂ {cage.males}</span>}
                {cage.females > 0 && <span>♀ {cage.females}</span>}
                {cage.unknown > 0 && <span>? {cage.unknown}</span>}
              </span>
            </div>
          )}

          {cage.breed && (
            <div className="fp-row">
              <span className="fp-row-label">Порода</span>
              <span className="fp-row-value">{cage.breed}</span>
            </div>
          )}

          {birth && (
            <div className="fp-row">
              <span className="fp-row-label">Дата народження</span>
              <span className="fp-row-value">
                {birth.toLocaleDateString("uk-UA")}
              </span>
            </div>
          )}

          {ageInDays !== null && (
            <div className="fp-row">
              <span className="fp-row-label">Вік</span>
              <span className="fp-row-value">{ageInDays} дн.</span>
            </div>
          )}

          {slaughter && (
            <div
              className={`fp-row fp-row--slaughter${daysLeft !== null && daysLeft <= 7 ? " fp-row--soon" : ""}`}
            >
              <span className="fp-row-label">Планова дата забою</span>
              <span className="fp-row-value">
                {slaughter.toLocaleDateString("uk-UA")}
                {daysLeft !== null && (
                  <span className="fp-days-left">
                    {daysLeft > 0
                      ? ` (через ${daysLeft} дн.)`
                      : daysLeft === 0
                        ? " (сьогодні!)"
                        : ` (прострочено на ${Math.abs(daysLeft)} дн.)`}
                  </span>
                )}
              </span>
            </div>
          )}

          {cage.notes && (
            <div className="fp-row fp-row--notes">
              <span className="fp-row-label">Нотатки</span>
              <span className="fp-row-value">{cage.notes}</span>
            </div>
          )}
        </div>

        <div className="fp-footer">
          <span>🐇 Кролівництво від А до Я</span>
        </div>
      </div>
    </div>
  );
}
