import type { HeadsRow } from "./types";

// Склад партії в клітці = залишок у самій клітці + голови, відокремлені
// від неї при частковому забої (окремі рядки з тим самим номером клітки
// й датою народження та заповненим slaughtered_at). Без цього забій
// однієї голови "зменшував" би партію, а не лишався в її складі.
export function computeHeadsByFattening(
  rows: HeadsRow[],
): Record<string, number> {
  const own = (r: HeadsRow) =>
    (r.males || 0) + (r.females || 0) + (r.unknown || 0);
  const keyOf = (r: HeadsRow) => `${r.cage_number}|${r.birth_date}`;
  const slaughteredSum: Record<string, number> = {};
  rows.forEach((r) => {
    if (r.slaughtered_at && r.birth_date) {
      slaughteredSum[keyOf(r)] = (slaughteredSum[keyOf(r)] || 0) + own(r);
    }
  });
  const map: Record<string, number> = {};
  rows.forEach((r) => {
    let total = own(r);
    if (r.birth_date) {
      total +=
        (slaughteredSum[keyOf(r)] || 0) - (r.slaughtered_at ? own(r) : 0);
    }
    map[r.id] = total;
  });
  return map;
}
