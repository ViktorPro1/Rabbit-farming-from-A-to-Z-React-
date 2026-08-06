import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ErrorBoundary from "./ErrorBoundary";

function Bomb({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error("Тестова помилка");
  }
  return <div data-testid="safe-content">Все гаразд</div>;
}

describe("ErrorBoundary", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("рендерить дочірні елементи, коли помилки немає", () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={false} />
      </ErrorBoundary>,
    );

    expect(screen.getByTestId("safe-content")).toBeInTheDocument();
  });

  it("показує фолбек з дефолтним текстом при помилці", () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Щось пішло не так.")).toBeInTheDocument();
    expect(screen.queryByTestId("safe-content")).not.toBeInTheDocument();
  });

  it("показує кастомний fallbackTitle, якщо переданий", () => {
    render(
      <ErrorBoundary fallbackTitle="Кастомна помилка">
        <Bomb shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Кастомна помилка")).toBeInTheDocument();
  });

  it("логує помилку через logError з дефолтним контекстом 'ErrorBoundary'", () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[ErrorBoundary]",
      expect.any(Error),
    );
  });

  it("використовує boundaryName як контекст логування, якщо переданий", () => {
    render(
      <ErrorBoundary boundaryName="TestSection">
        <Bomb shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[TestSection]",
      expect.any(Error),
    );
  });

  it("викликає перезавантаження сторінки при кліку на кнопку", () => {
    const reloadSpy = vi.fn();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...window.location, reload: reloadSpy },
    });

    render(
      <ErrorBoundary>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>,
    );

    fireEvent.click(screen.getByText("Перезавантажити сторінку"));

    expect(reloadSpy).toHaveBeenCalledTimes(1);
  });
});
