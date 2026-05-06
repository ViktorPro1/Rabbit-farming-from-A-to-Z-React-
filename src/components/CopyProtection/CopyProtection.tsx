import { useEffect, useState } from "react";
import "./CopyProtection.css";

const CopyProtection = () => {
  const [showModal, setShowModal] = useState(false);
  const [copiedText, setCopiedText] = useState("");

  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      const selected = window.getSelection()?.toString();
      if (selected && selected.trim().length > 0) {
        // Ми перехоплюємо подію копіювання, щоб показати модалку
        e.preventDefault();
        setCopiedText(selected.trim());
        setShowModal(true);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "c") {
        const selected = window.getSelection()?.toString();
        if (selected && selected.trim().length > 0) {
          e.preventDefault();
          setCopiedText(selected.trim());
          setShowModal(true);
        }
      }
    };

    document.addEventListener("copy", handleCopy);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleAllowCopy = () => {
    // ТУТ ЗМІНИ: Додаємо посилання до тексту
    const sourceLink = "https://rabbit-farming-from-a-to-z-react.vercel.app/";
    const finalContent = `${copiedText}\n\nДжерело: ${sourceLink}`;

    navigator.clipboard.writeText(finalContent).then(() => {
      setShowModal(false);
      setCopiedText("");
      // Можна додати сповіщення "Скопійовано!", якщо хочете
    });
  };

  const handleDismiss = () => {
    setShowModal(false);
    setCopiedText("");
    window.getSelection()?.removeAllRanges();
  };

  if (!showModal) return null;

  const preview =
    copiedText.length > 80 ? copiedText.slice(0, 80) + "…" : copiedText;

  return (
    <div className="cp-overlay" onClick={handleDismiss}>
      <div className="cp-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cp-emoji">🐰</div>
        <h2 className="cp-title">Ні-ні, не так просто!</h2>
        <p className="cp-subtitle">Цей контент захищено авторським правом</p>
        <div className="cp-preview">"{preview}"</div>
        <p className="cp-link-text">Повний матеріал на платформі:</p>
        <a
          href="https://rabbit-farming-from-a-to-z-react.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="cp-link"
        >
          🌐 rabbit-farming-from-a-to-z-react.vercel.app
        </a>
        <div className="cp-buttons">
          <button className="cp-btn-allow" onClick={handleAllowCopy}>
            ✅ Скопіювати з посиланням
          </button>
          <button className="cp-btn-dismiss" onClick={handleDismiss}>
            ✖ Відхилити
          </button>
        </div>
      </div>
    </div>
  );
};

export default CopyProtection;
