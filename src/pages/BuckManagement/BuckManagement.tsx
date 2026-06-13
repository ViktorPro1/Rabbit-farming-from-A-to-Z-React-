import { Link } from "react-router-dom";
import "./BuckManagement.css";

const weekDays = [
  { label: "Пн", val: "Злучка", work: true },
  { label: "Вт", val: "Злучка", work: true },
  { label: "Ср", val: "Відпочинок", work: false },
  { label: "Чт", val: "Злучка", work: true },
  { label: "Пт", val: "Злучка", work: true },
  { label: "Сб", val: "Відпочинок", work: false },
  { label: "Нд", val: "Відпочинок", work: false },
];

const BuckManagement = () => {
  return (
    <main className="buck-page">
      <div className="buck-hero">
        <h1 className="buck-hero__title">Утримання та оцінка плідника</h1>
        <p className="buck-hero__sub">
          Норми навантаження, оцінка якості, вплив тепла, відбраковка — все про
          самця
        </p>
      </div>

      <div className="buck-note">
        <span className="buck-note__icon">⚠️</span>
        <span>
          Плідник відповідає за 50% генетики всього стада. Один невиявлений
          безплідний самець означає місяць втрачених окролів у всіх самок, яких
          він покривав.{" "}
          <strong>
            Перевіряй фертильність плідника раз на 3 місяці — контрольним
            покриттям.
          </strong>
        </span>
      </div>

      {/* ВІК І ПОЧАТОК РОБОТИ */}
      <section className="buck-section">
        <div className="buck-section__header">
          <span className="buck-section__icon">📅</span>
          <h2 className="buck-section__title">
            Вік і початок племінного використання
          </h2>
        </div>
        <div className="buck-table-wrap">
          <table className="buck-table">
            <thead>
              <tr>
                <th>Група порід</th>
                <th>Мінімальний вік</th>
                <th>Оптимальний вік початку</th>
                <th>Кінець активного використання</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Дрібні (до 3 кг)", "4 місяці", "5–6 місяців", "2,5–3 роки"],
                [
                  "Середні (3–5 кг) — НЗБ, Каліфорнійський",
                  "5 місяців",
                  "6–7 місяців",
                  "3 роки",
                ],
                [
                  "Великі (5–8 кг) — Фландр, С.велетень",
                  "7 місяців",
                  "8–9 місяців",
                  "3–3,5 роки",
                ],
              ].map(([група, мін, опт, кін]) => (
                <tr key={група}>
                  <td className="buck-table__hl">{група}</td>
                  <td>{мін}</td>
                  <td>{опт}</td>
                  <td>{кін}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="buck-warn">
          <span className="buck-warn__icon">⚠️</span>
          <span>
            Використання самця раніше мінімального віку дає неякісну
            спарматозоїди низької рухливості, дрібні посліди і псевдовагітності
            у самок. Дочекайся повного статевого дозрівання.
          </span>
        </div>
      </section>

      {/* НОРМИ НАВАНТАЖЕННЯ */}
      <section className="buck-section">
        <div className="buck-section__header">
          <span className="buck-section__icon">📊</span>
          <h2 className="buck-section__title">
            Норми навантаження та режим роботи
          </h2>
        </div>
        <div className="buck-table-wrap">
          <table className="buck-table">
            <thead>
              <tr>
                <th>Схема</th>
                <th>Самок на плідника</th>
                <th>Злучок/тиждень</th>
                <th>Примітка</th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "Мала ферма",
                  "5–8 самок",
                  "до 4",
                  "Один плідник може покрити всіх",
                ],
                [
                  "Середня ферма (рекомендована)",
                  "8–12 самок",
                  "4–6",
                  "Оптимальне навантаження",
                ],
                [
                  "Інтенсивна",
                  "12–15 самок",
                  "6–10",
                  "Потрібна ротація двох плідників",
                ],
                [
                  "Максимум (промислова)",
                  "до 20 самок",
                  "до 12",
                  "Тільки при ШО або строгому контролі",
                ],
              ].map(([схема, самок, злучок, прим], i) => (
                <tr key={схема}>
                  <td className={i === 1 ? "buck-table__hl" : ""}>
                    {схема}
                    {i === 1 ? " ✓" : ""}
                  </td>
                  <td>{самок}</td>
                  <td>{злучок}</td>
                  <td>{прим}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: "1.25rem" }}>
          <div
            style={{
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "var(--green-dark, #2d5a27)",
              marginBottom: "0.5rem",
            }}
          >
            Приклад тижневого графіку (4 злучки/тиждень)
          </div>
          <div className="buck-schedule">
            {weekDays.map((d) => (
              <div
                key={d.label}
                className={`buck-day ${d.work ? "buck-day--work" : "buck-day--rest"}`}
              >
                <div className="buck-day__label">{d.label}</div>
                <div className="buck-day__val">{d.val}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="buck-info">
          <span className="buck-info__icon">💡</span>
          <span>
            Якщо самець використовується двічі в один день — другий еякулят
            завжди якісніший і багатший на сперматозоїди, ніж перший. При ШО це
            враховують: перший еякулят викидають, другий використовують для
            осіменіння.
          </span>
        </div>
      </section>

      {/* ОЦІНКА ПЛІДНИКА */}
      <section className="buck-section">
        <div className="buck-section__header">
          <span className="buck-section__icon">🔍</span>
          <h2 className="buck-section__title">
            Оцінка плідника перед введенням у стадо
          </h2>
        </div>
        <div className="buck-assess">
          {[
            {
              icon: "🫀",
              title: "Яєчка та мошонка",
              ok: [
                "Обидва яєчка опущені та симетричні",
                "Щільні на дотик, пружні",
                "Без вузлів, набряків, абсцесів",
                "Розмір відповідний до породи",
              ],
              fail: [
                "Одне або обидва яєчка не опускаються (справжній крипторхізм)",
                "М'які, нерівні або збільшені яєчка",
                "Болючість при пальпації",
              ],
            },
            {
              icon: "⚖️",
              title: "Кондиція тіла",
              ok: [
                "BCS 3–3,5 — оптимальна",
                "Добре розвинена мускулатура крупу і спини",
                "Активний, не млявий",
              ],
              fail: [
                "BCS 1–2 — виснаження, знижена якість сперми",
                "BCS 4–5 — ожиріння, низьке лібідо",
                "Апатія, небажання рухатись",
              ],
            },
            {
              icon: "🦷",
              title: "Зуби та щелепа",
              ok: [
                "Правильний прикус — різці рівно змикаються",
                "Немає надмірного слиновиділення",
              ],
              fail: [
                "Маклодоція (неправильний прикус) — спадкова вада, вибраковка",
                "Зубні шипи — перевіряй корінні зуби",
              ],
            },
            {
              icon: "🦶",
              title: "Лапи та постава",
              ok: [
                "Рівна постава без кульгавості",
                "Лапи без пododерматиту",
                "Впевнений рух, монтує без проблем",
              ],
              fail: [
                "Кульгавість — не зможе монтувати",
                "Пododерматит — болісно і довго лікується",
                "Слабкі задні лапи",
              ],
            },
            {
              icon: "🧬",
              title: "Лібідо та монтажний рефлекс",
              ok: [
                "Реагує на самку протягом 1–2 хвилин",
                "Упевнений монтаж з правильним положенням",
                "Після садки падає на бік (ознака еякуляції)",
              ],
              fail: [
                "Не реагує на самку більше 5 хвилин",
                "Монтує, але не садить правильно",
                "Немає падіння на бік після садки",
              ],
            },
            {
              icon: "📋",
              title: "Продуктивні показники",
              ok: [
                "Заплідненість самок 80%+",
                "Середній послід 7+ крільченят",
                "Стабільні результати в різних самок",
              ],
              fail: [
                "Заплідненість нижче 60% — перевір на тепловий стрес або хворобу",
                "Постійно малі посліди від цього плідника — генетика або спермапатологія",
              ],
            },
          ].map((card) => (
            <div key={card.title} className="buck-assess-card">
              <div className="buck-assess-card__icon">{card.icon}</div>
              <div className="buck-assess-card__title">{card.title}</div>
              <div className="buck-assess-card__sublabel buck-assess-card__sublabel--ok">
                Норма
              </div>
              <ul className="buck-assess-card__ok">
                {card.ok.map((o, i) => (
                  <li key={i}>{o}</li>
                ))}
              </ul>
              <div className="buck-assess-card__sublabel buck-assess-card__sublabel--fail">
                Брак
              </div>
              <ul className="buck-assess-card__fail">
                {card.fail.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ТЕПЛОВИЙ СТРЕС */}
      <section className="buck-section">
        <div className="buck-section__header">
          <span className="buck-section__icon">🌡️</span>
          <h2 className="buck-section__title">
            Тепловий стрес і тимчасова безплідність
          </h2>
        </div>
        <p
          style={{ fontSize: "0.9rem", lineHeight: 1.6, margin: "0 0 0.75rem" }}
        >
          Яєчка самця чутливіші до перегріву, ніж яєчники самки. Сперматогенез
          потребує температури на 1–2°C нижче температури тіла — саме тому яєчка
          знаходяться в мошонці зовні. При підвищенні температури навколишнього
          середовища до <strong>+28°C і вище більше 5 днів поспіль</strong>{" "}
          самець може стати тимчасово безплідним.
        </p>
        <div className="buck-table-wrap">
          <table className="buck-table">
            <thead>
              <tr>
                <th>Температура</th>
                <th>Ефект</th>
                <th>Тривалість безплідності після нормалізації</th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "+28–30°C, 5+ днів",
                  "Зниження рухливості сперматозоїдів",
                  "2–4 тижні",
                ],
                [
                  "+32–35°C, 3+ дні",
                  "Значне зниження якості та кількості сперми",
                  "4–8 тижнів",
                ],
                [
                  "+35°C+, будь-яка тривалість",
                  "Тимчасова або довготривала азооспермія",
                  "До 60–90 днів; у старих самців може не відновитись",
                ],
              ].map(([темп, ефект, трив]) => (
                <tr key={темп}>
                  <td className="buck-table__hl">{темп}</td>
                  <td>{ефект}</td>
                  <td>{трив}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="buck-danger">
          <span className="buck-danger__icon">🚨</span>
          <span>
            Після спекотного літа не роби висновки про безплідність самця одразу
            — дай йому 4–8 тижнів на відновлення в прохолодних умовах і перевір
            контрольним покриттям. Старі самці (3+ роки) відновлюються гірше —
            їх варто замінити після спеки.
          </span>
        </div>

        <div className="buck-tips" style={{ marginTop: "1rem" }}>
          {[
            {
              icon: "❄️",
              text: "Розмісти кліту плідника в найпрохолоднішому місці кролятника — у нижньому ряду або на протязі.",
            },
            {
              icon: "💧",
              text: "У спеку клади 0,5-літрову пластикову пляшку з льодом у клітку — кролики притуляються до неї.",
            },
            {
              icon: "🌙",
              text: "Проводь злучки ввечері або зранку — температура нижча, лібідо вище.",
            },
            {
              icon: "📆",
              text: "Влітку перевіряй заплідненість самок ретельніше: при підозрі на знижену фертильність самця — перезведи їх з резервним плідником.",
            },
          ].map((tip, i) => (
            <div key={i} className="buck-tip">
              <span className="buck-tip__icon">{tip.icon}</span>
              <span>{tip.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* УТРИМАННЯ */}
      <section className="buck-section">
        <div className="buck-section__header">
          <span className="buck-section__icon">🏠</span>
          <h2 className="buck-section__title">Умови утримання</h2>
        </div>
        <div className="buck-tips">
          {[
            {
              icon: "📦",
              text: "Плідник завжди утримується окремо — у власній клітці. Ніколи разом з іншими самцями (бійки, травми яєчок) або самками (неконтрольовані злучки).",
            },
            {
              icon: "📏",
              text: "Клітка самця мінімум 60×60×45 см. Для великих порід — 75×65×50 см. Він не виносить, але постійний рух і вільний простір підтримують лібідо і здоров'я.",
            },
            {
              icon: "🌡️",
              text: "Оптимальна температура +15…+22°C. Вище +25°C — починається зниження якості сперми. Нижче 0°C — кролики добре переносять, але вода не повинна замерзати.",
            },
            {
              icon: "💡",
              text: "Тривалість світлового дня 14–16 годин стимулює libido і сперматогенез. При природному короткому дні (зима) — додай штучне освітлення.",
            },
            {
              icon: "🥕",
              text: "Раціон: гранульований комбікорм без обмежень + сіно постійно. В сезон злучок можна додати 1–2 столових ложки пророщеного зерна або морквяного соку — джерело вітаміну E і каротину для якості сперми.",
            },
            {
              icon: "🔄",
              text: "Раз на 3 місяці проводь контрольне покриття: зведи самця з перевіреною самкою і відстеж заплідненість. Це єдиний надійний метод оцінки фертильності в польових умовах.",
            },
          ].map((tip, i) => (
            <div key={i} className="buck-tip">
              <span className="buck-tip__icon">{tip.icon}</span>
              <span>{tip.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ВИБРАКОВКА */}
      <section className="buck-section">
        <div className="buck-section__header">
          <span className="buck-section__icon">🗑️</span>
          <h2 className="buck-section__title">Коли вибраковувати плідника</h2>
        </div>
        <div className="buck-table-wrap">
          <table className="buck-table">
            <thead>
              <tr>
                <th>Критерій</th>
                <th>Поріг вибраковки</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Вік", "3–3,5 роки (великі породи) / 2,5–3 роки (середні)"],
                [
                  "Заплідненість самок",
                  "Менше 60% протягом 2 послідовних перевірок",
                ],
                [
                  "Середній розмір посліду",
                  "Стабільно менше 6 крільченят при перевіреному стаді самок",
                ],
                [
                  "Лібідо",
                  "Відмовляється від злучки тричі поспіль з різними самками",
                ],
                ["Крипторхізм (справжній)", "Одразу — спадкова вада"],
                ["Маклодоція", "Одразу — спадкова вада"],
                [
                  "Травма яєчок або мошонки",
                  "При незворотніх змінах після огляду",
                ],
                [
                  "Хронічні хвороби",
                  "Пododерматит 3 ступеня, хронічний риніт, E. cuniculi з симптомами",
                ],
              ].map(([крит, поріг]) => (
                <tr key={крит}>
                  <td className="buck-table__hl">{крит}</td>
                  <td>{поріг}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="buck-info">
          <span className="buck-info__icon">💡</span>
          <span>
            Ніколи не тримай плідника лише тому, що він єдиний. Один безплідний
            самець = місяць без окролів. Тримай хоча б одного резервного самця —
            молодшого, але перевіреного.
          </span>
        </div>
      </section>

      {/* ПОСИЛАННЯ */}
      <section className="buck-section">
        <div className="buck-section__header">
          <span className="buck-section__icon">🔗</span>
          <h2 className="buck-section__title">Пов'язані розділи</h2>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {[
            { to: "/doe-preparation", label: "Підготовка самки" },
            { to: "/mating-behavior", label: "Поведінка при злучці" },
            { to: "/mating-frequency", label: "Частота злучування" },
            { to: "/artificial-insemination", label: "Штучне осіменіння" },
            { to: "/culling", label: "Вибраковка" },
            { to: "/sexing", label: "Визначення статі" },
            { to: "/selection", label: "Селекція" },
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
      <Link to="/" className="buck-back">
        ← Головна
      </Link>
    </main>
  );
};

export default BuckManagement;
