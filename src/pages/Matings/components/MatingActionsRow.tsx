import type { Mating, MatingActions } from "../types";
import { getNestboxStatus, isWithin24hOfControl } from "../utils";

interface Props {
  mating: Mating;
  actions: MatingActions;
}

/** Дати, «Покрилась повторно» і маточник для злучки без окролів (як в окролі). */
export default function MatingActionsRow({ mating: m, actions }: Props) {
  if (!m.mating_date && !m.control_date && !m.expected_birth) return null;

  const { text, className } = getNestboxStatus(m.mating_date, m.nestbox_date);

  return (
    <div className="litter-mating-info">
      {m.mating_date && (
        <span>
          📅 Злучка:{" "}
          <strong>{new Date(m.mating_date).toLocaleDateString("uk-UA")}</strong>
        </span>
      )}

      {m.previous_mating_date && (
        <span className="litter-weaning-alert">
          ⚠️ Попередня спроба:{" "}
          <strong>
            {new Date(m.previous_mating_date).toLocaleDateString("uk-UA")}
          </strong>{" "}
          — не запліднилась
        </span>
      )}

      {m.control_date && (
        <div className="litter-mating-row">
          <span>
            🔍 Контрольна:{" "}
            <strong>
              {new Date(m.control_date).toLocaleDateString("uk-UA")}
            </strong>
          </span>
          {m.mating_date && isWithin24hOfControl(m.control_date) && (
            <button
              className="nestbox-done-btn"
              onClick={() => actions.rematingMating(m)}
              title="Кролиця підпустила самця під час контрольної — оновити дати"
            >
              🔁 Покрилась повторно
            </button>
          )}
        </div>
      )}

      {m.mating_date && (
        <div className="litter-mating-row">
          <span className={`nestbox-status ${className}`}>{text}</span>
          {!m.nestbox_date && (
            <button
              className="nestbox-done-btn"
              onClick={() => actions.markMatingNestboxPrepared(m.id)}
            >
              ✅ Маточник підготовлено
            </button>
          )}
        </div>
      )}

      {m.expected_birth && (
        <span className="litter-mating-break">
          🗓 Очік. окріл:{" "}
          <strong>
            {new Date(m.expected_birth).toLocaleDateString("uk-UA")}
          </strong>
        </span>
      )}
    </div>
  );
}
