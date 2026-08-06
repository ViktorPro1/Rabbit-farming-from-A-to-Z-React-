/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import { Route } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import Auth from "../../pages/Auth/Auth";
import Home from "../../pages/Home";
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";

const Admin = lazy(() => import("../../pages/Admin/Admin"));
const BeginnerGuide = lazy(
  () => import("../../pages/BeginnerGuide/BeginnerGuide"),
);
const BuyingRabbit = lazy(
  () => import("../../pages/BuyingRabbit/BuyingRabbit"),
);
const FAQ = lazy(() => import("../../pages/FAQ/FAQ"));
const BeginnerMistakes = lazy(
  () => import("../../pages/BeginnerMistakes/BeginnerMistakes"),
);
const RabbitMyths = lazy(() => import("../../pages/RabbitMyths/RabbitMyths"));
const Glossary = lazy(() => import("../../pages/Glossary/Glossary"));
const RabbitAllergy = lazy(
  () => import("../../pages/RabbitAllergy/RabbitAllergy"),
);
const History = lazy(() => import("../../pages/History/History"));
const RabbitHandling = lazy(
  () => import("../../pages/RabbitHandling/RabbitHandling"),
);
const Subscription = lazy(
  () => import("../../pages/Subscription/Subscription"),
);
const Community = lazy(() => import("../../pages/Community/Community"));
const RabbitPublic = lazy(
  () => import("../../pages/RabbitPublic/RabbitPublic"),
);
const FatteningPublic = lazy(
  () => import("../../pages/FatteningPublic/FatteningPublic"),
);

/**
 * Адмінка, розділ "З чого почати" та головні сторінки.
 * Потребує session для гейтингу /admin.
 */
export function getCoreRoutes(session: Session | null) {
  return (
    <>
      {/* — АДМІН — */}
      <Route
        path="/admin"
        element={
          session ? (
            <ErrorBoundary
              boundaryName="Admin"
              fallbackTitle="Сталася помилка в адмін-панелі. Спробуйте перезавантажити."
            >
              <Admin session={session} />
            </ErrorBoundary>
          ) : (
            <Auth />
          )
        }
      />
      {/* — З ЧОГО ПОЧАТИ — */}
      <Route path="/beginner-guide" element={<BeginnerGuide />} />
      <Route path="/buying-rabbit" element={<BuyingRabbit />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/beginner-mistakes" element={<BeginnerMistakes />} />
      <Route path="/rabbit-myths" element={<RabbitMyths />} />
      <Route path="/glossary" element={<Glossary />} />
      <Route path="/rabbit-allergy" element={<RabbitAllergy />} />
      <Route path="/history" element={<History />} />
      <Route path="/rabbit-handling" element={<RabbitHandling />} />
      {/* — ГОЛОВНА — */}
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/subscription" element={<Subscription />} />
      <Route path="/community" element={<Community />} />
      <Route path="/rabbit/:id" element={<RabbitPublic />} />
      <Route path="/fattening-public/:id" element={<FatteningPublic />} />
    </>
  );
}
