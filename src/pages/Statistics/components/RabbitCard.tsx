import MiniBar from "./MiniBar";
import { medalFor } from "../utils";
import type { RabbitStat } from "../types";

export default function RabbitCard({
  stat,
  rank,
  maxAlive,
}: {
  stat: RabbitStat;
  rank: number;
  maxAlive: number;
}) {
  const isFemale = stat.gender === "female";
  const color = isFemale ? "#e07b9a" : "#5b9bd5";
  const medal = medalFor(rank);
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-rank">{medal}</span>
        <div className="stat-card-title">
          <span className="stat-name">
            {isFemale ? "♀" : "♂"} {stat.name}
          </span>
          {stat.breed && <span className="stat-breed">{stat.breed}</span>}
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
          <span className="stat-metric-val" style={{ color }}>
            {stat.totalAlive}
          </span>
        </div>
        <div className="stat-metric">
          <span className="stat-metric-label">Сер. за окріл</span>
          <span className="stat-metric-val">{stat.avgAlive}</span>
        </div>
        <div className="stat-metric">
          <span className="stat-metric-label">Виживаність</span>
          <span className="stat-metric-val">{stat.survivalRate}%</span>
        </div>
      </div>
      <div className="stat-bar-section">
        <span className="stat-bar-label">Живих всього</span>
        <MiniBar value={stat.totalAlive} max={maxAlive} color={color} />
      </div>
      {stat.pairs.length > 0 && (
        <div className="stat-pairs">
          <span className="stat-pairs-title">Партнери:</span>
          {stat.pairs.map((p) => (
            <div key={p.partnerId} className="stat-pair-row">
              <span className="stat-pair-name">
                {isFemale ? "♂" : "♀"} {p.partnerName}
              </span>
              <span className="stat-pair-info">
                {p.littersCount} окр. · {p.totalAlive} живих
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
