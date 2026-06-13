export interface ChangelogEntry {
    id: number;
    title: string;
    description?: string;
    created_at: string; // формат: "YYYY-MM-DD"
}

export const CHANGELOG: ChangelogEntry[] = [
    {
        id: 1,
        title: "Нові породи в довіднику",
        description: "Додано 5 нових порід з фото та описом.",
        created_at: "2026-05-28",
    },
    {
        id: 2,
        title: "Виправлено калькулятор корму",
        description: "Тепер правильно рахує для кролематок.",
        created_at: "2026-06-05",
    },
    {
        id: 3,
        title: "Додано розділ «Хвороби кроликів»",
        description: "Повний довідник хвороб з симптомами та лікуванням.",
        created_at: "2026-06-12",
    },
    {
        id: 4,
        title: "Нові розділи та SEO оновлення",
        description: "Додано сторінки: проблемна поведінка, визначення статі, линька, переробка гною, клітки своїми руками.",
        created_at: "2026-06-13",
    },
];