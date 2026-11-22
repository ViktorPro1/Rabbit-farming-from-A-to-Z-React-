/**
 * Реєстрація WebMCP-інструментів для публічної частини сайту.
 * Це прогресивне покращення: якщо браузер не підтримує WebMCP, функція нічого
 * не робить і сайт працює як раніше.
 *
 * API: Chrome 150+ використовує document.modelContext, а navigator.modelContext
 * позначено застарілим. Тому спершу шукаємо document.modelContext, а navigator
 * лишається запасним варіантом для Chrome 149 та поліфілів.
 *
 * Свідомо НЕ реєструються інструменти особистого кабінету (платна частина,
 * дані користувачів) та будь-які дії запису.
 *
 * ПІДКЛЮЧЕННЯ: через компонент src/components/WebMCPRegistrar/WebMCPRegistrar.tsx
 * (рендериться в App.tsx всередині BrowserRouter); каталог сторінок для пошуку
 * дає src/utils/webmcpCards.ts.
 */

export interface SiteCard {
  title: string;
  path: string;
  desc?: string;
  keywords?: string[] | string;
  section?: string;
}

interface Options {
  navigate: (path: string) => void;
  loadCards: () => Promise<SiteCard[]>;
}

interface ToolResult {
  // Текстовий варіант для клієнтів без підтримки structuredContent
  content: { type: "text"; text: string }[];
  // Структурований результат; відповідає outputSchema інструмента
  structuredContent?: Record<string, unknown>;
  isError?: boolean;
}

interface ToolDef {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;
  execute: (args: Record<string, unknown>) => Promise<ToolResult>;
}

interface ModelContextLike {
  // У новому API registerTool повертає Promise і приймає { signal } для зняття
  // реєстрації; у старому (Chrome 149) повертає не-Promise і має unregisterTool.
  registerTool: (tool: ToolDef, options?: { signal?: AbortSignal }) => unknown;
  unregisterTool?: (name: string) => void;
}

function getModelContext(): ModelContextLike | undefined {
  const fromDocument =
    typeof document !== "undefined"
      ? (document as unknown as { modelContext?: ModelContextLike }).modelContext
      : undefined;
  if (fromDocument && typeof fromDocument.registerTool === "function") {
    return fromDocument;
  }
  const fromNavigator =
    typeof navigator !== "undefined"
      ? (navigator as unknown as { modelContext?: ModelContextLike }).modelContext
      : undefined;
  if (fromNavigator && typeof fromNavigator.registerTool === "function") {
    return fromNavigator;
  }
  return undefined;
}

const text = (t: string, structuredContent?: Record<string, unknown>, isError?: boolean): ToolResult => ({
  content: [{ type: "text", text: t }],
  ...(structuredContent ? { structuredContent } : {}),
  ...(isError ? { isError: true } : {}),
});

const normalize = (s: string) => s.toLowerCase().trim();

// Схеми результату описують structuredContent (так задумано в MCP).
const searchOutputSchema = {
  type: "object",
  properties: {
    results: {
      type: "array",
      description: "Знайдені сторінки, від найрелевантнішої (до 10)",
      items: {
        type: "object",
        properties: {
          title: { type: "string", description: "Назва статті" },
          path: { type: "string", description: "Внутрішній шлях для open_site_page" },
          section: { type: "string", description: "Розділ сайту" },
          desc: { type: "string", description: "Короткий опис" },
        },
        required: ["title", "path"],
      },
    },
    message: {
      type: "string",
      description: "Пояснення, якщо результатів немає (порожній запит або нічого не знайдено)",
    },
  },
  required: ["results"],
};

const openOutputSchema = {
  type: "object",
  properties: {
    opened: { type: "boolean", description: "Чи виконано перехід" },
    path: { type: "string", description: "Відкритий шлях (лише якщо opened = true)" },
    message: { type: "string", description: "Підтвердження переходу або причина відмови" },
  },
  required: ["opened", "message"],
};

export function registerWebMCPTools({ navigate, loadCards }: Options): () => void {
  // Ні document.modelContext, ні navigator.modelContext немає в lib.dom,
  // тому доступ через приведення типу (див. getModelContext).
  const mc = getModelContext();
  if (!mc) return () => { };

  const controller = new AbortController();
  const names: string[] = [];
  const add = (tool: ToolDef) => {
    const onError = (e: unknown) => {
      // AbortError після нашого ж cleanup (abort) очікуваний: у dev-режимі
      // React StrictMode монтує, одразу розмонтовує і монтує ефект знову,
      // тож перша реєстрація скасовується. Це не помилка.
      if (
        controller.signal.aborted &&
        (e as { name?: string } | null)?.name === "AbortError"
      ) {
        return;
      }
      // Дублікат імені або відхилення схеми
      console.error("[webmcp]", tool.name, e);
    };
    try {
      const result = mc.registerTool(tool, { signal: controller.signal });
      names.push(tool.name);
      // Новий API повертає Promise: без catch відхилення стало б unhandled rejection
      if (result && typeof (result as Promise<unknown>).then === "function") {
        (result as Promise<unknown>).catch(onError);
      }
    } catch (e) {
      onError(e);
    }
  };

  add({
    name: "search_rabbit_articles",
    description:
      "Пошук статей і посібників на сайті 'Кролівництво від А до Я' за ключовими словами " +
      "(наприклад: годування, вакцинація, окрол, клітки). Повертає до 10 результатів " +
      "з назвою, розділом, коротким описом і шляхом сторінки.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Пошуковий запит українською мовою" },
      },
      required: ["query"],
    },
    outputSchema: searchOutputSchema,
    async execute(args) {
      const query = normalize(String(args.query ?? ""));
      if (!query) {
        return text("Порожній запит.", { results: [], message: "Порожній запит." });
      }
      const cards = await loadCards();
      const words = query.split(/\s+/).filter(Boolean);
      const scored = cards
        .map((c) => {
          const kw = Array.isArray(c.keywords) ? c.keywords.join(" ") : c.keywords ?? "";
          const hay = normalize(`${c.title} ${c.desc ?? ""} ${kw}`);
          const title = normalize(c.title);
          let score = 0;
          for (const w of words) {
            if (title.includes(w)) score += 3;
            else if (hay.includes(w)) score += 1;
          }
          return { c, score };
        })
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
      if (scored.length === 0) {
        return text("Нічого не знайдено.", { results: [], message: "Нічого не знайдено." });
      }
      const results = scored.map(({ c }) => ({
        title: c.title,
        path: c.path,
        ...(c.section ? { section: c.section } : {}),
        ...(c.desc ? { desc: c.desc } : {}),
      }));
      return text(
        scored
          .map(
            ({ c }) =>
              `${c.title}${c.section ? ` (${c.section})` : ""}\n${c.path}${c.desc ? `\n${c.desc}` : ""}`
          )
          .join("\n\n"),
        { results }
      );
    },
  });

  add({
    name: "open_site_page",
    description:
      "Відкриває сторінку сайту за внутрішнім шляхом, отриманим із search_rabbit_articles " +
      "(наприклад /beginner-guide). Працює лише для публічних сторінок.",
    inputSchema: {
      type: "object",
      properties: {
        path: { type: "string", description: "Внутрішній шлях, що починається з /" },
      },
      required: ["path"],
    },
    outputSchema: openOutputSchema,
    async execute(args) {
      const path = String(args.path ?? "");
      // Захист: лише внутрішні шляхи, без протокол-відносних і зовнішніх URL
      if (!path.startsWith("/") || path.startsWith("//") || path.includes("://")) {
        const message = "Дозволені лише внутрішні шляхи, що починаються з /.";
        return text(message, { opened: false, message }, true);
      }
      const cards = await loadCards();
      if (!cards.some((c) => c.path === path)) {
        const message = "Такої сторінки немає в каталозі сайту.";
        return text(message, { opened: false, message }, true);
      }
      navigate(path);
      const message = `Відкрито: ${path}`;
      return text(message, { opened: true, path, message });
    },
  });

  return () => {
    // Новий API: зняття реєстрації через abort сигналу
    controller.abort();
    // Старий API (Chrome 149): явний unregisterTool, якщо він є
    names.forEach((n) => {
      try {
        mc.unregisterTool?.(n);
      } catch {
        /* ігноруємо: інструмент уже знято через signal */
      }
    });
  };
}