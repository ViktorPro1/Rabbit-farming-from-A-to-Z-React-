import { Link } from "react-router-dom";
import "./UterineAdenocarcinoma.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const riskData = [
  {
    param: "Вік до 3 років",
    value: "~4%",
    note: "Ризик уже присутній навіть у молодих непокастрованих самок",
  },
  {
    param: "Вік 5–6 років",
    value: "50–80%",
    note: "Стрімке зростання ризику з віком",
  },
  {
    param: "Метастазування",
    value: "20–80% випадків",
    note: "Найчастіше в легені, печінку, селезінку, нирки",
  },
  {
    param: "Породи підвищеного ризику",
    value: "Тан, Гавана, Голландська",
    note: "Може вражати будь-яку породу",
  },
];

const symptoms = [
  {
    sign: "Кров у сечі чи кров'янисті виділення з вульви",
    note: "Часто плутають зі звичайною сечею",
  },
  { sign: "Викидні чи мертвонароджені кроленята", note: "У племінних самок" },
  { sign: "Втрата ваги, зниження апетиту", note: "На пізніх стадіях" },
  { sign: "Млявість, депресивний стан", note: "" },
  { sign: "Збільшення живота", note: "Пухлина чи асцит" },
  { sign: "Утруднене дихання", note: "При метастазах у легені" },
];

const UterineAdenocarcinoma = () => {
  return (
    <main className="adenoca-page">
      <div className="adenoca-header">
        <h1>🎗️ Аденокарцинома матки</h1>
        <p>
          Найпоширеніша пухлина у непокастрованих самок — і головний аргумент на
          користь стерилізації
        </p>
      </div>

      <div className="adenoca-wrap">
        <div className="adenoca-intro">
          <h2>Наскільки це поширено</h2>
          <p>
            Аденокарцинома матки — найпоширеніший вид раку серед самок кролів.
            Це злоякісна пухлина слизової оболонки матки, здатна метастазувати в
            інші органи, якщо не виявлена і не лікується вчасно. Ризик зростає
            різко з віком: якщо у самок до 3 років частота становить приблизно
            4%, то до 5–6 років вона сягає 50–80% серед непокастрованих тварин.
          </p>
          <div className="adenoca-alert danger">
            🔴 Постійна дія репродуктивних гормонів у непокастрованої самки —
            основний рушій цієї хвороби. Стерилізація до статевого дозрівання
            практично усуває цей ризик і є найефективнішою профілактикою з усіх
            відомих у ветеринарії дрібних тварин.
          </div>
        </div>

        <div className="adenoca-section-title">📊 Статистика ризику</div>
        <div className="adenoca-table-wrap">
          <table className="adenoca-table">
            <thead>
              <tr>
                <th>Показник</th>
                <th>Значення</th>
                <th>Примітка</th>
              </tr>
            </thead>
            <tbody>
              {riskData.map((r) => (
                <tr key={r.param}>
                  <td>
                    <strong>{r.param}</strong>
                  </td>
                  <td className="adenoca-value">{r.value}</td>
                  <td>{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="adenoca-section-title">🌡️ Симптоми</div>
        <div className="adenoca-table-wrap">
          <table className="adenoca-table">
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
        <div className="adenoca-alert warn">
          ⚠️ На ранніх стадіях самка часто не показує жодних симптомів — кролі
          за природою приховують ознаки хвороби. Регулярний ветеринарний огляд
          непокастрованих самок старше 2 років особливо важливий.
        </div>

        <div className="adenoca-section-title">🧪 Діагностика</div>
        <div className="adenoca-note">
          <ul>
            <li>Пальпація живота — виявлення ущільнення в ділянці матки</li>
            <li>
              Рентген чи УЗД — для оцінки розміру пухлини й пошуку метастазів у
              легенях
            </li>
            <li>Аналіз крові — часто виявляє супутню анемію</li>
            <li>
              Остаточний діагноз — гістологічне дослідження тканини після
              операції
            </li>
          </ul>
          <p>
            Діагностику починають з виключення інших причин — насамперед
            вагітності, а також доброякісних утворень матки (наприклад,
            кістозної гіперплазії ендометрію), які можуть давати схожу картину.
          </p>
        </div>

        <div className="adenoca-section-title">💊 Лікування та прогноз</div>
        <div className="adenoca-note">
          <p>
            <strong>
              Оваріогістеректомія (повне видалення яєчників і матки)
            </strong>{" "}
            — основний і фактично єдиний ефективний метод лікування. Якщо
            пухлина не встигла метастазувати за межі матки, операція є фактично
            виліковною, і більшість тварин живуть повноцінне життя надалі.
          </p>
          <p>
            При вже наявних метастазах прогноз значно гірший — хіміотерапія у
            кролів має мінімальний ефект, а середня тривалість життя після
            виявлення метастазів становить орієнтовно 12–18 місяців. Тому рання
            діагностика критично важлива.
          </p>
          <p>
            Після операції рекомендують регулярний контроль — фізичний огляд і
            візуалізаційні дослідження кожні 3–6 місяців протягом перших років.
          </p>
        </div>

        <div className="adenoca-section-title">🛡️ Профілактика</div>
        <div className="adenoca-facts-grid">
          <div className="adenoca-fact-card ok">
            <h3>✅ Стерилізація до статевого дозрівання</h3>
            <p>Найефективніший спосіб практично усунути ризик цієї хвороби.</p>
          </div>
          <div className="adenoca-fact-card ok">
            <h3>✅ Регулярні огляди непокастрованих самок</h3>
            <p>Особливо після 2–3 років — щорічний профілактичний огляд.</p>
          </div>
          <div className="adenoca-fact-card warn">
            <h3>⚠️ Не ігноруйте кров у сечі</h3>
            <p>Навіть поодинокий епізод — привід звернутись до ветеринара.</p>
          </div>
        </div>

        <div className="adenoca-note adenoca-sources">
          <h3>Джерела</h3>
          <ul>
            <li>PetMD — Cancer of the Uterus in Rabbits</li>
            <li>
              PMC — Immunohistochemical Investigation of COX-2 Expression in
              Rabbit Uterine Adenocarcinoma, 2024
            </li>
            <li>
              Vet Help Direct — Recognising and Treating Uterine Tumours in
              Rabbits, 2025
            </li>
            <li>House Rabbit Society — Tumors in Rabbits</li>
            <li>Everypaw — Symptoms and Treatment of Rabbit Cancer</li>
          </ul>
          <p className="adenoca-disclaimer">
            Матеріал має ознайомчий характер і не замінює огляд ліцензованого
            ветеринара.
          </p>
        </div>

        <div className="adenoca-related">
          <h3 className="adenoca-related-title">Читайте також</h3>
          <div className="adenoca-related-grid">
            <Link to="/neutering" className="adenoca-related-link">
              ⚕️ Кастрація та стерилізація
            </Link>
            <Link to="/senior-rabbit" className="adenoca-related-link">
              🕰️ Кролик похилого віку
            </Link>
            <Link to="/mastitis" className="adenoca-related-link">
              🍼 Мастит
            </Link>
          </div>
        </div>

        <div className="adenoca-back">
          <Link to="/" className="adenoca-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Аденокарцинома матки у кролиць" />
        </div>
      </div>
    </main>
  );
};

export default UterineAdenocarcinoma;
