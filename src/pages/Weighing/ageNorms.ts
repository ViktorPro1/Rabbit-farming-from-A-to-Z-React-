import { AGE_WEIGHT_TABLE } from "./constants";
import { MS_PER_DAY } from "./utils";
import type { GaugeZone, SizeCategory } from "./types";

export function ageDaysAt(birthDate: string, atDate: string): number {
  const b = new Date(birthDate).getTime();
  const a = new Date(atDate).getTime();
  return Math.round((a - b) / MS_PER_DAY);
}

// Лінійна інтерполяція між найближчими рядками таблиці за віком у днях.
export function getExpectedRange(
  ageDays: number,
  category: SizeCategory,
): [number, number] {
  const rows = AGE_WEIGHT_TABLE;
  const clampedAge = Math.max(0, ageDays);

  if (clampedAge <= rows[0].ageDays) return rows[0][category];
  if (clampedAge >= rows[rows.length - 1].ageDays) {
    return rows[rows.length - 1][category];
  }

  for (let i = 0; i < rows.length - 1; i++) {
    const a = rows[i];
    const b = rows[i + 1];
    if (clampedAge >= a.ageDays && clampedAge <= b.ageDays) {
      const t = (clampedAge - a.ageDays) / (b.ageDays - a.ageDays);
      const min = a[category][0] + t * (b[category][0] - a[category][0]);
      const max = a[category][1] + t * (b[category][1] - a[category][1]);
      return [Math.round(min), Math.round(max)];
    }
  }
  return rows[rows.length - 1][category];
}

// Очікуваний приріст г/добу — нахил кривої середньої ваги в цьому віці.
export function getExpectedDailyGain(
  ageDays: number,
  category: SizeCategory,
): number {
  const dt = 5;
  const [lo1, hi1] = getExpectedRange(Math.max(0, ageDays - dt / 2), category);
  const [lo2, hi2] = getExpectedRange(ageDays + dt / 2, category);
  const mid1 = (lo1 + hi1) / 2;
  const mid2 = (lo2 + hi2) / 2;
  return (mid2 - mid1) / dt;
}

export function zoneFromRange(
  value: number,
  [min, max]: [number, number],
): GaugeZone {
  if (value < min) {
    return value >= min * 0.85 ? "yellow" : "red";
  }
  if (value > max) {
    return value <= max * 1.15 ? "yellow" : "red";
  }
  return "green";
}

// Для приросту важливіше не відставати від норми — надмірно швидкий
// приріст не позначаємо як проблему.
export function zoneForGain(actual: number, expected: number): GaugeZone {
  if (expected <= 0) return "unknown";
  const ratio = actual / expected;
  if (ratio >= 0.85) return "green";
  if (ratio >= 0.6) return "yellow";
  return "red";
}

export function mostFrequentCategory(cats: SizeCategory[]): SizeCategory {
  const counts: Record<string, number> = {};
  cats.forEach((c) => {
    counts[c] = (counts[c] || 0) + 1;
  });
  let best: SizeCategory = "meat";
  let bestCount = -1;
  (Object.keys(counts) as SizeCategory[]).forEach((c) => {
    if (counts[c] > bestCount) {
      best = c;
      bestCount = counts[c];
    }
  });
  return best;
}
