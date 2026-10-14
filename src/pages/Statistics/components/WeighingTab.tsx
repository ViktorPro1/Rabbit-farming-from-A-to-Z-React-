import BarChart from "./BarChart";
import EmptyState from "./EmptyState";
import {
  formatWeighingKg,
  monthLabelShort,
  groupByMonth,
  monthsDesc,
} from "../utils";
import type {
  ActiveCageStat,
  ClosedCycle,
  FarmTotals,
  MonthlyComparison,
  MonthlyWeightAvg,
} from "../types";

export default function WeighingTab({
  activeCages,
  farmTotals,
  monthlyAvgAll,
  monthlyComparison,
  closedCycles,
}: {
  activeCages: ActiveCageStat[];
  farmTotals: FarmTotals;
  monthlyAvgAll: MonthlyWeightAvg[];
  monthlyComparison: MonthlyComparison[];
  closedCycles: ClosedCycle[];
}) {
  const byMonth = groupByMonth(closedCycles, (c) => c.monthKey);
  const months = monthsDesc(byMonth);

  return (
    <div className="slaughter-tab">
      <div className="slaughter-summary">
        <div className="slaughter-summary-item">
          <span className="slaughter-summary-val">{farmTotals.cageCount}</span>
          <span className="slaughter-summary-label">Активних кліток</span>
        </div>
        <div className="slaughter-summary-item">
          <span className="slaughter-summary-val">{farmTotals.heads}</span>
          <span className="slaughter-summary-label">Голів разом</span>
        </div>
        <div className="slaughter-summary-item">
          <span className="slaughter-summary-val">
            {farmTotals.estimatedWeightG > 0
              ? formatWeighingKg(farmTotals.estimatedWeightG)
              : "—"}
          </span>
          <span className="slaughter-summary-label">Орієнтовна вага зараз</span>
        </div>
      </div>

      {activeCages.length === 0 ? (
        <EmptyState
          icon="⚖️"
          title="Активних кліток відгодівлі немає"
          description="Дані з'являться тут, щойно буде заселено клітку відгодівлі й додано перше зважування."
        />
      ) : (
        <div className="slaughter-list">
          {activeCages.map((c) => (
            <div key={c.cage} className="slaughter-row">
              <div className="slaughter-row-left">
                <span className="slaughter-cage">Клітка {c.cage}</span>
                <span className="slaughter-breed">{c.heads} гол.</span>
              </div>
              <div className="slaughter-row-right">
                {c.latestWeight !== null ? (
                  <>
                    <span className="slaughter-date">
                      1 кролик: {c.latestWeight} г
                      {c.latestDate
                        ? ` · ${new Date(c.latestDate).toLocaleDateString(
                            "uk-UA",
                          )}`
                        : ""}
                    </span>
                    <span className="slaughter-count">
                      Разом по клітці:{" "}
                      {formatWeighingKg(c.latestWeight * c.heads)}
                    </span>
                  </>
                ) : (
                  <span className="slaughter-date">немає зважувань</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {monthlyAvgAll.length > 0 && (
        <div className="stats-chart-block">
          <h3 className="chart-title">
            Динаміка ваги за рік (усі зважування, по місяцях)
          </h3>
          <BarChart
            data={monthlyAvgAll.map((m) => ({
              label: `${monthLabelShort(m.monthKey)} (${m.count})`,
              value: m.avgWeight,
            }))}
            color="#5b9bd5"
          />
          <p className="stats-empty-desc" style={{ marginTop: 4 }}>
            Середня вага показового кролика за місяць. У дужках — скільки
            зважувань враховано. Показує тренд навіть поки партії ще тривають.
          </p>
        </div>
      )}

      {monthlyComparison.length > 0 && (
        <div className="stats-chart-block">
          <h3 className="chart-title">
            Середня вага на забій, г (по місяцях завершення партії)
          </h3>
          <BarChart
            data={monthlyComparison.map((m) => ({
              label: monthLabelShort(m.monthKey),
              value: m.avgWeight,
            }))}
            color="#c9a227"
          />
          <h3 className="chart-title" style={{ marginTop: 16 }}>
            Середня тривалість циклу, дн. (по місяцях)
          </h3>
          <BarChart
            data={monthlyComparison.map((m) => ({
              label: monthLabelShort(m.monthKey),
              value: m.avgDuration,
            }))}
            color="#5b9bd5"
          />
        </div>
      )}

      {months.length > 0 && (
        <>
          <h3 className="chart-title" style={{ marginTop: 8 }}>
            Усі завершені цикли ({closedCycles.length})
          </h3>
          {months.map((month) => {
            const group = byMonth[month];
            return (
              <div key={month} className="slaughter-month">
                <div className="slaughter-month-header">
                  <span className="slaughter-month-title">
                    {monthLabelShort(month)}
                  </span>
                  <span className="slaughter-month-total">
                    {group.length} цикл(ів)
                  </span>
                </div>
                <div className="slaughter-list">
                  {group.map((c, i) => (
                    <div
                      key={`${c.cage}-${c.endDate}-${i}`}
                      className="slaughter-row"
                    >
                      <div className="slaughter-row-left">
                        <span className="slaughter-cage">Клітка {c.cage}</span>
                      </div>
                      <div className="slaughter-row-right">
                        <span className="slaughter-count">
                          {c.finalAvgWeight} г
                        </span>
                        <span className="slaughter-date">
                          {new Date(c.startDate).toLocaleDateString("uk-UA")} –{" "}
                          {new Date(c.endDate).toLocaleDateString("uk-UA")} ·{" "}
                          {c.durationDays} дн.
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
