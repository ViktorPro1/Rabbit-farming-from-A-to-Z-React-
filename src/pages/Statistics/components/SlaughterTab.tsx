import EmptyState from "./EmptyState";
import { groupByMonth, headCount, monthLabelFull, monthsDesc } from "../utils";
import type { SlaughteredCage } from "../types";

export default function SlaughterTab({ cages }: { cages: SlaughteredCage[] }) {
  const total = cages.reduce((s, c) => s + headCount(c), 0);

  // Групуємо по місяцях
  const byMonth = groupByMonth(cages, (c) => c.slaughtered_at);
  const months = monthsDesc(byMonth);

  if (cages.length === 0) {
    return (
      <EmptyState
        icon="🔪"
        title="Забоїв ще не було"
        description="Після першого підтвердженого забою у розділі Відгодівля — дані з'являться тут автоматично."
      />
    );
  }

  return (
    <div className="slaughter-tab">
      <div className="slaughter-summary">
        <div className="slaughter-summary-item">
          <span className="slaughter-summary-val">{cages.length}</span>
          <span className="slaughter-summary-label">Кліток забито</span>
        </div>
        <div className="slaughter-summary-item">
          <span className="slaughter-summary-val">{total}</span>
          <span className="slaughter-summary-label">Голів всього</span>
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
              <span className="slaughter-month-total">{groupTotal} гол.</span>
            </div>
            <div className="slaughter-list">
              {group.map((c) => {
                const count = headCount(c);
                return (
                  <div key={c.id} className="slaughter-row">
                    <div className="slaughter-row-left">
                      <span className="slaughter-cage">
                        Клітка {c.cage_number}
                      </span>
                      {c.breed && (
                        <span className="slaughter-breed">{c.breed}</span>
                      )}
                    </div>
                    <div className="slaughter-row-right">
                      <span className="slaughter-count">{count} гол.</span>
                      <span className="slaughter-date">
                        {new Date(c.slaughtered_at).toLocaleDateString("uk-UA")}
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
