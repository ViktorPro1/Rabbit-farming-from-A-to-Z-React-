import type { ReactNode } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import { supabase } from "./lib/supabase";

vi.mock("./lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(),
  },
}));

vi.mock("./hooks/usePublicPresence", () => ({ usePublicPresence: vi.fn() }));
vi.mock("./hooks/useTVNavigation", () => ({ useTVNavigation: vi.fn() }));

vi.mock("./components/CopyProtection/CopyProtection", () => ({
  default: () => null,
}));
vi.mock("./components/Assistant/Assistant", () => ({ default: () => null }));
vi.mock("./components/WelcomePopup/WelcomePopup", () => ({
  default: () => null,
}));
vi.mock("./components/Header/Header", () => ({
  default: () => <div data-testid="header" />,
}));
vi.mock("./components/Footer/Footer", () => ({ default: () => null }));
vi.mock("./components/UpdatePrompt/UpdatePrompt", () => ({
  UpdatePrompt: () => null,
}));
vi.mock("./components/Breadcrumbs/Breadcrumbs", () => ({
  default: () => null,
}));
vi.mock("./routes/AppRoutes", () => ({
  default: () => <div data-testid="app-routes" />,
}));
vi.mock("./components/AssistantPromo/AssistantPromo", () => ({
  default: () => null,
}));
vi.mock("./components/CookieConsent/CookieConsent", () => ({
  default: () => null,
}));
vi.mock("./components/ScrollToTop/ScrollToTop", () => ({
  default: () => null,
}));
vi.mock("./components/ErrorBoundary/ErrorBoundary", () => ({
  default: ({ children }: { children: ReactNode }) => <>{children}</>,
}));
vi.mock("./components/PrintButton/PrintButton", () => ({
  default: () => null,
}));
vi.mock("./components/DonationPopup/DonationPopup", () => ({
  default: () => null,
}));

function mockNoSession() {
  vi.mocked(supabase.auth.getSession).mockResolvedValue({
    data: { session: null },
  } as never);
  vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
    data: { subscription: { unsubscribe: vi.fn() } },
  } as never);
}

function setOnline(value: boolean) {
  Object.defineProperty(navigator, "onLine", { value, configurable: true });
}

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setOnline(true);
    window.history.pushState({}, "", "/");
  });

  it("показує екран завантаження одразу після монтування", () => {
    vi.mocked(supabase.auth.getSession).mockReturnValue(
      new Promise(() => {}) as never,
    );
    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    } as never);

    render(<App />);

    expect(screen.getByText("Завантаження...")).toBeInTheDocument();
  });

  it('показує екран "Немає інтернету", коли додаток офлайн', async () => {
    setOnline(false);
    mockNoSession();

    render(<App />);

    expect(await screen.findByText("Немає інтернету")).toBeInTheDocument();
  });

  it("рендерить основний застосунок, коли сесії немає", async () => {
    mockNoSession();

    render(<App />);

    expect(await screen.findByTestId("app-routes")).toBeInTheDocument();
    expect(screen.getByTestId("header")).toBeInTheDocument();
  });

  it('показує екран "Підписка закінчилась", якщо сесія є, але профілю немає', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: { user: { id: "user-1" } } },
    } as never);
    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    } as never);
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null }),
    } as never);

    render(<App />);

    expect(await screen.findByText("Підписка закінчилась")).toBeInTheDocument();
  });

  it("очищує невидимі юнікод-символи зі шляху при монтуванні", async () => {
    const originalLocation = window.location;
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...originalLocation, pathname: "/\u200B", search: "", hash: "" },
    });
    const replaceStateSpy = vi.spyOn(window.history, "replaceState");
    mockNoSession();

    render(<App />);

    await waitFor(() => {
      expect(replaceStateSpy).toHaveBeenCalledWith({}, "", "/");
    });

    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
  });

  it("не показує SubscriptionExpired при технічній помилці запиту профілю", async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: { user: { id: "user-1" } } },
    } as never);
    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    } as never);
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockRejectedValue(new Error("Network error")),
    } as never);

    render(<App />);

    expect(await screen.findByTestId("app-routes")).toBeInTheDocument();
    expect(screen.queryByText("Підписка закінчилась")).not.toBeInTheDocument();
  });
});
