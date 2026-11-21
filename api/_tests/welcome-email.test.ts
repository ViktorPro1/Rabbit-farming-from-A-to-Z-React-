// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const mocks = vi.hoisted(() => ({
    sendEmail: vi.fn(),
    renderTemplate: vi.fn(),
}));

vi.mock('../_lib/email.js', () => ({ sendEmail: mocks.sendEmail }));
vi.mock('../_lib/email-templates.js', () => ({ renderTemplate: mocks.renderTemplate }));

import handler from '../welcome-email';

function makeReq(opts: { method?: string; secret?: string; body?: unknown }): VercelRequest {
    return {
        method: opts.method ?? 'POST',
        headers: opts.secret ? { 'x-webhook-secret': opts.secret } : {},
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

const validBody = { record: { email: 'new@example.com' } };

describe('welcome-email', () => {
    const originalSecret = process.env.SUPABASE_WEBHOOK_SECRET;

    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, 'error').mockImplementation(() => {});
        process.env.SUPABASE_WEBHOOK_SECRET = 'hook-secret';
        mocks.sendEmail.mockResolvedValue(true);
        mocks.renderTemplate.mockReturnValue('<html>welcome</html>');
    });

    afterEach(() => {
        if (originalSecret === undefined) delete process.env.SUPABASE_WEBHOOK_SECRET;
        else process.env.SUPABASE_WEBHOOK_SECRET = originalSecret;
    });

    describe('доступ', () => {
        it('відповідає 405 на не-POST запит', async () => {
            const res = await call(makeReq({ method: 'GET', secret: 'hook-secret', body: validBody }));
            expect(res.statusCode).toBe(405);
            expect(mocks.sendEmail).not.toHaveBeenCalled();
        });

        it('відповідає 401, коли секрет відсутній, неправильний або не заданий на сервері', async () => {
            expect((await call(makeReq({ body: validBody }))).statusCode).toBe(401);
            expect((await call(makeReq({ secret: 'wrong', body: validBody }))).statusCode).toBe(401);
            delete process.env.SUPABASE_WEBHOOK_SECRET;
            expect((await call(makeReq({ secret: 'hook-secret', body: validBody }))).statusCode).toBe(401);
            expect(mocks.sendEmail).not.toHaveBeenCalled();
        });
    });

    describe('валідація', () => {
        it.each([
            ['тіла немає', undefined],
            ['порожнє тіло', {}],
            ['немає email у record', { record: {} }],
            ['порожній email', { record: { email: '' } }],
            ['email = null', { record: { email: null } }],
        ])('відповідає 400, коли %s', async (_name, body) => {
            const res = await call(makeReq({ secret: 'hook-secret', body }));
            expect(res.statusCode).toBe(400);
            expect(mocks.sendEmail).not.toHaveBeenCalled();
        });
    });

    describe('надсилання', () => {
        it('надсилає вітальний лист на email із record зі своїм шаблоном', async () => {
            const res = await call(makeReq({ secret: 'hook-secret', body: validBody }));
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ success: true });
            expect(mocks.renderTemplate).toHaveBeenCalledWith('lyst-vitannya_pislya_reyestratsii.html');
            expect(mocks.sendEmail).toHaveBeenCalledWith(
                'new@example.com',
                'Вітаємо в «Кролівництво від А до Я»!',
                '<html>welcome</html>'
            );
        });

        it('повертає success: false, коли sendEmail повернув false', async () => {
            mocks.sendEmail.mockResolvedValue(false);
            const res = await call(makeReq({ secret: 'hook-secret', body: validBody }));
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ success: false });
        });

        it('відповідає 502 і пише в лог, коли sendEmail кидає виняток', async () => {
            mocks.sendEmail.mockRejectedValue(new Error('smtp down'));
            const res = await call(makeReq({ secret: 'hook-secret', body: validBody }));
            expect(res.statusCode).toBe(502);
            expect(res.body).toEqual({ error: 'Failed to send welcome email' });
            expect(console.error).toHaveBeenCalled();
        });

        it('відповідає 502, коли не вдалося відрендерити шаблон', async () => {
            mocks.renderTemplate.mockImplementation(() => {
                throw new Error('template missing');
            });
            const res = await call(makeReq({ secret: 'hook-secret', body: validBody }));
            expect(res.statusCode).toBe(502);
            expect(mocks.sendEmail).not.toHaveBeenCalled();
        });
    });
});
