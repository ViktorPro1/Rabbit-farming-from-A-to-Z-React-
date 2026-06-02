import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="nf-container">
      {/* Кролик, який вискакує */}
      <div className="nf-rabbit">🐰</div>

      {/* Текст з ефектом друку */}
      <h1 className="nf-title">404</h1>
      <p className="nf-text">Ой! Сторінку не знайдено...</p>

      <Link to="/" className="nf-link">
        Повернутися на головну
      </Link>
    </div>
  );
};

export default NotFound;
