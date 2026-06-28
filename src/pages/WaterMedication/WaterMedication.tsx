import { useState } from "react";
import { Link } from "react-router-dom";
import "./WaterMedication.css";
import ShareButton from "../../components/ShareButton/ShareButton";

type TabId =
  | "basics"
  | "anticoccidia"
  | "antibiotics"
  | "vitamins"
  | "iodine"
  | "lactic"
  | "sequence"
  | "schedule";

const tabs: { id: TabId; icon: string; label: string }[] = [
  { id: "basics", icon: "📖", label: "Основи" },
  { id: "anticoccidia", icon: "🦠", label: "Від кокцидіозу" },
  { id: "antibiotics", icon: "💊", label: "Антибіотики" },
  { id: "vitamins", icon: "🌿", label: "Вітаміни" },
  { id: "iodine", icon: "🟤", label: "Йод" },
  { id: "lactic", icon: "🥛", label: "Молочна кислота" },
  { id: "sequence", icon: "🔢", label: "Послідовність" },
  { id: "schedule", icon: "📅", label: "Схема по місяцях" },
];

const WaterMedication = () => {
  const [activeTab, setActiveTab] = useState<TabId>("basics");

  return (
    <main className="wm-page">
      <div className="wm-header">
        <h1>💧 Пропойка кролів</h1>
        <p>Що, коли, скільки на літр води — від А до Я з перевірених джерел</p>
      </div>

      <div className="wm-wrap">
        <div className="wm-banner">
          <span>⚠️</span>
          <div>
            Пропойка через воду — зручний спосіб масового лікування і
            профілактики. Але <strong>точне дозування критично</strong>: занадто
            мало — не подіє, занадто багато — токсично. Всі дози на цій сторінці
            перевірені за Merck Veterinary Manual, PubMed і офіційними
            інструкціями до препаратів. Лікувальні пропойки — після консультації
            з ветеринаром.
          </div>
        </div>

        <div className="wm-tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`wm-tab ${activeTab === t.id ? "active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* ── ОСНОВИ ── */}
        {activeTab === "basics" && (
          <div className="wm-content">
            <div className="wm-note">
              <p>
                Пропойка (випоювання) — введення препаратів, вітамінів або
                профілактичних засобів через питну воду. Перевага: не потрібно
                ловити кожну тварину, препарат отримує все стадо одночасно.
                Недолік: точне дозування залежить від того скільки кроль реально
                випиває.
              </p>
            </div>

            <h3 className="wm-sub-title">Правила безпечної пропойки</h3>
            <div className="wm-rules">
              <div className="wm-rule">
                <span className="wm-rule-num">1</span>
                <div>
                  <span className="wm-rule-title">
                    Тільки свіжий розчин щодня
                  </span>
                  <p>
                    Більшість препаратів втрачають активність через 24 години у
                    воді. Готуйте свіжий розчин щоранку, залишки виливайте.
                  </p>
                </div>
              </div>
              <div className="wm-rule">
                <span className="wm-rule-num">2</span>
                <div>
                  <span className="wm-rule-title">
                    Не металеві поїлки для йоду
                  </span>
                  <p>
                    Йод реагує з металом і окиснює поверхню. Для йодних розчинів
                    використовуйте пластикові або керамічні ємності.
                  </p>
                </div>
              </div>
              <div className="wm-rule">
                <span className="wm-rule-num">3</span>
                <div>
                  <span className="wm-rule-title">
                    Прибирайте сіно і воду перед пропойкою
                  </span>
                  <p>
                    За 2–3 години до пропойки приберіть звичайну воду — кроль
                    повинен хотіти пити і прийняти потрібну дозу препарату.
                  </p>
                </div>
              </div>
              <div className="wm-rule">
                <span className="wm-rule-num">4</span>
                <div>
                  <span className="wm-rule-title">
                    Дотримуйтесь курсу повністю
                  </span>
                  <p>
                    Перерваний курс антибіотиків або антикокцидійних — основна
                    причина резистентності. Не скорочуйте курс якщо кроль
                    «виглядає краще».
                  </p>
                </div>
              </div>
              <div className="wm-rule">
                <span className="wm-rule-num">5</span>
                <div>
                  <span className="wm-rule-title">
                    Не змішуйте препарати без перевірки
                  </span>
                  <p>
                    Байкокс + Чіктонік — можна. Байтрил + мінеральні добавки —
                    не можна (кальцій знижує всмоктування фторхінолонів).
                    Детально — на сторінці «Сумісність препаратів».
                  </p>
                </div>
              </div>
            </div>

            <h3 className="wm-sub-title">
              Скільки кроль п'є — орієнтири для розрахунку
            </h3>
            <div className="wm-table-wrap">
              <table className="wm-table">
                <thead>
                  <tr>
                    <th>Тварина</th>
                    <th>Споживання води на добу</th>
                    <th>Примітки</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Кроленя 0.5–1 кг</td>
                    <td>50–100 мл</td>
                    <td>Залежить від типу корму</td>
                  </tr>
                  <tr>
                    <td>Молодняк 1–2 кг</td>
                    <td>100–200 мл</td>
                    <td>При сухому кормі — ближче до 200</td>
                  </tr>
                  <tr>
                    <td>Дорослий 3–4 кг</td>
                    <td>250–400 мл</td>
                    <td>Влітку більше, взимку менше</td>
                  </tr>
                  <tr>
                    <td>Годуюча самка</td>
                    <td>400–600 мл</td>
                    <td>Може пити до 1 л при великому посліді</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="wm-alert tip">
              💡 Для точного індивідуального дозування — давайте препарат
              шприцом без голки прямо в рот. Це єдиний спосіб гарантувати точну
              дозу кожній тварині.
            </div>
          </div>
        )}

        {/* ── ВІД КОКЦИДІОЗУ ── */}
        {activeTab === "anticoccidia" && (
          <div className="wm-content">
            <p className="wm-intro">
              Антикокцидійні пропойки — найпоширеніший вид пропойок у
              кролівництві. Кокцидіоз — основна причина загибелі молодняку після
              відлучення.
            </p>

            <div className="wm-drug-card main-drug">
              <div className="wm-drug-head">
                <div>
                  <span className="wm-drug-name">
                    Байкокс 2.5% (толтразурил)
                  </span>
                  <span className="wm-drug-type">
                    Антикокцидійний — золотий стандарт
                  </span>
                </div>
                <span className="wm-drug-badge green">Перший вибір</span>
              </div>
              <div className="wm-drug-body">
                <div className="wm-dose-grid">
                  <div className="wm-dose-item">
                    <span className="wm-dose-label">Лікувальна доза</span>
                    <span className="wm-dose-value">1 мл на 1 л води</span>
                    <span className="wm-dose-sub">
                      або 2.5 мг/кг живої ваги разово шприцом
                    </span>
                  </div>
                  <div className="wm-dose-item">
                    <span className="wm-dose-label">Курс лікування</span>
                    <span className="wm-dose-value">2 дні підряд</span>
                    <span className="wm-dose-sub">
                      перерва 5 днів, повторити ще 2 дні
                    </span>
                  </div>
                  <div className="wm-dose-item">
                    <span className="wm-dose-label">Профілактика</span>
                    <span className="wm-dose-value">1 мл на 1 л води</span>
                    <span className="wm-dose-sub">
                      2 дні після відлучення (28–35 день)
                    </span>
                  </div>
                  <div className="wm-dose-item">
                    <span className="wm-dose-label">Термін очікування</span>
                    <span className="wm-dose-value">8 днів</span>
                    <span className="wm-dose-sub">
                      до забою після останньої дози
                    </span>
                  </div>
                </div>
                <div className="wm-drug-source">
                  📚 Джерело: PubMed (порівняння толтразурилу і
                  сульфадиметоксину при кокцидіозі кролів, 2010), Merck
                  Veterinary Manual
                </div>
              </div>
              <div className="wm-alert warn">
                ⚠️ За даними PubMed — доза 25 мг/кг (у деяких джерелах) завищена
                і може спричинити анорексію і зменшення посліду. Перевірена
                ефективна доза: 2.5–5 мг/кг. Не перевищуйте.
              </div>
            </div>

            <div className="wm-drug-card">
              <div className="wm-drug-head">
                <div>
                  <span className="wm-drug-name">
                    Солікокс (толтразурил 2.5%)
                  </span>
                  <span className="wm-drug-type">
                    Аналог Байкоксу — та сама діюча речовина
                  </span>
                </div>
                <span className="wm-drug-badge green">Аналог</span>
              </div>
              <div className="wm-drug-body">
                <div className="wm-dose-grid">
                  <div className="wm-dose-item">
                    <span className="wm-dose-label">Доза у воду</span>
                    <span className="wm-dose-value">2 мл на 1 л води</span>
                    <span className="wm-dose-sub">ідентично Байкоксу 2.5%</span>
                  </div>
                  <div className="wm-dose-item">
                    <span className="wm-dose-label">Курс</span>
                    <span className="wm-dose-value">2 дні</span>
                    <span className="wm-dose-sub">
                      повтор через 5 днів при потребі
                    </span>
                  </div>
                </div>
                <p className="wm-drug-note">
                  Взаємозамінний з Байкоксом 2.5%. Вибирайте за ціною і
                  доступністю.
                </p>
              </div>
            </div>

            <div className="wm-drug-card">
              <div className="wm-drug-head">
                <div>
                  <span className="wm-drug-name">
                    Дітрим (триметоприм + сульфадиметоксин)
                  </span>
                  <span className="wm-drug-type">
                    Сульфаніламід — антикокцидійний + антибактеріальний
                  </span>
                </div>
                <span className="wm-drug-badge yellow">Альтернатива</span>
              </div>
              <div className="wm-drug-body">
                <div className="wm-dose-grid">
                  <div className="wm-dose-item">
                    <span className="wm-dose-label">
                      Лікувальна доза у воду
                    </span>
                    <span className="wm-dose-value">1 мл на 1 л води</span>
                    <span className="wm-dose-sub">
                      або 0.5 мл/кг живої ваги шприцом
                    </span>
                  </div>
                  <div className="wm-dose-item">
                    <span className="wm-dose-label">Курс</span>
                    <span className="wm-dose-value">5 днів</span>
                    <span className="wm-dose-sub">
                      при потребі повторити через 5 днів
                    </span>
                  </div>
                  <div className="wm-dose-item">
                    <span className="wm-dose-label">Перевага</span>
                    <span className="wm-dose-value">Подвійна дія</span>
                    <span className="wm-dose-sub">
                      діє і на кокцидії, і на бактерії (E. coli)
                    </span>
                  </div>
                  <div className="wm-dose-item">
                    <span className="wm-dose-label">Термін очікування</span>
                    <span className="wm-dose-value">14 днів</span>
                    <span className="wm-dose-sub">до забою</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="wm-drug-card">
              <div className="wm-drug-head">
                <div>
                  <span className="wm-drug-name">Ампролій (ампролюм)</span>
                  <span className="wm-drug-type">
                    Кокцидіостатик — профілактичний
                  </span>
                </div>
                <span className="wm-drug-badge yellow">Профілактика</span>
              </div>
              <div className="wm-drug-body">
                <div className="wm-dose-grid">
                  <div className="wm-dose-item">
                    <span className="wm-dose-label">Доза у воду</span>
                    <span className="wm-dose-value">
                      0.5 мл 9.6% р-ну на 500 мл
                    </span>
                    <span className="wm-dose-sub">
                      за Merck Veterinary Manual
                    </span>
                  </div>
                  <div className="wm-dose-item">
                    <span className="wm-dose-label">Курс</span>
                    <span className="wm-dose-value">5 днів</span>
                    <span className="wm-dose-sub">
                      тільки профілактично, не при активному захворюванні
                    </span>
                  </div>
                </div>
                <p className="wm-drug-note">
                  Менш ефективний ніж толтразурил при активному кокцидіозі.
                  Підходить як профілактика в неблагополучних господарствах.
                </p>
              </div>
            </div>

            <h3 className="wm-sub-title">
              Коли і кому проводити антикокцидійні пропойки
            </h3>
            <div className="wm-table-wrap">
              <table className="wm-table">
                <thead>
                  <tr>
                    <th>Ситуація</th>
                    <th>Препарат</th>
                    <th>Коли</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Профілактика при відлученні</td>
                    <td>Байкокс 2.5% або Солікокс</td>
                    <td>35–42 день після народження, 2 дні</td>
                  </tr>
                  <tr>
                    <td>Пронос і відставання у молодняку</td>
                    <td>Байкокс 2.5% або Дітрим</td>
                    <td>Одразу при виявленні симптомів</td>
                  </tr>
                  <tr>
                    <td>Профілактика в неблагополучному господарстві</td>
                    <td>Байкокс 2.5%</td>
                    <td>Кожні 3 місяці по 2 дні, весь молодняк</td>
                  </tr>
                  <tr>
                    <td>Підтверджений кокцидіоз</td>
                    <td>Байкокс 2.5% або Дітрим</td>
                    <td>2 дні, перерва 5 днів, ще 2 дні</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="wm-alert warn">
              ⚠️ Антикокцидійна пропойка без одночасної дезінфекції кліток 10%
              розчином аміаку — малоефективна. Ооцисти кокцидій стійкі до
              більшості дезінфектантів, але гинуть від аміаку і вогню. Лікуйте
              тварин і середовище одночасно.
            </div>
          </div>
        )}

        {/* ── АНТИБІОТИКИ ── */}
        {activeTab === "antibiotics" && (
          <div className="wm-content">
            <p className="wm-intro">
              Антибіотики через воду — менш точний метод ніж ін'єкції, але
              прийнятний для легких і середніх інфекцій при груповому лікуванні.
            </p>

            <div className="wm-alert warn" style={{ marginBottom: "1rem" }}>
              ⚠️ Антибіотики через воду — тільки після встановлення діагнозу.
              Профілактичне застосування антибіотиків формує резистентність.
              Повний курс — обов'язково.
            </div>

            <div className="wm-drug-card main-drug">
              <div className="wm-drug-head">
                <div>
                  <span className="wm-drug-name">
                    Байтрил 10% (енрофлоксацин)
                  </span>
                  <span className="wm-drug-type">
                    Фторхінолон — пастерельоз, E. coli, респіраторні інфекції
                  </span>
                </div>
                <span className="wm-drug-badge green">
                  Найбезпечніший для кролів
                </span>
              </div>
              <div className="wm-drug-body">
                <div className="wm-dose-grid">
                  <div className="wm-dose-item">
                    <span className="wm-dose-label">Доза у воду</span>
                    <span className="wm-dose-value">200 мг на 1 л</span>
                    <span className="wm-dose-sub">
                      = 2 мл Байтрилу 10% на 1 л води
                    </span>
                  </div>
                  <div className="wm-dose-item">
                    <span className="wm-dose-label">Або шприцом</span>
                    <span className="wm-dose-value">5–10 мг/кг</span>
                    <span className="wm-dose-sub">
                      двічі на добу, 5–14 днів
                    </span>
                  </div>
                  <div className="wm-dose-item">
                    <span className="wm-dose-label">Курс</span>
                    <span className="wm-dose-value">7–14 днів</span>
                    <span className="wm-dose-sub">
                      при пастерельозі — до 14 днів
                    </span>
                  </div>
                  <div className="wm-dose-item">
                    <span className="wm-dose-label">Термін очікування</span>
                    <span className="wm-dose-value">28 днів</span>
                    <span className="wm-dose-sub">
                      до забою після останньої дози
                    </span>
                  </div>
                </div>
                <div className="wm-drug-source">
                  📚 Джерело: PubMed — клінічне дослідження 200 мг/л при
                  пастерельозі (14 днів, 6 кролів), культура-негативний
                  результат у 87% після курсу
                </div>
              </div>
              <div className="wm-alert warn">
                ⚠️ Не додавайте до Байтрилу мінеральні добавки, антациди або
                препарати з кальцієм і магнієм у ту саму воду — іони металів
                знижують всмоктування фторхінолонів.
              </div>
            </div>

            <div className="wm-drug-card">
              <div className="wm-drug-head">
                <div>
                  <span className="wm-drug-name">
                    Дітрим (триметоприм + сульфаніламід)
                  </span>
                  <span className="wm-drug-type">
                    Комбінований — E. coli, пастерельоз, кокцидіоз
                  </span>
                </div>
                <span className="wm-drug-badge green">Подвійна дія</span>
              </div>
              <div className="wm-drug-body">
                <div className="wm-dose-grid">
                  <div className="wm-dose-item">
                    <span className="wm-dose-label">Доза у воду</span>
                    <span className="wm-dose-value">1 мл на 1 л</span>
                    <span className="wm-dose-sub">
                      добова норма для всього стада
                    </span>
                  </div>
                  <div className="wm-dose-item">
                    <span className="wm-dose-label">Або шприцом</span>
                    <span className="wm-dose-value">0.5 мл/кг живої ваги</span>
                    <span className="wm-dose-sub">двічі на добу</span>
                  </div>
                  <div className="wm-dose-item">
                    <span className="wm-dose-label">Курс</span>
                    <span className="wm-dose-value">5–7 днів</span>
                    <span className="wm-dose-sub">при потребі до 10 днів</span>
                  </div>
                  <div className="wm-dose-item">
                    <span className="wm-dose-label">Термін очікування</span>
                    <span className="wm-dose-value">14 днів</span>
                    <span className="wm-dose-sub">до забою</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="wm-drug-card">
              <div className="wm-drug-head">
                <div>
                  <span className="wm-drug-name">Метронідазол</span>
                  <span className="wm-drug-type">
                    При анаеробних інфекціях, протозойних
                  </span>
                </div>
                <span className="wm-drug-badge yellow">За призначенням</span>
              </div>
              <div className="wm-drug-body">
                <div className="wm-dose-grid">
                  <div className="wm-dose-item">
                    <span className="wm-dose-label">Доза шприцом</span>
                    <span className="wm-dose-value">20 мг/кг</span>
                    <span className="wm-dose-sub">
                      двічі на добу (кожні 12 год)
                    </span>
                  </div>
                  <div className="wm-dose-item">
                    <span className="wm-dose-label">Курс</span>
                    <span className="wm-dose-value">5–7 днів</span>
                    <span className="wm-dose-sub">
                      тільки за призначенням ветеринара
                    </span>
                  </div>
                </div>
                <p className="wm-drug-note">
                  Через гіркий смак кролі можуть відмовлятись пити воду з
                  метронідазолом. Краще давати шприцом.
                </p>
              </div>
            </div>

            <h3 className="wm-sub-title">
              Категорично заборонені антибіотики через воду (і взагалі
              перорально)
            </h3>
            <div className="wm-forbidden-list">
              <div className="wm-forbidden-item">
                <span className="wm-forbidden-icon">☠️</span>
                <div>
                  <span className="wm-forbidden-name">
                    Амоксицилін, Ампіцилін, Аугментин
                  </span>
                  <p>
                    Знищують корисну мікрофлору кишечника, запускають смертельну
                    ентеротоксемію (Clostridium). Загибель за 2–5 днів.
                  </p>
                </div>
              </div>
              <div className="wm-forbidden-item">
                <span className="wm-forbidden-icon">☠️</span>
                <div>
                  <span className="wm-forbidden-name">
                    Кліндаміцин, Лінкоміцин, Еритроміцин
                  </span>
                  <p>
                    Та сама причина — смертельний дисбактеріоз при пероральному
                    прийомі у кролів.
                  </p>
                </div>
              </div>
              <div className="wm-forbidden-item">
                <span className="wm-forbidden-icon">☠️</span>
                <div>
                  <span className="wm-forbidden-name">
                    Цефалоспорини перорально
                  </span>
                  <p>
                    Цефалексин, цефазолін та ін. — висока небезпека
                    ентеротоксемії при пероральному прийомі.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── ВІТАМІНИ ── */}
        {activeTab === "vitamins" && (
          <div className="wm-content">
            <p className="wm-intro">
              Вітамінні пропойки — профілактичні і підтримуючі. Особливо важливі
              для молодняку після відлучення, годуючих самок і тварин після
              хвороби або стресу.
            </p>

            <div className="wm-drug-card main-drug">
              <div className="wm-drug-head">
                <div>
                  <span className="wm-drug-name">Чіктонік (Chiktonic)</span>
                  <span className="wm-drug-type">
                    Комплекс вітамінів A, D3, E, B-групи + амінокислоти
                  </span>
                </div>
                <span className="wm-drug-badge green">Найпопулярніший</span>
              </div>
              <div className="wm-drug-body">
                <div className="wm-dose-grid">
                  <div className="wm-dose-item">
                    <span className="wm-dose-label">Профілактика у воду</span>
                    <span className="wm-dose-value">1 мл на 1 л</span>
                    <span className="wm-dose-sub">
                      1 раз на тиждень протягом місяця
                    </span>
                  </div>
                  <div className="wm-dose-item">
                    <span className="wm-dose-label">При стресі / хворобі</span>
                    <span className="wm-dose-value">2 мл на 1 л</span>
                    <span className="wm-dose-sub">
                      5–7 днів після хвороби або вакцинації
                    </span>
                  </div>
                  <div className="wm-dose-item">
                    <span className="wm-dose-label">
                      Молодняку після відлучення
                    </span>
                    <span className="wm-dose-value">1 мл на 1 л</span>
                    <span className="wm-dose-sub">
                      перші 7–10 днів після відлучення
                    </span>
                  </div>
                  <div className="wm-dose-item">
                    <span className="wm-dose-label">Годуючим самкам</span>
                    <span className="wm-dose-value">1–2 мл на 1 л</span>
                    <span className="wm-dose-sub">весь час лактації</span>
                  </div>
                </div>
              </div>
              <div className="wm-alert warn">
                ⚠️ Якщо кролі їдять повнораціонний ПК-комбікорм — вітаміни вже є
                у складі корму. Додаткова регулярна дача Чіктоніку поверх ПК
                може спричинити гіпервітаміноз A і D. Давайте лише при стресі,
                хворобі або після лікування.
              </div>
            </div>

            <div className="wm-drug-card">
              <div className="wm-drug-head">
                <div>
                  <span className="wm-drug-name">
                    Е-Селен (вітамін E + селен)
                  </span>
                  <span className="wm-drug-type">
                    При м'язовій дистрофії, репродуктивних проблемах
                  </span>
                </div>
                <span className="wm-drug-badge yellow">За потреби</span>
              </div>
              <div className="wm-drug-body">
                <div className="wm-dose-grid">
                  <div className="wm-dose-item">
                    <span className="wm-dose-label">Ін'єкційно</span>
                    <span className="wm-dose-value">0.05–0.1 мл/кг</span>
                    <span className="wm-dose-sub">
                      підшкірно, 1 раз на місяць
                    </span>
                  </div>
                  <div className="wm-dose-item">
                    <span className="wm-dose-label">Коли давати</span>
                    <span className="wm-dose-value">За 2 тижні до злучки</span>
                    <span className="wm-dose-sub">
                      самкам і самцям перед сезоном розведення
                    </span>
                  </div>
                </div>
                <p className="wm-drug-note">
                  Через воду погано всмоктується — краще ін'єкційно або з кормом
                  у спеціальній кормовій формі.
                </p>
              </div>
            </div>

            <div className="wm-drug-card">
              <div className="wm-drug-head">
                <div>
                  <span className="wm-drug-name">Гамавіт</span>
                  <span className="wm-drug-type">
                    Вітаміни + нуклеїнові кислоти + мікроелементи
                  </span>
                </div>
                <span className="wm-drug-badge yellow">Підтримуючий</span>
              </div>
              <div className="wm-drug-body">
                <div className="wm-dose-grid">
                  <div className="wm-dose-item">
                    <span className="wm-dose-label">Профілактично у воду</span>
                    <span className="wm-dose-value">0.5 мл на 1 л</span>
                    <span className="wm-dose-sub">раз на тиждень</span>
                  </div>
                  <div className="wm-dose-item">
                    <span className="wm-dose-label">При хворобі</span>
                    <span className="wm-dose-value">1 мл на 1 л</span>
                    <span className="wm-dose-sub">3–5 днів</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── ЙОД ── */}
        {activeTab === "iodine" && (
          <div className="wm-content">
            <p className="wm-intro">
              Йод у питній воді — народний метод профілактики кокцидіозу і
              загального зміцнення імунітету. Наукова база обмежена, але
              практика широко поширена і при правильному дозуванні безпечна.
            </p>

            <div className="wm-alert warn" style={{ marginBottom: "1rem" }}>
              ⚠️ Йод не замінює антикокцидійні препарати при активному
              захворюванні. Це профілактичний і допоміжний засіб, а не
              лікування.
            </div>

            <div className="wm-drug-card main-drug">
              <div className="wm-drug-head">
                <div>
                  <span className="wm-drug-name">Йод 5% або 10% розчин</span>
                  <span className="wm-drug-type">
                    Антисептик, профілактика кокцидіозу і мікробних інфекцій
                  </span>
                </div>
                <span className="wm-drug-badge yellow">Народний метод</span>
              </div>
              <div className="wm-drug-body">
                <div className="wm-dose-grid">
                  <div className="wm-dose-item">
                    <span className="wm-dose-label">
                      Профілактика (10% розчин)
                    </span>
                    <span className="wm-dose-value">1 мг/л = 0.01 мл/л</span>
                    <span className="wm-dose-sub">
                      тобто 1 крапля 10% йоду на 500 мл
                    </span>
                  </div>
                  <div className="wm-dose-item">
                    <span className="wm-dose-label">
                      Профілактика (5% розчин)
                    </span>
                    <span className="wm-dose-value">2 мг/л = 0.02 мл/л</span>
                    <span className="wm-dose-sub">
                      тобто 2 краплі 5% йоду на 500 мл
                    </span>
                  </div>
                  <div className="wm-dose-item">
                    <span className="wm-dose-label">При хворобі</span>
                    <span className="wm-dose-value">Дозу подвоїти</span>
                    <span className="wm-dose-sub">
                      тобто 2 краплі 10% на 500 мл
                    </span>
                  </div>
                  <div className="wm-dose-item">
                    <span className="wm-dose-label">Схема</span>
                    <span className="wm-dose-value">3 дні через 3</span>
                    <span className="wm-dose-sub">
                      не давайте безперервно більше 3 днів
                    </span>
                  </div>
                </div>

                <h4 className="wm-scheme-title">
                  Схема для самок навколо окролу
                </h4>
                <div className="wm-table-wrap">
                  <table className="wm-table">
                    <thead>
                      <tr>
                        <th>Період</th>
                        <th>Доза (10% йод)</th>
                        <th>Тривалість</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>За 5 днів до окролу</td>
                        <td>0.01 мл/л (1 крапля на 500 мл)</td>
                        <td>5 днів</td>
                      </tr>
                      <tr>
                        <td>Перерва</td>
                        <td>—</td>
                        <td>5 днів чистої води</td>
                      </tr>
                      <tr>
                        <td>5 день після окролу</td>
                        <td>0.02 мл/л (2 краплі на 500 мл)</td>
                        <td>15 днів</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="wm-alert warn">
                ⚠️ Не використовуйте металеві поїлки — йод окиснює метал і сам
                окиснюється, втрачаючи активність. Готуйте розчин у пластиковій
                або скляній ємності.
              </div>
              <div className="wm-alert tip">
                💡 Кролі часто відмовляються від розчину з йодом через
                специфічний запах. Якщо кроль не п'є — трохи зменшіть
                концентрацію і поступово збільшуйте.
              </div>
            </div>
          </div>
        )}

        {/* ── МОЛОЧНА КИСЛОТА ── */}
        {activeTab === "lactic" && (
          <div className="wm-content">
            <p className="wm-intro">
              Молочна кислота — підкислювач середовища кишечника. Створює
              несприятливі умови для патогенних бактерій, підтримує корисну
              мікрофлору і покращує засвоєння корму. Природний метаболіт,
              повністю засвоюється організмом.
            </p>

            <div className="wm-drug-card main-drug">
              <div className="wm-drug-head">
                <div>
                  <span className="wm-drug-name">Молочна кислота 40%</span>
                  <span className="wm-drug-type">
                    Підкислювач, профілактика ентериту, покращення травлення
                  </span>
                </div>
                <span className="wm-drug-badge green">Безпечно</span>
              </div>
              <div className="wm-drug-body">
                <div className="wm-dose-grid">
                  <div className="wm-dose-item">
                    <span className="wm-dose-label">Профілактика у воду</span>
                    <span className="wm-dose-value">2 мл на 1 л</span>
                    <span className="wm-dose-sub">дорослим кролям</span>
                  </div>
                  <div className="wm-dose-item">
                    <span className="wm-dose-label">Молодняк до 3 міс.</span>
                    <span className="wm-dose-value">1 мл на 1 л</span>
                    <span className="wm-dose-sub">
                      знижена доза через чутливу мікрофлору
                    </span>
                  </div>
                  <div className="wm-dose-item">
                    <span className="wm-dose-label">При ентериті</span>
                    <span className="wm-dose-value">3–4 мл на 1 л</span>
                    <span className="wm-dose-sub">
                      разом з основним лікуванням
                    </span>
                  </div>
                  <div className="wm-dose-item">
                    <span className="wm-dose-label">Курс</span>
                    <span className="wm-dose-value">5–7 днів</span>
                    <span className="wm-dose-sub">
                      або постійно у малих дозах
                    </span>
                  </div>
                </div>

                <h4 className="wm-scheme-title">
                  Аерозольна дезінфекція приміщення
                </h4>
                <p className="wm-drug-note">
                  20% розчин молочної кислоти через зволожувач або аерозольний
                  розпилювач — знезаражує повітря кролятника при закритих
                  вікнах. Доза: 2 мл/м³ приміщення. Тварин не виводити на час
                  обробки, провітрити після.
                </p>
              </div>
              <div className="wm-alert tip">
                💡 Молочна кислота добре поєднується з пробіотиками — разом вони
                ефективніше відновлюють мікрофлору після антибіотиків або
                хвороби.
              </div>
            </div>

            <h3 className="wm-sub-title">Коли особливо корисна</h3>
            <div className="wm-cards-grid">
              <div className="wm-card">
                <span>🔄</span>
                <div>
                  <span className="wm-card-title">Після антибіотиків</span>
                  <p>
                    5–7 днів молочна кислота + пробіотики — відновлення
                    мікрофлори кишечника.
                  </p>
                </div>
              </div>
              <div className="wm-card">
                <span>🐣</span>
                <div>
                  <span className="wm-card-title">
                    Молодняк після відлучення
                  </span>
                  <p>
                    Перші 7–10 днів після відлучення — підтримка незрілої
                    мікрофлори при переході на твердий корм.
                  </p>
                </div>
              </div>
              <div className="wm-card">
                <span>🔄</span>
                <div>
                  <span className="wm-card-title">Зміна корму</span>
                  <p>
                    При переході на новий комбікорм — знижує ризик
                    дисбактеріозу.
                  </p>
                </div>
              </div>
              <div className="wm-card">
                <span>🌡️</span>
                <div>
                  <span className="wm-card-title">Спека і стрес</span>
                  <p>
                    Влітку при підвищенні температури — підтримка апетиту і
                    мікрофлори.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── ПОСЛІДОВНІСТЬ ── */}
        {activeTab === "sequence" && (
          <div className="wm-content">
            <div className="wm-note">
              <p>
                Послідовність пропойок — це не жорсткий протокол, а логіка:
                спочатку усуваємо найбільшу загрозу, потім підтримуємо організм.
                Між різними препаратами — обов'язкові паузи, щоб не
                перевантажити печінку і не знизити ефект кожного засобу.
              </p>
            </div>

            {/* БЛОК: МОЛОДНЯК ПІСЛЯ ВІДЛУЧЕННЯ */}
            <h3 className="wm-sub-title">🐣 Молодняк після відлучення</h3>
            <p className="wm-intro">
              Найкритичніший період — перші 2–3 тижні після відлучення (28–50
              день). Саме тут найбільші втрати від кокцидіозу і дисбактеріозу.
            </p>

            <div className="wm-sequence">
              <div className="wm-seq-step">
                <div className="wm-seq-num">1</div>
                <div className="wm-seq-body">
                  <div className="wm-seq-head">
                    <span className="wm-seq-drug">
                      Байкокс 2.5% або Солікокс
                    </span>
                    <span className="wm-seq-days">День 1–2</span>
                  </div>
                  <p className="wm-seq-desc">
                    Відразу після відлучення — антикокцидійна профілактика.
                    Кокцидіоз розвивається саме в цей період через стрес і
                    зниження імунітету. 1 мл/л, 2 дні підряд.
                  </p>
                  <span className="wm-seq-pause">
                    ⏸ Пауза 3 дні — чиста вода
                  </span>
                </div>
              </div>

              <div className="wm-seq-step">
                <div className="wm-seq-num">2</div>
                <div className="wm-seq-body">
                  <div className="wm-seq-head">
                    <span className="wm-seq-drug">Молочна кислота 40%</span>
                    <span className="wm-seq-days">День 6–12</span>
                  </div>
                  <p className="wm-seq-desc">
                    Підтримка мікрофлори кишечника при переході на твердий корм.
                    1 мл/л, 7 днів. Можна давати паралельно з йодом (різні
                    механізми дії, не конфліктують).
                  </p>
                  <span className="wm-seq-pause">⏸ Пауза 2–3 дні</span>
                </div>
              </div>

              <div className="wm-seq-step">
                <div className="wm-seq-num">3</div>
                <div className="wm-seq-body">
                  <div className="wm-seq-head">
                    <span className="wm-seq-drug">
                      Чіктонік або інший вітамінний комплекс
                    </span>
                    <span className="wm-seq-days">День 15–21</span>
                  </div>
                  <p className="wm-seq-desc">
                    Вітамінна підтримка після стресу відлучення. 1 мл/л, 7 днів.
                    Якщо молодняк на ПК-комбікормі — не обов'язково, вітаміни
                    вже є в раціоні.
                  </p>
                  <span className="wm-seq-pause">
                    ⏸ Далі — стандартний моніторинг
                  </span>
                </div>
              </div>

              <div className="wm-seq-step optional">
                <div className="wm-seq-num">+</div>
                <div className="wm-seq-body">
                  <div className="wm-seq-head">
                    <span className="wm-seq-drug">
                      Байкокс 2.5% — повтор (за потребою)
                    </span>
                    <span className="wm-seq-days">День 35–40</span>
                  </div>
                  <p className="wm-seq-desc">
                    Якщо є ознаки кокцидіозу (рідкий послід, відставання в
                    рості) — повторний курс через 30 днів після першого.
                  </p>
                </div>
              </div>
            </div>

            {/* БЛОК: ПІСЛЯ АНТИБІОТИКІВ */}
            <h3 className="wm-sub-title" style={{ marginTop: "2rem" }}>
              💊 Після курсу антибіотиків
            </h3>
            <p className="wm-intro">
              Антибіотики знищують не тільки патогени, а й корисну мікрофлору.
              Відновлення — обов'язковий етап.
            </p>

            <div className="wm-sequence">
              <div className="wm-seq-step">
                <div className="wm-seq-num">1</div>
                <div className="wm-seq-body">
                  <div className="wm-seq-head">
                    <span className="wm-seq-drug">
                      Антибіотик (Байтрил, Дітрим тощо)
                    </span>
                    <span className="wm-seq-days">Повний курс 5–14 днів</span>
                  </div>
                  <p className="wm-seq-desc">
                    Не переривати достроково. Пробіотики під час курсу давати
                    через 1–2 години після антибіотика, не одночасно.
                  </p>
                  <span className="wm-seq-pause">
                    ⏸ Останній день антибіотика
                  </span>
                </div>
              </div>

              <div className="wm-seq-step">
                <div className="wm-seq-num">2</div>
                <div className="wm-seq-body">
                  <div className="wm-seq-head">
                    <span className="wm-seq-drug">
                      Пробіотики + Молочна кислота
                    </span>
                    <span className="wm-seq-days">14 днів після курсу</span>
                  </div>
                  <p className="wm-seq-desc">
                    Пробіотики (Лактобіфадол, Ветом або аналог) — за
                    інструкцією. Молочна кислота 40% — 2 мл/л. Можна давати
                    одночасно: молочна кислота створює середовище, пробіотики
                    заселяють корисну мікрофлору.
                  </p>
                  <span className="wm-seq-pause">⏸ Пауза 3 дні</span>
                </div>
              </div>

              <div className="wm-seq-step">
                <div className="wm-seq-num">3</div>
                <div className="wm-seq-body">
                  <div className="wm-seq-head">
                    <span className="wm-seq-drug">Чіктонік</span>
                    <span className="wm-seq-days">7–10 днів</span>
                  </div>
                  <p className="wm-seq-desc">
                    Відновлення вітамінного балансу після хвороби і лікування.
                    1–2 мл/л. Не поєднувати з антибіотиком в одній воді.
                  </p>
                </div>
              </div>
            </div>

            {/* БЛОК: ПІДГОТОВКА САМКИ ДО ЗЛУЧКИ */}
            <h3 className="wm-sub-title" style={{ marginTop: "2rem" }}>
              ♀ Підготовка самки до злучки
            </h3>

            <div className="wm-sequence">
              <div className="wm-seq-step">
                <div className="wm-seq-num">1</div>
                <div className="wm-seq-body">
                  <div className="wm-seq-head">
                    <span className="wm-seq-drug">Чіктонік</span>
                    <span className="wm-seq-days">
                      За 10–14 днів до злучки, 7 днів
                    </span>
                  </div>
                  <p className="wm-seq-desc">
                    Підвищення вітамінного статусу і вгодованості перед
                    вагітністю. 1–2 мл/л.
                  </p>
                  <span className="wm-seq-pause">⏸ Пауза 3 дні</span>
                </div>
              </div>

              <div className="wm-seq-step">
                <div className="wm-seq-num">2</div>
                <div className="wm-seq-body">
                  <div className="wm-seq-head">
                    <span className="wm-seq-drug">Йод 10%</span>
                    <span className="wm-seq-days">За 3–5 днів до злучки</span>
                  </div>
                  <p className="wm-seq-desc">
                    Стимуляція імунітету і репродуктивної функції. 0.01 мл/л (1
                    крапля 10% на 500 мл), 3–5 днів.
                  </p>
                  <span className="wm-seq-pause">⏸ Злучка</span>
                </div>
              </div>

              <div className="wm-seq-step">
                <div className="wm-seq-num">3</div>
                <div className="wm-seq-body">
                  <div className="wm-seq-head">
                    <span className="wm-seq-drug">
                      Йод 10% — під час вагітності
                    </span>
                    <span className="wm-seq-days">
                      Перші 5 днів після злучки
                    </span>
                  </div>
                  <p className="wm-seq-desc">
                    0.01 мл/л, 5 днів. Потім пауза до останнього тижня
                    вагітності. Мінімум втручань — стрес шкідливий.
                  </p>
                </div>
              </div>
            </div>

            {/* ПРАВИЛО ПАУЗ */}
            <h3 className="wm-sub-title" style={{ marginTop: "2rem" }}>
              ⏱ Загальні правила пауз між препаратами
            </h3>
            <div className="wm-table-wrap">
              <table className="wm-table">
                <thead>
                  <tr>
                    <th>Після препарату</th>
                    <th>Перед наступним</th>
                    <th>Мінімальна пауза</th>
                    <th>Причина</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Байкокс / Солікокс</td>
                    <td>Будь-який інший</td>
                    <td>3 дні</td>
                    <td>
                      Виведення з організму, зняття навантаження на печінку
                    </td>
                  </tr>
                  <tr>
                    <td>Антибіотик</td>
                    <td>Пробіотики</td>
                    <td>1–2 год (не дні)</td>
                    <td>Пробіотики давати через короткий час, не одночасно</td>
                  </tr>
                  <tr>
                    <td>Антибіотик (курс)</td>
                    <td>Чіктонік / вітаміни</td>
                    <td>3 дні після останньої дози</td>
                    <td>Дати організму вийти з медикаментозного стресу</td>
                  </tr>
                  <tr>
                    <td>Йод</td>
                    <td>Будь-який інший</td>
                    <td>3 дні</td>
                    <td>
                      Йод окиснює і може знижувати активність інших засобів
                    </td>
                  </tr>
                  <tr>
                    <td>Чіктонік / вітаміни</td>
                    <td>Антибіотик</td>
                    <td>Не поєднувати в одній воді</td>
                    <td>
                      Кальцій і магній у вітамінах знижують всмоктування
                      фторхінолонів
                    </td>
                  </tr>
                  <tr>
                    <td>Молочна кислота</td>
                    <td>Пробіотики</td>
                    <td>Можна паралельно</td>
                    <td>
                      Синергія: кислота готує середовище, пробіотики заселяють
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="wm-alert tip" style={{ marginTop: "1.5rem" }}>
              💡 Що не можна суміщати в одній поїлці одночасно: Байтрил +
              кальцієвмісні добавки, Байтрил + Чіктонік, будь-який антибіотик +
              пробіотик. Решту комбінацій — перевіряйте окремо або запитуйте у
              ветлікаря.
            </div>
          </div>
        )}

        {/* ── СХЕМА ПО МІСЯЦЯХ ── */}
        {activeTab === "schedule" && (
          <div className="wm-content">
            <div className="wm-note">
              <p>
                Орієнтовна схема профілактичних пропойок для середнього
                господарства. Адаптуйте під свою ситуацію. Лікувальні пропойки —
                за необхідністю і після консультації з ветеринаром.
              </p>
            </div>

            <div className="wm-schedule">
              <div className="wm-schedule-item">
                <div className="wm-schedule-head">
                  <span className="wm-schedule-period">
                    Молодняк 28–35 днів
                  </span>
                  <span className="wm-schedule-badge">Відлучення</span>
                </div>
                <div className="wm-schedule-body">
                  <div className="wm-schedule-row">
                    <span className="wm-schedule-drug">Байкокс 2.5%</span>
                    <span className="wm-schedule-dose">1 мл/л</span>
                    <span className="wm-schedule-days">2 дні</span>
                  </div>
                  <div className="wm-schedule-row">
                    <span className="wm-schedule-drug">Чіктонік</span>
                    <span className="wm-schedule-dose">1 мл/л</span>
                    <span className="wm-schedule-days">
                      7 днів після байкоксу
                    </span>
                  </div>
                  <div className="wm-schedule-row">
                    <span className="wm-schedule-drug">Молочна кислота</span>
                    <span className="wm-schedule-dose">1 мл/л</span>
                    <span className="wm-schedule-days">перші 10 днів</span>
                  </div>
                  <p className="wm-schedule-note">
                    Найкритичніший період — максимум уваги до посліду і апетиту.
                  </p>
                </div>
              </div>

              <div className="wm-schedule-item">
                <div className="wm-schedule-head">
                  <span className="wm-schedule-period">
                    Молодняк 60–70 днів
                  </span>
                  <span className="wm-schedule-badge">Відгодівля</span>
                </div>
                <div className="wm-schedule-body">
                  <div className="wm-schedule-row">
                    <span className="wm-schedule-drug">
                      Байкокс 2.5% (за потребою)
                    </span>
                    <span className="wm-schedule-dose">1 мл/л</span>
                    <span className="wm-schedule-days">
                      2 дні якщо є симптоми
                    </span>
                  </div>
                  <div className="wm-schedule-row">
                    <span className="wm-schedule-drug">Йод 10%</span>
                    <span className="wm-schedule-dose">0.01 мл/л</span>
                    <span className="wm-schedule-days">3 дні через 3</span>
                  </div>
                  <p className="wm-schedule-note">
                    Стабільний період. Основна увага — конверсія і приріст.
                  </p>
                </div>
              </div>

              <div className="wm-schedule-item">
                <div className="wm-schedule-head">
                  <span className="wm-schedule-period">
                    Самки — за 7 днів до злучки
                  </span>
                  <span className="wm-schedule-badge">
                    Підготовка до розведення
                  </span>
                </div>
                <div className="wm-schedule-body">
                  <div className="wm-schedule-row">
                    <span className="wm-schedule-drug">Чіктонік</span>
                    <span className="wm-schedule-dose">1–2 мл/л</span>
                    <span className="wm-schedule-days">7 днів</span>
                  </div>
                  <div className="wm-schedule-row">
                    <span className="wm-schedule-drug">Йод 10%</span>
                    <span className="wm-schedule-dose">0.01 мл/л</span>
                    <span className="wm-schedule-days">3 дні до злучки</span>
                  </div>
                  <p className="wm-schedule-note">
                    Підвищення вгодованості і вітамінного статусу перед
                    вагітністю.
                  </p>
                </div>
              </div>

              <div className="wm-schedule-item">
                <div className="wm-schedule-head">
                  <span className="wm-schedule-period">
                    Самки — вагітність (1–27 день)
                  </span>
                  <span className="wm-schedule-badge">Тільність</span>
                </div>
                <div className="wm-schedule-body">
                  <div className="wm-schedule-row">
                    <span className="wm-schedule-drug">Йод 10%</span>
                    <span className="wm-schedule-dose">0.01 мл/л</span>
                    <span className="wm-schedule-days">
                      5 днів після злучки, потім перерва
                    </span>
                  </div>
                  <div className="wm-schedule-row">
                    <span className="wm-schedule-drug">
                      Чіктонік (за потребою)
                    </span>
                    <span className="wm-schedule-dose">1 мл/л</span>
                    <span className="wm-schedule-days">
                      останній тиждень перед окролом
                    </span>
                  </div>
                  <p className="wm-schedule-note">
                    Мінімум втручань — стрес шкідливий для вагітної самки.
                  </p>
                </div>
              </div>

              <div className="wm-schedule-item">
                <div className="wm-schedule-head">
                  <span className="wm-schedule-period">
                    Самки — лактація (0–35 день)
                  </span>
                  <span className="wm-schedule-badge">Годування посліду</span>
                </div>
                <div className="wm-schedule-body">
                  <div className="wm-schedule-row">
                    <span className="wm-schedule-drug">Йод 10%</span>
                    <span className="wm-schedule-dose">0.02 мл/л</span>
                    <span className="wm-schedule-days">
                      з 5-го дня після окролу, 15 днів
                    </span>
                  </div>
                  <div className="wm-schedule-row">
                    <span className="wm-schedule-drug">Чіктонік</span>
                    <span className="wm-schedule-dose">1–2 мл/л</span>
                    <span className="wm-schedule-days">
                      весь час лактації, якщо не ПК-корм
                    </span>
                  </div>
                  <div className="wm-schedule-row">
                    <span className="wm-schedule-drug">Молочна кислота</span>
                    <span className="wm-schedule-dose">2 мл/л</span>
                    <span className="wm-schedule-days">
                      постійно для підтримки травлення
                    </span>
                  </div>
                  <p className="wm-schedule-note">
                    Самка витрачає максимум ресурсів — підтримка вітамінами і
                    мінералами важлива.
                  </p>
                </div>
              </div>

              <div className="wm-schedule-item">
                <div className="wm-schedule-head">
                  <span className="wm-schedule-period">
                    Після хвороби / антибіотиків
                  </span>
                  <span className="wm-schedule-badge">Відновлення</span>
                </div>
                <div className="wm-schedule-body">
                  <div className="wm-schedule-row">
                    <span className="wm-schedule-drug">Молочна кислота</span>
                    <span className="wm-schedule-dose">2–3 мл/л</span>
                    <span className="wm-schedule-days">
                      14 днів після курсу
                    </span>
                  </div>
                  <div className="wm-schedule-row">
                    <span className="wm-schedule-drug">
                      Пробіотики (ветеринарні)
                    </span>
                    <span className="wm-schedule-dose">за інструкцією</span>
                    <span className="wm-schedule-days">
                      14 днів після курсу
                    </span>
                  </div>
                  <div className="wm-schedule-row">
                    <span className="wm-schedule-drug">Чіктонік</span>
                    <span className="wm-schedule-dose">1–2 мл/л</span>
                    <span className="wm-schedule-days">7–10 днів</span>
                  </div>
                  <p className="wm-schedule-note">
                    Пробіотики давати через 1–2 год після антибіотика, не
                    одночасно.
                  </p>
                </div>
              </div>
            </div>

            <div className="wm-alert tip">
              💡 Ведіть записи всіх пропойок — дату, препарат, дозу, кількість
              тварин, реакцію. Це допомагає відстежити ефективність і уникнути
              перетинання термінів очікування.
            </div>
          </div>
        )}

        <div className="wm-source">
          📚 Джерела: Merck Veterinary Manual (Parasitic Diseases of Rabbits),
          PubMed — порівняння толтразурилу і сульфадиметоксину (2010), PubMed —
          енрофлоксацин при пастерельозі кролів (200 мг/л, 14 днів), VETiSearch
          Enrocare, PMC NIH Rabbits (2009)
        </div>

        <div className="wm-back">
          <Link to="/" className="wm-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Назва цієї сторінки" />
        </div>
      </div>
    </main>
  );
};

export default WaterMedication;
