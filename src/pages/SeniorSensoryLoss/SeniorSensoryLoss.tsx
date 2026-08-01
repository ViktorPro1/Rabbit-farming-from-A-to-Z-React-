import { Link } from "react-router-dom";
import "./SeniorSensoryLoss.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const signs = [
  {
    icon: "👁️",
    name: "Ознаки втрати зору",
    desc: "Наштовхується на знайомі предмети, обережніше пересувається, гірше орієнтується при зміні освітлення.",
  },
  {
    icon: "👂",
    name: "Ознаки втрати слуху",
    desc: "Не реагує на звуки, які раніше викликали реакцію (відкриття холодильника, голос власника).",
  },
  {
    icon: "🐇",
    name: "Компенсаторна поведінка",
    desc: "Активніше покладається на нюх і вібриси, тримається знайомих маршрутів.",
  },
];

const SeniorSensoryLoss = () => {
  return (
    <main className="senses-page">
      <div className="senses-header">
        <h1>🕰️ Втрата зору й слуху у старих кролів</h1>
        <p>
          Як адаптувати утримання, щоб кролик зберігав якість життя навіть із
          сенсорними змінами
        </p>
      </div>

      <div className="senses-wrap">
        <div className="senses-intro">
          <h2>Чому це часто лишається непоміченим</h2>
          <p>
            Кролі — тварини-здобич і за природою приховують ознаки слабкості,
            зокрема й поступову втрату зору чи слуху. Оскільки вони чудово
            орієнтуються за запахом і вібрисами, легка чи навіть помірна втрата
            зору в знайомому середовищі може довго залишатись непоміченою
            власником.
          </p>
          <div className="senses-alert warn">
            ⚠️ Раптова (а не поступова) втрата зору чи координації — це не
            типова "стареча" зміна, а привід для термінового огляду: причиною
            можуть бути катаракта, глаукома чи E. cuniculi (див. відповідні
            статті), а не просто вік.
          </div>
        </div>

        <div className="senses-section-title">🔍 На що звертати увагу</div>
        <div className="senses-causes-grid">
          {signs.map((s) => (
            <article key={s.name} className="senses-cause-card">
              <div className="senses-cause-header">
                <span className="senses-cause-icon">{s.icon}</span>
                <h2>{s.name}</h2>
              </div>
              <p className="senses-cause-desc">{s.desc}</p>
            </article>
          ))}
        </div>

        <div className="senses-section-title">🏠 Адаптація утримання</div>
        <div className="senses-note">
          <ul>
            <li>
              Не переставляйте меблі, годівниці й лоток — стабільна "карта"
              простору критично важлива для орієнтації за пам'яттю
            </li>
            <li>
              Прибирайте гострі кути й перешкоди на звичних маршрутах
              пересування
            </li>
            <li>
              Використовуйте голос і легкий дотик перед тим, як взяти кролика на
              руки — раптовий дотик без попередження сильніше лякає кролика, що
              погано чує чи бачить
            </li>
            <li>
              Забезпечте нековзку підлогу — порушена орієнтація підвищує ризик
              падінь і травм
            </li>
            <li>
              Тримайте годівницю й поїлку на постійному, легко доступному місці
            </li>
          </ul>
        </div>

        <div className="senses-section-title">
          🩺 Коли звертатись до ветеринара
        </div>
        <div className="senses-note">
          <p>
            Будь-яка втрата зору чи слуху заслуговує на ветеринарний огляд хоча
            б раз — щоб виключити виліковні причини (катаракту, запалення вуха,
            E. cuniculi) і відрізнити їх від дійсно вікових незворотних змін.
            Навіть якщо причина виявиться незворотною, ветеринар допоможе
            скласти план адаптації утримання під конкретного кролика.
          </p>
        </div>

        <div className="senses-note senses-sources">
          <h3>Джерела</h3>
          <ul>
            <li>
              Rabbit Welfare Association &amp; Fund (RWAF) — Caring for Elderly
              Rabbits
            </li>
            <li>House Rabbit Society — Senior Rabbit Care</li>
          </ul>
          <p className="senses-disclaimer">
            Матеріал має ознайомчий характер і не замінює огляд ліцензованого
            ветеринара.
          </p>
        </div>

        <div className="senses-related">
          <h3 className="senses-related-title">Читайте також</h3>
          <div className="senses-related-grid">
            <Link to="/senior-rabbit" className="senses-related-link">
              🕰️ Кролик похилого віку
            </Link>
            <Link to="/rabbit-eye-diseases" className="senses-related-link">
              👁️ Хвороби очей
            </Link>
            <Link
              to="/encephalitozoon-cuniculi"
              className="senses-related-link"
            >
              🧠 E. cuniculi
            </Link>
            <Link to="/otitis-media-interna" className="senses-related-link">
              👂 Отит середнього вуха
            </Link>
          </div>
        </div>

        <div className="senses-back">
          <Link to="/" className="senses-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Втрата зору й слуху у старих кролів" />
        </div>
      </div>
    </main>
  );
};

export default SeniorSensoryLoss;
