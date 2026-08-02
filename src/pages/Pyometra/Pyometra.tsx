import { Link } from "react-router-dom";
import "./Pyometra.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const symptoms = [
  {
    sign: "Виділення з піхви (гнійні чи кров'янисті)",
    note: 'Ознака "відкритої" форми — цервікс не закритий',
  },
  {
    sign: "Кров у сечі",
    note: "Часто пов'язана саме з маткою, а не з сечовим міхуром",
  },
  {
    sign: "Здуття чи збільшення живота",
    note: 'При "закритій" формі, коли рідина не виходить назовні',
  },
  { sign: "Млявість, пригнічений стан", note: "" },
  { sign: "Відмова від їжі", note: "" },
  { sign: "Підвищена спрага і сечовипускання", note: "" },
  { sign: "Гарячка", note: "" },
];

const Pyometra = () => {
  return (
    <main className="pyometra-page">
      <div className="pyometra-header">
        <h1>🚨 Пієметра у кролиць</h1>
        <p>
          Гнійне запалення матки — невідкладний стан, який не можна відкладати
          "до завтра"
        </p>
      </div>

      <div className="pyometra-wrap">
        <div className="pyometra-intro">
          <h2>Що це таке</h2>
          <p>
            Пієметра — накопичення гнійного вмісту в порожнині матки, зазвичай
            на тлі бактеріальної інфекції (найчастіше — кишкова паличка, що
            потрапляє висхідним шляхом із піхви). Стан найчастіше вражає
            непокастрованих самок старшого віку, але може розвинутись у
            будь-якому віці, навіть без історії парувань.
          </p>
          <p>
            Ветеринари розрізняють дві форми: <strong>"відкриту"</strong> — коли
            шийка матки прочинена й гній частково виходить назовні у вигляді
            виділень, та <strong>"закриту"</strong> — коли шийка закрита, а гній
            накопичується всередині, розтягуючи матку. Закрита форма
            підступніша: власник довше не помічає проблеми, а ризик розриву
            матки й зараження крові вищий.
          </p>
          <div className="pyometra-alert danger">
            🔴 У ветеринарній медицині є прислів'я: "ніколи не давайте сонцю
            зайти над пієметрою" — настільки швидко стан здатний перейти з
            керованого в смертельний. Без лікування бактерії й токсини
            потрапляють у кров, викликаючи зараження крові, шок і загибель.
          </div>
        </div>

        <div className="pyometra-section-title">🌡️ Симптоми</div>
        <div className="pyometra-table-wrap">
          <table className="pyometra-table">
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
        <div className="pyometra-alert warn">
          ⚠️ Ці симптоми легко сплутати з аденокарциномою матки чи сечокам'яною
          хворобою (див. відповідні статті) — точний діагноз можливий лише після
          огляду й візуалізаційної діагностики у ветеринара.
        </div>

        <div className="pyometra-section-title">🧪 Діагностика</div>
        <div className="pyometra-note">
          <p>
            Спершу ветеринар виключає найочевидніші причини збільшення живота —
            вагітність та пухлину матки (аденокарциному). Далі оцінюють:
          </p>
          <ul>
            <li>
              Рентген та УЗД черевної порожнини — характерне збільшене,
              наповнене рідиною утворення на місці матки
            </li>
            <li>
              Аналіз крові — часто виявляють анемію, знижений рівень заліза,
              підвищені маркери запалення
            </li>
            <li>Дослідження виділень під мікроскопом за наявності</li>
          </ul>
        </div>

        <div className="pyometra-section-title">💊 Лікування</div>
        <div className="pyometra-note">
          <p>
            <strong>
              Хірургічне видалення матки й яєчників (оваріогістеректомія)
            </strong>{" "}
            — основний і найнадійніший метод лікування. Хірургічне видалення
            практично повністю усуває ризик повторення проблеми, оскільки
            прибирає й джерело інфекції, і гормональний фон, що її провокує.
          </p>
          <p>
            Медикаментозне лікування (антибіотики, підтримувальна терапія) без
            операції іноді пробують у племінних самок, яких хочуть зберегти для
            розведення, але це варіант із суттєво вищим ризиком рецидиву і
            підходить лише для ретельно відібраних легких випадків за рішенням
            ветеринара.
          </p>
          <p>
            Перед операцією тварині часто потрібна стабілізація —
            внутрішньовенні рідини, корекція зневоднення й рівня глюкози в
            крові, оскільки пацієнтки з пієметрою нерідко надходять уже
            ослабленими.
          </p>
        </div>

        <div className="pyometra-section-title">🛡️ Профілактика</div>
        <div className="pyometra-facts-grid">
          <div className="pyometra-fact-card ok">
            <h3>✅ Стерилізація — найнадійніший захист</h3>
            <p>
              Видалення матки й яєчників до появи проблем повністю усуває
              гормональну причину пієметри.
            </p>
          </div>
          <div className="pyometra-fact-card warn">
            <h3>⚠️ Регулярні огляди непокастрованих самок</h3>
            <p>
              Особливо важливо для самок старшого віку — рання діагностика
              суттєво покращує прогноз.
            </p>
          </div>
          <div className="pyometra-fact-card warn">
            <h3>⚠️ Не ігноруйте виділення з піхви</h3>
            <p>
              Будь-які незвичні виділення — привід для термінового огляду, а не
              спостереження "ще день-два".
            </p>
          </div>
        </div>

        <div className="pyometra-note pyometra-sources">
          <h3>Джерела</h3>
          <ul>
            <li>PetMD — Uterine Infections in Rabbits</li>
            <li>
              Successful Treatment of Pyometra Caused by Pseudomonas aeruginosa
              Infection in a Rabbit, PubMed (кейс-репорт)
            </li>
            <li>
              Providence Vet — Pyometra in Female Pets (включно з кролями)
            </li>
            <li>
              Veterinary Medicine at Illinois — Pyometra: Potentially Fatal
              Uterine Infection in Pets
            </li>
          </ul>
          <p className="pyometra-disclaimer">
            Матеріал має ознайомчий характер і не замінює огляд ліцензованого
            ветеринара. Пієметра — невідкладний стан, зволікання з лікуванням
            безпосередньо загрожує життю самки.
          </p>
        </div>

        <div className="pyometra-related">
          <h3 className="pyometra-related-title">Читайте також</h3>
          <div className="pyometra-related-grid">
            <Link
              to="/uterine-adenocarcinoma"
              className="pyometra-related-link"
            >
              🎗️ Аденокарцинома матки
            </Link>
            <Link to="/neutering" className="pyometra-related-link">
              ⚕️ Кастрація та стерилізація
            </Link>
            <Link to="/rabbit-urolithiasis" className="pyometra-related-link">
              💧 Сечокам'яна хвороба
            </Link>
          </div>
        </div>

        <div className="pyometra-back">
          <Link to="/" className="pyometra-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Пієметра у кролиць" />
        </div>
      </div>
    </main>
  );
};

export default Pyometra;
