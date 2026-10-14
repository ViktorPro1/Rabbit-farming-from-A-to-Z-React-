// Розрахунок статистики розведення з урахуванням ФАКТИЧНИХ батьків окролу.
// Це чисті функції: беруть уже завантажені дані й повертають готові списки.
import type {
  CageStat,
  Delta,
  FemaleAccuracyStat,
  FemaleFailureStat,
  LitterRow,
  MatingRow,
  PairStat,
  Person,
  PersonResolver,
  RabbitRef,
  RabbitStat,
} from "./types";

function avgOf(totalAlive: number, littersCount: number): number {
  return littersCount > 0
    ? Math.round((totalAlive / littersCount) * 10) / 10
    : 0;
}

export function groupLittersByMating(
  litters: LitterRow[],
): Record<string, LitterRow[]> {
  const littersByMating: Record<string, LitterRow[]> = {};
  litters.forEach((l) => {
    if (!littersByMating[l.mating_id]) littersByMating[l.mating_id] = [];
    littersByMating[l.mating_id].push(l);
  });
  return littersByMating;
}

export function createPersonResolver(
  rabbitById: Map<string, RabbitRef>,
): PersonResolver {
  function toPerson(
    id: string,
    fallback: RabbitRef | null | undefined,
  ): Person | null {
    const r =
      rabbitById.get(id) || (fallback && fallback.id === id ? fallback : null);
    if (!r) return null;
    return {
      id,
      name: r.name,
      breed: r.breed || "",
      cage: r.cage_number || "",
    };
  }

  // Самець/самка окролу: фактичний (actual_*), а якщо не вказаний —
  // той, що у злучці
  function maleOf(m: MatingRow, l?: LitterRow): Person | null {
    return toPerson((l && l.actual_male_id) || m.male_id, m.male);
  }
  function femaleOf(m: MatingRow, l?: LitterRow): Person | null {
    return toPerson((l && l.actual_female_id) || m.female_id, m.female);
  }

  // Клітка самки для картки: клітка з реєстру, а для самки зі злучки —
  // ще й female_cage самої злучки
  function femaleCageOf(m: MatingRow, f: Person): string {
    return f.cage || (f.id === m.female_id ? m.female_cage || "" : "");
  }

  return { maleOf, femaleOf, femaleCageOf };
}

// Невдалі окроли: не окотилась / окотилась, але малюки загинули
export function computeFailureStats(
  litters: LitterRow[],
  matingById: Map<string, MatingRow>,
  { maleOf, femaleOf, femaleCageOf }: PersonResolver,
): FemaleFailureStat[] {
  const birthsByFemale: Record<string, number> = {};
  litters.forEach((l) => {
    if (!l.birth_date) return;
    const m = matingById.get(l.mating_id);
    if (!m) return;
    const f = femaleOf(m, l);
    if (!f) return;
    birthsByFemale[f.id] = (birthsByFemale[f.id] || 0) + 1;
  });

  const failureMap: Record<string, FemaleFailureStat> = {};
  litters.forEach((l) => {
    if (!l.failure_type) return;
    const m = matingById.get(l.mating_id);
    if (!m) return;
    const female = femaleOf(m, l);
    if (!female) return;
    const male = maleOf(m, l);
    const fid = female.id;
    if (!failureMap[fid]) {
      failureMap[fid] = {
        femaleId: fid,
        femaleName: female.name,
        femaleBreed: female.breed,
        femaleCage: femaleCageOf(m, female),
        entries: [],
        emptyCount: 0,
        lostCount: 0,
        littersCount: 0,
      };
    }
    const stat = failureMap[fid];
    stat.entries.push({
      litterId: l.id,
      type: l.failure_type === "lost" ? "lost" : "empty",
      matingDate: l.litter_mating_date || m.mating_date || "",
      failureDate:
        (l.failure_type === "lost" ? l.birth_date : l.litter_expected_birth) ||
        "",
      maleName: male?.name || "",
    });
    if (l.failure_type === "lost") stat.lostCount += 1;
    else stat.emptyCount += 1;
  });

  return Object.values(failureMap)
    .map((s) => ({
      ...s,
      littersCount: birthsByFemale[s.femaleId] || 0,
      entries: [...s.entries].sort((a, b) =>
        (b.failureDate || b.matingDate).localeCompare(
          a.failureDate || a.matingDate,
        ),
      ),
    }))
    .sort((a, b) => b.entries.length - a.entries.length);
}

// ── Статистика самок / самців / пар / кліток ──
// Кожна злучка рахується за кроликами зі злучки (1 злучка), а кожен
// окріл — за його ФАКТИЧНИМИ батьками. Повторні злучки окролу
// (litter_mating_date) також зараховуються фактичній парі.
export function computeBreedingStats(
  matings: MatingRow[],
  littersByMating: Record<string, LitterRow[]>,
  { maleOf, femaleOf }: PersonResolver,
): {
  femaleStats: RabbitStat[];
  maleStats: RabbitStat[];
  pairStats: PairStat[];
  cageStats: CageStat[];
} {
  const femaleMap: Record<string, RabbitStat> = {};
  const maleMap: Record<string, RabbitStat> = {};
  const pairMap: Record<string, PairStat> = {};
  const cageMap: Record<string, CageStat> = {};

  function getRabbitStat(
    map: Record<string, RabbitStat>,
    p: Person,
    gender: "male" | "female",
  ): RabbitStat {
    if (!map[p.id]) {
      map[p.id] = {
        id: p.id,
        name: p.name,
        breed: p.breed,
        gender,
        matingsCount: 0,
        littersCount: 0,
        totalBorn: 0,
        totalAlive: 0,
        avgAlive: 0,
        survivalRate: 0,
        pairs: [],
      };
    }
    return map[p.id];
  }

  function getPairStat(male: Person, female: Person): PairStat {
    const key = `${male.id}_${female.id}`;
    if (!pairMap[key]) {
      pairMap[key] = {
        maleId: male.id,
        maleName: male.name,
        maleBreed: male.breed,
        femaleId: female.id,
        femaleName: female.name,
        femaleBreed: female.breed,
        matingsCount: 0,
        littersCount: 0,
        totalBorn: 0,
        totalAlive: 0,
        avgAlive: 0,
      };
    }
    return pairMap[key];
  }

  function getCageStat(cage: string): CageStat {
    if (!cageMap[cage]) {
      cageMap[cage] = {
        cage,
        matingsCount: 0,
        littersCount: 0,
        totalBorn: 0,
        totalAlive: 0,
        avgAlive: 0,
        rabbits: [],
      };
    }
    return cageMap[cage];
  }

  function applyDelta(
    s: {
      matingsCount: number;
      littersCount: number;
      totalBorn: number;
      totalAlive: number;
    },
    d: Delta,
  ) {
    s.matingsCount += d.matings;
    s.littersCount += d.litters;
    s.totalBorn += d.born;
    s.totalAlive += d.alive;
  }

  function addPartner(stat: RabbitStat, partner: Person, d: Delta) {
    let p = stat.pairs.find((x) => x.partnerId === partner.id);
    if (!p) {
      p = {
        partnerId: partner.id,
        partnerName: partner.name,
        littersCount: 0,
        totalAlive: 0,
      };
      stat.pairs.push(p);
    }
    p.littersCount += d.litters;
    p.totalAlive += d.alive;
  }

  function record(male: Person | null, female: Person | null, d: Delta) {
    if (female) {
      const s = getRabbitStat(femaleMap, female, "female");
      applyDelta(s, d);
      if (male) addPartner(s, male, d);
    }
    if (male) {
      const s = getRabbitStat(maleMap, male, "male");
      applyDelta(s, d);
      if (female) addPartner(s, female, d);
    }
    if (male && female) {
      applyDelta(getPairStat(male, female), d);
    }
  }

  function addCageName(stat: CageStat, p: Person | null) {
    if (p?.name && !stat.rabbits.includes(p.name)) stat.rabbits.push(p.name);
  }

  matings.forEach((m) => {
    const baseMale = maleOf(m);
    const baseFemale = femaleOf(m);
    const cage = m.female_cage || m.male_cage;
    const cageStat = cage ? getCageStat(cage) : null;

    // Сама злучка — кроликам зі злучки
    const base: Delta = { matings: 1, litters: 0, born: 0, alive: 0 };
    record(baseMale, baseFemale, base);
    if (cageStat) {
      applyDelta(cageStat, base);
      addCageName(cageStat, baseFemale);
      addCageName(cageStat, baseMale);
    }

    // Окроли — фактичним батькам
    (littersByMating[m.id] || []).forEach((l) => {
      const male = maleOf(m, l);
      const female = femaleOf(m, l);
      const born = !!l.birth_date;
      const d: Delta = {
        matings: l.litter_mating_date ? 1 : 0,
        litters: born ? 1 : 0,
        born: born ? l.total_born || 0 : 0,
        alive: born ? l.alive || 0 : 0,
      };
      record(male, female, d);
      if (cageStat) {
        applyDelta(cageStat, d);
        addCageName(cageStat, female);
        addCageName(cageStat, male);
      }
    });
  });

  const finalizeRabbit = (s: RabbitStat): RabbitStat => ({
    ...s,
    avgAlive: avgOf(s.totalAlive, s.littersCount),
    survivalRate:
      s.totalBorn > 0 ? Math.round((s.totalAlive / s.totalBorn) * 100) : 0,
  });

  return {
    femaleStats: Object.values(femaleMap)
      .map(finalizeRabbit)
      .sort((a, b) => b.totalAlive - a.totalAlive),
    maleStats: Object.values(maleMap)
      .map(finalizeRabbit)
      .sort((a, b) => b.totalAlive - a.totalAlive),
    pairStats: Object.values(pairMap)
      .map((s) => ({ ...s, avgAlive: avgOf(s.totalAlive, s.littersCount) }))
      .sort((a, b) => b.totalAlive - a.totalAlive),
    cageStats: Object.values(cageMap)
      .map((s) => ({ ...s, avgAlive: avgOf(s.totalAlive, s.littersCount) }))
      .sort((a, b) => b.totalAlive - a.totalAlive),
  };
}

// Accuracy stats (по фактичній самці окролу)
export function computeAccuracyStats(
  litters: LitterRow[],
  matingById: Map<string, MatingRow>,
  { femaleOf, femaleCageOf }: PersonResolver,
): FemaleAccuracyStat[] {
  const accuracyMap: Record<string, FemaleAccuracyStat> = {};
  litters.forEach((l) => {
    if (!l.birth_date || !l.litter_expected_birth) return;
    const m = matingById.get(l.mating_id);
    if (!m) return;
    const female = femaleOf(m, l);
    if (!female) return;
    const resolvedFemaleCage = femaleCageOf(m, female);
    const expected = new Date(l.litter_expected_birth);
    const actual = new Date(l.birth_date);
    const diffDays = Math.round(
      (actual.getTime() - expected.getTime()) / (1000 * 60 * 60 * 24),
    );
    const fid = female.id;
    if (!accuracyMap[fid]) {
      accuracyMap[fid] = {
        femaleId: fid,
        femaleName: female.name,
        femaleBreed: female.breed,
        femaleCage: resolvedFemaleCage,
        entries: [],
        avgDiff: 0,
        onTimeCount: 0,
        lateCount: 0,
        earlyCount: 0,
      };
    }
    if (!accuracyMap[fid].femaleCage && resolvedFemaleCage) {
      accuracyMap[fid].femaleCage = resolvedFemaleCage;
    }
    accuracyMap[fid].entries.push({
      litterId: l.id,
      femaleId: fid,
      femaleName: female.name,
      femaleBreed: female.breed,
      femaleCage: resolvedFemaleCage,
      expectedDate: l.litter_expected_birth,
      actualDate: l.birth_date,
      diffDays,
    });
  });

  return Object.values(accuracyMap)
    .map((s) => {
      const onTimeCount = s.entries.filter((e) => e.diffDays === 0).length;
      const lateCount = s.entries.filter((e) => e.diffDays > 0).length;
      const earlyCount = s.entries.filter((e) => e.diffDays < 0).length;
      const avgDiff =
        s.entries.length > 0
          ? Math.round(
              (s.entries.reduce((sum, e) => sum + e.diffDays, 0) /
                s.entries.length) *
                10,
            ) / 10
          : 0;
      return { ...s, onTimeCount, lateCount, earlyCount, avgDiff };
    })
    .filter((s) => s.entries.length > 0)
    .sort((a, b) => b.entries.length - a.entries.length);
}
