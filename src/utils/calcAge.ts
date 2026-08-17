// ── Спільна утиліта для розрахунку віку кролика ────────────────────
// Наближений розрахунок (місяць = 30 днів), як і раніше в проєкті.
// Винесено сюди, щоб не дублювати логіку в RabbitRegistry, RabbitPublic
// та інших місцях, де показується вік тварини.

/** Кількість повних днів від дати народження до сьогодні. */
export function calcAgeDays(birthDate: string): number {
    const birth = new Date(birthDate);
    const today = new Date();
    return Math.floor(
        (today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24),
    );
}

/** Людський підпис віку: "1 р. 4 міс.", "3 міс. 12 дн.", "18 дн." */
export function calcAgeLabel(birthDate: string): string {
    const days = calcAgeDays(birthDate);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years >= 1) {
        const remMonths = Math.floor((days - years * 365) / 30);
        return remMonths > 0 ? `${years} р. ${remMonths} міс.` : `${years} р.`;
    }
    if (months >= 1) {
        const remDays = days - months * 30;
        return remDays > 0 ? `${months} міс. ${remDays} дн.` : `${months} міс.`;
    }
    return `${days} дн.`;
}