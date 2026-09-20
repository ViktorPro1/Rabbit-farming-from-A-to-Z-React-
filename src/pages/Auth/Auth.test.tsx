import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Auth from "./Auth";
import { supabase } from "../../lib/supabase";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );
  return { ...actual, useNavigate: () => navigateMock };
});

vi.mock("../../lib/supabase", () => ({
  supabase: {
    auth: { signInWithPassword: vi.fn(), signUp: vi.fn() },
    rpc: vi.fn(),
  },
}));

function renderAuth(returnTo?: string) {
  return render(
    <MemoryRouter>
      <Auth returnTo={returnTo} />
    </MemoryRouter>,
  );
}

function fillCredentials(email = "user@example.com", password = "secret123") {
  fireEvent.change(screen.getByPlaceholderText("Email"), {
    target: { value: email },
  });
  fireEvent.change(screen.getByPlaceholderText("Пароль"), {
    target: { value: password },
  });
}

function openRegisterTab(code = "") {
  fireEvent.click(screen.getByRole("button", { name: "Реєстрація" }));
  if (code) {
    fireEvent.change(screen.getByPlaceholderText("Інвайт код"), {
      target: { value: code },
    });
  }
}

function submit(label: string) {
  fireEvent.click(screen.getByRole("button", { name: label }));
}

function mockValidCode() {
  vi.mocked(supabase.rpc).mockResolvedValue({
    data: [{ code_exists: true, code_used: false, code_id: "code-1" }],
    error: null,
  } as never);
}

describe("Auth: вхід", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("успішний вхід переходить на returnTo", async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: {},
      error: null,
    } as never);

    renderAuth("/calculator");
    fillCredentials();
    submit("Увійти");

    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith("/calculator"));
  });

  it("неправильний пароль показує помилку і знову вмикає кнопку", async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: {},
      error: { message: "Invalid login credentials" },
    } as never);

    renderAuth();
    fillCredentials();
    submit("Увійти");

    expect(await screen.findByText("Невірний email або пароль")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Увійти" })).toBeEnabled();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("виняток (збій мережі) не залишає кнопку в стані завантаження", async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockRejectedValue(
      new Error("Network error"),
    );

    renderAuth();
    fillCredentials();
    submit("Увійти");

    expect(await screen.findByText(/Не вдалося увійти/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Увійти" })).toBeEnabled();
  });
});

describe("Auth: реєстрація", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("порожній код: помилка, жодних запитів до бази", async () => {
    renderAuth();
    openRegisterTab();
    fillCredentials();
    submit("Зареєструватись");

    expect(await screen.findByText("Введіть інвайт код")).toBeInTheDocument();
    expect(supabase.rpc).not.toHaveBeenCalled();
    expect(supabase.auth.signUp).not.toHaveBeenCalled();
  });

  it("неіснуючий код: signUp не викликається", async () => {
    vi.mocked(supabase.rpc).mockResolvedValue({
      data: [{ code_exists: false, code_used: false, code_id: null }],
      error: null,
    } as never);

    renderAuth();
    openRegisterTab("NOPE");
    fillCredentials();
    submit("Зареєструватись");

    expect(await screen.findByText(/Такого інвайт коду не існує/)).toBeInTheDocument();
    expect(supabase.auth.signUp).not.toHaveBeenCalled();
  });

  it("використаний код: signUp не викликається", async () => {
    vi.mocked(supabase.rpc).mockResolvedValue({
      data: [{ code_exists: true, code_used: true, code_id: "code-1" }],
      error: null,
    } as never);

    renderAuth();
    openRegisterTab("USED1");
    fillCredentials();
    submit("Зареєструватись");

    expect(await screen.findByText("Цей інвайт код уже використаний")).toBeInTheDocument();
    expect(supabase.auth.signUp).not.toHaveBeenCalled();
  });

  it("валідний код: signUp отримує код у метаданих, потім вхід і перехід", async () => {
    mockValidCode();
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null,
    } as never);
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: {},
      error: null,
    } as never);

    renderAuth("/registry");
    openRegisterTab("  good1 ");
    fillCredentials("new@example.com", "pass12345");
    submit("Зареєструватись");

    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith("/registry"));
    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: "new@example.com",
      password: "pass12345",
      options: { data: { invite_code: "GOOD1" } },
    });
  });

  it("клієнт більше не викликає mark_invite_code_used (це робить база)", async () => {
    mockValidCode();
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null,
    } as never);
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: {},
      error: null,
    } as never);

    renderAuth();
    openRegisterTab("GOOD1");
    fillCredentials();
    submit("Зареєструватись");

    await waitFor(() => expect(navigateMock).toHaveBeenCalled());
    const rpcNames = vi.mocked(supabase.rpc).mock.calls.map((c) => c[0]);
    expect(rpcNames).toEqual(["validate_invite_code"]);
  });

  it("база відхилила реєстрацію (код щойно використано): зрозуміле повідомлення, без переходу", async () => {
    mockValidCode();
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: null },
      error: { message: "Database error saving new user" },
    } as never);

    renderAuth();
    openRegisterTab("GOOD1");
    fillCredentials();
    submit("Зареєструватись");

    expect(await screen.findByText(/інвайт код щойно використано/)).toBeInTheDocument();
    expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Зареєструватись" })).toBeEnabled();
  });

  it("інша помилка signUp показується з текстом помилки", async () => {
    mockValidCode();
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: null },
      error: { message: "User already registered" },
    } as never);

    renderAuth();
    openRegisterTab("GOOD1");
    fillCredentials();
    submit("Зареєструватись");

    expect(
      await screen.findByText("Помилка реєстрації: User already registered"),
    ).toBeInTheDocument();
  });

  it("signUp без користувача і без помилки: повідомлення про збій, без переходу", async () => {
    mockValidCode();
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: null },
      error: null,
    } as never);

    renderAuth();
    openRegisterTab("GOOD1");
    fillCredentials();
    submit("Зареєструватись");

    expect(await screen.findByText(/Не вдалося завершити реєстрацію/)).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("реєстрація пройшла, але автоматичний вхід не вдався: перемикає на вкладку входу", async () => {
    mockValidCode();
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null,
    } as never);
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: {},
      error: { message: "Email not confirmed" },
    } as never);

    renderAuth();
    openRegisterTab("GOOD1");
    fillCredentials();
    submit("Зареєструватись");

    expect(await screen.findByText("Зареєстровано! Тепер увійдіть вручну.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Увійти" })).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("виняток під час реєстрації не залишає кнопку в стані завантаження", async () => {
    vi.mocked(supabase.rpc).mockRejectedValue(new Error("Network error"));

    renderAuth();
    openRegisterTab("GOOD1");
    fillCredentials();
    submit("Зареєструватись");

    expect(await screen.findByText(/Не вдалося зареєструватись/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Зареєструватись" })).toBeEnabled();
  });
});
