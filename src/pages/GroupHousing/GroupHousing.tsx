import { Link } from "react-router-dom";
import ShareButton from "../../components/ShareButton/ShareButton";
import "./GroupHousing.css";

const GroupHousing = () => {
  return (
    <div className="GH-page">
      <div className="GH-header">
        <span className="GH-header-icon">🐇</span>
        <div>
          <h1 className="GH-title">Групове утримання та ієрархія</h1>
          <p className="GH-subtitle">
            Соціальна поведінка, домінування та конфлікти при утриманні кількох
            кролів разом
          </p>
        </div>
      </div>

      {/* ВСТУП */}
      <div className="GH-intro">
        <p>
          Кролик — соціальна тварина. У дикій природі вони живуть колоніями по
          2–9 самок, 2–3 самці та їх потомство. Але «соціальність» не означає
          «мирність». При груповому утриманні кролі обов'язково встановлюють
          ієрархію — і цей процес майже завжди супроводжується агресією.
        </p>
      </div>

      {/* ІЄРАРХІЯ */}
      <section className="GH-section">
        <h2 className="GH-section-title">
          <span className="GH-section-icon">👑</span>
          Як формується ієрархія
        </h2>
        <p className="GH-text">
          Ієрархія в групі кролів лінійна — є чіткий домінант, є підпорядковані.
          Формується вона через агресивну поведінку: переслідування, укуси,
          штовхання, сідлання. Зазвичай цей процес займає від 2 до 10 днів після
          з'єднання незнайомих тварин.
        </p>
        <div className="GH-fact-box">
          <div className="GH-fact-icon">📌</div>
          <div>
            <strong>Важливо:</strong> після встановлення ієрархії агресія різко
            спадає. Якщо кролі продовжують битися через 2 тижні — ієрархія не
            встановилась, або її постійно хтось оскаржує.
          </div>
        </div>

        <div className="GH-cards-grid">
          <div className="GH-card">
            <div className="GH-card-title">🥇 Домінант</div>
            <ul className="GH-list">
              <li>їсть першим</li>
              <li>займає кращі місця для відпочинку</li>
              <li>вимагає грумінг від інших</li>
              <li>може займати всю годівницю</li>
              <li>сідлає підлеглих (обидві статі)</li>
            </ul>
          </div>
          <div className="GH-card">
            <div className="GH-card-title">⬇️ Підлеглий</div>
            <ul className="GH-list">
              <li>їсть після домінанта</li>
              <li>поступається місцем</li>
              <li>завмирає або тікає при наближенні домінанта</li>
              <li>притискає вуха</li>
              <li>може ховатись у кутку</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ХТО ДОМІНУЄ */}
      <section className="GH-section">
        <h2 className="GH-section-title">
          <span className="GH-section-icon">♀️</span>
          Хто зазвичай домінує
        </h2>
        <p className="GH-text">
          Самки, як правило, домінантніші за самців. Якщо в кліткі самка та
          самець — самка майже завжди домінує. Серед самок домінує старша або та
          що довше живе на цій території.
        </p>
        <div className="GH-hierarchy-visual">
          <div className="GH-hier-item GH-hier-top">Стара самка (резидент)</div>
          <div className="GH-hier-arrow">▼</div>
          <div className="GH-hier-item GH-hier-mid">Молода самка</div>
          <div className="GH-hier-arrow">▼</div>
          <div className="GH-hier-item GH-hier-bot">Самець</div>
        </div>
        <div className="GH-note">
          Рангова позиція не постійна — молодший кроль може оскаржити ієрархію в
          міру дорослішання, особливо при статевому дозріванні (3–4 місяці).
        </div>
      </section>

      {/* ОЗНАКИ ДОМІНУВАННЯ */}
      <section className="GH-section">
        <h2 className="GH-section-title">
          <span className="GH-section-icon">🔍</span>7 ознак домінування
        </h2>
        <div className="GH-signs-list">
          {[
            {
              sign: "Сідлання",
              detail:
                "Домінант сідлає підлеглого незалежно від статі — не обов'язково сексуальний мотив, частіше демонстрація статусу",
            },
            {
              sign: "Переслідування",
              detail:
                "Домінант женить підлеглого по клітці, особливо до встановлення ієрархії",
            },
            {
              sign: "Барберинг",
              detail:
                "Виривання шерсті — домінант вириває пасма шерсті з підлеглого. Залишки шерсті на підлозі — перший сигнал тривоги",
            },
            {
              sign: "Вимагання грумінгу",
              detail:
                "Домінант підсовує голову під носа іншого кроля — «чеши мене»",
            },
            {
              sign: "Монополізація ресурсів",
              detail: "Захоплення годівниці, поїлки, кращого місця для лежання",
            },
            {
              sign: "Позначення запахом",
              detail:
                "Підборіддям (підщелепова залоза) домінант позначає предмети та інших кролів",
            },
            {
              sign: "Кругові переслідування",
              detail:
                "Два кролі кружляють один навколо одного — передує бійці або встановленню статусу",
            },
          ].map((item, i) => (
            <div key={i} className="GH-sign-item">
              <div className="GH-sign-num">{i + 1}</div>
              <div>
                <div className="GH-sign-name">{item.sign}</div>
                <div className="GH-sign-detail">{item.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* БАРБЕРИНГ */}
      <section className="GH-section">
        <h2 className="GH-section-title">
          <span className="GH-section-icon">✂️</span>
          Барберинг — виривання шерсті
        </h2>
        <p className="GH-text">
          Барберинг — це коли кроль вириває шерсть у сусіда (або у себе). Це не
          те саме що линька. На підлозі клітки з'являються пасма шерсті, на тілі
          кроля — лисини.
        </p>

        <div className="GH-table-wrap">
          <table className="GH-table">
            <thead>
              <tr>
                <th>Причина барберингу</th>
                <th>У кого виривають</th>
                <th>Що робити</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Домінування</td>
                <td>Підлеглий кроль</td>
                <td>Розсадити, якщо лисини збільшуються</td>
              </tr>
              <tr>
                <td>Нудьга</td>
                <td>Будь-який сусід або себе</td>
                <td>Збагатити середовище, більше сіна</td>
              </tr>
              <tr>
                <td>Стрес</td>
                <td>Себе (аутобарберинг)</td>
                <td>Знайти і усунути джерело стресу</td>
              </tr>
              <tr>
                <td>Псевдовагітність</td>
                <td>Себе (живіт, підгрудок)</td>
                <td>Нормально, минає само</td>
              </tr>
              <tr>
                <td>Дефіцит клітковини</td>
                <td>Себе або сусіда</td>
                <td>Збільшити кількість сіна</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="GH-warning-box">
          <span>⚠️</span>
          <span>
            Барберинг не можна ігнорувати. Лисини збільшуються, шкіра може
            запалитись. Якщо один кроль систематично вириває шерсть у іншого —
            розсаджуйте.
          </span>
        </div>
      </section>

      {/* ЗНАЙОМСТВО НОВОГО КРОЛЯ */}
      <section className="GH-section">
        <h2 className="GH-section-title">
          <span className="GH-section-icon">🆕</span>
          Як познайомити нового кроля з групою
        </h2>
        <p className="GH-text">
          Найпоширеніша помилка — просто кинути нового кроля в клітку до інших.
          Це гарантована бійка. Резидент сприймає новачка як загрозу своїй
          території.
        </p>

        <div className="GH-steps">
          {[
            {
              step: "Карантин 2–4 тижні",
              desc: "Новий кроль окремо — перевірка здоров'я та адаптація до нового місця",
            },
            {
              step: "Обмін запахами",
              desc: "Поміняй підстилку між клітками на 2–3 дні — нехай звикають до запаху одне одного",
            },
            {
              step: "Нейтральна територія",
              desc: "Перша зустріч у місці де жоден з кролів не живе — ванна кімната, вигул на вулиці",
            },
            {
              step: "Короткі сесії",
              desc: "Перші зустрічі по 10–15 хвилин під наглядом. Легкі переслідування — нормально, кров — розділяй",
            },
            {
              step: "Поступове збільшення часу",
              desc: "Якщо через 3–5 днів без серйозних сутичок — можна залишати разом на ніч",
            },
            {
              step: "Спільна клітка",
              desc: "Вводь в спільну клітку тільки після стабільної ієрархії. Переставляй меблі щоб «обнулити» територію",
            },
          ].map((item, i) => (
            <div key={i} className="GH-step">
              <div className="GH-step-num">{i + 1}</div>
              <div>
                <div className="GH-step-title">{item.step}</div>
                <div className="GH-step-desc">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* КОЛИ РОЗСАДЖУВАТИ */}
      <section className="GH-section">
        <h2 className="GH-section-title">
          <span className="GH-section-icon">🚨</span>
          Коли обов'язково розсаджувати
        </h2>
        <div className="GH-cards-grid">
          {[
            {
              icon: "🩸",
              title: "Рани та укуси",
              desc: "Будь-яка кровоточива рана — негайно розсаджувати",
            },
            {
              icon: "✂️",
              title: "Барберинг зростає",
              desc: "Лисини збільшуються попри всі заходи",
            },
            {
              icon: "😰",
              title: "Хронічний стрес",
              desc: "Підлеглий постійно ховається, не їсть, втрачає вагу",
            },
            {
              icon: "⚡",
              title: "Статеве дозрівання",
              desc: "Молодняк у 3–4 місяці починає оскаржувати ієрархію — часто супроводжується серйозними бійками",
            },
            {
              icon: "🍼",
              title: "Самка з потомством",
              desc: "Після окролу самку обов'язково відсаджувати — агресія домінантів до крільченят і ризик псевдовагітності в інших самок",
            },
            {
              icon: "🤒",
              title: "Хворий кроль",
              desc: "Хворого або ослабленого — ізолювати, група може напасти",
            },
          ].map((item, i) => (
            <div key={i} className="GH-card GH-card--warn">
              <div className="GH-card-icon">{item.icon}</div>
              <div className="GH-card-title">{item.title}</div>
              <div className="GH-card-desc">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* СКЛАД ГРУПИ */}
      <section className="GH-section">
        <h2 className="GH-section-title">
          <span className="GH-section-icon">👥</span>
          Оптимальний склад групи
        </h2>
        <div className="GH-table-wrap">
          <table className="GH-table">
            <thead>
              <tr>
                <th>Склад</th>
                <th>Конфліктність</th>
                <th>Примітка</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Тільки самки (кастровані)</td>
                <td className="GH-low">Низька</td>
                <td>Найстабільніший варіант</td>
              </tr>
              <tr>
                <td>Самка + самець (кастровані)</td>
                <td className="GH-low">Низька</td>
                <td>Класична пара</td>
              </tr>
              <tr>
                <td>Молодняк до 3 місяців</td>
                <td className="GH-low">Низька</td>
                <td>До статевого дозрівання — мирно</td>
              </tr>
              <tr>
                <td>Некастровані самки</td>
                <td className="GH-mid">Середня</td>
                <td>Ризик псевдовагітності від сідлання</td>
              </tr>
              <tr>
                <td>Некастровані самці</td>
                <td className="GH-high">Висока</td>
                <td>Важкі бійки після 3–4 місяців</td>
              </tr>
              <tr>
                <td>Змішана некастрована група</td>
                <td className="GH-high">Висока</td>
                <td>Неконтрольоване розмноження + агресія</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="GH-fact-box">
          <div className="GH-fact-icon">📌</div>
          <div>
            Більший розмір групи — менш стабільна ієрархія. При 8 кролях у
            клітці конфлікти будуть частіші ніж при 3–4. Забезпечте достатньо
            годівниць і поїлок щоб уникнути конкуренції за ресурси.
          </div>
        </div>
      </section>

      {/* ЗБАГАЧЕННЯ СЕРЕДОВИЩА */}
      <section className="GH-section">
        <h2 className="GH-section-title">
          <span className="GH-section-icon">🏠</span>
          Як зменшити конфлікти
        </h2>
        <div className="GH-tips-grid">
          {[
            {
              icon: "🍽️",
              tip: "Кілька годівниць",
              desc: "Мінімум одна годівниця на 2 кролів — домінант не зможе заблокувати всіх",
            },
            {
              icon: "💧",
              tip: "Кілька поїлок",
              desc: "Те саме — підлеглий завжди повинен мати доступ до води",
            },
            {
              icon: "🐚",
              tip: "Укриття",
              desc: "Труби, будиночки, ящики — підлеглий повинен мати куди сховатись від домінанта",
            },
            {
              icon: "🌾",
              tip: "Більше сіна",
              desc: "Зайнятий жуванням кроль менш агресивний. Сіно знижує нудьгу і стрес",
            },
            {
              icon: "📐",
              tip: "Простір",
              desc: "8 кролів потребують значно більше місця ніж 8×мінімальний розмір клітки",
            },
            {
              icon: "🌀",
              tip: "Збагачення",
              desc: "Картонні труби, дерев'яні іграшки, предмети для гризіння — переключають увагу від агресії",
            },
          ].map((item, i) => (
            <div key={i} className="GH-tip-card">
              <span className="GH-tip-icon">{item.icon}</span>
              <div className="GH-tip-title">{item.tip}</div>
              <div className="GH-tip-desc">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ПІДСУМОК */}
      <div className="GH-summary">
        <h3 className="GH-summary-title">Коротко</h3>
        <ul className="GH-summary-list">
          <li>
            Ієрархія — норма. Легкі переслідування та сідлання в перші дні — не
            привід панікувати
          </li>
          <li>
            Кров, збільшення лисин, хронічне ховання — привід розсаджувати
          </li>
          <li>Самки домінантніші за самців</li>
          <li>Нового кроля знайомити поступово через нейтральну територію</li>
          <li>Більше годівниць, поїлок та укриттів — менше конфліктів</li>
          <li>
            8 кролів у одній клітці — це складна соціальна система, яка потребує
            постійного нагляду
          </li>
        </ul>
      </div>

      <div className="GH-related">
        <h3 className="GH-related-title">Читайте також</h3>
        <div className="GH-related-grid">
          <Link to="/rabbit-body-language" className="GH-related-link">
            🧠 Мова тіла кроля
          </Link>
          <Link to="/seasonal-molting" className="GH-related-link">
            🪮 Линька: норма та патологія
          </Link>
          <Link to="/rabbit-stress" className="GH-related-link">
            ⚡ Стрес та переляк
          </Link>
          <Link to="/floor-care" className="GH-related-link">
            🏡 Підлогове утримання
          </Link>
          <Link to="/biosecurity" className="GH-related-link">
            🛡️ Біобезпека та карантин
          </Link>
        </div>
      </div>

      <div className="GH-back">
        <Link to="/" className="GH-back-btn">
          ⬅ На головну
        </Link>
        <ShareButton title="Назва цієї сторінки" />
      </div>
    </div>
  );
};

export default GroupHousing;
