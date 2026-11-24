import { useEffect, useRef, useState } from "react";
import { useMinuteOfSilence } from "../../hooks/useMinuteOfSilence";
import "./MinuteOfSilence.css";

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Скільки секунд лишилось до 9:01. Секунди однакові в усіх часових поясах.
function getSecondsLeft(): number {
  return 60 - new Date().getSeconds();
}

interface SilenceDialogProps {
  onClose: () => void;
}

// Саме вікно. Створюється лише тоді, коли його треба показати,
// тому початкове значення таймера береться в момент появи.
function SilenceDialog({ onClose }: SilenceDialogProps) {
  const [secondsLeft, setSecondsLeft] = useState(getSecondsLeft);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Таймер оновлюється щосекунди
  useEffect(() => {
    const id = setInterval(() => setSecondsLeft(getSecondsLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  // Закриття клавішею Esc, блокування прокрутки сторінки, фокус на кнопці
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const progress = secondsLeft / 60;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className="mos-overlay" role="presentation">
      <div
        className="mos-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mos-title"
        aria-describedby="mos-text"
      >
        <div className="mos-flag" aria-hidden="true" />

        <div className="mos-timer" aria-hidden="true">
          <svg viewBox="0 0 120 120" className="mos-ring">
            <circle className="mos-ring-track" cx="60" cy="60" r={RADIUS} />
            <circle
              className="mos-ring-progress"
              cx="60"
              cy="60"
              r={RADIUS}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
            />
          </svg>
          <span className="mos-seconds">{secondsLeft}</span>
        </div>

        <p className="mos-time">09:00</p>
        <h2 id="mos-title" className="mos-title">
          Хвилина мовчання
        </h2>
        <p className="mos-tagline">Пам'ятаємо. Вшановуємо. Не забуваємо.</p>
        <div id="mos-text" className="mos-text">
          <p>
            Зупинімося на хвилину, щоб вшанувати пам'ять усіх, хто загинув
            унаслідок російської агресії проти України.
          </p>
          <p className="mos-list">
            Військових і добровольців, медиків, рятувальників, журналістів,
            волонтерів та мирних жителів.
          </p>
        </div>

        <button
          ref={closeButtonRef}
          type="button"
          className="mos-close"
          onClick={onClose}
        >
          Закрити
        </button>
      </div>
    </div>
  );
}

export default function MinuteOfSilence() {
  const { isOpen, close } = useMinuteOfSilence();

  if (!isOpen) return null;

  return <SilenceDialog onClose={close} />;
}
