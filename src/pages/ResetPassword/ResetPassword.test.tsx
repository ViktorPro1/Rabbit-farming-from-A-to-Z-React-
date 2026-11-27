import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ResetPassword from "./ResetPassword";
import { supabase } from "../../lib/supabase";

vi.mock("../../lib/supabase", () => ({
  supabase: { auth: { getSession: vi.fn(), updateUser: vi.fn() } },
}));

function renderPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    </HelmetProvider>,
  );
}

function mockSession(has: boolean) {
  vi.mocked(supabase.auth.getSession).mockResolvedValue({
    data: { session: has ? ({} as never) : null },
    error: null,
  } as never);
}

describe("ResetPassword", () => {
  beforeEach(() => vi.clearAllMocks());

  it("без сесії показує повідомлення про недійсне посилання", async () => {
    mockSession(false);
    renderPage();
    expect(await screen.findByText(/недійсне або застаріло/)).toBeTruthy();
  });

  it("не дозволяє короткий пароль", async () => {
    mockSession(true);
    renderPage();
    fireEvent.change(await screen.findByPlaceholderText("Новий пароль"), {
      target: { value: "123" },
    });
    fireEvent.click(screen.getByText("Зберегти пароль"));
    expect(await screen.findByText(/щонайменше 6 символів/)).toBeTruthy();
    expect(supabase.auth.updateUser).not.toHaveBeenCalled();
  });

  it("не дозволяє різні паролі", async () => {
    mockSession(true);
    renderPage();
    fireEvent.change(await screen.findByPlaceholderText("Новий пароль"), {
      target: { value: "secret123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Повторіть новий пароль"), {
      target: { value: "secret124" },
    });
    fireEvent.click(screen.getByText("Зберегти пароль"));
    expect(await screen.findByText("Паролі не збігаються")).toBeTruthy();
    expect(supabase.auth.updateUser).not.toHaveBeenCalled();
  });

  it("зберігає новий пароль і показує підтвердження", async () => {
    mockSession(true);
    vi.mocked(supabase.auth.updateUser).mockResolvedValue({
      data: {},
      error: null,
    } as never);
    renderPage();
    fireEvent.change(await screen.findByPlaceholderText("Новий пароль"), {
      target: { value: "secret123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Повторіть новий пароль"), {
      target: { value: "secret123" },
    });
    fireEvent.click(screen.getByText("Зберегти пароль"));
    await waitFor(() =>
      expect(supabase.auth.updateUser).toHaveBeenCalledWith({
        password: "secret123",
      }),
    );
    expect(await screen.findByText(/Пароль змінено/)).toBeTruthy();
  });
});
