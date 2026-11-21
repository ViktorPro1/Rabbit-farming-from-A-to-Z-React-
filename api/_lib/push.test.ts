// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

type QueryResult = { data: unknown; error: unknown };
type Call = { method: string; args: unknown[] };

const mocks = vi.hoisted(() => ({
    setVapidDetails: vi.fn(),
    sendNotification: vi.fn(),
    createClient: vi.fn(),
    log: [] as { table: string; calls: { method: string; args: unknown[] }[] }[],
    results: {
        select: { data: [], error: null } as { data: unknown; error: unknown },
        delete: { data: null, error: null } as { data: unknown; error: unknown },
    },
}));

// Фальшивий конструктор запитів Supabase: результат залежить від першого методу
// ланцюжка (.select() або .delete()), а всі виклики запам'ятовуються.
function makeBuilder(table: string) {
    const entry = { table, calls: [] as Call[] };
    mocks.log.push(entry);
    const builder: object = new Proxy(
        {},
        {
            get(_target, prop) {
                if (prop === 'then') {
                    return (resolve: (v: QueryResult) => unknown, reject: (e: unknown) => unknown) => {
                        const first = entry.calls[0]?.method === 'delete' ? 'delete' : 'select';
                        return Promise.resolve(mocks.results[first]).then(resolve, reject);
                    };
                }
                return (...args: unknown[]) => {
                    entry.calls.push({ method: String(prop), args });
                    return builder;
                };
            },
        }
    );
    return builder;
}

class FakeWebPushError extends Error {
    statusCode?: number;
    body?: string;
}

vi.mock('web-push', () => ({
    default: { setVapidDetails: mocks.setVapidDetails, sendNotification: mocks.sendNotification },
    WebPushError: FakeWebPushError,
}));
vi.mock('@supabase/supabase-js', () => ({ createClient: mocks.createClient }));

// Модуль виконує налаштування під час імпорту, тому кожен тест імпортує його заново.
async function loadModule() {
    vi.resetModules();
    return import('./push');
}

const sub = (id: string) => ({
    id,
    endpoint: `https://push.example/${id}`,
    p256dh: `p256dh-${id}`,
    auth: `auth-${id}`,
});

function pushError(statusCode: number) {
    return Object.assign(new FakeWebPushError('push failed'), { statusCode, body: 'details' });
}

beforeEach(() => {
    vi.clearAllMocks();
    mocks.log.length = 0;
    mocks.results.select = { data: [], error: null };
    mocks.results.delete = { data: null, error: null };
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.stubEnv('VAPID_SUBJECT', 'mailto:admin@example.com');
    vi.stubEnv('VITE_VAPID_PUBLIC_KEY', 'public-key');
    vi.stubEnv('VAPID_PRIVATE_KEY', 'private-key');
    vi.stubEnv('VITE_SUPABASE_URL', 'https://project.supabase.co');
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'service-role-key');
    mocks.createClient.mockReturnValue({ from: (table: string) => makeBuilder(table) });
    mocks.sendNotification.mockResolvedValue(undefined);
});

afterEach(() => {
    vi.unstubAllEnvs();
});

describe('налаштування модуля', () => {
    it('налаштовує VAPID зі змінних оточення у правильному порядку', async () => {
        await loadModule();
        expect(mocks.setVapidDetails).toHaveBeenCalledWith(
            'mailto:admin@example.com',
            'public-key',
            'private-key'
        );
    });

    it('створює клієнт Supabase із service role ключем, а не з публічним', async () => {
        await loadModule();
        expect(mocks.createClient).toHaveBeenCalledWith('https://project.supabase.co', 'service-role-key');
    });

    it('експортує supabase, webpush і WebPushError', async () => {
        const mod = await loadModule();
        expect(typeof mod.supabase.from).toBe('function');
        expect(mod.webpush.sendNotification).toBe(mocks.sendNotification);
        expect(mod.WebPushError).toBe(FakeWebPushError);
    });
});

describe('removeExpiredSubscription', () => {
    it.each([410, 404])('видаляє підписку за id, коли провайдер повернув %i', async (status) => {
        const { removeExpiredSubscription } = await loadModule();
        await removeExpiredSubscription('sub-1', status);
        expect(mocks.log).toHaveLength(1);
        expect(mocks.log[0].table).toBe('push_subscriptions');
        expect(mocks.log[0].calls).toEqual([
            { method: 'delete', args: [] },
            { method: 'eq', args: ['id', 'sub-1'] },
        ]);
    });

    it.each([[500], [400], [403], [429], [undefined]])(
        'не видаляє підписку, коли код відповіді %s',
        async (status) => {
            const { removeExpiredSubscription } = await loadModule();
            await removeExpiredSubscription('sub-1', status);
            expect(mocks.log).toHaveLength(0);
        }
    );

    it('при помилці видалення пише в лог і не кидає виняток', async () => {
        mocks.results.delete = { data: null, error: new Error('db down') };
        const { removeExpiredSubscription } = await loadModule();
        await expect(removeExpiredSubscription('sub-1', 410)).resolves.toBeUndefined();
        expect(console.error).toHaveBeenCalled();
    });
});

describe('sendToUser', () => {
    it('шукає підписки саме цього користувача', async () => {
        const { sendToUser } = await loadModule();
        await sendToUser('user-1', 'T', 'B', '/u');
        expect(mocks.log[0].table).toBe('push_subscriptions');
        expect(mocks.log[0].calls).toEqual([
            { method: 'select', args: ['*'] },
            { method: 'eq', args: ['user_id', 'user-1'] },
        ]);
    });

    it('надсилає кожній підписці дані та JSON із заголовком, текстом і посиланням', async () => {
        mocks.results.select = { data: [sub('s1'), sub('s2')], error: null };
        const { sendToUser } = await loadModule();
        await sendToUser('user-1', 'Заголовок', 'Текст', '/matings');
        expect(mocks.sendNotification).toHaveBeenCalledTimes(2);
        expect(mocks.sendNotification).toHaveBeenCalledWith(
            { endpoint: 'https://push.example/s1', keys: { p256dh: 'p256dh-s1', auth: 'auth-s1' } },
            JSON.stringify({ title: 'Заголовок', body: 'Текст', url: '/matings' })
        );
        expect(mocks.sendNotification).toHaveBeenCalledWith(
            { endpoint: 'https://push.example/s2', keys: { p256dh: 'p256dh-s2', auth: 'auth-s2' } },
            expect.any(String)
        );
    });

    it('нічого не надсилає, коли підписок немає або data = null', async () => {
        const { sendToUser } = await loadModule();
        mocks.results.select = { data: [], error: null };
        await sendToUser('user-1', 'T', 'B', '/u');
        mocks.results.select = { data: null, error: null };
        await sendToUser('user-1', 'T', 'B', '/u');
        expect(mocks.sendNotification).not.toHaveBeenCalled();
    });

    it('при помилці читання підписок пише в лог, нічого не надсилає і не кидає виняток', async () => {
        mocks.results.select = { data: null, error: new Error('db down') };
        const { sendToUser } = await loadModule();
        await expect(sendToUser('user-1', 'T', 'B', '/u')).resolves.toBeUndefined();
        expect(console.error).toHaveBeenCalled();
        expect(mocks.sendNotification).not.toHaveBeenCalled();
    });

    it('видаляє мертву підписку (410), але інші підписки отримують сповіщення', async () => {
        mocks.results.select = { data: [sub('s1'), sub('s2')], error: null };
        mocks.sendNotification.mockRejectedValueOnce(pushError(410)).mockResolvedValueOnce(undefined);
        const { sendToUser } = await loadModule();
        await expect(sendToUser('user-1', 'T', 'B', '/u')).resolves.toBeUndefined();
        expect(mocks.sendNotification).toHaveBeenCalledTimes(2);
        const deletes = mocks.log.filter((entry) => entry.calls[0]?.method === 'delete');
        expect(deletes).toHaveLength(1);
        expect(deletes[0].calls).toContainEqual({ method: 'eq', args: ['id', 's1'] });
    });

    it('видаляє підписку і при коді 404', async () => {
        mocks.results.select = { data: [sub('s1')], error: null };
        mocks.sendNotification.mockRejectedValue(pushError(404));
        const { sendToUser } = await loadModule();
        await sendToUser('user-1', 'T', 'B', '/u');
        expect(mocks.log.some((entry) => entry.calls[0]?.method === 'delete')).toBe(true);
    });

    it('тимчасова помилка (наприклад, 500) лише пишеться в лог, підписка лишається', async () => {
        mocks.results.select = { data: [sub('s1')], error: null };
        mocks.sendNotification.mockRejectedValue(pushError(500));
        const { sendToUser } = await loadModule();
        await expect(sendToUser('user-1', 'T', 'B', '/u')).resolves.toBeUndefined();
        expect(console.error).toHaveBeenCalled();
        expect(mocks.log.some((entry) => entry.calls[0]?.method === 'delete')).toBe(false);
    });

    it('не видаляє підписки, коли всі сповіщення успішні', async () => {
        mocks.results.select = { data: [sub('s1'), sub('s2')], error: null };
        const { sendToUser } = await loadModule();
        await sendToUser('user-1', 'T', 'B', '/u');
        expect(mocks.log.some((entry) => entry.calls[0]?.method === 'delete')).toBe(false);
    });
});
