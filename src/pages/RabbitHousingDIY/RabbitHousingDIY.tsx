import { useState } from "react";
import { Link } from "react-router-dom";
import imgSingleWire from "../../assets/single-wire.webp";
import imgDoeCage from "../../assets/doe-cage.webp";
import imgNestbox from "../../assets/nestbox.webp";
import imgShed from "../../assets/shed-row.webp";
import imgFeeder from "../../assets/hay-feeder.webp";
import "./RabbitHousingDIY.css";
import ShareButton from "../../components/ShareButton/ShareButton";

/* ─── ТИПИ ─────────────────────────────────────────── */
interface Dim {
  val: string;
  name: string;
}
interface CutRow {
  part: string;
  size: string;
  mesh: string;
  qty: string;
}
interface DrawingCard {
  id: string;
  icon: string;
  title: string;
  sub: string;
  dims: Dim[];
  imageSrc: string; // Шлях до імпортованого зображення
  cutlist: CutRow[];
  steps: string[];
  tip?: string;
  warn?: string;
}

/* ─── ДАНІ ──────────────────────────────────────────── */
const drawings: DrawingCard[] = [
  {
    id: "single-wire",
    icon: "📦",
    title: "Одиночна дротяна клітка — самець / відгодівля",
    sub: "60×75×45 см · оцинкована сітка · для м'ясних порід до 5 кг",
    dims: [
      { val: "75 см", name: "Довжина" },
      { val: "60 см", name: "Ширина" },
      { val: "45 см", name: "Висота" },
    ],
    imageSrc: imgSingleWire,
    cutlist: [
      {
        part: "Підлога",
        size: "75×60 см",
        mesh: "25×12 мм (14 AWG)",
        qty: "1",
      },
      { part: "Стеля", size: "75×60 см", mesh: "50×25 мм (14 AWG)", qty: "1" },
      {
        part: "Передня стінка + двері",
        size: "75×45 см",
        mesh: "50×25 мм",
        qty: "1",
      },
      { part: "Задня стінка", size: "75×45 см", mesh: "50×25 мм", qty: "1" },
      { part: "Бічні стінки", size: "60×45 см", mesh: "50×25 мм", qty: "2" },
      {
        part: "Піддон",
        size: "79×64 см",
        mesh: "Оцинкований лист 0,5 мм",
        qty: "1",
      },
    ],
    steps: [
      "Підлогу (25×12 мм сітка) відріж за розміром, загни по периметру планкогубцями на 2–3 см вгору — буде «бортик», що тримає форму без каркасу.",
      "Стіни та стелю (50×25 мм) з'єднуй J-клямерами або С-кільцями кожні 8–10 см по шву — щільне з'єднання важливіше за кількість кріплень.",
      "Дверний отвір виріж у передній стінці: мінімум 25×30 см (щоб вільно виймати маточник). Краї загни назовні — захист від порізов.",
      "Дверцята підвішуй на J-клямери як петлі — 2 знизу як шарніри, клямка зверху.",
      "Піддон вставляй з зазором 4–5 см під підлогою — простір для вентиляції і зручне чищення.",
      "Підвісь клітку на крюках або встанови на металеві ніжки 60–80 см від підлоги — зручна висота роботи.",
    ],
    tip: "Сітку підлоги бери з маркуванням GAW (galvanized after welding) — вона стійкіша до кролячої сечі, ніж GBW (galvanized before welding).",
    warn: "Комірки підлоги більше 25×12 мм = ризик зав'язнути лапою. Для великих порід (Фландр, Сірий велетень) бери 25×25 мм підлогу.",
  },
  {
    id: "doe-cage",
    icon: "🍼",
    title: "Клітка для самки з маточником",
    sub: "90×65×50 см · місце для маточника · середні та великі породи",
    dims: [
      { val: "90 см", name: "Довжина" },
      { val: "65 см", name: "Ширина" },
      { val: "50 см", name: "Висота" },
    ],
    imageSrc: imgDoeCage,
    cutlist: [
      {
        part: "Підлога",
        size: "90×65 см",
        mesh: "25×12 мм (14 AWG)",
        qty: "1",
      },
      { part: "Стеля", size: "90×65 см", mesh: "50×25 мм (14 AWG)", qty: "1" },
      { part: "Передня стінка", size: "90×50 см", mesh: "50×25 мм", qty: "1" },
      { part: "Задня стінка", size: "90×50 см", mesh: "50×25 мм", qty: "1" },
      { part: "Бічні стінки", size: "65×50 см", mesh: "50×25 мм", qty: "2" },
      {
        part: "Baby guard (бортик)",
        size: "90+65+65 см × 10 см",
        mesh: "25×12 мм",
        qty: "1 смуга",
      },
      {
        part: "Піддон",
        size: "94×69 см",
        mesh: "Оцинкований лист 0,5 мм",
        qty: "1",
      },
    ],
    steps: [
      "Збирай як одиночну клітку (кроки 1–5 вище), але ширина 65 см — маточник 25×45 см вільно влізає і залишається місце самці.",
      "Baby guard — смуга дрібної сітки (25×12 мм) заввишки 10 см по всьому периметру підлоги всередині. Кріпиться J-клямерами. Не дає крільченятам виповзти в щілини основної сітки підлоги.",
      "Двері роби шириною мінімум 35 см — маточник 25×45 см має заходити без нахилу.",
      "У передній стінці на висоті 5–8 см від підлоги зроби додатковий отвір 20×20 см для сінника — V-подібний сінник навішується зовні.",
      "Якщо клітка підвісна — кріпи на 4 точки, не на 2: вага самки з крільченятами і маточником 7–9 кг.",
    ],
    tip: "Маточник не залишай в клітці постійно — лише з дня 28 від злучки до відлучення крільченят (35–45 днів). Між окролами виноси, чисти, дезінфікуй.",
  },
  {
    id: "nestbox",
    icon: "🪺",
    title: "Маточник (гніздовий ящик)",
    sub: "45×25×25 см · дерево або оцинкований лист · середні породи",
    dims: [
      { val: "45 см", name: "Довжина" },
      { val: "25 см", name: "Ширина" },
      { val: "25 см", name: "Висота" },
    ],
    imageSrc: imgNestbox,
    cutlist: [
      {
        part: "Дно",
        size: "45×25 см",
        mesh: "Фанера 10 мм або оцинкований лист",
        qty: "1",
      },
      {
        part: "Задня стінка",
        size: "45×25 см",
        mesh: "Фанера 10 мм",
        qty: "1",
      },
      {
        part: "Бічні стінки",
        size: "25×25 см",
        mesh: "Фанера 10 мм",
        qty: "2",
      },
      {
        part: "Передня стінка (з порогом)",
        size: "45×12 см",
        mesh: "Фанера 10 мм",
        qty: "1",
      },
      {
        part: "Кришка (знімна)",
        size: "47×27 см",
        mesh: "Фанера 6 мм або металевий лист",
        qty: "1",
      },
    ],
    steps: [
      "Дно: свердли дренажні отвори ∅8–10 мм кожні 5–6 см — щоб рідина не збиралась під крільченятами.",
      "Передня стінка висотою 12 см — самка перестрибує, крільченята до 3 тижнів не виповзають.",
      "Кришка знімна (на петлях або просто кладеться зверху) — для огляду посліду без стресу самки.",
      "Дерев'яний маточник: зовні пофарбуй або просочи лляною олією, внутрішні поверхні — нічим, щоб не виділяли запах.",
      "Оцинкований маточник: відріж деталі ножицями по металу, з'єднуй заклепками або дрібними болтами М4. Краї загни назовні.",
      "Перед кожним окролом: чистка, просушка на сонці, обробка розчином дезінфектанту (Вірокон 1:200 або Бровадез), просушка знову.",
    ],
    tip: "Для зимового окролу вклади в маточник зовнішнє утеплення: щільно оберни пінофолом або поклади в зовнішній ящик з тирсою. Температура всередині має бути +15…+25°C.",
    warn: "Маточник із грубого дерева з тріщинами — джерело пастерельозу і кокцидіозу. Оцинкований або фанерний без тріщин — легше чистити і дезінфікувати.",
  },
  {
    id: "shed-row",
    icon: "🏠",
    title: "Шедова секція на 6 кліток (2 яруси × 3)",
    sub: "Каркас з кутника або труби · підвісні клітки · для ферми",
    dims: [
      { val: "270 см", name: "Довжина" },
      { val: "70 см", name: "Ширина" },
      { val: "180 см", name: "Висота" },
    ],
    imageSrc: imgShed,
    cutlist: [
      {
        part: "Вертикальна стійка",
        size: "180 см",
        mesh: "Куток 40×40×3 мм або труба 40×40",
        qty: "4",
      },
      {
        part: "Горизонтальна рама верхня",
        size: "270 см",
        mesh: "Куток 40×40×3 мм",
        qty: "2",
      },
      {
        part: "Горизонтальна рама нижня",
        size: "270 см",
        mesh: "Куток 40×40×3 мм",
        qty: "2",
      },
      {
        part: "Поперечина (глибина рами)",
        size: "70 см",
        mesh: "Куток 40×40×3 мм",
        qty: "8",
      },
      {
        part: "Піддон кожного ярусу",
        size: "274×74 см",
        mesh: "Оцинкований лист 0,5 мм",
        qty: "2",
      },
      {
        part: "Клітки (одиночні або секційні)",
        size: "90×65×50 см",
        mesh: "За специфікацією вище",
        qty: "6",
      },
    ],
    steps: [
      "Розкрій і зварюй (або з'єднуй болтами М10) раму: 4 стійки + upper і нижня горизонтальні рами з поперечинами через кожні 90 см.",
      "Другий ярус клітки — на висоті 90–100 см від підлоги (зручна висота роботи стоячи). Перший ярус — 15–20 см від підлоги (для піддона).",
      "Клітки підвішуй на S-гаки або дротяні підвіси до горизонтальних рам — знімні для дезінфекції.",
      "Піддони під кожним ярусом з нахилом 3–5° до задньої стінки — рідина стікає в жолоб або відро.",
      "Жолоб зі сечовідведенням: половинка ПВХ-труби ∅110 мм, нахил 2% до ємності для збору.",
      "Дах шеда: профнастил або полікарбонат. Звіс 50–60 см по боках від дощу. Без суцільних стін — повна вентиляція.",
    ],
    tip: "Між ярусами залишай 40–45 см вільного простору для роботи з нижніми клітками і чищення піддонів. Менше — незручно, більше — даремна висота конструкції.",
    warn: "Два яруси — максимум для ручного обслуговування без стремянки. Три яруси формально можливі, але обслуговування верхнього ряду незручне і ризикує травмами.",
  },
  {
    id: "hay-feeder",
    icon: "🌾",
    title: "Зовнішній V-подібний сінник",
    sub: "Навішується на передню стінку · сіно доступне ззовні · швидке заповнення",
    dims: [
      { val: "30 см", name: "Ширина" },
      { val: "20 см", name: "Глибина" },
      { val: "25 см", name: "Висота" },
    ],
    imageSrc: imgFeeder,
    cutlist: [
      {
        part: "Дві бічні стінки (трикутник)",
        size: "20×25 см",
        mesh: "Оцинкований лист або фанера",
        qty: "2",
      },
      {
        part: "Зовнішня сітчаста стінка",
        size: "30×25 см",
        mesh: "50×50 мм сітка (14 AWG)",
        qty: "1",
      },
      {
        part: "Внутрішня сітчаста стінка",
        size: "30×25 см",
        mesh: "50×50 мм сітка (14 AWG)",
        qty: "1",
      },
      {
        part: "Дно (V-кут)",
        size: "30×5 см",
        mesh: "Оцинкований лист або сітка 25×25 мм",
        qty: "1",
      },
    ],
    steps: [
      "Дві бічні панелі — трикутна форма: ширина 20 см, висота 25 см, кут V знизу.",
      "Зовнішня і внутрішня сітчасті стінки нахилені до центру під кутом 60° — утворюють V-профіль.",
      "Дно V-кута: вузька смуга 30×5 см — закриває нижній кут, решта сіна тримається в ньому.",
      "Навішуй на передню стінку клітки J-клямерами або дротяними петлями — кролик дістає через сітку зсередини.",
      "Заповнювати можна ззовні, не відкриваючи клітку — важлива перевага при великій кількості кліток.",
    ],
    tip: "Внутрішня стінка сінника (та, що всередині клітки) — 50×50 мм або 75×25 мм. Не дрібніше — кролик не дістане сіно, не крупніше — просипатиметься в клітку.",
  },
];

/* ─── МАТЕРІАЛИ ─────────────────────────────────────── */
const materials = [
  {
    icon: "🔩",
    name: "Сітка оцинкована зварна 25×12 мм (підлога)",
    note: "GAW, 14 AWG",
  },
  {
    icon: "🔩",
    name: "Сітка оцинкована зварна 50×25 мм (стіни, стеля)",
    note: "GAW, 14 AWG",
  },
  {
    icon: "🔧",
    name: "J-клямери або С-кільця",
    note: "Пакет 500 шт. на 2–3 клітки",
  },
  { icon: "🔧", name: "Кліщі для J-клямерів", note: "Спеціальний інструмент" },
  { icon: "✂️", name: "Ножиці або кусачки по металу", note: "Для різки сітки" },
  { icon: "📐", name: "Планкогубці / пасатижі", note: "Для загину країв" },
  {
    icon: "🪣",
    name: "Оцинкований лист 0,5 мм",
    note: "Для піддонів і маточника",
  },
  { icon: "🪵", name: "Фанера 10 мм (вологостійка)", note: "Для маточника" },
  {
    icon: "⚙️",
    name: "Куток металевий 40×40×3 мм",
    note: "Для шедового каркасу",
  },
  {
    icon: "🔐",
    name: "Засувки, гачки, S-кільця",
    note: "Для дверей і підвісу кліток",
  },
];

/* ─── КОМПОНЕНТ ─────────────────────────────────────── */
const RabbitHousingDIY = () => {
  const [openCards, setOpenCards] = useState<Record<string, boolean>>({
    "single-wire": true,
  });

  const toggle = (id: string) =>
    setOpenCards((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <main className="diy-page">
      <div className="diy-hero">
        <h1 className="diy-hero__title">Клітки своїми руками</h1>
        <p className="diy-hero__sub">
          Розміри, креслення, специфікації матеріалів — одиночна клітка, самка з
          маточником, шед
        </p>
      </div>

      <div className="diy-note">
        <span className="diy-note__icon">📐</span>
        <span>
          На кожній картці відображено детальне креслення та специфікацію.
          Розміри дані для середніх м'ясних порід (НЗБ, Каліфорнійський, 4–5
          кг). Для великих порід (Фландр, Сірий велетень){" "}
          <strong>збільшуй всі габарити на 20–25%.</strong>
        </span>
      </div>

      {/* МІНІМАЛЬНІ РОЗМІРИ */}
      <section className="diy-section">
        <div className="diy-section__header">
          <span className="diy-section__icon">📏</span>
          <h2 className="diy-section__title">Мінімальні розміри кліток</h2>
        </div>
        <div className="diy-table-wrap">
          <table className="diy-table">
            <thead>
              <tr>
                <th>Категорія</th>
                <th>Д × Ш × В (см)</th>
                <th>Площа підлоги</th>
                <th>Примітка</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Самець / плідник", "60×60×45", "0,36 м²", "Без маточника"],
                ["Самка без посліду", "75×60×45", "0,45 м²", "Без маточника"],
                [
                  "Самка з посліду (до 8 гол.)",
                  "90×65×50",
                  "0,59 м²",
                  "Маточник 45×25 вільно входит",
                ],
                [
                  "Відгодівля (1 гол.)",
                  "60×50×40",
                  "0,30 м²",
                  "Мінімум, краще більше",
                ],
                [
                  "Відгодівля (3–4 гол. разом)",
                  "120×60×45",
                  "0,72 м²",
                  "До 10 тижнів",
                ],
                [
                  "Великі породи (5+ кг)",
                  "+25% до всіх розмірів",
                  "—",
                  "Фландр, Сірий велетень",
                ],
              ].map(([cat, dims, area, note]) => (
                <tr key={cat}>
                  <td className="diy-table__hl">{cat}</td>
                  <td>{dims}</td>
                  <td>{area}</td>
                  <td>{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="diy-warn">
          <span className="diy-warn__icon">⚠️</span>
          <span>
            Наведені розміри — <strong>мінімум</strong>, не рекомендований
            комфорт. Клітка правильного розміру = 3–4 стрибки кроля в довжину.
            Завузька клітка → пострес → зниження продуктивності та імунітету.
          </span>
        </div>
      </section>

      {/* СПЕЦИФІКАЦІЯ СІТКИ */}
      <section className="diy-section">
        <div className="diy-section__header">
          <span className="diy-section__icon">🔩</span>
          <h2 className="diy-section__title">Специфікація сітки</h2>
        </div>
        <div className="diy-table-wrap">
          <table className="diy-table">
            <thead>
              <tr>
                <th>Елемент</th>
                <th>Розмір комірки</th>
                <th>Товщина дроту</th>
                <th>Чому</th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "Підлога",
                  "25×12 мм",
                  "14 AWG (2 мм)",
                  "Лапа не провалюється, послід проходить",
                ],
                [
                  "Стіни і стеля",
                  "50×25 мм",
                  "14 AWG (2 мм)",
                  "Вентиляція + жорсткість",
                ],
                [
                  "Baby guard (бортик)",
                  "25×12 мм",
                  "16 AWG",
                  "Крільченята не виповзають",
                ],
                [
                  "Сінник (внутрішня стінка)",
                  "50×50 мм",
                  "14 AWG",
                  "Кролик вільно виїдає сіно",
                ],
                [
                  "Огорожа вольєру",
                  "50×50 мм",
                  "14 AWG",
                  "Але 25×25 якщо є тхори чи куниці",
                ],
              ].map(([el, cell, gauge, why]) => (
                <tr key={el}>
                  <td className="diy-table__hl">{el}</td>
                  <td>{cell}</td>
                  <td>{gauge}</td>
                  <td>{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="diy-danger">
          <span className="diy-danger__icon">🚨</span>
          <span>
            <strong>
              Ніколи не використовуй звичайну шестикутну сітку («рабицю») для
              підлоги
            </strong>{" "}
            — лапи застряють, краї не оцинковані після зварювання, іржавіє від
            сечі за 1–2 сезони. Тільки зварна оцинкована сітка з маркуванням
            GAW.
          </span>
        </div>
      </section>

      {/* КРЕСЛЕННЯ */}
      <section className="diy-section">
        <div className="diy-section__header">
          <span className="diy-section__icon">📐</span>
          <h2 className="diy-section__title">Креслення та специфікації</h2>
        </div>
        <div className="diy-drawing-cards">
          {drawings.map((d) => {
            const isOpen = !!openCards[d.id];
            return (
              <div key={d.id} className="diy-drawing-card">
                <button
                  className="diy-drawing-card__head"
                  onClick={() => toggle(d.id)}
                  aria-expanded={isOpen}
                >
                  <span className="diy-drawing-card__icon">{d.icon}</span>
                  <div className="diy-drawing-card__titles">
                    <div className="diy-drawing-card__title">{d.title}</div>
                    <div className="diy-drawing-card__sub">{d.sub}</div>
                  </div>
                  <span
                    className={`diy-drawing-card__chevron${isOpen ? " diy-drawing-card__chevron--open" : ""}`}
                  >
                    ▼
                  </span>
                </button>

                {isOpen && (
                  <div className="diy-drawing-card__body">
                    {/* РОЗМІРИ */}
                    <div className="diy-dims">
                      {d.dims.map((dim) => (
                        <div key={dim.name} className="diy-dim">
                          <div className="diy-dim__val">{dim.val}</div>
                          <div className="diy-dim__name">{dim.name}</div>
                        </div>
                      ))}
                    </div>

                    {/* ЗОБРАЖЕННЯ / КРЕСЛЕННЯ */}
                    <div className="diy-drawing-box">
                      <img
                        src={d.imageSrc}
                        alt={d.title}
                        className="diy-drawing-img"
                        loading="lazy"
                        style={{
                          width: "100%",
                          height: "auto",
                          maxHeight: "320px",
                          objectFit: "contain",
                          borderRadius: "8px",
                          display: "block",
                          margin: "0 auto",
                        }}
                      />
                    </div>

                    {/* СПЕЦИФІКАЦІЯ */}
                    <div className="diy-cutlist">
                      <div className="diy-cutlist__title">
                        Специфікація деталей
                      </div>
                      <div className="diy-table-wrap">
                        <table className="diy-table">
                          <thead>
                            <tr>
                              <th>Деталь</th>
                              <th>Розмір</th>
                              <th>Матеріал / сітка</th>
                              <th>Кількість</th>
                            </tr>
                          </thead>
                          <tbody>
                            {d.cutlist.map((row) => (
                              <tr key={row.part}>
                                <td className="diy-table__hl">{row.part}</td>
                                <td>{row.size}</td>
                                <td>{row.mesh}</td>
                                <td>{row.qty}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* КРОКИ */}
                    <div
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        color: "var(--green-dark, #2d5a27)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Порядок збирання
                    </div>
                    <div className="diy-steps">
                      {d.steps.map((s, i) => (
                        <div key={i} className="diy-step">
                          <div className="diy-step__num">{i + 1}</div>
                          <div className="diy-step__text">{s}</div>
                        </div>
                      ))}
                    </div>

                    {d.tip && (
                      <div className="diy-info">
                        <span className="diy-info__icon">💡</span>
                        <span>{d.tip}</span>
                      </div>
                    )}
                    {d.warn && (
                      <div className="diy-warn">
                        <span className="diy-warn__icon">⚠️</span>
                        <span>{d.warn}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* МАТЕРІАЛИ */}
      <section className="diy-section">
        <div className="diy-section__header">
          <span className="diy-section__icon">🧰</span>
          <h2 className="diy-section__title">
            Необхідні матеріали та інструменти
          </h2>
        </div>
        <div className="diy-materials">
          {materials.map((m) => (
            <div key={m.name} className="diy-material">
              <span className="diy-material__icon">{m.icon}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.88rem" }}>
                  {m.name}
                </div>
                <div style={{ fontSize: "0.78rem", opacity: 0.65 }}>
                  {m.note}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ТИПОВІ ПОМИЛКИ */}
      <section className="diy-section">
        <div className="diy-section__header">
          <span className="diy-section__icon">⚠️</span>
          <h2 className="diy-section__title">Типові помилки при будівництві</h2>
        </div>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}
        >
          {[
            {
              icon: "❌",
              text: "Шестикутна «рабиця» для підлоги — лапи застряють, іржавіє швидко. Тільки зварна оцинкована.",
            },
            {
              icon: "❌",
              text: "Підлога 50×25 мм замість 25×12 мм — крільченята провалюються, лапи дорослих застряють під час руху.",
            },
            {
              icon: "❌",
              text: "Занадто маленькі двері — неможливо дістати кролика чи маточник без травмування тварини. Мінімум 25×30 см.",
            },
            {
              icon: "❌",
              text: "Гострі необроблені краї сітки — порізи лап і живота. Всі зрізи загинай або закривай гумовим профілем.",
            },
            {
              icon: "❌",
              text: "Піддон впритул до підлоги без зазору — піддон не виходить для чищення, немає вентиляції. Зазор 4–5 см.",
            },
            {
              icon: "❌",
              text: "Дерев'яний каркас без металевих з'єднань — прогризається за місяць. Кролики гризуть дерево активно.",
            },
            {
              icon: "❌",
              text: "Клітки без захисту від протягу — пряме продування = пастерельоз. Відкрита вентиляція ≠ протяг.",
            },
            {
              icon: "❌",
              text: "Два яруси без козирка між ними — сеча верхнього ярусу потрапляє на кроликів нижнього. Потрібен похилий піддон з відведенням.",
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "0.75rem",
                background: "var(--green-pale, #f9fdf8)",
                borderRadius: "10px",
                padding: "0.65rem 0.9rem",
                fontSize: "0.9rem",
                lineHeight: 1.5,
              }}
            >
              <span style={{ flexShrink: 0 }}>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ПОСИЛАННЯ */}
      <section className="diy-section">
        <div className="diy-section__header">
          <span className="diy-section__icon">🔗</span>
          <div className="diy-section__title">Пов'язані розділи</div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {[
            { to: "/enclosure", label: "Клітки та облаштування" },
            { to: "/microclimate", label: "Мікроклімат" },
            { to: "/disinfection", label: "Дезінфекція" },
            { to: "/feeders", label: "Годівниці та сінники" },
            { to: "/tools", label: "Інструменти" },
            { to: "/okril", label: "Окріл та маточник" },
            { to: "/pododermatitis", label: "Пододерматит" },
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
      <div className="diy-section-back">
        <Link to="/" className="diy-section-back-btn">
          ⬅ На головну
        </Link>
        <ShareButton title="Назва цієї сторінки" />
      </div>
    </main>
  );
};

export default RabbitHousingDIY;
