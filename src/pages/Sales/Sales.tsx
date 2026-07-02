import { useState } from "react";
import { Link } from "react-router-dom";
import "./Sales.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const channels = [
  {
    id: "neighbors",
    icon: "🤝",
    title: "Сусіди та знайомі",
    badge: "Старт",
    badgeType: "start",
    margin: "Найвища маржа",
    difficulty: "Легко",
    volume: "Малий",
    desc: "Перший і найпростіший канал. Сарафанне радіо працює краще за будь-яку рекламу. Один задоволений покупець приводить двох нових.",
    pros: [
      "Найвища ціна — роздріб без посередників",
      "Немає витрат на рекламу",
      "Оплата готівкою, без затримок",
      "Лояльні до якості і вибачать дрібні проблеми",
      "Часто беруть постійно і наперед домовляються",
    ],
    cons: [
      "Обмежений обсяг — 5–15 кг на місяць максимум",
      "Сезонність попиту — влітку беруть менше",
      "Залежність від особистих стосунків",
    ],
    howto: [
      "Почни з подарунку — дай спробувати безкоштовно",
      "Розкажи про породу і умови утримання — це підвищує цінність",
      "Зафіксуй постійних покупців у телефоні, нагадуй коли є тушки",
      "Запропонуй знижку за 2+ кг або передоплату",
    ],
    price: "180–260 грн/кг тушки",
  },
  {
    id: "market",
    icon: "🏪",
    title: "Ринок",
    badge: "Стабільно",
    badgeType: "stable",
    margin: "Середня маржа",
    difficulty: "Середньо",
    volume: "Середній",
    desc: "Районний або міський ринок. Вимагає постійної присутності або домовленості з торговцем. Стабільний збут при налагодженому контакті.",
    pros: [
      "Прогнозований попит — ринок працює за розкладом",
      "Можна здавати оптом торговцю і не стояти самому",
      "Готівковий розрахунок",
      "Можна продавати також субпродукти і шкури",
    ],
    cons: [
      "Ціна нижча ніж при прямому продажі",
      "Потрібен дозвіл — ветеринарне свідоцтво на тушку",
      "Конкуренція з іншими продавцями",
      "При самостійній торгівлі — витрати часу на поїздку",
    ],
    howto: [
      "Знайди торговця м'ясом на ринку і запропонуй здавати оптом",
      "Домовся про регулярність — раз на тиждень або раз на два тижні",
      "Отримай ветеринарне свідоцтво заздалегідь (держветстанція або сільрада)",
      "Ціна при здачі оптовику: 130–160 грн/кг — але без клопоту з роздрібом",
    ],
    price: "130–180 грн/кг тушки",
  },
  {
    id: "restaurants",
    icon: "🍽️",
    title: "Ресторани та кафе",
    badge: "Преміум",
    badgeType: "premium",
    margin: "Висока маржа",
    difficulty: "Складно",
    volume: "Великий",
    desc: "Найперспективніший канал при налагодженому виробництві. Ресторани платять за стабільність і якість, а не за найнижчу ціну.",
    pros: [
      "Вища ціна ніж ринок — 200–280 грн/кг",
      "Великі постійні замовлення",
      "Не потрібно стояти на ринку",
      "Репутаційний ефект — 'постачальник ресторану'",
    ],
    cons: [
      "Потрібна стабільна кількість — ресторан не може чекати",
      "Можливе прохання виставляти рахунок-фактуру (потрібен ФОП)",
      "Вимоги до якості і стандарту оброблення тушки",
      "Довгий цикл продажу — поки знайдеш і переконаєш шефа",
    ],
    howto: [
      "Зайди не до адміністратора, а до шеф-кухаря — він вирішує",
      "Принеси зразок безкоштовно — тушку або стегна",
      "Запропонуй тестовий місяць за зниженою ціною",
      "Гарантуй фіксовану кількість щотижня і не зривай постачання",
      "Фермерська історія підвищує цінність — розкажи про породу і годування",
    ],
    price: "200–280 грн/кг тушки або відрубів",
  },
  {
    id: "olx",
    icon: "📱",
    title: "OLX та інші майданчики",
    badge: "Онлайн",
    badgeType: "online",
    margin: "Роздрібна ціна",
    difficulty: "Легко",
    volume: "Середній",
    desc: "OLX, Prom.ua, Facebook Marketplace. Низький поріг входу, але потрібна активна робота з оголошеннями і відгуками.",
    pros: [
      "Широке охоплення — не обмежений географією",
      "Роздрібна ціна — немає посередника",
      "Можна продавати живим, тушками і племінним молодняком",
      "Безкоштовно або дешево",
    ],
    cons: [
      "Багато нецільових запитів і торгу",
      "Конкуренція за ціною з випадковими продавцями",
      "Логістика самовивозу або доставки",
      "Потрібні фото і час на відповіді",
    ],
    howto: [
      "Зроби якісні фото: жива тварина, тушка в розрізі, умови утримання",
      "Вкажи породу, вік, вагу, умови годування — покупець платить за прозорість",
      "Підніми оголошення перед вихідними — пік попиту п'ятниця-субота",
      "Відповідай швидко — покупець вибирає того хто відповів першим",
      "Збирай відгуки від перших покупців — це конвертує наступних",
    ],
    price: "160–240 грн/кг або 80–130 грн/кг живим",
  },
  {
    id: "telegram",
    icon: "✈️",
    title: "Telegram / Instagram",
    badge: "Перспективно",
    badgeType: "grow",
    margin: "Висока маржа",
    difficulty: "Середньо",
    volume: "Зростаючий",
    desc: "Власний канал або група — довгострокова інвестиція. Покупці, які підписались на тебе, лояльніші і платять більше.",
    pros: [
      "Прямий зв'язок з покупцем без посередника",
      "Формує базу постійних клієнтів",
      "Можна анонсувати забій наперед і збирати заявки",
      "Підвищує довіру через контент про господарство",
    ],
    cons: [
      "Потрібен час на ведення — фото, пости, відповіді",
      "Ефект накопичувальний — перші 3–6 місяців повільно",
      "Потрібні базові навички фото і написання тексту",
    ],
    howto: [
      "Знімай коротке відео: ранкове годування, кролята, зважування — люди купують у тих кого знають",
      "Повідом за 3–5 днів до забою: 'буде 8 тушок, хто бере?'",
      "Постав посилання на канал в оголошення OLX — конвертуй разових в постійних",
      "Не обов'язково щодня — 2–3 пости на тиждень достатньо для старту",
    ],
    price: "180–260 грн/кг — лояльна аудиторія не торгується",
  },
  {
    id: "wholesale",
    icon: "🚛",
    title: "Оптові покупці та переробники",
    badge: "Масштаб",
    badgeType: "scale",
    margin: "Низька маржа",
    difficulty: "Складно",
    volume: "Великий",
    desc: "М'ясокомбінати, переробники, заготівельники. Актуально при поголів'ї від 50+ самок коли роздріб не встигає поглинути обсяг.",
    pros: [
      "Забирають великі обсяги без клопоту зі збутом",
      "Стабільна ціна і договір",
      "Можна здавати живим — не потрібен забій",
    ],
    cons: [
      "Найнижча ціна — 70–100 грн/кг живим",
      "Жорсткі вимоги до ваги і стандартів",
      "Потрібен ФОП або ОСГ з документами",
      "Можуть затримувати оплату",
    ],
    howto: [
      "Шукай заготівельників через районну ветстанцію або агрофорум",
      "Дізнайся умови здачі заздалегідь: мінімальна партія, вага, порода",
      "Не роби опт єдиним каналом — залишай частку для роздрібу",
    ],
    price: "70–110 грн/кг живим або 120–150 грн/кг тушки",
  },
];

const documents = [
  {
    doc: "Ветеринарне свідоцтво форми 2",
    when: "При продажі тушок поза подвір'ям",
    where: "Держветстанція або районна ветслужба",
    cost: "50–150 грн за партію",
    note: "Потрібне для ринку, ресторану, перевезення. Вимагає огляду тушок ветом.",
  },
  {
    doc: "Довідка ОСГ",
    when: "При будь-якому продажі як фізособа",
    where: "Сільська або міська рада",
    cost: "Безкоштовно",
    note: "Підтверджує що тварини вирощені в особистому господарстві. Дає право продавати без ФОП.",
  },
  {
    doc: "Реєстрація як ФОП",
    when: "При роботі з рестораном або магазином офіційно",
    where: "ДПС або онлайн через Дія",
    cost: "Безкоштовно, але є витрати на ЄСВ",
    note: "Потрібен якщо партнер вимагає рахунок-фактуру або накладну.",
  },
  {
    doc: "Санітарна книжка ринку",
    when: "При самостійній торгівлі на ринку",
    where: "Адміністрація ринку",
    cost: "200–500 грн/місяць оренда місця",
    note: "У деяких ринків є власні вимоги — уточнюй заздалегідь.",
  },
];

const pricing = [
  {
    type: "Тушка ціла (охолоджена)",
    range: "160–240 грн/кг",
    avg: "185–200 грн/кг",
    note: "Найпоширеніший формат. Попит стабільний цілий рік.",
  },
  {
    type: "Тушка жива маса",
    range: "80–120 грн/кг",
    avg: "90–100 грн/кг",
    note: "Простіше — не треба забивати. Покупець забирає і забиває сам.",
  },
  {
    type: "Стегна задні (2 шт)",
    range: "200–280 грн/кг",
    avg: "230–250 грн/кг",
    note: "Преміальний відруб. Ресторани та кафе беруть охоче.",
  },
  {
    type: "Печінка кролика",
    range: "80–130 грн/кг",
    avg: "100 грн/кг",
    note: "Субпродукт. Попит є, особливо в містах. Не викидай.",
  },
  {
    type: "Племінне крільченя (45–60 днів)",
    range: "400–1500 грн/гол",
    avg: "600–800 грн/гол",
    note: "Найвища маржа. Потрібна документація на батьків і репутація.",
  },
  {
    type: "Гній кролячий (перегній)",
    range: "50–150 грн/відро",
    avg: "80–100 грн/відро",
    note: "Додатковий дохід без витрат. Городники беруть охоче навесні.",
  },
];

const mistakes = [
  {
    mistake: "Починати розводити до пошуку покупців",
    consequence:
      "Тушки накопичуються, займають морозилку, починаєш продавати собі в збиток",
    fix: "Спершу знайди 3–5 постійних покупців або домовленість з ринком — потім збільшуй поголів'я",
  },
  {
    mistake: "Покладатись на один канал збуту",
    consequence: "Покупець зник, захворів, переїхав — і збуту немає взагалі",
    fix: "Мінімум 2–3 канали паралельно: сусіди + OLX + один ресторан або торговець",
  },
  {
    mistake: "Не мати ветсвідоцтва",
    consequence:
      "Штраф при перевірці на ринку або відмова ресторану від постачання",
    fix: "Зроби свідоцтво заздалегідь — це займає 1 день і коштує 50–150 грн",
  },
  {
    mistake: "Продавати без фіксації замовлень",
    consequence:
      "Покупець не прийшов, тушка лежить, треба термінова реалізація за безцінь",
    fix: "Попередній запис і передоплата 50% — привчай покупців до дисципліни",
  },
  {
    mistake: "Ціна 'як у всіх' без обґрунтування",
    consequence: "Конкуруєш тільки ціною, заробляєш менше ніж міг би",
    fix: "Розкажи про породу, годування, умови — обґрунтована ціна вища за ринкову не відштовхує",
  },
];

const seasonality = [
  { month: "Січень", demand: 70, note: "Після новорічних свят попит падає" },
  { month: "Лютий", demand: 65, note: "Найнижчий попит у році" },
  { month: "Березень", demand: 75, note: "Початок зростання" },
  {
    month: "Квітень",
    demand: 85,
    note: "Пасха — пік попиту на дієтичне м'ясо",
  },
  { month: "Травень", demand: 80, note: "Стабільно добре" },
  { month: "Червень", demand: 65, note: "Літо — попит знижується" },
  { month: "Липень", demand: 60, note: "Найнижчий літній попит" },
  { month: "Серпень", demand: 65, note: "Починає зростати" },
  { month: "Вересень", demand: 80, note: "Осінній ріст попиту" },
  { month: "Жовтень", demand: 85, note: "Добре" },
  { month: "Листопад", demand: 90, note: "Передсвятковий попит" },
  { month: "Грудень", demand: 95, note: "Пік — Різдво і Новий рік" },
];

const Sales = () => {
  const [openChannel, setOpenChannel] = useState<string | null>("neighbors");

  return (
    <main className="sales-page">
      <div className="sales-header">
        <h1>📦 Збут кролятини</h1>
        <p>Де і як продати — канали, документи, ціни, помилки</p>
      </div>

      <div className="sales-wrap">
        {/* ВСТУП */}
        <div className="sales-intro">
          <h2>Головне правило збуту</h2>
          <p>
            Більшість початківців думають про збут після того як вже є тушки. Це
            помилка. Канал збуту потрібно знайти <strong>до</strong> того як
            збільшувати поголів'я. Кролик не чекає — після забою тушка має
            реалізуватись за 3–5 днів в охолодженому вигляді або заморожуватись.
          </p>
          <div className="sales-alert">
            💡 Правило перед масштабуванням: є стабільний збут на поточний обсяг
            — тоді збільшуй стадо. Немає — спочатку знайди покупців.
          </div>
        </div>

        {/* КАНАЛИ ЗБУТУ */}
        <div className="sales-section-title">
          📢 Канали збуту — детальний розбір
        </div>

        <div className="sales-channels">
          {channels.map((ch) => (
            <div
              key={ch.id}
              className={`sales-channel-card ${openChannel === ch.id ? "open" : ""}`}
            >
              <button
                className="sales-channel-header"
                onClick={() =>
                  setOpenChannel(openChannel === ch.id ? null : ch.id)
                }
              >
                <span className="sales-ch-icon">{ch.icon}</span>
                <span className="sales-ch-title">{ch.title}</span>
                <span className={`sales-ch-badge ${ch.badgeType}`}>
                  {ch.badge}
                </span>
                <div className="sales-ch-meta">
                  <span className="sales-ch-margin">{ch.margin}</span>
                  <span className="sales-ch-vol">Обсяг: {ch.volume}</span>
                  <span className="sales-ch-diff">
                    Складність: {ch.difficulty}
                  </span>
                </div>
                <span className="sales-ch-arrow">
                  {openChannel === ch.id ? "▲" : "▼"}
                </span>
              </button>

              {openChannel === ch.id && (
                <div className="sales-channel-body">
                  <p className="sales-ch-desc">{ch.desc}</p>

                  <div className="sales-ch-grid">
                    <div>
                      <div className="sales-ch-sub">✅ Переваги</div>
                      <ul className="sales-ch-list green">
                        {ch.pros.map((p) => (
                          <li key={p}>{p}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="sales-ch-sub">⚠️ Недоліки</div>
                      <ul className="sales-ch-list red">
                        {ch.cons.map((c) => (
                          <li key={c}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="sales-ch-sub">🛠️ Як запустити</div>
                  <ol className="sales-ch-steps">
                    {ch.howto.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ol>

                  <div className="sales-ch-price-box">
                    💰 Орієнтовна ціна: <strong>{ch.price}</strong>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ЦІНИ */}
        <div className="sales-section-title">💰 Актуальні ціни 2025–2026</div>
        <div className="sales-note">
          Ціни орієнтовні — відрізняються по регіонах та сезону. Перевіряй OLX і
          місцевий ринок перед встановленням власної ціни.
        </div>
        <div className="sales-table-wrap">
          <table className="sales-table">
            <thead>
              <tr>
                <th>Продукт</th>
                <th>Діапазон цін</th>
                <th>Середня ціна</th>
                <th>Примітка</th>
              </tr>
            </thead>
            <tbody>
              {pricing.map((p) => (
                <tr key={p.type}>
                  <td>
                    <strong>{p.type}</strong>
                  </td>
                  <td>{p.range}</td>
                  <td className="sales-price-avg">{p.avg}</td>
                  <td>{p.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* СЕЗОННІСТЬ */}
        <div className="sales-section-title">📅 Сезонність попиту</div>
        <div className="sales-note">
          Плануй злучки так щоб пік виробництва (через 70–90 днів після злучки)
          збігався з піком попиту: жовтень–грудень і квітень.
        </div>
        <div className="sales-season-grid">
          {seasonality.map((s) => (
            <div key={s.month} className="sales-season-item">
              <div className="sales-season-month">{s.month}</div>
              <div className="sales-season-bar-wrap">
                <div
                  className="sales-season-bar"
                  style={{ height: `${s.demand}%` }}
                  title={`${s.demand}%`}
                />
              </div>
              <div className="sales-season-pct">{s.demand}%</div>
              <div className="sales-season-note">{s.note}</div>
            </div>
          ))}
        </div>

        {/* ДОКУМЕНТИ */}
        <div className="sales-section-title">📋 Документи для продажу</div>
        <div className="sales-docs">
          {documents.map((d) => (
            <div key={d.doc} className="sales-doc-card">
              <div className="sales-doc-name">📄 {d.doc}</div>
              <div className="sales-doc-row">
                <span className="sales-doc-label">Коли потрібен:</span>
                <span>{d.when}</span>
              </div>
              <div className="sales-doc-row">
                <span className="sales-doc-label">Де отримати:</span>
                <span>{d.where}</span>
              </div>
              <div className="sales-doc-row">
                <span className="sales-doc-label">Вартість:</span>
                <span className="sales-doc-cost">{d.cost}</span>
              </div>
              <div className="sales-doc-note">💡 {d.note}</div>
            </div>
          ))}
        </div>

        {/* ПОМИЛКИ */}
        <div className="sales-section-title">❌ Типові помилки при збуті</div>
        <div className="sales-mistakes">
          {mistakes.map((m) => (
            <div key={m.mistake} className="sales-mistake-card">
              <div className="sales-mistake-top">
                <strong>❌ {m.mistake}</strong>
                <div className="sales-mistake-consequence">
                  Наслідок: {m.consequence}
                </div>
              </div>
              <div className="sales-mistake-fix">
                <span>✅</span>
                <span>{m.fix}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ФІНАЛЬНА РЕКОМЕНДАЦІЯ */}
        <div className="sales-strategy">
          <h2>🎯 Рекомендована стратегія збуту для початківця</h2>
          <div className="sales-strategy-steps">
            <div className="sales-strategy-step">
              <div className="sales-strategy-num">1</div>
              <div>
                <strong>Місяці 1–3</strong>
                <p>
                  Сусіди, знайомі, OLX. Відпрацюй логістику, знайди 5–10
                  постійних покупців. Не поспішай збільшувати поголів'я.
                </p>
              </div>
            </div>
            <div className="sales-strategy-step">
              <div className="sales-strategy-num">2</div>
              <div>
                <strong>Місяці 4–6</strong>
                <p>
                  Додай ринок або Telegram-канал. Зроби ветсвідоцтво. Знайди 1
                  ресторан або кафе і запропонуй тестову партію.
                </p>
              </div>
            </div>
            <div className="sales-strategy-step">
              <div className="sales-strategy-num">3</div>
              <div>
                <strong>Від 6 місяців</strong>
                <p>
                  Маєш стабільний збут на 80%+ продукції — тоді масштабуйся.
                  Решта вирішиться сама при більших обсягах.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="sales-related">
          <h3 className="sales-related-title">Читайте також</h3>
          <div className="sales-related-grid">
            <Link to="/economics" className="sales-related-link">
              📊 Економіка господарства
            </Link>
            <Link to="/legal" className="sales-related-link">
              ⚖️ Юридичний куточок
            </Link>
            <Link to="/profit-calculator" className="sales-related-link">
              💰 Калькулятор рентабельності
            </Link>
            <Link to="/slaughter" className="sales-related-link">
              🔪 Забій та переробка
            </Link>
            <Link to="/recipes" className="sales-related-link">
              🍽️ Рецепти
            </Link>
          </div>
        </div>

        <div className="sales-back">
          <Link to="/" className="sales-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Назва цієї сторінки" />
        </div>
      </div>
    </main>
  );
};

export default Sales;
