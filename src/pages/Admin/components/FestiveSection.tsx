// Додано: галочка «Святковий режим» (гірлянди й сніг) для адмін-панелі.
import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { logError } from "../../../lib/logError";
import { setFestiveMode, useFestiveMode } from "../../../hooks/useFestiveMode";

export function FestiveSection() {
  const enabled = useFestiveMode();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.checked;
    setSaving(true);
    setError("");
    const { error: saveError } = await supabase.from("site_settings").upsert({
      key: "festive_mode",
      value: next,
      updated_at: new Date().toISOString(),
    });
    if (saveError) {
      logError("FestiveSection.save", saveError);
      setError("Не вдалося зберегти налаштування. Спробуйте ще раз.");
    } else {
      // Оновлюємо стан одразу: у адміна гірлянди й сніг з'являються без перезавантаження
      setFestiveMode(next);
    }
    setSaving(false);
  }

  return (
    <div className="admin-section">
      <h2>🎄 Новорічний режим</h2>
      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <input
          type="checkbox"
          id="festive-mode"
          name="festive-mode"
          checked={enabled}
          disabled={saving}
          onChange={handleChange}
        />
        Показувати гірлянди та сніг усім відвідувачам
      </label>
      {error && <p className="admin-error">{error}</p>}
    </div>
  );
}
