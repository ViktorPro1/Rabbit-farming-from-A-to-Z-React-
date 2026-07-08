import { Link } from "react-router-dom";
import "./Parasites.css";
import ShareButton from "../../components/ShareButton/ShareButton";

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
              <p>
                <strong>Народні методи (допоміжно):</strong>
              </p>
              <ul>
                <li>
                  Розм'якшення кірок теплою рослинною олією (соняшниковою або
                  вазеліновою) перед обробкою — олія частково перекриває доступ
                  повітря кліщам і полегшує чищення
                </li>
                <li>
                  Закапування 1–2 крапель підігрітої олії у вухо кілька днів
                  поспіль зменшує подразнення, але сама по собі кліща не знищує
                </li>
              </ul>
              <div className="parasites-alert warn">
                ⚠️ Обробляти всіх кроликів у господарстві одночасно, навіть без
                симптомів — кліщ передається при контакті. Народні засоби лише
                полегшують стан, основне лікування — акарицидні препарати.
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
              <p>
                <strong>Народні методи (допоміжно):</strong>
              </p>
              <ul>
                <li>
                  Обробка клітки та інвентарю розчином деревної золи або
                  відваром полину — засіб для дезінфекції середовища, а не для
                  лікування самої тварини
                </li>
                <li>
                  Купання у слабкому дьогтьовому милі допомагає прибрати лусочки
                  й трохи полегшує свербіж
                </li>
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
                <li>Чорні крапки (екскременти бліх) у шерсті біля основи</li>
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
              <p>
                <strong>Народні методи (допоміжно):</strong>
              </p>
              <ul>
                <li>
                  Розкладання пучків сухої полину або лаванди у клітці — запах
                  відлякує бліх, але не знищує вже наявну популяцію
                </li>
                <li>
                  Обробка підлоги клітки деревною золою після миття та
                  просушування — підсушує середовище, незручне для личинок бліх
                </li>
              </ul>
              <div className="parasites-alert danger">
                🚫 Не використовувати препарати з перметрином — токсичні для
                кроликів. Народні відлякувачі не замінюють обробку від бліх, що
                вже є на тварині.
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
                <strong>Народні методи (допоміжно):</strong>
              </p>
              <ul>
                <li>
                  Настій махорки або тютюну для обробки клітки й інвентарю (не
                  наносити на саму тварину) — традиційний засіб дезінсекції
                  приміщень
                </li>
                <li>
                  Прожарювання дерев'яних елементів клітки на сонці — допомагає
                  знищити гнид у щілинах
                </li>
              </ul>
              <p>
                <strong>Профілактика:</strong> карантин, гігієна, уникати
                контакту з дикими кроликами.
              </p>
            </div>
          </article>

          <article className="parasites-card">
            <div className="parasites-card-header">
              <span className="parasites-icon">🔴</span>
              <h3>Короста (Sarcoptes / Notoedres)</h3>
            </div>
            <div className="parasites-card-body">
              <div className="parasites-chips">
                <span className="parasites-chip danger">
                  Заразна для людини
                </span>
                <span className="parasites-chip ok">Лікується</span>
              </div>
              <p>
                <strong>Збудники:</strong> Sarcoptes scabiei — підшкірний кліщ,
                риє ходи в шкірі. Notoedres cati — вражає переважно голову та
                вуха. Передається прямим контактом, через підстилку та інвентар.
              </p>
              <p>
                <strong>Симптоми:</strong>
              </p>
              <ul>
                <li>
                  Сильний свербіж, особливо вночі — кролик безперервно
                  розчісується
                </li>
                <li>
                  Потовщення та зморшкуватість шкіри, сірувато-жовті кірки —
                  найчастіше на носі, навколо очей, біля основи вух, на лапах
                </li>
                <li>Випадання шерсті на уражених ділянках</li>
                <li>
                  При занедбаності — розповсюдження по всьому тілу, виснаження,
                  загибель
                </li>
              </ul>
              <p>
                <strong>Діагностика:</strong> зіскрібок шкіри з ураженої ділянки
                під мікроскопом — виявлення кліщів або їх яєць.
              </p>
              <p>
                <strong>Лікування:</strong>
              </p>
              <ul>
                <li>
                  <strong>Івермектин</strong> — 0,4 мг/кг підшкірно або
                  перорально, 2–3 обробки з інтервалом 10–14 днів
                </li>
                <li>
                  <strong>Стронгхолд (Selamectin)</strong> — краплі на холку, 2
                  обробки з інтервалом 14 днів
                </li>
                <li>
                  Кірки попередньо розмочити теплою водою з милом і обережно
                  видалити перед обробкою
                </li>
                <li>
                  Обробити всіх кроликів у господарстві одночасно, навіть без
                  симптомів
                </li>
                <li>Повна дезінфекція кліток, підстилки, інвентарю</li>
              </ul>
              <p>
                <strong>Народні методи (допоміжно):</strong>
              </p>
              <ul>
                <li>
                  Березовий дьоготь, розведений з рослинною олією 1:3-1:4, —
                  традиційно наносили на уражені ділянки, змазує шкіру та
                  утруднює дихання кліщам
                </li>
                <li>
                  Господарське мило перед обробкою — розм'якшує кірки й очищає
                  шкіру
                </li>
              </ul>
              <div className="parasites-alert danger">
                🚫 Sarcoptes scabiei передається людині. Працювати з хворою
                твариною тільки в рукавичках. При появі свербіжу у людини —
                звернутися до дерматолога. Дьоготь — допоміжний засіб, коросту
                він сам по собі не виліковує, потрібен акарицидний препарат.
              </div>
              <p>
                <strong>Профілактика:</strong> карантин нових тварин 2 тижні,
                регулярний огляд шкіри, уникати контакту з дикими кроликами та
                гризунами.
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
                <strong>Народні методи (допоміжно):</strong>
              </p>
              <ul>
                <li>
                  Гарбузове насіння (подрібнене, додане у корм) — традиційний
                  профілактичний засіб проти гельмінтів у кроликів
                </li>
                <li>
                  Часник у невеликій кількості з кормом та відвар полину — давня
                  практика для профілактики, ефект слабший за антигельмінтні
                  препарати
                </li>
              </ul>
              <div className="parasites-alert warn">
                ⚠️ Народні засоби працюють лише як профілактика та легка
                підтримка. При підтвердженому зараженні глистами застосовується
                антигельмінтний препарат.
              </div>
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
              <div className="parasites-alert danger">
                🚫 Народні засоби не лікують кокцидіоз і не замінюють
                кокцидіостатик. Через високу швидкість загибелі молодняку
                затримка з препаратом заради народних методів небезпечна для
                поголів'я.
              </div>
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

        <div className="parasites-related">
          <h3 className="parasites-related-title">Читайте також</h3>
          <div className="parasites-related-grid">
            <Link to="/diseases" className="parasites-related-link">
              🩺 Хвороби
            </Link>
            <Link to="/water-medication" className="parasites-related-link">
              💧 Пропойка
            </Link>
            <Link to="/zoonoses" className="parasites-related-link">
              🦠 Зоонози
            </Link>
            <Link to="/biosecurity" className="parasites-related-link">
              🛡️ Біобезпека та карантин
            </Link>
            <Link to="/dosage-calculator" className="parasites-related-link">
              🧮 Калькулятор дозування
            </Link>
          </div>
        </div>

        <div className="parasites-back">
          <Link to="/" className="parasites-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Назва цієї сторінки" />
        </div>
      </div>
    </main>
  );
};

export default Parasites;
