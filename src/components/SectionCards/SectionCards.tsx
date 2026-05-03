import { Link } from "react-router-dom";
import "./SectionCards.css";

const cards = [
  // 1. ПОЧАТОК — знайомство з твариною
  {
    icon: "🐇",
    title: "Породи",
    desc: "Огляд популярних порід",
    path: "/breeds",
  },
  {
    icon: "🧬",
    title: "Схрещування",
    desc: "Які породи з якими схрещувати",
    path: "/breeding",
  },
  {
    icon: "🔬",
    title: "Селекція",
    desc: "Відбір та покращення породних якостей",
    path: "/selection",
  },

  // 2. ЖИТЛО — перше що потрібно до покупки
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
    icon: "🕳️",
    title: "Ямове утримання",
    desc: "Будівництво, догляд, нюанси",
    path: "/pit-keeping",
  },

  // 3. ХАРЧУВАННЯ — щодня
  {
    icon: "🥕",
    title: "Годування",
    desc: "Раціон та харчування",
    path: "/feeding",
  },
  {
    icon: "🌿",
    title: "Листя та гілки",
    desc: "Які листя та гілки можна давати",
    path: "/leaves",
  },
  {
    icon: "🌾",
    title: "Кормові культури",
    desc: "Що посіяти для кроликів на ділянці",
    path: "/crops",
  },

  // 4. ДОГЛЯД — щодня
  { icon: "🧹", title: "Догляд", desc: "Чистота та гігієна", path: "/care" },
  {
    icon: "🧴",
    title: "Дезінфекція",
    desc: "Препарати, пропорції, схеми обробки",
    path: "/disinfection",
  },

  // 5. РОЗВЕДЕННЯ
  {
    icon: "🍼",
    title: "Окріл",
    desc: "Розмноження та догляд за молодняком",
    path: "/okril",
  },
  {
    icon: "⚖️",
    title: "Контроль ваги",
    desc: "Норми приросту, зважування",
    path: "/weight-control",
  },

  // 6. ЗДОРОВ'Я
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
    icon: "🩺",
    title: "Хвороби",
    desc: "Хвороби та лікування",
    path: "/diseases",
  },
  {
    icon: "💊",
    title: "Препарати",
    desc: "Ліки, уколи, мазі та дозування",
    path: "/medicines",
  },
  {
    icon: "🏥",
    title: "Схеми лікування",
    desc: "Покрокові схеми при хворобах",
    path: "/treatment",
  },
  {
    icon: "🚑",
    title: "Перша допомога",
    desc: "Екстрені ситуації та аптечка",
    path: "/first-aid",
  },

  // 7. ПЛАНУВАННЯ
  {
    icon: "📅",
    title: "Сезонний календар",
    desc: "Що робити по місяцях",
    path: "/calendar",
  },
  {
    icon: "💡",
    title: "Поради",
    desc: "Практичні поради господаря",
    path: "/tips",
  },

  // 8. ІНСТРУМЕНТИ
  {
    icon: "🧮",
    title: "Калькулятор",
    desc: "Зернова суміш і Дати розведення",
    path: "/calculator",
  },
  {
    icon: "⚙️",
    title: "Обладнання",
    desc: "Гранулятор, екструдер, траворізка, змішувач",
    path: "/equipment",
  },

  {
    icon: "🧰",
    title: "Інструменти",
    desc: "Що потрібно кролівнику в господарстві",
    path: "/tools",
  },

  // 9. ФІНАЛ
  {
    icon: "🔪",
    title: "Забій та переробка",
    desc: "Підготовка, технологія, зберігання",
    path: "/slaughter",
  },

  // 9. РЕЦЕПТИ
  {
    icon: "🍽️",
    title: "Рецепти",
    desc: "Тушонка, копчення, смаження кролика",
    path: "/recipes",
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
