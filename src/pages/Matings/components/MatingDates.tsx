import type { Mating } from "../types";
import { schemeLabel } from "../utils";

interface Props {
  mating: Mating;
  /** Сховати дати, коли вони показані в іншому блоці */
  hideDates?: boolean;
}

/** Дати, клітки і схема злучки (спільний блок для активних і архівних). */
export default function MatingDates({ mating: m, hideDates = false }: Props) {
  return (
    <div className="mating-dates">
      {!hideDates && (
        <>
          <span>
            📅 Злучка:{" "}
            <strong>
              {new Date(m.mating_date).toLocaleDateString("uk-UA")}
            </strong>
          </span>
          {m.control_date && (
            <span>
              🔍 Контроль:{" "}
              <strong>
                {new Date(m.control_date).toLocaleDateString("uk-UA")}
              </strong>
            </span>
          )}
          {m.expected_birth && (
            <span>
              🗓 Очік. окріл:{" "}
              <strong>
                {new Date(m.expected_birth).toLocaleDateString("uk-UA")}
              </strong>
            </span>
          )}
        </>
      )}
      {m.male_cage && (
        <span>
          🏠 Кролик кл.: <strong>{m.male_cage}</strong>
        </span>
      )}
      {m.female_cage && (
        <span>
          🏠 Крольчиха кл.: <strong>{m.female_cage}</strong>
        </span>
      )}
      <span>
        🔁 Схема: <strong>{schemeLabel(m.breeding_scheme)}</strong>
      </span>
    </div>
  );
}
