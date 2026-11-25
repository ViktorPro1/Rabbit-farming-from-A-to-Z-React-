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
  // Додано (пояснення): чи розкритий акордеон «Звідки беруться літери»
  const [infoOpen, setInfoOpen] = useState(false);

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

      {/* Додано (пояснення): акордеон простими словами — з чого складається
          номер і звідки беруться літери */}
      <button
        type="button"
        className="numbering-info-toggle"
        aria-expanded={infoOpen}
        aria-controls="numbering-info-body"
        onClick={() => setInfoOpen(!infoOpen)}
      >
        Звідки беруться літери в номері?
        <span className={`numbering-info-arrow ${infoOpen ? "open" : ""}`}>
          ▼
        </span>
      </button>

      {infoOpen && (
        <div id="numbering-info-body" className="numbering-info-body">
          <p className="numbering-info-lead">
            Номер складається з трьох частин. Наприклад:
          </p>

          <div className="numbering-code-example" aria-label="VK-F011">
            <span className="numbering-part numbering-part--owner">VK</span>
            <span className="numbering-part-dash">-</span>
            <span className="numbering-part numbering-part--sex">F</span>
            <span className="numbering-part numbering-part--num">011</span>
          </div>

          <ul className="numbering-info-list">
            <li>
              <strong className="numbering-part--owner">VK</strong> — ініціали
              власника. Це перші літери вашого імені та прізвища, записані
              латиницею: «Віктор Козак» дає VK. Ім'я програма бере з налаштувань
              кабінету (кнопка з вашим ім'ям угорі). Щоб змінити ініціали,
              змініть ім'я там.
            </li>
            <li>
              <strong className="numbering-part--sex">F</strong> або{" "}
              <strong className="numbering-part--sex">M</strong> — стать
              тварини. F означає самка, M означає самець. Самців і самок рахуємо
              окремо, тому можуть існувати і M006, і F006.
            </li>
            <li>
              <strong className="numbering-part--num">011</strong> — порядковий
              номер. Програма знаходить найбільший номер серед ваших тварин цієї
              статі (разом з архівними) і додає одиницю.
            </li>
          </ul>

          <p className="numbering-info-note">
            Зараз ваші ініціали:{" "}
            <strong>
              {prefix || "не задані (вкажіть ім'я в налаштуваннях кабінету)"}
            </strong>
            . Українські літери замінюються на найближчі латинські: В на V, К на
            K, Х на K, Ю на Y. Номер лише пропонується: у формі додавання його
            можна прийняти або залишити свій варіант.
          </p>
        </div>
      )}
    </div>
  );
}
