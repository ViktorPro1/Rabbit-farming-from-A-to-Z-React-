import type { Rabbit } from "../types";

interface Props {
  rabbits: Rabbit[];
}

/** Список <option> для вибору кролика у <select>. */
export default function RabbitOptions({ rabbits }: Props) {
  return (
    <>
      {rabbits.map((r) => (
        <option key={r.id} value={r.id}>
          {r.name}
          {r.breed ? ` (${r.breed})` : ""}
          {r.cage_number ? ` кл.${r.cage_number}` : ""}
        </option>
      ))}
    </>
  );
}
