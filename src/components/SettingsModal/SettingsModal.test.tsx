import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import type { Session } from "@supabase/supabase-js";
import SettingsModal from "./SettingsModal";
import { supabase } from "../../lib/supabase";
import {
  getFullUrl,
  uploadAvatar,
  removeAvatar,
} from "../../utils/photoStorage";

// Крок 3: тести перенесено з RabbitRegistry.test.tsx без зміни логіки —
// вікно налаштувань тепер окремий спільний компонент.
vi.mock("../../lib/supabase", () => ({
  supabase: { auth: { updateUser: vi.fn() } },
}));

vi.mock("../../utils/photoStorage", () => ({
  getFullUrl: vi.fn(),
  uploadAvatar: vi.fn(),
  removeAvatar: vi.fn(),
}));

vi.mock("../../utils/pushNotifications", () => ({
  subscribeToPush: vi.fn(),
  unsubscribeFromPush: vi.fn(),
  getPushSubscriptionStatus: vi.fn().mockResolvedValue(false),
}));

describe("SettingsModal: фото кабінету", () => {
  const OLD_AVATAR = "user-1/avatar-1.webp";
  const NEW_AVATAR = "user-1/avatar-2.webp";

  function sessionWith(meta: Record<string, unknown>) {
    return {
      user: { id: "user-1", email: "viktor@example.com", user_metadata: meta },
    } as unknown as Session;
  }

  function renderWith(s: Session) {
    return render(<SettingsModal open session={s} onClose={() => {}} />);
  }

  // Вікно відкрите одразу (open) — чекаємо лише, поки воно з'явиться
  async function openSettings() {
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
