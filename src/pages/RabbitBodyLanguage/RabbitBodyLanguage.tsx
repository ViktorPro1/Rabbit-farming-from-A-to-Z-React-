import { useState } from "react";
import "./RabbitBodyLanguage.css";

// ─── Types ───────────────────────────────────────────────────────
type Mood =
  | "happy"
  | "relaxed"
  | "curious"
  | "alert"
  | "stressed"
  | "scared"
  | "aggressive";

interface BodyPart {
  id: string;
  name: string;
  signals: {
    label: string;
    meaning: string;
    mood: Mood;
  }[];
}

interface Pose {
  id: string;
  emoji: string;
  name: string;
  description: string;
  meaning: string;
  farmNote: string;
  mood: Mood;
}

// ─── Data ────────────────────────────────────────────────────────
const moodConfig: Record<Mood, { label: string; color: string; bg: string }> = {
  happy: { label: "Задоволення", color: "#639922", bg: "#EAF3DE" },
  relaxed: { label: "Розслабленість", color: "#3B6D11", bg: "#C0DD97" },
  curious: { label: "Цікавість", color: "#BA7517", bg: "#FAEEDA" },
  alert: { label: "Настороженість", color: "#856B00", bg: "#FFF3CC" },
  stressed: { label: "Стрес", color: "#633806", bg: "#FFE8D0" },
  scared: { label: "Страх", color: "#8B1A1A", bg: "#FFE0DE" },
  aggressive: { label: "Агресія", color: "#C0392B", bg: "#FFDDDB" },
};

const bodyParts: BodyPart[] = [
  {
    id: "ears",
    name: "🐰 Вуха",
    signals: [
      {
        label: "Розслаблені, злегка опущені",
        meaning: "Кролик спокійний і в безпеці",
        mood: "relaxed",
      },
      {
        label: "Стирчать вертикально, рухаються",
        meaning: "Щось привернуло увагу, аналіз оточення",
        mood: "curious",
      },
      {
        label: "Обидва вуха притиснуті до спини",
        meaning: "Страх або готовність до втечі",
        mood: "scared",
      },
      {
        label: "Одне вухо вперед, одне назад",
        meaning: "Кролик стежить за кількома джерелами звуку",
        mood: "alert",
      },
      {
        label: "Вуха відведені назад під час руху",
        meaning: "Агресивна атака, попередження",
        mood: "aggressive",
      },
      {
        label: "Вуха «лопаті» — повернені боком",
        meaning: "Максимальна концентрація на певному звуці",
        mood: "alert",
      },
    ],
  },
  {
    id: "eyes",
    name: "👁 Очі",
    signals: [
      {
        label: "Напівзаплющені, повільне моргання",
        meaning: "Абсолютний спокій, довіра до людини",
        mood: "relaxed",
      },
      {
        label: "Широко відкриті, зіниця розширена",
        meaning: "Переляк, страх, підвищена тривога",
        mood: "scared",
      },
      {
        label: "Очі «бігають», часте моргання",
        meaning: "Стрес, дискомфорт, спроба оцінити шляхи втечі",
        mood: "stressed",
      },
      {
        label: "Зосереджений, немиготливий погляд",
        meaning: "Цікавість або оцінка загрози",
        mood: "curious",
      },
      {
        label: "Очі закриті в присутності людини",
        meaning: "Максимальна довіра — кролик відчуває повну безпеку",
        mood: "happy",
      },
    ],
  },
  {
    id: "tail",
    name: "🐇 Хвіст",
    signals: [
      {
        label: "Хвіст опущений, розслаблений",
        meaning: "Нормальний стан спокою",
        mood: "relaxed",
      },
      {
        label: "Хвіст піднятий вертикально під час бігу",
        meaning: "Зацікавленість або демонстрація домінування",
        mood: "curious",
      },
      {
        label: "Хвіст піднятий і напружений, тулуб низько",
        meaning: "Сигнал перед атакою",
        mood: "aggressive",
      },
      {
        label: "Хвіст підібраний під живіт",
        meaning: "Страх або підпорядкування",
        mood: "scared",
      },
    ],
  },
  {
    id: "body",
    name: "💪 Тулуб і пози",
    signals: [
      {
        label: "Розтягнувся на боці або животі",
        meaning: "Повне розслаблення, кролик у безпеці",
        mood: "relaxed",
      },
      {
        label: "Тулуб напружений, вага на передніх лапах",
        meaning: "Готовність до атаки або захисту",
        mood: "aggressive",
      },
      {
        label: "Тіло «стиснуте», голова притиснута",
        meaning: "Страх, спроба стати непомітним",
        mood: "scared",
      },
      {
        label: "Сидить «колобком», лапи під тілом",
        meaning: "Легкий дискомфорт або очікування",
        mood: "alert",
      },
      {
        label: "Стоїть на задніх лапах (стовпчик)",
        meaning: "Вивчення оточення, цікавість",
        mood: "curious",
      },
      {
        label: "Боком до загрози, тіло збільшене",
        meaning: "Захисна демонстрація розмірів, попередження",
        mood: "aggressive",
      },
    ],
  },
  {
    id: "nose",
    name: "👃 Ніс",
    signals: [
      {
        label: "Повільне посмикування носа (1–2/сек)",
        meaning: "Спокій, мінімальна активність аналізатора",
        mood: "relaxed",
      },
      {
        label: "Швидке посмикування (більше 3/сек)",
        meaning: "Збудження, незнайомий запах, напруга",
        mood: "alert",
      },
      {
        label: "Ніс нерухомий",
        meaning: "Кролик спить або дуже налякований",
        mood: "scared",
      },
      {
        label: "Ніс тягнеться вперед, принюхується",
        meaning: "Активна цікавість, досліджує нове",
        mood: "curious",
      },
    ],
  },
  {
    id: "legs",
    name: "🦵 Лапи",
    signals: [
      {
        label: "Лапи витягнуті назад під час лежання",
        meaning: "Повне розслаблення — «поза мертвого кроля»",
        mood: "relaxed",
      },
      {
        label: "Удар задніми лапами об підлогу (тупіт)",
        meaning: "Попередження групи про небезпеку або незадоволення",
        mood: "alert",
      },
      {
        label: "Швидке гарячкове риття",
        meaning: "Стрес, спроба втекти або тривога",
        mood: "stressed",
      },
      {
        label: "Тупцювання на місці",
        meaning: "Збудження від очікування (їжа, партнер)",
        mood: "happy",
      },
      {
        label: "Лапи широко розставлені, тіло низько",
        meaning: "Страх, підготовка до втечі",
        mood: "scared",
      },
    ],
  },
];

const poses: Pose[] = [
  {
    id: "loaf",
    emoji: "🍞",
    name: "«Буханець» (Loaf)",
    description:
      "Кролик сидить із підібраними під тіло лапами, схожий на буханець хліба.",
    meaning:
      "Спокій і комфорт. Кролик не ховається, але й не повністю розслаблений. Звичайна поза відпочинку між активними фазами.",
    farmNote:
      "Норма для здорових тварин. Якщо кролик «застигає» в цій позі годинами без реакції — перевірте стан здоров'я.",
    mood: "relaxed",
  },
  {
    id: "flop",
    emoji: "💤",
    name: "«Флоп» (Dead Rabbit / Flop)",
    description:
      "Кролик різко падає на бік, витягує лапи. Може виглядати як непритомність.",
    meaning:
      "Максимальне задоволення та безпека. Один із найкращих знаків — кролик повністю вам довіряє. Часто після активних ігор або смачної їжі.",
    farmNote:
      "Нові власники лякаються — думають, що кролик помер. Це норма. Якщо після флопу кролик не реагує на дотик кілька хвилин — тоді тривога.",
    mood: "happy",
  },
  {
    id: "binky",
    emoji: "🎉",
    name: "«Бінкі» (Binky)",
    description:
      "Кролик підстрибує у повітрі, скручує тіло та голову в різні боки, іноді крутиться.",
    meaning:
      "Екстремальне щастя та радість. Спонтанний вибух позитивних емоцій. Ознака психологічно здорової тварини.",
    farmNote:
      "На фермі бінкі — індикатор задоволених умов утримання. Якщо кролики ніколи не роблять бінкі, варто переглянути мікроклімат та простір.",
    mood: "happy",
  },
  {
    id: "alert-sit",
    emoji: "🧍",
    name: "Стійка на задніх лапах",
    description:
      "Кролик піднімається на задні лапи, витягує шию, вуха максимально підняті.",
    meaning:
      "Цікавість та оцінка оточення. Кролик хоче побачити більше. Нормальна поведінка при новому стимулі.",
    farmNote:
      "Якщо всі кролики одночасно стають стовпчиком — щось незвичне в кролятнику. Перевірте оточення.",
    mood: "curious",
  },
  {
    id: "freeze",
    emoji: "🗿",
    name: "Завмирання (Freeze)",
    description:
      "Кролик різко зупиняється, стає нерухомим, м'язи напружені, очі широко відкриті.",
    meaning:
      "Реакція на загрозу — «замри, щоб не помітили». Древній захисний інстинкт. Після оцінки ситуації або тікає, або поступово розслаблюється.",
    farmNote:
      "Часті «заморозки» у стаді — сигнал хронічного стресу. Перевірте джерела шуму, запахів хижаків (собак, кішок), різкі рухи персоналу.",
    mood: "scared",
  },
  {
    id: "chin-rub",
    emoji: "😏",
    name: "Потирання підборіддям",
    description: "Кролик тре підборіддям об предмети, кути, людину.",
    meaning:
      "Маркування території. Під підборіддям є залози, що виділяють феромони. Для людини запах непомітний, для кролика — чіткий сигнал власності.",
    farmNote:
      "Кролик «маркує» господаря — це знак прихильності та включення вас до своєї «зони». Маркування клітки — норма для нових тварин.",
    mood: "curious",
  },
  {
    id: "grooming",
    emoji: "🧹",
    name: "Груминг іншого кролика",
    description:
      "Кролик вилизує, чистить шерсть іншого кроля — особливо голову та вуха.",
    meaning:
      "Соціальний зв'язок, домінування або рівноправна дружба. Той, кого вилизують — нижчий або рівний у ієрархії.",
    farmNote:
      "Груминг між кролями — ознака здорової соціальної структури. Якщо один кролик весь час «отримує» і ніколи не дає — стежте за балансом домінування.",
    mood: "happy",
  },
  {
    id: "boxing",
    emoji: "🥊",
    name: "«Боксування» передніми лапами",
    description:
      "Кролик б'є передніми лапами у напрямку іншої тварини або людини.",
    meaning:
      "Попередження перед укусом. Серйозна агресивна поведінка. Кролик дав останній шанс відступити.",
    farmNote:
      "Особливо часто у некастрованих самців та самок, що захищають гніздо. При боксуванні на людину — дайте простір, не тягніть руку назад різко.",
    mood: "aggressive",
  },
];

const farmContextTable = [
  {
    signal: "Тупіт у групі",
    farmContext:
      "Один кролик почув загрозу — реакція поширюється на все поголів'я",
    action: "Перевірте периметр, наявність хижаків або незнайомих людей",
  },
  {
    signal: "Масове завмирання",
    farmContext: "Груповий стрес — гострий або хронічний",
    action:
      "Аналіз джерел стресу: звук, запах, мікроклімат, режим відвідування",
  },
  {
    signal: "Відсутність бінкі у молодняку",
    farmContext: "Психологічний дискомфорт, замала площа, соціальна ізоляція",
    action: "Збільшити площу, забезпечити збагачення середовища",
  },
  {
    signal: "Груминг припинився в парі",
    farmContext: "Соціальний конфлікт, хвороба одного з кролів",
    action: "Оглянути обох, перевірити ієрархію, можливо — розсадити",
  },
  {
    signal: "Маркування нових кліток",
    farmContext: "Норма при введенні тварин",
    action: "Дочекатися 2–3 тижні адаптації, не переставляти речі без потреби",
  },
  {
    signal: "Захисна агресія самки",
    farmContext: "Захист гнізда та крільченят",
    action:
      "Мінімізувати контакт у перші 10 днів, маточник не чіпати без потреби",
  },
];

// ─── Component ───────────────────────────────────────────────────
export default function RabbitBodyLanguage() {
  const [activePart, setActivePart] = useState<string>("ears");
  const [activePose, setActivePose] = useState<string | null>(null);
  const [moodFilter, setMoodFilter] = useState<Mood | "all">("all");

  const currentPart = bodyParts.find((p) => p.id === activePart)!;
  const filteredPoses =
    moodFilter === "all" ? poses : poses.filter((p) => p.mood === moodFilter);

  return (
    <div className="bl-page">
      {/* HEADER */}
      <header className="bl-header">
        <div className="bl-header__inner">
          <div className="bl-hero">
            <h1 className="bl-hero__title">Мова тіла кроля</h1>
            <p className="bl-hero__sub">
              Кролик не гавкає і не нявкає — але постійно говорить. Вуха, очі,
              хвіст, пози — повний атлас сигналів від А до Я для фермера та
              власника.
            </p>
          </div>
        </div>
      </header>

      {/* BODY PARTS ATLAS */}
      <section className="bl-section">
        <div className="bl-wrap">
          <h2 className="bl-section-title">Атлас сигналів по частинах тіла</h2>
          <p className="bl-section-sub">
            Виберіть частину тіла щоб побачити всі сигнали
          </p>

          {/* Part tabs */}
          <div className="bl-tabs">
            {bodyParts.map((part) => (
              <button
                key={part.id}
                className={`bl-tab ${activePart === part.id ? "bl-tab--active" : ""}`}
                onClick={() => setActivePart(part.id)}
              >
                {part.name}
              </button>
            ))}
          </div>

          {/* Signals grid */}
          <div className="bl-signals-grid" key={activePart}>
            {currentPart.signals.map((sig, i) => {
              const cfg = moodConfig[sig.mood];
              return (
                <div
                  key={i}
                  className="bl-signal-card"
                  style={
                    {
                      "--sig-color": cfg.color,
                      "--sig-bg": cfg.bg,
                    } as React.CSSProperties
                  }
                >
                  <div className="bl-signal-card__top">
                    <span className="bl-signal-label">{sig.label}</span>
                    <span
                      className="bl-signal-mood"
                      style={{ color: cfg.color, background: cfg.bg }}
                    >
                      {cfg.label}
                    </span>
                  </div>
                  <p className="bl-signal-meaning">{sig.meaning}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* POSES */}
      <section className="bl-poses-section">
        <div className="bl-wrap">
          <h2 className="bl-section-title">Пози та поведінкові патерни</h2>
          <p className="bl-section-sub">
            Клікніть на позу — побачите значення та фермерську нотатку
          </p>

          {/* Mood filter */}
          <div className="bl-mood-filters">
            <button
              className={`bl-mood-btn ${moodFilter === "all" ? "bl-mood-btn--active" : ""}`}
              onClick={() => setMoodFilter("all")}
            >
              Всі пози
            </button>
            {(Object.keys(moodConfig) as Mood[]).map((m) => (
              <button
                key={m}
                className={`bl-mood-btn ${moodFilter === m ? "bl-mood-btn--active" : ""}`}
                style={
                  moodFilter === m
                    ? {
                        background: moodConfig[m].color,
                        borderColor: moodConfig[m].color,
                        color: "#fff",
                      }
                    : {}
                }
                onClick={() => setMoodFilter(m === moodFilter ? "all" : m)}
              >
                {moodConfig[m].label}
              </button>
            ))}
          </div>

          <div className="bl-poses-grid">
            {filteredPoses.map((pose) => {
              const cfg = moodConfig[pose.mood];
              const isOpen = activePose === pose.id;
              return (
                <article
                  key={pose.id}
                  className={`bl-pose-card ${isOpen ? "bl-pose-card--open" : ""}`}
                  style={
                    {
                      "--pose-color": cfg.color,
                      "--pose-bg": cfg.bg,
                    } as React.CSSProperties
                  }
                  onClick={() => setActivePose(isOpen ? null : pose.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" && setActivePose(isOpen ? null : pose.id)
                  }
                  aria-expanded={isOpen}
                >
                  <div className="bl-pose-card__header">
                    <span className="bl-pose-emoji">{pose.emoji}</span>
                    <div className="bl-pose-titles">
                      <h3 className="bl-pose-name">{pose.name}</h3>
                      <span
                        className="bl-pose-mood"
                        style={{ color: cfg.color, background: cfg.bg }}
                      >
                        {cfg.label}
                      </span>
                    </div>
                    <span className="bl-pose-chevron">
                      {isOpen ? "▲" : "▼"}
                    </span>
                  </div>
                  <p className="bl-pose-desc">{pose.description}</p>
                  {isOpen && (
                    <div className="bl-pose-details">
                      <div className="bl-pose-block">
                        <span className="bl-pose-block-label">
                          💡 Що означає
                        </span>
                        <p>{pose.meaning}</p>
                      </div>
                      <div className="bl-pose-block bl-pose-block--farm">
                        <span className="bl-pose-block-label">
                          🌾 Фермерська нотатка
                        </span>
                        <p>{pose.farmNote}</p>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* FARM CONTEXT TABLE */}
      <section className="bl-table-section">
        <div className="bl-wrap">
          <h2 className="bl-section-title">Сигнали у контексті господарства</h2>
          <p className="bl-section-sub">
            Як читати поведінку всього стада, а не одного кроля
          </p>
          <div className="bl-table-wrap">
            <table className="bl-table">
              <thead>
                <tr>
                  <th>Сигнал</th>
                  <th>Значення в стаді</th>
                  <th>Дія господаря</th>
                </tr>
              </thead>
              <tbody>
                {farmContextTable.map((row, i) => (
                  <tr key={i}>
                    <td>
                      <strong>{row.signal}</strong>
                    </td>
                    <td>{row.farmContext}</td>
                    <td className="bl-td-action">{row.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* QUICK REFERENCE */}
      <section className="bl-quick-section">
        <div className="bl-wrap">
          <h2 className="bl-section-title">Швидка розшифровка</h2>
          <div className="bl-quick-grid">
            {(
              Object.entries(moodConfig) as [Mood, (typeof moodConfig)[Mood]][]
            ).map(([mood, cfg]) => (
              <div
                key={mood}
                className="bl-quick-card"
                style={{ borderColor: cfg.color + "55", background: cfg.bg }}
              >
                <span className="bl-quick-label" style={{ color: cfg.color }}>
                  {cfg.label}
                </span>
                <p className="bl-quick-text">
                  {mood === "happy" &&
                    "Бінкі, флоп, тупцювання, напівзаплющені очі"}
                  {mood === "relaxed" &&
                    "Буханець, витягнуті лапи, повільне моргання, рівне дихання"}
                  {mood === "curious" &&
                    "Стійка на задніх, тягнеться носом, стовпчик, швидке посмикування носа"}
                  {mood === "alert" &&
                    "Вуха вертикально, завмирання, частий нюх, одне вухо вперед"}
                  {mood === "stressed" &&
                    "Риття, «бігаючі» очі, неспокій, відмова від їжі, мало посліду"}
                  {mood === "scared" &&
                    "Вуха притиснуті, завмирання, широкі очі, хвіст під живіт, сховався"}
                  {mood === "aggressive" &&
                    "Боксування, гарчання, укус без попередження, тіло боком, хвіст угору"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bl-footer">
        <div className="bl-wrap">
          <p>
            Джерела: House Rabbit Society, RWAF (Rabbit Welfare Association &
            Fund), BSAVA Manual of Rabbit Medicine.
          </p>
        </div>
      </footer>
    </div>
  );
}
