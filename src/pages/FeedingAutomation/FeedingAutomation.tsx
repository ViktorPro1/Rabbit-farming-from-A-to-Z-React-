import { useState } from "react";
import { Link } from "react-router-dom";
import "./FeedingAutomation.css";

interface Component {
  icon: string;
  title: string;
  text: string;
}

interface Step {
  step: string;
  title: string;
  text: string;
}

interface Risk {
  claim: string;
  truth: string;
}

const components: Component[] = [
  {
    icon: "🪣",
    title: "Бункерні годівниці з таймером",
    text: "Автоматизують видачу гранульованого комбікорму за розкладом — це знижує кількість щоденних підходів до кожної клітки. Сіно вони не замінюють: свіжа трава й сіно залишаються ручною частиною раціону, бо жоден дозатор не підтримує їх свіжість і об'єм так, як щоденне поповнення руками.",
  },
  {
    icon: "💧",
    title: "Ніпельні системи з контролем рівня",
    text: "Працюють від резервуара з регулятором тиску, що подає воду по трубках до ніпелів на кожній клітці. Низький тиск у лінії провокує зворотне затягування слини у трубку — тому регулятор і мінімальний робочий тиск підбирають за інструкцією виробника, а не на око.",
  },
  {
    icon: "🎚️",
    title: "Дозатори комбікорму для великого поголів'я",
    text: "На більших фермах комбікорм подають лінією від силосу чи бункера до групи кліток — за принципом, який десятиліттями використовують у промисловому птахівництві. Виправдано це переважно з кількох сотень голів, коли економія часу перекриває вартість обладнання.",
  },
];

const steps: Step[] = [
  {
    step: "01",
    title: "Почати з пілотної ділянки",
    text: "Автоматизацію тестують на кількох клітках, а не на всьому господарстві одразу — так дефекти системи чи помилки монтажу виявляються без ризику для всього поголів'я.",
  },
  {
    step: "02",
    title: "Підібрати тиск і регулятор під систему",
    text: "Ніпельні лінії розраховані на конкретний діапазон робочого тиску. Занадто високий тиск спричиняє протікання, занадто низький — зворотне затягування слини й бактерій у трубку.",
  },
  {
    step: "03",
    title: "Скласти графік промивання",
    text: "Трубки й ніпелі накопичують біоплівку та водорості навіть за візуально чистої води. Періодичне промивання лінії розчином для дезінфекції з наступним рясним споліскуванням запобігає цій проблемі.",
  },
  {
    step: "04",
    title: "Захистити систему від морозу",
    text: "Вода в трубках на вулиці чи в неопалюваному приміщенні замерзає швидше, ніж здається. Обігрівальний кабель на лінії або утеплення труб — обов'язкова частина автоматизації для холодного сезону, а не опція.",
  },
  {
    step: "05",
    title: "Не скасовувати щоденний огляд",
    text: "Автоматика знижує кількість рутинних дій, але не замінює візуальний контроль: помітити хвору тварину, засмічений ніпель чи порожній бункер вчасно може лише людина, яка щодня заходить у приміщення.",
  },
];

const risks: Risk[] = [
  {
    claim: "Автоматизація повністю знімає потребу в щоденному нагляді",
    truth:
      "Обладнання знижує рутинні витрати часу, але не помічає хвору тварину чи засмічений ніпель самостійно — щоденний візуальний огляд лишається обов'язковим.",
  },
  {
    claim: "Ніпельна система не потребує обслуговування, якщо вода чиста",
    truth:
      "Біоплівка й водорості накопичуються в трубках навіть за прозорої на вигляд води. Без регулярного промивання лінії зростає ризик поширення інфекції через спільну систему напування.",
  },
  {
    claim: "Автоматичну годівницю можна лишити без нагляду на тиждень",
    truth:
      "Механічні й акумуляторні дозатори здатні відмовити непередбачувано. Для продуктивного поголів'я це надто великий ризик — навіть з автоматикою потрібен хтось, хто зазирає в господарство щодня.",
  },
  {
    claim: "Взимку систему напування можна залишити без змін",
    truth:
      "Вода в трубках на морозі замерзає значно швидше, ніж у відкритій ємності. Без обігріву чи утеплення лінія перестає подавати воду саме тоді, коли це найнебезпечніше.",
  },
];

export default function FeedingAutomation() {
  const [openRisk, setOpenRisk] = useState<number | null>(0);

  return (
    <div className="fa-page">
      <header className="fa-hero">
        <h1 className="fa-title">
          Автоматизація годівлі та напування
          <span className="fa-title-accent">
            надбудова над ручним доглядом, а не заміна
          </span>
        </h1>
        <p className="fa-lede">
          Бункерні годівниці, ніпельні лінії та дозатори комбікорму звільняють
          час на щоденних підходах до кліток. Але автоматика працює надійно лише
          там, де її правильно розрахували, обслуговують і не покладаються на
          неї повністю.
        </p>
      </header>

      <section className="fa-components" aria-label="Складові автоматизації">
        <div className="fa-component-grid">
          {components.map((c) => (
            <article className="fa-component-card" key={c.title}>
              <span className="fa-component-icon" aria-hidden="true">
                {c.icon}
              </span>
              <h2 className="fa-component-title">{c.title}</h2>
              <p className="fa-component-text">{c.text}</p>
            </article>
          ))}
        </div>
      </section>

      <main className="fa-warren" aria-label="Кроки впровадження">
        <h2 className="fa-section-heading">Як впроваджувати без ризику</h2>
        <div className="fa-tunnel" aria-hidden="true" />
        {steps.map((s) => (
          <section className="fa-chamber" key={s.step}>
            <div className="fa-chamber-marker">
              <span className="fa-chamber-step">{s.step}</span>
            </div>
            <div className="fa-chamber-body">
              <h3 className="fa-chamber-title">{s.title}</h3>
              <p className="fa-chamber-text">{s.text}</p>
            </div>
          </section>
        ))}
      </main>

      <section className="fa-risks" aria-label="Ризики та хибні уявлення">
        <h2 className="fa-section-heading">Що варто знати перед покупкою</h2>
        <div className="fa-risk-list">
          {risks.map((r, i) => {
            const isOpen = openRisk === i;
            return (
              <div
                className={`fa-risk${isOpen ? " fa-risk--open" : ""}`}
                key={r.claim}
              >
                <button
                  className="fa-risk-trigger"
                  onClick={() => setOpenRisk(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span>{r.claim}</span>
                  <span className="fa-risk-icon">{isOpen ? "–" : "+"}</span>
                </button>
                {isOpen && <p className="fa-risk-truth">{r.truth}</p>}
              </div>
            );
          })}
        </div>
      </section>

      <div className="fa-related">
        <h3 className="fa-related-title">Читайте також</h3>
        <div className="fa-related-grid">
          <Link to="/climate-automation" className="fa-related-link">
            🌡️ Автоматичний контроль мікроклімату
          </Link>
          <Link to="/water" className="fa-related-link">
            💧 Водопостачання
          </Link>
          <Link to="/feeders" className="fa-related-link">
            🍜 Годівниці та сінники
          </Link>
          <Link to="/equipment" className="fa-related-link">
            ⚙️ Обладнання
          </Link>
        </div>
      </div>

      <footer className="fa-footer">
        <p>
          Матеріал підготовлено на основі загальних інженерних принципів систем
          напування й годівлі, застосовуваних у птахівництві та кролівництві.
          Конкретні параметри тиску, витрати води й сумісності обладнання
          перевіряйте в специфікації виробника перед монтажем.
        </p>
      </footer>
    </div>
  );
}
