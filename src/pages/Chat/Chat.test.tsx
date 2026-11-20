import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Типи для підставних даних (замість any)
interface MessageRow {
  id: string;
  user_id: string;
  body: string;
  reply_to: string | null;
  created_at: string;
  edited_at: string | null;
  author_is_founder: boolean;
}
interface ReactionRow {
  message_id: string;
  kind: string;
  cnt: number;
  mine: boolean;
}

const ME = "me-id";
const now = Date.now();
let rows: MessageRow[];
let founder = false;
let reactionRows: ReactionRow[] = [];
let reactionError = false;
const insertSpy = vi.fn();
const deleteSpy = vi.fn();
const rpcSpy = vi.fn();

vi.mock("../../lib/supabase", () => {
  const from = () => ({
    select: () => ({
      order: () => ({
        limit: async () => ({ data: [...rows].reverse(), error: null }),
      }),
    }),
    insert: async (v: { body: string; reply_to: string | null }) => {
      insertSpy(v);
      rows.push({
        id: "new",
        user_id: ME,
        edited_at: null,
        author_is_founder: false,
        created_at: new Date().toISOString(),
        ...v,
      });
      return { error: null };
    },
    delete: () => ({
      eq: (_c: string, id: string) => ({
        select: async () => {
          deleteSpy(id);
          const mine = rows.find((r) => r.id === id && r.user_id === ME);
          if (mine) rows = rows.filter((r) => r.id !== id);
          return { data: mine ? [{ id }] : [], error: null };
        },
      }),
    }),
    update: () => ({
      eq: () => ({ select: async () => ({ data: [], error: null }) }),
    }),
  });
  return {
    supabase: {
      from,
      rpc: async (name: string, args?: Record<string, unknown>) => {
        rpcSpy(name, args);
        if (name === "is_founder") return { data: founder, error: null };
        if (name === "chat_reaction_counts")
          return { data: reactionRows, error: null };
        if (name === "chat_set_reaction")
          return {
            data: null,
            error: reactionError ? { message: "boom" } : null,
          };
        return { data: null, error: null };
      },
      auth: {
        getSession: async () => ({ data: { session: { user: { id: ME } } } }),
      },
    },
  };
});

import Chat from "./Chat";

beforeEach(() => {
  insertSpy.mockClear();
  deleteSpy.mockClear();
  rpcSpy.mockClear();
  rows = [
    {
      id: "a",
      user_id: "other",
      body: "Чужий текст",
      reply_to: null,
      created_at: new Date(now - 3600_000).toISOString(),
      edited_at: null,
      author_is_founder: false,
    },
    {
      id: "b",
      user_id: ME,
      body: "Мій текст",
      reply_to: "a",
      created_at: new Date(now - 2 * 86400_000).toISOString(),
      edited_at: null,
      author_is_founder: false,
    },
  ];
  window.confirm = vi.fn(() => true);
  founder = false;
  reactionRows = [];
  reactionError = false;
  rows[0].author_is_founder = true;
  rows[1].author_is_founder = false;
});

describe("Chat", () => {
  it("показує правила, повідомлення, підписи і час життя", async () => {
    render(<Chat />);
    expect(await screen.findAllByText("Чужий текст")).toBeTruthy();
    expect(screen.getByText("Правила чату")).toBeTruthy();
    // автор чужого повідомлення - засновник: бейдж замість "Учасник"
    expect(screen.getByText("Засновник")).toBeTruthy();
    expect(screen.queryByText("Учасник")).toBeNull();
    expect(screen.getByText("Ви")).toBeTruthy();
    expect(
      screen.getByText(
        /зникне через 2 год|зникне через 1 д 23 год|зникне через 23 год/,
      ),
    ).toBeTruthy();
  });

  it("редагувати/видалити тільки для своїх", async () => {
    render(<Chat />);
    await screen.findByText("Мій текст");
    expect(screen.getAllByText("Видалити").length).toBe(1);
    expect(screen.getAllByText("Редагувати").length).toBe(1);
    expect(screen.getAllByText("Відповісти").length).toBe(2);
  });

  it("надсилає повідомлення з reply_to", async () => {
    const user = userEvent.setup();
    render(<Chat />);
    await screen.findAllByText("Чужий текст");
    await user.click(screen.getAllByText("Відповісти")[0]);
    await user.type(
      screen.getByLabelText("Нове повідомлення"),
      "Нова відповідь",
    );
    await user.click(screen.getByText("Надіслати"));
    await waitFor(() =>
      expect(insertSpy).toHaveBeenCalledWith({
        body: "Нова відповідь",
        reply_to: "a",
      }),
    );
    expect(await screen.findByText("Нова відповідь")).toBeTruthy();
  });

  it("кнопка Надіслати вимкнена для порожнього тексту", async () => {
    render(<Chat />);
    await screen.findAllByText("Чужий текст");
    expect((screen.getByText("Надіслати") as HTMLButtonElement).disabled).toBe(
      true,
    );
  });

  it("видаляє своє повідомлення", async () => {
    const user = userEvent.setup();
    render(<Chat />);
    await screen.findByText("Мій текст");
    await user.click(screen.getByText("Видалити"));
    await waitFor(() => expect(deleteSpy).toHaveBeenCalledWith("b"));
    await waitFor(() => expect(screen.queryByText("Мій текст")).toBeNull());
  });

  it("засновник може видаляти чужі повідомлення, звичайний учасник ні", async () => {
    founder = true;
    const user = userEvent.setup();
    render(<Chat />);
    await screen.findAllByText("Чужий текст");
    // 2 кнопки "Видалити" (чуже і своє), "Редагувати" лише для свого
    await waitFor(() => expect(screen.getAllByText("Видалити").length).toBe(2));
    expect(screen.getAllByText("Редагувати").length).toBe(1);
    await user.click(screen.getAllByText("Видалити")[0]);
    await waitFor(() => expect(deleteSpy).toHaveBeenCalledWith("a"));
  });

  it("правила чату згорнуті за замовчуванням і розгортаються по кліку", async () => {
    const user = userEvent.setup();
    render(<Chat />);
    await screen.findAllByText("Чужий текст");
    const toggle = screen.getByRole("button", { name: /Правила чату/ });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    await user.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    await user.click(toggle);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });

  it("позначає чат прочитаним і сповіщає хедер подією", async () => {
    const onRead = vi.fn();
    window.addEventListener("chat-read", onRead);
    render(<Chat />);
    await screen.findAllByText("Чужий текст");
    await waitFor(() =>
      expect(rpcSpy).toHaveBeenCalledWith("chat_mark_read", undefined),
    );
    await waitFor(() => expect(onRead).toHaveBeenCalled());
    // один раз на перше завантаження, а не на кожен рендер
    expect(
      rpcSpy.mock.calls.filter((c) => c[0] === "chat_mark_read").length,
    ).toBe(1);
    window.removeEventListener("chat-read", onRead);
  });

  it("реакції: показує кількості й мою, кнопки мають aria-pressed", async () => {
    reactionRows = [
      { message_id: "a", kind: "up", cnt: 3, mine: false },
      { message_id: "a", kind: "handshake", cnt: 1, mine: true },
    ];
    render(<Chat />);
    await screen.findAllByText("Чужий текст");
    await waitFor(() => expect(screen.getByText("3")).toBeTruthy());
    const ups = screen.getAllByRole("button", { name: "Подобається" });
    const hands = screen.getAllByRole("button", { name: "Рукостискання" });
    expect(ups[0].getAttribute("aria-pressed")).toBe("false");
    expect(hands[0].getAttribute("aria-pressed")).toBe("true");
  });

  it("реакції: клік ставить, повторний клік знімає, інша замінює", async () => {
    const user = userEvent.setup();
    render(<Chat />);
    await screen.findAllByText("Чужий текст");
    const up = () => screen.getAllByRole("button", { name: "Подобається" })[0];
    const down = () =>
      screen.getAllByRole("button", { name: "Не подобається" })[0];

    await user.click(up());
    expect(rpcSpy).toHaveBeenCalledWith("chat_set_reaction", {
      p_message_id: "a",
      p_kind: "up",
    });
    expect(up().getAttribute("aria-pressed")).toBe("true");
    expect(up().textContent).toBe("1");

    await user.click(down()); // заміна
    expect(up().getAttribute("aria-pressed")).toBe("false");
    expect(up().textContent).toBe("");
    expect(down().getAttribute("aria-pressed")).toBe("true");

    await user.click(down()); // зняття
    expect(down().getAttribute("aria-pressed")).toBe("false");
    expect(down().textContent).toBe("");
  });

  it("реакції: помилка бази показує повідомлення і повертає реальний стан", async () => {
    reactionError = true;
    const user = userEvent.setup();
    render(<Chat />);
    await screen.findAllByText("Чужий текст");
    await user.click(screen.getAllByRole("button", { name: "Подобається" })[0]);
    expect(
      await screen.findByText("Не вдалося поставити реакцію."),
    ).toBeTruthy();
    // після перезавантаження з бази (там реакцій немає) кнопка знову не натиснута
    await waitFor(() =>
      expect(
        screen
          .getAllByRole("button", { name: "Подобається" })[0]
          .getAttribute("aria-pressed"),
      ).toBe("false"),
    );
  });
});
