import { groupWeighingsByMonth } from "../cycles";
import FatteningRecordCard from "./FatteningRecordCard";
import type { RecordViewProps, WeighingCycle } from "../types";

export default function CycleBody({
  cycle,
  view,
}: {
  cycle: WeighingCycle;
  view: RecordViewProps;
}) {
  return (
    <div className="weighing-monthly">
      {groupWeighingsByMonth(cycle.records).map((m, idx, arr) => (
        <div key={m.monthKey} className="weighing-month-block">
          {m.count > 1 && (
            <p className="weighing-info weighing-month-summary">
              {m.monthLabel}: середня <strong>{m.avgWeight} г</strong> (
              {m.count} зважувань)
              {idx > 0 && (
                <span className="weighing-gain">
                  {" "}
                  ({m.avgWeight - arr[idx - 1].avgWeight >= 0 ? "+" : ""}
                  {m.avgWeight - arr[idx - 1].avgWeight} г до попереднього
                  місяця)
                </span>
              )}
            </p>
          )}
          <div className="weighing-list weighing-month-records">
            {m.records.map((r) => (
              <FatteningRecordCard key={r.id} r={r} view={view} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
