import type { Card, Group } from "./types";
import { beginnerGroup } from "./groups/beginnerGroup";
import { animalBasicsGroup } from "./groups/animalBasicsGroup";
import { comparisonGroup } from "./groups/comparisonGroup";
import { housingGroup } from "./groups/housingGroup";
import { behaviorGroup } from "./groups/behaviorGroup";
import { feedingGroup } from "./groups/feedingGroup";
import { careGroup } from "./groups/careGroup";
import { breedingReproductionGroup } from "./groups/breedingReproductionGroup";
import { healthGroup } from "./groups/healthGroup";
import { treatmentGroup } from "./groups/treatmentGroup";
import { seasonalGroup } from "./groups/seasonalGroup";
import { vetProceduresGroup } from "./groups/vetProceduresGroup";
import { planningGroup } from "./groups/planningGroup";
import { toolsGroup } from "./groups/toolsGroup";
import { slaughterGroup } from "./groups/slaughterGroup";
import { showsGroup } from "./groups/showsGroup";
import { managementGroup } from "./groups/managementGroup";
import { technologyGroup } from "./groups/technologyGroup";
import { petGroup } from "./groups/petGroup";
import { articlesGroup } from "./groups/articlesGroup";

export type { Card, Group };

export const groups: Group[] = [
  beginnerGroup,
  animalBasicsGroup,
  comparisonGroup,
  housingGroup,
  behaviorGroup,
  feedingGroup,
  careGroup,
  breedingReproductionGroup,
  healthGroup,
  treatmentGroup,
  seasonalGroup,
  vetProceduresGroup,
  planningGroup,
  toolsGroup,
  slaughterGroup,
  showsGroup,
  managementGroup,
  technologyGroup,
  petGroup,
  articlesGroup,
];
