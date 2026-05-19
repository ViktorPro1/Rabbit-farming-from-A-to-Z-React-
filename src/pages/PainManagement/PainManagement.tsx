import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./PainManagement.css";

export default function PainManagement() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="pain-mgmt">
      {/* HERO */}
      <section className="pain-mgmt__hero">
        <div className="pain-mgmt__hero-inner">
          <h1 className="pain-mgmt__title">Знеболення та аналгезія у кролів</h1>
          <p className="pain-mgmt__subtitle">
            Кролик — здобич за природою. Він приховує біль інстинктивно, щоб не
            привертати увагу хижаків. Якщо ви бачите очевидний біль — він
            насправді значно сильніший.
          </p>
          <div className="pain-mgmt__hero-alert">
            <span className="pain-mgmt__hero-alert-icon">⚠️</span>
            <span>
              Будь-яке знеболення призначає ветеринар. Дози нижче наведені для
              орієнтування та спілкування з лікарем — не для самолікування.
            </span>
          </div>
        </div>
      </section>

      <div className="pain-mgmt__content">
        {/* ЧОМУ КРОЛИКИ ХОВАЮТЬ БІЛЬ */}
        <section className="pain-mgmt__section">
          <h2 className="pain-mgmt__section-title">
            <span className="pain-mgmt__section-icon">🧠</span>
            Чому кролики ховають біль
          </h2>
          <div className="pain-mgmt__card pain-mgmt__card--accent">
            <p>
              Кролик — типовий вид здобичі. Еволюційно він запрограмований не
              показувати слабкість: хворий або поранений кролик у дикій природі
              одразу стає мішенню. Тому навіть при сильному болю тварина може
              виглядати «нормально» — сидіти, рухатись, іноді їсти.
            </p>
            <p>
              Це означає, що до моменту, коли біль стає очевидним для господаря,
              кролик, як правило, вже страждає годинами або навіть добами.
            </p>
          </div>
          <div className="pain-mgmt__why-grid">
            <div className="pain-mgmt__why-item">
              <span className="pain-mgmt__why-icon">🔇</span>
              <strong>Не вокалізує</strong>
              <span>
                Кролики майже не кричать від болю. Скрикування — вже критичний
                стан.
              </span>
            </div>
            <div className="pain-mgmt__why-item">
              <span className="pain-mgmt__why-icon">🎭</span>
              <strong>Маскує поведінку</strong>
              <span>
                Може їсти та рухатись навіть при гострому болю. Норма поведінки
                — не показник відсутності болю.
              </span>
            </div>
            <div className="pain-mgmt__why-item">
              <span className="pain-mgmt__why-icon">📉</span>
              <strong>Стрес погіршує стан</strong>
              <span>
                Нелікований біль → стрес → пригнічення перистальтики → ШКТ-стаз.
                Порочне коло.
              </span>
            </div>
            <div className="pain-mgmt__why-item">
              <span className="pain-mgmt__why-icon">⏰</span>
              <strong>Час має значення</strong>
              <span>
                Чим довше не лікується біль, тим важче відновити нормальну
                роботу ШКТ та імунну функцію.
              </span>
            </div>
          </div>
        </section>

        {/* RABBIT GRIMACE SCALE */}
        <section className="pain-mgmt__section">
          <h2 className="pain-mgmt__section-title">
            <span className="pain-mgmt__section-icon">😣</span>
            Rabbit Grimace Scale — шкала гримаси болю
          </h2>
          <p className="pain-mgmt__section-intro">
            Науково валідований інструмент оцінки болю у кролів (Leach et al.,
            2011). Оцінюється 5 ділянок обличчя. Кожна — від 0 до 2 балів.
            Загальна сума: <strong>0–10</strong>. Понад 5 балів — кролик
            відчуває біль і потребує знеболення.
          </p>
          <div className="pain-mgmt__rgs-grid">
            <div className="pain-mgmt__rgs-card">
              <div className="pain-mgmt__rgs-emoji">👁️</div>
              <h3>Орбітальне звуження</h3>
              <div className="pain-mgmt__rgs-scores">
                <div className="pain-mgmt__rgs-score pain-mgmt__rgs-score--0">
                  <strong>0</strong> — Очі широко відкриті, нормальний вигляд
                </div>
                <div className="pain-mgmt__rgs-score pain-mgmt__rgs-score--1">
                  <strong>1</strong> — Очі частково заплющені, помітне
                  напруження навколо
                </div>
                <div className="pain-mgmt__rgs-score pain-mgmt__rgs-score--2">
                  <strong>2</strong> — Очі значно заплющені або щільно закриті
                </div>
              </div>
            </div>
            <div className="pain-mgmt__rgs-card">
              <div className="pain-mgmt__rgs-emoji">👃</div>
              <h3>Форма ніздрів</h3>
              <div className="pain-mgmt__rgs-scores">
                <div className="pain-mgmt__rgs-score pain-mgmt__rgs-score--0">
                  <strong>0</strong> — Округлі, розслаблені ніздрі
                </div>
                <div className="pain-mgmt__rgs-score pain-mgmt__rgs-score--1">
                  <strong>1</strong> — Ніздрі дещо стягнуті або видовжені
                </div>
                <div className="pain-mgmt__rgs-score pain-mgmt__rgs-score--2">
                  <strong>2</strong> — Різко V-подібні, стягнуті ніздрі
                </div>
              </div>
            </div>
            <div className="pain-mgmt__rgs-card">
              <div className="pain-mgmt__rgs-emoji">🐰</div>
              <h3>Плескатість щік</h3>
              <div className="pain-mgmt__rgs-scores">
                <div className="pain-mgmt__rgs-score pain-mgmt__rgs-score--0">
                  <strong>0</strong> — Щоки округлі та опуклі, нормальний вигляд
                </div>
                <div className="pain-mgmt__rgs-score pain-mgmt__rgs-score--1">
                  <strong>1</strong> — Щоки злегка сплощені
                </div>
                <div className="pain-mgmt__rgs-score pain-mgmt__rgs-score--2">
                  <strong>2</strong> — Щоки явно втягнуті, запалі
                </div>
              </div>
            </div>
            <div className="pain-mgmt__rgs-card">
              <div className="pain-mgmt__rgs-emoji">〰️</div>
              <h3>Положення вусів</h3>
              <div className="pain-mgmt__rgs-scores">
                <div className="pain-mgmt__rgs-score pain-mgmt__rgs-score--0">
                  <strong>0</strong> — Вуса рівні, горизонтальні або злегка
                  опущені
                </div>
                <div className="pain-mgmt__rgs-score pain-mgmt__rgs-score--1">
                  <strong>1</strong> — Вуса дещо зібрані разом або підняті
                </div>
                <div className="pain-mgmt__rgs-score pain-mgmt__rgs-score--2">
                  <strong>2</strong> — Вуса явно підняті вперед або щільно
                  зібрані
                </div>
              </div>
            </div>
            <div className="pain-mgmt__rgs-card">
              <div className="pain-mgmt__rgs-emoji">👂</div>
              <h3>Положення вух</h3>
              <div className="pain-mgmt__rgs-scores">
                <div className="pain-mgmt__rgs-score pain-mgmt__rgs-score--0">
                  <strong>0</strong> — Вуха спрямовані вперед або в сторони,
                  розслаблені
                </div>
                <div className="pain-mgmt__rgs-score pain-mgmt__rgs-score--1">
                  <strong>1</strong> — Вуха злегка притиснуті або повернуті
                  назад
                </div>
                <div className="pain-mgmt__rgs-score pain-mgmt__rgs-score--2">
                  <strong>2</strong> — Вуха щільно притиснуті до голови або
                  розгорнуті назовні
                </div>
              </div>
            </div>
          </div>
          <div className="pain-mgmt__rgs-result">
            <div className="pain-mgmt__rgs-result-item pain-mgmt__rgs-result-item--ok">
              <strong>0–4 бали</strong>
              <span>Біль відсутній або мінімальний. Спостереження.</span>
            </div>
            <div className="pain-mgmt__rgs-result-item pain-mgmt__rgs-result-item--mid">
              <strong>5–7 балів</strong>
              <span>
                Помірний біль. Потрібне знеболення та консультація ветеринара.
              </span>
            </div>
            <div className="pain-mgmt__rgs-result-item pain-mgmt__rgs-result-item--bad">
              <strong>8–10 балів</strong>
              <span>Сильний біль. Термінова ветеринарна допомога.</span>
            </div>
          </div>
          <p className="pain-mgmt__note">
            ⚠️ Шкала розроблена для кролів із прямостоячими вухами (лабораторні
            породи). У вислоухих (баран) оцінка вух ускладнена — орієнтуйтесь
            переважно на перші 4 показники.
          </p>
        </section>

        {/* ПОВЕДІНКОВІ ОЗНАКИ */}
        <section className="pain-mgmt__section">
          <h2 className="pain-mgmt__section-title">
            <span className="pain-mgmt__section-icon">🔍</span>
            Поведінкові та клінічні ознаки болю
          </h2>
          <p className="pain-mgmt__section-intro">
            Окрім шкали гримаси, зверніть увагу на загальну поведінку тварини.
          </p>
          <div className="pain-mgmt__signs-grid">
            <div className="pain-mgmt__signs-block">
              <h3 className="pain-mgmt__signs-heading">🚨 Поведінкові зміни</h3>
              <ul className="pain-mgmt__signs-list">
                <li>Нерухомість, «скам'яніння» в куті клітки</li>
                <li>
                  Зубний скрегіт (бруксизм) — не сплутувати з тихим
                  «муркотінням» задоволення
                </li>
                <li>Зменшення або повна відмова від їжі та води</li>
                <li>
                  Відсутність грумінгу або надмірний груміng ураженої ділянки
                </li>
                <li>Агресія при торканні — особливо нового характеру</li>
                <li>
                  Аномальні пози: горбата спина, живіт притиснутий до підлоги
                </li>
                <li>Зменшення кількості або повна відсутність калу</li>
                <li>Часта зміна позиції — шукає зручне положення</li>
              </ul>
            </div>
            <div className="pain-mgmt__signs-block">
              <h3 className="pain-mgmt__signs-heading">
                🩺 Фізіологічні зміни
              </h3>
              <ul className="pain-mgmt__signs-list">
                <li>Прискорене дихання у спокої (&gt;60/хв)</li>
                <li>Підвищена ЧСС (&gt;250/хв)</li>
                <li>
                  Підвищена температура тіла (&gt;40°C) — реакція на стрес
                </li>
                <li>Блідість або ціаноз слизових оболонок</li>
                <li>Здуття живота, болючість при пальпації</li>
                <li>Скрипіння зубами при пальпації черевної порожнини</li>
              </ul>
            </div>
          </div>
          <div className="pain-mgmt__card pain-mgmt__card--warning">
            <strong>🦷 Увага: зубний скрегіт (бруксизм)</strong>
            <p>
              Гучний, ритмічний скрегіт зубів — ознака сильного болю або
              дискомфорту. Тихе, нечасте «клацання» зубами під час розслабленого
              відпочинку — навпаки, ознака задоволення та комфорту. Це різні
              звуки — навчіться їх розрізняти.
            </p>
          </div>
        </section>

        {/* ОСНОВНІ ПРИЧИНИ БОЛЮ */}
        <section className="pain-mgmt__section">
          <h2 className="pain-mgmt__section-title">
            <span className="pain-mgmt__section-icon">📋</span>
            Основні причини болю у кролів
          </h2>
          <div className="pain-mgmt__causes-list">
            <div className="pain-mgmt__cause">
              <span className="pain-mgmt__cause-icon">🦷</span>
              <div>
                <strong>Зубні хвороби та малоклюзія</strong>
                <p>
                  Одна з найчастіших причин хронічного болю. Зубні шипи ранять
                  язик та щоки, абсцеси щелепи спричиняють постійний сильний
                  біль. Кролик може їсти — але повільно та обережно.
                </p>
              </div>
            </div>
            <div className="pain-mgmt__cause">
              <span className="pain-mgmt__cause-icon">🫄</span>
              <div>
                <strong>ШКТ-стаз та тимпанія (здуття)</strong>
                <p>
                  Гострий спазмовий біль від розтягнення кишківника газами.
                  Знеболення є обов'язковою частиною лікування стазу —
                  мелоксикам знімає запалення та зменшує дискомфорт, що дозволяє
                  відновити перистальтику.
                </p>
              </div>
            </div>
            <div className="pain-mgmt__cause">
              <span className="pain-mgmt__cause-icon">🦶</span>
              <div>
                <strong>Пододерматит (запалення підошви)</strong>
                <p>
                  Хронічний біль при ходьбі. Кролик уникає спирання на уражені
                  лапи, що спричиняє аномальні пози та гіподинамію. Стадії 3–4
                  вимагають системного знеболення.
                </p>
              </div>
            </div>
            <div className="pain-mgmt__cause">
              <span className="pain-mgmt__cause-icon">👂</span>
              <div>
                <strong>Отит (запалення вуха)</strong>
                <p>
                  Середній та внутрішній отит спричиняють сильний головний біль,
                  вестибулярні порушення. Кролик може трясти головою, нахиляти
                  її вбік (не завжди E. cuniculi!).
                </p>
              </div>
            </div>
            <div className="pain-mgmt__cause">
              <span className="pain-mgmt__cause-icon">🔪</span>
              <div>
                <strong>Постопераційний біль</strong>
                <p>
                  Будь-яка хірургічна маніпуляція (кастрація, стерилізація,
                  видалення абсцесу) потребує пре- та постопераційного
                  знеболення. Мелоксикам ефективніший, якщо введений ДО операції
                  (Liles et al., 2024).
                </p>
              </div>
            </div>
            <div className="pain-mgmt__cause">
              <span className="pain-mgmt__cause-icon">🦴</span>
              <div>
                <strong>Травми та переломи</strong>
                <p>
                  Кролики з переломами кінцівок або хребта можуть не показувати
                  очевидного болю. Оцінюйте за шкалою гримаси та зміною
                  поведінки.
                </p>
              </div>
            </div>
            <div className="pain-mgmt__cause">
              <span className="pain-mgmt__cause-icon">🔬</span>
              <div>
                <strong>Абсцеси</strong>
                <p>
                  Абсцеси у кролів мають густий, сироподібний гній та зазвичай
                  не лопаються самостійно. Підшкірні абсцеси — помірний біль.
                  Зубощелепні — сильний хронічний біль.
                </p>
              </div>
            </div>
            <div className="pain-mgmt__cause">
              <span className="pain-mgmt__cause-icon">🧠</span>
              <div>
                <strong>E. cuniculi (енцефалітозооноз)</strong>
                <p>
                  Неврологічний біль при ураженні мозку та нирок. Нахил голови,
                  парези задніх кінцівок. Протизапальна та симптоматична терапія
                  — частина лікування.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ПРЕПАРАТИ */}
        <section className="pain-mgmt__section">
          <h2 className="pain-mgmt__section-title">
            <span className="pain-mgmt__section-icon">💊</span>
            Аналгетики для кролів
          </h2>
          <div className="pain-mgmt__drug-warning">
            <span>⚕️</span>
            <span>
              Усі препарати, дози та схеми застосування — виключно після
              консультації з ветеринарем. Наведені дані — орієнтовні,
              підтверджені публікаціями у рецензованих журналах (Leach et al.,
              2009; Cooper et al., 2009; Liles et al., 2024).
            </span>
          </div>

          {/* НПЗЗ */}
          <div className="pain-mgmt__drug-group">
            <h3 className="pain-mgmt__drug-group-title">
              💊 НПЗЗ (нестероїдні протизапальні засоби)
            </h3>
            <p className="pain-mgmt__drug-group-desc">
              Препарати першого вибору для лікування болю у кролів у фермерських
              умовах. Мають протизапальний та знеболювальний ефект.
            </p>

            <div className="pain-mgmt__drug-card">
              <div className="pain-mgmt__drug-header">
                <h4>Мелоксикам (Метакам, Meloxicam)</h4>
                <span className="pain-mgmt__drug-tag pain-mgmt__drug-tag--nsaid">
                  НПЗЗ
                </span>
              </div>
              <div className="pain-mgmt__drug-body">
                <div className="pain-mgmt__drug-info">
                  <div className="pain-mgmt__drug-row">
                    <span>Доза (орієнтовна)</span>
                    <strong>0.5–1 мг/кг</strong>
                  </div>
                  <div className="pain-mgmt__drug-row">
                    <span>Частота</span>
                    <strong>1 раз на добу</strong>
                  </div>
                  <div className="pain-mgmt__drug-row">
                    <span>Шлях введення</span>
                    <strong>Перорально або підшкірно</strong>
                  </div>
                  <div className="pain-mgmt__drug-row">
                    <span>Тривалість</span>
                    <strong>3–5 днів, або за призначенням</strong>
                  </div>
                </div>
                <div className="pain-mgmt__drug-notes">
                  <p>
                    <strong>Доказова база:</strong> Дози 0.2 мг/кг — недостатні
                    для адекватного знеболення після операцій (Turner et al.,
                    2006; Leach et al., 2009). Ефективна доза — від 0.5–1 мг/кг.
                    Важливо: введення ДО операції ефективніше, ніж після (Liles
                    et al., 2024).
                  </p>
                  <p>
                    <strong>Застосування:</strong> ШКТ-стаз, здуття,
                    пododерматит, постопераційний біль, запалення.
                  </p>
                  <p className="pain-mgmt__drug-caution">
                    ⚠️ При тривалому застосуванні — контроль функції нирок. Не
                    застосовувати при дегідратації та нирковій недостатності.
                  </p>
                </div>
              </div>
            </div>

            <div className="pain-mgmt__drug-card">
              <div className="pain-mgmt__drug-header">
                <h4>Карпрофен (Rimadyl, Carprofen)</h4>
                <span className="pain-mgmt__drug-tag pain-mgmt__drug-tag--nsaid">
                  НПЗЗ
                </span>
              </div>
              <div className="pain-mgmt__drug-body">
                <div className="pain-mgmt__drug-info">
                  <div className="pain-mgmt__drug-row">
                    <span>Доза (орієнтовна)</span>
                    <strong>2–4 мг/кг</strong>
                  </div>
                  <div className="pain-mgmt__drug-row">
                    <span>Частота</span>
                    <strong>1–2 рази на добу</strong>
                  </div>
                  <div className="pain-mgmt__drug-row">
                    <span>Шлях введення</span>
                    <strong>Підшкірно або перорально</strong>
                  </div>
                </div>
                <div className="pain-mgmt__drug-notes">
                  <p>
                    Менш вивчений у кролів порівняно з мелоксикамом. Є
                    дослідження, де карпрофен 5 мг/кг не поліпшував оцінку болю
                    порівняно з монотерапією бупренорфіном (Hedenqvist et al.,
                    2016). Застосовують при недоступності мелоксикаму.
                  </p>
                  <p className="pain-mgmt__drug-caution">
                    ⚠️ Ті самі застереження, що й для мелоксикаму.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ОПІОЇДИ */}
          <div className="pain-mgmt__drug-group">
            <h3 className="pain-mgmt__drug-group-title">
              💉 Опіоїдні аналгетики
            </h3>
            <p className="pain-mgmt__drug-group-desc">
              Призначаються ветеринаром при сильному болю, операціях, травмах. У
              фермерських умовах майже недоступні — переважно стаціонарне
              застосування в клініці.
            </p>

            <div className="pain-mgmt__drug-card">
              <div className="pain-mgmt__drug-header">
                <h4>Бупренорфін (Buprenorphine)</h4>
                <span className="pain-mgmt__drug-tag pain-mgmt__drug-tag--opioid">
                  Опіоїд
                </span>
              </div>
              <div className="pain-mgmt__drug-body">
                <div className="pain-mgmt__drug-info">
                  <div className="pain-mgmt__drug-row">
                    <span>Доза (орієнтовна)</span>
                    <strong>0.01–0.05 мг/кг</strong>
                  </div>
                  <div className="pain-mgmt__drug-row">
                    <span>Частота</span>
                    <strong>Кожні 6–12 годин</strong>
                  </div>
                  <div className="pain-mgmt__drug-row">
                    <span>Шлях введення</span>
                    <strong>Підшкірно або внутрішньом'язово</strong>
                  </div>
                </div>
                <div className="pain-mgmt__drug-notes">
                  <p>
                    Найбільш вивчений опіоїд для кролів. Комбінація з
                    мелоксикамом (0.01 мг/кг + 0.1 мг/кг) показала кращий
                    результат, ніж кожен препарат окремо (Goldschlager et al.,
                    PMC 2013). При дозі 0.02 мг/кг кожні 12 год у частини кролів
                    фіксувався помірний/сильний біль до наступної дози
                    (DiVincenti et al., 2016).
                  </p>
                  <p className="pain-mgmt__drug-caution">
                    ⚠️ Контрольована речовина. Тільки рецепт та призначення
                    ветеринара.
                  </p>
                </div>
              </div>
            </div>

            <div className="pain-mgmt__drug-card">
              <div className="pain-mgmt__drug-header">
                <h4>Трамадол (Tramadol)</h4>
                <span className="pain-mgmt__drug-tag pain-mgmt__drug-tag--opioid">
                  Опіоїд
                </span>
              </div>
              <div className="pain-mgmt__drug-body">
                <div className="pain-mgmt__drug-info">
                  <div className="pain-mgmt__drug-row">
                    <span>Доза (орієнтовна)</span>
                    <strong>10–11 мг/кг</strong>
                  </div>
                  <div className="pain-mgmt__drug-row">
                    <span>Частота</span>
                    <strong>Кожні 12–24 години</strong>
                  </div>
                  <div className="pain-mgmt__drug-row">
                    <span>Шлях введення</span>
                    <strong>Перорально</strong>
                  </div>
                </div>
                <div className="pain-mgmt__drug-notes">
                  <p>
                    Метаболізм трамадолу у кролів відрізняється від собак/котів
                    — обмежені дослідження фармакокінетики. Застосовується, але
                    зі застереженням: доказова база слабша, ніж для
                    бупренорфіну. Тільки за призначенням.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* МІСЦЕВА АНЕСТЕЗІЯ */}
          <div className="pain-mgmt__drug-group">
            <h3 className="pain-mgmt__drug-group-title">
              🩹 Місцева анестезія
            </h3>
            <div className="pain-mgmt__drug-card">
              <div className="pain-mgmt__drug-header">
                <h4>Лідокаїн / Бупівакаїн (місцево)</h4>
                <span className="pain-mgmt__drug-tag pain-mgmt__drug-tag--local">
                  Місцева
                </span>
              </div>
              <div className="pain-mgmt__drug-body">
                <div className="pain-mgmt__drug-notes">
                  <p>
                    Інфільтрація в місці розрізу під час операцій (кастрація,
                    видалення абсцесу). Поєднання з системним НПЗЗ дає значно
                    кращий результат — менше болю в ранньому постопераційному
                    періоді (Miller et al., 2022).
                  </p>
                  <p className="pain-mgmt__drug-caution">
                    ⚠️ Лідокаїн системно (IV) — токсичний для кролів у великих
                    дозах. Виключно місцеве застосування.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ЗАБОРОНЕНІ ПРЕПАРАТИ */}
        <section className="pain-mgmt__section">
          <h2 className="pain-mgmt__section-title">
            <span className="pain-mgmt__section-icon">🚫</span>
            Заборонені та небезпечні «знеболювальні»
          </h2>
          <div className="pain-mgmt__forbidden-grid">
            <div className="pain-mgmt__forbidden-card">
              <span className="pain-mgmt__forbidden-name">Аспірин</span>
              <span className="pain-mgmt__forbidden-reason">
                Токсичний для кролів. Порушує функцію тромбоцитів, пошкоджує
                слизову ШКТ. Ніколи не давати.
              </span>
            </div>
            <div className="pain-mgmt__forbidden-card">
              <span className="pain-mgmt__forbidden-name">
                Ібупрофен (Нурофен)
              </span>
              <span className="pain-mgmt__forbidden-reason">
                Людський НПЗЗ — надто висока токсичність для кролів. Може
                спричинити виразки ШКТ та ниркову недостатність.
              </span>
            </div>
            <div className="pain-mgmt__forbidden-card">
              <span className="pain-mgmt__forbidden-name">Парацетамол</span>
              <span className="pain-mgmt__forbidden-reason">
                Ефективність у кролів не доведена, метаболізм відрізняється від
                людського. Ризик гепатотоксичності.
              </span>
            </div>
            <div className="pain-mgmt__forbidden-card">
              <span className="pain-mgmt__forbidden-name">
                Анальгін (Метамізол)
              </span>
              <span className="pain-mgmt__forbidden-reason">
                Заборонений у більшості країн ЄС через токсичність. У кролів
                вивчений слабко, ризик агранулоцитозу.
              </span>
            </div>
            <div className="pain-mgmt__forbidden-card">
              <span className="pain-mgmt__forbidden-name">Кодеїн</span>
              <span className="pain-mgmt__forbidden-reason">
                Метаболізм у кролів інший. Може пригнічувати перистальтику та
                загострити ШКТ-стаз. Не застосовувати.
              </span>
            </div>
          </div>
        </section>

        {/* ПРАКТИЧНИЙ АЛГОРИТМ */}
        <section className="pain-mgmt__section">
          <h2 className="pain-mgmt__section-title">
            <span className="pain-mgmt__section-icon">📋</span>
            Практичний алгоритм для господаря
          </h2>
          <div className="pain-mgmt__algo">
            <div className="pain-mgmt__algo-step">
              <div className="pain-mgmt__algo-num">1</div>
              <div className="pain-mgmt__algo-content">
                <strong>Оцініть за Grimace Scale</strong>
                <p>
                  Подивіться на обличчя кроля в природному стані (без стресу від
                  вашої присутності — спостерігайте тихо або через камеру).
                  Підрахуйте бали.
                </p>
              </div>
            </div>
            <div className="pain-mgmt__algo-step">
              <div className="pain-mgmt__algo-num">2</div>
              <div className="pain-mgmt__algo-content">
                <strong>Оцініть поведінку</strong>
                <p>
                  Чи їсть? Чи є кал у клітці? Яка поза? Чи реагує на звичні
                  подразники (звук відра з кормом)?
                </p>
              </div>
            </div>
            <div className="pain-mgmt__algo-step">
              <div className="pain-mgmt__algo-num">3</div>
              <div className="pain-mgmt__algo-content">
                <strong>При оцінці 5+ балів або підозрі на біль</strong>
                <p>
                  Зателефонуйте ветеринару. Опишіть: симптоми, як давно, оцінку
                  за шкалою, чи їсть/п'є, наявність калу.
                </p>
              </div>
            </div>
            <div className="pain-mgmt__algo-step">
              <div className="pain-mgmt__algo-num">4</div>
              <div className="pain-mgmt__algo-content">
                <strong>Не чекайте «саме пройде»</strong>
                <p>
                  У кролів нелікований біль → стрес → пригнічення перистальтики
                  → ШКТ-стаз → загибель. Цикл розвивається за години.
                </p>
              </div>
            </div>
            <div className="pain-mgmt__algo-step">
              <div className="pain-mgmt__algo-num">5</div>
              <div className="pain-mgmt__algo-content">
                <strong>Після призначення — контролюйте ефект</strong>
                <p>
                  Оцінюйте за Grimace Scale кожні 4–6 годин. Відновлення
                  апетиту, нормального калу та активності — ознаки ефективного
                  знеболення.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ПОСИЛАННЯ */}
        <section className="pain-mgmt__section pain-mgmt__section--refs">
          <h2 className="pain-mgmt__section-title">
            <span className="pain-mgmt__section-icon">📚</span>
            Джерела та доказова база
          </h2>
          <ul className="pain-mgmt__refs">
            <li>
              Leach MC et al. (2011). The Grimace Scales: Scoring Pain in
              Rabbits. <em>Lab Animal</em>, 40(9). doi:10.1038/laban.806
            </li>
            <li>
              Leach MC et al. (2009). Analgesic efficacy of meloxicam in rabbits
              undergoing ovariohysterectomy.
              <em> Research in Veterinary Science</em>, 87(3).
            </li>
            <li>
              Cooper CS et al. (2009). Comparison of side effects between
              buprenorphine and meloxicam. <em>J Am Assoc Lab Anim Sci</em>,
              48(3).
            </li>
            <li>
              Goldschlager G et al. (2013). Multimodal analgesia with
              buprenorphine and meloxicam. <em>PMC3784663</em>.
            </li>
            <li>
              Liles M et al. (2024). Meloxicam before vs. after castration in
              pet rabbits. <em>Veterinary Medicine and Science</em>.
              doi:10.1002/vms3.1354
            </li>
            <li>
              Hedenqvist P et al. (2016). Postoperative analgesia for
              orthopaedic surgeries in rabbits.
            </li>
            <li>
              EFSA AHAW Panel (2020). Health and welfare of rabbits farmed in
              different production systems. <em>EFSA Journal</em> 18(1):5944.
            </li>
          </ul>
        </section>

        {/* НАВІГАЦІЯ */}
        <div className="pain-mgmt__nav">
          <Link to="/medicines" className="pain-mgmt__nav-link">
            💊 Препарати та дози
          </Link>
          <Link to="/treatment" className="pain-mgmt__nav-link">
            🏥 Схеми лікування
          </Link>
          <Link to="/first-aid" className="pain-mgmt__nav-link">
            🚑 Перша допомога
          </Link>
          <Link to="/diseases" className="pain-mgmt__nav-link">
            🩺 Хвороби
          </Link>
        </div>
      </div>
    </main>
  );
}
