import { useEffect, useState, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { supabase } from "./lib/supabase";
import type { Session } from "@supabase/supabase-js";
import CopyProtection from "./components/CopyProtection/CopyProtection";
import Assistant from "./components/Assistant/Assistant";
import WelcomePopup from "./components/WelcomePopup/WelcomePopup";

//  АДМІН
import Admin from "./pages/Admin/Admin";

//  З ЧОГО ПОЧАТИ
import BeginnerGuide from "./pages/BeginnerGuide/BeginnerGuide";
import FAQ from "./pages/FAQ/FAQ";

// ЗАГАЛЬНІ КОМПОНЕНТИ
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { UpdatePrompt } from "./components/UpdatePrompt/UpdatePrompt";

// ГОЛОВНА
import Home from "./pages/Home";
import Auth from "./pages/Auth/Auth";
import Subscription from "./pages/Subscription/Subscription";
import Community from "./pages/Community/Community";

// ПОЧАТОК — знайомство з твариною
import Biology from "./pages/Biology/Biology";
import Breeds from "./pages/Breeds/Breeds";
import Breeding from "./pages/Breeding/Breeding";
import ArtificialInsemination from "./pages/ArtificialInsemination/ArtificialInsemination";
import Selection from "./pages/Selection/Selection";
import Genetics from "./pages/Genetics/Genetics";

// ЖИТЛО
import Enclosure from "./pages/Enclosure/Enclosure";
import FloorCare from "./pages/FloorCare/FloorCare";
import PaddockInfo from "./pages/Paddocks/PaddockInfo";
import Microclimate from "./pages/Microclimate/Microclimate";

// ХАРЧУВАННЯ
import Feeding from "./pages/Feeding/Feeding";
import Leaves from "./pages/Leaves/Leaves";
import Crops from "./pages/Crops/Crops";
import Water from "./pages/Water/Water";
import Feeders from "./pages/Feeders/Feeders";

// ДОГЛЯД
import Care from "./pages/Care/Care";
import Disinfection from "./pages/Disinfection/Disinfection";
import Biosecurity from "./pages/Biosecurity/Biosecurity";
import Grooming from "./pages/Grooming/Grooming";

// РОЗВЕДЕННЯ
import Okril from "./pages/Okril/Okril";
import WinterLitter from "./pages/WinterLitter/WinterLitter";
import Weaning from "./pages/Weaning/Weaning";
import WeightControl from "./pages/WeightControl/WeightControl";
import ArtificialFeeding from "./pages/ArtificialFeeding/ArtificialFeeding";
import MatingPage from "./pages/MatingFrequency/MatingFrequency";

// ЗДОРОВ'Я
import Vaccinations from "./pages/Vaccinations/Vaccinations";
import Parasites from "./pages/Parasites/Parasites";
import Diseases from "./pages/Diseases/Diseases";
import Medicines from "./pages/Medicines/Medicines";
import Treatment from "./pages/Treatment/Treatment";
import FirstAid from "./pages/FirstAid/FirstAid";
import LabDiagnostics from "./pages/LabDiagnostics/LabDiagnostics";
import Symptoms from "./pages/Symptoms/Symptoms";
import Necropsy from "./pages/Necropsy/Necropsy";

// ПЛАНУВАННЯ
import Calendar from "./pages/Calendar/Calendar";
import Tips from "./pages/Tips/Tips";
import BreedingHerd from "./pages/BreedingHerd/BreedingHerd";

// ІНСТРУМЕНТИ
import Equipment from "./pages/Equipment/Equipment";
import Tools from "./pages/Tools/Tools";

// ФІНАЛ
import Slaughter from "./pages/Slaughter/Slaughter";
import FurProcessing from "./pages/FurProcessing/FurProcessing";
import Culling from "./pages/Culling/Culling";

// РЕЦЕПТИ
import Recipes from "./pages/Recipes/Recipes";

// ЗОНИ
import Zoonoses from "./pages/Zoonoses/Zoonoses";

// ОСОБИСТИЙ КАБІНЕТ (потребують авторизації)
import RabbitRegistry from "./pages/RabbitRegistry/RabbitRegistry";
import RabbitEdit from "./pages/RabbitEdit/RabbitEdit";
import Archive from "./pages/Archive/Archive";
import Matings from "./pages/Matings/Matings";
import Paddocks from "./pages/Paddocks/Paddocks";
import Fattening from "./pages/Fattening/Fattening";
import Quarantine from "./pages/Quarantine/Quarantine";
import Statistics from "./pages/Statistics/Statistics";
import Calculator from "./pages/Calculator/Calculator";

// УПРАВЛІННЯ ГОСПОДАРСТВОМ
import Economics from "./pages/Economics/Economics";
import Legal from "./pages/Legal/Legal";
import Sales from "./pages/Sales/Sales";
import ProfitCalc from "./pages/ProfitCalc/ProfitCalc";

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
        <Routes>
          {/* — АДМІН — */}
          <Route
            path="/admin"
            element={session ? <Admin session={session} /> : <Auth />}
          />

          {/* — З ЧОГО ПОЧАТИ — */}
          <Route path="/beginner-guide" element={<BeginnerGuide />} />
          <Route path="/faq" element={<FAQ />} />

          {/* — ГОЛОВНА — */}
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/community" element={<Community />} />

          {/* 1. ПОЧАТОК — знайомство з твариною */}
          <Route path="/biology" element={<Biology />} />
          <Route path="/breeds" element={<Breeds />} />
          <Route path="/breeding" element={<Breeding />} />
          <Route
            path="/artificial-insemination"
            element={<ArtificialInsemination />}
          />
          <Route path="/selection" element={<Selection />} />
          <Route path="/genetics" element={<Genetics />} />

          {/* 2. ЖИТЛО */}
          <Route path="/enclosure" element={<Enclosure />} />
          <Route path="/floor-care" element={<FloorCare />} />
          <Route path="/pit-keeping" element={<PaddockInfo />} />
          <Route path="/microclimate" element={<Microclimate />} />

          {/* 3. ХАРЧУВАННЯ */}
          <Route path="/feeding" element={<Feeding />} />
          <Route path="/leaves" element={<Leaves />} />
          <Route path="/crops" element={<Crops />} />
          <Route path="/water" element={<Water />} />
          <Route path="/feeders" element={<Feeders />} />

          {/* 4. ДОГЛЯД */}
          <Route path="/care" element={<Care />} />
          <Route path="/disinfection" element={<Disinfection />} />
          <Route path="/biosecurity" element={<Biosecurity />} />
          <Route path="/grooming" element={<Grooming />} />

          {/* 5. РОЗВЕДЕННЯ */}
          <Route path="/okril" element={<Okril />} />
          <Route path="/winter-litter" element={<WinterLitter />} />
          <Route path="/weaning" element={<Weaning />} />
          <Route path="/weight-control" element={<WeightControl />} />
          <Route path="/artificial-feeding" element={<ArtificialFeeding />} />
          <Route path="/mating-frequency" element={<MatingPage />} />

          {/* 6. ЗДОРОВ'Я */}
          <Route path="/vaccinations" element={<Vaccinations />} />
          <Route path="/parasites" element={<Parasites />} />
          <Route path="/diseases" element={<Diseases />} />
          <Route path="/medicines" element={<Medicines />} />
          <Route path="/treatment" element={<Treatment />} />
          <Route path="/first-aid" element={<FirstAid />} />
          <Route path="/lab-diagnostics" element={<LabDiagnostics />} />
          <Route path="/symptoms" element={<Symptoms />} />
          <Route path="/necropsy" element={<Necropsy />} />

          {/* 7. ПЛАНУВАННЯ */}
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/tips" element={<Tips />} />
          <Route path="/breeding-herd" element={<BreedingHerd />} />

          {/* 8. ІНСТРУМЕНТИ */}
          <Route
            path="/calculator"
            element={session ? <Calculator /> : <Auth returnTo="/calculator" />}
          />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/tools" element={<Tools />} />

          {/* 9. ФІНАЛ */}
          <Route path="/slaughter" element={<Slaughter />} />
          <Route path="/fur-processing" element={<FurProcessing />} />
          <Route path="/culling" element={<Culling />} />

          {/* 10. РЕЦЕПТИ */}
          <Route path="/recipes" element={<Recipes />} />

          {/* — ОСОБИСТИЙ КАБІНЕТ — */}
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
          <Route
            path="/statistics"
            element={session ? <Statistics session={session} /> : <Auth />}
          />

          {/* — Управління господарством — */}
          <Route path="/economics" element={<Economics />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/profit-calculator" element={<ProfitCalc />} />

          {/* — ЗОНИ — */}
          <Route path="/zoonoses" element={<Zoonoses />} />
        </Routes>
        <Footer />
        <UpdatePrompt />
      </BrowserRouter>
    </>
  );
}

export default App;
