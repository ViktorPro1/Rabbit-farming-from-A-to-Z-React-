// src/hooks/useMetaPixelPageView.ts
//
// Базовий код Meta Pixel відправляє fbq('track', 'PageView') лише один
// раз, при першому завантаженні сторінки. Оскільки цей проєкт — SPA
// (react-router-dom v7) з prerendering, переходи між 405 сторінками
// НЕ перезавантажують сторінку — без цього хука Meta бачила б лише
// одну єдину PageView-подію на весь візит користувача.
//
// Хук треба викликати з компонента, що рендериться ВСЕРЕДИНІ
// <BrowserRouter> (useLocation працює тільки в контексті роутера).

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function useMetaPixelPageView(): void {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }
  }, [location.pathname, location.search]);
}
