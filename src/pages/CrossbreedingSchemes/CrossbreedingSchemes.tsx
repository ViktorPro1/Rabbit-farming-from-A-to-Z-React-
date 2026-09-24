import { useState } from "react";
import { Link } from "react-router-dom";
import "./CrossbreedingSchemes.css";
import ShareButton from "../../components/ShareButton/ShareButton";

type SectionId = "basics" | "twoway" | "threeway" | "rotational" | "choosing";

interface CsStep {
  icon: string;
  title: string;
  text: string;
  warning?: string;
  tip?: string;
}

interface CsSection {
  id: SectionId;
  icon: string;
  title: string;
  desc: string;
  diagram?: "twoway" | "threeway" | "rotational";
  steps: CsStep[];
}

const sections: CsSection[] = [
  {
    id: "basics",
    icon: "📐",
    title: "Навіщо потрібна схема",
    desc: "Різниця між разовим поєднанням і системою",
    steps: [
      {
        icon: "🎲",
        title: "Разове схрещування — це не система",
        text: "Якщо просто поєднати породу А з породою Б один раз, отримаєте гарне покоління F1. Але що робити з другим, третім поколінням? Без чіткої схеми господарство поступово скочується або в неконтрольований інбридинг, або в хаотичну мішанину порід.",
      },
      {
        icon: "🔁",
        title: "Схема — це план на роки вперед",
        text: "Схема схрещування визначає, які породи виконують яку роль (материнську чи батьківську), звідки братимуться заміна маточного поголів'я і як зберігати ефект гетерозису з покоління в покоління, а не лише один раз.",
        tip: "У промисловому кролівництві саме на таких схемах побудовані комерційні гібриди типу Хіколь чи Hyla — це не одна порода, а керована система з кількох ліній.",
      },
      {
        icon: "🏗️",
        title: "Три основні типи схем",
        text: "Найпоширеніші: двопородне схрещування (проста пара), трипородне (материнський гібрид + третя батьківська порода) і ротаційне (чергування порід із покоління в покоління). Кожна підходить під різний масштаб господарства.",
      },
    ],
  },
  {
    id: "twoway",
    icon: "🥈",
    title: "Двопородне схрещування",
    desc: "Найпростіша схема — одна пара порід",
    diagram: "twoway",
    steps: [
      {
        icon: "➡️",
        title: "Як це працює",
        text: "Порода А (самка) × порода Б (самець) → приплід F1. Це найпростіша схема: обираєте дві перевірені породи і щоразу заново паруєте чистопородних батьків для отримання товарного молодняку.",
        tip: "Саме так найчастіше й починають — наприклад, Каліфорнійська × Новозеландська з розділу «Помісі для м'яса».",
      },
      {
        icon: "✅",
        title: "Переваги",
        text: "Простота: потрібно тримати лише дві чистопородні лінії. Результат стабільний і передбачуваний з покоління в покоління, якщо не розводити F1 «в собі».",
      },
      {
        icon: "⚠️",
        title: "Обмеження",
        text: "Ефект гетерозису отримує лише сам приплід F1, а не наступні покоління маточного стада. Тобто самки для подальшого розведення все одно мають бути чистопородними — F1-самку на плем'я зазвичай не залишають.",
        warning: "Якщо ви плануєте самі вирощувати заміну маточному поголів'ю з власного стада, двопородна схема цього не дає — доведеться регулярно докуповувати чистопородних тварин.",
      },
    ],
  },
  {
    id: "threeway",
    icon: "🥇",
    title: "Трипородне схрещування",
    desc: "Материнський гібрид + третя батьківська порода",
    diagram: "threeway",
    steps: [
      {
        icon: "➡️",
        title: "Як це працює",
        text: "Спочатку поєднують дві материнські породи (А × Б), щоб отримати гібридну самку F1 з високою плодючістю й молочністю. Цю самку F1 далі парують не з породою А чи Б, а з третьою, окремою батьківською породою В, підібраною саме за швидкістю росту й забійними якостями.",
        tip: "Саме так побудовані комерційні гібриди на кшталт Хіколь: окрема материнська лінія (плодючість) і окрема батьківська лінія (ріст, м'ясність).",
      },
      {
        icon: "✅",
        title: "Переваги",
        text: "Товарний молодняк отримує подвійний ефект гетерозису: і від материнського F1, і від поєднання з третьою породою. Материнська самка F1 при цьому сама вже поєднує кращі якості двох порід за плодючістю.",
      },
      {
        icon: "🏭",
        title: "Для кого підходить",
        text: "Ця схема виправдовує себе на середніх і великих господарствах, де є ресурс тримати окремо материнське стадо (породи А і Б для відтворення F1-самок) і окремих плідників породи В.",
        warning: "Для невеликого домашнього господарства (кілька кліток) трипородна схема часто надмірно складна — простіше почати з двопородної.",
      },
    ],
  },
  {
    id: "rotational",
    icon: "🔄",
    title: "Ротаційне схрещування",
    desc: "Чергування порід без постійних закупівель",
    diagram: "rotational",
    steps: [
      {
        icon: "🔁",
        title: "Як це працює",
        text: "Самок від попереднього схрещування залишають на плем'я, але кожне наступне покоління парують уже з іншою породою самця, по черзі — А, потім Б, потім знову А, і так по колу. Це дозволяє використовувати власних самок повторно, не докуповуючи чистопородне маточне поголів'я щоразу.",
      },
      {
        icon: "⚡",
        title: "Чому це зберігає гетерозис",
        text: "Оскільки самку кожного разу парують із породою, відмінною від тієї, що переважає в її власному походженні, частка «чужих» генів у приплоду залишається високою з покоління в покоління — ефект гетерозису не згасає так швидко, як при простому розведенні помісі «в собі».",
      },
      {
        icon: "📋",
        title: "Що для цього потрібно",
        text: "Ротаційна схема вимагає чіткого обліку: яка самка від якого поєднання походить і якою породою самця її парувати наступного разу. Без племінного журналу легко заплутатись і випадково повторити те саме поєднання поспіль.",
        tip: "Найпростіший варіант для невеликого господарства — ротація між двома породами (А↔Б). Три і більше порід у ротації дають кращий результат, але вимагають ще ретельнішого обліку.",
      },
    ],
  },
  {
    id: "choosing",
    icon: "🎯",
    title: "Яку схему обрати",
    desc: "Орієнтир залежно від розміру господарства",
    steps: [
      {
        icon: "🏡",
        title: "Кілька кліток удома",
        text: "Найпростіше — двопородна схема з регулярним докупленням чистопородного плідника чи самки. Мінімум обліку, зрозумілий результат.",
      },
      {
        icon: "🚜",
        title: "Середнє господарство, хочете самі вирощувати заміну",
        text: "Варто розглянути ротаційну схему між двома породами — дозволяє менше залежати від зовнішніх закупівель, зберігаючи непоганий рівень гетерозису.",
      },
      {
        icon: "🏭",
        title: "Велике товарне виробництво",
        text: "Трипородна схема (як у комерційних гібридів) дає найкращий і найстабільніший результат, але вимагає окремого утримання материнських і батьківських ліній та суворого обліку.",
      },
    ],
  },
];

const Diagram = ({ type }: { type: "twoway" | "threeway" | "rotational" }) => {
  if (type === "twoway") {
    return (
      <div className="cs-diagram">
        <div className="cs-box breed-a">Порода А (самка)</div>
        <span className="cs-plus">×</span>
        <div className="cs-box breed-b">Порода Б (самець)</div>
        <span className="cs-arrow">→</span>
        <div className="cs-box result">F1 (товарний молодняк)</div>
      </div>
    );
  }
  if (type === "threeway") {
    return (
      <div className="cs-diagram cs-diagram-stack">
        <div className="cs-row">
          <div className="cs-box breed-a">Порода А</div>
          <span className="cs-plus">×</span>
          <div className="cs-box breed-b">Порода Б</div>
          <span className="cs-arrow">→</span>
          <div className="cs-box result">F1-самка (материнська)</div>
        </div>
        <div className="cs-row">
          <div className="cs-box result small">F1-самка</div>
          <span className="cs-plus">×</span>
          <div className="cs-box breed-c">Порода В (батьківська)</div>
          <span className="cs-arrow">→</span>
          <div className="cs-box result final">Товарний молодняк</div>
        </div>
      </div>
    );
  }
  return (
    <div className="cs-diagram cs-diagram-stack">
      <div className="cs-row">
        <div className="cs-box breed-a">Самка (власна)</div>
        <span className="cs-plus">×</span>
        <div className="cs-box breed-b">Порода А</div>
        <span className="cs-arrow">→</span>
        <div className="cs-box result">Покоління 1</div>
      </div>
      <div className="cs-row">
        <div className="cs-box result small">Самка з покоління 1</div>
        <span className="cs-plus">×</span>
        <div className="cs-box breed-c">Порода Б</div>
        <span className="cs-arrow">→</span>
        <div className="cs-box result">Покоління 2</div>
      </div>
      <div className="cs-row">
        <div className="cs-box result small">Самка з покоління 2</div>
        <span className="cs-plus">×</span>
        <div className="cs-box breed-a">Порода А (знову)</div>
        <span className="cs-arrow">→</span>
        <div className="cs-box result final">Покоління 3 …</div>
      </div>
    </div>
  );
};

const CrossbreedingSchemes = () => {
  const [activeSection, setActiveSection] = useState<SectionId>("basics");
  const current = sections.find((s) => s.id === activeSection)!;

  return (
    <main className="cs-page">
      <div className="cs-header">
        <h1>📐 Схеми поєднання порід</h1>
        <p>Двопородне, трипородне й ротаційне — як поєднувати породи системно, а не одноразово</p>
      </div>

      <div className="cs-wrap">
        <div className="cs-notice">
          📋 Будь-яка схема, окрім найпростішої двопородної, вимагає ведення
          племінного журналу — без обліку легко заплутатись у поколіннях.
        </div>

        <div className="cs-nav">
          {sections.map((s) => (
            <button
              key={s.id}
              className={`cs-nav-btn${activeSection === s.id ? " active" : ""}`}
              onClick={() => setActiveSection(s.id)}
            >
              <span className="cs-nav-icon">{s.icon}</span>
              <span className="cs-nav-label">{s.title}</span>
            </button>
          ))}
        </div>

        <div className="cs-section-header">
          <span className="cs-section-icon">{current.icon}</span>
          <div>
            <h2 className="cs-section-title">{current.title}</h2>
            <p className="cs-section-desc">{current.desc}</p>
          </div>
        </div>

        {current.diagram && <Diagram type={current.diagram} />}

        <div className="cs-steps">
          {current.steps.map((step, i) => (
            <div key={i} className="cs-step">
              <div className="cs-step-top">
                <span className="cs-step-icon">{step.icon}</span>
                <span className="cs-step-title">{step.title}</span>
              </div>
              <p className="cs-step-text">{step.text}</p>
              {step.warning && <div className="cs-warning">⚠️ {step.warning}</div>}
              {step.tip && <div className="cs-tip">💡 {step.tip}</div>}
            </div>
          ))}
        </div>

        <div className="cs-related">
          <h3 className="cs-related-title">Читайте також</h3>
          <div className="cs-related-grid">
            <Link to="/verified-crosses" className="cs-related-link">🐇 Перевірені поєднання порід</Link>
            <Link to="/meat-crosses" className="cs-related-link">🍖 Помісі для м'яса</Link>
            <Link to="/first-cross-plan" className="cs-related-link">✅ Як спланувати перше схрещування</Link>
            <Link to="/conveyor" className="cs-related-link">🔄 Конвеєр окролів</Link>
          </div>
        </div>

        <div className="cs-back">
          <Link to="/" className="cs-back-btn">⬅ На головну</Link>
          <ShareButton title="Схеми поєднання порід" />
        </div>
      </div>
    </main>
  );
};

export default CrossbreedingSchemes;
