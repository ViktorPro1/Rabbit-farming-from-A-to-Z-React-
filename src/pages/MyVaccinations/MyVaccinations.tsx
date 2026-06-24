import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import "./MyVaccinations.css";

interface Props {
  session: Session;
}

interface VaccinationRecord {
  id: string;
  cage_number: string;
  vaccine_type: string;
  vaccine_name: string;
  date: string;
  next_date: string | null;
  notes: string | null;
}

const emptyForm = {
  cage_number: "",
  vaccine_type: "ВГХК",
  vaccine_name: "",
  date: "",
  next_date: "",
  notes: "",
};

export default function MyVaccinations({ session }: Props) {
  const [records, setRecords] = useState<VaccinationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showVacInfo, setShowVacInfo] = useState(false);
  const navigate = useNavigate();

  const loadData = useCallback(() => {
    supabase
      .from("vaccinations")
      .select("*")
      .eq("user_id", session.user.id)
      .order("date", { ascending: false })
      .then(({ data }) => {
        setRecords(data || []);
        setLoading(false);
      });
  }, [session.user.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleAdd() {
    setSaving(true);
    setError("");
    const { error } = await supabase.from("vaccinations").insert({
      ...form,
      next_date: form.next_date || null,
      notes: form.notes || null,
      user_id: session.user.id,
    });
    if (error) {
      setError("Помилка збереження");
    } else {
      setForm(emptyForm);
      setShowForm(false);
      loadData();
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Видалити запис?")) return;
    await supabase.from("vaccinations").delete().eq("id", id);
    loadData();
  }

  function isOverdue(next_date: string | null) {
    if (!next_date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(next_date) < today;
  }

  function isSoon(next_date: string | null) {
    if (!next_date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff =
      (new Date(next_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 14;
  }

  return (
    <div className="myvac-page">
      <div className="myvac-header">
        <button
          className="myvac-back-btn"
          onClick={() => navigate("/registry")}
        >
          ← Мої кролики
        </button>
        <h1>💉 Вакцинація</h1>
        <button
          className="myvac-add-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "✕ Скасувати" : "+ Додати запис"}
        </button>
      </div>

      {showForm && (
        <div className="myvac-form">
          <h2>Новий запис</h2>
          <div className="myvac-form-grid">
            <input
              placeholder="Номер клітки *"
              value={form.cage_number}
              onChange={(e) =>
                setForm({ ...form, cage_number: e.target.value })
              }
            />
            <select
              value={form.vaccine_type}
              onChange={(e) =>
                setForm({ ...form, vaccine_type: e.target.value })
              }
            >
              <option value="ВГХК">ВГХК</option>
              <option value="Міксоматоз">Міксоматоз</option>
              <option value="ВГХК + Міксоматоз">ВГХК + Міксоматоз</option>
              <option value="Інше">Інше</option>
            </select>
            <input
              placeholder="Назва препарату *"
              value={form.vaccine_name}
              onChange={(e) =>
                setForm({ ...form, vaccine_name: e.target.value })
              }
            />
            <div className="myvac-field-wrap">
              <label>Дата вакцинації</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div className="myvac-field-wrap">
              <label>Наступна дата</label>
              <input
                type="date"
                value={form.next_date}
                onChange={(e) =>
                  setForm({ ...form, next_date: e.target.value })
                }
              />
            </div>
            <input
              placeholder="Нотатки"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          {error && <p className="myvac-error">{error}</p>}
          <button
            className="myvac-save-btn"
            onClick={handleAdd}
            disabled={
              saving || !form.cage_number || !form.vaccine_name || !form.date
            }
          >
            {saving ? "Збереження..." : "Зберегти"}
          </button>
        </div>
      )}

      {loading ? (
        <p className="myvac-loading">Завантаження...</p>
      ) : records.length === 0 ? (
        <div className="myvac-empty-state">
          <div className="myvac-empty-illustration">💉</div>
          <h3 className="myvac-empty-title">Записів вакцинації ще немає</h3>
          <p className="myvac-empty-desc">
            Додайте перший запис — вкажіть клітку, тип вакцини і дату. Система
            нагадає коли настане час ревакцинації.
          </p>
        </div>
      ) : (
        <div className="myvac-grid">
          {records.map((r) => (
            <div
              key={r.id}
              className={`myvac-card ${isOverdue(r.next_date) ? "overdue" : isSoon(r.next_date) ? "soon" : ""}`}
            >
              <div className="myvac-card-top">
                <span className="myvac-cage">Клітка {r.cage_number}</span>
                <span className="myvac-type">{r.vaccine_type}</span>
              </div>
              <p className="myvac-drug">{r.vaccine_name}</p>
              <p className="myvac-date">
                Дата: {new Date(r.date).toLocaleDateString("uk-UA")}
              </p>
              {r.next_date && (
                <p
                  className={`myvac-next ${isOverdue(r.next_date) ? "text-overdue" : isSoon(r.next_date) ? "text-soon" : ""}`}
                >
                  Наступна: {new Date(r.next_date).toLocaleDateString("uk-UA")}
                  {isOverdue(r.next_date) && " ⚠️ Прострочено"}
                  {isSoon(r.next_date) &&
                    !isOverdue(r.next_date) &&
                    " ⏰ Скоро"}
                </p>
              )}
              {r.notes && <p className="myvac-notes">{r.notes}</p>}
              <button
                className="myvac-delete-btn"
                onClick={() => handleDelete(r.id)}
              >
                Видалити
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── ЗНОСКА: схема вакцинації ── */}
      <div className="myvac-info">
        <button
          className="myvac-info-toggle"
          onClick={() => setShowVacInfo(!showVacInfo)}
        >
          <span>📋 Схема вакцинації кролів</span>
          <span>{showVacInfo ? "▲" : "▼"}</span>
        </button>

        {showVacInfo && (
          <>
            <div className="myvac-info-grid">
              <div className="myvac-info-item">
                <span className="myvac-info-icon">💉</span>
                <div>
                  <strong>ВГХК (вірусна геморагічна хвороба)</strong>
                  <span>Перша вакцинація: з 45 днів</span>
                  <span>Ревакцинація: кожні 6 місяців</span>
                  <span>Препарати: Раббівак-V, Пестовак, Лапімун Гем</span>
                </div>
              </div>
              <div className="myvac-info-item">
                <span className="myvac-info-icon">💉</span>
                <div>
                  <strong>Міксоматоз</strong>
                  <span>Перша вакцинація: з 45 днів</span>
                  <span>
                    Ревакцинація: кожні 6–9 місяців, перед сезоном комах
                  </span>
                  <span>Препарати: Раббівак-В, Лапімун Мікс</span>
                </div>
              </div>
              <div className="myvac-info-item">
                <span className="myvac-info-icon">💊</span>
                <div>
                  <strong>Асоційована вакцина (ВГХК + Міксоматоз)</strong>
                  <span>Перша: з 45 днів</span>
                  <span>Ревакцинація: кожні 6 місяців</span>
                  <span>Препарати: Нобіліс Міксо-РHД, Пестовак-Міксо</span>
                </div>
              </div>
              <div className="myvac-info-item">
                <span className="myvac-info-icon">📌</span>
                <div>
                  <strong>Важливі правила</strong>
                  <span>Вакцинувати лише здорових тварин</span>
                  <span>Карантин після вакцинації: 14 днів</span>
                  <span>Не вакцинувати за 2 тижні до і після злучки</span>
                </div>
              </div>
            </div>

            <div className="myvac-info-warning">
              ⚠️ <strong>ВГХК-2 (новий штам):</strong> З 2010-х в Європі
              поширився штам RHDV2 який вражає кролів від 4 тижнів і частково
              обходить імунітет від класичних вакцин. Перевіряйте чи ваша
              вакцина покриває обидва штами — RHDV1 і RHDV2.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
