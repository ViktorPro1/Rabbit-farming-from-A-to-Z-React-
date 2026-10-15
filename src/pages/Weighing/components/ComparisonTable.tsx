import type { WeighingCycle } from "../types";

// Порівняння циклів відгодівлі за рік
export default function ComparisonTable({
  allClosedCycles,
  open,
  onToggle,
}: {
  allClosedCycles: Array<{ litter: string; cycle: WeighingCycle }>;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="registry-info">
      <button className="registry-info-toggle" onClick={() => onToggle()}>
        <span>📊 Порівняння циклів відгодівлі</span>
        <span>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="weighing-comparison-table-wrap">
          <table className="weighing-comparison-table">
            <thead>
              <tr>
                <th>Клітка</th>
                <th>Період</th>
                <th>Тривалість</th>
                <th>Середня вага на забій</th>
              </tr>
            </thead>
            <tbody>
              {allClosedCycles.map(({ litter, cycle }) => (
                <tr key={`${litter}-${cycle.cycleIndex}`}>
                  <td>{litter}</td>
                  <td>
                    {new Date(cycle.startDate).toLocaleDateString("uk-UA")} –{" "}
                    {new Date(cycle.endDate).toLocaleDateString("uk-UA")}
                  </td>
                  <td>{cycle.durationDays} дн.</td>
                  <td>
                    {cycle.finalAvgWeight !== null
                      ? `${cycle.finalAvgWeight} г`
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
