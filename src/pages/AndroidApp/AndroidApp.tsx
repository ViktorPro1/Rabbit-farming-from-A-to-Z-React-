import { NavLink } from "react-router-dom";
import "./AndroidApp.css";

const AndroidApp = () => {
  return (
    <div className="android-page">
      <header className="android-header">
        <h1>📱 Застосунок для Android</h1>
        <p>Кролівництво від А до Я — тепер і як застосунок на телефоні</p>
      </header>

      <div className="android-wrap">
        <div className="android-intro">
          Застосунок поки доступний лише для прямого завантаження — не через
          Google Play. Це безкоштовно та безпечно, просто потрібно дозволити
          встановлення з невідомого джерела.
        </div>

        <div className="android-group">
          <div className="android-group-title">
            ⬇️ Крок 1 — Завантажте застосунок
          </div>
          <a
            href="/krolivnytstvo.apk"
            download
            className="android-download-btn"
          >
            📱 Завантажити APK (2,7 МБ)
          </a>
        </div>

        <div className="android-group">
          <div className="android-group-title">
            ⚙️ Крок 2 — Дозвольте встановлення
          </div>
          <div className="android-card">
            <p>
              Після завантаження телефон покаже попередження "Заборонено
              встановлення з цього джерела" — це стандартна поведінка Android
              для файлів поза Google Play.
            </p>
            <p>
              Натисніть "Налаштування" у цьому повідомленні → увімкніть
              "Дозволити з цього джерела" → поверніться і встановіть файл ще
              раз.
            </p>
          </div>
        </div>

        <div className="android-group">
          <div className="android-group-title">✅ Крок 3 — Готово</div>
          <div className="android-card">
            <p>
              Іконка застосунку з'явиться на головному екрані. Відкривайте його
              як звичайний застосунок — весь довідник працюватиме без браузера.
            </p>
          </div>
        </div>

        <div className="android-notice">
          <span>🔒</span>
          <div>
            <strong>Це безпечно?</strong>
            <p>
              Так. Застосунок підписаний цифровим ключем і є точною копією сайту
              rabbit-farming-from-a-to-z-react.vercel.app — жодного стороннього
              коду.
            </p>
          </div>
        </div>

        <div className="android-back">
          <NavLink to="/" className="android-back-btn">
            ← На головну
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default AndroidApp;
