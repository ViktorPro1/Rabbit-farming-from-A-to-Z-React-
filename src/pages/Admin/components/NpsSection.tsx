import type { NpsFeedbackRow } from "../types";

interface Props {
  feedback: NpsFeedbackRow[];
  loading: boolean;
}

export function NpsSection({ feedback, loading }: Props) {
  const total = feedback.length;
  const promoters = feedback.filter((f) => f.category === "promoter").length;
  const passives = feedback.filter((f) => f.category === "passive").length;
  const detractors = feedback.filter((f) => f.category === "detractor").length;
  const average =
    total > 0
      ? (feedback.reduce((sum, f) => sum + f.score, 0) / total).toFixed(1)
      : "—";
  const score =
    total > 0 ? Math.round(((promoters - detractors) / total) * 100) : null;

  return (
    <div className="admin-section">
      <h2>
        ⭐ Опитування NPS <span className="admin-count">{feedback.length}</span>
      </h2>

      {total > 0 && (
        <>
          <div className="stats-limits">
            <div className="stats-limit-card">
              <div className="stats-limit-title">Середня оцінка</div>
              <div className="stats-limit-value">{average}</div>
              <div className="stats-limit-max">з 10</div>
            </div>
            <div className="stats-limit-card">
              <div className="stats-limit-title">NPS-індекс</div>
              <div className="stats-limit-value">{score}</div>
              <div className="stats-limit-max">
                % промоутерів − % детракторів
              </div>
            </div>
          </div>

          <div className="stats-codes-row">
            <div className="stats-code-badge free">
              Промоутери (9–10): <strong>{promoters}</strong>
            </div>
            <div className="stats-code-badge used">
              Нейтральні (7–8): <strong>{passives}</strong>
            </div>
            <div className="stats-code-badge detractor">
              Детрактори (0–6): <strong>{detractors}</strong>
            </div>
          </div>
        </>
      )}

      {loading ? (
        <p style={{ opacity: 0.6 }}>Завантаження...</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Оцінка</th>
                <th>Коментар</th>
                <th>Дата</th>
              </tr>
            </thead>
            <tbody>
              {feedback.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", opacity: 0.5 }}>
                    Ще немає відповідей
                  </td>
                </tr>
              ) : (
                feedback.map((f, i) => (
                  <tr key={f.id}>
                    <td>{i + 1}</td>
                    <td>
                      <span
                        className={`nps-score-badge nps-score-badge--${f.category}`}
                      >
                        {f.score}
                      </span>
                    </td>
                    <td>{f.comment || "—"}</td>
                    <td>
                      {new Date(f.created_at).toLocaleDateString("uk-UA")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
