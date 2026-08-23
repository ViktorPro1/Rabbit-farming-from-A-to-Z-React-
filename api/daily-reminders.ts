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
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function tomorrowDate(): string {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

async function sendToUser(userId: string, title: string, body: string, url: string) {
    const { data: subs } = await supabase
        .from('push_subscriptions')
        .select('*')
        .eq('user_id', userId);

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
                    if (err.statusCode === 410 || err.statusCode === 404) {
                        await supabase.from('push_subscriptions').delete().eq('id', sub.id);
                    }
                })
        )
    );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') return res.status(405).end();

    const authHeader = req.headers['x-push-secret'];
    if (authHeader !== process.env.PUSH_SEND_SECRET) return res.status(401).end();

    const tomorrow = tomorrowDate();
    let sentCount = 0;

    const { data: controlMatings } = await supabase
        .from('matings')
        .select('user_id, female_cage, male_cage')
        .eq('control_date', tomorrow)
        .eq('is_archived', false);

    for (const m of controlMatings ?? []) {
        await sendToUser(
            m.user_id,
            '🐇 Контрольна злучка завтра',
            `Клітка ${m.female_cage || '?'} × ${m.male_cage || '?'} — перевір завтра.`,
            '/matings'
        );
        sentCount++;
    }

    const { data: expectedBirths } = await supabase
        .from('matings')
        .select('user_id, female_cage')
        .eq('expected_birth', tomorrow)
        .eq('is_archived', false);

    for (const m of expectedBirths ?? []) {
        await sendToUser(
            m.user_id,
            '🐰 Очікуваний окріл завтра',
            `Клітка ${m.female_cage || '?'} — готуй гніздо.`,
            '/matings'
        );
        sentCount++;
    }

    const { data: repeatControls } = await supabase
        .from('litters')
        .select('user_id, mother_id, weaned_males_cage, weaned_females_cage')
        .eq('litter_control_date', tomorrow);

    for (const l of repeatControls ?? []) {
        await sendToUser(
            l.user_id,
            '🐇 Контрольна злучка завтра (повторна)',
            'Перевір самку — контрольна дата повторної злучки.',
            '/matings'
        );
        sentCount++;
    }

    const { data: repeatBirths } = await supabase
        .from('litters')
        .select('user_id')
        .eq('litter_expected_birth', tomorrow);

    for (const l of repeatBirths ?? []) {
        await sendToUser(
            l.user_id,
            '🐰 Очікуваний окріл завтра (повторний)',
            'Готуй гніздо — очікується повторний окріл.',
            '/matings'
        );
        sentCount++;
    }

    const { data: vaccinations } = await supabase
        .from('vaccinations')
        .select('user_id, cage_number, vaccine_name')
        .eq('next_date', tomorrow);

    for (const v of vaccinations ?? []) {
        await sendToUser(
            v.user_id,
            '💉 Вакцинація завтра',
            `Клітка ${v.cage_number || '?'} — ${v.vaccine_name || 'щеплення'}.`,
            '/my-vaccinations'
        );
        sentCount++;
    }

    res.status(200).json({ sent: sentCount, date: tomorrow });
}