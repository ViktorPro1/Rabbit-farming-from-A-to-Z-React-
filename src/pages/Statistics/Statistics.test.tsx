import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import Statistics from "./Statistics";
import { supabase } from "../../lib/supabase";

vi.mock("../../lib/supabase", () => ({ supabase: { from: vi.fn() } }));
vi.mock("../../lib/logError", () => ({ logError: vi.fn() }));

const session = { user: { id: "user-1" } } as Session;

type Result = { data?: unknown; error?: { message: string } | null };
type Resolver = (table: string, cols: string) => Result | Promise<Result>;

// Мок будує ланцюжок (select/eq/order/not/is/in/range) і записує кожен
// виклик у calls, щоб перевірити, які саме методи (зокрема .range) і з
// якими аргументами застосовано до кожної таблиці/вибірки.
function makeSupabase(resolver: Resolver, calls: { table: string; cols: string; method: string; args: unknown[] }[]) {
  vi.mocked(supabase.from).mockImplementation(((table: string) => ({
    select: (cols: string) => {
      const c: Record<string, unknown> = {};
      for (const m of ["eq", "order", "not", "is", "in", "range"]) {
        c[m] = (...args: unknown[]) => {
          calls.push({ table, cols, method: m, args });
          return c;
        };
      }
      c.then = (resolve: (v: unknown) => unknown, reject: (e: unknown) => unknown) =>
        Promise.resolve(resolver(table, cols)).then(resolve, reject);
      return c;
    },
  })) as never);
}

function emptyOk(): Result {
  return { data: [], error: null };
}

function renderPage() {
  return render(
    <MemoryRouter>
      <Statistics session={session} />
    </MemoryRouter>,
  );
}

describe("Statistics: паралельність і .range()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("сім незалежних запитів запускаються одночасно (Promise.all), а не по черзі", async () => {
    const calls: { table: string; cols: string; method: string; args: unknown[] }[] = [];
    const gateBox: { release?: () => void } = {};
    const gate = new Promise<void>((resolve) => {
      gateBox.release = resolve;
    });
    makeSupabase(async (table) => {
      await gate; // жоден запит не "відповідає", доки тест не відкриє шлюз
      if (table === "litters") return { data: [], error: null };
      return emptyOk();
    }, calls);

    renderPage();

    // Усі 7 незалежних запитів мають бути ІНІЦІЙОВАНІ одразу, ще до того,
    // як хоч один з них відповів — це і є ознака Promise.all, а не
    // послідовних await один за одним.
    await waitFor(() => {
      const tables = new Set(calls.map((c) => c.table));
      expect(tables.has("fattening")).toBe(true);
      expect(tables.has("sales")).toBe(true);
      expect(tables.has("paddock_litters")).toBe(true);
      expect(tables.has("rabbits")).toBe(true);
      expect(tables.has("quarantine")).toBe(true);
      expect(tables.has("matings")).toBe(true);
    });
    // litters — залежний запит (потребує id злучок), його ще не мало бути
    expect(calls.some((c) => c.table === "litters")).toBe(false);

    gateBox.release?.();
    await waitFor(() => expect(screen.queryByText("Завантаження...")).not.toBeInTheDocument());
  });

  it("кожен із семи незалежних запитів і запит окролів мають .range(0, 9999)", async () => {
    const calls: { table: string; cols: string; method: string; args: unknown[] }[] = [];
    makeSupabase((table) => {
      if (table === "matings") return { data: [{ id: "m1", female_id: "f1", male_id: "m1r" }], error: null };
      if (table === "litters") return { data: [], error: null };
      return emptyOk();
    }, calls);

    renderPage();
    await waitFor(() => expect(screen.queryByText("Завантаження...")).not.toBeInTheDocument());

    const rangedTables = new Set(
      calls.filter((c) => c.method === "range").map((c) => c.table),
    );
    for (const table of ["fattening", "sales", "paddock_litters", "rabbits", "quarantine", "matings", "litters"]) {
      expect(rangedTables.has(table)).toBe(true);
    }
    const badRange = calls.find((c) => c.method === "range" && JSON.stringify(c.args) !== "[0,9999]");
    expect(badRange).toBeUndefined();
  });
});

describe("Statistics: обробка помилок", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("помилка одного з незалежних запитів показує повідомлення, а не нулі", async () => {
    const calls: { table: string; cols: string; method: string; args: unknown[] }[] = [];
    makeSupabase((table) => {
      if (table === "sales") return { data: null, error: { message: "boom" } };
      return emptyOk();
    }, calls);

    renderPage();

    expect(
      await screen.findByText("Не вдалося завантажити статистику. Оновіть сторінку"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Плем. стадо")).not.toBeInTheDocument();
    // litters (залежний запит) не мав викликатись — matings ще навіть не дійшли
    expect(calls.some((c) => c.table === "litters")).toBe(false);
  });

  it("помилка залежного запиту (litters) теж показує повідомлення", async () => {
    const calls: { table: string; cols: string; method: string; args: unknown[] }[] = [];
    makeSupabase((table) => {
      if (table === "matings") return { data: [{ id: "m1", female_id: "f1", male_id: "m1r" }], error: null };
      if (table === "litters") return { data: null, error: { message: "boom" } };
      return emptyOk();
    }, calls);

    renderPage();

    expect(
      await screen.findByText("Не вдалося завантажити статистику. Оновіть сторінку"),
    ).toBeInTheDocument();
  });

  it("без помилок і без злучок: порожня статистика без збоїв", async () => {
    const calls: { table: string; cols: string; method: string; args: unknown[] }[] = [];
    makeSupabase(() => emptyOk(), calls);

    renderPage();

    await waitFor(() => expect(screen.queryByText("Завантаження...")).not.toBeInTheDocument());
    expect(screen.queryByText(/Не вдалося/)).not.toBeInTheDocument();
  });
});

describe("Statistics: розмонтування під час завантаження", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("розмонтування до відповіді сервера не викликає оновлень стану після unmount", async () => {
    const calls: { table: string; cols: string; method: string; args: unknown[] }[] = [];
    const gateBox: { release?: () => void } = {};
    const gate = new Promise<void>((resolve) => {
      gateBox.release = resolve;
    });
    makeSupabase(async () => {
      await gate;
      return emptyOk();
    }, calls);

    const { unmount } = renderPage();
    unmount();
    gateBox.release?.();

    // Даємо мікрозадачам відпрацювати; якби cancelled-захисту не було,
    // React видав би попередження про setState на розмонтованому компоненті
    await new Promise((r) => setTimeout(r, 0));
    expect(console.error).not.toHaveBeenCalled();
  });
});
