// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';

type QueryResult = { data: unknown; error: unknown };
type Call = { method: string; args: unknown[] };

const mocks = vi.hoisted(() => ({
    sendToUser: vi.fn(),
    sendEmail: vi.fn(),
    renderTemplate: vi.fn(),
    listUsers: vi.fn(),
    // Додано: rpc для перевірки ліміту поголів'я (get_herd_counts_for_cron)
    rpc: vi.fn(),
    queues: new Map<string, unknown[]>(),
    log: [] as { table: string; calls: { method: string; args: unknown[] }[] }[],
}));

// Фальшивий конструктор запитів Supabase: запам'ятовує всі виклики ланцюжка
// (.select().eq()...) і при await повертає заздалегідь підготовлений результат.
function makeBuilder(table: string, result: QueryResult) {
    const entry = { table, calls: [] as Call[] };
    mocks.log.push(entry);
    const builder: object = new Proxy(
        {},
        {
            get(_target, prop) {
                if (prop === 'then') {
                    return (resolve: (v: QueryResult) => unknown, reject: (e: unknown) => unknown) =>
                        Promise.resolve(result).then(resolve, reject);
                }
                return (...args: unknown[]) => {
                    entry.calls.push({ method: String(prop), args });
                    return builder;
                };
            },
        }
    );
    return builder;
}

function nextResult(table: string): QueryResult {
    const queue = mocks.queues.get(table);
    return (queue?.shift() as QueryResult | undefined) ?? { data: [], error: null };
}

vi.mock('./push.js', () => ({
    supabase: {
        from: (table: string) => makeBuilder(table, nextResult(table)),
        auth: { admin: { listUsers: mocks.listUsers } },
        rpc: mocks.rpc,
    },
    sendToUser: mocks.sendToUser,
}));
vi.mock('./email.js', () => ({ sendEmail: mocks.sendEmail }));
vi.mock('./email-templates.js', () => ({ renderTemplate: mocks.renderTemplate }));

import {
    checkControlMatings,
    checkExpectedBirths,
    checkRepeatControls,
    checkRepeatBirths,
    checkSlaughter,
    checkTreatments,
    checkVaccinations,
    checkNestboxPrep,
    checkWeaning,
    checkTrialEndingSoon,
    checkTrialEndedToday,
    checkTrialFeedbackRequest,
    checkInactiveReactivation,
    checkWeighing,
    checkHerdLimit,
} from './reminders';

const TOMORROW = '2026-11-22';

function queueResult(table: string, result: QueryResult) {
    mocks.queues.set(table, [...(mocks.queues.get(table) ?? []), result]);
}

beforeEach(() => {
    vi.clearAllMocks();
    mocks.queues.clear();
    mocks.log.length = 0;
    vi.spyOn(console, 'error').mockImplementation(() => { });
    mocks.sendToUser.mockResolvedValue(undefined);
});

type Case = {
    name: string;
    run: (tomorrow: string) => Promise<{ sent: number; error?: string }>;
    table: string;
    filters: Call[];
    errorName: string;
    row: Record<string, unknown>;
    push: { title: string; body: string; url: string };
    fallbackRow?: Record<string, unknown>;
    fallbackBody?: string;
};

const cases: Case[] = [
    {
        name: 'checkControlMatings (контрольна злучка)',
        run: checkControlMatings,
        table: 'matings',
        filters: [
            { method: 'eq', args: ['control_date', TOMORROW] },
            { method: 'eq', args: ['is_archived', false] },
        ],
        errorName: 'controlMatings',
        row: { user_id: 'u1', female_cage: '12', male_cage: '7' },
        push: { title: 'Контрольна злучка завтра', body: 'Клітка 12 × 7 — перевір завтра.', url: '/matings' },
        fallbackRow: { user_id: 'u1', female_cage: null, male_cage: '' },
        fallbackBody: 'Клітка ? × ? — перевір завтра.',
    },
    {
        name: 'checkExpectedBirths (очікуваний окріл)',
        run: checkExpectedBirths,
        table: 'matings',
        filters: [
            { method: 'eq', args: ['expected_birth', TOMORROW] },
            { method: 'eq', args: ['is_archived', false] },
        ],
        errorName: 'expectedBirths',
        row: { user_id: 'u1', female_cage: '12' },
        push: { title: 'Очікуваний окріл завтра', body: 'Клітка 12 — завтра очікується окріл.', url: '/matings' },
        fallbackRow: { user_id: 'u1', female_cage: null },
        fallbackBody: 'Клітка ? — завтра очікується окріл.',
    },
    {
        name: 'checkRepeatControls (повторна контрольна злучка)',
        run: checkRepeatControls,
        table: 'litters',
        filters: [{ method: 'eq', args: ['litter_control_date', TOMORROW] }],
        errorName: 'repeatControls',
        row: { user_id: 'u1', mother_id: 'm1' },
        push: {
            title: 'Контрольна злучка завтра',
            body: 'Перевір самку — контрольна дата повторної злучки.',
            url: '/matings',
        },
    },
    {
        name: 'checkRepeatBirths (повторний окріл)',
        run: checkRepeatBirths,
        table: 'litters',
        filters: [{ method: 'eq', args: ['litter_expected_birth', TOMORROW] }],
        errorName: 'repeatBirths',
        row: { user_id: 'u1', rabbits: { cage_number: '5' } },
        push: { title: 'Очікуваний окріл завтра', body: 'Клітка 5 — завтра очікується окріл.', url: '/matings' },
        fallbackRow: { user_id: 'u1', rabbits: null },
        fallbackBody: 'Клітка ? — завтра очікується окріл.',
    },
    {
        name: 'checkSlaughter (забій)',
        run: checkSlaughter,
        table: 'fattening',
        filters: [
            { method: 'eq', args: ['slaughter_date', TOMORROW] },
            { method: 'eq', args: ['is_active', true] },
        ],
        errorName: 'slaughterCages',
        row: { user_id: 'u1', cage_number: '3', breed: 'Термондська' },
        push: { title: 'Забій завтра', body: 'Клітка 3 — Термондська — планова дата забою.', url: '/fattening' },
        fallbackRow: { user_id: 'u1', cage_number: null, breed: null },
        fallbackBody: 'Клітка ? — планова дата забою.',
    },
    {
        name: 'checkTreatments (лікування)',
        run: checkTreatments,
        table: 'treatments',
        filters: [{ method: 'eq', args: ['next_date', TOMORROW] }],
        errorName: 'treatmentsDue',
        row: { user_id: 'u1', cage_number: '4', drug_name: 'Байтрил' },
        push: { title: 'Лікування завтра', body: 'Клітка 4 — Байтрил.', url: '/my-treatments' },
        fallbackRow: { user_id: 'u1', cage_number: null, drug_name: null },
        fallbackBody: 'Клітка ? — наступний прийом препарату.',
    },
    {
        name: 'checkVaccinations (вакцинація)',
        run: checkVaccinations,
        table: 'vaccinations',
        filters: [{ method: 'eq', args: ['next_date', TOMORROW] }],
        errorName: 'vaccinations',
        row: { user_id: 'u1', cage_number: '4', vaccine_name: 'Рабівак' },
        push: { title: 'Вакцинація завтра', body: 'Клітка 4 — Рабівак.', url: '/my-vaccinations' },
        fallbackRow: { user_id: 'u1', cage_number: null, vaccine_name: null },
        fallbackBody: 'Клітка ? — щеплення.',
    },
];

describe.each(cases)('$name', (c) => {
    it('запитує правильну таблицю з фільтром за завтрашньою датою', async () => {
        await c.run(TOMORROW);
        expect(mocks.log).toHaveLength(1);
        expect(mocks.log[0].table).toBe(c.table);
        for (const filter of c.filters) {
            expect(mocks.log[0].calls).toContainEqual(filter);
        }
    });

    it('надсилає push власнику запису з правильним текстом і посиланням', async () => {
        queueResult(c.table, { data: [c.row], error: null });
        const result = await c.run(TOMORROW);
        expect(result).toEqual({ sent: 1 });
        expect(mocks.sendToUser).toHaveBeenCalledTimes(1);
        expect(mocks.sendToUser).toHaveBeenCalledWith(
            'u1',
            expect.stringContaining(c.push.title),
            c.push.body,
            c.push.url
        );
    });

    it('надсилає окреме сповіщення на кожен запис і рахує їх', async () => {
        queueResult(c.table, {
            data: [c.row, { ...c.row, user_id: 'u2' }, { ...c.row, user_id: 'u3' }],
            error: null,
        });
        const result = await c.run(TOMORROW);
        expect(result.sent).toBe(3);
        expect(mocks.sendToUser.mock.calls.map((call) => call[0])).toEqual(['u1', 'u2', 'u3']);
    });

    it('не надсилає нічого, коли записів немає', async () => {
        queueResult(c.table, { data: [], error: null });
        expect(await c.run(TOMORROW)).toEqual({ sent: 0 });
        expect(mocks.sendToUser).not.toHaveBeenCalled();
    });

    it('не падає, коли база повернула data = null без помилки', async () => {
        queueResult(c.table, { data: null, error: null });
        expect(await c.run(TOMORROW)).toEqual({ sent: 0 });
        expect(mocks.sendToUser).not.toHaveBeenCalled();
    });

    it('при помилці запиту повертає назву помилки, пише в лог і нічого не надсилає', async () => {
        queueResult(c.table, { data: null, error: new Error('db down') });
        expect(await c.run(TOMORROW)).toEqual({ sent: 0, error: c.errorName });
        expect(console.error).toHaveBeenCalled();
        expect(mocks.sendToUser).not.toHaveBeenCalled();
    });

    if (c.fallbackRow && c.fallbackBody) {
        const { fallbackRow, fallbackBody } = c;
        it('підставляє «?» або запасний текст, коли номера клітки чи назви немає', async () => {
            queueResult(c.table, { data: [fallbackRow], error: null });
            await c.run(TOMORROW);
            expect(mocks.sendToUser).toHaveBeenCalledWith(
                'u1',
                expect.any(String),
                fallbackBody,
                c.push.url
            );
        });
    }
});

// ---------------------------------------------------------------------------
// Підготовка маточника: дата злучки + 26 днів = завтра
// Дати пораховані вручну для TOMORROW = 2026-11-22:
//   2026-10-27 + 26 дн. = 2026-11-22
// ---------------------------------------------------------------------------
describe('checkNestboxPrep (підготовка маточника)', () => {
    const NEST_DAY = '2026-10-27';

    it('запитує litters лише без окролу, без поставленого маточника і з датою злучки', async () => {
        await checkNestboxPrep(TOMORROW);
        expect(mocks.log).toHaveLength(1);
        expect(mocks.log[0].table).toBe('litters');
        expect(mocks.log[0].calls).toContainEqual({ method: 'is', args: ['birth_date', null] });
        expect(mocks.log[0].calls).toContainEqual({ method: 'is', args: ['nestbox_date', null] });
        expect(mocks.log[0].calls).toContainEqual({
            method: 'not',
            args: ['litter_mating_date', 'is', null],
        });
    });

    it('надсилає push, коли від злучки минуло рівно 26 днів до завтра', async () => {
        queueResult('litters', {
            data: [{ user_id: 'u1', litter_mating_date: NEST_DAY, mating_id: 'm1' }],
            error: null,
        });
        const result = await checkNestboxPrep(TOMORROW);
        expect(result).toEqual({ sent: 1 });
        expect(mocks.sendToUser).toHaveBeenCalledWith(
            'u1',
            expect.stringContaining('Підготувати маточник завтра'),
            'Окріл наближається — час поставити маточник.',
            '/matings'
        );
    });

    it('не надсилає push за день до і за день після потрібної дати', async () => {
        queueResult('litters', {
            data: [
                { user_id: 'u1', litter_mating_date: '2026-10-26', mating_id: 'm1' },
                { user_id: 'u2', litter_mating_date: '2026-10-28', mating_id: 'm2' },
            ],
            error: null,
        });
        expect(await checkNestboxPrep(TOMORROW)).toEqual({ sent: 0 });
        expect(mocks.sendToUser).not.toHaveBeenCalled();
    });

    it('з кількох записів надсилає лише тим, у кого дата збіглася, і рахує саме їх', async () => {
        queueResult('litters', {
            data: [
                { user_id: 'u1', litter_mating_date: NEST_DAY, mating_id: 'm1' },
                { user_id: 'u2', litter_mating_date: '2026-10-01', mating_id: 'm2' },
                { user_id: 'u3', litter_mating_date: NEST_DAY, mating_id: 'm3' },
            ],
            error: null,
        });
        const result = await checkNestboxPrep(TOMORROW);
        expect(result.sent).toBe(2);
        expect(mocks.sendToUser.mock.calls.map((call) => call[0])).toEqual(['u1', 'u3']);
    });

    it('не падає на порожньому результаті і на data = null', async () => {
        queueResult('litters', { data: [], error: null });
        expect(await checkNestboxPrep(TOMORROW)).toEqual({ sent: 0 });
        queueResult('litters', { data: null, error: null });
        expect(await checkNestboxPrep(TOMORROW)).toEqual({ sent: 0 });
        expect(mocks.sendToUser).not.toHaveBeenCalled();
    });

    it('при помилці запиту повертає nestboxCandidates і пише в лог', async () => {
        queueResult('litters', { data: null, error: new Error('db down') });
        expect(await checkNestboxPrep(TOMORROW)).toEqual({ sent: 0, error: 'nestboxCandidates' });
        expect(console.error).toHaveBeenCalled();
        expect(mocks.sendToUser).not.toHaveBeenCalled();
    });
});

// ---------------------------------------------------------------------------
// Відлучення: дата окролу + дні за схемою = завтра
// Для TOMORROW = 2026-11-22 (дати пораховані вручну):
//   intensive       28 дн. -> окріл 2026-10-25
//   semi_intensive  45 дн. -> окріл 2026-10-08
//   extensive       60 дн. -> окріл 2026-09-23
// ---------------------------------------------------------------------------
describe('checkWeaning (відлучення)', () => {
    const BIRTH = {
        intensive: '2026-10-25',
        semi_intensive: '2026-10-08',
        extensive: '2026-09-23',
    };

    function queueLitters(rows: Record<string, unknown>[]) {
        queueResult('litters', { data: rows, error: null });
    }
    function queueSchemes(rows: Record<string, unknown>[]) {
        queueResult('matings', { data: rows, error: null });
    }

    it('запитує окроли з відомою датою народження і без дати відлучення', async () => {
        await checkWeaning(TOMORROW);
        expect(mocks.log[0].table).toBe('litters');
        expect(mocks.log[0].calls).toContainEqual({ method: 'not', args: ['birth_date', 'is', null] });
        expect(mocks.log[0].calls).toContainEqual({ method: 'is', args: ['weaned_date', null] });
    });

    it.each([
        ['intensive', BIRTH.intensive, '2026-10-24', '2026-10-26'],
        ['semi_intensive', BIRTH.semi_intensive, '2026-10-07', '2026-10-09'],
        ['extensive', BIRTH.extensive, '2026-09-22', '2026-09-24'],
    ])('схема %s: надсилає push рівно у свій день і не надсилає у сусідні', async (scheme, onDay, dayBefore, dayAfter) => {
        queueLitters([
            { user_id: 'u1', birth_date: onDay, mating_id: 'm1' },
            { user_id: 'u2', birth_date: dayBefore, mating_id: 'm1' },
            { user_id: 'u3', birth_date: dayAfter, mating_id: 'm1' },
        ]);
        queueSchemes([{ id: 'm1', breeding_scheme: scheme }]);
        const result = await checkWeaning(TOMORROW);
        expect(result).toEqual({ sent: 1 });
        expect(mocks.sendToUser).toHaveBeenCalledTimes(1);
        expect(mocks.sendToUser).toHaveBeenCalledWith(
            'u1',
            expect.stringContaining('Відлучення завтра'),
            'Крільченята готові до відлучення від Крольчихи.',
            '/matings'
        );
    });

    it('для невідомої схеми використовує екстенсивну (60 днів)', async () => {
        queueLitters([{ user_id: 'u1', birth_date: BIRTH.extensive, mating_id: 'm1' }]);
        queueSchemes([{ id: 'm1', breeding_scheme: 'щось-незнайоме' }]);
        expect(await checkWeaning(TOMORROW)).toEqual({ sent: 1 });
    });

    it('для порожньої схеми (null або порожній рядок) використовує екстенсивну (60 днів)', async () => {
        queueLitters([
            { user_id: 'u1', birth_date: BIRTH.extensive, mating_id: 'm1' },
            { user_id: 'u2', birth_date: BIRTH.extensive, mating_id: 'm2' },
        ]);
        queueSchemes([
            { id: 'm1', breeding_scheme: null },
            { id: 'm2', breeding_scheme: '' },
        ]);
        expect(await checkWeaning(TOMORROW)).toEqual({ sent: 2 });
    });

    it('для окролу без злучки (mating_id = null) використовує екстенсивну і не робить другий запит', async () => {
        queueLitters([{ user_id: 'u1', birth_date: BIRTH.extensive, mating_id: null }]);
        expect(await checkWeaning(TOMORROW)).toEqual({ sent: 1 });
        expect(mocks.log).toHaveLength(1);
    });

    it('схему беруть із таблиці matings за унікальними id (без дублів)', async () => {
        queueLitters([
            { user_id: 'u1', birth_date: BIRTH.intensive, mating_id: 'm1' },
            { user_id: 'u2', birth_date: BIRTH.intensive, mating_id: 'm1' },
            { user_id: 'u3', birth_date: BIRTH.extensive, mating_id: 'm2' },
        ]);
        queueSchemes([
            { id: 'm1', breeding_scheme: 'intensive' },
            { id: 'm2', breeding_scheme: 'extensive' },
        ]);
        await checkWeaning(TOMORROW);
        expect(mocks.log[1].table).toBe('matings');
        expect(mocks.log[1].calls).toContainEqual({ method: 'in', args: ['id', ['m1', 'm2']] });
    });

    it('кожен власник окролу отримує власне сповіщення', async () => {
        queueLitters([
            { user_id: 'u1', birth_date: BIRTH.intensive, mating_id: 'm1' },
            { user_id: 'u2', birth_date: BIRTH.intensive, mating_id: 'm1' },
        ]);
        queueSchemes([{ id: 'm1', breeding_scheme: 'intensive' }]);
        const result = await checkWeaning(TOMORROW);
        expect(result.sent).toBe(2);
        expect(mocks.sendToUser.mock.calls.map((call) => call[0])).toEqual(['u1', 'u2']);
    });

    it('при помилці запиту схем продовжує з екстенсивною схемою, не повертаючи error', async () => {
        queueLitters([
            { user_id: 'u1', birth_date: BIRTH.intensive, mating_id: 'm1' },
            { user_id: 'u2', birth_date: BIRTH.extensive, mating_id: 'm1' },
        ]);
        queueResult('matings', { data: null, error: new Error('db down') });
        const result = await checkWeaning(TOMORROW);
        expect(result).toEqual({ sent: 1 });
        expect(console.error).toHaveBeenCalled();
        expect(mocks.sendToUser).toHaveBeenCalledTimes(1);
        expect(mocks.sendToUser.mock.calls[0][0]).toBe('u2');
    });

    it('при помилці першого запиту повертає weaningCandidates і не робить другий запит', async () => {
        queueResult('litters', { data: null, error: new Error('db down') });
        expect(await checkWeaning(TOMORROW)).toEqual({ sent: 0, error: 'weaningCandidates' });
        expect(mocks.log).toHaveLength(1);
        expect(mocks.sendToUser).not.toHaveBeenCalled();
    });

    it('не падає на порожньому результаті і на data = null', async () => {
        queueLitters([]);
        expect(await checkWeaning(TOMORROW)).toEqual({ sent: 0 });
        queueResult('litters', { data: null, error: null });
        expect(await checkWeaning(TOMORROW)).toEqual({ sent: 0 });
        expect(mocks.sendToUser).not.toHaveBeenCalled();
    });
});

// ---------------------------------------------------------------------------
// Листи пробного періоду. access_until — timestamptz, тому порівняння йде
// діапазоном [початок доби UTC, початок наступної доби UTC).
// Для TOMORROW = 2026-11-22 (пораховано вручну):
//   ending soon : сьогодні + 3 дні = 2026-11-24
//   ended today : сьогодні         = 2026-11-21
//   feedback    : сьогодні - 2 дні = 2026-11-19
// ---------------------------------------------------------------------------
type TrialCase = {
    name: string;
    run: (tomorrow: string) => Promise<{ sent: number; error?: string }>;
    errorName: string;
    templateMatcher: RegExp;
    templateVars?: Record<string, string>;
    subject: string;
    range: { start: string; end: string };
    boundary: { tomorrow: string; start: string; end: string };
};

const trialCases: TrialCase[] = [
    {
        name: 'checkTrialEndingSoon (пробний завершується через 3 дні)',
        run: checkTrialEndingSoon,
        errorName: 'trialEndingSoon',
        templateMatcher: /^lyst-probnyi_period_zavershuyetsya_skoro\.html$/,
        templateVars: { K: '3' },
        subject: 'Ваш пробний період добігає кінця',
        range: { start: '2026-11-24T00:00:00.000Z', end: '2026-11-25T00:00:00.000Z' },
        boundary: {
            tomorrow: '2026-12-30',
            start: '2027-01-01T00:00:00.000Z',
            end: '2027-01-02T00:00:00.000Z',
        },
    },
    {
        name: 'checkTrialEndedToday (пробний завершився сьогодні)',
        run: checkTrialEndedToday,
        errorName: 'trialEndedToday',
        templateMatcher: /^lyst-probnyi_period_zaversh.*_pidpyska\.html$/,
        subject: 'Ваш пробний період завершено',
        range: { start: '2026-11-21T00:00:00.000Z', end: '2026-11-22T00:00:00.000Z' },
        boundary: {
            tomorrow: '2027-01-01',
            start: '2026-12-31T00:00:00.000Z',
            end: '2027-01-01T00:00:00.000Z',
        },
    },
    {
        name: 'checkTrialFeedbackRequest (прохання відгуку через 2 дні після пробного)',
        run: checkTrialFeedbackRequest,
        errorName: 'trialFeedbackRequest',
        templateMatcher: /^lyst-vidguk_pislya_probnogo\.html$/,
        subject: 'Поділіться враженнями про сервіс',
        range: { start: '2026-11-19T00:00:00.000Z', end: '2026-11-20T00:00:00.000Z' },
        boundary: {
            tomorrow: '2027-01-03',
            start: '2026-12-31T00:00:00.000Z',
            end: '2027-01-01T00:00:00.000Z',
        },
    },
];

describe.each(trialCases)('$name', (c) => {
    beforeEach(() => {
        mocks.sendEmail.mockResolvedValue(true);
        mocks.renderTemplate.mockReturnValue('<html>letter</html>');
    });

    function hasRange(start: string, end: string) {
        const calls = mocks.log[0].calls;
        expect(mocks.log[0].table).toBe('profiles');
        expect(calls).toContainEqual({ method: 'eq', args: ['plan_type', 'trial'] });
        expect(calls).toContainEqual({ method: 'gte', args: ['access_until', start] });
        expect(calls).toContainEqual({ method: 'lt', args: ['access_until', end] });
    }

    it('шукає пробних користувачів у потрібному добовому діапазоні', async () => {
        await c.run(TOMORROW);
        hasRange(c.range.start, c.range.end);
    });

    it('діапазон коректний і через межу місяця чи року', async () => {
        await c.run(c.boundary.tomorrow);
        hasRange(c.boundary.start, c.boundary.end);
    });

    it('надсилає лист на email із правильною темою і своїм шаблоном', async () => {
        queueResult('profiles', {
            data: [{ email: 'a@example.com', access_until: c.range.start }],
            error: null,
        });
        const result = await c.run(TOMORROW);
        expect(result).toEqual({ sent: 1 });
        expect(mocks.renderTemplate).toHaveBeenCalledTimes(1);
        const renderArgs = mocks.renderTemplate.mock.calls[0];
        expect(renderArgs[0]).toMatch(c.templateMatcher);
        expect(renderArgs[1]).toEqual(c.templateVars);
        expect(mocks.sendEmail).toHaveBeenCalledWith('a@example.com', c.subject, '<html>letter</html>');
    });

    it('надсилає окремий лист кожному користувачеві', async () => {
        queueResult('profiles', {
            data: [{ email: 'a@example.com' }, { email: 'b@example.com' }],
            error: null,
        });
        const result = await c.run(TOMORROW);
        expect(result.sent).toBe(2);
        expect(mocks.sendEmail.mock.calls.map((call) => call[0])).toEqual([
            'a@example.com',
            'b@example.com',
        ]);
    });

    it('пропускає профілі без email', async () => {
        queueResult('profiles', {
            data: [{ email: null }, { email: '' }, { email: 'b@example.com' }],
            error: null,
        });
        const result = await c.run(TOMORROW);
        expect(result).toEqual({ sent: 1 });
        expect(mocks.sendEmail).toHaveBeenCalledTimes(1);
        expect(mocks.sendEmail).toHaveBeenCalledWith('b@example.com', c.subject, expect.any(String));
    });

    it('рахує лише листи, які реально надіслано (sendEmail = true)', async () => {
        mocks.sendEmail.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
        queueResult('profiles', {
            data: [{ email: 'a@example.com' }, { email: 'b@example.com' }],
            error: null,
        });
        const result = await c.run(TOMORROW);
        expect(result).toEqual({ sent: 1 });
        expect(mocks.sendEmail).toHaveBeenCalledTimes(2);
    });

    it('не надсилає нічого, коли користувачів немає або data = null', async () => {
        queueResult('profiles', { data: [], error: null });
        expect(await c.run(TOMORROW)).toEqual({ sent: 0 });
        queueResult('profiles', { data: null, error: null });
        expect(await c.run(TOMORROW)).toEqual({ sent: 0 });
        expect(mocks.sendEmail).not.toHaveBeenCalled();
    });

    it('при помилці запиту повертає назву помилки, пише в лог і нічого не надсилає', async () => {
        queueResult('profiles', { data: null, error: new Error('db down') });
        expect(await c.run(TOMORROW)).toEqual({ sent: 0, error: c.errorName });
        expect(console.error).toHaveBeenCalled();
        expect(mocks.sendEmail).not.toHaveBeenCalled();
    });
});

// ---------------------------------------------------------------------------
// Реактивація неактивних: останній вхід рівно 14 днів тому.
// Для TOMORROW = 2026-11-22: сьогодні - 14 днів = 2026-11-07, діапазон
// [2026-11-07T00:00:00.000Z, 2026-11-08T00:00:00.000Z). Користувачі читаються
// сторінками по 1000.
// ---------------------------------------------------------------------------
describe('checkInactiveReactivation (реактивація неактивних)', () => {
    const IN_RANGE = '2026-11-07T10:00:00.123456Z';
    const OUT_OF_RANGE = '2026-11-01T10:00:00.000Z';

    function user(email: string | null, lastSignIn: string | null) {
        return { email, last_sign_in_at: lastSignIn };
    }
    function page(users: unknown[]) {
        return { data: { users }, error: null };
    }
    function filler(count: number) {
        return Array.from({ length: count }, (_, i) => user(`f${i}@example.com`, '2026-01-01T00:00:00Z'));
    }

    beforeEach(() => {
        mocks.listUsers.mockReset();
        mocks.listUsers.mockResolvedValue(page([]));
        mocks.sendEmail.mockResolvedValue(true);
        mocks.renderTemplate.mockReturnValue('<html>letter</html>');
    });

    it('запитує першу сторінку по 1000 користувачів', async () => {
        await checkInactiveReactivation(TOMORROW);
        expect(mocks.listUsers).toHaveBeenCalledTimes(1);
        expect(mocks.listUsers).toHaveBeenCalledWith({ page: 1, perPage: 1000 });
    });

    it('надсилає лист тому, хто востаннє заходив 14 днів тому, зі своїм шаблоном і темою', async () => {
        mocks.listUsers.mockResolvedValue(page([user('a@example.com', IN_RANGE)]));
        const result = await checkInactiveReactivation(TOMORROW);
        expect(result).toEqual({ sent: 1 });
        expect(mocks.renderTemplate).toHaveBeenCalledWith('lyst-reaktyvatsiya_neaktyvnykh.html');
        expect(mocks.sendEmail).toHaveBeenCalledWith('a@example.com', 'Давно вас не бачили', '<html>letter</html>');
    });

    it('не надсилає тим, хто заходив раніше або пізніше за цю добу', async () => {
        mocks.listUsers.mockResolvedValue(
            page([
                user('old@example.com', OUT_OF_RANGE),
                user('recent@example.com', '2026-11-15T10:00:00.000Z'),
            ])
        );
        expect(await checkInactiveReactivation(TOMORROW)).toEqual({ sent: 0 });
        expect(mocks.sendEmail).not.toHaveBeenCalled();
    });

    it('межі доби: початок входить, кінець не входить, однаково для формату зі знаком Z', async () => {
        mocks.listUsers.mockResolvedValue(
            page([
                user('start@example.com', '2026-11-07T00:00:00.000Z'),
                user('start-z@example.com', '2026-11-07T00:00:00Z'),
                user('last-ms@example.com', '2026-11-07T23:59:59.999999Z'),
                user('end@example.com', '2026-11-08T00:00:00.000Z'),
                user('end-z@example.com', '2026-11-08T00:00:00Z'),
                user('before@example.com', '2026-11-06T23:59:59.999Z'),
            ])
        );
        const result = await checkInactiveReactivation(TOMORROW);
        expect(result.sent).toBe(3);
        expect(mocks.sendEmail.mock.calls.map((call) => call[0])).toEqual([
            'start@example.com',
            'start-z@example.com',
            'last-ms@example.com',
        ]);
    });

    it('діапазон коректний через межу року', async () => {
        mocks.listUsers.mockResolvedValue(
            page([
                user('in@example.com', '2026-12-21T12:00:00.000Z'),
                user('out@example.com', '2026-11-07T12:00:00.000Z'),
            ])
        );
        const result = await checkInactiveReactivation('2027-01-05');
        expect(result.sent).toBe(1);
        expect(mocks.sendEmail).toHaveBeenCalledWith('in@example.com', expect.any(String), expect.any(String));
    });

    it('пропускає користувачів без email або без дати останнього входу', async () => {
        mocks.listUsers.mockResolvedValue(
            page([
                user(null, IN_RANGE),
                user('', IN_RANGE),
                user('never@example.com', null),
                user('ok@example.com', IN_RANGE),
            ])
        );
        const result = await checkInactiveReactivation(TOMORROW);
        expect(result).toEqual({ sent: 1 });
        expect(mocks.sendEmail).toHaveBeenCalledTimes(1);
    });

    it('рахує лише листи, які реально надіслано', async () => {
        mocks.sendEmail.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
        mocks.listUsers.mockResolvedValue(
            page([user('a@example.com', IN_RANGE), user('b@example.com', IN_RANGE)])
        );
        expect(await checkInactiveReactivation(TOMORROW)).toEqual({ sent: 1 });
        expect(mocks.sendEmail).toHaveBeenCalledTimes(2);
    });

    it('не запитує другу сторінку, коли перша неповна', async () => {
        mocks.listUsers.mockResolvedValue(page(filler(999)));
        await checkInactiveReactivation(TOMORROW);
        expect(mocks.listUsers).toHaveBeenCalledTimes(1);
    });

    it('проходить кілька сторінок і рахує підходящих користувачів з усіх', async () => {
        const first = filler(1000);
        first[5] = user('first-page@example.com', IN_RANGE);
        mocks.listUsers
            .mockResolvedValueOnce(page(first))
            .mockResolvedValueOnce(page([user('second-page@example.com', IN_RANGE)]));
        const result = await checkInactiveReactivation(TOMORROW);
        expect(result).toEqual({ sent: 2 });
        expect(mocks.listUsers).toHaveBeenCalledTimes(2);
        expect(mocks.listUsers).toHaveBeenNthCalledWith(1, { page: 1, perPage: 1000 });
        expect(mocks.listUsers).toHaveBeenNthCalledWith(2, { page: 2, perPage: 1000 });
    });

    it('зупиняється на порожній сторінці після повної', async () => {
        mocks.listUsers.mockResolvedValueOnce(page(filler(1000))).mockResolvedValueOnce(page([]));
        await checkInactiveReactivation(TOMORROW);
        expect(mocks.listUsers).toHaveBeenCalledTimes(2);
    });

    it('при помилці першої сторінки повертає inactiveReactivation і нічого не надсилає', async () => {
        mocks.listUsers.mockResolvedValue({ data: null, error: new Error('auth down') });
        expect(await checkInactiveReactivation(TOMORROW)).toEqual({ sent: 0, error: 'inactiveReactivation' });
        expect(console.error).toHaveBeenCalled();
        expect(mocks.sendEmail).not.toHaveBeenCalled();
    });

    it('при помилці другої сторінки повертає вже надіслане разом із помилкою', async () => {
        const first = filler(1000);
        first[0] = user('first-page@example.com', IN_RANGE);
        mocks.listUsers
            .mockResolvedValueOnce(page(first))
            .mockResolvedValueOnce({ data: null, error: new Error('auth down') });
        expect(await checkInactiveReactivation(TOMORROW)).toEqual({ sent: 1, error: 'inactiveReactivation' });
    });
});

// ---------------------------------------------------------------------------
// Зважування: дата останнього зважування + reminder_days = завтра.
// Для TOMORROW = 2026-11-22 (пораховано вручну):
//   reminder_days 7  -> останнє зважування 2026-11-15
//   reminder_days 14 -> останнє зважування 2026-11-08
// ---------------------------------------------------------------------------
describe('checkWeighing (зважування)', () => {
    const rabbit = (over: Record<string, unknown> = {}) => ({
        id: 'r1',
        name: 'Белла',
        cage_number: '5',
        user_id: 'u1',
        reminder_days: 7,
        ...over,
    });
    const cage = (over: Record<string, unknown> = {}) => ({
        id: 'f1',
        cage_number: '7',
        user_id: 'u2',
        reminder_days: 14,
        ...over,
    });
    const weighing = (date: string, over: Record<string, unknown> = {}) => ({
        weighing_date: date,
        rabbit_id: null,
        fattening_id: null,
        ...over,
    });

    function setup(
        rabbits: Record<string, unknown>[],
        fattening: Record<string, unknown>[],
        weighings: Record<string, unknown>[]
    ) {
        queueResult('rabbits', { data: rabbits, error: null });
        queueResult('fattening', { data: fattening, error: null });
        queueResult('weighings', { data: weighings, error: null });
    }

    it('запитує активних кроликів і клітки відгодівлі з заданим reminder_days, потім зважування', async () => {
        setup([rabbit()], [cage()], []);
        await checkWeighing(TOMORROW);
        expect(mocks.log.map((entry) => entry.table)).toEqual(['rabbits', 'fattening', 'weighings']);
        for (const entry of mocks.log.slice(0, 2)) {
            expect(entry.calls).toContainEqual({ method: 'eq', args: ['is_active', true] });
            expect(entry.calls).toContainEqual({ method: 'not', args: ['reminder_days', 'is', null] });
        }
    });

    it('надсилає push за кроликом, коли минуло рівно reminder_days від останнього зважування', async () => {
        setup([rabbit()], [], [weighing('2026-11-15', { rabbit_id: 'r1' })]);
        const result = await checkWeighing(TOMORROW);
        expect(result).toEqual({ sent: 1 });
        expect(mocks.sendToUser).toHaveBeenCalledWith(
            'u1',
            expect.stringContaining('Час зважити'),
            'Белла (кл.5) — час чергового зважування.',
            '/weighing'
        );
    });

    it('для кролика без номера клітки пише лише ім\'я', async () => {
        setup([rabbit({ cage_number: null })], [], [weighing('2026-11-15', { rabbit_id: 'r1' })]);
        await checkWeighing(TOMORROW);
        expect(mocks.sendToUser).toHaveBeenCalledWith(
            'u1',
            expect.any(String),
            'Белла — час чергового зважування.',
            '/weighing'
        );
    });

    it('надсилає push за кліткою відгодівлі', async () => {
        setup([], [cage()], [weighing('2026-11-08', { fattening_id: 'f1' })]);
        const result = await checkWeighing(TOMORROW);
        expect(result).toEqual({ sent: 1 });
        expect(mocks.sendToUser).toHaveBeenCalledWith(
            'u2',
            expect.stringContaining('Час зважити'),
            'Клітка 7 — час чергового зважування.',
            '/weighing'
        );
    });

    it('для клітки відгодівлі без номера підставляє «?»', async () => {
        setup([], [cage({ cage_number: null })], [weighing('2026-11-08', { fattening_id: 'f1' })]);
        await checkWeighing(TOMORROW);
        expect(mocks.sendToUser).toHaveBeenCalledWith(
            'u2',
            expect.any(String),
            'Клітка ? — час чергового зважування.',
            '/weighing'
        );
    });

    it('не надсилає за день до і за день після потрібної дати', async () => {
        setup(
            [rabbit({ id: 'r1' }), rabbit({ id: 'r2' })],
            [],
            [
                weighing('2026-11-14', { rabbit_id: 'r1' }),
                weighing('2026-11-16', { rabbit_id: 'r2' }),
            ]
        );
        expect(await checkWeighing(TOMORROW)).toEqual({ sent: 0 });
        expect(mocks.sendToUser).not.toHaveBeenCalled();
    });

    it('рахує від найновішого зважування, незалежно від порядку записів', async () => {
        setup(
            [rabbit()],
            [],
            [
                weighing('2026-11-15', { rabbit_id: 'r1' }),
                weighing('2026-10-01', { rabbit_id: 'r1' }),
            ]
        );
        expect(await checkWeighing(TOMORROW)).toEqual({ sent: 1 });
    });

    it('старіше зважування саме по собі не дає сповіщення, якщо є новіше', async () => {
        setup(
            [rabbit()],
            [],
            [
                weighing('2026-11-15', { rabbit_id: 'r1' }),
                weighing('2026-11-20', { rabbit_id: 'r1' }),
            ]
        );
        expect(await checkWeighing(TOMORROW)).toEqual({ sent: 0 });
    });

    it('пропускає кролика, який ще жодного разу не зважувався', async () => {
        setup([rabbit()], [cage()], []);
        expect(await checkWeighing(TOMORROW)).toEqual({ sent: 0 });
        expect(mocks.sendToUser).not.toHaveBeenCalled();
    });

    it('пропускає запис із reminder_days = 0', async () => {
        setup([rabbit({ reminder_days: 0 })], [], [weighing('2026-11-22', { rabbit_id: 'r1' })]);
        expect(await checkWeighing(TOMORROW)).toEqual({ sent: 0 });
    });

    it('обробляє кроликів і клітки відгодівлі в одному запуску, кожному своєму власнику', async () => {
        setup(
            [rabbit()],
            [cage()],
            [
                weighing('2026-11-15', { rabbit_id: 'r1' }),
                weighing('2026-11-08', { fattening_id: 'f1' }),
            ]
        );
        const result = await checkWeighing(TOMORROW);
        expect(result).toEqual({ sent: 2 });
        expect(mocks.sendToUser.mock.calls.map((call) => call[0])).toEqual(['u1', 'u2']);
    });

    it('зважування з rabbit_id належить кролику, а не клітці відгодівлі', async () => {
        setup(
            [rabbit()],
            [cage({ reminder_days: 7 })],
            [weighing('2026-11-15', { rabbit_id: 'r1', fattening_id: 'f1' })]
        );
        const result = await checkWeighing(TOMORROW);
        expect(result).toEqual({ sent: 1 });
        expect(mocks.sendToUser.mock.calls[0][0]).toBe('u1');
    });

    it('однакові id у кроликів і в клітках відгодівлі не змішуються', async () => {
        setup(
            [rabbit({ id: 'x' })],
            [cage({ id: 'x', reminder_days: 14 })],
            [
                weighing('2026-11-15', { rabbit_id: 'x' }),
                weighing('2026-11-08', { fattening_id: 'x' }),
            ]
        );
        expect(await checkWeighing(TOMORROW)).toEqual({ sent: 2 });
    });

    it('без записів з нагадуванням не робить запит зважувань', async () => {
        setup([], [], []);
        expect(await checkWeighing(TOMORROW)).toEqual({ sent: 0 });
        expect(mocks.log.map((entry) => entry.table)).toEqual(['rabbits', 'fattening']);
    });

    it('якщо є лише кролики або лише клітки, запит зважувань виконується', async () => {
        setup([rabbit()], [], []);
        await checkWeighing(TOMORROW);
        expect(mocks.log.map((entry) => entry.table)).toContain('weighings');
    });

    it('зважування з data = null вважаються відсутніми', async () => {
        queueResult('rabbits', { data: [rabbit()], error: null });
        queueResult('fattening', { data: [], error: null });
        queueResult('weighings', { data: null, error: null });
        expect(await checkWeighing(TOMORROW)).toEqual({ sent: 0 });
    });

    it('при помилці запиту кроликів повертає reminderRabbits і не робить інші запити', async () => {
        queueResult('rabbits', { data: null, error: new Error('db down') });
        expect(await checkWeighing(TOMORROW)).toEqual({ sent: 0, error: 'reminderRabbits' });
        expect(mocks.log.map((entry) => entry.table)).toEqual(['rabbits']);
        expect(console.error).toHaveBeenCalled();
    });

    it('при помилці запиту відгодівлі повертає reminderFattening і не запитує зважування', async () => {
        queueResult('rabbits', { data: [rabbit()], error: null });
        queueResult('fattening', { data: null, error: new Error('db down') });
        expect(await checkWeighing(TOMORROW)).toEqual({ sent: 0, error: 'reminderFattening' });
        expect(mocks.log.map((entry) => entry.table)).toEqual(['rabbits', 'fattening']);
    });

    it('при помилці запиту зважувань повертає weighings і нічого не надсилає', async () => {
        queueResult('rabbits', { data: [rabbit()], error: null });
        queueResult('fattening', { data: [], error: null });
        queueResult('weighings', { data: null, error: new Error('db down') });
        expect(await checkWeighing(TOMORROW)).toEqual({ sent: 0, error: 'weighings' });
        expect(mocks.sendToUser).not.toHaveBeenCalled();
    });
});

// ---------------------------------------------------------------------------
// Ліміт поголів'я: лист платним користувачам при 90+ і при 100+ голів.
// Рівень останнього листа зберігається в profiles.herd_notice_level, щоб лист
// не йшов щодня. Порядок запитів до profiles: список, потім "займання" рівня
// (update ... select), за потреби повернення рівня назад.
// ---------------------------------------------------------------------------
describe('checkHerdLimit (ліміт поголів\'я)', () => {
    function profile(id: string, level: number, email: string | null = `${id}@example.com`) {
        return { id, email, herd_notice_level: level };
    }
    function counts(rows: { uid: string; herd_count: number }[]) {
        mocks.rpc.mockResolvedValue({ data: rows, error: null });
    }
    const CLAIMED = { data: [{ id: 'x' }], error: null };

    beforeEach(() => {
        mocks.rpc.mockReset();
        counts([]);
        mocks.sendEmail.mockResolvedValue(true);
        mocks.renderTemplate.mockReturnValue('<html>letter</html>');
    });

    it('запитує підрахунок голів і лише платних користувачів', async () => {
        queueResult('profiles', { data: [], error: null });
        await checkHerdLimit();
        expect(mocks.rpc).toHaveBeenCalledWith('get_herd_counts_for_cron');
        expect(mocks.log[0].table).toBe('profiles');
        expect(mocks.log[0].calls).toContainEqual({ method: 'eq', args: ['plan_type', 'paid'] });
    });

    it('при 90 голів надсилає лист "наближаєтесь" і записує рівень 1', async () => {
        counts([{ uid: 'u1', herd_count: 90 }]);
        queueResult('profiles', { data: [profile('u1', 0)], error: null });
        queueResult('profiles', CLAIMED);
        const result = await checkHerdLimit();
        expect(result).toEqual({ sent: 1 });
        expect(mocks.renderTemplate).toHaveBeenCalledWith('lyst-limit-nablyzhennya.html', { HERD: '90' });
        expect(mocks.sendEmail).toHaveBeenCalledWith(
            'u1@example.com',
            'Ваше господарство наближається до 100 голів',
            '<html>letter</html>'
        );
        expect(mocks.log[1].calls).toContainEqual({ method: 'update', args: [{ herd_notice_level: 1 }] });
    });

    it('рівно 100 голів ще вважається "наближаєтесь", а 101 вже "перевищило"', async () => {
        counts([
            { uid: 'u1', herd_count: 100 },
            { uid: 'u2', herd_count: 101 },
        ]);
        queueResult('profiles', { data: [profile('u1', 0), profile('u2', 0)], error: null });
        queueResult('profiles', CLAIMED);
        queueResult('profiles', CLAIMED);
        expect(await checkHerdLimit()).toEqual({ sent: 2 });
        expect(mocks.renderTemplate).toHaveBeenNthCalledWith(1, 'lyst-limit-nablyzhennya.html', { HERD: '100' });
        expect(mocks.renderTemplate).toHaveBeenNthCalledWith(2, 'lyst-limit-perevyshcheno.html', { HERD: '101' });
        expect(mocks.sendEmail).toHaveBeenNthCalledWith(
            2,
            'u2@example.com',
            "Ваше поголів'я перевищило 100 голів",
            '<html>letter</html>'
        );
    });

    it('не надсилає нижче 90 голів, а також нікому без підрахунку', async () => {
        counts([{ uid: 'u1', herd_count: 89 }]);
        queueResult('profiles', { data: [profile('u1', 0), profile('u2', 0)], error: null });
        expect(await checkHerdLimit()).toEqual({ sent: 0 });
        expect(mocks.sendEmail).not.toHaveBeenCalled();
    });

    it('не повторює лист, якщо цей рівень уже надсилали', async () => {
        counts([
            { uid: 'u1', herd_count: 95 },
            { uid: 'u2', herd_count: 150 },
        ]);
        queueResult('profiles', { data: [profile('u1', 1), profile('u2', 2)], error: null });
        expect(await checkHerdLimit()).toEqual({ sent: 0 });
        expect(mocks.sendEmail).not.toHaveBeenCalled();
    });

    it('при зростанні з рівня 1 до перевищення надсилає другий лист', async () => {
        counts([{ uid: 'u1', herd_count: 120 }]);
        queueResult('profiles', { data: [profile('u1', 1)], error: null });
        queueResult('profiles', CLAIMED);
        expect(await checkHerdLimit()).toEqual({ sent: 1 });
        expect(mocks.renderTemplate).toHaveBeenCalledWith('lyst-limit-perevyshcheno.html', { HERD: '120' });
        expect(mocks.log[1].calls).toContainEqual({ method: 'eq', args: ['herd_notice_level', 1] });
    });

    it('якщо рівень уже "зайняв" інший запуск (0 оновлених рядків), лист не надсилає', async () => {
        counts([{ uid: 'u1', herd_count: 95 }]);
        queueResult('profiles', { data: [profile('u1', 0)], error: null });
        queueResult('profiles', { data: [], error: null });
        expect(await checkHerdLimit()).toEqual({ sent: 0 });
        expect(mocks.sendEmail).not.toHaveBeenCalled();
    });

    it('якщо лист не надіслався, повертає рівень назад, щоб спробувати завтра', async () => {
        counts([{ uid: 'u1', herd_count: 95 }]);
        mocks.sendEmail.mockResolvedValue(false);
        queueResult('profiles', { data: [profile('u1', 0)], error: null });
        queueResult('profiles', CLAIMED);
        expect(await checkHerdLimit()).toEqual({ sent: 0 });
        expect(mocks.log[2].calls).toContainEqual({ method: 'update', args: [{ herd_notice_level: 0 }] });
    });

    it('скидає рівень у 0, коли поголів\'я впало нижче 80, і лист не надсилає', async () => {
        counts([{ uid: 'u1', herd_count: 70 }]);
        queueResult('profiles', { data: [profile('u1', 2)], error: null });
        expect(await checkHerdLimit()).toEqual({ sent: 0 });
        expect(mocks.log[1].calls).toContainEqual({ method: 'update', args: [{ herd_notice_level: 0 }] });
        expect(mocks.sendEmail).not.toHaveBeenCalled();
    });

    it('пропускає користувача без email', async () => {
        counts([{ uid: 'u1', herd_count: 95 }]);
        queueResult('profiles', { data: [profile('u1', 0, null)], error: null });
        expect(await checkHerdLimit()).toEqual({ sent: 0 });
        expect(mocks.sendEmail).not.toHaveBeenCalled();
    });

    it('при помилці підрахунку повертає herdLimit, пише в лог і не запитує профілі', async () => {
        mocks.rpc.mockResolvedValue({ data: null, error: new Error('rpc down') });
        expect(await checkHerdLimit()).toEqual({ sent: 0, error: 'herdLimit' });
        expect(console.error).toHaveBeenCalled();
        expect(mocks.log).toHaveLength(0);
    });

    it('при помилці запиту профілів повертає herdLimit і нічого не надсилає', async () => {
        queueResult('profiles', { data: null, error: new Error('db down') });
        expect(await checkHerdLimit()).toEqual({ sent: 0, error: 'herdLimit' });
        expect(mocks.sendEmail).not.toHaveBeenCalled();
    });
});