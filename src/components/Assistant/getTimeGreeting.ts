export function getTimeGreeting(): string {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Доброго ранку";
    if (hour >= 12 && hour < 17) return "Доброго дня";
    if (hour >= 17 && hour < 22) return "Доброго вечора";
    return "Доброї ночі";
}