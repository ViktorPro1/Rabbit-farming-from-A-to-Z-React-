import { useState } from "react";
import "./RabbitStress.css";

// ─── Types ───────────────────────────────────────────────────────
type Severity = "low" | "medium" | "high" | "critical";
type Phase = "acute" | "chronic";

interface StressCause {
  id: string;
  icon: string;
  category: string;
  title: string;
  description: string;
  severity: Severity;
  farmRelevance: string;
  prevention: string;
}

interface StressSign {
  sign: string;
  phase: Phase[];
  severity: Severity;
  bodySystem: string;
  note: string;
}

interface RecoveryStep {
  step: number;
  title: string;
  action: string;
  timeframe: string;
  icon: string;
}

// ─── Data ────────────────────────────────────────────────────────
const severityConfig: Record<
  Severity,
  { label: string; color: string; bg: string }
> = {
  low: { label: "Низький", color: "#639922", bg: "#EAF3DE" },
  medium: { label: "Середній", color: "#BA7517", bg: "#FAEEDA" },
  high: { label: "Високий", color: "#633806", bg: "#FFE8D0" },
  critical: { label: "Критичний", color: "#C0392B", bg: "#FFE0DE" },
};

const stressCauses: StressCause[] = [
  {
    id: "sound",
    icon: "🔊",
    category: "Середовище",
    title: "Різкі та гучні звуки",
    description:
      "Кролики чують у діапазоні 360–42 000 Гц. Різкий звук понад 65 дБ активує стресову відповідь миттєво. Техніка, собаки, крики, музика.",
    severity: "high",
    farmRelevance:
      "Трактори, зернодробарки, собаки ферми, раптові відвідувачі — все це постійні стресори на господарстві.",
    prevention:
      "Усталений тихий режим роботи. Обладнання — подалі від кролятника. Нові звуки вводити поступово.",
  },
  {
    id: "predator",
    icon: "🦊",
    category: "Хижаки",
    title: "Запах або присутність хижаків",
    description:
      "Запах лисиці, тхора, кота, собаки або навіть їхньої шерсті викликає панічний стрес. Кролик не бачить загрози, але запах запускає гормональну реакцію.",
    severity: "critical",
    farmRelevance:
      "Собаки на фермі можуть спричиняти хронічний стрес навіть без прямого контакту з кролями. Кішки, пацюки — теж.",
    prevention:
      "Суворий контроль доступу тварин до кролятника. Регулярна перевірка на сліди гризунів. Запахові бар'єри при потребі.",
  },
  {
    id: "transport",
    icon: "🚗",
    category: "Переміщення",
    title: "Транспортування та переміщення",
    description:
      "Вібрація, незнайомі запахи, змінне освітлення, відсутність опори — комплексний стресор. Один із найсильніших для кроля.",
    severity: "high",
    farmRelevance:
      "Перевезення між клітками, на виставку, до ветеринара, нові тварини в стаді. Смертність при транспортуванні у слабких особин.",
    prevention:
      "Вентильований контейнер, підстилка із знайомим запахом, уникати спеки та різких рухів. Максимум 2–3 год без перерви.",
  },
  {
    id: "heat",
    icon: "🌡️",
    category: "Мікроклімат",
    title: "Перегрів (понад 28°C)",
    description:
      "Кролики не мають потових залоз і не вміють ефективно охолоджуватись. При 30°C+ стрес переростає в тепловий удар — загрозу для життя.",
    severity: "critical",
    farmRelevance:
      "Влітку найбільший ризик. Особливо небезпечно для вагітних самок, молодняку та великих порід. Падіння народжуваності та смертність.",
    prevention:
      "Затінення, вентилятори, заморожені пляшки з водою в клітку. Температура кролятника не вище 25°C. Моніторинг термометром.",
  },
  {
    id: "overcrowding",
    icon: "📦",
    category: "Умови утримання",
    title: "Перенаселення та мала площа",
    description:
      "Кролики — напівтериторіальні тварини. Обмежений простір провокує соціальні конфлікти, хронічний стрес і пригнічення імунітету.",
    severity: "high",
    farmRelevance:
      "Особливо критично для самців та некастрованих тварин. Перенаселення — головна причина спалахів кокцидіозу та респіраторних інфекцій.",
    prevention:
      "Мінімум 0.5–0.75 м² на голову при груповому утриманні. Контроль ієрархії. Своєчасне розсаджування.",
  },
  {
    id: "new-environment",
    icon: "🏠",
    category: "Зміни",
    title: "Нове середовище та незнайомі запахи",
    description:
      "Потрапляння в незнайоме місце, новий запах підстилки, зміна клітки, новий сусід — всі ці фактори запускають орієнтувальний стрес.",
    severity: "medium",
    farmRelevance:
      "Нові тварини в стаді, переміщення між клітками, ремонт кролятника, зміна підстилки.",
    prevention:
      "Поступова адаптація. Частину старої підстилки залишити. Карантин для нових тварин мінімум 14 днів.",
  },
  {
    id: "rough-handling",
    icon: "✋",
    category: "Людський фактор",
    title: "Груба або неправильна фіксація",
    description:
      "Кролик — здобич. Утримання на спині (транс кроля) — стресова реакція, а не розслаблення. Неправильна фіксація може спричинити перелом хребта.",
    severity: "high",
    farmRelevance:
      "Щоденний догляд, вакцинація, огляд — якщо персонал не навчений, кожен контакт = стрес-подія.",
    prevention:
      "Навчання персоналу правильній фіксації. Мінімізувати час утримання. Ніколи не брати за вуха або хвіст.",
  },
  {
    id: "pain",
    icon: "💊",
    category: "Здоров'я",
    title: "Біль та хвороба",
    description:
      "Будь-який bias — зубний, абдомінальний, при пародонтиті — є потужним стресором. Хворий кролик часто демонструє симптоми стресу до появи явних ознак хвороби.",
    severity: "critical",
    farmRelevance:
      "Стрес від болю погіршує перебіг хвороби. Знеболення при ветеринарних маніпуляціях — не розкіш, а медична необходимость.",
    prevention:
      "Регулярний огляд. Адекватне знеболення при хворобах та операціях. Рання діагностика.",
  },
  {
    id: "social",
    icon: "👥",
    category: "Соціальне",
    title: "Соціальна ізоляція або конфлікт",
    description:
      "Кролики — соціальні тварини. Повна ізоляція або постійні бійки в групі однаково шкідливі. Хронічний соціальний стрес пригнічує імунітет.",
    severity: "medium",
    farmRelevance:
      "Одиночне утримання самок без пари підвищує кортизол. Конфлікти при злучці. Введення нових тварин без адаптації.",
    prevention:
      "Парне або групове утримання сумісних особистостей. Поступове знайомство. Контроль ієрархії.",
  },
  {
    id: "feeding",
    icon: "🥕",
    category: "Харчування",
    title: "Різка зміна раціону або нестача їжі",
    description:
      "ШКТ кроля надзвичайно чутливий до змін. Різка зміна корму = стрес для мікрофлори = ентерит або стаз. Голодування понад 6 годин — критично.",
    severity: "high",
    farmRelevance:
      "Переход на новий комбікорм, затримка годування, раптова відмова від їжі через хворобу — все це ланцюгові стресори.",
    prevention:
      "Зміна раціону за схемою 7–14 днів. Постійний доступ до сіна. Стабільний графік годування.",
  },
];

const stressSigns: StressSign[] = [
  {
    sign: "Тупіт лапами",
    phase: ["acute"],
    severity: "medium",
    bodySystem: "Поведінка",
    note: "Попередження зграї, перша реакція на загрозу",
  },
  {
    sign: "Завмирання (freeze)",
    phase: ["acute"],
    severity: "medium",
    bodySystem: "Поведінка",
    note: "Оцінка ситуації перед рішенням — втекти чи сховатись",
  },
  {
    sign: "Хаотичний біг по клітці",
    phase: ["acute"],
    severity: "high",
    bodySystem: "Поведінка",
    note: "Паніка, спроба втечі",
  },
  {
    sign: "Відмова від їжі",
    phase: ["acute", "chronic"],
    severity: "high",
    bodySystem: "ШКТ",
    note: "Будь-яка відмова від їжі понад 4 год — тривога",
  },
  {
    sign: "Зменшення кількості посліду",
    phase: ["acute", "chronic"],
    severity: "high",
    bodySystem: "ШКТ",
    note: "Перший ознака уповільнення перистальтики",
  },
  {
    sign: "М'який або рідкий послід",
    phase: ["chronic"],
    severity: "medium",
    bodySystem: "ШКТ",
    note: "Порушення мікрофлори від хронічного стресу",
  },
  {
    sign: "Надмірне груминг (себе)",
    phase: ["chronic"],
    severity: "medium",
    bodySystem: "Поведінка",
    note: "Заспокійлива поведінка, самостимуляція",
  },
  {
    sign: "Виривання шерсті (барберинг)",
    phase: ["chronic"],
    severity: "high",
    bodySystem: "Поведінка/Шкіра",
    note: "Сильний хронічний стрес або нудьга",
  },
  {
    sign: "Агресія до людей або кроликів",
    phase: ["acute", "chronic"],
    severity: "high",
    bodySystem: "Поведінка",
    note: "Захисна реакція або перенаправлена агресія",
  },
  {
    sign: "Прискорене дихання (понад 60/хв)",
    phase: ["acute"],
    severity: "critical",
    bodySystem: "Дихання",
    note: "При тепловому ударі або гострій паніці — екстрена ситуація",
  },
  {
    sign: "Широко відкриті очі, нерухомість",
    phase: ["acute"],
    severity: "high",
    bodySystem: "Нервова система",
    note: "Тонічна нерухомість (транс) — не розслаблення!",
  },
  {
    sign: "Зниження ваги без очевидних причин",
    phase: ["chronic"],
    severity: "high",
    bodySystem: "Метаболізм",
    note: "Хронічний кортизол руйнує м'язи та знижує апетит",
  },
  {
    sign: "Часті хвороби, повторні інфекції",
    phase: ["chronic"],
    severity: "critical",
    bodySystem: "Імунітет",
    note: "Кортизол пригнічує імунну відповідь — ворота для патогенів",
  },
  {
    sign: "Псевдовагітність у самок",
    phase: ["chronic"],
    severity: "medium",
    bodySystem: "Репродукція",
    note: "Гормональний дисбаланс від хронічного стресу",
  },
  {
    sign: "Зниження репродуктивності",
    phase: ["chronic"],
    severity: "high",
    bodySystem: "Репродукція",
    note: "Кортизол бллокує статеві гормональні ланцюги",
  },
];

const recoverySteps: RecoveryStep[] = [
  {
    step: 1,
    icon: "🔇",
    title: "Усунути стресор",
    action:
      "Негайно прибрати або ізолювати джерело стресу. Без цього жодне лікування не допоможе.",
    timeframe: "Негайно",
  },
  {
    step: 2,
    icon: "🏠",
    title: "Забезпечити укриття",
    action:
      "Дати кролику місце де можна сховатись: будиночок, тунель, відокремлена зона. Не примушувати до контакту.",
    timeframe: "Перші 30 хвилин",
  },
  {
    step: 3,
    icon: "🌡️",
    title: "Нормалізувати мікроклімат",
    action:
      "Температура 16–22°C, вологість 60–70%, тиша. Свіжа вода обов'язково.",
    timeframe: "Перша година",
  },
  {
    step: 4,
    icon: "🥕",
    title: "Запропонувати улюблену їжу",
    action:
      "Не примушувати, але запропонувати улюблений корм або свіже сіно. Їжа — сигнал безпеки для кроля.",
    timeframe: "2–4 години",
  },
  {
    step: 5,
    icon: "👁",
    title: "Моніторинг посліду",
    action:
      "Нормальний послід = ШКТ працює = стрес відступає. Відсутність посліду 6+ год — ветеринар.",
    timeframe: "6–12 годин",
  },
  {
    step: 6,
    icon: "🤝",
    title: "Поступове відновлення контакту",
    action:
      "Не братися за тварину відразу. Спочатку тихе перебування поруч, дати звикнути до вашого запаху та голосу.",
    timeframe: "24–48 годин",
  },
];

const farmChecklist = [
  {
    category: "Щодня",
    items: [
      "Перевірити рівень шуму в кролятнику",
      "Переконатись у відсутності слідів хижаків",
      "Оцінити кількість і якість посліду",
      "Перевірити споживання їжі та води",
    ],
  },
  {
    category: "Щотижня",
    items: [
      "Огляд поведінки кожного кроля",
      "Перевірка мікроклімату (термометр, гігрометр)",
      "Оцінка соціальних відносин у групах",
      "Огляд клітки на механічні пошкодження",
    ],
  },
  {
    category: "Щомісяця",
    items: [
      "Аналіз репродуктивних показників",
      "Перевірка ваги та кондиції тіла",
      "Оцінка загальної захворюваності стада",
      "Перегляд режиму роботи персоналу",
    ],
  },
];

// ─── Component ───────────────────────────────────────────────────
export default function RabbitStress() {
  const [activeCause, setActiveCause] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<Severity | "all">("all");
  const [filterPhase, setFilterPhase] = useState<Phase | "all">("all");

  const filteredCauses =
    filterSeverity === "all"
      ? stressCauses
      : stressCauses.filter((c) => c.severity === filterSeverity);

  const filteredSigns = stressSigns.filter((s) => {
    const severityOk =
      filterSeverity === "all" || s.severity === filterSeverity;
    const phaseOk =
      filterPhase === "all" || s.phase.includes(filterPhase as Phase);
    return severityOk && phaseOk;
  });

  return (
    <div className="st-page">
      {/* ПОВНОШИРИННИЙ HERO BANNER */}
      <section className="st-hero-section">
        <div className="st-hero-banner">
          <h1 className="st-hero__title">Стрес та переляк у кроликів</h1>
          <p className="st-hero__sub">
            Стрес у кролів — не просто «злякався». Це каскад гормональних
            реакцій, що руйнує здоров'я, знижує продуктивність і відкриває двері
            хворобам. Повний гід: причини, симптоми, ліквідація та профілактика.
          </p>
        </div>
      </section>

      {/* ОСНОВНИЙ КОНТЕНТ ЗАКЛЮЧЕНИЙ В КОНТЕЙНЕР ДЛЯ РІВНЯННЯ */}
      <div className="st-container">
        {/* PHYSIOLOGY BLOCK */}
        <section className="st-section">
          <h2 className="st-section-title">
            Що відбувається з кролем при стресі
          </h2>
          <p className="st-section-sub">
            Фізіологія стресової відповіді — чому це так небезпечно
          </p>
          <div className="st-physio-grid">
            <div className="st-physio-card st-physio-card--trigger">
              <span className="st-physio-icon">⚡</span>
              <h3>Тригер</h3>
              <p>
                Звук, запах, дотик, зміна середовища — будь-який незвичний
                стимул активує мигдалину мозку.
              </p>
            </div>
            <div className="st-physio-card">
              <span className="st-physio-icon">🧪</span>
              <h3>Гормони</h3>
              <p>
                Надниркові залози викидають <strong>адреналін</strong> (гостра
                реакція) та <strong>кортизол</strong> (хронічна).
              </p>
            </div>
            <div className="st-physio-card">
              <span className="st-physio-icon">💓</span>
              <h3>Реакція тіла</h3>
              <p>
                ЧСС зростає до 325/хв, зупиняється перистальтика, звужуються
                судини шкіри, розширюються зіниці.
              </p>
            </div>
            <div className="st-physio-card st-physio-card--danger">
              <span className="st-physio-icon">☠️</span>
              <h3>Наслідки</h3>
              <p>
                ШКТ-стаз, зниження імунітету, безпліддя, падіння ваги, загибель
                при гострому стресі.
              </p>
            </div>
          </div>
        </section>

        {/* CAUSES */}
        <section className="st-section">
          <h2 className="st-section-title">10 основних причин стресу</h2>
          <p className="st-section-sub">
            Натисніть на картку — побачите профілактику та фермерський контекст
          </p>

          <div className="st-severity-filters">
            {(["all", "low", "medium", "high", "critical"] as const).map(
              (s) => (
                <button
                  key={s}
                  className={`st-sev-btn ${filterSeverity === s ? "st-sev-btn--active" : ""}`}
                  style={
                    filterSeverity === s && s !== "all"
                      ? {
                          background: severityConfig[s].color,
                          borderColor: severityConfig[s].color,
                          color: "#fff",
                        }
                      : {}
                  }
                  onClick={() =>
                    setFilterSeverity(s === filterSeverity ? "all" : s)
                  }
                >
                  {s === "all" ? "Всі" : severityConfig[s].label}
                </button>
              ),
            )}
          </div>

          <div className="st-causes-grid">
            {filteredCauses.map((cause) => {
              const cfg = severityConfig[cause.severity];
              const isOpen = activeCause === cause.id;
              return (
                <article
                  key={cause.id}
                  className={`st-cause-card ${isOpen ? "st-cause-card--open" : ""}`}
                  style={
                    {
                      "--cause-color": cfg.color,
                      "--cause-bg": cfg.bg,
                    } as React.CSSProperties
                  }
                  onClick={() => setActiveCause(isOpen ? null : cause.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    setActiveCause(isOpen ? null : cause.id)
                  }
                  aria-expanded={isOpen}
                >
                  <div className="st-cause-card-top">
                    <span className="st-cause-icon">{cause.icon}</span>
                    <div className="st-cause-titles">
                      <span className="st-cause-category">
                        {cause.category}
                      </span>
                      <h3 className="st-cause-title">{cause.title}</h3>
                    </div>
                    <div className="st-cause-right">
                      <span
                        className="st-sev-badge"
                        style={{ color: cfg.color, background: cfg.bg }}
                      >
                        {cfg.label}
                      </span>
                      <span className="st-cause-chevron">
                        {isOpen ? "▲" : "▼"}
                      </span>
                    </div>
                  </div>
                  <p className="st-cause-desc">{cause.description}</p>
                  {isOpen && (
                    <div className="st-cause-details">
                      <div className="st-cause-block st-cause-block--farm">
                        <span className="st-cause-block-label">
                          🌾 Актуальність для ферми
                        </span>
                        <p>{cause.farmRelevance}</p>
                      </div>
                      <div className="st-cause-block st-cause-block--prevent">
                        <span className="st-cause-block-label">
                          🛡️ Профілактика
                        </span>
                        <p>{cause.prevention}</p>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {/* SIGNS TABLE */}
        <section className="st-section">
          <h2 className="st-section-title">
            Ознаки стресу: гострий vs хронічний
          </h2>
          <p className="st-section-sub">
            Фільтруйте за фазою або ступенем серйозності
          </p>

          <div className="st-sign-filters">
            <div className="st-filter-group">
              <span className="st-filter-label">Фаза:</span>
              {(["all", "acute", "chronic"] as const).map((p) => (
                <button
                  key={p}
                  className={`st-filter-btn ${filterPhase === p ? "st-filter-btn--active" : ""}`}
                  onClick={() => setFilterPhase(p)}
                >
                  {p === "all"
                    ? "Обидві"
                    : p === "acute"
                      ? "Гострий"
                      : "Хронічний"}
                </button>
              ))}
            </div>
          </div>

          <div className="st-table-wrap">
            <table className="st-table">
              <thead>
                <tr>
                  <th>Ознака</th>
                  <th>Фаза</th>
                  <th>Система</th>
                  <th>Ступінь</th>
                  <th>Примітка</th>
                </tr>
              </thead>
              <tbody>
                {filteredSigns.map((s, i) => {
                  const cfg = severityConfig[s.severity];
                  return (
                    <tr key={i}>
                      <td>
                        <strong>{s.sign}</strong>
                      </td>
                      <td>
                        {s.phase.map((p) => (
                          <span
                            key={p}
                            className={`st-phase-badge st-phase-badge--${p}`}
                          >
                            {p === "acute" ? "Гострий" : "Хронічний"}
                          </span>
                        ))}
                      </td>
                      <td className="st-td-system">{s.bodySystem}</td>
                      <td>
                        <span
                          className="st-sev-badge"
                          style={{ color: cfg.color, background: cfg.bg }}
                        >
                          {cfg.label}
                        </span>
                      </td>
                      <td className="st-td-note">{s.note}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* RECOVERY */}
        <section className="st-section">
          <h2 className="st-section-title">Протокол виходу зі стресу</h2>
          <p className="st-section-sub">Покрокові дії після стресової події</p>
          <div className="st-recovery-steps">
            {recoverySteps.map((step) => (
              <div key={step.step} className="st-recovery-step">
                <div className="st-recovery-step-num">{step.step}</div>
                <div className="st-recovery-step-content">
                  <div className="st-recovery-step-header">
                    <span className="st-recovery-icon">{step.icon}</span>
                    <h3 className="st-recovery-title">{step.title}</h3>
                    <span className="st-recovery-time">{step.timeframe}</span>
                  </div>
                  <p className="st-recovery-action">{step.action}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FARM CHECKLIST */}
        <section className="st-section">
          <h2 className="st-section-title">
            Чеклист профілактики для господарства
          </h2>
          <p className="st-section-sub">
            Систематичний контроль стресових чинників
          </p>
          <div className="st-checklist-grid">
            {farmChecklist.map((group) => (
              <div key={group.category} className="st-checklist-card">
                <h3 className="st-checklist-card-title">{group.category}</h3>
                <ul className="st-checklist-list">
                  {group.items.map((item, i) => (
                    <li key={i} className="st-checklist-item">
                      <span className="st-checklist-check">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ALERT BOX */}
        <section className="st-section">
          <div className="st-emergency-box">
            <span className="st-emergency-icon">🚨</span>
            <div>
              <h3>Коли потрібна термінова допомога ветеринара</h3>
              <ul>
                <li>Кролик не їсть і немає посліду більше 6 годин</li>
                <li>Прискорене дихання (понад 60 рухів/хв) та ціаноз</li>
                <li>Судоми або повна нерухомість після стресу</li>
                <li>Температура тіла вище 40°C (тепловий удар)</li>
                <li>Кров у посліді або з носа після переляку</li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <footer className="st-footer">
        <div className="st-container">
          <p>
            Джерела: RWAF (Rabbit Welfare Association & Fund), BSAVA Manual of
            Rabbit Medicine, Mykytowycz R. — дослідження стресу у кролів,
            Verberne G. — поведінкова фізіологія.
          </p>
        </div>
      </footer>
    </div>
  );
}
