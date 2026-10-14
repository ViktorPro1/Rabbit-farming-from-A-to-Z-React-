import type { Mating } from "../types";
import ArchivedLitterBlock from "./ArchivedLitterBlock";
import MatingDates from "./MatingDates";
import MatingPair from "./MatingPair";

interface Props {
  mating: Mating;
  getRabbitName: (id: string | null) => string;
  onUnarchive: (id: string) => void;
}

/** Картка злучки в архіві: усе розгорнуто, єдина дія — повернути з архіву. */
export default function ArchivedMatingCard({
  mating: m,
  getRabbitName,
  onUnarchive,
}: Props) {
  return (
    <div className="mating-card mating-card-archived">
      <div className="mating-card-top">
        <MatingPair mating={m} />
        <div className="mating-card-btns">
          <button
            className="mating-unarchive-btn"
            onClick={() => onUnarchive(m.id)}
          >
            Повернути з архіву
          </button>
        </div>
      </div>

      <MatingDates mating={m} />

      {m.notes && <p className="mating-notes">{m.notes}</p>}

      {(m.litters || []).map((l) => (
        <ArchivedLitterBlock
          key={l.id}
          litter={l}
          getRabbitName={getRabbitName}
        />
      ))}
    </div>
  );
}
