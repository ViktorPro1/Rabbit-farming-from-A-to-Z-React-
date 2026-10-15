import { MS_PER_DAY, sortByWeighingDate } from "./utils";
import type {
  BatchGroup,
  BatchMass,
  BatchMassPoint,
  BatchRow,
  GroupInfo,
  MonthGroup,
  WeighingCycle,
  WeighingRecord,
  WeighingType,
} from "./types";

export function groupWeighingsByMonth(list: WeighingRecord[]): MonthGroup[] {
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
      const sortedRecords = sortByWeighingDate(records);
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
export function buildCycle(
  records: WeighingRecord[],
  cycleIndex: number,
  isClosed: boolean,
): WeighingCycle {
  const start = records[0].weighing_date;
  const end = records[records.length - 1].weighing_date;
  const durationDays = Math.round(
    (new Date(end).getTime() - new Date(start).getTime()) / MS_PER_DAY,
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

export function splitIntoCycles(sorted: WeighingRecord[]): WeighingCycle[] {
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

// ── Загальна маса партії ──
// У записах зважування лежить вага ОДНОГО показового кролика, тому маса
// всієї партії = вага показового × кількість голів у клітці відгодівлі.
// Для закритого циклу береться вага фінального зважування, для поточного —
// останнього.
export function recordHeads(
  r: WeighingRecord,
  headsByFattening: Record<string, number>,
): number | null {
  if (r.fattening_id && headsByFattening[r.fattening_id] > 0) {
    return headsByFattening[r.fattening_id];
  }
  return null;
}

export function computeBatchMass(
  cycle: WeighingCycle,
  headsByFattening: Record<string, number>,
): BatchMass {
  const points: BatchMassPoint[] = [];
  cycle.records.forEach((r) => {
    const heads = recordHeads(r, headsByFattening);
    if (!heads) return;
    points.push({
      date: r.weighing_date,
      heads,
      weightG: r.weight_g,
      totalKg: (r.weight_g * heads) / 1000,
    });
  });
  return {
    first: points[0] ?? null,
    last: points[points.length - 1] ?? null,
    isClosed: cycle.isClosed,
  };
}

// Інформація по кожній групі: поточний цикл і закриті цикли.
export function buildGroupInfos(
  modeGroups: Record<string, WeighingRecord[]>,
): GroupInfo[] {
  return Object.entries(modeGroups).map(([litter, list]) => {
    const sorted = sortByWeighingDate(list);
    const groupType: WeighingType = sorted[0]?.weighing_type || "breeding";
    const cycles = groupType === "fattening" ? splitIntoCycles(sorted) : [];
    return {
      litter,
      sorted,
      groupType,
      activeCycle: cycles.find((c) => !c.isClosed),
      closedCycles: cycles.filter((c) => c.isClosed),
    };
  });
}

export interface CycleViews {
  // Змінено: у списку відгодівлі лишаються тільки клітки з поточним циклом.
  // Клітки, де всі цикли закриті галочкою «Фінальне зважування», йдуть
  // тільки в спільний архів.
  visibleGroupInfos: GroupInfo[];
  // Спільний архів: усі клітки, що мають хоч один закритий цикл.
  archiveInfos: GroupInfo[];
  archiveCyclesCount: number;
  // Усі закриті цикли відгодівлі по всіх клітках — для порівняння за рік.
  allClosedCycles: Array<{ litter: string; cycle: WeighingCycle }>;
  batchGroups: BatchGroup[];
}

export function buildCycleViews(
  groupInfos: GroupInfo[],
  headsByFattening: Record<string, number>,
): CycleViews {
  const visibleGroupInfos = groupInfos.filter(
    (g) => g.groupType !== "fattening" || g.activeCycle,
  );

  const archiveInfos = groupInfos.filter((g) => g.closedCycles.length > 0);
  const archiveCyclesCount = archiveInfos.reduce(
    (s, g) => s + g.closedCycles.length,
    0,
  );

  const allClosedCycles: Array<{ litter: string; cycle: WeighingCycle }> = [];
  archiveInfos.forEach(({ litter, closedCycles }) => {
    closedCycles.forEach((cycle) => allClosedCycles.push({ litter, cycle }));
  });
  allClosedCycles.sort(
    (a, b) =>
      new Date(a.cycle.endDate).getTime() - new Date(b.cycle.endDate).getTime(),
  );

  // Порівняння партій: закриті цикли + поточні (триваючі), за датою.
  // Маса партії = остання відома маса в циклі (на забій або на останнє
  // зважування).
  const batchRows: BatchRow[] = [
    ...allClosedCycles,
    ...groupInfos
      .filter((g) => g.groupType === "fattening" && g.activeCycle)
      .map((g) => ({
        litter: g.litter,
        cycle: g.activeCycle as WeighingCycle,
      })),
  ]
    .sort(
      (a, b) =>
        new Date(a.cycle.endDate).getTime() -
        new Date(b.cycle.endDate).getTime(),
    )
    .map((row) => ({
      ...row,
      mass: computeBatchMass(row.cycle, headsByFattening).last,
    }));

  // Партія = усі клітки, які відгодовувались одночасно. Цикли, періоди яких
  // перетинаються в часі, об'єднуються в одну партію: від першого зважування
  // до останнього забою. Голови й маса — сума по всіх клітках партії.
  const rows = [...batchRows].sort((a, b) =>
    a.cycle.startDate.localeCompare(b.cycle.startDate),
  );
  const groups: { rows: BatchRow[]; end: string }[] = [];
  rows.forEach((row) => {
    const g = groups[groups.length - 1];
    if (g && row.cycle.startDate <= g.end) {
      g.rows.push(row);
      if (row.cycle.endDate > g.end) g.end = row.cycle.endDate;
    } else {
      groups.push({ rows: [row], end: row.cycle.endDate });
    }
  });
  const batchGroups: BatchGroup[] = groups.map((g) => ({
    key: `${g.rows[0].cycle.startDate}-${g.end}`,
    startDate: g.rows[0].cycle.startDate,
    endDate: g.end,
    heads: g.rows.reduce((s, r) => s + (r.mass ? r.mass.heads : 0), 0),
    totalKg: g.rows.reduce((s, r) => s + (r.mass ? r.mass.totalKg : 0), 0),
    missing: g.rows.filter((r) => !r.mass).length,
    isClosed: g.rows.every((r) => r.cycle.isClosed),
  }));

  return {
    visibleGroupInfos,
    archiveInfos,
    archiveCyclesCount,
    allClosedCycles,
    batchGroups,
  };
}
