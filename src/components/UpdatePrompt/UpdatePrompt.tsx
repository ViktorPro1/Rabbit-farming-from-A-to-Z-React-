import { useEffect, useState } from "react";
import "./UpdatePrompt.css";

export function UpdatePrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(true);
    window.addEventListener("sw-update", handler);
    return () => window.removeEventListener("sw-update", handler);
  }, []);

  if (!visible) return null;

  return (
    <div className="update-prompt">
      <span>🐇 Доступна нова версія!</span>
      <button onClick={() => window.location.reload()}>Оновити</button>
      <button
        className="update-prompt__dismiss"
        onClick={() => setVisible(false)}
      >
        ✕
      </button>
    </div>
  );
}
