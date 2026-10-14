import type { Litter } from "../types";

interface Props {
  litter: Litter;
}

/** Скільки народилось, живих і мертвих (показується, коли є дата окролу). */
export default function LitterStats({ litter: l }: Props) {
  return (
    <div className="litter-stats">
      <span>
        Народилось: <strong>{l.total_born}</strong>
      </span>
      <span>
        Живих: <strong>{l.alive}</strong>
      </span>
      <span>
        Мертвих: <strong>{l.dead}</strong>
      </span>
    </div>
  );
}
