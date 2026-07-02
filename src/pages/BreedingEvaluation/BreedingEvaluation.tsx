import "./BreedingEvaluation.css";
import ShareButton from "../../components/ShareButton/ShareButton";
import { Link } from "react-router-dom";

const EVAL_CRITERIA = [
  {
    icon: "⚖️",
    title: "Жива маса",
    priority: "Ключовий",
    desc: "Основний критерій для м'ясних порід. Зважуються у 28, 35, 56, 70 та 90 днів. Жива маса у 70 днів — стандартний контрольний зріз для більшості м'ясних ліній. Допустиме відхилення від стандарту породи — зазвичай ±10%.",
    norms: [
      { age: "28 днів (відлучення)", norm: "400–600 г" },
      { age: "35 днів", norm: "600–800 г" },
      { age: "56 днів (2 місяці)", norm: "1,2–1,6 кг" },
      { age: "70 днів", norm: "1,8–2,2 кг" },
      { age: "90 днів (3 місяці)", norm: "2,2–2,8 кг" },
    ],
    note: "Норми для м'ясних порід (Нова Зеландська, Каліфорнійська). Для декоративних і хутрових порід — значно нижчі.",
  },
  {
    icon: "📈",
    title: "Середньодобовий приріст (СДП)",
    priority: "Ключовий",
    desc: "СДП = (Маса2 − Маса1) ÷ Кількість днів між зважуваннями. Вимірюється у грамах на добу. Для м'ясних порід нормальний СДП від відлучення до 70 днів: 30–45 г/добу. СДП нижче 25 г/добу — сигнал для бракування або перевірки здоров'я.",
    norms: [
      { age: "28–56 днів", norm: "35–45 г/добу" },
      { age: "56–70 днів", norm: "28–38 г/добу" },
      { age: "70–90 днів", norm: "22–30 г/добу" },
    ],
    note: "Після 90 днів ефективність приросту різко падає — це підстава для забою відгодівельного молодняку.",
  },
  {
    icon: "🥩",
    title: "Забійний вихід",
    priority: "Ключовий",
    desc: "Відсоток маси тушки від живої маси. Вимірюється після забою. Норма для м'ясних порід: 56–62%. Вище 60% — відмінний показник. Нижче 54% — незадовільно для відтворення.",
    norms: [
      { age: "М'ясні породи (НЗБ, Каліфорнійська)", norm: "58–62%" },
      { age: "Хутрові породи (Рекс, Шиншила)", norm: "52–56%" },
      { age: "Місцеві породи (Сірий велетень)", norm: "54–58%" },
    ],
    note: "Забійний вихід залежить від вгодованості, підготовки до забою (голодування 12 год) і методу забою.",
  },
  {
    icon: "🔄",
    title: "Конверсія корму (ІКК)",
    priority: "Важливий",
    desc: "Індекс конверсії корму = Витрата корму (кг) ÷ Приріст живої маси (кг). Показує скільки кг корму потрібно на 1 кг приросту. Норма для м'ясних порід: 2,8–3,5. Менше 3,0 — відмінно. Більше 4,0 — незадовільно.",
    norms: [
      { age: "Відмінно", norm: "2,5–3,0 кг корму / кг приросту" },
      { age: "Добре", norm: "3,0–3,5" },
      { age: "Задовільно", norm: "3,5–4,0" },
      { age: "Незадовільно", norm: "Більше 4,0" },
    ],
    note: "ІКК рахується за весь відгодівельний період. Тварини з поганим ІКК — перші кандидати на вибраковку.",
  },
];

const DOE_CRITERIA = [
  {
    criterion: "Плодючість (кількість народжених)",
    ideal: "8–12 крільченят",
    min: "Менше 5 — привід для вибраковки після 3 окролів",
  },
  {
    criterion: "Живонародженість",
    ideal: "Вище 90%",
    min: "Нижче 75% системно — вибраковка",
  },
  {
    criterion: "Виживаність до відлучення",
    ideal: "Вище 85%",
    min: "Нижче 70% — проблема з молочністю або материнством",
  },
  {
    criterion: "Молочність (маса гнізда у 21 день)",
    ideal: "Вище 2,5 кг",
    min: "Нижче 1,8 кг — недостатня молочність",
  },
  {
    criterion: "Кількість функціональних сосків",
    ideal: "8–10",
    min: "Менше 8 — обмежує розмір вигодуваного посліду",
  },
  {
    criterion: "Кондиція тіла (BCS) на момент злучки",
    ideal: "3,0–3,5 за шкалою 1–5",
    min: "Нижче 2,5 або вище 4,0 — знижує рецептивність",
  },
  {
    criterion: "Міжокрольний інтервал",
    ideal: "42–45 днів (напівінтенсивна схема)",
    min: "Більше 60 днів без причини — оцінити причину",
  },
  {
    criterion: "Кількість продуктивних окролів за рік",
    ideal: "5–7 (напівінтенсивна схема)",
    min: "Менше 4 — незадовільна продуктивність",
  },
];

const BUCK_CRITERIA = [
  {
    criterion: "Жива маса (відповідно до породи)",
    ideal: "Верхня третина норми породи",
    min: "Нижче середнього — не рекомендується для відтворення",
  },
  {
    criterion: "Стан яєчок",
    ideal: "Обидва опущені, симетричні, щільні",
    min: "Крипторхізм — дискваліфікація",
  },
  {
    criterion: "Лібідо",
    ideal: "Садка протягом 30–60 секунд при підсадці",
    min: "Відмова від спаровування 2+ рази — оцінити причину",
  },
  {
    criterion: "Кількість злучок на тиждень",
    ideal: "3–5 злучки (напівінтенсивна схема)",
    min: "Більше 7 — зниження якості сперми",
  },
  {
    criterion: "Заплідненість самок",
    ideal: "Вище 80%",
    min: "Нижче 60% системно — перевірка сперми або вибраковка",
  },
  {
    criterion: "Зовнішній вигляд та тип тіла",
    ideal: "Відповідає стандарту породи",
    min: "Вади прикусу, деформації кінцівок — вибраковка",
  },
];

const SELECTION_STAGES = [
  {
    stage: "1-й відбір — при відлученні (28–35 днів)",
    desc: "Прибираємо явно відсталих, хворих, з фізичними вадами. Зважуємо і фіксуємо масу кожного крільчати.",
    remove: "Крільчата менше 300 г при відлученні, з деформаціями, хворі",
  },
  {
    stage: "2-й відбір — у 56–70 днів",
    desc: "Основний відбір за живою масою та СДП. Розраховуємо СДП для кожної тварини. Оцінюємо тип тіла, правильність прикусу, стан шерсті.",
    remove: "СДП нижче 25 г/добу, неправильний прикус, явні вади екстер'єру",
  },
  {
    stage: "3-й відбір — у 3–4 місяці (ремонтний молодняк)",
    desc: "Фінальний відбір потенційних плідників і самок. Оцінюємо відповідність стандарту породи, кондицію тіла, стан репродуктивних органів у самців.",
    remove:
      "Крипторхізм, BCS нижче 2,5 або вище 4,0, невідповідність стандарту",
  },
  {
    stage: "Постійна оцінка продуктивності (самки)",
    desc: "Після кожного окролу фіксуємо: кількість народжених, живонароджених, масу гнізда у 21 день, виживаність до відлучення.",
    remove:
      "Менше 5 живих крільченят систематично, виживаність нижче 70%, відмова від посліду",
  },
];

const BreedingEvaluation = () => {
  return (
    <div className="BE-page">
      <div className="BE-header">
        <span className="BE-header-icon">⚖️</span>
        <div>
          <h1 className="BE-title">Племінна оцінка кролів</h1>
          <p className="BE-subtitle">
            Жива маса, СДП, забійний вихід, критерії відбору самок і самців —
            від А до Я
          </p>
        </div>
      </div>

      {/* ЩО ТАКЕ ПЛЕМІННА ОЦІНКА */}
      <section className="BE-section">
        <h2 className="BE-section-title">
          <span>📌</span> Що таке племінна оцінка
        </h2>
        <p className="BE-text">
          Племінна оцінка — це систематичне вимірювання і порівняння
          продуктивних якостей тварин з метою відбору найкращих для відтворення.
          На відміну від виставкової оцінки (зовнішній вигляд), племінна оцінка
          базується на вимірних показниках: жива маса, приріст, плодючість,
          конверсія корму. Тварина може виглядати ідеально, але мати погані
          продуктивні показники — і навпаки.
        </p>
        <div className="BE-info-box">
          <span>💡</span>
          <span>
            Для фермера-практика племінна оцінка важливіша за виставкові бали.
            Найкращий плідник — не той, що виграв на виставці, а той, чиє
            потомство стабільно показує хороший середньодобовий приріст і
            конверсію корму.
          </span>
        </div>
      </section>

      {/* ОСНОВНІ КРИТЕРІЇ */}
      <section className="BE-section">
        <h2 className="BE-section-title">
          <span>📊</span> Основні критерії оцінки
        </h2>
        {EVAL_CRITERIA.map((c, i) => (
          <div key={i} className="BE-criterion">
            <div className="BE-criterion-header">
              <span className="BE-criterion-icon">{c.icon}</span>
              <div>
                <span className="BE-criterion-title">{c.title}</span>
                <span
                  className={`BE-criterion-badge BE-criterion-badge--${c.priority === "Ключовий" ? "key" : "imp"}`}
                >
                  {c.priority}
                </span>
              </div>
            </div>
            <p className="BE-criterion-desc">{c.desc}</p>
            <div className="BE-norms-table">
              {c.norms.map((n, j) => (
                <div key={j} className="BE-norm-row">
                  <span className="BE-norm-age">{n.age}</span>
                  <span className="BE-norm-val">{n.norm}</span>
                </div>
              ))}
            </div>
            {c.note && <div className="BE-criterion-note">ℹ {c.note}</div>}
          </div>
        ))}
      </section>

      {/* ВІДБІР САМОК */}
      <section className="BE-section">
        <h2 className="BE-section-title">
          <span>♀️</span> Критерії відбору самок
        </h2>
        <p className="BE-text">
          Самка оцінюється передусім за репродуктивними показниками. Зовнішній
          вигляд — вторинний. Самка з BCS 3,0 і 10 живими крільченятами у гнізді
          краща за «ідеальну» за стандартом самку з 4 крільченятами.
        </p>
        <div className="BE-table-wrap">
          <table className="BE-table">
            <thead>
              <tr>
                <th>Критерій</th>
                <th>Норма / Ідеал</th>
                <th>Поріг вибраковки</th>
              </tr>
            </thead>
            <tbody>
              {DOE_CRITERIA.map((row, i) => (
                <tr key={i}>
                  <td className="BE-td-crit">{row.criterion}</td>
                  <td className="BE-td-good">{row.ideal}</td>
                  <td className="BE-td-bad">{row.min}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ВІДБІР САМЦІВ */}
      <section className="BE-section">
        <h2 className="BE-section-title">
          <span>♂️</span> Критерії відбору самців (плідників)
        </h2>
        <p className="BE-text">
          Один плідник покриває 8–12 самок. Це означає, що генетика самця
          впливає на 50% показників всього стада. Погано відібраний плідник — це
          системна проблема для всього господарства.
        </p>
        <div className="BE-table-wrap">
          <table className="BE-table">
            <thead>
              <tr>
                <th>Критерій</th>
                <th>Норма / Ідеал</th>
                <th>Поріг вибраковки</th>
              </tr>
            </thead>
            <tbody>
              {BUCK_CRITERIA.map((row, i) => (
                <tr key={i}>
                  <td className="BE-td-crit">{row.criterion}</td>
                  <td className="BE-td-good">{row.ideal}</td>
                  <td className="BE-td-bad">{row.min}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="BE-warning">
          <span>⚠️</span>
          <div>
            <strong>Тепловий стрес і плідники:</strong> температура вище 30°C
            протягом 3+ днів викликає тимчасову безплідність у самців. Якість
            сперми відновлюється через 6–8 тижнів після нормалізації
            температури. Перевіряй заплідненість після спеки перш ніж браковати.
          </div>
        </div>
      </section>

      {/* СТАДІЇ ВІДБОРУ */}
      <section className="BE-section">
        <h2 className="BE-section-title">
          <span>🔄</span> Стадії відбору молодняку
        </h2>
        <div className="BE-stages">
          {SELECTION_STAGES.map((s, i) => (
            <div key={i} className="BE-stage">
              <div className="BE-stage-num">{i + 1}</div>
              <div className="BE-stage-body">
                <div className="BE-stage-title">{s.stage}</div>
                <div className="BE-stage-desc">{s.desc}</div>
                <div className="BE-stage-remove">
                  <span className="BE-remove-label">Браковати: </span>
                  {s.remove}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ЯК ВЕСТИ ЗАПИСИ */}
      <section className="BE-section">
        <h2 className="BE-section-title">
          <span>📝</span> Як вести записи для оцінки
        </h2>
        <p className="BE-text">
          Без записів немає оцінки. Мінімальний набір даних на кожну тварину:
        </p>
        <div className="BE-records-grid">
          {[
            {
              icon: "🔢",
              label: "Ідентифікація",
              val: "Номер татуювання або бирки, дата народження, батьки",
            },
            {
              icon: "⚖️",
              label: "Зважування",
              val: "При народженні, відлученні, 56 д, 70 д, 90 д",
            },
            {
              icon: "🐣",
              label: "Дані посліду",
              val: "Кількість народжених / живих, маса гнізда у 21 д, відлучено",
            },
            {
              icon: "🍽️",
              label: "Витрата корму",
              val: "Скільки з'їла група за період — для розрахунку ІКК",
            },
            {
              icon: "💉",
              label: "Ветзаходи",
              val: "Вакцинація, лікування — впливає на результати оцінки",
            },
            {
              icon: "📅",
              label: "Злучки та окроли",
              val: "Дати, результати, кондиція самки",
            },
          ].map((r) => (
            <div key={r.label} className="BE-record-card">
              <span className="BE-record-icon">{r.icon}</span>
              <div className="BE-record-label">{r.label}</div>
              <div className="BE-record-val">{r.val}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ПІДСУМОК */}
      <div className="BE-summary">
        <h3 className="BE-summary-title">Коротко</h3>
        <ul className="BE-summary-list">
          <li>
            Головні критерії: жива маса у 70 днів, СДП, забійний вихід,
            конверсія корму
          </li>
          <li>
            Самки — оцінюються за плодючістю, виживаністю посліду, молочністю
          </li>
          <li>Самці — за живою масою, лібідо та заплідненістю самок</li>
          <li>
            Відбір проводиться у 3 етапи: відлучення → 56–70 днів → 3–4 місяці
          </li>
          <li>Без записів оцінка неможлива — зважуй і фіксуй кожну тварину</li>
          <li>Один поганий плідник псує 50% показників стада</li>
        </ul>
      </div>

      <div className="BE-related">
        <h3 className="BE-related-title">Читайте також</h3>
        <div className="BE-related-grid">
          <Link to="/selection" className="BE-related-link">
            🔬 Селекція
          </Link>
          <Link to="/replacement-stock" className="BE-related-link">
            🧬 Відбір ремонтного молодняку
          </Link>
          <Link to="/weight-control" className="BE-related-link">
            ⚖️ Контроль ваги
          </Link>
          <Link to="/pedigree-records" className="BE-related-link">
            📖 Родоводи та племінний облік
          </Link>
          <Link to="/culling" className="BE-related-link">
            🗑️ Вибраковка
          </Link>
        </div>
      </div>

      <div className="BE-back">
        <Link to="/" className="BE-back-btn">
          ⬅ На головну
        </Link>
        <ShareButton title="Назва цієї сторінки" />
      </div>
    </div>
  );
};

export default BreedingEvaluation;
