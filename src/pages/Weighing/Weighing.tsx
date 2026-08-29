import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import "./Weighing.css";

interface Props {
  session: Session;
}

type WeighingType = "breeding" | "fattening";
type SizeCategory = "meat" | "large" | "decorative";

interface WeighingRecord {
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

interface RabbitOption {
  id: string;
  name: string;
  birth_date: string | null;
  cage_number: string;
  reminder_days: number | null;
}

interface FatteningOption {
  id: string;
  cage_number: string;
  birth_date: string | null;
  reminder_days: number | null;
}

const emptyForm = {
  litter_label: "",
  rabbit_name: "",
  weighing_date: "",
  weight_g: "",
  notes: "",
  weighing_type: "breeding" as WeighingType,
  is_final: false,
  rabbit_id: "",
  fattening_id: "",
  size_category: "meat" as SizeCategory,
};

interface MonthGroup {
  monthKey: string;
  monthLabel: string;
  avgWeight: number;
  count: number;
  records: WeighingRecord[];
}

function groupWeighingsByMonth(list: WeighingRecord[]): MonthGroup[] {
  const map: Record<string, WeighingRecord[]> = {};
  list.forEach((r) => {
    const d = new Date(r.weighing_date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!map[key]) map[key] = [];
    map[key].push(r);
  });

  return Object.entries(map)
    .map(([key, records]) => {
      const [y, m] = key.split("-");
      const label = new Date(Number(y), Number(m) - 1).toLocaleDateString(
        "uk-UA",
        { month: "long", year: "numeric" },
      );
      const sortedRecords = [...records].sort(
        (a, b) =>
          new Date(a.weighing_date).getTime() -
          new Date(b.weighing_date).getTime(),
      );
      const sum = records.reduce((s, r) => s + r.weight_g, 0);
      return {
        monthKey: key,
        monthLabel: label.charAt(0).toUpperCase() + label.slice(1),
        avgWeight: Math.round(sum / records.length),
        count: records.length,
        records: sortedRecords,
      };
    })
    .sort((a, b) => a.monthKey.localeCompare(b.monthKey));
}

// ── Цикли відгодівлі ──
// Один цикл — це серія записів у клітці від заселення до фінального
// зважування (is_final = true) перед забоєм. Після фінального зважування
// наступні записи в тій самій клітці автоматично належать новому циклу.
interface WeighingCycle {
  cycleIndex: number;
  records: WeighingRecord[];
  startDate: string;
  endDate: string;
  isClosed: boolean;
  durationDays: number;
  finalAvgWeight: number | null;
}

function buildCycle(
  records: WeighingRecord[],
  cycleIndex: number,
  isClosed: boolean,
): WeighingCycle {
  const start = records[0].weighing_date;
  const end = records[records.length - 1].weighing_date;
  const durationDays = Math.round(
    (new Date(end).getTime() - new Date(start).getTime()) /
      (1000 * 60 * 60 * 24),
  );
  const finalRecords = records.filter((r) => r.is_final);
  const finalAvgWeight =
    isClosed && finalRecords.length
      ? Math.round(
          finalRecords.reduce((s, r) => s + r.weight_g, 0) /
            finalRecords.length,
        )
      : null;

  return {
    cycleIndex,
    records,
    startDate: start,
    endDate: end,
    isClosed,
    durationDays,
    finalAvgWeight,
  };
}

function splitIntoCycles(sorted: WeighingRecord[]): WeighingCycle[] {
  const cycles: WeighingCycle[] = [];
  let current: WeighingRecord[] = [];
  let cycleIndex = 1;

  sorted.forEach((r) => {
    current.push(r);
    if (r.is_final) {
      cycles.push(buildCycle(current, cycleIndex, true));
      current = [];
      cycleIndex += 1;
    }
  });

  if (current.length > 0) {
    cycles.push(buildCycle(current, cycleIndex, false));
  }

  return cycles;
}

// ══════════════════════════════════════════════════════════════════════
// ГЕЙДЖІ: мінімальна вага / приріст за добу / максимальна вага
// Порівнюємо не з вигаданими числами, а з тією ж таблицею "Орієнтовна вага
// кроля за віком", яка вже показана нижче на сторінці — тільки автоматично,
// за реальним віком кожного запису (з дати народження зв'язаного кролика чи
// клітки відгодівлі).
// ══════════════════════════════════════════════════════════════════════

type GaugeZone = "green" | "yellow" | "red" | "unknown";

interface AgeWeightRow {
  ageDays: number;
  meat: [number, number];
  large: [number, number];
  decorative: [number, number];
}

// Ті самі рядки, що й у довідковій таблиці нижче на сторінці.
const AGE_WEIGHT_TABLE: AgeWeightRow[] = [
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

const SIZE_CATEGORY_LABEL: Record<SizeCategory, string> = {
  meat: "М'ясна порода",
  large: "Велика порода",
  decorative: "Декоративна порода",
};

function ageDaysAt(birthDate: string, atDate: string): number {
  const b = new Date(birthDate).getTime();
  const a = new Date(atDate).getTime();
  return Math.round((a - b) / (1000 * 60 * 60 * 24));
}

// Лінійна інтерполяція між найближчими рядками таблиці за віком у днях.
function getExpectedRange(
  ageDays: number,
  category: SizeCategory,
): [number, number] {
  const rows = AGE_WEIGHT_TABLE;
  const clampedAge = Math.max(0, ageDays);

  if (clampedAge <= rows[0].ageDays) return rows[0][category];
  if (clampedAge >= rows[rows.length - 1].ageDays) {
    return rows[rows.length - 1][category];
  }

  for (let i = 0; i < rows.length - 1; i++) {
    const a = rows[i];
    const b = rows[i + 1];
    if (clampedAge >= a.ageDays && clampedAge <= b.ageDays) {
      const t = (clampedAge - a.ageDays) / (b.ageDays - a.ageDays);
      const min = a[category][0] + t * (b[category][0] - a[category][0]);
      const max = a[category][1] + t * (b[category][1] - a[category][1]);
      return [Math.round(min), Math.round(max)];
    }
  }
  return rows[rows.length - 1][category];
}

// Очікуваний приріст г/добу — нахил кривої середньої ваги в цьому віці.
function getExpectedDailyGain(ageDays: number, category: SizeCategory): number {
  const dt = 5;
  const [lo1, hi1] = getExpectedRange(Math.max(0, ageDays - dt / 2), category);
  const [lo2, hi2] = getExpectedRange(ageDays + dt / 2, category);
  const mid1 = (lo1 + hi1) / 2;
  const mid2 = (lo2 + hi2) / 2;
  return (mid2 - mid1) / dt;
}

function zoneFromRange(value: number, [min, max]: [number, number]): GaugeZone {
  if (value < min) {
    return value >= min * 0.85 ? "yellow" : "red";
  }
  if (value > max) {
    return value <= max * 1.15 ? "yellow" : "red";
  }
  return "green";
}

// Для приросту важливіше не відставати від норми — надмірно швидкий
// приріст не позначаємо як проблему.
function zoneForGain(actual: number, expected: number): GaugeZone {
  if (expected <= 0) return "unknown";
  const ratio = actual / expected;
  if (ratio >= 0.85) return "green";
  if (ratio >= 0.6) return "yellow";
  return "red";
}

function mostFrequentCategory(cats: SizeCategory[]): SizeCategory {
  const counts: Record<string, number> = {};
  cats.forEach((c) => {
    counts[c] = (counts[c] || 0) + 1;
  });
  let best: SizeCategory = "meat";
  let bestCount = -1;
  (Object.keys(counts) as SizeCategory[]).forEach((c) => {
    if (counts[c] > bestCount) {
      best = c;
      bestCount = counts[c];
    }
  });
  return best;
}

const GAUGE_ZONE_LABEL: Record<GaugeZone, string> = {
  green: "у нормі",
  yellow: "на межі",
  red: "поза нормою",
  unknown: "вік невідомий",
};

interface GaugeMetric {
  value: number;
  arcMax: number;
  zone: GaugeZone;
  unit: string;
  caption: string;
  expectedLabel: string | null;
}

function buildGaugeMetrics(
  list: WeighingRecord[],
  rabbitById: Record<string, RabbitOption>,
  fatteningById: Record<string, FatteningOption>,
): { min: GaugeMetric; gain: GaugeMetric; max: GaugeMetric } | null {
  if (list.length === 0) return null;

  function getAge(r: WeighingRecord): number | null {
    if (r.rabbit_id && rabbitById[r.rabbit_id]?.birth_date) {
      return ageDaysAt(
        rabbitById[r.rabbit_id].birth_date as string,
        r.weighing_date,
      );
    }
    if (r.fattening_id && fatteningById[r.fattening_id]?.birth_date) {
      return ageDaysAt(
        fatteningById[r.fattening_id].birth_date as string,
        r.weighing_date,
      );
    }
    return null;
  }

  function getCategory(r: WeighingRecord): SizeCategory {
    return r.size_category || "meat";
  }

  const minRecord = list.reduce(
    (m, r) => (r.weight_g < m.weight_g ? r : m),
    list[0],
  );
  const maxRecord = list.reduce(
    (m, r) => (r.weight_g > m.weight_g ? r : m),
    list[0],
  );

  const minAge = getAge(minRecord);
  const minRange =
    minAge == null ? null : getExpectedRange(minAge, getCategory(minRecord));
  const minZone: GaugeZone =
    minRange == null ? "unknown" : zoneFromRange(minRecord.weight_g, minRange);

  const maxAge = getAge(maxRecord);
  const maxRange =
    maxAge == null ? null : getExpectedRange(maxAge, getCategory(maxRecord));
  const maxZone: GaugeZone =
    maxRange == null ? "unknown" : zoneFromRange(maxRecord.weight_g, maxRange);

  const gains = collectDailyGains(list);
  const avgGain = gains.length
    ? gains.reduce((s, g) => s + g, 0) / gains.length
    : 0;

  const knownAges = list.map(getAge).filter((a): a is number => a != null);
  const avgAge = knownAges.length
    ? knownAges.reduce((s, a) => s + a, 0) / knownAges.length
    : null;
  const category = mostFrequentCategory(list.map(getCategory));
  const expectedGain =
    avgAge == null ? null : getExpectedDailyGain(avgAge, category);
  const gainZone: GaugeZone =
    expectedGain == null ? "unknown" : zoneForGain(avgGain, expectedGain);

  return {
    min: {
      value: minRecord.weight_g,
      arcMax: minRange
        ? Math.round(minRange[1] * 1.25)
        : Math.round(minRecord.weight_g * 1.4),
      zone: minZone,
      unit: "г",
      caption: "мінімальна вага",
      expectedLabel: minRange
        ? `норма: ${minRange[0]}–${minRange[1]} г`
        : "додай дату народження",
    },
    gain: {
      value: Math.round(avgGain * 10) / 10,
      arcMax: expectedGain
        ? Math.round(expectedGain * 2)
        : Math.max(Math.round(avgGain * 2), 10),
      zone: gainZone,
      unit: "г/добу",
      caption: "приріст за добу",
      expectedLabel: expectedGain
        ? `норма: ~${expectedGain.toFixed(1)} г/добу`
        : "додай дату народження",
    },
    max: {
      value: maxRecord.weight_g,
      arcMax: maxRange
        ? Math.round(maxRange[1] * 1.25)
        : Math.round(maxRecord.weight_g * 1.4),
      zone: maxZone,
      unit: "г",
      caption: "максимальна вага",
      expectedLabel: maxRange
        ? `норма: ${maxRange[0]}–${maxRange[1]} г`
        : "додай дату народження",
    },
  };
}

// Приріст г/добу для кожної пари послідовних зважувань одного кролика/клітки
function collectDailyGains(list: WeighingRecord[]): number[] {
  const byKey: Record<string, WeighingRecord[]> = {};
  list.forEach((r) => {
    const key =
      r.rabbit_id ||
      r.fattening_id ||
      `${r.litter_label}__${r.rabbit_name || ""}`;
    if (!byKey[key]) byKey[key] = [];
    byKey[key].push(r);
  });
  const gains: number[] = [];
  Object.values(byKey).forEach((arr) => {
    const sorted = [...arr].sort(
      (a, b) =>
        new Date(a.weighing_date).getTime() -
        new Date(b.weighing_date).getTime(),
    );
    for (let i = 1; i < sorted.length; i++) {
      const days =
        (new Date(sorted[i].weighing_date).getTime() -
          new Date(sorted[i - 1].weighing_date).getTime()) /
        (1000 * 60 * 60 * 24);
      if (days > 0) {
        gains.push((sorted[i].weight_g - sorted[i - 1].weight_g) / days);
      }
    }
  });
  return gains;
}

function WeighingGauge({ metric }: { metric: GaugeMetric }) {
  const { value, arcMax, zone, unit, caption, expectedLabel } = metric;
  const pct = arcMax > 0 ? Math.max(0, Math.min(1, value / arcMax)) : 0;

  const size = 108;
  const stroke = 9;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const startAngle = 135;
  const sweep = 270;

  const polarToCartesian = (angleDeg: number) => {
    const a = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };

  const describeArc = (startDeg: number, endDeg: number) => {
    const start = polarToCartesian(endDeg);
    const end = polarToCartesian(startDeg);
    const largeArcFlag = endDeg - startDeg <= 180 ? 0 : 1;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  };

  const trackPath = describeArc(startAngle, startAngle + sweep);
  const fillPath = describeArc(startAngle, startAngle + sweep * pct);

  return (
    <div className="weighing-gauge">
      <div
        className="weighing-gauge-ring"
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} style={{ overflow: "visible" }}>
          <path
            d={trackPath}
            fill="none"
            className="weighing-gauge-track"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          {pct > 0 && (
            <path
              d={fillPath}
              fill="none"
              className={`weighing-gauge-fill weighing-gauge-fill-${zone}`}
              strokeWidth={stroke}
              strokeLinecap="round"
            />
          )}
        </svg>
        <div className="weighing-gauge-center">
          <span className="weighing-gauge-value">
            {value.toLocaleString("uk-UA")}
          </span>
          <span className="weighing-gauge-unit">{unit}</span>
        </div>
      </div>
      <div className="weighing-gauge-caption">{caption}</div>
      <div className={`weighing-gauge-zone weighing-gauge-zone-${zone}`}>
        {GAUGE_ZONE_LABEL[zone]}
      </div>
      {expectedLabel && (
        <div className="weighing-gauge-expected">{expectedLabel}</div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// БЕЙДЖ СТАТУСУ ОКРЕМОГО ЗАПИСУ
// Те саме порівняння з таблицею норм, що й у гейджах вище, але для одного
// конкретного зважування — щоб було видно "мала / у нормі / велика вага"
// прямо в картці, не гортаючи список.
// ══════════════════════════════════════════════════════════════════════

interface RecordStatus {
  zone: GaugeZone;
  label: string;
  arrow: string;
}

function describeRecordStatus(
  r: WeighingRecord,
  rabbitById: Record<string, RabbitOption>,
  fatteningById: Record<string, FatteningOption>,
): RecordStatus {
  let birthDate: string | null = null;
  if (r.rabbit_id && rabbitById[r.rabbit_id]?.birth_date) {
    birthDate = rabbitById[r.rabbit_id].birth_date as string;
  } else if (r.fattening_id && fatteningById[r.fattening_id]?.birth_date) {
    birthDate = fatteningById[r.fattening_id].birth_date as string;
  }

  if (!birthDate) {
    return { zone: "unknown", label: "вік невідомий", arrow: "?" };
  }

  const age = ageDaysAt(birthDate, r.weighing_date);
  const category = r.size_category || "meat";
  const range = getExpectedRange(age, category);
  const zone = zoneFromRange(r.weight_g, range);

  if (zone === "green") {
    return { zone, label: "у нормі", arrow: "✓" };
  }

  const isLow = r.weight_g < range[0];
  if (zone === "yellow") {
    return {
      zone,
      label: isLow ? "трохи мала" : "трохи велика",
      arrow: isLow ? "↓" : "↑",
    };
  }
  return {
    zone,
    label: isLow ? "мала вага" : "велика вага",
    arrow: isLow ? "↓" : "↑",
  };
}

function RecordStatusBadge({ status }: { status: RecordStatus }) {
  return (
    <span
      className={`weighing-status-badge weighing-status-badge-${status.zone}`}
    >
      <span className="weighing-status-arrow">{status.arrow}</span>
      {status.label}
    </span>
  );
}

// ══════════════════════════════════════════════════════════════════════
// НАГАДУВАННЯ ПРО НАСТУПНЕ ЗВАЖУВАННЯ
// Інтервал (у днях) задається окремо для кожної клітки/кролика — зберігається
// в колонці reminder_days у таблицях rabbits / fattening. Відлік — від дати
// останнього зважування в групі. Якщо інтервал не заданий — нагадування не
// показується (крім підказки, що його можна встановити).
// ══════════════════════════════════════════════════════════════════════

type ReminderZone = "overdue" | "soon" | "ok" | "none";
type ReminderEntityType = "rabbit" | "fattening";

interface ReminderInfo {
  entityType: ReminderEntityType | null;
  entityId: string | null;
  reminderDays: number | null;
  dueDate: string | null;
  daysUntil: number | null;
  zone: ReminderZone;
}

function computeReminderInfo(
  sorted: WeighingRecord[],
  rabbitById: Record<string, RabbitOption>,
  fatteningById: Record<string, FatteningOption>,
): ReminderInfo {
  if (sorted.length === 0) {
    return {
      entityType: null,
      entityId: null,
      reminderDays: null,
      dueDate: null,
      daysUntil: null,
      zone: "none",
    };
  }

  const last = sorted[sorted.length - 1];
  let entityType: ReminderEntityType | null = null;
  let entityId: string | null = null;
  let reminderDays: number | null = null;

  if (last.rabbit_id && rabbitById[last.rabbit_id]) {
    entityType = "rabbit";
    entityId = last.rabbit_id;
    reminderDays = rabbitById[last.rabbit_id].reminder_days;
  } else if (last.fattening_id && fatteningById[last.fattening_id]) {
    entityType = "fattening";
    entityId = last.fattening_id;
    reminderDays = fatteningById[last.fattening_id].reminder_days;
  }

  if (!entityType || !reminderDays) {
    return {
      entityType,
      entityId,
      reminderDays: reminderDays ?? null,
      dueDate: null,
      daysUntil: null,
      zone: "none",
    };
  }

  const due = new Date(last.weighing_date);
  due.setDate(due.getDate() + reminderDays);
  due.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysUntil = Math.round(
    (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  let zone: ReminderZone = "ok";
  if (daysUntil < 0) zone = "overdue";
  else if (daysUntil <= 2) zone = "soon";

  return {
    entityType,
    entityId,
    reminderDays,
    dueDate: due.toISOString().slice(0, 10),
    daysUntil,
    zone,
  };
}

function ReminderBadge({
  info,
  onChangeInterval,
}: {
  info: ReminderInfo;
  onChangeInterval: (days: number | null) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  function startEditing() {
    setDraft(info.reminderDays ? String(info.reminderDays) : "");
    setEditing(true);
  }

  if (!info.entityType) {
    return (
      <span className="weighing-reminder weighing-reminder-none">
        🔔 нагадування недоступне без прив'язки до реєстру
      </span>
    );
  }

  function save() {
    const trimmed = draft.trim();
    const n = trimmed === "" ? null : Number(trimmed);
    onChangeInterval(n && n > 0 ? Math.round(n) : null);
    setEditing(false);
  }

  if (editing) {
    return (
      <span className="weighing-reminder weighing-reminder-edit">
        🔔 нагадувати кожні
        <input
          type="number"
          min="1"
          value={draft}
          autoFocus
          onChange={(e) => setDraft(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") setEditing(false);
          }}
          className="weighing-reminder-input"
        />
        дн.
      </span>
    );
  }

  let label: string;
  if (info.zone === "overdue") {
    label = `прострочено на ${Math.abs(info.daysUntil ?? 0)} дн.`;
  } else if (info.zone === "soon") {
    label =
      info.daysUntil === 0
        ? "зважити сьогодні"
        : `зважити через ${info.daysUntil} дн.`;
  } else if (info.zone === "ok") {
    label = `наступне зважування: ${
      info.dueDate ? new Date(info.dueDate).toLocaleDateString("uk-UA") : ""
    }`;
  } else {
    label = "натисніть, щоб задати нагадування";
  }

  return (
    <span
      className={`weighing-reminder weighing-reminder-${info.zone}`}
      onClick={startEditing}
      title="Натисніть, щоб змінити інтервал нагадування"
    >
      🔔 {label}
    </span>
  );
}

export default function Weighing({ session }: Props) {
  const [records, setRecords] = useState<WeighingRecord[]>([]);
  const [rabbitOptions, setRabbitOptions] = useState<RabbitOption[]>([]);
  const [fatteningOptions, setFatteningOptions] = useState<FatteningOption[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<WeighingRecord | null>(
    null,
  );
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showWeightChart, setShowWeightChart] = useState(false);
  const [showCycleInfo, setShowCycleInfo] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [openArchives, setOpenArchives] = useState<Record<string, boolean>>({});
  const [gaugeMode, setGaugeMode] = useState<WeighingType>("fattening");
  const [pendingReminderPrompt, setPendingReminderPrompt] = useState<{
    entityType: ReminderEntityType;
    entityId: string;
    label: string;
  } | null>(null);
  const [reminderPromptDraft, setReminderPromptDraft] = useState("");
  const [showReminderInfo, setShowReminderInfo] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecords();
    fetchOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.user.id]);

  async function fetchRecords() {
    setLoading(true);
    const { data } = await supabase
      .from("weighings")
      .select("*")
      .eq("user_id", session.user.id)
      .order("weighing_date", { ascending: true });
    setRecords(data || []);
    setLoading(false);
  }

  async function fetchOptions() {
    const [{ data: rabbitsData }, { data: fatteningData }] = await Promise.all([
      supabase
        .from("rabbits")
        .select("id, name, birth_date, cage_number, reminder_days")
        .eq("user_id", session.user.id)
        .eq("is_active", true)
        .order("cage_number", { ascending: true }),
      supabase
        .from("fattening")
        .select("id, cage_number, birth_date, reminder_days")
        .eq("user_id", session.user.id)
        .eq("is_active", true)
        .order("cage_number", { ascending: true }),
    ]);
    setRabbitOptions(rabbitsData || []);
    setFatteningOptions(fatteningData || []);
  }

  const rabbitById = useMemo(
    () => Object.fromEntries(rabbitOptions.map((r) => [r.id, r])),
    [rabbitOptions],
  );
  const fatteningById = useMemo(
    () => Object.fromEntries(fatteningOptions.map((f) => [f.id, f])),
    [fatteningOptions],
  );

  async function handleReminderIntervalChange(
    entityType: ReminderEntityType,
    entityId: string,
    days: number | null,
  ) {
    const table = entityType === "rabbit" ? "rabbits" : "fattening";
    const { error: updateError } = await supabase
      .from(table)
      .update({ reminder_days: days })
      .eq("id", entityId);
    if (!updateError) {
      fetchOptions();
    }
  }

  async function handleAdd() {
    setSaving(true);
    setError("");
    const { error } = await supabase.from("weighings").insert({
      litter_label: form.litter_label,
      rabbit_name: form.rabbit_name || null,
      weighing_date: form.weighing_date,
      weight_g: Number(form.weight_g),
      notes: form.notes || null,
      weighing_type: form.weighing_type,
      is_final: form.weighing_type === "fattening" ? form.is_final : false,
      rabbit_id:
        form.weighing_type === "breeding" ? form.rabbit_id || null : null,
      fattening_id:
        form.weighing_type === "fattening" ? form.fattening_id || null : null,
      size_category: form.size_category,
      user_id: session.user.id,
    });
    if (error) {
      setError("Помилка збереження");
    } else {
      const entityType: ReminderEntityType | null =
        form.weighing_type === "breeding" ? "rabbit" : "fattening";
      const entityId =
        form.weighing_type === "breeding" ? form.rabbit_id : form.fattening_id;

      if (entityType && entityId) {
        const entity: RabbitOption | FatteningOption | undefined =
          entityType === "rabbit"
            ? rabbitById[entityId]
            : fatteningById[entityId];
        if (entity && !entity.reminder_days) {
          const label =
            entityType === "rabbit"
              ? (entity as RabbitOption).name
              : `Клітка ${(entity as FatteningOption).cage_number}`;
          setReminderPromptDraft("");
          setPendingReminderPrompt({ entityType, entityId, label });
        }
      }

      setForm(emptyForm);
      setShowForm(false);
      fetchRecords();
    }
    setSaving(false);
  }

  function saveReminderPrompt() {
    if (!pendingReminderPrompt) return;
    const n = Number(reminderPromptDraft);
    if (n > 0) {
      handleReminderIntervalChange(
        pendingReminderPrompt.entityType,
        pendingReminderPrompt.entityId,
        Math.round(n),
      );
    }
    setPendingReminderPrompt(null);
    setReminderPromptDraft("");
  }

  async function handleEdit() {
    if (!editingRecord) return;
    setSaving(true);
    setError("");
    const { error } = await supabase
      .from("weighings")
      .update({
        litter_label: editingRecord.litter_label,
        rabbit_name: editingRecord.rabbit_name || null,
        weighing_date: editingRecord.weighing_date,
        weight_g: Number(editingRecord.weight_g),
        notes: editingRecord.notes || null,
        weighing_type: editingRecord.weighing_type,
        is_final:
          editingRecord.weighing_type === "fattening"
            ? editingRecord.is_final
            : false,
        rabbit_id:
          editingRecord.weighing_type === "breeding"
            ? editingRecord.rabbit_id || null
            : null,
        fattening_id:
          editingRecord.weighing_type === "fattening"
            ? editingRecord.fattening_id || null
            : null,
        size_category: editingRecord.size_category || "meat",
      })
      .eq("id", editingRecord.id);
    if (error) {
      setError("Помилка збереження");
    } else {
      setEditingRecord(null);
      fetchRecords();
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Видалити запис?")) return;
    await supabase.from("weighings").delete().eq("id", id);
    fetchRecords();
  }

  // Групування по гніздах (для загальної статистики "Гнізд/груп")
  const groups = records.reduce<Record<string, WeighingRecord[]>>((acc, r) => {
    const key = r.litter_label || "Без назви";
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  function dailyGain(prev: WeighingRecord, curr: WeighingRecord): string {
    const days =
      (new Date(curr.weighing_date).getTime() -
        new Date(prev.weighing_date).getTime()) /
      (1000 * 60 * 60 * 24);
    if (days <= 0) return "—";
    const gain = (curr.weight_g - prev.weight_g) / days;
    return `${gain >= 0 ? "+" : ""}${gain.toFixed(1)} г/добу`;
  }

  const litterCount = Object.keys(groups).length;

  // Записи й групи, відфільтровані під поточний вибір перемикача
  // (Відгодівля / Племінне) — те саме, що живить гейджі, живить і список нижче.
  const modeRecords = useMemo(
    () => records.filter((r) => r.weighing_type === gaugeMode),
    [records, gaugeMode],
  );
  const modeGroups = useMemo(
    () =>
      modeRecords.reduce<Record<string, WeighingRecord[]>>((acc, r) => {
        const key = r.litter_label || "Без назви";
        if (!acc[key]) acc[key] = [];
        acc[key].push(r);
        return acc;
      }, {}),
    [modeRecords],
  );

  const gaugeMetrics = useMemo(
    () => buildGaugeMetrics(modeRecords, rabbitById, fatteningById),
    [modeRecords, rabbitById, fatteningById],
  );

  // Усі закриті цикли відгодівлі по всіх клітках — для порівняння за рік.
  // Показуємо цей блок лише в режимі "Відгодівля".
  const allClosedCycles: Array<{ litter: string; cycle: WeighingCycle }> = [];
  if (gaugeMode === "fattening") {
    Object.entries(modeGroups).forEach(([litter, list]) => {
      const sorted = [...list].sort(
        (a, b) =>
          new Date(a.weighing_date).getTime() -
          new Date(b.weighing_date).getTime(),
      );
      splitIntoCycles(sorted)
        .filter((c) => c.isClosed)
        .forEach((cycle) => allClosedCycles.push({ litter, cycle }));
    });
    allClosedCycles.sort(
      (a, b) =>
        new Date(a.cycle.endDate).getTime() -
        new Date(b.cycle.endDate).getTime(),
    );
  }

  function renderTypeSpecificFields(
    values: {
      weighing_type: WeighingType;
      rabbit_id: string;
      fattening_id: string;
      size_category: SizeCategory;
    },
    onChange: (
      patch: Partial<typeof values> & {
        litter_label?: string;
        rabbit_name?: string;
      },
    ) => void,
  ) {
    return (
      <>
        {values.weighing_type === "breeding" ? (
          <div className="weighing-form-field">
            <label>Кролик з реєстру *</label>
            <select
              value={values.rabbit_id}
              onChange={(e) => {
                const id = e.target.value;
                const r = rabbitById[id];
                onChange({
                  rabbit_id: id,
                  rabbit_name: r ? r.name : "",
                  litter_label: r
                    ? r.cage_number
                      ? `Клітка ${r.cage_number}`
                      : r.name
                    : "",
                });
              }}
            >
              <option value="">Оберіть кролика</option>
              {rabbitOptions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                  {r.cage_number ? ` (кл.${r.cage_number})` : ""}
                  {!r.birth_date ? " · без дати народження" : ""}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="weighing-form-field">
            <label>Клітка відгодівлі *</label>
            <select
              value={values.fattening_id}
              onChange={(e) => {
                const id = e.target.value;
                const f = fatteningById[id];
                onChange({
                  fattening_id: id,
                  litter_label: f ? `Клітка ${f.cage_number}` : "",
                });
              }}
            >
              <option value="">Оберіть клітку</option>
              {fatteningOptions.map((f) => (
                <option key={f.id} value={f.id}>
                  Клітка {f.cage_number}
                  {f.birth_date
                    ? ` · нар. ${new Date(f.birth_date).toLocaleDateString("uk-UA")}`
                    : " · без дати народження"}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="weighing-form-field">
          <label>Категорія породи (для порівняння з нормою)</label>
          <select
            value={values.size_category}
            onChange={(e) =>
              onChange({ size_category: e.target.value as SizeCategory })
            }
          >
            <option value="meat">{SIZE_CATEGORY_LABEL.meat}</option>
            <option value="large">{SIZE_CATEGORY_LABEL.large}</option>
            <option value="decorative">{SIZE_CATEGORY_LABEL.decorative}</option>
          </select>
        </div>
      </>
    );
  }

  function renderInlineEditForm() {
    if (!editingRecord) return null;
    return (
      <div className="weighing-form weighing-edit-form weighing-inline-edit">
        <h3>✏️ Редагування</h3>
        <div className="weighing-form-grid">
          <select
            value={editingRecord.weighing_type}
            onChange={(e) =>
              setEditingRecord({
                ...editingRecord,
                weighing_type: e.target.value as WeighingType,
              })
            }
          >
            <option value="breeding">🐇 Племінне</option>
            <option value="fattening">🍖 Відгодівля</option>
          </select>
          {renderTypeSpecificFields(
            {
              weighing_type: editingRecord.weighing_type,
              rabbit_id: editingRecord.rabbit_id || "",
              fattening_id: editingRecord.fattening_id || "",
              size_category: editingRecord.size_category || "meat",
            },
            (patch) =>
              setEditingRecord({
                ...editingRecord,
                ...(patch.rabbit_id !== undefined
                  ? { rabbit_id: patch.rabbit_id }
                  : {}),
                ...(patch.fattening_id !== undefined
                  ? { fattening_id: patch.fattening_id }
                  : {}),
                ...(patch.size_category !== undefined
                  ? { size_category: patch.size_category }
                  : {}),
                ...(patch.litter_label !== undefined
                  ? { litter_label: patch.litter_label }
                  : {}),
                ...(patch.rabbit_name !== undefined
                  ? { rabbit_name: patch.rabbit_name }
                  : {}),
              }),
          )}
          <div className="weighing-form-field">
            <label>Дата зважування</label>
            <input
              type="date"
              value={editingRecord.weighing_date}
              onChange={(e) =>
                setEditingRecord({
                  ...editingRecord,
                  weighing_date: e.target.value,
                })
              }
            />
          </div>
          <div className="weighing-form-field">
            <label>Вага (г)</label>
            <input
              type="number"
              min="0"
              value={editingRecord.weight_g}
              onChange={(e) =>
                setEditingRecord({
                  ...editingRecord,
                  weight_g: Number(e.target.value),
                })
              }
            />
          </div>
          <input
            placeholder="Нотатки"
            value={editingRecord.notes || ""}
            onChange={(e) =>
              setEditingRecord({ ...editingRecord, notes: e.target.value })
            }
            className="weighing-form-full"
          />
        </div>
        {editingRecord.weighing_type === "fattening" && (
          <label className="weighing-final-check">
            <input
              type="checkbox"
              checked={editingRecord.is_final}
              onChange={(e) =>
                setEditingRecord({
                  ...editingRecord,
                  is_final: e.target.checked,
                })
              }
            />
            Фінальне зважування (забій, клітка звільняється під нову партію)
          </label>
        )}
        {error && <p className="weighing-error">{error}</p>}
        <div className="weighing-edit-actions">
          <button
            className="weighing-cancel-btn"
            onClick={() => setEditingRecord(null)}
          >
            Скасувати
          </button>
          <button
            className="weighing-save-btn"
            onClick={handleEdit}
            disabled={saving}
          >
            {saving ? "Збереження..." : "Зберегти зміни"}
          </button>
        </div>
      </div>
    );
  }

  function renderFatteningRecordCard(r: WeighingRecord) {
    if (editingRecord?.id === r.id) {
      return <div key={r.id}>{renderInlineEditForm()}</div>;
    }
    const status = describeRecordStatus(r, rabbitById, fatteningById);
    return (
      <div key={r.id} className="weighing-card">
        <div className="weighing-card-top">
          <span className="weighing-name">
            {new Date(r.weighing_date).toLocaleDateString("uk-UA")}
            {r.rabbit_name ? ` · ${r.rabbit_name}` : ""}
            {r.is_final && <span className="weighing-final-badge">забій</span>}
          </span>
          <div className="weighing-card-btns">
            <button
              className="weighing-edit-btn"
              onClick={() => setEditingRecord(r)}
            >
              ✏️
            </button>
            <button
              className="weighing-delete-btn"
              onClick={() => handleDelete(r.id)}
            >
              ✕
            </button>
          </div>
        </div>
        <p className="weighing-info">
          Вага: <strong>{r.weight_g} г</strong>
          <RecordStatusBadge status={status} />
        </p>
        <p className="weighing-sample-tag">
          Показовий кролик (один навмання з гнізда)
        </p>
        {r.notes && <p className="weighing-notes">{r.notes}</p>}
      </div>
    );
  }

  function renderFatteningCycleBody(cycle: WeighingCycle) {
    return (
      <div className="weighing-monthly">
        {groupWeighingsByMonth(cycle.records).map((m, idx, arr) => (
          <div key={m.monthKey} className="weighing-month-block">
            {m.count > 1 && (
              <p className="weighing-info weighing-month-summary">
                {m.monthLabel}: середня <strong>{m.avgWeight} г</strong> (
                {m.count} зважувань)
                {idx > 0 && (
                  <span className="weighing-gain">
                    {" "}
                    ({m.avgWeight - arr[idx - 1].avgWeight >= 0 ? "+" : ""}
                    {m.avgWeight - arr[idx - 1].avgWeight} г до попереднього
                    місяця)
                  </span>
                )}
              </p>
            )}
            <div className="weighing-list weighing-month-records">
              {m.records.map((r) => renderFatteningRecordCard(r))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="weighing-page">
      <div className="weighing-header">
        <h1>⚖️ Зважування</h1>
        <button
          className="weighing-back-btn"
          onClick={() => navigate("/registry")}
        >
          ⬅ Мої кролики
        </button>
      </div>
      <div className="weighing-stats">
        <div className="weighing-stat">
          <span className="weighing-stat-value">{records.length}</span>
          <span className="weighing-stat-label">Записів</span>
        </div>
        <div className="weighing-stat">
          <span className="weighing-stat-value">{litterCount}</span>
          <span className="weighing-stat-label">Гнізд / груп</span>
        </div>
      </div>

      {/* ── Показники: мін / приріст / макс, з перемикачем типу ── */}
      <div className="weighing-gauge-card">
        <div className="weighing-gauge-toggle">
          <button
            className={
              gaugeMode === "fattening"
                ? "weighing-gauge-toggle-btn active"
                : "weighing-gauge-toggle-btn"
            }
            onClick={() => setGaugeMode("fattening")}
          >
            🍖 Відгодівля
          </button>
          <button
            className={
              gaugeMode === "breeding"
                ? "weighing-gauge-toggle-btn active"
                : "weighing-gauge-toggle-btn"
            }
            onClick={() => setGaugeMode("breeding")}
          >
            🐇 Племінне
          </button>
        </div>

        {gaugeMetrics ? (
          <div className="weighing-gauge-grid">
            <WeighingGauge metric={gaugeMetrics.min} />
            <WeighingGauge metric={gaugeMetrics.gain} />
            <WeighingGauge metric={gaugeMetrics.max} />
          </div>
        ) : (
          <p className="weighing-gauge-empty">
            Ще немає записів цього типу — додай перше зважування нижче.
          </p>
        )}
      </div>

      <div className="weighing-actions">
        <button
          className="weighing-add-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "✕ Скасувати" : "+ Додати зважування"}
        </button>
      </div>
      {showForm && (
        <div className="weighing-form">
          <h3>Нове зважування</h3>
          <div className="weighing-form-grid">
            <select
              value={form.weighing_type}
              onChange={(e) =>
                setForm({
                  ...form,
                  weighing_type: e.target.value as WeighingType,
                  rabbit_id: "",
                  fattening_id: "",
                  litter_label: "",
                  rabbit_name: "",
                })
              }
            >
              <option value="breeding">🐇 Племінне</option>
              <option value="fattening">🍖 Відгодівля</option>
            </select>
            {renderTypeSpecificFields(
              {
                weighing_type: form.weighing_type,
                rabbit_id: form.rabbit_id,
                fattening_id: form.fattening_id,
                size_category: form.size_category,
              },
              (patch) => setForm({ ...form, ...patch }),
            )}
            <div className="weighing-form-field">
              <label>Дата зважування *</label>
              <input
                type="date"
                value={form.weighing_date}
                onChange={(e) =>
                  setForm({ ...form, weighing_date: e.target.value })
                }
              />
            </div>
            <div className="weighing-form-field">
              <label>Вага (г) *</label>
              <input
                type="number"
                min="0"
                placeholder="Наприклад 1450"
                value={form.weight_g}
                onChange={(e) => setForm({ ...form, weight_g: e.target.value })}
              />
            </div>
            <input
              placeholder="Нотатки"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="weighing-form-full"
            />
          </div>
          {form.weighing_type === "fattening" && (
            <label className="weighing-final-check">
              <input
                type="checkbox"
                checked={form.is_final}
                onChange={(e) =>
                  setForm({ ...form, is_final: e.target.checked })
                }
              />
              Фінальне зважування (забій, клітка звільняється під нову партію)
            </label>
          )}
          {error && <p className="weighing-error">{error}</p>}
          <button
            className="weighing-save-btn"
            onClick={handleAdd}
            disabled={
              saving ||
              !form.litter_label ||
              !form.weighing_date ||
              !form.weight_g ||
              (form.weighing_type === "breeding"
                ? !form.rabbit_id
                : !form.fattening_id)
            }
          >
            {saving ? "Збереження..." : "Зберегти"}
          </button>
        </div>
      )}
      {pendingReminderPrompt && (
        <div className="weighing-reminder-prompt">
          <p className="weighing-reminder-prompt-text">
            🔔 Встановити нагадування про наступне зважування для «
            {pendingReminderPrompt.label}»?
          </p>
          <div className="weighing-reminder-prompt-actions">
            <input
              type="number"
              min="1"
              placeholder="днів"
              autoFocus
              value={reminderPromptDraft}
              onChange={(e) => setReminderPromptDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveReminderPrompt()}
              className="weighing-reminder-input"
            />
            <button
              className="weighing-save-btn"
              onClick={saveReminderPrompt}
              disabled={
                !reminderPromptDraft || Number(reminderPromptDraft) <= 0
              }
            >
              Зберегти
            </button>
            <button
              className="weighing-cancel-btn"
              onClick={() => setPendingReminderPrompt(null)}
            >
              Пропустити
            </button>
          </div>
        </div>
      )}
      {loading ? (
        <p className="weighing-loading">Завантаження...</p>
      ) : records.length === 0 ? (
        <div className="weighing-empty-state">
          <div className="weighing-empty-illustration">⚖️</div>
          <h3 className="weighing-empty-title">Записів зважування ще немає</h3>
          <p className="weighing-empty-desc">
            Додайте перше зважування показового кролика з гнізда — так почнеться
            відстеження приросту по місяцях.
          </p>
        </div>
      ) : Object.keys(modeGroups).length === 0 ? (
        <div className="weighing-empty-state">
          <div className="weighing-empty-illustration">
            {gaugeMode === "fattening" ? "🍖" : "🐇"}
          </div>
          <h3 className="weighing-empty-title">
            Записів типу «
            {gaugeMode === "fattening" ? "Відгодівля" : "Племінне"}» ще немає
          </h3>
          <p className="weighing-empty-desc">
            Перемкни на інший тип зверху або додай перше зважування цього типу.
          </p>
        </div>
      ) : (
        <div className="weighing-groups">
          {Object.entries(modeGroups).map(([litter, list]) => {
            const sorted = [...list].sort(
              (a, b) =>
                new Date(a.weighing_date).getTime() -
                new Date(b.weighing_date).getTime(),
            );
            const groupType: WeighingType =
              sorted[0]?.weighing_type || "breeding";

            const cycles =
              groupType === "fattening" ? splitIntoCycles(sorted) : [];
            const activeCycle = cycles.find((c) => !c.isClosed);
            const closedCycles = cycles.filter((c) => c.isClosed);
            const archiveOpen = !!openArchives[litter];
            const reminderInfo = computeReminderInfo(
              sorted,
              rabbitById,
              fatteningById,
            );

            return (
              <div key={litter} className="weighing-group">
                <div className="weighing-group-header-row">
                  <h2 className="weighing-group-title">
                    {groupType === "fattening" ? "🍖" : "🐇"} {litter}
                    <span className="weighing-group-badge">
                      {groupType === "fattening" ? "Відгодівля" : "Племінне"}
                    </span>
                  </h2>
                  <ReminderBadge
                    info={reminderInfo}
                    onChangeInterval={(days) => {
                      if (reminderInfo.entityType && reminderInfo.entityId) {
                        handleReminderIntervalChange(
                          reminderInfo.entityType,
                          reminderInfo.entityId,
                          days,
                        );
                      }
                    }}
                  />
                </div>

                {groupType === "fattening" ? (
                  <>
                    {activeCycle ? (
                      renderFatteningCycleBody(activeCycle)
                    ) : (
                      <p className="weighing-info weighing-cycle-empty">
                        Поточний цикл ще не розпочато — додайте зважування нової
                        партії в цю клітку.
                      </p>
                    )}

                    {closedCycles.length > 0 && (
                      <div className="weighing-cycle-archive">
                        <button
                          className="weighing-cycle-archive-toggle"
                          onClick={() =>
                            setOpenArchives((prev) => ({
                              ...prev,
                              [litter]: !prev[litter],
                            }))
                          }
                        >
                          <span>📦 Архів циклів ({closedCycles.length})</span>
                          <span>{archiveOpen ? "▲" : "▼"}</span>
                        </button>

                        {archiveOpen &&
                          closedCycles
                            .slice()
                            .reverse()
                            .map((cycle) => (
                              <div
                                key={cycle.cycleIndex}
                                className="weighing-cycle-block weighing-cycle-closed"
                              >
                                <p className="weighing-cycle-summary">
                                  Цикл {cycle.cycleIndex}:{" "}
                                  {new Date(cycle.startDate).toLocaleDateString(
                                    "uk-UA",
                                  )}{" "}
                                  –{" "}
                                  {new Date(cycle.endDate).toLocaleDateString(
                                    "uk-UA",
                                  )}{" "}
                                  ({cycle.durationDays} дн.)
                                  {cycle.finalAvgWeight !== null && (
                                    <>
                                      {" "}
                                      · середня вага на забій:{" "}
                                      <strong>{cycle.finalAvgWeight} г</strong>
                                    </>
                                  )}
                                </p>
                                {renderFatteningCycleBody(cycle)}
                              </div>
                            ))}
                      </div>
                    )}
                  </>
                ) : (
                  // ── Племінне: приріст по добі між зважуваннями ──
                  <div className="weighing-list">
                    {sorted.map((r, idx) =>
                      editingRecord?.id === r.id ? (
                        <div key={r.id}>{renderInlineEditForm()}</div>
                      ) : (
                        <div key={r.id} className="weighing-card">
                          <div className="weighing-card-top">
                            <span className="weighing-name">
                              {new Date(r.weighing_date).toLocaleDateString(
                                "uk-UA",
                              )}
                              {r.rabbit_name ? ` · ${r.rabbit_name}` : ""}
                            </span>
                            <div className="weighing-card-btns">
                              <button
                                className="weighing-edit-btn"
                                onClick={() => setEditingRecord(r)}
                              >
                                ✏️
                              </button>
                              <button
                                className="weighing-delete-btn"
                                onClick={() => handleDelete(r.id)}
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                          <p className="weighing-info">
                            Вага: <strong>{r.weight_g} г</strong>
                            <RecordStatusBadge
                              status={describeRecordStatus(
                                r,
                                rabbitById,
                                fatteningById,
                              )}
                            />
                            {idx > 0 && (
                              <span className="weighing-gain">
                                {" "}
                                ({dailyGain(sorted[idx - 1], r)})
                              </span>
                            )}
                          </p>
                          {r.notes && (
                            <p className="weighing-notes">{r.notes}</p>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {/* ── Порівняння циклів відгодівлі за рік ── */}
      {allClosedCycles.length > 0 && (
        <div className="registry-info">
          <button
            className="registry-info-toggle"
            onClick={() => setShowComparison(!showComparison)}
          >
            <span>📊 Порівняння циклів відгодівлі</span>
            <span>{showComparison ? "▲" : "▼"}</span>
          </button>

          {showComparison && (
            <div className="weighing-comparison-table-wrap">
              <table className="weighing-comparison-table">
                <thead>
                  <tr>
                    <th>Клітка</th>
                    <th>Період</th>
                    <th>Тривалість</th>
                    <th>Середня вага на забій</th>
                  </tr>
                </thead>
                <tbody>
                  {allClosedCycles.map(({ litter, cycle }) => (
                    <tr key={`${litter}-${cycle.cycleIndex}`}>
                      <td>{litter}</td>
                      <td>
                        {new Date(cycle.startDate).toLocaleDateString("uk-UA")}{" "}
                        – {new Date(cycle.endDate).toLocaleDateString("uk-UA")}
                      </td>
                      <td>{cycle.durationDays} дн.</td>
                      <td>
                        {cycle.finalAvgWeight !== null
                          ? `${cycle.finalAvgWeight} г`
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {/* ── Довідка: орієнтовна вага за віком ── */}
      <div className="registry-info">
        <button
          className="registry-info-toggle"
          onClick={() => setShowWeightChart(!showWeightChart)}
        >
          <span>📋 Орієнтовна вага кроля за віком (норма)</span>
          <span>{showWeightChart ? "▲" : "▼"}</span>
        </button>

        {showWeightChart && (
          <>
            <p className="registry-info-text">
              Орієнтовні діапазони — реальна вага залежить від лінії, годівлі та
              умов утримання. Гейджі та бейджі на картках вище автоматично
              звіряють кожен запис саме з цією таблицею за віком зв'язаного
              кролика чи клітки.
            </p>
            <div className="weighing-chart-table-wrap">
              <table className="weighing-chart-table">
                <thead>
                  <tr>
                    <th>Вік</th>
                    <th>М'ясні породи</th>
                    <th>Великі породи</th>
                    <th>Декоративні</th>
                    <th>Примітка</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Народження</td>
                    <td>40–80 г</td>
                    <td>60–100 г</td>
                    <td>30–60 г</td>
                    <td>
                      Залежить від розміру посліду. Менший послід — більші
                      кроленята.
                    </td>
                  </tr>
                  <tr>
                    <td>7 днів</td>
                    <td>100–150 г</td>
                    <td>120–180 г</td>
                    <td>70–100 г</td>
                    <td>
                      Перший тиждень — тільки молоко матері. Вага подвоюється.
                    </td>
                  </tr>
                  <tr>
                    <td>14 днів</td>
                    <td>200–280 г</td>
                    <td>250–320 г</td>
                    <td>150–200 г</td>
                    <td>Очі ще закриті. Починають виходити з гнізда.</td>
                  </tr>
                  <tr>
                    <td>21 день</td>
                    <td>350–450 г</td>
                    <td>400–520 г</td>
                    <td>250–320 г</td>
                    <td>Починають пробувати сіно та м'який корм.</td>
                  </tr>
                  <tr>
                    <td>28 днів</td>
                    <td>500–650 г</td>
                    <td>600–750 г</td>
                    <td>350–450 г</td>
                    <td>Активно їдять поряд з матір'ю.</td>
                  </tr>
                  <tr>
                    <td>35 днів</td>
                    <td>700–900 г</td>
                    <td>850–1050 г</td>
                    <td>450–600 г</td>
                    <td>
                      Орієнтир ваги — не рекомендація щодо термінів відлучення.
                    </td>
                  </tr>
                  <tr>
                    <td>45 днів</td>
                    <td>900–1100 г</td>
                    <td>1100–1350 г</td>
                    <td>600–750 г</td>
                    <td>Активний ріст. Профілактика кокцидіозу обов'язкова.</td>
                  </tr>
                  <tr>
                    <td>60 днів</td>
                    <td>1300–1600 г</td>
                    <td>1600–2000 г</td>
                    <td>800–1000 г</td>
                    <td>Типовий вік відлучення в господарстві.</td>
                  </tr>
                  <tr>
                    <td>75 днів</td>
                    <td>1800–2200 г</td>
                    <td>2200–2700 г</td>
                    <td>1000–1300 г</td>
                    <td>
                      Оптимальний вік початку відгодівлі для м'ясних порід.
                    </td>
                  </tr>
                  <tr>
                    <td>90 днів</td>
                    <td>2200–2700 г</td>
                    <td>2800–3400 г</td>
                    <td>1200–1600 г</td>
                    <td>Орієнтовний вік забою для м'ясних порід.</td>
                  </tr>
                  <tr>
                    <td>120 днів</td>
                    <td>2800–3400 г</td>
                    <td>3500–4500 г</td>
                    <td>1500–2000 г</td>
                    <td>Статева зрілість. Самців і самок розділяти.</td>
                  </tr>
                  <tr>
                    <td>6 місяців</td>
                    <td>3500–4500 г</td>
                    <td>4500–6000 г</td>
                    <td>1800–2500 г</td>
                    <td>Дорослий кролик, готовий до першої злучки.</td>
                  </tr>
                  <tr>
                    <td>12 місяців</td>
                    <td>4000–5500 г</td>
                    <td>5500–8000 г</td>
                    <td>2000–3000 г</td>
                    <td>Повна зрілість. Максимальна маса — до 1.5–2 років.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <div className="registry-info">
        <button
          className="registry-info-toggle"
          onClick={() => setShowCycleInfo(!showCycleInfo)}
        >
          <span>❔ Як рахуються цикли відгодівлі</span>
          <span>{showCycleInfo ? "▲" : "▼"}</span>
        </button>

        {showCycleInfo && (
          <p className="registry-info-text">
            Кожна клітка проходить цикли: заселили кроленят у 2 місяці —
            зважуєте в 3 місяці — фінальне зважування в 4 місяці перед забоєм.
            <br />
            <br />
            Коли додаєте зважування, познач чекбоксом "Фінальне зважування" той
            запис, що робиться перед забоєм. Після цього цикл вважається
            завершеним і автоматично йде в архів.
            <br />
            <br />
            Наступне зважування в тій самій клітці (нова партія кроленят) почне
            новий цикл сам, без ручного очищення чи перейменування клітки.
            <br />
            <br />В архіві циклів по кожній клітці зберігається історія всіх
            попередніх партій: дати заселення й забою, тривалість відгодівлі,
            середня вага на забій — можна порівнювати цикли між собою протягом
            року.
          </p>
        )}
      </div>

      <div className="registry-info">
        <button
          className="registry-info-toggle"
          onClick={() => setShowReminderInfo(!showReminderInfo)}
        >
          <span>🔔 Як працює нагадування про зважування</span>
          <span>{showReminderInfo ? "▲" : "▼"}</span>
        </button>

        {showReminderInfo && (
          <p className="registry-info-text">
            Кожна клітка/кролик має свій власний інтервал нагадування (в днях) —
            він зберігається окремо для кожного і не залежить від інших кліток.
            <br />
            <br />
            Відлік завжди йде від дати <strong>останнього</strong> зважування в
            цій групі: щойно вносиш новий запис — дата наступного нагадування
            автоматично переноситься вперед на той самий інтервал, вручну нічого
            перевводити не треба.
            <br />
            <br />
            Бейдж біля назви клітки/кролика показує статус: зелений — наступне
            зважування ще попереду (з датою), жовтий — лишилось 1–2 дні,
            червоний — вже прострочено. Клік по бейджу дозволяє в будь- який
            момент змінити інтервал.
            <br />
            <br />
            Якщо для клітки/кролика інтервал ще не задано — після збереження
            першого запису зважування зʼявиться підказка з пропозицією одразу
            встановити нагадування. Її можна пропустити — тоді інтервал просто
            лишиться незаданим, і бейдж покаже, що нагадування вимкнене, поки не
            задаси його вручну.
            <br />
            <br />
            Для клітин відгодівлі інтервал належить самій клітці, а не
            конкретному циклу — тож він автоматично діє й на наступну партію
            кроленят після фінального зважування (забою).
          </p>
        )}
      </div>
    </div>
  );
}
