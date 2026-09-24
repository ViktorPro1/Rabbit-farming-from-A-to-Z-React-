import { useState } from "react";
import { Link } from "react-router-dom";
import "./FirstCrossPlan.css";
import ShareButton from "../../components/ShareButton/ShareButton";

interface PlanStep {
  icon: string;
  title: string;
  text: string;
  warning?: string;
  tip?: string;
}

const planSteps: PlanStep[] = [
  {
    icon: "🎯",
    title: "Визначте мету",
    text: "Перш ніж обирати породи, чітко вирішіть: чого ви хочете від помісі — м'яса, витривалості для вуличного утримання чи спокійного домашнього улюбленця. Мета одразу відсіє більшість невдалих поєднань.",
    tip: "Якщо мета неясна навіть вам самим — почніть з розділу «Перевірені поєднання порід», там є готові приклади під кожну мету.",
  },
  {
    icon: "🐇",
    title: "Оберіть дві перевірені породи",
    text: "Під свою мету підберіть пару порід, яка вже показала стабільний результат на практиці, а не «що є під рукою». Для м'яса, вулиці чи дому — різні перевірені комбінації.",
    warning: "Не беріть дві породи навмання лише тому, що вони обидві є у вас у господарстві — це найчастіша причина непередбачуваного результату.",
  },
  {
    icon: "🩺",
    title: "Перевірте здоров'я обох тварин",
    text: "Огляньте самця і самку перед паруванням: відсутність видимих ознак хвороб, паразитів, нормальна вага (не худі й не ожирілі), активність і апетит.",
  },
  {
    icon: "⚖️",
    title: "Перевірте сумісність за розміром",
    text: "Різниця у вазі батьків не повинна бути критичною, особливо якщо самка дрібніша за самця — це знижує ризик важких пологів. Якщо сумніваєтесь — перечитайте розділ «Несумісні поєднання».",
  },
  {
    icon: "♀️",
    title: "Підготуйте самку до злучки",
    text: "Оцініть кондицію тіла (BCS) самки — вона не має бути ні худою, ні ожирілою. Вік самки має відповідати мінімальному репродуктивному віку її породи.",
    tip: "Детальніше про підготовку — в розділі «Підготовка самки до злучки».",
  },
  {
    icon: "📅",
    title: "Проведіть злучку і запишіть дату",
    text: "У день парування зафіксуйте дату, а також обох батьків (породу, вік, попереднє походження) у племінному журналі. Це знадобиться і для контролю вагітності, і для майбутнього обліку результатів.",
    warning: "Без запису дати легко пропустити орієнтовний термін окролу і не встигнути підготувати гніздо вчасно.",
  },
  {
    icon: "🍼",
    title: "Стежте за вагітністю і підготуйте гніздо",
    text: "Приблизно через 12–14 днів можна провести контрольну пальпацію. За кілька днів до очікуваного окролу поставте маточник з чистою підстилкою.",
  },
  {
    icon: "📊",
    title: "Оцініть результат",
    text: "Після народження і в перші тижні життя молодняку зафіксуйте: розмір посліду, вагу при народженні, темпи росту, будь-які проблеми зі здоров'ям. Порівняйте з тим, що очікували від обраного поєднання.",
    tip: "Саме ці записи з часом складуть вашу власну базу перевірених поєднань — точнішу за будь-яку загальну статтю.",
  },
];

const FirstCrossPlan = () => {
  const [done, setDone] = useState<boolean[]>(() => planSteps.map(() => false));

  const toggle = (i: number) => {
    setDone((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  };

  const completedCount = done.filter(Boolean).length;
  const progress = Math.round((completedCount / planSteps.length) * 100);

  return (
    <main className="fp-page">
      <div className="fp-header">
        <h1>✅ План першого поєднання порід</h1>
        <p>Покроковий план для тих, хто ще ніколи не схрещував породи</p>
      </div>

      <div className="fp-wrap">
        <div className="fp-notice">
          📝 Позначайте кроки виконаними — це просто для зручності перегляду,
          дані нікуди не зберігаються.
        </div>

        <div className="fp-progress-wrap">
          <div className="fp-progress-label">
            Виконано {completedCount} з {planSteps.length}
          </div>
          <div className="fp-progress-bar">
            <div className="fp-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="fp-plan">
          {planSteps.map((step, i) => (
            <div key={i} className={`fp-plan-step${done[i] ? " done" : ""}`}>
              <button
                className="fp-checkbox"
                onClick={() => toggle(i)}
                aria-pressed={done[i]}
                aria-label={done[i] ? "Позначити як невиконане" : "Позначити як виконане"}
              >
                {done[i] ? "✓" : i + 1}
              </button>
              <div className="fp-plan-body">
                <div className="fp-plan-top">
                  <span className="fp-plan-icon">{step.icon}</span>
                  <h3 className="fp-plan-title">{step.title}</h3>
                </div>
                <p className="fp-plan-text">{step.text}</p>
                {step.warning && <div className="fp-warning">⚠️ {step.warning}</div>}
                {step.tip && <div className="fp-tip">💡 {step.tip}</div>}
              </div>
            </div>
          ))}
        </div>

        {completedCount === planSteps.length && (
          <div className="fp-complete">
            🎉 Усі кроки пройдено — можна переходити до наступного поєднання
            порід вже з власним досвідом!
          </div>
        )}

        <div className="fp-related">
          <h3 className="fp-related-title">Читайте також</h3>
          <div className="fp-related-grid">
            <Link to="/verified-crosses" className="fp-related-link">🐇 Перевірені поєднання порід</Link>
            <Link to="/incompatible-crosses" className="fp-related-link">🚫 Несумісні поєднання</Link>
            <Link to="/doe-preparation" className="fp-related-link">♀️ Підготовка самки до злучки</Link>
            <Link to="/owner-experience" className="fp-related-link">📝 Досвід власників</Link>
          </div>
        </div>

        <div className="fp-back">
          <Link to="/" className="fp-back-btn">⬅ На головну</Link>
          <ShareButton title="План першого поєднання порід" />
        </div>
      </div>
    </main>
  );
};

export default FirstCrossPlan;
