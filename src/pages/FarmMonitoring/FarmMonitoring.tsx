import { useState } from "react";
import { Link } from "react-router-dom";
import "./FarmMonitoring.css";

interface UseCase {
  icon: string;
  title: string;
  text: string;
}

interface Step {
  step: string;
  title: string;
  text: string;
}

interface Myth {
  claim: string;
  truth: string;
}

const useCases: UseCase[] = [
  {
    icon: "🌙",
    title: "Нічний контроль окролу",
    text: "Кроляться переважно в темний час доби, а самки годують молодняк здебільшого на світанку й у сутінках. Камера показує момент окролу й перше годування, не вимагаючи фізичної присутності людини вночі біля клітки.",
  },
  {
    icon: "🍼",
    title: "Спостереження без турбування самки",
    text: "Перша година після окролу — час, коли самку найкраще не чіпати: вона вилизує кроленят і починає годувати. Камера дозволяє переконатися, що все гаразд, саме тим 'тихим поглядом здалеку', який і рекомендують досвідчені кролівники — без відкривання клітки.",
  },
  {
    icon: "🦊",
    title: "Захист від хижаків уночі",
    text: "Присутність хижака поруч із маточником — один із реальних факторів, що провокує самку покинути приплід. Камера з рухомим сповіщенням попереджає про непрохане гостя раніше, ніж це стане непоправною втратою.",
  },
  {
    icon: "📱",
    title: "Загальний огляд господарства віддалено",
    text: "Перевірити, чи все спокійно в кролятнику, не виходячи з дому чи перебуваючи поза господарством — актуально під час короткої відсутності чи в межах великого приміщення з кількома рядами кліток.",
  },
];

const steps: Step[] = [
  {
    step: "01",
    title: "Розмістити камеру так, щоб бачити маточник",
    text: "Кут огляду обирають так, щоб зона гніздування потрапляла в кадр без потреби підходити ближче — саме це і є метою: бачити, не турбуючи.",
  },
  {
    step: "02",
    title: "Пріоритет — нічне бачення, а не декоративні функції",
    text: "Для кролятника критична характеристика — якість зображення в темряві, оскільки більшість важливих подій відбувається саме вночі. Роздільна здатність і формат запису — другорядні порівняно з цим.",
  },
  {
    step: "03",
    title: "Обрати корпус, стійкий до вологи й аміаку",
    text: "Побутові камери для дому розраховані на зовсім інші умови. У вологому й аміачному середовищі кролятника потрібен захищений, вологостійкий корпус, інакше електроніка вийде з ладу значно швидше заявленого терміну.",
  },
  {
    step: "04",
    title: "Налаштувати зони сповіщень",
    text: "Без налаштування чутливості камера сповіщає про кожен рух самої тварини в клітці, і за кілька днів такі сповіщення просто перестають помічати. Зони й пороги руху налаштовують так, щоб важливі події не губилися серед постійного шуму.",
  },
  {
    step: "05",
    title: "Не скасовувати правило приватності після окролу",
    text: "Навіть маючи камеру, першу годину після окролу самку не турбують фізично — спостереження через екран не привід відкривати клітку раніше часу.",
  },
];

const myths: Myth[] = [
  {
    claim: "Камера — привід частіше фізично перевіряти самку руками",
    truth:
      "Цінність камери саме в протилежному: вона дає інформацію без потреби відкривати клітку. Більше фізичних перевірок через наявність камери зводить нанівець головну її перевагу.",
  },
  {
    claim: "Одразу після окролу треба зайти й перевірити гніздо",
    truth:
      "Досвідчені кролівники рекомендують дати самці щонайменше годину повної приватності після окролу — вона вилизує кроленят і починає годувати. Перевірку роблять пізніше, тихо й здалеку.",
  },
  {
    claim: "Запах людини — головна причина, чому самка кидає приплід",
    truth:
      "Вплив людського запаху в цьому питанні часто перебільшують у народних переказах. Реальні фактори ризику — присутність хижака поруч і сильний стрес чи пошкодження гнізда.",
  },
  {
    claim: "Звичайна побутова вебкамера підійде так само добре",
    truth:
      "Вологість і аміак у кролятнику швидко виводять з ладу електроніку, не розраховану на такі умови. Для тваринницьких приміщень обирають камери з відповідним захищеним корпусом.",
  },
];

export default function FarmMonitoring() {
  const [openMyth, setOpenMyth] = useState<number | null>(0);

  return (
    <div className="vm-page">
      <header className="vm-hero">
        <h1 className="vm-title">
          Відеоспостереження та моніторинг
          <span className="vm-title-accent">бачити, не турбуючи</span>
        </h1>
        <p className="vm-lede">
          Найважливіші події в кролятнику — окріл і перше годування — часто
          відбуваються вночі, коли фізична перевірка шкодить більше, ніж
          допомагає. Камера дає ту саму інформацію без відкритої клітки.
        </p>
      </header>

      <section
        className="vm-usecases"
        aria-label="Де камера дає найбільшу користь"
      >
        <div className="vm-usecase-grid">
          {useCases.map((u) => (
            <article className="vm-usecase-card" key={u.title}>
              <span className="vm-usecase-icon" aria-hidden="true">
                {u.icon}
              </span>
              <h2 className="vm-usecase-title">{u.title}</h2>
              <p className="vm-usecase-text">{u.text}</p>
            </article>
          ))}
        </div>
      </section>

      <main className="vm-warren" aria-label="Кроки налаштування">
        <h2 className="vm-section-heading">Як налаштувати правильно</h2>
        <div className="vm-tunnel" aria-hidden="true" />
        {steps.map((s) => (
          <section className="vm-chamber" key={s.step}>
            <div className="vm-chamber-marker">
              <span className="vm-chamber-step">{s.step}</span>
            </div>
            <div className="vm-chamber-body">
              <h3 className="vm-chamber-title">{s.title}</h3>
              <p className="vm-chamber-text">{s.text}</p>
            </div>
          </section>
        ))}
      </main>

      <section className="vm-myths" aria-label="Поширені хибні уявлення">
        <h2 className="vm-section-heading">Поширені хибні уявлення</h2>
        <div className="vm-myth-list">
          {myths.map((m, i) => {
            const isOpen = openMyth === i;
            return (
              <div
                className={`vm-myth${isOpen ? " vm-myth--open" : ""}`}
                key={m.claim}
              >
                <button
                  className="vm-myth-trigger"
                  onClick={() => setOpenMyth(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span>{m.claim}</span>
                  <span className="vm-myth-icon">{isOpen ? "–" : "+"}</span>
                </button>
                {isOpen && <p className="vm-myth-truth">{m.truth}</p>}
              </div>
            );
          })}
        </div>
      </section>

      <div className="vm-related">
        <h3 className="vm-related-title">Читайте також</h3>
        <div className="vm-related-grid">
          <Link to="/okril" className="vm-related-link">
            🍼 Окріл
          </Link>
          <Link to="/predators" className="vm-related-link">
            🦊 Хижаки та шкідники
          </Link>
          <Link to="/climate-automation" className="vm-related-link">
            🌡️ Автоматичний контроль мікроклімату
          </Link>
          <Link to="/smart-farm" className="vm-related-link">
            🐇 Смарт-ферма: інтеграція систем
          </Link>
        </div>
      </div>

      <footer className="vm-footer">
        <p>
          Матеріал підготовлено на основі загальних принципів відеоспостереження
          у тваринництві та практики окролу в кролівництві. Камера доповнює
          догляд, а не замінює регулярний фізичний огляд господарства в денний
          час.
        </p>
      </footer>
    </div>
  );
}
