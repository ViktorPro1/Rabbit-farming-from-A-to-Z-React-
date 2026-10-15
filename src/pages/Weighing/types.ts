// Усі типи сторінки «Зважування».

export type WeighingType = "breeding" | "fattening";
export type SizeCategory = "meat" | "large" | "decorative";

export interface WeighingRecord {
  id: string;
  litter_label: string;
  rabbit_name: string;
  weighing_date: string;
  weight_g: number;
  notes: string;
  weighing_type: WeighingType;
  is_final: boolean;
  rabbit_id: string | null;
  fattening_id: string | null;
  size_category: SizeCategory | null;
}

export interface RabbitOption {
  id: string;
  name: string;
  birth_date: string | null;
  cage_number: string;
  reminder_days: number | null;
}

export interface FatteningOption {
  id: string;
  cage_number: string;
  birth_date: string | null;
  reminder_days: number | null;
}

export interface MonthGroup {
  monthKey: string;
  monthLabel: string;
  avgWeight: number;
  count: number;
  records: WeighingRecord[];
}

// Цикл відгодівлі: серія записів у клітці від заселення до фінального
// зважування (is_final = true).
export interface WeighingCycle {
  cycleIndex: number;
  records: WeighingRecord[];
  startDate: string;
  endDate: string;
  isClosed: boolean;
  durationDays: number;
  finalAvgWeight: number | null;
}

export interface BatchMassPoint {
  date: string;
  heads: number;
  weightG: number;
  totalKg: number;
}

export interface BatchMass {
  first: BatchMassPoint | null;
  last: BatchMassPoint | null;
  isClosed: boolean;
}

// Інформація про одну групу (клітку) в поточному режимі.
export interface GroupInfo {
  litter: string;
  sorted: WeighingRecord[];
  groupType: WeighingType;
  activeCycle: WeighingCycle | undefined;
  closedCycles: WeighingCycle[];
}

export type GaugeZone = "green" | "yellow" | "red" | "unknown";

export interface AgeWeightRow {
  ageDays: number;
  meat: [number, number];
  large: [number, number];
  decorative: [number, number];
}

export interface GaugeMetric {
  value: number;
  arcMax: number;
  zone: GaugeZone;
  unit: string;
  caption: string;
  expectedLabel: string | null;
}

export interface RecordStatus {
  zone: GaugeZone;
  label: string;
  arrow: string;
}

export type ReminderZone = "overdue" | "soon" | "ok" | "none";
export type ReminderEntityType = "rabbit" | "fattening";

export interface ReminderInfo {
  entityType: ReminderEntityType | null;
  entityId: string | null;
  reminderDays: number | null;
  dueDate: string | null;
  daysUntil: number | null;
  zone: ReminderZone;
}

export interface WeighingFormState {
  litter_label: string;
  rabbit_name: string;
  weighing_date: string;
  weight_g: string;
  notes: string;
  weighing_type: WeighingType;
  is_final: boolean;
  rabbit_id: string;
  fattening_id: string;
  size_category: SizeCategory;
}

export interface ReminderPromptState {
  entityType: ReminderEntityType;
  entityId: string;
  label: string;
}

// Значення, що залежать від типу зважування (племінне / відгодівля)
export interface TypeSpecificValues {
  weighing_type: WeighingType;
  rabbit_id: string;
  fattening_id: string;
  size_category: SizeCategory;
}

export type TypeSpecificPatch = Partial<TypeSpecificValues> & {
  litter_label?: string;
  rabbit_name?: string;
};

export interface HeadsRow {
  id: string;
  cage_number: string | null;
  birth_date: string | null;
  slaughtered_at: string | null;
  males: number | null;
  females: number | null;
  unknown: number | null;
}

export interface BatchRow {
  litter: string;
  cycle: WeighingCycle;
  mass: BatchMassPoint | null;
}

export interface BatchGroup {
  key: string;
  startDate: string;
  endDate: string;
  heads: number;
  totalKg: number;
  missing: number;
  isClosed: boolean;
}

// Спільне для карток записів: який запис редагується, готова форма
// редагування і дії над записом.
export interface RecordViewProps {
  editingId: string | null;
  editForm: import("react").ReactNode;
  onStartEdit: (r: WeighingRecord) => void;
  onDelete: (id: string) => void;
  rabbitById: Record<string, RabbitOption>;
  fatteningById: Record<string, FatteningOption>;
}
