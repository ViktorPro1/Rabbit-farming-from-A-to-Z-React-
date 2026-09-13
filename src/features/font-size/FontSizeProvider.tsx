import { useEffect, useState, type ReactNode } from "react";
import { FontSizeContext, type FontScale } from "./fontSizeContext";

const STORAGE_KEY = "fontScale";
const BODY_CLASSES: Record<FontScale, string | null> = {
  "1": null, // базовий розмір — жодного класу не додаємо
  "2": "font-scale-2",
  "3": "font-scale-3",
};

function readInitialScale(): FontScale {
  if (typeof window === "undefined") return "1";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === "2" || saved === "3") return saved;
  return "1";
}

export function FontSizeProvider({ children }: { children: ReactNode }) {
  const [scale, setScale] = useState<FontScale>(readInitialScale);

  useEffect(() => {
    const body = document.body;

    // Прибираємо всі можливі класи масштабу, потім додаємо потрібний.
    Object.values(BODY_CLASSES).forEach((cls) => {
      if (cls) body.classList.remove(cls);
    });

    const classToAdd = BODY_CLASSES[scale];
    if (classToAdd) body.classList.add(classToAdd);

    window.localStorage.setItem(STORAGE_KEY, scale);
  }, [scale]);

  return (
    <FontSizeContext.Provider value={{ scale, setScale }}>
      {children}
    </FontSizeContext.Provider>
  );
}
