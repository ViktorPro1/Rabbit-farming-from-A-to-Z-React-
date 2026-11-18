import { useState } from "react";
import { Link } from "react-router-dom";
import "./CraftFur.css";

interface Chip {
  title: string;
  text: string;
}

interface Step {
  title: string;
  text: string;
  tip: string;
}

interface MethodRow {
  source: string;
  solution: string;
  time: string;
}

interface Level {
  name: string;
  items: string;
  note: string;
}

interface Mistake {
  wrong: string;
  fix: string;
}

const heroLede =
  "Кролячі шкурки це побічний продукт господарства, але з них виходять цілком гідні речі: шапки, рукавиці, оздоблення, сувеніри. Нижче: коли шкурка справді готова, які етапи проходить сировина від очищення до м'якої вичиненої шкірки, чим відрізняються описані в джерелах способи дублення, як шити з тонкого кролячого хутра й коли краще віддати шкурки на вичинку майстрам.";

const chips: Chip[] = [
  {
    title: "Взимку",
    text: "найкраща якість шкіри за дослідженням",
  },
  {
    title: "Біла мездра",
    text: "ознака, що хутро доспіло",
  },
  {
    title: "Пробна шкурка",
    text: "спершу практика, потім усі інші",
  },
];

const readyList: string[] = [
  "Волосся повністю виросло й міцно тримається в шкірі.",
  "Мездра (внутрішній бік шкурки) світла: від білої до кремової. У хутровій справі таку шкурку називають «білою».",
  "Шерсть густа й однаково довга по всій спині.",
  "Шкурка знята в холодну пору: у дослідженні на кролях породи рекс шкіра від забою взимку була найкращою.",
  "Шкурка достатньо велика, а шерсть дозріла: це головна умова якісної шкурки за оцінкою ФАО.",
];

const notReadyList: string[] = [
  "Кролик у линьці: і молодняк, і дорослі. ФАО називає линьку найкритичнішим моментом для якості шкурок.",
  "Мездра з темними плямами, від синюватих до майже чорних. У хутровій справі їх називають «блакитними»: волосся ще росте.",
  "Хутро легко відпадає, якщо торкатися шкурки: з такою сировиною якісний виріб не вийде.",
  "Швидка перевірка за порадами кролівників: розсуньте шерсть на спині живого кролика. У линьці шкіра виглядає нерівною, ніби плямистою.",
];

const steps: Step[] = [
  {
    title: "Знімання й первинна обробка",
    text: "Докладно про те, як зняти шкурку й очистити її, читайте на сторінці «Шкура та пух». Тут ми починаємо з уже знятої шкурки.",
    tip: "Не кладіть у роботу шкурки хворих тварин (див. «Стригучий лишай»).",
  },
  {
    title: "Консервування й сушіння",
    text: "Шкурку присипають сухою грубою сіллю з боку мездри й сушать у затінку, подалі від прямого сонця й тепла: від нагріву шкіра твердне. Засолену й висушену шкурку можна зберігати або дубити. Для довшого зберігання її солять ще раз. Заморожена шкурка зберігається приблизно до року.",
    tip: "Ніколи не сушіть біля печі чи на сонці.",
  },
  {
    title: "Відмочування й очищення",
    text: "Суху чи засолену шкурку відмочують у чистій прохолодній воді, кілька разів змінюючи її. Довго не тримайте: приблизно через 3 години волосся може почати випадати.",
    tip: "Не залишайте шкурку у воді «на ніч».",
  },
  {
    title: "Мездріння",
    text: "З мездри знімають залишки м'язів і жиру, не прорізаючи справжньої шкіри й не оголюючи коренів волосся. Кролячі шкурки дуже тонкі й легко рвуться, тому шкурку кріплять до дошки шкірою догори, натягуючи її рівно, але не надто сильно.",
    tip: "Працюйте тупим скребком чи краєм ножа.",
  },
  {
    title: "Знежирення й пом'якшення",
    text: "Бура або харчова сода (близько 7,5 г на літр води) допомагає пом'якшити шкіру, а трохи миючого засобу допомагає прибрати жир.",
    tip: "Після цього ретельно промийте шкурку чистою водою.",
  },
  {
    title: "Дублення",
    text: "Найдешевший і найпоширеніший домашній спосіб це дублення сіллю та квасцями. Він дає шкірку, яка розтягується й зберігає гнучкість, але вона часто виходить жорсткою й потребує розробки, а іноді й повторного дублення. Шкурку повністю занурюють у розчин у неметалевій посудині й час від часу помішують. Посудину накривають і ставлять так, щоб діти й тварини не дістали.",
    tip: "Рецепти й час у різних джерелах відрізняються (див. таблицю нижче), тому почніть з однієї пробної шкурки.",
  },
  {
    title: "Промивання",
    text: "Після дублення шкурку промивають. У деяких методиках її додатково споліскують слабким розчином бури чи соди (близько 7,5 г на літр води), а потім ще раз чистою водою.",
    tip: "Воду не вичавлюйте скручуванням: шкурку лише стискають.",
  },
  {
    title: "Розтягування, сушіння й розробка",
    text: "Шкурку стискають, розтягують в усі боки, дають частково підсохнути й розробляють руками, поки вона не стане м'якою. Шорсткі місця можна пройти грубою наждачкою, а тонкий шар жиру або гліцерину додає пластичності. Зберігайте шкурки шкірою до шкіри й волоссям до волосся, щоб жир не потрапив на хутро.",
    tip: "Копчення (близько 30 хвилин) за бажанням, воно змінює колір шкурки.",
  },
];

const methodRows: MethodRow[] = [
  {
    source: "Університет штату Нью-Мексико, керівництво L-103",
    solution:
      "1 фунт (близько 450 г) квасців на галон (3,8 л) води, окремо 4 унції (близько 113 г) соди й 8 унцій (близько 227 г) солі на пів галона води; розчини змішують",
    time: "2 доби для кролячої шкурки",
  },
  {
    source: "Університет штату Міссісіпі, служба Extension",
    solution:
      "Солоно-квасцевий розчин (квасці, сода, сіль); цієї кількості вистачає на 3–4 кролячі шкурки",
    time: "2–4 доби",
  },
  {
    source: "Mother Earth News, практика кролівника",
    solution:
      "2 галони (близько 7,5 л) води, по склянці солі без йоду й квасців; у другій ванні додають ще по склянці",
    time: "перша ванна 2–7 діб, друга 7–14 діб",
  },
];

const levels: Level[] = [
  {
    name: "Легко",
    items: "Брелоки, іграшки, помпони, оздоблення для рукавичок",
    note: "Малі деталі й мало швів. Підходять навіть для невеликих чи не ідеальних шкурок.",
  },
  {
    name: "Середньо",
    items: "Рукавиці, комір, манжети, пов'язка на голову",
    note: "Рівні форми, але потрібні розкрій за лекалом і акуратний шов.",
  },
  {
    name: "Складно",
    items: "Шапка, жилет, накидка, плед",
    note: "Багато шкурок однакової якості, підбір за кольором і довжиною, довге шиття.",
  },
];

const sewingTips: string[] = [
  "Розмітку роблять крейдою чи маркером з боку шкіри, а не хутра.",
  "Розкроюйте лезом або кушнірським ножем з боку шкіри, щоб різати лише шкіру й не зрізати волосся.",
  "Для ручного шиття потрібні голка для шкіри чи кушнірська голка й вощена нитка або міцна нитка.",
  "Шийте перекидним швом (через край): шкурки складають хутром усередину, щоб шов був прихований. Починайте від середини до країв.",
  "Тримайте стібки на шкірі, а не на хутрі. Робити їх занадто частими не слід: шкіра може порватися по проколах.",
  "Швейна машинка підійде лише для кролячих шкурок зі спеціальною голкою для шкіри (номери з 16 по 19).",
  "Слідкуйте за напрямком ворсу: на всій речі він має йти в один бік.",
  "Після шиття вивертайте виріб і голкою розправляйте волоски, які потрапили в шви.",
];

const mistakes: Mistake[] = [
  {
    wrong: "Знімати шкурки під час линьки",
    fix: "Перевіряйте мездру. Дочекайтеся, поки вона стане світлою, а хутро доспіє.",
  },
  {
    wrong: "Довго відмочувати шкурку",
    fix: "Тримайте у воді близько 3 годин, інакше волосся почне випадати.",
  },
  {
    wrong: "Прорізати шкіру при мездрінні",
    fix: "Працюйте тупим скребком і обережно: кролячі шкурки дуже тонкі.",
  },
  {
    wrong: "Сушити біля печі чи на сонці",
    fix: "Сушіть у затінку, без прямого тепла, щоб шкіра не затверділа.",
  },
  {
    wrong: "Дубити одразу багато шкурок",
    fix: "Спершу одна пробна шкурка. Жодна формула не гарантує результату, потрібна практика.",
  },
  {
    wrong: "Шити звичайною голкою і тонкою ниткою",
    fix: "Використовуйте голку для шкіри та міцну нитку, інакше нитка порве шкірку.",
  },
];

const checklist: string[] = [
  "Шкурка знята не під час линьки, мездра світла",
  "Шкурка засолена, висушена в затінку без прямого тепла",
  "Не відмочували довше ніж приблизно 3 години",
  "Мездріння зроблено без прорізів, шкіра ціла",
  "Для дублення обрано неметалеву посудину з кришкою",
  "Посудина з розчином недоступна дітям і тваринам",
  "Перша партія — одна пробна шкурка",
  "Для шиття підготовлено голку для шкіри та міцну нитку",
];

const toNumber = (value: string): number => {
  const parsed = parseFloat(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : NaN;
};

export default function CraftFur() {
  const [pelt, setPelt] = useState("");
  const [item, setItem] = useState("");
  const [waste, setWaste] = useState("");
  const [done, setDone] = useState<boolean[]>(() => checklist.map(() => false));

  const peltN = toNumber(pelt);
  const itemN = toNumber(item);
  const wasteN = Number.isFinite(toNumber(waste)) ? toNumber(waste) : 0;

  const calcOk =
    Number.isFinite(peltN) &&
    peltN > 0 &&
    Number.isFinite(itemN) &&
    itemN > 0 &&
    wasteN >= 0;

  const withoutWaste = calcOk ? Math.ceil(itemN / peltN) : 0;
  const withWaste = calcOk
    ? Math.ceil((itemN * (1 + wasteN / 100)) / peltN)
    : 0;

  const toggle = (index: number) => {
    setDone((prev) => prev.map((v, i) => (i === index ? !v : v)));
  };
  const doneCount = done.filter(Boolean).length;

  return (
    <div className="cf-page">
      <header className="cf-hero">
        <div className="cf-hero-inner">
          <p className="cf-kicker">Крафтове виробництво</p>
          <h1 className="cf-title">Вичинка шкурок і хутряні вироби</h1>
          <p className="cf-lede">{heroLede}</p>
          <ul className="cf-chips" aria-label="Три головні поради">
            {chips.map((c) => (
              <li key={c.title}>
                <span className="cf-chip-title">{c.title}</span>
                <span className="cf-chip-text">{c.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <section className="cf-wrap cf-section" aria-label="Коли шкурка готова">
        <h2 className="cf-h2">Коли шкурка готова до вичинки</h2>
        <p className="cf-p">
          Якість вичиненої шкірки починається ще до дублення. Шкурка від
          кролика, у якого хутро ще не доспіло, дає пухке волосся, яке
          осипається. Ці ознаки взято з хутрової оцінки; для кролів це орієнтир,
          а не стандарт.
        </p>
        <div className="cf-compare">
          <div className="cf-compare-col cf-compare-col--good">
            <h3 className="cf-compare-title">Хутро готове</h3>
            <ul>
              {readyList.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
          <div className="cf-compare-col cf-compare-col--bad">
            <h3 className="cf-compare-title">Хутро не готове</h3>
            <ul>
              {notReadyList.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
        <aside className="cf-aside">
          <p>
            Чесно про економіку: шкурка для господарства це побічний продукт. За
            даними ФАО, сира шкура становить лише невелику частку вартості
            тварини. Зате виріб із хутра коштує значно більше за саму шкурку.
            Тому вичинка має сенс, якщо ви готові вкласти час і зробити річ, а
            не продавати шкурки як є.
          </p>
        </aside>
      </section>

      <section className="cf-band" aria-label="Етапи вичинки">
        <div className="cf-wrap">
          <h2 className="cf-h2">Від шкурки до м'якої шкірки: вісім етапів</h2>
          <ol className="cf-steps">
            {steps.map((s, i) => (
              <li className="cf-step" key={s.title}>
                <span className="cf-step-num">{i + 1}</span>
                <div className="cf-step-body">
                  <h3 className="cf-step-title">{s.title}</h3>
                  <p className="cf-step-text">{s.text}</p>
                  <p className="cf-step-tip">{s.tip}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="cf-wrap cf-section" aria-label="Способи дублення">
        <h2 className="cf-h2">Чим відрізняються описані способи дублення</h2>
        <p className="cf-p">
          Єдиного «правильного» рецепту немає. Джерела називають різні склади й
          різний час. Нижче три приклади: порівняйте їх і почніть з пробної
          шкурки. Мірки подано в метричних одиницях приблизно, переведено з
          американських.
        </p>
        <div className="cf-table-wrap">
          <table className="cf-table">
            <thead>
              <tr>
                <th>Джерело</th>
                <th>Розчин</th>
                <th>Час дублення</th>
              </tr>
            </thead>
            <tbody>
              {methodRows.map((m) => (
                <tr key={m.source}>
                  <td data-label="Джерело">{m.source}</td>
                  <td data-label="Розчин">{m.solution}</td>
                  <td data-label="Час">{m.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="cf-note">
          Якщо хочете м'якшу шкірку для виробу, університетська служба Extension
          штату Юта зазначає, що зазвичай дешевше й простіше віддати шкурки на
          професійне дублення. Це називають дубленням «для пошиття».
        </p>
      </section>

      <section className="cf-band cf-band--warn" aria-label="Безпека">
        <div className="cf-wrap">
          <h2 className="cf-h2">Безпека під час вичинки</h2>
          <ul className="cf-safety">
            <li>
              Працюйте в рукавичках і в провітрюваному місці, а посудину з
              розчином накривайте й тримайте подалі від дітей і тварин.
            </li>
            <li>
              Для дублення використовуйте посуд, який більше не буде харчовим, і
              не виливайте відпрацьований розчин у водойми.
            </li>
            <li>
              Не беріть у роботу шкурки хворих тварин. Стригучий лишай, який
              поширюється й на людей, описано на сторінках «Стригучий лишай» і
              «Зоонози».
            </li>
            <li>
              Метод із кислотою в джерелах є, але вдома він небезпечніший. Для
              першої спроби обирайте дублення сіллю та квасцями.
            </li>
          </ul>
          <p className="cf-note">
            Ці правила безпеки це наші рекомендації, а не вимоги закону.
          </p>
        </div>
      </section>

      <section className="cf-wrap cf-section" aria-label="Що шити">
        <h2 className="cf-h2">Що шити: від простого до складного</h2>
        <p className="cf-p">
          Розподіл за складністю це наша оцінка. Починайте з простого: хутро
          кролика тонке, і для кожного нового виробу потрібен досвід.
        </p>
        <div className="cf-levels">
          {levels.map((l) => (
            <article className="cf-level" key={l.name}>
              <h3 className="cf-level-name">{l.name}</h3>
              <p className="cf-level-items">{l.items}</p>
              <p className="cf-level-note">{l.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cf-band" aria-label="Калькулятор шкурок">
        <div className="cf-wrap">
          <h2 className="cf-h2">Скільки шкурок потрібно на виріб</h2>
          <p className="cf-p">
            Виміряйте корисну площу однієї вичиненої шкурки (без дірок і тонких
            місць) і площу деталей виробу за лекалом. Запас на розкрій і дефекти
            визначте з пробного розкрою: універсальної цифри немає. Дані нікуди
            не надсилаються.
          </p>
          <div className="cf-calc">
            <div className="cf-calc-form">
              <label className="cf-field">
                <span>Корисна площа однієї шкурки, дм²</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={pelt}
                  onChange={(e) => setPelt(e.target.value)}
                  id="pelt-input"
                  name="pelt-input"
                />
              </label>
              <label className="cf-field">
                <span>Площа всіх деталей виробу, дм²</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                  id="item-input"
                  name="item-input"
                />
              </label>
              <label className="cf-field cf-field--wide">
                <span>Запас на відходи, % (за пробним розкроєм)</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={waste}
                  onChange={(e) => setWaste(e.target.value)}
                  id="waste-input"
                  name="waste-input"
                />
              </label>
            </div>
            <div className="cf-tape" aria-live="polite">
              <p className="cf-tape-head">Потрібно шкурок</p>
              {calcOk ? (
                <>
                  <p className="cf-tape-value">{withWaste}</p>
                  <p className="cf-tape-sub">
                    без запасу вистачило б {withoutWaste}
                  </p>
                </>
              ) : (
                <p className="cf-tape-sub">
                  Введіть площу шкурки й площу деталей.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="cf-wrap cf-section" aria-label="Шиття">
        <h2 className="cf-h2">Розкрій і шиття: вісім правил</h2>
        <ol className="cf-sew">
          {sewingTips.map((t, i) => (
            <li key={t}>
              <span className="cf-sew-num">{i + 1}</span>
              <span>{t}</span>
            </li>
          ))}
        </ol>
        <p className="cf-note">
          Умови продажу готових виробів і ветеринарні вимоги до сировини
          розглянемо окремо на сторінці про легальний продаж крафтової
          продукції.
        </p>
      </section>

      <section className="cf-band" aria-label="Типові помилки">
        <div className="cf-wrap">
          <h2 className="cf-h2">Типові помилки й як їх виправити</h2>
          <div className="cf-mistakes">
            {mistakes.map((m) => (
              <div className="cf-mistake" key={m.wrong}>
                <p className="cf-mistake-wrong">{m.wrong}</p>
                <p className="cf-mistake-fix">{m.fix}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="cf-wrap cf-wrap--narrow cf-section"
        aria-label="Чек-лист"
      >
        <h2 className="cf-h2">Чек-лист перед першою шкуркою</h2>
        <p className="cf-p">
          Відмічайте готове. Готово: {doneCount} з {checklist.length}.
        </p>
        <ul className="cf-check">
          {checklist.map((c, i) => (
            <li key={c}>
              <label
                className={`cf-check-item${done[i] ? " cf-check-item--done" : ""}`}
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

      <div className="cf-wrap cf-section">
        <h3 className="cf-small-title">Читайте також</h3>
        <div className="cf-related">
          <Link to="/fur-processing" className="cf-related-link">
            Шкура та пух
          </Link>
          <Link to="/slaughter" className="cf-related-link">
            Забій та переробка
          </Link>
          <Link to="/seasonal-molting" className="cf-related-link">
            Линька
          </Link>
          <Link to="/ringworm" className="cf-related-link">
            Стригучий лишай
          </Link>
          <Link to="/zoonoses" className="cf-related-link">
            Зоонози
          </Link>
          <Link to="/craft-meat" className="cf-related-link">
            Крафтові м'ясні вироби
          </Link>
        </div>
      </div>
    </div>
  );
}
