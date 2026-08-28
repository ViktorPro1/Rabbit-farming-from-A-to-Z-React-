import { useState, type FormEvent } from "react";
import { supabase } from "../../lib/supabase";
import { logError } from "../../lib/logError";
import RabbitStamp from "./RabbitStamp";
import "./EmailGateModal.css";

interface EmailGateModalProps {
  source: string;
  fileUrl: string;
  title: string;
  description: string;
  onClose: () => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "submitting" | "success" | "error";

export default function EmailGateModal({
  source,
  fileUrl,
  title,
  description,
  onClose,
}: EmailGateModalProps) {
  const [email, setEmail] = useState("");
  // Приховане поле-пастка для ботів: справжній користувач його не бачить
  // і не заповнює (сховане через CSS, а не display:none — деякі боти
  // ігнорують display:none при заповненні форм).
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const triggerDownload = () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Бот заповнив приховане поле — тихо показуємо "успіх" і навіть даємо
    // завантажити файл, але в базу нічого не пишемо.
    if (honeypot) {
      setStatus("success");
      triggerDownload();
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      setErrorMessage("Введіть коректну електронну адресу");
      setStatus("error");
      return;
    }

    setStatus("submitting");

    const { error } = await supabase.from("leads").insert({ email, source });

    if (error) {
      logError("EmailGateModal.handleSubmit", error);
      setErrorMessage("Не вдалося зберегти email. Спробуйте ще раз.");
      setStatus("error");
      return;
    }

    setStatus("success");
    triggerDownload();
  };

  return (
    <div className="email-gate-modal__overlay" onClick={onClose}>
      <div
        className="email-gate-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          className="email-gate-modal__close"
          onClick={onClose}
          aria-label="Закрити"
        >
          ×
        </button>

        {status === "success" ? (
          <div className="email-gate-modal__success">
            <div className="email-gate-modal__badge">
              <RabbitStamp />
            </div>
            <p>Файл завантажено.</p>
            <button type="button" onClick={onClose}>
              Закрити
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="email-gate-modal__form">
            <div className="email-gate-modal__badge">
              <RabbitStamp />
            </div>

            <h3 className="email-gate-modal__title">{title}</h3>
            <p className="email-gate-modal__desc">{description}</p>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              className="email-gate-modal__input"
            />

            <input
              type="text"
              value={honeypot}
              onChange={(event) => setHoneypot(event.target.value)}
              className="email-gate-modal__honeypot"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            {status === "error" && (
              <p className="email-gate-modal__error">{errorMessage}</p>
            )}

            <button
              type="submit"
              className="email-gate-modal__submit"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "Завантажуємо..." : "Завантажити файл"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
