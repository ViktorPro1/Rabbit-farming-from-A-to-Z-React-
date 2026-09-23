import { useState } from "react";
import { Link } from "react-router-dom";
import "./IncompatibleCrosses.css";
import ShareButton from "../../components/ShareButton/ShareButton";

type SectionId = "size" | "genetics" | "temperament" | "health" | "checklist";
type Risk = "high" | "medium";

interface IcStep {
  icon: string;
  title: string;
  text: string;
  risk?: Risk;
  warning?: string;
  alt?: string;
}

interface IcSection {
  id: SectionId;
  icon: string;
  title: string;
  desc: string;
  steps: IcStep[];
}

const sections: IcSection[] = [
  {
    id: "size",
    icon: "⚖️",
    title: "Різниця у розмірі",
    desc: "Найчастіша причина ускладнень при паруванні",
    steps: [
      {
        icon: "🚫",
        title: "Великий самець × дуже дрібна самка",
        text: "Якщо самець значно перевищує самку за розміром, плід може виявитись завеликим для родових шляхів самки. Це підвищує ризик дистоції — важких пологів, які без втручання можуть закінчитись загибеллю самки чи приплоду.",
        risk: "high",
        warning: "Особливо небезпечно для першовагітних самок і для пар «велетень × карликова декоративна порода».",
        alt: "Якщо потрібне схрещування різних вагових категорій — обирайте самцем меншу породу, а самку більшу: це природно безпечніше за розміром тазу.",
      },
      {
        icon: "🚫",
        title: "Два «протилежні полюси» ваги",
        text: "Поєднання породи вагою 1,5 кг з породою вагою 6–8 кг непередбачуване навіть у першому поколінні: розмір приплоду може варіюватись у межах одного посліду, ускладнюючи як пологи, так і подальший догляд.",
        risk: "high",
      },
    ],
  },
  {
    id: "genetics",
    icon: "🧬",
    title: "Небезпечні генетичні поєднання",
    desc: "Коли схрещування шкодить на рівні генів",
    steps: [
      {
        icon: "☠️",
        title: "Два «справжні карлики» (true dwarf × true dwarf)",
        text: "Карликовість визначається одним геном, який у здорової карликової тварини завжди представлений в одинарній дозі. Якщо парувати двох карликових носіїв цього гена між собою, частина приплоду отримує подвійну дозу — такі кроленята зазвичай нежиттєздатні.",
        risk: "high",
        warning: "Ознака подвійної дози — дуже дрібні, слабкі кроленята («піненати»), що гинуть у перші дні життя.",
        alt: "Карликову особину завжди парують із твариною — носієм звичайного розміру, а не з іншим карликом.",
      },
      {
        icon: "🎨",
        title: "Поєднання з геном плямистості (Charlie/English) у гомозиготній формі",
        text: "У деяких плямистих порід (типу англійська плямиста, шашковий велетень) ген плямистості в подвійній дозі пов'язаний із підвищеним ризиком порушень роботи кишечника (мегаколон) і зниженою життєздатністю приплоду.",
        risk: "medium",
        alt: "Плямисту особину краще парувати з непямистою чи суцільнозабарвленою твариною цієї ж лінії — так подвійна доза гена не виникає.",
      },
      {
        icon: "🧬",
        title: "Спадкові дефекти прикусу й дихання",
        text: "Деякі декоративні лінії з укороченою мордою частіше передають неправильний прикус і проблеми з диханням. Схрещування двох носіїв таких ознак підвищує ймовірність прояву дефекту в потомстві.",
        risk: "medium",
      },
    ],
  },
  {
    id: "temperament",
    icon: "😾",
    title: "Несумісність характеру",
    desc: "Не лише фізичний ризик, а й поведінкові наслідки",
    steps: [
      {
        icon: "⚡",
        title: "Агресивна лінія × сором'язлива лінія",
        text: "Характер частково успадковується. Поєднання породи з репутацією нервової чи територіальної з дуже боязкою породою іноді дає непередбачувану поведінку в потомства — від надмірної тривожності до раптової агресії.",
        risk: "medium",
      },
      {
        icon: "🏠",
        title: "Продуктивна порода × декоративна «для дому»",
        text: "Якщо мета — домашній улюбленець, а не товарна тварина, поєднання з активною, великою продуктивною породою може дати нащадка, що погано підходить для квартирного утримання: занадто активний, великий чи вимогливий до простору.",
        risk: "medium",
      },
    ],
  },
  {
    id: "health",
    icon: "🩺",
    title: "Розведення без перевірки здоров'я",
    desc: "Ризик, який не залежить від конкретної пари порід",
    steps: [
      {
        icon: "🚫",
        title: "Батьки без ветеринарного огляду",
        text: "Схрещування тварин, чиє здоров'я не перевірене (приховані інфекції, паразити, спадкові захворювання), — ризик незалежно від того, наскільки вдалою є сама комбінація порід.",
        risk: "high",
        warning: "Приховані інфекційні захворювання можуть передатись не лише генетично, а й безпосередньо під час парування чи вигодовування.",
      },
      {
        icon: "📋",
        title: "Невідомий родовід хоча б одного з батьків",
        text: "Без родоводу неможливо виключити близьку спорідненість (наприклад, ненавмисне парування напівсибсів), що підвищує ризик інбридингу навіть у, здавалося б, «різних» тварин.",
        risk: "medium",
      },
    ],
  },
  {
    id: "checklist",
    icon: "✅",
    title: "Чек-лист перед схрещуванням",
    desc: "Що перевірити заздалегідь",
    steps: [
      {
        icon: "1️⃣",
        title: "Порівняйте розмір батьків",
        text: "Переконайтесь, що різниця у вазі між самцем і самкою не критична — особливо якщо самка менша.",
      },
      {
        icon: "2️⃣",
        title: "Дізнайтесь про носійство карликового чи плямистого гена",
        text: "Якщо хоча б одна з порід карликова чи плямиста — уточніть, чи не є другий партнер також носієм того самого гена.",
      },
      {
        icon: "3️⃣",
        title: "Перевірте здоров'я обох тварин",
        text: "Огляд у ветеринара перед паруванням знижує ризик передачі прихованих інфекцій чи паразитів.",
      },
      {
        icon: "4️⃣",
        title: "Визначте мету схрещування",
        text: "Чітко сформулюйте, що хочете отримати (м'ясо, хутро, компаньйона) — це одразу відсіє явно невдалі поєднання.",
      },
    ],
  },
];

const riskLabel: Record<Risk, string> = {
  high: "Високий ризик",
  medium: "Помірний ризик",
};

const IncompatibleCrosses = () => {
  const [activeSection, setActiveSection] = useState<SectionId>("size");
  const current = sections.find((s) => s.id === activeSection)!;

  return (
    <main className="ic-page">
      <div className="ic-header">
        <h1>🚫 Несумісні поєднання</h1>
        <p>Які схрещування краще не робити — і чому</p>
      </div>

      <div className="ic-wrap">
        <div className="ic-notice">
          🚨 Це не заборона схрещування взагалі — а список ситуацій, де ризик
          для самки чи потомства суттєво зростає.
        </div>

        <div className="ic-nav">
          {sections.map((s) => (
            <button
              key={s.id}
              className={`ic-nav-btn${activeSection === s.id ? " active" : ""}`}
              onClick={() => setActiveSection(s.id)}
            >
              <span className="ic-nav-icon">{s.icon}</span>
              <span className="ic-nav-label">{s.title}</span>
            </button>
          ))}
        </div>

        <div className="ic-section-header">
          <span className="ic-section-icon">{current.icon}</span>
          <div>
            <h2 className="ic-section-title">{current.title}</h2>
            <p className="ic-section-desc">{current.desc}</p>
          </div>
        </div>

        <div className="ic-steps">
          {current.steps.map((step, i) => (
            <div key={i} className={`ic-step${step.risk ? ` risk-${step.risk}` : ""}`}>
              <div className="ic-step-top">
                <span className="ic-step-icon">{step.icon}</span>
                <span className="ic-step-title">{step.title}</span>
                {step.risk && (
                  <span className={`ic-risk-badge risk-${step.risk}`}>
                    {riskLabel[step.risk]}
                  </span>
                )}
              </div>
              <p className="ic-step-text">{step.text}</p>
              {step.warning && <div className="ic-warning">⚠️ {step.warning}</div>}
              {step.alt && <div className="ic-alt">✅ Безпечніша альтернатива: {step.alt}</div>}
            </div>
          ))}
        </div>

        <div className="ic-related">
          <h3 className="ic-related-title">Читайте також</h3>
          <div className="ic-related-grid">
            <Link to="/verified-crosses" className="ic-related-link">🐇 Перевірені поєднання порід</Link>
            <Link to="/half-siblings" className="ic-related-link">🧬 Напівсибси</Link>
            <Link to="/dystocia" className="ic-related-link">🚨 Дистоція</Link>
            <Link to="/lethal-color-genes" className="ic-related-link">⚠️ Небезпечні поєднання генів</Link>
          </div>
        </div>

        <div className="ic-back">
          <Link to="/" className="ic-back-btn">⬅ На головну</Link>
          <ShareButton title="Несумісні поєднання" />
        </div>
      </div>
    </main>
  );
};

export default IncompatibleCrosses;
