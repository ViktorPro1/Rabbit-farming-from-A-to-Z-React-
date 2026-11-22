import { supabase } from "../../lib/supabase";
import { BACKUP_TABLES, BACKUP_VERSION } from "./backupConfig";

// Зберігає всі дані кролівника в один JSON-файл (з id та зв'язками).
// Помилки не ловить: їх обробляє викликач, як і в exportAllCSV.
// Повертає кількість записів по таблицях, щоб показати підсумок користувачу.

const PAGE_SIZE = 1000; // Supabase за один запит віддає не більше 1000 рядків

async function fetchAll(
  table: string,
  uid: string,
  noUserId: boolean,
): Promise<Record<string, unknown>[]> {
  const rows: Record<string, unknown>[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    let query = supabase.from(table).select("*");
    if (!noUserId) query = query.eq("user_id", uid);
    const { data, error } = await query
      .order("id", { ascending: true })
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw new Error(`${table}: ${error.message}`);
    const page = (data ?? []) as Record<string, unknown>[];
    rows.push(...page);
    if (page.length < PAGE_SIZE) break;
  }
  return rows;
}

export async function exportBackupJSON(
  uid: string,
): Promise<Record<string, number>> {
  const tables: Record<string, Record<string, unknown>[]> = {};
  const counts: Record<string, number> = {};

  for (const t of BACKUP_TABLES) {
    const rows = await fetchAll(t.name, uid, t.noUserId === true);
    tables[t.name] = rows;
    counts[t.name] = rows.length;
  }

  const backup = {
    app: "rabbit-registry",
    version: BACKUP_VERSION,
    exported_at: new Date().toISOString(),
    counts,
    tables,
  };

  const blob = new Blob([JSON.stringify(backup)], {
    type: "application/json;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `резервна-копія-кролівника-${new Date()
    .toISOString()
    .slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);

  return counts;
}
