// Розрахунок собівартості. Чиста логіка: без React і без запитів до бази,
// щоб її можна було перевірити тестами (costAnalysis.test.ts).
//
// Принцип: витрати в таблиці `expenses` не прив'язані до партій, тому вони
// розподіляються пропорційно «голово-дням» (кількість голів × доби на фермі).
// Це оцінка, а не точний облік.

export type CostGroup = "feed" | "vet" | "other";

export interface ExpenseInput {
  category: string;
  amount: number;
  expense_date: string;
}

export interface FatteningInput {
  id: string;
  cage_number: string;
  males: number | null;
  females: number | null;
  unknown: number | null;
  created_at: string;
  slaughtered_at: string | null;
  is_active: boolean | null;
  // Вага туші вказується за ОДНУ голову (як і на сторінці Фінансів).
  carcass_weight_kg: number | null;
}

export interface RabbitInput {
  id: string;
  name: string;
  cage_number: string | null;
  is_active: boolean | null;
  created_at: string | null;
  archive_date: string | null;
}

export interface WeighingInput {
  fattening_id: string | null;
  rabbit_id: string | null;
  weighing_date: string;
  weight_g: number;
}

export type WeightBasis = "live" | "carcass";

export interface CostResult {
  id: string;
  label: string;
  heads: number;
  start: string | null;
  end: string | null;
  // Кількість діб від початку до кінця (включно); null, якщо період невідомий.
  days: number | null;
  isActive: boolean;
  feedCost: number;
  vetCost: number;
  otherCost: number;
  totalCost: number;
  weightKg: number | null;
  weightBasis: WeightBasis | null;
  costPerHead: number | null;
  costPerKg: number | null;
  costPerDay: number | null;
  // Причина, чому показники не розраховано (для підпису в інтерфейсі).
  missing: string | null;
}

export interface GroupSummary {
  group: CostGroup;
  spent: number;
  toBatches: number;
  toRabbits: number;
  unallocated: number;
}

export interface CostAnalysisResult {
  batches: CostResult[];
  rabbits: CostResult[];
  groups: GroupSummary[];
}

export interface CostOptions {
  includeEquipment: boolean;
  // Сьогоднішня дата у форматі YYYY-MM-DD (передається ззовні для тестів).
  today: string;
}

interface Entity {
  kind: "batch" | "rabbit";
  id: string;
  label: string;
  heads: number;
  start: string | null;
  end: string | null;
  isActive: boolean;
  carcassKgPerHead: number | null;
}

const MS_PER_DAY = 86400000;

// Номер доби для дати YYYY-MM-DD (або ISO-часу). Через UTC, щоб не залежати
// від переходу на літній/зимовий час.
export function dayNumber(date: string): number {
  const [y, m, d] = date.slice(0, 10).split("-").map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / MS_PER_DAY);
}

function toNumber(value: number | string | null | undefined): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function groupOfCategory(
  category: string,
  includeEquipment: boolean,
): CostGroup | null {
  if (category === "feed") return "feed";
  if (category === "vet") return "vet";
  if (category === "equipment") return includeEquipment ? "other" : null;
  return "other";
}

function isValidPeriod(e: Entity): boolean {
  return (
    e.start !== null && e.end !== null && dayNumber(e.end) >= dayNumber(e.start)
  );
}

function overlapDays(
  e: Entity,
  windowStart: number,
  windowEnd: number,
): number {
  if (!isValidPeriod(e)) return 0;
  const from = Math.max(dayNumber(e.start as string), windowStart);
  const to = Math.min(dayNumber(e.end as string), windowEnd);
  return Math.max(0, to - from + 1);
}

// Середня вага (кг) за ОСТАННЮ дату зважування серед переданих записів.
function latestAverageKg(records: WeighingInput[]): number | null {
  if (records.length === 0) return null;
  const latest = records.reduce(
    (max, r) => (r.weighing_date > max ? r.weighing_date : max),
    records[0].weighing_date,
  );
  const sameDay = records.filter((r) => r.weighing_date === latest);
  const avgG =
    sameDay.reduce((s, r) => s + toNumber(r.weight_g), 0) / sameDay.length;
  return avgG > 0 ? avgG / 1000 : null;
}

export function buildCostAnalysis(
  expenses: ExpenseInput[],
  fattening: FatteningInput[],
  rabbits: RabbitInput[],
  weighings: WeighingInput[],
  options: CostOptions,
): CostAnalysisResult {
  const todayNum = dayNumber(options.today);

  // ── 1. Сутності: партії відгодівлі та кролі реєстру ──
  const entities: Entity[] = [];

  fattening.forEach((f) => {
    const heads =
      toNumber(f.males) + toNumber(f.females) + toNumber(f.unknown);
    const isActive = f.is_active === true;
    // Кінець періоду: дата забою або, для активної партії, сьогодні.
    const end = f.slaughtered_at ?? (isActive ? options.today : null);
    entities.push({
      kind: "batch",
      id: f.id,
      label: `Клітка ${f.cage_number}`,
      heads,
      start: f.created_at ? f.created_at.slice(0, 10) : null,
      end,
      isActive,
      carcassKgPerHead:
        f.carcass_weight_kg && toNumber(f.carcass_weight_kg) > 0
          ? toNumber(f.carcass_weight_kg)
          : null,
    });
  });

  rabbits.forEach((r) => {
    const isActive = r.is_active !== false;
    // Для архівних кролів кінець періоду — дата архівування; для активних —
    // сьогодні (archive_date у базі має значення за замовчуванням, тому для
    // активних його не використовуємо).
    const end = isActive ? options.today : r.archive_date;
    entities.push({
      kind: "rabbit",
      id: r.id,
      label: r.name,
      heads: 1,
      start: r.created_at ? r.created_at.slice(0, 10) : null,
      end,
      isActive,
      carcassKgPerHead: null,
    });
  });

  // ── 2. Групи витрат ──
  const groupNames: CostGroup[] = ["feed", "vet", "other"];
  const spentByGroup: Record<CostGroup, number> = { feed: 0, vet: 0, other: 0 };
  const firstDateByGroup: Partial<Record<CostGroup, number>> = {};
  const lastDateByGroup: Partial<Record<CostGroup, number>> = {};

  expenses.forEach((e) => {
    const g = groupOfCategory(e.category, options.includeEquipment);
    if (!g || !e.expense_date) return;
    const amount = toNumber(e.amount);
    if (amount <= 0) return;
    const d = dayNumber(e.expense_date);
    spentByGroup[g] += amount;
    if (firstDateByGroup[g] === undefined || d < (firstDateByGroup[g] as number))
      firstDateByGroup[g] = d;
    if (lastDateByGroup[g] === undefined || d > (lastDateByGroup[g] as number))
      lastDateByGroup[g] = d;
  });

  // ── 3. Ставка за голово-добу для кожної групи та розподіл ──
  const costs: Record<string, Record<CostGroup, number>> = {};
  entities.forEach((e) => {
    costs[`${e.kind}:${e.id}`] = { feed: 0, vet: 0, other: 0 };
  });
  const summaries: GroupSummary[] = [];

  groupNames.forEach((g) => {
    const spent = spentByGroup[g];
    const first = firstDateByGroup[g];
    if (spent <= 0 || first === undefined) {
      summaries.push({
        group: g,
        spent: 0,
        toBatches: 0,
        toRabbits: 0,
        unallocated: 0,
      });
      return;
    }
    // Вікно розрахунку: від першої витрати групи до сьогодні (або до
    // останньої витрати, якщо вона пізніша за сьогодні).
    const windowStart = first;
    const windowEnd = Math.max(todayNum, lastDateByGroup[g] as number);

    let totalHeadDays = 0;
    entities.forEach((e) => {
      totalHeadDays += e.heads * overlapDays(e, windowStart, windowEnd);
    });

    let toBatches = 0;
    let toRabbits = 0;
    if (totalHeadDays > 0) {
      const rate = spent / totalHeadDays;
      entities.forEach((e) => {
        const share = e.heads * overlapDays(e, windowStart, windowEnd) * rate;
        costs[`${e.kind}:${e.id}`][g] = share;
        if (e.kind === "batch") toBatches += share;
        else toRabbits += share;
      });
    }
    summaries.push({
      group: g,
      spent,
      toBatches,
      toRabbits,
      unallocated: totalHeadDays > 0 ? 0 : spent,
    });
  });

  // ── 4. Результат по кожній сутності ──
  const buildResult = (e: Entity): CostResult => {
    const c = costs[`${e.kind}:${e.id}`];
    const totalCost = c.feed + c.vet + c.other;
    const valid = isValidPeriod(e);
    const days = valid
      ? dayNumber(e.end as string) - dayNumber(e.start as string) + 1
      : null;

    let weightKg: number | null = null;
    let weightBasis: WeightBasis | null = null;
    if (e.kind === "batch") {
      const avg = latestAverageKg(
        weighings.filter((w) => w.fattening_id === e.id),
      );
      if (avg !== null && e.heads > 0) {
        weightKg = avg * e.heads;
        weightBasis = "live";
      } else if (e.carcassKgPerHead !== null && e.heads > 0) {
        weightKg = e.carcassKgPerHead * e.heads;
        weightBasis = "carcass";
      }
    } else {
      const avg = latestAverageKg(
        weighings.filter((w) => w.rabbit_id === e.id),
      );
      if (avg !== null) {
        weightKg = avg;
        weightBasis = "live";
      }
    }

    let missing: string | null = null;
    if (e.heads <= 0) missing = "У партії не вказано кількість голів.";
    else if (!valid)
      missing =
        e.kind === "batch"
          ? "Немає дати забою, тому період відгодівлі невідомий."
          : "Немає дати початку або кінця періоду.";
    else if (totalCost <= 0) missing = "Для цього періоду немає витрат.";

    const hasCost = missing === null;
    return {
      id: e.id,
      label: e.label,
      heads: e.heads,
      start: e.start,
      end: e.end,
      days,
      isActive: e.isActive,
      feedCost: c.feed,
      vetCost: c.vet,
      otherCost: c.other,
      totalCost,
      weightKg,
      weightBasis,
      costPerHead: hasCost ? totalCost / e.heads : null,
      costPerKg:
        hasCost && weightKg !== null && weightKg > 0
          ? totalCost / weightKg
          : null,
      costPerDay: hasCost && days ? totalCost / days : null,
      missing,
    };
  };

  return {
    batches: entities.filter((e) => e.kind === "batch").map(buildResult),
    rabbits: entities.filter((e) => e.kind === "rabbit").map(buildResult),
    groups: summaries,
  };
}
