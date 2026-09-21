import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import AptechkaPage from "./AptechkaPage";
import { supabase } from "../../lib/supabase";

vi.mock("../../lib/supabase", () => ({ supabase: { from: vi.fn() } }));

const session = { user: { id: "user-1" } } as Session;
const batch = {
  id: "b-1",
  name: "Ветом",
  purchase_date: "2026-08-01",
  expiry_date: "2027-08-01",
  quantity_purchased: 10,
  quantity_remaining: 5,
  unit: "мл",
  needs_details: false,
  used_up: false,
};

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

function setup(config: { list?: Result; update?: Result; del?: Result } = {}) {
  const calls = { update: [] as unknown[], del: 0 };
  vi.mocked(supabase.from).mockImplementation((() => ({
    select: () => chain(config.list ?? { data: [batch] }),
    update: (payload: unknown) => {
      calls.update.push(payload);
      return chain(config.update ?? { error: null });
    },
    delete: () => {
      calls.del++;
      return chain(config.del ?? { error: null });
    },
    insert: () => chain({ error: null }),
  })) as never);
  return calls;
}

function renderPage() {
  return render(
    <MemoryRouter>
      <AptechkaPage session={session} />
    </MemoryRouter>,
  );
}

describe("AptechkaPage: помилки Supabase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  it("помилка завантаження показує повідомлення", async () => {
    setup({ list: { data: null, error: { message: "boom" } } });
    renderPage();
    expect(await screen.findByText(/Не вдалося завантажити аптечку/)).toBeInTheDocument();
  });

  it("без помилок показує препарат і жодних повідомлень про збій", async () => {
    setup();
    renderPage();
    expect(await screen.findByText("Ветом")).toBeInTheDocument();
    expect(screen.queryByText(/Не вдалося/)).not.toBeInTheDocument();
  });

  it("видалення: помилка показується, препарат лишається", async () => {
    setup({ del: { error: { message: "denied" } } });
    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: "Видалити" }));
    expect(
      await screen.findByText("Не вдалося видалити запис. Спробуйте ще раз"),
    ).toBeInTheDocument();
    expect(screen.getByText("Ветом")).toBeInTheDocument();
  });

  it("'Використано все': помилка показується", async () => {
    setup({ update: { error: { message: "denied" } } });
    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: "Використано все" }));
    expect(
      await screen.findByText("Не вдалося позначити препарат використаним. Спробуйте ще раз"),
    ).toBeInTheDocument();
  });

  it("залишок: помилка збереження лишає поле редагування відкритим", async () => {
    setup({ update: { error: { message: "denied" } } });
    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: /Залишок/ }));
    const input = document.querySelector("#aptechka-remaining-b-1") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "3" } });
    fireEvent.click(screen.getByRole("button", { name: "✓" }));
    expect(
      await screen.findByText("Не вдалося зберегти залишок. Спробуйте ще раз"),
    ).toBeInTheDocument();
    expect(document.querySelector("#aptechka-remaining-b-1")).not.toBeNull();
  });

  it("залишок: успіх зберігає значення і закриває поле", async () => {
    const calls = setup();
    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: /Залишок/ }));
    const input = document.querySelector("#aptechka-remaining-b-1") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "3" } });
    fireEvent.click(screen.getByRole("button", { name: "✓" }));
    await waitFor(() =>
      expect(calls.update).toEqual([{ quantity_remaining: 3, used_up: false }]),
    );
    await waitFor(() => expect(document.querySelector("#aptechka-remaining-b-1")).toBeNull());
  });
});
