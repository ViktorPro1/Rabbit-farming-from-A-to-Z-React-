/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import { Route } from "react-router-dom";

const CraftMeat = lazy(() => import("../../pages/CraftMeat/CraftMeat"));
const CraftFur = lazy(() => import("../../pages/CraftFur/CraftFur"));
const CraftAngora = lazy(() => import("../../pages/CraftAngora/CraftAngora"));
const CraftSelling = lazy(
  () => import("../../pages/CraftSelling/CraftSelling"),
);

export const craftRoutes = (
  <>
    <Route path="/craft-meat" element={<CraftMeat />} />
    <Route path="/craft-fur" element={<CraftFur />} />
    <Route path="/craft-angora" element={<CraftAngora />} />
    <Route path="/craft-selling" element={<CraftSelling />} />
  </>
);
