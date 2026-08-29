import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase, webpush, WebPushError, removeExpiredSubscription } from './_lib/push.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') return res.status(405).end();

    const authHeader = req.headers['x-push-secret'];
    if (authHeader !== process.env.PUSH_SEND_SECRET) return res.status(401).end();

    const { title, body, url, userId } = req.body;

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

    res.status(200).json({ sent: results.filter((r) => r.status === 'fulfilled').length });
}
