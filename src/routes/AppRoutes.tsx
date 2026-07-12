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
const BuyingRabbit = lazy(() => import("../pages/BuyingRabbit/BuyingRabbit"));
const FAQ = lazy(() => import("../pages/FAQ/FAQ"));
const BeginnerMistakes = lazy(
  () => import("../pages/BeginnerMistakes/BeginnerMistakes"),
);
const Glossary = lazy(() => import("../pages/Glossary/Glossary"));
const RabbitAllergy = lazy(
  () => import("../pages/RabbitAllergy/RabbitAllergy"),
);

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
const RabbitSounds = lazy(() => import("../pages/RabbitSounds/RabbitSounds"));
const RabbitBodyLanguage = lazy(
  () => import("../pages/RabbitBodyLanguage/RabbitBodyLanguage"),
);
const RabbitStress = lazy(() => import("../pages/RabbitStress/RabbitStress"));
const RabbitWhiskers = lazy(
  () => import("../pages/RabbitWhiskers/RabbitWhiskers"),
);

// ПОРІВНЯННЯ ТА СПІВЖИТТЯ
const RabbitVsHare = lazy(() => import("../pages/RabbitVsHare/RabbitVsHare"));
const RabbitsAndGuineaPigs = lazy(
  () => import("../pages/RabbitsAndGuineaPigs/RabbitsAndGuineaPigs"),
);
const RabbitsAndPredators = lazy(
  () => import("../pages/RabbitsAndPredators/RabbitsAndPredators"),
);
const RabbitsAndChickens = lazy(
  () => import("../pages/RabbitsAndChickens/RabbitsAndChickens"),
);
const RabbitsAndChildren = lazy(
  () => import("../pages/RabbitsAndChildren/RabbitsAndChildren"),
);

// ЖИТЛО
const Enclosure = lazy(() => import("../pages/Enclosure/Enclosure"));
const FloorCare = lazy(() => import("../pages/FloorCare/FloorCare"));
const PaddockInfo = lazy(() => import("../pages/Paddocks/PaddockInfo"));
const Microclimate = lazy(() => import("../pages/Microclimate/Microclimate"));
const RabbitHousingDIY = lazy(
  () => import("../pages/RabbitHousingDIY/RabbitHousingDIY"),
);

// ХАРЧУВАННЯ
const Feeding = lazy(() => import("../pages/Feeding/Feeding"));
const Leaves = lazy(() => import("../pages/Leaves/Leaves"));
const Crops = lazy(() => import("../pages/Crops/Crops"));
const Water = lazy(() => import("../pages/Water/Water"));
const Feeders = lazy(() => import("../pages/Feeders/Feeders"));
const NewFood = lazy(() => import("../pages/NewFood/NewFood"));
const CompoundFeed = lazy(() => import("../pages/CompoundFeed/CompoundFeed"));
const SpecialFeeds = lazy(() => import("../pages/SpecialFeeds/SpecialFeeds"));

// ДОГЛЯД
const Care = lazy(() => import("../pages/Care/Care"));
const Disinfection = lazy(() => import("../pages/Disinfection/Disinfection"));
const Biosecurity = lazy(() => import("../pages/Biosecurity/Biosecurity"));
const Grooming = lazy(() => import("../pages/Grooming/Grooming"));
const RabbitBehaviorProblems = lazy(
  () => import("../pages/RabbitBehaviorProblems/RabbitBehaviorProblems"),
);
const SeasonalMolting = lazy(
  () => import("../pages/SeasonalMolting/SeasonalMolting"),
);
const GroupHousing = lazy(() => import("../pages/GroupHousing/GroupHousing"));
const Predators = lazy(() => import("../pages/Predators/Predators"));

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
const OkrilControl = lazy(() => import("../pages/OkrilControl/OkrilControl"));
const Sexing = lazy(() => import("../pages/Sexing/Sexing"));
const DoePreparation = lazy(
  () => import("../pages/DoePreparation/DoePreparation"),
);
const BuckManagement = lazy(
  () => import("../pages/BuckManagement/BuckManagement"),
);
const FalsePregnancy = lazy(
  () => import("../pages/FalsePregnancy/FalsePregnancy"),
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
const Droppings = lazy(() => import("../pages/Droppings/Droppings"));
const RabbitBodyCondition = lazy(
  () => import("../pages/RabbitBodyCondition/RabbitBodyCondition"),
);
const DosageCalculator = lazy(
  () => import("../pages/DosageCalculator/DosageCalculator"),
);
const Poisoning = lazy(() => import("../pages/Poisoning/Poisoning"));
const DietTherapy = lazy(() => import("../pages/DietTherapy/DietTherapy"));
const AnesthesiaCare = lazy(
  () => import("../pages/AnesthesiaCare/AnesthesiaCare"),
);
const TreatmentLog = lazy(() => import("../pages/TreatmentLog/TreatmentLog"));
const AntibioticTherapy = lazy(
  () => import("../pages/AntibioticTherapy/AntibioticTherapy"),
);

// СЕЗОННІ ЗАГРОЗИ
const SeasonalSummer = lazy(
  () => import("../pages/SeasonalSummer/SeasonalSummer"),
);
const SeasonalSpring = lazy(
  () => import("../pages/SeasonalSpring/SeasonalSpring"),
);
const SeasonalAutumn = lazy(
  () => import("../pages/SeasonalAutumn/SeasonalAutumn"),
);
const HeatStroke = lazy(() => import("../pages/HeatStroke/HeatStroke"));

// ВЕТЕРЕНАРНІ МАНІПУЛЯЦІЇ
const VetInjections = lazy(
  () => import("../pages/VetInjections/VetInjections"),
);
const VetOralMeds = lazy(() => import("../pages/VetOralMeds/VetOralMeds"));
const VetTemperature = lazy(
  () => import("../pages/VetTemperature/VetTemperature"),
);
const VetFecalSample = lazy(
  () => import("../pages/VetFecalSample/VetFecalSample"),
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
const DisinfectionLog = lazy(
  () => import("../pages/DisinfectionLog/DisinfectionLog"),
);
const CageSearch = lazy(() => import("../pages/CageSearch/CageSearch"));

// ПЛЕМІННА СПРАВА ТА ВИСТАВКИ
const BreedStandards = lazy(
  () => import("../pages/BreedStandards/BreedStandards"),
);
const ShowJudging = lazy(() => import("../pages/ShowJudging/ShowJudging"));
const ShowPreparation = lazy(
  () => import("../pages/ShowPreparation/ShowPreparation"),
);
const BreedingEvaluation = lazy(
  () => import("../pages/BreedingEvaluation/BreedingEvaluation"),
);
const CoatColorsEvaluation = lazy(
  () => import("../pages/CoatColorsEvaluation/CoatColorsEvaluation"),
);
const RabbitConformation = lazy(
  () => import("../pages/RabbitConformation/RabbitConformation"),
);
const FurEvaluation = lazy(
  () => import("../pages/FurEvaluation/FurEvaluation"),
);
const ReplacementStock = lazy(
  () => import("../pages/ReplacementStock/ReplacementStock"),
);
const SelectBuck = lazy(() => import("../pages/SelectBuck/SelectBuck"));
const SelectDoe = lazy(() => import("../pages/SelectDoe/SelectDoe"));
const DisqualifyingFaults = lazy(
  () => import("../pages/DisqualifyingFaults/DisqualifyingFaults"),
);
const PedigreeRecords = lazy(
  () => import("../pages/PedigreeRecords/PedigreeRecords"),
);
const ShowScoring = lazy(() => import("../pages/ShowScoring/ShowScoring"));

// УПРАВЛІННЯ ГОСПОДАРСТВОМ
const Economics = lazy(() => import("../pages/Economics/Economics"));
const Legal = lazy(() => import("../pages/Legal/Legal"));
const Sales = lazy(() => import("../pages/Sales/Sales"));
const ProfitCalc = lazy(() => import("../pages/ProfitCalc/ProfitCalc"));
const Composting = lazy(() => import("../pages/Composting/Composting"));
const InsuranceGrants = lazy(
  () => import("../pages/InsuranceGrants/InsuranceGrants"),
);

// ТЕХНОЛОГІЇ ТА АВТОМАТИЗАЦІЯ
const FeedingAutomation = lazy(
  () => import("../pages/FeedingAutomation/FeedingAutomation"),
);
const ClimateAutomation = lazy(
  () => import("../pages/ClimateAutomation/ClimateAutomation"),
);
const FarmManagementSoftware = lazy(
  () => import("../pages/FarmManagementSoftware/FarmManagementSoftware"),
);
const FarmMonitoring = lazy(
  () => import("../pages/FarmMonitoring/FarmMonitoring"),
);
const SmartFarm = lazy(() => import("../pages/SmartFarm/SmartFarm"));

// КРОЛИК ЯК ДОМАШНІЙ УЛЮБЛЕНЕЦЬ
const ApartmentProofing = lazy(
  () => import("../pages/ApartmentProofing/ApartmentProofing"),
);
const LitterTraining = lazy(
  () => import("../pages/LitterTraining/LitterTraining"),
);
const Enrichment = lazy(() => import("../pages/Enrichment/Enrichment"));
const CompanionBonding = lazy(
  () => import("../pages/CompanionBonding/CompanionBonding"),
);
const PetTravel = lazy(() => import("../pages/PetTravel/PetTravel"));
const SeniorRabbit = lazy(() => import("../pages/SeniorRabbit/SeniorRabbit"));

// 404 СТОРІНКА
const NotFound = lazy(() => import("../pages/NotFound/NotFound"));

// ОНОВЛЕННЯ
const Changelog = lazy(() => import("../pages/Changelog/Changelog"));

// ІНФО
const AboutProject = lazy(
  () => import("../pages/Info/AboutProject/AboutProject"),
);

const PrivacyPolicy = lazy(
  () => import("../pages/Info/PrivacyPolicy/PrivacyPolicy"),
);

const TermsOfUse = lazy(() => import("../pages/Info/TermsOfUse/TermsOfUse"));

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
        <Route path="/buying-rabbit" element={<BuyingRabbit />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/beginner-mistakes" element={<BeginnerMistakes />} />
        <Route path="/rabbit-myths" element={<RabbitMyths />} />
        <Route path="/glossary" element={<Glossary />} />
        <Route path="/rabbit-allergy" element={<RabbitAllergy />} />
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
        <Route path="/rabbit-sounds" element={<RabbitSounds />} />
        <Route path="/rabbit-body-language" element={<RabbitBodyLanguage />} />
        <Route path="/rabbit-stress" element={<RabbitStress />} />
        <Route path="/rabbit-whiskers" element={<RabbitWhiskers />} />
        {/* 2. ПОРІВНЯННЯ ТА СПІВЖИТТЯ */}
        <Route path="/rabbit-vs-hare" element={<RabbitVsHare />} />
        <Route
          path="/rabbits-and-guinea-pigs"
          element={<RabbitsAndGuineaPigs />}
        />
        <Route
          path="/rabbits-and-predators"
          element={<RabbitsAndPredators />}
        />
        <Route path="/rabbits-and-chickens" element={<RabbitsAndChickens />} />
        <Route path="/rabbits-and-children" element={<RabbitsAndChildren />} />
        {/* 3. ЖИТЛО */}
        <Route path="/enclosure" element={<Enclosure />} />
        <Route path="/floor-care" element={<FloorCare />} />
        <Route path="/pit-keeping" element={<PaddockInfo />} />
        <Route path="/microclimate" element={<Microclimate />} />
        <Route path="/rabbit-housing-diy" element={<RabbitHousingDIY />} />
        {/* 4. ХАРЧУВАННЯ */}
        <Route path="/feeding" element={<Feeding />} />
        <Route path="/leaves" element={<Leaves />} />
        <Route path="/crops" element={<Crops />} />
        <Route path="/water" element={<Water />} />
        <Route path="/feeders" element={<Feeders />} />
        <Route path="/new-food" element={<NewFood />} />
        <Route path="/compound-feed" element={<CompoundFeed />} />
        <Route path="/special-feeds" element={<SpecialFeeds />} />
        {/* 5. ДОГЛЯД */}
        <Route path="/care" element={<Care />} />
        <Route path="/disinfection" element={<Disinfection />} />
        <Route path="/biosecurity" element={<Biosecurity />} />
        <Route path="/grooming" element={<Grooming />} />
        <Route
          path="/rabbit-behavior-problems"
          element={<RabbitBehaviorProblems />}
        />
        <Route path="/seasonal-molting" element={<SeasonalMolting />} />
        <Route path="/group-housing" element={<GroupHousing />} />
        <Route path="/predators" element={<Predators />} />
        {/* 6. РОЗВЕДЕННЯ */}
        <Route path="/okril" element={<Okril />} />
        <Route path="/winter-litter" element={<WinterLitter />} />
        <Route path="/weaning" element={<Weaning />} />
        <Route path="/weight-control" element={<WeightControl />} />
        <Route path="/artificial-feeding" element={<ArtificialFeeding />} />
        <Route path="/mating-frequency" element={<MatingPage />} />
        <Route path="/mating-behavior" element={<MatingBehavior />} />
        <Route path="/okril-control" element={<OkrilControl />} />
        <Route path="/sexing" element={<Sexing />} />
        <Route path="/doe-preparation" element={<DoePreparation />} />
        <Route path="/buck-management" element={<BuckManagement />} />
        <Route path="/false-pregnancy" element={<FalsePregnancy />} />
        <Route path="/poisoning" element={<Poisoning />} />
        {/* 7. ЗДОРОВ'Я */}
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
        <Route path="/droppings" element={<Droppings />} />
        <Route
          path="/rabbit-body-condition"
          element={<RabbitBodyCondition />}
        />
        <Route path="/dosage-calculator" element={<DosageCalculator />} />
        <Route path="/diet-therapy" element={<DietTherapy />} />
        <Route path="/anesthesia-care" element={<AnesthesiaCare />} />
        <Route path="/treatment-log" element={<TreatmentLog />} />
        <Route path="/antibiotic-therapy" element={<AntibioticTherapy />} />
        {/* СЕЗОННІ ЗАГРОЗИ */}
        <Route path="/seasonal-summer" element={<SeasonalSummer />} />
        <Route path="/seasonal-spring" element={<SeasonalSpring />} />
        <Route path="/seasonal-autumn" element={<SeasonalAutumn />} />
        <Route path="/heat-stroke" element={<HeatStroke />} />
        {/* ВЕТЕРЕНАРНІ МАНІПУЛЯЦІЇ */}
        <Route path="/vet-injections" element={<VetInjections />} />
        <Route path="/vet-oral-meds" element={<VetOralMeds />} />
        <Route path="/vet-temperature" element={<VetTemperature />} />
        <Route path="/vet-fecal-sample" element={<VetFecalSample />} />
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
        <Route
          path="/disinfection-log"
          element={<DisinfectionLog session={session!} />}
        />
        <Route
          path="/cage-search"
          element={<CageSearch session={session!} />}
        />
        {/* — Племінна справа та виставки — */}
        <Route path="/breed-standards" element={<BreedStandards />} />
        <Route path="/show-judging" element={<ShowJudging />} />
        <Route path="/show-preparation" element={<ShowPreparation />} />
        <Route path="/breeding-evaluation" element={<BreedingEvaluation />} />
        <Route
          path="/coat-colors-evaluation"
          element={<CoatColorsEvaluation />}
        />
        <Route path="/rabbit-conformation" element={<RabbitConformation />} />
        <Route path="/fur-evaluation" element={<FurEvaluation />} />
        <Route path="/replacement-stock" element={<ReplacementStock />} />
        <Route path="/select-buck" element={<SelectBuck />} />
        <Route path="/select-doe" element={<SelectDoe />} />
        <Route path="/disqualifying-faults" element={<DisqualifyingFaults />} />
        <Route path="/pedigree-records" element={<PedigreeRecords />} />
        <Route path="/show-scoring" element={<ShowScoring />} />
        {/* — Управління господарством — */}
        <Route path="/economics" element={<Economics />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/profit-calculator" element={<ProfitCalc />} />
        <Route path="/composting" element={<Composting />} />
        <Route path="/insurance-grants" element={<InsuranceGrants />} />

        {/* — ТЕХНОЛОГІЇ ТА АВТОМАТИЗАЦІЯ — */}
        <Route path="/feeding-automation" element={<FeedingAutomation />} />
        <Route path="/climate-automation" element={<ClimateAutomation />} />
        <Route
          path="/farm-management-software"
          element={<FarmManagementSoftware />}
        />
        <Route path="/farm-monitoring" element={<FarmMonitoring />} />
        <Route path="/smart-farm" element={<SmartFarm />} />
        {/* — ЗОНИ — */}
        <Route path="/zoonoses" element={<Zoonoses />} />
        {/* — КРОЛИК ЯК ДОМАШНІЙ УЛЮБЛЕНЕЦЬ — */}
        <Route path="/apartment-proofing" element={<ApartmentProofing />} />
        <Route path="/litter-training" element={<LitterTraining />} />
        <Route path="/enrichment" element={<Enrichment />} />
        <Route path="/companion-bonding" element={<CompanionBonding />} />
        <Route path="/pet-travel" element={<PetTravel />} />
        <Route path="/senior-rabbit" element={<SeniorRabbit />} />
        {/* — ОНОВЛЕННЯ — */}
        <Route path="/changelog" element={<Changelog />} />
        {/* СТОРІНКА 404 (ЗАВЖДИ ОСТАННЯ) */}
        <Route path="*" element={<NotFound />} />
        {/* — ІНФО — */}
        <Route path="/about" element={<AboutProject />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
      </Routes>
    </Suspense>
  );
}
