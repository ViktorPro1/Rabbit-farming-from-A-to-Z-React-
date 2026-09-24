import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="nf-container">
      {/* Додано: шрифти Fraunces і JetBrains Mono підключались через
          @import у NotFound.css — за правилами проєкту (AGENTS.md) так
          не можна, це ламає збірку. Той рядок прибрано з NotFound.css,
          а підключення перенесено сюди через react-helmet-async (він уже
          є в стеку проєкту), лише для цієї сторінки. */}
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,600;1,600&family=JetBrains+Mono:wght@400;500;700&display=swap"
        />
      </Helmet>

      <div className="nf-illustration" aria-hidden="true">
        <div className="nf-trail">
          <span className="nf-paw nf-paw-1">🐾</span>
          <span className="nf-paw nf-paw-2">🐾</span>
          <span className="nf-paw nf-paw-3">🐾</span>
          <span className="nf-paw nf-paw-4">🐾</span>
        </div>
        <div className="nf-mound" />
        <span className="nf-rabbit">🐰</span>
        <div className="nf-hole" />
      </div>

      <p className="nf-eyebrow">Помилка 404</p>
      <h1 className="nf-title">Сторінку не знайдено</h1>
      <p className="nf-text">
        Здається, кролик прорив нору не туди. Такої сторінки не існує або її
        було переміщено.
      </p>

      <Link to="/" className="nf-button">
        <span className="nf-button-icon">🏡</span>
        Повернутися на головну
      </Link>
    </div>
  );
};

export default NotFound;
