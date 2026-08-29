import webpush, { WebPushError } from 'web-push';
import { createClient } from '@supabase/supabase-js';

webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.VITE_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
);

export const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // service role — ТІЛЬКИ на сервері, не VITE_*
);

export { webpush, WebPushError };

/**
 * Видаляє підписку, якщо push-провайдер повернув 410/404 (підписка більше не дійсна).
 */
export async function removeExpiredSubscription(subId: string, statusCode?: number) {
    if (statusCode !== 410 && statusCode !== 404) return;

    const { error: deleteError } = await supabase
        .from('push_subscriptions')
        .delete()
        .eq('id', subId);

    if (deleteError) {
        console.error(`[removeExpiredSubscription] failed to delete subscription ${subId}:`, deleteError);
    }
}

/**
 * Надсилає push усім підпискам конкретного користувача.
 * Використовується для масових щоденних сповіщень (daily-reminders) —
 * помилки логуються, але не прокидаються далі, щоб один "мертвий" підписник
 * не зупиняв розсилку іншим користувачам.
 */
export async function sendToUser(userId: string, title: string, body: string, url: string) {
    const { data: subs, error: subsError } = await supabase
        .from('push_subscriptions')
        .select('*')
        .eq('user_id', userId);

    if (subsError) {
        console.error(`[sendToUser] failed to fetch subscriptions for user ${userId}:`, subsError);
        return;
    }

    console.log(`sendToUser ${userId}: found ${subs?.length ?? 0} subscription(s)`);

    await Promise.allSettled(
        (subs ?? []).map((sub) =>
            webpush
                .sendNotification(
                    { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
                    JSON.stringify({ title, body, url })
                )
                .then(() => {
                    console.log(`push OK -> subscription ${sub.id}`);
                })
                .catch(async (err: WebPushError) => {
                    console.error(
                        `push FAILED -> subscription ${sub.id}, status ${err.statusCode}, body: ${err.body}`
                    );
                    await removeExpiredSubscription(sub.id, err.statusCode);
                })
        )
    );
}
