import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './_lib/push.js';
import { sendEmail } from './_lib/email.js';
import { renderTemplate } from './_lib/email-templates.js';

// Текст, якщо в користувача немає дати завершення доступу (access_until = null)
const NO_DATE_TEXT = 'найближчим часом';

// access_until — timestamptz. Адмінка записує дату як північ за UTC,
// тому беремо UTC-дату (так само, як решта логіки в api/_lib/reminders.ts).
function formatAccessUntil(value: string | null | undefined): string {
    if (!value) return NO_DATE_TEXT;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return NO_DATE_TEXT;
    const [year, month, day] = date.toISOString().slice(0, 10).split('-');
    return `${day}.${month}.${year}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') return res.status(405).end();

    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).end();

    // Той самий принцип перевірки адміна, що й у notify-subscription-activated.ts
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData?.user) return res.status(401).end();

    const { data: admin } = await supabase
        .from('admins')
        .select('user_id')
        .eq('user_id', userData.user.id)
        .maybeSingle();
    if (!admin) return res.status(403).end();

    // Змінено: req.body ?? {} — порожнє тіло запиту давало необроблену помилку 500
    const { email } = req.body ?? {};
    if (!email) return res.status(400).json({ error: 'Missing email' });

    // Додано: дата для листа береться з бази. Скасування підписки змінює лише
    // plan_type, а access_until лишається, тому порядок викликів в адмінці не впливає.
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('access_until')
        .eq('email', email)
        .maybeSingle();
    if (profileError) {
        console.error('[notify-subscription-cancelled] profile query failed:', profileError);
    }

    try {
        const html = renderTemplate('lyst-pidpyska_skasovana.html', {
            DATA: formatAccessUntil(profile?.access_until),
        });
        const ok = await sendEmail(email, 'Вашу підписку скасовано', html);
        res.status(200).json({ success: ok });
    } catch (err) {
        console.error('[notify-subscription-cancelled]', err);
        res.status(502).json({ error: 'Failed to send email' });
    }
}