import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { supabase } from "../../../lib/supabase";
import { logError } from "../../../lib/logError";
import {
  uploadRabbitPhoto,
  removeRabbitPhoto,
} from "../../../utils/photoStorage";
// На iOS MIME-тип фото з галереї часто порожній — перевірка спільна
import { isLikelyImageFile } from "../../../utils/imageCompress";
import { emptyForm } from "../constants";

interface Props {
  open: boolean;
  userId: string;
  onClose: () => void;
  onSaved: () => void;
  onPhotoError: (message: string) => void;
}

// Компонент змонтований завжди, а при open=false нічого не малює: так введені
// значення і обране фото зберігаються, якщо форму закрити й відкрити знову
// (як було, коли стан жив у RabbitRegistry).
export default function NewRabbitForm({
  open,
  userId,
  onClose,
  onSaved,
  onPhotoError,
}: Props) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  // Додано (етап 3): фото, обране у формі «Новий кролик». Файл завантажується
  // лише після того, як кролика створено (шлях у сховищі містить його id).
  // Посилання для попереднього перегляду звільняється вручну, тому стан
  // дублюється в ref (для прибирання при розмонтуванні).
  const [newPhoto, setNewPhoto] = useState<{ file: File; url: string } | null>(
    null,
  );
  const newPhotoRef = useRef<{ file: File; url: string } | null>(null);
  const newPhotoInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      // Звільняємо посилання попереднього перегляду фото
      if (newPhotoRef.current) {
        URL.revokeObjectURL(newPhotoRef.current.url);
      }
    };
  }, []);

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
    onPhotoError("");
    const { data: created, error } = await supabase
      .from("rabbits")
      .insert({ ...form, user_id: userId })
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
          userId,
          created.id,
          newPhoto.file,
        );
        const { error: photoDbError } = await supabase
          .from("rabbits")
          .update({ photo_path: uploadedPath })
          .eq("id", created.id)
          .eq("user_id", userId);
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
        onPhotoError(
          "Кролика збережено, але фото завантажити не вдалося. Додайте його через «Редагувати»",
        );
      }
    }

    setForm(emptyForm);
    selectNewPhoto(null);
    onClose();
    onSaved();
    setSaving(false);
  }

  if (!open) return null;

  return (
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
  );
}
