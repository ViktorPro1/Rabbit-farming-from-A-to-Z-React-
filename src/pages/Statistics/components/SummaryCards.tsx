import { headCount } from "../utils";
import type { PairStat, SlaughteredCage } from "../types";

export default function SummaryCards({
  herdCount,
  pairStats,
  slaughteredCages,
}: {
  herdCount: number;
  pairStats: PairStat[];
  slaughteredCages: SlaughteredCage[];
}) {
  return (
    <div className="stats-summary">
      <div className="summary-card">
        <span className="summary-icon">🐇</span>
        <span className="summary-num">{herdCount}</span>
        <span className="summary-label">Плем. стадо</span>
      </div>
      <div className="summary-card">
        <span className="summary-icon">❤️</span>
        <span className="summary-num">
          {pairStats.reduce((s, p) => s + p.matingsCount, 0)}
        </span>
        <span className="summary-label">Злучок</span>
      </div>
      <div className="summary-card">
        <span className="summary-icon">📦</span>
        <span className="summary-num">
          {pairStats.reduce((s, p) => s + p.littersCount, 0)}
        </span>
        <span className="summary-label">Окролів</span>
      </div>
      <div className="summary-card highlight-green">
        <span className="summary-icon">🌱</span>
        <span className="summary-num">
          {pairStats.reduce((s, p) => s + p.totalAlive, 0)}
        </span>
        <span className="summary-label">Народилось живими</span>
      </div>
      <div className="summary-card highlight-red">
        <span className="summary-icon">🔪</span>
        <span className="summary-num">
          {slaughteredCages.reduce((s, c) => s + headCount(c), 0)}
        </span>
        <span className="summary-label">Забито</span>
      </div>
    </div>
  );
}
