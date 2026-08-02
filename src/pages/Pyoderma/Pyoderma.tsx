import { Link } from "react-router-dom";
import "./Pyoderma.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const causes = [
  {
    icon: "💧",
    name: "Хронічна волога шкіра",
    desc: "Протікання поїлки, вологий послід, надмірний груминг сусіда — будь-яке тривале зволоження порушує захисну флору шкіри.",
  },
  {
    icon: "🩹",
    name: "Порушення цілісності шкіри",
    desc: "Дрібні тріщини, подряпини, укуси — вхідні ворота для бактерій.",
  },
  {
    icon: "⚖️",
    name: "Ожиріння та шкірні складки",
    desc: "У шкірних складках (підборіддя, статеві органи) накопичується волога й бруд — ідеальне середовище для бактерій.",
  },
  {
    icon: "🦷",
    name: "Стоматологічні проблеми",
    desc: "Слинотеча через проблеми з зубами викликає постійну вологу дерматит навколо рота й підборіддя.",
  },
  {
    icon: "🦶",
    name: "Неправильна підлога",
    desc: "Сітчаста, бетонна чи дерев'яна тверда підлога сприяє пошкодженню шкіри лап і подальшій інфекції.",
  },
];

const symptoms = [
  { sign: "Почервоніння шкіри", note: "" },
  { sign: "Кірочки, лущення", note: "" },
  { sign: "Випадіння шерсті плямами", note: "" },
  { sign: "Неприємний запах ураженої ділянки", note: "" },
  {
    sign: "Синюватий відтінок шерсті",
    note: "Специфічна ознака інфекції Pseudomonas aeruginosa",
  },
  { sign: "Біль при дотику до ураженої ділянки", note: "" },
];

const Pyoderma = () => {
  return (
    <main className="pyoderma-page">
      <div className="pyoderma-header">
        <h1>🦠 Піодермія (гнійничкові ураження шкіри)</h1>
        <p>
          Бактеріальна інфекція шкіри — часта, але майже завжди вторинна
          проблема
        </p>
      </div>

      <div className="pyoderma-wrap">
        <div className="pyoderma-intro">
          <h2>Що це таке</h2>
          <p>
            Піодермія — медичний термін для бактеріальних інфекцій шкіри у
            кролів. У нормі на шкірі й слизових кроля живе здорова мікрофлора.
            Коли шкіра пошкоджується (розрив, тріщина) або тривало контактує з
            вологою, баланс порушується, і умовно патогенні бактерії (найчастіше
            Staphylococcus aureus, іноді Pseudomonas aeruginosa) починають
            надмірно розмножуватись.
          </p>
          <div className="pyoderma-alert ok">
            ✅ Піодермія — це майже завжди наслідок якоїсь іншої проблеми
            (вологи, ожиріння, стоматологічної хвороби, неправильної підлоги), а
            не самостійна первинна хвороба. Лікування самої шкіри без усунення
            першопричини дає лише тимчасове полегшення.
          </div>
        </div>

        <div className="pyoderma-section-title">🔍 Найчастіші причини</div>
        <div className="pyoderma-causes-grid">
          {causes.map((c) => (
            <article key={c.name} className="pyoderma-cause-card">
              <div className="pyoderma-cause-header">
                <span className="pyoderma-cause-icon">{c.icon}</span>
                <h2>{c.name}</h2>
              </div>
              <p className="pyoderma-cause-desc">{c.desc}</p>
            </article>
          ))}
        </div>

        <div className="pyoderma-section-title">🌡️ Симптоми</div>
        <div className="pyoderma-table-wrap">
          <table className="pyoderma-table">
            <thead>
              <tr>
                <th>Ознака</th>
                <th>Примітка</th>
              </tr>
            </thead>
            <tbody>
              {symptoms.map((s) => (
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
        <div className="pyoderma-alert warn">
          ⚠️ Синюватий відтінок шерсті — характерна ознака саме інфекції
          Pseudomonas aeruginosa, яка часто пов'язана із забрудненою чи погано
          продезінфікованою поїлкою. Якщо помічаєте цю ознаку, ретельно
          продезінфікуйте чи замініть напувальну систему.
        </div>

        <div className="pyoderma-section-title">💊 Лікування</div>
        <div className="pyoderma-note">
          <ul>
            <li>
              Вистригти шерсть навколо ураженої ділянки — це прискорює висихання
              й дає доступ до обробки
            </li>
            <li>
              Обережно очистити шкіру — хлоргексидин чи повідон-йод підходять як
              антисептики, але йодовмісні засоби можуть подразнювати шкіру при
              частому застосуванні
            </li>
            <li>
              Ретельно висушити ділянку — купання без наступного висушування
              контрпродуктивне й лише посилює вологість
            </li>
            <li>Місцеві антибактеріальні мазі за призначенням ветеринара</li>
            <li>За глибшої чи поширеної інфекції — системні антибіотики</li>
          </ul>
          <p className="pyoderma-note-small">
            Місцеві препарати з кортикостероїдами можуть бути ефективними для
            зняття запалення, але застосовувати їх варто обережно й лише за
            призначенням ветеринара — стероїди всмоктуються через шкіру,
            особливо запалену, і можуть вплинути на загальний стан тварини.
          </p>
        </div>

        <div className="pyoderma-section-title">🛡️ Профілактика</div>
        <div className="pyoderma-facts-grid">
          <div className="pyoderma-fact-card ok">
            <h3>✅ Контроль ваги</h3>
            <p>
              Профілактика ожиріння зменшує ризик інфекцій у шкірних складках.
            </p>
          </div>
          <div className="pyoderma-fact-card ok">
            <h3>✅ Суха чиста підстилка</h3>
            <p>Регулярна заміна й контроль справності поїлок.</p>
          </div>
          <div className="pyoderma-fact-card warn">
            <h3>⚠️ Своєчасне лікування стоматологічних проблем</h3>
            <p>
              Слинотеча через хворі зуби — прямий шлях до дерматиту навколо
              рота.
            </p>
          </div>
          <div className="pyoderma-fact-card warn">
            <h3>⚠️ Регулярне вичісування</h3>
            <p>
              Особливо шерсті навколо складок і статевих органів — запобігає
              скупченню вологи й бруду.
            </p>
          </div>
        </div>

        <div className="pyoderma-note pyoderma-sources">
          <h3>Джерела</h3>
          <ul>
            <li>PetMD — Bacterial Skin Infection in Rabbits</li>
            <li>
              House Rabbit Society — Skin Diseases in Rabbits: Common Causes,
              Common Treatments
            </li>
            <li>
              MSPCA-Angell — Introduction to Dermatology in the Exotic Animal
              Patient
            </li>
            <li>
              Veterian Key — Skin Diseases (глава з ветеринарного підручника)
            </li>
            <li>FirstVet — Causes of Skin Problems in Rabbits</li>
          </ul>
          <p className="pyoderma-disclaimer">
            Матеріал має ознайомчий характер і не замінює огляд ліцензованого
            ветеринара.
          </p>
        </div>

        <div className="pyoderma-related">
          <h3 className="pyoderma-related-title">Читайте також</h3>
          <div className="pyoderma-related-grid">
            <Link to="/urine-scald" className="pyoderma-related-link">
              🔥 Опік сечею
            </Link>
            <Link to="/seasonal-molting" className="pyoderma-related-link">
              🪮 Линька: норма та патологія
            </Link>
            <Link to="/rabbit-obesity" className="pyoderma-related-link">
              ⚖️ Ожиріння у кролів
            </Link>
          </div>
        </div>

        <div className="pyoderma-back">
          <Link to="/" className="pyoderma-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Піодермія у кролів" />
        </div>
      </div>
    </main>
  );
};

export default Pyoderma;
