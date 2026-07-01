import { useState } from "react";
import { Link } from "react-router-dom";
import "./VetInjections.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const steps_sc = [
  {
    num: "1",
    title: "Підготуй матеріали",
    text: "Шприц 1–2 мл, голка 25G (0,5×16 мм), антисептик (70% спирт), препарат, серветка. Перевір термін придатності і прозорість розчину.",
  },
  {
    num: "2",
    title: "Зафіксуй кроля",
    text: "Поклади на рівну поверхню або притримуй на руці. Помічник тримає тіло — кролик не повинен різко смикатися під час введення.",
  },
  {
    num: "3",
    title: "Знайди місце введення",
    text: "Загривок — шкірна складка між лопатками. Підніми шкіру двома пальцями: утвориться «намет» з вільним простором під шкірою.",
  },
  {
    num: "4",
    title: "Обробка та введення",
    text: "Протри місце спиртом, дай підсохнути 5–10 секунд. Введи голку під кутом 45° у підняту складку, кінцем голки у бік голови тварини. Перед введенням потягни поршень: кров = потрапив у судину, витягни і змін місце.",
  },
  {
    num: "5",
    title: "Введи розчин та виймай",
    text: "Вводь повільно. Після введення — притисни місце сухою серветкою на 5–10 секунд, злегка помасажуй для розподілу розчину.",
  },
];

const steps_im = [
  {
    num: "1",
    title: "Підготуй матеріали",
    text: "Шприц 1–2 мл, голка 23–25G (0,6×25 мм), антисептик, препарат. В/м об'єм — не більше 0,5 мл на одну точку.",
  },
  {
    num: "2",
    title: "Зафіксуй та знайди м'яз",
    text: "М'яз стегна (quadriceps) — передньо-зовнішня поверхня задньої лапи. Це єдине безпечне місце для в/м ін'єкцій у кролів.",
  },
  {
    num: "3",
    title: "Критично важливо",
    text: "Сідничний нерв проходить по задній поверхні стегна. Введення туди може спричинити параліч лапи. Завжди вколюй у передньо-зовнішню частину, ніколи — у задню.",
  },
  {
    num: "4",
    title: "Введення",
    text: "Введи голку перпендикулярно або під кутом 60–70° до поверхні м'яза на глибину 1–1,5 см. Потягни поршень — кров = витягни і змін точку. Вводь повільно.",
  },
  {
    num: "5",
    title: "Після введення",
    text: "Виймай голку швидко, притисни серветку. Легкий масаж місця введення. Поспостерігай за лапою 10–15 хвилин — кролик повинен нормально на неї ступати.",
  },
];

const VetInjections = () => {
  const [tab, setTab] = useState<"sc" | "im">("sc");

  return (
    <main className="vi-page">
      <div className="vi-hero">
        <span className="vi-hero-icon">💉</span>
        <h1>Ін'єкції кролям</h1>
        <p>Підшкірно і внутрішньом'язово — техніка, місця, типові помилки</p>
      </div>

      <div className="vi-notice">
        <span>⚠️</span>
        <p>
          Робити ін'єкції без призначення ветеринара — ризиковано. Ця сторінка
          стосується введення вже призначених препаратів у правильно
          розрахованих дозах.
        </p>
      </div>

      {/* Що потрібно */}
      <section className="vi-section">
        <h2>Що потрібно мати</h2>
        <div className="vi-supplies">
          <div className="vi-supply-item">
            <span>🔬</span>
            <div>
              <strong>Шприци</strong>
              <span>
                1 мл (інсулінові) або 2 мл — для малих доз; 5 мл — для більших
              </span>
            </div>
          </div>
          <div className="vi-supply-item">
            <span>📍</span>
            <div>
              <strong>Голки</strong>
              <span>25G (0,5×16 мм) — підшкірно; 23–25G (0,6×25 мм) — в/м</span>
            </div>
          </div>
          <div className="vi-supply-item">
            <span>🧴</span>
            <div>
              <strong>Антисептик</strong>
              <span>
                70% ізопропіловий або етиловий спирт; стерильні серветки
              </span>
            </div>
          </div>
          <div className="vi-supply-item">
            <span>🗑️</span>
            <div>
              <strong>Контейнер для голок</strong>
              <span>
                Ніколи не ковпачки руками після ін'єкції — ризик проколу
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* TABS */}
      <div className="vi-tabs">
        <button
          className={`vi-tab${tab === "sc" ? " vi-tab--active" : ""}`}
          onClick={() => setTab("sc")}
        >
          Підшкірно (п/ш)
        </button>
        <button
          className={`vi-tab${tab === "im" ? " vi-tab--active" : ""}`}
          onClick={() => setTab("im")}
        >
          Внутрішньом'язово (в/м)
        </button>
      </div>

      {/* SC */}
      {tab === "sc" && (
        <section className="vi-steps-wrap">
          <div className="vi-route-badge vi-route-badge--sc">
            Підшкірно · Місце: загривок
          </div>
          <p className="vi-route-note">
            Найпоширеніший шлях введення для кролів. Більшість антибіотиків,
            вакцин та вітамінів вводяться саме так. Кролі добре переносять п/ш
            ін'єкції.
          </p>
          <div className="vi-steps">
            {steps_sc.map((s) => (
              <div key={s.num} className="vi-step">
                <div className="vi-step-num">{s.num}</div>
                <div className="vi-step-body">
                  <strong>{s.title}</strong>
                  <p>{s.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="vi-tip">
            <strong>Максимальний об'єм п/ш:</strong> до 20 мл на одне місце
            (рідини). Для стандартних препаратів — як зазначено в інструкції,
            зазвичай 0,5–2 мл.
          </div>
        </section>
      )}

      {/* IM */}
      {tab === "im" && (
        <section className="vi-steps-wrap">
          <div className="vi-route-badge vi-route-badge--im">
            Внутрішньом'язово · М'яз: передньо-зовнішнє стегно
          </div>
          <p className="vi-route-note">
            Застосовується рідше — лише коли препарат не призначений для п/ш
            введення. Потребує більш точної техніки через ризик пошкодження
            сідничного нерва.
          </p>
          <div className="vi-steps">
            {steps_im.map((s) => (
              <div
                key={s.num}
                className={`vi-step${s.num === "3" ? " vi-step--danger" : ""}`}
              >
                <div
                  className={`vi-step-num${s.num === "3" ? " vi-step-num--danger" : ""}`}
                >
                  {s.num === "3" ? "!" : s.num}
                </div>
                <div className="vi-step-body">
                  <strong>{s.title}</strong>
                  <p>{s.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="vi-tip">
            <strong>Максимальний об'єм в/м:</strong> не більше 0,5 мл на одне
            місце для кролів. Більший об'єм розділяй між двома лапами.
          </div>
        </section>
      )}

      {/* ПОМИЛКИ */}
      <section className="vi-section">
        <h2>Типові помилки</h2>
        <div className="vi-errors">
          <div className="vi-error">
            <span className="vi-error-icon">✗</span>
            <div>
              <strong>Вводити без аспірації при в/м</strong>
              <span>
                Завжди потягни поршень перед введенням — перевір що не в судині
              </span>
            </div>
          </div>
          <div className="vi-error">
            <span className="vi-error-icon">✗</span>
            <div>
              <strong>Вколювати в задню частину стегна</strong>
              <span>
                Там проходить сідничний нерв — параліч лапи незворотній
              </span>
            </div>
          </div>
          <div className="vi-error">
            <span className="vi-error-icon">✗</span>
            <div>
              <strong>Використовувати одну голку для набору і введення</strong>
              <span>
                Голка тупиться пробиваючи гумову кришку флакону — для введення
                потрібна нова
              </span>
            </div>
          </div>
          <div className="vi-error">
            <span className="vi-error-icon">✗</span>
            <div>
              <strong>Вводити холодний препарат</strong>
              <span>
                Препарати з холодильника слід витримати 15–20 хвилин при
                кімнатній температурі
              </span>
            </div>
          </div>
          <div className="vi-error">
            <span className="vi-error-icon">✗</span>
            <div>
              <strong>Змішувати препарати в одному шприці без перевірки</strong>
              <span>
                Деякі препарати несумісні — випадає осад або знижується
                ефективність
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="vi-related">
        <h3 className="vi-related-title">Читайте також</h3>
        <div className="vi-related-grid">
          <Link to="/medicines" className="vi-related-link">
            💊 Препарати
          </Link>
          <Link to="/dosage-calculator" className="vi-related-link">
            🧮 Калькулятор дозування
          </Link>
          <Link to="/drug-compatibility" className="vi-related-link">
            ⚗️ Сумісність препаратів
          </Link>
          <Link to="/vet-oral-meds" className="vi-related-link">
            💊 Таблетки та суспензії
          </Link>
          <Link to="/pain-management" className="vi-related-link">
            🩹 Знеболення
          </Link>
        </div>
      </div>

      <div className="vi-back">
        <Link to="/" className="vi-back-link">
          ← Головна
        </Link>
        <ShareButton title="Назва цієї сторінки" />
      </div>
    </main>
  );
};

export default VetInjections;
