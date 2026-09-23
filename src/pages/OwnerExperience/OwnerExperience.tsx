import { useState } from "react";
import { Link } from "react-router-dom";
import "./OwnerExperience.css";
import ShareButton from "../../components/ShareButton/ShareButton";

type Topic = "all" | "meat" | "outdoor" | "home" | "mistakes";

interface Note {
  emoji: string;
  role: string;
  topic: Exclude<Topic, "all">;
  text: string;
  tag: string;
}

const notes: Note[] = [
  {
    emoji: "🍖",
    role: "Господарство з товарним напрямком",
    topic: "meat",
    text: "Поєднання каліфорнійської з новозеландською білою власники товарних господарств регулярно відзначають як «безвідмовне»: молодняк рівномірний за вагою, добре їсть, рідко хворіє в перший місяць після відлучення.",
    tag: "М'ясо",
  },
  {
    emoji: "⚠️",
    role: "Досвід із фландром",
    topic: "meat",
    text: "Помісь із фландром часто описують як «повільний старт, потужний фініш» — у перші тижні молодняк росте не швидше за інших, зате в підсумку дає більшу дорослу вагу.",
    tag: "М'ясо",
  },
  {
    emoji: "❄️",
    role: "Вуличне утримання",
    topic: "outdoor",
    text: "Власники, що тримають кролів у неопалюваних шедах, часто зазначають: сама по собі морозостійка порода не рятує, якщо клітка стоїть на протязі — саме захист від вітру виявляється важливішим за густоту хутра.",
    tag: "Вулиця",
  },
  {
    emoji: "🌾",
    role: "Зимівля молодняку",
    topic: "outdoor",
    text: "Практика показує: додатковий шар соломи в гнізді восени, ще до перших морозів, помітно знижує втрати молодняку взимку — навіть у морозостійких помісей.",
    tag: "Вулиця",
  },
  {
    emoji: "🏠",
    role: "Домашнє утримання",
    topic: "home",
    text: "Найчастіша скарга власників декоративних помісей — «купували карликового, а виросло 3+ кг». Ті, хто заздалегідь бачив хоча б одного з батьків кроленяти, значно рідше стикались із таким розчаруванням.",
    tag: "Дім",
  },
  {
    emoji: "🤝",
    role: "Характер вислоухих помісей",
    topic: "home",
    text: "Власники вислоухих помісей часто відзначають спокійніший характер порівняно з прямовухими лініями — але й частіші проблеми з вухами, які потребують регулярного огляду.",
    tag: "Дім",
  },
  {
    emoji: "🚫",
    role: "Типова помилка новачків",
    topic: "mistakes",
    text: "Найпоширеніша помилка серед тих, хто вперше пробує схрещування, — залишати помісне потомство (F1) для подальшого розведення «бо ж вийшло добре». Друге покоління зазвичай розчаровує непередбачуваністю.",
    tag: "Помилки",
  },
  {
    emoji: "📋",
    role: "Значення записів",
    topic: "mistakes",
    text: "Господарства, що ведуть письмовий облік схрещувань (навіть у простому блокноті), значно рідше стикаються з випадковим інбридингом і краще повторюють вдалі поєднання в майбутньому.",
    tag: "Помилки",
  },
];

const topicLabels: Record<Exclude<Topic, "all">, string> = {
  meat: "🍖 М'ясо",
  outdoor: "❄️ Вулиця",
  home: "🏠 Дім",
  mistakes: "🚫 Помилки",
};

const OwnerExperience = () => {
  const [filter, setFilter] = useState<Topic>("all");
  const filtered = filter === "all" ? notes : notes.filter((n) => n.topic === filter);

  return (
    <main className="oe-page">
      <div className="oe-header">
        <h1>📝 Досвід власників</h1>
        <p>Узагальнені спостереження з практики схрещування</p>
      </div>

      <div className="oe-wrap">
        <div className="oe-notice">
          ℹ️ Це узагальнені закономірності з практики багатьох господарств, а
          не цитати конкретних людей — індивідуальний результат завжди може
          відрізнятись.
        </div>

        <div className="oe-filters">
          <button className={`oe-filter${filter === "all" ? " active" : ""}`} onClick={() => setFilter("all")}>
            Усі нотатки
          </button>
          {(Object.keys(topicLabels) as Exclude<Topic, "all">[]).map((t) => (
            <button
              key={t}
              className={`oe-filter${filter === t ? " active" : ""}`}
              onClick={() => setFilter(t)}
            >
              {topicLabels[t]}
            </button>
          ))}
        </div>

        <div className="oe-feed">
          {filtered.map((note, i) => (
            <div key={i} className="oe-note">
              <div className="oe-note-head">
                <span className="oe-note-avatar">{note.emoji}</span>
                <div className="oe-note-meta">
                  <span className="oe-note-role">{note.role}</span>
                  <span className="oe-note-tag">{note.tag}</span>
                </div>
              </div>
              <p className="oe-note-text">{note.text}</p>
            </div>
          ))}
        </div>

        <div className="oe-related">
          <h3 className="oe-related-title">Читайте також</h3>
          <div className="oe-related-grid">
            <Link to="/verified-crosses" className="oe-related-link">🐇 Перевірені поєднання порід</Link>
            <Link to="/meat-crosses" className="oe-related-link">🍖 Помісі для м'яса</Link>
            <Link to="/outdoor-crosses" className="oe-related-link">❄️ Помісі для вуличного утримання</Link>
            <Link to="/incompatible-crosses" className="oe-related-link">🚫 Несумісні поєднання</Link>
          </div>
        </div>

        <div className="oe-back">
          <Link to="/" className="oe-back-btn">⬅ На головну</Link>
          <ShareButton title="Досвід власників" />
        </div>
      </div>
    </main>
  );
};

export default OwnerExperience;
