import { useState } from "react";
import { Link } from "react-router-dom";
import "./HalfSiblings.css";
import ShareButton from "../../components/ShareButton/ShareButton";

type SectionId = "basics" | "coefficient" | "inbreeding" | "practice" | "risks";

interface HsStep {
  icon: string;
  title: string;
  text: string;
  warning?: string;
  tip?: string;
}

interface HsSection {
  id: SectionId;
  icon: string;
  title: string;
  desc: string;
  steps: HsStep[];
}

const sections: HsSection[] = [
  {
    id: "basics",
    icon: "🐰",
    title: "Що таке напівсибси",
    desc: "Базове визначення простими словами",
    steps: [
      {
        icon: "🔤",
        title: "Визначення",
        text: "Напівсибси (напівбрати/напівсестри) — кролі, у яких спільний лише один з батьків: або тільки мати, або тільки батько. Другий з батьків — різний.",
        tip: "Приклад: самець А покрив самку Б і самку В. Кроленята з обох послідів — напівсибси по батькові.",
      },
      {
        icon: "🆚",
        title: "Напівсибс vs повний сибс",
        text: "Повні сибси (рідні брати й сестри) мають спільними обох батьків. Напівсибси мають спільного лише одного з батьків — тому спорідненість між ними вдвічі менша.",
      },
      {
        icon: "👨‍👩‍👧",
        title: "По матері чи по батькові",
        text: "Напівсибс по матері — спільна мати, різні батьки. Напівсибс по батькові — спільний батько, різні матері. Другий варіант типовіший для ферми, де один плідник криє кількох самок.",
      },
      {
        icon: "📖",
        title: "Чому це важливо знати",
        text: "Без чіткого родоводу легко випадково спарувати напівсибсів через кілька поколінь, навіть не підозрюючи про це. Це прихований інбридинг — головна причина непередбачуваного погіршення якості стада.",
      },
    ],
  },
  {
    id: "coefficient",
    icon: "🧬",
    title: "Коефіцієнт спорідненості",
    desc: "Скільки спільних генів у різних родичів",
    steps: [
      {
        icon: "📊",
        title: "Що показує коефіцієнт",
        text: "Коефіцієнт спорідненості (Райта) показує, яка частка генів у двох тварин теоретично спільна через спільного предка. Виражається у відсотках або частках.",
      },
      {
        icon: "📐",
        title: "Основні значення",
        text: "Батько — нащадок: 50%. Повні сибси: 25%. Напівсибси: 12,5%. Двоюрідні (кузени): 6,25%.",
        tip: "Легко запам'ятати: кожен крок віддалення від прямої лінії ділить спорідненість навпіл.",
      },
      {
        icon: "🔍",
        title: "Чому напівсибси — рівно половина від повних",
        text: "У повних сибсів спільні і мати, і батько — два джерела спільних генів. У напівсибсів спільне лише одне джерело, тому теоретична спорідненість рівно вдвічі менша: 12,5% замість 25%.",
      },
    ],
  },
  {
    id: "inbreeding",
    icon: "⚗️",
    title: "Інбридинг при паруванні напівсибсів",
    desc: "Що буде з нащадками, якщо спарувати напівсибсів між собою",
    steps: [
      {
        icon: "🧮",
        title: "Коефіцієнт інбридингу нащадка",
        text: "Якщо спарувати двох напівсибсів, коефіцієнт інбридингу (F) приплоду становитиме приблизно 12,5% (1/8). Для порівняння: приплід від пари повних сибсів матиме F ≈ 25%, від пари двоюрідних — F ≈ 6,25%.",
        warning:
          "F показує наскільки нащадок 'зібраний' з однакових генів через спільних предків — вищий показник означає вищий ризик прояву небажаних рецесивних ознак.",
      },
      {
        icon: "⚖️",
        title: "Як це співвідноситься з іншими варіантами",
        text: "12,5% — середній рівень: суворіше за спарювання двоюрідних (6,25%), але м'якіше за спарювання повних сибсів чи батька з донькою (по 25%). Тому напівсибсів іноді свідомо використовують у племінній роботі — на відміну від тісніших варіантів.",
      },
      {
        icon: "📉",
        title: "Накопичувальний ефект",
        text: "Якщо напівспоріднене парування повторювати з покоління в покоління без чергування з неспорідненими тваринами, F зростає кумулятивно з кожним разом.",
      },
    ],
  },
  {
    id: "practice",
    icon: "🎯",
    title: "Практичне застосування в розведенні",
    desc: "Коли і як свідомо використовують напівсибсів",
    steps: [
      {
        icon: "🏅",
        title: "Лінійне розведення (лайнбридинг)",
        text: "Парування напівсибсів — один з інструментів лінійного розведення: помірний спосіб закріпити цінні ознаки видатного плідника чи матки, не вдаючись до тіснішого інбридингу.",
      },
      {
        icon: "🐇",
        title: "Коли це доцільно",
        text: "Коли в стаді є тварина з дуже цінними ознаками (вага, плодючість, якість хутра) і хочеться закріпити їх у наступних поколіннях, а поголів'я обмежене й нових неспоріднених ліній поки немає.",
      },
      {
        icon: "🔄",
        title: "Правило чергування",
        text: "Спорідненого парування (в т.ч. напівсибсів) не варто повторювати щопокоління підряд. Оптимально: одне спорідненне парування — потім одне-два покоління неспорідненого розведення (аутбридинг) для 'розбавлення' F.",
        tip: "Ведіть племінний журнал з датами й парами — так легше планувати чергування і не заплутатись у родоводі.",
      },
      {
        icon: "🎚️",
        title: "Контроль результату",
        text: "Після кожного спорідненого парування уважно оцінюйте приплід: розмір посліду, вагу при народженні, життєздатність. Погіршення показників — сигнал зупинити цю лінію інбридингу.",
      },
    ],
  },
  {
    id: "risks",
    icon: "⚠️",
    title: "Ризики та як їх мінімізувати",
    desc: "Наслідки інбридингу і практичні поради",
    steps: [
      {
        icon: "🩺",
        title: "Депресія інбридингу",
        text: "Накопичення однакових (у т.ч. шкідливих рецесивних) алелей знижує загальну життєздатність: менші послідні, вища смертність кроленят, слабший імунітет, повільніший ріст.",
        warning:
          "Ефект посилюється з кожним новим поколінням спорідненого розведення — не є одноразовим і зникає повільно.",
      },
      {
        icon: "📉",
        title: "Зменшення розміру посліду",
        text: "Один з перших помітних симптомів надмірного інбридингу — скорочення кількості кроленят у посліді та їх нижча вага при народженні.",
      },
      {
        icon: "📋",
        title: "Ведення родоводу",
        text: "Записуйте походження кожної тварини (батько, мати, дата народження) в племінний журнал чи в кабінеті сайту. Без цього легко випадково спарувати напівсибсів через 2–3 покоління.",
      },
      {
        icon: "🎯",
        title: "Безпечний орієнтир",
        text: "Для товарного (не виставкового) стада прагніть тримати F нащадків нижче приблизно 6,25%. Разові парування напівсибсів (F ≈ 12,5%) допустимі як інструмент лайнбридингу, але не як регулярна практика.",
        tip: "Якщо є можливість — періодично вводьте в стадо неспоріднену кров ззовні (нового плідника з іншого господарства).",
      },
    ],
  },
];

const HalfSiblings = () => {
  const [activeSection, setActiveSection] = useState<SectionId>("basics");
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const current = sections.find((s) => s.id === activeSection)!;

  return (
    <main className="hs-page">
      <div className="hs-header">
        <h1>🧬 Напівсибси у кролів</h1>
        <p>Спорідненість, інбридинг і практика розведення простими словами</p>
      </div>

      <div className="hs-wrap">
        <div className="hs-notice">
          ⚠️ Без родоводу легко випадково спарувати напівсибсів через кілька
          поколінь — ведіть племінний журнал.
        </div>

        {/* Навігація по розділах */}
        <div className="hs-nav">
          {sections.map((s) => (
            <button
              key={s.id}
              className={`hs-nav-btn${activeSection === s.id ? " active" : ""}`}
              onClick={() => {
                setActiveSection(s.id);
                setExpandedStep(null);
              }}
            >
              <span className="hs-nav-icon">{s.icon}</span>
              <span className="hs-nav-label">{s.title}</span>
            </button>
          ))}
        </div>

        {/* Заголовок розділу */}
        <div className="hs-section-header">
          <span className="hs-section-icon">{current.icon}</span>
          <div>
            <h2 className="hs-section-title">{current.title}</h2>
            <p className="hs-section-desc">{current.desc}</p>
          </div>
        </div>

        {/* Кроки */}
        <div className="hs-steps">
          {current.steps.map((step, i) => {
            const key = `${activeSection}-${i}`;
            const isOpen = expandedStep === key;
            return (
              <div
                key={key}
                className={`hs-step${isOpen ? " open" : ""}`}
                onClick={() => setExpandedStep(isOpen ? null : key)}
              >
                <div className="hs-step-top">
                  <span className="hs-step-num">{i + 1}</span>
                  <span className="hs-step-icon">{step.icon}</span>
                  <span className="hs-step-title">{step.title}</span>
                  <span className="hs-chevron">{isOpen ? "▲" : "▼"}</span>
                </div>
                {isOpen && (
                  <div className="hs-step-body">
                    <p className="hs-step-text">{step.text}</p>
                    {step.warning && (
                      <div className="hs-warning">⚠️ {step.warning}</div>
                    )}
                    {step.tip && <div className="hs-tip">💡 {step.tip}</div>}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Швидка шпаргалка */}
        <div className="hs-cheatsheet">
          <div className="hs-cheat-title">📋 Швидка шпаргалка</div>
          <div className="hs-cheat-grid">
            <div className="hs-cheat-card">
              <div className="hs-cheat-label">Батько — нащадок</div>
              <div className="hs-cheat-value">50%</div>
            </div>
            <div className="hs-cheat-card">
              <div className="hs-cheat-label">Повні сибси</div>
              <div className="hs-cheat-value">25%</div>
            </div>
            <div className="hs-cheat-card">
              <div className="hs-cheat-label">Напівсибси</div>
              <div className="hs-cheat-value">12,5%</div>
            </div>
            <div className="hs-cheat-card">
              <div className="hs-cheat-label">Двоюрідні (кузени)</div>
              <div className="hs-cheat-value">6,25%</div>
            </div>
            <div className="hs-cheat-card">
              <div className="hs-cheat-label">
                Безпечний F для товарного стада
              </div>
              <div className="hs-cheat-value">до 6,25%</div>
            </div>
            <div className="hs-cheat-card">
              <div className="hs-cheat-label">
                Пауза між спорідненими паруваннями
              </div>
              <div className="hs-cheat-value">1–2 покоління</div>
            </div>
          </div>
        </div>

        <div className="hs-related">
          <h3 className="hs-related-title">Читайте також</h3>
          <div className="hs-related-grid">
            <Link to="/pedigree" className="hs-related-link">
              📖 Родовід
            </Link>
            <Link to="/inbreeding" className="hs-related-link">
              🧬 Інбридинг
            </Link>
            <Link to="/breed-selection" className="hs-related-link">
              🎯 Племінний відбір
            </Link>
            <Link to="/buying-rabbit" className="hs-related-link">
              🐇 Купівля кроля
            </Link>
          </div>
        </div>

        <div className="hs-back">
          <Link to="/" className="hs-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Напівсибси у кролів" />
        </div>
      </div>
    </main>
  );
};

export default HalfSiblings;
