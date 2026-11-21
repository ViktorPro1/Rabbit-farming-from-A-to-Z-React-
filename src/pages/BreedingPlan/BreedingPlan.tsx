import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import { logError } from "../../lib/logError";
import "./BreedingPlan.css";
import type {
  RabbitRow,
  MatingRow,
  LitterRow,
  RecordStatus,
  Filter,
  FemalePlan,
  PlanRecord,
  NewPlanInput,
  MaleOption,
} from "./types";
import {
  RECORD_META,
  STATUS_META,
  STATUS_ORDER,
  PAIR_META,
  MALE_WEEK_LIMIT,
  PREGNANCY_DAYS,
} from "./constants";
import {
  daysBetween,
  addDays,
  todayKyiv,
  formatDateUA,
  pluralDays,
  daysLeftLabel,
} from "./dateUtils";
import {
  computeFemalePlans,
  sortPlans,
  countByStatus,
  toRows,
} from "./planLogic";
import { buildMaleOptions } from "./pairLogic";

interface Props {
  session: Session;
}

const NO_OPTIONS: MaleOption[] = [];
const NO_RECORDS: PlanRecord[] = [];

// ── Панель підбору самця: список з оцінкою і форма «Запланувати» ──

interface MalePickerProps {
  female: RabbitRow;
  options: MaleOption[];
  pedigreeNote: string | null;
  plannedForFemale: PlanRecord[];
  saving: boolean;
  error: string;
  today: string;
  onCreate: (input: NewPlanInput) => Promise<boolean>;
}

function MalePicker({
  female,
  options,
  pedigreeNote,
  plannedForFemale,
  saving,
  error,
  today,
  onCreate,
}: MalePickerProps) {
  // Рекомендований самець: перший, у кого спорідненості немає і хто не перевантажений
  const recommended =
    options.find(
      (o) => o.pairing.level === "ok" && o.matingsLast7Days < MALE_WEEK_LIMIT,
    ) ?? null;
  const firstAllowed =
    options.find((o) => o.pairing.level !== "danger") ?? null;

  const [maleId, setMaleId] = useState(
    recommended?.rabbit.id ?? firstAllowed?.rabbit.id ?? "",
  );
  const [backupId, setBackupId] = useState("");
  const [date, setDate] = useState(today);
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  const chosen = options.find((o) => o.rabbit.id === maleId) ?? null;
  const canSave =
    !!chosen && chosen.pairing.level !== "danger" && !!date && !saving;
  const nextPlanned = plannedForFemale[0] ?? null;

  function handleMaleChange(value: string) {
    setMaleId(value);
    // Запасним не може бути той самий самець
    if (backupId === value) setBackupId("");
    setMessage("");
  }

  async function handleSubmit() {
    if (!chosen || !canSave) return;
    setMessage("");
    const ok = await onCreate({
      femaleId: female.id,
      maleId: chosen.rabbit.id,
      backupMaleId: backupId || null,
      plannedDate: date,
      notes: notes.trim(),
    });
    if (ok) {
      setMessage(
        `Заплановано: ${chosen.rabbit.name}, ${formatDateUA(date)}. Дивіться список нижче.`,
      );
      setBackupId("");
      setNotes("");
    }
  }

  return (
    <div className="plan-pick-panel">
      {pedigreeNote && <p className="plan-pick-note">{pedigreeNote}</p>}
      {nextPlanned && (
        <p className="plan-pick-note">
          Для цієї самки вже є запланована злучка на{" "}
          {formatDateUA(nextPlanned.planned_date)}. Нову можна додати, якщо
          потрібно.
        </p>
      )}

      {options.length === 0 ? (
        <p className="plan-pick-empty">Активних самців у реєстрі немає.</p>
      ) : (
        <>
          <ul className="plan-pick-list">
            {options.map((o) => {
              const pairMeta = PAIR_META[o.pairing.level];
              const overloaded = o.matingsLast7Days >= MALE_WEEK_LIMIT;
              const isRecommended = recommended?.rabbit.id === o.rabbit.id;
              const maleSub = [
                o.rabbit.breed,
                o.rabbit.cage_number ? `кл. ${o.rabbit.cage_number}` : null,
              ]
                .filter(Boolean)
                .join(" · ");
              return (
                <li
                  key={o.rabbit.id}
                  className={`plan-pick-item plan-pick-${o.pairing.level}`}
                >
                  <div className="plan-pick-top">
                    <span className="plan-pick-name">♂ {o.rabbit.name}</span>
                    <span className="plan-pick-badges">
                      {isRecommended && (
                        <span className="plan-pick-badge plan-pick-badge-recommend">
                          <span aria-hidden="true">⭐</span> Рекомендовано
                        </span>
                      )}
                      <span
                        className={`plan-pick-badge plan-pick-badge-${o.pairing.level}`}
                      >
                        <span aria-hidden="true">{pairMeta.icon}</span>{" "}
                        {pairMeta.label}
                      </span>
                    </span>
                  </div>
                  {maleSub && <span className="plan-pick-sub">{maleSub}</span>}
                  <span className="plan-pick-text">{o.pairing.text}</span>
                  <span className="plan-pick-load">
                    {o.lastMating
                      ? `Остання злучка: ${formatDateUA(o.lastMating)} · за 7 днів: ${o.matingsLast7Days}`
                      : "Злучок ще не було"}
                    {overloaded && (
                      <span className="plan-pick-overload">Часто в роботі</span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="plan-pick-form">
            <h4 className="plan-pick-form-title">Запланувати злучку</h4>
            <div className="plan-pick-form-grid">
              <div className="plan-pick-field">
                <label htmlFor={`plan-male-${female.id}`}>Самець</label>
                <select
                  id={`plan-male-${female.id}`}
                  name="planMale"
                  value={maleId}
                  onChange={(e) => handleMaleChange(e.target.value)}
                >
                  {!chosen && <option value="">Оберіть самця</option>}
                  {options.map((o) => (
                    <option
                      key={o.rabbit.id}
                      value={o.rabbit.id}
                      disabled={o.pairing.level === "danger"}
                    >
                      {o.rabbit.name} · {PAIR_META[o.pairing.level].label}
                      {recommended?.rabbit.id === o.rabbit.id
                        ? " · рекомендовано"
                        : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="plan-pick-field">
                <label htmlFor={`plan-backup-${female.id}`}>
                  Запасний самець
                </label>
                <select
                  id={`plan-backup-${female.id}`}
                  name="planBackup"
                  value={backupId}
                  onChange={(e) => setBackupId(e.target.value)}
                >
                  <option value="">Без запасного</option>
                  {options
                    .filter((o) => o.rabbit.id !== maleId)
                    .map((o) => (
                      <option
                        key={o.rabbit.id}
                        value={o.rabbit.id}
                        disabled={o.pairing.level === "danger"}
                      >
                        {o.rabbit.name} · {PAIR_META[o.pairing.level].label}
                      </option>
                    ))}
                </select>
              </div>

              <div className="plan-pick-field">
                <label htmlFor={`plan-date-${female.id}`}>Планова дата</label>
                <input
                  id={`plan-date-${female.id}`}
                  name="planDate"
                  type="date"
                  min={today}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="plan-pick-field">
                <label htmlFor={`plan-notes-${female.id}`}>Нотатки</label>
                <input
                  id={`plan-notes-${female.id}`}
                  name="planNotes"
                  placeholder="Необов'язково"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            {chosen && chosen.pairing.level === "warn" && (
              <p className="plan-pick-hint">
                Обережно: {chosen.pairing.text}. Парувати лише свідомо.
              </p>
            )}
            {chosen && chosen.pairing.level === "unknown" && (
              <p className="plan-pick-hint">
                Спорідненість не перевірено: {chosen.pairing.text.toLowerCase()}
                .
              </p>
            )}

            {error && <p className="plan-error">{error}</p>}
            {message && <p className="plan-pick-message">{message}</p>}

            <button
              type="button"
              className="plan-pick-submit"
              onClick={() => void handleSubmit()}
              disabled={!canSave}
            >
              {saving ? "Збереження..." : "Запланувати"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ── Блок 3: список запланованих злучок ──

interface PlanQueueProps {
  records: PlanRecord[];
  rabbitName: (id: string | null) => string;
  today: string;
  busyId: string | null;
  error: string;
  showHistory: boolean;
  onToggleHistory: () => void;
  onDone: (record: PlanRecord) => void;
  onSetStatus: (record: PlanRecord, status: RecordStatus) => void;
  onDelete: (record: PlanRecord) => void;
}

function PlanQueue({
  records,
  rabbitName,
  today,
  busyId,
  error,
  showHistory,
  onToggleHistory,
  onDone,
  onSetStatus,
  onDelete,
}: PlanQueueProps) {
  const planned = records
    .filter((r) => r.status === "planned")
    .sort((a, b) => a.planned_date.localeCompare(b.planned_date));
  const history = records
    .filter((r) => r.status !== "planned")
    .sort((a, b) => b.planned_date.localeCompare(a.planned_date));

  function renderItem(r: PlanRecord) {
    const meta = RECORD_META[r.status];
    const diff = daysBetween(today, r.planned_date);
    const late = r.status === "planned" && diff < 0;
    const busy = busyId === r.id;
    return (
      <li key={r.id} className={`plan-queue-item plan-queue-${r.status}`}>
        <div className="plan-queue-top">
          <span className="plan-queue-pair">
            ♀ {rabbitName(r.female_id)} + ♂ {rabbitName(r.male_id)}
          </span>
          <span className={`plan-queue-badge plan-queue-badge-${r.status}`}>
            <span aria-hidden="true">{meta.icon}</span> {meta.label}
          </span>
        </div>
        <div className="plan-queue-meta">
          <span>
            Дата: <strong>{formatDateUA(r.planned_date)}</strong>
          </span>
          {r.status === "planned" && (
            <span
              className={`plan-queue-when${late ? " plan-queue-late" : ""}`}
            >
              {daysLeftLabel(diff)}
            </span>
          )}
          {r.backup_male_id && (
            <span>Запасний: ♂ {rabbitName(r.backup_male_id)}</span>
          )}
          {r.status === "done" && r.mating_id && (
            <span>Записано в «Парування»</span>
          )}
        </div>
        {r.notes && <span className="plan-queue-notes">{r.notes}</span>}
        <div className="plan-queue-actions">
          {r.status === "planned" && (
            <>
              <button
                type="button"
                className="plan-queue-btn plan-queue-btn-done"
                disabled={busy}
                onClick={() => onDone(r)}
              >
                {busy ? "Запис..." : "Виконано"}
              </button>
              <button
                type="button"
                className="plan-queue-btn"
                disabled={busy}
                onClick={() => onSetStatus(r, "cancelled")}
              >
                Відмінити
              </button>
            </>
          )}
          {r.status === "cancelled" && (
            <button
              type="button"
              className="plan-queue-btn"
              disabled={busy}
              onClick={() => onSetStatus(r, "planned")}
            >
              Відновити
            </button>
          )}
          <button
            type="button"
            className="plan-queue-btn plan-queue-btn-danger"
            disabled={busy}
            onClick={() => onDelete(r)}
          >
            Видалити
          </button>
        </div>
      </li>
    );
  }

  return (
    <section className="plan-queue">
      <h2 className="plan-queue-title">🗂 Заплановані злучки</h2>
      {error && <p className="plan-error">{error}</p>}

      {planned.length === 0 ? (
        <p className="plan-queue-empty">
          Запланованих злучок ще немає. Натисніть «Підібрати самця» в картці
          самки.
        </p>
      ) : (
        <ul className="plan-queue-list">{planned.map(renderItem)}</ul>
      )}

      {history.length > 0 && (
        <>
          <button
            type="button"
            className="plan-queue-toggle"
            aria-expanded={showHistory}
            onClick={onToggleHistory}
          >
            {showHistory ? "Сховати історію" : `Історія (${history.length})`}
          </button>
          {showHistory && (
            <ul className="plan-queue-list">{history.map(renderItem)}</ul>
          )}
        </>
      )}
    </section>
  );
}

// ── Картка самки ──

interface PlanCardProps {
  plan: FemalePlan;
  /** Порядковий номер картки: від нього залежить затримка появи. */
  index: number;
  /** Самці для підбору (заповнені лише для відкритої картки). */
  options: MaleOption[];
  pickerOpen: boolean;
  onTogglePicker: () => void;
  /** Підпис найближчої запланованої злучки цієї самки. */
  plannedLabel: string | null;
  plannedForFemale: PlanRecord[];
  saving: boolean;
  createError: string;
  today: string;
  onCreatePlan: (input: NewPlanInput) => Promise<boolean>;
}

function PlanCard({
  plan,
  index,
  options,
  pickerOpen,
  onTogglePicker,
  plannedLabel,
  plannedForFemale,
  saving,
  createError,
  today,
  onCreatePlan,
}: PlanCardProps) {
  const {
    rabbit,
    status,
    pregnancy,
    nursing,
    lastLitter,
    freeSince,
    freeDays,
    littersCount,
    avgAlive,
    ageMonths,
  } = plan;
  const meta = STATUS_META[status];

  // Підбір самця пропонуємо тим, хто не вагітна: вільним і тим, що годують
  const canPick =
    status === "ready" || status === "nursing" || status === "young";

  // Якщо в самки не вказані батьки, перевірка неповна: попереджаємо про це
  const pedigreeNote =
    !rabbit.mother_id && !rabbit.father_id
      ? "У самки не вказані батьки, тому перевірка спорідненості неповна. Заповніть родовід у розділі «Родовід»."
      : !rabbit.mother_id || !rabbit.father_id
        ? "У самки вказано лише одного з батьків, тому перевірка неповна. Доповніть родовід у розділі «Родовід»."
        : null;

  const cardClass = [
    "plan-card",
    `plan-card-${status}`,
    pregnancy?.soon ? "plan-card-soon" : "",
  ]
    .filter(Boolean)
    .join(" ");

  // Затримка появи картки: перші 10 карток з'являються по черзі
  const cardStyle = {
    "--plan-delay": `${Math.min(index, 10) * 60}ms`,
  } as CSSProperties;

  const subline = [
    rabbit.breed,
    rabbit.cage_number ? `кл. ${rabbit.cage_number}` : null,
    ageMonths !== null ? `${ageMonths} міс.` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className={cardClass} style={cardStyle}>
      <div className="plan-card-top">
        <span className="plan-avatar" aria-hidden="true">
          🐰
        </span>
        <div className="plan-card-title">
          <span className="plan-name">♀ {rabbit.name}</span>
          {subline && <span className="plan-subline">{subline}</span>}
        </div>
        <span className={`plan-badge plan-badge-${status}`}>
          <span className="plan-badge-icon" aria-hidden="true">
            {meta.icon}
          </span>
          {meta.label}
        </span>
      </div>

      {pregnancy && (
        <div className="plan-block plan-block-pregnancy">
          <div className="plan-row">
            <span>
              📅 Злучка: <strong>{formatDateUA(pregnancy.matingDate)}</strong>
            </span>
            {pregnancy.maleName && <span>♂ {pregnancy.maleName}</span>}
          </div>
          <div className="plan-row">
            <span>
              🗓 Очікуваний окріл:{" "}
              <strong>{formatDateUA(pregnancy.expectedBirth)}</strong>
            </span>
            <span className="plan-days-left">
              {daysLeftLabel(pregnancy.daysLeft)}
            </span>
          </div>
          <div
            className="plan-progress"
            role="progressbar"
            aria-label="Перебіг вагітності"
            aria-valuemin={0}
            aria-valuemax={PREGNANCY_DAYS}
            aria-valuenow={Math.min(pregnancy.day, PREGNANCY_DAYS)}
          >
            <div
              className="plan-progress-fill"
              style={
                {
                  "--plan-progress": `${Math.round(pregnancy.progress * 100)}%`,
                } as CSSProperties
              }
            />
          </div>
          <span className="plan-progress-label">
            День {Math.min(pregnancy.day, PREGNANCY_DAYS)} з {PREGNANCY_DAYS}
          </span>
        </div>
      )}

      {nursing && (
        <div className="plan-block plan-block-nursing">
          <span>
            🍼 Окріл: <strong>{formatDateUA(nursing.birthDate)}</strong>
            {" · "}
            {nursing.daysSince} {pluralDays(nursing.daysSince)} тому
          </span>
          {nursing.alive !== null && (
            <span>
              Живих кроленят: <strong>{nursing.alive}</strong>
            </span>
          )}
          {pregnancy && (
            <span className="plan-note">
              Ще годує малих від попереднього окролу
            </span>
          )}
        </div>
      )}

      {status === "ready" && (
        <div className="plan-block plan-block-ready">
          {freeSince && freeDays !== null ? (
            <span>
              Вільна з <strong>{formatDateUA(freeSince)}</strong>
              {" · "}
              {freeDays} {pluralDays(freeDays)}
            </span>
          ) : (
            <span>Злучок ще не було</span>
          )}
        </div>
      )}

      {/* Змінено: блок застереження для самок до 4 місяців */}
      {status === "young" && (
        <div className="plan-block plan-block-young">
          <span>
            ⚠️ <strong>Застереження:</strong> вік{" "}
            {ageMonths !== null ? `${ageMonths} міс.` : "менше 4 міс."} — зарано
            для злучки. Першу злучку рекомендовано проводити не раніше 4
            місяців.
          </span>
        </div>
      )}

      <div className="plan-footer">
        <span className="plan-chip">Окролів: {littersCount}</span>
        {avgAlive !== null && (
          <span className="plan-chip">
            Середньо живих: {String(avgAlive).replace(".", ",")}
          </span>
        )}
        {plannedLabel && (
          <span className="plan-chip plan-chip-planned">{plannedLabel}</span>
        )}
        {lastLitter && status !== "nursing" && (
          <span className="plan-chip">
            Останній: {formatDateUA(lastLitter.birthDate)}
            {lastLitter.alive !== null ? `, живих ${lastLitter.alive}` : ""}
          </span>
        )}
      </div>
      {canPick && (
        <>
          <button
            type="button"
            className="plan-pick-btn"
            aria-expanded={pickerOpen}
            onClick={onTogglePicker}
          >
            <span aria-hidden="true">♂</span>{" "}
            {pickerOpen ? "Сховати підбір" : "Підібрати самця"}
          </button>

          {pickerOpen && (
            <MalePicker
              female={rabbit}
              options={options}
              pedigreeNote={pedigreeNote}
              plannedForFemale={plannedForFemale}
              saving={saving}
              error={createError}
              today={today}
              onCreate={onCreatePlan}
            />
          )}
        </>
      )}
    </article>
  );
}

// ── Сторінка ──

export default function BreedingPlan({ session }: Props) {
  const userId = session.user.id;
  const navigate = useNavigate();

  const [rabbits, setRabbits] = useState<RabbitRow[]>([]);
  const [matings, setMatings] = useState<MatingRow[]>([]);
  const [litters, setLitters] = useState<LitterRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  // Картка самки, в якій зараз відкрито підбір самця
  const [openFemaleId, setOpenFemaleId] = useState<string | null>(null);
  // Заплановані злучки (breeding_plan)
  const [records, setRecords] = useState<PlanRecord[]>([]);
  const [recordsError, setRecordsError] = useState("");
  const [createError, setCreateError] = useState("");
  const [actionError, setActionError] = useState("");
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  // Збільшуємо після запису в базу, щоб перезавантажити дані сторінки
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [rabbitsRes, matingsRes, littersRes] = await Promise.all([
          supabase
            .from("rabbits")
            .select(
              "id, name, breed, gender, birth_date, cage_number, is_active, mother_id, father_id",
            )
            .eq("user_id", userId),
          supabase
            .from("matings")
            .select(
              "id, female_id, male_id, mating_date, control_date, expected_birth, is_archived",
            )
            .eq("user_id", userId),
          supabase
            .from("litters")
            .select(
              "id, mating_id, mother_id, actual_female_id, actual_male_id, birth_date, total_born, alive, weaned_date, litter_mating_date, litter_expected_birth, failure_type",
            )
            .eq("user_id", userId),
        ]);

        if (rabbitsRes.error) throw rabbitsRes.error;
        if (matingsRes.error) throw matingsRes.error;
        if (littersRes.error) throw littersRes.error;
        if (cancelled) return;

        setRabbits(toRows<RabbitRow>(rabbitsRes.data));
        setMatings(toRows<MatingRow>(matingsRes.data));
        setLitters(toRows<LitterRow>(littersRes.data));
        setLoadError("");
      } catch (err) {
        logError("BreedingPlan.load", err);
        if (!cancelled) setLoadError("Не вдалося завантажити дані");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    // Заплановані злучки: окремий запит. Якщо таблиці немає або збій,
    // блоки 1 і 2 працюють далі.
    async function loadRecords() {
      try {
        const { data, error } = await supabase
          .from("breeding_plan")
          .select(
            "id, female_id, male_id, backup_male_id, planned_date, status, notes, mating_id, created_at",
          )
          .eq("user_id", userId)
          .order("planned_date", { ascending: true });
        if (error) throw error;
        if (cancelled) return;
        setRecords(toRows<PlanRecord>(data));
        setRecordsError("");
      } catch (err) {
        logError("BreedingPlan.loadRecords", err);
        if (!cancelled) {
          setRecordsError("Не вдалося завантажити список запланованого");
        }
      }
    }

    void load();
    void loadRecords();
    return () => {
      cancelled = true;
    };
  }, [userId, reloadKey]);

  const plans = useMemo(
    () => sortPlans(computeFemalePlans(rabbits, matings, litters, todayKyiv())),
    [rabbits, matings, litters],
  );
  const counts = useMemo(() => countByStatus(plans), [plans]);
  const visiblePlans = useMemo(
    () => (filter === "all" ? plans : plans.filter((p) => p.status === filter)),
    [plans, filter],
  );

  // Підбір самців рахуємо лише для відкритої картки
  const openOptions = useMemo(() => {
    const female = openFemaleId
      ? plans.find((p) => p.rabbit.id === openFemaleId)?.rabbit
      : undefined;
    return female
      ? buildMaleOptions(female, rabbits, matings, litters, todayKyiv())
      : NO_OPTIONS;
  }, [openFemaleId, plans, rabbits, matings, litters]);

  const today = todayKyiv();

  const rabbitName = (id: string | null) =>
    id ? (rabbits.find((r) => r.id === id)?.name ?? "невідомо") : "не вказано";

  // Заплановані (ще не виконані) злучки по самках, від найближчої дати
  const plannedByFemale = useMemo(() => {
    const map = new Map<string, PlanRecord[]>();
    records
      .filter((r) => r.status === "planned")
      .sort((a, b) => a.planned_date.localeCompare(b.planned_date))
      .forEach((r) => {
        const list = map.get(r.female_id);
        if (list) {
          list.push(r);
        } else {
          map.set(r.female_id, [r]);
        }
      });
    return map;
  }, [records]);

  async function handleCreatePlan(input: NewPlanInput): Promise<boolean> {
    setSaving(true);
    setCreateError("");
    try {
      const { error } = await supabase.from("breeding_plan").insert({
        user_id: userId,
        female_id: input.femaleId,
        male_id: input.maleId,
        backup_male_id: input.backupMaleId,
        planned_date: input.plannedDate,
        notes: input.notes || null,
      });
      if (error) throw error;
      setReloadKey((k) => k + 1);
      return true;
    } catch (err) {
      logError("BreedingPlan.createPlan", err);
      setCreateError("Не вдалося зберегти план");
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function handleSetStatus(record: PlanRecord, status: RecordStatus) {
    setBusyId(record.id);
    setActionError("");
    try {
      const { error } = await supabase
        .from("breeding_plan")
        .update({ status })
        .eq("id", record.id);
      if (error) throw error;
    } catch (err) {
      logError("BreedingPlan.setStatus", err);
      setActionError("Не вдалося змінити статус");
    } finally {
      setReloadKey((k) => k + 1);
      setBusyId(null);
    }
  }

  async function handleDeleteRecord(record: PlanRecord) {
    if (!window.confirm("Видалити цей запис із плану?")) return;
    setBusyId(record.id);
    setActionError("");
    try {
      const { error } = await supabase
        .from("breeding_plan")
        .delete()
        .eq("id", record.id);
      if (error) throw error;
    } catch (err) {
      logError("BreedingPlan.deleteRecord", err);
      setActionError("Не вдалося видалити запис");
    } finally {
      setReloadKey((k) => k + 1);
      setBusyId(null);
    }
  }

  /**
   * «Виконано»: записує справжню злучку так само, як розділ «Парування».
   *  - Самка вже є в обліку (має незаархівовану злучку): повторна злучка
   *    записується в окріл (litters: litter_mating_date, litter_control_date,
   *    litter_expected_birth, actual_male_id), нового рядка в matings немає.
   *  - Самки в обліку ще немає: створюється рядок у matings.
   * Дата злучки: сьогодні. Контрольна: +7 днів. Окріл: +31 день (для matings
   * він рахується в базі сам).
   */
  async function handleDone(record: PlanRecord) {
    if (!record.male_id) {
      setActionError(
        "У цьому плані не вказано самця. Видаліть запис і створіть новий.",
      );
      return;
    }
    const female = rabbits.find((r) => r.id === record.female_id);
    const male = rabbits.find((r) => r.id === record.male_id);
    const femalePlan = plans.find((p) => p.rabbit.id === record.female_id);
    const pregnantWarning =
      femalePlan &&
      (femalePlan.status === "pregnant" || femalePlan.status === "overdue")
        ? "\n\nУвага: за обліком ця самка зараз вагітна."
        : "";
    const confirmed = window.confirm(
      `Записати злучку ${rabbitName(record.female_id)} з ${rabbitName(record.male_id)} у розділ «Парування» на сьогодні (${formatDateUA(today)})?${pregnantWarning}`,
    );
    if (!confirmed) return;

    setBusyId(record.id);
    setActionError("");
    let recorded = false;
    try {
      const controlDate = addDays(today, 7);
      const expectedBirth = addDays(today, PREGNANCY_DAYS);
      const existing =
        matings
          .filter((m) => m.female_id === record.female_id && !m.is_archived)
          .sort((a, b) => b.mating_date.localeCompare(a.mating_date))[0] ??
        null;

      let matingId: string;
      if (existing) {
        const { error } = await supabase.from("litters").insert({
          user_id: userId,
          mating_id: existing.id,
          total_born: 0,
          alive: 0,
          dead: 0,
          litter_mating_date: today,
          litter_control_date: controlDate,
          litter_expected_birth: expectedBirth,
          actual_male_id: record.male_id,
        });
        if (error) throw error;
        matingId = existing.id;
      } else {
        const { data, error } = await supabase
          .from("matings")
          .insert({
            user_id: userId,
            female_id: record.female_id,
            male_id: record.male_id,
            mating_date: today,
            control_date: controlDate,
            female_cage: female?.cage_number ?? null,
            male_cage: male?.cage_number ?? null,
            notes: record.notes,
          })
          .select("id")
          .single();
        if (error) throw error;
        const createdId = (data as { id?: string } | null)?.id;
        if (!createdId) throw new Error("matings.insert не повернув id");
        matingId = createdId;
      }
      recorded = true;

      const { error: updateError } = await supabase
        .from("breeding_plan")
        .update({ status: "done", mating_id: matingId })
        .eq("id", record.id);
      if (updateError) throw updateError;
    } catch (err) {
      logError("BreedingPlan.handleDone", err);
      setActionError(
        recorded
          ? "Злучку записано в «Парування», але статус плану не змінився. Не натискайте «Виконано» ще раз: видаліть цей запис із плану."
          : "Не вдалося записати злучку. Нічого не збережено.",
      );
    } finally {
      setReloadKey((k) => k + 1);
      setBusyId(null);
    }
  }

  return (
    <div className="plan-page">
      <div className="plan-header">
        <h1>🗓 План підбору</h1>
        <button className="plan-back-btn" onClick={() => navigate("/registry")}>
          {"⬅"} Мої кролики
        </button>
      </div>

      <p className="plan-intro">
        Хто готовий до злучки, хто чекає окролу, а хто ще годує малих.
      </p>

      {loadError && <p className="plan-error">{loadError}</p>}

      {loading ? (
        <div className="plan-loading">
          <span className="plan-loading-icon" aria-hidden="true">
            🐰
          </span>
          <span>Завантаження...</span>
        </div>
      ) : (
        <>
          {plans.length > 0 && (
            <div
              className="plan-filter-bar"
              role="group"
              aria-label="Фільтр за статусом"
            >
              <button
                className={`plan-filter-btn${filter === "all" ? " active" : ""}`}
                aria-pressed={filter === "all"}
                onClick={() => setFilter("all")}
              >
                Усі <span className="plan-filter-count">{plans.length}</span>
              </button>
              {STATUS_ORDER.map((status) => (
                <button
                  key={status}
                  className={`plan-filter-btn plan-filter-${status}${
                    filter === status ? " active" : ""
                  }`}
                  aria-pressed={filter === status}
                  onClick={() => setFilter(status)}
                >
                  {STATUS_META[status].icon} {STATUS_META[status].label}{" "}
                  <span className="plan-filter-count">{counts[status]}</span>
                </button>
              ))}
            </div>
          )}

          {plans.length === 0 && !loadError ? (
            <div className="plan-empty-state">
              <div className="plan-empty-illustration">🐰</div>
              <h3 className="plan-empty-title">Самок ще немає</h3>
              <p className="plan-empty-desc">
                Додайте самок у розділі «Мої кролики», і тут з'явиться план: хто
                готовий до злучки.
              </p>
            </div>
          ) : visiblePlans.length === 0 && !loadError ? (
            <p className="plan-empty-filter">У цій групі зараз нікого.</p>
          ) : (
            <div className="plan-list">
              {visiblePlans.map((plan, index) => (
                <PlanCard
                  key={plan.rabbit.id}
                  plan={plan}
                  index={index}
                  options={
                    plan.rabbit.id === openFemaleId ? openOptions : NO_OPTIONS
                  }
                  pickerOpen={plan.rabbit.id === openFemaleId}
                  onTogglePicker={() => {
                    setCreateError("");
                    setOpenFemaleId((prev) =>
                      prev === plan.rabbit.id ? null : plan.rabbit.id,
                    );
                  }}
                  plannedLabel={(() => {
                    const next = plannedByFemale.get(plan.rabbit.id)?.[0];
                    return next
                      ? `Заплановано: ${formatDateUA(next.planned_date)}, ♂ ${rabbitName(next.male_id)}`
                      : null;
                  })()}
                  plannedForFemale={
                    plannedByFemale.get(plan.rabbit.id) ?? NO_RECORDS
                  }
                  saving={saving}
                  createError={
                    plan.rabbit.id === openFemaleId ? createError : ""
                  }
                  today={today}
                  onCreatePlan={handleCreatePlan}
                />
              ))}
            </div>
          )}

          {recordsError && <p className="plan-error">{recordsError}</p>}
          <PlanQueue
            records={records}
            rabbitName={rabbitName}
            today={today}
            busyId={busyId}
            error={actionError}
            showHistory={showHistory}
            onToggleHistory={() => setShowHistory((v) => !v)}
            onDone={(r) => void handleDone(r)}
            onSetStatus={(r, status) => void handleSetStatus(r, status)}
            onDelete={(r) => void handleDeleteRecord(r)}
          />
        </>
      )}
    </div>
  );
}
