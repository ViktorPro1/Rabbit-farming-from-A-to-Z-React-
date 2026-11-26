// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const mocks = vi.hoisted(() => ({
    getUser: vi.fn(),
    maybeSingle: vi.fn(),
    sendEmail: vi.fn(),
    renderTemplate: vi.fn(),
    todayKyiv: vi.fn(),
}));

vi.mock('../_lib/push.js', () => ({
    supabase: {
        auth: { getUser: mocks.getUser },
        from: () => ({
            select: () => ({
                eq: () => ({ maybeSingle: mocks.maybeSingle }),
            }),
        }),
    },
}));
vi.mock('../_lib/email.js', () => ({ sendEmail: mocks.sendEmail }));
vi.mock('../_lib/email-templates.js', () => ({ renderTemplate: mocks.renderTemplate }));
vi.mock('../_lib/dates.js', () => ({ todayKyiv: mocks.todayKyiv }));

import handler from '../notify-payment-receipt';

function makeReq(opts: {
    method?: string;
    authorization?: string;
    body?: unknown;
}): VercelRequest {
    return {
        method: opts.method ?? 'POST',
        headers: opts.authorization ? { authorization: opts.authorization } : {},
        body: opts.body,
    } as unknown as VercelRequest;
}

function makeRes() {
    const res = {
        statusCode: 0,
        body: undefined as unknown,
        ended: false,
        status(code: number) {
            res.statusCode = code;
            return res;
        },
        json(payload: unknown) {
            res.body = payload;
            return res;
        },
        end() {
            res.ended = true;
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

const validReq = () =>
    makeReq({ authorization: 'Bearer good-token', body: { email: 'user@example.com' } });

describe('notify-payment-receipt', () => {
    const originalPrice = process.env.SUBSCRIPTION_PRICE;
    // Додано: ціна для тарифу large (profiles.tariff = 'large')
    const originalPriceLarge = process.env.SUBSCRIPTION_PRICE_LARGE;

    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, 'error').mockImplementation(() => { });
        mocks.getUser.mockResolvedValue({ data: { user: { id: 'admin-1' } }, error: null });
        mocks.maybeSingle.mockResolvedValue({ data: { user_id: 'admin-1' } });
        mocks.sendEmail.mockResolvedValue(true);
        mocks.renderTemplate.mockReturnValue('<html>receipt</html>');
        mocks.todayKyiv.mockReturnValue('2026-11-20');
        process.env.SUBSCRIPTION_PRICE = '199 грн';
        delete process.env.SUBSCRIPTION_PRICE_LARGE;
    });

    afterEach(() => {
        if (originalPrice === undefined) delete process.env.SUBSCRIPTION_PRICE;
        else process.env.SUBSCRIPTION_PRICE = originalPrice;
        if (originalPriceLarge === undefined) delete process.env.SUBSCRIPTION_PRICE_LARGE;
        else process.env.SUBSCRIPTION_PRICE_LARGE = originalPriceLarge;
    });

    describe('доступ', () => {
        it('відповідає 405 на не-POST запит', async () => {
            const res = await call(makeReq({ method: 'GET' }));
            expect(res.statusCode).toBe(405);
            expect(mocks.sendEmail).not.toHaveBeenCalled();
        });

        it('відповідає 401, коли немає заголовка Authorization', async () => {
            const res = await call(makeReq({ body: { email: 'user@example.com' } }));
            expect(res.statusCode).toBe(401);
            expect(mocks.getUser).not.toHaveBeenCalled();
            expect(mocks.sendEmail).not.toHaveBeenCalled();
        });

        it('відповідає 401, коли заголовок не у форматі Bearer', async () => {
            const res = await call(
                makeReq({ authorization: 'Basic abc', body: { email: 'user@example.com' } })
            );
            expect(res.statusCode).toBe(401);
            expect(mocks.sendEmail).not.toHaveBeenCalled();
        });

        it('відповідає 401, коли Supabase повертає помилку для токена', async () => {
            mocks.getUser.mockResolvedValue({ data: { user: null }, error: new Error('bad jwt') });
            const res = await call(validReq());
            expect(res.statusCode).toBe(401);
            expect(mocks.sendEmail).not.toHaveBeenCalled();
        });

        it('відповідає 401, коли токен не належить жодному користувачу', async () => {
            mocks.getUser.mockResolvedValue({ data: { user: null }, error: null });
            const res = await call(validReq());
            expect(res.statusCode).toBe(401);
            expect(mocks.sendEmail).not.toHaveBeenCalled();
        });

        it('відповідає 403, коли користувача немає в таблиці admins', async () => {
            mocks.maybeSingle.mockResolvedValue({ data: null });
            const res = await call(validReq());
            expect(res.statusCode).toBe(403);
            expect(mocks.sendEmail).not.toHaveBeenCalled();
        });

        it('передає в Supabase саме токен без префікса Bearer', async () => {
            await call(validReq());
            expect(mocks.getUser).toHaveBeenCalledWith('good-token');
        });
    });

    describe('валідація', () => {
        it('відповідає 400, коли email не вказано', async () => {
            const res = await call(makeReq({ authorization: 'Bearer good-token', body: {} }));
            expect(res.statusCode).toBe(400);
            expect(mocks.sendEmail).not.toHaveBeenCalled();
        });

        it('відповідає 400, а не падає, коли тіло запиту порожнє', async () => {
            const res = await call(makeReq({ authorization: 'Bearer good-token' }));
            expect(res.statusCode).toBe(400);
        });
    });

    describe('надсилання квитанції', () => {
        it('надсилає лист на вказаний email з правильною темою і відповідає 200', async () => {
            const res = await call(validReq());
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ success: true });
            expect(mocks.sendEmail).toHaveBeenCalledWith(
                'user@example.com',
                'Дякуємо за оплату',
                '<html>receipt</html>'
            );
        });

        it('форматує дату за київським часом у вигляді ДД.ММ.РРРР', async () => {
            mocks.todayKyiv.mockReturnValue('2026-01-05');
            await call(validReq());
            expect(mocks.renderTemplate).toHaveBeenCalledWith(
                'lyst-kvytantsiya_pro_oplatu.html',
                expect.objectContaining({ DATA: '05.01.2026' })
            );
        });

        it('бере суму зі змінної оточення SUBSCRIPTION_PRICE', async () => {
            await call(validReq());
            expect(mocks.renderTemplate).toHaveBeenCalledWith(
                'lyst-kvytantsiya_pro_oplatu.html',
                expect.objectContaining({ SUMA: '199 грн' })
            );
        });

        it('підставляє запасний текст, коли SUBSCRIPTION_PRICE не задано', async () => {
            delete process.env.SUBSCRIPTION_PRICE;
            await call(validReq());
            expect(mocks.renderTemplate).toHaveBeenCalledWith(
                'lyst-kvytantsiya_pro_oplatu.html',
                expect.objectContaining({ SUMA: 'уточнюйте у адміністратора' })
            );
        });

        // Додано: тарифи. Перший виклик maybeSingle — перевірка адміна, другий — профіль.
        describe('тариф користувача', () => {
            function withTariff(profile: unknown, error: unknown = null) {
                mocks.maybeSingle
                    .mockResolvedValueOnce({ data: { user_id: 'admin-1' } })
                    .mockResolvedValueOnce({ data: profile, error });
            }

            it('для тарифу large бере суму зі SUBSCRIPTION_PRICE_LARGE', async () => {
                process.env.SUBSCRIPTION_PRICE_LARGE = '299 грн';
                withTariff({ tariff: 'large' });
                await call(validReq());
                expect(mocks.renderTemplate).toHaveBeenCalledWith(
                    'lyst-kvytantsiya_pro_oplatu.html',
                    expect.objectContaining({ SUMA: '299 грн' })
                );
            });

            it('для тарифу base бере SUBSCRIPTION_PRICE, навіть якщо large теж задано', async () => {
                process.env.SUBSCRIPTION_PRICE_LARGE = '299 грн';
                withTariff({ tariff: 'base' });
                await call(validReq());
                expect(mocks.renderTemplate).toHaveBeenCalledWith(
                    'lyst-kvytantsiya_pro_oplatu.html',
                    expect.objectContaining({ SUMA: '199 грн' })
                );
            });

            it('для large без змінної SUBSCRIPTION_PRICE_LARGE пише запасний текст, а не базову ціну', async () => {
                withTariff({ tariff: 'large' });
                await call(validReq());
                expect(mocks.renderTemplate).toHaveBeenCalledWith(
                    'lyst-kvytantsiya_pro_oplatu.html',
                    expect.objectContaining({ SUMA: 'уточнюйте у адміністратора' })
                );
            });

            it('якщо профіль не знайдено, бере базову ціну', async () => {
                withTariff(null);
                await call(validReq());
                expect(mocks.renderTemplate).toHaveBeenCalledWith(
                    'lyst-kvytantsiya_pro_oplatu.html',
                    expect.objectContaining({ SUMA: '199 грн' })
                );
            });

            it('при помилці запиту профілю бере базову ціну, пише в лог і все одно надсилає лист', async () => {
                withTariff(null, new Error('db down'));
                const res = await call(validReq());
                expect(console.error).toHaveBeenCalled();
                expect(mocks.renderTemplate).toHaveBeenCalledWith(
                    'lyst-kvytantsiya_pro_oplatu.html',
                    expect.objectContaining({ SUMA: '199 грн' })
                );
                expect(res.statusCode).toBe(200);
            });
        });

        it('повертає success: false, коли sendEmail повернув false', async () => {
            mocks.sendEmail.mockResolvedValue(false);
            const res = await call(validReq());
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ success: false });
        });

        it('відповідає 502 і пише помилку в лог, коли sendEmail кидає виняток', async () => {
            mocks.sendEmail.mockRejectedValue(new Error('smtp down'));
            const res = await call(validReq());
            expect(res.statusCode).toBe(502);
            expect(res.body).toEqual({ error: 'Failed to send receipt email' });
            expect(console.error).toHaveBeenCalled();
        });

        it('відповідає 502, коли не вдалося відрендерити шаблон', async () => {
            mocks.renderTemplate.mockImplementation(() => {
                throw new Error('template missing');
            });
            const res = await call(validReq());
            expect(res.statusCode).toBe(502);
            expect(mocks.sendEmail).not.toHaveBeenCalled();
        });
    });
});
