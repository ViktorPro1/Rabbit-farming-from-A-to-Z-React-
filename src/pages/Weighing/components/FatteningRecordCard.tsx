import { describeRecordStatus } from "../gauges";
import RecordStatusBadge from "./RecordStatusBadge";
import type { RecordViewProps, WeighingRecord } from "../types";

export default function FatteningRecordCard({
  r,
  view,
}: {
  r: WeighingRecord;
  view: RecordViewProps;
}) {
  if (view.editingId === r.id) {
    return <div>{view.editForm}</div>;
  }
  const status = describeRecordStatus(r, view.rabbitById, view.fatteningById);
  return (
    <div className="weighing-card">
      <div className="weighing-card-top">
        <span className="weighing-name">
          {new Date(r.weighing_date).toLocaleDateString("uk-UA")}
          {r.rabbit_name ? ` · ${r.rabbit_name}` : ""}
          {r.is_final && <span className="weighing-final-badge">забій</span>}
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
        <RecordStatusBadge status={status} />
      </p>
      <p className="weighing-sample-tag">
        Показовий кролик (один навмання з гнізда)
      </p>
      {r.notes && <p className="weighing-notes">{r.notes}</p>}
    </div>
  );
}
