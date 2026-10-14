import type { FailureEntry, StatsTab } from "./types";

// До 10 000 рядків на таблицю — прийнятий ліміт (аудит 2026-09-29);
// при зростанні даних додати пагінацію або попередження.
export const PAGE_END = 9999;

export const LOAD_ERROR = "Не вдалося завантажити статистику. Оновіть сторінку";
export const WEIGHING_LOAD_ERROR =
  "Не вдалося завантажити дані зважування. Оновіть сторінку";

export const MONTH_NAMES_FULL = [
  "Січень",
  "Лютий",
  "Березень",
  "Квітень",
  "Травень",
  "Червень",
  "Липень",
  "Серпень",
  "Вересень",
  "Жовтень",
  "Листопад",
  "Грудень",
];

export const MONTH_NAMES_SHORT = [
  "Січ",
  "Лют",
  "Бер",
  "Кві",
  "Тра",
  "Чер",
  "Лип",
  "Сер",
  "Вер",
  "Жов",
  "Лис",
  "Гру",
];

export const FAILURE_LABELS: Record<FailureEntry["type"], string> = {
  empty: "Не окотилась",
  lost: "Розкидала, малюки завмерли",
};

export const STATS_TABS: { id: StatsTab; label: string }[] = [
  { id: "females", label: "♀ Крольчихи" },
  { id: "males", label: "♂ Кролики" },
  { id: "pairs", label: "❤️ Пари" },
  { id: "cages", label: "🏠 Клітки" },
  { id: "accuracy", label: "🗓 Точність окролу" },
  { id: "slaughter", label: "🔪 Забої" },
  { id: "sales", label: "💰 Продажі" },
  { id: "overview", label: "📈 Огляд" },
  { id: "failures", label: "Невдалі окроли" },
  { id: "weighing", label: "⚖️ Зважування" },
];
