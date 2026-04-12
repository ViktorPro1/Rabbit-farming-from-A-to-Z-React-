import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import "./RabbitRegistry.css";

interface Props {
  session: Session;
}

interface Rabbit {
  id: string;
  name: string;
  breed: string;
  gender: "male" | "female";
  birth_date: string;
  cage_number: string;
  notes: string;
  is_active: boolean;
}

interface Stats {
  total: number;
  males: number;
  females: number;
  youngTotal: number;
  youngMales: number;
  youngFemales: number;
  youngUnknown: number;
  youngFromCages: number;
  youngFromPaddocks: number;
  paddockFemales: number;
  fatteningMales: number;
  fatteningFemales: number;
  fatteningUnknown: number;
  fatteningTotal: number;
}

const emptyForm = {
  name: "",
  breed: "",
  gender: "female" as "male" | "female",
  birth_date: "",
  cage_number: "",
  notes: "",
};

export default function RabbitRegistry({ session }: Props) {
  const [rabbits, setRabbits] = useState<Rabbit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<Stats>({
    total: 0,
    males: 0,
    females: 0,
    youngTotal: 0,
    youngMales: 0,
    youngFemales: 0,
    youngUnknown: 0,
    youngFromCages: 0,
    youngFromPaddocks: 0,
    paddockFemales: 0,
    fatteningMales: 0,
    fatteningFemales: 0,
    fatteningUnknown: 0,
    fatteningTotal: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    supabase
      .from("rabbits")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("is_active", true)
      .order("cage_number", { ascending: true })
      .then(({ data: rabbitsData }) => {
        const list = rabbitsData || [];
        setRabbits(list);

        Promise.all([
          supabase
            .from("litters")
            .select("alive, weaned_males, weaned_females")
            .eq("user_id", session.user.id),
          supabase
            .from("paddock_litters")
            .select("alive, weaned_males, weaned_females")
            .eq("user_id", session.user.id),
          supabase
            .from("paddock_females")
            .select("id")
            .not("paddock_id", "is", null),
          supabase
            .from("fattening")
            .select("males, females, unknown")
            .eq("user_id", session.user.id)
            .eq("is_active", true),
        ]).then(
          ([
            { data: littersData },
            { data: paddockLittersData },
            { data: paddockFemalesData },
            { data: fatteningData },
          ]) => {
            let youngMales = 0;
            let youngFemales = 0;
            let youngUnknown = 0;
            let youngFromCages = 0;
            let youngFromPaddocks = 0;

            (littersData || []).forEach((l) => {
              const alive = l.alive || 0;
              const wm = l.weaned_males || 0;
              const wf = l.weaned_females || 0;
              const remaining = Math.max(0, alive - (wm + wf));
              youngMales += wm;
              youngFemales += wf;
              youngUnknown += remaining;
              youngFromCages += alive;
            });

            (paddockLittersData || []).forEach((l) => {
              const alive = l.alive || 0;
              const wm = l.weaned_males || 0;
              const wf = l.weaned_females || 0;
              const remaining = Math.max(0, alive - (wm + wf));
              youngMales += wm;
              youngFemales += wf;
              youngUnknown += remaining;
              youngFromPaddocks += alive;
            });

            const youngTotal = youngMales + youngFemales + youngUnknown;
            const paddockFemales = (paddockFemalesData || []).length;

            let fatteningMales = 0;
            let fatteningFemales = 0;
            let fatteningUnknown = 0;
            (fatteningData || []).forEach((f) => {
              fatteningMales += f.males || 0;
              fatteningFemales += f.females || 0;
              fatteningUnknown += f.unknown || 0;
            });
            const fatteningTotal =
              fatteningMales + fatteningFemales + fatteningUnknown;

            setStats({
              total: list.length + youngTotal + paddockFemales + fatteningTotal,
              males: list.filter((r) => r.gender === "male").length,
              females: list.filter((r) => r.gender === "female").length,
              youngTotal,
              youngMales,
              youngFemales,
              youngUnknown,
              youngFromCages,
              youngFromPaddocks,
              paddockFemales,
              fatteningMales,
              fatteningFemales,
              fatteningUnknown,
              fatteningTotal,
            });
            setLoading(false);
          },
        );
      });
  }, [session.user.id]);

  async function loadData() {
    const { data: rabbitsData } = await supabase
      .from("rabbits")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("is_active", true)
      .order("cage_number", { ascending: true });

    const list = rabbitsData || [];
    setRabbits(list);

    const [
      { data: littersData },
      { data: paddockLittersData },
      { data: paddockFemalesData },
      { data: fatteningData },
    ] = await Promise.all([
      supabase
        .from("litters")
        .select("alive, weaned_males, weaned_females")
        .eq("user_id", session.user.id),
      supabase
        .from("paddock_litters")
        .select("alive, weaned_males, weaned_females")
        .eq("user_id", session.user.id),
      supabase
        .from("paddock_females")
        .select("id")
        .not("paddock_id", "is", null),
      supabase
        .from("fattening")
        .select("males, females, unknown")
        .eq("user_id", session.user.id)
        .eq("is_active", true),
    ]);

    let youngMales = 0;
    let youngFemales = 0;
    let youngUnknown = 0;
    let youngFromCages = 0;
    let youngFromPaddocks = 0;

    (littersData || []).forEach((l) => {
      const alive = l.alive || 0;
      const wm = l.weaned_males || 0;
      const wf = l.weaned_females || 0;
      const remaining = Math.max(0, alive - (wm + wf));
      youngMales += wm;
      youngFemales += wf;
      youngUnknown += remaining;
      youngFromCages += alive;
    });

    (paddockLittersData || []).forEach((l) => {
      const alive = l.alive || 0;
      const wm = l.weaned_males || 0;
      const wf = l.weaned_females || 0;
      const remaining = Math.max(0, alive - (wm + wf));
      youngMales += wm;
      youngFemales += wf;
      youngUnknown += remaining;
      youngFromPaddocks += alive;
    });

    const youngTotal = youngMales + youngFemales + youngUnknown;
    const paddockFemales = (paddockFemalesData || []).length;

    let fatteningMales = 0;
    let fatteningFemales = 0;
    let fatteningUnknown = 0;
    (fatteningData || []).forEach((f) => {
      fatteningMales += f.males || 0;
      fatteningFemales += f.females || 0;
      fatteningUnknown += f.unknown || 0;
    });
    const fatteningTotal = fatteningMales + fatteningFemales + fatteningUnknown;

    setStats({
      total: list.length + youngTotal + paddockFemales + fatteningTotal,
      males: list.filter((r) => r.gender === "male").length,
      females: list.filter((r) => r.gender === "female").length,
      youngTotal,
      youngMales,
      youngFemales,
      youngUnknown,
      youngFromCages,
      youngFromPaddocks,
      paddockFemales,
      fatteningMales,
      fatteningFemales,
      fatteningUnknown,
      fatteningTotal,
    });
  }

  async function handleAdd() {
    setSaving(true);
    setError("");
    const { error } = await supabase
      .from("rabbits")
      .insert({ ...form, user_id: session.user.id });
    if (error) {
      setError("Помилка збереження");
    } else {
      setForm(emptyForm);
      setShowForm(false);
      loadData();
    }
    setSaving(false);
  }

  async function handleArchive(id: string) {
    await supabase.from("rabbits").update({ is_active: false }).eq("id", id);
    loadData();
  }

  return (
    <div className="registry-page">
      <div className="registry-header">
        <h1>🐇 Мої кролики</h1>
        <p className="registry-email">{session.user.email}</p>
        <button
          className="registry-archive-link"
          onClick={() => navigate("/archive")}
        >
          📦 Архів
        </button>
        <button
          className="registry-archive-link"
          onClick={() => navigate("/matings")}
        >
          🐇 Розведення
        </button>
        <button
          className="registry-archive-link"
          onClick={() => navigate("/paddocks")}
        >
          🏠 Підлогове
        </button>
        <button
          className="registry-archive-link"
          onClick={() => navigate("/fattening")}
        >
          🥩 Відгодівля
        </button>
        <button
          className="registry-add-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "✕ Скасувати" : "+ Додати кролика"}
        </button>
      </div>

      <div className="registry-stats">
        <div className="registry-stat-card total">
          <span className="registry-stat-value">{stats.total}</span>
          <span className="registry-stat-label">Всього</span>
        </div>
        <div className="registry-stat-card male">
          <span className="registry-stat-value">{stats.males}</span>
          <span className="registry-stat-label">Самців</span>
        </div>
        <div className="registry-stat-card female">
          <span className="registry-stat-value">{stats.females}</span>
          <span className="registry-stat-label">Самиць</span>
        </div>
        <div className="registry-stat-card young">
          <span className="registry-stat-value">{stats.youngTotal}</span>
          <span className="registry-stat-label">Молодняк</span>
          {stats.youngFromCages > 0 && (
            <span className="registry-stat-sub">
              З кліток: {stats.youngFromCages}
            </span>
          )}
          {stats.youngFromPaddocks > 0 && (
            <span className="registry-stat-sub">
              З підлог.: {stats.youngFromPaddocks}
            </span>
          )}
        </div>
        {stats.paddockFemales > 0 && (
          <div className="registry-stat-card paddock">
            <span className="registry-stat-value">{stats.paddockFemales}</span>
            <span className="registry-stat-label">Підлогове</span>
            <span className="registry-stat-sub">
              ♀ самок: {stats.paddockFemales}
            </span>
          </div>
        )}
        {stats.fatteningTotal > 0 && (
          <div className="registry-stat-card fattening">
            <span className="registry-stat-value">{stats.fatteningTotal}</span>
            <span className="registry-stat-label">Відгодівля</span>
            {(stats.fatteningMales > 0 || stats.fatteningFemales > 0) && (
              <span className="registry-stat-sub">
                {stats.fatteningMales > 0 && `♂ ${stats.fatteningMales} `}
                {stats.fatteningFemales > 0 && `♀ ${stats.fatteningFemales} `}
                {stats.fatteningUnknown > 0 && `? ${stats.fatteningUnknown}`}
              </span>
            )}
          </div>
        )}
      </div>

      {showForm && (
        <div className="registry-form">
          <h2>Новий кролик</h2>
          <div className="registry-form-grid">
            <input
              placeholder="Кличка *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              placeholder="Порода"
              value={form.breed}
              onChange={(e) => setForm({ ...form, breed: e.target.value })}
            />
            <select
              value={form.gender}
              onChange={(e) =>
                setForm({
                  ...form,
                  gender: e.target.value as "male" | "female",
                })
              }
            >
              <option value="female">Самиця</option>
              <option value="male">Самець</option>
            </select>
            <input
              type="date"
              value={form.birth_date}
              onChange={(e) => setForm({ ...form, birth_date: e.target.value })}
            />
            <input
              placeholder="Номер клітки"
              value={form.cage_number}
              onChange={(e) =>
                setForm({ ...form, cage_number: e.target.value })
              }
            />
            <input
              placeholder="Нотатки"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          {error && <p className="registry-error">{error}</p>}
          <button
            className="registry-save-btn"
            onClick={handleAdd}
            disabled={saving || !form.name}
          >
            {saving ? "Збереження..." : "Зберегти"}
          </button>
        </div>
      )}

      {loading ? (
        <p className="registry-loading">Завантаження...</p>
      ) : rabbits.length === 0 ? (
        <p className="registry-empty">Кроликів ще немає. Додайте першого!</p>
      ) : (
        <div className="registry-grid">
          {rabbits.map((rabbit) => (
            <div key={rabbit.id} className="rabbit-card">
              <div className="rabbit-card-header">
                <span className="rabbit-gender">
                  {rabbit.gender === "female" ? "♀" : "♂"}
                </span>
                <h3>{rabbit.name}</h3>
                {rabbit.cage_number && (
                  <span className="rabbit-cage">
                    Клітка {rabbit.cage_number}
                  </span>
                )}
              </div>
              <div className="rabbit-card-body">
                {rabbit.breed && (
                  <p>
                    <strong>Порода:</strong> {rabbit.breed}
                  </p>
                )}
                {rabbit.birth_date && (
                  <p>
                    <strong>Нар.:</strong>{" "}
                    {new Date(rabbit.birth_date).toLocaleDateString("uk-UA")}
                  </p>
                )}
                {rabbit.notes && <p className="rabbit-notes">{rabbit.notes}</p>}
              </div>
              <div className="rabbit-card-actions">
                <button
                  className="rabbit-edit-btn"
                  onClick={() => navigate(`/registry/edit/${rabbit.id}`)}
                >
                  Редагувати
                </button>
                <button
                  className="rabbit-archive-btn"
                  onClick={() => handleArchive(rabbit.id)}
                >
                  Архівувати
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
