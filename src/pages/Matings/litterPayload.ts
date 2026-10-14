/**
 * Поля окролу з форми додавання (рядки) або редагування (числа та null).
 * Спільні для insert і update у таблиці litters.
 */
export interface LitterFieldsSource {
  birth_date: string | null;
  total_born: string | number;
  alive: string | number;
  dead: string | number;
  weaned_date: string | null;
  weaned_males: string | number;
  weaned_males_cage: string | null;
  weaned_males_cage_2: string | null;
  weaned_males_2: string | number;
  weaned_females: string | number;
  weaned_females_cage: string | null;
  weaned_females_cage_2: string | null;
  weaned_females_2: string | number;
  notes: string | null;
  litter_mating_date: string | null;
  litter_control_date: string | null;
  litter_expected_birth: string | null;
  actual_male_id: string | null;
  actual_female_id: string | null;
  nestbox_date: string | null;
  failure_type: string | null;
}

export function buildLitterFields(src: LitterFieldsSource) {
  return {
    birth_date: src.birth_date || null,
    total_born: Number(src.total_born) || 0,
    alive: Number(src.alive) || 0,
    dead: Number(src.dead) || 0,
    weaned_date: src.weaned_date || null,
    weaned_males: Number(src.weaned_males) || 0,
    weaned_males_cage: src.weaned_males_cage || null,
    weaned_males_cage_2: src.weaned_males_cage_2 || null,
    weaned_males_2: Number(src.weaned_males_2) || 0,
    weaned_females: Number(src.weaned_females) || 0,
    weaned_females_cage: src.weaned_females_cage || null,
    weaned_females_cage_2: src.weaned_females_cage_2 || null,
    weaned_females_2: Number(src.weaned_females_2) || 0,
    notes: src.notes || null,
    litter_mating_date: src.litter_mating_date || null,
    litter_control_date: src.litter_control_date || null,
    litter_expected_birth: src.litter_expected_birth || null,
    actual_male_id: src.actual_male_id || null,
    actual_female_id: src.actual_female_id || null,
    nestbox_date: src.nestbox_date || null,
    failure_type: src.failure_type || null,
  };
}
