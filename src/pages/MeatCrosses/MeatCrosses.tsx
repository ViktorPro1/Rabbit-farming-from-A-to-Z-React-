import { useState } from "react";
import { Link } from "react-router-dom";
import "./MeatCrosses.css";
import ShareButton from "../../components/ShareButton/ShareButton";

type SectionId = "basics" | "crosses" | "growth" | "feeding" | "mistakes";

interface McStep {
  icon: string;
  title: string;
  text: string;
  warning?: string;
  tip?: string;
}

interface McSection {
  id: SectionId;
  icon: string;
  title: string;
  desc: string;
  steps: McStep[];
}

const sections: McSection[] = [
  {
    id: "basics",
    icon: "🍖",
    title: "Чому саме помісі для м'яса",
    desc: "Логіка бройлерного напрямку",
    steps: [
      {
        icon: "⚡",
        title: "«Бройлер» — це майже завжди помісь",
        text: "У кролівництві, як і в птахівництві, товарних тварин на м'ясо переважно отримують не в чистій породі, а цілеспрямованим схрещуванням двох спеціалізованих ліній. Перше покоління (F1) поєднує кращі якості обох батьків — швидкий ріст, гарний вихід м'яса, міцне здоров'я.",
        tip: "Навіть промислові гібриди на кшталт французького Хіколь чи Hyla побудовані саме на схемі «материнська лінія + батьківська лінія» — тобто це кероване схрещування, а не одна порода.",
      },
      {
        icon: "🧬",
        title: "Що саме дає гетерозис у м'ясному напрямку",
        text: "У помісного молодняку часто швидший приріст живої маси за добу, краща конверсія корму (менше корму на кілограм приросту) і вища життєздатність у молодому віці, ніж у кожної з батьківських порід окремо.",
      },
      {
        icon: "🎯",
        title: "Материнська і батьківська лінія",
        text: "У продуманому м'ясному розведенні одну породу підбирають переважно за материнськими якостями (молочність, розмір посліду, турбота про кроленят), а іншу — за батьківськими (швидкий ріст, мускулатура, забійний вихід). Приплід від такого поєднання отримує сильні сторони з обох боків.",
      },
    ],
  },
  {
    id: "crosses",
    icon: "🥇",
    title: "Перевірені м'ясні поєднання",
    desc: "Конкретні пари порід і результат",
    steps: [
      {
        icon: "🥇",
        title: "Каліфорнійська (батько) × Новозеландська біла (мати)",
        text: "Найпоширеніша у світі м'ясна схема. Новозеландська біла дає гарну молочність і розмір посліду (7–12 кроленят), каліфорнійська — скоростиглість і щільну мускулатуру. Саме на основі цього поєднання свого часу виведена французька порода хіколь.",
        tip: "Забійний вихід у такої помісі зазвичай тримається в межах 55–60%.",
      },
      {
        icon: "🥈",
        title: "Фландр × Каліфорнійська (або Новозеландська)",
        text: "Фландр додає кістяк і потенціал до великої дорослої ваги, друга порода — швидкість росту молодняку. Помісь виходить крупнішою за чисту каліфорнійську чи новозеландську, зберігаючи при цьому непогану скоростиглість.",
        warning:
          "Чистий фландр сам по собі повільно росте і має низьку плодючість (до 5 кроленят у посліді) — саме тому в чистому вигляді для товарного м'яса його майже не тримають.",
      },
      {
        icon: "🥉",
        title: "Шиншила × Білий (або Сірий) велетень",
        text: "Класична вітчизняна м'ясо-шкуркова комбінація. Велетень дає розмір і невибагливість, шиншила — непогану скоростиглість і якісне хутро як додатковий продукт. Історично сама шиншила виведена саме таким шляхом.",
      },
      {
        icon: "🏭",
        title: "Промислові гібриди (Хіколь, Hyla, Hycole)",
        text: "Комерційні кроси, побудовані фермерами французької селекції на схожій логіці: окрема материнська і батьківська лінія. За практикою українських фермерів, які працюють з Хіколь, від народження до товарної ваги 2,8–3,0 кг молодняк доростає в середньому за 77 днів.",
        tip: "Такі гібриди привабливі саме передбачуваністю: конверсія корму, приріст і материнські якості стабільні від партії до партії.",
      },
    ],
  },
  {
    id: "growth",
    icon: "📈",
    title: "Темпи росту й забійний вік",
    desc: "Коли молодняк готовий до забою",
    steps: [
      {
        icon: "⏱️",
        title: "Загальний орієнтир",
        text: "Більшість перевірених м'ясних помісей набирають забійну вагу 2,5–3,5 кг у віці приблизно 2,5–4 місяців, залежно від конкретного поєднання і годівлі.",
      },
      {
        icon: "📊",
        title: "Чому вік забою впливає на якість",
        text: "Конверсія корму у молодняку найвища саме в перші місяці життя — тобто на кілограм приросту йде найменше корму. Чим довше тримати тварину понад оптимальний вік, тим дорожчим стає кожен додатковий кілограм м'яса.",
        warning:
          "Забій занадто старого молодняку економічно невигідний і не покращує якість м'яса — навпаки, воно стає жорсткішим.",
      },
      {
        icon: "🏆",
        title: "Найшвидші поєднання",
        text: "Каліфорнійська × Новозеландська і промислові гібриди типу Хіколь зазвичай найшвидші — товарна вага за 2,5–3 місяці. Поєднання з участю фландра ростуть трохи довше, зате дають більшу кінцеву вагу дорослої тварини.",
      },
    ],
  },
  {
    id: "feeding",
    icon: "🥕",
    title: "Годівля м'ясної помісі",
    desc: "Щоб генетика справді спрацювала",
    steps: [
      {
        icon: "🍽️",
        title: "Вільний доступ до корму",
        text: "Для максимального приросту молодняку м'ясного напрямку раціон будують так, щоб тварини мали постійний доступ до їжі протягом доби — конверсія корму найкраща саме в молодому віці.",
      },
      {
        icon: "🥩",
        title: "Акцент на білок",
        text: "Відгодівля бройлерного молодняку вимагає підвищеної частки білка в раціоні — це будівельний матеріал для м'язової маси. Навіть найкраща генетика помісі не розкриється на бідному раціоні.",
      },
      {
        icon: "⚖️",
        title: "Баланс, а не лише кількість",
        text: "Окрім комбікорму, важливі сіно, соковиті корми і чиста вода без обмежень. Різкі зміни раціону в молодому віці можуть спричинити розлади травлення й уповільнити приріст.",
      },
    ],
  },
  {
    id: "mistakes",
    icon: "⚠️",
    title: "Типові помилки",
    desc: "Що псує результат навіть при вдалому поєднанні",
    steps: [
      {
        icon: "🔄",
        title: "Залишати F1 на подальше розведення",
        text: "Помісне потомство F1 показує найкращі якості завдяки гетерозису, але якщо парувати таких помісей між собою далі, наступне покоління вже виходить гіршим і непередбачуваним. Для стабільного результату щоразу заново парують чистопородних батьків.",
      },
      {
        icon: "🎲",
        title: "Поєднання без чіткої мети",
        text: "Схрещування «що є в господарстві» без розуміння, яка порода відповідає за материнські якості, а яка — за приріст, найчастіше дає посередній результат замість справжнього ефекту гетерозису.",
      },
      {
        icon: "🐇",
        title: "Ігнорування материнської лінії",
        text: "Часто увагу приділяють лише швидкості росту самця-плідника, забуваючи, що молочність і розмір посліду самки прямо визначають, скільки кроленят взагалі доживе до відгодівлі.",
      },
    ],
  },
];

const MeatCrosses = () => {
  const [activeSection, setActiveSection] = useState<SectionId>("basics");
  const activeIndex = sections.findIndex((s) => s.id === activeSection);
  const current = sections[activeIndex];

  return (
    <main className="mc-page">
      <div className="mc-header">
        <h1>🍖 Помісі для м'яса</h1>
        <p>Перевірені схеми схрещування з найкращим виходом м'яса</p>
      </div>

      <div className="mc-wrap">
        <div className="mc-notice">
          ⚠️ Найкращий результат дає лише перше покоління (F1) — не залишайте
          помісне потомство для подальшого розведення.
        </div>

        {/* Таймлайн-навігація */}
        <div className="mc-timeline-nav">
          {sections.map((s, i) => (
            <button
              key={s.id}
              className={`mc-tl-item${activeSection === s.id ? " active" : ""}${i < activeIndex ? " done" : ""}`}
              onClick={() => setActiveSection(s.id)}
            >
              <span className="mc-tl-dot">{s.icon}</span>
              <span className="mc-tl-label">{s.title}</span>
            </button>
          ))}
        </div>

        {/* Заголовок розділу */}
        <div className="mc-section-header">
          <span className="mc-section-num">
            {activeIndex + 1}/{sections.length}
          </span>
          <div>
            <h2 className="mc-section-title">{current.title}</h2>
            <p className="mc-section-desc">{current.desc}</p>
          </div>
        </div>

        {/* Кроки — вертикальний таймлайн, все розгорнуто */}
        <div className="mc-timeline">
          {current.steps.map((step, i) => (
            <div key={i} className="mc-tl-step">
              <div className="mc-tl-line">
                <span className="mc-tl-circle">{step.icon}</span>
                {i < current.steps.length - 1 && (
                  <span className="mc-tl-connector" />
                )}
              </div>
              <div className="mc-tl-card">
                <h3 className="mc-tl-title">{step.title}</h3>
                <p className="mc-tl-text">{step.text}</p>
                {step.warning && (
                  <div className="mc-warning">⚠️ {step.warning}</div>
                )}
                {step.tip && <div className="mc-tip">💡 {step.tip}</div>}
              </div>
            </div>
          ))}
        </div>

        {/* Швидка шпаргалка — горизонтальна стрічка */}
        <div className="mc-cheatsheet">
          <div className="mc-cheat-title">📋 Швидка шпаргалка</div>
          <div className="mc-cheat-strip">
            <div className="mc-cheat-pill">
              <span className="mc-cheat-label">Топ поєднання</span>
              <span className="mc-cheat-value">
                Каліфорнійська × Новозеландська
              </span>
            </div>
            <div className="mc-cheat-pill">
              <span className="mc-cheat-label">Максимальна маса</span>
              <span className="mc-cheat-value">Фландр × Каліфорнійська</span>
            </div>
            <div className="mc-cheat-pill">
              <span className="mc-cheat-label">Забійна вага</span>
              <span className="mc-cheat-value">2,5–3,5 кг</span>
            </div>
            <div className="mc-cheat-pill">
              <span className="mc-cheat-label">Вік забою</span>
              <span className="mc-cheat-value">2,5–4 місяці</span>
            </div>
            <div className="mc-cheat-pill">
              <span className="mc-cheat-label">Забійний вихід</span>
              <span className="mc-cheat-value">55–60%</span>
            </div>
            <div className="mc-cheat-pill">
              <span className="mc-cheat-label">Хіколь</span>
              <span className="mc-cheat-value">~77 днів до 2,8–3,0 кг</span>
            </div>
          </div>
        </div>

        <div className="mc-related">
          <h3 className="mc-related-title">Читайте також</h3>
          <div className="mc-related-grid">
            <Link to="/verified-crosses" className="mc-related-link">
              🐇 Перевірені поєднання порід
            </Link>
            <Link to="/half-siblings" className="mc-related-link">
              🧬 Напівсибси
            </Link>
            <Link to="/breed-selection" className="mc-related-link">
              🎯 Племінний відбір
            </Link>
            <Link to="/feeding" className="mc-related-link">
              🥕 Годування
            </Link>
          </div>
        </div>

        <div className="mc-back">
          <Link to="/" className="mc-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Помісі для м'яса" />
        </div>
      </div>
    </main>
  );
};

export default MeatCrosses;
