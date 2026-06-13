import { Link } from "react-router-dom";
import femaleImg from "../../assets/female.webp";
import maleImg from "../../assets/male.webp";
import "./Sexing.css";

const Sexing = () => {
  return (
    <main className="sexing-page">
      <div className="sexing-hero">
        <h1 className="sexing-hero__title">Визначення статі кролів</h1>
        <p className="sexing-hero__sub">
          Від новонароджених до дорослих — покроково і без помилок
        </p>
      </div>

      <div className="sexing-note">
        <span className="sexing-note__icon">⚠️</span>
        <span>
          Помилка у визначенні статі — одна з найпоширеніших причин{" "}
          <strong>незапланованих окролів і родинного інбридингу</strong>.
          Перевіряй стать двічі: при відлученні (4–5 тижнів) і при розсадженні
          (8–10 тижнів).
        </span>
      </div>

      {/* ТЕРМІНИ ЗА ВІКОМ */}
      <section className="sexing-section">
        <div className="sexing-section__header">
          <span className="sexing-section__icon">📅</span>
          <h2 className="sexing-section__title">
            Коли і як точно можна визначити стать
          </h2>
        </div>
        <div className="sexing-timeline">
          <div className="sexing-tl-item">
            <div className="sexing-tl-dot" />
            <div className="sexing-tl-age">0–3 тижні</div>
            <p className="sexing-tl-text">
              Визначити можна, але складно навіть досвідченому. Статеві органи
              дуже малі. Дивляться на відстань між анальним і статевим отвором:
              у самців вона помітно більша. Не рекомендовано без потреби — стрес
              для крільчат і самки.
            </p>
          </div>
          <div className="sexing-tl-item">
            <div className="sexing-tl-dot" />
            <div className="sexing-tl-age">4–5 тижнів</div>
            <p className="sexing-tl-text">
              Оптимальний час для першої перевірки — збігається з оглядом перед
              відлученням. Форма статевого отвору вже помітна: у самця — кругла,
              у самки — щілиноподібна.
            </p>
          </div>
          <div className="sexing-tl-item">
            <div className="sexing-tl-dot" />
            <div className="sexing-tl-age">8–10 тижнів</div>
            <p className="sexing-tl-text">
              <strong>Найнадійніший момент для розсадження по статі.</strong>{" "}
              Форма органів добре виражена. Яєчка у самців ще не опустились
              повністю, але техніка з натисканням працює чітко.
            </p>
          </div>
          <div className="sexing-tl-item">
            <div className="sexing-tl-dot" />
            <div className="sexing-tl-age">10–12 тижнів</div>
            <p className="sexing-tl-text">
              Яєчка самця опускаються в мошонку — визначення стає очевидним.
              Самці можуть починати покривати самок вже з цього віку. Критичний
              термін розсадження для виробничих ферм.
            </p>
          </div>
          <div className="sexing-tl-item">
            <div className="sexing-tl-dot sexing-tl-dot--warn" />
            <div className="sexing-tl-age">Дорослі (3+ місяці)</div>
            <p className="sexing-tl-text">
              У самців яєчка видимі в мошонці (по обидва боки від статевого
              члена), але можуть втягуватись у черево при стресі або холоді — це
              норма, не крипторхізм. У дорослих самок часто є підгрудок (складка
              шкіри під підборіддям), а соски помітніші, хоча у молодих самок
              вони ледь помітні.
            </p>
          </div>
        </div>
      </section>

      <section className="sexing-section">
        <div className="sexing-section__header">
          <span className="sexing-section__icon">📷</span>
          <h2 className="sexing-section__title">Приклад статевих органів</h2>
        </div>

        <div className="sexing-images">
          <figure>
            <img src={femaleImg} alt="Вульва самки кролика" />
            <figcaption>Самець</figcaption>
          </figure>

          <figure>
            <img src={maleImg} alt="Статевий орган самця кролика" />
            <figcaption>Самка</figcaption>
          </figure>
        </div>
      </section>

      {/* ПОРІВНЯННЯ САМЕЦЬ / САМКА */}
      <section className="sexing-section">
        <div className="sexing-section__header">
          <span className="sexing-section__icon">🔍</span>
          <h2 className="sexing-section__title">Ознаки самця і самки</h2>
        </div>
        <div className="sexing-compare">
          <div className="sexing-compare-card sexing-compare-card--buck">
            <div className="sexing-compare-card__title">♂ Самець (кролик)</div>
            <ul className="sexing-compare-card__list">
              <li>
                Статевий отвір — <strong>кругла або трубчаста форма</strong>
              </li>
              <li>
                При легкому натисканні вище отвору — виступає{" "}
                <strong>циліндричний пеніс</strong>
              </li>
              <li>
                Після 10–12 тижнів — видима <strong>мошонка з яєчками</strong>{" "}
                по обидва боки від статевого члена
              </li>
              <li>
                Відстань між анальним і статевим отвором <strong>більша</strong>
                , ніж у самки
              </li>
              <li>Сосків немає (або вони рудиментарні, ледь помітні)</li>
              <li>Яєчка можуть втягуватись при стресі — це норма</li>
            </ul>
          </div>
          <div className="sexing-compare-card sexing-compare-card--doe">
            <div className="sexing-compare-card__title">
              ♀ Самка (крольчиха)
            </div>
            <ul className="sexing-compare-card__list">
              <li>
                Статевий отвір — <strong>вузька вертикальна щілина</strong>{" "}
                (листоподібна форма)
              </li>
              <li>
                При легкому натисканні вище отвору — виступає{" "}
                <strong>загострена вульва</strong> зі щілиною
              </li>
              <li>Яєчок немає; мошонки немає</li>
              <li>
                Відстань між анальним і статевим отвором <strong>менша</strong>,
                ніж у самця
              </li>
              <li>8–10 сосків на животі (помітні після першого окролу)</li>
              <li>
                У дорослих часто є <strong>підгрудок</strong> під підборіддям
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ТЕХНІКА */}
      <section className="sexing-section">
        <div className="sexing-section__header">
          <span className="sexing-section__icon">🤲</span>
          <h2 className="sexing-section__title">
            Техніка визначення — покроково
          </h2>
        </div>
        <div className="sexing-steps">
          {[
            "Відсади самку подалі або почекай, поки вона відійде від гнізда — щоб уникнути стресу посліду і самки.",
            "Візьми крільча в одну руку долонею під живіт. Голова на долоні, задня частина у тебе перед очима. Або поклади спиною на коліна — голову до себе, хвіст від себе.",
            "Підніми хвіст і знайди два отвори: анальний (ближчий до хвоста) і статевий (далі від хвоста).",
            "Великим пальцем злегка натисни одразу над (з боку живота) статевим отвором — не на нього, а над ним. Використовуй мінімальну силу.",
            "У самця виступить невеликий циліндричний горбок — пеніс з округлим отвором на кінці. У самки виступить вузька вертикальна щілина — вульва, загострена форма.",
            "Якщо нічого не виступає — не тисни сильніше. Зміни кут, переконайся що натискаєш правильно. Не тримай крільча надто довго — поверни в гніздо.",
          ].map((text, i) => (
            <div key={i} className="sexing-step">
              <div className="sexing-step__num">{i + 1}</div>
              <div className="sexing-step__text">{text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ТИПОВІ ПОМИЛКИ */}
      <section className="sexing-section">
        <div className="sexing-section__header">
          <span className="sexing-section__icon">⚠️</span>
          <h2 className="sexing-section__title">Типові помилки</h2>
        </div>
        <div className="sexing-mistakes">
          {[
            {
              icon: "❌",
              text: "Покладаєшся тільки на яєчка у самця до 10–12 тижнів — у цьому віці вони ще не опустились, і самці часто помилково визначаються як самки.",
            },
            {
              icon: "❌",
              text: "Вважаєш, що соски = самка. У дорослих самців сосків немає, але у молодих крільчат обох статей вони практично невидимі — цей критерій не надійний у ранньому віці.",
            },
            {
              icon: "❌",
              text: "Тиснеш занадто сильно — травмуєш крільча і не бачиш нічого через неправильне положення пальця.",
            },
            {
              icon: "❌",
              text: "Визначаєш стать лише раз, при народженні. Обов'язково перевіряй повторно при відлученні (4–5 тижнів) і при розсадженні (8–10 тижнів).",
            },
            {
              icon: "❌",
              text: "Плутаєш вульву самки з пенісом. Пам'ятай: вульва — загострена щілина, пеніс — циліндр з округлим отвором. Якщо сумніваєшся — круглий = самець, щілина = самка.",
            },
            {
              icon: "❌",
              text: "Думаєш, що втягнуті яєчка = крипторхізм. У кролів пахвинний канал не закривається, і яєчка вільно рухаються назад у черево при стресі, холоді або бійці — це анатомічна норма.",
            },
          ].map((m, i) => (
            <div key={i} className="sexing-mistake">
              <span className="sexing-mistake__icon">{m.icon}</span>
              <span>{m.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ЗВЕДЕНА ТАБЛИЦЯ */}
      <section className="sexing-section">
        <div className="sexing-section__header">
          <span className="sexing-section__icon">📋</span>
          <h2 className="sexing-section__title">
            Зведена таблиця: самець vs самка
          </h2>
        </div>
        <div className="sexing-table-wrap">
          <table className="sexing-table">
            <thead>
              <tr>
                <th>Ознака</th>
                <th>Самець ♂</th>
                <th>Самка ♀</th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "Форма статевого отвору",
                  "Кругла, трубчаста",
                  "Вузька вертикальна щілина",
                ],
                [
                  "При натисканні вище отвору",
                  "Виступає циліндричний пеніс",
                  "Виступає загострена вульва зі щілиною",
                ],
                [
                  "Яєчка / мошонка",
                  "З'являються після 10–12 тижнів",
                  "Відсутні",
                ],
                ["Відстань анус–статевий отвір", "Більша", "Менша"],
                ["Соски", "Відсутні у дорослих", "8–10 штук на животі"],
                [
                  "Підгрудок",
                  "Зазвичай відсутній",
                  "Часто у дорослих самок великих порід",
                ],
                ["Яєчка при стресі", "Можуть втягуватись — норма", "—"],
              ].map(([ознака, самець, самка]) => (
                <tr key={ознака}>
                  <td>{ознака}</td>
                  <td>{самець}</td>
                  <td>{самка}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sexing-danger">
          <span className="sexing-danger__icon">🚨</span>
          <span>
            Якщо на фермі стався незапланований окріл через помилку у визначенні
            статі — перевір ступінь спорідненості пари. Братньо-сестринське
            спаровування (перший ступінь інбридингу) суттєво підвищує ризик
            генетичних дефектів у посліді.
          </span>
        </div>
      </section>

      {/* КРИПТОРХІЗМ */}
      <section className="sexing-section">
        <div className="sexing-section__header">
          <span className="sexing-section__icon">🩺</span>
          <h2 className="sexing-section__title">
            Крипторхізм: справжній і помилковий
          </h2>
        </div>
        <p
          style={{ fontSize: "0.9rem", lineHeight: 1.6, margin: "0 0 0.75rem" }}
        >
          У кролів пахвинний канал залишається відкритим усе життя — яєчка
          можуть вільно переміщуватись між мошонкою і черевною порожниною. Це{" "}
          <strong>не крипторхізм</strong>, а анатомічна норма виду. Яєчка
          втягуються при: переляку, холоді, бійці, огляді.
        </p>
        <p style={{ fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
          <strong>Справжній крипторхізм</strong> — коли одне або обидва яєчка
          ніколи не з'являються в мошонці навіть у розслабленого дорослого самця
          у теплому приміщенні. Такий самець підлягає вибраковці з розведення:
          ця вада спадкова.
        </p>
      </section>

      {/* ПОСИЛАННЯ */}
      <section className="sexing-section">
        <div className="sexing-section__header">
          <span className="sexing-section__icon">🔗</span>
          <h2 className="sexing-section__title">Пов'язані розділи</h2>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {[
            { to: "/weaning", label: "Відлучення та дорощування" },
            { to: "/culling", label: "Вибраковка" },
            { to: "/neutering", label: "Кастрація та стерилізація" },
            { to: "/okril", label: "Окріл" },
            { to: "/mating-behavior", label: "Поведінка при злучці" },
            { to: "/breeding", label: "Схрещування" },
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
      <div className="sexing-section-back">
        <Link to="/" className="sexing-section-back-btn">
          ⬅ На головну
        </Link>
      </div>
    </main>
  );
};

export default Sexing;
