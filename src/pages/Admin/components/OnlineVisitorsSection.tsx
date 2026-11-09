import type { OnlineVisitor } from "../types";

interface Props {
  visitors: OnlineVisitor[];
}

export function OnlineVisitorsSection({ visitors }: Props) {
  return (
    <div className="admin-section">
      <h2>
        🟢 Зараз онлайн у довіднику{" "}
        <span className="admin-count">{visitors.length}</span>
      </h2>

      {visitors.length === 0 ? (
        <p className="online-empty">Немає активних відвідувачів</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Сторінка</th>
                <th>Зайшов</th>
              </tr>
            </thead>
            <tbody>
              {visitors.map((v, i) => (
                <tr key={v.session_id}>
                  <td>{i + 1}</td>
                  <td className="online-page">{v.page || "/"}</td>
                  <td>
                    {new Date(v.joined_at).toLocaleTimeString("uk-UA", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
