import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import "./Matings.css";

interface Props {
  session: Session;
}

interface Rabbit {
  id: string;
  name: string;
  breed: string;
  gender: "male" | "female";
  cage_number: string;
}

interface Litter {
  id: string;
  birth_date: string;
  total_born: number;
  alive: number;
  dead: number;
  weaned_date: string;
  weaned_males: number;
  weaned_males_cage: string;
  weaned_females: number;
  weaned_females_cage: string;
  notes: string;
  mating_id: string;
  litter_mating_date: string;
  litter_control_date: string;
  litter_expected_birth: string;
  actual_male_id: string | null;
  actual_female_id: string | null;
  nestbox_date: string | null;
}

interface Mating {
  id: string;
  female_id: string;
  male_id: string;
  mating_date: string;
  control_date: string;
  expected_birth: string;
  male_cage: string;
  female_cage: string;
  notes: string;
  female: { name: string; breed: string; cage_number: string };
  male: { name: string; breed: string; cage_number: string };
  litters?: Litter[];
}

type SortType = "date_desc" | "date_asc" | "male";

const emptyMatingForm = {
  female_id: "",
  male_id: "",
  male_cage: "",
  female_cage: "",
  mating_date: "",
  control_date: "",
  notes: "",
};

const emptyLitterForm = {
  birth_date: "",
  total_born: "",
  alive: "",
  dead: "",
  weaned_date: "",
  weaned_males: "",
  weaned_males_cage: "",
  weaned_females: "",
  weaned_females_cage: "",
  notes: "",
  litter_mating_date: "",
  litter_control_date: "",
  litter_expected_birth: "",
  actual_male_id: "",
  actual_female_id: "",
  nestbox_date: "",
};

function calcSlaughterDate(birthDate: string): string {
  if (!birthDate) return "";
  const d = new Date(birthDate);
  d.setDate(d.getDate() + 110);
  return d.toISOString().split("T")[0];
}

export default function Matings({ session }: Props) {
  const [rabbits, setRabbits] = useState<Rabbit[]>([]);
  const [matings, setMatings] = useState<Mating[]>([]);
  const [sortType, setSortType] = useState<SortType>("date_desc");
  const [showMatingForm, setShowMatingForm] = useState(false);
  const [matingForm, setMatingForm] = useState(emptyMatingForm);
  const [editingMatingId, setEditingMatingId] = useState<string | null>(null);
  const [editingMatingData, setEditingMatingData] = useState<Mating | null>(
    null,
  );
  const [editingLitterId, setEditingLitterId] = useState<string | null>(null);
  const [editingLitterData, setEditingLitterData] = useState<Litter | null>(
    null,
  );
  const [litterForms, setLitterForms] = useState<
    Record<string, typeof emptyLitterForm>
  >({});
  const [showLitterForm, setShowLitterForm] = useState<Record<string, boolean>>(
    {},
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const navigate = useNavigate();

  function fetchMatings() {
    setRefreshKey((k) => k + 1);
  }

  useEffect(() => {
    let cancelled = false;

    supabase
      .from("rabbits")
      .select("id, name, breed, gender, cage_number")
      .eq("user_id", session.user.id)
      .then(({ data }) => {
        if (!cancelled) setRabbits(data || []);
      });

    supabase
      .from("matings")
      .select(
        "*, female:female_id(name, breed, cage_number), male:male_id(name, breed, cage_number)",
      )
      .eq("user_id", session.user.id)
      .then(async ({ data }) => {
        if (cancelled || !data) return;
        const ids = data.map((m) => m.id);
        const { data: littersData } = await supabase
          .from("litters")
          .select("*")
          .in("mating_id", ids);
        if (cancelled) return;
        const littersMap: Record<string, Litter[]> = {};
        (littersData || []).forEach((l) => {
          if (!littersMap[l.mating_id]) littersMap[l.mating_id] = [];
          littersMap[l.mating_id].push(l);
        });
        Object.keys(littersMap).forEach((matingId) => {
          littersMap[matingId].sort((a, b) => {
            const dateA =
              a.birth_date ||
              a.litter_expected_birth ||
              a.litter_mating_date ||
              "";
            const dateB =
              b.birth_date ||
              b.litter_expected_birth ||
              b.litter_mating_date ||
              "";
            return dateA.localeCompare(dateB); // старіші зверху, новіші знизу
          });
        });
        setMatings(
          data.map((m) => ({ ...m, litters: littersMap[m.id] || [] })),
        );
      });

    return () => {
      cancelled = true;
    };
  }, [session.user.id, refreshKey]);

  const allMales = rabbits.filter((r) => r.gender === "male");
  const allFemales = rabbits.filter((r) => r.gender === "female");

  const sortedMatings = useMemo(() => {
    const copy = [...matings];
    if (sortType === "date_desc") {
      copy.sort(
        (a, b) =>
          new Date(b.mating_date).getTime() - new Date(a.mating_date).getTime(),
      );
    } else if (sortType === "date_asc") {
      copy.sort(
        (a, b) =>
          new Date(a.mating_date).getTime() - new Date(b.mating_date).getTime(),
      );
    } else if (sortType === "male") {
      copy.sort((a, b) => {
        const cageA = parseInt(a.male_cage || "0", 10);
        const cageB = parseInt(b.male_cage || "0", 10);
        return cageA - cageB;
      });
    }
    return copy;
  }, [matings, sortType]);

  function handleMatingDateChange(date: string) {
    if (!date) {
      setMatingForm({ ...matingForm, mating_date: date, control_date: "" });
      return;
    }
    const d = new Date(date);
    d.setDate(d.getDate() + 7);
    setMatingForm({
      ...matingForm,
      mating_date: date,
      control_date: d.toISOString().split("T")[0],
    });
  }

  function handleLitterMatingDateChange(matingId: string, date: string) {
    if (!date) {
      setLitterForms({
        ...litterForms,
        [matingId]: {
          ...(litterForms[matingId] || emptyLitterForm),
          litter_mating_date: date,
          litter_control_date: "",
          litter_expected_birth: "",
        },
      });
      return;
    }
    const control = new Date(date);
    control.setDate(control.getDate() + 7);
    const expected = new Date(date);
    expected.setDate(expected.getDate() + 31);
    setLitterForms({
      ...litterForms,
      [matingId]: {
        ...(litterForms[matingId] || emptyLitterForm),
        litter_mating_date: date,
        litter_control_date: control.toISOString().split("T")[0],
        litter_expected_birth: expected.toISOString().split("T")[0],
      },
    });
  }

  function getRabbitName(id: string | null): string {
    if (!id) return "";
    const r = rabbits.find((r) => r.id === id);
    if (!r) return "невідомий";
    return `${r.name}${r.breed ? ` (${r.breed})` : ""}`;
  }

  function getBreedForFattening(
    mating: Mating,
    actualMaleId: string,
    actualFemaleId: string,
  ): string {
    if (actualMaleId) {
      const r = rabbits.find((r) => r.id === actualMaleId);
      if (r?.breed) return r.breed;
    }
    if (actualFemaleId) {
      const r = rabbits.find((r) => r.id === actualFemaleId);
      if (r?.breed) return r.breed;
    }
    return mating.female?.breed || mating.male?.breed || "";
  }

  async function createFatteningRecords(
    birthDate: string,
    breed: string,
    males: number,
    malesCage: string,
    females: number,
    femalesCage: string,
  ) {
    const inserts = [];
    if (males > 0 && malesCage) {
      inserts.push({
        user_id: session.user.id,
        cage_number: malesCage,
        males,
        females: 0,
        unknown: 0,
        breed: breed || null,
        birth_date: birthDate || null,
        slaughter_date: birthDate ? calcSlaughterDate(birthDate) : null,
        is_active: true,
      });
    }
    if (females > 0 && femalesCage) {
      inserts.push({
        user_id: session.user.id,
        cage_number: femalesCage,
        males: 0,
        females,
        unknown: 0,
        breed: breed || null,
        birth_date: birthDate || null,
        slaughter_date: birthDate ? calcSlaughterDate(birthDate) : null,
        is_active: true,
      });
    }
    if (inserts.length > 0) {
      await supabase.from("fattening").insert(inserts);
    }
  }

  async function handleAddMating() {
    setSaving(true);
    setError("");
    const { error } = await supabase
      .from("matings")
      .insert({ ...matingForm, user_id: session.user.id });
    if (error) {
      setError("Помилка збереження");
    } else {
      setMatingForm(emptyMatingForm);
      setShowMatingForm(false);
      fetchMatings();
    }
    setSaving(false);
  }

  async function handleEditMating() {
    if (!editingMatingData) return;
    setSaving(true);
    setError("");
    const { error } = await supabase
      .from("matings")
      .update({
        female_id: editingMatingData.female_id,
        male_id: editingMatingData.male_id,
        male_cage: editingMatingData.male_cage,
        female_cage: editingMatingData.female_cage,
        mating_date: editingMatingData.mating_date,
        control_date: editingMatingData.control_date,
        notes: editingMatingData.notes,
      })
      .eq("id", editingMatingData.id);
    if (error) {
      setError("Помилка збереження");
    } else {
      setEditingMatingId(null);
      setEditingMatingData(null);
      fetchMatings();
    }
    setSaving(false);
  }

  async function handleEditLitter(mating: Mating) {
    if (!editingLitterData) return;
    setSaving(true);
    setError("");

    const originalLitter = (mating.litters || []).find(
      (l) => l.id === editingLitterData.id,
    );
    const wasNotWeaned = !originalLitter?.weaned_date;
    const isNowWeaned = !!editingLitterData.weaned_date;

    const { error } = await supabase
      .from("litters")
      .update({
        birth_date: editingLitterData.birth_date || null,
        total_born: Number(editingLitterData.total_born) || 0,
        alive: Number(editingLitterData.alive) || 0,
        dead: Number(editingLitterData.dead) || 0,
        weaned_date: editingLitterData.weaned_date || null,
        weaned_males: Number(editingLitterData.weaned_males) || 0,
        weaned_males_cage: editingLitterData.weaned_males_cage || null,
        weaned_females: Number(editingLitterData.weaned_females) || 0,
        weaned_females_cage: editingLitterData.weaned_females_cage || null,
        notes: editingLitterData.notes || null,
        litter_mating_date: editingLitterData.litter_mating_date || null,
        litter_control_date: editingLitterData.litter_control_date || null,
        litter_expected_birth: editingLitterData.litter_expected_birth || null,
        actual_male_id: editingLitterData.actual_male_id || null,
        actual_female_id: editingLitterData.actual_female_id || null,
        nestbox_date: editingLitterData.nestbox_date || null,
      })
      .eq("id", editingLitterData.id);

    if (error) {
      setError("Помилка збереження");
    } else {
      if (wasNotWeaned && isNowWeaned) {
        const breed = getBreedForFattening(
          mating,
          editingLitterData.actual_male_id || "",
          editingLitterData.actual_female_id || "",
        );
        await createFatteningRecords(
          editingLitterData.birth_date,
          breed,
          Number(editingLitterData.weaned_males) || 0,
          editingLitterData.weaned_males_cage || "",
          Number(editingLitterData.weaned_females) || 0,
          editingLitterData.weaned_females_cage || "",
        );
      }
      setEditingLitterId(null);
      setEditingLitterData(null);
      fetchMatings();
    }
    setSaving(false);
  }

  async function handleAddLitter(matingId: string, mating: Mating) {
    setSaving(true);
    setError("");
    const form = litterForms[matingId] || emptyLitterForm;
    const { error } = await supabase.from("litters").insert({
      user_id: session.user.id,
      mating_id: matingId,
      birth_date: form.birth_date || null,
      total_born: Number(form.total_born) || 0,
      alive: Number(form.alive) || 0,
      dead: Number(form.dead) || 0,
      weaned_date: form.weaned_date || null,
      weaned_males: Number(form.weaned_males) || 0,
      weaned_males_cage: form.weaned_males_cage || null,
      weaned_females: Number(form.weaned_females) || 0,
      weaned_females_cage: form.weaned_females_cage || null,
      notes: form.notes || null,
      litter_mating_date: form.litter_mating_date || null,
      litter_control_date: form.litter_control_date || null,
      litter_expected_birth: form.litter_expected_birth || null,
      actual_male_id: form.actual_male_id || null,
      actual_female_id: form.actual_female_id || null,
      nestbox_date: form.nestbox_date || null,
    });
    if (error) {
      setError("Помилка збереження");
    } else {
      if (form.weaned_date) {
        const breed = getBreedForFattening(
          mating,
          form.actual_male_id,
          form.actual_female_id,
        );
        await createFatteningRecords(
          form.birth_date,
          breed,
          Number(form.weaned_males) || 0,
          form.weaned_males_cage || "",
          Number(form.weaned_females) || 0,
          form.weaned_females_cage || "",
        );
      }
      setLitterForms({ ...litterForms, [matingId]: emptyLitterForm });
      setShowLitterForm({ ...showLitterForm, [matingId]: false });
      fetchMatings();
    }
    setSaving(false);
  }

  async function handleDeleteMating(id: string) {
    if (!confirm("Видалити злучку? Окроли залишаться в базі.")) return;
    await supabase.from("matings").delete().eq("id", id);
    fetchMatings();
  }

  async function handleDeleteLitter(id: string) {
    if (!confirm("Видалити окріл?")) return;
    await supabase.from("litters").delete().eq("id", id);
    fetchMatings();
  }

  function getLitterAge(birthDate: string) {
    const birth = new Date(birthDate);
    const today = new Date();
    const days = Math.floor(
      (today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24),
    );
    const months = Math.floor(days / 30);
    const remDays = days - months * 30;
    return months >= 1
      ? remDays > 0
        ? `${months} міс. ${remDays} дн.`
        : `${months} міс.`
      : `${days} дн.`;
  }

  function getWeaningInfo(birthDate: string) {
    const birth = new Date(birthDate);
    const weaningDate = new Date(birth);
    weaningDate.setDate(weaningDate.getDate() + 60);
    const today = new Date();
    const daysLeft = Math.ceil(
      (weaningDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
    return { daysLeft, weaningDate };
  }

  function getNestboxStatus(
    matingDateStr: string,
    nestboxDate?: string | null,
  ) {
    if (nestboxDate) {
      return {
        text: `✅ Маточник підготовлено: ${new Date(nestboxDate).toLocaleDateString("uk-UA")}`,
        className: "nestbox-done",
      };
    }

    const matingDate = new Date(matingDateStr);
    const targetDate = new Date(matingDate);
    targetDate.setDate(targetDate.getDate() + 26); // 26-й день — за 5 днів до окролу (Merck VM: окріл 28–35 дн., найчастіше 31)

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil(
      (targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    let text = `📥 Підготувати маточник: ${targetDate.toLocaleDateString("uk-UA")}`;
    let className = "nestbox-normal";

    if (diffDays >= 3 && diffDays <= 5) {
      text = `🟢 Підготувати маточник (через ${diffDays} дн.)`;
      className = "nestbox-green";
    } else if (diffDays === 2) {
      text = `🟡 Підготувати маточник через 2 дні!`;
      className = "nestbox-yellow";
    } else if (diffDays === 1) {
      text = `🔴 Підготувати маточник завтра!`;
      className = "nestbox-red";
    } else if (diffDays === 0) {
      text = `🚨 СЬОГОДНІ підготувати маточник!`;
      className = "nestbox-red-alert";
    } else if (diffDays < 0 && diffDays >= -5) {
      text = `⚠️ Підготовка маточника запізнилась на ${Math.abs(diffDays)} дн.!`;
      className = "nestbox-red-alert";
    }

    return { text, className };
  }

  function renderParentSelects(
    maleValue: string,
    femaleValue: string,
    onMaleChange: (v: string) => void,
    onFemaleChange: (v: string) => void,
    mating: Mating,
  ) {
    return (
      <>
        <div className="matings-form-field">
          <label>Коєць цього окролу ♂</label>
          <select
            value={maleValue}
            onChange={(e) => onMaleChange(e.target.value)}
          >
            <option value="">
              {mating.male?.name
                ? `За замовч.: ${mating.male.name}${mating.male.breed ? ` (${mating.male.breed})` : ""}`
                : "Оберіть коєця"}
            </option>
            {allMales.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
                {r.breed ? ` (${r.breed})` : ""}
                {r.cage_number ? ` кл.${r.cage_number}` : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="matings-form-field">
          <label>Крольчиха цього окролу ♀</label>
          <select
            value={femaleValue}
            onChange={(e) => onFemaleChange(e.target.value)}
          >
            <option value="">
              {mating.female?.name
                ? `За замовч.: ${mating.female.name}${mating.female.breed ? ` (${mating.female.breed})` : ""}`
                : "Оберіть крольчиху"}
            </option>
            {allFemales.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
                {r.breed ? ` (${r.breed})` : ""}
                {r.cage_number ? ` кл.${r.cage_number}` : ""}
              </option>
            ))}
          </select>
        </div>
      </>
    );
  }

  return (
    <div className="matings-page">
      <div className="matings-header">
        <h1>🐇 Розведення</h1>
        <button
          className="matings-back-btn"
          onClick={() => navigate("/registry")}
        >
          {"⬅"} Мої кролики
        </button>
      </div>

      <button
        className="matings-add-btn"
        onClick={() => setShowMatingForm(!showMatingForm)}
      >
        {showMatingForm ? "✕ Скасувати" : "+ Додати злучку"}
      </button>

      {showMatingForm && (
        <div className="matings-form">
          <div className="matings-form-grid">
            <div className="matings-form-field">
              <label>Коєць ♂</label>
              <select
                value={matingForm.male_id}
                onChange={(e) =>
                  setMatingForm({ ...matingForm, male_id: e.target.value })
                }
              >
                <option value="">Оберіть коєця</option>
                {allMales.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                    {r.breed ? ` (${r.breed})` : ""}
                    {r.cage_number ? ` кл.${r.cage_number}` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="matings-form-field">
              <label>Крольчиха ♀</label>
              <select
                value={matingForm.female_id}
                onChange={(e) =>
                  setMatingForm({ ...matingForm, female_id: e.target.value })
                }
              >
                <option value="">Оберіть крольчиху</option>
                {allFemales.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                    {r.breed ? ` (${r.breed})` : ""}
                    {r.cage_number ? ` кл.${r.cage_number}` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="matings-form-field">
              <label>Клітка коєця</label>
              <input
                placeholder="№"
                value={matingForm.male_cage}
                onChange={(e) =>
                  setMatingForm({ ...matingForm, male_cage: e.target.value })
                }
              />
            </div>
            <div className="matings-form-field">
              <label>Клітка крольчихи</label>
              <input
                placeholder="№"
                value={matingForm.female_cage}
                onChange={(e) =>
                  setMatingForm({ ...matingForm, female_cage: e.target.value })
                }
              />
            </div>
            <div className="matings-form-field">
              <label>Дата злучки *</label>
              <input
                type="date"
                value={matingForm.mating_date}
                onChange={(e) => handleMatingDateChange(e.target.value)}
              />
            </div>
            <div className="matings-form-field">
              <label>Контрольна дата</label>
              <input
                type="date"
                value={matingForm.control_date}
                onChange={(e) =>
                  setMatingForm({ ...matingForm, control_date: e.target.value })
                }
              />
            </div>
            <input
              placeholder="Нотатки"
              value={matingForm.notes}
              onChange={(e) =>
                setMatingForm({ ...matingForm, notes: e.target.value })
              }
              className="matings-form-full"
            />
          </div>
          {error && <p className="matings-error">{error}</p>}
          <button
            className="matings-save-btn"
            onClick={handleAddMating}
            disabled={
              saving ||
              !matingForm.female_id ||
              !matingForm.male_id ||
              !matingForm.mating_date
            }
          >
            {saving ? "Збереження..." : "Зберегти"}
          </button>
        </div>
      )}

      <div className="matings-sort-bar">
        <span className="matings-sort-label">Сортування:</span>
        <button
          className={`matings-sort-btn${sortType === "date_desc" ? " active" : ""}`}
          onClick={() => setSortType("date_desc")}
        >
          📅 Дата ↓
        </button>
        <button
          className={`matings-sort-btn${sortType === "date_asc" ? " active" : ""}`}
          onClick={() => setSortType("date_asc")}
        >
          📅 Дата ↑
        </button>
        <button
          className={`matings-sort-btn${sortType === "male" ? " active" : ""}`}
          onClick={() => setSortType("male")}
        >
          🏠 За кліткою
        </button>
      </div>

      <div className="matings-list">
        {sortedMatings.length === 0 ? (
          <div className="matings-empty-state">
            <div className="matings-empty-illustration">🐇</div>
            <h3 className="matings-empty-title">Злучок ще немає</h3>
            <p className="matings-empty-desc">
              Додайте першу злучку — вкажіть коєця, крольчиху і дату. Система
              автоматично розрахує контрольну дату і нагадає про маточник.
            </p>
          </div>
        ) : (
          sortedMatings.map((m) => (
            <div key={m.id} className="mating-card">
              <div className="mating-card-top">
                <span className="mating-pair">
                  ♀ {m.female?.name}
                  {m.female?.breed ? ` (${m.female.breed})` : ""} {"×"} ♂{" "}
                  {m.male?.name}
                  {m.male?.breed ? ` (${m.male.breed})` : ""}
                </span>
                <div className="mating-card-btns">
                  <button
                    className="mating-edit-btn"
                    onClick={() => {
                      if (editingMatingId === m.id) {
                        setEditingMatingId(null);
                        setEditingMatingData(null);
                      } else {
                        setEditingMatingId(m.id);
                        setEditingMatingData({ ...m });
                      }
                    }}
                  >
                    {editingMatingId === m.id ? "✕" : "Редагувати"}
                  </button>
                  <button
                    className="mating-delete-btn"
                    onClick={() => handleDeleteMating(m.id)}
                  >
                    Видалити
                  </button>
                </div>
              </div>

              <div className="mating-dates">
                <span>
                  📅 Злучка:{" "}
                  <strong>
                    {new Date(m.mating_date).toLocaleDateString("uk-UA")}
                  </strong>
                </span>
                {m.control_date && (
                  <span>
                    🔍 Контроль:{" "}
                    <strong>
                      {new Date(m.control_date).toLocaleDateString("uk-UA")}
                    </strong>
                  </span>
                )}
                {m.expected_birth && (
                  <span>
                    🗓 Очік. окріл:{" "}
                    <strong>
                      {new Date(m.expected_birth).toLocaleDateString("uk-UA")}
                    </strong>
                  </span>
                )}
                {m.male_cage && (
                  <span>
                    🏠 Коєць кл.: <strong>{m.male_cage}</strong>
                  </span>
                )}
                {m.female_cage && (
                  <span>
                    🏠 Крольчиха кл.: <strong>{m.female_cage}</strong>
                  </span>
                )}
              </div>

              {m.notes && <p className="mating-notes">{m.notes}</p>}

              {editingMatingId === m.id && editingMatingData && (
                <div className="matings-form matings-edit-form">
                  <h3>✏️ Редагування злучки</h3>
                  <div className="matings-form-grid">
                    <div className="matings-form-field">
                      <label>Коєць ♂</label>
                      <select
                        value={editingMatingData.male_id}
                        onChange={(e) =>
                          setEditingMatingData({
                            ...editingMatingData,
                            male_id: e.target.value,
                          })
                        }
                      >
                        <option value="">Оберіть коєця</option>
                        {allMales.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                            {r.breed ? ` (${r.breed})` : ""}
                            {r.cage_number ? ` кл.${r.cage_number}` : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="matings-form-field">
                      <label>Крольчиха ♀</label>
                      <select
                        value={editingMatingData.female_id}
                        onChange={(e) =>
                          setEditingMatingData({
                            ...editingMatingData,
                            female_id: e.target.value,
                          })
                        }
                      >
                        <option value="">Оберіть крольчиху</option>
                        {allFemales.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                            {r.breed ? ` (${r.breed})` : ""}
                            {r.cage_number ? ` кл.${r.cage_number}` : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="matings-form-field">
                      <label>Клітка коєця</label>
                      <input
                        placeholder="№"
                        value={editingMatingData.male_cage || ""}
                        onChange={(e) =>
                          setEditingMatingData({
                            ...editingMatingData,
                            male_cage: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="matings-form-field">
                      <label>Клітка крольчихи</label>
                      <input
                        placeholder="№"
                        value={editingMatingData.female_cage || ""}
                        onChange={(e) =>
                          setEditingMatingData({
                            ...editingMatingData,
                            female_cage: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="matings-form-field">
                      <label>Дата злучки</label>
                      <input
                        type="date"
                        value={editingMatingData.mating_date}
                        onChange={(e) =>
                          setEditingMatingData({
                            ...editingMatingData,
                            mating_date: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="matings-form-field">
                      <label>Контрольна дата</label>
                      <input
                        type="date"
                        value={editingMatingData.control_date || ""}
                        onChange={(e) =>
                          setEditingMatingData({
                            ...editingMatingData,
                            control_date: e.target.value,
                          })
                        }
                      />
                    </div>
                    <input
                      placeholder="Нотатки"
                      value={editingMatingData.notes || ""}
                      onChange={(e) =>
                        setEditingMatingData({
                          ...editingMatingData,
                          notes: e.target.value,
                        })
                      }
                      className="matings-form-full"
                    />
                  </div>
                  {error && <p className="matings-error">{error}</p>}
                  <div className="matings-edit-actions">
                    <button
                      className="matings-cancel-btn"
                      onClick={() => {
                        setEditingMatingId(null);
                        setEditingMatingData(null);
                      }}
                    >
                      Скасувати
                    </button>
                    <button
                      className="matings-save-btn"
                      onClick={handleEditMating}
                      disabled={
                        saving ||
                        !editingMatingData.male_id ||
                        !editingMatingData.female_id
                      }
                    >
                      {saving ? "Збереження..." : "Зберегти зміни"}
                    </button>
                  </div>
                </div>
              )}

              {(m.litters || []).map((l) => {
                const hasBirth = !!l.birth_date;
                const weanInfo = hasBirth ? getWeaningInfo(l.birth_date) : null;
                return (
                  <div key={l.id} className="litter-block">
                    <div className="litter-block-row">
                      <span>
                        📦 Окріл:{" "}
                        <strong>
                          {hasBirth
                            ? new Date(l.birth_date).toLocaleDateString("uk-UA")
                            : "очікується"}
                        </strong>
                      </span>
                      <div className="litter-block-btns">
                        <button
                          className="mating-edit-btn"
                          onClick={() => {
                            if (editingLitterId === l.id) {
                              setEditingLitterId(null);
                              setEditingLitterData(null);
                            } else {
                              setEditingLitterId(l.id);
                              setEditingLitterData({ ...l });
                            }
                          }}
                        >
                          {editingLitterId === l.id ? "✕" : "✏️"}
                        </button>
                        <button
                          className="litter-delete-btn"
                          onClick={() => handleDeleteLitter(l.id)}
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {/* Фактичні батьки якщо відрізняються від злучки */}
                    {(l.actual_male_id || l.actual_female_id) && (
                      <div className="litter-actual-parents">
                        {l.actual_male_id && (
                          <span>♂ {getRabbitName(l.actual_male_id)}</span>
                        )}
                        {l.actual_female_id && (
                          <span>♀ {getRabbitName(l.actual_female_id)}</span>
                        )}
                      </div>
                    )}

                    {(l.litter_mating_date ||
                      l.litter_control_date ||
                      l.litter_expected_birth) && (
                      <div className="litter-mating-info">
                        {l.litter_mating_date && (
                          <span>
                            📅 Злучка:{" "}
                            <strong>
                              {new Date(
                                l.litter_mating_date,
                              ).toLocaleDateString("uk-UA")}
                            </strong>
                          </span>
                        )}
                        {l.litter_control_date && (
                          <span>
                            🔍 Контрольна:{" "}
                            <strong>
                              {new Date(
                                l.litter_control_date,
                              ).toLocaleDateString("uk-UA")}
                            </strong>
                          </span>
                        )}

                        {/* АВТОМАТИЧНЕ НАГАДУВАННЯ ПРО РОДІЛКУ — лише поки немає окролу */}
                        {!hasBirth &&
                          l.litter_mating_date &&
                          (() => {
                            const { text, className } = getNestboxStatus(
                              l.litter_mating_date,
                              l.nestbox_date,
                            );
                            return (
                              <span className={`nestbox-status ${className}`}>
                                {text}
                              </span>
                            );
                          })()}

                        {/* Кнопка "Поставив маточник" — лише поки немає окролу */}
                        {!hasBirth &&
                          l.litter_mating_date &&
                          !l.nestbox_date && (
                            <button
                              className="nestbox-done-btn"
                              onClick={async () => {
                                const today = new Date()
                                  .toISOString()
                                  .split("T")[0];
                                await supabase
                                  .from("litters")
                                  .update({ nestbox_date: today })
                                  .eq("id", l.id);
                                fetchMatings();
                              }}
                            >
                              ✅ Маточник підготовлено
                            </button>
                          )}

                        {/* Якщо маточник вже стоїть (навіть після окролу) — просто показати дату */}
                        {hasBirth && l.nestbox_date && (
                          <span>
                            ✅ Маточник:{" "}
                            <strong>
                              {new Date(l.nestbox_date).toLocaleDateString(
                                "uk-UA",
                              )}
                            </strong>
                          </span>
                        )}

                        {l.litter_expected_birth && (
                          <span>
                            🗓 Очік. окріл:{" "}
                            <strong>
                              {new Date(
                                l.litter_expected_birth,
                              ).toLocaleDateString("uk-UA")}
                            </strong>
                          </span>
                        )}
                      </div>
                    )}

                    {hasBirth && (
                      <div className="litter-stats">
                        <span>
                          Народилось: <strong>{l.total_born}</strong>
                        </span>
                        <span>
                          Живих: <strong>{l.alive}</strong>
                        </span>
                        <span>
                          Мертвих: <strong>{l.dead}</strong>
                        </span>
                      </div>
                    )}

                    {hasBirth && weanInfo && !l.weaned_date && (
                      <div className="litter-age-row">
                        <span className="litter-age">
                          Вік: <strong>{getLitterAge(l.birth_date)}</strong>
                        </span>
                        {weanInfo.daysLeft <= 0 && (
                          <span className="litter-weaning-alert">
                            ✂️ Час відлучення!
                          </span>
                        )}
                        {weanInfo.daysLeft > 0 && weanInfo.daysLeft <= 7 && (
                          <span className="litter-weaning-soon">
                            ✂️ Відлучення через {weanInfo.daysLeft} дн.
                          </span>
                        )}
                        {weanInfo.daysLeft > 7 && (
                          <span className="litter-weaning-info">
                            ✂️ Відлучення:{" "}
                            {weanInfo.weaningDate.toLocaleDateString("uk-UA")}
                          </span>
                        )}
                      </div>
                    )}

                    {l.weaned_date && (
                      <div className="litter-weaned">
                        <span>
                          ✂️ Відлучено:{" "}
                          <strong>
                            {new Date(l.weaned_date).toLocaleDateString(
                              "uk-UA",
                            )}
                          </strong>
                        </span>
                        {l.weaned_males > 0 && (
                          <span>
                            ♂ {l.weaned_males} гол. → кл. {l.weaned_males_cage}
                          </span>
                        )}
                        {l.weaned_females > 0 && (
                          <span>
                            ♀ {l.weaned_females} гол. → кл.{" "}
                            {l.weaned_females_cage}
                          </span>
                        )}
                      </div>
                    )}

                    {l.notes && <p className="mating-notes">{l.notes}</p>}

                    {editingLitterId === l.id && editingLitterData && (
                      <div className="matings-form matings-edit-form">
                        <h3>✏️ Редагування окролу</h3>
                        <div className="matings-form-grid">
                          {renderParentSelects(
                            editingLitterData.actual_male_id || "",
                            editingLitterData.actual_female_id || "",
                            (v) =>
                              setEditingLitterData({
                                ...editingLitterData,
                                actual_male_id: v,
                              }),
                            (v) =>
                              setEditingLitterData({
                                ...editingLitterData,
                                actual_female_id: v,
                              }),
                            m,
                          )}
                          <div className="matings-form-field">
                            <label>Злучка</label>
                            <input
                              type="date"
                              value={editingLitterData.litter_mating_date || ""}
                              onChange={(e) =>
                                setEditingLitterData({
                                  ...editingLitterData,
                                  litter_mating_date: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="matings-form-field">
                            <label>Контрольна</label>
                            <input
                              type="date"
                              value={
                                editingLitterData.litter_control_date || ""
                              }
                              onChange={(e) =>
                                setEditingLitterData({
                                  ...editingLitterData,
                                  litter_control_date: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="matings-form-field">
                            <label>Очікуваний окріл</label>
                            <input
                              type="date"
                              value={
                                editingLitterData.litter_expected_birth || ""
                              }
                              onChange={(e) =>
                                setEditingLitterData({
                                  ...editingLitterData,
                                  litter_expected_birth: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="matings-form-field">
                            <label>Маточник встановлено</label>
                            <input
                              type="date"
                              value={editingLitterData.nestbox_date || ""}
                              onChange={(e) =>
                                setEditingLitterData({
                                  ...editingLitterData,
                                  nestbox_date: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="matings-form-field">
                            <label>Дата окролу</label>
                            <input
                              type="date"
                              value={editingLitterData.birth_date || ""}
                              onChange={(e) =>
                                setEditingLitterData({
                                  ...editingLitterData,
                                  birth_date: e.target.value,
                                })
                              }
                            />
                          </div>
                          <input
                            type="number"
                            placeholder="Народилось всього"
                            value={editingLitterData.total_born || ""}
                            onChange={(e) =>
                              setEditingLitterData({
                                ...editingLitterData,
                                total_born: Number(e.target.value),
                              })
                            }
                          />
                          <input
                            type="number"
                            placeholder="Живих"
                            value={editingLitterData.alive || ""}
                            onChange={(e) =>
                              setEditingLitterData({
                                ...editingLitterData,
                                alive: Number(e.target.value),
                              })
                            }
                          />
                          <input
                            type="number"
                            placeholder="Мертвих"
                            value={editingLitterData.dead || ""}
                            onChange={(e) =>
                              setEditingLitterData({
                                ...editingLitterData,
                                dead: Number(e.target.value),
                              })
                            }
                          />
                          <div></div>
                          <div className="matings-form-field">
                            <label>Дата відлучення</label>
                            <input
                              type="date"
                              value={editingLitterData.weaned_date || ""}
                              onChange={(e) =>
                                setEditingLitterData({
                                  ...editingLitterData,
                                  weaned_date: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div></div>
                          <input
                            type="number"
                            placeholder="♂ Кількість самців"
                            value={editingLitterData.weaned_males || ""}
                            onChange={(e) =>
                              setEditingLitterData({
                                ...editingLitterData,
                                weaned_males: Number(e.target.value),
                              })
                            }
                          />
                          <input
                            placeholder="♂ Клітка / куди"
                            value={editingLitterData.weaned_males_cage || ""}
                            onChange={(e) =>
                              setEditingLitterData({
                                ...editingLitterData,
                                weaned_males_cage: e.target.value,
                              })
                            }
                          />
                          <input
                            type="number"
                            placeholder="♀ Кількість самиць"
                            value={editingLitterData.weaned_females || ""}
                            onChange={(e) =>
                              setEditingLitterData({
                                ...editingLitterData,
                                weaned_females: Number(e.target.value),
                              })
                            }
                          />
                          <input
                            placeholder="♀ Клітка / куди"
                            value={editingLitterData.weaned_females_cage || ""}
                            onChange={(e) =>
                              setEditingLitterData({
                                ...editingLitterData,
                                weaned_females_cage: e.target.value,
                              })
                            }
                          />
                          <input
                            placeholder="Нотатки"
                            value={editingLitterData.notes || ""}
                            onChange={(e) =>
                              setEditingLitterData({
                                ...editingLitterData,
                                notes: e.target.value,
                              })
                            }
                            className="matings-form-full"
                          />
                        </div>
                        {error && <p className="matings-error">{error}</p>}
                        <div className="matings-edit-actions">
                          <button
                            className="matings-cancel-btn"
                            onClick={() => {
                              setEditingLitterId(null);
                              setEditingLitterData(null);
                            }}
                          >
                            Скасувати
                          </button>
                          <button
                            className="matings-save-btn"
                            onClick={() => handleEditLitter(m)}
                            disabled={saving}
                          >
                            {saving ? "Збереження..." : "Зберегти зміни"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              <button
                className="litter-add-btn"
                onClick={() =>
                  setShowLitterForm({
                    ...showLitterForm,
                    [m.id]: !showLitterForm[m.id],
                  })
                }
              >
                {showLitterForm[m.id] ? "✕ Скасувати" : "+ Додати окріл"}
              </button>

              {showLitterForm[m.id] && (
                <div className="litter-form">
                  <div className="matings-form-grid">
                    {renderParentSelects(
                      litterForms[m.id]?.actual_male_id || "",
                      litterForms[m.id]?.actual_female_id || "",
                      (v) =>
                        setLitterForms({
                          ...litterForms,
                          [m.id]: {
                            ...(litterForms[m.id] || emptyLitterForm),
                            actual_male_id: v,
                          },
                        }),
                      (v) =>
                        setLitterForms({
                          ...litterForms,
                          [m.id]: {
                            ...(litterForms[m.id] || emptyLitterForm),
                            actual_female_id: v,
                          },
                        }),
                      m,
                    )}
                    <div className="matings-form-field">
                      <label>Злучка</label>
                      <input
                        type="date"
                        value={litterForms[m.id]?.litter_mating_date || ""}
                        onChange={(e) =>
                          handleLitterMatingDateChange(m.id, e.target.value)
                        }
                      />
                    </div>
                    <div className="matings-form-field">
                      <label>Контрольна</label>
                      <input
                        type="date"
                        value={litterForms[m.id]?.litter_control_date || ""}
                        onChange={(e) =>
                          setLitterForms({
                            ...litterForms,
                            [m.id]: {
                              ...(litterForms[m.id] || emptyLitterForm),
                              litter_control_date: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="matings-form-field">
                      <label>Очікуваний окріл</label>
                      <input
                        type="date"
                        value={litterForms[m.id]?.litter_expected_birth || ""}
                        onChange={(e) =>
                          setLitterForms({
                            ...litterForms,
                            [m.id]: {
                              ...(litterForms[m.id] || emptyLitterForm),
                              litter_expected_birth: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="matings-form-field">
                      <label>Маточник встановлено</label>
                      <input
                        type="date"
                        value={litterForms[m.id]?.nestbox_date || ""}
                        onChange={(e) =>
                          setLitterForms({
                            ...litterForms,
                            [m.id]: {
                              ...(litterForms[m.id] || emptyLitterForm),
                              nestbox_date: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="matings-form-field">
                      <label>Дата окролу</label>
                      <input
                        type="date"
                        value={litterForms[m.id]?.birth_date || ""}
                        onChange={(e) =>
                          setLitterForms({
                            ...litterForms,
                            [m.id]: {
                              ...(litterForms[m.id] || emptyLitterForm),
                              birth_date: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <input
                      type="number"
                      placeholder="Народилось всього"
                      value={litterForms[m.id]?.total_born || ""}
                      onChange={(e) =>
                        setLitterForms({
                          ...litterForms,
                          [m.id]: {
                            ...(litterForms[m.id] || emptyLitterForm),
                            total_born: e.target.value,
                          },
                        })
                      }
                    />
                    <input
                      type="number"
                      placeholder="Живих"
                      value={litterForms[m.id]?.alive || ""}
                      onChange={(e) =>
                        setLitterForms({
                          ...litterForms,
                          [m.id]: {
                            ...(litterForms[m.id] || emptyLitterForm),
                            alive: e.target.value,
                          },
                        })
                      }
                    />
                    <input
                      type="number"
                      placeholder="Мертвих"
                      value={litterForms[m.id]?.dead || ""}
                      onChange={(e) =>
                        setLitterForms({
                          ...litterForms,
                          [m.id]: {
                            ...(litterForms[m.id] || emptyLitterForm),
                            dead: e.target.value,
                          },
                        })
                      }
                    />
                    <div></div>
                    <div className="matings-form-field">
                      <label>Дата відлучення</label>
                      <input
                        type="date"
                        value={litterForms[m.id]?.weaned_date || ""}
                        onChange={(e) =>
                          setLitterForms({
                            ...litterForms,
                            [m.id]: {
                              ...(litterForms[m.id] || emptyLitterForm),
                              weaned_date: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div></div>
                    <input
                      type="number"
                      placeholder="♂ Кількість самців"
                      value={litterForms[m.id]?.weaned_males || ""}
                      onChange={(e) =>
                        setLitterForms({
                          ...litterForms,
                          [m.id]: {
                            ...(litterForms[m.id] || emptyLitterForm),
                            weaned_males: e.target.value,
                          },
                        })
                      }
                    />
                    <input
                      placeholder="♂ Клітка / куди"
                      value={litterForms[m.id]?.weaned_males_cage || ""}
                      onChange={(e) =>
                        setLitterForms({
                          ...litterForms,
                          [m.id]: {
                            ...(litterForms[m.id] || emptyLitterForm),
                            weaned_males_cage: e.target.value,
                          },
                        })
                      }
                    />
                    <input
                      type="number"
                      placeholder="♀ Кількість самиць"
                      value={litterForms[m.id]?.weaned_females || ""}
                      onChange={(e) =>
                        setLitterForms({
                          ...litterForms,
                          [m.id]: {
                            ...(litterForms[m.id] || emptyLitterForm),
                            weaned_females: e.target.value,
                          },
                        })
                      }
                    />
                    <input
                      placeholder="♀ Клітка / куди"
                      value={litterForms[m.id]?.weaned_females_cage || ""}
                      onChange={(e) =>
                        setLitterForms({
                          ...litterForms,
                          [m.id]: {
                            ...(litterForms[m.id] || emptyLitterForm),
                            weaned_females_cage: e.target.value,
                          },
                        })
                      }
                    />
                    <input
                      placeholder="Нотатки"
                      value={litterForms[m.id]?.notes || ""}
                      onChange={(e) =>
                        setLitterForms({
                          ...litterForms,
                          [m.id]: {
                            ...(litterForms[m.id] || emptyLitterForm),
                            notes: e.target.value,
                          },
                        })
                      }
                      className="matings-form-full"
                    />
                  </div>
                  {error && <p className="matings-error">{error}</p>}
                  <button
                    className="matings-save-btn"
                    onClick={() => handleAddLitter(m.id, m)}
                    disabled={saving}
                  >
                    {saving ? "Збереження..." : "Зберегти окріл"}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      {/* ── ЗНОСКА: терміни розведення ── */}
      <div className="matings-info">
        <button
          className="matings-info-toggle"
          onClick={() => setShowInfo(!showInfo)}
        >
          <span>📋 Ключові терміни розведення</span>
          <span>{showInfo ? "▲" : "▼"}</span>
        </button>

        {showInfo && (
          <>
            <div className="matings-info-grid">
              <div className="matings-info-item">
                <span className="matings-info-icon">📅</span>
                <div>
                  <strong>Тривалість вагітності</strong>
                  <span>28–35 днів, найчастіше 31 день</span>
                  <span>
                    Окріл до 28 дня — передчасний, після 35 — патологія
                  </span>
                </div>
              </div>
              <div className="matings-info-item">
                <span className="matings-info-icon">🔍</span>
                <div>
                  <strong>Контрольна злучка / пальпація</strong>
                  <span>10–14 день після злучки</span>
                  <span>
                    Пальпація живота — досвідчений кролівник відчує плоди
                    розміром з горошину
                  </span>
                </div>
              </div>
              <div className="matings-info-item">
                <span className="matings-info-icon">🏠</span>
                <div>
                  <strong>Підготовка маточника</strong>
                  <span>26–28 день після злучки</span>
                  <span>
                    Самка починає будувати гніздо і вищипує пух — маточник має
                    бути готовий заздалегідь
                  </span>
                </div>
              </div>
              <div className="matings-info-item">
                <span className="matings-info-icon">✂️</span>
                <div>
                  <strong>Відлучення крільченят</strong>
                  <span>Не раніше 28 днів, оптимально 35–42 дні</span>
                  <span>
                    Раннє відлучення до 28 днів — високий ризик ентериту та
                    загибелі молодняку
                  </span>
                </div>
              </div>
              <div className="matings-info-item">
                <span className="matings-info-icon">🔁</span>
                <div>
                  <strong>Наступна злучка</strong>
                  <span>
                    Напівінтенсивна схема: через 10–14 днів після окролу
                  </span>
                  <span>Екстенсивна схема: після відлучення (35–42 дні)</span>
                </div>
              </div>
              <div className="matings-info-item">
                <span className="matings-info-icon">⚠️</span>
                <div>
                  <strong>Псевдовагітність</strong>
                  <span>Триває 16–18 днів після хибної овуляції</span>
                  <span>
                    Самка будує гніздо але окролу немає — повторна злучка після
                    18–20 дня
                  </span>
                </div>
              </div>
            </div>

            <div className="matings-info-warning">
              ⚠️ <strong>Важливо:</strong> Не допускайте злучки самки раніше ніж
              через 10 днів після окролу — матка потребує відновлення. При
              інтенсивній схемі (злучка на 1–2 день після окролу) різко зростає
              ризик виснаження самки і загибелі послідуючих пометів.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
