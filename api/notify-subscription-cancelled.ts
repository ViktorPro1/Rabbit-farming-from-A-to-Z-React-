import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './_lib/push.js';
import { sendEmail } from './_lib/email.js';
import { renderTemplate } from './_lib/email-templates.js';

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

    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Missing email' });

    try {
        const html = renderTemplate('lyst-pidpyska_skasovana.html');
        const ok = await sendEmail(email, 'Вашу підписку скасовано', html);
        res.status(200).json({ success: ok });
    } catch (err) {
        console.error('[notify-subscription-cancelled]', err);
        res.status(502).json({ error: 'Failed to send email' });
    }
}
