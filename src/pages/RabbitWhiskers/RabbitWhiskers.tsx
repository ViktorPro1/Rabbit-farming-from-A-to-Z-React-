import "./RabbitWhiskers.css";

const WHISKER_GROUPS = [
  {
    icon: "👄",
    name: "Містакіальні (щічні)",
    lat: "Mystacial vibrissae",
    location: "Щоки та верхня губа",
    length: "Від 2–3 см (передні) до 10–15 см (задні)",
    count: "6 рядів по 3–5 вусів з кожного боку",
    function:
      "Головна сенсорна антена. Передні (короткі) — ідентифікація їжі впритул. Задні (довгі) — вимірювання ширини тунелів і проходів.",
    note: "Довжина задніх містакіальних вусів приблизно дорівнює найширшій частині тіла кроля.",
  },
  {
    icon: "👁️",
    name: "Супраорбітальні (надочні)",
    lat: "Supraorbital vibrissae",
    location: "Над очима",
    length: "3–5 см",
    count: "Невелика група",
    function:
      "Захист очей від гілок та сміття. Діють як «додаткові вії» — сигналізують про наближення предметів до очей.",
    note: "Доповнюють третю повіку (нікітуючу мембрану) у захисті очей.",
  },
  {
    icon: "🦷",
    name: "Ростральні (носові)",
    lat: "Rostral / Mental vibrissae",
    location: "Навколо носа та підборіддя",
    length: "Короткі — 1–3 см",
    count: "Дрібна група",
    function:
      "Компенсація сліпої зони перед носом. Дозволяють ідентифікувати їжу та поверхню безпосередньо перед ротом без участі зору.",
    note: "Саме ці вуса кроль найактивніше використовує під час їди — «перевіряє» корм дотиком перш ніж з'їсти.",
  },
];

const FUNCTIONS = [
  {
    icon: "📏",
    title: "Вимірювання простору",
    desc: "Довгі щічні вуса приблизно рівні ширині тіла кроля. Коли кроль наближається до отвору чи тунелю, вуса першими торкаються стінок і сигналізують: пройде тіло чи ні. Це рятівний механізм, що запобігає застряганню в норах.",
    source: "BunnyLady.com; LittleHayCo.com",
  },
  {
    icon: "🕶️",
    title: "Компенсація сліпих зон",
    desc: "Очі кроля розміщені по боках голови — для огляду за хижаками. Але це створює сліпу зону прямо перед носом. Короткі носові та губні вуса компенсують цей недолік: кроль 'бачить' їжу та предмети поруч через дотик.",
    source: "BiologyInsights.com; BunnyLady.com",
  },
  {
    icon: "🌙",
    title: "Навігація в темряві",
    desc: "Кролі активні в сутінках і на світанку — в умовах слабкого освітлення. Вуса дозволяють орієнтуватись у темних норах та при слабкому освітленні, де зір майже не допомагає.",
    source: "Biology Insights; Scholarpedia Vibrissae",
  },
  {
    icon: "💨",
    title: "Виявлення повітряних потоків",
    desc: "Вуса реагують навіть на мікрорухи повітря — наближення хижака, рух навколо об'єкту. Це система раннього попередження. Навіть незначне відхилення волосини генерує нервовий сигнал у мозку.",
    source: "Wikipedia Vibrissae; PMC9821693 (Northwestern Univ.)",
  },
  {
    icon: "🌿",
    title: "Ідентифікація їжі",
    desc: "Перш ніж з'їсти, кроль торкається корму вусами. Це дозволяє визначити текстуру, форму і відстань до об'єкта. Особливо важливо для розрізнення їстівних рослин від неїстівного сміття.",
    source: "Biology Insights Jan 2026",
  },
  {
    icon: "🐇",
    title: "Соціальна комунікація",
    desc: "При спільному догляді (грумінгу) кролі відчувають один одного вусами — це допомагає визначити відстань і силу дотику. Вуса також відображають емоційний стан: притиснуті назад — страх, направлені вперед — цікавість.",
    source: "Scholarpedia Vibrissal function; Wikipedia Vibrissae",
  },
];

const ANATOMY_FACTS = [
  {
    fact: "Фолікул-синусний комплекс",
    desc: "На відміну від звичайного волосся, кожне вусо росте з фолікул-синусного комплексу — спеціальної структури, заповненої кров'ю (кров'яний синус). Навколо синуса — 100–200 сенсорних нервових клітин різних типів (мінімум 8 типів механорецепторів). Навіть мікровідхилення волосини генерує нервовий сигнал.",
    source: "Wikipedia Vibrissae; Journal of Comparative Neurology",
  },
  {
    fact: "Кератиновий стрижень без нервів",
    desc: "Сам стрижень вуса складається з кератину — інертного структурного білка без нервів. Тому підрізання вуса не болить фізично. Але це позбавляє кроля сенсорного зв'язку з навколишнім світом.",
    source: "RabbitCareTips.com; BunnyLady.com",
  },
  {
    fact: "Представництво в мозку",
    desc: "Вуса займають лише 0,6% поверхні тіла кроля, але їх нейронне представництво у соматосенсорній корі (SI) становить 17,9% усієї карти тіла. Це свідчить про те, яку колосальну кількість інформації вуса передають у мозок.",
    source: "Gould 1986, J Comp Neurol; NCF Neuroethology Blog",
  },
  {
    fact: "Дві карти тіла в мозку",
    desc: "На відміну від гризунів, мозок кроля має дві повні карти поверхні тіла (SI та SII) у соматосенсорній корі. В обох картах вуса займають непропорційно велику ділянку. Пошкодження ділянки SI порушує здатність до навчання через вусові стимули.",
    source: "Galvez et al. 2007; McMullen et al. 1994",
  },
];

const REX_INFO = {
  title: "Рекс та Міні-Рекс — особливий випадок",
  desc: "Породи Рекс і Міні-Рекс несуть рецесивний ген rr, який вкорочує остьові волосини до рівня підшерстку. Цей ген також впливає на вуса — вони стають тоншими, слабшими і хвилястими або скрученими. Це нормально для породи і не є ознакою хвороби. У рексів вуса можуть частково або повністю випадати без видимих причин.",
  points: [
    "Хвилясті або скручені вуса у Рекса — порідна ознака, норма",
    "Випадіння вусів у Рекса — частіше ніж в інших порід, генетично обумовлено",
    "Незважаючи на слабші вуса, Рекси компенсують це нюхом і слухом",
    "На виставках: прямі вуса у Рекса — вада (має бути хвилясте або скручене)",
  ],
};

const PROBLEMS = [
  {
    problem: "Випадіння вусів",
    causes: [
      "Барберинг — сусідній кроль вискубує вуса (перевір наявність коротко обгризених вусів)",
      "Грибкові інфекції (лишай) — округлі проплішини навколо місця випадіння",
      "Кліщові інвазії (Cheyletiella) — лупа і свербіж поруч",
      "Бактеріальна інфекція шкіри обличчя",
      "Гормональні порушення (гіпотиреоз)",
      "Порідна особливість (Рекс) — норма",
    ],
    action:
      "Якщо вуса випадають у некса-породи та без видимих механічних причин — ветеринар",
  },
  {
    problem: "Зламані або вкорочені вуса",
    causes: [
      "Барберинг від сусіда по клітці",
      "Тертя об стінки занадто тісної клітки або годівниці",
      "Самоушкодження при сильному стресі",
    ],
    action: "Вуса відростуть самі. Усунь причину — перевір клітку і сусідів",
  },
  {
    problem: "Асиметрія вусів",
    causes: [
      "Травма однієї сторони обличчя",
      "Одностороннє захворювання шкіри або пазух",
      "E. cuniculi — може викликати одностороннє ураження нерва",
    ],
    action:
      "Помітна асиметрія при нахилі голови — негайно до ветеринара (виключити E. cuniculi)",
  },
];

const RabbitWhiskers = () => {
  return (
    <div className="RW-page">
      <div className="RW-header">
        <span className="RW-header-icon">〰️</span>
        <div>
          <h1 className="RW-title">Вуса кроля (вібриси)</h1>
          <p className="RW-subtitle">
            Анатомія, функції, наука та догляд — від А до Я
          </p>
        </div>
      </div>

      {/* ВСТУП */}
      <div className="RW-intro">
        <p>
          Вуса кроля — це не просто «довге волосся». Це спеціалізована сенсорна
          система, яка займає майже 18% нейронної карти тіла в мозку тварини,
          попри те що самі вуса — лише 0,6% поверхні тіла. Науково вони
          називаються <strong>вібриси</strong> (від лат. <em>vibrare</em> —
          вібрувати).
        </p>
      </div>

      {/* ЗОБРАЖЕННЯ */}
      <div className="RW-image-wrap">
        <img
          src="/images/rabbit-whiskers-anatomy.jpg"
          alt="Анатомія вусів кроля — розміщення груп вусів на голові"
          className="RW-image"
        />
        <div className="RW-image-caption">
          Розміщення груп вусів на голові кроля: містакіальні (щічні),
          супраорбітальні (надочні) та ростральні (носові)
        </div>
      </div>

      {/* ГРУПИ ВУСІВ */}
      <section className="RW-section">
        <h2 className="RW-section-title">
          <span>📍</span> Де ростуть вуса
        </h2>
        <p className="RW-text">
          Вуса кроля не ростуть хаотично — вони розміщені в чітких анатомічних
          групах, кожна з яких виконує свою специфічну функцію.
        </p>
        <div className="RW-groups">
          {WHISKER_GROUPS.map((g) => (
            <div key={g.name} className="RW-group-card">
              <div className="RW-group-header">
                <span className="RW-group-icon">{g.icon}</span>
                <div>
                  <div className="RW-group-name">{g.name}</div>
                  <div className="RW-group-lat">{g.lat}</div>
                </div>
              </div>
              <div className="RW-group-meta">
                <div>
                  <span className="RW-meta-label">Розташування: </span>
                  {g.location}
                </div>
                <div>
                  <span className="RW-meta-label">Довжина: </span>
                  {g.length}
                </div>
                <div>
                  <span className="RW-meta-label">Кількість: </span>
                  {g.count}
                </div>
              </div>
              <div className="RW-group-function">{g.function}</div>
              {g.note && <div className="RW-group-note">💡 {g.note}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ФУНКЦІЇ */}
      <section className="RW-section">
        <h2 className="RW-section-title">
          <span>⚡</span> 6 функцій вусів кроля
        </h2>
        <div className="RW-functions">
          {FUNCTIONS.map((f, i) => (
            <div key={i} className="RW-function-item">
              <span className="RW-function-icon">{f.icon}</span>
              <div>
                <div className="RW-function-title">{f.title}</div>
                <div className="RW-function-desc">{f.desc}</div>
                <div className="RW-function-source">📚 {f.source}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* АНАТОМІЯ */}
      <section className="RW-section">
        <h2 className="RW-section-title">
          <span>🔬</span> Анатомія та нейронаука
        </h2>
        <div className="RW-anatomy">
          {ANATOMY_FACTS.map((a) => (
            <div key={a.fact} className="RW-anatomy-card">
              <div className="RW-anatomy-fact">{a.fact}</div>
              <div className="RW-anatomy-desc">{a.desc}</div>
              <div className="RW-anatomy-source">📚 {a.source}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ЧОМУ НЕ МОЖНА ПІДРІЗАТИ */}
      <section className="RW-section">
        <h2 className="RW-section-title">
          <span>🚫</span> Чому не можна підрізати вуса
        </h2>
        <div className="RW-nocut">
          <div className="RW-nocut-main">
            <p className="RW-text">
              Підрізання вуса не завдає фізичного болю — стрижень з кератину
              нервів не має. Але це позбавляє кроля критично важливої сенсорної
              інформації:
            </p>
            <div className="RW-nocut-effects">
              {[
                {
                  icon: "😵",
                  effect:
                    "Втрата орієнтації у просторі — особливо в темряві або незнайомому місці",
                },
                {
                  icon: "😟",
                  effect:
                    "Підвищений стрес — кроль не може оцінити безпечність простору навколо",
                },
                {
                  icon: "🍽️",
                  effect:
                    "Труднощі з пошуком їжі — втрачає дотиковий орієнтир перед носом",
                },
                {
                  icon: "🚪",
                  effect:
                    "Може застрягти в тунелях або отворах — немає «рулетки» ширини тіла",
                },
                {
                  icon: "⚠️",
                  effect:
                    "Збільшений ризик травм очей — надочні вуса більше не захищають",
                },
              ].map((e) => (
                <div key={e.effect} className="RW-nocut-effect">
                  <span>{e.icon}</span>
                  <span>{e.effect}</span>
                </div>
              ))}
            </div>
            <div className="RW-nocut-note">
              Вуса відростуть самостійно, але на відновлення повної довжини
              потрібно 4–8 тижнів. Ніколи не підрізай вуса при грумінгу.
            </div>
          </div>
        </div>
      </section>

      {/* РЕКС */}
      <section className="RW-section">
        <h2 className="RW-section-title">
          <span>✨</span> {REX_INFO.title}
        </h2>
        <div className="RW-rex">
          <p className="RW-text">{REX_INFO.desc}</p>
          <ul className="RW-rex-list">
            {REX_INFO.points.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ПРОБЛЕМИ */}
      <section className="RW-section">
        <h2 className="RW-section-title">
          <span>🩺</span> Проблеми з вусами — причини та дії
        </h2>
        <div className="RW-problems">
          {PROBLEMS.map((p) => (
            <div key={p.problem} className="RW-problem-card">
              <div className="RW-problem-title">{p.problem}</div>
              <div className="RW-problem-causes-label">Можливі причини:</div>
              <ul className="RW-problem-causes">
                {p.causes.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
              <div className="RW-problem-action">
                <span>→ </span>
                {p.action}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ЦІКАВІ ФАКТИ */}
      <section className="RW-section">
        <h2 className="RW-section-title">
          <span>💡</span> Цікаві факти
        </h2>
        <div className="RW-facts-grid">
          {[
            {
              icon: "🧠",
              fact: "17,9% мозкової карти тіла займають вуса — при 0,6% площі поверхні тіла",
            },
            {
              icon: "💉",
              fact: "100–200 сенсорних нервових клітин у кожному фолікулі-синусному комплексі (мінімум 8 типів механорецепторів)",
            },
            {
              icon: "📐",
              fact: "Довжина задніх вусів ≈ ширина тіла кроля — природна «рулетка» для нір",
            },
            {
              icon: "🗺️",
              fact: "Кролі — одні з небагатьох ссавців з двома повними картами поверхні тіла в мозку (SI і SII)",
            },
            {
              icon: "🔄",
              fact: "Після підрізання вуса відростають повністю за 4–8 тижнів",
            },
            {
              icon: "🦎",
              fact: "Вуса з'явились у предків ссавців у тріасовому періоді (~200+ млн років тому)",
            },
          ].map((f) => (
            <div key={f.fact} className="RW-fact-card">
              <span className="RW-fact-icon">{f.icon}</span>
              <div className="RW-fact-text">{f.fact}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ПІДСУМОК */}
      <div className="RW-summary">
        <h3 className="RW-summary-title">Коротко</h3>
        <ul className="RW-summary-list">
          <li>
            Вуса (вібриси) — спеціалізована сенсорна система, принципово
            відмінна від звичайного хутра
          </li>
          <li>
            3 групи: містакіальні (щічні), супраорбітальні (надочні), ростральні
            (носові)
          </li>
          <li>
            Функції: вимірювання простору, компенсація сліпих зон, навігація в
            темряві, виявлення повітря, ідентифікація їжі, соціальна комунікація
          </li>
          <li>
            Займають 17,9% нейронної карти тіла попри 0,6% поверхні —
            надзвичайно важливі для мозку
          </li>
          <li>
            Ніколи не підрізай — стрижень без нервів, але підрізання руйнує
            сенсорну систему
          </li>
          <li>
            Рекс і Міні-Рекс мають хвилясті або слабкі вуса — це порідна норма
          </li>
          <li>Масове випадіння вусів (не в рекса) — сигнал до ветеринара</li>
        </ul>
      </div>
    </div>
  );
};

export default RabbitWhiskers;
