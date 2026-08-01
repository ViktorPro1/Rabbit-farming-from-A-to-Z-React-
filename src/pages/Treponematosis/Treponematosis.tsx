import { Link } from "react-router-dom";
import "./Treponematosis.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const transmission = [
  {
    icon: "💕",
    name: "Парування",
    desc: "Найпоширеніший шлях передачі — пряма венерична інфекція.",
  },
  {
    icon: "🤝",
    name: "Прямий контакт",
    desc: "Дотик до активних виразок під час грумінгу чи близького контакту.",
  },
  {
    icon: "🍼",
    name: "Від матері до кроленят",
    desc: "Під час пологів, проходячи через родові шляхи.",
  },
];

const symptoms = [
  {
    sign: "Почервоніння, набряк навколо статевих органів",
    note: "Найчастіша локалізація",
  },
  { sign: "Дрібні пухирці на початковій стадії", note: "" },
  { sign: "Кірки, виразки, лущення шкіри", note: "Після розриву пухирців" },
  {
    sign: "Ураження навколо ануса, губ, носа, повік",
    note: "Через занесення бактерії при грумінгу",
  },
  { sign: "Аборт, важкі чи затяжні пологи", note: "У племінних самок" },
  {
    sign: "Загальний стан майже не змінюється",
    note: "Кролик зазвичай їсть і поводиться нормально",
  },
];

const Treponematosis = () => {
  return (
    <main className="treponema-page">
      <div className="treponema-header">
        <h1>🔬 Трепонематоз (сифіліс кролів)</h1>
        <p>
          Венерична, видоспецифічна хвороба — не небезпечна для людини, але
          критична для розведення
        </p>
      </div>

      <div className="treponema-wrap">
        <div className="treponema-intro">
          <h2>Що це таке</h2>
          <p>
            Трепонематоз (кроляча "vent disease") викликається спірохетою
            Treponema paraluiscuniculi — видоспецифічним збудником, окремим від
            людського збудника сифілісу. Хвороба здебільшого не завдає шкоди
            загальному самопочуттю тварини: інфіковані кролі зазвичай добре
            їдять і поводяться нормально, попри видимі ураження шкіри.
          </p>
          <div className="treponema-alert ok">
            ✅ Ця хвороба видоспецифічна — вона не передається людям, собакам,
            котам чи іншим видам тварин. Можна безпечно доглядати за хворим
            кроликом за звичайної гігієни.
          </div>
        </div>

        <div className="treponema-section-title">🔄 Шляхи передачі</div>
        <div className="treponema-causes-grid">
          {transmission.map((t) => (
            <article key={t.name} className="treponema-cause-card">
              <div className="treponema-cause-header">
                <span className="treponema-cause-icon">{t.icon}</span>
                <h2>{t.name}</h2>
              </div>
              <p className="treponema-cause-desc">{t.desc}</p>
            </article>
          ))}
        </div>
        <div className="treponema-note">
          <p>
            Інкубаційний період може тривати до 10–16 тижнів. Хвороба здатна
            перебігати приховано — носій може виглядати здоровим і заражувати
            інших до появи видимих уражень, особливо в періоди стресу чи
            активного розведення.
          </p>
        </div>

        <div className="treponema-section-title">🌡️ Симптоми</div>
        <div className="treponema-table-wrap">
          <table className="treponema-table">
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

        <div className="treponema-section-title">🧪 Діагностика</div>
        <div className="treponema-note">
          <ul>
            <li>Фізичний огляд характерних уражень і історія хвороби</li>
            <li>
              Зішкріб шкіри чи біопсія — виявлення бактерії темнопольовою
              мікроскопією
            </li>
            <li>Аналіз крові на антитіла</li>
          </ul>
        </div>

        <div className="treponema-section-title">💊 Лікування</div>
        <div className="treponema-note">
          <p>
            Основне лікування — курс ін'єкцій пеніциліну (зазвичай раз на
            тиждень протягом 2–3 тижнів). Прогноз при своєчасному лікуванні дуже
            хороший.
          </p>
          <p>
            Місцево уражені ділянки тримають чистими й сухими, іноді додатково
            застосовують топічний антибіотик для прискорення загоєння.
          </p>
        </div>
        <div className="treponema-alert danger">
          🔴 Пеніцилін кролям можна вводити ЛИШЕ ін'єкційно — пероральний
          пеніцилін небезпечний і може спричинити смертельну ентеротоксемію. На
          час лікування самки кроленят, що годуються, тимчасово відлучають від
          матері, щоб знизити ризик для них.
        </div>
        <div className="treponema-alert warn">
          ⚠️ Якщо в господарстві є кілька кролів, усі контактні тварини
          потребують лікування чи хоча б обстеження — навіть за відсутності
          видимих симптомів, оскільки хвороба може перебігати приховано.
        </div>

        <div className="treponema-section-title">🛡️ Профілактика</div>
        <div className="treponema-facts-grid">
          <div className="treponema-fact-card ok">
            <h3>✅ Карантин нових тварин</h3>
            <p>
              Огляд перед введенням у стадо, особливо перед плановою в'язкою.
            </p>
          </div>
          <div className="treponema-fact-card warn">
            <h3>⚠️ Огляд перед кожним паруванням</h3>
            <p>Перевіряйте статеві органи самців і самок на ознаки уражень.</p>
          </div>
          <div className="treponema-fact-card warn">
            <h3>⚠️ Ізоляція хворих тварин</h3>
            <p>До завершення повного курсу лікування.</p>
          </div>
        </div>

        <div className="treponema-note treponema-sources">
          <h3>Джерела</h3>
          <ul>
            <li>
              Jekl V. et al. — Penicillin Treatment Failure in Rabbit Syphilis
              Due to the Persistence of Treponemes, Frontiers in Veterinary
              Science, 2021
            </li>
            <li>
              PetMD — Sexually Transmitted Bacterial Infections in Rabbits
            </li>
            <li>WabbitWiki — Rabbit syphilis</li>
            <li>BrampVet Care — Rabbit Syphilis or Treponematosis</li>
          </ul>
          <p className="treponema-disclaimer">
            Матеріал має ознайомчий характер і не замінює огляд ліцензованого
            ветеринара.
          </p>
        </div>

        <div className="treponema-related">
          <h3 className="treponema-related-title">Читайте також</h3>
          <div className="treponema-related-grid">
            <Link to="/biosecurity" className="treponema-related-link">
              🛡️ Біобезпека та карантин
            </Link>
            <Link to="/mating-behavior" className="treponema-related-link">
              🐇 Поведінка при злучці
            </Link>
            <Link to="/drug-compatibility" className="treponema-related-link">
              ⚗️ Сумісність препаратів
            </Link>
          </div>
        </div>

        <div className="treponema-back">
          <Link to="/" className="treponema-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Трепонематоз (сифіліс кролів)" />
        </div>
      </div>
    </main>
  );
};

export default Treponematosis;
