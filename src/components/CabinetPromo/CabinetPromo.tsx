// Додано: віконце "ця функція вже є в обліку" на сторінках тем.
// Нічого не видалено і не замінено, це новий компонент.
// Дані беруться з src/data/cabinetPromos.ts за шляхом поточної сторінки.
// Правила показу:
//   - не показується залогіненим користувачам (кабінет у них уже є);
//   - з'являється через 60 с після входу на сторінку теми;
//   - не частіше одного разу за візит (sessionStorage);
//   - закривається хрестиком, клавішею Escape або переходом по кнопці.
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { getCabinetPromo, PROMO_BADGE } from "../../data/cabinetPromos";
import "./CabinetPromo.css";

// Затримка перед появою віконця (мс)
const SHOW_DELAY_MS = 60000;
// Ключ у sessionStorage: віконце вже показувалось у цьому візиті
const SESSION_KEY = "cabinetPromoShown";

interface CabinetPromoProps {
  session: Session | null;
}

// sessionStorage може кидати помилку (приватний режим, заборона), тому try/catch
function wasShown(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function markShown(): void {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // нічого не робимо: у гіршому разі віконце покажеться ще раз
  }
}

export default function CabinetPromo({ session }: CabinetPromoProps) {
  const { pathname } = useLocation();
  // Шлях сторінки, на якій віконце зараз відкрите. При зміні сторінки
  // воно закривається саме, бо shownPath !== pathname.
  const [shownPath, setShownPath] = useState<string | null>(null);

  const promo = getCabinetPromo(pathname);
  const isLoggedIn = !!session;

  useEffect(() => {
    if (!promo || isLoggedIn || wasShown()) return;

    const timer = setTimeout(() => {
      if (wasShown()) return;
      markShown();
      setShownPath(pathname);
    }, SHOW_DELAY_MS);

    return () => clearTimeout(timer);
  }, [pathname, promo, isLoggedIn]);

  const visible = !!promo && !isLoggedIn && shownPath === pathname;

  // Закриття клавішею Escape, поки віконце відкрите
  useEffect(() => {
    if (!visible) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setShownPath(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [visible]);

  if (!visible || !promo) return null;

  function close() {
    setShownPath(null);
  }

  return (
    <aside className="cpromo" aria-label="Підказка про облік господарства">
      <button
        type="button"
        className="cpromo__close"
        onClick={close}
        aria-label="Закрити"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6 6l12 12M18 6L6 18"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <div className="cpromo__icon" aria-hidden="true">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 20.5s-7.5-4.6-7.5-10A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 7.5 2.9c0 5.4-7.5 10-7.5 10z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M8.6 12.4l2.2 2.2 4.6-4.6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="cpromo__body">
        <p className="cpromo__title">{promo.title}</p>
        <p className="cpromo__text">{promo.text}</p>
        <div className="cpromo__footer">
          <span className="cpromo__badge">{PROMO_BADGE}</span>
          <Link to="/subscription" className="cpromo__link" onClick={close}>
            Докладніше
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </aside>
  );
}
