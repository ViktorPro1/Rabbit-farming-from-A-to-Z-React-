import { useState } from "react";
import { createPortal } from "react-dom";
import "./FeedbackModal.css";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxocbpRQPj3r4eXdLkgLGr79E0VY0B3e-ZtMddK0VVBpd6F_mexBgXnxF5tG3qoa4Howw/exec";

type FeedbackType = "error" | "question" | "suggestion";

const FeedbackModal = ({ isOpen, onClose }: FeedbackModalProps) => {
  const [type, setType] = useState<FeedbackType>("error");
  const [page, setPage] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setStatus("sending");

    const typeLabels: Record<FeedbackType, string> = {
      error: "Знайшов помилку",
      question: "Є питання",
      suggestion: "Пропозиція",
    };

    const params = new URLSearchParams({
      type: typeLabels[type],
      page: page.trim() || window.location.pathname,
      message: message.trim(),
      email: email.trim() || "—",
      date: new Date().toLocaleString("uk-UA", { timeZone: "Europe/Kyiv" }),
    });

    try {
      await fetch(`${APPS_SCRIPT_URL}?${params.toString()}`, {
        method: "GET",
        mode: "no-cors",
      });
      setStatus("success");
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
        setPage("");
        setEmail("");
        setType("error");
        onClose();
      }, 2000);
    } catch {
      setStatus("error");
    }
  };

  return createPortal(
    <div
      className="fm-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div className="fm-modal">
        <div className="fm-header">
          <h2 className="fm-title">Зворотний зв'язок</h2>
          <button className="fm-close" onClick={onClose} aria-label="Закрити">
            ✕
          </button>
        </div>

        {status === "success" ? (
          <div className="fm-success">
            <span className="fm-success-icon">✓</span>
            <p>Дякуємо! Повідомлення надіслано.</p>
          </div>
        ) : (
          <div className="fm-body">
            <div className="fm-field">
              <label className="fm-label">Тип звернення</label>
              <div className="fm-type-group">
                {(["error", "question", "suggestion"] as FeedbackType[]).map(
                  (t) => {
                    const labels: Record<FeedbackType, string> = {
                      error: "🐛 Помилка",
                      question: "❓ Питання",
                      suggestion: "💡 Пропозиція",
                    };
                    return (
                      <button
                        key={t}
                        className={`fm-type-btn${type === t ? " fm-type-btn--active" : ""}`}
                        onClick={() => setType(t)}
                      >
                        {labels[t]}
                      </button>
                    );
                  },
                )}
              </div>
            </div>

            <div className="fm-field">
              <label className="fm-label" htmlFor="fm-page">
                Сторінка / тема{" "}
                <span className="fm-optional">(необов'язково)</span>
              </label>
              <input
                id="fm-page"
                className="fm-input"
                type="text"
                placeholder="напр. Вакцинація, ВГХК, годування кроленят…"
                value={page}
                onChange={(e) => setPage(e.target.value)}
                maxLength={120}
              />
            </div>

            <div className="fm-field">
              <label className="fm-label" htmlFor="fm-email">
                Email{" "}
                <span className="fm-optional">
                  (необов'язково — для відповіді)
                </span>
              </label>
              <input
                id="fm-email"
                className="fm-input"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={120}
              />
            </div>

            <div className="fm-field">
              <label className="fm-label" htmlFor="fm-message">
                Повідомлення <span className="fm-required">*</span>
              </label>
              <textarea
                id="fm-message"
                className="fm-textarea"
                placeholder="Опишіть помилку або питання…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                maxLength={1000}
              />
              <span className="fm-counter">{message.length}/1000</span>
            </div>

            {status === "error" && (
              <p className="fm-error-msg">
                Помилка надсилання. Спробуйте ще раз.
              </p>
            )}

            <div className="fm-footer">
              <button className="fm-btn fm-btn--cancel" onClick={onClose}>
                Скасувати
              </button>
              <button
                className="fm-btn fm-btn--submit"
                onClick={handleSubmit}
                disabled={!message.trim() || status === "sending"}
              >
                {status === "sending" ? "Надсилання…" : "Надіслати"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default FeedbackModal;
