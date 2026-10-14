import { medalFor } from "../utils";
import type { FemaleAccuracyStat } from "../types";

export default function AccuracyCard({
  stat,
  rank,
}: {
  stat: FemaleAccuracyStat;
  rank: number;
}) {
  const medal = medalFor(rank);

  function diffLabel(diff: number) {
    if (diff === 0) return { text: "✅ Вчасно", className: "diff-ontime" };
    if (diff > 0)
      return { text: `🔴 Перетягнула на ${diff} дн.`, className: "diff-late" };
    return {
      text: `🟡 Народила на ${Math.abs(diff)} дн. раніше`,
      className: "diff-early",
    };
  }

  const avgLabel = diffLabel(Math.round(stat.avgDiff));

  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-rank">{medal}</span>
        <div className="stat-card-title">
          <span className="stat-name">
            ♀ {stat.femaleName}
            {stat.femaleCage ? ` (кл.${stat.femaleCage})` : ""}
          </span>
          {stat.femaleBreed && (
            <span className="stat-breed">{stat.femaleBreed}</span>
          )}
        </div>
      </div>
      <div className="stat-metrics">
        <div className="stat-metric">
          <span className="stat-metric-label">Окролів з даними</span>
          <span className="stat-metric-val">{stat.entries.length}</span>
        </div>
        <div className="stat-metric">
          <span className="stat-metric-label">Вчасно</span>
          <span className="stat-metric-val">{stat.onTimeCount}</span>
        </div>
        <div className="stat-metric">
          <span className="stat-metric-label">Перетягнула</span>
          <span className="stat-metric-val">{stat.lateCount}</span>
        </div>
        <div className="stat-metric">
          <span className="stat-metric-label">Раніше</span>
          <span className="stat-metric-val">{stat.earlyCount}</span>
        </div>
      </div>
      <div className={`accuracy-avg ${avgLabel.className}`}>
        Середнє відхилення: <strong>{avgLabel.text}</strong>
      </div>
      <div className="accuracy-entries">
        {stat.entries.map((e) => {
          const label = diffLabel(e.diffDays);
          return (
            <div key={e.litterId} className="accuracy-entry-row">
              <span className="accuracy-entry-dates">
                🗓 {new Date(e.expectedDate).toLocaleDateString("uk-UA")} {"→"}{" "}
                📦 {new Date(e.actualDate).toLocaleDateString("uk-UA")}
              </span>
              <span className={`accuracy-entry-diff ${label.className}`}>
                {label.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
