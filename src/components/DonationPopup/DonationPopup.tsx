import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import "./DonationPopup.css";

const STORAGE_KEY = "donationPopupLastShown";

function shouldShowPopup(): boolean {
  const last = localStorage.getItem(STORAGE_KEY);
  if (!last) return true;

  const lastDate = new Date(last);
  const now = new Date();

  return (
    lastDate.getFullYear() !== now.getFullYear() ||
    lastDate.getMonth() !== now.getMonth()
  );
}

export default function DonationPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let mounted = true;
    let timer: ReturnType<typeof setTimeout>;

    async function checkAndMaybeShow() {
      const { data } = await supabase.auth.getSession();
      const isSubscriber = !!data.session?.user;

      if (!mounted) return;

      if (!isSubscriber && shouldShowPopup()) {
        timer = setTimeout(() => {
          if (mounted) setVisible(true);
        }, 30000);
      }
    }

    checkAndMaybeShow();

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, []);

  function markShown() {
    localStorage.setItem(STORAGE_KEY, new Date().toISOString());
  }

  function handleClose() {
    markShown();
    setVisible(false);
  }

  function handleDonate() {
    markShown();
    setVisible(false);
    window.open(
      "https://www.privat24.ua/send/4l83z",
      "_blank",
      "noopener,noreferrer",
    );
  }

  if (!visible) return null;

  return (
    <div className="donation-overlay" role="dialog" aria-modal="true">
      <div className="donation-modal">
        <button
          className="donation-close-x"
          onClick={handleClose}
          aria-label="Закрити"
        >
          ✕
        </button>
        <div className="donation-icon">🐇💚</div>
        <h2>Подобається довідник?</h2>
        <p>
          Ми ведемо цей проєкт для всіх, хто розводить кроликів в Україні —
          безкоштовно і без реклами. Якщо матеріали були корисними, можеш
          підтримати розвиток довідника.
        </p>
        <div className="donation-actions">
          <button className="donation-btn-secondary" onClick={handleClose}>
            Ні, дякую
          </button>
          <button className="donation-btn-primary" onClick={handleDonate}>
            Пожертвувати
          </button>
        </div>
      </div>
    </div>
  );
}
