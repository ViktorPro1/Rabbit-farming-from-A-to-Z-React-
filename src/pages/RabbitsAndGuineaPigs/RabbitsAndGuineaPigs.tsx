import { useState } from "react";
import { Link } from "react-router-dom";
import "./RabbitsAndGuineaPigs.css";

type TabId =
  | "verdict"
  | "diseases"
  | "diet"
  | "behavior"
  | "housing"
  | "rules"
  | "indicator";

const tabs: { id: TabId; icon: string; label: string }[] = [
  { id: "verdict", icon: "⚖️", label: "Головний висновок" },
  { id: "diseases", icon: "🦠", label: "Хвороби" },
  { id: "diet", icon: "🥗", label: "Харчування" },
  { id: "behavior", icon: "🐾", label: "Поведінка" },
  { id: "housing", icon: "🏠", label: "Житло" },
  { id: "rules", icon: "📋", label: "Якщо вже разом" },
  { id: "indicator", icon: "🐦", label: "Свинка як індикатор" },
];

const RabbitsAndGuineaPigs = () => {
  const [activeTab, setActiveTab] = useState<TabId>("verdict");

  return (
    <main className="ragp-page">
      <div className="ragp-header">
        <h1>🐇🐹 Кролі та морські свинки разом</h1>
        <p>Перевірена інформація — чи можна тримати, які ризики і що робити</p>
      </div>

      <div className="ragp-wrap">
        <div className="ragp-banner">
          <span>⚠️</span>
          <div>
            Більшість ветеринарних організацій світу — RSPCA, RWAF, Merck
            Veterinary Manual — <strong>не рекомендують</strong> тримати кролів
            і морських свинок разом. Але якщо вони вже живуть разом роками і
            здорові — розлучення теж стрес. Ця сторінка допоможе зрозуміти
            ризики і як їх мінімізувати.
          </div>
        </div>

        <div className="ragp-tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`ragp-tab ${activeTab === t.id ? "active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* ── ГОЛОВНИЙ ВИСНОВОК ── */}
        {activeTab === "verdict" && (
          <div className="ragp-content">
            <div className="ragp-verdict-grid">
              <div className="ragp-verdict-card no">
                <div className="ragp-verdict-icon">❌</div>
                <span className="ragp-verdict-title">Разом у клітці</span>
                <p>Не рекомендується. Різні потреби, ризик хвороб і травм.</p>
              </div>
              <div className="ragp-verdict-card caution">
                <div className="ragp-verdict-icon">⚠️</div>
                <span className="ragp-verdict-title">
                  Спільна кімната / сарай
                </span>
                <p>
                  Ризиковано. Bordetella передається повітрям на близькій
                  відстані.
                </p>
              </div>
              <div className="ragp-verdict-card ok">
                <div className="ragp-verdict-icon">✅</div>
                <span className="ragp-verdict-title">
                  Окремі клітки з відстанню
                </span>
                <p>Прийнятно при хорошій вентиляції і дотриманні гігієни.</p>
              </div>
              <div className="ragp-verdict-card ok">
                <div className="ragp-verdict-icon">✅</div>
                <span className="ragp-verdict-title">
                  Наглядові прогулянки разом
                </span>
                <p>Можливо під постійним наглядом на нейтральній території.</p>
              </div>
            </div>

            <h3 className="ragp-sub-title">
              Чому так вийшло — коротка історія
            </h3>
            <div className="ragp-note">
              <p>
                Кролів і морських свинок почали тримати разом десятки років тому
                з однієї простої причини: щоб забезпечити компанію кролю без
                ризику небажаної вагітності (різні види не схрещуються). Це
                здавалось логічним — обидва їдять сіно, обидва маленькі, обидва
                тихі. Але з часом ветеринарна наука виявила серйозні проблеми,
                про які не знали раніше.
              </p>
            </div>

            <h3 className="ragp-sub-title">Три головні причини несумісності</h3>
            <div className="ragp-three-grid">
              <div className="ragp-three-card">
                <span className="ragp-three-num">1</span>
                <span className="ragp-three-icon">🦠</span>
                <span className="ragp-three-title">Bordetella</span>
                <p>
                  Кролик — безсимптомний носій бактерії смертельно небезпечної
                  для свинки
                </p>
              </div>
              <div className="ragp-three-card">
                <span className="ragp-three-num">2</span>
                <span className="ragp-three-icon">🥗</span>
                <span className="ragp-three-title">Різне харчування</span>
                <p>
                  Свинці потрібен вітамін C щодня — без нього вона гине від
                  цинги
                </p>
              </div>
              <div className="ragp-three-card">
                <span className="ragp-three-num">3</span>
                <span className="ragp-three-icon">🐾</span>
                <span className="ragp-three-title">Різна мова</span>
                <p>Вони не розуміють сигналів одне одного — стрес і травми</p>
              </div>
            </div>

            <div className="ragp-source">
              📚 Джерела: RSPCA (Великобританія), RWAF, Merck Veterinary Manual,
              House Rabbit Society, Small Pet Select / Dr. Alicia McLaughlin
            </div>
          </div>
        )}

        {/* ── ХВОРОБИ ── */}
        {activeTab === "diseases" && (
          <div className="ragp-content">
            <p className="ragp-intro">
              Найбільший і найнебезпечніший ризик при спільному утриманні —
              передача інфекцій. Особливо небезпечна одна конкретна бактерія.
            </p>

            <div className="ragp-disease-card main">
              <div className="ragp-disease-head">
                <span className="ragp-disease-badge danger">
                  ГОЛОВНА ЗАГРОЗА
                </span>
                <span className="ragp-disease-name">
                  Bordetella bronchiseptica
                </span>
              </div>
              <div className="ragp-disease-body">
                <div className="ragp-disease-row">
                  <span className="ragp-disease-label">Що це:</span>
                  <p>
                    Бактерія що спричиняє респіраторні захворювання у багатьох
                    видів тварин. Родич збудника кашлюку у людей.
                  </p>
                </div>
                <div className="ragp-disease-row">
                  <span className="ragp-disease-label">Для кроля:</span>
                  <p>
                    Кролі є <strong>безсимптомними носіями</strong>. За даними
                    Dr. Alicia McLaughlin (Center for Bird and Exotic Animal
                    Medicine), Bordetella природно живе в дихальних шляхах
                    більшості кролів і майже ніколи не викликає у них хворобу.
                    Кроль виглядає абсолютно здоровим — але виділяє бактерію в
                    повітря.
                  </p>
                </div>
                <div className="ragp-disease-row danger-row">
                  <span className="ragp-disease-label">Для свинки:</span>
                  <p>
                    За даними Merck Veterinary Manual та RWAF —{" "}
                    <strong>може бути смертельною</strong>. Викликає тяжке
                    запалення дихальних шляхів, пневмонію. Прогресія хвороби
                    дуже швидка — смерть може наступити через 24–48 годин після
                    появи симптомів без лікування. Свинки потребують
                    госпіталізації, кисневої терапії та крапельниць.
                  </p>
                </div>
                <div className="ragp-disease-row">
                  <span className="ragp-disease-label">Як передається:</span>
                  <p>
                    Через прямий контакт і через повітря — аерозольні краплі при
                    диханні і чханні. Тобто навіть сусідство в одному приміщенні
                    без прямого контакту несе ризик при поганій вентиляції.
                  </p>
                </div>
              </div>
              <div className="ragp-alert warn">
                ⚠️ Перевірений кролик без симптомів все одно є потенційним
                носієм Bordetella. Жоден аналіз не дає 100% гарантії що кролик
                не виділяє бактерію.
              </div>
            </div>

            <h3 className="ragp-sub-title">Інші інфекційні ризики</h3>
            <div className="ragp-cards-grid">
              <div className="ragp-card">
                <div className="ragp-card-header">
                  <span>🦠</span>
                  <span>Pasteurella multocida</span>
                </div>
                <p>
                  Носять і кролі, і свинки. Може викликати пастерельоз у обох
                  видів. При спільному утриманні ризик перехресної передачі
                  вищий. Кроль з хронічним носійством може інфікувати свинку і
                  навпаки.
                </p>
              </div>
              <div className="ragp-card">
                <div className="ragp-card-header">
                  <span>🪱</span>
                  <span>Паразити</span>
                </div>
                <p>
                  Деякі зовнішні паразити (кліщі, воші) можуть переходити між
                  видами при прямому контакті. Внутрішні паразити зазвичай
                  видоспецифічні, але ризик не нульовий при спільному
                  середовищі.
                </p>
              </div>
              <div className="ragp-card">
                <div className="ragp-card-header">
                  <span>🍄</span>
                  <span>Лишай (дерматофітоз)</span>
                </div>
                <p>
                  Грибкова інфекція шкіри передається між видами при прямому
                  контакті. Заразна також для людини. При виявленні лишаю у
                  одного — негайна ізоляція і лікування обох.
                </p>
              </div>
              <div className="ragp-card">
                <div className="ragp-card-header">
                  <span>💨</span>
                  <span>Вентиляція як захист</span>
                </div>
                <p>
                  Якщо тварини живуть в різних клітках але в одному приміщенні —
                  хороша вентиляція суттєво знижує ризик передачі Bordetella
                  повітрям. Погано вентильований сарай або кімната — підвищений
                  ризик навіть без прямого контакту.
                </p>
                <div className="ragp-inline-tip">
                  💡 Клітки на вулиці або в добре провітрюваному приміщенні —
                  безпечніше ніж в закритому сараї.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── ХАРЧУВАННЯ ── */}
        {activeTab === "diet" && (
          <div className="ragp-content">
            <p className="ragp-intro">
              Харчові потреби кролів і морських свинок схожі на перший погляд,
              але мають одну критичну відмінність — вітамін C.
            </p>

            <div className="ragp-diet-table-wrap">
              <table className="ragp-table">
                <thead>
                  <tr>
                    <th>Компонент</th>
                    <th>🐇 Кролик</th>
                    <th>🐹 Морська свинка</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>Сіно</strong>
                    </td>
                    <td>
                      <span className="ragp-badge green">
                        Основа раціону (70%+)
                      </span>
                    </td>
                    <td>
                      <span className="ragp-badge green">
                        Основа раціону (70%+)
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Вітамін C</strong>
                    </td>
                    <td>
                      <span className="ragp-badge gray">
                        Синтезує сам, добавки не потрібні
                      </span>
                    </td>
                    <td>
                      <span className="ragp-badge red">
                        Не синтезує! Потрібен щодня або цинга
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Гранули / комбікорм</strong>
                    </td>
                    <td>
                      <span className="ragp-badge green">Без вітаміну C</span>
                    </td>
                    <td>
                      <span className="ragp-badge red">
                        Спеціальний з вітаміном C
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Свіжі овочі</strong>
                    </td>
                    <td>
                      <span className="ragp-badge yellow">
                        Помірно, без надлишку цукру
                      </span>
                    </td>
                    <td>
                      <span className="ragp-badge green">
                        Щодня — болгарський перець, зелень
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Люцерна</strong>
                    </td>
                    <td>
                      <span className="ragp-badge yellow">
                        Тільки молодняку і вагітним
                      </span>
                    </td>
                    <td>
                      <span className="ragp-badge green">
                        Корисна регулярно
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Фрукти</strong>
                    </td>
                    <td>
                      <span className="ragp-badge yellow">
                        Рідко, багато цукру
                      </span>
                    </td>
                    <td>
                      <span className="ragp-badge yellow">
                        Рідко, джерело C але багато цукру
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="ragp-alert warn">
              ⚠️ Якщо свинка їстиме корм кроля замість свого — вона не отримає
              вітамін C і може захворіти на цингу. Симптоми цинги у свинок:
              кульгання, набряк суглобів, кровоточивість ясен, відмова від їжі.
              Розвивається за 2–3 тижні без C.
            </div>

            <h3 className="ragp-sub-title">
              Як годувати якщо тварини живуть поряд
            </h3>
            <div className="ragp-cards-grid">
              <div className="ragp-card">
                <div className="ragp-card-header">
                  <span>🍽️</span>
                  <span>Окремі годівниці — обов'язково</span>
                </div>
                <p>
                  Навіть якщо тварини в одній клітці — годівниці мають бути
                  окремими і розміщені так, щоб свинка мала доступ до свого
                  корму без конкуренції з кролем.
                </p>
              </div>
              <div className="ragp-card">
                <div className="ragp-card-header">
                  <span>🌿</span>
                  <span>Сіно — спільне, але свіже</span>
                </div>
                <p>
                  Обидва їдять люцернове або лугове сіно. Це єдиний компонент
                  який можна давати спільно. Але стежте щоб свинка мала вільний
                  доступ — кролі можуть займати кращі місця.
                </p>
              </div>
              <div className="ragp-card">
                <div className="ragp-card-header">
                  <span>🫑</span>
                  <span>Вітамін C для свинки — щодня</span>
                </div>
                <p>
                  Болгарський перець (найбагатше джерело C серед овочів),
                  петрушка, брокколі, зелень. Давати свинці окремо щоб кроль не
                  з'їв. Дозування: мінімум 10–30 мг C на добу для дорослої
                  свинки.
                </p>
              </div>
              <div className="ragp-card">
                <div className="ragp-card-header">
                  <span>🚫</span>
                  <span>Гранули — ніколи не змішувати</span>
                </div>
                <p>
                  Гранули для кролів і для свинок — різні продукти. Кролик може
                  їсти гранули свинки (нешкідливо), але свинка, яка їсть
                  кролячий корм замість свого, недоотримає вітамін C.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── ПОВЕДІНКА ── */}
        {activeTab === "behavior" && (
          <div className="ragp-content">
            <p className="ragp-intro">
              Кролі і морські свинки — соціальні тварини, але вони говорять
              різними «мовами». Те що для кроля — нормальне привітання, для
              свинки — загроза.
            </p>

            <h3 className="ragp-sub-title">Різниця в комунікації</h3>
            <div className="ragp-compare-grid">
              <div className="ragp-compare-card rabbit">
                <span className="ragp-compare-header">🐇 Кролик</span>
                <div className="ragp-compare-item">
                  <span>Штовхає носом</span>
                  <span className="ragp-compare-meaning">
                    «Посунься» або «погладь мене»
                  </span>
                </div>
                <div className="ragp-compare-item">
                  <span>Кружляє навколо</span>
                  <span className="ragp-compare-meaning">
                    Залицяння або збудження
                  </span>
                </div>
                <div className="ragp-compare-item">
                  <span>Тупотить лапою</span>
                  <span className="ragp-compare-meaning">
                    Тривога або незадоволення
                  </span>
                </div>
                <div className="ragp-compare-item">
                  <span>Сідлає</span>
                  <span className="ragp-compare-meaning">
                    Домінування (навіть кастрований)
                  </span>
                </div>
                <div className="ragp-compare-item">
                  <span>Жує шерсть іншого</span>
                  <span className="ragp-compare-meaning">
                    Соціальний груминг
                  </span>
                </div>
              </div>

              <div className="ragp-compare-card guinea">
                <span className="ragp-compare-header">🐹 Морська свинка</span>
                <div className="ragp-compare-item">
                  <span>Гримить (purring)</span>
                  <span className="ragp-compare-meaning">
                    Задоволення або попередження
                  </span>
                </div>
                <div className="ragp-compare-item">
                  <span>Зубом клацає</span>
                  <span className="ragp-compare-meaning">
                    Агресія, «відступи»
                  </span>
                </div>
                <div className="ragp-compare-item">
                  <span>Завмирає</span>
                  <span className="ragp-compare-meaning">
                    Страх або тривога
                  </span>
                </div>
                <div className="ragp-compare-item">
                  <span>Верещить</span>
                  <span className="ragp-compare-meaning">Страх або біль</span>
                </div>
                <div className="ragp-compare-item">
                  <span>Chutting звуки</span>
                  <span className="ragp-compare-meaning">
                    Тихе невдоволення
                  </span>
                </div>
              </div>
            </div>

            <h3 className="ragp-sub-title">Чому виникають конфлікти</h3>
            <div className="ragp-cards-grid">
              <div className="ragp-card danger">
                <div className="ragp-card-header">
                  <span>⚡</span>
                  <span>Сідлання — серйозна небезпека</span>
                </div>
                <p>
                  Кролик, навіть кастрований, може сідлати свинку як домінуючу
                  поведінку. Для свинки це не просто стрес — удар задніми лапами
                  кроля або навіть просто вага тіла можуть зламати свинці
                  хребет, ребра або пошкодити голову. За даними SpectrumCare,
                  навіть «дружелюбний» кролик може ненавмисно травмувати свинку
                  своєю звичайною поведінкою.
                </p>
                <div className="ragp-inline-alert warn">
                  ⚠️ Кастрація кроля знижує, але не усуває домінуючу поведінку.
                </div>
              </div>
              <div className="ragp-card danger">
                <div className="ragp-card-header">
                  <span>🦵</span>
                  <span>Удар задніми лапами</span>
                </div>
                <p>
                  Злякана або роздратована свинка може отримати удар задніми
                  лапами від кроля — природна захисна реакція кроля при
                  переляку. Для свинки це може бути смертельним через різницю в
                  розмірі і силі. Свинки не можуть «читати» ознаки наближення
                  удару.
                </p>
              </div>
              <div className="ragp-card">
                <div className="ragp-card-header">
                  <span>😰</span>
                  <span>Хронічний стрес свинки</span>
                </div>
                <p>
                  Свинки — здобич, що приховує хворобу і стрес до останнього.
                  Якщо свинка не може відпочити, їй блокують доступ до їжі або
                  вона постійно стежить за кролем — перші ознаки проблеми:
                  втрата ваги, менше посліду, менше вокалізації, менший апетит.
                </p>
              </div>
              <div className="ragp-card">
                <div className="ragp-card-header">
                  <span>🗣️</span>
                  <span>«Мовний бар'єр»</span>
                </div>
                <p>
                  За даними RWAF — кролі і свинки не здатні адекватно реагувати
                  на соціальні сигнали одне одного. Свинці потрібна компанія
                  іншої свинки. Кролю потрібна компанія іншого кроля. Жоден з
                  них не може дати іншому те що потрібно соціально.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── ЖИТЛО ── */}
        {activeTab === "housing" && (
          <div className="ragp-content">
            <p className="ragp-intro">
              Навіть якщо ви вирішили тримати обох тварин — їхні потреби до
              житла суттєво відрізняються.
            </p>

            <div className="ragp-housing-grid">
              <div className="ragp-housing-card">
                <span className="ragp-housing-icon">🐇</span>
                <span className="ragp-housing-title">Що потрібно кролю</span>
                <div className="ragp-housing-items">
                  <div className="ragp-housing-item">
                    <span>📏</span>
                    <span>
                      Мінімум 70×50 см, краще більше — для розгону і стрибків
                    </span>
                  </div>
                  <div className="ragp-housing-item">
                    <span>🔓</span>
                    <span>Відкритий простір, любить оглядати територію</span>
                  </div>
                  <div className="ragp-housing-item">
                    <span>📦</span>
                    <span>
                      Маточник або закутку для відпочинку (необов'язково)
                    </span>
                  </div>
                  <div className="ragp-housing-item">
                    <span>🏃</span>
                    <span>Вільний вигул щодня мінімум 3–4 години</span>
                  </div>
                </div>
              </div>

              <div className="ragp-housing-card">
                <span className="ragp-housing-icon">🐹</span>
                <span className="ragp-housing-title">Що потрібно свинці</span>
                <div className="ragp-housing-items">
                  <div className="ragp-housing-item">
                    <span>📏</span>
                    <span>
                      Мінімум 100×50 см для пари (свинок краще тримати парами)
                    </span>
                  </div>
                  <div className="ragp-housing-item">
                    <span>🏠</span>
                    <span>
                      Обов'язкові укриття — будиночки де можна сховатись
                    </span>
                  </div>
                  <div className="ragp-housing-item">
                    <span>🔒</span>
                    <span>Вхід до укриття МЕНШИЙ ніж може пролізти кроль</span>
                  </div>
                  <div className="ragp-housing-item">
                    <span>🌡️</span>
                    <span>Чутливіші до протягів ніж кролі</span>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="ragp-sub-title">
              Оптимальне розміщення якщо є обидва
            </h3>
            <div className="ragp-steps">
              <div className="ragp-step">
                <span className="ragp-step-num">1</span>
                <div>
                  <span className="ragp-step-title">
                    Окремі клітки — обов'язково
                  </span>
                  <p>
                    Навіть якщо тварини «дружать» — вони мають жити в окремих
                    клітках. Це базова умова безпеки.
                  </p>
                </div>
              </div>
              <div className="ragp-step">
                <span className="ragp-step-num">2</span>
                <div>
                  <span className="ragp-step-title">
                    Відстань між клітками — мінімум 1–1.5 м
                  </span>
                  <p>
                    При хорошій вентиляції це суттєво знижує ризик передачі
                    Bordetella повітрям. У погано провітрюваному приміщенні
                    навіть 3 м не дають повного захисту.
                  </p>
                </div>
              </div>
              <div className="ragp-step">
                <span className="ragp-step-num">3</span>
                <div>
                  <span className="ragp-step-title">
                    Укриття для свинки — критично
                  </span>
                  <p>
                    У клітці свинки мають бути будиночки з входом меншим за
                    голову кроля. Свинка повинна мати можливість сховатись і
                    відпочити без постійного нагляду за кролем.
                  </p>
                </div>
              </div>
              <div className="ragp-step">
                <span className="ragp-step-num">4</span>
                <div>
                  <span className="ragp-step-title">
                    Спільний вигул — тільки під наглядом
                  </span>
                  <p>
                    На нейтральній великій площі під постійним наглядом.
                    Зупиняйте сідлання і агресивне переслідування одразу. Перші
                    сеанси — коротко, 10–15 хвилин, щоб оцінити поведінку.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── ЯКЩО ВЖЕ РАЗОМ ── */}
        {activeTab === "rules" && (
          <div className="ragp-content">
            <div className="ragp-note">
              <p>
                Якщо ваші тварини вже живуть разом роками і обидві здорові —
                різке розлучення теж є стресом, особливо для свинки. RSPCA
                зазначає: «Якщо вони вже добре ладнають — краще не розлучати,
                але забезпечте окремі потреби кожного». Ось що потрібно
                контролювати.
              </p>
            </div>

            <div className="ragp-rules-list">
              <div className="ragp-rule">
                <span className="ragp-rule-icon">🍽️</span>
                <div>
                  <span className="ragp-rule-title">
                    Окреме годування — щодня
                  </span>
                  <p>
                    Свинка повинна отримувати свої гранули з вітаміном C і свіжі
                    овочі багаті на C (болгарський перець, петрушка) окремо від
                    кроля. Годуйте в різних куточках або в різний час.
                  </p>
                </div>
              </div>

              <div className="ragp-rule">
                <span className="ragp-rule-icon">🏠</span>
                <div>
                  <span className="ragp-rule-title">
                    Укриття для свинки — недоступне для кроля
                  </span>
                  <p>
                    У будь-якому спільному або сусідньому просторі свинка
                    повинна мати укриття куди кроль не може залізти. Вхід
                    розміром 12–15 см підходить свинці, але занадто малий для
                    більшості кролів.
                  </p>
                </div>
              </div>

              <div className="ragp-rule">
                <span className="ragp-rule-icon">👀</span>
                <div>
                  <span className="ragp-rule-title">
                    Щодня перевіряйте стан свинки
                  </span>
                  <p>
                    Свинки приховують хворобу і стрес. Щодня перевіряйте: вага
                    (зважуйте раз на тиждень), апетит, кількість посліду,
                    активність. Різке схуднення або мовчання — тривожний сигнал.
                  </p>
                </div>
              </div>

              <div className="ragp-rule">
                <span className="ragp-rule-icon">🚫</span>
                <div>
                  <span className="ragp-rule-title">
                    Зупиняйте сідлання одразу
                  </span>
                  <p>
                    Будь-яка спроба кроля сідлати свинку — зупиніть фізично. Це
                    не «гра» і не нешкідлива поведінка. Повторюється постійно —
                    значить тварин треба розлучити або збільшити простір.
                  </p>
                </div>
              </div>

              <div className="ragp-rule">
                <span className="ragp-rule-icon">💨</span>
                <div>
                  <span className="ragp-rule-title">Вентиляція приміщення</span>
                  <p>
                    Якщо тварини в одному приміщенні — забезпечте хорошу
                    циркуляцію повітря. Це знижує концентрацію Bordetella в
                    повітрі. Закритий погано провітрюваний сарай — найгірший
                    варіант.
                  </p>
                </div>
              </div>

              <div className="ragp-rule">
                <span className="ragp-rule-icon">🩺</span>
                <div>
                  <span className="ragp-rule-title">
                    Ветеринар при будь-яких симптомах у свинки
                  </span>
                  <p>
                    Чхання, виділення з носа, утруднене дихання у морської
                    свинки при сусідстві з кролем — негайно до ветеринара.
                    Bordetella розвивається стрімко, промедлення критичне.
                  </p>
                </div>
              </div>

              <div className="ragp-rule">
                <span className="ragp-rule-icon">🔄</span>
                <div>
                  <span className="ragp-rule-title">
                    Мийте руки між доглядом
                  </span>
                  <p>
                    Між чисткою клітки кроля і клітки свинки — мийте руки. Між
                    годуванням — міняйте або мийте інструменти. Бактерії можуть
                    передаватись через руки і спільний інвентар.
                  </p>
                </div>
              </div>
            </div>

            <div className="ragp-alert tip">
              💡 Ідеальна компанія для морської свинки — інша морська свинка
              тієї ж або сумісної статі. Ідеальна компанія для кроля — інший
              кролик (кастрований самець + самка або дві самки). Міжвидова
              «дружба» — завжди компроміс з ризиками.
            </div>
          </div>
        )}

        {/* ── СВИНКА ЯК ІНДИКАТОР ── */}
        {activeTab === "indicator" && (
          <div className="ragp-content">
            <p className="ragp-intro">
              Серед досвідчених кролиководів існує народне спостереження: якщо
              морська свинка, що живе поряд з кролями, раптово захворіла або
              загинула — це сигнал тривоги для всього кролятника. Розберемо,
              наскільки це обґрунтовано з наукової точки зору.
            </p>

            <div className="ragp-disease-card main">
              <div className="ragp-disease-head">
                <span className="ragp-disease-badge caution">
                  НАРОДНА ПРАКТИКА
                </span>
                <span className="ragp-disease-name">
                  Свинка як «жива сигналізація»
                </span>
              </div>
              <div className="ragp-disease-body">
                <div className="ragp-disease-row">
                  <span className="ragp-disease-label">
                    Суть спостереження:
                  </span>
                  <p>
                    Кролиководи помітили: морська свинка, що мешкає в одному
                    приміщенні з кролями, реагує на погіршення санітарних умов,
                    зростання концентрації патогенів або появу хворої тварини
                    значно раніше і гостріше ніж самі кролі. Загибель або
                    раптова хвороба свинки сприймається як сигнал — «бий на
                    сполох, перевір кролятник».
                  </p>
                </div>
                <div className="ragp-disease-row">
                  <span className="ragp-disease-label">Чому це працює:</span>
                  <p>
                    Механізм такий самий, як у класичному прикладі з{" "}
                    <strong>канарками в шахтах</strong>. Шахтарі брали канарок
                    як індикатор чадного газу — птах гинув першим через вищу
                    чутливість, і люди встигали евакуюватись. Морська свинка
                    поруч з кролями — по суті той самий принцип: надчутливий
                    організм реагує на небезпеку раніше ніж менш чутливий.
                  </p>
                </div>
                <div className="ragp-disease-row">
                  <span className="ragp-disease-label">
                    Біологічне підґрунтя:
                  </span>
                  <p>
                    Bordetella bronchiseptica — ключовий механізм. Кроль є
                    безсимптомним носієм цієї бактерії і може виглядати
                    абсолютно здоровим тижнями, поки концентрація патогена
                    зростає через стрес, погану вентиляцію або нову хвору
                    тварину. Морська свинка надзвичайно чутлива до Bordetella і
                    реагує набагато раніше — смерть може наступити за 24–48
                    годин. Таким чином, загибель свинки сигналізує про умови, в
                    яких кролі вже перебувають у небезпеці, просто ще без
                    симптомів.
                  </p>
                </div>
              </div>
            </div>

            <h3 className="ragp-sub-title">Наукова оцінка практики</h3>
            <div className="ragp-cards-grid">
              <div className="ragp-card">
                <div className="ragp-card-header">
                  <span>✅</span>
                  <span>Що підтверджується наукою</span>
                </div>
                <p>
                  Біологічна логіка спостереження достовірна. Різниця в
                  чутливості до Bordetella між морськими свинками і кролями
                  задокументована у ветеринарній літературі (Merck Veterinary
                  Manual, RWAF). Свинка дійсно є «слабшою ланкою» і реагує
                  першою на погіршення умов утримання.
                </p>
              </div>
              <div className="ragp-card">
                <div className="ragp-card-header">
                  <span>⚠️</span>
                  <span>Що не підтверджується офіційно</span>
                </div>
                <p>
                  Цілеспрямованого наукового дослідження свинки як «індикаторної
                  тварини» для кролятників не проводилось. Це народне
                  спостереження з практичним ветеринарним підґрунтям — але не
                  офіційна методика моніторингу, задокументована в наукових
                  працях.
                </p>
              </div>
              <div className="ragp-card">
                <div className="ragp-card-header">
                  <span>🧭</span>
                  <span>Практична цінність</span>
                </div>
                <p>
                  Якщо свинка захворіла або загинула в кролятнику — це дійсно
                  вагомий привід негайно перевірити стан усіх кролів, якість
                  вентиляції, наявність нових або стресових факторів, і
                  звернутись до ветеринара для профілактичного огляду поголів'я.
                </p>
              </div>
              <div className="ragp-card danger">
                <div className="ragp-card-header">
                  <span>❌</span>
                  <span>Етична проблема</span>
                </div>
                <p>
                  Сучасна ветеринарна етика не рекомендує навмисно
                  використовувати тварин як «живі індикатори» — це означає
                  свідомо піддавати їх ризику загибелі заради раннього виявлення
                  проблем. Замість цього — регулярний ветеринарний контроль,
                  моніторинг вентиляції і профілактика.
                </p>
              </div>
            </div>

            <h3 className="ragp-sub-title">
              Що робити якщо свинка раптово захворіла або загинула
            </h3>
            <div className="ragp-steps">
              <div className="ragp-step">
                <span className="ragp-step-num">1</span>
                <div>
                  <span className="ragp-step-title">
                    Негайно ізолюйте хвору свинку
                  </span>
                  <p>
                    Окреме тепле приміщення, мінімум стресу. Якомога швидше до
                    ветеринара — при Bordetella рахунок іде на години.
                  </p>
                </div>
              </div>
              <div className="ragp-step">
                <span className="ragp-step-num">2</span>
                <div>
                  <span className="ragp-step-title">Огляньте всіх кролів</span>
                  <p>
                    Перевірте на наявність виділень з носа, чхання, зниження
                    апетиту, млявості. Кролі можуть не виявляти симптомів навіть
                    при активному носійстві — але огляд обов'язковий.
                  </p>
                </div>
              </div>
              <div className="ragp-step">
                <span className="ragp-step-num">3</span>
                <div>
                  <span className="ragp-step-title">
                    Перевірте умови приміщення
                  </span>
                  <p>
                    Вентиляція, вологість, наявність протягів, скупченість.
                    Стрес і погані умови підвищують виділення Bordetella навіть
                    у безсимптомних носіїв.
                  </p>
                </div>
              </div>
              <div className="ragp-step">
                <span className="ragp-step-num">4</span>
                <div>
                  <span className="ragp-step-title">
                    Зверніться до ветеринара щодо поголів'я
                  </span>
                  <p>
                    Повідомте ветеринара про ситуацію. Він може рекомендувати
                    профілактичне обстеження кролів або мазки на Bordetella —
                    особливо якщо нещодавно з'явились нові тварини в кролятнику.
                  </p>
                </div>
              </div>
            </div>

            <div className="ragp-alert tip">
              💡 Народна мудрість кролиководів має реальне наукове підґрунтя —
              але не замінює систематичного ветеринарного контролю. Краща
              «сигналізація» для кролятника — регулярні огляди і хороша
              вентиляція, а не загибель іншої тварини.
            </div>

            <div className="ragp-source">
              📚 Біологічне підґрунтя: Merck Veterinary Manual (Bordetella
              bronchiseptica у морських свинок), RWAF (Rabbit Welfare
              Association & Fund), Dr. Alicia McLaughlin — Center for Bird and
              Exotic Animal Medicine. Практика «канарки в шахті» як аналогія
              задокументована в загальній токсикології та охороні праці.
            </div>
          </div>
        )}

        <div className="ragp-back">
          <Link to="/" className="ragp-back-btn">
            ⬅ На головну
          </Link>
        </div>
      </div>
    </main>
  );
};

export default RabbitsAndGuineaPigs;
