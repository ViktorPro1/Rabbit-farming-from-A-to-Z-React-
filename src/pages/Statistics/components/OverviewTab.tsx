import OverviewChart from "./OverviewChart";
import type { MonthlyStat } from "../types";

export default function OverviewTab({
  data,
  quarantineDeaths,
}: {
  data: MonthlyStat[];
  quarantineDeaths: number;
}) {
  if (data.length === 0) {
    return (
      <div className="stats-empty-state">
        <div className="stats-empty-illustration">📈</div>
        <h3 className="stats-empty-title">Даних для огляду ще немає</h3>
        <p className="stats-empty-desc">
          Тут з'явиться порівняння народжень, забоїв і продажів по місяцях, коли
          буде хоча б один окріл, забій або продаж.
        </p>
      </div>
    );
  }

  const totalBornAll = data.reduce((s, d) => s + d.totalAlive, 0);
  const totalSlaughteredAll = data.reduce((s, d) => s + d.totalSlaughtered, 0);
  const totalSoldAll = data.reduce((s, d) => s + d.totalSold, 0);
  const balance =
    totalBornAll - totalSlaughteredAll - totalSoldAll - quarantineDeaths;

  return (
    <div className="overview-tab">
      <div className="overview-legend">
        <span className="overview-legend-item">
          <span
            className="overview-legend-dot"
            style={{ background: "#4caf50" }}
          />
          Народилось живими
        </span>
        <span className="overview-legend-item">
          <span
            className="overview-legend-dot"
            style={{ background: "#b71c1c" }}
          />
          Забито
        </span>
        <span className="overview-legend-item">
          <span
            className="overview-legend-dot"
            style={{ background: "#c9a227" }}
          />
          Продано
        </span>
      </div>

      <div className="stats-chart-block">
        <h3 className="chart-title">
          Народжено / Забито / Продано (по місяцях)
        </h3>
        <OverviewChart data={data} />
      </div>

      <div className="overview-summary">
        <div className="overview-summary-item">
          <span className="overview-summary-val" style={{ color: "#4caf50" }}>
            {totalBornAll}
          </span>
          <span className="overview-summary-label">Народилось живими</span>
        </div>
        <div className="overview-summary-item">
          <span className="overview-summary-val" style={{ color: "#b71c1c" }}>
            {totalSlaughteredAll}
          </span>
          <span className="overview-summary-label">Забито всього</span>
        </div>
        <div className="overview-summary-item">
          <span className="overview-summary-val" style={{ color: "#c9a227" }}>
            {totalSoldAll}
          </span>
          <span className="overview-summary-label">Продано всього</span>
        </div>
        {quarantineDeaths > 0 && (
          <div className="overview-summary-item">
            <span className="overview-summary-val" style={{ color: "#b71c1c" }}>
              {quarantineDeaths}
            </span>
            <span className="overview-summary-label">Загинуло всього</span>
          </div>
        )}
        <div className="overview-summary-item">
          <span
            className="overview-summary-val"
            style={{ color: balance >= 0 ? "#4caf50" : "#b71c1c" }}
          >
            {balance >= 0 ? "+" : ""}
            {balance}
          </span>
          <span className="overview-summary-label">Баланс поголів'я</span>
        </div>
      </div>
    </div>
  );
}
