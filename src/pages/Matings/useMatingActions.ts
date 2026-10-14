import { supabase } from "../../lib/supabase";
import { addDaysISO, todayKyiv } from "../../utils/kyivDate";
import type { Litter, MatingActions } from "./types";

interface Options {
  /** Перезавантажити список злучок після успішної дії */
  refetch: () => void;
  setPageError: (message: string) => void;
}

/**
 * Дії над злучками та окролами, які не залежать від стану форм:
 * запит у базу, повідомлення про помилку, перезавантаження.
 */
export function useMatingActions({
  refetch,
  setPageError,
}: Options): MatingActions {
  async function deleteMating(id: string) {
    if (!confirm("Видалити злучку? Окроли залишаться в базі.")) return;
    setPageError("");
    const { error } = await supabase.from("matings").delete().eq("id", id);
    if (error) {
      // Змінено: раніше помилка ігнорувалась, злучка мовчки лишалась
      console.error("Не вдалося видалити злучку:", error);
      setPageError("Не вдалося видалити злучку. Спробуйте ще раз");
      return;
    }
    refetch();
  }

  async function archiveMating(id: string) {
    setPageError("");
    const { error } = await supabase
      .from("matings")
      .update({ is_archived: true })
      .eq("id", id);
    if (error) {
      console.error("Не вдалося архівувати злучку:", error);
      setPageError("Не вдалося архівувати злучку. Спробуйте ще раз");
      return;
    }
    refetch();
  }

  async function unarchiveMating(id: string) {
    setPageError("");
    const { error } = await supabase
      .from("matings")
      .update({ is_archived: false })
      .eq("id", id);
    if (error) {
      console.error("Не вдалося повернути злучку з архіву:", error);
      setPageError("Не вдалося повернути злучку з архіву. Спробуйте ще раз");
      return;
    }
    refetch();
  }

  async function deleteLitter(id: string) {
    if (!confirm("Видалити окріл?")) return;
    setPageError("");
    const { error } = await supabase.from("litters").delete().eq("id", id);
    if (error) {
      // Змінено: раніше помилка ігнорувалась, окріл мовчки лишався
      console.error("Не вдалося видалити окріл:", error);
      setPageError("Не вдалося видалити окріл. Спробуйте ще раз");
      return;
    }
    refetch();
  }

  async function markNestboxPrepared(id: string) {
    // Змінено: сьогодні за Києвом, не UTC
    const today = todayKyiv();
    setPageError("");
    const { error } = await supabase
      .from("litters")
      .update({ nestbox_date: today })
      .eq("id", id);
    if (error) {
      // Змінено: раніше помилка ігнорувалась
      console.error("Не вдалося зберегти дату маточника:", error);
      setPageError("Не вдалося зберегти дату маточника. Спробуйте ще раз");
      return;
    }
    refetch();
  }

  async function markNestboxRemoved(id: string) {
    setPageError("");
    const { error } = await supabase
      .from("litters")
      .update({ nestbox_removed_date: todayKyiv() })
      .eq("id", id);
    if (error) {
      console.error("Не вдалося зберегти дату видалення маточника:", error);
      setPageError(
        "Не вдалося зберегти дату видалення маточника. Спробуйте ще раз",
      );
      return;
    }
    refetch();
  }

  async function remating(l: Litter) {
    if (
      !confirm(
        "Кролиця покрилась повторно? Дата злучки, контрольна та очікуваний окріл будуть оновлені.",
      )
    )
      return;

    // Змінено: "сьогодні" за Києвом (раніше UTC: з 00:00 до ~03:00 писалась
    // вчорашня дата), контрольна й очікувана дати від нього через kyivDate
    const today = todayKyiv();

    const { error } = await supabase
      .from("litters")
      .update({
        litter_mating_date: today,
        litter_control_date: addDaysISO(today, 7),
        litter_expected_birth: addDaysISO(today, 31),
        nestbox_date: null,
        previous_mating_date: l.litter_mating_date || null,
      })
      .eq("id", l.id);

    if (error) {
      alert("Помилка збереження");
    } else {
      refetch();
    }
  }

  return {
    deleteMating,
    archiveMating,
    unarchiveMating,
    deleteLitter,
    markNestboxPrepared,
    markNestboxRemoved,
    remating,
  };
}
