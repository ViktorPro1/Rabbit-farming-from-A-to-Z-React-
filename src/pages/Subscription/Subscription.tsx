import { Link } from "react-router-dom";
import "./Subscription.css";

const features = [
  {
    icon: "🐇",
    title: "Мої кролики",
    desc: "Реєстр дорослих тварин. Додавай кожного кролика з кличкою, породою, кліткою і датою народження. Вік розраховується автоматично.",
    details: [
      "Необмежена кількість тварин",
      "Фільтр за статтю, породою, кліткою",
      "Автоматичний розрахунок віку",
      "Редагування та видалення записів",
    ],
  },
  {
    icon: "📦",
    title: "Архів",
    desc: "Архівовані кролики. Тварини яких прибрав з активного реєстру. Можна відновити або видалити назавжди.",
    details: [
      "Зберігає всю історію тварини",
      "Відновлення в активний реєстр",
      "Повне видалення при потребі",
    ],
  },
  {
    icon: "🔄",
    title: "Розведення",
    desc: "Індивідуальні злучки. Вказуєш кролика + кроличку, дату злучки — система автоматично розраховує контрольну дату і очікуваний окріл.",
    details: [
      "Автоматичний розрахунок дати окролу",
      "Контрольна дата злучки",
      "Фіксація кількості народжених",
      "Дата відлучення молодняку",
    ],
  },
  {
    icon: "🏠",
    title: "Підлогове утримання",
    desc: "Групове розведення в загоні. Один кролик + кілька самок. Самок додаєш вручну. Вносиш злучки і окроли для всього загону.",
    details: [
      "Один плідник — кілька самок",
      "Окремий облік кожної самки",
      "Злучки та окроли по загону",
      "Зручно для великого поголів'я",
    ],
  },
  {
    icon: "🥩",
    title: "Відгодівля",
    desc: "Клітки з кроликами на забій. Вказуєш номер клітки, кількість, породу і дату народження. Система показує скільки днів до планової дати забою.",
    details: [
      "Автоматичний відлік до дати забою",
      "Облік по клітках",
      "Планування забою",
      "Кількість голів у кожній клітці",
    ],
  },
  {
    icon: "🔒",
    title: "Карантин",
    desc: "Ізольовані тварини. Вказуєш з якої клітки, причину і дату переміщення. Після карантину фіксуєш результат.",
    details: [
      "Причина ізоляції",
      "Дата початку та кінця",
      "Результат: видужав / забій / загинув",
      "Повертає тварину в потрібний розділ",
    ],
  },
  {
    icon: "📊",
    title: "Лічильник поголів'я",
    desc: "Блок з цифрами автоматично рахує всіх тварин з усіх розділів: реєстр + молодняк + підлогове + відгодівля + карантин.",
    details: [
      "Загальна кількість тварин",
      "По кожному розділу окремо",
      "Оновлюється в реальному часі",
      "Завжди знаєш скільки у тебе кроликів",
    ],
  },
  {
    icon: "🧮",
    title: "Калькулятор",
    desc: "Зернова суміш та дати розведення — тільки для підписників. Розрахунок раціону та планування злучок.",
    details: [
      "Калькулятор зернової суміші",
      "Розрахунок дат злучки та окролу",
      "Племінне стадо та відгодівля",
      "Дати вакцинацій",
    ],
  },
];

const Subscription = () => {
  return (
    <main className="sub-page">
      <div className="sub-header">
        <h1>🐇 Що ви отримуєте після підписки</h1>
        <p>
          Повний облік кролячого господарства в одному місці — з телефону або
          комп'ютера
        </p>
      </div>

      <div className="sub-wrap">
        {/* ГОЛОВНИЙ БЛОК */}
        <div className="sub-hero">
          <div className="sub-hero-text">
            <h2>Система обліку кролівництва</h2>
            <p>
              Більше не потрібні зошити, таблиці в Excel чи записки на папері.
              Всі дані про твоїх кроликів — в одному зручному місці, доступні з
              будь-якого пристрою.
            </p>
            <p>
              Система рахує, нагадує та відстежує — ти лише вносиш дані та
              приймаєш рішення.
            </p>
            <div className="sub-cta-wrap">
              <Link to="/auth" className="sub-cta-btn">
                Отримати доступ →
              </Link>
              <span className="sub-cta-note">Потрібен інвайт-код</span>
            </div>
          </div>
          <div className="sub-hero-stats">
            <div className="sub-stat">
              <span className="sub-stat-num">8</span>
              <span className="sub-stat-label">розділів обліку</span>
            </div>
            <div className="sub-stat">
              <span className="sub-stat-num">∞</span>
              <span className="sub-stat-label">кроликів у реєстрі</span>
            </div>
            <div className="sub-stat">
              <span className="sub-stat-num">24/7</span>
              <span className="sub-stat-label">доступ з телефону</span>
            </div>
          </div>
        </div>

        {/* ЦІНА */}
        <div className="sub-price-block">
          <div className="sub-price">
            <span className="sub-price-amount">149 грн</span>
            <span className="sub-price-period">/ місяць</span>
          </div>
          <p className="sub-price-desc">
            Повний доступ до всіх функцій без обмежень
          </p>
        </div>

        {/* ФУНКЦІЇ */}
        <div className="sub-section-title">📋 Що входить у підписку</div>
        <div className="sub-features-grid">
          {features.map((f) => (
            <article key={f.title} className="sub-feature-card">
              <div className="sub-feature-header">
                <span className="sub-feature-icon">{f.icon}</span>
                <h3>{f.title}</h3>
              </div>
              <p className="sub-feature-desc">{f.desc}</p>
              <ul className="sub-feature-details">
                {f.details.map((d) => (
                  <li key={d}>✅ {d}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {/* ЯК ОТРИМАТИ */}
        <div className="sub-section-title">📩 Як отримати доступ</div>
        <div className="sub-steps">
          <div className="sub-step">
            <div className="sub-step-num">1</div>
            <div className="sub-step-content">
              <strong>Напиши нам</strong>
              <p>
                Звернись у Telegram або на email — ми відповімо та уточнимо
                деталі.
              </p>
              <div className="sub-step-contacts">
                <a
                  href="https://t.me/Viktor_freelancer_recruiting_pit"
                  target="_blank"
                  rel="noreferrer"
                  className="sub-contact-btn telegram"
                >
                  ✈️ Telegram
                </a>
                <a
                  href="mailto:webstartstudio978@gmail.com"
                  className="sub-contact-btn email"
                >
                  📧 Email
                </a>
              </div>
            </div>
          </div>
          <div className="sub-step">
            <div className="sub-step-num">2</div>
            <div className="sub-step-content">
              <strong>Отримай інвайт-код</strong>
              <p>
                Після оплати ти отримаєш унікальний інвайт-код для реєстрації.
              </p>
            </div>
          </div>
          <div className="sub-step">
            <div className="sub-step-num">3</div>
            <div className="sub-step-content">
              <strong>Зареєструйся та користуйся</strong>
              <p>
                Введи email, пароль та інвайт-код — і одразу отримуєш доступ до
                всіх функцій.
              </p>
              <Link to="/auth" className="sub-step-link">
                Перейти до реєстрації →
              </Link>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="sub-section-title">❓ Часті питання</div>
        <div className="sub-faq">
          <div className="sub-faq-item">
            <strong>З якого пристрою можна користуватись?</strong>
            <p>
              З будь-якого — телефон, планшет, комп'ютер. Додаток встановлюється
              на телефон як PWA (без App Store).
            </p>
          </div>
          <div className="sub-faq-item">
            <strong>Чи зберігаються дані при зміні телефону?</strong>
            <p>
              Так. Всі дані зберігаються в хмарі — просто увійди з нового
              пристрою.
            </p>
          </div>
          <div className="sub-faq-item">
            <strong>Скільки кроликів можна додати?</strong>
            <p>
              Необмежена кількість. Немає жодних лімітів на кількість тварин або
              записів.
            </p>
          </div>
          <div className="sub-faq-item">
            <strong>Чи можна скасувати підписку?</strong>
            <p>
              Так, у будь-який момент. Звернись до нас і ми вирішимо питання.
            </p>
          </div>
        </div>

        {/* CTA ВНИЗУ */}
        <div className="sub-bottom-cta">
          <h2>Готовий почати?</h2>
          <p>
            Напиши нам — і вже сьогодні твоє господарство буде під контролем
          </p>
          <div className="sub-bottom-contacts">
            <a
              href="https://t.me/Viktor_freelancer_recruiting_pit"
              target="_blank"
              rel="noreferrer"
              className="sub-contact-btn telegram large"
            >
              ✈️ Написати в Telegram
            </a>
            <a
              href="mailto:webstartstudio978@gmail.com"
              className="sub-contact-btn email large"
            >
              📧 Написати на Email
            </a>
          </div>
        </div>

        <div className="sub-back">
          <Link to="/" className="sub-back-btn">
            ⬅ На головну
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Subscription;
