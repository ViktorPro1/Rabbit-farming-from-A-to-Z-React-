import { describe, it, expect } from "vitest";
import { flattenCards } from "./webmcpCards";

describe("flattenCards", () => {
  it("розгортає групи в плоский список і прибирає приватні маршрути", () => {
    const groups = [
      {
        title: "Догляд",
        cards: [
          { title: "Годування", path: "/feeding", desc: "d", keywords: ["a", "b"] },
          { title: "Облік", path: "/registry" },
          { title: "Окрол", path: "/matings/edit" },
        ],
      },
    ];
    const r = flattenCards(groups);
    expect(r).toHaveLength(1);
    expect(r[0]).toMatchObject({ title: "Годування", path: "/feeding", section: "Догляд", keywords: ["a", "b"] });
  });

  it("не падає на невідомій структурі", () => {
    expect(flattenCards(undefined)).toEqual([]);
    expect(flattenCards([null, 1, { title: "x" }, { cards: [{ title: "t" }] }])).toEqual([]);
  });
});
