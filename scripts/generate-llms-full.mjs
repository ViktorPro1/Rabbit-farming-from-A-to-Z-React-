#!/usr/bin/env node
/**
 * Підтримує public/llms-full.txt в актуальному стані.
 *
 * Запускається автоматично після `npm run build` (npm-хук "postbuild"),
 * бо описи та ключові слова сторінок береться з готової папки dist.
 * Вручну: node scripts/generate-llms-full.mjs
 *
 * Правила:
 *  - записи, написані вручну (без позначки <!-- auto-generated ... -->), скрипт НЕ чіпає;
 *  - для маршрутів з src/prerender-routes.ts, яких у файлі немає, додається запис:
 *    заголовок і опис (<title>, meta description) та Keywords із вмісту сторінки
 *    (заголовки h1-h3 і виділені ознаки в таблицях) з dist/<маршрут>/index.html;
 *  - автоматичні записи (з позначкою) оновлюються при кожному запуску; щоб зробити запис
 *    ручним, видаліть рядок із позначкою - і скрипт більше його не змінюватиме;
 *  - якщо для сторінки немає dist, заголовок береться зі scripts/llms-titles.json;
 *  - оновлюються дата, кількість сторінок і версії в Tech Stack (node_modules або package.json);
 *  - результат пишеться і в public/llms-full.txt (для git), і в dist/llms-full.txt (для цього деплою).
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const ROUTES_FILE = resolve(ROOT, "src/prerender-routes.ts");
const FULL_FILE = resolve(ROOT, "public/llms-full.txt");
const TITLES_FILE = resolve(ROOT, "scripts/llms-titles.json");
const PKG_FILE = resolve(ROOT, "package.json");
const DIST_DIR = resolve(ROOT, "dist");
const DIST_FULL_FILE = resolve(DIST_DIR, "llms-full.txt");

const SITE_SUFFIX = /\s+[—–-]\s+Кролівництво від А до Я\s*$/;
const FIRST_SECTION = "Головна";
const AUTO_MARKER = "<!-- auto-generated: delete this line to keep the entry as is -->";

const MAX_KEYWORDS = 20;
const MAX_KEYWORD_LENGTH = 70;
// Загальні заголовки, які не є ключовими словами.
const GENERIC_HEADINGS = new Set([
  "джерела",
  "читайте також",
  "що це таке",
  "висновок",
  "висновки",
  "примітка",
  "важливо",
  "на головну",
  "поділитись",
]);

// Розділи prerender-routes.ts -> групи, які вже є в llms-full.txt (ключі у верхньому регістрі).
const GROUP_ALIASES = {
  "ІНСТРУМЕНТИ": "ІНСТРУМЕНТИ ТА ОБЛАДНАННЯ",
  "ФІНАЛ": "ЗАБІЙ ТА ПЕРЕРОБКА",
  "РЕЦЕПТИ": "ЗАБІЙ ТА ПЕРЕРОБКА",
  "ЛІКУВАННЯ ТА ВЕТЕРИНАРНА ДОПОМОГА": "ЗДОРОВ'Я",
  "ЗОНИ": "ЗДОРОВ'Я",
};

// Розділи, які у файлі подаються простим списком у блоці UTILITY & INFO ROUTES.
const UTILITY_SECTIONS = new Set(["ОНОВЛЕННЯ", "ІНФО"]);

// Англійські назви для нових груп (необов'язково).
const NEW_GROUP_ENGLISH = {
  "Помісь": "Crossbreeding",
  "Технології": "Technology",
  "Домашній улюбленець": "Pet Rabbits",
};

function fail(message) {
  console.error(`[generate-llms-full] Помилка: ${message}`);
  process.exit(1);
}

function normalizePath(path) {
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

function normKey(name) {
  return name
    .replace(/\s*\(.*\)\s*$/, "")
    .replace(/[’ʼ`]/g, "'")
    .trim()
    .toUpperCase();
}

/** Список маршрутів із розділами: [{ path, section }]. */
function parseRoutes(source) {
  const result = [];
  const seen = new Set();
  let section = FIRST_SECTION;
  let started = false;

  for (const line of source.split(/\r?\n/)) {
    if (!started) {
      if (line.includes("[")) started = true;
      continue;
    }
    const comment = line.match(/^\s*\/\/\s*(.+?)\s*$/);
    if (comment) {
      section = comment[1];
      continue;
    }
    const route = line.match(/^\s*["'`](\/[^"'`]*)["'`]\s*,?\s*(?:\/\/.*)?$/);
    if (route) {
      const path = normalizePath(route[1]);
      if (seen.has(path)) continue;
      seen.add(path);
      result.push({ path, section });
    }
  }
  return result;
}

function decodeEntities(text) {
  const named = { quot: '"', amp: "&", lt: "<", gt: ">", nbsp: " ", apos: "'" };
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity) => {
    const e = entity.toLowerCase();
    if (e[0] === "#") {
      const code = e[1] === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      try {
        return String.fromCodePoint(code);
      } catch {
        return match;
      }
    }
    return named[e] ?? match;
  });
}

const clean = (text) => decodeEntities(text).replace(/\s+/g, " ").trim();

/** Текст з HTML-фрагмента: без тегів, емодзі та крайньої пунктуації, у нижньому регістрі. */
function toKeyword(fragment) {
  return clean(
    decodeEntities(fragment.replace(/<[^>]+>/g, " "))
      .replace(/[\p{Extended_Pictographic}️‍]/gu, "")
  )
    .replace(/^[\s:;,.\-–—]+|[\s:;,.\-–—]+$/g, "")
    .toLowerCase();
}

function loadTitles() {
  if (!existsSync(TITLES_FILE)) return {};
  try {
    return JSON.parse(readFileSync(TITLES_FILE, "utf8"));
  } catch (error) {
    fail(`не вдалося прочитати ${TITLES_FILE}: ${error.message}`);
  }
}

/** Ключові слова з вмісту сторінки: заголовок, h1-h3 та виділені ознаки в таблицях. */
function extractKeywords(html, title) {
  const rootStart = html.indexOf('<div id="root">');
  const body = rootStart >= 0 ? html.slice(rootStart) : html;

  // Джерела ключових слів у порядку їх появи на сторінці:
  // заголовки h1-h3, блоки з класом "...section-title" та виділені ознаки в таблицях.
  const patterns = [
    /<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi,
    /<(\w+)[^>]*class="[^"]*section-title[^"]*"[^>]*>([\s\S]*?)<\/\1>/gi,
    /<td[^>]*>\s*<strong>([\s\S]*?)<\/strong>/gi,
  ];
  const found = [];
  for (const pattern of patterns) {
    for (const match of body.matchAll(pattern)) {
      found.push({ index: match.index, text: match[match.length - 1] });
    }
  }
  found.sort((a, b) => a.index - b.index);

  const candidates = [title, ...found.map((f) => f.text)];

  const result = [];
  const seen = new Set();
  for (const candidate of candidates) {
    const keyword = toKeyword(candidate);
    if (keyword.length < 3 || keyword.length > MAX_KEYWORD_LENGTH) continue;
    if (GENERIC_HEADINGS.has(keyword) || seen.has(keyword)) continue;
    seen.add(keyword);
    result.push(keyword);
    if (result.length >= MAX_KEYWORDS) break;
  }
  return result;
}

/** Заголовок, опис і ключові слова сторінки з dist; null, якщо dist-сторінки немає. */
function readPageMeta(path) {
  const file =
    path === "/" ? resolve(DIST_DIR, "index.html") : resolve(DIST_DIR, path.slice(1), "index.html");
  if (!existsSync(file)) return null;
  const html = readFileSync(file, "utf8");
  const rawTitle = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "";
  const rawDescription = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1] ?? "";
  const title = clean(rawTitle).replace(SITE_SUFFIX, "");
  return {
    title,
    description: clean(rawDescription),
    keywords: extractKeywords(html, title),
  };
}

const ENTRY_RE = /^\*\*GET (\/[^\s*]*)\*\* — /;

/** Знаходить записи "**GET /path** — ..." і межі кожного (до порожнього рядка). */
function findEntries(lines) {
  const entries = [];
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(ENTRY_RE);
    if (!match) continue;
    let end = i + 1;
    while (end < lines.length && lines[end].trim() !== "") end++;
    const block = lines.slice(i, end);
    const hasKeywords = block.some((l) => l.startsWith("Keywords:"));
    const hasMarker = block.some((l) => l.startsWith("<!-- auto-generated"));
    entries.push({
      path: match[1],
      start: i,
      end,
      // Автоматичний запис: має позначку або (для старих версій скрипта) не має Keywords.
      isAuto: hasMarker || !hasKeywords,
    });
    i = end - 1;
  }
  return entries;
}

function findGroupHeading(lines, key) {
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^### GROUP: (.+)$/);
    if (match && normKey(match[1]) === key) return i;
  }
  return -1;
}

/** Індекс рядка "---", яким закінчується блок, що починається з рядка from. */
function findBlockEnd(lines, from) {
  let j = from + 1;
  while (j < lines.length && lines[j] !== "---") j++;
  return j;
}

/** Позиція одразу після останнього непорожнього рядка перед endIndex. */
function trimBack(lines, from, endIndex) {
  let p = endIndex;
  while (p > from + 1 && lines[p - 1].trim() === "") p--;
  return p;
}

function getVersion(pkg, name) {
  const installed = resolve(ROOT, "node_modules", name, "package.json");
  try {
    if (existsSync(installed)) return JSON.parse(readFileSync(installed, "utf8")).version;
  } catch {
    // переходимо до package.json
  }
  const range = pkg.dependencies?.[name] ?? pkg.devDependencies?.[name];
  return range ? range.replace(/^[\^~>=<\s]+/, "") : null;
}

function patchVersions(text, warnings) {
  let pkg = {};
  try {
    pkg = JSON.parse(readFileSync(PKG_FILE, "utf8"));
  } catch {
    warnings.push("Не вдалося прочитати package.json: версії в Tech Stack не оновлено.");
    return text;
  }

  const v = {
    react: getVersion(pkg, "react"),
    ts: getVersion(pkg, "typescript"),
    vite: getVersion(pkg, "vite"),
    router: getVersion(pkg, "react-router-dom"),
    pwa: getVersion(pkg, "vite-plugin-pwa"),
  };

  const rules = [
    [/(\*\*Framework\*\*: React )[\d.]+( \+ TypeScript )[\d.]+/, v.react && v.ts, (m, a, b) => a + v.react + b + v.ts, "Framework"],
    [/(\*\*Build tool\*\*: Vite )[\d.]+/, v.vite, (m, a) => a + v.vite, "Build tool"],
    [/(React Router DOM )[\d.]+/, v.router, (m, a) => a + v.router, "Routing"],
    [/(vite-plugin-pwa )[\d.]+/, v.pwa, (m, a) => a + v.pwa, "PWA"],
  ];

  let result = text;
  for (const [regex, available, replacer, label] of rules) {
    if (!available) {
      warnings.push(`Версію для рядка "${label}" не знайдено, його не змінено.`);
      continue;
    }
    if (!regex.test(result)) {
      warnings.push(`У Tech Stack не знайдено рядок "${label}", його не змінено.`);
      continue;
    }
    result = result.replace(regex, replacer);
  }
  return result;
}

function main() {
  if (!existsSync(ROUTES_FILE)) fail(`не знайдено ${ROUTES_FILE}`);
  if (!existsSync(FULL_FILE)) fail(`не знайдено ${FULL_FILE}`);

  const raw = readFileSync(FULL_FILE, "utf8");
  const eol = raw.includes("\r\n") ? "\r\n" : "\n";
  const original = raw.replace(/\r\n/g, "\n");

  const routes = parseRoutes(readFileSync(ROUTES_FILE, "utf8"));
  if (routes.length === 0) fail("у prerender-routes.ts не знайдено жодного маршруту");
  const routeByPath = new Map(routes.map((r) => [r.path, r]));

  const titles = loadTitles();
  const warnings = [];
  const noMeta = [];
  const stale = [];
  const stats = { manual: 0, refreshed: 0, added: 0 };

  const distExists = existsSync(DIST_DIR);
  if (!distExists) {
    warnings.push("Папки dist немає: спершу виконайте npm run build. Нові сторінки буде додано лише із заголовком.");
  }

  const buildEntry = (route, meta) => {
    const title = meta?.title || titles[route.path] || route.path.slice(1);
    const entry = [`**GET ${route.path}** — ${title}`];
    if (meta?.description) entry.push(meta.description);
    if (meta?.keywords?.length) entry.push(`Keywords: ${meta.keywords.join(", ")}`);
    entry.push(AUTO_MARKER);
    return entry;
  };

  const lines = original.split("\n");

  // 1. Існуючі записи: ручні не чіпаємо, автоматичні оновлюємо.
  const entries = findEntries(lines);
  for (const entry of entries.slice().reverse()) {
    const route = routeByPath.get(entry.path);
    if (!route) {
      stale.push(entry.path);
      continue;
    }
    if (!entry.isAuto) {
      stats.manual++;
      continue;
    }
    const meta = readPageMeta(entry.path);
    if (!meta) continue; // без dist не погіршуємо наявний запис
    const fresh = buildEntry(route, meta);
    if (lines.slice(entry.start, entry.end).join("\n") !== fresh.join("\n")) {
      lines.splice(entry.start, entry.end - entry.start, ...fresh);
      stats.refreshed++;
    }
  }

  // 2. Нові маршрути.
  const present = new Set(
    [...lines.join("\n").matchAll(/\*\*GET (\/[^\s*]*)\*\*/g)].map((m) => m[1])
  );
  const missing = routes.filter((r) => !present.has(r.path));

  for (const route of missing) {
    const meta = readPageMeta(route.path);
    if (!meta || !meta.description) noMeta.push(route.path);
    const entry = buildEntry(route, meta);
    const sectionKey = normKey(route.section);

    if (UTILITY_SECTIONS.has(sectionKey)) {
      const heading = lines.findIndex((l) => l.startsWith("### UTILITY & INFO ROUTES"));
      if (heading !== -1) {
        const at = trimBack(lines, heading, findBlockEnd(lines, heading));
        lines.splice(at, 0, `- **GET ${route.path}** — ${entry[0].replace(ENTRY_RE, "")}`);
        stats.added++;
        continue;
      }
    }

    const groupKey = GROUP_ALIASES[sectionKey] ?? sectionKey;
    const heading = findGroupHeading(lines, groupKey);

    if (heading !== -1) {
      const at = trimBack(lines, heading, findBlockEnd(lines, heading));
      lines.splice(at, 0, "", ...entry);
    } else {
      const english = NEW_GROUP_ENGLISH[route.section];
      const name = `${route.section.toUpperCase()}${english ? ` (${english})` : ""}`;
      let at = lines.findIndex((l) => l.startsWith("### GROUP: СТАТТІ"));
      if (at === -1) at = lines.findIndex((l) => l.startsWith("### PROTECTED ROUTES"));
      if (at === -1) at = lines.length;
      lines.splice(at, 0, `### GROUP: ${name}`, "", ...entry, "", "---", "");
    }
    stats.added++;
  }

  // 3. Службові поля: дата, кількість сторінок, версії.
  const today = new Date().toISOString().slice(0, 10);
  let text = lines.join("\n");
  text = text
    .replace(/(\*\*Last updated\*\*: )\d{4}-\d{2}-\d{2}/, `$1${today}`)
    .replace(/(\*\*Total pages\*\*: ).*/, `$1${routes.length}`)
    .replace(/(\*Generated: )\d{4}-\d{2}-\d{2}(\*)/, `$1${today}$2`)
    .replace(/(\*Covers: )[\d+]+( pages)/, `$1${routes.length}$2`);
  text = patchVersions(text, warnings);

  // 4. Звіт.
  if (stale.length > 0) {
    warnings.push(
      `У файлі є записи для маршрутів, яких немає в prerender-routes.ts (їх не змінено): ${stale.join(", ")}`
    );
  }
  if (noMeta.length > 0) {
    warnings.push(
      `Для ${noMeta.length} сторінок немає опису в dist (додано лише заголовок): ${noMeta.slice(0, 5).join(", ")}${noMeta.length > 5 ? ", ..." : ""}`
    );
  }
  for (const w of warnings) console.warn(`[generate-llms-full] Увага: ${w}`);

  const summary =
    `ручних записів збережено: ${stats.manual}, автоматичних оновлено: ${stats.refreshed}, ` +
    `додано нових: ${stats.added}, усього маршрутів: ${routes.length}.`;

  // 5. Запис: public (для git) і dist (для поточного деплою).
  const output = text.replace(/\n/g, eol);
  let changed = false;

  if (text !== original) {
    writeFileSync(FULL_FILE, output, "utf8");
    changed = true;
  }
  if (distExists) {
    const distCurrent = existsSync(DIST_FULL_FILE) ? readFileSync(DIST_FULL_FILE, "utf8") : null;
    if (distCurrent !== output) writeFileSync(DIST_FULL_FILE, output, "utf8");
  }

  console.log(
    changed
      ? `[generate-llms-full] Оновлено public/llms-full.txt: ${summary}`
      : `[generate-llms-full] Без змін: ${summary}`
  );
}

main();
