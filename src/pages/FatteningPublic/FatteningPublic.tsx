import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { logError } from "../../lib/logError";
import "./FatteningPublic.css";

interface FatteningCage {
  id: string;
  cage_number: string;
  males: number;
  females: number;
  unknown: number;
  breed: string;
  birth_date: string;
  slaughter_date: string;
  notes: string;
}

type SizeCategory = "meat" | "large" | "decorative";

interface WeightInfo {
  weighing_date: string;
  weight_g: number;
  size_category: SizeCategory | null;
}

// ── Той самий довідник "орієнтовна вага за віком", що й у Weighing.tsx /
// RabbitPublic.tsx. Тримаємо копію тут, бо ця сторінка публічна й не
// тягне решту модуля зважування — лише статус останнього запису.
interface AgeWeightRow {
  ageDays: number;
  meat: [number, number];
  large: [number, number];
  decorative: [number, number];
}

const AGE_WEIGHT_TABLE: AgeWeightRow[] = [
  { ageDays: 0, meat: [40, 80], large: [60, 100], decorative: [30, 60] },
  { ageDays: 7, meat: [100, 150], large: [120, 180], decorative: [70, 100] },
  { ageDays: 14, meat: [200, 280], large: [250, 320], decorative: [150, 200] },
  { ageDays: 21, meat: [350, 450], large: [400, 520], decorative: [250, 320] },
  { ageDays: 28, meat: [500, 650], large: [600, 750], decorative: [350, 450] },
  { ageDays: 35, meat: [700, 900], large: [850, 1050], decorative: [450, 600] },
  {
    ageDays: 45,
    meat: [900, 1100],
    large: [1100, 1350],
    decorative: [600, 750],
  },
  {
    ageDays: 60,
    meat: [1300, 1600],
    large: [1600, 2000],
    decorative: [800, 1000],
  },
  {
    ageDays: 75,
    meat: [1800, 2200],
    large: [2200, 2700],
    decorative: [1000, 1300],
  },
  {
    ageDays: 90,
    meat: [2200, 2700],
    large: [2800, 3400],
    decorative: [1200, 1600],
  },
  {
    ageDays: 120,
    meat: [2800, 3400],
    large: [3500, 4500],
    decorative: [1500, 2000],
  },
  {
    ageDays: 182,
    meat: [3500, 4500],
    large: [4500, 6000],
    decorative: [1800, 2500],
  },
  {
    ageDays: 365,
    meat: [4000, 5500],
    large: [5500, 8000],
    decorative: [2000, 3000],
  },
];

function ageDaysAt(birthDate: string, atDate: string): number {
  const b = new Date(birthDate).getTime();
  const a = new Date(atDate).getTime();
  return Math.round((a - b) / (1000 * 60 * 60 * 24));
}

function getExpectedRange(
  ageDays: number,
  category: SizeCategory,
): [number, number] {
  const rows = AGE_WEIGHT_TABLE;
  const clampedAge = Math.max(0, ageDays);

  if (clampedAge <= rows[0].ageDays) return rows[0][category];
  if (clampedAge >= rows[rows.length - 1].ageDays) {
    return rows[rows.length - 1][category];
  }

  for (let i = 0; i < rows.length - 1; i++) {
    const a = rows[i];
    const b = rows[i + 1];
    if (clampedAge >= a.ageDays && clampedAge <= b.ageDays) {
      const t = (clampedAge - a.ageDays) / (b.ageDays - a.ageDays);
      const min = a[category][0] + t * (b[category][0] - a[category][0]);
      const max = a[category][1] + t * (b[category][1] - a[category][1]);
      return [Math.round(min), Math.round(max)];
    }
  }
  return rows[rows.length - 1][category];
}

type WeightZone = "green" | "yellow" | "red";

function zoneFromRange(
  value: number,
  [min, max]: [number, number],
): WeightZone {
  if (value < min) {
    return value >= min * 0.85 ? "yellow" : "red";
  }
  if (value > max) {
    return value <= max * 1.15 ? "yellow" : "red";
  }
  return "green";
}

const ZONE_LABEL: Record<WeightZone, string> = {
  green: "у нормі",
  yellow: "на межі норми",
  red: "поза нормою",
};

// Скільки днів від народження до планового забою за замовчуванням,
// якщо slaughter_date не вказана вручну.
const DEFAULT_DAYS_TO_SLAUGHTER = 110;

function calcSlaughterDate(birthDate: string): string {
  if (!birthDate) return "";
  const d = new Date(birthDate);
  d.setDate(d.getDate() + DEFAULT_DAYS_TO_SLAUGHTER);
  return d.toISOString().split("T")[0];
}

export default function FatteningPublic() {
  const { id } = useParams<{ id: string }>();
  const [cage, setCage] = useState<FatteningCage | null>(null);
  const [weight, setWeight] = useState<WeightInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function loadCage() {
      try {
        const { data, error } = await supabase
          .from("fattening")
          .select("*")
          .eq("id", id)
          .single();

        if (error || !data) {
          setNotFound(true);
          return;
        }

        setCage(data);

        // Останнє зважування цієї клітки відгодівлі.
        const { data: weighingsData, error: weighingsError } = await supabase
          .from("weighings")
          .select("weighing_date, weight_g, size_category")
          .eq("fattening_id", id)
          .order("weighing_date", { ascending: false })
          .limit(1);

        if (weighingsError) {
          logError("FatteningPublic:loadWeighings", weighingsError);
        } else if (weighingsData && weighingsData.length > 0) {
          setWeight(weighingsData[0]);
        }
      } catch (err) {
        logError("FatteningPublic:loadCage", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    loadCage();
  }, [id]);

  if (loading) {
    return (
      <div className="fp-wrap">
        <div className="fp-loading">Завантаження...</div>
      </div>
    );
  }

  if (notFound || !cage) {
    return (
      <div className="fp-wrap">
        <div className="fp-not-found">
          <div className="fp-not-found-icon">🥩</div>
          <h2>Клітку не знайдено</h2>
          <p>Можливо, її було видалено.</p>
        </div>
      </div>
    );
  }

  const total = (cage.males || 0) + (cage.females || 0) + (cage.unknown || 0);

  const birth = cage.birth_date ? new Date(cage.birth_date) : null;

  const slaughterStr =
    cage.slaughter_date ||
    (cage.birth_date ? calcSlaughterDate(cage.birth_date) : null);
  const slaughter = slaughterStr ? new Date(slaughterStr) : null;

  const today = new Date();
  const daysLeft = slaughter
    ? Math.ceil((slaughter.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const ageInDays = birth
    ? Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // Статус останньої ваги відносно норми за віком — рахуємо лише якщо
  // відома і дата народження клітки, і категорія породи запису.
  let weightZone: WeightZone | null = null;
  let weightRange: [number, number] | null = null;
  if (weight && cage.birth_date) {
    const category: SizeCategory = weight.size_category || "meat";
    const ageDays = ageDaysAt(cage.birth_date, weight.weighing_date);
    weightRange = getExpectedRange(ageDays, category);
    weightZone = zoneFromRange(weight.weight_g, weightRange);
  }

  return (
    <div className="fp-wrap">
      <div className="fp-card">
        <div className="fp-cage-header">
          <span className="fp-section-label">Відгодівля</span>
          <span className="fp-cage-label">Клітка</span>
          <span className="fp-cage-number">
            {cage.cage_number ? `№ ${cage.cage_number}` : "—"}
          </span>
        </div>

        <div className="fp-total-badge">Всього: {total} гол.</div>

        <div className="fp-info">
          {(cage.males > 0 || cage.females > 0 || cage.unknown > 0) && (
            <div className="fp-row">
              <span className="fp-row-label">Склад</span>
              <span className="fp-row-value fp-gender-row">
                {cage.males > 0 && <span>♂ {cage.males}</span>}
                {cage.females > 0 && <span>♀ {cage.females}</span>}
                {cage.unknown > 0 && <span>? {cage.unknown}</span>}
              </span>
            </div>
          )}

          {cage.breed && (
            <div className="fp-row">
              <span className="fp-row-label">Порода</span>
              <span className="fp-row-value">{cage.breed}</span>
            </div>
          )}

          {birth && (
            <div className="fp-row">
              <span className="fp-row-label">Дата народження</span>
              <span className="fp-row-value">
                {birth.toLocaleDateString("uk-UA")}
              </span>
            </div>
          )}

          {ageInDays !== null && (
            <div className="fp-row">
              <span className="fp-row-label">Вік</span>
              <span className="fp-row-value">{ageInDays} дн.</span>
            </div>
          )}

          {slaughter && (
            <div
              className={`fp-row fp-row--slaughter${daysLeft !== null && daysLeft <= 7 ? " fp-row--soon" : ""}`}
            >
              <span className="fp-row-label">Планова дата забою</span>
              <span className="fp-row-value">
                {slaughter.toLocaleDateString("uk-UA")}
                {daysLeft !== null && (
                  <span className="fp-days-left">
                    {daysLeft > 0
                      ? ` (через ${daysLeft} дн.)`
                      : daysLeft === 0
                        ? " (сьогодні!)"
                        : ` (прострочено на ${Math.abs(daysLeft)} дн.)`}
                  </span>
                )}
              </span>
            </div>
          )}

          {cage.notes && (
            <div className="fp-row fp-row--notes">
              <span className="fp-row-label">Нотатки</span>
              <span className="fp-row-value">{cage.notes}</span>
            </div>
          )}
        </div>

        {/* ── Остання вага ── */}
        {weight && (
          <div className="fp-weight-block">
            <div className="fp-weight-title">⚖️ Остання вага</div>
            <div className="fp-info fp-info--weight">
              <div className="fp-row">
                <span className="fp-row-label">Дата зважування</span>
                <span className="fp-row-value">
                  {new Date(weight.weighing_date).toLocaleDateString("uk-UA")}
                </span>
              </div>
              <div className="fp-row">
                <span className="fp-row-label">Вага</span>
                <span className="fp-row-value">
                  {weight.weight_g.toLocaleString("uk-UA")} г
                  {weightZone && (
                    <span
                      className={`fp-weight-zone fp-weight-zone-${weightZone}`}
                    >
                      {" "}
                      · {ZONE_LABEL[weightZone]}
                    </span>
                  )}
                </span>
              </div>
              {weightRange && (
                <div className="fp-row">
                  <span className="fp-row-label">Норма для віку</span>
                  <span className="fp-row-value">
                    {weightRange[0]}–{weightRange[1]} г
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="fp-footer">
          <span>🐇 Кролівництво від А до Я</span>
        </div>
      </div>
    </div>
  );
}
