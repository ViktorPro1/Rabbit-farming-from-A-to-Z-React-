import { Link } from "react-router-dom";
import "./SecondaryHyperparathyroidism.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const signs = [
  {
    sign: "Розм'якшення кісток щелепи",
    note: "Веде до розхитування зубів і стоматологічних проблем",
  },
  {
    sign: "Патологічні переломи",
    note: "Кістки ламаються за незначного навантаження",
  },
  { sign: "Деформація хребта чи тазу", note: "При тривалому дефіциті" },
  { sign: "Кульгавість, біль при русі", note: "" },
  { sign: "Уповільнений ріст у молодняку", note: "" },
  {
    sign: "Стоматологічні захворювання",
    note: "Втрата щільності кістки навколо коренів зубів полегшує їх розхитування",
  },
];

const SecondaryHyperparathyroidism = () => {
  return (
    <main className="hyperpara-page">
      <div className="hyperpara-header">
        <h1>🦴 Вторинний гіперпаратиреоз</h1>
        <p>
          Зворотна сторона унікального обміну кальцію у кролів — коли кальцію
          замало, а не забагато
        </p>
      </div>

      <div className="hyperpara-wrap">
        <div className="hyperpara-intro">
          <h2>Чому це протилежність сечокам'яної хвороби</h2>
          <p>
            У статті про сечокам'яну хворобу йдеться про те, що трапляється,
            коли кальцію в раціоні кроля забагато. Вторинний гіперпаратиреоз —
            дзеркальна протилежність: стан, коли кальцію в раціоні замало (чи
            порушено співвідношення кальцію та фосфору), і організм компенсує це
            за рахунок власних кісток.
          </p>
          <p>
            Кролі мають унікальний обмін кальцію: на відміну від більшості
            ссавців, вони ефективно всмоктують кальцій з їжі й виводять надлишок
            нирками. Коли ж кальцію в раціоні хронічно бракує, паращитоподібні
            залози починають виробляти надмірну кількість паратиреоїдного
            гормону (ПТГ), щоб підтримати рівень кальцію в крові — а цей гормон
            "витягує" кальцій із кісток.
          </p>
          <div className="hyperpara-alert danger">
            🔴 За результатами дослідження на кроленятах, раціон з дефіцитом
            кальцію (0,026% замість норми) уже за 10 тижнів викликав значне
            зниження рівня кальцію в крові, підвищення рівня ПТГ і суттєве
            вповільнення накопичення кісткової маси порівняно з тваринами на
            нормальному раціоні.
          </div>
        </div>

        <div className="hyperpara-section-title">🌡️ Симптоми та наслідки</div>
        <div className="hyperpara-table-wrap">
          <table className="hyperpara-table">
            <thead>
              <tr>
                <th>Ознака</th>
                <th>Примітка</th>
              </tr>
            </thead>
            <tbody>
              {signs.map((s) => (
                <tr key={s.sign}>
                  <td>
                    <strong>{s.sign}</strong>
                  </td>
                  <td>{s.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="hyperpara-alert warn">
          ⚠️ Особливо важливий зв'язок зі стоматологічними проблемами:
          дослідники відзначають, що втрата щільності кісткової тканини щелепи
          через дефіцит кальцію може бути одним з факторів, що сприяють розвитку
          набутих зубних хвороб у домашніх кролів — тобто хронічний дефіцит
          кальцію в раціоні може непрямо підвищувати ризик абсцесів зубного
          походження (див. статтю про абсцеси).
        </div>

        <div className="hyperpara-section-title">🧪 Діагностика</div>
        <div className="hyperpara-note">
          <ul>
            <li>
              Аналіз крові — знижений кальцій, підвищений фосфор, підвищений
              рівень паратиреоїдного гормону
            </li>
            <li>
              Рентген — ознаки зниженої щільності кісток, зокрема щелепи й
              черепа, компресійні деформації хребців
            </li>
            <li>
              За можливості — КТ голови, особливо якщо є супутні стоматологічні
              проблеми
            </li>
          </ul>
        </div>

        <div className="hyperpara-section-title">
          💊 Лікування та зворотність
        </div>
        <div className="hyperpara-note">
          <p>
            Гарна новина: за результатами того ж дослідження, наслідки дефіциту
            кальцію у кроленят виявились швидко зворотними — після переведення
            тварин на раціон з достатньою кількістю кальцію показники крові й
            накопичення кісткової маси швидко нормалізувались. Це свідчить, що
            рання корекція раціону дає хороший прогноз, особливо в молодих
            тварин, поки кістки ще активно ростуть.
          </p>
          <p>
            Лікування зводиться передусім до корекції раціону під наглядом
            ветеринара — без самостійного різкого додавання кальцієвих добавок,
            оскільки надлишок кальцію несе свій власний ризик (сечокам'яна
            хвороба). Конкретну схему й дозування визначає фахівець на основі
            аналізів.
          </p>
        </div>

        <div className="hyperpara-section-title">
          🛡️ Профілактика: правильний баланс, а не крайнощі
        </div>
        <div className="hyperpara-facts-grid">
          <div className="hyperpara-fact-card ok">
            <h3>✅ Збалансований, а не мінімізований кальцій</h3>
            <p>
              За науковими даними, рівень кальцію близько 0,22% раціону
              підтримує нормальний ріст, а 0,35–0,4% — оптимальний для
              формування кісток у молодняку.
            </p>
          </div>
          <div className="hyperpara-fact-card ok">
            <h3>✅ Правильне співвідношення кальцію й фосфору</h3>
            <p>
              Дефіцит кальцію на тлі надлишку фосфору — найшвидший шлях до
              гіперпаратиреозу.
            </p>
          </div>
          <div className="hyperpara-fact-card warn">
            <h3>⚠️ Не впадайте в крайність через страх сечокам'яної хвороби</h3>
            <p>
              Повне виключення кальцію з раціону через побоювання каменів у
              сечовому міхурі — так само небезпечна помилка, як і його надлишок.
            </p>
          </div>
        </div>

        <div className="hyperpara-note hyperpara-sources">
          <h3>Джерела</h3>
          <ul>
            <li>
              Sharp C. A. et al. — Calcium deficiency-induced secondary
              hyperparathyroidism and osteopenia are rapidly reversible with
              calcium supplementation in growing rabbit pups, British Journal of
              Nutrition, PubMed
            </li>
            <li>
              Bas S. et al. — Nutritional secondary hyperparathyroidism in
              rabbits, Domestic Animal Endocrinology, ScienceDirect
            </li>
            <li>
              Eckermann-Ross C. — Hormonal Regulation and Calcium Metabolism in
              the Rabbit, Veterinary Clinics of North America: Exotic Animal
              Practice
            </li>
            <li>
              dvm360 — Rabbit calcium metabolism, "bladder sludge," and
              urolithiasis
            </li>
          </ul>
          <p className="hyperpara-disclaimer">
            Матеріал має ознайомчий характер і не замінює огляд ліцензованого
            ветеринара. Корекцію раціону при підозрі на дефіцит чи надлишок
            кальцію варто узгоджувати з фахівцем.
          </p>
        </div>

        <div className="hyperpara-related">
          <h3 className="hyperpara-related-title">Читайте також</h3>
          <div className="hyperpara-related-grid">
            <Link to="/rabbit-urolithiasis" className="hyperpara-related-link">
              💧 Сечокам'яна хвороба
            </Link>
            <Link to="/rabbit-abscesses" className="hyperpara-related-link">
              🩹 Абсцеси у кролів
            </Link>
            <Link to="/feeding" className="hyperpara-related-link">
              🥕 Годування
            </Link>
            <Link to="/grooming" className="hyperpara-related-link">
              ✂️ Кігті та зуби
            </Link>
          </div>
        </div>

        <div className="hyperpara-back">
          <Link to="/" className="hyperpara-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Вторинний гіперпаратиреоз у кролів" />
        </div>
      </div>
    </main>
  );
};

export default SecondaryHyperparathyroidism;
