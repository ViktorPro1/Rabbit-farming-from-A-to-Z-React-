import { useState } from "react";
import { Link } from "react-router-dom";
import "./CraftSelling.css";

interface Chip {
  title: string;
  text: string;
}

interface GroupRow {
  group: string;
  allowed: string;
  fits: string;
}

interface Product {
  id: string;
  label: string;
  needs: string[];
}

interface Channel {
  id: string;
  label: string;
  needs: string[];
}

interface Card {
  title: string;
  text: string;
}

interface Mistake {
  wrong: string;
  fix: string;
}

interface LabelData {
  name: string;
  ingredients: string;
  allergens: string;
  mass: string;
  date: string;
  storage: string;
  producer: string;
  origin: string;
}

const heroLede =
  "Продавати власні вироби можна, але спершу треба знати правила: який у вас має бути статус, що написати на етикетці, де продавати й що робити, коли покупець хоче повернути товар. Нижче: статус продавця, конструктор етикетки для харчового продукту, підказка, що саме потрібно для вашого виробу й місця продажу, та правила дистанційної торгівлі.";

const chips: Chip[] = [
  {
    title: "ФОП, група 2 або 3",
    text: "для виробництва й продажу власних виробів",
  },
  {
    title: "Склад і виробник",
    text: "обов'язкова інформація про товар",
  },
  {
    title: "14 днів",
    text: "на повернення непродовольчого товару належної якості",
  },
];

const groupRows: GroupRow[] = [
  {
    group: "Група 1",
    allowed:
      "Роздрібний продаж товарів із торговельних місць на ринках та/або побутові послуги населенню.",
    fits: "Виробництво власних виробів у цій групі не передбачене. Підходить, якщо ви лише перепродуєте на ринку.",
  },
  {
    group: "Група 2",
    allowed:
      "Послуги (зокрема побутові) платникам єдиного податку та/або населенню, виробництво та/або продаж товарів, ресторанне господарство. Одночасно не більше 10 найманих працівників.",
    fits: "Підходить для виробництва й продажу власних виробів. Уточніть, кому саме можна продавати.",
  },
  {
    group: "Група 3",
    allowed: "Усі види діяльності, які не заборонені на єдиному податку.",
    fits: "Гнучкіша за видами діяльності, але має власні умови й ставки.",
  },
];

const labelRequired: string[] = [
  "Назва продукту разом із фізичним станом, наприклад «ковбаса варена» чи «копчена».",
  "Перелік інгредієнтів у порядку зменшення їхньої маси.",
  "Алергени (наприклад, селера, яйця, молоко, горіхи) в переліку інгредієнтів чітко виділені шрифтом, стилем, кольором або фоном.",
  "Кількість продукту у встановлених одиницях виміру.",
  "Мінімальний термін придатності або дата «спожити до».",
  "Особливі умови зберігання або використання.",
  "Найменування й місцезнаходження оператора ринку, який відповідає за інформацію про продукт.",
  "Країна або місце походження для м'яса.",
  "Інструкція з використання, якщо без неї продукт важко використовувати правильно.",
  "Інформація про поживну цінність.",
];

const labelRules: string[] = [
  "Інформація має бути державною мовою, а переклад іншою мовою за бажанням.",
  "Шрифт чіткий, розбірливий і контрастний. Висота малих літер не менша за 1,2 мм, а на упаковці площею менше 80 см² не менша за 0,9 мм.",
  "Інформація має бути точною й зрозумілою, не вводити в оману й не приписувати продуктам лікувальних властивостей.",
  "Для нефасованого продукту (на вагу) ту саму інформацію надають на вимогу покупця.",
];

const textileCards: Card[] = [
  {
    title: "Трикотаж, одяг, текстиль",
    text: "Текстильні вироби підпадають під технічний регламент назв текстильних волокон і маркування (наказ Мінекономіки від 28.07.2020 № 1408), а нагляд здійснює Держпродспоживслужба. Покупець має бачити склад матеріалу у відсотках для кожного волокна, назву й адресу виробника, розмір і країну походження.",
  },
  {
    title: "Пряжа й сирий пух",
    text: "Для пряжі й сирого пуху радимо вказувати склад (наприклад, відсоток ангори й вовни), довжину волокна, вагу, клас і походження: це чесна інформація, яка допомагає покупцеві й захищає вас від претензій. Щодо вимог технічного регламенту до пряжі й до сирого пуху уточніть у територіальному органі Держпродспоживслужби.",
  },
  {
    title: "Хутряні вироби й шкурки",
    text: "Окремих правил маркування саме для кролячих хутряних виробів ми у відкритих джерелах не знайшли. Діють загальні вимоги до інформації про товар: виробник, матеріал, розмір, догляд. Ветеринарні вимоги до шкурок як сировини також уточніть у територіальному органі Держпродспоживслужби.",
  },
];

const products: Product[] = [
  {
    id: "meat",
    label: "М'ясні вироби",
    needs: [
      "Статус оператора ринку харчових продуктів і державна реєстрація потужності або експлуатаційний дозвіл (див. сторінку про крафтові м'ясні вироби).",
      "Етикетка з обов'язковою інформацією (конструктор вище).",
      "Сировина, яка пройшла ветеринарно-санітарний контроль.",
      "Харчові продукти обміну й поверненню не підлягають.",
    ],
  },
  {
    id: "fiber",
    label: "Ангорський пух і пряжа",
    needs: [
      "Чесний опис: клас пуху, довжина волокна, вага, склад пряжі у відсотках.",
      "Вимоги технічного регламенту текстильних виробів до пряжі уточніть у Держпродспоживслужбі.",
      "Ветеринарні вимоги до сирого пуху уточніть у територіальному органі Держпродспоживслужби: чітких вимог ми не знайшли.",
    ],
  },
  {
    id: "knit",
    label: "Трикотаж і валяні вироби",
    needs: [
      "Склад у відсотках для кожного волокна, назва й адреса виробника, розмір, країна походження.",
      "Непродовольчий товар належної якості покупець може повернути протягом 14 днів, якщо ви продавець-підприємець.",
    ],
  },
  {
    id: "fur",
    label: "Хутряні вироби",
    needs: [
      "Окремих правил маркування для кролячого хутра ми не знайшли: вказуйте виробника, матеріал, розмір і догляд.",
      "Ветеринарні вимоги до шкурок як сировини уточніть у територіальному органі Держпродспоживслужби.",
      "Непродовольчий товар належної якості покупець може повернути протягом 14 днів, якщо ви продавець-підприємець.",
    ],
  },
];

const channels: Channel[] = [
  {
    id: "market",
    label: "Агропродовольчий ринок",
    needs: [
      "Харчові продукти продають лише з підтвердженням придатності за результатами досліджень державної лабораторії ветеринарно-санітарної експертизи на ринку.",
      "М'ясні, рибні, молочні, плодоовочеві консерви домашнього виготовлення на ринку продавати заборонено.",
      "ФОП групи 1 може продавати з торговельних місць на ринках, але вироби власного виготовлення потребують групи 2 чи 3.",
    ],
  },
  {
    id: "fair",
    label: "Ярмарок чи ремісничий захід",
    needs: [
      "До виробів і статусу продавця ті самі вимоги, що й в інших місцях.",
      "Окремо уточніть правила організатора: чи потрібен дозвіл і чи є додаткові вимоги до харчових продуктів.",
    ],
  },
  {
    id: "online",
    label: "Інтернет: сайт, Telegram, Instagram",
    needs: [
      "Перед договором на відстані надайте покупцеві інформацію: своє найменування, місцезнаходження й порядок прийняття претензій; основні характеристики виробу; ціну разом із доставкою й умови оплати; гарантійні зобов'язання; умови доставки; порядок розірвання договору.",
      "Електронний договір, укладений через інформаційні системи, вважається укладеним письмово.",
    ],
  },
  {
    id: "hand",
    label: "З рук, знайомим",
    needs: [
      "Регулярний продаж із метою прибутку може вважатися підприємницькою діяльністю, навіть якщо ви продаєте лише знайомим.",
      "Вимоги до безпеки продукту й до інформації про нього діють і тут.",
    ],
  },
];

const commonNeeds: string[] = [
  "Не вводьте покупця в оману: неточні, неповні чи перебільшені відомості в рекламі та на етикетці заборонені.",
  "Зберігайте записи: партії, дати, ціни, кому продали.",
  "Порядок розрахунків і касових операцій залежить від вашої групи та обсягів, уточніть у податковій.",
];

const platformCards: Card[] = [
  {
    title: "Що забороняють політики комерції Meta",
    text: "Політики комерції Meta (Marketplace, групи купівлі-продажу, крамниці на сторінках, Instagram) забороняють просувати продаж тварин і продуктів тваринного походження. Прямо назвали живих тварин, частини тварин (кістки, органи, туші), сире м'ясо й яйця. Також заборонено будь-який продукт чи частину від собак, котів і зникаючих видів: шкіру, хутро, вовну, волосся.",
  },
  {
    title: "Що це означає для кролячих виробів",
    text: "Про готові м'ясні вироби, пряжу з кролячого пуху й вироби з кролячого хутра в політиці прямо не сказано, а джерела описують її по-різному. Оголошення можуть відхилити. Не будуйте продаж лише на Facebook і Instagram: майте також Telegram-канал, власну сторінку чи інші майданчики.",
  },
];

const distanceCards: Card[] = [
  {
    title: "Інформація до договору",
    text: "До укладення договору на відстані продавець повинен надати споживачеві: найменування, місцезнаходження й порядок прийняття претензій; основні характеристики продукції; ціну з доставкою та умови оплати; гарантійні зобов'язання; умови доставки; порядок розірвання договору.",
  },
  {
    title: "Повернення",
    text: "Для непродовольчого товару належної якості діє 14 днів на повернення чи обмін. У справі про куртку, куплену в Instagram, апеляційний суд визнав, що покупчиня втратила право вимагати гроші, бо не повернула товар протягом 14 днів. Харчові продукти поверненню не підлягають.",
  },
  {
    title: "Договір і записи",
    text: "Електронний договір, укладений через інформаційні системи, вважається письмовим. Умови повернення й гарантій краще записати заздалегідь і зберігати листування з покупцем.",
  },
];

const mistakes: Mistake[] = [
  {
    wrong: "Продавати на ринку м'ясні консерви домашнього виготовлення",
    fix: "Це прямо заборонено. На старті обирайте інші вироби, а не консерви.",
  },
  {
    wrong: "Етикетка без виробника й адреси",
    fix: "Завжди вказуйте найменування й місцезнаходження оператора, який відповідає за продукт.",
  },
  {
    wrong: "Не виділити алергени",
    fix: "У переліку інгредієнтів чітко виділяйте їх шрифтом, кольором чи фоном.",
  },
  {
    wrong: "Писати «корисно від хвороб» чи інші лікувальні властивості",
    fix: "Приписувати харчовим продуктам лікувальні властивості закон забороняє.",
  },
  {
    wrong: "Продавати в соцмережах, не надаючи інформації до угоди",
    fix: "Додайте в профіль чи в оголошення дані про себе, ціну з доставкою, умови оплати й повернення.",
  },
  {
    wrong: "Обрати групу 1 і виготовляти вироби самому",
    fix: "Група 1 це роздрібний продаж на ринках і побутові послуги. Для виробництва зазвичай потрібна група 2 чи 3. Підтвердіть у податковій.",
  },
];

const checklist: string[] = [
  "Обрано статус і групу, відповідні вашим видам діяльності",
  "Для харчових виробів зареєстровано потужність або отримано дозвіл",
  "Етикетка містить усю обов'язкову інформацію",
  "Алергени в переліку інгредієнтів виділено",
  "Для текстилю вказано склад у відсотках, виробника й розмір",
  "З'ясовано правила ринку чи ярмарку, де ви будете продавати",
  "Для онлайн-продажу підготовлено інформацію про продавця, ціну й повернення",
  "Для кожної партії ведеться запис: дата, кількість, кому продано",
];

const emptyLabel: LabelData = {
  name: "",
  ingredients: "",
  allergens: "",
  mass: "",
  date: "",
  storage: "",
  producer: "",
  origin: "Україна",
};

const splitList = (value: string): string[] =>
  value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

export default function CraftSelling() {
  const [label, setLabel] = useState<LabelData>(emptyLabel);
  const [productId, setProductId] = useState<string>(products[0].id);
  const [channelId, setChannelId] = useState<string>(channels[0].id);
  const [done, setDone] = useState<boolean[]>(() => checklist.map(() => false));

  const setField = (key: keyof LabelData, value: string) => {
    setLabel((prev) => ({ ...prev, [key]: value }));
  };

  const ingredientItems = splitList(label.ingredients);
  const allergenTokens = splitList(label.allergens).map((a) => a.toLowerCase());
  const isAllergen = (item: string) =>
    allergenTokens.some((t) => item.toLowerCase().includes(t));

  const missing: string[] = [];
  if (!label.name.trim()) missing.push("назва продукту");
  if (ingredientItems.length === 0) missing.push("перелік інгредієнтів");
  if (!label.mass.trim()) missing.push("кількість (маса нетто)");
  if (!label.date.trim()) missing.push("термін придатності");
  if (!label.storage.trim()) missing.push("умови зберігання");
  if (!label.producer.trim()) missing.push("виробник і адреса");

  const product = products.find((p) => p.id === productId) ?? products[0];
  const channel = channels.find((c) => c.id === channelId) ?? channels[0];

  const warnings: string[] = [];
  if (productId === "meat" && channelId === "online") {
    warnings.push(
      "Політики комерції Meta прямо забороняють сире м'ясо й яйця. Про готові м'ясні вироби чіткого дозволу немає, тому оголошення можуть відхилити.",
    );
  }
  if (
    (productId === "fur" || productId === "fiber") &&
    channelId === "online"
  ) {
    warnings.push(
      "Політики Meta забороняють продаж частин тварин, а правила щодо хутра й вовни сформульовані по-різному. Оголошення про шкурки й пух можуть відхилити.",
    );
  }
  if (productId === "meat" && channelId === "hand") {
    warnings.push(
      "Навіть при продажу знайомим продукт має бути безпечним, а регулярне виробництво потребує реєстрації потужності чи дозволу.",
    );
  }
  if (productId !== "meat" && channelId === "market") {
    warnings.push(
      "Вимога до лабораторії на ринку стосується харчових продуктів. Нехарчові вироби на ринку теж потребують статусу продавця.",
    );
  }

  const toggle = (index: number) => {
    setDone((prev) => prev.map((v, i) => (i === index ? !v : v)));
  };
  const doneCount = done.filter(Boolean).length;

  return (
    <div className="cs-page">
      <header className="cs-hero">
        <div className="cs-hero-inner">
          <p className="cs-kicker">Крафтове виробництво</p>
          <h1 className="cs-title">Як легально продавати крафтову продукцію</h1>
          <p className="cs-lede">{heroLede}</p>
          <ul className="cs-chips" aria-label="Три ключові правила">
            {chips.map((c) => (
              <li key={c.title}>
                <span className="cs-chip-title">{c.title}</span>
                <span className="cs-chip-text">{c.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <section className="cs-wrap cs-section" aria-label="Статус продавця">
        <h2 className="cs-h2">Крок 1. Статус продавця</h2>
        <p className="cs-p">
          Регулярний продаж виробів із метою прибутку це підприємницька
          діяльність, а не «підробіток». Оберіть групу єдиного податку, яка
          відповідає вашим видам діяльності. Ліміти доходу й ставки змінюються
          щороку, тому актуальні цифри дивіться на сайті податкової. Для
          харчових виробів додатково потрібен статус оператора ринку харчових
          продуктів (див. сторінку про крафтові м'ясні вироби).
        </p>
        <div className="cs-table-wrap">
          <table className="cs-table">
            <thead>
              <tr>
                <th>Група</th>
                <th>Що дозволено</th>
                <th>Що це означає для вас</th>
              </tr>
            </thead>
            <tbody>
              {groupRows.map((g) => (
                <tr key={g.group}>
                  <td data-label="Група">{g.group}</td>
                  <td data-label="Що дозволено">{g.allowed}</td>
                  <td data-label="Для вас">{g.fits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="cs-note">
          Перевірте, щоб ваші види діяльності (КВЕД) відповідали обраній групі.
          Це довідка, а не податкова консультація.
        </p>
      </section>

      <section className="cs-band" aria-label="Етикетка харчового продукту">
        <div className="cs-wrap">
          <h2 className="cs-h2">Крок 2. Етикетка харчового продукту</h2>
          <p className="cs-p">
            Закон «Про інформацію для споживачів щодо харчових продуктів» №
            2639-VIII вимагає від оператора ринку, який відповідає за інформацію
            про продукт, вказувати на фасованих продуктах таке:
          </p>
          <ol className="cs-list">
            {labelRequired.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ol>
          <ul className="cs-rules">
            {labelRules.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>

          <h3 className="cs-h3">Конструктор макета етикетки</h3>
          <p className="cs-p">
            Це навчальний макет, який допомагає нічого не забути. Він не
            гарантує відповідності вимогам закону. Дані нікуди не надсилаються.
          </p>
          <div className="cs-builder">
            <div className="cs-form">
              <label className="cs-field">
                <span>Назва продукту (з фізичним станом)</span>
                <input
                  type="text"
                  value={label.name}
                  onChange={(e) => setField("name", e.target.value)}
                  id="label-name"
                  name="label-name"
                />
              </label>
              <label className="cs-field">
                <span>
                  Інгредієнти через кому, від найбільшої маси до найменшої
                </span>
                <input
                  type="text"
                  value={label.ingredients}
                  onChange={(e) => setField("ingredients", e.target.value)}
                  id="label-ingredients"
                  name="label-ingredients"
                />
              </label>
              <label className="cs-field">
                <span>Алергени через кому (щоб виділити їх у складі)</span>
                <input
                  type="text"
                  value={label.allergens}
                  onChange={(e) => setField("allergens", e.target.value)}
                  id="label-allergens"
                  name="label-allergens"
                />
              </label>
              <label className="cs-field">
                <span>Маса нетто</span>
                <input
                  type="text"
                  value={label.mass}
                  onChange={(e) => setField("mass", e.target.value)}
                  id="label-mass"
                  name="label-mass"
                />
              </label>
              <label className="cs-field">
                <span>Термін придатності або дата «спожити до»</span>
                <input
                  type="text"
                  value={label.date}
                  onChange={(e) => setField("date", e.target.value)}
                  id="label-date"
                  name="label-date"
                />
              </label>
              <label className="cs-field">
                <span>Умови зберігання</span>
                <input
                  type="text"
                  value={label.storage}
                  onChange={(e) => setField("storage", e.target.value)}
                  id="label-storage"
                  name="label-storage"
                />
              </label>
              <label className="cs-field">
                <span>Виробник і місцезнаходження</span>
                <input
                  type="text"
                  value={label.producer}
                  onChange={(e) => setField("producer", e.target.value)}
                  id="label-producers"
                  name="label-producers"
                />
              </label>
              <label className="cs-field">
                <span>Країна походження (для м'яса)</span>
                <input
                  type="text"
                  value={label.origin}
                  onChange={(e) => setField("origin", e.target.value)}
                  id="label-origin"
                  name="label-origin"
                />
              </label>
            </div>
            <div className="cs-label-card" aria-live="polite">
              <p className="cs-label-name">{label.name || "Назва продукту"}</p>
              <p className="cs-label-row">
                <b>Склад: </b>
                {ingredientItems.length > 0
                  ? ingredientItems.map((item, i) => (
                      <span key={`${item}-${i}`}>
                        {isAllergen(item) ? (
                          <strong className="cs-allergen">{item}</strong>
                        ) : (
                          item
                        )}
                        {i < ingredientItems.length - 1 ? ", " : ""}
                      </span>
                    ))
                  : "—"}
              </p>
              <p className="cs-label-row">
                <b>Маса нетто: </b>
                {label.mass || "—"}
              </p>
              <p className="cs-label-row">
                <b>Термін придатності: </b>
                {label.date || "—"}
              </p>
              <p className="cs-label-row">
                <b>Зберігання: </b>
                {label.storage || "—"}
              </p>
              <p className="cs-label-row">
                <b>Виробник: </b>
                {label.producer || "—"}
              </p>
              <p className="cs-label-row">
                <b>Країна походження: </b>
                {label.origin || "—"}
              </p>
              {missing.length > 0 ? (
                <p className="cs-label-missing">
                  Ще не заповнено: {missing.join(", ")}.
                </p>
              ) : (
                <p className="cs-label-ok">
                  Усі основні поля заповнено. Не забудьте про поживну цінність і
                  про вимоги до шрифту.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="cs-wrap cs-section" aria-label="Текстиль і хутро">
        <h2 className="cs-h2">Крок 3. Вироби з пуху, пряжі й хутра</h2>
        <div className="cs-cards">
          {textileCards.map((c) => (
            <article className="cs-card" key={c.title}>
              <h3 className="cs-card-title">{c.title}</h3>
              <p className="cs-card-text">{c.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cs-band" aria-label="Що потрібно для вашого випадку">
        <div className="cs-wrap">
          <h2 className="cs-h2">Крок 4. Що потрібно для вашого випадку</h2>
          <p className="cs-p">
            Оберіть, що ви продаєте й де, і побачите, на що звернути увагу.
          </p>
          <div className="cs-helper">
            <div className="cs-helper-controls">
              <label className="cs-field">
                <span>Що продаєте</span>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  id="label-product"
                  name="label-product"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="cs-field">
                <span>Де продаєте</span>
                <select
                  value={channelId}
                  onChange={(e) => setChannelId(e.target.value)}
                  id="label-channel"
                  name="label-channel"
                >
                  {channels.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="cs-helper-result" aria-live="polite">
              <h3 className="cs-helper-title">
                {product.label}: {channel.label}
              </h3>
              <p className="cs-helper-label">Для вашого виробу</p>
              <ul>
                {product.needs.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
              <p className="cs-helper-label">Для цього місця продажу</p>
              <ul>
                {channel.needs.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
              {warnings.length > 0 && (
                <div className="cs-helper-warn">
                  <p className="cs-helper-label cs-helper-label--warn">
                    Зверніть увагу
                  </p>
                  <ul>
                    {warnings.map((w) => (
                      <li key={w}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="cs-helper-label">Завжди</p>
              <ul>
                {commonNeeds.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="cs-wrap cs-section" aria-label="Майданчики">
        <h2 className="cs-h2">Правила майданчиків: Facebook і Instagram</h2>
        <div className="cs-cards cs-cards--two">
          {platformCards.map((c) => (
            <article className="cs-card" key={c.title}>
              <h3 className="cs-card-title">{c.title}</h3>
              <p className="cs-card-text">{c.text}</p>
            </article>
          ))}
        </div>
        <p className="cs-note">
          Описи політик Meta ґрунтуються на копіях її тексту й публікаціях, тому
          перед публікацією перевірте актуальні правила самого майданчика.
        </p>
      </section>

      <section
        className="cs-band cs-band--deal"
        aria-label="Договір і повернення"
      >
        <div className="cs-wrap">
          <h2 className="cs-h2">Крок 5. Договір, чек і повернення</h2>
          <div className="cs-cards">
            {distanceCards.map((c) => (
              <article className="cs-card" key={c.title}>
                <h3 className="cs-card-title">{c.title}</h3>
                <p className="cs-card-text">{c.text}</p>
              </article>
            ))}
          </div>
          <p className="cs-note">
            Ці норми застосовують до вас як до продавця-підприємця. Новий закон
            про захист прав споживачів набуде чинності після скасування воєнного
            стану, поки діє попередній.
          </p>
        </div>
      </section>

      <section className="cs-wrap cs-section" aria-label="Ціна">
        <h2 className="cs-h2">Крок 6. Ціна виробу</h2>
        <p className="cs-p">
          Складіть ціну з витрат на матеріали й упаковку, часу, який ви
          витратили, податку та вашої націнки. Не забудьте комісію майданчика,
          якщо вона є. Як порахувати собівартість і назвати ціну, докладніше
          описано на сторінці «Ціноутворення племінних тварин»: підхід той
          самий.
        </p>
      </section>

      <section className="cs-band" aria-label="Типові помилки">
        <div className="cs-wrap">
          <h2 className="cs-h2">Типові помилки й як їх виправити</h2>
          <div className="cs-mistakes">
            {mistakes.map((m) => (
              <div className="cs-mistake" key={m.wrong}>
                <p className="cs-mistake-wrong">{m.wrong}</p>
                <p className="cs-mistake-fix">{m.fix}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="cs-wrap cs-wrap--narrow cs-section"
        aria-label="Чек-лист"
      >
        <h2 className="cs-h2">Чек-лист перед першим продажем</h2>
        <p className="cs-p">
          Відмічайте готове. Готово: {doneCount} з {checklist.length}.
        </p>
        <ul className="cs-check">
          {checklist.map((c, i) => (
            <li key={c}>
              <label
                className={`cs-check-item${done[i] ? " cs-check-item--done" : ""}`}
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

      <div className="cs-wrap cs-section">
        <h3 className="cs-small-title">Читайте також</h3>
        <div className="cs-related">
          <Link to="/craft-meat" className="cs-related-link">
            Крафтові м'ясні вироби з кролятини
          </Link>
          <Link to="/craft-fur" className="cs-related-link">
            Вичинка шкурок і хутряні вироби
          </Link>
          <Link to="/craft-angora" className="cs-related-link">
            Пух і пряжа з ангорських кролів
          </Link>
          <Link to="/legal" className="cs-related-link">
            Юридичний куточок
          </Link>
          <Link to="/sales" className="cs-related-link">
            Збут кролятини
          </Link>
          <Link to="/sale-listings" className="cs-related-link">
            Оголошення про продаж
          </Link>
          <Link to="/social-media" className="cs-related-link">
            Соцмережі та Telegram-канал
          </Link>
        </div>
      </div>
    </div>
  );
}
