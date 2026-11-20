// Вік тварини за календарними місяцями (а не "місяць = 30 днів").
// Працює з датою у форматі "YYYY-MM-DD" (так її віддає Supabase) або з Date.

export interface RabbitAge {
  years: number;
  months: number; // залишок місяців після років (0-11)
  days: number;   // залишок днів після повних місяців
  totalMonths: number;
}

// Дата без часу в UTC, щоб літній/зимовий час не додавав зайву годину.
function toUtcDay(value: string | Date): number {
  if (typeof value === "string") {
    const [y, m, d] = value.slice(0, 10).split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  }
  return Date.UTC(value.getFullYear(), value.getMonth(), value.getDate());
}

// Додає місяці до дати; якщо в місяці-результаті немає такого дня (31 -> лютий),
// бере останній день місяця.
function addMonthsUtc(day: number, months: number): number {
  const d = new Date(day);
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth() + months;
  const lastDay = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  return Date.UTC(y, m, Math.min(d.getUTCDate(), lastDay));
}

export function getRabbitAge(birth: string | Date, today: string | Date = new Date()): RabbitAge {
  const b = toUtcDay(birth);
  const t = toUtcDay(today);
  if (t < b) return { years: 0, months: 0, days: 0, totalMonths: 0 };

  const bd = new Date(b);
  const td = new Date(t);
  let total = (td.getUTCFullYear() - bd.getUTCFullYear()) * 12 + (td.getUTCMonth() - bd.getUTCMonth());
  if (addMonthsUtc(b, total) > t) total -= 1;

  const days = Math.round((t - addMonthsUtc(b, total)) / 86400000);
  return { years: Math.floor(total / 12), months: total % 12, days, totalMonths: total };
}

// "5 міс. 5 дн." / "6 міс." / "1 р. 7 міс." / "1 р." / "12 дн."
export function formatRabbitAge(birth: string | Date, today: string | Date = new Date()): string {
  const { years, months, days } = getRabbitAge(birth, today);
  if (years > 0) return months > 0 ? `${years} р. ${months} міс.` : `${years} р.`;
  if (months > 0) return days > 0 ? `${months} міс. ${days} дн.` : `${months} міс.`;
  return `${days} дн.`;
}
