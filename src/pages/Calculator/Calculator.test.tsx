import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import Calculator from "./Calculator";
import { supabase } from "../../lib/supabase";
import { logError } from "../../lib/logError";

// Дати в калькуляторі рахуються за локальним часовим поясом.
// Фіксуємо київський, щоб результат не залежав від комп'ютера, де йдуть тести.
vi.stubEnv("TZ", "Europe/Kyiv");

vi.mock("../../lib/supabase", () => ({
  supabase: { from: vi.fn() },
}));

vi.mock("../../lib/logError", () => ({ logError: vi.fn() }));

vi.mock("../../components/ShareButton/ShareButton", () => ({
  default: () => null,
}));

const session = { user: { id: "user-1" } } as Session;

function setup() {
  return render(
    <MemoryRouter>
      <Calculator session={session} />
    </MemoryRouter>,
  );
}

interface Row {
  name: string;
  pct: string;
  kg: string;
}

/** Рядки рецепта (без блоку добавок для гранулятора). */
function recipeRows(container: HTMLElement): Row[] {
  return Array.from(container.querySelectorAll(".result-row"))
    .filter((row) => !row.closest(".granulator-block"))
    .map((row) => ({
      name: row.querySelector(".result-name")?.textContent ?? "",
      pct: row.querySelector(".result-pct")?.textContent ?? "",
      kg: row.querySelector(".result-kg")?.textContent ?? "",
    }));
}

/** Рядки блоку добавок гранулятора. */
function additiveRows(container: HTMLElement): Row[] {
  return Array.from(
    container.querySelectorAll(".granulator-block .result-row"),
  ).map((row) => ({
    name: row.querySelector(".result-name")?.textContent ?? "",
    pct: row.querySelector(".result-pct")?.textContent ?? "",
    kg: row.querySelector(".result-kg")?.textContent ?? "",
  }));
}

const checkbox = (name: RegExp) => screen.getByRole("checkbox", { name });
const calcGrain = () =>
  fireEvent.click(screen.getByRole("button", { name: "Розрахувати рецепт" }));
const weightInput = () => screen.getByRole("spinbutton") as HTMLInputElement;
const setWeight = (value: string) =>
  fireEvent.change(weightInput(), { target: { value } });

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Calculator: вкладки", () => {
  it("за замовчуванням відкрита зернова суміш", () => {
    setup();
    expect(screen.getByText("Оберіть зернові")).toBeInTheDocument();
    expect(screen.queryByText("🐰 Кроличка (самка)")).not.toBeInTheDocument();
  });

  it("перемикається на дати розведення і назад", () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /Дати розведення/ }));
    expect(screen.getByText("🐰 Кроличка (самка)")).toBeInTheDocument();
    expect(screen.queryByText("Оберіть зернові")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Зернова суміш/ }));
    expect(screen.getByText("Оберіть зернові")).toBeInTheDocument();
  });
});

describe("Calculator: зернова суміш, племінне стадо", () => {
  it("за замовчуванням вибрані овес, ячмінь і пшениця", () => {
    setup();
    expect(checkbox(/Овес/)).toBeChecked();
    expect(checkbox(/Ячмінь/)).toBeChecked();
    expect(checkbox(/Пшениця/)).toBeChecked();
    expect(checkbox(/Горох/)).not.toBeChecked();
    expect(checkbox(/Соєва макуха/)).not.toBeChecked();
  });

  it("до розрахунку результату немає", () => {
    const { container } = setup();
    expect(recipeRows(container)).toEqual([]);
  });

  it("ділить 10 кг між овесом, ячменем і пшеницею пропорційно 40 : 56 : 33", () => {
    const { container } = setup();
    calcGrain();
    // 10 кг: овес 3,10 → 3, ячмінь 4,34 → 4,5, пшениця 2,56 → 2,5 (крок 0,5 кг)
    expect(recipeRows(container)).toEqual([
      { name: "Овес", pct: "31.0%", kg: "3 кг" },
      { name: "Ячмінь", pct: "43.4%", kg: "4.5 кг" },
      { name: "Пшениця", pct: "25.6%", kg: "2.5 кг" },
    ]);
    expect(screen.getByText("Результат — 10 кг суміші")).toBeInTheDocument();
  });

  it("сума кілограмів завжди дорівнює вазі суміші", () => {
    const { container } = setup();
    for (const weight of ["1", "7", "10", "13", "25", "37", "100"]) {
      setWeight(weight);
      calcGrain();
      const sum = recipeRows(container).reduce(
        (acc, r) => acc + parseFloat(r.kg),
        0,
      );
      expect(sum).toBeCloseTo(Number(weight), 5);
    }
  });

  it("додає горох у розрахунок, якщо його вибрати", () => {
    const { container } = setup();
    fireEvent.click(checkbox(/Горох/));
    calcGrain();
    const names = recipeRows(container).map((r) => r.name);
    expect(names).toEqual(["Овес", "Ячмінь", "Пшениця", "Горох"]);
  });

  it("прибирає зерно з розрахунку, якщо зняти позначку", () => {
    const { container } = setup();
    fireEvent.click(checkbox(/Овес/));
    calcGrain();
    expect(recipeRows(container).map((r) => r.name)).toEqual([
      "Ячмінь",
      "Пшениця",
    ]);
  });
});

describe("Calculator: перевірка введених даних", () => {
  it("нульова вага: помилка і немає результату", () => {
    const { container } = setup();
    setWeight("0");
    calcGrain();
    expect(screen.getByText("Введіть правильну вагу!")).toBeInTheDocument();
    expect(recipeRows(container)).toEqual([]);
  });

  it("порожнє поле ваги теж помилка", () => {
    setup();
    setWeight("");
    calcGrain();
    expect(screen.getByText("Введіть правильну вагу!")).toBeInTheDocument();
  });

  it("від'ємна вага: помилка", () => {
    setup();
    setWeight("-5");
    calcGrain();
    expect(screen.getByText("Введіть правильну вагу!")).toBeInTheDocument();
  });

  it("без жодного зерна: помилка і немає результату", () => {
    const { container } = setup();
    fireEvent.click(checkbox(/Овес/));
    fireEvent.click(checkbox(/Ячмінь/));
    fireEvent.click(checkbox(/Пшениця/));
    calcGrain();
    expect(screen.getByText("Оберіть хоча б одне зерно!")).toBeInTheDocument();
    expect(recipeRows(container)).toEqual([]);
  });

  it("правильні дані після помилки прибирають повідомлення", () => {
    setup();
    setWeight("0");
    calcGrain();
    expect(screen.getByText("Введіть правильну вагу!")).toBeInTheDocument();
    setWeight("10");
    calcGrain();
    expect(
      screen.queryByText("Введіть правильну вагу!"),
    ).not.toBeInTheDocument();
  });

  it("кнопка «мінус» не опускає вагу нижче 1 кг", () => {
    setup();
    const minus = screen.getByRole("button", { name: "−" });
    for (let i = 0; i < 15; i += 1) fireEvent.click(minus);
    expect(weightInput().value).toBe("1");
  });

  it("кнопка «плюс» додає по 1 кг", () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: "+" }));
    expect(weightInput().value).toBe("11");
  });
});

describe("Calculator: висівка", () => {
  it("забирає третину кілограмів у пшениці й додає окремим рядком", () => {
    const { container } = setup();
    fireEvent.click(checkbox(/Висівка/));
    calcGrain();
    // Пшениця 2,5 кг: висівка = 2,5 / 3 = 0,83 → 1 кг, пшениці лишається 1,5 кг
    expect(recipeRows(container)).toEqual([
      { name: "Овес", pct: "31.0%", kg: "3 кг" },
      { name: "Ячмінь", pct: "43.4%", kg: "4.5 кг" },
      { name: "Пшениця", pct: "15.0%", kg: "1.5 кг" },
      { name: "Висівка/Ґрис", pct: "10.0%", kg: "1 кг" },
    ]);
  });

  it("без пшениці висівку не додає і попереджає", () => {
    const { container } = setup();
    fireEvent.click(checkbox(/Пшениця/));
    fireEvent.click(checkbox(/Висівка/));
    calcGrain();
    expect(
      screen.getByText(/Висівка вибрана, але пшениця не вибрана/),
    ).toBeInTheDocument();
    // Овес і ячмінь ділять 10 кг як 40 : 56 → 4 і 6
    expect(recipeRows(container)).toEqual([
      { name: "Овес", pct: "41.7%", kg: "4 кг" },
      { name: "Ячмінь", pct: "58.3%", kg: "6 кг" },
    ]);
  });
});

describe("Calculator: макуха", () => {
  it("одна макуха займає 10% суміші, решта ділиться між зерновими", () => {
    const { container } = setup();
    fireEvent.click(checkbox(/Соєва макуха/));
    calcGrain();
    // Макуха 1 кг. На зернові 9 кг: 3 + 4 + 2,5 = 9,5, надлишок 0,5
    // віднімається від найбільшого (ячмінь): 3,5
    expect(recipeRows(container)).toEqual([
      { name: "Овес", pct: "27.9%", kg: "3 кг" },
      { name: "Ячмінь", pct: "39.1%", kg: "3.5 кг" },
      { name: "Пшениця", pct: "23.0%", kg: "2.5 кг" },
      { name: "Соєва макуха", pct: "10.0%", kg: "1 кг" },
    ]);
    expect(screen.queryByText(/макуха вибрані разом/)).not.toBeInTheDocument();
  });

  it("дві макухи ділять ці 10% порівну і дають повідомлення", () => {
    const { container } = setup();
    fireEvent.click(checkbox(/Соєва макуха/));
    fireEvent.click(checkbox(/Соняшникова макуха/));
    calcGrain();
    const rows = recipeRows(container);
    const soy = rows.find((r) => r.name === "Соєва макуха");
    const sun = rows.find((r) => r.name === "Соняшникова макуха");
    expect(soy).toEqual({ name: "Соєва макуха", pct: "5.0%", kg: "0.5 кг" });
    expect(sun).toEqual({
      name: "Соняшникова макуха",
      pct: "5.0%",
      kg: "0.5 кг",
    });
    expect(screen.getByText(/макуха вибрані разом/)).toBeInTheDocument();
  });

  it("сума з макухою теж дорівнює вазі суміші", () => {
    const { container } = setup();
    fireEvent.click(checkbox(/Соєва макуха/));
    for (const weight of ["3", "10", "17", "50"]) {
      setWeight(weight);
      calcGrain();
      const sum = recipeRows(container).reduce(
        (acc, r) => acc + parseFloat(r.kg),
        0,
      );
      expect(sum).toBeCloseTo(Number(weight), 5);
    }
  });
});

describe("Calculator: відгодівля", () => {
  function openFattening() {
    fireEvent.click(screen.getByRole("button", { name: /Відгодівля/ }));
  }

  it("має свій набір вибраного: ячмінь, пшениця, кукурудза, овес", () => {
    setup();
    openFattening();
    expect(checkbox(/Ячмінь/)).toBeChecked();
    expect(checkbox(/Пшениця/)).toBeChecked();
    expect(checkbox(/Кукурудза/)).toBeChecked();
    expect(checkbox(/Овес/)).toBeChecked();
    expect(checkbox(/Горох/)).not.toBeChecked();
  });

  it("ділить 10 кг у пропорції 40 : 20 : 15 : 15", () => {
    const { container } = setup();
    openFattening();
    calcGrain();
    // Ячмінь 4,44 → 4,5; пшениця 2,22 → 2; кукурудза 1,67 → 1,5; овес 1,5.
    // Сума 9,5, не вистачає 0,5: додаємо до найбільшого (ячмінь) = 5
    expect(recipeRows(container)).toEqual([
      { name: "Ячмінь", pct: "44.4%", kg: "5 кг" },
      { name: "Пшениця", pct: "22.2%", kg: "2 кг" },
      { name: "Кукурудза", pct: "16.7%", kg: "1.5 кг" },
      { name: "Овес", pct: "16.7%", kg: "1.5 кг" },
    ]);
  });

  it("вибір у режимах не змішується", () => {
    setup();
    fireEvent.click(checkbox(/Горох/));
    openFattening();
    expect(checkbox(/Горох/)).not.toBeChecked();
    fireEvent.click(screen.getByRole("button", { name: /Племінне стадо/ }));
    expect(checkbox(/Горох/)).toBeChecked();
  });

  it("перемикання режиму прибирає старий результат і помилку", () => {
    const { container } = setup();
    calcGrain();
    expect(recipeRows(container).length).toBeGreaterThan(0);
    openFattening();
    expect(recipeRows(container)).toEqual([]);

    setWeight("0");
    calcGrain();
    expect(screen.getByText("Введіть правильну вагу!")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Племінне стадо/ }));
    expect(
      screen.queryByText("Введіть правильну вагу!"),
    ).not.toBeInTheDocument();
  });
});

describe("Calculator: добавки для гранулятора", () => {
  function withGranulator() {
    const view = setup();
    calcGrain();
    fireEvent.click(screen.getByRole("checkbox", { name: "Є гранулятор" }));
    return view;
  }

  it("блок добавок з'являється тільки після позначки «Є гранулятор»", () => {
    const { container } = setup();
    calcGrain();
    expect(container.querySelector(".granulator-block")).toBeNull();
    fireEvent.click(screen.getByRole("checkbox", { name: "Є гранулятор" }));
    expect(container.querySelector(".granulator-block")).not.toBeNull();
  });

  it("для 10 кг зерна з люцерною: люцерна 2 кг, сіль 60 г, премікс 120 г", () => {
    const { container } = withGranulator();
    // Люцерна 20% від зерна = 2 кг. Усього 12 кг: сіль 0,5% = 60 г,
    // премікс 1% = 120 г, вода 8–12% = 0,96–1,44 л (округлено 1–1,4)
    expect(additiveRows(container)).toEqual([
      { name: "Люцерна подрібнена", pct: "20%", kg: "2 кг" },
      { name: "Сіль кухонна", pct: "0.5%", kg: "60 г" },
      { name: "Премікс", pct: "1%", kg: "120 г" },
      { name: "Вода", pct: "8–12%", kg: "1–1.4 л" },
    ]);
  });

  it("без люцерни добавки рахуються від ваги зерна", () => {
    const { container } = withGranulator();
    fireEvent.click(screen.getByRole("checkbox", { name: /Є люцерна/ }));
    expect(additiveRows(container)).toEqual([
      { name: "Люцерна подрібнена", pct: "0%", kg: "—" },
      { name: "Сіль кухонна", pct: "0.5%", kg: "50 г" },
      { name: "Премікс", pct: "1%", kg: "100 г" },
      { name: "Вода", pct: "8–12%", kg: "0.8–1.2 л" },
    ]);
  });

  it("добавки змінюються разом із вагою суміші", () => {
    const { container } = withGranulator();
    setWeight("20");
    // Люцерна 4 кг, усього 24 кг: сіль 120 г, премікс 240 г
    const rows = additiveRows(container);
    expect(rows[0].kg).toBe("4 кг");
    expect(rows[1].kg).toBe("120 г");
    expect(rows[2].kg).toBe("240 г");
  });

  it("підказка внизу залежить від наявності люцерни", () => {
    withGranulator();
    expect(
      screen.getByText(/окрема люцерна, зернова суміш і сіль-лизунець/),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("checkbox", { name: /Є люцерна/ }));
    expect(
      screen.getByText(/в гранулі немає люцерни, сіно в клітці залишається/),
    ).toBeInTheDocument();
  });
});

describe("Calculator: збереження рецепта", () => {
  const insert = vi.fn();

  beforeEach(() => {
    insert.mockReset();
    insert.mockResolvedValue({ error: null });
    vi.mocked(supabase.from).mockReturnValue({ insert } as never);
  });

  const save = () =>
    fireEvent.click(screen.getByRole("button", { name: /Додати відмітку/ }));

  it("кнопки збереження немає, поки рецепт не розраховано", () => {
    setup();
    expect(
      screen.queryByRole("button", { name: /Додати відмітку/ }),
    ).not.toBeInTheDocument();
  });

  it("зберігає рецепт без гранулятора", async () => {
    setup();
    calcGrain();
    save();
    await waitFor(() =>
      expect(screen.getByText("Відмітку додано!")).toBeInTheDocument(),
    );
    expect(supabase.from).toHaveBeenCalledWith("grain_recipes");
    expect(insert).toHaveBeenCalledWith({
      user_id: "user-1",
      mode: "breeding",
      total_kg: 10,
      items: [
        { name: "Овес", icon: "🌾", kg: 3, pct: 31 },
        { name: "Ячмінь", icon: "🌾", kg: 4.5, pct: 43.4 },
        { name: "Пшениця", icon: "🌾", kg: 2.5, pct: 25.6 },
      ],
      lucerne_kg: null,
      salt_g: null,
      premix_g: null,
    });
  });

  it("із гранулятором і люцерною додає люцерну до рецепта і до загальної ваги", async () => {
    setup();
    calcGrain();
    fireEvent.click(screen.getByRole("checkbox", { name: "Є гранулятор" }));
    save();
    await waitFor(() =>
      expect(screen.getByText("Відмітку додано!")).toBeInTheDocument(),
    );
    const payload = insert.mock.calls[0][0];
    expect(payload.total_kg).toBe(12);
    expect(payload.lucerne_kg).toBe(2);
    expect(payload.salt_g).toBe(60);
    expect(payload.premix_g).toBe(120);
    expect(payload.items.at(-1)).toEqual({
      name: "Люцерна подрібнена",
      icon: "🌿",
      kg: 2,
      pct: null,
    });
    expect(payload.items).toHaveLength(4);
  });

  it("із гранулятором без люцерни зберігає сіль і премікс, але не люцерну", async () => {
    setup();
    calcGrain();
    fireEvent.click(screen.getByRole("checkbox", { name: "Є гранулятор" }));
    fireEvent.click(screen.getByRole("checkbox", { name: /Є люцерна/ }));
    save();
    await waitFor(() =>
      expect(screen.getByText("Відмітку додано!")).toBeInTheDocument(),
    );
    const payload = insert.mock.calls[0][0];
    expect(payload.total_kg).toBe(10);
    expect(payload.lucerne_kg).toBeNull();
    expect(payload.salt_g).toBe(50);
    expect(payload.premix_g).toBe(100);
    expect(payload.items).toHaveLength(3);
  });

  it("зберігає режим відгодівлі", async () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /Відгодівля/ }));
    calcGrain();
    save();
    await waitFor(() => expect(insert).toHaveBeenCalled());
    expect(insert.mock.calls[0][0].mode).toBe("fattening");
  });

  it("при помилці бази показує повідомлення і пише в журнал", async () => {
    insert.mockResolvedValue({ error: { message: "db down" } });
    setup();
    calcGrain();
    save();
    await waitFor(() =>
      expect(
        screen.getByText("Помилка збереження. Спробуйте ще раз."),
      ).toBeInTheDocument(),
    );
    expect(logError).toHaveBeenCalledWith(
      "Calculator.handleSaveRecipe",
      expect.anything(),
    );
    expect(screen.queryByText("Відмітку додано!")).not.toBeInTheDocument();
  });

  it("під час збереження кнопка заблокована", async () => {
    let finish: (v: { error: null }) => void = () => {};
    insert.mockReturnValue(
      new Promise((resolve) => {
        finish = resolve;
      }),
    );
    setup();
    calcGrain();
    save();
    const busy = await screen.findByRole("button", { name: "Збереження..." });
    expect(busy).toBeDisabled();
    finish({ error: null });
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /Додати відмітку/ }),
      ).toBeEnabled(),
    );
  });
});

describe("Calculator: довідка по зернових", () => {
  it("таблиця схована, поки не натиснути заголовок", () => {
    setup();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: /Довідка по зернових/ }),
    );
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("🌾 Овес")).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: /Довідка по зернових/ }),
    );
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
});

describe("Calculator: дати для самки", () => {
  function openDates() {
    fireEvent.click(screen.getByRole("button", { name: /Дати розведення/ }));
  }

  const choose = (label: string, value: string) =>
    fireEvent.change(screen.getByLabelText(label), { target: { value } });

  const setFemaleDate = (id: string, value: string) =>
    fireEvent.change(document.getElementById(id) as HTMLElement, {
      target: { value },
    });

  const calcFemale = () =>
    fireEvent.click(screen.getByRole("button", { name: "Розрахувати дати" }));

  /** Значення з рядка результату за його підписом. */
  const rowValue = (label: string) => {
    const row = screen.getByText(label).closest(".calc-row");
    return row?.querySelector("strong")?.textContent;
  };

  it("без вибору способу розрахунку просить його обрати", () => {
    setup();
    openDates();
    calcFemale();
    expect(screen.getByText("Оберіть спосіб розрахунку.")).toBeInTheDocument();
  });

  it("поле дати з'являється тільки після вибору способу", () => {
    setup();
    openDates();
    expect(document.getElementById("calc-female-date-birth")).toBeNull();
    expect(document.getElementById("calc-female-date-mating")).toBeNull();
    choose("Обрати спосіб розрахунку:", "birth");
    expect(document.getElementById("calc-female-date-birth")).not.toBeNull();
    choose("Обрати спосіб розрахунку:", "mating");
    expect(screen.getByLabelText("Дата злучки:")).toBeInTheDocument();
  });

  it("без дати просить її ввести", () => {
    setup();
    openDates();
    choose("Обрати спосіб розрахунку:", "birth");
    calcFemale();
    expect(screen.getByText("Введіть дату.")).toBeInTheDocument();
  });

  it("від народження, середня порода, екстенсивна схема", () => {
    setup();
    openDates();
    choose("Обрати спосіб розрахунку:", "birth");
    setFemaleDate("calc-female-date-birth", "2026-01-01");
    calcFemale();
    // Готова через 135 днів, контроль +7, окріл +31, відлучення +60, наступна +14
    expect(rowValue("Дата готовності до першої злучки:")).toBe("16.05.2026");
    expect(rowValue("Контрольна злучка:")).toBe("23.05.2026");
    expect(rowValue("Очікувана дата окролу:")).toBe("16.06.2026");
    expect(rowValue("Дата відлучення малюків:")).toBe("15.08.2026");
    expect(rowValue("Наступна злучка після відлучення:")).toBe("29.08.2026");
  });

  it.each([
    ["small", "01.05.2026"],
    ["medium_large", "16.05.2026"],
    ["giant", "30.07.2026"],
  ])("розмір породи %s: готовність до злучки %s", (size, expected) => {
    setup();
    openDates();
    choose("Обрати спосіб розрахунку:", "birth");
    choose("Розмір породи:", size);
    setFemaleDate("calc-female-date-birth", "2026-01-01");
    calcFemale();
    expect(rowValue("Дата готовності до першої злучки:")).toBe(expected);
  });

  it.each([
    ["intensive", "14.07.2026", "18.06.2026"],
    ["semi_intensive", "31.07.2026", "28.06.2026"],
    ["extensive", "15.08.2026", "29.08.2026"],
  ])("схема %s: відлучення %s, наступна злучка %s", (scheme, weaning, next) => {
    setup();
    openDates();
    choose("Обрати спосіб розрахунку:", "birth");
    choose("Схема злучування:", scheme);
    setFemaleDate("calc-female-date-birth", "2026-01-01");
    calcFemale();
    // Окріл у всіх схем 16.06.2026
    expect(rowValue("Очікувана дата окролу:")).toBe("16.06.2026");
    expect(rowValue("Дата відлучення малюків:")).toBe(weaning);
    expect(rowValue("Наступна злучка після відлучення:")).toBe(next);
  });

  it("від дати злучки: без рядка готовності, але з попередженням про вік", () => {
    setup();
    openDates();
    choose("Обрати спосіб розрахунку:", "mating");
    setFemaleDate("calc-female-date-mating", "2026-03-01");
    calcFemale();
    // Перехід на літній час 29 березня не зсуває дату на день
    expect(rowValue("Контрольна злучка:")).toBe("08.03.2026");
    expect(rowValue("Очікувана дата окролу:")).toBe("01.04.2026");
    expect(rowValue("Дата відлучення малюків:")).toBe("31.05.2026");
    expect(rowValue("Наступна злучка після відлучення:")).toBe("14.06.2026");
    expect(screen.queryByText("Дата готовності до першої злучки:")).toBeNull();
    expect(
      screen.getByText(/Мінімальний вік для злучки/, { exact: false }),
    ).toHaveTextContent("5 міс.");
  });

  it.each([
    ["small", "4 міс."],
    ["medium_large", "5 міс."],
    ["giant", "7 міс."],
  ])("мінімальний вік для породи %s: %s", (size, months) => {
    setup();
    openDates();
    choose("Обрати спосіб розрахунку:", "mating");
    choose("Розмір породи:", size);
    setFemaleDate("calc-female-date-mating", "2026-03-01");
    calcFemale();
    expect(screen.getByText(/Мінімальний вік для злучки/)).toHaveTextContent(
      months,
    );
  });

  it("зміна способу розрахунку прибирає старий результат", () => {
    setup();
    openDates();
    choose("Обрати спосіб розрахунку:", "birth");
    setFemaleDate("calc-female-date-birth", "2026-01-01");
    calcFemale();
    expect(screen.getByText("Контрольна злучка:")).toBeInTheDocument();
    choose("Обрати спосіб розрахунку:", "mating");
    expect(screen.queryByText("Контрольна злучка:")).toBeNull();
  });
});

describe("Calculator: дати для самця", () => {
  function openDates() {
    fireEvent.click(screen.getByRole("button", { name: /Дати розведення/ }));
  }

  const calcMale = () =>
    fireEvent.click(
      screen.getByRole("button", { name: "Розрахувати період спаровування" }),
    );

  it("без дати просить її ввести", () => {
    setup();
    openDates();
    calcMale();
    expect(screen.getByText("Введіть дату народження.")).toBeInTheDocument();
  });

  it("початок через 150 днів, кінець через 1095 днів", () => {
    setup();
    openDates();
    const input = document.getElementById("calc-male-date") as HTMLElement;
    fireEvent.change(input, { target: { value: "2026-01-01" } });
    calcMale();
    const start = screen
      .getByText("Вік для початку спаровування:")
      .closest(".calc-row");
    const end = screen
      .getByText("Рекомендований період до:")
      .closest(".calc-row");
    // 1 січня 2026 + 150 днів = 31 травня 2026
    expect(start?.querySelector("strong")?.textContent).toBe("31.05.2026");
    // + 1095 днів = 31 грудня 2028 (2028 високосний)
    expect(end?.querySelector("strong")?.textContent).toBe("31.12.2028");
  });
});
