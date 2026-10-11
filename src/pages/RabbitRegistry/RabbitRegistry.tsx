import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import SkeletonCard from "./SkeletonCard";
import "./RabbitRegistry.css";
import { logError } from "../../lib/logError";
import { todayKyiv } from "../../utils/kyivDate";
// Мініатюри та повні фото кроликів зі сховища Supabase
import { getThumbUrls, getFullUrl } from "../../utils/photoStorage";

import type { Rabbit, Stats } from "./types";
import { exportAllCSV } from "./exportAllCSV";
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
  const [rabbits, setRabbits] = useState<Rabbit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [exportingAll, setExportingAll] = useState(false);
  const [exportError, setExportError] = useState("");

  const [confirmArchiveId, setConfirmArchiveId] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState("");
  // Змінено: повідомлення про помилку архівування (у модалці) і про помилку
  // завантаження даних. Раніше обидві помилки ігнорувались.
  const [archiveError, setArchiveError] = useState("");
  const [loadError, setLoadError] = useState("");
  // Додано: посилання на мініатюри (ключ — photo_path), відкрите повне фото
  // і помилка відкриття фото
  const [thumbUrls, setThumbUrls] = useState<Record<string, string>>({});
  const [photoViewer, setPhotoViewer] = useState<{
    url: string;
    name: string;
  } | null>(null);
  const [photoError, setPhotoError] = useState("");
  const currentLabel =
    session.user.user_metadata?.display_name || session.user.email;
  const [stats, setStats] = useState<Stats>({
    total: 0,
    males: 0,
    females: 0,
    youngTotal: 0,
    youngFromCages: 0,
    youngFromPaddocks: 0,
    paddockFemales: 0,
    fatteningMales: 0,
    fatteningFemales: 0,
    fatteningUnknown: 0,
    fatteningTotal: 0,
    quarantineMales: 0,
    quarantineFemales: 0,
    quarantineUnknown: 0,
    quarantineTotal: 0,
  });
  const [showSettings, setShowSettings] = useState(false);

  const navigate = useNavigate();

  const loadStats = useCallback(
    (list: Rabbit[]) => {
      Promise.all([
        supabase
          .from("litters")
          .select("alive, weaned_males, weaned_females, weaned_date")
          .eq("user_id", session.user.id),
        supabase
          .from("paddock_litters")
          .select("alive, weaned_males, weaned_females, weaned_date")
          .eq("user_id", session.user.id),
        // paddock_females has no user_id column — RLS scopes it to the owner via paddocks
        supabase
          .from("paddock_females")
          .select("id")
          .not("paddock_id", "is", null),
        supabase
          .from("fattening")
          .select("males, females, unknown")
          .eq("user_id", session.user.id)
          .eq("is_active", true),
        supabase
          .from("quarantine")
          .select("gender")
          .eq("user_id", session.user.id)
          .eq("is_active", true),
      ])
        .then(
          ([
            littersRes,
            paddockLittersRes,
            paddockFemalesRes,
            fatteningRes,
            quarantineRes,
          ]) => {
            // Змінено: раніше помилки запитів ігнорувались, і статистика
            // рахувалась з порожніх даних (нулі без жодного попередження).
            const failedQuery = [
              littersRes,
              paddockLittersRes,
              paddockFemalesRes,
              fatteningRes,
              quarantineRes,
            ].find((r) => r.error);
            if (failedQuery?.error) {
              logError("RabbitRegistry.loadStats", failedQuery.error);
              setLoadError(
                "Не вдалося завантажити статистику господарства. Оновіть сторінку",
              );
              setLoading(false);
              return;
            }
            const littersData = littersRes.data;
            const paddockLittersData = paddockLittersRes.data;
            const paddockFemalesData = paddockFemalesRes.data;
            const fatteningData = fatteningRes.data;
            const quarantineData = quarantineRes.data;

            let youngFromCages = 0,
              youngFromPaddocks = 0,
              youngTotal = 0;

            (littersData || []).forEach((l) => {
              if (l.weaned_date) return;
              const alive = l.alive || 0;
              youngFromCages += alive;
              youngTotal += alive;
            });

            (paddockLittersData || []).forEach((l) => {
              if (l.weaned_date) return;
              const alive = l.alive || 0;
              youngFromPaddocks += alive;
              youngTotal += alive;
            });

            const paddockFemales = (paddockFemalesData || []).length;
            let fatteningMales = 0,
              fatteningFemales = 0,
              fatteningUnknown = 0;
            (fatteningData || []).forEach((f) => {
              fatteningMales += f.males || 0;
              fatteningFemales += f.females || 0;
              fatteningUnknown += f.unknown || 0;
            });
            const fatteningTotal =
              fatteningMales + fatteningFemales + fatteningUnknown;
            let quarantineMales = 0,
              quarantineFemales = 0,
              quarantineUnknown = 0;
            (quarantineData || []).forEach((q) => {
              if (q.gender === "male") quarantineMales++;
              else if (q.gender === "female") quarantineFemales++;
              else quarantineUnknown++;
            });
            const quarantineTotal =
              quarantineMales + quarantineFemales + quarantineUnknown;

            setStats({
              total:
                list.length +
                youngTotal +
                paddockFemales +
                fatteningTotal +
                quarantineTotal,
              males: list.filter((r) => r.gender === "male").length,
              females: list.filter((r) => r.gender === "female").length,
              youngTotal,
              youngFromCages,
              youngFromPaddocks,
              paddockFemales,
              fatteningMales,
              fatteningFemales,
              fatteningUnknown,
              fatteningTotal,
              quarantineMales,
              quarantineFemales,
              quarantineUnknown,
              quarantineTotal,
            });
            setLoading(false);
          },
        )
        .catch((err) => {
          logError("RabbitRegistry.loadStats", err);
          setLoading(false);
        });
    },
    [session.user.id],
  );

  const loadData = useCallback(() => {
    supabase
      .from("rabbits")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("is_active", true)
      .order("cage_number", { ascending: true })
      .then(
        ({ data: rabbitsData, error }) => {
          if (error) {
            // Змінено: помилка запиту більше не видається за порожній
            // реєстр; поточний список лишається без змін
            logError("RabbitRegistry.loadData", error);
            setLoadError(
              "Не вдалося завантажити список кроликів. Оновіть сторінку",
            );
            setLoading(false);
            return;
          }
          setLoadError("");
          const list = rabbitsData || [];
          setRabbits(list);
          // Додано: один запит підписаних посилань на мініатюри всього списку.
          // Збій не ламає реєстр: картки просто лишаються без фото.
          const photoPaths = list
            .map((r: Rabbit) => r.photo_path)
            .filter((p: string | null): p is string => !!p);
          if (photoPaths.length > 0) {
            getThumbUrls(photoPaths)
              .then(setThumbUrls)
              .catch((err) => logError("RabbitRegistry.thumbUrls", err));
          }
          loadStats(list);
        },
        (err) => {
          logError("RabbitRegistry.loadData", err);
          setLoading(false);
        },
      );
  }, [session.user.id, loadStats]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function confirmArchive() {
    if (!confirmArchiveId || !selectedReason) return;
    setArchiveError("");
    const { error } = await supabase
      .from("rabbits")
      .update({
        is_active: false,
        archive_reason: selectedReason,
        archive_date: todayKyiv(), // Змінено: дата за Києвом, не UTC
      })
      .eq("id", confirmArchiveId);
    if (error) {
      // Змінено: раніше модалка закривалась і список оновлювався, ніби
      // кролика архівовано, хоча запис не збережено
      logError("RabbitRegistry.confirmArchive", error);
      setArchiveError("Не вдалося архівувати кролика. Спробуйте ще раз");
      return;
    }
    setConfirmArchiveId(null);
    setSelectedReason("");
    loadData();
  }

  // Додано: відкриває повне фото кролика поверх сторінки
  async function openPhoto(rabbit: Rabbit) {
    if (!rabbit.photo_path) return;
    setPhotoError("");
    try {
      const url = await getFullUrl(rabbit.photo_path);
      if (!url) {
        setPhotoError("Не вдалося відкрити фото. Спробуйте ще раз");
        return;
      }
      setPhotoViewer({ url, name: rabbit.name });
    } catch (err) {
      logError("RabbitRegistry.openPhoto", err);
      setPhotoError("Не вдалося відкрити фото. Спробуйте ще раз");
    }
  }

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
          onClose={() => setPhotoViewer(null)}
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
        onSaved={loadData}
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
              onArchive={() => {
                setArchiveError("");
                setConfirmArchiveId(rabbit.id);
              }}
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
          onCancel={() => {
            setConfirmArchiveId(null);
            setSelectedReason("");
            setArchiveError("");
          }}
          onConfirm={confirmArchive}
        />
      )}
    </div>
  );
}
