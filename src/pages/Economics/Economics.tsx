import { useState } from "react";
import { Link } from "react-router-dom";
import "./Economics.css";

const startupCosts = [
  {
    category: "Клітки та обладнання",
    items: [
      {
        item: "Клітка для дорослого кролика (1 шт)",
        min: 500,
        max: 1500,
        note: "Можна зробити самому — дешевше в 2–3 рази",
      },
      {
        item: "Маточник (для самки з крільченятами)",
        min: 200,
        max: 600,
        note: "На кожну самку окремо",
      },
      {
        item: "Годівниця бункерна (1 шт)",
        min: 150,
        max: 400,
        note: "Або зробити з ПВХ труби",
      },
      {
        item: "Поїлка ніпельна або автоматична",
        min: 100,
        max: 300,
        note: "Ніпельна економить воду та час",
      },
    ],
  },
  {
    category: "Приміщення та комунікації",
    items: [
      {
        item: "Облаштування приміщення (утеплення, освітлення)",
        min: 2000,
        max: 15000,
        note: "Залежить від наявного приміщення та поголів'я",
      },
      {
        item: "Електропроводка та освітлення",
        min: 500,
        max: 3000,
        note: "Обов'язково — для зимового утримання",
      },
      {
        item: "Вентиляція (вентилятор)",
        min: 500,
        max: 2000,
        note: "Для закритих приміщень",
      },
    ],
  },
  {
    category: "Тварини",
    items: [
      {
        item: "Самка племінна (1 гол)",
        min: 400,
        max: 1500,
        note: "Залежить від породи та документів",
      },
      {
        item: "Самець племінний (1 гол)",
        min: 500,
        max: 2000,
        note: "Один самець на 5–8 самок",
      },
      {
        item: "Молодняк для відгодівлі (1 гол)",
        min: 150,
        max: 400,
        note: "Для старту без власного розведення",
      },
    ],
  },
  {
    category: "Інструменти та аптечка",
    items: [
      {
        item: "Ваги, термометр, шприци",
        min: 300,
        max: 800,
        note: "Обов'язковий мінімум",
      },
      {
        item: "Аптечка (препарати)",
        min: 500,
        max: 1500,
        note: "Байкокс, Байтрил, Чіктонік, Еспумізан",
      },
      {
        item: "Інвентар (лопата, відра, обприскувач)",
        min: 500,
        max: 1200,
        note: "Для прибирання та дезінфекції",
      },
    ],
  },
];

const monthlyExpenses = [
  {
    category: "Корм (на 1 дорослого кролика/місяць)",
    items: [
      {
        item: "Зернова суміш (ячмінь, овес, пшениця)",
        amount: "1.5–2 кг/міс",
        price: "40–60 грн",
        note: "При власному зерні — практично 0",
      },
      {
        item: "Сіно",
        amount: "4–6 кг/міс",
        price: "30–80 грн",
        note: "При власній косовиці — практично 0",
      },
      {
        item: "Овочі, коренеплоди",
        amount: "3–5 кг/міс",
        price: "30–60 грн",
        note: "При власному городі — практично 0",
      },
      {
        item: "Комбікорм (якщо використовується)",
        amount: "2–3 кг/міс",
        price: "60–120 грн",
        note: "Замінює зернову суміш + добавки",
      },
      {
        item: "Мінеральні добавки, сіль",
        amount: "Мінімум",
        price: "10–20 грн",
        note: "Лизунець або крейда",
      },
    ],
  },
  {
    category: "Ветеринарія (на рік, на 1 голову)",
    items: [
      {
        item: "Вакцинація (ВГХК + міксоматоз)",
        amount: "2 рази/рік",
        price: "80–150 грн/рік",
        note: "Найважливіша стаття — без неї ризик загибелі всього стада",
      },
      {
        item: "Антипаразитарні препарати",
        amount: "3–4 рази/рік",
        price: "40–80 грн/рік",
        note: "Стронгхолд або Дронтал",
      },
      {
        item: "Профілактичний Солікокс молодняку",
        amount: "1–2 рази/рік",
        price: "20–40 грн/рік",
        note: "Обов'язково для молодняку 20–45 днів",
      },
      {
        item: "Резервний фонд на лікування",
        amount: "На непередбачуване",
        price: "50–200 грн/рік",
        note: "Краще відкладати щомісяця",
      },
    ],
  },
  {
    category: "Комунальні витрати (на місяць, все поголів'я)",
    items: [
      {
        item: "Електроенергія (освітлення 16 год/добу)",
        amount: "1–3 кВт/добу",
        price: "60–200 грн/міс",
        note: "LED лампи суттєво знижують споживання",
      },
      {
        item: "Вода",
        amount: "50–150 мл/кг/добу",
        price: "20–80 грн/міс",
        note: "При власній свердловині — практично 0",
      },
      {
        item: "Підстилка (тирса, солома)",
        amount: "За потребою",
        price: "50–150 грн/міс",
        note: "При власній соломі — практично 0",
      },
    ],
  },
];

const revenueCalc = [
  {
    model: "М'ясо від 5 самок",
    icon: "🥩",
    desc: "Класична модель для домашнього господарства",
    params: [
      { label: "Самок для розведення", value: "5 шт" },
      { label: "Самець", value: "1 шт" },
      { label: "Окролів на рік (1 самка)", value: "5–6 разів" },
      { label: "Живих крільченят (1 окріл)", value: "7–8 шт" },
      { label: "Виживаність до забою", value: "80% = 5–6 шт" },
      { label: "Вік забою", value: "70–90 днів" },
      { label: "Жива маса при забої", value: "2.2–2.5 кг" },
      { label: "Забійний вихід", value: "57% = 1.3–1.4 кг тушки" },
    ],
    calculation: [
      {
        step: "Молодняку на рік (5 самок × 5 окролів × 6 шт)",
        result: "150 крільченят",
      },
      { step: "Виживших до забою (×80%)", result: "120 голів" },
      { step: "М'яса на рік (120 × 1.35 кг)", result: "162 кг тушок" },
      { step: "Виручка при ціні 180 грн/кг", result: "29 160 грн" },
      { step: "Виручка при ціні 220 грн/кг", result: "35 640 грн" },
    ],
    expenses: [
      {
        step: "Корм на рік (6 дорослих × 160 грн/міс × 12)",
        result: "11 520 грн",
      },
      { step: "Корм молодняку на відгодівлі", result: "~7 200 грн" },
      { step: "Ветеринарія та профілактика", result: "~2 000 грн" },
      { step: "Комунальні витрати", result: "~1 800 грн" },
      { step: "Разом витрат на рік", result: "~22 520 грн" },
    ],
    profit: "Прибуток: 6 600–13 120 грн/рік",
    profitType: "medium",
    note: "Це без вартості власного корму та праці. При власному зерні та сіні — прибуток зростає вдвічі.",
  },
  {
    model: "Продаж живим весом від 10 самок",
    icon: "🐇",
    desc: "Продаж живим весом оптовим покупцям — менше клопоту з забоєм",
    params: [
      { label: "Самок для розведення", value: "10 шт" },
      { label: "Самців", value: "2 шт" },
      { label: "Молодняку на рік", value: "~300 голів" },
      { label: "Виживших", value: "~240 голів" },
      { label: "Жива маса при продажі", value: "2.2–2.5 кг" },
    ],
    calculation: [
      { step: "Загальна жива маса (240 × 2.35 кг)", result: "564 кг" },
      { step: "Виручка при ціні 90 грн/кг живим", result: "50 760 грн" },
      { step: "Виручка при ціні 110 грн/кг живим", result: "62 040 грн" },
    ],
    expenses: [
      {
        step: "Корм дорослих (12 гол × 160 грн × 12 міс)",
        result: "23 040 грн",
      },
      { step: "Корм молодняку", result: "~14 400 грн" },
      { step: "Ветеринарія та профілактика", result: "~4 000 грн" },
      { step: "Комунальні витрати", result: "~3 600 грн" },
      { step: "Разом витрат", result: "~45 040 грн" },
    ],
    profit: "Прибуток: 5 720–17 000 грн/рік",
    profitType: "medium",
    note: "Ціна живим нижча ніж тушками, але немає витрат на забій та пакування.",
  },
  {
    model: "Продаж племінного молодняку",
    icon: "🏆",
    desc: "Продаж якісного молодняку для розведення — найвища маржинальність",
    params: [
      { label: "Самок племінних", value: "5–8 шт" },
      { label: "Ціна племінного крільченяти", value: "400–1500 грн" },
      { label: "Вік продажу", value: "45–60 днів" },
      { label: "Кількість придатних для продажу", value: "30–50% посліду" },
    ],
    calculation: [
      {
        step: "Якісного молодняку на рік (5 самок × 5 × 8 × 40%)",
        result: "~80 голів",
      },
      { step: "Виручка при ціні 500 грн/гол", result: "40 000 грн" },
      { step: "Виручка при ціні 800 грн/гол", result: "64 000 грн" },
      { step: "Решта (не племінні) — на м'ясо", result: "+15 000–20 000 грн" },
    ],
    expenses: [
      { step: "Корм та ветеринарія", result: "~15 000 грн" },
      { step: "Реклама та оголошення", result: "~2 000 грн" },
      { step: "Разом витрат", result: "~17 000 грн" },
    ],
    profit: "Прибуток: 38 000–67 000 грн/рік",
    profitType: "high",
    note: "Потребує якісних порід, ведення родоводів та репутації. Найскладніший але найприбутковіший варіант.",
  },
];

const costPerKg = [
  {
    component: "Корм (зернові, сіно)",
    share: "45–55%",
    amount: "60–80 грн/кг м'яса",
    note: "При власному кормі знижується до 10–20 грн/кг",
  },
  {
    component: "Ветеринарія та профілактика",
    share: "8–12%",
    amount: "10–18 грн/кг",
    note: "Вакцини + антипаразитарні",
  },
  {
    component: "Амортизація обладнання",
    share: "5–8%",
    amount: "7–12 грн/кг",
    note: "Клітки, маточники та ін.",
  },
  {
    component: "Комунальні (світло, вода)",
    share: "5–8%",
    amount: "7–12 грн/кг",
    note: "Менше при автономному господарстві",
  },
  {
    component: "Підстилка, дезінфектанти",
    share: "3–5%",
    amount: "4–8 грн/кг",
    note: "При власній соломі — менше",
  },
  {
    component: "Праця (якщо враховувати)",
    share: "15–25%",
    amount: "20–40 грн/кг",
    note: "Зазвичай не рахують при домашньому утриманні",
  },
  {
    component: "Разом без праці",
    share: "66–88%",
    amount: "88–130 грн/кг",
    note: "Собівартість 1 кг тушки кролика",
  },
];

const breakeven = [
  {
    heads: 5,
    income_year: "7 290 грн",
    expenses_year: "5 400 грн",
    profit: "1 890 грн",
    payback: "2–3 роки",
  },
  {
    heads: 10,
    income_year: "14 580 грн",
    expenses_year: "9 800 грн",
    profit: "4 780 грн",
    payback: "1.5–2 роки",
  },
  {
    heads: 20,
    income_year: "29 160 грн",
    expenses_year: "18 000 грн",
    profit: "11 160 грн",
    payback: "1–1.5 роки",
  },
  {
    heads: 50,
    income_year: "72 900 грн",
    expenses_year: "42 000 грн",
    profit: "30 900 грн",
    payback: "До 1 року",
  },
  {
    heads: 100,
    income_year: "145 800 грн",
    expenses_year: "80 000 грн",
    profit: "65 800 грн",
    payback: "6–9 місяців",
  },
];

const risksAndSolutions = [
  {
    risk: "Падіж від хвороб (ВГХК, кокцидіоз)",
    probability: "Високий без вакцинації",
    impact: "Втрата 50–100% поголів'я",
    solution:
      "Вакцинація двічі на рік — страховка від катастрофи. Вартість 150 грн/рік на голову рятує від збитків у тисячі.",
  },
  {
    risk: "Падіж молодняку при відлученні",
    probability: "Середній",
    impact: "10–30% молодняку",
    solution:
      "Профілактика кокцидіозу (Солікокс з 20 дня), плавне відлучення, вода з молочною кислотою.",
  },
  {
    risk: "Відсутність збуту",
    probability: "Середній для новачків",
    impact: "Накопичення тварин, зростання витрат",
    solution:
      "Знайти покупців ДО початку. Ринки, ресторани, сусіди, OLX, Telegram-канали.",
  },
  {
    risk: "Зростання цін на корм",
    probability: "Постійний",
    impact: "+20–40% до собівартості",
    solution:
      "Власне зерно та сіно — зниження залежності від ринку. 1 сотка люцерни = корм для 5–7 кроликів.",
  },
  {
    risk: "Тепловий удар влітку",
    probability: "Середній без підготовки",
    impact: "Загибель 10–50% стада",
    solution:
      "Тінь, вентиляція, заморожені пляшки. Захист від спеки окупається повністю.",
  },
  {
    risk: "Неконтрольований інбридинг",
    probability: "Середній при малому стаді",
    impact: "Поступове погіршення поголів'я",
    solution: "Оновлення самця кожні 2–3 роки. Ведення записів про батьків.",
  },
];

const profitTips = [
  {
    icon: "🌾",
    title: "Власний корм — головна економія",
    desc: "Корм складає 50–60% собівартості. 1 сотка люцерни або тимофіївки дає корм для 5–8 кроликів на весь сезон. Власне зерно знижує витрати на корм до 80%. Без власного корму кролівництво в маленькому масштабі малорентабельне.",
  },
  {
    icon: "🏗️",
    title: "Зроби клітки сам",
    desc: "Самостійно виготовлені клітки коштують в 2–3 рази дешевше куплених. Профіль, сітка та кріплення — 200–400 грн за клітку замість 800–1500 грн. При 10 клітках економія 6 000–11 000 грн.",
  },
  {
    icon: "📊",
    title: "Рахуй собівартість",
    desc: "Більшість господарів не рахують — і не розуміють чи вигідно. Просте правило: фіксуй витрати на корм і ліки щомісяця. Ділись на кілограми отриманого м'яса. Отримаєш реальну собівартість і зрозумієш де можна заощадити.",
  },
  {
    icon: "🤝",
    title: "Кілька каналів збуту",
    desc: "Не покладайся на один ринок. Одночасно: сусіди та знайомі (найвища ціна), місцевий ринок (стабільний збут), ресторани та кафе (великі обсяги), OLX або Telegram (нові клієнти). Диверсифікація захищає від ситуацій коли один канал закрився.",
  },
  {
    icon: "⏰",
    title: "Оптимальний вік забою",
    desc: "Забій в 70–90 днів — оптимальне співвідношення витрат та прибутку. Після 90 днів конверсія корму погіршується: кролик їсть майже стільки ж але росте повільніше. Кожен зайвий місяць — мінус 200–400 грн з голови.",
  },
  {
    icon: "🔄",
    title: "Поєднуй напрями",
    desc: "Кращі за племінними якостями — продавати як плідників (×3–5 до ціни м'яса). Середні — на м'ясо. Самки що знизили продуктивність — на тушонку або продаж. Шкури, послід як добриво — додатковий дохід без додаткових витрат.",
  },
];

const Economics = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <main className="economics-page">
      <div className="economics-header">
        <h1>💰 Економіка кролівництва</h1>
        <p>Собівартість, рентабельність, розрахунки — зрозуміло для кожного</p>
      </div>

      <div className="economics-wrap">
        {/* ВСТУП */}
        <div className="economics-intro">
          <h2>Чи вигідно тримати кроликів? Чесна відповідь</h2>
          <p>
            Правда така: в маленькому масштабі (5–10 голів) кролики — це не
            бізнес. Це спосіб забезпечити сім'ю якісним м'ясом за ціною нижче
            магазинної. Реальний прибуток починається від 20–30 самок з
            налагодженим збутом і власним кормом.
          </p>
          <p>
            Але навіть 5 самок дають 100–150 кг м'яса на рік. При ціні 180
            грн/кг — це 18 000–27 000 грн вартості продукту. Якщо ця продукція
            йде на власний стіл — ти замінюєш дорогий магазинний продукт на
            власний дешевший.
          </p>
          <div className="economics-alert ok">
            ✅ Головне правило: кролики вигідні коли є власний корм (зерно,
            сіно, городина) та налагоджений збут. Без цього — утримання на рівні
            самоокупності.
          </div>
          <div className="economics-alert warn">
            ⚠️ Не вір обіцянкам швидкого збагачення. Кролівництво — це праця і
            системність. Але при правильному підході — стабільний дохід та
            якісне м'ясо для сім'ї гарантовані.
          </div>
        </div>

        {/* СТАРТОВІ ВИТРАТИ */}
        <div className="economics-section-title">
          🔨 Стартові витрати — що потрібно на початку
        </div>
        <div className="economics-note">
          <p>
            Перед тим як рахувати прибуток — треба зрозуміти скільки вкласти на
            старті. Ці витрати разові і амортизуються протягом кількох років.
          </p>
        </div>
        {startupCosts.map((cat) => (
          <div key={cat.category} className="economics-startup-block">
            <h3 className="economics-startup-cat">{cat.category}</h3>
            <div className="economics-startup-items">
              {cat.items.map((item) => (
                <div key={item.item} className="economics-startup-item">
                  <div className="economics-startup-name">{item.item}</div>
                  <div className="economics-startup-price">
                    <span className="economics-price-range">
                      {item.min.toLocaleString("uk-UA")} –{" "}
                      {item.max.toLocaleString("uk-UA")} грн
                    </span>
                  </div>
                  <div className="economics-startup-note">{item.note}</div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="economics-total-box">
          <div className="economics-total-title">
            💰 Орієнтовний стартовий бюджет
          </div>
          <div className="economics-total-grid">
            <div className="economics-total-item">
              <span>Мінімальний старт (10 голів, б/у обладнання)</span>
              <strong>8 000 – 15 000 грн</strong>
            </div>
            <div className="economics-total-item">
              <span>Середній старт (20–30 голів, нові клітки)</span>
              <strong>20 000 – 40 000 грн</strong>
            </div>
            <div className="economics-total-item">
              <span>Повноцінне господарство (50+ голів)</span>
              <strong>50 000 – 120 000 грн</strong>
            </div>
          </div>
        </div>

        {/* ЩОМІСЯЧНІ ВИТРАТИ */}
        <div className="economics-section-title">
          📅 Щомісячні витрати на утримання
        </div>
        {monthlyExpenses.map((cat) => (
          <div key={cat.category} className="economics-expense-block">
            <h3 className="economics-expense-cat">{cat.category}</h3>
            <div className="economics-table-wrap">
              <table className="economics-table">
                <thead>
                  <tr>
                    <th>Стаття витрат</th>
                    <th>Кількість</th>
                    <th>Вартість</th>
                    <th>Примітка</th>
                  </tr>
                </thead>
                <tbody>
                  {cat.items.map((item) => (
                    <tr key={item.item}>
                      <td>
                        <strong>{item.item}</strong>
                      </td>
                      <td>{item.amount}</td>
                      <td className="eco-price">{item.price}</td>
                      <td>{item.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {/* СОБІВАРТІСТЬ 1 КГ */}
        <div className="economics-section-title">
          ⚖️ Із чого складається собівартість 1 кг м'яса
        </div>
        <div className="economics-table-wrap">
          <table className="economics-table">
            <thead>
              <tr>
                <th>Складова витрат</th>
                <th>Частка</th>
                <th>Сума на 1 кг</th>
                <th>Примітка</th>
              </tr>
            </thead>
            <tbody>
              {costPerKg.map((row) => (
                <tr key={row.component}>
                  <td>
                    <strong>{row.component}</strong>
                  </td>
                  <td>{row.share}</td>
                  <td className="eco-price">{row.amount}</td>
                  <td>{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="economics-alert ok">
          ✅ Середня собівартість 1 кг тушки при купованому кормі: 90–130 грн.
          При власному кормі: 40–70 грн. Ринкова ціна тушки: 160–240 грн/кг.
          Маржа: 60–170 грн/кг.
        </div>

        {/* МОДЕЛІ РОЗРАХУНКУ */}
        <div className="economics-section-title">
          📊 Моделі розрахунку доходів
        </div>
        <div className="economics-tabs">
          {revenueCalc.map((model, i) => (
            <button
              key={model.model}
              className={`economics-tab-btn ${activeTab === i ? "active" : ""}`}
              onClick={() => setActiveTab(i)}
            >
              {model.icon} {model.model}
            </button>
          ))}
        </div>

        {revenueCalc.map(
          (model, i) =>
            activeTab === i && (
              <div key={model.model} className="economics-model-card">
                <p className="economics-model-desc">{model.desc}</p>

                <div className="economics-model-grid">
                  <div className="economics-model-params">
                    <div className="economics-model-subtitle">
                      📋 Вихідні дані
                    </div>
                    {model.params.map((p) => (
                      <div key={p.label} className="economics-param-row">
                        <span>{p.label}</span>
                        <strong>{p.value}</strong>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="economics-model-subtitle">
                      💵 Розрахунок доходів
                    </div>
                    {model.calculation.map((c) => (
                      <div key={c.step} className="economics-calc-row income">
                        <span>{c.step}</span>
                        <strong>{c.result}</strong>
                      </div>
                    ))}

                    <div
                      className="economics-model-subtitle"
                      style={{ marginTop: "1rem" }}
                    >
                      📤 Витрати
                    </div>
                    {model.expenses.map((e) => (
                      <div key={e.step} className="economics-calc-row expense">
                        <span>{e.step}</span>
                        <strong>{e.result}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`economics-profit-box ${model.profitType}`}>
                  <strong>{model.profit}</strong>
                </div>
                <div className="economics-model-note">💡 {model.note}</div>
              </div>
            ),
        )}

        {/* ТОЧКА БЕЗЗБИТКОВОСТІ */}
        <div className="economics-section-title">
          📈 Точка беззбитковості по кількості самок
        </div>
        <div className="economics-note">
          <p>
            Таблиця показує орієнтовні показники при продажі м'яса тушками по
            180 грн/кг і середньому рівні витрат. Власний корм не враховується.
          </p>
        </div>
        <div className="economics-table-wrap">
          <table className="economics-table">
            <thead>
              <tr>
                <th>Самок для розведення</th>
                <th>Дохід за рік</th>
                <th>Витрати за рік</th>
                <th>Прибуток</th>
                <th>Окупність стартових витрат</th>
              </tr>
            </thead>
            <tbody>
              {breakeven.map((row) => (
                <tr key={row.heads}>
                  <td>
                    <strong>{row.heads} самок</strong>
                  </td>
                  <td className="eco-income">{row.income_year}</td>
                  <td className="eco-expense">{row.expenses_year}</td>
                  <td
                    className={`eco-profit ${parseInt(row.profit) > 0 ? "positive" : ""}`}
                  >
                    {row.profit}
                  </td>
                  <td>{row.payback}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* РИЗИКИ */}
        <div className="economics-section-title">
          ⚠️ Основні ризики та як їх мінімізувати
        </div>
        <div className="economics-risks">
          {risksAndSolutions.map((r) => (
            <div key={r.risk} className="economics-risk-card">
              <div className="economics-risk-top">
                <strong className="economics-risk-name">⚠️ {r.risk}</strong>
                <div className="economics-risk-meta">
                  <span className="economics-risk-prob">
                    Ймовірність: {r.probability}
                  </span>
                  <span className="economics-risk-impact">
                    Вплив: {r.impact}
                  </span>
                </div>
              </div>
              <div className="economics-risk-solution">
                <span>✅</span>
                <p>{r.solution}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ПОРАДИ */}
        <div className="economics-section-title">
          💡 Як підвищити рентабельність
        </div>
        <div className="economics-tips-grid">
          {profitTips.map((tip) => (
            <article key={tip.title} className="economics-tip-card">
              <span className="economics-tip-icon">{tip.icon}</span>
              <div>
                <strong className="economics-tip-title">{tip.title}</strong>
                <p>{tip.desc}</p>
              </div>
            </article>
          ))}
        </div>

        {/* ВИСНОВОК */}
        <div className="economics-conclusion">
          <h2>🎯 Підсумок — чи варто починати?</h2>
          <div className="economics-conclusion-grid">
            <div className="economics-conclusion-yes">
              <h3>✅ Варто якщо:</h3>
              <ul>
                <li>Є власне зерно або ділянка для трав</li>
                <li>Є вільний час — 1–2 год на день</li>
                <li>Є де тримати — хоч невеличкий сарай</li>
                <li>Є збут — хоч сусіди та знайомі</li>
                <li>Готовий вчитися та вести записи</li>
                <li>Мета — якісне м'ясо для сім'ї + невеликий дохід</li>
              </ul>
            </div>
            <div className="economics-conclusion-no">
              <h3>❌ Краще не починати якщо:</h3>
              <ul>
                <li>Весь корм доведеться купувати</li>
                <li>Немає часу — тварини вимагають щоденного догляду</li>
                <li>Немає місця для кліток</li>
                <li>Не готовий до втрат — тварини іноді гинуть</li>
                <li>Очікуєш швидкого великого прибутку</li>
                <li>Немає ніякого збуту навіть серед знайомих</li>
              </ul>
            </div>
          </div>
          <div className="economics-alert ok" style={{ marginTop: "1rem" }}>
            ✅ Стартуй з 3–5 самок. Навчись, налагодь процеси, знайди покупців —
            потім розширюй. Краще маленький але впевнений старт ніж великі
            вкладення без досвіду.
          </div>
        </div>

        <div className="economics-back">
          <Link to="/" className="economics-back-btn">
            ⬅ На головну
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Economics;
