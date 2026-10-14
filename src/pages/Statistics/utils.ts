import { MONTH_NAMES_FULL, MONTH_NAMES_SHORT } from "./constants";
import type { ClosedCycle, FatteningRow, WeighingRow } from "./types";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

// Медаль для місць 1–3, далі "#N"
export function medalFor(rank: number): string {
  return rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;
}

// Кількість голів у записі (самці + самки + невизначені)
export function headCount(r: {
  males?: number | null;
  females?: number | null;
  unknown?: number | null;
}): number {
  return (r.males || 0) + (r.females || 0) + (r.unknown || 0);
}

// "2026-06" -> "Червень 2026"
export function monthLabelFull(key: string): string {
  const [y, m] = key.split("-");
  return `${MONTH_NAMES_FULL[parseInt(m) - 1]} ${y}`;
}

// "2026-06" -> "Чер 26"
export function monthLabelShort(key: string): string {
  const [y, m] = key.split("-");
  return `${MONTH_NAMES_SHORT[parseInt(m) - 1]} ${y.slice(2)}`;
}

// ── Утиліти для вкладки «Зважування» (агреговано по всіх клітках) ──

export function headsOf(f: FatteningRow): number {
  return headCount(f);
}

export function formatWeighingKg(g: number): string {
  return `${(g / 1000).toLocaleString("uk-UA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} кг`;
}

export function sortByWeighingDate(list: WeighingRow[]): WeighingRow[] {
  return list
    .slice()
    .sort(
      (a, b) =>
        new Date(a.weighing_date).getTime() -
        new Date(b.weighing_date).getTime(),
    );
}

// Цикл — серія зважувань клітки від заселення до фінального (is_final)
// перед забоєм. Та сама логіка, що й у Weighing.tsx, але зібрана одразу
// по всіх клітках відгодівлі, а не по одній.
export function buildClosedCyclesForCage(
  cage: string,
  sorted: WeighingRow[],
): ClosedCycle[] {
  const cycles: ClosedCycle[] = [];
  let current: WeighingRow[] = [];

  sorted.forEach((r) => {
    current.push(r);
    if (r.is_final) {
      const start = current[0].weighing_date;
      const end = current[current.length - 1].weighing_date;
      const durationDays = Math.round(
        (new Date(end).getTime() - new Date(start).getTime()) / MS_PER_DAY,
      );
      const finals = current.filter((x) => x.is_final);
      const finalAvgWeight = Math.round(
        finals.reduce((s, x) => s + x.weight_g, 0) / finals.length,
      );
      cycles.push({
        cage,
        startDate: start,
        endDate: end,
        durationDays,
        finalAvgWeight,
        monthKey: end.slice(0, 7),
      });
      current = [];
    }
  });

  return cycles;
}

// Групування елементів по місяцю ("2026-06") за вибраною датою
export function groupByMonth<T>(
  items: T[],
  dateOf: (item: T) => string | null | undefined,
): Record<string, T[]> {
  const byMonth: Record<string, T[]> = {};
  items.forEach((item) => {
    const date = dateOf(item);
    if (!date) return;
    const key = date.slice(0, 7);
    if (!byMonth[key]) byMonth[key] = [];
    byMonth[key].push(item);
  });
  return byMonth;
}

// Ключі місяців від новішого до старішого
export function monthsDesc(byMonth: Record<string, unknown>): string[] {
  return Object.keys(byMonth).sort((a, b) => b.localeCompare(a));
}
