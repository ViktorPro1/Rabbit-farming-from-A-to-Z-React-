import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../../lib/supabase";
import { logError } from "../../../lib/logError";
import {
  subscribeToPush,
  unsubscribeFromPush,
  getPushSubscriptionStatus,
} from "../../../utils/pushNotifications";
import { uploadAvatar, removeAvatar } from "../../../utils/photoStorage";
import { useAvatarUrl } from "../../../hooks/useAvatarUrl";
// На iOS MIME-тип фото з галереї часто порожній — перевірка спільна
import { isLikelyImageFile } from "../../../utils/imageCompress";

interface Props {
  open: boolean;
  session: Session;
  onClose: () => void;
}

// Компонент змонтований завжди, а при open=false нічого не малює: так стан
// (введене ім'я, шлях аватара) зберігається між відкриттями, як і раніше.
export default function SettingsModal({ open, session, onClose }: Props) {
  const displayNameSavedTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
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

  useEffect(() => {
    return () => {
      if (displayNameSavedTimeoutRef.current) {
        clearTimeout(displayNameSavedTimeoutRef.current);
      }
    };
  }, []);

  // ── Push-сповіщення: перевірка статусу підписки при відкритті налаштувань ──
  useEffect(() => {
    if (!open) return;
    getPushSubscriptionStatus()
      .then(setPushEnabled)
      .catch((err) => logError("RabbitRegistry.pushStatus", err));
  }, [open]);

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

  if (!open) return null;

  return (
    <div
      className="help-overlay"
      onClick={onClose}
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
            onClick={onClose}
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
              onClick={onClose}
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
  );
}
