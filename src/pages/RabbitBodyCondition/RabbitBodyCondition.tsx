import { useState } from "react";
import "./RabbitBodyCondition.css";
import ShareButton from "../../components/ShareButton/ShareButton";
import { Link } from "react-router-dom";

interface BCSLevel {
  score: number;
  label: string;
  description: string;
  spine: string;
  ribs: string;
  hips: string;
  action: string;
  actionType: "ok" | "warning" | "danger";
  silhouette: "emaciated" | "thin" | "ideal" | "overweight" | "obese";
}

const bcsData: BCSLevel[] = [
  {
    score: 1,
    label: "Виснаженість",
    description:
      "Критично низька маса тіла. Кролик вимагає негайної медичної допомоги.",
    spine:
      "Різко виступає, кожен хребець виразно відчувається та видно візуально.",
    ribs: "Повністю видно без торкання. Немає жодного жирового покриву.",
    hips: "Кістки таза гостро виступають, м'яких тканин практично немає.",
    action: "Негайно до ветеринара. Стан загрожує життю.",
    actionType: "danger",
    silhouette: "emaciated",
  },
  {
    score: 2,
    label: "Недостатня вага",
    description:
      "Помітний дефіцит маси. Кролик потребує коригування раціону та ветеринарного контролю.",
    spine: "Чітко виступає, легко промацується без тиску.",
    ribs: "Легко видно, мінімальний жировий прошарок.",
    hips: "Виступають, але без гострих кутів.",
    action: "Консультація ветеринара. Збільшити калорійність раціону.",
    actionType: "warning",
    silhouette: "thin",
  },
  {
    score: 3,
    label: "Ідеальна вага",
    description:
      "Оптимальний стан тіла. Продовжуйте поточний раціон і рівень активності.",
    spine: "Відчувається при легкому тиску, не виступає візуально.",
    ribs: "Промацуються з легким тиском. Тонкий, але рівномірний жировий прошарок.",
    hips: "Округлі, кістки відчуваються лише при натисканні.",
    action: "Все гаразд. Підтримуйте поточний режим.",
    actionType: "ok",
    silhouette: "ideal",
  },
  {
    score: 4,
    label: "Надлишкова вага",
    description:
      "Помірний надлишок маси. Потрібне коригування раціону та збільшення активності.",
    spine: "Важко промацується через жировий прошарок.",
    ribs: "Промацуються лише зі значним тиском.",
    hips: "Кістки погано відчуваються, помітні жирові відкладення.",
    action:
      "Зменшити пелети, збільшити сіно та активність. Консультація ветеринара.",
    actionType: "warning",
    silhouette: "overweight",
  },
  {
    score: 5,
    label: "Ожиріння",
    description:
      "Критичний надлишок маси. Ожиріння у кроликів пов'язане з серйозними проблемами здоров'я.",
    spine: "Майже не промацується. Глибокий жировий шар.",
    ribs: "Не промацуються. Великі жирові відкладення.",
    hips: "Повністю приховані жировими тканинами.",
    action:
      "Негайна консультація ветеринара. Потрібна дієтична програма під наглядом.",
    actionType: "danger",
    silhouette: "obese",
  },
];

// SVG silhouette paths for each body condition
function RabbitSilhouette({ type }: { type: BCSLevel["silhouette"] }) {
  const configs = {
    emaciated: {
      bodyRx: 28,
      bodyRy: 14,
      color: "#C0392B",
      belly: "M52,50 Q80,44 108,50",
    },
    thin: {
      bodyRx: 32,
      bodyRy: 16,
      color: "#D4845A",
      belly: "M52,50 Q80,46 108,50",
    },
    ideal: {
      bodyRx: 36,
      bodyRy: 20,
      color: "#7A9E7E",
      belly: "M52,52 Q80,52 108,52",
    },
    overweight: {
      bodyRx: 42,
      bodyRy: 26,
      color: "#C4A55A",
      belly: "M52,56 Q80,60 108,56",
    },
    obese: {
      bodyRx: 48,
      bodyRy: 30,
      color: "#C0392B",
      belly: "M52,60 Q80,66 108,60",
    },
  };
  const c = configs[type];

  return (
    <svg
      viewBox="0 0 160 90"
      className="bcs-silhouette"
      aria-label={`Силует кролика: ${type}`}
    >
      {/* Body */}
      <ellipse
        cx="80"
        cy="52"
        rx={c.bodyRx}
        ry={c.bodyRy}
        fill={c.color}
        opacity="0.85"
      />
      {/* Head */}
      <ellipse cx="118" cy="42" rx="16" ry="13" fill={c.color} opacity="0.9" />
      {/* Ears */}
      <ellipse
        cx="112"
        cy="22"
        rx="4.5"
        ry="14"
        fill={c.color}
        opacity="0.8"
        transform="rotate(-8 112 22)"
      />
      <ellipse
        cx="124"
        cy="20"
        rx="4"
        ry="14"
        fill={c.color}
        opacity="0.8"
        transform="rotate(5 124 20)"
      />
      {/* Tail */}
      <circle cx="36" cy="50" r="7" fill={c.color} opacity="0.7" />
      {/* Legs */}
      <ellipse cx="62" cy="67" rx="10" ry="5" fill={c.color} opacity="0.75" />
      <ellipse cx="98" cy="67" rx="10" ry="5" fill={c.color} opacity="0.75" />
      {/* Eye */}
      <circle cx="124" cy="39" r="2.5" fill="white" />
      <circle cx="124.5" cy="39" r="1.2" fill="#2C2416" />
      {/* Belly line */}
      <path
        d={c.belly}
        stroke="white"
        strokeWidth="1.5"
        fill="none"
        opacity="0.3"
      />
    </svg>
  );
}

// Checkup card items
const checkupItems = [
  {
    icon: "🤚",
    title: "Хребет",
    howTo: "Проведіть великим пальцем вздовж хребта від шиї до хвоста.",
    ideal: "Відчувається при легкому тиску, але не виступає гострими кутами.",
  },
  {
    icon: "👐",
    title: "Ребра",
    howTo: "Покладіть обидві долоні на боки кролика і злегка натисніть.",
    ideal: "Промацуються з легким тиском, як олівці під тонкою тканиною.",
  },
  {
    icon: "🖐",
    title: "Кістки таза",
    howTo: "Обережно пропальпуйте задню частину тіла над хвостом.",
    ideal: "Відчуваються при натисканні, але не виступають.",
  },
  {
    icon: "👁",
    title: "Загальний вигляд",
    howTo: "Поглянь збоку та зверху.",
    ideal: "Рівномірно округлий силует без западань або надмірних опуклостей.",
  },
];

const healthImpact = [
  { issue: "ГКТ-стаз (застій кишечника)", obesity: true, underweight: true },
  { issue: "Пододерматит (виразки лап)", obesity: true, underweight: false },
  { issue: "Проблеми з хребтом", obesity: true, underweight: false },
  { issue: "Ослаблений імунітет", obesity: false, underweight: true },
  { issue: "Серцево-судинні захворювання", obesity: true, underweight: false },
  { issue: "Труднощі з грумінгом", obesity: true, underweight: false },
  { issue: "Репродуктивні проблеми", obesity: true, underweight: true },
  { issue: "Анестезіологічний ризик", obesity: true, underweight: false },
];

export default function RabbitBodyCondition() {
  const [activeScore, setActiveScore] = useState<number>(3);
  const active = bcsData.find((b) => b.score === activeScore)!;

  return (
    <div className="bcs-root">
      {/* Header */}
      <header className="bcs-header">
        <div className="bcs-header__inner">
          <div className="bcs-hero">
            <span className="bcs-hero__eyebrow">Здоров'я кролика</span>
            <h1 className="bcs-hero__title">Оцінка кондиції тіла (BCS)</h1>
            <p className="bcs-hero__sub">
              Body Condition Score — стандартний метод ветеринарної оцінки.
              Навчіться визначати стан самостійно — вдома, щотижня.
            </p>
          </div>
        </div>
        <div className="bcs-header__wave" aria-hidden="true">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
            <path
              d="M0,30 C360,0 1080,60 1440,30 L1440,60 L0,60 Z"
              fill="#FAF7F2"
            />
          </svg>
        </div>
      </header>

      {/* BCS Interactive Scale */}
      <section className="bcs-scale-section">
        <div className="bcs-container">
          <h2 className="bcs-section-title">Шкала BCS 1–5</h2>
          <p className="bcs-section-sub">
            Натисніть на бал, щоб побачити детальний опис
          </p>

          {/* Score selector */}
          <div className="bcs-selector">
            {bcsData.map((b) => (
              <button
                key={b.score}
                className={`bcs-score-btn ${activeScore === b.score ? "bcs-score-btn--active" : ""} bcs-score-btn--${b.actionType}`}
                onClick={() => setActiveScore(b.score)}
                aria-pressed={activeScore === b.score}
              >
                <span className="bcs-score-btn__num">{b.score}</span>
                <span className="bcs-score-btn__label">{b.label}</span>
              </button>
            ))}
          </div>

          {/* Detail card */}
          <div
            className={`bcs-detail bcs-detail--${active.actionType}`}
            key={active.score}
          >
            <div className="bcs-detail__left">
              <RabbitSilhouette type={active.silhouette} />
              <div className={`bcs-action bcs-action--${active.actionType}`}>
                <span className="bcs-action__icon">
                  {active.actionType === "ok"
                    ? "✅"
                    : active.actionType === "warning"
                      ? "⚠️"
                      : "🚨"}
                </span>
                <p className="bcs-action__text">{active.action}</p>
              </div>
            </div>

            <div className="bcs-detail__right">
              <div className="bcs-detail__header">
                <span className="bcs-detail__score">BCS {active.score}</span>
                <h3 className="bcs-detail__label">{active.label}</h3>
              </div>
              <p className="bcs-detail__desc">{active.description}</p>

              <div className="bcs-palpation">
                <h4 className="bcs-palpation__title">Пальпаційні ознаки</h4>
                <div className="bcs-palpation__grid">
                  <div className="bcs-palp-item">
                    <span className="bcs-palp-label">🦴 Хребет</span>
                    <p className="bcs-palp-text">{active.spine}</p>
                  </div>
                  <div className="bcs-palp-item">
                    <span className="bcs-palp-label">🦴 Ребра</span>
                    <p className="bcs-palp-text">{active.ribs}</p>
                  </div>
                  <div className="bcs-palp-item">
                    <span className="bcs-palp-label">🦴 Таз</span>
                    <p className="bcs-palp-text">{active.hips}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to check */}
      <section className="bcs-howto-section">
        <div className="bcs-container">
          <h2 className="bcs-section-title">Як провести перевірку</h2>
          <p className="bcs-section-sub">
            Перевіряйте раз на тиждень, у спокійному стані кролика
          </p>
          <div className="bcs-howto-grid">
            {checkupItems.map((item, i) => (
              <div key={i} className="bcs-howto-card">
                <span className="bcs-howto-icon">{item.icon}</span>
                <h3 className="bcs-howto-title">{item.title}</h3>
                <p className="bcs-howto-how">
                  <strong>Як:</strong> {item.howTo}
                </p>
                <p className="bcs-howto-ideal">
                  <strong>Норма:</strong> {item.ideal}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Health impact table */}
      <section className="bcs-impact-section">
        <div className="bcs-container">
          <h2 className="bcs-section-title">Ризики для здоров'я</h2>
          <p className="bcs-section-sub">Чому кондиція тіла критично важлива</p>
          <div className="bcs-table-wrap">
            <table className="bcs-table">
              <thead>
                <tr>
                  <th>Проблема зі здоров'ям</th>
                  <th>Ожиріння</th>
                  <th>Недостатня вага</th>
                </tr>
              </thead>
              <tbody>
                {healthImpact.map((row, i) => (
                  <tr key={i}>
                    <td>{row.issue}</td>
                    <td className="bcs-td-center">
                      {row.obesity ? (
                        <span className="bcs-risk-yes">✓ Ризик</span>
                      ) : (
                        <span className="bcs-risk-no">—</span>
                      )}
                    </td>
                    <td className="bcs-td-center">
                      {row.underweight ? (
                        <span className="bcs-risk-yes">✓ Ризик</span>
                      ) : (
                        <span className="bcs-risk-no">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Diet tips */}
      <section className="bcs-diet-section">
        <div className="bcs-container">
          <h2 className="bcs-section-title">Основи правильного харчування</h2>
          <div className="bcs-diet-grid">
            <div className="bcs-diet-card bcs-diet-card--primary">
              <div className="bcs-diet-card__icon">🌾</div>
              <h3 className="bcs-diet-card__title">Сіно — основа (80%+)</h3>
              <p className="bcs-diet-card__text">
                Необмежена кількість якісного лугового або тимофіївського сіна.
                Забезпечує клітковину, стирає зуби та підтримує перистальтику
                кишечника.
              </p>
            </div>
            <div className="bcs-diet-card">
              <div className="bcs-diet-card__icon">🥬</div>
              <h3 className="bcs-diet-card__title">Свіжа зелень (15%)</h3>
              <p className="bcs-diet-card__text">
                Листова зелень: петрушка, кінза, базилік, салат романо. Уникати
                капусти, шпинату у великій кількості. Мінімум 3 різних види на
                день.
              </p>
            </div>
            <div className="bcs-diet-card">
              <div className="bcs-diet-card__icon">🫘</div>
              <h3 className="bcs-diet-card__title">Пелети (5% або менше)</h3>
              <p className="bcs-diet-card__text">
                Максимум 1–2 ч. л. на 1 кг ваги на день. Тільки пелети без
                сухофруктів, горіхів і зернових добавок. Для дорослих кроликів —
                необов'язково.
              </p>
            </div>
            <div className="bcs-diet-card bcs-diet-card--warning">
              <div className="bcs-diet-card__icon">🚫</div>
              <h3 className="bcs-diet-card__title">Уникати</h3>
              <p className="bcs-diet-card__text">
                Цукор, фрукти (тільки зрідка як ласощі), зернові, хліб, молочне,
                авокадо, цибуля, часник, картопля, м'ясо. Ці продукти небезпечні
                для кроликів.
              </p>
            </div>
          </div>
        </div>

        <section className="bcs-related-section">
          <div className="bcs-container">
            <h3 className="bcs-related-title">Читайте також</h3>
            <div className="bcs-related-grid">
              <Link to="/weight-control" className="bcs-related-link">
                ⚖️ Контроль ваги
              </Link>
              <Link to="/doe-preparation" className="bcs-related-link">
                ♀️ Підготовка самки до злучки
              </Link>
              <Link to="/feeding" className="bcs-related-link">
                🥕 Годування
              </Link>
              <Link to="/diseases" className="bcs-related-link">
                🩺 Хвороби
              </Link>
              <Link to="/culling" className="bcs-related-link">
                🗑️ Вибраковка
              </Link>
            </div>
          </div>
        </section>

        <div className="bcs-back">
          <Link to="/" className="bcs-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Назва цієї сторінки" />
        </div>
      </section>

      <footer className="bcs-footer">
        <div className="bcs-container">
          <p>
            Методологія BCS базується на стандартах RWAF (Rabbit Welfare
            Association & Fund) та BSAVA. Ця сторінка не замінює консультацію
            ветеринара.
          </p>
        </div>
      </footer>
    </div>
  );
}
