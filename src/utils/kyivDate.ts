// Дати за календарем Києва.
//
// new Date().toISOString() повертає UTC, тому з 00:00 до 02:00/03:00 за Києвом
// він дає вчорашню дату (і "сьогодні" в застосунку записується вчорашнім днем).
// Функції нижче рахують календарну дату за часовим поясом Europe/Kyiv, не
// залежно від часового поясу пристрою чи сервера.

const KYIV_TIME_ZONES = ["Europe/Kyiv", "Europe/Kiev"];

function createFormatter(): Intl.DateTimeFormat {
  // Спочатку сучасна назва пояса, потім стара (для застарілих середовищ)
  for (const timeZone of KYIV_TIME_ZONES) {
    try {
      return new Intl.DateTimeFormat("en-US", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      // Середовище не знає цю назву — пробуємо наступну
    }
  }
  console.error("Часовий пояс Києва недоступний, використовується UTC");
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

const formatter = createFormatter();

/** Календарна дата моменту `date` за Києвом у форматі YYYY-MM-DD. */
export function toKyivISODate(date: Date): string {
  const parts = formatter.formatToParts(date);
  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

/** Сьогоднішня дата за Києвом у форматі YYYY-MM-DD. */
export function todayKyiv(): string {
  return toKyivISODate(new Date());
}

/**
 * Додає (або віднімає) дні до календарної дати YYYY-MM-DD.
 * Це чиста арифметика над датою без часу, тому toISOString тут безпечний:
 * рядок розбирається як UTC і повертається як UTC, часовий пояс не впливає.
 */
export function addDaysISO(isoDate: string, days: number): string {
  // slice(0, 10): якщо з бази прийшов повний timestamp, беремо лише календарну
  // дату (YYYY-MM-DD), щоб не отримати Invalid Date
  const d = new Date(`${isoDate.slice(0, 10)}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}