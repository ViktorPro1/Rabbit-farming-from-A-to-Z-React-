import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { logError } from "../lib/logError";

// Подія, яку сторінка чату надсилає після того, як позначила чат прочитаним:
// хедер за нею одразу перераховує лічильник, не чекаючи наступного опитування.
export const CHAT_READ_EVENT = "chat-read";

// Як часто тихо перепитувати лічильник, поки вкладка відкрита
const POLL_MS = 60_000;

// Кількість нових повідомлень чату для кружечка в хедері.
// Лічить база (функція chat_unread_count), тут лише опитування.
// Без сесії завжди 0 і нічого не запитується.
export function useChatUnread(session: Session | null): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;

    async function refresh() {
      try {
        const { data, error } = await supabase.rpc("chat_unread_count");
        if (cancelled) return;
        if (error) {
          logError("useChatUnread.refresh", error);
          return;
        }
        setCount(typeof data === "number" ? data : 0);
      } catch (err) {
        logError("useChatUnread.refresh", err);
      }
    }

    // Опитуємо лише коли вкладку видно, щоб не палити запити у фоні
    const tick = () => {
      if (!document.hidden) void refresh();
    };

    void refresh();
    const timer = window.setInterval(tick, POLL_MS);
    document.addEventListener("visibilitychange", tick);
    window.addEventListener(CHAT_READ_EVENT, tick);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", tick);
      window.removeEventListener(CHAT_READ_EVENT, tick);
    };
  }, [session]);

  // Без сесії показуємо 0, навіть якщо в стані лишилось старе значення
  return session ? count : 0;
}
