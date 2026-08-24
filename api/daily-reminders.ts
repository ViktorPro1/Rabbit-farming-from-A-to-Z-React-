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

const WEANING_SCHEME_DAYS: Record<string, number> = {
    intensive: 28,
    semi_intensive: 45,
    extensive: 60,
};

function tomorrowDate(): string {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function addDays(dateStr: string, days: number): string {
    const d = new Date(dateStr + 'T00:00:00Z');
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().slice(0, 10);
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

    // 1. Контрольна злучка завтра (перша злучка, таблиця matings)
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

    // 2. Очікуваний окріл завтра (перша злучка, таблиця matings)
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

    // 3. Повторна контрольна злучка завтра (після попереднього окролу, таблиця litters)
    const { data: repeatControls } = await supabase
        .from('litters')
        .select('user_id, mother_id')
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

    // 4. Повторний очікуваний окріл завтра (таблиця litters)
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

    // 5. Підготовка маточника завтра (litter_mating_date + 26 днів, ще не поставлений і окролу ще немає)
    const { data: nestboxCandidates } = await supabase
        .from('litters')
        .select('user_id, litter_mating_date, mating_id')
        .is('birth_date', null)
        .is('nestbox_date', null)
        .not('litter_mating_date', 'is', null);

    for (const l of nestboxCandidates ?? []) {
        if (addDays(l.litter_mating_date, 26) === tomorrow) {
            await sendToUser(
                l.user_id,
                '📥 Підготувати маточник завтра',
                'Окріл наближається — час поставити маточник.',
                '/matings'
            );
            sentCount++;
        }
    }

    // 6. Відлучення завтра (birth_date + дні за схемою злучування, ще не відлучено)
    const { data: weaningCandidates } = await supabase
        .from('litters')
        .select('user_id, birth_date, mating_id')
        .not('birth_date', 'is', null)
        .is('weaned_date', null);

    const matingIds = [...new Set((weaningCandidates ?? []).map((l) => l.mating_id).filter(Boolean))];
    const schemeByMatingId: Record<string, string> = {};
    if (matingIds.length > 0) {
        const { data: matingsForScheme } = await supabase
            .from('matings')
            .select('id, breeding_scheme')
            .in('id', matingIds);
        (matingsForScheme ?? []).forEach((m) => {
            schemeByMatingId[m.id] = m.breeding_scheme || 'extensive';
        });
    }

    for (const l of weaningCandidates ?? []) {
        const scheme = schemeByMatingId[l.mating_id] || 'extensive';
        const weaningDays = WEANING_SCHEME_DAYS[scheme] ?? WEANING_SCHEME_DAYS.extensive;
        if (addDays(l.birth_date, weaningDays) === tomorrow) {
            await sendToUser(
                l.user_id,
                '✂️ Відлучення завтра',
                'Крільченята готові до відлучення від матки.',
                '/matings'
            );
            sentCount++;
        }
    }


    // 7. Забій завтра (клітки відгодівлі, planned slaughter_date)
    const { data: slaughterCages } = await supabase
        .from('fattening')
        .select('user_id, cage_number, breed')
        .eq('slaughter_date', tomorrow)
        .eq('is_active', true);

    for (const c of slaughterCages ?? []) {
        await sendToUser(
            c.user_id,
            '🔪 Забій завтра',
            `Клітка ${c.cage_number || '?'}${c.breed ? ` — ${c.breed}` : ''} — планова дата забою.`,
            '/fattening'
        );
        sentCount++;
    }

    // 8. Лікування — наступний прийом препарату завтра
    const { data: treatmentsDue } = await supabase
        .from('treatments')
        .select('user_id, cage_number, drug_name')
        .eq('next_date', tomorrow);

    for (const t of treatmentsDue ?? []) {
        await sendToUser(
            t.user_id,
            '💊 Лікування завтра',
            `Клітка ${t.cage_number || '?'} — ${t.drug_name || 'наступний прийом препарату'}.`,
            '/my-treatments'
        );
        sentCount++;
    }

    // 9. Вакцинація завтра
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