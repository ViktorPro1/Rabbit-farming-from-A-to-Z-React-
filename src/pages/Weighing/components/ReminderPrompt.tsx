import type { ReminderPromptState } from "../types";

// Одноразова підказка про нагадування після збереження зважування
export default function ReminderPrompt({
  prompt,
  draft,
  onDraftChange,
  onSave,
  onSkip,
}: {
  prompt: ReminderPromptState;
  draft: string;
  onDraftChange: (value: string) => void;
  onSave: () => void;
  onSkip: () => void;
}) {
  return (
    <div className="weighing-reminder-prompt">
      <p className="weighing-reminder-prompt-text">
        🔔 Встановити нагадування про наступне зважування для «{prompt.label}»?
      </p>
      <div className="weighing-reminder-prompt-actions">
        <input
          id="weighing-reminder-prompt-days"
          name="reminderPromptDays"
          type="number"
          min="1"
          placeholder="днів"
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSave()}
          className="weighing-reminder-input"
        />
        <button
          className="weighing-save-btn"
          onClick={onSave}
          disabled={!draft || Number(draft) <= 0}
        >
          Зберегти
        </button>
        <button className="weighing-cancel-btn" onClick={() => onSkip()}>
          Пропустити
        </button>
      </div>
    </div>
  );
}
