import { useState } from "react";
import { Link } from "react-router-dom";
import "./RabbitsAndPredators.css";
import ShareButton from "../../components/ShareButton/ShareButton";

// Changelog:
// id:1 — Створено сторінку "Кролі, коти та собаки: ризики сумісного утримання"

type TabId = "verdict" | "cats" | "dogs" | "stress" | "diseases" | "rules";

const tabs: { id: TabId; icon: string; label: string }[] = [
  { id: "verdict", icon: "⚖️", label: "Головний висновок" },
  { id: "cats", icon: "🐈", label: "Кролі та коти" },
  { id: "dogs", icon: "🐕", label: "Кролі та собаки" },
  { id: "stress", icon: "🧠", label: "Хронічний стрес" },
  { id: "diseases", icon: "🦠", label: "Хвороби" },
  { id: "rules", icon: "📋", label: "Якщо вже разом" },
];

const RabbitsAndPredators = () => {
  const [activeTab, setActiveTab] = useState<TabId>("verdict");

  return (
    <main className="rap-page">
      <div className="rap-header">
        <h1>🐇🐈🐕 Кролі, коти та собаки</h1>
        <p>Ризики сумісного утримання: стрес, хвороби, безпека</p>
      </div>

      <div className="rap-wrap">
        <div className="rap-banner">
          <span>⚠️</span>
          <div>
            Кролик є здобиччю за своєю природою, а кіт і собака — хижаками.
            Навіть якщо фізичного нападу не відбувається,{" "}
            <strong>
              хронічний стрес від присутності хижака є однією з головних причин
              загибелі кролів у домашніх умовах.
            </strong>{" "}
            Ця сторінка розбирає реальні ризики на основі ветеринарних даних.
          </div>
        </div>

        <div className="rap-tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`rap-tab ${activeTab === t.id ? "active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* ── ГОЛОВНИЙ ВИСНОВОК ── */}
        {activeTab === "verdict" && (
          <div className="rap-content">
            <div className="rap-verdict-grid">
              <div className="rap-verdict-card no">
                <div className="rap-verdict-icon">❌</div>
                <span className="rap-verdict-title">Кіт + кролик разом</span>
                <p>
                  Не рекомендується. Постійний ризик нападу, Pasteurella від
                  укусу, хронічний стрес.
                </p>
              </div>
              <div className="rap-verdict-card no">
                <div className="rap-verdict-icon">❌</div>
                <span className="rap-verdict-title">Собака + кролик разом</span>
                <p>
                  Не рекомендується для більшості порід. Prey drive може
                  спрацювати навіть у «добре вихованого» пса.
                </p>
              </div>
              <div className="rap-verdict-card caution">
                <div className="rap-verdict-icon">⚠️</div>
                <span className="rap-verdict-title">
                  Окремі простори в одному будинку
                </span>
                <p>
                  Ризиковано. Навіть запах хижака активує стресову реакцію у
                  кролика. Потрібне чітке зонування.
                </p>
              </div>
              <div className="rap-verdict-card ok">
                <div className="rap-verdict-icon">✅</div>
                <span className="rap-verdict-title">
                  Контакт під наглядом після тривалого знайомства
                </span>
                <p>
                  Можливо лише якщо кролик не проявляє ознак стресу і хижак
                  повністю ігнорує кролика.
                </p>
              </div>
            </div>

            <h3 className="rap-sub-title">Три головні ризики</h3>
            <div className="rap-three-grid">
              <div className="rap-three-card">
                <span className="rap-three-num">1</span>
                <span className="rap-three-icon">⚡</span>
                <span className="rap-three-title">Фізична загроза</span>
                <p>
                  Напад кота або собаки — найчастіша причина екстреного
                  звернення до ветклініки з кролями
                </p>
              </div>
              <div className="rap-three-card">
                <span className="rap-three-num">2</span>
                <span className="rap-three-icon">🧠</span>
                <span className="rap-three-title">Хронічний стрес</span>
                <p>
                  Навіть без нападу — постійна присутність хижака руйнує
                  імунітет і травну систему кролика
                </p>
              </div>
              <div className="rap-three-card">
                <span className="rap-three-num">3</span>
                <span className="rap-three-icon">🦠</span>
                <span className="rap-three-title">Pasteurella від укусу</span>
                <p>
                  Бактерія з слини кота або собаки при потраплянні у рану
                  кролика спричиняє абсцеси та септицемію
                </p>
              </div>
            </div>

            <div className="rap-source">
              📚 Джерела: Merck Veterinary Manual, VCA Animal Hospitals, House
              Rabbit Society (rabbit.org), Vet Help Direct, PMC/PubMed
            </div>
          </div>
        )}

        {/* ── КРОЛІ ТА КОТИ ── */}
        {activeTab === "cats" && (
          <div className="rap-content">
            <p className="rap-intro">
              Значна частина екстрених звернень до ветеринарних клінік з кролями
              — це напади домашніх котів. Власники зазвичай кажуть: «це сталося
              за хвилину». Навіть гра кота може закінчитися трагічно.
            </p>

            <div className="rap-disease-card main">
              <div className="rap-disease-head">
                <span className="rap-disease-badge danger">
                  ГОЛОВНА ЗАГРОЗА
                </span>
                <span className="rap-disease-name">
                  Pasteurella multocida від укусу кота
                </span>
              </div>
              <div className="rap-disease-body">
                <div className="rap-disease-row">
                  <span className="rap-disease-label">Що це:</span>
                  <p>
                    Бактерія, що природно живе у слині та носовій порожнині
                    котів без жодних симптомів у самого кота.
                  </p>
                </div>
                <div className="rap-disease-row">
                  <span className="rap-disease-label">Для кроля:</span>
                  <p>
                    При потраплянні у рану — абсцеси, флегмона (cellulitis),
                    септицемія. Навіть дрібна подряпина від кігтя кота потребує
                    негайного промивання та огляду ветеринара. Pasteurella вже
                    може бути присутня у самого кроля латентно — травма і стрес
                    провокують клінічний прояв.
                  </p>
                </div>
                <div className="rap-disease-row danger-row">
                  <span className="rap-disease-label">Важливо:</span>
                  <p>
                    Рани від кота у кроля часто виглядають дрібнішими ніж є
                    насправді — кігті залишають глибокі проколи з мінімальним
                    зовнішнім пошкодженням. Не чекайте симптомів — одразу до
                    ветеринара.
                  </p>
                </div>
                <div className="rap-disease-row">
                  <span className="rap-disease-label">Лікування:</span>
                  <p>
                    Пеніцилін або його похідні за антибіограмою. Самолікування
                    небезпечне — багато штамів мають резистентність.
                  </p>
                </div>
              </div>
            </div>

            <h3 className="rap-sub-title">Інші ризики від котів</h3>
            <div className="rap-cards-grid">
              <div className="rap-card">
                <div className="rap-card-header">
                  <span>🪲</span>
                  <span>Бліхи та кліщі</span>
                </div>
                <p>
                  Вільно передаються між котом і кроликом при будь-якому
                  контакті. Обов'язкова профілактика для обох тварин — але
                  препарати мають бути різними: багато засобів для котів є
                  токсичними для кролів (permethrin).
                </p>
              </div>
              <div className="rap-card">
                <div className="rap-card-header">
                  <span>🍄</span>
                  <span>Стригучий лишай (Trichophyton)</span>
                </div>
                <p>
                  Грибкова інфекція шкіри передається між котом і кроликом при
                  прямому контакті. Заразна також для людини. При виявленні у
                  одного — негайна ізоляція і лікування обох.
                </p>
              </div>
              <div className="rap-card">
                <div className="rap-card-header">
                  <span>😰</span>
                  <span>Стрес від запаху</span>
                </div>
                <p>
                  Кролик реагує на запах кота як на присутність хижака — навіть
                  якщо не бачить його. Підстилка, шерсть або предмети з запахом
                  кота в приміщенні кроля достатні для активації стресової
                  реакції.
                </p>
              </div>
              <div className="rap-card">
                <div className="rap-card-header">
                  <span>💨</span>
                  <span>Респіраторні інфекції</span>
                </div>
                <p>
                  Деякі штами вірусних і бактеріальних респіраторних інфекцій
                  можуть передаватись між видами при тісному контакті, особливо
                  у погано провітрюваному приміщенні.
                </p>
              </div>
            </div>

            <h3 className="rap-sub-title">Чи можуть жити разом?</h3>
            <div className="rap-note">
              <p>
                Більшість ветеринарів не рекомендують спільне вільне утримання.
                Випадки мирного співіснування існують, але є винятком. «Unlikely
                friends» відео в соцмережах — не норма. Якщо ви все ж тримаєте
                обох — мінімальні вимоги безпеки:
              </p>
            </div>
            <div className="rap-steps">
              <div className="rap-step">
                <span className="rap-step-num">1</span>
                <div>
                  <span className="rap-step-title">
                    Кіт ніколи не має доступу до клітки/простору кроля
                  </span>
                  <p>
                    Навіть коли господарів немає вдома — фізичний бар'єр
                    обов'язковий.
                  </p>
                </div>
              </div>
              <div className="rap-step">
                <span className="rap-step-num">2</span>
                <div>
                  <span className="rap-step-title">
                    Знайомство — тільки через бар'єр, поступово
                  </span>
                  <p>
                    Спочатку обмін запахами (підстилка), потім знайомство через
                    сітку чи клітку — мінімум 2 тижні до будь-якого прямого
                    контакту.
                  </p>
                </div>
              </div>
              <div className="rap-step">
                <span className="rap-step-num">3</span>
                <div>
                  <span className="rap-step-title">
                    Кролик завжди має місце для втечі та укриття
                  </span>
                  <p>Недоступне для кота — обов'язкова умова.</p>
                </div>
              </div>
              <div className="rap-step">
                <span className="rap-step-num">4</span>
                <div>
                  <span className="rap-step-title">
                    Контакт без нагляду — ніколи
                  </span>
                  <p>
                    Навіть якщо місяцями все спокійно — один переляк або рух
                    може миттєво змінити ситуацію.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── КРОЛІ ТА СОБАКИ ── */}
        {activeTab === "dogs" && (
          <div className="rap-content">
            <p className="rap-intro">
              Ризики від собак залежать від породи та рівня дресури значно
              більше ніж від котів. Але навіть найспокійніший пес може миттєво
              переключитися на переслідування при різкому русі або писку
              кролика.
            </p>

            <h3 className="rap-sub-title">
              Prey Drive — інстинкт переслідування
            </h3>
            <div className="rap-cards-grid">
              <div className="rap-card danger">
                <div className="rap-card-header">
                  <span>🔴</span>
                  <span>Високий ризик</span>
                </div>
                <p>
                  Грейхаунд, уіппет, борзі, джек-рассел-тер'єр, бігль, хаскі,
                  малінуа, ягдтер'єр та мисливські тер'єри. Для цих порід кролик
                  — природна здобич, інстинкт вкорінений селекцією.
                </p>
              </div>
              <div className="rap-card">
                <div className="rap-card-header">
                  <span>🟡</span>
                  <span>Середній ризик</span>
                </div>
                <p>
                  Лабрадор, голден ретривер, бордер-коллі. Можливе спілкування
                  під постійним контролем після тривалого знайомства. Але ніколи
                  без нагляду.
                </p>
              </div>
              <div className="rap-card">
                <div className="rap-card-header">
                  <span>🟢</span>
                  <span>Нижчий ризик (але ніколи 0%)</span>
                </div>
                <p>
                  Великі флегматичні породи (сенбернар, ньюфаундленд) — менш
                  схильні до переслідування. Але можуть травмувати кролика
                  випадково через різницю у розмірі.
                </p>
              </div>
              <div className="rap-card danger">
                <div className="rap-card-header">
                  <span>💀</span>
                  <span>Кардіогенний шок</span>
                </div>
                <p>
                  Навіть якщо собака «грається» — кролик може померти від
                  переляку без жодного видимого поранення. Кардіогенний шок від
                  гострого стресу є реальною причиною загибелі.
                </p>
              </div>
            </div>

            <h3 className="rap-sub-title">Укус собаки: інфекційний ризик</h3>
            <div className="rap-disease-card main">
              <div className="rap-disease-head">
                <span className="rap-disease-badge danger">
                  НЕВІДКЛАДНА СИТУАЦІЯ
                </span>
                <span className="rap-disease-name">
                  Будь-який укус або подряпина від собаки
                </span>
              </div>
              <div className="rap-disease-body">
                <div className="rap-disease-row danger-row">
                  <span className="rap-disease-label">
                    Слина собак містить:
                  </span>
                  <p>
                    Pasteurella canis, Capnocytophaga canimorsus,
                    Staphylococcus, Streptococcus та інші бактерії. Інфекція
                    розвивається швидко — навіть дрібне поранення потребує
                    негайного огляду ветеринара і, як правило,
                    антибіотикотерапії.
                  </p>
                </div>
                <div className="rap-disease-row">
                  <span className="rap-disease-label">Що робити:</span>
                  <p>
                    1. Промити рану теплою водою з милом. 2. Не давити і не
                    перев'язувати туго. 3. Негайно — до ветеринара. Не чекати
                    симптомів.
                  </p>
                </div>
              </div>
            </div>

            <h3 className="rap-sub-title">Правила знайомства</h3>
            <div className="rap-steps">
              <div className="rap-step">
                <span className="rap-step-num">1</span>
                <div>
                  <span className="rap-step-title">
                    Собака завжди на повідку під час будь-якого контакту
                  </span>
                  <p>
                    Без винятків, навіть якщо собака «ніколи так не робила».
                  </p>
                </div>
              </div>
              <div className="rap-step">
                <span className="rap-step-num">2</span>
                <div>
                  <span className="rap-step-title">
                    Спочатку — обмін запахами, без візуального контакту
                  </span>
                  <p>
                    Підстилка або іграшка кроля поруч із собакою. Мінімум
                    тиждень до будь-якого наступного кроку.
                  </p>
                </div>
              </div>
              <div className="rap-step">
                <span className="rap-step-num">3</span>
                <div>
                  <span className="rap-step-title">
                    Знайомство через міцну сітку або клітку — мінімум 2 тижні
                  </span>
                  <p>
                    Тільки після повної відсутності реакції переслідування —
                    наступний крок.
                  </p>
                </div>
              </div>
              <div className="rap-step">
                <span className="rap-step-num">4</span>
                <div>
                  <span className="rap-step-title">
                    Кролик ніколи не «на руках» при знайомстві
                  </span>
                  <p>
                    Кролик має змогу піти сам. Фіксований кролик не може
                    проявити природну поведінку і отримує більший стрес.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── ХРОНІЧНИЙ СТРЕС ── */}
        {activeTab === "stress" && (
          <div className="rap-content">
            <p className="rap-intro">
              Стрес від хижаків — одна з найбільш недооцінених причин хвороб і
              загибелі кролів. Кролик може виглядати «нормально» зовні, але
              хронічно страждати від постійної присутності кота або собаки.
            </p>

            <h3 className="rap-sub-title">Що відбувається в організмі</h3>
            <div className="rap-cards-grid">
              <div className="rap-card danger">
                <div className="rap-card-header">
                  <span>🫀</span>
                  <span>Серцево-судинна система</span>
                </div>
                <p>
                  Тахікардія, скачки тиску при кожному стимулі. В екстремальних
                  випадках — кардіогенний шок: миттєва загибель від гострого
                  переляку без жодного видимого поранення.
                </p>
              </div>
              <div className="rap-card danger">
                <div className="rap-card-header">
                  <span>🛡️</span>
                  <span>Імунна система</span>
                </div>
                <p>
                  Хронічний кортизол знижує рівень лейкоцитів. Результат —
                  підвищена сприйнятливість до Pasteurella, кокцидіозу, ВГХК та
                  інших інфекцій. Латентні носії хвороб стають клінічно хворими.
                </p>
              </div>
              <div className="rap-card danger">
                <div className="rap-card-header">
                  <span>🍽️</span>
                  <span>Травна система</span>
                </div>
                <p>
                  Відмова від їжі → зупинка перистальтики (ГІ-стаз) → ліпідоз
                  печінки → загибель. Зупинка перистальтики може розвинутися за
                  12–24 години. Кролики не переносять навіть короткочасного
                  голодування.
                </p>
              </div>
              <div className="rap-card">
                <div className="rap-card-header">
                  <span>🧬</span>
                  <span>Репродуктивна система</span>
                </div>
                <p>
                  У самок при хронічному стресі — резорбція плодів,
                  мертвонародження, відмова від кроленят. У самців — зниження
                  якості сперми та статевої активності.
                </p>
              </div>
            </div>

            <h3 className="rap-sub-title">Ознаки стресу — що спостерігати</h3>
            <div className="rap-compare-grid">
              <div className="rap-compare-card rabbit">
                <span className="rap-compare-header">🟡 Ранні ознаки</span>
                <div className="rap-compare-item">
                  <span>Завмирає при звуці/запаху хижака</span>
                </div>
                <div className="rap-compare-item">
                  <span>Ховається більше ніж звично</span>
                </div>
                <div className="rap-compare-item">
                  <span>Менше їсть або їсть нерівномірно</span>
                </div>
                <div className="rap-compare-item">
                  <span>Менше «бінків» (радісних стрибків)</span>
                </div>
                <div className="rap-compare-item">
                  <span>Зміна консистенції калу</span>
                </div>
              </div>
              <div className="rap-compare-card guinea">
                <span className="rap-compare-header">
                  🔴 Пізні ознаки (термінова допомога)
                </span>
                <div className="rap-compare-item">
                  <span>Повна відмова від їжі понад 4–6 годин</span>
                </div>
                <div className="rap-compare-item">
                  <span>Відсутній або дуже мало посліду</span>
                </div>
                <div className="rap-compare-item">
                  <span>Скреготіння зубами (від болю)</span>
                </div>
                <div className="rap-compare-item">
                  <span>Апатія, не реагує на подразники</span>
                </div>
                <div className="rap-compare-item">
                  <span>Прискорене або утруднене дихання</span>
                </div>
              </div>
            </div>

            <div className="rap-alert warn">
              ⚠️ Кролики приховують хворобу і стрес до останнього — це
              еволюційний механізм (хвора тварина в природі приваблює хижаків).
              До того часу як кролик виглядає явно хворим — ситуація може бути
              критичною.
            </div>
          </div>
        )}

        {/* ── ХВОРОБИ ── */}
        {activeTab === "diseases" && (
          <div className="rap-content">
            <p className="rap-intro">
              Окрім прямої фізичної загрози, коти і собаки є переносниками ряду
              інфекцій і паразитів, небезпечних для кролів.
            </p>

            <div className="rap-disease-card main">
              <div className="rap-disease-head">
                <span className="rap-disease-badge danger">
                  ГОЛОВНА ЗАГРОЗА
                </span>
                <span className="rap-disease-name">
                  Pasteurella multocida / P. canis
                </span>
              </div>
              <div className="rap-disease-body">
                <div className="rap-disease-row">
                  <span className="rap-disease-label">Для кота і собаки:</span>
                  <p>
                    Бактерія є нормальним мешканцем верхніх дихальних шляхів і
                    ротової порожнини котів (P. multocida) та собак (P. canis)
                    без клінічних ознак.
                  </p>
                </div>
                <div className="rap-disease-row danger-row">
                  <span className="rap-disease-label">Для кроля:</span>
                  <p>
                    При потраплянні у рану (укус, подряпина) — абсцеси,
                    флегмона, остеомієліт, септицемія. Pasteurella вже може бути
                    латентно присутня у кроля — травма і стрес провокують
                    клінічну картину. Лікування: пеніцилін або похідні за
                    антибіограмою. Без лікування — летально.
                  </p>
                </div>
                <div className="rap-disease-row">
                  <span className="rap-disease-label">Статистика:</span>
                  <p>
                    За даними PMC/PubMed — Pasteurella виявляється у понад 75%
                    інфікованих ран від укусів котів і у понад 50% від укусів
                    собак.
                  </p>
                </div>
              </div>
            </div>

            <h3 className="rap-sub-title">Паразитарні та інші ризики</h3>
            <div className="rap-cards-grid">
              <div className="rap-card">
                <div className="rap-card-header">
                  <span>🪲</span>
                  <span>Бліхи (Ctenocephalides felis/canis)</span>
                </div>
                <p>
                  Бліхи котів і собак вільно паразитують на кролях. Спричиняють
                  свербіж, анемію при масивній інвазії, є переносниками
                  міксоматозу в деяких регіонах. Увага: більшість протиблошиних
                  препаратів для котів (permethrin) є токсичними для кролів.
                </p>
              </div>
              <div className="rap-card">
                <div className="rap-card-header">
                  <span>🕷️</span>
                  <span>Кліщі</span>
                </div>
                <p>
                  Іксодові кліщі, що паразитують на котах і собаках після
                  прогулянок на вулиці, можуть переходити на кролів і бути
                  переносниками хвороби Лайма та інших трансмісивних інфекцій.
                </p>
              </div>
              <div className="rap-card">
                <div className="rap-card-header">
                  <span>🍄</span>
                  <span>Дерматофітоз (стригучий лишай)</span>
                </div>
                <p>
                  Trichophyton mentagrophytes — найчастіший збудник у кролів,
                  передається при прямому контакті з котом або собакою-носієм.
                  Заразний для людини. При виявленні — ізоляція і лікування всіх
                  тварин та огляд членів сім'ї.
                </p>
              </div>
              <div className="rap-card">
                <div className="rap-card-header">
                  <span>🐛</span>
                  <span>Toxoplasma gondii</span>
                </div>
                <p>
                  Коти є кінцевим господарем токсоплазми. Кролики можуть
                  заразитись через контакт з котячим посліду або контамінованою
                  підстилкою. У кролів токсоплазмоз протікає тяжко, часто
                  летально.
                </p>
              </div>
            </div>

            <div className="rap-alert warn">
              ⚠️ Ніколи не застосовуйте протипаразитарні препарати для котів або
              собак кролям без консультації ветеринара. Permethrin, деякі
              інсектициди та препарати від глистів є токсичними для кролів
              навіть у малих дозах.
            </div>
          </div>
        )}

        {/* ── ЯКЩО ВЖЕ РАЗОМ ── */}
        {activeTab === "rules" && (
          <div className="rap-content">
            <div className="rap-note">
              <p>
                Якщо кіт або собака вже живуть разом з кролем — не обов'язково
                негайно розлучати, якщо кролик не проявляє ознак стресу і
                тварини справді ігнорують одне одного. Але є обов'язкові умови
                безпеки.
              </p>
            </div>

            <div className="rap-rules-list">
              <div className="rap-rule">
                <span className="rap-rule-icon">🏠</span>
                <div>
                  <span className="rap-rule-title">
                    Кролик має власний недоступний для хижака простір
                  </span>
                  <p>
                    Клітка, кімната або зона — фізично заблокована від кота і
                    собаки. Кролик повинен мати можливість повністю відпочити
                    без постійного нагляду за хижаком.
                  </p>
                </div>
              </div>
              <div className="rap-rule">
                <span className="rap-rule-icon">🚫</span>
                <div>
                  <span className="rap-rule-title">
                    Ніякого контакту без нагляду — ніколи
                  </span>
                  <p>
                    Навіть якщо роками все спокійно. Один різкий рух, звук або
                    запах — і інстинкт переслідування може спрацювати миттєво.
                    «Це сталося за хвилину» — найчастіша фраза господарів у
                    ветклініці.
                  </p>
                </div>
              </div>
              <div className="rap-rule">
                <span className="rap-rule-icon">👀</span>
                <div>
                  <span className="rap-rule-title">
                    Щодня перевіряйте кроля на ознаки стресу
                  </span>
                  <p>
                    Апетит, кількість посліду, активність, реакція на підхід.
                    Зважуйте раз на тиждень — втрата ваги є раннім індикатором
                    хронічного стресу.
                  </p>
                </div>
              </div>
              <div className="rap-rule">
                <span className="rap-rule-icon">🪲</span>
                <div>
                  <span className="rap-rule-title">
                    Профілактика паразитів для всіх тварин
                  </span>
                  <p>
                    Регулярна обробка кота і собаки від бліх і кліщів. Для кроля
                    — лише препарати, дозволені для кролів (Advantage для
                    кролів, Stronghold/Revolution — тільки за призначенням
                    ветеринара).
                  </p>
                </div>
              </div>
              <div className="rap-rule">
                <span className="rap-rule-icon">🩹</span>
                <div>
                  <span className="rap-rule-title">
                    Будь-яка рана від кота або собаки — негайно до ветеринара
                  </span>
                  <p>
                    Не чекати симптомів. Промити рану водою з милом і їхати до
                    клініки. Pasteurella розвивається швидко — зволікання може
                    коштувати кролю життя.
                  </p>
                </div>
              </div>
              <div className="rap-rule">
                <span className="rap-rule-icon">🩺</span>
                <div>
                  <span className="rap-rule-title">
                    Регулярний ветеринарний огляд кроля
                  </span>
                  <p>
                    При спільному утриманні з хижаками — ветеринарний огляд раз
                    на 6 місяців, навіть якщо кролик виглядає здоровим. Латентна
                    Pasteurella і хронічний стрес виявляються при огляді раніше
                    ніж стають видимими.
                  </p>
                </div>
              </div>
            </div>

            <div className="rap-alert tip">
              💡 Ідеальна компанія для кроля — інший кролик (кастрований самець
              + самка, або дві самки). Це усуває одразу і проблему стресу від
              самотності, і потребу в міжвидовому «співіснуванні» з хижаками.
            </div>

            <div className="rap-source">
              📚 Джерела: Merck Veterinary Manual (Pasteurellosis, Stress in
              Rabbits), VCA Animal Hospitals, House Rabbit Society
              (rabbit.org/health/pasteurella), Vet Help Direct
              (Management/Rabbit/Stress), PMC/PubMed — Pasteurella multocida
              infection in animals (2023–2025)
            </div>
          </div>
        )}

        <div className="rap-back">
          <Link to="/" className="rap-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Назва цієї сторінки" />
        </div>
      </div>
    </main>
  );
};

export default RabbitsAndPredators;
