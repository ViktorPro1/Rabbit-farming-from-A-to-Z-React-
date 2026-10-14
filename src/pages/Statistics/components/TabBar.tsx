import { STATS_TABS } from "../constants";
import type { StatsTab } from "../types";

export default function TabBar({
  activeTab,
  onChange,
}: {
  activeTab: StatsTab;
  onChange: (tab: StatsTab) => void;
}) {
  return (
    <div className="stats-tabs">
      {STATS_TABS.map((t) => (
        <button
          key={t.id}
          className={`stats-tab ${activeTab === t.id ? "active" : ""}`}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
