// ── Дати ──
// Усі дати в базі це рядки YYYY-MM-DD. Рахуємо через UTC-північ, щоб літній
// і зимовий час не давали зсуву на день.

export const DAY_MS = 86_400_000;

export function parseISO(iso: string): number {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!match) return NaN;
  return Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

/** Різниця в днях: to мінус from. */
export function daysBetween(from: string, to: string): number {
  return Math.round((parseISO(to) - parseISO(from)) / DAY_MS);
}

export function addDays(iso: string, days: number): string {
  return new Date(parseISO(iso) + days * DAY_MS).toISOString().slice(0, 10);
}

/** Сьогоднішня дата за київським часом у форматі YYYY-MM-DD. */
export function todayKyiv(): string {
  // Europe/Kiev: ця назва зони підтримується в усіх браузерах.
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Kiev" }).format(
    new Date(),
  );
}

/** 2026-11-15 → 15.11.2026 */
export function formatDateUA(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!match) return iso;
  return `${match[3]}.${match[2]}.${match[1]}`;
}

/** Правильна форма слова «день» для числа. */
export function pluralDays(n: number): string {
  const abs = Math.abs(n);
  const last = abs % 10;
  const last2 = abs % 100;
  if (last2 >= 11 && last2 <= 14) return "днів";
  if (last === 1) return "день";
  if (last >= 2 && last <= 4) return "дні";
  return "днів";
}

/** Підпис «через N днів / завтра / сьогодні / прострочено». */
export function daysLeftLabel(daysLeft: number): string {
  if (daysLeft < 0) {
    const late = Math.abs(daysLeft);
    return `прострочено на ${late} ${pluralDays(late)}`;
  }
  if (daysLeft === 0) return "сьогодні";
  if (daysLeft === 1) return "завтра";
  return `через ${daysLeft} ${pluralDays(daysLeft)}`;
}
