import "./SpecialFeeds.css";
import { Link } from "react-router-dom";

interface FeedItem {
  id: string;
  name: string;
  icon: string;
  subtitle: string;
  benefits: string[];
  norms: { label: string; value: string }[];
  warnings: string[];
  tips: string[];
  parts: { part: string; allowed: boolean; note: string }[];
}

const feeds: FeedItem[] = [
  {
    id: "topinambur",
    name: "Топінамбур",
    icon: "🌻",
    subtitle: "Земляна груша — природний пребіотик",
    benefits: [
      "Містить інулін — покращує мікрофлору кишківника та знижує ризик розладів травлення",
      "Багатий на вітаміни групи B, C, D та біотин",
      "Містить залізо, калій (400–800 мг/100 г), кальцій, фосфор",
      "Нормалізує рівень цукру в крові",
      "Зелена маса багатша на вітаміни, ніж бульби",
      "Рослина морозостійка — кролики можуть пастися до пізньої осені",
    ],
    norms: [
      { label: "Бульби — дорослі", value: "100–200 г/добу" },
      { label: "Зелена маса — дорослі", value: "200–400 г/добу" },
      { label: "Молодняк (від 2 міс.)", value: "50–100 г/добу, поступово" },
      { label: "Частота", value: "4–5 разів на тиждень" },
    ],
    warnings: [
      "Вводити в раціон поступово — різке збільшення порції може спричинити здуття (інулін ферментується в товстому кишківнику)",
      "Крольчатам до 2 місяців бульби давати лише у відвареному вигляді",
      "Не годувати зіпсованими або заплісневілими бульбами",
      "Мити бульби перед подачею; землю змивати ретельно",
    ],
    tips: [
      "Бульби можна залишати в землі взимку — навесні відкопати і згодувати",
      "Зелену масу можна заготовляти на силос для зимової годівлі",
      "Рослина витримує мороз до −5 °C, тому придатна для пасовищного використання восени",
      "Змішувати з комбікормом або давати окремо як соковитий корм",
    ],
    parts: [
      {
        part: "Бульби (сирі)",
        allowed: true,
        note: "Дорослим — основний спосіб подачі",
      },
      {
        part: "Бульби (варені)",
        allowed: true,
        note: "Крольчатам до 2 міс. та при введенні в раціон",
      },
      {
        part: "Зелена маса (листя, стебла)",
        allowed: true,
        note: "Охоче їдять, багата вітамінами",
      },
      { part: "Квіти", allowed: true, note: "Можна, у невеликій кількості" },
      {
        part: "Зіпсовані бульби",
        allowed: false,
        note: "Заборонено — ризик отруєння",
      },
    ],
  },
  {
    id: "buryak-kormovyi",
    name: "Кормовий буряк",
    icon: "🟠",
    subtitle: "Соковитий енергетичний корм",
    benefits: [
      "Спеціально виведений для годівлі тварин — містить менше цукрів, ніж столовий",
      "Містить вітаміни A, B, C; кальцій, фосфор, магній",
      "Сприяє виробленню енергії при обміні речовин",
      "Підвищує лактацію у годуючих кролиць",
      "Коренеплоди виростають великими (до 5–6 кг) і добре зберігаються взимку",
      "Популярні сорти: Екендорфська жовта, Бомбардир",
    ],
    norms: [
      { label: "Дорослі особини", value: "200–300 г/добу" },
      { label: "Лактуючі кролиці", value: "до 600 г/добу (4–5 порцій)" },
      { label: "Молодняк 2 міс.", value: "50–100 г/добу" },
      { label: "Молодняк 3–4 міс.", value: "100–150 г/добу" },
      { label: "Частота", value: "щоденно або через день" },
    ],
    warnings: [
      "Вводити в раціон поступово — починати з 30–50 г, спостерігати за калом і самопочуттям",
      "Надмір може спричинити пронос та здуття",
      "Не давати зіпсований або заплісневілий коренеплід",
      "Свіжозібраний буряк просушити на повітрі під навісом перед зберіганням",
    ],
    tips: [
      "Можна давати сирим, нарізаним на шматки, або тертим",
      "Добре зберігається в льосі всю зиму — зручний зимовий корм",
      "Можна змішувати з морквою, гарбузом та іншими коренеплодами",
      "Бадилля кормового буряка також можна давати — до половини норми зелені",
    ],
    parts: [
      {
        part: "Коренеплід (сирий)",
        allowed: true,
        note: "Основний і найкращий спосіб подачі",
      },
      {
        part: "Бадилля",
        allowed: true,
        note: "До 50% від добової норми зелені",
      },
      {
        part: "Варений коренеплід",
        allowed: true,
        note: "Менш поживний, але допустимий",
      },
      { part: "Зіпсований коренеплід", allowed: false, note: "Заборонено" },
    ],
  },
  {
    id: "buryak-stolovyi",
    name: "Столовий буряк",
    icon: "🔴",
    subtitle: "Обережно — лише в малих дозах",
    benefits: [
      "Містить фолієву кислоту, вітаміни B та C, залізо, марганець, бор",
      "Має проносну дію — може використовуватись при закрепах",
      "Антиоксиданти підтримують імунну систему",
    ],
    norms: [
      { label: "Разова доза (знайомство)", value: "20–30 г" },
      { label: "Максимальна добова", value: "50–80 г (рідко)" },
      { label: "Частота", value: "не частіше 1–2 разів на тиждень" },
      { label: "Рекомендація", value: "Краще замінити кормовим буряком" },
    ],
    warnings: [
      "⚠️ ВАЖЛИВО: Столовий буряк містить багато щавлевої кислоти — перешкоджає засвоєнню кальцію та може спричинити сечокам'яну хворобу при регулярному вживанні",
      "Має виражену проносну дію — великі дози небезпечні, особливо для молодняку",
      "Не давати вагітним та годуючим кролицям без попередньої звички",
      "Червоний пігмент (бетаїн) може забарвити сечу та кал — не лякатись, це норма",
      "При схильності до м'якого калу — виключити повністю",
    ],
    tips: [
      "Якщо кролик звик до кормового буряка — столовий вводити ще обережніше",
      "Використовувати лише як випадкове доповнення, не як регулярний корм",
      "Бадилля столового буряка також містить щавлеву кислоту — давати помірно",
      "Краща альтернатива — кормовий або цукровий буряк",
    ],
    parts: [
      {
        part: "Коренеплід (малі дози)",
        allowed: true,
        note: "Рідко, 50–80 г макс.",
      },
      { part: "Бадилля", allowed: true, note: "Помірно, з обережністю" },
      {
        part: "Великі дози регулярно",
        allowed: false,
        note: "Небезпечно — щавлева кислота",
      },
      { part: "Молодняку до 3 міс.", allowed: false, note: "Не рекомендовано" },
    ],
  },
];

export default function SpecialFeeds() {
  return (
    <div className="sf-page">
      <div className="sf-hero">
        <div className="sf-hero__bg" />
        <div className="sf-hero__content">
          <span className="sf-hero__tag">Соковиті корми</span>
          <h1 className="sf-hero__title">
            Топінамбур та буряк у раціоні кроликів
          </h1>
          <p className="sf-hero__desc">
            Перевірена інформація про користь, норми та правила введення в
            раціон. Столовий буряк та топінамбур мають суттєві відмінності —
            важливо знати деталі.
          </p>
        </div>
      </div>

      <div className="sf-notice">
        <span className="sf-notice__icon">🩺</span>
        <p>
          Перед введенням нових кормів спостерігайте за тваринами 2–3 дні. При
          появі рідкого калу, здуття живота або відмови від їжі — припиніть
          годівлю та зверніться до ветеринара.
        </p>
      </div>

      <div className="sf-cards">
        {feeds.map((feed) => (
          <article key={feed.id} className={`sf-card sf-card--${feed.id}`}>
            <div className="sf-card__header">
              <span className="sf-card__icon">{feed.icon}</span>
              <div>
                <h2 className="sf-card__title">{feed.name}</h2>
                <p className="sf-card__subtitle">{feed.subtitle}</p>
              </div>
            </div>

            <div className="sf-card__body">
              {/* Що їдять */}
              <section className="sf-section">
                <h3 className="sf-section__title">Частини рослини</h3>
                <ul className="sf-parts">
                  {feed.parts.map((p, i) => (
                    <li
                      key={i}
                      className={`sf-parts__item sf-parts__item--${p.allowed ? "yes" : "no"}`}
                    >
                      <span className="sf-parts__marker">
                        {p.allowed ? "✓" : "✗"}
                      </span>
                      <span className="sf-parts__name">{p.part}</span>
                      <span className="sf-parts__note">{p.note}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Користь */}
              <section className="sf-section">
                <h3 className="sf-section__title">Користь</h3>
                <ul className="sf-benefits">
                  {feed.benefits.map((b, i) => (
                    <li key={i} className="sf-benefits__item">
                      {b}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Норми */}
              <section className="sf-section">
                <h3 className="sf-section__title">Норми годівлі</h3>
                <div className="sf-norms">
                  {feed.norms.map((n, i) => (
                    <div key={i} className="sf-norms__row">
                      <span className="sf-norms__label">{n.label}</span>
                      <span className="sf-norms__value">{n.value}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Застереження */}
              <section className="sf-section">
                <h3 className="sf-section__title sf-section__title--warn">
                  Застереження
                </h3>
                <ul className="sf-warnings">
                  {feed.warnings.map((w, i) => (
                    <li key={i} className="sf-warnings__item">
                      {w}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Поради */}
              <section className="sf-section">
                <h3 className="sf-section__title">Практичні поради</h3>
                <ul className="sf-tips">
                  {feed.tips.map((t, i) => (
                    <li key={i} className="sf-tips__item">
                      {t}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </article>
        ))}
      </div>

      <div className="sf-compare">
        <h2 className="sf-compare__title">Порівняння: який буряк обрати?</h2>
        <div className="sf-compare__table-wrap">
          <table className="sf-compare__table">
            <thead>
              <tr>
                <th>Критерій</th>
                <th>Кормовий буряк</th>
                <th>Столовий буряк</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Вміст цукрів</td>
                <td className="sf-compare__good">Помірний</td>
                <td className="sf-compare__mid">Вищий</td>
              </tr>
              <tr>
                <td>Щавелева кислота</td>
                <td className="sf-compare__good">Мало</td>
                <td className="sf-compare__bad">Багато</td>
              </tr>
              <tr>
                <td>Засвоюваність кальцію</td>
                <td className="sf-compare__good">Не порушує</td>
                <td className="sf-compare__bad">Знижує</td>
              </tr>
              <tr>
                <td>Проносна дія</td>
                <td className="sf-compare__good">Слабка</td>
                <td className="sf-compare__bad">Виражена</td>
              </tr>
              <tr>
                <td>Добова норма</td>
                <td className="sf-compare__good">200–300 г</td>
                <td className="sf-compare__bad">50–80 г (рідко)</td>
              </tr>
              <tr>
                <td>Молодняк до 3 міс.</td>
                <td className="sf-compare__good">Можна (малі дози)</td>
                <td className="sf-compare__bad">Не рекомендовано</td>
              </tr>
              <tr>
                <td>Рекомендація</td>
                <td className="sf-compare__good">Основний корм</td>
                <td className="sf-compare__mid">Рідкий прикорм</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="sf-back">
        <Link to="/" className="sf-back-btn">
          ⬅ На головну
        </Link>
      </div>
    </div>
  );
}
