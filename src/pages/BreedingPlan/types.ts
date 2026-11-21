// ── Типи рядків з бази (тільки поля, які потрібні сторінці) ──

export interface RabbitRow {
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

export interface MatingRow {
  id: string;
  female_id: string;
  male_id: string;
  mating_date: string;
  control_date: string | null;
  expected_birth: string | null;
  is_archived: boolean | null;
}

export interface LitterRow {
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

export type PlanStatus = "overdue" | "ready" | "pregnant" | "nursing" | "young";
export type Filter = "all" | PlanStatus;

export interface PregnancyInfo {
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

export interface NursingInfo {
  birthDate: string;
  daysSince: number;
  alive: number | null;
}

export interface LastLitterInfo {
  birthDate: string;
  alive: number | null;
  totalBorn: number | null;
}

export interface FemalePlan {
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

export type RecordStatus = "planned" | "done" | "cancelled";

export interface PlanRecord {
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

export interface NewPlanInput {
  femaleId: string;
  maleId: string;
  backupMaleId: string | null;
  plannedDate: string;
  notes: string;
}

export type PairLevel = "danger" | "warn" | "ok" | "unknown";

export interface PairAssessment {
  level: PairLevel;
  text: string;
}

export interface MaleOption {
  rabbit: RabbitRow;
  pairing: PairAssessment;
  /** Остання злучка самця (будь-з якою самкою). */
  lastMating: string | null;
  /** Скільки злучок було за останні 7 днів. */
  matingsLast7Days: number;
}
