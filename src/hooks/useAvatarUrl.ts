import { useEffect, useState } from "react";
import { logError } from "../lib/logError";
import { getFullUrl } from "../utils/photoStorage";

/**
 * Повертає підписане посилання на аватар за шляхом зі сховища
 * (user_metadata.avatar_path) або null, якщо аватара немає чи посилання
 * ще не отримане. Посилання кешується в photoStorage, тому використання
 * хука в шапці на кожній сторінці не створює зайвих запитів.
 */
export function useAvatarUrl(path: string | null | undefined): string | null {
  const [resolved, setResolved] = useState<{
    path: string;
    url: string;
  } | null>(null);

  useEffect(() => {
    if (!path) return;
    let cancelled = false;
    getFullUrl(path)
      .then((url) => {
        if (!cancelled && url) setResolved({ path, url });
      })
      .catch((err) => logError("useAvatarUrl", err));
    return () => {
      cancelled = true;
    };
  }, [path]);

  // Посилання діє лише для поточного шляху; після заміни старе не показуємо
  return path && resolved?.path === path ? resolved.url : null;
}
