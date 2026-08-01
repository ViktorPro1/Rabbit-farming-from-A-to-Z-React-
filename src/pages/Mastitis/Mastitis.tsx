import { Link } from "react-router-dom";
import "./Mastitis.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const symptoms = [
  { sign: "Молочні залози гарячі, почервонілі, набряклі", note: "" },
  {
    sign: "Синювато-багровий відтінок шкіри",
    note: '"Синя грудь" — пізня стадія',
  },
  { sign: "Відмова від їжі, тяга до води", note: "" },
  { sign: "Висока температура тіла", note: "" },
  {
    sign: "Агресія при спробі кроленят смоктати",
    note: "Самка відмовляється годувати",
  },
  { sign: "Гнійні чи кров'янисті виділення", note: "У занедбаних випадках" },
];

const Mastitis = () => {
  return (
    <main className="mastitis-page">
      <div className="mastitis-header">
        <h1>🍼 Мастит у кролиць</h1>
        <p>
          "Синя грудь" — рідкісна, але швидко смертельна інфекція молочних залоз
        </p>
      </div>

      <div className="mastitis-wrap">
        <div className="mastitis-intro">
          <h2>Що це таке</h2>
          <p>
            Мастит — запалення молочних залоз, спричинене переважно бактеріями
            роду Staphylococcus. Найчастіше уражає лактуючих самок після окролу.
            Бактерії потрапляють через подряпини на сосках — від кігтиків
            кроленят чи грубих країв входу в маточник. Застій молока також
            створює сприятливе середовище для бактерій.
          </p>
          <div className="mastitis-alert danger">
            🔴 Якщо антибіотикотерапію почати ще першого дня, коли самка
            перестала їсти, шанс врятувати тварину значно вищий. Зволікання
            навіть на день-два різко погіршує прогноз — можливий сепсис і швидка
            загибель.
          </div>
        </div>

        <div className="mastitis-section-title">🌡️ Симптоми</div>
        <div className="mastitis-table-wrap">
          <table className="mastitis-table">
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
        <div className="mastitis-alert warn">
          ⚠️ Втрата ваги в перші дні після окролу — норма сама по собі,
          орієнтуйтесь передусім на відмову від їжі й гарячі набряклі залози.
        </div>

        <div className="mastitis-section-title">💊 Лікування</div>
        <div className="mastitis-note">
          <p>
            Ін'єкційний пеніцилін зазвичай безпечний для кролів (на відміну від
            перорального, що небезпечний), але навіть він може спричинити розлад
            травлення — раціон тимчасово зміщують у бік більшої кількості сіна.
            Схему визначає ветеринар.
          </p>
          <p>
            Кроленят від хворої самки не можна фостерити до іншої самки — це
            рознесе інфекцію. При неможливості годування — штучне вигодовування.
          </p>
        </div>

        <div className="mastitis-section-title">🛡️ Профілактика</div>
        <div className="mastitis-facts-grid">
          <div className="mastitis-fact-card ok">
            <h3>✅ Гладкий вхід у маточник</h3>
            <p>Без гострих країв, об які самка може травмувати соски.</p>
          </div>
          <div className="mastitis-fact-card ok">
            <h3>✅ Дезінфекція маточника</h3>
            <p>Перед кожним новим окролом і після завершення лактації.</p>
          </div>
          <div className="mastitis-fact-card warn">
            <h3>⚠️ Поступове відлучення</h3>
            <p>Щоб уникнути раптового застою молока.</p>
          </div>
          <div className="mastitis-fact-card warn">
            <h3>⚠️ Щоденний огляд залоз</h3>
            <p>Особливо в перші дні–тижні після окролу.</p>
          </div>
        </div>

        <div className="mastitis-note mastitis-sources">
          <h3>Джерела</h3>
          <ul>
            <li>
              Merck (MSD) Veterinary Manual — Disorders and Diseases of Rabbits;
              Bacterial and Mycotic Diseases of Rabbits
            </li>
          </ul>
          <p className="mastitis-disclaimer">
            Матеріал має ознайомчий характер і не замінює огляд ліцензованого
            ветеринара.
          </p>
        </div>

        <div className="mastitis-related">
          <h3 className="mastitis-related-title">Читайте також</h3>
          <div className="mastitis-related-grid">
            <Link to="/okril" className="mastitis-related-link">
              🍼 Окріл
            </Link>
            <Link to="/dystocia" className="mastitis-related-link">
              🚨 Дистоція
            </Link>
            <Link to="/artificial-feeding" className="mastitis-related-link">
              🥛 Штучне вигодовування
            </Link>
          </div>
        </div>

        <div className="mastitis-back">
          <Link to="/" className="mastitis-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Мастит у кролиць" />
        </div>
      </div>
    </main>
  );
};

export default Mastitis;
