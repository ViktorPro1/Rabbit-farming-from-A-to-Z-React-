/**
 * Додано: адаптер каталогу сторінок для WebMCP-інструментів (src/utils/webmcp.ts).
 * Перетворює масив groups із src/data/sectionCards у плоский список карток.
 *
 * ВАЖЛИВО: структура groups мені не відома напевно, тому розбір захисний:
 * група має мати title (або groupTitle) і масив cards (або items), а картка
 * має мати title і path (рядки). Якщо реальні назви полів інші, пошук поверне
 * порожній результат, і треба лише підправити flattenCards.
 *
 * Дані groups важкі (~236 КБ), тому підвантажуються через import() лише в момент
 * виклику інструмента, а не в основний бандл.
 */
import type { SiteCard } from "./webmcp";

// Платні/сесійні маршрути особистого кабінету: агентам їх не пропонуємо.
const PRIVATE_PREFIXES = [
  "/registry",
  "/archive",
  "/matings",
  "/paddocks",
  "/fattening",
  "/quarantine",
  "/statistics",
  "/my-vaccinations",
  "/my-treatments",
  "/disinfection-log",
  "/cage-search",
  "/grain-recipes-history",
  "/weighing",
  "/pedigree",
  "/calculator",
  "/admin",
];

type Rec = Record<string, unknown>;
const isRec = (v: unknown): v is Rec => typeof v === "object" && v !== null;
const str = (v: unknown): string | undefined =>
  typeof v === "string" && v.length > 0 ? v : undefined;

const isPrivate = (path: string) =>
  PRIVATE_PREFIXES.some((p) => path === p || path.startsWith(p + "/"));

export function flattenCards(groups: unknown): SiteCard[] {
  if (!Array.isArray(groups)) return [];
  const out: SiteCard[] = [];
  for (const g of groups) {
    if (!isRec(g)) continue;
    const section = str(g.title) ?? str(g.groupTitle);
    const cards = Array.isArray(g.cards)
      ? g.cards
      : Array.isArray(g.items)
        ? g.items
        : [];
    for (const c of cards) {
      if (!isRec(c)) continue;
      const title = str(c.title);
      const path = str(c.path);
      if (!title || !path || isPrivate(path)) continue;
      const kw = c.keywords;
      out.push({
        title,
        path,
        section,
        desc: str(c.desc),
        keywords: Array.isArray(kw)
          ? kw.filter((k): k is string => typeof k === "string")
          : str(kw),
      });
    }
  }
  return out;
}

export async function loadSiteCards(): Promise<SiteCard[]> {
  const mod = (await import("../data/sectionCards")) as Rec;
  return flattenCards(mod.groups);
}
