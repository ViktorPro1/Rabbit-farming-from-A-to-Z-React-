import { Link } from "react-router-dom";
import "./Parasites.css";

const scheduleTable = [
  {
    time: "20–22 день",
    procedure: "Профілактика кокцидіозу",
    drug: "Солікокс 2,5% — 3 дні за схемою (2/3/4 мл)",
    note: "Кожному крільченяті в рот",
  },
  {
    time: "6–8 тижнів",
    procedure: "Перший огляд на зовнішніх паразитів",
    drug: "За потреби — Стронгхолд або Адвантейдж",
    note: "Перед першим щепленням",
  },
  {
    time: "Навесні (квітень)",
    procedure: "Дегельмінтизація всього поголів'я",
    drug: "Фенбендазол (Panacur) 5 днів",
    note: "За 2 тижні до вакцинації",
  },
  {
    time: "Навесні",
    procedure: "Чіктонік — підтримка імунітету",
    drug: "1 мл на 1 л води, 5–7 днів",
    note: "Згідно порад проекту",
  },
  {
    time: "Восени (вересень)",
    procedure: "Дегельмінтизація всього поголів'я",
    drug: "Фенбендазол або Альбендазол",
    note: "За 2 тижні до вакцинації",
  },
  {
    time: "Восени",
    procedure: "Чіктонік — підтримка імунітету",
    drug: "1 мл на 1 л води, 5–7 днів",
    note: "",
  },
  {
    time: "При появі симптомів",
    procedure: "Вушний кліщ, блохи, хутровий кліщ",
    drug: "Стронгхолд (Selamectin) — 2 обробки з інтервалом 14 днів",
    note: "Обробляти все поголів'я та клітку",
  },
  {
    time: "Щомісяця",
    procedure: "Профілактичний огляд",
    drug: "Вуха, шкіра, шерсть, послід, ясна",
    note: "Рання діагностика — найкраще лікування",
  },
];

const Parasites = () => {
  return (
    <main className="parasites-page">
      <div className="parasites-header">
        <h1>Паразити кроликів</h1>
        <p>
          Зовнішні та внутрішні паразити — симптоми, лікування та профілактика
        </p>
      </div>

      <div className="parasites-wrap">
        {/* ЗОВНІШНІ */}
        <div className="parasites-section-title">🔬 Зовнішні паразити</div>
        <div className="parasites-grid">
          <article className="parasites-card">
            <div className="parasites-card-header">
              <span className="parasites-icon">👂</span>
              <h3>Вушний кліщ (Psoroptes cuniculi)</h3>
            </div>
            <div className="parasites-card-body">
              <div className="parasites-chips">
                <span className="parasites-chip danger">Дуже поширений</span>
                <span className="parasites-chip ok">Добре лікується</span>
              </div>
              <p>
                <strong>Симптоми:</strong>
              </p>
              <ul>
                <li>Сильний свербіж вух — кролик трясе головою, чухає вуха</li>
                <li>
                  Коричневі або жовтуваті кірки та виділення всередині вуха
                </li>
                <li>
                  При занедбаності — нахил голови, порушення рівноваги (отит)
                </li>
              </ul>
              <p>
                <strong>Діагностика:</strong> огляд вуха — кірки видно
                неозброєним оком. Точно — зіскрібок під мікроскопом.
              </p>
              <p>
                <strong>Лікування:</strong>
              </p>
              <ul>
                <li>
                  <strong>Стронгхолд (Selamectin)</strong> — краплі на холку, 2
                  обробки з інтервалом 14 днів. Найзручніший метод.
                </li>
                <li>
                  <strong>Івермектин</strong> — підшкірно або перорально, 2
                  обробки з інтервалом 14 днів.
                </li>
                <li>
                  <strong>Акарицидні краплі у вухо</strong> (Отодектин,
                  Амітразин плюс) — безпосередньо в слуховий прохід.
                </li>
                <li>
                  Кірки не видаляти насильно — вони відпадуть самі після
                  загибелі кліщів.
                </li>
              </ul>
              <div className="parasites-alert warn">
                ⚠️ Обробляти всіх кроликів у господарстві одночасно, навіть без
                симптомів — кліщ передається при контакті.
              </div>
              <p>
                <strong>Профілактика:</strong> щомісячний огляд вух, карантин
                нових тварин 2 тижні.
              </p>
            </div>
          </article>

          <article className="parasites-card">
            <div className="parasites-card-header">
              <span className="parasites-icon">🕷️</span>
              <h3>Хутровий кліщ (Cheyletiella parasitovorax)</h3>
            </div>
            <div className="parasites-card-body">
              <div className="parasites-chips">
                <span className="parasites-chip warn">Заразний для людини</span>
                <span className="parasites-chip ok">Лікується</span>
              </div>
              <p>
                <strong>Симптоми:</strong>
              </p>
              <ul>
                <li>
                  Лупа — білясті лусочки шкіри, особливо в ділянці холки та
                  спини
                </li>
                <li>Свербіж (не завжди виражений)</li>
                <li>При сильному зараженні — випадання шерсті</li>
                <li>
                  Іноді видно рух кліщів у лусочках (звідси назва «walking
                  dandruff»)
                </li>
              </ul>
              <p>
                <strong>Лікування:</strong>
              </p>
              <ul>
                <li>
                  <strong>Стронгхолд</strong> — 2–3 обробки з інтервалом 14 днів
                </li>
                <li>
                  <strong>Івермектин</strong> — 2 обробки з інтервалом 14 днів
                </li>
                <li>Дезінфекція клітки, підстилки</li>
              </ul>
              <div className="parasites-alert warn">
                ⚠️ Може викликати тимчасовий свербіж у людей при контакті. Мийте
                руки після роботи із зараженими тваринами.
              </div>
            </div>
          </article>

          <article className="parasites-card">
            <div className="parasites-card-header">
              <span className="parasites-icon">🦟</span>
              <h3>Блохи</h3>
            </div>
            <div className="parasites-card-body">
              <div className="parasites-chips">
                <span className="parasites-chip warn">
                  Переносник міксоматозу
                </span>
                <span className="parasites-chip ok">Лікується</span>
              </div>
              <p>
                <strong>Симптоми:</strong>
              </p>
              <ul>
                <li>Свербіж, кролик часто чухається</li>
                <li>Чорні крапки (екскременти блох) у шерсті біля основи</li>
                <li>Анемія при масивному зараженні (особливо молодняк)</li>
                <li>Блохи є переносниками міксоматозу</li>
              </ul>
              <p>
                <strong>Лікування:</strong>
              </p>
              <ul>
                <li>
                  <strong>Стронгхолд (Selamectin)</strong> — краплі на холку,
                  найбезпечніший варіант
                </li>
                <li>
                  <strong>Адвантейдж (Imidacloprid)</strong> — краплі на холку
                </li>
                <li>Одночасна обробка клітки та середовища</li>
              </ul>
              <div className="parasites-alert danger">
                🚫 Не використовувати препарати з перметрином — токсичні для
                кроликів.
              </div>
              <p>
                <strong>Профілактика:</strong> ізоляція від котів та собак,
                регулярні огляди, москітні сітки.
              </p>
            </div>
          </article>

          <article className="parasites-card">
            <div className="parasites-card-header">
              <span className="parasites-icon">🔎</span>
              <h3>Воші та власоїди</h3>
            </div>
            <div className="parasites-card-body">
              <div className="parasites-chips">
                <span className="parasites-chip ok">Менш поширені</span>
                <span className="parasites-chip ok">Легко лікуються</span>
              </div>
              <p>
                <strong>Збудники:</strong> Haemodipsus ventricosus (справжня
                вош), Listrophorus gibbus (хутровий власоїд — не кровосисний).
              </p>
              <p>
                <strong>Симптоми:</strong>
              </p>
              <ul>
                <li>Свербіж, розчісування</li>
                <li>Видимі комахи або гниди на волосинах біля основи</li>
                <li>Анемія при сильному зараженні</li>
              </ul>
              <p>
                <strong>Лікування:</strong>
              </p>
              <ul>
                <li>Івермектин — 2 обробки з інтервалом 14 днів</li>
                <li>Стронгхолд або Адвантейдж</li>
                <li>
                  Обов'язкова дезінфекція клітки — яйця стійкі в середовищі
                </li>
              </ul>
              <p>
                <strong>Профілактика:</strong> карантин, гігієна, уникати
                контакту з дикими кроликами.
              </p>
            </div>
          </article>
        </div>

        {/* ВНУТРІШНІ */}
        <div className="parasites-section-title">🧫 Внутрішні паразити</div>
        <div className="parasites-grid">
          <article className="parasites-card">
            <div className="parasites-card-header">
              <span className="parasites-icon">🪱</span>
              <h3>Глисти (гельмінти)</h3>
            </div>
            <div className="parasites-card-body">
              <div className="parasites-chips">
                <span className="parasites-chip warn">
                  Частіше у господарських
                </span>
                <span className="parasites-chip ok">Лікується</span>
              </div>
              <p>
                <strong>Збудники:</strong> Passalurus ambiguus (кролячий
                острогрист — найпоширеніший), Graphidium strigosum,
                Trichostrongylus retortaeformis.
              </p>
              <p>
                <strong>Симптоми:</strong>
              </p>
              <ul>
                <li>Відставання в рості, схуднення при нормальному апетиті</li>
                <li>Роздутий живіт</li>
                <li>Свербіж в ділянці анального отвору (Passalurus)</li>
                <li>Тьмяна шерсть, млявість</li>
                <li>При сильному зараженні — анемія, пронос</li>
              </ul>
              <p>
                <strong>Діагностика:</strong> копрограма у ветеринарній
                лабораторії — найточніший метод.
              </p>
              <p>
                <strong>Лікування:</strong>
              </p>
              <ul>
                <li>
                  <strong>Фенбендазол (Panacur)</strong> — 20 мг/кг раз на день
                  5 днів або 50 мг/кг одноразово
                </li>
                <li>
                  <strong>Альбендазол</strong> — 10–15 мг/кг 3 дні
                </li>
                <li>
                  <strong>Івермектин</strong> — ефективний проти нематод
                </li>
                <li>Повторна обробка через 14 днів</li>
              </ul>
              <p>
                <strong>Профілактика:</strong> дегельмінтизація двічі на рік
                (навесні та восени), чистота, уникати контакту з ґрунтом де
                ходять дикі тварини.
              </p>
            </div>
          </article>

          <article className="parasites-card">
            <div className="parasites-card-header">
              <span className="parasites-icon">🦠</span>
              <h3>Кокцидії (докладно)</h3>
            </div>
            <div className="parasites-card-body">
              <div className="parasites-chips">
                <span className="parasites-chip danger">
                  Головна причина загибелі молодняку
                </span>
              </div>
              <p>
                <strong>Збудники:</strong> 11 видів Eimeria у кроликів.
                Найнебезпечніші: E. stiedae (печінкова форма), E. intestinalis
                та E. flavescens (кишкова форма).
              </p>
              <p>
                <strong>Симптоми кишкової форми:</strong>
              </p>
              <ul>
                <li>Водянистий або кривавий послід</li>
                <li>Здутий болючий живіт</li>
                <li>Різке схуднення</li>
                <li>Загибель кроленят 3–8 тижнів без лікування</li>
              </ul>
              <p>
                <strong>Симптоми печінкової форми:</strong>
              </p>
              <ul>
                <li>Жовтяниця (жовті білки очей)</li>
                <li>Збільшений живіт</li>
                <li>Повільніший розвиток</li>
              </ul>
              <p>
                <strong>Лікування:</strong>
              </p>
              <ul>
                <li>
                  <strong>Солікокс 2,5%</strong> — 0,4 мл/кг двічі на день 2 дні
                  поспіль
                </li>
                <li>
                  <strong>Байкокс 5%</strong> — 0,2 мл/кг одноразово, повторити
                  через 5 днів
                </li>
                <li>Регідратація при зневодненні</li>
              </ul>
              <p>
                <strong>Профілактика:</strong> обов'язковий курс Солікоксу
                молодняку з 20-го дня, щоденна чистка посліду, сухі підлоги з
                сіткою.
              </p>
              <div className="parasites-alert ok">
                ✅ Ооцисти кокцидій гинуть при температурі +60°C та обробці 10%
                розчином аміаку. Звичайні дезінфектанти малоефективні.
              </div>
            </div>
          </article>
        </div>

        {/* ГРАФІК */}
        <div className="parasites-section-title">
          📅 Рекомендований графік обробок від паразитів
        </div>
        <div
          className="parasites-note"
          style={{ padding: 0, overflow: "hidden" }}
        >
          <div style={{ overflowX: "auto" }}>
            <table className="parasites-table">
              <thead>
                <tr>
                  <th>Час / вік</th>
                  <th>Процедура</th>
                  <th>Препарат</th>
                  <th>Примітка</th>
                </tr>
              </thead>
              <tbody>
                {scheduleTable.map((row) => (
                  <tr key={row.time + row.procedure}>
                    <td>
                      <strong>{row.time}</strong>
                    </td>
                    <td>{row.procedure}</td>
                    <td>{row.drug}</td>
                    <td>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ЗАБОРОНЕНІ */}
        <div className="parasites-note" style={{ marginTop: "1.5rem" }}>
          <h2 style={{ color: "#c62828" }}>
            🚫 Препарати, які ЗАБОРОНЕНІ для кроликів
          </h2>
          <ul>
            <li>
              <strong>Перметрин та піретрини</strong> — є в багатьох спреях від
              бліх для котів/собак. Для кроликів смертельні.
            </li>
            <li>
              <strong>Фіпроніл (Frontline)</strong> — токсичний для кроликів, не
              використовувати.
            </li>
            <li>
              <strong>Аверсектин у формі для великої рогатої худоби</strong> —
              концентрація надто висока.
            </li>
            <li>
              <strong>Більшість спреїв «від усього»</strong> без конкретного
              зазначення кроликів — перевіряйте склад.
            </li>
          </ul>
          <div className="parasites-alert danger">
            При сумніві щодо препарату — спочатку консультація з ветеринаром,
            потім застосування.
          </div>
        </div>

        <div className="parasites-back">
          <Link to="/" className="parasites-back-btn">
            ⬅ На головну
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Parasites;
