import { useState } from "react";
import { Link } from "react-router-dom";
import "./ApartmentProofing.css";

interface Hazard {
  icon: string;
  title: string;
  text: string;
}

interface Zone {
  room: string;
  items: string[];
}

const hazards: Hazard[] = [
  {
    icon: "🔌",
    title: "Дроти та кабелі",
    text: "Кролик гризе дроти інстинктивно — це схоже на корінці рослин. Оголений провід під напругою може вбити тварину миттєво. Усі доступні кабелі варто сховати в кабель-канали або підняти над рівнем підлоги.",
  },
  {
    icon: "🪴",
    title: "Кімнатні рослини",
    text: "Багато популярних кімнатних рослин — діффенбахія, філодендрон, алое, плющ — токсичні для кролів навіть у невеликій кількості. Безпечніше прибрати їх з підлоги і низьких поличок повністю.",
  },
  {
    icon: "🪑",
    title: "Меблі та плінтуси",
    text: "Дерев'яні ніжки столів, кути дивана й плінтуси — улюблена ціль для точіння зубів. Гіркий спрей для меблів або тимчасові бар'єри з оргскла захищають і меблі, і зуби кролика.",
  },
  {
    icon: "🧦",
    title: "Дрібні предмети",
    text: "Шкарпетки, гумки, дитячі іграшки — усе, що кролик може проковтнути, треба прибирати з підлоги. Проковтнутий сторонній предмет здатний викликати непрохідність кишківника.",
  },
  {
    icon: "🧹",
    title: "Побутова хімія",
    text: "Засоби для прибирання, добрива, ліки людини мають зберігатися за зачиненими дверцятами — кролик легко дістається до нижніх полиць і шаф.",
  },
];

const zones: Zone[] = [
  {
    room: "Вітальня",
    items: [
      "Підняти або сховати дроти телевізора й роутера",
      "Захистити кути дивана та ніжки столу",
      "Прибрати кімнатні рослини з підлоги",
    ],
  },
  {
    room: "Кухня",
    items: [
      "Закрити доступ до сміттєвого відра",
      "Тримати шафи з хімією зачиненими",
      "Не залишати їжу зі столу в зоні досяжності",
    ],
  },
  {
    room: "Спальня / дитяча",
    items: [
      "Прибрати дрібні іграшки з підлоги",
      "Заховати зарядні кабелі під ліжком",
      "Перевірити, чи немає щілин за шафами, куди кролик може застрягти",
    ],
  },
];

export default function ApartmentProofing() {
  const [openZone, setOpenZone] = useState<number | null>(0);

  return (
    <div className="apf-page">
      <header className="apf-hero">
        <span className="apf-eyebrow">Безпечний простір</span>
        <h1 className="apf-title">
          Кролик-пруфінг квартири
          <span className="apf-title-accent">що прибрати перед вигулом</span>
        </h1>
        <p className="apf-lede">
          Кролик досліджує світ зубами. Перш ніж дати вільний вигул по кімнаті,
          варто пройтися по ній очима кролика — на рівні підлоги — і прибрати
          все, що може нашкодити йому чи будинку.
        </p>
      </header>

      <section className="apf-hazards" aria-label="Основні небезпеки">
        <h2 className="apf-section-heading">На що звернути увагу</h2>
        <div className="apf-hazard-grid">
          {hazards.map((h) => (
            <article className="apf-hazard-card" key={h.title}>
              <span className="apf-hazard-icon" aria-hidden="true">
                {h.icon}
              </span>
              <h3 className="apf-hazard-title">{h.title}</h3>
              <p className="apf-hazard-text">{h.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="apf-zones" aria-label="Перевірка по кімнатах">
        <h2 className="apf-section-heading">Перевірка по кімнатах</h2>
        <div className="apf-zone-list">
          {zones.map((z, i) => {
            const isOpen = openZone === i;
            return (
              <div
                className={`apf-zone${isOpen ? " apf-zone--open" : ""}`}
                key={z.room}
              >
                <button
                  className="apf-zone-trigger"
                  onClick={() => setOpenZone(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span>{z.room}</span>
                  <span className="apf-zone-icon">{isOpen ? "–" : "+"}</span>
                </button>
                {isOpen && (
                  <ul className="apf-zone-items">
                    {z.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="apf-note" aria-label="Порада щодо манежу">
        <p>
          Якщо повністю убезпечити кімнату складно — тимчасовий манеж чи
          загороджена зона дають кролику простір для руху без ризику для нього й
          для речей у квартирі.
        </p>
      </section>

      <div className="apf-related">
        <h3 className="apf-related-title">Читайте також</h3>
        <div className="apf-related-grid">
          <Link to="/litter-training" className="apf-related-link">
            🚽 Привчання до лотка
          </Link>
          <Link to="/enrichment" className="apf-related-link">
            🧸 Збагачення середовища
          </Link>
          <Link to="/companion-bonding" className="apf-related-link">
            👥 Один чи два кролики
          </Link>
          <Link to="/rabbit-behavior-problems" className="apf-related-link">
            😤 Проблемна поведінка
          </Link>
        </div>
      </div>

      <footer className="apf-footer">
        <p>
          Матеріал підготовлено на основі загальноприйнятих рекомендацій щодо
          безпечного утримання домашніх кролів. З питань щодо конкретної
          отруйної рослини чи стану тварини звертайтеся до ветеринарного лікаря.
        </p>
      </footer>
    </div>
  );
}
