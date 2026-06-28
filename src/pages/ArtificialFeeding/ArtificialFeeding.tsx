import { useState } from "react";
import { Link } from "react-router-dom";
import "./ArtificialFeeding.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const feedingSchedule = [
  {
    age: "День 1–3",
    weight: "40–80 г",
    volume: "1–2 мл за годування",
    frequency: "Кожні 2–3 год (вдень і вночі)",
    notes:
      "Критичний період. Молозиво замінити неможливо повністю — максимум зусиль.",
  },
  {
    age: "День 4–7",
    weight: "80–120 г",
    volume: "2–3 мл за годування",
    frequency: "Кожні 3 год",
    notes: "Животик має бути злегка опуклим після годування",
  },
  {
    age: "День 8–14",
    weight: "120–200 г",
    volume: "3–5 мл за годування",
    frequency: "Кожні 3–4 год",
    notes: "Починають вкриватись пухом, активніші",
  },
  {
    age: "День 15–21",
    weight: "200–350 г",
    volume: "5–8 мл за годування",
    frequency: "Кожні 4–5 год",
    notes: "Відкриваються очі. Можна пропонувати м'яке сіно поруч",
  },
  {
    age: "День 22–28",
    weight: "350–500 г",
    volume: "8–10 мл за годування",
    frequency: "5–6 разів на добу",
    notes: "Починають пробувати тверду їжу. Поступово зменшувати молоко",
  },
  {
    age: "День 28–35",
    weight: "500–700 г",
    volume: "Поступове зменшення",
    frequency: "3–4 рази на добу",
    notes: "Перехід на тверду їжу. Сіно, м'яка зелень, вода у мисці",
  },
];

const milkRecipes = [
  {
    title: "Козяче молоко + вершки",
    icon: "🐐",
    recommended: true,
    ingredients: ["Козяче молоко — 50 мл", "Вершки 10–20% — 50 мл"],
    preparation:
      "Підігріти на водяній бані до 38°C. Не кип'ятити. Перемішати безпосередньо перед годуванням.",
    pros: [
      "Найближче до складу молока крольчихи",
      "Легко засвоюється",
      "Доступне в Україні",
    ],
    cons: [
      "Потрібно свіже козяче молоко",
      "Термін зберігання суміші — 24 год у холодильнику",
    ],
  },
  {
    title: "KMR (Kitten Milk Replacer)",
    icon: "🥛",
    recommended: true,
    ingredients: ["Замінник котячого молока KMR — за інструкцією на упаковці"],
    preparation:
      "Розвести за інструкцією, підігріти до 38°C. Використовувати одразу.",
    pros: [
      "Збалансований склад",
      "Зручно дозувати",
      "Тривалий термін зберігання сухого порошку",
    ],
    cons: [
      "Потрібно шукати у зоомагазинах або онлайн",
      "Дорожче козячого молока",
    ],
  },
  {
    title: "Суміш Фокс (Fox recipe)",
    icon: "🧪",
    recommended: false,
    ingredients: [
      "Незбиране молоко — 120 мл",
      "Вершки 10% — 60 мл",
      "Знежирений йогурт — 1 ч.л.",
      "Кукурудзяний сироп (Karo) — 0.5 ч.л.",
      "Лактулоза — 1 ч.л. (за наявності)",
    ],
    preparation:
      "Змішати всі інгредієнти. Підігріти до 38°C. Зберігати не більше 24 год у холодильнику.",
    pros: ["Більш повний склад", "Підходить для тривалого вигодовування"],
    cons: ["Складніше готувати", "Не всі інгредієнти легко знайти в Україні"],
  },
];

interface FaqItem {
  q: string;
  a: string;
}

const faqItems: FaqItem[] = [
  {
    q: "Як зрозуміти що крільча наїлось?",
    a: "Животик злегка опуклий, м'який, кругленький. Шкіра не зморщена. Крільча розслаблене, не пищить. Якщо молоко витікає з рота — ви перегодували, зменшіть об'єм.",
  },
  {
    q: "Крільча пищить після годування — що не так?",
    a: "Можливо недоїло (перевірте животик), або має газики (м'який масаж животика по годинниковій після кожного годування), або замерзло (перевірте температуру гнізда).",
  },
  {
    q: "Можна замінити козяче молоко коров'ячим?",
    a: "Небажано як основне. Коров'яче молоко має інший склад і може викликати діарею. Як тимчасовий варіант на 1–2 годування — допустимо, але шукайте козяче або KMR якнайшвидше.",
  },
  {
    q: "Крільча не хоче брати шприц — що робити?",
    a: "Спробуйте імітувати соску: надіньте на шприц крапельницю або шматочок тонкої трубки. Крапайте молоко на язик — інстинкт ссання включиться сам. Ніколи не вливайте струменем — крільча захлинеться.",
  },
  {
    q: "Коли можна перестати годувати вночі?",
    a: "Тільки після 21-го дня, коли крільча почало активно їсти тверду їжу і стабільно набирає вагу. До цього нічні годування обов'язкові.",
  },
  {
    q: "Рідкий послід після годування — норма?",
    a: "У перші 3 тижні жовтуватий м'який послід — норма. Водянистий, смердючий або з кров'ю — ентерит або кокцидіоз. Байкокс 2.5% — 1 крапля на язик, ветеринар.",
  },
  {
    q: "Чи можна підкласти крільчат до іншої самки?",
    a: "Так, це фостеринг і це найкращий варіант! Натерти крільчат підстилкою з гнізда самки-годувальниці. Підкладати коли самка відійшла від гнізда. Самка не відрізняє чужих крільчат за запахом якщо все зроблено правильно.",
  },
];

const ArtificialFeeding = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="af-page">
      <div className="af-header">
        <h1>🐇 Штучне вигодовування крільченят</h1>
        <p>Покрокова інструкція від народження до відлучення</p>
      </div>

      <div className="af-wrap">
        {/* КОЛИ ПОТРІБНЕ ШТУЧНЕ ВИГОДОВУВАННЯ */}
        <div className="af-section-title">
          ⚠️ Коли потрібне штучне вигодовування
        </div>
        <div className="af-alert danger">
          🥇{" "}
          <strong>
            Фостеринг (підкладання до іншої самки) — завжди кращий за штучне
            вигодовування.
          </strong>{" "}
          Спочатку спробуйте знайти годувальницю. Штучне вигодовування — крайній
          захід.
        </div>

        <div className="af-grid af-grid--3">
          <article className="af-card">
            <div className="af-card-header">
              <span className="af-icon">🚫</span>
              <h3>Самка загинула</h3>
            </div>
            <div className="af-card-body">
              <p>
                Загибель самки під час або після окролу. Єдиний варіант —
                фостеринг або штучне вигодовування.
              </p>
              <div className="af-chip danger">Починати негайно</div>
            </div>
          </article>

          <article className="af-card">
            <div className="af-card-header">
              <span className="af-icon">🍼</span>
              <h3>Відмова від годування</h3>
            </div>
            <div className="af-card-body">
              <p>
                Самка не підпускає крільчат, агресивна до посліду, або молока
                немає (мастит, агалактія).
              </p>
              <p>
                Спочатку спробувати примусове годування — тримати самку над
                гніздом 2–3 рази на добу.
              </p>
            </div>
          </article>

          <article className="af-card">
            <div className="af-card-header">
              <span className="af-icon">🐰</span>
              <h3>Занадто великий послід</h3>
            </div>
            <div className="af-card-body">
              <p>
                Якщо крільчат більше 8–10, а самка не встигає всіх нагодувати —
                частину підкладають до іншої самки або докормлюють штучно.
              </p>
              <p>Зморщені, холодні крільчата = недоїдають.</p>
            </div>
          </article>
        </div>

        {/* ФОСТЕРИНГ */}
        <div className="af-section-title">
          🔄 Фостеринг — підкладання до іншої самки
        </div>
        <div className="af-note">
          <h2>Як правильно підкласти крільчат</h2>
          <div className="af-timeline">
            <div className="af-tl-item">
              <strong>Крок 1:</strong> Знайти самку зі схожим за віком послідом
              (різниця не більше 3–5 днів).
            </div>
            <div className="af-tl-item">
              <strong>Крок 2:</strong> Відсадити самку-годувальницю від гнізда
              на 15–20 хвилин.
            </div>
            <div className="af-tl-item">
              <strong>Крок 3:</strong> Натерти крільчат підстилкою та пухом з
              гнізда годувальниці — 2–3 хвилини.
            </div>
            <div className="af-tl-item">
              <strong>Крок 4:</strong> Помістити крільчат у центр гнізда,
              накрити пухом. Зверху покласти шматочок підстилки з їхнього
              рідного гнізда.
            </div>
            <div className="af-tl-item">
              <strong>Крок 5:</strong> Повернути самку. Спостерігати здалеку —
              якщо не нападає, все добре.
            </div>
            <div className="af-tl-item">
              <strong>Через 12 год:</strong> Перевірити наповненість животиків —
              якщо круглі, фостеринг успішний.
            </div>
          </div>
          <div className="af-alert ok">
            ✅ Самки кроликів не відрізняють чужих крільчат якщо вони пахнуть як
            гніздо. Фостеринг має дуже високий відсоток успіху.
          </div>
        </div>

        {/* СУМІШІ */}
        <div className="af-section-title">
          🥛 Суміші для штучного вигодовування
        </div>
        <div className="af-alert warn">
          ⚠️ Ніколи не давати: звичайне магазинне коров'яче молоко, соєве
          молоко, мигдальне молоко, молоко для котів на основі риби. Це може
          вбити крільча.
        </div>

        <div className="af-recipes-grid">
          {milkRecipes.map((recipe, i) => (
            <div
              key={i}
              className={`af-recipe-card ${recipe.recommended ? "af-recipe-card--recommended" : ""}`}
            >
              {recipe.recommended && (
                <div className="af-recipe-badge">✓ Рекомендовано</div>
              )}
              <div className="af-recipe-header">
                <span className="af-recipe-icon">{recipe.icon}</span>
                <h3>{recipe.title}</h3>
              </div>
              <div className="af-recipe-body">
                <div className="af-recipe-label">Склад:</div>
                <ul className="af-recipe-list">
                  {recipe.ingredients.map((ing, j) => (
                    <li key={j}>{ing}</li>
                  ))}
                </ul>
                <div className="af-recipe-label">Приготування:</div>
                <p>{recipe.preparation}</p>
                <div className="af-recipe-pros-cons">
                  <div>
                    <div className="af-recipe-label green">✓ Плюси:</div>
                    <ul className="af-recipe-list green">
                      {recipe.pros.map((p, j) => (
                        <li key={j}>{p}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="af-recipe-label red">✗ Мінуси:</div>
                    <ul className="af-recipe-list red">
                      {recipe.cons.map((c, j) => (
                        <li key={j}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ТЕХНІКА ГОДУВАННЯ */}
        <div className="af-section-title">💉 Техніка годування</div>
        <div className="af-grid af-grid--2">
          <article className="af-card">
            <div className="af-card-header">
              <span className="af-icon">🛠️</span>
              <h3>Обладнання</h3>
            </div>
            <div className="af-card-body">
              <ul>
                <li>
                  <strong>Шприц 1–5 мл</strong> — для новонароджених (1 мл),
                  старших (5 мл)
                </li>
                <li>
                  <strong>Соска для крільчат</strong> — спеціальна або від
                  котячого замінника молока
                </li>
                <li>
                  <strong>Альтернатива:</strong> трубочка від крапельниці надіта
                  на шприц
                </li>
                <li>
                  <strong>Кухонні ваги</strong> — зважувати крільча щодня в один
                  і той же час
                </li>
                <li>
                  <strong>Термометр водний</strong> — для контролю температури
                  суміші (38°C)
                </li>
              </ul>
            </div>
          </article>

          <article className="af-card">
            <div className="af-card-header">
              <span className="af-icon">📐</span>
              <h3>Позиція при годуванні</h3>
            </div>
            <div className="af-card-body">
              <p>
                Крільча тримати <strong>вертикально</strong> або під кутом 45° —
                голова вгорі.
              </p>
              <p>Ніколи не годувати лежачи на спині — захлинеться.</p>
              <p>
                Соску підносити збоку до рота, не вливати силою — чекати поки
                крільча почне смоктати самостійно.
              </p>
              <div className="af-alert danger">
                🚫 Не вливати молоко струменем! Крільча може аспірувати рідину в
                легені — це смертельно.
              </div>
            </div>
          </article>

          <article className="af-card">
            <div className="af-card-header">
              <span className="af-icon">🚿</span>
              <h3>Стимуляція після годування</h3>
            </div>
            <div className="af-card-body">
              <p>
                До 10–14 днів крільча не може самостійно справляти потреби.
                Самка стимулює масажем язиком.
              </p>
              <p>
                <strong>Що робити після кожного годування:</strong>
              </p>
              <ul>
                <li>
                  Вологою ватою або тканиною м'яко масажувати животик і
                  промежину
                </li>
                <li>15–30 секунд кругових рухів</li>
                <li>Крільча має помочитись і справити послід</li>
              </ul>
              <div className="af-alert warn">
                ⚠️ Якщо не стимулювати — крільча загине від затримки сечі за 1–2
                дні.
              </div>
            </div>
          </article>

          <article className="af-card">
            <div className="af-card-header">
              <span className="af-icon">🌡️</span>
              <h3>Температура гнізда</h3>
            </div>
            <div className="af-card-body">
              <ul>
                <li>
                  <strong>День 1–7:</strong> 30–32°C в гнізді
                </li>
                <li>
                  <strong>День 8–14:</strong> 28–30°C
                </li>
                <li>
                  <strong>День 15–21:</strong> 24–27°C
                </li>
                <li>
                  <strong>Після 21 дня:</strong> кімнатна температура
                </li>
              </ul>
              <p>
                Гнізло утеплити вовною, м'якою тканиною. Грілка під гніздом (не
                всередині!) — пляшка з теплою водою, загорнута в рушник.
              </p>
              <div className="af-alert ok">
                ✅ Холодне крільча = крільча, що помирає. Тепло — пріоритет №1.
              </div>
            </div>
          </article>
        </div>

        {/* ТАБЛИЦЯ ГОДУВАННЯ */}
        <div className="af-section-title">📊 Графік годування по тижнях</div>
        <div className="af-note" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table className="af-table">
              <thead>
                <tr>
                  <th>Вік</th>
                  <th>Вага</th>
                  <th>Об'єм за раз</th>
                  <th>Частота</th>
                  <th>Примітки</th>
                </tr>
              </thead>
              <tbody>
                {feedingSchedule.map((row) => (
                  <tr key={row.age}>
                    <td>
                      <strong>{row.age}</strong>
                    </td>
                    <td>{row.weight}</td>
                    <td>
                      <strong style={{ color: "#2d5a1b" }}>{row.volume}</strong>
                    </td>
                    <td>{row.frequency}</td>
                    <td>{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ПЕРЕХІД НА ТВЕРДУ ЇЖУ */}
        <div className="af-section-title">🌿 Перехід на тверду їжу</div>
        <div className="af-note">
          <h2>Відлучення від штучного молока</h2>
          <div className="af-timeline">
            <div className="af-tl-item">
              <strong>День 14–18:</strong> Класти поруч з гніздом невеликий
              пучок свіжого м'якого сіна. Не примушувати — хай нюхають.
            </div>
            <div className="af-tl-item">
              <strong>День 21–24:</strong> Пропонувати тертий гарбуз або моркву
              (дуже мала кількість — розміром з горошину). Слідкувати за
              послідом.
            </div>
            <div className="af-tl-item">
              <strong>День 25–28:</strong> Невелика мисочка з водою. Крільчата
              починають пити самостійно. Зменшити кількість годувань молоком до
              3–4 разів.
            </div>
            <div className="af-tl-item">
              <strong>День 28–35:</strong> Зменшувати об'єм молока щодня.
              Збільшувати тверду їжу. Сіно має бути доступне постійно.
            </div>
            <div className="af-tl-item">
              <strong>День 35–42:</strong> Повне відлучення від молока якщо
              добре їдять тверду їжу та стабільно набирають вагу.
            </div>
          </div>
          <div className="af-alert ok">
            ✅ Не поспішайте з відлученням. Краще продовжити на тиждень, ніж
            відлучити зарано і втратити крільча від ентериту.
          </div>
        </div>

        {/* КОНТРОЛЬ ВАГИ */}
        <div className="af-section-title">
          ⚖️ Контроль ваги — ключовий показник
        </div>
        <div className="af-grid af-grid--2">
          <article className="af-card">
            <div className="af-card-header">
              <span className="af-icon">📈</span>
              <h3>Норми приросту</h3>
            </div>
            <div className="af-card-body">
              <ul>
                <li>
                  День 1–7: <strong>+3–5 г/добу</strong>
                </li>
                <li>
                  День 8–14: <strong>+5–8 г/добу</strong>
                </li>
                <li>
                  День 15–21: <strong>+8–12 г/добу</strong>
                </li>
                <li>
                  День 22–35: <strong>+12–20 г/добу</strong>
                </li>
              </ul>
              <div className="af-alert warn">
                ⚠️ Якщо крільча не набирає вагу 2 дні поспіль — збільшити
                частоту годувань або перевірити склад суміші.
              </div>
            </div>
          </article>

          <article className="af-card">
            <div className="af-card-header">
              <span className="af-icon">🚨</span>
              <h3>Тривожні ознаки</h3>
            </div>
            <div className="af-card-body">
              <div className="af-chip danger">Потребує уваги</div>
              <ul>
                <li>Схуднення або стабільна вага без росту</li>
                <li>Зморщена, нееластична шкіра (зневоднення)</li>
                <li>Рідкий або водянистий послід</li>
                <li>Крільча постійно пищить</li>
                <li>Животик здутий або занадто м'який</li>
                <li>Синюшні слизові</li>
              </ul>
            </div>
          </article>
        </div>

        {/* ПРОФІЛАКТИКА */}
        <div className="af-section-title">💉 Профілактика хвороб</div>
        <div className="af-note">
          <h2>Схема профілактики при штучному вигодовуванні</h2>
          <div className="af-timeline">
            <div className="af-tl-item">
              <strong>День 1–3:</strong> Якщо є доступ — дати 1–2 краплі
              молозива від будь-якої самки. Це різко підвищує виживаність.
            </div>
            <div className="af-tl-item">
              <strong>День 5–7:</strong> Додати в суміш пробіотик (1/4 дози для
              котенят) — Лактобіфадол або аналог. Підтримує мікрофлору
              кишечника.
            </div>
            <div className="af-tl-item">
              <strong>День 20–22:</strong> Солікокс — 1 крапля на язик 3 дні
              поспіль. Профілактика кокцидіозу — обов'язково.
            </div>
            <div className="af-tl-item">
              <strong>6 тижнів:</strong> Щеплення від міксоматозу (якщо крільча
              вижило і розвивається нормально).
            </div>
            <div className="af-tl-item">
              <strong>9–10 тижнів:</strong> Щеплення від ВГХК.
            </div>
          </div>
          <div className="af-alert ok">
            ✅ Штучно вигодовані крільчата мають слабший імунітет — профілактика
            кокцидіозу особливо важлива.
          </div>
        </div>

        {/* FAQ */}
        <div className="af-section-title">❓ Часті запитання</div>
        <div className="af-faq">
          {faqItems.map((item, i) => (
            <div
              key={i}
              className={`af-faq-item ${openFaq === i ? "af-faq-item--open" : ""}`}
            >
              <button
                className="af-faq-question"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span>{item.q}</span>
                <span className="af-faq-arrow">
                  {openFaq === i ? "▲" : "▼"}
                </span>
              </button>
              {openFaq === i && <div className="af-faq-answer">{item.a}</div>}
            </div>
          ))}
        </div>

        {/* ПОСИЛАННЯ */}
        <div className="af-section-title">🔗 Пов'язані розділи</div>
        <div className="af-links-grid">
          <Link to="/okril" className="af-link-card">
            <span>🌱</span>
            <div>
              <strong>Окріл та розмноження</strong>
              <span>Підготовка, процес, догляд за новонародженими</span>
            </div>
            <span className="af-link-arrow">→</span>
          </Link>
          <Link to="/weaning" className="af-link-card">
            <span>🥣</span>
            <div>
              <strong>Відлучення та дорощування</strong>
              <span>Від народження до 90 днів</span>
            </div>
            <span className="af-link-arrow">→</span>
          </Link>
          <Link to="/diseases" className="af-link-card">
            <span>🩺</span>
            <div>
              <strong>Хвороби молодняку</strong>
              <span>Ентерит, кокцидіоз, симптоми</span>
            </div>
            <span className="af-link-arrow">→</span>
          </Link>
          <Link to="/symptoms" className="af-link-card">
            <span>🌡️</span>
            <div>
              <strong>Симптоматичний пошук</strong>
              <span>Крільча не їсть, пищить, худне</span>
            </div>
            <span className="af-link-arrow">→</span>
          </Link>
        </div>

        <div className="af-back">
          <Link to="/" className="af-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Назва цієї сторінки" />
        </div>
      </div>
    </main>
  );
};

export default ArtificialFeeding;
