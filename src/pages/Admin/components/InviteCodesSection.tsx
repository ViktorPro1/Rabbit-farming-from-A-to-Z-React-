import type { BackendStats, InviteCode } from "../types";

interface Props {
  codes: InviteCode[];
  stats: BackendStats | null;
  newCode: string;
  error: string;
  onNewCodeChange: (value: string) => void;
  onGenerate: () => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
}

export function InviteCodesSection({
  codes,
  stats,
  newCode,
  error,
  onNewCodeChange,
  onGenerate,
  onAdd,
  onDelete,
}: Props) {
  return (
    <div className="admin-section">
      <h2>🎟️ Інвайт коди</h2>

      {stats && (
        <div className="stats-codes-row">
          <div className="stats-code-badge total">
            Всього кодів: <strong>{stats.totalCodes}</strong>
          </div>
          <div className="stats-code-badge used">
            Використано: <strong>{stats.usedCodes}</strong>
          </div>
          <div className="stats-code-badge free">
            Вільних: <strong>{stats.freeCodes}</strong>
          </div>
        </div>
      )}

      <div className="admin-add">
        <input
          id="new-invite-code"
          name="newInviteCode"
          placeholder="Новий код"
          value={newCode}
          onChange={(e) => onNewCodeChange(e.target.value.toUpperCase())}
        />
        <button className="admin-btn-generate" onClick={onGenerate}>
          Генерувати
        </button>
        <button
          className="admin-btn-add"
          onClick={onAdd}
          disabled={!newCode.trim()}
        >
          Додати
        </button>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Код</th>
              <th>Статус</th>
              <th>Створено</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {codes.map((code) => (
              <tr key={code.id} className={code.is_used ? "used" : ""}>
                <td className="code-text">{code.code}</td>
                <td>
                  <span
                    className={`code-status ${code.is_used ? "used" : "free"}`}
                  >
                    {code.is_used ? "Використано" : "Вільний"}
                  </span>
                </td>
                <td>{new Date(code.created_at).toLocaleDateString("uk-UA")}</td>
                <td>
                  {!code.is_used && (
                    <button
                      className="admin-btn-delete"
                      onClick={() => onDelete(code.id)}
                    >
                      Видалити
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
