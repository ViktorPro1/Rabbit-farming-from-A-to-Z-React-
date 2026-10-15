import type { WeighingRecord } from "./types";

export const MS_PER_DAY = 1000 * 60 * 60 * 24;

// Записи за зростанням дати зважування (оригінал не змінюється)
export function sortByWeighingDate(list: WeighingRecord[]): WeighingRecord[] {
  return [...list].sort(
    (a, b) =>
      new Date(a.weighing_date).getTime() - new Date(b.weighing_date).getTime(),
  );
}

// Групування по гніздах / клітках (ключ — litter_label)
export function groupByLitter(
  list: WeighingRecord[],
): Record<string, WeighingRecord[]> {
  return list.reduce<Record<string, WeighingRecord[]>>((acc, r) => {
    const key = r.litter_label || "Без назви";
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});
}

export function formatKg(kg: number): string {
  return kg.toLocaleString("uk-UA", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

export function dailyGain(prev: WeighingRecord, curr: WeighingRecord): string {
  const days =
    (new Date(curr.weighing_date).getTime() -
      new Date(prev.weighing_date).getTime()) /
    MS_PER_DAY;
  if (days <= 0) return "—";
  const gain = (curr.weight_g - prev.weight_g) / days;
  return `${gain >= 0 ? "+" : ""}${gain.toFixed(1)} г/добу`;
}
