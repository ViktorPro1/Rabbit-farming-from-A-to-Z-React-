import { useState } from "react";
import { Link } from "react-router-dom";
import "./Enrichment.css";

interface Category {
  icon: string;
  title: string;
  text: string;
}

interface DiyToy {
  title: string;
  text: string;
}

interface Faq {
  claim: string;
  truth: string;
}

const categories: Category[] = [
  {
    icon: "🪵",
    title: "Гризти",
    text: "У кролів зуби ростуть постійно, тому гризіння — фізіологічна потреба, а не забаганка. Гілки яблуні, верби чи ліщини без обробки, дерев'яні кубики та коробки з-під яєць дають безпечний вихід цій потребі.",
  },
  {
    icon: "🕳️",
    title: "Копати",
    text: "Копання — природна поведінка, навіть якщо кролик ніколи не жив у норі. Коробка з подрібненим папером, сіном чи спеціальним субстратом для копання перенаправляє цю потребу з килима чи дивана.",
  },
  {
    icon: "🥕",
    title: "Шукати їжу",
    text: "У природі кролик проводить більшість дня в пошуку їжі. Розкидані по сіну гранули чи трави, кульки-годівниці з отворами перетворюють їжу на розумову активність, а не просто наповнення миски.",
  },
  {
    icon: "📦",
    title: "Досліджувати",
    text: "Тунелі з картону чи верболозу, коробки з прорізаними отворами дають відчуття укриття і водночас простір для руху — це знижує тривожність так само, як і фізичну нудьгу.",
  },
  {
    icon: "🪜",
    title: "Лазити та стрибати",
    text: "Невисокі платформи, рампи чи стійкий ящик для застрибування задіюють м'язи, які інакше не працюють у клітці. Висота і стійкість конструкції важливіші за розмір.",
  },
];

const diyToys: DiyToy[] = [
  {
    title: "Рулон від паперових рушників, набитий сіном",
    text: "Простий форейджинг-об'єкт: кролик і риє сіно, і гризе картон.",
  },
  {
    title: "Картонна коробка з отворами",
    text: "Кілька прорізаних лазів перетворюють звичайну коробку на тунель для дослідження.",
  },
  {
    title: "Паперовий пакет без ручок, набитий зеленню",
    text: "Ручки прибирають заздалегідь, щоб кролик не заплутався. Всередину кладуть сіно чи листя.",
  },
  {
    title: "М'яч із верболозу",
    text: "Природний матеріал для гризіння й перекочування лапами — не містить фарб і клею.",
  },
];

const faqs: Faq[] = [
  {
    claim: "Кролик нищить речі, бо мстить господарю",
    truth:
      "Гризіння меблів чи килима — майже завжди нудьга або нереалізована потреба точити зуби, а не емоційна відповідь на людину.",
  },
  {
    claim: "Мотузки й шпагат — гарна іграшка для гризіння",
    truth:
      "Волокна мотузок і шпагату небезпечні при проковтуванні: вони здатні викликати непрохідність кишківника. Краще обирати суцільні матеріали — дерево, картон, солому.",
  },
  {
    claim: "Пластикові іграшки для гризунів підходять і кролику",
    truth:
      "Дрібні пластикові деталі кролик може відкусити і проковтнути. Безпечніші природні матеріали: необроблене дерево, лоза, картон без друкованої фарби.",
  },
  {
    claim: "Клітка з мискою й сінником — достатньо стимуляції",
    truth:
      "Без щоденної зміни об'єктів і можливості копати, шукати їжу чи ховатися навіть простора клітка не задовольняє поведінкові потреби кролика.",
  },
];

export default function Enrichment() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="enr-page">
      <header className="enr-hero">
        <span className="enr-eyebrow">Поведінка та стимуляція</span>
        <h1 className="enr-title">
          Збагачення середовища
          <span className="enr-title-accent">чим зайняти кролика вдома</span>
        </h1>
        <p className="enr-lede">
          Кролику без справ швидко стає нудно, а нудьга майже завжди виходить
          боком меблям і килиму. П'ять напрямів природної поведінки — і як дати
          їм вихід безпечно.
        </p>
      </header>

      <section className="enr-categories" aria-label="Напрями активності">
        <div className="enr-category-grid">
          {categories.map((c) => (
            <article className="enr-category-card" key={c.title}>
              <span className="enr-category-icon" aria-hidden="true">
                {c.icon}
              </span>
              <h2 className="enr-category-title">{c.title}</h2>
              <p className="enr-category-text">{c.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="enr-diy" aria-label="Саморобні іграшки">
        <h2 className="enr-section-heading">Саморобні іграшки за 5 хвилин</h2>
        <div className="enr-diy-list">
          {diyToys.map((d) => (
            <div className="enr-diy-item" key={d.title}>
              <h3 className="enr-diy-title">{d.title}</h3>
              <p className="enr-diy-text">{d.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="enr-faq" aria-label="Міфи про іграшки та нудьгу">
        <h2 className="enr-section-heading">Міфи та безпека матеріалів</h2>
        <div className="enr-faq-list">
          {faqs.map((f, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                className={`enr-faq-item${isOpen ? " enr-faq-item--open" : ""}`}
                key={f.claim}
              >
                <button
                  className="enr-faq-trigger"
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span>{f.claim}</span>
                  <span className="enr-faq-icon">{isOpen ? "–" : "+"}</span>
                </button>
                {isOpen && <p className="enr-faq-truth">{f.truth}</p>}
              </div>
            );
          })}
        </div>
      </section>

      <div className="enr-related">
        <h3 className="enr-related-title">Читайте також</h3>
        <div className="enr-related-grid">
          <Link to="/apartment-proofing" className="enr-related-link">
            🛋️ Кролик-пруфінг квартири
          </Link>
          <Link to="/companion-bonding" className="enr-related-link">
            👥 Один чи два кролики
          </Link>
          <Link to="/rabbit-behavior-problems" className="enr-related-link">
            😤 Проблемна поведінка
          </Link>
        </div>
      </div>

      <footer className="enr-footer">
        <p>
          Матеріал підготовлено на основі загальноприйнятих рекомендацій щодо
          поведінки та збагачення середовища домашніх кролів. Раптова зміна
          активності чи апетиту — привід звернутися до ветеринара, а не лише
          додати іграшок.
        </p>
      </footer>
    </div>
  );
}
