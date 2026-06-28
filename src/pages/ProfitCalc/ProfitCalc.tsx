import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import "./ProfitCalc.css";
import ShareButton from "../../components/ShareButton/ShareButton";

type SaleType = "carcass" | "live" | "breeding";
type FeedType = "own" | "partial" | "bought";
type Scheme = "intensive" | "semi" | "extensive";

interface CalcInputs {
  females: number;
  scheme: Scheme;
  saleType: SaleType;
  feedType: FeedType;
  salePrice: number;
  survivalRate: number;
  startupCost: number;
}

const schemeData: Record<
  Scheme,
  { litters: number; label: string; desc: string }
> = {
  intensive: {
    litters: 8,
    label: "Інтенсивна",
    desc: "8 окролів/рік, відлучення в 28 днів",
  },
  semi: {
    litters: 5,
    label: "Напівінтенсивна",
    desc: "5 окролів/рік, відлучення в 35–42 дні",
  },
  extensive: {
    litters: 3,
    label: "Екстенсивна",
    desc: "3 окроли/рік, відлучення в 45–60 днів",
  },
};

const feedCostBase: Record<
  FeedType,
  { adult: number; young: number; label: string }
> = {
  own: { adult: 15, young: 10, label: "Власний корм" },
  partial: { adult: 80, young: 55, label: "Частково куплений" },
  bought: { adult: 150, young: 110, label: "Повністю куплений" },
};

const salePriceDefaults: Record<SaleType, number> = {
  carcass: 190,
  live: 95,
  breeding: 650,
};

const saleTypeLabel: Record<SaleType, string> = {
  carcass: "Тушки (грн/кг)",
  live: "Живою масою (грн/кг)",
  breeding: "Плем. молодняк (грн/гол)",
};

const LITTER_SIZE = 7.5;
const CARCASS_YIELD = 0.57;
const AVG_WEIGHT_LIVE = 2.3;
const BREEDING_SHARE = 0.35;

const VET_PER_HEAD_YEAR = 130;
const UTIL_PER_HEAD_MONTH = 18;

type ResultStep = {
  label: string;
  value: string;
  type?: "income" | "expense" | "neutral" | "profit" | "loss";
};

function calcResults(inputs: CalcInputs) {
  const {
    females,
    scheme,
    saleType,
    feedType,
    salePrice,
    survivalRate,
    startupCost,
  } = inputs;
  const males = Math.ceil(females / 8);
  const totalAdults = females + males;
  const { litters } = schemeData[scheme];
  const feed = feedCostBase[feedType];

  const bornPerYear = females * litters * LITTER_SIZE;
  const survivedToSale = Math.round(bornPerYear * (survivalRate / 100));

  let revenue = 0;
  const revenueSteps: ResultStep[] = [];

  if (saleType === "carcass") {
    const totalKg = survivedToSale * AVG_WEIGHT_LIVE * CARCASS_YIELD;
    revenue = totalKg * salePrice;
    revenueSteps.push({
      label: `Тушок на рік (${survivedToSale} гол × ${AVG_WEIGHT_LIVE} кг × ${CARCASS_YIELD})`,
      value: `${totalKg.toFixed(0)} кг`,
      type: "neutral",
    });
    revenueSteps.push({
      label: `Виручка (${totalKg.toFixed(0)} кг × ${salePrice} грн)`,
      value: `${revenue.toFixed(0)} грн`,
      type: "income",
    });
  } else if (saleType === "live") {
    const totalKg = survivedToSale * AVG_WEIGHT_LIVE;
    revenue = totalKg * salePrice;
    revenueSteps.push({
      label: `Жива маса на рік (${survivedToSale} × ${AVG_WEIGHT_LIVE} кг)`,
      value: `${totalKg.toFixed(0)} кг`,
      type: "neutral",
    });
    revenueSteps.push({
      label: `Виручка (${totalKg.toFixed(0)} кг × ${salePrice} грн)`,
      value: `${revenue.toFixed(0)} грн`,
      type: "income",
    });
  } else {
    const breedingCount = Math.round(survivedToSale * BREEDING_SHARE);
    const meatCount = survivedToSale - breedingCount;
    const breedingRev = breedingCount * salePrice;
    const meatRev = meatCount * AVG_WEIGHT_LIVE * CARCASS_YIELD * 190;
    revenue = breedingRev + meatRev;
    revenueSteps.push({
      label: `Плем. молодняк (${BREEDING_SHARE * 100}% від ${survivedToSale})`,
      value: `${breedingCount} гол → ${breedingRev.toFixed(0)} грн`,
      type: "income",
    });
    revenueSteps.push({
      label: `Решта на м'ясо (${meatCount} гол)`,
      value: `${meatRev.toFixed(0)} грн`,
      type: "income",
    });
    revenueSteps.push({
      label: "Загальна виручка",
      value: `${revenue.toFixed(0)} грн`,
      type: "income",
    });
  }

  // ВИТРАТИ
  const feedAdult = totalAdults * feed.adult * 12;
  const avgYoungMonths =
    scheme === "intensive" ? 2.5 : scheme === "semi" ? 3 : 3.5;
  const avgYoungOnFarm = survivedToSale * (avgYoungMonths / 12);
  const feedYoung = avgYoungOnFarm * feed.young * 12;
  const vet = (totalAdults + survivedToSale * 0.5) * VET_PER_HEAD_YEAR;
  const util = totalAdults * UTIL_PER_HEAD_MONTH * 12;
  const totalExpenses = feedAdult + feedYoung + vet + util;

  const expenseSteps: ResultStep[] = [
    {
      label: `Корм дорослих (${totalAdults} гол × ${feed.adult} грн/міс × 12)`,
      value: `${feedAdult.toFixed(0)} грн`,
      type: "expense",
    },
    {
      label: `Корм молодняку (орієнт.)`,
      value: `${feedYoung.toFixed(0)} грн`,
      type: "expense",
    },
    {
      label: `Ветеринарія та профілактика`,
      value: `${vet.toFixed(0)} грн`,
      type: "expense",
    },
    {
      label: `Комунальні витрати`,
      value: `${util.toFixed(0)} грн`,
      type: "expense",
    },
    {
      label: `Разом витрат`,
      value: `${totalExpenses.toFixed(0)} грн`,
      type: "expense",
    },
  ];

  const profit = revenue - totalExpenses;
  const profitPerFemale = females > 0 ? profit / females : 0;
  const costPerKg =
    survivedToSale > 0 && saleType !== "breeding"
      ? totalExpenses /
        (survivedToSale *
          AVG_WEIGHT_LIVE *
          (saleType === "carcass" ? CARCASS_YIELD : 1))
      : null;

  const paybackMonths =
    startupCost > 0 && profit > 0
      ? Math.ceil((startupCost / profit) * 12)
      : null;

  return {
    males,
    totalAdults,
    bornPerYear: Math.round(bornPerYear),
    survivedToSale,
    revenue: Math.round(revenue),
    totalExpenses: Math.round(totalExpenses),
    profit: Math.round(profit),
    profitPerFemale: Math.round(profitPerFemale),
    costPerKg: costPerKg ? Math.round(costPerKg) : null,
    paybackMonths,
    revenueSteps,
    expenseSteps,
  };
}

const ProfitCalc = () => {
  const [inputs, setInputs] = useState<CalcInputs>({
    females: 10,
    scheme: "semi",
    saleType: "carcass",
    feedType: "partial",
    salePrice: 190,
    survivalRate: 80,
    startupCost: 20000,
  });

  const [showDetails, setShowDetails] = useState(false);

  const result = useMemo(() => calcResults(inputs), [inputs]);

  const set = (field: keyof CalcInputs, value: unknown) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
    if (field === "saleType") {
      setInputs((prev) => ({
        ...prev,
        saleType: value as SaleType,
        salePrice: salePriceDefaults[value as SaleType],
      }));
    }
  };

  const profitClass =
    result.profit > 0 ? "positive" : result.profit < 0 ? "negative" : "";

  return (
    <main className="pc-page">
      <div className="pc-header">
        <h1>🧮 Калькулятор рентабельності</h1>
        <p>
          Введи параметри свого господарства — отримай реальний прогноз прибутку
        </p>
      </div>

      <div className="pc-wrap">
        <div className="pc-form-col">
          {/* ПАРАМЕТРИ */}
          <div className="pc-card">
            <div className="pc-card-title">📋 Параметри господарства</div>

            <div className="pc-field">
              <label>Кількість самок для розведення</label>
              <div className="pc-slider-row">
                <input
                  type="range"
                  min={1}
                  max={100}
                  step={1}
                  value={inputs.females}
                  onChange={(e) => set("females", +e.target.value)}
                />
                <span className="pc-val">{inputs.females} самок</span>
              </div>
              <div className="pc-hint">
                + {result.males} самець(ів) автоматично (1:8)
              </div>
            </div>

            <div className="pc-field">
              <label>Схема розведення</label>
              <div className="pc-radio-group">
                {(Object.keys(schemeData) as Scheme[]).map((s) => (
                  <label
                    key={s}
                    className={`pc-radio ${inputs.scheme === s ? "active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="scheme"
                      value={s}
                      checked={inputs.scheme === s}
                      onChange={() => set("scheme", s)}
                    />
                    <span className="pc-radio-title">
                      {schemeData[s].label}
                    </span>
                    <span className="pc-radio-sub">{schemeData[s].desc}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pc-field">
              <label>Тип продажу</label>
              <div className="pc-select-group">
                {(["carcass", "live", "breeding"] as SaleType[]).map((t) => (
                  <button
                    key={t}
                    className={`pc-sel-btn ${inputs.saleType === t ? "active" : ""}`}
                    onClick={() => set("saleType", t)}
                  >
                    {t === "carcass"
                      ? "🥩 Тушки"
                      : t === "live"
                        ? "🐇 Живим"
                        : "🏆 Плем. молодняк"}
                  </button>
                ))}
              </div>
            </div>

            <div className="pc-field">
              <label>{saleTypeLabel[inputs.saleType]}</label>
              <div className="pc-slider-row">
                <input
                  type="range"
                  min={inputs.saleType === "breeding" ? 200 : 60}
                  max={inputs.saleType === "breeding" ? 2000 : 300}
                  step={inputs.saleType === "breeding" ? 50 : 5}
                  value={inputs.salePrice}
                  onChange={(e) => set("salePrice", +e.target.value)}
                />
                <span className="pc-val">{inputs.salePrice} грн</span>
              </div>
              <div className="pc-hint">
                {inputs.saleType === "carcass" &&
                  "Ринкова ціна 2025–2026: 160–240 грн/кг"}
                {inputs.saleType === "live" && "Ціна живим: 80–120 грн/кг"}
                {inputs.saleType === "breeding" &&
                  "Плем. молодняк: 400–1500 грн/гол"}
              </div>
            </div>

            <div className="pc-field">
              <label>Корм</label>
              <div className="pc-radio-group horiz">
                {(Object.keys(feedCostBase) as FeedType[]).map((f) => (
                  <label
                    key={f}
                    className={`pc-radio ${inputs.feedType === f ? "active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="feed"
                      value={f}
                      checked={inputs.feedType === f}
                      onChange={() => set("feedType", f)}
                    />
                    <span className="pc-radio-title">
                      {feedCostBase[f].label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pc-field">
              <label>Виживаність молодняку до продажу</label>
              <div className="pc-slider-row">
                <input
                  type="range"
                  min={50}
                  max={95}
                  step={5}
                  value={inputs.survivalRate}
                  onChange={(e) => set("survivalRate", +e.target.value)}
                />
                <span className="pc-val">{inputs.survivalRate}%</span>
              </div>
              <div className="pc-hint">Реалістично для новачка: 70–80%</div>
            </div>

            <div className="pc-field">
              <label>Стартові витрати (для розрахунку окупності)</label>
              <div className="pc-slider-row">
                <input
                  type="range"
                  min={0}
                  max={150000}
                  step={1000}
                  value={inputs.startupCost}
                  onChange={(e) => set("startupCost", +e.target.value)}
                />
                <span className="pc-val">
                  {inputs.startupCost.toLocaleString("uk-UA")} грн
                </span>
              </div>
              <div className="pc-hint">
                Клітки, обладнання, тварини, приміщення
              </div>
            </div>
          </div>
        </div>

        {/* РЕЗУЛЬТАТИ */}
        <div className="pc-result-col">
          <div className="pc-result-card">
            <div className="pc-result-title">📊 Результат за рік</div>

            <div className="pc-summary-grid">
              <div className="pc-stat">
                <div className="pc-stat-val">{result.bornPerYear}</div>
                <div className="pc-stat-label">Народиться крільченят</div>
              </div>
              <div className="pc-stat">
                <div className="pc-stat-val">{result.survivedToSale}</div>
                <div className="pc-stat-label">Виживе до продажу</div>
              </div>
              <div className="pc-stat income">
                <div className="pc-stat-val">
                  {result.revenue.toLocaleString("uk-UA")} ₴
                </div>
                <div className="pc-stat-label">Виручка за рік</div>
              </div>
              <div className="pc-stat expense">
                <div className="pc-stat-val">
                  {result.totalExpenses.toLocaleString("uk-UA")} ₴
                </div>
                <div className="pc-stat-label">Витрати за рік</div>
              </div>
            </div>

            <div className={`pc-profit-box ${profitClass}`}>
              <div className="pc-profit-label">Чистий прибуток за рік</div>
              <div className="pc-profit-val">
                {result.profit > 0 ? "+" : ""}
                {result.profit.toLocaleString("uk-UA")} ₴
              </div>
              <div className="pc-profit-sub">
                {result.profitPerFemale > 0
                  ? `${result.profitPerFemale.toLocaleString("uk-UA")} ₴ на одну самку`
                  : "Збиток — перевір параметри"}
              </div>
            </div>

            <div className="pc-extra-stats">
              {result.costPerKg !== null && (
                <div className="pc-extra-item">
                  <span>Собівартість 1 кг</span>
                  <strong>{result.costPerKg} грн</strong>
                </div>
              )}
              {result.paybackMonths !== null && result.paybackMonths > 0 && (
                <div className="pc-extra-item">
                  <span>Окупність стартових витрат</span>
                  <strong>
                    {result.paybackMonths <= 12
                      ? `${result.paybackMonths} міс.`
                      : `${(result.paybackMonths / 12).toFixed(1)} р.`}
                  </strong>
                </div>
              )}
              {result.profit < 0 && (
                <div className="pc-extra-item warn">
                  <span>⚠️ Господарство збиткове при цих параметрах</span>
                </div>
              )}
            </div>

            <button
              className="pc-details-btn"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails
                ? "▲ Сховати детальний розрахунок"
                : "▼ Показати детальний розрахунок"}
            </button>

            {showDetails && (
              <div className="pc-details">
                <div className="pc-details-section">
                  <div className="pc-details-title">💵 Доходи</div>
                  {result.revenueSteps.map((s) => (
                    <div
                      key={s.label}
                      className={`pc-details-row ${s.type || ""}`}
                    >
                      <span>{s.label}</span>
                      <strong>{s.value}</strong>
                    </div>
                  ))}
                </div>
                <div className="pc-details-section">
                  <div className="pc-details-title">📤 Витрати</div>
                  {result.expenseSteps.map((s) => (
                    <div
                      key={s.label}
                      className={`pc-details-row ${s.type || ""}`}
                    >
                      <span>{s.label}</span>
                      <strong>{s.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="pc-back-links">
            <Link to="/economics" className="pc-back-btn">
              💰 Економіка
            </Link>
            <Link to="/sales" className="pc-back-btn secondary">
              📦 Збут
            </Link>
            <Link to="/" className="pc-back-btn secondary">
              ⬅ Головна
            </Link>
            <ShareButton title="Назва цієї сторінки" />
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfitCalc;
