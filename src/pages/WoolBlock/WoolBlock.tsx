import { Link } from "react-router-dom";
import "./WoolBlock.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const symptoms = [
  { sign: "Зниження або повна відмова від їжі", note: "" },
  { sign: "Млявість, небажання рухатись", note: "" },
  { sign: "Зменшення посліду або його відсутність", note: "" },
  { sign: "Кролик сидить згорбившись, скрегоче зубами", note: "Ознака болю" },
  { sign: "Здуття живота", note: "" },
  { sign: "Зневоднення", note: "" },
];

const WoolBlock = () => {
  return (
    <main className="woolblock-page">
      <div className="woolblock-header">
        <h1>🧶 Вовняна пробка в ангорських порід</h1>
        <p>
          Чому волосяний безоар — наслідок сповільненого травлення, а не причина
        </p>
      </div>

      <div className="woolblock-wrap">
        <div className="woolblock-intro">
          <h2>Чому ангорські породи в групі ризику</h2>
          <p>
            Кролі постійно вилизують себе під час грумінгу і при цьому ковтають
            випадкове волосся — це нормально. У здорового кроля з достатньою
            клітковиною ця шерсть рухається ШКТ разом з їжею й виходить з
            послідом.
          </p>
          <p>
            Ангорські породи через густе, довге хутро й активну линьку
            заковтують значно більше волосся. Якщо моторика кишківника вже трохи
            сповільнена (недостатньо сіна, ожиріння, стрес), шерсть
            накопичується в шлунку, всмоктує рідину й ущільнюється.
          </p>
          <div className="woolblock-alert warn">
            ⚠️ Тривалий час вважалося, що грудка шерсті сама блокує травлення.
            Сучасні джерела вказують на протилежне: шерсть накопичується тому,
            що моторика вже сповільнена — тобто волосяна грудка є наслідком, а
            не першопричиною ШКТ-стазу.
          </div>
        </div>

        <div className="woolblock-section-title">🌡️ Симптоми</div>
        <div className="woolblock-table-wrap">
          <table className="woolblock-table">
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

        <div className="woolblock-section-title">🚑 Що робити</div>
        <div className="woolblock-note">
          <p>
            Це той самий невідкладний стан, що й будь-який ШКТ-стаз. Лікування
            зазвичай включає:
          </p>
          <ul>
            <li>Регідратацію (рідину підшкірно чи внутрішньовенно)</li>
            <li>Препарати для стимуляції моторики кишківника</li>
            <li>Знеболення — біль сам по собі гальмує моторику ще більше</li>
            <li>Примусове годування рідкою висококлітковинною їжею</li>
          </ul>
          <p>
            Хірургія — крайній захід лише після підтвердження механічної
            закупорки.
          </p>
        </div>
        <div className="woolblock-alert danger">
          🔴 Домашні "народні" засоби (вазелінове масло, ананасовий сік) самі по
          собі не замінюють ветеринарну допомогу при вже розвиненому стазі.
        </div>

        <div className="woolblock-section-title">🛡️ Профілактика</div>
        <div className="woolblock-facts-grid">
          <div className="woolblock-fact-card ok">
            <h3>✅ Щоденне вичісування</h3>
            <p>Особливо в період линьки — менше проковтнутого волосся.</p>
          </div>
          <div className="woolblock-fact-card ok">
            <h3>✅ Сіно як основа раціону</h3>
            <p>
              Клітковина підтримує моторику, яка виносить волосся природним
              шляхом.
            </p>
          </div>
          <div className="woolblock-fact-card warn">
            <h3>⚠️ Контроль ваги й активність</h3>
            <p>Ожиріння і малорухливість сповільнюють моторику.</p>
          </div>
        </div>

        <div className="woolblock-note woolblock-sources">
          <h3>Джерела</h3>
          <ul>
            <li>
              dvm360 — Diagnosing and treating gastric ileus/stasis in rabbits
            </li>
            <li>PetMD — Angora Rabbit</li>
            <li>Angorarabbit.com — Wool Block and Finicky Eaters</li>
          </ul>
          <p className="woolblock-disclaimer">
            Матеріал має ознайомчий характер і не замінює огляд ліцензованого
            ветеринара.
          </p>
        </div>

        <div className="woolblock-related">
          <h3 className="woolblock-related-title">Читайте також</h3>
          <div className="woolblock-related-grid">
            <Link to="/diseases" className="woolblock-related-link">
              🩺 Хвороби
            </Link>
            <Link to="/treatment" className="woolblock-related-link">
              🏥 Схеми лікування
            </Link>
            <Link to="/fur-evaluation" className="woolblock-related-link">
              🧥 Оцінка хутра
            </Link>
          </div>
        </div>

        <div className="woolblock-back">
          <Link to="/" className="woolblock-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Вовняна пробка в ангорських порід" />
        </div>
      </div>
    </main>
  );
};

export default WoolBlock;
