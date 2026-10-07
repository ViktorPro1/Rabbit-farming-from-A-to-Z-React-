import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import Archive from "./Archive";
import { supabase } from "../../lib/supabase";
import { removeRabbitPhoto } from "../../utils/photoStorage";

vi.mock("../../lib/supabase", () => ({ supabase: { from: vi.fn() } }));
vi.mock("../../utils/photoStorage", () => ({ removeRabbitPhoto: vi.fn() }));

const session = { user: { id: "user-1" } } as unknown as Session;
const PHOTO = "user-1/rabbit-1-1700000000000.webp";

const archived = {
  id: "rabbit-1",
  name: "Зоря",
  breed: "Шиншила",
  gender: "female",
  birth_date: "2025-01-10",
  cage_number: "3",
  notes: "",
  archive_reason: "died",
  archive_date: "2026-09-01",
  photo_path: PHOTO as string | null,
};

type Result = { data?: unknown; error?: { message: string; code?: string } | null };

function chain(result: Result) {
  const c: Record<string, unknown> = {};
  const self = () => c;
  c.select = self;
  c.eq = self;
  c.not = self;
  c.order = self;
  c.then = (res: (v: unknown) => unknown, rej: (e: unknown) => unknown) =>
    Promise.resolve({ data: null, error: null, ...result }).then(res, rej);
  return c;
}

function setup(opts: {
  rabbits?: unknown[];
  quarantine?: unknown[];
  del?: Result;
} = {}) {
  const order: string[] = [];
  vi.mocked(supabase.from).mockImplementation(((table: string) => {
    if (table === "quarantine") {
      return { select: () => chain({ data: opts.quarantine ?? [] }) };
    }
    return {
      select: () => chain({ data: opts.rabbits ?? [archived] }),
      delete: () => {
        order.push("db:delete");
        return chain(opts.del ?? { error: null });
      },
      update: () => chain({ error: null }),
    };
  }) as never);
  vi.mocked(removeRabbitPhoto).mockImplementation(async (p: string) => {
    order.push(`remove:${p}`);
  });
  return { order };
}

function renderPage() {
  return render(
    <MemoryRouter>
      <Archive session={session} />
    </MemoryRouter>,
  );
}

describe("Archive: остаточне видалення", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(window, "confirm").mockReturnValue(true);
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  it("кролик із фото: запис видаляється, потім фото зі сховища", async () => {
    const { order } = setup();
    renderPage();

    fireEvent.click(await screen.findByRole("button", { name: "Видалити" }));

    await waitFor(() => expect(screen.queryByText("Зоря")).not.toBeInTheDocument());
    expect(order).toEqual(["db:delete", `remove:${PHOTO}`]);
  });

  it("кролик без фото: сховище не чіпається", async () => {
    setup({ rabbits: [{ ...archived, photo_path: null }] });
    renderPage();

    fireEvent.click(await screen.findByRole("button", { name: "Видалити" }));

    await waitFor(() => expect(screen.queryByText("Зоря")).not.toBeInTheDocument());
    expect(removeRabbitPhoto).not.toHaveBeenCalled();
  });

  it("помилка зв'язків (23503): кролик і його фото лишаються", async () => {
    setup({ del: { error: { message: "fk", code: "23503" } } });
    renderPage();

    fireEvent.click(await screen.findByRole("button", { name: "Видалити" }));

    await waitFor(() => expect(window.alert).toHaveBeenCalled());
    expect(String(vi.mocked(window.alert).mock.calls[0][0])).toContain(
      "задіяний у записах розведення",
    );
    expect(removeRabbitPhoto).not.toHaveBeenCalled();
    expect(screen.getByText("Зоря")).toBeInTheDocument();
  });

  it("інша помилка видалення: фото не видаляється", async () => {
    setup({ del: { error: { message: "denied" } } });
    renderPage();

    fireEvent.click(await screen.findByRole("button", { name: "Видалити" }));

    await waitFor(() => expect(window.alert).toHaveBeenCalled());
    expect(removeRabbitPhoto).not.toHaveBeenCalled();
    expect(screen.getByText("Зоря")).toBeInTheDocument();
  });

  it("скасування підтвердження нічого не видаляє", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    const { order } = setup();
    renderPage();

    fireEvent.click(await screen.findByRole("button", { name: "Видалити" }));

    expect(order).toEqual([]);
    expect(screen.getByText("Зоря")).toBeInTheDocument();
  });

  it("відновлення не торкається фото", async () => {
    setup();
    renderPage();

    fireEvent.click(await screen.findByRole("button", { name: "Відновити" }));

    await waitFor(() => expect(screen.queryByText("Зоря")).not.toBeInTheDocument());
    expect(removeRabbitPhoto).not.toHaveBeenCalled();
  });
});

describe("Archive: список", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("кролик в активному карантині не показується в архіві", async () => {
    setup({
      rabbits: [archived, { ...archived, id: "rabbit-2", name: "Мушка" }],
      quarantine: [{ rabbit_id: "rabbit-2" }],
    });
    renderPage();

    expect(await screen.findByText("Зоря")).toBeInTheDocument();
    expect(screen.queryByText("Мушка")).not.toBeInTheDocument();
  });

  it("порожній архів показує повідомлення", async () => {
    setup({ rabbits: [] });
    renderPage();

    expect(await screen.findByText("Архів порожній")).toBeInTheDocument();
  });
});
