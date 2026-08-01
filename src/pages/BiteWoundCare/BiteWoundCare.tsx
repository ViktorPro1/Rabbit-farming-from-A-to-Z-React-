import { Link } from "react-router-dom";
import "./BiteWoundCare.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const steps = [
  {
    icon: "🧤",
    name: "Розділіть тварин",
    desc: "Якщо укус стався під час бійки — негайно розсадіть кролів, щоб уникнути повторної травми.",
  },
  {
    icon: "🔍",
    name: "Огляньте рану",
    desc: "Оцініть глибину, розмір, наявність кровотечі. Довга шерсть кролів часто приховує справжній розмір ушкодження.",
  },
  {
    icon: "💧",
    name: "Промийте теплою водою",
    desc: "Або фізрозчином. Без спирту, перекису водню чи агресивних антисептиків на відкриту рану.",
  },
  {
    icon: "🩹",
    name: "Легкий тиск при кровотечі",
    desc: "Чистою тканиною, кілька хвилин, якщо кровотеча не зупиняється сама.",
  },
  {
    icon: "🏥",
    name: "Зверніться до ветеринара",
    desc: "Навіть неглибокі укуси часто потребують огляду через високий ризик прихованої інфекції.",
  },
];

const BiteWoundCare = () => {
  return (
    <main className="bitewound-page">
      <div className="bitewound-header">
        <h1>🩹 Перша допомога при укушених ранах</h1>
        <p>
          Чому навіть маленька рана від укусу заслуговує на серйозне ставлення
        </p>
      </div>

      <div className="bitewound-wrap">
        <div className="bitewound-intro">
          <h2>Чому укуси особливо небезпечні</h2>
          <p>
            Укушені рани — від бійок між кролями, укусів інших тварин чи навіть
            щурів — небезпечні не стільки самим ушкодженням шкіри, скільки
            високим ризиком прихованої інфекції. Зуби заносять бактерії глибоко
            в тканину, а невеликий отвір на шкірі часто закривається швидше, ніж
            встигає очиститись глибша порожнина рани — це створює ідеальні умови
            для розвитку абсцесу.
          </p>
          <div className="bitewound-alert danger">
            🔴 Саме укуси — одна з найпоширеніших причин абсцесів у кролів (див.
            відповідну статтю). Рана, що виглядає незначною зовні, може
            приховувати серйозне ушкодження тканини під шкірою.
          </div>
        </div>

        <div className="bitewound-section-title">
          🚑 Що робити крок за кроком
        </div>
        <div className="bitewound-causes-grid">
          {steps.map((s) => (
            <article key={s.name} className="bitewound-cause-card">
              <div className="bitewound-cause-header">
                <span className="bitewound-cause-icon">{s.icon}</span>
                <h2>{s.name}</h2>
              </div>
              <p className="bitewound-cause-desc">{s.desc}</p>
            </article>
          ))}
        </div>

        <div className="bitewound-section-title">⚠️ Чого не варто робити</div>
        <div className="bitewound-note">
          <ul>
            <li>
              Не застосовуйте людські антисептики (йод, спирт, перекис водню)
              безпосередньо на відкриту рану без вказівки ветеринара — вони
              можуть пошкодити здорову тканину й сповільнити загоєння
            </li>
            <li>
              Не зашивайте й не заклеюйте рану самостійно — закрита рана без
              належної обробки підвищує ризик абсцесу
            </li>
            <li>
              Не ігноруйте "маленьку" ранку — оцінити справжню глибину під
              густою шерстю самостійно складно
            </li>
          </ul>
        </div>

        <div className="bitewound-section-title">🏥 Що робить ветеринар</div>
        <div className="bitewound-note">
          <p>
            Ветеринар очищує рану належним чином, оцінює глибину ушкодження та
            вирішує, чи потрібні шви, чи рану краще залишити частково відкритою
            для дренажу. За потреби призначають антибіотики й знеболення. Свіжі,
            недавні укушені рани обробляти й лікувати значно простіше й з кращим
            прогнозом, ніж вже сформований абсцес — тому не варто відкладати
            візит "на потім".
          </p>
        </div>

        <div className="bitewound-section-title">🛡️ Профілактика</div>
        <div className="bitewound-facts-grid">
          <div className="bitewound-fact-card ok">
            <h3>✅ Правильне знайомство кролів</h3>
            <p>
              Поступове зведення на нейтральній території знижує ризик
              агресивних бійок.
            </p>
          </div>
          <div className="bitewound-fact-card warn">
            <h3>⚠️ Розсаджування конкуруючих самців</h3>
            <p>Особливо в період статевої активності.</p>
          </div>
          <div className="bitewound-fact-card warn">
            <h3>⚠️ Захист від хижаків і гризунів</h3>
            <p>Міцні клітки й вольєри знижують ризик нападу ззовні.</p>
          </div>
        </div>

        <div className="bitewound-note bitewound-sources">
          <h3>Джерела</h3>
          <ul>
            <li>House Rabbit Network — Abscesses in Rabbits</li>
            <li>
              Merck (MSD) Veterinary Manual — Bacterial and Mycotic Diseases of
              Rabbits
            </li>
          </ul>
          <p className="bitewound-disclaimer">
            Матеріал має ознайомчий характер і не замінює огляд ліцензованого
            ветеринара.
          </p>
        </div>

        <div className="bitewound-related">
          <h3 className="bitewound-related-title">Читайте також</h3>
          <div className="bitewound-related-grid">
            <Link to="/rabbit-abscesses" className="bitewound-related-link">
              🩹 Абсцеси у кролів
            </Link>
            <Link to="/group-housing" className="bitewound-related-link">
              👑 Групове утримання та ієрархія
            </Link>
            <Link to="/first-aid" className="bitewound-related-link">
              🚑 Перша допомога
            </Link>
          </div>
        </div>

        <div className="bitewound-back">
          <Link to="/" className="bitewound-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Перша допомога при укушених ранах у кролів" />
        </div>
      </div>
    </main>
  );
};

export default BiteWoundCare;
