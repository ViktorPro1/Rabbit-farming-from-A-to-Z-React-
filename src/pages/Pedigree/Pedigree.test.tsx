import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import Pedigree from "./Pedigree";
import { supabase } from "../../lib/supabase";

vi.mock("../../lib/supabase", () => ({ supabase: { from: vi.fn() } }));

const session = { user: { id: "user-1" } } as Session;

const base = { breed: "Шиншила", birth_date: "2026-01-10", mother_id: null, father_id: null };
const rabbits = [
  { ...base, id: "c1", name: "Дитина", gender: "female", cage_number: "1", father_id: "f1" },
  { ...base, id: "f1", name: "Батько", gender: "male", cage_number: "2" },
  { ...base, id: "m1", name: "Мати", gender: "female", cage_number: "3" },
];

type Result = { data?: unknown; error?: { message: string } | null };

function chain(result: Result) {
  const c: Record<string, unknown> = {};
  c.select = () => c;
  c.order = () => c;
  c.eq = () => c;
  c.then = (resolve: (v: unknown) => unknown, reject: (e: unknown) => unknown) =>
    Promise.resolve({ data: null, error: null, ...result }).then(resolve, reject);
  return c;
}

function setup(config: { list?: Result; update?: Result } = {}) {
  const updates: unknown[] = [];
  vi.mocked(supabase.from).mockImplementation((() => ({
    select: () => chain(config.list ?? { data: rabbits }),
    update: (payload: unknown) => {
      updates.push(payload);
      return chain(config.update ?? { error: null });
    },
  })) as never);
  return updates;
}

function renderPage() {
  return render(
    <MemoryRouter>
      <Pedigree session={session} />
    </MemoryRouter>,
  );
}

async function openAssignSelect() {
  fireEvent.click(await screen.findByRole("button", { name: /Дитина/ }));
  return (await waitFor(() => {
    const el = document.querySelector("#pedigree-assign-mother-c1");
    if (!el) throw new Error("select не знайдено");
    return el;
  })) as HTMLSelectElement;
}

describe("Pedigree: помилки Supabase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("помилка завантаження показує повідомлення", async () => {
    setup({ list: { data: null, error: { message: "boom" } } });
    renderPage();
    expect(await screen.findByText(/Не вдалося завантажити кроликів/)).toBeInTheDocument();
  });

  it("призначення предка: успіх зберігає mother_id", async () => {
    const updates = setup();
    renderPage();
    const select = await openAssignSelect();
    fireEvent.change(select, { target: { value: "m1" } });
    await waitFor(() => expect(updates).toEqual([{ mother_id: "m1" }]));
    expect(screen.queryByText(/Не вдалося/)).not.toBeInTheDocument();
  });

  it("призначення предка: помилка показується, а список повертається до '+ Мати'", async () => {
    setup({ update: { error: { message: "denied" } } });
    renderPage();
    const select = await openAssignSelect();
    fireEvent.change(select, { target: { value: "m1" } });
    expect(
      await screen.findByText("Не вдалося зберегти предка. Спробуйте ще раз"),
    ).toBeInTheDocument();
    expect(
      (document.querySelector("#pedigree-assign-mother-c1") as HTMLSelectElement).value,
    ).toBe("");
  });
});
