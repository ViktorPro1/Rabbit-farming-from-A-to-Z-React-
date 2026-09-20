import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

interface Props {
  children: React.ReactNode;
}

// Змінено: додано статус "error" — збій перевірки більше не відкриває кабінет.
type Status = "checking" | "ok" | "expired" | "error";

// Обгортає кабінетні маршрути. Перевіряє access_until через RPC
// get_my_access_status і показує екран блокування, якщо строк вийшов.
// Якщо access_until = null — доступ безстроковий, ніколи не блокується.
// Текст навмисно нейтральний ("термін доступу", а не "пробний період") —
// цей самий екран бачить і платний клієнт з простроченою підпискою,
// бо на рівні бази пробний і платний доступ регулюються однаково.
// Якщо перевірити строк не вдалося (помилка RPC чи мережі), кабінет НЕ
// відкривається: показується екран з кнопкою "Спробувати ще раз".
export default function AccessGuard({ children }: Props) {
  const [status, setStatus] = useState<Status>("checking");
  // Лічильник спроб: його зміна перезапускає перевірку (кнопка "Спробувати ще раз")
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const { data, error } = await supabase.rpc("get_my_access_status");
        if (cancelled) return;
        if (error) {
          console.error("Не вдалося перевірити термін доступу:", error);
          // Раніше тут було setStatus("ok") — при збої кабінет відкривався
          // навіть із простроченим доступом. Тепер показуємо екран повтору:
          // платний клієнт натисне кнопку, а прострочений доступ не отримає.
          setStatus("error");
          return;
        }
        const row = data?.[0];
        setStatus(row?.is_expired ? "expired" : "ok");
      } catch (err) {
        // Синхронний або мережевий збій — не залишаємо користувача
        // застряглим на "Завантаження". Раніше тут було setStatus("ok").
        if (cancelled) return;
        console.error("Не вдалося перевірити термін доступу:", err);
        setStatus("error");
      }
    }

    check();

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  function handleRetry() {
    setStatus("checking");
    setAttempt((n) => n + 1);
  }

  if (status === "checking") {
    return (
      <p style={{ padding: "2rem", textAlign: "center" }}>Завантаження...</p>
    );
  }

  if (status === "error") {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          maxWidth: 480,
          margin: "0 auto",
        }}
      >
        <h2>Не вдалося перевірити термін доступу</h2>
        <p>
          Перевірте інтернет-з'єднання і спробуйте ще раз. Якщо проблема не
          зникає, зверніться до адміністратора.
        </p>
        <p>
          <button type="button" onClick={handleRetry}>
            Спробувати ще раз
          </button>
        </p>
      </div>
    );
  }

  if (status === "expired") {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          maxWidth: 480,
          margin: "0 auto",
        }}
      >
        <h2>⏳ Термін доступу закінчився</h2>
        <p>
          Доступ до вашого кабінету призупинено. Щоб продовжити користуватись
          обліком кроликів та калькулятором, оформіть або продовжіть підписку.
        </p>
        <p>
          <Link to="/subscription">Що входить у підписку →</Link>
        </p>
        <p>
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
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
