import * as Sentry from '@sentry/react';

/**
 * Централізована точка логування помилок.
 * Виводить помилку в консоль з контекстом і надсилає її в Sentry
 * (у режимі розробки Sentry не ініціалізований, тож виклик нічого не робить).
 */
export function logError(context: string, error: unknown) {
    console.error(`[${context}]`, error);

    // Логер ніколи не повинен ламати застосунок
    try {
        const { exception, extra } = toException(error);
        Sentry.captureException(exception, { tags: { context }, extra });
    } catch {
        // ігноруємо збій самого логування
    }
}

// Помилки Supabase (PostgrestError) — звичайні об'єкти, а не Error. Sentry
// групує їх погано, тому перетворюємо на Error. Поле details не передаємо:
// воно може містити значення з рядків таблиць (персональні дані).
function toException(error: unknown): {
    exception: Error;
    extra: Record<string, unknown>;
} {
    if (error instanceof Error) {
        return { exception: error, extra: {} };
    }
    if (typeof error === 'object' && error !== null) {
        const source = error as { message?: unknown; code?: unknown; hint?: unknown };
        const message = typeof source.message === 'string' ? source.message : 'Невідома помилка';
        return {
            exception: new Error(message),
            extra: { code: source.code, hint: source.hint },
        };
    }
    return { exception: new Error(String(error)), extra: {} };
}