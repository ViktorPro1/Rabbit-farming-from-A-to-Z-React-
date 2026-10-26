// Чисті розрахунки для розділу "Корм": корм, кількість голів, вага — по періодах.
// Нічого не знає про React і Supabase, тому легко перевіряється окремо.

export type FeedMode = "breeding" | "fattening";
export type FeedGrouping = "quarter" | "half" | "year";

export interface RecipeRaw {
  created_at: string;
  mode: FeedMode;
  total_kg: number | string;
}

export interface RabbitRaw {
  created_at: string;
  is_active: boolean | null;
  archive_date: string | null;
}

export interface FatteningRaw {
  cage_number: string;
  birth_date: string | null;
  created_at: string;
  is_active: boolean | null;
  slaughtered_at: string | null;
  slaughter_date: string | null;
  males: number | null;
  females: number | null;
  unknown: number | null;
}

export interface WeighingRaw {
  weighing_date: string;
  weight_g: number | string;
  weighing_type: FeedMode;
}

export interface FeedRawData {
  recipes: RecipeRaw[];
  rabbits: RabbitRaw[];
  fattening: FatteningRaw[];
  weighings: WeighingRaw[];
}

export interface FeedModeStats {
  kg: number;
  avgHeads: number;
  kgPerHead: number | null;
  gPerHeadDay: number | null;
  avgWeightKg: number | null;
  weighingsCount: number;
}

export interface FeedPeriod {
  key: string;
  label: string;
  ongoing: boolean;
  totalKg: number;
  breeding: FeedModeStats;
  fattening: FeedModeStats;
}

interface Interval {
  s: string; // перший день, коли голови були
  e: string; // останній день
  n: number; // скільки голів
}

const DAY_MS = 86400000;

const pad = (n: number) => String(n).padStart(2, "0");

export function toYmd(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function parseYmd(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

// Кількість днів між двома датами включно
function daysInclusive(a: string, b: string): number {
  return Math.round((parseYmd(b).getTime() - parseYmd(a).getTime()) / DAY_MS) + 1;
}

const maxStr = (a: string, b: string) => (a > b ? a : b);
const minStr = (a: string, b: string) => (a < b ? a : b);

function overlapDays(i: Interval, ps: string, pe: string): number {
  const lo = maxStr(i.s, ps);
  const hi = minStr(i.e, pe);
  return lo > hi ? 0 : daysInclusive(lo, hi);
}

function breedingIntervals(rabbits: RabbitRaw[], today: string): Interval[] {
  return rabbits.map((r) => ({
    s: r.created_at.slice(0, 10),
    e: r.is_active === false ? (r.archive_date ?? today) : today,
    n: 1,
  }));
}

function fatteningIntervals(rows: FatteningRaw[], today: string): Interval[] {
  // Запис клітки розбивається при частковому забої, тому початок беремо
  // за найранішим записом тієї ж клітки з тією ж датою народження.
  const firstCreated = new Map<string, string>();
  for (const f of rows) {
    if (!f.birth_date) continue;
    const key = `${f.cage_number}|${f.birth_date}`;
    const created = f.created_at.slice(0, 10);
    const prev = firstCreated.get(key);
    if (!prev || created < prev) firstCreated.set(key, created);
  }

  return rows.map((f) => {
    const own = f.created_at.slice(0, 10);
    const s = f.birth_date
      ? (firstCreated.get(`${f.cage_number}|${f.birth_date}`) ?? own)
      : own;
    const e =
      f.slaughtered_at ??
      (f.is_active === false ? (f.slaughter_date ?? s) : today);
    const n = (f.males ?? 0) + (f.females ?? 0) + (f.unknown ?? 0);
    return { s, e, n };
  });
}

interface Bucket {
  key: string;
  label: string;
  start: string;
  end: string;
}

function buildBuckets(
  first: string,
  today: string,
  grouping: FeedGrouping,
): Bucket[] {
  const size = grouping === "quarter" ? 3 : grouping === "half" ? 6 : 12;
  const year0 = Number(first.slice(0, 4));
  const month0 = Number(first.slice(5, 7)) - 1;
  let monthIndex = year0 * 12 + Math.floor(month0 / size) * size;

  const buckets: Bucket[] = [];
  for (;;) {
    const y = Math.floor(monthIndex / 12);
    const m = monthIndex % 12;
    const start = toYmd(new Date(y, m, 1));
    if (start > today) break;
    const end = toYmd(new Date(y, m + size, 0));
    const idx = Math.floor(m / size) + 1;
    const label =
      grouping === "quarter"
        ? `${idx} кв. ${y}`
        : grouping === "half"
          ? `${idx} півріччя ${y}`
          : `${y}`;
    buckets.push({ key: `${grouping}-${y}-${idx}`, label, start, end });
    monthIndex += size;
  }
  return buckets;
}

export function computeFeedPeriods(
  raw: FeedRawData,
  grouping: FeedGrouping,
  today: string,
): FeedPeriod[] {
  const recipes = raw.recipes.map((r) => ({
    date: toYmd(new Date(r.created_at)),
    mode: r.mode,
    kg: Number(r.total_kg) || 0,
  }));
  if (recipes.length === 0) return [];

  const firstFeed: Partial<Record<FeedMode, string>> = {};
  for (const r of recipes) {
    const prev = firstFeed[r.mode];
    if (!prev || r.date < prev) firstFeed[r.mode] = r.date;
  }

  const intervals: Record<FeedMode, Interval[]> = {
    breeding: breedingIntervals(raw.rabbits, today),
    fattening: fatteningIntervals(raw.fattening, today),
  };

  const allDates = recipes.map((r) => r.date).sort();
  const buckets = buildBuckets(allDates[0], today, grouping);

  const modeStats = (mode: FeedMode, b: Bucket): FeedModeStats => {
    const kg = recipes
      .filter((r) => r.mode === mode && r.date >= b.start && r.date <= b.end)
      .reduce((sum, r) => sum + r.kg, 0);

    // Голів рахуємо лише за дні, коли вже велася картка корму цього типу
    // і період уже настав.
    const feedStart = firstFeed[mode];
    let avgHeads = 0;
    let effDays = 0;
    if (feedStart) {
      const effStart = maxStr(b.start, feedStart);
      const effEnd = minStr(b.end, today);
      if (effStart <= effEnd) {
        effDays = daysInclusive(effStart, effEnd);
        const headDays = intervals[mode].reduce(
          (sum, i) => sum + i.n * overlapDays(i, effStart, effEnd),
          0,
        );
        avgHeads = headDays / effDays;
      }
    }

    const weights = raw.weighings
      .filter(
        (w) =>
          w.weighing_type === mode &&
          w.weighing_date >= b.start &&
          w.weighing_date <= b.end,
      )
      .map((w) => Number(w.weight_g))
      .filter((g) => Number.isFinite(g) && g > 0);

    return {
      kg,
      avgHeads,
      kgPerHead: avgHeads > 0 ? kg / avgHeads : null,
      gPerHeadDay:
        avgHeads > 0 && effDays > 0 ? (kg * 1000) / (avgHeads * effDays) : null,
      avgWeightKg: weights.length
        ? weights.reduce((a, g) => a + g, 0) / weights.length / 1000
        : null,
      weighingsCount: weights.length,
    };
  };

  return buckets
    .map((b) => {
      const breeding = modeStats("breeding", b);
      const fattening = modeStats("fattening", b);
      return {
        key: b.key,
        label: b.label,
        ongoing: b.end > today,
        totalKg: breeding.kg + fattening.kg,
        breeding,
        fattening,
      };
    })
    .filter((p) => p.totalKg > 0)
    .reverse();
}
