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

export default function BarChart({
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
