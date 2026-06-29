import "./TempWarningPopup.css";

interface TempLevel {
  emoji: string;
  title: string;
  message: string;
  color: string;
  severity: "cold" | "info" | "warn" | "danger" | "critical";
}

interface Props {
  temp: number;
  onClose: () => void;
}

function getLevel(temp: number): TempLevel | null {
  if (temp < 5)
    return {
      emoji: "🥶",
      title: "Небезпечний холод!",
      message: `На вулиці ${temp}°C. Перевірте кроленят та хворих кроликів — вони найбільш вразливі до переохолодження. Забезпечте суху підстилку та захист від протягів.`,
      color: "#1565c0",
      severity: "cold",
    };
  if (temp >= 5 && temp < 18)
    return {
      emoji: "✅",
      title: "Комфортна температура",
      message: `На вулиці ${temp}°C. Оптимальна температура для кроликів (10–18°C). Тварини почуваються добре.`,
      color: "#2e7d32",
      severity: "info",
    };
  if (temp >= 18 && temp < 25)
    return {
      emoji: "🌡️",
      title: "Тепло — норма",
      message: `На вулиці ${temp}°C. Прийнятна температура. Стежте за наявністю свіжої води у кроликів.`,
      color: "#558b2f",
      severity: "info",
    };
  if (temp >= 25 && temp < 28)
    return {
      emoji: "⚠️",
      title: "Підвищена температура",
      message: `На вулиці ${temp}°C. Кролики починають відчувати тепловий стрес. Перевірте наявність свіжої води та вентиляцію у клітках.`,
      color: "#e65100",
      severity: "warn",
    };
  if (temp >= 28 && temp < 32)
    return {
      emoji: "🌶️",
      title: "Небезпечна спека!",
      message: `На вулиці ${temp}°C. Активний тепловий стрес у кроликів. Негайно забезпечте тінь, холодну воду та посилену вентиляцію. Зволожте вуха вологою тканиною.`,
      color: "#e65100",
      severity: "danger",
    };
  if (temp >= 32)
    return {
      emoji: "🔴",
      title: "Критична спека! Небезпека загибелі",
      message: `На вулиці ${temp}°C. Критична температура — ризик теплового удару та загибелі кроликів. Негайно перевірте тварин, перенесіть у прохолодне місце, прикладіть лід до вух.`,
      color: "#b71c1c",
      severity: "critical",
    };
  return null;
}

export default function TempWarningPopup({ temp, onClose }: Props) {
  const level = getLevel(temp);
  if (!level) return null;

  return (
    <div className="twp-overlay" onClick={onClose}>
      <div
        className={`twp-popup twp-${level.severity}`}
        style={{ borderColor: level.color }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="twp-header" style={{ background: level.color }}>
          <span className="twp-emoji">{level.emoji}</span>
          <span className="twp-title">{level.title}</span>
          <button className="twp-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="twp-body">
          <div className="twp-temp" style={{ color: level.color }}>
            {temp}°C
          </div>
          <p className="twp-message">{level.message}</p>
        </div>
        <div className="twp-footer">
          <button
            className="twp-btn"
            style={{ background: level.color }}
            onClick={onClose}
          >
            Зрозуміло
          </button>
        </div>
      </div>
    </div>
  );
}
