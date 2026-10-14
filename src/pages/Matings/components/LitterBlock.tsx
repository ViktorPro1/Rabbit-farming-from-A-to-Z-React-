import { FAILURE_LABELS } from "../constants";
import type {
  Litter,
  LitterEditControls,
  Mating,
  MatingActions,
  Rabbit,
} from "../types";
import { getLitterAge, getWeaningInfo } from "../utils";
import LitterActualParents from "./LitterActualParents";
import LitterEditForm from "./LitterEditForm";
import LitterMatingInfo from "./LitterMatingInfo";
import LitterStats from "./LitterStats";
import { NestboxRemovalRow } from "./NestboxRows";
import WeanedSummary from "./WeanedSummary";

interface Props {
  litter: Litter;
  mating: Mating;
  males: Rabbit[];
  females: Rabbit[];
  getRabbitName: (id: string | null) => string;
  saving: boolean;
  error: string;
  actions: MatingActions;
  edit: LitterEditControls;
}

/** Окріл усередині розгорнутої активної злучки. */
export default function LitterBlock({
  litter: l,
  mating: m,
  males,
  females,
  getRabbitName,
  saving,
  error,
  actions,
  edit,
}: Props) {
  const hasBirth = !!l.birth_date;
  const isFailed = !!l.failure_type;
  const weanInfo = hasBirth
    ? getWeaningInfo(l.birth_date, m.breeding_scheme)
    : null;
  const isEditing = edit.editingId === l.id;

  return (
    <div className="litter-block">
      <div className="litter-block-row">
        <span>
          📦 Окріл:{" "}
          <strong>
            {hasBirth
              ? new Date(l.birth_date).toLocaleDateString("uk-UA")
              : isFailed
                ? "не відбувся"
                : "очікується"}
          </strong>
        </span>
        <div className="litter-block-btns">
          <button className="mating-edit-btn" onClick={() => edit.onToggle(l)}>
            {isEditing ? "✕" : "✏️"}
          </button>
          <button
            className="litter-delete-btn"
            onClick={() => actions.deleteLitter(l.id)}
          >
            ✕
          </button>
        </div>
      </div>

      {isFailed && l.failure_type && (
        <div className="litter-failed-badge">
          {FAILURE_LABELS[l.failure_type]}
        </div>
      )}

      {/* Фактичні батьки якщо відрізняються від злучки */}
      <LitterActualParents litter={l} getRabbitName={getRabbitName} />

      <LitterMatingInfo litter={l} hasBirth={hasBirth} actions={actions} />

      {hasBirth && <LitterStats litter={l} />}

      {hasBirth && !isFailed && !l.weaned_date && (
        <NestboxRemovalRow
          litter={l}
          onRemoved={() => actions.markNestboxRemoved(l.id)}
        />
      )}

      {hasBirth && weanInfo && !l.weaned_date && (
        <div className="litter-age-row">
          <span className="litter-age">
            Вік: <strong>{getLitterAge(l.birth_date)}</strong>
          </span>
          {weanInfo.daysLeft > 0 ? (
            <span
              className={
                weanInfo.daysToMin <= 0
                  ? "litter-weaning-info"
                  : "litter-weaning-default"
              }
            >
              ✂️ До відлучення: {weanInfo.daysLeft} дн.
            </span>
          ) : (
            <span className="litter-weaning-alert">
              🔴 Прострочено на {Math.abs(weanInfo.daysLeft)} дн.
            </span>
          )}
        </div>
      )}

      <WeanedSummary litter={l} />

      {l.notes && <p className="mating-notes">{l.notes}</p>}

      {isEditing && edit.data && (
        <LitterEditForm
          litterId={l.id}
          mating={m}
          data={edit.data}
          males={males}
          females={females}
          splitMale={edit.splitMale}
          splitFemale={edit.splitFemale}
          saving={saving}
          error={error}
          onChange={edit.onChange}
          onSplitMale={edit.onSplitMale}
          onSplitFemale={edit.onSplitFemale}
          onCancel={edit.onCancel}
          onSave={edit.onSave}
        />
      )}
    </div>
  );
}
