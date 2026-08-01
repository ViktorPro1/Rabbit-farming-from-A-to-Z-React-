import { Link } from "react-router-dom";
import "./UrineScald.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const causes = [
  {
    icon: "🦴",
    name: "Артрит чи біль у суглобах",
    desc: "Кролику боляче прийняти правильну позу для сечовипускання.",
  },
  {
    icon: "⚖️",
    name: "Ожиріння",
    desc: "Заважає підняти задню частину тіла і ускладнює самостійний догляд.",
  },
  {
    icon: "💧",
    name: "Хвороби сечовидільної системи",
    desc: "Сечокам'яна хвороба, інфекції міхура, нетримання сечі.",
  },
  {
    icon: "🕰️",
    name: "Похилий вік",
    desc: "Зниження рухливості та контролю над сечовипусканням.",
  },
  {
    icon: "🦷",
    name: "Стоматологічний чи інший біль",
    desc: "Будь-який хронічний біль заважає прийняти правильну позу.",
  },
  {
    icon: "🛏️",
    name: "Забруднена підстилка",
    desc: "Навіть здоровий кролик постраждає, довго сидячи на мокрій підлозі.",
  },
];

const UrineScald = () => {
  return (
    <main className="urinescald-page">
      <div className="urinescald-header">
        <h1>🔥 Опік сечею у кролів</h1>
        <p>Не самостійна хвороба, а сигнал про приховану проблему</p>
      </div>

      <div className="urinescald-wrap">
        <div className="urinescald-intro">
          <h2>Що це таке</h2>
          <p>
            Сеча кролів подразнює шкіру. Якщо шерсть і шкіра тривалий час
            залишаються змоченими сечею — через неправильну поставу, забруднену
            підстилку чи нездатність доглядати себе — це викликає почервоніння,
            запалення, випадіння шерсті, а в занедбаних випадках — тріщини й
            вторинну інфекцію.
          </p>
          <div className="urinescald-alert danger">
            🔴 Опік сечею — майже завжди наслідок іншої проблеми, а не
            самостійна хвороба шкіри. Лікування без пошуку першопричини дає лише
            тимчасове полегшення.
          </div>
        </div>

        <div className="urinescald-section-title">
          ⚠️ Найчастіші першопричини
        </div>
        <div className="urinescald-causes-grid">
          {causes.map((c) => (
            <article key={c.name} className="urinescald-cause-card">
              <div className="urinescald-cause-header">
                <span className="urinescald-cause-icon">{c.icon}</span>
                <h2>{c.name}</h2>
              </div>
              <p className="urinescald-cause-desc">{c.desc}</p>
            </article>
          ))}
        </div>

        <div className="urinescald-section-title">
          🪰 Чому це небезпечно подвійно
        </div>
        <div className="urinescald-note">
          <p>
            Вологу пошкоджену шкіру, особливо влітку, активно приваблюють мухи —
            прямий ризик міазу (личинок мух), що може розвиватись блискавично й
            загрожувати життю.
          </p>
        </div>

        <div className="urinescald-section-title">🚑 Що робити</div>
        <div className="urinescald-note">
          <ul>
            <li>
              Обережно очистіть ділянку теплою водою без інтенсивного тертя
            </li>
            <li>Ретельно висушіть шкіру й шерсть</li>
            <li>
              Зверніться до ветеринара — навіть легкий опік вимагає пошуку
              причини
            </li>
            <li>Не застосовуйте креми з кортикостероїдами без призначення</li>
          </ul>
        </div>

        <div className="urinescald-section-title">🛡️ Профілактика</div>
        <div className="urinescald-facts-grid">
          <div className="urinescald-fact-card ok">
            <h3>✅ Чиста суха підстилка</h3>
            <p>Регулярна заміна — базова умова для будь-якого кролика.</p>
          </div>
          <div className="urinescald-fact-card ok">
            <h3>✅ Контроль ваги</h3>
            <p>Ожиріння — одна з провідних причин опіку сечею.</p>
          </div>
          <div className="urinescald-fact-card warn">
            <h3>⚠️ Своєчасне лікування артриту</h3>
            <p>Та інших станів, що обмежують рухливість.</p>
          </div>
          <div className="urinescald-fact-card warn">
            <h3>⚠️ Регулярний огляд у спекотний сезон</h3>
            <p>
              Особливо у похилих чи малорухливих кролів — через ризик міазу.
            </p>
          </div>
        </div>

        <div className="urinescald-note urinescald-sources">
          <h3>Джерела</h3>
          <ul>
            <li>Vet Verified — Urine Scalding in Rabbits</li>
            <li>Brandon Park Veterinary Hospital — Urine Scald in Rabbits</li>
            <li>Pet Care Advisors — Urine Scald in Rabbits</li>
          </ul>
          <p className="urinescald-disclaimer">
            Матеріал має ознайомчий характер і не замінює огляд ліцензованого
            ветеринара.
          </p>
        </div>

        <div className="urinescald-related">
          <h3 className="urinescald-related-title">Читайте також</h3>
          <div className="urinescald-related-grid">
            <Link to="/rabbit-urolithiasis" className="urinescald-related-link">
              💧 Сечокам'яна хвороба
            </Link>
            <Link to="/seasonal-summer" className="urinescald-related-link">
              🪰 Літо: міаз
            </Link>
            <Link to="/senior-rabbit" className="urinescald-related-link">
              🕰️ Кролик похилого віку
            </Link>
          </div>
        </div>

        <div className="urinescald-back">
          <Link to="/" className="urinescald-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Опік сечею у кролів" />
        </div>
      </div>
    </main>
  );
};

export default UrineScald;
