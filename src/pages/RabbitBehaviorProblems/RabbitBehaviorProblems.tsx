import { useState } from "react";
import { Link } from "react-router-dom";
import "./RabbitBehaviorProblems.css";

interface BehaviorItem {
  id: string;
  icon: string;
  title: string;
  causes: string[];
  fixes: string[];
  warning?: string;
  danger?: string;
}

const behaviors: BehaviorItem[] = [
  {
    id: "bar-chewing",
    icon: "🦷",
    title: "Гризе прути клітки",
    causes: [
      "Замала клітка — кролик не може нормально рухатись",
      "Нудьга і відсутність стимуляції (немає іграшок, гілок для гризіння)",
      "Голод — найчастіше перед годівлею",
      "Гормональна активність у некастрованих тварин",
      "Зубний дискомфорт — кролик намагається стесати зуби",
      "Звична поведінка, закріплена увагою господаря (кролик навчився, що гризіння = реакція людини)",
    ],
    fixes: [
      "Перевір розмір клітки — мінімум 4 довжини тіла кроля у довжину",
      "Забезпеч постійний доступ до сіна — воно задовольняє потребу гризти",
      "Додай гілки безпечних порід: верба, яблуня, береза, ліщина",
      "Не реагуй на гризіння — навіть негативна увага закріплює поведінку",
      "Перевір зуби на малоклюзію (неправильний прикус)",
      "Кастрація/стерилізація зменшує гормональну тривожність",
    ],
    warning:
      "Металева стружка від прутів може потрапляти в ШКТ. Регулярно перевіряй стан прутів.",
    danger:
      "Якщо гризіння постійне та інтенсивне + кролик не їсть, не рухається — це може бути зубний біль або ШКТ-стаз. Потрібен огляд ветеринара.",
  },
  {
    id: "thumping",
    icon: "🦵",
    title: "Б'є лапами (тупотить)",
    causes: [
      "Страх або сприйнятий хижак (різкі звуки, запахи, незнайомі люди)",
      "Роздратування — його потурбували під час відпочинку або взяли на руки",
      "Територіальна поведінка, особливо у некастрованих самок під час псевдовагітності",
      "Навчена поведінка — тупіт привертає увагу господаря",
      "Біль або дискомфорт — один з небагатьох способів кроля сигналізувати про погане самопочуття",
    ],
    fixes: [
      "Знайди і усунь подразник — перевір навколишнє середовище",
      "Не карай за тупіт — це природня комунікація",
      "Сядь на підлогу, говори спокійно, не хапай кроля",
      "Якщо тупіт регулярний і без очевидної причини — перевір здоров'я",
      "Забезпеч укриття в клітці — кролик повинен мати місце ховатись",
    ],
    danger:
      "Постійний тупіт у поєднанні зі зміною апетиту, позою горбатого кроля або відмовою від руху — ознака болю. Терміновий огляд ветеринара.",
  },
  {
    id: "aggression",
    icon: "😠",
    title: "Агресія: кусає, дряпає, атакує",
    causes: [
      "Статеві гормони — некастровані кролі обох статей значно агресивніші",
      "Страх — кролик атакує, коли відчуває загрозу і не може втекти",
      "Біль або хвороба — раптова агресія у спокійного кроля майже завжди означає біль",
      "Захист території (клітки, миски, улюбленого місця)",
      "Невірне поводження: підйом зверху, різкі рухи, порушення особистого простору",
      "Негативний досвід у минулому — кролі мають добру пам'ять",
    ],
    fixes: [
      "Кастрація/стерилізація — найефективніший метод зниження агресії",
      "Ніколи не хапай кроля зверху — підходь збоку, на рівні підлоги",
      "Не вдягай рукавиці 'для захисту' — кролик відчуває запах і стає агресивнішим",
      "Дозволь кролю самому виходити з клітки та заходити назад",
      "Ігнорування укусу (без крику) прибирає 'нагороду' за агресію",
    ],
    warning:
      "Раптова агресія у дорослого кастрованого кроля, який раніше був спокійним — червоний прапорець. Перш за все виключи біль.",
    danger:
      "Укус кроля може бути глибоким. Промий рану, оброби антисептиком. При сильному укусі або ознаках запалення — до лікаря.",
  },
  {
    id: "digging",
    icon: "🕳️",
    title: "Риє підстилку, копає в кутку",
    causes: [
      "Природній інстинкт — особливо у самок (інстинкт нори)",
      "Нудьга та надлишок енергії",
      "Псевдовагітність у некастрованих самок — риє 'гніздо'",
      "Стрес або тривога",
    ],
    fixes: [
      "Це нормальна поведінка — не карай",
      "Дай безпечне місце для копання: скринька з піском або тирсою",
      "Збільш фізичну активність і простір для вигулу",
      "При підозрі на псевдовагітність — поклади маточник з матеріалом для гнізда",
    ],
  },
  {
    id: "circling",
    icon: "🔄",
    title: "Нарізає кола навколо ніг / об'єктів",
    causes: [
      "Статева поведінка у некастрованих тварин — підготовка до спарювання",
      "Нав'язлива поведінка при стресі (стереотипія)",
      "Неврологічна проблема — рідко, але можливо (E. cuniculi)",
    ],
    fixes: [
      "Кастрація/стерилізація повністю усуває гормональні кола",
      "Перевір на наявність інших неврологічних симптомів (нахил голови, втрата рівноваги)",
    ],
    danger:
      "Якщо кола супроводжуються нахилом голови або втратою рівноваги — підозра на E. cuniculi або отит. Потрібна діагностика.",
  },
  {
    id: "spraying",
    icon: "💧",
    title: "Бризкає сечею (маркування)",
    causes: [
      "Статева поведінка — некастровані самці та самки мітять територію",
      "Поява нової тварини або людини в будинку",
      "Зміна обстановки, стрес",
    ],
    fixes: [
      "Кастрація/стерилізація усуває маркування у переважній більшості випадків",
      "Ретельно відмивай помічені місця ферментним засобом (не хлором — хлор не нейтралізує запах сечі)",
      "Не карай — покарання посилює стрес і маркування",
    ],
  },
  {
    id: "overgrooming",
    icon: "🪮",
    title: "Надмірне вилизування / виривання шерсті",
    causes: [
      "Зовнішні паразити: хутровий кліщ, воші, власоїди",
      "Алергія на корм або підстилку",
      "Стрес і нудьга (замала клітка, ізоляція)",
      "Самка вириває пух для гнізда перед окролом або при псевдовагітності — це норма",
    ],
    fixes: [
      "Перевір шкіру і шерсть на паразитів (лупа, кліщі)",
      "Виключи алергени — зміни підстилку, провір склад корму",
      "Збагати середовище: іграшки, гілки, простір",
    ],
    warning:
      "Якщо кролик вириває шерсть у інших тварин (барберинг) — перевір стрес у групі, можливо потрібне розсадження.",
  },
];

// Зведена таблиця
const quickRef = [
  {
    behavior: "Гризе прути",
    likelyCause: "Нудьга, замала клітка, зуби",
    urgent: false,
  },
  {
    behavior: "Тупотить раз-два",
    likelyCause: "Переляк, роздратування",
    urgent: false,
  },
  {
    behavior: "Тупотить постійно",
    likelyCause: "Біль, хронічний стрес",
    urgent: true,
  },
  { behavior: "Кусає без причини", likelyCause: "Біль, гормони", urgent: true },
  {
    behavior: "Нарізає кола",
    likelyCause: "Гормони (норма) або неврологія",
    urgent: false,
  },
  {
    behavior: "Нахил голови + кола",
    likelyCause: "E. cuniculi, отит",
    urgent: true,
  },
  {
    behavior: "Маркує сечею",
    likelyCause: "Гормональна поведінка",
    urgent: false,
  },
  {
    behavior: "Вириває шерсть",
    likelyCause: "Паразити, стрес, псевдовагітність",
    urgent: false,
  },
];

const RabbitBehaviorProblems = () => {
  const [openCards, setOpenCards] = useState<Record<string, boolean>>({
    "bar-chewing": true,
  });

  const toggle = (id: string) => {
    setOpenCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <main className="rbp-page">
      <div className="rbp-hero">
        <h1 className="rbp-hero__title">Проблемна поведінка кролів</h1>
        <p className="rbp-hero__sub">
          Гризе прути, б'є лапами, атакує — причини та що робити
        </p>
      </div>

      <div className="rbp-note">
        <span className="rbp-note__icon">⚠️</span>
        <span>
          Будь-яка <strong>раптова зміна поведінки</strong> у дорослого кроля,
          який раніше поводився нормально — перш за все виключи{" "}
          <strong>біль або хворобу</strong>. Кролі приховують нездужання до
          останнього і часто виражають дискомфорт саме через поведінку.
        </span>
      </div>

      {/* ЗВЕДЕНА ТАБЛИЦЯ */}
      <section className="rbp-section">
        <div className="rbp-section__header">
          <span className="rbp-section__icon">📋</span>
          <h2 className="rbp-section__title">Швидкий довідник</h2>
        </div>
        <div className="rbp-table-wrap">
          <table className="rbp-table">
            <thead>
              <tr>
                <th>Поведінка</th>
                <th>Найімовірніша причина</th>
                <th>Терміново?</th>
              </tr>
            </thead>
            <tbody>
              {quickRef.map((row) => (
                <tr key={row.behavior}>
                  <td>{row.behavior}</td>
                  <td>{row.likelyCause}</td>
                  <td
                    style={{
                      color: row.urgent ? "#c0392b" : "#27ae60",
                      fontWeight: 600,
                    }}
                  >
                    {row.urgent ? "Так" : "Ні"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ДЕТАЛЬНІ КАРТКИ */}
      <section className="rbp-section">
        <div className="rbp-section__header">
          <span className="rbp-section__icon">🔍</span>
          <h2 className="rbp-section__title">Детально по кожній поведінці</h2>
        </div>

        <div className="rbp-cards">
          {behaviors.map((b) => {
            const isOpen = !!openCards[b.id];
            return (
              <div key={b.id} className="rbp-card">
                <button
                  className="rbp-card__head"
                  onClick={() => toggle(b.id)}
                  aria-expanded={isOpen}
                >
                  <span>{b.icon}</span>
                  <span>{b.title}</span>
                  <span
                    className={`rbp-card__chevron${isOpen ? " rbp-card__chevron--open" : ""}`}
                  >
                    ▼
                  </span>
                </button>

                {isOpen && (
                  <div className="rbp-card__body">
                    <div className="rbp-block">
                      <div className="rbp-block__label rbp-block__label--cause">
                        Причини
                      </div>
                      <ul className="rbp-list">
                        {b.causes.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="rbp-block">
                      <div className="rbp-block__label rbp-block__label--fix">
                        Що робити
                      </div>
                      <ul className="rbp-list">
                        {b.fixes.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </div>

                    {b.warning && (
                      <div className="rbp-block">
                        <div className="rbp-block__label rbp-block__label--warn">
                          Зверни увагу
                        </div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "0.9rem",
                            lineHeight: 1.5,
                          }}
                        >
                          {b.warning}
                        </p>
                      </div>
                    )}

                    {b.danger && (
                      <div className="rbp-danger">
                        <span className="rbp-danger__icon">🚨</span>
                        <span>{b.danger}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ЗАГАЛЬНІ ПРИНЦИПИ */}
      <section className="rbp-section">
        <div className="rbp-section__header">
          <span className="rbp-section__icon">💡</span>
          <h2 className="rbp-section__title">Загальні принципи</h2>
        </div>
        <ul className="rbp-list" style={{ paddingLeft: "1.4rem" }}>
          <li>
            <strong>Ніколи не карай</strong> кроля фізично або криком — це лише
            посилює стрес і страх, і поведінка стає гіршою
          </li>
          <li>
            <strong>Кастрація/стерилізація</strong> вирішує або значно зменшує
            більшість гормонально обумовлених проблем: агресію, маркування,
            гризіння, кола
          </li>
          <li>
            <strong>Сіно без обмежень</strong> — найкращий замінник гризіння
            прутів і природна стимуляція ШКТ
          </li>
          <li>
            <strong>Простір і збагачення середовища</strong> усувають більшість
            поведінкових проблем, пов'язаних із нудьгою
          </li>
          <li>
            <strong>Раптова зміна</strong> в поведінці завжди вимагає виключення
            болю та хвороби до будь-яких поведінкових втручань
          </li>
        </ul>
      </section>

      {/* ПОСИЛАННЯ */}
      <section className="rbp-section">
        <div className="rbp-section__header">
          <span className="rbp-section__icon">🔗</span>
          <h2 className="rbp-section__title">Пов'язані розділи</h2>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {[
            { to: "/neutering", label: "Кастрація та стерилізація" },
            { to: "/diseases", label: "Хвороби" },
            { to: "/pain-management", label: "Знеболення" },
            { to: "/parasites", label: "Паразити" },
            { to: "/enclosure", label: "Клітки та житло" },
            { to: "/mating-behavior", label: "Поведінка при злучці" },
            { to: "/symptoms", label: "Симптоматичний пошук" },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                display: "inline-block",
                padding: "0.35rem 0.75rem",
                borderRadius: "20px",
                background: "var(--green-pale, #f1f8ee)",
                color: "var(--green-dark, #2d5a27)",
                textDecoration: "none",
                fontSize: "0.88rem",
                border: "1px solid var(--green-light, #c8e6c0)",
                fontWeight: 500,
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>
      <div className="rbp-section-back">
        <Link to="/" className="rbp-section-back-btn">
          ⬅ На головну
        </Link>
      </div>
    </main>
  );
};

export default RabbitBehaviorProblems;
