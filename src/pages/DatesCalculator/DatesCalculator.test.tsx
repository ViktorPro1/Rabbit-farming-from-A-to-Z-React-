import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DatesCalculator from "./DatesCalculator";

// Дати в калькуляторі рахуються за локальним часовим поясом.
// Фіксуємо київський, щоб результат не залежав від комп'ютера, де йдуть тести.
vi.stubEnv("TZ", "Europe/Kyiv");

vi.mock("../../components/ShareButton/ShareButton", () => ({
  default: () => null,
}));

function setup() {
  return render(
    <MemoryRouter>
      <DatesCalculator />
    </MemoryRouter>,
  );
}

describe("DatesCalculator: дати для самки", () => {
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
    calcFemale();
    expect(screen.getByText("Оберіть спосіб розрахунку.")).toBeInTheDocument();
  });

  it("поле дати з'являється тільки після вибору способу", () => {
    setup();
    expect(document.getElementById("calc-female-date-birth")).toBeNull();
    expect(document.getElementById("calc-female-date-mating")).toBeNull();
    choose("Обрати спосіб розрахунку:", "birth");
    expect(document.getElementById("calc-female-date-birth")).not.toBeNull();
    choose("Обрати спосіб розрахунку:", "mating");
    expect(screen.getByLabelText("Дата злучки:")).toBeInTheDocument();
  });

  it("без дати просить її ввести", () => {
    setup();
    choose("Обрати спосіб розрахунку:", "birth");
    calcFemale();
    expect(screen.getByText("Введіть дату.")).toBeInTheDocument();
  });

  it("від народження, середня порода, екстенсивна схема", () => {
    setup();
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
    choose("Обрати спосіб розрахунку:", "birth");
    setFemaleDate("calc-female-date-birth", "2026-01-01");
    calcFemale();
    expect(screen.getByText("Контрольна злучка:")).toBeInTheDocument();
    choose("Обрати спосіб розрахунку:", "mating");
    expect(screen.queryByText("Контрольна злучка:")).toBeNull();
  });
});

describe("DatesCalculator: дати для самця", () => {
  const calcMale = () =>
    fireEvent.click(
      screen.getByRole("button", { name: "Розрахувати період спаровування" }),
    );

  it("без дати просить її ввести", () => {
    setup();
    calcMale();
    expect(screen.getByText("Введіть дату народження.")).toBeInTheDocument();
  });

  it("початок через 150 днів, кінець через 1095 днів", () => {
    setup();
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
