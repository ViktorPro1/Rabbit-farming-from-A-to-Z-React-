import { useState } from "react";
import { logError } from "../../../lib/logError";
import { getFullUrl } from "../../../utils/photoStorage";
import type { Rabbit } from "../types";

// Повне фото кролика: відкрите фото і помилка його відкриття. setPhotoError
// віддається назовні, бо помилку фото з форми «Новий кролик» показує той самий блок.
export function usePhotoViewer() {
  const [photoViewer, setPhotoViewer] = useState<{
    url: string;
    name: string;
  } | null>(null);
  const [photoError, setPhotoError] = useState("");

  // Відкриває повне фото кролика поверх сторінки
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

  function closePhoto() {
    setPhotoViewer(null);
  }

  return { photoViewer, photoError, setPhotoError, openPhoto, closePhoto };
}
