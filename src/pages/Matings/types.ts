export interface Rabbit {
  id: string;
  name: string;
  breed: string;
  gender: "male" | "female";
  cage_number: string;
  is_active: boolean;
}

export type FailureType = "empty" | "lost";

export interface Litter {
  id: string;
  birth_date: string;
  total_born: number;
  alive: number;
  dead: number;
  weaned_date: string;
  weaned_males: number;
  weaned_males_cage: string;
  weaned_males_cage_2: string;
  weaned_males_2: number;
  weaned_females: number;
  weaned_females_cage: string;
  weaned_females_cage_2: string;
  weaned_females_2: number;
  notes: string;
  mating_id: string;
  litter_mating_date: string;
  litter_control_date: string;
  litter_expected_birth: string;
  actual_male_id: string | null;
  actual_female_id: string | null;
  nestbox_date: string | null;
  previous_mating_date: string | null;
  failure_type: FailureType | null;
  nestbox_removed_date: string | null;
}

export interface Mating {
  id: string;
  is_archived: boolean;
  female_id: string;
  male_id: string;
  mating_date: string;
  control_date: string;
  expected_birth: string;
  male_cage: string;
  female_cage: string;
  notes: string;
  breeding_scheme: string;
  female: { name: string; breed: string; cage_number: string };
  male: { name: string; breed: string; cage_number: string };
  litters?: Litter[];
}

export type SortType = "date_desc" | "date_asc" | "male";

/** Стан форми додавання злучки (усі поля — рядки з інпутів). */
export interface MatingFormState {
  female_id: string;
  male_id: string;
  male_cage: string;
  female_cage: string;
  mating_date: string;
  control_date: string;
  notes: string;
  breeding_scheme: string;
}

/** Стан форми додавання окролу (усі поля — рядки з інпутів). */
export interface LitterFormState {
  birth_date: string;
  total_born: string;
  alive: string;
  dead: string;
  weaned_date: string;
  weaned_males: string;
  weaned_males_cage: string;
  weaned_males_cage_2: string;
  weaned_males_2: string;
  weaned_females: string;
  weaned_females_cage: string;
  weaned_females_cage_2: string;
  weaned_females_2: string;
  notes: string;
  litter_mating_date: string;
  litter_control_date: string;
  litter_expected_birth: string;
  actual_male_id: string;
  actual_female_id: string;
  nestbox_date: string;
  failure_type: string;
}

export interface FatteningEntry {
  cage: string;
  males: number;
  females: number;
}

/** Текст і CSS-клас статусу (маточник тощо). */
export interface StatusInfo {
  text: string;
  className: string;
}

/** Дії, які не залежать від стану форм: лише запит у базу і перезавантаження. */
export interface MatingActions {
  deleteMating: (id: string) => Promise<void>;
  archiveMating: (id: string) => Promise<void>;
  unarchiveMating: (id: string) => Promise<void>;
  deleteLitter: (id: string) => Promise<void>;
  markNestboxPrepared: (id: string) => Promise<void>;
  markNestboxRemoved: (id: string) => Promise<void>;
  remating: (litter: Litter) => Promise<void>;
}

/** Керування редагуванням злучки (на сторінці редагується одна злучка за раз). */
export interface MatingEditControls {
  isEditing: boolean;
  data: Mating | null;
  onToggle: () => void;
  onChange: (patch: Partial<Mating>) => void;
  onCancel: () => void;
  onSave: () => void;
}

/** Керування редагуванням окролу (на сторінці редагується один окріл за раз). */
export interface LitterEditControls {
  editingId: string | null;
  data: Litter | null;
  splitMale: boolean;
  splitFemale: boolean;
  onToggle: (litter: Litter) => void;
  onChange: (patch: Partial<Litter>) => void;
  onSplitMale: () => void;
  onSplitFemale: () => void;
  onCancel: () => void;
  onSave: () => void;
}

/** Керування формою додавання окролу в конкретній злучці. */
export interface LitterAddControls {
  isOpen: boolean;
  form: LitterFormState;
  splitMale: boolean;
  splitFemale: boolean;
  onToggleOpen: () => void;
  onFieldChange: (field: keyof LitterFormState, value: string) => void;
  onMatingDateChange: (date: string) => void;
  onSplitMale: () => void;
  onSplitFemale: () => void;
  onSave: () => void;
}
