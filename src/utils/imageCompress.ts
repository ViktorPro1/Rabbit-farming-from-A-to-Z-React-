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

interface DecodedImage {
  source: CanvasImageSource;
  width: number;
  height: number;
  close: () => void;
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/**
 * Чи файл схожий на зображення. На iOS галерея часто віддає порожній
 * MIME-тип; application/octet-stream теж трапляється у WebView.
 * PDF і подібне відсікаємо тут, а остаточна перевірка — спроба декодувати.
 */
export function isLikelyImageFile(file: Blob): boolean {
  if (!file.type || file.type === "application/octet-stream") return true;
  return file.type.startsWith("image/");
}

function decodeViaImgElement(file: Blob): Promise<DecodedImage> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        source: img,
        width: img.naturalWidth,
        height: img.naturalHeight,
        close: () => {
          img.src = "";
        },
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(
        new Error(
          "Не вдалося прочитати зображення. Спробуйте формат JPG або PNG",
        ),
      );
    };
    img.src = url;
  });
}

/**
 * Декодує файл у джерело для canvas.
 * from-image (EXIF) є не в усіх мобільних браузерах — тоді пробуємо без
 * опцій, потім через <img> (типовий шлях для старого Safari / WebView).
 */
async function decodeImage(file: Blob): Promise<DecodedImage> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file, {
        imageOrientation: "from-image",
      });
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        close: () => bitmap.close(),
      };
    } catch {
      try {
        const bitmap = await createImageBitmap(file);
        return {
          source: bitmap,
          width: bitmap.width,
          height: bitmap.height,
          close: () => bitmap.close(),
        };
      } catch {
        // далі — <img>
      }
    }
  }
  return decodeViaImgElement(file);
}

/**
 * Зменшує зображення на клієнті й кодує у WebP.
 * Якщо браузер не вміє кодувати WebP, використовується JPEG.
 * Орієнтація з EXIF враховується там, де браузер це вміє
 * (фото з телефона не буде перевернутим).
 */
export async function compressImage(
  file: Blob,
  opts: CompressOptions,
): Promise<CompressedImage> {
  if (!isLikelyImageFile(file)) {
    throw new Error("Обраний файл не є зображенням");
  }

  const decoded = await decodeImage(file);

  try {
    let sx = 0;
    let sy = 0;
    let sw = decoded.width;
    let sh = decoded.height;

    if (opts.square) {
      const side = Math.min(decoded.width, decoded.height);
      sx = (decoded.width - side) / 2;
      sy = (decoded.height - side) / 2;
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
    ctx.drawImage(decoded.source, sx, sy, sw, sh, 0, 0, dw, dh);

    const webp = await canvasToBlob(canvas, "image/webp", opts.quality);
    if (webp && webp.type === "image/webp") {
      return { blob: webp, ext: "webp" };
    }

    const jpeg = await canvasToBlob(canvas, "image/jpeg", opts.quality);
    if (!jpeg) throw new Error("Не вдалося стиснути зображення");
    return { blob: jpeg, ext: "jpg" };
  } finally {
    decoded.close();
  }
}
