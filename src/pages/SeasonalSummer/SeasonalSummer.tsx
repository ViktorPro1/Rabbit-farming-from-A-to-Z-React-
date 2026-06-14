import { useState } from "react";
import { Link } from "react-router-dom";
import "./SeasonalSummer.css";

const riskFactors = [
  {
    icon: "💩",
    text: "Забруднена шерсть навколо хвоста — цекотрофи, рідкий послід, сеча",
  },
  { icon: "⚖️", text: "Ожиріння — кролик не може нормально чиститись" },
  { icon: "🦷", text: "Зубні проблеми або артрит — обмежений туалет" },
  {
    icon: "🌡️",
    text: "Температура понад +10°C — мухи починають відкладати яйця",
  },
  {
    icon: "👵",
    text: "Кролики старше 5 років — у 3,8 рази вищий ризик (дані PMC 2018)",
  },
  {
    icon: "♀️",
    text: "Некастровані самки — у 3,3 рази вищий ризик (дані PMC 2018)",
  },
  { icon: "💧", text: "Волога підстилка, погана вентиляція" },
  { icon: "🩹", text: "Відкриті рани, абсцеси, мокнуча дерматиті" },
];

const symptoms = [
  {
    stage: "1–3 год",
    desc: "Кролик неспокійний, часто чешеться або виглядає пригніченим. Може бігати колами.",
    color: "yellow",
  },
  {
    stage: "3–6 год",
    desc: "Вологе або сплутане волосся навколо хвоста, промежини. Слабкий запах.",
    color: "orange",
  },
  {
    stage: "6–12 год",
    desc: "Видимі дрібні білі личинки (1–5 мм). Рани. Кролик відмовляється від їжі.",
    color: "red",
  },
  {
    stage: "12–24 год",
    desc: "Токсемія, гіпотермія, шок. Без лікування — летальний результат.",
    color: "critical",
  },
];

const preventionSteps = [
  {
    title: "Щоденний огляд",
    text: "Кожен день перевіряй зону навколо хвоста, промежини та пахових складок. Особливо ввечері — мухи активні вдень.",
  },
  {
    title: "Чистота клітки",
    text: "Прибирання вологої підстилки та посліду мінімум раз на день. Влітку — двічі. Аміачний запах приваблює мух.",
  },
  {
    title: "Стрижка шерсті навколо хвоста",
    text: "У довгошерстих і кролів з зайвою вагою — регулярно підстригай шерсть навколо хвоста та промежини. Суха чиста шкіра не приваблює мух.",
  },
  {
    title: "Сітки від мух",
    text: "Москітна сітка на клітку або відкриті секції вольєра. Дрібна сітка (менше 1×1 мм) для зеленої мухи.",
  },
  {
    title: "Контроль ваги та здоров'я",
    text: "Ожирілі кролі та тварини з зубними проблемами не можуть нормально чиститись. Це найбільший фактор ризику.",
  },
  {
    title: "Препаративна профілактика",
    text: "Ціромазин (Rearguard) — наноситься на шерсть навколо хвоста, діє 6–10 тижнів. Блокує розвиток личинок. Тільки за призначенням ветеринара.",
  },
];

const SeasonalSummer = () => {
  const [showAction, setShowAction] = useState(false);

  return (
    <main className="ss-page">
      <div className="ss-back">
        <Link to="/" className="ss-back-link">
          ← Головна
        </Link>
      </div>

      <div className="ss-hero">
        <span className="ss-hero-icon">☀️</span>
        <h1>Літо: Міаз (личинки мух)</h1>
        <p>
          Найнебезпечніша сезонна загроза. Смерть протягом 24–48 годин без
          лікування
        </p>
      </div>

      <div className="ss-alert">
        <span className="ss-alert-icon">🚨</span>
        <div>
          <strong>Що таке міаз</strong>
          <p>
            Зелена муха (Lucilia sericata) або синя (Calliphora sp.) відкладає
            яйця в забруднену, вологу шерсть кроля — зазвичай навколо хвоста і
            промежини. За 12–24 години з яєць виходять личинки, які буквально
            проїдають живу тканину. Тварина входить у токсемічний шок. Кожен 1°C
            підвищення температури навколишнього середовища збільшує ризик міазу
            на 33%.
          </p>
        </div>
      </div>

      <section className="ss-section">
        <h2>Фактори ризику</h2>
        <p className="ss-lead">
          Здорова суха шкіра мух не приваблює. Проблема виникає при поєднанні
          забруднення + тепло + муха.
        </p>
        <div className="ss-risks">
          {riskFactors.map((r, i) => (
            <div key={i} className="ss-risk-item">
              <span>{r.icon}</span>
              <span>{r.text}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="ss-section">
        <h2>Розвиток по годинах — часу мало</h2>
        <div className="ss-timeline">
          {symptoms.map((s, i) => (
            <div key={i} className={`ss-stage ss-stage--${s.color}`}>
              <div className="ss-stage-time">{s.stage}</div>
              <p className="ss-stage-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="ss-section">
        <h2>Профілактика — 6 кроків</h2>
        <div className="ss-prevention">
          {preventionSteps.map((s, i) => (
            <div key={i} className="ss-prev-item">
              <div className="ss-prev-num">{i + 1}</div>
              <div className="ss-prev-body">
                <strong>{s.title}</strong>
                <p>{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="ss-section">
        <h2>Знайшов личинки — що робити</h2>
        <button
          className="ss-action-toggle"
          onClick={() => setShowAction(!showAction)}
        >
          {showAction ? "Згорнути ▲" : "Показати алгоритм дій ▼"}
        </button>
        {showAction && (
          <div className="ss-action-box">
            <div className="ss-action-warning">
              Це ветеринарна невідкладка. Без негайної допомоги кролик загине.
            </div>
            <ol className="ss-action-list">
              <li>
                <strong>Дзвони ветеринару зараз</strong> — не через годину, не
                завтра. Поки чекаєш — виконуй наступні кроки.
              </li>
              <li>
                <strong>Збрий шерсть</strong> навколо ураженої ділянки машинкою
                або ножицями з тупими кінцями. Потрібен огляд площі ураження.
              </li>
              <li>
                <strong>Видали видимих личинок</strong> пінцетом або промий
                теплою водою. Але не всіх видно — вони вже під шкірою.
              </li>
              <li>
                <strong>Зігрій кроля</strong> якщо він холодний або в прострації
                — рушник або грілка (не гаряча!) під бік.
              </li>
              <li>
                <strong>Не обробляй рану</strong> антисептиком самостійно до
                огляду ветеринара — можеш погіршити стан шкіри.
              </li>
            </ol>
          </div>
        )}
      </section>

      <div className="ss-footer-note">
        <span>📌</span>
        <p>
          Міаз — 100% попереджувана хвороба. Щоденний 30-секундний огляд хвоста
          і чиста підстилка рятують життя.
        </p>
      </div>
    </main>
  );
};

export default SeasonalSummer;
