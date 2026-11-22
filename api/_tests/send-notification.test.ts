// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { VercelRequest, VercelResponse } from '@vercel/node';

type QueryResult = { data: unknown; error: { message: string } | null };

const mocks = vi.hoisted(() => ({
    from: vi.fn(),
    select: vi.fn(),
    eq: vi.fn(),
    sendNotification: vi.fn(),
    removeExpiredSubscription: vi.fn(),
    state: { result: { data: [], error: null } as { data: unknown; error: { message: string } | null } },
}));

// Конструктор запиту: .select('*') -> (необов'язково) .eq(...) -> await дає state.result
function makeQuery() {
    const query = {
        eq(column: string, value: unknown) {
            mocks.eq(column, value);
            return query;
        },
        then(resolve: (v: QueryResult) => unknown, reject: (e: unknown) => unknown) {
            return Promise.resolve(mocks.state.result).then(resolve, reject);
        },
    };
    return query;
}

vi.mock('../_lib/push.js', () => ({
    supabase: {
        from: (table: string) => {
            mocks.from(table);
            return {
                select: (columns: string) => {
                    mocks.select(columns);
                    return makeQuery();
                },
            };
        },
    },
    webpush: { sendNotification: mocks.sendNotification },
    WebPushError: class WebPushError extends Error {},
    removeExpiredSubscription: mocks.removeExpiredSubscription,
}));

import handler from '../send-notification';

function makeReq(opts: { method?: string; secret?: string; body?: unknown }): VercelRequest {
    return {
        method: opts.method ?? 'POST',
        headers: opts.secret ? { 'x-push-secret': opts.secret } : {},
        body: opts.body,
    } as unknown as VercelRequest;
}

function makeRes() {
    const res = {
        statusCode: 0,
        body: undefined as unknown,
        status(code: number) {
            res.statusCode = code;
            return res;
        },
        json(payload: unknown) {
            res.body = payload;
            return res;
        },
        end() {
            return res;
        },
    };
    return res;
}

async function call(req: VercelRequest) {
    const res = makeRes();
    await handler(req, res as unknown as VercelResponse);
    return res;
}

const sub = (id: string) => ({
    id,
    endpoint: `https://push.example/${id}`,
    p256dh: `p256dh-${id}`,
    auth: `auth-${id}`,
});

const payload = { title: 'Заголовок', body: 'Текст', url: '/matings' };
const validReq = (extra: Record<string, unknown> = {}) =>
    makeReq({ secret: 'push-secret', body: { ...payload, ...extra } });

describe('send-notification', () => {
    const originalSecret = process.env.PUSH_SEND_SECRET;

    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, 'error').mockImplementation(() => {});
        process.env.PUSH_SEND_SECRET = 'push-secret';
        mocks.state.result = { data: [sub('s1'), sub('s2')], error: null };
        mocks.sendNotification.mockResolvedValue(undefined);
        mocks.removeExpiredSubscription.mockResolvedValue(undefined);
    });

    afterEach(() => {
        if (originalSecret === undefined) delete process.env.PUSH_SEND_SECRET;
        else process.env.PUSH_SEND_SECRET = originalSecret;
    });

    describe('доступ', () => {
        it('відповідає 405 на не-POST запит', async () => {
            const res = await call(makeReq({ method: 'GET', secret: 'push-secret', body: payload }));
            expect(res.statusCode).toBe(405);
            expect(mocks.sendNotification).not.toHaveBeenCalled();
        });

        it('відповідає 401, коли секрет відсутній, неправильний або не заданий на сервері', async () => {
            expect((await call(makeReq({ body: payload }))).statusCode).toBe(401);
            expect((await call(makeReq({ secret: 'wrong', body: payload }))).statusCode).toBe(401);
            delete process.env.PUSH_SEND_SECRET;
            expect((await call(validReq())).statusCode).toBe(401);
            expect(mocks.select).not.toHaveBeenCalled();
            expect(mocks.sendNotification).not.toHaveBeenCalled();
        });
    });

    describe('вибір отримувачів', () => {
        it('без userId бере підписки всіх користувачів', async () => {
            await call(validReq());
            expect(mocks.from).toHaveBeenCalledWith('push_subscriptions');
            expect(mocks.select).toHaveBeenCalledWith('*');
            expect(mocks.eq).not.toHaveBeenCalled();
            expect(mocks.sendNotification).toHaveBeenCalledTimes(2);
        });

        it('з userId фільтрує підписки за цим користувачем', async () => {
            await call(validReq({ userId: 'user-42' }));
            expect(mocks.eq).toHaveBeenCalledWith('user_id', 'user-42');
        });

        it('при помилці запиту відповідає 500 з текстом помилки і нічого не надсилає', async () => {
            mocks.state.result = { data: null, error: { message: 'db down' } };
            const res = await call(validReq());
            expect(res.statusCode).toBe(500);
            expect(res.body).toEqual({ error: 'db down' });
            expect(mocks.sendNotification).not.toHaveBeenCalled();
        });
    });

    describe('надсилання', () => {
        it('передає в webpush дані підписки і JSON із заголовком, текстом та посиланням', async () => {
            mocks.state.result = { data: [sub('s1')], error: null };
            await call(validReq());
            expect(mocks.sendNotification).toHaveBeenCalledWith(
                { endpoint: 'https://push.example/s1', keys: { p256dh: 'p256dh-s1', auth: 'auth-s1' } },
                JSON.stringify(payload)
            );
        });

        it('відповідає 200 і рахує успішно доставлені сповіщення', async () => {
            const res = await call(validReq());
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ sent: 2 });
        });

        it('невдале сповіщення не зупиняє інші і не рахується в sent', async () => {
            mocks.sendNotification
                .mockRejectedValueOnce(Object.assign(new Error('fail'), { statusCode: 500 }))
                .mockResolvedValueOnce(undefined);
            const res = await call(validReq());
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ sent: 1 });
            expect(mocks.sendNotification).toHaveBeenCalledTimes(2);
        });

        it('для кожного невдалого сповіщення передає id підписки і код відповіді на очищення', async () => {
            mocks.sendNotification
                .mockResolvedValueOnce(undefined)
                .mockRejectedValueOnce(Object.assign(new Error('gone'), { statusCode: 410 }));
            await call(validReq());
            expect(mocks.removeExpiredSubscription).toHaveBeenCalledTimes(1);
            expect(mocks.removeExpiredSubscription).toHaveBeenCalledWith('s2', 410);
        });

        it('не чіпає підписки, коли всі сповіщення успішні', async () => {
            await call(validReq());
            expect(mocks.removeExpiredSubscription).not.toHaveBeenCalled();
        });

        it('повертає sent: 0, коли підписок немає або data = null', async () => {
            mocks.state.result = { data: [], error: null };
            expect((await call(validReq())).body).toEqual({ sent: 0 });
            mocks.state.result = { data: null, error: null };
            expect((await call(validReq())).body).toEqual({ sent: 0 });
            expect(mocks.sendNotification).not.toHaveBeenCalled();
        });

    });

    describe('перевірка тіла запиту', () => {
        it.each([
            ['тіло відсутнє', undefined],
            ['тіло null', null],
            ['тіло не об\'єкт', 'рядок'],
            ['порожній об\'єкт', {}],
        ])('%s: 400 і нічого не надсилається', async (_name, body) => {
            const res = await call(makeReq({ secret: 'push-secret', body }));
            expect(res.statusCode).toBe(400);
            expect(mocks.select).not.toHaveBeenCalled();
            expect(mocks.sendNotification).not.toHaveBeenCalled();
        });

        it.each([
            ['title: undefined', { title: undefined }, 'title is required'],
            ['title: порожній', { title: '' }, 'title is required'],
            ['title: лише пробіли', { title: '   ' }, 'title is required'],
            ['title: число', { title: 5 }, 'title is required'],
            ['body: undefined', { body: undefined }, 'body is required'],
            ['body: порожній', { body: '' }, 'body is required'],
            ['body: лише пробіли', { body: '  ' }, 'body is required'],
            ['body: масив', { body: ['a'] }, 'body is required'],
        ])('%s: 400 з поясненням', async (_name, extra, message) => {
            const res = await call(validReq(extra));
            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({ error: message });
            expect(mocks.sendNotification).not.toHaveBeenCalled();
        });

        it('title довший за 100 символів відхиляється, рівно 100 проходить', async () => {
            expect((await call(validReq({ title: 'a'.repeat(101) }))).statusCode).toBe(400);
            expect((await call(validReq({ title: 'a'.repeat(100) }))).statusCode).toBe(200);
        });

        it('body довший за 500 символів відхиляється, рівно 500 проходить', async () => {
            expect((await call(validReq({ body: 'a'.repeat(501) }))).statusCode).toBe(400);
            expect((await call(validReq({ body: 'a'.repeat(500) }))).statusCode).toBe(200);
        });

        it.each(['/', '/matings', '/matings?tab=1', 'https://example.com/page'])(
            'url «%s» дозволений',
            async (url) => {
                const res = await call(validReq({ url }));
                expect(res.statusCode).toBe(200);
            }
        );

        it.each([
            'javascript:alert(1)',
            'data:text/html,<script>1</script>',
            'http://example.com',
            '//evil.example.com',
            'matings',
            '',
            42,
            { a: 1 },
        ])('url %j відхиляється', async (url) => {
            const res = await call(validReq({ url }));
            expect(res.statusCode).toBe(400);
            expect(mocks.sendNotification).not.toHaveBeenCalled();
        });

        it('занадто довгий url відхиляється', async () => {
            const res = await call(validReq({ url: '/' + 'a'.repeat(500) }));
            expect(res.statusCode).toBe(400);
        });

        it('url можна не вказувати: у сповіщення йдуть лише title і body', async () => {
            mocks.state.result = { data: [sub('s1')], error: null };
            const res = await call(makeReq({ secret: 'push-secret', body: { title: 'T', body: 'B' } }));
            expect(res.statusCode).toBe(200);
            expect(mocks.sendNotification).toHaveBeenCalledWith(expect.anything(), JSON.stringify({ title: 'T', body: 'B' }));
        });

        it.each([5, '', {}, []])('userId %j відхиляється', async (userId) => {
            const res = await call(validReq({ userId }));
            expect(res.statusCode).toBe(400);
            expect(mocks.select).not.toHaveBeenCalled();
        });

        it('userId: null означає «усім»', async () => {
            const res = await call(validReq({ userId: null }));
            expect(res.statusCode).toBe(200);
            expect(mocks.eq).not.toHaveBeenCalled();
        });

        it('зайві поля в тілі не потрапляють у сповіщення', async () => {
            mocks.state.result = { data: [sub('s1')], error: null };
            await call(validReq({ admin: true, extra: 'x' }));
            expect(mocks.sendNotification).toHaveBeenCalledWith(expect.anything(), JSON.stringify(payload));
        });

        it('перевірка секрету іде раніше за перевірку тіла', async () => {
            const res = await call(makeReq({ secret: 'wrong', body: {} }));
            expect(res.statusCode).toBe(401);
        });
    });

    describe('несподівані збої', () => {
        it('якщо звернення до бази кидає виняток, відповідає 500 без деталей і нічого не надсилає', async () => {
            mocks.from.mockImplementationOnce(() => {
                throw new Error('network down');
            });
            const res = await call(validReq());
            expect(res.statusCode).toBe(500);
            expect(res.body).toEqual({ error: 'Internal error' });
            expect(mocks.sendNotification).not.toHaveBeenCalled();
            expect(console.error).toHaveBeenCalled();
        });
    });
});
