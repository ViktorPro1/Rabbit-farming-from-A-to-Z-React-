import { describe, expect, it } from "vitest";
import {
  computeFemalePlans,
  countByStatus,
  sortPlans,
  toRows,
} from "./planLogic";
import type {
  FemalePlan,
  LitterRow,
  MatingRow,
  PlanStatus,
  RabbitRow,
} from "./types";

const TODAY = "2026-11-21";

function rabbit(id: string, over: Partial<RabbitRow> = {}): RabbitRow {
  return {
    id,
    name: id,
    breed: null,
    gender: "female",
    birth_date: "2025-01-01",
    cage_number: null,
    is_active: true,
    mother_id: null,
    father_id: null,
    ...over,
  };
}

function mating(id: string, over: Partial<MatingRow> = {}): MatingRow {
  return {
    id,
    female_id: "f1",
    male_id: "m1",
    mating_date: "2026-11-10",
    control_date: null,
    expected_birth: null,
    is_archived: false,
    ...over,
  };
}

function litter(id: string, over: Partial<LitterRow> = {}): LitterRow {
  return {
    id,
    mating_id: null,
    mother_id: null,
    actual_female_id: null,
    actual_male_id: null,
    birth_date: null,
    total_born: null,
    alive: null,
    weaned_date: null,
    litter_mating_date: null,
    litter_expected_birth: null,
    failure_type: null,
    ...over,
  };
}

/** Розрахунок для однієї самки f1 і самця m1 (з іменем «Барон»). */
function planFor(
  matings: MatingRow[],
  litters: LitterRow[],
  femaleOver: Partial<RabbitRow> = {},
): FemalePlan {
  const plans = computeFemalePlans(
    [rabbit("f1", femaleOver), rabbit("m1", { gender: "male", name: "Барон" })],
    matings,
    litters,
    TODAY,
  );
  expect(plans).toHaveLength(1);
  return plans[0];
}

describe("computeFemalePlans: вибір самок", () => {
  it("бере тільки самок", () => {
    const plans = computeFemalePlans(
      [rabbit("f1"), rabbit("m1", { gender: "male" })],
      [],
      [],
      TODAY,
    );
    expect(plans.map((p) => p.rabbit.id)).toEqual(["f1"]);
  });

  it("пропускає неактивних самок, а is_active = null вважає активною", () => {
    const plans = computeFemalePlans(
      [
        rabbit("f1", { is_active: false }),
        rabbit("f2", { is_active: null }),
        rabbit("f3", { is_active: true }),
      ],
      [],
      [],
      TODAY,
    );
    expect(plans.map((p) => p.rabbit.id)).toEqual(["f2", "f3"]);
  });

  it("повертає порожній список без кроликів", () => {
    expect(computeFemalePlans([], [], [], TODAY)).toEqual([]);
  });
});

describe("computeFemalePlans: вік і статус «young»", () => {
  it("самка без даних про злучки і роди готова до злучки", () => {
    const plan = planFor([], []);
    expect(plan.status).toBe("ready");
    expect(plan.pregnancy).toBeNull();
    expect(plan.nursing).toBeNull();
    expect(plan.lastLitter).toBeNull();
    expect(plan.freeSince).toBeNull();
    expect(plan.freeDays).toBeNull();
    expect(plan.littersCount).toBe(0);
    expect(plan.avgAlive).toBeNull();
  });

  it("рахує вік у повних місяцях", () => {
    // 2025-01-01 → 2026-11-21 це 689 днів, 689 / 30.4375 = 22.6
    expect(planFor([], []).ageMonths).toBe(22);
  });

  it("до 4 місяців статус «young»", () => {
    // 2026-09-01 → 2026-11-21 це 81 день, тобто 2 місяці
    const plan = planFor([], [], { birth_date: "2026-09-01" });
    expect(plan.status).toBe("young");
    expect(plan.ageMonths).toBe(2);
  });

  it("рівно 4 місяці вже не «young»", () => {
    // 122 дні = 4.008 місяця
    const plan = planFor([], [], { birth_date: "2026-07-22" });
    expect(plan.ageMonths).toBe(4);
    expect(plan.status).toBe("ready");
  });

  it("120 днів це ще 3 місяці (місяць = 30,4375 дня), тому «young»", () => {
    // 2026-07-24 → 2026-11-21 це 120 днів: 120 / 30.4375 = 3.94
    const plan = planFor([], [], { birth_date: "2026-07-24" });
    expect(plan.ageMonths).toBe(3);
    expect(plan.status).toBe("young");
  });

  it("без дати народження вік невідомий, а статус не «young»", () => {
    const plan = planFor([], [], { birth_date: null });
    expect(plan.ageMonths).toBeNull();
    expect(plan.status).toBe("ready");
  });

  it("дата народження в майбутньому дає ageMonths = null", () => {
    const plan = planFor([], [], { birth_date: "2026-12-25" });
    expect(plan.ageMonths).toBeNull();
  });
});

describe("computeFemalePlans: вагітність за злучкою", () => {
  it("очікуваний окріл = злучка + 31 день, якщо дата не вказана", () => {
    const plan = planFor([mating("a")], []);
    expect(plan.status).toBe("pregnant");
    expect(plan.pregnancy).toMatchObject({
      matingDate: "2026-11-10",
      expectedBirth: "2026-12-11",
      day: 11,
      daysLeft: 20,
      maleName: "Барон",
      soon: false,
    });
    expect(plan.pregnancy?.progress).toBeCloseTo(11 / 31, 5);
  });

  it("використовує expected_birth, якщо він є", () => {
    const plan = planFor([mating("a", { expected_birth: "2026-12-01" })], []);
    expect(plan.pregnancy?.expectedBirth).toBe("2026-12-01");
    expect(plan.pregnancy?.daysLeft).toBe(10);
  });

  it("позначає «soon» за 3 дні і менше до окролу", () => {
    const plan = planFor([mating("a", { expected_birth: "2026-11-24" })], []);
    expect(plan.pregnancy?.daysLeft).toBe(3);
    expect(plan.pregnancy?.soon).toBe(true);
  });

  it("за 4 дні «soon» ще немає", () => {
    const plan = planFor([mating("a", { expected_birth: "2026-11-25" })], []);
    expect(plan.pregnancy?.soon).toBe(false);
  });

  it("у день окролу статус «pregnant», daysLeft = 0", () => {
    const plan = planFor([mating("a", { expected_birth: TODAY })], []);
    expect(plan.status).toBe("pregnant");
    expect(plan.pregnancy?.daysLeft).toBe(0);
    expect(plan.pregnancy?.soon).toBe(true);
  });

  it("після очікуваної дати статус «overdue»", () => {
    const plan = planFor([mating("a", { mating_date: "2026-10-01" })], []);
    expect(plan.status).toBe("overdue");
    expect(plan.pregnancy?.daysLeft).toBe(-20);
    expect(plan.pregnancy?.soon).toBe(false);
  });

  it("progress не перевищує 1", () => {
    const plan = planFor([mating("a", { mating_date: "2026-09-01" })], []);
    expect(plan.pregnancy?.progress).toBe(1);
  });

  it("злучка в майбутньому дає day = 0", () => {
    const plan = planFor([mating("a", { mating_date: "2026-11-25" })], []);
    expect(plan.pregnancy?.day).toBe(0);
    expect(plan.pregnancy?.progress).toBe(0);
  });

  it("ігнорує архівну злучку", () => {
    const plan = planFor([mating("a", { is_archived: true })], []);
    expect(plan.status).toBe("ready");
    expect(plan.pregnancy).toBeNull();
  });

  it("ігнорує злучку, по якій уже є окріл", () => {
    const plan = planFor(
      [mating("a")],
      [litter("l1", { mating_id: "a", birth_date: "2026-11-15" })],
    );
    expect(plan.pregnancy).toBeNull();
  });

  it("ігнорує злучки інших самок", () => {
    const plans = computeFemalePlans(
      [rabbit("f1"), rabbit("f2")],
      [mating("a", { female_id: "f2" })],
      [],
      TODAY,
    );
    expect(plans.find((p) => p.rabbit.id === "f1")?.status).toBe("ready");
    expect(plans.find((p) => p.rabbit.id === "f2")?.status).toBe("pregnant");
  });

  it("ім'я самця невідоме, якщо його немає серед кроликів", () => {
    const plans = computeFemalePlans(
      [rabbit("f1")],
      [mating("a", { male_id: "ghost" })],
      [],
      TODAY,
    );
    expect(plans[0].pregnancy?.maleName).toBeNull();
  });

  it("з кількох вагітностей бере ту, що раніше закінчується", () => {
    const plan = planFor(
      [
        mating("a", { expected_birth: "2026-12-20" }),
        mating("b", { expected_birth: "2026-12-01" }),
      ],
      [],
    );
    expect(plan.pregnancy?.expectedBirth).toBe("2026-12-01");
  });
});

describe("computeFemalePlans: повторна злучка через litters", () => {
  it("рядок без birth_date і failure_type з litter_mating_date це вагітність", () => {
    const plan = planFor(
      [],
      [
        litter("l1", {
          mother_id: "f1",
          litter_mating_date: "2026-11-15",
          actual_male_id: "m1",
        }),
      ],
    );
    expect(plan.status).toBe("pregnant");
    expect(plan.pregnancy).toMatchObject({
      matingDate: "2026-11-15",
      expectedBirth: "2026-12-16",
      daysLeft: 25,
      maleName: "Барон",
    });
  });

  it("використовує litter_expected_birth, а початок рахує назад", () => {
    const plan = planFor(
      [],
      [litter("l1", { mother_id: "f1", litter_expected_birth: "2026-12-11" })],
    );
    expect(plan.pregnancy?.matingDate).toBe("2026-11-10");
    expect(plan.pregnancy?.expectedBirth).toBe("2026-12-11");
  });

  it("без жодної дати вагітності немає", () => {
    const plan = planFor([], [litter("l1", { mother_id: "f1" })]);
    expect(plan.pregnancy).toBeNull();
    expect(plan.status).toBe("ready");
  });

  it("самця бере зі злучки, якщо actual_male_id не вказано", () => {
    const plan = planFor(
      [mating("a", { is_archived: false })],
      [
        litter("l1", {
          mating_id: "a",
          litter_mating_date: "2026-11-18",
        }),
      ],
    );
    // Злучка a уже має рядок у litters, тому вагітність дає саме повторна злучка
    expect(plan.pregnancy?.matingDate).toBe("2026-11-18");
    expect(plan.pregnancy?.maleName).toBe("Барон");
  });

  it("пропускає рядок, якщо його злучка в архіві", () => {
    const plan = planFor(
      [mating("a", { is_archived: true })],
      [litter("l1", { mating_id: "a", litter_mating_date: "2026-11-18" })],
    );
    expect(plan.pregnancy).toBeNull();
  });

  it("пропускає рядок з failure_type", () => {
    const plan = planFor(
      [],
      [
        litter("l1", {
          mother_id: "f1",
          litter_mating_date: "2026-11-15",
          failure_type: "empty",
        }),
      ],
    );
    expect(plan.pregnancy).toBeNull();
  });

  it("пропускає рядок, де окріл уже відбувся", () => {
    const plan = planFor(
      [],
      [
        litter("l1", {
          mother_id: "f1",
          litter_mating_date: "2026-10-01",
          birth_date: "2026-11-01",
        }),
      ],
    );
    expect(plan.pregnancy).toBeNull();
  });
});

describe("computeFemalePlans: визначення самки окролу", () => {
  const pending = {
    litter_mating_date: "2026-11-15",
  };

  it("actual_female_id важливіший за mother_id", () => {
    const plans = computeFemalePlans(
      [rabbit("f1"), rabbit("f2")],
      [],
      [litter("l1", { ...pending, actual_female_id: "f2", mother_id: "f1" })],
      TODAY,
    );
    expect(plans.find((p) => p.rabbit.id === "f1")?.status).toBe("ready");
    expect(plans.find((p) => p.rabbit.id === "f2")?.status).toBe("pregnant");
  });

  it("без mother_id самка береться зі злучки", () => {
    const plan = planFor(
      [mating("a")],
      [litter("l1", { ...pending, mating_id: "a" })],
    );
    expect(plan.pregnancy?.matingDate).toBe("2026-11-15");
  });

  it("окріл без самки взагалі не потрапляє ні до кого", () => {
    const plan = planFor([], [litter("l1", pending)]);
    expect(plan.pregnancy).toBeNull();
  });
});

describe("computeFemalePlans: окроли, годування, вільна дата", () => {
  it("самка з окролом без відлучення годує малих", () => {
    const plan = planFor(
      [mating("a")],
      [
        litter("l1", {
          mating_id: "a",
          mother_id: "f1",
          birth_date: "2026-10-15",
          total_born: 7,
          alive: 6,
        }),
      ],
    );
    expect(plan.status).toBe("nursing");
    expect(plan.nursing).toEqual({
      birthDate: "2026-10-15",
      daysSince: 37,
      alive: 6,
    });
    expect(plan.lastLitter).toEqual({
      birthDate: "2026-10-15",
      alive: 6,
      totalBorn: 7,
    });
    expect(plan.littersCount).toBe(1);
  });

  it("після відлучення самка готова, freeSince = дата відлучення", () => {
    const plan = planFor(
      [],
      [
        litter("l1", {
          mother_id: "f1",
          birth_date: "2026-08-01",
          weaned_date: "2026-09-05",
        }),
      ],
    );
    expect(plan.status).toBe("ready");
    expect(plan.nursing).toBeNull();
    expect(plan.freeSince).toBe("2026-09-05");
    expect(plan.freeDays).toBe(77);
  });

  it("freeSince береться з найпізнішої дати", () => {
    const plan = planFor(
      [],
      [
        litter("l1", {
          mother_id: "f1",
          birth_date: "2026-03-01",
          weaned_date: "2026-04-05",
        }),
        litter("l2", {
          mother_id: "f1",
          birth_date: "2026-07-01",
          weaned_date: "2026-08-10",
        }),
      ],
    );
    expect(plan.freeSince).toBe("2026-08-10");
    expect(plan.littersCount).toBe(2);
  });

  it("невдала вагітність звільняє самку з очікуваної дати окролу", () => {
    const plan = planFor(
      [],
      [
        litter("l1", {
          mother_id: "f1",
          failure_type: "empty",
          litter_expected_birth: "2026-11-01",
        }),
      ],
    );
    expect(plan.status).toBe("ready");
    expect(plan.freeSince).toBe("2026-11-01");
    expect(plan.freeDays).toBe(20);
    expect(plan.littersCount).toBe(0);
  });

  it("freeDays є тільки у статусу «ready»", () => {
    const plan = planFor(
      [mating("a")],
      [
        litter("l1", {
          mother_id: "f1",
          birth_date: "2026-03-01",
          weaned_date: "2026-04-05",
        }),
      ],
    );
    expect(plan.status).toBe("pregnant");
    expect(plan.freeSince).toBe("2026-04-05");
    expect(plan.freeDays).toBeNull();
  });

  it("вагітність важливіша за годування", () => {
    const plan = planFor(
      [mating("a")],
      [
        litter("l1", {
          mother_id: "f1",
          birth_date: "2026-11-01",
        }),
      ],
    );
    expect(plan.status).toBe("pregnant");
    expect(plan.nursing).not.toBeNull();
  });

  it("годування важливіше за «young»", () => {
    const plan = planFor(
      [],
      [litter("l1", { mother_id: "f1", birth_date: "2026-11-01" })],
      { birth_date: "2026-08-01" },
    );
    expect(plan.status).toBe("nursing");
  });

  it("lastLitter це найновіший окріл", () => {
    const plan = planFor(
      [],
      [
        litter("l1", {
          mother_id: "f1",
          birth_date: "2026-03-01",
          alive: 5,
          total_born: 6,
          weaned_date: "2026-04-05",
        }),
        litter("l2", {
          mother_id: "f1",
          birth_date: "2026-08-01",
          alive: 8,
          total_born: 9,
          weaned_date: "2026-09-10",
        }),
      ],
    );
    expect(plan.lastLitter).toEqual({
      birthDate: "2026-08-01",
      alive: 8,
      totalBorn: 9,
    });
  });

  it("окріл з failure_type не рахується як окріл", () => {
    const plan = planFor(
      [],
      [
        litter("l1", {
          mother_id: "f1",
          birth_date: "2026-08-01",
          failure_type: "dead",
        }),
      ],
    );
    expect(plan.littersCount).toBe(0);
    expect(plan.lastLitter).toBeNull();
  });
});

describe("computeFemalePlans: середня кількість живих", () => {
  function plansWithAlive(values: (number | null)[]): FemalePlan {
    return planFor(
      [],
      values.map((alive, i) =>
        litter(`l${i}`, {
          mother_id: "f1",
          birth_date: `2026-0${i + 1}-01`,
          weaned_date: `2026-0${i + 1}-20`,
          alive,
        }),
      ),
    );
  }

  it("рахує середнє з округленням до десятих", () => {
    expect(plansWithAlive([5, 6]).avgAlive).toBe(5.5);
    expect(plansWithAlive([7, 6, 6]).avgAlive).toBe(6.3);
  });

  it("пропускає окроли, де кількість не вказана", () => {
    expect(plansWithAlive([8, null, 6]).avgAlive).toBe(7);
  });

  it("якщо живих ніде не вказано, середнє null", () => {
    expect(plansWithAlive([null, null]).avgAlive).toBeNull();
  });

  it("нуль живих теж враховується", () => {
    expect(plansWithAlive([0, 6]).avgAlive).toBe(3);
  });
});

function plan(
  id: string,
  status: PlanStatus,
  over: Partial<RabbitRow> = {},
  daysLeft?: number,
): FemalePlan {
  return {
    rabbit: rabbit(id, over),
    status,
    pregnancy:
      daysLeft === undefined
        ? null
        : {
            matingDate: "2026-11-01",
            expectedBirth: "2026-12-01",
            day: 10,
            daysLeft,
            progress: 0.3,
            maleName: null,
            soon: false,
          },
    nursing: null,
    lastLitter: null,
    freeSince: null,
    freeDays: null,
    littersCount: 0,
    avgAlive: null,
    ageMonths: 12,
  };
}

describe("sortPlans", () => {
  it("групує за статусами: прострочені, готові, вагітні, годують, молоді", () => {
    const sorted = sortPlans([
      plan("a", "young"),
      plan("b", "nursing"),
      plan("c", "pregnant", {}, 10),
      plan("d", "ready"),
      plan("e", "overdue", {}, -2),
    ]);
    expect(sorted.map((p) => p.rabbit.id)).toEqual(["e", "d", "c", "b", "a"]);
  });

  it("вагітних сортує за терміном: найближчий окріл першим", () => {
    const sorted = sortPlans([
      plan("a", "pregnant", {}, 20),
      plan("b", "pregnant", {}, 3),
      plan("c", "pregnant", {}, 11),
    ]);
    expect(sorted.map((p) => p.rabbit.id)).toEqual(["b", "c", "a"]);
  });

  it("прострочених сортує так само: найбільше прострочення першим", () => {
    const sorted = sortPlans([
      plan("a", "overdue", {}, -1),
      plan("b", "overdue", {}, -9),
    ]);
    expect(sorted.map((p) => p.rabbit.id)).toEqual(["b", "a"]);
  });

  it("клітки сортує як числа: 2, 10, а не 10, 2", () => {
    const sorted = sortPlans([
      plan("a", "ready", { cage_number: "10" }),
      plan("b", "ready", { cage_number: "2" }),
      plan("c", "ready", { cage_number: "1" }),
    ]);
    expect(sorted.map((p) => p.rabbit.id)).toEqual(["c", "b", "a"]);
  });

  it("за однакової клітки сортує за кличкою", () => {
    const sorted = sortPlans([
      plan("a", "ready", { cage_number: "5", name: "Зоря" }),
      plan("b", "ready", { cage_number: "5", name: "Белла" }),
    ]);
    expect(sorted.map((p) => p.rabbit.name)).toEqual(["Белла", "Зоря"]);
  });

  it("без кліток сортує за кличкою", () => {
    const sorted = sortPlans([
      plan("a", "ready", { name: "Ляля" }),
      plan("b", "ready", { name: "Аза" }),
    ]);
    expect(sorted.map((p) => p.rabbit.name)).toEqual(["Аза", "Ляля"]);
  });

  it("не змінює початковий масив", () => {
    const input = [plan("a", "young"), plan("b", "overdue", {}, -1)];
    const copy = [...input];
    sortPlans(input);
    expect(input).toEqual(copy);
  });
});

describe("countByStatus", () => {
  it("рахує кількість по кожному статусу", () => {
    expect(
      countByStatus([
        plan("a", "ready"),
        plan("b", "ready"),
        plan("c", "nursing"),
        plan("d", "young"),
      ]),
    ).toEqual({ overdue: 0, ready: 2, pregnant: 0, nursing: 1, young: 1 });
  });

  it("для порожнього списку повертає нулі", () => {
    expect(countByStatus([])).toEqual({
      overdue: 0,
      ready: 0,
      pregnant: 0,
      nursing: 0,
      young: 0,
    });
  });
});

describe("toRows", () => {
  it("повертає масив без змін", () => {
    const rows = [{ id: 1 }];
    expect(toRows(rows)).toBe(rows);
  });

  it.each([null, undefined, {}, "рядок", 5])(
    "для не-масиву %p повертає порожній масив",
    (value) => {
      expect(toRows(value)).toEqual([]);
    },
  );
});
