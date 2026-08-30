/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import { Route } from "react-router-dom";

const Okril = lazy(() => import("../../pages/Okril/Okril"));
const WinterLitter = lazy(
  () => import("../../pages/WinterLitter/WinterLitter"),
);
const Weaning = lazy(() => import("../../pages/Weaning/Weaning"));
const WeightControl = lazy(
  () => import("../../pages/WeightControl/WeightControl"),
);
const ArtificialFeeding = lazy(
  () => import("../../pages/ArtificialFeeding/ArtificialFeeding"),
);
const MatingPage = lazy(
  () => import("../../pages/MatingFrequency/MatingFrequency"),
);
const MatingBehavior = lazy(
  () => import("../../pages/MatingBehavior/MatingBehavior"),
);
const OkrilControl = lazy(
  () => import("../../pages/OkrilControl/OkrilControl"),
);
const Sexing = lazy(() => import("../../pages/Sexing/Sexing"));
const DoePreparation = lazy(
  () => import("../../pages/DoePreparation/DoePreparation"),
);
const BuckManagement = lazy(
  () => import("../../pages/BuckManagement/BuckManagement"),
);
const FalsePregnancy = lazy(
  () => import("../../pages/FalsePregnancy/FalsePregnancy"),
);
const Telegony = lazy(() => import("../../pages/Telegony/Telegony"));
const PregnancyToxemia = lazy(
  () => import("../../pages/PregnancyToxemia/PregnancyToxemia"),
);
const SplayLeg = lazy(() => import("../../pages/SplayLeg/SplayLeg"));
const Dystocia = lazy(() => import("../../pages/Dystocia/Dystocia"));
const Mastitis = lazy(() => import("../../pages/Mastitis/Mastitis"));
const PostpartumCare = lazy(
  () => import("../../pages/PostpartumCare/PostpartumCare"),
);
const Fostering = lazy(() => import("../../pages/Fostering/Fostering"));
const HalfSiblings = lazy(
  () => import("../../pages/HalfSiblings/HalfSiblings"),
);
const Conveyor = lazy(() => import("../../pages/Conveyor/Conveyor"));

/**
 * Розведення: окріл, парування, вагітність та пов'язані ускладнення.
 */
export const breedingRoutes = (
  <>
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
    <Route path="/telegony" element={<Telegony />} />
    <Route path="/pregnancy-toxemia" element={<PregnancyToxemia />} />
    <Route path="/splay-leg" element={<SplayLeg />} />
    <Route path="/dystocia" element={<Dystocia />} />
    <Route path="/mastitis" element={<Mastitis />} />
    <Route path="/postpartum-care" element={<PostpartumCare />} />
    <Route path="/fostering" element={<Fostering />} />
    <Route path="/half-siblings" element={<HalfSiblings />} />
    <Route path="/conveyor" element={<Conveyor />} />
  </>
);
