import { Link } from "react-router-dom";
import "./EncephalitozoonCuniculi.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const manifestations = [
  {
    icon: "🧠",
    name: "Неврологічні прояви",
    desc: "Найпомітніша й найчастіше згадувана форма.",
    facts: [
      "Нахил голови (вестибулярний синдром)",
      "Втрата координації, перекочування",
      "Судоми",
      "Параліч задніх кінцівок",
    ],
  },
  {
    icon: "🩸",
    name: "Ниркові прояви",
    desc: "Ураження нирок збудником.",
    facts: [
      "Підвищена спрага",
      "Часте сечовипускання",
      "Зневоднення",
      "Втрата ваги",
    ],
  },
  {
    icon: "👁️",
    name: "Ураження очей",
    desc: "Пов'язане з розмноженням збудника в кришталику.",
    facts: [
      "Катаракта",
      "Факокластичний увеїт",
      "Детальніше — у статті про хвороби очей",
    ],
  },
];

const EncephalitozoonCuniculi = () => {
  return (
    <main className="ecuniculi-page">
      <div className="ecuniculi-header">
        <h1>🧠 Енцефалітозооноз (E. cuniculi)</h1>
        <p>Прихована інфекція, на яку заражені 50–75% домашніх кролів</p>
      </div>

      <div className="ecuniculi-wrap">
        <div className="ecuniculi-intro">
          <h2>Що це таке</h2>
          <p>
            Encephalitozoon cuniculi — одноклітинний паразит (мікроспоридія), що
            вражає нирки, нервову систему та очі кролів. Зараження відбувається
            внутрішньоутробно від матері або через ковтання спор, які заражена
            тварина виділяє із сечею. Спори можуть залишатись заразними в
            довкіллі до приблизно 6 тижнів за кімнатної температури.
          </p>
          <div className="ecuniculi-alert ok">
            ✅ У більшості кролів імунна система стримує збудника, й інфекція
            залишається безсимптомною все життя. Позитивний тест ще не означає,
            що кролик хворий зараз.
          </div>
        </div>

        <div className="ecuniculi-section-title">🩺 Три напрямки прояву</div>
        <div className="ecuniculi-causes-grid">
          {manifestations.map((m) => (
            <article key={m.name} className="ecuniculi-cause-card">
              <div className="ecuniculi-cause-header">
                <span className="ecuniculi-cause-icon">{m.icon}</span>
                <h2>{m.name}</h2>
              </div>
              <p className="ecuniculi-cause-desc">{m.desc}</p>
              <ul className="ecuniculi-cause-facts">
                {m.facts.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="ecuniculi-section-title">🧪 Діагностика</div>
        <div className="ecuniculi-note">
          <p>
            Основний метод — аналіз крові на антитіла (серологія). Високий титр
            — підстава почати лікування, навіть без явних симптомів. Виявлення
            спор у сечі менш надійне: заражена тварина виділяє спори з
            перервами, тож негативний аналіз сечі не виключає хвороби.
          </p>
        </div>

        <div className="ecuniculi-section-title">💊 Лікування</div>
        <div className="ecuniculi-note">
          <p>
            Основа лікування — фенбендазол перорально, зазвичай 20 мг/кг раз на
            добу протягом 28 днів (застосування off-label, схему визначає
            ветеринар).
          </p>
          <ul>
            <li>
              При активних неврологічних симптомах — протизапальні, знеболення,
              підтримувальна терапія
            </li>
            <li>
              Стероїдні протизапальні препарати протипоказані — пригнічують
              імунітет
            </li>
          </ul>
        </div>

        <div className="ecuniculi-section-title">
          🛡️ Профілактика та контроль
        </div>
        <div className="ecuniculi-facts-grid">
          <div className="ecuniculi-fact-card ok">
            <h3>✅ Профілактичний фенбендазол</h3>
            <p>Для нових тварин, які надходять у господарство.</p>
          </div>
          <div className="ecuniculi-fact-card ok">
            <h3>✅ Серологічне обстеження поголів'я</h3>
            <p>У великих господарствах для оздоровлення стада.</p>
          </div>
          <div className="ecuniculi-fact-card warn">
            <h3>⚠️ Дезінфекція середовища</h3>
            <p>Спори чутливі до стандартних дезінфектантів.</p>
          </div>
        </div>
        <div className="ecuniculi-alert warn">
          ⚠️ Це зоонозна інфекція — теоретично може передаватись людині, хоча
          клінічні випадки в людей з нормальним імунітетом рідкісні. Базова
          гігієна при роботі з сечею й підстилкою залишається доречною.
        </div>

        <div className="ecuniculi-note ecuniculi-sources">
          <h3>Джерела</h3>
          <ul>
            <li>
              Merck (MSD) Veterinary Manual — Management of Rabbits; Parasitic
              Diseases of Rabbits
            </li>
            <li>
              Latney L. V. et al. — Encephalitozoon cuniculi in pet rabbits:
              diagnosis and optimal management, Dove Medical Press
            </li>
            <li>
              A Review of Encephalitozoon cuniculi in Domestic Rabbits, Animals
              (MDPI), 2022
            </li>
          </ul>
          <p className="ecuniculi-disclaimer">
            Матеріал має ознайомчий характер і не замінює огляд ліцензованого
            ветеринара.
          </p>
        </div>

        <div className="ecuniculi-related">
          <h3 className="ecuniculi-related-title">Читайте також</h3>
          <div className="ecuniculi-related-grid">
            <Link to="/rabbit-eye-diseases" className="ecuniculi-related-link">
              👁️ Хвороби очей
            </Link>
            <Link to="/rabbit-urolithiasis" className="ecuniculi-related-link">
              💧 Сечокам'яна хвороба
            </Link>
            <Link to="/symptoms" className="ecuniculi-related-link">
              🌡️ Симптоматичний пошук
            </Link>
          </div>
        </div>

        <div className="ecuniculi-back">
          <Link to="/" className="ecuniculi-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Енцефалітозооноз (E. cuniculi)" />
        </div>
      </div>
    </main>
  );
};

export default EncephalitozoonCuniculi;
