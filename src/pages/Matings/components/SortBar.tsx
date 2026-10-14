import type { SortType } from "../types";

interface Props {
  sortType: SortType;
  onChange: (sortType: SortType) => void;
}

export default function SortBar({ sortType, onChange }: Props) {
  return (
    <div className="matings-sort-bar">
      <span className="matings-sort-label">Сортування:</span>
      <button
        className={`matings-sort-btn${sortType === "date_desc" ? " active" : ""}`}
        onClick={() => onChange("date_desc")}
      >
        📅 Дата ↓
      </button>
      <button
        className={`matings-sort-btn${sortType === "date_asc" ? " active" : ""}`}
        onClick={() => onChange("date_asc")}
      >
        📅 Дата ↑
      </button>
      <button
        className={`matings-sort-btn${sortType === "male" ? " active" : ""}`}
        onClick={() => onChange("male")}
      >
        🏠 За кліткою
      </button>
    </div>
  );
}
