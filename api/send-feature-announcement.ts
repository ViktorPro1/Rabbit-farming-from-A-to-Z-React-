import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './_lib/push.js';
import { sendEmail } from './_lib/email.js';
import { renderTemplate } from './_lib/email-templates.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') return res.status(405).end();

    const authHeader = req.headers['x-send-secret'];
    if (authHeader !== process.env.SEND_EMAIL_SECRET) return res.status(401).end();

    const { description } = req.body;
    if (!description) return res.status(400).json({ error: 'Missing description' });

    const { data, error } = await supabase.from('profiles').select('email');
    if (error) {
        console.error('[send-feature-announcement] profiles query failed:', error);
        return res.status(500).json({ error: 'Failed to load users' });
    }

    let sent = 0;
    for (const p of data ?? []) {
        if (!p.email) continue;
        const html = renderTemplate('lyst-anons_novogo_funktsionalu.html', {
            OPYS_FUNKTSII: description,
        });
        const ok = await sendEmail(p.email, 'Що нового в кабінеті', html);
        if (ok) sent++;
    }

    res.status(200).json({ sent, total: data?.length ?? 0 });
}
