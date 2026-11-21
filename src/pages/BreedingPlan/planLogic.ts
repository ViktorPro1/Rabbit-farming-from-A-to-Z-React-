import type {
  RabbitRow,
  MatingRow,
  LitterRow,
  PlanStatus,
  PregnancyInfo,
  NursingInfo,
  LastLitterInfo,
  FemalePlan,
} from "./types";
import { PREGNANCY_DAYS, SOON_DAYS, STATUS_ORDER } from "./constants";
import { daysBetween, addDays } from "./dateUtils";

// ── Розрахунок статусів ──

export function buildPregnancy(
  start: string,
  expected: string,
  maleId: string | null | undefined,
  today: string,
  nameById: Map<string, string>,
): PregnancyInfo {
  const day = Math.max(0, daysBetween(start, today));
  const daysLeft = daysBetween(today, expected);
  return {
    matingDate: start,
    expectedBirth: expected,
    day,
    daysLeft,
    progress: Math.min(1, day / PREGNANCY_DAYS),
    maleName: maleId ? (nameById.get(maleId) ?? null) : null,
    soon: daysLeft >= 0 && daysLeft <= SOON_DAYS,
  };
}

export function pushTo<T>(map: Map<string, T[]>, key: string, value: T): void {
  const list = map.get(key);
  if (list) {
    list.push(value);
  } else {
    map.set(key, [value]);
  }
}

/**
 * Статус кожної активної самки.
 *
 * Як у базі зберігається вагітність (перевірено на реальних даних):
 *  1. Перша злучка: рядок у matings без жодного окролу в litters.
 *  2. Повторна злучка: рядок у litters без birth_date та без failure_type,
 *     з litter_mating_date і litter_expected_birth (нового рядка в matings немає).
 * Самку окролу визначаємо як actual_female_id, інакше mother_id, інакше female_id злучки.
 */
export function computeFemalePlans(
  rabbits: RabbitRow[],
  matings: MatingRow[],
  litters: LitterRow[],
  today: string,
): FemalePlan[] {
  const nameById = new Map<string, string>();
  rabbits.forEach((r) => nameById.set(r.id, r.name));

  const matingById = new Map<string, MatingRow>();
  const matingsByFemale = new Map<string, MatingRow[]>();
  matings.forEach((m) => {
    matingById.set(m.id, m);
    pushTo(matingsByFemale, m.female_id, m);
  });

  const littersCountByMating = new Map<string, number>();
  const littersByFemale = new Map<string, LitterRow[]>();
  litters.forEach((l) => {
    if (l.mating_id) {
      littersCountByMating.set(
        l.mating_id,
        (littersCountByMating.get(l.mating_id) ?? 0) + 1,
      );
    }
    const mating = l.mating_id ? matingById.get(l.mating_id) : undefined;
    const femaleId =
      l.actual_female_id ?? l.mother_id ?? mating?.female_id ?? null;
    if (femaleId) pushTo(littersByFemale, femaleId, l);
  });

  const females = rabbits.filter(
    (r) => r.gender === "female" && r.is_active !== false,
  );

  return females.map((rabbit): FemalePlan => {
    const myMatings = matingsByFemale.get(rabbit.id) ?? [];
    const myLitters = littersByFemale.get(rabbit.id) ?? [];

    // 1. Чи є вагітність, що чекає окролу
    const pending: PregnancyInfo[] = [];

    for (const m of myMatings) {
      if (m.is_archived) continue;
      if ((littersCountByMating.get(m.id) ?? 0) > 0) continue;
      const expected =
        m.expected_birth ?? addDays(m.mating_date, PREGNANCY_DAYS);
      pending.push(
        buildPregnancy(m.mating_date, expected, m.male_id, today, nameById),
      );
    }

    for (const l of myLitters) {
      if (l.birth_date || l.failure_type) continue;
      const mating = l.mating_id ? matingById.get(l.mating_id) : undefined;
      if (mating?.is_archived) continue;
      const expected =
        l.litter_expected_birth ??
        (l.litter_mating_date
          ? addDays(l.litter_mating_date, PREGNANCY_DAYS)
          : null);
      if (!expected) continue;
      const start = l.litter_mating_date ?? addDays(expected, -PREGNANCY_DAYS);
      pending.push(
        buildPregnancy(
          start,
          expected,
          l.actual_male_id ?? mating?.male_id,
          today,
          nameById,
        ),
      );
    }

    pending.sort((a, b) => a.daysLeft - b.daysLeft);
    const pregnancy = pending.find((p) => Number.isFinite(p.daysLeft)) ?? null;

    // 2. Окроли, що відбулися (від найновішого)
    const birthed = myLitters
      .filter((l) => l.birth_date !== null && !l.failure_type)
      .sort((a, b) => (b.birth_date ?? "").localeCompare(a.birth_date ?? ""));

    const lastBirthed = birthed[0] ?? null;

    // Середня кількість живих кроленят в окролі (з тих окролів, де вона вказана)
    const aliveCounts = birthed
      .map((l) => l.alive)
      .filter((v): v is number => v !== null);
    const avgAlive = aliveCounts.length
      ? Math.round(
          (aliveCounts.reduce((sum, v) => sum + v, 0) / aliveCounts.length) *
            10,
        ) / 10
      : null;
    const lastLitter: LastLitterInfo | null =
      lastBirthed && lastBirthed.birth_date
        ? {
            birthDate: lastBirthed.birth_date,
            alive: lastBirthed.alive,
            totalBorn: lastBirthed.total_born,
          }
        : null;

    // 3. Чи годує малих (є окріл без дати відлучення)
    const nursingLitter = birthed.find((l) => !l.weaned_date) ?? null;
    const nursing: NursingInfo | null =
      nursingLitter && nursingLitter.birth_date
        ? {
            birthDate: nursingLitter.birth_date,
            daysSince: daysBetween(nursingLitter.birth_date, today),
            alive: nursingLitter.alive,
          }
        : null;

    // 4. З якої дати вільна: останнє відлучення або невдала вагітність
    const freeDates: string[] = [];
    birthed.forEach((l) => {
      if (l.weaned_date) freeDates.push(l.weaned_date);
    });
    myLitters.forEach((l) => {
      if (l.failure_type && l.litter_expected_birth) {
        freeDates.push(l.litter_expected_birth);
      }
    });
    freeDates.sort();
    const freeSince = freeDates[freeDates.length - 1] ?? null;

    // 5. Підсумковий статус
    // Змінено: спочатку рахуємо вік самки в місяцях
    const ageMonths = rabbit.birth_date
      ? Math.floor(daysBetween(rabbit.birth_date, today) / 30.4375)
      : null;

    let status: PlanStatus;
    if (pregnancy) {
      status = pregnancy.daysLeft < 0 ? "overdue" : "pregnant";
    } else if (nursing) {
      status = "nursing";
    } else if (ageMonths !== null && ageMonths < 4) {
      status = "young";
    } else {
      status = "ready";
    }

    return {
      rabbit,
      status,
      pregnancy,
      nursing,
      lastLitter,
      freeSince,
      freeDays:
        status === "ready" && freeSince ? daysBetween(freeSince, today) : null,
      littersCount: birthed.length,
      avgAlive,
      ageMonths: ageMonths !== null && ageMonths >= 0 ? ageMonths : null,
    };
  });
}

/** Сортування: прострочені, готові, вагітні, ті, що годують. */
export function sortPlans(plans: FemalePlan[]): FemalePlan[] {
  const rank = (s: PlanStatus) => STATUS_ORDER.indexOf(s);
  return [...plans].sort((a, b) => {
    // 1. Спочатку за групами статусів
    if (a.status !== b.status) return rank(a.status) - rank(b.status);

    // 2. Для вагітних — за терміном окролу
    if (a.status === "overdue" || a.status === "pregnant") {
      const diff = (a.pregnancy?.daysLeft ?? 0) - (b.pregnancy?.daysLeft ?? 0);
      if (diff !== 0) return diff;
    }

    // 3. Змінено: сортування за номером клітки (1, 2... 9, 10), а якщо немає — за кличкою.
    // Видалено сортування за freeDays, яке ламало числовий порядок кроличок
    const cageA = a.rabbit.cage_number || "";
    const cageB = b.rabbit.cage_number || "";
    if (cageA || cageB) {
      const cageDiff = cageA.localeCompare(cageB, "uk", { numeric: true });
      if (cageDiff !== 0) return cageDiff;
    }

    return a.rabbit.name.localeCompare(b.rabbit.name, "uk", { numeric: true });
  });
}

export function countByStatus(plans: FemalePlan[]): Record<PlanStatus, number> {
  const counts: Record<PlanStatus, number> = {
    overdue: 0,
    ready: 0,
    pregnant: 0,
    nursing: 0,
    // Змінено: лічильник для статусу young
    young: 0,
  };
  plans.forEach((p) => {
    counts[p.status] += 1;
  });
  return counts;
}

/** Безпечно перетворює відповідь Supabase на масив рядків. */
export function toRows<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}
