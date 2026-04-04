import { Link } from "react-router-dom";
import "./SectionCards.css";

const cards = [
  {
    icon: "🐇",
    title: "Породи",
    desc: "Огляд популярних порід",
    path: "/breeds",
  },
  {
    icon: "🏠",
    title: "Клітки",
    desc: "Облаштування житла",
    path: "/enclosure",
  },
  {
    icon: "🏡",
    title: "Підлогове утримання",
    desc: "Утримання на підлозі",
    path: "/floor-care",
  },
  {
    icon: "🥕",
    title: "Годування",
    desc: "Раціон та харчування",
    path: "/feeding",
  },
  {
    icon: "🍼",
    title: "Окріл",
    desc: "Розмноження та догляд за молодняком",
    path: "/okril",
  },
  { icon: "🧹", title: "Догляд", desc: "Чистота та гігієна", path: "/care" },
  {
    icon: "💉",
    title: "Вакцинація",
    desc: "Щеплення та графік",
    path: "/vaccinations",
  },
  {
    icon: "🦟",
    title: "Паразити",
    desc: "Профілактика та лікування",
    path: "/parasites",
  },
  {
    icon: "💊",
    title: "Хвороби",
    desc: "Хвороби та лікування",
    path: "/diseases",
  },
  {
    icon: "🚑",
    title: "Перша допомога",
    desc: "Екстрені ситуації та аптечка",
    path: "/first-aid",
  },
  {
    icon: "🧮",
    title: "Калькулятор",
    desc: "Зернова суміш і Дати розведення",
    path: "/calculator",
  },
  {
    icon: "💡",
    title: "Поради",
    desc: "Практичні поради господаря",
    path: "/tips",
  },
];

const SectionCards = () => {
  return (
    <section className="section-cards">
      <h2 className="section-cards-title">Розділи довідника</h2>
      <div className="section-cards-grid">
        {cards.map((card) => (
          <Link to={card.path} key={card.path} className="section-card">
            <span className="section-card-icon">{card.icon}</span>
            <span className="section-card-title">{card.title}</span>
            <span className="section-card-desc">{card.desc}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default SectionCards;
