/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import { Route } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import Auth from "../../pages/Auth/Auth";

const RabbitRegistry = lazy(
  () => import("../../pages/RabbitRegistry/RabbitRegistry"),
);
const RabbitEdit = lazy(() => import("../../pages/RabbitEdit/RabbitEdit"));
const Archive = lazy(() => import("../../pages/Archive/Archive"));
const Matings = lazy(() => import("../../pages/Matings/Matings"));
const Paddocks = lazy(() => import("../../pages/Paddocks/Paddocks"));
const Fattening = lazy(() => import("../../pages/Fattening/Fattening"));
const Quarantine = lazy(() => import("../../pages/Quarantine/Quarantine"));
const Statistics = lazy(() => import("../../pages/Statistics/Statistics"));
const MyVaccinations = lazy(
  () => import("../../pages/MyVaccinations/MyVaccinations"),
);
const MyTreatments = lazy(
  () => import("../../pages/MyTreatments/MyTreatments"),
);
const DisinfectionLog = lazy(
  () => import("../../pages/DisinfectionLog/DisinfectionLog"),
);
const CageSearch = lazy(() => import("../../pages/CageSearch/CageSearch"));
const GrainRecipesHistory = lazy(
  () => import("../../pages/GrainRecipesHistory/GrainRecipesHistory"),
);
const Weighing = lazy(() => import("../../pages/Weighing/Weighing"));
const Pedigree = lazy(() => import("../../pages/Pedigree/Pedigree"));

/**
 * Особистий кабінет — усі маршрути потребують активної сесії.
 */
export function getCabinetRoutes(session: Session | null) {
  return (
    <>
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
        element={session ? <DisinfectionLog session={session} /> : <Auth />}
      />
      <Route
        path="/cage-search"
        element={session ? <CageSearch session={session} /> : <Auth />}
      />
      <Route
        path="/grain-recipes-history"
        element={session ? <GrainRecipesHistory session={session} /> : <Auth />}
      />
      <Route
        path="/weighing"
        element={session ? <Weighing session={session} /> : <Auth />}
      />
      <Route
        path="/pedigree"
        element={session ? <Pedigree session={session} /> : <Auth />}
      />
    </>
  );
}
