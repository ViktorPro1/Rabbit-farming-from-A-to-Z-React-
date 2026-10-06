import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import RabbitRegistry from "./RabbitRegistry";
import { supabase } from "../../lib/supabase";
import {
  getThumbUrls,
  getFullUrl,
  uploadAvatar,
  removeAvatar,
} from "../../utils/photoStorage";

vi.mock("../../lib/supabase", () => ({
  supabase: { from: vi.fn(), auth: { updateUser: vi.fn() } },
}));

vi.mock("qrcode.react", () => ({ QRCodeCanvas: () => null }));

// Додано: сховище фото замоковане, мережі в тестах немає
vi.mock("../../utils/photoStorage", () => ({
  getThumbUrls: vi.fn(),
  getFullUrl: vi.fn(),
  // Додано (етап 2): аватар кабінету
  uploadAvatar: vi.fn(),
  removeAvatar: vi.fn(),
}));

vi.mock("../../utils/pushNotifications", () => ({
  subscribeToPush: vi.fn(),
  unsubscribeFromPush: vi.fn(),
  getPushSubscriptionStatus: vi.fn().mockResolvedValue(false),
}));

const session = {
  user: { id: "user-1", user_metadata: {} },
} as unknown as Session;

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

function setupSupabase(config: {
  rabbits?: Result;
  stats?: Result; // застосовується до всіх п'яти запитів статистики
  archive?: Result;
}) {
  const archiveCalls: unknown[] = [];
  vi.mocked(supabase.from).mockImplementation(((table: string) => {
    if (table === "rabbits") {
      return {
        select: () => chain(config.rabbits ?? { data: [rabbit], error: null }),
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
    expect(
      screen.queryByText("Поки що кроликів немає"),
    ).not.toBeInTheDocument();
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
      await screen.findByText(
        "Не вдалося архівувати кролика. Спробуйте ще раз",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Причина архівування?")).toBeInTheDocument();
    expect(screen.getByText("Зоря")).toBeInTheDocument();
  });

  it("архівування без помилок закриває модалку", async () => {
    const { archiveCalls } = setupSupabase({});

    renderPage();
    await openArchiveAndConfirm();

    await waitFor(() =>
      expect(
        screen.queryByText("Причина архівування?"),
      ).not.toBeInTheDocument(),
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

// Додано: фото племінних кроликів
describe("RabbitRegistry: фото кроликів", () => {
  const photoPath = "user-1/rabbit-1-1700000000000.webp";

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("кролик без фото: мініатюри немає і запит посилань не робиться", async () => {
    setupSupabase({});

    const { container } = renderPage();

    expect(await screen.findByText("Зоря")).toBeInTheDocument();
    expect(container.querySelector("img.rabbit-photo")).toBeNull();
    expect(getThumbUrls).not.toHaveBeenCalled();
  });

  it("кролик з фото: показується мініатюра", async () => {
    setupSupabase({
      rabbits: { data: [{ ...rabbit, photo_path: photoPath }], error: null },
    });
    vi.mocked(getThumbUrls).mockResolvedValue({
      [photoPath]: "https://example.test/thumb.webp",
    });

    const { container } = renderPage();

    await screen.findByText("Зоря");
    await waitFor(() =>
      expect(container.querySelector("img.rabbit-photo")).not.toBeNull(),
    );
    expect(
      container.querySelector("img.rabbit-photo")?.getAttribute("src"),
    ).toBe("https://example.test/thumb.webp");
    expect(getThumbUrls).toHaveBeenCalledWith([photoPath]);
  });

  it("клік по мініатюрі відкриває повне фото, закриття його ховає", async () => {
    setupSupabase({
      rabbits: { data: [{ ...rabbit, photo_path: photoPath }], error: null },
    });
    vi.mocked(getThumbUrls).mockResolvedValue({
      [photoPath]: "https://example.test/thumb.webp",
    });
    vi.mocked(getFullUrl).mockResolvedValue("https://example.test/full.webp");

    renderPage();

    fireEvent.click(
      await screen.findByRole("button", { name: "Відкрити фото: Зоря" }),
    );

    const full = await screen.findByAltText("Фото: Зоря");
    expect(full.getAttribute("src")).toBe("https://example.test/full.webp");

    fireEvent.click(screen.getByRole("button", { name: "Закрити фото" }));
    expect(screen.queryByAltText("Фото: Зоря")).not.toBeInTheDocument();
  });

  it("збій отримання повного фото показує повідомлення", async () => {
    setupSupabase({
      rabbits: { data: [{ ...rabbit, photo_path: photoPath }], error: null },
    });
    vi.mocked(getThumbUrls).mockResolvedValue({
      [photoPath]: "https://example.test/thumb.webp",
    });
    vi.mocked(getFullUrl).mockResolvedValue(null);

    renderPage();

    fireEvent.click(
      await screen.findByRole("button", { name: "Відкрити фото: Зоря" }),
    );

    expect(
      await screen.findByText("Не вдалося відкрити фото. Спробуйте ще раз"),
    ).toBeInTheDocument();
  });

  it("збій отримання мініатюр не ламає реєстр", async () => {
    setupSupabase({
      rabbits: { data: [{ ...rabbit, photo_path: photoPath }], error: null },
    });
    vi.mocked(getThumbUrls).mockRejectedValue(new Error("boom"));

    const { container } = renderPage();

    expect(await screen.findByText("Зоря")).toBeInTheDocument();
    await waitFor(() => expect(console.error).toHaveBeenCalled());
    expect(container.querySelector("img.rabbit-photo")).toBeNull();
    expect(screen.queryByText(/Не вдалося/)).not.toBeInTheDocument();
  });
});

// Додано (етап 2): фото особистого кабінету в налаштуваннях
describe("RabbitRegistry: фото кабінету", () => {
  const OLD_AVATAR = "user-1/avatar-1.webp";
  const NEW_AVATAR = "user-1/avatar-2.webp";

  function sessionWith(meta: Record<string, unknown>) {
    return {
      user: { id: "user-1", email: "viktor@example.com", user_metadata: meta },
    } as unknown as Session;
  }

  function renderWith(s: Session) {
    return render(
      <MemoryRouter>
        <RabbitRegistry session={s} />
      </MemoryRouter>,
    );
  }

  async function openSettings() {
    fireEvent.click(await screen.findByTitle("Налаштування"));
    await screen.findByText("Відображуване ім'я або назва господарства");
  }

  function pickAvatar(file: File) {
    const input = screen.getByLabelText(
      "Обрати файл фото кабінету",
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });
  }

  const image = () => new File(["x"], "me.jpg", { type: "image/jpeg" });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
    setupSupabase({});
    vi.mocked(getFullUrl).mockImplementation(
      async (p: string) => `https://example.test/${p}`,
    );
  });

  it("без аватара: літера і кнопка 'Додати фото'", async () => {
    renderWith(sessionWith({}));
    await openSettings();

    expect(screen.getByText("V")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Додати фото" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Видалити фото" }),
    ).not.toBeInTheDocument();
  });

  it("з аватаром: показується фото, є 'Замінити' і 'Видалити'", async () => {
    renderWith(sessionWith({ avatar_path: OLD_AVATAR }));
    await openSettings();

    const img = await screen.findByAltText("Фото кабінету");
    expect(img.getAttribute("src")).toBe(`https://example.test/${OLD_AVATAR}`);
    expect(
      screen.getByRole("button", { name: "Замінити фото" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Видалити фото" }),
    ).toBeInTheDocument();
  });

  it("заміна: файл -> метадані -> лише потім видалення старого", async () => {
    const order: string[] = [];
    vi.mocked(uploadAvatar).mockImplementation(async () => {
      order.push("upload");
      return NEW_AVATAR;
    });
    vi.mocked(supabase.auth.updateUser).mockImplementation((async (
      p: unknown,
    ) => {
      order.push(`meta:${JSON.stringify(p)}`);
      return { error: null };
    }) as never);
    vi.mocked(removeAvatar).mockImplementation(async (p: string) => {
      order.push(`remove:${p}`);
    });

    renderWith(sessionWith({ avatar_path: OLD_AVATAR }));
    await openSettings();
    await screen.findByAltText("Фото кабінету");

    pickAvatar(image());

    await waitFor(() =>
      expect(order).toEqual([
        "upload",
        `meta:${JSON.stringify({ data: { avatar_path: NEW_AVATAR } })}`,
        `remove:${OLD_AVATAR}`,
      ]),
    );
    await waitFor(() =>
      expect(screen.getByAltText("Фото кабінету").getAttribute("src")).toBe(
        `https://example.test/${NEW_AVATAR}`,
      ),
    );
  });

  it("збій запису метаданих: новий файл прибирається, старе фото лишається", async () => {
    vi.mocked(uploadAvatar).mockResolvedValue(NEW_AVATAR);
    vi.mocked(supabase.auth.updateUser).mockResolvedValue({
      error: { message: "denied" },
    } as never);

    renderWith(sessionWith({ avatar_path: OLD_AVATAR }));
    await openSettings();
    await screen.findByAltText("Фото кабінету");

    pickAvatar(image());

    expect(
      await screen.findByText("Не вдалося зберегти фото. Спробуй ще раз."),
    ).toBeInTheDocument();
    expect(removeAvatar).toHaveBeenCalledTimes(1);
    expect(removeAvatar).toHaveBeenCalledWith(NEW_AVATAR);
    expect(screen.getByAltText("Фото кабінету").getAttribute("src")).toBe(
      `https://example.test/${OLD_AVATAR}`,
    );
  });

  it("не зображення відхиляється без звернень до сховища", async () => {
    renderWith(sessionWith({}));
    await openSettings();

    pickAvatar(new File(["x"], "a.pdf", { type: "application/pdf" }));

    expect(
      await screen.findByText("Оберіть файл із зображенням."),
    ).toBeInTheDocument();
    expect(uploadAvatar).not.toHaveBeenCalled();
  });

  it("видалення: спершу метадані, потім файл; повертається літера", async () => {
    const order: string[] = [];
    vi.mocked(supabase.auth.updateUser).mockImplementation((async (
      p: unknown,
    ) => {
      order.push(`meta:${JSON.stringify(p)}`);
      return { error: null };
    }) as never);
    vi.mocked(removeAvatar).mockImplementation(async (p: string) => {
      order.push(`remove:${p}`);
    });

    renderWith(sessionWith({ avatar_path: OLD_AVATAR }));
    await openSettings();
    await screen.findByAltText("Фото кабінету");

    fireEvent.click(screen.getByRole("button", { name: "Видалити фото" }));

    await waitFor(() => expect(screen.getByText("V")).toBeInTheDocument());
    expect(order).toEqual([
      `meta:${JSON.stringify({ data: { avatar_path: null } })}`,
      `remove:${OLD_AVATAR}`,
    ]);
  });

  it("збій видалення в метаданих: файл не видаляється, фото лишається", async () => {
    vi.mocked(supabase.auth.updateUser).mockResolvedValue({
      error: { message: "denied" },
    } as never);

    renderWith(sessionWith({ avatar_path: OLD_AVATAR }));
    await openSettings();
    await screen.findByAltText("Фото кабінету");

    fireEvent.click(screen.getByRole("button", { name: "Видалити фото" }));

    expect(
      await screen.findByText("Не вдалося видалити фото. Спробуй ще раз."),
    ).toBeInTheDocument();
    expect(removeAvatar).not.toHaveBeenCalled();
    expect(screen.getByAltText("Фото кабінету")).toBeInTheDocument();
  });
});
