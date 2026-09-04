import type { VercelRequest, VercelResponse } from '@vercel/node';
import { transporter, FROM_ADDRESS } from './_lib/email.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') return res.status(405).end();

    const authHeader = req.headers['x-send-secret'];
    if (authHeader !== process.env.SEND_EMAIL_SECRET) return res.status(401).end();

    const { to, subject, html } = req.body;
    if (!to || !subject || !html) return res.status(400).json({ error: 'Missing to, subject or html' });

    try {
        const info = await transporter.sendMail({ from: FROM_ADDRESS, to, subject, html });
        res.status(200).json({ success: true, id: info.messageId });
    } catch (err) {
        console.error('[send-email]', err);
        res.status(502).json({ error: 'Failed to send email' });
    }
}
