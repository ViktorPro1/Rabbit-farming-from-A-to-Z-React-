import type { FailureType, LitterFormState, MatingFormState } from "./types";

export const emptyMatingForm: MatingFormState = {
  female_id: "",
  male_id: "",
  male_cage: "",
  female_cage: "",
  mating_date: "",
  control_date: "",
  notes: "",
  breeding_scheme: "extensive",
};

export const emptyLitterForm: LitterFormState = {
  birth_date: "",
  total_born: "",
  alive: "",
  dead: "",
  weaned_date: "",
  weaned_males: "",
  weaned_males_cage: "",
  weaned_males_cage_2: "",
  weaned_males_2: "",
  weaned_females: "",
  weaned_females_cage: "",
  weaned_females_cage_2: "",
  weaned_females_2: "",
  notes: "",
  litter_mating_date: "",
  litter_control_date: "",
  litter_expected_birth: "",
  actual_male_id: "",
  actual_female_id: "",
  nestbox_date: "",
  failure_type: "",
};

export const WEANING_SCHEME: Record<string, { min: number; target: number }> = {
  intensive: { min: 21, target: 28 },
  semi_intensive: { min: 35, target: 45 },
  extensive: { min: 45, target: 60 },
};

export const FAILURE_LABELS: Record<FailureType, string> = {
  empty: "Не окотилась",
  lost: "Окотилась, розкидала: малюки завмерли",
};

// На який день після окролу забирати маточник
export const NESTBOX_REMOVE_DAYS_AFTER_BIRTH = 20;

export const FATTENING_NOT_SAVED_MESSAGE =
  "Окріл збережено, але клітки відгодівлі створено не повністю. Перевірте сторінку «Відгодівля» і додайте їх вручну";
