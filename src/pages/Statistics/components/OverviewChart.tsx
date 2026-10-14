import { monthLabelShort } from "../utils";
import type { MonthlyStat } from "../types";

export default function OverviewChart({ data }: { data: MonthlyStat[] }) {
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
