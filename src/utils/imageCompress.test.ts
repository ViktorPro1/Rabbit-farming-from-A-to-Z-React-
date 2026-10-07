import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { compressImage, isLikelyImageFile } from "./imageCompress";

describe("isLikelyImageFile", () => {
  it("приймає image/*", () => {
    expect(isLikelyImageFile(new Blob([], { type: "image/jpeg" }))).toBe(true);
    expect(isLikelyImageFile(new Blob([], { type: "image/heic" }))).toBe(true);
  });

  it("приймає порожній тип і octet-stream (iOS / WebView)", () => {
    expect(isLikelyImageFile(new Blob([]))).toBe(true);
    expect(
      isLikelyImageFile(new Blob([], { type: "application/octet-stream" })),
    ).toBe(true);
  });

  it("відхиляє PDF", () => {
    expect(isLikelyImageFile(new Blob([], { type: "application/pdf" }))).toBe(
      false,
    );
  });
});

describe("compressImage", () => {
  const bitmap = { width: 100, height: 80, close: vi.fn() };

  beforeEach(() => {
    bitmap.close.mockClear();
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      drawImage: vi.fn(),
    })) as never;
    HTMLCanvasElement.prototype.toBlob = function (cb, type) {
      const t = type === "image/webp" ? "image/webp" : "image/jpeg";
      cb(new Blob(["x"], { type: t }));
    };
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("якщо from-image кидає — пробує createImageBitmap без опцій", async () => {
    const create = vi
      .fn()
      .mockRejectedValueOnce(new TypeError("from-image"))
      .mockResolvedValueOnce(bitmap);
    vi.stubGlobal("createImageBitmap", create);

    const result = await compressImage(new Blob(["x"], { type: "image/jpeg" }), {
      maxSide: 50,
      quality: 0.8,
    });

    expect(create).toHaveBeenCalledTimes(2);
    expect(create.mock.calls[0][1]).toEqual({
      imageOrientation: "from-image",
    });
    expect(create.mock.calls[1][1]).toBeUndefined();
    expect(result.ext).toBe("webp");
    expect(bitmap.close).toHaveBeenCalled();
  });

  it("відхиляє не-зображення до декодування", async () => {
    const create = vi.fn();
    vi.stubGlobal("createImageBitmap", create);
    await expect(
      compressImage(new Blob(["x"], { type: "application/pdf" }), {
        maxSide: 50,
        quality: 0.8,
      }),
    ).rejects.toThrow("Обраний файл не є зображенням");
    expect(create).not.toHaveBeenCalled();
  });
});
