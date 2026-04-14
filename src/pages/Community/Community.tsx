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
