import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import RabbitEdit from "./RabbitEdit";
import { supabase } from "../../lib/supabase";
import {
  uploadRabbitPhoto,
  removeRabbitPhoto,
  getThumbUrls,
} from "../../utils/photoStorage";

vi.mock("../../lib/supabase", () => ({
  supabase: { from: vi.fn() },
}));

vi.mock("../../utils/photoStorage", () => ({
  uploadRabbitPhoto: vi.fn(),
  removeRabbitPhoto: vi.fn(),
  getThumbUrls: vi.fn(),
}));

const session = { user: { id: "user-1" } } as unknown as Session;

const baseRabbit = {
  id: "rabbit-1",
  name: "Зоря",
  breed: "Шиншила",
  gender: "female",
  birth_date: "2026-01-10",
  cage_number: "3",
  notes: "",
  photo_path: null as string | null,
};

const OLD = "user-1/rabbit-1-1.webp";
const NEW = "user-1/rabbit-1-2.webp";

type Result = { data?: unknown; error?: { message: string } | null };

function chain(result: Result) {
  const c: Record<string, unknown> = {};
  const self = () => c;
  c.select = self;
  c.eq = self;
  c.single = self;
  c.then = (res: (v: unknown) => unknown, rej: (e: unknown) => unknown) =>
    Promise.resolve({ data: null, error: null, ...result }).then(res, rej);
  return c;
}

// order фіксує послідовність звернень до БД і сховища
function setup(opts: { rabbit?: Partial<typeof baseRabbit>; update?: Result } = {}) {
  const order: string[] = [];
  const updates: unknown[] = [];
  vi.mocked(supabase.from).mockImplementation((() => ({
    select: () => chain({ data: { ...baseRabbit, ...opts.rabbit }, error: null }),
    update: (payload: unknown) => {
      updates.push(payload);
      order.push(`db:${JSON.stringify(payload)}`);
      return chain(opts.update ?? { error: null });
    },
  })) as never);
  vi.mocked(removeRabbitPhoto).mockImplementation(async (p: string) => {
    order.push(`remove:${p}`);
  });
  vi.mocked(getThumbUrls).mockImplementation(async (paths: string[]) =>
    Object.fromEntries(paths.map((p) => [p, `https://example.test/${p}`])),
  );
  return { order, updates };
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/registry/edit/rabbit-1"]}>
      <Routes>
        <Route
          path="/registry/edit/:id"
          element={<RabbitEdit session={session} />}
        />
        <Route path="/registry" element={<p>Реєстр</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

function pickFile(file: File) {
  const input = screen.getByLabelText("Обрати файл фото") as HTMLInputElement;
  fireEvent.change(input, { target: { files: [file] } });
}

const image = () => new File(["x"], "r.jpg", { type: "image/jpeg" });

describe("RabbitEdit: фото кролика", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("без фото: плейсхолдер і кнопка 'Додати фото'", async () => {
    setup();
    renderPage();

    expect(await screen.findByText("Фото немає")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Додати фото" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Видалити фото" })).not.toBeInTheDocument();
    expect(getThumbUrls).not.toHaveBeenCalled();
  });

  it("з фото: показується мініатюра, кнопки 'Замінити' і 'Видалити'", async () => {
    setup({ rabbit: { photo_path: OLD } });
    renderPage();

    const img = await screen.findByAltText("Фото: Зоря");
    expect(img.getAttribute("src")).toBe(`https://example.test/${OLD}`);
    expect(screen.getByRole("button", { name: "Замінити фото" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Видалити фото" })).toBeInTheDocument();
  });

  it("додавання: завантаження, потім запис шляху в БД; видаляти нічого", async () => {
    const { order } = setup();
    vi.mocked(uploadRabbitPhoto).mockImplementation(async () => {
      order.push("upload");
      return NEW;
    });
    renderPage();
    await screen.findByText("Фото немає");

    const file = image();
    pickFile(file);

    expect(await screen.findByText("Фото збережено")).toBeInTheDocument();
    expect(uploadRabbitPhoto).toHaveBeenCalledWith("user-1", "rabbit-1", file);
    expect(order).toEqual(["upload", `db:${JSON.stringify({ photo_path: NEW })}`]);
    expect((await screen.findByAltText("Фото: Зоря")).getAttribute("src")).toBe(
      `https://example.test/${NEW}`,
    );
  });

  it("заміна: старий файл видаляється лише після запису нового шляху в БД", async () => {
    const { order } = setup({ rabbit: { photo_path: OLD } });
    vi.mocked(uploadRabbitPhoto).mockImplementation(async () => {
      order.push("upload");
      return NEW;
    });
    renderPage();
    await screen.findByAltText("Фото: Зоря");

    pickFile(image());

    await screen.findByText("Фото збережено");
    expect(order).toEqual([
      "upload",
      `db:${JSON.stringify({ photo_path: NEW })}`,
      `remove:${OLD}`,
    ]);
  });

  it("збій запису в БД: новий файл прибирається, старий лишається", async () => {
    const { order } = setup({
      rabbit: { photo_path: OLD },
      update: { error: { message: "denied" } },
    });
    vi.mocked(uploadRabbitPhoto).mockResolvedValue(NEW);
    renderPage();
    await screen.findByAltText("Фото: Зоря");

    pickFile(image());

    expect(
      await screen.findByText("Не вдалося зберегти фото. Спробуйте ще раз"),
    ).toBeInTheDocument();
    expect(removeRabbitPhoto).toHaveBeenCalledTimes(1);
    expect(removeRabbitPhoto).toHaveBeenCalledWith(NEW);
    expect(order).not.toContain(`remove:${OLD}`);
    expect((await screen.findByAltText("Фото: Зоря")).getAttribute("src")).toBe(
      `https://example.test/${OLD}`,
    );
  });

  it("збій завантаження: БД не чіпається, повідомлення про помилку", async () => {
    const { updates } = setup();
    vi.mocked(uploadRabbitPhoto).mockRejectedValue(new Error("boom"));
    renderPage();
    await screen.findByText("Фото немає");

    pickFile(image());

    expect(
      await screen.findByText("Не вдалося зберегти фото. Спробуйте ще раз"),
    ).toBeInTheDocument();
    expect(updates).toHaveLength(0);
    expect(removeRabbitPhoto).not.toHaveBeenCalled();
  });

  it("не зображення відхиляється без звернень до сховища", async () => {
    setup();
    renderPage();
    await screen.findByText("Фото немає");

    pickFile(new File(["x"], "a.pdf", { type: "application/pdf" }));

    expect(await screen.findByText("Оберіть файл із зображенням")).toBeInTheDocument();
    expect(uploadRabbitPhoto).not.toHaveBeenCalled();
  });

  it("видалення: підтвердження, спершу БД, потім файли", async () => {
    const { order } = setup({ rabbit: { photo_path: OLD } });
    renderPage();
    await screen.findByAltText("Фото: Зоря");

    fireEvent.click(screen.getByRole("button", { name: "Видалити фото" }));
    expect(removeRabbitPhoto).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Так, видалити" }));

    expect(await screen.findByText("Фото видалено")).toBeInTheDocument();
    expect(order).toEqual([`db:${JSON.stringify({ photo_path: null })}`, `remove:${OLD}`]);
    expect(screen.getByText("Фото немає")).toBeInTheDocument();
  });

  it("скасування підтвердження видалення нічого не змінює", async () => {
    const { updates } = setup({ rabbit: { photo_path: OLD } });
    renderPage();
    await screen.findByAltText("Фото: Зоря");

    fireEvent.click(screen.getByRole("button", { name: "Видалити фото" }));
    fireEvent.click(screen.getByRole("button", { name: "Ні" }));

    expect(screen.getByRole("button", { name: "Видалити фото" })).toBeInTheDocument();
    expect(updates).toHaveLength(0);
  });

  it("збій видалення в БД: файли не видаляються, фото лишається", async () => {
    setup({ rabbit: { photo_path: OLD }, update: { error: { message: "denied" } } });
    renderPage();
    await screen.findByAltText("Фото: Зоря");

    fireEvent.click(screen.getByRole("button", { name: "Видалити фото" }));
    fireEvent.click(screen.getByRole("button", { name: "Так, видалити" }));

    expect(
      await screen.findByText("Не вдалося видалити фото. Спробуйте ще раз"),
    ).toBeInTheDocument();
    expect(removeRabbitPhoto).not.toHaveBeenCalled();
    expect(screen.getByAltText("Фото: Зоря")).toBeInTheDocument();
  });

  it("кнопка 'Зберегти' не змінює photo_path", async () => {
    const { updates } = setup({ rabbit: { photo_path: OLD } });
    renderPage();
    await screen.findByAltText("Фото: Зоря");

    fireEvent.click(screen.getByRole("button", { name: "Зберегти" }));

    await waitFor(() => expect(updates).toHaveLength(1));
    expect(updates[0]).not.toHaveProperty("photo_path");
    expect(updates[0]).toMatchObject({ name: "Зоря", breed: "Шиншила" });
  });
});
