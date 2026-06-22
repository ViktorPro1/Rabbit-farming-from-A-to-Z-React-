import { NavLink } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
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
        </div>
      </div>

      <div className="footer-bottom">
        <span className="footer-text">© 2026 Кролівництво від А до Я</span>
      </div>
    </footer>
  );
};

export default Footer;
