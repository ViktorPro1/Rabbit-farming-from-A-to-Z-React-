import type {
  AgeWeightRow,
  GaugeZone,
  SizeCategory,
  WeighingFormState,
} from "./types";

export const emptyForm: WeighingFormState = {
  litter_label: "",
  rabbit_name: "",
  weighing_date: "",
  weight_g: "",
  notes: "",
  weighing_type: "breeding",
  is_final: false,
  rabbit_id: "",
  fattening_id: "",
  size_category: "meat",
};

// Ті самі рядки, що й у довідковій таблиці нижче на сторінці.
export const AGE_WEIGHT_TABLE: AgeWeightRow[] = [
  { ageDays: 0, meat: [40, 80], large: [60, 100], decorative: [30, 60] },
  { ageDays: 7, meat: [100, 150], large: [120, 180], decorative: [70, 100] },
  { ageDays: 14, meat: [200, 280], large: [250, 320], decorative: [150, 200] },
  { ageDays: 21, meat: [350, 450], large: [400, 520], decorative: [250, 320] },
  { ageDays: 28, meat: [500, 650], large: [600, 750], decorative: [350, 450] },
  { ageDays: 35, meat: [700, 900], large: [850, 1050], decorative: [450, 600] },
  {
    ageDays: 45,
    meat: [900, 1100],
    large: [1100, 1350],
    decorative: [600, 750],
  },
  {
    ageDays: 60,
    meat: [1300, 1600],
    large: [1600, 2000],
    decorative: [800, 1000],
  },
  {
    ageDays: 75,
    meat: [1800, 2200],
    large: [2200, 2700],
    decorative: [1000, 1300],
  },
  {
    ageDays: 90,
    meat: [2200, 2700],
    large: [2800, 3400],
    decorative: [1200, 1600],
  },
  {
    ageDays: 120,
    meat: [2800, 3400],
    large: [3500, 4500],
    decorative: [1500, 2000],
  },
  {
    ageDays: 182,
    meat: [3500, 4500],
    large: [4500, 6000],
    decorative: [1800, 2500],
  },
  {
    ageDays: 365,
    meat: [4000, 5500],
    large: [5500, 8000],
    decorative: [2000, 3000],
  },
];

export const SIZE_CATEGORY_LABEL: Record<SizeCategory, string> = {
  meat: "М'ясна порода",
  large: "Велика порода",
  decorative: "Декоративна порода",
};

export const GAUGE_ZONE_LABEL: Record<GaugeZone, string> = {
  green: "у нормі",
  yellow: "на межі",
  red: "поза нормою",
  unknown: "вік невідомий",
};

export const LOAD_RECORDS_ERROR =
  "Не вдалося завантажити записи зважування. Оновіть сторінку";
export const LOAD_OPTIONS_ERROR =
  "Не вдалося завантажити списки кроликів і кліток. Оновіть сторінку";
export const SAVE_REMINDER_ERROR =
  "Не вдалося зберегти інтервал нагадування. Спробуйте ще раз";
export const DELETE_ERROR = "Не вдалося видалити запис. Спробуйте ще раз";
