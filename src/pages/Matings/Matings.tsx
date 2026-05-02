import { useEffect, useState } from "react";
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
};

export default function Matings({ session }: Props) {
  const [rabbits, setRabbits] = useState<Rabbit[]>([]);
  const [matings, setMatings] = useState<Mating[]>([]);
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
      .eq("is_active", true)
      .then(({ data }) => {
        if (!cancelled) setRabbits(data || []);
      });

    supabase
      .from("matings")
      .select(
        "*, female:female_id(name, breed, cage_number), male:male_id(name, breed, cage_number)",
      )
      .eq("user_id", session.user.id)
      .order("mating_date", { ascending: false })
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
        setMatings(
          data.map((m) => ({ ...m, litters: littersMap[m.id] || [] })),
        );
      });

    return () => {
      cancelled = true;
    };
  }, [session.user.id, refreshKey]);

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

  async function handleEditLitter() {
    if (!editingLitterData) return;
    setSaving(true);
    setError("");
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
      })
      .eq("id", editingLitterData.id);
    if (error) {
      setError("Помилка збереження");
    } else {
      setEditingLitterId(null);
      setEditingLitterData(null);
      fetchMatings();
    }
    setSaving(false);
  }

  async function handleAddLitter(matingId: string) {
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
    });
    if (error) {
      setError("Помилка збереження");
    } else {
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

  const females = rabbits.filter((r) => r.gender === "female");
  const males = rabbits.filter((r) => r.gender === "male");

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

  return (
    <div className="matings-page">
      <div className="matings-header">
        <h1>🐇 Розведення</h1>
        <button
          className="matings-back-btn"
          onClick={() => navigate("/registry")}
        >
          ⬅ Мої кролики
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
                {males.map((r) => (
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
                {females.map((r) => (
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

      <div className="matings-list">
        {matings.length === 0 ? (
          <p className="matings-empty">Злучок ще немає.</p>
        ) : (
          matings.map((m) => (
            <div key={m.id} className="mating-card">
              <div className="mating-card-top">
                <span className="mating-pair">
                  ♂ {m.male?.name}
                  {m.male?.breed ? ` (${m.male.breed})` : ""} × ♀{" "}
                  {m.female?.name}
                  {m.female?.breed ? ` (${m.female.breed})` : ""}
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
                        {males.map((r) => (
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
                        {females.map((r) => (
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
                        {hasBirth && (
                          <span
                            style={{
                              color: "var(--text-muted, #888)",
                              fontSize: "0.85em",
                              marginLeft: 8,
                            }}
                          >
                            {getLitterAge(l.birth_date)}
                          </span>
                        )}
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

                    {!hasBirth &&
                      (l.litter_mating_date ||
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
                            ♂ {l.weaned_males} гол. → {l.weaned_males_cage}
                          </span>
                        )}
                        {l.weaned_females > 0 && (
                          <span>
                            ♀ {l.weaned_females} гол. → {l.weaned_females_cage}
                          </span>
                        )}
                      </div>
                    )}

                    {l.notes && <p className="mating-notes">{l.notes}</p>}

                    {editingLitterId === l.id && editingLitterData && (
                      <div className="matings-form matings-edit-form">
                        <h3>✏️ Редагування окролу</h3>
                        <div className="matings-form-grid">
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
                            onClick={handleEditLitter}
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
                    onClick={() => handleAddLitter(m.id)}
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
    </div>
  );
}
