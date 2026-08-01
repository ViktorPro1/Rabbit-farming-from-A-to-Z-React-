import { Link } from "react-router-dom";
import "./OtitisMediaInterna.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const comparisonData = [
  {
    param: "Причина",
    ec: "Паразит (мікроспоридія)",
    otitis: "Бактерія (частіше Pasteurella multocida)",
  },
  {
    param: "Початок хвороби",
    ec: "Частіше гостріший",
    otitis: "Частіше поступовий, підгострий-хронічний",
  },
  {
    param: "Основна діагностика",
    ec: "Аналіз крові на антитіла",
    otitis: "КТ голови, рентген черепа",
  },
  {
    param: "Основне лікування",
    ec: "Фенбендазол 28 днів",
    otitis: "Антибіотики (напр. енрофлоксацин)",
  },
  {
    param: "Частота серед випадків нахилу голови",
    ec: "~42% випадків",
    otitis: "~22% випадків (ще ~36% — поєднання обох)",
  },
];

const OtitisMediaInterna = () => {
  return (
    <main className="otitis-page">
      <div className="otitis-header">
        <h1>👂 Отит середнього та внутрішнього вуха</h1>
        <p>
          Друга за частотою причина нахилу голови у кролів — і її часто плутають
          з E. cuniculi
        </p>
      </div>

      <div className="otitis-wrap">
        <div className="otitis-intro">
          <h2>Чому важливо не переплутати</h2>
          <p>
            Нахил голови (вестибулярний синдром) у кролів найчастіше має дві
            основні причини: паразитарну інфекцію E. cuniculi та бактеріальний
            отит середнього/внутрішнього вуха. За даними великого
            ретроспективного дослідження 73 випадків нахилу голови у кролів у
            Великій Британії, E. cuniculi підтвердили у 41,7% випадків, отит — у
            22,2%, а поєднання обох одночасно — ще у 36,1%.
          </p>
          <div className="otitis-alert danger">
            🔴 Ці дві хвороби потребують принципово різного лікування —
            протипаразитарного проти антибактеріального. Лікування "навмання"
            без діагностики може не спрацювати саме тому, що лікується не та
            причина (або, як показує статистика, обидві причини присутні
            одночасно).
          </div>
        </div>

        <div className="otitis-section-title">
          ⚖️ E. cuniculi проти отиту: порівняння
        </div>
        <div className="otitis-table-wrap">
          <table className="otitis-table">
            <thead>
              <tr>
                <th>Параметр</th>
                <th>E. cuniculi</th>
                <th>Отит середнього/внутрішнього вуха</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((r) => (
                <tr key={r.param}>
                  <td>
                    <strong>{r.param}</strong>
                  </td>
                  <td>{r.ec}</td>
                  <td>{r.otitis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="otitis-section-title">🌡️ Симптоми отиту</div>
        <div className="otitis-note">
          <ul>
            <li>Нахил голови, зазвичай у бік ураженого вуха</li>
            <li>
              Періодичне похитування чи труcіння головою (при отиті середнього
              вуха без ускладнення)
            </li>
            <li>Ністагм (посмикування очей)</li>
            <li>Втрата рівноваги, перекочування, кружляння</li>
            <li>Глухота на ураженому вусі</li>
            <li>
              Часто ознаки виникають без видимих зовнішніх симптомів запалення —
              за даними досліджень, кролі з гнійним отитом середнього вуха
              нерідко не показують жодних зовнішніх ознак інфекції до появи
              неврологічних симптомів
            </li>
          </ul>
        </div>

        <div className="otitis-section-title">🧪 Діагностика</div>
        <div className="otitis-note">
          <ul>
            <li>Огляд слухового каналу отоскопом</li>
            <li>
              Рентген черепа — може показати заповнені гноєм барабанні були,
              хоча негативний результат не виключає хворобу
            </li>
            <li>
              КТ голови — найточніший метод для підтвердження й оцінки поширення
            </li>
            <li>
              Аналіз крові на E. cuniculi — для виключення чи підтвердження
              супутньої причини
            </li>
          </ul>
        </div>

        <div className="otitis-section-title">💊 Лікування</div>
        <div className="otitis-note">
          <p>
            Оскільки дві причини часто поєднуються, а їх складно достовірно
            розрізнити без повного обстеження, лікування нерідко починають
            одночасно за обома напрямками: пероральний фенбендазол проти E.
            cuniculi та антибіотики (наприклад, енрофлоксацин) проти
            бактеріального отиту. Додатково застосовують знеболення —
            мелоксикам, за даними досліджень, пов'язаний з поліпшенням клінічних
            ознак.
          </p>
          <p>
            У важких чи хронічних випадках, коли консервативне лікування не дає
            результату, розглядають хірургічне втручання (наприклад, остектомію
            барабанної булли).
          </p>
        </div>
        <div className="otitis-alert warn">
          ⚠️ За даними того ж дослідження, залишковий нахил голови зберігався у
          66,7% випадків навіть після лікування, а рецидив вестибулярних
          симптомів стався у 42,1%. Це означає, що навіть за успішного контролю
          інфекції легкий нахил голови може лишитись на все життя — сам по собі
          він не завжди означає, що лікування не спрацювало.
        </div>

        <div className="otitis-section-title">
          🏠 Догляд удома під час вестибулярних симптомів
        </div>
        <div className="otitis-note">
          <ul>
            <li>
              Приберіть гострі предмети з клітки — кролик може падати чи
              перекочуватись
            </li>
            <li>Забезпечте м'яку підстилку (рушники) з усіх боків</li>
            <li>Обмежте висоту, з якої кролик може впасти</li>
            <li>
              Допомагайте з їжею й водою, якщо кролик не може дотягнутись через
              порушену координацію
            </li>
          </ul>
        </div>

        <div className="otitis-note otitis-sources">
          <h3>Джерела</h3>
          <ul>
            <li>
              Liatis T. et al. — Otitis media/interna and encephalitozoonosis
              are the most common causes of head tilt in pet rabbits in the UK:
              73 cases (2009–2020), Veterinary Record, 2024
            </li>
            <li>
              Vet Times — Diagnosis of otitis externa, media and interna in
              rabbits
            </li>
            <li>dvm360 — Head tilts in rabbits (Proceedings)</li>
            <li>Veterinary Partner (VIN) — Head Tilt in Pet Rabbits</li>
          </ul>
          <p className="otitis-disclaimer">
            Матеріал має ознайомчий характер і не замінює огляд ліцензованого
            ветеринара.
          </p>
        </div>

        <div className="otitis-related">
          <h3 className="otitis-related-title">Читайте також</h3>
          <div className="otitis-related-grid">
            <Link
              to="/encephalitozoon-cuniculi"
              className="otitis-related-link"
            >
              🧠 E. cuniculi
            </Link>
            <Link to="/parasites" className="otitis-related-link">
              🦟 Паразити (вушний кліщ)
            </Link>
            <Link to="/pain-management" className="otitis-related-link">
              🩹 Знеболення
            </Link>
          </div>
        </div>

        <div className="otitis-back">
          <Link to="/" className="otitis-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Отит середнього та внутрішнього вуха у кролів" />
        </div>
      </div>
    </main>
  );
};

export default OtitisMediaInterna;
