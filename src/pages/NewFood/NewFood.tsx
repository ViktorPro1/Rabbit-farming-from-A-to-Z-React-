import { useState } from "react";
import { Link } from "react-router-dom";
import "./NewFood.css";
import ShareButton from "../../components/ShareButton/ShareButton";

interface TransitionDay {
  day: number;
  old: number;
  new: number;
}

function buildSchedule(days: number): TransitionDay[] {
  const schedule: TransitionDay[] = [];
  for (let i = 1; i <= days; i++) {
    const newPct = Math.round((i / days) * 100);
    const oldPct = 100 - newPct;
    schedule.push({ day: i, old: oldPct, new: newPct });
  }
  return schedule;
}

const NewFood = () => {
  const [transitionDays, setTransitionDays] = useState<number>(10);
  const [dailyGrams, setDailyGrams] = useState<number>(100);

  const schedule = buildSchedule(transitionDays);

  return (
    <main className="newfood-page">
      <div className="newfood-header">
        <h1>🥣 Введення нового корму</h1>
        <p>Як правильно змінити раціон кроля — без ризику для здоров'я</p>
      </div>

      <div className="newfood-wrap">
        {/* ── ЧОМУ ЦЕ ВАЖЛИВО ── */}
        <div className="newfood-myth">
          <span className="newfood-myth-icon">⚠️</span>
          <div>
            <strong>Різка зміна корму може вбити кроля.</strong> Це не
            перебільшення. Кролі не можуть блювати — якщо корм не підійшов,
            вивести його з організму неможливо. Різка зміна раціону руйнує
            мікрофлору сліпої кишки, що призводить до здуття, ентериту або
            ШКТ-стазу. Особливо небезпечно для молодняку до 3 місяців.
          </div>
        </div>

        {/* ── ЧОМУ КРОЛИК ТАКИЙ ЧУТЛИВИЙ ── */}
        <h2 className="newfood-section-title">
          Чому кролик такий чутливий до зміни корму
        </h2>

        <div className="newfood-cards-grid">
          <div className="newfood-card">
            <div className="newfood-card-header">
              <span>🦠</span>
              <span>Мікрофлора сліпої кишки</span>
            </div>
            <p>
              Сліпа кишка кроля — це величезний ферментаційний резервуар, де
              живуть мільярди бактерій і мікроорганізмів. Саме вони
              перетравлюють клітковину і виробляють цінні вітаміни. Кожен корм
              має свій склад — і під нього «налаштована» своя мікрофлора. Різка
              зміна корму — це стрес для всієї цієї екосистеми.
            </p>
          </div>

          <div className="newfood-card">
            <div className="newfood-card-header">
              <span>🚫</span>
              <span>Кролик не може блювати</span>
            </div>
            <p>
              На відміну від собак чи котів, кролі фізично не здатні вивести
              зайве з шлунку. Якщо корм спричинив газоутворення або порушив
              баланс мікрофлори — організм не може «скинути» проблему. Саме тому
              наслідки різкої зміни раціону у кролів значно серйозніші.
            </p>
          </div>

          <div className="newfood-card">
            <div className="newfood-card-header">
              <span>⏱️</span>
              <span>Швидкий транзит їжі</span>
            </div>
            <p>
              Їжа проходить через ШКТ кроля приблизно за 19 годин. Це означає,
              що реакція на нову їжу може з'явитись вже наступного дня. Але
              мікрофлора адаптується значно повільніше — їй потрібно 7–14 днів,
              щоб перебудуватись під новий склад раціону.
            </p>
          </div>

          <div className="newfood-card">
            <div className="newfood-card-header">
              <span>🐣</span>
              <span>Молодняк — окрема зона ризику</span>
            </div>
            <p>
              Кроленята до 3 місяців мають незрілу мікрофлору і дуже чутливий
              кишечник. Навіть невелика помилка в раціоні може спричинити
              смертельний ентерит. Молодняк після відлучення (28–45 днів)
              переводять на новий корм ще повільніше — за 14 днів мінімум.
            </p>
            <div className="newfood-alert warn">
              ⚠️ Найвища смертність молодняку — перші 2 тижні після відлучення.
              Саме тоді зміна корму найнебезпечніша.
            </div>
          </div>
        </div>

        {/* ── ТИПИ КОРМІВ ── */}
        <h2 className="newfood-section-title">Різні корми — різний підхід</h2>

        <div className="newfood-table-wrap">
          <table className="newfood-table">
            <thead>
              <tr>
                <th>Тип корму</th>
                <th>Термін переходу</th>
                <th>Особливості</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Комбікорм / гранули</strong>
                  <br />
                  <span className="newfood-table-sub">
                    Зміна марки або виробника
                  </span>
                </td>
                <td>7–10 днів</td>
                <td>
                  Найризикованіша зміна — різний склад мікроелементів і
                  клітковини. Правило: +25% нового на тиждень.
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Зернова суміш</strong>
                  <br />
                  <span className="newfood-table-sub">
                    Нові пропорції або нові компоненти
                  </span>
                </td>
                <td>7–14 днів</td>
                <td>
                  Кожен новий компонент вводиться окремо — не всі одночасно.
                  Особливо обережно з кукурудзою і бобовими.
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Сіно</strong>
                  <br />
                  <span className="newfood-table-sub">
                    Новий вид або виробник
                  </span>
                </td>
                <td>5–7 днів</td>
                <td>
                  Змішуйте старе і нове сіно. Відмова їсти нове сіно — норма
                  перші 2–3 дні. Наполягайте, але не прибирайте старе різко.
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Свіжа зелень</strong>
                  <br />
                  <span className="newfood-table-sub">
                    Новий вид трави або овочів
                  </span>
                </td>
                <td>3–5 днів</td>
                <td>
                  Одна нова культура за раз. Починають з 10–20 г/добу, доводять
                  до норми поступово. Спочатку дають злегка підв'ялену, не
                  свіжозрізану.
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Коренеплоди</strong>
                  <br />
                  <span className="newfood-table-sub">
                    Морква, буряк, кабачок
                  </span>
                </td>
                <td>3–5 днів</td>
                <td>
                  Починають з невеликого шматочка 20–30 г. Буряк — особливо
                  обережно через цукор, не більше 50 г/добу дорослому.
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Відлучений молодняк</strong>
                  <br />
                  <span className="newfood-table-sub">
                    Перехід з молока на твердий корм
                  </span>
                </td>
                <td>14 днів мінімум</td>
                <td>
                  Перший тиждень — тільки сіно і вода. З 8-го дня — малими
                  дозами стартовий комбікорм. Зелень — не раніше 2-го місяця.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ── КАЛЬКУЛЯТОР ── */}
        <h2 className="newfood-section-title">Калькулятор переходу</h2>

        <div className="newfood-calc">
          <p className="newfood-calc-desc">
            Вкажіть добову норму корму та бажану тривалість переходу — отримаєте
            покрокову схему змішування старого і нового корму.
          </p>

          <div className="newfood-calc-inputs">
            <div className="newfood-input-wrap">
              <label className="newfood-input-label">
                Добова норма корму (г)
              </label>
              <input
                className="newfood-input"
                type="number"
                min={10}
                max={1000}
                value={dailyGrams}
                onChange={(e) =>
                  setDailyGrams(Math.max(10, Number(e.target.value)))
                }
              />
            </div>

            <div className="newfood-input-wrap">
              <label className="newfood-input-label">
                Тривалість переходу (днів)
              </label>
              <div className="newfood-days-btns">
                {[7, 10, 14].map((d) => (
                  <button
                    key={d}
                    className={`newfood-day-btn ${transitionDays === d ? "active" : ""}`}
                    onClick={() => setTransitionDays(d)}
                  >
                    {d} днів
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="newfood-table-wrap">
            <table className="newfood-table">
              <thead>
                <tr>
                  <th>День</th>
                  <th>Старий корм</th>
                  <th>Новий корм</th>
                  <th>Співвідношення</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((row) => (
                  <tr
                    key={row.day}
                    className={row.new >= 100 ? "newfood-row-done" : ""}
                  >
                    <td>
                      <strong>{row.day}</strong>
                    </td>
                    <td>
                      {row.old > 0
                        ? `${Math.round((row.old / 100) * dailyGrams)} г`
                        : "—"}
                    </td>
                    <td>
                      <strong>
                        {Math.round((row.new / 100) * dailyGrams)} г
                      </strong>
                    </td>
                    <td>
                      <div className="newfood-bar-wrap">
                        <div
                          className="newfood-bar-old"
                          style={{ width: `${row.old}%` }}
                        />
                        <div
                          className="newfood-bar-new"
                          style={{ width: `${row.new}%` }}
                        />
                      </div>
                      <span className="newfood-bar-label">
                        {row.old}% / {row.new}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="newfood-alert ok">
            💡 Якщо в будь-який день помітили рідкий послід або кролик
            відмовляється їсти — поверніться на 1–2 дні назад і тримайте
            попереднє співвідношення ще 2–3 дні перед тим як рухатись далі.
          </div>
        </div>

        {/* ── ТРИВОЖНІ ОЗНАКИ ── */}
        <h2 className="newfood-section-title">Стоп-сигнали під час переходу</h2>

        <div className="newfood-cards-grid">
          <div className="newfood-card danger">
            <div className="newfood-card-header">
              <span>🔴</span>
              <span>Зупиніть перехід і зверніться до ветеринара</span>
            </div>
            <p>
              Кролик не їсть більше 12 годин. Здутий і твердий живіт. Рідкий або
              кривавий послід. Судоми або повна млявість. Скрипіння зубами
              (ознака болю).
            </p>
          </div>

          <div className="newfood-card warning">
            <div className="newfood-card-header">
              <span>🟡</span>
              <span>Сповільніть перехід</span>
            </div>
            <p>
              М'який або кашкоподібний послід (не цекотрофи). Послід менший за
              звичний розмір. Кролик їсть менше або вибирає тільки старий корм.
              Незначне здуття без інших симптомів.
            </p>
          </div>

          <div className="newfood-card ok">
            <div className="newfood-card-header">
              <span>🟢</span>
              <span>Все йде добре</span>
            </div>
            <p>
              Послід округлий, рівномірний, помірно твердий. Кролик їсть обидва
              корми. Активний, п'є воду. Вага стабільна або зростає відповідно
              до норми.
            </p>
          </div>

          <div className="newfood-card">
            <div className="newfood-card-header">
              <span>💩</span>
              <span>Як перевірити здоров'я по посліду</span>
            </div>
            <p>
              Здоровий послід: темно-коричневі кульки, рівні, не злиплі,
              розміром з горошину (у великих порід більші). Цекотрофи — м'якіші,
              блискучі грона, які кроль з'їдає сам — це норма, не пронос.
              Тривожно: рідкий, слизовий, дрібний, деформований або відсутній
              послід.
            </p>
          </div>
        </div>

        {/* ── ОСОБЛИВІ ВИПАДКИ ── */}
        <h2 className="newfood-section-title">Особливі ситуації</h2>

        <div className="newfood-rules-grid">
          <div className="newfood-rule-card">
            <span className="newfood-rule-icon">🏥</span>
            <div>
              <span className="newfood-rule-title">
                Після хвороби або антибіотиків
              </span>
              <p>
                Після курсу антибіотиків мікрофлора кишечника пригнічена. Не
                вводьте новий корм мінімум 2 тижні після лікування. Спочатку
                відновіть нормальне травлення на звичному раціоні, потім
                переходьте на новий корм за стандартною схемою.
              </p>
            </div>
          </div>

          <div className="newfood-rule-card">
            <span className="newfood-rule-icon">🤰</span>
            <div>
              <span className="newfood-rule-title">
                Вагітні та годуючі самки
              </span>
              <p>
                Не змінюйте раціон у другій половині вагітності (після 21 дня
                тільності) та під час лактації. Стрес від зміни корму може
                спричинити передчасний окріл або відмову від годування. Плануйте
                переходи до або після лактаційного циклу.
              </p>
            </div>
          </div>

          <div className="newfood-rule-card">
            <span className="newfood-rule-icon">🌱</span>
            <div>
              <span className="newfood-rule-title">
                Перехід з зими на свіжу зелень
              </span>
              <p>
                Весняна свіжа зелень після зимового раціону — класична причина
                здуття. Починають з 50–100 г на добу для дорослого кроля і
                збільшують протягом 10–14 днів. Особливо обережно з першою
                конюшиною і люцерною — вони викликають газоутворення.
              </p>
            </div>
          </div>

          <div className="newfood-rule-card">
            <span className="newfood-rule-icon">📦</span>
            <div>
              <span className="newfood-rule-title">
                Нова партія того самого корму
              </span>
              <p>
                Навіть якщо ви купуєте той самий бренд — нова партія може мати
                дещо інший склад або вологість. При великих перервах між
                покупками (3+ місяці) рекомендується робити короткий перехід 3–5
                днів, особливо для молодняку.
              </p>
            </div>
          </div>
        </div>

        {/* ── ПІДСУМОК ── */}
        <div className="newfood-summary">
          <h3>Головне правило</h3>
          <p>
            Будь-яка зміна раціону — поступово. Сіно і вода — завжди в
            необмеженій кількості. Один новий продукт за раз. Слідкуйте за
            послідом — він покаже все раніше, ніж з'являться інші симптоми.
          </p>
        </div>

        <div className="newfood-back">
          <Link to="/" className="newfood-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Назва цієї сторінки" />
        </div>
      </div>
    </main>
  );
};

export default NewFood;
