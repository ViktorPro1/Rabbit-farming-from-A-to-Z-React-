import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { logError } from "../../../lib/logError";
// Мініатюри кроликів зі сховища Supabase
import { getThumbUrls } from "../../../utils/photoStorage";
import type { Rabbit, Stats } from "../types";

// Завантажує список активних кроликів, статистику господарства і посилання
// на мініатюри. reload() повторює завантаження (після додавання/архівування).
export function useRabbits(userId: string) {
  const [rabbits, setRabbits] = useState<Rabbit[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  // Додано: посилання на мініатюри (ключ — photo_path), відкрите повне фото
  // і помилка відкриття фото
  const [thumbUrls, setThumbUrls] = useState<Record<string, string>>({});
  const [stats, setStats] = useState<Stats>({
    total: 0,
    males: 0,
    females: 0,
    youngTotal: 0,
    youngFromCages: 0,
    youngFromPaddocks: 0,
    paddockFemales: 0,
    fatteningMales: 0,
    fatteningFemales: 0,
    fatteningUnknown: 0,
    fatteningTotal: 0,
    quarantineMales: 0,
    quarantineFemales: 0,
    quarantineUnknown: 0,
    quarantineTotal: 0,
  });

  const loadStats = useCallback(
    (list: Rabbit[]) => {
      Promise.all([
        supabase
          .from("litters")
          .select("alive, weaned_males, weaned_females, weaned_date")
          .eq("user_id", userId),
        supabase
          .from("paddock_litters")
          .select("alive, weaned_males, weaned_females, weaned_date")
          .eq("user_id", userId),
        // paddock_females has no user_id column — RLS scopes it to the owner via paddocks
        supabase
          .from("paddock_females")
          .select("id")
          .not("paddock_id", "is", null),
        supabase
          .from("fattening")
          .select("males, females, unknown")
          .eq("user_id", userId)
          .eq("is_active", true),
        supabase
          .from("quarantine")
          .select("gender")
          .eq("user_id", userId)
          .eq("is_active", true),
      ])
        .then(
          ([
            littersRes,
            paddockLittersRes,
            paddockFemalesRes,
            fatteningRes,
            quarantineRes,
          ]) => {
            // Змінено: раніше помилки запитів ігнорувались, і статистика
            // рахувалась з порожніх даних (нулі без жодного попередження).
            const failedQuery = [
              littersRes,
              paddockLittersRes,
              paddockFemalesRes,
              fatteningRes,
              quarantineRes,
            ].find((r) => r.error);
            if (failedQuery?.error) {
              logError("RabbitRegistry.loadStats", failedQuery.error);
              setLoadError(
                "Не вдалося завантажити статистику господарства. Оновіть сторінку",
              );
              setLoading(false);
              return;
            }
            const littersData = littersRes.data;
            const paddockLittersData = paddockLittersRes.data;
            const paddockFemalesData = paddockFemalesRes.data;
            const fatteningData = fatteningRes.data;
            const quarantineData = quarantineRes.data;

            let youngFromCages = 0,
              youngFromPaddocks = 0,
              youngTotal = 0;

            (littersData || []).forEach((l) => {
              if (l.weaned_date) return;
              const alive = l.alive || 0;
              youngFromCages += alive;
              youngTotal += alive;
            });

            (paddockLittersData || []).forEach((l) => {
              if (l.weaned_date) return;
              const alive = l.alive || 0;
              youngFromPaddocks += alive;
              youngTotal += alive;
            });

            const paddockFemales = (paddockFemalesData || []).length;
            let fatteningMales = 0,
              fatteningFemales = 0,
              fatteningUnknown = 0;
            (fatteningData || []).forEach((f) => {
              fatteningMales += f.males || 0;
              fatteningFemales += f.females || 0;
              fatteningUnknown += f.unknown || 0;
            });
            const fatteningTotal =
              fatteningMales + fatteningFemales + fatteningUnknown;
            let quarantineMales = 0,
              quarantineFemales = 0,
              quarantineUnknown = 0;
            (quarantineData || []).forEach((q) => {
              if (q.gender === "male") quarantineMales++;
              else if (q.gender === "female") quarantineFemales++;
              else quarantineUnknown++;
            });
            const quarantineTotal =
              quarantineMales + quarantineFemales + quarantineUnknown;

            setStats({
              total:
                list.length +
                youngTotal +
                paddockFemales +
                fatteningTotal +
                quarantineTotal,
              males: list.filter((r) => r.gender === "male").length,
              females: list.filter((r) => r.gender === "female").length,
              youngTotal,
              youngFromCages,
              youngFromPaddocks,
              paddockFemales,
              fatteningMales,
              fatteningFemales,
              fatteningUnknown,
              fatteningTotal,
              quarantineMales,
              quarantineFemales,
              quarantineUnknown,
              quarantineTotal,
            });
            setLoading(false);
          },
        )
        .catch((err) => {
          logError("RabbitRegistry.loadStats", err);
          setLoading(false);
        });
    },
    [userId],
  );

  const loadData = useCallback(() => {
    supabase
      .from("rabbits")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("cage_number", { ascending: true })
      .then(
        ({ data: rabbitsData, error }) => {
          if (error) {
            // Змінено: помилка запиту більше не видається за порожній
            // реєстр; поточний список лишається без змін
            logError("RabbitRegistry.loadData", error);
            setLoadError(
              "Не вдалося завантажити список кроликів. Оновіть сторінку",
            );
            setLoading(false);
            return;
          }
          setLoadError("");
          const list = rabbitsData || [];
          setRabbits(list);
          // Додано: один запит підписаних посилань на мініатюри всього списку.
          // Збій не ламає реєстр: картки просто лишаються без фото.
          const photoPaths = list
            .map((r: Rabbit) => r.photo_path)
            .filter((p: string | null): p is string => !!p);
          if (photoPaths.length > 0) {
            getThumbUrls(photoPaths)
              .then(setThumbUrls)
              .catch((err) => logError("RabbitRegistry.thumbUrls", err));
          }
          loadStats(list);
        },
        (err) => {
          logError("RabbitRegistry.loadData", err);
          setLoading(false);
        },
      );
  }, [userId, loadStats]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { rabbits, loading, loadError, stats, thumbUrls, reload: loadData };
}
