import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import Header from "./Header";
import { supabase } from "../../lib/supabase";
import { logError } from "../../lib/logError";

vi.mock("../../lib/supabase", () => ({
  supabase: { from: vi.fn(), auth: { signOut: vi.fn() } },
}));
vi.mock("../../lib/logError", () => ({ logError: vi.fn() }));
vi.mock("../ThemeToggle/ThemeToggle", () => ({ default: () => null }));
vi.mock("../../features/font-size/FontSizeToggle", () => ({ default: () => null }));

const session = { user: { id: "user-1", email: "viktor@example.com" } } as Session;

type Result = { data?: unknown; error?: { message: string } | null };

function mockAdminQuery(result: Result) {
  const c: Record<string, unknown> = {};
  c.select = () => c;
  c.eq = () => c;
  c.maybeSingle = () => c;
  c.single = () => c;
  c.then = (resolve: (v: unknown) => unknown, reject: (e: unknown) => unknown) =>
    Promise.resolve({ data: null, error: null, ...result }).then(resolve, reject);
  vi.mocked(supabase.from).mockReturnValue(c as never);
}

function renderHeader() {
  return render(
    <MemoryRouter>
      <Header session={session} />
    </MemoryRouter>,
  );
}

function openUserMenu() {
  fireEvent.click(screen.getByRole("button", { name: "Меню користувача" }));
  return document.querySelector(".header-user-dropdown-logout") as HTMLElement;
}

describe("Header: вихід", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAdminQuery({ data: null });
  });

  it("успішний вихід: одна спроба, без помилок, меню закривається", async () => {
    vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null } as never);
    renderHeader();
    fireEvent.click(openUserMenu());

    await waitFor(() => expect(document.querySelector(".header-user-dropdown")).toBeNull());
    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
    expect(logError).not.toHaveBeenCalled();
  });

  it("помилка виходу (signOut повернув error): логується, виходимо локально", async () => {
    vi.mocked(supabase.auth.signOut)
      .mockResolvedValueOnce({ error: { message: "network" } } as never)
      .mockResolvedValueOnce({ error: null } as never);
    renderHeader();
    fireEvent.click(openUserMenu());

    await waitFor(() => expect(supabase.auth.signOut).toHaveBeenCalledTimes(2));
    expect(supabase.auth.signOut).toHaveBeenLastCalledWith({ scope: "local" });
    expect(logError).toHaveBeenCalledWith("Header.handleLogout", expect.anything());
    await waitFor(() => expect(document.querySelector(".header-user-dropdown")).toBeNull());
  });

  it("signOut кинув виняток: обробляється, меню закривається", async () => {
    vi.mocked(supabase.auth.signOut)
      .mockRejectedValueOnce(new Error("boom"))
      .mockResolvedValueOnce({ error: null } as never);
    renderHeader();
    fireEvent.click(openUserMenu());

    await waitFor(() => expect(document.querySelector(".header-user-dropdown")).toBeNull());
    expect(supabase.auth.signOut).toHaveBeenLastCalledWith({ scope: "local" });
  });

  it("збій і локального виходу не залишає необроблених помилок", async () => {
    vi.mocked(supabase.auth.signOut).mockRejectedValue(new Error("boom"));
    renderHeader();
    fireEvent.click(openUserMenu());

    await waitFor(() =>
      expect(logError).toHaveBeenCalledWith("Header.handleLogout.local", expect.anything()),
    );
    await waitFor(() => expect(document.querySelector(".header-user-dropdown")).toBeNull());
  });
});

describe("Header: права адміністратора", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("адміністратор бачить пункт 'Адмін'", async () => {
    mockAdminQuery({ data: { user_id: "user-1" } });
    renderHeader();
    fireEvent.click(screen.getByRole("button", { name: "Меню користувача" }));
    expect(await screen.findAllByText("Адмін")).not.toHaveLength(0);
  });

  it("звичайний користувач не бачить 'Адмін' і не викликає помилку", async () => {
    mockAdminQuery({ data: null });
    renderHeader();
    fireEvent.click(screen.getByRole("button", { name: "Меню користувача" }));
    await waitFor(() => expect(supabase.from).toHaveBeenCalled());
    expect(screen.queryByText("Адмін")).not.toBeInTheDocument();
    expect(logError).not.toHaveBeenCalled();
  });

  it("технічна помилка перевірки логується через logError", async () => {
    mockAdminQuery({ data: null, error: { message: "boom" } });
    renderHeader();
    await waitFor(() =>
      expect(logError).toHaveBeenCalledWith("Header.checkAdmin", expect.anything()),
    );
  });
});
