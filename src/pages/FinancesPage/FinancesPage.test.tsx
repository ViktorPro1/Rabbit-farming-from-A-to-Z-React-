import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import FinancesPage from "./FinancesPage";
import { supabase } from "../../lib/supabase";

vi.mock("../../lib/supabase", () => ({ supabase: { from: vi.fn() } }));
vi.mock("../../lib/logError", () => ({ logError: vi.fn() }));

const session = { user: { id: "user-1" } } as Session;

const expense = {
  id: "e-1",
  category: "feed",
  amount: 500,
  expense_date: "2026-08-10",
  description: "Комбікорм",
};
const sale = { id: "s-1", price: 1200, sold_at: "2026-08-15", cage_number: "3", buyer: "Іван" };

type Result = { data?: unknown; error?: { message: string } | null };

function chain(result: Result) {
  const c: Record<string, unknown> = {};
  for (const m of ["select", "eq", "order", "not"]) c[m] = () => c;
  c.then = (resolve: (v: unknown) => unknown, reject: (e: unknown) => unknown) =>
    Promise.resolve({ data: null, error: null, ...result }).then(resolve, reject);
  return c;
}

interface Config {
  expenses?: Result;
  sales?: Result;
  fattening?: Result;
  otherIncome?: Result;
  expenseDelete?: Result;
  saleUpdate?: Result;
  reject?: boolean;
}

function setup(config: Config = {}) {
  const calls = { expenseDelete: 0, saleUpdate: 0 };
  vi.mocked(supabase.from).mockImplementation(((table: string) => {
    if (config.reject && table === "sales") {
      return { select: () => ({ eq: () => ({ order: () => Promise.reject(new Error("network")) }) }) };
    }
    switch (table) {
      case "expenses":
        return {
          select: () => chain(config.expenses ?? { data: [expense] }),
          delete: () => {
            calls.expenseDelete++;
            return chain(config.expenseDelete ?? { error: null });
          },
        };
      case "sales":
        return {
          select: () => chain(config.sales ?? { data: [sale] }),
          update: () => {
            calls.saleUpdate++;
            return chain(config.saleUpdate ?? { error: null });
          },
        };
      case "fattening":
        return { select: () => chain(config.fattening ?? { data: [] }), update: () => chain({ error: null }) };
      case "other_income":
        return { select: () => chain(config.otherIncome ?? { data: [] }), delete: () => chain({ error: null }) };
      default:
        throw new Error("Неочікувана таблиця: " + table);
    }
  }) as never);
  return calls;
}

function renderPage() {
  return render(
    <MemoryRouter>
      <FinancesPage session={session} />
    </MemoryRouter>,
  );
}

describe("FinancesPage: помилки Supabase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  it("без помилок: показує підсумки й жодних повідомлень про збій", async () => {
    setup();
    renderPage();
    await waitFor(() => expect(document.querySelector(".finances-summary")).not.toBeNull());
    expect(screen.queryByText(/Не вдалося/)).not.toBeInTheDocument();
  });

  it("помилка одного із запитів: повідомлення й жодних нульових сум (хибного збитку)", async () => {
    setup({ sales: { data: null, error: { message: "boom" } } });
    renderPage();
    expect(
      await screen.findByText("Не вдалося завантажити фінансові дані. Оновіть сторінку"),
    ).toBeInTheDocument();
    expect(document.querySelector(".finances-summary")).toBeNull();
    expect(screen.queryByText("Завантаження...")).not.toBeInTheDocument();
  });

  it("відхилений запит (Promise.all): сторінка не залишається на 'Завантаження...'", async () => {
    setup({ reject: true });
    renderPage();
    expect(
      await screen.findByText("Не вдалося завантажити фінансові дані. Оновіть сторінку"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Завантаження...")).not.toBeInTheDocument();
  });

  it("видалення витрати: помилка показується, витрата лишається в списку", async () => {
    setup({ expenseDelete: { error: { message: "denied" } } });
    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: /Витрати/ }));
    fireEvent.click(await waitFor(() => {
      const b = document.querySelector(".finances-delete-btn");
      if (!b) throw new Error("немає кнопки");
      return b as HTMLElement;
    }));
    expect(
      await screen.findByText("Не вдалося видалити витрату. Спробуйте ще раз"),
    ).toBeInTheDocument();
    expect(screen.getByText("Комбікорм")).toBeInTheDocument();
  });

  it("видалення витрати без помилок звертається до бази без повідомлень", async () => {
    const calls = setup();
    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: /Витрати/ }));
    fireEvent.click(await waitFor(() => {
      const b = document.querySelector(".finances-delete-btn");
      if (!b) throw new Error("немає кнопки");
      return b as HTMLElement;
    }));
    await waitFor(() => expect(calls.expenseDelete).toBe(1));
    expect(screen.queryByText(/Не вдалося видалити/)).not.toBeInTheDocument();
  });
});
