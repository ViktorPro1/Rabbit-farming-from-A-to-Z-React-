import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import "./MyTreatments.css";

interface Props {
  session: Session;
}

interface TreatmentRecord {
  id: string;
  cage_number: string;
  drug_name: string;
  drug_key: string | null;
  route: string | null;
  course_days: number | null;
  date: string;
  next_date: string | null;
  notes: string | null;
}

// ─── Способи введення ───
const ROUTE_OPTIONS = [
  "Орально (з водою)",
  "Орально (шприц/у корм)",
  "Ін'єкція",
  "Зовнішнє (краплі/мазь/spot-on)",
];

// ─── Довідник препаратів ───
// Джерела: fermer.blog, pesyk.kiev.ua, MSD Veterinary Manual, Laboklin Vet, Veterinary Evidence 2022
type DrugCategory =
  | "Кокцидіоз"
  | "Паразити"
  | "Антибіотики"
  | "Антисептики/підтримка"
  | "Вітаміни/добавки"
  | "Інше";

interface DrugInfo {
  label: string;
  category: DrugCategory;
  indication: string;
  dose: string;
  route: string;
  interval_days: number;
  course_days: number;
  source: string;
  warning?: string;
  season_tip?: string; // підказка по сезону
}

const DRUG_CATALOG: Record<string, DrugInfo> = {
  // ── КОКЦИДІОЗ ──
  baycox: {
    label: "Байкокс 2.5% (толтразурил)",
    category: "Кокцидіоз",
    indication: "Лікування та профілактика кокцидіозу",
    dose: "1 мл на 10 л води, випоювати 2 дні підряд. Або 7 мг/кг живої ваги",
    route: "Орально (з водою)",
    interval_days: 90,
    course_days: 2,
    source: "fermer.blog / lifehacker.org.ua / MSD Veterinary Manual",
    warning:
      "Повторити курс через 5 днів при важкій формі. Не забивати 30 днів після лікування",
    season_tip: "Пік ризику: весна та літо. Профілактика щоквартально",
  },
  solikoks: {
    label: "Солікокс (диклазурил)",
    category: "Кокцидіоз",
    indication: "Лікування та профілактика кокцидіозу",
    dose: "Лікування: 0.4 мл/кг у воду, 2 дні. Профілактика: 0.2 мл/кг, 2 дні на місяць",
    route: "Орально (з водою)",
    interval_days: 30,
    course_days: 2,
    source: "fermeru.biz.ua / nastanova.com / Laboklin Vet",
    warning:
      "Деякі кролики п'ють неохоче через запах — контролювати споживання",
    season_tip:
      "Найчастіше застосовують після відлучення кроленят (30–40 днів)",
  },
  sulfaquinoxaline: {
    label: "Сульфаквіноксалін",
    category: "Кокцидіоз",
    indication: "Профілактика гепатального кокцидіозу",
    dose: "0.04% безперервно у воді протягом 30 днів",
    route: "Орально (з водою)",
    interval_days: 37,
    course_days: 30,
    source: "MSD Veterinary Manual (revised 2024)",
    warning: "Ефективний тільки разом із санітарними заходами",
  },

  // ── ПАРАЗИТИ ──
  ivermectin: {
    label: "Івермектин (Івомек)",
    category: "Паразити",
    indication: "Зовнішні паразити: кліщі, короста, воші",
    dose: "0.3–0.5 мг/кг підшкірно",
    route: "Ін'єкція",
    interval_days: 10,
    course_days: 1,
    source: "Veterinary Evidence 2022 / Acta Vet. Scand. 2008",
    warning: "Повторити через 7–14 днів для знищення личинок",
    season_tip: "Весна/літо — підвищений ризик зовнішніх паразитів",
  },
  selamectin: {
    label: "Селамектин (Революшн)",
    category: "Паразити",
    indication: "Зовнішні паразити (Cheyletiella, кліщі вух)",
    dose: "6–20 мг/кг spot-on на холку",
    route: "Зовнішнє (краплі/мазь/spot-on)",
    interval_days: 21,
    course_days: 1,
    source: "Veterinary Evidence 2022",
  },
  fenbendazole: {
    label: "Фенбендазол (Панакур)",
    category: "Паразити",
    indication: "Глисти (нематоди), Encephalitozoon cuniculi",
    dose: "20 мг/кг перорально 1 раз/день",
    route: "Орально (шприц/у корм)",
    interval_days: 14,
    course_days: 5,
    source: "Laboklin Vet / Everbreed",
    warning: "Повторити через 14 днів",
  },
  mebendazole: {
    label: "Мебендазол",
    category: "Паразити",
    indication: "Нематоди (глисти)",
    dose: "20 мг/кг перорально 1 раз/день",
    route: "Орально (шприц/у корм)",
    interval_days: 14,
    course_days: 3,
    source: "Laboklin Vet",
    warning: "Повторити через 14 днів",
  },

  // ── АНТИБІОТИКИ ──
  baytril: {
    label: "Байтрил 10% (енрофлоксацин)",
    category: "Антибіотики",
    indication: "Бактеріальні інфекції, пастерельоз, респіраторні хвороби",
    dose: "5 мг/кг підшкірно 1 раз/день. Або 5 мл 10%-го на 10 л води",
    route: "Ін'єкція",
    interval_days: 0,
    course_days: 5,
    source: "goodhouse.com.ua / mobihelp.kiev.ua",
    warning:
      "Не застосовувати вагітним і лактуючим самкам. Тільки за призначенням ветлікаря",
  },
  tetracycline: {
    label: "Тетрациклін",
    category: "Антибіотики",
    indication: "Бактеріальні інфекції (пастерельоз, сальмонельоз)",
    dose: "20 мг/кг перорально 2 рази/день",
    route: "Орально (шприц/у корм)",
    interval_days: 0,
    course_days: 5,
    source: "MSD Veterinary Manual",
    warning: "Не поєднувати з молочними продуктами та препаратами кальцію",
  },

  // ── АНТИСЕПТИКИ / ПІДТРИМКА ──
  lactic_acid: {
    label: "Молочна кислота",
    category: "Антисептики/підтримка",
    indication:
      "Метеоризм, здуття, ентерит, гастрит, дезінфекція ран, профілактика інфекцій ШКТ",
    dose: "Перорально: 4 мл розчину на воду, 5 днів. Зовнішньо: вищої концентрації для обробки ран",
    route: "Орально (з водою)",
    interval_days: 30,
    course_days: 5,
    source: "fermer.blog / dovidkam.com / poradum.com.ua",
    warning:
      "Застосовувати не раніше ніж з 1.5-місячного віку. Зовнішньо — вища концентрація, внутрішньо — менша",
    season_tip: "Актуально при введенні зеленої маси в раціон",
  },
  iodine: {
    label: "Йод (розчин)",
    category: "Антисептики/підтримка",
    indication:
      "Профілактика кокцидіозу, підтримка імунітету, зовнішня обробка ран",
    dose: "Фаза 1: 0.01% розчин, 50 мл/особину/день, 10 днів. Пауза 5 днів. Фаза 2: 0.02% розчин, 70 мл/особину/день, 7 днів",
    route: "Орально (з водою)",
    interval_days: 22,
    course_days: 10,
    source: "pesyk.kiev.ua / fermer.blog / lifehacker.org.ua",
    warning:
      "Не використовувати металевий посуд — тільки скло або пластик. Не замінює Байкокс при активному кокцидіозі",
    season_tip: "Схема для кроленят після відлучення від мами",
  },

  // ── ВІТАМІНИ / ДОБАВКИ ──
  vitamins_adek: {
    label: "Вітаміни A, D, E, K (комплекс)",
    category: "Вітаміни/добавки",
    indication:
      "Профілактика авітамінозу, підтримка імунітету, репродуктивна функція",
    dose: "За інструкцією до конкретного препарату",
    route: "Орально (шприц/у корм)",
    interval_days: 90,
    course_days: 7,
    source: "Загальна ветеринарна практика",
    season_tip: "Особливо важливо взимку та навесні",
  },
  fish_oil: {
    label: "Риб'ячий жир",
    category: "Вітаміни/добавки",
    indication: "Джерело вітамінів A і D, підтримка шерсті та імунітету",
    dose: "0.5–1 мл на особину, додавати в корм",
    route: "Орально (шприц/у корм)",
    interval_days: 30,
    course_days: 14,
    source: "Загальна ветеринарна практика кролівників",
    season_tip: "Восени та взимку при нестачі сонця",
  },
  probiotics: {
    label: "Пробіотики (Лактобіфадол, Ветом тощо)",
    category: "Вітаміни/добавки",
    indication:
      "Відновлення мікрофлори після антибіотиків, профілактика дисбактеріозу",
    dose: "За інструкцією до конкретного препарату",
    route: "Орально (шприц/у корм)",
    interval_days: 0,
    course_days: 7,
    source: "Загальна ветеринарна практика",
    warning: "Давати після антибіотикотерапії або паралельно",
  },

  // ── ІНШЕ ──
  custom: {
    label: "Інший препарат...",
    category: "Інше",
    indication: "",
    dose: "",
    route: "",
    interval_days: 0,
    course_days: 1,
    source: "",
  },
};

// ─── Групування для select ───
const DRUG_CATEGORIES: DrugCategory[] = [
  "Кокцидіоз",
  "Паразити",
  "Антибіотики",
  "Антисептики/підтримка",
  "Вітаміни/добавки",
  "Інше",
];

// ─── Сезонні рекомендації ───
function getSeasonalRecommendations(): { drug_key: string; reason: string }[] {
  const month = new Date().getMonth() + 1; // 1–12
  const recs: { drug_key: string; reason: string }[] = [];

  if (month >= 3 && month <= 6) {
    recs.push({
      drug_key: "baycox",
      reason: "Весна — пік кокцидіозу. Час профілактики Байкоксом",
    });
    recs.push({
      drug_key: "ivermectin",
      reason: "Весна — активізація зовнішніх паразитів",
    });
    recs.push({
      drug_key: "solikoks",
      reason:
        "Весна — відлучення молодняку, профілактика кокцидіозу Солікоксом",
    });
  }
  if (month >= 6 && month <= 8) {
    recs.push({
      drug_key: "lactic_acid",
      reason: "Літо — ризик ентериту при зеленій масі",
    });
    recs.push({
      drug_key: "solikoks",
      reason: "Літо — пік кокцидіозу у молодняку після відлучення",
    });
  }
  if (month >= 9 && month <= 11) {
    recs.push({
      drug_key: "vitamins_adek",
      reason: "Осінь — підготовка до зими, вітаміни A, D, E",
    });
    recs.push({
      drug_key: "fenbendazole",
      reason: "Осінь — планова дегельмінтизація",
    });
  }
  if (month === 12 || month <= 2) {
    recs.push({
      drug_key: "vitamins_adek",
      reason: "Зима — нестача вітаміну D, підтримка імунітету",
    });
    recs.push({
      drug_key: "fish_oil",
      reason: "Зима — риб'ячий жир як джерело вітамінів A і D",
    });
  }
  return recs;
}

const emptyForm = {
  cage_number: "",
  drug_key: "toltrazuril",
  drug_name: "",
  route: "",
  course_days: "",
  date: "",
  next_date: "",
  notes: "",
};

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
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
  return diff >= 0 && diff <= 3;
}

function isToday(next_date: string | null) {
  if (!next_date) return false;
  return next_date === todayStr();
}

function getRouteIcon(route: string | null): string {
  if (!route) return "";
  if (route.includes("Ін'єкція")) return "💉";
  if (route.includes("Зовнішнє")) return "🧴";
  return "💧"; // орально (з водою / шприц-корм)
}

export default function MyTreatments({ session }: Props) {
  const [records, setRecords] = useState<TreatmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [infoKey, setInfoKey] = useState<string | null>(null);
  const [editRecord, setEditRecord] = useState<TreatmentRecord | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [showSeasonInfo, setShowSeasonInfo] = useState(false);
  const navigate = useNavigate();

  function openEdit(r: TreatmentRecord) {
    setEditRecord({ ...r });
    setEditError("");
  }

  function handleEditDateOrCourse(
    field: "date" | "course_days",
    value: string,
  ) {
    if (!editRecord) return;
    const updated = {
      ...editRecord,
      [field]:
        field === "course_days" ? (value ? parseInt(value, 10) : null) : value,
    };
    if (updated.date && updated.course_days && updated.course_days > 0) {
      updated.next_date = addDays(updated.date, updated.course_days);
    }
    setEditRecord(updated);
  }

  async function handleSaveEdit() {
    if (!editRecord) return;
    setEditSaving(true);
    setEditError("");
    const { error: dbErr } = await supabase
      .from("treatments")
      .update({
        cage_number: editRecord.cage_number,
        drug_name: editRecord.drug_name,
        drug_key: editRecord.drug_key,
        route: editRecord.route || null,
        course_days: editRecord.course_days,
        date: editRecord.date,
        next_date: editRecord.next_date || null,
        notes: editRecord.notes || null,
      })
      .eq("id", editRecord.id);
    if (dbErr) {
      setEditError("Помилка збереження");
    } else {
      setEditRecord(null);
      loadData();
    }
    setEditSaving(false);
  }

  const loadData = useCallback(() => {
    supabase
      .from("treatments")
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

  // Автоматичний розрахунок next_date при зміні дати або курсу
  function handleDateOrCourseChange(
    field: "date" | "course_days",
    value: string,
  ) {
    const updated = { ...form, [field]: value };
    const days = parseInt(updated.course_days, 10);
    if (updated.date && days > 0) {
      updated.next_date = addDays(updated.date, days);
    }
    setForm(updated);
  }

  // При виборі препарату — підставляємо дані з каталогу
  function handleDrugSelect(key: string) {
    const drug = DRUG_CATALOG[key];
    if (!drug) return;
    const updated = {
      ...form,
      drug_key: key,
      drug_name: key === "custom" ? "" : drug.label,
      route: key === "custom" ? "" : drug.route,
      course_days: key === "custom" ? "" : String(drug.interval_days),
    };
    if (updated.date && key !== "custom") {
      updated.next_date = addDays(updated.date, drug.interval_days);
    }
    setForm(updated);
  }

  async function handleAdd() {
    setSaving(true);
    setError("");
    const { error: dbErr } = await supabase.from("treatments").insert({
      cage_number: form.cage_number,
      drug_name:
        form.drug_key === "custom"
          ? form.drug_name
          : DRUG_CATALOG[form.drug_key]?.label || form.drug_name,
      drug_key: form.drug_key === "custom" ? null : form.drug_key,
      route: form.route || null,
      course_days: form.course_days ? parseInt(form.course_days, 10) : null,
      date: form.date,
      next_date: form.next_date || null,
      notes: form.notes || null,
      user_id: session.user.id,
    });
    if (dbErr) {
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
    await supabase.from("treatments").delete().eq("id", id);
    loadData();
  }

  // Записи на сьогодні
  const todayRecords = records.filter((r) => isToday(r.next_date));
  const overdueRecords = records.filter(
    (r) => isOverdue(r.next_date) && !isToday(r.next_date),
  );

  const isCustom = form.drug_key === "custom";
  const selectedDrug =
    form.drug_key && form.drug_key !== "custom"
      ? DRUG_CATALOG[form.drug_key]
      : null;

  const seasonalRecs = getSeasonalRecommendations();

  return (
    <div className="mytreat-page">
      <div className="mytreat-header">
        <button
          className="mytreat-back-btn"
          onClick={() => navigate("/registry")}
        >
          &#8592; Мої кролики
        </button>
        <h1>&#128138; Лікування</h1>
        <button
          className="mytreat-add-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "\u2715 Скасувати" : "+ Додати запис"}
        </button>
      </div>

      {/* ── СЬОГОДНІ ── */}
      {todayRecords.length > 0 && (
        <div className="mytreat-today-block">
          <h2 className="mytreat-today-title">
            &#9200; Сьогодні потрібно дати
          </h2>
          <div className="mytreat-today-grid">
            {todayRecords.map((r) => {
              const info = r.drug_key ? DRUG_CATALOG[r.drug_key] : null;
              return (
                <div key={r.id} className="mytreat-today-card">
                  <span className="mytreat-today-cage">
                    Клітка {r.cage_number}
                  </span>
                  <p className="mytreat-today-drug">{r.drug_name}</p>
                  {r.route && (
                    <p className="mytreat-today-route">
                      {getRouteIcon(r.route)} {r.route}
                    </p>
                  )}
                  {info && (
                    <p className="mytreat-today-dose">&#128202; {info.dose}</p>
                  )}
                  {info?.warning && (
                    <p className="mytreat-today-warn">
                      &#9888;&#65039; {info.warning}
                    </p>
                  )}
                  {r.notes && <p className="mytreat-today-notes">{r.notes}</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── ПРОСТРОЧЕНО ── */}
      {overdueRecords.length > 0 && (
        <div className="mytreat-overdue-block">
          <h2 className="mytreat-overdue-title">
            &#9888;&#65039; Прострочено ({overdueRecords.length})
          </h2>
          <div className="mytreat-today-grid">
            {overdueRecords.map((r) => (
              <div key={r.id} className="mytreat-today-card overdue-card">
                <span className="mytreat-today-cage">
                  Клітка {r.cage_number}
                </span>
                <p className="mytreat-today-drug">{r.drug_name}</p>
                <p className="mytreat-overdue-date">
                  Мало бути:{" "}
                  {new Date(r.next_date!).toLocaleDateString("uk-UA")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ФОРМА ДОДАВАННЯ ── */}
      {showForm && (
        <div className="mytreat-form">
          <h2>Новий запис</h2>
          <div className="mytreat-form-grid">
            <input
              placeholder="Номер клітки *"
              value={form.cage_number}
              onChange={(e) =>
                setForm({ ...form, cage_number: e.target.value })
              }
            />

            {/* Вибір препарату */}
            <div className="mytreat-field-wrap">
              <label>Препарат *</label>
              <select
                value={form.drug_key}
                onChange={(e) => handleDrugSelect(e.target.value)}
              >
                {DRUG_CATEGORIES.map((cat) => {
                  const drugs = Object.entries(DRUG_CATALOG).filter(
                    ([, d]) => d.category === cat,
                  );
                  if (drugs.length === 0) return null;
                  return (
                    <optgroup key={cat} label={`── ${cat} ──`}>
                      {drugs.map(([key, d]) => (
                        <option key={key} value={key}>
                          {d.label}
                        </option>
                      ))}
                    </optgroup>
                  );
                })}
              </select>
            </div>

            {/* Ручне введення якщо "Інший" */}
            {isCustom && (
              <input
                placeholder="Назва препарату *"
                value={form.drug_name}
                onChange={(e) =>
                  setForm({ ...form, drug_name: e.target.value })
                }
              />
            )}

            {/* Спосіб введення */}
            <div className="mytreat-field-wrap">
              <label>Спосіб введення *</label>
              <select
                value={form.route}
                onChange={(e) => setForm({ ...form, route: e.target.value })}
              >
                <option value="">— Оберіть —</option>
                {ROUTE_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Довідка по вибраному препарату */}
            {selectedDrug && (
              <div className="mytreat-drug-info">
                <button
                  className="mytreat-info-toggle"
                  onClick={() =>
                    setInfoKey(infoKey === form.drug_key ? null : form.drug_key)
                  }
                >
                  &#128203; Довідка по препарату{" "}
                  {infoKey === form.drug_key ? "▲" : "▼"}
                </button>
                {infoKey === form.drug_key && (
                  <div className="mytreat-drug-details">
                    <p>
                      <b>Показання:</b> {selectedDrug.indication}
                    </p>
                    <p>
                      <b>Спосіб введення:</b> {selectedDrug.route}
                    </p>
                    <p>
                      <b>Доза:</b> {selectedDrug.dose}
                    </p>
                    <p>
                      <b>Курс:</b> {selectedDrug.course_days} дн., інтервал до
                      наступного: {selectedDrug.interval_days} дн.
                    </p>
                    {selectedDrug.warning && (
                      <p className="drug-warning">
                        &#9888;&#65039; {selectedDrug.warning}
                      </p>
                    )}
                    <p className="drug-source">
                      &#128218; Джерело: {selectedDrug.source}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Дата прийому */}
            <div className="mytreat-field-wrap">
              <label>Дата прийому *</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  handleDateOrCourseChange("date", e.target.value)
                }
              />
            </div>

            {/* Інтервал до наступного */}
            <div className="mytreat-field-wrap">
              <label>Через скільки днів повтор</label>
              <input
                type="number"
                min="1"
                placeholder="Авто з препарату"
                value={form.course_days}
                onChange={(e) =>
                  handleDateOrCourseChange("course_days", e.target.value)
                }
              />
            </div>

            {/* Наступна дата (авто або ручна) */}
            <div className="mytreat-field-wrap">
              <label>Наступний прийом (авто)</label>
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

          {error && <p className="mytreat-error">{error}</p>}
          <button
            className="mytreat-save-btn"
            onClick={handleAdd}
            disabled={
              saving ||
              !form.cage_number ||
              (!isCustom ? !form.drug_key : !form.drug_name) ||
              !form.route ||
              !form.date
            }
          >
            {saving ? "Збереження..." : "Зберегти"}
          </button>
        </div>
      )}

      {/* ── ВСІ ЗАПИСИ ── */}
      {loading ? (
        <p className="mytreat-loading">Завантаження...</p>
      ) : records.length === 0 ? (
        <div className="mytreat-empty-state">
          <div className="mytreat-empty-illustration">💊</div>
          <h3 className="mytreat-empty-title">Записів лікування ще немає</h3>
          <p className="mytreat-empty-desc">
            Додайте перший запис — оберіть препарат зі списку, спосіб введення,
            вкажіть клітку і дату. Система автоматично розрахує дату наступного
            прийому.
          </p>
        </div>
      ) : (
        <>
          <h2 className="mytreat-all-title">Усі записи</h2>
          <div className="mytreat-grid">
            {records.map((r) => {
              const info = r.drug_key ? DRUG_CATALOG[r.drug_key] : null;
              return (
                <div
                  key={r.id}
                  className={`mytreat-card ${
                    isToday(r.next_date)
                      ? "today"
                      : isOverdue(r.next_date)
                        ? "overdue"
                        : isSoon(r.next_date)
                          ? "soon"
                          : ""
                  }`}
                >
                  <div className="mytreat-card-top">
                    <span className="mytreat-cage">Клітка {r.cage_number}</span>
                    {isToday(r.next_date) && (
                      <span className="badge badge-today">Сьогодні</span>
                    )}
                    {isOverdue(r.next_date) && !isToday(r.next_date) && (
                      <span className="badge badge-overdue">Прострочено</span>
                    )}
                    {isSoon(r.next_date) && !isToday(r.next_date) && (
                      <span className="badge badge-soon">Скоро</span>
                    )}
                  </div>
                  <p className="mytreat-drug">{r.drug_name}</p>
                  {r.route && (
                    <p className="mytreat-route">
                      {getRouteIcon(r.route)} {r.route}
                    </p>
                  )}
                  {info && (
                    <p className="mytreat-indication">{info.indication}</p>
                  )}
                  <p className="mytreat-date">
                    Дата: {new Date(r.date).toLocaleDateString("uk-UA")}
                  </p>
                  {r.next_date && (
                    <p
                      className={`mytreat-next ${
                        isOverdue(r.next_date)
                          ? "text-overdue"
                          : isSoon(r.next_date)
                            ? "text-soon"
                            : ""
                      }`}
                    >
                      Наступний:{" "}
                      {new Date(r.next_date).toLocaleDateString("uk-UA")}
                    </p>
                  )}
                  {info?.dose && (
                    <p className="mytreat-dose-hint">&#128202; {info.dose}</p>
                  )}
                  {r.notes && <p className="mytreat-notes">{r.notes}</p>}
                  <div className="mytreat-card-actions">
                    <button
                      className="mytreat-edit-btn"
                      onClick={() => openEdit(r)}
                    >
                      Редагувати
                    </button>
                    <button
                      className="mytreat-delete-btn"
                      onClick={() => handleDelete(r.id)}
                    >
                      Видалити
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── СЕЗОННІ РЕКОМЕНДАЦІЇ ── */}
      {/* ── СЕЗОННІ РЕКОМЕНДАЦІЇ ── */}
      {seasonalRecs.length > 0 && (
        <div className="mytreat-season-block">
          <button
            className="mytreat-season-toggle"
            onClick={() => setShowSeasonInfo(!showSeasonInfo)}
          >
            <span>🌱 Сезонні рекомендації</span>
            <span>{showSeasonInfo ? "▲" : "▼"}</span>
          </button>

          {showSeasonInfo && (
            <>
              <div className="mytreat-season-grid">
                {seasonalRecs.map(({ drug_key, reason }) => {
                  const drug = DRUG_CATALOG[drug_key];
                  if (!drug) return null;

                  return (
                    <div key={drug_key} className="mytreat-season-card">
                      <p className="mytreat-season-drug">{drug.label}</p>
                      <p className="mytreat-season-reason">{reason}</p>
                    </div>
                  );
                })}
              </div>

              <p className="mytreat-season-disclaimer">
                ⚠️ Рекомендації загальні. Конкретну схему узгоджуйте з
                ветлікарем.
              </p>
            </>
          )}
        </div>
      )}

      {/* ── МОДАЛКА РЕДАГУВАННЯ ── */}
      {editRecord && (
        <div
          className="mytreat-modal-overlay"
          onClick={() => setEditRecord(null)}
        >
          <div className="mytreat-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mytreat-modal-header">
              <h2>&#9998; Редагувати запис</h2>
              <button
                className="mytreat-modal-close"
                onClick={() => setEditRecord(null)}
              >
                &#10005;
              </button>
            </div>
            <div className="mytreat-form-grid">
              <input
                placeholder="Номер клітки *"
                value={editRecord.cage_number}
                onChange={(e) =>
                  setEditRecord({ ...editRecord, cage_number: e.target.value })
                }
              />
              <input
                placeholder="Препарат *"
                value={editRecord.drug_name}
                onChange={(e) =>
                  setEditRecord({ ...editRecord, drug_name: e.target.value })
                }
              />
              <div className="mytreat-field-wrap">
                <label>Спосіб введення *</label>
                <select
                  value={editRecord.route ?? ""}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, route: e.target.value })
                  }
                >
                  <option value="">— Оберіть —</option>
                  {ROUTE_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mytreat-field-wrap">
                <label>Дата прийому *</label>
                <input
                  type="date"
                  value={editRecord.date}
                  onChange={(e) =>
                    handleEditDateOrCourse("date", e.target.value)
                  }
                />
              </div>
              <div className="mytreat-field-wrap">
                <label>Через скільки днів повтор</label>
                <input
                  type="number"
                  min="1"
                  value={editRecord.course_days ?? ""}
                  onChange={(e) =>
                    handleEditDateOrCourse("course_days", e.target.value)
                  }
                />
              </div>
              <div className="mytreat-field-wrap">
                <label>Наступний прийом</label>
                <input
                  type="date"
                  value={editRecord.next_date ?? ""}
                  onChange={(e) =>
                    setEditRecord({ ...editRecord, next_date: e.target.value })
                  }
                />
              </div>
              <input
                placeholder="Нотатки"
                value={editRecord.notes ?? ""}
                onChange={(e) =>
                  setEditRecord({ ...editRecord, notes: e.target.value })
                }
              />
            </div>
            {editError && <p className="mytreat-error">{editError}</p>}
            <div className="mytreat-modal-actions">
              <button
                className="mytreat-cancel-btn"
                onClick={() => setEditRecord(null)}
              >
                Скасувати
              </button>
              <button
                className="mytreat-save-btn"
                onClick={handleSaveEdit}
                disabled={
                  editSaving ||
                  !editRecord.cage_number ||
                  !editRecord.drug_name ||
                  !editRecord.date
                }
              >
                {editSaving ? "Збереження..." : "Зберегти"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
