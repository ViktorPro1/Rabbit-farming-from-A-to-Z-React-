import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { DELETE_ERROR, SAVE_REMINDER_ERROR, emptyForm } from "./constants";
import type {
  FatteningOption,
  RabbitOption,
  ReminderEntityType,
  ReminderPromptState,
  WeighingFormState,
  WeighingRecord,
} from "./types";

// Форми додавання / редагування, підказка про нагадування і всі дії, що
// пишуть у базу (додати, змінити, видалити, інтервал нагадування).
export function useWeighingActions({
  userId,
  rabbitById,
  fatteningById,
  fetchRecords,
  fetchOptions,
  setPageError,
}: {
  userId: string;
  rabbitById: Record<string, RabbitOption>;
  fatteningById: Record<string, FatteningOption>;
  fetchRecords: () => Promise<void>;
  fetchOptions: () => Promise<void>;
  setPageError: (message: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<WeighingRecord | null>(
    null,
  );
  const [form, setForm] = useState<WeighingFormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [pendingReminderPrompt, setPendingReminderPrompt] =
    useState<ReminderPromptState | null>(null);
  const [reminderPromptDraft, setReminderPromptDraft] = useState("");

  async function handleReminderIntervalChange(
    entityType: ReminderEntityType,
    entityId: string,
    days: number | null,
  ) {
    const table = entityType === "rabbit" ? "rabbits" : "fattening";
    const { error: updateError } = await supabase
      .from(table)
      .update({ reminder_days: days })
      .eq("id", entityId);
    if (updateError) {
      // Змінено: раніше помилка ігнорувалась, нагадування не зберігалось мовчки
      console.error("Не вдалося зберегти інтервал нагадування:", updateError);
      setPageError(SAVE_REMINDER_ERROR);
      return;
    }
    fetchOptions();
  }

  async function handleAdd() {
    setSaving(true);
    setError("");
    const { error } = await supabase.from("weighings").insert({
      litter_label: form.litter_label,
      rabbit_name: form.rabbit_name || null,
      weighing_date: form.weighing_date,
      weight_g: Number(form.weight_g),
      notes: form.notes || null,
      weighing_type: form.weighing_type,
      is_final: form.weighing_type === "fattening" ? form.is_final : false,
      rabbit_id:
        form.weighing_type === "breeding" ? form.rabbit_id || null : null,
      fattening_id:
        form.weighing_type === "fattening" ? form.fattening_id || null : null,
      size_category: form.size_category,
      user_id: userId,
    });
    if (error) {
      setError("Помилка збереження");
    } else {
      const entityType: ReminderEntityType | null =
        form.weighing_type === "breeding" ? "rabbit" : "fattening";
      const entityId =
        form.weighing_type === "breeding" ? form.rabbit_id : form.fattening_id;

      if (entityType && entityId) {
        const entity: RabbitOption | FatteningOption | undefined =
          entityType === "rabbit"
            ? rabbitById[entityId]
            : fatteningById[entityId];
        if (entity && !entity.reminder_days) {
          const label =
            entityType === "rabbit"
              ? (entity as RabbitOption).name
              : `Клітка ${(entity as FatteningOption).cage_number}`;
          setReminderPromptDraft("");
          setPendingReminderPrompt({ entityType, entityId, label });
        }
      }

      setForm(emptyForm);
      setShowForm(false);
      fetchRecords();
    }
    setSaving(false);
  }

  function saveReminderPrompt() {
    if (!pendingReminderPrompt) return;
    const n = Number(reminderPromptDraft);
    if (n > 0) {
      handleReminderIntervalChange(
        pendingReminderPrompt.entityType,
        pendingReminderPrompt.entityId,
        Math.round(n),
      );
    }
    setPendingReminderPrompt(null);
    setReminderPromptDraft("");
  }

  async function handleEdit() {
    if (!editingRecord) return;
    setSaving(true);
    setError("");
    const { error } = await supabase
      .from("weighings")
      .update({
        litter_label: editingRecord.litter_label,
        rabbit_name: editingRecord.rabbit_name || null,
        weighing_date: editingRecord.weighing_date,
        weight_g: Number(editingRecord.weight_g),
        notes: editingRecord.notes || null,
        weighing_type: editingRecord.weighing_type,
        is_final:
          editingRecord.weighing_type === "fattening"
            ? editingRecord.is_final
            : false,
        rabbit_id:
          editingRecord.weighing_type === "breeding"
            ? editingRecord.rabbit_id || null
            : null,
        fattening_id:
          editingRecord.weighing_type === "fattening"
            ? editingRecord.fattening_id || null
            : null,
        size_category: editingRecord.size_category || "meat",
      })
      .eq("id", editingRecord.id);
    if (error) {
      setError("Помилка збереження");
    } else {
      setEditingRecord(null);
      fetchRecords();
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Видалити запис?")) return;
    setPageError("");
    const { error } = await supabase.from("weighings").delete().eq("id", id);
    if (error) {
      // Змінено: раніше помилка ігнорувалась, запис мовчки лишався
      console.error("Не вдалося видалити зважування:", error);
      setPageError(DELETE_ERROR);
      return;
    }
    fetchRecords();
  }

  return {
    showForm,
    setShowForm,
    editingRecord,
    setEditingRecord,
    form,
    setForm,
    saving,
    error,
    pendingReminderPrompt,
    setPendingReminderPrompt,
    reminderPromptDraft,
    setReminderPromptDraft,
    handleReminderIntervalChange,
    handleAdd,
    saveReminderPrompt,
    handleEdit,
    handleDelete,
  };
}
