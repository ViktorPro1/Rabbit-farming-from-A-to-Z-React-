import {
  ageDaysAt,
  getExpectedDailyGain,
  getExpectedRange,
  mostFrequentCategory,
  zoneForGain,
  zoneFromRange,
} from "./ageNorms";
import { MS_PER_DAY, sortByWeighingDate } from "./utils";
import type {
  FatteningOption,
  GaugeMetric,
  GaugeZone,
  RabbitOption,
  RecordStatus,
  SizeCategory,
  WeighingRecord,
} from "./types";

// ГЕЙДЖІ: мінімальна вага / приріст за добу / максимальна вага.
// Порівнюємо з таблицею "Орієнтовна вага кроля за віком" за реальним віком
// кожного запису (з дати народження зв'язаного кролика чи клітки відгодівлі).
export function buildGaugeMetrics(
  allRecords: WeighingRecord[],
  rabbitById: Record<string, RabbitOption>,
  fatteningById: Record<string, FatteningOption>,
): { min: GaugeMetric; gain: GaugeMetric; max: GaugeMetric } | null {
  if (allRecords.length === 0) return null;

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

  // Змінено: гейджі рахуємо тільки по записах, для яких відомий вік
  // (є пов'язаний кролик/клітка з датою народження). Старі записи без
  // прив'язки не потрапляють у мін / макс / приріст і не псують показники.
  const list = allRecords.filter((r) => getAge(r) != null);
  if (list.length === 0) return null;

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
export function collectDailyGains(list: WeighingRecord[]): number[] {
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
    const sorted = sortByWeighingDate(arr);
    for (let i = 1; i < sorted.length; i++) {
      const days =
        (new Date(sorted[i].weighing_date).getTime() -
          new Date(sorted[i - 1].weighing_date).getTime()) /
        MS_PER_DAY;
      if (days > 0) {
        gains.push((sorted[i].weight_g - sorted[i - 1].weight_g) / days);
      }
    }
  });
  return gains;
}

// Те саме порівняння з таблицею норм, але для одного конкретного зважування
// (бейдж "мала / у нормі / велика вага" в картці запису).
export function describeRecordStatus(
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
