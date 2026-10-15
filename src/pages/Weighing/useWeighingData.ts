import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { LOAD_OPTIONS_ERROR, LOAD_RECORDS_ERROR } from "./constants";
import { computeHeadsByFattening } from "./heads";
import type {
  FatteningOption,
  HeadsRow,
  RabbitOption,
  WeighingRecord,
} from "./types";

// Завантажує записи зважування, списки кроликів/кліток для вибору і склад
// кліток відгодівлі. fetchRecords / fetchOptions віддаються назовні, щоб
// після змін можна було оновити дані.
export function useWeighingData(userId: string) {
  const [records, setRecords] = useState<WeighingRecord[]>([]);
  const [rabbitOptions, setRabbitOptions] = useState<RabbitOption[]>([]);
  const [fatteningOptions, setFatteningOptions] = useState<FatteningOption[]>(
    [],
  );
  // Кількість голів у кожній клітці відгодівлі (включно з неактивними,
  // щоб маса закритих циклів у архіві теж рахувалась)
  const [headsByFattening, setHeadsByFattening] = useState<
    Record<string, number>
  >({});
  const [loading, setLoading] = useState(true);
  // Повідомлення про помилки завантаження й дій (раніше ігнорувались:
  // при збої список записів виглядав порожнім)
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    fetchRecords();
    fetchOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function fetchRecords() {
    setLoading(true);
    // .range(0, 9999) — без нього PostgREST за замовчуванням повертає не
    // більше 1000 рядків, і старіші зважування тихо випадали б зі списку.
    const { data, error } = await supabase
      .from("weighings")
      .select("*")
      .eq("user_id", userId)
      .order("weighing_date", { ascending: true })
      .range(0, 9999);
    if (error) {
      // При помилці лишаємо поточний список (раніше він очищався до
      // порожнього без жодного повідомлення)
      console.error("Не вдалося завантажити зважування:", error);
      setPageError(LOAD_RECORDS_ERROR);
    } else {
      setRecords(data || []);
    }
    setLoading(false);
  }

  async function fetchOptions() {
    const [rabbitsRes, fatteningRes, headsRes] = await Promise.all([
      supabase
        .from("rabbits")
        .select("id, name, birth_date, cage_number, reminder_days")
        .eq("user_id", userId)
        .eq("is_active", true)
        .order("cage_number", { ascending: true })
        .range(0, 9999),
      supabase
        .from("fattening")
        .select("id, cage_number, birth_date, reminder_days")
        .eq("user_id", userId)
        .eq("is_active", true)
        .order("cage_number", { ascending: true })
        .range(0, 9999),
      // Без фільтра is_active: клітка після забою деактивується, але склад
      // у ній лишається, і він потрібен для маси закритих циклів.
      supabase
        .from("fattening")
        .select(
          "id, cage_number, birth_date, slaughtered_at, males, females, unknown",
        )
        .eq("user_id", userId)
        .range(0, 9999),
    ]);
    if (headsRes.error) {
      console.error("Не вдалося завантажити склад кліток:", headsRes.error);
    } else {
      setHeadsByFattening(
        computeHeadsByFattening((headsRes.data || []) as HeadsRow[]),
      );
    }
    if (rabbitsRes.error || fatteningRes.error) {
      console.error(
        "Не вдалося завантажити кроликів і клітки для зважування:",
        rabbitsRes.error || fatteningRes.error,
      );
      setPageError(LOAD_OPTIONS_ERROR);
      return;
    }
    setRabbitOptions(rabbitsRes.data || []);
    setFatteningOptions(fatteningRes.data || []);
  }

  return {
    records,
    rabbitOptions,
    fatteningOptions,
    headsByFattening,
    loading,
    pageError,
    setPageError,
    fetchRecords,
    fetchOptions,
  };
}
