import { useState } from "react";
import { Link } from "react-router-dom";
import "./BreedingStockPricing.css";

interface Factor {
  title: string;
  text: string;
}

interface Tier {
  name: string;
  who: string;
  price: string;
  includes: string;
}

interface CostItem {
  title: string;
  text: string;
}

interface Step {
  title: string;
  text: string;
}

interface Phrase {
  q: string;
  a: string;
}

interface Mistake {
  wrong: string;
  fix: string;
}

const heroLede =
  "Ціна племінної тварини складається не з настрою, а з вартості вирощування, якості тварини, її документів і того, скільки за схожих тварин просять у вашому регіоні. Нижче: від чого залежить ціна, як порахувати власну собівартість, як дізнатися ринок, як пояснити ціну покупцеві і чим аванс відрізняється від завдатку.";

const factors: Factor[] = [
  {
    title: "Порода і напрям",
    text: "Різні породи й напрями (м'ясний, хутровий, декоративний) мають різний попит. Те, що цінне для розведення на м'ясо, може бути неважливим для покупця, який шукає домашнього улюбленця.",
  },
  {
    title: "Походження й родовід",
    text: "Задокументований родовід показує, від кого походить тварина. Заводчики вважають його одним із головних чинників ціни племінного молодняку: покупець платить за передбачуваність потомства.",
  },
  {
    title: "Якість тварини",
    text: "Відповідність типу породи, відсутність вад. Тварина зі спадковою вадою, за практикою заводчиків, іде як м'ясна або домашня, а не племінна.",
  },
  {
    title: "Здоров'я і ветеринарний огляд",
    text: "Огляд ветеринара, відомості про щеплення, чистота й охайність тварини підвищують довіру, а разом із нею й ціну, яку покупець готовий заплатити.",
  },
  {
    title: "Масть і рідкісність",
    text: "У деяких порід певні масті цінуються вище. Проте масть не повинна затьмарювати інші чинники: здоров'я, характер і тип.",
  },
  {
    title: "Результати й оцінка",
    text: "Виставкові результати, оцінка за системою оцінювання, продуктивність батьків (наприклад, приріст, плодючість, материнські якості).",
  },
  {
    title: "Репутація господарства",
    text: "Покупці охочіше платять там, де господарство відоме, відповідає після продажу і не обманює. Саме тому бренд і відгуки впливають на ціну.",
  },
  {
    title: "Регіон і попит",
    text: "Одна й та сама тварина в різних областях коштує по-різному. Ціна також залежить від пори року: попит на молодняк змінюється.",
  },
];

const tiers: Tier[] = [
  {
    name: "М'ясне й домашнє поголів'я",
    who: "Тварини без родоводу або зі спадковими вадами, які не підходять для племінної роботи.",
    price: "Найнижча ціна",
    includes:
      "Ціна ближче до вартості вирощування. Чесно вказуйте, що тварина не племінна.",
  },
  {
    name: "Племінне поголів'я",
    who: "Здорові тварини з родоводом, які можуть дати якісне потомство, якщо їх поєднати з підхожим партнером.",
    price: "Середня ціна",
    includes:
      "Ціна враховує вартість вирощування, документи й відбір. Опишіть, на чому грунтується оцінка.",
  },
  {
    name: "Перспективні для виставок",
    who: "Тварини без вад, у яких, на вашу думку, є шанси на виставці.",
    price: "Найвища ціна",
    includes:
      "Заводчики радять казати «перспективний», а не «виставковий»: результат на виставці ніхто не гарантує.",
  },
];

const costItems: CostItem[] = [
  {
    title: "Корм",
    text: "Найбільша стаття витрат. Для м'ясних кролів університетські джерела називають витрати на корм найбільшою частиною собівартості.",
  },
  {
    title: "Ветеринарія й щеплення",
    text: "Огляди, щеплення, ліки, якщо були потрібні. Рахуйте на одну тварину.",
  },
  {
    title: "Підстилка, вода, енергія",
    text: "Підстилка, електроенергія, опалення, вода: розділіть місячні витрати на кількість тварин.",
  },
  {
    title: "Ваша праця",
    text: "Навіть якщо ви не платите собі зарплату, час має ціну. Інакше ви продаватимете його безкоштовно.",
  },
  {
    title: "Клітки й обладнання",
    text: "Клітки зношуються. Розподіліть їхню вартість на кількість років служби й на кількість тварин.",
  },
  {
    title: "Втрати",
    text: "Не всі кроленята дорослішають: частина гине чи відбраковується. Їхні витрати лягають на тих, хто залишився.",
  },
  {
    title: "Маточне стадо",
    text: "Самка й самець теж їдять і потребують догляду. Розподіліть їхні витрати на всіх кроленят, яких вони дали за рік.",
  },
];

const marketSteps: Step[] = [
  {
    title: "Зберіть 10–15 оголошень",
    text: "Знайдіть оголошення про схожих тварин у вашому і сусідніх регіонах: така сама порода, схожий вік, подібні документи.",
  },
  {
    title: "Порівнюйте лише подібне",
    text: "Племінного кролика з родоводом не порівнюйте з тваринами без документів. Різниця в ціні це різниця в тому, що продається.",
  },
  {
    title: "Відкиньте крайні ціни",
    text: "Найвищі й найнижчі ціни часто випадкові: хтось сподівається на щасливого покупця, а хтось продає в поспіху. Дивіться на середину діапазону.",
  },
  {
    title: "Порівняйте зі своєю собівартістю",
    text: "Якщо ринкова ціна нижча за вашу собівартість, не знижуйте ціну до збитків. Спершу зменшіть витрати або змініть, що саме ви продаєте.",
  },
  {
    title: "Оновлюйте ціни щосезону",
    text: "Вартість кормів і попит змінюються. Перегляньте ціни хоча б раз на сезон і після суттєвих змін у витратах.",
  },
];

const phrases: Phrase[] = [
  {
    q: "Чому так дорого?",
    a: "Поясніть, що входить: родовід, ветеринарний огляд, відбір батьків, щеплення, ваша консультація після продажу.",
  },
  {
    q: "В іншого дешевше",
    a: "Запитайте, що саме продається за цю ціну: чи є родовід, чи оглянута тварина. Не сперечайтеся про чужі ціни, а покажіть свою якість.",
  },
  {
    q: "Можна знизити?",
    a: "Назвіть заздалегідь, чи є торг і до якої межі. Знижку краще пов'язати з умовою (купують двох або забирають одразу), а не просто з проханням.",
  },
  {
    q: "Чи можна взяти пізніше?",
    a: "Запропонуйте бронювання на письмових умовах, детальніше нижче. Не обіцяйте тварину на словах без жодної домовленості.",
  },
];

const mistakes: Mistake[] = [
  {
    wrong: "Ціна нижча за собівартість",
    fix: "Спершу порахуйте витрати (калькулятор вище). Дешевий продаж не збільшує вашого прибутку, а лише ваші збитки.",
  },
  {
    wrong: "Не враховувати втрати й маточне стадо",
    fix: "Додайте частку втрат і розподіл витрат на самку й самця. Інакше собівартість виходить заниженою.",
  },
  {
    wrong: "Копіювати чужу ціну",
    fix: "Чужа ціна відображає чужі витрати й іншу якість. Порівнюйте тварин, а не просто цифри.",
  },
  {
    wrong: "«Ціна договірна»",
    fix: "Оголошення без ціни відлякують покупців. Назвіть ціну й одразу скажіть, чи є торг.",
  },
  {
    wrong: "Обіцяти «виставковий» результат",
    fix: "Пишіть «перспективний для виставок». Гарантувати перемогу не можна, а перебільшення в оголошенні заборонене законом про рекламу.",
  },
  {
    wrong: "Не оновлювати ціну роками",
    fix: "Корми, енергія й попит змінюються. Раз на сезон перераховуйте собівартість і перевіряйте ринок.",
  },
];

const checklist: string[] = [
  "Порахована собівартість однієї тварини з урахуванням втрат",
  "Зібрані ціни схожих тварин у вашому регіоні",
  "Зрозуміло, до якого рівня належить тварина: м'ясна, племінна, перспективна",
  "Ціна не нижча за собівартість",
  "Є готова відповідь на питання «чому така ціна»",
  "Вирішено, чи є торг і до якої межі",
  "Умови бронювання записані письмово",
];

const toNumber = (value: string): number => {
  const parsed = parseFloat(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : NaN;
};

const money = (value: number): string =>
  value.toLocaleString("uk-UA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function BreedingStockPricing() {
  const [feedPrice, setFeedPrice] = useState("");
  const [fcr, setFcr] = useState("3");
  const [gain, setGain] = useState("2");
  const [other, setOther] = useState("");
  const [loss, setLoss] = useState("5");
  const [markup, setMarkup] = useState("30");
  const [done, setDone] = useState<boolean[]>(() => checklist.map(() => false));

  const feedPriceN = toNumber(feedPrice);
  const fcrN = toNumber(fcr);
  const gainN = toNumber(gain);
  const otherN = Number.isFinite(toNumber(other)) ? toNumber(other) : 0;
  const lossN = Number.isFinite(toNumber(loss)) ? toNumber(loss) : 0;
  const markupN = Number.isFinite(toNumber(markup)) ? toNumber(markup) : 0;

  const inputsOk =
    Number.isFinite(feedPriceN) &&
    Number.isFinite(fcrN) &&
    Number.isFinite(gainN) &&
    feedPriceN >= 0 &&
    fcrN > 0 &&
    gainN > 0 &&
    otherN >= 0 &&
    lossN >= 0 &&
    lossN < 100 &&
    markupN >= 0;

  const feedCost = inputsOk ? feedPriceN * fcrN * gainN : 0;
  const raisedCost = feedCost + otherN;
  const soldCost = inputsOk ? raisedCost / (1 - lossN / 100) : 0;
  const price = soldCost * (1 + markupN / 100);

  const toggle = (index: number) => {
    setDone((prev) => prev.map((v, i) => (i === index ? !v : v)));
  };
  const doneCount = done.filter(Boolean).length;

  return (
    <div className="pr-page">
      <header className="pr-hero">
        <div className="pr-hero-inner">
          <span className="pr-tag">Ціна</span>
          <h1 className="pr-title">Ціноутворення племінних тварин</h1>
          <p className="pr-sub">
            від чого залежить ціна і як пояснити її покупцеві
          </p>
          <p className="pr-lede">{heroLede}</p>
        </div>
      </header>

      <section
        className="pr-wrap pr-section"
        aria-label="Від чого залежить ціна"
      >
        <h2 className="pr-h2">Від чого залежить ціна</h2>
        <div className="pr-factors">
          {factors.map((f) => (
            <article className="pr-tagcard" key={f.title}>
              <h3 className="pr-tagcard-title">{f.title}</h3>
              <p className="pr-tagcard-text">{f.text}</p>
            </article>
          ))}
        </div>
        <p className="pr-note">
          Чинники ціни зібрані зі слів заводчиків і відкритих описів
          ціноутворення: єдиної «таблиці цін» для племінних кролів не існує, і
          ціна завжди залежить від вашого ринку.
        </p>
      </section>

      <section className="pr-band" aria-label="Три рівні тварин">
        <div className="pr-wrap">
          <h2 className="pr-h2">Три рівні тварин</h2>
          <p className="pr-p">
            Так тварин розділяють заводчики. Рівень визначає, що ви можете
            обіцяти покупцю і яку ціну просити.
          </p>
          <div className="pr-tiers">
            {tiers.map((t) => (
              <article className="pr-tier" key={t.name}>
                <p className="pr-tier-price">{t.price}</p>
                <h3 className="pr-tier-name">{t.name}</h3>
                <p className="pr-tier-who">{t.who}</p>
                <p className="pr-tier-inc">{t.includes}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pr-wrap pr-section" aria-label="Собівартість">
        <h2 className="pr-h2">З чого складається ваша собівартість</h2>
        <p className="pr-p">
          Собівартість це все, що ви витратили, щоб вирости одну тварину до
          продажу. Нижче цієї суми продавати немає сенсу.
        </p>
        <ul className="pr-costs">
          {costItems.map((c) => (
            <li className="pr-cost" key={c.title}>
              <h3 className="pr-cost-title">{c.title}</h3>
              <p className="pr-cost-text">{c.text}</p>
            </li>
          ))}
        </ul>
        <div className="pr-fcr">
          <h3 className="pr-fcr-title">
            Конверсія корму: скільки корму на 1 кг приросту
          </h3>
          <p>
            Конверсія корму показує, скільки кілограмів корму кролик з'їдає, щоб
            набрати 1 кг ваги. Чим вона менша, тим дешевше вам обходиться
            приріст. У дослідженнях для м'ясних кролів зустрічаються значення
            від близько 2,5 до 3 кг корму на 1 кг приросту, а в гірших умовах
            вони вищі. У вашому господарстві конверсія своя, тому рахуйте її за
            власними даними: скільки корму витратили і скільки ваги набрали
            тварини.
          </p>
        </div>
      </section>

      <section className="pr-band" aria-label="Калькулятор собівартості">
        <div className="pr-wrap">
          <h2 className="pr-h2">Калькулятор: собівартість і мінімальна ціна</h2>
          <p className="pr-p">
            Підставте свої цифри. Розрахунок спрощений, він показує порядок
            величин. Дані нікуди не надсилаються.
          </p>
          <div className="pr-calc">
            <div className="pr-calc-form">
              <label className="pr-field">
                <span>Ціна корму, грн за 1 кг</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={feedPrice}
                  onChange={(e) => setFeedPrice(e.target.value)}
                  id="feed-price-input"
                  name="feedPrice"
                />
              </label>
              <label className="pr-field">
                <span>Корму на 1 кг приросту, кг (конверсія)</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={fcr}
                  onChange={(e) => setFcr(e.target.value)}
                  id="fcr-input"
                  name="fcr"
                />
              </label>
              <label className="pr-field">
                <span>Приріст до продажу, кг (від відлучення)</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={gain}
                  onChange={(e) => setGain(e.target.value)}
                  id="gain-input"
                  name="gain"
                />
              </label>
              <label className="pr-field">
                <span>Інші витрати на 1 тварину, грн</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={other}
                  onChange={(e) => setOther(e.target.value)}
                  id="other-input"
                  name="other"
                />
              </label>
              <label className="pr-field">
                <span>Втрати за період, % тварин</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={loss}
                  onChange={(e) => setLoss(e.target.value)}
                  id="loss-input"
                  name="loss"
                />
              </label>
              <label className="pr-field">
                <span>Бажана націнка, %</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={markup}
                  onChange={(e) => setMarkup(e.target.value)}
                  id="markup-input"
                  name="markup"
                />
              </label>
              <p className="pr-calc-hint">
                До «інших витрат» входять ветеринарія, підстилка, енергія,
                праця, частка клітки та частка витрат на маточне стадо.
                Початкові значення конверсії, приросту, втрат і націнки це лише
                приклад, замініть їх своїми.
              </p>
            </div>
            <div className="pr-receipt" aria-live="polite">
              <p className="pr-receipt-head">Розрахунок</p>
              {inputsOk ? (
                <>
                  <div className="pr-receipt-row">
                    <span>Корм на 1 тварину</span>
                    <span>{money(feedCost)} грн</span>
                  </div>
                  <div className="pr-receipt-row">
                    <span>Корм + інші витрати</span>
                    <span>{money(raisedCost)} грн</span>
                  </div>
                  <div className="pr-receipt-row pr-receipt-row--strong">
                    <span>Собівартість з урахуванням втрат</span>
                    <span>{money(soldCost)} грн</span>
                  </div>
                  <div className="pr-receipt-total">
                    <span>Ціна з націнкою</span>
                    <span>{money(price)} грн</span>
                  </div>
                  <p className="pr-receipt-note">
                    Нижче {money(soldCost)} грн продавати означає збитки. Далі
                    порівняйте цей результат із ціною на ринку.
                  </p>
                </>
              ) : (
                <p className="pr-receipt-note">
                  Введіть ціну корму. Конверсія й приріст мають бути більшими за
                  нуль, втрати менші за 100%.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="pr-wrap pr-section" aria-label="Як дізнатися ринок">
        <h2 className="pr-h2">Як дізнатися ціну на ринку</h2>
        <ol className="pr-steps">
          {marketSteps.map((s, i) => (
            <li className="pr-step" key={s.title}>
              <span className="pr-step-num">{i + 1}</span>
              <div>
                <h3 className="pr-step-title">{s.title}</h3>
                <p className="pr-step-text">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="pr-band" aria-label="Пояснення ціни покупцеві">
        <div className="pr-wrap">
          <h2 className="pr-h2">Як пояснити ціну покупцеві</h2>
          <div className="pr-phrases">
            {phrases.map((p) => (
              <div className="pr-phrase" key={p.q}>
                <p className="pr-phrase-q">{p.q}</p>
                <p className="pr-phrase-a">{p.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="pr-wrap pr-section"
        aria-label="Бронювання: аванс і завдаток"
      >
        <h2 className="pr-h2">Бронювання: аванс чи завдаток</h2>
        <p className="pr-p">
          Коли покупець хоче закріпити тварину за собою й заплатити частину
          грошей наперед, ці гроші юридично можуть бути авансом або завдатком.
          Це різні речі.
        </p>
        <div className="pr-deposit">
          <div className="pr-deposit-col">
            <h3 className="pr-deposit-title">Аванс</h3>
            <p>
              Це лише спосіб оплати, попередня оплата. Якщо угода не відбулася,
              аванс повертається покупцеві.
            </p>
          </div>
          <div className="pr-deposit-col">
            <h3 className="pr-deposit-title">Завдаток</h3>
            <p>
              Це сума, яку покупець віддає в рахунок платежів за договором, щоб
              підтвердити зобов'язання й забезпечити його виконання. Якщо
              порушення сталося з вини того, хто дав завдаток, він залишається в
              одержувача. Якщо з вини того, хто його отримав, він повертає
              завдаток і додатково сплачує таку саму суму.
            </p>
          </div>
        </div>
        <ul className="pr-deposit-notes">
          <li>
            У разі сумніву щодо того, чим є сума, її вважають авансом, якщо
            прямо не вказано, що це завдаток (ч. 2 ст. 570 ЦК).
          </li>
          <li>
            Суди визнавали завдаток авансом, коли договір, на виконання якого
            передали гроші, не був укладений, а в розписці лише стояло слово
            «завдаток».
          </li>
          <li>
            Тому для бронювання складіть письмову домовленість: хто, яку
            тварину, за яку ціну, який строк, яка сума внесена і чи це завдаток,
            чи аванс.
          </li>
        </ul>
        <p className="pr-note">
          Це довідкова інформація. Для дорогих племінних тварин порадьтеся з
          юристом, коли складаєте договір.
        </p>
      </section>

      <section className="pr-band" aria-label="Типові помилки">
        <div className="pr-wrap">
          <h2 className="pr-h2">Типові помилки й як їх виправити</h2>
          <div className="pr-mistakes">
            {mistakes.map((m) => (
              <div className="pr-mistake" key={m.wrong}>
                <p className="pr-mistake-wrong">{m.wrong}</p>
                <p className="pr-mistake-fix">{m.fix}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="pr-wrap pr-wrap--narrow pr-section"
        aria-label="Чек-лист"
      >
        <h2 className="pr-h2">Перш ніж назвати ціну</h2>
        <p className="pr-p">
          Відмічайте готове. Готово: {doneCount} з {checklist.length}.
        </p>
        <ul className="pr-check">
          {checklist.map((c, i) => (
            <li key={c}>
              <label
                className={`pr-check-item${done[i] ? " pr-check-item--done" : ""}`}
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

      <div className="pr-wrap pr-section">
        <h3 className="pr-small-title">Читайте також</h3>
        <div className="pr-related">
          <Link to="/sale-listings" className="pr-related-link">
            Оголошення про продаж
          </Link>
          <Link to="/farm-brand" className="pr-related-link">
            Бренд господарства
          </Link>
          <Link to="/animal-photo-video" className="pr-related-link">
            Фото і відео тварин для продажу
          </Link>
          <Link to="/selection" className="pr-related-link">
            Селекція
          </Link>
        </div>
      </div>

      <footer className="pr-footer">
        <p>
          Відомості про аванс і завдаток перевірено за судовою практикою й
          профільними юридичними виданнями, а про конверсію корму та чинники
          ціни за науковими працями й описами заводчиків, станом на 13 листопада
          2026 року. Закони й ринкові ціни змінюються. Це довідкова інформація,
          а не юридична чи бухгалтерська консультація.
        </p>
      </footer>
    </div>
  );
}
