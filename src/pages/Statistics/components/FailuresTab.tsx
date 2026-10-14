import EmptyState from "./EmptyState";
import FailureCard from "./FailureCard";
import type { FemaleFailureStat } from "../types";

export default function FailuresTab({ stats }: { stats: FemaleFailureStat[] }) {
  if (stats.length === 0) {
    return (
      <EmptyState
        icon="—"
        title="Невдалих злучок ще немає"
        description="У розділі Парування відкрийте окріл кнопкою «Редагувати» і поставте відмітку «Не окотилась» або «Окотилась, розкидала». Дані з'являться тут автоматично."
      />
    );
  }

  const totalFailures = stats.reduce((s, f) => s + f.entries.length, 0);
  const totalEmpty = stats.reduce((s, f) => s + f.emptyCount, 0);
  const totalLost = stats.reduce((s, f) => s + f.lostCount, 0);

  return (
    <>
      <div className="slaughter-tab">
        <div className="slaughter-summary">
          <div className="slaughter-summary-item">
            <span className="slaughter-summary-val">{totalFailures}</span>
            <span className="slaughter-summary-label">Без окролу всього</span>
          </div>
          <div className="slaughter-summary-item">
            <span className="slaughter-summary-val">{totalEmpty}</span>
            <span className="slaughter-summary-label">Не окотилась</span>
          </div>
          <div className="slaughter-summary-item">
            <span className="slaughter-summary-val">{totalLost}</span>
            <span className="slaughter-summary-label">Розкидала, завмерли</span>
          </div>
        </div>
      </div>
      {stats.map((s) => (
        <FailureCard key={s.femaleId} stat={s} />
      ))}
    </>
  );
}
