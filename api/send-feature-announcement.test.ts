// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const mocks = vi.hoisted(() => ({
    from: vi.fn(),
    select: vi.fn(),
    sendEmail: vi.fn(),
    renderTemplate: vi.fn(),
}));

vi.mock('./_lib/push.js', () => ({
    supabase: {
        from: (table: string) => {
            mocks.from(table);
            return { select: mocks.select };
        },
    },
}));
vi.mock('./_lib/email.js', () => ({ sendEmail: mocks.sendEmail }));
vi.mock('./_lib/email-templates.js', () => ({ renderTemplate: mocks.renderTemplate }));

import handler from './send-feature-announcement';

function makeReq(opts: { method?: string; secret?: string; body?: unknown }): VercelRequest {
    return {
        method: opts.method ?? 'POST',
        headers: opts.secret ? { 'x-send-secret': opts.secret } : {},
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

const validReq = (description = 'додано експорт реєстру в Excel') =>
    makeReq({ secret: 'send-secret', body: { description } });

describe('send-feature-announcement', () => {
    const originalSecret = process.env.SEND_EMAIL_SECRET;

    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, 'error').mockImplementation(() => {});
        process.env.SEND_EMAIL_SECRET = 'send-secret';
        mocks.select.mockResolvedValue({
            data: [{ email: 'a@example.com' }, { email: 'b@example.com' }],
            error: null,
        });
        mocks.sendEmail.mockResolvedValue(true);
        mocks.renderTemplate.mockReturnValue('<html>announce</html>');
    });

    afterEach(() => {
        if (originalSecret === undefined) delete process.env.SEND_EMAIL_SECRET;
        else process.env.SEND_EMAIL_SECRET = originalSecret;
    });

    describe('доступ', () => {
        it('відповідає 405 на не-POST запит', async () => {
            const res = await call(makeReq({ method: 'GET', secret: 'send-secret' }));
            expect(res.statusCode).toBe(405);
            expect(mocks.sendEmail).not.toHaveBeenCalled();
        });

        it('відповідає 401, коли секрет відсутній, неправильний або не заданий на сервері', async () => {
            expect((await call(makeReq({ body: { description: 'x' } }))).statusCode).toBe(401);
            expect(
                (await call(makeReq({ secret: 'wrong', body: { description: 'x' } }))).statusCode
            ).toBe(401);
            delete process.env.SEND_EMAIL_SECRET;
            expect((await call(validReq())).statusCode).toBe(401);
            expect(mocks.select).not.toHaveBeenCalled();
            expect(mocks.sendEmail).not.toHaveBeenCalled();
        });
    });

    describe('валідація', () => {
        it('відповідає 400, коли опис не вказано, порожній або тіла немає', async () => {
            expect((await call(makeReq({ secret: 'send-secret', body: {} }))).statusCode).toBe(400);
            expect(
                (await call(makeReq({ secret: 'send-secret', body: { description: '' } }))).statusCode
            ).toBe(400);
            expect((await call(makeReq({ secret: 'send-secret' }))).statusCode).toBe(400);
            expect(mocks.select).not.toHaveBeenCalled();
            expect(mocks.sendEmail).not.toHaveBeenCalled();
        });
    });

    describe('розсилка', () => {
        it('читає email усіх користувачів із таблиці profiles', async () => {
            await call(validReq());
            expect(mocks.from).toHaveBeenCalledWith('profiles');
            expect(mocks.select).toHaveBeenCalledWith('email');
        });

        it('надсилає кожному лист із темою і описом функції в шаблоні', async () => {
            const res = await call(validReq('новий калькулятор кормів'));
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ sent: 2, total: 2 });
            expect(mocks.renderTemplate).toHaveBeenCalledWith('lyst-anons_novogo_funktsionalu.html', {
                OPYS_FUNKTSII: 'новий калькулятор кормів',
            });
            expect(mocks.sendEmail.mock.calls).toEqual([
                ['a@example.com', 'Що нового в кабінеті', '<html>announce</html>'],
                ['b@example.com', 'Що нового в кабінеті', '<html>announce</html>'],
            ]);
        });

        it('пропускає профілі без email, але рахує їх у total', async () => {
            mocks.select.mockResolvedValue({
                data: [{ email: null }, { email: '' }, { email: 'b@example.com' }],
                error: null,
            });
            const res = await call(validReq());
            expect(res.body).toEqual({ sent: 1, total: 3 });
            expect(mocks.sendEmail).toHaveBeenCalledTimes(1);
        });

        it('рахує в sent лише підтверджені листи і не зупиняється після невдалого', async () => {
            mocks.sendEmail.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
            const res = await call(validReq());
            expect(res.body).toEqual({ sent: 1, total: 2 });
            expect(mocks.sendEmail).toHaveBeenCalledTimes(2);
        });

        it('повертає 200 з нулями, коли користувачів немає або data = null', async () => {
            mocks.select.mockResolvedValue({ data: [], error: null });
            expect((await call(validReq())).body).toEqual({ sent: 0, total: 0 });
            mocks.select.mockResolvedValue({ data: null, error: null });
            expect((await call(validReq())).body).toEqual({ sent: 0, total: 0 });
            expect(mocks.sendEmail).not.toHaveBeenCalled();
        });

        it('при помилці запиту користувачів відповідає 500, пише в лог і нічого не надсилає', async () => {
            mocks.select.mockResolvedValue({ data: null, error: new Error('db down') });
            const res = await call(validReq());
            expect(res.statusCode).toBe(500);
            expect(res.body).toEqual({ error: 'Failed to load users' });
            expect(console.error).toHaveBeenCalled();
            expect(mocks.sendEmail).not.toHaveBeenCalled();
        });
    });
});
