import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import {
  buildCostAnalysis,
  type CostGroup,
  type CostResult,
  type ExpenseInput,
  type FatteningInput,
  type RabbitInput,
  type WeighingInput,
} from "./costAnalysis";
import "./CostAnalysis.css";

interface Props {
  session: Session;
}

type Tab = "batches" | "rabbits";

const GROUP_LABELS: Record<CostGroup, string> = {
  feed: "Корм",
  vet: "Препарати та вакцинація",
  other: "Інші витрати",
};

function localToday(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function formatUAH(value: number): string {
  return `${value.toLocaleString("uk-UA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} грн`;
}

function formatKg(value: number): string {
  return `${value.toLocaleString("uk-UA", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  })} кг`;
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  const [y, m, d] = value.slice(0, 10).split("-");
  return `${d}.${m}.${y}`;
}

function CostRow({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className={strong ? "costan-row costan-row-strong" : "costan-row"}>
      <span className="costan-row-label">{label}</span>
      <span className="costan-row-value">{value}</span>
    </div>
  );
}

function BatchCard({ item }: { item: CostResult }) {
  const weightLabel =
    item.weightBasis === "carcass"
      ? "Загальна вага туші"
      : "Загальна жива вага (зважування)";
  return (
    <div className="costan-card">
      <div className="costan-card-head">
        <div>
          <h3 className="costan-card-title">{item.label}</h3>
          <div className="costan-card-sub">
            Внесено {formatDate(item.start)}
            {item.days !== null && ` · ${item.days} діб`}
          </div>
        </div>
        <span
          className={
            item.isActive
              ? "costan-badge costan-badge-active"
              : "costan-badge costan-badge-done"
          }
        >
          {item.isActive ? "Триває" : "Завершено"}
        </span>
      </div>

      <CostRow label="Кількість кролів" value={`${item.heads} гол.`} />

      {item.missing ? (
        <div className="costan-missing">{item.missing}</div>
      ) : (
        <>
          <CostRow label="Корм" value={formatUAH(item.feedCost)} />
          <CostRow
            label="Препарати та вакцинація"
            value={formatUAH(item.vetCost)}
          />
          <CostRow label="Інші витрати" value={formatUAH(item.otherCost)} />
          <CostRow
            label="Загальні витрати"
            value={formatUAH(item.totalCost)}
            strong
          />
          {item.weightKg !== null ? (
            <CostRow label={weightLabel} value={formatKg(item.weightKg)} />
          ) : (
            <div className="costan-missing">
              Немає ваги: ні зважувань, ні ваги туші. Собівартість 1 кг не
              розраховано.
            </div>
          )}
          <CostRow
            label="Собівартість 1 кроля"
            value={formatUAH(item.costPerHead as number)}
            strong
          />
          {item.costPerKg !== null && (
            <CostRow
              label={
                item.weightBasis === "carcass"
                  ? "Собівартість 1 кг ваги туші"
                  : "Собівартість 1 кг живої ваги"
              }
              value={formatUAH(item.costPerKg)}
              strong
            />
          )}
          {item.isActive && (
            <div className="costan-hint">
              Партія ще триває: показники розраховано станом на сьогодні.
            </div>
          )}
        </>
      )}
    </div>
  );
}

function RabbitCard({ item }: { item: CostResult }) {
  return (
    <div className="costan-card">
      <div className="costan-card-head">
        <div>
          <h3 className="costan-card-title">{item.label}</h3>
          <div className="costan-card-sub">
            На фермі з {formatDate(item.start)}
            {item.days !== null && ` · ${item.days} діб`}
          </div>
        </div>
        <span
          className={
            item.isActive
              ? "costan-badge costan-badge-active"
              : "costan-badge costan-badge-done"
          }
        >
          {item.isActive ? "Активний" : "В архіві"}
        </span>
      </div>
      {item.missing ? (
        <div className="costan-missing">{item.missing}</div>
      ) : (
        <>
          <CostRow
            label="Накопичені витрати"
            value={formatUAH(item.totalCost)}
            strong
          />
          {item.costPerDay !== null && (
            <CostRow
              label="Витрати за добу"
              value={formatUAH(item.costPerDay)}
            />
          )}
          {item.weightKg !== null ? (
            <>
              <CostRow
                label="Остання вага"
                value={formatKg(item.weightKg)}
              />
              {item.costPerKg !== null && (
                <CostRow
                  label="Собівартість 1 кг живої ваги"
                  value={formatUAH(item.costPerKg)}
                />
              )}
            </>
          ) : (
            <div className="costan-hint">
              Немає зважувань, тому вагу й собівартість 1 кг не розраховано.
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function CostAnalysis({ session }: Props) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("batches");
  const [includeEquipment, setIncludeEquipment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [expenses, setExpenses] = useState<ExpenseInput[]>([]);
  const [fattening, setFattening] = useState<FatteningInput[]>([]);
  const [rabbits, setRabbits] = useState<RabbitInput[]>([]);
  const [weighings, setWeighings] = useState<WeighingInput[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [expensesRes, fatteningRes, rabbitsRes, weighingsRes] =
          await Promise.all([
            supabase
              .from("expenses")
              .select("category, amount, expense_date")
              .eq("user_id", session.user.id),
            supabase
              .from("fattening")
              .select(
                "id, cage_number, males, females, unknown, created_at, slaughtered_at, is_active, carcass_weight_kg",
              )
              .eq("user_id", session.user.id),
            supabase
              .from("rabbits")
              .select("id, name, cage_number, is_active, created_at, archive_date")
              .eq("user_id", session.user.id),
            supabase
              .from("weighings")
              .select("fattening_id, rabbit_id, weighing_date, weight_g")
              .eq("user_id", session.user.id),
          ]);
        if (cancelled) return;
        const firstError =
          expensesRes.error ||
          fatteningRes.error ||
          rabbitsRes.error ||
          weighingsRes.error;
        if (firstError) {
          setLoadError("Не вдалося завантажити дані. Спробуйте пізніше.");
        } else {
          setExpenses((expensesRes.data || []) as ExpenseInput[]);
          setFattening((fatteningRes.data || []) as FatteningInput[]);
          setRabbits((rabbitsRes.data || []) as RabbitInput[]);
          setWeighings((weighingsRes.data || []) as WeighingInput[]);
        }
      } catch {
        if (!cancelled) {
          setLoadError("Не вдалося завантажити дані. Спробуйте пізніше.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [session.user.id]);

  const analysis = buildCostAnalysis(expenses, fattening, rabbits, weighings, {
    includeEquipment,
    today: localToday(),
  });

  // Активні партії — першими, далі за датою внесення (новіші вище).
  const batches = [...analysis.batches].sort((a, b) => {
    if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
    return (b.start || "").localeCompare(a.start || "");
  });
  const rabbitList = [...analysis.rabbits].sort((a, b) => {
    if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
    return a.label.localeCompare(b.label, "uk");
  });
  const visibleGroups = analysis.groups.filter((g) => g.spent > 0);

  return (
    <div className="costan-page">
      <div className="costan-header">
        <h1>Аналіз собівартості</h1>
        <button className="costan-back-btn" onClick={() => navigate("/registry")}>
          Мої кролики
        </button>
      </div>

      {loading ? (
        <div className="costan-loading">Завантаження...</div>
      ) : loadError ? (
        <div className="costan-error">{loadError}</div>
      ) : (
        <>
          <div className="costan-controls">
            <div className="costan-tabs">
              <button
                className={
                  tab === "batches" ? "costan-tab costan-tab-active" : "costan-tab"
                }
                onClick={() => setTab("batches")}
              >
                Партії відгодівлі
              </button>
              <button
                className={
                  tab === "rabbits" ? "costan-tab costan-tab-active" : "costan-tab"
                }
                onClick={() => setTab("rabbits")}
              >
                Кролі з реєстру
              </button>
            </div>
            <label className="costan-check">
              <input
                type="checkbox"
                id="costan-include-equipment"
                name="includeEquipment"
                checked={includeEquipment}
                onChange={(e) => setIncludeEquipment(e.target.checked)}
              />
              Враховувати обладнання у витратах
            </label>
          </div>

          {tab === "batches" ? (
            batches.length === 0 ? (
              <div className="costan-empty">
                Партій відгодівлі ще немає. Додайте їх у розділі «Відгодівля».
              </div>
            ) : (
              <div className="costan-grid">
                {batches.map((b) => (
                  <BatchCard key={b.id} item={b} />
                ))}
              </div>
            )
          ) : rabbitList.length === 0 ? (
            <div className="costan-empty">
              У реєстрі ще немає кролів.
            </div>
          ) : (
            <div className="costan-grid">
              {rabbitList.map((r) => (
                <RabbitCard key={r.id} item={r} />
              ))}
            </div>
          )}

          <section className="costan-section">
            <h2>Як розподілено витрати</h2>
            {visibleGroups.length === 0 ? (
              <div className="costan-empty">
                У Фінансах ще немає витрат для розрахунку.
              </div>
            ) : (
              <div className="costan-table-wrap">
                <table className="costan-table">
                  <thead>
                    <tr>
                      <th>Категорія</th>
                      <th>Витрачено</th>
                      <th>На відгодівлю</th>
                      <th>На кролів реєстру</th>
                      <th>Не розподілено</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleGroups.map((g) => (
                      <tr key={g.group}>
                        <td>{GROUP_LABELS[g.group]}</td>
                        <td>{formatUAH(g.spent)}</td>
                        <td>{formatUAH(g.toBatches)}</td>
                        <td>{formatUAH(g.toRabbits)}</td>
                        <td>{formatUAH(g.unallocated)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <details className="costan-details">
            <summary>Як це рахується</summary>
            <div className="costan-details-body">
              <p>
                Усі витрати беруться з розділу «Фінанси», вводити їх вдруге не
                потрібно. Вага береться із «Зважування»; якщо зважувань немає,
                для завершених партій використовується вага туші з «Фінансів».
              </p>
              <p>
                У Фінансах витрати не прив'язані до окремих партій, тому вони
                розподіляються пропорційно голово-дням: кількість голів
                помножена на кількість діб на фермі. Розрахунок ведеться від
                першої витрати відповідної категорії до сьогодні. Це оцінка, а
                не точний облік.
              </p>
              <p>
                Період партії рахується від дати її внесення у «Відгодівлю» до
                дати забою, а для активної партії до сьогодні. Корм і препарати
                поголів'я реєстру теж враховуються в розподілі, тому частина
                витрат припадає на них.
              </p>
              <p>
                Обладнання за замовчуванням не входить у витрати, бо це разова
                інвестиція; його можна ввімкнути прапорцем вище.
              </p>
            </div>
          </details>
        </>
      )}
    </div>
  );
}
