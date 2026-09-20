import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  subscribeToPush,
  unsubscribeFromPush,
  getPushSubscriptionStatus,
} from "./pushNotifications";
import { supabase } from "../lib/supabase";

vi.mock("../lib/supabase", () => ({
  supabase: { from: vi.fn() },
}));

vi.mock("../lib/logError", () => ({ logError: vi.fn() }));

type DbResult = { error: { message: string } | null };

function mockDb(result: DbResult) {
  const deleteEq = vi.fn().mockResolvedValue(result);
  const upsert = vi.fn().mockResolvedValue(result);
  vi.mocked(supabase.from).mockReturnValue({
    delete: () => ({ eq: deleteEq }),
    upsert,
  } as never);
  return { deleteEq, upsert };
}

function mockServiceWorker(subscription: unknown) {
  const registration = {
    pushManager: {
      getSubscription: vi.fn().mockResolvedValue(subscription),
      subscribe: vi.fn().mockResolvedValue(subscription),
    },
  };
  Object.defineProperty(navigator, "serviceWorker", {
    value: { ready: Promise.resolve(registration) },
    configurable: true,
  });
  return registration;
}

function makeSubscription() {
  return {
    endpoint: "https://push.example/endpoint-1",
    unsubscribe: vi.fn().mockResolvedValue(true),
    toJSON: () => ({
      endpoint: "https://push.example/endpoint-1",
      keys: { p256dh: "p-key", auth: "a-key" },
    }),
  };
}

describe("unsubscribeFromPush", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("успіх: видаляє запис за endpoint і скасовує підписку в браузері", async () => {
    const subscription = makeSubscription();
    mockServiceWorker(subscription);
    const { deleteEq } = mockDb({ error: null });

    await unsubscribeFromPush();

    expect(supabase.from).toHaveBeenCalledWith("push_subscriptions");
    expect(deleteEq).toHaveBeenCalledWith("endpoint", subscription.endpoint);
    expect(subscription.unsubscribe).toHaveBeenCalledTimes(1);
  });

  it("помилка видалення в базі: кидає помилку і НЕ скасовує підписку в браузері", async () => {
    const subscription = makeSubscription();
    mockServiceWorker(subscription);
    mockDb({ error: { message: "denied" } });

    await expect(unsubscribeFromPush()).rejects.toMatchObject({
      message: "denied",
    });
    expect(subscription.unsubscribe).not.toHaveBeenCalled();
  });

  it("немає підписки: нічого не робить і не звертається до бази", async () => {
    mockServiceWorker(null);
    mockDb({ error: null });

    await expect(unsubscribeFromPush()).resolves.toBeUndefined();
    expect(supabase.from).not.toHaveBeenCalled();
  });
});

describe("subscribeToPush", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("VITE_VAPID_PUBLIC_KEY", "AAAA");
    Object.defineProperty(window, "PushManager", {
      value: function PushManager() {},
      configurable: true,
    });
    vi.stubGlobal("Notification", {
      requestPermission: vi.fn().mockResolvedValue("granted"),
    });
  });

  it("успіх: зберігає підписку в базі й повертає true", async () => {
    mockServiceWorker(makeSubscription());
    const { upsert } = mockDb({ error: null });

    await expect(subscribeToPush("user-1")).resolves.toBe(true);
    expect(upsert).toHaveBeenCalledWith(
      {
        user_id: "user-1",
        endpoint: "https://push.example/endpoint-1",
        p256dh: "p-key",
        auth: "a-key",
      },
      { onConflict: "endpoint" },
    );
  });

  it("помилка збереження в базі: повертає false", async () => {
    mockServiceWorker(makeSubscription());
    mockDb({ error: { message: "denied" } });

    await expect(subscribeToPush("user-1")).resolves.toBe(false);
  });

  it("дозвіл не надано: повертає false, база не використовується", async () => {
    vi.stubGlobal("Notification", {
      requestPermission: vi.fn().mockResolvedValue("denied"),
    });
    mockServiceWorker(makeSubscription());
    mockDb({ error: null });

    await expect(subscribeToPush("user-1")).resolves.toBe(false);
    expect(supabase.from).not.toHaveBeenCalled();
  });
});

describe("getPushSubscriptionStatus", () => {
  it("true, якщо підписка існує", async () => {
    mockServiceWorker(makeSubscription());
    await expect(getPushSubscriptionStatus()).resolves.toBe(true);
  });

  it("false, якщо підписки немає", async () => {
    mockServiceWorker(null);
    await expect(getPushSubscriptionStatus()).resolves.toBe(false);
  });
});
