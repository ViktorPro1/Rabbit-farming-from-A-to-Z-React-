// Усі типи сторінки «Статистика» в одному місці.

export interface RabbitStat {
  id: string;
  name: string;
  breed: string;
  gender: "male" | "female";
  matingsCount: number;
  littersCount: number;
  totalBorn: number;
  totalAlive: number;
  avgAlive: number;
  survivalRate: number;
  pairs: {
    partnerId: string;
    partnerName: string;
    littersCount: number;
    totalAlive: number;
  }[];
}

export interface PairStat {
  maleId: string;
  maleName: string;
  maleBreed: string;
  femaleId: string;
  femaleName: string;
  femaleBreed: string;
  matingsCount: number;
  littersCount: number;
  totalBorn: number;
  totalAlive: number;
  avgAlive: number;
}

export interface CageStat {
  cage: string;
  matingsCount: number;
  littersCount: number;
  totalBorn: number;
  totalAlive: number;
  avgAlive: number;
  rabbits: string[];
}

export interface AccuracyEntry {
  litterId: string;
  femaleId: string;
  femaleName: string;
  femaleBreed: string;
  femaleCage: string;
  expectedDate: string;
  actualDate: string;
  diffDays: number;
}

export interface FemaleAccuracyStat {
  femaleId: string;
  femaleName: string;
  femaleBreed: string;
  femaleCage: string;
  entries: AccuracyEntry[];
  avgDiff: number;
  onTimeCount: number;
  lateCount: number;
  earlyCount: number;
}

export interface SlaughteredCage {
  id: string;
  cage_number: string;
  breed: string;
  males: number;
  females: number;
  unknown: number;
  birth_date: string;
  slaughtered_at: string;
  notes: string;
}

export interface SaleRecord {
  id: string;
  males: number;
  females: number;
  unknown: number;
  sold_at: string;
}

export interface FailureEntry {
  litterId: string;
  type: "empty" | "lost";
  matingDate: string;
  failureDate: string;
  maleName: string;
}

export interface FemaleFailureStat {
  femaleId: string;
  femaleName: string;
  femaleBreed: string;
  femaleCage: string;
  entries: FailureEntry[];
  emptyCount: number;
  lostCount: number;
  littersCount: number;
}

export interface MonthlyStat {
  month: string; // "2026-06"
  totalBorn: number;
  totalAlive: number;
  totalSlaughtered: number;
  totalSold: number;
}

// ── Дані для вкладки «Зважування»: агреговано по всіх клітках відгодівлі ──

export interface FatteningRow {
  id: string;
  cage_number: string;
  birth_date: string | null;
  is_active: boolean;
  slaughtered_at: string | null;
  males: number | null;
  females: number | null;
  unknown: number | null;
}

export interface WeighingRow {
  id: string;
  fattening_id: string | null;
  weighing_date: string;
  weight_g: number;
  is_final: boolean;
}

export interface ClosedCycle {
  cage: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  finalAvgWeight: number;
  monthKey: string; // за датою забою, напр. "2026-06"
}

export interface ActiveCageStat {
  cage: string;
  heads: number;
  latestWeight: number | null;
  latestDate: string | null;
  daysInCycle: number | null;
}

// ── Типи для розрахунку статистики з урахуванням фактичних батьків окролу ──

export interface RabbitRef {
  id?: string;
  name: string;
  breed?: string | null;
  cage_number?: string | null;
}

export interface MatingRow {
  id: string;
  female_id: string;
  male_id: string;
  mating_date: string | null;
  female_cage: string | null;
  male_cage: string | null;
  female: RabbitRef | null;
  male: RabbitRef | null;
}

export interface LitterRow {
  id: string;
  mating_id: string;
  birth_date: string | null;
  total_born: number | null;
  alive: number | null;
  litter_mating_date: string | null;
  litter_expected_birth: string | null;
  failure_type: "empty" | "lost" | null;
  actual_male_id: string | null;
  actual_female_id: string | null;
}

export interface Person {
  id: string;
  name: string;
  breed: string;
  cage: string;
}

export interface Delta {
  matings: number;
  litters: number;
  born: number;
  alive: number;
}

export type StatsTab =
  | "females"
  | "males"
  | "pairs"
  | "cages"
  | "accuracy"
  | "slaughter"
  | "sales"
  | "overview"
  | "failures"
  | "weighing";

export interface FarmTotals {
  heads: number;
  estimatedWeightG: number;
  cagesWithWeight: number;
  cageCount: number;
}

export interface MonthlyWeightAvg {
  monthKey: string;
  avgWeight: number;
  count: number;
}

export interface MonthlyComparison {
  monthKey: string;
  avgWeight: number;
  avgDuration: number;
}

// Рядки, які сторінка читає з додаткових таблиць (лише потрібні поля)
export interface PaddockLitterRow {
  birth_date: string | null;
  total_born: number | null;
  alive: number | null;
}

export interface RegistryExitRow {
  archive_reason: string | null;
  archive_date: string | null;
}

export interface PersonResolver {
  maleOf: (m: MatingRow, l?: LitterRow) => Person | null;
  femaleOf: (m: MatingRow, l?: LitterRow) => Person | null;
  femaleCageOf: (m: MatingRow, f: Person) => string;
}
