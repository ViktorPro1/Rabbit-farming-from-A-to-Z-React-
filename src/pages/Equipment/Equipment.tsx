import { Link } from "react-router-dom";
import "./Equipment.css";

const granulatorSpecs = [
  {
    param: "Принцип роботи",
    value: "Механічне пресування через матрицю з отворами 2–6 мм",
  },
  { param: "Продуктивність", value: "50–500 кг/год залежно від моделі" },
  { param: "Вологість сировини", value: "12–16% — оптимум для пресування" },
  {
    param: "Температура гранул",
    value: "+60…+80°C на виході — природна стерилізація",
  },
  { param: "Споживання енергії", value: "3–15 кВт залежно від продуктивності" },
  {
    param: "Термін служби матриці",
    value: "500–2000 год залежно від сировини та якості сталі",
  },
];

const extruderSpecs = [
  {
    param: "Принцип роботи",
    value: "Термомеханічна обробка — тиск + температура +120…+180°C",
  },
  { param: "Продуктивність", value: "30–300 кг/год" },
  { param: "Вологість сировини", value: "18–25% — вища ніж для гранулятора" },
  {
    param: "Температура обробки",
    value: "+120…+180°C — желатинізація крохмалю",
  },
  {
    param: "Засвоюваність корму",
    value: "До 95% проти 75–80% у звичайного зерна",
  },
  { param: "Споживання енергії", value: "5–20 кВт" },
];

const chopperSpecs = [
  {
    param: "Принцип роботи",
    value: "Обертові ножі або барабан з лезами подрібнюють зелень",
  },
  { param: "Продуктивність", value: "100–1000 кг/год" },
  { param: "Довжина різання", value: "5–50 мм — регулюється" },
  {
    param: "Тип сировини",
    value: "Свіжа трава, сіно, кукурудзяні стебла, коренеплоди",
  },
  { param: "Споживання енергії", value: "1.5–5 кВт" },
  { param: "Обслуговування", value: "Заточка ножів кожні 50–100 год роботи" },
];

const granulatorFirstStart = [
  "Перевірити затяжку всіх болтів та кріплень",
  "Змастити матрицю та ролики харчовим маслом або тваринним жиром",
  "Перший запуск без сировини — 5–10 хвилин на холостому ходу для прогрівання",
  "Подавати сировину поступово — починати з 20–30% від номінальної продуктивності",
  'Перші гранули можуть бути нерівними або розсипатися — це нормально, матриця "притирається"',
  "Вийти на повну продуктивність через 30–60 хвилин роботи",
  "Контролювати температуру матриці — вище +100°C критично",
];

const extruderFirstStart = [
  "Перевірити наявність мастила в редукторі та підшипниках",
  "Встановити правильну вологість сировини — 18–25%, контролювати вологоміром",
  "Прогріти шнекову зону до робочої температури — 15–20 хвилин",
  "Перший запуск на воді або зволоженому зерні без добавок",
  "Поступово збільшувати подачу сировини",
  "Контролювати тиск та температуру — при перевантаженні спрацьовує запобіжник",
  "Перші 30 хвилин — спостерігати за якістю продукту та звуками двигуна",
];

const chopperFirstStart = [
  "Перевірити гостроту ножів — тупі ножі рвуть, а не ріжуть, швидко зношуються",
  "Перевірити зазор між нерухомим та рухомим ножем — 0.1–0.3 мм",
  "Запустити без сировини — перевірити відсутність вібрації та сторонніх звуків",
  "Подавати траву рівномірно — не допускати забивання бункера",
  "Перші 10–15 хвилин — помірне навантаження",
  "При різкому зниженні обертів — зменшити подачу",
];

const granulatorMaintenance = [
  {
    period: "Після кожної зміни",
    tasks:
      "Очистити матрицю та ролики від залишків корму. Пресувати через матрицю суміш олії з висівками для консервації каналів.",
  },
  {
    period: "Щотижня",
    tasks:
      "Перевірити та підтягнути болти кріплення матриці. Змастити підшипники роликів. Перевірити знос роликів та матриці.",
  },
  {
    period: "Щомісяця",
    tasks:
      "Повне технічне обслуговування редуктора. Перевірка та регулювання зазору ролик-матриця (норма 0.1–0.3 мм). Огляд ременів приводу.",
  },
  {
    period: "При зупинці більше 3 днів",
    tasks:
      "Обов'язково пресувати суміш олії з висівками через матрицю — інакше канали закоксовуються і матриця виходить з ладу.",
  },
];

const extruderMaintenance = [
  {
    period: "Після кожної зміни",
    tasks:
      "Промити шнек та камеру нагрівання зволоженим зерном або спеціальними очисними гранулами.",
  },
  {
    period: "Щотижня",
    tasks:
      "Перевірити знос шнека та гільзи. Змастити підшипники. Перевірити нагрівальні елементи.",
  },
  {
    period: "Щомісяця",
    tasks:
      "Повний розбір та очищення шнека від нагару. Перевірка та калібрування температурних датчиків. Огляд фільєри.",
  },
];

const chopperMaintenance = [
  {
    period: "Після кожної зміни",
    tasks:
      "Очистити барабан та бункер від залишків трави. Перевірити гостроту ножів.",
  },
  {
    period: "Щотижня",
    tasks:
      "Заточка ножів або заміна якщо зношені. Перевірка зазору між ножами. Змащення підшипників.",
  },
  {
    period: "Щомісяця",
    tasks:
      "Повне технічне обслуговування. Перевірка балансування барабана. Огляд ременів та шків.",
  },
];

const granulatorProblems = [
  {
    problem: "Гранули розсипаються",
    cause: "Мала вологість сировини або знос матриці",
    solution: "Збільшити вологість до 14–16%, перевірити знос отворів матриці",
  },
  {
    problem: "Матриця не пресує, ковзає",
    cause: "Замала відстань ролик-матриця або сировина занадто суха",
    solution: "Відрегулювати зазор 0.1–0.3 мм, зволожити сировину",
  },
  {
    problem: "Перегрів матриці",
    cause: "Велика вологість або стороннє тіло в каналах",
    solution: "Зменшити подачу, перевірити вологість, прочистити канали",
  },
  {
    problem: "Закоксовані канали матриці",
    cause: "Зупинка без консервації олією",
    solution:
      "Замочити матрицю в олії на 12–24 год, спробувати прогнати олію з висівками",
  },
  {
    problem: "Нерівні або різнодіаметрні гранули",
    cause: "Нерівномірний знос матриці",
    solution: "Замінити матрицю або перевірити її на рівномірність зносу",
  },
];

const extruderProblems = [
  {
    problem: "Продукт не спучується",
    cause: "Недостатня вологість або температура",
    solution:
      "Збільшити вологість до 20–22%, підвищити температуру зони нагрівання",
  },
  {
    problem: "Злипання продукту",
    cause: "Надмірна вологість",
    solution: "Зменшити вологість сировини до 18–20%",
  },
  {
    problem: "Перевантаження двигуна",
    cause: "  Занадто суха сировина або надмірна подача",
    solution: "Зволожити сировину, зменшити подачу",
  },
  {
    problem: "Нерівномірна текстура",
    cause: "Нестабільна температура або неоднорідна сировина",
    solution:
      "Перевірити нагрівачі, забезпечити рівномірне змішування сировини",
  },
];

const Equipment = () => {
  return (
    <main className="equipment-page">
      <div className="equipment-header">
        <h1>Обладнання для кролівництва</h1>
        <p>
          Гранулятор, екструдер та траворізка — призначення, запуск та
          обслуговування
        </p>
      </div>

      <div className="equipment-wrap">
        {/* ГРАНУЛЯТОР */}
        <div className="equipment-section-title" id="granulator">
          ⚙️ Гранулятор
        </div>

        <div className="equipment-device-intro">
          <div className="equipment-device-image">
            <img
              src="/Equipment/granulator.png"
              alt="Гранулятор"
              className="equipment-device-img"
            />
          </div>
          <div className="equipment-device-desc">
            <h2>Що таке гранулятор і навіщо він потрібен</h2>
            <p>
              Гранулятор — це машина яка пресує подрібнену суміш зернових, трав
              та добавок через спеціальну матрицю і формує щільні циліндричні
              гранули діаметром 2–6 мм.
            </p>
            <p>
              <strong>Головна перевага грануляції:</strong> в одній гранулі
              міститься вся необхідна кількість білків, вуглеводів, мінералів та
              вітамінів. Кролик не може вибирати — їсть все одразу. Це усуває
              вибіркове харчування та забезпечує збалансований раціон.
            </p>
            <p>
              <strong>Економія:</strong> гранульований корм менше просипається
              та псується. Витрати корму знижуються на 15–25% порівняно з
              розсипним.
            </p>
            <div className="equipment-alert ok">
              ✅ При пресуванні температура +60…+80°C знищує більшість патогенів
              та ооцисти кокцидій — корм стає безпечнішим.
            </div>
          </div>
        </div>

        <div className="equipment-section-subtitle">
          📊 Технічні характеристики
        </div>
        <div className="equipment-specs-table-wrap">
          <table className="equipment-specs-table">
            <tbody>
              {granulatorSpecs.map((row) => (
                <tr key={row.param}>
                  <td>
                    <strong>{row.param}</strong>
                  </td>
                  <td>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="equipment-section-subtitle">
          🚀 Перший запуск та притирання
        </div>
        <div className="equipment-note">
          <p>
            Нова матриця потребує обов'язкового припрацювання — "притирання".
            Без цього кроку гранулятор не видасть якісного продукту і матриця
            може вийти з ладу.
          </p>
          <ol className="equipment-steps-list">
            {granulatorFirstStart.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
          <div className="equipment-alert warn">
            ⚠️ Нову матрицю перед першим запуском замочити в рослинній олії на
            2–4 години — це полегшить притирання та продовжить термін служби.
          </div>
        </div>

        <div className="equipment-section-subtitle">
          🔧 Склад суміші для притирання
        </div>
        <div className="equipment-note">
          <p>Для нової матриці використовують спеціальну суміш:</p>
          <ul>
            <li>
              <strong>70% висівок пшеничних</strong> — м'яке абразивне
              притирання каналів
            </li>
            <li>
              <strong>20% борошна або дрібного помелу</strong> — заповнює
              нерівності
            </li>
            <li>
              <strong>10% рослинної олії</strong> — змащення та захист від
              перегріву
            </li>
            <li>Вологість суміші — 14–16%</li>
            <li>Пресувати 30–60 хвилин до появи рівних стабільних гранул</li>
          </ul>
        </div>

        <div className="equipment-section-subtitle">
          📅 Обслуговування та догляд
        </div>
        <div className="equipment-maintenance-grid">
          {granulatorMaintenance.map((m) => (
            <div key={m.period} className="equipment-maintenance-card">
              <div className="equipment-maintenance-period">{m.period}</div>
              <p>{m.tasks}</p>
            </div>
          ))}
        </div>

        <div className="equipment-section-subtitle">
          🛠️ Типові несправності та усунення
        </div>
        <div
          className="equipment-note"
          style={{ padding: 0, overflow: "hidden" }}
        >
          <div style={{ overflowX: "auto" }}>
            <table className="equipment-problems-table">
              <thead>
                <tr>
                  <th>Проблема</th>
                  <th>Причина</th>
                  <th>Рішення</th>
                </tr>
              </thead>
              <tbody>
                {granulatorProblems.map((row) => (
                  <tr key={row.problem}>
                    <td>
                      <strong>{row.problem}</strong>
                    </td>
                    <td>{row.cause}</td>
                    <td>{row.solution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ЕКСТРУДЕР */}
        <div className="equipment-section-title" id="extruder">
          🔩 Екструдер
        </div>

        <div className="equipment-device-intro">
          <div className="equipment-device-image">
            <img
              src="/Equipment/extruder.png"
              alt="Екструдер"
              className="equipment-device-img"
            />
          </div>
          <div className="equipment-device-desc">
            <h2>Що таке екструдер і чим відрізняється від гранулятора</h2>
            <p>
              Екструдер — це машина яка обробляє зерно або суміш одночасно
              тиском та високою температурою (+120…+180°C). На відміну від
              гранулятора, екструдер не просто пресує — він{" "}
              <strong>желатинізує крохмаль</strong>, що кардинально змінює
              структуру продукту.
            </p>
            <p>
              <strong>Ключова відмінність:</strong> при екструзії крохмаль
              перетворюється на легкозасвоювану форму. Засвоюваність кукурудзи
              зростає з 75% до 95%, ячменю — з 65% до 90%.
            </p>
            <p>
              <strong>Для кроликів особливо важливо:</strong> екструдований корм
              не бродить у шлунку, що знижує ризик здуття та ШКТ-стазу.
              Рекомендується для молодняку та тварин з проблемним травленням.
            </p>
            <div className="equipment-alert ok">
              ✅ Температура обробки +120°C і вище знищує всі патогени,
              мікотоксини та інгібітори травлення — екструдований корм
              безпечніший за будь-який інший.
            </div>
          </div>
        </div>

        <div className="equipment-section-subtitle">
          📊 Технічні характеристики
        </div>
        <div className="equipment-specs-table-wrap">
          <table className="equipment-specs-table">
            <tbody>
              {extruderSpecs.map((row) => (
                <tr key={row.param}>
                  <td>
                    <strong>{row.param}</strong>
                  </td>
                  <td>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="equipment-section-subtitle">
          🔬 Порівняння гранулятор vs екструдер
        </div>
        <div className="equipment-compare-grid">
          <div className="equipment-compare-card granulator">
            <h3>⚙️ Гранулятор</h3>
            <ul>
              <li>✅ Дешевший у придбанні</li>
              <li>✅ Менше споживає енергії</li>
              <li>✅ Простіше в обслуговуванні</li>
              <li>✅ Підходить для будь-якої сировини</li>
              <li>➖ Засвоюваність нижча</li>
              <li>➖ Не знищує мікотоксини</li>
              <li>➖ Потребує точного контролю вологості</li>
            </ul>
          </div>
          <div className="equipment-compare-card extruder">
            <h3>🔩 Екструдер</h3>
            <ul>
              <li>✅ Засвоюваність до 95%</li>
              <li>✅ Знищує патогени та мікотоксини</li>
              <li>✅ Знижує ризик здуття</li>
              <li>✅ Ідеально для молодняку</li>
              <li>➖ Дорожчий у придбанні</li>
              <li>➖ Більше споживає енергії</li>
              <li>➖ Складніше обслуговування</li>
            </ul>
          </div>
        </div>

        <div className="equipment-section-subtitle">
          🚀 Перший запуск екструдера
        </div>
        <div className="equipment-note">
          <ol className="equipment-steps-list">
            {extruderFirstStart.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
          <div className="equipment-alert warn">
            ⚠️ Ніколи не запускати екструдер з сухою сировиною — шнек може
            заклинити. Мінімальна вологість 18%.
          </div>
        </div>

        <div className="equipment-section-subtitle">
          📅 Обслуговування та догляд
        </div>
        <div className="equipment-maintenance-grid">
          {extruderMaintenance.map((m) => (
            <div key={m.period} className="equipment-maintenance-card">
              <div className="equipment-maintenance-period">{m.period}</div>
              <p>{m.tasks}</p>
            </div>
          ))}
        </div>

        <div className="equipment-section-subtitle">🛠️ Типові несправності</div>
        <div
          className="equipment-note"
          style={{ padding: 0, overflow: "hidden" }}
        >
          <div style={{ overflowX: "auto" }}>
            <table className="equipment-problems-table">
              <thead>
                <tr>
                  <th>Проблема</th>
                  <th>Причина</th>
                  <th>Рішення</th>
                </tr>
              </thead>
              <tbody>
                {extruderProblems.map((row) => (
                  <tr key={row.problem}>
                    <td>
                      <strong>{row.problem}</strong>
                    </td>
                    <td>{row.cause}</td>
                    <td>{row.solution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ТРАВОРІЗКА */}
        <div className="equipment-section-title" id="chopper">
          🌿 Траворізка
        </div>

        <div className="equipment-device-intro">
          <div className="equipment-device-image">
            <img
              src="/Equipment/grass-cutter.jpeg"
              alt="Траворізка"
              className="equipment-device-img"
            />
          </div>
          <div className="equipment-device-desc">
            <h2>Що таке траворізка і навіщо вона потрібна</h2>
            <p>
              Траворізка (подрібнювач трави, силосорізка) — машина для
              подрібнення свіжої або сухої рослинної маси: трави, сіна,
              кукурудзяних стебел, соломи, коренеплодів.
            </p>
            <p>
              <strong>Навіщо подрібнювати:</strong> кролики поїдають подрібнену
              траву на 20–30% краще ніж цілу. Менше відходів, рівномірніший
              раціон. Подрібнена зелень легше змішується з гранулами та
              добавками.
            </p>
            <p>
              <strong>Для гранулятора:</strong> траворізка є обов'язковим
              допоміжним обладнанням — зелень перед гранулюванням потрібно
              подрібнити до фракції 3–10 мм.
            </p>
            <div className="equipment-alert ok">
              ✅ Подрібнена трава займає менше місця при зберіганні та сушінні —
              швидше висихає і краще консервується.
            </div>
          </div>
        </div>

        <div className="equipment-section-subtitle">
          📊 Технічні характеристики
        </div>
        <div className="equipment-specs-table-wrap">
          <table className="equipment-specs-table">
            <tbody>
              {chopperSpecs.map((row) => (
                <tr key={row.param}>
                  <td>
                    <strong>{row.param}</strong>
                  </td>
                  <td>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="equipment-section-subtitle">
          🌱 Що можна подрібнювати
        </div>
        <div className="equipment-chopper-types">
          <div className="equipment-chopper-card allowed">
            <h3>✅ Підходить</h3>
            <ul>
              <li>Свіжа трава — люцерна, конюшина, тимофіївка</li>
              <li>Сіно та солома</li>
              <li>Кукурудзяні стебла та листя</li>
              <li>Соняшникові стебла</li>
              <li>Морква, буряк, кабачки (коренерізка)</li>
              <li>Гілки дерев діаметром до 15 мм (садові подрібнювачі)</li>
            </ul>
          </div>
          <div className="equipment-chopper-card forbidden">
            <h3>🚫 Не підходить</h3>
            <ul>
              <li>Мокра трава з великою кількістю піску — пошкоджує ножі</li>
              <li>Тверде дерево — тільки якщо є спеціальна функція</li>
              <li>Металеві предмети — негайно пошкоджують ножі</li>
              <li>Каміння та грудки землі</li>
              <li>Заморожена маса — перевантаження двигуна</li>
            </ul>
          </div>
        </div>

        <div className="equipment-section-subtitle">
          🚀 Перший запуск та заточка ножів
        </div>
        <div className="equipment-note">
          <ol className="equipment-steps-list">
            {chopperFirstStart.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
          <p style={{ marginTop: "1rem" }}>
            <strong>Як перевірити гостроту ножів:</strong> різати аркуш паперу —
            гострий ніж ріже чисто без зминання. Або перевірити на стеблі —
            чистий зріз без розмахрювання.
          </p>
          <div className="equipment-alert warn">
            ⚠️ Тупі ножі споживають на 30–40% більше електроенергії та рвуть, а
            не ріжуть — якість подрібнення різко погіршується.
          </div>
        </div>

        <div className="equipment-section-subtitle">
          📅 Обслуговування та догляд
        </div>
        <div className="equipment-maintenance-grid">
          {chopperMaintenance.map((m) => (
            <div key={m.period} className="equipment-maintenance-card">
              <div className="equipment-maintenance-period">{m.period}</div>
              <p>{m.tasks}</p>
            </div>
          ))}
        </div>

        {/* ЗАГАЛЬНІ ПОРАДИ */}
        <div className="equipment-section-title">
          💡 Загальні поради по обладнанню
        </div>
        <div className="equipment-note">
          <ul>
            <li>
              <strong>Купівля:</strong> для господарства до 50 голів достатньо
              побутових моделей потужністю 1.5–3 кВт. Від 100 голів — промислові
              моделі від 5 кВт.
            </li>
            <li>
              <strong>Китайські vs європейські:</strong> китайські дешевші, але
              матриці гранулятора з м'якшої сталі — термін служби 300–500 год
              проти 1500–2000 год у якісних аналогів. Рахуйте вартість запасних
              частин.
            </li>
            <li>
              <strong>Запасні частини:</strong> завжди мати в запасі: матрицю
              (гранулятор), комплект ножів (траворізка), запобіжний болт шнека
              (екструдер).
            </li>
            <li>
              <strong>Зберігання:</strong> після сезону очистити, змастити всі
              тертьові поверхні, закрити від вологи. Конденсат — головний ворог
              металевих частин.
            </li>
            <li>
              <strong>Техніка безпеки:</strong> ніколи не проштовхувати сировину
              руками — тільки дерев'яним штовхачем. Зупинити машину перед
              будь-яким обслуговуванням.
            </li>
            <li>
              <strong>Рецептура для гранул:</strong> зернові 60–70% + трав'яне
              борошно 20–25% + мінеральні добавки 3–5% + сіль 0.5% + вітамінний
              премікс 1%. Вологість суміші 13–15%.
            </li>
          </ul>
          <div className="equipment-alert ok">
            ✅ Власний гранулятор окупається за 1–2 сезони при поголів'ї від
            30–50 голів і власній сировині.
          </div>
        </div>

        <div className="equipment-back">
          <Link to="/" className="equipment-back-btn">
            ⬅ На головну
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Equipment;
