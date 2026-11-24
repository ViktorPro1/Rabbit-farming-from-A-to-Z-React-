import { useEffect, useState } from "react";
import "./AssistantPromo.css";

type Stage =
  | "hidden"
  | "typing1"
  | "telegram"
  | "typing2"
  | "facebook"
  | "typing3"
  | "review";

const TG_URL = "https://t.me/rabbit_farming_from_a_to_z";
const FB_URL = "https://www.facebook.com/groups/998532079304207";

export default function AssistantPromo() {
  const [stage, setStage] = useState<Stage>("hidden");
  // Хрестик ховає лише поточне повідомлення, наступні покажуться за таймерами
  function dismiss() {
    setStage("hidden");
  }

  useEffect(() => {
    const go = (next: Stage) => () => setStage(next);

    const timers = [
      setTimeout(go("typing1"), 38000), // 38 с: друк (Telegram)
      setTimeout(go("telegram"), 41500), // 41.5 с: Telegram
      setTimeout(go("typing2"), 180000), // 3 хв: друк (Facebook)
      setTimeout(go("facebook"), 183500), // 3 хв 3.5 с: Facebook
      setTimeout(go("typing3"), 300000), // 5 хв: друк (відгук)
      setTimeout(go("review"), 303500), // 5 хв 3.5 с: прохання про відгук
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  if (stage === "hidden") return null;

  return (
    <div className="apromo">
      {/* Стан друку (для всіх повідомлень) */}
      {(stage === "typing1" || stage === "typing2" || stage === "typing3") && (
        <div className="apromo__bubble apromo__bubble--typing apromo__bubble--in">
          <div className="apromo__avatar apromo__avatar--emoji">
            <span className="apromo__emoji">🐇</span>
          </div>
          <div className="apromo__dots">
            <span />
            <span />
            <span />
          </div>
        </div>
      )}

      {/* Повідомлення про Telegram */}
      {stage === "telegram" && (
        <div className="apromo__bubble apromo__bubble--in">
          <button
            className="apromo__close"
            onClick={dismiss}
            aria-label="Закрити"
          >
            &#x2715;
          </button>
          <div className="apromo__row">
            <div className="apromo__avatar apromo__avatar--tg">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
                <path d="M9.04 15.5 8.9 19.1c.4 0 .6-.2.8-.4l2-1.9 4.2 3.1c.8.4 1.4.2 1.6-.8l3-14c.3-1.3-.5-1.8-1.3-1.5L2.6 9.7c-1.3.5-1.3 1.2-.2 1.5l4.6 1.4L17.5 6.7c.5-.3.9-.1.5.3" />
              </svg>
            </div>
            <div className="apromo__content">
              <div className="apromo__platform apromo__platform--tg">
                Telegram
              </div>
              <p className="apromo__text">
                Маємо офіційну спільноту в Telegram! Поради, обговорення та
                відповіді на питання.
              </p>
              <a
                href={TG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="apromo__btn apromo__btn--tg"
              >
                Приєднатися
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Повідомлення про Facebook */}
      {stage === "facebook" && (
        <div className="apromo__bubble apromo__bubble--in">
          <button
            className="apromo__close"
            onClick={dismiss}
            aria-label="Закрити"
          >
            &#x2715;
          </button>
          <div className="apromo__row">
            <div className="apromo__avatar apromo__avatar--fb">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
                <path d="M22 12a10 10 0 1 0-11.6 9.9v-7h-2.2V12h2.2V9.8c0-2.2 1.3-3.4 3.3-3.4.9 0 1.9.2 1.9.2v2.1h-1.1c-1.1 0-1.4.7-1.4 1.4V12h2.4l-.4 2.9h-2v7A10 10 0 0 0 22 12" />
              </svg>
            </div>
            <div className="apromo__content">
              <div className="apromo__platform apromo__platform--fb">
                Facebook
              </div>
              <p className="apromo__text">
                Є і група у Facebook — діліться досвідом та фото своїх кроликів!
              </p>
              <a
                href={FB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="apromo__btn apromo__btn--fb"
              >
                Приєднатися
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Прохання залишити відгук */}
      {stage === "review" && (
        <div className="apromo__bubble apromo__bubble--in apromo__bubble--review">
          <button
            className="apromo__close"
            onClick={dismiss}
            aria-label="Закрити"
          >
            &#x2715;
          </button>
          <div className="apromo__row">
            <div className="apromo__avatar apromo__avatar--emoji">
              <span className="apromo__emoji">🐇</span>
            </div>
            <div className="apromo__content">
              <div className="apromo__title">Ваша думка важлива</div>
              <p className="apromo__text apromo__text--review">
                Ми розуміємо, що ваш час дорогий, але просимо залишити відгук
                про довідник, перейшовши в наші спільноти. Дякуємо за розуміння.
              </p>
              <div className="apromo__actions">
                <a
                  href={TG_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="apromo__btn apromo__btn--light apromo__btn--light-tg"
                >
                  Telegram
                </a>
                <a
                  href={FB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="apromo__btn apromo__btn--light apromo__btn--light-fb"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
