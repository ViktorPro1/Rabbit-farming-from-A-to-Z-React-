import { Link } from "react-router-dom";
import "./ChronicKidneyDisease.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const causes = [
  {
    icon: "🕰️",
    name: "Похилий вік",
    desc: "Найпоширеніший фактор — нирки поступово втрачають функцію з роками.",
  },
  {
    icon: "🧠",
    name: "Енцефалітозооноз (E. cuniculi)",
    desc: "Одна з найчастіших причин хронічної ниркової недостатності саме у кролів.",
  },
  {
    icon: "🧂",
    name: "Раціон з надлишком кальцію",
    desc: "Тривале навантаження на нирки через особливості обміну кальцію у кролів.",
  },
  {
    icon: "💧",
    name: "Сечокам'яна хвороба чи інфекції",
    desc: "Тривала обструкція чи запалення сечовидільної системи.",
  },
];

const symptoms = [
  {
    sign: "Підвищена спрага і сечовипускання (полідипсія/поліурія)",
    note: "Часто перша помітна ознака",
  },
  {
    sign: "Втрата ваги попри збережений апетит",
    note: "Кролик може добре їсти й худнути",
  },
  { sign: "Млявість, виснаження", note: "" },
  { sign: "Анемія", note: "Виявляється за аналізом крові" },
  {
    sign: "Порушення обміну кальцію й фосфору",
    note: "Видно на рентгені як кальцифікація тканин",
  },
  {
    sign: "Кульгавість",
    note: "Через артрит на тлі порушеного обміну кальцію",
  },
];

const ChronicKidneyDisease = () => {
  return (
    <main className="kidneyckd-page">
      <div className="kidneyckd-header">
        <h1>🩺 Хронічна ниркова недостатність у літніх кролів</h1>
        <p>
          Поступова втрата функції нирок — часто непомітна, поки не зайшла
          далеко
        </p>
      </div>

      <div className="kidneyckd-wrap">
        <div className="kidneyckd-intro">
          <h2>Чому це небезпечно</h2>
          <p>
            Нирки фільтрують токсини з крові, підтримують баланс кальцію й води,
            і виробляють гормон, що стимулює утворення еритроцитів. У кролів, як
            і в багатьох інших видів, нирки часто першими з великих органів
            втрачають достатньо функції, щоб розвинулась хвороба.
          </p>
          <div className="kidneyckd-alert danger">
            🔴 Кролик не може блювати й часто зберігає апетит навіть при
            серйозному ураженні нирок — тому власники нерідко пропускають перші
            ознаки. Ключ до успішного лікування — виявити проблему рано, до того
            як кролик стане дуже хворим.
          </div>
        </div>

        <div className="kidneyckd-section-title">🔍 Найчастіші причини</div>
        <div className="kidneyckd-causes-grid">
          {causes.map((c) => (
            <article key={c.name} className="kidneyckd-cause-card">
              <div className="kidneyckd-cause-header">
                <span className="kidneyckd-cause-icon">{c.icon}</span>
                <h2>{c.name}</h2>
              </div>
              <p className="kidneyckd-cause-desc">{c.desc}</p>
            </article>
          ))}
        </div>

        <div className="kidneyckd-section-title">🌡️ Симптоми</div>
        <div className="kidneyckd-table-wrap">
          <table className="kidneyckd-table">
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

        <div className="kidneyckd-section-title">🧪 Діагностика</div>
        <div className="kidneyckd-note">
          <ul>
            <li>
              Аналіз крові — рівень сечовини, креатиніну, кальцію й фосфору
            </li>
            <li>Загальний аналіз сечі — здатність нирок концентрувати сечу</li>
            <li>
              Рентген — уролітіаз, кальцифікація аорти й нирок часто добре видно
            </li>
            <li>
              Перевірка на E. cuniculi — окрема поширена причина саме хронічної
              форми у кролів
            </li>
          </ul>
        </div>

        <div className="kidneyckd-section-title">💊 Лікування</div>
        <div className="kidneyckd-note">
          <p>
            Спершу лікують те, що піддається лікуванню — антибіотики при
            інфекціях, хірургія чи дієтотерапія при каменях, знеболення при
            артриті.
          </p>
          <p>
            Основа підтримувальної терапії — регулярне введення рідини
            підшкірно, якому власника можна навчити робити вдома. Це допомагає
            ниркам виводити токсини. При ранньому виявленні деякі кролі живуть з
            лікуванням понад рік.
          </p>
        </div>
        <div className="kidneyckd-alert warn">
          ⚠️ Хронічна ниркова недостатність невиліковна, але керована — мета
          лікування не "вилікувати", а уповільнити прогресування й підтримати
          якість життя.
        </div>

        <div className="kidneyckd-section-title">
          🛡️ Профілактика та контроль
        </div>
        <div className="kidneyckd-facts-grid">
          <div className="kidneyckd-fact-card ok">
            <h3>✅ Збалансований раціон з кальцієм</h3>
            <p>Трав'яне сіно замість люцернового, помірна кількість гранул.</p>
          </div>
          <div className="kidneyckd-fact-card ok">
            <h3>✅ Регулярний ветеринарний огляд</h3>
            <p>
              Особливо для кролів старше 4–5 років — аналіз крові раз на рік.
            </p>
          </div>
          <div className="kidneyckd-fact-card warn">
            <h3>⚠️ Своєчасна перевірка на E. cuniculi</h3>
            <p>Особливо якщо є неврологічні прояви чи незрозуміла спрага.</p>
          </div>
        </div>

        <div className="kidneyckd-note kidneyckd-sources">
          <h3>Джерела</h3>
          <ul>
            <li>PetMD — Kidney Failure in Rabbits</li>
            <li>House Rabbit Network — Renal Failure: When Kidneys Give Up</li>
            <li>Diagnosis of renal disease in rabbits, PubMed</li>
            <li>
              Companion Animals Extension — Urinary Tract Diseases in Rabbits:
              Kidney Disease
            </li>
          </ul>
          <p className="kidneyckd-disclaimer">
            Матеріал має ознайомчий характер і не замінює огляд ліцензованого
            ветеринара.
          </p>
        </div>

        <div className="kidneyckd-related">
          <h3 className="kidneyckd-related-title">Читайте також</h3>
          <div className="kidneyckd-related-grid">
            <Link
              to="/encephalitozoon-cuniculi"
              className="kidneyckd-related-link"
            >
              🧠 E. cuniculi
            </Link>
            <Link to="/rabbit-urolithiasis" className="kidneyckd-related-link">
              💧 Сечокам'яна хвороба
            </Link>
            <Link to="/blood-test-reference" className="kidneyckd-related-link">
              🧪 Аналіз крові кролика
            </Link>
            <Link to="/senior-rabbit" className="kidneyckd-related-link">
              🕰️ Кролик похилого віку
            </Link>
          </div>
        </div>

        <div className="kidneyckd-back">
          <Link to="/" className="kidneyckd-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Хронічна ниркова недостатність у літніх кролів" />
        </div>
      </div>
    </main>
  );
};

export default ChronicKidneyDisease;
