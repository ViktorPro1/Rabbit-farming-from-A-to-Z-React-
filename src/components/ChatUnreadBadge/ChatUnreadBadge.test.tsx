import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ChatUnreadBadge from "./ChatUnreadBadge";

describe("ChatUnreadBadge", () => {
  it("при 0 нічого не показує", () => {
    const { container } = render(<ChatUnreadBadge count={0} />);
    expect(container.firstChild).toBeNull();
  });
  it("показує число", () => {
    render(<ChatUnreadBadge count={5} />);
    expect(screen.getByText("5")).toBeTruthy();
  });
  it("більше 99 показує 99+", () => {
    render(<ChatUnreadBadge count={120} />);
    expect(screen.getByText("99+")).toBeTruthy();
  });
  it("варіант dot має текст для читалок і без числа", () => {
    render(<ChatUnreadBadge count={7} variant="dot" />);
    expect(screen.getByText("Є нові повідомлення в чаті")).toBeTruthy();
    expect(screen.queryByText("7")).toBeNull();
  });
});
