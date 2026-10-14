import MiniBar from "./MiniBar";
import { medalFor } from "../utils";
import type { CageStat } from "../types";

export default function CageCard({
  stat,
  rank,
  maxAlive,
}: {
  stat: CageStat;
  rank: number;
  maxAlive: number;
}) {
  const medal = medalFor(rank);
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-rank">{medal}</span>
        <div className="stat-card-title">
          <span className="stat-name">🏠 Клітка {stat.cage}</span>
          {stat.rabbits.length > 0 && (
            <span className="stat-breed">{stat.rabbits.join(", ")}</span>
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
          <span className="stat-metric-val" style={{ color: "#f0a500" }}>
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
        <MiniBar value={stat.totalAlive} max={maxAlive} color="#f0a500" />
      </div>
    </div>
  );
}
