import { useState } from "react";
import { NavLink } from "react-router-dom";
import FeedbackModal from "../FeedbackModal/FeedbackModal";
import "./Footer.css";

const Footer = () => {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <>
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="footer-brand-icon">🐇</span>
            <div>
              <div className="footer-brand-name">Кролівництво від А до Я</div>
              <div className="footer-brand-sub">
                Довідник для кролівників України
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
