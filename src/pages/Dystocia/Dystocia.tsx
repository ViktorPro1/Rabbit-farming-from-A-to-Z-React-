import { Link } from "react-router-dom";
import "./Dystocia.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const causes = [
  {
    icon: "🔄",
    name: "Неправильне положення плода",
    desc: "Наприклад, згинання голови в родових шляхах.",
  },
  {
    icon: "💔",
    name: "Загибель плода в утробі",
    desc: "Ще до початку пологів.",
  },
  {
    icon: "😴",
    name: "Інерція матки",
    desc: "Слабкість скорочень — матка не скорочується достатньо сильно.",
  },
  {
    icon: "📏",
    name: "Вузькі родові шляхи",
    desc: "Анатомічні особливості тазу самки.",
  },
  {
    icon: "🐇",
    name: "Надто великий плід",
    desc: "Відносно розміру самки — часто через в'язку не за розміром.",
  },
];

const Dystocia = () => {
  return (
    <main className="dystocia-page">
      <div className="dystocia-header">
        <h1>🚨 Дистоція (важкі пологи) у кролиць</h1>
        <p>
          Рідкісна, але невідкладна ситуація — коли окрол не завершується за
          звичні 30 хвилин
        </p>
      </div>

      <div className="dystocia-wrap">
        <div className="dystocia-intro">
          <div className="dystocia-alert danger">
            🔴 У нормі окріл минає швидко — зазвичай за приблизно 30 хвилин.
            Якщо самка тужиться довше, виглядає виснаженою, а пологи не
            просуваються — негайно до ветеринара.
          </div>
        </div>

        <div className="dystocia-section-title">🔍 Причини</div>
        <div className="dystocia-causes-grid">
          {causes.map((c) => (
            <article key={c.name} className="dystocia-cause-card">
              <div className="dystocia-cause-header">
                <span className="dystocia-cause-icon">{c.icon}</span>
                <h2>{c.name}</h2>
              </div>
              <p className="dystocia-cause-desc">{c.desc}</p>
            </article>
          ))}
        </div>

        <div className="dystocia-section-title">🌡️ Як розпізнати</div>
        <div className="dystocia-note">
          <ul>
            <li>Тривалі, наполегливі потуги без народження кроленяти</li>
            <li>Кров'янисті або зеленувато-коричневі виділення з піхви</li>
            <li>Самка виглядає виснаженою, млявою, важко дихає</li>
            <li>Пологи почались, але зупинились</li>
            <li>
              Минув очікуваний термін окролу (31–33 дні), а пологи не почались
            </li>
          </ul>
        </div>
        <div className="dystocia-alert warn">
          ⚠️ Зеленувато-коричневі виділення особливо тривожні — можуть вказувати
          на відшарування плаценти чи загибель плода в утробі.
        </div>

        <div className="dystocia-section-title">🏥 Що робить ветеринар</div>
        <div className="dystocia-note">
          <p>
            <strong>Слабкість скорочень (без перешкоди):</strong> окситоцин у
            поєднанні з кальцію борглюконатом.
          </p>
          <p>
            <strong>Механічна перешкода:</strong> обережне ручне вилучення
            плодів через родові шляхи.
          </p>
          <p>
            <strong>Якщо консервативні методи не спрацьовують:</strong> кесарів
            розтин — через вузькі родові шляхи іноді єдиний ефективний варіант.
          </p>
        </div>
        <div className="dystocia-alert danger">
          🔴 Препарати для стимуляції скорочень матки не можна вводити
          самостійно — якщо причина механічна, стимуляція без усунення перешкоди
          небезпечна і може призвести до розриву матки.
        </div>

        <div className="dystocia-section-title">🚑 До приїзду ветеринара</div>
        <div className="dystocia-note">
          <ul>
            <li>Негайно зв'яжіться з ветеринаром</li>
            <li>Заберіть уже народжених живих кроленят у тепле сухе місце</li>
            <li>Не намагайтесь самостійно тягнути плід чи давати препарати</li>
            <li>Забезпечте спокій, тінь, доступ до води</li>
          </ul>
        </div>

        <div className="dystocia-section-title">🛡️ Профілактика</div>
        <div className="dystocia-facts-grid">
          <div className="dystocia-fact-card ok">
            <h3>✅ Парування за розміром породи</h3>
            <p>Уникайте випадкових неконтрольованих в'язок.</p>
          </div>
          <div className="dystocia-fact-card ok">
            <h3>✅ Контроль кондиції тіла</h3>
            <p>І ожиріння, і виснаження підвищують ризик.</p>
          </div>
          <div className="dystocia-fact-card warn">
            <h3>⚠️ Не парувати надто молодих самок</h3>
            <p>Таз має бути повністю розвинений.</p>
          </div>
        </div>

        <div className="dystocia-note dystocia-sources">
          <h3>Джерела</h3>
          <ul>
            <li>
              Case report: Dystocia in a rabbit (Oryctolagus cuniculus),
              Canadian Veterinary Journal, PubMed
            </li>
            <li>
              Yadav V. et al. — Management of dystocia due to secondary uterine
              inertia in rabbit, 2023
            </li>
          </ul>
          <p className="dystocia-disclaimer">
            Матеріал має ознайомчий характер і не замінює огляд ліцензованого
            ветеринара.
          </p>
        </div>

        <div className="dystocia-related">
          <h3 className="dystocia-related-title">Читайте також</h3>
          <div className="dystocia-related-grid">
            <Link to="/okril" className="dystocia-related-link">
              🍼 Окріл
            </Link>
            <Link to="/okril-control" className="dystocia-related-link">
              🔍 Контроль дат
            </Link>
            <Link to="/mastitis" className="dystocia-related-link">
              🍼 Мастит
            </Link>
          </div>
        </div>

        <div className="dystocia-back">
          <Link to="/" className="dystocia-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Дистоція у кролиць" />
        </div>
      </div>
    </main>
  );
};

export default Dystocia;
