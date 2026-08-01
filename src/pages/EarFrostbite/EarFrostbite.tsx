import { Link } from "react-router-dom";
import "./EarFrostbite.css";
import ShareButton from "../../components/ShareButton/ShareButton";

const riskFactors = [
  {
    icon: "💧",
    name: "Волога підстилка",
    desc: "Протікання даху чи стінок кролятника.",
  },
  {
    icon: "🚿",
    name: "Бризки з поїлки",
    desc: "Змочують вуха чи шерсть навколо носа.",
  },
  {
    icon: "💨",
    name: "Сильний вітер і протяги",
    desc: "Взимку особливо небезпечні без укриття.",
  },
  {
    icon: "🐰",
    name: "Вислухі породи (барани)",
    desc: "Вуха звисають донизу й торкаються вологої підлоги чи поїлки.",
  },
];

const EarFrostbite = () => {
  return (
    <main className="frostbite-page">
      <div className="frostbite-header">
        <h1>❄️ Обмороження вух у дорослих кролів</h1>
        <p>Рідкісна, але реальна загроза при утриманні на вулиці взимку</p>
      </div>

      <div className="frostbite-wrap">
        <div className="frostbite-intro">
          <h2>Чому вуха вразливі найбільше</h2>
          <p>
            Вуха — найбільш виступаюча й тонкошкіра частина тіла кроля з
            відносно слабким кровопостачанням на кінчиках. Коли організм мерзне,
            кровообіг перерозподіляється в бік внутрішніх органів, а периферичні
            ділянки залишаються без достатнього обігріву й ризикують
            промерзнути.
          </p>
          <div className="frostbite-alert danger">
            🔴 Головна причина обмороження — не просто мороз, а поєднання морозу
            з вологістю: коли вуха, ніс чи лапки намокають, а потім потрапляють
            під дію морозного повітря чи вітру.
          </div>
        </div>

        <div className="frostbite-section-title">⚠️ Що підвищує ризик</div>
        <div className="frostbite-causes-grid">
          {riskFactors.map((r) => (
            <article key={r.name} className="frostbite-cause-card">
              <div className="frostbite-cause-header">
                <span className="frostbite-cause-icon">{r.icon}</span>
                <h2>{r.name}</h2>
              </div>
              <p className="frostbite-cause-desc">{r.desc}</p>
            </article>
          ))}
        </div>

        <div className="frostbite-section-title">🌡️ Як розпізнати</div>
        <div className="frostbite-note">
          <ul>
            <li>
              Уражена ділянка на дотик холодна, шкіра бліда чи синювато-біла
            </li>
            <li>Втрата чутливості шкіри</li>
            <li>Пізніше, при відігріванні — почервоніння й набряк</li>
            <li>
              У важких випадках тканина темніє й відмирає — глибоке ураження
            </li>
          </ul>
        </div>

        <div className="frostbite-section-title">🚑 Перша допомога</div>
        <div className="frostbite-note">
          <ul>
            <li>Занесіть кролика в тепле приміщення якомога швидше</li>
            <li>
              Зігрівайте поступово — теплими (не гарячими) ковдрами чи грілкою
            </li>
            <li>Не розтирайте й не масажуйте уражену ділянку</li>
            <li>
              Не використовуйте окріп чи гарячі джерела тепла безпосередньо на
              шкіру
            </li>
            <li>Після зігрівання все одно зверніться до ветеринара</li>
          </ul>
        </div>
        <div className="frostbite-alert warn">
          ⚠️ Остаточна межа некрозу тканини (якщо він є) зазвичай стає видимою
          лише через кілька днів–тижнів — тоді ветеринар оцінює, чи потрібне
          видалення відмерлої частини вуха.
        </div>

        <div className="frostbite-section-title">🛡️ Профілактика</div>
        <div className="frostbite-facts-grid">
          <div className="frostbite-fact-card ok">
            <h3>✅ Сухе укриття без вітру й протягів</h3>
            <p>Кролик завжди повинен мати куди сховатись.</p>
          </div>
          <div className="frostbite-fact-card ok">
            <h3>✅ Суха підстилка (солома)</h3>
            <p>Регулярна заміна — утеплює і вбирає вологу.</p>
          </div>
          <div className="frostbite-fact-card warn">
            <h3>⚠️ Поїлки без протікань</h3>
            <p>
              Перевіряти на обмерзання і краплі, особливо для вислухих порід.
            </p>
          </div>
        </div>

        <div className="frostbite-note frostbite-sources">
          <h3>Джерела</h3>
          <ul>
            <li>Everypaw — Caring for Rabbits in Winter</li>
            <li>Hobby Farms — Fighting Pet Frostbite</li>
            <li>
              Backyard Poultry — Rabbit and Chicken Frostbite Prevention Methods
            </li>
          </ul>
          <p className="frostbite-disclaimer">
            Матеріал має ознайомчий характер і не замінює огляд ліцензованого
            ветеринара.
          </p>
        </div>

        <div className="frostbite-related">
          <h3 className="frostbite-related-title">Читайте також</h3>
          <div className="frostbite-related-grid">
            <Link to="/seasonal-autumn" className="frostbite-related-link">
              🍂 Осінь: підготовка до зими
            </Link>
            <Link to="/microclimate" className="frostbite-related-link">
              🌡️ Мікроклімат
            </Link>
            <Link to="/winter-litter" className="frostbite-related-link">
              ❄️ Зимовий окріл
            </Link>
          </div>
        </div>

        <div className="frostbite-back">
          <Link to="/" className="frostbite-back-btn">
            ⬅ На головну
          </Link>
          <ShareButton title="Обмороження вух у дорослих кролів" />
        </div>
      </div>
    </main>
  );
};

export default EarFrostbite;
