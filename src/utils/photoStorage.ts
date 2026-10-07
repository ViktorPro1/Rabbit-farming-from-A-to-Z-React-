import { supabase } from "../lib/supabase";
import { compressImage } from "./imageCompress";

export const PHOTO_BUCKET = "rabbit-photos";

const FULL_OPTS = { maxSide: 1280, quality: 0.8 };
const THUMB_OPTS = { maxSide: 400, quality: 0.75 };
const SIGNED_URL_TTL_SEC = 60 * 60;
// Оновлюємо посилання трохи раніше, ніж воно спливе
const CACHE_MARGIN_MS = 5 * 60 * 1000;

const urlCache = new Map<string, { url: string; expires: number }>();

/** Шлях мініатюри виводиться зі шляху повного фото */
export function thumbPathOf(photoPath: string): string {
  return photoPath.replace(/\.(webp|jpg)$/, "_thumb.$1");
}

function readCache(path: string): string | null {
  const hit = urlCache.get(path);
  if (hit && hit.expires - CACHE_MARGIN_MS > Date.now()) return hit.url;
  return null;
}

function writeCache(path: string, url: string) {
  urlCache.set(path, {
    url,
    expires: Date.now() + SIGNED_URL_TTL_SEC * 1000,
  });
}

/**
 * Стискає фото, завантажує повну версію та мініатюру.
 * Повертає шлях повного фото. Його потрібно записати в rabbits.photo_path.
 * Ім'я файлу містить мітку часу, тому браузер ніколи не покаже стару версію.
 */
export async function uploadRabbitPhoto(
  userId: string,
  rabbitId: string,
  file: File,
): Promise<string> {
  // Змінено: стискаємо по черзі, не паралельно — на телефоні два canvas
  // з камерним знімком легко вичерпують пам'ять.
  const full = await compressImage(file, FULL_OPTS);
  const thumb = await compressImage(file, THUMB_OPTS);
  // Обидві версії кодуються одним і тим самим способом
  const ext = full.ext;
  const photoPath = `${userId}/${rabbitId}-${Date.now()}.${ext}`;
  const thumbPath = thumbPathOf(photoPath);
  const contentType = ext === "webp" ? "image/webp" : "image/jpeg";

  const fullRes = await supabase.storage
    .from(PHOTO_BUCKET)
    .upload(photoPath, full.blob, { contentType });
  if (fullRes.error) throw fullRes.error;

  const thumbRes = await supabase.storage
    .from(PHOTO_BUCKET)
    .upload(thumbPath, thumb.blob, { contentType });
  if (thumbRes.error) {
    await supabase.storage.from(PHOTO_BUCKET).remove([photoPath]);
    throw thumbRes.error;
  }

  return photoPath;
}

/** Видаляє повне фото і мініатюру. Помилки не кидає: файл-сирота не критичний. */
export async function removeRabbitPhoto(photoPath: string): Promise<void> {
  const { error } = await supabase.storage
    .from(PHOTO_BUCKET)
    .remove([photoPath, thumbPathOf(photoPath)]);
  if (error) console.error("removeRabbitPhoto", error);
}

/** Підписані посилання на мініатюри для списку (один запит на весь список) */
export async function getThumbUrls(
  photoPaths: string[],
): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  const missing: string[] = [];

  for (const p of photoPaths) {
    const cached = readCache(thumbPathOf(p));
    if (cached) result[p] = cached;
    else missing.push(p);
  }

  if (missing.length > 0) {
    const { data, error } = await supabase.storage
      .from(PHOTO_BUCKET)
      .createSignedUrls(missing.map(thumbPathOf), SIGNED_URL_TTL_SEC);
    if (error) throw error;
    for (const item of data ?? []) {
      if (!item.signedUrl || !item.path) continue;
      writeCache(item.path, item.signedUrl);
      const original = missing.find((p) => thumbPathOf(p) === item.path);
      if (original) result[original] = item.signedUrl;
    }
  }

  return result;
}

/** Підписане посилання на повне фото (для сторінки редагування і перегляду) */
export async function getFullUrl(photoPath: string): Promise<string | null> {
  const cached = readCache(photoPath);
  if (cached) return cached;
  const { data, error } = await supabase.storage
    .from(PHOTO_BUCKET)
    .createSignedUrl(photoPath, SIGNED_URL_TTL_SEC);
  if (error || !data?.signedUrl) return null;
  writeCache(photoPath, data.signedUrl);
  return data.signedUrl;
}

// ── Додано (етап 2): фото особистого кабінету (аватар) ──

const AVATAR_OPTS = { maxSide: 256, quality: 0.8, square: true };

/**
 * Стискає фото до квадрата 256 px (обрізка по центру) і завантажує
 * у ту саму папку користувача. Повертає шлях, який треба записати
 * в user_metadata.avatar_path. Мітка часу в імені обходить кеш браузера.
 */
export async function uploadAvatar(
  userId: string,
  file: File,
): Promise<string> {
  const { blob, ext } = await compressImage(file, AVATAR_OPTS);
  const path = `${userId}/avatar-${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from(PHOTO_BUCKET)
    .upload(path, blob, {
      contentType: ext === "webp" ? "image/webp" : "image/jpeg",
    });
  if (error) throw error;
  return path;
}

/** Видаляє файл аватара. Помилки не кидає: файл-сирота не критичний. */
export async function removeAvatar(path: string): Promise<void> {
  const { error } = await supabase.storage.from(PHOTO_BUCKET).remove([path]);
  if (error) console.error("removeAvatar", error);
}