import { lazy } from "react";
import { Route } from "react-router-dom";

const BreedStandards = lazy(
  () => import("../../pages/BreedStandards/BreedStandards"),
);
const ShowJudging = lazy(
  () => import("../../pages/ShowJudging/ShowJudging"),
);
const ShowPreparation = lazy(
  () => import("../../pages/ShowPreparation/ShowPreparation"),
);
const BreedingEvaluation = lazy(
  () => import("../../pages/BreedingEvaluation/BreedingEvaluation"),
);
const CoatColorsEvaluation = lazy(
  () => import("../../pages/CoatColorsEvaluation/CoatColorsEvaluation"),
);
const RabbitConformation = lazy(
  () => import("../../pages/RabbitConformation/RabbitConformation"),
);
const FurEvaluation = lazy(
  () => import("../../pages/FurEvaluation/FurEvaluation"),
);
const ReplacementStock = lazy(
  () => import("../../pages/ReplacementStock/ReplacementStock"),
);
const SelectBuck = lazy(() => import("../../pages/SelectBuck/SelectBuck"));
const SelectDoe = lazy(() => import("../../pages/SelectDoe/SelectDoe"));
const DisqualifyingFaults = lazy(
  () => import("../../pages/DisqualifyingFaults/DisqualifyingFaults"),
);
const PedigreeRecords = lazy(
  () => import("../../pages/PedigreeRecords/PedigreeRecords"),
);
const ShowScoring = lazy(
  () => import("../../pages/ShowScoring/ShowScoring"),
);
const DnaTesting = lazy(() => import("../../pages/DnaTesting/DnaTesting"));
const Economics = lazy(() => import("../../pages/Economics/Economics"));
const Legal = lazy(() => import("../../pages/Legal/Legal"));
const Sales = lazy(() => import("../../pages/Sales/Sales"));
const ProfitCalc = lazy(() => import("../../pages/ProfitCalc/ProfitCalc"));
const Composting = lazy(() => import("../../pages/Composting/Composting"));
const InsuranceGrants = lazy(
  () => import("../../pages/InsuranceGrants/InsuranceGrants"),
);
const RabbitCooperatives = lazy(
  () => import("../../pages/RabbitCooperatives/RabbitCooperatives"),
);
const ImportExportRabbits = lazy(
  () => import("../../pages/ImportExportRabbits/ImportExportRabbits"),
);
const FeedingAutomation = lazy(
  () => import("../../pages/FeedingAutomation/FeedingAutomation"),
);
const ClimateAutomation = lazy(
  () => import("../../pages/ClimateAutomation/ClimateAutomation"),
);
const FarmManagementSoftware = lazy(
  () => import("../../pages/FarmManagementSoftware/FarmManagementSoftware"),
);
const FarmMonitoring = lazy(
  () => import("../../pages/FarmMonitoring/FarmMonitoring"),
);
const SmartFarm = lazy(() => import("../../pages/SmartFarm/SmartFarm"));

/**
 * Племінна справа та виставки, управління господарством,
 * технології та автоматизація.
 */
export const showsAndManagementRoutes = (
  <>
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
    <Route
      path="/disqualifying-faults"
      element={<DisqualifyingFaults />}
    />
    <Route path="/pedigree-records" element={<PedigreeRecords />} />
    <Route path="/show-scoring" element={<ShowScoring />} />
    <Route path="/dna-testing" element={<DnaTesting />} />
    {/* — Управління господарством — */}
    <Route path="/economics" element={<Economics />} />
    <Route path="/legal" element={<Legal />} />
    <Route path="/sales" element={<Sales />} />
    <Route path="/profit-calculator" element={<ProfitCalc />} />
    <Route path="/composting" element={<Composting />} />
    <Route path="/insurance-grants" element={<InsuranceGrants />} />
    <Route path="/rabbit-cooperatives" element={<RabbitCooperatives />} />
    <Route
      path="/import-export-rabbits"
      element={<ImportExportRabbits />}
    />
    {/* — ТЕХНОЛОГІЇ ТА АВТОМАТИЗАЦІЯ — */}
    <Route path="/feeding-automation" element={<FeedingAutomation />} />
    <Route path="/climate-automation" element={<ClimateAutomation />} />
    <Route
      path="/farm-management-software"
      element={<FarmManagementSoftware />}
    />
    <Route path="/farm-monitoring" element={<FarmMonitoring />} />
    <Route path="/smart-farm" element={<SmartFarm />} />
  </>
);
