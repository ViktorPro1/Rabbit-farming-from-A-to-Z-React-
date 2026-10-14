import type { Litter, Mating, Rabbit } from "../types";
import FailureChecks from "./FailureChecks";
import ParentSelects from "./ParentSelects";

interface Props {
  litterId: string;
  mating: Mating;
  /** Поточні значення полів (копія окролу, що редагується) */
  data: Litter;
  males: Rabbit[];
  females: Rabbit[];
  splitMale: boolean;
  splitFemale: boolean;
  saving: boolean;
  error: string;
  onChange: (patch: Partial<Litter>) => void;
  onSplitMale: () => void;
  onSplitFemale: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export default function LitterEditForm({
  litterId,
  mating,
  data,
  males,
  females,
  splitMale,
  splitFemale,
  saving,
  error,
  onChange,
  onSplitMale,
  onSplitFemale,
  onCancel,
  onSave,
}: Props) {
  const id = `litter-edit-${litterId}`;

  return (
    <div className="matings-form matings-edit-form">
      <h3>✏️ Редагування окролу</h3>
      <div className="matings-form-grid">
        <ParentSelects
          maleValue={data.actual_male_id || ""}
          femaleValue={data.actual_female_id || ""}
          onMaleChange={(v) => onChange({ actual_male_id: v })}
          onFemaleChange={(v) => onChange({ actual_female_id: v })}
          mating={mating}
          idPrefix={id}
          males={males}
          females={females}
        />
        <div className="matings-form-field">
          <label htmlFor={`${id}-mating-date`}>Злучка</label>
          <input
            id={`${id}-mating-date`}
            type="date"
            value={data.litter_mating_date || ""}
            onChange={(e) => onChange({ litter_mating_date: e.target.value })}
          />
        </div>
        <div className="matings-form-field">
          <label htmlFor={`${id}-control-date`}>Контрольна</label>
          <input
            id={`${id}-control-date`}
            type="date"
            value={data.litter_control_date || ""}
            onChange={(e) => onChange({ litter_control_date: e.target.value })}
          />
        </div>
        <div className="matings-form-field">
          <label htmlFor={`${id}-expected-birth`}>Очікуваний окріл</label>
          <input
            id={`${id}-expected-birth`}
            type="date"
            value={data.litter_expected_birth || ""}
            onChange={(e) =>
              onChange({ litter_expected_birth: e.target.value })
            }
          />
        </div>
        <div className="matings-form-field">
          <label htmlFor={`${id}-nestbox-date`}>Маточник встановлено</label>
          <input
            id={`${id}-nestbox-date`}
            type="date"
            value={data.nestbox_date || ""}
            onChange={(e) => onChange({ nestbox_date: e.target.value })}
          />
        </div>
        <div className="matings-form-field">
          <label htmlFor={`${id}-birth-date`}>Дата окролу</label>
          <input
            id={`${id}-birth-date`}
            type="date"
            value={data.birth_date || ""}
            onChange={(e) => onChange({ birth_date: e.target.value })}
          />
          <div className="matings-form-field">
            <label htmlFor={`${id}-nestbox-removed`}>Маточник забрано</label>
            <input
              id={`${id}-nestbox-removed`}
              type="date"
              value={data.nestbox_removed_date || ""}
              onChange={(e) =>
                onChange({ nestbox_removed_date: e.target.value })
              }
            />
          </div>
        </div>
        <FailureChecks
          value={data.failure_type || ""}
          onChange={(v) =>
            onChange({ failure_type: (v || null) as Litter["failure_type"] })
          }
          idPrefix={id}
        />
        <input
          id={`${id}-total-born`}
          aria-label="Народилось всього"
          type="number"
          placeholder="Народилось всього"
          value={data.total_born || ""}
          onChange={(e) => onChange({ total_born: Number(e.target.value) })}
        />
        <input
          id={`${id}-alive`}
          aria-label="Живих"
          type="number"
          placeholder="Живих"
          value={data.alive || ""}
          onChange={(e) => onChange({ alive: Number(e.target.value) })}
        />
        <input
          id={`${id}-dead`}
          aria-label="Мертвих"
          type="number"
          placeholder="Мертвих"
          value={data.dead || ""}
          onChange={(e) => onChange({ dead: Number(e.target.value) })}
        />
        <div></div>
        <div className="matings-form-field">
          <label htmlFor={`${id}-weaned-date`}>Дата відлучення</label>
          <input
            id={`${id}-weaned-date`}
            type="date"
            value={data.weaned_date || ""}
            onChange={(e) => onChange({ weaned_date: e.target.value })}
          />
        </div>
        <div></div>
        <input
          id={`${id}-weaned-males`}
          aria-label="Кількість самців"
          type="number"
          placeholder="♂ Кількість самців"
          value={data.weaned_males || ""}
          onChange={(e) => onChange({ weaned_males: Number(e.target.value) })}
        />
        <input
          id={`${id}-weaned-males-cage`}
          aria-label="Клітка для самців"
          placeholder="♂ Клітка / куди"
          value={data.weaned_males_cage || ""}
          onChange={(e) => onChange({ weaned_males_cage: e.target.value })}
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
              value={data.weaned_males_2 || ""}
              onChange={(e) =>
                onChange({ weaned_males_2: Number(e.target.value) })
              }
            />
            <input
              id={`${id}-weaned-males-cage-2`}
              aria-label="Друга клітка для самців"
              placeholder="♂ Друга клітка"
              value={data.weaned_males_cage_2 || ""}
              onChange={(e) =>
                onChange({ weaned_males_cage_2: e.target.value })
              }
            />
          </>
        )}
        <input
          id={`${id}-weaned-females`}
          aria-label="Кількість самиць"
          type="number"
          placeholder="♀ Кількість самиць"
          value={data.weaned_females || ""}
          onChange={(e) => onChange({ weaned_females: Number(e.target.value) })}
        />
        <input
          id={`${id}-weaned-females-cage`}
          aria-label="Клітка для самиць"
          placeholder="♀ Клітка / куди"
          value={data.weaned_females_cage || ""}
          onChange={(e) => onChange({ weaned_females_cage: e.target.value })}
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
              value={data.weaned_females_2 || ""}
              onChange={(e) =>
                onChange({ weaned_females_2: Number(e.target.value) })
              }
            />
            <input
              id={`${id}-weaned-females-cage-2`}
              aria-label="Друга клітка для самиць"
              placeholder="♀ Друга клітка"
              value={data.weaned_females_cage_2 || ""}
              onChange={(e) =>
                onChange({ weaned_females_cage_2: e.target.value })
              }
            />
          </>
        )}
        <input
          id={`${id}-notes`}
          aria-label="Нотатки"
          placeholder="Нотатки"
          value={data.notes || ""}
          onChange={(e) => onChange({ notes: e.target.value })}
          className="matings-form-full"
        />
      </div>
      {error && <p className="matings-error">{error}</p>}
      <div className="matings-edit-actions">
        <button className="matings-cancel-btn" onClick={onCancel}>
          Скасувати
        </button>
        <button className="matings-save-btn" onClick={onSave} disabled={saving}>
          {saving ? "Збереження..." : "Зберегти зміни"}
        </button>
      </div>
    </div>
  );
}
