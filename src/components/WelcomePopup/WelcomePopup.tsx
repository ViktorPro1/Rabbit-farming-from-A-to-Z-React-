import { useEffect, useRef, useState } from "react";
import "./WelcomePopup.css";

const STORAGE_KEY = "welcomePopupSeen";

export default function WelcomePopup() {
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoCloseRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const close = () => {
    setFadeOut(true);
    localStorage.setItem(STORAGE_KEY, "1");
    fadeTimeoutRef.current = setTimeout(() => setVisible(false), 400);
  };

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;

    // невелика затримка перед появою, щоб не "стрибало" одразу при завантаженні
    const showTimer = setTimeout(() => setVisible(true), 600);

    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    autoCloseRef.current = setTimeout(close, 6000);
    return () => {
      if (autoCloseRef.current) clearTimeout(autoCloseRef.current);
      if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    };
  }, [visible]);

  const pause = () => {
    if (autoCloseRef.current) clearTimeout(autoCloseRef.current);
  };

  const resume = () => {
    autoCloseRef.current = setTimeout(close, 3000);
  };

  if (!visible) return null;

  return (
    <div
      className={`welcome-toast ${fadeOut ? "welcome-toast--fade" : ""}`}
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <button
        className="welcome-toast__close"
        onClick={close}
        aria-label="Закрити"
      >
        ✕
      </button>

      <h2 className="welcome-toast__title">Ласкаво просимо!</h2>
      <p className="welcome-toast__text">
        Вітаємо вас на платформі <strong>«Кролівництво від А до Я»</strong> —
        вашому надійному помічнику у світі кролівництва.
      </p>
    </div>
  );
}
