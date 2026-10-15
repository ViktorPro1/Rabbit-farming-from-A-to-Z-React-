import WeighingGauge from "./WeighingGauge";
import type { GaugeMetric, WeighingType } from "../types";

// Показники: мін / приріст / макс, з перемикачем типу (відгодівля / племінне)
export default function GaugeCard({
  gaugeMode,
  onModeChange,
  gaugeMetrics,
  modeRecordsCount,
}: {
  gaugeMode: WeighingType;
  onModeChange: (mode: WeighingType) => void;
  gaugeMetrics: {
    min: GaugeMetric;
    gain: GaugeMetric;
    max: GaugeMetric;
  } | null;
  modeRecordsCount: number;
}) {
  return (
    <div className="weighing-gauge-card">
      <div className="weighing-gauge-toggle">
        <button
          className={
            gaugeMode === "fattening"
              ? "weighing-gauge-toggle-btn active"
              : "weighing-gauge-toggle-btn"
          }
          onClick={() => onModeChange("fattening")}
        >
          🍖 Відгодівля
        </button>
        <button
          className={
            gaugeMode === "breeding"
              ? "weighing-gauge-toggle-btn active"
              : "weighing-gauge-toggle-btn"
          }
          onClick={() => onModeChange("breeding")}
        >
          🐇 Племінне
        </button>
      </div>

      {gaugeMetrics ? (
        <div className="weighing-gauge-grid">
          <WeighingGauge metric={gaugeMetrics.min} />
          <WeighingGauge metric={gaugeMetrics.gain} />
          <WeighingGauge metric={gaugeMetrics.max} />
        </div>
      ) : (
        <p className="weighing-gauge-empty">
          {modeRecordsCount === 0
            ? "Ще немає записів цього типу — додай перше зважування нижче."
            : "Немає записів з відомою датою народження — показники зʼявляться, коли клітка чи кролик матимуть дату народження."}
        </p>
      )}
    </div>
  );
}
