import { useEffect, useRef, useState } from "react";
// Додано: тип події вибору файлу
import type { ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import Toast from "../../components/Toast/Toast";
import { useToast } from "../../hooks/useToast";
// Додано: фото кролика (стиснення, завантаження, видалення, мініатюри)
import { logError } from "../../lib/logError";
import {
  uploadRabbitPhoto,
  removeRabbitPhoto,
  getThumbUrls,
} from "../../utils/photoStorage";
import "./RabbitEdit.css";

interface Props {
  session: Session;
}

const emptyForm = {
  name: "",
  breed: "",
  gender: "female" as "male" | "female",
  birth_date: "",
  cage_number: "",
  notes: "",
};

// Додано: найбільший вихідний файл фото (до стиснення), МБ
const MAX_PHOTO_SOURCE_MB = 20;

export default function RabbitEdit({ session }: Props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { message, type, visible, showToast } = useToast();
  // Додано: стан фото. Фото зберігається окремо від кнопки «Зберегти»:
  // додавання, заміна і видалення одразу записуються в rabbits.photo_path.
  const [photoPath, setPhotoPath] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<{
    path: string;
    url: string;
  } | null>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [confirmPhotoDelete, setConfirmPhotoDelete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // Посилання діє лише для поточного шляху; після заміни старе не показуємо
  const photoUrl =
    photoPath && photoPreview?.path === photoPath ? photoPreview.url : null;

  useEffect(() => {
    if (!id) return;
    supabase
      .from("rabbits")
      .select("*")
      .eq("id", id)
      .eq("user_id", session.user.id)
      .single()
      .then(
        ({ data }) => {
          if (data) {
            setForm({
              name: data.name || "",
              breed: data.breed || "",
              gender: data.gender || "female",
              birth_date: data.birth_date || "",
              cage_number: data.cage_number || "",
              notes: data.notes || "",
            });
            // Додано: шлях до фото (null, якщо фото немає)
            setPhotoPath(data.photo_path ?? null);
          }
          setLoading(false);
        },
        (err) => {
          console.error("Не вдалося завантажити дані кролика:", err);
          setLoading(false);
        },
      );
  }, [id, session.user.id]);

  async function handleSave() {
    if (!form.name.trim()) return;
    setSaving(true);
    const { error } = await supabase
      .from("rabbits")
      .update(form)
      .eq("id", id)
      .eq("user_id", session.user.id);
    if (error) {
      showToast("Помилка збереження", "error");
    } else {
      showToast("Збережено", "success");
      setTimeout(() => navigate("/registry"), 1000);
    }
    setSaving(false);
  }

  // Додано: отримання посилання на мініатюру для поточного фото
  useEffect(() => {
    if (!photoPath) return;
    let cancelled = false;
    getThumbUrls([photoPath])
      .then((urls) => {
        if (!cancelled && urls[photoPath]) {
          setPhotoPreview({ path: photoPath, url: urls[photoPath] });
        }
      })
      .catch((err) => logError("RabbitEdit.photoPreview", err));
    return () => {
      cancelled = true;
    };
  }, [photoPath]);

  // Додано: додавання або заміна фото.
  // Порядок: завантажити новий файл -> записати шлях у БД -> видалити старий.
  // Якщо запис у БД не вдався, щойно завантажений файл прибирається,
  // а старе фото лишається недоторканим.
  async function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // дозволяє обрати той самий файл повторно
    if (!file || !id) return;
    if (!file.type.startsWith("image/")) {
      showToast("Оберіть файл із зображенням", "error");
      return;
    }
    if (file.size > MAX_PHOTO_SOURCE_MB * 1024 * 1024) {
      showToast(`Фото завелике (понад ${MAX_PHOTO_SOURCE_MB} МБ)`, "error");
      return;
    }

    setPhotoBusy(true);
    setConfirmPhotoDelete(false);
    const oldPath = photoPath;
    let newPath: string | null = null;
    let saved = false;
    try {
      newPath = await uploadRabbitPhoto(session.user.id, id, file);
      const { error } = await supabase
        .from("rabbits")
        .update({ photo_path: newPath })
        .eq("id", id)
        .eq("user_id", session.user.id);
      if (error) throw error;
      saved = true;
      setPhotoPath(newPath);
      if (oldPath) await removeRabbitPhoto(oldPath);
      showToast("Фото збережено", "success");
    } catch (err) {
      logError("RabbitEdit.photoUpload", err);
      if (newPath && !saved) await removeRabbitPhoto(newPath);
      showToast("Не вдалося зберегти фото. Спробуйте ще раз", "error");
    } finally {
      setPhotoBusy(false);
    }
  }

  // Додано: видалення фото. Спершу очищаємо шлях у БД, і лише потім файли,
  // щоб при збої не лишилось посилання на неіснуючий файл.
  async function handlePhotoDelete() {
    if (!photoPath || !id) return;
    setPhotoBusy(true);
    try {
      const { error } = await supabase
        .from("rabbits")
        .update({ photo_path: null })
        .eq("id", id)
        .eq("user_id", session.user.id);
      if (error) throw error;
      await removeRabbitPhoto(photoPath);
      setPhotoPath(null);
      setConfirmPhotoDelete(false);
      showToast("Фото видалено", "success");
    } catch (err) {
      logError("RabbitEdit.photoDelete", err);
      showToast("Не вдалося видалити фото. Спробуйте ще раз", "error");
    } finally {
      setPhotoBusy(false);
    }
  }

  if (loading) return <p style={{ padding: "2rem" }}>Завантаження...</p>;

  return (
    <div className="edit-page">
      <Toast message={message} type={type} visible={visible} />

      <div className="edit-header">
        <h1>✏️ Редагування кролика</h1>
      </div>

      <div className="edit-form">
        {/* Додано: блок фото кролика */}
        <div className="edit-photo">
          <div className="edit-photo-frame">
            {photoUrl ? (
              <img
                className="edit-photo-img"
                src={photoUrl}
                alt={`Фото: ${form.name}`}
              />
            ) : (
              <span className="edit-photo-placeholder">
                {photoPath ? "Завантаження фото..." : "Фото немає"}
              </span>
            )}
          </div>
          <div className="edit-photo-actions">
            <input
              ref={fileInputRef}
              id="edit-photo-input"
              type="file"
              accept="image/*"
              aria-label="Обрати файл фото"
              hidden
              onChange={handlePhotoChange}
            />
            <button
              type="button"
              className="edit-photo-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={photoBusy}
            >
              {photoBusy
                ? "Обробка..."
                : photoPath
                  ? "Замінити фото"
                  : "Додати фото"}
            </button>
            {photoPath && !confirmPhotoDelete && (
              <button
                type="button"
                className="edit-photo-btn edit-photo-btn--danger"
                onClick={() => setConfirmPhotoDelete(true)}
                disabled={photoBusy}
              >
                Видалити фото
              </button>
            )}
            {photoPath && confirmPhotoDelete && (
              <>
                <button
                  type="button"
                  className="edit-photo-btn edit-photo-btn--confirm"
                  onClick={handlePhotoDelete}
                  disabled={photoBusy}
                >
                  Так, видалити
                </button>
                <button
                  type="button"
                  className="edit-photo-btn"
                  onClick={() => setConfirmPhotoDelete(false)}
                  disabled={photoBusy}
                >
                  Ні
                </button>
              </>
            )}
          </div>
          <p className="edit-photo-hint">
            Фото стискається автоматично перед завантаженням. Воно зберігається
            одразу, без кнопки «Зберегти».
          </p>
        </div>

        <div className="edit-form-grid">
          <input
            id="edit-name"
            name="name"
            placeholder="Кличка *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            id="edit-breed"
            name="breed"
            placeholder="Порода"
            value={form.breed}
            onChange={(e) => setForm({ ...form, breed: e.target.value })}
          />
          <select
            id="edit-gender"
            name="gender"
            value={form.gender}
            onChange={(e) =>
              setForm({ ...form, gender: e.target.value as "male" | "female" })
            }
          >
            <option value="female">Самиця</option>
            <option value="male">Самець</option>
          </select>
          <input
            id="edit-birth-date"
            name="birth_date"
            type="date"
            value={form.birth_date}
            onChange={(e) => setForm({ ...form, birth_date: e.target.value })}
          />
          <input
            id="edit-cage-number"
            name="cage_number"
            placeholder="Номер клітки"
            value={form.cage_number}
            onChange={(e) => setForm({ ...form, cage_number: e.target.value })}
          />
          <input
            id="edit-notes"
            name="notes"
            placeholder="Нотатки"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </div>

        <div className="edit-actions">
          <button className="edit-cancel" onClick={() => navigate("/registry")}>
            Скасувати
          </button>
          <button
            className="edit-save"
            onClick={handleSave}
            disabled={saving || !form.name}
          >
            {saving ? "Збереження..." : "Зберегти"}
          </button>
        </div>
      </div>
    </div>
  );
}
