import { Link } from "react-router-dom";
import "./DnaTesting.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const uses = [
  {
    icon: "👨‍👩‍👧",
    name: "Підтвердження батьківства",
    desc: "Якщо в одному вольєрі перебували кілька самців, або самка контактувала з іншим самцем до контрольної в'язки.",
  },
  {
    icon: "📜",
    name: "Перевірка чистопородності",
    desc: "Підтвердження походження від заявлених племінних ліній, особливо при купівлі дорогого молодняку.",
  },
  {
    icon: "🔍",
    name: "Виявлення прихованого інбридингу",
    desc: "Оцінка фактичного рівня спорідненого схрещування, якщо паперові записи неповні.",
  },
  {
    icon: "💰",
    name: "Продаж племінного молодняку",
    desc: "Генетичне підтвердження підвищує довіру покупця при онлайн чи міжрегіональних продажах.",
  },
];

const DnaTesting = () => {
  return (
    <main className="dnatest-page">
      <div className="dnatest-header">
        <h1>🔬 ДНК-тест на породність і батьківство</h1>
        <p>Коли паперовий родовід варто підкріпити генетичним підтвердженням</p>
      </div>

      <div className="dnatest-wrap">
        <div className="dnatest-intro">
          <h2>Як це працює</h2>
          <p>
            Кожен кроленя отримує половину генетичного матеріалу від матері й
            половину від батька. Лабораторія порівнює набір генетичних маркерів
            у передбачуваних батьків і кроленяти — якщо вони узгоджуються,
            батьківство підтверджується.
          </p>
          <p>
            У тваринництві традиційно використовують мікросателітні маркери
            (STR), рекомендовані міжнародними стандартами (ISAG). Дедалі частіше
            застосовують і SNP-панелі, які дозволяють одночасно перевіряти
            маркери здоров'я чи забарвлення.
          </p>
          <div className="dnatest-alert ok">
            ✅ ДНК-тест не замінює ведення родоводів, а доповнює його — це
            інструмент перевірки й підтвердження того, що вже записано.
          </div>
        </div>

        <div className="dnatest-section-title">
          🎯 Для чого це потрібно кролівнику
        </div>
        <div className="dnatest-causes-grid">
          {uses.map((u) => (
            <article key={u.name} className="dnatest-cause-card">
              <div className="dnatest-cause-header">
                <span className="dnatest-cause-icon">{u.icon}</span>
                <h2>{u.name}</h2>
              </div>
              <p className="dnatest-cause-desc">{u.desc}</p>
            </article>
          ))}
        </div>

        <div className="dnatest-section-title">
          📋 Що варто знати перед замовленням
        </div>
        <div className="dnatest-note">
          <ul>
            <li>
              Зразок беруть мазком з внутрішньої поверхні щоки — неінвазивно,
              без участі ветеринара
            </li>
            <li>Потрібні зразки не лише кроленяти, а й обох батьків</li>
            <li>
              Доступність тестів для кролів менш стандартизована, ніж для собак
              чи коней — уточнюйте валідовану панель у лабораторії
            </li>
            <li>
              Результат не оцінює зовнішні породні ознаки чи стандарт екстер'єру
            </li>
          </ul>
        </div>

        <div className="dnatest-note dnatest-sources">
          <h3>Джерела</h3>
          <ul>
            <li>
              International Society for Animal Genetics (ISAG) — рекомендації
              щодо панелей маркерів для встановлення батьківства
            </li>
            <li>
              Порівняльні дослідження STR/SNP-маркерів для встановлення
              батьківства у сільськогосподарських тварин
            </li>
          </ul>
          <p className="dnatest-disclaimer">
            Матеріал має ознайомчий характер. Уточнюйте у лабораторії
            валідованість панелі маркерів для кролів.
          </p>
        </div>

        <div className="dnatest-related">
          <h3 className="dnatest-related-title">Читайте також</h3>
          <div className="dnatest-related-grid">
            <Link to="/pedigree-records" className="dnatest-related-link">
              📖 Родоводи та племінний облік
            </Link>
            <Link to="/lethal-color-genes" className="dnatest-related-link">
              ⚠️ Небезпечні поєднання генів
            </Link>
          </div>
        </div>

        <div className="dnatest-back">
          <Link to="/" className="dnatest-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="ДНК-тест на породність і батьківство" />
        </div>
      </div>
    </main>
  );
};

export default DnaTesting;
