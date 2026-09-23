import { useState } from "react";
import { Link } from "react-router-dom";
import "./BreedSigns.css";
import ShareButton from "../../components/ShareButton/ShareButton";

type SectionId = "ears" | "coat" | "build" | "color" | "method";

interface BsTrait {
  icon: string;
  title: string;
  observe: string;
  suggests: string;
  tip?: string;
}

interface BsSection {
  id: SectionId;
  icon: string;
  title: string;
  desc: string;
  traits: BsTrait[];
}

const sections: BsSection[] = [
  {
    id: "ears",
    icon: "👂",
    title: "Вуха",
    desc: "Перше, на що варто дивитись",
    traits: [
      {
        icon: "⬆️",
        title: "Прямостоячі вуха",
        observe: "Вуха стоять вертикально, рухомі, повертаються на звук.",
        suggests: "Більшість продуктивних і диких за типом порід (каліфорнійська, новозеландська, велетні, шиншила) мають саме таку форму вух.",
      },
      {
        icon: "🐑",
        title: "Вислі («баранячі») вуха",
        observe: "Вуха звисають по боках голови, майже не рухаються самостійно.",
        suggests: "Практично завжди вказує на наявність вислоухої породи («баран», ангорський лев) у родоводі — ця ознака домінує і легко передається в помісі.",
        tip: "Довжину і товщину вуха теж варто оцінити — грубіші, довші вуха частіше від великих вислоухих порід, компактніші — від карликових ліній.",
      },
      {
        icon: "↗️",
        title: "Напіввисячі вуха",
        observe: "Одне або обидва вуха стоять під кутом, не повністю прямо і не повністю звисають.",
        suggests: "Типова ознака першого покоління від схрещування прямовухої і вислоухої породи — форма вуха ще не «визначилась» остаточно.",
      },
    ],
  },
  {
    id: "coat",
    icon: "🧥",
    title: "Тип хутра",
    desc: "Густота, довжина і структура",
    traits: [
      {
        icon: "✨",
        title: "Коротке, гладке хутро",
        observe: "Хутро щільно прилягає до тіла, майже не піднімається, на дотик прохолодне.",
        suggests: "Типово для більшості м'ясних порід (каліфорнійська, новозеландська) — орієнтованих на швидкий ріст, а не на якість хутра.",
      },
      {
        icon: "☁️",
        title: "Густе, пухнасте хутро з підшерстям",
        observe: "Розсуньте волосся руками — під верхнім шаром видно щільний, м'який підшерсток.",
        suggests: "Ознака порід шиншилового чи велетневого типу — часто підказує морозостійке походження.",
      },
      {
        icon: "🌊",
        title: "Довге, шовковисте хутро",
        observe: "Волосся довше за 5–7 см, вимагає вичісування, може закручуватись у ковтуни.",
        suggests: "Практично напевно вказує на ангорську лінію в родоводі.",
      },
    ],
  },
  {
    id: "build",
    icon: "🦴",
    title: "Статура і вага",
    desc: "Розмір тіла та темп росту",
    traits: [
      {
        icon: "📦",
        title: "Компактне, кремезне тіло",
        observe: "Коротке тіло, невеликі вуха, округлі форми.",
        suggests: "Краще утримує тепло — часто зустрічається в морозостійких і карликових порід.",
      },
      {
        icon: "📏",
        title: "Витягнуте, м'язисте тіло",
        observe: "Довше тіло, розвинена задня частина, помітна мускулатура стегон.",
        suggests: "Типово для м'ясних скоростиглих порід (каліфорнійська, новозеландська).",
      },
      {
        icon: "🐘",
        title: "Великий кістяк, масивні лапи",
        observe: "Товсті кістки лап, велика голова, вага дорослої особини від 6 кг.",
        suggests: "Ознака порід-велетнів (фландр, білий/сірий велетень) у родоводі.",
      },
    ],
  },
  {
    id: "color",
    icon: "🎨",
    title: "Забарвлення",
    desc: "Малюнок і відтінок хутра",
    traits: [
      {
        icon: "🐆",
        title: "Темні позначки на носі, вухах, лапах",
        observe: "Основний колір світлий, а морда, вуха, лапи і хвіст темніші («поінти»).",
        suggests: "Класична ознака каліфорнійської породи чи її помісей.",
      },
      {
        icon: "🩶",
        title: "Сталево-блакитний відтінок із сивиною",
        observe: "Хутро виглядає «посрібленим», особливо помітно на спині при денному світлі.",
        suggests: "Типова ознака шиншилової групи порід.",
      },
      {
        icon: "⚪",
        title: "Суцільний білий колір, червоні чи блакитні очі",
        observe: "Однорідний білий колір по всьому тілу.",
        suggests: "Може вказувати на новозеландську білу чи білого велетня — уточнюйте за статурою, які саме, бо забарвлення однакове в обох.",
      },
    ],
  },
  {
    id: "method",
    icon: "🔍",
    title: "Як визначати правильно",
    desc: "Загальний підхід, а не одна ознака",
    traits: [
      {
        icon: "🧩",
        title: "Дивіться на комбінацію ознак",
        observe: "Жодна окрема риса (тільки вуха чи тільки колір) не дає повної картини.",
        suggests: "Поєднуйте форму вух + тип хутра + статуру — так точність визначення суттєво зростає.",
      },
      {
        icon: "👨‍👩‍👧",
        title: "Порівнюйте з батьками, якщо можливо",
        observe: "Якщо продавець чи заводчик може показати хоча б одного з батьків — це найточніший орієнтир.",
        suggests: "Зовнішній вигляд одного з батьків надійніший за будь-яке візуальне «вгадування» по самому кроленяті.",
      },
      {
        icon: "📅",
        title: "Враховуйте вік тварини",
        observe: "Забарвлення й форма вух у кроленят можуть змінюватись у перші місяці життя.",
        suggests: "Остаточні породні ознаки найкраще оцінювати після 3–4 місяців, коли тварина вже сформувалась.",
      },
    ],
  },
];

const BreedSigns = () => {
  const [activeSection, setActiveSection] = useState<SectionId>("ears");
  const current = sections.find((s) => s.id === activeSection)!;

  return (
    <main className="bs-page">
      <div className="bs-header">
        <h1>🔍 Визначення породи за зовнішніми ознаками</h1>
        <p>Польовий визначник для помісних кролів</p>
      </div>

      <div className="bs-wrap">
        <div className="bs-notice">
          🧭 Жодна окрема ознака не дає стовідсоткової відповіді — дивіться на
          поєднання кількох рис одночасно.
        </div>

        <div className="bs-nav">
          {sections.map((s) => (
            <button
              key={s.id}
              className={`bs-nav-btn${activeSection === s.id ? " active" : ""}`}
              onClick={() => setActiveSection(s.id)}
            >
              <span className="bs-nav-icon">{s.icon}</span>
              <span className="bs-nav-label">{s.title}</span>
            </button>
          ))}
        </div>

        <div className="bs-section-header">
          <span className="bs-section-icon">{current.icon}</span>
          <div>
            <h2 className="bs-section-title">{current.title}</h2>
            <p className="bs-section-desc">{current.desc}</p>
          </div>
        </div>

        <div className="bs-traits">
          {current.traits.map((trait, i) => (
            <div key={i} className="bs-trait-card">
              <div className="bs-trait-icon">{trait.icon}</div>
              <div className="bs-trait-body">
                <h3 className="bs-trait-title">{trait.title}</h3>
                <div className="bs-trait-row">
                  <span className="bs-trait-label">Спостерігаєте</span>
                  <p className="bs-trait-text">{trait.observe}</p>
                </div>
                <div className="bs-trait-row suggests">
                  <span className="bs-trait-label">Підказує</span>
                  <p className="bs-trait-text">{trait.suggests}</p>
                </div>
                {trait.tip && <div className="bs-tip">💡 {trait.tip}</div>}
              </div>
            </div>
          ))}
        </div>

        <div className="bs-related">
          <h3 className="bs-related-title">Читайте також</h3>
          <div className="bs-related-grid">
            <Link to="/verified-crosses" className="bs-related-link">🐇 Перевірені поєднання порід</Link>
            <Link to="/breeds" className="bs-related-link">📖 Породи</Link>
            <Link to="/genetics" className="bs-related-link">🎨 Генетика забарвлення</Link>
            <Link to="/buying-rabbit" className="bs-related-link">🐇 Купівля кроля</Link>
          </div>
        </div>

        <div className="bs-back">
          <Link to="/" className="bs-back-btn">⬅ На головну</Link>
          <ShareButton title="Визначення породи за зовнішніми ознаками" />
        </div>
      </div>
    </main>
  );
};

export default BreedSigns;
