import { useState } from "react";
import { Link } from "react-router-dom";
import "./CraftMeat.css";

interface Fact {
  title: string;
  text: string;
}

interface Level {
  name: string;
  examples: string;
  risk: string;
  riskLevel: 1 | 2 | 3 | 4 | 5;
  note: string;
}

interface KeyNumber {
  value: string;
  unit: string;
  title: string;
  text: string;
}

interface TempOption {
  id: string;
  label: string;
  c: number;
  f: number;
  note: string;
}

interface LawCard {
  title: string;
  text: string;
  tip: string;
}

interface Mistake {
  wrong: string;
  fix: string;
}

const heroLede =
  "Крафтові м'ясні вироби це невеликі партії, які ви робите самі з м'яса власних кролів: запечену кролятину, паштети, ковбаски. Нижче: що з цього справді варто робити й у якому порядку вчитися, які три цифри безпеки не можна порушувати, як порахувати партію й що потрібно від вас за законом, якщо ви збираєтесь продавати.";

const facts: Fact[] = [
  {
    title: "Що це таке",
    text: "Невеликі партії з власної сировини, де ви самі контролюєте і тварин, і рецепт, і весь процес від охолодження тушки до фасування.",
  },
  {
    title: "Чого слово «крафтовий» не гарантує",
    text: "Саме по собі воно нічого не означає для безпеки і не замінює жодних вимог. Його не можна використовувати так, щоб ввести покупця в оману.",
  },
  {
    title: "Хто за це відповідає",
    text: "За безпечність харчового продукту відповідає той, хто його виробляє, тобто ви. Тому спершу безпека, а вже потім смак і красива етикетка.",
  },
];

const levels: Level[] = [
  {
    name: "Запечене й варене м'ясо",
    examples: "Буженина, рулети, відварна кролятина",
    risk: "Низький",
    riskLevel: 1,
    note: "Усе робиться термообробкою. Головне: температура всередині не нижче 71 °C і швидке охолодження.",
  },
  {
    name: "Паштети та ковбаски",
    examples: "Паштет, домашні ковбаски, фарш",
    risk: "Середній",
    riskLevel: 2,
    note: "Фарш змішує поверхню з серединою, тому для нього діє та сама цифра: 71 °C усередині. Потрібні чистий посуд і суворий контроль гігієни.",
  },
  {
    name: "Гаряче копчення",
    examples: "Копчені шматки та тушки",
    risk: "Середній",
    riskLevel: 3,
    note: "Це теж приготування: м'ясо має прогрітися всередині до безпечної температури. Без харчового термометра обійтися не вийде.",
  },
  {
    name: "В'ялення й сиров'ялені вироби",
    examples: "В'ялена кролятина, сиров'ялені ковбаси",
    risk: "Високий",
    riskLevel: 4,
    note: "М'ясо не варять. Захист забезпечують сіль, посолочна суміш і висушування, а помилка в дозуванні чи вологості небезпечна для людини.",
  },
  {
    name: "Консерви",
    examples: "М'ясні консерви в банках",
    risk: "Дуже високий",
    riskLevel: 5,
    note: "Найризикованіший напрям: потрібні спеціальне обладнання й жорсткий контроль. На старті не раджу.",
  },
];

const keyNumbers: KeyNumber[] = [
  {
    value: "71",
    unit: "°C",
    title: "Температура всередині",
    text: "Для кролятини, у тому числі з власного господарства, безпечний мінімум усередині 71 °C (160 °F). Те саме для фаршу й ковбасок. Готовий виріб перед подачею розігрівайте до 74 °C (165 °F). Міряйте харчовим термометром у найтовщому місці.",
  },
  {
    value: "2",
    unit: "год",
    title: "Максимум у небезпечній зоні",
    text: "Бактерії швидко розмножуються між 4 і 60 °C (40–140 °F), іноді подвоюючись щодвадцять хвилин. Не лишайте їжу в цьому діапазоні довше ніж на 2 години, а коли в приміщенні понад 32 °C (90 °F), довше ніж на 1 годину.",
  },
  {
    value: "4",
    unit: "°C",
    title: "Холодильник",
    text: "Холод сповільнює ріст бактерій, але не знищує їх, знищує лише нагрівання. Готові вироби охолоджуйте до 4 °C (40 °F) протягом двох годин, розклавши тонким шаром у неглибокі ємності.",
  },
];

const tempOptions: TempOption[] = [
  {
    id: "whole",
    label: "Запечене, варене чи копчене м'ясо (шматки, тушка)",
    c: 71,
    f: 160,
    note: "Для кролятини, дикої й фермерської, діє однакова вимога.",
  },
  {
    id: "ground",
    label: "Фарш, ковбаски",
    c: 71,
    f: 160,
    note: "Для фаршу й ковбасок вимога така сама: 160 °F (71 °C).",
  },
  {
    id: "reheat",
    label: "Розігрів готового виробу",
    c: 74,
    f: 165,
    note: "Залишки й готові страви розігрівають до 165 °F (74 °C) або поки не стануть гарячими й парними.",
  },
];

const nitriteFacts: string[] = [
  "Посолочна суміш із нітритом стримує розвиток бактерії, яка викликає ботулізм, і надає м'ясу рожевого кольору.",
  "Кількість нітриту суворо обмежена правилами: надлишок небезпечний для людини, тому додавати «на око» не можна.",
  "Беріть тільки готові посолочні суміші від виробника й дотримуйтесь інструкції. Чистий нітрит не використовуйте.",
  "Для запеченого, вареного й копченого гарячим способом м'яса безпеку забезпечує насамперед температура, а для в'ялення й сиров'ялених виробів тільки точне дозування й контроль вологості.",
];

const journalFields: string[] = [
  "Дата виробництва й номер партії",
  "Звідки сировина: дата забою кролів і чи пройшло м'ясо ветеринарно-санітарний контроль",
  "Вага сировини",
  "Рецепт: скільки солі, спецій і посолочної суміші додано",
  "Температура всередині, яку досягли",
  "Коли й до якої температури охолодили",
  "Вага готового виробу",
  "Термін придатності та умови зберігання",
  "Кому й коли продали партію",
];

const lawCards: LawCard[] = [
  {
    title: "Ви стаєте оператором ринку",
    text: "Фізична особа чи ФОП, яка виробляє або продає харчові продукти, вважається оператором ринку харчових продуктів, і саме на операторі лежить відповідальність за безпечність продукції.",
    tip: "Тому навіть невелике виробництво для продажу потребує оформлення. Продавати «з рук» без нього не варто.",
  },
  {
    title: "Експлуатаційний дозвіл або реєстрація",
    text: "Оператори, які виробляють чи зберігають харчові продукти тваринного походження, за законом мають отримувати експлуатаційний дозвіл (стаття 23 Закону № 771/97). Для інших потужностей достатньо державної реєстрації. Заяву подають через центр надання адміністративних послуг або через Дію до територіального органу Держпродспоживслужби. Якщо інфраструктура й обладнання відповідають вимогам, можуть видати тимчасовий дозвіл на три місяці.",
    tip: "Для малих потужностей можуть діяти особливі умови. Що саме потрібно у вашому випадку, уточніть у територіальному органі Держпродспоживслужби.",
  },
  {
    title: "Безпека за принципами НАССР",
    text: "Закон вимагає від оператора постійних процедур безпечності, заснованих на принципах НАССР. Для невеликих операторів передбачений спрощений підхід. Журнал партій, який описано вище, це саме та основа, з якої такі процедури складаються.",
    tip: "Починайте вести записи з першої партії.",
  },
  {
    title: "Ветеринарно-санітарний контроль м'яса",
    text: "М'ясо кролів і субпродукти підлягають ветеринарно-санітарному контролю за національними стандартами (ДСТУ 4293:2004 про кролів для забою та ДСТУ 4444:2005 про субпродукти). На агропродовольчих ринках експертизу проводять державні лабораторії ветсанекспертизи.",
    tip: "Як продавати готові вироби, окремо розглянемо на сторінці про легальний продаж. Тут головне, що сировина має бути перевіреною.",
  },
];

const mistakes: Mistake[] = [
  {
    wrong: "Дивитися на колір замість термометра",
    fix: "Колір і вигляд не гарантують готовності. Міряйте температуру в найтовщому місці й записуйте її.",
  },
  {
    wrong: "Охолоджувати готове м'ясо у великій каструлі",
    fix: "Розкладіть тонким шаром у неглибокі ємності й помістіть у холодильник протягом двох годин.",
  },
  {
    wrong: "Одна дошка й один ніж для сирого та готового",
    fix: "Використовуйте окремий інвентар і мийте руки, посуд та дошки до й після контакту із сирим м'ясом.",
  },
  {
    wrong: "Додавати посолочну суміш на око",
    fix: "Тільки готові суміші й точне зважування за інструкцією. Надлишок нітриту небезпечний.",
  },
  {
    wrong: "Одразу братися за в'ялення чи консерви",
    fix: "Почніть із запеченого й вареного м'яса, потім паштети та ковбаски. Ризикованіші технології лише після досвіду й консультації фахівця.",
  },
  {
    wrong: "Забивати кролів у термін виведення ліків",
    fix: "Дотримуйтесь терміну виведення препарату (див. сторінку «Антибіотикотерапія») і записуйте дату лікування.",
  },
];

const checklist: string[] = [
  "Сировина пройшла ветеринарно-санітарний контроль",
  "Є харчовий термометр і відкалібровано холодильник",
  "Окремі дошки й ножі для сирого та готового",
  "Відомо, яку температуру треба досягти всередині: 71 °C",
  "Підготовлені неглибокі ємності для швидкого охолодження",
  "Посолочну суміш зважують за інструкцією виробника",
  "Заведено журнал партій",
  "З'ясовано в територіальному органі Держпродспоживслужби, що потрібно для вашого випадку",
];

const toNumber = (value: string): number => {
  const parsed = parseFloat(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : NaN;
};

const fmt = (value: number): string =>
  value.toLocaleString("uk-UA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function CraftMeat() {
  const [tempId, setTempId] = useState<string>(tempOptions[0].id);
  const [raw, setRaw] = useState("");
  const [loss, setLoss] = useState("");
  const [salt, setSalt] = useState("1.8");
  const [price, setPrice] = useState("");
  const [other, setOther] = useState("");
  const [done, setDone] = useState<boolean[]>(() => checklist.map(() => false));

  const temp = tempOptions.find((t) => t.id === tempId) ?? tempOptions[0];

  const rawN = toNumber(raw);
  const lossN = Number.isFinite(toNumber(loss)) ? toNumber(loss) : NaN;
  const saltN = Number.isFinite(toNumber(salt)) ? toNumber(salt) : 0;
  const priceN = Number.isFinite(toNumber(price)) ? toNumber(price) : 0;
  const otherN = Number.isFinite(toNumber(other)) ? toNumber(other) : 0;

  const calcOk =
    Number.isFinite(rawN) &&
    rawN > 0 &&
    Number.isFinite(lossN) &&
    lossN >= 0 &&
    lossN < 100;

  const finished = calcOk ? rawN * (1 - lossN / 100) : 0;
  const saltGrams = calcOk ? rawN * 1000 * (saltN / 100) : 0;
  const totalCost = calcOk ? rawN * priceN + otherN : 0;
  const perKg = calcOk && finished > 0 ? totalCost / finished : 0;

  const toggle = (index: number) => {
    setDone((prev) => prev.map((v, i) => (i === index ? !v : v)));
  };
  const doneCount = done.filter(Boolean).length;

  return (
    <div className="cm-page">
      <header className="cm-hero">
        <div className="cm-hero-inner">
          <p className="cm-kicker">Крафтове виробництво</p>
          <h1 className="cm-title">Крафтові м'ясні вироби з кролятини</h1>
          <p className="cm-lede">{heroLede}</p>
          <ul className="cm-hero-stats" aria-label="Три ключові цифри">
            <li>
              <span className="cm-hero-num">71 °C</span>
              <span className="cm-hero-cap">усередині</span>
            </li>
            <li>
              <span className="cm-hero-num">2 год</span>
              <span className="cm-hero-cap">максимум у небезпечній зоні</span>
            </li>
            <li>
              <span className="cm-hero-num">4 °C</span>
              <span className="cm-hero-cap">холодильник</span>
            </li>
          </ul>
        </div>
      </header>

      <section
        className="cm-wrap cm-section"
        aria-label="Що таке крафтові вироби"
      >
        <h2 className="cm-h2">Що таке крафтові вироби</h2>
        <div className="cm-facts">
          {facts.map((f) => (
            <article className="cm-fact" key={f.title}>
              <h3 className="cm-fact-title">{f.title}</h3>
              <p className="cm-fact-text">{f.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cm-wrap cm-section" aria-label="Сходи складності">
        <h2 className="cm-h2">З чого починати: п'ять рівнів складності</h2>
        <p className="cm-p">
          Рівні розташовані від найпростішого до найризикованішого. Вчитися
          краще по порядку. Оцінка ризику це наше пояснення механізмів безпеки,
          описаних у джерелах, а не офіційна класифікація.
        </p>
        <ol className="cm-levels">
          {levels.map((l, i) => (
            <li className="cm-level" key={l.name}>
              <span className="cm-level-num">{i + 1}</span>
              <div className="cm-level-body">
                <div className="cm-level-head">
                  <h3 className="cm-level-name">{l.name}</h3>
                  <span className={`cm-risk cm-risk--${l.riskLevel}`}>
                    Ризик: {l.risk}
                  </span>
                </div>
                <p className="cm-level-ex">{l.examples}</p>
                <p className="cm-level-note">{l.note}</p>
                <div className="cm-meter" aria-hidden="true">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span
                      key={n}
                      className={`cm-meter-bar${n <= l.riskLevel ? " cm-meter-bar--on" : ""}`}
                    />
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="cm-wrap cm-section" aria-label="Три цифри безпеки">
        <h2 className="cm-h2">Три цифри, які не можна порушувати</h2>
        <div className="cm-numbers">
          {keyNumbers.map((k) => (
            <article className="cm-number" key={k.title}>
              <p className="cm-number-value">
                {k.value}
                <span className="cm-number-unit">{k.unit}</span>
              </p>
              <h3 className="cm-number-title">{k.title}</h3>
              <p className="cm-number-text">{k.text}</p>
            </article>
          ))}
        </div>
        <p className="cm-note">
          Температури взято з рекомендацій Міністерства сільського господарства
          США (USDA), які поширюються на кролятину. В Україні діють власні
          нормативи, тому для продажу орієнтуйтесь на вимоги
          Держпродспоживслужби.
        </p>
      </section>

      <section className="cm-band" aria-label="Яка температура потрібна">
        <div className="cm-wrap">
          <h2 className="cm-h2">Яку температуру треба досягти</h2>
          <p className="cm-p">Оберіть, що ви готуєте.</p>
          <div className="cm-picker">
            <div
              className="cm-picker-options"
              role="tablist"
              aria-label="Вид виробу"
            >
              {tempOptions.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={t.id === tempId}
                  className={`cm-opt${t.id === tempId ? " cm-opt--active" : ""}`}
                  onClick={() => setTempId(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div
              className="cm-picker-result"
              role="tabpanel"
              aria-live="polite"
            >
              <p className="cm-picker-label">Мінімум усередині</p>
              <p className="cm-picker-value">
                {temp.c} °C <span className="cm-picker-f">({temp.f} °F)</span>
              </p>
              <p className="cm-picker-note">{temp.note}</p>
              <ul className="cm-picker-steps">
                <li>Міряйте харчовим термометром у найтовщому місці.</li>
                <li>
                  Після досягнення температури охолодіть вироби до 4 °C протягом
                  двох годин.
                </li>
                <li>Записуйте результат у журнал партії.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="cm-wrap cm-section" aria-label="Калькулятор партії">
        <h2 className="cm-h2">Калькулятор партії</h2>
        <p className="cm-p">
          Порахуйте вихід готового виробу, сіль і собівартість килограма. Втрату
          маси визначайте зважуванням власних партій: усереднених цифр, які
          підійшли б усім, тут немає. Дані нікуди не надсилаються.
        </p>
        <div className="cm-calc">
          <div className="cm-calc-form">
            <label className="cm-field">
              <span>М'ясо на вході, кг</span>
              <input
                type="text"
                inputMode="decimal"
                value={raw}
                onChange={(e) => setRaw(e.target.value)}
                id="raw-input"
                name="raw-input"
              />
            </label>
            <label className="cm-field">
              <span>Втрата маси при обробці, %</span>
              <input
                type="text"
                inputMode="decimal"
                value={loss}
                onChange={(e) => setLoss(e.target.value)}
                id="loss-input"
                name="loss-input"
              />
            </label>
            <label className="cm-field">
              <span>Сіль, % від маси м'яса</span>
              <input
                type="text"
                inputMode="decimal"
                value={salt}
                onChange={(e) => setSalt(e.target.value)}
                id="salt-input"
                name="salt-input"
              />
            </label>
            <label className="cm-field">
              <span>Ціна сировини, грн за кг</span>
              <input
                type="text"
                inputMode="decimal"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                id="price-input"
                name="price-input"
              />
            </label>
            <label className="cm-field cm-field--wide">
              <span>
                Інші витрати на партію, грн (спеції, упаковка, енергія)
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={other}
                onChange={(e) => setOther(e.target.value)}
                id="other-input"
                name="other-input"
              />
            </label>
            <p className="cm-calc-hint">
              Початкове значення солі 1,8% це орієнтир для звичайних варених
              ковбас за описом технологів, а не норма для кожного виробу. Для
              своєї рецептури визначайте її самі.
            </p>
          </div>
          <div className="cm-ticket" aria-live="polite">
            <p className="cm-ticket-head">Партія</p>
            {calcOk ? (
              <>
                <div className="cm-ticket-row">
                  <span>Готового виробу</span>
                  <span>{fmt(finished)} кг</span>
                </div>
                <div className="cm-ticket-row">
                  <span>Солі</span>
                  <span>{fmt(saltGrams)} г</span>
                </div>
                <div className="cm-ticket-row">
                  <span>Витрати на партію</span>
                  <span>{fmt(totalCost)} грн</span>
                </div>
                <div className="cm-ticket-total">
                  <span>Собівартість 1 кг</span>
                  <span>{fmt(perKg)} грн</span>
                </div>
              </>
            ) : (
              <p className="cm-ticket-note">
                Введіть вагу м'яса й втрату маси (від 0 до 99%). Решта полів за
                потреби.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="cm-band cm-band--warn" aria-label="Посолочна суміш">
        <div className="cm-wrap">
          <h2 className="cm-h2">Посолочна суміш і нітрит: чому не на око</h2>
          <ul className="cm-nitrite">
            {nitriteFacts.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="cm-wrap cm-section" aria-label="Журнал партії">
        <h2 className="cm-h2">Журнал партії: що записувати</h2>
        <p className="cm-p">
          Записи потрібні, щоб знати, що пішло не так, якщо виникне проблема, і
          щоб довести безпечність продукції.
        </p>
        <ul className="cm-journal">
          {journalFields.map((j) => (
            <li key={j}>{j}</li>
          ))}
        </ul>
      </section>

      <section className="cm-band" aria-label="Закон">
        <div className="cm-wrap">
          <h2 className="cm-h2">Що каже закон</h2>
          <div className="cm-law">
            {lawCards.map((c) => (
              <article className="cm-law-card" key={c.title}>
                <h3 className="cm-law-title">{c.title}</h3>
                <p className="cm-law-text">{c.text}</p>
                <p className="cm-law-tip">{c.tip}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cm-wrap cm-section" aria-label="Типові помилки">
        <h2 className="cm-h2">Типові помилки й як їх виправити</h2>
        <div className="cm-mistakes">
          {mistakes.map((m) => (
            <div className="cm-mistake" key={m.wrong}>
              <p className="cm-mistake-wrong">{m.wrong}</p>
              <p className="cm-mistake-fix">{m.fix}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        className="cm-wrap cm-wrap--narrow cm-section"
        aria-label="Чек-лист"
      >
        <h2 className="cm-h2">Чек-лист перед першою партією</h2>
        <p className="cm-p">
          Відмічайте готове. Готово: {doneCount} з {checklist.length}.
        </p>
        <ul className="cm-check">
          {checklist.map((c, i) => (
            <li key={c}>
              <label
                className={`cm-check-item${done[i] ? " cm-check-item--done" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={done[i]}
                  onChange={() => toggle(i)}
                  id={`check-${i}`}
                  name={`check-${i}`}
                />
                <span>{c}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      <div className="cm-wrap cm-section">
        <h3 className="cm-small-title">Читайте також</h3>
        <div className="cm-related">
          <Link to="/slaughter" className="cm-related-link">
            Забій та переробка
          </Link>
          <Link to="/recipes" className="cm-related-link">
            Рецепти
          </Link>
          <Link to="/sales" className="cm-related-link">
            Збут кролятини
          </Link>
          <Link to="/legal" className="cm-related-link">
            Юридичний куточок
          </Link>
          <Link to="/antibiotic-therapy" className="cm-related-link">
            Антибіотикотерапія
          </Link>
          <Link to="/biosecurity" className="cm-related-link">
            Біобезпека та карантин
          </Link>
        </div>
      </div>
    </div>
  );
}
