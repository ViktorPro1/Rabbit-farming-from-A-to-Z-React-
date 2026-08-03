import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import * as CookieConsent from "vanilla-cookieconsent";
import CookieConsentBanner from "./CookieConsent";

vi.mock("vanilla-cookieconsent", () => ({
  run: vi.fn(),
}));

interface ConsentEvent {
  cookie: { categories: string[] };
}

function getRunConfig() {
  const calls = vi.mocked(CookieConsent.run).mock.calls;
  return calls[0][0] as {
    categories: Record<string, { enabled: boolean }>;
    onConsent?: (event: ConsentEvent) => void;
    onChange?: (event: ConsentEvent) => void;
  };
}

describe("CookieConsentBanner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.getElementById("ga-script")?.remove();
  });

  afterEach(() => {
    document.getElementById("ga-script")?.remove();
  });

  it("викликає CookieConsent.run при монтуванні з правильними категоріями", () => {
    render(<CookieConsentBanner />);

    expect(CookieConsent.run).toHaveBeenCalledTimes(1);
    const config = getRunConfig();
    expect(config.categories.necessary.enabled).toBe(true);
    expect(config.categories.analytics.enabled).toBe(false);
  });

  it("завантажує Google Analytics, якщо onConsent містить категорію analytics", () => {
    render(<CookieConsentBanner />);
    const config = getRunConfig();

    config.onConsent?.({ cookie: { categories: ["analytics"] } });

    const script = document.getElementById("ga-script");
    expect(script).not.toBeNull();
    expect(script?.getAttribute("src")).toContain("G-RL8GL7SHMR");
  });

  it("не завантажує Google Analytics, якщо категорії analytics немає", () => {
    render(<CookieConsentBanner />);
    const config = getRunConfig();

    config.onConsent?.({ cookie: { categories: ["necessary"] } });

    expect(document.getElementById("ga-script")).toBeNull();
  });

  it("не додає скрипт повторно, якщо він вже завантажений", () => {
    render(<CookieConsentBanner />);
    const config = getRunConfig();

    config.onConsent?.({ cookie: { categories: ["analytics"] } });
    config.onChange?.({ cookie: { categories: ["analytics"] } });

    expect(document.querySelectorAll("#ga-script").length).toBe(1);
  });
});
