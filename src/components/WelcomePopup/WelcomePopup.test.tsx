import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import WelcomePopup from "./WelcomePopup";
import { act } from "@testing-library/react";

describe("WelcomePopup", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("відображається одразу після монтування", () => {
    render(<WelcomePopup />);
    expect(screen.getByText("Ласкаво просимо!")).toBeInTheDocument();
  });

  it("додає клас fade через 3 секунди, а потім зникає", () => {
    render(<WelcomePopup />);
    const overlay = screen
      .getByText("Ласкаво просимо!")
      .closest(".welcome-overlay");

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(overlay).toHaveClass("welcome-overlay--fade");

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(screen.queryByText("Ласкаво просимо!")).not.toBeInTheDocument();
  });

  it("закривається одразу при кліку на кнопку закриття", () => {
    render(<WelcomePopup />);
    const closeButton = screen.getByLabelText("Закрити");

    fireEvent.click(closeButton);

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(screen.queryByText("Ласкаво просимо!")).not.toBeInTheDocument();
  });

  it("очищає таймери при розмонтуванні", () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");
    const { unmount } = render(<WelcomePopup />);
    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
