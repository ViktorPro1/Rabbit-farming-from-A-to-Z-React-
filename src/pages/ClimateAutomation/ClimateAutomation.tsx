import { useState } from "react";
import { Link } from "react-router-dom";
import "./ClimateAutomation.css";

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
    icon: "🌡️",
    title: "Датчики температури й вологості",
    text: "Розраховані на широкий діапазон умов приміщення й підвищену вологість — звичайна побутова електроніка в таких умовах швидко виходить з ладу. Показники передаються на контролер безперервно, а не раз на день під час обходу.",
  },
  {
    icon: "🧪",
    title: "Датчик аміаку",
    text: "Аміак накопичується ближче до підлоги і в застійних зонах за перегородками — саме там, де розташовані клітки. Точність показань залежить від висоти монтажу датчика: заміри лише під стелею недооцінюють реальну концентрацію біля тварин.",
  },
  {
    icon: "🔔",
    title: "Контролер зі сповіщеннями",
    text: "Об'єднує покази всіх датчиків і надсилає сповіщення на телефон при перевищенні порогу. Це не замінює обхід приміщення, але дає час відреагувати до того, як проблема стане критичною.",
  },
  {
    icon: "🌀",
    title: "Автоматична вентиляція за порогом",
    text: "Вентилятори чи заслінки вмикаються самостійно при досягненні заданого порогу температури, вологості чи аміаку. Свіже повітря краще подавати зверху, щоб воно встигало перемішатися, перш ніж досягне рівня кліток, — це запобігає протягам просто на тварин.",
  },
];

const steps: Step[] = [
  {
    step: "01",
    title: "Визначити власні порогові значення",
    text: "Універсальних цифр для кролятника з обов'язковою точністю немає — орієнтуються на загальний принцип: чим нижчий рівень аміаку, вологості й перепадів температури, тим краще, і підбирають пороги під конкретне приміщення й щільність поголів'я.",
  },
  {
    step: "02",
    title: "Обрати датчики з відповідним захистом",
    text: "Для вологого, запиленого й аміачного середовища потрібен корпус з високим рівнем захисту від пилу та вологи — побутові версії розраховані на зовсім інші умови й швидко відмовляють.",
  },
  {
    step: "03",
    title: "Розмістити датчик аміаку на рівні тварин",
    text: "Дослідження показують, що концентрація аміаку суттєво падає з висотою — тому датчик під стелею дає оманливо низькі покази. Орієнтир — висота приблизно на рівні кліток, а не верхньої частини приміщення.",
  },
  {
    step: "04",
    title: "Підключити до контролера і протестувати",
    text: "Перш ніж довіряти системі повністю, автоматичну реакцію вентиляції перевіряють вручну кілька разів: чи справді вентилятор вмикається при заданому порозі й чи встигає знизити показники за розумний час.",
  },
  {
    step: "05",
    title: "Плановий огляд обладнання",
    text: "Датчики й вентилятори перевіряють на калібрування, забруднення і знос щонайменше двічі на рік — навесні та восени, перед сезонною зміною навантаження на систему.",
  },
];

const risks: Risk[] = [
  {
    claim: "Одного датчика на все приміщення достатньо",
    truth:
      "Аміак і тепло розподіляються нерівномірно, накопичуючись у застійних зонах за перегородками чи ближче до підлоги. Один датчик під стелею не показує реальні умови біля кліток.",
  },
  {
    claim: "Автоматика повністю замінює обхід приміщення",
    truth:
      "Сповіщення попереджають про перевищення порогу, але не помічають забиту вентиляційну решітку, протяг чи хвору тварину — фізичний огляд лишається обов'язковим.",
  },
  {
    claim: "Запах — досить точний індикатор рівня аміаку",
    truth:
      "Людський нюх швидко адаптується до постійного запаху й перестає його помічати навіть при небезпечній концентрації. Об'єктивні цифри дає лише датчик, а не власне відчуття.",
  },
  {
    claim: "Систему можна не обслуговувати після встановлення",
    truth:
      "Датчики поступово втрачають точність через забруднення й знос — без регулярної перевірки й калібрування система може мовчати навіть за реальної проблеми.",
  },
];

export default function ClimateAutomation() {
  const [openRisk, setOpenRisk] = useState<number | null>(0);

  return (
    <div className="ca-page">
      <header className="ca-hero">
        <h1 className="ca-title">
          Автоматичний контроль мікроклімату
          <span className="ca-title-accent">
            від показань датчика до реакції вентиляції
          </span>
        </h1>
        <p className="ca-lede">
          Температура, вологість і аміак у кролятнику змінюються швидше, ніж
          встигає помітити людина під час одного обходу на день. Автоматика не
          змінює нормативи мікроклімату — вона лише стежить за ними безперервно.
        </p>
      </header>

      <section className="ca-components" aria-label="Складові системи">
        <div className="ca-component-grid">
          {components.map((c) => (
            <article className="ca-component-card" key={c.title}>
              <span className="ca-component-icon" aria-hidden="true">
                {c.icon}
              </span>
              <h2 className="ca-component-title">{c.title}</h2>
              <p className="ca-component-text">{c.text}</p>
            </article>
          ))}
        </div>
      </section>

      <main className="ca-warren" aria-label="Кроки впровадження">
        <h2 className="ca-section-heading">Як налаштувати систему</h2>
        <div className="ca-tunnel" aria-hidden="true" />
        {steps.map((s) => (
          <section className="ca-chamber" key={s.step}>
            <div className="ca-chamber-marker">
              <span className="ca-chamber-step">{s.step}</span>
            </div>
            <div className="ca-chamber-body">
              <h3 className="ca-chamber-title">{s.title}</h3>
              <p className="ca-chamber-text">{s.text}</p>
            </div>
          </section>
        ))}
      </main>

      <section className="ca-risks" aria-label="Хибні уявлення">
        <h2 className="ca-section-heading">Поширені хибні уявлення</h2>
        <div className="ca-risk-list">
          {risks.map((r, i) => {
            const isOpen = openRisk === i;
            return (
              <div
                className={`ca-risk${isOpen ? " ca-risk--open" : ""}`}
                key={r.claim}
              >
                <button
                  className="ca-risk-trigger"
                  onClick={() => setOpenRisk(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span>{r.claim}</span>
                  <span className="ca-risk-icon">{isOpen ? "–" : "+"}</span>
                </button>
                {isOpen && <p className="ca-risk-truth">{r.truth}</p>}
              </div>
            );
          })}
        </div>
      </section>

      <div className="ca-related">
        <h3 className="ca-related-title">Читайте також</h3>
        <div className="ca-related-grid">
          <Link to="/microclimate" className="ca-related-link">
            🌡️ Мікроклімат
          </Link>
          <Link to="/feeding-automation" className="ca-related-link">
            📲 Автоматизація годівлі та напування
          </Link>
          <Link to="/disinfection" className="ca-related-link">
            🧴 Дезінфекція
          </Link>
          <Link to="/farm-monitoring" className="ca-related-link">
            📷 Відеоспостереження та моніторинг
          </Link>
        </div>
      </div>

      <footer className="ca-footer">
        <p>
          Матеріал підготовлено на основі загальних інженерних принципів
          вентиляції та контролю аміаку, застосовуваних у тваринництві. Точні
          порогові значення для конкретного приміщення й густоти поголів'я
          підбирайте індивідуально або за консультацією фахівця з вентиляційних
          систем.
        </p>
      </footer>
    </div>
  );
}
