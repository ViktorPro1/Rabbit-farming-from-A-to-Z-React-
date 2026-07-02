import { useState } from "react";
import "./RabbitConformation.css";
import ShareButton from "../../components/ShareButton/ShareButton";
import { Link } from "react-router-dom";

// ─── Types ───────────────────────────────────────────────────────
type BodyPart = "head" | "ears" | "body" | "legs" | "fur" | "tail";
type DefectSeverity = "disqualifying" | "serious" | "minor";

interface ConformationPart {
  id: BodyPart;
  icon: string;
  name: string;
  ideal: string;
  evaluation: string[];
  commonDefects: { defect: string; severity: DefectSeverity; note: string }[];
}

interface BreedType {
  id: string;
  name: string;
  examples: string;
  headType: string;
  bodyType: string;
  earType: string;
  weightRange: string;
  purpose: string;
  note: string;
}

interface EvaluationCriterion {
  criterion: string;
  maxPoints: number;
  whatToCheck: string;
  idealDescription: string;
}

// ─── Data ────────────────────────────────────────────────────────
const conformationParts: ConformationPart[] = [
  {
    id: "head",
    icon: "🐰",
    name: "Голова",
    ideal:
      "Голова має відповідати типу породи: широка і кругла у м'ясних порід, вузькувата і подовжена у хутрових та декоративних. Самці зазвичай мають масивнішу голову ніж самки тієї самої породи.",
    evaluation: [
      "Оцінюйте голову спереду та збоку",
      "Ширина черепа відносно довжини морди — ключовий показник типу",
      "Щоки у м'ясних порід — повні і виражені",
      "Перехід від чола до морди (стоп) — виражений у деяких порід (рекс), плавний в інших",
      "Ніс — широкий, чистий, без виділень",
      "Зуби — різці закриті правильно, верхні перекривають нижні (ножицеподібний прикус)",
      "Очі — яскраві, чисті, симетричні, відповідного кольору для породи",
    ],
    commonDefects: [
      {
        defect: "Неправильний прикус (малоклюзія)",
        severity: "disqualifying",
        note: "Верхні різці не перекривають нижні або навпаки. Спадкова вада — таких тварин не розводять",
      },
      {
        defect: "Вузька голова у м'ясної породи",
        severity: "serious",
        note: "Не відповідає породному типу. Знижує оцінку",
      },
      {
        defect: "Асиметрія черепа",
        severity: "serious",
        note: "Ознака родинного спарювання або природженого дефекту",
      },
      {
        defect: "Занадто довга морда",
        severity: "minor",
        note: "Критично для порід з вираженим «стопом» (рекс, каліфорнійський)",
      },
      {
        defect: "Виділення з носа або очей",
        severity: "disqualifying",
        note: "Ознака захворювання — тварина не допускається до виставки та розведення",
      },
    ],
  },
  {
    id: "ears",
    icon: "👂",
    name: "Вуха",
    ideal:
      "Вуха повинні відповідати стандарту породи за довжиною, шириною, формою та положенням. У прямовухих порід — стояти вертикально, симетрично, без відхилень. У баранів — звисати рівномірно по обидві сторони голови.",
    evaluation: [
      "Довжина вух вимірюється від основи між вухами до кінчика",
      "Ширина — важливіша ніж довжина для м'ясних порід (широке вухо = добре кровопостачання)",
      "Положення — вуха повинні виходити з однієї точки на темряді черепа",
      "Внутрішня поверхня — чиста, без кірок (ознака вушного кліща)",
      "Краї вух — рівні, без надривів і шрамів",
      "Товщина хряща — у породи рекс вуха ніжніші, у фландрів — масивні",
    ],
    commonDefects: [
      {
        defect: "Одне вухо звисає (лопоухість у прямовухої породи)",
        severity: "disqualifying",
        note: "Спадкова вада. Виключає з розведення",
      },
      {
        defect: "Вуха різної довжини",
        severity: "serious",
        note: "Асиметрія — ознака дефекту розвитку або травми",
      },
      {
        defect: "Кірки та запах у вухах",
        severity: "disqualifying",
        note: "Псороптоз (вушний кліщ) — заразна хвороба",
      },
      {
        defect: "Занадто вузькі вуха",
        severity: "minor",
        note: "Для великих порід — небажано, знижує оцінку",
      },
      {
        defect: "Зморшки або перегини хряща",
        severity: "minor",
        note: "Частіше у молодняку — може виправитись, але бажано відзначити",
      },
    ],
  },
  {
    id: "body",
    icon: "💪",
    name: "Корпус",
    ideal:
      "Корпус — найбільш вагома частина оцінки. М'ясні породи: широкий, глибокий, циліндричний корпус з добре розвиненою поперековою частиною. Хутрові породи: середній за довжиною, рівна спина. Декоративні: компактний, округлий.",
    evaluation: [
      "Оцінюйте збоку, зверху та поставивши тварину на рівну поверхню",
      "Спина — пряма або з легким підйомом до крижів (жодних западин або горбів)",
      "Поперек — широкий, м'язистий, добре заповнений — ключова м'ясна зона",
      "Круп — широкий, округлий, без кутастості",
      "Грудна клітка — широка і глибока, добре розвинена",
      "Живіт — підтягнутий, без відвислості",
      "Загальний силует: для м'ясних порід — «циліндр», для хутрових — «напівеліпс»",
      "Кондиція тіла (BCS 3) — не ожиріння і не виснаження при оцінці",
    ],
    commonDefects: [
      {
        defect: "Западина за плечима (сідлоподібна спина)",
        severity: "disqualifying",
        note: "Структурний дефект хребта. Дискваліфікує на виставці",
      },
      {
        defect: "Горб на попереку",
        severity: "disqualifying",
        note: "Кіфоз — спадкова або набута вада хребта",
      },
      {
        defect: "Вузький поперек",
        severity: "serious",
        note: "Основний недолік м'ясних порід. Знижує забійний вихід і оцінку",
      },
      {
        defect: "Відвислий живіт",
        severity: "serious",
        note: "Ожиріння або слабкість черевних м'язів",
      },
      {
        defect: "Вузька грудна клітка",
        severity: "minor",
        note: "Може впливати на репродуктивні якості самок",
      },
      {
        defect: "Асиметрія крупа",
        severity: "minor",
        note: "Може бути наслідком травми або природженого дефекту",
      },
    ],
  },
  {
    id: "legs",
    icon: "🦵",
    name: "Кінцівки",
    ideal:
      "Передні лапи — прямі, паралельні, добре кісткові. Задні лапи — сильні, добре м'язовані, розставлені на ширину тазу. Постановка лап — пряма, без вивороту назовні або всередину. Кігті — рівні, бажано світлі (у білих порід).",
    evaluation: [
      "Оглядайте лапи зі сторони, спереду та ззаду",
      "Передні: постановка — відразу від плечей вертикально донизу",
      "Задні: кут скакального суглоба — помірний, без перерозгинання",
      "Підошви — густо вкриті шерстю (захист від пододерматиту)",
      "Кігті — не загнуті, рівно відрізані якщо потрібно",
      "Кількість пальців: перед — 5, зад — 4 (відсутність або надлишок — дефект)",
      "М'язовий розвиток задніх лап — критичний для м'ясних порід",
    ],
    commonDefects: [
      {
        defect: "Крипторхізм у самців",
        severity: "disqualifying",
        note: "Одне або обидва яєчка не опустились. Дискваліфікує та виключає з розведення",
      },
      {
        defect: "Викривлені передні лапи (O-подібні або X-подібні)",
        severity: "serious",
        note: "Структурний дефект. Погіршує рух і довговічність тварини",
      },
      {
        defect: "Пододерматит (виразки лап)",
        severity: "disqualifying",
        note: "Запальне захворювання підошов. Тварина не допускається до виставки",
      },
      {
        defect: "Надмірно довгі кігті",
        severity: "minor",
        note: "Свідчить про недбалий догляд — мінус на виставці",
      },
      {
        defect: "Слабкі задні лапи (парез)",
        severity: "disqualifying",
        note: "Може бути симптомом E. cuniculi або травми хребта",
      },
    ],
  },
  {
    id: "fur",
    icon: "✨",
    name: "Хутро та шкіра",
    ideal:
      "Оцінка хутра залежить від породи. У хутрових порід (рекс, шиншила, ангора) — найважливіший критерій. У м'ясних — вторинний. Ключові параметри: щільність, рівномірність, блиск, відповідність кольору та малюнку стандарту породи.",
    evaluation: [
      "Щільність: проведіть пальцем проти росту шерсті — волокна мають щільно повертатись назад",
      "Довжина: у нормальношерстних — 25–35 мм, у рекс — 12–14 мм (коротке і пряме)",
      "Текстура: м'яка без жорсткості у хутрових, пружна і рівна у рекс",
      "Колір: рівномірний, відповідає стандарту породи, без плям або вицвітання",
      "Блиск: здорове хутро має помітний природній блиск",
      "Стан шкіри: відсутність лупи, кірок, лисин, паразитів",
      "Линька: тварина не повинна оцінюватись під час активної линьки",
    ],
    commonDefects: [
      {
        defect: "Лисини та осередкове облисіння",
        severity: "disqualifying",
        note: "Може бути лишай, паразити або барберинг — причину треба з'ясувати",
      },
      {
        defect: "Жорстка або кошлата шерсть у рекс",
        severity: "serious",
        note: "Рекс повинен мати бархатисту текстуру — відхилення знижує цінність хутра",
      },
      {
        defect: "Нерівний колір або небажані плями",
        severity: "serious",
        note: "Не відповідає стандарту породи — дискваліфікує на виставці",
      },
      {
        defect: "Тьмяне, скуйовджене хутро",
        severity: "minor",
        note: "Ознака поганого стану здоров'я або неправильного харчування",
      },
      {
        defect: "Активна линька під час оцінки",
        severity: "minor",
        note: "Не дискваліфікує, але знижує оцінку — бажано перенести оцінювання",
      },
    ],
  },
  {
    id: "tail",
    icon: "🐇",
    name: "Хвіст та загальний вигляд",
    ideal:
      "Хвіст — короткий, прямий, тримається вздовж лінії спини. Жоден стандарт не передбачає загнутого або опущеного хвоста. Загальний вигляд: тварина має виглядати здоровою, активною та типовою для своєї породи.",
    evaluation: [
      "Хвіст — піднятий або горизонтальний, не опущений між задніми лапами",
      "Прямий — бічне або вертикальне відхилення є дефектом",
      "Загальна гармонія: всі частини тіла пропорційні одна одній",
      "Темперамент: тварина спокійна під час огляду — плюс при оцінці",
      "Вага відповідає стандарту породи для відповідного віку",
      "Стать чітко виражена — самці з двома опущеними яєчками",
    ],
    commonDefects: [
      {
        defect: "Загнутий або закручений хвіст",
        severity: "serious",
        note: "Вроджений дефект хребця. Може передаватись у спадок",
      },
      {
        defect: "Відсутній хвіст",
        severity: "disqualifying",
        note: "Природжена аномалія або стара травма",
      },
      {
        defect: "Хвіст опущений між лапами постійно",
        severity: "minor",
        note: "Може бути ознакою болю, страху або неврологічної проблеми",
      },
      {
        defect: "Непропорційно маленьке або велике тіло",
        severity: "serious",
        note: "Порушення гармонії типу — знижує загальну оцінку",
      },
    ],
  },
];

const breedTypes: BreedType[] = [
  {
    id: "meat",
    name: "М'ясний тип",
    examples:
      "Новозеландський білий, Каліфорнійський, Панон, Хілла, Термонський",
    headType:
      "Широка, округла, масивна. Щоки повні. У самців — виражена «бичача» голова",
    bodyType:
      "Циліндричний, широкий, глибокий. Поперек — головна м'ясна зона. Максимальний розвиток задньої чверті",
    earType: "Середньої довжини (10–12 см), стоять прямо, добре кровопостачені",
    weightRange: "Дорослі: 4–6 кг",
    purpose: "Забійний вихід 55–62%, конверсія корму, швидкий ріст",
    note: "Оцінюють передусім задню чверть і поперек — саме там найціннішe м'ясо",
  },
  {
    id: "fur",
    name: "Хутровий тип",
    examples: "Рекс, Шиншила, Віденський блакитний, Срібло",
    headType: "Середня, пропорційна. Менш масивна ніж у м'ясних",
    bodyType: "Середній за довжиною, рівна спина, помірно розвинений корпус",
    earType: "Прямі, середньої довжини і ширини",
    weightRange: "Дорослі: 3–5 кг",
    purpose: "Якість хутра — первинний критерій: щільність, текстура, колір",
    note: "Рекс оцінюють окремо — бархатисте хутро 12–14 мм без остьових волосин",
  },
  {
    id: "giant",
    name: "Велетенський тип",
    examples: "Фландр, Сірий велетень, Білий велетень, Ризький",
    headType: "Дуже велика, широка, квадратна. У самців особливо масивна",
    bodyType: "Довгий, масивний, добре збитий. Лопатки і круп широкі",
    earType: "Довгі (15–20+ см), широкі, стоять прямо",
    weightRange: "Дорослі: 6–12+ кг",
    purpose: "М'ясо та декоративне утримання, демонстрація на виставках",
    note: "Оцінюють масивність і пропорційність. Ожиріння і виснаження однаково небажані",
  },
  {
    id: "lop",
    name: "Баран (висловухий тип)",
    examples: "Баран французький, Баран міні, Баран голландський",
    headType:
      "Округла, «яблукоподібна» у міні-баранів. Виражений перехід чола до носа",
    bodyType: "Компактний, округлий. Французький баран — масивніший",
    earType:
      "Звисають по боках голови, кінці спускаються нижче щелепи. Симетрично",
    weightRange: "Міні: 1,5–2,5 кг; Французький: 4–5 кг",
    purpose: "Декоративне утримання, виставки",
    note: "Симетрія вух — критичний критерій. Одне вухо вище іншого — серйозний дефект",
  },
  {
    id: "dwarf",
    name: "Карликовий тип",
    examples: "Карлик польський, Нідерландський карлик, Голландський",
    headType:
      "Кругла, компактна, з вираженим «стопом» (перехід від чола до носа)",
    bodyType:
      "Компактний, округлий, короткий. Відношення ширини до довжини близьке до 1:1",
    earType: "Короткі (5–7 см), стоять прямо, добре вкриті шерстю",
    weightRange: "Дорослі: 0,9–2,5 кг",
    purpose: "Декоративне утримання. Компактність — головний критерій",
    note: "Макроцефалія (надто велика голова) та мікроцефалія — обидва дефекти",
  },
  {
    id: "angora",
    name: "Ангорський тип",
    examples: "Ангора англійська, Французька, Гігантська, Атласна",
    headType:
      "Кругла, добре вкрита довгою шерстю (особливо англійська — шерсть на обличчі)",
    bodyType: "Компактний або середній. Повністю вкритий довгою рівною шерстю",
    earType:
      "Прямі, густо вкриті шерстю — «пензлики» на кінцях (особливо у англійської)",
    weightRange: "Англійська: 2–3,5 кг; Гігантська: 5–6 кг",
    purpose: "Пух для прядіння (300–500 г/рік)",
    note: "Довжина і щільність пуху, відсоток пухових волокон — основні критерії",
  },
];

const evaluationCriteria: EvaluationCriterion[] = [
  {
    criterion: "Тип та будова тіла",
    maxPoints: 35,
    whatToCheck:
      "Відповідність загального силуету стандарту породи, пропорційність частин тіла, м'язовий розвиток",
    idealDescription:
      "Тварина точно відповідає загальному описанню породи. Корпус — правильної форми і пропорцій",
  },
  {
    criterion: "Голова та вуха",
    maxPoints: 15,
    whatToCheck:
      "Форма голови, прикус, стан зубів, форма вух, їх положення та розмір",
    idealDescription:
      "Голова типова для породи. Прикус правильний. Вуха симетричні, відповідного розміру і форми",
  },
  {
    criterion: "Хутро та шкіра",
    maxPoints: 25,
    whatToCheck:
      "Щільність, довжина, текстура, блиск, стан шкіри, відсутність паразитів та хвороб",
    idealDescription:
      "Хутро відповідає стандарту породи. Щільне, блискуче, без дефектів і паразитів",
  },
  {
    criterion: "Колір та малюнок",
    maxPoints: 15,
    whatToCheck:
      "Відповідність кольору стандарту, рівномірність, чіткість малюнку (для плямистих порід)",
    idealDescription:
      "Колір насичений, рівномірний. Малюнок чіткий і типовий для породи",
  },
  {
    criterion: "Умови утримання та стан здоров'я",
    maxPoints: 10,
    whatToCheck:
      "Кондиція тіла, стан кігтів, чистота вух і очей, відсутність хвороб",
    idealDescription:
      "Тварина здорова, добре доглянута, відповідної ваги. Кігті підрізані, вуха чисті",
  },
];

const defectSeverityConfig = {
  disqualifying: { label: "Дискваліфікує", color: "#8B0000", bg: "#FFE0DE" },
  serious: { label: "Серйозний", color: "#633806", bg: "#FAEEDA" },
  minor: { label: "Незначний", color: "#27500A", bg: "#EAF3DE" },
};

// ─── Component ───────────────────────────────────────────────────
export default function RabbitConformation() {
  const [activePart, setActivePart] = useState<BodyPart>("head");
  const [activeBreed, setActiveBreed] = useState<string | null>(null);
  const [defectFilter, setDefectFilter] = useState<DefectSeverity | "all">(
    "all",
  );

  const currentPart = conformationParts.find((p) => p.id === activePart)!;

  const allDefects = conformationParts.flatMap((p) =>
    p.commonDefects.map((d) => ({ ...d, partName: p.name })),
  );
  const filteredDefects =
    defectFilter === "all"
      ? allDefects
      : allDefects.filter((d) => d.severity === defectFilter);

  return (
    <div className="rc-page">
      <header className="rc-header">
        <h1>Екстер'єр кроля</h1>
        <p>
          Будова тіла, оцінка голови, корпусу, лап і хутра — від А до Я.
          Стандарти порід, дефекти та система балів для виставок і племінної
          роботи.
        </p>
      </header>

      <div className="rc-wrap">
        {/* ЩО ТАКЕ ЕКСТЕР'ЄР */}
        <h2 className="rc-section-title">
          Що таке екстер'єр і навіщо його оцінювати
        </h2>
        <div className="rc-note">
          <p>
            <strong>Екстер'єр</strong> (від фр. extérieur — зовнішній) —
            сукупність зовнішніх форм тіла тварини, що характеризують її породні
            якості, конституційний тип та продуктивність.
          </p>
          <p>
            Оцінка екстер'єру вирішує три завдання:{" "}
            <strong>виставкова оцінка</strong> (відповідність стандарту породи),{" "}
            <strong>відбір в розведення</strong> (відсіювання тварин з
            успадковуваними дефектами) та{" "}
            <strong>оцінка продуктивних якостей</strong> (будова тіла відображає
            м'ясні, хутрові або пухові якості).
          </p>
          <p>
            Джерело стандартів: ARBA (American Rabbit Breeders Association), BRC
            (British Rabbit Council), ZDRK (Zentralverband Deutscher
            Rasse-Kaninchenzüchter) — три основні організації зі стандартами
            порід кролів.
          </p>
        </div>

        {/* СИСТЕМА БАЛІВ */}
        <h2 className="rc-section-title">Система оцінки — бали та критерії</h2>
        <p className="rc-intro">
          Загальна максимальна оцінка — 100 балів. Розподіл за основними
          критеріями:
        </p>
        <div className="rc-table-wrap">
          <table className="rc-table">
            <thead>
              <tr>
                <th>Критерій</th>
                <th>Макс. балів</th>
                <th>Що перевіряють</th>
                <th>Ідеальний опис</th>
              </tr>
            </thead>
            <tbody>
              {evaluationCriteria.map((c, i) => (
                <tr key={i}>
                  <td>
                    <strong>{c.criterion}</strong>
                  </td>
                  <td className="rc-td-center">
                    <span className="rc-points-badge">{c.maxPoints}</span>
                  </td>
                  <td className="rc-td-sm">{c.whatToCheck}</td>
                  <td className="rc-td-sm">{c.idealDescription}</td>
                </tr>
              ))}
              <tr className="rc-total-row">
                <td>
                  <strong>Всього</strong>
                </td>
                <td className="rc-td-center">
                  <span className="rc-points-badge rc-points-badge--total">
                    100
                  </span>
                </td>
                <td colSpan={2}></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="rc-grades-grid">
          {[
            {
              label: "Відмінно",
              range: "90–100 балів",
              color: "var(--green-mid)",
              bg: "var(--green-light)",
            },
            {
              label: "Дуже добре",
              range: "80–89 балів",
              color: "var(--green-accent)",
              bg: "#EAF3DE",
            },
            {
              label: "Добре",
              range: "70–79 балів",
              color: "var(--amber)",
              bg: "var(--amber-light)",
            },
            {
              label: "Задовільно",
              range: "60–69 балів",
              color: "var(--brown)",
              bg: "#FAEEDA",
            },
            {
              label: "Незадовільно",
              range: "нижче 60",
              color: "#8B0000",
              bg: "#FFE0DE",
            },
          ].map((g, i) => (
            <div
              key={i}
              className="rc-grade-card"
              style={{ background: g.bg, borderColor: g.color + "44" }}
            >
              <span className="rc-grade-label" style={{ color: g.color }}>
                {g.label}
              </span>
              <span className="rc-grade-range">{g.range}</span>
            </div>
          ))}
        </div>

        {/* ОЦІНКА ЧАСТИН ТІЛА */}
        <h2 className="rc-section-title">Оцінка частин тіла</h2>
        <p className="rc-intro">
          Виберіть частину тіла — стандарт, методика оцінки та дефекти
        </p>

        <div className="rc-part-tabs">
          {conformationParts.map((p) => (
            <button
              key={p.id}
              className={`rc-tab ${activePart === p.id ? "rc-tab--active" : ""}`}
              onClick={() => setActivePart(p.id)}
            >
              {p.icon} {p.name}
            </button>
          ))}
        </div>

        <div className="rc-part-content" key={activePart}>
          <div className="rc-part-ideal">
            <span className="rc-part-label">✅ Ідеальний стан</span>
            <p>{currentPart.ideal}</p>
          </div>

          <div className="rc-part-grid">
            <div className="rc-eval-block">
              <h3 className="rc-eval-title">📋 Методика оцінки</h3>
              <ul className="rc-eval-list">
                {currentPart.evaluation.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>

            <div className="rc-defects-block">
              <h3 className="rc-eval-title">⚠️ Типові дефекти</h3>
              <div className="rc-defects-list">
                {currentPart.commonDefects.map((d, i) => {
                  const cfg = defectSeverityConfig[d.severity];
                  return (
                    <div key={i} className="rc-defect-item">
                      <div className="rc-defect-top">
                        <strong className="rc-defect-name">{d.defect}</strong>
                        <span
                          className="rc-sev-badge"
                          style={{ color: cfg.color, background: cfg.bg }}
                        >
                          {cfg.label}
                        </span>
                      </div>
                      <p className="rc-defect-note">{d.note}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ТИПИ ПОРІД */}
        <h2 className="rc-section-title">Типи порід — що оцінюють у кожному</h2>
        <p className="rc-intro">
          Натисніть на тип — характеристики голови, корпусу, вух та призначення
        </p>
        <div className="rc-breeds-list">
          {breedTypes.map((b) => {
            const isOpen = activeBreed === b.id;
            return (
              <article
                key={b.id}
                className={`rc-breed-card ${isOpen ? "rc-breed-card--open" : ""}`}
                onClick={() => setActiveBreed(isOpen ? null : b.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && setActiveBreed(isOpen ? null : b.id)
                }
                aria-expanded={isOpen}
              >
                <div className="rc-breed-header">
                  <div className="rc-breed-titles">
                    <h3 className="rc-breed-name">{b.name}</h3>
                    <p className="rc-breed-examples">{b.examples}</p>
                  </div>
                  <span className="rc-breed-weight">{b.weightRange}</span>
                  <span className="rc-chevron">{isOpen ? "▲" : "▼"}</span>
                </div>
                {isOpen && (
                  <div className="rc-breed-details">
                    <div className="rc-breed-grid">
                      {[
                        { label: "🐰 Голова", value: b.headType },
                        { label: "💪 Корпус", value: b.bodyType },
                        { label: "👂 Вуха", value: b.earType },
                        { label: "🎯 Призначення", value: b.purpose },
                      ].map(({ label, value }) => (
                        <div key={label} className="rc-breed-param">
                          <span className="rc-breed-param-label">{label}</span>
                          <p>{value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="rc-breed-note">
                      <span className="rc-breed-param-label">
                        🌾 Нотатка для оцінювача
                      </span>
                      <p>{b.note}</p>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {/* ЗВЕДЕНА ТАБЛИЦЯ ДЕФЕКТІВ */}
        <h2 className="rc-section-title">Зведений реєстр дефектів</h2>
        <p className="rc-intro">
          Всі дефекти по всіх частинах тіла — з фільтром за серйозністю
        </p>

        <div className="rc-defect-filters">
          {[
            { val: "all" as const, label: "Всі дефекти" },
            { val: "disqualifying" as const, label: "Дискваліфікуючі" },
            { val: "serious" as const, label: "Серйозні" },
            { val: "minor" as const, label: "Незначні" },
          ].map(({ val, label }) => (
            <button
              key={val}
              className={`rc-filter-btn ${defectFilter === val ? "rc-filter-btn--active" : ""}`}
              onClick={() => setDefectFilter(val)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="rc-table-wrap">
          <table className="rc-table">
            <thead>
              <tr>
                <th>Дефект</th>
                <th>Частина тіла</th>
                <th>Ступінь</th>
                <th>Примітка</th>
              </tr>
            </thead>
            <tbody>
              {filteredDefects.map((d, i) => {
                const cfg = defectSeverityConfig[d.severity];
                return (
                  <tr key={i}>
                    <td>
                      <strong>{d.defect}</strong>
                    </td>
                    <td className="rc-td-part">{d.partName}</td>
                    <td>
                      <span
                        className="rc-sev-badge"
                        style={{ color: cfg.color, background: cfg.bg }}
                      >
                        {cfg.label}
                      </span>
                    </td>
                    <td className="rc-td-note">{d.note}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ПРАКТИЧНІ ПОРАДИ */}
        <h2 className="rc-section-title">Як підготувати кроля до оцінки</h2>
        <div className="rc-tips-grid">
          {[
            {
              icon: "✂️",
              title: "За 2 тижні",
              text: "Підстрижіть кігті. Довгі кігті — мінус балів і ознака поганого догляду",
            },
            {
              icon: "🪮",
              title: "За тиждень",
              text: "Вичешіть та перевірте хутро. Тварина не повинна бути в активній линьці",
            },
            {
              icon: "👂",
              title: "За 3 дні",
              text: "Перевірте вуха — чистота, відсутність кірок та запаху",
            },
            {
              icon: "⚖️",
              title: "За день",
              text: "Зважте — вага має відповідати стандарту породи для цього віку",
            },
            {
              icon: "🌡️",
              title: "День оцінки",
              text: "Не годуйте рясно перед транспортуванням. Забезпечте воду та вентиляцію",
            },
            {
              icon: "📋",
              title: "Документи",
              text: "Родовід, ветеринарна довідка про здоров'я, картка тварини — обов'язково",
            },
          ].map((t, i) => (
            <div key={i} className="rc-tip-card">
              <span className="rc-tip-icon">{t.icon}</span>
              <strong className="rc-tip-title">{t.title}</strong>
              <p className="rc-tip-text">{t.text}</p>
            </div>
          ))}
        </div>

        {/* АЛЕРТИ */}
        <h2 className="rc-section-title">Важливо пам'ятати</h2>
        <div className="rc-alert danger">
          🚨 Тварина з ознаками хвороби (виділення з носа/очей, кірки у вухах,
          кульгавість) не допускається до виставки і не повинна оцінюватись
        </div>
        <div className="rc-alert danger">
          🚨 Дискваліфікуючі дефекти (малоклюзія, крипторхізм, лопоухість у
          прямовухих) виключають тварину з розведення — навіть при відмінних
          інших показниках
        </div>
        <div className="rc-alert warn">
          ⚠️ Оцінка під час линьки є некоректною — хутрові показники будуть
          занижені. Плануйте оцінку через 4–6 тижнів після завершення линьки
        </div>
        <div className="rc-alert ok">
          ✓ Молодняк оцінюють за тими ж критеріями, але з поправкою на вік — не
          всі ознаки типу сформовані до 3–4 місяців
        </div>

        <div className="rc-note" style={{ marginTop: "1.5rem" }}>
          <p>
            <strong>Джерела:</strong> ARBA — Standard of Perfection (видання
            2021–2025); BRC — British Rabbit Standards; Sandford J.C. — The
            Domestic Rabbit (5th ed., Blackwell); Lebas F. et al. — The Rabbit,
            FAO Animal Production and Health Series No. 21; ZDRK — Richtlinien
            für die Bewertung von Rassekaninchen.
          </p>
        </div>
      </div>

      <div className="rc-related">
        <h3 className="rc-related-title">Читайте також</h3>
        <div className="rc-related-grid">
          <Link to="/breed-standards" className="rc-related-link">
            📜 Стандарти порід
          </Link>
          <Link to="/disqualifying-faults" className="rc-related-link">
            ❌ Дискваліфікаційні вади
          </Link>
          <Link to="/show-judging" className="rc-related-link">
            👨‍⚖️ Суддівство на виставках
          </Link>
          <Link to="/select-buck" className="rc-related-link">
            ♂️ Вибір племінного самця
          </Link>
          <Link to="/select-doe" className="rc-related-link">
            ♀️ Вибір племінної самки
          </Link>
        </div>
      </div>

      <div className="rc-back">
        <Link to="/" className="rc-back-btn">
          ⬅ На головну
        </Link>
        <ShareButton title="Назва цієї сторінки" />
      </div>
    </div>
  );
}
