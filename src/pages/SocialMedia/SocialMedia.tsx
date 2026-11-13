import { useState } from "react";
import { Link } from "react-router-dom";
import "./SocialMedia.css";

interface Platform {
  name: string;
  good: string;
  caution: string;
}

interface Step {
  title: string;
  text: string;
}

interface PostType {
  title: string;
  text: string;
  note: string;
}

interface PlanDay {
  day: string;
  what: string;
}

interface Template {
  title: string;
  body: string;
}

interface Rule {
  title: string;
  text: string;
  tip: string;
}

interface Mistake {
  wrong: string;
  fix: string;
}

type PlanKey = "two" | "three" | "five";

const heroLede =
  "Сторінка господарства в соцмережі це ваша вітрина, яка працює щодня: люди бачать, як живуть ваші кролі, і привчаються вам довіряти ще до того, як вирішать купити. Нижче: де вести сторінку, як запустити Telegram-канал, що публікувати, як відповідати підписникам і які правила майданчиків та закону треба знати.";

const platforms: Platform[] = [
  {
    name: "Telegram-канал",
    good: "Підходить для постійного зв'язку з підписниками: пости приходять на телефони, можна планувати публікації, закріплювати головне повідомлення й відкривати коментарі. Публічний канал видно в інтернеті без Telegram.",
    caution:
      "Новий канал починається з нуля: його треба показати знайомим, покупцям і в групах за інтересами.",
  },
  {
    name: "Facebook і Instagram",
    good: "Добре показують життя господарства: фото, короткі відео, історії. Сторінка господарства працює як візитка.",
    caution:
      "Правила Meta забороняють продаж живих тварин між приватними особами. Тому рахуйте на Facebook і Instagram як на вітрину, а не єдине місце для продажу.",
  },
  {
    name: "Чат або група за інтересами",
    good: "Тут уже зібралися кролівники: можна ставити питання, ділитися досвідом і знаходити покупців серед тих, хто розуміється на породах.",
    caution:
      "У кожної групи свої правила. Не розсилайте рекламу без дозволу адміністраторів і не сперечайтеся з іншими учасниками.",
  },
];

const steps: Step[] = [
  {
    title: "Створіть канал",
    text: "У Telegram відкрийте меню нового повідомлення й оберіть «Новий канал». Щойно створений канал спочатку приватний.",
  },
  {
    title: "Зробіть канал публічним",
    text: "У налаштуваннях профілю каналу оберіть публічний канал і придумайте коротку адресу. Кожен пост публічного каналу має власне посилання, яке відкривається в браузері без Telegram, а вміст індексують пошукові системи.",
  },
  {
    title: "Назва, опис і аватар",
    text: "Назва це назва вашого господарства. В описі одне-два речення: що тримаєте, де і як зв'язатися. Аватар це ваш логотип, той самий, що в оголошеннях і на сторінці в інших мережах.",
  },
  {
    title: "Увімкніть коментарі",
    text: "Додайте до каналу групу обговорення: тоді під постами з'явиться кнопка коментарів, і всі відповіді видно також у групі, де адміністраторам легше стежити за ввічливістю. Також можна ввімкнути реакції.",
  },
  {
    title: "Закріпіть головний пост",
    text: "Закріплене повідомлення видно зверху, тому напишіть у ньому, хто ви, що пропонуєте, як з вами зв'язатися і які правила спілкування.",
  },
  {
    title: "Плануйте пости наперед",
    text: "У Telegram є відкладена публікація: пост виходить у заданий час автоматично. Для нічних і неважливих новин є тихі повідомлення без звуку.",
  },
  {
    title: "Додайте помічника",
    text: "Якщо вам допомагає родина, додайте їх адміністраторами. Права кожного можна налаштувати окремо: хто публікує, хто відповідає, хто змінює опис.",
  },
  {
    title: "Дивіться, що працює",
    text: "Під кожним постом є лічильник переглядів. Розширена статистика за графіками доступна каналам, які мають понад 500 підписників.",
  },
];

const postTypes: PostType[] = [
  {
    title: "Знайомство",
    text: "Хто ви, де ваше господарство, з чого починали, які породи тримаєте.",
    note: "Закріпіть цей пост угорі каналу.",
  },
  {
    title: "Один день у господарстві",
    text: "Годування, чистка кліток, роботи по господарству. Люди люблять бачити справжнє життя, а не лише красиві фото.",
    note: "Покажіть, як усе влаштовано, і покупці самі зрозуміють, що ви ставитеся до тварин відповідально.",
  },
  {
    title: "Корисна порада",
    text: "Коротко й простими словами: як годувати, як доглядати, що робити влітку чи взимку.",
    note: "Корисні пости найчастіше пересилають знайомим, і так ваше господарство отримує нових підписників.",
  },
  {
    title: "Відповідь на запитання",
    text: "Візьміть питання, яке вам часто ставлять, і відповідайте на нього докладно.",
    note: "Так ви економите час: наступного разу достатньо надіслати посилання на пост.",
  },
  {
    title: "Тварини в наявності",
    text: "Фото й опис тварин, які продаєте зараз: порода, вік, ціна, документи, контакт.",
    note: "Лише правдива інформація й фото саме цієї тварини (див. сторінки «Оголошення про продаж» та «Фото і відео тварин для продажу»).",
  },
  {
    title: "Історії покупців",
    text: "Фото кролика в новій родині, відгук нового власника.",
    note: "Публікуйте тільки з письмового чи прямого дозволу людини, особливо коли на фото є вона сама або діти.",
  },
  {
    title: "Новини господарства",
    text: "Нові породи, нові клітки, участь у виставках, плани.",
    note: "Короткі новини підтримують зв'язок із підписниками між великими постами.",
  },
];

const plans: Record<PlanKey, { label: string; days: PlanDay[] }> = {
  two: {
    label: "2 пости на тиждень",
    days: [
      { day: "Вівторок", what: "Корисна порада або відповідь на запитання" },
      {
        day: "Субота",
        what: "Один день у господарстві: фото й короткий текст",
      },
    ],
  },
  three: {
    label: "3 пости на тиждень",
    days: [
      { day: "Понеділок", what: "Корисна порада" },
      { day: "Середа", what: "Один день у господарстві" },
      { day: "П'ятниця", what: "Тварини в наявності або новини господарства" },
    ],
  },
  five: {
    label: "5 постів на тиждень",
    days: [
      { day: "Понеділок", what: "Корисна порада" },
      { day: "Вівторок", what: "Відповідь на запитання підписників" },
      { day: "Середа", what: "Один день у господарстві" },
      { day: "Четвер", what: "Історія покупця (з дозволу)" },
      { day: "Субота", what: "Тварини в наявності та новини" },
    ],
  },
};

const templates: Template[] = [
  {
    title: "Перший пост-знайомство",
    body: "Доброго дня! Це господарство «[назва]» з [місце]. Тримаємо [породи] з [рік]. Тут показуватимемо, як живуть наші кролі, ділитимемося порадами й повідомлятимемо, коли є молодняк. Питання пишіть у коментарях.",
  },
  {
    title: "Корисна порада",
    body: "Порада тижня: [тема]. Що робимо ми: [що саме]. Чому: [пояснення простими словами]. Є питання? Напишіть у коментарях, відповімо.",
  },
  {
    title: "Тварини в наявності",
    body: "Є [порода], [стать], [вік]. Фото тієї самої тварини вище. Ціна: [сума]. Документи, які є: [які саме]. Показуємо наживо за домовленістю. Пишіть у особисті або дзвоніть: [контакт].",
  },
  {
    title: "Подяка покупцю",
    body: "Дякуємо [ім'я] за довіру! Кролик породи [порода] поїхав до нової родини. Фото публікуємо з дозволу власника. Якщо будуть питання щодо догляду, пишіть нам.",
  },
];

const talkRules: string[] = [
  "Відповідайте на коментарі та повідомлення швидко й ввічливо. Підписники бачать, чи живий канал.",
  "Відповідь на загальне питання краще дати публічно в коментарі: її побачать усі. Особисті подробиці й ціни обговорюйте в особистих повідомленнях.",
  "Не вступайте у спори. Якщо людина сердита, відповідайте спокійно й по суті, а питання, яке потребує розмови, переведіть у особисті повідомлення.",
  "Помилилися, наприклад, у ціні чи віці тварини? Виправте пост, Telegram дозволяє редагувати повідомлення в каналі будь-коли, і напишіть про виправлення.",
  "Не видаляйте критичні, але чесні коментарі без потреби. Відповідь на критику показує вашу відповідальність.",
  "Не публікуйте особисті дані підписників і покупців: прізвища, телефони, адреси.",
];

const rules: Rule[] = [
  {
    title: "Правила Meta щодо тварин",
    text: "Політика Meta забороняє публікації, які намагаються купити, продати чи обміняти живих тварин, що не під загрозою зникнення, окрім переліку винятків. У правилах для комерції будь-який продаж тварин заборонено, зокрема на Marketplace. Є виняток для сторінок і груп справжніх підприємств, але Meta сама оцінює, чи це справжній бізнес. У рекламі продаж живих тварин дозволений для законних підприємств, зокрема заводчиків, і для худоби.",
    tip: "Тому сторінка на Facebook чи Instagram це вітрина, а не гарантоване місце для продажу. Якщо хочете показувати тварин у наявності, роблячи це там, готуйтеся, що публікацію можуть прибрати.",
  },
  {
    title: "Фото людей і дітей",
    text: "Цивільний кодекс (ст. 307) дозволяє фотографувати людину лише за її згодою, хоча на відкритих публічних заходах згоду вважають наданою. Світлини разом із супутньою інформацією іноді дозволяють визначити місце й час перебування людини, а в умовах воєнного стану це ризик.",
    tip: "Перед публікацією фото покупця чи його дитини отримайте дозвіл. Фото дітей без згоди батьків не публікуйте.",
  },
  {
    title: "Жорстокість до тварин",
    text: "Стаття 299 Кримінального кодексу передбачає відповідальність не лише за жорстоке поводження, а й за пропаганду, публічні заклики до таких дій і поширення матеріалів із закликами. За створення та поширення відео чи інших матеріалів, що пропагують жорстоке поводження, покарання сягає позбавлення волі з конфіскацією тварини.",
    tip: "Не публікуйте й не пересилайте такі матеріали. Кадри забою та обробки краще не виносити на загальний огляд: це наша порада, не пряма заборона, але такі публікації викликають скарги.",
  },
  {
    title: "Правда в дописах",
    text: "Реклама, яка вводить або може ввести в оману через неточність, недостовірність, двозначність, перебільшення чи замовчування, заборонена. Це стосується й дописів у соцмережах, які рекламують товар.",
    tip: "Пишіть про тварин і ціни тільки правду, без слів «найкращі», «100%» без підстав.",
  },
];

const mistakes: Mistake[] = [
  {
    wrong:
      "Публікувати нерегулярно: то п'ять постів за день, то тиша на місяць",
    fix: "Оберіть план, який зможете витримати, навіть якщо це два пости на тиждень. Регулярність важливіша за кількість.",
  },
  {
    wrong: "У кожному пості лише «продаю»",
    fix: "Змішуйте типи: корисне, життя господарства, тварини в наявності. Так підписники не втомлюються від реклами.",
  },
  {
    wrong: "Не відповідати на коментарі",
    fix: "Хоча б раз-два на день заходьте й відповідайте. Живий канал викликає довіру.",
  },
  {
    wrong: "Брати чужі фото й тексти",
    fix: "Власні фото й свої слова: це авторські права, і це правда про ваших тварин.",
  },
  {
    wrong: "Публікувати фото покупців чи дітей без дозволу",
    fix: "Спочатку запитайте й отримайте згоду. Це вимога закону й питання поваги.",
  },
  {
    wrong: "Різні назви, логотипи й контакти в різних мережах",
    fix: "Одна назва, один логотип, один номер телефону скрізь, як і написано на сторінці «Бренд господарства».",
  },
];

const startChecklist: string[] = [
  "Створено публічний канал із назвою господарства та логотипом",
  "Написано короткий опис: що, де, як зв'язатися",
  "Закріплено пост-знайомство",
  "Підключено групу обговорення для коментарів",
  "Обрано план публікацій, який можна витримати",
  "Підготовлено перші 3–5 постів і заплановано їх",
  "Дозволи на фото людей отримано",
  "Усі дані й обіцянки в постах правдиві",
];

export default function SocialMedia() {
  const [plan, setPlan] = useState<PlanKey>("three");
  const [copied, setCopied] = useState<number | null>(null);
  const [failed, setFailed] = useState<number | null>(null);
  const [done, setDone] = useState<boolean[]>(() =>
    startChecklist.map(() => false),
  );

  const copyTemplate = async (index: number, body: string) => {
    try {
      await navigator.clipboard.writeText(body);
      setCopied(index);
      setFailed(null);
    } catch {
      setFailed(index);
      setCopied(null);
    }
    window.setTimeout(() => {
      setCopied(null);
      setFailed(null);
    }, 2500);
  };

  const toggle = (index: number) => {
    setDone((prev) => prev.map((v, i) => (i === index ? !v : v)));
  };

  const doneCount = done.filter(Boolean).length;

  return (
    <div className="sm-page">
      <header className="sm-hero">
        <div className="sm-hero-inner">
          <div className="sm-hero-text">
            <p className="sm-pill">Соцмережі господарства</p>
            <h1 className="sm-title">
              Соцмережі та Telegram-канал господарства
            </h1>
            <p className="sm-lede">{heroLede}</p>
          </div>
          <div className="sm-phone" aria-hidden="true">
            <div className="sm-phone-head">
              <span className="sm-phone-avatar">Г</span>
              <div>
                <p className="sm-phone-name">Господарство «Назва»</p>
                <p className="sm-phone-meta">публічний канал</p>
              </div>
            </div>
            <div className="sm-phone-pin">
              Закріплено: Хто ми і як з нами зв'язатися
            </div>
            <div className="sm-phone-body">
              <div className="sm-bubble">
                Порада тижня: чому кролику потрібне сіно щодня
              </div>
              <div className="sm-bubble sm-bubble--photo">фото</div>
              <div className="sm-bubble">
                Є молодняк, фото й ціна нижче. Показуємо наживо.
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="sm-band" aria-label="Де вести сторінку">
        <div className="sm-wrap">
          <p className="sm-label">Крок 1</p>
          <h2 className="sm-h2">Де вести сторінку</h2>
          <div className="sm-platforms">
            {platforms.map((p) => (
              <article className="sm-platform" key={p.name}>
                <h3 className="sm-platform-name">{p.name}</h3>
                <p className="sm-platform-good">{p.good}</p>
                <p className="sm-platform-caution">{p.caution}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="sm-wrap sm-section"
        aria-label="Запуск Telegram-каналу"
      >
        <p className="sm-label">Крок 2</p>
        <h2 className="sm-h2">Запуск Telegram-каналу</h2>
        <ol className="sm-steps">
          {steps.map((s, i) => (
            <li className="sm-step" key={s.title}>
              <span className="sm-step-num">{i + 1}</span>
              <div>
                <h3 className="sm-step-title">{s.title}</h3>
                <p className="sm-step-text">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="sm-band" aria-label="Що публікувати">
        <div className="sm-wrap">
          <p className="sm-label">Крок 3</p>
          <h2 className="sm-h2">Що публікувати</h2>
          <p className="sm-p">
            Сім типів постів, які можна чергувати. Так канал не перетворюється
            на суцільну рекламу.
          </p>
          <div className="sm-posts">
            {postTypes.map((p) => (
              <article className="sm-post" key={p.title}>
                <h3 className="sm-post-title">{p.title}</h3>
                <p className="sm-post-text">{p.text}</p>
                <p className="sm-post-note">{p.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sm-wrap sm-section" aria-label="План публікацій">
        <p className="sm-label">Крок 4</p>
        <h2 className="sm-h2">План публікацій на тиждень</h2>
        <p className="sm-p">
          Оберіть, скільки постів готові робити щотижня. Це орієнтир, а не
          вимога: краще рідше, але регулярно.
        </p>
        <div className="sm-plan-buttons" role="tablist">
          {(Object.keys(plans) as PlanKey[]).map((key) => (
            <button
              key={key}
              role="tab"
              aria-selected={plan === key}
              className={`sm-plan-btn${plan === key ? " sm-plan-btn--active" : ""}`}
              onClick={() => setPlan(key)}
            >
              {plans[key].label}
            </button>
          ))}
        </div>
        <ul className="sm-plan">
          {plans[plan].days.map((d) => (
            <li className="sm-plan-day" key={d.day}>
              <span className="sm-plan-name">{d.day}</span>
              <span className="sm-plan-what">{d.what}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="sm-band" aria-label="Шаблони постів">
        <div className="sm-wrap">
          <p className="sm-label">Крок 5</p>
          <h2 className="sm-h2">Шаблони постів</h2>
          <p className="sm-p">
            Підставте свої правдиві дані замість слів у квадратних дужках.
            Копіювання відбувається у вашому браузері, дані нікуди не
            надсилаються.
          </p>
          <div className="sm-templates">
            {templates.map((t, i) => (
              <article className="sm-template" key={t.title}>
                <h3 className="sm-template-title">{t.title}</h3>
                <div className="sm-template-bubble">{t.body}</div>
                <button
                  type="button"
                  className="sm-copy"
                  onClick={() => copyTemplate(i, t.body)}
                >
                  Скопіювати
                </button>
                {copied === i && (
                  <span className="sm-copy-note">Скопійовано</span>
                )}
                {failed === i && (
                  <span className="sm-copy-note">
                    Не вдалося скопіювати, виділіть текст вручну
                  </span>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="sm-wrap sm-section"
        aria-label="Спілкування з підписниками"
      >
        <p className="sm-label">Крок 6</p>
        <h2 className="sm-h2">Як спілкуватися з підписниками</h2>
        <ul className="sm-talk">
          {talkRules.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>

      <section className="sm-band sm-band--law" aria-label="Правила і закон">
        <div className="sm-wrap">
          <p className="sm-label">Важливо</p>
          <h2 className="sm-h2">Правила майданчиків і закон</h2>
          <div className="sm-rules">
            {rules.map((r) => (
              <article className="sm-rule" key={r.title}>
                <h3 className="sm-rule-title">{r.title}</h3>
                <p className="sm-rule-text">{r.text}</p>
                <p className="sm-rule-tip">{r.tip}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sm-wrap sm-section" aria-label="Типові помилки">
        <p className="sm-label">Помилки</p>
        <h2 className="sm-h2">Типові помилки й як їх виправити</h2>
        <div className="sm-mistakes">
          {mistakes.map((m) => (
            <div className="sm-mistake" key={m.wrong}>
              <p className="sm-mistake-wrong">{m.wrong}</p>
              <p className="sm-mistake-fix">{m.fix}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="sm-band" aria-label="Чек-лист запуску">
        <div className="sm-wrap sm-wrap--narrow">
          <p className="sm-label">Перевірка</p>
          <h2 className="sm-h2">Чек-лист запуску</h2>
          <p className="sm-p">
            Відмічайте готове. Готово: {doneCount} з {startChecklist.length}.
          </p>
          <ul className="sm-check">
            {startChecklist.map((c, i) => (
              <li key={c}>
                <label
                  className={`sm-check-item${done[i] ? " sm-check-item--done" : ""}`}
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
        </div>
      </section>

      <div className="sm-wrap sm-section">
        <h3 className="sm-small-title">Читайте також</h3>
        <div className="sm-related">
          <Link to="/farm-brand" className="sm-related-link">
            Бренд господарства
          </Link>
          <Link to="/animal-photo-video" className="sm-related-link">
            Фото і відео тварин для продажу
          </Link>
          <Link to="/sale-listings" className="sm-related-link">
            Оголошення про продаж
          </Link>
        </div>
      </div>

      <footer className="sm-footer">
        <p>
          Відомості про можливості Telegram, правила Meta щодо тварин, закон про
          фото людей і відповідальність за жорстоке поводження перевірено за
          офіційними й профільними джерелами станом на 13 листопада 2026 року.
          Правила майданчиків і закони змінюються. План публікацій і шаблони
          постів це практичні поради, а не вимоги закону.
        </p>
      </footer>
    </div>
  );
}
