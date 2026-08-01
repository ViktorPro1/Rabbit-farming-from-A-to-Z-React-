import { Link } from "react-router-dom";
import "./RabbitEyeDiseases.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const diseases = [
  {
    icon: "🩸",
    name: "Виразка рогівки",
    desc: "Найпоширеніша очна проблема — травма, сухе око, ускладнення інших хвороб.",
    facts: [
      "Причини: сіно, пил, власна шерсть, удар об предмет",
      "Може бути наслідком неможливості моргати (параліч лицьового нерва при E. cuniculi)",
      "Діагностика — флуоресцеїновий тест",
      "Стероїдні краплі при відкритій виразці протипоказані",
    ],
  },
  {
    icon: "☁️",
    name: "Катаракта",
    desc: "Помутніння кришталика — вроджена, вікова або вторинна до E. cuniculi.",
    facts: [
      "Збудник розмножується в кришталику, викликаючи увеїт",
      'Ознака на вигляд схожа на "цукрову вату" в передній камері',
      "Без операції часто розвивається глаукома",
      "Лікування — видалення кришталика, штучний не рекомендований",
    ],
  },
  {
    icon: "⚫",
    name: "Глаукома",
    desc: "Підвищення внутрішньоочного тиску — здебільшого вторинна до катаракти чи увеїту.",
    facts: [
      "Збільшення розміру очного яблука",
      "Помутніння й набряк рогівки",
      "Болючий стан — кролик уникає світла",
      "Прогресуюча втрата зору без лікування",
    ],
  },
];

const RabbitEyeDiseases = () => {
  return (
    <main className="eyedis-page">
      <div className="eyedis-header">
        <h1>👁️ Хвороби очей у кролів</h1>
        <p>
          Виразка рогівки, катаракта, глаукома — на що звертати увагу, крім
          кон'юнктивіту
        </p>
      </div>

      <div className="eyedis-wrap">
        <div className="eyedis-intro">
          <h2>Чому у кролів очі вразливіші</h2>
          <p>
            Очне яблуко й поверхня рогівки у кролів відносно більші, ніж у
            більшості інших домашніх тварин, а моргають кролі значно рідше.
            Через це рогівка гірше зволожується і легше пошкоджується — саме
            тому виразка рогівки є найпоширенішою очною проблемою у кролів.
          </p>
          <div className="eyedis-alert danger">
            🔴 Будь-яке почервоніння, мружіння, сльозотеча чи помутніння, що
            триває більше доби, — привід показати кроля ветеринару. Багато очних
            проблем швидко прогресують і можуть призвести до втрати ока без
            своєчасного лікування.
          </div>
        </div>

        <div className="eyedis-section-title">🩺 Основні хвороби</div>
        <div className="eyedis-causes-grid">
          {diseases.map((d) => (
            <article key={d.name} className="eyedis-cause-card">
              <div className="eyedis-cause-header">
                <span className="eyedis-cause-icon">{d.icon}</span>
                <h2>{d.name}</h2>
              </div>
              <p className="eyedis-cause-desc">{d.desc}</p>
              <ul className="eyedis-cause-facts">
                {d.facts.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="eyedis-section-title">
          🚨 Коли терміново до ветеринара
        </div>
        <div className="eyedis-note">
          <ul>
            <li>Око раптово збільшилось у розмірі чи випнулось</li>
            <li>Кролик тримає око постійно закритим і не дає торкатись</li>
            <li>З'явилось глибоке помутніння чи видима "яма" на рогівці</li>
            <li>Виділення з ока стали гнійними</li>
            <li>Різке погіршення орієнтації кролика в просторі</li>
          </ul>
        </div>

        <div className="eyedis-note eyedis-sources">
          <h3>Джерела</h3>
          <ul>
            <li>
              Merck (MSD) Veterinary Manual — Noninfectious Diseases of Rabbits;
              The Cornea in Animals; Glaucoma in Animals
            </li>
            <li>Lafeber Co. — Rabbit Eye Problems and Treatments</li>
          </ul>
          <p className="eyedis-disclaimer">
            Матеріал має ознайомчий характер і не замінює огляд ліцензованого
            ветеринара.
          </p>
        </div>

        <div className="eyedis-related">
          <h3 className="eyedis-related-title">Читайте також</h3>
          <div className="eyedis-related-grid">
            <Link
              to="/encephalitozoon-cuniculi"
              className="eyedis-related-link"
            >
              🧠 E. cuniculi
            </Link>
            <Link to="/diseases" className="eyedis-related-link">
              🩺 Хвороби
            </Link>
            <Link to="/symptoms" className="eyedis-related-link">
              🌡️ Симптоматичний пошук
            </Link>
          </div>
        </div>

        <div className="eyedis-back">
          <Link to="/" className="eyedis-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Хвороби очей у кролів" />
        </div>
      </div>
    </main>
  );
};

export default RabbitEyeDiseases;
