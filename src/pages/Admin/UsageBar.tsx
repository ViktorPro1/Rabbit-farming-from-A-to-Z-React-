export function UsageBar({
  used,
  total,
  label,
  color = "#4caf50",
}: {
  used: number;
  total: number;
  label: string;
  color?: string;
}) {
  const pct = Math.min((used / total) * 100, 100);
  const isWarn = pct >= 70;
  const isDanger = pct >= 90;
  const barColor = isDanger ? "#e53935" : isWarn ? "#ff9800" : color;

  return (
    <div className="stats-bar-row">
      <div className="stats-bar-label">{label}</div>
      <div className="stats-bar-track">
        <div
          className="stats-bar-fill"
          style={{ width: `${pct}%`, background: barColor }}
        />
      </div>
      <div className="stats-bar-pct">{pct.toFixed(1)}%</div>
    </div>
  );
}
