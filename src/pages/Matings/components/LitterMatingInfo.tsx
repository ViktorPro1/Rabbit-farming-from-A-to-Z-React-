import type { Litter, MatingActions } from "../types";
import { isWithin24hOfControl } from "../utils";
import { NestboxPrepareRow } from "./NestboxRows";

interface Props {
  litter: Litter;
  hasBirth: boolean;
  actions: MatingActions;
}

/** Дати злучки окролу, контрольна, повторна злучка і маточник (активний окріл). */
export default function LitterMatingInfo({
  litter: l,
  hasBirth,
  actions,
}: Props) {
  if (
    !l.litter_mating_date &&
    !l.litter_control_date &&
    !l.litter_expected_birth
  )
    return null;

  return (
    <div className="litter-mating-info">
      {l.litter_mating_date && (
        <span>
          📅 Злучка:{" "}
          <strong>
            {new Date(l.litter_mating_date).toLocaleDateString("uk-UA")}
          </strong>
        </span>
      )}
      {l.previous_mating_date && (
        <span className="litter-weaning-alert">
          ⚠️ Попередня спроба:{" "}
          <strong>
            {new Date(l.previous_mating_date).toLocaleDateString("uk-UA")}
          </strong>{" "}
          — не запліднилась
        </span>
      )}
      {l.litter_control_date && (
        <div className="litter-mating-row">
          <span>
            🔍 Контрольна:{" "}
            <strong>
              {new Date(l.litter_control_date).toLocaleDateString("uk-UA")}
            </strong>
          </span>
          {!hasBirth &&
            l.litter_mating_date &&
            isWithin24hOfControl(l.litter_control_date) && (
              <button
                className="nestbox-done-btn"
                onClick={() => actions.remating(l)}
                title="Кролиця підпустила самця під час контрольної — оновити дати"
              >
                🔁 Покрилась повторно
              </button>
            )}
        </div>
      )}

      {/* АВТОМАТИЧНЕ НАГАДУВАННЯ ПРО РОДІЛКУ — лише поки немає окролу */}
      {!hasBirth && l.litter_mating_date && (
        <NestboxPrepareRow
          litter={l}
          onPrepared={() => actions.markNestboxPrepared(l.id)}
        />
      )}

      {/* Якщо маточник вже стоїть (навіть після окролу) — просто показати дату */}
      {hasBirth && l.nestbox_date && (
        <span>
          ✅ Маточник:{" "}
          <strong>
            {new Date(l.nestbox_date).toLocaleDateString("uk-UA")}
          </strong>
        </span>
      )}

      {l.litter_expected_birth && (
        <span className="litter-mating-break">
          🗓 Очік. окріл:{" "}
          <strong>
            {new Date(l.litter_expected_birth).toLocaleDateString("uk-UA")}
          </strong>
        </span>
      )}
    </div>
  );
}
