import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import Fattening from "./Fattening";
import { supabase } from "../../lib/supabase";

vi.mock("../../lib/supabase", () => ({
  supabase: { from: vi.fn() },
}));

vi.mock("qrcode.react", () => ({ QRCodeCanvas: () => null }));

const session = { user: { id: "user-1" } } as Session;

const cage = {
  id: "cage-1",
  cage_number: "7",
  males: 2,
  females: 3,
  unknown: 0,
  breed: "Каліфорнійська",
  birth_year: "",
  birth_date: "2026-08-01",
  slaughter_date: "",
  notes: "",
};

type Result = { data?: unknown; error?: { message: string } | null };

// Керований мок Supabase: відповіді для кожної таблиці й операції задаються
// в тесті, а всі виклики записуються для перевірок.
function setupSupabase(config: {
  list?: Result[]; // послідовні відповіді на select("fattening")
  fatteningUpdate?: Result;
  salesInsert?: Result;
  rabbitsInsert?: Result;
}) {
  const listResponses = [...(config.list ?? [{ data: [cage], error: null }])];
  const calls = {
    fatteningUpdate: [] as unknown[],
    salesInsert: [] as unknown[],
    rabbitsInsert: [] as unknown[],
  };

  vi.mocked(supabase.from).mockImplementation(((table: string) => {
    if (table === "fattening") {
      return {
        select: () => {
          const chain = {
            eq: () => chain,
            order: () => {
              const next =
                listResponses.length > 1
                  ? listResponses.shift()!
                  : listResponses[0];
              return Promise.resolve({ data: null, error: null, ...next });
            },
          };
          return chain;
        },
        update: (payload: unknown) => ({
          eq: () => {
            calls.fatteningUpdate.push(payload);
            return Promise.resolve({
              error: null,
              ...(config.fatteningUpdate ?? {}),
            });
          },
        }),
        insert: () => Promise.resolve({ error: null }),
      };
    }
    if (table === "sales") {
      return {
        insert: (payload: unknown) => {
          calls.salesInsert.push(payload);
          return Promise.resolve({
            error: null,
            ...(config.salesInsert ?? {}),
          });
        },
      };
    }
    if (table === "rabbits") {
      return {
        insert: (payload: unknown) => {
          calls.rabbitsInsert.push(payload);
          return Promise.resolve({
            error: null,
            ...(config.rabbitsInsert ?? {}),
          });
        },
      };
    }
    throw new Error("Неочікувана таблиця: " + table);
  }) as never);

  return calls;
}

function renderPage() {
  return render(
    <MemoryRouter>
      <Fattening session={session} />
    </MemoryRouter>,
  );
}

async function openSellAndConfirm(males = "1") {
  fireEvent.click(await screen.findByRole("button", { name: "Продано" }));
  fireEvent.change(screen.getByLabelText("Продано самців"), {
    target: { value: males },
  });
  fireEvent.click(screen.getByRole("button", { name: /Підтвердити/ }));
}

describe("Fattening: помилки Supabase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  it("помилка завантаження показує повідомлення, а не 'кліток ще немає'", async () => {
    setupSupabase({ list: [{ data: null, error: { message: "boom" } }] });

    renderPage();

    expect(
      await screen.findByText(/Не вдалося завантажити клітки відгодівлі/),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Кліток відгодівлі ще немає"),
    ).not.toBeInTheDocument();
  });

  it("видалення: помилка показується, клітка лишається в списку", async () => {
    setupSupabase({ fatteningUpdate: { error: { message: "denied" } } });

    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: "Видалити" }));

    expect(
      await screen.findByText("Не вдалося видалити клітку. Спробуйте ще раз"),
    ).toBeInTheDocument();
    expect(screen.getByText("Клітка 7")).toBeInTheDocument();
  });

  it("помилка оновлення списку не очищує наявні клітки", async () => {
    // перша відповідь: список; друга (після видалення): помилка
    setupSupabase({
      list: [
        { data: [cage], error: null },
        { data: null, error: { message: "boom" } },
      ],
    });

    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: "Видалити" }));

    expect(
      await screen.findByText(/Не вдалося оновити список кліток/),
    ).toBeInTheDocument();
    expect(screen.getByText("Клітка 7")).toBeInTheDocument();
  });

  it("продаж: помилка запису продажу лишає модалку відкритою, клітку не чіпає", async () => {
    const calls = setupSupabase({
      salesInsert: { error: { message: "denied" } },
    });

    renderPage();
    await openSellAndConfirm();

    expect(
      await screen.findByText("Помилка збереження продажу"),
    ).toBeInTheDocument();
    expect(calls.fatteningUpdate).toHaveLength(0);
  });

  it("продаж: якщо залишок не оновився, користувач бачить про це попередження", async () => {
    const calls = setupSupabase({
      fatteningUpdate: { error: { message: "denied" } },
    });

    renderPage();
    await openSellAndConfirm();

    expect(
      await screen.findByText(/Продаж записано, але залишок у клітці не оновлено/),
    ).toBeInTheDocument();
    expect(calls.salesInsert).toHaveLength(1);
    // модалку закрито, щоб продаж не задублювали повторним підтвердженням
    expect(screen.queryByLabelText("Продано самців")).not.toBeInTheDocument();
  });

  it("продаж без помилок: залишок зменшується, попереджень немає", async () => {
    const calls = setupSupabase({});

    renderPage();
    await openSellAndConfirm("1");

    await waitFor(() => expect(calls.fatteningUpdate).toHaveLength(1));
    expect(calls.fatteningUpdate[0]).toEqual({
      males: 1,
      females: 3,
      unknown: 0,
    });
    expect(screen.queryByText(/не оновлено/)).not.toBeInTheDocument();
  });

  it("забій: помилка лишає модалку відкритою і показує повідомлення", async () => {
    setupSupabase({ fatteningUpdate: { error: { message: "denied" } } });

    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: "Забій" }));
    fireEvent.click(screen.getByRole("button", { name: /Підтвердити/ }));

    expect(
      await screen.findByText("Помилка збереження забою. Спробуйте ще раз"),
    ).toBeInTheDocument();
    expect(screen.getByText("Підтвердити забій")).toBeInTheDocument();
  });

  it("забій без помилок закриває модалку", async () => {
    setupSupabase({});

    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: "Забій" }));
    fireEvent.click(screen.getByRole("button", { name: /Підтвердити/ }));

    await waitFor(() =>
      expect(screen.queryByText("Підтвердити забій")).not.toBeInTheDocument(),
    );
  });

  it("на плем'я: якщо залишок не оновився, користувач бачить попередження", async () => {
    const calls = setupSupabase({
      fatteningUpdate: { error: { message: "denied" } },
    });

    renderPage();
    fireEvent.click(await screen.findByRole("button", { name: "На плем'я" }));
    fireEvent.change(screen.getByLabelText("Кличка *"), {
      target: { value: "Зоря" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Перевести" }));

    expect(
      await screen.findByText(/Кролика додано в реєстр, але залишок у клітці не оновлено/),
    ).toBeInTheDocument();
    expect(calls.rabbitsInsert).toHaveLength(1);
  });
});
