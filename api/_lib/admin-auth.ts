import type { VercelRequest } from '@vercel/node';
import { supabase } from './push.js';

/**
 * Перевіряє, що запит прийшов від адміністратора сайту: у заголовку
 * Authorization є справжній токен входу, а користувач записаний у таблиці admins.
 * Так само працює перевірка в notify-subscription-activated.
 * Будь-який збій вважається відмовою (закрито за замовчуванням).
 */
export async function isAdminRequest(req: VercelRequest): Promise<boolean> {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return false;

    try {
        const { data: userData, error: userError } = await supabase.auth.getUser(token);
        if (userError || !userData?.user) return false;

        const { data: admin, error: adminError } = await supabase
            .from('admins')
            .select('user_id')
            .eq('user_id', userData.user.id)
            .maybeSingle();
        if (adminError) {
            console.error('[admin-auth] admins query failed:', adminError);
            return false;
        }
        return Boolean(admin);
    } catch (err) {
        console.error('[admin-auth] unexpected error:', err);
        return false;
    }
}
