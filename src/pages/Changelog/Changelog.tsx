import { CHANGELOG } from "../../data/changelog";
import "./Changelog.css";

const Changelog = () => {
  const sorted = [...CHANGELOG].reverse();
  const latestId = sorted[0]?.id;

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("uk-UA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <main className="changelog-page">
      <h1>Оновлення</h1>
      <p className="changelog-page-sub">Історія змін та нових функцій</p>

      <div className="changelog-timeline">
        {sorted.map((entry) => (
          <div key={entry.id} className="changelog-entry">
            <div
              className={`changelog-dot${entry.id === latestId ? " latest" : ""}`}
            />
            <div className="changelog-entry-date">
              {formatDate(entry.created_at)}
            </div>
            <div
              className={`changelog-card${entry.id === latestId ? " latest" : ""}`}
            >
              {entry.id === latestId && (
                <span className="changelog-card-badge">НОВЕ</span>
              )}
              <h2>{entry.title}</h2>
              {entry.description && <p>{entry.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Changelog;
