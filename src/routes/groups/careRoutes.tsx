import { lazy } from "react";
import { Route } from "react-router-dom";

const Care = lazy(() => import("../../pages/Care/Care"));
const Disinfection = lazy(
  () => import("../../pages/Disinfection/Disinfection"),
);
const Biosecurity = lazy(
  () => import("../../pages/Biosecurity/Biosecurity"),
);
const Grooming = lazy(() => import("../../pages/Grooming/Grooming"));
const RabbitBehaviorProblems = lazy(
  () => import("../../pages/RabbitBehaviorProblems/RabbitBehaviorProblems"),
);
const SeasonalMolting = lazy(
  () => import("../../pages/SeasonalMolting/SeasonalMolting"),
);
const GroupHousing = lazy(
  () => import("../../pages/GroupHousing/GroupHousing"),
);
const Predators = lazy(() => import("../../pages/Predators/Predators"));

/**
 * Догляд: чистота, гігієна, поведінкові проблеми.
 */
export const careRoutes = (
  <>
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
  </>
);
