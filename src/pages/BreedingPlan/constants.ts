import type { RecordStatus, PlanStatus, PairLevel } from "./types";

export const RECORD_META: Record<
  RecordStatus,
  { icon: string; label: string }
> = {
  planned: { icon: "📝", label: "Заплановано" },
  done: { icon: "✅", label: "Виконано" },
  cancelled: { icon: "✖️", label: "Відмінено" },
};

/** Тривалість вагітності: така сама, як у Matings (очікуваний окріл = злучка + 31 день). */
export const PREGNANCY_DAYS = 31;

/** За скільки днів до окролу показуємо позначку «скоро». */
export const SOON_DAYS = 3;

export const STATUS_META: Record<PlanStatus, { icon: string; label: string }> =
  {
    overdue: { icon: "🚨", label: "Окріл прострочено" },
    ready: { icon: "💞", label: "Готова до злучки" },
    pregnant: { icon: "⏳", label: "Очікуємо окріл" },
    nursing: { icon: "🍼", label: "Годує малих" },
    young: { icon: "⚠️", label: "Зарано (до 4 міс.)" },
  };

/** Порядок статусів у фільтрі та в сортуванні. */
export const STATUS_ORDER: PlanStatus[] = [
  "overdue",
  "ready",
  "pregnant",
  "nursing",
  "young",
];

/** Скільки поколінь предків перевіряємо. */
export const PEDIGREE_GENERATIONS = 3;

/** Від скількох злучок за 7 днів самця вважаємо перевантаженим. */
export const MALE_WEEK_LIMIT = 2;

export const PAIR_META: Record<PairLevel, { icon: string; label: string }> = {
  danger: { icon: "⛔", label: "Не можна" },
  warn: { icon: "⚠️", label: "Обережно" },
  ok: { icon: "✅", label: "Можна" },
  unknown: { icon: "❔", label: "Немає даних" },
};

/** Порядок у списку: спершу ті, кого можна, наприкінці ті, кого не можна. */
export const PAIR_ORDER: PairLevel[] = ["ok", "unknown", "warn", "danger"];

export const MALE_ANCESTOR = ["", "Батько", "Дід", "Прадід"];
