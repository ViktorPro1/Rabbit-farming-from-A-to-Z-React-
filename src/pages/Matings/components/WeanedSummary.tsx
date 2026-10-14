import type { Litter } from "../types";

interface Props {
  litter: Litter;
}

/** Підсумок відлучення: дата та розподіл по клітках (нічого, якщо не відлучено). */
export default function WeanedSummary({ litter: l }: Props) {
  if (!l.weaned_date) return null;
  return (
    <div className="litter-weaned">
      <span>
        ✂️ Відлучено:{" "}
        <strong>{new Date(l.weaned_date).toLocaleDateString("uk-UA")}</strong>
      </span>
      {l.weaned_males > 0 && (
        <span>
          ♂{" "}
          {l.weaned_males_cage_2
            ? Math.max(l.weaned_males - (l.weaned_males_2 || 0), 0)
            : l.weaned_males}{" "}
          гол. → кл. {l.weaned_males_cage}
          {l.weaned_males_cage_2 &&
            l.weaned_males_2 > 0 &&
            ` · ${l.weaned_males_2} гол. → кл. ${l.weaned_males_cage_2}`}
        </span>
      )}
      {l.weaned_females > 0 && (
        <span>
          ♀{" "}
          {l.weaned_females_cage_2
            ? Math.max(l.weaned_females - (l.weaned_females_2 || 0), 0)
            : l.weaned_females}{" "}
          гол. → кл. {l.weaned_females_cage}
          {l.weaned_females_cage_2 &&
            l.weaned_females_2 > 0 &&
            ` · ${l.weaned_females_2} гол. → кл. ${l.weaned_females_cage_2}`}
        </span>
      )}
    </div>
  );
}
