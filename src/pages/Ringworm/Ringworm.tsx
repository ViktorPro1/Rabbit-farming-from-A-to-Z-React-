import { Link } from "react-router-dom";
import "./Ringworm.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const riskFactors = [
  {
    icon: "🐇",
    name: "Молодий вік",
    desc: "Найчастіше уражає молодняк — імунна система ще не повністю розвинена, а шкірний себум містить менше протигрибкових жирних кислот.",
  },
  {
    icon: "👥",
    name: "Скупченість",
    desc: "Висока щільність утримання прискорює передачу спор між тваринами.",
  },
  {
    icon: "😰",
    name: "Ослаблений імунітет чи стрес",
    desc: "Супутні хвороби, недоїдання чи хронічний стрес підвищують сприйнятливість.",
  },
  {
    icon: "🙈",
    name: "Приховане носійство",
    desc: "Кролик може переносити грибок безсимптомно й заражати інших, доки стрес чи хвороба не спровокують видимі ураження.",
  },
];

const Ringworm = () => {
  return (
    <main className="ringworm-page">
      <div className="ringworm-header">
        <h1>🍂 Стригучий лишай (дерматофітоз)</h1>
        <p>
          Грибкова, а не паразитарна інфекція шкіри — і одна з небагатьох
          по-справжньому заразних для людини хвороб кролів
        </p>
      </div>

      <div className="ringworm-wrap">
        <div className="ringworm-intro">
          <h2>Що це таке насправді</h2>
          <p>
            Попри назву "лишай", хворобу викликає не хробак, а кератинофільний
            (такий, що живиться кератином) гриб — найчастіше Trichophyton
            mentagrophytes, рідше Microsporum canis чи інші види. Гриб уражає
            волосяні фолікули й верхній шар шкіри, живлячись кератином шерсті,
            шкіри й кігтів.
          </p>
          <div className="ringworm-alert warn">
            ⚠️ Це зоонозна хвороба — вона реально передається людям (і навпаки),
            на відміну від багатьох інших "страшилок", які насправді
            видоспецифічні. При підозрі на лишай варто дотримуватись базової
            гігієни при контакті з твариною.
          </div>
        </div>

        <div className="ringworm-section-title">⚠️ Фактори ризику</div>
        <div className="ringworm-causes-grid">
          {riskFactors.map((r) => (
            <article key={r.name} className="ringworm-cause-card">
              <div className="ringworm-cause-header">
                <span className="ringworm-cause-icon">{r.icon}</span>
                <h2>{r.name}</h2>
              </div>
              <p className="ringworm-cause-desc">{r.desc}</p>
            </article>
          ))}
        </div>

        <div className="ringworm-section-title">🌡️ Симптоми</div>
        <div className="ringworm-note">
          <ul>
            <li>
              Округлі ділянки випадіння шерсті (алопеція), часто на голові,
              лапах чи навколо кігтів
            </li>
            <li>Почервоніння (еритема) ураженої ділянки</li>
            <li>Сухі, крихкі кірочки й лущення шкіри</li>
            <li>Іноді свербіж, хоча далеко не завжди</li>
            <li>
              У занедбаних випадках — вторинний абсцес шкіри на місці ураження
            </li>
          </ul>
          <p className="ringworm-note-small">
            Важлива особливість: багато кролів є безсимптомними носіями грибка й
            не мають жодних видимих уражень, доки стрес, скупченість чи інша
            хвороба не ослаблять їхній захист.
          </p>
        </div>

        <div className="ringworm-section-title">
          🔬 Відмінність від інших причин випадіння шерсті
        </div>
        <div className="ringworm-alert danger">
          🔴 Округлі плішини самі по собі не є унікальною ознакою саме лишаю —
          схожу картину дають хутровий кліщ, барберинг чи навіть сезонна линька
          (див. статтю "Линька: норма та патологія"). Точний діагноз ставлять
          лише за допомогою лампи Вуда, мікроскопії чи грибкового посіву — на
          око достовірно відрізнити ці причини неможливо.
        </div>

        <div className="ringworm-section-title">💊 Лікування</div>
        <div className="ringworm-note">
          <ul>
            <li>
              Місцеві протигрибкові засоби на уражені ділянки за призначенням
              ветеринара
            </li>
            <li>
              За поширеного ураження — системні протигрибкові препарати
              перорально
            </li>
            <li>
              Обов'язкова дезінфекція середовища — спори грибка стійкі й здатні
              зберігатись у клітці, підстилці та інвентарі довгий час, тому
              лікування самої тварини без обробки оточення часто дає рецидив
            </li>
            <li>
              Ізоляція хворої тварини від інших кролів і обмеження контакту з
              людьми до завершення лікування
            </li>
          </ul>
        </div>

        <div className="ringworm-section-title">🛡️ Профілактика</div>
        <div className="ringworm-facts-grid">
          <div className="ringworm-fact-card ok">
            <h3>✅ Карантин нових тварин</h3>
            <p>
              Огляд і спостереження перед введенням у загальне стадо — багато
              носіїв безсимптомні.
            </p>
          </div>
          <div className="ringworm-fact-card ok">
            <h3>✅ Уникайте скупченості</h3>
            <p>Достатній простір знижує ризик передачі спор між тваринами.</p>
          </div>
          <div className="ringworm-fact-card warn">
            <h3>⚠️ Регулярна дезінфекція</h3>
            <p>
              Особливо важлива після виявлення хоча б одного випадку в
              господарстві.
            </p>
          </div>
        </div>

        <div className="ringworm-note ringworm-sources">
          <h3>Джерела</h3>
          <ul>
            <li>
              Dermatophytosis in Rabbits, Springer Nature (розділ ветеринарного
              видання)
            </li>
            <li>
              Furry Critter Network — Dermatophytosis / Ringworm in Rabbits
            </li>
            <li>ScienceDirect Topics — Dermatophytosis (огляд)</li>
            <li>WabbitWiki — Ringworm</li>
            <li>
              Prevalence and Risk Factors of Zoonotic Dermatophyte Infection in
              Pet Rabbits in Northern Taiwan, PMC
            </li>
          </ul>
          <p className="ringworm-disclaimer">
            Матеріал має ознайомчий характер і не замінює огляд ліцензованого
            ветеринара.
          </p>
        </div>

        <div className="ringworm-related">
          <h3 className="ringworm-related-title">Читайте також</h3>
          <div className="ringworm-related-grid">
            <Link to="/seasonal-molting" className="ringworm-related-link">
              🪮 Линька: норма та патологія
            </Link>
            <Link to="/zoonoses" className="ringworm-related-link">
              🦠 Зоонози
            </Link>
            <Link to="/pyoderma" className="ringworm-related-link">
              🦠 Піодермія
            </Link>
            <Link to="/biosecurity" className="ringworm-related-link">
              🛡️ Біобезпека та карантин
            </Link>
          </div>
        </div>

        <div className="ringworm-back">
          <Link to="/" className="ringworm-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Стригучий лишай (дерматофітоз) у кролів" />
        </div>
      </div>
    </main>
  );
};

export default Ringworm;
