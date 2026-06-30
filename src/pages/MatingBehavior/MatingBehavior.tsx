import { useState } from "react";
import { Link } from "react-router-dom";
import "./MatingBehavior.css";
import ShareButton from "../../components/ShareButton/ShareButton";

type TabId = "basics" | "doe" | "buck" | "fight" | "pseudo" | "checklist";

const tabs: { id: TabId; icon: string; label: string }[] = [
  { id: "basics", icon: "📖", label: "Як це відбувається" },
  { id: "doe", icon: "🐰", label: "Самка не криється" },
  { id: "buck", icon: "🐇", label: "Проблеми самця" },
  { id: "fight", icon: "⚔️", label: "Бійки та агресія" },
  { id: "pseudo", icon: "🥚", label: "Хибна вагітність" },
  { id: "checklist", icon: "✅", label: "Чеклист злучки" },
];

const MatingBehavior = () => {
  const [activeTab, setActiveTab] = useState<TabId>("basics");

  return (
    <main className="mb-page">
      <div className="mb-header">
        <h1>🐇 Поведінка при злучці</h1>
        <p>Чому не криється, б'ються, пищить — від А до Я</p>
      </div>

      <div className="mb-wrap">
        <div className="mb-banner">
          <span>💡</span>
          <div>
            Більшість проблем при злучці — не хвороба і не «поганий кріль». Це
            нормальна поведінка, яку просто треба правильно розпізнати і знати
            що робити далі.
          </div>
        </div>

        <div className="mb-tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`mb-tab ${activeTab === t.id ? "active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* ── ЯК ЦЕ ВІДБУВАЄТЬСЯ ── */}
        {activeTab === "basics" && (
          <div className="mb-content">
            <div className="mb-note">
              <p>
                Кролі — індуковані овулятори. Це означає що овуляція у самки
                відбувається не циклічно (як у корів чи свиней), а у відповідь
                на стимул — статевий акт або навіть просто присутність самця.
                Саме тому у кролів немає чіткого «тічкового циклу» — самка може
                бути готова до злучки в будь-який час, але ступінь готовності
                змінюється.
              </p>
            </div>

            <h3 className="mb-sub-title">Як виглядає нормальна злучка</h3>
            <div className="mb-steps">
              <div className="mb-step">
                <span className="mb-step-num">1</span>
                <div>
                  <span className="mb-step-title">
                    Самку несуть до самця — не навпаки
                  </span>
                  <p>
                    Самка в своїй клітці — господиня. Якщо принести самця до
                    неї, вона буде захищати територію і може атакувати його.
                    Самець у чужій клітці відволікається на обнюхування і мітку.
                    Завжди несіть самку до самця.
                  </p>
                </div>
              </div>
              <div className="mb-step">
                <span className="mb-step-num">2</span>
                <div>
                  <span className="mb-step-title">
                    Перші хвилини — обнюхування
                  </span>
                  <p>
                    Самець обнюхує самку, може бігати навколо. Самка, якщо
                    готова, підіймає крупом і приймає позицію «лордозу» —
                    опускає голову і піднімає задню частину. Це сигнал
                    готовності.
                  </p>
                </div>
              </div>
              <div className="mb-step">
                <span className="mb-step-num">3</span>
                <div>
                  <span className="mb-step-title">Садка — швидко</span>
                  <p>
                    Самець сідлає самку і робить кілька рухів. Весь акт займає
                    10–30 секунд. Ознака завершеної садки — самець падає набік
                    або назад і може видати короткий писк або характерний звук.
                    Це норма.
                  </p>
                </div>
              </div>
              <div className="mb-step">
                <span className="mb-step-num">4</span>
                <div>
                  <span className="mb-step-title">
                    Контрольна злучка через 8–12 годин
                  </span>
                  <p>
                    Одна садка не гарантує запліднення. Рекомендується провести
                    контрольну злучку через 8–12 годин після першої. Це підвищує
                    відсоток запліднення.
                  </p>
                </div>
              </div>
              <div className="mb-step">
                <span className="mb-step-num">5</span>
                <div>
                  <span className="mb-step-title">Самку повертають одразу</span>
                  <p>
                    Не залишайте самку з самцем надовго без нагляду. Після
                    завершених садок — повертайте самку в її клітку. Агресивний
                    самець і нерецептивна самка можуть серйозно травмувати одне
                    одного.
                  </p>
                </div>
              </div>
            </div>

            <h3 className="mb-sub-title">Ознаки готовності самки</h3>
            <div className="mb-cards-grid">
              <div className="mb-card ok">
                <span className="mb-card-icon">✅</span>
                <div>
                  <span className="mb-card-title">Готова до злучки</span>
                  <p>
                    Вульва червоно-фіолетова, злегка набрякла і волога. Самка
                    активна, тре підборіддям об предмети, піднімає крупом при
                    дотику до спини. Може «тупотіти» лапами.
                  </p>
                </div>
              </div>
              <div className="mb-card warn">
                <span className="mb-card-icon">⏳</span>
                <div>
                  <span className="mb-card-title">Не зовсім готова</span>
                  <p>
                    Вульва рожево-біла, суха або злегка рожева. Самка байдужа
                    або ховається. Краще почекати 2–3 дні і спробувати знову.
                  </p>
                </div>
              </div>
              <div className="mb-card danger">
                <span className="mb-card-icon">❌</span>
                <div>
                  <span className="mb-card-title">Не готова</span>
                  <p>
                    Вульва бліда, суха, біла. Самка тікає, сідає на підлогу,
                    кусає самця. Злучка зараз — стрес і ризик травм. Поверніть
                    самку і спробуйте через 3–4 дні.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-alert tip">
              💡 Перевірити готовність просто: покладіть долоню на спину самки і
              злегка натисніть. Готова самка підіймає крупом і завмирає.
              Неготова — тікає або притискається до підлоги.
            </div>
          </div>
        )}

        {/* ── САМКА НЕ КРИЄТЬСЯ ── */}
        {activeTab === "doe" && (
          <div className="mb-content">
            <p className="mb-intro">
              Відмова самки від злучки — найпоширеніша проблема. У більшості
              випадків це не хвороба і не характер, а конкретна причина яку
              можна усунути.
            </p>

            <div className="mb-problems">
              <div className="mb-problem-card">
                <div className="mb-problem-head">
                  <span>🚫</span>
                  <span className="mb-problem-title">
                    Самка тікає і ховається в куток
                  </span>
                </div>
                <div className="mb-problem-body">
                  <div className="mb-problem-cause">
                    <span>Причина:</span> Самка не готова до злучки — вульва
                    блідо-рожева або біла. Або самка перебуває в стані хибної
                    вагітності (16–18 днів після попередньої злучки або
                    самомонтажу).
                  </div>
                  <div className="mb-problem-fix">
                    <span>Що робити:</span> Поверніть самку. Перевірте колір
                    вульви. Спробуйте через 3–4 дні. Якщо підозрюєте хибну
                    вагітність — зачекайте 18–20 днів після початку симптомів.
                  </div>
                </div>
              </div>

              <div className="mb-problem-card">
                <div className="mb-problem-head">
                  <span>😤</span>
                  <span className="mb-problem-title">
                    Самка притискається до підлоги і не дає садку
                  </span>
                </div>
                <div className="mb-problem-body">
                  <div className="mb-problem-cause">
                    <span>Причина:</span> Класична поведінка нерецептивної
                    самки. Притискання до підлоги — сигнал «ні». Іноді буває у
                    самок, що вже вагітні після попередньої злучки.
                  </div>
                  <div className="mb-problem-fix">
                    <span>Що робити:</span> Не форсуйте. Поверніть самку. Якщо
                    підозрюєте вагітність — пропальпуйте на 14–15 день після
                    попередньої злучки. Якщо не вагітна — спробуйте злучку з
                    іншим самцем.
                  </div>
                </div>
              </div>

              <div className="mb-problem-card">
                <div className="mb-problem-head">
                  <span>⚖️</span>
                  <span className="mb-problem-title">
                    Самка ніколи не криється — хронічна відмова
                  </span>
                </div>
                <div className="mb-problem-body">
                  <div className="mb-problem-cause">
                    <span>Причина:</span> Ожиріння — найпоширеніша причина
                    хронічної відмови. Надлишок жиру порушує гормональний баланс
                    і знижує лібідо. Також можливі: гормональний збій, кіста
                    яєчників, ендометрит. За даними MSU Extension — ожиріння і
                    тривала пауза у розведенні є основними причинами коли самка
                    не вагітніє після злучки.
                  </div>
                  <div className="mb-problem-fix">
                    <span>Що робити:</span> Оцініть вгодованість — у нормі ребра
                    промацуються легко. Скоротіть зерно, збільшіть рух.
                    Спробуйте злучку з різними самцями. Якщо після 3–4 спроб з
                    двома самцями за 3 тижні — результату немає, зверніться до
                    ветеринара або розгляньте вибраковку.
                  </div>
                </div>
              </div>

              <div className="mb-problem-card">
                <div className="mb-problem-head">
                  <span>🌡️</span>
                  <span className="mb-problem-title">
                    Відмова влітку або восени
                  </span>
                </div>
                <div className="mb-problem-body">
                  <div className="mb-problem-cause">
                    <span>Причина:</span> Сезонне зниження репродуктивної
                    активності. Кролі природно знижують готовність до злучки при
                    скорочені светлового дня (пізнє літо, осінь) і при тривалому
                    перегріві. При температурі вище +28°C самці можуть тимчасово
                    ставати безплідними.
                  </div>
                  <div className="mb-problem-fix">
                    <span>Що робити:</span> Штучне освітлення 14–16 годин на
                    добу стимулює репродуктивну активність. Охолодіть
                    приміщення. Влітку плануйте злучки на ранок —
                    найпрохолодніший час доби.
                  </div>
                </div>
              </div>

              <div className="mb-problem-card">
                <div className="mb-problem-head">
                  <span>😰</span>
                  <span className="mb-problem-title">
                    Самка кусає самця при спробі садки
                  </span>
                </div>
                <div className="mb-problem-body">
                  <div className="mb-problem-cause">
                    <span>Причина:</span> Самка не готова і активно захищається.
                    Може бути в стані хибної вагітності або рання справжня
                    вагітність. Іноді — особистісна несумісність з конкретним
                    самцем.
                  </div>
                  <div className="mb-problem-fix">
                    <span>Що робити:</span> Негайно розсадіть. Спробуйте через
                    3–4 дні або з іншим самцем. Ніколи не залишайте агресивну
                    самку з самцем без нагляду — вона може серйозно покалічити
                    його.
                  </div>
                  <div className="mb-problem-alert warn">
                    ⚠️ Агресивна нерецептивна самка, залишена наодинці з самцем,
                    може кастрирувати його укусом.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── ПРОБЛЕМИ САМЦЯ ── */}
        {activeTab === "buck" && (
          <div className="mb-content">
            <p className="mb-intro">
              Проблеми з боку самця зустрічаються рідше, але теж трапляються.
              Розуміти їх важливо щоб не втрачати час і не підозрювати самку
              коли проблема в самці.
            </p>

            <div className="mb-problems">
              <div className="mb-problem-card">
                <div className="mb-problem-head">
                  <span>😴</span>
                  <span className="mb-problem-title">
                    Самець не проявляє інтересу
                  </span>
                </div>
                <div className="mb-problem-body">
                  <div className="mb-problem-cause">
                    <span>Причина:</span> Ожиріння — найпоширеніша причина.
                    Надмірна вгодованість знижує лібідо у самців так само як і у
                    самок. Також: перегрів (при t° вище +28°C протягом 5+ днів
                    самець може стати тимчасово безплідним на 60–90 днів), вік
                    (молодший за 5 місяців або старший за 3 роки), хвороба,
                    стрес від нового середовища.
                  </div>
                  <div className="mb-problem-fix">
                    <span>Що робити:</span> Перевірте вгодованість і умови
                    утримання. Молодого самця спочатку зводьте з досвідченою та
                    рецептивною самкою — успішний досвід підвищує активність.
                    Після перегріву дайте 8–10 тижнів відпочинку перед оцінкою
                    плідності.
                  </div>
                </div>
              </div>

              <div className="mb-problem-card">
                <div className="mb-problem-head">
                  <span>🙈</span>
                  <span className="mb-problem-title">
                    «Сором'язливий самець» — нюхає, але не сідлає
                  </span>
                </div>
                <div className="mb-problem-body">
                  <div className="mb-problem-cause">
                    <span>Причина:</span> Синдром сором'язливого самця.
                    Зустрічається у молодих самців, яких звели з самкою до
                    готовності або у яких перший досвід був негативним —
                    агресивна самка злякала або вкусила. Такий самець обнюхує
                    самку, бігає навколо, але не виконує садку.
                  </div>
                  <div className="mb-problem-fix">
                    <span>Що робити:</span> Зводьте з найспокійнішою і
                    найрецептивнішою самкою зі стада. Не поспішайте. Короткі
                    сесії по 5–10 хвилин краще ніж тривале перебування разом.
                    Успішна злучка з рецептивною самкою відновлює впевненість
                    самця.
                  </div>
                  <div className="mb-problem-alert tip">
                    💡 Самця, якого злякала агресивна самка, можна
                    «реабілітувати» — дайте 1–2 тижні відпочинку, потім зводьте
                    тільки з покірними самками.
                  </div>
                </div>
              </div>

              <div className="mb-problem-card">
                <div className="mb-problem-head">
                  <span>🔊</span>
                  <span className="mb-problem-title">
                    Самець пищить або кричить при садці
                  </span>
                </div>
                <div className="mb-problem-body">
                  <div className="mb-problem-cause">
                    <span>Причина:</span> Це абсолютна норма. Короткий пискливий
                    звук або вокалізація після завершеної садки — природна
                    реакція самця при ейякуляції. Саме так виглядає успішна
                    злучка. Самець падає набік або назад і видає характерний
                    звук.
                  </div>
                  <div className="mb-problem-fix">
                    <span>Що робити:</span> Нічого — злучка відбулась успішно.
                    Зафіксуйте дату. Поверніть самку в клітку. Через 8–12 годин
                    — контрольна злучка.
                  </div>
                </div>
              </div>

              <div className="mb-problem-card">
                <div className="mb-problem-head">
                  <span>🔄</span>
                  <span className="mb-problem-title">
                    Самець сідлає самку з голови або збоку
                  </span>
                </div>
                <div className="mb-problem-body">
                  <div className="mb-problem-cause">
                    <span>Причина:</span> Недосвідченість — частіше у молодих
                    самців. Іноді самець правильно мотивований але неправильно
                    орієнтується.
                  </div>
                  <div className="mb-problem-fix">
                    <span>Що робити:</span> Акуратно поправте самця рукою або
                    спрямуйте самку так, щоб він зайняв правильну позицію.
                    Зазвичай молоді самці навчаються за 2–3 злучки.
                  </div>
                </div>
              </div>

              <div className="mb-problem-card">
                <div className="mb-problem-head">
                  <span>🌡️</span>
                  <span className="mb-problem-title">
                    Самець активний, але заплідненості немає
                  </span>
                </div>
                <div className="mb-problem-body">
                  <div className="mb-problem-cause">
                    <span>Причина:</span> Тимчасова безплідність після
                    перегріву. Самець, що перебував при температурі вище +28°C
                    протягом 5 і більше днів, може залишатись безплідним 60–90
                    днів незважаючи на нормальну активність. Садки є, але сперма
                    нежиттєздатна.
                  </div>
                  <div className="mb-problem-fix">
                    <span>Що робити:</span> Якщо після 3–4 злучок з рецептивними
                    самками жодна не завагітніла — перевірте умови утримання
                    самця. Влітку тримайте плідників у найпрохолоднішому місці
                    кролятника. Охолодження і час вирішують проблему.
                  </div>
                  <div className="mb-problem-alert warn">
                    ⚠️ Старі самці (3+ роки) чутливіші до перегріву і можуть
                    залишатись безплідними до 90 днів після теплового стресу.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── БІЙКИ ── */}
        {activeTab === "fight" && (
          <div className="mb-content">
            <p className="mb-intro">
              Агресія під час злучки — від легкої до небезпечної. Важливо
              розуміти різницю між нормальною грою і справжньою бійкою.
            </p>

            <h3 className="mb-sub-title">Нормальна поведінка vs небезпечна</h3>
            <div className="mb-table-wrap">
              <table className="mb-table">
                <thead>
                  <tr>
                    <th>Поведінка</th>
                    <th>Що це означає</th>
                    <th>Що робити</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Самець женить самку по клітці</td>
                    <td>
                      <span className="mb-badge ok">Норма</span> Залицяння
                    </td>
                    <td>Нічого, дайте 5–10 хвилин</td>
                  </tr>
                  <tr>
                    <td>Самка тікає, але не атакує</td>
                    <td>
                      <span className="mb-badge warn">Норма/не готова</span>
                    </td>
                    <td>Зачекайте або розсадіть</td>
                  </tr>
                  <tr>
                    <td>Самці обнюхують один одного і б'ються</td>
                    <td>
                      <span className="mb-badge danger">Небезпека</span>{" "}
                      Ієрархічна бійка
                    </td>
                    <td>Негайно розсадіть</td>
                  </tr>
                  <tr>
                    <td>Самка кусає самця</td>
                    <td>
                      <span className="mb-badge danger">Небезпека</span> Не
                      готова, агресія
                    </td>
                    <td>Негайно розсадіть</td>
                  </tr>
                  <tr>
                    <td>Самець мітить сечею, кружляє</td>
                    <td>
                      <span className="mb-badge ok">Норма</span> Маркування
                    </td>
                    <td>Нічого</td>
                  </tr>
                  <tr>
                    <td>Обидва рвуть шерсть одне одному</td>
                    <td>
                      <span className="mb-badge danger">Небезпека</span>{" "}
                      Серйозна бійка
                    </td>
                    <td>Негайно розсадіть, огляньте рани</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="mb-sub-title">Чому б'ються і як уникнути</h3>
            <div className="mb-cards-grid">
              <div className="mb-card">
                <span className="mb-card-icon">🏠</span>
                <div>
                  <span className="mb-card-title">Самця принесли до самки</span>
                  <p>
                    Найпоширеніша причина агресії. Самка в своїй клітці захищає
                    територію і атакує будь-якого прибульця. Завжди несіть самку
                    до самця — це базове правило злучки.
                  </p>
                </div>
              </div>
              <div className="mb-card">
                <span className="mb-card-icon">⏰</span>
                <div>
                  <span className="mb-card-title">Залишили разом надовго</span>
                  <p>
                    Після завершення злучки самка стає все менш рецептивною.
                    Через 15–30 хвилин вона може почати атакувати самця.
                    Повертайте самку одразу після 1–2 успішних садок.
                  </p>
                </div>
              </div>
              <div className="mb-card">
                <span className="mb-card-icon">🧬</span>
                <div>
                  <span className="mb-card-title">
                    Несумісність конкретної пари
                  </span>
                  <p>
                    Іноді конкретна самка відкидає конкретного самця навіть коли
                    готова до злучки. Спробуйте іншого самця — часто це вирішує
                    проблему без будь-яких інших дій.
                  </p>
                </div>
              </div>
              <div className="mb-card">
                <span className="mb-card-icon">🐣</span>
                <div>
                  <span className="mb-card-title">Занадто молода самка</span>
                  <p>
                    Самка до 4–4.5 місяців може не розуміти що відбувається і
                    реагувати страхом і агресією. Дочекайтеся статевої зрілості
                    — злучка пройде легше.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-alert warn">
              ⚠️ Ніколи не залишайте двох незнайомих кролів разом без нагляду —
              навіть на 5 хвилин. Бійки відбуваються раптово і можуть спричинити
              серйозні рани за секунди.
            </div>
          </div>
        )}

        {/* ── ХИБНА ВАГІТНІСТЬ ── */}
        {activeTab === "pseudo" && (
          <div className="mb-content">
            <div className="mb-note">
              <p>
                Хибна вагітність (псевдовагітність) — це гормональний стан при
                якому самка поводиться як вагітна, але кроленят немає. Виникає
                тому що кролі є індукованими овуляторами: овуляція відбулась,
                але запліднення — ні. Жовте тіло продовжує виділяти прогестерон,
                імітуючи вагітність. Тривалість — 16–18 днів. Стан не
                небезпечний, але затримує розведення.
              </p>
            </div>

            <h3 className="mb-sub-title">Симптоми хибної вагітності</h3>
            <div className="mb-cards-grid">
              <div className="mb-card">
                <span className="mb-card-icon">🪹</span>
                <div>
                  <span className="mb-card-title">Будує гніздо</span>
                  <p>
                    Збирає солому, тягає сіно в кут. Часто — за 2–3 дні до
                    «уявного окролу» (на 16–18 день). Виглядає переконливо і
                    часто вводить господарів в оману.
                  </p>
                </div>
              </div>
              <div className="mb-card">
                <span className="mb-card-icon">🪶</span>
                <div>
                  <span className="mb-card-title">Вищипує пух з живота</span>
                  <p>
                    Самка вищипує пух з грудей і живота для вистелення гнізда.
                    Це ідентичний симптом справжній вагітності. Відрізнити можна
                    лише пальпацією або підрахунком днів.
                  </p>
                </div>
              </div>
              <div className="mb-card">
                <span className="mb-card-icon">😤</span>
                <div>
                  <span className="mb-card-title">Агресія і захист гнізда</span>
                  <p>
                    Самка активно захищає «своє» гніздо, може кусати при спробі
                    доторкнутись. Відмовляється від злучки на всі 16–18 днів.
                  </p>
                </div>
              </div>
              <div className="mb-card">
                <span className="mb-card-icon">🥛</span>
                <div>
                  <span className="mb-card-title">
                    Збільшення молочних залоз
                  </span>
                  <p>
                    У деяких самок помітно набрякають соски і може з'явитись
                    незначна кількість молока. Проходить само після закінчення
                    псевдовагітності.
                  </p>
                </div>
              </div>
            </div>

            <h3 className="mb-sub-title">Причини хибної вагітності</h3>
            <div className="mb-table-wrap">
              <table className="mb-table">
                <thead>
                  <tr>
                    <th>Причина</th>
                    <th>Пояснення</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>Безплідна злучка</strong>
                    </td>
                    <td>
                      Садка відбулась, овуляція спрацювала, але запліднення не
                      відбулось — через слабку сперму або неточну садку.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Самомонтаж або монтаж іншою самкою</strong>
                    </td>
                    <td>
                      Самки, що живуть разом, можуть сідлати одна одну. Цього
                      достатньо щоб спровокувати овуляцію без запліднення. За
                      даними PMC — поширеність псевдовагітності в господарствах
                      де самки утримуються групами сягає 23%.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Присутність самця поруч</strong>
                    </td>
                    <td>
                      Запах і звуки самця через стінку клітки можуть індукувати
                      овуляцію у самки без прямого контакту.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Гормональний збій</strong>
                    </td>
                    <td>Рідше — виникає спонтанно без зовнішніх стимулів.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="mb-sub-title">
              Як відрізнити від справжньої вагітності
            </h3>
            <div className="mb-cards-grid">
              <div className="mb-card">
                <span className="mb-card-icon">📅</span>
                <div>
                  <span className="mb-card-title">За термінами</span>
                  <p>
                    Хибна вагітність — 16–18 днів. Справжня вагітність — 28–32
                    дні. Якщо на 18–20 день «вагітність» закінчилась без окролу
                    — це була псевдовагітність.
                  </p>
                </div>
              </div>
              <div className="mb-card">
                <span className="mb-card-icon">🖐️</span>
                <div>
                  <span className="mb-card-title">Пальпація на 14–15 день</span>
                  <p>
                    При справжній вагітності на 14–15 день пальпацією можна
                    відчути ембріони — округлі утворення розміром з горошину в
                    матці. При хибній — нічого не прощупується.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-alert tip">
              💡 Якщо самка будує гніздо і ви не впевнені — поставте маточник на
              27-й день від підозрюваної злучки. Якщо це справжня вагітність —
              матимете готове гніздо. Якщо хибна — нічого не станеться.
            </div>

            <div className="mb-alert warn">
              ⚠️ Після закінчення хибної вагітності (на 18–20 день) самка знову
              стає рецептивною і можна відразу проводити злучку.
            </div>
          </div>
        )}

        {/* ── ЧЕКЛИСТ ── */}
        {activeTab === "checklist" && (
          <div className="mb-content">
            <p className="mb-intro">
              Покроковий чеклист для успішної злучки. Збережіть або роздрукуйте.
            </p>

            <div className="mb-checklist">
              <div className="mb-check-section">
                <h3>До злучки</h3>
                <div className="mb-check-item">
                  <span className="mb-check-box">☐</span>
                  <span>
                    Самка досягла потрібного віку — мінімум 4.5–5 місяців для
                    середніх порід
                  </span>
                </div>
                <div className="mb-check-item">
                  <span className="mb-check-box">☐</span>
                  <span>Самець досягнув 5–6 місяців</span>
                </div>
                <div className="mb-check-item">
                  <span className="mb-check-box">☐</span>
                  <span>
                    Обидва у нормальній вгодованості — не ожирілі, не виснажені
                  </span>
                </div>
                <div className="mb-check-item">
                  <span className="mb-check-box">☐</span>
                  <span>
                    Вульва самки перевірена — червоно-фіолетова і волога
                  </span>
                </div>
                <div className="mb-check-item">
                  <span className="mb-check-box">☐</span>
                  <span>
                    Злучка планується вранці або ввечері — не в пік спеки
                  </span>
                </div>
                <div className="mb-check-item">
                  <span className="mb-check-box">☐</span>
                  <span>Самка і самець — не близькі родичі</span>
                </div>
              </div>

              <div className="mb-check-section">
                <h3>Під час злучки</h3>
                <div className="mb-check-item">
                  <span className="mb-check-box">☐</span>
                  <span>Самку несуть до самця — не навпаки</span>
                </div>
                <div className="mb-check-item">
                  <span className="mb-check-box">☐</span>
                  <span>
                    Спостерігаєте весь процес — не залишаєте без нагляду
                  </span>
                </div>
                <div className="mb-check-item">
                  <span className="mb-check-box">☐</span>
                  <span>
                    Чекаєте 1–2 успішних садки (самець впав набік, пискнув)
                  </span>
                </div>
                <div className="mb-check-item">
                  <span className="mb-check-box">☐</span>
                  <span>Після садок — повертаєте самку в її клітку</span>
                </div>
                <div className="mb-check-item">
                  <span className="mb-check-box">☐</span>
                  <span>Записуєте дату злучки одразу</span>
                </div>
              </div>

              <div className="mb-check-section">
                <h3>Після злучки</h3>
                <div className="mb-check-item">
                  <span className="mb-check-box">☐</span>
                  <span>Контрольна злучка через 8–12 годин</span>
                </div>
                <div className="mb-check-item">
                  <span className="mb-check-box">☐</span>
                  <span>
                    Пальпація на 14–15 день для підтвердження вагітності
                  </span>
                </div>
                <div className="mb-check-item">
                  <span className="mb-check-box">☐</span>
                  <span>Маточник ставиться на 27-й день після злучки</span>
                </div>
                <div className="mb-check-item">
                  <span className="mb-check-box">☐</span>
                  <span>
                    Очікуваний окріл: 28–32 дні після злучки (найчастіше 31-й
                    день)
                  </span>
                </div>
                <div className="mb-check-item">
                  <span className="mb-check-box">☐</span>
                  <span>Перевірка гнізда через 12–24 години після окролу</span>
                </div>
              </div>
            </div>

            <h3 className="mb-sub-title">
              Коли злучка точно не відбулась — і треба повторити
            </h3>
            <div className="mb-table-wrap">
              <table className="mb-table">
                <thead>
                  <tr>
                    <th>Ситуація</th>
                    <th>Коли повторювати</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Самка відмовила, розсаджені</td>
                    <td>Через 3–4 дні</td>
                  </tr>
                  <tr>
                    <td>Самець не виявив інтересу</td>
                    <td>Через 2–3 дні, інша самка</td>
                  </tr>
                  <tr>
                    <td>Підозра на хибну вагітність</td>
                    <td>Через 18–20 днів від початку симптомів</td>
                  </tr>
                  <tr>
                    <td>Пальпація на 14 день — пусто</td>
                    <td>Відразу або через 3–4 дні</td>
                  </tr>
                  <tr>
                    <td>Після перегріву самця</td>
                    <td>Через 8–10 тижнів</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        <section className="mb-related-section">
          <div className="mb-container">
            <h3 className="mb-related-title">Читайте також</h3>
            <div className="mb-related-grid">
              <Link to="/doe-preparation" className="mb-related-link">
                ♀️ Підготовка самки до злучки
              </Link>
              <Link to="/false-pregnancy" className="mb-related-link">
                🥚 Хибна вагітність
              </Link>
              <Link to="/okril-control" className="mb-related-link">
                📅 Контроль дат окролу
              </Link>
              <Link to="/rabbit-body-condition" className="mb-related-link">
                ⚖️ Кондиція тіла (BCS)
              </Link>
              <Link to="/mating-frequency" className="mb-related-link">
                🔁 Частота злучування
              </Link>
            </div>
          </div>
        </section>

        <div className="mb-back">
          <Link to="/" className="mb-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Назва цієї сторінки" />
        </div>
      </div>
    </main>
  );
};

export default MatingBehavior;
