// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const mocks = vi.hoisted(() => ({
    tomorrowDate: vi.fn(),
    checkA: vi.fn(),
    checkB: vi.fn(),
    checkC: vi.fn(),
}));

vi.mock('./_lib/dates.js', () => ({ tomorrowDate: mocks.tomorrowDate }));
vi.mock('./_lib/reminders.js', () => ({
    ALL_CHECKS: [mocks.checkA, mocks.checkB, mocks.checkC],
}));

import handler from './daily-reminders';

function makeReq(opts: { method?: string; secret?: string }): VercelRequest {
    return {
        method: opts.method ?? 'POST',
        headers: opts.secret ? { 'x-push-secret': opts.secret } : {},
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

describe('daily-reminders', () => {
    const originalSecret = process.env.PUSH_SEND_SECRET;

    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, 'error').mockImplementation(() => {});
        process.env.PUSH_SEND_SECRET = 'cron-secret';
        mocks.tomorrowDate.mockReturnValue('2026-11-21');
        mocks.checkA.mockResolvedValue({ sent: 0 });
        mocks.checkB.mockResolvedValue({ sent: 0 });
        mocks.checkC.mockResolvedValue({ sent: 0 });
    });

    afterEach(() => {
        if (originalSecret === undefined) delete process.env.PUSH_SEND_SECRET;
        else process.env.PUSH_SEND_SECRET = originalSecret;
    });

    describe('доступ', () => {
        it('відповідає 405 на не-POST запит і не запускає перевірки', async () => {
            const res = await call(makeReq({ method: 'GET', secret: 'cron-secret' }));
            expect(res.statusCode).toBe(405);
            expect(mocks.checkA).not.toHaveBeenCalled();
        });

        it('відповідає 401, коли заголовок із секретом відсутній', async () => {
            const res = await call(makeReq({}));
            expect(res.statusCode).toBe(401);
            expect(mocks.checkA).not.toHaveBeenCalled();
        });

        it('відповідає 401 при неправильному секреті', async () => {
            const res = await call(makeReq({ secret: 'wrong-secret' }));
            expect(res.statusCode).toBe(401);
            expect(mocks.checkA).not.toHaveBeenCalled();
        });

        it('відповідає 401, коли секрет на сервері не заданий', async () => {
            delete process.env.PUSH_SEND_SECRET;
            const res = await call(makeReq({ secret: 'cron-secret' }));
            expect(res.statusCode).toBe(401);
            expect(mocks.checkA).not.toHaveBeenCalled();
        });
    });

    describe('запуск перевірок', () => {
        it('викликає кожну перевірку з датою завтрашнього дня', async () => {
            await call(makeReq({ secret: 'cron-secret' }));
            expect(mocks.checkA).toHaveBeenCalledWith('2026-11-21');
            expect(mocks.checkB).toHaveBeenCalledWith('2026-11-21');
            expect(mocks.checkC).toHaveBeenCalledWith('2026-11-21');
        });

        it('запускає перевірки по черзі у порядку списку', async () => {
            const order: string[] = [];
            mocks.checkA.mockImplementation(async () => {
                order.push('A');
                return { sent: 0 };
            });
            mocks.checkB.mockImplementation(async () => {
                order.push('B');
                return { sent: 0 };
            });
            mocks.checkC.mockImplementation(async () => {
                order.push('C');
                return { sent: 0 };
            });
            await call(makeReq({ secret: 'cron-secret' }));
            expect(order).toEqual(['A', 'B', 'C']);
        });

        it('сумує кількість надісланих і повертає дату', async () => {
            mocks.checkA.mockResolvedValue({ sent: 2 });
            mocks.checkB.mockResolvedValue({ sent: 0 });
            mocks.checkC.mockResolvedValue({ sent: 5 });
            const res = await call(makeReq({ secret: 'cron-secret' }));
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ sent: 7, date: '2026-11-21' });
        });

        it('не додає поле failedQueries, коли помилок немає', async () => {
            const res = await call(makeReq({ secret: 'cron-secret' }));
            expect(res.body).not.toHaveProperty('failedQueries');
        });

        it('збирає помилки перевірок у failedQueries і продовжує решту', async () => {
            mocks.checkA.mockResolvedValue({ sent: 1 });
            mocks.checkB.mockResolvedValue({ sent: 0, error: 'weighings' });
            mocks.checkC.mockResolvedValue({ sent: 3, error: 'trialEndingSoon' });
            const res = await call(makeReq({ secret: 'cron-secret' }));
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({
                sent: 4,
                date: '2026-11-21',
                failedQueries: ['weighings', 'trialEndingSoon'],
            });
            expect(mocks.checkC).toHaveBeenCalled();
        });
    });
});
