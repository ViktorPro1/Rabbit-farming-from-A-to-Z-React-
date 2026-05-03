import { Link } from "react-router-dom";
import "./Genetics.css";

const introFacts = [
  {
    icon: "🧬",
    title: "Що таке ген простими словами",
    desc: "Ген — це інструкція в ДНК яка каже організму як виглядати. Для забарвлення є спеціальні гени що визначають: чи є пігмент взагалі, який колір, як розподілений по тілу.",
  },
  {
    icon: "📦",
    title: "Що таке локус",
    desc: "Локус — це місце в хромосомі де знаходиться ген. Для забарвлення кроликів є 5 основних локусів: A, B, C, D, E. Кожен відповідає за свій аспект забарвлення.",
  },
  {
    icon: "👫",
    title: "Алелі — варіанти одного гена",
    desc: "Кожен локус має кілька варіантів (алелів). Наприклад, локус B може бути B (чорний) або b (коричневий). Кролик отримує по одному алелю від кожного батька.",
  },
  {
    icon: "👑",
    title: "Домінантний та рецесивний",
    desc: "Домінантний алель (велика літера) — проявляється навіть в одному екземплярі. Рецесивний (мала літера) — проявляється тільки якщо обидва алелі рецесивні (bb, cc, dd).",
  },
  {
    icon: "🎭",
    title: "Генотип та фенотип",
    desc: "Генотип — реальний набір генів кролика. Фенотип — те що ти бачиш. Два кролики однакового кольору (фенотип) можуть мати різні гени (генотип) і давати різне потомство.",
  },
];

const loci = [
  {
    locus: "A",
    name: "Агуті локус",
    fullName: "Agouti locus",
    desc: "Визначає розподіл пігменту по волосині — рівномірний або зональний (смугастий).",
    alleles: [
      {
        symbol: "A",
        name: "Агуті (дикий тип)",
        dominant: true,
        desc: "Волосина має зони різного кольору — темна основа, світла середина, темний кінець. Результат: забарвлення дикого кролика (агуті).",
      },
      {
        symbol: "at",
        name: "Тан (підпал)",
        dominant: false,
        desc: "Темне основне забарвлення з яскравими мітками (підпалами) на черевці, всередині вух, навколо очей. Наприклад: чорний з рудим підпалом.",
      },
      {
        symbol: "a",
        name: "Не-агуті (самоколір)",
        dominant: false,
        desc: "Рівномірний розподіл пігменту по всій волосині від основи до кінця. Результат: суцільний колір без зонування — чорний, шоколадний, блакитний тощо.",
      },
    ],
    dominance: "A > at > a",
    examples: [
      "AA або Aa = агуті",
      "atat або ata = тан",
      "aa = самоколір (чорний, шоколадний і т.д.)",
    ],
  },
  {
    locus: "B",
    name: "Чорний локус",
    fullName: "Black locus",
    desc: "Визначає тип чорного пігменту (еумеланіну) — справжній чорний або коричневий (шоколадний).",
    alleles: [
      {
        symbol: "B",
        name: "Чорний",
        dominant: true,
        desc: "Еумеланін чорного кольору. Всі темні ділянки будуть чорними або темно-сірими.",
      },
      {
        symbol: "b",
        name: "Коричневий (шоколадний)",
        dominant: false,
        desc: "Еумеланін коричневого кольору. Всі темні ділянки будуть коричневими або шоколадними. Очі можуть бути рубіново-червоними.",
      },
    ],
    dominance: "B > b",
    examples: [
      "BB або Bb = чорний пігмент",
      "bb = коричневий/шоколадний пігмент",
    ],
  },
  {
    locus: "C",
    name: "Кольоровий локус",
    fullName: "Color / Chinchilla locus",
    desc: "Найскладніший локус. Контролює інтенсивність та тип пігментації — від повного кольору до повної відсутності.",
    alleles: [
      {
        symbol: "C",
        name: "Повний колір",
        dominant: true,
        desc: "Повна пігментація — жодного розведення кольору. Основний тип.",
      },
      {
        symbol: "cchd",
        name: "Темна шиншила",
        dominant: false,
        desc: "Знижує жовтий/рудий пігмент (феомеланін), залишаючи чорний. Результат: шиншилове забарвлення з сріблясто-білими кінчиками.",
      },
      {
        symbol: "cchl",
        name: "Світла шиншила",
        dominant: false,
        desc: "Сильніше знижує феомеланін. Забарвлення більш кремове або біло-сіре.",
      },
      {
        symbol: "ce",
        name: "Японська/Жовта шиншила",
        dominant: false,
        desc: "Знижує чорний пігмент, підсилює жовтий. Результат: кремові або жовтуваті відтінки.",
      },
      {
        symbol: "c",
        name: "Альбінос",
        dominant: false,
        desc: "Повна відсутність пігменту. Кролик білий з червоними очима. Генотип: cc.",
      },
    ],
    dominance: "C > cchd > cchl > ce > c",
    examples: [
      "CC або Cс = повний колір",
      "cchd cchd = темна шиншила",
      "cc = альбінос (білий, червоні очі)",
    ],
  },
  {
    locus: "D",
    name: "Розведення",
    fullName: "Dilute locus",
    desc: "Контролює концентрацію пігменту в волосині — насичений або розведений (пастельний) колір.",
    alleles: [
      {
        symbol: "D",
        name: "Не-розведений (щільний)",
        dominant: true,
        desc: "Пігмент рівномірно розподілений в волосині — насичений, щільний колір.",
      },
      {
        symbol: "d",
        name: "Розведений (дилют)",
        dominant: false,
        desc: "Пігментні гранули скупчуються нерівномірно — колір стає блідішим, пастельним. Чорний стає блакитним, шоколадний — ліловим.",
      },
    ],
    dominance: "D > d",
    examples: [
      "DD або Dd = щільний колір",
      "dd + aa + BB = блакитний (blue)",
      "dd + aa + bb = ліловий (lilac)",
    ],
  },
  {
    locus: "E",
    name: "Розширення",
    fullName: "Extension locus",
    desc: "Визначає чи поширюється чорний пігмент по всьому тілу або замінюється жовтим/рудим.",
    alleles: [
      {
        symbol: "Es",
        name: "Стальовий (стіл)",
        dominant: true,
        desc: "Домінантний чорний — посилює темне забарвлення. Надає сталевий відтінок.",
      },
      {
        symbol: "E",
        name: "Нормальне розширення",
        dominant: true,
        desc: "Стандартний розподіл пігменту.",
      },
      {
        symbol: "ej",
        name: "Японське двоколірне",
        dominant: false,
        desc: "Створює мозаїчний розподіл чорного та жовтого пігменту. Основа для японської та харлекін порід.",
      },
      {
        symbol: "e",
        name: "Не-розширення (жовтий)",
        dominant: false,
        desc: "Блокує чорний пігмент по всьому тілу. Результат: рудий, жовтий або кремовий кролик. Генотип: ee.",
      },
    ],
    dominance: "Es > E > ej > e",
    examples: [
      "ee = руді/жовті кролики (Рекс рудий, Нормандець)",
      "Eej = японський малюнок",
      "EE або Ee = стандартне забарвлення",
    ],
  },
  {
    locus: "En",
    name: "Плямистість",
    fullName: "English spotting locus",
    desc: "Відповідає за плямистий малюнок — характерний для порід Метелик та Англійський кролик.",
    alleles: [
      {
        symbol: "En",
        name: "Плямистий (En)",
        dominant: true,
        desc: "Викликає білі плями на забарвленому тлі. Гетерозиготи (Enen) мають класичний плямистий малюнок.",
      },
      {
        symbol: "en",
        name: "Суцільний",
        dominant: false,
        desc: "Без плям — рівномірне забарвлення.",
      },
    ],
    dominance: "En > en",
    examples: [
      "Enen = класична плямистість (Метелик)",
      "EnEn = сильно плямистий або повністю білий з мало кольору",
      "enen = без плям",
    ],
  },
  {
    locus: "V",
    name: "Віденнський білий",
    fullName: "Vienna locus",
    desc: "Унікальний локус для Голландської та Віденської породи. Визначає наявність білих ділянок та блакитних очей.",
    alleles: [
      {
        symbol: "V",
        name: "Без ефекту",
        dominant: true,
        desc: "Нормальне забарвлення.",
      },
      {
        symbol: "v",
        name: "Віденський",
        dominant: false,
        desc: "Відповідає за білі ділянки та можливі блакитні очі. Гомозиготи (vv) можуть мати повністю біле забарвлення та блакитні очі.",
      },
    ],
    dominance: "V > v",
    examples: [
      "vv = можливо повністю білий з блакитними очима",
      "Vv = носій віденського білого без зовнішніх ознак",
    ],
  },
];

const colorFormulas = [
  {
    color: "Чорний (Black)",
    formula: "aa BB CC DD EE",
    desc: "Самоколір, чорний пігмент, повна пігментація, щільна, нормальне розширення",
  },
  {
    color: "Блакитний (Blue)",
    formula: "aa BB CC dd EE",
    desc: "Чорний розведений дилютом — виходить блакитно-сірий",
  },
  {
    color: "Шоколадний (Chocolate)",
    formula: "aa bb CC DD EE",
    desc: "Самоколір, коричневий пігмент",
  },
  {
    color: "Ліловий (Lilac)",
    formula: "aa bb CC dd EE",
    desc: "Шоколадний + дилют = ніжний голубувато-коричневий",
  },
  {
    color: "Рудий/Жовтий (Red/Yellow)",
    formula: "aa BB CC DD ee",
    desc: "Блокування чорного пігменту — залишається тільки жовтий/рудий",
  },
  {
    color: "Агуті (Wild/Agouti)",
    formula: "AA BB CC DD EE",
    desc: "Дикий тип — смугаста волосина, забарвлення кролика в природі",
  },
  {
    color: "Шиншила",
    formula: "AA BB cchd cchd DD EE",
    desc: "Агуті + шиншила локус — срібляста з темними кінчиками",
  },
  {
    color: "Альбінос (Albino)",
    formula: "aa BB cc DD EE",
    desc: "Локус C в стані cc блокує весь пігмент — білий з червоними очима",
  },
  {
    color: "Чорний підпал (Black Tan)",
    formula: "at at BB CC DD EE",
    desc: "Тан локус — чорний з рудими мітками на животі та обличчі",
  },
  {
    color: "Блакитний підпал (Blue Tan)",
    formula: "at at BB CC dd EE",
    desc: "Тан + дилют = блакитний з кремовими мітками",
  },
  {
    color: "Японський (Harlequin)",
    formula: "aa BB CC DD Eej e",
    desc: "Японський локус E — мозаїка чорного та жовтого",
  },
  {
    color: "Оттер (Otter)",
    formula: "at at BB CC DD EE",
    desc: "Подібний до тан але з іншим розподілом міток — порода Рекс оттер",
  },
];

const crossExamples = [
  {
    title: "Чорний × Блакитний → потомство",
    parent1: "Чорний: aa BB CC DD EE",
    parent2: "Блакитний: aa BB CC dd EE",
    cross: "DD × dd → всі Dd (щільні)",
    result: "100% чорні за виглядом, але всі носії блакитного (Dd)",
    note: "При схрещуванні двох Dd між собою: 25% dd = блакитні",
    type: "example",
  },
  {
    title: "Два носії альбінізму → потомство",
    parent1: "Чорний носій: aa BB Cc DD EE",
    parent2: "Чорний носій: aa BB Cc DD EE",
    cross: "Cc × Cc → CC (25%), Cc (50%), cc (25%)",
    result: "25% альбіноси, 75% пігментовані (з них половина носії)",
    note: "Несподівані альбіноси від двох кольорових батьків — результат носійства рецесивного c",
    type: "warning",
  },
  {
    title: "Агуті × Самоколір → потомство",
    parent1: "Агуті: AA BB CC DD EE",
    parent2: "Чорний: aa BB CC DD EE",
    cross: "AA × aa → всі Aa",
    result: "100% агуті за виглядом (Aa), але всі носії самокольору",
    note: "A домінує над a — всі виглядають як агуті але несуть ген чорного",
    type: "example",
  },
  {
    title: "Рудий × Чорний → потомство",
    parent1: "Рудий: aa BB CC DD ee",
    parent2: "Чорний: aa BB CC DD EE",
    cross: "EE × ee → всі Ee",
    result: "100% чорні за виглядом, але всі носії рудого (Ee)",
    note: "Ee × Ee: 25% ee = руді, 75% виглядають темно",
    type: "example",
  },
];

const breedColors = [
  {
    breed: "Новозеландський білий",
    colors: "Тільки білий (альбінос: cc)",
    genes: "aa BB cc DD EE",
  },
  {
    breed: "Каліфорнійський",
    colors: "Білий з темними мітками (гімалайський малюнок)",
    genes: "aa BB ch ch DD EE — акроміланізм від температури",
  },
  {
    breed: "Фландр",
    colors: "Чорний, блакитний, рудий, сірий, білий, санді, сталевий",
    genes: "Різні комбінації всіх локусів",
  },
  {
    breed: "Рекс",
    colors: "Понад 16 офіційних кольорів",
    genes: "Ген rex (r) відповідає за коротку оксамитову шерсть, не за колір",
  },
  {
    breed: "Метелик (Butterfly)",
    colors: "Білий з чорними або кольоровими плямами",
    genes: "Enen — гетерозигота за плямистістю",
  },
  {
    breed: "Шиншила",
    colors: "Шиншилове (срібляста спина, білий черевик)",
    genes: "AA BB cchd cchd DD EE",
  },
  {
    breed: "Чорно-вогняний (Black Otter)",
    colors: "Чорний з рудими мітками",
    genes: "at at BB CC DD EE",
  },
  {
    breed: "Голландський (Dutch)",
    colors: "Двоколірний — білий + кольоровий",
    genes: "Ген du (Dutch) відповідає за двоколірний малюнок",
  },
  {
    breed: "Англійський спотний",
    colors: "Білий з темними плямами та смугами",
    genes: "Enen — класична плямистість",
  },
  {
    breed: "Японський (Harlequin)",
    colors: "Мозаїка чорного та жовтого/оранжевого",
    genes: "aa BB CC DD Eej",
  },
];

const commonMistakes = [
  {
    mistake: "Думати що два білих кролики завжди дадуть білих",
    truth:
      "Якщо один або обидва є носіями кольору (наприклад Vv або Cc), в посліді можуть бути кольорові кролики",
  },
  {
    mistake: "Плутати альбіноса з Віденським білим",
    truth:
      "Альбінос: білий з ЧЕРВОНИМИ очима (cc). Віденський білий: білий з БЛАКИТНИМИ очима (vv). Різні локуси, різні гени.",
  },
  {
    mistake: "Вважати що носій кольору виглядає інакше",
    truth:
      "Носій рецесивного гена виглядає абсолютно нормально. Чорний кролик Bb виглядає так само як BB — перевірити можна тільки через потомство.",
  },
  {
    mistake: "Думати що шиншила — це порода",
    truth:
      "Шиншила — це тип забарвлення (локус C) який зустрічається в різних породах. Є шиншилові Рекси, Нормандці, Ангори тощо.",
  },
  {
    mistake: "Ігнорувати ефект температури на забарвлення",
    truth:
      "Каліфорнійський та гімалайський малюнок залежить від температури — акроміланізм. Темні ділянки розвиваються там де шкіра холодніша.",
  },
];

const Genetics = () => {
  return (
    <main className="genetics-page">
      <div className="genetics-header">
        <h1>🧬 Генетика забарвлення кроликів</h1>
        <p>
          Локуси, алелі, домінування — від базового до практичного застосування
        </p>
      </div>

      <div className="genetics-wrap">
        {/* ВСТУП */}
        <div className="genetics-intro">
          <h2>Навіщо кролівнику знати генетику забарвлення</h2>
          <p>
            Ти коли-небудь отримував несподіваний колір крільченят від двох
            однакових батьків? Або хотів отримати конкретне забарвлення але не
            знав яких кроликів парувати? Генетика забарвлення відповідає на ці
            питання.
          </p>
          <p>
            Це не складна наука — це система з 5–7 локусів (генетичних місць)
            кожен з яких має кілька варіантів. Знаючи генотип батьків — можна
            передбачити кольори потомства.
          </p>
          <div className="genetics-alert ok">
            ✅ Навіть базові знання про локуси A, B, C, D, E дозволять тобі
            прогнозувати 90% варіантів забарвлення у твоїх кроликів.
          </div>
        </div>

        {/* ОСНОВНІ ПОНЯТТЯ */}
        <div className="genetics-section-title">
          📚 Основні поняття простими словами
        </div>
        <div className="genetics-concepts-grid">
          {introFacts.map((f) => (
            <article key={f.title} className="genetics-concept-card">
              <span className="genetics-concept-icon">{f.icon}</span>
              <div>
                <strong className="genetics-concept-title">{f.title}</strong>
                <p>{f.desc}</p>
              </div>
            </article>
          ))}
        </div>

        {/* ЛОКУСИ */}
        <div className="genetics-section-title">
          🔬 Основні локуси забарвлення
        </div>
        {loci.map((loc) => (
          <div key={loc.locus} className="genetics-locus-card">
            <div className="genetics-locus-header">
              <div className="genetics-locus-symbol">{loc.locus}</div>
              <div>
                <h2>{loc.name}</h2>
                <span className="genetics-locus-full">{loc.fullName}</span>
              </div>
            </div>
            <p className="genetics-locus-desc">{loc.desc}</p>

            <div className="genetics-dominance">
              <span className="genetics-dominance-label">Домінування:</span>
              <span className="genetics-dominance-value">{loc.dominance}</span>
            </div>

            <div className="genetics-alleles">
              {loc.alleles.map((a) => (
                <div
                  key={a.symbol}
                  className={`genetics-allele ${a.dominant ? "dominant" : "recessive"}`}
                >
                  <div className="genetics-allele-header">
                    <span className="genetics-allele-symbol">{a.symbol}</span>
                    <span className="genetics-allele-name">{a.name}</span>
                    <span
                      className={`genetics-allele-badge ${a.dominant ? "dominant" : "recessive"}`}
                    >
                      {a.dominant ? "Домінантний" : "Рецесивний"}
                    </span>
                  </div>
                  <p>{a.desc}</p>
                </div>
              ))}
            </div>

            <div className="genetics-examples">
              <div className="genetics-examples-title">
                📌 Приклади генотипів:
              </div>
              {loc.examples.map((e) => (
                <span key={e} className="genetics-example-tag">
                  {e}
                </span>
              ))}
            </div>
          </div>
        ))}

        {/* ФОРМУЛИ КОЛЬОРІВ */}
        <div className="genetics-section-title">
          🎨 Формули основних кольорів
        </div>
        <div className="genetics-table-wrap">
          <table className="genetics-table">
            <thead>
              <tr>
                <th>Колір</th>
                <th>Генотип</th>
                <th>Пояснення</th>
              </tr>
            </thead>
            <tbody>
              {colorFormulas.map((row) => (
                <tr key={row.color}>
                  <td>
                    <strong>{row.color}</strong>
                  </td>
                  <td>
                    <code className="genetics-code">{row.formula}</code>
                  </td>
                  <td>{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ПРИКЛАДИ СХРЕЩУВАНЬ */}
        <div className="genetics-section-title">
          🔄 Приклади схрещувань та їх результати
        </div>
        <div className="genetics-crosses">
          {crossExamples.map((cross) => (
            <div
              key={cross.title}
              className={`genetics-cross-card ${cross.type}`}
            >
              <h3 className="genetics-cross-title">{cross.title}</h3>
              <div className="genetics-cross-parents">
                <div className="genetics-cross-parent">
                  <span className="genetics-parent-label">♀ Батько 1:</span>
                  <code>{cross.parent1}</code>
                </div>
                <span className="genetics-cross-x">×</span>
                <div className="genetics-cross-parent">
                  <span className="genetics-parent-label">♂ Батько 2:</span>
                  <code>{cross.parent2}</code>
                </div>
              </div>
              <div className="genetics-cross-result">
                <div className="genetics-cross-formula">
                  <strong>Схрещування:</strong> {cross.cross}
                </div>
                <div className="genetics-cross-outcome">
                  <strong>Результат:</strong> {cross.result}
                </div>
              </div>
              <div className={`genetics-cross-note ${cross.type}`}>
                💡 {cross.note}
              </div>
            </div>
          ))}
        </div>

        {/* КОЛЬОРИ ПОРІД */}
        <div className="genetics-section-title">
          🐇 Забарвлення основних порід
        </div>
        <div className="genetics-table-wrap">
          <table className="genetics-table">
            <thead>
              <tr>
                <th>Порода</th>
                <th>Офіційні кольори</th>
                <th>Генетична основа</th>
              </tr>
            </thead>
            <tbody>
              {breedColors.map((row) => (
                <tr key={row.breed}>
                  <td>
                    <strong>{row.breed}</strong>
                  </td>
                  <td>{row.colors}</td>
                  <td>
                    <code className="genetics-code">{row.genes}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ТИПОВІ ПОМИЛКИ */}
        <div className="genetics-section-title">
          🚫 Типові помилки та хибні уявлення
        </div>
        <div className="genetics-mistakes">
          {commonMistakes.map((m) => (
            <div key={m.mistake} className="genetics-mistake-card">
              <div className="genetics-mistake-wrong">
                <span className="genetics-mistake-icon">❌</span>
                <p>
                  <strong>Помилка:</strong> {m.mistake}
                </p>
              </div>
              <div className="genetics-mistake-right">
                <span className="genetics-mistake-icon">✅</span>
                <p>
                  <strong>Насправді:</strong> {m.truth}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ПРАКТИЧНЕ ЗАСТОСУВАННЯ */}
        <div className="genetics-section-title">
          💡 Практичне застосування для господаря
        </div>
        <div className="genetics-practical">
          <div className="genetics-practical-card">
            <h3>🎯 Як отримати конкретний колір</h3>
            <ol>
              <li>
                Визначте цільовий колір та його генотип (наприклад блакитний =
                aa BB CC dd EE)
              </li>
              <li>Перевірте генотип батьків — чи несуть вони потрібні алелі</li>
              <li>
                Розрахуйте імовірність: якщо обидва батьки Dd — 25% потомства
                будуть dd (блакитні)
              </li>
              <li>
                Ведіть записи про кольори потомства — це допомагає уточнити
                генотип батьків
              </li>
            </ol>
          </div>
          <div className="genetics-practical-card">
            <h3>🔍 Як визначити генотип кролика</h3>
            <ol>
              <li>Феномен — спостерігай колір та малюнок</li>
              <li>
                Аналіз батьків — якщо знаєш кольори батьків, можеш вивести
                ймовірний генотип
              </li>
              <li>
                Тест-схрещування — парування з кроликом відомого генотипу та
                аналіз потомства
              </li>
              <li>
                ДНК-тест — лабораторний аналіз (доступний але дорогий для
                племінної роботи)
              </li>
            </ol>
          </div>
          <div className="genetics-practical-card">
            <h3>⚠️ Що важливо пам'ятати</h3>
            <ul>
              <li>Рецесивні гени можуть «сховатись» на кілька поколінь</li>
              <li>
                Несподіваний колір — не помилка природи, а прояв схованого гена
              </li>
              <li>Ведення родоводів дозволяє відстежити носійство</li>
              <li>
                Колір не пов'язаний з продуктивністю — вибір за кольором має
                сенс тільки для декоративного розведення
              </li>
            </ul>
          </div>
        </div>

        <div className="genetics-back">
          <Link to="/" className="genetics-back-btn">
            ⬅ На головну
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Genetics;
