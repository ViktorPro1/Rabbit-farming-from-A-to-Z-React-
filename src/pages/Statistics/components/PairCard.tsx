import MiniBar from "./MiniBar";
import { medalFor } from "../utils";
import type { PairStat } from "../types";

export default function PairCard({
  stat,
  rank,
  maxAlive,
}: {
  stat: PairStat;
  rank: number;
  maxAlive: number;
}) {
  const medal = medalFor(rank);
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-rank">{medal}</span>
        <div className="stat-card-title">
          <span className="stat-name">
            ♂ {stat.maleName} × ♀ {stat.femaleName}
          </span>
          {(stat.maleBreed || stat.femaleBreed) && (
            <span className="stat-breed">
              {[stat.maleBreed, stat.femaleBreed].filter(Boolean).join(" / ")}
            </span>
          )}
        </div>
      </div>
      <div className="stat-metrics">
        <div className="stat-metric">
          <span className="stat-metric-label">Злучок</span>
          <span className="stat-metric-val">{stat.matingsCount}</span>
        </div>
        <div className="stat-metric">
          <span className="stat-metric-label">Окролів</span>
          <span className="stat-metric-val">{stat.littersCount}</span>
        </div>
        <div className="stat-metric">
          <span className="stat-metric-label">Народилось</span>
          <span className="stat-metric-val">{stat.totalBorn}</span>
        </div>
        <div className="stat-metric highlight">
          <span className="stat-metric-label">Вижило</span>
          <span className="stat-metric-val" style={{ color: "#7bc67e" }}>
            {stat.totalAlive}
          </span>
        </div>
        <div className="stat-metric">
          <span className="stat-metric-label">Сер. за окріл</span>
          <span className="stat-metric-val">{stat.avgAlive}</span>
        </div>
      </div>
      <div className="stat-bar-section">
        <span className="stat-bar-label">Живих всього</span>
        <MiniBar value={stat.totalAlive} max={maxAlive} color="#7bc67e" />
      </div>
    </div>
  );
}
