import { describe, it, expect, vi, beforeEach } from "vitest";
import * as Sentry from "@sentry/react";
import { logError } from "./logError";

vi.mock("@sentry/react", () => ({ captureException: vi.fn() }));

describe("logError", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, "error").mockImplementation(() => {});
    });

    it("виводить помилку в консоль з контекстом", () => {
        const error = new Error("boom");
        logError("Page.load", error);
        expect(console.error).toHaveBeenCalledWith("[Page.load]", error);
    });

    it("надсилає Error у Sentry з тегом контексту", () => {
        const error = new Error("boom");
        logError("Page.load", error);
        expect(Sentry.captureException).toHaveBeenCalledWith(error, {
            tags: { context: "Page.load" },
            extra: {},
        });
    });

    it("помилку Supabase (звичайний об'єкт) перетворює на Error без поля details", () => {
        logError("Page.save", {
            message: "duplicate key",
            code: "23505",
            hint: "h",
            details: "Key (email)=(secret@example.com) already exists",
        });
        const [exception, options] = vi.mocked(Sentry.captureException).mock.calls[0];
        expect(exception).toBeInstanceOf(Error);
        expect((exception as Error).message).toBe("duplicate key");
        expect(options).toEqual({
            tags: { context: "Page.save" },
            extra: { code: "23505", hint: "h" },
        });
        expect(JSON.stringify(options)).not.toContain("secret@example.com");
    });

    it("рядок і інші значення перетворює на Error", () => {
        logError("Page.x", "щось пішло не так");
        const [exception] = vi.mocked(Sentry.captureException).mock.calls[0];
        expect((exception as Error).message).toBe("щось пішло не так");
    });

    it("збій самого Sentry не ламає застосунок", () => {
        vi.mocked(Sentry.captureException).mockImplementation(() => {
            throw new Error("sentry down");
        });
        expect(() => logError("Page.x", new Error("boom"))).not.toThrow();
        expect(console.error).toHaveBeenCalled();
    });
});
