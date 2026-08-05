import { lazy } from "react";
import { Route } from "react-router-dom";

const Biology = lazy(() => import("../../pages/Biology/Biology"));
const Breeds = lazy(() => import("../../pages/Breeds/Breeds"));
const Breeding = lazy(() => import("../../pages/Breeding/Breeding"));
const ArtificialInsemination = lazy(
  () => import("../../pages/ArtificialInsemination/ArtificialInsemination"),
);
const Selection = lazy(() => import("../../pages/Selection/Selection"));
const Genetics = lazy(() => import("../../pages/Genetics/Genetics"));
const RabbitSounds = lazy(
  () => import("../../pages/RabbitSounds/RabbitSounds"),
);
const RabbitBodyLanguage = lazy(
  () => import("../../pages/RabbitBodyLanguage/RabbitBodyLanguage"),
);
const RabbitStress = lazy(
  () => import("../../pages/RabbitStress/RabbitStress"),
);
const RabbitWhiskers = lazy(
  () => import("../../pages/RabbitWhiskers/RabbitWhiskers"),
);
const LethalColorGenes = lazy(
  () => import("../../pages/LethalColorGenes/LethalColorGenes"),
);
const ColorGeneticsExample = lazy(
  () => import("../../pages/ColorGeneticsExample/ColorGeneticsExample"),
);
const RabbitVsHare = lazy(
  () => import("../../pages/RabbitVsHare/RabbitVsHare"),
);
const RabbitsAndGuineaPigs = lazy(
  () => import("../../pages/RabbitsAndGuineaPigs/RabbitsAndGuineaPigs"),
);
const RabbitsAndPredators = lazy(
  () => import("../../pages/RabbitsAndPredators/RabbitsAndPredators"),
);
const RabbitsAndChickens = lazy(
  () => import("../../pages/RabbitsAndChickens/RabbitsAndChickens"),
);
const RabbitsAndChildren = lazy(
  () => import("../../pages/RabbitsAndChildren/RabbitsAndChildren"),
);

/**
 * Знайомство з твариною (генетика, поведінка) та порівняння з іншими тваринами.
 */
export const animalBasicsRoutes = (
  <>
    {/* 1. ПОЧАТОК — знайомство з твариною */}
    <Route path="/biology" element={<Biology />} />
    <Route path="/breeds" element={<Breeds />} />
    <Route path="/breeding" element={<Breeding />} />
    <Route
      path="/artificial-insemination"
      element={<ArtificialInsemination />}
    />
    <Route path="/selection" element={<Selection />} />
    <Route path="/genetics" element={<Genetics />} />
    <Route path="/rabbit-sounds" element={<RabbitSounds />} />
    <Route path="/rabbit-body-language" element={<RabbitBodyLanguage />} />
    <Route path="/rabbit-stress" element={<RabbitStress />} />
    <Route path="/rabbit-whiskers" element={<RabbitWhiskers />} />
    <Route path="/lethal-color-genes" element={<LethalColorGenes />} />
    <Route
      path="/color-genetics-example"
      element={<ColorGeneticsExample />}
    />
    {/* 2. ПОРІВНЯННЯ ТА СПІВЖИТТЯ */}
    <Route path="/rabbit-vs-hare" element={<RabbitVsHare />} />
    <Route
      path="/rabbits-and-guinea-pigs"
      element={<RabbitsAndGuineaPigs />}
    />
    <Route
      path="/rabbits-and-predators"
      element={<RabbitsAndPredators />}
    />
    <Route path="/rabbits-and-chickens" element={<RabbitsAndChickens />} />
    <Route path="/rabbits-and-children" element={<RabbitsAndChildren />} />
  </>
);
