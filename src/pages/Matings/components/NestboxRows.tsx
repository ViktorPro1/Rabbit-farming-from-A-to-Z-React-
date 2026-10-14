import type { Litter } from "../types";
import { getNestboxRemovalStatus, getNestboxStatus } from "../utils";

interface PrepareRowProps {
  litter: Litter;
  onPrepared: () => void;
}

/** Нагадування підготувати маточник (до окролу). */
export function NestboxPrepareRow({ litter: l, onPrepared }: PrepareRowProps) {
  const { text, className } = getNestboxStatus(
    l.litter_mating_date,
    l.nestbox_date,
  );
  return (
    <div className="litter-mating-row">
      <span className={`nestbox-status ${className}`}>{text}</span>
      {!l.nestbox_date && (
        <button className="nestbox-done-btn" onClick={onPrepared}>
          ✅ Маточник підготовлено
        </button>
      )}
    </div>
  );
}

interface RemovalRowProps {
  litter: Litter;
  onRemoved: () => void;
}

/** Нагадування забрати маточник (після окролу, до відлучення). */
export function NestboxRemovalRow({ litter: l, onRemoved }: RemovalRowProps) {
  const { text, className } = getNestboxRemovalStatus(
    l.birth_date,
    l.nestbox_removed_date,
  );
  return (
    <div className="litter-mating-row">
      <span className={`nestbox-status ${className}`}>{text}</span>
      {!l.nestbox_removed_date && (
        <button className="nestbox-done-btn" onClick={onRemoved}>
          ✅ Маточник забрано
        </button>
      )}
    </div>
  );
}
