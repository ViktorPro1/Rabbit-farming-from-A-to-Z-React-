import { afterEach, describe, expect, it, vi } from "vitest";
import {
  addDays,
  daysBetween,
  daysLeftLabel,
  formatDateUA,
  parseISO,
  pluralDays,
  todayKyiv,
} from "./dateUtils";

describe("parseISO", () => {
  it("перетворює дату на мілісекунди UTC-півночі", () => {
    expect(parseISO("1970-01-02")).toBe(86_400_000);
  });

  it("бере тільки першу частину, якщо є час", () => {
    expect(parseISO("2026-11-21T10:30:00Z")).toBe(parseISO("2026-11-21"));
  });

  it("повертає NaN для неправильного рядка", () => {
    expect(parseISO("21.11.2026")).toBeNaN();
    expect(parseISO("")).toBeNaN();
  });
});

describe("daysBetween", () => {
  it("рахує різницю в днях", () => {
    expect(daysBetween("2026-11-01", "2026-11-21")).toBe(20);
  });

  it("повертає від'ємне число, якщо to раніше за from", () => {
    expect(daysBetween("2026-11-21", "2026-11-01")).toBe(-20);
  });

  it("не дає зсуву на день при переході на літній час", () => {
    // У 2026 році Україна переходить на літній час 29 березня
    expect(daysBetween("2026-03-28", "2026-03-30")).toBe(2);
  });

  it("не дає зсуву на день при переході на зимовий час", () => {
    expect(daysBetween("2026-10-24", "2026-10-26")).toBe(2);
  });

  it("повертає NaN, якщо дата некоректна", () => {
    expect(daysBetween("abc", "2026-11-21")).toBeNaN();
  });
});

describe("addDays", () => {
  it("додає дні", () => {
    expect(addDays("2026-11-10", 31)).toBe("2026-12-11");
  });

  it("віднімає дні, якщо число від'ємне", () => {
    expect(addDays("2026-11-10", -10)).toBe("2026-10-31");
  });

  it("переходить через кінець року", () => {
    expect(addDays("2026-12-25", 10)).toBe("2027-01-04");
  });

  it("враховує високосний рік", () => {
    expect(addDays("2028-02-28", 1)).toBe("2028-02-29");
    expect(addDays("2027-02-28", 1)).toBe("2027-03-01");
  });
});

describe("todayKyiv", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("повертає дату у форматі YYYY-MM-DD", () => {
    expect(todayKyiv()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("за київським часом уже наступний день, коли в UTC ще вечір", () => {
    vi.useFakeTimers();
    // 22:30 UTC у листопаді це 00:30 наступного дня в Києві (UTC+2)
    vi.setSystemTime(new Date("2026-11-20T22:30:00Z"));
    expect(todayKyiv()).toBe("2026-11-21");
  });

  it("за київським часом ще той самий день, коли в UTC день уже почався", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-21T10:00:00Z"));
    expect(todayKyiv()).toBe("2026-11-21");
  });
});

describe("formatDateUA", () => {
  it("перетворює YYYY-MM-DD на ДД.ММ.РРРР", () => {
    expect(formatDateUA("2026-11-15")).toBe("15.11.2026");
  });

  it("повертає рядок без змін, якщо формат інший", () => {
    expect(formatDateUA("вчора")).toBe("вчора");
  });
});

describe("pluralDays", () => {
  it.each([
    [1, "день"],
    [2, "дні"],
    [3, "дні"],
    [4, "дні"],
    [5, "днів"],
    [10, "днів"],
    [11, "днів"],
    [12, "днів"],
    [14, "днів"],
    [21, "день"],
    [22, "дні"],
    [25, "днів"],
    [101, "день"],
    [111, "днів"],
    [0, "днів"],
  ])("для %i повертає «%s»", (n, word) => {
    expect(pluralDays(n)).toBe(word);
  });

  it("працює з від'ємними числами", () => {
    expect(pluralDays(-1)).toBe("день");
    expect(pluralDays(-12)).toBe("днів");
  });
});

describe("daysLeftLabel", () => {
  it("для 0 пише «сьогодні»", () => {
    expect(daysLeftLabel(0)).toBe("сьогодні");
  });

  it("для 1 пише «завтра»", () => {
    expect(daysLeftLabel(1)).toBe("завтра");
  });

  it("для майбутніх днів пише «через N днів»", () => {
    expect(daysLeftLabel(2)).toBe("через 2 дні");
    expect(daysLeftLabel(5)).toBe("через 5 днів");
    expect(daysLeftLabel(21)).toBe("через 21 день");
  });

  it("для минулих днів пише «прострочено на N днів»", () => {
    expect(daysLeftLabel(-1)).toBe("прострочено на 1 день");
    expect(daysLeftLabel(-3)).toBe("прострочено на 3 дні");
    expect(daysLeftLabel(-20)).toBe("прострочено на 20 днів");
  });
});
