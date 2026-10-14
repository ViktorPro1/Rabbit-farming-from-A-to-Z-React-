import type { MatingFormState, Rabbit } from "../types";
import RabbitOptions from "./RabbitOptions";

interface Props {
  form: MatingFormState;
  males: Rabbit[];
  females: Rabbit[];
  saving: boolean;
  error: string;
  onChange: (patch: Partial<MatingFormState>) => void;
  /** Зміна дати злучки також перераховує контрольну дату */
  onDateChange: (date: string) => void;
  onSave: () => void;
}

export default function MatingAddForm({
  form,
  males,
  females,
  saving,
  error,
  onChange,
  onDateChange,
  onSave,
}: Props) {
  return (
    <div className="matings-form">
      <div className="matings-form-grid">
        <div className="matings-form-field">
          <label htmlFor="mating-add-male">Кролик ♂</label>
          <select
            id="mating-add-male"
            value={form.male_id}
            onChange={(e) => onChange({ male_id: e.target.value })}
          >
            <option value="">Оберіть кроля</option>
            <RabbitOptions rabbits={males} />
          </select>
        </div>
        <div className="matings-form-field">
          <label htmlFor="mating-add-female">Крольчиха ♀</label>
          <select
            id="mating-add-female"
            value={form.female_id}
            onChange={(e) => onChange({ female_id: e.target.value })}
          >
            <option value="">Оберіть крольчиху</option>
            <RabbitOptions rabbits={females} />
          </select>
        </div>
        <div className="matings-form-field">
          <label htmlFor="mating-add-male-cage">Клітка кролика</label>
          <input
            id="mating-add-male-cage"
            placeholder="№"
            value={form.male_cage}
            onChange={(e) => onChange({ male_cage: e.target.value })}
          />
        </div>
        <div className="matings-form-field">
          <label htmlFor="mating-add-female-cage">Клітка крольчихи</label>
          <input
            id="mating-add-female-cage"
            placeholder="№"
            value={form.female_cage}
            onChange={(e) => onChange({ female_cage: e.target.value })}
          />
        </div>
        <div className="matings-form-field">
          <label htmlFor="mating-add-date">Дата злучки *</label>
          <input
            id="mating-add-date"
            type="date"
            value={form.mating_date}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>
        <div className="matings-form-field">
          <label htmlFor="mating-add-control-date">Контрольна дата</label>
          <input
            id="mating-add-control-date"
            type="date"
            value={form.control_date}
            onChange={(e) => onChange({ control_date: e.target.value })}
          />
        </div>
        <div className="matings-form-field">
          <label htmlFor="mating-add-scheme">Схема злучування</label>
          <select
            id="mating-add-scheme"
            value={form.breeding_scheme}
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
          id="mating-add-notes"
          aria-label="Нотатки"
          placeholder="Нотатки"
          value={form.notes}
          onChange={(e) => onChange({ notes: e.target.value })}
          className="matings-form-full"
        />
      </div>
      {error && <p className="matings-error">{error}</p>}
      <button
        className="matings-save-btn"
        onClick={onSave}
        disabled={
          saving || !form.female_id || !form.male_id || !form.mating_date
        }
      >
        {saving ? "Збереження..." : "Зберегти"}
      </button>
    </div>
  );
}
