import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import "./Weighing.css";

interface Props {
  session: Session;
}

type WeighingType = "breeding" | "fattening";

interface WeighingRecord {
  id: string;
  litter_label: string;
  rabbit_name: string;
  weighing_date: string;
  weight_g: number;
  notes: string;
  weighing_type: WeighingType;
}

const emptyForm = {
  litter_label: "",
  rabbit_name: "",
  weighing_date: "",
  weight_g: "",
  notes: "",
  weighing_type: "breeding" as WeighingType,
};

interface MonthlyAvg {
  monthKey: string;
  monthLabel: string;
  avgWeight: number;
  count: number;
}

function getMonthlyAverages(list: WeighingRecord[]): MonthlyAvg[] {
  const map: Record<string, { sum: number; count: number }> = {};
  list.forEach((r) => {
    const d = new Date(r.weighing_date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!map[key]) map[key] = { sum: 0, count: 0 };
    map[key].sum += r.weight_g;
    map[key].count += 1;
  });

  return Object.entries(map)
    .map(([key, { sum, count }]) => {
      const [y, m] = key.split("-");
      const label = new Date(Number(y), Number(m) - 1).toLocaleDateString(
        "uk-UA",
        { month: "long", year: "numeric" },
      );
      return {
        monthKey: key,
        monthLabel: label.charAt(0).toUpperCase() + label.slice(1),
        avgWeight: Math.round(sum / count),
        count,
      };
    })
    .sort((a, b) => a.monthKey.localeCompare(b.monthKey));
}

export default function Weighing({ session }: Props) {
  const [records, setRecords] = useState<WeighingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<WeighingRecord | null>(
    null,
  );
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showWeightChart, setShowWeightChart] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.user.id]);

  async function fetchRecords() {
    setLoading(true);
    const { data } = await supabase
      .from("weighings")
      .select("*")
      .eq("user_id", session.user.id)
      .order("weighing_date", { ascending: true });
    setRecords(data || []);
    setLoading(false);
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
      user_id: session.user.id,
    });
    if (error) {
      setError("Помилка збереження");
    } else {
      setForm(emptyForm);
      setShowForm(false);
      fetchRecords();
    }
    setSaving(false);
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
    await supabase.from("weighings").delete().eq("id", id);
    fetchRecords();
  }

  // Групування по гніздах
  const groups = records.reduce<Record<string, WeighingRecord[]>>((acc, r) => {
    const key = r.litter_label || "Без назви";
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  function dailyGain(prev: WeighingRecord, curr: WeighingRecord): string {
    const days =
      (new Date(curr.weighing_date).getTime() -
        new Date(prev.weighing_date).getTime()) /
      (1000 * 60 * 60 * 24);
    if (days <= 0) return "—";
    const gain = (curr.weight_g - prev.weight_g) / days;
    return `${gain >= 0 ? "+" : ""}${gain.toFixed(1)} г/добу`;
  }

  const litterCount = Object.keys(groups).length;
  const lastMonth = records.length
    ? new Date(
        Math.max(...records.map((r) => new Date(r.weighing_date).getTime())),
      ).toLocaleDateString("uk-UA", { month: "long", year: "numeric" })
    : "—";

  return (
    <div className="weighing-page">
      <div className="weighing-header">
        <h1>⚖️ Зважування</h1>
        <button
          className="weighing-back-btn"
          onClick={() => navigate("/registry")}
        >
          ⬅ Мої кролики
        </button>
      </div>

      <div className="weighing-stats">
        <div className="weighing-stat">
          <span className="weighing-stat-value">{records.length}</span>
          <span className="weighing-stat-label">Записів</span>
        </div>
        <div className="weighing-stat">
          <span className="weighing-stat-value">{litterCount}</span>
          <span className="weighing-stat-label">Гнізд / груп</span>
        </div>
        <div className="weighing-stat wide">
          <span className="weighing-stat-value small">{lastMonth}</span>
          <span className="weighing-stat-label">Останнє зважування</span>
        </div>
      </div>

      <div className="weighing-actions">
        <button
          className="weighing-add-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "✕ Скасувати" : "+ Додати зважування"}
        </button>
      </div>

      {showForm && (
        <div className="weighing-form">
          <h3>Нове зважування</h3>
          <div className="weighing-form-grid">
            <input
              placeholder="Гніздо / кролятник *"
              value={form.litter_label}
              onChange={(e) =>
                setForm({ ...form, litter_label: e.target.value })
              }
            />
            <select
              value={form.weighing_type}
              onChange={(e) =>
                setForm({
                  ...form,
                  weighing_type: e.target.value as WeighingType,
                })
              }
            >
              <option value="breeding">🐇 Племінне</option>
              <option value="fattening">🍖 Відгодівля</option>
            </select>
            <input
              placeholder="Кличка / номер кролика"
              value={form.rabbit_name}
              onChange={(e) =>
                setForm({ ...form, rabbit_name: e.target.value })
              }
            />
            <div className="weighing-form-field">
              <label>Дата зважування *</label>
              <input
                type="date"
                value={form.weighing_date}
                onChange={(e) =>
                  setForm({ ...form, weighing_date: e.target.value })
                }
              />
            </div>
            <div className="weighing-form-field">
              <label>Вага (г) *</label>
              <input
                type="number"
                min="0"
                placeholder="Наприклад 1450"
                value={form.weight_g}
                onChange={(e) => setForm({ ...form, weight_g: e.target.value })}
              />
            </div>
            <input
              placeholder="Нотатки"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="weighing-form-full"
            />
          </div>
          {error && <p className="weighing-error">{error}</p>}
          <button
            className="weighing-save-btn"
            onClick={handleAdd}
            disabled={
              saving ||
              !form.litter_label ||
              !form.weighing_date ||
              !form.weight_g
            }
          >
            {saving ? "Збереження..." : "Зберегти"}
          </button>
        </div>
      )}

      {editingRecord && (
        <div className="weighing-form weighing-edit-form">
          <h3>✏️ Редагування</h3>
          <div className="weighing-form-grid">
            <input
              placeholder="Гніздо / кролятник *"
              value={editingRecord.litter_label}
              onChange={(e) =>
                setEditingRecord({
                  ...editingRecord,
                  litter_label: e.target.value,
                })
              }
            />
            <select
              value={editingRecord.weighing_type}
              onChange={(e) =>
                setEditingRecord({
                  ...editingRecord,
                  weighing_type: e.target.value as WeighingType,
                })
              }
            >
              <option value="breeding">🐇 Племінне</option>
              <option value="fattening">🍖 Відгодівля</option>
            </select>
            <input
              placeholder="Кличка / номер кролика"
              value={editingRecord.rabbit_name || ""}
              onChange={(e) =>
                setEditingRecord({
                  ...editingRecord,
                  rabbit_name: e.target.value,
                })
              }
            />
            <div className="weighing-form-field">
              <label>Дата зважування</label>
              <input
                type="date"
                value={editingRecord.weighing_date}
                onChange={(e) =>
                  setEditingRecord({
                    ...editingRecord,
                    weighing_date: e.target.value,
                  })
                }
              />
            </div>
            <div className="weighing-form-field">
              <label>Вага (г)</label>
              <input
                type="number"
                min="0"
                value={editingRecord.weight_g}
                onChange={(e) =>
                  setEditingRecord({
                    ...editingRecord,
                    weight_g: Number(e.target.value),
                  })
                }
              />
            </div>
            <input
              placeholder="Нотатки"
              value={editingRecord.notes || ""}
              onChange={(e) =>
                setEditingRecord({ ...editingRecord, notes: e.target.value })
              }
              className="weighing-form-full"
            />
          </div>
          {error && <p className="weighing-error">{error}</p>}
          <div className="weighing-edit-actions">
            <button
              className="weighing-cancel-btn"
              onClick={() => setEditingRecord(null)}
            >
              Скасувати
            </button>
            <button
              className="weighing-save-btn"
              onClick={handleEdit}
              disabled={saving}
            >
              {saving ? "Збереження..." : "Зберегти зміни"}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="weighing-loading">Завантаження...</p>
      ) : records.length === 0 ? (
        <div className="weighing-empty-state">
          <div className="weighing-empty-illustration">⚖️</div>
          <h3 className="weighing-empty-title">Записів зважування ще немає</h3>
          <p className="weighing-empty-desc">
            Додайте перше зважування показового кролика з гнізда — так почнеться
            відстеження приросту по місяцях.
          </p>
        </div>
      ) : (
        <div className="weighing-groups">
          {Object.entries(groups).map(([litter, list]) => {
            const sorted = [...list].sort(
              (a, b) =>
                new Date(a.weighing_date).getTime() -
                new Date(b.weighing_date).getTime(),
            );
            const groupType: WeighingType =
              sorted[0]?.weighing_type || "breeding";

            return (
              <div key={litter} className="weighing-group">
                <h2 className="weighing-group-title">
                  {groupType === "fattening" ? "🍖" : "🐇"} {litter}
                  <span className="weighing-group-badge">
                    {groupType === "fattening" ? "Відгодівля" : "Племінне"}
                  </span>
                </h2>

                {groupType === "fattening" ? (
                  // ── Відгодівля: середня вага по клітці за кожен місяць ──
                  <div className="weighing-monthly">
                    {getMonthlyAverages(sorted).map((m, idx, arr) => (
                      <div key={m.monthKey} className="weighing-card">
                        <p className="weighing-info">
                          {m.monthLabel}: середня{" "}
                          <strong>{m.avgWeight} г</strong> ({m.count} зважувань)
                          {idx > 0 && (
                            <span className="weighing-gain">
                              {" "}
                              (
                              {m.avgWeight - arr[idx - 1].avgWeight >= 0
                                ? "+"
                                : ""}
                              {m.avgWeight - arr[idx - 1].avgWeight} г до
                              попереднього місяця)
                            </span>
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  // ── Племінне: приріст по добі між зважуваннями ──
                  <div className="weighing-list">
                    {sorted.map((r, idx) => (
                      <div key={r.id} className="weighing-card">
                        <div className="weighing-card-top">
                          <span className="weighing-name">
                            {new Date(r.weighing_date).toLocaleDateString(
                              "uk-UA",
                            )}
                            {r.rabbit_name ? ` · ${r.rabbit_name}` : ""}
                          </span>
                          <div className="weighing-card-btns">
                            <button
                              className="weighing-edit-btn"
                              onClick={() => setEditingRecord(r)}
                            >
                              ✏️
                            </button>
                            <button
                              className="weighing-delete-btn"
                              onClick={() => handleDelete(r.id)}
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                        <p className="weighing-info">
                          Вага: <strong>{r.weight_g} г</strong>
                          {idx > 0 && (
                            <span className="weighing-gain">
                              {" "}
                              ({dailyGain(sorted[idx - 1], r)})
                            </span>
                          )}
                        </p>
                        {r.notes && <p className="weighing-notes">{r.notes}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Довідка: орієнтовна вага за віком ── */}
      <div className="registry-info">
        <button
          className="registry-info-toggle"
          onClick={() => setShowWeightChart(!showWeightChart)}
        >
          <span>📋 Орієнтовна вага кроля за віком (норма)</span>
          <span>{showWeightChart ? "▲" : "▼"}</span>
        </button>

        {showWeightChart && (
          <>
            <p className="registry-info-text">
              Орієнтовні діапазони — реальна вага залежить від лінії, годівлі та
              умов утримання. Використовуй як загальний орієнтир для
              самоконтролю, а не жорсткий норматив.
            </p>
            <div className="weighing-chart-table-wrap">
              <table className="weighing-chart-table">
                <thead>
                  <tr>
                    <th>Вік</th>
                    <th>М'ясні породи</th>
                    <th>Великі породи</th>
                    <th>Декоративні</th>
                    <th>Примітка</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Народження</td>
                    <td>40–80 г</td>
                    <td>60–100 г</td>
                    <td>30–60 г</td>
                    <td>
                      Залежить від розміру посліду. Менший послід — більші
                      кроленята.
                    </td>
                  </tr>
                  <tr>
                    <td>7 днів</td>
                    <td>100–150 г</td>
                    <td>120–180 г</td>
                    <td>70–100 г</td>
                    <td>
                      Перший тиждень — тільки молоко матері. Вага подвоюється.
                    </td>
                  </tr>
                  <tr>
                    <td>14 днів</td>
                    <td>200–280 г</td>
                    <td>250–320 г</td>
                    <td>150–200 г</td>
                    <td>Очі ще закриті. Починають виходити з гнізда.</td>
                  </tr>
                  <tr>
                    <td>21 день</td>
                    <td>350–450 г</td>
                    <td>400–520 г</td>
                    <td>250–320 г</td>
                    <td>Починають пробувати сіно та м'який корм.</td>
                  </tr>
                  <tr>
                    <td>28 днів</td>
                    <td>500–650 г</td>
                    <td>600–750 г</td>
                    <td>350–450 г</td>
                    <td>Активно їдять поряд з матір'ю.</td>
                  </tr>
                  <tr>
                    <td>35 днів</td>
                    <td>700–900 г</td>
                    <td>850–1050 г</td>
                    <td>450–600 г</td>
                    <td>
                      Орієнтир ваги — не рекомендація щодо термінів відлучення.
                    </td>
                  </tr>
                  <tr>
                    <td>45 днів</td>
                    <td>900–1100 г</td>
                    <td>1100–1350 г</td>
                    <td>600–750 г</td>
                    <td>Активний ріст. Профілактика кокцидіозу обов'язкова.</td>
                  </tr>
                  <tr>
                    <td>60 днів</td>
                    <td>1300–1600 г</td>
                    <td>1600–2000 г</td>
                    <td>800–1000 г</td>
                    <td>Типовий вік відлучення в господарстві.</td>
                  </tr>
                  <tr>
                    <td>75 днів</td>
                    <td>1800–2200 г</td>
                    <td>2200–2700 г</td>
                    <td>1000–1300 г</td>
                    <td>
                      Оптимальний вік початку відгодівлі для м'ясних порід.
                    </td>
                  </tr>
                  <tr>
                    <td>90 днів</td>
                    <td>2200–2700 г</td>
                    <td>2800–3400 г</td>
                    <td>1200–1600 г</td>
                    <td>Орієнтовний вік забою для м'ясних порід.</td>
                  </tr>
                  <tr>
                    <td>120 днів</td>
                    <td>2800–3400 г</td>
                    <td>3500–4500 г</td>
                    <td>1500–2000 г</td>
                    <td>Статева зрілість. Самців і самок розділяти.</td>
                  </tr>
                  <tr>
                    <td>6 місяців</td>
                    <td>3500–4500 г</td>
                    <td>4500–6000 г</td>
                    <td>1800–2500 г</td>
                    <td>Дорослий кролик, готовий до першої злучки.</td>
                  </tr>
                  <tr>
                    <td>12 місяців</td>
                    <td>4000–5500 г</td>
                    <td>5500–8000 г</td>
                    <td>2000–3000 г</td>
                    <td>Повна зрілість. Максимальна маса — до 1.5–2 років.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
