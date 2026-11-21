// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const mocks = vi.hoisted(() => ({ sendMail: vi.fn() }));

vi.mock('../_lib/email.js', () => ({
    transporter: { sendMail: mocks.sendMail },
    FROM_ADDRESS: '"Test" <test@example.com>',
}));

import handler from '../send-email';

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

const fullBody = { to: 'user@example.com', subject: 'Тема', html: '<p>Привіт</p>' };

describe('send-email', () => {
    const originalSecret = process.env.SEND_EMAIL_SECRET;

    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, 'error').mockImplementation(() => {});
        process.env.SEND_EMAIL_SECRET = 'send-secret';
        mocks.sendMail.mockResolvedValue({ messageId: 'msg-1' });
    });

    afterEach(() => {
        if (originalSecret === undefined) delete process.env.SEND_EMAIL_SECRET;
        else process.env.SEND_EMAIL_SECRET = originalSecret;
    });

    describe('доступ', () => {
        it('відповідає 405 на не-POST запит', async () => {
            const res = await call(makeReq({ method: 'GET', secret: 'send-secret', body: fullBody }));
            expect(res.statusCode).toBe(405);
            expect(mocks.sendMail).not.toHaveBeenCalled();
        });

        it('відповідає 401, коли секрет відсутній, неправильний або не заданий на сервері', async () => {
            expect((await call(makeReq({ body: fullBody }))).statusCode).toBe(401);
            expect((await call(makeReq({ secret: 'wrong', body: fullBody }))).statusCode).toBe(401);
            delete process.env.SEND_EMAIL_SECRET;
            expect((await call(makeReq({ secret: 'send-secret', body: fullBody }))).statusCode).toBe(401);
            expect(mocks.sendMail).not.toHaveBeenCalled();
        });
    });

    describe('валідація', () => {
        it.each(['to', 'subject', 'html'])('відповідає 400, коли немає поля %s', async (field) => {
            const body: Record<string, string> = { ...fullBody };
            delete body[field];
            const res = await call(makeReq({ secret: 'send-secret', body }));
            expect(res.statusCode).toBe(400);
            expect(mocks.sendMail).not.toHaveBeenCalled();
        });

        it('відповідає 400, а не падає, коли тіло запиту порожнє', async () => {
            const res = await call(makeReq({ secret: 'send-secret' }));
            expect(res.statusCode).toBe(400);
        });
    });

    describe('надсилання', () => {
        it('передає в транспорт відправника, отримувача, тему і html', async () => {
            await call(makeReq({ secret: 'send-secret', body: fullBody }));
            expect(mocks.sendMail).toHaveBeenCalledWith({
                from: '"Test" <test@example.com>',
                to: 'user@example.com',
                subject: 'Тема',
                html: '<p>Привіт</p>',
            });
        });

        it('відповідає 200 з ідентифікатором листа', async () => {
            const res = await call(makeReq({ secret: 'send-secret', body: fullBody }));
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ success: true, id: 'msg-1' });
        });

        it('відповідає 502 і пише помилку в лог, коли транспорт кидає виняток', async () => {
            mocks.sendMail.mockRejectedValue(new Error('smtp down'));
            const res = await call(makeReq({ secret: 'send-secret', body: fullBody }));
            expect(res.statusCode).toBe(502);
            expect(res.body).toEqual({ error: 'Failed to send email' });
            expect(console.error).toHaveBeenCalled();
        });
    });
});
