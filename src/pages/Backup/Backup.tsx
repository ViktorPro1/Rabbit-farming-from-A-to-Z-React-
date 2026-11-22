import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { exportBackupJSON } from "../RabbitRegistry/backupExport";
import {
  countBackup,
  findNonEmptyTables,
  readBackupFile,
  restoreBackup,
} from "../RabbitRegistry/backupImport";
import type { BackupFile } from "../RabbitRegistry/backupImport";
import "./Backup.css";

const TABLE_LABELS: Record<string, string> = {
  rabbits: "Кролі",
  paddocks: "Вольєри",
  paddock_females: "Самиці у вольєрах",
  expenses: "Витрати",
  fattening: "Відгодівля",
  matings: "Парування",
  litters: "Окроли",
  paddock_matings: "Вольєрні парування",
  paddock_litters: "Вольєрні окроли",
  quarantine: "Карантин",
  weighings: "Зважування",
  sales: "Продажі",
  medication_batches: "Аптечка",
  feed_batches: "Корми",
  breeding_plan: "План підбору",
  vaccinations: "Вакцинації",
  treatments: "Лікування",
  cage_disinfections: "Дезінфекція",
  grain_recipes: "Раціони",
  other_income: "Інші доходи",
};

function CountsList({ counts }: { counts: Record<string, number> }) {
  return (
    <ul className="backup-counts">
      {Object.entries(counts)
        .filter(([, n]) => n > 0)
        .map(([table, n]) => (
          <li key={table}>
            <span>{TABLE_LABELS[table] ?? table}</span>
            <span>{n}</span>
          </li>
        ))}
    </ul>
  );
}

const sum = (counts: Record<string, number>) =>
  Object.values(counts).reduce((a, b) => a + b, 0);

export default function Backup({ session }: { session: Session }) {
  const navigate = useNavigate();
  const uid = session.user.id;

  // ── Збереження ──
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState<Record<string, number> | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    setSaved(null);
    try {
      setSaved(await exportBackupJSON(uid));
    } catch (e) {
      setSaveError(
        e instanceof Error ? e.message : "Не вдалося зберегти копію",
      );
    } finally {
      setSaving(false);
    }
  };

  // ── Відновлення ──
  const [backup, setBackup] = useState<BackupFile | null>(null);
  const [fileName, setFileName] = useState("");
  const [notEmpty, setNotEmpty] = useState(false);
  const [checking, setChecking] = useState(false);
  const [progress, setProgress] = useState("");
  const [restoring, setRestoring] = useState(false);
  const [restoreError, setRestoreError] = useState("");
  const [restored, setRestored] = useState<{
    counts: Record<string, number>;
    brokenLinks: number;
  } | null>(null);

  const handleFile = async (file: File | undefined) => {
    setBackup(null);
    setFileName("");
    setNotEmpty(false);
    setRestoreError("");
    setRestored(null);
    if (!file) return;
    setChecking(true);
    try {
      const parsed = await readBackupFile(file);
      const busy = await findNonEmptyTables(uid);
      setBackup(parsed);
      setFileName(file.name);
      setNotEmpty(busy.length > 0);
    } catch (e) {
      setRestoreError(
        e instanceof Error ? e.message : "Не вдалося прочитати файл",
      );
    } finally {
      setChecking(false);
    }
  };

  const handleRestore = async () => {
    if (!backup) return;
    setRestoring(true);
    setRestoreError("");
    setProgress("");
    try {
      const result = await restoreBackup(uid, backup, (table) =>
        setProgress(TABLE_LABELS[table] ?? table),
      );
      setRestored(result);
      setBackup(null);
      setFileName("");
    } catch (e) {
      setRestoreError(
        e instanceof Error
          ? `${e.message}. Нічого не змінено.`
          : "Не вдалося відновити дані. Нічого не змінено.",
      );
    } finally {
      setRestoring(false);
      setProgress("");
    }
  };

  const backupCounts = backup ? countBackup(backup) : null;

  return (
    <main className="backup-page">
      <button className="backup-back" onClick={() => navigate(-1)}>
        ← Мої кролики
      </button>

      <header className="backup-hero">
        <h1 className="backup-title">Резервна копія даних</h1>
        <p className="backup-lead">
          Усі ваші дані в одному файлі. З ним їх можна повернути в кабінет, якщо
          доступ до сервісу закінчиться, а потім ви його поновите.
        </p>
      </header>

      {/* ───────── Збереження ───────── */}
      <h2 className="backup-h2">Зберегти копію</h2>
      <ol className="backup-steps">
        <li>
          Натисніть <strong>«Зберегти копію»</strong>. Файл завантажиться на ваш
          пристрій.
        </li>
        <li>
          Збережіть файл у надійному місці: у хмарі, на пошті або на флешці.
        </li>
        <li>Не змінюйте файл вручну, інакше відновлення може не спрацювати.</li>
      </ol>

      <section className="backup-action">
        <button
          className="backup-save"
          onClick={handleSave}
          disabled={saving || restoring}
          aria-busy={saving}
        >
          {saving ? "Формую файл..." : "Зберегти копію"}
        </button>

        {saveError && (
          <p className="backup-msg backup-msg--error" role="alert">
            {saveError}
          </p>
        )}

        {saved && (
          <div className="backup-msg backup-msg--ok" role="status">
            <strong>Копію збережено: {sum(saved)} записів</strong>
            <CountsList counts={saved} />
          </div>
        )}
      </section>

      <p className="backup-note">
        У копію входять кролі, парування, окроли, вольєри, карантин, лікування,
        вакцинація, дезінфекція, аптечка, зважування, відгодівля, продажі,
        фінанси, корми та раціони. Фотографії не зберігаються.
      </p>

      {/* ───────── Відновлення ───────── */}
      <h2 className="backup-h2 backup-h2--spaced">Відновити з копії</h2>
      <ol className="backup-steps">
        <li>
          Відновлення працює <strong>лише в порожній кабінет</strong>, щоб
          нічого не задвоїти.
        </li>
        <li>
          Натисніть <strong>«Вибрати файл копії»</strong> і оберіть збережений
          файл <code>.json</code>.
        </li>
        <li>Перевірте, що показано в підсумку, і підтвердьте відновлення.</li>
      </ol>

      <section className="backup-action">
        <label
          className={`backup-pick ${
            checking || restoring ? "backup-pick--disabled" : ""
          }`}
        >
          {checking ? "Перевіряю файл..." : "Вибрати файл копії"}
          <input
            type="file"
            id="backup-file"
            name="backup-file"
            accept=".json,application/json"
            disabled={checking || restoring}
            onChange={(e) => {
              void handleFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </label>

        {restoreError && (
          <p className="backup-msg backup-msg--error" role="alert">
            {restoreError}
          </p>
        )}

        {backup && backupCounts && (
          <div className="backup-msg backup-msg--info" role="status">
            <strong>
              У файлі «{fileName}»: {sum(backupCounts)} записів
            </strong>
            {backup.exported_at && (
              <p className="backup-meta">
                Копію створено:{" "}
                {new Date(backup.exported_at).toLocaleString("uk-UA")}
              </p>
            )}
            <CountsList counts={backupCounts} />
          </div>
        )}

        {backup && notEmpty && (
          <p className="backup-msg backup-msg--error" role="alert">
            У вашому кабінеті вже є дані. Відновлення можливе лише в порожній
            кабінет.
          </p>
        )}

        {backup && !notEmpty && (
          <button
            className="backup-save backup-save--spaced"
            onClick={handleRestore}
            disabled={restoring}
            aria-busy={restoring}
          >
            {restoring ? `Відновлюю: ${progress || "..."}` : "Відновити дані"}
          </button>
        )}

        {restored && (
          <div className="backup-msg backup-msg--ok" role="status">
            <strong>Дані відновлено: {sum(restored.counts)} записів</strong>
            {restored.brokenLinks > 0 && (
              <p className="backup-meta">
                Пропущено пошкоджених зв'язків: {restored.brokenLinks}
              </p>
            )}
            <CountsList counts={restored.counts} />
            <button
              className="backup-link-btn"
              onClick={() => navigate("/registry")}
            >
              Перейти до реєстру
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
