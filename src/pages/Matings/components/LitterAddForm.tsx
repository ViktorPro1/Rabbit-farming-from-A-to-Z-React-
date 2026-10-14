import type { LitterFormState, Mating, Rabbit } from "../types";
import FailureChecks from "./FailureChecks";
import ParentSelects from "./ParentSelects";

interface Props {
  mating: Mating;
  males: Rabbit[];
  females: Rabbit[];
  form: LitterFormState;
  splitMale: boolean;
  splitFemale: boolean;
  saving: boolean;
  error: string;
  onFieldChange: (field: keyof LitterFormState, value: string) => void;
  onMatingDateChange: (date: string) => void;
  onSplitMale: () => void;
  onSplitFemale: () => void;
  onSave: () => void;
}

export default function LitterAddForm({
  mating: m,
  males,
  females,
  form,
  splitMale,
  splitFemale,
  saving,
  error,
  onFieldChange,
  onMatingDateChange,
  onSplitMale,
  onSplitFemale,
  onSave,
}: Props) {
  const id = `litter-add-${m.id}`;

  return (
    <div className="litter-form">
      <div className="matings-form-grid">
        <ParentSelects
          maleValue={form.actual_male_id}
          femaleValue={form.actual_female_id}
          onMaleChange={(v) => onFieldChange("actual_male_id", v)}
          onFemaleChange={(v) => onFieldChange("actual_female_id", v)}
          mating={m}
          idPrefix={id}
          males={males}
          females={females}
        />
        <div className="matings-form-field">
          <label htmlFor={`${id}-mating-date`}>Злучка</label>
          <input
            id={`${id}-mating-date`}
            type="date"
            value={form.litter_mating_date}
            onChange={(e) => onMatingDateChange(e.target.value)}
          />
        </div>
        <div className="matings-form-field">
          <label htmlFor={`${id}-control-date`}>Контрольна</label>
          <input
            id={`${id}-control-date`}
            type="date"
            value={form.litter_control_date}
            onChange={(e) =>
              onFieldChange("litter_control_date", e.target.value)
            }
          />
        </div>
        <div className="matings-form-field">
          <label htmlFor={`${id}-expected-birth`}>Очікуваний окріл</label>
          <input
            id={`${id}-expected-birth`}
            type="date"
            value={form.litter_expected_birth}
            onChange={(e) =>
              onFieldChange("litter_expected_birth", e.target.value)
            }
          />
        </div>
        <div className="matings-form-field">
          <label htmlFor={`${id}-nestbox-date`}>Маточник встановлено</label>
          <input
            id={`${id}-nestbox-date`}
            type="date"
            value={form.nestbox_date}
            onChange={(e) => onFieldChange("nestbox_date", e.target.value)}
          />
        </div>
        <div className="matings-form-field">
          <label htmlFor={`${id}-birth-date`}>Дата окролу</label>
          <input
            id={`${id}-birth-date`}
            type="date"
            value={form.birth_date}
            onChange={(e) => onFieldChange("birth_date", e.target.value)}
          />
        </div>
        <FailureChecks
          value={form.failure_type}
          onChange={(v) => onFieldChange("failure_type", v)}
          idPrefix={id}
        />
        <input
          id={`${id}-total-born`}
          aria-label="Народилось всього"
          type="number"
          placeholder="Народилось всього"
          value={form.total_born}
          onChange={(e) => onFieldChange("total_born", e.target.value)}
        />
        <input
          id={`${id}-alive`}
          aria-label="Живих"
          type="number"
          placeholder="Живих"
          value={form.alive}
          onChange={(e) => onFieldChange("alive", e.target.value)}
        />
        <input
          id={`${id}-dead`}
          aria-label="Мертвих"
          type="number"
          placeholder="Мертвих"
          value={form.dead}
          onChange={(e) => onFieldChange("dead", e.target.value)}
        />
        <div></div>
        <div className="matings-form-field">
          <label htmlFor={`${id}-weaned-date`}>Дата відлучення</label>
          <input
            id={`${id}-weaned-date`}
            type="date"
            value={form.weaned_date}
            onChange={(e) => onFieldChange("weaned_date", e.target.value)}
          />
        </div>
        <div></div>
        <input
          id={`${id}-weaned-males`}
          aria-label="Кількість самців"
          type="number"
          placeholder="♂ Кількість самців"
          value={form.weaned_males}
          onChange={(e) => onFieldChange("weaned_males", e.target.value)}
        />
        <input
          id={`${id}-weaned-males-cage`}
          aria-label="Клітка для самців"
          placeholder="♂ Клітка / куди"
          value={form.weaned_males_cage}
          onChange={(e) => onFieldChange("weaned_males_cage", e.target.value)}
        />
        {!splitMale ? (
          <button
            type="button"
            className="litter-split-btn"
            onClick={onSplitMale}
          >
            + Ще одна клітка для самців
          </button>
        ) : (
          <>
            <input
              id={`${id}-weaned-males-2`}
              aria-label="Скільки самців у другу клітку"
              type="number"
              placeholder="♂ Скільки з них у другу клітку"
              value={form.weaned_males_2}
              onChange={(e) => onFieldChange("weaned_males_2", e.target.value)}
            />
            <input
              id={`${id}-weaned-males-cage-2`}
              aria-label="Друга клітка для самців"
              placeholder="♂ Друга клітка"
              value={form.weaned_males_cage_2}
              onChange={(e) =>
                onFieldChange("weaned_males_cage_2", e.target.value)
              }
            />
          </>
        )}
        <input
          id={`${id}-weaned-females`}
          aria-label="Кількість самиць"
          type="number"
          placeholder="♀ Кількість самиць"
          value={form.weaned_females}
          onChange={(e) => onFieldChange("weaned_females", e.target.value)}
        />
        <input
          id={`${id}-weaned-females-cage`}
          aria-label="Клітка для самиць"
          placeholder="♀ Клітка / куди"
          value={form.weaned_females_cage}
          onChange={(e) => onFieldChange("weaned_females_cage", e.target.value)}
        />
        {!splitFemale ? (
          <button
            type="button"
            className="litter-split-btn"
            onClick={onSplitFemale}
          >
            + Ще одна клітка для самиць
          </button>
        ) : (
          <>
            <input
              id={`${id}-weaned-females-2`}
              aria-label="Скільки самиць у другу клітку"
              type="number"
              placeholder="♀ Скільки з них у другу клітку"
              value={form.weaned_females_2}
              onChange={(e) =>
                onFieldChange("weaned_females_2", e.target.value)
              }
            />
            <input
              id={`${id}-weaned-females-cage-2`}
              aria-label="Друга клітка для самиць"
              placeholder="♀ Друга клітка"
              value={form.weaned_females_cage_2}
              onChange={(e) =>
                onFieldChange("weaned_females_cage_2", e.target.value)
              }
            />
          </>
        )}
        <input
          id={`${id}-notes`}
          aria-label="Нотатки"
          placeholder="Нотатки"
          value={form.notes}
          onChange={(e) => onFieldChange("notes", e.target.value)}
          className="matings-form-full"
        />
      </div>
      {error && <p className="matings-error">{error}</p>}
      <button className="matings-save-btn" onClick={onSave} disabled={saving}>
        {saving ? "Збереження..." : "Зберегти окріл"}
      </button>
    </div>
  );
}
