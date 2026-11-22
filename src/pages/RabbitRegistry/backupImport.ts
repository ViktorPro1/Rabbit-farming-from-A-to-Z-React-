import { supabase } from "../../lib/supabase";
import { BACKUP_TABLES, BACKUP_VERSION } from "./backupConfig";
import type { BackupTable } from "./backupConfig";

// Відновлення даних із файлу резервної копії.
// Правила:
//  1. Відновлюємо лише в ПОРОЖНІЙ кабінет, щоб нічого не задвоїти.
//  2. Кожен запис отримує новий id, а посилання між таблицями
//     перепризначаються за цими новими id.
//  3. Якщо щось пішло не так посередині, усе вставлене видаляється,
//     і кабінет лишається порожнім.

export type Row = Record<string, unknown>;

export interface BackupFile {
  app: string;
  version: number;
  exported_at?: string;
  tables: Record<string, Row[]>;
}

export interface RestoreResult {
  counts: Record<string, number>;
  /** посилання, яких у файлі не знайшлося (очищені, а не вигадані) */
  brokenLinks: number;
}

const CHUNK = 500;
const MAX_FILE_BYTES = 30 * 1024 * 1024;

function chunks<T>(items: T[], size = CHUNK): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

function hasSelfRef(t: BackupTable): boolean {
  return Object.values(t.refs ?? {}).some((target) => target === t.name);
}

// ── 1. Читання й перевірка файлу ──────────────────────────────────────

export async function readBackupFile(file: {
  size: number;
  text: () => Promise<string>;
}): Promise<BackupFile> {
  if (file.size > MAX_FILE_BYTES) {
    throw new Error("Файл завеликий для резервної копії");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(await file.text());
  } catch {
    throw new Error("Не вдалося прочитати файл. Оберіть файл резервної копії.");
  }

  const obj = parsed as Partial<BackupFile> | null;
  if (!obj || typeof obj !== "object" || obj.app !== "rabbit-registry") {
    throw new Error("Це не файл резервної копії цього застосунку");
  }
  if (typeof obj.version !== "number" || obj.version > BACKUP_VERSION) {
    throw new Error(
      "Копію створено новішою версією застосунку. Оновіть сторінку і спробуйте ще раз.",
    );
  }
  if (!obj.tables || typeof obj.tables !== "object") {
    throw new Error("Файл пошкоджено: немає даних");
  }

  const tables: Record<string, Row[]> = {};
  for (const t of BACKUP_TABLES) {
    const rows = (obj.tables as Record<string, unknown>)[t.name] ?? [];
    if (!Array.isArray(rows)) {
      throw new Error(`Файл пошкоджено: розділ «${t.name}»`);
    }
    for (const row of rows) {
      if (
        !row ||
        typeof row !== "object" ||
        typeof (row as Row).id !== "string"
      ) {
        throw new Error(`Файл пошкоджено: розділ «${t.name}»`);
      }
    }
    tables[t.name] = rows as Row[];
  }

  return {
    app: obj.app,
    version: obj.version,
    exported_at: obj.exported_at,
    tables,
  };
}

export function countBackup(backup: BackupFile): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const t of BACKUP_TABLES) counts[t.name] = backup.tables[t.name].length;
  return counts;
}

// ── 2. Чи порожній кабінет ────────────────────────────────────────────

/** Повертає назви таблиць, у яких уже є дані цього користувача. */
export async function findNonEmptyTables(uid: string): Promise<string[]> {
  const busy: string[] = [];
  for (const t of BACKUP_TABLES) {
    let query = supabase
      .from(t.name)
      .select("id", { count: "exact", head: true });
    if (!t.noUserId) query = query.eq("user_id", uid);
    const { count, error } = await query;
    if (error) throw new Error(`${t.name}: ${error.message}`);
    if ((count ?? 0) > 0) busy.push(t.name);
  }
  return busy;
}

// ── 3. Відновлення ────────────────────────────────────────────────────

export async function restoreBackup(
  uid: string,
  backup: BackupFile,
  onProgress?: (table: string) => void,
): Promise<RestoreResult> {
  const busy = await findNonEmptyTables(uid);
  if (busy.length > 0) {
    throw new Error(
      "У кабінеті вже є дані. Відновлення можливе лише в порожній кабінет.",
    );
  }

  // Старий id -> новий id, окремо для кожної таблиці
  const idMap: Record<string, Map<string, string>> = {};
  for (const t of BACKUP_TABLES) {
    const map = new Map<string, string>();
    for (const row of backup.tables[t.name]) {
      map.set(row.id as string, crypto.randomUUID());
    }
    idMap[t.name] = map;
  }

  let brokenLinks = 0;

  // selfRefsAsNull: перший прохід для таблиць, що посилаються самі на себе
  const build = (t: BackupTable, row: Row, selfRefsAsNull: boolean): Row => {
    const out: Row = { ...row };
    out.id = idMap[t.name].get(row.id as string);
    if (!t.noUserId) out.user_id = uid;
    for (const col of t.generated ?? []) delete out[col];
    for (const col of t.clear ?? []) out[col] = null;
    for (const [col, target] of Object.entries(t.refs ?? {})) {
      const old = row[col];
      if (old === null || old === undefined) {
        out[col] = null;
      } else if (selfRefsAsNull && target === t.name) {
        out[col] = null;
      } else {
        const mapped = idMap[target]?.get(old as string);
        if (mapped) {
          out[col] = mapped;
        } else {
          out[col] = null;
          brokenLinks += 1;
        }
      }
    }
    return out;
  };

  const touched: BackupTable[] = [];
  const counts: Record<string, number> = {};

  try {
    for (const t of BACKUP_TABLES) {
      const source = backup.tables[t.name];
      counts[t.name] = source.length;
      if (source.length === 0) continue;

      onProgress?.(t.name);
      touched.push(t);

      const selfRef = hasSelfRef(t);

      // Проход 1: вставка (для самопосилань, напр. мати/батько в rabbits,
      // спершу без посилань, бо батьки можуть бути в іншій порції)
      for (const part of chunks(source)) {
        const rows = part.map((r) => build(t, r, selfRef));
        const { error } = await supabase.from(t.name).insert(rows);
        if (error) throw new Error(`${t.name}: ${error.message}`);
      }

      // Проход 2: тепер усі записи вже є, проставляємо самопосилання
      if (selfRef) {
        for (const part of chunks(source)) {
          const rows = part.map((r) => build(t, r, false));
          const { error } = await supabase
            .from(t.name)
            .upsert(rows, { onConflict: "id" });
          if (error) throw new Error(`${t.name}: ${error.message}`);
        }
      }
    }
  } catch (e) {
    await rollback(touched, idMap);
    throw e;
  }

  return { counts, brokenLinks };
}

/** Видаляє лише те, що встигли вставити, у зворотному порядку. */
async function rollback(
  touched: BackupTable[],
  idMap: Record<string, Map<string, string>>,
): Promise<void> {
  for (const t of [...touched].reverse()) {
    const ids = [...idMap[t.name].values()];
    // Спершу прибираємо самопосилання в УСІХ порціях, інакше запис однієї
    // порції може тримати посилання на запис іншої, і видалення не пройде.
    if (hasSelfRef(t)) {
      const clearSelf: Row = {};
      for (const [col, target] of Object.entries(t.refs ?? {})) {
        if (target === t.name) clearSelf[col] = null;
      }
      for (const part of chunks(ids)) {
        await supabase.from(t.name).update(clearSelf).in("id", part);
      }
    }
    for (const part of chunks(ids)) {
      await supabase.from(t.name).delete().in("id", part);
    }
  }
}
