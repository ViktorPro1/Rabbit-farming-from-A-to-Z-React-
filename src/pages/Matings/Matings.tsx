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
  female: { name: string };
}

interface Mating {
  id: string;
  mating_date: string;
  control_date: string;
  expected_birth: string;
  notes: string;
  female: { name: string; breed: string; cage_number: string };
  male: { name: string; breed: string; cage_number: string };
  litters?: Litter[];
}

const emptyMatingForm = {
  female_id: "",
  male_id: "",
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
};

export default function Matings({ session }: Props) {
  const [rabbits, setRabbits] = useState<Rabbit[]>([]);
  const [matings, setMatings] = useState<Mating[]>([]);
  const [showMatingForm, setShowMatingForm] = useState(false);
  const [matingForm, setMatingForm] = useState(emptyMatingForm);
  const [litterForms, setLitterForms] = useState<
    Record<string, typeof emptyLitterForm>
  >({});
  const [showLitterForm, setShowLitterForm] = useState<Record<string, boolean>>(
    {},
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    supabase
      .from("rabbits")
      .select("id, name, breed, gender, cage_number")
      .eq("user_id", session.user.id)
      .eq("is_active", true)
      .then(({ data }) => setRabbits(data || []));

    supabase
      .from("matings")
      .select(
        "*, female:female_id(name, breed, cage_number), male:male_id(name, breed, cage_number)",
      )
      .eq("user_id", session.user.id)
      .order("mating_date", { ascending: false })
      .then(({ data }) => {
        if (!data) return;
        const ids = data.map((m) => m.id);
        supabase
          .from("litters")
          .select("*")
          .in("mating_id", ids)
          .then(({ data: littersData }) => {
            const littersMap: Record<string, Litter[]> = {};
            (littersData || []).forEach((l) => {
              if (!littersMap[l.mating_id]) littersMap[l.mating_id] = [];
              littersMap[l.mating_id].push(l);
            });
            setMatings(
              data.map((m) => ({ ...m, litters: littersMap[m.id] || [] })),
            );
          });
      });
  }, [session.user.id]);

  async function fetchMatings() {
    const { data } = await supabase
      .from("matings")
      .select(
        "*, female:female_id(name, breed, cage_number), male:male_id(name, breed, cage_number)",
      )
      .eq("user_id", session.user.id)
      .order("mating_date", { ascending: false });
    if (!data) return;
    const ids = data.map((m) => m.id);
    const { data: littersData } = await supabase
      .from("litters")
      .select("*")
      .in("mating_id", ids);
    const littersMap: Record<string, Litter[]> = {};
    (littersData || []).forEach((l) => {
      if (!littersMap[l.mating_id]) littersMap[l.mating_id] = [];
      littersMap[l.mating_id].push(l);
    });
    setMatings(data.map((m) => ({ ...m, litters: littersMap[m.id] || [] })));
  }

  function handleMatingDateChange(date: string) {
    if (!date) {
      setMatingForm({ ...matingForm, mating_date: date, control_date: "" });
      return;
    }
    const d = new Date(date);
    d.setDate(d.getDate() + 7);
    const control = d.toISOString().split("T")[0];
    setMatingForm({ ...matingForm, mating_date: date, control_date: control });
  }

  async function handleAddMating() {
    setSaving(true);
    setError("");
    const { error } = await supabase.from("matings").insert({
      ...matingForm,
      user_id: session.user.id,
    });
    if (error) {
      setError("Помилка збереження");
    } else {
      setMatingForm(emptyMatingForm);
      setShowMatingForm(false);
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
      birth_date: form.birth_date,
      total_born: Number(form.total_born) || 0,
      alive: Number(form.alive) || 0,
      dead: Number(form.dead) || 0,
      weaned_date: form.weaned_date || null,
      weaned_males: Number(form.weaned_males) || 0,
      weaned_males_cage: form.weaned_males_cage || null,
      weaned_females: Number(form.weaned_females) || 0,
      weaned_females_cage: form.weaned_females_cage || null,
      notes: form.notes || null,
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
    if (!confirm("Видалити злучку?")) return;
    await supabase.from("litters").delete().eq("mating_id", id);
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
            <select
              value={matingForm.male_id}
              onChange={(e) =>
                setMatingForm({ ...matingForm, male_id: e.target.value })
              }
            >
              <option value="">♂ Коєць *</option>
              {males.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} {r.breed ? `(${r.breed})` : ""}{" "}
                  {r.cage_number ? `кл.${r.cage_number}` : ""}
                </option>
              ))}
            </select>
            <select
              value={matingForm.female_id}
              onChange={(e) =>
                setMatingForm({ ...matingForm, female_id: e.target.value })
              }
            >
              <option value="">♀ Кроличка *</option>
              {females.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} {r.breed ? `(${r.breed})` : ""}{" "}
                  {r.cage_number ? `кл.${r.cage_number}` : ""}
                </option>
              ))}
            </select>
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
                  ♂ {m.male?.name} {m.male?.breed ? `(${m.male.breed})` : ""} ×
                  ♀ {m.female?.name}{" "}
                  {m.female?.breed ? `(${m.female.breed})` : ""}
                </span>
                <button
                  className="mating-delete-btn"
                  onClick={() => handleDeleteMating(m.id)}
                >
                  Видалити
                </button>
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
                    🔍 Контрольна:{" "}
                    <strong>
                      {new Date(m.control_date).toLocaleDateString("uk-UA")}
                    </strong>
                  </span>
                )}
                <span>
                  🗓 Очікуваний окріл:{" "}
                  <strong>
                    {new Date(m.expected_birth).toLocaleDateString("uk-UA")}
                  </strong>
                </span>
              </div>

              {m.notes && <p className="mating-notes">{m.notes}</p>}

              {(m.litters || []).map((l) => (
                <div key={l.id} className="litter-block">
                  <div className="litter-block-row">
                    <span>
                      📦 Окріл:{" "}
                      <strong>
                        {new Date(l.birth_date).toLocaleDateString("uk-UA")}
                      </strong>
                    </span>
                    <button
                      className="litter-delete-btn"
                      onClick={() => handleDeleteLitter(l.id)}
                    >
                      ✕
                    </button>
                  </div>
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
                  {l.weaned_date && (
                    <div className="litter-weaned">
                      <span>
                        ✂️ Відлучено:{" "}
                        <strong>
                          {new Date(l.weaned_date).toLocaleDateString("uk-UA")}
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
                </div>
              ))}

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
                      <label>Дата окролу *</label>
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
                    disabled={saving || !litterForms[m.id]?.birth_date}
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
