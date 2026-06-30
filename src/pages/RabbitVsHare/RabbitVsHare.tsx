import { useState } from "react";
import "./RabbitVsHare.css";
import ShareButton from "../../components/ShareButton/ShareButton";
import { Link } from "react-router-dom";

// ─── Types ───────────────────────────────────────────────────────
type CompareCategory =
  | "anatomy"
  | "behavior"
  | "reproduction"
  | "habitat"
  | "diet";

interface CompareRow {
  criterion: string;
  rabbit: string;
  hare: string;
  winner?: "rabbit" | "hare" | "equal";
}

interface HareSpecies {
  id: string;
  name: string;
  latinName: string;
  habitat: string;
  weight: string;
  speed: string;
  note: string;
}

interface HistoryFact {
  period: string;
  fact: string;
  icon: string;
}

// ─── Data ────────────────────────────────────────────────────────
const compareData: Record<CompareCategory, CompareRow[]> = {
  anatomy: [
    {
      criterion: "Вуха",
      rabbit: "Середні, 8–12 см, менш рухливі",
      hare: "Дуже довгі, 12–20 см, з чорними кінчиками",
      winner: "hare",
    },
    {
      criterion: "Задні лапи",
      rabbit: "Середні, пристосовані до риття нір",
      hare: "Надзвичайно довгі й потужні — для стрибків",
      winner: "hare",
    },
    {
      criterion: "Вага (дорослі)",
      rabbit: "1,5–8 кг (залежно від породи)",
      hare: "2–7 кг (у більшості видів)",
      winner: "equal",
    },
    {
      criterion: "Шкіра",
      rabbit: "Ніжна, тонка — легко рветься",
      hare: "Щільніша і міцніша",
      winner: "hare",
    },
    {
      criterion: "Колір хутра",
      rabbit: "Одноколірне або плямисте (декоративні)",
      hare: "Змінюється із сезонами — літо/зима",
      winner: "hare",
    },
    {
      criterion: "Очі при народженні",
      rabbit: "Закриті (сліпі 10–14 днів)",
      hare: "Відкриті від народження",
      winner: "hare",
    },
    {
      criterion: "Хребець — кількість",
      rabbit: "45–46 хребців",
      hare: "45–46 хребців — однаково",
      winner: "equal",
    },
    {
      criterion: "Кількість хромосом",
      rabbit: "2n = 44",
      hare: "2n = 48 — різна кількість (схрещування неможливе)",
      winner: "equal",
    },
    {
      criterion: "Будова черепа",
      rabbit: "Коротший лицьовий відділ",
      hare: "Довший лицьовий відділ, більше виражені надочноямкові дуги",
      winner: "hare",
    },
  ],
  behavior: [
    {
      criterion: "Соціальність",
      rabbit: "Груповий, живе колоніями, соціальний",
      hare: "Поодинокий — збирається лише в пошуках партнера",
      winner: "rabbit",
    },
    {
      criterion: "Стрес від неволі",
      rabbit: "Адаптований — тисячі поколінь доместикації",
      hare: "Дикий — неволя = постійний хронічний стрес",
      winner: "rabbit",
    },
    {
      criterion: "Швидкість бігу",
      rabbit: "до 55–60 км/год",
      hare: "до 70–80 км/год (заєць-русак)",
      winner: "hare",
    },
    {
      criterion: "Рій/нора",
      rabbit: "Риє нори, живе під землею",
      hare: "НЕ риє нір — живе на поверхні",
      winner: "rabbit",
    },
    {
      criterion: "Поведінка при небезпеці",
      rabbit: "Тікає до нори або завмирає",
      hare: "Тікає зигзагами, покладається на швидкість",
      winner: "equal",
    },
    {
      criterion: "Територіальність",
      rabbit: "Помірно територіальний — маркує ділянку",
      hare: "Ареал 2–4 км², нечітка територія",
      winner: "equal",
    },
    {
      criterion: "Активність",
      rabbit: "Сутінково-нічна з денними паузами",
      hare: "Переважно нічна, активна на сутінках",
      winner: "equal",
    },
    {
      criterion: "Прихильність до людини",
      rabbit: "Може сформувати глибокий зв'язок",
      hare: "Не формує прив'язаності — дикий інстинкт",
      winner: "rabbit",
    },
  ],
  reproduction: [
    {
      criterion: "Вагітність",
      rabbit: "28–34 дні",
      hare: "42–44 дні (довша!)",
      winner: "rabbit",
    },
    {
      criterion: "Крільченята при народженні",
      rabbit: "Сліпі, голі, безпомічні (altricial)",
      hare: "Зрячі, вкриті шерстю, рухливі (precocial)",
      winner: "hare",
    },
    {
      criterion: "Кількість у посліді",
      rabbit: "4–12 (в середньому 6–8)",
      hare: "1–5 (в середньому 2–3)",
      winner: "rabbit",
    },
    {
      criterion: "Кількість окролів на рік",
      rabbit: "4–8 і більше",
      hare: "2–4 (менше)",
      winner: "rabbit",
    },
    {
      criterion: "Матка для потомства",
      rabbit: "Самка риє нору-гніздо, вистилає пухом",
      hare: "Народжує просто в траві (лежка) — без підготовки",
      winner: "rabbit",
    },
    {
      criterion: "Годування молоком",
      rabbit: "1–2 рази на добу, 3–4 тижні",
      hare: "Дуже рідко — мати приходить 1 раз на добу",
      winner: "equal",
    },
    {
      criterion: "Самостійність молодняку",
      rabbit: "25–28 днів до відлучення",
      hare: "2–3 тижні — набагато швидше!",
      winner: "hare",
    },
    {
      criterion: "Суперфетація (повторне запліднення)",
      rabbit: "Рідко",
      hare: "Можлива! Заєць може бути вагітним двома посліду різного віку одночасно",
      winner: "hare",
    },
  ],
  habitat: [
    {
      criterion: "Природне середовище",
      rabbit: "Степи, луки, узлісся, схили пагорбів",
      hare: "Відкриті поля, степи, лісостеп, гори",
      winner: "equal",
    },
    {
      criterion: "Тип притулку",
      rabbit: "Нори (глибина до 3 м, довжина до 50 м)",
      hare: "Лежка — проста западина в траві чи снігу",
      winner: "rabbit",
    },
    {
      criterion: "Залежність від укриття",
      rabbit: "Висока — без нори вразливий",
      hare: "Покладається на швидкість, не на укриття",
      winner: "hare",
    },
    {
      criterion: "Ареал в Україні",
      rabbit: "Одичавілі — Крим, Одещина (завезені)",
      hare: "Вся Україна — заєць-русак скрізь",
      winner: "hare",
    },
    {
      criterion: "Висота проживання",
      rabbit: "До 1500 м над рівнем моря",
      hare: "До 3000 м (деякі арктичні види)",
      winner: "hare",
    },
    {
      criterion: "Колонії",
      rabbit: "Живе колоніями 2–30 особин з ієрархією",
      hare: "Поодинокий — не утворює стійких груп",
      winner: "rabbit",
    },
  ],
  diet: [
    {
      criterion: "Основа раціону",
      rabbit: "Трав'яниста рослинність, сіно",
      hare: "Трав'яниста рослинність, кора дерев узимку",
      winner: "equal",
    },
    {
      criterion: "Кора дерев",
      rabbit: "Рідко — при нестачі іншої їжі",
      hare: "Регулярно взимку — береза, верба, осика",
      winner: "hare",
    },
    {
      criterion: "Цекотрофія (вторинний послід)",
      rabbit: "Активна — з'їдає цекотрофи регулярно",
      hare: "Також практикує, але рідше досліджена",
      winner: "equal",
    },
    {
      criterion: "Потреба у воді",
      rabbit: "Висока — 50–150 мл/кг на добу",
      hare: "Нижча — отримує більше вологи з їжею",
      winner: "hare",
    },
    {
      criterion: "Адаптація до зимового раціону",
      rabbit: "Потребує запасів корму або зимує в норі",
      hare: "Переходить на кору та суху траву під снігом",
      winner: "hare",
    },
  ],
};

const hareSpecies: HareSpecies[] = [
  {
    id: "lepus-europaeus",
    name: "Заєць-русак",
    latinName: "Lepus europaeus",
    habitat: "Вся Україна, Європа, Мала Азія",
    weight: "3–7 кг",
    speed: "до 70 км/год",
    note: "Найпоширеніший вид в Україні. Не змінює колір хутра взимку. Ареал: відкриті поля, лісостеп",
  },
  {
    id: "lepus-timidus",
    name: "Заєць-біляк",
    latinName: "Lepus timidus",
    habitat: "Північ України, Сибір, Скандинавія",
    weight: "2–5 кг",
    speed: "до 60 км/год",
    note: "Хутро взимку стає повністю білим — камуфляж у снігу. Живе в лісах і тундрі. Менший за русака",
  },
  {
    id: "lepus-arcticus",
    name: "Арктичний заєць",
    latinName: "Lepus arcticus",
    habitat: "Арктика, Канада, Гренландія",
    weight: "2,5–7 кг",
    speed: "до 65 км/год",
    note: "Залишається білим весь рік у арктичних регіонах. Може утворювати великі тимчасові групи",
  },
  {
    id: "lepus-californicus",
    name: "Чорнохвостий заєць",
    latinName: "Lepus californicus",
    habitat: "Північна Америка, пустелі",
    weight: "1,5–3,5 кг",
    speed: "до 72 км/год",
    note: "Величезні вуха слугують для охолодження в спеку — радіатори тепла. Активний вночі",
  },
];

const historyFacts: HistoryFact[] = [
  {
    period: "~ 55 млн р. тому",
    icon: "🦕",
    fact: "Найдавніші предки зайцеподібних — Eurymylus та Mimolagus — з'явились в Азії. Зайцеподібні та гризуни розійшлись від спільного предка",
  },
  {
    period: "~ 40 млн р. тому",
    icon: "🌍",
    fact: "Зайцеподібні поширились на всі континенти крім Австралії та Антарктиди. Попередники сучасних зайців жили разом з динозаврами пізньої крейди",
  },
  {
    period: "Стародавній Єгипет",
    icon: "𓃱",
    fact: "Заєць — священна тварина в єгипетській традиції. Ієрогліф зайця (wn) означав «існувати», «бути». Богиня Уну зображалась із головою зайця",
  },
  {
    period: "Стародавня Греція і Рим",
    icon: "🏛",
    fact: "Зайці вважались символом родючості та швидкості. Полювання на зайця із собаками (coursing) — аристократичне хобі. Плутарх описував зайця як тварину що «спить з відкритими очима»",
  },
  {
    period: "Середньовічна Європа",
    icon: "⚜️",
    fact: "Заєць — один з найпоширеніших символів у геральдиці. Три зайці у колі (символ Трьох Зайців) — середньовічний символ Трійці, знайдений у храмах від Китаю до Англії",
  },
  {
    period: "Слов'янська традиція",
    icon: "🌿",
    fact: "У слов'ян заєць — «нечиста» тварина, зустріч з ним — погана прикмета. Але хутро та м'ясо активно використовувались. Тотемна тварина у деяких фінно-угорських народів",
  },
  {
    period: "XVIII–XIX ст.",
    icon: "🔬",
    fact: "Карл Лінней (1758) описав зайця-русака як Lepus europaeus. Вперше науково відрізнили кролика і зайця як окремі роди — до того їх плутали",
  },
  {
    period: "Сучасність",
    icon: "🌱",
    fact: "Популяція зайця-русака в Україні скорочується через інтенсивне землеробство, хімізацію полів та втрату місць проживання. Вид під охороною у ряді регіонів",
  },
];

const domesticHareFacts = [
  {
    question: "Чи можна тримати зайця вдома?",
    answer:
      "Технічно — так. Юридично в Україні — дозволено для звичайних видів. Але практично — це складно і найчастіше жорстоко по відношенню до тварини.",
    verdict: "Не рекомендується",
    verdictType: "warn" as const,
  },
  {
    question: "Чому заєць погано переносить неволю?",
    answer:
      "Заєць — дикий вид з тисячоліттями відбору на максимальну настороженість і реакцію на небезпеку. На відміну від кролика (одомашненого ~2500 років тому), заєць не пройшов доместикацію. Будь-який різкий звук, рух або дотик — ​стрес-реакція з викидом адреналіну. Хронічний стрес у неволі призводить до міопатії (м'язова дистрофія від стресу), що часто смертельна.",
    verdict: "Хронічний стрес = хвороба",
    verdictType: "danger" as const,
  },
  {
    question: "Що таке міопатія від стресу у зайців?",
    answer:
      "Capture myopathy — синдром, при якому м'язовий стрес від переляку або тривалого утримання призводить до розпаду м'язових волокон (рабдоміоліз). Зайці можуть загинути від переляку буквально за кілька годин або днів після потрапляння в неволю. Симптоми: слабкість, судоми, паралич. Лікування малоефективне.",
    verdict: "Смертельна загроза",
    verdictType: "danger" as const,
  },
  {
    question: "Заєць-підліток (ошалів): що робити?",
    answer:
      "Якщо ви знайшли молодого зайця — НЕ беріть його додому. Мати зайця приходить лише 1–2 рази на добу. Зайченята залишені самі — це норма, а не сирота. Якщо тварина явно поранена — зв'яжіться з реабілітаційним центром дикої природи. Руки людини на зайченяті = запах хижака = мати може не повернутись.",
    verdict: "Не чіпати — залишити на місці",
    verdictType: "warn" as const,
  },
  {
    question: "Чи існують одомашнені зайці?",
    answer:
      "Були спроби одомашнення у XIX ст. в Європі — без успіху. Сучасна наука підтверджує: заєць генетично несумісний з кроликом (різна кількість хромосом: 48 vs 44), тому гібридизація неможлива. Жодна порода домашнього зайця не існує — всі 'домашні зайці' насправді є декоративними кроликами з довгими вухами.",
    verdict: "Одомашнених порід не існує",
    verdictType: "ok" as const,
  },
];

const hareReproduction = [
  {
    icon: "❄️",
    season: "Лютий–березень",
    title: "Перший гін (тічка)",
    text: "Самці починають активно переслідувати самок ще в лютому, часом по снігу. Характерні 'бокси' — самці стоять на задніх лапах і б'ють один одного передніми. Це і дало вираз 'crazy as a March hare'",
  },
  {
    icon: "🌱",
    season: "Березень–квітень",
    title: "Перший послід",
    text: "Після 42–44 днів вагітності самка народжує 1–5 зайченят просто в траві або неглибокій лежці. Ніяких нір, ніякої підготовки гнізда. Новонароджені одразу зрячі, вкриті шерстю і можуть бігати через кілька годин",
  },
  {
    icon: "🌸",
    season: "Травень–червень",
    title: "Другий послід (суперфетація)",
    text: "Унікальна особливість зайця — суперфетація. Самка може бути повторно запліднена ще під час вагітності. Фактично в матці одночасно розвиваються зайченята різного віку. Перед народженням першого посліду самка вже вагітна другим",
  },
  {
    icon: "☀️",
    season: "Липень–серпень",
    title: "Третій послід",
    text: "Самки активно продовжують розмноження. Влітку їжі вдосталь, тому виживаність зайченят вища. Молодняк стає самостійним вже через 2–3 тижні",
  },
  {
    icon: "🍂",
    season: "Вересень–жовтень",
    title: "Останній послід сезону",
    text: "Пізні зайченята (листопадники) мають найменші шанси на виживання — мало часу набрати жир до зими. Розмноження закінчується в жовтні–листопаді",
  },
  {
    icon: "🌨️",
    season: "Листопад–лютий",
    title: "Зимовий спокій",
    text: "Заєць не впадає в сплячку. Активний цілий рік. Взимку переходить на кору та гілки дерев, може підкопуватись під сніг за їжею або тиснути там від холоду",
  },
];

// ─── Component ───────────────────────────────────────────────────
export default function RabbitVsHare() {
  const [activeCategory, setActiveCategory] =
    useState<CompareCategory>("anatomy");
  const [openHare, setOpenHare] = useState<string | null>(null);
  const [openDomestic, setOpenDomestic] = useState<number | null>(null);

  const categoryLabels: Record<CompareCategory, string> = {
    anatomy: "🦴 Анатомія",
    behavior: "🧠 Поведінка",
    reproduction: "🍼 Розмноження",
    habitat: "🌿 Середовище",
    diet: "🥕 Харчування",
  };

  const verdictColors = {
    ok: {
      bg: "var(--green-light)",
      color: "var(--green-dark)",
      border: "var(--green-accent)",
    },
    warn: {
      bg: "var(--amber-light)",
      color: "var(--brown)",
      border: "var(--amber)",
    },
    danger: { bg: "#FFE0DE", color: "#8B0000", border: "#C0392B" },
  };

  return (
    <div className="rvh-page">
      <header className="rvh-header">
        <h1>Кролик vs Заєць</h1>
        <p>
          Чим відрізняються, де живе заєць, як розмножується — і чому його не
          можна тримати вдома. Вся перевірена інформація від А до Я.
        </p>
      </header>

      <div className="rvh-wrap">
        {/* ФОТО-ПОРІВНЯННЯ */}
        <h2 className="rvh-section-title">З першого погляду</h2>
        <div className="rvh-photo-compare">
          <div className="rvh-photo-card">
            <div className="rvh-photo-placeholder">
              <img
                src="/images/rabbit-photo.webp"
                alt="Домашній кролик"
                className="rvh-photo-img"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  (
                    e.target as HTMLImageElement
                  ).nextElementSibling?.classList.remove(
                    "rvh-photo-fallback--hidden",
                  );
                }}
              />
            </div>
            <div className="rvh-photo-info">
              <h3>Домашній кролик</h3>
              <p className="rvh-photo-latin">
                Oryctolagus cuniculus domesticus
              </p>
              <ul className="rvh-photo-traits">
                <li>Короткі округлі вуха</li>
                <li>Компактне тіло</li>
                <li>Різноманітні кольори (декоративні)</li>
                <li>Вуха — без чорних кінчиків</li>
                <li>Спокійний вигляд, звик до людини</li>
              </ul>
            </div>
          </div>

          <div className="rvh-vs-divider">VS</div>

          <div className="rvh-photo-card rvh-photo-card--hare">
            <div className="rvh-photo-placeholder">
              <img
                src="/images/hare-photo.webp"
                alt="Заєць-русак"
                className="rvh-photo-img"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  (
                    e.target as HTMLImageElement
                  ).nextElementSibling?.classList.remove(
                    "rvh-photo-fallback--hidden",
                  );
                }}
              />
            </div>
            <div className="rvh-photo-info">
              <h3>Заєць-русак</h3>
              <p className="rvh-photo-latin">Lepus europaeus</p>
              <ul className="rvh-photo-traits">
                <li>Дуже довгі вуха з чорними кінчиками</li>
                <li>Стрункіше, витягнуте тіло</li>
                <li>Рудувато-сірий колір (камуфляж)</li>
                <li>Довші задні лапи</li>
                <li>Насторожений, дикий вигляд</li>
              </ul>
            </div>
          </div>
        </div>
        {/* ГОЛОВНА РІЗНИЦЯ */}
        <h2 className="rvh-section-title">Головне що треба знати</h2>
        <div className="rvh-key-facts">
          <div className="rvh-key-fact">
            <span className="rvh-key-icon">🧬</span>
            <div>
              <strong>Різні роди, не схрещуються</strong>
              <p>
                Кролик — Oryctolagus, заєць — Lepus. Різна кількість хромосом
                (44 vs 48). Гібриди неможливі незважаючи на зовнішню схожість.
              </p>
            </div>
          </div>
          <div className="rvh-key-fact">
            <span className="rvh-key-icon">🏠</span>
            <div>
              <strong>Кролик — нора, заєць — лежка</strong>
              <p>
                Кролик риє підземні нори до 50 м завдовжки. Заєць ніколи не риє
                нір — відпочиває у простій западині в траві.
              </p>
            </div>
          </div>
          <div className="rvh-key-fact">
            <span className="rvh-key-icon">👶</span>
            <div>
              <strong>Сліпі vs зрячі при народженні</strong>
              <p>
                Крільченята — сліпі та голі. Зайченята — зрячі, вкриті шерстю,
                бігають через години після народження.
              </p>
            </div>
          </div>
          <div className="rvh-key-fact">
            <span className="rvh-key-icon">🐾</span>
            <div>
              <strong>Домашній vs дикий</strong>
              <p>
                Кролик одомашнений ~2500 років тому. Заєць — дикий вид,
                доместикація не вдалась. Неволя для зайця = хронічний стрес і
                захворювання.
              </p>
            </div>
          </div>
        </div>
        {/* ПОРІВНЯЛЬНА ТАБЛИЦЯ */}
        <h2 className="rvh-section-title">Детальне порівняння</h2>
        <div className="rvh-compare-tabs">
          {(Object.keys(categoryLabels) as CompareCategory[]).map((cat) => (
            <button
              key={cat}
              className={`rvh-tab ${activeCategory === cat ? "rvh-tab--active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>
        <div className="rvh-table-wrap" key={activeCategory}>
          <table className="rvh-table">
            <thead>
              <tr>
                <th>Критерій</th>
                <th>🐇 Кролик</th>
                <th>🐰 Заєць</th>
              </tr>
            </thead>
            <tbody>
              {compareData[activeCategory].map((row, i) => (
                <tr key={i}>
                  <td>
                    <strong>{row.criterion}</strong>
                  </td>
                  <td
                    className={row.winner === "rabbit" ? "rvh-td-winner" : ""}
                  >
                    {row.rabbit}
                  </td>
                  <td className={row.winner === "hare" ? "rvh-td-winner" : ""}>
                    {row.hare}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* ЧОМУ НЕ МОЖНА ТРИМАТИ ЗАЙЦЯ */}
        <h2 className="rvh-section-title">Чи можна тримати зайця вдома?</h2>
        <p className="rvh-intro">
          Це питання задають часто — відповідь розгорнута і важлива
        </p>
        <div className="rvh-domestic-list">
          {domesticHareFacts.map((fact, i) => {
            const isOpen = openDomestic === i;
            const vc = verdictColors[fact.verdictType];
            return (
              <article
                key={i}
                className={`rvh-domestic-card ${isOpen ? "rvh-domestic-card--open" : ""}`}
                onClick={() => setOpenDomestic(isOpen ? null : i)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && setOpenDomestic(isOpen ? null : i)
                }
              >
                <div className="rvh-domestic-header">
                  <strong className="rvh-domestic-q">{fact.question}</strong>
                  <span
                    className="rvh-verdict-badge"
                    style={{
                      background: vc.bg,
                      color: vc.color,
                      borderColor: vc.border,
                    }}
                  >
                    {fact.verdict}
                  </span>
                  <span className="rvh-chevron">{isOpen ? "▲" : "▼"}</span>
                </div>
                {isOpen && <p className="rvh-domestic-answer">{fact.answer}</p>}
              </article>
            );
          })}
        </div>
        {/* РОЗМНОЖЕННЯ ЗАЙЦЯ */}
        <h2 className="rvh-section-title">Окроли зайця — як це відбувається</h2>
        <p className="rvh-intro">
          Зайці розмножуються від лютого до жовтня — з унікальними особливостями
        </p>
        <div className="rvh-repro-list">
          {hareReproduction.map((r, i) => (
            <div key={i} className="rvh-repro-card">
              <div className="rvh-repro-left">
                <span className="rvh-repro-icon">{r.icon}</span>
                <span className="rvh-repro-season">{r.season}</span>
              </div>
              <div className="rvh-repro-right">
                <strong className="rvh-repro-title">{r.title}</strong>
                <p className="rvh-repro-text">{r.text}</p>
              </div>
            </div>
          ))}
        </div>
        {/* ВИДИ ЗАЙЦІВ */}
        <h2 className="rvh-section-title">Основні види зайців світу</h2>
        <p className="rvh-intro">Натисніть — ареал, вага та особливості</p>
        <div className="rvh-species-grid">
          {hareSpecies.map((sp) => {
            const isOpen = openHare === sp.id;
            return (
              <article
                key={sp.id}
                className={`rvh-species-card ${isOpen ? "rvh-species-card--open" : ""}`}
                onClick={() => setOpenHare(isOpen ? null : sp.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && setOpenHare(isOpen ? null : sp.id)
                }
              >
                <div className="rvh-species-header">
                  <div>
                    <h3 className="rvh-species-name">{sp.name}</h3>
                    <p className="rvh-species-latin">{sp.latinName}</p>
                  </div>
                  <span className="rvh-chevron">{isOpen ? "▲" : "▼"}</span>
                </div>
                {isOpen && (
                  <div className="rvh-species-details">
                    <div className="rvh-species-row">
                      <span>🌍 Ареал:</span>
                      <p>{sp.habitat}</p>
                    </div>
                    <div className="rvh-species-row">
                      <span>⚖️ Вага:</span>
                      <p>{sp.weight}</p>
                    </div>
                    <div className="rvh-species-row">
                      <span>💨 Швидкість:</span>
                      <p>{sp.speed}</p>
                    </div>
                    <div className="rvh-species-row rvh-species-row--note">
                      <span>💡 Особливість:</span>
                      <p>{sp.note}</p>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
        {/* ІСТОРІЯ */}
        <h2 className="rvh-section-title">Трохи історії зайця</h2>
        <div className="rvh-history-list">
          {historyFacts.map((f, i) => (
            <div key={i} className="rvh-history-card">
              <div className="rvh-history-left">
                <span className="rvh-history-icon">{f.icon}</span>
                <span className="rvh-history-period">{f.period}</span>
              </div>
              <p className="rvh-history-fact">{f.fact}</p>
            </div>
          ))}
        </div>
        {/* АЛЕРТИ */}
        <h2 className="rvh-section-title">Підсумки та важливі висновки</h2>{" "}
        <div className="rvh-alert danger">
          🚨 Якщо ви знайшли зайченя — НЕ беріть додому. Залиште на місці. Мати
          повернеться вночі. Ваш запах — це запах хижака для неї
        </div>
        <div className="rvh-alert danger">
          🚨 Заєць у неволі може загинути від стресу протягом кількох годин —
          capture myopathy. Це не міф, це задокументований ветеринарний факт
        </div>
        <div className="rvh-alert warn">
          ⚠️ «Домашній заєць» у зоомагазині — це декоративний кролик породи з
          довгими вухами, а НЕ справжній заєць. Справжні зайці не продаються як
          домашні тварини
        </div>
        <div className="rvh-alert warn">
          ⚠️ Кролик і заєць не можуть бути схрещені — різна кількість хромосом
          робить це біологічно неможливим
        </div>
        <div className="rvh-alert ok">
          ✓ Якщо хочете тварину схожу на зайця — оберіть породу кролика з
          довгими вухами: фламандський велетень, баран французький. Вони
          доглянуті, приручені і не страждають у неволі
        </div>
        <div className="rvh-note">
          <p>
            <strong>Джерела:</strong> Flux J.E.C. & Angermann R. — The Hares and
            Pikas; Macdonald D. — The New Encyclopedia of Mammals (Oxford);
            Nowak R.M. — Walker's Mammals of the World; Angus S. — Lagomorpha:
            Rabbits, Hares and Pikas; IUCN Red List — Lepus europaeus; Sandford
            J.C. — The Domestic Rabbit (5th ed., Blackwell).
          </p>
        </div>
      </div>

      {/* ЧИТАЙТЕ ТАКОЖ */}
      <div className="rvh-related">
        <h3 className="rvh-related-title">Читайте також</h3>
        <div className="rvh-related-grid">
          <Link to="/biology" className="rvh-related-link">
            🐾 Біологія та анатомія
          </Link>
          <Link to="/breeds" className="rvh-related-link">
            🐇 Породи
          </Link>
          <Link to="/predators" className="rvh-related-link">
            🦊 Хижаки та шкідники
          </Link>
          <Link to="/rabbits-and-predators" className="rvh-related-link">
            🐈🐕 Кролі, коти та собаки
          </Link>
          <Link to="/okril" className="rvh-related-link">
            🍼 Окріл
          </Link>
        </div>
      </div>

      <div className="rvh-back">
        <Link to="/" className="rvh-back-btn">
          ⬅ На головну
        </Link>
        <ShareButton title="Назва цієї сторінки" />
      </div>
    </div>
  );
}
