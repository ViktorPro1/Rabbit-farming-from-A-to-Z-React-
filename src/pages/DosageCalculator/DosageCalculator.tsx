import { useState, useMemo } from "react";
import "./DosageCalculator.css";
import ShareButton from "../../components/ShareButton/ShareButton";
import { Link } from "react-router-dom";

interface Drug {
  id: string;
  name: string;
  tradeName?: string;
  category: string;
  concentration: number; // mg/ml
  concentrationLabel: string; // e.g. "2.5%", "10%"
  doseMin: number; // mg/kg
  doseMax: number; // mg/kg (same as min if fixed)
  route: string; // Перорально / Підшкірно / Внутрішньом'язово
  frequency: string; // Раз на добу / Двічі на добу тощо
  duration: string; // e.g. "2 доби", "5 діб"
  note?: string;
  warning?: string;
}

const DRUGS: Drug[] = [
  // КОКЦИДІОСТАТИ
  {
    id: "solikoks",
    name: "Солікокс 0,25%",
    tradeName: "Диклазурил",
    category: "Кокцидіостати",
    concentration: 2.5,
    concentrationLabel: "0,25% (2,5 мг/мл)",
    doseMin: 1,
    doseMax: 1,
    route: "Перорально з водою",
    frequency: "1 раз на добу",
    duration: "2 доби",
    note: "0,4 мл/кг. Профілактика та лікування кокцидіозу. Малотоксичний — передозування у 25–50 разів не шкодить.",
  },
  {
    id: "baykoks25",
    name: "Байкокс 2,5%",
    tradeName: "Толтразурил",
    category: "Кокцидіостати",
    concentration: 25,
    concentrationLabel: "2,5% (25 мг/мл)",
    doseMin: 2.5,
    doseMax: 5,
    route: "Перорально з водою",
    frequency: "1 раз на добу",
    duration: "2 доби, повтор через 5 днів",
    note: "Діапазон дози 2,5–5 мг/кг. Лікувальна доза — вище, профілактична — нижче. Ефективний проти всіх видів Eimeria.",
  },
  {
    id: "baykoks50",
    name: "Байкокс 5%",
    tradeName: "Толтразурил",
    category: "Кокцидіостати",
    concentration: 50,
    concentrationLabel: "5% (50 мг/мл)",
    doseMin: 2.5,
    doseMax: 5,
    route: "Перорально з водою",
    frequency: "1 раз на добу",
    duration: "2 доби, повтор через 5 днів",
    note: "Концентрована форма — потребує точного дозування. Той самий толтразурил що і Байкокс 2,5%.",
  },
  // АНТИБІОТИКИ
  {
    id: "baytril10",
    name: "Байтрил 10%",
    tradeName: "Енрофлоксацин",
    category: "Антибіотики",
    concentration: 100,
    concentrationLabel: "10% (100 мг/мл)",
    doseMin: 10,
    doseMax: 10,
    route: "Перорально з водою / Підшкірно",
    frequency: "1 раз на добу",
    duration: "5 діб",
    note: "10 мг/кг/добу. Пастерельоз, E. coli, захворювання органів дихання та ШКТ. При відсутності покращення через 2–3 доби — змінити схему.",
    warning:
      "Не застосовувати при хворобах ЦНС та нирковій недостатності. Молодняку до 4 тижнів — з обережністю.",
  },
  {
    id: "baytril25",
    name: "Байтрил 2,5%",
    tradeName: "Енрофлоксацин",
    category: "Антибіотики",
    concentration: 25,
    concentrationLabel: "2,5% (25 мг/мл)",
    doseMin: 10,
    doseMax: 10,
    route: "Перорально з водою / Підшкірно",
    frequency: "1 раз на добу",
    duration: "5 діб",
    note: "10 мг/кг/добу. Менш концентрована форма — зручніша для малих доз.",
    warning: "Не застосовувати при хворобах ЦНС та нирковій недостатності.",
  },
  {
    id: "oxytetra",
    name: "Окситетрациклін 50 мг/мл",
    tradeName: "Окситетрациклін",
    category: "Антибіотики",
    concentration: 50,
    concentrationLabel: "5% (50 мг/мл)",
    doseMin: 15,
    doseMax: 50,
    route: "Підшкірно / Внутрішньом'язово / Перорально",
    frequency: "1–2 рази на добу",
    duration: "5–7 діб",
    note: "Широкий спектр — пастерельоз, кокцидіоз (допоміжно), міксоматоз (вторинні інфекції). В'їкції — 15 мг/кг, перорально — до 50 мг/кг.",
  },
  {
    id: "chloramphenicol",
    name: "Левоміцетин 25 мг/мл",
    tradeName: "Хлорамфенікол",
    category: "Антибіотики",
    concentration: 25,
    concentrationLabel: "2,5% (25 мг/мл)",
    doseMin: 30,
    doseMax: 50,
    route: "Підшкірно / Внутрішньом'язово / Перорально",
    frequency: "2 рази на добу",
    duration: "5–7 діб",
    note: "Резервний антибіотик при стійкості до енрофлоксацину. Побічна дія — зниження апетиту.",
  },
  {
    id: "ditrim",
    name: "Дітрим (триметоприм+сульфадіазин)",
    tradeName: "Тримоксазол",
    category: "Антибіотики",
    concentration: 48,
    concentrationLabel: "240 мг/5 мл (48 мг/мл)",
    doseMin: 15,
    doseMax: 30,
    route: "Перорально / Підшкірно",
    frequency: "2 рази на добу",
    duration: "5 діб",
    note: "Кокцидіоз, пастерельоз, вторинні бактеріальні інфекції. Добре переноситься.",
  },
  // АНТИПАРАЗИТАРНІ
  {
    id: "panakyur",
    name: "Панакур 10% суспензія",
    tradeName: "Фенбендазол",
    category: "Антипаразитарні",
    concentration: 100,
    concentrationLabel: "10% (100 мг/мл)",
    doseMin: 20,
    doseMax: 20,
    route: "Перорально",
    frequency: "1 раз на добу",
    duration: "5 діб",
    note: "20 мг/кг/добу. Глисти, E. cuniculi (тривалий курс 28 діб при енцефалітозоонозі). Вагітним — з обережністю за 10 днів до окролу.",
    warning: "Не застосовувати впродовж 7 днів до і після окролу.",
  },
  {
    id: "ivermektin",
    name: "Івермектин 1% ін'єкц.",
    tradeName: "Івермектин",
    category: "Антипаразитарні",
    concentration: 10,
    concentrationLabel: "1% (10 мг/мл)",
    doseMin: 0.2,
    doseMax: 0.4,
    route: "Підшкірно",
    frequency: "Одноразово, повтор через 8–14 днів",
    duration: "2 ін'єкції",
    note: "0,2–0,4 мг/кг. Вушний кліщ (Psoroptes), хутровий кліщ, власоїди. НЕ для перорального застосування кролям.",
    warning:
      "Тільки підшкірно! Не застосовувати вагітним самкам та крільченятам до 8 тижнів.",
  },
  {
    id: "stronghold",
    name: "Стронгхолд 6% (кішки)",
    tradeName: "Селамектин",
    category: "Антипаразитарні",
    concentration: 60,
    concentrationLabel: "6% (60 мг/мл)",
    doseMin: 6,
    doseMax: 18,
    route: "Топікально (на шкіру загривку)",
    frequency: "Одноразово, повтор через 4 тижні",
    duration: "1 доза",
    note: "6–18 мг/кг. Зовнішні паразити. Рекомендована доза для кролів: 1 піпетка 15 мг для тварин до 2,5 кг.",
  },
  // ЗНЕБОЛЕННЯ / НПЗЗ
  {
    id: "meloksykam05",
    name: "Мелоксикам 0,5 мг/мл (Metacam)",
    tradeName: "Мелоксикам",
    category: "Знеболення / НПЗЗ",
    concentration: 0.5,
    concentrationLabel: "0,05% (0,5 мг/мл)",
    doseMin: 0.5,
    doseMax: 1.5,
    route: "Перорально",
    frequency: "1 раз на добу",
    duration: "3–5 діб (не більше 7 діб без контролю)",
    note: "0,5–1,5 мг/кг. Біль, запалення, після операцій. Суспензія для кішок — зручна для кролів.",
    warning:
      "Не поєднувати з іншими НПЗЗ. Не застосовувати при нирковій недостатності та зневодненні.",
  },
  {
    id: "meloksykam15",
    name: "Мелоксикам 1,5 мг/мл",
    tradeName: "Мелоксикам",
    category: "Знеболення / НПЗЗ",
    concentration: 1.5,
    concentrationLabel: "0,15% (1,5 мг/мл)",
    doseMin: 0.5,
    doseMax: 1.5,
    route: "Перорально / Підшкірно",
    frequency: "1 раз на добу",
    duration: "3–5 діб",
    note: "0,5–1,5 мг/кг. Більш концентрована форма — менший об'єм. Підшкірні ін'єкції — для гострого болю.",
    warning: "Не поєднувати з іншими НПЗЗ. Не застосовувати при зневодненні.",
  },
  // ВІТАМІНИ ТА ДОБАВКИ
  {
    id: "chiktonik",
    name: "Чіктонік",
    tradeName: "Вітамінний комплекс",
    category: "Вітаміни та добавки",
    concentration: 1,
    concentrationLabel: "розчин (1 мл = 1 мл)",
    doseMin: 1,
    doseMax: 1,
    route: "Перорально з водою",
    frequency: "1 раз на добу",
    duration: "5–7 діб",
    note: "1 мл/кг або 1 мл/л води. Підтримка після хвороби, антибіотиків, стресу. Містить вітаміни A, D3, E, B-комплекс, амінокислоти.",
  },
  {
    id: "eselenium",
    name: "Е-Селен",
    tradeName: "Вітамін E + Селен",
    category: "Вітаміни та добавки",
    concentration: 1,
    concentrationLabel: "ін'єкційний розчин",
    doseMin: 0.1,
    doseMax: 0.1,
    route: "Підшкірно / Внутрішньом'язово",
    frequency: "Одноразово",
    duration: "1 ін'єкція, повтор через 30 днів",
    note: "0,1 мл/кг. М'язова дистрофія, дефіцит селену, підготовка до злучки та вагітності.",
    warning: "Суворе дозування — передозування селену токсичне.",
  },
  {
    id: "gamavit",
    name: "Гамавіт",
    tradeName: "Імуностимулятор",
    category: "Вітаміни та добавки",
    concentration: 1,
    concentrationLabel: "розчин (1 мл = 1 мл)",
    doseMin: 0.5,
    doseMax: 1,
    route: "Підшкірно / Внутрішньом'язово / Перорально",
    frequency: "1 раз на добу",
    duration: "3–5 діб",
    note: "0,5–1 мл/кг. Підтримка після хвороби, вагітність, стрес, реабілітація. Містить нуклеїнат натрію та PDE.",
  },
  // ШКТ
  {
    id: "espumizan",
    name: "Еспумізан 40 мг/мл",
    tradeName: "Симетикон",
    category: "Шлунково-кишкові",
    concentration: 40,
    concentrationLabel: "4% (40 мг/мл)",
    doseMin: 20,
    doseMax: 40,
    route: "Перорально",
    frequency: "Кожні 1–2 години при гострому здутті",
    duration: "До покращення (макс. 4–6 разів)",
    note: "0,5–1 мл на тварину (незалежно від ваги). Гостре здуття, тимпанія. Не лікує причину — усуває газ.",
  },
  {
    id: "metoklopramid",
    name: "Метоклопрамід 5 мг/мл",
    tradeName: "Церукал",
    category: "Шлунково-кишкові",
    concentration: 5,
    concentrationLabel: "0,5% (5 мг/мл)",
    doseMin: 0.2,
    doseMax: 1,
    route: "Підшкірно / Внутрішньом'язово / Перорально",
    frequency: "2–3 рази на добу",
    duration: "2–3 доби",
    note: "0,2–1 мг/кг. ШКТ-стаз, порушення моторики. Стимулює перистальтику.",
    warning: "Не застосовувати при механічній непрохідності кишківника!",
  },
  {
    id: "regidron",
    name: "Регідрон (оральний р-н)",
    tradeName: "Регідратаційний розчин",
    category: "Шлунково-кишкові",
    concentration: 1,
    concentrationLabel: "розчин для пиття",
    doseMin: 50,
    doseMax: 100,
    route: "Перорально (шприцом)",
    frequency: "Кожні 1–2 години",
    duration: "До відновлення нормального стану",
    note: "50–100 мл/кг/добу. Зневоднення при діареї, тепловий удар. Альтернатива — 0,9% NaCl підшкірно.",
  },
];

const CATEGORIES = [
  "Всі",
  "Кокцидіостати",
  "Антибіотики",
  "Антипаразитарні",
  "Знеболення / НПЗЗ",
  "Вітаміни та добавки",
  "Шлунково-кишкові",
];

const DosageCalculator = () => {
  const [weight, setWeight] = useState<string>("");
  const [selectedDrug, setSelectedDrug] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("Всі");

  const filteredDrugs = useMemo(() => {
    if (activeCategory === "Всі") return DRUGS;
    return DRUGS.filter((d) => d.category === activeCategory);
  }, [activeCategory]);

  const drug = DRUGS.find((d) => d.id === selectedDrug);
  const weightNum = parseFloat(weight.replace(",", "."));
  const isValidWeight = !isNaN(weightNum) && weightNum > 0 && weightNum <= 15;

  const calcMin =
    isValidWeight && drug
      ? (weightNum * drug.doseMin) / drug.concentration
      : null;
  const calcMax =
    isValidWeight && drug
      ? (weightNum * drug.doseMax) / drug.concentration
      : null;

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(",", ".");
    if (val === "" || /^\d{0,2}(\.\d{0,2})?$/.test(val)) {
      setWeight(e.target.value);
    }
  };

  const handleDrugSelect = (id: string) => {
    setSelectedDrug(id === selectedDrug ? "" : id);
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setSelectedDrug("");
  };

  return (
    <div className="DC-page">
      <div className="DC-header">
        <span className="DC-header-icon">💊</span>
        <div>
          <h1 className="DC-title">Калькулятор дозування</h1>
          <p className="DC-subtitle">
            Розрахунок дози препарату за вагою кроля
          </p>
        </div>
      </div>

      <div className="DC-disclaimer">
        <span className="DC-disclaimer-icon">⚠️</span>
        <p>
          Калькулятор є довідковим інструментом. Дози відповідають інструкціям
          виробників та ветеринарним джерелам. При серйозних хворобах —
          консультуйтесь з ветеринаром.
        </p>
      </div>

      {/* КРОК 1 — ВАГА */}
      <div className="DC-section">
        <div className="DC-step-label">
          <span className="DC-step-num">1</span>
          <span>Введіть вагу кроля</span>
        </div>
        <div className="DC-weight-row">
          <input
            className="DC-weight-input"
            type="number"
            min="0.1"
            max="15"
            step="0.1"
            placeholder="наприклад: 2.4"
            value={weight}
            onChange={handleWeightChange}
          />
          <span className="DC-weight-unit">кг</span>
        </div>
        {weight && !isValidWeight && (
          <div className="DC-weight-error">Введіть вагу від 0,1 до 15 кг</div>
        )}
      </div>

      {/* КРОК 2 — КАТЕГОРІЯ */}
      <div className="DC-section">
        <div className="DC-step-label">
          <span className="DC-step-num">2</span>
          <span>Оберіть категорію препарату</span>
        </div>
        <div className="DC-cats">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`DC-cat-btn${activeCategory === cat ? " DC-cat-btn--active" : ""}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* КРОК 3 — ПРЕПАРАТ */}
      <div className="DC-section">
        <div className="DC-step-label">
          <span className="DC-step-num">3</span>
          <span>Оберіть препарат</span>
        </div>
        <div className="DC-drug-list">
          {filteredDrugs.map((d) => (
            <button
              key={d.id}
              className={`DC-drug-card${selectedDrug === d.id ? " DC-drug-card--active" : ""}`}
              onClick={() => handleDrugSelect(d.id)}
            >
              <div className="DC-drug-name">{d.name}</div>
              {d.tradeName && (
                <div className="DC-drug-trade">{d.tradeName}</div>
              )}
              <div className="DC-drug-conc">{d.concentrationLabel}</div>
            </button>
          ))}
        </div>
      </div>

      {/* РЕЗУЛЬТАТ */}
      {drug && (
        <div
          className={`DC-result${isValidWeight ? " DC-result--ready" : " DC-result--noweight"}`}
        >
          <div className="DC-result-header">
            <span className="DC-result-icon">💉</span>
            <div>
              <div className="DC-result-drugname">{drug.name}</div>
              <div className="DC-result-route">
                {drug.route} · {drug.frequency} · {drug.duration}
              </div>
            </div>
          </div>

          {isValidWeight ? (
            <div className="DC-result-dose">
              <div className="DC-dose-label">
                Доза для кроля {weightNum} кг:
              </div>
              <div className="DC-dose-value">
                {calcMin !== null &&
                  calcMax !== null &&
                  (calcMin === calcMax ? (
                    <span className="DC-dose-num">{calcMin.toFixed(2)} мл</span>
                  ) : (
                    <span className="DC-dose-num">
                      {calcMin.toFixed(2)} – {calcMax.toFixed(2)} мл
                    </span>
                  ))}
              </div>
              <div className="DC-dose-mg">
                {calcMin !== null &&
                  calcMax !== null &&
                  (calcMin === calcMax
                    ? `= ${(weightNum * drug.doseMin).toFixed(1)} мг`
                    : `= ${(weightNum * drug.doseMin).toFixed(1)} – ${(weightNum * drug.doseMax).toFixed(1)} мг`)}
              </div>
            </div>
          ) : (
            <div className="DC-result-noweight-msg">
              Введіть вагу кроля для розрахунку дози
            </div>
          )}

          {drug.note && (
            <div className="DC-result-note">
              <span className="DC-note-icon">ℹ</span>
              <span>{drug.note}</span>
            </div>
          )}
          {drug.warning && (
            <div className="DC-result-warning">
              <span className="DC-warn-icon">⚠️</span>
              <span>{drug.warning}</span>
            </div>
          )}
        </div>
      )}

      {/* ЗАБОРОНЕНІ ПРЕПАРАТИ */}
      <div className="DC-forbidden">
        <div className="DC-forbidden-title">
          <span>🚫</span> Заборонені кролям препарати
        </div>
        <div className="DC-forbidden-grid">
          {[
            {
              name: "Фіпроніл (Frontline)",
              reason: "Нейротоксичний для кролів",
            },
            {
              name: "Амоксицилін / Ампіцилін",
              reason: "Ентеротоксемія — летальна",
            },
            {
              name: "Кліндаміцин / Лінкоміцин",
              reason: "Ентеротоксемія — летальна",
            },
            { name: "Еритроміцин", reason: "Ентеротоксемія — летальна" },
            { name: "Стрептоміцин", reason: "Ентеротоксемія — летальна" },
            {
              name: "Пеніцилін G (внутрішньом'язово)",
              reason: "Порушення мікрофлори кишківника",
            },
          ].map((item) => (
            <div key={item.name} className="DC-forbidden-item">
              <div className="DC-forbidden-drug">{item.name}</div>
              <div className="DC-forbidden-reason">{item.reason}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="DC-back">
        <Link to="/" className="DC-back-btn">
          ⬅ На головну
        </Link>
        <ShareButton title="Назва цієї сторінки" />
      </div>
    </div>
  );
};

export default DosageCalculator;
