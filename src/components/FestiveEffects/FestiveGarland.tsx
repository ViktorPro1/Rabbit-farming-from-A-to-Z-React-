// Додано: святкова гірлянда. Рендериться всередині Hero одразу під RunningTicker
// і прокручується разом із ним (position: absolute, а не fixed).
import { useLayoutEffect, useRef, useState } from "react";
import "./FestiveEffects.css";

// Скільки пікселів ширини припадає на одну «дугу» гірлянди
const SWAG_TARGET_WIDTH = 240;
const BULBS_PER_SWAG = 5;
// Висота дроту на краях дуги та глибина провису (px)
const WIRE_Y = 3;
const SAG = 12;
const GARLAND_HEIGHT = 34;
const BULB_COLORS = 4;

function calcSwags(): number {
  return Math.max(2, Math.round(window.innerWidth / SWAG_TARGET_WIDTH));
}

export default function FestiveGarland() {
  const ref = useRef<HTMLDivElement>(null);
  const [swags, setSwags] = useState(calcSwags);
  // Відступ зверху = низ рядка .ticker-wrapper (його висота залежить від розміру шрифту)
  const [top, setTop] = useState(26);

  useLayoutEffect(() => {
    const ticker =
      ref.current?.parentElement?.querySelector<HTMLElement>(".ticker-wrapper");

    const update = () => {
      setSwags(calcSwags());
      if (ticker) setTop(ticker.offsetTop + ticker.offsetHeight);
    };

    update();
    window.addEventListener("resize", update);
    const ro =
      ticker && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(update)
        : null;
    if (ticker) ro?.observe(ticker);
    return () => {
      window.removeEventListener("resize", update);
      ro?.disconnect();
    };
  }, []);

  // Лампочки розставлені вздовж провисаючого дроту (парабола), по swags дуг на всю ширину
  const bulbs: { left: string; top: number; color: number }[] = [];
  const wires: string[] = [];
  for (let j = 0; j < swags; j++) {
    wires.push(
      `M ${j} ${WIRE_Y} Q ${j + 0.5} ${WIRE_Y + 2 * SAG} ${j + 1} ${WIRE_Y}`,
    );
    for (let b = 0; b < BULBS_PER_SWAG; b++) {
      const t = (b + 0.5) / BULBS_PER_SWAG;
      bulbs.push({
        left: `${((j + t) / swags) * 100}%`,
        top: WIRE_Y + 4 * SAG * t * (1 - t),
        color: (j * BULBS_PER_SWAG + b) % BULB_COLORS,
      });
    }
  }

  return (
    <div
      ref={ref}
      className="festive-garland"
      style={{ top, height: GARLAND_HEIGHT }}
      aria-hidden="true"
    >
      <svg
        className="festive-wire"
        viewBox={`0 0 ${swags} ${GARLAND_HEIGHT}`}
        preserveAspectRatio="none"
      >
        {wires.map((d) => (
          <path key={d} d={d} vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      {bulbs.map((b, i) => (
        <span
          key={i}
          className={`festive-bulb festive-bulb--${b.color}`}
          style={{ left: b.left, top: b.top }}
        />
      ))}
    </div>
  );
}
