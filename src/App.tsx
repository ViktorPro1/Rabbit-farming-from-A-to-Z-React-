import { useEffect, useState, useCallback, lazy, Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { supabase } from "./lib/supabase";
import { logError } from "./lib/logError";
import type { Session } from "@supabase/supabase-js";
import CopyProtection from "./components/CopyProtection/CopyProtection";

import WelcomePopup from "./components/WelcomePopup/WelcomePopup";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { UpdatePrompt } from "./components/UpdatePrompt/UpdatePrompt";
import Breadcrumbs from "./components/Breadcrumbs/Breadcrumbs";
import AppRoutes from "./routes/AppRoutes";
import CookieConsentBanner from "./components/CookieConsent/CookieConsent";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import { usePublicPresence } from "./hooks/usePublicPresence";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import PrintButton from "./components/PrintButton/PrintButton";
const Assistant = lazy(() => import("./components/Assistant/Assistant"));
const AssistantPromo = lazy(
  () => import("./components/AssistantPromo/AssistantPromo"),
);
import "./print.css";
import "./App-states.css";
import { useTVNavigation } from "./hooks/useTVNavigation";
import DonationPopup from "./components/DonationPopup/DonationPopup";

// ─────────────────────────────────────────────
// Фікс бага: Facebook іноді додає невидимий юнікод-символ
// (напр. U+2061 "FUNCTION APPLICATION") перед посиланням у дописі,
// щоб уникнути повторної генерації link preview. Через це браузер
// переходить не на "/", а на "/⁡", і React Router не знаходить
// такий маршрут -> показує 404. Ця функція очищує pathname
// від подібних невидимих символів ще до рендеру роутів.
function cleanInvisibleUnicodeFromPath() {
  const invisibleCharsRegex = /[\u200B-\u200D\uFEFF\u2060-\u2064\u00AD]/g;
  const { pathname, search, hash } = window.location;
  const cleanPath = pathname.replace(invisibleCharsRegex, "");

  if (cleanPath !== pathname) {
    window.history.replaceState({}, "", (cleanPath || "/") + search + hash);
  }
}

// ─────────────────────────────────────────────
function SubscriptionExpired() {
  async function handleLogout() {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      logError("SubscriptionExpired.handleLogout", error);
    }
  }

  return (
    <div className="app-state-screen">
      <div className="app-state-card app-state-card--wide">
        <div className="app-state-icon app-state-icon--lg">🔒</div>
        <h2 className="app-state-title app-state-title--lg">
          Підписка закінчилась
        </h2>

        <p className="app-state-desc app-state-desc--lg">
          Вибачте, ваша підписка була деактивована. Для поновлення доступу
          зверніться до адміністратора:
        </p>

        <p className="app-state-link-row">
          📧{" "}
          <a
            href="mailto:webstartstudio978@gmail.com"
            className="app-state-link"
          >
            webstartstudio978@gmail.com
          </a>
        </p>

        <p className="app-state-link-row app-state-link-row--last">
          ✈️{" "}
          <a
            href="https://t.me/Viktor_freelancer_recruiting_pit"
            target="_blank"
            rel="noreferrer"
            className="app-state-link"
          >
            Telegram
          </a>
        </p>

        <button onClick={handleLogout} className="app-state-btn">
          Вийти
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(true);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const checkProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", userId)
        .single();

      if (error) throw error;

      setHasProfile(!!data);
    } catch (error) {
      logError("App.checkProfile", error);
      // Не блокуємо доступ через технічну помилку запиту —
      // трактуємо як "профіль є", щоб не показати хибний
      // SubscriptionExpired через збій мережі/супабейзу.
      setHasProfile(true);
    } finally {
      setLoading(false);
    }
  }, []);

  usePublicPresence();
  useTVNavigation();

  // Фікс 404 з невидимим символом Facebook — виконується один раз
  // на старті, до того як React Router почне обробляти шлях.
  useEffect(() => {
    cleanInvisibleUnicodeFromPath();
  }, []);

  useEffect(() => {
    if (!loading) {
      const splash = document.getElementById("splash");
      if (splash) {
        splash.classList.add("splash--hidden");
        setTimeout(() => splash.remove(), 400);
      }
    }
  }, [loading]);

  useEffect(() => {
    const updateStatus = () => setIsOffline(!navigator.onLine);

    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    updateStatus();

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingTimeout(true);
    }, 30000);

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        if (session) checkProfile(session.user.id);
        else setLoading(false);
      })
      .catch((error) => {
        logError("App.getSession", error);
        setLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) checkProfile(session.user.id);
      else setHasProfile(true);
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, [checkProfile]);

  if (isOffline) {
    return (
      <div className="app-state-screen">
        <div className="app-state-card">
          <div className="app-state-icon">📡</div>
          <h2 className="app-state-title">Немає інтернету</h2>
          <p className="app-state-desc">
            Перевірте підключення і спробуйте ще раз
          </p>
          <button
            onClick={() => window.location.reload()}
            className="app-state-btn"
          >
            Оновити сторінку
          </button>
        </div>
      </div>
    );
  }

  if (loading && loadingTimeout) {
    return (
      <div className="app-state-screen">
        <div className="app-state-card">
          <div className="app-state-icon">📡</div>
          <h2 className="app-state-title app-state-title--sm">
            Не вдалося підключитися
          </h2>
          <p className="app-state-desc app-state-desc--lg">
            Перевірте інтернет і спробуйте ще раз.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="app-state-btn"
          >
            Оновити сторінку
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="app-state-screen app-state-screen--loading">
        Завантаження...
      </div>
    );
  }

  if (session && !hasProfile) return <SubscriptionExpired />;

  return (
    <>
      <ErrorBoundary>
        <DonationPopup />
        <CopyProtection />
        <CookieConsentBanner />
        <BrowserRouter>
          <WelcomePopup />
          <ErrorBoundary boundaryName="Assistant" fallback={null}>
            <Suspense fallback={null}>
              <Assistant />
              <AssistantPromo />
            </Suspense>
          </ErrorBoundary>
          <Header session={session} />
          <div className="breadcrumbs-wrap">
            <Breadcrumbs />
          </div>
          <AppRoutes session={session} />
          <PrintButton />
          <ScrollToTop />
          <Footer />
          <UpdatePrompt />
        </BrowserRouter>
      </ErrorBoundary>
    </>
  );
}

export default App;
