import { useState } from "react";
import { Link } from "react-router-dom";
import ShareButton from "../../components/ShareButton/ShareButton";
import "./BuyingRabbit.css";

// Changelog:
// id:1 — Створено сторінку "Купівля кроля: від А до Я"

type TabId = "where" | "age" | "health" | "redflags" | "seller" | "after";

const tabs: { id: TabId; icon: string; label: string }[] = [
  { id: "where", icon: "🏪", label: "Де купувати" },
  { id: "age", icon: "📅", label: "Вік та стать" },
  { id: "health", icon: "🩺", label: "Огляд здоров'я" },
  { id: "redflags", icon: "🚩", label: "Червоні прапорці" },
  { id: "seller", icon: "🤝", label: "Перевірка продавця" },
  { id: "after", icon: "🏠", label: "Після купівлі" },
];

const BuyingRabbit = () => {
  const [activeTab, setActiveTab] = useState<TabId>("where");

  return (
    <main className="buy-page">
      <div className="buy-header">
        <h1>🐇 Купівля кроля: від А до Я</h1>
        <p>Де купувати, на що дивитись при огляді, червоні прапорці</p>
      </div>

      <div className="buy-wrap">
        <div className="buy-banner">
          <span>⚠️</span>
          <div>
            Більшість проблем зі здоров'ям у нових кролів виникає через покупку
            хворої або надто молодої тварини. Ця сторінка дає інструменти для
            прийняття <strong>обґрунтованого рішення</strong> до того, як ви
            передасте гроші продавцю.
          </div>
        </div>

        <div className="buy-tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`buy-tab ${activeTab === t.id ? "active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* ── ДЕ КУПУВАТИ ── */}
        {activeTab === "where" && (
          <div className="buy-content">
            <p className="buy-intro">
              Джерело купівлі напряму впливає на здоров'я та соціалізацію кроля.
              Кожен варіант має переваги та ризики — важливо розуміти різницю.
            </p>

            <h3 className="buy-sub-title">Порівняння джерел</h3>

            <div className="buy-source-card best">
              <div className="buy-source-head">
                <span className="buy-source-badge best-badge">
                  ✅ НАЙКРАЩИЙ ВАРІАНТ
                </span>
                <span className="buy-source-name">
                  Перевірений заводчик / племінна ферма
                </span>
              </div>
              <div className="buy-source-body">
                <div className="buy-source-row">
                  <span className="buy-source-label">Переваги:</span>
                  <p>
                    Знаєте родовід та медичну історію. Заводчик зацікавлений у
                    репутації — відповідає на питання і після продажу. Тварини,
                    як правило, добре соціалізовані. Можливість побачити
                    батьківське поголів'я — оцінити темперамент та стан здоров'я
                    лінії. Відповідальний заводчик не продає до 8 тижнів.
                  </p>
                </div>
                <div className="buy-source-row">
                  <span className="buy-source-label">Ризики:</span>
                  <p>
                    Ціна вища. Потребує ретельної перевірки самого заводчика — є
                    «розплідники-фабрики», що маскуються під любительських
                    заводчиків. Завжди відвідуйте особисто.
                  </p>
                </div>
                <div className="buy-source-row green-row">
                  <span className="buy-source-label">Як перевірити:</span>
                  <p>
                    Чи можна побачити умови утримання? Чи показують батьків? Чи
                    відповідають на питання без поспіху? Чи ставлять питання вам
                    — про умови утримання, досвід? Хороший заводчик перевіряє
                    покупця так само, як покупець перевіряє його.
                  </p>
                </div>
              </div>
            </div>

            <div className="buy-source-card ok">
              <div className="buy-source-head">
                <span className="buy-source-badge ok-badge">
                  ⚠️ ПРИЙНЯТНИЙ ВАРІАНТ
                </span>
                <span className="buy-source-name">
                  Оголошення від приватної особи (з виїздом)
                </span>
              </div>
              <div className="buy-source-body">
                <div className="buy-source-row">
                  <span className="buy-source-label">Переваги:</span>
                  <p>
                    Часто нижча ціна. Можуть продавати з реальних причин
                    (переїзд, алергія) тварину, за якою добре доглядали.
                  </p>
                </div>
                <div className="buy-source-row">
                  <span className="buy-source-label">Ризики:</span>
                  <p>
                    Невідома медична та генетична історія. Невідомий вік
                    (продавець може помилятись або лукавити). Часто кролі без
                    щеплень і ветогляду. Висока варіабельність — є відповідальні
                    власники, є й ті хто «позбувається» хворої тварини.
                  </p>
                </div>
                <div className="buy-source-row green-row">
                  <span className="buy-source-label">Що робити:</span>
                  <p>
                    Виїжджати тільки особисто. Бачити умови утримання. Після
                    купівлі — обов'язковий карантин і ветогляд протягом 48–72
                    годин.
                  </p>
                </div>
              </div>
            </div>

            <div className="buy-source-card bad">
              <div className="buy-source-head">
                <span className="buy-source-badge bad-badge">
                  🚫 НЕ РЕКОМЕНДУЄТЬСЯ
                </span>
                <span className="buy-source-name">
                  Ринок / стихійний торговець
                </span>
              </div>
              <div className="buy-source-body">
                <div className="buy-source-row danger-row">
                  <span className="buy-source-label">Чому небезпечно:</span>
                  <p>
                    Стрес транспортування + скупченість + змішування тварин з
                    різних господарств = ідеальні умови для поширення хвороб. За
                    даними ветеринарної практики — покупки на ринку є
                    найчастішою причиною спалахів кокцидіозу, пастерельозу та
                    ВГХК у нових власників. Вік зазвичай невідомий або
                    занижений. Жодних гарантій, жодної відповідальності
                    продавця.
                  </p>
                </div>
                <div className="buy-source-row danger-row">
                  <span className="buy-source-label">
                    Якщо все ж купили на ринку:
                  </span>
                  <p>
                    Суворий карантин мінімум 14 днів. Ветогляд у перші 24
                    години. Аналіз посліду на кокцидіоз. Не підселяти до
                    наявного поголів'я до завершення карантину.
                  </p>
                </div>
              </div>
            </div>

            <div className="buy-source-card bad">
              <div className="buy-source-head">
                <span className="buy-source-badge bad-badge">
                  🚫 НЕ РЕКОМЕНДУЄТЬСЯ
                </span>
                <span className="buy-source-name">
                  Купівля без огляду / доставка кур'єром
                </span>
              </div>
              <div className="buy-source-body">
                <div className="buy-source-row danger-row">
                  <span className="buy-source-label">Чому небезпечно:</span>
                  <p>
                    Неможливо провести огляд здоров'я до купівлі. Стрес
                    транспортування без вашого контролю. Фото або відео не
                    замінюють живий огляд. Продавці, що відмовляють у зустрічі —
                    серйозний червоний прапорець.
                  </p>
                </div>
              </div>
            </div>

            <div className="buy-source">
              📚 AVMA (Selecting a Pet Rabbit), WabbitWiki, RWAF Guide to Rabbit
              Care v6, House Rabbit Society
            </div>
          </div>
        )}

        {/* ── ВІК ТА СТАТЬ ── */}
        {activeTab === "age" && (
          <div className="buy-content">
            <p className="buy-intro">
              Вік при відлученні та купівлі — один з найважливіших факторів
              здоров'я нового кроля. Надто рання купівля є провідною причиною
              загибелі молодняку в перші тижні після придбання.
            </p>

            <div className="buy-disease-card main">
              <div className="buy-disease-head">
                <span className="buy-disease-badge danger">
                  МІНІМАЛЬНИЙ ВІК ПРОДАЖУ
                </span>
                <span className="buy-disease-name">
                  8 тижнів — раніше не брати
                </span>
              </div>
              <div className="buy-disease-body">
                <div className="buy-disease-row">
                  <span className="buy-disease-label">Чому 8 тижнів:</span>
                  <p>
                    WabbitWiki та ARBA: кролів не слід повністю відлучати від
                    матері і продавати до 8 тижнів. Тварини, відлучені раніше,
                    мають високий ризик розвитку ентериту — стан, що легко
                    призводить до загибелі молодого кроля. Після відлучення має
                    пройти мінімум кілька днів до переїзду в новий дім — щоб
                    переконатись що тварина стабільна.
                  </p>
                </div>
                <div className="buy-disease-row danger-row">
                  <span className="buy-disease-label">
                    Якщо пропонують молодше 6 тижнів:
                  </span>
                  <p>
                    Відмовляйтесь. Продаж до 6 тижнів є безвідповідальним
                    незалежно від обіцянок продавця. Такий кроль піддається
                    значному ризику загибелі від стрес-індукованого дисбіозу
                    (розмноження патогенних бактерій при відсутності захисної
                    мікрофлори, що формується з молоком матері).
                  </p>
                </div>
                <div className="buy-disease-row green-row">
                  <span className="buy-disease-label">
                    Оптимальний вік купівлі:
                  </span>
                  <p>
                    8–12 тижнів — найкращий період для переїзду в новий дім.
                    Кролик достатньо розвинутий, але ще добре адаптується до
                    нового середовища та людей.
                  </p>
                </div>
              </div>
            </div>

            <h3 className="buy-sub-title">Визначення статі</h3>
            <div className="buy-cards-grid">
              <div className="buy-card">
                <div className="buy-card-header">
                  <span>♂</span>
                  <span>Самець (кролик)</span>
                </div>
                <p>
                  Яєчка стають помітними з 10–12 тижнів, але самець може
                  втягувати їх у черевну порожнину при стресі — ненадійна ознака
                  (Merck Veterinary Manual). Для визначення статі у молодняку
                  необхідний досвід або допомога ветеринара. Помилки при
                  визначенні статі на ринку — вкрай часті.
                </p>
              </div>
              <div className="buy-card">
                <div className="buy-card-header">
                  <span>♀</span>
                  <span>Самка (крольчиха)</span>
                </div>
                <p>
                  Merck Veterinary Manual: стерилізація самок є обов'язковою не
                  лише для запобігання небажаному потомству — рак матки
                  розвивається у значної частки нестерилізованих самок після 3
                  років. Якщо купуєте самку не для розведення — плануйте
                  стерилізацію.
                </p>
              </div>
              <div className="buy-card">
                <div className="buy-card-header">
                  <span>👫</span>
                  <span>Купівля пари</span>
                </div>
                <p>
                  RWAF рекомендує тримати кролів парами — вони соціальні
                  тварини. Найстабільніша пара: кастрований самець + самка. Якщо
                  купуєте двох молодих — обов'язково каструвати обох якомога
                  швидше, до появи агресії.
                </p>
              </div>
              <div className="buy-card danger">
                <div className="buy-card-header">
                  <span>⚠️</span>
                  <span>Помилки при визначенні статі</span>
                </div>
                <p>
                  «Дві самки» або «два самці» від продавця часто виявляються
                  різностатевою парою. Покупка нібито «двох самок» — один з
                  найчастіших шляхів до несподіваного потомства. При будь-яких
                  сумнівах — підтвердіть стать у ветеринара протягом 48 годин.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── ОГЛЯД ЗДОРОВ'Я ── */}
        {activeTab === "health" && (
          <div className="buy-content">
            <p className="buy-intro">
              Проводьте огляд перед тим як передати гроші — в спокійній
              обстановці, не поспішаючи. Нижче — систематичний огляд за
              системами, підтверджений Merck Veterinary Manual, RSPCA та Best
              Friends Animal Society.
            </p>

            <div className="buy-check-list">
              <div className="buy-check-item">
                <div className="buy-check-head">
                  <span className="buy-check-icon">👁️</span>
                  <span className="buy-check-title">Очі</span>
                </div>
                <div className="buy-check-body">
                  <div className="buy-check-good">
                    <span>✓</span>
                    <span>
                      Ясні, яскраві, без виділень. Тканина повіки — рожева, не
                      червона і не дуже бліда
                    </span>
                  </div>
                  <div className="buy-check-bad">
                    <span>✗</span>
                    <span>
                      Гнійні або водянисті виділення, почервоніння, опухлість,
                      помутніння рогівки, видима третя повіка (ознака стресу або
                      хвороби)
                    </span>
                  </div>
                </div>
              </div>

              <div className="buy-check-item">
                <div className="buy-check-head">
                  <span className="buy-check-icon">👃</span>
                  <span className="buy-check-title">Ніс</span>
                </div>
                <div className="buy-check-body">
                  <div className="buy-check-good">
                    <span>✓</span>
                    <span>Чистий, сухий або злегка вологий, без виділень</span>
                  </div>
                  <div className="buy-check-bad">
                    <span>✗</span>
                    <span>
                      Будь-які виділення (прозорі або гнійні), часте чхання.
                      Перевірте внутрішню частину передніх лап — кролик витирає
                      ніс лапами, і там може бути матовий слід (рання ознака
                      пастерельозу)
                    </span>
                  </div>
                </div>
              </div>

              <div className="buy-check-item">
                <div className="buy-check-head">
                  <span className="buy-check-icon">👂</span>
                  <span className="buy-check-title">Вуха</span>
                </div>
                <div className="buy-check-body">
                  <div className="buy-check-good">
                    <span>✓</span>
                    <span>Чисті всередині, блідо-рожеві, без запаху</span>
                  </div>
                  <div className="buy-check-bad">
                    <span>✗</span>
                    <span>
                      Темний воскоподібний або кірковий наліт — ознака вушного
                      кліща (Psoroptes cuniculi). Неприємний запах, виділення,
                      нахил голови (вестибулярний синдром)
                    </span>
                  </div>
                </div>
              </div>

              <div className="buy-check-item">
                <div className="buy-check-head">
                  <span className="buy-check-icon">🦷</span>
                  <span className="buy-check-title">
                    Зуби та ротова порожнина
                  </span>
                </div>
                <div className="buy-check-body">
                  <div className="buy-check-good">
                    <span>✓</span>
                    <span>
                      Верхні різці злегка перекривають нижні (легкий прикус).
                      Зуби рівні, без надмірного росту
                    </span>
                  </div>
                  <div className="buy-check-bad">
                    <span>✗</span>
                    <span>
                      Різці ростуть вбік або дуже довгі (маlocclusion —
                      найпоширеніша спадкова хвороба кролів за Merck).
                      Слинотеча, вологе підборіддя — ознака зубних проблем.
                      Набряк щоки — можлива ознака абсцесу
                    </span>
                  </div>
                </div>
              </div>

              <div className="buy-check-item">
                <div className="buy-check-head">
                  <span className="buy-check-icon">🐾</span>
                  <span className="buy-check-title">Шерсть та шкіра</span>
                </div>
                <div className="buy-check-body">
                  <div className="buy-check-good">
                    <span>✓</span>
                    <span>
                      М'яка, блискуча, рівномірна. Розведіть шерсть пальцями —
                      шкіра чиста, рожева
                    </span>
                  </div>
                  <div className="buy-check-bad">
                    <span>✗</span>
                    <span>
                      Білі лусочки або «ходяча лупа» (Cheyletiella — хутряний
                      кліщ). Лисини, кірки, почервоніння. Бліхи або їхні
                      екскременти (чорні крапки). Тьмяна скуйовджена шерсть —
                      загальна ознака нездоров'я
                    </span>
                  </div>
                </div>
              </div>

              <div className="buy-check-item">
                <div className="buy-check-head">
                  <span className="buy-check-icon">🏋️</span>
                  <span className="buy-check-title">
                    Вага та тілесна кондиція
                  </span>
                </div>
                <div className="buy-check-body">
                  <div className="buy-check-good">
                    <span>✓</span>
                    <span>
                      М'язисте, пружне тіло. Ребра промацуються, але не
                      випирають. Добре розвинений крижовий відділ
                    </span>
                  </div>
                  <div className="buy-check-bad">
                    <span>✗</span>
                    <span>
                      Різко виступаючий хребет і ребра — виснаження. Навпаки,
                      важко промацати ребра — ожиріння. Будь-які ущільнення або
                      пухлини під шкірою
                    </span>
                  </div>
                </div>
              </div>

              <div className="buy-check-item">
                <div className="buy-check-head">
                  <span className="buy-check-icon">🍑</span>
                  <span className="buy-check-title">Задня частина</span>
                </div>
                <div className="buy-check-body">
                  <div className="buy-check-good">
                    <span>✓</span>
                    <span>Чиста, суха, без плям сечі або фекалій</span>
                  </div>
                  <div className="buy-check-bad">
                    <span>✗</span>
                    <span>
                      Забруднена задня частина — ознака діареї або проблем з
                      перистальтикою. Сечові плями на шерсті — можлива
                      неврологія або інфекція сечовивідних шляхів. Ризик міазу
                      при будь-якому забрудненні
                    </span>
                  </div>
                </div>
              </div>

              <div className="buy-check-item">
                <div className="buy-check-head">
                  <span className="buy-check-icon">🦵</span>
                  <span className="buy-check-title">Лапи та рух</span>
                </div>
                <div className="buy-check-body">
                  <div className="buy-check-good">
                    <span>✓</span>
                    <span>
                      Рівна хода, впевнені стрибки. Підошви задніх лап вкриті
                      шерстю. Кігті не надламані
                    </span>
                  </div>
                  <div className="buy-check-bad">
                    <span>✗</span>
                    <span>
                      Кульгавість, слабкість задніх лап, нерівна хода. Облисіння
                      або рани на п'яткових горбах (пододерматит). Тремтіння або
                      судоми
                    </span>
                  </div>
                </div>
              </div>

              <div className="buy-check-item">
                <div className="buy-check-head">
                  <span className="buy-check-icon">💩</span>
                  <span className="buy-check-title">Послід</span>
                </div>
                <div className="buy-check-body">
                  <div className="buy-check-good">
                    <span>✓</span>
                    <span>
                      Рівномірні округлі кульки середнього розміру,
                      темно-коричневі
                    </span>
                  </div>
                  <div className="buy-check-bad">
                    <span>✗</span>
                    <span>
                      Дрібний або деформований послід — ознака проблеми. Рідкий
                      або кашкоподібний — тривожний сигнал. Злиплі кульки або їх
                      відсутність — ГІ-стаз або гостра хвороба. Перевірте клітку
                      продавця
                    </span>
                  </div>
                </div>
              </div>

              <div className="buy-check-item">
                <div className="buy-check-head">
                  <span className="buy-check-icon">🧠</span>
                  <span className="buy-check-title">
                    Поведінка та активність
                  </span>
                </div>
                <div className="buy-check-body">
                  <div className="buy-check-good">
                    <span>✓</span>
                    <span>
                      Допитливий, реагує на подразники, активно досліджує.
                      Нормально їсть при можливості
                    </span>
                  </div>
                  <div className="buy-check-bad">
                    <span>✗</span>
                    <span>
                      Апатія, горбата поза (ознака болю за Merck), відсутність
                      реакції на навколишнє. Кролик сидить у кутку, не рухається
                      — серйозний сигнал. Скреготіння зубами у стані спокою
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="buy-alert warn">
              ⚠️ Merck Veterinary Manual: кролі приховують ознаки хвороби до
              останнього — це еволюційний механізм захисту від хижаків. Тварина,
              що виглядає «трохи млявою», може бути серйозно хворою. Будь-які
              сумніви — не купуйте.
            </div>
          </div>
        )}

        {/* ── ЧЕРВОНІ ПРАПОРЦІ ── */}
        {activeTab === "redflags" && (
          <div className="buy-content">
            <p className="buy-intro">
              Деякі ознаки вимагають негайної відмови від купівлі — незалежно
              від ціни, тиску продавця або вже витраченого шляху. Нижче — повний
              список абсолютних стоп-сигналів.
            </p>

            <h3 className="buy-sub-title">🚩 Стоп-сигнали зі здоров'я</h3>
            <div className="buy-flags-list">
              <div className="buy-flag red">
                <span className="buy-flag-icon">🔴</span>
                <div>
                  <span className="buy-flag-title">
                    Виділення з носа або очей
                  </span>
                  <p>
                    Навіть прозорі — ознака респіраторної інфекції. Pasteurella,
                    риніт — заразні для інших кролів у вашому господарстві.
                  </p>
                </div>
              </div>
              <div className="buy-flag red">
                <span className="buy-flag-icon">🔴</span>
                <div>
                  <span className="buy-flag-title">
                    Забруднена задня частина
                  </span>
                  <p>
                    Діарея або м'який послід — ентерит, кокцидіоз, дисбіоз. У
                    молодняку — часто летально навіть при лікуванні.
                  </p>
                </div>
              </div>
              <div className="buy-flag red">
                <span className="buy-flag-icon">🔴</span>
                <div>
                  <span className="buy-flag-title">
                    Апатія, горбата поза, відмова від їжі
                  </span>
                  <p>
                    Merck: горбата поза є класичною ознакою болю у кроля.
                    Тварина, що не реагує на подразники — серйозно хвора.
                  </p>
                </div>
              </div>
              <div className="buy-flag red">
                <span className="buy-flag-icon">🔴</span>
                <div>
                  <span className="buy-flag-title">
                    Темний або кірковий наліт у вухах
                  </span>
                  <p>
                    Вушний кліщ (Psoroptes cuniculi) — заразний, потребує
                    лікування. При запущеному стані ускладнюється бактеріальною
                    інфекцією середнього вуха.
                  </p>
                </div>
              </div>
              <div className="buy-flag red">
                <span className="buy-flag-icon">🔴</span>
                <div>
                  <span className="buy-flag-title">
                    Будь-яке поголів'я в місці продажу виглядає хворим
                  </span>
                  <p>
                    AVMA: якщо хтось з виводку виглядає хворим — не купуйте
                    навіть здорового на вигляд однопомітника: він, ймовірно, вже
                    інфікований.
                  </p>
                </div>
              </div>
              <div className="buy-flag red">
                <span className="buy-flag-icon">🔴</span>
                <div>
                  <span className="buy-flag-title">Вік менше 6 тижнів</span>
                  <p>
                    Занадто рання купівля — провідна причина загибелі молодняку
                    в перші 2 тижні після придбання. Ніякі обіцянки продавця не
                    змінюють біологію.
                  </p>
                </div>
              </div>
              <div className="buy-flag red">
                <span className="buy-flag-icon">🔴</span>
                <div>
                  <span className="buy-flag-title">
                    Нахил голови (torticollis)
                  </span>
                  <p>
                    Ознака отиту, E. cuniculi або вестибулярного синдрому.
                    Складне і тривале лікування, часто неповне відновлення.
                  </p>
                </div>
              </div>
            </div>

            <h3 className="buy-sub-title">🚩 Стоп-сигнали від продавця</h3>
            <div className="buy-flags-list">
              <div className="buy-flag orange">
                <span className="buy-flag-icon">🟠</span>
                <div>
                  <span className="buy-flag-title">
                    Не дозволяє оглянути умови утримання
                  </span>
                  <p>
                    «Зустрічаємось на нейтральній території» або «привезу сам» —
                    класична схема приховування поганих умов або хвороб у стаді.
                  </p>
                </div>
              </div>
              <div className="buy-flag orange">
                <span className="buy-flag-icon">🟠</span>
                <div>
                  <span className="buy-flag-title">
                    Тиск на термінову купівлю
                  </span>
                  <p>
                    «Є ще покупець», «тільки сьогодні», «це остання» —
                    маніпуляції, що позбавляють вас часу на обдуманий огляд.
                  </p>
                </div>
              </div>
              <div className="buy-flag orange">
                <span className="buy-flag-icon">🟠</span>
                <div>
                  <span className="buy-flag-title">
                    Не знає вік або дату народження
                  </span>
                  <p>
                    Відповідальний заводчик завжди знає дату народження.
                    «Приблизно 2 місяці» від ринкового торговця — не інформація.
                  </p>
                </div>
              </div>
              <div className="buy-flag orange">
                <span className="buy-flag-icon">🟠</span>
                <div>
                  <span className="buy-flag-title">
                    Не може показати батьківське поголів'я
                  </span>
                  <p>
                    При купівлі у заводчика — ви маєте право бачити хоча б
                    матір. Відмова — підозрілий сигнал.
                  </p>
                </div>
              </div>
              <div className="buy-flag orange">
                <span className="buy-flag-icon">🟠</span>
                <div>
                  <span className="buy-flag-title">
                    Продає більше 3–4 різних видів тварин одночасно
                  </span>
                  <p>
                    Ознака «розплідника-фабрики» або перекупника — у таких
                    місцях тварини рідко отримують належний догляд і
                    ветеринарний контроль.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── ПЕРЕВІРКА ПРОДАВЦЯ ── */}
        {activeTab === "seller" && (
          <div className="buy-content">
            <p className="buy-intro">
              Якість продавця — не менш важлива ніж стан самого кроля. Ось
              конкретні питання, які варто задати, та що відповідь кожного з них
              говорить про продавця.
            </p>

            <h3 className="buy-sub-title">Питання, що задати продавцю</h3>
            <div className="buy-qa-list">
              <div className="buy-qa-item">
                <div className="buy-qa-question">
                  Коли народився кролик? Яка дата відлучення від матері?
                </div>
                <div className="buy-qa-answer good">
                  <span>✓ Хороша відповідь:</span> Конкретна дата або тиждень.
                  Відлучення не раніше 6 тижнів.
                </div>
                <div className="buy-qa-answer bad">
                  <span>✗ Погана відповідь:</span> «Приблизно», «десь 1,5
                  місяця», «вже їсть самостійно».
                </div>
              </div>

              <div className="buy-qa-item">
                <div className="buy-qa-question">
                  Чим годуєте? Чи є постійний доступ до сіна?
                </div>
                <div className="buy-qa-answer good">
                  <span>✓ Хороша відповідь:</span> Сіно постійно, гранули
                  обмежено, свіжа зелень поступово.
                </div>
                <div className="buy-qa-answer bad">
                  <span>✗ Погана відповідь:</span> «Тільки гранули», «хліб та
                  овочі», «змішаний корм з магазину» — ознака відсутності
                  базових знань.
                </div>
              </div>

              <div className="buy-qa-item">
                <div className="buy-qa-question">
                  Чи проходив кролик ветеринарний огляд? Є документи?
                </div>
                <div className="buy-qa-answer good">
                  <span>✓ Хороша відповідь:</span> Ветеринарний паспорт або
                  картка з підписом лікаря, навіть якщо тільки первинний огляд.
                </div>
                <div className="buy-qa-answer bad">
                  <span>✗ Погана відповідь:</span> «Вони ж здорові — навіщо
                  ветеринар» або ухиляння від відповіді.
                </div>
              </div>

              <div className="buy-qa-item">
                <div className="buy-qa-question">
                  Чи були хвороби у цьому виводку або у вашому стаді?
                </div>
                <div className="buy-qa-answer good">
                  <span>✓ Хороша відповідь:</span> Чесна відповідь, навіть якщо
                  «так» — із поясненням що і як лікувалось.
                </div>
                <div className="buy-qa-answer bad">
                  <span>✗ Погана відповідь:</span> «Ніколи нічого» при великому
                  стаді — неправдоподібно і підозріло.
                </div>
              </div>

              <div className="buy-qa-item">
                <div className="buy-qa-question">
                  Можу я зв'язатись з вами після купівлі, якщо виникнуть
                  питання?
                </div>
                <div className="buy-qa-answer good">
                  <span>✓ Хороша відповідь:</span> «Так, ось мій номер, пишіть»
                  — відповідальний продавець не зникає після угоди.
                </div>
                <div className="buy-qa-answer bad">
                  <span>✗ Погана відповідь:</span> Ухиляння або «купив — сам
                  розберешся».
                </div>
              </div>
            </div>

            <h3 className="buy-sub-title">Оцінка умов утримання на місці</h3>
            <div className="buy-cards-grid">
              <div className="buy-card">
                <div className="buy-card-header">
                  <span>🧹</span>
                  <span>Чистота</span>
                </div>
                <p>
                  Клітки чисті, свіжа підстилка або сітчаста підлога без
                  накопиченого посліду. Неприємний запах аміаку — ознака рідкого
                  прибирання і можливої респіраторної загрози для тварин.
                </p>
              </div>
              <div className="buy-card">
                <div className="buy-card-header">
                  <span>🌾</span>
                  <span>Сіно у вільному доступі</span>
                </div>
                <p>
                  Сіно має бути в кожній клітці. Відсутність сіна — критичний
                  сигнал: такий заводчик не знає базових потреб кролів, і
                  тварини, ймовірно, мають зубні та травні проблеми.
                </p>
              </div>
              <div className="buy-card">
                <div className="buy-card-header">
                  <span>💧</span>
                  <span>Вода</span>
                </div>
                <p>
                  Чиста вода у вільному доступі. Брудні або порожні напувалки —
                  поганий знак.
                </p>
              </div>
              <div className="buy-card">
                <div className="buy-card-header">
                  <span>📦</span>
                  <span>Щільність посадки</span>
                </div>
                <p>
                  Переущільнені клітки — стрес, підвищена захворюваність,
                  конкуренція за їжу. Якщо в клітці для 2 кролів сидить 6 — це
                  ознака «розплідника-фабрики».
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── ПІСЛЯ КУПІВЛІ ── */}
        {activeTab === "after" && (
          <div className="buy-content">
            <div className="buy-note">
              <p>
                Перші 2 тижні після купівлі — критичний період. Стрес
                транспортування і нове середовище пригнічують імунітет і можуть
                спровокувати клінічний прояв латентних інфекцій. Саме тому
                більшість хвороб «проявляються» в перший тиждень — не тому що
                кролик захворів вдома, а тому що хвороба вже була.
              </p>
            </div>

            <div className="buy-steps">
              <div className="buy-step">
                <span className="buy-step-num">1</span>
                <div>
                  <span className="buy-step-title">
                    Карантин — мінімум 14 днів
                  </span>
                  <p>
                    Якщо у вас вже є кролі — новий кролик не повинен мати
                    жодного контакту з ними мінімум 2 тижні. Окреме приміщення
                    або клітка з відстанню від інших. Окремий інвентар, мийте
                    руки між доглядом.
                  </p>
                </div>
              </div>
              <div className="buy-step">
                <span className="buy-step-num">2</span>
                <div>
                  <span className="buy-step-title">
                    Ветогляд протягом 48–72 годин
                  </span>
                  <p>
                    Первинний огляд у ветеринара, що має досвід із кролями — в
                    перші 48–72 години. Перевірка зубів, загальна кондиція,
                    аналіз посліду при підозрі на кокцидіоз. Навіть якщо кролик
                    виглядає здоровим — огляд обов'язковий.
                  </p>
                </div>
              </div>
              <div className="buy-step">
                <span className="buy-step-num">3</span>
                <div>
                  <span className="buy-step-title">Поступова зміна корму</span>
                  <p>
                    Перші 3–5 днів — той самий корм, що і у продавця. Раптова
                    зміна раціону + стрес переїзду = ризик дисбіозу. ARBA: при
                    продажі варто попросити у заводчика трохи звичного корму для
                    перехідного періоду.
                  </p>
                </div>
              </div>
              <div className="buy-step">
                <span className="buy-step-num">4</span>
                <div>
                  <span className="buy-step-title">
                    Тихий режим перші 3–5 днів
                  </span>
                  <p>
                    Мінімум маніпуляцій, тиха обстановка, доступ до укриття.
                    Ніяких котів, собак або дітей поруч у перший тиждень. Нехай
                    кролик звикне до запахів і звуків нового середовища у
                    власному темпі.
                  </p>
                </div>
              </div>
              <div className="buy-step">
                <span className="buy-step-num">5</span>
                <div>
                  <span className="buy-step-title">
                    Щоденний моніторинг перші 2 тижні
                  </span>
                  <p>
                    Перевіряйте двічі на день: чи їсть, чи є послід, активність,
                    стан носа та очей. Зважте при купівлі — зважуйте раз на 3
                    дні. Втрата більше 5% ваги за тиждень — ветеринар.
                  </p>
                </div>
              </div>
              <div className="buy-step">
                <span className="buy-step-num">6</span>
                <div>
                  <span className="buy-step-title">
                    Знайдіть ветеринара до купівлі
                  </span>
                  <p>
                    Не всі ветеринари мають досвід із кролями. Знайдіть
                    спеціаліста завчасно — щоб у разі невідкладної ситуації не
                    витрачати час на пошук. Кролик не може чекати 24 години при
                    відмові від їжі або діареї.
                  </p>
                </div>
              </div>
            </div>

            <div className="buy-alert tip">
              💡 Якщо кролик відмовляється від їжі більше 6–8 годин — це
              ветеринарна невідкладна ситуація. ГІ-стаз розвивається стрімко і є
              летальним без лікування. Не чекайте «до ранку».
            </div>

            <div className="buy-source">
              📚 Merck Veterinary Manual (Routine Health Care of Rabbits), AVMA
              (Selecting a Pet Rabbit), WabbitWiki (Baby Rabbits), ARBA (FAQs &
              Care Recommendations), RSPCA (How To Health Check Your Rabbits),
              Best Friends Animal Society (Rabbit Health Check)
            </div>
          </div>
        )}

        <div className="buy-related">
          <h3 className="buy-related-title">Читайте також</h3>
          <div className="buy-related-grid">
            <Link to="/beginner-guide" className="buy-related-link">
              🚀 Маршрут новачка
            </Link>
            <Link to="/biosecurity" className="buy-related-link">
              🛡️ Біобезпека та карантин
            </Link>
            <Link to="/symptoms" className="buy-related-link">
              🌡️ Симптоматичний пошук
            </Link>
            <Link to="/sexing" className="buy-related-link">
              🔎 Визначення статі
            </Link>
            <Link to="/beginner-mistakes" className="buy-related-link">
              ⚠️ Типові помилки новачків
            </Link>
          </div>
        </div>

        <div className="buy-back">
          <Link to="/" className="buy-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Назва цієї сторінки" />
        </div>
      </div>
    </main>
  );
};

export default BuyingRabbit;
