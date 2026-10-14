import type { Litter } from "../types";
import { getLitterAge } from "../utils";
import LitterActualParents from "./LitterActualParents";
import LitterStats from "./LitterStats";
import WeanedSummary from "./WeanedSummary";

interface Props {
  litter: Litter;
  getRabbitName: (id: string | null) => string;
}

/** Окріл в архівній злучці: лише перегляд, без кнопок і форм. */
export default function ArchivedLitterBlock({
  litter: l,
  getRabbitName,
}: Props) {
  const hasBirth = !!l.birth_date;

  return (
    <div className="litter-block">
      <div className="litter-block-row">
        <span>
          📦 Окріл:{" "}
          <strong>
            {hasBirth
              ? new Date(l.birth_date).toLocaleDateString("uk-UA")
              : "очікується"}
          </strong>
        </span>
      </div>

      <LitterActualParents litter={l} getRabbitName={getRabbitName} />

      {(l.litter_mating_date ||
        l.litter_control_date ||
        l.litter_expected_birth) && (
        <div className="litter-mating-info">
          {l.litter_mating_date && (
            <span>
              📅 Злучка:{" "}
              <strong>
                {new Date(l.litter_mating_date).toLocaleDateString("uk-UA")}
              </strong>
            </span>
          )}
          {l.litter_control_date && (
            <span>
              🔍 Контрольна:{" "}
              <strong>
                {new Date(l.litter_control_date).toLocaleDateString("uk-UA")}
              </strong>
            </span>
          )}
          {hasBirth && l.nestbox_date && (
            <span>
              ✅ Маточник:{" "}
              <strong>
                {new Date(l.nestbox_date).toLocaleDateString("uk-UA")}
              </strong>
            </span>
          )}
          {l.litter_expected_birth && (
            <span>
              🗓 Очік. окріл:{" "}
              <strong>
                {new Date(l.litter_expected_birth).toLocaleDateString("uk-UA")}
              </strong>
            </span>
          )}
        </div>
      )}

      {hasBirth && <LitterStats litter={l} />}

      {hasBirth && !l.weaned_date && (
        <div className="litter-age-row">
          <span className="litter-age">
            Вік: <strong>{getLitterAge(l.birth_date)}</strong>
          </span>
        </div>
      )}

      <WeanedSummary litter={l} />

      {l.notes && <p className="mating-notes">{l.notes}</p>}
    </div>
  );
}
