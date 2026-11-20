import { describe, it, expect } from "vitest";
import { buildReactionMap, myReaction, toggleReactionLocally } from "./reactions";

const base = buildReactionMap([
  { message_id: "m1", kind: "up", cnt: 2, mine: false },
  { message_id: "m1", kind: "handshake", cnt: 1, mine: true },
  { message_id: "m2", kind: "down", cnt: 4, mine: false },
  { message_id: "m2", kind: "love", cnt: 9, mine: false }, // невідомий вид
]);

describe("buildReactionMap / myReaction", () => {
  it("групує за повідомленням і видом, невідомі види ігнорує", () => {
    expect(base.m1?.up).toEqual({ count: 2, mine: false });
    expect(base.m2?.down).toEqual({ count: 4, mine: false });
    expect(Object.keys(base.m2 ?? {})).toEqual(["down"]);
  });
  it("знаходить мою реакцію", () => {
    expect(myReaction(base, "m1")).toBe("handshake");
    expect(myReaction(base, "m2")).toBeNull();
    expect(myReaction(base, "нема")).toBeNull();
  });
});

describe("toggleReactionLocally", () => {
  it("ставить реакцію, якщо моєї не було", () => {
    const next = toggleReactionLocally(base, "m2", "up");
    expect(next.m2?.up).toEqual({ count: 1, mine: true });
    expect(next.m2?.down).toEqual({ count: 4, mine: false });
  });
  it("повторний клік по тій самій знімає її", () => {
    const next = toggleReactionLocally(base, "m1", "handshake");
    expect(next.m1?.handshake).toBeUndefined();
    expect(next.m1?.up).toEqual({ count: 2, mine: false });
  });
  it("інша реакція замінює мою: стара мінус 1, нова плюс 1", () => {
    const next = toggleReactionLocally(base, "m1", "up");
    expect(next.m1?.handshake).toBeUndefined();
    expect(next.m1?.up).toEqual({ count: 3, mine: true });
  });
  it("не змінює вихідну мапу", () => {
    const snapshot = JSON.stringify(base);
    toggleReactionLocally(base, "m1", "down");
    expect(JSON.stringify(base)).toBe(snapshot);
  });
  it("працює для повідомлення без жодних реакцій", () => {
    const next = toggleReactionLocally({}, "new", "down");
    expect(next.new?.down).toEqual({ count: 1, mine: true });
  });
});
