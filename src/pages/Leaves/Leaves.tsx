import React, { useState } from "react";
import "./Leaves.css";

interface LeafItem {
  id: number;
  emoji: string;
  name: string;
  subtitle: string;
  badge: "ok" | "limit" | "no";
  badgeText: string;
  iconBg: string;
  content: {
    rows?: { icon: string; label: string; text: string }[];
    tip?: { title: string; text: string };
    warn?: string;
    danger?: string;
    paragraphs?: string[];
  };
}

interface ForbiddenItem {
  id: number;
  icon: string;
  name: string;
  why: string;
}

interface SeasonCard {
  emoji: string;
  name: string;
  color: string;
  items: string[];
}

interface Tip {
  num: number;
  text: string;
}

const leaves: LeafItem[] = [
  {
    id: 1,
    emoji: "🍇",
    name: "Листя винограду",
    subtitle: "та виноградна лоза",
    badge: "ok",
    badgeText: "✓ Можна",
    iconBg: "icon-green",
    content: {
      rows: [
        {
          icon: "💊",
          label: "Що корисного:",
          text: "Вітаміни A, C і B, магній, марганець, кальцій, залізо, рибофлавін, ніацин і клітковина. Особливо корисні для самичок у лактації.",
        },
        {
          icon: "📏",
          label: "Скільки давати:",
          text: "Листя з лозою — не більше 20% від добової норми зелені. Забагато може викликати пронос.",
        },
        {
          icon: "📅",
          label: "З якого віку:",
          text: "Зелене листя — з 18-го дня. Лозу — не раніше 3 місяців, краще з 4–5 місяців.",
        },
      ],
      tip: {
        title: "🌱 Порада господаря",
        text: "Виноград обрізують двічі на рік. Гілочки й листя після обрізки сміливо давайте кроликам — не викидайте!",
      },
      warn: '⚠️ Важливо: Виноград часто обробляють хімікатами. Давайте лише те листя, в чистоті якого впевнені. Дикий "дівочий виноград" — кроликам не можна!',
    },
  },
  {
    id: 2,
    emoji: "🌰",
    name: "Листя волоського горіха",
    subtitle: "загальнозміцнювальний засіб",
    badge: "limit",
    badgeText: "! Обмежено",
    iconBg: "icon-yellow",
    content: {
      paragraphs: [
        "Листя волоського горіха — не звичайний корм, а ліки. Їх дають не для того, щоб нагодувати, а щоб зміцнити організм або підлікувати.",
      ],
      rows: [
        {
          icon: "💊",
          label: "Склад:",
          text: "Вітаміни C і E, каротин, дубильні речовини, флавоноїди, ефірні олії, антибактеріальні компоненти.",
        },
        {
          icon: "🏥",
          label: "Лікувальний ефект:",
          text: "Протимікробна, протизапальна, в'яжуча дія. Допомагає при проносі, зміцнює імунітет.",
        },
        {
          icon: "📏",
          label: "Як давати:",
          text: "Лише кілька листочків раз на тиждень. Це не основний корм!",
        },
      ],
      warn: "⚠️ Забагато листя горіха може викликати запор. Використовуйте лише як профілактичний або лікувальний засіб.",
    },
  },
  {
    id: 3,
    emoji: "🍓",
    name: "Листя малини",
    subtitle: "улюблені ласощі кроликів",
    badge: "ok",
    badgeText: "✓ Можна",
    iconBg: "icon-green",
    content: {
      paragraphs: [
        "Кролики просто обожнюють листя малини! Це один з найкращих зелених кормів — безпечний, смачний і корисний.",
      ],
      rows: [
        {
          icon: "⚠️",
          label: "Увага:",
          text: "На гілках малини є шипи — їх потрібно видалити перед годуванням.",
        },
      ],
      tip: {
        title: "✅ Ідеальний варіант",
        text: "Давайте листя малини щодня без обмежень — один з найрекомендованіших кормів серед кролівників.",
      },
    },
  },
  {
    id: 4,
    emoji: "🌳",
    name: "Листя акації",
    subtitle: "найвища харчова цінність",
    badge: "ok",
    badgeText: "✓ Чудово",
    iconBg: "icon-green",
    content: {
      paragraphs: [
        "Серед усіх листяних кормів акація посідає перше місце за поживністю. Містить вітаміни, мікроелементи, амінокислоти і протеїн — будівельний матеріал для м'язів.",
      ],
      rows: [
        {
          icon: "⚠️",
          label: "Шипи:",
          text: "Гілки акації мають шипи. Їх треба обов'язково видалити або давати тільки м'яке листя.",
        },
      ],
    },
  },
  {
    id: 5,
    emoji: "🌿",
    name: "Листя берези",
    subtitle: "обережно з нирками",
    badge: "limit",
    badgeText: "! Помірно",
    iconBg: "icon-yellow",
    content: {
      paragraphs: [
        "Береза має сечогінні властивості. Якщо давати багато — нирки кролика будуть перевантажені.",
      ],
      rows: [
        {
          icon: "📏",
          label: "Норма:",
          text: "Давайте рідко й потроху — як добавку, а не основу раціону.",
        },
      ],
      warn: "⚠️ Надлишок берези може негативно вплинути на роботу нирок кролика. Не захоплюйтесь!",
    },
  },
  {
    id: 6,
    emoji: "🌰",
    name: "Листя дуба та вільхи",
    subtitle: "ліки від проносу",
    badge: "limit",
    badgeText: "! Лікувально",
    iconBg: "icon-orange",
    content: {
      paragraphs: [
        "Дуб і вільха — природні ліки при діареї. Кілька листочків допоможуть закріпити стілець завдяки дубильним речовинам.",
      ],
      rows: [
        {
          icon: "🏥",
          label: "Коли давати:",
          text: "При проносі або як профілактику — не частіше 1 разу на 10 днів.",
        },
      ],
      warn: "⚠️ Якщо давати дуб постійно — може виникнути запор. Це лікувальний засіб, а не щоденний корм.",
    },
  },
  {
    id: 7,
    emoji: "🍎",
    name: "Листя яблуні та груші",
    subtitle: "садові дерева",
    badge: "ok",
    badgeText: "✓ Можна",
    iconBg: "icon-green",
    content: {
      paragraphs: [
        "Кролики дуже охоче їдять листя яблуні та груші. Абсолютно безпечний і смачний корм для щоденного харчування.",
      ],
      tip: {
        title: "🌱 Порада",
        text: "Після весняного або осіннього обрізання садових дерев не викидайте гілки — чудовий корм для кроликів разом з листям!",
      },
    },
  },
  {
    id: 8,
    emoji: "🌿",
    name: "Листя обліпихи",
    subtitle: "вітамінна добавка",
    badge: "limit",
    badgeText: "! Обмежено",
    iconBg: "icon-orange",
    content: {
      paragraphs: [
        "Листя обліпихи використовують з лікувальною метою — для загального зміцнення організму. Не є основним кормом.",
      ],
      rows: [
        {
          icon: "💊",
          label: "Як давати:",
          text: "Багаті вітамінами та мікроелементами. Дають як профілактичний засіб кілька разів на місяць.",
        },
      ],
    },
  },
];

const forbiddenItems: ForbiddenItem[] = [
  {
    id: 1,
    icon: "☠️",
    name: "Бузина",
    why: "Містить глікозиди, які виділяють синильну кислоту. Отрута навіть у малих кількостях.",
  },
  {
    id: 2,
    icon: "☠️",
    name: "Черемха",
    why: "Листя і кора містять амігдалін → синильна кислота. Смертельно небезпечна.",
  },
  {
    id: 3,
    icon: "☠️",
    name: "Крушина",
    why: "Сильне проносне з токсичним ефектом. Може викликати критичне зневоднення.",
  },
  {
    id: 4,
    icon: "☠️",
    name: "Вовче лико (Daphne)",
    why: "Вся рослина отруйна. Навіть для людини небезпечна при контакті.",
  },
  {
    id: 5,
    icon: "☠️",
    name: "Олеандр",
    why: "Дуже токсичний кущ. Спричиняє зупинку серця навіть у невеликих дозах.",
  },
  {
    id: 6,
    icon: "⛔",
    name: "Бузок (Syringa)",
    why: "Листя і гілки містять токсичні речовини, небезпечні для ШКТ кроликів.",
  },
  {
    id: 7,
    icon: "⛔",
    name: "Вишня, черешня, слива, абрикос, алича",
    why: "Кісточкові дерева — у листях і корі є ціаногенні глікозиди (синильна кислота).",
  },
  {
    id: 8,
    icon: "⛔",
    name: "Бруслина",
    why: "Декоративний кущ з яскравими плодами. Всі частини токсичні.",
  },
  {
    id: 9,
    icon: "⛔",
    name: "Дикий (дівочий) виноград",
    why: "Не плутайте з культурним! Дика різновид кроликам протипоказана.",
  },
];

const seasons: SeasonCard[] = [
  {
    emoji: "🌸",
    name: "Весна",
    color: "#43a047",
    items: [
      "Гілки з бруньками (найкорисніше!)",
      "Перше свіже листя",
      "Молоді пагони малини",
      "Листя кульбаби",
    ],
  },
  {
    emoji: "☀️",
    name: "Літо",
    color: "#f57c00",
    items: [
      "Будь-яке дозволене листя",
      "Виноградне листя",
      "Листя акації, в'яза",
      "Обрізки садових дерев",
    ],
  },
  {
    emoji: "🍂",
    name: "Осінь",
    color: "#ef6c00",
    items: [
      "Тільки зелене листя!",
      "Жовте — заборонено",
      "Голі гілочки (зібрати до листопаду)",
      "Заготовляти віники на зиму",
    ],
  },
  {
    emoji: "❄️",
    name: "Зима",
    color: "#1565c0",
    items: [
      "Сушені віники",
      "Хвойні гілки (1–2 рази/тиждень)",
      "Заготовлені осінні гілки",
      "Сухе листя (без гнилі)",
    ],
  },
];

const tips: Tip[] = [
  {
    num: 1,
    text: "Вводьте будь-який новий корм поступово, починаючи з малої кількості, і стежте за реакцією 1–2 дні.",
  },
  {
    num: 2,
    text: "Гілки краще зрізати на початку літа — тоді найбільше корисних речовин. Оптимальна довжина — 10–15 см.",
  },
  {
    num: 3,
    text: 'Для зимових запасів зв\'язуйте гілки у вигляді "мітелок-віників" і зберігайте в сухому приміщенні.',
  },
  {
    num: 4,
    text: "Листя і лоза після обрізки виноградника — не відходи, а безкоштовний якісний корм!",
  },
  {
    num: 5,
    text: "Ніколи не давайте листя або гілки, якщо є підозра, що вони оброблялися пестицидами.",
  },
  {
    num: 6,
    text: "Кроленята до 3 місяців не отримують гілки. Листя — з 18-го дня, тільки м'яке й потроху.",
  },
  {
    num: 7,
    text: "Якщо кролик відмовляється від гілки — не наполягайте. Пробуйте інше дерево.",
  },
];

const badgeClass: Record<LeafItem["badge"], string> = {
  ok: "badge-ok",
  limit: "badge-limit",
  no: "badge-no",
};

const Leaves: React.FC = () => {
  const [openCards, setOpenCards] = useState<Set<number>>(new Set());

  const toggleCard = (id: number) => {
    setOpenCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="leaves-page">
      {/* HERO */}
      <section className="lv-hero">
        <span className="lv-hero-emoji">🌿</span>
        <h1>Листя та гілки дерев</h1>
        <p>
          Що можна і що не можна давати кроликам — повний перевірений довідник
        </p>
      </section>

      {/* INTRO */}
      <div className="lv-intro-box">
        <p>
          Листя та гілки — важлива частина раціону кроликів: клітковина,
          вітаміни, білок і природне сточування зубів. У природі зайці гризуть
          гілки постійно. Головне — знати, яке дерево корисне, а яке небезпечне.
        </p>
      </div>

      {/* ЛИСТЯ */}
      <section className="lv-section">
        <h2 className="lv-section-title">🍃 Листя дерев та кущів</h2>
        {leaves.map((item) => (
          <div
            key={item.id}
            className={`lv-card${openCards.has(item.id) ? " open" : ""}`}
          >
            <div className="lv-card-header" onClick={() => toggleCard(item.id)}>
              <div className={`lv-card-icon ${item.iconBg}`}>{item.emoji}</div>
              <div className="lv-card-title-group">
                <div className="lv-card-name">{item.name}</div>
                <div className="lv-card-subtitle">{item.subtitle}</div>
              </div>
              <span className={`lv-badge ${badgeClass[item.badge]}`}>
                {item.badgeText}
              </span>
              <span className="lv-chevron">▼</span>
            </div>

            {openCards.has(item.id) && (
              <div className="lv-card-body">
                {item.content.paragraphs?.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                {item.content.rows?.map((row, i) => (
                  <div key={i} className="lv-info-row">
                    <span className="lv-info-icon">{row.icon}</span>
                    <span className="lv-info-text">
                      <strong>{row.label}</strong> {row.text}
                    </span>
                  </div>
                ))}
                {item.content.tip && (
                  <div className="lv-tip-box">
                    <div className="lv-tip-title">{item.content.tip.title}</div>
                    {item.content.tip.text}
                  </div>
                )}
                {item.content.warn && (
                  <div className="lv-warn-box">{item.content.warn}</div>
                )}
                {item.content.danger && (
                  <div className="lv-danger-box">{item.content.danger}</div>
                )}
              </div>
            )}
          </div>
        ))}
      </section>

      {/* ГІЛКИ */}
      <section className="lv-section">
        <h2 className="lv-section-title">🪵 Гілки дерев та кущів</h2>
        <p className="lv-section-intro">
          Гілки — корм і спосіб сточувати зуби. Давайте 3–4 гілочки щодня.
          Оптимальна довжина — 10–15 см.
        </p>

        {/* Щоденні */}
        <div className={`lv-card${openCards.has(100) ? " open" : ""}`}>
          <div className="lv-card-header" onClick={() => toggleCard(100)}>
            <div className="lv-card-icon icon-green">✅</div>
            <div className="lv-card-title-group">
              <div className="lv-card-name">Гілки щоденного раціону</div>
              <div className="lv-card-subtitle">давати можна кожен день</div>
            </div>
            <span className="lv-badge badge-ok">✓ Щодня</span>
            <span className="lv-chevron">▼</span>
          </div>
          {openCards.has(100) && (
            <div className="lv-card-body">
              {[
                [
                  "🌳",
                  "Яблуня",
                  "Найкраще з плодових. М'яка кора, смачна, безпечна.",
                ],
                [
                  "🌳",
                  "Тополя",
                  "Нейтральна, добре поїдається. Відмінно для щоденного корму.",
                ],
                [
                  "🌳",
                  "Шовковиця",
                  "Смачна і поживна. Кролики їдять з задоволенням.",
                ],
                [
                  "🌳",
                  "Груша",
                  "Аналогічно яблуні. Плодові дерева кролики обожнюють.",
                ],
                [
                  "🌿",
                  "Малина",
                  "Листя і тонкі гілки. Пам'ятайте про шипи — видаліть!",
                ],
                [
                  "🌿",
                  "Смородина",
                  "Листя і молоді гілки. Кролики їдять охоче.",
                ],
                ["🌿", "Ліщина", "Горіховий кущ. Гілки поживні й смачні."],
                [
                  "🌿",
                  "Акація",
                  "Видаліть шипи або давайте тільки м'яке листя.",
                ],
                [
                  "🌿",
                  "Виноград (лоза)",
                  "Молоді пагони й лоза. Вводити з 3–4 місяців.",
                ],
                ["🌳", "Горобина", "Листочки й тонкі гілки. Містить вітаміни."],
                ["🌳", "В'яз", "Друге місце після акації за поживністю."],
                [
                  "🌳",
                  "Клен",
                  "Трохи нижче в'яза за якістю, але відмінний корм.",
                ],
                ["🌳", "Ясен", "Добре поїдається. Звичайний щоденний корм."],
              ].map(([icon, name, desc], i) => (
                <div key={i} className="lv-info-row">
                  <span className="lv-info-icon">{icon}</span>
                  <span className="lv-info-text">
                    <strong>{name}</strong> — {desc}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Лікувальні */}
        <div className={`lv-card${openCards.has(101) ? " open" : ""}`}>
          <div className="lv-card-header" onClick={() => toggleCard(101)}>
            <div className="lv-card-icon icon-orange">🏥</div>
            <div className="lv-card-title-group">
              <div className="lv-card-name">Лікувальні гілки</div>
              <div className="lv-card-subtitle">
                не частіше 1 разу на 10 днів
              </div>
            </div>
            <span className="lv-badge badge-limit">! Рідко</span>
            <span className="lv-chevron">▼</span>
          </div>
          {openCards.has(101) && (
            <div className="lv-card-body">
              <p>
                Ці дерева мають сильні лікувальні властивості — саме тому їх не
                можна давати постійно. Використовуйте як профілактику або під
                час хвороби.
              </p>
              {[
                [
                  "💧",
                  "Верба",
                  "Сечогінний засіб та антисептик. Давайте рідко, щоб не перевантажити нирки.",
                ],
                [
                  "🦠",
                  "Липа",
                  "Природний антисептик. Профілактика застуд і запалень.",
                ],
                [
                  "🚫",
                  "Дуб",
                  "При проносі. Не давати здоровому кролику регулярно — буде запор.",
                ],
                ["🚫", "Вільха", "Теж при діареї. Аналогічна дія до дуба."],
                [
                  "🌲",
                  "Хвойні (сосна, ялина, кедр)",
                  "Джерело вітамінів взимку. Рекомендуються в осінньо-зимовий період.",
                ],
              ].map(([icon, name, desc], i) => (
                <div key={i} className="lv-info-row">
                  <span className="lv-info-icon">{icon}</span>
                  <span className="lv-info-text">
                    <strong>{name}</strong> — {desc}
                  </span>
                </div>
              ))}
              <div className="lv-tip-box">
                <div className="lv-tip-title">❄️ Зима — час хвої</div>
                Взимку хвойні гілки — незамінне джерело вітамінів та фітонцидів.
                Давайте 1–2 рази на тиждень.
              </div>
            </div>
          )}
        </div>
      </section>

      {/* БРУНЬКИ */}
      <div className="lv-bud-section">
        <h2>🌱 А що з бруньками на гілках?</h2>
        <p>
          Чи можна давати гілки з бруньками, що ще не розпустилися?{" "}
          <strong>Так, і це дуже корисно!</strong> Ранньою весною бруньки
          містять найбільше вітамінів та біологічно активних речовин — більше,
          ніж повністю розвинене листя.
        </p>
        <div className="lv-tip-box" style={{ background: "#fff" }}>
          <div className="lv-tip-title">🌸 Весна — найкращий час</div>
          Зрізайте гілки ранньою весною з розпустилися бруньками — кролики їдять
          їх з особливим задоволенням. Це найкорисніший варіант гілкового корму
          протягом року.
        </div>
        <div
          className="lv-danger-box"
          style={{
            borderLeftColor: "#e65100",
            background: "#fff3e0",
            color: "#bf360c",
          }}
        >
          🍂 <strong>Жовте та червоне листя восени — не давайте!</strong> Коли
          дерево готується скинути листя, воно "зливає" в нього шлаки та
          токсини. У жовтому листі накопичується отрута. Якщо хочете дати осінні
          гілки — зривайте листя і давайте лише голі гілочки.
        </div>
      </div>

      {/* ЗАБОРОНЕНІ */}
      <div className="lv-forbidden">
        <div className="lv-forbidden-header">
          <span style={{ fontSize: 24 }}>🚫</span>
          <h2>Категорично заборонені</h2>
        </div>
        <div className="lv-forbidden-body">
          {forbiddenItems.map((item) => (
            <div key={item.id} className="lv-forbidden-item">
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <div>
                <div className="lv-forbidden-name">{item.name}</div>
                <div className="lv-forbidden-why">{item.why}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* СЕЗОНИ */}
      <section className="lv-section">
        <h2 className="lv-section-title">📅 Що давати по сезонах</h2>
      </section>
      <div className="lv-season-grid">
        {seasons.map((s, i) => (
          <div key={i} className="lv-season-card">
            <div className="lv-season-name" style={{ color: s.color }}>
              {s.emoji} {s.name}
            </div>
            <ul>
              {s.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ПОРАДИ */}
      <div className="lv-quick-tips">
        <h2>💡 Головні правила господаря</h2>
        {tips.map((tip) => (
          <div key={tip.num} className="lv-tip-item">
            <div className="lv-tip-num">{tip.num}</div>
            <p>{tip.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaves;
