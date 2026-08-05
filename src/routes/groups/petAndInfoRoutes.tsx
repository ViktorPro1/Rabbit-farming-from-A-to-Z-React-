/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import { Route } from "react-router-dom";

const Zoonoses = lazy(() => import("../../pages/Zoonoses/Zoonoses"));
const ApartmentProofing = lazy(
  () => import("../../pages/ApartmentProofing/ApartmentProofing"),
);
const LitterTraining = lazy(
  () => import("../../pages/LitterTraining/LitterTraining"),
);
const Enrichment = lazy(() => import("../../pages/Enrichment/Enrichment"));
const CompanionBonding = lazy(
  () => import("../../pages/CompanionBonding/CompanionBonding"),
);
const PetTravel = lazy(() => import("../../pages/PetTravel/PetTravel"));
const SeniorRabbit = lazy(
  () => import("../../pages/SeniorRabbit/SeniorRabbit"),
);
const AboutProject = lazy(
  () => import("../../pages/Info/AboutProject/AboutProject"),
);
const PrivacyPolicy = lazy(
  () => import("../../pages/Info/PrivacyPolicy/PrivacyPolicy"),
);
const TermsOfUse = lazy(() => import("../../pages/Info/TermsOfUse/TermsOfUse"));
const BehindTheScenes = lazy(
  () => import("../../pages/BehindTheScenes/BehindTheScenes"),
);
const AndroidApp = lazy(() => import("../../pages/AndroidApp/AndroidApp"));
const Changelog = lazy(() => import("../../pages/Changelog/Changelog"));

/**
 * Кролик як домашній улюбленець, зоонози та інформаційні сторінки.
 */
export const petAndInfoRoutes = (
  <>
    {/* — ЗОНИ — */}
    <Route path="/zoonoses" element={<Zoonoses />} />
    {/* — КРОЛИК ЯК ДОМАШНІЙ УЛЮБЛЕНЕЦЬ — */}
    <Route path="/apartment-proofing" element={<ApartmentProofing />} />
    <Route path="/litter-training" element={<LitterTraining />} />
    <Route path="/enrichment" element={<Enrichment />} />
    <Route path="/companion-bonding" element={<CompanionBonding />} />
    <Route path="/pet-travel" element={<PetTravel />} />
    <Route path="/senior-rabbit" element={<SeniorRabbit />} />
    {/* — ІНФО — */}
    <Route path="/about" element={<AboutProject />} />
    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    <Route path="/terms-of-use" element={<TermsOfUse />} />
    <Route path="/behind-the-scenes" element={<BehindTheScenes />} />
    <Route path="/android-app" element={<AndroidApp />} />
    {/* — ОНОВЛЕННЯ — */}
    <Route path="/changelog" element={<Changelog />} />
  </>
);
