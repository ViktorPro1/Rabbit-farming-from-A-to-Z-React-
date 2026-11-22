import type { VercelRequest, VercelResponse } from '@vercel/node';
import { tomorrowDate } from './_lib/dates.js';
import { ALL_CHECKS } from './_lib/reminders.js';
import { isAuthorized } from './_lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') return res.status(405).end();

    if (!isAuthorized(req, 'x-push-secret', process.env.PUSH_SEND_SECRET)) return res.status(401).end();

    const tomorrow = tomorrowDate();
    let sentCount = 0;
    const queryErrors: string[] = [];

    for (const [index, check] of ALL_CHECKS.entries()) {
        // Несподіване виключення в одній перевірці (збій мережі, помилка в даних)
        // не повинно зупиняти решту: інакше користувачі не отримають інші нагадування.
        try {
            const result = await check(tomorrow);
            sentCount += result.sent;
            if (result.error) queryErrors.push(result.error);
        } catch (err) {
            const name = check.name || `check#${index + 1}`;
            console.error(`[daily-reminders] ${name} threw:`, err);
            queryErrors.push(name);
        }
    }

    // Відповідь завжди 200, навіть із помилками: це cron, і повторний запуск
    // надіслав би вже доставлені нагадування вдруге. Збої видно в failedQueries.
    res.status(200).json({
        sent: sentCount,
        date: tomorrow,
        ...(queryErrors.length > 0 && { failedQueries: queryErrors }),
    });
}
