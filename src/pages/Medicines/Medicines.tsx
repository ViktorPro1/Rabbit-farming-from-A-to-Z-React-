import { useState } from "react";
import { Link } from "react-router-dom";
import "./Medicines.css";

type Category =
  | "all"
  | "antiparasitic"
  | "antibiotic"
  | "injection"
  | "vitamins"
  | "external"
  | "gi"
  | "iodine";

interface Medicine {
  name: string;
  category: Category;
  icon: string;
  description: string;
  usage: string;
  dosage: string;
  course: string;
  injectionSite?: string;
  preparation?: string;
  warning?: string;
}

const medicines: Medicine[] = [
  // ── АНТИПАРАЗИТАРНІ ──────────────────────────────────────
  {
    name: "Солікокс",
    category: "antiparasitic",
    icon: "🧪",
    description:
      "Антипаразитарний препарат проти кокцидіозу. Діюча речовина — диклазурил.",
    usage: "Лікування та профілактика кокцидіозу у кроликів усіх вікових груп.",
    dosage: "0,4 мл на 1 кг живої маси, випоювати нерозведеним або з водою.",
    course: "2 дні поспіль, за потреби повторити через 5 днів.",
    warning:
      "Не застосовувати вагітним і лактуючим самицям без консультації вет. лікаря.",
  },
  {
    name: "Байкокс 2.5%",
    category: "antiparasitic",
    icon: "🧪",
    description: "Кокцидіостатик. Діюча речовина — толтразурил.",
    usage: "Лікування і профілактика кокцидіозу.",
    dosage:
      "1 мл на 1 л питної води (дорослі). Кроленятам: 7 мг/кг живої маси.",
    course: "2 дні. При тяжкому перебігу — перерва 5 днів, потім ще 2 дні.",
    warning:
      "Щодня готувати свіжий розчин — діюча речовина осідає на стінках посудини.",
  },
  {
    name: "Діклакокс 2,5%",
    category: "antiparasitic",
    icon: "🧪",
    description: "Антикокцидійний препарат на основі диклазурилу.",
    usage: "Лікування та профілактика еймеріозу (кокцидіозу).",
    dosage: "0,4 мл на 1 кг живої маси нерозведеним або з водою.",
    course: "2 дні.",
  },
  {
    name: "Дітрим",
    category: "antiparasitic",
    icon: "🧪",
    description:
      "Сульфаніламідний препарат. Склад: сульфадимезин + триметоприм.",
    usage: "Кокцидіоз, бактеріальні кишкові інфекції.",
    dosage:
      "Орально: 1 мл на 1 л води. Ін'єкція: 1 мл на 10 кг ваги 1–2 рази на добу.",
    course: "5–7 днів. Після зникнення симптомів ще 2 дні для закріплення.",
    warning:
      "Під час орального курсу чисту воду не давати — лише розчин з препаратом.",
  },
  {
    name: "Альбен (альбендазол)",
    category: "antiparasitic",
    icon: "💊",
    description: "Антигельмінтний препарат широкого спектра.",
    usage: "Профілактика та лікування глистів (нематоди, цестоди).",
    dosage:
      "1 мл суспензії на 1 кг живої маси орально. Або 1 таблетка на 1 л води.",
    course: "Одноразово, або повторно через 10–14 днів.",
    warning:
      "Молодняку від 21 дня — половина дози. Вагітним — лише з дозволу вет. лікаря.",
  },
  {
    name: "Шустрик",
    category: "antiparasitic",
    icon: "💊",
    description: "Антигельмінтний препарат на основі фенбендазолу.",
    usage: "Дегельмінтизація, зокрема вагітних самиць.",
    dosage: "1 мл суспензії на 1 кг живої маси орально.",
    course: "Одноразово, або повторно через 14 днів.",
    warning: "Вагітним — лише з 3 триместру.",
  },

  // ── ІН'ЄКЦІЇ ─────────────────────────────────────────────
  {
    name: "Байтрил 10% (ін'єкція)",
    category: "injection",
    icon: "💉",
    description: "Антибіотик-фторхінолон. Найпоширеніший укол у кролівництві.",
    usage: "Пастерельоз, колібактеріоз, сальмонельоз, респіраторні інфекції.",
    dosage: "0,1 мл на 1 кг живої маси 1 раз на добу.",
    course: "5–7 днів.",
    injectionSite:
      "Підшкірно — в холку (складка між лопатками). Внутрішньом'язово — стегно задньої лапи, середина м'яза.",
    preparation:
      "Готовий розчин, не розводити. Голку вводити під кутом 45° підшкірно. Перед введенням злегка потягнути поршень — переконатись що не потрапили в судину.",
    warning: "Не застосовувати у молодняку в період активного росту кісток.",
  },
  {
    name: "Гентафарм (ін'єкція)",
    category: "injection",
    icon: "💉",
    description:
      "Антибіотик-аміноглікозид. Ефективний проти грамнегативних бактерій.",
    usage: "Кишкові та респіраторні інфекції, сепсис.",
    dosage: "1–2 мг/кг підшкірно або внутрішньом'язово 2 рази на добу.",
    course: "5–7 днів.",
    injectionSite:
      "Внутрішньом'язово — стегно задньої лапи. Підшкірно — холка.",
    preparation:
      "Готовий розчин. Чергувати місця введення — не колоти двічі в одне місце.",
    warning:
      "Можлива нефротоксичність при передозуванні. Лише за призначенням вет. лікаря.",
  },
  {
    name: "Біцилін / Пеніцилін-G Прокаїн",
    category: "injection",
    icon: "💉",
    description:
      "Єдиний безпечний для кроликів вид пеніциліну. Більшість інших пеніцилінів смертельно небезпечні для кроликів!",
    usage: "Стафілококові інфекції, пастерельоз, абсцеси.",
    dosage:
      "42 000–60 000 МО/кг підшкірно 1 раз на 48 годин. В перший день — подвійна доза.",
    course: "1–2 тижні (введення кожні 3–4 дні).",
    injectionSite:
      "Виключно підшкірно — в холку. Внутрішньом'язово не рекомендується через болючість.",
    preparation:
      "Розводити у воді для ін'єкцій або фіз. розчині NaCl 0,9% строго перед введенням. Готувати безпосередньо перед уколом.",
    warning:
      "УВАГА! Амоксицилін, ампіцилін та інші пеніциліни — смертельно небезпечні для кроликів! Тільки Пеніцилін-G Прокаїн.",
  },
  {
    name: "Тривіт / Тетравіт (ін'єкція)",
    category: "injection",
    icon: "💉",
    description: "Жиророзчинні вітаміни A, D3, E для ін'єкційного введення.",
    usage: "Авітаміноз, підготовка до розведення, підтримка росту молодняку.",
    dosage: "0,5–1 мл внутрішньом'язово 1 раз на тиждень.",
    course: "3–4 тижні.",
    injectionSite: "Внутрішньом'язово — стегно задньої лапи або м'яз плеча.",
    preparation:
      "Препарат на олійній основі — підігріти до кімнатної температури. Вводити повільно, рівномірно.",
    warning:
      "Олійні препарати вводити дуже повільно! Швидке введення може спричинити жировий ембол.",
  },
  {
    name: "Окситетрациклін 20% (ін'єкція)",
    category: "injection",
    icon: "💉",
    description: "Антибіотик широкого спектра тривалої дії.",
    usage:
      "Пастерельоз, кон'юнктивіт, респіраторні та кишкові бактеріальні інфекції.",
    dosage: "0,1 мл/кг внутрішньом'язово 1 раз на 48–72 години.",
    course: "3–5 введень.",
    injectionSite: "Внутрішньом'язово — стегно задньої лапи, середина м'яза.",
    preparation:
      "Готовий розчин. Чергувати ліву і праву лапу при кожному введенні.",
    warning:
      "Препарат болючий. Вводити повільно. Бажано з помічником для фіксації тварини.",
  },
  {
    name: "Гамавіт (ін'єкція)",
    category: "injection",
    icon: "💉",
    description: "Комплексний імуностимулятор з вітамінами та амінокислотами.",
    usage:
      "Відновлення після хвороби, стрес, підтримка вагітних самиць, загальне зміцнення.",
    dosage: "0,1 мл/кг підшкірно або внутрішньом'язово 1 раз на добу.",
    course: "5–7 днів.",
    injectionSite: "Підшкірно — холка. Або внутрішньом'язово — стегно.",
    preparation:
      "Зберігати в холодильнику. Перед введенням зігріти до кімнатної температури.",
  },

  // ── АНТИБІОТИКИ (оральні) ────────────────────────────────
  {
    name: "Септовет (порошок)",
    category: "antibiotic",
    icon: "🔬",
    description:
      "Комбінований антибактеріальний порошок для перорального застосування.",
    usage: "Пастерельоз, колібактеріоз, сальмонельоз.",
    dosage:
      "1,5 г на 10 кг живої маси двічі на добу з кормом або водою. У перший день дозу подвоїти.",
    course: "3–5 днів.",
  },
  {
    name: "Зінаприм",
    category: "antibiotic",
    icon: "🔬",
    description:
      "Сульфаніламідний препарат. Склад: сульфаметазин + триметоприм.",
    usage: "Інфекції дихальних шляхів і ШКТ.",
    dosage: "1 мл/кг орально 2 рази на добу.",
    course: "5 днів.",
  },

  // ── ЙОД ──────────────────────────────────────────────────
  {
    name: "Йод (5% або 10% розчин)",
    category: "iodine",
    icon: "🔶",
    description:
      "Природний антиоксидант, стимулює імунітет, пригнічує розвиток кокцидій.",
    usage:
      "Профілактика кокцидіозу, підтримка імунітету кроленят і вагітних самиць.",
    dosage:
      "Профілактика: 1 мг 10% розчину на 1 л води. Лікування — подвоїти дозу.",
    course:
      "Самиці за кілька днів до окролу: 50 мл/добу. Кроленята 2 тижні після відлучення до 2 міс: 60–70 мл/добу.",
  },

  // ── ВІТАМІНИ ─────────────────────────────────────────────
  {
    name: "Чіктонік",
    category: "vitamins",
    icon: "🌿",
    description:
      "Комплексний вітамінно-амінокислотний препарат для випоювання.",
    usage:
      "Стрес, відновлення після хвороби, підтримка при інтенсивному рості.",
    dosage: "1 мл на 1 л питної води.",
    course: "5–7 днів.",
  },

  // ── ЗОВНІШНІ ─────────────────────────────────────────────
  {
    name: "Мазь Вишневського",
    category: "external",
    icon: "🩹",
    description:
      "Антисептична і протизапальна мазь для зовнішнього застосування.",
    usage: "Гнійні рани, абсцеси, обмороження, трофічні виразки.",
    dosage: "Тонким шаром на рану 1–2 рази на добу під пов'язку.",
    course: "До загоєння.",
  },
  {
    name: "Левомеколь",
    category: "external",
    icon: "🩹",
    description:
      "Комбінована мазь з антибіотиком (хлорамфенікол) і метилурацилом.",
    usage: "Інфіковані рани, виразки, запалення шкіри.",
    dosage: "Наносити на рану або вводити в рановий канал 1 раз на добу.",
    course: "До очищення рани від гною.",
  },

  // ── ШКТ / ПРОБІОТИКИ ─────────────────────────────────────
  {
    name: "Симетикон / Еспумізан",
    category: "gi",
    icon: "🫧",
    description: "Піногасник, усуває метеоризм і здуття кишечника.",
    usage: "Гостре здуття живота (тимпанія), накопичення газів.",
    dosage: "0,5–1 мл орально, за потреби повторити через 1–2 год.",
    course: "До зникнення симптомів.",
    warning: "При сильному здутті — негайно до ветеринара!",
  },
  {
    name: "Лінекс / Ентерол",
    category: "gi",
    icon: "🦠",
    description: "Пробіотики для відновлення мікрофлори кишечника.",
    usage: "Після курсу антибіотиків або антипаразитарних препаратів.",
    dosage: "Вміст 1 капсули розчинити у воді та випоїти.",
    course: "5 днів після закінчення основного курсу лікування.",
  },
];

const categories: { value: Category; label: string }[] = [
  { value: "all", label: "Всі" },
  { value: "injection", label: "💉 Ін'єкції" },
  { value: "antiparasitic", label: "Антипаразитарні" },
  { value: "antibiotic", label: "Антибіотики" },
  { value: "iodine", label: "Йод" },
  { value: "vitamins", label: "Вітаміни" },
  { value: "external", label: "Зовнішні" },
  { value: "gi", label: "ШКТ" },
];

const Medicines = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = medicines.filter((m) => {
    const matchCat = activeCategory === "all" || m.category === activeCategory;
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <main className="med-page">
      <div className="med-header">
        <h1>💊 Ветеринарні препарати для кроликів</h1>
        <p>Таблетки, порошки, мазі та ін'єкції — повний довідник</p>
      </div>

      <div className="med-wrap">
        <div className="med-notice">
          ⚠️ Інформація довідкова. Перед застосуванням — консультація ветеринара
          обов'язкова.
        </div>

        <div className="med-search-row">
          <input
            className="med-search"
            type="text"
            placeholder="🔍 Пошук препарату..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="med-cats">
          {categories.map((c) => (
            <button
              key={c.value}
              className={`med-cat-btn${activeCategory === c.value ? " active" : ""}`}
              onClick={() => setActiveCategory(c.value)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="med-list">
          {filtered.length === 0 && (
            <p className="med-empty">
              Нічого не знайдено. Спробуйте інший запит.
            </p>
          )}
          {filtered.map((m) => (
            <div
              key={m.name}
              className={`med-card${expanded === m.name ? " open" : ""}${m.category === "injection" ? " injection" : ""}`}
              onClick={() => setExpanded(expanded === m.name ? null : m.name)}
            >
              <div className="med-card-top">
                <span className="med-card-icon">{m.icon}</span>
                <div className="med-card-info">
                  <div className="med-card-name">{m.name}</div>
                  <div className="med-card-desc">{m.description}</div>
                </div>
                <span className="med-chevron">
                  {expanded === m.name ? "▲" : "▼"}
                </span>
              </div>

              {expanded === m.name && (
                <div className="med-card-body">
                  <div className="med-row">
                    <span className="med-row-label">Застосування</span>
                    <span>{m.usage}</span>
                  </div>
                  <div className="med-row">
                    <span className="med-row-label">Дозування</span>
                    <span>{m.dosage}</span>
                  </div>
                  <div className="med-row">
                    <span className="med-row-label">Курс</span>
                    <span>{m.course}</span>
                  </div>
                  {m.injectionSite && (
                    <div className="med-row">
                      <span className="med-row-label">📍 Місце введення</span>
                      <span>{m.injectionSite}</span>
                    </div>
                  )}
                  {m.preparation && (
                    <div className="med-row">
                      <span className="med-row-label">🔧 Підготовка</span>
                      <span>{m.preparation}</span>
                    </div>
                  )}
                  {m.warning && (
                    <div className="med-warning">⚠️ {m.warning}</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="med-injection-tip">
          <div className="med-tip-title">💉 Техніка ін'єкцій кроликам</div>
          <div className="med-tip-grid">
            <div className="med-tip-card">
              <div className="med-tip-name">Підшкірно (п/ш)</div>
              <p>
                Холка — складка шкіри між лопатками. Зібрати шкіру в трикутник,
                голку вводити в основу складки під кутом 45°. Перед введенням
                злегка потягнути поршень — якщо немає крові, можна вводити.
              </p>
            </div>
            <div className="med-tip-card">
              <div className="med-tip-name">Внутрішньом'язово (в/м)</div>
              <p>
                Стегно задньої лапи — середина м'яза. Голку вводити
                перпендикулярно під кутом 90°, глибина 1–1,5 см. Чергувати ліву
                і праву лапу. Не колоти двічі в одне місце.
              </p>
            </div>
            <div className="med-tip-card">
              <div className="med-tip-name">Внутрішньовенно (в/в)</div>
              <p>
                Вена з внутрішньої сторони вушної раковини. Використовується
                рідко, лише у важких випадках. Рекомендується лише досвідченим
                або ветеринару.
              </p>
            </div>
          </div>
        </div>

        <div className="med-back">
          <Link to="/" className="med-back-btn">
            ⬅ На головну
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Medicines;
