import type {
  RabbitRow,
  MatingRow,
  LitterRow,
  PairAssessment,
  MaleOption,
} from "./types";
import { PEDIGREE_GENERATIONS, PAIR_ORDER, MALE_ANCESTOR } from "./constants";
import { daysBetween } from "./dateUtils";

/**
 * Усі предки тварини до PEDIGREE_GENERATIONS поколінь.
 * Повертає: id предка → найближче покоління (1 = батько чи мати).
 * Глибина обмежена, тому помилкові цикли в даних не зациклюють розрахунок.
 */
export function ancestorsOf(
  id: string,
  byId: Map<string, RabbitRow>,
): Map<string, number> {
  const result = new Map<string, number>();
  let current: string[] = [id];
  for (let gen = 1; gen <= PEDIGREE_GENERATIONS; gen += 1) {
    const next: string[] = [];
    for (const childId of current) {
      const child = byId.get(childId);
      if (!child) continue;
      for (const parentId of [child.mother_id, child.father_id]) {
        if (!parentId || parentId === id) continue;
        if (!result.has(parentId)) result.set(parentId, gen);
        next.push(parentId);
      }
    }
    current = next;
  }
  return result;
}

/**
 * Чи можна парувати цю самку з цим самцем.
 *  danger: батько, син, рідний брат. Парувати не можна.
 *  warn: дід, онук, напівбрат, інший спільний предок у межах 3 поколінь.
 *  ok: спільних предків немає, а батьки відомі в обох тварин.
 *  unknown: спорідненості не знайдено, але батьки відомі не в обох,
 *           тому на відсутність спорідненості покладатися не можна.
 */
export function assessPair(
  female: RabbitRow,
  male: RabbitRow,
  byId: Map<string, RabbitRow>,
): PairAssessment {
  const femaleAnc = ancestorsOf(female.id, byId);
  const maleAnc = ancestorsOf(male.id, byId);

  // 1. Самець це предок самки (батько, дід, прадід)
  const maleGen = femaleAnc.get(male.id);
  if (maleGen !== undefined) {
    return {
      level: maleGen === 1 ? "danger" : "warn",
      text: `${MALE_ANCESTOR[maleGen] ?? "Предок"} цієї самки`,
    };
  }

  // 2. Самка це предок самця (мати, бабуся, прабабуся): самець її син, онук, правнук
  const femaleGen = maleAnc.get(female.id);
  if (femaleGen !== undefined) {
    const word = femaleGen === 1 ? "Син" : femaleGen === 2 ? "Онук" : "Правнук";
    return {
      level: femaleGen === 1 ? "danger" : "warn",
      text: `${word} цієї самки`,
    };
  }

  // 3. Брати й сестри
  const sameMother = !!female.mother_id && female.mother_id === male.mother_id;
  const sameFather = !!female.father_id && female.father_id === male.father_id;
  if (sameMother && sameFather) {
    return {
      level: "danger",
      text: "Рідний брат цієї самки (спільні батько й мати)",
    };
  }
  if (sameMother || sameFather) {
    return {
      level: "warn",
      text: `Напівбрат цієї самки (${
        sameFather ? "спільний батько" : "спільна мати"
      })`,
    };
  }

  // 4. Інший спільний предок у межах трьох поколінь
  let best: { id: string; femaleGen: number; maleGen: number } | null = null;
  for (const [ancestorId, fGen] of femaleAnc) {
    const mGen = maleAnc.get(ancestorId);
    if (mGen === undefined) continue;
    if (!best || fGen + mGen < best.femaleGen + best.maleGen) {
      best = { id: ancestorId, femaleGen: fGen, maleGen: mGen };
    }
  }
  if (best) {
    const name = byId.get(best.id)?.name ?? "невідомо";
    return {
      level: "warn",
      text: `Спільний предок: ${name} (покоління: самка ${best.femaleGen}, самець ${best.maleGen})`,
    };
  }

  // 5. Спорідненості не знайдено: чи можна на це покладатися
  // Змінено: достатньо, щоб у кожного з пари був відомий хоча б один з батьків
  // (наприклад, самця позичали і другий з батьків невідомий)
  const femaleAny = !!female.mother_id || !!female.father_id;
  const maleAny = !!male.mother_id || !!male.father_id;
  if (femaleAny && maleAny) {
    const full =
      !!female.mother_id &&
      !!female.father_id &&
      !!male.mother_id &&
      !!male.father_id;
    return {
      level: "ok",
      text: full
        ? "У відомому родоводі спільних предків немає"
        : "Спільних предків у відомому родоводі немає (родовід неповний)",
    };
  }
  if (!femaleAny && !maleAny) {
    return {
      level: "unknown",
      text: "Батьки не вказані ні в самки, ні в самця",
    };
  }
  return {
    level: "unknown",
    text: femaleAny ? "Батьки самця не вказані" : "Батьки самки не вказані",
  };
}

/**
 * Дати злучок самця: звичайні злучки (matings) і повторні (litter_mating_date в litters).
 * Для повторних береться фактичний самець окролу (actual_male_id), якщо він вказаний.
 */
export function collectMatingDates(
  maleId: string,
  matings: MatingRow[],
  litters: LitterRow[],
): string[] {
  const dates: string[] = [];
  const matingMale = new Map<string, string>();
  matings.forEach((m) => {
    matingMale.set(m.id, m.male_id);
    if (m.male_id === maleId) dates.push(m.mating_date);
  });
  litters.forEach((l) => {
    if (!l.litter_mating_date) return;
    const father =
      l.actual_male_id ??
      (l.mating_id ? matingMale.get(l.mating_id) : undefined);
    if (father === maleId) dates.push(l.litter_mating_date);
  });
  return dates;
}

/** Усі активні самці з оцінкою пари для обраної самки. */
export function buildMaleOptions(
  female: RabbitRow,
  rabbits: RabbitRow[],
  matings: MatingRow[],
  litters: LitterRow[],
  today: string,
): MaleOption[] {
  const byId = new Map<string, RabbitRow>();
  rabbits.forEach((r) => byId.set(r.id, r));

  const options = rabbits
    .filter((r) => r.gender === "male" && r.is_active !== false)
    .map((male): MaleOption => {
      // Дати з майбутнього (або некоректні) не враховуємо
      const dates = collectMatingDates(male.id, matings, litters)
        .filter((d) => daysBetween(d, today) >= 0)
        .sort();
      const week = dates.filter((d) => daysBetween(d, today) <= 6).length;
      return {
        rabbit: male,
        pairing: assessPair(female, male, byId),
        lastMating: dates[dates.length - 1] ?? null,
        matingsLast7Days: week,
      };
    });

  return options.sort((a, b) => {
    const diff =
      PAIR_ORDER.indexOf(a.pairing.level) - PAIR_ORDER.indexOf(b.pairing.level);
    if (diff !== 0) return diff;
    if (a.matingsLast7Days !== b.matingsLast7Days) {
      return a.matingsLast7Days - b.matingsLast7Days;
    }
    return a.rabbit.name.localeCompare(b.rabbit.name, "uk", { numeric: true });
  });
}
