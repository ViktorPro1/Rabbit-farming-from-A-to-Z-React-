import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import { logError } from "../../lib/logError";
import {
  getNumberingInfo,
  findGaps,
  suggestCode,
  ownerInitials,
  type NamedRabbit,
} from "./numbering";
import "./NumberingPage.css";

interface Props {
  session: Session;
}

// Додано (пропуски): скільки пропущених номерів показувати, решту згортаємо
const MAX_GAPS_SHOWN = 20;

// [3, 6, 7] -> "3, 6, 7"; довгий список -> "1, 2, ... та ще 15"
function formatGaps(gaps: number[]): string {
  if (gaps.length === 0) return "пропусків немає";
  const shown = gaps.slice(0, MAX_GAPS_SHOWN).join(", ");
  const rest = gaps.length - MAX_GAPS_SHOWN;
  return rest > 0 ? `${shown} та ще ${rest}` : shown;
}

export default function NumberingPage({ session }: Props) {
  const navigate = useNavigate();
  const [rabbits, setRabbits] = useState<NamedRabbit[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    // Важливо: тут НЕМАЄ фільтра is_active, щоб враховувати і архівних
    // тварин. Інакше номер архівованого кролика потрапив би новій тварині.
    supabase
      .from("rabbits")
      .select("name, gender")
      .eq("user_id", session.user.id)
      .then(
        ({ data, error }) => {
          if (cancelled) return;
          if (error) {
            logError("NumberingPage.load", error);
            setLoadError("Не вдалося завантажити дані. Оновіть сторінку");
          } else {
            setRabbits((data || []) as NamedRabbit[]);
          }
          setLoading(false);
        },
        (err) => {
          if (cancelled) return;
          logError("NumberingPage.load", err);
          setLoadError("Не вдалося завантажити дані. Оновіть сторінку");
          setLoading(false);
        },
      );

    return () => {
      cancelled = true;
    };
  }, [session.user.id]);

  // Змінено: ініціали власника для кодів на кшталт "VK-M011"
  const prefix = ownerInitials(session.user.user_metadata?.display_name);
  const males = getNumberingInfo(rabbits, "male");
  const females = getNumberingInfo(rabbits, "female");
  // Додано (пропуски): номери, яких немає між 1 і останнім використаним
  const maleGaps = findGaps(rabbits, "male");
  const femaleGaps = findGaps(rabbits, "female");

  return (
    <div className="numbering-page">
      <button className="numbering-back" onClick={() => navigate(-1)}>
        ← Мої кролики
      </button>

      <h1 className="numbering-title">Нумерація</h1>
      <p className="numbering-sub">
        Наступний вільний номер для нових тварин. Враховуються і архівні.
      </p>

      {loadError && <p className="numbering-error">{loadError}</p>}

      <div className="numbering-grid">
        <section className="numbering-card numbering-card--male">
          <span className="numbering-label">♂ Самці</span>
          <span className="numbering-next">{loading ? "…" : males.next}</span>
          <span className="numbering-hint">
            Наступний: {loading ? "…" : suggestCode(rabbits, "male", prefix)}
          </span>
          <span className="numbering-last">
            Останній використаний: {loading ? "…" : males.last || "немає"}
          </span>
          <span className="numbering-gaps">
            Пропущені: {loading ? "…" : formatGaps(maleGaps)}
          </span>
        </section>

        <section className="numbering-card numbering-card--female">
          <span className="numbering-label">♀ Самки</span>
          <span className="numbering-next">{loading ? "…" : females.next}</span>
          <span className="numbering-hint">
            Наступна: {loading ? "…" : suggestCode(rabbits, "female", prefix)}
          </span>
          <span className="numbering-last">
            Остання використана: {loading ? "…" : females.last || "немає"}
          </span>
          <span className="numbering-gaps">
            Пропущені: {loading ? "…" : formatGaps(femaleGaps)}
          </span>
        </section>
      </div>
    </div>
  );
}
