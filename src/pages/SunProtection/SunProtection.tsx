import { Link } from "react-router-dom";
import "./SunProtection.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const riskAreas = [
  {
    icon: "👂",
    name: "Вуха",
    desc: "Мало шерсті, багато судин близько до поверхні — найвразливіша зона й головний орган охолодження одночасно.",
  },
  {
    icon: "👃",
    name: "Ніс і повіки",
    desc: "Тонка, слабко захищена шерстю шкіра.",
  },
  {
    icon: "🫃",
    name: "Живіт",
    desc: "Коли кролик лежить розтягнувшись у спеку, живіт опиняється відкритим до сонця, якщо немає тіні.",
  },
  {
    icon: "🩹",
    name: "Виголені ділянки",
    desc: "Після операції чи стрижки шкіра там, де щойно вистригли шерсть, особливо вразлива.",
  },
];

const shadeOptions = [
  {
    method: "Природна тінь (дерево, кущ)",
    note: "Найкращий варіант — пропускає трохи світла, не перегріваючи повітря під собою",
  },
  {
    method: "Сонячний парус чи тент",
    note: "Гарна альтернатива, якщо немає природної тіні; важливо не перекривати вентиляцію повністю",
  },
  {
    method: "Тарпаулін щільною тканиною",
    note: "Небезпечний варіант — щільно накрита клітка сама перетворюється на пастку тепла",
  },
  {
    method: "Металева клітка на сонці",
    note: "Розжарюється найшвидше з усіх матеріалів — категорично уникати прямого сонця",
  },
];

const SunProtection = () => {
  return (
    <main className="sunshade-page">
      <div className="sunshade-header">
        <h1>☀️ Захист від сонця та затінення</h1>
        <p>
          Тінь — перший і найважливіший крок захисту, ще до вентиляції й води
        </p>
      </div>

      <div className="sunshade-wrap">
        <div className="sunshade-intro">
          <h2>Чому саме тінь, а не просто "менше спеки"</h2>
          <p>
            Кролі не пітніють і неефективно охолоджуються диханням, як собаки —
            головний механізм тепловіддачі в них це вуха: кров активно циркулює
            через них, віддаючи тепло навколишньому повітрю. Пряме сонячне
            проміння додає й прямий нагрів тіла, і додаткове UV-навантаження на
            шкіру, тому забезпечення тіні — це окремий, першочерговий крок, який
            має передувати всім іншим заходам проти перегріву (детальніше про
            сам тепловий удар — у відповідній статті розділу "Сезонні загрози").
          </p>
          <div className="sunshade-alert warn">
            ⚠️ Кролі справді можуть отримати сонячний опік — найчастіше
            уражаються вуха, ніс, повіки та живіт, тобто ділянки з найтоншою
            шерстю чи взагалі без неї.
          </div>
        </div>

        <div className="sunshade-section-title">
          🎯 Зони найвищого ризику опіку
        </div>
        <div className="sunshade-causes-grid">
          {riskAreas.map((r) => (
            <article key={r.name} className="sunshade-cause-card">
              <div className="sunshade-cause-header">
                <span className="sunshade-cause-icon">{r.icon}</span>
                <h2>{r.name}</h2>
              </div>
              <p className="sunshade-cause-desc">{r.desc}</p>
            </article>
          ))}
        </div>

        <div className="sunshade-section-title">
          🏠 Способи затінення: що працює, а що шкодить
        </div>
        <div className="sunshade-table-wrap">
          <table className="sunshade-table">
            <thead>
              <tr>
                <th>Спосіб</th>
                <th>Примітка</th>
              </tr>
            </thead>
            <tbody>
              {shadeOptions.map((s) => (
                <tr key={s.method}>
                  <td>
                    <strong>{s.method}</strong>
                  </td>
                  <td>{s.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="sunshade-alert danger">
          🔴 Найпоширеніша помилка — щільно накрити всю клітку матеріалом, що не
          пропускає повітря. Тінь має знижувати нагрів, не зупиняючи циркуляцію
          повітря: щільно накрита клітка з застояним гарячим повітрям усередині
          може бути навіть небезпечнішою, ніж відкрита сонцю ділянка з вільним
          рухом повітря.
        </div>

        <div className="sunshade-section-title">
          🧱 Матеріал клітки має значення
        </div>
        <div className="sunshade-note">
          <p>
            Металеві клітки нагріваються на сонці найшвидше й утримують тепло
            довше за інші матеріали — їх ніколи не можна залишати під прямим
            сонцем. Дерев'яні хатинки теж здатні сильно нагріватись, особливо
            темного кольору. Клітку варто ставити в місці з природною тінню (під
            деревом чи великим кущем) — листя пропускає частину світла, водночас
            захищаючи від найінтенсивнішого проміння.
          </p>
        </div>

        <div className="sunshade-section-title">🩺 Ознаки сонячного опіку</div>
        <div className="sunshade-note">
          <ul>
            <li>Почервоніння шкіри на вухах, носі, повіках чи животі</li>
            <li>Лущення чи болючість ураженої ділянки</li>
            <li>
              У важких випадках — зневоднення й млявість, особливо в поєднанні з
              тепловим ударом
            </li>
          </ul>
          <p>
            При підозрі на сонячний опік зверніться до ветеринара — особливо
            якщо є ознаки болю чи якщо опік поєднується із загальними симптомами
            перегріву.
          </p>
        </div>

        <div className="sunshade-section-title">
          🛡️ Практичний чек-лист на літо
        </div>
        <div className="sunshade-facts-grid">
          <div className="sunshade-fact-card ok">
            <h3>✅ Стабільна тінь увесь день</h3>
            <p>
              Не лише вранці чи ввечері — сонце рухається, тінь має бути наявна
              в пікові години спеки.
            </p>
          </div>
          <div className="sunshade-fact-card ok">
            <h3>✅ Вентиляція під тінню</h3>
            <p>
              Тінь без застою повітря — накривайте частково, лишайте відкриті
              сторони.
            </p>
          </div>
          <div className="sunshade-fact-card warn">
            <h3>⚠️ Регулярне вичісування</h3>
            <p>
              Зайва шерсть посилює перегрів — регулярний догляд одночасно
              допомагає й з тепловим навантаженням, і з профілактикою міазу.
            </p>
          </div>
          <div className="sunshade-fact-card warn">
            <h3>⚠️ План "Б" на екстремальну спеку</h3>
            <p>
              У найгарячіші дні — тимчасове перенесення клітки в прохолодніше
              приміщення чи гараж.
            </p>
          </div>
        </div>

        <div className="sunshade-note sunshade-sources">
          <h3>Джерела</h3>
          <ul>
            <li>Vet Verified — Can Rabbits Get Sunburn</li>
            <li>
              Pets.co.uk — How to Keep Rabbits Cool in Summer: Heatstroke, Shade
              and Flystrike Advice
            </li>
            <li>Omlet Blog — How to Keep Rabbits Cool in Summer</li>
            <li>
              Blue Cross — How to Keep Your Rabbits Cool in the Summer Heat
            </li>
          </ul>
          <p className="sunshade-disclaimer">
            Матеріал має ознайомчий характер і не замінює огляд ліцензованого
            ветеринара.
          </p>
        </div>

        <div className="sunshade-related">
          <h3 className="sunshade-related-title">Читайте також</h3>
          <div className="sunshade-related-grid">
            <Link to="/heat-stroke" className="sunshade-related-link">
              ☀️ Спека
            </Link>
            <Link to="/microclimate" className="sunshade-related-link">
              🌡️ Мікроклімат
            </Link>
            <Link to="/seasonal-summer" className="sunshade-related-link">
              🪰 Літо: міаз
            </Link>
          </div>
        </div>

        <div className="sunshade-back">
          <Link to="/" className="sunshade-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Захист від сонця та затінення" />
        </div>
      </div>
    </main>
  );
};

export default SunProtection;
