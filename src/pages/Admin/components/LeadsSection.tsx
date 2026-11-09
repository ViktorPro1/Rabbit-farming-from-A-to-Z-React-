import type { LeadRow } from "../types";

interface Props {
  leads: LeadRow[];
}

export function LeadsSection({ leads }: Props) {
  return (
    <div className="admin-section">
      <h2>
        📧 Ліди (лід-магніт) <span className="admin-count">{leads.length}</span>
      </h2>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Email</th>
              <th>Джерело</th>
              <th>Дата</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", opacity: 0.5 }}>
                  Ще немає лідів
                </td>
              </tr>
            ) : (
              leads.map((lead, i) => (
                <tr key={lead.id}>
                  <td>{i + 1}</td>
                  <td>{lead.email}</td>
                  <td className="code-text">{lead.source}</td>
                  <td>
                    {new Date(lead.created_at).toLocaleDateString("uk-UA")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
