import { useEffect, useRef, useState } from "react";
// ЗМІНА: імпорт клієнта Supabase для перевірки сесії.
// ВАЖЛИВО: якщо у вашому проєкті клієнт лежить в іншому місці — виправте шлях.
import { supabase } from "../../lib/supabase";
import "./CopyProtection.css";

const CopyProtection = () => {
  const [showModal, setShowModal] = useState(false);
  const [copiedText, setCopiedText] = useState("");

  // ЗМІНА: ref з ознакою "користувач увійшов у кабінет".
  // Ref, а не state, щоб обробники подій завжди бачили актуальне значення
  // і слухачі не перереєстровувалися при кожній зміні сесії.
  // Початкове значення true: поки сесія перевіряється, модалка не спливає
  // у зареєстрованих користувачів. Якщо перевірка завершилась без сесії —
  // ставимо false, і захист вмикається.
  const isLoggedInRef = useRef(true);

  // ЗМІНА: відстеження сесії (початкова перевірка + вхід/вихід у реальному часі).
  useEffect(() => {
    let active = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        isLoggedInRef.current = !!data.session;
      })
      .catch(() => {
        // Якщо не вдалося перевірити сесію — вважаємо користувача гостем.
        if (active) isLoggedInRef.current = false;
      });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        isLoggedInRef.current = !!session;
        // Якщо користувач увійшов, поки модалка відкрита — закриваємо її.
        if (session) {
          setShowModal(false);
          setCopiedText("");
        }
      },
    );

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      // ЗМІНА: для зареєстрованих копіювання працює як звичайно, без модалки.
      if (isLoggedInRef.current) return;

      const selected = window.getSelection()?.toString();
      if (selected && selected.trim().length > 0) {
        // Ми перехоплюємо подію копіювання, щоб показати модалку
        e.preventDefault();
        setCopiedText(selected.trim());
        setShowModal(true);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // ЗМІНА: те саме для Ctrl+C.
      if (isLoggedInRef.current) return;

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
    const sourceLink = window.location.href;
    const finalContent = `${copiedText}\n\nДжерело: ${sourceLink}`;

    navigator.clipboard
      .writeText(finalContent)
      .then(() => {
        setShowModal(false);
        setCopiedText("");
        // Можна додати сповіщення "Скопійовано!", якщо хочете
      })
      .catch((err) => {
        console.error("Не вдалося скопіювати текст:", err);
        setShowModal(false);
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
    <div
      className="cp-overlay"
      role="button"
      tabIndex={0}
      aria-label="Закрити вікно"
      onClick={handleDismiss}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
          e.preventDefault();
          handleDismiss();
        }
      }}
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
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
