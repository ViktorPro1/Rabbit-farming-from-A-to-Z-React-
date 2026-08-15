import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import WelcomePopup from "./WelcomePopup";
import { act } from "@testing-library/react";

const STORAGE_KEY = "welcomePopupSeen";

describe("WelcomePopup", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
  });

  it("не відображається одразу після монтування (є затримка появи)", () => {
    render(<WelcomePopup />);
    expect(screen.queryByText("Ласкаво просимо!")).not.toBeInTheDocument();
  });

  it("з'являється через 600мс, якщо ще не було показано раніше", () => {
    render(<WelcomePopup />);

    act(() => {
      vi.advanceTimersByTime(600);
    });

    expect(screen.getByText("Ласкаво просимо!")).toBeInTheDocument();
  });

  it("не з'являється, якщо вже було закрито раніше (localStorage)", () => {
    localStorage.setItem(STORAGE_KEY, "1");
    render(<WelcomePopup />);

    act(() => {
      vi.advanceTimersByTime(600);
    });

    expect(screen.queryByText("Ласкаво просимо!")).not.toBeInTheDocument();
  });

  it("додає клас fade через 6 секунд після появи, а потім зникає", () => {
    render(<WelcomePopup />);

    act(() => {
      vi.advanceTimersByTime(600);
    });

    const toast = screen
      .getByText("Ласкаво просимо!")
      .closest(".welcome-toast");

    act(() => {
      vi.advanceTimersByTime(6000);
    });

    expect(toast).toHaveClass("welcome-toast--fade");

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(screen.queryByText("Ласкаво просимо!")).not.toBeInTheDocument();
  });

  it("закривається одразу при кліку на кнопку закриття і записує це в localStorage", () => {
    render(<WelcomePopup />);

    act(() => {
      vi.advanceTimersByTime(600);
    });

    const closeButton = screen.getByLabelText("Закрити");
    fireEvent.click(closeButton);

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(screen.queryByText("Ласкаво просимо!")).not.toBeInTheDocument();
    expect(localStorage.getItem(STORAGE_KEY)).toBe("1");
  });

  it("призупиняє автозакриття при наведенні курсору", () => {
    render(<WelcomePopup />);

    act(() => {
      vi.advanceTimersByTime(600);
    });

    const toast = screen
      .getByText("Ласкаво просимо!")
      .closest(".welcome-toast")!;

    fireEvent.mouseEnter(toast);

    act(() => {
      vi.advanceTimersByTime(6000);
    });

    // не мало зникнути, бо таймер призупинено
    expect(screen.getByText("Ласкаво просимо!")).toBeInTheDocument();

    fireEvent.mouseLeave(toast);

    act(() => {
      vi.advanceTimersByTime(3000 + 400);
    });

    expect(screen.queryByText("Ласкаво просимо!")).not.toBeInTheDocument();
  });

  it("очищає таймери при розмонтуванні", () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");
    const { unmount } = render(<WelcomePopup />);

    act(() => {
      vi.advanceTimersByTime(600);
    });

    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
