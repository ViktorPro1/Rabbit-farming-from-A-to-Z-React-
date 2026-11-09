interface Props {
  downloads: number | null;
}

export function VizytkaSection({ downloads }: Props) {
  return (
    <div className="admin-section">
      <h2>🖼️ Візитка</h2>
      <div className="stats-codes-row">
        <div className="stats-code-badge total">
          Завантажено разів: <strong>{downloads ?? "…"}</strong>
        </div>
      </div>
    </div>
  );
}
