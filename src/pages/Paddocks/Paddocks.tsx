import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import "./Paddocks.css";

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

interface PaddockFemale {
  id: string;
  rabbit_id: string | null;
  name: string | null;
  breed: string | null;
  birth_year: string | null;
  rabbit: { name: string; breed: string } | null;
}

interface PaddockLitter {
  id: string;
  birth_date: string;
  females_birthed: number;
  total_born: number;
  alive: number;
  dead: number;
  weaned_date: string;
  weaned_males: number;
  weaned_females: number;
  notes: string;
  paddock_mating_id: string;
}

interface PaddockMating {
  id: string;
  mating_date: string;
  control_date: string;
  expected_birth: string;
  notes: string;
  litters?: PaddockLitter[];
}

interface Paddock {
  id: string;
  name: string;
  notes: string;
  is_active: boolean;
  male: { name: string; breed: string; cage_number: string } | null;
  females?: PaddockFemale[];
  matings?: PaddockMating[];
}

const emptyPaddockForm = {
  name: "",
  male_id: "",
  notes: "",
};

const emptyMatingForm = {
  mating_date: "",
  control_date: "",
  notes: "",
};

const emptyLitterForm = {
  birth_date: "",
  females_birthed: "",
  total_born: "",
  alive: "",
  dead: "",
  weaned_date: "",
  weaned_males: "",
  weaned_females: "",
  notes: "",
};

const emptyFemaleForm = {
  name: "",
  breed: "",
  birth_year: "",
};

export default function Paddocks({ session }: Props) {
  const [rabbits, setRabbits] = useState<Rabbit[]>([]);
  const [paddocks, setPaddocks] = useState<Paddock[]>([]);
  const [showPaddockForm, setShowPaddockForm] = useState(false);
  const [paddockForm, setPaddockForm] = useState(emptyPaddockForm);
  const [showMatingForm, setShowMatingForm] = useState<Record<string, boolean>>(
    {},
  );
  const [matingForms, setMatingForms] = useState<
    Record<string, typeof emptyMatingForm>
  >({});
  const [showLitterForm, setShowLitterForm] = useState<Record<string, boolean>>(
    {},
  );
  const [litterForms, setLitterForms] = useState<
    Record<string, typeof emptyLitterForm>
  >({});
  const [femaleForms, setFemaleForms] = useState<
    Record<string, typeof emptyFemaleForm>
  >({});
  const [showFemaleForm, setShowFemaleForm] = useState<Record<string, boolean>>(
    {},
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function fetchPaddocks() {
    const { data } = await supabase
      .from("paddocks")
      .select("*, male:male_id(name, breed, cage_number)")
      .eq("user_id", session.user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    if (!data) return;

    const ids = data.map((p) => p.id);

    const { data: femalesData } = await supabase
      .from("paddock_females")
      .select("*")
      .in("paddock_id", ids);

    const { data: matingsData } = await supabase
      .from("paddock_matings")
      .select("*")
      .in("paddock_id", ids)
      .order("mating_date", { ascending: false });

    const matingIds = (matingsData || []).map((m) => m.id);
    const { data: littersData } = await supabase
      .from("paddock_litters")
      .select("*")
      .in("paddock_mating_id", matingIds);

    const femalesMap: Record<string, PaddockFemale[]> = {};
    (femalesData || []).forEach((f) => {
      if (!femalesMap[f.paddock_id]) femalesMap[f.paddock_id] = [];
      femalesMap[f.paddock_id].push(f);
    });

    const littersMap: Record<string, PaddockLitter[]> = {};
    (littersData || []).forEach((l) => {
      if (!littersMap[l.paddock_mating_id])
        littersMap[l.paddock_mating_id] = [];
      littersMap[l.paddock_mating_id].push(l);
    });

    const matingsMap: Record<string, PaddockMating[]> = {};
    (matingsData || []).forEach((m) => {
      if (!matingsMap[m.paddock_id]) matingsMap[m.paddock_id] = [];
      matingsMap[m.paddock_id].push({ ...m, litters: littersMap[m.id] || [] });
    });

    setPaddocks(
      data.map((p) => ({
        ...p,
        females: femalesMap[p.id] || [],
        matings: matingsMap[p.id] || [],
      })),
    );
  }

  useEffect(() => {
    supabase
      .from("rabbits")
      .select("id, name, breed, gender, cage_number")
      .eq("user_id", session.user.id)
      .eq("is_active", true)
      .then(({ data }) => setRabbits(data || []));

    supabase
      .from("paddocks")
      .select("*, male:male_id(name, breed, cage_number)")
      .eq("user_id", session.user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!data) return;
        const ids = data.map((p) => p.id);
        Promise.all([
          supabase.from("paddock_females").select("*").in("paddock_id", ids),
          supabase
            .from("paddock_matings")
            .select("*")
            .in("paddock_id", ids)
            .order("mating_date", { ascending: false }),
        ]).then(([{ data: femalesData }, { data: matingsData }]) => {
          const matingIds = (matingsData || []).map((m) => m.id);
          supabase
            .from("paddock_litters")
            .select("*")
            .in("paddock_mating_id", matingIds)
            .then(({ data: littersData }) => {
              const femalesMap: Record<string, PaddockFemale[]> = {};
              (femalesData || []).forEach((f) => {
                if (!femalesMap[f.paddock_id]) femalesMap[f.paddock_id] = [];
                femalesMap[f.paddock_id].push(f);
              });
              const littersMap: Record<string, PaddockLitter[]> = {};
              (littersData || []).forEach((l) => {
                if (!littersMap[l.paddock_mating_id])
                  littersMap[l.paddock_mating_id] = [];
                littersMap[l.paddock_mating_id].push(l);
              });
              const matingsMap: Record<string, PaddockMating[]> = {};
              (matingsData || []).forEach((m) => {
                if (!matingsMap[m.paddock_id]) matingsMap[m.paddock_id] = [];
                matingsMap[m.paddock_id].push({
                  ...m,
                  litters: littersMap[m.id] || [],
                });
              });
              setPaddocks(
                data.map((p) => ({
                  ...p,
                  females: femalesMap[p.id] || [],
                  matings: matingsMap[p.id] || [],
                })),
              );
            });
        });
      });
  }, [session.user.id]);

  async function handleAddPaddock() {
    setSaving(true);
    setError("");
    const { error } = await supabase.from("paddocks").insert({
      ...paddockForm,
      user_id: session.user.id,
      male_id: paddockForm.male_id || null,
    });
    if (error) {
      setError("Помилка збереження");
    } else {
      setPaddockForm(emptyPaddockForm);
      setShowPaddockForm(false);
      fetchPaddocks();
    }
    setSaving(false);
  }

  async function handleAddFemale(paddockId: string) {
    const form = femaleForms[paddockId] || emptyFemaleForm;
    if (!form.name.trim()) return;
    await supabase.from("paddock_females").insert({
      paddock_id: paddockId,
      rabbit_id: null,
      name: form.name,
      breed: form.breed || null,
      birth_year: form.birth_year || null,
    });
    setFemaleForms({ ...femaleForms, [paddockId]: emptyFemaleForm });
    setShowFemaleForm({ ...showFemaleForm, [paddockId]: false });
    fetchPaddocks();
  }

  async function handleRemoveFemale(id: string) {
    await supabase.from("paddock_females").delete().eq("id", id);
    fetchPaddocks();
  }

  function handleMatingDateChange(paddockId: string, date: string) {
    if (!date) {
      setMatingForms({
        ...matingForms,
        [paddockId]: {
          ...(matingForms[paddockId] || emptyMatingForm),
          mating_date: date,
          control_date: "",
        },
      });
      return;
    }
    const d = new Date(date);
    d.setDate(d.getDate() + 7);
    const control = d.toISOString().split("T")[0];
    setMatingForms({
      ...matingForms,
      [paddockId]: {
        ...(matingForms[paddockId] || emptyMatingForm),
        mating_date: date,
        control_date: control,
      },
    });
  }

  async function handleAddMating(paddockId: string) {
    setSaving(true);
    setError("");
    const form = matingForms[paddockId] || emptyMatingForm;
    const { error } = await supabase.from("paddock_matings").insert({
      user_id: session.user.id,
      paddock_id: paddockId,
      mating_date: form.mating_date,
      control_date: form.control_date || null,
      notes: form.notes || null,
    });
    if (error) {
      setError("Помилка збереження");
    } else {
      setMatingForms({ ...matingForms, [paddockId]: emptyMatingForm });
      setShowMatingForm({ ...showMatingForm, [paddockId]: false });
      fetchPaddocks();
    }
    setSaving(false);
  }

  async function handleAddLitter(matingId: string) {
    setSaving(true);
    setError("");
    const form = litterForms[matingId] || emptyLitterForm;
    const { error } = await supabase.from("paddock_litters").insert({
      user_id: session.user.id,
      paddock_mating_id: matingId,
      birth_date: form.birth_date,
      females_birthed: Number(form.females_birthed) || 0,
      total_born: Number(form.total_born) || 0,
      alive: Number(form.alive) || 0,
      dead: Number(form.dead) || 0,
      weaned_date: form.weaned_date || null,
      weaned_males: Number(form.weaned_males) || 0,
      weaned_females: Number(form.weaned_females) || 0,
      notes: form.notes || null,
    });
    if (error) {
      setError("Помилка збереження");
    } else {
      setLitterForms({ ...litterForms, [matingId]: emptyLitterForm });
      setShowLitterForm({ ...showLitterForm, [matingId]: false });
      fetchPaddocks();
    }
    setSaving(false);
  }

  async function handleDeletePaddock(id: string) {
    if (!confirm("Видалити загін?")) return;
    await supabase.from("paddocks").update({ is_active: false }).eq("id", id);
    fetchPaddocks();
  }

  async function handleDeleteMating(id: string) {
    if (!confirm("Видалити злучку?")) return;
    await supabase.from("paddock_litters").delete().eq("paddock_mating_id", id);
    await supabase.from("paddock_matings").delete().eq("id", id);
    fetchPaddocks();
  }

  async function handleDeleteLitter(id: string) {
    if (!confirm("Видалити окріл?")) return;
    await supabase.from("paddock_litters").delete().eq("id", id);
    fetchPaddocks();
  }

  const males = rabbits.filter((r) => r.gender === "male");

  return (
    <div className="paddocks-page">
      <div className="paddocks-header">
        <h1>🏠 Підлогове утримання</h1>
        <button
          className="paddocks-back-btn"
          onClick={() => navigate("/registry")}
        >
          ⬅ Мої кролики
        </button>
      </div>

      <button
        className="paddocks-add-btn"
        onClick={() => setShowPaddockForm(!showPaddockForm)}
      >
        {showPaddockForm ? "✕ Скасувати" : "+ Додати загін"}
      </button>

      {showPaddockForm && (
        <div className="paddocks-form">
          <div className="paddocks-form-grid">
            <input
              placeholder="Назва загону *"
              value={paddockForm.name}
              onChange={(e) =>
                setPaddockForm({ ...paddockForm, name: e.target.value })
              }
              className="paddocks-form-full"
            />
            <select
              value={paddockForm.male_id}
              onChange={(e) =>
                setPaddockForm({ ...paddockForm, male_id: e.target.value })
              }
              className="paddocks-form-full"
            >
              <option value="">♂ Коєць (необов'язково)</option>
              {males.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} {r.breed ? `(${r.breed})` : ""}{" "}
                  {r.cage_number ? `кл.${r.cage_number}` : ""}
                </option>
              ))}
            </select>
            <input
              placeholder="Нотатки"
              value={paddockForm.notes}
              onChange={(e) =>
                setPaddockForm({ ...paddockForm, notes: e.target.value })
              }
              className="paddocks-form-full"
            />
          </div>
          {error && <p className="paddocks-error">{error}</p>}
          <button
            className="paddocks-save-btn"
            onClick={handleAddPaddock}
            disabled={saving || !paddockForm.name}
          >
            {saving ? "Збереження..." : "Зберегти"}
          </button>
        </div>
      )}

      <div className="paddocks-list">
        {paddocks.length === 0 ? (
          <p className="paddocks-empty">Загонів ще немає.</p>
        ) : (
          paddocks.map((p) => (
            <div key={p.id} className="paddock-card">
              <div className="paddock-card-top">
                <span className="paddock-name">🏠 {p.name}</span>
                {p.male && (
                  <span className="paddock-male">
                    ♂ {p.male.name} {p.male.breed ? `(${p.male.breed})` : ""}
                  </span>
                )}
                <button
                  className="paddock-delete-btn"
                  onClick={() => handleDeletePaddock(p.id)}
                >
                  Видалити
                </button>
              </div>

              <div className="paddock-females">
                <strong>Самки в загоні:</strong>
                <div className="paddock-females-list">
                  {(p.females || []).map((f) => (
                    <span key={f.id} className="paddock-female-tag">
                      ♀ {f.name} {f.breed ? `(${f.breed})` : ""}{" "}
                      {f.birth_year ? `${f.birth_year} р.` : ""}
                      <button onClick={() => handleRemoveFemale(f.id)}>
                        ✕
                      </button>
                    </span>
                  ))}
                </div>

                <button
                  className="paddock-mating-add-btn"
                  onClick={() =>
                    setShowFemaleForm({
                      ...showFemaleForm,
                      [p.id]: !showFemaleForm[p.id],
                    })
                  }
                >
                  {showFemaleForm[p.id] ? "✕ Скасувати" : "+ Додати самку"}
                </button>

                {showFemaleForm[p.id] && (
                  <div className="paddock-female-form">
                    <div className="paddocks-form-grid">
                      <input
                        placeholder="Кличка / номер *"
                        value={femaleForms[p.id]?.name || ""}
                        onChange={(e) =>
                          setFemaleForms({
                            ...femaleForms,
                            [p.id]: {
                              ...(femaleForms[p.id] || emptyFemaleForm),
                              name: e.target.value,
                            },
                          })
                        }
                      />
                      <input
                        placeholder="Порода"
                        value={femaleForms[p.id]?.breed || ""}
                        onChange={(e) =>
                          setFemaleForms({
                            ...femaleForms,
                            [p.id]: {
                              ...(femaleForms[p.id] || emptyFemaleForm),
                              breed: e.target.value,
                            },
                          })
                        }
                      />
                      <input
                        placeholder="Рік народження"
                        value={femaleForms[p.id]?.birth_year || ""}
                        onChange={(e) =>
                          setFemaleForms({
                            ...femaleForms,
                            [p.id]: {
                              ...(femaleForms[p.id] || emptyFemaleForm),
                              birth_year: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <button
                      className="paddocks-save-btn"
                      onClick={() => handleAddFemale(p.id)}
                      disabled={!femaleForms[p.id]?.name}
                    >
                      Зберегти
                    </button>
                  </div>
                )}
              </div>

              {p.notes && <p className="paddock-notes">{p.notes}</p>}

              {(p.matings || []).map((m) => (
                <div key={m.id} className="paddock-mating">
                  <div className="paddock-mating-top">
                    <div className="paddock-mating-dates">
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
                            {new Date(m.control_date).toLocaleDateString(
                              "uk-UA",
                            )}
                          </strong>
                        </span>
                      )}
                      <span>
                        🗓 Очікуваний окріл:{" "}
                        <strong>
                          {new Date(m.expected_birth).toLocaleDateString(
                            "uk-UA",
                          )}
                        </strong>
                      </span>
                    </div>
                    <button
                      className="paddock-delete-btn"
                      onClick={() => handleDeleteMating(m.id)}
                    >
                      ✕
                    </button>
                  </div>

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
                          Родило самок: <strong>{l.females_birthed}</strong>
                        </span>
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
                              {new Date(l.weaned_date).toLocaleDateString(
                                "uk-UA",
                              )}
                            </strong>
                          </span>
                          {l.weaned_males > 0 && (
                            <span>♂ {l.weaned_males} гол.</span>
                          )}
                          {l.weaned_females > 0 && (
                            <span>♀ {l.weaned_females} гол.</span>
                          )}
                        </div>
                      )}
                      {l.notes && <p className="paddock-notes">{l.notes}</p>}
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
                      <div className="paddocks-form-grid">
                        <div className="paddocks-form-field">
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
                          placeholder="Скільки самок родило"
                          value={litterForms[m.id]?.females_birthed || ""}
                          onChange={(e) =>
                            setLitterForms({
                              ...litterForms,
                              [m.id]: {
                                ...(litterForms[m.id] || emptyLitterForm),
                                females_birthed: e.target.value,
                              },
                            })
                          }
                        />
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
                        <div className="paddocks-form-field">
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
                        <input
                          type="number"
                          placeholder="♂ Відлучено самців"
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
                          type="number"
                          placeholder="♀ Відлучено самиць"
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
                          className="paddocks-form-full"
                        />
                      </div>
                      {error && <p className="paddocks-error">{error}</p>}
                      <button
                        className="paddocks-save-btn"
                        onClick={() => handleAddLitter(m.id)}
                        disabled={saving || !litterForms[m.id]?.birth_date}
                      >
                        {saving ? "Збереження..." : "Зберегти окріл"}
                      </button>
                    </div>
                  )}
                </div>
              ))}

              <button
                className="paddock-mating-add-btn"
                onClick={() =>
                  setShowMatingForm({
                    ...showMatingForm,
                    [p.id]: !showMatingForm[p.id],
                  })
                }
              >
                {showMatingForm[p.id] ? "✕ Скасувати" : "+ Додати злучку"}
              </button>

              {showMatingForm[p.id] && (
                <div className="paddocks-form">
                  <div className="paddocks-form-grid">
                    <div className="paddocks-form-field">
                      <label>Дата злучки *</label>
                      <input
                        type="date"
                        value={matingForms[p.id]?.mating_date || ""}
                        onChange={(e) =>
                          handleMatingDateChange(p.id, e.target.value)
                        }
                      />
                    </div>
                    <div className="paddocks-form-field">
                      <label>Контрольна дата</label>
                      <input
                        type="date"
                        value={matingForms[p.id]?.control_date || ""}
                        onChange={(e) =>
                          setMatingForms({
                            ...matingForms,
                            [p.id]: {
                              ...(matingForms[p.id] || emptyMatingForm),
                              control_date: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <input
                      placeholder="Нотатки"
                      value={matingForms[p.id]?.notes || ""}
                      onChange={(e) =>
                        setMatingForms({
                          ...matingForms,
                          [p.id]: {
                            ...(matingForms[p.id] || emptyMatingForm),
                            notes: e.target.value,
                          },
                        })
                      }
                      className="paddocks-form-full"
                    />
                  </div>
                  {error && <p className="paddocks-error">{error}</p>}
                  <button
                    className="paddocks-save-btn"
                    onClick={() => handleAddMating(p.id)}
                    disabled={saving || !matingForms[p.id]?.mating_date}
                  >
                    {saving ? "Збереження..." : "Зберегти злучку"}
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
