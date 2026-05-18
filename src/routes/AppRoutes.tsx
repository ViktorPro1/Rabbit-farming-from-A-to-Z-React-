import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import Auth from "../pages/Auth/Auth";
import { usePageMeta } from "../seo/usePageMeta";

// АДМІН
const Admin = lazy(() => import("../pages/Admin/Admin"));

// З ЧОГО ПОЧАТИ
const BeginnerGuide = lazy(
  () => import("../pages/BeginnerGuide/BeginnerGuide"),
);
const FAQ = lazy(() => import("../pages/FAQ/FAQ"));
const BeginnerMistakes = lazy(
  () => import("../pages/BeginnerMistakes/BeginnerMistakes"),
);
const Glossary = lazy(() => import("../pages/Glossary/Glossary"));

// ГОЛОВНА
const Home = lazy(() => import("../pages/Home"));
const Subscription = lazy(() => import("../pages/Subscription/Subscription"));
const Community = lazy(() => import("../pages/Community/Community"));
const RabbitPublic = lazy(() => import("../pages/RabbitPublic/RabbitPublic"));
const FatteningPublic = lazy(
  () => import("../pages/FatteningPublic/FatteningPublic"),
);

// ПОЧАТОК — знайомство з твариною
const Biology = lazy(() => import("../pages/Biology/Biology"));
const Breeds = lazy(() => import("../pages/Breeds/Breeds"));
const Breeding = lazy(() => import("../pages/Breeding/Breeding"));
const ArtificialInsemination = lazy(
  () => import("../pages/ArtificialInsemination/ArtificialInsemination"),
);
const Selection = lazy(() => import("../pages/Selection/Selection"));
const Genetics = lazy(() => import("../pages/Genetics/Genetics"));
const RabbitMyths = lazy(() => import("../pages/RabbitMyths/RabbitMyths"));
const RabbitsAndGuineaPigs = lazy(
  () => import("../pages/RabbitsAndGuineaPigs/RabbitsAndGuineaPigs"),
);

// ЖИТЛО
const Enclosure = lazy(() => import("../pages/Enclosure/Enclosure"));
const FloorCare = lazy(() => import("../pages/FloorCare/FloorCare"));
const PaddockInfo = lazy(() => import("../pages/Paddocks/PaddockInfo"));
const Microclimate = lazy(() => import("../pages/Microclimate/Microclimate"));

// ХАРЧУВАННЯ
const Feeding = lazy(() => import("../pages/Feeding/Feeding"));
const Leaves = lazy(() => import("../pages/Leaves/Leaves"));
const Crops = lazy(() => import("../pages/Crops/Crops"));
const Water = lazy(() => import("../pages/Water/Water"));
const Feeders = lazy(() => import("../pages/Feeders/Feeders"));
const NewFood = lazy(() => import("../pages/NewFood/NewFood"));
const CompoundFeed = lazy(() => import("../pages/CompoundFeed/CompoundFeed"));

// ДОГЛЯД
const Care = lazy(() => import("../pages/Care/Care"));
const Disinfection = lazy(() => import("../pages/Disinfection/Disinfection"));
const Biosecurity = lazy(() => import("../pages/Biosecurity/Biosecurity"));
const Grooming = lazy(() => import("../pages/Grooming/Grooming"));

// РОЗВЕДЕННЯ
const Okril = lazy(() => import("../pages/Okril/Okril"));
const WinterLitter = lazy(() => import("../pages/WinterLitter/WinterLitter"));
const Weaning = lazy(() => import("../pages/Weaning/Weaning"));
const WeightControl = lazy(
  () => import("../pages/WeightControl/WeightControl"),
);
const ArtificialFeeding = lazy(
  () => import("../pages/ArtificialFeeding/ArtificialFeeding"),
);
const MatingPage = lazy(
  () => import("../pages/MatingFrequency/MatingFrequency"),
);
const MatingBehavior = lazy(
  () => import("../pages/MatingBehavior/MatingBehavior"),
);

// ЗДОРОВ'Я
const Vaccinations = lazy(() => import("../pages/Vaccinations/Vaccinations"));
const Parasites = lazy(() => import("../pages/Parasites/Parasites"));
const Diseases = lazy(() => import("../pages/Diseases/Diseases"));
const Medicines = lazy(() => import("../pages/Medicines/Medicines"));
const Treatment = lazy(() => import("../pages/Treatment/Treatment"));
const FirstAid = lazy(() => import("../pages/FirstAid/FirstAid"));
const LabDiagnostics = lazy(
  () => import("../pages/LabDiagnostics/LabDiagnostics"),
);
const Symptoms = lazy(() => import("../pages/Symptoms/Symptoms"));
const Necropsy = lazy(() => import("../pages/Necropsy/Necropsy"));
const DrugCompatibility = lazy(
  () => import("../pages/DrugCompatibility/DrugCompatibility"),
);
const PainManagement = lazy(
  () => import("../pages/PainManagement/PainManagement"),
);
const Neutering = lazy(() => import("../pages/Neutering/Neutering"));
const WaterMedication = lazy(
  () => import("../pages/WaterMedication/WaterMedication"),
);

// ПЛАНУВАННЯ
const Calendar = lazy(() => import("../pages/Calendar/Calendar"));
const Tips = lazy(() => import("../pages/Tips/Tips"));
const BreedingHerd = lazy(() => import("../pages/BreedingHerd/BreedingHerd"));

// ІНСТРУМЕНТИ
const Equipment = lazy(() => import("../pages/Equipment/Equipment"));
const Tools = lazy(() => import("../pages/Tools/Tools"));
const Calculator = lazy(() => import("../pages/Calculator/Calculator"));

// ФІНАЛ
const Slaughter = lazy(() => import("../pages/Slaughter/Slaughter"));
const FurProcessing = lazy(
  () => import("../pages/FurProcessing/FurProcessing"),
);
const Culling = lazy(() => import("../pages/Culling/Culling"));
const Transport = lazy(() => import("../pages/Transport/Transport"));

// РЕЦЕПТИ
const Recipes = lazy(() => import("../pages/Recipes/Recipes"));

// ЗОНИ
const Zoonoses = lazy(() => import("../pages/Zoonoses/Zoonoses"));

// ОСОБИСТИЙ КАБІНЕТ
const RabbitRegistry = lazy(
  () => import("../pages/RabbitRegistry/RabbitRegistry"),
);
const RabbitEdit = lazy(() => import("../pages/RabbitEdit/RabbitEdit"));
const Archive = lazy(() => import("../pages/Archive/Archive"));
const Matings = lazy(() => import("../pages/Matings/Matings"));
const Paddocks = lazy(() => import("../pages/Paddocks/Paddocks"));
const Fattening = lazy(() => import("../pages/Fattening/Fattening"));
const Quarantine = lazy(() => import("../pages/Quarantine/Quarantine"));
const Statistics = lazy(() => import("../pages/Statistics/Statistics"));
const MyVaccinations = lazy(
  () => import("../pages/MyVaccinations/MyVaccinations"),
);
const MyTreatments = lazy(() => import("../pages/MyTreatments/MyTreatments"));

// УПРАВЛІННЯ ГОСПОДАРСТВОМ
const Economics = lazy(() => import("../pages/Economics/Economics"));
const Legal = lazy(() => import("../pages/Legal/Legal"));
const Sales = lazy(() => import("../pages/Sales/Sales"));
const ProfitCalc = lazy(() => import("../pages/ProfitCalc/ProfitCalc"));

// ─────────────────────────────────────────────
const PageLoader = () => (
  <div style={{ padding: "2rem", textAlign: "center" }}>Завантаження...</div>
);

// ─────────────────────────────────────────────
interface AppRoutesProps {
  session: Session | null;
}

export default function AppRoutes({ session }: AppRoutesProps) {
  usePageMeta();

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* — АДМІН — */}
        <Route
          path="/admin"
          element={session ? <Admin session={session} /> : <Auth />}
        />
        {/* — З ЧОГО ПОЧАТИ — */}
        <Route path="/beginner-guide" element={<BeginnerGuide />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/beginner-mistakes" element={<BeginnerMistakes />} />
        <Route path="/rabbit-myths" element={<RabbitMyths />} />
        <Route path="/glossary" element={<Glossary />} />
        {/* — ГОЛОВНА — */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/community" element={<Community />} />
        <Route path="/rabbit/:id" element={<RabbitPublic />} />
        <Route path="/fattening-public/:id" element={<FatteningPublic />} />
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
        <Route
          path="/rabbits-and-guinea-pigs"
          element={<RabbitsAndGuineaPigs />}
        />
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
        <Route path="/new-food" element={<NewFood />} />
        <Route path="/compound-feed" element={<CompoundFeed />} />
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
        <Route path="/mating-behavior" element={<MatingBehavior />} />
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
        <Route path="/drug-compatibility" element={<DrugCompatibility />} />
        <Route path="/pain-management" element={<PainManagement />} />
        <Route path="/neutering" element={<Neutering />} />
        <Route path="/water-medication" element={<WaterMedication />} />
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
        <Route path="/transport" element={<Transport />} />
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
        <Route
          path="/my-vaccinations"
          element={session ? <MyVaccinations session={session} /> : <Auth />}
        />
        <Route
          path="/my-treatments"
          element={session ? <MyTreatments session={session} /> : <Auth />}
        />
        {/* — Управління господарством — */}
        <Route path="/economics" element={<Economics />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/profit-calculator" element={<ProfitCalc />} />
        {/* — ЗОНИ — */}
        <Route path="/zoonoses" element={<Zoonoses />} />
      </Routes>
    </Suspense>
  );
}
