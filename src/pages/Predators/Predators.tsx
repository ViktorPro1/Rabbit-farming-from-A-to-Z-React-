import { useState } from "react";
import "./Predators.css";

// ─── Types ───────────────────────────────────────────────────────
interface Predator {
  id: string;
  icon: string;
  name: string;
  latinName: string;
  category: "mammal" | "bird" | "rodent";
  active: string;
  method: string;
  traces: string[];
  clue: string;
  farmRisk: "high" | "medium" | "extreme";
  note: string;
}

interface ProtectionMethod {
  id: string;
  icon: string;
  title: string;
  desc: string;
  effectiveAgainst: string[];
  cost: "low" | "medium" | "high";
  details: string;
}

interface TraceSign {
  what: string;
  means: string;
  predator: string;
}

// ─── Data ────────────────────────────────────────────────────────
const predators: Predator[] = [
  {
    id: "weasel",
    icon: "🦦",
    name: "Ласка",
    latinName: "Mustela nivalis",
    category: "mammal",
    active: "Цілодобово, пік — ніч і сутінки",
    method:
      "Протискається через отвори від 2,5 см. Вбиває укусом у потилицю або шию. Часто вбиває більше ніж з'їдає — «надлишкове вбивство»",
    traces: [
      "Жертви зі слідами укусу в потилицю",
      "Тіла розкидані по клітці",
      "Сліди 2×4 см парні, відстань кроку 20–30 см",
      "Кал з шерстю та кістками, скручений, в одному місці",
    ],
    clue: "Всі тварини вбиті, не з'їдені — надлишкове вбивство. Могла пролізти через сітку з коміркою більше 2,5×2,5 см",
    farmRisk: "extreme",
    note: "Найнебезпечніший хижак для клітинного утримання. Єдиний захист — сітка з коміркою ≤2,5 см",
  },
  {
    id: "stoat",
    icon: "🐾",
    name: "Горностай",
    latinName: "Mustela erminea",
    category: "mammal",
    active: "Переважно вдень та в сутінки",
    method:
      "Схожий з лаською, але більший (до 35 см). Пролазить у отвори від 3–4 см. Той самий механізм — укус у потилицю або шию",
    traces: [
      "Сліди більші ніж у ласки: 2,5×4 см",
      "Жертви зосереджені — горностай менш схильний до надлишкового вбивства",
      "Кал темний, скручений",
    ],
    clue: "Особливо небезпечний для молодняку та крільченят. Пролізе через сітку з коміркою 3–4 см",
    farmRisk: "high",
    note: "У зимовий період активний більше — голодний. Часто ховає їжу про запас",
  },
  {
    id: "polecat",
    icon: "🦡",
    name: "Тхір",
    latinName: "Mustela putorius",
    category: "mammal",
    active: "Переважно ніч та сутінки",
    method:
      "Найбільший з куницевих — до 50 см. Пролазить у отвори від 5–6 см. Може прогризати дерев'яні частини клітки та підлогу. Вбиває укусом, часто забирає здобич",
    traces: [
      "Сильний характерний запах мускусу в кролятнику після нападу",
      "Прогризені дерев'яні кути або підлога",
      "Сліди 3×5 см, стрибкова хода, відстань 40–60 см",
      "Залишки тіл або їх повна відсутність",
    ],
    clue: "Різкий запах — головна ознака тхора. Якщо пахне — він тут або був",
    farmRisk: "extreme",
    note: "Може систематично відвідувати одне місце. Потрібна пастка або ліквідація нори",
  },
  {
    id: "marten",
    icon: "🐿️",
    name: "Куниця (лісова та кам'яна)",
    latinName: "Martes martes / Martes foina",
    category: "mammal",
    active: "Ніч. Кам'яна куниця частіше поряд з людиною",
    method:
      "Великий хижак (40–55 см). Чудово лазить по деревах і стінах. Може потрапити через дах. Вбиває укусом, забирає здобич. Одна куниця може знищити все поголів'я за одну ніч",
    traces: [
      "Жертви з укусами в шию або голову",
      "Кліткова сітка пошкоджена або відігнута зверху",
      "Сліди схожі з котячими, але з п'ятьма пальцями, 4×5 см",
    ],
    clue: "Якщо пошкодження зверху — підозрюйте куницю або хижого птаха",
    farmRisk: "extreme",
    note: "Кам'яна куниця живе поряд з людиною, ховається в горищах і сараях",
  },
  {
    id: "fox",
    icon: "🦊",
    name: "Лисиця",
    latinName: "Vulpes vulpes",
    category: "mammal",
    active: "Вечір, ніч, рання ранок",
    method:
      "Риє підкоп під клітку або вольєр. Розгризає або відгинає сітку. Вбиває укусом у шию або горло. При клітинному утриманні — хапає через прутики (відкушені лапи)",
    traces: [
      "Підкоп під кліткою або огорожею (0,5–1 м)",
      "Сліди 5×5 см, чотири пальці, чіткі кігті, парна хода",
      "Кал видовжений з шерстю і кістками, в помітному місці",
      "Відірвані лапи або голови кролів біля клітки",
    ],
    clue: "Відірвані або відкушені лапи через сітку — майже завжди лисиця",
    farmRisk: "high",
    note: "Лисиця повертається на те саме місце. Після першого нападу — посилити захист негайно",
  },
  {
    id: "dog",
    icon: "🐕",
    name: "Здичавілий або безпритульний собака",
    latinName: "Canis lupus familiaris",
    category: "mammal",
    active: "Будь-який час, пік — ніч",
    method:
      "Зламує або розриває сітку, перевертає клітки. Вбивство хаотичне — часто тільки для задоволення інстинкту. Може вбити велику кількість тварин за одну ніч",
    traces: [
      "Перекинуті клітки, зім'ята сітка",
      "Тіла хаотично розкидані з видимими укусами великих зубів",
      "Сліди великих розмірів, хаотична хода",
      "Шерсть на огорожі",
    ],
    clue: "Масштаб хаосу — більший ніж у куницевих. Сітка зігнута, а не прогризена",
    farmRisk: "high",
    note: "Проблема посилюється після паводків та бойових дій — більше бездомних собак",
  },
  {
    id: "cat",
    icon: "🐈",
    name: "Кіт (здичавілий)",
    latinName: "Felis catus",
    category: "mammal",
    active: "Сутінки та ніч",
    method:
      "Залазить на клітку, хапає лапою крізь сітку. Рідко вбиває дорослого кроля, але забирає крільченят або завдає стресу (смерть від стресу без контакту)",
    traces: [
      "Сліди кігтів на даху кліток",
      "Зниклі крільченята без слідів крові",
      "Самки з постійним стресом, відмова від посліду",
    ],
    clue: "Стрес без видимих ушкоджень і зниклі крільченята — підозра на кота",
    farmRisk: "medium",
    note: "Навіть запах кота вночі спричиняє хронічний стрес у кролів",
  },
  {
    id: "hawk",
    icon: "🦅",
    name: "Яструб, канюк, шуліка",
    latinName: "Accipiter, Buteo, Milvus spp.",
    category: "bird",
    active: "Яструб — день; сови — ніч",
    method:
      "Пікірує на відкриті вольєри. Хапає кігтями та переносить. Кролів до 1,5 кг може підняти яструб великий. Дрібніші птахи — тільки молодняк",
    traces: [
      "Зниклі кролі без слідів — вольєрне або ямове утримання",
      "Пір'я птаха поблизу",
      "Сліди кігтів на ґрунті або шерсть",
    ],
    clue: "Зник без тіла та слідів крові — підозра на хижого птаха або куницю",
    farmRisk: "medium",
    note: "Особливо небезпечні для молодняку у відкритих вольєрах та ямового утримання",
  },
  {
    id: "rats",
    icon: "🐀",
    name: "Щури",
    latinName: "Rattus norvegicus",
    category: "rodent",
    active: "Ніч",
    method:
      "Самі не нападають на дорослих кролів. Поїдають корм, забруднюють воду, переносять хвороби (лептоспіроз, сальмонельоз, псевдотуберкульоз). Можуть нападати на крільченят",
    traces: [
      "Гризені края годівниць та поїлок",
      "Норки по периметру кролятника",
      "Кал у кормі — дрібний, видовжений",
      "Слизькі сліди вздовж стін",
    ],
    clue: "Немає прямих жертв серед дорослих, але захворюваність зросла — підозра на щурів",
    farmRisk: "high",
    note: "Щури — головний вектор кокцидіозу та лептоспірозу. Боротьба обов'язкова",
  },
  {
    id: "mice",
    icon: "🐭",
    name: "Миші",
    latinName: "Mus musculus",
    category: "rodent",
    active: "Ніч",
    method:
      "Не нападають на кролів. Поїдають корм, розносять хвороби, гризуть ізоляцію та проводку. Можуть спровокувати стрес у кролів постійним шерехом",
    traces: [
      "Дрібні нори та ходи",
      "Мишачий послід у кормі та по периметру",
      "Прогризені мішки з кормом",
    ],
    clue: "Постійний стрес без видимих причин + сліди дрібного посліду",
    farmRisk: "medium",
    note: "Миші важко виявити, але легко контролювати — щільно закритий корм і ультразвукові відлякувачі",
  },
];

const protectionMethods: ProtectionMethod[] = [
  {
    id: "mesh",
    icon: "🔗",
    title: "Правильна сітка",
    desc: "Основа захисту від куницевих та ласки",
    effectiveAgainst: ["Ласка", "Горностай", "Тхір"],
    cost: "medium",
    details:
      "Комірка не більше 2,5×2,5 см — єдиний захист від ласки. Оцинкована сітка 16 gauge (1,6 мм дріт). Перевірте всі з'єднання — куницеві знаходять найслабше місце. Дах кліток та підлога — так само.",
  },
  {
    id: "foundation",
    icon: "🧱",
    title: "Підземний периметр",
    desc: "Захист від підкопу — лисиця, собаки",
    effectiveAgainst: ["Лисиця", "Собака"],
    cost: "high",
    details:
      "Заглиблення сітки або бетону на 50–60 см навколо вольєра. Або відгин сітки назовні горизонтально на 30 см під землею у формі літери «L». Лисиця копає прямо донизу і не може обійти горизонтальний відгин.",
  },
  {
    id: "electric",
    icon: "⚡",
    title: "Електропастух",
    desc: "Ефективний проти більшості наземних хижаків",
    effectiveAgainst: ["Лисиця", "Собака", "Тхір", "Куниця"],
    cost: "medium",
    details:
      "2–3 дроти на висоті 10, 20 та 30 см від землі. Напруга 5 000–9 000 В, струм безпечний для тварин. Перевіряйте щотижня — рослинність замикає контур. Особливо ефективний при ямовому утриманні та пасовищних вольєрах.",
  },
  {
    id: "roof",
    icon: "🏠",
    title: "Захищений дах",
    desc: "Від куниці та хижих птахів",
    effectiveAgainst: ["Куниця", "Яструб", "Сова"],
    cost: "medium",
    details:
      "Суцільний дах з листового металу або деревини над відкритими вольєрами. Для птахів — сітка зверху (комірка 5×5 см достатньо). Куниця лазить по вертикальних поверхнях — гладкий металевий фартух на стійках.",
  },
  {
    id: "lights",
    icon: "💡",
    title: "Нічне освітлення та датчики руху",
    desc: "Відлякування та сигналізація",
    effectiveAgainst: ["Лисиця", "Тхір", "Куниця", "Собака"],
    cost: "low",
    details:
      "Датчик руху + ліхтар або сирена. Лисиця та куниця уникають освітлених місць. Не ефективно проти ласки та щурів. Додатково — мигаючі вогні або дзеркала відлякують хижих птахів.",
  },
  {
    id: "dogs",
    icon: "🐕‍🦺",
    title: "Охоронний собака",
    desc: "Активне відлякування",
    effectiveAgainst: ["Лисиця", "Собака", "Куниця"],
    cost: "low",
    details:
      "Пастуший або охоронний собака (кавказька вівчарка, пірінейська гірська) вільно гуляє навколо кролятника. Ефективно проти лисиці та бездомних собак. Але запах собаки сам по собі може стресувати кролів — розміщуйте будку подалі.",
  },
  {
    id: "rodent-control",
    icon: "🪤",
    title: "Контроль гризунів",
    desc: "Щури та миші — системна боротьба",
    effectiveAgainst: ["Щур", "Миша"],
    cost: "low",
    details:
      "Пастки Гаваплат або клейові стрічки (без отрути поряд з кролями). Родентициди тільки в спеціальних захищених станціях недоступних для кролів. Щільно закривати корм. Усунути нори — утрамбувати цементом або щебенем.",
  },
  {
    id: "pit-protection",
    icon: "🕳️",
    title: "Захист ямового утримання",
    desc: "Специфіка ям — додаткові ризики",
    effectiveAgainst: ["Лисиця", "Тхір", "Ласка", "Щур"],
    cost: "medium",
    details:
      "Металева сітка 2,5×2,5 см по всьому периметру ями від дна до верху. Кришка з дрібної сітки (хижі птахи). Вхід тільки через знімну кришку з замком. Дренаж не повинен бути ходом для гризунів. Регулярна перевірка нір на периметрі.",
  },
];

const traceGuide: TraceSign[] = [
  {
    what: "Сильний запах мускусу",
    means: "Тхір або куниця",
    predator: "Тхір / Куниця",
  },
  {
    what: "Всі вбиті, більшість не з'їдені",
    means: "Надлишкове вбивство",
    predator: "Ласка / Горностай",
  },
  {
    what: "Укус у потилицю або шию",
    means: "Куницеві (ласка, тхір, куниця)",
    predator: "Ласка / Тхір / Куниця",
  },
  {
    what: "Підкоп під клітку (50+ см)",
    means: "Підземний прохід",
    predator: "Лисиця / Собака",
  },
  {
    what: "Відірвані лапи біля сітки",
    means: "Хапав через прутики",
    predator: "Лисиця",
  },
  {
    what: "Пошкоджена або відігнута сітка зверху",
    means: "Зайшов згори",
    predator: "Куниця / Хижий птах",
  },
  {
    what: "Зникли без тіла та слідів",
    means: "Забрав здобич",
    predator: "Хижий птах / Куниця",
  },
  {
    what: "Тільки крільченята зникли",
    means: "Дрібний хижак",
    predator: "Кіт / Ласка / Пацюк",
  },
  {
    what: "Кал з шерстю в одному місці",
    means: "Маркування території",
    predator: "Тхір / Лисиця / Куниця",
  },
  {
    what: "Перекинуті клітки, великий хаос",
    means: "Великий і сильний",
    predator: "Собака",
  },
  {
    what: "Гризені годівниці, кал у кормі",
    means: "Гризун",
    predator: "Щур / Миша",
  },
  {
    what: "Норки по периметру",
    means: "Підземний мешканець",
    predator: "Щур / Нора лисиці",
  },
  {
    what: "Стрес без контакту, самки кидають посліди",
    means: "Запах хижака поблизу",
    predator: "Кіт / Тхір / Лисиця",
  },
];

const nightProtocolSteps = [
  {
    n: 1,
    title: "Перевірити замки і засуви щовечора",
    text: "Найчастіша причина проникнення — незачинені двері або незафіксований засув. Хижаки навчились відкривати прості клямки.",
  },
  {
    n: 2,
    title: "Перевірити периметр після дощу",
    text: "Дощ змиває запах і розм'якшує землю — ідеальний час для підкопу. Після зливи особливо важлива перевірка.",
  },
  {
    n: 3,
    title: "Забрати залишки їжі на ніч",
    text: "Запах корму приваблює щурів, лисицю і куницю. Закривайте годівниці або забирайте залишки.",
  },
  {
    n: 4,
    title: "Електропастух — перевірити контур",
    text: "Трава і бур'яни замикають контур і знижують напругу. Щотижнева перевірка вольтметром.",
  },
  {
    n: 5,
    title: "Освітлення — перевірити датчики руху",
    text: "Лампи з датчиком руху — ефективне відлякування для лисиці та куниці. Перевіряйте щомісяця.",
  },
  {
    n: 6,
    title: "Ямове утримання — перевірити кришку",
    text: "Кришка ями має бути закрита на замок кожної ночі — навіть якщо ви вважаєте що хижаків немає.",
  },
];

// ─── Component ───────────────────────────────────────────────────
export default function Predators() {
  const [openPredator, setOpenPredator] = useState<string | null>(null);
  const [openMethod, setOpenMethod] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<
    "all" | "mammal" | "bird" | "rodent"
  >("all");

  const filteredPredators =
    categoryFilter === "all"
      ? predators
      : predators.filter((p) => p.category === categoryFilter);

  const riskLabel = (r: string) =>
    r === "extreme"
      ? "Критична загроза"
      : r === "high"
        ? "Висока загроза"
        : "Середня загроза";
  const riskClass = (r: string) =>
    r === "extreme"
      ? "pr-badge--extreme"
      : r === "high"
        ? "pr-badge--high"
        : "pr-badge--medium";
  const costLabel = (c: string) =>
    c === "high"
      ? "Висока вартість"
      : c === "medium"
        ? "Середня вартість"
        : "Низька вартість";

  return (
    <div className="pr-page">
      <header className="pr-header">
        <h1>🦊 Хижаки та шкідники кролів</h1>
        <p>
          Тхір, ласка, лисиця, куниця, щури — хто нападає, як розпізнати сліди
          та як захистити кроляник. Від А до Я для будь-якого типу утримання.
        </p>
      </header>

      <div className="pr-wrap">
        {/* ВИЗНАЧЕННЯ ХТО НАПАВ */}
        <h2 className="pr-section-title">
          Як визначити хто напав — за слідами
        </h2>
        <p className="pr-intro">
          Знайшли жертву або сліди — ця таблиця допоможе визначити хижака до
          початку захисту
        </p>
        <div className="pr-table-wrap">
          <table className="pr-table">
            <thead>
              <tr>
                <th>Що виявили</th>
                <th>Що це означає</th>
                <th>Підозрюваний</th>
              </tr>
            </thead>
            <tbody>
              {traceGuide.map((t, i) => (
                <tr key={i}>
                  <td>
                    <strong>{t.what}</strong>
                  </td>
                  <td>{t.means}</td>
                  <td className="pr-td-predator">{t.predator}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ХИЖАКИ */}
        <h2 className="pr-section-title">Хижаки — повний опис</h2>
        <p className="pr-intro">
          Натисніть на хижака — методи нападу, сліди та захист
        </p>

        <div className="pr-cat-filters">
          {[
            { val: "all" as const, label: "Всі" },
            { val: "mammal" as const, label: "🦦 Ссавці" },
            { val: "bird" as const, label: "🦅 Птахи" },
            { val: "rodent" as const, label: "🐀 Гризуни" },
          ].map(({ val, label }) => (
            <button
              key={val}
              className={`pr-tab ${categoryFilter === val ? "pr-tab--active" : ""}`}
              onClick={() => setCategoryFilter(val)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="pr-predators-list">
          {filteredPredators.map((p) => {
            const isOpen = openPredator === p.id;
            return (
              <article
                key={p.id}
                className={`pr-predator-card ${isOpen ? "pr-predator-card--open" : ""}`}
                onClick={() => setOpenPredator(isOpen ? null : p.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && setOpenPredator(isOpen ? null : p.id)
                }
                aria-expanded={isOpen}
              >
                <div className="pr-predator-header">
                  <span className="pr-predator-icon">{p.icon}</span>
                  <div className="pr-predator-titles">
                    <h3 className="pr-predator-name">{p.name}</h3>
                    <span className="pr-predator-latin">{p.latinName}</span>
                  </div>
                  <span className={`pr-risk-badge ${riskClass(p.farmRisk)}`}>
                    {riskLabel(p.farmRisk)}
                  </span>
                  <span className="pr-chevron">{isOpen ? "▲" : "▼"}</span>
                </div>

                <div className="pr-predator-meta">
                  <span>🕐 {p.active}</span>
                </div>

                {isOpen && (
                  <div className="pr-predator-details">
                    <div className="pr-detail-block">
                      <span className="pr-detail-label">⚔️ Метод нападу</span>
                      <p>{p.method}</p>
                    </div>
                    <div className="pr-detail-block">
                      <span className="pr-detail-label">
                        🔍 Як розпізнати — сліди
                      </span>
                      <ul className="pr-traces-list">
                        {p.traces.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="pr-detail-block pr-detail-block--clue">
                      <span className="pr-detail-label">💡 Ключова ознака</span>
                      <p>{p.clue}</p>
                    </div>
                    <div className="pr-detail-block pr-detail-block--note">
                      <span className="pr-detail-label">
                        🌾 Фермерська нотатка
                      </span>
                      <p>{p.note}</p>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* МЕТОДИ ЗАХИСТУ */}
        <h2 className="pr-section-title">Методи захисту</h2>
        <p className="pr-intro">Натисніть — деталі та від кого захищає</p>
        <div className="pr-protection-grid">
          {protectionMethods.map((m) => {
            const isOpen = openMethod === m.id;
            return (
              <article
                key={m.id}
                className={`pr-method-card ${isOpen ? "pr-method-card--open" : ""}`}
                onClick={() => setOpenMethod(isOpen ? null : m.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && setOpenMethod(isOpen ? null : m.id)
                }
              >
                <div className="pr-method-header">
                  <span className="pr-method-icon">{m.icon}</span>
                  <div>
                    <h3 className="pr-method-title">{m.title}</h3>
                    <p className="pr-method-desc">{m.desc}</p>
                  </div>
                  <span className="pr-chevron">{isOpen ? "▲" : "▼"}</span>
                </div>
                <div className="pr-method-tags">
                  <span className="pr-cost-badge">{costLabel(m.cost)}</span>
                  {m.effectiveAgainst.map((e, i) => (
                    <span key={i} className="pr-against-badge">
                      {e}
                    </span>
                  ))}
                </div>
                {isOpen && (
                  <div className="pr-method-details">
                    <p>{m.details}</p>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* НІЧНИЙ ПРОТОКОЛ */}
        <h2 className="pr-section-title">Нічний протокол безпеки</h2>
        <p className="pr-intro">
          Більшість нападів — вночі. Щоденна рутина що рятує тварин
        </p>
        <div className="pr-steps">
          {nightProtocolSteps.map((s) => (
            <div key={s.n} className="pr-step">
              <div className="pr-step-num">{s.n}</div>
              <div className="pr-step-content">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ПОРІВНЯЛЬНА ТАБЛИЦЯ */}
        <h2 className="pr-section-title">Зведена таблиця: хижак та захист</h2>
        <div className="pr-table-wrap">
          <table className="pr-table">
            <thead>
              <tr>
                <th>Хижак</th>
                <th>Активність</th>
                <th>Головна загроза</th>
                <th>Ключовий захист</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  name: "Ласка",
                  active: "Ніч/день",
                  threat: "Всі розміри кліток",
                  defense: "Сітка ≤2.5×2.5 см",
                },
                {
                  name: "Горностай",
                  active: "День/сутінки",
                  threat: "Молодняк та сітка 3–4 см",
                  defense: "Сітка ≤2.5×2.5 см",
                },
                {
                  name: "Тхір",
                  active: "Ніч",
                  threat: "Прогризає дерево та сітку",
                  defense: "Металева сітка, пастка",
                },
                {
                  name: "Куниця",
                  active: "Ніч",
                  threat: "Заходить згори, все поголів'я",
                  defense: "Захищений дах, електропастух",
                },
                {
                  name: "Лисиця",
                  active: "Ніч/ранок",
                  threat: "Підкоп, хапає через сітку",
                  defense: "Підземний периметр, електропастух",
                },
                {
                  name: "Собака",
                  active: "Будь-який",
                  threat: "Руйнує конструкцію кліток",
                  defense: "Міцна огорожа, охоронний собака",
                },
                {
                  name: "Кіт",
                  active: "Ніч",
                  threat: "Стрес, крільченята",
                  defense: "Суцільний дах вольєра",
                },
                {
                  name: "Яструб/сова",
                  active: "День/ніч",
                  threat: "Відкриті вольєри, молодняк",
                  defense: "Сітка зверху або дах",
                },
                {
                  name: "Щур",
                  active: "Ніч",
                  threat: "Хвороби, корм, крільченята",
                  defense: "Пастки, закритий корм, цемент нор",
                },
                {
                  name: "Миша",
                  active: "Ніч",
                  threat: "Корм, стрес",
                  defense: "Закритий корм, ультразвук",
                },
              ].map((r, i) => (
                <tr key={i}>
                  <td>
                    <strong>{r.name}</strong>
                  </td>
                  <td className="pr-td-sm">{r.active}</td>
                  <td>{r.threat}</td>
                  <td className="pr-td-defense">{r.defense}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* АЛЕРТИ */}
        <h2 className="pr-section-title">Після нападу — що робити</h2>
        <div className="pr-alert danger">
          🚨 Ізолюйте поранених кролів — стрес від запаху хижака може вбити
          навіть неуражених
        </div>
        <div className="pr-alert danger">
          🚨 Визначте точку проникнення та заблокуйте ЩЕ ЦЮ НІЧ — хижак
          повернеться
        </div>
        <div className="pr-alert warn">
          ⚠️ Поранені кролі — ветеринар. Укуси куницевих часто інфікуються
          Pasteurella
        </div>
        <div className="pr-alert warn">
          ⚠️ Знімки слідів та пошкоджень — допоможуть точно визначити хижака
        </div>
        <div className="pr-alert ok">
          ✓ Посилте периметр перш ніж відновлювати поголів'я на тому ж місці
        </div>

        <div className="pr-note">
          <p>
            <strong>Джерела:</strong> RSPCA Wildlife — Predator Identification
            Guide; Stocker L. — Practical Wildlife Care; Harris S. — Urban
            Foxes; Mitchell-Jones A.J. et al. — The Atlas of European Mammals;
            DEFRA — Protecting Rabbits from Predators; особистий досвід
            кролівників та польові спостереження.
          </p>
        </div>
      </div>
    </div>
  );
}
