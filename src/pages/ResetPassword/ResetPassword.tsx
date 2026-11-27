import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { KeyRound, ShieldCheck, LinkIcon, Eye, EyeOff } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { logError } from "../../lib/logError";
// Власні стилі сторінки (не залежить від Auth.css, свідомо відмінний вигляд,
// щоб користувач бачив, що це відновлення доступу, а не звичайний вхід).
import "./ResetPassword.css";

// Додано: сторінка встановлення нового пароля після переходу за посиланням
// з листа відновлення (див. handleForgot в Auth.tsx).
// Supabase при відкритті посилання сам створює тимчасову сесію з URL,
// тому на сторінці достатньо перевірити, що сесія є, і викликати updateUser.
// Без сесії (посилання застаріло або вже використане) показуємо підказку.

type Status = "checking" | "ready" | "invalid" | "done";

const MIN_PASSWORD_LENGTH = 6; // мінімум за замовчуванням у Supabase

// Проста оцінка надійності для підказки: 0 порожній, 1 слабкий, 2 середній, 3 надійний
function passwordStrength(value: string): 0 | 1 | 2 | 3 {
  if (!value) return 0;
  const variety = [/[a-zа-яіїєґ]/i, /\d/, /[^a-zа-яіїєґ\d]/i].filter((re) =>
    re.test(value),
  ).length;
  if (value.length < MIN_PASSWORD_LENGTH) return 1;
  if (value.length >= 10 && variety >= 2) return 3;
  if (value.length >= 8 && variety >= 2) return 2;
  return 1;
}

const STRENGTH_LABEL = ["", "Слабкий", "Середній", "Надійний"];

export default function ResetPassword() {
  const [status, setStatus] = useState<Status>("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    // getSession дочекається, поки клієнт Supabase обробить посилання з URL
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (!cancelled) setStatus(session ? "ready" : "invalid");
      })
      .catch((err) => {
        logError("ResetPassword.getSession", err);
        if (!cancelled) setStatus("invalid");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit() {
    setError("");
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Пароль має містити щонайменше ${MIN_PASSWORD_LENGTH} символів`);
      return;
    }
    if (password !== confirm) {
      setError("Паролі не збігаються");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        if (error.message.toLowerCase().includes("different from the old")) {
          setError("Новий пароль має відрізнятися від старого");
        } else if (error.message.toLowerCase().includes("weak")) {
          setError("Пароль надто простий. Додайте літери, цифри або символи");
        } else {
          setError("Не вдалося змінити пароль. Спробуйте ще раз");
        }
        return;
      }
      setStatus("done");
    } catch (err) {
      logError("ResetPassword.updateUser", err);
      setError(
        "Не вдалося змінити пароль. Перевірте з'єднання й спробуйте ще раз",
      );
    } finally {
      setLoading(false);
    }
  }

  const strength = passwordStrength(password);
  const inputType = showPassword ? "text" : "password";

  return (
    <div className="rp-page">
      {/* Сторінка службова, у пошуку їй робити нічого */}
      <Helmet>
        <title>Відновлення доступу</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="rp-card">
        <div className="rp-badge">Відновлення доступу</div>

        {status === "checking" && (
          <p className="rp-muted" role="status">
            Перевірка посилання...
          </p>
        )}

        {status === "invalid" && (
          <div className="rp-body">
            <div className="rp-icon rp-icon--warn" aria-hidden="true">
              <LinkIcon size={28} />
            </div>
            <h1 className="rp-title">Посилання не працює</h1>
            <p className="rp-error" role="alert">
              Посилання недійсне або застаріло. Запросіть новий лист для
              відновлення пароля.
            </p>
            <p className="rp-muted">
              На сторінці входу натисніть «Забули пароль?» і введіть свій email.
            </p>
            <Link to="/registry" className="rp-btn rp-btn--ghost">
              До входу
            </Link>
          </div>
        )}

        {status === "ready" && (
          <div className="rp-body">
            <div className="rp-icon" aria-hidden="true">
              <KeyRound size={28} />
            </div>
            <h1 className="rp-title">Новий пароль</h1>
            <p className="rp-muted">
              Придумайте новий пароль для входу в кабінет. Після збереження ви
              одразу зайдете в нього.
            </p>

            <label className="rp-field" htmlFor="reset-password">
              <span className="rp-label">Новий пароль</span>
              <span className="rp-input-wrap">
                <input
                  id="reset-password"
                  name="password"
                  type={inputType}
                  placeholder="Новий пароль"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="rp-eye"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={
                    showPassword ? "Сховати пароль" : "Показати пароль"
                  }
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>

            <div
              className={`rp-strength rp-strength--${strength}`}
              aria-live="polite"
            >
              <span className="rp-strength-bar" />
              <span className="rp-strength-bar" />
              <span className="rp-strength-bar" />
              <span className="rp-strength-text">
                {STRENGTH_LABEL[strength]}
              </span>
            </div>

            <label className="rp-field" htmlFor="reset-password-confirm">
              <span className="rp-label">Повторіть пароль</span>
              <span className="rp-input-wrap">
                <input
                  id="reset-password-confirm"
                  name="passwordConfirm"
                  type={inputType}
                  placeholder="Повторіть новий пароль"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !loading) handleSubmit();
                  }}
                />
              </span>
            </label>

            {error && (
              <p className="rp-error" role="alert">
                {error}
              </p>
            )}

            <button
              className="rp-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Збереження..." : "Зберегти пароль"}
            </button>
          </div>
        )}

        {status === "done" && (
          <div className="rp-body">
            <div className="rp-icon rp-icon--ok" aria-hidden="true">
              <ShieldCheck size={28} />
            </div>
            <h1 className="rp-title">Готово</h1>
            <p className="rp-success">Пароль змінено. Ви увійшли в кабінет.</p>
            <button className="rp-btn" onClick={() => navigate("/registry")}>
              Перейти в кабінет
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
