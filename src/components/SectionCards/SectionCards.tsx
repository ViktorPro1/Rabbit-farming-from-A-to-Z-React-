import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SectionCards.css";
import { groups } from "../../data/sectionCards";

// Flatten all cards for search
// Внутрішні картки (справжні розділи довідника) — це "теми"
const topicCards = groups
  .filter((g) => g.groupTitle !== "Статті")
  .flatMap((g) => g.cards);

// Зовнішні статті-лендінги
const articleCards = groups.find((g) => g.groupTitle === "Статті")?.cards ?? [];

// Для пошуку лишаємо все разом, як і було
const allCards = groups.flatMap((g) => g.cards);

interface SearchResult {
  path: string;
  title: string;
  icon: string;
  desc: string;
  matchedKeywords: string[];
}

function searchCards(query: string): SearchResult[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  for (const card of allCards) {
    const matched: string[] = [];
    const titleMatch = card.title.toLowerCase().includes(q);
    const descMatch = card.desc.toLowerCase().includes(q);
    const keywordMatches = card.keywords.filter((k) =>
      k.toLowerCase().includes(q),
    );

    if (titleMatch) matched.push(card.title);
    if (descMatch) matched.push(card.desc);
    keywordMatches.forEach((k) => matched.push(k));

    if (matched.length > 0) {
      results.push({
        path: card.path,
        title: card.title,
        icon: card.icon,
        desc: card.desc,
        matchedKeywords: [...new Set(matched)].slice(0, 4),
      });
    }
  }

  return results;
}

const SectionCards = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(groups.map((g, i) => [g.groupTitle, i === 0])),
  );
  const navigate = useNavigate();

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.trim().length >= 2) {
      setResults(searchCards(value));
      setSearched(true);
    } else {
      setResults([]);
      setSearched(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setSearched(false);
  };

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <section className="section-cards">
      {/* СТАТИСТИКА */}
      <div className="sc-stats">
        <div className="sc-stats-pill">
          <div className="sc-stat-seg">
            <div
              className="sc-stat-icon"
              style={{ background: "var(--green-pale)" }}
            >
              📂
            </div>
            <div>
              <div className="sc-stat-num">{groups.length}</div>
              <div className="sc-stat-lbl">розділів</div>
            </div>
          </div>
          <div className="sc-stat-seg">
            <div className="sc-stat-icon" style={{ background: "#e1f5ee" }}>
              📄
            </div>
            <div>
              <div className="sc-stat-num">{topicCards.length}</div>
              <div className="sc-stat-lbl">тем</div>
            </div>
          </div>
          <div className="sc-stat-seg">
            <div className="sc-stat-icon" style={{ background: "#fdebd3" }}>
              📰
            </div>
            <div>
              <div className="sc-stat-num">{articleCards.length}</div>
              <div className="sc-stat-lbl">статей</div>
            </div>
          </div>
        </div>
      </div>

      {/* ПОШУК */}
      <div className="sc-search-wrap">
        <div className="sc-search-box">
          <span className="sc-search-icon">🔍</span>
          <input
            className="sc-search-input"
            id="search"
            name="search"
            type="text"
            placeholder="Пошук по довіднику... (петрушка, байкокс, вакцина...)"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {query && (
            <button className="sc-search-clear" onClick={handleClear}>
              ✕
            </button>
          )}
        </div>

        {/* РЕЗУЛЬТАТИ ПОШУКУ */}
        {searched && (
          <div className="sc-search-results">
            {results.length === 0 ? (
              <div className="sc-search-empty">
                <span>😕</span>
                <p>Нічого не знайдено за запитом «{query}»</p>
                <span className="sc-search-tip">
                  Спробуй інше слово — наприклад: «морква», «вакцина», «стаз»
                </span>
              </div>
            ) : (
              <>
                <div className="sc-search-count">
                  Знайдено в {results.length}{" "}
                  {results.length === 1
                    ? "розділі"
                    : results.length < 5
                      ? "розділах"
                      : "розділах"}
                  :
                </div>
                <div className="sc-search-list">
                  {results.map((r) => (
                    <div
                      key={r.path}
                      className="sc-search-item"
                      onClick={() => {
                        if (r.path.startsWith("http")) {
                          window.open(r.path, "_blank", "noopener,noreferrer");
                        } else {
                          navigate(r.path);
                        }
                        handleClear();
                      }}
                    >
                      <span className="sc-search-item-icon">{r.icon}</span>
                      <div className="sc-search-item-body">
                        <strong className="sc-search-item-title">
                          {r.title}
                        </strong>
                        <span className="sc-search-item-desc">{r.desc}</span>
                        <div className="sc-search-item-keywords">
                          {r.matchedKeywords.map((k) => (
                            <span key={k} className="sc-search-keyword">
                              {k}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="sc-search-arrow">→</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <h2 className="section-cards-title">Розділи довідника</h2>

      {/* ГРУПИ З АКОРДЕОНОМ */}
      {groups.map((group) => {
        const isOpen = openGroups[group.groupTitle];
        return (
          <div key={group.groupTitle} className="section-group">
            <button
              className={`section-group-header section-group-header--btn${isOpen ? " section-group-header--open" : ""}`}
              onClick={() => toggleGroup(group.groupTitle)}
              aria-expanded={isOpen}
            >
              <span className="section-group-icon">{group.groupIcon}</span>
              <div className="section-group-title-wrap">
                <h3 className="section-group-title">{group.groupTitle}</h3>
                {!isOpen && (
                  <span className="section-group-preview">
                    {group.cards.map((c) => c.title).join(" · ")}
                  </span>
                )}
              </div>
              <span className="section-group-chevron">
                {isOpen ? "▲" : "▼"}
              </span>
            </button>

            {isOpen && (
              <div className="section-cards-grid">
                {group.cards.map((card) =>
                  card.external ? (
                    <a
                      href={card.path}
                      key={card.path}
                      className="section-card"
                      target="_blank"
                      rel="noopener noreferrer"
                      title={card.desc}
                    >
                      <span className="section-card-icon">{card.icon}</span>
                      <span className="section-card-title">{card.title}</span>
                      <span className="section-card-desc">{card.desc}</span>
                    </a>
                  ) : (
                    <Link
                      to={card.path}
                      key={card.path}
                      className="section-card"
                      title={card.desc}
                    >
                      <span className="section-card-icon">{card.icon}</span>
                      <span className="section-card-title">{card.title}</span>
                      <span className="section-card-desc">{card.desc}</span>
                    </Link>
                  ),
                )}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
};

export default SectionCards;
