import { useCallback, useEffect, useState } from "react";

const TIME_ZONE = "Europe/Kyiv";
const STORAGE_KEY = "minute-of-silence-closed-date";

// Повертає поточну дату та час за Києвом, незалежно від часового поясу відвідувача
export function getKyivNow(date: Date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";

  return {
    dateKey: `${get("year")}-${get("month")}-${get("day")}`,
    hour: Number(get("hour")),
    minute: Number(get("minute")),
  };
}

// true, якщо зараз проміжок 9:00:00 – 9:00:59 за Києвом
export function isSilenceTime(date: Date = new Date()): boolean {
  const { hour, minute } = getKyivNow(date);
  return hour === 9 && minute === 0;
}

function wasClosedToday(dateKey: string): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === dateKey;
  } catch {
    return false;
  }
}

let closedInTest = false;

// Тільки для розробки: відкрийте сайт з ?silence=test, щоб побачити вікно в будь-який час.
// У продакшені (після збірки) цей режим не працює.
function isTestMode(): boolean {
  return (
    import.meta.env.DEV &&
    new URLSearchParams(window.location.search).get("silence") === "test"
  );
}

// Єдине місце, де вирішується, чи показувати вікно саме зараз
function shouldShowNow(): boolean {
  if (isTestMode()) return !closedInTest;
  return isSilenceTime() && !wasClosedToday(getKyivNow().dateKey);
}

export function useMinuteOfSilence() {
  // Початкове значення обчислюється один раз, під час першого рендеру
  const [isOpen, setIsOpen] = useState(shouldShowNow);

  // Далі перевіряємо щосекунди
  useEffect(() => {
    const id = setInterval(() => setIsOpen(shouldShowNow()), 1000);
    return () => clearInterval(id);
  }, []);

  const close = useCallback(() => {
    if (isTestMode()) {
      closedInTest = true;
    } else {
      try {
        localStorage.setItem(STORAGE_KEY, getKyivNow().dateKey);
      } catch {
        // якщо localStorage недоступний, вікно закриється до наступної перевірки
      }
    }
    setIsOpen(false);
  }, []);

  return { isOpen, close };
}