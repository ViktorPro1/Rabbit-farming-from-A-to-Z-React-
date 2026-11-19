// Допоміжна логіка нумерації. Номер кролика зберігається в кінці поля name
// ("VK-F011", а раніше — "Кроличка 10"), окремого поля для номера в базі немає.

export interface NamedRabbit {
    name: string;
    gender: "male" | "female";
}

export interface NumberingInfo {
    // Найбільший використаний номер (0, якщо тварин цієї статі ще немає)
    last: number;
    // Наступний вільний номер
    next: number;
    // Скільки тварин цієї статі мають номер в імені
    count: number;
}

// Дістає число з кінця імені: "VK-F011" -> 11, "Кроличка 10" -> 10.
// Якщо числа в кінці немає (наприклад, "Барсик") — null.
export function extractNumber(name: string): number | null {
    const match = (name || "").trim().match(/(\d+)\s*$/);
    return match ? parseInt(match[1], 10) : null;
}

// Усі числа з імен тварин цієї статі (імена без числа в кінці пропускаються)
function usedNumbers(list: NamedRabbit[], gender: "male" | "female"): number[] {
    return list
        .filter((r) => r.gender === gender)
        .map((r) => extractNumber(r.name))
        .filter((n): n is number => n !== null);
}

// Рахує окремо для кожної статі. Префікс (ініціали) не впливає на підрахунок:
// важливо лише число в кінці імені.
export function getNumberingInfo(
    list: NamedRabbit[],
    gender: "male" | "female",
): NumberingInfo {
    const numbers = usedNumbers(list, gender);

    // Math.max(...[]) дає -Infinity, тому порожній список обробляємо окремо
    const last = numbers.length > 0 ? Math.max(...numbers) : 0;
    return { last, next: last + 1, count: numbers.length };
}

// Додано (пропуски): номери від 1 до останнього використаного, яких немає
// серед тварин цієї статі. Напр. є 1, 2, 4, 8 -> пропуски [3, 5, 6, 7].
export function findGaps(
    list: NamedRabbit[],
    gender: "male" | "female",
): number[] {
    const numbers = usedNumbers(list, gender);
    if (numbers.length === 0) return [];
    const used = new Set(numbers);
    const last = Math.max(...numbers);
    const gaps: number[] = [];
    for (let i = 1; i < last; i++) {
        if (!used.has(i)) gaps.push(i);
    }
    return gaps;
}

// Транслітерація першої літери (спрощено, за мотивами правопису КМУ 2010).
// Для ініціалів потрібна одна латинська літера, тому беремо лише першу.
const TRANSLIT: Record<string, string> = {
    а: "A", б: "B", в: "V", г: "H", ґ: "G", д: "D", е: "E", є: "Y", ж: "Z",
    з: "Z", и: "Y", і: "I", ї: "Y", й: "Y", к: "K", л: "L", м: "M", н: "N",
    о: "O", п: "P", р: "R", с: "S", т: "T", у: "U", ф: "F", х: "K", ц: "T",
    ч: "C", ш: "S", щ: "S", ю: "Y", я: "Y",
};

// "Віктор Козак" -> "VK". Беремо перші літери перших двох слів.
// Якщо імені немає — порожній рядок (тоді код буде без префікса).
export function ownerInitials(displayName: string | null | undefined): string {
    const words = (displayName || "").trim().split(/\s+/).filter(Boolean).slice(0, 2);
    return words
        .map((word) => {
            const first = Array.from(word).find((ch) => /\p{L}/u.test(ch));
            if (!first) return "";
            const letter = (TRANSLIT[first.toLowerCase()] ?? first).toUpperCase();
            return /^[A-Z]$/.test(letter) ? letter : "";
        })
        .join("");
}

// Літера статі в коді: M — самець, F — самка
export const GENDER_LETTER = { male: "M", female: "F" } as const;

// ("VK", "female", 11) -> "VK-F011"; без префікса: "F011"
export function buildCode(
    prefix: string,
    gender: "male" | "female",
    number: number,
): string {
    const body = `${GENDER_LETTER[gender]}${String(number).padStart(3, "0")}`;
    return prefix ? `${prefix}-${body}` : body;
}

// Готова підказка для нового кролика цієї статі
export function suggestCode(
    list: NamedRabbit[],
    gender: "male" | "female",
    prefix: string,
): string {
    return buildCode(prefix, gender, getNumberingInfo(list, gender).next);
}