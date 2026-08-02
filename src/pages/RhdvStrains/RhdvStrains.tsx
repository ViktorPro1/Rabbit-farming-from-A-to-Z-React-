import { Link } from "react-router-dom";
import "./RhdvStrains.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const comparisonData = [
  {
    param: "Повна назва",
    rhdv1: "RHDV / RHDVa (класичний тип 1)",
    rhdv2: "RHDV2 (тип 2, GI.2)",
  },
  {
    param: "Вік уражених тварин",
    rhdv1:
      "Переважно дорослі; молодняк до 8–10 тижнів часто перехворює без симптомів",
    rhdv2: "Уражає тварин будь-якого віку, включно з молодняком",
  },
  {
    param: "Летальність",
    rhdv1: "Дуже висока в дорослих (близько 90%)",
    rhdv2:
      "У середньому дещо нижча, ніж у RHDV1, але варіюється залежно від штаму і з часом зростає",
  },
  {
    param: "Перебіг хвороби",
    rhdv1: "Швидкий, гостріший",
    rhdv2: "Часто повільніший, більш затяжний перебіг",
  },
  {
    param: "Перехресний захист вакцин",
    rhdv1: "Вакцина проти RHDV1 не захищає надійно від RHDV2",
    rhdv2: "Вакцина проти RHDV2 не захищає надійно від RHDV1",
  },
  {
    param: "Поширеність у світі станом на останні роки",
    rhdv1: "Класичний штам, витісняється RHDV2 у багатьох регіонах",
    rhdv2: "Став домінантним циркулюючим штамом у більшості регіонів світу",
  },
];

const RhdvStrains = () => {
  return (
    <main className="rhdvstrains-page">
      <div className="rhdvstrains-header">
        <h1>🦠 RHDV1 проти RHDV2: чому важливо знати різницю</h1>
        <p>
          Два штами вірусної геморагічної хвороби кролів з мінімальним
          перехресним захистом між вакцинами
        </p>
      </div>

      <div className="rhdvstrains-wrap">
        <div className="rhdvstrains-intro">
          <h2>Чому це не просто теорія</h2>
          <p>
            Вірусна геморагічна хвороба кролів (ВГХК) викликається вірусом
            родини Caliciviridae. Історично існував один класичний штам (RHDV,
            іноді разом з підваріантом RHDVa — їх зазвичай об'єднують під назвою
            RHDV1). У 2010 році з'явився новий, генетично відмінний штам —
            RHDV2, який з часом витіснив класичний тип у більшості регіонів
            світу і став домінантним.
          </p>
          <div className="rhdvstrains-alert danger">
            🔴 Головний практичний висновок: перехресний захист між цими двома
            штамами мінімальний. Вакцинація лише проти RHDV1 не гарантує
            надійного захисту від RHDV2, і навпаки. Це означає, що при виборі
            вакцини важливо знати, який саме штам (чи обидва одразу) вона
            покриває — а не просто "вакцинувати проти ВГХК" загалом.
          </div>
        </div>

        <div className="rhdvstrains-section-title">⚖️ Порівняльна таблиця</div>
        <div className="rhdvstrains-table-wrap">
          <table className="rhdvstrains-table">
            <thead>
              <tr>
                <th>Параметр</th>
                <th>RHDV1</th>
                <th>RHDV2</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((r) => (
                <tr key={r.param}>
                  <td>
                    <strong>{r.param}</strong>
                  </td>
                  <td>{r.rhdv1}</td>
                  <td>{r.rhdv2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rhdvstrains-section-title">
          🐇 Чому вразливість молодняку — критична відмінність
        </div>
        <div className="rhdvstrains-note">
          <p>
            Одна з найважливіших практичних відмінностей для кролівника:
            класичний RHDV1 зазвичай не викликає тяжкої хвороби в кроленят
            молодше 8–10 тижнів — молодняк часто перехворює безсимптомно і
            набуває природного імунітету. RHDV2 натомість здатний викликати
            смертельну хворобу навіть у зовсім молодих тварин. Це означає, що
            господарства, які покладались на "природний захист молодняку" від
            класичного штаму, можуть зазнати важких втрат саме серед молодняку
            при спалаху RHDV2.
          </p>
        </div>

        <div className="rhdvstrains-section-title">
          💉 Що це означає для вибору вакцини
        </div>
        <div className="rhdvstrains-facts-grid">
          <div className="rhdvstrains-fact-card warn">
            <h3>⚠️ Перевіряйте, від якого штаму захищає вакцина</h3>
            <p>
              Моновалентні вакцини захищають лише від одного штаму — RHDV1 або
              RHDV2, залежно від препарату.
            </p>
          </div>
          <div className="rhdvstrains-fact-card ok">
            <h3>✅ Комбіновані (полівалентні) вакцини</h3>
            <p>
              Існують вакцини, розроблені для захисту одразу від обох штамів (а
              деякі — ще й від міксоматозу одночасно) — уточнюйте це в
              конкретного виробника чи ветеринара.
            </p>
          </div>
          <div className="rhdvstrains-fact-card warn">
            <h3>⚠️ З'ясуйте, який штам домінує у вашому регіоні</h3>
            <p>
              RHDV2 став домінантним у більшості регіонів світу — при виборі
              вакцини варто орієнтуватись передусім на актуальну епізоотичну
              ситуацію.
            </p>
          </div>
        </div>

        <div className="rhdvstrains-section-title">
          🧪 Діагностика конкретного штаму
        </div>
        <div className="rhdvstrains-note">
          <p>
            Клінічно RHDV1 і RHDV2 практично неможливо розрізнити — обидва
            викликають раптову загибель, крововиливи у внутрішні органи, подібну
            патологоанатомічну картину. Точне визначення штаму можливе лише
            лабораторними методами (ПЛР з визначенням генотипу) в
            спеціалізованій ветеринарній лабораторії — див. статтю "Лабораторна
            діагностика".
          </p>
        </div>

        <div className="rhdvstrains-note rhdvstrains-sources">
          <h3>Джерела</h3>
          <ul>
            <li>
              Washington State Dept. of Agriculture — Rabbit Hemorrhagic Disease
            </li>
            <li>
              Vaccination against Rabbit Hemorrhagic Disease Virus 2 (RHDV2)
              Using a Baculovirus Recombinant Vaccine Provides Durable Immunity
              in Rabbits, PMC, 2024
            </li>
            <li>
              Immunological Cross-Protection between Different Rabbit
              Hemorrhagic Disease Viruses, PubMed, 2022
            </li>
            <li>
              Novel Trivalent Vectored Vaccine for Control of Myxomatosis and
              Disease Caused by Classical and a New Genotype of RHDV, PMC
            </li>
            <li>
              Diagnosis of a Rabbit Hemorrhagic Disease Virus 2 (RHDV2) and the
              Humoral Immune Protection Effect of VP60 Vaccine, PMC
            </li>
          </ul>
          <p className="rhdvstrains-disclaimer">
            Матеріал має ознайомчий характер і не замінює консультацію
            ліцензованого ветеринара. Конкретну схему вакцинації та вибір
            препарату визначайте разом із фахівцем з урахуванням актуальної
            епізоотичної ситуації у вашому регіоні.
          </p>
        </div>

        <div className="rhdvstrains-related">
          <h3 className="rhdvstrains-related-title">Читайте також</h3>
          <div className="rhdvstrains-related-grid">
            <Link to="/vaccinations" className="rhdvstrains-related-link">
              💉 Вакцинація
            </Link>
            <Link to="/vaccine-reactions" className="rhdvstrains-related-link">
              ⚠️ Побічні реакції на вакцинацію
            </Link>
            <Link to="/diseases" className="rhdvstrains-related-link">
              🩺 Хвороби
            </Link>
            <Link to="/lab-diagnostics" className="rhdvstrains-related-link">
              🧪 Лабораторна діагностика
            </Link>
          </div>
        </div>

        <div className="rhdvstrains-back">
          <Link to="/" className="rhdvstrains-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="RHDV1 проти RHDV2: порівняння штамів ВГХК" />
        </div>
      </div>
    </main>
  );
};

export default RhdvStrains;
