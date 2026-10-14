import { useState } from "react";

interface InfoItem {
  icon: string;
  title: string;
  lines: string[];
}

const INFO_ITEMS: InfoItem[] = [
  {
    icon: "📅",
    title: "Тривалість вагітності",
    lines: [
      "28–35 днів, найчастіше 31 день",
      "Окріл до 28 дня — передчасний, після 35 — патологія",
    ],
  },
  {
    icon: "🔍",
    title: "Контрольна злучка / пальпація",
    lines: [
      "10–14 день після злучки",
      "Пальпація живота — досвідчений кролівник відчує плоди розміром з горошину",
    ],
  },
  {
    icon: "🏠",
    title: "Підготовка маточника",
    lines: [
      "26–28 день після злучки",
      "Самка починає будувати гніздо і вищипує пух — маточник має бути готовий заздалегідь",
    ],
  },
  {
    icon: "✂️",
    title: "Відлучення крільченят",
    lines: [
      "Не раніше 28 днів, оптимально 35–42 дні",
      "Раннє відлучення до 28 днів — високий ризик ентериту та загибелі молодняку",
    ],
  },
  {
    icon: "🔁",
    title: "Наступна злучка",
    lines: [
      "Напівінтенсивна схема: через 10–14 днів після окролу",
      "Екстенсивна схема: після відлучення (35–42 дні)",
    ],
  },
  {
    icon: "⚠️",
    title: "Псевдовагітність",
    lines: [
      "Триває 16–18 днів після хибної овуляції",
      "Самка будує гніздо але окролу немає — повторна злучка після 18–20 дня",
    ],
  },
];

/** Згортувана довідка з ключовими термінами розведення. */
export default function BreedingInfo() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="matings-info">
      <button
        className="matings-info-toggle"
        onClick={() => setShowInfo(!showInfo)}
      >
        <span>📋 Ключові терміни розведення</span>
        <span>{showInfo ? "▲" : "▼"}</span>
      </button>

      {showInfo && (
        <>
          <div className="matings-info-grid">
            {INFO_ITEMS.map((item) => (
              <div key={item.title} className="matings-info-item">
                <span className="matings-info-icon">{item.icon}</span>
                <div>
                  <strong>{item.title}</strong>
                  {item.lines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="matings-info-warning">
            ⚠️ <strong>Важливо:</strong> Не допускайте злучки самки раніше ніж
            через 10 днів після окролу — матка потребує відновлення. При
            інтенсивній схемі (злучка на 1–2 день після окролу) різко зростає
            ризик виснаження самки і загибелі послідуючих пометів.
          </div>
        </>
      )}
    </div>
  );
}
