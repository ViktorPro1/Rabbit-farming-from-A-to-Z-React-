import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import { logError } from "../../lib/logError";
import {
  computeFeedPeriods,
  toYmd,
  type FeedGrouping,
  type FeedRawData,
} from "./feedCalc";

export function useFeedData(userId: string, grouping: FeedGrouping) {
  const [raw, setRaw] = useState<FeedRawData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [recipes, rabbits, fattening, weighings] = await Promise.all([
          supabase
            .from("grain_recipes")
            .select("created_at, mode, total_kg")
            .eq("user_id", userId),
          supabase
            .from("rabbits")
            .select("created_at, is_active, archive_date")
            .eq("user_id", userId),
          supabase
            .from("fattening")
            .select(
              "cage_number, birth_date, created_at, is_active, slaughtered_at, slaughter_date, males, females, unknown",
            )
            .eq("user_id", userId),
          supabase
            .from("weighings")
            .select("weighing_date, weight_g, weighing_type")
            .eq("user_id", userId),
        ]);

        const failed =
          recipes.error || rabbits.error || fattening.error || weighings.error;
        if (failed) throw failed;

        if (!cancelled) {
          setRaw({
            recipes: recipes.data ?? [],
            rabbits: rabbits.data ?? [],
            fattening: fattening.data ?? [],
            weighings: weighings.data ?? [],
          });
        }
      } catch (err) {
        logError("useFeedData.load", err);
        if (!cancelled) setError("Не вдалося завантажити дані по кормах.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const periods = useMemo(
    () => (raw ? computeFeedPeriods(raw, grouping, toYmd(new Date())) : []),
    [raw, grouping],
  );

  return { periods, loading, error };
}
