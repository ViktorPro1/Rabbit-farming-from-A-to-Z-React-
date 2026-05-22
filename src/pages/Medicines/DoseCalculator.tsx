import { useState } from "react";
import "./DoseCalculator.css";

type RouteType = "injection" | "oral" | "external";

interface DrugDef {
  name: string;
  routes: RouteType[];
  calc: (weight: number, route?: RouteType) => CalcResult;
}

interface CalcResult {
  prev?: DoseBlock;
  treat?: DoseBlock;
  course: string;
  warning?: string;
  injNote?: string;
  infoNote?: string;
}

interface DoseBlock {
  label: string;
  value: string;
  note: string;
}

const drugs: DrugDef[] = [
  // ── АНТИПАРАЗИТАРНІ ──────────────────────────────────────
  {
    name: "Солікокс",
    routes: ["oral"],
    calc: (w) => ({
      prev: {
        label: "Профілактика",
        value: `${(0.4 * w).toFixed(2)} мл`,
        note: "раз на 20 днів",
      },
      treat: {
        label: "Лікування",
        value: `${(0.4 * w).toFixed(2)} мл`,
        note: "щодня 2 дні поспіль",
      },
      course: "Лікування: 2 дні. Профілактика: кожні 20 днів.",
      warning:
        "Не застосовувати вагітним і лактуючим самицям без консультації вет. лікаря.",
    }),
  },
  {
    name: "Байкокс 2.5%",
    routes: ["oral"],
    calc: () => ({
      prev: {
        label: "Профілактика — у воді",
        value: "1 мл / 1 л",
        note: "2 дні, раз на 20 днів",
      },
      treat: {
        label: "Лікування — у воді",
        value: "1 мл / 1 л",
        note: "2 дні поспіль",
      },
      course: "2 дні. При тяжкому — перерва 5 днів, ще 2 дні.",
      warning: "Щодня готувати свіжий розчин — речовина осідає на стінках.",
    }),
  },
  {
    name: "Діклакокс 2,5%",
    routes: ["oral"],
    calc: (w) => ({
      prev: {
        label: "Профілактика",
        value: `${(0.4 * w).toFixed(2)} мл`,
        note: "раз на 20 днів",
      },
      treat: {
        label: "Лікування",
        value: `${(0.4 * w).toFixed(2)} мл`,
        note: "щодня 2 дні поспіль",
      },
      course: "2 дні лікування, або раз на 20 днів профілактично.",
    }),
  },
  {
    name: "Дітрим",
    routes: ["oral", "injection"],
    calc: (w, route) => {
      if (route === "injection") {
        return {
          treat: {
            label: "Лікування — ін'єкція",
            value: `${(0.1 * w).toFixed(2)} мл`,
            note: "1–2 рази/добу підшкірно або в/м",
          },
          course: "5–7 днів.",
          warning:
            "Під час орального курсу чисту воду не давати — лише розчин.",
          injNote:
            "Підшкірно — холка (кут 45°). Або в/м — стегно задньої лапи.",
        };
      }
      return {
        prev: {
          label: "Профілактика — у воді",
          value: "0,5 мл / 1 л",
          note: "раз на місяць, 3 дні",
        },
        treat: {
          label: "Лікування — у воді",
          value: "1 мл / 1 л",
          note: "щодня (тільки розчин, без чистої води)",
        },
        course: "5–7 днів.",
        warning: "Під час орального курсу чисту воду не давати — лише розчин.",
      };
    },
  },
  {
    name: "Альбен (альбендазол)",
    routes: ["oral"],
    calc: (w) => ({
      prev: {
        label: "Профілактика",
        value: `${(0.5 * w).toFixed(2)} мл`,
        note: "раз на 3 місяці, 3 дні поспіль",
      },
      treat: {
        label: "Лікування",
        value: `${(1 * w).toFixed(2)} мл`,
        note: "одноразово, повторити через 10–14 днів",
      },
      course: "Одноразово або 2 рази з інтервалом 10–14 днів.",
      warning:
        "Молодняку від 21 дня — половина дози. Вагітним — лише з дозволу лікаря.",
    }),
  },
  {
    name: "Шустрик",
    routes: ["oral"],
    calc: (w) => ({
      prev: {
        label: "Профілактика",
        value: `${(0.5 * w).toFixed(2)} мл`,
        note: "раз на 3 місяці",
      },
      treat: {
        label: "Лікування",
        value: `${(1 * w).toFixed(2)} мл`,
        note: "одноразово, повторити через 14 днів",
      },
      course: "Одноразово, повторити через 14 днів.",
      warning: "Вагітним — лише з 3 триместру.",
    }),
  },

  // ── ІН'ЄКЦІЇ ─────────────────────────────────────────────
  {
    name: "Байтрил 10% (ін'єкція)",
    routes: ["injection"],
    calc: (w) => ({
      treat: {
        label: "Лікування",
        value: `${(0.1 * w).toFixed(2)} мл`,
        note: "1 раз на добу підшкірно або в/м",
      },
      course: "5–7 днів.",
      warning: "Не застосовувати у молодняку в період активного росту кісток.",
      injNote: "Підшкірно — холка (45°). Або в/м — стегно задньої лапи.",
    }),
  },
  {
    name: "Байтрил 2.5% (орально)",
    routes: ["oral"],
    calc: (w) => ({
      treat: {
        label: "Лікування — у воді",
        value: `${(0.5 * w).toFixed(2)} мл / 1 л`,
        note: "1 раз на добу, давати як єдине джерело води",
      },
      course: "5–7 днів.",
      warning: "Не застосовувати у молодняку в період активного росту кісток.",
    }),
  },
  {
    name: "Гентафарм",
    routes: ["injection"],
    calc: (w) => ({
      treat: {
        label: "Лікування",
        value: `${(0.05 * w).toFixed(2)}–${(0.1 * w).toFixed(2)} мл`,
        note: "2 рази на добу з інтервалом 12 год підшкірно або в/м",
      },
      course: "5–7 днів.",
      warning:
        "Можлива нефротоксичність при передозуванні. Лише за призначенням лікаря.",
      injNote:
        "Внутрішньом'язово — стегно задньої лапи. Підшкірно — холка. Чергувати місця.",
    }),
  },
  {
    name: "Окситетрациклін 20%",
    routes: ["injection"],
    calc: (w) => ({
      treat: {
        label: "Лікування",
        value: `${(0.1 * w).toFixed(2)} мл`,
        note: "1 раз на 48–72 години в/м",
      },
      course: "3–5 введень.",
      warning:
        "Препарат болючий — вводити повільно. Чергувати ліву і праву лапу.",
      injNote: "Внутрішньом'язово — стегно задньої лапи, середина м'яза.",
    }),
  },
  {
    name: "Гамавіт",
    routes: ["injection"],
    calc: (w) => ({
      prev: {
        label: "Профілактика",
        value: `${(0.05 * w).toFixed(2)} мл`,
        note: "1–2 рази на тиждень при стресі",
      },
      treat: {
        label: "Лікування",
        value: `${(0.1 * w).toFixed(2)} мл`,
        note: "1 раз на добу підшкірно або в/м",
      },
      course: "5–7 днів.",
      infoNote:
        "Зберігати в холодильнику, перед введенням зігріти до кімнатної температури.",
      injNote: "Підшкірно — холка. Або в/м — стегно.",
    }),
  },
  {
    name: "Тривіт / Тетравіт",
    routes: ["injection"],
    calc: () => ({
      prev: {
        label: "Профілактика",
        value: "0,5 мл",
        note: "1 раз на місяць в/м",
      },
      treat: {
        label: "Лікування",
        value: "1 мл",
        note: "1 раз на тиждень в/м, 3–4 тижні",
      },
      course:
        "Профілактика: раз на місяць. Лікування: 1 раз на тиждень, 3–4 тижні.",
      warning:
        "Олійний препарат — вводити дуже повільно! Підігріти до кімнатної температури.",
      injNote: "Внутрішньом'язово — стегно задньої лапи або м'яз плеча.",
    }),
  },

  // ── АНТИБІОТИКИ (оральні) ────────────────────────────────
  {
    name: "Септовет (порошок)",
    routes: ["oral"],
    calc: (w) => ({
      treat: {
        label: "Лікування",
        value: `${(0.15 * w).toFixed(2)} г`,
        note: "2 рази на добу з кормом або водою. У перший день — подвоїти дозу.",
      },
      course: "3–5 днів.",
      infoNote: "1,5 г на 10 кг живої маси двічі на добу.",
    }),
  },
  {
    name: "Зінаприм",
    routes: ["oral"],
    calc: (w) => ({
      treat: {
        label: "Лікування",
        value: `${(1 * w).toFixed(2)} мл`,
        note: "2 рази на добу орально",
      },
      course: "5 днів.",
    }),
  },

  // ── ВІТАМІНИ ─────────────────────────────────────────────
  {
    name: "Чіктонік",
    routes: ["oral"],
    calc: () => ({
      prev: {
        label: "Профілактика — у воді",
        value: "0,5 мл / 1 л",
        note: "раз на місяць, 3–5 днів",
      },
      treat: {
        label: "Відновлення — у воді",
        value: "1 мл / 1 л",
        note: "щодня після лікування",
      },
      course: "5–7 днів після закінчення основного лікування.",
    }),
  },

  // ── ШКТ ──────────────────────────────────────────────────
  {
    name: "Симетикон / Еспумізан",
    routes: ["oral"],
    calc: () => ({
      treat: {
        label: "Лікування",
        value: "0,5–1 мл",
        note: "повторити через 1–2 год за потреби + масаж живота",
      },
      course: "До зникнення симптомів.",
      warning:
        "При сильному здутті — негайно до ветеринара! Без допомоги кролик може загинути за кілька годин.",
    }),
  },
  {
    name: "Лінекс / Ентерол",
    routes: ["oral"],
    calc: () => ({
      treat: {
        label: "Відновлення",
        value: "1 капсула",
        note: "розчинити у воді та випоїти 1 раз на добу",
      },
      course: "5 днів після закінчення основного курсу лікування.",
      infoNote:
        "Застосовується після антибіотиків або антипаразитарних препаратів.",
    }),
  },
];

const routeLabel: Record<RouteType, string> = {
  injection: "💉 Ін'єкція",
  oral: "💧 Орально",
  external: "🩹 Зовнішньо",
};

const DoseCalculator = () => {
  const [weight, setWeight] = useState<number>(2.0);
  const [selectedDrug, setSelectedDrug] = useState<DrugDef | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<RouteType>("oral");

  const handleDrugSelect = (drug: DrugDef) => {
    setSelectedDrug(drug);
    setSelectedRoute(drug.routes[0]);
  };

  const result = selectedDrug ? selectedDrug.calc(weight, selectedRoute) : null;

  return (
    <div className="dc-wrap">
      <div className="dc-title">🧮 Калькулятор дози</div>

      <p className="dc-subtitle">
        Введіть вагу кролика, оберіть препарат — отримайте точну дозу
      </p>

      <div className="dc-weight-section">
        <span className="dc-label">Вага кролика</span>
        <div className="dc-weight-row">
          <input
            type="range"
            min={0.1}
            max={8}
            step={0.1}
            value={weight}
            onChange={(e) => setWeight(parseFloat(e.target.value))}
            className="dc-slider"
          />
          <span className="dc-weight-val">{weight.toFixed(1)} кг</span>
        </div>
      </div>

      <div className="dc-section-label">Оберіть препарат</div>

      <div className="dc-drug-grid">
        {drugs.map((drug) => (
          <button
            key={drug.name}
            className={`dc-drug-btn${
              selectedDrug?.name === drug.name ? " dc-drug-btn--active" : ""
            }`}
            onClick={() => handleDrugSelect(drug)}
          >
            <span className="dc-drug-name">{drug.name}</span>
            <div className="dc-drug-badges">
              {drug.routes.map((r) => (
                <span key={r} className={`dc-badge dc-badge--${r}`}>
                  {routeLabel[r]}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      {selectedDrug && selectedDrug.routes.length > 1 && (
        <div className="dc-route-section">
          <span className="dc-label">Шлях введення</span>
          <div className="dc-route-row">
            {selectedDrug.routes.map((r) => (
              <button
                key={r}
                className={`dc-route-btn${
                  selectedRoute === r ? " dc-route-btn--active" : ""
                }`}
                onClick={() => setSelectedRoute(r)}
              >
                {routeLabel[r]}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="dc-result">
        {!result ? (
          <p className="dc-result-empty">
            Оберіть препарат і вагу — побачите дозу
          </p>
        ) : (
          <>
            <div className="dc-result-drug">{selectedDrug!.name}</div>

            <div className="dc-dose-row">
              {result.prev && (
                <div className="dc-dose-block dc-dose-block--prev">
                  <div className="dc-dose-label">{result.prev.label}</div>
                  <div className="dc-dose-value dc-dose-value--green">
                    {result.prev.value}
                  </div>
                  <div className="dc-dose-note">{result.prev.note}</div>
                </div>
              )}
              {result.treat && (
                <div className="dc-dose-block dc-dose-block--treat">
                  <div className="dc-dose-label">{result.treat.label}</div>
                  <div className="dc-dose-value dc-dose-value--amber">
                    {result.treat.value}
                  </div>
                  <div className="dc-dose-note">{result.treat.note}</div>
                </div>
              )}
            </div>

            <div className="dc-course">Курс: {result.course}</div>

            {result.infoNote && (
              <div className="dc-info-note">{result.infoNote}</div>
            )}
            {result.injNote && (
              <div className="dc-inj-note">💉 {result.injNote}</div>
            )}
            {result.warning && (
              <div className="dc-warning">⚠️ {result.warning}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DoseCalculator;
