// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { VercelRequest } from '@vercel/node';

const mocks = vi.hoisted(() => ({
    getUser: vi.fn(),
    from: vi.fn(),
    select: vi.fn(),
    eq: vi.fn(),
    maybeSingle: vi.fn(),
}));

vi.mock('./push.js', () => ({
    supabase: {
        auth: { getUser: mocks.getUser },
        from: mocks.from,
    },
}));

import { isAdminRequest } from './admin-auth';

function req(authorization?: string): VercelRequest {
    return { headers: authorization === undefined ? {} : { authorization } } as unknown as VercelRequest;
}

beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    mocks.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null });
    mocks.from.mockReturnValue({ select: mocks.select });
    mocks.select.mockReturnValue({ eq: mocks.eq });
    mocks.eq.mockReturnValue({ maybeSingle: mocks.maybeSingle });
    mocks.maybeSingle.mockResolvedValue({ data: { user_id: 'user-1' }, error: null });
});

describe('isAdminRequest', () => {
    it('справжній токен і запис у таблиці admins: true', async () => {
        expect(await isAdminRequest(req('Bearer good-token'))).toBe(true);
    });

    it('передає в Supabase токен без слова Bearer', async () => {
        await isAdminRequest(req('Bearer good-token'));
        expect(mocks.getUser).toHaveBeenCalledWith('good-token');
    });

    it('шукає в admins саме за id користувача з токена', async () => {
        await isAdminRequest(req('Bearer good-token'));
        expect(mocks.from).toHaveBeenCalledWith('admins');
        expect(mocks.eq).toHaveBeenCalledWith('user_id', 'user-1');
    });

    it.each([
        ['без заголовка', undefined],
        ['порожній заголовок', ''],
        ['без слова Bearer', 'good-token'],
        ['інша схема', 'Basic abc'],
        ['Bearer без пробілу', 'Bearertoken'],
        ['Bearer з малої літери', 'bearer good-token'],
    ])('%s: false, база не опитується', async (_name, header) => {
        expect(await isAdminRequest(req(header))).toBe(false);
        expect(mocks.getUser).not.toHaveBeenCalled();
        expect(mocks.from).not.toHaveBeenCalled();
    });

    it('«Bearer » без самого токена: false', async () => {
        expect(await isAdminRequest(req('Bearer '))).toBe(false);
        expect(mocks.getUser).not.toHaveBeenCalled();
    });

    it('недійсний токен (помилка Supabase): false і перевірки admins немає', async () => {
        mocks.getUser.mockResolvedValue({ data: { user: null }, error: { message: 'invalid JWT' } });
        expect(await isAdminRequest(req('Bearer bad'))).toBe(false);
        expect(mocks.from).not.toHaveBeenCalled();
    });

    it('токен без користувача: false', async () => {
        mocks.getUser.mockResolvedValue({ data: { user: null }, error: null });
        expect(await isAdminRequest(req('Bearer x'))).toBe(false);
    });

    it('звичайний користувач (запису в admins немає): false', async () => {
        mocks.maybeSingle.mockResolvedValue({ data: null, error: null });
        expect(await isAdminRequest(req('Bearer good-token'))).toBe(false);
    });

    it('помилка запиту до admins: false і запис у лог', async () => {
        mocks.maybeSingle.mockResolvedValue({ data: null, error: { message: 'db down' } });
        expect(await isAdminRequest(req('Bearer good-token'))).toBe(false);
        expect(console.error).toHaveBeenCalled();
    });

    it('виняток під час перевірки токена: false, а не падіння', async () => {
        mocks.getUser.mockRejectedValue(new Error('network down'));
        await expect(isAdminRequest(req('Bearer good-token'))).resolves.toBe(false);
        expect(console.error).toHaveBeenCalled();
    });

    it('виняток під час запиту до admins: false', async () => {
        mocks.maybeSingle.mockRejectedValue(new Error('network down'));
        await expect(isAdminRequest(req('Bearer good-token'))).resolves.toBe(false);
    });
});
