import { Link } from "react-router-dom";
import "./MatingFrequency.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const schemesData = [
  {
    id: "intensive",
    icon: "⚡",
    title: "Інтенсивна схема",
    subtitle: "Ущільнені окроли",
    badge: "До 8 окролів/рік",
    badgeColor: "red",
    matingDay: "День 1–3 після окролу",
    weaningDay: "Відлучення на 21–28 день",
    okrols: "6–8 окролів на рік",
    pros: [
      "Максимальна продуктивність — до 8 окролів від самки на рік",
      "Швидкий оборот стада",
      "Оптимально для промислових комплексів",
    ],
    cons: [
      "Самка зношується за 6–8 місяців — рання вибракування",
      "Високий ризик маститу через одночасну лактацію та вагітність",
      "Раннє відлучення = стрес молодняку → кокцидіоз, ентерит",
      "Потребує ідеального мікроклімату та гігієни",
    ],
    conditions: [
      "Виключно закриті приміщення (indoor) з жорстким мікрокліматом",
      "Регулярне термічне знезараження кліток вогнем",
      "Підлога суворо за нормами добробуту — інакше гарантований пододерматит",
      "Ніпельне напування з регулярною промивкою системи",
    ],
    diet: [
      "Тільки високоенергетичний промисловий комбікорм",
      "Точний баланс амінокислот: лізин + метіонін (соєвий шрот + люцерна)",
      "Без точного розрахунку самка не витягне лактацію і скине плоди",
    ],
    suitable: "Промислові комплекси, досвідчені фермери",
    notSuitable: "Домашнє господарство, початківці",
  },
  {
    id: "semi",
    icon: "⚖️",
    title: "Напівінтенсивна схема",
    subtitle: "Напівущільнені окроли",
    badge: "Золотий стандарт",
    badgeColor: "gold",
    matingDay: "День 10–21 після окролу",
    weaningDay: "Відлучення на 35–45 день",
    okrols: "6–7 окролів на рік",
    pros: [
      "Оптимальний баланс продуктивності та здоров'я самки",
      "Підходить для сучасних комерційних ферм",
      "Міцне покоління при племінній роботі без виснаження стада",
      "Кроленята отримують достатньо молока",
    ],
    cons: [
      "Потребує чіткого графіка вакцинації",
      "Щеплення не повинні накладатись на критичні періоди кітності/лактації",
      "Вимагає стабільної якості кормів",
    ],
    conditions: [
      "Підходить для закритих ферм і добре облаштованих шедів",
      "Потрібен журнал злучок та окролів для контролю термінів",
      "Регулярний контроль мікроклімату",
    ],
    diet: [
      "Якісний повнораціонний гранульований корм",
      "Зміни якості компонентів компенсувати преміксами",
      "Зниження протеїну в соняшнику → молочність впаде до відлучення",
    ],
    suitable:
      "Комерційні ферми, м'ясні породи (Каліфорнійська, Полтавське срібло)",
    notSuitable: "Примітивні умови утримання",
  },
  {
    id: "extensive",
    icon: "🌿",
    title: "Екстенсивна схема",
    subtitle: "Традиційна",
    badge: "3–4 окроли/рік",
    badgeColor: "green",
    matingDay: "Після відлучення кроленят (день 45–60)",
    weaningDay: "Відлучення на 45–60 день",
    okrols: "3–4 окроли на рік",
    pros: [
      "Самка використовується 2–3 роки без зношування",
      "Кроленята отримують молоко тривалий час → сильний природний імунітет",
      "Мінімальний ризик виснаження тварини",
      "Прощає дрібні огріхи в санітарії та раціоні",
    ],
    cons: [
      "Низька рентабельність — лише 3–4 окроли на рік",
      "Велика площа кліток для тривалого утримання молодняку з матір'ю",
    ],
    conditions: [
      "Підходить для вуличного утримання, ям, простих дерев'яних кліток",
      "Простіші вимоги до мікроклімату",
    ],
    diet: [
      "Сіно, зерносуміші (овес, ячмінь), соковиті корми",
      "Точне балансування амінокислот не критичне — є час на відновлення",
      "Але! Контроль мікроелементів обов'язковий навіть при екстенсивній схемі",
    ],
    suitable: "Домашні господарства, початківці, декоративні кролі",
    notSuitable: "Комерційне виробництво",
  },
];

const comparisonRows = [
  {
    param: "Злучка після окролу",
    intensive: "День 1–3",
    semi: "День 10–21",
    extensive: "Після відлучення (день 45–60)",
  },
  {
    param: "Відлучення молодняку",
    intensive: "21–28 день",
    semi: "35–45 день",
    extensive: "45–60 день",
  },
  { param: "Окролів на рік", intensive: "6–8", semi: "6–7", extensive: "3–4" },
  {
    param: "Термін використання самки",
    intensive: "6–8 місяців",
    semi: "1–1.5 року",
    extensive: "2–3 роки",
  },
  {
    param: "Ризик для здоров'я самки",
    intensive: "Високий",
    semi: "Середній",
    extensive: "Низький",
  },
  {
    param: "Вимоги до корму",
    intensive: "Дуже високі",
    semi: "Високі",
    extensive: "Помірні",
  },
  {
    param: "Вимоги до умов",
    intensive: "Промислові",
    semi: "Комерційні",
    extensive: "Домашні",
  },
  {
    param: "Рентабельність",
    intensive: "Максимальна",
    semi: "Висока",
    extensive: "Помірна",
  },
];

const matingRules = [
  {
    icon: "📍",
    title: "Самку — до самця, не навпаки",
    desc: "На чужій території самка агресивна і може покалічити самця. Завжди підсаджуйте самку в клітку до самця.",
  },
  {
    icon: "⏱️",
    title: "15–30 хвилин разом",
    desc: "Залишити разом на 15–30 хвилин. Нормальна злучка — самець падає набік після садки та видає характерний звук.",
  },
  {
    icon: "🔄",
    title: "Контрольна злучка",
    desc: "Через 6–12 годин повторити злучку. Одна результативна садка достатня, але контрольна підвищує надійність.",
  },
  {
    icon: "📝",
    title: "Записати дату",
    desc: "Від дати злучки рахують вагітність (28–32 дні) та готують маточник. Без запису — не буде контролю.",
  },
  {
    icon: "🔍",
    title: "Перевірка на тільність",
    desc: "На 12–14 день пальпація: округлі ущільнення розміром з горіх. Або контрольна злучка — агресія = тільна.",
  },
  {
    icon: "🚫",
    title: "Не тримати разом тривало",
    desc: "Тривале перебування разом не підвищує результат, але збільшує стрес самки та ризик травм.",
  },
];

const ageReadiness = [
  {
    breed: "Дрібні породи (до 3 кг)",
    female: "4–4.5 місяці",
    male: "4.5–5 місяців",
    note: "Карлики, декоративні",
  },
  {
    breed: "Середні породи (3–5 кг)",
    female: "4.5–5 місяців",
    male: "5–6 місяців",
    note: "Шиншила, Рекс, Метелик",
  },
  {
    breed: "Великі породи (5–7 кг)",
    female: "5–6 місяців",
    male: "6–7 місяців",
    note: "Каліфорнійська, Новозеландська",
  },
  {
    breed: "Великани (7+ кг)",
    female: "6–7 місяців",
    male: "7–8 місяців",
    note: "Фландр, Сірий велетень",
  },
];

const maleLoad = [
  {
    age: "Молодий (6–8 міс)",
    load: "1–2 злучки на тиждень",
    rest: "5–6 днів між злучками",
    note: "Дати сформуватись",
  },
  {
    age: "Робочий (8 міс – 3 роки)",
    load: "До 5–7 злучок на тиждень",
    rest: "1 день відпочинку після 2 злучок",
    note: "Оптимальний вік",
  },
  {
    age: "Старший (3+ роки)",
    load: "2–3 злучки на тиждень",
    rest: "Контролювати якість посліду",
    note: "Знижується активність",
  },
];

const MatingPage = () => {
  return (
    <main className="mat-page">
      <div className="mat-header">
        <h1>Як часто можна злучати кролицю</h1>
        <p>
          Три схеми відтворення — інтенсивна, напівінтенсивна, екстенсивна. Від
          А до Я.
        </p>
      </div>

      <div className="mat-wrap">
        {/* ВСТУП */}
        <div className="mat-intro">
          <p>
            Частота злучування кролиць залежить від обраної стратегії
            відтворення, якості кормів та умов утримання. В кролівництві
            застосовують <strong>три основні схеми</strong>. Кожна має свої
            вимоги до фізіології тварини та менеджменту господарства. Обирайте
            схему виходячи з ваших умов — а не з бажання «отримати більше».
          </p>
        </div>

        {/* ТРИ СХЕМИ */}
        <div className="mat-section-title">📊 Три схеми злучування</div>

        <div className="mat-schemes">
          {schemesData.map((scheme) => (
            <div
              key={scheme.id}
              className={`mat-scheme mat-scheme--${scheme.id}`}
            >
              <div className="mat-scheme-head">
                <div className="mat-scheme-left">
                  <span className="mat-scheme-icon">{scheme.icon}</span>
                  <div>
                    <h2>{scheme.title}</h2>
                    <span className="mat-scheme-sub">{scheme.subtitle}</span>
                  </div>
                </div>
                <span
                  className={`mat-scheme-badge mat-scheme-badge--${scheme.badgeColor}`}
                >
                  {scheme.badge}
                </span>
              </div>

              <div className="mat-scheme-timing">
                <div className="mat-timing-item">
                  <span className="mat-timing-label">Злучка</span>
                  <span className="mat-timing-val">{scheme.matingDay}</span>
                </div>
                <div className="mat-timing-divider">→</div>
                <div className="mat-timing-item">
                  <span className="mat-timing-label">Відлучення</span>
                  <span className="mat-timing-val">{scheme.weaningDay}</span>
                </div>
                <div className="mat-timing-divider">→</div>
                <div className="mat-timing-item">
                  <span className="mat-timing-label">Підсумок</span>
                  <span className="mat-timing-val mat-timing-val--accent">
                    {scheme.okrols}
                  </span>
                </div>
              </div>

              <div className="mat-scheme-body">
                <div className="mat-scheme-col">
                  <div className="mat-col-label mat-col-label--green">
                    ✓ Переваги
                  </div>
                  <ul>
                    {scheme.pros.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
                <div className="mat-scheme-col">
                  <div className="mat-col-label mat-col-label--red">
                    ✗ Ризики та мінуси
                  </div>
                  <ul>
                    {scheme.cons.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
                <div className="mat-scheme-col">
                  <div className="mat-col-label mat-col-label--blue">
                    🏠 Умови утримання
                  </div>
                  <ul>
                    {scheme.conditions.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
                <div className="mat-scheme-col">
                  <div className="mat-col-label mat-col-label--brown">
                    🌾 Раціон
                  </div>
                  <ul>
                    {scheme.diet.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mat-scheme-footer">
                <div className="mat-suitable">
                  <span className="mat-suitable-label ok">✓ Підходить:</span>
                  <span>{scheme.suitable}</span>
                </div>
                <div className="mat-suitable">
                  <span className="mat-suitable-label no">✗ Не підходить:</span>
                  <span>{scheme.notSuitable}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ПОРІВНЯЛЬНА ТАБЛИЦЯ */}
        <div className="mat-section-title">📋 Порівняльна таблиця схем</div>
        <div className="mat-note" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table className="mat-table">
              <thead>
                <tr>
                  <th>Параметр</th>
                  <th>⚡ Інтенсивна</th>
                  <th>⚖️ Напівінтенсивна</th>
                  <th>🌿 Екстенсивна</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={i}>
                    <td>
                      <strong>{row.param}</strong>
                    </td>
                    <td>{row.intensive}</td>
                    <td>{row.semi}</td>
                    <td>{row.extensive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ВІК ГОТОВНОСТІ */}
        <div className="mat-section-title">📅 Вік першої злучки по породах</div>
        <div className="mat-alert warn">
          ⚠️ <strong>Рання злучка — помилка.</strong> Злучка раніше строку
          підвищує ризик ускладнень при окролі, втрати посліду та виснаження
          молодої самки.
        </div>
        <div className="mat-note" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table className="mat-table">
              <thead>
                <tr>
                  <th>Порода / розмір</th>
                  <th>Самка</th>
                  <th>Самець</th>
                  <th>Примітки</th>
                </tr>
              </thead>
              <tbody>
                {ageReadiness.map((row, i) => (
                  <tr key={i}>
                    <td>
                      <strong>{row.breed}</strong>
                    </td>
                    <td>{row.female}</td>
                    <td>{row.male}</td>
                    <td style={{ color: "#8a6a3a" }}>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ПРАВИЛА ЗЛУЧКИ */}
        <div className="mat-section-title">
          🔑 Основні правила проведення злучки
        </div>
        <div className="mat-rules-grid">
          {matingRules.map((rule, i) => (
            <article key={i} className="mat-rule-card">
              <div className="mat-rule-icon">{rule.icon}</div>
              <h3>{rule.title}</h3>
              <p>{rule.desc}</p>
            </article>
          ))}
        </div>

        {/* НАВАНТАЖЕННЯ НА САМЦЯ */}
        <div className="mat-section-title">
          ♂️ Навантаження на самця-плідника
        </div>
        <div className="mat-note" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table className="mat-table">
              <thead>
                <tr>
                  <th>Вік самця</th>
                  <th>Навантаження</th>
                  <th>Відпочинок</th>
                  <th>Примітки</th>
                </tr>
              </thead>
              <tbody>
                {maleLoad.map((row, i) => (
                  <tr key={i}>
                    <td>
                      <strong>{row.age}</strong>
                    </td>
                    <td>{row.load}</td>
                    <td>{row.rest}</td>
                    <td>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mat-alert ok">
          ✅ Перевантажений самець дає менш заплідненні садки. Якість посліду
          знижується. Один добрий плідник — не більше 10 самок одночасно.
        </div>

        {/* КОНДИЦІЯ */}
        <div className="mat-section-title">
          ⚖️ Кондиція тварин перед злучкою
        </div>
        <div className="mat-grid mat-grid--2">
          <article className="mat-card">
            <div className="mat-card-header">
              <span className="mat-icon">✅</span>
              <h3>Робоча кондиція — норма</h3>
            </div>
            <div className="mat-card-body">
              <ul>
                <li>Ребра прощупуються, але не видно</li>
                <li>Хребет не випирає</li>
                <li>Тварина активна, апетит хороший</li>
                <li>Шерсть блискуча, без лисин</li>
                <li>Очі чисті, без виділень</li>
              </ul>
              <div className="mat-chip ok">Готова до злучки</div>
            </div>
          </article>
          <article className="mat-card">
            <div className="mat-card-header">
              <span className="mat-icon">🚫</span>
              <h3>Не злучати якщо</h3>
            </div>
            <div className="mat-card-body">
              <ul>
                <li>
                  <strong>Ожиріння</strong> — знижує запліднення, ускладнює
                  окріл
                </li>
                <li>
                  <strong>Виснаження</strong> — ризик резорбції плодів
                </li>
                <li>
                  <strong>Хвороба</strong> — будь-які симптоми нездоров'я
                </li>
                <li>
                  <strong>Стрес</strong> — після переїзду, виставки (почекати 2
                  тижні)
                </li>
                <li>
                  <strong>Линька</strong> — організм витрачає ресурси на ріст
                  шерсті
                </li>
              </ul>
              <div className="mat-chip danger">Зачекайте до відновлення</div>
            </div>
          </article>
        </div>

        {/* СЕЗОННІСТЬ */}
        <div className="mat-section-title">
          🌤️ Сезонність та вплив на злучку
        </div>
        <div className="mat-note">
          <h2>Кролі розмножуються цілий рік — але є нюанси</h2>
          <p>
            На відміну від більшості сільськогосподарських тварин, кролики
            можуть розмножуватись протягом усього року. Але ефективність злучки
            суттєво залежить від умов.
          </p>
          <div className="mat-season-grid">
            <div className="mat-season-card mat-season--spring">
              <div className="mat-season-name">🌸 Весна / Осінь</div>
              <p>
                Найкращий час для злучки. Оптимальна температура, довжина
                світлового дня стимулює статеву активність. Висока
                заплідненість.
              </p>
              <div className="mat-chip ok">Ідеальний час</div>
            </div>
            <div className="mat-season-card mat-season--summer">
              <div className="mat-season-name">☀️ Літо (спека)</div>
              <p>
                При температурі вище 28°C самці тимчасово безплідні —
                сперматогенез порушується. Злучати вранці або ввечері в
                прохолодний час. Самці відновлюються через 4–6 тижнів після
                спеки.
              </p>
              <div className="mat-chip warn">Знижена заплідненість</div>
            </div>
            <div className="mat-season-card mat-season--winter">
              <div className="mat-season-name">❄️ Зима</div>
              <p>
                При температурі нижче 0°C активність знижується. Зимові окроли
                потребують теплого маточника та обігріву. Підсвічування 16
                год/добу стимулює активність.
              </p>
              <div className="mat-chip warn">Потрібен догляд</div>
            </div>
          </div>
        </div>

        {/* ПСЕВДОВАГІТНІСТЬ */}
        <div className="mat-section-title">🔄 Псевдовагітність — що робити</div>
        <div className="mat-note">
          <h2>Самка будує гніздо, але крільченят немає</h2>
          <p>
            Псевдовагітність виникає через стимуляцію без запліднення (безплідна
            злучка, стрибок самки на самку). Самка поводиться як вагітна: будує
            гніздо, рве пух, агресивна. Тривалість — <strong>16–18 днів</strong>
            .
          </p>
          <p>
            <strong>Що робити:</strong> не заважати, не намагатися знову
            спарювати в цей час. Після закінчення самка повернеться до
            нормального стану. Часті повторення — консультація ветеринара щодо
            гормонального балансу.
          </p>
          <div className="mat-alert ok">
            ✅ Псевдовагітність — нормальне явище, не є хворобою. Самку можна
            злучати після її завершення.
          </div>
        </div>

        {/* ЖУРНАЛ */}
        <div className="mat-section-title">
          📓 Що записувати в журнал злучок
        </div>
        <div className="mat-note" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table className="mat-table">
              <thead>
                <tr>
                  <th>Поле</th>
                  <th>Що записувати</th>
                  <th>Навіщо</th>
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    "Дата злучки",
                    "Точна дата",
                    "Розрахунок дати окролу (+30 днів)",
                  ],
                  ["Самка", "Номер або ім'я", "Ідентифікація"],
                  [
                    "Самець (плідник)",
                    "Номер або ім'я",
                    "Контроль навантаження, родовід",
                  ],
                  [
                    "Результат пальпації",
                    "Тільна / не тільна / сумнів",
                    "Планування маточника",
                  ],
                  [
                    "Очікувана дата окролу",
                    "Дата злучки + 30 днів",
                    "Підготовка маточника",
                  ],
                  ["Фактична дата окролу", "Реальна дата", "Аналіз відхилень"],
                  [
                    "Кількість крільченят",
                    "Живих / мертвих",
                    "Оцінка продуктивності самки",
                  ],
                  [
                    "Схема злучки",
                    "Інтенсивна / напів / екстенсивна",
                    "Аналіз ефективності",
                  ],
                ].map(([field, what, why], i) => (
                  <tr key={i}>
                    <td>
                      <strong>{field}</strong>
                    </td>
                    <td>{what}</td>
                    <td>{why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ПОСИЛАННЯ */}
        <div className="mat-section-title">🔗 Пов'язані розділи</div>
        <div className="mat-links-grid">
          {[
            {
              to: "/okril",
              icon: "🌱",
              title: "Окріл",
              desc: "Підготовка, процес, догляд за новонародженими",
            },
            {
              to: "/weaning",
              icon: "🥣",
              title: "Відлучення та дорощування",
              desc: "Від народження до 90 днів",
            },
            {
              to: "/calculator",
              icon: "🧮",
              title: "Калькулятор",
              desc: "Розрахунок дати злучки та окролу",
            },
            {
              to: "/breeds",
              icon: "🐇",
              title: "Породи",
              desc: "М'ясні породи для розведення",
            },
            {
              to: "/feeding",
              icon: "🥕",
              title: "Годування",
              desc: "Раціон для самок та молодняку",
            },
            {
              to: "/weight-control",
              icon: "⚖️",
              title: "Контроль ваги",
              desc: "Норми приросту молодняку",
            },
          ].map((link) => (
            <Link key={link.to} to={link.to} className="mat-link-card">
              <span>{link.icon}</span>
              <div>
                <strong>{link.title}</strong>
                <span>{link.desc}</span>
              </div>
              <span className="mat-link-arrow">→</span>
            </Link>
          ))}
        </div>

        <div className="mat-back">
          <Link to="/" className="mat-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Назва цієї сторінки" />
        </div>
      </div>
    </main>
  );
};

export default MatingPage;
