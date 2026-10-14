import EmptyState from "./EmptyState";
import { groupByMonth, headCount, monthLabelFull, monthsDesc } from "../utils";
import type { SaleRecord } from "../types";

export default function SalesTab({ sales }: { sales: SaleRecord[] }) {
  const total = sales.reduce((s, c) => s + headCount(c), 0);

  const byMonth = groupByMonth(sales, (s) => s.sold_at);
  const months = monthsDesc(byMonth);

  if (sales.length === 0) {
    return (
      <EmptyState
        icon="💰"
        title="Продажів ще не було"
        description="Після першого продажу у розділі Відгодівля (кнопка «Продано») — дані з'являться тут автоматично."
      />
    );
  }

  return (
    <div className="slaughter-tab">
      <div className="slaughter-summary">
        <div
          className="slaughter-summary-item"
          style={{ borderTopColor: "#c9a227" }}
        >
          <span className="slaughter-summary-val" style={{ color: "#c9a227" }}>
            {sales.length}
          </span>
          <span className="slaughter-summary-label">Продажів</span>
        </div>
        <div
          className="slaughter-summary-item"
          style={{ borderTopColor: "#c9a227" }}
        >
          <span className="slaughter-summary-val" style={{ color: "#c9a227" }}>
            {total}
          </span>
          <span className="slaughter-summary-label">Голів продано</span>
        </div>
      </div>

      {months.map((month) => {
        const group = byMonth[month];
        const groupTotal = group.reduce((s, c) => s + headCount(c), 0);
        return (
          <div key={month} className="slaughter-month">
            <div className="slaughter-month-header">
              <span className="slaughter-month-title">
                {monthLabelFull(month)}
              </span>
              <span
                className="slaughter-month-total"
                style={{ color: "#c9a227" }}
              >
                {groupTotal} гол.
              </span>
            </div>
            <div className="slaughter-list">
              {group.map((s) => {
                const count = headCount(s);
                const parts: string[] = [];
                if (s.males) parts.push(`♂ ${s.males}`);
                if (s.females) parts.push(`♀ ${s.females}`);
                if (s.unknown) parts.push(`? ${s.unknown}`);
                return (
                  <div
                    key={s.id}
                    className="slaughter-row"
                    style={{ borderLeftColor: "#c9a227" }}
                  >
                    <div className="slaughter-row-left">
                      <span className="slaughter-cage">
                        {parts.join(" · ")}
                      </span>
                    </div>
                    <div className="slaughter-row-right">
                      <span
                        className="slaughter-count"
                        style={{ color: "#c9a227" }}
                      >
                        {count} гол.
                      </span>
                      <span className="slaughter-date">
                        {new Date(s.sold_at).toLocaleDateString("uk-UA")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
