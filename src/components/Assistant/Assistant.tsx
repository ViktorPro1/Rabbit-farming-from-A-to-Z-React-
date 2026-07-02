import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Assistant.css";
import { groups } from "../../data/sectionCards";

// --- ТИПИ ДАНИХ ---
interface Message {
  sender: "bot" | "user";
  text: string;
  path?: string;
  linkLabel?: string;
}

// --- QUICK-ВІДПОВІДІ ДЛЯ ДИСКУСІЇ ---
// roots: короткі корені слів — знаходять усі форми (поносить/пронос/діарея тощо)
const quickReplies: { roots: string[]; answer: string; path?: string }[] = [
  {
    roots: ["понос", "прон", "рідкий кал", "діарея", "рідкий посл"],
    answer:
      "Пронос у кроля — серйозний симптом. Найчастіші причини: різка зміна раціону, кокцидіоз, дисбактеріоз, отруєння. Перше: прибрати соковиті корми, дати більше сіна та чистої води. Якщо стан не покращується протягом 12 годин — потрібен ветеринар.",
    path: "/diseases",
  },
  {
    roots: [
      "не їсть",
      "не їв",
      "відмов",
      "погано їсть",
      "перестав їсти",
      "не хоче їсти",
    ],
    answer:
      "Відмова від їжі у кроля може вказувати на ШКТ-стаз, здуття, стрес або початок хвороби. Перевірте: чи є перистальтика (звуки в животику), чи є кал. Якщо кроль не їв понад 6–8 годин — це термінова ситуація, зверніться до ветеринара.",
    path: "/biology",
  },
  {
    roots: ["чха", "чих", "нежит", "сопит", "виділення з нос", "соплі"],
    answer:
      "Чхання та виділення з носа найчастіше вказують на пастерельоз або риніт. Інфекція може швидко поширитись на все поголів'я. Ізолюйте тварину та зверніться до ветеринара для призначення антибіотиків.",
    path: "/diseases",
  },
  {
    roots: ["скільки живут", "тривалість життя", "вік крол"],
    answer:
      "Домашні кролі живуть у середньому 8–12 років за хорошого догляду. М'ясні породи на фермі — значно менше, зазвичай до забою у 3–5 місяців. Вік сильно залежить від умов утримання, харчування та своєчасної ветеринарної допомоги.",
  },
  {
    roots: ["норма корм", "скільки їсть", "скільки сін", "скільки корм"],
    answer:
      "Дорослий кролик (4–5 кг) потребує приблизно: сіно — необмежено (основа раціону), гранульований корм — 100–150 г на добу, овочі — 50–100 г. Крільченята та годуючі самки потребують більше. Детальні норми — на сторінці годування.",
    path: "/feeding",
  },
  {
    roots: ["скільки води", "норма води", "мало п'є", "не п'є воду"],
    answer:
      "Дорослий кролик випиває 100–600 мл води на добу залежно від раціону, температури та фізіологічного стану. Годуючі самки — до 1 літра. Якщо кроль п'є дуже мало — перевірте поїлку та якість води.",
    path: "/water",
  },
  {
    roots: ["вагітн", "тільна", "сукрільн"],
    answer:
      "Вагітність у кролиці триває 28–32 дні (у середньому 31 день). Ознаки: збільшення живота після 2-го тижня, укладання гнізда за 1–3 дні до окролу. За 3–4 дні до очікуваної дати поставте маточник із сіном.",
    path: "/biology",
  },
  {
    roots: ["кусає", "кусаєт", "агресивн", "нападає"],
    answer:
      "Агресія у кролів частіше зустрічається у нестерилізованих особин. Причини: страх, захист території, гормони. Нестерилізована самка може кусатися особливо агресивно в період псевдовагітності. Рекомендую розглянути кастрацію/стерилізацію.",
  },
  {
    roots: [
      "визначити стать",
      "стать крол",
      "самець чи самка",
      "хлопчик чи дівчинка",
    ],
    answer:
      "У молодих крільченят (до 3 тижнів) визначити стать складно. У дорослих: у самця яскраво виражені яєчка (у теплу погоду опускаються), у самки — петля (зовнішній статевий орган витягнутий). Огляд проводять обережно, тримаючи тварину спиною донизу.",
  },
  {
    roots: [
      "скільки крільчен",
      "скільки малят",
      "розмір окролу",
      "скільки народжу",
    ],
    answer:
      "Середній окрол: 6–10 крільченят. Молоді самки першого окролу зазвичай народжують 4–6. Великі породи — менше, карлики — менше. Максимум може бути 12–15, але виживаність великих окролів нижча через нестачу молока.",
  },
  {
    roots: ["лисин", "випадає шерст", "лисіє", "облисін"],
    answer:
      "Випадіння шерсті може бути через линьку (норма), короста (кліщі), дерматофітоз (грибок) або авітаміноз. Якщо є почервоніння шкіри, кірочки або кроль чухається — швидше за все паразити чи грибок, потрібна обробка.",
    path: "/parasites",
  },
  {
    roots: ["здут", "роздут", "живіт великий", "пучить", "гази"],
    answer:
      "Здуття у кроля — небезпечний стан. Причини: неправильне годування, ШКТ-стаз, бродіння. Ознаки: твердий живіт, відмова від їжі, малорухливість. Масаж живота по годинниковій стрілці, прибрати всі корми крім сіна. Якщо немає покращення за 2–3 години — терміново до ветеринара.",
    path: "/biology",
  },
  {
    roots: ["нахил голов", "голова набік", "крутить голов", "торчколиц"],
    answer:
      "Нахил голови (torticollis) — серйозний симптом. Найчастіші причини: енцефалітозооноз (E. cuniculi), отит, пастерельоз. Потрібна термінова діагностика та лікування у ветеринара. Без лікування стан прогресує.",
    path: "/diseases",
  },
];

const getTimeGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Доброго ранку";
  if (hour >= 12 && hour < 17) return "Доброго дня";
  if (hour >= 17 && hour < 22) return "Доброго вечора";
  return "Доброї ночі";
};

const Assistant = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [greeted, setGreeted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const handleOpen = () => {
    if (!open && !greeted) {
      setGreeted(true);
      const greeting = getTimeGreeting();
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: `${greeting}! Радий вас бачити. Чим можу допомогти вашому господарству сьогодні?`,
          },
        ]);
      }, 400);
    }
    setOpen(!open);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userText = input.trim();
    const msgLower = userText.toLowerCase();

    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInput("");

    setTimeout(() => {
      let botResponse: Message | null = null;

      // 1. ПЕРЕВІРКА НА МОВУ АГРЕСОРА
      const russianChars = /[ыэъё]/i;
      if (russianChars.test(msgLower)) {
        botResponse = {
          sender: "bot",
          text: "Вибачте, я не володію і не маю наміру спілкуватися мовою країни-агресора. Будь ласка, пишіть українською. 🇺🇦",
        };
      }

      // 2. ПАТРІОТИЧНЕ ВІТАННЯ
      if (
        !botResponse &&
        (msgLower.includes("слава україні") ||
          msgLower.includes("героям слава"))
      ) {
        botResponse = {
          sender: "bot",
          text: "Героям Слава! Разом до перемоги! 🇺🇦 Дякую за патріотизм. Чим можу допомогти вашому господарству?",
        };
      }

      // 3. QUICK-ВІДПОВІДІ — конкретні симптоми та питання (ПРІОРИТЕТ)
      if (!botResponse) {
        for (const reply of quickReplies) {
          if (reply.roots.some((root) => msgLower.includes(root))) {
            botResponse = {
              sender: "bot",
              text: reply.answer,
              path: reply.path,
              linkLabel: reply.path ? "Детальніше на сайті" : undefined,
            };
            break;
          }
        }
      }

      // 4. ПОШУК ПО БАЗІ ЗНАНЬ (ПРІОРИТЕТ над вітанням)
      if (!botResponse) {
        for (const group of groups) {
          for (const card of group.cards) {
            const hasKeyword = card.keywords.some((kw: string) =>
              msgLower.includes(kw.toLowerCase()),
            );
            const hasTitle = msgLower.includes(card.title.toLowerCase());

            if (hasKeyword || hasTitle) {
              botResponse = {
                sender: "bot",
                text: `По вашому запиту знайдено інформацію у розділі «${card.title}» — ${card.desc}. Перейдіть за посиланням нижче, щоб ознайомитися з детальними порадами.`,
                path: card.path,
                linkLabel: `Відкрити розділ «${card.title}»`,
              };
              break;
            }
          }
          if (botResponse) break;
        }
      }

      // 5. ВВІЧЛИВІСТЬ — Привітання (тільки якщо не знайдено симптомів)
      if (!botResponse) {
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
          botResponse = {
            sender: "bot",
            text: `${greeting}! Опишіть проблему або запитайте про породи, догляд чи годування — постараюсь допомогти.`,
          };
        }
      }

      // 6. ВВІЧЛИВІСТЬ — Подяка
      if (!botResponse) {
        const thanks = ["дякую", "спасибі", "дякую велике", "дуже дякую"];
        if (thanks.some((word) => msgLower.includes(word))) {
          botResponse = {
            sender: "bot",
            text: "Радий був бути корисним! Нехай ваші кролі ростуть здоровими. 🐰 Якщо виникнуть ще запитання — звертайтесь.",
          };
        }
      }

      // 7. НІЧОГО НЕ ЗНАЙДЕНО
      if (!botResponse) {
        botResponse = {
          sender: "bot",
          text: "Я уважно вас прочитав, але не знайшов точної відповіді у базі знань. Спробуйте уточнити: наприклад, «пронос», «вакцинація», «годування взимку» або назву породи.",
        };
      }

      setMessages((prev) => [...prev, botResponse!]);
    }, 600);
  };

  return (
    <>
      <button className="assistant-toggle" onClick={handleOpen}>
        {open ? "✕" : "🐰"}
      </button>

      {open && (
        <div className="assistant-window">
          <div className="assistant-header">
            <div>
              <strong>Асистент кролівника</strong>
              <span className="status-online">● Онлайн</span>
            </div>
            <button className="assistant-close" onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>

          <div className="assistant-body" ref={scrollRef}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`assistant-message ${message.sender}`}
              >
                <p>{message.text}</p>
                {message.path && (
                  <Link to={message.path} className="assistant-link">
                    {message.linkLabel ?? "Переглянути сторінку →"}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="assistant-footer">
            <input
              type="text"
              placeholder="Напишіть повідомлення..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend} disabled={!input.trim()}>
              {"➤"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Assistant;
