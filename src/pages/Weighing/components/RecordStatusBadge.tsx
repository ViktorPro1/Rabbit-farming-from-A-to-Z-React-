import type { RecordStatus } from "../types";

export default function RecordStatusBadge({
  status,
}: {
  status: RecordStatus;
}) {
  return (
    <span
      className={`weighing-status-badge weighing-status-badge-${status.zone}`}
    >
      <span className="weighing-status-arrow">{status.arrow}</span>
      {status.label}
    </span>
  );
}
