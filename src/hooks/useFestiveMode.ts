// Додано: стан «святкового режиму» (гірлянди + сніг).
// Значення лежить у таблиці site_settings (ключ festive_mode), перемикається
// галочкою в адмінці. Єдиний запит на всіх споживачів (App, Hero, Admin),
// останнє значення кешується в localStorage, щоб не було блимання при завантаженні.
import { useEffect, useSyncExternalStore } from "react";
import { supabase } from "../lib/supabase";
import { logError } from "../lib/logError";

const SETTING_KEY = "festive_mode";
const CACHE_KEY = "festive-mode-cache";

function readCache(): boolean {
  try {
    return localStorage.getItem(CACHE_KEY) === "1";
  } catch {
    return false;
  }
}

let current = typeof window !== "undefined" ? readCache() : false;
let requested = false;
const listeners = new Set<() => void>();

/** Оновлює значення для всіх підписаних компонентів і кешує його. */
export function setFestiveMode(value: boolean) {
  if (value === current) return;
  current = value;
  try {
    localStorage.setItem(CACHE_KEY, value ? "1" : "0");
  } catch {
    // localStorage недоступний — просто не кешуємо
  }
  listeners.forEach((l) => l());
}

async function loadOnce() {
  if (requested) return;
  requested = true;
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", SETTING_KEY)
      .maybeSingle();
    if (error) throw error;
    // Рядка немає — режим вимкнений
    setFestiveMode(data?.value === true);
  } catch (error) {
    // Збій мережі чи відсутня таблиця не повинні ламати сайт:
    // лишаємо кешоване значення і дозволяємо повторити спробу пізніше
    requested = false;
    logError("useFestiveMode.load", error);
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useFestiveMode(): boolean {
  useEffect(() => {
    void loadOnce();
  }, []);
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => false, // під час prerender святкових ефектів немає
  );
}
