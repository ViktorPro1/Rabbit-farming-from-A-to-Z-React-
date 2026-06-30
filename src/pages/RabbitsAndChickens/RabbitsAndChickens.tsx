import { useState } from "react";
import { Link } from "react-router-dom";
import "./RabbitsAndChickens.css";
import ShareButton from "../../components/ShareButton/ShareButton";

type TabId =
  | "verdict"
  | "salmonella"
  | "pasteurella"
  | "coccidiosis"
  | "other"
  | "rules";

const tabs: { id: TabId; icon: string; label: string }[] = [
  { id: "verdict", icon: "⚖️", label: "Головний висновок" },
  { id: "salmonella", icon: "🦠", label: "Сальмонельоз" },
  { id: "pasteurella", icon: "🫁", label: "Пастерельоз" },
  { id: "coccidiosis", icon: "🔬", label: "Кокцидіоз: міф і факт" },
  { id: "other", icon: "🚨", label: "Інші ризики" },
  { id: "rules", icon: "📋", label: "Якщо вже разом" },
];

const RabbitsAndChickens = () => {
  const [activeTab, setActiveTab] = useState<TabId>("verdict");

  return (
    <main className="rac-page">
      <div className="rac-header">
        <h1>🐇🐓 Кролі та кури</h1>
        <p>Ризики спільного утримання: інфекції, санітарія, безпека</p>
      </div>

      <div className="rac-wrap">
        <div className="rac-banner">
          <span>⚠️</span>
          <div>
            З погляду хижацтва — кури не загрожують кролям. Але з погляду
            інфекційних хвороб спільне утримання створює{" "}
            <strong>
              серйозні ризики, насамперед через Salmonella (летальність у кролів
              понад 90%) та Pasteurella multocida.
            </strong>{" "}
            Популярне твердження про міжвидовий кокцидіоз — міф, але решта
            загроз цілком реальні.
          </div>
        </div>

        <div className="rac-tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`rac-tab ${activeTab === t.id ? "active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* ── ГОЛОВНИЙ ВИСНОВОК ── */}
        {activeTab === "verdict" && (
          <div className="rac-content">
            <div className="rac-verdict-grid">
              <div className="rac-verdict-card no">
                <div className="rac-verdict-icon">❌</div>
                <span className="rac-verdict-title">
                  Спільний вигул / простір
                </span>
                <p>
                  Не рекомендується. Послід курей забруднює корм і воду кролів —
                  головний шлях передачі Salmonella.
                </p>
              </div>
              <div className="rac-verdict-card no">
                <div className="rac-verdict-icon">❌</div>
                <span className="rac-verdict-title">
                  Спільні годівниці та напувалки
                </span>
                <p>
                  Категорично не рекомендується. Навіть короткочасний доступ
                  курей до води кролів — критичний ризик.
                </p>
              </div>
              <div className="rac-verdict-card caution">
                <div className="rac-verdict-icon">⚠️</div>
                <span className="rac-verdict-title">Суміжні приміщення</span>
                <p>
                  Ризиковано при поганій вентиляції. Pasteurella передається
                  аерозольно між сусідніми клітками.
                </p>
              </div>
              <div className="rac-verdict-card ok">
                <div className="rac-verdict-icon">✅</div>
                <span className="rac-verdict-title">
                  Окремі приміщення з бар'єром
                </span>
                <p>
                  Прийнятно при повному просторовому розділенні, окремих
                  системах годівлі та щоденному прибиранні.
                </p>
              </div>
            </div>

            <h3 className="rac-sub-title">Три головні ризики</h3>
            <div className="rac-three-grid">
              <div className="rac-three-card">
                <span className="rac-three-num">1</span>
                <span className="rac-three-icon">🦠</span>
                <span className="rac-three-title">Salmonella spp.</span>
                <p>
                  Ендемічна в курей без симптомів. Летальність у кролів понад
                  90% навіть при лікуванні
                </p>
              </div>
              <div className="rac-three-card">
                <span className="rac-three-num">2</span>
                <span className="rac-three-icon">🫁</span>
                <span className="rac-three-title">Pasteurella multocida</span>
                <p>
                  Двосторонній міжвидовий обмін: пастерельоз у кролів, пташина
                  холера у курей
                </p>
              </div>
              <div className="rac-three-card">
                <span className="rac-three-num">3</span>
                <span className="rac-three-icon">🪰</span>
                <span className="rac-three-title">Міаз та аміак</span>
                <p>
                  Послід курей приваблює мух, аміак подразнює дихальні шляхи
                  кролів і знижує імунітет
                </p>
              </div>
            </div>

            <div className="rac-source">
              📚 Джерела: Merck Veterinary Manual, eXtension Poultry, Scientific
              Reports 2025 (Nature), Home and Roost (vet review), PMC/PubMed —
              Eimeria species specificity
            </div>
          </div>
        )}

        {/* ── САЛЬМОНЕЛЬОЗ ── */}
        {activeTab === "salmonella" && (
          <div className="rac-content">
            <p className="rac-intro">
              Salmonella є найнебезпечнішою з усіх інфекцій, що можуть
              передаватись від курей до кролів. Кури є безсимптомними носіями і
              забруднюють довкілля постійно — через послід, контамінований корм
              і воду.
            </p>

            <div className="rac-disease-card main">
              <div className="rac-disease-head">
                <span className="rac-disease-badge danger">
                  ГОЛОВНА ЗАГРОЗА
                </span>
                <span className="rac-disease-name">Сальмонельоз кролів</span>
              </div>
              <div className="rac-disease-body">
                <div className="rac-disease-row">
                  <span className="rac-disease-label">Для курей:</span>
                  <p>
                    Salmonella Pullorum, S. Gallinarum, S. Typhimurium та інші
                    серотипи є ендемічними в курячих стадах. Птиця може бути
                    носієм без будь-яких клінічних ознак — виглядає абсолютно
                    здоровою, але постійно виділяє бактерію з посліду.
                  </p>
                </div>
                <div className="rac-disease-row danger-row">
                  <span className="rac-disease-label">
                    Для кроля — клінічна картина:
                  </span>
                  <p>
                    Різка депресія та відмова від корму, профузна діарея (часто
                    геморагічна), висока температура. У вагітних самок — аборти
                    та загибель плодів. Септицемія розвивається за 24–48 годин
                    після появи перших ознак. Без лікування — загибель.
                  </p>
                </div>
                <div className="rac-disease-row danger-row">
                  <span className="rac-disease-label">Летальність:</span>
                  <p>
                    Понад 90% навіть при лікуванні. Антибіотики за антибіограмою
                    (часто висока резистентність). Підтримувальна терапія:
                    регідратація, симптоматика. Зоонозний ризик для людей —
                    обов'язкові заходи особистої гігієни.
                  </p>
                </div>
                <div className="rac-disease-row">
                  <span className="rac-disease-label">Шляхи передачі:</span>
                  <p>
                    Послід курей → забруднений корм або вода → оральне зараження
                    кроля. Достатньо одноразового доступу курей до напувалки або
                    годівниці кролів. Контамінована підстилка — також джерело.
                  </p>
                </div>
              </div>
              <div className="rac-alert warn">
                ⚠️ Єдина надійна профілактика — повне просторове розділення.
                Жоден ветеринарний препарат не замінює відсутність контакту.
              </div>
            </div>

            <div className="rac-cards-grid">
              <div className="rac-card danger">
                <div className="rac-card-header">
                  <span>🩺</span>
                  <span>Діагностика</span>
                </div>
                <p>
                  Бактеріологічний посів з посліду або крові. При підозрі —
                  негайна ізоляція хворої тварини та звернення до ветеринара.
                  Посмертна діагностика: некроз лімфовузлів,
                  гепатоспленомегалія.
                </p>
              </div>
              <div className="rac-card danger">
                <div className="rac-card-header">
                  <span>🧪</span>
                  <span>Чи можна перевірити курей?</span>
                </div>
                <p>
                  Аналіз курей на сальмонельоз перед підселенням бажаний, але не
                  дає 100% гарантії — носійство може бути переривчастим. Навіть
                  «чиста» птиця може стати носієм пізніше.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── ПАСТЕРЕЛЬОЗ ── */}
        {activeTab === "pasteurella" && (
          <div className="rac-content">
            <p className="rac-intro">
              Pasteurella multocida є патогеном, що уражає обидва види — і
              кролів, і курей. Але клінічна картина різна, а міжвидовий обмін
              штамами підтверджений генетично.
            </p>

            <div className="rac-compare-grid">
              <div className="rac-compare-card rabbit">
                <span className="rac-compare-header">
                  🐇 Пастерельоз кролів
                </span>
                <div className="rac-compare-item">
                  <span>Ринорея («нежить»), чхання</span>
                </div>
                <div className="rac-compare-item">
                  <span>Кон'юнктивіт, отит</span>
                </div>
                <div className="rac-compare-item">
                  <span>Пневмонія при поширенні</span>
                </div>
                <div className="rac-compare-item">
                  <span>Підшкірні абсцеси</span>
                </div>
                <div className="rac-compare-item">
                  <span>Носійство без симптомів у 20–60% здорових тварин</span>
                </div>
              </div>
              <div className="rac-compare-card guinea">
                <span className="rac-compare-header">
                  🐓 Пташина холера (Fowl Cholera)
                </span>
                <div className="rac-compare-item">
                  <span>Гостра форма: раптова загибель без симптомів</span>
                </div>
                <div className="rac-compare-item">
                  <span>Хронічна: опухання суглобів, хрипи</span>
                </div>
                <div className="rac-compare-item">
                  <span>Виділення з носа та очей</span>
                </div>
                <div className="rac-compare-item">
                  <span>Зниження яйценосності</span>
                </div>
                <div className="rac-compare-item">
                  <span>Висока летальність при гострій формі</span>
                </div>
              </div>
            </div>

            <div className="rac-disease-card main">
              <div className="rac-disease-head">
                <span className="rac-disease-badge danger">
                  ПІДТВЕРДЖЕНО НАУКОВО
                </span>
                <span className="rac-disease-name">
                  Міжвидовий обмін Pasteurella
                </span>
              </div>
              <div className="rac-disease-body">
                <div className="rac-disease-row danger-row">
                  <span className="rac-disease-label">
                    Дослідження 2025 (Scientific Reports / Nature):
                  </span>
                  <p>
                    Ізоляти P. multocida від кролів і курей, що утримувались в
                    одному господарстві, виявились генетично спорідненими при
                    MLST-типуванні. Це підтверджує реальний міжвидовий обмін
                    збудником — а не просто паралельне носійство різних штамів.
                  </p>
                </div>
                <div className="rac-disease-row">
                  <span className="rac-disease-label">
                    Практичний висновок:
                  </span>
                  <p>
                    Спалах пастерельозу в курей може бути пов'язаний з кролями і
                    навпаки. При загибелі курей від пташиної холери —
                    обов'язковий огляд кролів на ознаки пастерельозу, і навпаки.
                  </p>
                </div>
                <div className="rac-disease-row">
                  <span className="rac-disease-label">Шляхи передачі:</span>
                  <p>
                    Аерозольно (дихальні краплі при чханні), через
                    контамінований корм, воду, підстилку, спільний інвентар. При
                    спільному утриманні — постійний двосторонній обмін.
                  </p>
                </div>
              </div>
            </div>

            <div className="rac-alert warn">
              ⚠️ Аміак у погано вентильованому приміщенні подразнює слизові
              оболонки дихальних шляхів і суттєво підвищує сприйнятливість до
              Pasteurella. Кури виробляють значно більше аміаку ніж кролі — це
              окремий ризик при спільному утриманні.
            </div>
          </div>
        )}

        {/* ── КОКЦИДІОЗ ── */}
        {activeTab === "coccidiosis" && (
          <div className="rac-content">
            <p className="rac-intro">
              Кокцидіоз від курей до кролів — одне з найпоширеніших помилкових
              тверджень у кролівництві. Розберемо що підтверджується наукою, а
              що є міфом.
            </p>

            <div className="rac-cards-grid">
              <div className="rac-card ok">
                <div className="rac-card-header">
                  <span>✅</span>
                  <span>Що підтверджує наука</span>
                </div>
                <p>
                  Eimeria є строго видоспецифічними — це фундаментальний
                  паразитологічний факт. Штами кролів (E. stiedae, E. magna, E.
                  intestinalis та інші) не здатні завершити свій життєвий цикл в
                  організмі курей. Штами курей (E. tenella, E. necatrix, E.
                  acervulina та інші) не заражають кролів. Merck Veterinary
                  Manual: «Coccidia are host-species specific».
                </p>
              </div>
              <div className="rac-card danger">
                <div className="rac-card-header">
                  <span>❌</span>
                  <span>Поширений міф</span>
                </div>
                <p>
                  «Кури заражають кролів кокцидіозом» — це не відповідає
                  дійсності. Ооцисти Eimeria з посліду курей, потрапляючи в
                  організм кроля, не розвиваються і виводяться без будь-яких
                  наслідків. Застосовувати антикокцидійні препарати
                  «профілактично» через присутність курей — невиправдано.
                </p>
              </div>
            </div>

            <div className="rac-disease-card main">
              <div className="rac-disease-head">
                <span className="rac-disease-badge caution">
                  ВАЖЛИВЕ УТОЧНЕННЯ
                </span>
                <span className="rac-disease-name">
                  Непрямий вплив — реальний
                </span>
              </div>
              <div className="rac-disease-body">
                <div className="rac-disease-row">
                  <span className="rac-disease-label">Механізм:</span>
                  <p>
                    Хоча кури не передають свої Eimeria кролям, спільне
                    забруднене середовище підвищує загальне навантаження ооцист
                    у зовнішньому середовищі. Волога підстилка, переущільнення,
                    стрес — умови що сприяють розвитку кокцидіозу у кролів
                    власними штамами.
                  </p>
                </div>
                <div className="rac-disease-row">
                  <span className="rac-disease-label">
                    Практичний висновок:
                  </span>
                  <p>
                    Кури не є прямим джерелом кокцидіозу для кролів. Але спільне
                    утримання погіршує санітарні умови, що непрямо підвищує
                    захворюваність кролів на кокцидіоз — власними збудниками.
                    Профілактика: суха підстилка, дезінфекція, роздільне
                    утримання — а не антикокцидійні препарати «від курей».
                  </p>
                </div>
              </div>
            </div>

            <div className="rac-note">
              <p>
                Соліцокс (толтразурил 2,5%) та Байкокс застосовуються при
                кокцидіозі кролів у дозі 2 мл/л води протягом 2 діб. Але
                показання — клінічні ознаки або контакт з хворими кролями, а не
                факт сусідства з курми.
              </p>
            </div>

            <div className="rac-source">
              📚 Merck Veterinary Manual — Overview of Coccidiosis in Animals;
              PMC/PubMed — Eimeria species and host specificity (multiple
              studies)
            </div>
          </div>
        )}

        {/* ── ІНШІ РИЗИКИ ── */}
        {activeTab === "other" && (
          <div className="rac-content">
            <p className="rac-intro">
              Окрім Salmonella та Pasteurella, спільне утримання кролів і курей
              несе ряд менш очевидних, але реальних ризиків.
            </p>

            <div className="rac-cards-grid">
              <div className="rac-card danger">
                <div className="rac-card-header">
                  <span>🪰</span>
                  <span>Міаз (муховий удар)</span>
                </div>
                <p>
                  Послід курей приваблює мух значно більше ніж послід кролів.
                  Спільне утримання різко підвищує ризик міазу у кролів влітку.
                  Calliphora та Lucilia spp. відкладають яйця у забруднену
                  шерсть або рани. Розвиток личинок — за 12–24 години, летально
                  без лікування.
                </p>
              </div>
              <div className="rac-card danger">
                <div className="rac-card-header">
                  <span>🌡️</span>
                  <span>Аміак: хронічна дихальна загроза</span>
                </div>
                <p>
                  Кури виробляють значно більше аміаку ніж кролі. Аміак
                  подразнює слизову оболонку верхніх дихальних шляхів кролів,
                  знижує місцевий імунітет і суттєво підвищує сприйнятливість до
                  Pasteurella та інших респіраторних патогенів. Навіть без
                  прямого контакту — спільне приміщення небезпечне.
                </p>
              </div>
              <div className="rac-card danger">
                <div className="rac-card-header">
                  <span>🍽️</span>
                  <span>Харчова несумісність</span>
                </div>
                <p>
                  Курячий корм містить надмірний рівень протеїну (16–20%) для
                  кролів. Якщо кролі поїдають курячий комбікорм —
                  ентеротоксемія, порушення мікрофлори сліпої кишки. Кури їдять
                  гранули кролів — менш небезпечно, але конкурують за корм і
                  забруднюють його.
                </p>
              </div>
              <div className="rac-card danger">
                <div className="rac-card-header">
                  <span>🕷️</span>
                  <span>Dermanyssus gallinae (червоний кліщ)</span>
                </div>
                <p>
                  Курячий червоний кліщ при спільному утриманні активно атакує
                  кролів в нічний час. Спричиняє анемію, свербіж, занепокоєння,
                  зниження продуктивності. При масивній інвазії — летально для
                  молодняку.
                </p>
              </div>
              <div className="rac-card">
                <div className="rac-card-header">
                  <span>🐔</span>
                  <span>Поведінкова агресія курей</span>
                </div>
                <p>
                  Кури можуть агресивно клювати кролів, особливо молодняк.
                  Вразливі зони — очі, вуха, основа вух. Клювання може
                  спричинити рани, через які розвиваються вторинні бактеріальні
                  інфекції.
                </p>
              </div>
              <div className="rac-card">
                <div className="rac-card-header">
                  <span>💧</span>
                  <span>Забруднення води</span>
                </div>
                <p>
                  Кури систематично забруднюють посліду напувалки та кориті з
                  водою — це головний механічний шлях передачі Salmonella.
                  Закриті ніпельні напувалки для кролів, недоступні для курей —
                  обов'язкова умова при будь-якому суміжному утриманні.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── ЯКЩО ВЖЕ РАЗОМ ── */}
        {activeTab === "rules" && (
          <div className="rac-content">
            <div className="rac-note">
              <p>
                Якщо умови господарства не дозволяють повного розділення —
                мінімізуйте ризики суворими організаційними заходами. Нижче
                обов'язковий мінімум, а не рекомендації.
              </p>
            </div>

            <div className="rac-rules-list">
              <div className="rac-rule">
                <span className="rac-rule-icon">🏗️</span>
                <div>
                  <span className="rac-rule-title">
                    Фізичне розділення просторів — першочергово
                  </span>
                  <p>
                    Кролі та кури не повинні мати доступу до спільної площі.
                    Навіть суміжні клітки з сітковим бар'єром — значно краще ніж
                    спільний вигул. Висота бар'єру — мінімум 50 см, щоб кури не
                    перелітали до зони кролів.
                  </p>
                </div>
              </div>
              <div className="rac-rule">
                <span className="rac-rule-icon">💧</span>
                <div>
                  <span className="rac-rule-title">
                    Окремі ніпельні напувалки для кролів — обов'язково
                  </span>
                  <p>
                    Закриті ніпельні системи, недоступні для курей. Кури не
                    повинні мати жодного доступу до води кролів — це головний
                    шлях передачі Salmonella. Відкриті миски — неприйнятно.
                  </p>
                </div>
              </div>
              <div className="rac-rule">
                <span className="rac-rule-icon">🍽️</span>
                <div>
                  <span className="rac-rule-title">
                    Окремі годівниці, недоступні для курей
                  </span>
                  <p>
                    Корм кролів — у закритих бункерних годівницях або за
                    бар'єром. Кури не повинні мати доступу до гранул чи сіна
                    кролів — забруднення посліду є постійним.
                  </p>
                </div>
              </div>
              <div className="rac-rule">
                <span className="rac-rule-icon">🧹</span>
                <div>
                  <span className="rac-rule-title">
                    Щоденне прибирання посліду — особливо в зоні кролів
                  </span>
                  <p>
                    Послід курей видаляти окремо від посліду кролів. Підстилка
                    має бути сухою — волога підвищує концентрацію патогенів і
                    рівень аміаку. Засоби інвентарю — окремі для кожного виду.
                  </p>
                </div>
              </div>
              <div className="rac-rule">
                <span className="rac-rule-icon">💨</span>
                <div>
                  <span className="rac-rule-title">
                    Вентиляція приміщення — критичний фактор
                  </span>
                  <p>
                    Рівень аміаку в кролятнику не повинен перевищувати 25 ppm
                    (поріг відчуття запаху для людини — 5 ppm). Якщо ви
                    відчуваєте запах аміаку — для кролів це вже шкідливо. При
                    суміжному утриманні з курми — посилена вентиляція
                    обов'язкова.
                  </p>
                </div>
              </div>
              <div className="rac-rule">
                <span className="rac-rule-icon">🔒</span>
                <div>
                  <span className="rac-rule-title">
                    Карантин нових курей — мінімум 30 днів
                  </span>
                  <p>
                    Нові кури — найбільш ймовірне джерело занесення Salmonella і
                    нових штамів Pasteurella. Карантин в окремому приміщенні,
                    аналіз посліду на сальмонельоз перед підселенням — бажано.
                  </p>
                </div>
              </div>
              <div className="rac-rule">
                <span className="rac-rule-icon">🪰</span>
                <div>
                  <span className="rac-rule-title">
                    Профілактика мух — у теплий сезон щодня
                  </span>
                  <p>
                    Сітки на вікна і двері, пастки для мух, своєчасне прибирання
                    посліду. Будь-яке поранення або забруднення шерсті у кроля —
                    огляд двічі на день. Міаз розвивається за 12–24 години.
                  </p>
                </div>
              </div>
              <div className="rac-rule">
                <span className="rac-rule-icon">🩺</span>
                <div>
                  <span className="rac-rule-title">
                    При будь-яких ознаках хвороби — негайна ізоляція
                  </span>
                  <p>
                    Відмова від їжі, діарея, виділення з носа у кроля при
                    суміжному утриманні з курми — негайна ізоляція і
                    консультація ветеринара. При сальмонельозі рахунок іде на
                    години.
                  </p>
                </div>
              </div>
            </div>

            <div className="rac-alert tip">
              💡 Найнадійніша профілактика — повне просторове розділення в
              окремі приміщення. Якщо це неможливо — суворе дотримання всіх
              правил вище, регулярний ветеринарний моніторинг і нульова
              толерантність до порушень санітарного режиму.
            </div>

            <div className="rac-source">
              📚 Merck Veterinary Manual — Salmonellosis, Pasteurellosis in
              Rabbits; eXtension Poultry — Interaction of Chickens with Other
              Species; Scientific Reports 2025 — P. multocida cross-species
              transmission; PMC/PubMed — Eimeria host specificity
            </div>
          </div>
        )}

        {/* ЧИТАЙТЕ ТАКОЖ */}
        <div className="rac-related">
          <h3 className="rac-related-title">Читайте також</h3>
          <div className="rac-related-grid">
            <Link to="/rabbits-and-predators" className="rac-related-link">
              🐈🐕 Кролі, коти та собаки
            </Link>
            <Link to="/rabbits-and-guinea-pigs" className="rac-related-link">
              🐹 Кролі та морські свинки
            </Link>
            <Link to="/parasites" className="rac-related-link">
              🦟 Паразити
            </Link>
            <Link to="/seasonal-summer" className="rac-related-link">
              ☀️ Літо: міаз (личинки мух)
            </Link>
            <Link to="/biosecurity" className="rac-related-link">
              🛡️ Біобезпека та карантин
            </Link>
          </div>
        </div>

        <div className="rac-back">
          <Link to="/" className="rac-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Назва цієї сторінки" />
        </div>
      </div>
    </main>
  );
};

export default RabbitsAndChickens;
