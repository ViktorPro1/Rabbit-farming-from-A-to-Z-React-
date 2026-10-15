import { addDaysISO } from "../../utils/kyivDate";
import { MS_PER_DAY } from "./utils";
import type {
  FatteningOption,
  RabbitOption,
  ReminderEntityType,
  ReminderInfo,
  ReminderZone,
  WeighingRecord,
} from "./types";

// НАГАДУВАННЯ ПРО НАСТУПНЕ ЗВАЖУВАННЯ.
// Інтервал (у днях) зберігається в колонці reminder_days у таблицях
// rabbits / fattening. Відлік — від дати останнього зважування в групі.
export function computeReminderInfo(
  sorted: WeighingRecord[],
  rabbitById: Record<string, RabbitOption>,
  fatteningById: Record<string, FatteningOption>,
): ReminderInfo {
  if (sorted.length === 0) {
    return {
      entityType: null,
      entityId: null,
      reminderDays: null,
      dueDate: null,
      daysUntil: null,
      zone: "none",
    };
  }

  const last = sorted[sorted.length - 1];
  let entityType: ReminderEntityType | null = null;
  let entityId: string | null = null;
  let reminderDays: number | null = null;

  if (last.rabbit_id && rabbitById[last.rabbit_id]) {
    entityType = "rabbit";
    entityId = last.rabbit_id;
    reminderDays = rabbitById[last.rabbit_id].reminder_days;
  } else if (last.fattening_id && fatteningById[last.fattening_id]) {
    entityType = "fattening";
    entityId = last.fattening_id;
    reminderDays = fatteningById[last.fattening_id].reminder_days;
  }

  if (!entityType || !reminderDays) {
    return {
      entityType,
      entityId,
      reminderDays: reminderDays ?? null,
      dueDate: null,
      daysUntil: null,
      zone: "none",
    };
  }

  const due = new Date(last.weighing_date);
  due.setDate(due.getDate() + reminderDays);
  due.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysUntil = Math.round((due.getTime() - today.getTime()) / MS_PER_DAY);

  let zone: ReminderZone = "ok";
  if (daysUntil < 0) zone = "overdue";
  else if (daysUntil <= 2) zone = "soon";

  return {
    entityType,
    entityId,
    reminderDays,
    // Змінено: раніше due.toISOString() — due тут локальна північ, тож у Києві
    // дата зсувалась на день назад. Тепер від дати останнього зважування.
    dueDate: addDaysISO(last.weighing_date, reminderDays),
    daysUntil,
    zone,
  };
}
