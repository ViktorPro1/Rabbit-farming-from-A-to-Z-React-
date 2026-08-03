import { Link } from "react-router-dom";
import "./Thymoma.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const symptoms = [
  {
    sign: "Утруднене чи прискорене дихання",
    note: "Пухлина тисне на легені й дихальні шляхи зсередини грудної клітки",
  },
  { sign: "Млявість і слабкість", note: "" },
  { sign: "Втрата апетиту й ваги", note: "У міру прогресування хвороби" },
  {
    sign: "Витрішкуватість очей",
    note: "Через порушення відтоку крові з голови при тиску пухлини на судини грудної клітки",
  },
  {
    sign: "Набряк голови чи передніх кінцівок",
    note: "Той самий механізм — синдром здавлення верхньої порожнистої вени",
  },
  {
    sign: "Симптоми, схожі на серцеву недостатність",
    note: "Через тиск пухлини на серце й судини поруч",
  },
];

const Thymoma = () => {
  return (
    <main className="thymoma-page">
      <div className="thymoma-header">
        <h1>🫁 Тимома у кролів</h1>
        <p>
          Рідкісна пухлина загрудинної залози, яка маскується під серцеву чи
          дихальну хворобу
        </p>
      </div>

      <div className="thymoma-wrap">
        <div className="thymoma-intro">
          <h2>Що це таке</h2>
          <p>
            Тимома — пухлина, що росте з тканини тимуса (загрудинної залози),
            органа імунної системи, розташованого в грудній клітці неподалік від
            серця. У кролів тимома трапляється відносно рідко, але є доволі
            типовою знахідкою серед пухлин грудної порожнини цього виду тварин.
          </p>
          <div className="thymoma-alert warn">
            ⚠️ Через розташування біля серця й легенів симптоми тимоми дуже
            легко сплутати з первинною серцевою чи дихальною хворобою — в одному
            задокументованому випадку тимома була виявлена лише на розтині в
            кролика, якого спостерігали із підозрою на дегенеративну хворобу
            серцевого клапана.
          </div>
        </div>

        <div className="thymoma-section-title">🌡️ Симптоми</div>
        <div className="thymoma-table-wrap">
          <table className="thymoma-table">
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

        <div className="thymoma-section-title">🧪 Діагностика</div>
        <div className="thymoma-note">
          <ul>
            <li>
              Рентген грудної клітки — виявляє утворення в передній частині
              грудної порожнини
            </li>
            <li>
              УЗД грудної клітки — деталізує структуру утворення й дозволяє
              провести біопсію під контролем зображення
            </li>
            <li>
              КТ — найточніший метод оцінки розміру й меж пухлини перед
              плануванням лікування
            </li>
            <li>
              Цитологія чи гістологія зразка тканини — для остаточного
              підтвердження діагнозу
            </li>
          </ul>
        </div>

        <div className="thymoma-section-title">💊 Лікування</div>
        <div className="thymoma-note">
          <p>
            Варіанти лікування залежать від розміру пухлини, її меж і загального
            стану тварини:
          </p>
          <ul>
            <li>
              Хірургічне видалення — найбільш ефективний варіант, якщо пухлина
              операбельна й чітко відмежована
            </li>
            <li>
              Променева терапія — альтернатива чи доповнення, коли повне
              хірургічне видалення неможливе
            </li>
            <li>
              Підтримувальна терапія — полегшення симптомів, коли радикальне
              лікування недоступне чи недоцільне
            </li>
          </ul>
          <p className="thymoma-note-small">
            Рання діагностика значно покращує прогноз. Оскільки симптоми
            неспецифічні й легко маскуються під інші хвороби грудної порожнини,
            регулярні профілактичні огляди з аускультацією грудної клітки
            залишаються найкращим способом виявити проблему на ранній стадії.
          </p>
        </div>

        <div className="thymoma-note thymoma-sources">
          <h3>Джерела</h3>
          <ul>
            <li>
              House Rabbit Society — Thymomas in Rabbits: A Comprehensive
              Overview
            </li>
            <li>
              Veterian Key — Cardiovascular Disease, Lymphoproliferative
              Disorders, and Thymomas (глава ветеринарного підручника)
            </li>
            <li>
              Clinical and pathological findings in rabbits with cardiovascular
              disease: 59 cases (2001–2018), JAVMA, 2021 (випадок тимоми серед
              досліджених тварин)
            </li>
          </ul>
          <p className="thymoma-disclaimer">
            Матеріал має ознайомчий характер і не замінює огляд ліцензованого
            ветеринара.
          </p>
        </div>

        <div className="thymoma-related">
          <h3 className="thymoma-related-title">Читайте також</h3>
          <div className="thymoma-related-grid">
            <Link to="/heart-disease" className="thymoma-related-link">
              ❤️ Кардіоміопатія та хвороби серця
            </Link>
            <Link to="/senior-rabbit" className="thymoma-related-link">
              🕰️ Кролик похилого віку
            </Link>
            <Link to="/megaesophagus" className="thymoma-related-link">
              🫁 Мегаезофагус
            </Link>
          </div>
        </div>

        <div className="thymoma-back">
          <Link to="/" className="thymoma-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Тимома у кролів" />
        </div>
      </div>
    </main>
  );
};

export default Thymoma;
