import { NavLink } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <NavLink to="/about">Про проєкт</NavLink>
        <NavLink to="/privacy-policy">Політика конфіденційності</NavLink>
        <NavLink to="/terms-of-use">Умови використання</NavLink>
      </div>

      <div className="footer-bottom">
        <span className="footer-text">© 2026 Кролівництво від А до Я</span>
        <span className="footer-rabbit">🐇</span>
      </div>
    </footer>
  );
};

export default Footer;
