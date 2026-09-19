import { describe, expect, it } from "vitest";
import {
  buildCostAnalysis,
  dayNumber,
  type ExpenseInput,
  type FatteningInput,
  type RabbitInput,
  type WeighingInput,
} from "./costAnalysis";

const OPTIONS = { includeEquipment: false, today: "2026-09-19" };

function batch(over: Partial<FatteningInput>): FatteningInput {
  return {
    id: "b1",
    cage_number: "1",
    males: 0,
    females: 0,
    unknown: 0,
    created_at: "2026-08-01T10:00:00",
    slaughtered_at: "2026-08-30",
    is_active: false,
    carcass_weight_kg: null,
    ...over,
  };
}

describe("dayNumber", () => {
  it("рахує різницю в добах без впливу переходу на літній час", () => {
    expect(dayNumber("2026-03-30") - dayNumber("2026-03-28")).toBe(2);
    expect(dayNumber("2026-11-02") - dayNumber("2026-10-30")).toBe(3);
  });
});

describe("buildCostAnalysis", () => {
  it("відтворює приклад: 20 кролів, 2100 грн, 65 кг", () => {
    const expenses: ExpenseInput[] = [
      { category: "feed", amount: 1500, expense_date: "2026-08-01" },
      { category: "vet", amount: 400, expense_date: "2026-08-10" },
      { category: "transport", amount: 200, expense_date: "2026-08-15" },
    ];
    // Вікно всіх груп закінчується сьогодні, тому партія має бути активною
    // до сьогодні, щоб вся сума потрапила на неї (реєстру кролів немає).
    const fattening = [
      batch({
        males: 12,
        females: 8,
        slaughtered_at: null,
        is_active: true,
        created_at: "2026-08-01T10:00:00",
      }),
    ];
    // Вага: 20 голів × 3250 г = 65 кг
    const weighings: WeighingInput[] = [
      { fattening_id: "b1", rabbit_id: null, weighing_date: "2026-09-18", weight_g: 3250 },
    ];
    const r = buildCostAnalysis(expenses, fattening, [], weighings, OPTIONS);
    const b = r.batches[0];
    expect(b.heads).toBe(20);
    expect(b.totalCost).toBeCloseTo(2100, 6);
    expect(b.weightKg).toBeCloseTo(65, 6);
    expect(b.weightBasis).toBe("live");
    expect(b.costPerHead).toBeCloseTo(105, 6);
    expect(b.costPerKg).toBeCloseTo(32.3077, 3);
    expect(Math.round((b.costPerKg as number) * 100) / 100).toBe(32.31);
  });

  it("ділить витрати між двома партіями пропорційно голово-дням", () => {
    const expenses: ExpenseInput[] = [
      { category: "feed", amount: 1000, expense_date: "2026-09-10" },
    ];
    const opts = { includeEquipment: false, today: "2026-09-19" };
    const fattening = [
      batch({ id: "a", males: 10, slaughtered_at: null, is_active: true, created_at: "2026-09-10T00:00:00" }),
      batch({ id: "c", males: 5, slaughtered_at: null, is_active: true, created_at: "2026-09-10T00:00:00" }),
    ];
    const r = buildCostAnalysis(expenses, fattening, [], [], opts);
    const a = r.batches.find((x) => x.id === "a")!;
    const c = r.batches.find((x) => x.id === "c")!;
    expect(a.feedCost).toBeCloseTo((1000 * 10) / 15, 6);
    expect(c.feedCost).toBeCloseTo((1000 * 5) / 15, 6);
    expect(a.feedCost + c.feedCost).toBeCloseTo(1000, 6);
  });

  it("частину витрат віддає кролям реєстру, сума збігається із загальною", () => {
    const expenses: ExpenseInput[] = [
      { category: "feed", amount: 900, expense_date: "2026-09-10" },
    ];
    const fattening = [
      batch({ id: "a", males: 10, slaughtered_at: null, is_active: true, created_at: "2026-09-10T00:00:00" }),
    ];
    const rabbits: RabbitInput[] = [
      { id: "r1", name: "Мурка", cage_number: "1", is_active: true, created_at: "2026-09-10T00:00:00", archive_date: null },
      { id: "r2", name: "Барон", cage_number: "2", is_active: true, created_at: "2026-09-10T00:00:00", archive_date: null },
    ];
    const r = buildCostAnalysis(expenses, fattening, rabbits, [], OPTIONS);
    const feed = r.groups.find((g) => g.group === "feed")!;
    expect(feed.spent).toBe(900);
    expect(feed.toBatches).toBeCloseTo(750, 6);
    expect(feed.toRabbits).toBeCloseTo(150, 6);
    expect(feed.unallocated).toBe(0);
    expect(feed.toBatches + feed.toRabbits).toBeCloseTo(900, 6);
  });

  it("обладнання враховується лише коли ввімкнено", () => {
    const expenses: ExpenseInput[] = [
      { category: "equipment", amount: 300, expense_date: "2026-09-10" },
    ];
    const fattening = [
      batch({ males: 5, slaughtered_at: null, is_active: true, created_at: "2026-09-10T00:00:00" }),
    ];
    const off = buildCostAnalysis(expenses, fattening, [], [], OPTIONS);
    expect(off.batches[0].otherCost).toBe(0);
    const on = buildCostAnalysis(expenses, fattening, [], [], {
      ...OPTIONS,
      includeEquipment: true,
    });
    expect(on.batches[0].otherCost).toBeCloseTo(300, 6);
  });

  it("без зважувань бере вагу туші за одну голову × кількість голів", () => {
    const expenses: ExpenseInput[] = [
      { category: "feed", amount: 800, expense_date: "2026-09-10" },
    ];
    const fattening = [
      batch({ males: 8, slaughtered_at: "2026-09-19", is_active: false, created_at: "2026-09-10T00:00:00", carcass_weight_kg: 1.9 }),
    ];
    const r = buildCostAnalysis(expenses, fattening, [], [], OPTIONS);
    const b = r.batches[0];
    expect(b.weightBasis).toBe("carcass");
    expect(b.weightKg).toBeCloseTo(15.2, 6);
    expect(b.costPerKg).toBeCloseTo(800 / 15.2, 6);
  });

  it("бере середню вагу за останню дату зважування", () => {
    const expenses: ExpenseInput[] = [
      { category: "feed", amount: 100, expense_date: "2026-09-10" },
    ];
    const fattening = [
      batch({ males: 4, slaughtered_at: null, is_active: true, created_at: "2026-09-10T00:00:00" }),
    ];
    const weighings: WeighingInput[] = [
      { fattening_id: "b1", rabbit_id: null, weighing_date: "2026-09-12", weight_g: 1000 },
      { fattening_id: "b1", rabbit_id: null, weighing_date: "2026-09-18", weight_g: 2000 },
      { fattening_id: "b1", rabbit_id: null, weighing_date: "2026-09-18", weight_g: 3000 },
    ];
    const r = buildCostAnalysis(expenses, fattening, [], weighings, OPTIONS);
    // середня за 18.09 = 2500 г → 4 голови = 10 кг
    expect(r.batches[0].weightKg).toBeCloseTo(10, 6);
  });

  it("не рахує партію без дати забою і не виводить з неї нулі", () => {
    const expenses: ExpenseInput[] = [
      { category: "feed", amount: 500, expense_date: "2026-04-13" },
    ];
    const fattening = [
      batch({ males: 3, slaughtered_at: null, is_active: false, created_at: "2026-04-12T00:00:00" }),
    ];
    const r = buildCostAnalysis(expenses, fattening, [], [], OPTIONS);
    const b = r.batches[0];
    expect(b.costPerHead).toBeNull();
    expect(b.costPerKg).toBeNull();
    expect(b.missing).toContain("дати забою");
  });

  it("не ділить на нуль, коли немає жодної голови", () => {
    const expenses: ExpenseInput[] = [
      { category: "feed", amount: 500, expense_date: "2026-09-10" },
    ];
    const r = buildCostAnalysis(expenses, [], [], [], OPTIONS);
    const feed = r.groups.find((g) => g.group === "feed")!;
    expect(feed.unallocated).toBe(500);
    expect(feed.toBatches).toBe(0);
  });

  it("архівний кріль рахується до дати архівування, активний — до сьогодні", () => {
    const expenses: ExpenseInput[] = [
      { category: "feed", amount: 300, expense_date: "2026-09-01" },
    ];
    const rabbits: RabbitInput[] = [
      { id: "old", name: "Старий", cage_number: null, is_active: false, created_at: "2026-09-01T00:00:00", archive_date: "2026-09-10" },
      { id: "live", name: "Живий", cage_number: null, is_active: true, created_at: "2026-09-01T00:00:00", archive_date: "2026-09-01" },
    ];
    const r = buildCostAnalysis(expenses, [], rabbits, [], OPTIONS);
    const old = r.rabbits.find((x) => x.id === "old")!;
    const live = r.rabbits.find((x) => x.id === "live")!;
    expect(old.days).toBe(10);
    expect(live.days).toBe(19);
  });
});
