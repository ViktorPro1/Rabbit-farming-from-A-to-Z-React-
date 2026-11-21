import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import FinancesPage from "./FinancesPage";
import { supabase } from "../../lib/supabase";
import { logError } from "../../lib/logError";
import { todayKyiv } from "../../utils/kyivDate";

// Дати на сторінці виводяться за локальним часовим поясом.
// Фіксуємо київський, щоб тести не залежали від комп'ютера.
vi.stubEnv("TZ", "Europe/Kyiv");

vi.mock("../../lib/supabase", () => ({ supabase: { from: vi.fn() } }));
vi.mock("../../lib/logError", () => ({ logError: vi.fn() }));

const session = { user: { id: "user-1" } } as Session;

// ── Тестові дані ──
// Серпень 2026: продаж 1200, шкурки 300, витрати 500 + 100, забито 1 голову (без ваги туші)
// Вересень 2026: продаж 800 (+ один продаж без ціни), послід 150, витрата 250,
//   забито 6 голів (1,5 кг × 200 грн) і 2 голови (1,2 кг × 210 грн)
const expenses = [
  {
    id: "e-2",
    category: "vet",
    amount: 250,
    expense_date: "2026-09-03",
    description: "Вакцина",
  },
  {
    id: "e-3",
    category: "feed",
    amount: 100,
    expense_date: "2026-08-25",
    description: null,
  },
  {
    id: "e-1",
    category: "feed",
    amount: 500,
    expense_date: "2026-08-10",
    description: "Комбікорм",
  },
];

const sales = [
  {
    id: "s-3",
    price: null,
    sold_at: "2026-09-10",
    cage_number: "7",
    buyer: null,
  },
  {
    id: "s-2",
    price: 800,
    sold_at: "2026-09-02",
    cage_number: "5",
    buyer: "Петро",
  },
  {
    id: "s-1",
    price: 1200,
    sold_at: "2026-08-15",
    cage_number: "3",
    buyer: "Іван",
  },
];

const otherIncome = [
  {
    id: "oi-2",
    category: "manure",
    amount: 150,
    income_date: "2026-09-05",
    description: "Послід, 3 мішки",
  },
  {
    id: "oi-1",
    category: "hides",
    amount: 300,
    income_date: "2026-08-20",
    description: "Шкурки",
  },
];

const fattening = [
  {
    id: "c-3",
    cage_number: "16",
    breed: "Фландр",
    males: 0,
    females: 2,
    unknown: 0,
    slaughtered_at: "2026-09-25",
    carcass_weight_kg: 1.2,
    carcass_price_per_kg: 210,
  },
  {
    id: "c-1",
    cage_number: "12",
    breed: "Каліфорнійська",
    males: 2,
    females: 3,
    unknown: 1,
    slaughtered_at: "2026-09-20",
    carcass_weight_kg: 1.5,
    carcass_price_per_kg: 200,
  },
  {
    id: "c-2",
    cage_number: "14",
    breed: "Новозеландська",
    males: 1,
    females: 0,
    unknown: 0,
    slaughtered_at: "2026-08-30",
    carcass_weight_kg: null,
    carcass_price_per_kg: null,
  },
];

// ── Керований мок Supabase ──
type Result = { data?: unknown; error?: { message: string } | null };

interface Call {
  table: string;
  op: string;
  args: unknown[];
}

interface Config {
  expenses?: unknown[];
  sales?: unknown[];
  fattening?: unknown[];
  otherIncome?: unknown[];
  insert?: Result;
  update?: Result;
  remove?: Result;
}

let calls: Call[] = [];

function chain(table: string, op: string, result: Result) {
  const c: Record<string, unknown> = {};
  for (const m of ["select", "eq", "order", "not"]) {
    c[m] = (...args: unknown[]) => {
      calls.push({ table, op: `${op}.${m}`, args });
      return c;
    };
  }
  c.then = (
    resolve: (v: unknown) => unknown,
    reject: (e: unknown) => unknown,
  ) =>
    Promise.resolve({ data: null, error: null, ...result }).then(
      resolve,
      reject,
    );
  return c;
}

function setup(config: Config = {}) {
  calls = [];
  const rows: Record<string, unknown[]> = {
    expenses: config.expenses ?? expenses,
    sales: config.sales ?? sales,
    fattening: config.fattening ?? fattening,
    other_income: config.otherIncome ?? otherIncome,
  };
  vi.mocked(supabase.from).mockImplementation(((table: string) => ({
    select: (...args: unknown[]) => {
      calls.push({ table, op: "select", args });
      return chain(table, "select", { data: rows[table] });
    },
    insert: (...args: unknown[]) => {
      calls.push({ table, op: "insert", args });
      return Promise.resolve({ error: null, ...config.insert });
    },
    update: (...args: unknown[]) => {
      calls.push({ table, op: "update", args });
      return chain(table, "update", config.update ?? { error: null });
    },
    delete: (...args: unknown[]) => {
      calls.push({ table, op: "delete", args });
      return chain(table, "delete", config.remove ?? { error: null });
    },
  })) as never);
}

const callsOf = (table: string, op: string) =>
  calls.filter((c) => c.table === table && c.op === op);

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/finances"]}>
      <Routes>
        <Route path="/finances" element={<FinancesPage session={session} />} />
        <Route path="/registry" element={<div>Сторінка реєстру</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

/** Текст без нерозривних пробілів (у «1 200 грн» між цифрами пробіл NBSP). */
const norm = (s: string | null | undefined) =>
  (s ?? "").replace(/\s+/g, " ").trim();

async function openPage(config: Config = {}) {
  setup(config);
  const view = renderPage();
  await waitFor(() =>
    expect(document.querySelector(".finances-summary")).not.toBeNull(),
  );
  return view;
}

const summary = (kind: string) =>
  norm(
    document.querySelector(
      `.finances-summary-card.${kind} .finances-summary-val`,
    )?.textContent,
  );

const clickTab = (name: RegExp) =>
  fireEvent.click(screen.getByRole("button", { name }));

/** Рядки (заголовок місяця: підсумок) у поточній вкладці. */
function monthHeaders(): string[] {
  return Array.from(document.querySelectorAll(".finances-month-header")).map(
    (el) =>
      Array.from(el.children)
        .map((child) => norm(child.textContent))
        .join(" "),
  );
}

const change = (id: string, value: string) =>
  fireEvent.change(document.getElementById(id) as HTMLElement, {
    target: { value },
  });

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(window, "confirm").mockReturnValue(true);
});

describe("FinancesPage: запити до бази", () => {
  it("вантажить дані тільки поточного користувача", async () => {
    await openPage();
    for (const table of ["expenses", "sales", "fattening", "other_income"]) {
      expect(callsOf(table, "select.eq")).toContainEqual({
        table,
        op: "select.eq",
        args: ["user_id", "user-1"],
      });
    }
  });

  it("власне споживання бере тільки забиті клітки", async () => {
    await openPage();
    expect(callsOf("fattening", "select.eq")).toContainEqual({
      table: "fattening",
      op: "select.eq",
      args: ["is_active", false],
    });
    expect(callsOf("fattening", "select.not")[0].args).toEqual([
      "slaughtered_at",
      "is",
      null,
    ]);
  });
});

describe("FinancesPage: загальні підсумки", () => {
  it("дохід = продажі з ціною + інший дохід", async () => {
    await openPage();
    // 1200 + 800 + 300 + 150; продаж без ціни не враховується
    expect(summary("income")).toBe("2 450 грн");
  });

  it("витрати = сума всіх витрат", async () => {
    await openPage();
    expect(summary("expense")).toBe("850 грн");
  });

  it("прибуток = дохід мінус витрати, зі знаком «+»", async () => {
    await openPage();
    expect(summary("profit")).toBe("+1 600 грн");
  });

  it("власне споживання: голови і умовна вартість, у прибуток не входить", async () => {
    await openPage();
    // 6 + 1 + 2 голів; 1,5 × 200 × 6 = 1800 і 1,2 × 210 × 2 = 504
    expect(summary("self-consumption")).toBe("9 гол.");
    expect(
      norm(
        document.querySelector(
          ".finances-summary-card.self-consumption .finances-row-desc",
        )?.textContent,
      ),
    ).toBe("≈ 2 304 грн");
    expect(summary("profit")).toBe("+1 600 грн");
  });

  it("збиток показується без «+»", async () => {
    await openPage({ sales: [], fattening: [], otherIncome: [] });
    // Тільки витрати 850
    expect(summary("income")).toBe("0 грн");
    expect(summary("profit")).toMatch(/^[-−]850 грн$/);
  });

  it("без даних: нулі й порожні стани на всіх вкладках", async () => {
    await openPage({ expenses: [], sales: [], fattening: [], otherIncome: [] });
    expect(summary("income")).toBe("0 грн");
    expect(summary("expense")).toBe("0 грн");
    expect(summary("self-consumption")).toBe("0 гол.");
    expect(summary("profit")).toBe("+0 грн");
    expect(screen.getByText("Даних ще немає")).toBeInTheDocument();

    clickTab(/Витрати/);
    expect(screen.getByText("Витрат ще немає")).toBeInTheDocument();

    clickTab(/Доходи/);
    expect(screen.getByText("Доходів ще не було")).toBeInTheDocument();
  });

  it("власне споживання без ваги туші не дає умовної вартості", async () => {
    await openPage({ fattening: [fattening[2]] });
    expect(summary("self-consumption")).toBe("1 гол.");
    expect(
      document.querySelector(
        ".finances-summary-card.self-consumption .finances-row-desc",
      ),
    ).toBeNull();
  });

  it("запис з порожньою датою або без ціни не ламає розрахунок", async () => {
    await openPage({
      sales: [
        {
          id: "x1",
          price: 0,
          sold_at: "2026-08-01",
          cage_number: "1",
          buyer: null,
        },
        { id: "x2", price: 500, sold_at: "", cage_number: "2", buyer: null },
      ],
      expenses: [],
      fattening: [],
      otherIncome: [],
    });
    // Сума продажів рахує 500 (ціна є), але місяць для запису без дати не створюється
    expect(summary("income")).toBe("500 грн");
    expect(screen.getByText("Даних ще немає")).toBeInTheDocument();
  });
});

describe("FinancesPage: вкладка «Огляд»", () => {
  it("показує місяці від найновішого з прибутком за місяць", async () => {
    await openPage();
    const labels = Array.from(
      document.querySelectorAll(".finances-row .finances-row-category"),
    ).map((el) => norm(el.textContent));
    expect(labels).toEqual(["Вересень 2026", "Серпень 2026"]);

    const amounts = Array.from(
      document.querySelectorAll(".finances-row .finances-row-amount"),
    ).map((el) => norm(el.textContent));
    // Вересень: 800 + 150 − 250 = 700. Серпень: 1200 + 300 − 600 = 900
    expect(amounts).toEqual(["+700 грн", "+900 грн"]);
  });

  it("за місяць показує кількість забитих і умовну вартість", async () => {
    await openPage();
    const descriptions = Array.from(
      document.querySelectorAll(".finances-row .finances-row-desc"),
    ).map((el) => norm(el.textContent));
    expect(descriptions).toEqual([
      "🍖 забито: 8 гол. (умовно ≈2 304 грн, якби продали)",
      "🍖 забито: 1 гол.",
    ]);
  });

  it("місяць з витратами більшими за дохід має від'ємний прибуток", async () => {
    await openPage({
      sales: [],
      otherIncome: [],
      fattening: [],
      expenses: [
        {
          id: "e",
          category: "feed",
          amount: 400,
          expense_date: "2026-07-01",
          description: null,
        },
      ],
    });
    const amount = document.querySelector(".finances-row .finances-row-amount");
    expect(norm(amount?.textContent)).toMatch(/^[-−]400 грн$/);
  });

  it("малює графік з підписами місяців", async () => {
    await openPage();
    const svgText = norm(document.querySelector("svg")?.textContent);
    expect(svgText).toContain("Сер 26");
    expect(svgText).toContain("Вер 26");
  });
});

describe("FinancesPage: вкладка «Витрати»", () => {
  it("групує витрати по місяцях із сумою місяця, найновіший зверху", async () => {
    await openPage();
    clickTab(/Витрати/);
    expect(monthHeaders()).toEqual([
      "Вересень 2026 250 грн",
      "Серпень 2026 600 грн",
    ]);
  });

  it("показує категорію, опис, суму зі знаком мінус і дату", async () => {
    await openPage();
    clickTab(/Витрати/);
    expect(screen.getByText("💊 Ветеринарія")).toBeInTheDocument();
    expect(screen.getByText("Вакцина")).toBeInTheDocument();
    expect(screen.getByText("−250 грн")).toBeInTheDocument();
    expect(screen.getByText("03.09.2026")).toBeInTheDocument();
    expect(screen.getAllByText("🌾 Корм")).toHaveLength(2);
  });
});

describe("FinancesPage: вкладка «Доходи»", () => {
  it("продажі групуються по місяцях, продаж без ціни не збільшує суму", async () => {
    await openPage();
    clickTab(/Доходи/);
    const headers = monthHeaders();
    // Продажі: вересень 800, серпень 1200. Інший дохід: 150 і 300.
    // Власне споживання: серпень 1 гол., вересень 8 гол. і 2 304 грн
    expect(headers).toEqual([
      "Вересень 2026 800 грн",
      "Серпень 2026 1 200 грн",
      "Вересень 2026 150 грн",
      "Серпень 2026 300 грн",
      "Вересень 2026 8 гол. · ≈2 304 грн",
      "Серпень 2026 1 гол.",
    ]);
  });

  it("показує покупця, номер клітки й ціну; для продажу без ціни пропонує її вказати", async () => {
    await openPage();
    clickTab(/Доходи/);
    expect(screen.getByText("Покупець: Іван")).toBeInTheDocument();
    expect(screen.getByText("Клітка 3")).toBeInTheDocument();
    expect(
      screen.getByText("+1 200 грн", { normalizer: norm }),
    ).toBeInTheDocument();
    expect(screen.getByText("➕ Вказати ціну")).toBeInTheDocument();
  });

  it("заголовок власного споживання містить голови й умовну вартість", async () => {
    await openPage();
    clickTab(/Доходи/);
    expect(
      screen.getByText(/Власне споживання \(9 гол\., ≈2 304 грн\)/, {
        normalizer: norm,
      }),
    ).toBeInTheDocument();
  });

  it("для кожної партії показує вагу × голови і вартість, або пропонує вказати вагу", async () => {
    await openPage();
    clickTab(/Доходи/);
    expect(
      screen.getByText(/1\.5 кг × 6 гол · ≈1 800 грн/, { normalizer: norm }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/1\.2 кг × 2 гол · ≈504 грн/, { normalizer: norm }),
    ).toBeInTheDocument();
    expect(screen.getByText("➕ Вказати вагу/ціну")).toBeInTheDocument();
  });

  it("інший дохід показує категорію, опис і суму з плюсом", async () => {
    await openPage();
    clickTab(/Доходи/);
    expect(screen.getByText("🐇 Шкурки")).toBeInTheDocument();
    expect(screen.getByText("Послід, 3 мішки")).toBeInTheDocument();
    expect(screen.getByText("+300 грн")).toBeInTheDocument();
  });

  it("лише власне споживання теж прибирає порожній стан", async () => {
    await openPage({ sales: [], otherIncome: [], expenses: [] });
    clickTab(/Доходи/);
    expect(screen.queryByText("Доходів ще не було")).not.toBeInTheDocument();
  });
});

describe("FinancesPage: додавання витрати", () => {
  async function openExpenseForm() {
    await openPage();
    clickTab(/Витрати/);
    fireEvent.click(screen.getByRole("button", { name: "+ Додати витрату" }));
  }

  it("форма відкривається зі сьогоднішньою датою за Києвом", async () => {
    await openExpenseForm();
    expect(
      (document.getElementById("expense-date") as HTMLInputElement).value,
    ).toBe(todayKyiv());
  });

  it("«Скасувати» закриває форму", async () => {
    await openExpenseForm();
    fireEvent.click(screen.getByRole("button", { name: "✕ Скасувати" }));
    expect(document.getElementById("expense-amount")).toBeNull();
  });

  it("кнопка «Зберегти» заблокована, поки не вписана сума", async () => {
    await openExpenseForm();
    const save = screen.getByRole("button", { name: "Зберегти" });
    expect(save).toBeDisabled();
    change("expense-amount", "350");
    expect(save).toBeEnabled();
    change("expense-date", "");
    expect(save).toBeDisabled();
  });

  it("зберігає витрату з правильними полями й перезавантажує дані", async () => {
    await openExpenseForm();
    change("expense-category", "vet");
    change("expense-amount", "350");
    change("expense-date", "2026-11-01");
    change("expense-description", "Сіно");
    const before = callsOf("expenses", "select").length;
    fireEvent.click(screen.getByRole("button", { name: "Зберегти" }));

    await waitFor(() => expect(callsOf("expenses", "insert")).toHaveLength(1));
    expect(callsOf("expenses", "insert")[0].args[0]).toEqual({
      user_id: "user-1",
      category: "vet",
      amount: 350,
      expense_date: "2026-11-01",
      description: "Сіно",
    });
    await waitFor(() =>
      expect(callsOf("expenses", "select").length).toBe(before + 1),
    );
    // Форма закрилась
    await waitFor(() =>
      expect(document.getElementById("expense-amount")).toBeNull(),
    );
  });

  it("порожній опис зберігається як null", async () => {
    await openExpenseForm();
    change("expense-amount", "100");
    fireEvent.click(screen.getByRole("button", { name: "Зберегти" }));
    await waitFor(() => expect(callsOf("expenses", "insert")).toHaveLength(1));
    expect(
      (callsOf("expenses", "insert")[0].args[0] as { description: unknown })
        .description,
    ).toBeNull();
  });

  it("при помилці бази форма лишається відкритою з повідомленням", async () => {
    setup({ insert: { error: { message: "denied" } } });
    renderPage();
    await waitFor(() =>
      expect(document.querySelector(".finances-summary")).not.toBeNull(),
    );
    clickTab(/Витрати/);
    fireEvent.click(screen.getByRole("button", { name: "+ Додати витрату" }));
    change("expense-amount", "100");
    fireEvent.click(screen.getByRole("button", { name: "Зберегти" }));
    expect(await screen.findByText("Помилка збереження")).toBeInTheDocument();
    expect(
      (document.getElementById("expense-amount") as HTMLInputElement).value,
    ).toBe("100");
  });
});

describe("FinancesPage: додавання іншого доходу", () => {
  async function openIncomeForm() {
    await openPage();
    clickTab(/Доходи/);
    fireEvent.click(
      screen.getByRole("button", {
        name: "+ Додати дохід (шкурки, послід...)",
      }),
    );
  }

  it("зберігає дохід з правильними полями", async () => {
    await openIncomeForm();
    change("income-category", "manure");
    change("income-amount", "220");
    change("income-date", "2026-10-12");
    change("income-description", "Послід, 5 мішків");
    fireEvent.click(screen.getByRole("button", { name: "Зберегти" }));
    await waitFor(() =>
      expect(callsOf("other_income", "insert")).toHaveLength(1),
    );
    expect(callsOf("other_income", "insert")[0].args[0]).toEqual({
      user_id: "user-1",
      category: "manure",
      amount: 220,
      income_date: "2026-10-12",
      description: "Послід, 5 мішків",
    });
  });

  it("кнопка «Зберегти» заблокована без суми", async () => {
    await openIncomeForm();
    expect(screen.getByRole("button", { name: "Зберегти" })).toBeDisabled();
  });

  it("при помилці показує повідомлення", async () => {
    setup({ insert: { error: { message: "denied" } } });
    renderPage();
    await waitFor(() =>
      expect(document.querySelector(".finances-summary")).not.toBeNull(),
    );
    clickTab(/Доходи/);
    fireEvent.click(
      screen.getByRole("button", {
        name: "+ Додати дохід (шкурки, послід...)",
      }),
    );
    change("income-amount", "50");
    fireEvent.click(screen.getByRole("button", { name: "Зберегти" }));
    expect(await screen.findByText("Помилка збереження")).toBeInTheDocument();
  });
});

describe("FinancesPage: видалення", () => {
  const deleteButtons = () =>
    Array.from(
      document.querySelectorAll(".finances-delete-btn"),
    ) as HTMLElement[];

  it("видалення витрати: запит іде за id, якщо підтвердити", async () => {
    await openPage();
    clickTab(/Витрати/);
    // Перша кнопка належить найновішій витраті (e-2)
    fireEvent.click(deleteButtons()[0]);
    await waitFor(() => expect(callsOf("expenses", "delete")).toHaveLength(1));
    expect(callsOf("expenses", "delete.eq")[0].args).toEqual(["id", "e-2"]);
  });

  it("видалення витрати: без підтвердження нічого не відбувається", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    await openPage();
    clickTab(/Витрати/);
    fireEvent.click(deleteButtons()[0]);
    expect(callsOf("expenses", "delete")).toHaveLength(0);
  });

  it("видалення іншого доходу: запит іде за id", async () => {
    await openPage();
    clickTab(/Доходи/);
    fireEvent.click(deleteButtons()[0]);
    await waitFor(() =>
      expect(callsOf("other_income", "delete")).toHaveLength(1),
    );
    expect(callsOf("other_income", "delete.eq")[0].args).toEqual([
      "id",
      "oi-2",
    ]);
  });

  it("видалення іншого доходу: помилка показується і пишеться в журнал", async () => {
    setup({ remove: { error: { message: "denied" } } });
    renderPage();
    await waitFor(() =>
      expect(document.querySelector(".finances-summary")).not.toBeNull(),
    );
    clickTab(/Доходи/);
    fireEvent.click(deleteButtons()[0]);
    expect(
      await screen.findByText(
        "Не вдалося видалити запис доходу. Спробуйте ще раз",
      ),
    ).toBeInTheDocument();
    expect(logError).toHaveBeenCalledWith(
      "FinancesPage.handleDeleteOtherIncome",
      expect.anything(),
    );
  });

  it("без підтвердження дохід не видаляється", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    await openPage();
    clickTab(/Доходи/);
    fireEvent.click(deleteButtons()[0]);
    expect(callsOf("other_income", "delete")).toHaveLength(0);
  });
});

describe("FinancesPage: ціна продажу", () => {
  async function startEditPrice() {
    await openPage();
    clickTab(/Доходи/);
    fireEvent.click(screen.getByText("➕ Вказати ціну"));
  }

  it("зберігає ціну для потрібного продажу і закриває поле", async () => {
    await startEditPrice();
    change("sale-price-s-3", "950");
    fireEvent.click(screen.getByRole("button", { name: "✓" }));
    await waitFor(() => expect(callsOf("sales", "update")).toHaveLength(1));
    expect(callsOf("sales", "update")[0].args[0]).toEqual({ price: 950 });
    expect(callsOf("sales", "update.eq")[0].args).toEqual(["id", "s-3"]);
    await waitFor(() =>
      expect(document.getElementById("sale-price-s-3")).toBeNull(),
    );
  });

  it.each(["", "0", "-5"])("ціна «%s» не зберігається", async (value) => {
    await startEditPrice();
    change("sale-price-s-3", value);
    fireEvent.click(screen.getByRole("button", { name: "✓" }));
    expect(callsOf("sales", "update")).toHaveLength(0);
    expect(document.getElementById("sale-price-s-3")).not.toBeNull();
  });

  it("при помилці поле лишається відкритим зі введеною ціною", async () => {
    setup({ update: { error: { message: "denied" } } });
    renderPage();
    await waitFor(() =>
      expect(document.querySelector(".finances-summary")).not.toBeNull(),
    );
    clickTab(/Доходи/);
    fireEvent.click(screen.getByText("➕ Вказати ціну"));
    change("sale-price-s-3", "950");
    fireEvent.click(screen.getByRole("button", { name: "✓" }));
    expect(
      await screen.findByText("Не вдалося зберегти ціну. Спробуйте ще раз"),
    ).toBeInTheDocument();
    expect(
      (document.getElementById("sale-price-s-3") as HTMLInputElement).value,
    ).toBe("950");
  });

  it("для продажу з ціною поле відкривається з поточною ціною", async () => {
    await openPage();
    clickTab(/Доходи/);
    fireEvent.click(screen.getByText(/\+800\s?грн/, { normalizer: norm }));
    expect(
      (document.getElementById("sale-price-s-2") as HTMLInputElement).value,
    ).toBe("800");
  });
});

describe("FinancesPage: вага туші", () => {
  async function startEditCarcass(label: string | RegExp) {
    await openPage();
    clickTab(/Доходи/);
    fireEvent.click(screen.getByText(label, { normalizer: norm }));
  }

  it("для партії без ваги ціна за кг за замовчуванням 210", async () => {
    await startEditCarcass("➕ Вказати вагу/ціну");
    expect(
      (document.getElementById("carcass-weight-c-2") as HTMLInputElement).value,
    ).toBe("");
    expect(
      (document.getElementById("carcass-price-kg-c-2") as HTMLInputElement)
        .value,
    ).toBe("210");
  });

  it("для партії з вагою поля відкриваються з поточними значеннями", async () => {
    await startEditCarcass(/1\.5 кг × 6 гол/);
    expect(
      (document.getElementById("carcass-weight-c-1") as HTMLInputElement).value,
    ).toBe("1.5");
    expect(
      (document.getElementById("carcass-price-kg-c-1") as HTMLInputElement)
        .value,
    ).toBe("200");
  });

  it("зберігає вагу і ціну за кг для потрібної клітки", async () => {
    await startEditCarcass("➕ Вказати вагу/ціну");
    change("carcass-weight-c-2", "1.4");
    change("carcass-price-kg-c-2", "190");
    fireEvent.click(screen.getByRole("button", { name: "✓" }));
    await waitFor(() => expect(callsOf("fattening", "update")).toHaveLength(1));
    expect(callsOf("fattening", "update")[0].args[0]).toEqual({
      carcass_weight_kg: 1.4,
      carcass_price_per_kg: 190,
    });
    expect(callsOf("fattening", "update.eq")[0].args).toEqual(["id", "c-2"]);
  });

  it.each([
    ["0", "210"],
    ["", "210"],
    ["1.4", "0"],
    ["1.4", ""],
    ["-1", "210"],
  ])("вага «%s» і ціна «%s» не зберігаються", async (weight, price) => {
    await startEditCarcass("➕ Вказати вагу/ціну");
    change("carcass-weight-c-2", weight);
    change("carcass-price-kg-c-2", price);
    fireEvent.click(screen.getByRole("button", { name: "✓" }));
    expect(callsOf("fattening", "update")).toHaveLength(0);
  });

  it("при помилці форма лишається відкритою з повідомленням", async () => {
    setup({ update: { error: { message: "denied" } } });
    renderPage();
    await waitFor(() =>
      expect(document.querySelector(".finances-summary")).not.toBeNull(),
    );
    clickTab(/Доходи/);
    fireEvent.click(screen.getByText("➕ Вказати вагу/ціну"));
    change("carcass-weight-c-2", "1.4");
    fireEvent.click(screen.getByRole("button", { name: "✓" }));
    expect(
      await screen.findByText(
        "Не вдалося зберегти вагу туші. Спробуйте ще раз",
      ),
    ).toBeInTheDocument();
    expect(document.getElementById("carcass-weight-c-2")).not.toBeNull();
  });
});

describe("FinancesPage: решта сторінки", () => {
  it("кнопка «Мої кролики» веде до реєстру", async () => {
    await openPage();
    fireEvent.click(screen.getByRole("button", { name: /Мої кролики/ }));
    expect(await screen.findByText("Сторінка реєстру")).toBeInTheDocument();
  });

  it("довідка «Як рахуються дохід, витрати і прибуток» розгортається і згортається", async () => {
    await openPage();
    const toggle = screen.getByRole("button", {
      name: /Як рахуються дохід, витрати і прибуток/,
    });
    expect(screen.queryByText(/збираються з різних розділів/)).toBeNull();
    fireEvent.click(toggle);
    expect(
      screen.getByText(/збираються з різних розділів/),
    ).toBeInTheDocument();
    fireEvent.click(toggle);
    expect(screen.queryByText(/збираються з різних розділів/)).toBeNull();
  });
});
