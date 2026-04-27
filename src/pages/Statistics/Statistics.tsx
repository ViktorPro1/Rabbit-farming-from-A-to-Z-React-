import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import "./Statistics.css";

interface Props {
  session: Session;
}

interface RabbitStat {
  id: string;
  name: string;
  breed: string;
  gender: "male" | "female";
  matingsCount: number;
  littersCount: number;
  totalBorn: number;
  totalAlive: number;
  avgAlive: number;
  survivalRate: number;
  pairs: {
    partnerId: string;
    partnerName: string;
    littersCount: number;
    totalAlive: number;
  }[];
}

interface PairStat {
  maleId: string;
  maleName: string;
  maleBreed: string;
  femaleId: string;
  femaleName: string;
  femaleBreed: string;
  matingsCount: number;
  littersCount: number;
  totalBorn: number;
  totalAlive: number;
  avgAlive: number;
}

interface CageStat {
  cage: string;
  matingsCount: number;
  littersCount: number;
  totalBorn: number;
  totalAlive: number;
  avgAlive: number;
  rabbits: string[];
}

function MiniBar({
  value,
  max,
  color,
}: {
  value: number;
  max: number;
  color: string;
}) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="stat-bar-wrap">
      <div className="stat-bar-track">
        <div
          className="stat-bar-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="stat-bar-val">{value}</span>
    </div>
  );
}

function BarChart({
  data,
  color,
}: {
  data: { label: string; value: number }[];
  color: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const barW = Math.max(28, Math.floor(320 / data.length) - 8);
  const chartW = data.length * (barW + 8) + 16;
  const chartH = 140;
  return (
    <div className="chart-scroll">
      <svg width={chartW} height={chartH + 36} style={{ overflow: "visible" }}>
        {data.map((d, i) => {
          const barH = Math.round((d.value / max) * chartH);
          const x = 8 + i * (barW + 8);
          const y = chartH - barH;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={barH}
                rx={4}
                fill={color}
                opacity={0.85}
              />
              <text
                x={x + barW / 2}
                y={y - 4}
                textAnchor="middle"
                fontSize={11}
                fill="var(--stat-text-muted)"
              >
                {d.value}
              </text>
              <text
                x={x + barW / 2}
                y={chartH + 16}
                textAnchor="middle"
                fontSize={10}
                fill="var(--stat-text-muted)"
              >
                {d.label.length > 7 ? d.label.slice(0, 7) + "…" : d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function RabbitCard({
  stat,
  rank,
  maxAlive,
}: {
  stat: RabbitStat;
  rank: number;
  maxAlive: number;
}) {
  const isFemale = stat.gender === "female";
  const color = isFemale ? "#e07b9a" : "#5b9bd5";
  const medal =
    rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-rank">{medal}</span>
        <div className="stat-card-title">
          <span className="stat-name">
            {isFemale ? "♀" : "♂"} {stat.name}
          </span>
          {stat.breed && <span className="stat-breed">{stat.breed}</span>}
        </div>
      </div>
      <div className="stat-metrics">
        <div className="stat-metric">
          <span className="stat-metric-label">Злучок</span>
          <span className="stat-metric-val">{stat.matingsCount}</span>
        </div>
        <div className="stat-metric">
          <span className="stat-metric-label">Окролів</span>
          <span className="stat-metric-val">{stat.littersCount}</span>
        </div>
        <div className="stat-metric">
          <span className="stat-metric-label">Народилось</span>
          <span className="stat-metric-val">{stat.totalBorn}</span>
        </div>
        <div className="stat-metric highlight">
          <span className="stat-metric-label">Вижило</span>
          <span className="stat-metric-val" style={{ color }}>
            {stat.totalAlive}
          </span>
        </div>
        <div className="stat-metric">
          <span className="stat-metric-label">Сер. за окріл</span>
          <span className="stat-metric-val">{stat.avgAlive}</span>
        </div>
        <div className="stat-metric">
          <span className="stat-metric-label">Виживаність</span>
          <span className="stat-metric-val">{stat.survivalRate}%</span>
        </div>
      </div>
      <div className="stat-bar-section">
        <span className="stat-bar-label">Живих всього</span>
        <MiniBar value={stat.totalAlive} max={maxAlive} color={color} />
      </div>
      {stat.pairs.length > 0 && (
        <div className="stat-pairs">
          <span className="stat-pairs-title">Партнери:</span>
          {stat.pairs.map((p) => (
            <div key={p.partnerId} className="stat-pair-row">
              <span className="stat-pair-name">
                {isFemale ? "♂" : "♀"} {p.partnerName}
              </span>
              <span className="stat-pair-info">
                {p.littersCount} окр. · {p.totalAlive} живих
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PairCard({
  stat,
  rank,
  maxAlive,
}: {
  stat: PairStat;
  rank: number;
  maxAlive: number;
}) {
  const medal =
    rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-rank">{medal}</span>
        <div className="stat-card-title">
          <span className="stat-name">
            ♂ {stat.maleName} × ♀ {stat.femaleName}
          </span>
          {(stat.maleBreed || stat.femaleBreed) && (
            <span className="stat-breed">
              {[stat.maleBreed, stat.femaleBreed].filter(Boolean).join(" / ")}
            </span>
          )}
        </div>
      </div>
      <div className="stat-metrics">
        <div className="stat-metric">
          <span className="stat-metric-label">Злучок</span>
          <span className="stat-metric-val">{stat.matingsCount}</span>
        </div>
        <div className="stat-metric">
          <span className="stat-metric-label">Окролів</span>
          <span className="stat-metric-val">{stat.littersCount}</span>
        </div>
        <div className="stat-metric">
          <span className="stat-metric-label">Народилось</span>
          <span className="stat-metric-val">{stat.totalBorn}</span>
        </div>
        <div className="stat-metric highlight">
          <span className="stat-metric-label">Вижило</span>
          <span className="stat-metric-val" style={{ color: "#7bc67e" }}>
            {stat.totalAlive}
          </span>
        </div>
        <div className="stat-metric">
          <span className="stat-metric-label">Сер. за окріл</span>
          <span className="stat-metric-val">{stat.avgAlive}</span>
        </div>
      </div>
      <div className="stat-bar-section">
        <span className="stat-bar-label">Живих всього</span>
        <MiniBar value={stat.totalAlive} max={maxAlive} color="#7bc67e" />
      </div>
    </div>
  );
}

function CageCard({
  stat,
  rank,
  maxAlive,
}: {
  stat: CageStat;
  rank: number;
  maxAlive: number;
}) {
  const medal =
    rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-rank">{medal}</span>
        <div className="stat-card-title">
          <span className="stat-name">🏠 Клітка {stat.cage}</span>
          {stat.rabbits.length > 0 && (
            <span className="stat-breed">{stat.rabbits.join(", ")}</span>
          )}
        </div>
      </div>
      <div className="stat-metrics">
        <div className="stat-metric">
          <span className="stat-metric-label">Злучок</span>
          <span className="stat-metric-val">{stat.matingsCount}</span>
        </div>
        <div className="stat-metric">
          <span className="stat-metric-label">Окролів</span>
          <span className="stat-metric-val">{stat.littersCount}</span>
        </div>
        <div className="stat-metric">
          <span className="stat-metric-label">Народилось</span>
          <span className="stat-metric-val">{stat.totalBorn}</span>
        </div>
        <div className="stat-metric highlight">
          <span className="stat-metric-label">Вижило</span>
          <span className="stat-metric-val" style={{ color: "#f0a500" }}>
            {stat.totalAlive}
          </span>
        </div>
        <div className="stat-metric">
          <span className="stat-metric-label">Сер. за окріл</span>
          <span className="stat-metric-val">{stat.avgAlive}</span>
        </div>
      </div>
      <div className="stat-bar-section">
        <span className="stat-bar-label">Живих всього</span>
        <MiniBar value={stat.totalAlive} max={maxAlive} color="#f0a500" />
      </div>
    </div>
  );
}

export default function Statistics({ session }: Props) {
  const [femaleStats, setFemaleStats] = useState<RabbitStat[]>([]);
  const [maleStats, setMaleStats] = useState<RabbitStat[]>([]);
  const [pairStats, setPairStats] = useState<PairStat[]>([]);
  const [cageStats, setCageStats] = useState<CageStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "females" | "males" | "pairs" | "cages"
  >("females");
  const navigate = useNavigate();

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      const { data: matings } = await supabase
        .from("matings")
        .select(
          "*, female:female_id(id, name, breed), male:male_id(id, name, breed)",
        )
        .eq("user_id", session.user.id);

      if (!matings || matings.length === 0) {
        setLoading(false);
        return;
      }

      const matingIds = matings.map((m) => m.id);
      const { data: litters } = await supabase
        .from("litters")
        .select("*")
        .in("mating_id", matingIds);

      const littersMap: Record<
        string,
        { total_born: number; alive: number }[]
      > = {};
      (litters || []).forEach((l) => {
        if (!littersMap[l.mating_id]) littersMap[l.mating_id] = [];
        littersMap[l.mating_id].push({
          total_born: l.total_born,
          alive: l.alive,
        });
      });

      // Female stats
      const femaleMap: Record<string, RabbitStat> = {};
      matings.forEach((m) => {
        if (!m.female) return;
        const fid = m.female_id;
        if (!femaleMap[fid]) {
          femaleMap[fid] = {
            id: fid,
            name: m.female.name,
            breed: m.female.breed || "",
            gender: "female",
            matingsCount: 0,
            littersCount: 0,
            totalBorn: 0,
            totalAlive: 0,
            avgAlive: 0,
            survivalRate: 0,
            pairs: [],
          };
        }
        const stat = femaleMap[fid];
        stat.matingsCount += 1;
        const mLitters = littersMap[m.id] || [];
        stat.littersCount += mLitters.length;
        mLitters.forEach((l) => {
          stat.totalBorn += l.total_born || 0;
          stat.totalAlive += l.alive || 0;
        });
        const existingPair = stat.pairs.find((p) => p.partnerId === m.male_id);
        if (existingPair) {
          existingPair.littersCount += mLitters.length;
          existingPair.totalAlive += mLitters.reduce(
            (s, l) => s + (l.alive || 0),
            0,
          );
        } else {
          stat.pairs.push({
            partnerId: m.male_id,
            partnerName: m.male?.name || "—",
            littersCount: mLitters.length,
            totalAlive: mLitters.reduce((s, l) => s + (l.alive || 0), 0),
          });
        }
      });
      setFemaleStats(
        Object.values(femaleMap)
          .map((s) => ({
            ...s,
            avgAlive:
              s.littersCount > 0
                ? Math.round((s.totalAlive / s.littersCount) * 10) / 10
                : 0,
            survivalRate:
              s.totalBorn > 0
                ? Math.round((s.totalAlive / s.totalBorn) * 100)
                : 0,
          }))
          .sort((a, b) => b.totalAlive - a.totalAlive),
      );

      // Male stats
      const maleMap: Record<string, RabbitStat> = {};
      matings.forEach((m) => {
        if (!m.male) return;
        const mid = m.male_id;
        if (!maleMap[mid]) {
          maleMap[mid] = {
            id: mid,
            name: m.male.name,
            breed: m.male.breed || "",
            gender: "male",
            matingsCount: 0,
            littersCount: 0,
            totalBorn: 0,
            totalAlive: 0,
            avgAlive: 0,
            survivalRate: 0,
            pairs: [],
          };
        }
        const stat = maleMap[mid];
        stat.matingsCount += 1;
        const mLitters = littersMap[m.id] || [];
        stat.littersCount += mLitters.length;
        mLitters.forEach((l) => {
          stat.totalBorn += l.total_born || 0;
          stat.totalAlive += l.alive || 0;
        });
        const existingPair = stat.pairs.find(
          (p) => p.partnerId === m.female_id,
        );
        if (existingPair) {
          existingPair.littersCount += mLitters.length;
          existingPair.totalAlive += mLitters.reduce(
            (s, l) => s + (l.alive || 0),
            0,
          );
        } else {
          stat.pairs.push({
            partnerId: m.female_id,
            partnerName: m.female?.name || "—",
            littersCount: mLitters.length,
            totalAlive: mLitters.reduce((s, l) => s + (l.alive || 0), 0),
          });
        }
      });
      setMaleStats(
        Object.values(maleMap)
          .map((s) => ({
            ...s,
            avgAlive:
              s.littersCount > 0
                ? Math.round((s.totalAlive / s.littersCount) * 10) / 10
                : 0,
            survivalRate:
              s.totalBorn > 0
                ? Math.round((s.totalAlive / s.totalBorn) * 100)
                : 0,
          }))
          .sort((a, b) => b.totalAlive - a.totalAlive),
      );

      // Pair stats
      const pairMap: Record<string, PairStat> = {};
      matings.forEach((m) => {
        if (!m.male || !m.female) return;
        const key = `${m.male_id}_${m.female_id}`;
        if (!pairMap[key]) {
          pairMap[key] = {
            maleId: m.male_id,
            maleName: m.male.name,
            maleBreed: m.male.breed || "",
            femaleId: m.female_id,
            femaleName: m.female.name,
            femaleBreed: m.female.breed || "",
            matingsCount: 0,
            littersCount: 0,
            totalBorn: 0,
            totalAlive: 0,
            avgAlive: 0,
          };
        }
        const stat = pairMap[key];
        stat.matingsCount += 1;
        const mLitters = littersMap[m.id] || [];
        stat.littersCount += mLitters.length;
        mLitters.forEach((l) => {
          stat.totalBorn += l.total_born || 0;
          stat.totalAlive += l.alive || 0;
        });
      });
      setPairStats(
        Object.values(pairMap)
          .map((s) => ({
            ...s,
            avgAlive:
              s.littersCount > 0
                ? Math.round((s.totalAlive / s.littersCount) * 10) / 10
                : 0,
          }))
          .sort((a, b) => b.totalAlive - a.totalAlive),
      );

      // Cage stats
      const cageMap: Record<string, CageStat> = {};
      matings.forEach((m) => {
        const cage = m.female_cage || m.male_cage;
        if (!cage) return;
        if (!cageMap[cage]) {
          cageMap[cage] = {
            cage,
            matingsCount: 0,
            littersCount: 0,
            totalBorn: 0,
            totalAlive: 0,
            avgAlive: 0,
            rabbits: [],
          };
        }
        const stat = cageMap[cage];
        stat.matingsCount += 1;
        const mLitters = littersMap[m.id] || [];
        stat.littersCount += mLitters.length;
        mLitters.forEach((l) => {
          stat.totalBorn += l.total_born || 0;
          stat.totalAlive += l.alive || 0;
        });
        if (m.female?.name && !stat.rabbits.includes(m.female.name))
          stat.rabbits.push(m.female.name);
        if (m.male?.name && !stat.rabbits.includes(m.male.name))
          stat.rabbits.push(m.male.name);
      });
      setCageStats(
        Object.values(cageMap)
          .map((s) => ({
            ...s,
            avgAlive:
              s.littersCount > 0
                ? Math.round((s.totalAlive / s.littersCount) * 10) / 10
                : 0,
          }))
          .sort((a, b) => b.totalAlive - a.totalAlive),
      );

      setLoading(false);
    }
    loadStats();
  }, [session.user.id]);

  const currentStats =
    activeTab === "females"
      ? femaleStats
      : activeTab === "males"
        ? maleStats
        : [];
  const maxAlive = Math.max(
    ...(activeTab === "pairs"
      ? pairStats
      : activeTab === "cages"
        ? cageStats
        : currentStats
    ).map((s) => s.totalAlive),
    1,
  );

  return (
    <div className="stats-page">
      <div className="stats-header">
        <h1>📊 Статистика</h1>
        <button
          className="stats-back-btn"
          onClick={() => navigate("/registry")}
        >
          ⬅ Мої кролики
        </button>
      </div>

      {loading ? (
        <div className="stats-loading">Завантаження...</div>
      ) : (
        <>
          <div className="stats-summary">
            <div className="summary-card">
              <span className="summary-icon">🐇</span>
              <span className="summary-num">
                {
                  new Set([
                    ...femaleStats.map((s) => s.id),
                    ...maleStats.map((s) => s.id),
                  ]).size
                }
              </span>
              <span className="summary-label">Кроликів</span>
            </div>
            <div className="summary-card">
              <span className="summary-icon">❤️</span>
              <span className="summary-num">
                {pairStats.reduce((s, p) => s + p.matingsCount, 0)}
              </span>
              <span className="summary-label">Злучок</span>
            </div>
            <div className="summary-card">
              <span className="summary-icon">📦</span>
              <span className="summary-num">
                {pairStats.reduce((s, p) => s + p.littersCount, 0)}
              </span>
              <span className="summary-label">Окролів</span>
            </div>
            <div className="summary-card highlight-green">
              <span className="summary-icon">🌱</span>
              <span className="summary-num">
                {pairStats.reduce((s, p) => s + p.totalAlive, 0)}
              </span>
              <span className="summary-label">Живих</span>
            </div>
          </div>

          <div className="stats-tabs">
            <button
              className={`stats-tab ${activeTab === "females" ? "active" : ""}`}
              onClick={() => setActiveTab("females")}
            >
              ♀ Крольчихи
            </button>
            <button
              className={`stats-tab ${activeTab === "males" ? "active" : ""}`}
              onClick={() => setActiveTab("males")}
            >
              ♂ Кільці
            </button>
            <button
              className={`stats-tab ${activeTab === "pairs" ? "active" : ""}`}
              onClick={() => setActiveTab("pairs")}
            >
              ❤️ Пари
            </button>
            <button
              className={`stats-tab ${activeTab === "cages" ? "active" : ""}`}
              onClick={() => setActiveTab("cages")}
            >
              🏠 Клітки
            </button>
          </div>

          {activeTab !== "pairs" &&
            activeTab !== "cages" &&
            currentStats.length > 0 && (
              <div className="stats-chart-block">
                <h3 className="chart-title">
                  Живих кроленят —{" "}
                  {activeTab === "females" ? "крольчихи" : "кільці"}
                </h3>
                <BarChart
                  data={currentStats.map((s) => ({
                    label: s.name,
                    value: s.totalAlive,
                  }))}
                  color={activeTab === "females" ? "#e07b9a" : "#5b9bd5"}
                />
                <h3 className="chart-title" style={{ marginTop: 16 }}>
                  Середній окріл (живих)
                </h3>
                <BarChart
                  data={currentStats.map((s) => ({
                    label: s.name,
                    value: s.avgAlive,
                  }))}
                  color={activeTab === "females" ? "#c9568a" : "#3a7abf"}
                />
              </div>
            )}

          {activeTab === "pairs" && pairStats.length > 0 && (
            <div className="stats-chart-block">
              <h3 className="chart-title">Живих кроленят — по парах</h3>
              <BarChart
                data={pairStats.map((s) => ({
                  label: `${s.maleName}×${s.femaleName}`,
                  value: s.totalAlive,
                }))}
                color="#7bc67e"
              />
            </div>
          )}

          {activeTab === "cages" && cageStats.length > 0 && (
            <div className="stats-chart-block">
              <h3 className="chart-title">Живих кроленят — по клітках</h3>
              <BarChart
                data={cageStats.map((s) => ({
                  label: `Кл.${s.cage}`,
                  value: s.totalAlive,
                }))}
                color="#f0a500"
              />
            </div>
          )}

          <div className="stats-cards">
            {activeTab === "females" &&
              (femaleStats.length === 0 ? (
                <p className="stats-empty">Даних ще немає.</p>
              ) : (
                femaleStats.map((s, i) => (
                  <RabbitCard
                    key={s.id}
                    stat={s}
                    rank={i + 1}
                    maxAlive={maxAlive}
                  />
                ))
              ))}
            {activeTab === "males" &&
              (maleStats.length === 0 ? (
                <p className="stats-empty">Даних ще немає.</p>
              ) : (
                maleStats.map((s, i) => (
                  <RabbitCard
                    key={s.id}
                    stat={s}
                    rank={i + 1}
                    maxAlive={maxAlive}
                  />
                ))
              ))}
            {activeTab === "pairs" &&
              (pairStats.length === 0 ? (
                <p className="stats-empty">Даних ще немає.</p>
              ) : (
                pairStats.map((s, i) => (
                  <PairCard
                    key={`${s.maleId}_${s.femaleId}`}
                    stat={s}
                    rank={i + 1}
                    maxAlive={maxAlive}
                  />
                ))
              ))}
            {activeTab === "cages" &&
              (cageStats.length === 0 ? (
                <p className="stats-empty">Даних ще немає.</p>
              ) : (
                cageStats.map((s, i) => (
                  <CageCard
                    key={s.cage}
                    stat={s}
                    rank={i + 1}
                    maxAlive={maxAlive}
                  />
                ))
              ))}
          </div>
        </>
      )}
    </div>
  );
}
