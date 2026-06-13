import { useState } from "react";
import { Link } from "react-router-dom";
import "./SeasonalMolting.css";

interface PathoCard {
  id: string;
  icon: string;
  title: string;
  zoonosis?: boolean;
  symptoms: string[];
  treatment: string[];
  note?: string;
}

const pathoCards: PathoCard[] = [
  {
    id: "cheyletiella",
    icon: "🦟",
    title: "Хутровий кліщ (Cheyletiella parasitovorax) — «жива лупа»",
    zoonosis: true,
    symptoms: [
      "Рясна суха лупа на холці та спині — характерна ознака",
      "Клапті шерсті з прикріпленими лусками шкіри",
      "Свербіж — від відсутнього до помірного",
      "Почервоніння шкіри під шерстю",
      "При огляді лупа може «рухатись» — це самі кліщі",
    ],
    treatment: [
      "Івермектин підшкірно або перорально — 2 ін'єкції з інтервалом 14 днів",
      "Стронгхолд (селамектин) крапелі на холку — ефективна альтернатива",
      "Обробка всіх контактних тварин одночасно",
      "Дезінфекція клітки — кліщ виживає поза господарем до місяця",
    ],
    note: "Зооноз: передається людині, викликає свербливі папули на руках і тулубі. При появі висипань у людей — до дерматолога.",
  },
  {
    id: "ringworm",
    icon: "🔵",
    title: "Стригучий лишай (дерматофітоз, Trichophyton / Microsporum)",
    zoonosis: true,
    symptoms: [
      "Кругові або овальні облисілі плями з лусками по краях",
      "Найчастіше на голові, вухах, навколо очей, носі",
      "Шкіра в зоні ураження суха, сіро-біла, іноді з кірочками",
      "Свербіж зазвичай слабкий або відсутній",
      "Хворіє частіше молодняк і ослаблені тварини",
    ],
    treatment: [
      "Місцеве лікування: міконазол або клотримазол крем — для невеликих ділянок",
      "Системне лікування (ітраконазол, тербінафін перорально) — при поширеному ураженні, призначає ветеринар",
      "Продовжувати лікування ще 2 тижні після зникнення симптомів",
      "Спори грибка виживають у середовищі місяцями — ретельна дезінфекція клітки",
    ],
    note: "Зооноз: легко передається людині, особливо дітям. При появі кільцеподібних плям на шкірі людини — терміново до дерматолога.",
  },
  {
    id: "barbering",
    icon: "✂️",
    title: "Барберинг — виривання шерсті",
    symptoms: [
      "Ділянки вкороченої або відсутньої шерсті без пошкодження шкіри",
      "Шкіра під плямами чиста, без лусок і запалення",
      "Може бути самовиривання (стрес) або виривання сусідом по клітці",
      "Частіше уражаються холка, боки, вуха",
    ],
    treatment: [
      "Виключи паразитів і грибок — зовні схоже",
      "При виривання сусідом — розсади або збагати середовище",
      "Усунь джерело стресу: перенаселеність, нестача корму, зміна обстановки",
      "Самовиривання шерсті самкою перед окролом або при псевдовагітності — норма",
    ],
  },
  {
    id: "hormonal",
    icon: "🔬",
    title: "Гормональна та стресова алопеція",
    symptoms: [
      "Дифузне рівномірне рідіння шерсті без чітких меж",
      "Часто на животі і боках у некастрованих самок",
      "Шкіра не змінена",
      "Може супроводжуватись псевдовагітністю, частими злучками, стресом",
    ],
    treatment: [
      "Кастрація/стерилізація усуває гормональні причини",
      "Нормалізація режиму злучок — надто інтенсивна схема виснажує самку",
      "Поліпшення умов утримання і зниження стресових факторів",
    ],
  },
  {
    id: "urine-scald",
    icon: "💧",
    title: "Опік сечею (urine scald)",
    symptoms: [
      "Облисіння на животі, між задніми лапами, навколо геніталій",
      "Шкіра почервоніла, волога, іноді з кірочками або виразками",
      "Характерний запах сечі від уражених ділянок",
      "Часто у тварин з обмеженою рухливістю, ожирінням, артритом",
    ],
    treatment: [
      "Знайти і усунути причину: артрит, ожиріння, нейрологія (E. cuniculi)",
      "Чищення ураженої шкіри м'яким засобом, зсушування",
      "Захисні креми (цинк-оксидна мазь) — після консультації з ветеринаром",
      "Поліпшення гігієни клітки — суха підстилка",
    ],
    note: "Облисіння від опіку сечею вказує на глибшу проблему. Потрібен ветеринарний огляд для виявлення причини.",
  },
];

const SeasonalMolting = () => {
  const [openCards, setOpenCards] = useState<Record<string, boolean>>({
    cheyletiella: true,
  });

  const toggle = (id: string) =>
    setOpenCards((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <main className="molt-page">
      <div className="molt-hero">
        <h1 className="molt-hero__title">Линька: норма та патологія</h1>
        <p className="molt-hero__sub">
          Сезонна линька vs хворобне випадіння шерсті — як розрізнити і що
          робити
        </p>
      </div>

      <div className="molt-note">
        <span className="molt-note__icon">⚠️</span>
        <span>
          Головне правило: при нормальній линьці шкіра під шерстю{" "}
          <strong>завжди чиста і непошкоджена</strong>. Будь-яке почервоніння,
          лупа, кірочки, мокра шкіра або різкий запах — ознака патології, не
          линьки.
        </span>
      </div>

      {/* НОРМА vs ПАТОЛОГІЯ */}
      <section className="molt-section">
        <div className="molt-section__header">
          <span className="molt-section__icon">⚖️</span>
          <h2 className="molt-section__title">
            Норма vs патологія: швидке порівняння
          </h2>
        </div>
        <div className="molt-compare">
          <div className="molt-compare-card molt-compare-card--normal">
            <div className="molt-compare-card__title">✅ Нормальна линька</div>
            <ul className="molt-compare-card__list">
              <li>
                Шерсть випадає <strong>рівномірно</strong> по всьому тілу
              </li>
              <li>Починається від голови, рухається до крупу</li>
              <li>Видна лінія між старою і новою шерстю</li>
              <li>Шкіра під шерстю чиста, рожева, непошкоджена</li>
              <li>Немає лупи, кірочок, мокрих ділянок</li>
              <li>Апетит, поведінка, послід — в нормі</li>
              <li>Може бути підвищена чутливість до дотику</li>
              <li>Триває 2–6 тижнів</li>
            </ul>
          </div>
          <div className="molt-compare-card molt-compare-card--patho">
            <div className="molt-compare-card__title">
              🚨 Патологічне випадіння
            </div>
            <ul className="molt-compare-card__list">
              <li>
                Облисіння <strong>плямами</strong> з чіткими краями
              </li>
              <li>
                Шкіра під шерстю: червона, суха, з лусками, мокра або з
                кірочками
              </li>
              <li>Виражена лупа або «жива лупа» (рухається)</li>
              <li>Кролик чухається, гризе себе, уникає дотику</li>
              <li>Шерсть виривається клаптями з прикріпленою шкірою</li>
              <li>Зміни апетиту або поведінки</li>
              <li>Запах від ураженої ділянки</li>
              <li>Не відновлюється через 6–8 тижнів</li>
            </ul>
          </div>
        </div>
      </section>

      {/* СЕЗОННИЙ ЦИКЛ */}
      <section className="molt-section">
        <div className="molt-section__header">
          <span className="molt-section__icon">🗓️</span>
          <h2 className="molt-section__title">Сезонний цикл линьки</h2>
        </div>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.6, margin: "0 0 1rem" }}>
          Кролики линяють приблизно <strong>4 рази на рік</strong> — 2 великі і
          2 малі линьки. Тривалість кожної — від 2 до 6 тижнів. Цикл регулюється
          тривалістю світлового дня, а не лише температурою.
        </p>
        <div className="molt-seasons">
          <div className="molt-season">
            <div className="molt-season__label">Весна (березень–травень)</div>
            <span className="molt-season__badge molt-season__badge--heavy">
              Велика линька
            </span>
            <p className="molt-season__text">
              Скидається густа зимова шерсть. Найінтенсивніша — в будинку
              «торнадо» з шерсті. Важливо посилити вичісування і збільшити сіно.
            </p>
          </div>
          <div className="molt-season">
            <div className="molt-season__label">Літо (червень–серпень)</div>
            <span className="molt-season__badge molt-season__badge--light">
              Мала линька
            </span>
            <p className="molt-season__text">
              Легке рідіння. Може бути непомітним. Кролик формує тонку літню
              шерсть.
            </p>
          </div>
          <div className="molt-season">
            <div className="molt-season__label">Осінь (вересень–листопад)</div>
            <span className="molt-season__badge molt-season__badge--heavy">
              Велика линька
            </span>
            <p className="molt-season__text">
              Виростає густа зимова шерсть. Також інтенсивна. Одночасно з
              осінньою вакцинацією — зручний час для огляду шкіри.
            </p>
          </div>
          <div className="molt-season">
            <div className="molt-season__label">Зима (грудень–лютий)</div>
            <span className="molt-season__badge molt-season__badge--light">
              Мала линька
            </span>
            <p className="molt-season__text">
              Найменш виражена. Іноді майже непомітна. У кролів у теплих
              приміщеннях з постійним штучним освітленням цикл може зсуватись
              або линька стає рівномірною цілий рік.
            </p>
          </div>
        </div>

        <div className="molt-danger" style={{ marginTop: "1rem" }}>
          <span className="molt-danger__icon">💡</span>
          <span>
            Кролі в приміщенні з постійним штучним освітленням і сталою
            температурою можуть линяти <strong>майже безперервно</strong>{" "}
            протягом року — це не патологія, а збій циркадного ритму. Допомагає
            природне освітлення або регульований фотоперіод.
          </span>
        </div>
      </section>

      {/* ТАБЛИЦЯ ДІАГНОСТИКИ */}
      <section className="molt-section">
        <div className="molt-section__header">
          <span className="molt-section__icon">📋</span>
          <h2 className="molt-section__title">Таблиця швидкої діагностики</h2>
        </div>
        <div className="molt-table-wrap">
          <table className="molt-table">
            <thead>
              <tr>
                <th>Що бачиш</th>
                <th>Найімовірніша причина</th>
                <th>Терміново?</th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "Рівномірна втрата шерсті, чиста шкіра",
                  "Сезонна линька — норма",
                  "Ні",
                ],
                [
                  "Рясна лупа на холці, «жива лупа»",
                  "Хутровий кліщ (Cheyletiella)",
                  "Так",
                ],
                [
                  "Круглі плями з лусками, голова/вуха",
                  "Стригучий лишай (дерматофітоз)",
                  "Так",
                ],
                [
                  "Плями без змін шкіри, без лупи",
                  "Барберинг (стрес або сусід)",
                  "Ні",
                ],
                [
                  "Облисіння живота, запах сечі, мокра шкіра",
                  "Опік сечею — шукай причину",
                  "Так",
                ],
                [
                  "Рівномірне рідіння шерсті у самки",
                  "Гормони, псевдовагітність",
                  "Ні",
                ],
                [
                  "Линька не закінчується більше 8 тижнів",
                  "Штучне освітлення або хвороба",
                  "Консультація",
                ],
                [
                  "Шерсть з кров'ю або відкриті рани",
                  "Травма, дерматит, гризіння кліткою",
                  "Так",
                ],
              ].map(([що, причина, терм]) => (
                <tr key={що}>
                  <td>{що}</td>
                  <td>{причина}</td>
                  <td
                    style={{
                      color:
                        терм === "Так"
                          ? "#c0392b"
                          : терм === "Ні"
                            ? "#27ae60"
                            : "#e67e22",
                      fontWeight: 600,
                    }}
                  >
                    {терм}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ПАТОЛОГІЧНІ ПРИЧИНИ */}
      <section className="molt-section">
        <div className="molt-section__header">
          <span className="molt-section__icon">🩺</span>
          <h2 className="molt-section__title">
            Патологічні причини випадіння шерсті
          </h2>
        </div>
        <div className="molt-patho-cards">
          {pathoCards.map((card) => {
            const isOpen = !!openCards[card.id];
            return (
              <div key={card.id} className="molt-patho-card">
                <button
                  className="molt-patho-card__head"
                  onClick={() => toggle(card.id)}
                  aria-expanded={isOpen}
                >
                  <span>{card.icon}</span>
                  <span>
                    {card.title}
                    {card.zoonosis && (
                      <span className="molt-zoo-tag">зооноз</span>
                    )}
                  </span>
                  <span
                    className={`molt-patho-card__chevron${isOpen ? " molt-patho-card__chevron--open" : ""}`}
                  >
                    ▼
                  </span>
                </button>
                {isOpen && (
                  <div className="molt-patho-card__body">
                    <div className="molt-row">
                      <div className="molt-row__label molt-row__label--sym">
                        Симптоми
                      </div>
                      <ul className="molt-list">
                        {card.symptoms.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="molt-row">
                      <div className="molt-row__label molt-row__label--treat">
                        Лікування
                      </div>
                      <ul className="molt-list">
                        {card.treatment.map((t, i) => (
                          <li key={i}>{t}</li>
                        ))}
                      </ul>
                    </div>
                    {card.note && (
                      <div className="molt-danger">
                        <span className="molt-danger__icon">🚨</span>
                        <span>{card.note}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ДОГЛЯД ПІД ЧАС ЛИНЬКИ */}
      <section className="molt-section">
        <div className="molt-section__header">
          <span className="molt-section__icon">🪮</span>
          <h2 className="molt-section__title">
            Догляд під час нормальної линьки
          </h2>
        </div>
        <div className="molt-tips">
          {[
            {
              icon: "🌾",
              text: "Сіно без обмежень — найважливіше під час линьки. Клітковина рухає проковтнуту шерсть через кишечник і запобігає утворенню трихобезоарів (волосяних кульок).",
            },
            {
              icon: "💧",
              text: "Постійний доступ до чистої води — зневоднений кишечник погано виводить шерсть. Краще чашкова поїлка — кролики п'ють більше з неї, ніж з ніпеля.",
            },
            {
              icon: "🖐️",
              text: "Вичісуй щодня або через день: гумова рукавичка, м'яка щітка або спеціальна гребінка. Знімає мертву шерсть і знижує кількість проковтнутої.",
            },
            {
              icon: "👀",
              text: "Огляд шкіри під шерстю під час вичісування — найкращий момент помітити лупу, кліщів або лишай на ранній стадії.",
            },
            {
              icon: "🚫",
              text: "Не купай кроля під час линьки і без потреби взагалі — це сильний стрес і ризик переохолодження. Забруднені ділянки протирай вологою серветкою локально.",
            },
            {
              icon: "🥦",
              text: "Свіжа зелень і трохи свіжих овочів під час линьки — додаткова вода і вітаміни. Вводь обережно, якщо кролик не звик.",
            },
          ].map((tip, i) => (
            <div key={i} className="molt-tip">
              <span className="molt-tip__icon">{tip.icon}</span>
              <span>{tip.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ПОСИЛАННЯ */}
      <section className="molt-section">
        <div className="molt-section__header">
          <span className="molt-section__icon">🔗</span>
          <h2 className="molt-section__title">Пов'язані розділи</h2>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {[
            { to: "/parasites", label: "Паразити" },
            { to: "/diseases", label: "Хвороби" },
            { to: "/grooming", label: "Кігті та зуби" },
            { to: "/care", label: "Догляд" },
            { to: "/zoonoses", label: "Зоонози" },
            { to: "/symptoms", label: "Симптоматичний пошук" },
            { to: "/feeding", label: "Годування" },
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
      <div className="molt-section-back">
        <Link to="/" className="molt-section-back-btn">
          ⬅ На головну
        </Link>
      </div>
    </main>
  );
};

export default SeasonalMolting;
