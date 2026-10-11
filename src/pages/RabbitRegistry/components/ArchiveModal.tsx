import { archiveReasons } from "../constants";

interface Props {
  selectedReason: string;
  error: string;
  onSelectReason: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ArchiveModal({
  selectedReason,
  error,
  onSelectReason,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <div
      className="help-overlay"
      onClick={onCancel}
      role="presentation"
    >
      <div
        className="confirm-modal"
        onClick={(e) => e.stopPropagation()}
        role="presentation"
      >
        <p className="confirm-text">Причина архівування?</p>
        <div className="archive-reason-list">
          {archiveReasons.map((r) => (
            <button
              key={r.value}
              className={`archive-reason-btn ${selectedReason === r.value ? "active" : ""}`}
              onClick={() => onSelectReason(r.value)}
            >
              {r.label}
            </button>
          ))}
        </div>
        {error && <p className="registry-error">{error}</p>}
        <div className="confirm-actions">
          <button
            className="confirm-cancel"
            onClick={onCancel}
          >
            Скасувати
          </button>
          <button
            className="confirm-ok"
            onClick={onConfirm}
            disabled={!selectedReason}
          >
            Архівувати
          </button>
        </div>
      </div>
    </div>
  );
}
