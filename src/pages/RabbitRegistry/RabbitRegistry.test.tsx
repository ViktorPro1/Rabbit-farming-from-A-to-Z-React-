import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import RabbitRegistry from "./RabbitRegistry";
import { supabase } from "../../lib/supabase";
import {
  getThumbUrls,
  getFullUrl,
  // Видалено : uploadAvatar, removeAvatar — тести аватара кабінету
  // перенесено в SettingsModal.test.tsx. Було: uploadAvatar, removeAvatar,
  uploadRabbitPhoto,
  removeRabbitPhoto,
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
  // Додано (етап 3): фото у формі «Новий кролик»
  uploadRabbitPhoto: vi.fn(),
  removeRabbitPhoto: vi.fn(),
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
  c.single = passthrough;
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
  archive?: Result; // результат будь-якого update у таблиці rabbits
  insert?: Result; // результат створення кролика (за замовчуванням id "new-rabbit")
}) {
  const archiveCalls: unknown[] = [];
  const insertCalls: unknown[] = [];
  // order фіксує послідовність звернень до БД (і до сховища, якщо тест додає)
  const order: string[] = [];
  vi.mocked(supabase.from).mockImplementation(((table: string) => {
    if (table === "rabbits") {
      return {
        select: () => chain(config.rabbits ?? { data: [rabbit], error: null }),
        insert: (payload: unknown) => {
          insertCalls.push(payload);
          order.push("insert");
          return chain(
            config.insert ?? { data: { id: "new-rabbit" }, error: null },
          );
        },
        update: (payload: unknown) => {
          archiveCalls.push(payload);
          order.push(`db:${JSON.stringify(payload)}`);
          return chain(config.archive ?? { error: null });
        },
      };
    }
    return {
      select: () => chain(config.stats ?? { data: [], error: null }),
    };
  }) as never);
  return { archiveCalls, insertCalls, order };
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

// Змінено: тести фото кабінету перенесено в
// src/components/SettingsModal/SettingsModal.test.tsx — вікно налаштувань
// більше не відкривається зі сторінки реєстру (тепер з аватарки в шапці).
// Було тут: describe("RabbitRegistry: фото кабінету", ...), 7 тестів.

// Додано (етап 3): фото у формі «Новий кролик»
describe("RabbitRegistry: фото при додаванні кролика", () => {
  const NEW_PATH = "user-1/new-rabbit-1.webp";
  const PHOTO_ERROR =
    "Кролика збережено, але фото завантажити не вдалося. Додайте його через «Редагувати»";

  const image = () => new File(["x"], "r.jpg", { type: "image/jpeg" });

  async function openForm() {
    await screen.findByText("Зоря");
    fireEvent.click(screen.getByRole("button", { name: "+ Додати кролика" }));
    await screen.findByText("Новий кролик");
  }

  function fillName(name = "Ласка") {
    fireEvent.change(screen.getByPlaceholderText("Кличка *"), {
      target: { value: name },
    });
  }

  function pickPhoto(file: File) {
    const input = screen.getByLabelText(
      "Обрати файл фото кролика",
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });
  }

  function clickSave() {
    fireEvent.click(screen.getByRole("button", { name: "Зберегти" }));
  }

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
    // jsdom не реалізує URL.createObjectURL
    Object.assign(URL, {
      createObjectURL: vi.fn(() => "blob:preview"),
      revokeObjectURL: vi.fn(),
    });
  });

  it("у формі є вибір фото, без обраного файлу перегляду немає", async () => {
    setupSupabase({});
    renderPage();
    await openForm();

    expect(
      screen.getByRole("button", { name: "Обрати фото" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Прибрати фото" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByAltText("Попередній перегляд фото"),
    ).not.toBeInTheDocument();
  });

  it("обране фото показується в перегляді, 'Прибрати фото' його скидає", async () => {
    setupSupabase({});
    renderPage();
    await openForm();

    pickPhoto(image());

    const preview = await screen.findByAltText("Попередній перегляд фото");
    expect(preview.getAttribute("src")).toBe("blob:preview");
    expect(
      screen.getByRole("button", { name: "Змінити фото" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Прибрати фото" }));

    expect(
      screen.queryByAltText("Попередній перегляд фото"),
    ).not.toBeInTheDocument();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:preview");
    expect(
      screen.getByRole("button", { name: "Обрати фото" }),
    ).toBeInTheDocument();
  });

  it("не зображення відхиляється без перегляду і без звернень до сховища", async () => {
    setupSupabase({});
    renderPage();
    await openForm();

    pickPhoto(new File(["x"], "a.pdf", { type: "application/pdf" }));

    expect(
      await screen.findByText("Оберіть файл із зображенням"),
    ).toBeInTheDocument();
    expect(
      screen.queryByAltText("Попередній перегляд фото"),
    ).not.toBeInTheDocument();
    expect(uploadRabbitPhoto).not.toHaveBeenCalled();
  });

  it("з фото: спершу створення кролика, потім завантаження, потім запис шляху", async () => {
    const { order, insertCalls } = setupSupabase({});
    vi.mocked(uploadRabbitPhoto).mockImplementation(async () => {
      order.push("upload");
      return NEW_PATH;
    });
    renderPage();
    await openForm();

    const file = image();
    fillName();
    pickPhoto(file);
    clickSave();

    await waitFor(() =>
      expect(screen.queryByText("Новий кролик")).not.toBeInTheDocument(),
    );
    expect(insertCalls).toHaveLength(1);
    expect(insertCalls[0]).toMatchObject({ name: "Ласка", user_id: "user-1" });
    expect(uploadRabbitPhoto).toHaveBeenCalledWith(
      "user-1",
      "new-rabbit",
      file,
    );
    // перші три звернення — це саме додавання; далі йде оновлення списку
    expect(order.slice(0, 3)).toEqual([
      "insert",
      "upload",
      `db:${JSON.stringify({ photo_path: NEW_PATH })}`,
    ]);
    expect(removeRabbitPhoto).not.toHaveBeenCalled();
    expect(screen.queryByText(PHOTO_ERROR)).not.toBeInTheDocument();
  });

  it("без фото: кролик створюється, сховище не чіпається", async () => {
    const { insertCalls } = setupSupabase({});
    renderPage();
    await openForm();

    fillName();
    clickSave();

    await waitFor(() =>
      expect(screen.queryByText("Новий кролик")).not.toBeInTheDocument(),
    );
    expect(insertCalls).toHaveLength(1);
    expect(uploadRabbitPhoto).not.toHaveBeenCalled();
    expect(removeRabbitPhoto).not.toHaveBeenCalled();
  });

  it("збій створення кролика: фото не завантажується, форма лишається", async () => {
    setupSupabase({ insert: { data: null, error: { message: "denied" } } });
    renderPage();
    await openForm();

    fillName();
    pickPhoto(image());
    clickSave();

    expect(await screen.findByText("Помилка збереження")).toBeInTheDocument();
    expect(uploadRabbitPhoto).not.toHaveBeenCalled();
    expect(screen.getByText("Новий кролик")).toBeInTheDocument();
    // обране фото не губиться, його не треба вибирати повторно
    expect(screen.getByAltText("Попередній перегляд фото")).toBeInTheDocument();
  });

  it("збій завантаження фото: кролика збережено, є повідомлення, шлях не записується", async () => {
    const { archiveCalls } = setupSupabase({});
    vi.mocked(uploadRabbitPhoto).mockRejectedValue(new Error("boom"));
    renderPage();
    await openForm();

    fillName();
    pickPhoto(image());
    clickSave();

    expect(await screen.findByText(PHOTO_ERROR)).toBeInTheDocument();
    expect(screen.queryByText("Новий кролик")).not.toBeInTheDocument();
    expect(archiveCalls).toHaveLength(0);
    expect(removeRabbitPhoto).not.toHaveBeenCalled();
  });

  it("збій запису шляху в БД: завантажений файл прибирається, є повідомлення", async () => {
    setupSupabase({ archive: { error: { message: "denied" } } });
    vi.mocked(uploadRabbitPhoto).mockResolvedValue(NEW_PATH);
    renderPage();
    await openForm();

    fillName();
    pickPhoto(image());
    clickSave();

    expect(await screen.findByText(PHOTO_ERROR)).toBeInTheDocument();
    expect(removeRabbitPhoto).toHaveBeenCalledTimes(1);
    expect(removeRabbitPhoto).toHaveBeenCalledWith(NEW_PATH);
    expect(screen.queryByText("Новий кролик")).not.toBeInTheDocument();
  });

  it("після успішного додавання фото скидається для наступного кролика", async () => {
    setupSupabase({});
    vi.mocked(uploadRabbitPhoto).mockResolvedValue(NEW_PATH);
    renderPage();
    await openForm();

    fillName();
    pickPhoto(image());
    clickSave();
    await waitFor(() =>
      expect(screen.queryByText("Новий кролик")).not.toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole("button", { name: "+ Додати кролика" }));
    await screen.findByText("Новий кролик");

    expect(
      screen.queryByAltText("Попередній перегляд фото"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Обрати фото" }),
    ).toBeInTheDocument();
  });
});
