import { timingSafeEqual } from 'node:crypto';
import type { VercelRequest } from '@vercel/node';

/**
 * Перевіряє секрет у заголовку. Закрита за замовчуванням:
 * якщо секрет не заданий на сервері або заголовок відсутній — відмова.
 * headerName передавати в нижньому регістрі (Node так їх нормалізує).
 */
export function isAuthorized(
    req: VercelRequest,
    headerName: string,
    expected: string | undefined
): boolean {
    if (!expected) {
        console.error(`[auth] Секрет для заголовка "${headerName}" не заданий у змінних оточення`);
        return false;
    }

    const raw = req.headers[headerName];
    const provided = Array.isArray(raw) ? raw[0] : raw;
    if (!provided) return false;

    const a = Buffer.from(provided);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;

    return timingSafeEqual(a, b);
}
