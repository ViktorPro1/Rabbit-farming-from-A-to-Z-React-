import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import RabbitRegistry from "./RabbitRegistry";
import { supabase } from "../../lib/supabase";

vi.mock("../../lib/supabase", () => ({
  supabase: { from: vi.fn(), auth: { updateUser: vi.fn() } },
}));

vi.mock("qrcode.react", () => ({ QRCodeCanvas: () => null }));

vi.mock("../../utils/pushNotifications", () => ({
  subscribeToPush: vi.fn(),
  unsubscribeFromPush: vi.fn(),
  getPushSubscriptionStatus: vi.fn().mockResolvedValue(false),
}));

const session = { user: { id: "user-1", user_metadata: {} } } as unknown as Session;

const rabbit = {
  id: "rabbit-1",
  name: "Зоря",
  breed: "Шиншила",
  gender: "female",
  birth_date: "2026-01-10",
  cage_number: "3",
  notes: "",
  is_active: true,
};

type Result = { data?: unknown; error?: { message: string } | null };

// Ланцюжок методів Supabase, що завершується як проміс (thenable),
// як і справжній конструктор запитів.
function chain(result: Result, onEq?: (args: unknown[]) => void) {
  const c: Record<string, unknown> = {};
  const passthrough = () => c;
  c.select = passthrough;
  c.not = passthrough;
  c.order = passthrough;
  c.eq = (...args: unknown[]) => {
    onEq?.(args);
    return c;
  };
  c.then = (resolve: (v: unknown) => unknown, reject: (e: unknown) => unknown) =>
    Promise.resolve({ data: null, error: null, ...result }).then(resolve, reject);
  return c;
}

function setupSupabase(config: {
  rabbits?: Result;
  stats?: Result; // застосовується до всіх п'яти запитів статистики
  archive?: Result;
}) {
  const archiveCalls: unknown[] = [];
  vi.mocked(supabase.from).mockImplementation(((table: string) => {
    if (table === "rabbits") {
      return {
        select: () =>
          chain(config.rabbits ?? { data: [rabbit], error: null }),
        update: (payload: unknown) => {
          archiveCalls.push(payload);
          return chain(config.archive ?? { error: null });
        },
      };
    }
    return {
      select: () => chain(config.stats ?? { data: [], error: null }),
    };
  }) as never);
  return { archiveCalls };
}

function renderPage() {
  return render(
    <MemoryRouter>
      <RabbitRegistry session={session} />
    </MemoryRouter>,
  );
}

async function openArchiveAndConfirm() {
  fireEvent.click(await screen.findByRole("button", { name: "Архівувати" }));
  fireEvent.click(screen.getByRole("button", { name: "Загинула" }));
  // друга кнопка "Архівувати" — підтвердження в модалці
  const buttons = screen.getAllByRole("button", { name: "Архівувати" });
  fireEvent.click(buttons[buttons.length - 1]);
}

describe("RabbitRegistry: помилки Supabase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("помилка завантаження списку показує повідомлення, а не 'кроликів немає'", async () => {
    setupSupabase({ rabbits: { data: null, error: { message: "boom" } } });

    renderPage();

    expect(
      await screen.findByText(/Не вдалося завантажити список кроликів/),
    ).toBeInTheDocument();
    expect(screen.queryByText("Поки що кроликів немає")).not.toBeInTheDocument();
  });

  it("помилка запиту статистики показує повідомлення", async () => {
    setupSupabase({ stats: { data: null, error: { message: "boom" } } });

    renderPage();

    expect(
      await screen.findByText(/Не вдалося завантажити статистику господарства/),
    ).toBeInTheDocument();
  });

  it("без помилок: реєстр показує кролика і жодних повідомлень про збій", async () => {
    setupSupabase({});

    renderPage();

    expect(await screen.findByText("Зоря")).toBeInTheDocument();
    expect(screen.queryByText(/Не вдалося/)).not.toBeInTheDocument();
  });

  it("архівування: помилка лишає модалку відкритою і показує повідомлення", async () => {
    setupSupabase({ archive: { error: { message: "denied" } } });

    renderPage();
    await openArchiveAndConfirm();

    expect(
      await screen.findByText("Не вдалося архівувати кролика. Спробуйте ще раз"),
    ).toBeInTheDocument();
    expect(screen.getByText("Причина архівування?")).toBeInTheDocument();
    expect(screen.getByText("Зоря")).toBeInTheDocument();
  });

  it("архівування без помилок закриває модалку", async () => {
    const { archiveCalls } = setupSupabase({});

    renderPage();
    await openArchiveAndConfirm();

    await waitFor(() =>
      expect(screen.queryByText("Причина архівування?")).not.toBeInTheDocument(),
    );
    expect(archiveCalls).toHaveLength(1);
    expect(archiveCalls[0]).toMatchObject({
      is_active: false,
      archive_reason: "died",
    });
  });

  it("повідомлення про помилку архівування зникає після скасування і повторного відкриття", async () => {
    setupSupabase({ archive: { error: { message: "denied" } } });

    renderPage();
    await openArchiveAndConfirm();
    await screen.findByText("Не вдалося архівувати кролика. Спробуйте ще раз");

    fireEvent.click(screen.getByRole("button", { name: "Скасувати" }));
    fireEvent.click(screen.getByRole("button", { name: "Архівувати" }));

    expect(
      screen.queryByText("Не вдалося архівувати кролика. Спробуйте ще раз"),
    ).not.toBeInTheDocument();
  });
});
