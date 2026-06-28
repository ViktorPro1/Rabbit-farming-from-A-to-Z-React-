import { useState } from "react";
import "./Poisoning.css";
import ShareButton from "../../components/ShareButton/ShareButton";
import { Link } from "react-router-dom";

// ─── Types ───────────────────────────────────────────────────────
type PlantCategory = "wildToxic" | "garden" | "decorative" | "safe";
type PoisonType = "plant" | "chemical" | "feed" | "nitrate";

interface ToxicPlant {
  name: string;
  latinName: string;
  toxin: string;
  symptoms: string;
  risk: "high" | "medium" | "extreme";
  note: string;
}

interface PoisonSource {
  id: string;
  icon: string;
  category: PoisonType;
  title: string;
  examples: string;
  mechanism: string;
  symptoms: string;
  firstAid: string;
  risk: "high" | "medium" | "extreme";
}

interface Symptom {
  system: string;
  signs: string[];
  urgency: "watch" | "urgent" | "critical";
}

// ─── Data ────────────────────────────────────────────────────────
const wildToxicPlants: ToxicPlant[] = [
  {
    name: "Чистотіл",
    latinName: "Chelidonium majus",
    toxin: "Алкалоїди (хелідонін, сангвінарин)",
    symptoms: "Слинотеча, судоми, параліч, пригнічення дихання",
    risk: "extreme",
    note: "Один із найчастіших запитів. Навіть невелика кількість смертельно небезпечна",
  },
  {
    name: "Конвалія",
    latinName: "Convallaria majalis",
    toxin: "Серцеві глікозиди (конваллатоксин)",
    symptoms: "Аритмія, блювання, колапс серцево-судинної системи",
    risk: "extreme",
    note: "Всі частини рослини токсичні. Вода з вазою теж отруйна",
  },
  {
    name: "Цикута (вех)",
    latinName: "Cicuta virosa",
    toxin: "Цикутотоксин",
    symptoms: "Судоми, піна з рота, смерть за лічені хвилини",
    risk: "extreme",
    note: "Одна з найсмертоноснішиx рослин України. Росте біля водойм",
  },
  {
    name: "Болиголов плямистий",
    latinName: "Conium maculatum",
    toxin: "Коніїн",
    symptoms: "Висхідний параліч від задніх лап до дихального центру",
    risk: "extreme",
    note: "Схожий на петрушку. Смерть від зупинки дихання",
  },
  {
    name: "Хрестовник (жовтозілля)",
    latinName: "Senecio spp.",
    toxin: "Піролізидинові алкалоїди",
    symptoms: "Повільна печінкова недостатність, жовтяниця, асцит",
    risk: "high",
    note: "Часто у сіні. Кумулятивна отрута — симптоми через тижні",
  },
  {
    name: "Наперстянка",
    latinName: "Digitalis purpurea",
    toxin: "Дигіталіс (серцеві глікозиди)",
    symptoms: "Зупинка серця, важка брадикардія",
    risk: "extreme",
    note: "Декоративна рослина у садах. Смертельна в малих дозах",
  },
  {
    name: "Паслін чорний",
    latinName: "Solanum nigrum",
    toxin: "Соланін",
    symptoms: "Слинотеча, пронос, судоми, пригнічення ЦНС",
    risk: "high",
    note: "Ягоди особливо токсичні для кролів",
  },
  {
    name: "Бузина чорна (зелені частини)",
    latinName: "Sambucus nigra",
    toxin: "Самбунігрин (ціаногенний глікозид)",
    symptoms: "Ціаноз, задуха, колапс",
    risk: "high",
    note: "Зрілі ягоди менш токсичні, але листя та незрілі плоди небезпечні",
  },
  {
    name: "Лютик",
    latinName: "Ranunculus spp.",
    toxin: "Протоанемонін",
    symptoms: "Подразнення слизових, пронос, кров у сечі, спазми",
    risk: "medium",
    note: "При сушінні токсичність знижується — у сіні менш небезпечний",
  },
  {
    name: "Хвощ польовий",
    latinName: "Equisetum arvense",
    toxin: "Тіаміназа (руйнує вітамін B1)",
    symptoms:
      "Координаційні порушення, судоми, виснаження (при хронічному вживанні)",
    risk: "medium",
    note: "Гостре отруєння рідкісне, хронічне — при постійному годуванні",
  },
  {
    name: "Живокіст (коренева частина)",
    latinName: "Symphytum officinale",
    toxin: "Піролізидинові алкалоїди",
    symptoms: "Гепатотоксичність при тривалому вживанні",
    risk: "medium",
    note: "Листя у малих кількостях менш небезпечне. Корінь — не давати!",
  },
  {
    name: "Тис",
    latinName: "Taxus baccata",
    toxin: "Таксин",
    symptoms: "Зупинка серця, раптова смерть без попередніх симптомів",
    risk: "extreme",
    note: "Поширена декоративна рослина. Смерть може наступити за 1–2 год",
  },
];

const gardenToxicPlants: ToxicPlant[] = [
  {
    name: "Картоплиння (бадилля)",
    latinName: "Solanum tuberosum",
    toxin: "Соланін",
    symptoms: "Слинотеча, пронос, тремтіння, пригнічення ЦНС",
    risk: "high",
    note: "Найчастіший запит. Самі бульби в малій кількості безпечні, бадилля — ні",
  },
  {
    name: "Томатне бадилля",
    latinName: "Solanum lycopersicum",
    toxin: "Томатин, соланін",
    symptoms: "Аналогічно до картоплиння: пронос, судоми",
    risk: "high",
    note: "Плоди в малій кількості безпечні, листя і стебла — токсичні",
  },
  {
    name: "Ревінь (листя)",
    latinName: "Rheum rhabarbarum",
    toxin: "Щавлева кислота",
    symptoms: "Гостра ниркова недостатність, гіпокальціємія, судоми",
    risk: "high",
    note: "Черешки у невеликій кількості менш небезпечні, листя — заборонено",
  },
  {
    name: "Цибуля та часник",
    latinName: "Allium spp.",
    toxin: "N-пропілдисульфід",
    symptoms: "Гемолітична анемія, темна сеча, слабкість",
    risk: "high",
    note: "Кролики особливо чутливі до цибулі. Регулярне вживання смертельно небезпечне",
  },
  {
    name: "Авокадо",
    latinName: "Persea americana",
    toxin: "Персин",
    symptoms: "Набряк легень, серцева недостатність, асцит",
    risk: "extreme",
    note: "Всі частини рослини токсичні. Включаючи шкірку та листя",
  },
  {
    name: "Ревінь (стебла у великій кількості)",
    latinName: "Rheum rhabarbarum",
    toxin: "Щавлева кислота",
    symptoms: "При малих дозах — безпечно, при великих — ниркова недостатність",
    risk: "medium",
    note: "Зрідка як ласощі (1–2 см) — прийнятно. Регулярно — небезпечно",
  },
];

const decorativeToxicPlants: ToxicPlant[] = [
  {
    name: "Тюльпан (цибулина)",
    latinName: "Tulipa spp.",
    toxin: "Туліпалін А і В",
    symptoms: "Слинотеча, пронос, нервові розлади",
    risk: "medium",
    note: "Квіти менш токсичні, цибулини — значно небезпечніші",
  },
  {
    name: "Нарцис",
    latinName: "Narcissus spp.",
    toxin: "Ліkorин, галантамін",
    symptoms: "Слинотеча, блювання, спазми, порушення ритму серця",
    risk: "high",
    note: "Вся рослина токсична, особливо цибулина",
  },
  {
    name: "Плющ",
    latinName: "Hedera helix",
    toxin: "Гедерін, сапоніни",
    symptoms: "Подразнення слизових, слинотеча, пронос, задуха",
    risk: "high",
    note: "Декоративна рослина у будинках і садах",
  },
  {
    name: "Діффенбахія",
    latinName: "Dieffenbachia spp.",
    toxin: "Оксалат кальцію",
    symptoms: "Сильне подразнення ротової порожнини, набряк язика і гортані",
    risk: "high",
    note: "Поширена кімнатна рослина. Контакт з рослиною небезпечний",
  },
  {
    name: "Монстера",
    latinName: "Monstera deliciosa",
    toxin: "Оксалат кальцію",
    symptoms: "Подразнення слизових, набряк ротової порожнини",
    risk: "medium",
    note: "Схожий механізм з діффенбахією",
  },
  {
    name: "Азалія / Рододендрон",
    latinName: "Rhododendron spp.",
    toxin: "Граянотоксин",
    symptoms: "Аритмія, гіпотонія, слинотеча, параліч",
    risk: "extreme",
    note: "Навіть кілька листочків можуть бути смертельними",
  },
  {
    name: "Олеандр",
    latinName: "Nerium oleander",
    toxin: "Олеандрин (серцевий глікозид)",
    symptoms: "Зупинка серця, важкі аритмії",
    risk: "extreme",
    note: "Надзвичайно токсична рослина. Смерть від кількох листочків",
  },
];

const poisonSources: PoisonSource[] = [
  {
    id: "nitrates",
    icon: "🌱",
    category: "nitrate",
    title: "Нітратне отруєння",
    examples:
      "Буряк (особливо кормовий), морква, шпинат, молода кукурудза, пшениця вирощена з надлишком добрив, городина з проблемних ділянок",
    mechanism:
      "Нітрати перетворюються на нітрити, які блокують гемоглобін (метгемоглобінемія). Кров втрачає здатність переносити кисень. Особливо небезпечно для кролів — їх мікрофлора активно відновлює нітрати до нітритів",
    symptoms:
      "Синюшність слизових (рот, очі), задуха, слабкість, падіння на бік, коричнево-бура кров при порізі, загибель за 1–2 год",
    firstAid:
      "Негайно прибрати корм. Ветеринар — внутрішньовенний метиленовий синій (антидот). Вдома — лише підтримка дихання та транспорт до клініки",
    risk: "extreme",
  },
  {
    id: "pesticides",
    icon: "🧪",
    category: "chemical",
    title: "Пестициди та гербіциди",
    examples:
      "Залишки на траві після обробки полів, городні рослини оброблені інсектицидами, трава з узбіч доріг",
    mechanism:
      "Залежно від типу: фосфорорганічні — пригнічення холінестерази; піретроїди — нейротоксичність; гербіциди — порушення клітинного метаболізму",
    symptoms:
      "Фосфорорганічні: слинотеча, сльозотеча, звуження зіниць, тремтіння, судоми. Піретроїди: тремтіння, некоординованість, судоми. Гербіциди: пригнічення, пронос",
    firstAid:
      "Видалити тварину від джерела. НЕ давати молоко або олію (поширена помилка — посилює всмоктування). Активоване вугілля якщо не минуло 30 хв. Ветеринар негайно — потрібні специфічні антидоти",
    risk: "extreme",
  },
  {
    id: "feed",
    icon: "🌾",
    category: "feed",
    title: "Отруєння кормом (пліснявий, зіпсований)",
    examples:
      "Заплісніле сіно, зіпсований комбікорм з мікотоксинами, прокисла зелена маса, вологі зернові суміші",
    mechanism:
      "Мікотоксини (афлатоксин, зеараленон, фумонізин) — ураження печінки, нирок, імунної системи. Можливе накопичення та хронічне отруєння",
    symptoms:
      "Відмова від їжі, пригнічення, жовтяниця (жовтий відтінок слизових), пронос, кров у посліді, різке зниження ваги, порушення координації",
    firstAid:
      "Негайна заміна всього корму. Ентеросорбент у воду (активоване вугілля, Смекта). Ветеринар для оцінки ураження печінки та підтримувальної терапії",
    risk: "high",
  },
  {
    id: "chemicals",
    icon: "🔧",
    category: "chemical",
    title: "Побутова хімія та засоби захисту",
    examples:
      "Засоби від гризунів (родентициди), антикоагулянти (варфарин, бромадіолон у приманках), дезінфектанти при неправильному застосуванні, фарби, розчинники",
    mechanism:
      "Антикоагулянти блокують вітамін К → порушення згортання крові → внутрішні кровотечі. Дезінфектанти — хімічний опік слизових та всмоктування токсинів",
    symptoms:
      "Антикоагулянти: внутрішні кровотечі (кров із носа, рота, в сечі/посліді), різка анемія, задуха. Хімічні опіки: слинотеча, набряк рота, відмова від їжі",
    firstAid:
      "Антикоагулянти: вітамін К1 (фітонадіон) внутрішньом'язово — тільки ветеринар. Хімічний опік: промивання рота водою. Ніколи не викликати блювання",
    risk: "extreme",
  },
  {
    id: "heavy-metals",
    icon: "⚠️",
    category: "chemical",
    title: "Важкі метали",
    examples:
      "Свинцева фарба на старих клітках, оцинковка низької якості (надлишок цинку), забруднені ґрунти поблизу промзон",
    mechanism:
      "Свинець — порушення синтезу гему, нейротоксичність; надлишок цинку — антагоніст міді, блокує всмоктування; мідь у надлишку — гепатотоксичність",
    symptoms:
      "Хронічна анемія, схуднення, неврологічні симптоми, слабкість, зниження продуктивності",
    firstAid:
      "Усунути джерело. Ветеринар — хелатна терапія (ЕДТА при свинцевому отруєнні). Замінити обладнання",
    risk: "medium",
  },
];

const symptoms: Symptom[] = [
  {
    system: "Нервова система",
    signs: [
      "Судоми, епілептичні напади",
      "Тремтіння м'язів",
      "Атаксія (некоординований рух)",
      "Параліч задніх або всіх кінцівок",
      "Запрокидування голови назад (опісторхотонус)",
      "Пригнічення, сопор, кома",
    ],
    urgency: "critical",
  },
  {
    system: "Серцево-судинна та дихання",
    signs: [
      "Синюшність слизових рота, носа, ясен",
      "Ціаноз вух (фіолетовий відтінок)",
      "Прискорене або поверхневе дихання",
      "Брадикардія (рідкий пульс)",
      "Колапс, падіння на бік",
    ],
    urgency: "critical",
  },
  {
    system: "Травна система",
    signs: [
      "Рясна слинотеча",
      "Пронос (часто з кров'ю)",
      "Здуття живота",
      "Відмова від їжі та води",
      "Скрипіння зубами від болю в животі",
      "Відсутність посліду",
    ],
    urgency: "urgent",
  },
  {
    system: "Загальні ознаки",
    signs: [
      "Різка млявість, відмова від руху",
      "Неприродна поза (скрючений живіт, шия)",
      "Різке схуднення (при хронічному отруєнні)",
      "Жовтяниця (жовтий відтінок вух та слизових)",
      "Кров у сечі або посліді",
    ],
    urgency: "urgent",
  },
  {
    system: "Місцеві реакції",
    signs: [
      "Набряк губ, язика, гортані (оксалати, їдкі речовини)",
      "Подразнення шкіри навколо рота",
      "Розширені або звужені зіниці",
      "Виділення з носа та очей",
    ],
    urgency: "watch",
  },
];

const firstAidSteps = [
  {
    n: 1,
    icon: "🚫",
    title: "Негайно прибрати джерело отрути",
    text: "Заберіть кроля від рослини / корму / хімії. Якщо отрута на шерсті або шкірі — промийте водою. Зберігайте зразок того, що з'їв кроль — для ветеринара.",
  },
  {
    n: 2,
    icon: "⏱",
    title: "Оцініть стан: є судоми або задуха?",
    text: "Судоми, параліч, синюшність, задуха, колапс — категорія КРИТИЧНО. Не витрачайте час на домашні методи. Єдина дія — негайний транспорт до ветеринара.",
  },
  {
    n: 3,
    icon: "🚗",
    title: "Зателефонуйте до ветеринара ЩЕ У ДОРОЗІ",
    text: "Опишіть що з'їв, коли, скільки та які симптоми. Ветеринар підготується і дасть інструкції. Багато антидотів можна ввести тільки внутрішньовенно.",
  },
  {
    n: 4,
    icon: "🪨",
    title: "Активоване вугілля — тільки якщо не минуло 30 хв і немає судом",
    text: "Доза: 1 г/кг маси тіла, розчинити у воді та ввести шприцом без голки в рот. НЕ давати при судомах, втраті свідомості, отруєнні кислотами/лугами.",
  },
  {
    n: 5,
    icon: "🌡",
    title: "Тепло та спокій під час транспортування",
    text: "Оберніть у рушник або ковдру — при отруєнні часто розвивається гіпотермія. Мінімум стресу і різких рухів. Не тримайте на спині.",
  },
  {
    n: 6,
    icon: "📋",
    title: "Що взяти до ветеринара",
    text: "Зразок рослини або корму (фото достатньо). Упаковка хімії якщо є. Час першого контакту та кількість з'їденого. Останній послід та його вигляд.",
  },
];

const doNotDo = [
  {
    action: "Давати молоко або олію",
    reason:
      "Поширений міф. Жири посилюють всмоктування більшості токсинів, особливо жиророзчинних (пестициди, деякі алкалоїди)",
  },
  {
    action: "Викликати блювоту",
    reason:
      "Кролі фізіологічно не вміють блювати. Спроби — стрес і травма стравоходу",
  },
  {
    action: "Давати воду з сіллю або содою",
    reason:
      "Не є антидотом, може погіршити стан нирок при токсичному навантаженні",
  },
  {
    action: "Чекати «само пройде» при судомах або синюшності",
    reason: "При нейротоксинах і серцевих отрутах рахунок іде на хвилини",
  },
  {
    action: "Давати людські ліки без консультації",
    reason: "Ібупрофен, парацетамол, аспірин — смертельно токсичні для кролів",
  },
  {
    action: "Промивати шлунок зондом вдома",
    reason:
      "Без наркозу і навичок — травма стравоходу та аспіраційна пневмонія",
  },
];

const safePlants = [
  "Петрушка (листя, в міру)",
  "Кріп",
  "Базилік",
  "Кінза (коріандр)",
  "М'ята (невеликі кількості)",
  "Листя яблуні, груші, верби",
  "Гілки берези, вільхи, ліщини",
  "Одуванчик (листя та квіти)",
  "Подорожник великий",
  "Кропива (підв'ялена)",
  "Ромашка (в міру)",
  "Деревій (в міру)",
  "Листя смородини (без пестицидів)",
];

// ─── Component ───────────────────────────────────────────────────
export default function Poisoning() {
  const [openSource, setOpenSource] = useState<string | null>(null);
  const [plantTab, setPlantTab] = useState<PlantCategory>("wildToxic");
  const [openSymptom, setOpenSymptom] = useState<number | null>(null);

  const currentPlants =
    plantTab === "wildToxic"
      ? wildToxicPlants
      : plantTab === "garden"
        ? gardenToxicPlants
        : decorativeToxicPlants;

  const riskLabel = (r: string) =>
    r === "extreme" ? "Смертельно" : r === "high" ? "Небезпечно" : "Обережно";
  const riskClass = (r: string) =>
    r === "extreme"
      ? "pz-badge--extreme"
      : r === "high"
        ? "pz-badge--high"
        : "pz-badge--medium";

  const urgencyLabel = (u: string) =>
    u === "critical"
      ? "Критично"
      : u === "urgent"
        ? "Терміново"
        : "Спостерігати";
  const urgencyClass = (u: string) =>
    u === "critical"
      ? "pz-urg--critical"
      : u === "urgent"
        ? "pz-urg--urgent"
        : "pz-urg--watch";

  return (
    <div className="pz-page">
      <header className="pz-header">
        <h1>☠️ Отруєння кролів</h1>
        <p>
          Що з'їв кролик, що з'їв — від чистотілу до пестицидів. Повний
          довідник: отруйні рослини, хімічні джерела, симптоми та перша
          допомога.
        </p>
      </header>

      <div className="pz-wrap">
        {/* ШВИДКА НАВІГАЦІЯ — якщо критично */}
        <div className="pz-emergency-banner">
          <span className="pz-emergency-icon">🚨</span>
          <div>
            <strong>
              Судоми, синюшність або параліч — негайно до ветеринара.
            </strong>{" "}
            Не витрачайте час на домашні методи. Кожна хвилина критична.
          </div>
        </div>

        {/* ПЕРШA ДОПОМОГА */}
        <h2 className="pz-section-title">Перша допомога при отруєнні</h2>
        <p className="pz-intro">
          Покроковий алгоритм — від моменту підозри до клініки
        </p>
        <div className="pz-steps">
          {firstAidSteps.map((s) => (
            <div key={s.n} className="pz-step">
              <div className="pz-step-num">{s.n}</div>
              <div className="pz-step-content">
                <h3>
                  {s.icon} {s.title}
                </h3>
                <p>{s.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ЧО НЕ РОБИТИ */}
        <h2 className="pz-section-title">❌ Що НЕ робити при отруєнні</h2>
        <p className="pz-intro">
          Народні методи що вбивають — не помилки, а небезпека
        </p>
        <div className="pz-table-wrap">
          <table className="pz-table">
            <thead>
              <tr>
                <th>Небезпечна дія</th>
                <th>Чому не можна</th>
              </tr>
            </thead>
            <tbody>
              {doNotDo.map((d, i) => (
                <tr key={i}>
                  <td className="pz-td-action">
                    <strong>{d.action}</strong>
                  </td>
                  <td>{d.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* СИМПТОМИ */}
        <h2 className="pz-section-title">Симптоми отруєння по системах</h2>
        <p className="pz-intro">
          Натисніть на систему — побачите повний список ознак
        </p>
        <div className="pz-symptoms-list">
          {symptoms.map((s, i) => {
            const isOpen = openSymptom === i;
            return (
              <div
                key={i}
                className={`pz-symptom-card ${isOpen ? "pz-symptom-card--open" : ""}`}
                onClick={() => setOpenSymptom(isOpen ? null : i)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && setOpenSymptom(isOpen ? null : i)
                }
              >
                <div className="pz-symptom-header">
                  <strong className="pz-symptom-system">{s.system}</strong>
                  <span className={`pz-urg-badge ${urgencyClass(s.urgency)}`}>
                    {urgencyLabel(s.urgency)}
                  </span>
                  <span className="pz-chevron">{isOpen ? "▲" : "▼"}</span>
                </div>
                {isOpen && (
                  <ul className="pz-symptom-list">
                    {s.signs.map((sign, j) => (
                      <li key={j}>{sign}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        {/* ДЖЕРЕЛА ОТРУТ */}
        <h2 className="pz-section-title">Джерела отруєння</h2>
        <p className="pz-intro">
          Натисніть — механізм дії та перша допомога для кожного типу
        </p>
        <div className="pz-sources-list">
          {poisonSources.map((src) => {
            const isOpen = openSource === src.id;
            return (
              <article
                key={src.id}
                className={`pz-source-card ${isOpen ? "pz-source-card--open" : ""}`}
                onClick={() => setOpenSource(isOpen ? null : src.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && setOpenSource(isOpen ? null : src.id)
                }
                aria-expanded={isOpen}
              >
                <div className="pz-source-header">
                  <span className="pz-source-icon">{src.icon}</span>
                  <h3 className="pz-source-title">{src.title}</h3>
                  <span className={`pz-risk-badge ${riskClass(src.risk)}`}>
                    {riskLabel(src.risk)}
                  </span>
                  <span className="pz-chevron">{isOpen ? "▲" : "▼"}</span>
                </div>
                <p className="pz-source-examples">
                  <strong>Приклади:</strong> {src.examples}
                </p>
                {isOpen && (
                  <div className="pz-source-details">
                    <div className="pz-detail-block">
                      <span className="pz-detail-label">⚙️ Механізм дії</span>
                      <p>{src.mechanism}</p>
                    </div>
                    <div className="pz-detail-block">
                      <span className="pz-detail-label">🔴 Симптоми</span>
                      <p>{src.symptoms}</p>
                    </div>
                    <div className="pz-detail-block pz-detail-block--aid">
                      <span className="pz-detail-label">🩹 Перша допомога</span>
                      <p>{src.firstAid}</p>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* ОТРУЙНІ РОСЛИНИ */}
        <h2 className="pz-section-title">Отруйні рослини</h2>
        <p className="pz-intro">
          Перемикайте між категоріями — дикорослі, городні, декоративні
        </p>
        <div className="pz-plant-tabs">
          {[
            { val: "wildToxic" as PlantCategory, label: "🌿 Дикорослі" },
            { val: "garden" as PlantCategory, label: "🥕 Городні" },
            { val: "decorative" as PlantCategory, label: "🌸 Декоративні" },
          ].map(({ val, label }) => (
            <button
              key={val}
              className={`pz-tab ${plantTab === val ? "pz-tab--active" : ""}`}
              onClick={() => setPlantTab(val)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="pz-table-wrap">
          <table className="pz-table">
            <thead>
              <tr>
                <th>Рослина</th>
                <th>Токсин</th>
                <th>Симптоми</th>
                <th>Ризик</th>
                <th>Нотатка</th>
              </tr>
            </thead>
            <tbody>
              {currentPlants.map((p, i) => (
                <tr key={i}>
                  <td>
                    <strong>{p.name}</strong>
                    <br />
                    <span className="pz-latin">{p.latinName}</span>
                  </td>
                  <td className="pz-td-sm">{p.toxin}</td>
                  <td className="pz-td-sm">{p.symptoms}</td>
                  <td>
                    <span className={`pz-risk-badge ${riskClass(p.risk)}`}>
                      {riskLabel(p.risk)}
                    </span>
                  </td>
                  <td className="pz-td-note">{p.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* БЕЗПЕЧНІ РОСЛИНИ */}
        <h2 className="pz-section-title">✅ Безпечні рослини — можна давати</h2>
        <div className="pz-safe-grid">
          {safePlants.map((p, i) => (
            <div key={i} className="pz-safe-item">
              ✓ {p}
            </div>
          ))}
        </div>

        {/* КОЛИ ВЕТЕРИНАР */}
        <h2 className="pz-section-title">Коли потрібен ветеринар — негайно</h2>
        <div className="pz-alert danger">
          🚨 Судоми або постійне тремтіння м'язів
        </div>
        <div className="pz-alert danger">
          🚨 Синюшність слизових — рот, ясна, вуха фіолетові
        </div>
        <div className="pz-alert danger">🚨 Параліч кінцівок або шиї</div>
        <div className="pz-alert danger">
          🚨 Кролик не реагує на дотик — сопор або кома
        </div>
        <div className="pz-alert danger">
          🚨 Кров із носа, рота, у сечі або посліді
        </div>
        <div className="pz-alert warn">
          ⚠️ Відмова від їжі понад 4 год після підозри на отруєння
        </div>
        <div className="pz-alert warn">
          ⚠️ Відомо що з'їв токсичну рослину — навіть без симптомів
        </div>
        <div className="pz-alert ok">
          ✓ З'їв безпечну рослину в малій кількості, нормальний послід —
          спостерігайте 6–12 год
        </div>

        <div className="pz-note" style={{ marginTop: "1.5rem" }}>
          <p>
            <strong>Джерела:</strong> BSAVA Manual of Rabbit Medicine (Meredith
            A., Flecknell P.); Harcourt-Brown F. — Textbook of Rabbit Medicine;
            ASPCA Animal Poison Control Center; Plants Poisonous to Livestock
            and Other Animals (Cornell University); Medirabbit.com — E. Müller
            (ветеринар-рабітолог).
          </p>
        </div>
      </div>
      <div className="pz-back">
        <Link to="/" className="pz-back-btn">
          ⬅ На головну
        </Link>
        <ShareButton title="Назва цієї сторінки" />
      </div>
    </div>
  );
}
