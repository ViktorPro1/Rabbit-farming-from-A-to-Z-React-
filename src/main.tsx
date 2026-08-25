import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import "./index.css";
import App from "./App.tsx";
import { registerSW } from "virtual:pwa-register";
import { HelmetProvider } from "react-helmet-async";

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
);

window.addEventListener("load", () => {
  registerSW({
    onNeedRefresh() {
      window.dispatchEvent(new CustomEvent("sw-update"));
    },
    onRegisterError(error) {
      // тихо логуємо, щоб не було "Uncaught (in promise)"
      console.warn("SW registration failed:", error);
    },
  });
});
