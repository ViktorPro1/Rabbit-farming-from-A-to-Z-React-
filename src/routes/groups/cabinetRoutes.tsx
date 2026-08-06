/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import { Route } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import Auth from "../../pages/Auth/Auth";
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import type { ReactNode } from "react";

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
 * Обгортає елемент сторінки кабінету власним ErrorBoundary,
 * щоб падіння однієї сторінки (напр. Statistics) не забирало
 * з собою весь застосунок — тільки цю секцію.
 */
function withCabinetBoundary(name: string, element: ReactNode) {
  return (
    <ErrorBoundary
      boundaryName={name}
      fallbackTitle={`Сталася помилка на сторінці «${name}». Спробуйте перезавантажити.`}
    >
      {element}
    </ErrorBoundary>
  );
}

/**
 * Особистий кабінет — усі маршрути потребують активної сесії.
 */
export function getCabinetRoutes(session: Session | null) {
  return (
    <>
      <Route
        path="/registry"
        element={
          session ? (
            withCabinetBoundary(
              "RabbitRegistry",
              <RabbitRegistry session={session} />,
            )
          ) : (
            <Auth />
          )
        }
      />
      <Route
        path="/registry/edit/:id"
        element={
          session ? (
            withCabinetBoundary("RabbitEdit", <RabbitEdit session={session} />)
          ) : (
            <Auth />
          )
        }
      />
      <Route
        path="/archive"
        element={
          session ? (
            withCabinetBoundary("Archive", <Archive session={session} />)
          ) : (
            <Auth />
          )
        }
      />
      <Route
        path="/matings"
        element={
          session ? (
            withCabinetBoundary("Matings", <Matings session={session} />)
          ) : (
            <Auth />
          )
        }
      />
      <Route
        path="/paddocks"
        element={
          session ? (
            withCabinetBoundary("Paddocks", <Paddocks session={session} />)
          ) : (
            <Auth />
          )
        }
      />
      <Route
        path="/fattening"
        element={
          session ? (
            withCabinetBoundary("Fattening", <Fattening session={session} />)
          ) : (
            <Auth />
          )
        }
      />
      <Route
        path="/quarantine"
        element={
          session ? (
            withCabinetBoundary("Quarantine", <Quarantine session={session} />)
          ) : (
            <Auth />
          )
        }
      />
      <Route
        path="/statistics"
        element={
          session ? (
            withCabinetBoundary("Statistics", <Statistics session={session} />)
          ) : (
            <Auth />
          )
        }
      />
      <Route
        path="/my-vaccinations"
        element={
          session ? (
            withCabinetBoundary(
              "MyVaccinations",
              <MyVaccinations session={session} />,
            )
          ) : (
            <Auth />
          )
        }
      />
      <Route
        path="/my-treatments"
        element={
          session ? (
            withCabinetBoundary(
              "MyTreatments",
              <MyTreatments session={session} />,
            )
          ) : (
            <Auth />
          )
        }
      />
      <Route
        path="/disinfection-log"
        element={
          session ? (
            withCabinetBoundary(
              "DisinfectionLog",
              <DisinfectionLog session={session} />,
            )
          ) : (
            <Auth />
          )
        }
      />
      <Route
        path="/cage-search"
        element={
          session ? (
            withCabinetBoundary("CageSearch", <CageSearch session={session} />)
          ) : (
            <Auth />
          )
        }
      />
      <Route
        path="/grain-recipes-history"
        element={
          session ? (
            withCabinetBoundary(
              "GrainRecipesHistory",
              <GrainRecipesHistory session={session} />,
            )
          ) : (
            <Auth />
          )
        }
      />
      <Route
        path="/weighing"
        element={
          session ? (
            withCabinetBoundary("Weighing", <Weighing session={session} />)
          ) : (
            <Auth />
          )
        }
      />
      <Route
        path="/pedigree"
        element={
          session ? (
            withCabinetBoundary("Pedigree", <Pedigree session={session} />)
          ) : (
            <Auth />
          )
        }
      />
    </>
  );
}
