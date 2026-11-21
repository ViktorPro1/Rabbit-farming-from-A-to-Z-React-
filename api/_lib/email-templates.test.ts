// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Статична перевірка: читає вихідні файли api/ і знаходить усі виклики
// renderTemplate('файл.html', { КЛЮЧ: ... }). Далі звіряє їх із самими шаблонами.
// Обмеження: об'єкт змінних має бути простим (без вкладених { } усередині).

const LIB_DIR = dirname(fileURLToPath(import.meta.url));
const API_DIR = join(LIB_DIR, '..');
const TEMPLATES_DIR = join(LIB_DIR, 'email-templates');

type Call = { file: string; template: string; keys: string[] };

function sourceFiles(): string[] {
    return [API_DIR, LIB_DIR].flatMap((dir) =>
        readdirSync(dir)
            .filter((name) => name.endsWith('.ts') && !name.endsWith('.test.ts'))
            .map((name) => join(dir, name))
    );
}

function findCalls(): Call[] {
    const calls: Call[] = [];
    const callRe = /renderTemplate\(\s*'([^']+\.html)'\s*(?:,\s*\{([^}]*)\})?/g;
    for (const file of sourceFiles()) {
        const src = readFileSync(file, 'utf-8');
        for (const match of src.matchAll(callRe)) {
            const keys = [...(match[2] ?? '').matchAll(/\b([A-Z][A-Z0-9_]*)\s*:/g)].map((k) => k[1]);
            calls.push({ file: basename(file), template: match[1], keys });
        }
    }
    return calls;
}

function placeholdersOf(template: string): string[] {
    const html = readFileSync(join(TEMPLATES_DIR, template), 'utf-8');
    return [...new Set([...html.matchAll(/\{\{([A-Z0-9_]+)\}\}/g)].map((m) => m[1]))];
}

const calls = findCalls();

describe('шаблони листів', () => {
    it('знаходить виклики renderTemplate у коді (захист від порожньої перевірки)', () => {
        expect(calls.length).toBeGreaterThanOrEqual(9);
    });

    describe.each(calls)('$file → $template', ({ template, keys }) => {
        it('файл шаблону існує в api/_lib/email-templates', () => {
            expect(existsSync(join(TEMPLATES_DIR, template))).toBe(true);
        });

        it('усі плейсхолдери {{...}} із шаблону передаються в виклику', () => {
            if (!existsSync(join(TEMPLATES_DIR, template))) return;
            const missing = placeholdersOf(template).filter((p) => !keys.includes(p));
            expect(missing, `не передано: ${missing.join(', ')}`).toEqual([]);
        });

        it('кожен переданий ключ має відповідний плейсхолдер у шаблоні', () => {
            if (!existsSync(join(TEMPLATES_DIR, template))) return;
            const placeholders = placeholdersOf(template);
            const unused = keys.filter((k) => !placeholders.includes(k));
            expect(unused, `зайві ключі: ${unused.join(', ')}`).toEqual([]);
        });
    });
});
