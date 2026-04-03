import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header-logo">
        <span>🐇</span>
        <span>Кролівництво від А до Я</span>
      </div>
      <nav className="header-nav">
        <Link to="/breeds">Породи</Link>
        <Link to="/care">Догляд</Link>
        <Link to="/feeding">Годування</Link>
        <Link to="/diseases">Хвороби</Link>
        <Link to="/calculator">Калькулятор</Link>
      </nav>
    </header>
  );
};

export default Header;
