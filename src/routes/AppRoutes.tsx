import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { usePageMeta } from "../seo/usePageMeta";

import { getCoreRoutes } from "./groups/coreRoutes";
import { animalBasicsRoutes } from "./groups/animalBasicsRoutes";
import { housingFeedingRoutes } from "./groups/housingFeedingRoutes";
import { careRoutes } from "./groups/careRoutes";
import { breedingRoutes } from "./groups/breedingRoutes";
import { healthRoutes } from "./groups/healthRoutes";
import { treatmentRoutes } from "./groups/treatmentRoutes";
import { getPlanningToolsRoutes } from "./groups/planningToolsRoutes";
import { getCabinetRoutes } from "./groups/cabinetRoutes";
import { showsAndManagementRoutes } from "./groups/showsAndManagementRoutes";
import { petAndInfoRoutes } from "./groups/petAndInfoRoutes";

// СТОРІНКА 404 (ЗАВЖДИ ОСТАННЯ)
const NotFound = lazy(() => import("../pages/NotFound/NotFound"));

// ─────────────────────────────────────────────
const PageLoader = () => (
  <div
    style={{
      minHeight: "60vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#1a3d0f",
      color: "#f0f7eb",
    }}
  >
    Завантаження...
  </div>
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
        {getCoreRoutes(session)}
        {animalBasicsRoutes}
        {housingFeedingRoutes}
        {careRoutes}
        {breedingRoutes}
        {healthRoutes}
        {treatmentRoutes}
        {getPlanningToolsRoutes(session)}
        {getCabinetRoutes(session)}
        {showsAndManagementRoutes}
        {petAndInfoRoutes}
        {/* СТОРІНКА 404 (ЗАВЖДИ ОСТАННЯ) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
