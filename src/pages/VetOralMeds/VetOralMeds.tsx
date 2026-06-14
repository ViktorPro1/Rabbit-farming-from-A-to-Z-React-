import { Link } from "react-router-dom";
import "./VetOralMeds.css";

const methods = [
  {
    icon: "💊",
    title: "Суспензія або рідина в шприці",
    badge: "Найкраще",
    badgeColor: "green",
    steps: [
      "Набери потрібну дозу в шприц без голки (1–2 мл).",
      "Кроля тримай вертикально або поклади на рівну поверхню — голова злегка підведена.",
      "Введи кінчик шприца в куток рота, між різцями та кутніми зубами — там є природна щілина.",
      "Вводь повільно: 0,1–0,2 мл за раз. Дай ковтнути перед наступною порцією.",
      "Не нахиляй голову назад — ризик аспірації в дихальні шляхи.",
    ],
    note: "Більшість ветпрепаратів для кролів випускаються у вигляді суспензій саме для цього шляху введення.",
  },
  {
    icon: "🍌",
    title: "Таблетка, прихована в їжі",
    badge: "Якщо кролик їсть",
    badgeColor: "amber",
    steps: [
      "Розітри таблетку в порошок ступкою.",
      "Змішай з невеликою кількістю бананового пюре, яблучного соусу без цукру або 1 ч. л. вівсяної каші.",
      "Запропонуй кролю окремо від основного корму — має з'їсти все.",
      "Переконайся що кролик з'їв повністю, перш ніж давати основний корм.",
    ],
    note: "Не підходить при відмові від їжі або підозрі на ШКТ-стаз — у цьому випадку лише шприц.",
  },
  {
    icon: "🧪",
    title: "Пряме введення шприцом у рот",
    badge: "Якщо відмовляється",
    badgeColor: "blue",
    steps: [
      "Загорни кроля у рушник (бурітто) — обмежує рухи без надмірного стресу.",
      "Однією рукою м'яко тримай голову між великим та іншими пальцями.",
      "Введи шприц з боку — між щокою та кутніми зубами.",
      "Давай мікропорціями (0,05–0,1 мл), пауза між кожною. Кролик повинен ковтати.",
    ],
    note: "Для гіркого або неприємного препарату можна розвести мінімальною кількістю яблучного соку.",
  },
];

const VetOralMeds = () => {
  return (
    <main className="vom-page">
      <div className="vom-back">
        <Link to="/" className="vom-back-link">
          ← Головна
        </Link>
      </div>

      <div className="vom-hero">
        <span>💊</span>
        <h1>Таблетки та суспензії</h1>
        <p>Як дати ліки кролю без стресу та втрати дози</p>
      </div>

      <div className="vom-notice">
        <span>ℹ️</span>
        <div>
          <strong>Чому кролям важко давати ліки через рот</strong>
          <p>
            Кролі не вміють блювати, тому аспірація рідини в легені — реальна
            небезпека при неправильній техніці. Ніколи не вводь ліки при
            запрокинутій голові.
          </p>
        </div>
      </div>

      <section className="vom-section">
        <h2>Способи введення</h2>
        <div className="vom-methods">
          {methods.map((m) => (
            <div key={m.title} className="vom-method">
              <div className="vom-method-header">
                <span className="vom-method-icon">{m.icon}</span>
                <strong className="vom-method-title">{m.title}</strong>
                <span className={`vom-badge vom-badge--${m.badgeColor}`}>
                  {m.badge}
                </span>
              </div>
              <ol className="vom-steps">
                {m.steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
              {m.note && <div className="vom-method-note">{m.note}</div>}
            </div>
          ))}
        </div>
      </section>

      <section className="vom-section">
        <h2>Загальні правила</h2>
        <div className="vom-rules">
          <div className="vom-rule">
            <span className="vom-rule-icon">✓</span>
            <span>Перевір дозу на вагу кроля перед кожним введенням</span>
          </div>
          <div className="vom-rule">
            <span className="vom-rule-icon">✓</span>
            <span>Шприц без голки — завжди. Голку знімай до введення</span>
          </div>
          <div className="vom-rule">
            <span className="vom-rule-icon">✓</span>
            <span>
              Після введення дай кролю посидіти вертикально 1–2 хвилини
            </span>
          </div>
          <div className="vom-rule">
            <span className="vom-rule-icon">✓</span>
            <span>Суспензію перед набором добре збовтай</span>
          </div>
          <div className="vom-rule vom-rule--warn">
            <span className="vom-rule-icon vom-rule-icon--warn">✗</span>
            <span>Не змішуй різні препарати в одному шприці без перевірки</span>
          </div>
          <div className="vom-rule vom-rule--warn">
            <span className="vom-rule-icon vom-rule-icon--warn">✗</span>
            <span>
              Не вводь рідину при запрокинутій голові — ризик аспірації
            </span>
          </div>
          <div className="vom-rule vom-rule--warn">
            <span className="vom-rule-icon vom-rule-icon--warn">✗</span>
            <span>Не пропускай дози — перерви знижують ефективність курсу</span>
          </div>
        </div>
      </section>

      <section className="vom-section">
        <h2>Якщо кролик виплюнув ліки</h2>
        <p className="vom-text">
          Не вводь повтору дозу відразу — невідомо скільки засвоїлось. При
          суспензіях: якщо виплюнув більше половини об'єму протягом перших 30
          секунд — можна ввести половину дози. При таблетках у їжі: якщо не з'їв
          — спробуй інший носій (банан замість вівса). При систематичній відмові
          — переходь на шприцеве введення.
        </p>
      </section>
    </main>
  );
};

export default VetOralMeds;
