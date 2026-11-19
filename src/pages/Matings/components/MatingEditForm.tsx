import type { LitterFormState, Mating, Rabbit } from "../types";
import FailureChecks from "./FailureChecks";
import RabbitOptions from "./RabbitOptions";

/** Поля окролу у формі злучки (показуються, коли в злучки ще немає окролів). */
export interface MatingEditLitterProps {
  form: LitterFormState;
  splitMale: boolean;
  splitFemale: boolean;
  onFieldChange: (field: keyof LitterFormState, value: string) => void;
  onMatingDateChange: (date: string) => void;
  onSplitMale: () => void;
  onSplitFemale: () => void;
}

interface Props {
  matingId: string;
  /** Поточні значення полів (копія злучки, що редагується) */
  data: Mating;
  males: Rabbit[];
  females: Rabbit[];
  saving: boolean;
  error: string;
  onChange: (patch: Partial<Mating>) => void;
  onCancel: () => void;
  onSave: () => void;
  /** Якщо передано — під базовими полями показується той самий блок, що й у формі окролу */
  litter?: MatingEditLitterProps;
}

export default function MatingEditForm({
  matingId,
  data,
  males,
  females,
  saving,
  error,
  onChange,
  onCancel,
  onSave,
  litter,
}: Props) {
  const id = `mating-edit-${matingId}`;

  return (
    <div className="matings-form matings-edit-form">
      <h3>✏️ Редагування злучки</h3>
      <div className="matings-form-grid">
        <div className="matings-form-field">
          <label htmlFor={`${id}-male`}>Кролик ♂</label>
          <select
            id={`${id}-male`}
            value={data.male_id}
            onChange={(e) => onChange({ male_id: e.target.value })}
          >
            <option value="">Оберіть кроля</option>
            <RabbitOptions rabbits={males} />
          </select>
        </div>
        <div className="matings-form-field">
          <label htmlFor={`${id}-female`}>Крольчиха ♀</label>
          <select
            id={`${id}-female`}
            value={data.female_id}
            onChange={(e) => onChange({ female_id: e.target.value })}
          >
            <option value="">Оберіть крольчиху</option>
            <RabbitOptions rabbits={females} />
          </select>
        </div>
        <div className="matings-form-field">
          <label htmlFor={`${id}-male-cage`}>Клітка кроля</label>
          <input
            id={`${id}-male-cage`}
            placeholder="№"
            value={data.male_cage || ""}
            onChange={(e) => onChange({ male_cage: e.target.value })}
          />
        </div>
        <div className="matings-form-field">
          <label htmlFor={`${id}-female-cage`}>Клітка крольчихи</label>
          <input
            id={`${id}-female-cage`}
            placeholder="№"
            value={data.female_cage || ""}
            onChange={(e) => onChange({ female_cage: e.target.value })}
          />
        </div>
        {!litter && (
          <>
            <div className="matings-form-field">
              <label htmlFor={`${id}-date`}>Дата злучки</label>
              <input
                id={`${id}-date`}
                type="date"
                value={data.mating_date}
                onChange={(e) => onChange({ mating_date: e.target.value })}
              />
            </div>
            <div className="matings-form-field">
              <label htmlFor={`${id}-control-date`}>Контрольна дата</label>
              <input
                id={`${id}-control-date`}
                type="date"
                value={data.control_date || ""}
                onChange={(e) => onChange({ control_date: e.target.value })}
              />
            </div>
          </>
        )}
        <div className="matings-form-field">
          <label htmlFor={`${id}-scheme`}>Схема злучування</label>
          <select
            id={`${id}-scheme`}
            value={data.breeding_scheme || "extensive"}
            onChange={(e) => onChange({ breeding_scheme: e.target.value })}
          >
            <option value="intensive">
              Інтенсивна (1–2 день після окролу)
            </option>
            <option value="semi_intensive">Напівінтенсивна (10–14 день)</option>
            <option value="extensive">Екстенсивна (після відлучення)</option>
          </select>
        </div>
        {litter ? (
          <>
            <div className="matings-form-field">
              <label htmlFor={`${id}-mating-date`}>Злучка</label>
              <input
                id={`${id}-mating-date`}
                type="date"
                value={litter.form.litter_mating_date}
                onChange={(e) => litter.onMatingDateChange(e.target.value)}
              />
            </div>
            <div className="matings-form-field">
              <label htmlFor={`${id}-control-date`}>Контрольна</label>
              <input
                id={`${id}-control-date`}
                type="date"
                value={litter.form.litter_control_date}
                onChange={(e) => litter.onFieldChange("litter_control_date", e.target.value)}
              />
            </div>
            <div className="matings-form-field">
              <label htmlFor={`${id}-expected-birth`}>Очікуваний окріл</label>
              <input
                id={`${id}-expected-birth`}
                type="date"
                value={litter.form.litter_expected_birth}
                onChange={(e) =>
                  litter.onFieldChange("litter_expected_birth", e.target.value)
                }
              />
            </div>
            <div className="matings-form-field">
              <label htmlFor={`${id}-nestbox-date`}>Маточник встановлено</label>
              <input
                id={`${id}-nestbox-date`}
                type="date"
                value={litter.form.nestbox_date}
                onChange={(e) => litter.onFieldChange("nestbox_date", e.target.value)}
              />
            </div>
            <div className="matings-form-field">
              <label htmlFor={`${id}-birth-date`}>Дата окролу</label>
              <input
                id={`${id}-birth-date`}
                type="date"
                value={litter.form.birth_date}
                onChange={(e) => litter.onFieldChange("birth_date", e.target.value)}
              />
            </div>
            <FailureChecks
              value={litter.form.failure_type}
              onChange={(v) => litter.onFieldChange("failure_type", v)}
              idPrefix={id}
            />
            <input
              id={`${id}-total-born`}
              aria-label="Народилось всього"
              type="number"
              placeholder="Народилось всього"
              value={litter.form.total_born}
              onChange={(e) => litter.onFieldChange("total_born", e.target.value)}
            />
            <input
              id={`${id}-alive`}
              aria-label="Живих"
              type="number"
              placeholder="Живих"
              value={litter.form.alive}
              onChange={(e) => litter.onFieldChange("alive", e.target.value)}
            />
            <input
              id={`${id}-dead`}
              aria-label="Мертвих"
              type="number"
              placeholder="Мертвих"
              value={litter.form.dead}
              onChange={(e) => litter.onFieldChange("dead", e.target.value)}
            />
            <div></div>
            <div className="matings-form-field">
              <label htmlFor={`${id}-weaned-date`}>Дата відлучення</label>
              <input
                id={`${id}-weaned-date`}
                type="date"
                value={litter.form.weaned_date}
                onChange={(e) => litter.onFieldChange("weaned_date", e.target.value)}
              />
            </div>
            <div></div>
            <input
              id={`${id}-weaned-males`}
              aria-label="Кількість самців"
              type="number"
              placeholder="♂ Кількість самців"
              value={litter.form.weaned_males}
              onChange={(e) => litter.onFieldChange("weaned_males", e.target.value)}
            />
            <input
              id={`${id}-weaned-males-cage`}
              aria-label="Клітка для самців"
              placeholder="♂ Клітка / куди"
              value={litter.form.weaned_males_cage}
              onChange={(e) => litter.onFieldChange("weaned_males_cage", e.target.value)}
            />
            {!litter.splitMale ? (
              <button
                type="button"
                className="litter-split-btn"
                onClick={litter.onSplitMale}
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
                  value={litter.form.weaned_males_2}
                  onChange={(e) => litter.onFieldChange("weaned_males_2", e.target.value)}
                />
                <input
                  id={`${id}-weaned-males-cage-2`}
                  aria-label="Друга клітка для самців"
                  placeholder="♂ Друга клітка"
                  value={litter.form.weaned_males_cage_2}
                  onChange={(e) =>
                    litter.onFieldChange("weaned_males_cage_2", e.target.value)
                  }
                />
              </>
            )}
            <input
              id={`${id}-weaned-females`}
              aria-label="Кількість самиць"
              type="number"
              placeholder="♀ Кількість самиць"
              value={litter.form.weaned_females}
              onChange={(e) => litter.onFieldChange("weaned_females", e.target.value)}
            />
            <input
              id={`${id}-weaned-females-cage`}
              aria-label="Клітка для самиць"
              placeholder="♀ Клітка / куди"
              value={litter.form.weaned_females_cage}
              onChange={(e) => litter.onFieldChange("weaned_females_cage", e.target.value)}
            />
            {!litter.splitFemale ? (
              <button
                type="button"
                className="litter-split-btn"
                onClick={litter.onSplitFemale}
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
                  value={litter.form.weaned_females_2}
                  onChange={(e) => litter.onFieldChange("weaned_females_2", e.target.value)}
                />
                <input
                  id={`${id}-weaned-females-cage-2`}
                  aria-label="Друга клітка для самиць"
                  placeholder="♀ Друга клітка"
                  value={litter.form.weaned_females_cage_2}
                  onChange={(e) =>
                    litter.onFieldChange("weaned_females_cage_2", e.target.value)
                  }
                />
              </>
            )}
            <input
              id={`${id}-notes`}
              aria-label="Нотатки"
              placeholder="Нотатки"
              value={litter.form.notes}
              onChange={(e) => litter.onFieldChange("notes", e.target.value)}
              className="matings-form-full"
            />
          </>
        ) : (
          <input
            id={`${id}-notes`}
            aria-label="Нотатки"
            placeholder="Нотатки"
            value={data.notes || ""}
            onChange={(e) => onChange({ notes: e.target.value })}
            className="matings-form-full"
          />
        )}
      </div>
      {error && <p className="matings-error">{error}</p>}
      <div className="matings-edit-actions">
        <button className="matings-cancel-btn" onClick={onCancel}>
          Скасувати
        </button>
        <button
          className="matings-save-btn"
          onClick={onSave}
          disabled={
            saving ||
            !data.male_id ||
            !data.female_id ||
            (!!litter && !litter.form.litter_mating_date)
          }
        >
          {saving ? "Збереження..." : "Зберегти зміни"}
        </button>
      </div>
    </div>
  );
}
