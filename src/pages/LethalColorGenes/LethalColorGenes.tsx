import { Link } from "react-router-dom";
import "./LethalColorGenes.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const genes = [
  {
    icon: "🐰",
    name: "Ген карликовості (Dw)",
    desc: "Неповністю домінантний ген, актуальний для карликових порід.",
    facts: [
      "Dwdw — власне карликова тварина (коротші вуха, компактна голова)",
      'dwdw — "фальшивий карлик" звичайного розміру без гена карликовості',
      'DwDw — летальна комбінація: "горішки" (peanuts), непропорційно велика голова й крихітне тіло, гинуть до народження чи в перші дні',
      "Парування Dwdw × Dwdw статистично дає чверть посліду летальних DwDw",
    ],
  },
  {
    icon: "⚪",
    name: "Ген плямистості (En) і мегаколон",
    desc: "Неповністю домінантний ген, відповідає за плямистий візерунок.",
    facts: [
      "enen — суцільне забарвлення без плям",
      "Enen — класичний плямистий візерунок",
      "EnEn — майже повністю біла тварина зі схильністю до вродженого мегаколону (розширення кишківника)",
      "Причина — ген KIT одночасно впливає на візерунок і на розвиток нервових клітин кишківника",
    ],
  },
];

const LethalColorGenes = () => {
  return (
    <main className="lethalgenes-page">
      <div className="lethalgenes-header">
        <h1>⚠️ Небезпечні поєднання генів у розведенні</h1>
        <p>Два добре вивчені гени, подвоєння яких шкодить потомству</p>
      </div>

      <div className="lethalgenes-wrap">
        <div className="lethalgenes-intro">
          <div className="lethalgenes-alert danger">
            🔴 Ніколи не парувати двох тварин, кожна з яких є носієм одного й
            того ж "небезпечного" гена (карликовості чи плямистого забарвлення
            En), якщо обидва вони показують ознаки цього гена у фенотипі.
          </div>
        </div>

        <div className="lethalgenes-section-title">🧬 Гени</div>
        <div className="lethalgenes-causes-grid">
          {genes.map((g) => (
            <article key={g.name} className="lethalgenes-cause-card">
              <div className="lethalgenes-cause-header">
                <span className="lethalgenes-cause-icon">{g.icon}</span>
                <h2>{g.name}</h2>
              </div>
              <p className="lethalgenes-cause-desc">{g.desc}</p>
              <ul className="lethalgenes-cause-facts">
                {g.facts.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="lethalgenes-section-title">
          📋 Що варто пам'ятати заводчику
        </div>
        <div className="lethalgenes-note">
          <ul>
            <li>
              Летальність тут пов'язана не з "поганою кров'ю" чи інбридингом, а
              з конкретним подвоєнням одного гена
            </li>
            <li>
              Ведення родоводів дозволяє відстежувати носіїв цих генів і уникати
              ризикованих поєднань наперед
            </li>
            <li>
              Якщо в посліді трапляються нежиттєздатні кроленята з характерними
              ознаками — перегляньте схему парувань цієї пари
            </li>
          </ul>
        </div>
        <div className="lethalgenes-alert warn">
          ⚠️ Ген карликовості технічно керує розміром тіла, а не забарвленням —
          але це найважливіший практичний приклад летального гена в
          кролівництві, тому логічно розглядати його поруч із геном плямистості.
        </div>

        <div className="lethalgenes-note lethalgenes-sources">
          <h3>Джерела</h3>
          <ul>
            <li>Wikipedia — Lethal dwarfism in rabbits</li>
            <li>
              Fontanesi L. et al. — The KIT Gene Is Associated with the English
              Spotting Coat Color Locus and Congenital Megacolon in Checkered
              Giant Rabbits, PLOS ONE, 2014
            </li>
            <li>Rabbitgenetics — Dwarfs</li>
          </ul>
          <p className="lethalgenes-disclaimer">
            Матеріал має ознайомчий характер. Рішення щодо парувань варто
            приймати з урахуванням родоводу тварин.
          </p>
        </div>

        <div className="lethalgenes-related">
          <h3 className="lethalgenes-related-title">Читайте також</h3>
          <div className="lethalgenes-related-grid">
            <Link to="/genetics" className="lethalgenes-related-link">
              🎨 Генетика забарвлення
            </Link>
            <Link to="/pedigree-records" className="lethalgenes-related-link">
              📖 Родоводи та племінний облік
            </Link>
            <Link to="/dna-testing" className="lethalgenes-related-link">
              🧬 ДНК-тест
            </Link>
          </div>
        </div>

        <div className="lethalgenes-back">
          <Link to="/" className="lethalgenes-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Небезпечні поєднання генів у розведенні" />
        </div>
      </div>
    </main>
  );
};

export default LethalColorGenes;
