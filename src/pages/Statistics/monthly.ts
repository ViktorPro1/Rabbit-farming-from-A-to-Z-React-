import { headCount } from "./utils";
import type {
  LitterRow,
  MonthlyStat,
  PaddockLitterRow,
  RegistryExitRow,
  SaleRecord,
  SlaughteredCage,
} from "./types";

// Огляд: народжено / забито / продано по місяцях.
// Об'єкт-накопичувач живе між викликами, тому окремі функції лише
// доповнюють його, а sortedMonthly() в кінці віддає впорядкований масив.
export type MonthlyMap = Record<string, MonthlyStat>;

function ensureMonth(map: MonthlyMap, key: string): MonthlyStat {
  if (!map[key]) {
    map[key] = {
      month: key,
      totalBorn: 0,
      totalAlive: 0,
      totalSlaughtered: 0,
      totalSold: 0,
    };
  }
  return map[key];
}

// Забої, продажі, окроли з вольєрів і вибуття з реєстру.
// Повертає накопичувач і кількість загиблих серед кроликів реєстру.
export function buildBaseMonthly(
  slaughtered: SlaughteredCage[],
  sales: SaleRecord[],
  paddockLitters: PaddockLitterRow[],
  registryExits: RegistryExitRow[],
): { monthlyMap: MonthlyMap; registryDied: number } {
  const monthlyMap: MonthlyMap = {};

  slaughtered.forEach((c) => {
    if (!c.slaughtered_at) return;
    const key = c.slaughtered_at.slice(0, 7);
    ensureMonth(monthlyMap, key).totalSlaughtered += headCount(c);
  });

  sales.forEach((s) => {
    if (!s.sold_at) return;
    const key = s.sold_at.slice(0, 7);
    ensureMonth(monthlyMap, key).totalSold += headCount(s);
  });

  paddockLitters.forEach((l) => {
    if (!l.birth_date) return;
    const key = l.birth_date.slice(0, 7);
    const stat = ensureMonth(monthlyMap, key);
    stat.totalBorn += l.total_born || 0;
    stat.totalAlive += l.alive || 0;
  });

  let registryDied = 0;
  registryExits.forEach((r) => {
    const key = (r.archive_date || "").slice(0, 7);
    if (r.archive_reason === "died") {
      registryDied += 1;
    } else if (r.archive_reason === "slaughter" && key) {
      ensureMonth(monthlyMap, key).totalSlaughtered += 1;
    } else if (r.archive_reason === "sold" && key) {
      ensureMonth(monthlyMap, key).totalSold += 1;
    }
    // archive_reason === "other" свідомо не враховуємо в баланс —
    // незрозуміло, чи тварина справді вибула з господарства
  });

  return { monthlyMap, registryDied };
}

// Додаємо народжених із окролів (таблиця litters)
export function addLittersToMonthly(
  monthlyMap: MonthlyMap,
  litters: LitterRow[],
): void {
  litters.forEach((l) => {
    if (!l.birth_date) return;
    const key = l.birth_date.slice(0, 7);
    const stat = ensureMonth(monthlyMap, key);
    stat.totalBorn += l.total_born || 0;
    stat.totalAlive += l.alive || 0;
  });
}

export function sortedMonthly(monthlyMap: MonthlyMap): MonthlyStat[] {
  return Object.values(monthlyMap).sort((a, b) =>
    a.month.localeCompare(b.month),
  );
}
