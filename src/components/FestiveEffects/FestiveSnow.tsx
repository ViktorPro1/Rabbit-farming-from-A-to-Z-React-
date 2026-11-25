// Додано: сніг на весь екран для новорічних свят (canvas, не блокує кліки).
import { useEffect, useRef, useState } from "react";
import "./FestiveEffects.css";

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

export default function FestiveSnow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Для людей, які вимкнули анімації в системі, сніг не показуємо
  const [reduceMotion] = useState(prefersReducedMotion);

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

  if (reduceMotion) return null;
  return <canvas ref={canvasRef} className="festive-snow" aria-hidden="true" />;
}
