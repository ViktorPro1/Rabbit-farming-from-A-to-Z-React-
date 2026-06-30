import { Link } from "react-router-dom";
import "./DoePreparation.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const DoePreparation = () => {
  return (
    <main className="doe-page">
      <div className="doe-hero">
        <h1 className="doe-hero__title">Підготовка самки до злучки</h1>
        <p className="doe-hero__sub">
          Кондиція тіла, відпочинок між окролами, оцінка готовності — практичний
          алгоритм
        </p>
      </div>

      <div className="doe-note">
        <span className="doe-note__icon">⚠️</span>
        <span>
          Самка з незадовільною кондицією, що не відновилась після попереднього
          окролу — головна причина малоплідних послідів, відмови від крільченят
          і ранньої вибраковки.{" "}
          <strong>
            Перевіряй кондицію перед кожною злучкою, не тільки раз на рік.
          </strong>
        </span>
      </div>

      {/* BCS */}
      <section className="doe-section">
        <div className="doe-section__header">
          <span className="doe-section__icon">⚖️</span>
          <h2 className="doe-section__title">Оцінка кондиції тіла (BCS 1–5)</h2>
        </div>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.6, margin: "0 0 1rem" }}>
          Промацай хребет і ребра долонею. BCS визначають на дотик, не на вигляд
          — шерсть приховує реальний стан. Оптимальна кондиція для злучки —{" "}
          <strong>BCS 3–3,5</strong>.
        </p>
        <div className="doe-bcs-grid">
          {[
            {
              score: 1,
              label: "Виснаження",
              desc: "Хребець і ребра гострі, добре видні. М'язи відсутні. Злучку заборонено.",
              breed: "Заборона злучки",
            },
            {
              score: 2,
              label: "Худа",
              desc: "Хребець легко промацується без тиску. Ребра відчутні. Потрібна відгодівля.",
              breed: "Відкласти злучку",
            },
            {
              score: 3,
              label: "Норма ✓",
              desc: "Хребець промацується з помірним тиском. Ребра відчутні, але покриті м'язами.",
              breed: "Ідеальна кондиція",
            },
            {
              score: 4,
              label: "Вгодована",
              desc: "Хребець під жировим прошарком. Ребра важко промацати. Знизити корм.",
              breed: "Обережно — зниж корм",
            },
            {
              score: 5,
              label: "Ожиріння",
              desc: "Хребець не промацується. Значні жирові відклади. Злучку відкласти.",
              breed: "Заборона злучки",
            },
          ].map((b) => (
            <div key={b.score} className={`doe-bcs doe-bcs--${b.score}`}>
              <div className="doe-bcs__score">{b.score}</div>
              <div className="doe-bcs__label">{b.label}</div>
              <div className="doe-bcs__desc">{b.desc}</div>
              <div className="doe-bcs__breed">{b.breed}</div>
            </div>
          ))}
        </div>
        <div className="doe-info">
          <span className="doe-info__icon">💡</span>
          <span>
            Самка BCS 2 після годування великого посліду — норма, не патологія.
            Дай їй 7–14 днів на відновлення з посиленим раціоном перед наступною
            злучкою. Намагатися покрити виснажену самку — марна трата часу
            плідника і стрес для обох.
          </span>
        </div>
      </section>

      {/* ІНТЕРВАЛ ВІДПОЧИНКУ */}
      <section className="doe-section">
        <div className="doe-section__header">
          <span className="doe-section__icon">🔁</span>
          <h2 className="doe-section__title">
            Інтервал відпочинку між окролами
          </h2>
        </div>
        <div className="doe-table-wrap">
          <table className="doe-table">
            <thead>
              <tr>
                <th>Схема</th>
                <th>Злучка після окролу</th>
                <th>Окролів/рік</th>
                <th>Навантаження на самку</th>
                <th>Кому підходить</th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "Інтенсивна",
                  "На 7–14 день лактації",
                  "8–9",
                  "Дуже високе — вибраковка 40–60%/рік",
                  "Промислові ферми з жорстким відбором",
                ],
                [
                  "Напівінтенсивна",
                  "На 14–21 день лактації",
                  "6–7",
                  "Високе — вибраковка 25–35%/рік",
                  "Комерційні господарства",
                ],
                [
                  "Рекомендована",
                  "Після відлучення (35–42 день)",
                  "5–6",
                  "Помірне",
                  "Більшість господарств",
                ],
                [
                  "Екстенсивна",
                  "Через 14+ днів після відлучення",
                  "4",
                  "Низьке — самки живуть довше",
                  "Невеликі ферми, якісний молодняк",
                ],
              ].map(([схема, день, рік, навант, кому], i) => (
                <tr key={схема}>
                  <td className={i === 2 ? "doe-table__hl" : ""}>
                    {схема}
                    {i === 2 ? " ✓" : ""}
                  </td>
                  <td>{день}</td>
                  <td>{рік}</td>
                  <td>{навант}</td>
                  <td>{кому}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="doe-warn">
          <span className="doe-warn__icon">⚠️</span>
          <span>
            Інтенсивна схема (злучка на 7–14 день) —{" "}
            <strong>не для початківців</strong>. Самки швидко виснажуються,
            якість молодняку знижується, смертність зростає. Без чіткого обліку
            BCS і щотижневого моніторингу — краще напівінтенсивна або
            рекомендована схема.
          </span>
        </div>
      </section>

      {/* ПІДГОТОВЧИЙ ПРОТОКОЛ */}
      <section className="doe-section">
        <div className="doe-section__header">
          <span className="doe-section__icon">📋</span>
          <h2 className="doe-section__title">Протокол підготовки до злучки</h2>
        </div>
        <div className="doe-tl">
          <div className="doe-tl-item">
            <div className="doe-tl-dot" />
            <div className="doe-tl-label">За 2–3 тижні до злучки</div>
            <p className="doe-tl-text">
              Оціни BCS. Якщо самка BCS 2 — збільш добову норму корму на 15–20%
              або введи невелику кількість зернової суміші. Якщо BCS 4–5 — обмеж
              корм, більше сіна.
            </p>
          </div>
          <div className="doe-tl-item">
            <div className="doe-tl-dot" />
            <div className="doe-tl-label">За 10–14 днів</div>
            <p className="doe-tl-text">
              Перевір здоров'я: очі, ніс, зуби, лапи, шерсть. Будь-який активний
              симптом хвороби — злучку відкласти. Перевір дату останньої
              вакцинації проти ВГХК і міксоматозу.
            </p>
          </div>
          <div className="doe-tl-item">
            <div className="doe-tl-dot" />
            <div className="doe-tl-label">За 5–7 днів (флашинг)</div>
            <p className="doe-tl-text">
              Для самок BCS 2,5–3 можна застосувати «флашинг» — короткочасне
              збільшення енергетичності раціону (додати 20–30 г зернової суміші
              на день). Стимулює овуляцію і збільшує розмір посліду. Не
              застосовуй до самок BCS 3,5+.
            </p>
          </div>
          <div className="doe-tl-item">
            <div className="doe-tl-dot doe-tl-dot--ok" />
            <div className="doe-tl-label">День злучки</div>
            <p className="doe-tl-text">
              Зранку (не ввечері) — фізіологічна активність вища. Оціни колір
              вульви: темно-рожева або червона, волога — самка рецептивна.
              Бліда, суха, білясто-рожева — відкласти на 2–3 дні. Завжди носи
              самку до плідника, не навпаки.
            </p>
          </div>
          <div className="doe-tl-item">
            <div className="doe-tl-dot doe-tl-dot--warn" />
            <div className="doe-tl-label">Після злучки</div>
            <p className="doe-tl-text">
              Запиши дату. Контрольна злучка через 5–7 днів: рецептивна =
              незапліднена або псевдовагітність, відмовляє = вагітна. Пальпацію
              проводь на 12–14 день.
            </p>
          </div>
        </div>
      </section>

      {/* ОЦІНКА ГОТОВНОСТІ ВУЛЬВИ */}
      <section className="doe-section">
        <div className="doe-section__header">
          <span className="doe-section__icon">🔍</span>
          <h2 className="doe-section__title">
            Оцінка рецептивності за кольором вульви
          </h2>
        </div>
        <div className="doe-table-wrap">
          <table className="doe-table">
            <thead>
              <tr>
                <th>Колір вульви</th>
                <th>Стан</th>
                <th>Рецептивність</th>
                <th>Дія</th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "Бліда рожева, суха",
                  "Анеструс або рання фаза",
                  "Низька — 20–30%",
                  "Відкласти на 2–3 дні",
                ],
                [
                  "Рожева, помірно волога",
                  "Проеструс",
                  "Середня — 50–60%",
                  "Можна спробувати",
                ],
                [
                  "Яскраво-рожева або червона, волога",
                  "Еструс ✓",
                  "Висока — 85–95%",
                  "Оптимальний час злучки",
                ],
                [
                  "Синюшно-червона, темна",
                  "Пізній або порушений цикл",
                  "Низька",
                  "Відкласти, перевір здоров'я",
                ],
              ].map(([колір, стан, рецепт, дія], i) => (
                <tr key={колір}>
                  <td className={i === 2 ? "doe-table__hl" : ""}>{колір}</td>
                  <td>{стан}</td>
                  <td>{рецепт}</td>
                  <td>{дія}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="doe-info">
          <span className="doe-info__icon">💡</span>
          <span>
            Кролиці — індуковані овулятори: овуляція відбувається через 10–12
            годин після парування або стимуляції. Тому колір вульви — орієнтир
            готовності, але не єдиний показник. Самка може покриватись і при
            «неідеальній» вульві, якщо вона рецептивна за поведінкою.
          </span>
        </div>
      </section>

      {/* ЧЕК-ЛІСТ ПЕРЕД ЗЛУЧКОЮ */}
      <section className="doe-section">
        <div className="doe-section__header">
          <span className="doe-section__icon">✅</span>
          <h2 className="doe-section__title">Чек-ліст перед злучкою</h2>
        </div>
        <div className="doe-checklist">
          {[
            {
              icon: "⚖️",
              text: "BCS 3–3,5 — перевірено пальпацією хребта і ребер",
              ok: true,
            },
            { icon: "👁️", text: "Очі чисті, без виділень і набряку", ok: true },
            {
              icon: "👃",
              text: "Ніс сухий або з мінімальними прозорими виділеннями (не гнійними)",
              ok: true,
            },
            { icon: "🦷", text: "Прикус правильний, слини немає", ok: true },
            {
              icon: "🦶",
              text: "Лапи без пододерматиту, кігті в нормі",
              ok: true,
            },
            {
              icon: "💉",
              text: "Вакцинація проти ВГХК і міксоматозу актуальна (до 6 місяців)",
              ok: true,
            },
            {
              icon: "🪱",
              text: "Дегельмінтизація проведена (не пізніше ніж 2 тижні тому)",
              ok: true,
            },
            {
              icon: "📅",
              text: "Мінімум 10–14 днів після відлучення попереднього посліду",
              ok: true,
            },
            {
              icon: "🌡️",
              text: "Температура в приміщенні нижче +28°C (жара = низька заплідненість)",
              ok: true,
            },
            {
              icon: "🔴",
              text: "Вульва рожева або червона, не бліда",
              ok: true,
            },
          ].map((item, i) => (
            <div key={i} className="doe-check">
              <span className="doe-check__icon">{item.icon}</span>
              <span>
                {item.text}
                <span className="doe-check__ok">✓</span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ПРОБЛЕМИ */}
      <section className="doe-section">
        <div className="doe-section__header">
          <span className="doe-section__icon">🚨</span>
          <h2 className="doe-section__title">
            Самка не покривається — причини та дії
          </h2>
        </div>
        <div className="doe-table-wrap">
          <table className="doe-table">
            <thead>
              <tr>
                <th>Причина</th>
                <th>Ознаки</th>
                <th>Що робити</th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "Анеструс (немає циклу)",
                  "Бліда вульва, тікає від самця",
                  "Збільш тривалість світлового дня до 14–16 год; перемісти клітку біля самця",
                ],
                [
                  "Псевдовагітність",
                  "17 днів тому покривалась або контактувала з самцем / іншою самкою",
                  "Чекай 17 днів від передбачуваного початку; не зводь",
                ],
                [
                  "Занадто висока вгодованість (BCS 4–5)",
                  "Пасивна, неохоча",
                  "Зниж калорійність раціону, більше руху, зачекай 2–3 тижні",
                ],
                [
                  "Стрес або нова обстановка",
                  "Нещодавно переміщена, нова клітка",
                  "Дай 7–10 днів адаптації перед злучкою",
                ],
                [
                  "Тепловий стрес (>28°C)",
                  "Неактивна, лежить розпластана",
                  "Охолоди приміщення; злучку при спеці не проводь",
                ],
                [
                  "Спін самця не сподобався",
                  "Кусає або тікає від конкретного самця",
                  "Спробуй іншого плідника",
                ],
              ].map(([прич, озн, дія]) => (
                <tr key={прич}>
                  <td className="doe-table__hl">{прич}</td>
                  <td>{озн}</td>
                  <td>{дія}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ПОСИЛАННЯ */}
      <section className="doe-section">
        <div className="doe-section__header">
          <span className="doe-section__icon">🔗</span>
          <h2 className="doe-section__title">Пов'язані розділи</h2>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {[
            { to: "/buck-management", label: "Утримання плідника" },
            { to: "/mating-behavior", label: "Поведінка при злучці" },
            { to: "/mating-frequency", label: "Частота злучування" },
            { to: "/okril", label: "Окріл" },
            { to: "/okril-control", label: "Контроль дат" },
            { to: "/culling", label: "Вибраковка" },
            { to: "/weight-control", label: "Контроль ваги" },
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
      <Link to="/" className="doe-back">
        ← Головна
      </Link>
      <ShareButton title="Назва цієї сторінки" />
    </main>
  );
};

export default DoePreparation;
