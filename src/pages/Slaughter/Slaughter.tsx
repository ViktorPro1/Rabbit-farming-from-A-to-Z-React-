import { Link } from "react-router-dom";
import "./Slaughter.css";

const readinessTable = [
  {
    param: "Вік",
    meat: "70–90 днів",
    large: "90–120 днів",
    note: "Раніше — мало м'яса, пізніше — гірша конверсія корму",
  },
  {
    param: "Жива вага",
    meat: "2.2–2.8 кг",
    large: "3.5–5 кг",
    note: "Оптимум для м'ясних порід. Фландр — від 4.5 кг",
  },
  {
    param: "Забійний вихід",
    meat: "55–60%",
    large: "52–58%",
    note: "Відсоток чистого м'яса від живої ваги",
  },
  {
    param: "Стать",
    meat: "Самці та самки",
    large: "Самці",
    note: "Самок з хорошою родоводом залишати для племінної роботи",
  },
  {
    param: "Кондиція",
    meat: "Добра — без ожиріння",
    large: "Добра — без ожиріння",
    note: "Надмірний жир знижує якість та вихід м'яса",
  },
];

const preparationSteps = [
  {
    icon: "📅",
    title: "За 12–24 години",
    items: [
      "Голодна витримка — прибрати весь корм",
      "Воду залишити до останнього — зневоднення погіршує якість м'яса",
      "Відсадити від групи — уникнути стресу від оточення",
      "Не лякати та не переміщати без потреби — стрес підвищує рівень кортизолу, що псує смак",
    ],
  },
  {
    icon: "🧹",
    title: "Підготовка місця",
    items: [
      "Чиста поверхня — стіл або підвісна система",
      "Гострий ніж — тупий ніж мучить тварину",
      "Ємності для крові та нутрощів",
      "Тепла вода для обробки тушки",
      "Рукавички — обов'язково",
    ],
  },
  {
    icon: "🌡️",
    title: "Умови",
    items: [
      "Температура повітря +5…+15°C — оптимально для охолодження",
      "Уникати прямого сонця — м'ясо перегрівається",
      "Чистота — мухи та пил псують продукт",
    ],
  },
];

const storageTable = [
  {
    method: "Охолодження",
    temp: "0…+4°C",
    duration: "3–5 днів",
    note: "Холодильник. М'ясо загортають у пергамент або плівку.",
  },
  {
    method: "Заморозка",
    temp: "−18°C і нижче",
    duration: "До 6–8 місяців",
    note: "Заморожувати порційно. Повторне заморожування неприпустиме.",
  },
  {
    method: "Соління",
    temp: "Кімнатна",
    duration: "До 3 місяців",
    note: "Сухе або мокре соління. Норма солі — 25–30 г на 1 кг.",
  },
  {
    method: "Тушкування/консерви",
    temp: "Кімнатна",
    duration: "До 12 місяців",
    note: "Стерилізовані банки при +100°C не менше 90 хвилин.",
  },
];

const byproducts = [
  {
    icon: "🫀",
    name: "Печінка",
    use: "Їстівна, дуже цінна. Оглянути на білі плями — ознака кокцидіозу. При ураженні — утилізувати.",
  },
  {
    icon: "❤️",
    name: "Серце та нирки",
    use: "Їстівні. Промити холодною водою, видалити плівки. Готувати одразу або заморожувати.",
  },
  {
    icon: "🫁",
    name: "Легені",
    use: "Їстівні — варити для домашніх тварин. Для людини менш популярні.",
  },
  {
    icon: "🐾",
    name: "Лапки",
    use: "Використовують для бульйону. Попередньо обпалити та промити.",
  },
  {
    icon: "🪶",
    name: "Шкура",
    use: "Знімають окремо. Обробка: розтягнути на правилці хутром всередину, сушити при кімнатній температурі 3–5 днів.",
  },
  {
    icon: "🦴",
    name: "Кістки",
    use: "Для бульйону або борошна кісткового (якщо є млин). Не давати сирими собакам — кришаться.",
  },
];

const meatFacts = [
  {
    icon: "💪",
    title: "Найдієтичніше м'ясо",
    desc: "Кролик містить лише 4–6% жиру при 21% білку. Жир кролятини легко засвоюється — він не насичений, на відміну від свинини.",
  },
  {
    icon: "🧬",
    title: "Гіпоалергенне",
    desc: "М'ясо кролика рекомендують педіатри як перший м'ясний прикорм для немовлят. Алергічні реакції — надзвичайно рідкісні.",
  },
  {
    icon: "🏥",
    title: "Дієтичне призначення",
    desc: "Призначається при захворюваннях шлунково-кишкового тракту, анемії, ожирінні. Засвоюється на 90% проти 62% у яловичини.",
  },
  {
    icon: "🍽️",
    title: "Кулінарні особливості",
    desc: "Не потребує маринування якщо тварина молода (до 4 міс.). Старших тварин маринують у вині або сметані 2–4 год. Оптимально тушкувати або запікати.",
  },
];

const Slaughter = () => {
  return (
    <main className="slaughter-page">
      <div className="slaughter-header">
        <h1>Забій та переробка кролика</h1>
        <p>Підготовка, технологія, зберігання та цінність м'яса</p>
      </div>

      <div className="slaughter-wrap">
        {/* ФАКТИ ПРО М'ЯСО */}
        <div className="slaughter-section-title">
          🥩 Чому м'ясо кролика цінне
        </div>
        <div className="slaughter-grid-2">
          {meatFacts.map((f) => (
            <article key={f.title} className="slaughter-fact-card">
              <span className="slaughter-fact-icon">{f.icon}</span>
              <div>
                <strong className="slaughter-fact-title">{f.title}</strong>
                <p>{f.desc}</p>
              </div>
            </article>
          ))}
        </div>

        {/* ГОТОВНІСТЬ ДО ЗАБОЮ */}
        <div className="slaughter-section-title">
          📐 Коли кролик готовий до забою
        </div>
        <div
          className="slaughter-note"
          style={{ padding: 0, overflow: "hidden" }}
        >
          <div style={{ overflowX: "auto" }}>
            <table className="slaughter-table">
              <thead>
                <tr>
                  <th>Параметр</th>
                  <th>М'ясні породи</th>
                  <th>Великі породи</th>
                  <th>Примітка</th>
                </tr>
              </thead>
              <tbody>
                {readinessTable.map((row) => (
                  <tr key={row.param}>
                    <td>
                      <strong>{row.param}</strong>
                    </td>
                    <td>{row.meat}</td>
                    <td>{row.large}</td>
                    <td>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="slaughter-alert ok">
          ✅ Оптимальний вік для забою — 75–85 днів при масі 2.3–2.6 кг. Саме в
          цей період найкраще співвідношення витрат корму до виходу м'яса.
        </div>

        {/* ПІДГОТОВКА */}
        <div className="slaughter-section-title">📋 Підготовка до забою</div>
        <div className="slaughter-grid-3">
          {preparationSteps.map((step) => (
            <article key={step.title} className="slaughter-prep-card">
              <div className="slaughter-prep-header">
                <span className="slaughter-prep-icon">{step.icon}</span>
                <h3>{step.title}</h3>
              </div>
              <ul>
                {step.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {/* ТЕХНОЛОГІЯ */}
        <div className="slaughter-section-title">
          ⚙️ Технологія забою та обробки
        </div>
        <div className="slaughter-note">
          <div className="slaughter-steps">
            <div className="slaughter-step">
              <div className="slaughter-step-num">1</div>
              <div className="slaughter-step-content">
                <strong>Оглушення або забій</strong>
                <p>
                  Різкий удар тупим предметом по потилиці — швидко і гуманно.
                  Тварина непритомніє миттєво. Альтернатива — перелом шийних
                  хребців різким рухом.
                </p>
              </div>
            </div>
            <div className="slaughter-step">
              <div className="slaughter-step-num">2</div>
              <div className="slaughter-step-content">
                <strong>Підвішування та знекровлення</strong>
                <p>
                  Підвісити за задні лапи. Перерізати яремну вену або відрізати
                  голову. Знекровлення займає 3–5 хвилин. Кров збирати в ємність
                  — можна використати як добриво.
                </p>
              </div>
            </div>
            <div className="slaughter-step">
              <div className="slaughter-step-num">3</div>
              <div className="slaughter-step-content">
                <strong>Зняття шкури</strong>
                <p>
                  Надрізати навколо задніх лап. Стягнути шкуру "панчохою" донизу
                  до голови. При акуратному знятті шкура залишається цілою і
                  придатною для обробки.
                </p>
              </div>
            </div>
            <div className="slaughter-step">
              <div className="slaughter-step-num">4</div>
              <div className="slaughter-step-content">
                <strong>Патрання</strong>
                <p>
                  Розрізати черевну порожнину від хвоста до грудини — обережно,
                  щоб не пошкодити кишечник. Видалити нутрощі. Зберегти печінку,
                  серце, нирки — оглянути на патології.
                </p>
                <div className="slaughter-inline-alert warn">
                  ⚠️ Жовчний міхур видалити обережно — при розриві гірчить все
                  м'ясо.
                </div>
              </div>
            </div>
            <div className="slaughter-step">
              <div className="slaughter-step-num">5</div>
              <div className="slaughter-step-content">
                <strong>Промивання та охолодження</strong>
                <p>
                  Промити тушку холодною водою всередині та зовні. Помістити в
                  холодне місце (+2…+4°C) на 2–4 години — м'ясо має "дозріти"
                  перед приготуванням або заморозкою.
                </p>
                <div className="slaughter-inline-alert ok">
                  ✅ М'ясо після дозрівання стає м'якшим і ароматнішим завдяки
                  природним ферментним процесам.
                </div>
              </div>
            </div>
            <div className="slaughter-step">
              <div className="slaughter-step-num">6</div>
              <div className="slaughter-step-content">
                <strong>Розбирання на частини</strong>
                <p>
                  Стандартне розбирання: передні лапи, задні лапи, спинна
                  частина (сідло), грудна клітка. Задні лапи та сідло —
                  найцінніше м'ясо. Зберігати порційно.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ОГЛЯД ТУШКИ */}
        <div className="slaughter-section-title">
          🔍 Огляд тушки — що має насторожити
        </div>
        <div className="slaughter-note">
          <ul>
            <li>
              <strong>Білі або жовті плями на печінці</strong> — кокцидіоз.
              Печінку утилізувати, тушку можна вживати після термічної обробки.
            </li>
            <li>
              <strong>Крапковий геморагій на нутрощах</strong> — можливий ВГХК.
              Ветеринарний огляд обов'язковий, тушку не вживати.
            </li>
            <li>
              <strong>Набряки або рідина в порожнинах</strong> — ознака
              інфекційного процесу. Тушку утилізувати.
            </li>
            <li>
              <strong>Різкий неприємний запах</strong> — порушення технології
              або хвороба. Не вживати.
            </li>
            <li>
              <strong>Бліде або синюшне м'ясо</strong> — анемія або порушення
              знекровлення. Якість знижена.
            </li>
            <li>
              <strong>Нормальна тушка</strong> — рожеве м'ясо, білий або злегка
              жовтуватий жир, відсутність запаху та набряків.
            </li>
          </ul>
          <div className="slaughter-alert warn">
            ⚠️ При будь-яких сумнівах щодо якості — не вживати. Безпека
            важливіша за економію.
          </div>
        </div>

        {/* СУБПРОДУКТИ */}
        <div className="slaughter-section-title">
          ♻️ Використання субпродуктів
        </div>
        <div className="slaughter-grid-3">
          {byproducts.map((b) => (
            <article key={b.name} className="slaughter-byproduct-card">
              <span className="slaughter-byproduct-icon">{b.icon}</span>
              <strong className="slaughter-byproduct-name">{b.name}</strong>
              <p>{b.use}</p>
            </article>
          ))}
        </div>

        {/* ЗБЕРІГАННЯ */}
        <div className="slaughter-section-title">❄️ Зберігання м'яса</div>
        <div
          className="slaughter-note"
          style={{ padding: 0, overflow: "hidden" }}
        >
          <div style={{ overflowX: "auto" }}>
            <table className="slaughter-table">
              <thead>
                <tr>
                  <th>Спосіб</th>
                  <th>Температура</th>
                  <th>Термін</th>
                  <th>Примітка</th>
                </tr>
              </thead>
              <tbody>
                {storageTable.map((row) => (
                  <tr key={row.method}>
                    <td>
                      <strong>{row.method}</strong>
                    </td>
                    <td>{row.temp}</td>
                    <td>{row.duration}</td>
                    <td>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ШКУРА */}
        <div className="slaughter-section-title">🪶 Обробка шкури</div>
        <div className="slaughter-note">
          <p>
            Шкура кролика — цінний побічний продукт. При правильній обробці може
            використовуватись для виробів або продажу.
          </p>
          <ul>
            <li>
              <strong>Одразу після зняття:</strong> очистити від залишків жиру
              та м'яса м'яким скребком — не різати шкіру.
            </li>
            <li>
              <strong>Правилка:</strong> натягнути хутром всередину на правилку
              (клинова дошка або спеціальна рамка). Форма визначає якість
              кінцевого виробу.
            </li>
            <li>
              <strong>Сушка:</strong> при кімнатній температурі 3–5 днів.
              Уникати прямого сонця та радіаторів — шкіра тріскається.
            </li>
            <li>
              <strong>Зберігання сухих шкур:</strong> у сухому провітрюваному
              місці, пересипати сіллю або нафталіном від молі.
            </li>
            <li>
              <strong>Мокре соління:</strong> якщо нема часу обробляти одразу —
              засолити в 20% розчині солі до 1 місяця.
            </li>
          </ul>
          <div className="slaughter-alert ok">
            ✅ Шкури рекса та шиншили мають найвищу цінність — продавати або
            здавати до майстерень.
          </div>
        </div>

        <div className="slaughter-back">
          <Link to="/" className="slaughter-back-btn">
            ⬅ На головну
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Slaughter;
