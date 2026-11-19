import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import { addDaysISO } from "../../utils/kyivDate";
import "./Matings.css";
import EmptyState from "./components/EmptyState";
import MatingAddForm from "./components/MatingAddForm";
import MatingCard from "./components/MatingCard";
import MatingsArchive from "./components/MatingsArchive";
import BreedingInfo from "./components/BreedingInfo";
import SortBar from "./components/SortBar";
import {
  FATTENING_NOT_SAVED_MESSAGE,
  emptyLitterForm,
  emptyMatingForm,
} from "./constants";
import {
  buildFatteningEntries,
  createFatteningRecords,
  getBreedForFattening,
} from "./fattening";
import { buildLitterFields } from "./litterPayload";
import type {
  Litter,
  LitterFormState,
  Mating,
  MatingFormState,
  SortType,
} from "./types";
import { useMatingActions } from "./useMatingActions";
import { useMatingsData } from "./useMatingsData";
import { getArchivedMatings, getRabbitName, getSortedMatings } from "./utils";

interface Props {
  session: Session;
}

/** Дати, що рахуються від дати злучки: контрольна (+7) і очікуваний окріл (+31). */
function matingDatePatch(date: string): Partial<LitterFormState> {
  // Додавання днів через kyivDate замість Date + toISOString (UTC)
  return date
    ? {
        litter_mating_date: date,
        litter_control_date: addDaysISO(date, 7),
        litter_expected_birth: addDaysISO(date, 31),
      }
    : {
        litter_mating_date: date,
        litter_control_date: "",
        litter_expected_birth: "",
      };
}

/** Чи заповнено в формі хоч одне поле результату (окріл, відлучення тощо). */
function hasLitterResult(f: LitterFormState): boolean {
  return Boolean(
    f.birth_date ||
    f.failure_type ||
    f.total_born ||
    f.alive ||
    f.dead ||
    f.nestbox_date ||
    f.weaned_date ||
    f.weaned_males ||
    f.weaned_males_cage ||
    f.weaned_females ||
    f.weaned_females_cage,
  );
}

export default function Matings({ session }: Props) {
  const userId = session.user.id;
  const navigate = useNavigate();

  const { rabbits, allRabbits, matings, loadError, refetch } =
    useMatingsData(userId);

  const [sortType, setSortType] = useState<SortType>("male");
  const [showMatingForm, setShowMatingForm] = useState(false);
  const [matingForm, setMatingForm] =
    useState<MatingFormState>(emptyMatingForm);
  const [editingMatingId, setEditingMatingId] = useState<string | null>(null);
  const [editingMatingData, setEditingMatingData] = useState<Mating | null>(
    null,
  );
  // Поля окролу у формі редагування злучки без окролів
  const [matingLitterForm, setMatingLitterForm] =
    useState<LitterFormState>(emptyLitterForm);
  const [matingSplitMale, setMatingSplitMale] = useState(false);
  const [matingSplitFemale, setMatingSplitFemale] = useState(false);
  const [editingLitterId, setEditingLitterId] = useState<string | null>(null);
  const [editingLitterData, setEditingLitterData] = useState<Litter | null>(
    null,
  );
  // Стан форм додавання окролу зберігається окремо для кожної злучки
  const [litterForms, setLitterForms] = useState<
    Record<string, LitterFormState>
  >({});
  const [showLitterForm, setShowLitterForm] = useState<Record<string, boolean>>(
    {},
  );
  const [showSplitMale, setShowSplitMale] = useState<Record<string, boolean>>(
    {},
  );
  const [showSplitFemale, setShowSplitFemale] = useState<
    Record<string, boolean>
  >({});
  const [editSplitMale, setEditSplitMale] = useState(false);
  const [editSplitFemale, setEditSplitFemale] = useState(false);
  const [saving, setSaving] = useState(false);
  // error — помилка збереження у відкритій формі; pageError — збій дій поза
  // формами (видалення, архів, клітки відгодівлі).
  const [error, setError] = useState("");
  const [pageError, setPageError] = useState("");
  const [expandedMatings, setExpandedMatings] = useState<
    Record<string, boolean>
  >({});

  const actions = useMatingActions({ refetch, setPageError });

  // Для вибору в формах — лише активні кролики
  const males = rabbits.filter((r) => r.gender === "male");
  const females = rabbits.filter((r) => r.gender === "female");

  const sortedMatings = useMemo(
    () => getSortedMatings(matings, sortType),
    [matings, sortType],
  );
  const archivedMatings = useMemo(() => getArchivedMatings(matings), [matings]);

  function rabbitName(id: string | null) {
    return getRabbitName(allRabbits, id);
  }

  function toggleExpanded(id: string) {
    setExpandedMatings((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  // ── Форма додавання злучки ──

  function handleMatingDateChange(date: string) {
    // Змінено: додавання днів через kyivDate замість Date + toISOString (UTC)
    setMatingForm((prev) => ({
      ...prev,
      mating_date: date,
      control_date: date ? addDaysISO(date, 7) : "",
    }));
  }

  async function handleAddMating() {
    setSaving(true);
    setError("");
    const { error: insertError } = await supabase
      .from("matings")
      .insert({ ...matingForm, user_id: userId });
    if (insertError) {
      setError("Помилка збереження");
    } else {
      setMatingForm(emptyMatingForm);
      setShowMatingForm(false);
      refetch();
    }
    setSaving(false);
  }

  // ── Редагування злучки ──

  function cancelMatingEdit() {
    setEditingMatingId(null);
    setEditingMatingData(null);
    setMatingLitterForm(emptyLitterForm);
    setMatingSplitMale(false);
    setMatingSplitFemale(false);
  }

  function toggleMatingEdit(m: Mating) {
    if (editingMatingId === m.id) {
      cancelMatingEdit();
    } else {
      setEditingMatingId(m.id);
      setEditingMatingData({ ...m });
      // Початкові значення блоку окролу беремо зі злучки
      setMatingLitterForm({
        ...emptyLitterForm,
        litter_mating_date: m.mating_date || "",
        litter_control_date: m.control_date || "",
        litter_expected_birth: m.expected_birth || "",
        nestbox_date: m.nestbox_date || "",
        notes: m.notes || "",
      });
      setMatingSplitMale(false);
      setMatingSplitFemale(false);
    }
  }

  async function handleEditMating() {
    if (!editingMatingData) return;
    setSaving(true);
    setError("");
    setPageError("");

    const current = matings.find((x) => x.id === editingMatingData.id);
    // Блок окролу у формі показується лише для злучки без окролів
    const withLitterBlock = (current?.litters || []).length === 0;
    const lf = matingLitterForm;

    const { error: updateError } = await supabase
      .from("matings")
      .update({
        female_id: editingMatingData.female_id,
        male_id: editingMatingData.male_id,
        male_cage: editingMatingData.male_cage,
        female_cage: editingMatingData.female_cage,
        mating_date: withLitterBlock
          ? lf.litter_mating_date
          : editingMatingData.mating_date,
        control_date: withLitterBlock
          ? lf.litter_control_date
          : editingMatingData.control_date,
        breeding_scheme: editingMatingData.breeding_scheme,
        notes: withLitterBlock ? lf.notes : editingMatingData.notes,
      })
      .eq("id", editingMatingData.id);
    if (updateError) {
      setError("Помилка збереження");
      setSaving(false);
      return;
    }

    // Окріл створюємо лише якщо заповнено хоч одне поле результату.
    // Нотатки лишаються на злучці, щоб вони не показувались двічі.
    if (withLitterBlock && hasLitterResult(lf)) {
      const { error: litterError } = await supabase.from("litters").insert({
        user_id: userId,
        mating_id: editingMatingData.id,
        ...buildLitterFields({ ...lf, notes: "" }),
      });
      if (litterError) {
        setPageError(
          "Злучку збережено, але окріл не збережено. Додайте його кнопкою «+ Додати злучку» в картці.",
        );
      } else if (lf.weaned_date) {
        // Порода — як у getBreedForFattening без «фактичних» батьків:
        // спочатку крольчиха, потім кролик
        const breed =
          allRabbits.find((r) => r.id === editingMatingData.female_id)?.breed ||
          allRabbits.find((r) => r.id === editingMatingData.male_id)?.breed ||
          "";
        const fatteningSaved = await createFatteningRecords(
          userId,
          lf.birth_date,
          breed,
          buildFatteningEntries(lf),
        );
        if (!fatteningSaved) {
          setPageError(FATTENING_NOT_SAVED_MESSAGE);
        }
      }
    }

    cancelMatingEdit();
    refetch();
    setSaving(false);
  }

  // ── Редагування окролу ──

  function cancelLitterEdit() {
    setEditingLitterId(null);
    setEditingLitterData(null);
    setEditSplitMale(false);
    setEditSplitFemale(false);
  }

  function toggleLitterEdit(l: Litter) {
    if (editingLitterId === l.id) {
      cancelLitterEdit();
    } else {
      setEditingLitterId(l.id);
      setEditingLitterData({ ...l });
      setEditSplitMale(!!l.weaned_males_cage_2);
      setEditSplitFemale(!!l.weaned_females_cage_2);
    }
  }

  async function handleEditLitter(mating: Mating) {
    if (!editingLitterData) return;
    setSaving(true);
    setError("");
    setPageError("");

    const originalLitter = (mating.litters || []).find(
      (l) => l.id === editingLitterData.id,
    );
    const wasNotWeaned = !originalLitter?.weaned_date;
    const isNowWeaned = !!editingLitterData.weaned_date;

    const { error: updateError } = await supabase
      .from("litters")
      .update({
        ...buildLitterFields(editingLitterData),
        nestbox_removed_date: editingLitterData.nestbox_removed_date || null,
      })
      .eq("id", editingLitterData.id);

    if (updateError) {
      setError("Помилка збереження");
    } else {
      if (wasNotWeaned && isNowWeaned) {
        const breed = getBreedForFattening(
          allRabbits,
          mating,
          editingLitterData.actual_male_id || "",
          editingLitterData.actual_female_id || "",
        );
        const fatteningSaved = await createFatteningRecords(
          userId,
          editingLitterData.birth_date,
          breed,
          buildFatteningEntries(editingLitterData),
        );
        if (!fatteningSaved) {
          setPageError(FATTENING_NOT_SAVED_MESSAGE);
        }
      }
      cancelLitterEdit();
      refetch();
    }
    setSaving(false);
  }

  // ── Форма додавання окролу ──

  function updateLitterForm(matingId: string, patch: Partial<LitterFormState>) {
    setLitterForms((prev) => ({
      ...prev,
      [matingId]: { ...(prev[matingId] || emptyLitterForm), ...patch },
    }));
  }

  function handleLitterMatingDateChange(matingId: string, date: string) {
    updateLitterForm(matingId, matingDatePatch(date));
  }

  async function handleAddLitter(matingId: string, mating: Mating) {
    setSaving(true);
    setError("");
    setPageError("");
    const form = litterForms[matingId] || emptyLitterForm;
    const { error: insertError } = await supabase.from("litters").insert({
      user_id: userId,
      mating_id: matingId,
      ...buildLitterFields(form),
    });
    if (insertError) {
      setError("Помилка збереження");
    } else {
      if (form.weaned_date) {
        const breed = getBreedForFattening(
          allRabbits,
          mating,
          form.actual_male_id,
          form.actual_female_id,
        );
        const fatteningSaved = await createFatteningRecords(
          userId,
          form.birth_date,
          breed,
          buildFatteningEntries(form),
        );
        if (!fatteningSaved) {
          setPageError(FATTENING_NOT_SAVED_MESSAGE);
        }
      }
      setLitterForms((prev) => ({ ...prev, [matingId]: emptyLitterForm }));
      setShowLitterForm((prev) => ({ ...prev, [matingId]: false }));
      setShowSplitMale((prev) => ({ ...prev, [matingId]: false }));
      setShowSplitFemale((prev) => ({ ...prev, [matingId]: false }));
      refetch();
    }
    setSaving(false);
  }

  return (
    <div className="matings-page">
      <div className="matings-header">
        <h1>🐰 Парування</h1>
        <button
          className="matings-back-btn"
          onClick={() => navigate("/registry")}
        >
          {"⬅"} Мої кролики
        </button>
      </div>

      {loadError && <p className="matings-error">{loadError}</p>}
      {pageError && <p className="matings-error">{pageError}</p>}

      <button
        className="matings-add-btn"
        onClick={() => setShowMatingForm(!showMatingForm)}
      >
        {showMatingForm ? "✕ Скасувати" : "+ Додати злучку"}
      </button>

      {showMatingForm && (
        <MatingAddForm
          form={matingForm}
          males={males}
          females={females}
          saving={saving}
          error={error}
          onChange={(patch) => setMatingForm((prev) => ({ ...prev, ...patch }))}
          onDateChange={handleMatingDateChange}
          onSave={handleAddMating}
        />
      )}

      <SortBar sortType={sortType} onChange={setSortType} />

      <div className="matings-list">
        {/* Змінено: при помилці завантаження не показуємо "злучок ще немає" */}
        {sortedMatings.length === 0 && !loadError ? (
          <EmptyState />
        ) : (
          sortedMatings.map((m) => (
            <MatingCard
              key={m.id}
              mating={m}
              males={males}
              females={females}
              getRabbitName={rabbitName}
              isExpanded={!!expandedMatings[m.id]}
              onToggleExpanded={() => toggleExpanded(m.id)}
              saving={saving}
              error={error}
              actions={actions}
              matingEdit={{
                isEditing: editingMatingId === m.id,
                data: editingMatingData,
                litterForm: matingLitterForm,
                splitMale: matingSplitMale,
                splitFemale: matingSplitFemale,
                onToggle: () => toggleMatingEdit(m),
                onChange: (patch) =>
                  setEditingMatingData((prev) =>
                    prev ? { ...prev, ...patch } : prev,
                  ),
                onLitterFieldChange: (field, value) =>
                  setMatingLitterForm((prev) => ({ ...prev, [field]: value })),
                onLitterMatingDateChange: (date) =>
                  setMatingLitterForm((prev) => ({
                    ...prev,
                    ...matingDatePatch(date),
                  })),
                onSplitMale: () => setMatingSplitMale(true),
                onSplitFemale: () => setMatingSplitFemale(true),
                onCancel: cancelMatingEdit,
                onSave: handleEditMating,
              }}
              litterEdit={{
                editingId: editingLitterId,
                data: editingLitterData,
                splitMale: editSplitMale,
                splitFemale: editSplitFemale,
                onToggle: toggleLitterEdit,
                onChange: (patch) =>
                  setEditingLitterData((prev) =>
                    prev ? { ...prev, ...patch } : prev,
                  ),
                onSplitMale: () => setEditSplitMale(true),
                onSplitFemale: () => setEditSplitFemale(true),
                onCancel: cancelLitterEdit,
                onSave: () => handleEditLitter(m),
              }}
              litterAdd={{
                isOpen: !!showLitterForm[m.id],
                form: litterForms[m.id] || emptyLitterForm,
                splitMale: !!showSplitMale[m.id],
                splitFemale: !!showSplitFemale[m.id],
                onToggleOpen: () =>
                  setShowLitterForm((prev) => ({
                    ...prev,
                    [m.id]: !prev[m.id],
                  })),
                onFieldChange: (field, value) =>
                  updateLitterForm(m.id, { [field]: value }),
                onMatingDateChange: (date) =>
                  handleLitterMatingDateChange(m.id, date),
                onSplitMale: () =>
                  setShowSplitMale((prev) => ({ ...prev, [m.id]: true })),
                onSplitFemale: () =>
                  setShowSplitFemale((prev) => ({ ...prev, [m.id]: true })),
                onSave: () => handleAddLitter(m.id, m),
              }}
            />
          ))
        )}
      </div>

      <MatingsArchive
        matings={archivedMatings}
        getRabbitName={rabbitName}
        onUnarchive={actions.unarchiveMating}
      />

      <BreedingInfo />
    </div>
  );
}
