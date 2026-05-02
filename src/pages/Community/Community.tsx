import "./Community.css";

export default function Community() {
  return (
    <div className="community">
      <div className="community__hero">
        <span className="community__hero-badge">Добірка спільнот</span>
        <h1 className="community__hero-title">Де спілкуються кролівники</h1>
        <p className="community__hero-sub">
          Обмінюйтеся досвідом, ставте запитання та знаходьте однодумців у
          найкращих групах для кролівників.
        </p>
      </div>

      <div className="community__grid">
        {/* Ваша спільнота */}
        <a
          href="https://t.me/rabbit_farming_from_a_to_z"
          target="_blank"
          rel="noopener noreferrer"
          className="community__item-link"
        >
          <div className="community__item">
            <div className="community__item-icon">🐇</div>
            <h3 className="community__item-title">Кролівництво від А до Я</h3>
            <p className="community__item-desc">
              Офіційна спільнота нашої платформи про розведення, годівлю та
              догляд за кроликами.
            </p>
            <span className="community__item-btn">Приєднатися</span>
          </div>
        </a>

        {/* Блок додавання нової спільноти */}
        <div className="community__add-box">
          <div className="community__add-icon">+</div>
          <p className="community__add-text">
            Знаєш хорошу спільноту?
            <br />
            Запропонуй для каталогу
          </p>
        </div>
      </div>

      <div className="community__note">
        Маєте цікавий канал чи групу? Поділіться з іншими кролівниками — ми
        додамо вас до списку!
      </div>

      <a href="/" className="community__back">
        ⬅ На головну
      </a>
    </div>
  );
}
