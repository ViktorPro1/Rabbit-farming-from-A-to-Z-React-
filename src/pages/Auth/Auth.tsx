import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { Link } from "react-router-dom";
import "./Auth.css";

type Mode = "login" | "register";

interface Props {
  returnTo?: string;
}

export default function Auth({ returnTo = "/registry" }: Props) {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin() {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError("Невірний email або пароль");
      setLoading(false);
    } else {
      navigate(returnTo);
    }
  }

  async function handleRegister() {
    setLoading(true);
    setError("");

    const cleanCode = inviteCode.trim().toUpperCase();

    if (!cleanCode) {
      setError("Введіть інвайт код");
      setLoading(false);
      return;
    }

    // Крок 1: шукаємо код БЕЗ фільтра is_used, щоб розрізнити
    // "коду не існує" від "код уже використаний" — раніше обидва
    // випадки поверталися однаковим повідомленням через .eq("is_used", false).
    const { data: code, error: codeError } = await supabase
      .from("invite_codes")
      .select("*")
      .eq("code", cleanCode)
      .maybeSingle();

    if (codeError) {
      setError("Помилка перевірки коду: " + codeError.message);
      setLoading(false);
      return;
    }

    if (!code) {
      setError("Такого інвайт коду не існує. Перевірте правильність введення");
      setLoading(false);
      return;
    }

    if (code.is_used) {
      setError("Цей інвайт код уже використаний");
      setLoading(false);
      return;
    }

    // Крок 2: реєстрація користувача
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError("Помилка реєстрації: " + authError.message);
      setLoading(false);
      return;
    }

    const userId = authData.user?.id;

    if (!userId) {
      // Потрібне підтвердження email — код НЕ позначаємо використаним,
      // інакше людина підтвердить пошту, а код вже "згорить" ні на що.
      setError(
        "✅ Перевірте email для підтвердження реєстрації. Після підтвердження увійдіть — код активується автоматично при першому вході",
      );
      setLoading(false);
      return;
    }

    // Крок 3: позначаємо код використаним. Якщо це не вдасться —
    // повідомляємо явно, а не мовчки продовжуємо (раніше помилка
    // тут ігнорувалась і користувач міг лишитись з "вільним" кодом,
    // прив'язаним до вже існуючого акаунту).
    const { error: markUsedError } = await supabase
      .from("invite_codes")
      .update({ is_used: true, used_by: userId })
      .eq("id", code.id)
      .eq("is_used", false); // додатковий захист від гонки двох одночасних реєстрацій

    if (markUsedError) {
      console.error(
        "Не вдалося позначити інвайт код використаним:",
        markUsedError,
      );
    }

    // Входимо одразу після реєстрації
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError("Зареєстровано! Тепер увійдіть вручну.");
      setMode("login");
      setLoading(false);
      return;
    }

    navigate(returnTo);
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>
          🐇 Облік кроликів <br /> та калькулятор кролівництва{" "}
        </h1>

        <div className="auth-tabs">
          <button
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            Вхід
          </button>
          <button
            className={mode === "register" ? "active" : ""}
            onClick={() => setMode("register")}
          >
            Реєстрація
          </button>
        </div>

        <div className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {mode === "register" && (
            <input
              type="text"
              placeholder="Інвайт код"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            />
          )}

          {error && <p className="auth-error">{error}</p>}

          <button
            className="auth-submit"
            onClick={mode === "login" ? handleLogin : handleRegister}
            disabled={loading}
          >
            {loading
              ? "Завантаження..."
              : mode === "login"
                ? "Увійти"
                : "Зареєструватись"}
          </button>
        </div>

        {mode === "register" && (
          <p className="auth-info">
            ℹ️ Реєстрація є платною. Для отримання інвайт-коду звертайтесь:
            <br />
            📧 <a href="mailto:webstartstudio978@gmail.com">Наша пошта</a>
            <br />
            ✈️{" "}
            <a
              href="https://t.me/Viktor_freelancer_recruiting_pit"
              target="_blank"
              rel="noreferrer"
            >
              Наш телеграм
            </a>
            <br />
            📋 <Link to="/subscription">Що входить у підписку →</Link>
          </p>
        )}
      </div>
    </div>
  );
}
