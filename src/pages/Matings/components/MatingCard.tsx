import type {
  LitterAddControls,
  LitterEditControls,
  Mating,
  MatingActions,
  MatingEditControls,
  Rabbit,
} from "../types";
import { getUpcomingInfo } from "../utils";
import LitterAddForm from "./LitterAddForm";
import LitterBlock from "./LitterBlock";
import MatingDates from "./MatingDates";
import MatingEditForm from "./MatingEditForm";
import MatingPair from "./MatingPair";

interface Props {
  mating: Mating;
  males: Rabbit[];
  females: Rabbit[];
  getRabbitName: (id: string | null) => string;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  saving: boolean;
  error: string;
  actions: MatingActions;
  matingEdit: MatingEditControls;
  litterEdit: LitterEditControls;
  litterAdd: LitterAddControls;
}

/** Картка активної злучки: заголовок, деталі, окроли і форма нового окролу. */
export default function MatingCard({
  mating: m,
  males,
  females,
  getRabbitName,
  isExpanded,
  onToggleExpanded,
  saving,
  error,
  actions,
  matingEdit,
  litterEdit,
  litterAdd,
}: Props) {
  const upcoming = getUpcomingInfo(m);

  return (
    <div className="mating-card">
      <div className="mating-card-top">
        <MatingPair mating={m} />
        <div className="mating-card-btns">
          <button className="mating-edit-btn" onClick={matingEdit.onToggle}>
            {matingEdit.isEditing ? "✕" : "Редагувати"}
          </button>
          <button
            className="mating-delete-btn"
            onClick={() => actions.deleteMating(m.id)}
          >
            Видалити
          </button>
          <button
            className="mating-archive-btn"
            onClick={() => actions.archiveMating(m.id)}
          >
            Архів
          </button>
          <button
            className="mating-toggle-btn"
            onClick={onToggleExpanded}
            aria-label={isExpanded ? "Згорнути" : "Розгорнути"}
          >
            {isExpanded ? "▲ Згорнути" : "▼ Деталі"}
          </button>
        </div>
      </div>

      {upcoming && (
        <div className="mating-summary-date">
          {upcoming.label}:{" "}
          <strong>{new Date(upcoming.date).toLocaleDateString("uk-UA")}</strong>
        </div>
      )}

      {isExpanded && (
        <>
          <MatingDates mating={m} />

          {m.notes && <p className="mating-notes">{m.notes}</p>}

          {matingEdit.isEditing && matingEdit.data && (
            <MatingEditForm
              matingId={m.id}
              data={matingEdit.data}
              males={males}
              females={females}
              saving={saving}
              error={error}
              onChange={matingEdit.onChange}
              onCancel={matingEdit.onCancel}
              onSave={matingEdit.onSave}
            />
          )}

          {(m.litters || []).map((l) => (
            <LitterBlock
              key={l.id}
              litter={l}
              mating={m}
              males={males}
              females={females}
              getRabbitName={getRabbitName}
              saving={saving}
              error={error}
              actions={actions}
              edit={litterEdit}
            />
          ))}
        </>
      )}

      <button className="litter-add-btn" onClick={litterAdd.onToggleOpen}>
        {litterAdd.isOpen ? "✕ Скасувати" : "+ Додати окріл"}
      </button>

      {litterAdd.isOpen && (
        <LitterAddForm
          mating={m}
          males={males}
          females={females}
          form={litterAdd.form}
          splitMale={litterAdd.splitMale}
          splitFemale={litterAdd.splitFemale}
          saving={saving}
          error={error}
          onFieldChange={litterAdd.onFieldChange}
          onMatingDateChange={litterAdd.onMatingDateChange}
          onSplitMale={litterAdd.onSplitMale}
          onSplitFemale={litterAdd.onSplitFemale}
          onSave={litterAdd.onSave}
        />
      )}
    </div>
  );
}
