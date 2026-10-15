import { formatKg } from "../utils";
import type { BatchGroup } from "../types";

// Блок "Вага партій" (нова зверху)
export default function BatchWeights({
  batchGroups,
}: {
  batchGroups: BatchGroup[];
}) {
  return (
    <div className="weighing-batches-card">
      <h3 className="weighing-batches-title">Вага партій</h3>
      <div className="weighing-batches-list">
        {[...batchGroups].reverse().map((b) => (
          <div key={b.key} className="weighing-batches-row">
            <div className="weighing-batches-period">
              {new Date(b.startDate).toLocaleDateString("uk-UA")} –{" "}
              {new Date(b.endDate).toLocaleDateString("uk-UA")}
              {!b.isClosed && (
                <span className="weighing-batches-live"> · триває</span>
              )}
            </div>
            <div className="weighing-batches-kg">
              {b.heads > 0 ? `${formatKg(b.totalKg)} кг` : "—"}
            </div>
            <div className="weighing-batches-meta">
              {b.heads > 0 ? `${b.heads} гол.` : "кількість голів не вказана"}
              {b.heads > 0 && b.missing > 0
                ? ` · не враховано кліток без кількості голів: ${b.missing}`
                : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
