import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendEmail } from './_lib/email.js';
import { renderTemplate } from './_lib/email-templates.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') return res.status(405).end();

    const authHeader = req.headers['x-webhook-secret'];
    if (authHeader !== process.env.SUPABASE_WEBHOOK_SECRET) return res.status(401).end();

    const email = req.body?.record?.email;
    if (!email) return res.status(400).json({ error: 'Missing email in record' });

    try {
        const html = renderTemplate('lyst-vitannya_pislya_reyestratsii.html');
        const ok = await sendEmail(email, 'Вітаємо в «Кролівництво від А до Я»!', html);
        res.status(200).json({ success: ok });
    } catch (err) {
        console.error('[welcome-email]', err);
        res.status(502).json({ error: 'Failed to send welcome email' });
    }
}