import { GAUGE_ZONE_LABEL } from "../constants";
import type { GaugeMetric } from "../types";

export default function WeighingGauge({ metric }: { metric: GaugeMetric }) {
  const { value, arcMax, zone, unit, caption, expectedLabel } = metric;
  const pct = arcMax > 0 ? Math.max(0, Math.min(1, value / arcMax)) : 0;

  const size = 108;
  const stroke = 9;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const startAngle = 135;
  const sweep = 270;

  const polarToCartesian = (angleDeg: number) => {
    const a = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };

  const describeArc = (startDeg: number, endDeg: number) => {
    const start = polarToCartesian(endDeg);
    const end = polarToCartesian(startDeg);
    const largeArcFlag = endDeg - startDeg <= 180 ? 0 : 1;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  };

  const trackPath = describeArc(startAngle, startAngle + sweep);
  const fillPath = describeArc(startAngle, startAngle + sweep * pct);

  return (
    <div className="weighing-gauge">
      <div
        className="weighing-gauge-ring"
        // Кільце стискається разом із колонкою на вузьких екранах
        style={{ width: size, maxWidth: "100%", aspectRatio: "1 / 1" }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${size} ${size}`}
          style={{ overflow: "visible" }}
        >
          <path
            d={trackPath}
            fill="none"
            className="weighing-gauge-track"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          {pct > 0 && (
            <path
              d={fillPath}
              fill="none"
              className={`weighing-gauge-fill weighing-gauge-fill-${zone}`}
              strokeWidth={stroke}
              strokeLinecap="round"
            />
          )}
        </svg>
        <div className="weighing-gauge-center">
          <span className="weighing-gauge-value">
            {value.toLocaleString("uk-UA")}
          </span>
          <span className="weighing-gauge-unit">{unit}</span>
        </div>
      </div>
      <div className="weighing-gauge-caption">{caption}</div>
      <div className={`weighing-gauge-zone weighing-gauge-zone-${zone}`}>
        {GAUGE_ZONE_LABEL[zone]}
      </div>
      {expectedLabel && (
        <div className="weighing-gauge-expected">{expectedLabel}</div>
      )}
    </div>
  );
}
