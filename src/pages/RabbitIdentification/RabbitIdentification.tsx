import { Link } from "react-router-dom";
import "./RabbitIdentification.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const comparisonData = [
  {
    param: "Метод нанесення",
    tattoo:
      "Спеціальні щипці чи ручка з голками проколюють шкіру вуха, у проколи втирають чорнило",
    chip: "Ін'єкція мікрочіпа під шкіру між лопатками за допомогою спеціального шприца-аплікатора",
  },
  {
    param: "Больові відчуття",
    tattoo: "Короткочасний дискомфорт під час процедури",
    chip: "Короткий укол, подібний до звичайної ін'єкції",
  },
  {
    param: "Зчитування",
    tattoo: "Візуально — потрібно розгорнути вухо й прочитати символи оком",
    chip: "Спеціальним сканером — працює навіть якщо тварина злякана чи не дається розгорнути вухо",
  },
  {
    param: "Стандарт для виставок і племінної роботи",
    tattoo:
      "Прийнятий і обов'язковий стандарт у більшості виставкових систем (ARBA та інші)",
    chip: "Не є визнаним стандартом для виставок породистих кролів",
  },
  {
    param: "Ризик міграції під шкірою",
    tattoo: "Відсутній — мітка залишається в тканині вуха назавжди",
    chip: 'Задокументовані випадки "переміщення" чіпа під шкірою з часом',
  },
  {
    param: "Ризик ускладнень",
    tattoo:
      "Мінімальний за правильної техніки; вухо кроля тонке, тому проколи загоюються швидко",
    chip: "Рідкісний, але описаний ризик утворення абсцесу в місці імплантації",
  },
];

const RabbitIdentification = () => {
  return (
    <main className="identification-page">
      <div className="identification-header">
        <h1>🏷️ Ідентифікація кролів: татуювання чи мікрочіп</h1>
        <p>
          Два способи назавжди позначити тварину — і чому в кролівництві досі
          домінує перший
        </p>
      </div>

      <div className="identification-wrap">
        <div className="identification-intro">
          <h2>Навіщо взагалі потрібна постійна ідентифікація</h2>
          <p>
            У племінному господарстві, де кролі схожі між собою за забарвленням
            чи розміром, помилка ідентифікації означає зіпсований родовід,
            помилкове парування близьких родичів чи втрату історії
            продуктивності конкретної тварини. Постійна мітка — на відміну від
            нашийника чи бирки, які можна загубити — вирішує цю проблему раз і
            назавжди.
          </p>
        </div>

        <div className="identification-section-title">
          ⚖️ Порівняння двох методів
        </div>
        <div className="identification-table-wrap">
          <table className="identification-table">
            <thead>
              <tr>
                <th>Параметр</th>
                <th>Татуювання у вухо</th>
                <th>Мікрочіп</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((r) => (
                <tr key={r.param}>
                  <td>
                    <strong>{r.param}</strong>
                  </td>
                  <td>{r.tattoo}</td>
                  <td>{r.chip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="identification-section-title">
          🐇 Чому саме татуювання — стандарт у кролівництві
        </div>
        <div className="identification-note">
          <p>
            Татуювання у вухо — єдиний прийнятий і зазвичай обов'язковий метод
            ідентифікації племінних та виставкових кролів. У системі ARBA
            (Американська асоціація кролівників) особисте татуювання власника
            наносять у ліве вухо, а праве зарезервоване під офіційне
            реєстраційне татуювання. Метод дешевий, швидкий і не вимагає
            спеціального сканера для зчитування — досить просто розгорнути вухо
            на світлі.
          </p>
          <p>
            Типову схему нумерації кожен кролівник розробляє самостійно: хтось
            використовує префікс господарства й наскрізний порядковий номер,
            хтось — окрему нумерацію для самців і самок (детальніше про побудову
            власної системи нумерації — у статті "Історія обліку кролів").
          </p>
        </div>

        <div className="identification-section-title">
          🔬 Коли розглядають мікрочіп
        </div>
        <div className="identification-note">
          <p>
            Мікрочіпування частіше застосовують для декоративних кролів —
            домашніх улюбленців, яких можуть загубити чи яких переміщують через
            кордон (для деяких країн мікрочіп — обов'язкова вимога при
            міжнародних перевезеннях, див. статтю "Імпорт та експорт племінних
            кролів"). Для товарного чи племінного стада мікрочіп зазвичай
            економічно не виправданий через вартість обладнання й самих чіпів у
            перерахунку на велику кількість голів.
          </p>
          <div className="identification-alert warn">
            ⚠️ Деякі ветеринари, що спеціалізуються на кролях, обережно
            ставляться до мікрочіпування саме кролів через тонкість їхньої шкіри
            та особливості її кріплення до підлеглих тканин — це підвищує (хоч і
            залишається рідкісним) ризик міграції чіпа під шкірою з часом
            порівняно з собаками чи котами.
          </div>
        </div>

        <div className="identification-section-title">
          🩹 Практичні поради з татуювання
        </div>
        <div className="identification-facts-grid">
          <div className="identification-fact-card ok">
            <h3>✅ Найкращий вік — з 6–8 тижнів</h3>
            <p>
              Вухо достатньо міцне, а тварина ще досить мала для комфортної
              фіксації.
            </p>
          </div>
          <div className="identification-fact-card ok">
            <h3>✅ Тільки букви й цифри</h3>
            <p>
              Виставкові системи зазвичай забороняють символи в татуюванні —
              плануйте код заздалегідь.
            </p>
          </div>
          <div className="identification-fact-card warn">
            <h3>⚠️ Ведіть записи одразу</h3>
            <p>
              Записуйте присвоєний номер у журнал одразу після процедури — легко
              переплутати свіжі мітки в кількох тварин.
            </p>
          </div>
        </div>

        <div className="identification-note identification-sources">
          <h3>Джерела</h3>
          <ul>
            <li>
              Ohioline (Ohio State University Extension) — Instructions for
              Tattooing Rabbits
            </li>
            <li>Everbreed — The Importance of Rabbit Tattooing</li>
            <li>
              PMC — Evaluation of EMLA Cream for Preventing Pain during
              Tattooing of Rabbits
            </li>
          </ul>
          <p className="identification-disclaimer">
            Матеріал має ознайомчий характер. За детальною консультацією щодо
            конкретного методу ідентифікації, особливо для декоративних кролів,
            зверніться до ветеринара.
          </p>
        </div>

        <div className="identification-related">
          <h3 className="identification-related-title">Читайте також</h3>
          <div className="identification-related-grid">
            <Link to="/history" className="identification-related-link">
              📜 Історія обліку кролів
            </Link>
            <Link
              to="/pedigree-records"
              className="identification-related-link"
            >
              📖 Родоводи та племінний облік
            </Link>
            <Link to="/tools" className="identification-related-link">
              🧰 Інструменти
            </Link>
            <Link
              to="/import-export-rabbits"
              className="identification-related-link"
            >
              🌍 Імпорт та експорт племінних кролів
            </Link>
          </div>
        </div>

        <div className="identification-back">
          <Link to="/" className="identification-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Ідентифікація кролів: татуювання чи мікрочіп" />
        </div>
      </div>
    </main>
  );
};

export default RabbitIdentification;
