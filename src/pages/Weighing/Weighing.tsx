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
  is_final: boolean;
}

const emptyForm = {
  litter_label: "",
  rabbit_name: "",
  weighing_date: "",
  weight_g: "",
  notes: "",
  weighing_type: "breeding" as WeighingType,
  is_final: false,
};

interface MonthGroup {
  monthKey: string;
  monthLabel: string;
  avgWeight: number;
  count: number;
  records: WeighingRecord[];
}

function groupWeighingsByMonth(list: WeighingRecord[]): MonthGroup[] {
  const map: Record<string, WeighingRecord[]> = {};
  list.forEach((r) => {
    const d = new Date(r.weighing_date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!map[key]) map[key] = [];
    map[key].push(r);
  });

  return Object.entries(map)
    .map(([key, records]) => {
      const [y, m] = key.split("-");
      const label = new Date(Number(y), Number(m) - 1).toLocaleDateString(
        "uk-UA",
        { month: "long", year: "numeric" },
      );
      const sortedRecords = [...records].sort(
        (a, b) =>
          new Date(a.weighing_date).getTime() -
          new Date(b.weighing_date).getTime(),
      );
      const sum = records.reduce((s, r) => s + r.weight_g, 0);
      return {
        monthKey: key,
        monthLabel: label.charAt(0).toUpperCase() + label.slice(1),
        avgWeight: Math.round(sum / records.length),
        count: records.length,
        records: sortedRecords,
      };
    })
    .sort((a, b) => a.monthKey.localeCompare(b.monthKey));
}

// ── Цикли відгодівлі ──
// Один цикл — це серія записів у клітці від заселення до фінального
// зважування (is_final = true) перед забоєм. Після фінального зважування
// наступні записи в тій самій клітці автоматично належать новому циклу.
interface WeighingCycle {
  cycleIndex: number;
  records: WeighingRecord[];
  startDate: string;
  endDate: string;
  isClosed: boolean;
  durationDays: number;
  finalAvgWeight: number | null;
}

function buildCycle(
  records: WeighingRecord[],
  cycleIndex: number,
  isClosed: boolean,
): WeighingCycle {
  const start = records[0].weighing_date;
  const end = records[records.length - 1].weighing_date;
  const durationDays = Math.round(
    (new Date(end).getTime() - new Date(start).getTime()) /
      (1000 * 60 * 60 * 24),
  );
  const finalRecords = records.filter((r) => r.is_final);
  const finalAvgWeight =
    isClosed && finalRecords.length
      ? Math.round(
          finalRecords.reduce((s, r) => s + r.weight_g, 0) /
            finalRecords.length,
        )
      : null;

  return {
    cycleIndex,
    records,
    startDate: start,
    endDate: end,
    isClosed,
    durationDays,
    finalAvgWeight,
  };
}

function splitIntoCycles(sorted: WeighingRecord[]): WeighingCycle[] {
  const cycles: WeighingCycle[] = [];
  let current: WeighingRecord[] = [];
  let cycleIndex = 1;

  sorted.forEach((r) => {
    current.push(r);
    if (r.is_final) {
      cycles.push(buildCycle(current, cycleIndex, true));
      current = [];
      cycleIndex += 1;
    }
  });

  if (current.length > 0) {
    cycles.push(buildCycle(current, cycleIndex, false));
  }

  return cycles;
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
  const [showCycleInfo, setShowCycleInfo] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [openArchives, setOpenArchives] = useState<Record<string, boolean>>({});
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
      is_final: form.weighing_type === "fattening" ? form.is_final : false,
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
        is_final:
          editingRecord.weighing_type === "fattening"
            ? editingRecord.is_final
            : false,
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

  // Усі закриті цикли відгодівлі по всіх клітках — для порівняння за рік
  const allClosedCycles: Array<{ litter: string; cycle: WeighingCycle }> = [];
  Object.entries(groups).forEach(([litter, list]) => {
    const isFattening = list[0]?.weighing_type === "fattening";
    if (!isFattening) return;
    const sorted = [...list].sort(
      (a, b) =>
        new Date(a.weighing_date).getTime() -
        new Date(b.weighing_date).getTime(),
    );
    splitIntoCycles(sorted)
      .filter((c) => c.isClosed)
      .forEach((cycle) => allClosedCycles.push({ litter, cycle }));
  });
  allClosedCycles.sort(
    (a, b) =>
      new Date(a.cycle.endDate).getTime() - new Date(b.cycle.endDate).getTime(),
  );

  function renderInlineEditForm() {
    if (!editingRecord) return null;
    return (
      <div className="weighing-form weighing-edit-form weighing-inline-edit">
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
        {editingRecord.weighing_type === "fattening" && (
          <label className="weighing-final-check">
            <input
              type="checkbox"
              checked={editingRecord.is_final}
              onChange={(e) =>
                setEditingRecord({
                  ...editingRecord,
                  is_final: e.target.checked,
                })
              }
            />
            Фінальне зважування (забій, клітка звільняється під нову партію)
          </label>
        )}
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
    );
  }

  function renderFatteningRecordCard(r: WeighingRecord) {
    if (editingRecord?.id === r.id) {
      return <div key={r.id}>{renderInlineEditForm()}</div>;
    }
    return (
      <div key={r.id} className="weighing-card">
        <div className="weighing-card-top">
          <span className="weighing-name">
            {new Date(r.weighing_date).toLocaleDateString("uk-UA")}
            {r.rabbit_name ? ` · ${r.rabbit_name}` : ""}
            {r.is_final && <span className="weighing-final-badge">забій</span>}
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
        </p>
        <p className="weighing-sample-tag">
          Показовий кролик (один навмання з гнізда)
        </p>
        {r.notes && <p className="weighing-notes">{r.notes}</p>}
      </div>
    );
  }

  function renderFatteningCycleBody(cycle: WeighingCycle) {
    return (
      <div className="weighing-monthly">
        {groupWeighingsByMonth(cycle.records).map((m, idx, arr) => (
          <div key={m.monthKey} className="weighing-month-block">
            {m.count > 1 && (
              <p className="weighing-info weighing-month-summary">
                {m.monthLabel}: середня <strong>{m.avgWeight} г</strong> (
                {m.count} зважувань)
                {idx > 0 && (
                  <span className="weighing-gain">
                    {" "}
                    ({m.avgWeight - arr[idx - 1].avgWeight >= 0 ? "+" : ""}
                    {m.avgWeight - arr[idx - 1].avgWeight} г до попереднього
                    місяця)
                  </span>
                )}
              </p>
            )}
            <div className="weighing-list weighing-month-records">
              {m.records.map((r) => renderFatteningRecordCard(r))}
            </div>
          </div>
        ))}
      </div>
    );
  }

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
          {form.weighing_type === "fattening" && (
            <label className="weighing-final-check">
              <input
                type="checkbox"
                checked={form.is_final}
                onChange={(e) =>
                  setForm({ ...form, is_final: e.target.checked })
                }
              />
              Фінальне зважування (забій, клітка звільняється під нову партію)
            </label>
          )}
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

            const cycles =
              groupType === "fattening" ? splitIntoCycles(sorted) : [];
            const activeCycle = cycles.find((c) => !c.isClosed);
            const closedCycles = cycles.filter((c) => c.isClosed);
            const archiveOpen = !!openArchives[litter];

            return (
              <div key={litter} className="weighing-group">
                <h2 className="weighing-group-title">
                  {groupType === "fattening" ? "🍖" : "🐇"} {litter}
                  <span className="weighing-group-badge">
                    {groupType === "fattening" ? "Відгодівля" : "Племінне"}
                  </span>
                </h2>

                {groupType === "fattening" ? (
                  <>
                    {activeCycle ? (
                      renderFatteningCycleBody(activeCycle)
                    ) : (
                      <p className="weighing-info weighing-cycle-empty">
                        Поточний цикл ще не розпочато — додайте зважування нової
                        партії в цю клітку.
                      </p>
                    )}

                    {closedCycles.length > 0 && (
                      <div className="weighing-cycle-archive">
                        <button
                          className="weighing-cycle-archive-toggle"
                          onClick={() =>
                            setOpenArchives((prev) => ({
                              ...prev,
                              [litter]: !prev[litter],
                            }))
                          }
                        >
                          <span>📦 Архів циклів ({closedCycles.length})</span>
                          <span>{archiveOpen ? "▲" : "▼"}</span>
                        </button>

                        {archiveOpen &&
                          closedCycles
                            .slice()
                            .reverse()
                            .map((cycle) => (
                              <div
                                key={cycle.cycleIndex}
                                className="weighing-cycle-block weighing-cycle-closed"
                              >
                                <p className="weighing-cycle-summary">
                                  Цикл {cycle.cycleIndex}:{" "}
                                  {new Date(cycle.startDate).toLocaleDateString(
                                    "uk-UA",
                                  )}{" "}
                                  –{" "}
                                  {new Date(cycle.endDate).toLocaleDateString(
                                    "uk-UA",
                                  )}{" "}
                                  ({cycle.durationDays} дн.)
                                  {cycle.finalAvgWeight !== null && (
                                    <>
                                      {" "}
                                      · середня вага на забій:{" "}
                                      <strong>{cycle.finalAvgWeight} г</strong>
                                    </>
                                  )}
                                </p>
                                {renderFatteningCycleBody(cycle)}
                              </div>
                            ))}
                      </div>
                    )}
                  </>
                ) : (
                  // ── Племінне: приріст по добі між зважуваннями ──
                  <div className="weighing-list">
                    {sorted.map((r, idx) =>
                      editingRecord?.id === r.id ? (
                        <div key={r.id}>{renderInlineEditForm()}</div>
                      ) : (
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
                          {r.notes && (
                            <p className="weighing-notes">{r.notes}</p>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {/* ── Порівняння циклів відгодівлі за рік ── */}
      {allClosedCycles.length > 0 && (
        <div className="registry-info">
          <button
            className="registry-info-toggle"
            onClick={() => setShowComparison(!showComparison)}
          >
            <span>📊 Порівняння циклів відгодівлі</span>
            <span>{showComparison ? "▲" : "▼"}</span>
          </button>

          {showComparison && (
            <div className="weighing-comparison-table-wrap">
              <table className="weighing-comparison-table">
                <thead>
                  <tr>
                    <th>Клітка</th>
                    <th>Період</th>
                    <th>Тривалість</th>
                    <th>Середня вага на забій</th>
                  </tr>
                </thead>
                <tbody>
                  {allClosedCycles.map(({ litter, cycle }) => (
                    <tr key={`${litter}-${cycle.cycleIndex}`}>
                      <td>{litter}</td>
                      <td>
                        {new Date(cycle.startDate).toLocaleDateString("uk-UA")}{" "}
                        – {new Date(cycle.endDate).toLocaleDateString("uk-UA")}
                      </td>
                      <td>{cycle.durationDays} дн.</td>
                      <td>
                        {cycle.finalAvgWeight !== null
                          ? `${cycle.finalAvgWeight} г`
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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

      <div className="registry-info">
        <button
          className="registry-info-toggle"
          onClick={() => setShowCycleInfo(!showCycleInfo)}
        >
          <span>❔ Як рахуються цикли відгодівлі</span>
          <span>{showCycleInfo ? "▲" : "▼"}</span>
        </button>

        {showCycleInfo && (
          <p className="registry-info-text">
            Кожна клітка проходить цикли: заселили кроленят у 2 місяці —
            зважуєте в 3 місяці — фінальне зважування в 4 місяці перед забоєм.
            <br />
            <br />
            Коли додаєте зважування, познач чекбоксом "Фінальне зважування" той
            запис, що робиться перед забоєм. Після цього цикл вважається
            завершеним і автоматично йде в архів.
            <br />
            <br />
            Наступне зважування в тій самій клітці (нова партія кроленят) почне
            новий цикл сам, без ручного очищення чи перейменування клітки.
            <br />
            <br />В архіві циклів по кожній клітці зберігається історія всіх
            попередніх партій: дати заселення й забою, тривалість відгодівлі,
            середня вага на забій — можна порівнювати цикли між собою протягом
            року.
          </p>
        )}
      </div>
    </div>
  );
}
