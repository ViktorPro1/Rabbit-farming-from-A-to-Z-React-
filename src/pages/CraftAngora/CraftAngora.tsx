import { useState } from "react";
import { Link } from "react-router-dom";
import "./CraftAngora.css";

interface Chip {
  title: string;
  text: string;
}

interface Question {
  title: string;
  text: string;
}

interface MethodRow {
  method: string;
  fits: string;
  plus: string;
  minus: string;
}

interface Grade {
  name: string;
  where: string;
  look: string;
  use: string;
}

interface Step {
  title: string;
  text: string;
}

interface Mistake {
  wrong: string;
  fix: string;
}

const heroLede =
  "Ангорський кролик це окремий напрямок кролівництва: його розводять заради пуху. З нього виходять пряжа, в'язані й валяні вироби. Нижче: чи підходить вам цей напрямок, як рахувати цикл від стрижки до стрижки, чим відрізняються вищипування й стрижка, як сортувати пух, як з нього робити пряжу та як не нашкодити здоров'ю тварин.";

const chips: Chip[] = [
  {
    title: "~90 діб",
    text: "типовий цикл між збираннями пуху",
  },
  {
    title: "6 см +",
    text: "довжина кращого, першого класу",
  },
  {
    title: "12–16 мкм",
    text: "тонина якісного пуху",
  },
];

const questions: Question[] = [
  {
    title: "Це не додаток до м'ясного господарства",
    text: "ФАО зазначає, що заводчики ангори розробили методи, які суттєво відрізняються від методів вирощування м'ясних кролів. Пух головна мета, і підлаштовувати під нього м'ясних кролів не вийде.",
  },
  {
    title: "Потрібен регулярний догляд",
    text: "Щоб пух не збивався у війлок, кролів вичісують щонайменше раз-двічі на тиждень, а щоденне вичісування допомагає взагалі уникнути війлоку й збільшує частку придатного пуху.",
  },
  {
    title: "Потрібне прохолодне приміщення",
    text: "Густа шерсть робить ангор чутливими і до спеки, і до сильного холоду. Для французьких ангор радять температуру приблизно 10–24 °C. Дослідження також показало, що влітку пуху виходить найменше.",
  },
  {
    title: "Термін роботи з кроликом обмежений",
    text: "У дослідженні в організованому господарстві комерційний термін використання ангорського кролика склав приблизно 28 місяців: далі вихід пуху помітно падає.",
  },
  {
    title: "Вихід пуху невеликий і залежить від породи",
    text: "Оцінки різняться: за даними організації FOUR PAWS, середній вихід у промислових господарствах близько 200 г на рік, а дорослий німецький ангорський кролик дає 4–6 унцій (приблизно 110–170 г) за одне збирання приблизно кожні 90 діб. Тому порахуйте за власними зважуваннями.",
  },
];

const methods: MethodRow[] = [
  {
    method: "Вищипування (збір линяючого пуху)",
    fits: "Породи, що линяють природно: французька, англійська, сатинова",
    plus: "Менше остьового волосся; пух не такий збитий; кінці волокон звужені, тому пух легше прясти",
    minus:
      "Забирає багато часу. Якщо при вищипуванні з'являються лисини, переходьте на стрижку, інакше завдасте тварині болю",
  },
  {
    method: "Стрижка",
    fits: "Німецька та гігантська ангора, які не линяють, а також коли потрібно швидше",
    plus: "Швидше; з одного кролика за одну сесію виходить більше пуху",
    minus:
      "Зріз тупий, тому пух важче прясти, а якість трохи нижча. Стрижіть ножицями з тупими кінцями й не надто близько до шкіри (наша порада)",
  },
];

const grades: Grade[] = [
  {
    name: "Перший клас",
    where: "Спина й верхні боки",
    look: "Чистий, без збитого, довший за 6 см. Це найдовше й найчистіше волокно, у ньому не повинно бути сіна.",
    use: "Прядіння",
  },
  {
    name: "Другий клас",
    where: "Шия й нижні боки",
    look: "Чистий і не збитий, коротший (приблизно 3–6 см), може бути трохи рослинного сміття.",
    use: "Суміші з вовною",
  },
  {
    name: "Третій клас",
    where: "Задня частина, ноги й місця, які легко збиваються",
    look: "Короткий, збитий або забруднений.",
    use: "Валяння, набивка",
  },
];

const spinSteps: Step[] = [
  {
    title: "Перебрати й розпушити",
    text: "Пух зазвичай чистий, але перебрати його від сміття й розправити слід. Деякі майстрині кладуть пух паралельно, щоб його було легше витягувати під час прядіння.",
  },
  {
    title: "Змішати з вовною",
    text: "Чиста ангора дуже м'яка й слизька, у неї гладкі луски, які погано зчіплюються між собою, тому новачкам важко прясти 100% ангору. Спінери радять змішувати її з тонкою вовною. У дослідженні суміш 35:65 кролячого пуху й мериноса виявилася найкращою для в'язаної тканини.",
  },
  {
    title: "Прясти",
    text: "Ангору прядуть на високій швидкості з майже нульовим натягом. Для веретена радять легку модель із верхнім диском (top whorl). Є й метод прядіння з серцевиною (core spinning).",
  },
  {
    title: "Добре закрутити",
    text: "Тугіша закрутка допомагає втримати слизькі волокна в нитці. Якщо закрутки замало, пряжа розкручується; якщо забагато, рветься.",
  },
  {
    title: "Промити готову пряжу",
    text: "Пряжу миють після прядіння, а не перед ним, тому що пух чистий. Сушіть її без різких температур і не труть: ангора валяється легко.",
  },
  {
    title: "В'язати або валяти",
    text: "З ангорської пряжі в'яжуть, а також її валяють. Для ткацтва 100% ангора занадто м'яка. Суміш із вовною робить пряжу еластичнішою й дешевшою, але зменшує м'якість і пухнастість.",
  },
];

const mistakes: Mistake[] = [
  {
    wrong: "Залишати пух довше за 90–100 діб",
    fix: "Приблизно на сотий день пух починає линяти й збиватись, а ризик вовняної пробки зростає. Збирайте вчасно.",
  },
  {
    wrong: "Вичісувати рідко",
    fix: "Щонайменше раз-двічі на тиждень, а ще краще щодня: так пух не збивається у війлок.",
  },
  {
    wrong: "Вищипувати пух у породи, що не линяє",
    fix: "Для німецької та гігантської ангори застосовують стрижку. Якщо при вищипуванні з'являються лисини, також переходьте на стрижку.",
  },
  {
    wrong: "Одразу прясти чисту ангору",
    fix: "Спочатку змішуйте її з тонкою вовною.",
  },
  {
    wrong: "Змішувати класи пуху в одну купу",
    fix: "Сортуйте на місці: перший клас окремо від збитого. Так кожен клас піде за своєю ціною й на своє призначення.",
  },
  {
    wrong: "Тримати ангор у спеку",
    fix: "Забезпечте прохолодне й провітрюване приміщення. Влітку пуху виходить найменше.",
  },
];

const checklist: string[] = [
  "Є прохолодне провітрюване приміщення",
  "Тварини мають необмежений доступ до сіна й води",
  "Вичісування заплановано щонайменше двічі на тиждень",
  "Відома дата останнього збору пуху для кожного кролика",
  "Пух сортується за класами одразу після збору",
  "Для прядіння підготовлено тонку вовну для суміші",
  "Ведеться облік: скільки грамів з кожного кролика",
  "Відомо, кому й як ви збираєтесь продавати пух чи вироби",
];

const toNumber = (value: string): number => {
  const parsed = parseFloat(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : NaN;
};

const fmtDate = (d: Date): string =>
  d.toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const fmtNum = (value: number, digits = 2): string =>
  value.toLocaleString("uk-UA", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

const addDays = (base: Date, days: number): Date => {
  const d = new Date(base.getTime());
  d.setDate(d.getDate() + days);
  return d;
};

export default function CraftAngora() {
  const [lastDate, setLastDate] = useState("");
  const [rabbits, setRabbits] = useState("");
  const [grams, setGrams] = useState("");
  const [harvests, setHarvests] = useState("4");
  const [feed, setFeed] = useState("");
  const [other, setOther] = useState("");
  const [done, setDone] = useState<boolean[]>(() => checklist.map(() => false));

  const parsed = lastDate ? new Date(`${lastDate}T00:00:00`) : null;
  const validDate = parsed !== null && !Number.isNaN(parsed.getTime());
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days =
    validDate && parsed
      ? Math.floor((today.getTime() - parsed.getTime()) / 86400000)
      : 0;
  const futureDate = validDate && days < 0;
  const cycleOk = validDate && !futureDate;

  let status = "";
  if (cycleOk) {
    if (days < 75) {
      status = `До оптимального збору за дослідженням (75 діб) залишилось ${75 - days} діб, до типового графіка (90 діб) ${90 - days}.`;
    } else if (days < 90) {
      status = `Оптимальний термін за дослідженням уже настав. До типового графіка в 90 діб залишилось ${90 - days} діб.`;
    } else if (days <= 100) {
      status = "Час збирати: типовий графік у 90 діб настав.";
    } else {
      status =
        "Пух перестояв: приблизно на сотий день він починає линяти й збиватись, ризик вовняної пробки зростає. Збирайте якнайшвидше.";
    }
  }
  const barPercent = cycleOk ? Math.min(100, (days / 120) * 100) : 0;

  const rabbitsN = toNumber(rabbits);
  const gramsN = toNumber(grams);
  const harvestsN = toNumber(harvests);
  const feedN = Number.isFinite(toNumber(feed)) ? toNumber(feed) : 0;
  const otherN = Number.isFinite(toNumber(other)) ? toNumber(other) : 0;
  const yieldOk =
    Number.isFinite(rabbitsN) &&
    rabbitsN > 0 &&
    Number.isFinite(gramsN) &&
    gramsN > 0 &&
    Number.isFinite(harvestsN) &&
    harvestsN > 0;
  const totalG = yieldOk ? rabbitsN * gramsN * harvestsN : 0;
  const totalCost = yieldOk ? rabbitsN * (feedN + otherN) : 0;
  const per100 = yieldOk && totalG > 0 ? totalCost / (totalG / 100) : 0;

  const toggle = (index: number) => {
    setDone((prev) => prev.map((v, i) => (i === index ? !v : v)));
  };
  const doneCount = done.filter(Boolean).length;

  return (
    <div className="ag-page">
      <header className="ag-hero">
        <div className="ag-hero-inner">
          <p className="ag-kicker">Крафтове виробництво</p>
          <h1 className="ag-title">Пух і пряжа з ангорських кролів</h1>
          <p className="ag-lede">{heroLede}</p>
          <ul className="ag-chips" aria-label="Три ключові цифри">
            {chips.map((c) => (
              <li key={c.title}>
                <span className="ag-chip-title">{c.title}</span>
                <span className="ag-chip-text">{c.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <section
        className="ag-wrap ag-section"
        aria-label="Чи підходить вам ангора"
      >
        <h2 className="ag-h2">Чи підходить вам ангора</h2>
        <div className="ag-questions">
          {questions.map((q) => (
            <article className="ag-question" key={q.title}>
              <h3 className="ag-question-title">{q.title}</h3>
              <p className="ag-question-text">{q.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ag-band" aria-label="Цикл збору пуху">
        <div className="ag-wrap">
          <h2 className="ag-h2">Цикл збору пуху</h2>
          <ul className="ag-cycle">
            <li>
              Більшість джерел радять збирати пух приблизно кожні 90 діб.
              Німецька й гігантська ангора не линяють, і їх стрижуть кожні 90
              діб цілий рік.
            </li>
            <li>
              Дослідження в Китаї (World Rabbit Science, 2019) показало, що
              оптимальний інтервал між збираннями 75 діб, коли довжина волокна
              досягала 55 мм.
            </li>
            <li>
              Найефективніше пух нарощується в перші 45 діб після стрижки.
            </li>
            <li>
              Приблизно на сотий день пух починає линяти й збиватись, і тоді
              зростає ризик вовняної пробки (див. сторінку «Вовняна пробка»).
            </li>
            <li>Пуху більше навесні й узимку, найменше влітку.</li>
          </ul>

          <div className="ag-tool">
            <div className="ag-tool-form">
              <label className="ag-field">
                <span>Дата останнього збору пуху</span>
                <input
                  type="date"
                  value={lastDate}
                  onChange={(e) => setLastDate(e.target.value)}
                  id="lastDate"
                  name="lastDate"
                />
              </label>
              <p className="ag-tool-hint">
                Оберіть дату, і побачите, коли настануть орієнтовні терміни. Це
                не вказівка, а підказка: орієнтуйтесь і на довжину пуху, і на
                стан тварини.
              </p>
            </div>
            <div className="ag-tool-result" aria-live="polite">
              {cycleOk && parsed ? (
                <>
                  <p className="ag-tool-days">
                    {days} <span>діб від останнього збору</span>
                  </p>
                  <div className="ag-bar" aria-hidden="true">
                    <div
                      className="ag-bar-fill"
                      style={{ width: `${barPercent}%` }}
                    />
                    <span className="ag-bar-mark ag-bar-mark--75">75</span>
                    <span className="ag-bar-mark ag-bar-mark--90">90</span>
                    <span className="ag-bar-mark ag-bar-mark--100">100</span>
                  </div>
                  <p className="ag-tool-status">{status}</p>
                  <ul className="ag-tool-dates">
                    <li>
                      <span>75 діб, оптимум за дослідженням</span>
                      <b>{fmtDate(addDays(parsed, 75))}</b>
                    </li>
                    <li>
                      <span>90 діб, типовий графік</span>
                      <b>{fmtDate(addDays(parsed, 90))}</b>
                    </li>
                    <li>
                      <span>100 діб, межа ризику</span>
                      <b>{fmtDate(addDays(parsed, 100))}</b>
                    </li>
                  </ul>
                </>
              ) : (
                <p className="ag-tool-note">
                  {futureDate
                    ? "Дата в майбутньому. Оберіть минулу дату."
                    : "Оберіть дату останнього збору."}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="ag-wrap ag-section" aria-label="Способи збору">
        <h2 className="ag-h2">Вищипування чи стрижка</h2>
        <div className="ag-table-wrap">
          <table className="ag-table">
            <thead>
              <tr>
                <th>Спосіб</th>
                <th>Кому підходить</th>
                <th>Плюси</th>
                <th>Мінуси</th>
              </tr>
            </thead>
            <tbody>
              {methods.map((m) => (
                <tr key={m.method}>
                  <td data-label="Спосіб">{m.method}</td>
                  <td data-label="Кому підходить">{m.fits}</td>
                  <td data-label="Плюси">{m.plus}</td>
                  <td data-label="Мінуси">{m.minus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="ag-note">
          Що вважається прийнятним для кролика, залежить і від правил
          благополуччя тварин: вищипувати пух, який кролик не линяє, не слід.
        </p>
      </section>

      <section className="ag-band" aria-label="Сорти пуху">
        <div className="ag-wrap">
          <h2 className="ag-h2">Сортування пуху за якістю</h2>
          <p className="ag-p">
            Сортуйте пух відразу після збору: так кожен клас піде за своєю ціною
            й на своє призначення. Якість визначають положення на тілі, довжина
            й чистота.
          </p>
          <div className="ag-grades">
            {grades.map((g, i) => (
              <article className="ag-grade" key={g.name}>
                <span className="ag-grade-num">{i + 1}</span>
                <h3 className="ag-grade-name">{g.name}</h3>
                <p className="ag-grade-where">{g.where}</p>
                <p className="ag-grade-look">{g.look}</p>
                <p className="ag-grade-use">Для чого: {g.use}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ag-wrap ag-section" aria-label="Від пуху до пряжі">
        <h2 className="ag-h2">Від пуху до пряжі: шість кроків</h2>
        <ol className="ag-steps">
          {spinSteps.map((s, i) => (
            <li className="ag-step" key={s.title}>
              <span className="ag-step-num">{i + 1}</span>
              <div>
                <h3 className="ag-step-title">{s.title}</h3>
                <p className="ag-step-text">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <aside className="ag-aside">
          <p>
            Валяння. Для валяного виробу чудово підходить пух другого класу. Але
            правило «сміття на вході, сміття на виході» діє й тут: якщо брати
            багато збитих клубків і дуже короткий пух, валяний виріб вийде
            грудкуватим і осипатиметься.
          </p>
        </aside>
      </section>

      <section className="ag-band ag-band--care" aria-label="Здоров'я">
        <div className="ag-wrap">
          <h2 className="ag-h2">Здоров'я кролів і якість пуху</h2>
          <ul className="ag-care">
            <li>
              Кролики ковтають пух, коли вилизують себе, тому головний ризик це
              вовняна пробка. Допомагає необмежений доступ до сіна, води й
              гранул із високим вмістом клітковини (радять щонайменше 13%).
              Докладно: сторінка «Вовняна пробка».
            </li>
            <li>
              Ознаки проблеми з травленням: апетит знижується, посліду стає
              менше. Не чекайте, а звертайтесь до ветеринара.
            </li>
            <li>
              Температура: для французьких ангор радять приблизно 10–24 °C. У
              спеку густа шерсть небезпечна, див. сторінки «Мікроклімат» і
              «Спека та тепловий удар».
            </li>
            <li>
              Особливу увагу приділіть кроликам після стрижки: без шерсті вони
              мерзнуть, тому під час холодів потрібне додаткове тепло.
            </li>
          </ul>
        </div>
      </section>

      <section
        className="ag-wrap ag-section"
        aria-label="Калькулятор виходу пуху"
      >
        <h2 className="ag-h2">Калькулятор виходу пуху й вартості</h2>
        <p className="ag-p">
          Введіть свої дані. Скільки пуху дає ваш кролик, покаже тільки
          зважування, тому цифр «за замовчуванням» тут немає. У полі кількості
          збирань уже стоїть 4: приблизно стільки виходить за графіком кожні 90
          діб. Дані нікуди не надсилаються.
        </p>
        <div className="ag-calc">
          <div className="ag-calc-form">
            <label className="ag-field">
              <span>Кількість кролів</span>
              <input
                type="text"
                inputMode="decimal"
                value={rabbits}
                onChange={(e) => setRabbits(e.target.value)}
                id="rabbits"
                name="rabbits"
              />
            </label>
            <label className="ag-field">
              <span>Пуху з кролика за одне збирання, г</span>
              <input
                type="text"
                inputMode="decimal"
                value={grams}
                onChange={(e) => setGrams(e.target.value)}
                id="grams"
                name="grams"
              />
            </label>
            <label className="ag-field">
              <span>Збирань на рік</span>
              <input
                type="text"
                inputMode="decimal"
                value={harvests}
                onChange={(e) => setHarvests(e.target.value)}
                id="harvests"
                name="harvests"
              />
            </label>
            <label className="ag-field">
              <span>Корм на 1 кролика за рік, грн</span>
              <input
                type="text"
                inputMode="decimal"
                value={feed}
                onChange={(e) => setFeed(e.target.value)}
                id="feed"
                name="feed"
              />
            </label>
            <label className="ag-field ag-field--wide">
              <span>
                Інші витрати на 1 кролика за рік, грн (ветеринарія, підстилка,
                енергія)
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={other}
                onChange={(e) => setOther(e.target.value)}
                id="other"
                name="other"
              />
            </label>
          </div>
          <div className="ag-skein" aria-live="polite">
            <p className="ag-skein-head">За рік</p>
            {yieldOk ? (
              <>
                <p className="ag-skein-value">{fmtNum(totalG / 1000)} кг</p>
                <p className="ag-skein-sub">пуху з усього поголів'я</p>
                <div className="ag-skein-row">
                  <span>Витрати на поголів'я</span>
                  <span>{fmtNum(totalCost)} грн</span>
                </div>
                <div className="ag-skein-row ag-skein-row--strong">
                  <span>Собівартість 100 г пуху</span>
                  <span>{fmtNum(per100)} грн</span>
                </div>
                <p className="ag-skein-note">
                  Це лише витрати корму й догляду без вашої праці. Працю на
                  вичісування врахуйте самі.
                </p>
              </>
            ) : (
              <p className="ag-skein-note">
                Введіть кількість кролів і вихід пуху за одне збирання.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="ag-band" aria-label="Етика">
        <div className="ag-wrap">
          <h2 className="ag-h2">Добробут і довіра покупців</h2>
          <p className="ag-p">
            Довкола ангорського пуху є суспільні суперечки. Організація FOUR
            PAWS, яка виступає проти утримання ангорських кролів, повідомляє, що
            близько 90% світового ангорського пуху походить з Китаю, і критикує
            такі практики, як вищипування. За її даними, низка відомих брендів
            відмовилася від ангори через проблеми добробуту.
          </p>
          <ul className="ag-ethics">
            <li>Збирайте пух лише у спосіб, який не завдає кролику болю.</li>
            <li>
              Не вищипуйте пух, який не линяє. Якщо з'являються лисини,
              переходьте на стрижку.
            </li>
            <li>
              Розкажіть покупцям, як ви утримуєте кролів і збираєте пух.
              Прозорість допомагає продажам.
            </li>
          </ul>
          <p className="ag-note">
            Останні два пункти це наші рекомендації, а не вимоги закону. Умови
            продажу пуху й виробів розглянемо на сторінці про легальний продаж
            крафтової продукції.
          </p>
        </div>
      </section>

      <section className="ag-wrap ag-section" aria-label="Типові помилки">
        <h2 className="ag-h2">Типові помилки й як їх виправити</h2>
        <div className="ag-mistakes">
          {mistakes.map((m) => (
            <div className="ag-mistake" key={m.wrong}>
              <p className="ag-mistake-wrong">{m.wrong}</p>
              <p className="ag-mistake-fix">{m.fix}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        className="ag-wrap ag-wrap--narrow ag-section"
        aria-label="Чек-лист"
      >
        <h2 className="ag-h2">Чек-лист перед стартом</h2>
        <p className="ag-p">
          Відмічайте готове. Готово: {doneCount} з {checklist.length}.
        </p>
        <ul className="ag-check">
          {checklist.map((c, i) => (
            <li key={c}>
              <label
                className={`ag-check-item${done[i] ? " ag-check-item--done" : ""}`}
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

      <div className="ag-wrap ag-section">
        <h3 className="ag-small-title">Читайте також</h3>
        <div className="ag-related">
          <Link to="/wool-block" className="ag-related-link">
            Вовняна пробка
          </Link>
          <Link to="/seasonal-molting" className="ag-related-link">
            Линька
          </Link>
          <Link to="/grooming" className="ag-related-link">
            Догляд
          </Link>
          <Link to="/microclimate" className="ag-related-link">
            Мікроклімат
          </Link>
          <Link to="/heat-stroke" className="ag-related-link">
            Спека та тепловий удар
          </Link>
          <Link to="/breeds" className="ag-related-link">
            Породи
          </Link>
          <Link to="/craft-fur" className="ag-related-link">
            Вичинка шкурок і хутряні вироби
          </Link>
        </div>
      </div>
    </div>
  );
}
