import { useState } from "react";
import { Link } from "react-router-dom";
import "./Calculator.css";

// ===== ЗЕРНОВА СУМІШ =====
interface Grain {
  id: string;
  icon: string;
  name: string;
  note: string;
  pct: number;
  defaultOn: boolean;
}

const breedingGrains: Grain[] = [
  {
    id: "oat",
    icon: "🌾",
    name: "Овес",
    note: "Основа — самки та самці",
    pct: 40,
    defaultOn: true,
  },
  {
    id: "barley",
    icon: "🌾",
    name: "Ячмінь",
    note: "Дробити або замочити",
    pct: 40,
    defaultOn: true,
  },
  {
    id: "wheat",
    icon: "🌾",
    name: "Пшениця",
    note: "До 20%, не більше",
    pct: 20,
    defaultOn: true,
  },
  {
    id: "corn",
    icon: "🌽",
    name: "Кукурудза",
    note: "Небажано — знижує плідність",
    pct: 0,
    defaultOn: false,
  },
  {
    id: "pea",
    icon: "🟡",
    name: "Горох",
    note: "До 10%, тільки дроблений",
    pct: 0,
    defaultOn: false,
  },
  {
    id: "rye",
    icon: "🌾",
    name: "Жито",
    note: "До 10%, тільки в суміші",
    pct: 0,
    defaultOn: false,
  },
  {
    id: "buck",
    icon: "⚫",
    name: "Гречка",
    note: "До 10%, помірно",
    pct: 0,
    defaultOn: false,
  },
  {
    id: "soy",
    icon: "🟤",
    name: "Соєва макуха",
    note: "Білок 35–40%, до 10%",
    pct: 0,
    defaultOn: false,
  },
  {
    id: "sunflower",
    icon: "🌻",
    name: "Соняшникова макуха",
    note: "Білок 28–35%, до 10%",
    pct: 0,
    defaultOn: false,
  },
];

const fatteningGrains: Grain[] = [
  {
    id: "barley",
    icon: "🌾",
    name: "Ячмінь",
    note: "Основа, дробити",
    pct: 40,
    defaultOn: true,
  },
  {
    id: "wheat",
    icon: "🌾",
    name: "Пшениця",
    note: "Набір маси, до 20%",
    pct: 20,
    defaultOn: true,
  },
  {
    id: "corn",
    icon: "🌽",
    name: "Кукурудза",
    note: "Від 4 міс., дробити",
    pct: 15,
    defaultOn: true,
  },
  {
    id: "oat",
    icon: "🌾",
    name: "Овес",
    note: "Легке травлення",
    pct: 15,
    defaultOn: true,
  },
  {
    id: "pea",
    icon: "🟡",
    name: "Горох",
    note: "Білок до 10%, дроблений",
    pct: 10,
    defaultOn: false,
  },
  {
    id: "rye",
    icon: "🌾",
    name: "Жито",
    note: "До 10%, тільки в суміші",
    pct: 0,
    defaultOn: false,
  },
  {
    id: "buck",
    icon: "⚫",
    name: "Гречка",
    note: "До 10%, помірно",
    pct: 0,
    defaultOn: false,
  },
  {
    id: "soy",
    icon: "🟤",
    name: "Соєва макуха",
    note: "Білок 35–40%, до 10%",
    pct: 0,
    defaultOn: false,
  },
  {
    id: "sunflower",
    icon: "🌻",
    name: "Соняшникова макуха",
    note: "Білок 28–35%, до 10%",
    pct: 0,
    defaultOn: false,
  },
];

// Базові відсотки для зерен з pct: 0
const EXTRA_PCT: Record<string, number> = {
  corn: 10,
  pea: 8,
  rye: 8,
  buck: 8,
  soy: 10,
  sunflower: 10,
};

// Максимально допустимий відсоток для окремих зерен
const MAX_PCT: Record<string, number> = {
  corn: 15,
  pea: 10,
  rye: 10,
  buck: 10,
  soy: 10,
  sunflower: 10,
};

// Ідентифікатори макух
const MAKUHA_IDS = ["soy", "sunflower"];
// Максимальна сумарна частка макух
const MAKUHA_MAX_TOTAL = 15;

const grainTable = [
  {
    name: "🌾 Овес",
    breeding: "40%",
    fattening: "15%",
    note: "Основа для самок і самців. Не жиріє, добре засвоюється",
  },
  {
    name: "🌾 Ячмінь",
    breeding: "40%",
    fattening: "40%",
    note: "Основне зерно в обох раціонах. Дробити або замочувати",
  },
  {
    name: "🌾 Пшениця",
    breeding: "20%",
    fattening: "20%",
    note: "Не більше 20%. При надлишку — здуття через клейковину",
  },
  {
    name: "🌽 Кукурудза",
    breeding: "не рекоменд.",
    fattening: "15%",
    note: "Для відгодівлі — обов'язково дробити, тільки від 4 міс.",
  },
  {
    name: "🟡 Горох",
    breeding: "до 10%",
    fattening: "до 10%",
    note: "Тільки дроблений або запарений. Додатковий білок",
  },
  {
    name: "🌾 Жито",
    breeding: "до 10%",
    fattening: "до 10%",
    note: "Тільки в суміші з іншими. Самостійно викликає розлади",
  },
  {
    name: "⚫ Гречка",
    breeding: "до 10%",
    fattening: "до 10%",
    note: "Різноманітність раціону. Ціла або лузга, помірно",
  },
  {
    name: "🟤 Соєва макуха",
    breeding: "до 10%",
    fattening: "до 10%",
    note: "Термооброблена. Білок 35–40%. Не перевищувати 10% — розлади травлення",
  },
  {
    name: "🌻 Соняшникова макуха",
    breeding: "до 10%",
    fattening: "до 10%",
    note: "Білок 28–35%, менше ніж у соєвій. Суха, без цвілі. До 10% — можна поєднувати з соєвою, але сумарно не більше 10–15%",
  },
];

interface GrainResult {
  icon: string;
  name: string;
  pct: number;
  kg: number;
}

interface GranulatorAdditives {
  lucerne: number;
  salt: number;
  premix: number;
  waterMin: number;
  waterMax: number;
}

function calcGranulatorAdditives(totalKg: number): GranulatorAdditives {
  return {
    lucerne: Math.round(totalKg * 0.2 * 10) / 10,
    salt: Math.round(totalKg * 0.005 * 10000) / 10,
    premix: Math.round(totalKg * 0.01 * 1000),
    waterMin: Math.round(totalKg * 0.08 * 10) / 10,
    waterMax: Math.round(totalKg * 0.12 * 10) / 10,
  };
}

function calcGrains(
  grains: Grain[],
  selected: string[],
  totalKg: number,
): GrainResult[] {
  const checked = grains.filter((g) => selected.includes(g.id));
  if (!checked.length || totalKg <= 0) return [];

  // Крок 1: визначаємо початковий відсоток для кожного зерна
  const basePcts: Record<string, number> = {};
  checked.forEach((g) => {
    basePcts[g.id] = g.pct > 0 ? g.pct : (EXTRA_PCT[g.id] ?? 8);
  });

  // Крок 2: застосовуємо максимальні обмеження для окремих зерен
  Object.keys(basePcts).forEach((id) => {
    if (MAX_PCT[id] !== undefined) {
      basePcts[id] = Math.min(basePcts[id], MAX_PCT[id]);
    }
  });

  // Крок 3: обмежуємо сумарну частку макух до MAKUHA_MAX_TOTAL%
  const selectedMakuha = checked.filter((g) => MAKUHA_IDS.includes(g.id));
  if (selectedMakuha.length > 0) {
    const totalMakuhaPct = selectedMakuha.reduce(
      (sum, g) => sum + basePcts[g.id],
      0,
    );
    if (totalMakuhaPct > MAKUHA_MAX_TOTAL) {
      // Розподіляємо MAKUHA_MAX_TOTAL порівну між вибраними макухами
      const pctEach = MAKUHA_MAX_TOTAL / selectedMakuha.length;
      selectedMakuha.forEach((g) => {
        basePcts[g.id] = pctEach;
      });
    }
  }

  // Крок 4: нормалізуємо до 100%
  const sum = Object.values(basePcts).reduce((a, b) => a + b, 0);
  if (sum !== 100) {
    Object.keys(basePcts).forEach((k) => {
      basePcts[k] = (basePcts[k] / sum) * 100;
    });
  }

  const roundHalf = (n: number) => Math.round(n * 2) / 2;

  // Точні кг без округлення
  const exact: GrainResult[] = checked.map((g) => ({
    icon: g.icon,
    name: g.name,
    pct: basePcts[g.id],
    kg: (totalKg * basePcts[g.id]) / 100,
  }));

  // Округлюємо кожен до 0.5
  const results: GrainResult[] = exact.map((r) => ({
    ...r,
    kg: roundHalf(r.kg),
  }));

  // Крок 5: коригуємо залишок через округлення — додаємо до найбільшого зерна
  const sumKg = results.reduce((a, r) => a + r.kg, 0);
  const diff = parseFloat((totalKg - sumKg).toFixed(1));
  if (diff !== 0) {
    const maxIdx = results.reduce(
      (bestIdx, r, i) => (r.kg > results[bestIdx].kg ? i : bestIdx),
      0,
    );
    results[maxIdx].kg = roundHalf(results[maxIdx].kg + diff);
  }

  return results;
}

const fmt = (d: Date) => d.toLocaleDateString("uk-UA");
const addDays = (d: Date, n: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};

// ===== КОМПОНЕНТ =====
type Tab = "grain" | "dates";
type GrainMode = "breeding" | "fattening";
type CalcType = "" | "birth" | "mating";

export default function Calculator() {
  const [tab, setTab] = useState<Tab>("grain");

  // --- Зернова суміш ---
  const [grainMode, setGrainMode] = useState<GrainMode>("breeding");
  const [breedingSel, setBreedingSel] = useState<string[]>(
    breedingGrains.filter((g) => g.defaultOn).map((g) => g.id),
  );
  const [fatteningSel, setFatteningSel] = useState<string[]>(
    fatteningGrains.filter((g) => g.defaultOn).map((g) => g.id),
  );
  const [grainWeight, setGrainWeight] = useState<number>(10);
  const [grainResults, setGrainResults] = useState<GrainResult[]>([]);
  const [grainError, setGrainError] = useState("");
  const [hasGranulator, setHasGranulator] = useState(false);

  const currentGrains =
    grainMode === "breeding" ? breedingGrains : fatteningGrains;
  const currentSel = grainMode === "breeding" ? breedingSel : fatteningSel;
  const setSel = grainMode === "breeding" ? setBreedingSel : setFatteningSel;

  const toggleGrain = (id: string) => {
    setSel((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleCalcGrain = () => {
    if (grainWeight <= 0) {
      setGrainError("Введіть правильну вагу!");
      setGrainResults([]);
      return;
    }
    if (!currentSel.length) {
      setGrainError("Оберіть хоча б одне зерно!");
      setGrainResults([]);
      return;
    }

    // Інформаційне попередження якщо вибрані обидві макухи
    const selectedMakuha = currentSel.filter((id) => MAKUHA_IDS.includes(id));
    if (selectedMakuha.length === 2) {
      setGrainError(
        "Соєва і соняшникова макуха вибрані разом — сумарна частка обмежена до 15%, розподілена порівну між ними.",
      );
    } else {
      setGrainError("");
    }

    setGrainResults(calcGrains(currentGrains, currentSel, grainWeight));
  };

  // --- Дати розведення ---
  const [calcType, setCalcType] = useState<CalcType>("");
  const [femaleDate, setFemaleDate] = useState("");
  const [maleDate, setMaleDate] = useState("");
  const [femaleResult, setFemaleResult] = useState<React.ReactNode>(null);
  const [maleResult, setMaleResult] = useState<React.ReactNode>(null);

  const handleCalcFemale = () => {
    if (!calcType) {
      setFemaleResult(<p className="calc-error">Оберіть спосіб розрахунку.</p>);
      return;
    }
    if (!femaleDate) {
      setFemaleResult(<p className="calc-error">Введіть дату.</p>);
      return;
    }
    const d = new Date(femaleDate);
    let firstMating: Date;
    if (calcType === "birth") {
      firstMating = addDays(d, 150);
    } else {
      firstMating = d;
    }
    const control = addDays(firstMating, 7);
    const birth = addDays(firstMating, 31);
    const weaning = addDays(birth, 60);
    const next = addDays(weaning, 14);
    setFemaleResult(
      <div className="calc-result">
        {calcType === "mating" && (
          <div className="calc-alert warn">
            ⚠️ Кроличці має бути мінімум 4 місяці від дня народження.
          </div>
        )}
        {calcType === "birth" && (
          <div className="calc-row">
            <span>Дата готовності до першої злучки:</span>
            <strong>{fmt(firstMating)}</strong>
          </div>
        )}
        <div className="calc-row">
          <span>Контрольна злучка:</span>
          <strong>{fmt(control)}</strong>
        </div>
        <div className="calc-row">
          <span>Очікувана дата окролу:</span>
          <strong>{fmt(birth)}</strong>
        </div>
        <div className="calc-row">
          <span>Дата відлучення малюків:</span>
          <strong>{fmt(weaning)}</strong>
        </div>
        <div className="calc-row">
          <span>Наступна злучка після відлучення:</span>
          <strong>{fmt(next)}</strong>
        </div>
        <div className="calc-alert ok">
          ✅ Забезпечте відпочинок та перевірку здоров'я після кожного окролу.
        </div>
      </div>,
    );
  };

  const handleCalcMale = () => {
    if (!maleDate) {
      setMaleResult(<p className="calc-error">Введіть дату народження.</p>);
      return;
    }
    const d = new Date(maleDate);
    const start = addDays(d, 150);
    const end = addDays(d, 1095);
    setMaleResult(
      <div className="calc-result">
        <div className="calc-row">
          <span>Вік для початку спаровування:</span>
          <strong>{fmt(start)}</strong>
        </div>
        <div className="calc-row">
          <span>Рекомендований період до:</span>
          <strong>{fmt(end)}</strong>
        </div>
        <div className="calc-alert ok">
          ✅ Перевіряйте здоров'я та стан самця перед кожною злучкою.
        </div>
      </div>,
    );
  };

  const maxPct = grainResults.length
    ? Math.max(...grainResults.map((r) => r.pct))
    : 1;

  return (
    <main className="calc-page">
      <div className="calc-header">
        <h1>Калькулятор кролівництва</h1>
        <p>Зернова суміш та планування розведення</p>
      </div>

      <div className="calc-wrap">
        <div className="calc-tabs">
          <button
            className={`calc-tab ${tab === "grain" ? "active" : ""}`}
            onClick={() => setTab("grain")}
          >
            🌾 Зернова суміш
          </button>
          <button
            className={`calc-tab ${tab === "dates" ? "active" : ""}`}
            onClick={() => setTab("dates")}
          >
            📅 Дати розведення
          </button>
        </div>

        {/* ===== ЗЕРНОВА СУМІШ ===== */}
        {tab === "grain" && (
          <div>
            <div className="calc-mode-tabs">
              <button
                className={`calc-mode-btn ${grainMode === "breeding" ? "active" : ""}`}
                onClick={() => {
                  setGrainMode("breeding");
                  setGrainResults([]);
                  setGrainError("");
                }}
              >
                🐇 Племінне стадо
              </button>
              <button
                className={`calc-mode-btn ${grainMode === "fattening" ? "active" : ""}`}
                onClick={() => {
                  setGrainMode("fattening");
                  setGrainResults([]);
                  setGrainError("");
                }}
              >
                🥩 Відгодівля
              </button>
            </div>

            <div className="calc-card">
              <h2>Оберіть зернові</h2>
              <div className="grain-grid">
                {currentGrains.map((g) => (
                  <label
                    key={g.id}
                    className={`grain-item ${currentSel.includes(g.id) ? "selected" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={currentSel.includes(g.id)}
                      onChange={() => toggleGrain(g.id)}
                    />
                    <span className="grain-icon">{g.icon}</span>
                    <span className="grain-name">{g.name}</span>
                    <span className="grain-note">{g.note}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="calc-card">
              <h2>Загальна вага суміші</h2>
              <div className="weight-row">
                <button
                  className="weight-btn"
                  onClick={() => setGrainWeight((w) => Math.max(1, w - 1))}
                >
                  −
                </button>
                <input
                  type="number"
                  className="weight-input"
                  value={grainWeight}
                  min={1}
                  onChange={(e) => setGrainWeight(Number(e.target.value))}
                />
                <span className="weight-unit">кг</span>
                <button
                  className="weight-btn"
                  onClick={() => setGrainWeight((w) => w + 1)}
                >
                  +
                </button>
              </div>
              {grainError && <p className="calc-error">{grainError}</p>}
              <button className="calc-btn" onClick={handleCalcGrain}>
                Розрахувати рецепт
              </button>
            </div>

            {grainResults.length > 0 && (
              <div className="calc-card">
                <h2>Результат — {grainWeight} кг суміші</h2>
                {grainResults.map((r) => (
                  <div key={r.name} className="result-row">
                    <span className="result-icon">{r.icon}</span>
                    <div className="result-info">
                      <div className="result-top">
                        <span className="result-name">{r.name}</span>
                        <span className="result-pct">{r.pct.toFixed(1)}%</span>
                      </div>
                      <div className="result-bar-wrap">
                        <div
                          className="result-bar"
                          style={{
                            width: `${Math.round((r.pct / maxPct) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="result-kg">{r.kg} кг</span>
                  </div>
                ))}

                {/* ===== ГРАНУЛЯТОР ===== */}
                <label className="granulator-toggle">
                  <input
                    type="checkbox"
                    checked={hasGranulator}
                    onChange={(e) => setHasGranulator(e.target.checked)}
                  />
                  <span>Є гранулятор</span>
                </label>

                {hasGranulator &&
                  (() => {
                    const { lucerne, salt, premix, waterMin, waterMax } =
                      calcGranulatorAdditives(grainWeight);
                    return (
                      <div className="granulator-block">
                        <div className="calc-alert warn">
                          ⚙️ Перед закладкою в гранулятор перемоліть всю суміш
                          через млин або зернодробарку. Рекомендована фракція
                          після помолу: <strong>1.5–2 мм</strong>. Розмір гранул
                          на виході: <strong>4–5 мм</strong>.
                        </div>

                        <h3>Добавки до суміші</h3>

                        <div className="result-row">
                          <span className="result-icon">🌿</span>
                          <div className="result-info">
                            <div className="result-top">
                              <span className="result-name">
                                Люцерна подрібнена
                              </span>
                              <span className="result-pct">20%</span>
                            </div>
                            <span className="granulator-note">
                              Клітковина та білок (15–18%). Подрібнити до 3–5 мм
                              окремо, потім змішати із зерном. Якщо люцерни
                              немає — можна замінити частково або повністю
                              ячмінною чи пшеничною соломою: солома дає
                              клітковину, але білка в ній майже немає, тому
                              гранула буде менш поживною
                            </span>
                          </div>
                          <span className="result-kg">{lucerne} кг</span>
                        </div>

                        <div className="result-row">
                          <span className="result-icon">🧂</span>
                          <div className="result-info">
                            <div className="result-top">
                              <span className="result-name">Сіль кухонна</span>
                              <span className="result-pct">0.5%</span>
                            </div>
                            <span className="granulator-note">
                              Проста харчова сіль (NaCl). Додати в суміш і
                              рівномірно перемішати
                            </span>
                          </div>
                          <span className="result-kg">{salt} г</span>
                        </div>

                        <div className="result-row">
                          <span className="result-icon">💊</span>
                          <div className="result-info">
                            <div className="result-top">
                              <span className="result-name">Премікс</span>
                              <span className="result-pct">1%</span>
                            </div>
                            <span className="granulator-note">
                              Вітамінно-мінеральна добавка. Забезпечує кролів
                              необхідними мікроелементами для росту та
                              імунітету.
                            </span>
                          </div>
                          <span className="result-kg">{premix} г</span>
                        </div>

                        <div className="result-row">
                          <span className="result-icon">💧</span>
                          <div className="result-info">
                            <div className="result-top">
                              <span className="result-name">Вода</span>
                              <span className="result-pct">8–12%</span>
                            </div>
                            <span className="granulator-note">
                              Технологічна волога для пресування — в годівницю
                              не додається. Вливати поступово перед
                              гранулятором. Суміш має ліпитись у руці, але не
                              розтікатись. Точна кількість залежить від
                              вологості сировини
                            </span>
                          </div>
                          <span className="result-kg">
                            {waterMin}–{waterMax} л
                          </span>
                        </div>

                        <div
                          className="calc-alert ok"
                          style={{ marginTop: "14px" }}
                        >
                          ✅ Після переходу на гранули окрема люцерна, зернова
                          суміш і сіль-лизунець з клітки прибираються — все це
                          вже в складі гранули. В клітці залишається тільки
                          годівниця з гранулами і поїлка з чистою водою.
                        </div>
                      </div>
                    );
                  })()}
              </div>
            )}

            <div className="calc-card">
              <h2>Довідка по зернових</h2>
              <div className="calc-table-wrap">
                <table className="calc-table">
                  <thead>
                    <tr>
                      <th>Зерно</th>
                      <th>Плем. стадо</th>
                      <th>Відгодівля</th>
                      <th>Примітка</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grainTable.map((row) => (
                      <tr key={row.name}>
                        <td>{row.name}</td>
                        <td>{row.breeding}</td>
                        <td>{row.fattening}</td>
                        <td>{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===== ДАТИ РОЗВЕДЕННЯ ===== */}
        {tab === "dates" && (
          <div>
            <div className="calc-card">
              <h2>🐰 Кроличка (самка)</h2>
              <label className="calc-label">Обрати спосіб розрахунку:</label>
              <select
                className="calc-select"
                value={calcType}
                onChange={(e) => {
                  setCalcType(e.target.value as CalcType);
                  setFemaleResult(null);
                }}
              >
                <option value="">Оберіть</option>
                <option value="birth">Від дати народження</option>
                <option value="mating">Від дати злучки</option>
              </select>
              {calcType === "birth" && (
                <>
                  <label className="calc-label">Дата народження:</label>
                  <input
                    type="date"
                    className="calc-date"
                    value={femaleDate}
                    onChange={(e) => setFemaleDate(e.target.value)}
                  />
                </>
              )}
              {calcType === "mating" && (
                <>
                  <label className="calc-label">Дата злучки:</label>
                  <input
                    type="date"
                    className="calc-date"
                    value={femaleDate}
                    onChange={(e) => setFemaleDate(e.target.value)}
                  />
                </>
              )}
              <button className="calc-btn" onClick={handleCalcFemale}>
                Розрахувати дати
              </button>
              {femaleResult}
            </div>

            <div className="calc-card">
              <h2>🐇 Кролик (самець)</h2>
              <label className="calc-label">Дата народження:</label>
              <input
                type="date"
                className="calc-date"
                value={maleDate}
                onChange={(e) => setMaleDate(e.target.value)}
              />
              <button className="calc-btn" onClick={handleCalcMale}>
                Розрахувати період спаровування
              </button>
              {maleResult}
            </div>
          </div>
        )}

        <div className="calc-back">
          <Link to="/" className="calc-back-btn">
            ⬅ На головну
          </Link>
        </div>
      </div>
    </main>
  );
}
