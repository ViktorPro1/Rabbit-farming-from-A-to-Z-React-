import { useEffect, useState } from "react";
import "./BehindTheScenes.css";

const GREETING_LINES = [
  "$ ./media/projects/React/Кролівництво від А до Я",
  "> Раді бачити Вас тут, за лаштунками розробки...",
];

const RABBIT_ASCII = String.raw`
   (\(\
   ( -.-)
  o_(")(")
`;

const BehindTheScenes = () => {
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      setTypedLines(GREETING_LINES);
      setDone(true);
      return;
    }

    let lineIndex = 0;
    let charIndex = 0;
    let cancelled = false;
    const currentLines: string[] = [];

    const typeNextChar = () => {
      if (cancelled) return;

      if (lineIndex >= GREETING_LINES.length) {
        setDone(true);
        return;
      }

      const targetLine = GREETING_LINES[lineIndex];

      if (charIndex <= targetLine.length) {
        currentLines[lineIndex] = targetLine.slice(0, charIndex);
        setTypedLines([...currentLines]);
        charIndex++;
        setTimeout(typeNextChar, 28 + Math.random() * 35);
      } else {
        lineIndex++;
        charIndex = 0;
        setTimeout(typeNextChar, 350);
      }
    };

    const startDelay = setTimeout(typeNextChar, 300);

    return () => {
      cancelled = true;
      clearTimeout(startDelay);
    };
  }, []);

  return (
    <div className="bts-page">
      <div className="bts-scanlines" aria-hidden="true" />

      <div className="bts-terminal">
        <div className="bts-titlebar">
          <span className="bts-dot bts-dot-red" />
          <span className="bts-dot bts-dot-yellow" />
          <span className="bts-dot bts-dot-green" />
          <span className="bts-titlebar-label">
            rabbit-farming-from-a-to-z — ovv
          </span>
        </div>

        <div className="bts-body">
          <div className="bts-greeting" role="status" aria-live="polite">
            {typedLines.map((line, i) => (
              <div key={i} className="bts-line">
                {line}
              </div>
            ))}
            <span className={`bts-cursor ${done ? "bts-cursor-blink" : ""}`}>
              ▊
            </span>
          </div>

          {done && (
            <div className="bts-content">
              <section className="bts-section">
                <div className="bts-prompt">$ cat stack.json</div>
                <ul className="bts-list">
                  <li>
                    <span className="bts-key">frontend</span>: React +
                    TypeScript
                  </li>
                  <li>
                    <span className="bts-key">build</span>: Vite
                  </li>
                  <li>
                    <span className="bts-key">backend</span>: Supabase
                    (PostgreSQL + Auth)
                  </li>
                  <li>
                    <span className="bts-key">platform</span>: PWA
                  </li>
                  <li>
                    <span className="bts-key">hosting</span>: Vercel
                  </li>
                </ul>
              </section>

              <section className="bts-section">
                <div className="bts-prompt">$ git log --oneline -3</div>
                <p className="bts-text">
                  Розробка велася у Visual Studio Code. На різних етапах
                  написання коду, оформлення сторінок та наповнення матеріалами
                  допомагали AI-асистенти — це прискорило розробку та дозволило
                  реалізувати більше можливостей.
                </p>
              </section>

              <section className="bts-section">
                <div className="bts-prompt">$ whoami</div>
                <p className="bts-text">
                  Ідея, структура, практичний досвід і перевірка інформації —
                  робота автора проєкту, кролівника-практика. AI-інструменти
                  використовувались як помічники в реалізації, а не як джерело
                  фахових знань.
                </p>
              </section>

              <pre className="bts-ascii" aria-hidden="true">
                {RABBIT_ASCII}
              </pre>

              <div className="bts-prompt bts-prompt-end">
                $ <span className="bts-cursor-inline">▊</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BehindTheScenes;
