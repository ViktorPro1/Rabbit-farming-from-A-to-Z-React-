import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { logError } from "../../lib/logError";
import { calcAgeLabel } from "../../utils/calcAge";
import "./RabbitPublic.css";

interface Rabbit {
  id: string;
  name: string;
  breed: string;
  gender: "male" | "female";
  birth_date: string;
  cage_number: string;
  notes: string;
}

interface MatingInfo {
  mating_date: string;
  control_date: string | null;
  expected_birth: string | null;
  last_litter_birth: string | null;
  last_litter_alive: number | null;
}

type SizeCategory = "meat" | "large" | "decorative";

interface WeightInfo {
  weighing_date: string;
  weight_g: number;
  size_category: SizeCategory | null;
}

// ── Той самий довідник "орієнтовна вага за віком", що й у Weighing.tsx ──
// Тримаємо копію тут, бо ця сторінка публічна й не тягне решту модуля
// зважування — лише статус останнього запису.
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

export default function RabbitPublic() {
  const { id } = useParams<{ id: string }>();
  const [rabbit, setRabbit] = useState<Rabbit | null>(null);
  const [mating, setMating] = useState<MatingInfo | null>(null);
  const [weight, setWeight] = useState<WeightInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function loadRabbit() {
      try {
        const { data: rabbitData, error: rabbitError } = await supabase
          .from("rabbits")
          .select("*")
          .eq("id", id)
          .single();

        if (rabbitError || !rabbitData) {
          setNotFound(true);
          return;
        }

        setRabbit(rabbitData);

        // Остання злучка де цей кролик є самцем або самицею
        const { data: matingsData, error: matingsError } = await supabase
          .from("matings")
          .select("id, mating_date, control_date, expected_birth")
          .or(`male_id.eq.${id},female_id.eq.${id}`)
          .order("mating_date", { ascending: false })
          .limit(1);

        if (matingsError) {
          logError("RabbitPublic:loadMatings", matingsError);
        } else if (matingsData && matingsData.length > 0) {
          const lastMating = matingsData[0];

          // Останній окріл по цій злучці.
          // Один mating може мати кілька окролів (повторні злучки тієї ж
          // пари записуються в litter_mating_date/litter_control_date/
          // litter_expected_birth окролу, а не в дати самого mating) —
          // тому беремо ці поля теж, щоб не показати дату першої злучки
          // поруч із результатом фактично іншої, пізнішої.
          const { data: littersData, error: littersError } = await supabase
            .from("litters")
            .select(
              "birth_date, alive, litter_mating_date, litter_control_date, litter_expected_birth",
            )
            .eq("mating_id", lastMating.id)
            .order("birth_date", { ascending: false })
            .limit(1);

          if (littersError) {
            logError("RabbitPublic:loadLitters", littersError);
          }

          const lastLitter =
            littersData && littersData.length > 0 ? littersData[0] : null;

          setMating({
            mating_date:
              lastLitter?.litter_mating_date || lastMating.mating_date,
            control_date:
              lastLitter?.litter_control_date ||
              lastMating.control_date ||
              null,
            expected_birth:
              lastLitter?.litter_expected_birth ||
              lastMating.expected_birth ||
              null,
            last_litter_birth: lastLitter?.birth_date || null,
            last_litter_alive: lastLitter?.alive ?? null,
          });
        }

        // Останнє зважування цього кролика (breeding-записи прив'язані
        // через rabbit_id; fattening-клітки сюди не потрапляють, бо
        // публічна сторінка показує конкретного кролика з реєстру).
        const { data: weighingsData, error: weighingsError } = await supabase
          .from("weighings")
          .select("weighing_date, weight_g, size_category")
          .eq("rabbit_id", id)
          .order("weighing_date", { ascending: false })
          .limit(1);

        if (weighingsError) {
          logError("RabbitPublic:loadWeighings", weighingsError);
        } else if (weighingsData && weighingsData.length > 0) {
          setWeight(weighingsData[0]);
        }
      } catch (err) {
        logError("RabbitPublic:loadRabbit", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    loadRabbit();
  }, [id]);

  if (loading) {
    return (
      <div className="rp-wrap">
        <div className="rp-loading">Завантаження...</div>
      </div>
    );
  }

  if (notFound || !rabbit) {
    return (
      <div className="rp-wrap">
        <div className="rp-not-found">
          <div className="rp-not-found-icon">🐇</div>
          <h2>Кролика не знайдено</h2>
          <p>Можливо, його було видалено або архівовано.</p>
        </div>
      </div>
    );
  }

  const birth = rabbit.birth_date ? new Date(rabbit.birth_date) : null;
  const age = rabbit.birth_date ? calcAgeLabel(rabbit.birth_date) : "";

  // Статус останньої ваги відносно норми за віком — рахуємо лише якщо
  // відома і дата народження кролика, і категорія породи запису.
  let weightZone: WeightZone | null = null;
  let weightRange: [number, number] | null = null;
  if (weight && rabbit.birth_date) {
    const category: SizeCategory = weight.size_category || "meat";
    const ageDays = ageDaysAt(rabbit.birth_date, weight.weighing_date);
    weightRange = getExpectedRange(ageDays, category);
    weightZone = zoneFromRange(weight.weight_g, weightRange);
  }

  return (
    <div className="rp-wrap">
      <div className="rp-card">
        {/* ── Клітка ── */}
        <div className="rp-cage-header">
          <span className="rp-cage-label">Клітка</span>
          <span className="rp-cage-number">
            {rabbit.cage_number ? `№ ${rabbit.cage_number}` : "—"}
          </span>
        </div>

        <div className="rp-gender-badge">
          {rabbit.gender === "female" ? "♀ Самиця" : "♂ Самець"}
        </div>

        <h1 className="rp-name">{rabbit.name}</h1>

        {/* ── Основна інформація ── */}
        <div className="rp-info">
          {rabbit.breed && (
            <div className="rp-row">
              <span className="rp-row-label">Порода</span>
              <span className="rp-row-value">{rabbit.breed}</span>
            </div>
          )}
          {birth && (
            <div className="rp-row">
              <span className="rp-row-label">Дата народження</span>
              <span className="rp-row-value">
                {birth.toLocaleDateString("uk-UA")}
              </span>
            </div>
          )}
          {age && (
            <div className="rp-row">
              <span className="rp-row-label">Вік</span>
              <span className="rp-row-value">{age}</span>
            </div>
          )}
          {rabbit.notes && (
            <div className="rp-row rp-row--notes">
              <span className="rp-row-label">Нотатки</span>
              <span className="rp-row-value">{rabbit.notes}</span>
            </div>
          )}
        </div>

        {/* ── Остання вага ── */}
        {weight && (
          <div className="rp-weight-block">
            <div className="rp-weight-title"> Остання вага</div>
            <div className="rp-info rp-info--weight">
              <div className="rp-row">
                <span className="rp-row-label">Дата зважування</span>
                <span className="rp-row-value">
                  {new Date(weight.weighing_date).toLocaleDateString("uk-UA")}
                </span>
              </div>
              <div className="rp-row">
                <span className="rp-row-label">Вага</span>
                <span className="rp-row-value">
                  {weight.weight_g.toLocaleString("uk-UA")} г
                  {weightZone && (
                    <span
                      className={`rp-weight-zone rp-weight-zone-${weightZone}`}
                    >
                      {" "}
                      · {ZONE_LABEL[weightZone]}
                    </span>
                  )}
                </span>
              </div>
              {weightRange && (
                <div className="rp-row">
                  <span className="rp-row-label">Норма для віку</span>
                  <span className="rp-row-value">
                    {weightRange[0]}–{weightRange[1]} г
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Остання злучка ── */}
        {mating && (
          <div className="rp-mating-block">
            <div className="rp-mating-title">🐇 Остання злучка</div>
            <div className="rp-info rp-info--mating">
              <div className="rp-row">
                <span className="rp-row-label">Дата злучки</span>
                <span className="rp-row-value">
                  {new Date(mating.mating_date).toLocaleDateString("uk-UA")}
                </span>
              </div>

              {mating.control_date && (
                <div className="rp-row">
                  <span className="rp-row-label">Контрольна дата</span>
                  <span className="rp-row-value">
                    {new Date(mating.control_date).toLocaleDateString("uk-UA")}
                  </span>
                </div>
              )}

              {mating.expected_birth && (
                <div className="rp-row">
                  <span className="rp-row-label">Очікуваний окріл</span>
                  <span className="rp-row-value rp-expected">
                    {new Date(mating.expected_birth).toLocaleDateString(
                      "uk-UA",
                    )}
                  </span>
                </div>
              )}

              {mating.last_litter_birth && (
                <div className="rp-row">
                  <span className="rp-row-label">Окріл відбувся</span>
                  <span className="rp-row-value rp-born">
                    {new Date(mating.last_litter_birth).toLocaleDateString(
                      "uk-UA",
                    )}
                    {mating.last_litter_alive !== null &&
                      mating.last_litter_alive > 0 &&
                      ` · живих: ${mating.last_litter_alive}`}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="rp-footer">
          <span>🐇 Кролівництво від А до Я</span>
        </div>
      </div>
    </div>
  );
}
