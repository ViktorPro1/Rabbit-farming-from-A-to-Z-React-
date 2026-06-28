import { Link } from "react-router-dom";
import "./Culling.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const Culling = () => {
  return (
    <main className="culling-page">
      <div className="culling-header">
        <h1>🗑️ Вибраковка кролів</h1>
        <p>Критерії, вік, рішення — молодняк, самки, самці</p>
      </div>

      <div className="culling-wrap">
        {/* ── ЩО ТАКЕ ВИБРАКОВКА ── */}
        <h2 className="culling-section-title">Що таке вибраковка</h2>

        <div className="culling-note">
          <p>
            Вибраковка — це планове видалення тварин зі стада, які не
            відповідають вимогам продуктивності, здоров'я або племінної
            цінності. Мета не в тому, щоб позбутись «поганих» кролів — а в тому,
            щоб корм, місця в клітках і час витрачались на тварин, що дають
            реальний результат.
          </p>
        </div>

        <div className="culling-types-grid">
          <div className="culling-type-card soft">
            <span className="culling-type-icon">🔄</span>
            <span className="culling-type-title">М'яка вибраковка</span>
            <p>
              Тварину виводять зі стада живою — продають як домашнього
              улюбленця, передають іншому господарству або переводять на
              відгодівлю. Підходить для здорових, але непродуктивних тварин.
            </p>
          </div>
          <div className="culling-type-card hard">
            <span className="culling-type-icon">🔴</span>
            <span className="culling-type-title">Жорстка вибраковка</span>
            <p>
              Тварину забивають або евтаназують. Застосовується при хронічних
              захворюваннях, генетичних дефектах або якщо тварина є джерелом
              інфекції для стада.
            </p>
          </div>
        </div>

        <div className="culling-alert warn">
          ⚠️ Тварин після курсу антибіотиків не можна здавати на м'ясо без
          дотримання терміну очікування — зазвичай 28 і більше днів.
        </div>

        {/* ── МОЛОДНЯК ── */}
        <h2 className="culling-section-title">Молодняк</h2>

        <div className="culling-cards-grid">
          <div className="culling-card">
            <div className="culling-card-header">
              <span>🗓️</span>
              <span>Перший огляд — 5–7 днів</span>
            </div>
            <p>
              Кроленята значно менші за братів і сестер, холодні, відстають у
              розвитку — як правило, не виживуть і лише забирають молоко у
              здорових. Таких тварин відбраковують одразу.
            </p>
            <div className="culling-tip">
              💡 Виживаність дрібних кроленят при штучному вигодовуванні низька.
              Рішення варто ухвалити раніше, ніж пізніше.
            </div>
          </div>

          <div className="culling-card">
            <div className="culling-card-header">
              <span>🦷</span>
              <span>Перевірка зубів — 5–6 тижнів і 12 тижнів</span>
            </div>
            <p>
              При огляді в 5–6 тижнів: якщо нижні різці явно виступають попереду
              верхніх — вибраковка. Якщо зуби сходяться «встик» (пег-зуби) —
              повторна перевірка у 12 тижнів, оскільки верхня щелепа продовжує
              ріст. Якщо у 12 тижнів прикус досі неправильний — вибраковка
              обов'язкова.
            </p>
            <div className="culling-alert warn">
              ⚠️ Маклодоція — спадковий дефект. Таких тварин ніколи не залишають
              у плем'ї.
            </div>
          </div>

          <div className="culling-card">
            <div className="culling-card-header">
              <span>⚖️</span>
              <span>Відставання у рості — 30–60 днів</span>
            </div>
            <p>
              Кроленята, що відстають у вазі більш ніж на 20–25% від середньої
              по гнізду без явних причин, мають низькі шанси на наздоганяючий
              ріст. Переводять на відгодівлю, але не залишають у ремонтному
              молодняку.
            </p>
          </div>

          <div className="culling-card">
            <div className="culling-card-header">
              <span>🧬</span>
              <span>Фізичні дефекти — від 3 місяців</span>
            </div>
            <p>
              При відборі ремонтного молодняку перевіряють: будову кінцівок,
              стан подушечок лап, наявність двох яєчок у самців, кількість
              функціональних сосків у самок (мінімум 8). Тварини з будь-яким із
              цих дефектів у плем'ю не йдуть.
            </p>
            <div className="culling-tip">
              💡 Оцінку ремонтного молодняку проводять не раніше 3 місяців.
            </div>
          </div>
        </div>

        {/* ── САМКИ ── */}
        <h2 className="culling-section-title">Самки</h2>

        <div className="culling-table-wrap">
          <table className="culling-table">
            <thead>
              <tr>
                <th>Причина</th>
                <th>Коли</th>
                <th>Тип</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Відмова від гнізда або посліду</strong>
                  <br />
                  <span className="culling-table-sub">
                    Двічі поспіль без видимих причин (не перший окріл)
                  </span>
                </td>
                <td>Після 2-го інциденту</td>
                <td>
                  <span className="culling-badge hard">Жорстка</span>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Малий послід</strong>
                  <br />
                  <span className="culling-table-sub">
                    Стабільно менше 5 живих кроленят протягом 3+ окролів
                  </span>
                </td>
                <td>Після 3-го окролу</td>
                <td>
                  <span className="culling-badge soft">М'яка</span>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Хронічний мастит</strong>
                  <br />
                  <span className="culling-table-sub">
                    Повторюється після лікування, ущільнення залоз
                  </span>
                </td>
                <td>Одразу при діагнозі</td>
                <td>
                  <span className="culling-badge hard">Жорстка</span>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Важкий пододерматит</strong>
                  <br />
                  <span className="culling-table-sub">
                    3–4 ступінь, не піддається лікуванню
                  </span>
                </td>
                <td>При відсутності динаміки</td>
                <td>
                  <span className="culling-badge hard">Жорстка</span>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Вік</strong>
                  <br />
                  <span className="culling-table-sub">
                    Понад 3 роки або 6–8 окролів
                  </span>
                </td>
                <td>Планово</td>
                <td>
                  <span className="culling-badge soft">М'яка</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="culling-alert warn">
          ⚠️ Хронічний мастит спричинений переважно Staphylococcus aureus.
          Ефективного лікування не існує. При масовому поширенні єдине рішення —
          повна заміна поголів'я після дезінфекції.
        </div>

        {/* ── САМЦІ ── */}
        <h2 className="culling-section-title">Самці</h2>

        <div className="culling-table-wrap">
          <table className="culling-table">
            <thead>
              <tr>
                <th>Причина</th>
                <th>Коли</th>
                <th>Тип</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Відмова від злучки</strong>
                  <br />
                  <span className="culling-table-sub">
                    2–3 спроби з різними самками без результату
                  </span>
                </td>
                <td>Після 3-ї спроби</td>
                <td>
                  <span className="culling-badge hard">Жорстка</span>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Низька заплідненість</strong>
                  <br />
                  <span className="culling-table-sub">
                    Менше 60–65% при нормальних результатах інших самців
                  </span>
                </td>
                <td>Після 4–6 тижнів відпочинку без покращення</td>
                <td>
                  <span className="culling-badge hard">Жорстка</span>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Абсцеси</strong>
                  <br />
                  <span className="culling-table-sub">
                    Глибокий або рецидивуючий
                  </span>
                </td>
                <td>Одразу при рецидиві</td>
                <td>
                  <span className="culling-badge hard">Жорстка</span>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Вік</strong>
                  <br />
                  <span className="culling-table-sub">
                    Понад 3 роки, якість сперми знижується
                  </span>
                </td>
                <td>Планово</td>
                <td>
                  <span className="culling-badge soft">М'яка</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="culling-alert warn">
          ⚠️ Самець з активним абсцесом не допускається до злучок — ризик
          інфекційного ендометриту у самок.
        </div>

        {/* ── ГЕНЕТИЧНІ ДЕФЕКТИ ── */}
        <h2 className="culling-section-title">
          Генетичні дефекти — завжди жорстка вибраковка
        </h2>

        <div className="culling-defects-grid">
          <div className="culling-defect-card">
            <span>🦷</span>
            <div>
              <span className="culling-defect-title">Маклодоція</span>
              <p>
                Неправильний прикус. Якщо дефект у кількох тварин одного посліду
                — переглянути пару батьків.
              </p>
            </div>
          </div>
          <div className="culling-defect-card">
            <span>👁️</span>
            <div>
              <span className="culling-defect-title">Дефекти очей</span>
              <p>Катаракта, мікрофтальмія, вроджена сліпота.</p>
            </div>
          </div>
          <div className="culling-defect-card">
            <span>🦵</span>
            <div>
              <span className="culling-defect-title">Дефекти кінцівок</span>
              <p>
                Вроджені викривлення, відсутність пальців, сплощені подушечки
                лап від народження.
              </p>
            </div>
          </div>
          <div className="culling-defect-card">
            <span>⚧️</span>
            <div>
              <span className="culling-defect-title">Крипторхізм</span>
              <p>
                Один або обидва яєчка не опустились до 3 місяців. Самець
                безплідний або частково плідний.
              </p>
            </div>
          </div>
          <div className="culling-defect-card">
            <span>🔢</span>
            <div>
              <span className="culling-defect-title">Менше 8 сосків</span>
              <p>
                Самка не зможе нормально вигодувати великий послід.
                Нефункціональні соски не рахуються.
              </p>
            </div>
          </div>
        </div>

        {/* ── СИСТЕМНИЙ ПІДХІД ── */}
        <h2 className="culling-section-title">Системний підхід</h2>

        <div className="culling-rules-grid">
          <div className="culling-rule-card">
            <span className="culling-rule-icon">📒</span>
            <div>
              <span className="culling-rule-title">
                Картка тварини — основа рішення
              </span>
              <p>
                Для самки: дата злучки, розмір посліду, кількість живих при
                відлученні, поведінка. Для самця: кількість злучок і відсоток
                запліднення. Без записів ви керуєтесь пам'яттю, а не фактами.
              </p>
            </div>
          </div>
          <div className="culling-rule-card">
            <span className="culling-rule-icon">3️⃣</span>
            <div>
              <span className="culling-rule-title">Правило трьох</span>
              <p>
                Одна невдача — не підстава. Перший окріл часто гірший за
                наступні. Якщо 3 окроли поспіль нижче мінімального стандарту —
                самка йде на вибраковку.
              </p>
            </div>
          </div>
          <div className="culling-rule-card">
            <span className="culling-rule-icon">🗓️</span>
            <div>
              <span className="culling-rule-title">
                Ревізія раз на 3–4 місяці
              </span>
              <p>
                Повний перегляд стада: вгодованість, стан лап, зубів,
                продуктивність за картками. Виявляє проблемних тварин до того,
                як вони стають тягарем.
              </p>
            </div>
          </div>
          <div className="culling-rule-card">
            <span className="culling-rule-icon">🔃</span>
            <div>
              <span className="culling-rule-title">
                30–40% оновлення щороку
              </span>
              <p>
                Щорічна заміна самок ремонтним молодняком підтримує середній вік
                стада в продуктивному діапазоні. Без цього стадо поступово
                старіє і продуктивність падає непомітно.
              </p>
            </div>
          </div>
        </div>

        <div className="culling-back">
          <Link to="/" className="culling-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Назва цієї сторінки" />
        </div>
      </div>
    </main>
  );
};

export default Culling;
