import { Link } from "react-router-dom";
import "./SeasonalSpring.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const whySpring = [
  {
    icon: "❄️",
    title: "Ооцисти виживають зиму",
    desc: "Ооцисти Eimeria стійкі до холоду і можуть зберігатися в середовищі понад рік. За зиму в підстилці та ґрунті накопичується значна кількість інфекційного матеріалу.",
  },
  {
    icon: "🌡️",
    title: "Потепління запускає спорозоїти",
    desc: "При температурі вище +10°C ооцисти завершують спороляцію і стають заразними. Весняне потепління — старт активного передавання.",
  },
  {
    icon: "🐣",
    title: "Молодняк найвразливіший",
    desc: "Весняні окроли дають молодняк у критичному вікні: 4–10 тижнів після відлучення — пік сприйнятливості до кокцидіозу. Материнський імунітет вже слабшає.",
  },
  {
    icon: "🌿",
    title: "Свіжа зелень — носій",
    desc: "Перша весняна трава та зелень з городу можуть бути забруднені ооцистами від диких кролів або через нефільтровану воду. Різка зміна раціону — додатковий стрес.",
  },
];

const atRisk = [
  "Молодняк 4–12 тижнів (особливо навколо відлучення)",
  "Кролики після стресу — транспортування, зміна корму, зміна клітки",
  "Тварини в господарствах з підлоговим або ямовим утриманням",
  "Нещеплений і не оброблений від паразитів молодняк",
  "Кролики з великих послідів — нижча стартова маса, слабший імунітет",
];

const prevention = [
  {
    title: "Профілактична пропойка молодняку",
    text: "Солікокс або Байкокс для молодняку починаючи з 3–4-тижневого віку при відлученні або одразу після. Дозування — за інструкцією та вагою. Повторний курс через 2–3 тижні.",
    tag: "Ключовий захід",
    tagColor: "green",
  },
  {
    title: "Посилене прибирання після зими",
    text: "Ооцисти стійкі до звичайних дезінфектантів. Ефективні: промивання окропом, паяльна лампа по клітках, вапнування ґрунту. Сухість підстилки критична.",
    tag: "Обов'язково",
    tagColor: "green",
  },
  {
    title: "Контроль якості зелені",
    text: "Нову траву і зелень вводь поступово — не більше 10% раціону на початку. Не давай зелень з ділянок де бігали дикі кролі або птиця.",
    tag: "Харчування",
    tagColor: "amber",
  },
  {
    title: "Аналіз калу при симптомах",
    text: "При проносі, схудненні або відставанні в рості — аналіз калу на флотацію. Не лікуй наосліп: клінічна картина кокцидіозу схожа на ентерит.",
    tag: "Діагностика",
    tagColor: "blue",
  },
];

const symptoms = [
  { mild: true, text: "Пригнічення, знижений апетит" },
  { mild: true, text: "Незначне відставання в рості" },
  { mild: false, text: "Пронос — рідкий, іноді з кров'ю або слизом" },
  { mild: false, text: "Різке схуднення, тьмяна шерсть" },
  {
    mild: false,
    text: "Збільшений живіт (гепатомегалія при печінковій формі)",
  },
  { mild: false, text: "Загибель молодняку без попередніх симптомів" },
];

const SeasonalSpring = () => {
  return (
    <main className="sp-page">
      <div className="sp-hero">
        <span>🌱</span>
        <h1>Весна: сплеск кокцидіозу</h1>
        <p>
          Ооцисти, що накопичились за зиму, активуються при перших плюсових
          температурах
        </p>
      </div>

      <section className="sp-section">
        <h2>Чому навесні — пік</h2>
        <div className="sp-why-grid">
          {whySpring.map((w) => (
            <div key={w.title} className="sp-why-card">
              <span className="sp-why-icon">{w.icon}</span>
              <strong>{w.title}</strong>
              <p>{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="sp-section">
        <h2>Симптоми</h2>
        <p className="sp-lead">
          Дорослі кролі часто носії без симптомів. Клінічне захворювання —
          переважно молодняк.
        </p>
        <div className="sp-symptoms">
          {symptoms.map((s, i) => (
            <div
              key={i}
              className={`sp-symptom sp-symptom--${s.mild ? "mild" : "severe"}`}
            >
              <span>{s.mild ? "⬆️" : "🔴"}</span>
              <span>{s.text}</span>
              {!s.mild && <span className="sp-sev-badge">Тяжко</span>}
            </div>
          ))}
        </div>
        <p className="sp-merck-note">
          Джерело: Merck Veterinary Manual. Обидві форми — кишкова та печінкова
          (E. stiedae) — передаються через заражений корм або воду з ооцистами.
        </p>
      </section>

      <section className="sp-section">
        <h2>Хто в зоні ризику</h2>
        <div className="sp-at-risk">
          {atRisk.map((r, i) => (
            <div key={i} className="sp-risk-row">
              <span className="sp-risk-dot" />
              <span>{r}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="sp-section">
        <h2>Профілактика навесні</h2>
        <div className="sp-prevention">
          {prevention.map((p) => (
            <div key={p.title} className="sp-prev-card">
              <div className="sp-prev-header">
                <strong>{p.title}</strong>
                <span className={`sp-tag sp-tag--${p.tagColor}`}>{p.tag}</span>
              </div>
              <p>{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="sp-related">
        <h3 className="sp-related-title">Читайте також</h3>
        <div className="sp-related-grid">
          <Link to="/parasites" className="sp-related-link">
            🦟 Паразити
          </Link>
          <Link to="/water-medication" className="sp-related-link">
            💧 Пропойка
          </Link>
          <Link to="/disinfection" className="sp-related-link">
            🧴 Дезінфекція
          </Link>
          <Link to="/weaning" className="sp-related-link">
            🥣 Відлучення та дорощування
          </Link>
          <Link to="/calendar" className="sp-related-link">
            📅 Сезонний календар
          </Link>
        </div>
      </div>

      <div className="sp-back">
        <Link to="/" className="sp-back-link">
          ← Головна
        </Link>
        <ShareButton title="Назва цієї сторінки" />
      </div>
    </main>
  );
};

export default SeasonalSpring;
