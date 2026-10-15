import { computeReminderInfo } from "../reminders";
import BreedingRecordCard from "./BreedingRecordCard";
import CycleBody from "./CycleBody";
import ReminderBadge from "./ReminderBadge";
import type { GroupInfo, ReminderEntityType, RecordViewProps } from "../types";

// Одна група (клітка / кролик) у списку поточних: заголовок з нагадуванням
// і записи (цикл відгодівлі або племінні зважування з приростом).
export default function GroupBlock({
  info,
  view,
  onReminderChange,
}: {
  info: GroupInfo;
  view: RecordViewProps;
  onReminderChange: (
    entityType: ReminderEntityType,
    entityId: string,
    days: number | null,
  ) => void;
}) {
  const { litter, sorted, groupType, activeCycle } = info;
  const reminderInfo = computeReminderInfo(
    sorted,
    view.rabbitById,
    view.fatteningById,
  );

  return (
    <div className="weighing-group">
      <div className="weighing-group-header-row">
        <h2 className="weighing-group-title">
          {groupType === "fattening" ? "🍖" : "🐇"} {litter}
          <span className="weighing-group-badge">
            {groupType === "fattening" ? "Відгодівля" : "Племінне"}
          </span>
        </h2>
        <ReminderBadge
          info={reminderInfo}
          onChangeInterval={(days) => {
            if (reminderInfo.entityType && reminderInfo.entityId) {
              onReminderChange(
                reminderInfo.entityType,
                reminderInfo.entityId,
                days,
              );
            }
          }}
        />
      </div>

      {groupType === "fattening" ? (
        // Тут тільки поточний цикл. Закриті цикли — у спільному архіві.
        activeCycle && <CycleBody cycle={activeCycle} view={view} />
      ) : (
        // Племінне: приріст по добі між зважуваннями
        <div className="weighing-list">
          {sorted.map((r, idx) => (
            <BreedingRecordCard
              key={r.id}
              r={r}
              prev={idx > 0 ? sorted[idx - 1] : undefined}
              view={view}
            />
          ))}
        </div>
      )}
    </div>
  );
}
