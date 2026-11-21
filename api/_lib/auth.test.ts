import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { VercelRequest } from '@vercel/node';
import { isAuthorized } from './auth';

function makeReq(headers: Record<string, string | string[] | undefined>): VercelRequest {
    return { headers } as unknown as VercelRequest;
}

describe('isAuthorized', () => {
    beforeEach(() => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('пропускає запит, коли заголовок збігається з секретом', () => {
        const req = makeReq({ 'x-secret': 'super-secret' });
        expect(isAuthorized(req, 'x-secret', 'super-secret')).toBe(true);
    });

    it('відмовляє, коли секрет не заданий на сервері, і пише помилку в лог', () => {
        const req = makeReq({ 'x-secret': 'anything' });
        expect(isAuthorized(req, 'x-secret', undefined)).toBe(false);
        expect(console.error).toHaveBeenCalled();
    });

    it('відмовляє, коли секрет на сервері порожній рядок', () => {
        const req = makeReq({ 'x-secret': '' });
        expect(isAuthorized(req, 'x-secret', '')).toBe(false);
    });

    it('відмовляє, коли заголовок відсутній', () => {
        const req = makeReq({});
        expect(isAuthorized(req, 'x-secret', 'super-secret')).toBe(false);
    });

    it('відмовляє, коли заголовок порожній', () => {
        const req = makeReq({ 'x-secret': '' });
        expect(isAuthorized(req, 'x-secret', 'super-secret')).toBe(false);
    });

    it('відмовляє при неправильному секреті тієї ж довжини', () => {
        const req = makeReq({ 'x-secret': 'super-secreT' });
        expect(isAuthorized(req, 'x-secret', 'super-secret')).toBe(false);
    });

    it('відмовляє при секреті іншої довжини, не падаючи з помилкою', () => {
        const req = makeReq({ 'x-secret': 'short' });
        expect(() => isAuthorized(req, 'x-secret', 'super-secret')).not.toThrow();
        expect(isAuthorized(req, 'x-secret', 'super-secret')).toBe(false);
    });

    it('якщо заголовок прийшов масивом, перевіряє перше значення', () => {
        const ok = makeReq({ 'x-secret': ['super-secret', 'other'] });
        const bad = makeReq({ 'x-secret': ['other', 'super-secret'] });
        expect(isAuthorized(ok, 'x-secret', 'super-secret')).toBe(true);
        expect(isAuthorized(bad, 'x-secret', 'super-secret')).toBe(false);
    });

    it('читає саме той заголовок, який передано', () => {
        const req = makeReq({ 'x-other': 'super-secret' });
        expect(isAuthorized(req, 'x-secret', 'super-secret')).toBe(false);
    });
});
