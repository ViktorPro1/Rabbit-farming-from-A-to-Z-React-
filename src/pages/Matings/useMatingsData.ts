import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import type { Mating, Rabbit } from "./types";
import { attachLittersToMatings } from "./utils";

/**
 * Завантажує кроликів і злучки з окролами.
 * Змінено: loadError — збій завантаження злучок/кроликів. Раніше ці помилки
 * ігнорувались, і при збої список злучок і окролів виглядав порожнім чи
 * неповним без жодного повідомлення.
 */
export function useMatingsData(userId: string) {
  const [rabbits, setRabbits] = useState<Rabbit[]>([]);
  const [allRabbits, setAllRabbits] = useState<Rabbit[]>([]);
  const [matings, setMatings] = useState<Mating[]>([]);
  const [loadError, setLoadError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    // Стан завантаження двох незалежних запитів: підсумкове повідомлення
    // залежить від обох, тож рахуємо його в одному місці
    let rabbitsFailed = false;
    let matingsFailed = false;
    const reportLoadState = () => {
      if (cancelled) return;
      setLoadError(
        rabbitsFailed || matingsFailed
          ? "Не вдалося завантажити дані парувань. Оновіть сторінку"
          : "",
      );
    };

    supabase
      .from("rabbits")
      .select("id, name, breed, gender, cage_number, is_active")
      .eq("user_id", userId)
      .then(
        ({ data, error }) => {
          if (cancelled) return;
          if (error) {
            console.error(
              "Не вдалося завантажити кроликів для парувань:",
              error,
            );
            rabbitsFailed = true;
            reportLoadState();
            return;
          }
          setAllRabbits(data || []);
          setRabbits((data || []).filter((r) => r.is_active));
          reportLoadState();
        },
        (err) => {
          console.error("Не вдалося завантажити кроликів для парувань:", err);
          rabbitsFailed = true;
          reportLoadState();
        },
      );

    supabase
      .from("matings")
      .select(
        "*, female:female_id(name, breed, cage_number), male:male_id(name, breed, cage_number)",
      )
      .eq("user_id", userId)
      .then(
        async ({ data, error }) => {
          if (cancelled) return;
          if (error || !data) {
            // Змінено: помилка запиту більше не ігнорується; поточний
            // список лишається без змін
            console.error("Не вдалося завантажити парування:", error);
            matingsFailed = true;
            reportLoadState();
            return;
          }
          const ids = data.map((m) => m.id);
          const { data: littersData, error: littersError } = await supabase
            .from("litters")
            .select("*")
            .in("mating_id", ids);
          if (cancelled) return;
          if (littersError) {
            // Змінено: без цієї перевірки парування показувались би без
            // окролів, ніби їх немає
            console.error("Не вдалося завантажити окроли:", littersError);
            matingsFailed = true;
            reportLoadState();
            return;
          }
          setMatings(attachLittersToMatings(data, littersData || []));
          reportLoadState();
        },
        (err) => {
          console.error("Не вдалося завантажити паруванн та посліди:", err);
          matingsFailed = true;
          reportLoadState();
        },
      );

    return () => {
      cancelled = true;
    };
  }, [userId, refreshKey]);

  return { rabbits, allRabbits, matings, loadError, refetch };
}
