import { useState } from "react";
import { Link } from "react-router-dom";
import "./Composting.css";
import ShareButton from "../../components/ShareButton/ShareButton";

interface Method {
  id: string;
  icon: string;
  title: string;
  badge: string;
  badgeType: "fast" | "slow" | "best";
  time: string;
  pros: string[];
  cons: string[];
  steps: string[];
  tip?: string;
}

const methods: Method[] = [
  {
    id: "direct",
    icon: "🥕",
    title: "Пряме внесення — «без компостування»",
    badge: "Найпростіше",
    badgeType: "fast",
    time: "Одразу",
    pros: [
      "Нульові трудозатрати — зібрав і розсипав",
      "Кролячий гній «холодний» — не спалює коріння навіть свіжий",
      "Пелети розкладаються повільно — ефект сповільненого вивільнення NPK",
      "Можна застосовувати будь-якої пори року",
    ],
    cons: [
      "Менш ефективний, ніж зрілий компост — поживні речовини вивільняються повільніше",
      "Сухі пелети без підстилки не покращують структуру важких ґрунтів так само",
      "Якщо є підстилка з тирсою — краще прокомпостувати, тирса потребує часу",
    ],
    steps: [
      "Зібрати сухий посліду з-під кліток",
      "Рівномірно розсипати по ділянці з розрахунку 0,5–1 кг/м²",
      "Загорнути в ґрунт або залишити як мульчу",
      "Уникай внесення під коренеплоди перед збиранням — за 60 днів все окей",
    ],
    tip: "Якщо в гної багато сечі — злегка підсуши перед внесенням або зміша із сухою підстилкою.",
  },
  {
    id: "hot",
    icon: "🔥",
    title: "Гарячий компост (активний)",
    badge: "Швидко: 1–3 місяці",
    badgeType: "fast",
    time: "4–12 тижнів",
    pros: [
      "Знищує насіння бур'янів і патогени (температура 55–70°C)",
      "Найшвидший результат при регулярному перемішуванні",
      "Відмінний активатор для «холодних» компостних куп",
    ],
    cons: [
      "Вимагає щотижневого перемішування і контролю вологості",
      "Потрібна маса від ~1 м³ для стабільного нагрівання",
      "Губиться частина азоту при перегріванні",
    ],
    steps: [
      "Склади купу: шар гною (15–20 см) + шар вуглецевого матеріалу (солома, сухе листя, тирса) у співвідношенні приблизно 1:1 за об'ємом",
      "Зволож до стану «віджатої губки» — не мокро, не сухо",
      "Накрий плівкою або кришкою для утримання тепла",
      "Через 3–5 днів перевір температуру — має бути 50–65°C у центрі",
      "Перемішуй повністю раз на 1–2 тижні, поверни зовнішні шари всередину",
      "Повтори 4–6 разів. Компост готовий коли: темний, розсипчастий, пахне землею",
    ],
    tip: "Кролячий гній + сеча — найкращий активатор для застиглої компостної купи. Добавляй відра під час прибирання кліток.",
  },
  {
    id: "cold",
    icon: "🕰️",
    title: "Холодний компост (пасивний)",
    badge: "Повільно: 6–12 місяців",
    badgeType: "slow",
    time: "6–12 місяців",
    pros: [
      "Нульові трудозатрати — насипав і чекаєш",
      "Можна постійно додавати нові матеріали",
      "Підходить коли немає часу перемішувати",
    ],
    cons: [
      "Насіння бур'янів може не загинути — температура недостатня",
      "Непостійна якість — зовнішні шари розкладаються гірше",
      "Довго",
    ],
    steps: [
      "Склади купу шарами: гній + підстилка + вуглецевий матеріал",
      "Помірно зволож",
      "Накрий плівкою або шаром соломи",
      "Добавляй нові матеріали зверху впродовж сезону",
      "Через 6–12 місяців знімай готовий компост знизу",
    ],
  },
  {
    id: "vermi",
    icon: "🪱",
    title: "Вермікомпостування (черв'яки)",
    badge: "Найкраща якість",
    badgeType: "best",
    time: "3–6 місяців",
    pros: [
      "Вермікомпост — найбагатший органічний добриво за впливом на ґрунтові мікроорганізми",
      "Черв'яки (Eisenia fetida — каліфорнійський червоний) ідеально сумісні з кролячим гноєм",
      "Можна розміщувати ящики прямо під клітками — черв'яки переробляють опади безперервно",
      "Компактно, майже без запаху",
    ],
    cons: [
      "Черв'яки гинуть від перегріву (вище 28°C) і морозу",
      "Свіжий гній з великою кількістю сечі потрібно трохи підсушити або підв'ялити 3–7 днів перед закладкою — аміак шкодить черв'якам",
      "Потребує постійного нагляду за вологістю і температурою",
    ],
    steps: [
      "Підготуй ящик: глибина 20–30 см, отвори для дренажу",
      "Заклади підстилку: вологий картон або газета шарами",
      "Додай підв'ялений 3–7 днів кролячий гній без підстилки з тирсою (тирса уповільнює)",
      "Запусти черв'яків із розрахунку 0,5 кг на 1 кг корму/тиждень",
      "Підтримуй температуру 15–25°C, вологість 70–80% (рукою відчувається як волога губка)",
      "Через 3–6 місяців збери вермікомпост, переміщуючи їжу в одну сторону — черв'яки підуть за кормом",
    ],
    tip: "Під клітками: встанови піддони з перфорацією, під ними ящики з черв'яками. Гній сам падає до черв'яків — мінімум роботи.",
  },
  {
    id: "tea",
    icon: "🫖",
    title: "Гнойовий чай (рідке добриво)",
    badge: "Швидкодіюче",
    badgeType: "fast",
    time: "3–7 днів",
    pros: [
      "Найшвидший спосіб доставити поживні речовини до коренів",
      "Ефективно для полива розсади, тепличних рослин",
      "Не ризик опіку — рідкий кролячий чай м'який навіть для ніжної розсади",
    ],
    cons: [
      "Одноразовий ефект — не покращує структуру ґрунту тривало",
      "Потрібне розведення перед поливом",
    ],
    steps: [
      "Насип сухих пелет у тканинний мішечок або наволочку — приблизно 1 частина гною на 5 частин води",
      "Опусти в відро з водою, закрий кришкою",
      "Постав на сонці і помішуй раз на день",
      "Через 3–7 днів «чай» готовий — темно-коричневого кольору",
      "Перед поливом розведи 1:10 з чистою водою для поливу під корінь або 1:20 для листового обприскування",
      "Залишки пелет після чаю — в компост",
    ],
    tip: "Можна аерувати чай акваріумним насосом 24–48 годин — збільшує кількість корисних мікроорганізмів.",
  },
];

const Composting = () => {
  const [openMethods, setOpenMethods] = useState<Record<string, boolean>>({
    direct: true,
  });

  const toggle = (id: string) =>
    setOpenMethods((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <main className="comp-page">
      <div className="comp-hero">
        <h1 className="comp-hero__title">Переробка кролячого гною</h1>
        <p className="comp-hero__sub">
          Компостування, вермікомпост, гнойовий чай — методи, терміни, норми
          внесення
        </p>
      </div>

      <div className="comp-note">
        <span className="comp-note__icon">💡</span>
        <span>
          Кролячий гній — єдиний у тваринництві <strong>«холодний» гній</strong>
          : на відміну від курячого, кінського чи свинячого, його можна вносити
          прямо в ґрунт без попереднього компостування без ризику спалити
          рослини.
        </span>
      </div>

      {/* NPK */}
      <section className="comp-section">
        <div className="comp-section__header">
          <span className="comp-section__icon">🧪</span>
          <h2 className="comp-section__title">Поживна цінність (NPK)</h2>
        </div>
        <div className="comp-npk">
          <div className="comp-npk-card comp-npk-card--n">
            <div className="comp-npk-card__letter">N</div>
            <div className="comp-npk-card__val">2,4%</div>
            <div className="comp-npk-card__name">Азот</div>
            <div className="comp-npk-card__desc">Листя, ріст, зелена маса</div>
          </div>
          <div className="comp-npk-card comp-npk-card--p">
            <div className="comp-npk-card__letter">P</div>
            <div className="comp-npk-card__val">1,4%</div>
            <div className="comp-npk-card__name">Фосфор</div>
            <div className="comp-npk-card__desc">Коріння, квітіння, плоди</div>
          </div>
          <div className="comp-npk-card comp-npk-card--k">
            <div className="comp-npk-card__letter">K</div>
            <div className="comp-npk-card__val">0,6%</div>
            <div className="comp-npk-card__name">Калій</div>
            <div className="comp-npk-card__desc">Якість плодів, стійкість</div>
          </div>
        </div>

        <div className="comp-table-wrap">
          <table className="comp-table">
            <thead>
              <tr>
                <th>Вид гною</th>
                <th>N %</th>
                <th>P %</th>
                <th>K %</th>
                <th>«Холодний»?</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Кролячий", "2,4", "1,4", "0,6", "✅ Так"],
                ["Курячий", "1,1", "0,8", "0,5", "❌ Ні"],
                ["Кінський", "0,7", "0,3", "0,6", "❌ Ні"],
                ["Коров'ячий", "0,6", "0,2", "0,5", "❌ Ні"],
                ["Свинячий", "0,8", "0,7", "0,5", "❌ Ні"],
              ].map(([вид, n, p, k, cold], i) => (
                <tr key={вид}>
                  <td className={i === 0 ? "comp-table__highlight" : ""}>
                    {вид}
                  </td>
                  <td className={i === 0 ? "comp-table__highlight" : ""}>
                    {n}
                  </td>
                  <td>{p}</td>
                  <td>{k}</td>
                  <td>{cold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* СКІЛЬКИ ВИРОБЛЯЄ */}
      <section className="comp-section">
        <div className="comp-section__header">
          <span className="comp-section__icon">📊</span>
          <h2 className="comp-section__title">Скільки гною виробляє ферма</h2>
        </div>
        <div className="comp-table-wrap">
          <table className="comp-table">
            <thead>
              <tr>
                <th>Поголів'я</th>
                <th>Гній/день (кг)</th>
                <th>Гній/місяць (кг)</th>
                <th>Гній/рік (кг)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["1 дорослий кролик", "~0,15", "~4,5", "~55"],
                ["10 кролів", "~1,5", "~45", "~550"],
                ["5 самок + приплід", "~3–5", "~90–150", "~1000–1800"],
                ["20 самок (ферма)", "~10–15", "~300–450", "~4000–5500"],
              ].map(([поголівя, день, місяць, рік]) => (
                <tr key={поголівя}>
                  <td>{поголівя}</td>
                  <td>{день}</td>
                  <td>{місяць}</td>
                  <td>{рік}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="comp-info" style={{ marginTop: "0.75rem" }}>
          <span className="comp-info__icon">💡</span>
          <span>
            Один дорослий кролик виробляє близько 100 пелет на день. З
            урахуванням підстилки (сіно, тирса) реальний обсяг відходів —
            200–400 г/добу.
          </span>
        </div>
      </section>

      {/* МЕТОДИ */}
      <section className="comp-section">
        <div className="comp-section__header">
          <span className="comp-section__icon">♻️</span>
          <h2 className="comp-section__title">Методи переробки</h2>
        </div>
        <div className="comp-methods">
          {methods.map((m) => {
            const isOpen = !!openMethods[m.id];
            return (
              <div key={m.id} className="comp-method">
                <button
                  className="comp-method__head"
                  onClick={() => toggle(m.id)}
                  aria-expanded={isOpen}
                >
                  <span className="comp-method__icon">{m.icon}</span>
                  <div>
                    <span className="comp-method__title">{m.title}</span>
                    <span
                      className={`comp-method__badge comp-method__badge--${m.badgeType}`}
                    >
                      {m.badge}
                    </span>
                  </div>
                  <span
                    className={`comp-method__chevron${isOpen ? " comp-method__chevron--open" : ""}`}
                  >
                    ▼
                  </span>
                </button>

                {isOpen && (
                  <div className="comp-method__body">
                    <div className="comp-block">
                      <div className="comp-block__label">Термін</div>
                      <p style={{ margin: 0, fontSize: "0.9rem" }}>{m.time}</p>
                    </div>

                    <div className="comp-block">
                      <div className="comp-block__label">Переваги</div>
                      <ul className="comp-list">
                        {m.pros.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="comp-block">
                      <div className="comp-block__label">Недоліки</div>
                      <ul className="comp-list">
                        {m.cons.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="comp-block">
                      <div className="comp-block__label">Як робити</div>
                      <div className="comp-steps">
                        {m.steps.map((s, i) => (
                          <div key={i} className="comp-step">
                            <div className="comp-step__num">{i + 1}</div>
                            <div className="comp-step__text">{s}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {m.tip && (
                      <div className="comp-info">
                        <span className="comp-info__icon">💡</span>
                        <span>{m.tip}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* НОРМИ ВНЕСЕННЯ */}
      <section className="comp-section">
        <div className="comp-section__header">
          <span className="comp-section__icon">🌱</span>
          <h2 className="comp-section__title">Норми внесення</h2>
        </div>
        <div className="comp-table-wrap">
          <table className="comp-table">
            <thead>
              <tr>
                <th>Культура / використання</th>
                <th>Норма (на м²)</th>
                <th>Час внесення</th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "Городні грядки (загальне)",
                  "0,5–1 кг свіжого або 0,3 кг компосту",
                  "Восени або за 2–4 тижні до посіву",
                ],
                [
                  "Томати, перець, баклажан",
                  "1–1,5 кг компосту",
                  "При посадці в ямку",
                ],
                ["Картопля", "0,3–0,5 кг компосту", "При посадці"],
                [
                  "Коренеплоди (морква, буряк)",
                  "Тільки зрілий компост",
                  "Не свіжий — розгалужується корінь",
                ],
                ["Газон", "0,2–0,3 кг", "Рання весна або пізня осінь"],
                ["Розсада (полив чаєм)", "Розведення 1:10", "Раз на 2 тижні"],
                [
                  "Мульча під деревами",
                  "2–3 кг/м², шар 5–10 см",
                  "Весна або осінь",
                ],
              ].map(([cult, norm, time]) => (
                <tr key={cult}>
                  <td>{cult}</td>
                  <td>{norm}</td>
                  <td>{time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="comp-warn">
          <span className="comp-warn__icon">⚠️</span>
          <span>
            Свіжий гній (навіть кролячий) не вноси під коренеплоди і листові
            овочі менш ніж за 60 днів до збирання — можливе забруднення
            патогенами. При внесенні за 2+ місяці або після компостування ризик
            відсутній.
          </span>
        </div>
      </section>

      {/* ПОСИЛАННЯ */}
      <section className="comp-section">
        <div className="comp-section__header">
          <span className="comp-section__icon">🔗</span>
          <h2 className="comp-section__title">Пов'язані розділи</h2>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {[
            { to: "/economics", label: "Економіка господарства" },
            { to: "/enclosure", label: "Клітки та утримання" },
            { to: "/slaughter", label: "Забій та переробка" },
            { to: "/tools", label: "Інструменти" },
            { to: "/sales", label: "Збут" },
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
      <div className="comp-section-back">
        <Link to="/" className="comp-section-back-btn">
          ⬅ На головну
        </Link>
        <ShareButton title="Назва цієї сторінки" />
      </div>
    </main>
  );
};

export default Composting;
