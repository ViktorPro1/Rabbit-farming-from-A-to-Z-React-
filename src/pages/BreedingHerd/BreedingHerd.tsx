import { useState } from "react";
import { Link } from "react-router-dom";
import "./BreedingHerd.css";

// ─── ДАНІ ───────────────────────────────────────────────

const concepts = [
  {
    term: "Маточне поголів'я",
    simple:
      "Це самки, які дають потомство. Вони — серце господарства. Від їх кількості залежить скільки кролів ти отримаєш за рік.",
  },
  {
    term: "Обіговість стада",
    simple:
      "Скільки разів на рік одна самка дає окріл. При інтенсивній схемі — 8 разів, при звичайній — 5, при щадній — 3. Чим більше окролів, тим більше навантаження на самку.",
  },
  {
    term: "Виживаність молодняку",
    simple:
      "Не всі кроленята, що народились, доживають до продажу. Смерть від холоду, хвороб, травм — це норма. У новачка виживає 65–75%, у досвідченого — 80–90%.",
  },
  {
    term: "Пікове поголів'я",
    simple:
      "Найбільша кількість кролів одночасно на фермі. Буває коли всі самки одночасно мають підсисний молодняк + молодняк на відгодівлі. Від цього числа рахуй клітко-місця.",
  },
  {
    term: "Ремонтний молодняк",
    simple:
      "Молоді самки, яких вирощуєш на заміну старим або продуктивність яких падає. Зазвичай 20–30% від маточного стада щороку.",
  },
  {
    term: "Навантаження на самця",
    simple:
      "Один самець може запліднити 8–10 самок. Якщо самців менше — частина самок залишається незаплідненою. Якщо більше — зайві витрати на корм.",
  },
];

const schemeRows = [
  {
    scheme: "Екстенсивна",
    litters: 3,
    weaning: "45–60 днів",
    restDays: "60–90 днів після окролу",
    pros: "Мінімальний стрес на самку, довший термін використання",
    cons: "Мало молодняку на рік, низька рентабельність",
    who: "Домашнє господарство для себе",
  },
  {
    scheme: "Напівінтенсивна",
    litters: 5,
    weaning: "35–42 дні",
    restDays: "14–21 день після окролу",
    pros: "Баланс між навантаженням і продуктивністю",
    cons: "Потребує більше уваги до стану самок",
    who: "Мале товарне господарство 10–50 самок",
  },
  {
    scheme: "Інтенсивна",
    litters: 8,
    weaning: "28 днів",
    restDays: "Злучка на 2–4 день після окролу",
    pros: "Максимум молодняку з однієї самки",
    cons: "Висока смертність, самки швидко зношуються",
    who: "Промислові ферми з ветеринарним контролем",
  },
];

const replacementRules = [
  {
    icon: "📅",
    title: "За терміном",
    desc: "Самка дає 6–8 окролів і потім продуктивність падає. Це 2–2.5 роки при напівінтенсивній схемі. Після цього — заміна.",
  },
  {
    icon: "📉",
    title: "За продуктивністю",
    desc: "Якщо виплід падає нижче 5 живих крільченят два окроли підряд — самку вибраковують незалежно від віку.",
  },
  {
    icon: "🏥",
    title: "За здоров'ям",
    desc: "Мастит, хронічний пронос, відмова від потомства — підстава для негайної заміни без чекання терміну.",
  },
  {
    icon: "🔄",
    title: "Темп заміни",
    desc: "Плануй оновлення 20–30% стада щороку. Це означає що щороку потрібно вирощувати ремонтних самок у кількості 0.2–0.3 від маточного поголів'я.",
  },
];

const peakCalcExplanation = [
  {
    step: "1",
    title: "Самки маточного стада",
    formula: "N самок",
    example: "10 самок",
  },
  {
    step: "2",
    title: "Самці-плідники",
    formula: "⌈N ÷ 8⌉",
    example: "⌈10 ÷ 8⌉ = 2 самці",
  },
  {
    step: "3",
    title: "Підсисний молодняк (найбільший окріл)",
    formula: "N × виплід",
    example: "10 × 7.5 = 75 крільченят",
  },
  {
    step: "4",
    title: "Молодняк на відгодівлі",
    formula: "Виживших за 2–3 місяці відгодівлі",
    example: "75 × 0.8 = 60 голів",
  },
  {
    step: "5",
    title: "Ремонтний молодняк",
    formula: "N × 0.25",
    example: "10 × 0.25 = 3 голови",
  },
  {
    step: "6",
    title: "Пікове поголів'я разом",
    formula: "Сума всіх рядків",
    example: "10 + 2 + 75 + 60 + 3 = 150 голів",
  },
];

const readyTable = [
  { females: 5, males: 1, young_year: 90, peak: 75, cages: 20 },
  { females: 10, males: 2, young_year: 180, peak: 145, cages: 38 },
  { females: 20, males: 3, young_year: 360, peak: 285, cages: 72 },
  { females: 30, males: 4, young_year: 540, peak: 425, cages: 108 },
  { females: 50, males: 7, young_year: 900, peak: 710, cages: 178 },
  { females: 100, males: 13, young_year: 1800, peak: 1415, cages: 354 },
];

const mistakes = [
  {
    mistake: "Рахувати тільки дорослих",
    result:
      "Купив 10 клітин на 10 самок — і через місяць не маєш куди садити молодняк",
    fix: "Завжди рахуй пікове поголів'я, а не тільки маточне стадо",
  },
  {
    mistake: "Планувати без урахування заміни",
    result:
      "Через 2 роки стадо постаріло, продуктивність впала, нових самок немає",
    fix: "Щороку вирощуй ремонтних самок у кількості 25% від стада",
  },
  {
    mistake: "Один самець на все стадо",
    result:
      "Самець перевантажений, якість сперми падає, відсоток заплідненості знижується",
    fix: "1 самець на 8 самок — не більше. Май запасного плідника",
  },
  {
    mistake: "Збільшувати стадо без перевірки збуту",
    result: "Тушки нікуди дівати, кролі переростають, витрати зростають",
    fix: "Спочатку знайди покупців на поточний обсяг — тоді масштабуйся",
  },
];

// ─── КАЛЬКУЛЯТОР ─────────────────────────────────────────

type Scheme = "extensive" | "semi" | "intensive";

const SCHEME_LITTERS: Record<Scheme, number> = {
  extensive: 3,
  semi: 5,
  intensive: 8,
};

const SCHEME_LABELS: Record<Scheme, string> = {
  extensive: "Екстенсивна (3 окроли)",
  semi: "Напівінтенсивна (5 окролів)",
  intensive: "Інтенсивна (8 окролів)",
};

function calcHerd(
  targetYoung: number,
  scheme: Scheme,
  litterSize: number,
  survival: number,
) {
  const litters = SCHEME_LITTERS[scheme];
  const survRate = survival / 100;
  const youngPerFemaleYear = litters * litterSize * survRate;
  const females = Math.ceil(targetYoung / youngPerFemaleYear);
  const males = Math.ceil(females / 8);
  const totalAdults = females + males;
  const repair = Math.ceil(females * 0.25);
  const bornPerYear = females * litters * litterSize;
  const survivedPerYear = Math.round(bornPerYear * survRate);
  const avgOnFattening = Math.round(
    survivedPerYear *
      (scheme === "intensive"
        ? 2.5 / 12
        : scheme === "semi"
          ? 3 / 12
          : 3.5 / 12) *
      2,
  );
  const peak =
    females +
    males +
    Math.round(females * litterSize) +
    avgOnFattening +
    repair;
  const cages = Math.ceil(peak * 0.65);

  return {
    females,
    males,
    totalAdults,
    repair,
    bornPerYear: Math.round(bornPerYear),
    survivedPerYear,
    peak,
    cages,
  };
}

// ─── КОМПОНЕНТ ───────────────────────────────────────────

const BreedingHerd = () => {
  const [targetYoung, setTargetYoung] = useState(200);
  const [scheme, setScheme] = useState<Scheme>("semi");
  const [litterSize, setLitterSize] = useState(7);
  const [survival, setSurvival] = useState(80);

  const result = calcHerd(targetYoung, scheme, litterSize, survival);

  return (
    <main className="bh-page">
      <div className="bh-header">
        <h1>🐇 Розрахунок маточного поголів'я</h1>
        <p>
          Скільки самок потрібно щоб отримати потрібну кількість кролів — просто
          і зрозуміло
        </p>
      </div>

      <div className="bh-wrap">
        {/* ВСТУП */}
        <div className="bh-intro">
          <h2>Що таке маточне поголів'я і навіщо його рахувати</h2>
          <p>
            Багато початківців купують кролів "на око" — взяли 5 самок,
            подивимось що буде. Через 3 місяці виявляється: клітин не вистачає,
            молодняк нікуди садити, один самець не встигає, а після загибелі
            двох самок господарство зупинилось.
          </p>
          <p>
            Правильний розрахунок маточного поголів'я відповідає на три питання
            одразу: скільки самок потрібно для досягнення цілі, скільки клітин
            готувати, і яку кількість тварин тримати в голові при плануванні
            витрат.
          </p>
          <div className="bh-alert">
            💡 Головна помилка — рахувати тільки дорослих. Пікове поголів'я під
            час активного сезону в 3–5 разів більше ніж маточне стадо.
          </div>
        </div>

        {/* ПОНЯТТЯ */}
        <div className="bh-section-title">
          📖 Ключові поняття простими словами
        </div>
        <div className="bh-concepts">
          {concepts.map((c) => (
            <div key={c.term} className="bh-concept-card">
              <div className="bh-concept-term">{c.term}</div>
              <div className="bh-concept-desc">{c.simple}</div>
            </div>
          ))}
        </div>

        {/* СХЕМИ РОЗВЕДЕННЯ */}
        <div className="bh-section-title">
          🔁 Три схеми розведення — що обрати
        </div>
        <div className="bh-note">
          Від схеми залежить все: скільки окролів на рік, коли відлучати
          кроленят, як швидко зношуються самки. Обирай виходячи з ресурсів і
          мети.
        </div>
        <div className="bh-table-wrap">
          <table className="bh-table">
            <thead>
              <tr>
                <th>Схема</th>
                <th>Окролів/рік</th>
                <th>Відлучення</th>
                <th>Перевага</th>
                <th>Недолік</th>
                <th>Кому підходить</th>
              </tr>
            </thead>
            <tbody>
              {schemeRows.map((r) => (
                <tr key={r.scheme}>
                  <td>
                    <strong>{r.scheme}</strong>
                  </td>
                  <td className="bh-td-center">{r.litters}</td>
                  <td>{r.weaning}</td>
                  <td>{r.pros}</td>
                  <td>{r.cons}</td>
                  <td>{r.who}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ЯК РАХУЄТЬСЯ ПІКОВЕ ПОГОЛІВ'Я */}
        <div className="bh-section-title">📐 Як рахується пікове поголів'я</div>
        <div className="bh-note">
          Пікове поголів'я — це найбільша кількість кролів яка одночасно
          перебуває у тебе на фермі. Саме під нього потрібно готувати клітини і
          планувати витрати на корм.
        </div>
        <div className="bh-peak-steps">
          {peakCalcExplanation.map((s) => (
            <div key={s.step} className="bh-peak-step">
              <div className="bh-peak-num">{s.step}</div>
              <div className="bh-peak-body">
                <div className="bh-peak-title">{s.title}</div>
                <div className="bh-peak-row">
                  <span className="bh-peak-formula">{s.formula}</span>
                  <span className="bh-peak-example">Приклад: {s.example}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ЗАМІНА СТАДА */}
        <div className="bh-section-title">🔄 Заміна і оновлення стада</div>
        <div className="bh-replace-grid">
          {replacementRules.map((r) => (
            <div key={r.title} className="bh-replace-card">
              <div className="bh-replace-icon">{r.icon}</div>
              <div>
                <div className="bh-replace-title">{r.title}</div>
                <div className="bh-replace-desc">{r.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ГОТОВА ТАБЛИЦЯ */}
        <div className="bh-section-title">
          📊 Орієнтовна таблиця для різних розмірів господарства
        </div>
        <div className="bh-note">
          Розрахунок для напівінтенсивної схеми (5 окролів/рік), виплід 7–8
          крільченят, виживаність 80%. Кількість клітин вказана мінімально
          необхідна.
        </div>
        <div className="bh-table-wrap">
          <table className="bh-table">
            <thead>
              <tr>
                <th>Самок</th>
                <th>Самців</th>
                <th>Молодняку за рік</th>
                <th>Пікове поголів'я</th>
                <th>Клітин мінімум</th>
              </tr>
            </thead>
            <tbody>
              {readyTable.map((r) => (
                <tr key={r.females}>
                  <td>
                    <strong>{r.females}</strong>
                  </td>
                  <td>{r.males}</td>
                  <td className="bh-td-income">{r.young_year}</td>
                  <td className="bh-td-warn">{r.peak}</td>
                  <td>{r.cages}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ТИПОВІ ПОМИЛКИ */}
        <div className="bh-section-title">
          ❌ Типові помилки при плануванні стада
        </div>
        <div className="bh-mistakes">
          {mistakes.map((m) => (
            <div key={m.mistake} className="bh-mistake-card">
              <div className="bh-mistake-top">
                <strong>❌ {m.mistake}</strong>
                <div className="bh-mistake-result">Результат: {m.result}</div>
              </div>
              <div className="bh-mistake-fix">
                <span>✅</span>
                <span>{m.fix}</span>
              </div>
            </div>
          ))}
        </div>

        {/* КАЛЬКУЛЯТОР */}
        <div className="bh-section-title">
          🧮 Калькулятор маточного поголів'я
        </div>
        <div className="bh-note">
          Введи скільки молодняку хочеш отримувати за рік — калькулятор покаже
          скільки самок потрібно і яке пікове поголів'я готувати.
        </div>

        <div className="bh-calc-wrap">
          <div className="bh-calc-inputs">
            <div className="bh-calc-card">
              <div className="bh-calc-title">🎯 Ціль і параметри</div>

              <div className="bh-field">
                <label>Скільки голів молодняку хочу отримати за рік</label>
                <div className="bh-slider-row">
                  <input
                    type="range"
                    min={20}
                    max={2000}
                    step={10}
                    value={targetYoung}
                    onChange={(e) => setTargetYoung(+e.target.value)}
                  />
                  <span className="bh-val">{targetYoung} гол/рік</span>
                </div>
                <div className="bh-hint">
                  Для власного столу достатньо 50–100. Для продажу — від 200.
                </div>
              </div>

              <div className="bh-field">
                <label>Схема розведення</label>
                <div className="bh-radio-group">
                  {(Object.keys(SCHEME_LABELS) as Scheme[]).map((s) => (
                    <label
                      key={s}
                      className={`bh-radio ${scheme === s ? "active" : ""}`}
                    >
                      <input
                        type="radio"
                        name="scheme"
                        checked={scheme === s}
                        onChange={() => setScheme(s)}
                      />
                      <span>{SCHEME_LABELS[s]}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bh-field">
                <label>Середній виплід (живих крільченят на окріл)</label>
                <div className="bh-slider-row">
                  <input
                    type="range"
                    min={4}
                    max={12}
                    step={1}
                    value={litterSize}
                    onChange={(e) => setLitterSize(+e.target.value)}
                  />
                  <span className="bh-val">{litterSize} кр.</span>
                </div>
                <div className="bh-hint">
                  Реалістично: 6–8. У досвідчених — до 10.
                </div>
              </div>

              <div className="bh-field">
                <label>Виживаність молодняку до продажу</label>
                <div className="bh-slider-row">
                  <input
                    type="range"
                    min={50}
                    max={95}
                    step={5}
                    value={survival}
                    onChange={(e) => setSurvival(+e.target.value)}
                  />
                  <span className="bh-val">{survival}%</span>
                </div>
                <div className="bh-hint">
                  Для новачка: 65–75%. Для досвідченого: 80–90%.
                </div>
              </div>
            </div>
          </div>

          <div className="bh-calc-results">
            <div className="bh-result-card">
              <div className="bh-result-title">📊 Результат</div>

              <div className="bh-result-main">
                <div className="bh-result-big">
                  <div className="bh-result-num">{result.females}</div>
                  <div className="bh-result-label">самок маточного стада</div>
                </div>
                <div className="bh-result-big secondary">
                  <div className="bh-result-num">{result.males}</div>
                  <div className="bh-result-label">самців-плідників</div>
                </div>
              </div>

              <div className="bh-result-rows">
                <div className="bh-result-row">
                  <span>Народиться за рік</span>
                  <strong>{result.bornPerYear} крільченят</strong>
                </div>
                <div className="bh-result-row">
                  <span>Виживе до продажу</span>
                  <strong>{result.survivedPerYear} голів</strong>
                </div>
                <div className="bh-result-row">
                  <span>Ремонтний молодняк (25%)</span>
                  <strong>{result.repair} самок/рік</strong>
                </div>
                <div className="bh-result-row peak">
                  <span>Пікове поголів'я</span>
                  <strong>{result.peak} голів</strong>
                </div>
                <div className="bh-result-row cages">
                  <span>Клітин мінімум</span>
                  <strong>{result.cages} шт.</strong>
                </div>
              </div>

              <div className="bh-result-note">
                💡 Пікове поголів'я і кількість клітин — це мінімум. Закладай
                запас +15–20% на карантин і непередбачені ситуації.
              </div>
            </div>
          </div>
        </div>

        {/* ВИСНОВОК */}
        <div className="bh-conclusion">
          <h2>🎯 З чого почати</h2>
          <div className="bh-conclusion-steps">
            <div className="bh-conclusion-step">
              <div className="bh-conclusion-num">1</div>
              <div>
                Визнач ціль — скільки кролів потрібно на рік: для себе чи для
                продажу
              </div>
            </div>
            <div className="bh-conclusion-step">
              <div className="bh-conclusion-num">2</div>
              <div>Обери схему розведення під свої ресурси часу і досвіду</div>
            </div>
            <div className="bh-conclusion-step">
              <div className="bh-conclusion-num">3</div>
              <div>
                Порахуй пікове поголів'я — і готуй клітини під нього, а не під
                маточне стадо
              </div>
            </div>
            <div className="bh-conclusion-step">
              <div className="bh-conclusion-num">4</div>
              <div>
                Завжди май запасного самця і план заміни 25% самок щороку
              </div>
            </div>
            <div className="bh-conclusion-step">
              <div className="bh-conclusion-num">5</div>
              <div>
                Починай з меншого — 5–10 самок. Набий руку, знайди збут, потім
                збільшуй
              </div>
            </div>
          </div>
        </div>

        <div className="bh-back">
          <Link to="/" className="bh-back-btn">
            ⬅ На головну
          </Link>
          <Link to="/economics" className="bh-back-btn secondary">
            💰 Економіка
          </Link>
          <Link to="/profit-calculator" className="bh-back-btn secondary">
            🧮 Рентабельність
          </Link>
        </div>
      </div>
    </main>
  );
};

export default BreedingHerd;
