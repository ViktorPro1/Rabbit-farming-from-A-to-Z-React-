import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AccessGuard from "./AccessGuard";
import { supabase } from "../../lib/supabase";

vi.mock("../../lib/supabase", () => ({
  supabase: { rpc: vi.fn() },
}));

function renderGuard() {
  return render(
    <MemoryRouter>
      <AccessGuard>
        <div data-testid="cabinet" />
      </AccessGuard>
    </MemoryRouter>,
  );
}

describe("AccessGuard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Збої в цих тестах очікувані, не засмічуємо вивід
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("викликає RPC get_my_access_status", async () => {
    vi.mocked(supabase.rpc).mockResolvedValue({
      data: [{ is_expired: false }],
      error: null,
    } as never);

    renderGuard();

    await screen.findByTestId("cabinet");
    expect(supabase.rpc).toHaveBeenCalledWith("get_my_access_status");
  });

  it("показує кабінет, якщо строк доступу не вийшов", async () => {
    vi.mocked(supabase.rpc).mockResolvedValue({
      data: [{ is_expired: false }],
      error: null,
    } as never);

    renderGuard();

    expect(await screen.findByTestId("cabinet")).toBeInTheDocument();
  });

  it("блокує кабінет, якщо строк доступу вийшов", async () => {
    vi.mocked(supabase.rpc).mockResolvedValue({
      data: [{ is_expired: true }],
      error: null,
    } as never);

    renderGuard();

    expect(
      await screen.findByText(/Термін доступу закінчився/),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("cabinet")).not.toBeInTheDocument();
  });

  it("не відкриває кабінет, якщо RPC повернув помилку в полі error", async () => {
    vi.mocked(supabase.rpc).mockResolvedValue({
      data: null,
      error: { message: "Server error" },
    } as never);

    renderGuard();

    expect(
      await screen.findByText("Не вдалося перевірити термін доступу"),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("cabinet")).not.toBeInTheDocument();
  });

  it("не відкриває кабінет, якщо RPC кинув виняток", async () => {
    vi.mocked(supabase.rpc).mockRejectedValue(new Error("Network error"));

    renderGuard();

    expect(
      await screen.findByText("Не вдалося перевірити термін доступу"),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("cabinet")).not.toBeInTheDocument();
  });

  it('кнопка "Спробувати ще раз" повторює перевірку і відкриває кабінет', async () => {
    vi.mocked(supabase.rpc)
      .mockResolvedValueOnce({
        data: null,
        error: { message: "Server error" },
      } as never)
      .mockResolvedValueOnce({
        data: [{ is_expired: false }],
        error: null,
      } as never);

    renderGuard();

    fireEvent.click(
      await screen.findByRole("button", { name: "Спробувати ще раз" }),
    );

    expect(await screen.findByTestId("cabinet")).toBeInTheDocument();
    expect(supabase.rpc).toHaveBeenCalledTimes(2);
  });

  it("після повторної перевірки показує блокування, якщо строк вийшов", async () => {
    vi.mocked(supabase.rpc)
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce({
        data: [{ is_expired: true }],
        error: null,
      } as never);

    renderGuard();

    fireEvent.click(
      await screen.findByRole("button", { name: "Спробувати ще раз" }),
    );

    expect(
      await screen.findByText(/Термін доступу закінчився/),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("cabinet")).not.toBeInTheDocument();
  });
});
