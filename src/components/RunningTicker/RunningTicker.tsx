import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { groups } from "../../data/sectionCards";
import "./RunningTicker.css";

interface TickerEntry {
  icon: string;
  title: string;
  path: string;
}

// Розгортаємо всі cards з усіх груп у плаский масив.
// Групу "Статті" (зовнішні лендінги) можна включити назад, прибравши .filter нижче.
const tickerItems: TickerEntry[] = groups
  .filter((group) => group.groupTitle !== "Статті")
  .flatMap((group) =>
    group.cards.map((card) => ({
      icon: card.icon,
      title: card.title,
      path: card.path,
    })),
  );

const STORAGE_KEY = "runningTickerOffset";

interface RunningTickerProps {
  items?: TickerEntry[];
  pxPerSecond?: number; // швидкість прокрутки в пікселях за секунду
  onItemClick?: (path: string) => void;
}

export default function RunningTicker({
  items = tickerItems,
  pxPerSecond = 25,
  onItemClick,
}: RunningTickerProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);
  const offsetRef = useRef(0);
  const halfWidthRef = useRef(0);
  const rafRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);
  const navigate = useNavigate();

  const loopItems = [...items, ...items];

  useEffect(() => {
    if (!trackRef.current || items.length === 0) return;

    // Відновлюємо позицію з минулого разу
    const saved = Number(localStorage.getItem(STORAGE_KEY));
    offsetRef.current = Number.isFinite(saved) ? saved : 0;

    const measure = () => {
      if (trackRef.current) {
        // Ширина одного (недубльованого) набору елементів
        halfWidthRef.current = trackRef.current.scrollWidth / 2;
      }
    };
    measure();
    window.addEventListener("resize", measure);

    const tick = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      if (!isPausedRef.current && halfWidthRef.current > 0) {
        offsetRef.current =
          (offsetRef.current + pxPerSecond * delta) % halfWidthRef.current;
        if (trackRef.current) {
          trackRef.current.style.transform = `translateX(-${offsetRef.current}px)`;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const saveOffset = () => {
      localStorage.setItem(STORAGE_KEY, String(offsetRef.current));
    };
    // Періодично зберігаємо позицію, щоб не втратити прогрес при різкому закритті вкладки
    const saveInterval = window.setInterval(saveOffset, 1000);
    window.addEventListener("beforeunload", saveOffset);
    document.addEventListener("visibilitychange", saveOffset);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.clearInterval(saveInterval);
      window.removeEventListener("resize", measure);
      window.removeEventListener("beforeunload", saveOffset);
      document.removeEventListener("visibilitychange", saveOffset);
      saveOffset();
    };
  }, [pxPerSecond, items.length]);

  if (items.length === 0) return null;

  const handleClick = (path: string) => {
    if (onItemClick) {
      onItemClick(path);
      return;
    }
    if (path.startsWith("http")) {
      window.open(path, "_blank", "noopener,noreferrer");
    } else {
      navigate(path);
    }
  };

  return (
    <div
      className="ticker-wrapper"
      onMouseEnter={() => {
        isPausedRef.current = true;
      }}
      onMouseLeave={() => {
        isPausedRef.current = false;
      }}
    >
      <div ref={trackRef} className="ticker-track">
        {loopItems.map((item, idx) => (
          <span
            className="ticker-item ticker-item-clickable"
            key={`${item.path}-${idx}`}
            onClick={() => handleClick(item.path)}
          >
            <span className="ticker-icon">{item.icon}</span>
            {item.title}
            <span className="ticker-dot">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
