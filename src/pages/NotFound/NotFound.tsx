import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="nf-container">
      <div className="nf-scene">
        <span className="nf-rabbit">🐰</span>
        <div className="nf-paws">
          <span className="nf-paw-left">🐾</span>
          <span className="nf-paw-right">🐾</span>
        </div>
        <span className="nf-keyboard">⌨️</span>
      </div>

      <h1 className="nf-title">404</h1>
      <p className="nf-text">Ой! Сторінку не знайдено...</p>

      <Link to="/" className="nf-link">
        Повернутися на головну
      </Link>
    </div>
  );
};

export default NotFound;
