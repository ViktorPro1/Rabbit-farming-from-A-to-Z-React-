import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase, webpush, WebPushError, removeExpiredSubscription } from './_lib/push.js';
import { isAuthorized } from './_lib/auth.js';
import { isAdminRequest } from './_lib/admin-auth.js';

const MAX_TITLE_LENGTH = 100;
const MAX_BODY_LENGTH = 500;
const MAX_URL_LENGTH = 500;

type Validated =
    | { ok: true; title: string; body: string; url: string | undefined; userId: string | undefined }
    | { ok: false; error: string };

/**
 * Перевіряє тіло запиту. Заголовок і текст обов'язкові, url має вести
 * на сторінку сайту ("/matings") або на https-адресу: service worker відкриває
 * його при натисканні на сповіщення, тому "javascript:" та подібне не пропускаємо.
 */
function validateBody(raw: unknown): Validated {
    const input = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
    const { title, body, url, userId } = input;

    if (typeof title !== 'string' || title.trim() === '') {
        return { ok: false, error: 'title is required' };
    }
    if (title.length > MAX_TITLE_LENGTH) {
        return { ok: false, error: `title is too long (max ${MAX_TITLE_LENGTH})` };
    }
    if (typeof body !== 'string' || body.trim() === '') {
        return { ok: false, error: 'body is required' };
    }
    if (body.length > MAX_BODY_LENGTH) {
        return { ok: false, error: `body is too long (max ${MAX_BODY_LENGTH})` };
    }

    if (url !== undefined && url !== null) {
        if (typeof url !== 'string' || url.length > MAX_URL_LENGTH) {
            return { ok: false, error: 'url is invalid' };
        }
        const isSitePath = url.startsWith('/') && !url.startsWith('//');
        if (!isSitePath && !url.startsWith('https://')) {
            return { ok: false, error: 'url must be a site path or an https link' };
        }
    }

    if (userId !== undefined && userId !== null && (typeof userId !== 'string' || userId === '')) {
        return { ok: false, error: 'userId is invalid' };
    }

    return {
        ok: true,
        title,
        body,
        url: typeof url === 'string' ? url : undefined,
        userId: typeof userId === 'string' ? userId : undefined,
    };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') return res.status(405).end();

    // Дозволено двом: власнику з секретним ключем (curl, Postman) і адміністратору,
    // який увійшов на сайті (блок розсилки в адмінці). Ключ у браузер не потрапляє.
    const allowed =
        isAuthorized(req, 'x-push-secret', process.env.PUSH_SEND_SECRET) || (await isAdminRequest(req));
    if (!allowed) return res.status(401).end();

    const parsed = validateBody(req.body);
    if (!parsed.ok) return res.status(400).json({ error: parsed.error });
    const { title, body, url, userId } = parsed;

    try {
        let query = supabase.from('push_subscriptions').select('*');
        if (userId) query = query.eq('user_id', userId);
        const { data: subs, error } = await query;
        if (error) return res.status(500).json({ error: error.message });

        const results = await Promise.allSettled(
            (subs ?? []).map((sub) =>
                webpush
                    .sendNotification(
                        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
                        JSON.stringify({ title, body, url })
                    )
                    .catch(async (err: WebPushError) => {
                        await removeExpiredSubscription(sub.id, err.statusCode);
                        throw err;
                    })
            )
        );

        res.status(200).json({
            sent: results.filter((r) => r.status === 'fulfilled').length,
            total: results.length,
        });
    } catch (err) {
        console.error('[send-notification] unexpected error:', err);
        res.status(500).json({ error: 'Internal error' });
    }
}
