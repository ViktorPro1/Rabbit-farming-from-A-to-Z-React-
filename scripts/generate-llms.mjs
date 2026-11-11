#!/usr/bin/env node
/**
 * Генерує блок «Site Structure & Navigation Links» у public/llms.txt
 * на основі src/prerender-routes.ts.
 *
 * Що робить скрипт:
 *  - читає список маршрутів і назви розділів із коментарів у prerender-routes.ts;
 *  - назви сторінок бере з scripts/llms-titles.json, а якщо там немає -
 *    з уже наявного public/llms.txt;
 *  - замінює ТІЛЬКИ блок структури сайту (від "## Site Structure & Navigation Links"
 *    до першого рядка "---"); решту файлу не чіпає;
 *  - підставляє актуальні версії React, TypeScript, Vite, React Router, vite-plugin-pwa
 *    у розділ Tech Stack (з node_modules або package.json);
 *  - якщо нічого не змінилося, файл не перезаписує.
 *
 * Запуск: node scripts/generate-llms.mjs
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const BASE_URL = "https://rabbit-farming-from-a-to-z-react.vercel.app";
const ROUTES_FILE = resolve(ROOT, "src/prerender-routes.ts");
const LLMS_FILE = resolve(ROOT, "public/llms.txt");
const TITLES_FILE = resolve(ROOT, "scripts/llms-titles.json");

const START_MARKER = "## Site Structure & Navigation Links";
const INTRO =
  "Below is the complete site structure mapping for automated AI agents and crawlers to index the full reference guide.";
const HOME_TITLE = "Головна сторінка / Homepage";
const FIRST_SECTION = "Головна";

// Маршрути, які не треба показувати мовним моделям (за потреби додайте сюди).
const EXCLUDE = new Set([]);

function fail(message) {
  console.error(`[generate-llms] Помилка: ${message}`);
  process.exit(1);
}

function normalizePath(path) {
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

/** Розбирає prerender-routes.ts на розділи: коментар "// Назва" відкриває розділ. */
function parseRoutes(source) {
  const sections = [];
  const seen = new Set();
  let current = null;
  let started = false;

  const openSection = (name) => {
    current = sections.find((s) => s.name === name);
    if (!current) {
      current = { name, routes: [] };
      sections.push(current);
    }
  };

  openSection(FIRST_SECTION);

  for (const line of source.split(/\r?\n/)) {
    if (!started) {
      if (line.includes("[")) started = true;
      continue;
    }

    const comment = line.match(/^\s*\/\/\s*(.+?)\s*$/);
    if (comment) {
      openSection(comment[1]);
      continue;
    }

    const route = line.match(/^\s*["'`](\/[^"'`]*)["'`]\s*,?\s*(?:\/\/.*)?$/);
    if (route) {
      const path = normalizePath(route[1]);
      if (EXCLUDE.has(path) || seen.has(path)) continue;
      seen.add(path);
      current.routes.push(path);
    }
  }

  return sections.filter((s) => s.routes.length > 0);
}

/** Витягує пари "шлях -> назва" з уже наявного llms.txt. */
function parseExistingTitles(text) {
  const titles = new Map();
  for (const match of text.matchAll(/^\*\s+\[([^\]]+)\]\(([^)\s]+)\)/gm)) {
    let path;
    try {
      path = normalizePath(new URL(match[2]).pathname);
    } catch {
      continue;
    }
    // Назви-заглушки (сам шлях) ігноруємо, щоб вони не закріплювалися назавжди.
    if (path !== "/" && match[1] === path.slice(1)) continue;
    titles.set(path, match[1]);
  }
  return titles;
}

function loadTitleOverrides() {
  if (!existsSync(TITLES_FILE)) return {};
  try {
    return JSON.parse(readFileSync(TITLES_FILE, "utf8"));
  } catch (error) {
    fail(`не вдалося прочитати ${TITLES_FILE}: ${error.message}`);
  }
}

const PKG_FILE = resolve(ROOT, "package.json");

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

/** Підставляє актуальні версії в розділ Tech Stack (за node_modules або package.json). */
function patchVersions(text) {
  let pkg;
  try {
    pkg = JSON.parse(readFileSync(PKG_FILE, "utf8"));
  } catch {
    console.warn("[generate-llms] Увага: не вдалося прочитати package.json, версії в Tech Stack не оновлено.");
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
    [/(\*\*React )[\d.]+(\*\* with TypeScript )[\d.]+/, v.react && v.ts, (m, a, b) => a + v.react + b + v.ts, "React / TypeScript"],
    [/(\*\*Vite )[\d.]+/, v.vite, (m, a) => a + v.vite, "Vite"],
    [/(\*\*React Router DOM )[\d.]+/, v.router, (m, a) => a + v.router, "React Router DOM"],
    [/(vite-plugin-pwa )[\d.]+/, v.pwa, (m, a) => a + v.pwa, "vite-plugin-pwa"],
  ];

  let result = text;
  for (const [regex, available, replacer, label] of rules) {
    if (!available || !regex.test(result)) {
      console.warn(`[generate-llms] Увага: рядок "${label}" у Tech Stack не оновлено (не знайдено версію або рядок).`);
      continue;
    }
    result = result.replace(regex, replacer);
  }
  return result;
}

function buildBlock(sections, titleFor) {
  const lines = [START_MARKER, "", INTRO, ""];
  for (const section of sections) {
    lines.push(`### ${section.name}`);
    for (const path of section.routes) {
      lines.push(`* [${titleFor(path)}](${BASE_URL}${path})`);
    }
    lines.push("");
  }
  return lines.join("\n");
}

function main() {
  if (!existsSync(ROUTES_FILE)) fail(`не знайдено ${ROUTES_FILE}`);
  if (!existsSync(LLMS_FILE)) fail(`не знайдено ${LLMS_FILE}`);

  const rawText = readFileSync(LLMS_FILE, "utf8");
  const eol = rawText.includes("\r\n") ? "\r\n" : "\n";
  const oldText = rawText.replace(/\r\n/g, "\n");

  const start = oldText.indexOf(START_MARKER);
  if (start === -1) fail(`у llms.txt немає рядка "${START_MARKER}"`);
  let end = oldText.indexOf("\n---", start);
  if (end === -1) end = oldText.length;
  const oldBlock = oldText.slice(start, end);

  const sections = parseRoutes(readFileSync(ROUTES_FILE, "utf8"));
  if (sections.length === 0) fail("у prerender-routes.ts не знайдено жодного маршруту");

  const overrides = loadTitleOverrides();
  const existing = parseExistingTitles(oldText);
  const missing = [];

  const titleFor = (path) => {
    if (path === "/") return HOME_TITLE;
    if (overrides[path]) return overrides[path];
    if (existing.has(path)) return existing.get(path);
    missing.push(path);
    return path.slice(1);
  };

  const newBlock = buildBlock(sections, titleFor);
  const total = sections.reduce((sum, s) => sum + s.routes.length, 0);

  if (missing.length > 0) {
    console.warn(
      `[generate-llms] Немає назви для ${missing.length} сторінок (використано шлях). ` +
        `Додайте їх у scripts/llms-titles.json:`
    );
    for (const path of missing) console.warn(`  "${path}": "..."`);
  }

  let newText = newBlock === oldBlock ? oldText : oldText.slice(0, start) + newBlock + oldText.slice(end);
  newText = patchVersions(newText);

  if (newText === oldText) {
    console.log(`[generate-llms] Без змін: ${total} сторінок у ${sections.length} розділах.`);
    return;
  }

  const today = new Date().toISOString().slice(0, 10);
  newText = newText.replace(/(\*\*Last Updated\*\*:\s*)\d{4}-\d{2}-\d{2}/, `$1${today}`);

  writeFileSync(LLMS_FILE, newText.replace(/\n/g, eol), "utf8");
  console.log(`[generate-llms] Оновлено public/llms.txt: ${total} сторінок у ${sections.length} розділах.`);
}

main();
