import { useEffect } from "react";
import * as CookieConsent from "vanilla-cookieconsent";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import "./CookieConsent.css";

const GA_ID = "G-RL8GL7SHMR";

const loadGoogleAnalytics = () => {
  if (document.getElementById("ga-script")) return; // вже завантажено

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag("js", new Date());

  const script = document.createElement("script");
  script.id = "ga-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.onload = () => {
    window.gtag("config", GA_ID);
  };
  document.head.appendChild(script);
};

export default function CookieConsentBanner() {
  useEffect(() => {
    CookieConsent.run({
      guiOptions: {
        consentModal: {
          layout: "box",
          position: "bottom right",
        },
      },
      categories: {
        necessary: { enabled: true, readOnly: true },
        analytics: {
          enabled: false,
          autoClear: { cookies: [{ name: /^_ga/ }] },
        },
      },
      language: {
        default: "uk",
        translations: {
          uk: {
            consentModal: {
              title: "Ми використовуємо файли cookie",
              description:
                "Цей посібник використовує cookie для аналітики відвідуванoсті. Ви можете прийняти або відхилити їх використання.",
              acceptAllBtn: "Прийняти всі",
              acceptNecessaryBtn: "Тільки необхідні",
              showPreferencesBtn: "Налаштування",
            },
            preferencesModal: {
              title: "Налаштування cookie",
              acceptAllBtn: "Прийняти всі",
              acceptNecessaryBtn: "Тільки необхідні",
              savePreferencesBtn: "Зберегти",
              sections: [
                {
                  title: "Необхідні",
                  description: "Потрібні для роботи сайту.",
                  linkedCategory: "necessary",
                },
                {
                  title: "Аналітика",
                  description:
                    "Допомагають зрозуміти, як відвідувачі використовують сайт.",
                  linkedCategory: "analytics",
                },
              ],
            },
          },
        },
      },
      onConsent: ({ cookie }) => {
        if (cookie.categories.includes("analytics")) {
          loadGoogleAnalytics();
        }
      },
      onChange: ({ cookie }) => {
        if (cookie.categories.includes("analytics")) {
          loadGoogleAnalytics();
        }
      },
    });
  }, []);

  return null;
}

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}
