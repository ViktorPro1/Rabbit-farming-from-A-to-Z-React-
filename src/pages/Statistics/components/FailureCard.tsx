import { FAILURE_LABELS } from "../constants";
import type { FemaleFailureStat } from "../types";

export default function FailureCard({ stat }: { stat: FemaleFailureStat }) {
  const failures = stat.entries.length;
  const attempts = stat.littersCount + failures;
  const successRate =
    attempts > 0 ? Math.round((stat.littersCount / attempts) * 100) : 0;

  return (
    <div className="stat-card">
      <div className="stat-card-header">
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
          <span className="stat-metric-label">Без окролу</span>
          <span className="stat-metric-val" style={{ color: "#b71c1c" }}>
            {failures}
          </span>
        </div>
        <div className="stat-metric">
          <span className="stat-metric-label">Не окотилась</span>
          <span className="stat-metric-val">{stat.emptyCount}</span>
        </div>
        <div className="stat-metric">
          <span className="stat-metric-label">Розкидала, завмерли</span>
          <span className="stat-metric-val">{stat.lostCount}</span>
        </div>
        <div className="stat-metric">
          <span className="stat-metric-label">Успішних окролів</span>
          <span className="stat-metric-val">{stat.littersCount}</span>
        </div>
        <div className="stat-metric">
          <span className="stat-metric-label">Успішність злучок</span>
          <span className="stat-metric-val">{successRate}%</span>
        </div>
      </div>
      <div className="accuracy-entries">
        {stat.entries.map((e) => (
          <div key={e.litterId} className="accuracy-entry-row">
            <span className="accuracy-entry-dates">
              Злучка:{" "}
              {e.matingDate
                ? new Date(e.matingDate).toLocaleDateString("uk-UA")
                : "—"}
              {e.maleName ? ` · ♂ ${e.maleName}` : ""}
            </span>
            <span className="accuracy-entry-diff diff-late">
              {FAILURE_LABELS[e.type]}
              {e.failureDate
                ? ` · ${new Date(e.failureDate).toLocaleDateString("uk-UA")}`
                : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
