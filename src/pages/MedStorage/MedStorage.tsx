import { useState } from "react";
import { Link } from "react-router-dom";
import "./MedStorage.css";
import ShareButton from "../../components/ShareButton/ShareButton";

type StorageCategory =
  | "all"
  | "vaccine"
  | "injection"
  | "antiparasitic"
  | "antibiotic"
  | "vitamins"
  | "external"
  | "disinfectant";

type StorageMode = "fridge" | "room" | "either";

interface MedStorageItem {
  name: string;
  altNames?: string;
  icon: string;
  category: Exclude<StorageCategory, "all">;
  storage: StorageMode;
  tempRange: string;
  description: string;
  light?: boolean; // захищати від світла
  freeze?: boolean; // не можна заморожувати
  openedShelfLife?: string;
  note: string;
  warning?: string;
}

const categories: { value: StorageCategory; label: string }[] = [
  { value: "all", label: "Всі" },
  { value: "vaccine", label: "💉 Вакцини" },
  { value: "injection", label: "Ін'єкції" },
  { value: "antiparasitic", label: "Антипаразитарні" },
  { value: "antibiotic", label: "Антибіотики" },
  { value: "vitamins", label: "Вітаміни" },
  { value: "external", label: "Зовнішні" },
  { value: "disinfectant", label: "Дезінфектанти" },
];

const medStorageItems: MedStorageItem[] = [
  // ───── ВАКЦИНИ ─────
  {
    name: "Вакцина проти ВГХК (RHDV1/RHDV2)",
    icon: "💉",
    category: "vaccine",
    storage: "fridge",
    tempRange: "+2…+8 °C",
    description: "Холодильник, не заморожувати",
    light: true,
    freeze: true,
    openedShelfLife: "використати одразу після відкриття флакона",
    note: "Класична «холодова ланка»: возити з дому з термосумкою й акумулятором холоду, який не торкається флакона напряму. Заморожування безповоротно знищує вакцину — на вигляд це непомітно.",
    warning:
      "Не тримати в дверцятах холодильника — там температура коливається найбільше.",
  },
  {
    name: "Вакцина проти міксоматозу",
    icon: "💉",
    category: "vaccine",
    storage: "fridge",
    tempRange: "+2…+8 °C",
    description: "Холодильник, не заморожувати",
    light: true,
    freeze: true,
    openedShelfLife: "використати одразу після відкриття флакона",
    note: "Зберігати в оригінальній картонній упаковці — вона захищає від світла. Тримати подалі від стінки холодильника, де можливе локальне підморожування.",
  },
  {
    name: "Комбінована вакцина (RHD + міксоматоз)",
    icon: "💉",
    category: "vaccine",
    storage: "fridge",
    tempRange: "+2…+8 °C",
    description: "Холодильник, розчинник — разом",
    light: true,
    freeze: true,
    openedShelfLife: "використати протягом кількох годин після розведення",
    note: "Якщо вакцина ліофілізована (суха), розчинник зберігається разом з нею в холодильнику. Точний термін використання розведеної вакцини дивіться в інструкції — зазвичай кілька годин.",
  },

  // ───── ІН'ЄКЦІЙНІ ─────
  {
    name: "Енрофлоксацин ін'єкційний (Байтрил)",
    icon: "💉",
    category: "injection",
    storage: "room",
    tempRange: "+15…+25 °C (допустимо до +30 °C)",
    description: "Кімнатна температура, темне місце",
    light: true,
    freeze: true,
    openedShelfLife: "до 90 днів після першого проколу (див. етикетку)",
    note: "НЕ ставити в холодильник — від холоду розчин може помутніти й випасти в осад. Якщо це сталось, підігрійте флакон до кімнатної температури і струсіть.",
  },
  {
    name: "Пеніцилін прокаїновий ін'єкційний",
    icon: "💉",
    category: "injection",
    storage: "fridge",
    tempRange: "+2…+8 °C",
    description: "Холодильник — виняток серед антибіотиків",
    light: false,
    freeze: true,
    note: "На відміну від більшості ін'єкційних антибіотиків для кролів, цей препарат потребує холодильника.",
    warning:
      "Кролям пеніциліни через рот давати не можна — руйнують мікрофлору кишківника і можуть спричинити летальний дисбактеріоз. Лише ін'єкційно за призначенням ветеринара.",
  },
  {
    name: "Окситетрациклін пролонгованої дії (Terramycin LA)",
    icon: "💉",
    category: "injection",
    storage: "room",
    tempRange: "+15…+25 °C",
    description: "Кімнатна температура, захист від світла",
    light: true,
    freeze: true,
    note: "Розчин з часом жовтіє й темніє на світлі — тримайте в картонній упаковці. Перед введенням перевіряйте, чи немає осаду або зміни кольору.",
  },
  {
    name: "Тилозин ін'єкційний (Tylan)",
    icon: "💉",
    category: "injection",
    storage: "room",
    tempRange: "+15…+25 °C",
    description: "Кімнатна температура, темне місце",
    light: true,
    freeze: false,
    note: "Застосовують при респіраторних інфекціях. Флакон щільно закривати одразу після набору дози.",
  },
  {
    name: "Мелоксикам ін'єкційний (Локсиком, Метакам)",
    icon: "💉",
    category: "injection",
    storage: "room",
    tempRange: "+15…+25 °C",
    description: "Кімнатна температура",
    light: true,
    freeze: false,
    note: "Багатодозовий флакон — записуйте дату першого проколу маркером прямо на етикетці.",
  },
  {
    name: "Вітамін B-комплекс ін'єкційний",
    icon: "💉",
    category: "injection",
    storage: "room",
    tempRange: "+15…+25 °C, темне місце",
    description: "Кімнатна температура, захист від світла",
    light: true,
    freeze: false,
    note: "Рибофлавін (В2) особливо чутливий до світла — розчин з часом жовтіє. Тримати в картонній упаковці.",
  },
  {
    name: "Катозал (бутафосфан + B12)",
    icon: "💉",
    category: "injection",
    storage: "room",
    tempRange: "не вище +25 °C",
    description: "Кімнатна температура, не заморожувати",
    light: true,
    freeze: true,
    note: "Загальнозміцнювальний засіб при виснаженні, після хвороби чи операції. Заморожування псує розчин.",
  },
  {
    name: "Гамавіт",
    icon: "💉",
    category: "injection",
    storage: "room",
    tempRange: "+4…+25 °C (див. етикетку)",
    description: "Кімнатна температура, темне місце",
    light: true,
    freeze: false,
    note: "Багато виробників допускають широкий діапазон, але сонячного світла й перегріву краще уникати.",
  },

  // ───── АНТИПАРАЗИТАРНІ ─────
  {
    name: "Байкокс / Солікокс (толтразурил)",
    icon: "🐛",
    category: "antiparasitic",
    storage: "room",
    tempRange: "+15…+25 °C, сухо й темно",
    description: "Кімнатна температура, темне місце",
    light: true,
    freeze: false,
    openedShelfLife:
      "термін після відкриття — див. етикетку конкретного відсотка розчину (2,5%/5%)",
    note: "Перед застосуванням не потребує підігріву чи охолодження — головне уникати прямого сонця.",
  },
  {
    name: "Івермектин (ін'єкційний / краплі на холку)",
    icon: "🐛",
    category: "antiparasitic",
    storage: "room",
    tempRange: "+15…+30 °C",
    description: "Кімнатна температура",
    light: true,
    freeze: true,
    note: "Стабільний препарат, головне — не заморожувати й не тримати на сонячному підвіконні.",
  },
  {
    name: "Фенбендазол (Панакур)",
    icon: "🐛",
    category: "antiparasitic",
    storage: "room",
    tempRange: "+15…+25 °C, сухо",
    description: "Кімнатна температура",
    light: false,
    freeze: false,
    note: "Суспензію перед кожним застосуванням треба збовтувати — компоненти можуть розшаровуватись при зберіганні.",
  },
  {
    name: "Альбендазол",
    icon: "🐛",
    category: "antiparasitic",
    storage: "room",
    tempRange: "+15…+25 °C, сухо",
    description: "Кімнатна температура",
    light: false,
    freeze: false,
    note: "Тримати в закритій упаковці, подалі від вологи.",
  },
  {
    name: "Диклазурил",
    icon: "🐛",
    category: "antiparasitic",
    storage: "room",
    tempRange: "+15…+25 °C, сухо",
    description: "Кімнатна температура",
    light: true,
    freeze: false,
    note: "Захищати від прямого сонячного світла, зберігати в оригінальному флаконі.",
  },

  // ───── АНТИБІОТИКИ (не ін'єкційні) ─────
  {
    name: "Енрофлоксацин у таблетках (Байтрил)",
    icon: "💊",
    category: "antibiotic",
    storage: "room",
    tempRange: "+15…+25 °C, сухо",
    description: "Кімнатна температура",
    light: false,
    freeze: false,
    note: "Тримати в закритій упаковці, подалі від вологи (не у ванній кімнаті).",
  },
  {
    name: "Дітрим",
    icon: "💊",
    category: "antibiotic",
    storage: "room",
    tempRange: "+15…+25 °C",
    description: "Кімнатна температура, темне місце",
    light: true,
    freeze: false,
    note: "Оральний розчин на основі триметоприму й сульфадіазину. Флакон тримати щільно закритим.",
  },
  {
    name: "Амоксицилін, суспензія (після розведення)",
    icon: "💊",
    category: "antibiotic",
    storage: "fridge",
    tempRange: "+2…+8 °C",
    description: "Порошок — кімнатна, готова суспензія — холодильник",
    light: false,
    freeze: true,
    openedShelfLife: "зазвичай 7–14 днів після розведення — див. інструкцію",
    note: "Порошок до розведення можна тримати при кімнатній температурі, а готова суспензія (після додавання води) майже завжди вимагає холодильника і має обмежений термін придатності.",
    warning:
      "Кролям пероральні пеніциліни/амінопеніциліни протипоказані — лише за прямою вказівкою ветеринара.",
  },
  {
    name: "Зінаприм",
    icon: "💊",
    category: "antibiotic",
    storage: "room",
    tempRange: "+15…+25 °C, сухо",
    description: "Кімнатна температура",
    light: false,
    freeze: false,
    note: "Комбінований сульфаніламідний препарат, порошок або суспензія — тримати щільно закритим.",
  },

  // ───── ЙОД ─────
  {
    name: "Йод / повідон-йод",
    icon: "🟤",
    category: "external",
    storage: "room",
    tempRange: "+15…+25 °C, темне місце",
    description: "Кімнатна температура, захист від світла",
    light: true,
    freeze: false,
    note: "На світлі й повітрі йод поступово випаровується та втрачає активність — тримайте флакон щільно закритим у темній тарі.",
  },

  // ───── ВІТАМІНИ ─────
  {
    name: "Чіктонік",
    icon: "🧪",
    category: "vitamins",
    storage: "room",
    tempRange: "+15…+25 °C, темне сухе місце",
    description: "Кімнатна температура",
    light: true,
    freeze: false,
    note: "Полівітамінний комплекс для пропойки — флакон після відкриття щільно закривати, не залишати на світлі.",
  },
  {
    name: "Вітамін E + селен (Е-Se)",
    icon: "🧪",
    category: "vitamins",
    storage: "room",
    tempRange: "+15…+25 °C, темне сухе місце",
    description: "Кімнатна температура",
    light: true,
    freeze: false,
    note: "Використовують перед паруванням і для молодняку на дорощуванні. Не перевищуйте дозу — селен токсичний при передозуванні.",
  },
  {
    name: "Пробіотики рідкі / порошкові",
    icon: "🧪",
    category: "vitamins",
    storage: "either",
    tempRange: "порошок — кімнатна; розчин після відкриття — +2…+8 °C",
    description: "Залежить від форми випуску",
    light: false,
    freeze: true,
    openedShelfLife: "рідкі форми — зазвичай 2–4 тижні після відкриття",
    note: "Живі культури бактерій найкраще зберігаються в холоді. Ліофілізований порошок до розведення часто можна тримати при кімнатній температурі — перевірте інструкцію.",
  },

  // ───── ЗОВНІШНІ (мазі, антисептики) ─────
  {
    name: "Левомеколь",
    icon: "🩹",
    category: "external",
    storage: "room",
    tempRange: "+15…+25 °C, сухо",
    description: "Кімнатна температура",
    light: false,
    freeze: false,
    note: "Після використання ретельно закручуйте кришку — повітря й волога прискорюють псування мазевої основи.",
  },
  {
    name: "Хлоргексидин",
    icon: "🩹",
    category: "external",
    storage: "room",
    tempRange: "+15…+25 °C",
    description: "Кімнатна температура",
    light: false,
    freeze: false,
    note: "Стабільний антисептик, головне — щільно закривати флакон, щоб не випаровувався і не забруднювався.",
  },

  // ───── ДЕЗІНФЕКТАНТИ ─────
  {
    name: "Дезінфектант для кліток / інвентарю",
    icon: "🧴",
    category: "disinfectant",
    storage: "room",
    tempRange: "+10…+25 °C (див. етикетку)",
    description: "Кімнатна температура, нежиле приміщення",
    light: false,
    freeze: true,
    note: "Концентрат зберігайте закритим у сараї чи коморі. Робочий (розведений) розчин зазвичай готують безпосередньо перед використанням — довго не зберігається.",
  },
];

function storageBadge(storage: StorageMode) {
  if (storage === "fridge") {
    return { text: "🧊 Холодильник", cls: "fridge" };
  }
  if (storage === "either") {
    return { text: "🧊/🌡️ Залежить від форми", cls: "either" };
  }
  return { text: "🌡️ Кімнатна", cls: "room" };
}

const MedStorage = () => {
  const [activeCategory, setActiveCategory] = useState<StorageCategory>("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = medStorageItems.filter((m) => {
    const matchCat = activeCategory === "all" || m.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch =
      m.name.toLowerCase().includes(q) ||
      (m.altNames || "").toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <main className="medstorage-page">
      <div className="medstorage-header">
        <h1>🧊 Зберігання ліків для кролів</h1>
        <p>Холодильник чи кімнатна температура — повний довідник аптечки</p>
      </div>

      <div className="medstorage-wrap">
        <div className="medstorage-notice">
          ⚠️ Умови зберігання можуть відрізнятись залежно від виробника й форми
          випуску — завжди звіряйтесь з етикеткою конкретного препарату.
        </div>

        <div className="medstorage-basics">
          <div className="medstorage-basics-item fridge">
            <span className="medstorage-basics-icon">🧊</span>
            <div>
              <strong>Холодильник, +2…+8 °C</strong>
              <span>
                Вакцини, більшість ін'єкційних пеніцилінів, розведені суспензії,
                деякі пробіотики
              </span>
            </div>
          </div>
          <div className="medstorage-basics-item room">
            <span className="medstorage-basics-icon">🌡️</span>
            <div>
              <strong>Кімнатна температура, +15…+25 °C</strong>
              <span>
                Енрофлоксацин, мелоксикам, івермектин, фенбендазол, вітаміни,
                мазі, антисептики
              </span>
            </div>
          </div>
        </div>

        <div className="medstorage-search-row">
          <input
            id="medstorage-search"
            name="medstorage-search"
            className="medstorage-search"
            type="text"
            placeholder="🔍 Пошук препарату (напр. «мелоксикам»)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="medstorage-cats">
          {categories.map((c) => (
            <button
              key={c.value}
              className={`medstorage-cat-btn${activeCategory === c.value ? " active" : ""}`}
              onClick={() => setActiveCategory(c.value)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="medstorage-list">
          {filtered.length === 0 && (
            <p className="medstorage-empty">
              Нічого не знайдено. Спробуйте інший запит.
            </p>
          )}
          {filtered.map((m) => {
            const badge = storageBadge(m.storage);
            return (
              <div
                key={m.name}
                className={`medstorage-card${expanded === m.name ? " open" : ""} ${badge.cls}`}
                role="button"
                tabIndex={0}
                aria-expanded={expanded === m.name}
                onClick={() => setExpanded(expanded === m.name ? null : m.name)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setExpanded(expanded === m.name ? null : m.name);
                  }
                }}
              >
                <div className="medstorage-card-top">
                  <span className="medstorage-card-icon">{m.icon}</span>
                  <div className="medstorage-card-info">
                    <div className="medstorage-card-name">{m.name}</div>
                    {m.altNames && (
                      <div className="medstorage-card-alt">{m.altNames}</div>
                    )}
                    <div className="medstorage-card-desc">{m.description}</div>
                  </div>
                  <span className={`medstorage-badge ${badge.cls}`}>
                    {badge.text}
                  </span>
                  <span className="medstorage-chevron">
                    {expanded === m.name ? "▲" : "▼"}
                  </span>
                </div>

                {expanded === m.name && (
                  <div className="medstorage-card-body">
                    <div className="medstorage-row">
                      <span className="medstorage-row-label">
                        🌡️ Температурний режим
                      </span>
                      <span>{m.tempRange}</span>
                    </div>
                    <div className="medstorage-flags">
                      {m.light && (
                        <span className="medstorage-flag">
                          🔆 захист від світла
                        </span>
                      )}
                      {m.freeze && (
                        <span className="medstorage-flag danger">
                          ❄️ не заморожувати
                        </span>
                      )}
                    </div>
                    {m.openedShelfLife && (
                      <div className="medstorage-row">
                        <span className="medstorage-row-label">
                          ⏳ Після відкриття
                        </span>
                        <span>{m.openedShelfLife}</span>
                      </div>
                    )}
                    <div className="medstorage-row">
                      <span className="medstorage-row-label">📝 Нюанс</span>
                      <span>{m.note}</span>
                    </div>
                    {m.warning && (
                      <div className="medstorage-warning">⚠️ {m.warning}</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="medstorage-tip">
          <div className="medstorage-tip-title">
            🧰 Мінімальна аптечка кролівника-початківця
          </div>
          <div className="medstorage-tip-grid">
            <div className="medstorage-tip-card">
              <div className="medstorage-tip-name">Завжди під рукою</div>
              <p>
                Хлоргексидин, стерильні серветки й бинт, шприци 1–5 мл,
                ректальний термометр, ножиці з тупими кінцями.
              </p>
            </div>
            <div className="medstorage-tip-card">
              <div className="medstorage-tip-name">
                Підписуйте дату відкриття
              </div>
              <p>
                Маркером — прямо на флаконі. Багато багатодозових препаратів
                мають обмежений термін використання після першого проколу,
                навіть якщо загальний термін придатності ще не минув.
              </p>
            </div>
            <div className="medstorage-tip-card">
              <div className="medstorage-tip-name">
                Перевезення з холодильника
              </div>
              <p>
                Вакцини й препарати з холодильника — тільки в термосумці з
                акумулятором холоду, що не контактує з флаконом напряму.
              </p>
            </div>
          </div>
        </div>

        <div className="medstorage-related">
          <h3 className="medstorage-related-title">Читайте також</h3>
          <div className="medstorage-related-grid">
            <Link to="/medicines" className="medstorage-related-link">
              💊 Препарати
            </Link>
            <Link to="/vaccinations" className="medstorage-related-link">
              💉 Вакцинація
            </Link>
            <Link to="/drug-compatibility" className="medstorage-related-link">
              ⚗️ Сумісність препаратів
            </Link>
            <Link to="/dosage-calculator" className="medstorage-related-link">
              🧮 Калькулятор дозування
            </Link>
            <Link to="/first-aid" className="medstorage-related-link">
              🚑 Перша допомога
            </Link>
          </div>
        </div>

        <div className="medstorage-back">
          <Link to="/" className="medstorage-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Зберігання ліків для кролів" />
        </div>
      </div>
    </main>
  );
};

export default MedStorage;
