import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { useStatisticsData } from "./useStatisticsData";
import { useWeighingData } from "./useWeighingData";
import BreedingCards from "./components/BreedingCards";
import FailuresTab from "./components/FailuresTab";
import OverviewTab from "./components/OverviewTab";
import SalesTab from "./components/SalesTab";
import SlaughterTab from "./components/SlaughterTab";
import SummaryCards from "./components/SummaryCards";
import TabBar from "./components/TabBar";
import TabCharts from "./components/TabCharts";
import WeighingTab from "./components/WeighingTab";
import type { StatsTab } from "./types";
import "./Statistics.css";

interface Props {
  session: Session;
}

export default function Statistics({ session }: Props) {
  const [activeTab, setActiveTab] = useState<StatsTab>("females");
  const navigate = useNavigate();
  const location = useLocation();

  const {
    femaleStats,
    maleStats,
    pairStats,
    cageStats,
    accuracyStats,
    slaughteredCages,
    salesData,
    failureStats,
    monthlyStats,
    quarantineDeaths,
    herdCount,
    loading,
    pageError,
  } = useStatisticsData(session.user.id, location.key);

  const {
    weighingTabLoading,
    weighingTabError,
    activeCages,
    farmTotals,
    closedCycles,
    monthlyAvgAll,
    monthlyComparison,
  } = useWeighingData(session.user.id);

  const currentStats =
    activeTab === "females"
      ? femaleStats
      : activeTab === "males"
        ? maleStats
        : [];
  const maxAlive = Math.max(
    ...(activeTab === "pairs"
      ? pairStats
      : activeTab === "cages"
        ? cageStats
        : currentStats
    ).map((s) => s.totalAlive),
    1,
  );

  return (
    <div className="stats-page">
      <div className="stats-header">
        <h1>📊 Статистика</h1>
        <button
          className="stats-back-btn"
          onClick={() => navigate("/registry")}
        >
          ⬅ Мої кролики
        </button>
      </div>

      {pageError && <p className="stats-error">{pageError}</p>}

      {loading ? (
        <div className="stats-loading">Завантаження...</div>
      ) : pageError ? null : (
        <>
          <SummaryCards
            herdCount={herdCount}
            pairStats={pairStats}
            slaughteredCages={slaughteredCages}
          />

          <TabBar activeTab={activeTab} onChange={setActiveTab} />

          <TabCharts
            activeTab={activeTab}
            currentStats={currentStats}
            pairStats={pairStats}
            cageStats={cageStats}
          />

          <div className="stats-cards">
            <BreedingCards
              activeTab={activeTab}
              femaleStats={femaleStats}
              maleStats={maleStats}
              pairStats={pairStats}
              cageStats={cageStats}
              accuracyStats={accuracyStats}
              maxAlive={maxAlive}
            />

            {activeTab === "slaughter" && (
              <SlaughterTab cages={slaughteredCages} />
            )}

            {activeTab === "sales" && <SalesTab sales={salesData} />}

            {activeTab === "failures" && <FailuresTab stats={failureStats} />}

            {activeTab === "overview" && (
              <OverviewTab
                data={monthlyStats}
                quarantineDeaths={quarantineDeaths}
              />
            )}

            {activeTab === "weighing" &&
              (weighingTabLoading ? (
                <div className="stats-loading">Завантаження...</div>
              ) : weighingTabError ? (
                <p className="stats-error">{weighingTabError}</p>
              ) : (
                <WeighingTab
                  activeCages={activeCages}
                  farmTotals={farmTotals}
                  monthlyAvgAll={monthlyAvgAll}
                  monthlyComparison={monthlyComparison}
                  closedCycles={closedCycles}
                />
              ))}
          </div>
        </>
      )}
    </div>
  );
}
