import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import { logError } from "../../lib/logError";
import "./BreedingPlan.css";

interface Props {
  session: Session;
}

// ── Типи рядків з бази (тільки поля, які потрібні сторінці) ──

interface RabbitRow {
  id: string;
  name: string;
  breed: string | null;
  gender: string | null;
  birth_date: string | null;
  cage_number: string | null;
  is_active: boolean | null;
  /** Батьки з родоводу. Потрібні для перевірки спорідненості. */
  mother_id: string | null;
  father_id: string | null;
}

interface MatingRow {
  id: string;
  female_id: string;
  male_id: string;
  mating_date: string;
  control_date: string | null;
  expected_birth: string | null;
  is_archived: boolean | null;
}

interface LitterRow {
  id: string;
  mating_id: string | null;
  mother_id: string | null;
  actual_female_id: string | null;
  actual_male_id: string | null;
  birth_date: string | null;
  total_born: number | null;
  alive: number | null;
  weaned_date: string | null;
  litter_mating_date: string | null;
  litter_expected_birth: string | null;
  failure_type: string | null;
}

// ── Типи результату ──

type PlanStatus = "overdue" | "ready" | "pregnant" | "nursing";
type Filter = "all" | PlanStatus;

interface PregnancyInfo {
  matingDate: string;
  expectedBirth: string;
  /** Скільки днів минуло від злучки. */
  day: number;
  /** Скільки днів лишилось до окролу (від'ємне, якщо прострочено). */
  daysLeft: number;
  /** Від 0 до 1, для смужки прогресу. */
  progress: number;
  maleName: string | null;
  soon: boolean;
}

interface NursingInfo {
  birthDate: string;
  daysSince: number;
  alive: number | null;
}

interface LastLitterInfo {
  birthDate: string;
  alive: number | null;
  totalBorn: number | null;
}

interface FemalePlan {
  rabbit: RabbitRow;
  status: PlanStatus;
  pregnancy: PregnancyInfo | null;
  nursing: NursingInfo | null;
  lastLitter: LastLitterInfo | null;
  /** Дата, з якої самка вільна (відлучення або невдала вагітність). */
  freeSince: string | null;
  freeDays: number | null;
  littersCount: number;
  /** Середня кількість живих кроленят в окролі. */
  avgAlive: number | null;
  ageMonths: number | null;
}

// ── Заплановані злучки (таблиця breeding_plan) ──

type RecordStatus = "planned" | "done" | "cancelled";

interface PlanRecord {
  id: string;
  female_id: string;
  male_id: string | null;
  backup_male_id: string | null;
  planned_date: string;
  status: RecordStatus;
  notes: string | null;
  mating_id: string | null;
  created_at: string;
}

interface NewPlanInput {
  femaleId: string;
  maleId: string;
  backupMaleId: string | null;
  plannedDate: string;
  notes: string;
}

const RECORD_META: Record<RecordStatus, { icon: string; label: string }> = {
  planned: { icon: "📝", label: "Заплановано" },
  done: { icon: "✅", label: "Виконано" },
  cancelled: { icon: "✖️", label: "Відмінено" },
};

/** Тривалість вагітності: така сама, як у Matings (очікуваний окріл = злучка + 31 день). */
const PREGNANCY_DAYS = 31;

/** За скільки днів до окролу показуємо позначку «скоро». */
const SOON_DAYS = 3;

const STATUS_META: Record<PlanStatus, { icon: string; label: string }> = {
  overdue: { icon: "🚨", label: "Окріл прострочено" },
  ready: { icon: "💞", label: "Готова до злучки" },
  pregnant: { icon: "⏳", label: "Очікуємо окріл" },
  nursing: { icon: "🍼", label: "Годує малих" },
};

/** Порядок статусів у фільтрі та в сортуванні. */
const STATUS_ORDER: PlanStatus[] = ["overdue", "ready", "pregnant", "nursing"];

// ── Дати ──
// Усі дати в базі це рядки YYYY-MM-DD. Рахуємо через UTC-північ, щоб літній
// і зимовий час не давали зсуву на день.

const DAY_MS = 86_400_000;

function parseISO(iso: string): number {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!match) return NaN;
  return Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

/** Різниця в днях: to мінус from. */
function daysBetween(from: string, to: string): number {
  return Math.round((parseISO(to) - parseISO(from)) / DAY_MS);
}

function addDays(iso: string, days: number): string {
  return new Date(parseISO(iso) + days * DAY_MS).toISOString().slice(0, 10);
}

/** Сьогоднішня дата за київським часом у форматі YYYY-MM-DD. */
function todayKyiv(): string {
  // Europe/Kiev: ця назва зони підтримується в усіх браузерах.
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Kiev" }).format(
    new Date(),
  );
}

/** 2026-11-15 → 15.11.2026 */
function formatDateUA(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!match) return iso;
  return `${match[3]}.${match[2]}.${match[1]}`;
}

/** Правильна форма слова «день» для числа. */
function pluralDays(n: number): string {
  const abs = Math.abs(n);
  const last = abs % 10;
  const last2 = abs % 100;
  if (last2 >= 11 && last2 <= 14) return "днів";
  if (last === 1) return "день";
  if (last >= 2 && last <= 4) return "дні";
  return "днів";
}

/** Підпис «через N днів / завтра / сьогодні / прострочено». */
function daysLeftLabel(daysLeft: number): string {
  if (daysLeft < 0) {
    const late = Math.abs(daysLeft);
    return `прострочено на ${late} ${pluralDays(late)}`;
  }
  if (daysLeft === 0) return "сьогодні";
  if (daysLeft === 1) return "завтра";
  return `через ${daysLeft} ${pluralDays(daysLeft)}`;
}

// ── Розрахунок статусів ──

function buildPregnancy(
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

function pushTo<T>(map: Map<string, T[]>, key: string, value: T): void {
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
function computeFemalePlans(
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
    let status: PlanStatus;
    if (pregnancy) {
      status = pregnancy.daysLeft < 0 ? "overdue" : "pregnant";
    } else if (nursing) {
      status = "nursing";
    } else {
      status = "ready";
    }

    const ageMonths = rabbit.birth_date
      ? Math.floor(daysBetween(rabbit.birth_date, today) / 30.4375)
      : null;

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
function sortPlans(plans: FemalePlan[]): FemalePlan[] {
  const rank = (s: PlanStatus) => STATUS_ORDER.indexOf(s);
  return [...plans].sort((a, b) => {
    if (a.status !== b.status) return rank(a.status) - rank(b.status);
    if (a.status === "overdue" || a.status === "pregnant") {
      const diff = (a.pregnancy?.daysLeft ?? 0) - (b.pregnancy?.daysLeft ?? 0);
      if (diff !== 0) return diff;
    }
    if (a.status === "ready") {
      const diff = (b.freeDays ?? -1) - (a.freeDays ?? -1);
      if (diff !== 0) return diff;
    }
    if (a.status === "nursing") {
      const diff = (b.nursing?.daysSince ?? 0) - (a.nursing?.daysSince ?? 0);
      if (diff !== 0) return diff;
    }
    return a.rabbit.name.localeCompare(b.rabbit.name, "uk", { numeric: true });
  });
}

function countByStatus(plans: FemalePlan[]): Record<PlanStatus, number> {
  const counts: Record<PlanStatus, number> = {
    overdue: 0,
    ready: 0,
    pregnant: 0,
    nursing: 0,
  };
  plans.forEach((p) => {
    counts[p.status] += 1;
  });
  return counts;
}

/** Безпечно перетворює відповідь Supabase на масив рядків. */
function toRows<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

// ── Підбір самця: перевірка спорідненості ──

type PairLevel = "danger" | "warn" | "ok" | "unknown";

interface PairAssessment {
  level: PairLevel;
  text: string;
}

interface MaleOption {
  rabbit: RabbitRow;
  pairing: PairAssessment;
  /** Остання злучка самця (будь-з якою самкою). */
  lastMating: string | null;
  /** Скільки злучок було за останні 7 днів. */
  matingsLast7Days: number;
}

/** Скільки поколінь предків перевіряємо. */
const PEDIGREE_GENERATIONS = 3;

/** Від скількох злучок за 7 днів самця вважаємо перевантаженим. */
const MALE_WEEK_LIMIT = 2;

const PAIR_META: Record<PairLevel, { icon: string; label: string }> = {
  danger: { icon: "⛔", label: "Не можна" },
  warn: { icon: "⚠️", label: "Обережно" },
  ok: { icon: "✅", label: "Можна" },
  unknown: { icon: "❔", label: "Немає даних" },
};

/** Порядок у списку: спершу ті, кого можна, наприкінці ті, кого не можна. */
const PAIR_ORDER: PairLevel[] = ["ok", "unknown", "warn", "danger"];

const MALE_ANCESTOR = ["", "Батько", "Дід", "Прадід"];

/**
 * Усі предки тварини до PEDIGREE_GENERATIONS поколінь.
 * Повертає: id предка → найближче покоління (1 = батько чи мати).
 * Глибина обмежена, тому помилкові цикли в даних не зациклюють розрахунок.
 */
function ancestorsOf(
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
function assessPair(
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
function collectMatingDates(
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
function buildMaleOptions(
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

const NO_OPTIONS: MaleOption[] = [];
const NO_RECORDS: PlanRecord[] = [];

// ── Панель підбору самця: список з оцінкою і форма «Запланувати» ──

interface MalePickerProps {
  female: RabbitRow;
  options: MaleOption[];
  pedigreeNote: string | null;
  plannedForFemale: PlanRecord[];
  saving: boolean;
  error: string;
  today: string;
  onCreate: (input: NewPlanInput) => Promise<boolean>;
}

function MalePicker({
  female,
  options,
  pedigreeNote,
  plannedForFemale,
  saving,
  error,
  today,
  onCreate,
}: MalePickerProps) {
  // Рекомендований самець: перший, у кого спорідненості немає і хто не перевантажений
  const recommended =
    options.find(
      (o) => o.pairing.level === "ok" && o.matingsLast7Days < MALE_WEEK_LIMIT,
    ) ?? null;
  const firstAllowed =
    options.find((o) => o.pairing.level !== "danger") ?? null;

  const [maleId, setMaleId] = useState(
    recommended?.rabbit.id ?? firstAllowed?.rabbit.id ?? "",
  );
  const [backupId, setBackupId] = useState("");
  const [date, setDate] = useState(today);
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  const chosen = options.find((o) => o.rabbit.id === maleId) ?? null;
  const canSave =
    !!chosen && chosen.pairing.level !== "danger" && !!date && !saving;
  const nextPlanned = plannedForFemale[0] ?? null;

  function handleMaleChange(value: string) {
    setMaleId(value);
    // Запасним не може бути той самий самець
    if (backupId === value) setBackupId("");
    setMessage("");
  }

  async function handleSubmit() {
    if (!chosen || !canSave) return;
    setMessage("");
    const ok = await onCreate({
      femaleId: female.id,
      maleId: chosen.rabbit.id,
      backupMaleId: backupId || null,
      plannedDate: date,
      notes: notes.trim(),
    });
    if (ok) {
      setMessage(
        `Заплановано: ${chosen.rabbit.name}, ${formatDateUA(date)}. Дивіться список нижче.`,
      );
      setBackupId("");
      setNotes("");
    }
  }

  return (
    <div className="plan-pick-panel">
      {pedigreeNote && <p className="plan-pick-note">{pedigreeNote}</p>}
      {nextPlanned && (
        <p className="plan-pick-note">
          Для цієї самки вже є запланована злучка на{" "}
          {formatDateUA(nextPlanned.planned_date)}. Нову можна додати, якщо
          потрібно.
        </p>
      )}

      {options.length === 0 ? (
        <p className="plan-pick-empty">Активних самців у реєстрі немає.</p>
      ) : (
        <>
          <ul className="plan-pick-list">
            {options.map((o) => {
              const pairMeta = PAIR_META[o.pairing.level];
              const overloaded = o.matingsLast7Days >= MALE_WEEK_LIMIT;
              const isRecommended = recommended?.rabbit.id === o.rabbit.id;
              const maleSub = [
                o.rabbit.breed,
                o.rabbit.cage_number ? `кл. ${o.rabbit.cage_number}` : null,
              ]
                .filter(Boolean)
                .join(" · ");
              return (
                <li
                  key={o.rabbit.id}
                  className={`plan-pick-item plan-pick-${o.pairing.level}`}
                >
                  <div className="plan-pick-top">
                    <span className="plan-pick-name">♂ {o.rabbit.name}</span>
                    <span className="plan-pick-badges">
                      {isRecommended && (
                        <span className="plan-pick-badge plan-pick-badge-recommend">
                          <span aria-hidden="true">⭐</span> Рекомендовано
                        </span>
                      )}
                      <span
                        className={`plan-pick-badge plan-pick-badge-${o.pairing.level}`}
                      >
                        <span aria-hidden="true">{pairMeta.icon}</span>{" "}
                        {pairMeta.label}
                      </span>
                    </span>
                  </div>
                  {maleSub && <span className="plan-pick-sub">{maleSub}</span>}
                  <span className="plan-pick-text">{o.pairing.text}</span>
                  <span className="plan-pick-load">
                    {o.lastMating
                      ? `Остання злучка: ${formatDateUA(o.lastMating)} · за 7 днів: ${o.matingsLast7Days}`
                      : "Злучок ще не було"}
                    {overloaded && (
                      <span className="plan-pick-overload">Часто в роботі</span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="plan-pick-form">
            <h4 className="plan-pick-form-title">Запланувати злучку</h4>
            <div className="plan-pick-form-grid">
              <div className="plan-pick-field">
                <label htmlFor={`plan-male-${female.id}`}>Самець</label>
                <select
                  id={`plan-male-${female.id}`}
                  name="planMale"
                  value={maleId}
                  onChange={(e) => handleMaleChange(e.target.value)}
                >
                  {!chosen && <option value="">Оберіть самця</option>}
                  {options.map((o) => (
                    <option
                      key={o.rabbit.id}
                      value={o.rabbit.id}
                      disabled={o.pairing.level === "danger"}
                    >
                      {o.rabbit.name} · {PAIR_META[o.pairing.level].label}
                      {recommended?.rabbit.id === o.rabbit.id
                        ? " · рекомендовано"
                        : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="plan-pick-field">
                <label htmlFor={`plan-backup-${female.id}`}>
                  Запасний самець
                </label>
                <select
                  id={`plan-backup-${female.id}`}
                  name="planBackup"
                  value={backupId}
                  onChange={(e) => setBackupId(e.target.value)}
                >
                  <option value="">Без запасного</option>
                  {options
                    .filter((o) => o.rabbit.id !== maleId)
                    .map((o) => (
                      <option
                        key={o.rabbit.id}
                        value={o.rabbit.id}
                        disabled={o.pairing.level === "danger"}
                      >
                        {o.rabbit.name} · {PAIR_META[o.pairing.level].label}
                      </option>
                    ))}
                </select>
              </div>

              <div className="plan-pick-field">
                <label htmlFor={`plan-date-${female.id}`}>Планова дата</label>
                <input
                  id={`plan-date-${female.id}`}
                  name="planDate"
                  type="date"
                  min={today}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="plan-pick-field">
                <label htmlFor={`plan-notes-${female.id}`}>Нотатки</label>
                <input
                  id={`plan-notes-${female.id}`}
                  name="planNotes"
                  placeholder="Необов'язково"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            {chosen && chosen.pairing.level === "warn" && (
              <p className="plan-pick-hint">
                Обережно: {chosen.pairing.text}. Парувати лише свідомо.
              </p>
            )}
            {chosen && chosen.pairing.level === "unknown" && (
              <p className="plan-pick-hint">
                Спорідненість не перевірено: {chosen.pairing.text.toLowerCase()}
                .
              </p>
            )}

            {error && <p className="plan-error">{error}</p>}
            {message && <p className="plan-pick-message">{message}</p>}

            <button
              type="button"
              className="plan-pick-submit"
              onClick={() => void handleSubmit()}
              disabled={!canSave}
            >
              {saving ? "Збереження..." : "Запланувати"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ── Блок 3: список запланованих злучок ──

interface PlanQueueProps {
  records: PlanRecord[];
  rabbitName: (id: string | null) => string;
  today: string;
  busyId: string | null;
  error: string;
  showHistory: boolean;
  onToggleHistory: () => void;
  onDone: (record: PlanRecord) => void;
  onSetStatus: (record: PlanRecord, status: RecordStatus) => void;
  onDelete: (record: PlanRecord) => void;
}

function PlanQueue({
  records,
  rabbitName,
  today,
  busyId,
  error,
  showHistory,
  onToggleHistory,
  onDone,
  onSetStatus,
  onDelete,
}: PlanQueueProps) {
  const planned = records
    .filter((r) => r.status === "planned")
    .sort((a, b) => a.planned_date.localeCompare(b.planned_date));
  const history = records
    .filter((r) => r.status !== "planned")
    .sort((a, b) => b.planned_date.localeCompare(a.planned_date));

  function renderItem(r: PlanRecord) {
    const meta = RECORD_META[r.status];
    const diff = daysBetween(today, r.planned_date);
    const late = r.status === "planned" && diff < 0;
    const busy = busyId === r.id;
    return (
      <li key={r.id} className={`plan-queue-item plan-queue-${r.status}`}>
        <div className="plan-queue-top">
          <span className="plan-queue-pair">
            ♀ {rabbitName(r.female_id)} + ♂ {rabbitName(r.male_id)}
          </span>
          <span className={`plan-queue-badge plan-queue-badge-${r.status}`}>
            <span aria-hidden="true">{meta.icon}</span> {meta.label}
          </span>
        </div>
        <div className="plan-queue-meta">
          <span>
            Дата: <strong>{formatDateUA(r.planned_date)}</strong>
          </span>
          {r.status === "planned" && (
            <span
              className={`plan-queue-when${late ? " plan-queue-late" : ""}`}
            >
              {daysLeftLabel(diff)}
            </span>
          )}
          {r.backup_male_id && (
            <span>Запасний: ♂ {rabbitName(r.backup_male_id)}</span>
          )}
          {r.status === "done" && r.mating_id && (
            <span>Записано в «Парування»</span>
          )}
        </div>
        {r.notes && <span className="plan-queue-notes">{r.notes}</span>}
        <div className="plan-queue-actions">
          {r.status === "planned" && (
            <>
              <button
                type="button"
                className="plan-queue-btn plan-queue-btn-done"
                disabled={busy}
                onClick={() => onDone(r)}
              >
                {busy ? "Запис..." : "Виконано"}
              </button>
              <button
                type="button"
                className="plan-queue-btn"
                disabled={busy}
                onClick={() => onSetStatus(r, "cancelled")}
              >
                Відмінити
              </button>
            </>
          )}
          {r.status === "cancelled" && (
            <button
              type="button"
              className="plan-queue-btn"
              disabled={busy}
              onClick={() => onSetStatus(r, "planned")}
            >
              Відновити
            </button>
          )}
          <button
            type="button"
            className="plan-queue-btn plan-queue-btn-danger"
            disabled={busy}
            onClick={() => onDelete(r)}
          >
            Видалити
          </button>
        </div>
      </li>
    );
  }

  return (
    <section className="plan-queue">
      <h2 className="plan-queue-title">🗂 Заплановані злучки</h2>
      {error && <p className="plan-error">{error}</p>}

      {planned.length === 0 ? (
        <p className="plan-queue-empty">
          Запланованих злучок ще немає. Натисніть «Підібрати самця» в картці
          самки.
        </p>
      ) : (
        <ul className="plan-queue-list">{planned.map(renderItem)}</ul>
      )}

      {history.length > 0 && (
        <>
          <button
            type="button"
            className="plan-queue-toggle"
            aria-expanded={showHistory}
            onClick={onToggleHistory}
          >
            {showHistory ? "Сховати історію" : `Історія (${history.length})`}
          </button>
          {showHistory && (
            <ul className="plan-queue-list">{history.map(renderItem)}</ul>
          )}
        </>
      )}
    </section>
  );
}

// ── Картка самки ──

interface PlanCardProps {
  plan: FemalePlan;
  /** Порядковий номер картки: від нього залежить затримка появи. */
  index: number;
  /** Самці для підбору (заповнені лише для відкритої картки). */
  options: MaleOption[];
  pickerOpen: boolean;
  onTogglePicker: () => void;
  /** Підпис найближчої запланованої злучки цієї самки. */
  plannedLabel: string | null;
  plannedForFemale: PlanRecord[];
  saving: boolean;
  createError: string;
  today: string;
  onCreatePlan: (input: NewPlanInput) => Promise<boolean>;
}

function PlanCard({
  plan,
  index,
  options,
  pickerOpen,
  onTogglePicker,
  plannedLabel,
  plannedForFemale,
  saving,
  createError,
  today,
  onCreatePlan,
}: PlanCardProps) {
  const {
    rabbit,
    status,
    pregnancy,
    nursing,
    lastLitter,
    freeSince,
    freeDays,
    littersCount,
    avgAlive,
    ageMonths,
  } = plan;
  const meta = STATUS_META[status];

  // Підбір самця пропонуємо тим, хто не вагітна: вільним і тим, що годують
  const canPick = status === "ready" || status === "nursing";

  // Якщо в самки не вказані батьки, перевірка неповна: попереджаємо про це
  const pedigreeNote =
    !rabbit.mother_id && !rabbit.father_id
      ? "У самки не вказані батьки, тому перевірка спорідненості неповна. Заповніть родовід у розділі «Родовід»."
      : !rabbit.mother_id || !rabbit.father_id
        ? "У самки вказано лише одного з батьків, тому перевірка неповна. Доповніть родовід у розділі «Родовід»."
        : null;

  const cardClass = [
    "plan-card",
    `plan-card-${status}`,
    pregnancy?.soon ? "plan-card-soon" : "",
  ]
    .filter(Boolean)
    .join(" ");

  // Затримка появи картки: перші 10 карток з'являються по черзі
  const cardStyle = {
    "--plan-delay": `${Math.min(index, 10) * 60}ms`,
  } as CSSProperties;

  const subline = [
    rabbit.breed,
    rabbit.cage_number ? `кл. ${rabbit.cage_number}` : null,
    ageMonths !== null ? `${ageMonths} міс.` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className={cardClass} style={cardStyle}>
      <div className="plan-card-top">
        <span className="plan-avatar" aria-hidden="true">
          🐰
        </span>
        <div className="plan-card-title">
          <span className="plan-name">♀ {rabbit.name}</span>
          {subline && <span className="plan-subline">{subline}</span>}
        </div>
        <span className={`plan-badge plan-badge-${status}`}>
          <span className="plan-badge-icon" aria-hidden="true">
            {meta.icon}
          </span>
          {meta.label}
        </span>
      </div>

      {pregnancy && (
        <div className="plan-block plan-block-pregnancy">
          <div className="plan-row">
            <span>
              📅 Злучка: <strong>{formatDateUA(pregnancy.matingDate)}</strong>
            </span>
            {pregnancy.maleName && <span>♂ {pregnancy.maleName}</span>}
          </div>
          <div className="plan-row">
            <span>
              🗓 Очікуваний окріл:{" "}
              <strong>{formatDateUA(pregnancy.expectedBirth)}</strong>
            </span>
            <span className="plan-days-left">
              {daysLeftLabel(pregnancy.daysLeft)}
            </span>
          </div>
          <div
            className="plan-progress"
            role="progressbar"
            aria-label="Перебіг вагітності"
            aria-valuemin={0}
            aria-valuemax={PREGNANCY_DAYS}
            aria-valuenow={Math.min(pregnancy.day, PREGNANCY_DAYS)}
          >
            <div
              className="plan-progress-fill"
              style={
                {
                  "--plan-progress": `${Math.round(pregnancy.progress * 100)}%`,
                } as CSSProperties
              }
            />
          </div>
          <span className="plan-progress-label">
            День {Math.min(pregnancy.day, PREGNANCY_DAYS)} з {PREGNANCY_DAYS}
          </span>
        </div>
      )}

      {nursing && (
        <div className="plan-block plan-block-nursing">
          <span>
            🍼 Окріл: <strong>{formatDateUA(nursing.birthDate)}</strong>
            {" · "}
            {nursing.daysSince} {pluralDays(nursing.daysSince)} тому
          </span>
          {nursing.alive !== null && (
            <span>
              Живих кроленят: <strong>{nursing.alive}</strong>
            </span>
          )}
          {pregnancy && (
            <span className="plan-note">
              Ще годує малих від попереднього окролу
            </span>
          )}
        </div>
      )}

      {status === "ready" && (
        <div className="plan-block plan-block-ready">
          {freeSince && freeDays !== null ? (
            <span>
              Вільна з <strong>{formatDateUA(freeSince)}</strong>
              {" · "}
              {freeDays} {pluralDays(freeDays)}
            </span>
          ) : (
            <span>Злучок ще не було</span>
          )}
        </div>
      )}

      <div className="plan-footer">
        <span className="plan-chip">Окролів: {littersCount}</span>
        {avgAlive !== null && (
          <span className="plan-chip">
            Середньо живих: {String(avgAlive).replace(".", ",")}
          </span>
        )}
        {plannedLabel && (
          <span className="plan-chip plan-chip-planned">{plannedLabel}</span>
        )}
        {lastLitter && status !== "nursing" && (
          <span className="plan-chip">
            Останній: {formatDateUA(lastLitter.birthDate)}
            {lastLitter.alive !== null ? `, живих ${lastLitter.alive}` : ""}
          </span>
        )}
      </div>
      {canPick && (
        <>
          <button
            type="button"
            className="plan-pick-btn"
            aria-expanded={pickerOpen}
            onClick={onTogglePicker}
          >
            <span aria-hidden="true">♂</span>{" "}
            {pickerOpen ? "Сховати підбір" : "Підібрати самця"}
          </button>

          {pickerOpen && (
            <MalePicker
              female={rabbit}
              options={options}
              pedigreeNote={pedigreeNote}
              plannedForFemale={plannedForFemale}
              saving={saving}
              error={createError}
              today={today}
              onCreate={onCreatePlan}
            />
          )}
        </>
      )}
    </article>
  );
}

// ── Сторінка ──

export default function BreedingPlan({ session }: Props) {
  const userId = session.user.id;
  const navigate = useNavigate();

  const [rabbits, setRabbits] = useState<RabbitRow[]>([]);
  const [matings, setMatings] = useState<MatingRow[]>([]);
  const [litters, setLitters] = useState<LitterRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  // Картка самки, в якій зараз відкрито підбір самця
  const [openFemaleId, setOpenFemaleId] = useState<string | null>(null);
  // Заплановані злучки (breeding_plan)
  const [records, setRecords] = useState<PlanRecord[]>([]);
  const [recordsError, setRecordsError] = useState("");
  const [createError, setCreateError] = useState("");
  const [actionError, setActionError] = useState("");
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  // Збільшуємо після запису в базу, щоб перезавантажити дані сторінки
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [rabbitsRes, matingsRes, littersRes] = await Promise.all([
          supabase
            .from("rabbits")
            .select(
              "id, name, breed, gender, birth_date, cage_number, is_active, mother_id, father_id",
            )
            .eq("user_id", userId),
          supabase
            .from("matings")
            .select(
              "id, female_id, male_id, mating_date, control_date, expected_birth, is_archived",
            )
            .eq("user_id", userId),
          supabase
            .from("litters")
            .select(
              "id, mating_id, mother_id, actual_female_id, actual_male_id, birth_date, total_born, alive, weaned_date, litter_mating_date, litter_expected_birth, failure_type",
            )
            .eq("user_id", userId),
        ]);

        if (rabbitsRes.error) throw rabbitsRes.error;
        if (matingsRes.error) throw matingsRes.error;
        if (littersRes.error) throw littersRes.error;
        if (cancelled) return;

        setRabbits(toRows<RabbitRow>(rabbitsRes.data));
        setMatings(toRows<MatingRow>(matingsRes.data));
        setLitters(toRows<LitterRow>(littersRes.data));
        setLoadError("");
      } catch (err) {
        logError("BreedingPlan.load", err);
        if (!cancelled) setLoadError("Не вдалося завантажити дані");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    // Заплановані злучки: окремий запит. Якщо таблиці немає або збій,
    // блоки 1 і 2 працюють далі.
    async function loadRecords() {
      try {
        const { data, error } = await supabase
          .from("breeding_plan")
          .select(
            "id, female_id, male_id, backup_male_id, planned_date, status, notes, mating_id, created_at",
          )
          .eq("user_id", userId)
          .order("planned_date", { ascending: true });
        if (error) throw error;
        if (cancelled) return;
        setRecords(toRows<PlanRecord>(data));
        setRecordsError("");
      } catch (err) {
        logError("BreedingPlan.loadRecords", err);
        if (!cancelled) {
          setRecordsError("Не вдалося завантажити список запланованого");
        }
      }
    }

    void load();
    void loadRecords();
    return () => {
      cancelled = true;
    };
  }, [userId, reloadKey]);

  const plans = useMemo(
    () => sortPlans(computeFemalePlans(rabbits, matings, litters, todayKyiv())),
    [rabbits, matings, litters],
  );
  const counts = useMemo(() => countByStatus(plans), [plans]);
  const visiblePlans = useMemo(
    () => (filter === "all" ? plans : plans.filter((p) => p.status === filter)),
    [plans, filter],
  );

  // Підбір самців рахуємо лише для відкритої картки
  const openOptions = useMemo(() => {
    const female = openFemaleId
      ? plans.find((p) => p.rabbit.id === openFemaleId)?.rabbit
      : undefined;
    return female
      ? buildMaleOptions(female, rabbits, matings, litters, todayKyiv())
      : NO_OPTIONS;
  }, [openFemaleId, plans, rabbits, matings, litters]);

  const today = todayKyiv();

  const rabbitName = (id: string | null) =>
    id ? (rabbits.find((r) => r.id === id)?.name ?? "невідомо") : "не вказано";

  // Заплановані (ще не виконані) злучки по самках, від найближчої дати
  const plannedByFemale = useMemo(() => {
    const map = new Map<string, PlanRecord[]>();
    records
      .filter((r) => r.status === "planned")
      .sort((a, b) => a.planned_date.localeCompare(b.planned_date))
      .forEach((r) => {
        const list = map.get(r.female_id);
        if (list) {
          list.push(r);
        } else {
          map.set(r.female_id, [r]);
        }
      });
    return map;
  }, [records]);

  async function handleCreatePlan(input: NewPlanInput): Promise<boolean> {
    setSaving(true);
    setCreateError("");
    try {
      const { error } = await supabase.from("breeding_plan").insert({
        user_id: userId,
        female_id: input.femaleId,
        male_id: input.maleId,
        backup_male_id: input.backupMaleId,
        planned_date: input.plannedDate,
        notes: input.notes || null,
      });
      if (error) throw error;
      setReloadKey((k) => k + 1);
      return true;
    } catch (err) {
      logError("BreedingPlan.createPlan", err);
      setCreateError("Не вдалося зберегти план");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function handleSetStatus(record: PlanRecord, status: RecordStatus) {
    setBusyId(record.id);
    setActionError("");
    try {
      const { error } = await supabase
        .from("breeding_plan")
        .update({ status })
        .eq("id", record.id);
      if (error) throw error;
    } catch (err) {
      logError("BreedingPlan.setStatus", err);
      setActionError("Не вдалося змінити статус");
    } finally {
      setReloadKey((k) => k + 1);
      setBusyId(null);
    }
  }

  async function handleDeleteRecord(record: PlanRecord) {
    if (!window.confirm("Видалити цей запис із плану?")) return;
    setBusyId(record.id);
    setActionError("");
    try {
      const { error } = await supabase
        .from("breeding_plan")
        .delete()
        .eq("id", record.id);
      if (error) throw error;
    } catch (err) {
      logError("BreedingPlan.deleteRecord", err);
      setActionError("Не вдалося видалити запис");
    } finally {
      setReloadKey((k) => k + 1);
      setBusyId(null);
    }
  }

  /**
   * «Виконано»: записує справжню злучку так само, як розділ «Парування».
   *  - Самка вже є в обліку (має незаархівовану злучку): повторна злучка
   *    записується в окріл (litters: litter_mating_date, litter_control_date,
   *    litter_expected_birth, actual_male_id), нового рядка в matings немає.
   *  - Самки в обліку ще немає: створюється рядок у matings.
   * Дата злучки: сьогодні. Контрольна: +7 днів. Окріл: +31 день (для matings
   * він рахується в базі сам).
   */
  async function handleDone(record: PlanRecord) {
    if (!record.male_id) {
      setActionError(
        "У цьому плані не вказано самця. Видаліть запис і створіть новий.",
      );
      return;
    }
    const female = rabbits.find((r) => r.id === record.female_id);
    const male = rabbits.find((r) => r.id === record.male_id);
    const femalePlan = plans.find((p) => p.rabbit.id === record.female_id);
    const pregnantWarning =
      femalePlan &&
      (femalePlan.status === "pregnant" || femalePlan.status === "overdue")
        ? "\n\nУвага: за обліком ця самка зараз вагітна."
        : "";
    const confirmed = window.confirm(
      `Записати злучку ${rabbitName(record.female_id)} з ${rabbitName(record.male_id)} у розділ «Парування» на сьогодні (${formatDateUA(today)})?${pregnantWarning}`,
    );
    if (!confirmed) return;

    setBusyId(record.id);
    setActionError("");
    let recorded = false;
    try {
      const controlDate = addDays(today, 7);
      const expectedBirth = addDays(today, PREGNANCY_DAYS);
      const existing =
        matings
          .filter((m) => m.female_id === record.female_id && !m.is_archived)
          .sort((a, b) => b.mating_date.localeCompare(a.mating_date))[0] ??
        null;

      let matingId: string;
      if (existing) {
        const { error } = await supabase.from("litters").insert({
          user_id: userId,
          mating_id: existing.id,
          total_born: 0,
          alive: 0,
          dead: 0,
          litter_mating_date: today,
          litter_control_date: controlDate,
          litter_expected_birth: expectedBirth,
          actual_male_id: record.male_id,
        });
        if (error) throw error;
        matingId = existing.id;
      } else {
        const { data, error } = await supabase
          .from("matings")
          .insert({
            user_id: userId,
            female_id: record.female_id,
            male_id: record.male_id,
            mating_date: today,
            control_date: controlDate,
            female_cage: female?.cage_number ?? null,
            male_cage: male?.cage_number ?? null,
            notes: record.notes,
          })
          .select("id")
          .single();
        if (error) throw error;
        const createdId = (data as { id?: string } | null)?.id;
        if (!createdId) throw new Error("matings.insert не повернув id");
        matingId = createdId;
      }
      recorded = true;

      const { error: updateError } = await supabase
        .from("breeding_plan")
        .update({ status: "done", mating_id: matingId })
        .eq("id", record.id);
      if (updateError) throw updateError;
    } catch (err) {
      logError("BreedingPlan.handleDone", err);
      setActionError(
        recorded
          ? "Злучку записано в «Парування», але статус плану не змінився. Не натискайте «Виконано» ще раз: видаліть цей запис із плану."
          : "Не вдалося записати злучку. Нічого не збережено.",
      );
    } finally {
      setReloadKey((k) => k + 1);
      setBusyId(null);
    }
  }

  return (
    <div className="plan-page">
      <div className="plan-header">
        <h1>🗓 План підбору</h1>
        <button className="plan-back-btn" onClick={() => navigate("/registry")}>
          {"⬅"} Мої кролики
        </button>
      </div>

      <p className="plan-intro">
        Хто готовий до злучки, хто чекає окролу, а хто ще годує малих.
      </p>

      {loadError && <p className="plan-error">{loadError}</p>}

      {loading ? (
        <div className="plan-loading">
          <span className="plan-loading-icon" aria-hidden="true">
            🐰
          </span>
          <span>Завантаження...</span>
        </div>
      ) : (
        <>
          {plans.length > 0 && (
            <div
              className="plan-filter-bar"
              role="group"
              aria-label="Фільтр за статусом"
            >
              <button
                className={`plan-filter-btn${filter === "all" ? " active" : ""}`}
                aria-pressed={filter === "all"}
                onClick={() => setFilter("all")}
              >
                Усі <span className="plan-filter-count">{plans.length}</span>
              </button>
              {STATUS_ORDER.map((status) => (
                <button
                  key={status}
                  className={`plan-filter-btn plan-filter-${status}${
                    filter === status ? " active" : ""
                  }`}
                  aria-pressed={filter === status}
                  onClick={() => setFilter(status)}
                >
                  {STATUS_META[status].icon} {STATUS_META[status].label}{" "}
                  <span className="plan-filter-count">{counts[status]}</span>
                </button>
              ))}
            </div>
          )}

          {plans.length === 0 && !loadError ? (
            <div className="plan-empty-state">
              <div className="plan-empty-illustration">🐰</div>
              <h3 className="plan-empty-title">Самок ще немає</h3>
              <p className="plan-empty-desc">
                Додайте самок у розділі «Мої кролики», і тут з'явиться план: хто
                готовий до злучки.
              </p>
            </div>
          ) : visiblePlans.length === 0 && !loadError ? (
            <p className="plan-empty-filter">У цій групі зараз нікого.</p>
          ) : (
            <div className="plan-list">
              {visiblePlans.map((plan, index) => (
                <PlanCard
                  key={plan.rabbit.id}
                  plan={plan}
                  index={index}
                  options={
                    plan.rabbit.id === openFemaleId ? openOptions : NO_OPTIONS
                  }
                  pickerOpen={plan.rabbit.id === openFemaleId}
                  onTogglePicker={() => {
                    setCreateError("");
                    setOpenFemaleId((prev) =>
                      prev === plan.rabbit.id ? null : plan.rabbit.id,
                    );
                  }}
                  plannedLabel={(() => {
                    const next = plannedByFemale.get(plan.rabbit.id)?.[0];
                    return next
                      ? `Заплановано: ${formatDateUA(next.planned_date)}, ♂ ${rabbitName(next.male_id)}`
                      : null;
                  })()}
                  plannedForFemale={
                    plannedByFemale.get(plan.rabbit.id) ?? NO_RECORDS
                  }
                  saving={saving}
                  createError={
                    plan.rabbit.id === openFemaleId ? createError : ""
                  }
                  today={today}
                  onCreatePlan={handleCreatePlan}
                />
              ))}
            </div>
          )}

          {recordsError && <p className="plan-error">{recordsError}</p>}
          <PlanQueue
            records={records}
            rabbitName={rabbitName}
            today={today}
            busyId={busyId}
            error={actionError}
            showHistory={showHistory}
            onToggleHistory={() => setShowHistory((v) => !v)}
            onDone={(r) => void handleDone(r)}
            onSetStatus={(r, status) => void handleSetStatus(r, status)}
            onDelete={(r) => void handleDeleteRecord(r)}
          />
        </>
      )}
    </div>
  );
}
