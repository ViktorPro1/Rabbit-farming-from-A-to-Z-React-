import BarChart from "./BarChart";
import type { CageStat, PairStat, RabbitStat, StatsTab } from "../types";

// Блок графіків над списком карток (для вкладок із графіками)
export default function TabCharts({
  activeTab,
  currentStats,
  pairStats,
  cageStats,
}: {
  activeTab: StatsTab;
  currentStats: RabbitStat[];
  pairStats: PairStat[];
  cageStats: CageStat[];
}) {
  return (
    <>
      {activeTab !== "pairs" &&
        activeTab !== "cages" &&
        activeTab !== "accuracy" &&
        activeTab !== "slaughter" &&
        activeTab !== "sales" &&
        activeTab !== "overview" &&
        currentStats.length > 0 && (
          <div className="stats-chart-block">
            <h3 className="chart-title">
              Живих кроленят —{" "}
              {activeTab === "females" ? "крольчихи" : "кролів"}
            </h3>
            <BarChart
              data={currentStats.map((s) => ({
                label: s.name,
                value: s.totalAlive,
              }))}
              color={activeTab === "females" ? "#e07b9a" : "#5b9bd5"}
            />
            <h3 className="chart-title" style={{ marginTop: 16 }}>
              Середній окріл (живих)
            </h3>
            <BarChart
              data={currentStats.map((s) => ({
                label: s.name,
                value: s.avgAlive,
              }))}
              color={activeTab === "females" ? "#c9568a" : "#3a7abf"}
            />
          </div>
        )}

      {activeTab === "pairs" && pairStats.length > 0 && (
        <div className="stats-chart-block">
          <h3 className="chart-title">Живих кроленят — по парах</h3>
          <BarChart
            data={pairStats.map((s) => ({
              label: `${s.maleName}×${s.femaleName}`,
              value: s.totalAlive,
            }))}
            color="#7bc67e"
          />
        </div>
      )}

      {activeTab === "cages" && cageStats.length > 0 && (
        <div className="stats-chart-block">
          <h3 className="chart-title">Живих кроленят — по клітках</h3>
          <BarChart
            data={cageStats.map((s) => ({
              label: `Кл.${s.cage}`,
              value: s.totalAlive,
            }))}
            color="#f0a500"
          />
        </div>
      )}
    </>
  );
}
