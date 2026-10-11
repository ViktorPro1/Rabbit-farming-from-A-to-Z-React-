import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import SkeletonCard from "./SkeletonCard";
import "./RabbitRegistry.css";
import { logError } from "../../lib/logError";
import { exportAllCSV } from "./exportAllCSV";
import { useRabbits } from "./hooks/useRabbits";
import { useArchiveRabbit } from "./hooks/useArchiveRabbit";
import { usePhotoViewer } from "./hooks/usePhotoViewer";
import HelpModal from "./components/HelpModal";
import QrModal from "./components/QrModal";
import PhotoViewer from "./components/PhotoViewer";
import NavPanel from "./components/NavPanel";
import StatsBar from "./components/StatsBar";
import RabbitCard from "./components/RabbitCard";
import BreedingAgeInfo from "./components/BreedingAgeInfo";
import ArchiveModal from "./components/ArchiveModal";
import SettingsModal from "./components/SettingsModal";
import NewRabbitForm from "./components/NewRabbitForm";

interface Props {
  session: Session;
}

export default function RabbitRegistry({ session }: Props) {
  const { rabbits, loading, loadError, stats, thumbUrls, reload } = useRabbits(
    session.user.id,
  );
  const {
    confirmArchiveId,
    selectedReason,
    setSelectedReason,
    archiveError,
    openArchive,
    cancelArchive,
    confirmArchive,
  } = useArchiveRabbit(reload);
  const { photoViewer, photoError, setPhotoError, openPhoto, closePhoto } =
    usePhotoViewer();
  const [showForm, setShowForm] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [exportingAll, setExportingAll] = useState(false);
  const [exportError, setExportError] = useState("");

  const currentLabel =
    session.user.user_metadata?.display_name || session.user.email;
  const [showSettings, setShowSettings] = useState(false);

  const navigate = useNavigate();

  // ── Експорт CSV: логіка в exportAllCSV.ts, тут лише стан кнопки ──
  async function handleExportAll() {
    setExportingAll(true);
    setExportError("");
    try {
      await exportAllCSV(session.user.id);
    } catch (err) {
      logError("RabbitRegistry.exportAllCSV", err);
      setExportError("Не вдалося сформувати експорт. Спробуй ще раз.");
    } finally {
      setExportingAll(false);
    }
  }

  return (
    <div className="registry-page">
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      {showQrModal && (
        <QrModal rabbits={rabbits} onClose={() => setShowQrModal(false)} />
      )}
      {photoViewer && (
        <PhotoViewer
          url={photoViewer.url}
          name={photoViewer.name}
          onClose={closePhoto}
        />
      )}

      <div className="registry-header">
        <div className="registry-header-top">
          <h1>🐇 Мої кролики</h1>
          <button
            className="registry-email"
            onClick={() => setShowSettings(true)}
            title="Налаштування"
          >
            {currentLabel}
            <span className="registry-settings-gear" aria-hidden="true">
              ⚙️
            </span>
          </button>
        </div>

        <NavPanel
          onOpenQr={() => setShowQrModal(true)}
          onOpenHelp={() => setShowHelp(true)}
          onExport={handleExportAll}
          exporting={exportingAll}
          exportError={exportError}
        />

        <div className="registry-header-action">
          <button
            className="registry-add-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "✕ Скасувати" : "+ Додати кролика"}
          </button>
        </div>
      </div>

      <StatsBar stats={stats} />

      <NewRabbitForm
        open={showForm}
        userId={session.user.id}
        onClose={() => setShowForm(false)}
        onSaved={reload}
        onPhotoError={setPhotoError}
      />

      {loadError && <p className="registry-error">{loadError}</p>}
      {/* Додано: помилка відкриття фото */}
      {photoError && <p className="registry-error">{photoError}</p>}

      {loading ? (
        <div className="registry-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : rabbits.length === 0 && !loadError ? (
        // Змінено: при помилці завантаження не показуємо "кроликів немає"
        <div className="registry-empty-state">
          <div className="registry-empty-illustration">🐇</div>
          <h3 className="registry-empty-title">Поки що кроликів немає</h3>
          <p className="registry-empty-desc">
            Додайте першого кролика — вкажіть кличку, породу, клітку і дату
            народження.
          </p>
        </div>
      ) : (
        <div className="registry-grid">
          {rabbits.map((rabbit) => (
            <RabbitCard
              key={rabbit.id}
              rabbit={rabbit}
              thumbUrl={
                rabbit.photo_path ? thumbUrls[rabbit.photo_path] : undefined
              }
              onOpenPhoto={() => openPhoto(rabbit)}
              onEdit={() => navigate(`/registry/edit/${rabbit.id}`)}
              onArchive={() => openArchive(rabbit.id)}
            />
          ))}
        </div>
      )}

      {/* ── Зноска: вік утримання у племінному стаді ── */}
      <BreedingAgeInfo />
      <SettingsModal
        open={showSettings}
        session={session}
        onClose={() => setShowSettings(false)}
      />
      {confirmArchiveId && (
        <ArchiveModal
          selectedReason={selectedReason}
          error={archiveError}
          onSelectReason={setSelectedReason}
          onCancel={cancelArchive}
          onConfirm={confirmArchive}
        />
      )}
    </div>
  );
}
