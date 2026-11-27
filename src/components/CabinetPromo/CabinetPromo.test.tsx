import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import CabinetPromo from "./CabinetPromo";

const DELAY = 60000;
const TITLE = "План підбору вже є в обліку!";

function renderAt(path: string, session: Session | null = null) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <CabinetPromo session={session} />
    </MemoryRouter>,
  );
}

describe("CabinetPromo", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    sessionStorage.clear();
  });

  it("не показується одразу, є затримка 60 с", () => {
    renderAt("/breeding");
    expect(screen.queryByText(TITLE)).not.toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(DELAY - 1);
    });
    expect(screen.queryByText(TITLE)).not.toBeInTheDocument();
  });

  it("показується через 60 с на темі зі словника", () => {
    renderAt("/breeding");
    act(() => {
      vi.advanceTimersByTime(DELAY);
    });
    expect(screen.getByText(TITLE)).toBeInTheDocument();
    expect(screen.getByText("Доступно за підпискою")).toBeInTheDocument();
  });

  it("не показується на темі, якої немає у словнику", () => {
    renderAt("/diseases");
    act(() => {
      vi.advanceTimersByTime(DELAY);
    });
    expect(screen.queryByText(TITLE)).not.toBeInTheDocument();
    expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
  });

  it("не показується залогіненому користувачу", () => {
    renderAt("/breeding", { user: { id: "u1" } } as unknown as Session);
    act(() => {
      vi.advanceTimersByTime(DELAY);
    });
    expect(screen.queryByText(TITLE)).not.toBeInTheDocument();
  });

  it("не показується вдруге в тому ж візиті", () => {
    sessionStorage.setItem("cabinetPromoShown", "1");
    renderAt("/breeding");
    act(() => {
      vi.advanceTimersByTime(DELAY);
    });
    expect(screen.queryByText(TITLE)).not.toBeInTheDocument();
  });

  it("закривається хрестиком", () => {
    renderAt("/breeding");
    act(() => {
      vi.advanceTimersByTime(DELAY);
    });
    fireEvent.click(screen.getByRole("button", { name: "Закрити" }));
    expect(screen.queryByText(TITLE)).not.toBeInTheDocument();
  });

  it("закривається клавішею Escape", () => {
    renderAt("/breeding");
    act(() => {
      vi.advanceTimersByTime(DELAY);
    });
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByText(TITLE)).not.toBeInTheDocument();
  });

  it("кнопка веде на сторінку підписки", () => {
    renderAt("/breeding");
    act(() => {
      vi.advanceTimersByTime(DELAY);
    });
    expect(screen.getByRole("link", { name: /Докладніше/ })).toHaveAttribute(
      "href",
      "/subscription",
    );
  });
});
