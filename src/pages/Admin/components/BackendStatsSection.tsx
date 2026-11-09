import { useState } from "react";
import { formatBytes } from "../formatBytes";
import { UsageBar } from "./UsageBar";
import type { BackendStats } from "../types";

const DB_LIMIT_BYTES = 500 * 1024 * 1024;
// Ліміт файлового сховища на тарифі Free
const STORAGE_LIMIT_BYTES = 1024 * 1024 * 1024;
const MAU_LIMIT = 50000;

interface Props {
  stats: BackendStats | null;
  loading: boolean;
}

export function BackendStatsSection({ stats, loading }: Props) {
  const [tablesOpen, setTablesOpen] = useState(false);

  return (
    <div className="admin-section">
      <h2>📊 Статистика бекенду (Supabase Free)</h2>

      {loading ? (
        <p style={{ opacity: 0.6 }}>Завантаження статистики...</p>
      ) : stats ? (
        <>
          <div className="stats-limits">
            <div className="stats-limit-card">
              <div className="stats-limit-title">База даних</div>
              <div className="stats-limit-value">
                {stats.dbSizeBytes !== null
                  ? formatBytes(stats.dbSizeBytes)
                  : "—"}
              </div>
              <div className="stats-limit-max">ліміт 500 МБ</div>
              {stats.dbSizeBytes !== null && (
                <UsageBar
                  used={stats.dbSizeBytes}
                  total={DB_LIMIT_BYTES}
                  label=""
                />
              )}
            </div>

            <div className="stats-limit-card">
              <div className="stats-limit-title">Користувачі</div>
              <div className="stats-limit-value">{stats.totalUsers}</div>
              <div className="stats-limit-max">
                ліміт {MAU_LIMIT.toLocaleString()} MAU
              </div>
              <UsageBar
                used={stats.totalUsers}
                total={MAU_LIMIT}
                label=""
                color="#2196f3"
              />
            </div>

            <div className="stats-limit-card">
              <div className="stats-limit-title">Файлове сховище</div>
              <div className="stats-limit-value">
                {stats.storageBytes !== null
                  ? formatBytes(stats.storageBytes)
                  : "—"}
              </div>
              <div className="stats-limit-max">
                ліміт 1 ГБ
                {stats.storageFiles !== null
                  ? ` · ${stats.storageFiles} файлів`
                  : ""}
              </div>
              {stats.storageBytes !== null ? (
                <UsageBar
                  used={stats.storageBytes}
                  total={STORAGE_LIMIT_BYTES}
                  label=""
                />
              ) : (
                <div className="stats-limit-note">
                  Не вдалося отримати дані сховища
                </div>
              )}
            </div>

            <div className="stats-limit-card">
              <div className="stats-limit-title">Bandwidth</div>
              <div className="stats-limit-value">10 ГБ</div>
              <div className="stats-limit-max">ліміт / місяць</div>
              <div className="stats-limit-note">
                Моніторинг — у Supabase Dashboard
              </div>
            </div>
          </div>

          {/* Записи у таблицях — акордеон (згорнуто за замовчуванням) */}
          <div className="stats-tables">
            <button
              type="button"
              className="stats-tables-title stats-tables-toggle"
              onClick={() => setTablesOpen((open) => !open)}
              aria-expanded={tablesOpen}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                font: "inherit",
                color: "inherit",
              }}
            >
              <span>Записи у таблицях</span>
              <span
                aria-hidden="true"
                style={{
                  display: "inline-block",
                  transition: "transform 0.2s ease",
                  transform: tablesOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                ▾
              </span>
            </button>

            {tablesOpen && (
              <div className="stats-tables-grid">
                {stats.tableCounts.map((t) => (
                  <div key={t.name} className="stats-table-card">
                    <div className="stats-table-label">{t.label}</div>
                    <div className="stats-table-count">{t.count}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <p style={{ opacity: 0.6 }}>Статистика недоступна</p>
      )}
    </div>
  );
}
