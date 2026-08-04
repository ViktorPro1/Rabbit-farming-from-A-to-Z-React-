import type { Message } from "./types";
import { quickReplies } from "./quickReplies";
import { getTimeGreeting } from "./getTimeGreeting";
import { groups } from "../../data/sectionCards";

export function getBotResponse(userText: string): Message {
    const msgLower = userText.toLowerCase();

    // 1. ПЕРЕВІРКА НА МОВУ АГРЕСОРА
    const russianChars = /[ыэъё]/i;
    if (russianChars.test(msgLower)) {
        return {
            sender: "bot",
            text: "Вибачте, я не володію і не маю наміру спілкуватися мовою країни-агресора. Будь ласка, пишіть українською. 🇺🇦",
        };
    }

    // 2. ПАТРІОТИЧНЕ ВІТАННЯ
    if (
        msgLower.includes("слава україні") ||
        msgLower.includes("героям слава")
    ) {
        return {
            sender: "bot",
            text: "Героям Слава! Разом до перемоги! 🇺🇦 Дякую за патріотизм. Чим можу допомогти вашому господарству?",
        };
    }

    // 3. QUICK-ВІДПОВІДІ — конкретні симптоми та питання (ПРІОРИТЕТ)
    for (const reply of quickReplies) {
        if (reply.roots.some((root) => msgLower.includes(root))) {
            return {
                sender: "bot",
                text: reply.answer,
                path: reply.path,
                linkLabel: reply.path ? "Детальніше на сайті" : undefined,
            };
        }
    }

    // 4. ПОШУК ПО БАЗІ ЗНАНЬ (ПРІОРИТЕТ над вітанням)
    for (const group of groups) {
        for (const card of group.cards) {
            const hasKeyword = card.keywords.some((kw: string) =>
                msgLower.includes(kw.toLowerCase()),
            );
            const hasTitle = msgLower.includes(card.title.toLowerCase());

            if (hasKeyword || hasTitle) {
                return {
                    sender: "bot",
                    text: `По вашому запиту знайдено інформацію у розділі «${card.title}» — ${card.desc}. Перейдіть за посиланням нижче, щоб ознайомитися з детальними порадами.`,
                    path: card.path,
                    linkLabel: `Відкрити розділ «${card.title}»`,
                };
            }
        }
    }

    // 5. ВВІЧЛИВІСТЬ — Привітання (тільки якщо не знайдено симптомів)
    const greetings = [
        "привіт",
        "добрий день",
        "вітаю",
        "доброго дня",
        "добрий ранок",
        "добрий вечір",
        "доброго ранку",
        "доброго вечора",
        "хай",
    ];
    if (greetings.some((word) => msgLower.includes(word))) {
        const greeting = getTimeGreeting();
        return {
            sender: "bot",
            text: `${greeting}! Опишіть проблему або запитайте про породи, догляд чи годування — постараюсь допомогти.`,
        };
    }

    // 6. ВВІЧЛИВІСТЬ — Подяка
    const thanks = ["дякую", "спасибі", "дякую велике", "дуже дякую"];
    if (thanks.some((word) => msgLower.includes(word))) {
        return {
            sender: "bot",
            text: "Радий був бути корисним! Нехай ваші кролі ростуть здоровими. 🐰 Якщо виникнуть ще запитання — звертайтесь.",
        };
    }

    // 7. НІЧОГО НЕ ЗНАЙДЕНО
    return {
        sender: "bot",
        text: "Я уважно вас прочитав, але не знайшов точної відповіді у базі знань. Спробуйте уточнити: наприклад, «пронос», «вакцинація», «годування взимку» або назву породи.",
    };
}