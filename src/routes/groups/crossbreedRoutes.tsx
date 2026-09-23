/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import { Route } from "react-router-dom";
const VerifiedCrosses = lazy(
  () => import("../../pages/VerifiedCrosses/VerifiedCrosses"),
);
const MeatCrosses = lazy(() => import("../../pages/MeatCrosses/MeatCrosses"));
const OutdoorCrosses = lazy(
  () => import("../../pages/OutdoorCrosses/OutdoorCrosses"),
);
const HomeCrosses = lazy(() => import("../../pages/HomeCrosses/HomeCrosses"));
const IncompatibleCrosses = lazy(
  () => import("../../pages/IncompatibleCrosses/IncompatibleCrosses"),
);
const BreedSigns = lazy(() => import("../../pages/BreedSigns/BreedSigns"));
const OwnerExperience = lazy(
  () => import("../../pages/OwnerExperience/OwnerExperience"),
);

/**
 * Помісні кролі: перевірені поєднання порід та спеціалізовані схеми схрещування.
 */

export const crossbreedRoutes = (
  <>
    {/* ПОМІСНІ КРОЛІ */}
    <Route path="/verified-crosses" element={<VerifiedCrosses />} />
    <Route path="/meat-crosses" element={<MeatCrosses />} />
    <Route path="/outdoor-crosses" element={<OutdoorCrosses />} />
    <Route path="/home-crosses" element={<HomeCrosses />} />
    <Route path="/incompatible-crosses" element={<IncompatibleCrosses />} />
    <Route path="/breed-signs" element={<BreedSigns />} />
    <Route path="/owner-experience" element={<OwnerExperience />} />
  </>
);
