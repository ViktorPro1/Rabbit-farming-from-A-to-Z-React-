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
// Додано (нумерація): пропозиція номера на кшталт "VK-F011"
import {
  suggestCode,
  ownerInitials,
  type NamedRabbit,
} from "../../NumberingPage/numbering";
import "./NumberSuggestion.css";

interface Props {
  open: boolean;
  userId: string;
  // Додано (нумерація): відображуване ім'я власника, з нього беруться ініціали
  ownerName?: string | null;
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
  ownerName,
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
  // Додано (нумерація): усі кролики користувача, разом з архівними (лише
  // ім'я і стать), щоб порахувати наступний номер. null — ще не завантажено
  // або завантаження не вдалося (тоді пропозиції просто немає).
  const [allRabbits, setAllRabbits] = useState<NamedRabbit[] | null>(null);
  // Додано (нумерація): користувач натиснув «Свій варіант» — пропозицію
  // ховаємо до наступного відкриття форми.
  const [suggestDismissed, setSuggestDismissed] = useState(false);
  // Додано (нумерація): код, який було підставлено кнопкою «Прийняти». Потрібен,
  // щоб при зміні статі прибрати код, що став неправильним (F замість M).
  const [acceptedName, setAcceptedName] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      // Звільняємо посилання попереднього перегляду фото
      if (newPhotoRef.current) {
        URL.revokeObjectURL(newPhotoRef.current.url);
      }
    };
  }, []);

  // Додано (нумерація): при кожному відкритті форми завантажуємо імена і стать
  // усіх тварин БЕЗ фільтра is_active — архівні номери теж зайняті.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    supabase
      .from("rabbits")
      .select("name, gender")
      .eq("user_id", userId)
      .then(
        ({ data, error }) => {
          if (cancelled) return;
          if (error) {
            logError("NewRabbitForm.loadNumbering", error);
            return;
          }
          setAllRabbits((data || []) as NamedRabbit[]);
        },
        (err) => {
          if (!cancelled) logError("NewRabbitForm.loadNumbering", err);
        },
      );
    return () => {
      cancelled = true;
    };
  }, [open, userId]);

  // Додано (нумерація): пропозиція показується, поки поле клички порожнє і
  // користувач не відмовився від неї.
  const suggestedCode = allRabbits
    ? suggestCode(allRabbits, form.gender, ownerInitials(ownerName))
    : "";
  const showSuggestion =
    !!suggestedCode && !suggestDismissed && form.name === "";

  function acceptSuggestion() {
    setForm({ ...form, name: suggestedCode });
    setAcceptedName(suggestedCode);
  }

  // Додано (нумерація): при зміні статі прибираємо прийнятий раніше код,
  // бо він був для іншої статі. Власноруч введене ім'я не чіпаємо.
  function handleGenderChange(gender: "male" | "female") {
    const clearAccepted = acceptedName !== null && form.name === acceptedName;
    setForm({ ...form, gender, name: clearAccepted ? "" : form.name });
    if (clearAccepted) setAcceptedName(null);
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
    // Додано (нумерація): скидаємо стан пропозиції і старий список номерів —
    // при наступному відкритті форми номери завантажаться заново
    setSuggestDismissed(false);
    setAcceptedName(null);
    setAllRabbits(null);
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
          // Змінено (нумерація): зміна статі йде через handleGenderChange
          onChange={(e) =>
            handleGenderChange(e.target.value as "male" | "female")
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
          onChange={(e) => setForm({ ...form, cage_number: e.target.value })}
        />
        <input
          id="registry-notes"
          name="notes"
          placeholder="Нотатки"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </div>
      {/* Додано (нумерація): пропозиція номера. «Прийняти» підставляє код у
          поле клички, «Свій варіант» ховає пропозицію. */}
      {showSuggestion && (
        <div className="number-suggest">
          <div className="number-suggest-text">
            <span className="number-suggest-label">Пропонований номер</span>
            <span className="number-suggest-code">{suggestedCode}</span>
          </div>
          <div className="number-suggest-actions">
            <button
              type="button"
              className="number-suggest-accept"
              onClick={acceptSuggestion}
              disabled={saving}
            >
              Прийняти
            </button>
            <button
              type="button"
              className="number-suggest-own"
              onClick={() => setSuggestDismissed(true)}
              disabled={saving}
            >
              Свій варіант
            </button>
          </div>
        </div>
      )}
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
          Необов'язково. Фото стискається автоматично і зберігається разом із
          кроликом.
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
