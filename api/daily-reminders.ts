import type { VercelRequest, VercelResponse } from '@vercel/node';
import { tomorrowDate } from './_lib/dates';
import { ALL_CHECKS } from './_lib/reminders';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') return res.status(405).end();

    const authHeader = req.headers['x-push-secret'];
    if (authHeader !== process.env.PUSH_SEND_SECRET) return res.status(401).end();

    const tomorrow = tomorrowDate();
    let sentCount = 0;
    const queryErrors: string[] = [];

    for (const check of ALL_CHECKS) {
        const result = await check(tomorrow);
        sentCount += result.sent;
        if (result.error) queryErrors.push(result.error);
    }

    res.status(200).json({
        sent: sentCount,
        date: tomorrow,
        ...(queryErrors.length > 0 && { failedQueries: queryErrors }),
    });
}
