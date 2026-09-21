import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import MyTreatments from "./MyTreatments";
import { supabase } from "../../lib/supabase";

vi.mock("../../lib/supabase", () => ({ supabase: { from: vi.fn() } }));

const session = { user: { id: "user-1" } } as Session;
const record = {
  id: "tr-1",
  cage_number: "8",
  drug_name: "Байкокс",
  drug_key: null,
  route: null,
  course_days: null,
  date: "2026-08-01",
  next_date: null,
  notes: null,
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

function setup(config: { list?: Result; del?: Result } = {}) {
  const calls = { del: 0 };
  vi.mocked(supabase.from).mockImplementation((() => ({
    select: () => chain(config.list ?? { data: [record] }),
    delete: () => {
      calls.del++;
      return chain(config.del ?? { error: null });
    },
  })) as never);
  return calls;
}

function renderPage() {
  return render(
    <MemoryRouter>
      <MyTreatments session={session} />
    </MemoryRouter>,
  );
}

describe("MyTreatments: помилки Supabase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  it("помилка завантаження показує повідомлення, а не 'записів немає'", async () => {
    setup({ list: { data: null, error: { message: "boom" } } });
    renderPage();
    expect(
      await screen.findByText(/Не вдалося завантажити записи лікування/),
    ).toBeInTheDocument();
    expect(screen.queryByText("Записів лікування ще немає")).not.toBeInTheDocument();
  });

  it("без помилок показує запис і жодних повідомлень про збій", async () => {
    setup();
    renderPage();
    expect(await screen.findByText("Байкокс")).toBeInTheDocument();
    expect(screen.queryByText(/Не вдалося/)).not.toBeInTheDocument();
  });

  it("видалення: помилка показується, запис лишається", async () => {
    setup({ del: { error: { message: "denied" } } });
    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: "Видалити" }));
    expect(
      await screen.findByText("Не вдалося видалити запис. Спробуйте ще раз"),
    ).toBeInTheDocument();
    expect(screen.getByText("Байкокс")).toBeInTheDocument();
  });

  it("видалення без помилок звертається до бази без повідомлень", async () => {
    const calls = setup();
    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: "Видалити" }));
    await waitFor(() => expect(calls.del).toBe(1));
    expect(screen.queryByText(/Не вдалося/)).not.toBeInTheDocument();
  });
});
