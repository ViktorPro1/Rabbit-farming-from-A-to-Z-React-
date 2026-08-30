import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import "./Conveyor.css";
import ShareButton from "../../components/ShareButton/ShareButton";

// ==== СХЕМИ ЗЛУЧУВАННЯ (дні) ====
const PREGNANCY_DAYS = 31;

const WEANING_DAYS: Record<string, number> = {
  intensive: 28,
  semi_intensive: 45,
  extensive: 60,
};

const FATTENING_DAYS = 60; // молодняк росте після відлучення до забою

type Mode = "individual" | "groups";

interface GroupRow {
  groupNumber: number;
  rabbitsCount: number;
  matingDate: Date;
  controlDate: Date;
  expectedBirth: Date;
  weaningDate: Date;
  slaughterDate: Date;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function fmt(date: Date): string {
  return date.toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function fmtMonth(date: Date): string {
  return date.toLocaleDateString("uk-UA", { month: "long", year: "numeric" });
}

const Conveyor = () => {
  const [mode, setMode] = useState<Mode>("groups");
  const [rabbitsCount, setRabbitsCount] = useState<number>(9);
  const [groupSize, setGroupSize] = useState<number>(3);
  const [scheme, setScheme] = useState<string>("extensive");
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );

  const cycleDays = PREGNANCY_DAYS + (WEANING_DAYS[scheme] || 60);

  // При режимі "по одній" кожна кролиця — своя "група" розміром 1.
  // При режимі "групами" — розмір групи бере користувач.
  const effectiveGroupSize = mode === "individual" ? 1 : Math.max(1, groupSize);
  const groupsCount = Math.max(1, Math.ceil(rabbitsCount / effectiveGroupSize));
  const stepDays = Math.max(1, Math.round(cycleDays / groupsCount));

  const rows: GroupRow[] = useMemo(() => {
    if (!startDate || rabbitsCount <= 0) return [];
    const base = new Date(startDate);
    const result: GroupRow[] = [];

    for (let g = 0; g < groupsCount; g++) {
      const rabbitsInGroup =
        g < groupsCount - 1
          ? effectiveGroupSize
          : rabbitsCount - effectiveGroupSize * (groupsCount - 1);

      const matingDate = addDays(base, g * stepDays);
      const controlDate = addDays(matingDate, 7);
      const expectedBirth = addDays(matingDate, PREGNANCY_DAYS);
      const weaningDate = addDays(expectedBirth, WEANING_DAYS[scheme] || 60);
      const slaughterDate = addDays(weaningDate, FATTENING_DAYS);

      result.push({
        groupNumber: g + 1,
        rabbitsCount: rabbitsInGroup,
        matingDate,
        controlDate,
        expectedBirth,
        weaningDate,
        slaughterDate,
      });
    }
    return result;
  }, [
    rabbitsCount,
    effectiveGroupSize,
    scheme,
    startDate,
    groupsCount,
    stepDays,
  ]);

  const slaughterForecast = useMemo(() => {
    if (rows.length === 0) return [];
    const map: Record<string, number> = {};
    const kitsPerRabbit = 6;
    const horizonEnd = addDays(new Date(startDate), 370);

    rows.forEach((row) => {
      let sd = new Date(row.slaughterDate);
      while (sd <= horizonEnd) {
        const key = fmtMonth(sd);
        map[key] = (map[key] || 0) + row.rabbitsCount * kitsPerRabbit;
        sd = addDays(sd, cycleDays);
      }
    });

    return Object.entries(map);
  }, [rows, cycleDays, startDate]);

  return (
    <main className="okril-page">
      <div className="okril-header">
        <h1>Конвеєр окролів</h1>
        <p>Розрахунок графіка злучок для рівномірного виходу м'яса цілий рік</p>
      </div>

      <div className="okril-wrap">
        {/* ПОЯСНЕННЯ */}
        <div className="okril-section-title">📖 Що таке конвеєр окролів</div>
        <div className="okril-note">
          <h2>Принцип безперервного виробництва</h2>
          <p>
            Конвеєр — це спосіб організації злучок, при якому кроличок
            розбивають на групи (або крокують кожну кроличку окремо) так, щоб
            окроли, відлучення і забій не відбувались всі одночасно, а
            рівномірно розподілялись протягом року.
          </p>
          <p>
            Є два підходи: крити кожну кроличку <strong>окремо</strong>, з
            рівним кроком між ними — тоді м'ясо виходить дрібними партіями майже
            щотижня, або крити кроличок <strong>групами</strong>
            (наприклад по 3, як роблять на невеликих фермах) — тоді м'ясо
            виходить хвилями раз на місяць-два, зате простіше обслуговувати:
            один день — одна партія на злучку, окрол чи забій.
          </p>
          <div className="okril-alert ok">
            ✅ Оберіть режим і кількість кроличок нижче — система розрахує дати
            автоматично.
          </div>
        </div>

        {/* КАЛЬКУЛЯТОР */}
        <div className="okril-section-title">🧮 Розрахунок графіка</div>
        <div className="okril-note conveyor-calc-note">
          {/* ПЕРЕМИКАЧ РЕЖИМУ */}
          <div className="conveyor-mode-switch">
            <button
              type="button"
              className={`conveyor-mode-btn${mode === "individual" ? " active" : ""}`}
              onClick={() => setMode("individual")}
            >
              🐇 По одній кроличці
            </button>
            <button
              type="button"
              className={`conveyor-mode-btn${mode === "groups" ? " active" : ""}`}
              onClick={() => setMode("groups")}
            >
              📦 Групами
            </button>
          </div>
          <p className="conveyor-mode-desc">
            {mode === "individual"
              ? "Кожна кроличка крокує окремо з рівним інтервалом — м'ясо виходить невеликими партіями частіше."
              : "Кролички об'єднуються в групи, які крокують разом — м'ясо виходить більшими партіями рідше, простіше обслуговувати."}
          </p>

          <div className="conveyor-form-grid">
            <div className="conveyor-form-field">
              <label>Кількість кроличок</label>
              <input
                type="number"
                min={1}
                value={rabbitsCount}
                onChange={(e) => setRabbitsCount(Number(e.target.value) || 0)}
              />
            </div>

            {mode === "groups" && (
              <div className="conveyor-form-field">
                <label>Розмір групи</label>
                <input
                  type="number"
                  min={1}
                  value={groupSize}
                  onChange={(e) => setGroupSize(Number(e.target.value) || 1)}
                />
              </div>
            )}

            <div className="conveyor-form-field">
              <label>Схема злучування</label>
              <select
                value={scheme}
                onChange={(e) => setScheme(e.target.value)}
              >
                <option value="intensive">Інтенсивна</option>
                <option value="semi_intensive">Напівінтенсивна</option>
                <option value="extensive">Екстенсивна</option>
              </select>
            </div>

            <div className="conveyor-form-field">
              <label>Дата старту конвеєра</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </div>

          <div className="conveyor-summary">
            <span>
              📦 {mode === "individual" ? "Кроличок у черзі" : "Груп"}:{" "}
              <strong>{groupsCount}</strong>
            </span>
            <span>
              🔁 Крок між {mode === "individual" ? "кроличками" : "групами"}:{" "}
              <strong>{stepDays} дн.</strong>
            </span>
            <span>
              📅 Повний цикл кролички: <strong>{cycleDays} дн.</strong>
            </span>
          </div>
        </div>

        {/* ТАБЛИЦЯ ГРАФІКА */}
        {rows.length > 0 && (
          <>
            <div className="okril-section-title">
              📋 Графік {mode === "individual" ? "по кроличках" : "по групах"}
            </div>
            <div
              className="okril-note"
              style={{ padding: 0, overflow: "hidden" }}
            >
              <div style={{ overflowX: "auto" }}>
                <table className="okril-table">
                  <thead>
                    <tr>
                      <th>{mode === "individual" ? "Кроличка №" : "Група"}</th>
                      <th>К-сть кроличок</th>
                      <th>Злучка</th>
                      <th>Контрольна</th>
                      <th>Окрол (очік.)</th>
                      <th>Відлучення</th>
                      <th>Забій (очік.)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.groupNumber}>
                        <td>
                          <strong>
                            {mode === "individual"
                              ? r.groupNumber
                              : `Гр. ${r.groupNumber}`}
                          </strong>
                        </td>
                        <td>{r.rabbitsCount}</td>
                        <td>{fmt(r.matingDate)}</td>
                        <td>{fmt(r.controlDate)}</td>
                        <td>{fmt(r.expectedBirth)}</td>
                        <td>{fmt(r.weaningDate)}</td>
                        <td>{fmt(r.slaughterDate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ПРОГНОЗ */}
        {slaughterForecast.length > 0 && (
          <>
            <div className="okril-section-title">
              📈 Прогноз виходу молодняку на забій
            </div>
            <div className="okril-note">
              <div className="conveyor-forecast-grid">
                {slaughterForecast.map(([month, count]) => (
                  <div key={month} className="conveyor-forecast-item">
                    <span className="conveyor-forecast-month">{month}</span>
                    <span className="conveyor-forecast-count">
                      ~{count} гол.
                    </span>
                  </div>
                ))}
              </div>
              <p style={{ marginTop: "12px", fontSize: "13px" }}>
                Орієнтовний розрахунок (≈6 голів молодняку на забій з однієї
                кролички за окрол). Реальні цифри залежать від породи, приплоду
                і відходу.
              </p>
            </div>
          </>
        )}

        {/* ПОРАДИ */}
        <div className="okril-section-title">💡 Практичні поради</div>
        <div className="okril-grid">
          <article className="okril-card">
            <div className="okril-card-header">
              <span className="okril-icon">🐇</span>
              <h3>Коли обирати "По одній"</h3>
            </div>
            <div className="okril-card-body">
              <p>
                Якщо хочете максимально рівномірний вихід м'яса (майже щотижня
                щось готове) і не проти частіше приділяти увагу господарству —
                цей режим ефективніший, але вимагає постійного контролю.
              </p>
            </div>
          </article>

          <article className="okril-card">
            <div className="okril-card-header">
              <span className="okril-icon">📦</span>
              <h3>Коли обирати "Групами"</h3>
            </div>
            <div className="okril-card-body">
              <p>
                Групи по 3 кролички — зручний розмір: одна клітка-маточник на
                групу легко обслуговується за один день. Простіше планувати час,
                менше метушні, зате партії м'яса рідші й більші.
              </p>
            </div>
          </article>

          <article className="okril-card">
            <div className="okril-card-header">
              <span className="okril-icon">📌</span>
              <h3>Це орієнтир, не жорсткий план</h3>
            </div>
            <div className="okril-card-body">
              <p>
                Розрахунок показує ідеальний графік. У житті частина злучок не
                вдається з першого разу — фактичні дати кожної тварини фіксуйте
                в розділі «Парування», а цю сторінку використовуйте для
                планування наперед.
              </p>
            </div>
          </article>
        </div>

        <section className="okril-related-section">
          <div className="okril-container">
            <h3 className="okril-related-title">Читайте також</h3>
            <div className="okril-related-grid">
              <Link to="/okril" className="okril-related-link">
                🐰 Окріл
              </Link>
              <Link to="/mating-frequency" className="okril-related-link">
                🔁 Частота злучування
              </Link>
              <Link to="/doe-preparation" className="okril-related-link">
                ♀️ Підготовка самки до злучки
              </Link>
              <Link to="/okril-control" className="okril-related-link">
                🔍 Контроль дат
              </Link>
              <Link to="/weaning" className="okril-related-link">
                🥣 Відлучення та дорощування
              </Link>
              <Link to="/buck-management" className="okril-related-link">
                ♂️ Утримання плідника
              </Link>
            </div>
          </div>
        </section>

        <div className="okril-back">
          <Link to="/" className="okril-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Конвеєр окролів" />
        </div>
      </div>
    </main>
  );
};

export default Conveyor;
