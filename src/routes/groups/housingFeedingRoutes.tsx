/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import { Route } from "react-router-dom";

const Enclosure = lazy(() => import("../../pages/Enclosure/Enclosure"));
const FloorCare = lazy(() => import("../../pages/FloorCare/FloorCare"));
const PaddockInfo = lazy(() => import("../../pages/Paddocks/PaddockInfo"));
const Microclimate = lazy(
  () => import("../../pages/Microclimate/Microclimate"),
);
const RabbitHousingDIY = lazy(
  () => import("../../pages/RabbitHousingDIY/RabbitHousingDIY"),
);
const Feeding = lazy(() => import("../../pages/Feeding/Feeding"));
const Leaves = lazy(() => import("../../pages/Leaves/Leaves"));
const Crops = lazy(() => import("../../pages/Crops/Crops"));
const Water = lazy(() => import("../../pages/Water/Water"));
const Feeders = lazy(() => import("../../pages/Feeders/Feeders"));
const NewFood = lazy(() => import("../../pages/NewFood/NewFood"));
const CompoundFeed = lazy(
  () => import("../../pages/CompoundFeed/CompoundFeed"),
);
const SpecialFeeds = lazy(
  () => import("../../pages/SpecialFeeds/SpecialFeeds"),
);
const PelletingProblems = lazy(
  () => import("../../pages/PelletingProblems/PelletingProblems"),
);

/**
 * Житло (клітки, вольєри) та харчування.
 */
export const housingFeedingRoutes = (
  <>
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
    <Route path="/pelleting-problems" element={<PelletingProblems />} />
  </>
);
