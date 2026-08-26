import { Link } from "react-router-dom";
import "./Partnership.css";

const directions = [
  {
    icon: "💉",
    title: "Ветеринарні клініки та препарати",
    desc: "Пропонуєте ветеринарні послуги, консультації чи препарати для кролів? Розкажемо про вас нашій аудиторії власників кролівництва.",
  },
  {
    icon: "🐇",
    title: "Прийом шкурок і продукції",
    desc: "Приймаєте шкурки, м'ясо чи іншу продукцію кролівництва на переробку або реалізацію — вкажемо ваші умови прийому та контакти.",
  },
  {
    icon: "🌾",
    title: "Корми та кормові добавки",
    desc: "Виробники та продавці комбікорму, зернових сумішей, вітамінних добавок — розмістимо асортимент і умови постачання.",
  },
  {
    icon: "🏠",
    title: "Обладнання та клітки",
    desc: "Клітки, поїлки, годівниці, інвентар для господарства — покажемо ваші рішення тим, хто саме зараз облаштовує кролятник.",
  },
  {
    icon: "📦",
    title: "Оптові закупівлі",
    desc: "Шукаєте постачальників або, навпаки, збут продукції кролівництва оптом — допоможемо знайти контакт серед наших користувачів.",
  },
  {
    icon: "🐰",
    title: "Свій варіант співпраці",
    desc: "Маєте інший формат — бартер, реклама, спільний проєкт? Напишіть, обговоримо умови індивідуально.",
  },
];

const steps = [
  {
    num: 1,
    title: "Напишіть нам",
    desc: "Опишіть коротко, чим займаєтесь і який формат співпраці вас цікавить.",
  },
  {
    num: 2,
    title: "Обговоримо умови",
    desc: "Узгодимо, що саме буде розміщено — опис, умови, контакти, посилання.",
  },
  {
    num: 3,
    title: "Розміщуємо на платформі",
    desc: "Додаємо ваш блок на цю сторінку — його побачать відвідувачі, які шукають саме такі послуги.",
  },
];

const faq = [
  {
    q: "Скільки коштує розміщення?",
    a: "Залежить від формату співпраці — обговорюємо індивідуально під час першого контакту.",
  },
  {
    q: "Чи можна розмістити лише контакти без опису?",
    a: "Так, формат блоку гнучкий — від короткого контакту до розгорнутого опису з умовами.",
  },
  {
    q: "Хто аудиторія платформи?",
    a: "Власники та початківці в кролівництві — ті, хто веде облік поголів'я, шукає інформацію про догляд, годівлю та розведення.",
  },
  {
    q: "Чи можна оновити або прибрати блок пізніше?",
    a: "Так, звертайтесь у будь-який момент — оновимо умови або приберемо розміщення.",
  },
];

const Partnership = () => {
  return (
    <main className="partner-page">
      <div className="partner-header">
        <h1>🤝 Партнерство</h1>
        <p>Співпраця для ветклінік, кролівників та суміжного бізнесу</p>
      </div>

      <div className="partner-wrap">
        {/* ГОЛОВНИЙ БЛОК */}
        <div className="partner-hero">
          <div className="partner-hero-text">
            <h2>Ми відкриті до співпраці</h2>
            <p>
              Якщо ви продаєте товари чи послуги для кролівників, маєте
              відношення до ветеринарії, приймаєте шкурки або пропонуєте
              обладнання, корми та препарати — напишіть нам. Розмістимо блок з
              вашими умовами та контактами прямо на цій сторінці.
            </p>
            <p>Пропонуйте свій варіант співпраці — ми знайдемо спільну мову.</p>
          </div>
        </div>

        {/* СТАТУС ПЛАТФОРМИ */}
        <div className="partner-status">
          <span className="partner-status-icon">🚧</span>
          <p>
            Платформа ще в розробці та тестуванні, але вже проходить індексацію
            в Google — довідник можна знайти в пошуку та переглянути вже зараз.
          </p>
        </div>

        {/* НАПРЯМКИ СПІВПРАЦІ */}
        <div className="partner-section-title">📋 Напрямки співпраці</div>
        <div className="partner-directions-grid">
          {directions.map((d) => (
            <article key={d.title} className="partner-direction-card">
              <div className="partner-direction-header">
                <span className="partner-direction-icon">{d.icon}</span>
                <h3>{d.title}</h3>
              </div>
              <p className="partner-direction-desc">{d.desc}</p>
            </article>
          ))}
        </div>

        {/* ЯК ЦЕ ПРАЦЮЄ */}
        <div className="partner-section-title">📩 Як це працює</div>
        <div className="partner-steps">
          {steps.map((s) => (
            <div key={s.num} className="partner-step">
              <div className="partner-step-num">{s.num}</div>
              <div className="partner-step-content">
                <strong>{s.title}</strong>
                <p>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="partner-section-title">❓ Часті питання</div>
        <div className="partner-faq">
          {faq.map((f) => (
            <div key={f.q} className="partner-faq-item">
              <strong>{f.q}</strong>
              <p>{f.a}</p>
            </div>
          ))}
        </div>

        {/* CTA ВНИЗУ */}
        <div className="partner-bottom-cta">
          <h2>Готові обговорити співпрацю?</h2>
          <p>Напишіть нам — розкажемо деталі та узгодимо умови розміщення</p>
          <div className="partner-bottom-contacts">
            <a
              href="https://t.me/Dima_freelancer_recruiting_pit"
              target="_blank"
              rel="noreferrer"
              className="partner-contact-btn telegram large"
            >
              ✈️ Написати в Telegram
            </a>
            <a
              href="mailto:webstartstudio978@gmail.com"
              className="partner-contact-btn email large"
            >
              📧 Написати на Email
            </a>
          </div>
        </div>

        <div className="partner-back">
          <Link to="/" className="partner-back-btn">
            ← На головну
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Partnership;
