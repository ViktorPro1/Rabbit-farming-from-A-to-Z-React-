import "./Community.css";

interface CommunityItem {
  id: number;
  platform: "facebook" | "telegram" | "tiktok" | "youtube";
  platformLabel: string;
  tag: string;
  tagColor: "green" | "blue" | "amber";
  name: string;
  description: string;
  members: string;
  url: string;
}

const communities: CommunityItem[] = [
  {
    id: 1,
    platform: "tiktok",
    platformLabel: "TikTok",
    tag: "Відео",
    tagColor: "amber",
    name: "@kroliahiy_dvir_2076",
    description:
      "Кролячий двір — відео , догляд за кроликами, реальне життя господарства",
    members: "—",
    url: "https://www.tiktok.com/@kroliahiy_dvir_2076?_r=1&_t=ZS-94Nb403s6nV",
  },
  {
    id: 2,
    platform: "telegram",
    platformLabel: "Telegram",
    tag: "Спільнота",
    tagColor: "blue",
    name: "Кролівництво України",
    description:
      "Свіжа україномовна спільнота для кролівників — розвивається, нові учасники вітаються",
    members: "—",
    url: "https://t.me/krolivnyctvo_ukrainy",
  },
];

const platformDotClass: Record<CommunityItem["platform"], string> = {
  facebook: "community__dot--fb",
  telegram: "community__dot--tg",
  tiktok: "community__dot--tk",
  youtube: "community__dot--yt",
};

const tagClass: Record<"green" | "blue" | "amber", string> = {
  green: "community__tag--green",
  blue: "community__tag--blue",
  amber: "community__tag--amber",
};

export default function Community() {
  return (
    <div className="community">
      <div className="community__hero">
        <span className="community__hero-badge">Добірка спільнот</span>
        <h1 className="community__hero-title">Де спілкуються кролівники</h1>
        <p className="community__hero-sub">
          Обмінюйтеся досвідом, ставте запитання та знаходьте однодумців у
          найкращих групах для кролівників.
        </p>
      </div>

      <div className="community__grid">
        {communities.map((c) => (
          <div className="community__card" key={c.id}>
            <div className="community__card-top">
              <span
                className={`community__dot ${platformDotClass[c.platform]}`}
              ></span>
              <span className="community__platform-label">
                {c.platformLabel}
              </span>
            </div>
            <span className={`community__tag ${tagClass[c.tagColor]}`}>
              {c.tag}
            </span>
            <p className="community__card-name">{c.name}</p>
            <p className="community__card-desc">{c.description}</p>
            <div className="community__card-meta">
              <a
                className="community__visit-btn"
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Перейти →
              </a>
            </div>
          </div>
        ))}

        <div className="community__add-box">
          <div className="community__add-icon">+</div>
          <p className="community__add-text">
            Знаєш хорошу спільноту?
            <br />
            Запропонуй для каталогу
          </p>
        </div>
      </div>

      <div className="community__note">
        Маєте цікавий канал чи групу? Поділіться з іншими кролівниками — ми
        додамо вас до списку!
      </div>

      <a href="/" className="community__back">
        ⬅ На головну
      </a>
    </div>
  );
}
