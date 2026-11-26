import { formatBytes } from "../formatBytes";
import type { UserDataUsage } from "../types";

interface Props {
  usage: UserDataUsage[];
  loading: boolean;
}

// Від скількох голів господарство вважається "більшим" (тариф 250 грн)
const BIG_HERD_FROM = 100;

export function UserUsageSection({ usage, loading }: Props) {
  return (
    <div className="admin-section">
      <h2>
        💾 Використання по користувачах{" "}
        <span className="admin-count">{usage.length}</span>
      </h2>

      {loading ? (
        <p style={{ opacity: 0.6 }}>Завантаження...</p>
      ) : usage.length === 0 ? (
        <p style={{ opacity: 0.6 }}>Немає даних</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Голів</th>
                <th>Записи</th>
                <th>На диску</th>
              </tr>
            </thead>
            <tbody>
              {usage.map((u, i) => {
                const isBig =
                  u.herdCount !== null && u.herdCount >= BIG_HERD_FROM;
                return (
                  <tr key={u.userId}>
                    <td>{i + 1}</td>
                    <td>{u.email || "—"}</td>
                    <td
                      title={
                        isBig
                          ? `Від ${BIG_HERD_FROM} голів: тариф для більшого поголів'я`
                          : undefined
                      }
                      style={
                        isBig
                          ? { fontWeight: 700, color: "#b45309" }
                          : undefined
                      }
                    >
                      {u.herdCount === null ? "—" : u.herdCount}
                    </td>
                    <td>{formatBytes(u.dataBytes)}</td>
                    <td>{formatBytes(u.totalBytes)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
