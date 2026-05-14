import { useState } from "react";
import { Link } from "react-router-dom";
import "./DrugCompatibility.css";

type TabId =
  | "dangerous"
  | "antibiotics"
  | "combinations"
  | "probiotics"
  | "rules";

const tabs: { id: TabId; icon: string; label: string }[] = [
  { id: "dangerous", icon: "☠️", label: "Заборонені препарати" },
  { id: "antibiotics", icon: "💊", label: "Антибіотики" },
  { id: "combinations", icon: "🔬", label: "Сумісність" },
  { id: "probiotics", icon: "🦠", label: "Пробіотики" },
  { id: "rules", icon: "📋", label: "Правила лікування" },
];

const DrugCompatibility = () => {
  const [activeTab, setActiveTab] = useState<TabId>("dangerous");

  return (
    <main className="dc-page">
      <div className="dc-header">
        <h1>💊 Сумісність препаратів</h1>
        <p>
          Що можна колоти разом, що заборонено і чому кролі гинуть від лікування
        </p>
      </div>

      <div className="dc-wrap">
        <div className="dc-banner">
          <span>⚠️</span>
          <div>
            <strong>
              Багато кролів гинуть не від хвороби, а від лікування.
            </strong>{" "}
            Препарати безпечні для собак і котів можуть вбити кроля за 3–5 днів.
            Ця сторінка містить лише перевірену інформацію з ветеринарних джерел
            (Merck Veterinary Manual, LafeberVet, ANSES). Будь-яке лікування —
            після консультації з ветеринаром, знайомим з кролями.
          </div>
        </div>

        {/* ТАБС */}
        <div className="dc-tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`dc-tab ${activeTab === t.id ? "active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* ── ЗАБОРОНЕНІ ПРЕПАРАТИ ── */}
        {activeTab === "dangerous" && (
          <div className="dc-content">
            <p className="dc-intro">
              Ці препарати категорично не можна давати кролям. Деякі з них
              продаються у звичайних ветаптеках як засоби для собак і котів —
              але для кролів вони смертельні.
            </p>

            <div className="dc-danger-grid">
              <div className="dc-danger-card critical">
                <div className="dc-danger-head">
                  <span className="dc-danger-badge critical">СМЕРТЕЛЬНО</span>
                  <span className="dc-danger-name">Фіпроніл</span>
                </div>
                <p className="dc-danger-brands">
                  Frontline, Effipro, Fiproguard та всі засоби з фіпронілом
                </p>
                <p className="dc-danger-desc">
                  Краплі від бліх і кліщів для собак і котів. Для кролів —
                  нейротоксин. За даними ANSES (Французьке агентство безпеки
                  харчових продуктів), фіпроніл становить майже третину всіх
                  випадків побічних реакцій у кролів. З 26 зафіксованих випадків
                  за 2021–2022 роки — 5 загибелей. Судоми можуть з'явитись через
                  3–9 днів після нанесення, смерть — на 11–14 день.
                </p>
                <div className="dc-danger-action">
                  При випадковому контакті — негайно змити теплою водою з милом
                  і звернутись до ветеринара.
                </div>
              </div>

              <div className="dc-danger-card critical">
                <div className="dc-danger-head">
                  <span className="dc-danger-badge critical">СМЕРТЕЛЬНО</span>
                  <span className="dc-danger-name">
                    Аміназин (хлорпромазин)
                  </span>
                </div>
                <p className="dc-danger-brands">
                  Будь-які транквілізатори фенотіазинового ряду
                </p>
                <p className="dc-danger-desc">
                  Викликають небезпечне падіння температури тіла та
                  артеріального тиску у кролів. Застосовувались раніше для
                  седації, але через високу летальність повністю виключені з
                  протоколів лікування кролів.
                </p>
              </div>

              <div className="dc-danger-card high">
                <div className="dc-danger-head">
                  <span className="dc-danger-badge high">ДУЖЕ НЕБЕЗПЕЧНО</span>
                  <span className="dc-danger-name">
                    Аспірин (ацетилсаліцилова кислота)
                  </span>
                </div>
                <p className="dc-danger-brands">
                  Аспірин, Аспекард та всі саліцилати
                </p>
                <p className="dc-danger-desc">
                  Спричиняє виразки шлунково-кишкового тракту у кролів. Для
                  знеболення і зниження запалення є безпечні альтернативи —
                  мелоксикам, карпрофен (тільки під контролем ветеринара).
                </p>
              </div>

              <div className="dc-danger-card high">
                <div className="dc-danger-head">
                  <span className="dc-danger-badge high">ДУЖЕ НЕБЕЗПЕЧНО</span>
                  <span className="dc-danger-name">Ібупрофен, парацетамол</span>
                </div>
                <p className="dc-danger-brands">
                  Нурофен, Панадол та всі людські знеболювальні
                </p>
                <p className="dc-danger-desc">
                  Категорично заборонені. Людські НПЗЗ токсичні для печінки і
                  нирок кролів навіть у малих дозах. Ніколи не давайте кролю
                  препарати з домашньої аптечки.
                </p>
              </div>

              <div className="dc-danger-card high">
                <div className="dc-danger-head">
                  <span className="dc-danger-badge high">ДУЖЕ НЕБЕЗПЕЧНО</span>
                  <span className="dc-danger-name">Піретрини і піретроїди</span>
                </div>
                <p className="dc-danger-brands">
                  Засоби від бліх і кліщів з перметрином, циперметрином
                </p>
                <p className="dc-danger-desc">
                  Інсектициди на основі піретроїдів, призначені для великих
                  тварин або собак — токсичні для кролів. Особливо небезпечні
                  концентровані розчини для обприскування.
                </p>
              </div>

              <div className="dc-danger-card medium">
                <div className="dc-danger-head">
                  <span className="dc-danger-badge medium">ОБЕРЕЖНО</span>
                  <span className="dc-danger-name">
                    Стрептоміцин, дигідрострептоміцин
                  </span>
                </div>
                <p className="dc-danger-brands">
                  Ін'єкційні форми стрептоміцину
                </p>
                <p className="dc-danger-desc">
                  Повідомляються випадки ентериту і загибелі навіть при
                  парентеральному введенні. Використовується вкрай рідко і
                  тільки під ветеринарним наглядом.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── АНТИБІОТИКИ ── */}
        {activeTab === "antibiotics" && (
          <div className="dc-content">
            <p className="dc-intro">
              Кролі мають унікальну мікрофлору кишечника — переважно
              грампозитивні і анаеробні бактерії. Антибіотики, що знищують саме
              ці бактерії, дають Clostridium spiroforme та іншим патогенам
              безконтрольно розмножуватись. Результат — ентеротоксемія, яка може
              розвинутись навіть через тижні після прийому ліків.
            </p>

            <h3 className="dc-sub-title">
              Заборонені для перорального прийому
            </h3>
            <div className="dc-table-wrap">
              <table className="dc-table">
                <thead>
                  <tr>
                    <th>Препарат</th>
                    <th>Торгові назви</th>
                    <th>Ризик</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>Амоксицилін</strong>
                    </td>
                    <td>Амоксил, Флемоксин</td>
                    <td>
                      <span className="dc-badge red">
                        Смертельна дисбактеріоз
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Ампіцилін</strong>
                    </td>
                    <td>Ампіцилін</td>
                    <td>
                      <span className="dc-badge red">
                        Смертельна дисбактеріоз
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Амоксицилін/клавуланат</strong>
                    </td>
                    <td>Аугментин, Амоксиклав</td>
                    <td>
                      <span className="dc-badge red">
                        Смертельна дисбактеріоз
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Кліндаміцин</strong>
                    </td>
                    <td>Далацин, Кліміцин</td>
                    <td>
                      <span className="dc-badge red">
                        Смертельна дисбактеріоз
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Лінкоміцин</strong>
                    </td>
                    <td>Лінкоміцин</td>
                    <td>
                      <span className="dc-badge red">
                        Смертельна дисбактеріоз
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Еритроміцин</strong>
                    </td>
                    <td>Еритроміцин</td>
                    <td>
                      <span className="dc-badge red">
                        Смертельна дисбактеріоз
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Цефалоспорини (перорально)</strong>
                    </td>
                    <td>Цефалексин, Цефазолін</td>
                    <td>
                      <span className="dc-badge red">Висока небезпека</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Тилозин</strong>
                    </td>
                    <td>Тилозин</td>
                    <td>
                      <span className="dc-badge orange">
                        Є повідомлення про коліт
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="dc-alert warn">
              ⚠️ Ентеротоксемія від антибіотиків не завжди проявляється одразу.
              Кроль може спочатку покращитись, а через 2–5 і навіть більше днів
              — різко погіршитись. Рясний водянистий пронос + млявість у кроля
              після антибіотиків — надзвичайна ситуація.
            </div>

            <h3 className="dc-sub-title">
              Відносно безпечні (за призначенням ветеринара)
            </h3>
            <div className="dc-table-wrap">
              <table className="dc-table">
                <thead>
                  <tr>
                    <th>Препарат</th>
                    <th>Торгові назви</th>
                    <th>Примітка</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>Енрофлоксацин</strong>
                    </td>
                    <td>Байтрил, Енрофлон</td>
                    <td>
                      <span className="dc-badge green">
                        Безпечний, широко застосовується
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Триметоприм/сульфаметоксазол</strong>
                    </td>
                    <td>Бісептол, Трикокцид, Дітрим</td>
                    <td>
                      <span className="dc-badge green">
                        Безпечний, ефективний при кокцидіозі
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Хлорамфенікол</strong>
                    </td>
                    <td>Лівоміцетин</td>
                    <td>
                      <span className="dc-badge green">
                        Безпечний, але пригнічує кістковий мозок при тривалому
                        застосуванні
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Метронідазол</strong>
                    </td>
                    <td>Метронідазол, Трихопол</td>
                    <td>
                      <span className="dc-badge green">
                        Безпечний при анаеробних інфекціях
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Доксициклін</strong>
                    </td>
                    <td>Доксициклін</td>
                    <td>
                      <span className="dc-badge yellow">
                        Можливий ентерит, давати обережно
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Азитроміцин</strong>
                    </td>
                    <td>Сумамед, Азитроміцин</td>
                    <td>
                      <span className="dc-badge yellow">
                        Застосовується при відсутності альтернатив
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Пеніцилін (тільки ін'єкційно)</strong>
                    </td>
                    <td>Бензилпеніцилін</td>
                    <td>
                      <span className="dc-badge yellow">
                        Тільки підшкірно/внутрішньом'язово, перорально —
                        смертельно
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── СУМІСНІСТЬ ── */}
        {activeTab === "combinations" && (
          <div className="dc-content">
            <p className="dc-intro">
              Деякі комбінації препаратів посилюють ефект або безпечні разом,
              інші — несумісні або підвищують ризик побічних реакцій.
            </p>

            <h3 className="dc-sub-title">Можна застосовувати разом</h3>
            <div className="dc-combo-grid">
              <div className="dc-combo-card ok">
                <div className="dc-combo-pair">
                  <span className="dc-combo-drug">Байтрил</span>
                  <span className="dc-combo-plus">+</span>
                  <span className="dc-combo-drug">Мелоксикам</span>
                </div>
                <p>
                  Антибіотик + знеболювальне. Стандартна комбінація при
                  бактеріальних інфекціях з болем або запаленням. Взаємодії
                  клінічно значущої не виявлено.
                </p>
              </div>

              <div className="dc-combo-card ok">
                <div className="dc-combo-pair">
                  <span className="dc-combo-drug">Байтрил</span>
                  <span className="dc-combo-plus">+</span>
                  <span className="dc-combo-drug">Пробіотики</span>
                </div>
                <p>
                  Давати пробіотики через 1–2 години після антибіотика.
                  Допомагає підтримати мікрофлору під час курсу лікування.
                </p>
              </div>

              <div className="dc-combo-card ok">
                <div className="dc-combo-pair">
                  <span className="dc-combo-drug">Байкокс/Солікокс</span>
                  <span className="dc-combo-plus">+</span>
                  <span className="dc-combo-drug">Вітаміни (Чіктонік)</span>
                </div>
                <p>
                  Антикокцидійний препарат з вітамінною підтримкою. Безпечна і
                  доцільна комбінація при кокцидіозі.
                </p>
              </div>

              <div className="dc-combo-card ok">
                <div className="dc-combo-pair">
                  <span className="dc-combo-drug">Еспумізан</span>
                  <span className="dc-combo-plus">+</span>
                  <span className="dc-combo-drug">Масаж живота</span>
                </div>
                <p>
                  При здутті (тимпанії). Еспумізан (симетикон) не всмоктується і
                  не взаємодіє з іншими препаратами — безпечно поєднувати з
                  будь-яким лікуванням.
                </p>
              </div>

              <div className="dc-combo-card ok">
                <div className="dc-combo-pair">
                  <span className="dc-combo-drug">Фенбендазол</span>
                  <span className="dc-combo-plus">+</span>
                  <span className="dc-combo-drug">Байтрил</span>
                </div>
                <p>
                  Антигельмінтик + антибіотик. Клінічно сумісні, часто
                  використовуються разом при комплексному лікуванні.
                </p>
              </div>

              <div className="dc-combo-card ok">
                <div className="dc-combo-pair">
                  <span className="dc-combo-drug">Мелоксикам</span>
                  <span className="dc-combo-plus">+</span>
                  <span className="dc-combo-drug">Регідратація (розчин)</span>
                </div>
                <p>
                  Знеболювальне з регідратацією. Безпечна комбінація при болю і
                  зневодненні.
                </p>
              </div>
            </div>

            <h3 className="dc-sub-title">
              Не змішувати / застосовувати обережно
            </h3>
            <div className="dc-combo-grid">
              <div className="dc-combo-card danger">
                <div className="dc-combo-pair">
                  <span className="dc-combo-drug">Івермектин</span>
                  <span className="dc-combo-plus danger-plus">+</span>
                  <span className="dc-combo-drug">Селамектин (Стронгхолд)</span>
                </div>
                <p>
                  Два антипаразитарні разом — підвищений ризик токсичності без
                  додаткової терапевтичної користі. Якщо нещодавно давали одне —
                  робіть перерву перед іншим. Тільки за призначенням ветеринара.
                </p>
              </div>

              <div className="dc-combo-card danger">
                <div className="dc-combo-pair">
                  <span className="dc-combo-drug">Два НПЗЗ</span>
                  <span className="dc-combo-plus danger-plus">+</span>
                  <span className="dc-combo-drug">одночасно</span>
                </div>
                <p>
                  Наприклад, мелоксикам + карпрофен. Два нестероїдних
                  протизапальних одночасно — небезпечне навантаження на нирки і
                  ШКТ. Ніколи не комбінувати.
                </p>
              </div>

              <div className="dc-combo-card danger">
                <div className="dc-combo-pair">
                  <span className="dc-combo-drug">Антибіотик</span>
                  <span className="dc-combo-plus danger-plus">+</span>
                  <span className="dc-combo-drug">Пробіотик (одночасно)</span>
                </div>
                <p>
                  Якщо давати разом — антибіотик знищить пробіотик. Пробіотик
                  давати через 1–2 години після антибіотика, не раніше.
                </p>
              </div>

              <div className="dc-combo-card danger">
                <div className="dc-combo-pair">
                  <span className="dc-combo-drug">Байтрил</span>
                  <span className="dc-combo-plus danger-plus">+</span>
                  <span className="dc-combo-drug">
                    Препарати з кальцієм/магнієм
                  </span>
                </div>
                <p>
                  Іони двовалентних металів (Ca, Mg, Fe, Al) зв'язують
                  фторхінолони і різко знижують їх всмоктування. Не давати
                  байтрил разом з мінеральними добавками або антацидами.
                </p>
              </div>

              <div className="dc-combo-card warn">
                <div className="dc-combo-pair">
                  <span className="dc-combo-drug">Івермектин</span>
                  <span className="dc-combo-plus">+</span>
                  <span className="dc-combo-drug">Кетоконазол</span>
                </div>
                <p>
                  Кетоконазол пригнічує P-глікопротеїн, що захищає мозок від
                  івермектину. Теоретично підвищує ризик нейротоксичності.
                  Тільки під ветеринарним контролем.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── ПРОБІОТИКИ ── */}
        {activeTab === "probiotics" && (
          <div className="dc-content">
            <p className="dc-intro">
              Пробіотики для кролів — не просто добавка. Під час і після курсу
              антибіотиків вони допомагають відновити мікрофлору сліпої кишки і
              знизити ризик дисбактеріозу. Головне — правильний час прийому.
            </p>

            <div className="dc-rules-grid">
              <div className="dc-rule-card">
                <span className="dc-rule-icon">⏰</span>
                <div>
                  <span className="dc-rule-title">
                    Коли давати під час антибіотиків
                  </span>
                  <p>
                    Через 1–2 години після дози антибіотика — не раніше. Якщо
                    давати одночасно, антибіотик знищить бактерії пробіотика ще
                    до того, як вони потраплять у кишечник. Інтервал
                    обов'язковий.
                  </p>
                </div>
              </div>

              <div className="dc-rule-card">
                <span className="dc-rule-icon">📅</span>
                <div>
                  <span className="dc-rule-title">
                    Після курсу антибіотиків
                  </span>
                  <p>
                    Продовжуйте давати пробіотики ще 7–14 днів після завершення
                    курсу. Мікрофлора відновлюється повільно — особливо після
                    тривалого або агресивного лікування.
                  </p>
                </div>
              </div>

              <div className="dc-rule-card">
                <span className="dc-rule-icon">🚫</span>
                <div>
                  <span className="dc-rule-title">
                    Після яких антибіотиків пробіотики особливо важливі
                  </span>
                  <p>
                    Після доксицикліну, метронідазолу, хлорамфеніколу — ризик
                    пригнічення мікрофлори вищий. Після байтрилу — також
                    рекомендовані, але ризик помірніший.
                  </p>
                </div>
              </div>

              <div className="dc-rule-card">
                <span className="dc-rule-icon">⚠️</span>
                <div>
                  <span className="dc-rule-title">Чого НЕ робити</span>
                  <p>
                    Не давати йогурт або кефір — лактобактерії з молочних
                    продуктів не адаптовані до кишечника кролів і можуть
                    спричинити здуття. Використовуйте пробіотики для тварин або
                    ацидофільні препарати без молочної основи.
                  </p>
                </div>
              </div>
            </div>

            <h3 className="dc-sub-title">Пробіотики і конкретні препарати</h3>
            <div className="dc-table-wrap">
              <table className="dc-table">
                <thead>
                  <tr>
                    <th>Антибіотик</th>
                    <th>Пробіотик потрібен?</th>
                    <th>Коли давати</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Байтрил (енрофлоксацин)</td>
                    <td>
                      <span className="dc-badge yellow">Рекомендовано</span>
                    </td>
                    <td>
                      Через 1–2 год після дози, продовжити 7 днів після курсу
                    </td>
                  </tr>
                  <tr>
                    <td>Дітрим (триметоприм/сульфа)</td>
                    <td>
                      <span className="dc-badge yellow">Рекомендовано</span>
                    </td>
                    <td>Через 2 год після дози</td>
                  </tr>
                  <tr>
                    <td>Метронідазол</td>
                    <td>
                      <span className="dc-badge orange">Обов'язково</span>
                    </td>
                    <td>Через 2 год після дози, 14 днів після курсу</td>
                  </tr>
                  <tr>
                    <td>Доксициклін</td>
                    <td>
                      <span className="dc-badge orange">Обов'язково</span>
                    </td>
                    <td>Через 2 год після дози, 14 днів після курсу</td>
                  </tr>
                  <tr>
                    <td>Хлорамфенікол</td>
                    <td>
                      <span className="dc-badge orange">Обов'язково</span>
                    </td>
                    <td>Через 2 год після дози, 14 днів після курсу</td>
                  </tr>
                  <tr>
                    <td>Байкокс/Солікокс</td>
                    <td>
                      <span className="dc-badge green">Бажано</span>
                    </td>
                    <td>
                      Через 1–2 год. Допомагає відновитись після кокцидіозу
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── ПРАВИЛА ── */}
        {activeTab === "rules" && (
          <div className="dc-content">
            <p className="dc-intro">
              Загальні правила безпечного лікування кролів — незалежно від
              діагнозу і препаратів.
            </p>

            <div className="dc-rules-grid">
              <div className="dc-rule-card highlight">
                <span className="dc-rule-icon">👨‍⚕️</span>
                <div>
                  <span className="dc-rule-title">
                    Ветеринар, знайомий з кролями
                  </span>
                  <p>
                    Не всі ветеринари знають особливості кролів. Лікар, що
                    спеціалізується на собаках і котах, може призначити
                    смертельний для кроля антибіотик — просто тому що він
                    безпечний для його звичних пацієнтів. Питайте прямо: "Чи ви
                    лікуєте кролів?"
                  </p>
                </div>
              </div>

              <div className="dc-rule-card highlight">
                <span className="dc-rule-icon">📋</span>
                <div>
                  <span className="dc-rule-title">
                    Дотримуйтесь дози і терміну
                  </span>
                  <p>
                    Неповний курс антибіотиків формує стійкість бактерій.
                    Подвоєна доза не лікує швидше — вона пошкоджує нирки і
                    печінку. Будь-яке відхилення від призначення — тільки після
                    консультації.
                  </p>
                </div>
              </div>

              <div className="dc-rule-card">
                <span className="dc-rule-icon">🔍</span>
                <div>
                  <span className="dc-rule-title">
                    Перевіряйте склад перед покупкою
                  </span>
                  <p>
                    Перед тим як дати кролю будь-який засіб від паразитів,
                    перевірте діючу речовину. Якщо в складі фіпроніл — не
                    давайте кролю, навіть краплі з сусідньої клітки де живе кіт.
                  </p>
                </div>
              </div>

              <div className="dc-rule-card">
                <span className="dc-rule-icon">⏱️</span>
                <div>
                  <span className="dc-rule-title">
                    Термін очікування перед забоєм
                  </span>
                  <p>
                    Після більшості антибіотиків — мінімум 28 днів до забою.
                    Після байтрилу — 28 днів. Після байкоксу — 8 днів. Не
                    здавайте на м'ясо тварин, які нещодавно отримували
                    лікування.
                  </p>
                </div>
              </div>

              <div className="dc-rule-card">
                <span className="dc-rule-icon">👀</span>
                <div>
                  <span className="dc-rule-title">
                    Спостерігайте 48–72 години
                  </span>
                  <p>
                    Після початку будь-якого нового препарату стежте за кролем:
                    послід, апетит, активність. Погіршення через 2–5 днів після
                    антибіотика — ознака дисбактеріозу. Не чекайте, одразу до
                    ветеринара.
                  </p>
                </div>
              </div>

              <div className="dc-rule-card">
                <span className="dc-rule-icon">🚑</span>
                <div>
                  <span className="dc-rule-title">
                    Сигнали що потребують негайної реакції
                  </span>
                  <p>
                    Рясний водянистий пронос на фоні антибіотиків. Повна відмова
                    від їжі більше 12 годин. Судоми або різка млявість після
                    будь-якого препарату. Це надзвичайні ситуації — не чекати до
                    ранку.
                  </p>
                </div>
              </div>
            </div>

            <div className="dc-alert warn">
              ⚠️ Жоден препарат не є повністю безпечним без знання дози, стану
              конкретної тварини і можливих взаємодій. Ця сторінка — довідкова
              інформація, а не замінник консультації ветеринара.
            </div>
          </div>
        )}

        <div className="dc-back">
          <Link to="/" className="dc-back-btn">
            ⬅ На головну
          </Link>
        </div>
      </div>
    </main>
  );
};

export default DrugCompatibility;
