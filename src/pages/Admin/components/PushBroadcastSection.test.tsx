import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PushBroadcastSection } from "./PushBroadcastSection";

const fetchMock = vi.fn();

function setup() {
  return render(<PushBroadcastSection accessToken="admin-token" />);
}

const titleInput = () => screen.getByLabelText(/Заголовок/) as HTMLInputElement;
const bodyInput = () => screen.getByLabelText(/Текст/) as HTMLTextAreaElement;
const urlInput = () => screen.getByLabelText(/Посилання/) as HTMLInputElement;
const sendButton = () =>
  screen.getByRole("button", { name: /Надіслати всім|Надсилаю/ });

function fill(title = "Нова функція", body = "Додали калькулятор", url = "") {
  fireEvent.change(titleInput(), { target: { value: title } });
  fireEvent.change(bodyInput(), { target: { value: body } });
  fireEvent.change(urlInput(), { target: { value: url } });
}

function respond(status: number, json: unknown = {}) {
  fetchMock.mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => json,
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(window, "confirm").mockReturnValue(true);
  respond(200, { sent: 12, total: 14 });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("PushBroadcastSection: форма", () => {
  it("показує заголовок блоку і три поля", () => {
    setup();
    expect(screen.getByText(/Розсилка push-сповіщень/)).toBeInTheDocument();
    expect(titleInput()).toBeInTheDocument();
    expect(bodyInput()).toBeInTheDocument();
    expect(urlInput()).toBeInTheDocument();
  });

  it("кнопка заблокована, поки порожні заголовок або текст", () => {
    setup();
    expect(sendButton()).toBeDisabled();
    fireEvent.change(titleInput(), { target: { value: "Заголовок" } });
    expect(sendButton()).toBeDisabled();
    fireEvent.change(bodyInput(), { target: { value: "Текст" } });
    expect(sendButton()).toBeEnabled();
  });

  it("поля з самих пробілів не рахуються заповненими", () => {
    setup();
    fill("   ", "   ");
    expect(sendButton()).toBeDisabled();
  });

  it("поля мають обмеження довжини, як на сервері (100 і 500)", () => {
    setup();
    expect(titleInput().maxLength).toBe(100);
    expect(bodyInput().maxLength).toBe(500);
  });

  it("показує лічильники символів", () => {
    setup();
    expect(screen.getByText("0/100")).toBeInTheDocument();
    expect(screen.getByText("0/500")).toBeInTheDocument();
    fireEvent.change(titleInput(), { target: { value: "Привіт" } });
    expect(screen.getByText("6/100")).toBeInTheDocument();
  });
});

describe("PushBroadcastSection: надсилання", () => {
  it("надсилає запит із токеном адміна і правильним тілом", async () => {
    setup();
    fill("Нова функція", "Додали калькулятор", "/calculator");
    fireEvent.click(sendButton());
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/send-notification");
    expect(options.method).toBe("POST");
    expect(options.headers).toEqual({
      "Content-Type": "application/json",
      Authorization: "Bearer admin-token",
    });
    expect(JSON.parse(options.body)).toEqual({
      title: "Нова функція",
      body: "Додали калькулятор",
      url: "/calculator",
    });
  });

  it("не передає секретного ключа розсилки", async () => {
    setup();
    fill();
    fireEvent.click(sendButton());
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(fetchMock.mock.calls[0][1].headers).not.toHaveProperty(
      "x-push-secret",
    );
  });

  it("без посилання поле url у запит не потрапляє", async () => {
    setup();
    fill("Заголовок", "Текст", "");
    fireEvent.click(sendButton());
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      title: "Заголовок",
      body: "Текст",
    });
  });

  it("обрізає зайві пробіли навколо полів", async () => {
    setup();
    fill("  Заголовок  ", "  Текст  ", "  /matings  ");
    fireEvent.click(sendButton());
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      title: "Заголовок",
      body: "Текст",
      url: "/matings",
    });
  });

  it("питає підтвердження перед розсилкою всім", async () => {
    setup();
    fill();
    fireEvent.click(sendButton());
    expect(window.confirm).toHaveBeenCalledWith(
      "Надіслати це сповіщення ВСІМ користувачам?",
    );
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
  });

  it("без підтвердження нічого не надсилає і лишає текст у полях", () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    setup();
    fill("Заголовок", "Текст");
    fireEvent.click(sendButton());
    expect(fetchMock).not.toHaveBeenCalled();
    expect(titleInput().value).toBe("Заголовок");
    expect(bodyInput().value).toBe("Текст");
  });

  it("після успіху показує, скільком підпискам надіслано, і очищає форму", async () => {
    setup();
    fill("Заголовок", "Текст", "/matings");
    fireEvent.click(sendButton());
    expect(await screen.findByText("Надіслано: 12 з 14 підписок.")).toBeInTheDocument();
    expect(titleInput().value).toBe("");
    expect(bodyInput().value).toBe("");
    expect(urlInput().value).toBe("");
    expect(sendButton()).toBeDisabled();
  });

  it("під час надсилання кнопка заблокована і не дає надіслати вдруге", async () => {
    let finish: (v: unknown) => void = () => {};
    fetchMock.mockReturnValue(
      new Promise((resolve) => {
        finish = resolve;
      }),
    );
    setup();
    fill();
    fireEvent.click(sendButton());
    const busy = await screen.findByRole("button", { name: "Надсилаю..." });
    expect(busy).toBeDisabled();
    fireEvent.click(busy);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    finish({ ok: true, status: 200, json: async () => ({ sent: 1, total: 1 }) });
    expect(await screen.findByText(/Надіслано: 1 з 1/)).toBeInTheDocument();
  });
});

describe("PushBroadcastSection: перевірка посилання", () => {
  it.each(["javascript:alert(1)", "http://example.com", "//evil.com", "matings"])(
    "посилання «%s» не відправляється, показується пояснення",
    (badUrl) => {
      setup();
      fill("Заголовок", "Текст", badUrl);
      fireEvent.click(sendButton());
      expect(fetchMock).not.toHaveBeenCalled();
      expect(window.confirm).not.toHaveBeenCalled();
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Посилання має починатися з",
      );
    },
  );

  it.each(["/", "/matings", "https://example.com/page"])(
    "посилання «%s» дозволене",
    async (goodUrl) => {
      setup();
      fill("Заголовок", "Текст", goodUrl);
      fireEvent.click(sendButton());
      await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    },
  );
});

describe("PushBroadcastSection: помилки", () => {
  it("400: просить перевірити поля, форма лишається заповненою", async () => {
    respond(400, { error: "title is required" });
    setup();
    fill("Заголовок", "Текст");
    fireEvent.click(sendButton());
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Сервер відхилив дані",
    );
    expect(titleInput().value).toBe("Заголовок");
  });

  it("401: повідомляє про відсутність прав", async () => {
    respond(401);
    setup();
    fill();
    fireEvent.click(sendButton());
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Немає прав на розсилку",
    );
  });

  it("500: загальне повідомлення, текст не втрачається", async () => {
    respond(500);
    setup();
    fill("Заголовок", "Текст");
    fireEvent.click(sendButton());
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Не вдалося надіслати. Спробуйте ще раз.",
    );
    expect(bodyInput().value).toBe("Текст");
  });

  it("збій мережі: повідомлення про з'єднання, кнопка знову доступна", async () => {
    fetchMock.mockRejectedValue(new Error("network down"));
    setup();
    fill();
    fireEvent.click(sendButton());
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Перевірте з'єднання",
    );
    expect(sendButton()).toBeEnabled();
  });

  it("нова спроба прибирає старе повідомлення про помилку", async () => {
    respond(500);
    setup();
    fill();
    fireEvent.click(sendButton());
    await screen.findByRole("alert");

    respond(200, { sent: 3, total: 3 });
    fireEvent.click(sendButton());
    await screen.findByText("Надіслано: 3 з 3 підписок.");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
