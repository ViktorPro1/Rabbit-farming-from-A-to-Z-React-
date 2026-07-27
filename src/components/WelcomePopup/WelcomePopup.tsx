import { useEffect, useRef, useState } from "react";
import "./WelcomePopup.css";

export default function WelcomePopup() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const close = () => {
    setFadeOut(true);
    fadeTimeoutRef.current = setTimeout(() => setVisible(false), 400);
  };

  useEffect(() => {
    const timer = setTimeout(close, 3000);
    return () => {
      clearTimeout(timer);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`welcome-overlay ${fadeOut ? "welcome-overlay--fade" : ""}`}
    >
      <div className="welcome-popup">
        <button
          className="welcome-popup__close"
          onClick={close}
          aria-label="Закрити"
        >
          ✕
        </button>

        <h2 className="welcome-popup__title">Ласкаво просимо!</h2>
        <p className="welcome-popup__text">
          Вітаємо вас у нашій українськомовній платформі <br />
          <strong>«Кролівництво від А до Я»</strong> — вашому надійному
          помічнику у світі кролівництва.
        </p>
      </div>
    </div>
  );
}
