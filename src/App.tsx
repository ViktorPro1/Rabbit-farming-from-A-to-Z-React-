import { useEffect, useState, useCallback } from "react";
import { BrowserRouter } from "react-router-dom";
import { supabase } from "./lib/supabase";
import type { Session } from "@supabase/supabase-js";
import CopyProtection from "./components/CopyProtection/CopyProtection";
import Assistant from "./components/Assistant/Assistant";
import WelcomePopup from "./components/WelcomePopup/WelcomePopup";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { UpdatePrompt } from "./components/UpdatePrompt/UpdatePrompt";
import AppRoutes from "./routes/AppRoutes";

// ─────────────────────────────────────────────
function SubscriptionExpired() {
  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f0e8",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "3rem 2.5rem",
          maxWidth: "420px",
          textAlign: "center",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔒</div>
        <h2
          style={{ color: "#2d5a1b", marginBottom: "1rem", fontSize: "1.4rem" }}
        >
          Підписка закінчилась
        </h2>
        <p style={{ color: "#555", marginBottom: "2rem", lineHeight: 1.6 }}>
          Вибачте, ваша підписка була деактивована. Для поновлення доступу
          зверніться до адміністратора:
        </p>
        <p style={{ marginBottom: "0.5rem" }}>
          📧{" "}
          <a
            href="mailto:webstartstudio978@gmail.com"
            style={{ color: "#2d5a1b" }}
          >
            webstartstudio978@gmail.com
          </a>
        </p>
        <p style={{ marginBottom: "2rem" }}>
          ✈️{" "}
          <a
            href="https://t.me/Viktor_freelancer_recruiting_pit"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#2d5a1b" }}
          >
            Telegram
          </a>
        </p>
        <button
          onClick={handleLogout}
          style={{
            background: "#2d5a1b",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "0.75rem 2rem",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
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

  const checkProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();
    setHasProfile(!!data);
    setLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) checkProfile(session.user.id);
      else setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) checkProfile(session.user.id);
      else setHasProfile(true);
    });

    return () => subscription.unsubscribe();
  }, [checkProfile]);

  if (loading)
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Завантаження...
      </div>
    );
  if (session && !hasProfile) return <SubscriptionExpired />;

  return (
    <>
      <CopyProtection />
      <BrowserRouter>
        <WelcomePopup />
        <Assistant />
        <Header session={session} />
        <AppRoutes session={session} />
        <Footer />
        <UpdatePrompt />
      </BrowserRouter>
    </>
  );
}

export default App;
