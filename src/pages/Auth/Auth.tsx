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

  // Змінено: try/catch/finally — раніше виняток (напр. збій мережі) лишав
  // кнопку в стані "Завантаження..." назавжди.
  async function handleLogin() {
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        if (error.message.toLowerCase().includes("email not confirmed")) {
          setError(
            "Пошта ще не підтверджена. Перевірте вхідні (і папку Спам) та перейдіть за посиланням з листа",
          );
        } else {
          setError("Невірний email або пароль");
        }
      } else {
        navigate(returnTo);
      }
    } catch (err) {
      console.error("Помилка входу:", err);
      setError("Не вдалося увійти. Перевірте з'єднання й спробуйте ще раз");
    } finally {
      setLoading(false);
    }
  }

  // Змінено: інвайт-код тепер перевіряється й погашається в базі в момент
  // створення користувача (тригер handle_new_user читає його з метаданих
  // реєстрації). Раніше код перевірявся лише тут, у браузері, тому реєстрація
  // напряму через API обходила його, а збій mark_invite_code_used ігнорувався.
  // Перевірка validate_invite_code нижче лишилась лише для зрозумілих
  // повідомлень користувачу, захист забезпечує база.
  async function handleRegister() {
    setLoading(true);
    setError("");

    try {
      const cleanCode = inviteCode.trim().toUpperCase();

      if (!cleanCode) {
        setError("Введіть інвайт код");
        return;
      }

      // Крок 1: перевіряємо код через RPC-функцію (SECURITY DEFINER),
      // а не прямим SELECT — до логіну користувач анонімний, і прямий
      // SELECT з таблиці invite_codes блокується RLS, через що коди
      // завжди виглядали "неіснуючими", навіть коли існували.
      const { data: rpcData, error: codeError } = await supabase.rpc(
        "validate_invite_code",
        { code_input: cleanCode },
      );

      if (codeError) {
        setError("Помилка перевірки коду: " + codeError.message);
        return;
      }

      const codeResult = rpcData?.[0];

      if (!codeResult || !codeResult.code_exists) {
        setError(
          "Такого інвайт коду не існує. Перевірте правильність введення",
        );
        return;
      }

      if (codeResult.code_used) {
        setError("Цей інвайт код уже використаний");
        return;
      }

      // Крок 2: реєстрація. Код передається в метаданих: база перевіряє його
      // і позначає використаним атомарно разом зі створенням користувача.
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { invite_code: cleanCode } },
      });

      if (authError) {
        if (authError.message.toLowerCase().includes("database error")) {
          // База відхилила реєстрацію: код став недійсним (напр. його щойно
          // використав хтось інший) або інша помилка збереження
          setError(
            "Не вдалося зареєструватись. Можливо, інвайт код щойно використано. Спробуйте ще раз або зверніться до адміністратора",
          );
        } else {
          setError("Помилка реєстрації: " + authError.message);
        }
        return;
      }

      // Користувач створюється завжди (навіть коли потрібне підтвердження
      // пошти), тож відсутність id означає збій, а не "очікування підтвердження"
      if (!authData.user?.id) {
        setError("Не вдалося завершити реєстрацію. Спробуйте ще раз");
        return;
      }

      // Входимо одразу після реєстрації
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        setError("Зареєстровано! Тепер увійдіть вручну.");
        setMode("login");
        return;
      }

      navigate(returnTo);
    } catch (err) {
      console.error("Помилка реєстрації:", err);
      setError(
        "Не вдалося зареєструватись. Перевірте з'єднання й спробуйте ще раз",
      );
    } finally {
      setLoading(false);
    }
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
            id="auth-email"
            name="email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            id="auth-password"
            name="password"
            type="password"
            placeholder="Пароль"
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {mode === "register" && (
            <input
              id="auth-invite-code"
              name="inviteCode"
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
            📧 <a href="mailto:rabbit.farming.ua@gmail.com">Наша пошта</a>
            <br />
            ✈️{" "}
            <a
              href="https://t.me/Dima_freelancer_recruiting_pit"
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
