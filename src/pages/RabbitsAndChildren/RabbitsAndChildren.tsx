import { useState } from "react";
import { Link } from "react-router-dom";
import "./RabbitsAndChildren.css";

interface Risk {
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

const risks: Risk[] = [
  {
    icon: "🪂",
    title: "Падіння з висоти",
    text: "Кролик — здобич за природою і панічно пручається, коли відчуває, що не контролює ситуацію в повітрі. Різкий ривок на руках у дитини легко закінчується падінням і травмою хребта чи кінцівок у самого кролика.",
  },
  {
    icon: "🩹",
    title: "Подряпини від кігтів",
    text: "Більшість подряпин трапляється не через злість, а через ті самі спроби вирватися з рук — задні лапи з гострими кігтями відштовхуються від будь-якої опори, включно з руками дитини.",
  },
  {
    icon: "😬",
    title: "Укус як сигнал, а не напад",
    text: "Легкий укус найчастіше означає 'відпусти' чи 'мені боляче' — попередження, а не агресію. Кролик рідко кусає без попереднього сигналу, який просто не був поміченим.",
  },
  {
    icon: "😰",
    title: "Стрес від надмірної уваги",
    text: "Бажання дитини постійно брати кролика на руки, тягнути за собою чи будити — виснажує тварину навіть без жодної травми: хронічний стрес позначається на апетиті й поведінці не одразу.",
  },
];

const steps: Step[] = [
  {
    step: "01",
    title: "Спочатку — гра на підлозі, а не на руках",
    text: "Найбезпечніший і водночас найприємніший для обох формат знайомства — дитина сідає на підлогу, а кролик сам підходить чи ні. Це прибирає головний ризик — падіння з висоти — ще до того, як він з'явився.",
  },
  {
    step: "02",
    title: "Як правильно піднімати, якщо це необхідно",
    text: "Одна рука підтримує груди, друга обов'язково — задню частину тіла: кролик не повинен звисати, відчуваючи, що йому нема на що спертися. Ніколи не тримають за вуха чи за шкіру на загривку.",
  },
  {
    step: "03",
    title: "Навчити читати мову тіла",
    text: "Притиснуті вуха, тупотіння лапою, спроба забитися в кут — сигнали 'досить' задовго до укусу чи подряпини. Дитину вчать помічати їх і одразу опускати кролика чи відступати.",
  },
  {
    step: "04",
    title: "Коротко й часто, а не довго й один раз",
    text: "Кілька п'ятихвилинних контактів протягом дня зазвичай приємніші для кролика, ніж одна довга сесія, під час якої тварина не має можливості відпочити від уваги.",
  },
  {
    step: "05",
    title: "Дорослий поруч завжди",
    text: "Навіть коли дитина вже знає правила, дорослий лишається поруч, щоб зупинити ситуацію на етапі сигналу, а не після того, як сталася подряпина чи укус.",
  },
];

const myths: Myth[] = [
  {
    claim:
      "Кролик — ідеальна перша тварина для маленької дитини, бо він маленький",
    truth:
      "Розмір оманливий: на відміну від собак, більшість кролів не люблять, коли їх носять і стискають, а саме цього найчастіше хоче маленька дитина. Це джерело стресу для обох, а не перевага.",
  },
  {
    claim: "Укус кролика — це прояв злого характеру тварини",
    truth:
      "Найчастіше укус — крайній сигнал після проігнорованих попереджень: притиснутих вух чи спроби відсунутися. Це про комунікацію, а не про 'поганий' чи 'добрий' характер.",
  },
  {
    claim: "Кролика можна носити, притискаючи до грудей, як плюшеву іграшку",
    truth:
      "Без опори під задніми лапами кролик почувається так, ніби провалюється, і починає панічно вириватися. Задня частина тіла завжди повинна мати підтримку.",
  },
  {
    claim:
      "Якщо кролик подряпав дитину, тварину варто менше брати на руки надалі",
    truth:
      "Частіше правильний висновок протилежний: варто переглянути саму техніку піднімання й частоту контактів, а не уникати спілкування — проблема зазвичай у способі, а не в тварині чи дитині.",
  },
];

export default function RabbitsAndChildren() {
  const [openMyth, setOpenMyth] = useState<number | null>(0);

  return (
    <div className="rc-page">
      <header className="rc-hero">
        <h1 className="rc-title">
          Кролі та діти
          <span className="rc-title-accent">
            як навчити дитину поводитися безпечно
          </span>
        </h1>
        <p className="rc-lede">
          Найчастіші травми у цій парі трапляються не через характер кролика чи
          неслухняність дитини, а через одну звичну помилку — тримання на руках
          без опори. Це виправляється за кілька простих правил.
        </p>
      </header>

      <section className="rc-risks" aria-label="Ризики, про які варто знати">
        <h2 className="rc-section-heading">Ризики, про які варто знати</h2>
        <div className="rc-risk-grid">
          {risks.map((r) => (
            <article className="rc-risk-card" key={r.title}>
              <span className="rc-risk-icon" aria-hidden="true">
                {r.icon}
              </span>
              <h3 className="rc-risk-title">{r.title}</h3>
              <p className="rc-risk-text">{r.text}</p>
            </article>
          ))}
        </div>
      </section>

      <main className="rc-warren" aria-label="Як навчити дитину">
        <h2 className="rc-section-heading">Як навчити дитину поводитись</h2>
        <div className="rc-tunnel" aria-hidden="true" />
        {steps.map((s) => (
          <section className="rc-chamber" key={s.step}>
            <div className="rc-chamber-marker">
              <span className="rc-chamber-step">{s.step}</span>
            </div>
            <div className="rc-chamber-body">
              <h3 className="rc-chamber-title">{s.title}</h3>
              <p className="rc-chamber-text">{s.text}</p>
            </div>
          </section>
        ))}
      </main>

      <section className="rc-myths" aria-label="Поширені хибні уявлення">
        <h2 className="rc-section-heading">Поширені хибні уявлення</h2>
        <div className="rc-myth-list">
          {myths.map((m, i) => {
            const isOpen = openMyth === i;
            return (
              <div
                className={`rc-myth${isOpen ? " rc-myth--open" : ""}`}
                key={m.claim}
              >
                <button
                  className="rc-myth-trigger"
                  onClick={() => setOpenMyth(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span>{m.claim}</span>
                  <span className="rc-myth-icon">{isOpen ? "–" : "+"}</span>
                </button>
                {isOpen && <p className="rc-myth-truth">{m.truth}</p>}
              </div>
            );
          })}
        </div>
      </section>

      <section className="rc-note" aria-label="Якщо сталася подряпина чи укус">
        <p>
          Якщо подряпина чи укус пошкодили шкіру, рану промивають водою з милом
          і за потреби звертаються до лікаря — так само, як за будь-якої травми
          шкіри від тварини. Мити руки після кожного контакту з кроликом варто в
          будь-якому випадку, незалежно від того, чи була травма.
        </p>
      </section>

      <div className="rc-related">
        <h3 className="rc-related-title">Читайте також</h3>
        <div className="rc-related-grid">
          <Link to="/rabbits-and-predators" className="rc-related-link">
            🐈🐕 Кролі, коти та собаки
          </Link>
          <Link to="/rabbit-body-language" className="rc-related-link">
            🧠 Мова тіла кроля
          </Link>
          <Link to="/zoonoses" className="rc-related-link">
            🦠 Зоонози
          </Link>
          <Link to="/rabbit-stress" className="rc-related-link">
            ⚡ Стрес та переляк
          </Link>
        </div>
      </div>

      <footer className="rc-footer">
        <p>
          Матеріал підготовлено на основі загальноприйнятих рекомендацій щодо
          поведінки кролів і безпечної взаємодії з дітьми. Індивідуальні
          особливості характеру конкретного кролика можуть вимагати додаткової
          обережності — за сумнівів консультуйтеся з фахівцем з поведінки
          тварин.
        </p>
      </footer>
    </div>
  );
}
