import { addDaysISO, todayKyiv } from "../../utils/kyivDate";
import { NESTBOX_REMOVE_DAYS_AFTER_BIRTH, WEANING_SCHEME } from "./constants";
import type { Litter, Mating, Rabbit, SortType, StatusInfo } from "./types";

export function daysBetweenISO(from: string, to: string): number {
  const [fy, fm, fd] = from.split("-").map(Number);
  const [ty, tm, td] = to.split("-").map(Number);
  return Math.round(
    (Date.UTC(ty, tm - 1, td) - Date.UTC(fy, fm - 1, fd)) / 86400000,
  );
}

export function getNestboxRemovalStatus(
  birthDate: string,
  removedDate?: string | null,
): StatusInfo {
  if (removedDate) {
    return {
      text: `✅ Маточник забрано: ${new Date(removedDate).toLocaleDateString("uk-UA")}`,
      className: "nestbox-done",
    };
  }

  const target = addDaysISO(birthDate, NESTBOX_REMOVE_DAYS_AFTER_BIRTH);
  const diffDays = daysBetweenISO(todayKyiv(), target);

  if (diffDays > 2) {
    return {
      text: `📤 Забрати маточник: ${new Date(target).toLocaleDateString("uk-UA")}`,
      className: "nestbox-normal",
    };
  }
  if (diffDays === 2) {
    return {
      text: "🟡 Забрати маточник через 2 дні",
      className: "nestbox-yellow",
    };
  }
  if (diffDays === 1) {
    return { text: "🔴 Забрати маточник завтра!", className: "nestbox-red" };
  }
  if (diffDays === 0) {
    return {
      text: "🚨 СЬОГОДНІ забрати маточник!",
      className: "nestbox-red-alert",
    };
  }
  return {
    text: `⚠️ Маточник забрати пізно на ${Math.abs(diffDays)} дн.!`,
    className: "nestbox-red-alert",
  };
}

export function schemeLabel(scheme?: string): string {
  switch (scheme) {
    case "intensive":
      return "Інтенсивна";
    case "semi_intensive":
      return "Напівінтенсивна";
    default:
      return "Екстенсивна";
  }
}

export function getUpcomingInfo(
  m: Mating,
): { label: string; date: string } | null {
  const pendingLitter = (m.litters || []).find(
    (l) => !l.birth_date && !l.failure_type,
  );
  if (pendingLitter?.litter_expected_birth) {
    return {
      label: "🗓 Очік. окріл",
      date: pendingLitter.litter_expected_birth,
    };
  }
  if (pendingLitter?.litter_control_date) {
    return { label: "🔍 Контрольна", date: pendingLitter.litter_control_date };
  }
  if (!m.litters || m.litters.length === 0) {
    if (m.expected_birth) {
      return { label: "🗓 Очік. окріл", date: m.expected_birth };
    }
    if (m.control_date) {
      return { label: "🔍 Контроль", date: m.control_date };
    }
  }
  return null;
}

export function getLitterAge(birthDate: string): string {
  const birth = new Date(birthDate);
  const today = new Date();
  const days = Math.floor(
    (today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24),
  );
  const months = Math.floor(days / 30);
  const remDays = days - months * 30;
  return months >= 1
    ? remDays > 0
      ? `${months} міс. ${remDays} дн.`
      : `${months} міс.`
    : `${days} дн.`;
}

export function getWeaningInfo(birthDate: string, scheme?: string) {
  const cfg = WEANING_SCHEME[scheme || "extensive"] || WEANING_SCHEME.extensive;
  const birth = new Date(birthDate);
  const today = new Date();

  const minDate = new Date(birth);
  minDate.setDate(minDate.getDate() + cfg.min);

  const weaningDate = new Date(birth);
  weaningDate.setDate(weaningDate.getDate() + cfg.target);

  const daysToMin = Math.ceil(
    (minDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
  const daysLeft = Math.ceil(
    (weaningDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  return { daysLeft, daysToMin, minDate, weaningDate };
}

export function getNestboxStatus(
  matingDateStr: string,
  nestboxDate?: string | null,
): StatusInfo {
  if (nestboxDate) {
    return {
      text: `✅ Маточник підготовлено: ${new Date(nestboxDate).toLocaleDateString("uk-UA")}`,
      className: "nestbox-done",
    };
  }

  const matingDate = new Date(matingDateStr);
  const targetDate = new Date(matingDate);
  targetDate.setDate(targetDate.getDate() + 26); // 26-й день — за 5 днів до окролу (Merck VM: окріл 28–35 дн., найчастіше 31)

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil(
    (targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  let text = `📥 Підготувати маточник: ${targetDate.toLocaleDateString("uk-UA")}`;
  let className = "nestbox-normal";

  if (diffDays >= 3 && diffDays <= 5) {
    text = `🟢 Підготувати маточник (через ${diffDays} дн.)`;
    className = "nestbox-green";
  } else if (diffDays === 2) {
    text = `🟡 Підготувати маточник через 2 дні!`;
    className = "nestbox-yellow";
  } else if (diffDays === 1) {
    text = `🔴 Підготувати маточник завтра!`;
    className = "nestbox-red";
  } else if (diffDays === 0) {
    text = `🚨 СЬОГОДНІ підготувати маточник!`;
    className = "nestbox-red-alert";
  } else if (diffDays < 0 && diffDays >= -5) {
    text = `⚠️ Підготовка маточника запізнилась на ${Math.abs(diffDays)} дн.!`;
    className = "nestbox-red-alert";
  }

  return { text, className };
}

export function isWithin24hOfControl(controlDate?: string | null): boolean {
  if (!controlDate) return true;
  const diff = Date.now() - new Date(controlDate).getTime();
  return diff < 24 * 60 * 60 * 1000; // менше доби минуло
}

export function getRabbitName(allRabbits: Rabbit[], id: string | null): string {
  if (!id) return "";
  const r = allRabbits.find((r) => r.id === id);
  if (!r) return "невідомий";
  return `${r.name}${r.breed ? ` (${r.breed})` : ""}`;
}

/** Групує окроли за злучкою і сортує їх: старіші зверху, новіші знизу. */
export function attachLittersToMatings(
  matings: Mating[],
  litters: Litter[],
): Mating[] {
  const littersMap: Record<string, Litter[]> = {};
  litters.forEach((l) => {
    if (!littersMap[l.mating_id]) littersMap[l.mating_id] = [];
    littersMap[l.mating_id].push(l);
  });
  Object.keys(littersMap).forEach((matingId) => {
    littersMap[matingId].sort((a, b) => {
      const dateA =
        a.birth_date || a.litter_expected_birth || a.litter_mating_date || "";
      const dateB =
        b.birth_date || b.litter_expected_birth || b.litter_mating_date || "";
      return dateA.localeCompare(dateB); // старіші зверху, новіші знизу
    });
  });
  return matings.map((m) => ({ ...m, litters: littersMap[m.id] || [] }));
}

export function getSortedMatings(
  matings: Mating[],
  sortType: SortType,
): Mating[] {
  const copy = matings.filter((m) => !m.is_archived);
  if (sortType === "date_desc") {
    copy.sort(
      (a, b) =>
        new Date(b.mating_date).getTime() - new Date(a.mating_date).getTime(),
    );
  } else if (sortType === "date_asc") {
    copy.sort(
      (a, b) =>
        new Date(a.mating_date).getTime() - new Date(b.mating_date).getTime(),
    );
  } else if (sortType === "male") {
    copy.sort((a, b) => {
      const cageA = parseInt(a.female_cage || "0", 10);
      const cageB = parseInt(b.female_cage || "0", 10);
      return cageA - cageB;
    });
  }
  return copy;
}

export function getArchivedMatings(matings: Mating[]): Mating[] {
  return matings
    .filter((m) => m.is_archived)
    .sort(
      (a, b) =>
        new Date(b.mating_date).getTime() - new Date(a.mating_date).getTime(),
    );
}
