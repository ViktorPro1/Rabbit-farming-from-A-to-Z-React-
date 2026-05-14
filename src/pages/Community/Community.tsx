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
            <div className="community__item-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="28"
                height="28"
                fill="currentColor"
              >
                <path d="M9.04 15.5 8.9 19.1c.4 0 .6-.2.8-.4l2-1.9 4.2 3.1c.8.4 1.4.2 1.6-.8l3-14c.3-1.3-.5-1.8-1.3-1.5L2.6 9.7c-1.3.5-1.3 1.2-.2 1.5l4.6 1.4L17.5 6.7c.5-.3.9-.1.5.3" />
              </svg>
            </div>
            <h3 className="community__item-title">Кролівництво від А до Я</h3>
            <p className="community__item-desc">
              Офіційна спільнота нашої платформи про розведення, годівлю та
              догляд за кроликами.
            </p>
            <span className="community__item-btn">Приєднатися</span>
          </div>
        </a>

        {/* Facebook спільнота */}
        <a
          href="https://www.facebook.com/groups/998532079304207"
          target="_blank"
          rel="noopener noreferrer"
          className="community__item-link"
        >
          <div className="community__item">
            <div className="community__item-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="28"
                height="28"
                fill="currentColor"
              >
                <path d="M22 12a10 10 0 1 0-11.6 9.9v-7h-2.2V12h2.2V9.8c0-2.2 1.3-3.4 3.3-3.4.9 0 1.9.2 1.9.2v2.1h-1.1c-1.1 0-1.4.7-1.4 1.4V12h2.4l-.4 2.9h-2v7A10 10 0 0 0 22 12" />
              </svg>
            </div>
            <h3 className="community__item-title">Кролівництво від А до Я</h3>
            <p className="community__item-desc">
              Офіційна група платформи «Кролівництво від А до Я» у Facebook. Тут
              обговорюємо кролівництво, ділимось досвідом та допомагаємо один
              одному.
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
