import { Link } from "react-router-dom";
import "./PregnancyToxemia.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const riskFactors = [
  {
    icon: "⚖️",
    name: "Ожиріння",
    desc: "Накопичений жир швидше й у більшій кількості вивільняється в кров при нестачі їжі.",
    facts: [
      "Контролюйте BCS самки ще до злучки",
      "Ожиріла самка в групі найвищого ризику",
    ],
  },
  {
    icon: "🐇",
    name: "Первістки",
    desc: "Молоді самки з першою вагітністю трапляються серед хворих частіше.",
    facts: [
      "Уважніше спостерігайте за апетитом первісток",
      "Не парувати надто рано",
    ],
  },
  {
    icon: "🍼",
    name: "Багатоплідна вагітність",
    desc: "Чим більше кроленят виношує самка, тим вищі енергетичні потреби.",
    facts: [
      "Великий послід — вищий ризик",
      "Особливо в останню третину вагітності",
    ],
  },
  {
    icon: "😰",
    name: "Стрес перед окролом",
    desc: "Переїзд, різка зміна корму, спека, шум, грубе поводження знижують апетит.",
    facts: [
      "Мінімізуйте втручання в останні дні",
      "Стабільне середовище — стабільний апетит",
    ],
  },
];

const symptoms = [
  { sign: "Повна відмова від їжі", note: "Головний тривожний сигнал" },
  { sign: "Різка млявість", note: "Самка лежить, не реагує" },
  { sign: "Прискорене чи утруднене дихання", note: "" },
  { sign: '"Ацетоновий" запах з рота', note: "Кислий, як оцет" },
  { sign: "Зменшення кількості сечі", note: "" },
  { sign: "Тьмяні, запалі очі", note: "" },
  { sign: "Тремор, порушення координації", note: "Неврологічні прояви" },
  { sign: "Аборт чи мертвонароджені кроленята", note: "" },
  { sign: "Раптова загибель", note: "Без попередніх ознак" },
];

const PregnancyToxemia = () => {
  return (
    <main className="toxemia-page">
      <div className="toxemia-header">
        <h1>🩺 Токсикоз тільності (кетоз)</h1>
        <p>
          Рідкісний, але блискавичний і смертельно небезпечний стан останніх
          днів вагітності
        </p>
      </div>

      <div className="toxemia-wrap">
        <div className="toxemia-intro">
          <h2>Що це таке</h2>
          <p>
            Токсикоз тільності — порушення обміну речовин, коли організм самки
            не встигає забезпечити зростаючі потреби в енергії на останніх
            тижнях вагітності. Якщо надходження енергії з їжею відстає від цих
            потреб, організм починає інтенсивно розщеплювати власні жирові
            запаси.
          </p>
          <p>
            Печінка кролиці не встигає переробити такий об'єм жиру. У крові
            накопичуються кетонові тіла, а в печінці, серці й нирках
            відкладається надлишок жиру — це й викликає клінічну картину.
          </p>
          <div className="toxemia-alert danger">
            🔴 Хвороба розвивається за 1–2 дні до окролу (рідше — одразу після
            нього) і без лікування закінчується загибеллю самки. Якщо тільна
            самка раптово відмовляється від їжі й стає млявою в останній тиждень
            вагітності — негайно до ветеринара.
          </div>
        </div>

        <div className="toxemia-section-title">⚠️ Хто в групі ризику</div>
        <div className="toxemia-causes-grid">
          {riskFactors.map((r) => (
            <article key={r.name} className="toxemia-cause-card">
              <div className="toxemia-cause-header">
                <span className="toxemia-cause-icon">{r.icon}</span>
                <h2>{r.name}</h2>
              </div>
              <p className="toxemia-cause-desc">{r.desc}</p>
              <ul className="toxemia-cause-facts">
                {r.facts.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="toxemia-note">
          <p>
            Рідше стан трапляється і при хибній вагітності (псевдовагітності) —
            див. відповідну статтю.
          </p>
        </div>

        <div className="toxemia-section-title">🌡️ Симптоми</div>
        <div className="toxemia-table-wrap">
          <table className="toxemia-table">
            <thead>
              <tr>
                <th>Ознака</th>
                <th>Примітка</th>
              </tr>
            </thead>
            <tbody>
              {symptoms.map((s) => (
                <tr key={s.sign}>
                  <td>
                    <strong>{s.sign}</strong>
                  </td>
                  <td>{s.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="toxemia-alert warn">
          ⚠️ Ці ознаки неспецифічні — так само проявляються ШКТ-стаз,
          пастерельоз, тепловий удар. Точний діагноз ставить лише ветеринар.
        </div>

        <div className="toxemia-section-title">🚑 Що робити негайно</div>
        <div className="toxemia-note">
          <ul>
            <li>Негайно зв'яжіться з ветеринаром — рахунок йде на години</li>
            <li>До огляду забезпечте спокій, тінь, доступ до свіжої води</li>
            <li>
              Не лікуйте самостійно "навмання" — потрібні крапельниці з глюкозою
              та супровідна терапія
            </li>
            <li>
              Повідомте ветеринару точний термін вагітності й коли самка
              востаннє їла нормально
            </li>
          </ul>
        </div>

        <div className="toxemia-section-title">🛡️ Профілактика</div>
        <div className="toxemia-facts-grid">
          <div className="toxemia-fact-card ok">
            <h3>✅ Контроль BCS до злучки</h3>
            <p>Не допускайте ні ожиріння, ні виснаження самки перед в'язкою.</p>
          </div>
          <div className="toxemia-fact-card ok">
            <h3>✅ Підвищення калорійності в кінці вагітності</h3>
            <p>
              Поступово збільшуйте раціон в останню третину відповідно до
              потреб.
            </p>
          </div>
          <div className="toxemia-fact-card warn">
            <h3>⚠️ Стежте за апетитом щодня</h3>
            <p>
              Будь-яка багатоденна відмова від їжі перед окролом — тривожний
              сигнал.
            </p>
          </div>
          <div className="toxemia-fact-card warn">
            <h3>⚠️ Мінімізуйте стрес</h3>
            <p>
              Без переїздів, різкої зміни корму чи перегріву наприкінці
              вагітності.
            </p>
          </div>
        </div>

        <div className="toxemia-note toxemia-sources">
          <h3>Джерела</h3>
          <ul>
            <li>Merck (MSD) Veterinary Manual — розділ хвороб кролів</li>
            <li>Vet Help Direct — Pregnancy Toxaemia in Rabbits</li>
            <li>
              The Laboratory Rabbit, Guinea Pig, Hamster, and Other Rodents
              (Missouri CVM)
            </li>
          </ul>
          <p className="toxemia-disclaimer">
            Матеріал має ознайомчий характер і не замінює огляд ліцензованого
            ветеринара.
          </p>
        </div>

        <div className="toxemia-related">
          <h3 className="toxemia-related-title">Читайте також</h3>
          <div className="toxemia-related-grid">
            <Link to="/false-pregnancy" className="toxemia-related-link">
              🐣 Хибна вагітність
            </Link>
            <Link to="/okril-control" className="toxemia-related-link">
              🔍 Контроль дат
            </Link>
            <Link to="/rabbit-body-condition" className="toxemia-related-link">
              📏 Кондиція тіла (BCS)
            </Link>
            <Link to="/dystocia" className="toxemia-related-link">
              🚨 Дистоція
            </Link>
          </div>
        </div>

        <div className="toxemia-back">
          <Link to="/" className="toxemia-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Токсикоз тільності у кролиць" />
        </div>
      </div>
    </main>
  );
};

export default PregnancyToxemia;
