import "./ShowJudging.css";

const JUDGING_STEPS = [
  {
    step: 1,
    title: "Перевірка на дискваліфікацію",
    desc: "Суддя бере кроля в руки і першочергово шукає дискваліфікаційні ознаки: перевіряє прикус, вагу, татуювання, стан вух та очей, наявність паразитів. Якщо виявлена DQ — тварина знімається з оцінки одразу.",
    icon: "🔍",
  },
  {
    step: 2,
    title: "Позиція та поза",
    desc: "Суддя встановлює кроля у правильну позицію відповідно до типу тіла породи. Наприклад комерційний тип — горизонтально, повна арка — природня стійка. Тварина має стояти спокійно.",
    icon: "📐",
  },
  {
    step: 3,
    title: "Оцінка типу тіла",
    desc: "Суддя пальпує тіло: плечі, спину, поперек, крупа. Оцінює м'язовість, пропорції, ширину крупа відносно плечей, відчуття щільності та маси тіла.",
    icon: "🐇",
  },
  {
    step: 4,
    title: "Оцінка хутра",
    desc: "Суддя проводить рукою проти шерсті і за шерстю — перевіряє щільність, текстуру, тип (flyback/rollback/standing), рівномірність довжини, наявність мертвого хутра або проплішин.",
    icon: "🪮",
  },
  {
    step: 5,
    title: "Оцінка кольору",
    desc: "Суддя перевіряє відповідність кольору стандарту: тон, рівномірність, підшерсток, відсутність сторонніх волосин. У плямистих порід — симетрію та правильність малюнку.",
    icon: "🎨",
  },
  {
    step: 6,
    title: "Голова, вуха, очі, лапи",
    desc: "Залежно від породи оцінюються пропорції голови, довжина та постановка вух, колір очей, пряма постановка лап, форма хвоста.",
    icon: "👁️",
  },
  {
    step: 7,
    title: "Загальна кондиція",
    desc: "Суддя оцінює загальний стан тварини: чи здорова, чи активна, чи чиста. Хвора або виснажена тварина не може отримати високу оцінку незалежно від типу тіла.",
    icon: "💪",
  },
  {
    step: 8,
    title: "Коментар та розміщення",
    desc: "Суддя диктує коментарі секретарю — що добре і що потрібно покращити. Потім розміщує тварин у класі від кращої до гіршої. Коментарна картка стає власністю учасника.",
    icon: "📝",
  },
];

const CLASSES_ORDER = [
  {
    class: "Senior Buck (Старший самець)",
    age: "6+ місяців (або 8+ для деяких порід)",
    note: "Оцінюється першим у своїй породі",
  },
  { class: "Senior Doe (Старша самка)", age: "6+ місяців", note: "" },
  {
    class: "6/8 Buck (Проміжний самець)",
    age: "6–8 місяців",
    note: "Тільки для 6-класових порід",
  },
  {
    class: "6/8 Doe (Проміжна самка)",
    age: "6–8 місяців",
    note: "Тільки для 6-класових порід",
  },
  { class: "Junior Buck (Молодший самець)", age: "До 6 місяців", note: "" },
  {
    class: "Junior Doe (Молодша самка)",
    age: "До 6 місяців",
    note: "Оцінюється останньою в класах",
  },
];

const AWARDS_LADDER = [
  {
    level: "1-е місце в класі",
    desc: "Найкращий у своєму класі (напр. Best Senior Buck)",
  },
  {
    level: "Best of Variety (BOV)",
    desc: "Найкращий представник кольору/різновиду — переможці класів змагаються між собою",
  },
  {
    level: "Best of Breed (BOB)",
    desc: "Найкращий кроль породи — переможці різновидів змагаються між собою",
  },
  {
    level: "Best Opposite Sex (BOS)",
    desc: "Найкращий протилежної статі до BOB",
  },
  {
    level: "Best in Show (BIS)",
    desc: "Найкращий кроль всієї виставки — переможці всіх порід змагаються між собою",
  },
  {
    level: "Best Opposite in Show (BOIS)",
    desc: "Найкращий протилежної статі до BIS",
  },
];

const SCORE_CARD_ITEMS = [
  { field: "Порода / Різновид", example: "New Zealand / White" },
  { field: "Клас", example: "Senior Doe" },
  { field: "Татуювання", example: "A14" },
  { field: "Стать", example: "Самка (Doe)" },
  { field: "Місце", example: "1 з 6" },
  {
    field: "Коментарі судді",
    example:
      "Відмінний тип тіла, широкий круп. Хутро дещо рідке на спині. Хороший колір.",
  },
  { field: "Назва виставки", example: "Kyiv Rabbit Show" },
  { field: "Дата", example: "15.06.2026" },
  { field: "Підпис судді", example: "___________" },
];

const JUDGE_TIPS = [
  {
    icon: "📓",
    title: "Записуй коментарі",
    desc: "Не покладайся тільки на картку секретаря — бери нотатник і фіксуй слова судді сам. Це золото для селекції.",
  },
  {
    icon: "🤐",
    title: "Не сперечайся із суддею",
    desc: "Суддя має власну думку. Можна тихо не погоджуватись, але вголос сперечатись — погана практика і псує репутацію.",
  },
  {
    icon: "🔄",
    title: "Різні судді — різні результати",
    desc: "Та сама тварина у різних суддів може отримати різні місця. Це нормально — суддівство суб'єктивне в деталях.",
  },
  {
    icon: "📸",
    title: "Фотографуй переможців",
    desc: "Фото тварин що перемогли у твоїй породі — візуальне навчання. Що відрізняє BOB від твого кроля?",
  },
  {
    icon: "🤝",
    title: "Знайомся з суддями після",
    desc: "Після закінчення суддівства більшість суддів готові відповісти на запитання. Використай це — питай конкретно.",
  },
  {
    icon: "📊",
    title: "Аналізуй результати",
    desc: "Порівнюй свої результати виставка за виставкою. Якщо суддя щоразу вказує на одне й те саме — це реальна вада стада.",
  },
];

const ShowJudging = () => {
  return (
    <div className="SJ-page">
      <div className="SJ-header">
        <span className="SJ-header-icon">⚖️</span>
        <div>
          <h1 className="SJ-title">Суддівство на виставках</h1>
          <p className="SJ-subtitle">
            Як працюють судді, порядок оцінки, класи та картка оцінки
          </p>
        </div>
      </div>

      {/* ХТО ТАКИЙ СУДДЯ */}
      <section className="SJ-section">
        <h2 className="SJ-section-title">
          <span>👨‍⚖️</span> Хто такий суддя
        </h2>
        <p className="SJ-text">
          Суддя на кролівницькій виставці — це ліцензований фахівець, який знає
          стандарти порід напам'ять і пройшов офіційну підготовку та іспити. В
          ARBA ліцензія судді вимагає кількох років роботи, проходження програми
          навчання і письмового іспиту. В BRC — аналогічна система. На одній
          виставці можуть працювати кілька суддів одночасно — кожен оцінює різні
          породи або різні секції.
        </p>
        <div className="SJ-fact">
          <span>📌</span>
          <span>
            В ARBA суддя сам бере кроля і ставить у позицію — не учасник. Це
            принципова відмінність від більшості інших тваринницьких виставок.
            Завдання судді — дати тварині показати себе з найкращого боку.
          </span>
        </div>
      </section>

      {/* ПОРЯДОК ОЦІНКИ */}
      <section className="SJ-section">
        <h2 className="SJ-section-title">
          <span>🔢</span> Як суддя оцінює кроля
        </h2>
        <p className="SJ-text">
          Оцінка кожної тварини займає 1–3 хвилини. Суддя проходить через
          фіксований алгоритм — завжди в одному порядку, щоб нічого не
          пропустити.
        </p>
        <div className="SJ-steps">
          {JUDGING_STEPS.map((s) => (
            <div key={s.step} className="SJ-step">
              <div className="SJ-step-num">{s.step}</div>
              <div>
                <div className="SJ-step-title">
                  {s.icon} {s.title}
                </div>
                <div className="SJ-step-desc">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* КЛАСИ */}
      <section className="SJ-section">
        <h2 className="SJ-section-title">
          <span>🗂️</span> Класи та порядок виступу
        </h2>
        <p className="SJ-text">
          Тварини змагаються всередині свого класу — за статтю і віком.
          Перемагає найкращий у класі, потім переможці класів змагаються між
          собою.
        </p>
        <div className="SJ-table-wrap">
          <table className="SJ-table">
            <thead>
              <tr>
                <th>Клас</th>
                <th>Вік</th>
                <th>Примітка</th>
              </tr>
            </thead>
            <tbody>
              {CLASSES_ORDER.map((c) => (
                <tr key={c.class}>
                  <td className="SJ-td-bold">{c.class}</td>
                  <td>{c.age}</td>
                  <td className="SJ-td-note">{c.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="SJ-note">
          Кроль завжди показується у своєму справжньому класі — не можна
          «заявити» молодшу тварину у старший клас.
        </div>
      </section>

      {/* НАГОРОДИ */}
      <section className="SJ-section">
        <h2 className="SJ-section-title">
          <span>🏆</span> Система нагород — від класу до BIS
        </h2>
        <div className="SJ-awards">
          {AWARDS_LADDER.map((a, i) => (
            <div key={i} className="SJ-award-item">
              <div className={`SJ-award-level SJ-award-level--${i}`}>
                {a.level}
              </div>
              <div className="SJ-award-desc">{a.desc}</div>
            </div>
          ))}
        </div>
        <div className="SJ-fact">
          <span>📌</span>
          <span>
            Best in Show — це не окремий конкурс, а природній результат
            піраміди. BOB кожної породи автоматично потрапляє до фінального
            відбору. Суддя (або головний суддя) обирає найкращого з усіх BOB.
          </span>
        </div>
      </section>

      {/* КАРТКА ОЦІНКИ */}
      <section className="SJ-section">
        <h2 className="SJ-section-title">
          <span>📋</span> Картка оцінки (Comment Card)
        </h2>
        <p className="SJ-text">
          Після оцінки кожної тварини секретар виставки заповнює картку з
          результатом і коментарями судді. Ця картка є власністю учасника — її
          потрібно забрати після завершення суддівства.
        </p>
        <div className="SJ-card-mock">
          <div className="SJ-card-title">📄 Зразок картки оцінки</div>
          {SCORE_CARD_ITEMS.map((item) => (
            <div key={item.field} className="SJ-card-row">
              <span className="SJ-card-field">{item.field}</span>
              <span className="SJ-card-value">{item.example}</span>
            </div>
          ))}
        </div>
        <div className="SJ-fact SJ-fact--blue">
          <span>💡</span>
          <span>
            Картка оцінки — найцінніший документ для заводчика. Коментарі судді
            показують конкретні слабкі місця тварини і вказують напрямок для
            покращення стада. Зберігай картки роками і порівнюй динаміку.
          </span>
        </div>
      </section>

      {/* ПОРАДИ УЧАСНИКУ */}
      <section className="SJ-section">
        <h2 className="SJ-section-title">
          <span>💡</span> Поради учаснику
        </h2>
        <div className="SJ-tips-grid">
          {JUDGE_TIPS.map((tip) => (
            <div key={tip.title} className="SJ-tip-card">
              <span className="SJ-tip-icon">{tip.icon}</span>
              <div className="SJ-tip-title">{tip.title}</div>
              <div className="SJ-tip-desc">{tip.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ПІДСУМОК */}
      <div className="SJ-summary">
        <h3 className="SJ-summary-title">Коротко</h3>
        <ul className="SJ-summary-list">
          <li>Суддя сам бере і ставить кроля — учасник тільки спостерігає</li>
          <li>
            Порядок оцінки: DQ → тіло → хутро → колір → голова/вуха → кондиція
          </li>
          <li>Класи: Senior Buck → Senior Doe → Junior Buck → Junior Doe</li>
          <li>Піраміда нагород: 1-е місце → BOV → BOB → BOS → BIS</li>
          <li>Картка оцінки — твоя власність, забирай і зберігай</li>
          <li>Різні судді = різні результати — це нормально, не особисто</li>
        </ul>
      </div>
    </div>
  );
};

export default ShowJudging;
