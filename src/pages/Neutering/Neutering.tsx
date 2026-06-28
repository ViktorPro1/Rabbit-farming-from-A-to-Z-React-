import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Neutering.css";
import ShareButton from "../../components/ShareButton/ShareButton";

export default function Neutering() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="neuter">
      {/* HERO */}
      <section className="neuter__hero">
        <div className="neuter__hero-inner">
          <h1 className="neuter__title">Кастрація та стерилізація кролів</h1>
          <p className="neuter__subtitle">
            Кастрація самця та стерилізація самки — найефективніша профілактика
            раку матки, псевдовагітності та агресії. Для декоративних кролів це
            стандарт догляду, для ферми — інструмент управління поведінкою.
          </p>
          <div className="neuter__hero-alert">
            <span>⚕️</span>
            <span>
              Операцію має проводити ветеринар із досвідом роботи з кролями.
              Кролі значно чутливіші до анестезії, ніж коти та собаки.
            </span>
          </div>
        </div>
      </section>

      <div className="neuter__content">
        {/* ТЕРМІНОЛОГІЯ */}
        <section className="neuter__section">
          <h2 className="neuter__section-title">
            <span>📖</span> Термінологія
          </h2>
          <div className="neuter__terms">
            <div className="neuter__term">
              <span className="neuter__term-label neuter__term-label--buck">
                Кастрація (самець)
              </span>
              <p>
                Хірургічне видалення обох яєчок. Усуває вироблення тестостерону.
                Проводиться від 10–12 тижнів (після опускання яєчок у мошонку),
                за рекомендацією більшості ветеринарів — з 3–5 місяців.
              </p>
            </div>
            <div className="neuter__term">
              <span className="neuter__term-label neuter__term-label--doe">
                Стерилізація (самка)
              </span>
              <p>
                Оваріогістеректомія — видалення яєчників і матки. Іноді лише
                оваріектомія (тільки яєчники), але у кролів старших 3 років
                перевагу віддають повному видаленню матки через ризик пухлин.
                Проводиться від 5 місяців (великі породи — до 8 місяців).
              </p>
            </div>
          </div>
        </section>

        {/* НАВІЩО: ДВА КОНТЕКСТИ */}
        <section className="neuter__section">
          <h2 className="neuter__section-title">
            <span>🎯</span> Навіщо це потрібно
          </h2>
          <div className="neuter__context-tabs">
            <div className="neuter__context-block">
              <h3 className="neuter__context-heading neuter__context-heading--pet">
                🏠 Декоративні кролі
              </h3>
              <ul className="neuter__reason-list">
                <li>
                  <strong>Рак матки.</strong> 60–80% нестерилізованих самок
                  старших 3–4 років розвивають рак матки (аденокарцинома). До 6
                  років — до 80% (Vet Help Direct, 2025; ScienceDirect, 2022).
                  Стерилізація повністю усуває цей ризик.
                </li>
                <li>
                  <strong>Піометра.</strong> Гнійне запалення матки — потенційно
                  летальний стан, що розвивається без попередження.
                </li>
                <li>
                  <strong>Псевдовагітність.</strong> Гормональний стан після
                  овуляції без запліднення. Самка риє, рве хутро, будує гніздо,
                  стає агресивною. Повторюється регулярно і виснажує тварину.
                </li>
                <li>
                  <strong>Агресія.</strong> Нестерилізовані самки та
                  некастровані самці можуть атакувати господарів і партнерів.
                  Після операції агресія значно зменшується або зникає.
                </li>
                <li>
                  <strong>Маркування сечею.</strong> Некастровані самці
                  розбризкують сечу на клітку, партнера і господаря — як кіт.
                  Кастрація зазвичай повністю усуває цю поведінку.
                </li>
                <li>
                  <strong>Спільне утримання.</strong> Пара нейтральний самець +
                  нейтральна самка — єдиний надійний варіант сумісного утримання
                  без конфліктів і небажаної вагітності.
                </li>
              </ul>
            </div>

            <div className="neuter__context-block">
              <h3 className="neuter__context-heading neuter__context-heading--farm">
                🏡 Ферма
              </h3>
              <ul className="neuter__reason-list">
                <li>
                  <strong>Контроль агресії плідників.</strong> Некастровані
                  самці б'ються між собою при груповому утриманні. Кастрація
                  дозволяє тримати кількох самців разом без травм.
                </li>
                <li>
                  <strong>Вибракуваний плідник.</strong> Самця, якого більше не
                  використовують для розведення, але залишають у стаді — краще
                  каструвати для запобігання стресу та небажаних покривань.
                </li>
                <li>
                  <strong>Псевдовагітність самок.</strong> Самка після хибного
                  покриття або без нього може мати псевдовагітність 16–17 днів —
                  у цей час вона не приймає самця. Стерилізація усуває проблему
                  повністю.
                </li>
                <li>
                  <strong>Декоративне та виставкове поголів'я.</strong> Тварини,
                  що не беруть участь у розведенні, але живуть разом —
                  потребують нейтралізації для стабільної групової поведінки.
                </li>
              </ul>
              <div className="neuter__farm-note">
                ⚠️ Для продуктивних самок і активних плідників кастрація не
                практикується — це суперечить меті фермерського господарства.
                Рішення приймається індивідуально для кожної тварини.
              </div>
            </div>
          </div>
        </section>

        {/* РАК МАТКИ — СТАТИСТИКА */}
        <section className="neuter__section">
          <h2 className="neuter__section-title">
            <span>📊</span> Рак матки: що кажуть цифри
          </h2>
          <div className="neuter__stats">
            <div className="neuter__stat-card">
              <span className="neuter__stat-num">~4%</span>
              <span className="neuter__stat-desc">
                нестерилізованих самок до 2 років
              </span>
            </div>
            <div className="neuter__stat-card neuter__stat-card--mid">
              <span className="neuter__stat-num">~60%</span>
              <span className="neuter__stat-desc">
                нестерилізованих самок після 3 років
              </span>
            </div>
            <div className="neuter__stat-card neuter__stat-card--high">
              <span className="neuter__stat-num">до 80%</span>
              <span className="neuter__stat-desc">
                нестерилізованих самок після 6 років
              </span>
            </div>
          </div>
          <p className="neuter__stat-note">
            Захворюваність на аденокарциному матки у нестерилізованих самок
            кролів. Пухлина агресивна — метастазує в легені, печінку, кістки. Не
            залежить від того, чи самка коли-небудь кролилась. Стерилізація —
            єдина ефективна профілактика (Vet Help Direct, 2025; ScienceDirect,
            2022).
          </p>
          <div className="neuter__cancer-signs">
            <h3 className="neuter__subsection-title">
              Ознаки раку матки (для нестерилізованих самок)
            </h3>
            <div className="neuter__signs-grid">
              <div className="neuter__sign">
                🩸 Кров у сечі або кров'яні виділення з вульви
              </div>
              <div className="neuter__sign">
                ⚖️ Втрата ваги без зміни раціону
              </div>
              <div className="neuter__sign">🫄 Збільшення живота</div>
              <div className="neuter__sign">
                😮‍💨 Утруднене дихання (метастази в легені)
              </div>
              <div className="neuter__sign">
                😤 Різка зміна поведінки, агресія
              </div>
              <div className="neuter__sign">🥱 Млявість, відмова від їжі</div>
            </div>
            <p className="neuter__note">
              ⚠️ Рання стадія — безсимптомна. До моменту появи симптомів пухлина
              часто вже метастазує. Саме тому профілактична стерилізація —
              набагато краще рішення, ніж лікування.
            </p>
          </div>
        </section>

        {/* ВІК ДЛЯ ОПЕРАЦІЇ */}
        <section className="neuter__section">
          <h2 className="neuter__section-title">
            <span>📅</span> Вік для проведення операції
          </h2>
          <div className="neuter__age-grid">
            <div className="neuter__age-card neuter__age-card--buck">
              <div className="neuter__age-header">
                <span className="neuter__age-icon">♂️</span>
                <h3>Самець — кастрація</h3>
              </div>
              <div className="neuter__age-body">
                <div className="neuter__age-row">
                  <span>Мінімальний вік</span>
                  <strong>10–12 тижнів (після опускання яєчок)</strong>
                </div>
                <div className="neuter__age-row">
                  <span>Рекомендований вік</span>
                  <strong>3–5 місяців</strong>
                </div>
                <div className="neuter__age-row">
                  <span>Великі породи</span>
                  <strong>до 6 місяців</strong>
                </div>
                <div className="neuter__age-row neuter__age-row--warn">
                  <span>Стерильність після операції</span>
                  <strong>через 4–6 тижнів (залишкові сперматозоїди)</strong>
                </div>
              </div>
            </div>
            <div className="neuter__age-card neuter__age-card--doe">
              <div className="neuter__age-header">
                <span className="neuter__age-icon">♀️</span>
                <h3>Самка — стерилізація</h3>
              </div>
              <div className="neuter__age-body">
                <div className="neuter__age-row">
                  <span>Мінімальний вік</span>
                  <strong>5 місяців</strong>
                </div>
                <div className="neuter__age-row">
                  <span>Великі та велетенські породи</span>
                  <strong>до 8 місяців</strong>
                </div>
                <div className="neuter__age-row">
                  <span>Оптимально до</span>
                  <strong>2 роки (до розвитку пухлин)</strong>
                </div>
                <div className="neuter__age-row neuter__age-row--ok">
                  <span>Стерильність після операції</span>
                  <strong>негайно</strong>
                </div>
              </div>
            </div>
          </div>
          <div className="neuter__card neuter__card--warning">
            <strong>⚠️ Важливо про самця після кастрації</strong>
            <p>
              Протягом 4–6 тижнів після операції у самця можуть залишатись живі
              сперматозоїди в сім'явивідних протоках. У цей час він здатний
              запліднити самку. Тримайте кастрованого самця окремо від
              нестерилізованих самок мінімум 6 тижнів.
            </p>
          </div>
        </section>

        {/* ЯК ПРОХОДИТЬ ОПЕРАЦІЯ */}
        <section className="neuter__section">
          <h2 className="neuter__section-title">
            <span>🏥</span> Як проходить операція
          </h2>

          <div className="neuter__procedure-grid">
            <div className="neuter__procedure-block">
              <h3 className="neuter__subsection-title neuter__subsection-title--buck">
                ♂️ Кастрація самця
              </h3>
              <ol className="neuter__procedure-steps">
                <li>Ветеринар оглядає тварину, оцінює стан здоров'я</li>
                <li>
                  Загальна анестезія (інгаляційна — ізофлуран, або ін'єкційна)
                </li>
                <li>
                  Два розрізи — перед мошонкою або по одному над кожним яєчком
                </li>
                <li>Видалення обох яєчок</li>
                <li>
                  Накладання швів (розсмоктувані або знімні через 7–14 днів)
                </li>
                <li>Знеболення після операції (мелоксикам 1 мг/кг)</li>
              </ol>
              <p className="neuter__procedure-note">
                Тривалість: 15–30 хвилин. Ризик: низький при правильній
                анестезії. Можливе набрякання мошонки протягом кількох днів —
                норма.
              </p>
            </div>

            <div className="neuter__procedure-block">
              <h3 className="neuter__subsection-title neuter__subsection-title--doe">
                ♀️ Стерилізація самки
              </h3>
              <ol className="neuter__procedure-steps">
                <li>Ветеринар оглядає тварину, оцінює стан здоров'я</li>
                <li>Загальна анестезія</li>
                <li>Розріз по середній лінії живота або збоку (фланковий)</li>
                <li>Видалення яєчників і матки (оваріогістеректомія)</li>
                <li>Пошарове зашивання розрізу</li>
                <li>Знеболення після операції</li>
              </ol>
              <p className="neuter__procedure-note">
                Тривалість: 30–60 хвилин. Складніша операція, ніж кастрація
                самця. Вимагає ветеринара з досвідом роботи з кролями.
              </p>
            </div>
          </div>

          <div className="neuter__card neuter__card--accent">
            <strong>🐇 Кролів не можна морити голодом перед операцією</strong>
            <p>
              На відміну від котів і собак, кролів не позбавляють їжі перед
              анестезією. Вони не можуть блювати, тому ризику аспірації немає.
              Навпаки — порожній ШКТ підвищує ризик ШКТ-стазу після операції.
              Везіть кроля з його сіном та звичним кормом.
            </p>
          </div>
        </section>

        {/* РИЗИКИ */}
        <section className="neuter__section">
          <h2 className="neuter__section-title">
            <span>⚠️</span> Ризики та ускладнення
          </h2>
          <p className="neuter__section-intro">
            Кролі мають вищий анестезіологічний ризик, ніж коти та собаки. При
            правильній підготовці та досвідченому ветеринарі — операція
            безпечна. Знайте про можливі ускладнення.
          </p>
          <div className="neuter__risks-grid">
            <div className="neuter__risk neuter__risk--low">
              <span className="neuter__risk-label">Низький ризик</span>
              <strong>ШКТ-стаз після операції</strong>
              <p>
                Найчастіше ускладнення. Стрес від анестезії може пригнічити
                перистальтику. Профілактика: знеболення, тепло, раннє
                відновлення годування сіном.
              </p>
            </div>
            <div className="neuter__risk neuter__risk--low">
              <span className="neuter__risk-label">Низький ризик</span>
              <strong>Набрякання мошонки (самці)</strong>
              <p>
                Постопераційний набряк мошонки — норма, проходить за 3–7 днів.
                Обережний масаж і знеболення допомагають.
              </p>
            </div>
            <div className="neuter__risk neuter__risk--low">
              <span className="neuter__risk-label">Низький ризик</span>
              <strong>Розкриття швів</strong>
              <p>
                Кролі гризуть шви. Захисний комір або спеціальний одяг
                допомагають запобігти цьому в перші дні після операції.
              </p>
            </div>
            <div className="neuter__risk neuter__risk--mid">
              <span className="neuter__risk-label">Помірний ризик</span>
              <strong>Анестезіологічні ускладнення</strong>
              <p>
                Кролі чутливіші до анестезії, ніж коти/собаки. Ризик значно
                зменшується при роботі з ветеринаром, що має досвід саме з
                кролями, та при правильному моніторингу.
              </p>
            </div>
            <div className="neuter__risk neuter__risk--rare">
              <span className="neuter__risk-label">Рідко</span>
              <strong>Пахвинна грижа (самці)</strong>
              <p>
                При відкритій техніці кастрації — ризик пролапсу кишківника
                через пахвинний канал. Ветеринар закриває канал під час
                операції. Типовий ускладнення при неправильній техніці.
              </p>
            </div>
            <div className="neuter__risk neuter__risk--rare">
              <span className="neuter__risk-label">Рідко</span>
              <strong>Крипторхізм (самці)</strong>
              <p>
                Не опущене яєчко — складніша операція, потребує пошуку яєчка в
                черевній порожнині. Крипторхів обов'язково каструють — ризик
                пухлини яєчка вищий.
              </p>
            </div>
          </div>
        </section>

        {/* ПОСТОПЕРАЦІЙНИЙ ДОГЛЯД */}
        <section className="neuter__section">
          <h2 className="neuter__section-title">
            <span>🧡</span> Постопераційний догляд
          </h2>
          <div className="neuter__aftercare">
            <div className="neuter__aftercare-step">
              <div className="neuter__aftercare-num">1</div>
              <div>
                <strong>Тепло та спокій</strong>
                <p>
                  Після анестезії кролі швидко втрачають тепло. Забезпечте
                  температуру 20–22°C, м'яку підстилку, відсутність протягу.
                  Перші 12–24 годин — мінімальний стрес.
                </p>
              </div>
            </div>
            <div className="neuter__aftercare-step">
              <div className="neuter__aftercare-num">2</div>
              <div>
                <strong>Годування — одразу після пробудження</strong>
                <p>
                  Запропонуйте улюблене сіно, свіжу воду. Якщо через 12 годин
                  кролик не їсть та немає калу — зв'яжіться з ветеринаром.
                  Відновлення ШКТ-моторики — головний пріоритет.
                </p>
              </div>
            </div>
            <div className="neuter__aftercare-step">
              <div className="neuter__aftercare-num">3</div>
              <div>
                <strong>Знеболення за призначенням</strong>
                <p>
                  Зазвичай мелоксикам 1 мг/кг 1 раз на добу протягом 3–5 днів.
                  Не пропускайте дози — нелікований біль спричиняє стаз.
                </p>
              </div>
            </div>
            <div className="neuter__aftercare-step">
              <div className="neuter__aftercare-num">4</div>
              <div>
                <strong>Контроль швів</strong>
                <p>
                  Перевіряйте двічі на день: набряк, почервоніння, виділення —
                  норма в перші 2–3 дні. Розкриття, нагноєння — до ветеринара.
                  Знімні шви — через 7–14 днів.
                </p>
              </div>
            </div>
            <div className="neuter__aftercare-step">
              <div className="neuter__aftercare-num">5</div>
              <div>
                <strong>Ізоляція самця від самок (4–6 тижнів)</strong>
                <p>
                  Після кастрації самець залишається фертильним до 6 тижнів.
                  Тримайте окремо від нестерилізованих самок цей час.
                </p>
              </div>
            </div>
            <div className="neuter__aftercare-step">
              <div className="neuter__aftercare-num">6</div>
              <div>
                <strong>Коли викликати ветеринара терміново</strong>
                <p>
                  Відсутність їжі та калу понад 12 годин, здуття живота, сильне
                  набрякання рани, виділення гною, температура вище 40°C,
                  виражена млявість.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ПИТАННЯ ТА ВІДПОВІДІ */}
        <section className="neuter__section">
          <h2 className="neuter__section-title">
            <span>❓</span> Часті запитання
          </h2>
          <div className="neuter__faq">
            <div className="neuter__faq-item">
              <strong>Чи змінюється характер після кастрації?</strong>
              <p>
                Агресія, пов'язана з гормонами, зменшується або зникає. Базовий
                характер — спокійний чи активний — не змінюється. Кролик не стає
                «тупіший» або «ледачий».
              </p>
            </div>
            <div className="neuter__faq-item">
              <strong>Чи набере кролик зайву вагу після операції?</strong>
              <p>
                Зниження гормонального фону дещо знижує метаболізм. Якщо не
                змінювати раціон — можливе помірне збільшення ваги. Контролюйте
                кількість гранул, необмежений доступ до сіна.
              </p>
            </div>
            <div className="neuter__faq-item">
              <strong>У якому віці вже пізно стерилізувати?</strong>
              <p>
                Суворих вікових обмежень немає — але ризик анестезії зростає з
                віком та при наявності хронічних хвороб. Літньому кролику (4+
                роки) перед операцією рекомендується аналіз крові для оцінки
                функції нирок та печінки.
              </p>
            </div>
            <div className="neuter__faq-item">
              <strong>
                Чи обов'язково стерилізувати, якщо самка живе одна?
              </strong>
              <p>
                Так. Ризик раку матки не залежить від того, чи самка
                спаровувалась і чи народжувала. Пухлина розвивається від
                гормонального впливу на матку з часом.
              </p>
            </div>
            <div className="neuter__faq-item">
              <strong>
                Чи можна відразу після кастрації посадити разом двох самців?
              </strong>
              <p>
                Ні. Навіть після кастрації кролі можуть проявляти домінантну
                поведінку. Знайомте поступово в нейтральній зоні через 4–6
                тижнів після операції, коли гормони повністю знизились.
              </p>
            </div>
            <div className="neuter__faq-item">
              <strong>Чи можна каструвати/стерилізувати хворого кроля?</strong>
              <p>
                Ні. Операція проводиться лише на клінічно здоровій тварині
                нормальної ваги. ШКТ-стаз, інфекція, дуже мала або занадто
                велика вага — протипоказання. Спочатку лікування, потім
                операція.
              </p>
            </div>
          </div>
        </section>

        {/* НАВІГАЦІЯ */}
        <div className="neuter__nav">
          <Link to="/pain-management" className="neuter__nav-link">
            🩹 Знеболення та аналгезія
          </Link>
          <Link to="/mating-behavior" className="neuter__nav-link">
            🐇 Поведінка при злучці
          </Link>
          <Link to="/diseases" className="neuter__nav-link">
            🩺 Хвороби
          </Link>
          <Link to="/medicines" className="neuter__nav-link">
            💊 Препарати
          </Link>
        </div>
        <div className="neuter-back">
          <Link to="/" className="neuter-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Назва цієї сторінки" />
        </div>
      </div>
    </main>
  );
}
