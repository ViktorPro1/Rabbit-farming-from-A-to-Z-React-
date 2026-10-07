export interface CompressedImage {
  blob: Blob;
  ext: "webp" | "jpg";
}

export interface CompressOptions {
  /** Максимальний розмір більшої сторони, px */
  maxSide: number;
  /** Якість кодування, 0..1 */
  quality: number;
  /** Обрізати по центру до квадрата (для аватарів) */
  square?: boolean;
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/**
 * Зменшує зображення на клієнті й кодує у WebP.
 * Якщо браузер не вміє кодувати WebP, використовується JPEG.
 * Орієнтація з EXIF враховується (фото з телефона не буде перевернутим).
 */
export async function compressImage(
  file: Blob,
  opts: CompressOptions,
): Promise<CompressedImage> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Обраний файл не є зображенням");
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error(
      "Не вдалося прочитати зображення. Спробуйте формат JPG або PNG",
    );
  }

  try {
    let sx = 0;
    let sy = 0;
    let sw = bitmap.width;
    let sh = bitmap.height;

    if (opts.square) {
      const side = Math.min(bitmap.width, bitmap.height);
      sx = (bitmap.width - side) / 2;
      sy = (bitmap.height - side) / 2;
      sw = side;
      sh = side;
    }

    const scale = Math.min(1, opts.maxSide / Math.max(sw, sh));
    const dw = Math.max(1, Math.round(sw * scale));
    const dh = Math.max(1, Math.round(sh * scale));

    const canvas = document.createElement("canvas");
    canvas.width = dw;
    canvas.height = dh;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Браузер не підтримує обробку зображень");
    ctx.drawImage(bitmap, sx, sy, sw, sh, 0, 0, dw, dh);

    const webp = await canvasToBlob(canvas, "image/webp", opts.quality);
    if (webp && webp.type === "image/webp") {
      return { blob: webp, ext: "webp" };
    }

    const jpeg = await canvasToBlob(canvas, "image/jpeg", opts.quality);
    if (!jpeg) throw new Error("Не вдалося стиснути зображення");
    return { blob: jpeg, ext: "jpg" };
  } finally {
    bitmap.close();
  }
}
