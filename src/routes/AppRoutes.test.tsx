import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import AppRoutes from "./AppRoutes";

vi.mock("../seo/usePageMeta", () => ({ usePageMeta: vi.fn() }));

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

vi.mock("../pages/Calculator/Calculator", () => ({
  default: ({ session }: { session: Session }) => (
    <div data-testid="calculator-page">{session.user.id}</div>
  ),
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

  it('/calculator без сесії показує Auth з returnTo="/calculator"', async () => {
    renderAt("/calculator", null);
    expect(await screen.findByTestId("auth-page")).toHaveTextContent(
      "/calculator",
    );
  });

  it("/calculator з сесією показує Calculator", async () => {
    renderAt("/calculator", mockSession);
    expect(await screen.findByTestId("calculator-page")).toHaveTextContent(
      "user-1",
    );
  });

  it("/registry без сесії показує Auth", async () => {
    renderAt("/registry", null);
    expect(await screen.findByTestId("auth-page")).toBeInTheDocument();
  });

  it("/registry з сесією показує RabbitRegistry", async () => {
    renderAt("/registry", mockSession);
    expect(await screen.findByTestId("registry-page")).toHaveTextContent(
      "user-1",
    );
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
