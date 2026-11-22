// Єдина конфігурація резервної копії. Нею користуються і експорт, і імпорт.
// Складена за реальною схемою бази (public) станом на 22.11.2026.

export const BACKUP_VERSION = 1;

export interface BackupTable {
  /** назва таблиці в Supabase */
  name: string;
  /** колонки-посилання: колонка -> таблиця, на яку вона вказує */
  refs?: Record<string, string>;
  /** колонки, які база рахує сама: їх не можна вставляти при відновленні */
  generated?: string[];
  /** колонки, які при відновленні очищаємо (значення втрачає сенс) */
  clear?: string[];
  /** у таблиці немає user_id: доступ обмежується через RLS і зв'язок */
  noUserId?: boolean;
}

// Порядок важливий: таблиця стоїть після тих, на які вона посилається.
export const BACKUP_TABLES: BackupTable[] = [
  {
    name: "rabbits",
    refs: { mother_id: "rabbits", father_id: "rabbits" },
    clear: ["photo_path"],
  },
  { name: "paddocks", refs: { male_id: "rabbits" } },
  {
    name: "paddock_females",
    noUserId: true,
    refs: { paddock_id: "paddocks", rabbit_id: "rabbits" },
  },
  { name: "expenses" },
  { name: "fattening" },
  {
    name: "matings",
    refs: { female_id: "rabbits", male_id: "rabbits" },
    generated: ["expected_birth"],
  },
  {
    name: "litters",
    refs: {
      mother_id: "rabbits",
      father_id: "rabbits",
      actual_male_id: "rabbits",
      actual_female_id: "rabbits",
      mating_id: "matings",
    },
  },
  {
    name: "paddock_matings",
    refs: { paddock_id: "paddocks" },
    generated: ["expected_birth"],
  },
  { name: "paddock_litters", refs: { paddock_mating_id: "paddock_matings" } },
  { name: "quarantine", refs: { rabbit_id: "rabbits" } },
  {
    name: "weighings",
    refs: { rabbit_id: "rabbits", fattening_id: "fattening" },
  },
  { name: "sales", refs: { fattening_id: "fattening" } },
  { name: "medication_batches", refs: { expense_id: "expenses" } },
  { name: "feed_batches", refs: { expense_id: "expenses" } },
  {
    name: "breeding_plan",
    refs: {
      female_id: "rabbits",
      male_id: "rabbits",
      backup_male_id: "rabbits",
      mating_id: "matings",
    },
  },
  { name: "vaccinations" },
  { name: "treatments" },
  { name: "cage_disinfections" },
  { name: "grain_recipes" },
  { name: "other_income" },
];

// Навмисно НЕ входять у копію (службові або чужі дані):
// profiles, admins, invite_codes, push_subscriptions, leads, nps_feedback,
// chat_messages, chat_reads, chat_reactions, vizytka_downloads,
// health_log і weight_log (порожні, старі таблиці без user_id).
