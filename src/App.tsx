import { useEffect, useState, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { supabase } from "./lib/supabase";
import type { Session } from "@supabase/supabase-js";
import Admin from "./pages/Admin/Admin";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home";
import Breeds from "./pages/Breeds/Breeds";
import Breeding from "./pages/Breeding/Breeding";
import Care from "./pages/Care/Care";
import Feeding from "./pages/Feeding/Feeding";
import FloorCare from "./pages/FloorCare/FloorCare";
import Diseases from "./pages/Diseases/Diseases";
import Okril from "./pages/Okril/Okril";
import Parasites from "./pages/Parasites/Parasites";
import FirstAid from "./pages/FirstAid/FirstAid";
import Tips from "./pages/Tips/Tips";
import Calculator from "./pages/Calculator/Calculator";
import Vaccinations from "./pages/Vaccinations/Vaccinations";
import Enclosure from "./pages/Enclosure/Enclosure";
import Calendar from "./pages/Calendar/Calendar";
import Slaughter from "./pages/Slaughter/Slaughter";
import Medicines from "./pages/Medicines/Medicines";
import Auth from "./pages/Auth/Auth";
import RabbitRegistry from "./pages/RabbitRegistry/RabbitRegistry";
import RabbitEdit from "./pages/RabbitEdit/RabbitEdit";
import Archive from "./pages/Archive/Archive";
import Matings from "./pages/Matings/Matings";
import Leaves from "./pages/Leaves/Leaves";
import Paddocks from "./pages/Paddocks/Paddocks";
import Fattening from "./pages/Fattening/Fattening";
import Quarantine from "./pages/Quarantine/Quarantine";
import Community from "./pages/Community/Community";
import { UpdatePrompt } from "./components/UpdatePrompt/UpdatePrompt";
import Equipment from "./pages/Equipment/Equipment";
import Disinfection from "./pages/Disinfection/Disinfection";
import WeightControl from "./pages/WeightControl/WeightControl";
import Treatment from "./pages/Treatment/Treatment";
import Crops from "./pages/Crops/Crops";
import Selection from "./pages/Selection/Selection";
import Recipes from "./pages/Recipes/Recipes";
import Subscription from "./pages/Subscription/Subscription";
import Statistics from "./pages/Statistics/Statistics";

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
          style={{
            color: "#2d5a1b",
            marginBottom: "1rem",
            fontSize: "1.4rem",
          }}
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
      if (session) {
        checkProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        checkProfile(session.user.id);
      } else {
        setHasProfile(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [checkProfile]);

  if (loading)
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Завантаження...
      </div>
    );

  if (session && !hasProfile) {
    return <SubscriptionExpired />;
  }

  return (
    <BrowserRouter>
      <Header session={session} />
      <Routes>
        <Route
          path="/admin"
          element={session ? <Admin session={session} /> : <Auth />}
        />
        <Route path="/" element={<Home />} />
        <Route path="/breeds" element={<Breeds />} />
        <Route path="/breeding" element={<Breeding />} />
        <Route path="/care" element={<Care />} />
        <Route path="/feeding" element={<Feeding />} />
        <Route path="/floor-care" element={<FloorCare />} />
        <Route path="/diseases" element={<Diseases />} />
        <Route path="/okril" element={<Okril />} />
        <Route path="/parasites" element={<Parasites />} />
        <Route path="/first-aid" element={<FirstAid />} />
        <Route path="/tips" element={<Tips />} />
        <Route
          path="/calculator"
          element={session ? <Calculator /> : <Auth returnTo="/calculator" />}
        />
        <Route path="/vaccinations" element={<Vaccinations />} />
        <Route path="/enclosure" element={<Enclosure />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/slaughter" element={<Slaughter />} />
        <Route path="/medicines" element={<Medicines />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/leaves" element={<Leaves />} />
        <Route path="/community" element={<Community />} />
        <Route
          path="/registry"
          element={session ? <RabbitRegistry session={session} /> : <Auth />}
        />
        <Route
          path="/registry/edit/:id"
          element={session ? <RabbitEdit session={session} /> : <Auth />}
        />
        <Route
          path="/archive"
          element={session ? <Archive session={session} /> : <Auth />}
        />
        <Route
          path="/matings"
          element={session ? <Matings session={session} /> : <Auth />}
        />
        <Route
          path="/paddocks"
          element={session ? <Paddocks session={session} /> : <Auth />}
        />
        <Route
          path="/fattening"
          element={session ? <Fattening session={session} /> : <Auth />}
        />
        <Route
          path="/quarantine"
          element={session ? <Quarantine session={session} /> : <Auth />}
        />
        <Route path="/equipment" element={<Equipment />} />
        <Route path="/disinfection" element={<Disinfection />} />
        <Route path="/weight-control" element={<WeightControl />} />
        <Route path="/treatment" element={<Treatment />} />
        <Route path="/crops" element={<Crops />} />
        <Route path="/selection" element={<Selection />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route
          path="/statistics"
          element={session ? <Statistics session={session} /> : <Auth />}
        />
      </Routes>
      <Footer />
      <UpdatePrompt />
    </BrowserRouter>
  );
}

export default App;
