import { Link } from "react-router-dom";
import "./HeartDisease.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const diagnosisTypes = [
  {
    type: "Дегенеративна хвороба клапанів",
    share:
      "найпоширеніша (за даними дослідження — близько 40% ехокардіографічних діагнозів)",
  },
  {
    type: "Дилятаційна кардіоміопатія",
    share: "розширення й ослаблення серцевого м'яза",
  },
  { type: "Гіпертрофічна кардіоміопатія", share: "потовщення стінок серця" },
  {
    type: "Рестриктивна кардіоміопатія",
    share: "порушення розслаблення серцевого м'яза",
  },
];

const symptoms = [
  {
    sign: "Шум у серці при аускультації",
    note: "Найчастіша перша знахідка на профілактичному огляді",
  },
  { sign: "Аритмія (порушення ритму)", note: "" },
  { sign: "Прискорене чи утруднене дихання", note: "" },
  { sign: "Знижений апетит", note: "" },
  { sign: "М'язове виснаження", note: "При тривалому перебігу" },
  {
    sign: "Накопичення рідини в грудній чи черевній порожнині",
    note: "Ознака застійної серцевої недостатності",
  },
];

const HeartDisease = () => {
  return (
    <main className="heartdisease-page">
      <div className="heartdisease-header">
        <h1>❤️ Кардіоміопатія та хвороби серця у кролів</h1>
        <p>
          Рідкісна, але реальна проблема — часто виявляється випадково на
          плановому огляді
        </p>
      </div>

      <div className="heartdisease-wrap">
        <div className="heartdisease-intro">
          <h2>Наскільки це поширено</h2>
          <p>
            За даними великого ретроспективного дослідження ветеринарної клініки
            (2001–2018 рр.), поширеність серцево-судинних хвороб серед
            обстежених кролів становила приблизно 2,6% — тобто стан нечастий,
            але аж ніяк не унікальний.
          </p>
          <div className="heartdisease-alert warn">
            ⚠️ Кролі здатні довго компенсувати серцеву проблему, підлаштовуючи
            власну активність, — тому хвороба часто залишається непоміченою до
            пізньої стадії. Симптоми нерідко виявляють випадково під час
            планового огляду з іншого приводу.
          </div>
        </div>

        <div className="heartdisease-section-title">
          🩺 Основні типи діагнозів
        </div>
        <div className="heartdisease-table-wrap">
          <table className="heartdisease-table">
            <thead>
              <tr>
                <th>Тип</th>
                <th>Примітка</th>
              </tr>
            </thead>
            <tbody>
              {diagnosisTypes.map((d) => (
                <tr key={d.type}>
                  <td>
                    <strong>{d.type}</strong>
                  </td>
                  <td>{d.share}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="heartdisease-note">
          <p>
            Причини різноманітні: вікові дегенеративні зміни клапанів, можлива
            генетична схильність (за спостереженнями практикуючих ветеринарів,
            великі породи можуть бути більш схильні до кардіоміопатій), системні
            інфекції, що впливають на провідну систему серця, електролітний
            дисбаланс. В окремих випадках причиною серцевих симптомів
            виявляється пухлина загрудинної залози (тимома) — див. відповідну
            статтю.
          </p>
        </div>

        <div className="heartdisease-section-title">🌡️ Симптоми</div>
        <div className="heartdisease-table-wrap">
          <table className="heartdisease-table">
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

        <div className="heartdisease-section-title">🧪 Діагностика</div>
        <div className="heartdisease-note">
          <ul>
            <li>
              Аускультація (прослуховування) — перший і найдоступніший метод
              виявлення шуму чи аритмії
            </li>
            <li>
              Рентген грудної клітки — оцінка розміру серця, наявності рідини в
              грудній порожнині
            </li>
            <li>
              ЕхоКГ (ультразвук серця) — золотий стандарт для оцінки структури й
              функції серця
            </li>
            <li>ЕКГ — для аналізу порушень ритму</li>
          </ul>
          <p className="heartdisease-note-small">
            Через високу частоту серцевих скорочень кроля (значно вищу, ніж у
            людини чи собаки) важливо, щоб діагностику проводив фахівець,
            знайомий саме з нормальними показниками для кролів — стандартні
            "людські" чи "собачі" норми тут не застосовні.
          </p>
        </div>

        <div className="heartdisease-section-title">
          💊 Лікування та прогноз
        </div>
        <div className="heartdisease-note">
          <p>
            Медикаментозне лікування (препарати для підтримки серцевої функції,
            контролю ритму, виведення надлишкової рідини) підбирає ветеринар
            індивідуально — за даними того ж дослідження, застосування такої
            терапії загалом супроводжувалось небагатьма побічними ефектами.
          </p>
          <p>
            Прогноз стриманий: медіанний час виживання після встановлення
            діагнозу серцевої хвороби в дослідженні становив приблизно 306 днів,
            хоча реальний діапазон дуже широкий — від кількох днів до кількох
            років, залежно від типу й тяжкості хвороби на момент виявлення.
          </p>
        </div>

        <div className="heartdisease-section-title">🛡️ Практичні поради</div>
        <div className="heartdisease-facts-grid">
          <div className="heartdisease-fact-card ok">
            <h3>✅ Регулярні профілактичні огляди</h3>
            <p>
              Особливо для кролів старшого віку та великих порід — аускультація
              серця має бути частиною рутинного огляду.
            </p>
          </div>
          <div className="heartdisease-fact-card warn">
            <h3>⚠️ Не ігноруйте зміну активності</h3>
            <p>
              Незрозуміла млявість чи задишка — привід для огляду, навіть без
              інших очевидних симптомів.
            </p>
          </div>
        </div>

        <div className="heartdisease-note heartdisease-sources">
          <h3>Джерела</h3>
          <ul>
            <li>
              Clinical and pathological findings in rabbits with cardiovascular
              disease: 59 cases (2001–2018), JAVMA, 2021
            </li>
            <li>
              House Rabbit Society — Heart Disease in Companion Rabbits: Causes,
              Diagnosis, and Treatment
            </li>
            <li>
              Veterian Key — Cardiovascular Disease, Lymphoproliferative
              Disorders, and Thymomas (глава ветеринарного підручника)
            </li>
            <li>
              Valvular Regurgitation and Congestive Heart Failure in an Elderly
              Dutch Rabbit, PMC (кейс-репорт)
            </li>
          </ul>
          <p className="heartdisease-disclaimer">
            Матеріал має ознайомчий характер і не замінює огляд ліцензованого
            ветеринара.
          </p>
        </div>

        <div className="heartdisease-related">
          <h3 className="heartdisease-related-title">Читайте також</h3>
          <div className="heartdisease-related-grid">
            <Link to="/thymoma" className="heartdisease-related-link">
              🫁 Тимома
            </Link>
            <Link to="/senior-rabbit" className="heartdisease-related-link">
              🕰️ Кролик похилого віку
            </Link>
            <Link
              to="/blood-test-reference"
              className="heartdisease-related-link"
            >
              🧪 Аналіз крові кролика
            </Link>
          </div>
        </div>

        <div className="heartdisease-back">
          <Link to="/" className="heartdisease-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Кардіоміопатія та хвороби серця у кролів" />
        </div>
      </div>
    </main>
  );
};

export default HeartDisease;
