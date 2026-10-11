import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { logError } from "../../../lib/logError";
import { todayKyiv } from "../../../utils/kyivDate";

// Потік архівування: вибір кролика й причини, запис у БД, помилка в модалці.
// onArchived викликається після успішного запису (оновлення списку).
export function useArchiveRabbit(onArchived: () => void) {
  const [confirmArchiveId, setConfirmArchiveId] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState("");
  // Повідомлення про помилку архівування показується в модалці
  const [archiveError, setArchiveError] = useState("");

  async function confirmArchive() {
    if (!confirmArchiveId || !selectedReason) return;
    setArchiveError("");
    const { error } = await supabase
      .from("rabbits")
      .update({
        is_active: false,
        archive_reason: selectedReason,
        archive_date: todayKyiv(), // Змінено: дата за Києвом, не UTC
      })
      .eq("id", confirmArchiveId);
    if (error) {
      // Змінено: раніше модалка закривалась і список оновлювався, ніби
      // кролика архівовано, хоча запис не збережено
      logError("RabbitRegistry.confirmArchive", error);
      setArchiveError("Не вдалося архівувати кролика. Спробуйте ще раз");
      return;
    }
    setConfirmArchiveId(null);
    setSelectedReason("");
    onArchived();
  }

  function openArchive(id: string) {
    setArchiveError("");
    setConfirmArchiveId(id);
  }

  function cancelArchive() {
    setConfirmArchiveId(null);
    setSelectedReason("");
    setArchiveError("");
  }

  return {
    confirmArchiveId,
    selectedReason,
    setSelectedReason,
    archiveError,
    openArchive,
    cancelArchive,
    confirmArchive,
  };
}
