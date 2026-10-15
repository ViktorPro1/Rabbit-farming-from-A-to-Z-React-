import CycleBody from "./CycleBody";
import type { GroupInfo, RecordViewProps } from "../types";

// Спільний архів: усі клітки із закритими циклами
export default function Archive({
  archiveInfos,
  archiveCyclesCount,
  view,
  open,
  onToggle,
}: {
  archiveInfos: GroupInfo[];
  archiveCyclesCount: number;
  view: RecordViewProps;
  // Стан розгортання живе в батьківському компоненті, щоб не скидатись
  // при перемиканні режиму (архів тоді тимчасово зникає зі сторінки)
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="registry-info weighing-archive">
      <button className="registry-info-toggle" onClick={() => onToggle()}>
        <span>📦 Архів (циклів: {archiveCyclesCount})</span>
        <span>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="weighing-archive-body">
          {archiveInfos.map(({ litter, closedCycles }) => (
            <div key={litter} className="weighing-archive-cage">
              <h3 className="weighing-archive-cage-title">🍖 {litter}</h3>
              {closedCycles
                .slice()
                .reverse()
                .map((cycle) => (
                  <div
                    key={`${litter}-${cycle.cycleIndex}`}
                    className="weighing-cycle-block weighing-cycle-closed"
                  >
                    <p className="weighing-cycle-summary">
                      Цикл {cycle.cycleIndex}:{" "}
                      {new Date(cycle.startDate).toLocaleDateString("uk-UA")} –{" "}
                      {new Date(cycle.endDate).toLocaleDateString("uk-UA")} (
                      {cycle.durationDays} дн.)
                      {cycle.finalAvgWeight !== null && (
                        <>
                          {" "}
                          · середня вага на забій:{" "}
                          <strong>{cycle.finalAvgWeight} г</strong>
                        </>
                      )}
                    </p>
                    {<CycleBody cycle={cycle} view={view} />}
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
