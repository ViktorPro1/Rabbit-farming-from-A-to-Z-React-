import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Session } from "@supabase/supabase-js";

const rpc = vi.fn();
vi.mock("../lib/supabase", () => ({ supabase: { rpc: (n: string) => rpc(n) } }));
vi.mock("../lib/logError", () => ({ logError: vi.fn() }));

import { useChatUnread, CHAT_READ_EVENT } from "./useChatUnread";

const session = { user: { id: "u" } } as unknown as Session;

beforeEach(() => rpc.mockReset());

describe("useChatUnread", () => {
  it("без сесії повертає 0 і не робить запитів", () => {
    const { result } = renderHook(() => useChatUnread(null));
    expect(result.current).toBe(0);
    expect(rpc).not.toHaveBeenCalled();
  });

  it("повертає число від бази", async () => {
    rpc.mockResolvedValue({ data: 3, error: null });
    const { result } = renderHook(() => useChatUnread(session));
    await waitFor(() => expect(result.current).toBe(3));
    expect(rpc).toHaveBeenCalledWith("chat_unread_count");
  });

  it("перераховує після події chat-read", async () => {
    rpc.mockResolvedValueOnce({ data: 3, error: null });
    const { result } = renderHook(() => useChatUnread(session));
    await waitFor(() => expect(result.current).toBe(3));
    rpc.mockResolvedValueOnce({ data: 0, error: null });
    act(() => { window.dispatchEvent(new Event(CHAT_READ_EVENT)); });
    await waitFor(() => expect(result.current).toBe(0));
  });

  it("при помилці лишає попереднє значення", async () => {
    rpc.mockResolvedValueOnce({ data: 2, error: null });
    const { result } = renderHook(() => useChatUnread(session));
    await waitFor(() => expect(result.current).toBe(2));
    rpc.mockResolvedValueOnce({ data: null, error: new Error("x") });
    act(() => { window.dispatchEvent(new Event(CHAT_READ_EVENT)); });
    await new Promise((r) => setTimeout(r, 20));
    expect(result.current).toBe(2);
  });
});
