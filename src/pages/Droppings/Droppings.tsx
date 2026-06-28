import "./Droppings.css";
import { Link } from "react-router-dom";
import ShareButton from "../../components/ShareButton/ShareButton";

const Droppings = () => {
  return (
    <main className="droppings">
      <div className="droppings__container">
        {/* HERO */}
        <section className="droppings__hero">
          <h1 className="droppings__hero-title">
            Послід кроля: норма та відхилення
          </h1>
          <p className="droppings__hero-sub">
            Перший і найпростіший щоденний індикатор здоров'я. Навчись читати
            послід — і ти будеш знати про стан кроля ще до появи інших
            симптомів.
          </p>
        </section>

        {/* ДВА ТИПИ — ВСТУП */}
        <section className="droppings__types-intro">
          <h2 className="droppings__section-title">Два типи посліду</h2>
          <p className="droppings__section-desc">
            Кролі — єдині тварини, які мають два принципово різних типи посліду.
            Це не патологія, а норма фізіології.
          </p>
          <div className="droppings__two-types">
            <div className="droppings__type-card droppings__type-card--fecal">
              <div className="droppings__type-icon">🟤</div>
              <h3 className="droppings__type-title">Фекальні кульки</h3>
              <p className="droppings__type-desc">
                Тверді, круглі, коричневі. Кролик залишає їх у клітці.
                Складаються з неперетравленої клітковини сіна. Майже без запаху.
                Це те, що ти бачиш щодня.
              </p>
              <ul className="droppings__type-list">
                <li>Форма: рівна кулька</li>
                <li>Колір: світло- або темно-коричневий</li>
                <li>Поверхня: злегка шорстка</li>
                <li>Запах: мінімальний</li>
                <li>Кількість: 100–300 на добу</li>
              </ul>
            </div>
            <div className="droppings__type-card droppings__type-card--ceco">
              <div className="droppings__type-icon">🍇</div>
              <h3 className="droppings__type-title">Цекотрофи</h3>
              <p className="droppings__type-desc">
                М'які, темні, зібрані в грону як виноград. Покриті слизом.
                Кролик з'їдає їх прямо з заднього проходу — зазвичай вночі або
                рано вранці. Якщо бачиш їх у клітці — це вже ознака проблеми.
              </p>
              <ul className="droppings__type-list">
                <li>Форма: грона / кластер</li>
                <li>Колір: чорно-зелений</li>
                <li>Поверхня: блискуча, слизова</li>
                <li>Запах: різкий, кислуватий</li>
                <li>Норма: кролик з'їдає сам</li>
              </ul>
            </div>
          </div>
        </section>

        {/* НОРМА */}
        <section className="droppings__normal">
          <h2 className="droppings__section-title">Як виглядає норма</h2>
          <div className="droppings__normal-grid">
            <div className="droppings__normal-card">
              <span className="droppings__normal-icon">✅</span>
              <div>
                <strong>Форма</strong>
                <p>
                  Рівні кульки, однакові за розміром. При натисканні
                  розсипаються як тирса — видно волокна сіна всередині.
                </p>
              </div>
            </div>
            <div className="droppings__normal-card">
              <span className="droppings__normal-icon">✅</span>
              <div>
                <strong>Колір</strong>
                <p>
                  Від світло-коричневого до темно-коричневого. Може злегка
                  варіюватись залежно від раціону — це норма.
                </p>
              </div>
            </div>
            <div className="droppings__normal-card">
              <span className="droppings__normal-icon">✅</span>
              <div>
                <strong>Розмір</strong>
                <p>
                  Приблизно з горошину. У великих порід більший, у карликів
                  менший. Важливо щоб розмір був стабільним.
                </p>
              </div>
            </div>
            <div className="droppings__normal-card">
              <span className="droppings__normal-icon">✅</span>
              <div>
                <strong>Кількість</strong>
                <p>
                  100–300 кульок на добу. Дорослий кролик 2–3 кг дає приблизно
                  150–200 штук. Менше — сигнал тривоги.
                </p>
              </div>
            </div>
            <div className="droppings__normal-card">
              <span className="droppings__normal-icon">✅</span>
              <div>
                <strong>Запах</strong>
                <p>
                  Майже відсутній. Свіжий послід злегка вологий — швидко
                  підсихає. Сильний запах — відхилення.
                </p>
              </div>
            </div>
            <div className="droppings__normal-card">
              <span className="droppings__normal-icon">✅</span>
              <div>
                <strong>Цекотрофи</strong>
                <p>
                  Ти їх НЕ бачиш у клітці — бо кролик з'їдає. Якщо знайшов — це
                  сигнал, що щось не так.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ТАБЛИЦЯ ВІДХИЛЕНЬ */}
        <section className="droppings__abnormal">
          <h2 className="droppings__section-title">
            Відхилення та що вони означають
          </h2>
          <p className="droppings__section-desc">
            Зміна посліду — це перший симптом, який з'являється раніше ніж
            млявість чи відмова від їжі.
          </p>

          <div className="droppings__cards">
            <div className="droppings__card droppings__card--warn">
              <div className="droppings__card-header">
                <span className="droppings__card-icon">⚠️</span>
                <div>
                  <h3 className="droppings__card-title">
                    Маленькі, тверді, темні кульки
                  </h3>
                  <span className="droppings__card-severity droppings__card-severity--warn">
                    Спостерігай
                  </span>
                </div>
              </div>
              <div className="droppings__card-body">
                <p>
                  <strong>Що означає:</strong> Кролик їсть мало сіна або мало
                  пє. ШКТ сповільнений.
                </p>
                <p>
                  <strong>Причини:</strong> Нестача клітковини, зневоднення,
                  стрес, зміна раціону.
                </p>
                <p>
                  <strong>Що робити:</strong> Збільш сіно до необмеженого
                  доступу, перевір воду. Якщо через 12–24 год не змінилось — до
                  ветеринара.
                </p>
              </div>
            </div>

            <div className="droppings__card droppings__card--warn">
              <div className="droppings__card-header">
                <span className="droppings__card-icon">⚠️</span>
                <div>
                  <h3 className="droppings__card-title">
                    Кульки з'єднані шерстю (ланцюжок)
                  </h3>
                  <span className="droppings__card-severity droppings__card-severity--warn">
                    Спостерігай
                  </span>
                </div>
              </div>
              <div className="droppings__card-body">
                <p>
                  <strong>Що означає:</strong> Кролик ковтає багато шерсті при
                  вилизуванні. Може призвести до закупорки.
                </p>
                <p>
                  <strong>Причини:</strong> Лінька, відсутність розчісування,
                  нестача клітковини.
                </p>
                <p>
                  <strong>Що робити:</strong> Частіше розчісуй під час линьки.
                  Більше сіна — воно штовхає шерсть через кишечник. Ніяких
                  "антишерстяних паст" без консультації ветеринара.
                </p>
              </div>
            </div>

            <div className="droppings__card droppings__card--warn">
              <div className="droppings__card-header">
                <span className="droppings__card-icon">⚠️</span>
                <div>
                  <h3 className="droppings__card-title">
                    Деформовані, несиметричні кульки
                  </h3>
                  <span className="droppings__card-severity droppings__card-severity--warn">
                    Спостерігай
                  </span>
                </div>
              </div>
              <div className="droppings__card-body">
                <p>
                  <strong>Що означає:</strong> Неправильне пересування їжі через
                  кишечник.
                </p>
                <p>
                  <strong>Причини:</strong> Неправильний раціон, надмір зерна,
                  мало клітковини, початок зубних проблем.
                </p>
                <p>
                  <strong>Що робити:</strong> Переглянь раціон. Збільш сіно,
                  зменш зерно і гранули. Якщо продовжується — огляд ветеринара
                  на стан зубів.
                </p>
              </div>
            </div>

            <div className="droppings__card droppings__card--danger">
              <div className="droppings__card-header">
                <span className="droppings__card-icon">🔴</span>
                <div>
                  <h3 className="droppings__card-title">
                    Кількість різко зменшилась або зникла зовсім
                  </h3>
                  <span className="droppings__card-severity droppings__card-severity--danger">
                    Терміново!
                  </span>
                </div>
              </div>
              <div className="droppings__card-body">
                <p>
                  <strong>Що означає:</strong> Можливий ШКТ-стаз — одна з
                  найнебезпечніших ситуацій для кроля. Кишечник зупинився.
                </p>
                <p>
                  <strong>Причини:</strong> Стрес, біль, неправильний раціон,
                  закупорка, інфекція.
                </p>
                <p>
                  <strong>Що робити:</strong> Якщо кролик не їсть і немає
                  посліду більше 4–6 годин — ветеринар НЕГАЙНО. Не чекай до
                  ранку. Масаж живота, прогулянка — тільки як перша допомога до
                  лікаря, не замість.
                </p>
              </div>
            </div>

            <div className="droppings__card droppings__card--danger">
              <div className="droppings__card-header">
                <span className="droppings__card-icon">🔴</span>
                <div>
                  <h3 className="droppings__card-title">
                    Рідкий, водянистий послід (справжній пронос)
                  </h3>
                  <span className="droppings__card-severity droppings__card-severity--danger">
                    Терміново!
                  </span>
                </div>
              </div>
              <div className="droppings__card-body">
                <p>
                  <strong>Що означає:</strong> Справжній пронос у дорослих
                  кролів — рідкість і завжди ознака серйозної проблеми. У
                  крільченят до 12 тижнів — загроза життю.
                </p>
                <p>
                  <strong>Причини:</strong> Кокцидіоз, інфекція, отруєння,
                  неправильні антибіотики (ампіцилін, амоксицилін — заборонені
                  кролям!).
                </p>
                <p>
                  <strong>Що робити:</strong> До ветеринара ЦЬОГО ЖЕ ДНЯ. Не
                  давай нічого самостійно крім води та сіна. Зберіть зразок
                  посліду в чисту ємність.
                </p>
              </div>
            </div>

            <div className="droppings__card droppings__card--info">
              <div className="droppings__card-header">
                <span className="droppings__card-icon">🟡</span>
                <div>
                  <h3 className="droppings__card-title">
                    Незʼїдені цекотрофи на підлозі клітки
                  </h3>
                  <span className="droppings__card-severity droppings__card-severity--info">
                    Розберись
                  </span>
                </div>
              </div>
              <div className="droppings__card-body">
                <p>
                  <strong>Що означає:</strong> Кролик не може або не хоче їсти
                  цекотрофи. Без них — дефіцит вітамінів B і амінокислот.
                </p>
                <p>
                  <strong>Причини:</strong> Надмір гранул/зерна (цекотрофів
                  виробляється більше ніж треба), ожиріння (не може
                  дотягнутись), артрит, зубний біль, стрес.
                </p>
                <p>
                  <strong>Що робити:</strong> Спочатку — зменш гранули, залиш
                  тільки сіно на 5–7 днів. Якщо проблема залишилась — огляд
                  ветеринара.
                </p>
              </div>
            </div>

            <div className="droppings__card droppings__card--info">
              <div className="droppings__card-header">
                <span className="droppings__card-icon">🟡</span>
                <div>
                  <h3 className="droppings__card-title">
                    М'які цекотрофи / кашоподібні грудки
                  </h3>
                  <span className="droppings__card-severity droppings__card-severity--info">
                    Розберись
                  </span>
                </div>
              </div>
              <div className="droppings__card-body">
                <p>
                  <strong>Що означає:</strong> Це не справжній пронос — це
                  порушений баланс мікрофлори сліпої кишки. Часто плутають з
                  проносом.
                </p>
                <p>
                  <strong>Причини:</strong> Надмір простих вуглеводів (хліб,
                  фрукти, зерно), мало сіна, стрес, неправильні антибіотики.
                </p>
                <p>
                  <strong>Що робити:</strong> Тільки сіно та вода на 5–7 днів.
                  Жодних гранул, фруктів, зерна. Якщо протягом тижня без
                  покращень — ветеринар.
                </p>
              </div>
            </div>

            <div className="droppings__card droppings__card--info">
              <div className="droppings__card-header">
                <span className="droppings__card-icon">🟡</span>
                <div>
                  <h3 className="droppings__card-title">
                    Слизові нитки або плівка на посліді
                  </h3>
                  <span className="droppings__card-severity droppings__card-severity--info">
                    До ветеринара
                  </span>
                </div>
              </div>
              <div className="droppings__card-body">
                <p>
                  <strong>Що означає:</strong> Слизова оболонка кишечника
                  подразнена або запалена.
                </p>
                <p>
                  <strong>Причини:</strong> Мукоїдний ентерит, паразити,
                  інфекція, стрес.
                </p>
                <p>
                  <strong>Що робити:</strong> Завжди до ветеринара — самостійне
                  лікування небезпечне. Зберіть зразок посліду.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* МОЛОДНЯК ОКРЕМО */}
        <section className="droppings__young">
          <div className="droppings__young-inner">
            <h2 className="droppings__section-title droppings__section-title--light">
              ⚡ Увага: молодняк до 12 тижнів
            </h2>
            <p>
              Крільченята до 12 тижнів — особлива група ризику. Їхній кишечник
              ще не сформований, мікрофлора нестабільна. Будь-яке відхилення
              посліду у цьому віці — це швидший розвиток критичного стану ніж у
              дорослих.
            </p>
            <div className="droppings__young-rules">
              <div className="droppings__young-rule">
                <span>🚨</span>
                <span>
                  Рідкий послід у крільченят до 12 тижнів = загроза життю =
                  ветеринар ЦЬОГО ЖЕ ДНЯ
                </span>
              </div>
              <div className="droppings__young-rule">
                <span>🚨</span>
                <span>
                  Відсутність посліду більше 2–3 годин у крільченят — терміново
                  до ветеринара
                </span>
              </div>
              <div className="droppings__young-rule">
                <span>✅</span>
                <span>
                  Жовтуватий м'який послід у перші 1–2 тижні після відлучення —
                  може бути нормою адаптації, але спостерігай уважно
                </span>
              </div>
              <div className="droppings__young-rule">
                <span>✅</span>
                <span>
                  При відлученні (28–45 днів) — різкої зміни корму немає,
                  перехід поступовий
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ШВИДКА ТАБЛИЦЯ */}
        <section className="droppings__quick">
          <h2 className="droppings__section-title">Швидка шпаргалка</h2>
          <div className="droppings__quick-table">
            <div className="droppings__quick-row droppings__quick-row--header">
              <span>Що бачиш</span>
              <span>Дія</span>
            </div>
            <div className="droppings__quick-row">
              <span>🟢 Рівні, коричневі кульки, звична кількість</span>
              <span>Норма. Нічого не роби.</span>
            </div>
            <div className="droppings__quick-row">
              <span>🟡 Менші ніж зазвичай, темніші</span>
              <span>Більше сіна + вода. Спостерігай 12–24 год.</span>
            </div>
            <div className="droppings__quick-row">
              <span>🟡 Ланцюжок з'єднаних кульок</span>
              <span>Розчісуй кроля. Більше сіна.</span>
            </div>
            <div className="droppings__quick-row">
              <span>🟡 Цекотрофи на підлозі (не з'їдені)</span>
              <span>Зменш гранули. Тільки сіно 5–7 днів.</span>
            </div>
            <div className="droppings__quick-row">
              <span>🟡 М'які кашоподібні грудки</span>
              <span>
                Тільки сіно та вода. Якщо 7 днів без змін — ветеринар.
              </span>
            </div>
            <div className="droppings__quick-row droppings__quick-row--danger">
              <span>🔴 Послід зник або різко зменшився + не їсть</span>
              <span>Ветеринар НЕГАЙНО (4–6 годин — критично).</span>
            </div>
            <div className="droppings__quick-row droppings__quick-row--danger">
              <span>🔴 Водянистий, рідкий послід</span>
              <span>Ветеринар ЦЬОГО ЖЕ ДНЯ. Збери зразок.</span>
            </div>
            <div className="droppings__quick-row droppings__quick-row--danger">
              <span>🔴 Слизові нитки або кров у посліді</span>
              <span>Ветеринар ЦЬОГО ЖЕ ДНЯ. Збери зразок.</span>
            </div>
          </div>
        </section>

        {/* ЩО ВПЛИВАЄ НА ПОСЛІД */}
        <section className="droppings__factors">
          <h2 className="droppings__section-title">
            Що нормально впливає на вигляд посліду
          </h2>
          <p className="droppings__section-desc">
            Не кожна зміна — хвороба. Ось що може тимчасово змінити послід без
            патології:
          </p>
          <div className="droppings__factors-grid">
            <div className="droppings__factor">
              <span className="droppings__factor-icon">🥕</span>
              <div>
                <strong>Новий корм</strong>
                <p>
                  Морква, буряк, зелень — можуть тимчасово змінити колір посліду
                  на 1–2 дні. Нормально при поступовому введенні.
                </p>
              </div>
            </div>
            <div className="droppings__factor">
              <span className="droppings__factor-icon">🌱</span>
              <div>
                <strong>Перехід на свіжу зелень весною</strong>
                <p>
                  М'якший послід на 3–5 днів при поступовому введенні — норма
                  адаптації кишечника.
                </p>
              </div>
            </div>
            <div className="droppings__factor">
              <span className="droppings__factor-icon">💊</span>
              <div>
                <strong>Антибіотики та препарати</strong>
                <p>
                  Деякі препарати змінюють консистенцію і колір посліду. Завжди
                  питай ветеринара про очікувані зміни.
                </p>
              </div>
            </div>
            <div className="droppings__factor">
              <span className="droppings__factor-icon">🧶</span>
              <div>
                <strong>Линька</strong>
                <p>
                  Під час сезонної линьки кролик ковтає більше шерсті — послід
                  може з'єднуватись у ланцюжки. Розчісуй частіше.
                </p>
              </div>
            </div>
            <div className="droppings__factor">
              <span className="droppings__factor-icon">🍼</span>
              <div>
                <strong>Вагітність та лактація</strong>
                <p>
                  Вагітні та годуючі самки можуть мати трохи менший обсяг
                  посліду через зміну потреб організму.
                </p>
              </div>
            </div>
            <div className="droppings__factor">
              <span className="droppings__factor-icon">😰</span>
              <div>
                <strong>Стрес</strong>
                <p>
                  Переїзд, новий кролик по сусідству, гучні звуки — можуть
                  тимчасово зменшити кількість посліду.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ЯК ЗІБРАТИ ЗРАЗОК */}
        <section className="droppings__sample">
          <div className="droppings__sample-inner">
            <h2 className="droppings__section-title droppings__section-title--light">
              🧪 Як правильно зібрати зразок для ветеринара
            </h2>
            <div className="droppings__sample-steps">
              <div className="droppings__sample-step">
                <span className="droppings__sample-num">1</span>
                <p>
                  Зберіть свіжий послід (до 2 годин після випорожнення) у чисту
                  суху ємність із кришкою — підійде баночка від дитячого
                  харчування або аптечний контейнер для аналізів.
                </p>
              </div>
              <div className="droppings__sample-step">
                <span className="droppings__sample-num">2</span>
                <p>
                  Якщо є і тверді кульки, і м'який послід — зберіть обидва типи
                  в окремі ємності.
                </p>
              </div>
              <div className="droppings__sample-step">
                <span className="droppings__sample-num">3</span>
                <p>
                  Зберігайте в холодильнику не більше 4–6 годин. Якщо не можете
                  відвезти одразу — сфотографуйте і надішліть ветеринару фото
                  разом з описом.
                </p>
              </div>
              <div className="droppings__sample-step">
                <span className="droppings__sample-num">4</span>
                <p>
                  Розкажіть ветеринару: коли з'явилась зміна, що їв кролик
                  останні 48 годин, чи були стресові ситуації, які препарати
                  давали.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ПАМ'ЯТАЙ */}
        <section className="droppings__remember">
          <h2 className="droppings__section-title">Головне правило</h2>
          <div className="droppings__remember-box">
            <p className="droppings__remember-text">
              Кролик — тварина, яка приховує хворобу до останнього (інстинкт
              здобичі). До моменту коли кролик виглядає явно хворим — він вже
              давно хворів. Саме тому щоденний огляд посліду — це найпростіший
              спосіб помітити проблему ЗАВЧАСНО, коли ще є час допомогти.
            </p>
            <p className="droppings__remember-sub">
              Перевіряй послід щоранку під час прибирання клітки. Це займає 30
              секунд.
            </p>
          </div>
        </section>
      </div>
      <div className="droppings-back">
        <Link to="/" className="droppings-back-btn">
          ⬅ На головну
        </Link>
        <ShareButton title="Назва цієї сторінки" />
      </div>
    </main>
  );
};

export default Droppings;
