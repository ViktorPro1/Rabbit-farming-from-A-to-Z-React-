import { SIZE_CATEGORY_LABEL } from "../constants";
import type {
  FatteningOption,
  RabbitOption,
  SizeCategory,
  TypeSpecificPatch,
  TypeSpecificValues,
} from "../types";

// Поля, що залежать від типу зважування: вибір кролика (племінне) або клітки
// (відгодівля) і категорія породи. Спільні для форм додавання й редагування.
export default function TypeSpecificFields({
  values,
  onChange,
  idPrefix,
  rabbitById,
  fatteningById,
  rabbitOptions,
  fatteningOptions,
}: {
  values: TypeSpecificValues;
  onChange: (patch: TypeSpecificPatch) => void;
  idPrefix: string;
  rabbitById: Record<string, RabbitOption>;
  fatteningById: Record<string, FatteningOption>;
  rabbitOptions: RabbitOption[];
  fatteningOptions: FatteningOption[];
}) {
  return (
    <>
      {values.weighing_type === "breeding" ? (
        <div className="weighing-form-field">
          <label htmlFor={`${idPrefix}-rabbit`}>Кролик з реєстру *</label>
          <select
            id={`${idPrefix}-rabbit`}
            value={values.rabbit_id}
            onChange={(e) => {
              const id = e.target.value;
              const r = rabbitById[id];
              onChange({
                rabbit_id: id,
                rabbit_name: r ? r.name : "",
                litter_label: r
                  ? r.cage_number
                    ? `Клітка ${r.cage_number}`
                    : r.name
                  : "",
              });
            }}
          >
            <option value="">Оберіть кролика</option>
            {rabbitOptions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
                {r.cage_number ? ` (кл.${r.cage_number})` : ""}
                {!r.birth_date ? " · без дати народження" : ""}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="weighing-form-field">
          <label htmlFor={`${idPrefix}-fattening`}>Клітка відгодівлі *</label>
          <select
            id={`${idPrefix}-fattening`}
            value={values.fattening_id}
            onChange={(e) => {
              const id = e.target.value;
              const f = fatteningById[id];
              onChange({
                fattening_id: id,
                litter_label: f ? `Клітка ${f.cage_number}` : "",
              });
            }}
          >
            <option value="">Оберіть клітку</option>
            {fatteningOptions.map((f) => (
              <option key={f.id} value={f.id}>
                Клітка {f.cage_number}
                {f.birth_date
                  ? ` · нар. ${new Date(f.birth_date).toLocaleDateString("uk-UA")}`
                  : " · без дати народження"}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="weighing-form-field">
        <label htmlFor={`${idPrefix}-size-category`}>
          Категорія породи (для порівняння з нормою)
        </label>
        <select
          id={`${idPrefix}-size-category`}
          value={values.size_category}
          onChange={(e) =>
            onChange({ size_category: e.target.value as SizeCategory })
          }
        >
          <option value="meat">{SIZE_CATEGORY_LABEL.meat}</option>
          <option value="large">{SIZE_CATEGORY_LABEL.large}</option>
          <option value="decorative">{SIZE_CATEGORY_LABEL.decorative}</option>
        </select>
      </div>
    </>
  );
}
