import { useState } from "react";
import { Link } from "react-router-dom";
import "./SaleListings.css";

interface TocItem {
  id: string;
  label: string;
}

interface ListingPart {
  name: string;
  must: boolean;
  text: string;
}

interface TitlePair {
  weak: string;
  why: string;
  strong: string;
}

interface Place {
  title: string;
  text: string;
  tip: string;
}

interface BuyerQ {
  q: string;
  a: string;
}

interface Form {
  farm: string;
  breed: string;
  sex: string;
  qty: string;
  age: string;
  color: string;
  weight: string;
  notes: string;
  docs: string[];
  price: string;
  place: string;
  handover: string;
  contact: string;
}

const heroLede =
  "Добре оголошення відповідає на всі питання покупця ще до дзвінка. Тоді вам пишуть ті, хто справді хоче купити, а не ті, хто хоче дізнатися, скільки місяців кролику. Нижче: що писати, як написати чесно, де публікувати, як відповідати покупцям і як не потрапити на шахраїв.";

const toc: TocItem[] = [
  { id: "elements", label: "З чого складається оголошення" },
  { id: "title", label: "Заголовок" },
  { id: "builder", label: "Конструктор тексту" },
  { id: "examples", label: "Слабке й сильне оголошення" },
  { id: "where", label: "Де публікувати" },
  { id: "buyers", label: "Питання покупців" },
  { id: "safety", label: "Безпека продавця" },
  { id: "law", label: "Що каже закон" },
  { id: "check", label: "Перевірка перед публікацією" },
];

const elements: ListingPart[] = [
  {
    name: "Заголовок",
    must: true,
    text: "Що за тварини, яка порода, який вік і де вони. Заголовок видно першим, тому покупець за ним вирішує, чи відкривати оголошення.",
  },
  {
    name: "Фото і відео",
    must: true,
    text: "Кілька чесних фото тієї самої тварини, яку продаєте, і коротке відео з рухом (докладно на сторінці «Фото і відео тварин для продажу»).",
  },
  {
    name: "Порода і масть",
    must: true,
    text: "Пишіть так, як є. Якщо тварина помісь, так і напишіть: чесне слово «помісь» краще, ніж вигадана порода.",
  },
  {
    name: "Вік і стать",
    must: true,
    text: "Вік у місяцях або дата народження, і чи це самка, чи самець. Без віку покупець не зрозуміє, що саме ви продаєте.",
  },
  {
    name: "Стан тварини",
    must: true,
    text: "Здорова, активна, з апетитом. Якщо є особливості чи вади, напишіть про них самі. Це зекономить час обом сторонам.",
  },
  {
    name: "Походження і документи",
    must: false,
    text: "Родовід, записи про щеплення, ветеринарні документи. Пишіть лише те, що справді є. Слово «племінний» без підтвердження краще не вживати.",
  },
  {
    name: "Ціна",
    must: true,
    text: "Вкажіть, за одного кролика чи за пару, і чи є торг. Оголошення з написом «ціна договірна» часто відлякують покупців.",
  },
  {
    name: "Місце і умови передачі",
    must: true,
    text: "Область або населений пункт, самовивіз чи відправка. Точну адресу в публічному оголошенні краще не вказувати.",
  },
  {
    name: "Контакт і зручний час",
    must: true,
    text: "Телефон або месенджер і години, коли відповідаєте. Той самий контакт, що у вас на сторінці господарства, допомагає покупцю вам довіряти.",
  },
  {
    name: "Про господарство",
    must: false,
    text: "Назва, кілька слів про історію і посилання на сторінку. Люди охочіше купують там, де бачать, що за оголошенням стоїть реальне господарство.",
  },
];

const titlePairs: TitlePair[] = [
  {
    weak: "Продам кролів ДЕШЕВО!!!",
    why: "Нічого не відомо про тварин, а «дешево» нічого не пояснює. Великі літери й знаки оклику виглядають як спам.",
    strong: "Кролики каліфорнійські, 3 міс., Хмельницька обл.",
  },
  {
    weak: "Кролики",
    why: "Занадто коротко: немає ні породи, ні віку, ні місця.",
    strong: "Новозеландські білі, самки 4 міс., є родовід",
  },
  {
    weak: "ТЕРМІНОВО! Найкращі кролі в Україні!",
    why: "«Найкращі» довести неможливо. Закон забороняє рекламу з перебільшенням, яка вводить в оману.",
    strong: "Молодняк фландр, 2,5 міс., щеплені, показуємо наживо",
  },
];

const places: Place[] = [
  {
    title: "Дошки оголошень",
    text: "Найбільша аудиторія, у тому числі люди, які взагалі не знають кролівників. Конкуренція висока, тому оголошення має бути якісним.",
    tip: "Правила й обмеження для категорій із тваринами в кожного сайту свої й змінюються. Прочитайте їх перед публікацією, щоб оголошення не зняли.",
  },
  {
    title: "Групи й чати в соцмережах",
    text: "Тут сидять кролівники, які знають породи й шукають племінних тварин. До таких людей добре звертатися з родоводом і записами про щеплення.",
    tip: "Facebook та Instagram забороняють продаж живих тварин між приватними особами, а на Marketplace забороняють будь-який такий продаж, тому там оголошення можуть видалити. Не будуйте продажі лише на Facebook і прочитайте правила кожної групи.",
  },
  {
    title: "Telegram-канал або сторінка господарства",
    text: "Постійна аудиторія, яка вже вас знає. Тут працює історія господарства і фото тварин у різні дні, а не лише на день продажу.",
    tip: "Покажіть, як живуть ваші кролі, і покупці самі прийдуть із питаннями.",
  },
  {
    title: "Знайомі, клуби, виставки",
    text: "Покупці довіряють рекомендаціям. Хто вже купив у вас і залишився задоволений, найчастіше приводить нових клієнтів.",
    tip: "Залишайте візитку чи посилання на сторінку кожному покупцю.",
  },
];

const buyerQs: BuyerQ[] = [
  {
    q: "Скільки місяців і яка вага?",
    a: "Назвіть вік у місяцях або дату народження. Вагу пишіть тільки якщо щойно зважували, і додайте, коли саме.",
  },
  {
    q: "Чи щеплені?",
    a: "Відповідайте лише правду: від чого, чим і коли. Якщо щеплення не робили, так і скажіть. Приховане обернеться претензіями.",
  },
  {
    q: "Можна побачити наживо?",
    a: "Так. Покажіть тварин і умови, де вони живуть. Закон допускає продаж із показом тварин покупцям, якщо виконано вимоги закону про захист тварин.",
  },
  {
    q: "Чи є родовід?",
    a: "Скажіть прямо: є чи немає. Без родоводу краще не називати тварину племінною.",
  },
  {
    q: "Можете відправити?",
    a: "Якщо готові, домовтеся про перевізника й умови. Тара має бути просторою і провітрюваною. Порушення правил перевезення вважається жорстоким поводженням із тваринами.",
  },
  {
    q: "Яка остаточна ціна?",
    a: "Назвіть ціну й одразу скажіть, чи є торг і до якої межі. Так ви не втрачаєте час на зайві розмови.",
  },
];

const safetyPoints: string[] = [
  "Шахраї пишуть продавцям під виглядом покупців, заявляють, що вже заплатили, і надсилають посилання «щоб отримати гроші». За посиланням відкривається підроблений сайт, де просять номер картки, термін дії, CVV-код і код із SMS. Не переходьте за такими посиланнями.",
  "Щоб отримати гроші за товар, продавцю достатньо 16 цифр номера картки. Термін дії, CVV-код і коди з SMS ніколи нікому не повідомляйте.",
  "Оплату й доставку, якщо користуєтесь платформою, проводьте лише через її офіційні сервіси, а не за посиланнями з месенджера.",
  "Не вводьте дані картки на сайтах, які надіслав незнайомець: існують сайти-двійники відомих платформ.",
  "Тварину віддавайте лише після того, як гроші вже у вас. Не поспішайте через тиск «терміново».",
  "У публічному оголошенні не пишіть точну домашню адресу. Передавайте тварину в заздалегідь домовленому місці й часі.",
];

const lawCards: Place[] = [
  {
    title: "Правда в оголошенні",
    text: "Реклама, яка вводить або може ввести в оману через неточність, недостовірність, двозначність, перебільшення чи замовчування, заборонена. Закон про захист від недобросовісної конкуренції також забороняє поширювати неповні чи неправдиві відомості, що вводять в оману.",
    tip: "Для вас це значить: без слів «найкращі», «100% здорові» без підстав і без фото іншої тварини.",
  },
  {
    title: "Чи потрібна реєстрація продавця",
    text: "Підприємницька діяльність це діяльність самостійна, систематична, на власний ризик і з метою прибутку. Юристи наводять орієнтир: систематичною її вважають, коли вона повторюється не менше трьох разів за календарний рік (постанова Пленуму Верховного Суду від 25.04.2003 № 3). Регулярний продаж тварин із доходом можуть визнати підприємницькою діяльністю.",
    tip: "Якщо ви вирощуєте кролів саме для продажу й робите це регулярно, з'ясуйте в податковій, який статус вам потрібен.",
  },
  {
    title: "Умови утримання і показ тварин",
    text: "Умови утримання тварин мають відповідати їхнім біологічним, видовим та індивідуальним особливостям. Продаж із показом тварин покупцям допускається, якщо дотримано вимог закону про захист тварин. Порушення правил поводження й перевезення тварин вважається жорстоким поводженням. Нагляд здійснює Національна поліція.",
    tip: "Показувати покупцям варто охайні умови: це і закон, і ваша репутація.",
  },
  {
    title: "Ветеринарні документи",
    text: "Ветеринарні документи видають за результатами безпосереднього огляду тварин. Для вивезення за межі України потрібні міжнародні ветеринарні сертифікати. Для перевезення всередині країни вимоги залежать від конкретного випадку.",
    tip: "Не обіцяйте в оголошенні документів, яких не маєте. Що саме потрібно для вашого продажу, уточніть у державного ветеринарного лікаря.",
  },
];

const finalChecks: string[] = [
  "Заголовок містить породу, вік і місце",
  "Є кілька чесних фото тієї самої тварини",
  "Вказано стать, масть і вік",
  "Про вади й особливості написано прямо",
  "У документах згадано лише те, що справді є",
  "Ціна зрозуміла: за одного чи за пару, є торг чи ні",
  "Вказано місце й спосіб передачі, без точної адреси",
  "Контакт і зручний час дзвінків правильні",
  "Немає слів «найкращі», «100%» без підстав, великих літер і знаків оклику",
];

const docOptions: string[] = [
  "родовід",
  "записи про щеплення",
  "ветеринарні документи",
];

const emptyForm: Form = {
  farm: "",
  breed: "",
  sex: "",
  qty: "",
  age: "",
  color: "",
  weight: "",
  notes: "",
  docs: [],
  price: "",
  place: "",
  handover: "",
  contact: "",
};

export default function SaleListings() {
  const [form, setForm] = useState<Form>(emptyForm);
  const [copyState, setCopyState] = useState<"idle" | "ok" | "fail">("idle");

  const setField = (key: keyof Omit<Form, "docs">, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleDoc = (doc: string) => {
    setForm((prev) => ({
      ...prev,
      docs: prev.docs.includes(doc)
        ? prev.docs.filter((d) => d !== doc)
        : [...prev.docs, doc],
    }));
  };

  const title = [form.breed || "Кролі", form.age, form.place]
    .filter(Boolean)
    .join(", ");

  const lines = [
    form.farm && `Господарство «${form.farm}».`,
    form.sex && `Стать: ${form.sex}.`,
    form.qty && `Кількість: ${form.qty}.`,
    form.color && `Масть: ${form.color}.`,
    form.weight && `Вага: ${form.weight}.`,
    form.notes && `Особливості: ${form.notes}.`,
    form.docs.length > 0 && `Документи, які є: ${form.docs.join(", ")}.`,
    form.price && `Ціна: ${form.price}.`,
    form.handover && `Передача: ${form.handover}.`,
    form.contact && `Контакт: ${form.contact}.`,
  ].filter((l): l is string => Boolean(l));

  const outText = `${title}\n\n${lines.join("\n")}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(outText);
      setCopyState("ok");
    } catch {
      setCopyState("fail");
    }
    window.setTimeout(() => setCopyState("idle"), 2500);
  };

  return (
    <div className="ad-page">
      <header className="ad-hero">
        <div className="ad-hero-inner">
          <span className="ad-stamp">Продається</span>
          <h1 className="ad-title">Оголошення про продаж</h1>
          <p className="ad-subtitle">
            щоб покупець зрозумів усе з першого прочитання
          </p>
          <p className="ad-lede">{heroLede}</p>
          <ul className="ad-chips">
            <li>Чесно</li>
            <li>Зрозуміло</li>
            <li>Безпечно</li>
          </ul>
        </div>
      </header>

      <div className="ad-layout">
        <nav className="ad-toc" aria-label="Зміст сторінки">
          <p className="ad-toc-title">Зміст</p>
          <ol className="ad-toc-list">
            {toc.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`} className="ad-toc-link">
                  {t.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="ad-main">
          <section id="elements" className="ad-section">
            <h2 className="ad-h2">
              <span className="ad-h2-num">1</span>З чого складається оголошення
            </h2>
            <p className="ad-p">
              Позначка «обов'язково» означає, що без цього покупець не зрозуміє,
              що саме ви продаєте. «Бажано» додає довіри.
            </p>
            <ul className="ad-elements">
              {elements.map((e) => (
                <li className="ad-element" key={e.name}>
                  <div className="ad-element-head">
                    <h3 className="ad-element-name">{e.name}</h3>
                    <span
                      className={`ad-badge${e.must ? " ad-badge--must" : ""}`}
                    >
                      {e.must ? "обов'язково" : "бажано"}
                    </span>
                  </div>
                  <p className="ad-element-text">{e.text}</p>
                </li>
              ))}
            </ul>
          </section>

          <section id="title" className="ad-section">
            <h2 className="ad-h2">
              <span className="ad-h2-num">2</span>Заголовок: що працює, а що ні
            </h2>
            <p className="ad-p">
              Простий порядок для заголовка: порода, вік, місце. Додайте одну
              правдиву деталь, яка відрізняє ваше оголошення, наприклад «є
              родовід» чи «показуємо наживо».
            </p>
            <div className="ad-pairs">
              {titlePairs.map((p) => (
                <div className="ad-pair" key={p.weak}>
                  <div className="ad-pair-weak">
                    <span className="ad-pair-label">Слабко</span>
                    <p className="ad-pair-text">{p.weak}</p>
                    <p className="ad-pair-why">{p.why}</p>
                  </div>
                  <div className="ad-pair-strong">
                    <span className="ad-pair-label">Краще</span>
                    <p className="ad-pair-text">{p.strong}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="builder" className="ad-section">
            <h2 className="ad-h2">
              <span className="ad-h2-num">3</span>Конструктор тексту оголошення
            </h2>
            <p className="ad-p">
              Заповніть поля правдивими даними, і поруч з'явиться готовий текст.
              Порожні поля в текст не потрапляють. Дані нікуди не надсилаються,
              усе відбувається у вашому браузері.
            </p>
            <div className="ad-builder">
              <div className="ad-form">
                <label className="ad-field" htmlFor="ad-farm">
                  <span>Назва господарства</span>
                  <input
                    id="ad-farm"
                    name="farm"
                    type="text"
                    value={form.farm}
                    onChange={(e) => setField("farm", e.target.value)}
                  />
                </label>
                <label className="ad-field" htmlFor="ad-breed">
                  <span>Порода</span>
                  <input
                    id="ad-breed"
                    name="breed"
                    type="text"
                    value={form.breed}
                    onChange={(e) => setField("breed", e.target.value)}
                  />
                </label>
                <label className="ad-field" htmlFor="ad-sex">
                  <span>Стать</span>
                  <select
                    id="ad-sex"
                    name="sex"
                    value={form.sex}
                    onChange={(e) => setField("sex", e.target.value)}
                  >
                    <option value="">не вказувати</option>
                    <option value="самки">самки</option>
                    <option value="самці">самці</option>
                    <option value="самки й самці">самки й самці</option>
                  </select>
                </label>
                <label className="ad-field" htmlFor="ad-qty">
                  <span>Кількість</span>
                  <input
                    id="ad-qty"
                    name="qty"
                    type="text"
                    value={form.qty}
                    onChange={(e) => setField("qty", e.target.value)}
                  />
                </label>
                <label className="ad-field" htmlFor="ad-age">
                  <span>Вік (наприклад, 3 міс.)</span>
                  <input
                    id="ad-age"
                    name="age"
                    type="text"
                    value={form.age}
                    onChange={(e) => setField("age", e.target.value)}
                  />
                </label>
                <label className="ad-field" htmlFor="ad-color">
                  <span>Масть</span>
                  <input
                    id="ad-color"
                    name="color"
                    type="text"
                    value={form.color}
                    onChange={(e) => setField("color", e.target.value)}
                  />
                </label>
                <label className="ad-field" htmlFor="ad-weight">
                  <span>Вага (якщо зважували)</span>
                  <input
                    id="ad-weight"
                    name="weight"
                    type="text"
                    value={form.weight}
                    onChange={(e) => setField("weight", e.target.value)}
                  />
                </label>
                <label className="ad-field" htmlFor="ad-price">
                  <span>Ціна</span>
                  <input
                    id="ad-price"
                    name="price"
                    type="text"
                    value={form.price}
                    onChange={(e) => setField("price", e.target.value)}
                  />
                </label>
                <label className="ad-field" htmlFor="ad-place">
                  <span>Область або населений пункт</span>
                  <input
                    id="ad-place"
                    name="place"
                    type="text"
                    value={form.place}
                    onChange={(e) => setField("place", e.target.value)}
                  />
                </label>
                <label className="ad-field" htmlFor="ad-handover">
                  <span>Спосіб передачі</span>
                  <input
                    id="ad-handover"
                    name="handover"
                    type="text"
                    value={form.handover}
                    onChange={(e) => setField("handover", e.target.value)}
                  />
                </label>
                <label className="ad-field ad-field--wide" htmlFor="ad-notes">
                  <span>Особливості й вади (пишіть чесно)</span>
                  <input
                    id="ad-notes"
                    name="notes"
                    type="text"
                    value={form.notes}
                    onChange={(e) => setField("notes", e.target.value)}
                  />
                </label>
                <label className="ad-field ad-field--wide" htmlFor="ad-contact">
                  <span>Контакт і зручний час</span>
                  <input
                    id="ad-contact"
                    name="contact"
                    type="text"
                    value={form.contact}
                    onChange={(e) => setField("contact", e.target.value)}
                  />
                </label>
                <fieldset className="ad-docs">
                  <legend>Документи, які справді є</legend>
                  {docOptions.map((d, index) => {
                    const docId = `ad-doc-${index}`;
                    return (
                      <label className="ad-doc" key={d} htmlFor={docId}>
                        <input
                          id={docId}
                          name="docs"
                          type="checkbox"
                          value={d}
                          checked={form.docs.includes(d)}
                          onChange={() => toggleDoc(d)}
                        />
                        <span>{d}</span>
                      </label>
                    );
                  })}
                </fieldset>
              </div>
              <div className="ad-result">
                <p className="ad-result-label">Ваш текст</p>
                <div className="ad-result-text">{outText}</div>
                <button type="button" className="ad-copy" onClick={copy}>
                  Скопіювати текст
                </button>
                {copyState === "ok" && (
                  <p className="ad-copy-note">Текст скопійовано.</p>
                )}
                {copyState === "fail" && (
                  <p className="ad-copy-note">
                    Не вдалося скопіювати. Виділіть текст вручну.
                  </p>
                )}
              </div>
            </div>
          </section>

          <section id="examples" className="ad-section">
            <h2 className="ad-h2">
              <span className="ad-h2-num">4</span>Слабке й сильне оголошення
            </h2>
            <div className="ad-coupons">
              <div className="ad-coupon ad-coupon--weak">
                <span className="ad-coupon-label">Слабке</span>
                <p>Продам кролів. Дешево. Здорові. Дзвоніть.</p>
                <p className="ad-coupon-note">
                  Невідомо, які кролі, скільки їм місяців, де вони й скільки
                  коштують. Покупцеві доведеться питати все з нуля.
                </p>
              </div>
              <div className="ad-coupon ad-coupon--strong">
                <span className="ad-coupon-label">Сильне</span>
                <p>
                  [Порода], молодняк [вік] міс., [область].
                  <br />
                  Господарство «[назва]». [Самки / самці], кількість [число].
                  <br />
                  Масть: [масть]. Особливості: [вади чи їх відсутність].
                  <br />
                  Документи, які є: [родовід / записи про щеплення].
                  <br />
                  Ціна: [сума] за одного, торг [є / немає].
                  <br />
                  Показуємо тварин наживо за домовленістю. Телефон [номер],
                  відповідаю з [година] до [година].
                </p>
                <p className="ad-coupon-note">
                  Усе потрібне є, дані перевіряються, нічого не обіцяно зайвого.
                  Замість слів у дужках підставте свої правдиві дані.
                </p>
              </div>
            </div>
          </section>

          <section id="where" className="ad-section">
            <h2 className="ad-h2">
              <span className="ad-h2-num">5</span>Де публікувати
            </h2>
            <div className="ad-cards">
              {places.map((p) => (
                <article className="ad-card" key={p.title}>
                  <h3 className="ad-card-title">{p.title}</h3>
                  <p className="ad-card-text">{p.text}</p>
                  <p className="ad-card-tip">{p.tip}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="buyers" className="ad-section">
            <h2 className="ad-h2">
              <span className="ad-h2-num">6</span>Що питатимуть покупці
            </h2>
            <p className="ad-p">
              Підготуйте відповіді заздалегідь. Якщо відповідь на питання вже в
              оголошенні, пишіть її одразу в тексті, і питань буде менше.
            </p>
            <div className="ad-qa">
              {buyerQs.map((b) => (
                <div className="ad-qa-item" key={b.q}>
                  <p className="ad-qa-q">{b.q}</p>
                  <p className="ad-qa-a">{b.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="safety" className="ad-section">
            <h2 className="ad-h2">
              <span className="ad-h2-num">7</span>Безпека продавця
            </h2>
            <p className="ad-p">
              Шахраї діють і проти продавців. Нижче: основні схеми й правила.
            </p>
            <ul className="ad-safety">
              {safetyPoints.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>

          <section id="law" className="ad-section">
            <h2 className="ad-h2">
              <span className="ad-h2-num">8</span>Що каже закон
            </h2>
            <div className="ad-cards">
              {lawCards.map((p) => (
                <article className="ad-card ad-card--law" key={p.title}>
                  <h3 className="ad-card-title">{p.title}</h3>
                  <p className="ad-card-text">{p.text}</p>
                  <p className="ad-card-tip">{p.tip}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="check" className="ad-section">
            <h2 className="ad-h2">
              <span className="ad-h2-num">9</span>Перевірка перед публікацією
            </h2>
            <ul className="ad-final">
              {finalChecks.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </section>

          <div className="ad-related">
            <h3 className="ad-related-title">Читайте також</h3>
            <div className="ad-related-grid">
              <Link to="/farm-brand" className="ad-related-link">
                Бренд господарства
              </Link>
              <Link to="/animal-photo-video" className="ad-related-link">
                Фото і відео тварин для продажу
              </Link>
              <Link to="/breeds" className="ad-related-link">
                Породи
              </Link>
            </div>
          </div>

          <footer className="ad-footer">
            <p>
              Відомості про безпеку продавця, рекламу, статус продавця й
              ветеринарні документи перевірено за відкритими джерелами станом на
              12 листопада 2026 року. Закони й правила майданчиків змінюються.
              Це довідкова інформація, а не юридична консультація: щодо вашого
              випадку звертайтесь до податкової, державного ветеринарного лікаря
              або юриста.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
