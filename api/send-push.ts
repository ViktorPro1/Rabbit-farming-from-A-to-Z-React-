import webpush, { WebPushError } from 'web-push';
import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.VITE_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
);

const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // service role — ТІЛЬКИ на сервері, не VITE_*
);

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
                    if (err.statusCode === 410 || err.statusCode === 404) {
                        await supabase.from('push_subscriptions').delete().eq('id', sub.id);
                    }
                    throw err;
                })
        )
    );

    res.status(200).json({ sent: results.filter((r) => r.status === 'fulfilled').length });
}