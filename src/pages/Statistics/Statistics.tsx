import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import { logError } from "../../lib/logError";
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

interface AccuracyEntry {
  litterId: string;
  femaleId: string;
  femaleName: string;
  femaleBreed: string;
  femaleCage: string;
  expectedDate: string;
  actualDate: string;
  diffDays: number;
}

interface FemaleAccuracyStat {
  femaleId: string;
  femaleName: string;
  femaleBreed: string;
  femaleCage: string;
  entries: AccuracyEntry[];
  avgDiff: number;
  onTimeCount: number;
  lateCount: number;
  earlyCount: number;
}

interface SlaughteredCage {
  id: string;
  cage_number: string;
  breed: string;
  males: number;
  females: number;
  unknown: number;
  birth_date: string;
  slaughtered_at: string;
  notes: string;
}

interface SaleRecord {
  id: string;
  males: number;
  females: number;
  unknown: number;
  sold_at: string;
}

interface FailureEntry {
  litterId: string;
  type: "empty" | "lost";
  matingDate: string;
  failureDate: string;
  maleName: string;
}

interface FemaleFailureStat {
  femaleId: string;
  femaleName: string;
  femaleBreed: string;
  femaleCage: string;
  entries: FailureEntry[];
  emptyCount: number;
  lostCount: number;
  littersCount: number;
}

interface MonthlyStat {
  month: string; // "2026-06"
  totalBorn: number;
  totalAlive: number;
  totalSlaughtered: number;
  totalSold: number;
}

// ── Типи для розрахунку статистики з урахуванням фактичних батьків окролу ──

interface RabbitRef {
  id?: string;
  name: string;
  breed?: string | null;
  cage_number?: string | null;
}

interface MatingRow {
  id: string;
  female_id: string;
  male_id: string;
  mating_date: string | null;
  female_cage: string | null;
  male_cage: string | null;
  female: RabbitRef | null;
  male: RabbitRef | null;
}

interface LitterRow {
  id: string;
  mating_id: string;
  birth_date: string | null;
  total_born: number | null;
  alive: number | null;
  litter_mating_date: string | null;
  litter_expected_birth: string | null;
  failure_type: "empty" | "lost" | null;
  actual_male_id: string | null;
  actual_female_id: string | null;
}

interface Person {
  id: string;
  name: string;
  breed: string;
  cage: string;
}

interface Delta {
  matings: number;
  litters: number;
  born: number;
  alive: number;
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
  const topPadding = 20;
  const bottomPadding = 48; // більше місця під підпис у два рядки

  // Розбиває підпис на до двох рядків по словах, щоб влізти в ширину
  // стовпчика, замість обрізання по кількості символів.
  function wrapLabel(label: string, width: number): string[] {
    const maxChars = Math.max(6, Math.floor(width / 5.2));
    const words = label.split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let current = "";
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (candidate.length <= maxChars || !current) {
        current = candidate;
      } else {
        lines.push(current);
        current = word;
      }
      if (lines.length === 1 && current.length > maxChars) {
        // навіть одне слово задовге — розрізаємо його
        lines.push(current.slice(0, maxChars));
        current = current.slice(maxChars);
      }
    }
    if (current) lines.push(current);

    if (lines.length <= 2) return lines;

    const shown = lines.slice(0, 2);
    if (shown[1].length > maxChars - 1) {
      shown[1] = shown[1].slice(0, maxChars - 1) + "…";
    } else {
      shown[1] = shown[1] + "…";
    }
    return shown;
  }

  return (
    <div className="chart-scroll">
      <svg
        width={chartW}
        height={chartH + bottomPadding + topPadding}
        style={{ overflow: "visible" }}
      >
        {data.map((d, i) => {
          const barH = Math.round((d.value / max) * chartH);
          const x = 8 + i * (barW + 8);
          const y = topPadding + (chartH - barH);
          const lines = wrapLabel(d.label, barW);
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
                y={topPadding + chartH + 14}
                textAnchor="middle"
                fontSize={10}
                fill="var(--stat-text-muted)"
              >
                <title>{d.label}</title>
                {lines.map((line, li) => (
                  <tspan key={li} x={x + barW / 2} dy={li === 0 ? 0 : 11}>
                    {line}
                  </tspan>
                ))}
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

function AccuracyCard({
  stat,
  rank,
}: {
  stat: FemaleAccuracyStat;
  rank: number;
}) {
  const medal =
    rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;

  function diffLabel(diff: number) {
    if (diff === 0) return { text: "✅ Вчасно", className: "diff-ontime" };
    if (diff > 0)
      return { text: `🔴 Перетягнула на ${diff} дн.`, className: "diff-late" };
    return {
      text: `🟡 Народила на ${Math.abs(diff)} дн. раніше`,
      className: "diff-early",
    };
  }

  const avgLabel = diffLabel(Math.round(stat.avgDiff));

  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-rank">{medal}</span>
        <div className="stat-card-title">
          <span className="stat-name">
            ♀ {stat.femaleName}
            {stat.femaleCage ? ` (кл.${stat.femaleCage})` : ""}
          </span>
          {stat.femaleBreed && (
            <span className="stat-breed">{stat.femaleBreed}</span>
          )}
        </div>
      </div>
      <div className="stat-metrics">
        <div className="stat-metric">
          <span className="stat-metric-label">Окролів з даними</span>
          <span className="stat-metric-val">{stat.entries.length}</span>
        </div>
        <div className="stat-metric">
          <span className="stat-metric-label">Вчасно</span>
          <span className="stat-metric-val">{stat.onTimeCount}</span>
        </div>
        <div className="stat-metric">
          <span className="stat-metric-label">Перетягнула</span>
          <span className="stat-metric-val">{stat.lateCount}</span>
        </div>
        <div className="stat-metric">
          <span className="stat-metric-label">Раніше</span>
          <span className="stat-metric-val">{stat.earlyCount}</span>
        </div>
      </div>
      <div className={`accuracy-avg ${avgLabel.className}`}>
        Середнє відхилення: <strong>{avgLabel.text}</strong>
      </div>
      <div className="accuracy-entries">
        {stat.entries.map((e) => {
          const label = diffLabel(e.diffDays);
          return (
            <div key={e.litterId} className="accuracy-entry-row">
              <span className="accuracy-entry-dates">
                🗓 {new Date(e.expectedDate).toLocaleDateString("uk-UA")} {"→"}{" "}
                📦 {new Date(e.actualDate).toLocaleDateString("uk-UA")}
              </span>
              <span className={`accuracy-entry-diff ${label.className}`}>
                {label.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const FAILURE_LABELS: Record<FailureEntry["type"], string> = {
  empty: "Не окотилась",
  lost: "Розкидала, малюки завмерли",
};

function FailureCard({ stat }: { stat: FemaleFailureStat }) {
  const failures = stat.entries.length;
  const attempts = stat.littersCount + failures;
  const successRate =
    attempts > 0 ? Math.round((stat.littersCount / attempts) * 100) : 0;

  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <div className="stat-card-title">
          <span className="stat-name">
            ♀ {stat.femaleName}
            {stat.femaleCage ? ` (кл.${stat.femaleCage})` : ""}
          </span>
          {stat.femaleBreed && (
            <span className="stat-breed">{stat.femaleBreed}</span>
          )}
        </div>
      </div>
      <div className="stat-metrics">
        <div className="stat-metric">
          <span className="stat-metric-label">Без окролу</span>
          <span className="stat-metric-val" style={{ color: "#b71c1c" }}>
            {failures}
          </span>
        </div>
        <div className="stat-metric">
          <span className="stat-metric-label">Не окотилась</span>
          <span className="stat-metric-val">{stat.emptyCount}</span>
        </div>
        <div className="stat-metric">
          <span className="stat-metric-label">Розкидала, завмерли</span>
          <span className="stat-metric-val">{stat.lostCount}</span>
        </div>
        <div className="stat-metric">
          <span className="stat-metric-label">Успішних окролів</span>
          <span className="stat-metric-val">{stat.littersCount}</span>
        </div>
        <div className="stat-metric">
          <span className="stat-metric-label">Успішність злучок</span>
          <span className="stat-metric-val">{successRate}%</span>
        </div>
      </div>
      <div className="accuracy-entries">
        {stat.entries.map((e) => (
          <div key={e.litterId} className="accuracy-entry-row">
            <span className="accuracy-entry-dates">
              Злучка:{" "}
              {e.matingDate
                ? new Date(e.matingDate).toLocaleDateString("uk-UA")
                : "—"}
              {e.maleName ? ` · ♂ ${e.maleName}` : ""}
            </span>
            <span className="accuracy-entry-diff diff-late">
              {FAILURE_LABELS[e.type]}
              {e.failureDate
                ? ` · ${new Date(e.failureDate).toLocaleDateString("uk-UA")}`
                : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FailuresTab({ stats }: { stats: FemaleFailureStat[] }) {
  if (stats.length === 0) {
    return (
      <div className="stats-empty-state">
        <div className="stats-empty-illustration">—</div>
        <h3 className="stats-empty-title">Невдалих злучок ще немає</h3>
        <p className="stats-empty-desc">
          У розділі Парування відкрийте окріл кнопкою «Редагувати» і поставте
          відмітку «Не окотилась» або «Окотилась, розкидала». Дані з'являться
          тут автоматично.
        </p>
      </div>
    );
  }

  const totalFailures = stats.reduce((s, f) => s + f.entries.length, 0);
  const totalEmpty = stats.reduce((s, f) => s + f.emptyCount, 0);
  const totalLost = stats.reduce((s, f) => s + f.lostCount, 0);

  return (
    <>
      <div className="slaughter-tab">
        <div className="slaughter-summary">
          <div className="slaughter-summary-item">
            <span className="slaughter-summary-val">{totalFailures}</span>
            <span className="slaughter-summary-label">Без окролу всього</span>
          </div>
          <div className="slaughter-summary-item">
            <span className="slaughter-summary-val">{totalEmpty}</span>
            <span className="slaughter-summary-label">Не окотилась</span>
          </div>
          <div className="slaughter-summary-item">
            <span className="slaughter-summary-val">{totalLost}</span>
            <span className="slaughter-summary-label">Розкидала, завмерли</span>
          </div>
        </div>
      </div>
      {stats.map((s) => (
        <FailureCard key={s.femaleId} stat={s} />
      ))}
    </>
  );
}

function SlaughterTab({ cages }: { cages: SlaughteredCage[] }) {
  const total = cages.reduce(
    (s, c) => s + (c.males || 0) + (c.females || 0) + (c.unknown || 0),
    0,
  );

  // Групуємо по місяцях
  const byMonth: Record<string, SlaughteredCage[]> = {};
  cages.forEach((c) => {
    if (!c.slaughtered_at) return;
    const key = c.slaughtered_at.slice(0, 7); // "2026-06"
    if (!byMonth[key]) byMonth[key] = [];
    byMonth[key].push(c);
  });
  const months = Object.keys(byMonth).sort((a, b) => b.localeCompare(a));

  function monthLabel(key: string) {
    const [y, m] = key.split("-");
    const names = [
      "Січень",
      "Лютий",
      "Березень",
      "Квітень",
      "Травень",
      "Червень",
      "Липень",
      "Серпень",
      "Вересень",
      "Жовтень",
      "Листопад",
      "Грудень",
    ];
    return `${names[parseInt(m) - 1]} ${y}`;
  }

  if (cages.length === 0) {
    return (
      <div className="stats-empty-state">
        <div className="stats-empty-illustration">🔪</div>
        <h3 className="stats-empty-title">Забоїв ще не було</h3>
        <p className="stats-empty-desc">
          Після першого підтвердженого забою у розділі Відгодівля — дані
          з'являться тут автоматично.
        </p>
      </div>
    );
  }

  return (
    <div className="slaughter-tab">
      <div className="slaughter-summary">
        <div className="slaughter-summary-item">
          <span className="slaughter-summary-val">{cages.length}</span>
          <span className="slaughter-summary-label">Кліток забито</span>
        </div>
        <div className="slaughter-summary-item">
          <span className="slaughter-summary-val">{total}</span>
          <span className="slaughter-summary-label">Голів всього</span>
        </div>
      </div>

      {months.map((month) => {
        const group = byMonth[month];
        const groupTotal = group.reduce(
          (s, c) => s + (c.males || 0) + (c.females || 0) + (c.unknown || 0),
          0,
        );
        return (
          <div key={month} className="slaughter-month">
            <div className="slaughter-month-header">
              <span className="slaughter-month-title">{monthLabel(month)}</span>
              <span className="slaughter-month-total">{groupTotal} гол.</span>
            </div>
            <div className="slaughter-list">
              {group.map((c) => {
                const count =
                  (c.males || 0) + (c.females || 0) + (c.unknown || 0);
                return (
                  <div key={c.id} className="slaughter-row">
                    <div className="slaughter-row-left">
                      <span className="slaughter-cage">
                        Клітка {c.cage_number}
                      </span>
                      {c.breed && (
                        <span className="slaughter-breed">{c.breed}</span>
                      )}
                    </div>
                    <div className="slaughter-row-right">
                      <span className="slaughter-count">{count} гол.</span>
                      <span className="slaughter-date">
                        {new Date(c.slaughtered_at).toLocaleDateString("uk-UA")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SalesTab({ sales }: { sales: SaleRecord[] }) {
  const total = sales.reduce(
    (s, c) => s + (c.males || 0) + (c.females || 0) + (c.unknown || 0),
    0,
  );

  const byMonth: Record<string, SaleRecord[]> = {};
  sales.forEach((s) => {
    if (!s.sold_at) return;
    const key = s.sold_at.slice(0, 7);
    if (!byMonth[key]) byMonth[key] = [];
    byMonth[key].push(s);
  });
  const months = Object.keys(byMonth).sort((a, b) => b.localeCompare(a));

  function monthLabelFull(key: string) {
    const [y, m] = key.split("-");
    const names = [
      "Січень",
      "Лютий",
      "Березень",
      "Квітень",
      "Травень",
      "Червень",
      "Липень",
      "Серпень",
      "Вересень",
      "Жовтень",
      "Листопад",
      "Грудень",
    ];
    return `${names[parseInt(m) - 1]} ${y}`;
  }

  if (sales.length === 0) {
    return (
      <div className="stats-empty-state">
        <div className="stats-empty-illustration">💰</div>
        <h3 className="stats-empty-title">Продажів ще не було</h3>
        <p className="stats-empty-desc">
          Після першого продажу у розділі Відгодівля (кнопка «Продано») — дані
          з'являться тут автоматично.
        </p>
      </div>
    );
  }

  return (
    <div className="slaughter-tab">
      <div className="slaughter-summary">
        <div
          className="slaughter-summary-item"
          style={{ borderTopColor: "#c9a227" }}
        >
          <span className="slaughter-summary-val" style={{ color: "#c9a227" }}>
            {sales.length}
          </span>
          <span className="slaughter-summary-label">Продажів</span>
        </div>
        <div
          className="slaughter-summary-item"
          style={{ borderTopColor: "#c9a227" }}
        >
          <span className="slaughter-summary-val" style={{ color: "#c9a227" }}>
            {total}
          </span>
          <span className="slaughter-summary-label">Голів продано</span>
        </div>
      </div>

      {months.map((month) => {
        const group = byMonth[month];
        const groupTotal = group.reduce(
          (s, c) => s + (c.males || 0) + (c.females || 0) + (c.unknown || 0),
          0,
        );
        return (
          <div key={month} className="slaughter-month">
            <div className="slaughter-month-header">
              <span className="slaughter-month-title">
                {monthLabelFull(month)}
              </span>
              <span
                className="slaughter-month-total"
                style={{ color: "#c9a227" }}
              >
                {groupTotal} гол.
              </span>
            </div>
            <div className="slaughter-list">
              {group.map((s) => {
                const count =
                  (s.males || 0) + (s.females || 0) + (s.unknown || 0);
                const parts: string[] = [];
                if (s.males) parts.push(`♂ ${s.males}`);
                if (s.females) parts.push(`♀ ${s.females}`);
                if (s.unknown) parts.push(`? ${s.unknown}`);
                return (
                  <div
                    key={s.id}
                    className="slaughter-row"
                    style={{ borderLeftColor: "#c9a227" }}
                  >
                    <div className="slaughter-row-left">
                      <span className="slaughter-cage">
                        {parts.join(" · ")}
                      </span>
                    </div>
                    <div className="slaughter-row-right">
                      <span
                        className="slaughter-count"
                        style={{ color: "#c9a227" }}
                      >
                        {count} гол.
                      </span>
                      <span className="slaughter-date">
                        {new Date(s.sold_at).toLocaleDateString("uk-UA")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function monthLabelShort(key: string) {
  const [y, m] = key.split("-");
  const names = [
    "Січ",
    "Лют",
    "Бер",
    "Кві",
    "Тра",
    "Чер",
    "Лип",
    "Сер",
    "Вер",
    "Жов",
    "Лис",
    "Гру",
  ];
  return `${names[parseInt(m) - 1]} ${y.slice(2)}`;
}

function OverviewChart({ data }: { data: MonthlyStat[] }) {
  const max = Math.max(
    ...data.map((d) => Math.max(d.totalAlive, d.totalSlaughtered, d.totalSold)),
    1,
  );
  const groupW = 84;
  const barW = 20;
  const gap = 4;
  const chartW = data.length * groupW + 16;
  const chartH = 160;
  const topPadding = 20;

  function bar(x: number, value: number, color: string, key: string) {
    const h = Math.round((value / max) * chartH);
    const y = topPadding + (chartH - h);
    return (
      <g key={key}>
        <rect
          x={x}
          y={y}
          width={barW}
          height={h}
          rx={4}
          fill={color}
          opacity={0.85}
        />
        {value > 0 && (
          <text
            x={x + barW / 2}
            y={y - 4}
            textAnchor="middle"
            fontSize={10}
            fill="var(--stat-text-muted)"
          >
            {value}
          </text>
        )}
      </g>
    );
  }

  return (
    <div className="chart-scroll">
      <svg
        width={chartW}
        height={chartH + 36 + topPadding}
        style={{ overflow: "visible" }}
      >
        {data.map((d, i) => {
          const groupX = 8 + i * groupW;
          const bornX = groupX;
          const slaughterX = groupX + barW + gap;
          const soldX = groupX + (barW + gap) * 2;
          return (
            <g key={d.month}>
              {bar(bornX, d.totalAlive, "#4caf50", `${d.month}-born`)}
              {bar(
                slaughterX,
                d.totalSlaughtered,
                "#b71c1c",
                `${d.month}-slaughter`,
              )}
              {bar(soldX, d.totalSold, "#c9a227", `${d.month}-sold`)}
              <text
                x={groupX + (barW * 3 + gap * 2) / 2}
                y={topPadding + chartH + 16}
                textAnchor="middle"
                fontSize={10}
                fill="var(--stat-text-muted)"
              >
                {monthLabelShort(d.month)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function OverviewTab({
  data,
  quarantineDeaths,
}: {
  data: MonthlyStat[];
  quarantineDeaths: number;
}) {
  if (data.length === 0) {
    return (
      <div className="stats-empty-state">
        <div className="stats-empty-illustration">📈</div>
        <h3 className="stats-empty-title">Даних для огляду ще немає</h3>
        <p className="stats-empty-desc">
          Тут з'явиться порівняння народжень, забоїв і продажів по місяцях, коли
          буде хоча б один окріл, забій або продаж.
        </p>
      </div>
    );
  }

  const totalBornAll = data.reduce((s, d) => s + d.totalAlive, 0);
  const totalSlaughteredAll = data.reduce((s, d) => s + d.totalSlaughtered, 0);
  const totalSoldAll = data.reduce((s, d) => s + d.totalSold, 0);
  const balance =
    totalBornAll - totalSlaughteredAll - totalSoldAll - quarantineDeaths;

  return (
    <div className="overview-tab">
      <div className="overview-legend">
        <span className="overview-legend-item">
          <span
            className="overview-legend-dot"
            style={{ background: "#4caf50" }}
          />
          Народилось живими
        </span>
        <span className="overview-legend-item">
          <span
            className="overview-legend-dot"
            style={{ background: "#b71c1c" }}
          />
          Забито
        </span>
        <span className="overview-legend-item">
          <span
            className="overview-legend-dot"
            style={{ background: "#c9a227" }}
          />
          Продано
        </span>
      </div>

      <div className="stats-chart-block">
        <h3 className="chart-title">
          Народжено / Забито / Продано (по місяцях)
        </h3>
        <OverviewChart data={data} />
      </div>

      <div className="overview-summary">
        <div className="overview-summary-item">
          <span className="overview-summary-val" style={{ color: "#4caf50" }}>
            {totalBornAll}
          </span>
          <span className="overview-summary-label">Народилось живими</span>
        </div>
        <div className="overview-summary-item">
          <span className="overview-summary-val" style={{ color: "#b71c1c" }}>
            {totalSlaughteredAll}
          </span>
          <span className="overview-summary-label">Забито всього</span>
        </div>
        <div className="overview-summary-item">
          <span className="overview-summary-val" style={{ color: "#c9a227" }}>
            {totalSoldAll}
          </span>
          <span className="overview-summary-label">Продано всього</span>
        </div>
        {quarantineDeaths > 0 && (
          <div className="overview-summary-item">
            <span className="overview-summary-val" style={{ color: "#b71c1c" }}>
              {quarantineDeaths}
            </span>
            <span className="overview-summary-label">Загинуло всього</span>
          </div>
        )}
        <div className="overview-summary-item">
          <span
            className="overview-summary-val"
            style={{ color: balance >= 0 ? "#4caf50" : "#b71c1c" }}
          >
            {balance >= 0 ? "+" : ""}
            {balance}
          </span>
          <span className="overview-summary-label">Баланс поголів'я</span>
        </div>
      </div>
    </div>
  );
}

export default function Statistics({ session }: Props) {
  const [femaleStats, setFemaleStats] = useState<RabbitStat[]>([]);
  const [maleStats, setMaleStats] = useState<RabbitStat[]>([]);
  const [pairStats, setPairStats] = useState<PairStat[]>([]);
  const [cageStats, setCageStats] = useState<CageStat[]>([]);
  const [accuracyStats, setAccuracyStats] = useState<FemaleAccuracyStat[]>([]);
  const [slaughteredCages, setSlaughteredCages] = useState<SlaughteredCage[]>(
    [],
  );
  const [salesData, setSalesData] = useState<SaleRecord[]>([]);
  const [failureStats, setFailureStats] = useState<FemaleFailureStat[]>([]);
  const [loading, setLoading] = useState(true);
  // Змінено: повідомлення про помилку завантаження статистики
  const [pageError, setPageError] = useState("");
  const [activeTab, setActiveTab] = useState<
    | "females"
    | "males"
    | "pairs"
    | "cages"
    | "accuracy"
    | "slaughter"
    | "sales"
    | "overview"
    | "failures"
  >("females");
  const navigate = useNavigate();
  const location = useLocation();
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStat[]>([]);
  const [quarantineDeaths, setQuarantineDeaths] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      setLoading(true);
      setPageError("");

      // Змінено: сім незалежних запитів ішли послідовно (сім оборотів мережі
      // замість одного) і жоден не перевіряв error чи мав .range() — за
      // замовчуванням PostgREST повертає не більше 1000 рядків, тож на
      // великому господарстві старіші записи тихо випадали зі статистики.
      // Тепер запити йдуть паралельно (Promise.all), з явним .range(0, 9999)
      // і перевіркою помилок.
      const PAGE_END = 9999; // до 10 000 рядків на таблицю — з великим запасом

      const [
        slaughteredRes,
        salesRes,
        paddockLittersRes,
        registryExitsRes,
        quarantineDiedRes,
        matingsRes,
        rabbitsRes,
      ] = await Promise.all([
        // Забої
        supabase
          .from("fattening")
          .select(
            "id, cage_number, breed, males, females, unknown, birth_date, slaughtered_at, notes",
          )
          .eq("user_id", session.user.id)
          .eq("is_active", false)
          .not("slaughtered_at", "is", null)
          .order("slaughtered_at", { ascending: false })
          .range(0, PAGE_END),

        // Продажі
        supabase
          .from("sales")
          .select("id, males, females, unknown, sold_at")
          .eq("user_id", session.user.id)
          .order("sold_at", { ascending: false })
          .range(0, PAGE_END),

        // Окроли з вольєрів (підлогове утримання) — окрема таблиця, не входить
        // у "litters", тому без цього блоку народжений там молодняк випадав
        // з "Народжено/Живих" в огляді
        supabase
          .from("paddock_litters")
          .select("birth_date, total_born, alive")
          .eq("user_id", session.user.id)
          .range(0, PAGE_END),

        // Втрати і вибуття серед іменованих кроликів реєстру (не групові партії
        // Відгодівлі/Продажів, а конкретні тварини, архівовані напряму з
        // "Моїх кроликів" або через результат карантину)
        supabase
          .from("rabbits")
          .select("archive_reason, archive_date")
          .eq("user_id", session.user.id)
          .eq("is_active", false)
          .not("archive_reason", "is", null)
          .range(0, PAGE_END),

        // Загиблі в карантині БЕЗ прив'язки до конкретного кролика реєстру
        // (rabbit_id = null, вписані вручну). Ті, що прив'язані до rabbit_id,
        // вже пораховані вище через rabbits.archive_reason — інакше було б
        // подвійне рахування однієї й тієї ж тварини
        supabase
          .from("quarantine")
          .select("id")
          .eq("user_id", session.user.id)
          .eq("result", "died")
          .is("rabbit_id", null)
          .range(0, PAGE_END),

        supabase
          .from("matings")
          .select(
            "*, female:female_id(id, name, breed, cage_number), male:male_id(id, name, breed)",
          )
          .eq("user_id", session.user.id)
          .range(0, PAGE_END),

        // Усі кролики користувача (включно з архівними) — щоб знайти ім'я
        // фактичного самця/самки окролу (actual_male_id / actual_female_id).
        // Не залежить від matings, тому раніше не було причини чекати на
        // нього — переміщено сюди й виконується паралельно з рештою.
        supabase
          .from("rabbits")
          .select("id, name, breed, cage_number")
          .eq("user_id", session.user.id)
          .range(0, PAGE_END),
      ]);

      if (cancelled) return;

      const failedQuery = [
        slaughteredRes,
        salesRes,
        paddockLittersRes,
        registryExitsRes,
        quarantineDiedRes,
        matingsRes,
        rabbitsRes,
      ].find((r) => r.error);
      if (failedQuery?.error) {
        logError("Statistics.loadStats", failedQuery.error);
        setPageError("Не вдалося завантажити статистику. Оновіть сторінку");
        setLoading(false);
        return;
      }

      const slaughtered = slaughteredRes.data;
      const sales = salesRes.data;
      const paddockLitters = paddockLittersRes.data;
      const registryExits = registryExitsRes.data;
      const quarantineDied = quarantineDiedRes.data;
      const matingsData = matingsRes.data;
      const rabbitsData = rabbitsRes.data;

      setSlaughteredCages(slaughtered || []);
      setSalesData(sales || []);

      // Огляд: народжено / забито / продано по місяцях
      const monthlyMap: Record<string, MonthlyStat> = {};

      function ensureMonth(key: string) {
        if (!monthlyMap[key]) {
          monthlyMap[key] = {
            month: key,
            totalBorn: 0,
            totalAlive: 0,
            totalSlaughtered: 0,
            totalSold: 0,
          };
        }
        return monthlyMap[key];
      }

      (slaughtered || []).forEach((c) => {
        if (!c.slaughtered_at) return;
        const key = c.slaughtered_at.slice(0, 7);
        ensureMonth(key).totalSlaughtered +=
          (c.males || 0) + (c.females || 0) + (c.unknown || 0);
      });

      (sales || []).forEach((s) => {
        if (!s.sold_at) return;
        const key = s.sold_at.slice(0, 7);
        ensureMonth(key).totalSold +=
          (s.males || 0) + (s.females || 0) + (s.unknown || 0);
      });

      (paddockLitters || []).forEach((l) => {
        if (!l.birth_date) return;
        const key = l.birth_date.slice(0, 7);
        const stat = ensureMonth(key);
        stat.totalBorn += l.total_born || 0;
        stat.totalAlive += l.alive || 0;
      });

      let registryDied = 0;
      (registryExits || []).forEach((r) => {
        const key = (r.archive_date || "").slice(0, 7);
        if (r.archive_reason === "died") {
          registryDied += 1;
        } else if (r.archive_reason === "slaughter" && key) {
          ensureMonth(key).totalSlaughtered += 1;
        } else if (r.archive_reason === "sold" && key) {
          ensureMonth(key).totalSold += 1;
        }
        // archive_reason === "other" свідомо не враховуємо в баланс —
        // незрозуміло, чи тварина справді вибула з господарства
      });

      setQuarantineDeaths(registryDied + (quarantineDied || []).length);

      if (!matingsData || matingsData.length === 0) {
        setMonthlyStats(
          Object.values(monthlyMap).sort((a, b) =>
            a.month.localeCompare(b.month),
          ),
        );
        setLoading(false);
        return;
      }

      const matings: MatingRow[] = matingsData;
      const matingIds = matings.map((m) => m.id);
      const { data: littersData, error: littersError } = await supabase
        .from("litters")
        .select("*")
        .in("mating_id", matingIds)
        .range(0, PAGE_END);

      if (cancelled) return;
      if (littersError) {
        logError("Statistics.loadStats", littersError);
        setPageError("Не вдалося завантажити статистику. Оновіть сторінку");
        setLoading(false);
        return;
      }
      const litters: LitterRow[] = littersData || [];

      // Усі кролики користувача вже завантажені паралельно вище
      const rabbitById = new Map<string, RabbitRef>(
        (rabbitsData || []).map((r) => [r.id as string, r as RabbitRef]),
      );

      const matingById = new Map<string, MatingRow>(
        matings.map((m) => [m.id, m]),
      );

      const littersByMating: Record<string, LitterRow[]> = {};
      litters.forEach((l) => {
        if (!littersByMating[l.mating_id]) littersByMating[l.mating_id] = [];
        littersByMating[l.mating_id].push(l);
      });

      function toPerson(
        id: string,
        fallback: RabbitRef | null | undefined,
      ): Person | null {
        const r =
          rabbitById.get(id) ||
          (fallback && fallback.id === id ? fallback : null);
        if (!r) return null;
        return {
          id,
          name: r.name,
          breed: r.breed || "",
          cage: r.cage_number || "",
        };
      }

      // Самець/самка окролу: фактичний (actual_*), а якщо не вказаний —
      // той, що у злучці
      function maleOf(m: MatingRow, l?: LitterRow): Person | null {
        return toPerson((l && l.actual_male_id) || m.male_id, m.male);
      }
      function femaleOf(m: MatingRow, l?: LitterRow): Person | null {
        return toPerson((l && l.actual_female_id) || m.female_id, m.female);
      }

      // Клітка самки для картки: клітка з реєстру, а для самки зі злучки —
      // ще й female_cage самої злучки
      function femaleCageOf(m: MatingRow, f: Person): string {
        return f.cage || (f.id === m.female_id ? m.female_cage || "" : "");
      }

      // Невдалі окроли: не окотилась / окотилась, але малюки загинули
      const birthsByFemale: Record<string, number> = {};
      litters.forEach((l) => {
        if (!l.birth_date) return;
        const m = matingById.get(l.mating_id);
        if (!m) return;
        const f = femaleOf(m, l);
        if (!f) return;
        birthsByFemale[f.id] = (birthsByFemale[f.id] || 0) + 1;
      });

      const failureMap: Record<string, FemaleFailureStat> = {};
      litters.forEach((l) => {
        if (!l.failure_type) return;
        const m = matingById.get(l.mating_id);
        if (!m) return;
        const female = femaleOf(m, l);
        if (!female) return;
        const male = maleOf(m, l);
        const fid = female.id;
        if (!failureMap[fid]) {
          failureMap[fid] = {
            femaleId: fid,
            femaleName: female.name,
            femaleBreed: female.breed,
            femaleCage: femaleCageOf(m, female),
            entries: [],
            emptyCount: 0,
            lostCount: 0,
            littersCount: 0,
          };
        }
        const stat = failureMap[fid];
        stat.entries.push({
          litterId: l.id,
          type: l.failure_type === "lost" ? "lost" : "empty",
          matingDate: l.litter_mating_date || m.mating_date || "",
          failureDate:
            (l.failure_type === "lost"
              ? l.birth_date
              : l.litter_expected_birth) || "",
          maleName: male?.name || "",
        });
        if (l.failure_type === "lost") stat.lostCount += 1;
        else stat.emptyCount += 1;
      });
      setFailureStats(
        Object.values(failureMap)
          .map((s) => ({
            ...s,
            littersCount: birthsByFemale[s.femaleId] || 0,
            entries: [...s.entries].sort((a, b) =>
              (b.failureDate || b.matingDate).localeCompare(
                a.failureDate || a.matingDate,
              ),
            ),
          }))
          .sort((a, b) => b.entries.length - a.entries.length),
      );

      // Огляд: додаємо народжено по місяцях
      litters.forEach((l) => {
        if (!l.birth_date) return;
        const key = l.birth_date.slice(0, 7);
        const stat = ensureMonth(key);
        stat.totalBorn += l.total_born || 0;
        stat.totalAlive += l.alive || 0;
      });
      setMonthlyStats(
        Object.values(monthlyMap).sort((a, b) =>
          a.month.localeCompare(b.month),
        ),
      );

      // ── Статистика самок / самців / пар / кліток ──
      // Кожна злучка рахується за кроликами зі злучки (1 злучка), а кожен
      // окріл — за його ФАКТИЧНИМИ батьками. Повторні злучки окролу
      // (litter_mating_date) також зараховуються фактичній парі.
      const femaleMap: Record<string, RabbitStat> = {};
      const maleMap: Record<string, RabbitStat> = {};
      const pairMap: Record<string, PairStat> = {};
      const cageMap: Record<string, CageStat> = {};

      function getRabbitStat(
        map: Record<string, RabbitStat>,
        p: Person,
        gender: "male" | "female",
      ): RabbitStat {
        if (!map[p.id]) {
          map[p.id] = {
            id: p.id,
            name: p.name,
            breed: p.breed,
            gender,
            matingsCount: 0,
            littersCount: 0,
            totalBorn: 0,
            totalAlive: 0,
            avgAlive: 0,
            survivalRate: 0,
            pairs: [],
          };
        }
        return map[p.id];
      }

      function getPairStat(male: Person, female: Person): PairStat {
        const key = `${male.id}_${female.id}`;
        if (!pairMap[key]) {
          pairMap[key] = {
            maleId: male.id,
            maleName: male.name,
            maleBreed: male.breed,
            femaleId: female.id,
            femaleName: female.name,
            femaleBreed: female.breed,
            matingsCount: 0,
            littersCount: 0,
            totalBorn: 0,
            totalAlive: 0,
            avgAlive: 0,
          };
        }
        return pairMap[key];
      }

      function getCageStat(cage: string): CageStat {
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
        return cageMap[cage];
      }

      function applyDelta(
        s: {
          matingsCount: number;
          littersCount: number;
          totalBorn: number;
          totalAlive: number;
        },
        d: Delta,
      ) {
        s.matingsCount += d.matings;
        s.littersCount += d.litters;
        s.totalBorn += d.born;
        s.totalAlive += d.alive;
      }

      function addPartner(stat: RabbitStat, partner: Person, d: Delta) {
        let p = stat.pairs.find((x) => x.partnerId === partner.id);
        if (!p) {
          p = {
            partnerId: partner.id,
            partnerName: partner.name,
            littersCount: 0,
            totalAlive: 0,
          };
          stat.pairs.push(p);
        }
        p.littersCount += d.litters;
        p.totalAlive += d.alive;
      }

      function record(male: Person | null, female: Person | null, d: Delta) {
        if (female) {
          const s = getRabbitStat(femaleMap, female, "female");
          applyDelta(s, d);
          if (male) addPartner(s, male, d);
        }
        if (male) {
          const s = getRabbitStat(maleMap, male, "male");
          applyDelta(s, d);
          if (female) addPartner(s, female, d);
        }
        if (male && female) {
          applyDelta(getPairStat(male, female), d);
        }
      }

      function addCageName(stat: CageStat, p: Person | null) {
        if (p?.name && !stat.rabbits.includes(p.name))
          stat.rabbits.push(p.name);
      }

      matings.forEach((m) => {
        const baseMale = maleOf(m);
        const baseFemale = femaleOf(m);
        const cage = m.female_cage || m.male_cage;
        const cageStat = cage ? getCageStat(cage) : null;

        // Сама злучка — кроликам зі злучки
        const base: Delta = { matings: 1, litters: 0, born: 0, alive: 0 };
        record(baseMale, baseFemale, base);
        if (cageStat) {
          applyDelta(cageStat, base);
          addCageName(cageStat, baseFemale);
          addCageName(cageStat, baseMale);
        }

        // Окроли — фактичним батькам
        (littersByMating[m.id] || []).forEach((l) => {
          const male = maleOf(m, l);
          const female = femaleOf(m, l);
          const born = !!l.birth_date;
          const d: Delta = {
            matings: l.litter_mating_date ? 1 : 0,
            litters: born ? 1 : 0,
            born: born ? l.total_born || 0 : 0,
            alive: born ? l.alive || 0 : 0,
          };
          record(male, female, d);
          if (cageStat) {
            applyDelta(cageStat, d);
            addCageName(cageStat, female);
            addCageName(cageStat, male);
          }
        });
      });

      const finalizeRabbit = (s: RabbitStat): RabbitStat => ({
        ...s,
        avgAlive:
          s.littersCount > 0
            ? Math.round((s.totalAlive / s.littersCount) * 10) / 10
            : 0,
        survivalRate:
          s.totalBorn > 0 ? Math.round((s.totalAlive / s.totalBorn) * 100) : 0,
      });

      setFemaleStats(
        Object.values(femaleMap)
          .map(finalizeRabbit)
          .sort((a, b) => b.totalAlive - a.totalAlive),
      );
      setMaleStats(
        Object.values(maleMap)
          .map(finalizeRabbit)
          .sort((a, b) => b.totalAlive - a.totalAlive),
      );
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

      // Accuracy stats (по фактичній самці окролу)
      const accuracyMap: Record<string, FemaleAccuracyStat> = {};
      litters.forEach((l) => {
        if (!l.birth_date || !l.litter_expected_birth) return;
        const m = matingById.get(l.mating_id);
        if (!m) return;
        const female = femaleOf(m, l);
        if (!female) return;
        const resolvedFemaleCage = femaleCageOf(m, female);
        const expected = new Date(l.litter_expected_birth);
        const actual = new Date(l.birth_date);
        const diffDays = Math.round(
          (actual.getTime() - expected.getTime()) / (1000 * 60 * 60 * 24),
        );
        const fid = female.id;
        if (!accuracyMap[fid]) {
          accuracyMap[fid] = {
            femaleId: fid,
            femaleName: female.name,
            femaleBreed: female.breed,
            femaleCage: resolvedFemaleCage,
            entries: [],
            avgDiff: 0,
            onTimeCount: 0,
            lateCount: 0,
            earlyCount: 0,
          };
        }
        if (!accuracyMap[fid].femaleCage && resolvedFemaleCage) {
          accuracyMap[fid].femaleCage = resolvedFemaleCage;
        }
        accuracyMap[fid].entries.push({
          litterId: l.id,
          femaleId: fid,
          femaleName: female.name,
          femaleBreed: female.breed,
          femaleCage: resolvedFemaleCage,
          expectedDate: l.litter_expected_birth,
          actualDate: l.birth_date,
          diffDays,
        });
      });
      setAccuracyStats(
        Object.values(accuracyMap)
          .map((s) => {
            const onTimeCount = s.entries.filter(
              (e) => e.diffDays === 0,
            ).length;
            const lateCount = s.entries.filter((e) => e.diffDays > 0).length;
            const earlyCount = s.entries.filter((e) => e.diffDays < 0).length;
            const avgDiff =
              s.entries.length > 0
                ? Math.round(
                    (s.entries.reduce((sum, e) => sum + e.diffDays, 0) /
                      s.entries.length) *
                      10,
                  ) / 10
                : 0;
            return { ...s, onTimeCount, lateCount, earlyCount, avgDiff };
          })
          .filter((s) => s.entries.length > 0)
          .sort((a, b) => b.entries.length - a.entries.length),
      );

      setLoading(false);
    }
    loadStats();

    return () => {
      cancelled = true;
    };
  }, [session.user.id, location.key]);

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

      {pageError && <p className="stats-error">{pageError}</p>}

      {loading ? (
        <div className="stats-loading">Завантаження...</div>
      ) : pageError ? null : (
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
              <span className="summary-label">Плем. стадо</span>
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
              <span className="summary-label">Народилось живими</span>
            </div>
            <div className="summary-card highlight-red">
              <span className="summary-icon">🔪</span>
              <span className="summary-num">
                {slaughteredCages.reduce(
                  (s, c) =>
                    s + (c.males || 0) + (c.females || 0) + (c.unknown || 0),
                  0,
                )}
              </span>
              <span className="summary-label">Забито</span>
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
              ♂ Кролики
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
            <button
              className={`stats-tab ${activeTab === "accuracy" ? "active" : ""}`}
              onClick={() => setActiveTab("accuracy")}
            >
              🗓 Точність окролу
            </button>
            <button
              className={`stats-tab ${activeTab === "slaughter" ? "active" : ""}`}
              onClick={() => setActiveTab("slaughter")}
            >
              🔪 Забої
            </button>
            <button
              className={`stats-tab ${activeTab === "sales" ? "active" : ""}`}
              onClick={() => setActiveTab("sales")}
            >
              💰 Продажі
            </button>
            <button
              className={`stats-tab ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              📈 Огляд
            </button>
            <button
              className={`stats-tab ${activeTab === "failures" ? "active" : ""}`}
              onClick={() => setActiveTab("failures")}
            >
              Невдалі окроли
            </button>
          </div>

          {activeTab !== "pairs" &&
            activeTab !== "cages" &&
            activeTab !== "accuracy" &&
            activeTab !== "slaughter" &&
            activeTab !== "sales" &&
            activeTab !== "overview" &&
            currentStats.length > 0 && (
              <div className="stats-chart-block">
                <h3 className="chart-title">
                  Живих кроленят —{" "}
                  {activeTab === "females" ? "крольчихи" : "кролів"}
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
                <div className="stats-empty-state">
                  <div className="stats-empty-illustration">♀</div>
                  <h3 className="stats-empty-title">
                    Даних по крольчихах ще немає
                  </h3>
                  <p className="stats-empty-desc">
                    Додайте злучки в розділі Розведення — статистика з'явиться
                    автоматично після першого окролу.
                  </p>
                </div>
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
                <div className="stats-empty-state">
                  <div className="stats-empty-illustration">♂</div>
                  <h3 className="stats-empty-title">
                    Даних по кільцях ще немає
                  </h3>
                  <p className="stats-empty-desc">
                    Статистика по самцях з'явиться після внесення злучок і
                    окролів.
                  </p>
                </div>
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
                <div className="stats-empty-state">
                  <div className="stats-empty-illustration">❤️</div>
                  <h3 className="stats-empty-title">Даних по парах ще немає</h3>
                  <p className="stats-empty-desc">
                    Тут буде порівняння продуктивності кожної пари коєць ×
                    крольчиха.
                  </p>
                </div>
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
                <div className="stats-empty-state">
                  <div className="stats-empty-illustration">🏠</div>
                  <h3 className="stats-empty-title">
                    Даних по клітках ще немає
                  </h3>
                  <p className="stats-empty-desc">
                    Вкажіть номери кліток при додаванні злучок — тоді тут
                    з'явиться статистика по кожній клітці.
                  </p>
                </div>
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

            {activeTab === "accuracy" &&
              (accuracyStats.length === 0 ? (
                <div className="stats-empty-state">
                  <div className="stats-empty-illustration">🗓</div>
                  <h3 className="stats-empty-title">
                    Даних точності окролу ще немає
                  </h3>
                  <p className="stats-empty-desc">
                    Точність рахується лише для окролів де заповнені обидва поля
                    — «Очікуваний окріл» і «Дата окролу». Заповнюй їх в розділі
                    Розведення.
                  </p>
                </div>
              ) : (
                accuracyStats.map((s, i) => (
                  <AccuracyCard key={s.femaleId} stat={s} rank={i + 1} />
                ))
              ))}

            {activeTab === "slaughter" && (
              <SlaughterTab cages={slaughteredCages} />
            )}

            {activeTab === "sales" && <SalesTab sales={salesData} />}

            {activeTab === "failures" && <FailuresTab stats={failureStats} />}

            {activeTab === "overview" && (
              <OverviewTab
                data={monthlyStats}
                quarantineDeaths={quarantineDeaths}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
