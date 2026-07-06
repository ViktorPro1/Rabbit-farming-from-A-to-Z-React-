import { useState } from "react";
import { Link } from "react-router-dom";
import "./FarmManagementSoftware.css";

interface Category {
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

const categories: Category[] = [
  {
    icon: "🍼",
    title: "Окроли та вагітності",
    text: "Дати злучок, очікувані окроли, кількість молодняку в приплоді — те, що найчастіше шукають у паперовому журналі й найдовше знаходять.",
  },
  {
    icon: "💉",
    title: "Вакцинації та дегельмінтизація",
    text: "Дата й препарат по кожній тварині чи групі, з нагадуванням про наступний термін — саме тут пам'ять найчастіше підводить при ручному обліку.",
  },
  {
    icon: "⚖️",
    title: "Вага і приріст",
    text: "Регулярні зважування в таблиці одразу показують тренд, а не просто цифру на сьогодні — відставання в рості видно за кілька тижнів, а не заднім числом.",
  },
  {
    icon: "💰",
    title: "Витрати та доходи",
    text: "Вартість корму, ветпрепаратів і виручка від продажу по кожній партії — основа, без якої собівартість залишається приблизною оцінкою, а не розрахунком.",
  },
];

const steps: Step[] = [
  {
    step: "01",
    title: "Почати з одного напрямку",
    text: "Спроба одразу оцифрувати все господарство — окроли, вакцинації, вагу, фінанси — найчастіше закінчується покинутою на другий тиждень системою. Починають з одного напрямку, який болить найбільше, і додають інше поступово.",
  },
  {
    step: "02",
    title: "Вносити дані одразу біля клітки",
    text: "Запис за півхвилини під час обходу точніший, ніж спроба відновити день по пам'яті ввечері. Чим довша затримка між подією і записом, тим більше деталей губиться чи плутається.",
  },
  {
    step: "03",
    title: "Не ускладнювати систему зайвими полями",
    text: "Таблиця чи застосунок із двадцятьма колонками, половина з яких порожня, працює гірше за просту структуру з кількома ключовими полями, які справді заповнюють щоразу.",
  },
  {
    step: "04",
    title: "Обирати інструмент з офлайн-режимом",
    text: "У кролятнику чи на дальній ділянці господарства інтернету може не бути. Застосунок, що працює офлайн і синхронізується пізніше, надійніший за той, що вимагає постійного з'єднання.",
  },
  {
    step: "05",
    title: "Робити щотижневий перегляд записів",
    text: "Кілька хвилин щонеділі на перегляд внесеного показують пропуски і помилки одразу, поки їх ще легко виправити, а не через місяці, коли дані вже впливають на рішення.",
  },
];

const risks: Risk[] = [
  {
    claim: "Складна програма з десятками полів фіксує більше, тому краща",
    truth:
      "На практиці перевантажена система найчастіше веде до відмови вести облік узагалі — просту структуру, яку справді заповнюють щодня, цінніша за розгалужену, яку покинули за місяць.",
  },
  {
    claim: "Без постійного інтернету цифровий облік марний",
    truth:
      "Багато інструментів для обліку господарства спеціально розраховані на офлайн-роботу з синхронізацією при появі з'єднання — постійний інтернет не обов'язкова умова.",
  },
  {
    claim: "Звичайна таблиця в телефоні — це не 'справжня' автоматизація",
    truth:
      "Таблиця з чіткою структурою — цілком робочий цифровий інструмент для старту, особливо для невеликого господарства. Спеціалізований застосунок — наступний крок, а не обов'язкова умова початку.",
  },
  {
    claim: "Записати все одним разом увечері так само ефективно",
    truth:
      "Відновлення дня по пам'яті вносить помилки й пропуски, яких немає при записі одразу біля клітки під час самої події.",
  },
];

export default function FarmManagementSoftware() {
  const [openRisk, setOpenRisk] = useState<number | null>(0);

  return (
    <div className="fm-page">
      <header className="fm-hero">
        <h1 className="fm-title">
          Програми обліку господарства
          <span className="fm-title-accent">
            цифровий журнал замість паперового
          </span>
        </h1>
        <p className="fm-lede">
          Паперовий журнал гине від пожежі, вологи чи звичайної втрати за один
          день, а пошук конкретного запису в ньому займає хвилини. Це не про
          моду на гаджети — а про надійність даних, від яких залежать рішення по
          стаду.
        </p>
      </header>

      <section
        className="fm-categories"
        aria-label="Що перенести в цифру першим"
      >
        <h2 className="fm-section-heading">Що перенести в цифру першим</h2>
        <div className="fm-category-grid">
          {categories.map((c) => (
            <article className="fm-category-card" key={c.title}>
              <span className="fm-category-icon" aria-hidden="true">
                {c.icon}
              </span>
              <h3 className="fm-category-title">{c.title}</h3>
              <p className="fm-category-text">{c.text}</p>
            </article>
          ))}
        </div>
      </section>

      <main className="fm-warren" aria-label="Кроки переходу">
        <h2 className="fm-section-heading">Як перейти без зривів</h2>
        <div className="fm-tunnel" aria-hidden="true" />
        {steps.map((s) => (
          <section className="fm-chamber" key={s.step}>
            <div className="fm-chamber-marker">
              <span className="fm-chamber-step">{s.step}</span>
            </div>
            <div className="fm-chamber-body">
              <h3 className="fm-chamber-title">{s.title}</h3>
              <p className="fm-chamber-text">{s.text}</p>
            </div>
          </section>
        ))}
      </main>

      <section className="fm-risks" aria-label="Поширені хибні уявлення">
        <h2 className="fm-section-heading">Поширені хибні уявлення</h2>
        <div className="fm-risk-list">
          {risks.map((r, i) => {
            const isOpen = openRisk === i;
            return (
              <div
                className={`fm-risk${isOpen ? " fm-risk--open" : ""}`}
                key={r.claim}
              >
                <button
                  className="fm-risk-trigger"
                  onClick={() => setOpenRisk(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span>{r.claim}</span>
                  <span className="fm-risk-icon">{isOpen ? "–" : "+"}</span>
                </button>
                {isOpen && <p className="fm-risk-truth">{r.truth}</p>}
              </div>
            );
          })}
        </div>
      </section>

      <div className="fm-related">
        <h3 className="fm-related-title">Читайте також</h3>
        <div className="fm-related-grid">
          <Link to="/treatment-log" className="fm-related-link">
            📋 Журнал лікувань та документація
          </Link>
          <Link to="/pedigree-records" className="fm-related-link">
            📖 Родоводи та племінний облік
          </Link>
          <Link to="/weight-control" className="fm-related-link">
            ⚖️ Контроль ваги
          </Link>
          <Link to="/farm-monitoring" className="fm-related-link">
            📷 Відеоспостереження та моніторинг
          </Link>
        </div>
      </div>

      <footer className="fm-footer">
        <p>
          Матеріал підготовлено на основі загальних принципів цифрового обліку в
          тваринництві. Конкретний інструмент — таблиця, спеціалізований
          застосунок чи їх поєднання — обирайте під розмір свого господарства, а
          не за модою на назву продукту.
        </p>
      </footer>
    </div>
  );
}
