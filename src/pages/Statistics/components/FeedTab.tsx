import { useState } from "react";
import { useFeedData } from "../useFeedData";
import type { FeedGrouping, FeedModeStats } from "../feedCalc";

interface Props {
  userId: string;
}

const groupingOptions: { value: FeedGrouping; label: string }[] = [
  { value: "quarter", label: "Квартали" },
  { value: "half", label: "Півроку" },
  { value: "year", label: "Роки" },
];

function fmt(n: number | null, digits = 1): string {
  if (n === null || !Number.isFinite(n)) return "—";
  return n.toLocaleString("uk-UA", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="feed-row">
      <span className="feed-row-label">{label}</span>
      <span className="feed-row-value">{value}</span>
    </div>
  );
}

function ModeBlock({ title, s }: { title: string; s: FeedModeStats }) {
  return (
    <div className="feed-mode">
      <h4 className="feed-mode-title">{title}</h4>
      <Row label="Згодовано корму" value={`${fmt(s.kg)} кг`} />
      <Row label="Голів (в середньому)" value={fmt(s.avgHeads, 0)} />
      <Row label="Кг корму на голову" value={fmt(s.kgPerHead)} />
      <Row label="Грамів на голову за добу" value={fmt(s.gPerHeadDay, 0)} />
      <Row
        label="Середня вага"
        value={s.avgWeightKg === null ? "—" : `${fmt(s.avgWeightKg, 2)} кг`}
      />
    </div>
  );
}

export default function FeedTab({ userId }: Props) {
  const [grouping, setGrouping] = useState<FeedGrouping>("quarter");
  const { periods, loading, error } = useFeedData(userId, grouping);

  if (loading) return <div className="stats-loading">Завантаження...</div>;
  if (error) return <p className="stats-error">{error}</p>;

  return (
    <div className="feed-tab">
      <div className="stats-tabs feed-grouping">
        {groupingOptions.map((o) => (
          <button
            key={o.value}
            type="button"
            className={`stats-tab ${grouping === o.value ? "active" : ""}`}
            onClick={() => setGrouping(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>

      {periods.length === 0 && (
        <p className="feed-empty">Ще немає записів про корм.</p>
      )}

      {periods.map((p) => (
        <div key={p.key} className="feed-card">
          <div className="feed-card-header">
            <span className="feed-card-title">
              {p.label}
              {p.ongoing ? " (триває)" : ""}
            </span>
            <span className="feed-card-total">{fmt(p.totalKg)} кг</span>
          </div>
          <ModeBlock title="Племінне стадо" s={p.breeding} />
          <ModeBlock title="Відгодівля" s={p.fattening} />
        </div>
      ))}

      <p className="feed-note">
        Голів рахуємо в середньому по днях періоду, починаючи з дня, коли для
        цього типу з'явився перший запис корму. Середня вага береться із
        зважувань, зроблених у цьому періоді.
      </p>
    </div>
  );
}
