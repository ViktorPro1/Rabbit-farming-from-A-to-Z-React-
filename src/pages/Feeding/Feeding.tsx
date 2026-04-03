import { Link } from "react-router-dom";
import "./Feeding.css";

const allowedFoods = [
  {
    product: "Люцерна (сіно)",
    status: "allowed",
    note: "Багата на білки та кальцій, стимулює ріст молодняку, підходить вагітним та годуючим самкам.",
  },
  {
    product: "Конюшина (сіно)",
    status: "allowed",
    note: "Містить білок і мінерали, покращує травлення, давати в невеликих кількостях.",
  },
  {
    product: "Морква, кабачки, буряк",
    status: "allowed",
    note: "Джерело вітамінів і мінералів, вводити поступово.",
  },
  {
    product: "Тимофіївка",
    status: "allowed",
    note: "Оптимальна для дорослих кроликів, низький кальцій, підтримує травлення.",
  },
  {
    product: "Молочай (трава)",
    status: "forbidden",
    note: "Токсична для кроликів, викликає отруєння та проблеми з травленням.",
  },
  {
    product: "Блекота",
    status: "forbidden",
    note: "Сильна токсична трава, не давати ніколи.",
  },
];

const Feeding = () => {
  return (
    <main className="feeding-page">
      <div className="feeding-header">
        <h1>Годування кроликів</h1>
        <p>
          Детальний довідник — що можна, що не можна і як правильно годувати
        </p>
      </div>

      <div className="feeding-wrap">
        <div className="feeding-section">
          <h2>Вступ</h2>
          <p>
            Цей довідник допоможе зрозуміти, які корми та трави дозволені, які –
            заборонені, та як правильно годувати кроликів. Тут описані
            властивості кожного виду трав, овочів і зернових, приклади меню та
            поради для різного віку.
          </p>
        </div>

        <div className="feeding-section">
          <h2>1. Основи годування</h2>
          <p>
            Раціон кролика повинен бути збалансованим: білки, клітковина,
            мінерали, вітаміни. Основні складові: сіно, трави, овочі, зернові.
            Вода – завжди свіжою і вільно доступною.
          </p>
        </div>

        <div className="feeding-section">
          <h2>2. Сіно та трави</h2>
          <p>
            Сіно – основа раціону, забезпечує клітковину та сточування зубів.
            Основні види:
          </p>
          <ul className="feeding-list">
            <li>
              <strong>Люцерна:</strong> багата на білок та кальцій, корисна для
              молодняку та вагітних самок.
            </li>
            <li>
              <strong>Конюшина:</strong> містить білки та мінерали, стимулює
              травлення. Краще давати прив'яненою.
            </li>
            <li>
              <strong>Тимофіївка:</strong> оптимальна для дорослих кроликів,
              низький кальцій, покращує травлення.
            </li>
            <li>
              <strong>Костриця:</strong> різноманітність раціону, легко
              перетравлюється, додає клітковини.
            </li>
          </ul>
        </div>

        <div className="feeding-section">
          <h2>3. Овочі та фрукти</h2>
          <ul className="feeding-list">
            <li>
              <strong>Дозволено:</strong> морква, буряк, кабачки, гарбуз,
              петрушка, яблука, груші без кісточок.
            </li>
            <li>
              <strong>Заборонено:</strong> картопля, бобові, авокадо, цибуля,
              часник, цитрусові.
            </li>
          </ul>
        </div>

        <div className="feeding-section">
          <h2>4. Зернові</h2>
          <ul className="feeding-list">
            <li>
              <strong>Пшениця</strong> – основне джерело енергії.
            </li>
            <li>
              <strong>Ячмінь</strong> – покращує травлення.
            </li>
            <li>
              <strong>Овес</strong> – стимулює обмін речовин.
            </li>
          </ul>
          <p>
            Зернові дають у невеликих кількостях. Не замінюють сіно чи трави.
          </p>
        </div>

        <div className="feeding-section">
          <h2>5. Годування за віком</h2>
          <ul className="feeding-list">
            <li>
              <strong>Молодняк:</strong> більше білка, пророщене зерно, невелика
              кількість овочів, багато сіна.
            </li>
            <li>
              <strong>Дорослі кролики:</strong> збалансоване сіно, овочі,
              зернові помірно.
            </li>
            <li>
              <strong>Вагітні та годуючі самки:</strong> збільшений білок,
              більше овочів та трав.
            </li>
          </ul>
        </div>

        <div className="feeding-section">
          <h2>6. Сезонні особливості</h2>
          <p>
            Влітку більше свіжої трави та овочів, менше зернових. Взимку –
            більше сіна та зернових сумішей, овочі у сухому вигляді або
            заморожені.
          </p>
        </div>

        <div className="feeding-section">
          <h2>7. Приклади щоденного меню</h2>
          <ul className="feeding-list">
            <li>
              <strong>Молодняк:</strong> 200 г сіна, 50 г овочів, 30 г зернових.
            </li>
            <li>
              <strong>Дорослі:</strong> 250 г сіна, 70 г овочів, 40 г зернових.
            </li>
          </ul>
        </div>

        <div className="feeding-section">
          <h2>Що можна і що заборонено</h2>
          <div className="feeding-table-wrap">
            <table className="feeding-table">
              <thead>
                <tr>
                  <th>Продукт</th>
                  <th>Статус</th>
                  <th>Пояснення</th>
                </tr>
              </thead>
              <tbody>
                {allowedFoods.map((item) => (
                  <tr key={item.product}>
                    <td>{item.product}</td>
                    <td>
                      <span className={`feeding-badge ${item.status}`}>
                        {item.status === "allowed"
                          ? "✅ Дозволено"
                          : "❌ Заборонено"}
                      </span>
                    </td>
                    <td>{item.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="feeding-back">
          <Link to="/" className="feeding-back-btn">
            ⬅ На головну
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Feeding;
