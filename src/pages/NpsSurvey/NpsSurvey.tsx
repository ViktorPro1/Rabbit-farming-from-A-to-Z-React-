import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
// TODO: adjust this import to match where your Supabase client actually lives
// in the project (e.g. "../../supabaseClient" or "@/lib/supabase").
import { supabase } from "../../lib/supabase";
import "./NpsSurvey.css";

type Category = "detractor" | "passive" | "promoter";
type Mood = "idle" | "low" | "mid" | "high";

const SCORES = Array.from({ length: 11 }, (_, i) => i);

function categoryOf(score: number): Category {
  if (score <= 6) return "detractor";
  if (score <= 8) return "passive";
  return "promoter";
}

function moodOf(score: number | null): Mood {
  if (score === null) return "idle";
  const cat = categoryOf(score);
  if (cat === "detractor") return "low";
  if (cat === "passive") return "mid";
  return "high";
}

const FOLLOW_UP_PROMPT: Record<Category, string> = {
  detractor: "Що ми можемо покращити?",
  passive: "Що вплинуло на вашу оцінку?",
  promoter: "Що вам сподобалось найбільше?",
};

const MOOD_CAPTION: Record<Mood, string> = {
  idle: "Обери оцінку — мені цікаво!",
  low: "Ой... розкажи, що пішло не так",
  mid: "Дякую! А що можна покращити?",
  high: "Ураа, дуже приємно! 🎉",
};

const RabbitMascot = ({
  mood,
  theme = "light",
  size = 140,
}: {
  mood: Mood;
  theme?: "light" | "onGreen";
  size?: number;
}) => {
  const line = theme === "onGreen" ? "#ffffff" : "var(--green-dark)";
  const bodyBg =
    theme === "onGreen" ? "rgba(255,255,255,0.18)" : "var(--green-pale)";
  const earTilt = mood === "low" ? 34 : mood === "high" ? 6 : 14;

  return (
    <div className="nps-mascot" key={mood}>
      <svg
        viewBox="0 0 220 220"
        width={size}
        height={size}
        role="img"
        aria-label="Кролик-маскот"
      >
        <ellipse cx="110" cy="190" rx="60" ry="28" fill={bodyBg} />

        <g transform={`rotate(-${earTilt} 88 95)`}>
          <ellipse
            cx="82"
            cy="55"
            rx="17"
            ry="48"
            fill="white"
            stroke={line}
            strokeWidth="4"
          />
          <ellipse cx="82" cy="58" rx="8" ry="32" fill="#f4b9c8" />
        </g>
        <g transform={`rotate(${earTilt} 132 95)`}>
          <ellipse
            cx="138"
            cy="55"
            rx="17"
            ry="48"
            fill="white"
            stroke={line}
            strokeWidth="4"
          />
          <ellipse cx="138" cy="58" rx="8" ry="32" fill="#f4b9c8" />
        </g>

        {mood === "high" && (
          <>
            <ellipse
              cx="52"
              cy="70"
              rx="12"
              ry="20"
              fill="white"
              stroke={line}
              strokeWidth="3"
              transform="rotate(-30 52 70)"
            />
            <ellipse
              cx="168"
              cy="70"
              rx="12"
              ry="20"
              fill="white"
              stroke={line}
              strokeWidth="3"
              transform="rotate(30 168 70)"
            />
            <path
              d="M40 40 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4z"
              fill="#f4c95d"
            />
            <path
              d="M182 50 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3z"
              fill="#f4c95d"
            />
          </>
        )}

        <circle
          cx="110"
          cy="125"
          r="58"
          fill="white"
          stroke={line}
          strokeWidth="4"
        />

        <ellipse cx="78" cy="135" rx="10" ry="7" fill="#f4b9c8" opacity="0.6" />
        <ellipse
          cx="142"
          cy="135"
          rx="10"
          ry="7"
          fill="#f4b9c8"
          opacity="0.6"
        />

        {mood === "low" && (
          <>
            <line
              x1="86"
              y1="102"
              x2="100"
              y2="108"
              stroke={line}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <line
              x1="134"
              y1="102"
              x2="120"
              y2="108"
              stroke={line}
              strokeWidth="3"
              strokeLinecap="round"
            />
          </>
        )}

        {mood === "high" ? (
          <>
            <path
              d="M84 118 Q92 108 100 118"
              stroke={line}
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M120 118 Q128 108 136 118"
              stroke={line}
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
          </>
        ) : (
          <>
            <circle cx="92" cy="118" r="6" fill={line} />
            <circle cx="128" cy="118" r="6" fill={line} />
          </>
        )}

        <ellipse cx="110" cy="132" rx="5" ry="3.5" fill="#f4b9c8" />

        {mood === "low" && (
          <path
            d="M96 148 Q110 136 124 148"
            stroke={line}
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
        )}
        {mood === "idle" && (
          <path
            d="M98 142 Q110 150 122 142"
            stroke={line}
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
        )}
        {mood === "mid" && (
          <line
            x1="100"
            y1="142"
            x2="120"
            y2="142"
            stroke={line}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        )}
        {mood === "high" && (
          <path
            d="M92 140 Q110 162 128 140"
            stroke={line}
            strokeWidth="3.5"
            fill="#f4b9c8"
            strokeLinecap="round"
          />
        )}
      </svg>
      <p
        className="nps-mascot-caption"
        style={theme === "onGreen" ? { color: "white" } : undefined}
      >
        {MOOD_CAPTION[mood]}
      </p>
    </div>
  );
};

const NpsSurvey = () => {
  const [score, setScore] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "done" | "error"
  >("idle");

  const category = useMemo(
    () => (score !== null ? categoryOf(score) : null),
    [score],
  );
  const mood = moodOf(score);

  const handleSubmit = async () => {
    if (score === null || category === null) return;
    setStatus("submitting");
    const { error } = await supabase.from("nps_feedback").insert({
      score,
      category,
      comment: comment.trim() || null,
    });
    if (error) {
      console.error("[NpsSurvey] insert failed", error);
      setStatus("error");
      return;
    }
    setStatus("done");
  };

  if (status === "done") {
    return (
      <main className="nps-page">
        <div className="nps-header">
          <h1>⭐ Оцініть платформу</h1>
          <p>Яка ймовірність того, що ви порадите нас друзям або колегам?</p>
        </div>
        <div className="nps-wrap">
          <div className="nps-thanks-cta">
            <RabbitMascot mood="high" theme="onGreen" size={160} />
            <h2>Відгук надіслано</h2>
            <p>
              Ми читаємо кожну відповідь і використовуємо її, щоб покращувати
              сайт.
            </p>
            <Link to="/" className="nps-back-btn">
              ← На головну
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="nps-page">
      <div className="nps-header">
        <h1>⭐ Оцініть платформу</h1>
        <p>Яка ймовірність того, що ви порадите нас друзям або колегам?</p>
      </div>

      <div className="nps-wrap">
        <div className="nps-card">
          <RabbitMascot mood={mood} />

          <div
            className="nps-scale"
            role="radiogroup"
            aria-label="Оцінка від 0 до 10"
          >
            {SCORES.map((n) => {
              const cat = categoryOf(n);
              return (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={score === n}
                  className={`nps-circle nps-circle--${cat}${
                    score === n ? " nps-circle--active" : ""
                  }`}
                  onClick={() => setScore(n)}
                >
                  {n}
                </button>
              );
            })}
          </div>

          <div className="nps-scale-labels">
            <span>Навряд чи</span>
            <span>Обов&apos;язково пораджу</span>
          </div>

          {score !== null && category && (
            <div className="nps-followup">
              <label htmlFor="nps-comment" className="nps-followup-label">
                {FOLLOW_UP_PROMPT[category]}
              </label>
              <textarea
                id="nps-comment"
                className="nps-textarea"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Необов'язково"
              />
              <button
                type="button"
                className="nps-submit"
                onClick={handleSubmit}
                disabled={status === "submitting"}
              >
                {status === "submitting" ? "Надсилаємо…" : "Надіслати відгук"}
              </button>
              {status === "error" && (
                <p className="nps-error">
                  Не вдалося надіслати. Спробуйте ще раз.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="nps-back">
          <Link to="/" className="nps-back-btn">
            ← На головну
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NpsSurvey;
