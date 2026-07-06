import { useState } from "react";
import { Link } from "react-router-dom";
import "./SmartFarm.css";

interface CycleStep {
  step: string;
  title: string;
  text: string;
}

interface Side {
  title: string;
  items: string[];
}

interface Myth {
  claim: string;
  truth: string;
}

const cycle: CycleStep[] = [
  {
    step: "01",
    title: "Спостереження",
    text: "Датчики мікроклімату, камера й записи в програмі обліку безперервно збирають дані — температуру, вологість, аміак, вагу, дати окролів.",
  },
  {
    step: "02",
    title: "Діагностика",
    text: "Система чи людина порівнює поточні показники з нормою і помічає відхилення: перевищення порогу аміаку, відставання молодняку у вазі, пропущену вакцинацію.",
  },
  {
    step: "03",
    title: "Рішення",
    text: "На основі відхилення приймають рішення — увімкнути вентиляцію, оглянути конкретну клітку, скоригувати раціон. У малому господарстві це рішення ухвалює людина, у великому — частково автоматика.",
  },
  {
    step: "04",
    title: "Дія",
    text: "Вентилятор вмикається, годівниця дозує корм, господар отримує нагадування в застосунку — цикл завершується дією і починається знову з нового спостереження.",
  },
];

const sides: Side[] = [
  {
    title: "Що реально дає інтеграція",
    items: [
      "Менше часу на рутинні перевірки — дані вже зібрані, залишається лише реагувати",
      "Рішення на основі трендів за тижні й місяці, а не одноразового спостереження",
      "Раніше помітні відхилення — до того, як вони стануть проблемою",
      "Один телефон замість обходу кожного приладу окремо",
    ],
  },
  {
    title: "Реальні складнощі, про які варто знати",
    items: [
      "Початкові вкладення в обладнання окупаються не одразу",
      "Прилади різних виробників рідко об'єднуються в одну програму без додаткових налаштувань",
      "Слабкий інтернет у сільській місцевості обмежує частину функцій до локального режиму",
      "Комусь у господарстві доведеться розбиратися в налаштуванні й обслуговуванні системи",
    ],
  },
];

const myths: Myth[] = [
  {
    claim: "Смарт-ферма — це одна універсальна програма для всього",
    truth:
      "На практиці більшість господарств використовують кілька окремих застосунків — для клімату, обліку, камери, — які просто повідомляють на один телефон. Це нормальний робочий варіант, а не недороблена інтеграція.",
  },
  {
    claim: "Повна автоматизація виправдана лише для великих ферм",
    truth:
      "Це правда для повної інтеграції всіх систем одразу. Але окремі елементи — один датчик аміаку чи камера над маточником — окупаються й у невеликому господарстві, якщо вирішують справді болючу проблему.",
  },
  {
    claim: "Без стабільного інтернету технології марні",
    truth:
      "Частина обладнання працює локально й синхронізується при появі зв'язку. Втрачається лише частина віддалених сповіщень, а не функціональність приладу загалом.",
  },
  {
    claim: "Автоматика з часом повністю замінить людину на фермі",
    truth:
      "Технології змінюють, які саме рішення приймає людина, а не скасовують потребу в ній: оцінка стану тварини, тонкі корективи раціону чи розведення й далі залишаються за господарем.",
  },
];

export default function SmartFarm() {
  const [openMyth, setOpenMyth] = useState<number | null>(0);

  return (
    <div className="sf-page">
      <header className="sf-hero">
        <h1 className="sf-title">
          Смарт-ферма: інтеграція систем
          <span className="sf-title-accent">куди рухається галузь</span>
        </h1>
        <p className="sf-lede">
          Годівля, мікроклімат, облік і відеонагляд — кожен окремо вже
          автоматизується. Наступний крок — коли ці системи працюють разом, а не
          як набір розрізнених пристроїв.
        </p>
      </header>

      <section className="sf-cycle" aria-label="Як працює інтегрована система">
        <h2 className="sf-section-heading">Як це працює на практиці</h2>
        <div className="sf-cycle-grid">
          {cycle.map((c) => (
            <article className="sf-cycle-card" key={c.step}>
              <span className="sf-cycle-step">{c.step}</span>
              <h3 className="sf-cycle-title">{c.title}</h3>
              <p className="sf-cycle-text">{c.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="sf-sides" aria-label="Плюси і складнощі">
        <div className="sf-side-grid">
          {sides.map((s) => (
            <div className="sf-side-card" key={s.title}>
              <h3 className="sf-side-title">{s.title}</h3>
              <ul className="sf-side-list">
                {s.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section
        className="sf-note"
        aria-label="Порада для невеликого господарства"
      >
        <p>
          Для невеликого господарства шлях до "смарт-ферми" зазвичай не
          починається з великої платформи. Він починається з одного елемента, що
          вирішує найболючішу проблему, — і поступово доповнюється іншими,
          навіть якщо вони так і залишаться окремими застосунками на одному
          телефоні.
        </p>
      </section>

      <section className="sf-myths" aria-label="Поширені хибні уявлення">
        <h2 className="sf-section-heading">Поширені хибні уявлення</h2>
        <div className="sf-myth-list">
          {myths.map((m, i) => {
            const isOpen = openMyth === i;
            return (
              <div
                className={`sf-myth${isOpen ? " sf-myth--open" : ""}`}
                key={m.claim}
              >
                <button
                  className="sf-myth-trigger"
                  onClick={() => setOpenMyth(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span>{m.claim}</span>
                  <span className="sf-myth-icon">{isOpen ? "–" : "+"}</span>
                </button>
                {isOpen && <p className="sf-myth-truth">{m.truth}</p>}
              </div>
            );
          })}
        </div>
      </section>

      <div className="sf-related">
        <h3 className="sf-related-title">Читайте також</h3>
        <div className="sf-related-grid">
          <Link to="/feeding-automation" className="sf-related-link">
            📲 Автоматизація годівлі та напування
          </Link>
          <Link to="/climate-automation" className="sf-related-link">
            🌡️ Автоматичний контроль мікроклімату
          </Link>
          <Link to="/farm-management-software" className="sf-related-link">
            📊 Програми обліку господарства
          </Link>
          <Link to="/farm-monitoring" className="sf-related-link">
            📷 Відеоспостереження та моніторинг
          </Link>
        </div>
      </div>

      <footer className="sf-footer">
        <p>
          Матеріал підготовлено на основі загальних принципів IoT в сільському
          господарстві. Оскільки це погляд на напрям розвитку, а не готове
          рішення, конкретний набір інструментів варто добирати під масштаб і
          бюджет власного господарства.
        </p>
      </footer>
    </div>
  );
}
