import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import Matings from "./Matings";
import { supabase } from "../../lib/supabase";

vi.mock("../../lib/supabase", () => ({ supabase: { from: vi.fn() } }));

const session = { user: { id: "user-1" } } as Session;

const rabbits = [
  { id: "r-f", name: "Зоря", breed: "Шиншила", gender: "female", cage_number: "1", is_active: true },
  { id: "r-m", name: "Барон", breed: "Шиншила", gender: "male", cage_number: "2", is_active: true },
];

const mating = {
  id: "m1",
  is_archived: false,
  female_id: "r-f",
  male_id: "r-m",
  mating_date: "2026-08-01",
  control_date: "2026-08-08",
  expected_birth: "2026-09-01",
  male_cage: "2",
  female_cage: "1",
  notes: "",
  breeding_scheme: "extensive",
  female: { name: "Зоря", breed: "Шиншила", cage_number: "1" },
  male: { name: "Барон", breed: "Шиншила", cage_number: "2" },
};

type Result = { data?: unknown; error?: { message: string } | null };

function chain(result: Result) {
  const c: Record<string, unknown> = {};
  for (const m of ["select", "order", "eq", "in", "limit"]) c[m] = () => c;
  c.then = (resolve: (v: unknown) => unknown, reject: (e: unknown) => unknown) =>
    Promise.resolve({ data: null, error: null, ...result }).then(resolve, reject);
  return c;
}

interface Config {
  rabbits?: Result;
  matings?: Result;
  litters?: Result;
  matingDelete?: Result;
  matingUpdate?: Result;
  litterInsert?: Result;
  fatteningSelect?: Result;
  fatteningInsert?: Result;
}

function setup(config: Config = {}) {
  const calls = { fatteningInsert: [] as unknown[], litterInsert: 0, matingDelete: 0 };
  vi.mocked(supabase.from).mockImplementation(((table: string) => {
    switch (table) {
      case "rabbits":
        return { select: () => chain(config.rabbits ?? { data: rabbits }) };
      case "matings":
        return {
          select: () => chain(config.matings ?? { data: [mating] }),
          delete: () => {
            calls.matingDelete++;
            return chain(config.matingDelete ?? { error: null });
          },
          update: () => chain(config.matingUpdate ?? { error: null }),
          insert: () => chain({ error: null }),
        };
      case "litters":
        return {
          select: () => chain(config.litters ?? { data: [] }),
          insert: () => {
            calls.litterInsert++;
            return chain(config.litterInsert ?? { error: null });
          },
          update: () => chain({ error: null }),
          delete: () => chain({ error: null }),
        };
      case "fattening":
        return {
          select: () => chain(config.fatteningSelect ?? { data: [] }),
          insert: (payload: unknown) => {
            calls.fatteningInsert.push(payload);
            return chain(config.fatteningInsert ?? { error: null });
          },
          update: () => chain({ error: null }),
        };
      default:
        throw new Error("Неочікувана таблиця: " + table);
    }
  }) as never);
  return calls;
}

function renderPage() {
  return render(
    <MemoryRouter>
      <Matings session={session} />
    </MemoryRouter>,
  );
}

async function fillLitterWithWeaning() {
  fireEvent.click(await screen.findByRole("button", { name: "Розгорнути" }));
  fireEvent.click(await screen.findByRole("button", { name: "+ Додати окріл" }));
  const byId = (id: string) => document.querySelector(id) as HTMLInputElement;
  fireEvent.change(byId("#litter-add-m1-weaned-date"), { target: { value: "2026-10-01" } });
  fireEvent.change(byId("#litter-add-m1-weaned-males"), { target: { value: "3" } });
  fireEvent.change(byId("#litter-add-m1-weaned-males-cage"), { target: { value: "5" } });
  fireEvent.click(screen.getByRole("button", { name: "Зберегти окріл" }));
}

describe("Matings: завантаження", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  it("без помилок: злучка видима, повідомлень про збій немає", async () => {
    setup();
    renderPage();
    expect((await screen.findAllByText(/Зоря/)).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Не вдалося/)).not.toBeInTheDocument();
  });

  it("помилка завантаження злучок: повідомлення, а не 'злучок ще немає'", async () => {
    setup({ matings: { data: null, error: { message: "boom" } } });
    renderPage();
    expect(await screen.findByText(/Не вдалося завантажити дані парувань/)).toBeInTheDocument();
    expect(screen.queryByText("Злучок ще немає")).not.toBeInTheDocument();
  });

  it("помилка завантаження окролів: повідомлення (злучки не показуються без окролів)", async () => {
    setup({ litters: { data: null, error: { message: "boom" } } });
    renderPage();
    expect(await screen.findByText(/Не вдалося завантажити дані парувань/)).toBeInTheDocument();
    expect(screen.queryByText("Злучок ще немає")).not.toBeInTheDocument();
  });

  it("помилка завантаження кроликів: повідомлення", async () => {
    setup({ rabbits: { data: null, error: { message: "boom" } } });
    renderPage();
    expect(await screen.findByText(/Не вдалося завантажити дані парувань/)).toBeInTheDocument();
  });
});

describe("Matings: дії", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  it("видалення злучки: помилка показується, злучка лишається", async () => {
    setup({ matingDelete: { error: { message: "denied" } } });
    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: "Видалити" }));
    expect(
      await screen.findByText("Не вдалося видалити злучку. Спробуйте ще раз"),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/Зоря/).length).toBeGreaterThan(0);
  });

  it("архівування злучки: помилка показується", async () => {
    setup({ matingUpdate: { error: { message: "denied" } } });
    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: "Архів" }));
    expect(
      await screen.findByText("Не вдалося архівувати злучку. Спробуйте ще раз"),
    ).toBeInTheDocument();
  });
});

describe("Matings: окріл з відлученням створює клітки відгодівлі", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("успіх: клітку відгодівлі створено, попереджень немає", async () => {
    const calls = setup();
    renderPage();
    await fillLitterWithWeaning();
    await waitFor(() => expect(calls.fatteningInsert).toHaveLength(1));
    expect(calls.fatteningInsert[0]).toMatchObject({ cage_number: "5", males: 3, females: 0 });
    expect(screen.queryByText(/Окріл збережено, але клітки/)).not.toBeInTheDocument();
  });

  it("клітку не створено (помилка запису): користувач бачить попередження", async () => {
    const calls = setup({ fatteningInsert: { error: { message: "denied" } } });
    renderPage();
    await fillLitterWithWeaning();
    expect(
      await screen.findByText(/Окріл збережено, але клітки відгодівлі створено не повністю/),
    ).toBeInTheDocument();
    expect(calls.litterInsert).toBe(1);
  });

  it("помилка перевірки існуючої клітки: нову не створюємо (без дублікатів) і попереджаємо", async () => {
    const calls = setup({ fatteningSelect: { data: null, error: { message: "boom" } } });
    renderPage();
    await fillLitterWithWeaning();
    expect(
      await screen.findByText(/Окріл збережено, але клітки відгодівлі створено не повністю/),
    ).toBeInTheDocument();
    expect(calls.fatteningInsert).toHaveLength(0);
  });
});
