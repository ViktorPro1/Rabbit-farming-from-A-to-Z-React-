// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const mocks = vi.hoisted(() => ({
    getUser: vi.fn(),
    // (table, column, value) -> { data, error? }
    maybeSingle: vi.fn(),
    sendEmail: vi.fn(),
    renderTemplate: vi.fn(),
}));

vi.mock('../_lib/push.js', () => ({
    supabase: {
        auth: { getUser: mocks.getUser },
        from: (table: string) => ({
            select: () => ({
                eq: (column: string, value: unknown) => ({
                    maybeSingle: () => mocks.maybeSingle(table, column, value),
                }),
            }),
        }),
    },
}));
vi.mock('../_lib/email.js', () => ({ sendEmail: mocks.sendEmail }));
vi.mock('../_lib/email-templates.js', () => ({ renderTemplate: mocks.renderTemplate }));

import activated from '../notify-subscription-activated';
import cancelled from '../notify-subscription-cancelled';

type Handler = (req: VercelRequest, res: VercelResponse) => unknown;

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

async function call(handler: Handler, req: VercelRequest) {
    const res = makeRes();
    await handler(req, res as unknown as VercelResponse);
    return res;
}

const validReq = () =>
    makeReq({ authorization: 'Bearer good-token', body: { email: 'user@example.com' } });

const cases = [
    {
        name: 'notify-subscription-activated',
        handler: activated as Handler,
        template: 'lyst-pidpyska_aktyvovana.html',
        subject: 'Вашу підписку активовано!',
        renderArgs: ['lyst-pidpyska_aktyvovana.html'],
    },
    {
        name: 'notify-subscription-cancelled',
        handler: cancelled as Handler,
        template: 'lyst-pidpyska_skasovana.html',
        subject: 'Вашу підписку скасовано',
        renderArgs: ['lyst-pidpyska_skasovana.html', { DATA: '01.12.2026' }],
    },
];

describe.each(cases)('$name', ({ handler, subject, renderArgs }) => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, 'error').mockImplementation(() => {});
        mocks.getUser.mockResolvedValue({ data: { user: { id: 'admin-1' } }, error: null });
        mocks.maybeSingle.mockImplementation(async (table: string) =>
            table === 'admins'
                ? { data: { user_id: 'admin-1' } }
                : { data: { access_until: '2026-12-01T00:00:00+00:00' } }
        );
        mocks.sendEmail.mockResolvedValue(true);
        mocks.renderTemplate.mockReturnValue('<html>letter</html>');
    });

    describe('доступ', () => {
        it('відповідає 405 на не-POST запит', async () => {
            const res = await call(handler, makeReq({ method: 'GET' }));
            expect(res.statusCode).toBe(405);
            expect(mocks.sendEmail).not.toHaveBeenCalled();
        });

        it('відповідає 401, коли немає заголовка Authorization', async () => {
            const res = await call(handler, makeReq({ body: { email: 'user@example.com' } }));
            expect(res.statusCode).toBe(401);
            expect(mocks.getUser).not.toHaveBeenCalled();
            expect(mocks.sendEmail).not.toHaveBeenCalled();
        });

        it('відповідає 401, коли заголовок не у форматі Bearer', async () => {
            const res = await call(
                handler,
                makeReq({ authorization: 'Basic abc', body: { email: 'user@example.com' } })
            );
            expect(res.statusCode).toBe(401);
            expect(mocks.sendEmail).not.toHaveBeenCalled();
        });

        it('відповідає 401, коли Supabase повертає помилку для токена', async () => {
            mocks.getUser.mockResolvedValue({ data: { user: null }, error: new Error('bad jwt') });
            const res = await call(handler, validReq());
            expect(res.statusCode).toBe(401);
            expect(mocks.sendEmail).not.toHaveBeenCalled();
        });

        it('відповідає 401, коли токен не належить жодному користувачу', async () => {
            mocks.getUser.mockResolvedValue({ data: { user: null }, error: null });
            const res = await call(handler, validReq());
            expect(res.statusCode).toBe(401);
            expect(mocks.sendEmail).not.toHaveBeenCalled();
        });

        it('відповідає 403, коли користувача немає в таблиці admins', async () => {
            mocks.maybeSingle.mockResolvedValue({ data: null });
            const res = await call(handler, validReq());
            expect(res.statusCode).toBe(403);
            expect(mocks.sendEmail).not.toHaveBeenCalled();
        });

        it('передає в Supabase токен без префікса Bearer', async () => {
            await call(handler, validReq());
            expect(mocks.getUser).toHaveBeenCalledWith('good-token');
        });
    });

    describe('валідація', () => {
        it('відповідає 400, коли email не вказано', async () => {
            const res = await call(
                handler,
                makeReq({ authorization: 'Bearer good-token', body: {} })
            );
            expect(res.statusCode).toBe(400);
            expect(mocks.sendEmail).not.toHaveBeenCalled();
        });

        it('відповідає 400, а не падає, коли тіло запиту порожнє', async () => {
            const res = await call(handler, makeReq({ authorization: 'Bearer good-token' }));
            expect(res.statusCode).toBe(400);
        });
    });

    describe('надсилання листа', () => {
        it('рендерить свій шаблон і надсилає лист з правильною темою', async () => {
            const res = await call(handler, validReq());
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ success: true });
            expect(mocks.renderTemplate).toHaveBeenCalledWith(...renderArgs);
            expect(mocks.sendEmail).toHaveBeenCalledWith(
                'user@example.com',
                subject,
                '<html>letter</html>'
            );
        });

        it('повертає success: false, коли sendEmail повернув false', async () => {
            mocks.sendEmail.mockResolvedValue(false);
            const res = await call(handler, validReq());
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ success: false });
        });

        it('відповідає 502 і пише помилку в лог, коли sendEmail кидає виняток', async () => {
            mocks.sendEmail.mockRejectedValue(new Error('smtp down'));
            const res = await call(handler, validReq());
            expect(res.statusCode).toBe(502);
            expect(res.body).toEqual({ error: 'Failed to send email' });
            expect(console.error).toHaveBeenCalled();
        });

        it('відповідає 502, коли не вдалося відрендерити шаблон', async () => {
            mocks.renderTemplate.mockImplementation(() => {
                throw new Error('template missing');
            });
            const res = await call(handler, validReq());
            expect(res.statusCode).toBe(502);
            expect(mocks.sendEmail).not.toHaveBeenCalled();
        });
    });
});

describe('notify-subscription-cancelled: дата доступу в листі', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, 'error').mockImplementation(() => {});
        mocks.getUser.mockResolvedValue({ data: { user: { id: 'admin-1' } }, error: null });
        mocks.sendEmail.mockResolvedValue(true);
        mocks.renderTemplate.mockReturnValue('<html>letter</html>');
    });

    function mockProfile(profileResult: unknown) {
        mocks.maybeSingle.mockImplementation(async (table: string) =>
            table === 'admins' ? { data: { user_id: 'admin-1' } } : profileResult
        );
    }

    const FALLBACK = { DATA: 'найближчим часом' };

    it('шукає профіль за email з тіла запиту', async () => {
        mockProfile({ data: { access_until: '2026-12-01T00:00:00+00:00' } });
        await call(cancelled as Handler, validReq());
        expect(mocks.maybeSingle).toHaveBeenCalledWith('profiles', 'email', 'user@example.com');
    });

    it('форматує access_until у вигляді ДД.ММ.РРРР', async () => {
        mockProfile({ data: { access_until: '2026-01-05T00:00:00+00:00' } });
        await call(cancelled as Handler, validReq());
        expect(mocks.renderTemplate).toHaveBeenCalledWith('lyst-pidpyska_skasovana.html', {
            DATA: '05.01.2026',
        });
    });

    it('підставляє запасний текст, коли access_until = null (безстроково)', async () => {
        mockProfile({ data: { access_until: null } });
        await call(cancelled as Handler, validReq());
        expect(mocks.renderTemplate).toHaveBeenCalledWith('lyst-pidpyska_skasovana.html', FALLBACK);
    });

    it('підставляє запасний текст, коли профіль не знайдено', async () => {
        mockProfile({ data: null });
        await call(cancelled as Handler, validReq());
        expect(mocks.renderTemplate).toHaveBeenCalledWith('lyst-pidpyska_skasovana.html', FALLBACK);
    });

    it('підставляє запасний текст, коли дата в базі некоректна', async () => {
        mockProfile({ data: { access_until: 'не-дата' } });
        await call(cancelled as Handler, validReq());
        expect(mocks.renderTemplate).toHaveBeenCalledWith('lyst-pidpyska_skasovana.html', FALLBACK);
    });

    it('при помилці запиту до бази все одно надсилає лист із запасним текстом', async () => {
        mockProfile({ data: null, error: new Error('db down') });
        const res = await call(cancelled as Handler, validReq());
        expect(res.statusCode).toBe(200);
        expect(console.error).toHaveBeenCalled();
        expect(mocks.renderTemplate).toHaveBeenCalledWith('lyst-pidpyska_skasovana.html', FALLBACK);
        expect(mocks.sendEmail).toHaveBeenCalled();
    });

    it('не читає профіль, коли запит не пройшов перевірку адміна', async () => {
        mocks.maybeSingle.mockResolvedValue({ data: null });
        await call(cancelled as Handler, validReq());
        expect(mocks.maybeSingle).not.toHaveBeenCalledWith('profiles', 'email', expect.anything());
    });
});
