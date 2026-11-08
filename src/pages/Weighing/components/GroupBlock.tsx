import { useState } from "react";
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
  // Акордеон: false — видно тільки останнє зважування, true — усі записи
  const [showAll, setShowAll] = useState(false);

  const reminderInfo = computeReminderInfo(
    sorted,
    view.rabbitById,
    view.fatteningById,
  );

  // sorted іде від старих до нових, тому останнє зважування — в кінці
  const lastIdx = sorted.length - 1;
  const last = sorted[lastIdx];
  const hasMany = sorted.length > 1;

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
          {showAll || !hasMany
            ? // Усі записи (або єдиний запис, якщо він один)
              sorted.map((r, idx) => (
                <BreedingRecordCard
                  key={r.id}
                  r={r}
                  prev={idx > 0 ? sorted[idx - 1] : undefined}
                  view={view}
                />
              ))
            : // Згорнуто: тільки останнє зважування
              last && (
                <BreedingRecordCard
                  key={last.id}
                  r={last}
                  prev={sorted[lastIdx - 1]}
                  view={view}
                />
              )}

          {/* Кнопка з'являється, тільки якщо записів більше одного */}
          {hasMany && (
            <button
              type="button"
              className="weighing-accordion-toggle"
              aria-expanded={showAll}
              onClick={() => setShowAll((v) => !v)}
            >
              {showAll
                ? "Сховати попередні зважування"
                : `Показати всі зважування (${sorted.length})`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
