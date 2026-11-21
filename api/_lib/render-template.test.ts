// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mocks = vi.hoisted(() => ({ readFileSync: vi.fn() }));

vi.mock('node:fs', () => ({ readFileSync: mocks.readFileSync }));

import { loadTemplate, renderTemplate } from './email-templates';

// Кеш шаблонів живе на рівні модуля, тому кожен тест використовує власну назву файлу.
let counter = 0;
function uniqueName() {
    counter += 1;
    return `test-template-${counter}.html`;
}

beforeEach(() => {
    vi.clearAllMocks();
});

describe('loadTemplate', () => {
    it('читає файл із каталогу email-templates у кодуванні utf-8', () => {
        const name = uniqueName();
        mocks.readFileSync.mockReturnValue('<p>hello</p>');
        expect(loadTemplate(name)).toBe('<p>hello</p>');
        const [path, encoding] = mocks.readFileSync.mock.calls[0];
        expect(String(path).replaceAll('\\', '/')).toMatch(new RegExp(`/email-templates/${name}$`));
        expect(encoding).toBe('utf-8');
    });

    it('кешує шаблон: другий виклик не читає файл повторно', () => {
        const name = uniqueName();
        mocks.readFileSync.mockReturnValue('<p>cached</p>');
        loadTemplate(name);
        loadTemplate(name);
        expect(mocks.readFileSync).toHaveBeenCalledTimes(1);
    });

    it('для різних файлів читає кожен окремо', () => {
        mocks.readFileSync.mockReturnValueOnce('A').mockReturnValueOnce('B');
        expect(loadTemplate(uniqueName())).toBe('A');
        expect(loadTemplate(uniqueName())).toBe('B');
        expect(mocks.readFileSync).toHaveBeenCalledTimes(2);
    });

    it('пробрасує помилку, коли файл не знайдено', () => {
        mocks.readFileSync.mockImplementation(() => {
            throw new Error('ENOENT');
        });
        expect(() => loadTemplate(uniqueName())).toThrow('ENOENT');
    });
});

describe('renderTemplate', () => {
    it('повертає шаблон без змін, коли змінних немає', () => {
        mocks.readFileSync.mockReturnValue('<p>{{A}}</p>');
        expect(renderTemplate(uniqueName())).toBe('<p>{{A}}</p>');
    });

    it('підставляє значення замість плейсхолдера', () => {
        mocks.readFileSync.mockReturnValue('<p>Сума: {{SUMA}}</p>');
        expect(renderTemplate(uniqueName(), { SUMA: '199 грн' })).toBe('<p>Сума: 199 грн</p>');
    });

    it('замінює всі входження одного плейсхолдера', () => {
        mocks.readFileSync.mockReturnValue('{{DATA}} і ще раз {{DATA}}');
        expect(renderTemplate(uniqueName(), { DATA: '01.12.2026' })).toBe('01.12.2026 і ще раз 01.12.2026');
    });

    it('підставляє кілька змінних одразу', () => {
        mocks.readFileSync.mockReturnValue('{{A}}-{{B}}');
        expect(renderTemplate(uniqueName(), { A: '1', B: '2' })).toBe('1-2');
    });

    it('залишає плейсхолдери, для яких значення не передано', () => {
        mocks.readFileSync.mockReturnValue('{{A}}-{{B}}');
        expect(renderTemplate(uniqueName(), { A: '1' })).toBe('1-{{B}}');
    });

    it('ігнорує змінні, яких немає в шаблоні', () => {
        mocks.readFileSync.mockReturnValue('<p>text</p>');
        expect(renderTemplate(uniqueName(), { UNUSED: 'x' })).toBe('<p>text</p>');
    });

    it('підставляє значення буквально, зокрема зі спецсимволами $ (наприклад, $$ чи $&)', () => {
        const values = ['ціна 5$$', 'a$&b', '$1', 'до $` після'];
        for (const value of values) {
            mocks.readFileSync.mockReturnValue('Тут: {{A}}.');
            expect(renderTemplate(uniqueName(), { A: value })).toBe(`Тут: ${value}.`);
        }
    });
});
