/**
 * Додано: реєструє WebMCP-інструменти (пошук статей і відкриття сторінки)
 * для ШІ-агентів у браузері. Нічого не рендерить. Якщо браузер не підтримує
 * navigator.modelContext, registerWebMCPTools нічого не робить.
 * Має бути всередині <BrowserRouter>, бо використовує useNavigate.
 */
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { registerWebMCPTools } from "../../utils/webmcp";
import { loadSiteCards } from "../../utils/webmcpCards";

export default function WebMCPRegistrar() {
  const navigate = useNavigate();

  // У BrowserRouter ідентичність navigate змінюється при кожній навігації.
  // Тримаємо актуальну функцію в ref, щоб реєструвати інструменти один раз,
  // а не перереєстровувати їх на кожен перехід.
  const navigateRef = useRef(navigate);
  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  useEffect(() => {
    return registerWebMCPTools({
      navigate: (path) => navigateRef.current(path),
      loadCards: loadSiteCards,
    });
  }, []);

  return null;
}
