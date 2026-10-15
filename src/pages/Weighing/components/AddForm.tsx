import TypeSpecificFields from "./TypeSpecificFields";
import type {
  FatteningOption,
  RabbitOption,
  WeighingFormState,
  WeighingType,
} from "../types";

export default function AddForm({
  form,
  setForm,
  onSave,
  saving,
  error,
  rabbitById,
  fatteningById,
  rabbitOptions,
  fatteningOptions,
}: {
  form: WeighingFormState;
  setForm: (form: WeighingFormState) => void;
  onSave: () => void;
  saving: boolean;
  error: string;
  rabbitById: Record<string, RabbitOption>;
  fatteningById: Record<string, FatteningOption>;
  rabbitOptions: RabbitOption[];
  fatteningOptions: FatteningOption[];
}) {
  return (
    <div className="weighing-form">
      <h3>Нове зважування</h3>
      <div className="weighing-form-grid">
        <select
          id="weighing-add-type"
          name="weighing_type"
          value={form.weighing_type}
          onChange={(e) =>
            setForm({
              ...form,
              weighing_type: e.target.value as WeighingType,
              rabbit_id: "",
              fattening_id: "",
              litter_label: "",
              rabbit_name: "",
            })
          }
        >
          <option value="breeding">🐇 Племінне</option>
          <option value="fattening">🍖 Відгодівля</option>
        </select>
        <TypeSpecificFields
          values={{
            weighing_type: form.weighing_type,
            rabbit_id: form.rabbit_id,
            fattening_id: form.fattening_id,
            size_category: form.size_category,
          }}
          onChange={(patch) => setForm({ ...form, ...patch })}
          idPrefix="weighing-add"
          rabbitById={rabbitById}
          fatteningById={fatteningById}
          rabbitOptions={rabbitOptions}
          fatteningOptions={fatteningOptions}
        />
        <div className="weighing-form-field">
          <label htmlFor="weighing-add-date">Дата зважування *</label>
          <input
            id="weighing-add-date"
            type="date"
            value={form.weighing_date}
            onChange={(e) =>
              setForm({ ...form, weighing_date: e.target.value })
            }
          />
        </div>
        <div className="weighing-form-field">
          <label htmlFor="weighing-add-weight">Вага (г) *</label>
          <input
            id="weighing-add-weight"
            type="number"
            min="0"
            placeholder="Наприклад 1450"
            value={form.weight_g}
            onChange={(e) => setForm({ ...form, weight_g: e.target.value })}
          />
        </div>
        <input
          id="weighing-add-notes"
          name="notes"
          placeholder="Нотатки"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="weighing-form-full"
        />
      </div>
      {form.weighing_type === "fattening" && (
        <label className="weighing-final-check">
          <input
            id="weighing-add-is-final"
            name="is_final"
            type="checkbox"
            checked={form.is_final}
            onChange={(e) => setForm({ ...form, is_final: e.target.checked })}
          />
          Фінальне зважування (забій, клітка звільняється під нову партію)
        </label>
      )}
      {error && <p className="weighing-error">{error}</p>}
      <button
        className="weighing-save-btn"
        onClick={onSave}
        disabled={
          saving ||
          !form.litter_label ||
          !form.weighing_date ||
          !form.weight_g ||
          (form.weighing_type === "breeding"
            ? !form.rabbit_id
            : !form.fattening_id)
        }
      >
        {saving ? "Збереження..." : "Зберегти"}
      </button>
    </div>
  );
}
