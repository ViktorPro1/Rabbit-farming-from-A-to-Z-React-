import type { Litter } from "../types";

interface Props {
  litter: Litter;
  getRabbitName: (id: string | null) => string;
}

/** Фактичні батьки, якщо відрізняються від злучки. */
export default function LitterActualParents({
  litter: l,
  getRabbitName,
}: Props) {
  if (!l.actual_male_id && !l.actual_female_id) return null;
  return (
    <div className="litter-actual-parents">
      {l.actual_male_id && <span>♂ {getRabbitName(l.actual_male_id)}</span>}
      {l.actual_female_id && <span>♀ {getRabbitName(l.actual_female_id)}</span>}
    </div>
  );
}
