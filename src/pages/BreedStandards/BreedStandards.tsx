import { useState } from "react";
import "./BreedStandards.css";

const SCORING_ARBA = [
  {
    part: "Тип тіла (Body type)",
    points: 55,
    desc: "Форма, пропорції, м'язовість, тип (комерційний, компактний, напівзігнутий тощо)",
  },
  {
    part: "Хутро (Fur)",
    points: 15,
    desc: "Довжина, щільність, текстура, тип — flyback, rollback або standing",
  },
  {
    part: "Колір (Color)",
    points: 15,
    desc: "Відповідність еталону породи: тон, рівномірність, підшерсток",
  },
  {
    part: "Кондиція (Condition)",
    points: 10,
    desc: "Загальний стан, чистота, мускулатура, здоров'я",
  },
  {
    part: "Інше (голова, вуха, очі, лапи)",
    points: 5,
    desc: "Залежить від породи — для деяких порід пропорції голови чи довжина вух мають більшу вагу",
  },
];

const SCORING_BRC = [
  {
    part: "Колір (Colour)",
    points: 30,
    desc: "Колір та малюнок — у BRC це найважливіший критерій",
  },
  {
    part: "Розмір і вага (Size and Weight)",
    points: 20,
    desc: "Відповідність ваговим лімітам породи",
  },
  { part: "Тіло (Body)", points: 15, desc: "Форма, тип, м'язовість" },
  {
    part: "Лапи та ноги (Legs and Feet)",
    points: 15,
    desc: "Постава, кістяк, паралельність задніх лап",
  },
  {
    part: "Голова та вуха (Head and Ears)",
    points: 10,
    desc: "Пропорції, форма, постановка вух",
  },
  {
    part: "Шерсть і кондиція (Coat and Condition)",
    points: 10,
    desc: "Якість хутра, загальний стан",
  },
];

const ORGS = [
  {
    id: "arba",
    name: "ARBA",
    full: "American Rabbit Breeders Association",
    flag: "🇺🇸",
    founded: "1910",
    country: "США",
    breeds: "53",
    site: "arba.net",
    desc: "Найбільша кролівницька організація Північної Америки. Публікує «Standard of Perfection» кожні 5 років. Оцінка — 100 балів, акцент на тип тіла (55 балів). Визнає 53 породи кролів.",
    features: [
      "Standard of Perfection — офіційна книга стандартів, видається кожні 5 років",
      "53 офіційно визнані породи",
      "Система реєстрації — ARBA Registrar присвоює статус Grand Champion",
      "Татуювання в правому вусі — обов'язкове для всіх виставкових тварин",
      "Вікові класи: Pre-Junior, Junior, Intermediate, Senior",
    ],
  },
  {
    id: "brc",
    name: "BRC",
    full: "British Rabbit Council",
    flag: "🇬🇧",
    founded: "1934",
    country: "Велика Британія",
    breeds: "70+",
    site: "thebrc.org",
    desc: "Британська рада кролів — найстаріша офіційна організація. Визнає понад 70 порід, включаючи багато редкісних европейських. Акцент на колір і малюнок (30 балів), а не лише тіло.",
    features: [
      "Breed Standards Book — публікується кожні 4–5 років",
      "70+ визнаних порід — більше ніж в ARBA",
      "Кільця (rings) — металеве кільце на лапі замість татуювання",
      "Fancy та Lop breeds — окрема класифікація декоративних порід",
      "Rare Varieties Club — захист малочисельних порід",
    ],
  },
  {
    id: "ee",
    name: "EE",
    full: "Entente Européenne d'Aviculture et de Cuniculture",
    flag: "🇪🇺",
    founded: "1938",
    country: "Люксембург",
    breeds: "60+",
    site: "entente-ee.eu",
    desc: "Європейський союз заводчиків — об'єднує 31 країну та близько 2,5 млн членів. Проводить Чемпіонат Європи. Стандарти EE є компромісом між національними стандартами країн-учасниць.",
    features: [
      "31 країна-учасниця, ~2,5 млн членів",
      "Чемпіонат Європи — проводиться кожні 2–3 роки",
      "Стандарти EE — узгоджені між всіма країнами-членами",
      "Україна не є офіційним членом EE",
      "Оцінка до 100 балів, схема близька до BRC",
    ],
  },
];

const FUR_TYPES = [
  {
    type: "Flyback",
    ua: "Зворотне хутро",
    desc: "При проведенні рукою від хвоста до голови — хутро миттєво повертається в початкове положення. Коротке, щільне.",
    breeds: "Нова Зеландська, Каліфорнійська, Шиншила",
    icon: "↩️",
  },
  {
    type: "Rollback",
    ua: "Що повертається",
    desc: "Хутро повільно і плавно повертається після проведення рукою. Довше ніж flyback, м'якше.",
    breeds: "Метелик, Срібляста",
    icon: "🌀",
  },
  {
    type: "Standing",
    ua: "Пряме (стояче)",
    desc: "Хутро не повертається при проведенні рукою — стоїть перпендикулярно шкірі. Унікальна текстура.",
    breeds: "Рекс (Rex), Міні-Рекс",
    icon: "⬆️",
  },
  {
    type: "Wool",
    ua: "Вовняне",
    desc: "Довга вовна 5–15 см, вимагає регулярного грумінгу. Оцінюється довжина, рівномірність, відсутність ковтунів.",
    breeds: "Ангора, Французька ангора, Джерсі Вулі",
    icon: "🧶",
  },
  {
    type: "Satin",
    ua: "Сатинове",
    desc: "Волосяне волокно з прозорою оболонкою — надає виняткового блиску. Генетична мутація.",
    breeds: "Сатин (Satin), Міні-Сатин",
    icon: "✨",
  },
];

const BODY_TYPES = [
  {
    type: "Commercial",
    ua: "Комерційний",
    desc: "М'ясні породи. Довге, циліндричне тіло з рівномірною м'язовою масою. Широка спина та крупа.",
    breeds: "Нова Зеландська, Каліфорнійська, Фландр",
    icon: "🥩",
  },
  {
    type: "Compact",
    ua: "Компактний",
    desc: "Коротке, кругле тіло. Голова широка, пропорційна. Вага зазвичай до 2,5 кг.",
    breeds: "Польська (Polish), Голландська, Ні",
    icon: "⬜",
  },
  {
    type: "Semi-arch / Mandolin",
    ua: "Напівзігнутий / Мандоліна",
    desc: "Вигнута лінія спини від плечей до крупа. Довге тіло, помітна арка. Характерно для великих порід.",
    breeds: "Фламандський велетень, Бельгійський заєць",
    icon: "🎸",
  },
  {
    type: "Full arch",
    ua: "Повна арка",
    desc: "Тіло зігнуте від кінчика носа до хвоста. Стоячи — схожий на дикого зайця. Активна поза.",
    breeds: "Tan, Checkered Giant",
    icon: "🌙",
  },
  {
    type: "Cylindrical",
    ua: "Циліндричний",
    desc: "Рідкісний тип — тіло рівне, без звуження. Унікальна форма.",
    breeds: "Himalayan",
    icon: "🥫",
  },
];

const UA_INFO = [
  {
    title: "Офіційні породи в Україні",
    content:
      "В Україні офіційно зареєстровані 8 вітчизняних порід: Сірий велетень, Білий велетень, Полтавське срібло, Радянська шиншила, Віденська блакитна, Чорно-бурий, Строкач (метелик), Білий пух. Також широко розводяться 5+ іноземних порід: Каліфорнійська, Нова Зеландська, Рекс, Фландр, Ангора.",
  },
  {
    title: "Регулювання в Україні",
    content:
      "Племінна робота регулюється Законом України «Про племінну справу у тваринництві». Племінні тварини реєструються у Державному племінному реєстрі. Атестацію проводить Міністерство аграрної політики. Станом на останні дані — 1 племінний завод та 7 плем-репродукторів з розведення порід кролів в Україні.",
  },
  {
    title: "Виставкова діяльність",
    content:
      "Україна не є членом EE (Entente Européenne), тому участь у Чемпіонаті Європи — через партнерські організації або в індивідуальному порядку. Внутрішні виставки організовуються громадськими кролівницькими об'єднаннями, єдиного уніфікованого стандарту оцінки на рівні держави немає.",
  },
  {
    title: "Що таке «відповідність стандарту» на практиці",
    content:
      "Для фермера-практика відповідність стандарту означає насамперед продуктивність (конверсія корму, забійний вихід, плодючість), а не виставкові бали. Виставковий стандарт і господарська цінність — різні речі. Наприклад, ідеальний за виставковими критеріями кроль може мати нижчий добовий приріст ніж гібридна м'ясна лінія.",
  },
];

const BreedStandards = () => {
  const [activeOrg, setActiveOrg] = useState("arba");
  const org = ORGS.find((o) => o.id === activeOrg)!;

  return (
    <div className="BS-page">
      <div className="BS-header">
        <span className="BS-header-icon">📋</span>
        <div>
          <h1 className="BS-title">Стандарти порід кролів</h1>
          <p className="BS-subtitle">
            Що таке стандарт, хто їх встановлює і як оцінюють тварин на
            виставках
          </p>
        </div>
      </div>

      {/* ЩО ТАКЕ СТАНДАРТ */}
      <section className="BS-section">
        <h2 className="BS-section-title">
          <span>📌</span> Що таке стандарт породи
        </h2>
        <p className="BS-text">
          Стандарт породи — це офіційний письмовий опис ідеального представника
          породи. Він визначає: форму тіла, тип хутра, допустимі кольори, вагові
          ліміти, пропорції голови та вух, а також перелік дискваліфікаційних
          ознак. Кожен критерій має числову вагу в балах. Суддя на виставці
          порівнює тварину з еталоном стандарту і виставляє оцінку.
        </p>
        <div className="BS-info-grid">
          {[
            {
              icon: "📏",
              title: "Морфологія",
              desc: "Форма тіла, пропорції, вага — основа будь-якого стандарту",
            },
            {
              icon: "🎨",
              title: "Колір і малюнок",
              desc: "Точний опис допустимих забарвлень і їх розподілу",
            },
            {
              icon: "🪮",
              title: "Тип хутра",
              desc: "Flyback, rollback, standing, wool, satin — у кожної породи своя категорія",
            },
            {
              icon: "⚠️",
              title: "Дискваліфікація",
              desc: "Чіткий перелік вад які автоматично знімають тварину з оцінки",
            },
          ].map((item) => (
            <div key={item.title} className="BS-info-card">
              <span className="BS-info-icon">{item.icon}</span>
              <div className="BS-info-title">{item.title}</div>
              <div className="BS-info-desc">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* МІЖНАРОДНІ ОРГАНІЗАЦІЇ */}
      <section className="BS-section">
        <h2 className="BS-section-title">
          <span>🌍</span> Міжнародні організації
        </h2>
        <div className="BS-org-tabs">
          {ORGS.map((o) => (
            <button
              key={o.id}
              className={`BS-org-tab${activeOrg === o.id ? " BS-org-tab--active" : ""}`}
              onClick={() => setActiveOrg(o.id)}
            >
              <span>{o.flag}</span>
              <span>{o.name}</span>
            </button>
          ))}
        </div>

        <div className="BS-org-card">
          <div className="BS-org-header">
            <span className="BS-org-flag">{org.flag}</span>
            <div>
              <div className="BS-org-name">{org.name}</div>
              <div className="BS-org-full">{org.full}</div>
            </div>
          </div>
          <div className="BS-org-meta">
            <span>📅 Засновано: {org.founded}</span>
            <span>🐇 Порід: {org.breeds}</span>
            <span>🌐 {org.site}</span>
          </div>
          <p className="BS-org-desc">{org.desc}</p>
          <ul className="BS-org-features">
            {org.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* СИСТЕМА БАЛІВ */}
      <section className="BS-section">
        <h2 className="BS-section-title">
          <span>🏆</span> Система балів: ARBA vs BRC
        </h2>
        <p className="BS-text">
          Обидві організації оцінюють тварину за 100-бальною системою, але
          розподіл балів суттєво різниться. ARBA ставить акцент на тип тіла, BRC
          — на колір і малюнок.
        </p>
        <div className="BS-scoring-grid">
          <div className="BS-scoring-col">
            <div className="BS-scoring-header BS-scoring-header--arba">
              🇺🇸 ARBA
            </div>
            {SCORING_ARBA.map((row) => (
              <div key={row.part} className="BS-scoring-row">
                <div className="BS-scoring-part">{row.part}</div>
                <div className="BS-scoring-pts BS-scoring-pts--arba">
                  {row.points}
                </div>
                <div className="BS-scoring-desc">{row.desc}</div>
              </div>
            ))}
          </div>
          <div className="BS-scoring-col">
            <div className="BS-scoring-header BS-scoring-header--brc">
              🇬🇧 BRC
            </div>
            {SCORING_BRC.map((row) => (
              <div key={row.part} className="BS-scoring-row">
                <div className="BS-scoring-part">{row.part}</div>
                <div className="BS-scoring-pts BS-scoring-pts--brc">
                  {row.points}
                </div>
                <div className="BS-scoring-desc">{row.desc}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="BS-note">
          Конкретний розподіл балів відрізняється між породами всередині однієї
          організації. Наприклад, у Рекса хутро отримує більше балів ніж у Нової
          Зеландської.
        </div>
      </section>

      {/* ТИПИ ХУТРА */}
      <section className="BS-section">
        <h2 className="BS-section-title">
          <span>🪮</span> Типи хутра за стандартом
        </h2>
        <div className="BS-fur-list">
          {FUR_TYPES.map((f) => (
            <div key={f.type} className="BS-fur-item">
              <div className="BS-fur-badge">
                <span>{f.icon}</span>
                <span className="BS-fur-type">{f.type}</span>
                <span className="BS-fur-ua">{f.ua}</span>
              </div>
              <div className="BS-fur-body">
                <div className="BS-fur-desc">{f.desc}</div>
                <div className="BS-fur-breeds">
                  <span className="BS-fur-breeds-label">Породи: </span>
                  {f.breeds}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ТИПИ ТІЛА */}
      <section className="BS-section">
        <h2 className="BS-section-title">
          <span>🐇</span> Типи тіла за стандартом ARBA
        </h2>
        <div className="BS-body-grid">
          {BODY_TYPES.map((b) => (
            <div key={b.type} className="BS-body-card">
              <div className="BS-body-icon">{b.icon}</div>
              <div className="BS-body-type">{b.type}</div>
              <div className="BS-body-ua">{b.ua}</div>
              <div className="BS-body-desc">{b.desc}</div>
              <div className="BS-body-breeds">{b.breeds}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ДИСКВАЛІФІКАЦІЯ */}
      <section className="BS-section">
        <h2 className="BS-section-title">
          <span>🚫</span> Дискваліфікація та вади
        </h2>
        <p className="BS-text">
          Кожен стандарт містить перелік: <strong>Disqualifications</strong>{" "}
          (DQ) — автоматичне зняття з виставки, та <strong>Faults</strong> —
          вади що знижують бали, але не знімають тварину.
        </p>
        <div className="BS-dq-grid">
          <div className="BS-dq-card BS-dq-card--dq">
            <div className="BS-dq-title">🚫 Дискваліфікація (DQ)</div>
            <ul className="BS-dq-list">
              <li>Неправильний прикус (малоклюзія)</li>
              <li>Крипторхізм (у самців)</li>
              <li>Слід операції або травми</li>
              <li>Вага за межами ліміту породи</li>
              <li>Хвороба або паразити</li>
              <li>Відсутність татуювання (ARBA)</li>
              <li>Колір або малюнок що не відповідає жодному стандарту</li>
              <li>Сліпота або деформація очей</li>
            </ul>
          </div>
          <div className="BS-dq-card BS-dq-card--fault">
            <div className="BS-dq-title">⬇️ Вади (Faults)</div>
            <ul className="BS-dq-list">
              <li>Нерівномірний колір або відтінок</li>
              <li>Довге або коротке тіло відносно норми</li>
              <li>Рідке хутро або слабка текстура</li>
              <li>Вуха не тієї довжини</li>
              <li>Розхилені задні лапи</li>
              <li>Слабка мускулатура</li>
              <li>Дрібні білі волоски в кольоровому хутрі</li>
              <li>Блідий або тьмяний підшерсток</li>
            </ul>
          </div>
        </div>
      </section>

      {/* УКРАЇНА */}
      <section className="BS-section">
        <h2 className="BS-section-title">
          <span>🇺🇦</span> Українські стандарти
        </h2>
        <div className="BS-ua-list">
          {UA_INFO.map((item) => (
            <div key={item.title} className="BS-ua-item">
              <div className="BS-ua-title">{item.title}</div>
              <div className="BS-ua-content">{item.content}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ПІДСУМОК */}
      <div className="BS-summary">
        <h3 className="BS-summary-title">Коротко для практика</h3>
        <ul className="BS-summary-list">
          <li>
            Стандарт — це еталон ідеальної тварини для виставки, а не для ферми
          </li>
          <li>
            ARBA (США) — 53 породи, акцент на тіло (55 балів). BRC (Британія) —
            70+ порід, акцент на колір (30 балів)
          </li>
          <li>EE — євро­пейський союз 31 країни, Україна не є членом</li>
          <li>В Україні офіційно зареєстровано 8 вітчизняних порід</li>
          <li>
            Для фермера важливіші продуктивність і конверсія корму, ніж
            виставкові бали
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BreedStandards;
