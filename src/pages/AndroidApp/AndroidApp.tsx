import { NavLink } from "react-router-dom";
import "./AndroidApp.css";

const AndroidApp = () => {
  return (
    <div className="android-app-page">
      <header className="faq-header">
        <h1>📱 Застосунок для Android</h1>
        <p>Кролівництво від А до Я — тепер і як застосунок на телефоні</p>
      </header>

      <div className="faq-wrap">
        <div className="faq-intro">
          Застосунок поки доступний лише для прямого завантаження — не через
          Google Play. Це безкоштовно та безпечно, просто потрібно дозволити
          встановлення з невідомого джерела.
        </div>

        <div className="faq-group">
          <div className="faq-group-title">
            ⬇️ Крок 1 — Завантажте застосунок
          </div>
          <div className="faq-list">
            <a
              href="/krolivnytstvo.apk"
              download
              className="android-download-btn"
            >
              📱 Завантажити APK (2,7 МБ)
            </a>
          </div>
        </div>

        <div className="faq-group">
          <div className="faq-group-title">
            ⚙️ Крок 2 — Дозвольте встановлення
          </div>
          <div className="faq-list">
            <div className="faq-item">
              <div className="faq-answer" style={{ paddingTop: 16 }}>
                <p>
                  Після завантаження телефон покаже попередження "Заборонено
                  встановлення з цього джерела" — це стандартна поведінка
                  Android для файлів поза Google Play.
                </p>
                <p>
                  Натисніть "Налаштування" у цьому повідомленні → увімкніть
                  "Дозволити з цього джерела" → поверніться і встановіть файл ще
                  раз.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="faq-group">
          <div className="faq-group-title">✅ Крок 3 — Готово</div>
          <div className="faq-list">
            <div className="faq-item">
              <div className="faq-answer" style={{ paddingTop: 16 }}>
                <p>
                  Іконка застосунку з'явиться на головному екрані. Відкривайте
                  його як звичайний застосунок — весь довідник працюватиме без
                  браузера.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="faq-not-found">
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

        <div className="faq-back">
          <NavLink to="/" className="faq-back-btn">
            ← На головну
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default AndroidApp;
