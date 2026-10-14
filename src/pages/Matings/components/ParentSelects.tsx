import type { Mating, Rabbit } from "../types";
import RabbitOptions from "./RabbitOptions";

interface Props {
  maleValue: string;
  femaleValue: string;
  onMaleChange: (value: string) => void;
  onFemaleChange: (value: string) => void;
  mating: Mating;
  idPrefix: string;
  males: Rabbit[];
  females: Rabbit[];
}

/** Вибір фактичних батьків окролу (за замовчуванням — з самої злучки). */
export default function ParentSelects({
  maleValue,
  femaleValue,
  onMaleChange,
  onFemaleChange,
  mating,
  idPrefix,
  males,
  females,
}: Props) {
  return (
    <>
      <div className="matings-form-field">
        <label htmlFor={`${idPrefix}-male`}>Кролик цього окролу ♂</label>
        <select
          id={`${idPrefix}-male`}
          value={maleValue}
          onChange={(e) => onMaleChange(e.target.value)}
        >
          <option value="">
            {mating.male?.name
              ? `За замовч.: ${mating.male.name}${mating.male.breed ? ` (${mating.male.breed})` : ""}`
              : "Оберіть кролика"}
          </option>
          <RabbitOptions rabbits={males} />
        </select>
      </div>
      <div className="matings-form-field">
        <label htmlFor={`${idPrefix}-female`}>Крольчиха цього окролу ♀</label>
        <select
          id={`${idPrefix}-female`}
          value={femaleValue}
          onChange={(e) => onFemaleChange(e.target.value)}
        >
          <option value="">
            {mating.female?.name
              ? `За замовч.: ${mating.female.name}${mating.female.breed ? ` (${mating.female.breed})` : ""}`
              : "Оберіть крольчиху"}
          </option>
          <RabbitOptions rabbits={females} />
        </select>
      </div>
    </>
  );
}
