import { FAILURE_LABELS } from "../constants";

interface Props {
  value: string;
  onChange: (value: string) => void;
  idPrefix: string;
}

/** Два взаємовиключні прапорці: окріл не відбувся / малюки завмерли. */
export default function FailureChecks({ value, onChange, idPrefix }: Props) {
  return (
    <div className="matings-form-full litter-failure-checks">
      <label htmlFor={`${idPrefix}-failure-empty`}>
        <input
          id={`${idPrefix}-failure-empty`}
          type="checkbox"
          checked={value === "empty"}
          onChange={(e) => onChange(e.target.checked ? "empty" : "")}
        />
        {FAILURE_LABELS.empty}
      </label>
      <label htmlFor={`${idPrefix}-failure-lost`}>
        <input
          id={`${idPrefix}-failure-lost`}
          type="checkbox"
          checked={value === "lost"}
          onChange={(e) => onChange(e.target.checked ? "lost" : "")}
        />
        {FAILURE_LABELS.lost}
      </label>
    </div>
  );
}
