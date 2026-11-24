/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import { Route } from "react-router-dom";

const Calendar = lazy(() => import("../../pages/Calendar/Calendar"));
const Tips = lazy(() => import("../../pages/Tips/Tips"));
const BreedingHerd = lazy(
  () => import("../../pages/BreedingHerd/BreedingHerd"),
);
const Equipment = lazy(() => import("../../pages/Equipment/Equipment"));
const Tools = lazy(() => import("../../pages/Tools/Tools"));
const RabbitIdentification = lazy(
  () => import("../../pages/RabbitIdentification/RabbitIdentification"),
);
const Slaughter = lazy(() => import("../../pages/Slaughter/Slaughter"));
const FurProcessing = lazy(
  () => import("../../pages/FurProcessing/FurProcessing"),
);
const Culling = lazy(() => import("../../pages/Culling/Culling"));
const Transport = lazy(() => import("../../pages/Transport/Transport"));
const Recipes = lazy(() => import("../../pages/Recipes/Recipes"));

/**
 * Планування, інструменти, фінальний етап (забій/переробка) та рецепти.
 */
export function getPlanningToolsRoutes() {
  return (
    <>
      {/* 11. ПЛАНУВАННЯ */}
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/tips" element={<Tips />} />
      <Route path="/breeding-herd" element={<BreedingHerd />} />
      {/* 12. ІНСТРУМЕНТИ */}
      <Route path="/equipment" element={<Equipment />} />
      <Route path="/tools" element={<Tools />} />
      <Route path="/rabbit-identification" element={<RabbitIdentification />} />
      {/* 13. ФІНАЛ */}
      <Route path="/slaughter" element={<Slaughter />} />
      <Route path="/fur-processing" element={<FurProcessing />} />
      <Route path="/culling" element={<Culling />} />
      <Route path="/transport" element={<Transport />} />
      {/* 14. РЕЦЕПТИ */}
      <Route path="/recipes" element={<Recipes />} />
    </>
  );
}
