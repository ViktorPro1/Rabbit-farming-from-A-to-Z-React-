import TypeSpecificFields from "./TypeSpecificFields";
import type {
  FatteningOption,
  RabbitOption,
  WeighingRecord,
  WeighingType,
} from "../types";

export default function EditForm({
  record,
  onChange,
  onCancel,
  onSave,
  saving,
  error,
  rabbitById,
  fatteningById,
  rabbitOptions,
  fatteningOptions,
}: {
  record: WeighingRecord;
  onChange: (record: WeighingRecord) => void;
  onCancel: () => void;
  onSave: () => void;
  saving: boolean;
  error: string;
  rabbitById: Record<string, RabbitOption>;
  fatteningById: Record<string, FatteningOption>;
  rabbitOptions: RabbitOption[];
  fatteningOptions: FatteningOption[];
}) {
  const editingRecord = record;
  const setEditingRecord = onChange;
  return (
    <div className="weighing-form weighing-edit-form weighing-inline-edit">
      <h3>✏️ Редагування</h3>
      <div className="weighing-form-grid">
        <select
          id="weighing-edit-type"
          name="weighing_type"
          value={editingRecord.weighing_type}
          onChange={(e) =>
            setEditingRecord({
              ...editingRecord,
              weighing_type: e.target.value as WeighingType,
            })
          }
        >
          <option value="breeding">🐇 Племінне</option>
          <option value="fattening">🍖 Відгодівля</option>
        </select>
        <TypeSpecificFields
          values={{
            weighing_type: editingRecord.weighing_type,
            rabbit_id: editingRecord.rabbit_id || "",
            fattening_id: editingRecord.fattening_id || "",
            size_category: editingRecord.size_category || "meat",
          }}
          onChange={(patch) =>
            setEditingRecord({
              ...editingRecord,
              ...(patch.rabbit_id !== undefined
                ? { rabbit_id: patch.rabbit_id }
                : {}),
              ...(patch.fattening_id !== undefined
                ? { fattening_id: patch.fattening_id }
                : {}),
              ...(patch.size_category !== undefined
                ? { size_category: patch.size_category }
                : {}),
              ...(patch.litter_label !== undefined
                ? { litter_label: patch.litter_label }
                : {}),
              ...(patch.rabbit_name !== undefined
                ? { rabbit_name: patch.rabbit_name }
                : {}),
            })
          }
          idPrefix="weighing-edit"
          rabbitById={rabbitById}
          fatteningById={fatteningById}
          rabbitOptions={rabbitOptions}
          fatteningOptions={fatteningOptions}
        />
        <div className="weighing-form-field">
          <label htmlFor="weighing-edit-date">Дата зважування</label>
          <input
            id="weighing-edit-date"
            type="date"
            value={editingRecord.weighing_date}
            onChange={(e) =>
              setEditingRecord({
                ...editingRecord,
                weighing_date: e.target.value,
              })
            }
          />
        </div>
        <div className="weighing-form-field">
          <label htmlFor="weighing-edit-weight">Вага (г)</label>
          <input
            id="weighing-edit-weight"
            type="number"
            min="0"
            value={editingRecord.weight_g}
            onChange={(e) =>
              setEditingRecord({
                ...editingRecord,
                weight_g: Number(e.target.value),
              })
            }
          />
        </div>
        <input
          id="weighing-edit-notes"
          name="notes"
          placeholder="Нотатки"
          value={editingRecord.notes || ""}
          onChange={(e) =>
            setEditingRecord({ ...editingRecord, notes: e.target.value })
          }
          className="weighing-form-full"
        />
      </div>
      {editingRecord.weighing_type === "fattening" && (
        <label className="weighing-final-check">
          <input
            id="weighing-edit-is-final"
            name="is_final"
            type="checkbox"
            checked={editingRecord.is_final}
            onChange={(e) =>
              setEditingRecord({
                ...editingRecord,
                is_final: e.target.checked,
              })
            }
          />
          Фінальне зважування (забій, клітка звільняється під нову партію)
        </label>
      )}
      {error && <p className="weighing-error">{error}</p>}
      <div className="weighing-edit-actions">
        <button className="weighing-cancel-btn" onClick={() => onCancel()}>
          Скасувати
        </button>
        <button
          className="weighing-save-btn"
          onClick={onSave}
          disabled={saving}
        >
          {saving ? "Збереження..." : "Зберегти зміни"}
        </button>
      </div>
    </div>
  );
}
