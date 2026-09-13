import { useFontSize } from "./fontSizeContext";
import type { FontScale } from "./fontSizeContext";
import "./FontSizeToggle.css";

const LEVELS: FontScale[] = ["1", "2", "3"];

const ARIA_LABELS: Record<FontScale, string> = {
  "1": "Розмір шрифту: звичайний. Натисніть, щоб збільшити",
  "2": "Розмір шрифту: збільшений. Натисніть, щоб збільшити ще",
  "3": "Розмір шрифту: максимальний. Натисніть, щоб повернути звичайний",
};

export default function FontSizeToggle() {
  const { scale, setScale } = useFontSize();

  function handleClick() {
    const currentIndex = LEVELS.indexOf(scale);
    const nextScale = LEVELS[(currentIndex + 1) % LEVELS.length];
    setScale(nextScale);
  }

  return (
    <button
      type="button"
      className={`font-size-icon-trigger font-size-icon-trigger--${scale}`}
      onClick={handleClick}
      aria-label={ARIA_LABELS[scale]}
      title="Розмір шрифту"
    >
      Aa
    </button>
  );
}
