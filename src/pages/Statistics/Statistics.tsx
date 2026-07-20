import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

interface MonthlyStat {
  month: string; // "2026-06"
  totalBorn: number;
  totalAlive: number;
  totalSlaughtered: number;
  totalSold: number;
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
  return (
    <div className="chart-scroll">
      <svg
        width={chartW}
        height={chartH + 36 + topPadding}
        style={{ overflow: "visible" }}
      >
        {data.map((d, i) => {
          const barH = Math.round((d.value / max) * chartH);
          const x = 8 + i * (barW + 8);
          const y = topPadding + (chartH - barH);
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
                y={topPadding + chartH + 16}
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

function OverviewTab({ data }: { data: MonthlyStat[] }) {
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
  const balance = totalBornAll - totalSlaughteredAll - totalSoldAll;

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
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    | "females"
    | "males"
    | "pairs"
    | "cages"
    | "accuracy"
    | "slaughter"
    | "sales"
    | "overview"
  >("females");
  const navigate = useNavigate();
  const location = useLocation();
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStat[]>([]);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);

      // Забої
      const { data: slaughtered } = await supabase
        .from("fattening")
        .select(
          "id, cage_number, breed, males, females, unknown, birth_date, slaughtered_at, notes",
        )
        .eq("user_id", session.user.id)
        .eq("is_active", false)
        .not("slaughtered_at", "is", null)
        .order("slaughtered_at", { ascending: false });
      setSlaughteredCages(slaughtered || []);

      // Продажі
      const { data: sales } = await supabase
        .from("sales")
        .select("id, males, females, unknown, sold_at")
        .eq("user_id", session.user.id)
        .order("sold_at", { ascending: false });
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

      const { data: matings } = await supabase
        .from("matings")
        .select(
          "*, female:female_id(id, name, breed, cage_number), male:male_id(id, name, breed)",
        )
        .eq("user_id", session.user.id);

      if (!matings || matings.length === 0) {
        setMonthlyStats(
          Object.values(monthlyMap).sort((a, b) =>
            a.month.localeCompare(b.month),
          ),
        );
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
        if (!l.birth_date) return;
        if (!littersMap[l.mating_id]) littersMap[l.mating_id] = [];
        littersMap[l.mating_id].push({
          total_born: l.total_born,
          alive: l.alive,
        });
      });

      const litterMatingCounts: Record<string, number> = {};
      (litters || []).forEach((l) => {
        if (!l.litter_mating_date) return;
        litterMatingCounts[l.mating_id] =
          (litterMatingCounts[l.mating_id] || 0) + 1;
      });

      // Огляд: додаємо народжено по місяцях
      (litters || []).forEach((l) => {
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
        stat.matingsCount += 1 + (litterMatingCounts[m.id] || 0);
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
        stat.matingsCount += 1 + (litterMatingCounts[m.id] || 0);
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
        stat.matingsCount += 1 + (litterMatingCounts[m.id] || 0);
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
        stat.matingsCount += 1 + (litterMatingCounts[m.id] || 0);
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

      // Accuracy stats
      const accuracyMap: Record<string, FemaleAccuracyStat> = {};
      matings.forEach((m) => {
        if (!m.female) return;
        const mLittersRaw = (litters || []).filter((l) => l.mating_id === m.id);
        const resolvedFemaleCage = m.female?.cage_number || m.female_cage || "";
        mLittersRaw.forEach((l) => {
          if (!l.birth_date || !l.litter_expected_birth) return;
          const expected = new Date(l.litter_expected_birth);
          const actual = new Date(l.birth_date);
          const diffDays = Math.round(
            (actual.getTime() - expected.getTime()) / (1000 * 60 * 60 * 24),
          );
          const fid = m.female_id;
          if (!accuracyMap[fid]) {
            accuracyMap[fid] = {
              femaleId: fid,
              femaleName: m.female.name,
              femaleBreed: m.female.breed || "",
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
            femaleName: m.female.name,
            femaleBreed: m.female.breed || "",
            femaleCage: resolvedFemaleCage,
            expectedDate: l.litter_expected_birth,
            actualDate: l.birth_date,
            diffDays,
          });
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

            {activeTab === "overview" && <OverviewTab data={monthlyStats} />}
          </div>
        </>
      )}
    </div>
  );
}
