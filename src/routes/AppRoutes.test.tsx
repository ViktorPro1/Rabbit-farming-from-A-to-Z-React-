import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import AppRoutes from "./AppRoutes";
import { supabase } from "../lib/supabase";

vi.mock("../seo/usePageMeta", () => ({ usePageMeta: vi.fn() }));

// Додано: AccessGuard (обгортка кабінетних маршрутів) викликає supabase.rpc.
// Раніше тест покладався на те, що при збої перевірки кабінет відкривається;
// тепер збій блокує кабінет, тому явно мокаємо успішну відповідь.
vi.mock("../lib/supabase", () => ({
  supabase: {
    rpc: vi.fn().mockResolvedValue({
      data: [{ is_expired: false }],
      error: null,
    }),
  },
}));

vi.mock("../pages/Auth/Auth", () => ({
  default: ({ returnTo }: { returnTo?: string }) => (
    <div data-testid="auth-page">{returnTo ?? "no-return"}</div>
  ),
}));

vi.mock("../pages/Home", () => ({
  default: () => <div data-testid="home-page" />,
}));

vi.mock("../pages/Admin/Admin", () => ({
  default: ({ session }: { session: Session }) => (
    <div data-testid="admin-page">{session.user.id}</div>
  ),
}));

vi.mock("../pages/GrainCalculator/GrainCalculator", () => ({
  default: ({ session }: { session: Session }) => (
    <div data-testid="grain-calculator-page">{session.user.id}</div>
  ),
}));

vi.mock("../pages/DatesCalculator/DatesCalculator", () => ({
  default: () => <div data-testid="dates-calculator-page" />,
}));

vi.mock("../pages/RabbitRegistry/RabbitRegistry", () => ({
  default: ({ session }: { session: Session }) => (
    <div data-testid="registry-page">{session.user.id}</div>
  ),
}));

vi.mock("../pages/NotFound/NotFound", () => ({
  default: () => <div data-testid="not-found-page" />,
}));

const mockSession = { user: { id: "user-1" } } as Session;

function renderAt(path: string, session: Session | null) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes session={session} />
    </MemoryRouter>,
  );
}

describe("AppRoutes — auth-гейтинг захищених маршрутів", () => {
  it("/admin без сесії показує Auth", async () => {
    renderAt("/admin", null);
    expect(await screen.findByTestId("auth-page")).toBeInTheDocument();
  });

  it("/admin з сесією показує Admin", async () => {
    renderAt("/admin", mockSession);
    expect(await screen.findByTestId("admin-page")).toHaveTextContent("user-1");
  });

  it("/dates-calculator відкритий для гостей: без сесії показує калькулятор дат", async () => {
    renderAt("/dates-calculator", null);
    expect(
      await screen.findByTestId("dates-calculator-page"),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("auth-page")).not.toBeInTheDocument();
  });

  it("/grain-calculator без сесії показує Auth", async () => {
    renderAt("/grain-calculator", null);
    expect(await screen.findByTestId("auth-page")).toBeInTheDocument();
    expect(
      screen.queryByTestId("grain-calculator-page"),
    ).not.toBeInTheDocument();
  });

  it("/grain-calculator з сесією показує калькулятор корму", async () => {
    renderAt("/grain-calculator", mockSession);
    expect(
      await screen.findByTestId("grain-calculator-page", {}, { timeout: 3000 }),
    ).toHaveTextContent("user-1");
  });

  it("/grain-calculator з простроченим доступом показує екран блокування", async () => {
    vi.mocked(supabase.rpc).mockResolvedValueOnce({
      data: [{ is_expired: true }],
      error: null,
    } as never);

    renderAt("/grain-calculator", mockSession);

    expect(
      await screen.findByText(
        /Термін доступу закінчився/,
        {},
        { timeout: 3000 },
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId("grain-calculator-page"),
    ).not.toBeInTheDocument();
  });

  it("/registry без сесії показує Auth", async () => {
    renderAt("/registry", null);
    expect(await screen.findByTestId("auth-page")).toBeInTheDocument();
  });

  it("/registry з сесією показує RabbitRegistry", async () => {
    renderAt("/registry", mockSession);
    expect(
      await screen.findByTestId("registry-page", {}, { timeout: 3000 }),
    ).toHaveTextContent("user-1");
  });

  it("/registry з простроченим доступом показує екран блокування", async () => {
    // Додано: перевірка, що кабінет не відкривається при простроченому доступі
    vi.mocked(supabase.rpc).mockResolvedValueOnce({
      data: [{ is_expired: true }],
      error: null,
    } as never);

    renderAt("/registry", mockSession);

    expect(
      await screen.findByText(
        /Термін доступу закінчився/,
        {},
        { timeout: 3000 },
      ),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("registry-page")).not.toBeInTheDocument();
  });

  it("/registry при збої перевірки доступу не відкриває кабінет", async () => {
    // Додано: збій перевірки більше не пропускає користувача (fail-closed)
    vi.mocked(supabase.rpc).mockResolvedValueOnce({
      data: null,
      error: { message: "Server error" },
    } as never);

    renderAt("/registry", mockSession);

    expect(
      await screen.findByText(
        "Не вдалося перевірити термін доступу",
        {},
        { timeout: 3000 },
      ),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("registry-page")).not.toBeInTheDocument();
  });

  it('"/" рендерить Home незалежно від сесії', async () => {
    renderAt("/", null);
    expect(await screen.findByTestId("home-page")).toBeInTheDocument();
  });

  it("невідомий шлях показує сторінку 404", async () => {
    renderAt("/якийсь-неіснуючий-шлях", null);
    expect(await screen.findByTestId("not-found-page")).toBeInTheDocument();
  });
});
