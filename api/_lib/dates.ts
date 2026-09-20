// Дати за календарем Києва. Vercel працює в UTC, тому new Date().toISOString()
// дає "завтра за UTC", а не за Києвом. Логіка дзеркальна до src/utils/kyivDate.ts
// (api/ збирається окремо від src/, тому імпортувати звідти не можна).

const KYIV_TIME_ZONES = ['Europe/Kyiv', 'Europe/Kiev'];

function createFormatter(): Intl.DateTimeFormat {
    for (const timeZone of KYIV_TIME_ZONES) {
        try {
            return new Intl.DateTimeFormat('en-US', {
                timeZone,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            });
        } catch {
            // Середовище не знає цю назву — пробуємо наступну
        }
    }
    console.error('Часовий пояс Києва недоступний, використовується UTC');
    return new Intl.DateTimeFormat('en-US', {
        timeZone: 'UTC',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
}

const formatter = createFormatter();

/** Сьогоднішня дата за Києвом у форматі YYYY-MM-DD. */
export function todayKyiv(): string {
    const parts = formatter.formatToParts(new Date());
    const get = (type: string) => parts.find((part) => part.type === type)?.value ?? '';
    return `${get('year')}-${get('month')}-${get('day')}`;
}

/** Завтрашня дата за Києвом у форматі YYYY-MM-DD. */
export function tomorrowDate(): string {
    return addDays(todayKyiv(), 1);
}

/**
 * Додає (або віднімає) дні до календарної дати YYYY-MM-DD.
 * Арифметика над датою без часу, тому toISOString безпечний (усе в UTC).
 */
export function addDays(dateStr: string, days: number): string {
    const d = new Date(dateStr + 'T00:00:00Z');
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().slice(0, 10);
}