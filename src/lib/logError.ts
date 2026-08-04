/**
 * Централізована точка логування помилок.
 * Зараз просто виводить у консоль з контекстом,
 * але пізніше сюди легко підключити зовнішній сервіс
 * (Sentry, LogRocket тощо) — без переписування коду
 * по всьому проєкту.
 */
export function logError(context: string, error: unknown) {
    console.error(`[${context}]`, error);
}