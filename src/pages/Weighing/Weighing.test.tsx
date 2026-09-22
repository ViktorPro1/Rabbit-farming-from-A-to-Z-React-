import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import Weighing from "./Weighing";
import { supabase } from "../../lib/supabase";

vi.mock("../../lib/supabase", () => ({ supabase: { from: vi.fn() } }));

const session = { user: { id: "user-1" } } as Session;

const weighing = {
  id: "w-1",
  litter_label: "Гніздо 1",
  rabbit_name: "Зоря",
  weighing_date: "2026-08-10",
  weight_g: 1500,
  notes: null,
  weighing_type: "fattening",
  is_final: false,
  rabbit_id: null,
  fattening_id: null,
  size_category: "meat",
};

type Result = { data?: unknown; error?: { message: string } | null };

const rangeCalls: { table: string; args: unknown[] }[] = [];

function chain(result: Result, table?: string) {
  const c: Record<string, unknown> = {};
  c.select = () => c;
  c.order = () => c;
  c.eq = () => c;
  // Змінено: тепер продакшн-код викликає .range(0, 9999) на всіх основних
  // select-запитах (аудит: без нього PostgREST тихо обрізає до 1000 рядків).
  // Мок мусить надавати цей метод, інакше всі тести впадуть.
  c.range = (...args: unknown[]) => {
    if (table) rangeCalls.push({ table, args });
    return c;
  };
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

function setup(
  config: {
    weighings?: Result;
    rabbits?: Result;
    fattening?: Result;
    del?: Result;
  } = {},
) {
  const calls = { del: 0 };
  rangeCalls.length = 0;
  vi.mocked(supabase.from).mockImplementation(((table: string) => {
    if (table === "weighings") {
      return {
        select: () =>
          chain(config.weighings ?? { data: [weighing] }, "weighings"),
        delete: () => {
          calls.del++;
          return chain(config.del ?? { error: null });
        },
        insert: () => chain({ error: null }),
        update: () => chain({ error: null }),
      };
    }
    if (table === "rabbits") {
      return {
        select: () => chain(config.rabbits ?? { data: [] }, "rabbits"),
        update: () => chain({ error: null }),
      };
    }
    if (table === "fattening") {
      return {
        select: () => chain(config.fattening ?? { data: [] }, "fattening"),
        update: () => chain({ error: null }),
      };
    }
    throw new Error("Неочікувана таблиця: " + table);
  }) as never);
  return calls;
}

function renderPage() {
  return render(
    <MemoryRouter>
      <Weighing session={session} />
    </MemoryRouter>,
  );
}

describe("Weighing: .range() на основних запитах", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("запити зважувань, кроликів і кліток мають .range(0, 9999)", async () => {
    setup();
    renderPage();
    await waitFor(() =>
      expect(screen.queryByText("Завантаження...")).not.toBeInTheDocument(),
    );

    const tables = new Set(rangeCalls.map((c) => c.table));
    expect(tables.has("weighings")).toBe(true);
    expect(tables.has("rabbits")).toBe(true);
    expect(tables.has("fattening")).toBe(true);
    for (const c of rangeCalls) {
      expect(c.args).toEqual([0, 9999]);
    }
  });
});

describe("Weighing: помилки Supabase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  it("помилка завантаження показує повідомлення, а не 'записів немає'", async () => {
    setup({ weighings: { data: null, error: { message: "boom" } } });
    renderPage();
    expect(
      await screen.findByText(/Не вдалося завантажити записи зважування/),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Записів зважування ще немає"),
    ).not.toBeInTheDocument();
  });

  it("помилка завантаження списків кроликів і кліток показує повідомлення", async () => {
    setup({ rabbits: { data: null, error: { message: "boom" } } });
    renderPage();
    expect(
      await screen.findByText(
        /Не вдалося завантажити списки кроликів і кліток/,
      ),
    ).toBeInTheDocument();
  });

  it("без помилок: повідомлень про збій немає", async () => {
    setup();
    renderPage();
    await waitFor(() =>
      expect(screen.queryByText("Завантаження...")).not.toBeInTheDocument(),
    );
    expect(screen.queryByText(/Не вдалося/)).not.toBeInTheDocument();
  });

  it("видалення: помилка показується", async () => {
    setup({ del: { error: { message: "denied" } } });
    renderPage();
    await waitFor(() =>
      expect(document.querySelector(".weighing-delete-btn")).not.toBeNull(),
    );
    fireEvent.click(
      document.querySelector(".weighing-delete-btn") as HTMLElement,
    );
    expect(
      await screen.findByText("Не вдалося видалити запис. Спробуйте ще раз"),
    ).toBeInTheDocument();
  });

  it("видалення без помилок звертається до бази без повідомлень", async () => {
    const calls = setup();
    renderPage();
    await waitFor(() =>
      expect(document.querySelector(".weighing-delete-btn")).not.toBeNull(),
    );
    fireEvent.click(
      document.querySelector(".weighing-delete-btn") as HTMLElement,
    );
    await waitFor(() => expect(calls.del).toBe(1));
    expect(screen.queryByText(/Не вдалося/)).not.toBeInTheDocument();
  });
});
