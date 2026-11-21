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

vi.mock('./_lib/push.js', () => ({
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

import handler from './send-notification';

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

        it('не падає, коли тіло запиту порожнє', async () => {
            const res = await call(makeReq({ secret: 'push-secret' }));
            expect(res.statusCode).toBe(200);
        });
    });
});
