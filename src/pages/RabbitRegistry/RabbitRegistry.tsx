import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import SkeletonCard from "./SkeletonCard";
import "./RabbitRegistry.css";
import { logError } from "../../lib/logError";
import {
  subscribeToPush,
  unsubscribeFromPush,
  getPushSubscriptionStatus,
} from "../../utils/pushNotifications";
import { todayKyiv } from "../../utils/kyivDate";
// Додано: мініатюри та повні фото кроликів зі сховища Supabase
// Змінено (етап 2): до імпорту додано uploadAvatar і removeAvatar
// Змінено (етап 3): додано uploadRabbitPhoto і removeRabbitPhoto для фото
// у формі «Новий кролик»
import {
  getThumbUrls,
  getFullUrl,
  uploadAvatar,
  removeAvatar,
  uploadRabbitPhoto,
  removeRabbitPhoto,
} from "../../utils/photoStorage";
// Додано (етап 2): посилання на аватар кабінету
import { useAvatarUrl } from "../../hooks/useAvatarUrl";
import type { ChangeEvent } from "react";
// Додано: на iOS MIME-тип фото з галереї часто порожній — перевірка спільна
import { isLikelyImageFile } from "../../utils/imageCompress";

// Винесено з цього файлу (рефакторинг, етап 1)
import type { Rabbit, Stats } from "./types";
import { emptyForm, archiveReasons } from "./constants";
import { exportAllCSV } from "./exportAllCSV";
import HelpModal from "./components/HelpModal";
import QrModal from "./components/QrModal";
import PhotoViewer from "./components/PhotoViewer";
import NavPanel from "./components/NavPanel";
import StatsBar from "./components/StatsBar";
import RabbitCard from "./components/RabbitCard";
import BreedingAgeInfo from "./components/BreedingAgeInfo";

interface Props {
  session: Session;
}

export default function RabbitRegistry({ session }: Props) {
  const [rabbits, setRabbits] = useState<Rabbit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [exportingAll, setExportingAll] = useState(false);
  const [exportError, setExportError] = useState("");
  const displayNameSavedTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  useEffect(() => {
    return () => {
      if (displayNameSavedTimeoutRef.current) {
        clearTimeout(displayNameSavedTimeoutRef.current);
      }
      // Додано (етап 3): звільняємо посилання попереднього перегляду фото
      if (newPhotoRef.current) {
        URL.revokeObjectURL(newPhotoRef.current.url);
      }
    };
  }, []);

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
  // Додано (етап 3): фото, обране у формі «Новий кролик». Файл завантажується
  // лише після того, як кролика створено (шлях у сховищі містить його id).
  // Посилання для попереднього перегляду звільняється вручну, тому стан
  // дублюється в ref (для прибирання при розмонтуванні).
  const [newPhoto, setNewPhoto] = useState<{ file: File; url: string } | null>(
    null,
  );
  const newPhotoRef = useRef<{ file: File; url: string } | null>(null);
  const newPhotoInputRef = useRef<HTMLInputElement | null>(null);
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
  const [displayName, setDisplayName] = useState(
    session.user.user_metadata?.display_name || "",
  );
  const [displayNameSaving, setDisplayNameSaving] = useState(false);
  const [displayNameSaved, setDisplayNameSaved] = useState(false);
  const [displayNameError, setDisplayNameError] = useState("");

  // ── Push-сповіщення: стейти ──
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);
  const [pushError, setPushError] = useState("");

  // Додано (етап 2): фото особистого кабінету (аватар у шапці).
  // Шлях зберігається в user_metadata.avatar_path, як і display_name.
  const [avatarPath, setAvatarPath] = useState<string | null>(
    session.user.user_metadata?.avatar_path ?? null,
  );
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const avatarFileRef = useRef<HTMLInputElement | null>(null);
  const avatarUrl = useAvatarUrl(avatarPath);

  const navigate = useNavigate();

  // ── Push-сповіщення: перевірка статусу підписки при відкритті налаштувань ──
  // (розміщено після оголошення showSettings, від якого залежить)
  useEffect(() => {
    if (!showSettings) return;
    getPushSubscriptionStatus()
      .then(setPushEnabled)
      .catch((err) => logError("RabbitRegistry.pushStatus", err));
  }, [showSettings]);

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

  async function handleSaveDisplayName() {
    setDisplayNameSaving(true);
    setDisplayNameError("");
    setDisplayNameSaved(false);
    const { error } = await supabase.auth.updateUser({
      data: { display_name: displayName.trim() },
    });
    if (error) {
      setDisplayNameError("Помилка збереження. Спробуй ще раз.");
    } else {
      setDisplayNameSaved(true);
      displayNameSavedTimeoutRef.current = setTimeout(
        () => setDisplayNameSaved(false),
        3000,
      );
    }
    setDisplayNameSaving(false);
  }

  // Додано (етап 2): додавання або заміна аватара.
  // Порядок: завантажити файл -> записати шлях у метадані -> видалити старий.
  // Якщо запис метаданих не вдався, новий файл прибирається.
  async function handleAvatarChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // дозволяє обрати той самий файл повторно
    if (!file) return;
    setAvatarError("");
    if (!isLikelyImageFile(file)) {
      setAvatarError("Оберіть файл із зображенням.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setAvatarError("Фото завелике (понад 20 МБ).");
      return;
    }

    setAvatarBusy(true);
    const oldPath = avatarPath;
    let newPath: string | null = null;
    let saved = false;
    try {
      newPath = await uploadAvatar(session.user.id, file);
      const { error } = await supabase.auth.updateUser({
        data: { avatar_path: newPath },
      });
      if (error) throw error;
      saved = true;
      setAvatarPath(newPath);
      if (oldPath) await removeAvatar(oldPath);
    } catch (err) {
      logError("RabbitRegistry.avatarUpload", err);
      if (newPath && !saved) await removeAvatar(newPath);
      setAvatarError("Не вдалося зберегти фото. Спробуй ще раз.");
    } finally {
      setAvatarBusy(false);
    }
  }

  // Додано (етап 2): видалення аватара. Спершу метадані, потім файл.
  async function handleAvatarDelete() {
    if (!avatarPath) return;
    setAvatarError("");
    setAvatarBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { avatar_path: null },
      });
      if (error) throw error;
      await removeAvatar(avatarPath);
      setAvatarPath(null);
    } catch (err) {
      logError("RabbitRegistry.avatarDelete", err);
      setAvatarError("Не вдалося видалити фото. Спробуй ще раз.");
    } finally {
      setAvatarBusy(false);
    }
  }

  // ── Push-сповіщення: увімкнення/вимкнення ──
  async function handleTogglePush() {
    setPushLoading(true);
    setPushError("");
    try {
      if (pushEnabled) {
        await unsubscribeFromPush();
        setPushEnabled(false);
      } else {
        const ok = await subscribeToPush(session.user.id);
        if (!ok) {
          setPushError(
            "Не вдалося увімкнути сповіщення. Перевір дозволи браузера.",
          );
        } else {
          setPushEnabled(true);
        }
      }
    } catch (err) {
      logError("RabbitRegistry.handleTogglePush", err);
      setPushError("Сталася помилка. Спробуй ще раз.");
    }
    setPushLoading(false);
  }

  // Додано (етап 3): вибір або скидання фото у формі «Новий кролик»
  function selectNewPhoto(file: File | null) {
    if (newPhotoRef.current) {
      URL.revokeObjectURL(newPhotoRef.current.url);
    }
    const next = file ? { file, url: URL.createObjectURL(file) } : null;
    newPhotoRef.current = next;
    setNewPhoto(next);
  }

  function handleNewPhotoPick(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // дозволяє обрати той самий файл повторно
    if (!file) return;
    setError("");
    if (!isLikelyImageFile(file)) {
      setError("Оберіть файл із зображенням");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("Фото завелике (понад 20 МБ)");
      return;
    }
    selectNewPhoto(file);
  }

  // Змінено (етап 3): після створення кролика (потрібен його id) завантажуємо
  // обране фото і записуємо шлях у rabbits.photo_path. Якщо фото не вдалося
  // зберегти, кролик усе одно лишається в реєстрі (форма закривається, щоб
  // повторне натискання не створило дублікат), а користувач бачить
  // повідомлення і може додати фото через «Редагувати».
  async function handleAdd() {
    setSaving(true);
    setError("");
    setPhotoError("");
    const { data: created, error } = await supabase
      .from("rabbits")
      .insert({ ...form, user_id: session.user.id })
      .select("id")
      .single();
    if (error) {
      logError("RabbitRegistry.handleAdd", error);
      setError("Помилка збереження");
      setSaving(false);
      return;
    }

    if (newPhoto) {
      let uploadedPath: string | null = null;
      try {
        if (!created?.id) throw new Error("Не отримано id нового кролика");
        uploadedPath = await uploadRabbitPhoto(
          session.user.id,
          created.id,
          newPhoto.file,
        );
        const { error: photoDbError } = await supabase
          .from("rabbits")
          .update({ photo_path: uploadedPath })
          .eq("id", created.id)
          .eq("user_id", session.user.id);
        if (photoDbError) throw photoDbError;
      } catch (err) {
        logError("RabbitRegistry.handleAddPhoto", err);
        if (uploadedPath) {
          try {
            await removeRabbitPhoto(uploadedPath);
          } catch (cleanupErr) {
            logError("RabbitRegistry.handleAddPhotoCleanup", cleanupErr);
          }
        }
        setPhotoError(
          "Кролика збережено, але фото завантажити не вдалося. Додайте його через «Редагувати»",
        );
      }
    }

    setForm(emptyForm);
    selectNewPhoto(null);
    setShowForm(false);
    loadData();
    setSaving(false);
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

      {showForm && (
        <div className="registry-form">
          <h2>Новий кролик</h2>
          <div className="registry-form-grid">
            <input
              id="registry-name"
              name="name"
              autoComplete="off"
              placeholder="Кличка *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              id="registry-breed"
              name="breed"
              placeholder="Порода"
              value={form.breed}
              onChange={(e) => setForm({ ...form, breed: e.target.value })}
            />
            <select
              id="registry-gender"
              name="gender"
              value={form.gender}
              onChange={(e) =>
                setForm({
                  ...form,
                  gender: e.target.value as "male" | "female",
                })
              }
            >
              <option value="female">Самиця</option>
              <option value="male">Самець</option>
            </select>
            <input
              id="registry-birth-date"
              name="birth_date"
              type="date"
              value={form.birth_date}
              onChange={(e) => setForm({ ...form, birth_date: e.target.value })}
            />
            <input
              id="registry-cage-number"
              name="cage_number"
              placeholder="Номер клітки"
              value={form.cage_number}
              onChange={(e) =>
                setForm({ ...form, cage_number: e.target.value })
              }
            />
            <input
              id="registry-notes"
              name="notes"
              placeholder="Нотатки"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          {/* Додано (етап 3): фото нового кролика. Зберігається разом із
              кроликом після натискання «Зберегти». */}
          <div className="registry-form-photo">
            {newPhoto && (
              <div className="registry-form-photo-frame">
                <img
                  className="registry-form-photo-img"
                  src={newPhoto.url}
                  alt="Попередній перегляд фото"
                />
              </div>
            )}
            <div className="registry-form-photo-actions">
              <input
                ref={newPhotoInputRef}
                id="registry-new-photo-input"
                name="photo"
                type="file"
                accept="image/*"
                aria-label="Обрати файл фото кролика"
                className="photo-file-input"
                onChange={handleNewPhotoPick}
              />
              <button
                type="button"
                className="registry-archive-link"
                onClick={() => newPhotoInputRef.current?.click()}
                disabled={saving}
              >
                {newPhoto ? "Змінити фото" : "Обрати фото"}
              </button>
              {newPhoto && (
                <button
                  type="button"
                  className="registry-archive-link"
                  onClick={() => selectNewPhoto(null)}
                  disabled={saving}
                >
                  Прибрати фото
                </button>
              )}
            </div>
            <p className="settings-hint">
              Необов'язково. Фото стискається автоматично і зберігається разом
              із кроликом.
            </p>
          </div>
          {error && <p className="registry-error">{error}</p>}
          <button
            className="registry-save-btn"
            onClick={handleAdd}
            disabled={saving || !form.name}
          >
            {saving ? "Збереження..." : "Зберегти"}
          </button>
        </div>
      )}

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
      {showSettings && (
        <div
          className="help-overlay"
          onClick={() => setShowSettings(false)}
          role="presentation"
        >
          <div
            className="help-modal settings-modal"
            onClick={(e) => e.stopPropagation()}
            role="presentation"
          >
            <div className="help-modal-header">
              <h2>⚙️ Налаштування</h2>
              <button
                className="help-close"
                onClick={() => setShowSettings(false)}
              >
                ✕
              </button>
            </div>
            <div className="settings-body">
              {/* Додано (етап 2): фото особистого кабінету */}
              <div className="settings-avatar-block">
                <div className="settings-avatar-circle">
                  {avatarUrl ? (
                    <img
                      className="settings-avatar-img"
                      src={avatarUrl}
                      alt="Фото кабінету"
                    />
                  ) : (
                    <span aria-hidden="true">
                      {/* Змінено: літера з email, як в аватарі шапки (раніше
                          бралась з відображуваного імені) */}
                      {(session.user.email || "?").charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="settings-avatar-actions">
                  {/* Змінено: додано id і name — вимога правила ESLint для
                      полів форми (потрібно для автозаповнення браузера) */}
                  <input
                    ref={avatarFileRef}
                    id="registry-avatar-input"
                    name="avatar"
                    type="file"
                    accept="image/*"
                    aria-label="Обрати файл фото кабінету"
                    className="photo-file-input"
                    onChange={handleAvatarChange}
                  />
                  <button
                    type="button"
                    className="registry-archive-link"
                    onClick={() => avatarFileRef.current?.click()}
                    disabled={avatarBusy}
                  >
                    {avatarBusy
                      ? "Обробка..."
                      : avatarPath
                        ? "Замінити фото"
                        : "Додати фото"}
                  </button>
                  {avatarPath && (
                    <button
                      type="button"
                      className="registry-archive-link"
                      onClick={handleAvatarDelete}
                      disabled={avatarBusy}
                    >
                      Видалити фото
                    </button>
                  )}
                </div>
              </div>
              {avatarError && <p className="settings-error">{avatarError}</p>}
              <label className="settings-label" htmlFor="registry-display-name">
                Відображуване ім'я або назва господарства
              </label>
              <p className="settings-hint">
                Замінить електронну пошту у заголовку. Наприклад: «Вухані у
                Петровича» або «ФГ Прозоро».
              </p>
              <input
                id="registry-display-name"
                className="settings-input"
                type="text"
                placeholder="Введіть нік або назву..."
                value={displayName}
                maxLength={60}
                onChange={(e) => setDisplayName(e.target.value)}
              />
              {displayNameError && (
                <p className="settings-error">{displayNameError}</p>
              )}
              {displayNameSaved && (
                <p className="settings-success">✓ Збережено</p>
              )}
              <div className="settings-actions">
                <button
                  className="registry-save-btn"
                  onClick={handleSaveDisplayName}
                  disabled={displayNameSaving}
                >
                  {displayNameSaving ? "Збереження..." : "Зберегти"}
                </button>
                <button
                  className="registry-archive-link"
                  onClick={() => setShowSettings(false)}
                >
                  Закрити
                </button>
              </div>
              {/* ── Push-сповіщення: блок у налаштуваннях ── */}
              <div className="settings-push-block">
                {/* "Push-сповіщення" тут — заголовок блоку, не мітка для
                    конкретного поля (нижче йде кнопка-перемикач, не input),
                    тож span замість label, щоб не вводити в оману читалку
                    екрана порожньою міткою. */}
                <span className="settings-label">Push-сповіщення</span>
                <p className="settings-hint">
                  Нагадування про вакцинації, окроли та інші події кабінету —
                  прямо в браузер.
                </p>
                {pushError && <p className="settings-error">{pushError}</p>}
                <button
                  className="registry-save-btn"
                  onClick={handleTogglePush}
                  disabled={pushLoading}
                >
                  {pushLoading
                    ? "Зачекай..."
                    : pushEnabled
                      ? "🔕 Вимкнути сповіщення"
                      : "🔔 Дозволити сповіщення"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {confirmArchiveId && (
        <div
          className="help-overlay"
          onClick={() => {
            setConfirmArchiveId(null);
            setSelectedReason("");
            setArchiveError("");
          }}
          role="presentation"
        >
          <div
            className="confirm-modal"
            onClick={(e) => e.stopPropagation()}
            role="presentation"
          >
            <p className="confirm-text">Причина архівування?</p>
            <div className="archive-reason-list">
              {archiveReasons.map((r) => (
                <button
                  key={r.value}
                  className={`archive-reason-btn ${selectedReason === r.value ? "active" : ""}`}
                  onClick={() => setSelectedReason(r.value)}
                >
                  {r.label}
                </button>
              ))}
            </div>
            {archiveError && <p className="registry-error">{archiveError}</p>}
            <div className="confirm-actions">
              <button
                className="confirm-cancel"
                onClick={() => {
                  setConfirmArchiveId(null);
                  setSelectedReason("");
                  setArchiveError("");
                }}
              >
                Скасувати
              </button>
              <button
                className="confirm-ok"
                onClick={confirmArchive}
                disabled={!selectedReason}
              >
                Архівувати
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
