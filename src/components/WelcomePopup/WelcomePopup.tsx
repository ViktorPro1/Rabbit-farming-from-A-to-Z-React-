import { useEffect, useState } from "react";
import "./WelcomePopup.css";

export default function WelcomePopup() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  const close = () => {
    setFadeOut(true);
    setTimeout(() => setVisible(false), 400);
  };

  useEffect(() => {
    const timer = setTimeout(close, 3000);
    return () => clearTimeout(timer);
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
