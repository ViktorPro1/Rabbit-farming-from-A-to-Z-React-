import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = join(__dirname, 'email-templates');

const cache = new Map<string, string>();

// Читає html-файл з api/_lib/email-templates/ один раз і кешує в пам'яті
// на весь час життя serverless-інстансу (не на диск — просто в модульну змінну),
// щоб не робити зайвий readFileSync на кожен рядок при розсилці багатьом користувачам.
export function loadTemplate(filename: string): string {
    const cached = cache.get(filename);
    if (cached) return cached;

    const html = readFileSync(join(TEMPLATES_DIR, filename), 'utf-8');
    cache.set(filename, html);
    return html;
}

// Проста підстановка {{PLACEHOLDER}} → значення, без зайвих залежностей
export function renderTemplate(filename: string, vars: Record<string, string> = {}): string {
    let html = loadTemplate(filename);
    for (const [key, value] of Object.entries(vars)) {
        html = html.replaceAll(`{{${key}}}`, value);
    }
    return html;
}
