import { Link } from "react-router-dom";
import "./Feeders.css";

// ---- ДАНІ ----

const feederTypes = [
  {
    icon: "📦",
    name: "Бункерна",
    best: "Комбікорм, гранули, зерно",
    capacity: "0.5–20 кг",
    heads: "1–10 голів",
    pros: [
      "Корм підсипається раз на кілька днів",
      "Кролі не можуть вигребти корм",
      "Економить час кролівника",
    ],
    cons: [
      "Не підходить для вологих кормів і коренеплодів",
      "Складніше виготовити своїми руками",
    ],
    note: "Найкращий вибір для комбікорму у великих господарствах. Метод Золотухіна та Маклякова — саме бункерний тип.",
    material: "Метал (оцинковка), фанера + жерсть",
  },
  {
    icon: "🍽️",
    name: "Лоткова (жолобкова)",
    best: "Зернові, гранули, мішанки",
    capacity: "до 1 кг",
    heads: "1–4 голови",
    pros: [
      "Проста у виготовленні",
      "Зручно чистити",
      "Підходить для підгодівлі молодняку",
    ],
    cons: [
      "Кролі можуть залазити і забруднювати корм",
      "Потребує частого наповнення",
    ],
    note: "Класичний варіант для невеликих кліток і маточників. Розмір на 1 голову — 50×100 мм.",
    material: "Дерево + жерсть всередині, метал, пластик",
  },
  {
    icon: "🥣",
    name: "Чашкова (миска)",
    best: "Соковиті корми, мішанки, коренеплоди",
    capacity: "0.3–1 кг",
    heads: "1–2 голови",
    pros: [
      "Зручна для вологих і соковитих кормів",
      "Легко мити",
      "Дешева або безкоштовна (консервна банка)",
    ],
    cons: [
      "Легко перекидається якщо не закріплена",
      "Кролі можуть сидіти в ній і забруднювати",
      "Тільки для разової підгодівлі",
    ],
    note: "Для щоденного давання коренеплодів і мішанок. Кріпити до сітки дротом — обов'язково.",
    material: "Кераміка, нержавіюча сталь, консервна банка",
  },
  {
    icon: "🏗️",
    name: "Навісна зовнішня",
    best: "Комбікорм, зерно",
    capacity: "1–3 кг",
    heads: "1–3 голови",
    pros: [
      "Не займає місце всередині клітки",
      "Легко наповнювати без відкривання клітки",
      "Корм не забруднюється від тварин",
    ],
    cons: [
      "Підходить тільки для сухих кормів",
      "Потребує отвору або прорізу в стінці клітки",
    ],
    note: "Система Золотухіна — годівниця на дверцятах, 1/3 всередині, 2/3 зовні. Наповнювати не заходячи в клітку.",
    material: "Дерево + оцинкована жерсть",
  },
];

const bunkerDimensions = [
  {
    purpose: "На 1 голову (одиночна клітка)",
    width: "100–120 мм",
    height: "200–250 мм",
    depth: "80–100 мм",
    volume: "0.5–1 л",
    note: "Наповнення раз на 2–3 дні",
  },
  {
    purpose: "На 2–4 голови (молодняк)",
    width: "200–300 мм",
    height: "250–300 мм",
    depth: "100–120 мм",
    volume: "2–4 л",
    note: "Стандарт для відгодівельних кліток",
  },
  {
    purpose: "На 5–8 голів (групова клітка)",
    width: "400–500 мм",
    height: "300–350 мм",
    depth: "120–150 мм",
    volume: "6–10 л",
    note: "Наповнення раз на 3–5 днів",
  },
  {
    purpose: "Промислова (Макляк-1, 10+ голів)",
    width: "500–600 мм",
    height: "400–500 мм",
    depth: "150–200 мм",
    volume: "до 20 кг",
    note: "Наповнення раз на тиждень",
  },
];

const bunkerBuildSteps = [
  {
    num: "1",
    title: "Матеріал і розкрій",
    text: "Найкращий варіант — оцинкована жерсть 0.5–0.8 мм або фанера 5 мм + жерстяна оббивка всередині. Деталі: задня стінка, передня (нижча на 50–70 мм), два бічних трикутника, дно під кутом 35–40°, кришка.",
  },
  {
    num: "2",
    title: "Ключові кути нахилу",
    text: "Дно годівниці нахилено під кутом 35–40° — корм самотічно сповзає до годівної щілини. Щілина внизу між дном і передньою стінкою — 25–35 мм. Менше — корм застрягає, більше — кролі вигрібають лапами.",
    alert: {
      type: "ok",
      text: "✅ Щілина 25–30 мм — для дрібного зерна і гранул. 30–35 мм — для крупного зерна та кормосумішей.",
    },
  },
  {
    num: "3",
    title: "Захист від гризіння",
    text: "Всі дерев'яні краї, до яких мають доступ кролі, обшити жерстяним куточком або відрізком оцинковки. Особливо — верхній край передньої стінки, де тварини найбільше гризуть.",
  },
  {
    num: "4",
    title: "Кріплення до клітки",
    text: "Зовнішня частина — більша (2/3 об'єму). Кріпити на рівні грудей кролика — дно годівниці на висоті 100–150 мм від підлоги. Занизько — кролі сядуть зверху, зависоко — молодняк не дістане.",
    alert: {
      type: "warn",
      text: "⚠️ Перевірити: кроленята від 3 тижнів мають вільно дотягнутися до корму.",
    },
  },
];

const hayrackTypes = [
  {
    icon: "🔺",
    name: "V-подібний (ясельний)",
    desc: "Дві сітчасті стінки під кутом 45° з'єднані знизу. З торця — форма букви V. Сіно засипають зверху, кролі тягнуть через сітку по одній пучці.",
    dims: "Ширина 40–50 см, висота стінок 30–40 см, кут між стінками 90°",
    best: "Групові клітки, здвоєні клітки між двома відсіками",
    material: "Дерев'яні рейки 25×25 мм + металева сітка 50×50 мм",
    pros: "Зручний доступ з обох боків, велика ємність, сіно не розсипається",
    color: "green",
  },
  {
    icon: "📐",
    name: "Трикутний (кутовий)",
    desc: "Трикутна конструкція, що кріпиться в кут клітки. Одна сторона — стінка клітки, дві — сітка або прути. Засипається зверху.",
    dims: "Сторони 25–35 см, висота 30–40 см",
    best: "Одиночні клітки, маточники, невеликі клітки",
    material: "Дріт 3–4 мм або прут 6–8 мм, кут нахилу прутів 6–8 см",
    pros: "Мінімум місця, простий у виготовленні",
    color: "blue",
  },
  {
    icon: "📋",
    name: "Плоский навісний",
    desc: "Прямокутна рамка з сіткою, що кріпиться зовні на сітчасту стінку або дверцята. Сіно закладається через відкидну кришку ззовні.",
    dims: "30×40 см або 40×50 см залежно від ширини клітки",
    best: "Зовнішнє кріплення, мінімізація простору всередині",
    material: "Куточок 25×25 мм + сітка або прут, кришка на петлях",
    pros: "Не займає місце в клітці, зручне поповнення",
    color: "orange",
  },
  {
    icon: "🔧",
    name: "Трубний (з ПВХ труби)",
    desc: "Пластикова труба діаметром 110 мм, розрізана по довжині або з бічним отвором. Найпростіший варіант — 5 хвилин роботи.",
    dims: "Довжина 30–50 см, отвір 15–20 см шириною",
    best: "Декоративні кролі, тимчасове рішення",
    material: "ПВХ каналізаційна труба 110 мм, дріт для кріплення",
    pros: "Найдешевший варіант, легко мити, не гниє",
    color: "gray",
  },
];

const hayrackDimensions = [
  {
    heads: "1 кролик",
    width: "20–25 см",
    height: "25–30 см",
    depth: "15 см",
    note: "Кутовий або трубний тип",
  },
  {
    heads: "2–3 кролики",
    width: "30–40 см",
    height: "30–35 см",
    depth: "20 см",
    note: "Плоский навісний або трикутний",
  },
  {
    heads: "4–6 кроликів",
    width: "40–50 см",
    height: "35–40 см",
    depth: "25 см",
    note: "V-подібний між відсіками",
  },
  {
    heads: "7–10 кроликів",
    width: "60–80 см",
    height: "40–50 см",
    depth: "25–30 см",
    note: "V-подібний або два навісних",
  },
];

const hayrackBuildVshape = [
  {
    num: "1",
    title: "Деталі",
    text: "4 бічних ребра по 40 см, 3 поздовжніх ребра по 50–60 см (одне нижнє, два верхніх). Рейка 25×25 мм або дріт 4 мм. Два сітчасті прямокутники 30×40 см з осередком 50×50 мм.",
  },
  {
    num: "2",
    title: "Збірка П-елементів",
    text: "З двох бічних і одного поздовжнього ребра зробити П-подібну рамку. Повторити — отримаємо дві однакові рамки.",
  },
  {
    num: "3",
    title: "З'єднання під кутом",
    text: "Скріпити обидві П-рамки нижнім поздовжнім ребром так, щоб вийшла V-форма при погляді з торця. Кут між стінками — 90°.",
  },
  {
    num: "4",
    title: "Обтяжка сіткою",
    text: "Натягнути сітчасті прямокутники на обидві стінки, закріпити дротом або скобами. Гострі кінці дроту загнути всередину або закрити куточком.",
    alert: {
      type: "warn",
      text: "⚠️ Осередок сітки не менше 50×50 мм — кролі мають вільно витягувати пучки сіна.",
    },
  },
];

const materials = [
  {
    name: "Оцинкована жерсть 0.5–0.8 мм",
    use: "Бункерні годівниці, внутрішнє облицювання дерева",
    pros: "Не гниє, не іржавіє, легко гнеться, не прогризається",
    cons: "Потрібні ножиці по металу або болгарка, краї гострі",
    rating: 5,
  },
  {
    name: "Фанера 5–8 мм",
    use: "Основа бункерів, корпус годівниць",
    pros: "Дешева, проста в обробці, легко кроїти",
    cons: "Гниє від вологи, кролі гризуть — потрібна оббивка жерстю",
    rating: 3,
  },
  {
    name: "Металева сітка 50×50 мм, дріт 2–3 мм",
    use: "Сінники, стінки годівниць для сіна",
    pros: "Ідеальний розмір осередку, довговічна",
    cons: "Гострі зрізи потребують обробки",
    rating: 5,
  },
  {
    name: "ПВХ труба 110 мм",
    use: "Прості сінники, жолобкові годівниці",
    pros: "Дешево, не гниє, легко мити, зручно кроїти",
    cons: "Кролі можуть гризти пластик при нестачі мінералів",
    rating: 4,
  },
  {
    name: "Нержавіюча сталь",
    use: "Чашкові годівниці, поїлки",
    pros: "Гігієнічна, довговічна, не іржавіє",
    cons: "Дорожча за інші матеріали",
    rating: 5,
  },
  {
    name: "Дерево (дошка, брусок)",
    use: "Каркас сінників, рейки V-сінника",
    pros: "Доступно, просто обробляти",
    cons: "Гниє, кролі гризуть — обов'язкова оббивка контактних поверхонь",
    rating: 3,
  },
];

const installationRules = [
  {
    icon: "📏",
    rule: "Висота дна годівниці від підлоги: 100–150 мм для дорослих, 80–100 мм для молодняку",
  },
  {
    icon: "📍",
    rule: "Сінник — на рівні голови кролика або трохи вище: 150–200 мм від підлоги",
  },
  {
    icon: "🔒",
    rule: "Кожна годівниця надійно закріплена — кролі перекинуть незакріплене за 10 хвилин",
  },
  {
    icon: "↔️",
    rule: "Фронт годування: мінімум 10 см на одну голову для лоткових і жолобкових годівниць",
  },
  {
    icon: "🚪",
    rule: "Бункерна годівниця: 1/3 всередині клітки, 2/3 зовні — наповнення без відкривання клітки",
  },
  {
    icon: "🌊",
    rule: "Чашки для мокрих кормів — окремо від сухих годівниць, на відстані від сінника",
  },
  {
    icon: "🧹",
    rule: "Всі годівниці мають бути знімними або мати відкидне дно для щотижневої чистки",
  },
  {
    icon: "☀️",
    rule: "Уникати прямого сонця на годівниці — корм пліснявіє і прокисає вдвічі швидше",
  },
];

const maintenanceTips = [
  {
    freq: "Щодня",
    task: "Прибрати залишки вологих кормів (мішанки, коренеплоди, трава)",
  },
  { freq: "Щодня", task: "Перевірити наявність корму в бункерних годівницях" },
  {
    freq: "1 раз на тиждень",
    task: "Повне очищення всіх годівниць від залишків корму і пилу",
  },
  {
    freq: "1 раз на тиждень",
    task: "Провітрити і струсити сінник від трухи і пилу",
  },
  {
    freq: "1–2 рази на місяць",
    task: "Дезінфекція годівниць: розчин хлораміну або окропу, просушка",
  },
  {
    freq: "1 раз на місяць",
    task: "Перевірити кріплення — розшатані годівниці підтягнути або замінити",
  },
  {
    freq: "За потреби",
    task: "Замінити зношені або прогризені годівниці — гострі краї небезпечні",
  },
];

const commonMistakes = [
  {
    mistake: "Дерев'яні краї без оббивки",
    result: "Кролі прогризуть за 1–2 тижні",
    fix: "Обшити всі доступні краї жерстяним куточком або оцинковкою",
  },
  {
    mistake: "Занизька годівниця",
    result: "Кролі сідають всередину, забруднюють корм",
    fix: "Дно на висоті 100–150 мм, передня стінка вище 80–100 мм",
  },
  {
    mistake: "Велика щілина бункера (>40 мм)",
    result: "Кролі вигрібають корм лапами — розсипання і забруднення",
    fix: "Щілина 25–35 мм залежно від фракції корму",
  },
  {
    mistake: "Сіно в звичайній годівниці або на підлозі",
    result: "Кролі розкидають, мочаться на нього, потім не їдять",
    fix: "Тільки сінник — ніяк інакше",
  },
  {
    mistake: "Один сінник на 5+ голів малого розміру",
    result: "Конкуренція за їжу — слабкі недоїдають",
    fix: "Фронт сінника — мінімум 10 см на голову. При групі 5+ — два сінники",
  },
  {
    mistake: "Незнімна годівниця",
    result: "Неможливо нормально почистити — бактерії, цвіль",
    fix: "Передбачити кріплення на гачках або болтах, щоб можна було зняти",
  },
];

const Feeders = () => {
  return (
    <main className="feeders-page">
      <div className="feeders-header">
        <h1>Годівниці та сінники</h1>
        <p>Типи, розміри, матеріали, виготовлення своїми руками</p>
      </div>

      <div className="feeders-wrap">
        {/* ТИПИ ГОДІВНИЦЬ */}
        <div className="feeders-section-title">
          🍽️ Типи годівниць — порівняння
        </div>
        <div className="feeders-grid-2">
          {feederTypes.map((f) => (
            <article className="feeders-type-card" key={f.name}>
              <div className="feeders-type-header">
                <span className="feeders-type-icon">{f.icon}</span>
                <div>
                  <strong className="feeders-type-name">{f.name}</strong>
                  <span className="feeders-type-meta">
                    {f.heads} · {f.best}
                  </span>
                </div>
              </div>
              <div className="feeders-type-body">
                <div className="feeders-pros-cons">
                  <div>
                    {f.pros.map((p) => (
                      <div key={p} className="feeders-pro">
                        ✅ {p}
                      </div>
                    ))}
                  </div>
                  <div>
                    {f.cons.map((c) => (
                      <div key={c} className="feeders-con">
                        ❌ {c}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="feeders-type-note">{f.note}</div>
                <div className="feeders-type-material">
                  <span className="material-label">Матеріал:</span> {f.material}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* РОЗМІРИ БУНКЕРА */}
        <div className="feeders-section-title">
          📐 Розміри бункерної годівниці
        </div>
        <div
          className="feeders-note"
          style={{ padding: 0, overflow: "hidden" }}
        >
          <div style={{ overflowX: "auto" }}>
            <table className="feeders-table">
              <thead>
                <tr>
                  <th>Призначення</th>
                  <th>Ширина</th>
                  <th>Висота</th>
                  <th>Глибина</th>
                  <th>Об'єм</th>
                  <th>Примітка</th>
                </tr>
              </thead>
              <tbody>
                {bunkerDimensions.map((row) => (
                  <tr key={row.purpose}>
                    <td>
                      <strong>{row.purpose}</strong>
                    </td>
                    <td>{row.width}</td>
                    <td>{row.height}</td>
                    <td>{row.depth}</td>
                    <td>{row.volume}</td>
                    <td>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ВИГОТОВЛЕННЯ БУНКЕРА */}
        <div className="feeders-section-title">
          🔧 Як зробити бункерну годівницю — ключові моменти
        </div>
        <div className="feeders-note">
          <div className="feeders-steps">
            {bunkerBuildSteps.map((step) => (
              <div className="feeders-step" key={step.num}>
                <div className="feeders-step-num">{step.num}</div>
                <div className="feeders-step-content">
                  <strong>{step.title}</strong>
                  <p>{step.text}</p>
                  {step.alert && (
                    <div className={`feeders-inline-alert ${step.alert.type}`}>
                      {step.alert.text}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="feeders-alert ok">
          ✅ Система Золотухіна: бункерна годівниця вмонтована в дверцята.
          Наповнення через зовнішній бік — без відкривання клітки і без стресу
          для тварин. Оптимальне рішення для господарства від 5 кліток.
        </div>

        {/* СІННИКИ — ТИПИ */}
        <div className="feeders-section-title">
          🌾 Сінники — типи та особливості
        </div>
        <div className="feeders-grid-2">
          {hayrackTypes.map((h) => (
            <article className={`feeders-hay-card hay-${h.color}`} key={h.name}>
              <div className="feeders-hay-header">
                <span className="feeders-hay-icon">{h.icon}</span>
                <strong className="feeders-hay-name">{h.name}</strong>
              </div>
              <p className="feeders-hay-desc">{h.desc}</p>
              <div className="feeders-hay-dims">
                <span className="dims-label">Розміри:</span> {h.dims}
              </div>
              <div className="feeders-hay-meta">
                <div>
                  <span className="dims-label">Матеріал:</span> {h.material}
                </div>
                <div>
                  <span className="dims-label">Найкраще для:</span> {h.best}
                </div>
                <div className="feeders-hay-pros">✅ {h.pros}</div>
              </div>
            </article>
          ))}
        </div>

        {/* РОЗМІРИ СІННИКА */}
        <div className="feeders-section-title">
          📏 Розміри сінника залежно від кількості голів
        </div>
        <div
          className="feeders-note"
          style={{ padding: 0, overflow: "hidden" }}
        >
          <div style={{ overflowX: "auto" }}>
            <table className="feeders-table">
              <thead>
                <tr>
                  <th>Кількість голів</th>
                  <th>Ширина</th>
                  <th>Висота</th>
                  <th>Глибина</th>
                  <th>Рекомендований тип</th>
                </tr>
              </thead>
              <tbody>
                {hayrackDimensions.map((row) => (
                  <tr key={row.heads}>
                    <td>
                      <strong>{row.heads}</strong>
                    </td>
                    <td>{row.width}</td>
                    <td>{row.height}</td>
                    <td>{row.depth}</td>
                    <td>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="feeders-alert warn">
          ⚠️ Фронт сінника — мінімум 10 см на голову. При групі 5+ кроликів
          краще зробити два сінники — сильніші не будуть відганяти слабших.
        </div>

        {/* ВИГОТОВЛЕННЯ V-СІННИКА */}
        <div className="feeders-section-title">
          🔺 Як зробити V-подібний сінник
        </div>
        <div className="feeders-note">
          <div className="feeders-steps">
            {hayrackBuildVshape.map((step) => (
              <div className="feeders-step" key={step.num}>
                <div className="feeders-step-num">{step.num}</div>
                <div className="feeders-step-content">
                  <strong>{step.title}</strong>
                  <p>{step.text}</p>
                  {step.alert && (
                    <div className={`feeders-inline-alert ${step.alert.type}`}>
                      {step.alert.text}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* МАТЕРІАЛИ */}
        <div className="feeders-section-title">
          🪵 Матеріали — що і коли використовувати
        </div>
        <div className="feeders-grid-3">
          {materials.map((m) => (
            <article className="feeders-material-card" key={m.name}>
              <div className="feeders-material-header">
                <strong className="feeders-material-name">{m.name}</strong>
                <div className="feeders-stars">
                  {"★".repeat(m.rating)}
                  {"☆".repeat(5 - m.rating)}
                </div>
              </div>
              <div className="feeders-material-use">
                <span className="dims-label">Застосування:</span> {m.use}
              </div>
              <div className="feeders-pro-small">✅ {m.pros}</div>
              <div className="feeders-con-small">❌ {m.cons}</div>
            </article>
          ))}
        </div>

        {/* ВСТАНОВЛЕННЯ */}
        <div className="feeders-section-title">⚙️ Правила встановлення</div>
        <div className="feeders-grid-2-rules">
          {installationRules.map((item) => (
            <article className="feeders-rule-card" key={item.rule}>
              <span className="feeders-rule-icon">{item.icon}</span>
              <p>{item.rule}</p>
            </article>
          ))}
        </div>

        {/* ТИПОВІ ПОМИЛКИ */}
        <div className="feeders-section-title">
          ❌ Типові помилки та як їх уникнути
        </div>
        <div className="feeders-grid-2">
          {commonMistakes.map((m) => (
            <article className="feeders-mistake-card" key={m.mistake}>
              <strong className="feeders-mistake-title">❌ {m.mistake}</strong>
              <p className="feeders-mistake-result">Наслідок: {m.result}</p>
              <p className="feeders-mistake-fix">✅ {m.fix}</p>
            </article>
          ))}
        </div>

        {/* ОБСЛУГОВУВАННЯ */}
        <div className="feeders-section-title">
          🧹 Обслуговування — графік чистки
        </div>
        <div
          className="feeders-note"
          style={{ padding: 0, overflow: "hidden" }}
        >
          <div style={{ overflowX: "auto" }}>
            <table className="feeders-table">
              <thead>
                <tr>
                  <th>Частота</th>
                  <th>Дія</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceTips.map((row) => (
                  <tr key={row.task}>
                    <td>
                      <span
                        className={`feeders-freq-badge ${row.freq === "Щодня" ? "freq-daily" : row.freq.includes("тиждень") ? "freq-week" : "freq-month"}`}
                      >
                        {row.freq}
                      </span>
                    </td>
                    <td>{row.task}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ПІДСУМОК */}
        <div className="feeders-section-title">📋 Коротко — головне</div>
        <div className="feeders-note">
          <ul>
            <li>
              <strong>Бункерна годівниця</strong> — найкраще для комбікорму і
              зерна. Економить час, не дає розсипати корм.
            </li>
            <li>
              <strong>Чашка або лоток</strong> — для коренеплодів і мішанок.
              Щодня прибирати залишки.
            </li>
            <li>
              <strong>Сінник — обов'язковий</strong> у кожній клітці. Сіно на
              підлозі — це нарушена гігієна і гроші на вітер.
            </li>
            <li>
              <strong>V-подібний сінник між двома відсіками</strong> —
              найефективніше рішення для здвоєних кліток.
            </li>
            <li>
              <strong>Всі дерев'яні краї — обшити жерстю.</strong> Без цього
              годівниця протримається 1–2 тижні.
            </li>
            <li>
              <strong>Висота дна від підлоги: 100–150 мм</strong> — кролі не
              залізуть, молодняк дістане.
            </li>
            <li>
              <strong>Чистка раз на тиждень</strong> — затхлий корм і цвіль у
              годівниці призводять до ентериту.
            </li>
          </ul>
        </div>

        <div className="feeders-back">
          <Link to="/" className="feeders-back-btn">
            ⬅ На головну
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Feeders;
