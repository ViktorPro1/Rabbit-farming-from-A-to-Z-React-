import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import type { Session } from "@supabase/supabase-js";
import Admin from "./Admin";
import { supabase } from "../../lib/supabase";

vi.mock("../../lib/supabase", () => ({
  supabase: { from: vi.fn(), rpc: vi.fn() },
}));

// Клієнт для presence створюється на рівні модуля — підміняємо його
vi.mock("@supabase/supabase-js", () => {
  const channel: Record<string, unknown> = {};
  channel.on = () => channel;
  channel.subscribe = () => channel;
  channel.presenceState = () => ({});
  return {
    createClient: () => ({
      channel: () => channel,
      removeChannel: vi.fn(),
    }),
  };
});

const session = {
  user: { id: "admin-1" },
  access_token: "token",
} as unknown as Session;

const profileUser = {
  id: "user-2",
  email: "client@example.com",
  created_at: "2026-09-01T10:00:00Z",
  access_until: null,
  plan_type: "paid",
};

const usedCode = {
  id: "code-1",
  code: "KROL-USED1",
  is_used: true,
  used_by: "user-2",
  created_at: "2026-09-01T09:00:00Z",
};

const freeCode = {
  id: "code-2",
  code: "KROL-FREE1",
  is_used: false,
  used_by: null,
  created_at: "2026-09-02T09:00:00Z",
};

type Result = {
  data?: unknown;
  error?: { message: string } | null;
  count?: number;
};

function chain(result: Result) {
  const c: Record<string, unknown> = {};
  const passthrough = () => c;
  c.select = passthrough;
  c.order = passthrough;
  c.eq = passthrough;
  c.maybeSingle = passthrough;
  c.single = passthrough;
  c.then = (
    resolve: (v: unknown) => unknown,
    reject: (e: unknown) => unknown,
  ) =>
    Promise.resolve({ data: null, error: null, ...result }).then(
      resolve,
      reject,
    );
  return c;
}

interface Config {
  admin?: Result;
  codes?: Result;
  profiles?: Result;
  deactivated?: Result;
  profileDelete?: Result;
  codeDelete?: Result;
  codeRelease?: Result;
  profileInsert?: Result;
}

function setupSupabase(config: Config = {}) {
  const calls = {
    profileDelete: 0,
    codeRelease: 0,
    codeDelete: 0,
    profileInsert: 0,
  };

  vi.mocked(supabase.from).mockImplementation(((table: string) => {
    switch (table) {
      case "admins":
        return {
          select: () => chain(config.admin ?? { data: { user_id: "admin-1" } }),
        };
      case "invite_codes":
        return {
          select: () => chain(config.codes ?? { data: [usedCode, freeCode] }),
          delete: () => {
            calls.codeDelete++;
            return chain(config.codeDelete ?? { error: null });
          },
          update: () => {
            calls.codeRelease++;
            return chain(
              config.codeRelease ?? { data: [{ id: "code-1" }], error: null },
            );
          },
          insert: () => chain({ error: null }),
        };
      case "profiles":
        return {
          select: (_cols?: string, opts?: { head?: boolean }) =>
            opts?.head
              ? chain({ count: 1 })
              : chain(config.profiles ?? { data: [profileUser] }),
          delete: () => {
            calls.profileDelete++;
            return chain(config.profileDelete ?? { error: null });
          },
          insert: () => {
            calls.profileInsert++;
            return chain(config.profileInsert ?? { error: null });
          },
          update: () => chain({ error: null }),
        };
      case "leads":
      case "nps_feedback":
        return { select: () => chain({ data: [] }) };
      default:
        throw new Error("Неочікувана таблиця: " + table);
    }
  }) as never);

  vi.mocked(supabase.rpc).mockImplementation(((name: string) => {
    if (name === "get_deactivated_users") {
      return Promise.resolve({
        data: [],
        error: null,
        ...(config.deactivated ?? {}),
      });
    }
    if (name === "get_db_size")
      return Promise.resolve({ data: 1000, error: null });
    return Promise.resolve({
      data: name === "get_table_counts" ? {} : [],
      error: null,
    });
  }) as never);

  return calls;
}

function renderAdmin() {
  return render(<Admin session={session} />);
}

async function userRow() {
  const cell = await screen.findByText("client@example.com");
  return cell.closest("tr") as HTMLElement;
}

describe("Admin: перевірка прав", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("звичайний користувач бачить 'Доступ заборонено'", async () => {
    setupSupabase({ admin: { data: null, error: null } });
    renderAdmin();
    expect(await screen.findByText("Доступ заборонено.")).toBeInTheDocument();
  });

  it("технічна помилка перевірки не видається за 'Доступ заборонено'", async () => {
    setupSupabase({ admin: { data: null, error: { message: "boom" } } });
    renderAdmin();
    expect(
      await screen.findByText(/Не вдалося перевірити права доступу/),
    ).toBeInTheDocument();
    expect(screen.queryByText("Доступ заборонено.")).not.toBeInTheDocument();
  });
});

describe("Admin: завантаження списків", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("помилка завантаження користувачів показує повідомлення", async () => {
    setupSupabase({ profiles: { data: null, error: { message: "boom" } } });
    renderAdmin();
    expect(
      await screen.findByText("Не вдалося завантажити список користувачів"),
    ).toBeInTheDocument();
  });

  it("помилка завантаження кодів показує повідомлення", async () => {
    setupSupabase({ codes: { data: null, error: { message: "boom" } } });
    renderAdmin();
    expect(
      await screen.findByText("Не вдалося завантажити коди запрошень"),
    ).toBeInTheDocument();
  });

  it("якщо коди не завантажились, користувачів усе одно видно", async () => {
    setupSupabase({ codes: { data: null, error: { message: "boom" } } });
    renderAdmin();
    expect(await screen.findByText("client@example.com")).toBeInTheDocument();
  });

  it("помилка списку деактивованих показує повідомлення", async () => {
    setupSupabase({ deactivated: { data: null, error: { message: "boom" } } });
    renderAdmin();
    expect(
      await screen.findByText(
        "Не вдалося завантажити список деактивованих користувачів",
      ),
    ).toBeInTheDocument();
  });

  it("без помилок повідомлень про збій немає", async () => {
    setupSupabase();
    renderAdmin();
    await screen.findByText("client@example.com");
    expect(screen.queryByText(/Не вдалося/)).not.toBeInTheDocument();
  });
});

describe("Admin: видалення користувача", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  it("помилка видалення профілю: показує повідомлення і НЕ звільняє код запрошення", async () => {
    const calls = setupSupabase({
      profileDelete: { error: { message: "denied" } },
    });
    renderAdmin();

    fireEvent.click(
      within(await userRow()).getByRole("button", { name: "Видалити" }),
    );

    expect(
      await screen.findByText("Не вдалося видалити користувача"),
    ).toBeInTheDocument();
    expect(calls.codeRelease).toBe(0);
  });

  it("код не звільнився (0 рядків, напр. RLS): повідомляє, що код лишився використаним", async () => {
    setupSupabase({ codeRelease: { data: [], error: null } });
    renderAdmin();

    fireEvent.click(
      within(await userRow()).getByRole("button", { name: "Видалити" }),
    );

    expect(
      await screen.findByText(/Код запрошення не вдалося звільнити/),
    ).toBeInTheDocument();
  });

  it("помилка звільнення коду: повідомляє, що користувача видалено, а код ні", async () => {
    setupSupabase({ codeRelease: { data: null, error: { message: "boom" } } });
    renderAdmin();

    fireEvent.click(
      within(await userRow()).getByRole("button", { name: "Видалити" }),
    );

    expect(
      await screen.findByText(
        "Користувача видалено, але не вдалося звільнити код запрошення",
      ),
    ).toBeInTheDocument();
  });

  it("усе успішно: повідомлень немає", async () => {
    const calls = setupSupabase();
    renderAdmin();

    fireEvent.click(
      within(await userRow()).getByRole("button", { name: "Видалити" }),
    );

    await waitFor(() => expect(calls.codeRelease).toBe(1));
    expect(screen.queryByText(/Не вдалося/)).not.toBeInTheDocument();
  });
});

describe("Admin: коди й відновлення", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  it("помилка видалення коду показує повідомлення", async () => {
    setupSupabase({ codeDelete: { error: { message: "denied" } } });
    renderAdmin();

    const row = (await screen.findByText("KROL-FREE1")).closest(
      "tr",
    ) as HTMLElement;
    fireEvent.click(within(row).getByRole("button", { name: "Видалити" }));

    expect(
      await screen.findByText("Не вдалося видалити код"),
    ).toBeInTheDocument();
  });

  it("помилка відновлення доступу показує повідомлення", async () => {
    const calls = setupSupabase({
      deactivated: { data: [{ id: "user-3", email: "gone@example.com" }] },
      profileInsert: { error: { message: "denied" } },
    });
    renderAdmin();

    const row = (await screen.findByText("gone@example.com")).closest(
      "tr",
    ) as HTMLElement;
    fireEvent.click(within(row).getByRole("button", { name: "Відновити" }));

    expect(
      await screen.findByText("Не вдалося відновити доступ"),
    ).toBeInTheDocument();
    expect(calls.profileInsert).toBe(1);
  });
});
