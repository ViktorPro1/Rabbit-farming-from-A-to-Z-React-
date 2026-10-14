import { supabase } from "../../lib/supabase";
import { addDaysISO } from "../../utils/kyivDate";
import type { FatteningEntry, Mating, Rabbit } from "./types";

// Змінено: раніше дата парсилась як UTC, зсувалась за локальним часом і
// форматувалась через toISOString() — при переході на літній час результат
// міг бути на день менший. Тепер чиста календарна арифметика (kyivDate).
function calcSlaughterDate(birthDate: string): string {
  if (!birthDate) return "";
  return addDaysISO(birthDate, 110);
}

export function getBreedForFattening(
  allRabbits: Rabbit[],
  mating: Mating,
  actualMaleId: string,
  actualFemaleId: string,
): string {
  if (actualMaleId) {
    const r = allRabbits.find((r) => r.id === actualMaleId);
    if (r?.breed) return r.breed;
  }
  if (actualFemaleId) {
    const r = allRabbits.find((r) => r.id === actualFemaleId);
    if (r?.breed) return r.breed;
  }
  return mating.female?.breed || mating.male?.breed || "";
}

/** Поля окролу (з форми додавання або редагування), потрібні для відлучення. */
export interface WeaningValues {
  weaned_males_cage: string;
  weaned_males_cage_2?: string;
  weaned_males_2?: string | number;
  weaned_males: string | number;
  weaned_females_cage: string;
  weaned_females_cage_2?: string;
  weaned_females_2?: string | number;
  weaned_females: string | number;
}

export function buildFatteningEntries(form: WeaningValues): FatteningEntry[] {
  const totalMales = Number(form.weaned_males) || 0;
  const secondMales = Number(form.weaned_males_2) || 0;
  const firstMales = form.weaned_males_cage_2
    ? Math.max(totalMales - secondMales, 0)
    : totalMales;

  const totalFemales = Number(form.weaned_females) || 0;
  const secondFemales = Number(form.weaned_females_2) || 0;
  const firstFemales = form.weaned_females_cage_2
    ? Math.max(totalFemales - secondFemales, 0)
    : totalFemales;

  const entries: FatteningEntry[] = [
    { cage: form.weaned_males_cage || "", males: firstMales, females: 0 },
    {
      cage: form.weaned_females_cage || "",
      males: 0,
      females: firstFemales,
    },
  ];

  if (form.weaned_males_cage_2 && secondMales > 0) {
    entries.push({
      cage: form.weaned_males_cage_2,
      males: secondMales,
      females: 0,
    });
  }
  if (form.weaned_females_cage_2 && secondFemales > 0) {
    entries.push({
      cage: form.weaned_females_cage_2,
      males: 0,
      females: secondFemales,
    });
  }

  return entries;
}

// Змінено: повертає true, лише якщо всі клітки відгодівлі збережено. Раніше
// помилки ігнорувались: окріл уже був позначений відлученим, а клітки
// відгодівлі не створювались, і повторити це було неможливо.
export async function createFatteningRecords(
  userId: string,
  birthDate: string,
  breed: string,
  entries: FatteningEntry[],
): Promise<boolean> {
  let allSaved = true;
  // Групуємо за номером клітки, щоб не плодити дублікати однієї й тієї ж клітки
  const cageTotals: Record<string, { males: number; females: number }> = {};

  for (const entry of entries) {
    if (!entry.cage) continue;
    if (entry.males <= 0 && entry.females <= 0) continue;
    cageTotals[entry.cage] = cageTotals[entry.cage] || {
      males: 0,
      females: 0,
    };
    cageTotals[entry.cage].males += entry.males;
    cageTotals[entry.cage].females += entry.females;
  }

  for (const [cageNumber, counts] of Object.entries(cageTotals)) {
    const { data: existingRows, error: lookupError } = await supabase
      .from("fattening")
      .select("id, males, females")
      .eq("user_id", userId)
      .eq("cage_number", cageNumber)
      .eq("is_active", true)
      .limit(1);

    if (lookupError) {
      // Без перевірки існуючої клітки не можна безпечно додавати: вийшов би
      // дублікат тієї самої клітки
      console.error("Не вдалося перевірити клітку відгодівлі:", lookupError);
      allSaved = false;
      continue;
    }

    const existing = existingRows && existingRows[0];

    if (existing) {
      const { error: updateError } = await supabase
        .from("fattening")
        .update({
          males: (existing.males || 0) + counts.males,
          females: (existing.females || 0) + counts.females,
        })
        .eq("id", existing.id);
      if (updateError) {
        console.error("Не вдалося оновити клітку відгодівлі:", updateError);
        allSaved = false;
      }
    } else {
      const { error: insertError } = await supabase.from("fattening").insert({
        user_id: userId,
        cage_number: cageNumber,
        males: counts.males,
        females: counts.females,
        unknown: 0,
        breed: breed || null,
        birth_date: birthDate || null,
        slaughter_date: birthDate ? calcSlaughterDate(birthDate) : null,
        is_active: true,
      });
      if (insertError) {
        console.error("Не вдалося створити клітку відгодівлі:", insertError);
        allSaved = false;
      }
    }
  }

  return allSaved;
}
