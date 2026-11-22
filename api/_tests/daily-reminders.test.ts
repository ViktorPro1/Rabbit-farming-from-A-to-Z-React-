// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const mocks = vi.hoisted(() => ({
    tomorrowDate: vi.fn(),
    checkA: vi.fn(),
    checkB: vi.fn(),
    checkC: vi.fn(),
}));

vi.mock('../_lib/dates.js', () => ({ tomorrowDate: mocks.tomorrowDate }));
vi.mock('../_lib/reminders.js', () => ({
    ALL_CHECKS: [mocks.checkA, mocks.checkB, mocks.checkC],
}));

import handler from '../daily-reminders';

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

    describe('несподівані виключення в перевірках', () => {
        it('перевірка, що кинула виняток, не зупиняє наступні', async () => {
            mocks.checkA.mockRejectedValue(new Error('network down'));
            mocks.checkB.mockResolvedValue({ sent: 2 });
            mocks.checkC.mockResolvedValue({ sent: 3 });
            const res = await call(makeReq({ secret: 'cron-secret' }));
            expect(mocks.checkB).toHaveBeenCalledWith('2026-11-21');
            expect(mocks.checkC).toHaveBeenCalledWith('2026-11-21');
            expect(res.statusCode).toBe(200);
            expect(res.body).toMatchObject({ sent: 5, date: '2026-11-21' });
        });

        it('додає назву проваленої перевірки до failedQueries', async () => {
            async function checkBroken(): Promise<{ sent: number }> {
                throw new Error('boom');
            }
            const checks = (await import('../_lib/reminders.js')).ALL_CHECKS;
            checks.splice(1, 1, checkBroken);
            const res = await call(makeReq({ secret: 'cron-secret' }));
            expect(res.body).toMatchObject({ failedQueries: ['checkBroken'] });
            checks.splice(1, 1, mocks.checkB);
        });

        it('для безіменної функції використовує порядковий номер', async () => {
            const checks = (await import('../_lib/reminders.js')).ALL_CHECKS;
            const anonymous = [async (): Promise<{ sent: number }> => { throw new Error('boom'); }][0];
            checks.splice(2, 1, anonymous);
            const res = await call(makeReq({ secret: 'cron-secret' }));
            expect(res.body).toMatchObject({ failedQueries: ['check#3'] });
            checks.splice(2, 1, mocks.checkC);
        });

        it('пише причину збою в лог', async () => {
            const error = new Error('network down');
            mocks.checkA.mockRejectedValue(error);
            await call(makeReq({ secret: 'cron-secret' }));
            expect(console.error).toHaveBeenCalledWith(expect.stringContaining('daily-reminders'), error);
        });

        it('збій і помилка запиту разом потрапляють в один список', async () => {
            mocks.checkA.mockRejectedValue(new Error('boom'));
            mocks.checkB.mockResolvedValue({ sent: 0, error: 'weighings' });
            const res = await call(makeReq({ secret: 'cron-secret' }));
            const failed = (res.body as { failedQueries: string[] }).failedQueries;
            expect(failed).toHaveLength(2);
            expect(failed).toContain('weighings');
        });

        it('якщо всі перевірки впали, відповідь усе одно 200 (cron не повторює розсилку)', async () => {
            for (const m of [mocks.checkA, mocks.checkB, mocks.checkC]) m.mockRejectedValue(new Error('x'));
            const res = await call(makeReq({ secret: 'cron-secret' }));
            expect(res.statusCode).toBe(200);
            expect(res.body).toMatchObject({ sent: 0 });
        });
    });
});
