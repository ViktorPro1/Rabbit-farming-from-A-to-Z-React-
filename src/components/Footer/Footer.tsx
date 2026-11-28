import { useState } from "react";
import { NavLink } from "react-router-dom";
import FeedbackModal from "../FeedbackModal/FeedbackModal";
// Змінено: було import logo from "../../assets/logo.webp" (1024x1536, 205 КБ)
// для іконки 58 px. Тепер logo-footer.webp (116x174, 6 КБ) — запас ×2 для
// щільних екранів. Оригінал logo.webp залишено в assets, не видалено.
import logo from "../../assets/logo-footer.webp";
import "./Footer.css";

const Footer = () => {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <>
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <img
              src={logo}
              alt="Кролівництво від А до Я"
              // Додано: розміри й lazy — футер нижче екрана, картинка не
              // потрібна для першого малювання.
              width={58}
              height={58}
              loading="lazy"
              decoding="async"
              className="footer-brand-icon"
            />
            <div>
              <div className="footer-brand-name">Кролівництво від А до Я</div>
              <div className="footer-brand-sub">
                Довідник для кролівників України
              </div>
              <div className="footer-brand-origin">Хмельниччина</div>
              <div className="footer-brand-origin">
                Продумано до найменших дрібниць.
              </div>
            </div>
          </div>

          <div className="footer-links">
            <NavLink to="/about">Про проєкт</NavLink>
            <NavLink to="/privacy-policy">Конфіденційність</NavLink>
            <NavLink to="/terms-of-use">Умови</NavLink>
            <button
              className="footer-feedback-btn"
              onClick={() => setFeedbackOpen(true)}
            >
              ✉ Зворотний зв'язок
            </button>
            <NavLink to="/behind-the-scenes" className="footer-dev-link">
              <span className="footer-dev-pulse" aria-hidden="true" />
              <span className="footer-dev-label">&lt;/&gt; за лаштунками</span>
            </NavLink>
            <NavLink to="/android-app" className="footer-apk-btn">
              📱 Android
            </NavLink>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-text">© 2026 Кролівництво від А до Я</span>
        </div>
      </footer>

      <FeedbackModal
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />
    </>
  );
};

export default Footer;
