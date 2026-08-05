import { lazy } from "react";
import { Route } from "react-router-dom";

const Vaccinations = lazy(
  () => import("../../pages/Vaccinations/Vaccinations"),
);
const VaccineReactions = lazy(
  () => import("../../pages/VaccineReactions/VaccineReactions"),
);
const Medicines = lazy(() => import("../../pages/Medicines/Medicines"));
const DrugCompatibility = lazy(
  () => import("../../pages/DrugCompatibility/DrugCompatibility"),
);
const WaterMedication = lazy(
  () => import("../../pages/WaterMedication/WaterMedication"),
);
const AntibioticTherapy = lazy(
  () => import("../../pages/AntibioticTherapy/AntibioticTherapy"),
);
const DosageCalculator = lazy(
  () => import("../../pages/DosageCalculator/DosageCalculator"),
);
const Treatment = lazy(() => import("../../pages/Treatment/Treatment"));
const FirstAid = lazy(() => import("../../pages/FirstAid/FirstAid"));
const BiteWoundCare = lazy(
  () => import("../../pages/BiteWoundCare/BiteWoundCare"),
);
const PainManagement = lazy(
  () => import("../../pages/PainManagement/PainManagement"),
);
const DietTherapy = lazy(
  () => import("../../pages/DietTherapy/DietTherapy"),
);
const AnesthesiaCare = lazy(
  () => import("../../pages/AnesthesiaCare/AnesthesiaCare"),
);
const Neutering = lazy(() => import("../../pages/Neutering/Neutering"));
const LabDiagnostics = lazy(
  () => import("../../pages/LabDiagnostics/LabDiagnostics"),
);
const Necropsy = lazy(() => import("../../pages/Necropsy/Necropsy"));
const TreatmentLog = lazy(
  () => import("../../pages/TreatmentLog/TreatmentLog"),
);
const PalliativeCare = lazy(
  () => import("../../pages/PalliativeCare/PalliativeCare"),
);
const RhdvStrains = lazy(() => import("../../pages/RhdvStrains/RhdvStrains"));
const SeasonalSummer = lazy(
  () => import("../../pages/SeasonalSummer/SeasonalSummer"),
);
const SeasonalSpring = lazy(
  () => import("../../pages/SeasonalSpring/SeasonalSpring"),
);
const SeasonalAutumn = lazy(
  () => import("../../pages/SeasonalAutumn/SeasonalAutumn"),
);
const HeatStroke = lazy(() => import("../../pages/HeatStroke/HeatStroke"));
const EarFrostbite = lazy(
  () => import("../../pages/EarFrostbite/EarFrostbite"),
);
const SunProtection = lazy(
  () => import("../../pages/SunProtection/SunProtection"),
);
const VetInjections = lazy(
  () => import("../../pages/VetInjections/VetInjections"),
);
const VetOralMeds = lazy(
  () => import("../../pages/VetOralMeds/VetOralMeds"),
);
const VetTemperature = lazy(
  () => import("../../pages/VetTemperature/VetTemperature"),
);
const VetFecalSample = lazy(
  () => import("../../pages/VetFecalSample/VetFecalSample"),
);
const BloodTestReference = lazy(
  () => import("../../pages/BloodTestReference/BloodTestReference"),
);

/**
 * Лікування, сезонні загрози та ветеринарні маніпуляції.
 */
export const treatmentRoutes = (
  <>
    {/* 8. ЛІКУВАННЯ ТА ВЕТЕРИНАРНА ДОПОМОГА */}
    <Route path="/vaccinations" element={<Vaccinations />} />
    <Route path="/vaccine-reactions" element={<VaccineReactions />} />
    <Route path="/medicines" element={<Medicines />} />
    <Route path="/drug-compatibility" element={<DrugCompatibility />} />
    <Route path="/water-medication" element={<WaterMedication />} />
    <Route path="/antibiotic-therapy" element={<AntibioticTherapy />} />
    <Route path="/dosage-calculator" element={<DosageCalculator />} />
    <Route path="/treatment" element={<Treatment />} />
    <Route path="/first-aid" element={<FirstAid />} />
    <Route path="/bite-wound-care" element={<BiteWoundCare />} />
    <Route path="/pain-management" element={<PainManagement />} />
    <Route path="/diet-therapy" element={<DietTherapy />} />
    <Route path="/anesthesia-care" element={<AnesthesiaCare />} />
    <Route path="/neutering" element={<Neutering />} />
    <Route path="/lab-diagnostics" element={<LabDiagnostics />} />
    <Route path="/necropsy" element={<Necropsy />} />
    <Route path="/treatment-log" element={<TreatmentLog />} />
    <Route path="/palliative-care" element={<PalliativeCare />} />
    <Route path="/rhdv-strains" element={<RhdvStrains />} />
    {/* СЕЗОННІ ЗАГРОЗИ */}
    <Route path="/seasonal-summer" element={<SeasonalSummer />} />
    <Route path="/seasonal-spring" element={<SeasonalSpring />} />
    <Route path="/seasonal-autumn" element={<SeasonalAutumn />} />
    <Route path="/heat-stroke" element={<HeatStroke />} />
    <Route path="/ear-frostbite" element={<EarFrostbite />} />
    <Route path="/sun-protection" element={<SunProtection />} />
    {/* ВЕТЕРЕНАРНІ МАНІПУЛЯЦІЇ */}
    <Route path="/vet-injections" element={<VetInjections />} />
    <Route path="/vet-oral-meds" element={<VetOralMeds />} />
    <Route path="/vet-temperature" element={<VetTemperature />} />
    <Route path="/vet-fecal-sample" element={<VetFecalSample />} />
    <Route
      path="/blood-test-reference"
      element={<BloodTestReference />}
    />
  </>
);
