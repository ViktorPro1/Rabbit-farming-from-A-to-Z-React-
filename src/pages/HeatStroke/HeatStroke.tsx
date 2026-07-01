import { useState } from "react";
import "./HeatStroke.css";
import ShareButton from "../../components/ShareButton/ShareButton";
import { Link } from "react-router-dom";

type SignSeverity = "early" | "moderate" | "critical";

interface HeatSign {
  sign: string;
  severity: SignSeverity;
  explanation: string;
}

interface CoolingMethod {
  id: string;
  icon: string;
  title: string;
  howTo: string;
  when: string;
  caution: string;
  effectiveness: "high" | "medium";
}

interface Mistake {
  mistake: string;
  whyBad: string;
  doInstead: string;
}

interface RiskFactor {
  icon: string;
  factor: string;
  why: string;
}

interface PreventionItem {
  icon: string;
  title: string;
  text: string;
  category: "housing" | "water" | "diet" | "monitoring";
}

const heatSigns: HeatSign[] = [
  {
    sign: "Часте, поверхневе дихання (понад 60/хв)",
    severity: "early",
    explanation:
      "Перша спроба тіла охолодитись. Норма у спокої — 30–60 вдихів/хв. Понад 60 — тривожний сигнал",
  },
  {
    sign: "Розширені, почервонілі вуха",
    severity: "early",
    explanation:
      "Вуха — головний радіатор тепла у кроля. Судини розширюються щоб віддати тепло. Гарячі вуха на дотик — рання ознака",
  },
  {
    sign: "Млявість, небажання рухатись",
    severity: "early",
    explanation:
      "Кролик лежить розтягнувшись, намагається торкатись животом холодної поверхні (підлога, кахель)",
  },
  {
    sign: "Відмова від їжі",
    severity: "early",
    explanation:
      "Перетравлення їжі генерує тепло — організм автоматично знижує апетит у спеку",
  },
  {
    sign: "Слинотеча, мокра морда",
    severity: "moderate",
    explanation:
      "Спроба охолодження через випаровування слини. Зустрічається рідше у кролів ніж у собак, але є тривожним симптомом",
  },
  {
    sign: "Тремтіння або посмикування м'язів",
    severity: "moderate",
    explanation: "Ознака порушення терморегуляції та електролітного балансу",
  },
  {
    sign: "Дезорієнтація, хитка хода",
    severity: "moderate",
    explanation:
      "Початок впливу високої температури на нервову систему. Кролик не реагує адекватно на оточення",
  },
  {
    sign: "Прискорене серцебиття (понад 250–300/хв)",
    severity: "moderate",
    explanation:
      "Серце працює на межі можливостей намагаючись прогнати кров через розширені судини для охолодження",
  },
  {
    sign: "Судоми",
    severity: "critical",
    explanation:
      "Критична стадія. Температура тіла вже завдала шкоди нервовій системі",
  },
  {
    sign: "Втрата свідомості, кома",
    severity: "critical",
    explanation:
      "Загроза життю. Без негайної допомоги — летальний результат у найближчі хвилини-години",
  },
  {
    sign: "Синюшність ясен та язика (ціаноз)",
    severity: "critical",
    explanation: "Критична нестача кисню в крові. Невідкладна ситуація",
  },
  {
    sign: "Кров з носа",
    severity: "critical",
    explanation:
      "ДВЗ-синдром (порушення згортання крові) при критичному перегріві — вкрай небезпечний симптом",
  },
];

const coolingMethods: CoolingMethod[] = [
  {
    id: "ears",
    icon: "👂",
    title: "Охолодження вух вологою тканиною",
    howTo:
      "Змочіть м'яку тканину прохолодною (не крижаною!) водою. Обережно протріть зовнішню поверхню вух, де проходить багато судин.",
    when: "Перші ознаки перегріву — почервонілі гарячі вуха, прискорене дихання",
    caution:
      "Ніколи не використовуйте крижану воду — різкий перепад температури викликає судинний спазм і погіршує тепловіддачу",
    effectiveness: "high",
  },
  {
    id: "fan",
    icon: "💨",
    title: "Вентилятор без прямого потоку",
    howTo:
      "Направте вентилятор в сторону клітки, але не прямо на кролика. Циркуляція повітря допомагає випаровуванню та зниженню температури в приміщенні.",
    when: "Профілактично та при ранніх симптомах",
    caution:
      "Прямий потужний потік повітря може викликати стрес. Уникайте протягів узимку коли вентилятор вимкнено",
    effectiveness: "medium",
  },
  {
    id: "tiles",
    icon: "🧊",
    title: "Холодна керамічна плитка або мармурова дошка",
    howTo:
      "Покладіть охолоджену (не заморожену) плитку в клітку. Кролик сам ляже на неї животом для охолодження.",
    when: "Профілактично та в спекотні дні постійно",
    caution:
      "Плитка не повинна бути льодяною — це може викликати локальне переохолодження тканин",
    effectiveness: "high",
  },
  {
    id: "frozen-bottle",
    icon: "🍶",
    title: "Заморожена пляшка з водою",
    howTo:
      "Заморозьте пляшку з водою, оберніть рушником і покладіть у клітку. Кролик притискається до неї для охолодження.",
    when: "В спекотні дні, особливо для великих порід та вагітних самок",
    caution:
      "Обов'язково обертайте рушником — пряма крижана поверхня може спричинити обмороження шкіри",
    effectiveness: "high",
  },
  {
    id: "water-paws",
    icon: "💧",
    title: "Зволоження лап прохолодною водою",
    howTo:
      "Змочіть лапи тварини прохолодною водою — там теж є судини що допомагають тепловіддачі.",
    when: "При перших ознаках перегріву",
    caution:
      "Не занурюйте кролика повністю у воду — це сильний стрес сам по собі",
    effectiveness: "medium",
  },
  {
    id: "veterinary-cooling",
    icon: "🏥",
    title: "Контрольоване охолодження у ветеринара",
    howTo:
      "Внутрішньовенні рідини кімнатної температури, контрольоване зниження температури тіла з моніторингом, кисневу терапію за потреби.",
    when: "При критичних симптомах — судоми, втрата свідомості, температура понад 41°C",
    caution:
      "Це НЕ замінює домашню першу допомогу — везти до клініки потрібно одразу, продовжуючи охолодження в дорозі",
    effectiveness: "high",
  },
];

const mistakes: Mistake[] = [
  {
    mistake: "Занурення кролика в холодну або крижану воду",
    whyBad:
      "Різкий перепад температури викликає судинний спазм — судини звужуються замість розширення, тепловіддача ПОГІРШУЄТЬСЯ. Додатковий шоковий стрес може бути смертельним сам по собі",
    doInstead:
      "Поступове охолодження: волога тканина кімнатної температури, обережне зволоження вух і лап",
  },
  {
    mistake: "Лід безпосередньо на шкіру",
    whyBad:
      "Викликає локальне обмороження та судинний спазм. Тіло реагує захисним звуженням судин — тепловіддача падає замість зростання",
    doInstead:
      "Заморожену пляшку завжди обертайте рушником або тканиною перед контактом зі шкірою",
  },
  {
    mistake: "Залишити кролика «провітритись» на сонці",
    whyBad:
      "Навіть короткочасне перебування на прямому сонці при високій температурі різко підвищує ризик теплового удару — у кролика немає ефективного потовиділення",
    doInstead:
      "Клітка завжди в тіні, найкраще — в приміщенні з кондиціонером або вентиляцією при температурі вище 27°C",
  },
  {
    mistake: "Чекати «само пройде»",
    whyBad:
      "Тепловий удар прогресує дуже швидко. Затримка навіть на 20–30 хвилин може коштувати життя тварини",
    doInstead:
      "При перших ознаках — негайно почати охолодження і паралельно зв'язатись з ветеринаром",
  },
  {
    mistake: "Давати холодну воду пити великими порціями одразу",
    whyBad:
      "Різке надходження холодної рідини може спричинити спазм шлунково-кишкового тракту та погіршити стан, особливо при ослабленому організмі",
    doInstead:
      "Прохолодна (не крижана) вода невеликими порціями, не примушуючи насильно",
  },
  {
    mistake: "Транспортувати без охолодження в дорозі",
    whyBad:
      "Дорога до клініки в спекотній закритій машині без вентиляції може погіршити стан швидше ніж триватиме поїздка",
    doInstead:
      "Кондиціонер у машині, волога тканина на тварині, переноска у тіні салону, ніколи не в багажнику",
  },
  {
    mistake: "Алкоголь, оцет або інші 'народні' розтирання",
    whyBad:
      "Токсично для кролика при вдиханні випарів або злизуванні. Не має доведеної ефективності та додає хімічний стрес",
    doInstead:
      "Тільки прохолодна вода. Жодних спиртових розчинів, есенцій чи 'бабусиних рецептів'",
  },
];

const riskFactors: RiskFactor[] = [
  {
    icon: "🐰",
    factor: "Великі породи (фландр, велетень)",
    why: "Більша маса тіла означає повільнішу тепловіддачу відносно об'єму — перегріваються швидше дрібних порід",
  },
  {
    icon: "🤰",
    factor: "Вагітні та годуючі самки",
    why: "Підвищений метаболізм та додаткове внутрішнє тепло від плодів/лактації",
  },
  {
    icon: "🧓",
    factor: "Старі кролики (5+ років)",
    why: "Знижена ефективність терморегуляції, частіше супутні хвороби серця",
  },
  {
    icon: "⚖️",
    factor: "Ожиріння (BCS 4-5)",
    why: "Жирова тканина — теплоізолятор, заважає тепловіддачі через шкіру",
  },
  {
    icon: "🧥",
    factor: "Густошерсті породи (ангора, рекс)",
    why: "Густе хутро затримує тепло біля тіла, ускладнює природне охолодження",
  },
  {
    icon: "🏥",
    factor: "Хворі та ослаблені тварини",
    why: "Організм вже працює на межі — додаткове навантаження від спеки критичне",
  },
  {
    icon: "🚗",
    factor: "Транспортування у спеку",
    why: "Замкнутий простір без вентиляції — найчастіша причина теплових ударів",
  },
  {
    icon: "☀️",
    factor: "Прямі сонячні промені на клітку",
    why: "Температура в закритій клітці на сонці може за 15 хвилин перевищити 50°C",
  },
];

const prevention: PreventionItem[] = [
  {
    icon: "🏠",
    title: "Тінь та вентиляція",
    text: "Клітка ніколи не на прямому сонці. Найкраще — приміщення з кондиціонером або хороша природна вентиляція. Критична межа — 27-28°C",
    category: "housing",
  },
  {
    icon: "🌬️",
    title: "Циркуляція повітря",
    text: "Вентилятор (без прямого потоку на тварину) суттєво знижує ризик. Застійне гаряче повітря — головний ворог",
    category: "housing",
  },
  {
    icon: "💧",
    title: "Постійний доступ до прохолодної води",
    text: "Перевіряйте поїлки кілька разів на день влітку. Вода нагрівається швидко — кролик відмовляється пити теплу воду",
    category: "water",
  },
  {
    icon: "🧊",
    title: "Заморожені пляшки в клітці постійно",
    text: "Тримайте про запас 2-3 заморожені пляшки, ротуйте їх протягом дня. Завжди обертайте тканиною",
    category: "water",
  },
  {
    icon: "🪨",
    title: "Холодна плитка або мармурова підставка",
    text: "Доступна цілодобово в спекотний сезон. Кролик сам регулює час контакту з нею",
    category: "housing",
  },
  {
    icon: "🥒",
    title: "Соковиті овочі та фрукти",
    text: "Огірок, кавун (без кісточок), салат — додаткове джерело вологи в раціоні влітку",
    category: "diet",
  },
  {
    icon: "✂️",
    title: "Тримірована шерсть для густошерстих порід",
    text: "Для ангорських та подібних порід — короткий стриж на літо суттєво полегшує тепловіддачу",
    category: "diet",
  },
  {
    icon: "🕐",
    title: "Активність у прохолодні години",
    text: "Випускайте на прогулянку рано вранці або ввечері, уникайте полудня (12:00-16:00) в спекотні дні",
    category: "monitoring",
  },
  {
    icon: "🌡️",
    title: "Термометр у приміщенні",
    text: "Контролюйте температуру постійно. Не покладайтесь на 'відчуття' — об'єктивні цифри рятують життя",
    category: "monitoring",
  },
  {
    icon: "👁",
    title: "Спостереження за поведінкою щодня",
    text: "Знайте нормальну поведінку вашого кролика — це дозволить помітити відхилення на ранній стадії",
    category: "monitoring",
  },
  {
    icon: "🚗",
    title: "Ніколи не залишати в машині",
    text: "Навіть на 5 хвилин, навіть з прочиненим вікном. Температура в машині зростає катастрофічно швидко",
    category: "housing",
  },
  {
    icon: "🧴",
    title: "Зволоження вух у спекотні дні профілактично",
    text: "Навіть без симптомів — кілька разів на день протирайте вуха вологою тканиною в найспекотніші години",
    category: "water",
  },
];

const expertQuotes = [
  {
    author: "Ветеринари-рабітологи (BSAVA)",
    quote:
      "Кролі не мають ефективної системи потовиділення як люди. Вуха — їхній основний 'радіатор'. Тому контроль стану вух — перший і найважливіший індикатор перегріву.",
  },
  {
    author: "Досвід фермерів-кролівників",
    quote:
      "Літня смертність молодняку зростає вдвічі без належного контролю температури в шедах. Найкритичніший період — з 12:00 до 16:00 у липні-серпні.",
  },
  {
    author: "RWAF (Rabbit Welfare Association)",
    quote:
      "Тепловий удар у кролика розвивається швидше ніж у собак чи котів — рахунок часто йде на хвилини, а не години. Профілактика набагато ефективніша за лікування.",
  },
];

// ─── Component ───────────────────────────────────────────────────
export default function HeatStroke() {
  const [signFilter, setSignFilter] = useState<SignSeverity | "all">("all");
  const [openMethod, setOpenMethod] = useState<string | null>(null);
  const [openMistake, setOpenMistake] = useState<number | null>(null);
  const [preventionFilter, setPreventionFilter] = useState<
    PreventionItem["category"] | "all"
  >("all");

  const filteredSigns =
    signFilter === "all"
      ? heatSigns
      : heatSigns.filter((s) => s.severity === signFilter);
  const filteredPrevention =
    preventionFilter === "all"
      ? prevention
      : prevention.filter((p) => p.category === preventionFilter);

  const severityConfig = {
    early: {
      label: "Рання ознака",
      color: "var(--green-dark)",
      bg: "var(--green-light)",
    },
    moderate: {
      label: "Помірна",
      color: "var(--brown)",
      bg: "var(--amber-light)",
    },
    critical: { label: "Критична", color: "#8B0000", bg: "#FFE0DE" },
  };

  return (
    <div className="hs-page">
      <header className="hs-header">
        <h1>☀️ Тепловий удар у кролів</h1>
        <p>
          Все про перегрів: симптоми, перша допомога, типові помилки і
          профілактика. Просто, чітко, з перевірених джерел та досвіду фахівців.
        </p>
      </header>

      <div className="hs-wrap">
        {/* EMERGENCY BANNER */}
        <div className="hs-emergency-banner">
          <span className="hs-emergency-icon">🚨</span>
          <div>
            <strong>
              Судоми, втрата свідомості або синюшність ясен — негайно почати
              охолодження і їхати до ветеринара.
            </strong>{" "}
            Кожна хвилина критична — рахунок іде не на години, а на хвилини.
          </div>
        </div>

        {/* ЧОМУ ЦЕ ТАК НЕБЕЗПЕЧНО */}
        <h2 className="hs-section-title">
          Чому кролі особливо вразливі до спеки
        </h2>
        <div className="hs-note">
          <p>
            На відміну від людей і собак, кролі{" "}
            <strong>не мають потових залоз на тілі</strong> і не вміють
            ефективно охолоджуватись диханням з висолопленим язиком. Їхній
            єдиний природний "радіатор" — це <strong>вуха</strong>, через які
            проходить багато кровоносних судин близько до поверхні шкіри.
          </p>
          <p>
            Комфортна температура для кролика — <strong>15–21°C</strong>. Вже
            при 27–28°C ризик перегріву суттєво зростає, а при 30°C і вище без
            охолодження тепловий удар може розвинутись протягом 30–60 хвилин.
          </p>
          <p>
            Особливість фізіології: кролик може виглядати "нормально" ще за
            кілька хвилин до критичного стану — тому важливо знати ранні ознаки
            і не чекати очевидного погіршення.
          </p>
        </div>

        {/* ФАКТОРИ РИЗИКУ */}
        <h2 className="hs-section-title">Хто у групі ризику</h2>
        <div className="hs-risk-grid">
          {riskFactors.map((r, i) => (
            <div key={i} className="hs-risk-card">
              <span className="hs-risk-icon">{r.icon}</span>
              <div>
                <strong className="hs-risk-factor">{r.factor}</strong>
                <p className="hs-risk-why">{r.why}</p>
              </div>
            </div>
          ))}
        </div>

        {/* СИМПТОМИ */}
        <h2 className="hs-section-title">Симптоми — від ранніх до критичних</h2>
        <p className="hs-intro">
          Фільтруйте за стадією — головне впізнати проблему якомога раніше
        </p>
        <div className="hs-severity-filters">
          {(["all", "early", "moderate", "critical"] as const).map((s) => (
            <button
              key={s}
              className={`hs-sev-btn ${signFilter === s ? "hs-sev-btn--active" : ""}`}
              style={
                signFilter === s && s !== "all"
                  ? {
                      background: severityConfig[s as SignSeverity].color,
                      borderColor: severityConfig[s as SignSeverity].color,
                      color: "#fff",
                    }
                  : {}
              }
              onClick={() => setSignFilter(s)}
            >
              {s === "all"
                ? "Усі стадії"
                : severityConfig[s as SignSeverity].label}
            </button>
          ))}
        </div>
        <div className="hs-signs-list">
          {filteredSigns.map((s, i) => {
            const cfg = severityConfig[s.severity];
            return (
              <div
                key={i}
                className="hs-sign-card"
                style={{ borderLeftColor: cfg.color }}
              >
                <div className="hs-sign-top">
                  <strong className="hs-sign-text">{s.sign}</strong>
                  <span
                    className="hs-sev-badge"
                    style={{ color: cfg.color, background: cfg.bg }}
                  >
                    {cfg.label}
                  </span>
                </div>
                <p className="hs-sign-explanation">{s.explanation}</p>
              </div>
            );
          })}
        </div>

        {/* ПЕРША ДОПОМОГА */}
        <h2 className="hs-section-title">
          Перша допомога — методи охолодження
        </h2>
        <p className="hs-intro">
          Натисніть — детальна інструкція, коли застосовувати та застереження
        </p>
        <div className="hs-methods-list">
          {coolingMethods.map((m) => {
            const isOpen = openMethod === m.id;
            return (
              <article
                key={m.id}
                className={`hs-method-card ${isOpen ? "hs-method-card--open" : ""}`}
                onClick={() => setOpenMethod(isOpen ? null : m.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && setOpenMethod(isOpen ? null : m.id)
                }
              >
                <div className="hs-method-header">
                  <span className="hs-method-icon">{m.icon}</span>
                  <h3 className="hs-method-title">{m.title}</h3>
                  <span
                    className={`hs-eff-badge hs-eff-badge--${m.effectiveness}`}
                  >
                    {m.effectiveness === "high"
                      ? "Висока ефективність"
                      : "Допоміжний метод"}
                  </span>
                  <span className="hs-chevron">{isOpen ? "▲" : "▼"}</span>
                </div>
                {isOpen && (
                  <div className="hs-method-details">
                    <div className="hs-method-block">
                      <span className="hs-method-label">📋 Як зробити</span>
                      <p>{m.howTo}</p>
                    </div>
                    <div className="hs-method-block">
                      <span className="hs-method-label">
                        ⏰ Коли застосовувати
                      </span>
                      <p>{m.when}</p>
                    </div>
                    <div className="hs-method-block hs-method-block--caution">
                      <span className="hs-method-label">⚠️ Застереження</span>
                      <p>{m.caution}</p>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* ЧО НЕ РОБИТИ */}
        <h2 className="hs-section-title">
          ❌ Чого НЕ робити при тепловому ударі
        </h2>
        <p className="hs-intro">
          Поширені помилки що шкодять більше ніж допомагають
        </p>
        <div className="hs-mistakes-list">
          {mistakes.map((m, i) => {
            const isOpen = openMistake === i;
            return (
              <div
                key={i}
                className={`hs-mistake-card ${isOpen ? "hs-mistake-card--open" : ""}`}
                onClick={() => setOpenMistake(isOpen ? null : i)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && setOpenMistake(isOpen ? null : i)
                }
              >
                <div className="hs-mistake-header">
                  <span className="hs-mistake-x">✗</span>
                  <strong className="hs-mistake-name">{m.mistake}</strong>
                  <span className="hs-chevron">{isOpen ? "▲" : "▼"}</span>
                </div>
                {isOpen && (
                  <div className="hs-mistake-details">
                    <div className="hs-mistake-block hs-mistake-block--bad">
                      <span className="hs-mistake-label">
                        ❌ Чому це шкодить
                      </span>
                      <p>{m.whyBad}</p>
                    </div>
                    <div className="hs-mistake-block hs-mistake-block--good">
                      <span className="hs-mistake-label">
                        ✅ Що робити натомість
                      </span>
                      <p>{m.doInstead}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ПРОФІЛАКТИКА */}
        <h2 className="hs-section-title">Профілактика — краще за лікування</h2>
        <p className="hs-intro">
          Прості щоденні дії що рятують від теплового удару
        </p>
        <div className="hs-prevention-filters">
          {[
            { val: "all" as const, label: "Усі поради" },
            { val: "housing" as const, label: "🏠 Утримання" },
            { val: "water" as const, label: "💧 Вода та охолодження" },
            { val: "diet" as const, label: "🥕 Харчування" },
            { val: "monitoring" as const, label: "👁 Спостереження" },
          ].map(({ val, label }) => (
            <button
              key={val}
              className={`hs-tab ${preventionFilter === val ? "hs-tab--active" : ""}`}
              onClick={() => setPreventionFilter(val)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="hs-prevention-grid">
          {filteredPrevention.map((p, i) => (
            <div key={i} className="hs-prevention-card">
              <span className="hs-prevention-icon">{p.icon}</span>
              <strong className="hs-prevention-title">{p.title}</strong>
              <p className="hs-prevention-text">{p.text}</p>
            </div>
          ))}
        </div>

        {/* ПОРАДИ ФАХІВЦІВ */}
        <h2 className="hs-section-title">Що кажуть фахівці</h2>
        <div className="hs-quotes-list">
          {expertQuotes.map((q, i) => (
            <div key={i} className="hs-quote-card">
              <span className="hs-quote-mark">"</span>
              <p className="hs-quote-text">{q.quote}</p>
              <span className="hs-quote-author">— {q.author}</span>
            </div>
          ))}
        </div>

        {/* КОЛИ ВЕТЕРИНАР */}
        <h2 className="hs-section-title">Коли потрібен ветеринар — негайно</h2>
        <div className="hs-alert danger">
          🚨 Судоми або тремтіння всього тіла
        </div>
        <div className="hs-alert danger">
          🚨 Втрата свідомості або відсутність реакції на дотик
        </div>
        <div className="hs-alert danger">
          🚨 Синюшність ясен, язика або вух (ціаноз)
        </div>
        <div className="hs-alert danger">🚨 Кров із носа</div>
        <div className="hs-alert danger">
          🚨 Температура тіла вище 40,5°C (норма 38,5–39,5°C)
        </div>
        <div className="hs-alert warn">
          ⚠️ Дихання залишається прискореним після 15-20 хв охолодження
        </div>
        <div className="hs-alert warn">
          ⚠️ Кролик не відновив апетит протягом кількох годин після інциденту
        </div>
        <div className="hs-alert ok">
          ✓ Ранні симптоми зникли після охолодження, кролик активний і їсть —
          спостерігайте ще кілька годин, тримайте в прохолоді
        </div>

        <div className="hs-note" style={{ marginTop: "1.5rem" }}>
          <p>
            <strong>Дорогою до клініки:</strong> продовжуйте охолодження (волога
            тканина на вухах), кондиціонер у машині, тримайте переноску в тіні
            салону. Зателефонуйте ветеринару заздалегідь — опишіть симптоми, щоб
            клініка підготувалась до прийому.
          </p>
        </div>

        <div className="hs-note">
          <p>
            <strong>Джерела:</strong> BSAVA Manual of Rabbit Medicine (Meredith
            A., Flecknell P.); RWAF — Rabbit Welfare Association & Fund, Heat
            Stroke Guidelines; Harcourt-Brown F. — Textbook of Rabbit Medicine;
            House Rabbit Society — Summer Safety Tips; досвід практикуючих
            ветеринарів-рабітологів та кролівників-фермерів.
          </p>
        </div>
      </div>

      <div className="hs-related">
        <h3 className="hs-related-title">Читайте також</h3>
        <div className="hs-related-grid">
          <Link to="/first-aid" className="hs-related-link">
            🚑 Перша допомога
          </Link>
          <Link to="/microclimate" className="hs-related-link">
            🌡️ Мікроклімат
          </Link>
          <Link to="/seasonal-summer" className="hs-related-link">
            🪰 Літо: міаз
          </Link>
          <Link to="/symptoms" className="hs-related-link">
            🌡️ Симптоматичний пошук
          </Link>
          <Link to="/transport" className="hs-related-link">
            🚗 Транспортування
          </Link>
        </div>
      </div>

      <div className="hs-back">
        <Link to="/" className="hs-back-btn">
          ⬅ На головну
        </Link>
        <ShareButton title="Назва цієї сторінки" />
      </div>
    </div>
  );
}
