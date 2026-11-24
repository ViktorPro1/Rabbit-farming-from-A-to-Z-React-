import { useState } from "react";
import { Link } from "react-router-dom";
import "./DatesCalculator.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const fmt = (d: Date) => d.toLocaleDateString("uk-UA");
const addDays = (d: Date, n: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};

// ===== ДАТИ РОЗВЕДЕННЯ: конфіги =====
type BreedSize = "small" | "medium_large" | "giant";

const BREED_MATURITY_DAYS: Record<BreedSize, { label: string; days: number }> =
  {
    small: { label: "Дрібна (Польська, Голландська)", days: 120 },
    medium_large: {
      label: "Середня/велика (Новозеландська, Каліфорнійська)",
      days: 135,
    },
    giant: { label: "Гігантська (Фландр)", days: 210 },
  };

type FemaleScheme = "intensive" | "semi_intensive" | "extensive";

const FEMALE_SCHEMES: Record<
  FemaleScheme,
  { label: string; weaningDays: number; nextMatingAfterBirth: number | null }
> = {
  intensive: {
    label: "Інтенсивна (1–2 день після окролу)",
    weaningDays: 28,
    nextMatingAfterBirth: 2,
  },
  semi_intensive: {
    label: "Напівінтенсивна (10–14 день)",
    weaningDays: 45,
    nextMatingAfterBirth: 12,
  },
  extensive: {
    label: "Екстенсивна (після відлучення)",
    weaningDays: 60,
    nextMatingAfterBirth: null,
  },
};

// ===== КОМПОНЕНТ =====
type CalcType = "" | "birth" | "mating";

export default function DatesCalculator() {
  const [calcType, setCalcType] = useState<CalcType>("");
  const [breedSize, setBreedSize] = useState<BreedSize>("medium_large");
  const [femaleScheme, setFemaleScheme] = useState<FemaleScheme>("extensive");
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
      firstMating = addDays(d, BREED_MATURITY_DAYS[breedSize].days);
    } else {
      firstMating = d;
    }
    const control = addDays(firstMating, 7);
    const birth = addDays(firstMating, 31);

    const schemeCfg = FEMALE_SCHEMES[femaleScheme];
    const weaning = addDays(birth, schemeCfg.weaningDays);
    const next =
      schemeCfg.nextMatingAfterBirth !== null
        ? addDays(birth, schemeCfg.nextMatingAfterBirth)
        : addDays(weaning, 14);

    setFemaleResult(
      <div className="calc-result">
        {calcType === "mating" && (
          <div className="calc-alert warn">
            ⚠️ Мінімальний вік для злучки (
            {BREED_MATURITY_DAYS[breedSize].label}):{" "}
            {Math.round(BREED_MATURITY_DAYS[breedSize].days / 30)} міс.
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

  return (
    <main className="calc-page">
      <div className="calc-header">
        <h1>Калькулятор дат розведення</h1>
        <p>Планування злучок, окролів і відлучення</p>
      </div>

      <div className="calc-wrap">
        <div>
          <div className="calc-card">
            <h2>🐰 Кроличка (самка)</h2>
            <label className="calc-label" htmlFor="calc-type-select">
              Обрати спосіб розрахунку:
            </label>
            <select
              id="calc-type-select"
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

            <label className="calc-label" htmlFor="calc-breed-size">
              Розмір породи:
            </label>
            <select
              id="calc-breed-size"
              className="calc-select"
              value={breedSize}
              onChange={(e) => setBreedSize(e.target.value as BreedSize)}
            >
              {Object.entries(BREED_MATURITY_DAYS).map(([key, cfg]) => (
                <option key={key} value={key}>
                  {cfg.label}
                </option>
              ))}
            </select>

            <label className="calc-label" htmlFor="calc-female-scheme">
              Схема злучування:
            </label>
            <select
              id="calc-female-scheme"
              className="calc-select"
              value={femaleScheme}
              onChange={(e) =>
                setFemaleScheme(e.target.value as FemaleScheme)
              }
            >
              {Object.entries(FEMALE_SCHEMES).map(([key, cfg]) => (
                <option key={key} value={key}>
                  {cfg.label}
                </option>
              ))}
            </select>

            {calcType === "birth" && (
              <>
                <label
                  className="calc-label"
                  htmlFor="calc-female-date-birth"
                >
                  Дата народження:
                </label>
                <input
                  id="calc-female-date-birth"
                  type="date"
                  className="calc-date"
                  value={femaleDate}
                  onChange={(e) => setFemaleDate(e.target.value)}
                />
              </>
            )}
            {calcType === "mating" && (
              <>
                <label
                  className="calc-label"
                  htmlFor="calc-female-date-mating"
                >
                  Дата злучки:
                </label>
                <input
                  id="calc-female-date-mating"
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
            <label className="calc-label" htmlFor="calc-male-date">
              Дата народження:
            </label>
            <input
              id="calc-male-date"
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

        <div className="calc-back">
          <Link to="/" className="calc-back-btn">
            На головну
          </Link>
          <ShareButton title="Калькулятор дат розведення" />
        </div>
      </div>
    </main>
  );
}
