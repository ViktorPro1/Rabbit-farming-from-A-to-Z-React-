import { supabase } from "../../lib/supabase";
import { PAGE_END } from "./constants";

// Сім незалежних запитів, які йдуть паралельно (Promise.all), кожен з
// явним .range(0, PAGE_END): за замовчуванням PostgREST повертає не більше
// 1000 рядків, тож на великому господарстві старіші записи тихо випадали б.
export function fetchIndependentStats(userId: string) {
  return Promise.all([
    // Забої
    supabase
      .from("fattening")
      .select(
        "id, cage_number, breed, males, females, unknown, birth_date, slaughtered_at, notes",
      )
      .eq("user_id", userId)
      .eq("is_active", false)
      .not("slaughtered_at", "is", null)
      .order("slaughtered_at", { ascending: false })
      .range(0, PAGE_END),

    // Продажі
    supabase
      .from("sales")
      .select("id, males, females, unknown, sold_at")
      .eq("user_id", userId)
      .order("sold_at", { ascending: false })
      .range(0, PAGE_END),

    // Окроли з вольєрів (підлогове утримання) — окрема таблиця, не входить
    // у "litters", тому без цього блоку народжений там молодняк випадав
    // з "Народжено/Живих" в огляді
    supabase
      .from("paddock_litters")
      .select("birth_date, total_born, alive")
      .eq("user_id", userId)
      .range(0, PAGE_END),

    // Втрати і вибуття серед іменованих кроликів реєстру (не групові партії
    // Відгодівлі/Продажів, а конкретні тварини, архівовані напряму з
    // "Моїх кроликів" або через результат карантину)
    supabase
      .from("rabbits")
      .select("archive_reason, archive_date")
      .eq("user_id", userId)
      .eq("is_active", false)
      .not("archive_reason", "is", null)
      .range(0, PAGE_END),

    // Загиблі в карантині БЕЗ прив'язки до конкретного кролика реєстру
    // (rabbit_id = null, вписані вручну). Ті, що прив'язані до rabbit_id,
    // вже пораховані вище через rabbits.archive_reason — інакше було б
    // подвійне рахування однієї й тієї ж тварини
    supabase
      .from("quarantine")
      .select("id")
      .eq("user_id", userId)
      .eq("result", "died")
      .is("rabbit_id", null)
      .range(0, PAGE_END),

    supabase
      .from("matings")
      .select(
        "*, female:female_id(id, name, breed, cage_number), male:male_id(id, name, breed)",
      )
      .eq("user_id", userId)
      .range(0, PAGE_END),

    // Усі кролики користувача (включно з архівними) — щоб знайти ім'я
    // фактичного самця/самки окролу (actual_male_id / actual_female_id).
    // is_active потрібен, щоб порахувати поточне плем'я стадо.
    // Не залежить від matings, тому виконується паралельно з рештою.
    supabase
      .from("rabbits")
      .select("id, name, breed, cage_number, is_active")
      .eq("user_id", userId)
      .range(0, PAGE_END),
  ]);
}

// Залежний запит: окроли потребують id злучок
export function fetchLitters(matingIds: string[]) {
  return supabase
    .from("litters")
    .select("*")
    .in("mating_id", matingIds)
    .range(0, PAGE_END);
}

// Вкладка «Зважування»: дві незалежні вибірки
export function fetchWeighingData(userId: string) {
  return Promise.all([
    supabase
      .from("fattening")
      .select(
        "id, cage_number, birth_date, is_active, slaughtered_at, males, females, unknown",
      )
      .eq("user_id", userId)
      .range(0, 9999),
    supabase
      .from("weighings")
      .select("id, fattening_id, weighing_date, weight_g, is_final")
      .eq("user_id", userId)
      .eq("weighing_type", "fattening")
      .not("fattening_id", "is", null)
      .order("weighing_date", { ascending: true })
      .range(0, 9999),
  ]);
}
