import { describe, expect, it } from "vitest";
import {
  ancestorsOf,
  assessPair,
  buildMaleOptions,
  collectMatingDates,
} from "./pairLogic";
import type { LitterRow, MatingRow, RabbitRow } from "./types";

const TODAY = "2026-11-21";

function rabbit(
  id: string,
  gender: "male" | "female",
  over: Partial<RabbitRow> = {},
): RabbitRow {
  return {
    id,
    name: id,
    breed: null,
    gender,
    birth_date: "2025-01-01",
    cage_number: null,
    is_active: true,
    mother_id: null,
    father_id: null,
    ...over,
  };
}

function mapOf(...rabbits: RabbitRow[]): Map<string, RabbitRow> {
  return new Map(rabbits.map((r) => [r.id, r]));
}

function mating(id: string, over: Partial<MatingRow> = {}): MatingRow {
  return {
    id,
    female_id: "f",
    male_id: "m",
    mating_date: "2026-11-01",
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

describe("ancestorsOf", () => {
  it("повертає порожній результат, якщо батьків немає", () => {
    const byId = mapOf(rabbit("a", "female"));
    expect(ancestorsOf("a", byId).size).toBe(0);
  });

  it("повертає порожній результат для невідомого id", () => {
    expect(ancestorsOf("ghost", new Map()).size).toBe(0);
  });

  it("знаходить батьків як 1-е покоління, дідів як 2-ге, прадідів як 3-тє", () => {
    const byId = mapOf(
      rabbit("a", "female", { mother_id: "m1", father_id: "f1" }),
      rabbit("m1", "female", { mother_id: "gm" }),
      rabbit("f1", "male"),
      rabbit("gm", "female", { father_id: "ggf" }),
      rabbit("ggf", "male", { father_id: "g4" }),
      rabbit("g4", "male"),
    );
    const anc = ancestorsOf("a", byId);
    expect(anc.get("m1")).toBe(1);
    expect(anc.get("f1")).toBe(1);
    expect(anc.get("gm")).toBe(2);
    expect(anc.get("ggf")).toBe(3);
  });

  it("не йде глибше за 3 покоління", () => {
    const byId = mapOf(
      rabbit("a", "female", { mother_id: "p1" }),
      rabbit("p1", "female", { mother_id: "p2" }),
      rabbit("p2", "female", { mother_id: "p3" }),
      rabbit("p3", "female", { mother_id: "p4" }),
      rabbit("p4", "female"),
    );
    const anc = ancestorsOf("a", byId);
    expect(anc.has("p3")).toBe(true);
    expect(anc.has("p4")).toBe(false);
  });

  it("за двох шляхів до предка бере найближче покоління", () => {
    // Дід d і батько, і мати мають дідом: d буде 2-м поколінням
    const byId = mapOf(
      rabbit("a", "female", { mother_id: "m", father_id: "f" }),
      rabbit("m", "female", { father_id: "d" }),
      rabbit("f", "male", { father_id: "d" }),
      rabbit("d", "male"),
    );
    expect(ancestorsOf("a", byId).get("d")).toBe(2);
  });

  it("не зациклюється, якщо в даних помилковий цикл", () => {
    const byId = mapOf(
      rabbit("a", "female", { mother_id: "b" }),
      rabbit("b", "female", { mother_id: "a" }),
    );
    const anc = ancestorsOf("a", byId);
    expect(anc.get("b")).toBe(1);
    expect(anc.has("a")).toBe(false);
  });

  it("не зациклюється, якщо тварина записана власним батьком", () => {
    const byId = mapOf(rabbit("a", "male", { father_id: "a" }));
    expect(ancestorsOf("a", byId).size).toBe(0);
  });
});

describe("assessPair: пряма спорідненість", () => {
  it("батько самки: danger", () => {
    const female = rabbit("f", "female", { father_id: "m" });
    const male = rabbit("m", "male");
    expect(assessPair(female, male, mapOf(female, male))).toEqual({
      level: "danger",
      text: "Батько цієї самки",
    });
  });

  it("дід самки: warn", () => {
    const female = rabbit("f", "female", { mother_id: "mom" });
    const mom = rabbit("mom", "female", { father_id: "m" });
    const male = rabbit("m", "male");
    expect(assessPair(female, male, mapOf(female, mom, male))).toEqual({
      level: "warn",
      text: "Дід цієї самки",
    });
  });

  it("прадід самки: warn", () => {
    const female = rabbit("f", "female", { mother_id: "a" });
    const a = rabbit("a", "female", { mother_id: "b" });
    const b = rabbit("b", "female", { father_id: "m" });
    const male = rabbit("m", "male");
    expect(assessPair(female, male, mapOf(female, a, b, male))).toEqual({
      level: "warn",
      text: "Прадід цієї самки",
    });
  });

  it("син самки: danger", () => {
    const female = rabbit("f", "female");
    const male = rabbit("m", "male", { mother_id: "f" });
    expect(assessPair(female, male, mapOf(female, male))).toEqual({
      level: "danger",
      text: "Син цієї самки",
    });
  });

  it("онук самки: warn", () => {
    const female = rabbit("f", "female");
    const kid = rabbit("k", "female", { mother_id: "f" });
    const male = rabbit("m", "male", { mother_id: "k" });
    expect(assessPair(female, male, mapOf(female, kid, male))).toEqual({
      level: "warn",
      text: "Онук цієї самки",
    });
  });

  it("правнук самки: warn", () => {
    const female = rabbit("f", "female");
    const k1 = rabbit("k1", "female", { mother_id: "f" });
    const k2 = rabbit("k2", "female", { mother_id: "k1" });
    const male = rabbit("m", "male", { mother_id: "k2" });
    expect(assessPair(female, male, mapOf(female, k1, k2, male))).toEqual({
      level: "warn",
      text: "Правнук цієї самки",
    });
  });
});

describe("assessPair: брати й сестри", () => {
  it("спільні батько й мати: danger", () => {
    const female = rabbit("f", "female", { mother_id: "x", father_id: "y" });
    const male = rabbit("m", "male", { mother_id: "x", father_id: "y" });
    expect(assessPair(female, male, mapOf(female, male))).toEqual({
      level: "danger",
      text: "Рідний брат цієї самки (спільні батько й мати)",
    });
  });

  it("спільний тільки батько: warn", () => {
    const female = rabbit("f", "female", { mother_id: "x1", father_id: "y" });
    const male = rabbit("m", "male", { mother_id: "x2", father_id: "y" });
    expect(assessPair(female, male, mapOf(female, male))).toEqual({
      level: "warn",
      text: "Напівбрат цієї самки (спільний батько)",
    });
  });

  it("спільна тільки мати: warn", () => {
    const female = rabbit("f", "female", { mother_id: "x", father_id: "y1" });
    const male = rabbit("m", "male", { mother_id: "x", father_id: "y2" });
    expect(assessPair(female, male, mapOf(female, male))).toEqual({
      level: "warn",
      text: "Напівбрат цієї самки (спільна мати)",
    });
  });

  it("два порожні поля матері не вважаються спільною матір'ю", () => {
    const female = rabbit("f", "female", { father_id: "y1" });
    const male = rabbit("m", "male", { father_id: "y2" });
    const res = assessPair(female, male, mapOf(female, male));
    expect(res.level).toBe("ok");
  });
});

describe("assessPair: спільний предок", () => {
  it("двоюрідні (спільна бабуся): warn з іменем предка і поколіннями", () => {
    const female = rabbit("f", "female", { mother_id: "m1" });
    const male = rabbit("m", "male", { mother_id: "m2" });
    const m1 = rabbit("m1", "female", { mother_id: "Бабуся" });
    const m2 = rabbit("m2", "female", { mother_id: "Бабуся" });
    const gran = rabbit("Бабуся", "female");
    expect(assessPair(female, male, mapOf(female, male, m1, m2, gran))).toEqual(
      {
        level: "warn",
        text: "Спільний предок: Бабуся (покоління: самка 2, самець 2)",
      },
    );
  });

  it("з кількох спільних предків називає найближчого", () => {
    // Спільні: близький n (1 і 2) та далекий w (3 і 3)
    const female = rabbit("f", "female", { mother_id: "fa", father_id: "fb" });
    const male = rabbit("m", "male", { mother_id: "ma", father_id: "mb" });
    const fa = rabbit("fa", "female", { mother_id: "n" });
    const fb = rabbit("fb", "male", { mother_id: "w1" });
    const ma = rabbit("ma", "female", { mother_id: "n" });
    const mb = rabbit("mb", "male", { mother_id: "w2" });
    const n = rabbit("n", "female", { name: "Близька" });
    const w1 = rabbit("w1", "female", { mother_id: "w" });
    const w2 = rabbit("w2", "female", { mother_id: "w" });
    const w = rabbit("w", "female", { name: "Далека" });
    const res = assessPair(
      female,
      male,
      mapOf(female, male, fa, fb, ma, mb, n, w1, w2, w),
    );
    expect(res.level).toBe("warn");
    expect(res.text).toContain("Близька");
  });

  it("предок поза межею 3 поколінь не береться до уваги", () => {
    // Спільна прапрабабуся на 4-му поколінні в обох
    const female = rabbit("f", "female", { mother_id: "f1" });
    const male = rabbit("m", "male", { mother_id: "m1" });
    const f1 = rabbit("f1", "female", { mother_id: "f2" });
    const f2 = rabbit("f2", "female", { mother_id: "f3" });
    const f3 = rabbit("f3", "female", { mother_id: "top" });
    const m1 = rabbit("m1", "female", { mother_id: "m2" });
    const m2 = rabbit("m2", "female", { mother_id: "m3" });
    const m3 = rabbit("m3", "female", { mother_id: "top" });
    const top = rabbit("top", "female");
    const res = assessPair(
      female,
      male,
      mapOf(female, male, f1, f2, f3, m1, m2, m3, top),
    );
    expect(res.level).toBe("ok");
  });

  it("якщо предка немає в базі, пише «невідомо»", () => {
    const female = rabbit("f", "female", { mother_id: "m1" });
    const male = rabbit("m", "male", { mother_id: "m2" });
    const m1 = rabbit("m1", "female", { mother_id: "gone" });
    const m2 = rabbit("m2", "female", { mother_id: "gone" });
    const res = assessPair(female, male, mapOf(female, male, m1, m2));
    expect(res.text).toBe(
      "Спільний предок: невідомо (покоління: самка 2, самець 2)",
    );
  });
});

describe("assessPair: родовід без спорідненості", () => {
  it("повний родовід в обох: ok", () => {
    const female = rabbit("f", "female", { mother_id: "a", father_id: "b" });
    const male = rabbit("m", "male", { mother_id: "c", father_id: "d" });
    expect(assessPair(female, male, mapOf(female, male))).toEqual({
      level: "ok",
      text: "У відомому родоводі спільних предків немає",
    });
  });

  it("неповний родовід (є хоч один з батьків в обох): ok з приміткою", () => {
    const female = rabbit("f", "female", { mother_id: "a" });
    const male = rabbit("m", "male", { father_id: "d" });
    expect(assessPair(female, male, mapOf(female, male))).toEqual({
      level: "ok",
      text: "Спільних предків у відомому родоводі немає (родовід неповний)",
    });
  });

  it("батьки не вказані ні в кого: unknown", () => {
    const female = rabbit("f", "female");
    const male = rabbit("m", "male");
    expect(assessPair(female, male, mapOf(female, male))).toEqual({
      level: "unknown",
      text: "Батьки не вказані ні в самки, ні в самця",
    });
  });

  it("батьки самця не вказані: unknown", () => {
    const female = rabbit("f", "female", { mother_id: "a" });
    const male = rabbit("m", "male");
    expect(assessPair(female, male, mapOf(female, male))).toEqual({
      level: "unknown",
      text: "Батьки самця не вказані",
    });
  });

  it("батьки самки не вказані: unknown", () => {
    const female = rabbit("f", "female");
    const male = rabbit("m", "male", { father_id: "d" });
    expect(assessPair(female, male, mapOf(female, male))).toEqual({
      level: "unknown",
      text: "Батьки самки не вказані",
    });
  });
});

describe("collectMatingDates", () => {
  it("збирає дати звичайних злучок самця", () => {
    const dates = collectMatingDates(
      "m",
      [
        mating("a", { mating_date: "2026-10-01" }),
        mating("b", { mating_date: "2026-11-01", male_id: "other" }),
        mating("c", { mating_date: "2026-11-10" }),
      ],
      [],
    );
    expect(dates.sort()).toEqual(["2026-10-01", "2026-11-10"]);
  });

  it("додає повторні злучки з litters за actual_male_id", () => {
    const dates = collectMatingDates(
      "m",
      [],
      [
        litter("l1", {
          actual_male_id: "m",
          litter_mating_date: "2026-11-05",
        }),
        litter("l2", {
          actual_male_id: "other",
          litter_mating_date: "2026-11-06",
        }),
      ],
    );
    expect(dates).toEqual(["2026-11-05"]);
  });

  it("без actual_male_id бере самця зі злучки окролу", () => {
    const dates = collectMatingDates(
      "m",
      [mating("a", { male_id: "m", mating_date: "2026-09-01" })],
      [litter("l1", { mating_id: "a", litter_mating_date: "2026-11-05" })],
    );
    expect(dates.sort()).toEqual(["2026-09-01", "2026-11-05"]);
  });

  it("пропускає окроли без litter_mating_date", () => {
    const dates = collectMatingDates(
      "m",
      [],
      [litter("l1", { actual_male_id: "m" })],
    );
    expect(dates).toEqual([]);
  });

  it("повертає порожній список, якщо даних немає", () => {
    expect(collectMatingDates("m", [], [])).toEqual([]);
  });
});

describe("buildMaleOptions", () => {
  const female = rabbit("f", "female", { mother_id: "mom", father_id: "dad" });
  const dad = rabbit("dad", "male", { name: "Батько" });
  const mom = rabbit("mom", "female");

  it("бере тільки активних самців", () => {
    const options = buildMaleOptions(
      female,
      [
        female,
        mom,
        rabbit("m1", "male"),
        rabbit("m2", "male", { is_active: false }),
        rabbit("m3", "male", { is_active: null }),
      ],
      [],
      [],
      TODAY,
    );
    expect(options.map((o) => o.rabbit.id).sort()).toEqual(["m1", "m3"]);
  });

  it("сортує: можна, немає даних, обережно, не можна", () => {
    const okMale = rabbit("ok", "male", { mother_id: "x", father_id: "y" });
    const unknownMale = rabbit("unknown", "male");
    const warnMale = rabbit("warn", "male", {
      mother_id: "mom",
      father_id: "z",
    });
    const options = buildMaleOptions(
      female,
      [female, mom, dad, okMale, unknownMale, warnMale],
      [],
      [],
      TODAY,
    );
    expect(options.map((o) => [o.rabbit.id, o.pairing.level])).toEqual([
      ["ok", "ok"],
      ["unknown", "unknown"],
      ["warn", "warn"],
      ["dad", "danger"],
    ]);
  });

  it("за однакової оцінки менш завантажений самець іде першим", () => {
    const a = rabbit("a", "male", { mother_id: "x", father_id: "y" });
    const b = rabbit("b", "male", { mother_id: "x2", father_id: "y2" });
    const options = buildMaleOptions(
      female,
      [female, a, b],
      [mating("1", { male_id: "a", mating_date: "2026-11-20" })],
      [],
      TODAY,
    );
    expect(options.map((o) => o.rabbit.id)).toEqual(["b", "a"]);
  });

  it("за повної рівності сортує за кличкою", () => {
    const options = buildMaleOptions(
      female,
      [
        female,
        rabbit("z", "male", { name: "Зевс", mother_id: "x" }),
        rabbit("a", "male", { name: "Аякс", mother_id: "x2" }),
      ],
      [],
      [],
      TODAY,
    );
    expect(options.map((o) => o.rabbit.name)).toEqual(["Аякс", "Зевс"]);
  });

  it("рахує злучки за останні 7 днів і останню злучку", () => {
    const male = rabbit("m", "male", { mother_id: "x", father_id: "y" });
    const options = buildMaleOptions(
      female,
      [female, male],
      [
        mating("1", { mating_date: "2026-11-20" }), // 1 день тому
        mating("2", { mating_date: "2026-11-15" }), // 6 днів тому: у тижні
        mating("3", { mating_date: "2026-11-14" }), // 7 днів тому: вже ні
      ],
      [],
      TODAY,
    );
    expect(options[0].matingsLast7Days).toBe(2);
    expect(options[0].lastMating).toBe("2026-11-20");
  });

  it("не враховує дати з майбутнього", () => {
    const male = rabbit("m", "male");
    const options = buildMaleOptions(
      female,
      [female, male],
      [mating("1", { mating_date: "2026-11-25" })],
      [],
      TODAY,
    );
    expect(options[0].matingsLast7Days).toBe(0);
    expect(options[0].lastMating).toBeNull();
  });

  it("враховує повторні злучки з litters", () => {
    const male = rabbit("m", "male");
    const options = buildMaleOptions(
      female,
      [female, male],
      [],
      [litter("l1", { actual_male_id: "m", litter_mating_date: "2026-11-19" })],
      TODAY,
    );
    expect(options[0].matingsLast7Days).toBe(1);
    expect(options[0].lastMating).toBe("2026-11-19");
  });

  it("без злучок lastMating = null", () => {
    const options = buildMaleOptions(
      female,
      [female, rabbit("m", "male")],
      [],
      [],
      TODAY,
    );
    expect(options[0].lastMating).toBeNull();
    expect(options[0].matingsLast7Days).toBe(0);
  });

  it("повертає порожній список, якщо самців немає", () => {
    expect(buildMaleOptions(female, [female], [], [], TODAY)).toEqual([]);
  });
});
