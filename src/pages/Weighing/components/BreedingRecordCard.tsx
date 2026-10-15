import { describeRecordStatus } from "../gauges";
import { dailyGain } from "../utils";
import RecordStatusBadge from "./RecordStatusBadge";
import type { RecordViewProps, WeighingRecord } from "../types";

// Картка зважування племінного кролика: приріст за добу рахується відносно
// попереднього запису того ж кролика (prev).
export default function BreedingRecordCard({
  r,
  prev,
  view,
}: {
  r: WeighingRecord;
  prev: WeighingRecord | undefined;
  view: RecordViewProps;
}) {
  if (view.editingId === r.id) {
    return <div>{view.editForm}</div>;
  }
  return (
    <div className="weighing-card">
      <div className="weighing-card-top">
        <span className="weighing-name">
          {new Date(r.weighing_date).toLocaleDateString("uk-UA")}
          {r.rabbit_name ? ` · ${r.rabbit_name}` : ""}
        </span>
        <div className="weighing-card-btns">
          <button
            className="weighing-edit-btn"
            onClick={() => view.onStartEdit(r)}
          >
            ✏️
          </button>
          <button
            className="weighing-delete-btn"
            onClick={() => view.onDelete(r.id)}
          >
            ✕
          </button>
        </div>
      </div>
      <p className="weighing-info">
        Вага: <strong>{r.weight_g} г</strong>
        <RecordStatusBadge
          status={describeRecordStatus(r, view.rabbitById, view.fatteningById)}
        />
        {prev && <span className="weighing-gain"> ({dailyGain(prev, r)})</span>}
      </p>
      {r.notes && <p className="weighing-notes">{r.notes}</p>}
    </div>
  );
}
