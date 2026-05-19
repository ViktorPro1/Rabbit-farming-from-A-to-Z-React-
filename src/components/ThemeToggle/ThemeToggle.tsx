import { useEffect, useState } from "react";
import "./ThemeToggle.css";

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      dark ? "dark" : "light",
    );
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <button
      className="theme-toggle"
      onClick={() => setDark((prev) => !prev)}
      aria-label="Перемкнути тему"
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
