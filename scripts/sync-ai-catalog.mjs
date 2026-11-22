#!/usr/bin/env node
/**
 * Синхронізує каталоги для ШІ-агентів
 *   public/.well-known/ai-catalog.json
 *   public/.well-known/ard.json
 * зі списком сторінок з src/prerender-routes.ts.
 *
 * Запускається автоматично після збірки (npm-хук "postbuild"), бо опис і запити
 * для нових сторінок береться з готової папки dist.
 * Вручну: node scripts/sync-ai-catalog.mjs
 *
 * Правила:
 *  - наявні записи НЕ змінюються і не видаляються; файл не перезаписується цілком,
 *    нові записи лише дописуються в кінець масиву "entries" (форматування решти файлу
 *    залишається байт у байт);
 *  - записи для сторінок, яких у каталозі ще немає, створюються автоматично:
 *    displayName і description з <title> та meta description сторінки,
 *    representativeQueries із заголовків сторінки (до 5);
 *  - базові ШІ-ресурси (/llms.txt, /llms-full.txt, див. BASE_RESOURCES) вставляються на ПОЧАТОК
 *    масиву "entries", якщо їх там ще немає; якщо вони вже є, нічого не змінюється;
 *  - службові сторінки з множини EXCLUDE (про проєкт, політика, відгуки тощо) в каталог не додаються;
 *  - скрипт лише попереджає (нічого не змінює), якщо:
 *      * запис містить заглушку в адресі (наприклад, your-deploy-url-here),
 *      * запис веде на сторінку цього сайту, якої вже немає в prerender-routes.ts,
 *      * сторінку не вдалося додати, бо в dist немає її опису;
 *  - результат пишеться і в public/.well-known, і в dist/.well-known (для поточного деплою).
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const BASE_URL = "https://rabbit-farming-from-a-to-z-react.vercel.app";
const ROUTES_FILE = resolve(ROOT, "src/prerender-routes.ts");
const TITLES_FILE = resolve(ROOT, "scripts/llms-titles.json");
const DIST_DIR = resolve(ROOT, "dist");
const CATALOG_FILES = ["ai-catalog.json", "ard.json"];

// Службові сторінки, яких у каталозі зараз немає (так задумано). Приберіть шлях зі списку,
// якщо хочете, щоб сторінка потрапила в каталог.
const EXCLUDE = new Set([
  "/",
  "/about",
  "/community",
  "/changelog",
  "/privacy-policy",
  "/terms-of-use",
  "/partnership",
  "/reviews",
  "/nps-survey",
]);

// Первинні ШІ-ресурси: стоять на початку каталогу, не є сторінками з prerender-routes.ts.
const BASE_RESOURCES = [
  {
    identifier: `urn:air:${new URL(BASE_URL).host}:resource:llms`,
    displayName: "LLMs Довідник (llms.txt)",
    type: "text/plain",
    url: `${BASE_URL}/llms.txt`,
    description: "Компактний індекс структури сайту, тем і навігаційних посилань для мовних моделей",
    representativeQueries: [
      "довідник кролівництва для штучного інтелекту",
      "llms txt кролівництво",
      "структура сайту кролівництво",
    ],
  },
  {
    identifier: `urn:air:${new URL(BASE_URL).host}:resource:llms-full`,
    displayName: "Повний LLMs Довідник (llms-full.txt)",
    type: "text/plain",
    url: `${BASE_URL}/llms-full.txt`,
    description: "Повний текстовий масив усіх статей та матеріалів сайту для аналізу мовними моделями",
    representativeQueries: [
      "повна база знань про кролівництво",
      "всі статті про кролів одним файлом",
      "повний текст посібника з кролівництва",
    ],
  },
];
const BASE_PATHS = new Set(BASE_RESOURCES.map((r) => new URL(r.url).pathname));

const SITE_SUFFIX = /\s+[—–-]\s+Кролівництво від А до Я\s*$/;
const FIRST_SECTION = "Головна";
const MAX_QUERIES = 5;
const MAX_QUERY_LENGTH = 60;
const PLACEHOLDER_RE = /your-deploy-url-here|example\.(com|org|net)|localhost|127\.0\.0\.1/i;
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

const warnings = [];
const warn = (message) => warnings.push(message);

function fail(message) {
  console.error(`[sync-ai-catalog] Помилка: ${message}`);
  process.exit(1);
}

function normalizePath(path) {
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

function parseRoutes(source) {
  const result = [];
  const seen = new Set();
  let started = false;
  for (const line of source.split(/\r?\n/)) {
    if (!started) {
      if (line.includes("[")) started = true;
      continue;
    }
    if (/^\s*\/\//.test(line)) continue;
    const route = line.match(/^\s*["'`](\/[^"'`]*)["'`]\s*,?\s*(?:\/\/.*)?$/);
    if (route) {
      const path = normalizePath(route[1]);
      if (!seen.has(path)) {
        seen.add(path);
        result.push(path);
      }
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

function toQuery(fragment) {
  return clean(
    decodeEntities(fragment.replace(/<[^>]+>/g, " ")).replace(/[\p{Extended_Pictographic}️‍]/gu, "")
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

/** Заголовок, опис і запити сторінки з dist; null, якщо dist-сторінки немає. */
function readPageMeta(path) {
  const file = resolve(DIST_DIR, path.slice(1), "index.html");
  if (!existsSync(file)) return null;
  const html = readFileSync(file, "utf8");
  const rawTitle = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "";
  const description = clean(html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1] ?? "");
  const title = clean(rawTitle).replace(SITE_SUFFIX, "");

  const rootStart = html.indexOf('<div id="root">');
  const body = rootStart >= 0 ? html.slice(rootStart) : html;
  const headings = [...body.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi)].map((m) => m[1]);

  const queries = [];
  for (const candidate of [title, ...headings]) {
    if (queries.length >= MAX_QUERIES) break;
    const query = toQuery(candidate);
    if (query.length < 3 || query.length > MAX_QUERY_LENGTH) continue;
    if (GENERIC_HEADINGS.has(query)) continue;
    if (queries.some((q) => q === query || q.includes(query) || query.includes(q))) continue;
    queries.push(query);
  }
  return { title, description, queries };
}

/** Серіалізація запису з відступом 4 пробіли, як у наявних записах каталогу. */
function formatEntry(entry) {
  return JSON.stringify(entry, null, 2)
    .split("\n")
    .map((line) => `    ${line}`)
    .join("\n");
}

function pathOf(url) {
  try {
    const parsed = new URL(url);
    return { host: parsed.host, path: normalizePath(parsed.pathname) || "/" };
  } catch {
    return { host: "", path: "" };
  }
}

function processCatalog(fileName, routes, routeSet, titles) {
  const publicFile = resolve(ROOT, "public/.well-known", fileName);
  if (!existsSync(publicFile)) {
    warn(`${fileName}: файл не знайдено у public/.well-known, пропущено.`);
    return;
  }

  const raw = readFileSync(publicFile, "utf8");
  const eol = raw.includes("\r\n") ? "\r\n" : "\n";
  const original = raw.replace(/\r\n/g, "\n");

  let catalog;
  try {
    catalog = JSON.parse(original);
  } catch (error) {
    fail(`${fileName} не є коректним JSON: ${error.message}`);
  }
  if (!Array.isArray(catalog.entries)) fail(`${fileName}: немає масиву "entries".`);

  const siteHost = new URL(BASE_URL).host;
  const existingPaths = new Set();

  // Перевірка наявних записів (нічого не змінюємо).
  for (const entry of catalog.entries) {
    const { host, path } = pathOf(entry.url ?? "");
    if (PLACEHOLDER_RE.test(entry.url ?? "") || PLACEHOLDER_RE.test(entry.identifier ?? "")) {
      warn(
        `${fileName}: запис "${entry.displayName}" містить заглушку в адресі (${entry.url}). ` +
        `Замініть "url" та "identifier" на справжні.`
      );
    }
    if (host === siteHost) {
      existingPaths.add(path);
      if (!routeSet.has(path) && !BASE_PATHS.has(path)) {
        warn(`${fileName}: запис "${entry.displayName}" веде на ${path}, якої немає в prerender-routes.ts.`);
      }
    }
  }

  // Базові ШІ-ресурси: вставляємо на початок масиву, лише якщо їх ще немає.
  let text = original;
  const missingBase = BASE_RESOURCES.filter(
    (base) => !catalog.entries.some((e) => e.identifier === base.identifier || e.url === base.url)
  );
  if (missingBase.length > 0) {
    const open = /"entries"\s*:\s*\[\n/.exec(original);
    if (!open) fail(`${fileName}: непередбачена структура файлу, базові ресурси не додано.`);
    const at = open.index + open[0].length;
    const block = missingBase.map(formatEntry).join(",\n");
    const separator = catalog.entries.length > 0 ? ",\n" : "\n";
    text = `${original.slice(0, at)}${block}${separator}${original.slice(at)}`;
    try {
      JSON.parse(text);
    } catch (error) {
      fail(`${fileName}: після додавання базових ресурсів виник некоректний JSON (${error.message}). Файл не змінено.`);
    }
  }

  // Нові сторінки.
  const additions = [];
  const skipped = [];
  for (const path of routes) {
    if (EXCLUDE.has(path) || existingPaths.has(path)) continue;
    const meta = readPageMeta(path);
    const displayName = meta?.title || titles[path];
    const description = meta?.description;
    if (!displayName || !description) {
      skipped.push(path);
      continue;
    }
    additions.push({
      identifier: `urn:air:${siteHost}:page:${path.slice(1)}`,
      displayName,
      type: "text/html",
      url: `${BASE_URL}${path}`,
      description,
      representativeQueries: meta.queries.length > 0 ? meta.queries : [displayName.toLowerCase()],
    });
  }
  if (skipped.length > 0) {
    warn(
      `${fileName}: не додано ${skipped.length} сторінок, бо в dist немає їх опису ` +
      `(виконайте npm run build): ${skipped.slice(0, 5).join(", ")}${skipped.length > 5 ? ", ..." : ""}`
    );
  }

  if (additions.length > 0) {
    const close = text.lastIndexOf("\n  ]");
    if (close === -1 || !text.slice(0, close).trimEnd().endsWith("}")) {
      fail(`${fileName}: непередбачена структура файлу, нові записи не додано.`);
    }
    const before = text.slice(0, close);
    const after = text.slice(close);
    text = `${before},\n${additions.map(formatEntry).join(",\n")}${after}`;
    try {
      JSON.parse(text);
    } catch (error) {
      fail(`${fileName}: після додавання записів виник некоректний JSON (${error.message}). Файл не змінено.`);
    }
  }

  const output = text.replace(/\n/g, eol);
  if (text !== original) writeFileSync(publicFile, output, "utf8");

  // Копія для поточного деплою.
  if (existsSync(DIST_DIR)) {
    const distFile = resolve(DIST_DIR, ".well-known", fileName);
    const current = existsSync(distFile) ? readFileSync(distFile, "utf8") : null;
    if (current !== output) {
      mkdirSync(dirname(distFile), { recursive: true });
      writeFileSync(distFile, output, "utf8");
    }
  }

  const added = missingBase.length + additions.length;
  console.log(
    added > 0
      ? `[sync-ai-catalog] ${fileName}: додано записів: ${added} (базових: ${missingBase.length}), усього ${catalog.entries.length + added}.`
      : `[sync-ai-catalog] ${fileName}: без змін, записів ${catalog.entries.length}.`
  );
}

function main() {
  if (!existsSync(ROUTES_FILE)) fail(`не знайдено ${ROUTES_FILE}`);
  const routes = parseRoutes(readFileSync(ROUTES_FILE, "utf8"));
  if (routes.length === 0) fail("у prerender-routes.ts не знайдено жодного маршруту");
  const routeSet = new Set(routes);
  const titles = loadTitles();

  if (!existsSync(DIST_DIR)) {
    warn("Папки dist немає: нові сторінки не буде додано (виконайте npm run build).");
  }

  for (const fileName of CATALOG_FILES) processCatalog(fileName, routes, routeSet, titles);

  for (const message of warnings) console.warn(`[sync-ai-catalog] Увага: ${message}`);
}

main();