import { describe, it, expect, vi, afterEach } from "vitest";
import { registerWebMCPTools, type SiteCard } from "./webmcp";

type Tool = {
  name: string;
  execute: (a: Record<string, unknown>) => Promise<{ content: { text: string }[] }>;
};

const CARDS: SiteCard[] = [
  { title: "Годування кролів", path: "/feeding", section: "Догляд", desc: "Раціон і норми", keywords: ["корм", "раціон"] },
  { title: "Вакцинація", path: "/vaccination", section: "Здоровя", desc: "Графік щеплень", keywords: "щеплення" },
];

function stubModelContext() {
  const tools = new Map<string, Tool>();
  const registerTool = vi.fn((t: Tool) => {
    if (tools.has(t.name)) throw new Error("duplicate");
    tools.set(t.name, t);
  });
  const unregisterTool = vi.fn((n: string) => void tools.delete(n));
  vi.stubGlobal("navigator", { modelContext: { registerTool, unregisterTool } });
  return { tools, registerTool, unregisterTool };
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("registerWebMCPTools", () => {
  it("нічого не робить, якщо navigator.modelContext відсутній", () => {
    vi.stubGlobal("navigator", {});
    const cleanup = registerWebMCPTools({ navigate: vi.fn(), loadCards: async () => CARDS });
    expect(() => cleanup()).not.toThrow();
  });

  it("реєструє два інструменти", () => {
    const { tools } = stubModelContext();
    registerWebMCPTools({ navigate: vi.fn(), loadCards: async () => CARDS });
    expect([...tools.keys()].sort()).toEqual(["open_site_page", "search_rabbit_articles"]);
  });

  it("не падає при повторній реєстрації (дублікат імені)", () => {
    const { registerTool } = stubModelContext();
    vi.spyOn(console, "error").mockImplementation(() => { });
    const opts = { navigate: vi.fn(), loadCards: async () => CARDS };
    registerWebMCPTools(opts);
    expect(() => registerWebMCPTools(opts)).not.toThrow();
    expect(registerTool).toHaveBeenCalledTimes(4);
  });

  it("cleanup знімає реєстрацію обох інструментів", () => {
    const { unregisterTool } = stubModelContext();
    registerWebMCPTools({ navigate: vi.fn(), loadCards: async () => CARDS })();
    expect(unregisterTool).toHaveBeenCalledTimes(2);
  });

  it("search: знаходить за назвою, описом і ключовими словами", async () => {
    const { tools } = stubModelContext();
    registerWebMCPTools({ navigate: vi.fn(), loadCards: async () => CARDS });
    const search = tools.get("search_rabbit_articles")!;
    expect((await search.execute({ query: "раціон" })).content[0].text).toContain("/feeding");
    expect((await search.execute({ query: "щеплення" })).content[0].text).toContain("/vaccination");
    expect((await search.execute({ query: "xyz" })).content[0].text).toBe("Нічого не знайдено.");
    expect((await search.execute({ query: "  " })).content[0].text).toBe("Порожній запит.");
  });

  it("open_site_page: відкриває лише внутрішні шляхи з каталогу", async () => {
    const { tools } = stubModelContext();
    const navigate = vi.fn();
    registerWebMCPTools({ navigate, loadCards: async () => CARDS });
    const open = tools.get("open_site_page")!;

    await open.execute({ path: "/feeding" });
    expect(navigate).toHaveBeenCalledWith("/feeding");

    navigate.mockClear();
    for (const bad of ["//evil.com", "https://evil.com", "javascript:alert(1)", "/registry", ""]) {
      await open.execute({ path: bad });
    }
    expect(navigate).not.toHaveBeenCalled();
  });

  it("віддає перевагу document.modelContext (Chrome 150+) над navigator.modelContext", () => {
    const docReg = vi.fn();
    const navReg = vi.fn();
    vi.stubGlobal("document", { modelContext: { registerTool: docReg } });
    vi.stubGlobal("navigator", { modelContext: { registerTool: navReg } });
    registerWebMCPTools({ navigate: vi.fn(), loadCards: async () => CARDS });
    expect(docReg).toHaveBeenCalledTimes(2);
    expect(navReg).not.toHaveBeenCalled();
  });

  it("передає signal у registerTool і скасовує його у cleanup", () => {
    const registerTool = vi.fn();
    vi.stubGlobal("document", { modelContext: { registerTool } });
    const cleanup = registerWebMCPTools({ navigate: vi.fn(), loadCards: async () => CARDS });
    const signal = registerTool.mock.calls[0][1].signal as AbortSignal;
    expect(signal.aborted).toBe(false);
    cleanup();
    expect(signal.aborted).toBe(true);
  });

  it("не створює unhandled rejection, якщо registerTool повертає відхилений Promise", async () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => { });
    const registerTool = vi.fn(() => Promise.reject(new Error("duplicate")));
    vi.stubGlobal("document", { modelContext: { registerTool } });
    registerWebMCPTools({ navigate: vi.fn(), loadCards: async () => CARDS });
    await Promise.resolve();
    await Promise.resolve();
    expect(err).toHaveBeenCalledTimes(2);
  });

  it("не логує AbortError, спричинений власним cleanup (StrictMode)", async () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => { });
    const registerTool = vi.fn(
      (_tool: unknown, opts: { signal: AbortSignal }) =>
        new Promise((_, reject) => {
          opts.signal.addEventListener("abort", () =>
            reject(new DOMException("signal is aborted without reason", "AbortError")),
          );
        }),
    );
    vi.stubGlobal("document", { modelContext: { registerTool } });
    const cleanup = registerWebMCPTools({ navigate: vi.fn(), loadCards: async () => CARDS });
    cleanup();
    await Promise.resolve();
    await Promise.resolve();
    expect(err).not.toHaveBeenCalled();
  });
});