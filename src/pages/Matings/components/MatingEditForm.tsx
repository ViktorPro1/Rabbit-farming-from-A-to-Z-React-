import type { Mating, Rabbit } from "../types";
import RabbitOptions from "./RabbitOptions";

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
        <button
          className="matings-save-btn"
          onClick={onSave}
          disabled={saving || !data.male_id || !data.female_id}
        >
          {saving ? "Збереження..." : "Зберегти зміни"}
        </button>
      </div>
    </div>
  );
}
