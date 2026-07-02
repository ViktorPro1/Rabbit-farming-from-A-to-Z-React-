import { useState } from "react";
import "./DisqualifyingFaults.css";
import ShareButton from "../../components/ShareButton/ShareButton";
import { Link } from "react-router-dom";

// ─── Types ───────────────────────────────────────────────────────
type FaultCategory = "genetic" | "structural" | "health" | "color" | "behavior";
type FaultSeverity = "disqualifying" | "serious" | "eliminating";

interface Fault {
  id: string;
  category: FaultCategory;
  name: string;
  description: string;
  cause: string;
  hereditary: boolean;
  breedingBan: boolean;
  exhibitionBan: boolean;
  howToDetect: string;
  affectedBreeds: string;
  severity: FaultSeverity;
}

interface CategoryInfo {
  id: FaultCategory;
  icon: string;
  label: string;
  description: string;
}

// ─── Data ────────────────────────────────────────────────────────
const categories: CategoryInfo[] = [
  {
    id: "genetic",
    icon: "🧬",
    label: "Генетичні вади",
    description:
      "Вади що передаються у спадок і виключають тварину з розведення",
  },
  {
    id: "structural",
    icon: "🦴",
    label: "Структурні вади",
    description: "Порушення будови скелета, хребта та кінцівок",
  },
  {
    id: "health",
    icon: "🩺",
    label: "Стан здоров'я",
    description: "Хвороби та стани що унеможливлюють оцінку або розведення",
  },
  {
    id: "color",
    icon: "🎨",
    label: "Колір та хутро",
    description:
      "Невідповідність кольору, малюнку або текстури стандарту породи",
  },
  {
    id: "behavior",
    icon: "⚡",
    label: "Поведінка та темперамент",
    description: "Агресія, страх та інші поведінкові відхилення під час оцінки",
  },
];

const faults: Fault[] = [
  // ГЕНЕТИЧНІ
  {
    id: "malocclusion",
    category: "genetic",
    name: "Малоклюзія (неправильний прикус)",
    description:
      "Порушення змикання різців: прогнатія (нижня щелепа виступає вперед) або брахігнатія (верхня щелепа коротша за нижню). Нижні різці повинні перекриватись верхніми.",
    cause:
      "Спадкова вада — полігенне успадкування. Прискорюється при інбридингу. Може погіршуватись з віком.",
    hereditary: true,
    breedingBan: true,
    exhibitionBan: true,
    howToDetect:
      "Огляд зубів у спокійному стані. Верхні різці повинні перекривати нижні на 1–2 мм. При малоклюзії нижні різці видно навіть при закритому роті або вони відхилені назовні.",
    affectedBreeds:
      "Всі породи, особливо карлики та декоративні (короткомордий тип)",
    severity: "eliminating",
  },
  {
    id: "cryptorchidism",
    category: "genetic",
    name: "Крипторхізм",
    description:
      "Одне або обидва яєчка не опустились у мошонку. Одностороннє (монорхізм) та двостороннє (криптрохізм) — обидва варіанти є дискваліфікуючими.",
    cause:
      "Генетична вада з можливим гормональним компонентом. Успадковується і передається через носіїв, у тому числі самок.",
    hereditary: true,
    breedingBan: true,
    exhibitionBan: true,
    howToDetect:
      "Пальпація мошонки у самців після 12 тижнів. Обидва яєчка повинні легко промацуватись. При сумніві — повторна перевірка через 2–3 тижні.",
    affectedBreeds: "Всі породи. Частіше у декоративних та карликових",
    severity: "eliminating",
  },
  {
    id: "wry-neck-genetic",
    category: "genetic",
    name: "Вроджений нахил голови (torticollis)",
    description:
      "Постійний нахил голови набік, що не пов'язаний із хворобою (E. cuniculi, отит). Вроджена форма — структурний дефект шийних хребців або вестибулярного апарату.",
    cause:
      "Може бути генетичним або виникати при пошкодженні вестибулярної системи в ембріональний період.",
    hereditary: true,
    breedingBan: true,
    exhibitionBan: true,
    howToDetect:
      "Спостереження за поставою голови у спокої та в русі. Виключити отит та E. cuniculi до встановлення вродженої форми.",
    affectedBreeds: "Всі породи",
    severity: "eliminating",
  },
  {
    id: "splay-leg",
    category: "genetic",
    name: "Розпластані лапи (splay leg)",
    description:
      "Одна або кілька кінцівок відведені в сторону — тварина не може нормально рухатись. Уражаються зазвичай задні лапи.",
    cause:
      "Спадкова вада — аутосомно-рецесивне успадкування. Посилюється при слизьких поверхнях у молодняку.",
    hereditary: true,
    breedingBan: true,
    exhibitionBan: true,
    howToDetect:
      "Видно відразу при огляді ходи. Уражені тварини не можуть правильно спиратись на всі лапи.",
    affectedBreeds: "Всі породи, особливо великі",
    severity: "eliminating",
  },
  {
    id: "extra-toes",
    category: "genetic",
    name: "Зайві або відсутні пальці (полідактилія / олігодактилія)",
    description:
      "Норма: передні лапи — 5 пальців, задні — 4. Будь-яке відхилення є дефектом.",
    cause: "Генетична мутація. Рідко — наслідок травми в ембріональний період.",
    hereditary: true,
    breedingBan: true,
    exhibitionBan: true,
    howToDetect:
      "Підрахунок пальців на всіх чотирьох лапах при первинному огляді молодняку.",
    affectedBreeds: "Всі породи",
    severity: "disqualifying",
  },
  {
    id: "double-dewlap-male",
    category: "genetic",
    name: "Підгрудок у самців",
    description:
      "Виражений підгрудок у самців є недоліком породного типу. У самок великих порід — допустимий і навіть бажаний.",
    cause: "Генетична схильність у поєднанні з ожирінням.",
    hereditary: false,
    breedingBan: false,
    exhibitionBan: false,
    howToDetect: "Огляд шийної ділянки збоку та знизу.",
    affectedBreeds: "Великі м'ясні породи (фландр, сірий велетень)",
    severity: "serious",
  },

  // СТРУКТУРНІ
  {
    id: "saddleback",
    category: "structural",
    name: "Сідлоподібна спина (западина за лопатками)",
    description:
      "Виражений прогин хребта за лопатками при огляді збоку. Протилежний дефект — горб (кіфоз) на рівні грудного відділу.",
    cause:
      "Структурний дефект хребта — може бути спадковим або набутим при неправильному утриманні молодняку.",
    hereditary: true,
    breedingBan: true,
    exhibitionBan: true,
    howToDetect:
      "Огляд збоку при природній поставі на рівній поверхні. Провести рукою вздовж хребта від холки до крижів.",
    affectedBreeds: "Всі породи",
    severity: "eliminating",
  },
  {
    id: "kyphosis",
    category: "structural",
    name: "Кіфоз (горб на спині)",
    description:
      "Виражений підйом хребта у грудному або поперековому відділі. Не слід плутати з нормальним легким підйомом до крижів у деяких порід.",
    cause:
      "Структурна вада хребта. Може бути природженою або набутою (травма, остеопороз).",
    hereditary: true,
    breedingBan: true,
    exhibitionBan: true,
    howToDetect:
      "Огляд і пальпація хребта. Порівняти з стандартом профілю для конкретної породи.",
    affectedBreeds: "Всі породи",
    severity: "eliminating",
  },
  {
    id: "crooked-front-legs",
    category: "structural",
    name: "Викривлені передні лапи",
    description:
      "O-подібна або X-подібна постановка передніх кінцівок при погляді спереду. Нормально — лапи паралельні, перпендикулярні підлозі.",
    cause:
      "Спадкова або набута (рахіт при дефіциті вітаміну D та кальцію у молодняку).",
    hereditary: true,
    breedingBan: true,
    exhibitionBan: true,
    howToDetect:
      "Огляд спереду при природній поставі. Тварина не повинна відчувати стрес.",
    affectedBreeds: "Всі породи, особливо великі",
    severity: "disqualifying",
  },
  {
    id: "bent-tail",
    category: "structural",
    name: "Деформований хвіст (загнутий, скручений, відсутній)",
    description:
      "Хвіст повинен бути прямим і підніматись горизонтально. Бічне відхилення, скручення або відсутність — дефект.",
    cause: "Вроджена аномалія хребців хвоста. Може передаватись у спадок.",
    hereditary: true,
    breedingBan: true,
    exhibitionBan: true,
    howToDetect: "Огляд хвоста збоку та зверху. Легке прощупування хребців.",
    affectedBreeds: "Всі породи",
    severity: "disqualifying",
  },
  {
    id: "asymmetric-ears",
    category: "structural",
    name: "Асиметрія вух у прямовухих порід",
    description:
      "Одне або обидва вуха відхилені в сторону, звисають або різної довжини. У прямовухих порід вуха мають стояти вертикально і симетрично.",
    cause:
      "Спадкова вада або травма хряща в молодому віці. Лопоухість у прямовухих — суворо спадкова.",
    hereditary: true,
    breedingBan: true,
    exhibitionBan: true,
    howToDetect:
      "Огляд спереду та збоку. Вуха мають виходити з однієї точки симетрично.",
    affectedBreeds: "Всі прямовухі породи",
    severity: "eliminating",
  },

  // СТАН ЗДОРОВ'Я
  {
    id: "ear-mites",
    category: "health",
    name: "Вушний кліщ (псороптоз)",
    description:
      "Кірки, запах та ознаки розчухування у вухах. Заразна хвороба — тварина не може бути оцінена або допущена до виставки.",
    cause: "Psoroptes cuniculi — облігатний паразит. Передається при контакті.",
    hereditary: false,
    breedingBan: false,
    exhibitionBan: true,
    howToDetect:
      "Огляд зовнішнього слухового проходу. Характерні кірки жовтувато-коричневого кольору, запах.",
    affectedBreeds: "Всі породи",
    severity: "disqualifying",
  },
  {
    id: "ringworm",
    category: "health",
    name: "Дерматофітоз (лишай)",
    description:
      "Осередкове облисіння з лусочками та кірками. Заразно для людини та інших тварин.",
    cause: "Trichophyton mentagrophytes, Microsporum canis. Грибкова інфекція.",
    hereditary: false,
    breedingBan: false,
    exhibitionBan: true,
    howToDetect:
      "Огляд шкіри — характерні округлі осередки облисіння. Лампа Вуда (флюоресценція). Соскоб для аналізу.",
    affectedBreeds: "Всі породи",
    severity: "disqualifying",
  },
  {
    id: "sore-hocks",
    category: "health",
    name: "Пододерматит (виразки лап)",
    description:
      "Запалення, виразки або некроз шкіри підошов задніх (рідше передніх) лап.",
    cause:
      "Сітчаста підлога без підстилки, ожиріння, малорухомість, генетична схильність до тонкої шерсті на лапах.",
    hereditary: true,
    breedingBan: false,
    exhibitionBan: true,
    howToDetect:
      "Огляд підошов — почервоніння, втрата шерсті, кірки, виразки. Тварина може кульгати або уникати опори.",
    affectedBreeds: "Всі породи. Частіше у великих та Rex (тонка шерсть лап)",
    severity: "disqualifying",
  },
  {
    id: "nasal-discharge",
    category: "health",
    name: "Виділення з носа або очей",
    description:
      "Будь-які патологічні виділення — слизові, гнійні або серозні. Ознака активного інфекційного захворювання.",
    cause: "Пастерельоз, риніт, кон'юнктивіт, зубні проблеми (дакріоцистит).",
    hereditary: false,
    breedingBan: false,
    exhibitionBan: true,
    howToDetect:
      "Огляд носа і очей. Забруднена шерсть на передніх лапах (кролик витирає морду) — додаткова ознака.",
    affectedBreeds: "Всі породи",
    severity: "disqualifying",
  },
  {
    id: "pregnancy-lactation",
    category: "health",
    name: "Вагітність або лактація",
    description:
      "Вагітні та годуючі самки не оцінюються — оцінка некоректна через зміни тіла, плюс стрес шкідливий для крільченят.",
    cause: "Фізіологічний стан.",
    hereditary: false,
    breedingBan: false,
    exhibitionBan: true,
    howToDetect:
      "Огляд живота — набухлі соски, збільшений живіт. Пальпація обережно.",
    affectedBreeds: "Всі породи",
    severity: "disqualifying",
  },
  {
    id: "molt",
    category: "health",
    name: "Активна линька",
    description:
      "Тварина в активній линьці оцінюється зі знижкою або переноситься — хутрові показники некоректні.",
    cause: "Сезонна або стресова линька.",
    hereditary: false,
    breedingBan: false,
    exhibitionBan: false,
    howToDetect:
      "Проведіть рукою проти росту шерсті — помітне випадіння. Наявність «хвилі» линьки на боках.",
    affectedBreeds: "Всі породи",
    severity: "serious",
  },

  // КОЛІР ТА ХУТРО
  {
    id: "wrong-color",
    category: "color",
    name: "Невідповідний колір або небажані плями",
    description:
      "Колір хутра не відповідає стандарту породи або наявні нестандартні плями. У деяких порід (метелик) плями строго регламентовані за формою і розміщенням.",
    cause:
      "Генетичне відхилення від стандарту породи. Може виникати при схрещуванні з іншими породами.",
    hereditary: true,
    breedingBan: false,
    exhibitionBan: true,
    howToDetect:
      "Порівняння з офіційним стандартом породи. Огляд при природному освітленні.",
    affectedBreeds: "Залежить від породи",
    severity: "disqualifying",
  },
  {
    id: "white-spots-colored",
    category: "color",
    name: "Білі плями у суцільнокольорових порід",
    description:
      "Будь-яка біла шерсть у породах із суцільним кольором (чорний, синій, шоколадний тощо) — дискваліфікуючий дефект.",
    cause:
      "Присутність алеля V (Vienna white) у генотипі. Може бути носієм без видимих ознак.",
    hereditary: true,
    breedingBan: true,
    exhibitionBan: true,
    howToDetect:
      "Ретельний огляд усього тіла при хорошому освітленні. Особлива увага — кінчики вух, хвіст, лапи.",
    affectedBreeds:
      "Суцільнокольорові породи (віденський блакитний, рекс, шиншила)",
    severity: "eliminating",
  },
  {
    id: "wrong-eye-color",
    category: "color",
    name: "Невідповідний колір очей",
    description:
      "Колір очей є частиною стандарту породи. Для більшості — відповідає кольору хутра. Альбіноси — виключно рожеві очі.",
    cause: "Генетичне відхилення.",
    hereditary: true,
    breedingBan: false,
    exhibitionBan: true,
    howToDetect:
      "Огляд очей при природному освітленні. Порівняти з стандартом породи.",
    affectedBreeds: "Залежить від породи",
    severity: "disqualifying",
  },
  {
    id: "wrong-fur-rex",
    category: "color",
    name: "Невідповідна текстура хутра у рекс",
    description:
      "У породи Рекс хутро має бути щільним, бархатистим, 12–14 мм, без остьових волосин. Жорстке, хвилясте або з остьовими волосинами — дефект.",
    cause:
      "Генетична вада — нечистота лінії або схрещування з нерекс-породами.",
    hereditary: true,
    breedingBan: true,
    exhibitionBan: true,
    howToDetect:
      "Проведення рукою по хутру — повинно бути оксамитове відчуття. Перевірити наявність довших остьових волосин.",
    affectedBreeds: "Рекс (всі різновиди)",
    severity: "eliminating",
  },

  // ПОВЕДІНКА
  {
    id: "aggression",
    category: "behavior",
    name: "Агресія під час оцінки",
    description:
      "Тварина, що кусає або атакує суддю при стандартному огляді, не може бути оцінена та знімається з виставки.",
    cause:
      "Генетично обумовлений темперамент, недостатня соціалізація, біль або страх.",
    hereditary: true,
    breedingBan: false,
    exhibitionBan: true,
    howToDetect:
      "Проявляється при стандартних маніпуляціях — підйом, огляд рота, вух, кінцівок.",
    affectedBreeds:
      "Всі породи. Частіше у некастрованих самців та самок з гніздом",
    severity: "disqualifying",
  },
  {
    id: "panic",
    category: "behavior",
    name: "Панічний страх та неможливість огляду",
    description:
      "Тварина настільки злякана що огляд є неможливим або небезпечним (травма хребта при різких рухах).",
    cause: "Недостатня соціалізація, генетично обумовлена лякливість.",
    hereditary: true,
    breedingBan: false,
    exhibitionBan: true,
    howToDetect:
      "Тремтіння, спроби втечі, заціпеніння при огляді, небезпечні різкі рухи.",
    affectedBreeds:
      "Всі породи. Частіше у диких-типових порід та недостатньо соціалізованих тварин",
    severity: "disqualifying",
  },
];

// ─── Component ───────────────────────────────────────────────────
export default function DisqualifyingFaults() {
  const [activeCategory, setActiveCategory] = useState<FaultCategory | "all">(
    "all",
  );
  const [openFault, setOpenFault] = useState<string | null>(null);
  const [showOnlyBreedingBan, setShowOnlyBreedingBan] = useState(false);

  const filtered = faults.filter((f) => {
    const catOk = activeCategory === "all" || f.category === activeCategory;
    const breedOk = !showOnlyBreedingBan || f.breedingBan;
    return catOk && breedOk;
  });

  const severityConfig = {
    eliminating: {
      label: "Виключає з розведення",
      color: "#8B0000",
      bg: "#FFE0DE",
    },
    disqualifying: { label: "Дискваліфікує", color: "#633806", bg: "#FAEEDA" },
    serious: { label: "Серйозний недолік", color: "#27500A", bg: "#EAF3DE" },
  };

  return (
    <div className="df-page">
      <header className="df-header">
        <h1>❌ Дискваліфікаційні вади кролів</h1>
        <p>
          Причини вибраковки та недопуску до виставок і розведення. Генетичні,
          структурні, здоров'я, колір — повний реєстр від А до Я.
        </p>
      </header>

      <div className="df-wrap">
        {/* ЩО ТАКЕ ДИСКВАЛІФІКАЦІЯ */}
        <h2 className="df-section-title">Три рівні вад</h2>
        <div className="df-levels-grid">
          <div className="df-level-card df-level-card--eliminating">
            <span className="df-level-icon">🔴</span>
            <h3>Виключає з розведення</h3>
            <p>
              Спадкова вада що передається нащадкам. Тварина не допускається ні
              до виставки, ні до розведення. Навіть якщо вона зовні красива —
              ген присутній і буде в потомстві.
            </p>
          </div>
          <div className="df-level-card df-level-card--disqualifying">
            <span className="df-level-icon">🟠</span>
            <h3>Дискваліфікуючий дефект</h3>
            <p>
              Тварина не допускається до виставки або отримує нульову оцінку.
              Може використовуватись в розведенні якщо дефект не спадковий
              (хвороба, травма).
            </p>
          </div>
          <div className="df-level-card df-level-card--serious">
            <span className="df-level-icon">🟡</span>
            <h3>Серйозний недолік</h3>
            <p>
              Значно знижує оцінку на виставці. Тварина може бути допущена, але
              отримає низький бал. Небажано використовувати в племінній роботі.
            </p>
          </div>
        </div>

        {/* ФІЛЬТРИ */}
        <h2 className="df-section-title">Реєстр вад</h2>
        <div className="df-filters-wrap">
          <div className="df-cat-filters">
            <button
              className={`df-tab ${activeCategory === "all" ? "df-tab--active" : ""}`}
              onClick={() => setActiveCategory("all")}
            >
              Всі категорії
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                className={`df-tab ${activeCategory === c.id ? "df-tab--active" : ""}`}
                onClick={() =>
                  setActiveCategory(activeCategory === c.id ? "all" : c.id)
                }
              >
                {c.icon} {c.label}
              </button>
            ))}
          </div>
          <label className="df-toggle-label">
            <input
              type="checkbox"
              checked={showOnlyBreedingBan}
              onChange={(e) => setShowOnlyBreedingBan(e.target.checked)}
            />
            Тільки ті, що виключають з розведення
          </label>
        </div>

        {/* СПИСОК ВАД */}
        <div className="df-faults-list">
          {filtered.map((fault) => {
            const isOpen = openFault === fault.id;
            const sev = severityConfig[fault.severity];
            const cat = categories.find((c) => c.id === fault.category)!;
            return (
              <article
                key={fault.id}
                className={`df-fault-card ${isOpen ? "df-fault-card--open" : ""}`}
                onClick={() => setOpenFault(isOpen ? null : fault.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && setOpenFault(isOpen ? null : fault.id)
                }
                aria-expanded={isOpen}
              >
                <div className="df-fault-header">
                  <span className="df-cat-icon">{cat.icon}</span>
                  <div className="df-fault-titles">
                    <h3 className="df-fault-name">{fault.name}</h3>
                    <span className="df-cat-label">{cat.label}</span>
                  </div>
                  <div className="df-fault-badges">
                    <span
                      className="df-sev-badge"
                      style={{ color: sev.color, background: sev.bg }}
                    >
                      {sev.label}
                    </span>
                    {fault.hereditary && (
                      <span className="df-tag df-tag--hereditary">
                        Спадкова
                      </span>
                    )}
                    {fault.breedingBan && (
                      <span className="df-tag df-tag--ban">Бан розведення</span>
                    )}
                  </div>
                  <span className="df-chevron">{isOpen ? "▲" : "▼"}</span>
                </div>

                <p className="df-fault-desc">{fault.description}</p>

                {isOpen && (
                  <div className="df-fault-details">
                    <div className="df-detail-row">
                      <span className="df-detail-label">⚙️ Причина</span>
                      <p>{fault.cause}</p>
                    </div>
                    <div className="df-detail-row">
                      <span className="df-detail-label">🔍 Як виявити</span>
                      <p>{fault.howToDetect}</p>
                    </div>
                    <div className="df-detail-row">
                      <span className="df-detail-label">
                        🐇 Порода / поширення
                      </span>
                      <p>{fault.affectedBreeds}</p>
                    </div>
                    <div className="df-flags-row">
                      <span
                        className={`df-flag ${fault.hereditary ? "df-flag--yes" : "df-flag--no"}`}
                      >
                        {fault.hereditary ? "✓ Спадкова вада" : "✗ Не спадкова"}
                      </span>
                      <span
                        className={`df-flag ${fault.breedingBan ? "df-flag--ban" : "df-flag--ok"}`}
                      >
                        {fault.breedingBan
                          ? "✗ Заборона розведення"
                          : "✓ Розведення можливе"}
                      </span>
                      <span
                        className={`df-flag ${fault.exhibitionBan ? "df-flag--ban" : "df-flag--ok"}`}
                      >
                        {fault.exhibitionBan
                          ? "✗ Заборона виставки"
                          : "✓ Виставка дозволена"}
                      </span>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* ЗВЕДЕНА ТАБЛИЦЯ */}
        <h2 className="df-section-title">Швидка довідка — зведена таблиця</h2>
        <div className="df-table-wrap">
          <table className="df-table">
            <thead>
              <tr>
                <th>Вада</th>
                <th>Категорія</th>
                <th>Спадкова</th>
                <th>Заборона розведення</th>
                <th>Заборона виставки</th>
              </tr>
            </thead>
            <tbody>
              {faults.map((f, i) => {
                const sev = severityConfig[f.severity];
                const cat = categories.find((c) => c.id === f.category)!;
                return (
                  <tr key={i}>
                    <td>
                      <strong>{f.name}</strong>
                      <br />
                      <span
                        className="df-sev-badge"
                        style={{
                          color: sev.color,
                          background: sev.bg,
                          fontSize: "10px",
                        }}
                      >
                        {sev.label}
                      </span>
                    </td>
                    <td className="df-td-cat">
                      {cat.icon} {cat.label}
                    </td>
                    <td className="df-td-center">
                      {f.hereditary ? (
                        <span className="df-yes">✓</span>
                      ) : (
                        <span className="df-no">—</span>
                      )}
                    </td>
                    <td className="df-td-center">
                      {f.breedingBan ? (
                        <span className="df-ban">✗ Так</span>
                      ) : (
                        <span className="df-no">—</span>
                      )}
                    </td>
                    <td className="df-td-center">
                      {f.exhibitionBan ? (
                        <span className="df-ban">✗ Так</span>
                      ) : (
                        <span className="df-no">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* АЛЕРТИ */}
        <h2 className="df-section-title">Правила роботи з вадами у стаді</h2>
        <div className="df-alert danger">
          🚨 Тварину з малоклюзією або крипторхізмом — лише на відгодівлю.
          Жодних винятків, навіть при відмінному зовнішньому вигляді
        </div>
        <div className="df-alert danger">
          🚨 Носії алеля V (білі плями у забарвлених порід) — виключаються з
          розведення навіть без видимих плям, якщо тест-схрещування це
          підтвердило
        </div>
        <div className="df-alert warn">
          ⚠️ Пододерматит і вушний кліщ — не є спадковими, але тварина не
          допускається до виставки до повного одужання
        </div>
        <div className="df-alert warn">
          ⚠️ Вада у батьків — обов'язкова перевірка всього потомства, навіть
          якщо зовні здорове
        </div>
        <div className="df-alert ok">
          ✓ Деякі дефекти кольору (невеликі плями) не є спадковими і не
          виключають з розведення — уточнюйте за стандартом конкретної породи
        </div>

        <div className="df-note">
          <p>
            <strong>Джерела:</strong> ARBA Standard of Perfection (2021–2025);
            BRC — British Rabbit Standards and Judges Guidelines; Sandford J.C.
            — The Domestic Rabbit; RWAF — Rabbit Welfare and Breeding
            Guidelines; ZDRK — Bewertungsrichtlinien für Rassekaninchen.
          </p>
        </div>
      </div>

      <div className="df-related">
        <h3 className="df-related-title">Читайте також</h3>
        <div className="df-related-grid">
          <Link to="/breed-standards" className="df-related-link">
            📜 Стандарти порід
          </Link>
          <Link to="/rabbit-conformation" className="df-related-link">
            🐇 Екстер'єр кроля
          </Link>
          <Link to="/culling" className="df-related-link">
            🗑️ Вибраковка
          </Link>
          <Link to="/genetics" className="df-related-link">
            🎨 Генетика забарвлення
          </Link>
          <Link to="/show-judging" className="df-related-link">
            👨‍⚖️ Суддівство на виставках
          </Link>
        </div>
      </div>

      <div className="df-back">
        <Link to="/" className="df-back-btn">
          ⬅ На головну
        </Link>
        <ShareButton title="Назва цієї сторінки" />
      </div>
    </div>
  );
}
