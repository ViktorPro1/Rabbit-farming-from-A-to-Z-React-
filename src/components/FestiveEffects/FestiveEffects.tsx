// Додано: святкові ефекти для новорічних свят — гірлянда зверху і сніг на весь екран.
import { useEffect, useRef, useState } from "react";
import "./FestiveEffects.css";

// Скільки пікселів ширини припадає на одну «дугу» гірлянди
const SWAG_TARGET_WIDTH = 240;
const BULBS_PER_SWAG = 5;
// Висота дроту на краях дуги та глибина провису (px)
const WIRE_Y = 3;
const SAG = 18;
const GARLAND_HEIGHT = 44;
const BULB_COLORS = 4;

type Flake = {
  x: number;
  y: number;
  r: number;
  speed: number;
  drift: number;
  phase: number;
};

function prefersReducedMotion(): boolean {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

function calcSwags(): number {
  return Math.max(2, Math.round(window.innerWidth / SWAG_TARGET_WIDTH));
}

export default function FestiveEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [swags, setSwags] = useState(calcSwags);
  // Для людей, які вимкнули анімації в системі: лише статична гірлянда, без снігу
  const [reduceMotion] = useState(prefersReducedMotion);

  useEffect(() => {
    const onResize = () => setSwags(calcSwags());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let flakes: Flake[] = [];

    const make = (randomY: boolean): Flake => ({
      x: Math.random() * w,
      y: randomY ? Math.random() * h : -10,
      r: Math.random() * 2.5 + 1,
      speed: Math.random() + 0.5,
      drift: Math.random() * 0.6 - 0.3,
      phase: Math.random() * Math.PI * 2,
    });

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const n = Math.min(150, Math.floor(w / 10));
      flakes = Array.from({ length: n }, () => make(true));
    };

    const step = () => {
      for (const f of flakes) {
        f.y += f.speed;
        f.phase += 0.02;
        f.x += f.drift + Math.sin(f.phase) * 0.4;
        if (f.y > h + 10) Object.assign(f, make(false));
        if (f.x > w + 10) f.x = -10;
        if (f.x < -10) f.x = w + 10;
      }
    };

    // Два проходи (один fill на прохід): м'який сіро-блакитний контур,
    // щоб сніжинки були видні й на світлому (кремовому) фоні, потім біле ядро
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(110, 140, 170, 0.35)";
      ctx.beginPath();
      for (const f of flakes) {
        ctx.moveTo(f.x + f.r + 1, f.y);
        ctx.arc(f.x, f.y, f.r + 1, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
      ctx.beginPath();
      for (const f of flakes) {
        ctx.moveTo(f.x + f.r, f.y);
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      }
      ctx.fill();
    };

    const tick = () => {
      step();
      draw();
      raf = requestAnimationFrame(tick);
    };

    // У фоновій вкладці анімацію зупиняємо, щоб не витрачати батарею
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) tick();
    };

    resize();
    tick();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduceMotion]);

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
    <>
      <div
        className="festive-garland"
        style={{ height: GARLAND_HEIGHT }}
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
      {!reduceMotion && (
        <canvas ref={canvasRef} className="festive-snow" aria-hidden="true" />
      )}
    </>
  );
}
