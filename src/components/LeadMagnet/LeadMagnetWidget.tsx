import { useEffect, useState } from "react";
import EmailGateModal from "./EmailGateModal";
import RabbitStamp from "./RabbitStamp";
import "./LeadMagnetWidget.css";

const LEAD_MAGNET_SOURCE = "pamyatka-30-days";
const FILE_URL = "/files/pamyatka-30-days.pdf";
const TITLE = "Чек-лист новачка: перші 30 днів з кроликом";
const DESCRIPTION =
  "Що підготувати заздалегідь, як пройде адаптація і на які симптоми реагувати терміново. Один PDF, який можна роздрукувати.";

// Ключ у localStorage, де зберігається вибір "Більше не показувати".
const DISMISSED_STORAGE_KEY = "lead-magnet-dismissed:" + LEAD_MAGNET_SOURCE;

// Наскільки близько до низу сторінки (в пікселях) має підійти прокрутка,
// щоб плашка виїхала. Підбирай під висоту свого футера.
const REVEAL_DISTANCE_FROM_BOTTOM = 500;

// localStorage може бути недоступний (приватний режим, заблоковані
// дані сайту), тому всі звернення обгорнуті в try/catch.
function readDismissed(): boolean {
  try {
    return localStorage.getItem(DISMISSED_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function writeDismissed() {
  try {
    localStorage.setItem(DISMISSED_STORAGE_KEY, "1");
  } catch {
    // нічого не робимо: у цьому разі плашка просто показуватиметься знову
  }
}

export default function LeadMagnetWidget() {
  const [isDismissed, setIsDismissed] = useState(readDismissed);
  const [isTabVisible, setIsTabVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    const handleScroll = () => {
      const distanceFromBottom =
        document.documentElement.scrollHeight -
        (window.scrollY + window.innerHeight);
      setIsTabVisible(distanceFromBottom < REVEAL_DISTANCE_FROM_BOTTOM);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDismissed]);

  const handleDismissForever = () => {
    writeDismissed();
    setIsDismissed(true);
  };

  if (isDismissed) return null;

  return (
    <>
      <button
        type="button"
        className={
          "lead-magnet-tab" + (isTabVisible ? " lead-magnet-tab--visible" : "")
        }
        onClick={() => setIsModalOpen(true)}
        aria-label={"Завантажити: " + TITLE}
      >
        <span className="lead-magnet-tab__badge">
          <RabbitStamp />
        </span>
        <span className="lead-magnet-tab__text">{TITLE}</span>
      </button>

      {isModalOpen && (
        <EmailGateModal
          source={LEAD_MAGNET_SOURCE}
          fileUrl={FILE_URL}
          title={TITLE}
          description={DESCRIPTION}
          onClose={() => setIsModalOpen(false)}
          onDismissForever={handleDismissForever}
        />
      )}
    </>
  );
}
