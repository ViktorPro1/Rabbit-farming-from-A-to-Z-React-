import type { Mating } from "../types";

interface Props {
  mating: Mating;
}

/** Підпис пари: ♀ крольчиха × ♂ кролик. */
export default function MatingPair({ mating: m }: Props) {
  return (
    <span className="mating-pair">
      ♀ {m.female?.name}
      {m.female?.breed ? ` (${m.female.breed})` : ""} {"×"} ♂ {m.male?.name}
      {m.male?.breed ? ` (${m.male.breed})` : ""}
    </span>
  );
}
