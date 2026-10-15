import { useState } from "react";
import type { ReminderInfo } from "../types";

export default function ReminderBadge({
  info,
  onChangeInterval,
}: {
  info: ReminderInfo;
  onChangeInterval: (days: number | null) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  function startEditing() {
    setDraft(info.reminderDays ? String(info.reminderDays) : "");
    setEditing(true);
  }

  if (!info.entityType) {
    return (
      <span className="weighing-reminder weighing-reminder-none">
        🔔 нагадування недоступне без прив'язки до реєстру
      </span>
    );
  }

  function save() {
    const trimmed = draft.trim();
    const n = trimmed === "" ? null : Number(trimmed);
    onChangeInterval(n && n > 0 ? Math.round(n) : null);
    setEditing(false);
  }

  if (editing) {
    return (
      <span className="weighing-reminder weighing-reminder-edit">
        🔔 нагадувати кожні
        <input
          id={`reminder-interval-${info.entityId ?? "unknown"}`}
          name="reminderDays"
          type="number"
          min="1"
          value={draft}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          onChange={(e) => setDraft(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") setEditing(false);
          }}
          className="weighing-reminder-input"
        />
        дн.
      </span>
    );
  }

  let label: string;
  if (info.zone === "overdue") {
    label = `прострочено на ${Math.abs(info.daysUntil ?? 0)} дн.`;
  } else if (info.zone === "soon") {
    label =
      info.daysUntil === 0
        ? "зважити сьогодні"
        : `зважити через ${info.daysUntil} дн.`;
  } else if (info.zone === "ok") {
    label = `наступне зважування: ${
      info.dueDate ? new Date(info.dueDate).toLocaleDateString("uk-UA") : ""
    }`;
  } else {
    label = "натисніть, щоб задати нагадування";
  }

  return (
    <span
      className={`weighing-reminder weighing-reminder-${info.zone}`}
      role="button"
      tabIndex={0}
      onClick={startEditing}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          startEditing();
        }
      }}
      title="Натисніть, щоб змінити інтервал нагадування"
    >
      🔔 {label}
    </span>
  );
}
