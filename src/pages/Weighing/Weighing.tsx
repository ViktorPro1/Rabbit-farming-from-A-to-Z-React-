import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { useWeighingData } from "./useWeighingData";
import { useWeighingActions } from "./useWeighingActions";
import { buildCycleViews, buildGroupInfos } from "./cycles";
import { buildGaugeMetrics } from "./gauges";
import { groupByLitter } from "./utils";
import AddForm from "./components/AddForm";
import Archive from "./components/Archive";
import BatchWeights from "./components/BatchWeights";
import ComparisonTable from "./components/ComparisonTable";
import EditForm from "./components/EditForm";
import EmptyState from "./components/EmptyState";
import GaugeCard from "./components/GaugeCard";
import GroupBlock from "./components/GroupBlock";
import {
  AgeWeightPanel,
  CycleInfoPanel,
  ReminderInfoPanel,
} from "./components/HelpPanels";
import ReminderPrompt from "./components/ReminderPrompt";
import type { RecordViewProps, WeighingType } from "./types";
import "./Weighing.css";

interface Props {
  session: Session;
}

export default function Weighing({ session }: Props) {
  const {
    records,
    rabbitOptions,
    fatteningOptions,
    headsByFattening,
    loading,
    pageError,
    setPageError,
    fetchRecords,
    fetchOptions,
  } = useWeighingData(session.user.id);
  const [gaugeMode, setGaugeMode] = useState<WeighingType>("fattening");
  // Один спільний архів для всіх кліток; розгортання пам'ятається між режимами
  const [showArchive, setShowArchive] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const navigate = useNavigate();

  const rabbitById = useMemo(
    () => Object.fromEntries(rabbitOptions.map((r) => [r.id, r])),
    [rabbitOptions],
  );
  const fatteningById = useMemo(
    () => Object.fromEntries(fatteningOptions.map((f) => [f.id, f])),
    [fatteningOptions],
  );

  const actions = useWeighingActions({
    userId: session.user.id,
    rabbitById,
    fatteningById,
    fetchRecords,
    fetchOptions,
    setPageError,
  });

  // Групування по гніздах (для загальної статистики "Гнізд/груп")
  const litterCount = Object.keys(groupByLitter(records)).length;

  // Записи й групи, відфільтровані під поточний вибір перемикача
  // (Відгодівля / Племінне) — те саме, що живить гейджі, живить і список.
  const modeRecords = useMemo(
    () => records.filter((r) => r.weighing_type === gaugeMode),
    [records, gaugeMode],
  );
  const modeGroups = useMemo(() => groupByLitter(modeRecords), [modeRecords]);
  const gaugeMetrics = useMemo(
    () => buildGaugeMetrics(modeRecords, rabbitById, fatteningById),
    [modeRecords, rabbitById, fatteningById],
  );

  const groupInfos = buildGroupInfos(modeGroups);
  const {
    visibleGroupInfos,
    archiveInfos,
    archiveCyclesCount,
    allClosedCycles,
    batchGroups,
  } = buildCycleViews(groupInfos, headsByFattening);

  const { editingRecord, setEditingRecord } = actions;
  const sharedTypeProps = {
    rabbitById,
    fatteningById,
    rabbitOptions,
    fatteningOptions,
  };
  const view: RecordViewProps = {
    editingId: editingRecord ? editingRecord.id : null,
    editForm: editingRecord ? (
      <EditForm
        record={editingRecord}
        onChange={setEditingRecord}
        onCancel={() => setEditingRecord(null)}
        onSave={actions.handleEdit}
        saving={actions.saving}
        error={actions.error}
        {...sharedTypeProps}
      />
    ) : null,
    onStartEdit: setEditingRecord,
    onDelete: actions.handleDelete,
    rabbitById,
    fatteningById,
  };

  return (
    <div className="weighing-page">
      <div className="weighing-header">
        <h1>⚖️ Зважування</h1>
        <button
          className="weighing-back-btn"
          onClick={() => navigate("/registry")}
        >
          ⬅ Мої кролики
        </button>
      </div>
      {pageError && <p className="weighing-error">{pageError}</p>}
      <div className="weighing-stats">
        <div className="weighing-stat">
          <span className="weighing-stat-value">{records.length}</span>
          <span className="weighing-stat-label">Записів</span>
        </div>
        <div className="weighing-stat">
          <span className="weighing-stat-value">{litterCount}</span>
          <span className="weighing-stat-label">Гнізд / груп</span>
        </div>
      </div>

      <GaugeCard
        gaugeMode={gaugeMode}
        onModeChange={setGaugeMode}
        gaugeMetrics={gaugeMetrics}
        modeRecordsCount={modeRecords.length}
      />

      {!loading && gaugeMode === "fattening" && batchGroups.length > 0 && (
        <BatchWeights batchGroups={batchGroups} />
      )}

      <div className="weighing-actions">
        <button
          className="weighing-add-btn"
          onClick={() => actions.setShowForm(!actions.showForm)}
        >
          {actions.showForm ? "✕ Скасувати" : "+ Додати зважування"}
        </button>
      </div>
      {actions.showForm && (
        <AddForm
          form={actions.form}
          setForm={actions.setForm}
          onSave={actions.handleAdd}
          saving={actions.saving}
          error={actions.error}
          {...sharedTypeProps}
        />
      )}
      {actions.pendingReminderPrompt && (
        <ReminderPrompt
          prompt={actions.pendingReminderPrompt}
          draft={actions.reminderPromptDraft}
          onDraftChange={actions.setReminderPromptDraft}
          onSave={actions.saveReminderPrompt}
          onSkip={() => actions.setPendingReminderPrompt(null)}
        />
      )}
      {loading ? (
        <p className="weighing-loading">Завантаження...</p>
      ) : records.length === 0 && !pageError ? (
        // При помилці завантаження не показуємо "записів немає"
        <EmptyState
          icon="⚖️"
          title="Записів зважування ще немає"
          description="Додайте перше зважування показового кролика з гнізда — так почнеться відстеження приросту по місяцях."
        />
      ) : groupInfos.length === 0 ? (
        <EmptyState
          icon={gaugeMode === "fattening" ? "🍖" : "🐇"}
          title={`Записів типу «${
            gaugeMode === "fattening" ? "Відгодівля" : "Племінне"
          }» ще немає`}
          description="Перемкни на інший тип зверху або додай перше зважування цього типу."
        />
      ) : (
        <div className="weighing-groups">
          {visibleGroupInfos.length === 0 && (
            <p className="weighing-info weighing-cycle-empty">
              Поточних циклів немає — усі завершені цикли в архіві нижче.
              Додайте зважування нової партії, і клітка з'явиться тут.
            </p>
          )}
          {visibleGroupInfos.map((info) => (
            <GroupBlock
              key={info.litter}
              info={info}
              view={view}
              onReminderChange={actions.handleReminderIntervalChange}
            />
          ))}
        </div>
      )}

      {!loading && archiveInfos.length > 0 && (
        <Archive
          archiveInfos={archiveInfos}
          archiveCyclesCount={archiveCyclesCount}
          view={view}
          open={showArchive}
          onToggle={() => setShowArchive(!showArchive)}
        />
      )}

      {allClosedCycles.length > 0 && (
        <ComparisonTable
          allClosedCycles={allClosedCycles}
          open={showComparison}
          onToggle={() => setShowComparison(!showComparison)}
        />
      )}

      <AgeWeightPanel />
      <CycleInfoPanel />
      <ReminderInfoPanel />
    </div>
  );
}
