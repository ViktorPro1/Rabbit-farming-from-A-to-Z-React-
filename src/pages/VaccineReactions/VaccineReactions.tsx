import { Link } from "react-router-dom";
import "./VaccineReactions.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const normalReactions = [
  {
    sign: "Невелика припухлість у місці ін'єкції",
    note: "До 2 см, минає сама протягом 2–3 тижнів",
  },
  { sign: "Незначне підвищення температури на 1–2°C", note: "Тимчасове" },
  { sign: "Легка млявість 1–2 дні", note: "" },
  { sign: "Тимчасове зниження апетиту", note: "Короткий період" },
  { sign: "Легке кульгання", note: "Рідко, минає самостійно" },
];

const dangerSigns = [
  { sign: "Утруднене дихання", note: "Ознака анафілаксії" },
  { sign: "Різка слабкість, колапс", note: "Невідкладна ситуація" },
  { sign: "Бліді слизові оболонки", note: "Ознака шоку" },
  { sign: "Набряк морди чи повік, що швидко наростає", note: "" },
  {
    sign: "Симптоми протягом хвилин–години після ін'єкції",
    note: "Час має значення для діагностики",
  },
];

const VaccineReactions = () => {
  return (
    <main className="vaxreact-page">
      <div className="vaxreact-header">
        <h1>💉 Побічні реакції на вакцинацію</h1>
        <p>Коли це норма, а коли — невідкладна ситуація</p>
      </div>

      <div className="vaxreact-wrap">
        <div className="vaxreact-intro">
          <h2>Загальний баланс ризиків</h2>
          <p>
            Вакцинація проти ВГХК та міксоматозу — стандартна й загалом дуже
            безпечна практика. Переважна більшість кролів взагалі не мають
            жодних побічних реакцій, а якщо мають — це легкі й тимчасові прояви.
          </p>
          <div className="vaxreact-alert ok">
            ✅ Ризик кролика захворіти й загинути від ВГХК чи міксоматозу
            незрівнянно вищий за ризик серйозної побічної реакції на вакцину.
            Відмова від вакцинації через страх побічних ефектів — значно
            небезпечніший вибір.
          </div>
        </div>

        <div className="vaxreact-section-title">
          ✅ Нормальні (очікувані) реакції
        </div>
        <div className="vaxreact-table-wrap">
          <table className="vaxreact-table">
            <thead>
              <tr>
                <th>Ознака</th>
                <th>Примітка</th>
              </tr>
            </thead>
            <tbody>
              {normalReactions.map((r) => (
                <tr key={r.sign}>
                  <td>
                    <strong>{r.sign}</strong>
                  </td>
                  <td>{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="vaxreact-note">
          <p>
            За офіційними даними виробників, невеликий безболісний набряк у
            місці ін'єкції (до 2 см) трапляється досить часто протягом перших
            двох тижнів після щеплення і повністю зникає приблизно до третього
            тижня. Тимчасове підвищення температури на 1–2°C — також
            задокументована норма.
          </p>
        </div>

        <div className="vaxreact-section-title">
          🔴 Ознаки серйозної реакції — невідкладна допомога
        </div>
        <div className="vaxreact-table-wrap">
          <table className="vaxreact-table">
            <thead>
              <tr>
                <th>Ознака</th>
                <th>Примітка</th>
              </tr>
            </thead>
            <tbody>
              {dangerSigns.map((r) => (
                <tr key={r.sign}>
                  <td>
                    <strong>{r.sign}</strong>
                  </td>
                  <td>{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="vaxreact-alert danger">
          🔴 Анафілаксія — вкрай рідкісна, але потенційно смертельна гостра
          алергічна реакція, яка розвивається протягом хвилин–години після
          вакцинації. Це невідкладна ветеринарна ситуація, що вимагає негайного
          втручання (епінефрин та підтримувальна терапія). Саме тому вакцинацію
          найкраще проводити безпосередньо у ветеринара, а не самостійно вдома.
        </div>

        <div className="vaxreact-section-title">
          ⚠️ Рідкісні місцеві ускладнення
        </div>
        <div className="vaxreact-note">
          <p>
            У дуже рідкісних випадках у місці ін'єкції можуть виникати некроз
            тканини, кірки чи випадіння шерсті на постійній основі. Якщо
            припухлість не зменшується через 3 тижні, стає гарячою, болючою чи
            з'являються виділення — це привід звернутись до ветеринара, оскільки
            може йтися про вторинну інфекцію, а не про саму реакцію на вакцину.
          </p>
        </div>

        <div className="vaxreact-section-title">📋 Практичні поради</div>
        <div className="vaxreact-facts-grid">
          <div className="vaxreact-fact-card ok">
            <h3>✅ Спостерігайте перші 30–60 хвилин</h3>
            <p>
              Найкраще залишатись поруч із клінікою якийсь час після ін'єкції.
            </p>
          </div>
          <div className="vaxreact-fact-card ok">
            <h3>✅ Не панікуйте через легку млявість</h3>
            <p>День-два зниженого апетиту й активності — очікувана норма.</p>
          </div>
          <div className="vaxreact-fact-card warn">
            <h3>⚠️ Записуйте реакції в журнал</h3>
            <p>
              Якщо минула реакція була незвичною, повідомте ветеринара перед
              наступним щепленням.
            </p>
          </div>
        </div>

        <div className="vaxreact-note vaxreact-sources">
          <h3>Джерела</h3>
          <ul>
            <li>
              MSD Animal Health Hub — Nobivac Myxo-RHD PLUS Q&A (офіційна
              інструкція)
            </li>
            <li>PetMD — Rabbit Vaccines: Everything You Need to Know</li>
            <li>
              Biomedicus — The Side Effects of Yurvac RHD (Veterinary Use)
            </li>
          </ul>
          <p className="vaxreact-disclaimer">
            Матеріал має ознайомчий характер і не замінює огляд ліцензованого
            ветеринара.
          </p>
        </div>

        <div className="vaxreact-related">
          <h3 className="vaxreact-related-title">Читайте також</h3>
          <div className="vaxreact-related-grid">
            <Link to="/vaccinations" className="vaxreact-related-link">
              💉 Вакцинація
            </Link>
            <Link to="/first-aid" className="vaxreact-related-link">
              🚑 Перша допомога
            </Link>
            <Link to="/treatment-log" className="vaxreact-related-link">
              📋 Журнал лікувань
            </Link>
          </div>
        </div>

        <div className="vaxreact-back">
          <Link to="/" className="vaxreact-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Побічні реакції на вакцинацію кролів" />
        </div>
      </div>
    </main>
  );
};

export default VaccineReactions;
