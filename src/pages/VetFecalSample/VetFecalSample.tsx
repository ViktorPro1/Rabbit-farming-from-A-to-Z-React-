import { Link } from "react-router-dom";
import "./VetFecalSample.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const analysisTypes = [
  {
    icon: "🔬",
    title: "Флотація (кокцидіоз, гельмінти)",
    desc: "Основний аналіз. Виявляє ооцисти Eimeria та яйця гельмінтів. Потрібно 3–5 г свіжого калу, не старіше 4 годин.",
    priority: "Найчастіший",
    priorityColor: "green",
  },
  {
    icon: "🧫",
    title: "Бактеріологічний посів",
    desc: "При підозрі на пастерельоз, сальмонельоз, ентерит бактеріальної природи. Матеріал береться безпосередньо у лабораторії або в стерильний контейнер.",
    priority: "За направленням",
    priorityColor: "blue",
  },
  {
    icon: "🧪",
    title: "ПЛР (ДНК-аналіз)",
    desc: "Точне виявлення конкретних збудників: E. cuniculi, ВГХК, пасртерела. Свіжий зразок у стерильний контейнер, зберігання при +4°C.",
    priority: "Спеціалізований",
    priorityColor: "amber",
  },
];

const steps = [
  {
    title: "Збери свіжий матеріал",
    text: "Ідеально — підклади чисту пелюшку або папір у клітку та збери щойно виділений кал. Не підбирай з підлоги — забруднення спотворює результат. Для флотації: 3–5 свіжих фекальних кульок.",
  },
  {
    title: "Відмов від нічного посліду (цекотроф)",
    text: "Цекотрофи — м'які кульки ранкового посліду, які кролик зазвичай з'їдає. Вони не підходять для аналізу — їхній склад відрізняється від звичайного калу. Потрібен твердий денний послід.",
  },
  {
    title: "Упакуй правильно",
    text: "Стерильний пластиковий контейнер з кришкою (аптечний). Можна використати зіп-пакет. Ніколи не металева фольга або тканина — змінює склад мікрофлори.",
  },
  {
    title: "Доставка та зберігання",
    text: "Оптимально — доставка в лабораторію протягом 2 годин після збору. Якщо не виходить — зберігай у холодильнику при +4°C не більше 12 годин. Не заморожуй — руйнує структуру ооцист.",
  },
  {
    title: "Що вказати на направленні",
    text: "Вид тварини (кролик), вік, кількість особин у господарстві, клінічні симптоми, підозра (кокцидіоз / гельмінти / бактерія), чи проводилось лікування останні 2 тижні.",
  },
];

const VetFecalSample = () => {
  return (
    <main className="vfs-page">
      <div className="vfs-hero">
        <span>🧫</span>
        <h1>Збір калу на аналіз</h1>
        <p>Як правильно взяти зразок щоб результат був достовірним</p>
      </div>

      <section className="vfs-section">
        <h2>Які аналізи бувають</h2>
        <div className="vfs-types">
          {analysisTypes.map((a) => (
            <div key={a.title} className="vfs-type">
              <div className="vfs-type-header">
                <span className="vfs-type-icon">{a.icon}</span>
                <strong>{a.title}</strong>
                <span className={`vfs-badge vfs-badge--${a.priorityColor}`}>
                  {a.priority}
                </span>
              </div>
              <p>{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="vfs-section">
        <h2>Правила збору</h2>
        <div className="vfs-steps">
          {steps.map((s, i) => (
            <div key={i} className="vfs-step">
              <div className="vfs-step-num">{i + 1}</div>
              <div className="vfs-step-body">
                <strong>{s.title}</strong>
                <p>{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="vfs-section">
        <h2>Зразок від кількох тварин</h2>
        <div className="vfs-group-note">
          <div className="vfs-group-card vfs-group-card--ok">
            <strong>Груповий зразок (скринінг)</strong>
            <p>
              Якщо потрібно перевірити стадо — можна зібрати змішаний зразок з
              5–8 тварин в один контейнер. Підходить для виявлення кокцидіозу в
              групі. Якщо результат позитивний — потім обстежують індивідуально.
            </p>
          </div>
          <div className="vfs-group-card vfs-group-card--warn">
            <strong>Індивідуальний зразок</strong>
            <p>
              Потрібен при лікуванні конкретної тварини, контролі після курсу,
              або коли хворіє одна особина з групи. Підпиши контейнер — номер
              або кличку тварини.
            </p>
          </div>
        </div>
      </section>

      <section className="vfs-section">
        <h2>Важливо знати</h2>
        <div className="vfs-tips">
          <div className="vfs-tip-item">
            <span>💡</span>
            <span>
              Невелика кількість ооцист Eimeria в калі — норма для дорослих
              кролів. Патологія — масивне виявлення або симптоми (пронос,
              схуднення). Оцінює лікар, не лаборанти.
            </span>
          </div>
          <div className="vfs-tip-item">
            <span>💡</span>
            <span>
              Не давай антипаразитарні засоби за 2 тижні до аналізу — показники
              будуть занижені і результат може бути хибнонегативним.
            </span>
          </div>
          <div className="vfs-tip-item">
            <span>💡</span>
            <span>
              Нормальні дріжджі (Cyniclomyces guttulatus) в мазку схожі на
              ооцисти — помилково сприймаються як кокцидіоз. Точний результат
              дає лише досвідчений лаборант.
            </span>
          </div>
        </div>
      </section>
      <div className="vfs-back">
        <Link to="/" className="vfs-back-link">
          ← Головна
        </Link>
        <ShareButton title="Назва цієї сторінки" />
      </div>
    </main>
  );
};

export default VetFecalSample;
