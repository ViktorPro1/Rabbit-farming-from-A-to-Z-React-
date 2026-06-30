import { useState } from "react";
import "./RabbitSounds.css";
import ShareButton from "../../components/ShareButton/ShareButton";
import { Link } from "react-router-dom";

interface Sound {
  id: string;
  emoji: string;
  name: string;
  ukrainian: string;
  description: string;
  meaning: string;
  context: string;
  intensity: "low" | "medium" | "high";
  emotion: "happy" | "neutral" | "stressed" | "danger";
}

const sounds: Sound[] = [
  {
    id: "purring",
    emoji: "😊",
    name: "Purring / Tooth purring",
    ukrainian: "Муркотіння зубами",
    description: "Тихе клацання або скрипіння зубами — м'яке, ритмічне.",
    meaning: "Задоволення та розслабленість. Кролик у стані повного спокою.",
    context: "Під час поглажування, відпочинку на улюбленому місці, після їжі.",
    intensity: "low",
    emotion: "happy",
  },
  {
    id: "tooth-grinding",
    emoji: "😰",
    name: "Tooth grinding / Bruxism",
    ukrainian: "Скрегіт зубами",
    description:
      "Гучне, виразне скрипіння або скрегіт — помітно відрізняється від муркотіння.",
    meaning: "Біль або сильний дискомфорт. Потребує негайної уваги ветеринара.",
    context: "ШКТ-стаз, зубний біль, будь-який гострий біль.",
    intensity: "high",
    emotion: "danger",
  },
  {
    id: "thumping",
    emoji: "⚠️",
    name: "Thumping",
    ukrainian: "Тупотіння задніми лапами",
    description:
      "Гучний удар задніми лапами об підлогу — один або кілька разів.",
    meaning: "Попередження про небезпеку або невдоволення. Сигнал усій групі.",
    context:
      "Незнайомі звуки/запахи, незнайома людина, незадоволення ситуацією.",
    intensity: "high",
    emotion: "stressed",
  },
  {
    id: "honking",
    emoji: "🐾",
    name: "Honking / Oinking",
    ukrainian: "Гудіння / хрюкання",
    description: "Низьке, ритмічне гудіння або звук схожий на хрюкання.",
    meaning:
      "Збудження — найчастіше пов'язане зі статевою активністю або азартом від їжі.",
    context: "Некастровані кролики під час активності, перед годуванням.",
    intensity: "medium",
    emotion: "neutral",
  },
  {
    id: "growling",
    emoji: "😠",
    name: "Growling",
    ukrainian: "Гарчання",
    description: "Низький, горловий звук — виразне попередження.",
    meaning:
      "Злість або страх. Кролик захищає територію або особистий простір.",
    context:
      "Вторгнення на територію, незнайома людина біля клітки, під час хвороби.",
    intensity: "high",
    emotion: "stressed",
  },
  {
    id: "screaming",
    emoji: "🚨",
    name: "Screaming",
    ukrainian: "Крик",
    description: "Пронизливий, голосний крик — один із найстрашніших звуків.",
    meaning: "Екстремальний страх або агонія. Рідкісний, але критичний сигнал.",
    context: "Напад хижака, сильний біль, смертельна загроза.",
    intensity: "high",
    emotion: "danger",
  },
  {
    id: "whimpering",
    emoji: "😢",
    name: "Whimpering / Whining",
    ukrainian: "Скиглення",
    description: "Тихий, скаргливий звук — нагадує тихий плач.",
    meaning: "Дискомфорт, страх або прохання уваги.",
    context: "Після стресової ситуації, при самотності, у незнайомому місці.",
    intensity: "low",
    emotion: "stressed",
  },
  {
    id: "clucking",
    emoji: "🥕",
    name: "Clucking",
    ukrainian: "Клокотіння",
    description: "Тихий м'який звук, схожий на куряче кудкудакання.",
    meaning: "Задоволення від їжі. Позитивний сигнал.",
    context: "Під час вживання улюблених ласощів або цікавої їжі.",
    intensity: "low",
    emotion: "happy",
  },
  {
    id: "sneezing",
    emoji: "🤧",
    name: "Sneezing",
    ukrainian: "Чхання",
    description: "Разове чхання нормальне; часте — привід для занепокоєння.",
    meaning:
      "Поодиноке чхання — чищення носа. Часте — можливі інфекції дихальних шляхів.",
    context:
      "Пил, сінний пилок; при частому чханні — ветеринарна консультація.",
    intensity: "medium",
    emotion: "neutral",
  },
  {
    id: "buzzing",
    emoji: "💕",
    name: "Buzzing / Soft grunting",
    ukrainian: "Тихе бурчання / вібрація",
    description: "Дуже тихий вібруючий звук, відчувається більше ніж чується.",
    meaning: "Прихильність та прив'язаність до людини або іншого кролика.",
    context: "При сидінні поруч із улюбленою людиною, під час груминг-сесій.",
    intensity: "low",
    emotion: "happy",
  },
];

const emotionConfig = {
  happy: { label: "Позитивний", color: "#7A9E7E" },
  neutral: { label: "Нейтральний", color: "#C4A55A" },
  stressed: { label: "Стрес", color: "#D4845A" },
  danger: { label: "Небезпека", color: "#C0392B" },
};

const intensityLabel = {
  low: "Тихий",
  medium: "Середній",
  high: "Голосний",
};

export default function RabbitSounds() {
  const [active, setActive] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const filtered =
    filter === "all" ? sounds : sounds.filter((s) => s.emotion === filter);

  return (
    <div className="rs-root">
      {/* Header */}
      <header className="rs-header">
        <div className="rs-header__inner">
          <div className="rs-hero">
            <h1 className="rs-hero__title">Мова звуків кролика</h1>
            <p className="rs-hero__sub">
              Кролики — тихі тварини, але кожен звук несе точне повідомлення.
              Тут — вся акустична мова, без домислів.
            </p>
          </div>
        </div>
        <div className="rs-header__wave" aria-hidden="true">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
            <path
              d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z"
              fill="#FAF7F2"
            />
          </svg>
        </div>
      </header>

      {/* Filters */}
      <section className="rs-filters">
        <div className="rs-container">
          <div className="rs-filters__row">
            {["all", "happy", "neutral", "stressed", "danger"].map((f) => (
              <button
                key={f}
                className={`rs-filter-btn ${filter === f ? "rs-filter-btn--active" : ""}`}
                style={
                  filter === f && f !== "all"
                    ? {
                        backgroundColor:
                          emotionConfig[f as keyof typeof emotionConfig]?.color,
                        borderColor:
                          emotionConfig[f as keyof typeof emotionConfig]?.color,
                        color: "#fff",
                      }
                    : {}
                }
                onClick={() => setFilter(f)}
              >
                {f === "all"
                  ? "Усі звуки"
                  : emotionConfig[f as keyof typeof emotionConfig].label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Sound Grid */}
      <main className="rs-main">
        <div className="rs-container">
          <div className="rs-grid">
            {filtered.map((sound) => {
              const isOpen = active === sound.id;
              const cfg = emotionConfig[sound.emotion];
              return (
                <article
                  key={sound.id}
                  className={`rs-card ${isOpen ? "rs-card--open" : ""}`}
                  style={{ "--accent": cfg.color } as React.CSSProperties}
                  onClick={() => setActive(isOpen ? null : sound.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" && setActive(isOpen ? null : sound.id)
                  }
                  aria-expanded={isOpen}
                >
                  <div className="rs-card__top">
                    <span className="rs-card__emoji" aria-hidden="true">
                      {sound.emoji}
                    </span>
                    <div className="rs-card__titles">
                      <h2 className="rs-card__name">{sound.ukrainian}</h2>
                      <span className="rs-card__en">{sound.name}</span>
                    </div>
                    <div className="rs-card__badges">
                      <span
                        className="rs-badge"
                        style={{
                          backgroundColor: cfg.color + "22",
                          color: cfg.color,
                          borderColor: cfg.color + "44",
                        }}
                      >
                        {cfg.label}
                      </span>
                      <span className="rs-badge rs-badge--intensity">
                        {intensityLabel[sound.intensity]}
                      </span>
                    </div>
                    <span className="rs-card__chevron" aria-hidden="true">
                      {isOpen ? "▲" : "▼"}
                    </span>
                  </div>

                  <p className="rs-card__desc">{sound.description}</p>

                  {isOpen && (
                    <div className="rs-card__details">
                      <div className="rs-detail-row">
                        <span className="rs-detail-label">💡 Що означає</span>
                        <p className="rs-detail-text">{sound.meaning}</p>
                      </div>
                      <div className="rs-detail-row">
                        <span className="rs-detail-label">📍 Коли виникає</span>
                        <p className="rs-detail-text">{sound.context}</p>
                      </div>
                      {sound.emotion === "danger" && (
                        <div className="rs-alert">
                          🚨 Негайно зверніться до ветеринара, якщо чуєте цей
                          звук.
                        </div>
                      )}
                    </div>
                  )}

                  <div className="rs-card__wave" aria-hidden="true">
                    <svg viewBox="0 0 120 20" preserveAspectRatio="none">
                      {sound.intensity === "low" && (
                        <path
                          d="M0,10 Q15,8 30,10 Q45,12 60,10 Q75,8 90,10 Q105,12 120,10"
                          stroke={cfg.color}
                          strokeWidth="1.5"
                          fill="none"
                          opacity="0.5"
                        />
                      )}
                      {sound.intensity === "medium" && (
                        <path
                          d="M0,10 Q15,4 30,10 Q45,16 60,10 Q75,4 90,10 Q105,16 120,10"
                          stroke={cfg.color}
                          strokeWidth="1.5"
                          fill="none"
                          opacity="0.6"
                        />
                      )}
                      {sound.intensity === "high" && (
                        <path
                          d="M0,10 Q10,2 20,10 Q30,18 40,10 Q50,2 60,10 Q70,18 80,10 Q90,2 100,10 Q110,18 120,10"
                          stroke={cfg.color}
                          strokeWidth="2"
                          fill="none"
                          opacity="0.7"
                        />
                      )}
                    </svg>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </main>

      {/* Quick reference table */}
      <section className="rs-table-section">
        <div className="rs-container">
          <h2 className="rs-section-title">Швидка довідка</h2>
          <div className="rs-table-wrap">
            <table className="rs-table">
              <thead>
                <tr>
                  <th>Звук</th>
                  <th>Сигнал</th>
                  <th>Дія власника</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Муркотіння зубами</td>
                  <td className="rs-td--happy">Задоволення</td>
                  <td>Нічого — все добре</td>
                </tr>
                <tr>
                  <td>Скрегіт зубами</td>
                  <td className="rs-td--danger">Біль</td>
                  <td>Ветеринар негайно</td>
                </tr>
                <tr>
                  <td>Тупотіння</td>
                  <td className="rs-td--stressed">Тривога</td>
                  <td>Перевірте оточення</td>
                </tr>
                <tr>
                  <td>Гарчання</td>
                  <td className="rs-td--stressed">Попередження</td>
                  <td>Дайте простір</td>
                </tr>
                <tr>
                  <td>Крик</td>
                  <td className="rs-td--danger">Агонія / жах</td>
                  <td>Ветеринар негайно</td>
                </tr>
                <tr>
                  <td>Клокотіння</td>
                  <td className="rs-td--happy">Задоволення</td>
                  <td>Нічого — все добре</td>
                </tr>
                <tr>
                  <td>Чхання (часте)</td>
                  <td className="rs-td--stressed">Можлива інфекція</td>
                  <td>Консультація ветеринара</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <div className="rs-related">
        <h3 className="rs-related-title">Читайте також</h3>
        <div className="rs-related-grid">
          <Link to="/rabbit-body-language" className="rs-related-link">
            🧠 Мова тіла кроля
          </Link>
          <Link to="/rabbit-behavior-problems" className="rs-related-link">
            😤 Проблемна поведінка
          </Link>
          <Link to="/rabbit-stress" className="rs-related-link">
            ⚡ Стрес та переляк
          </Link>
          <Link to="/symptoms" className="rs-related-link">
            🌡️ Симптоматичний пошук
          </Link>
          <Link to="/biology" className="rs-related-link">
            🐾 Біологія та анатомія
          </Link>
        </div>
      </div>

      <div className="rs-back">
        <Link to="/" className="rs-back-btn">
          ⬅ На головну
        </Link>
        <ShareButton title="Назва цієї сторінки" />
      </div>
    </div>
  );
}
