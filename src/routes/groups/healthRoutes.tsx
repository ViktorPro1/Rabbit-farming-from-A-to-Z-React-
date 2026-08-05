import { lazy } from "react";
import { Route } from "react-router-dom";

const Symptoms = lazy(() => import("../../pages/Symptoms/Symptoms"));
const Diseases = lazy(() => import("../../pages/Diseases/Diseases"));
const Parasites = lazy(() => import("../../pages/Parasites/Parasites"));
const Droppings = lazy(() => import("../../pages/Droppings/Droppings"));
const RabbitBodyCondition = lazy(
  () => import("../../pages/RabbitBodyCondition/RabbitBodyCondition"),
);
const Poisoning = lazy(() => import("../../pages/Poisoning/Poisoning"));
const RabbitAbscesses = lazy(
  () => import("../../pages/RabbitAbscesses/RabbitAbscesses"),
);
const RabbitEyeDiseases = lazy(
  () => import("../../pages/RabbitEyeDiseases/RabbitEyeDiseases"),
);
const RabbitUrolithiasis = lazy(
  () => import("../../pages/RabbitUrolithiasis/RabbitUrolithiasis"),
);
const UrineScald = lazy(() => import("../../pages/UrineScald/UrineScald"));
const EncephalitozoonCuniculi = lazy(
  () => import("../../pages/EncephalitozoonCuniculi/EncephalitozoonCuniculi"),
);
const WoolBlock = lazy(() => import("../../pages/WoolBlock/WoolBlock"));
const UterineAdenocarcinoma = lazy(
  () => import("../../pages/UterineAdenocarcinoma/UterineAdenocarcinoma"),
);
const ChronicKidneyDisease = lazy(
  () => import("../../pages/ChronicKidneyDisease/ChronicKidneyDisease"),
);
const Treponematosis = lazy(
  () => import("../../pages/Treponematosis/Treponematosis"),
);
const OtitisMediaInterna = lazy(
  () => import("../../pages/OtitisMediaInterna/OtitisMediaInterna"),
);
const RabbitObesity = lazy(
  () => import("../../pages/RabbitObesity/RabbitObesity"),
);
const UmbilicalHernia = lazy(
  () => import("../../pages/UmbilicalHernia/UmbilicalHernia"),
);
const Cryptorchidism = lazy(
  () => import("../../pages/Cryptorchidism/Cryptorchidism"),
);
const SeniorSensoryLoss = lazy(
  () => import("../../pages/SeniorSensoryLoss/SeniorSensoryLoss"),
);
const Pyometra = lazy(() => import("../../pages/Pyometra/Pyometra"));
const Megaesophagus = lazy(
  () => import("../../pages/Megaesophagus/Megaesophagus"),
);
const Pyoderma = lazy(() => import("../../pages/Pyoderma/Pyoderma"));
const SecondaryHyperparathyroidism = lazy(
  () =>
    import(
      "../../pages/SecondaryHyperparathyroidism/SecondaryHyperparathyroidism"
    ),
);
const Ringworm = lazy(() => import("../../pages/Ringworm/Ringworm"));
const HeartDisease = lazy(
  () => import("../../pages/HeartDisease/HeartDisease"),
);
const Thymoma = lazy(() => import("../../pages/Thymoma/Thymoma"));

/**
 * Здоров'я: симптоматика та конкретні хвороби.
 */
export const healthRoutes = (
  <>
    {/* 7. ЗДОРОВ'Я */}
    <Route path="/symptoms" element={<Symptoms />} />
    <Route path="/diseases" element={<Diseases />} />
    <Route path="/parasites" element={<Parasites />} />
    <Route path="/droppings" element={<Droppings />} />
    <Route
      path="/rabbit-body-condition"
      element={<RabbitBodyCondition />}
    />
    <Route path="/poisoning" element={<Poisoning />} />
    <Route path="/rabbit-abscesses" element={<RabbitAbscesses />} />
    <Route path="/rabbit-eye-diseases" element={<RabbitEyeDiseases />} />
    <Route path="/rabbit-urolithiasis" element={<RabbitUrolithiasis />} />
    <Route path="/urine-scald" element={<UrineScald />} />
    <Route
      path="/encephalitozoon-cuniculi"
      element={<EncephalitozoonCuniculi />}
    />
    <Route path="/wool-block" element={<WoolBlock />} />
    <Route
      path="/uterine-adenocarcinoma"
      element={<UterineAdenocarcinoma />}
    />
    <Route
      path="/chronic-kidney-disease"
      element={<ChronicKidneyDisease />}
    />
    <Route path="/treponematosis" element={<Treponematosis />} />
    <Route path="/otitis-media-interna" element={<OtitisMediaInterna />} />
    <Route path="/rabbit-obesity" element={<RabbitObesity />} />
    <Route path="/umbilical-hernia" element={<UmbilicalHernia />} />
    <Route path="/cryptorchidism" element={<Cryptorchidism />} />
    <Route path="/senior-sensory-loss" element={<SeniorSensoryLoss />} />
    <Route path="/pyometra" element={<Pyometra />} />
    <Route path="/megaesophagus" element={<Megaesophagus />} />
    <Route path="/pyoderma" element={<Pyoderma />} />
    <Route
      path="/secondary-hyperparathyroidism"
      element={<SecondaryHyperparathyroidism />}
    />
    <Route path="/ringworm" element={<Ringworm />} />
    <Route path="/heart-disease" element={<HeartDisease />} />
    <Route path="/thymoma" element={<Thymoma />} />
  </>
);
