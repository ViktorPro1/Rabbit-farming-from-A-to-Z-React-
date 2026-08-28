import { supabase } from "../lib/supabase";

export type CalendarEventType =
    | "mating"
    | "matingControl"
    | "expectedBirth"
    | "nestbox"
    | "paddockMating"
    | "paddockControl"
    | "paddockExpectedBirth"
    | "paddockNestbox"
    | "kindling"
    | "paddockKindling"
    | "weaning"
    | "weaningExpected"
    | "paddockWeaning"
    | "vaccination"
    | "vaccinationNext"
    | "treatment"
    | "treatmentNext"
    | "disinfection"
    | "disinfectionNext"
    | "slaughterPlanned"
    | "slaughterActual"
    | "quarantineEnd"
    | "weighing"
    | "sale";

export interface CalendarEvent {
    id: string;
    date: string; // YYYY-MM-DD
    type: CalendarEventType;
    icon: string;
    title: string;
    subject: string;
    path: string;
}

interface EventDef {
    type: CalendarEventType;
    icon: string;
    title: string;
    path: string;
}

// Скільки днів після злучки готувати маточник (5 днів до очікуваного окролу
// на 31-й день вагітності — та сама логіка, що й getNestboxStatus у Matings.tsx)
const NESTBOX_DAYS_AFTER_MATING = 26;

// Цільовий день відлучення від народження, залежно від схеми злучування
// (та сама логіка, що й WEANING_SCHEME у Matings.tsx)
const WEANING_TARGET_DAYS: Record<string, number> = {
    intensive: 28,
    semi_intensive: 45,
    extensive: 60,
};
const DEFAULT_WEANING_TARGET_DAYS = WEANING_TARGET_DAYS.extensive;

const EVENT_DEFS: Record<CalendarEventType, EventDef> = {
    mating: { type: "mating", icon: "🐇", title: "Злучка", path: "/matings" },
    matingControl: {
        type: "matingControl",
        icon: "🔍",
        title: "Контрольна злучка",
        path: "/matings",
    },
    expectedBirth: {
        type: "expectedBirth",
        icon: "🍼",
        title: "Очікуваний окріл",
        path: "/matings",
    },
    nestbox: {
        type: "nestbox",
        icon: "🪺",
        title: "Підготувати маточник",
        path: "/matings",
    },
    paddockMating: {
        type: "paddockMating",
        icon: "🐇",
        title: "Злучка (вольєр)",
        path: "/paddocks",
    },
    paddockControl: {
        type: "paddockControl",
        icon: "🔍",
        title: "Контрольна злучка (вольєр)",
        path: "/paddocks",
    },
    paddockExpectedBirth: {
        type: "paddockExpectedBirth",
        icon: "🍼",
        title: "Очікуваний окріл (вольєр)",
        path: "/paddocks",
    },
    paddockNestbox: {
        type: "paddockNestbox",
        icon: "🪺",
        title: "Підготувати маточник (вольєр)",
        path: "/paddocks",
    },
    kindling: { type: "kindling", icon: "🐰", title: "Окріл", path: "/matings" },
    paddockKindling: {
        type: "paddockKindling",
        icon: "🐰",
        title: "Окріл (вольєр)",
        path: "/paddocks",
    },
    weaning: {
        type: "weaning",
        icon: "🥕",
        title: "Відлучення",
        path: "/matings",
    },
    weaningExpected: {
        type: "weaningExpected",
        icon: "✂️",
        title: "Планове відлучення",
        path: "/matings",
    },
    paddockWeaning: {
        type: "paddockWeaning",
        icon: "🥕",
        title: "Відлучення (вольєр)",
        path: "/paddocks",
    },
    vaccination: {
        type: "vaccination",
        icon: "💉",
        title: "Вакцинація",
        path: "/my-vaccinations",
    },
    vaccinationNext: {
        type: "vaccinationNext",
        icon: "💉",
        title: "Наступна вакцинація",
        path: "/my-vaccinations",
    },
    treatment: {
        type: "treatment",
        icon: "💊",
        title: "Лікування",
        path: "/my-treatments",
    },
    treatmentNext: {
        type: "treatmentNext",
        icon: "💊",
        title: "Наступний прийом препарату",
        path: "/my-treatments",
    },
    disinfection: {
        type: "disinfection",
        icon: "🧴",
        title: "Дезінфекція клітки",
        path: "/disinfection-log",
    },
    disinfectionNext: {
        type: "disinfectionNext",
        icon: "🧴",
        title: "Планова дезінфекція",
        path: "/disinfection-log",
    },
    slaughterPlanned: {
        type: "slaughterPlanned",
        icon: "🥩",
        title: "Плановий забій",
        path: "/fattening",
    },
    slaughterActual: {
        type: "slaughterActual",
        icon: "🥩",
        title: "Забій виконано",
        path: "/fattening",
    },
    quarantineEnd: {
        type: "quarantineEnd",
        icon: "🔒",
        title: "Кінець карантину",
        path: "/quarantine",
    },
    weighing: {
        type: "weighing",
        icon: "⚖️",
        title: "Контроль ваги",
        path: "/weighing",
    },
    sale: { type: "sale", icon: "💰", title: "Продаж", path: "/fattening" },
};

function makeEvent(
    id: string,
    date: string | null | undefined,
    type: CalendarEventType,
    subject: string,
): CalendarEvent | null {
    if (!date) return null;
    const def = EVENT_DEFS[type];
    return {
        id,
        date,
        type: def.type,
        icon: def.icon,
        title: def.title,
        subject,
        path: def.path,
    };
}

/** Додає задану кількість днів до дати у форматі YYYY-MM-DD. */
function addDays(dateStr: string | null | undefined, days: number): string | null {
    if (!dateStr) return null;
    const d = new Date(dateStr + "T00:00:00");
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
}

/**
 * Завантажує всі події господарства у заданому діапазоні дат
 * (fromDate/toDate у форматі YYYY-MM-DD, включно).
 * Джерело даних — уже існуючі таблиці, нових таблиць не створюється.
 */
export async function loadCalendarEvents(
    userId: string,
    fromDate: string,
    toDate: string,
): Promise<CalendarEvent[]> {
    const inRange = (d: string | null | undefined) =>
        !!d && d >= fromDate && d <= toDate;

    const [
        matingsRes,
        paddockMatingsRes,
        littersRes,
        paddockLittersRes,
        vaccinationsRes,
        treatmentsRes,
        disinfectionsRes,
        fatteningRes,
        quarantineRes,
        weighingsRes,
        salesRes,
    ] = await Promise.all([
        supabase
            .from("matings")
            .select(
                "id, mating_date, control_date, expected_birth, female_cage, male_cage, is_archived, breeding_scheme",
            )
            .eq("user_id", userId),
        supabase
            .from("paddock_matings")
            .select("id, mating_date, control_date, expected_birth, paddock_id")
            .eq("user_id", userId),
        supabase
            .from("litters")
            .select(
                "id, birth_date, weaned_date, mother_id, father_id, litter_mating_date, litter_control_date, litter_expected_birth, nestbox_date, mating_id",
            )
            .eq("user_id", userId),
        supabase
            .from("paddock_litters")
            .select("id, birth_date, weaned_date, paddock_mating_id")
            .eq("user_id", userId),
        supabase
            .from("vaccinations")
            .select("id, date, next_date, cage_number, vaccine_name, vaccine_type")
            .eq("user_id", userId),
        supabase
            .from("treatments")
            .select("id, date, next_date, cage_number, drug_name")
            .eq("user_id", userId),
        supabase
            .from("cage_disinfections")
            .select("id, disinfection_date, next_date, cage_number, product")
            .eq("user_id", userId),
        supabase
            .from("fattening")
            .select("id, slaughter_date, slaughtered_at, cage_number, is_active")
            .eq("user_id", userId),
        supabase
            .from("quarantine")
            .select("id, end_date, name, from_cage, is_active")
            .eq("user_id", userId),
        supabase
            .from("weighings")
            .select("id, weighing_date, rabbit_name, litter_label, fattening_id")
            .eq("user_id", userId),
        supabase
            .from("sales")
            .select("id, sold_at, cage_number, buyer")
            .eq("user_id", userId),
    ]);

    const events: CalendarEvent[] = [];

    const schemeByMatingId = new Map<string, string>();
    (matingsRes.data || []).forEach((m) => {
        if (m.breeding_scheme) schemeByMatingId.set(m.id, m.breeding_scheme);
    });

    (matingsRes.data || []).forEach((m) => {
        if (m.is_archived === true) return;
        const subject = `Клітка ${m.female_cage || "?"} × ${m.male_cage || "?"}`;
        [
            makeEvent(m.id, m.mating_date, "mating", subject),
            makeEvent(m.id, m.control_date, "matingControl", subject),
            makeEvent(m.id, m.expected_birth, "expectedBirth", subject),
            makeEvent(
                `${m.id}-nestbox`,
                addDays(m.mating_date, NESTBOX_DAYS_AFTER_MATING),
                "nestbox",
                subject,
            ),
        ].forEach((e) => e && inRange(e.date) && events.push(e));
    });

    (paddockMatingsRes.data || []).forEach((m) => {
        const subject = `Вольєр`;
        [
            makeEvent(m.id, m.mating_date, "paddockMating", subject),
            makeEvent(m.id, m.control_date, "paddockControl", subject),
            makeEvent(m.id, m.expected_birth, "paddockExpectedBirth", subject),
            makeEvent(
                `${m.id}-nestbox`,
                addDays(m.mating_date, NESTBOX_DAYS_AFTER_MATING),
                "paddockNestbox",
                subject,
            ),
        ].forEach((e) => e && inRange(e.date) && events.push(e));
    });

    (littersRes.data || []).forEach((l) => {
        const subject = "Окріл";
        // Маточник для повторної злучки конкретного окролу — тільки якщо
        // окріл ще не стався і маточник ще не позначений готовим
        const nestboxEvent =
            !l.birth_date && !l.nestbox_date
                ? makeEvent(
                    `${l.id}-nestbox`,
                    addDays(l.litter_mating_date, NESTBOX_DAYS_AFTER_MATING),
                    "nestbox",
                    subject,
                )
                : null;
        // Планове відлучення — тільки якщо окріл уже стався, а відлучення ще ні;
        // цільовий день залежить від схеми злучування батьківської злучки
        const weaningEvent =
            l.birth_date && !l.weaned_date
                ? makeEvent(
                    `${l.id}-weaning-expected`,
                    addDays(
                        l.birth_date,
                        WEANING_TARGET_DAYS[
                        schemeByMatingId.get(l.mating_id) || ""
                        ] ?? DEFAULT_WEANING_TARGET_DAYS,
                    ),
                    "weaningExpected",
                    subject,
                )
                : null;
        [
            makeEvent(l.id, l.birth_date, "kindling", subject),
            makeEvent(l.id, l.weaned_date, "weaning", subject),
            makeEvent(`${l.id}-mating`, l.litter_mating_date, "mating", subject),
            makeEvent(
                `${l.id}-control`,
                l.litter_control_date,
                "matingControl",
                subject,
            ),
            makeEvent(
                `${l.id}-expected`,
                l.litter_expected_birth,
                "expectedBirth",
                subject,
            ),
            nestboxEvent,
            weaningEvent,
        ].forEach((e) => e && inRange(e.date) && events.push(e));
    });

    (paddockLittersRes.data || []).forEach((l) => {
        const subject = "Окріл (вольєр)";
        [
            makeEvent(l.id, l.birth_date, "paddockKindling", subject),
            makeEvent(l.id, l.weaned_date, "paddockWeaning", subject),
        ].forEach((e) => e && inRange(e.date) && events.push(e));
    });

    (vaccinationsRes.data || []).forEach((v) => {
        const subject = `Клітка ${v.cage_number || "?"} — ${v.vaccine_name || v.vaccine_type || ""}`;
        [
            makeEvent(v.id, v.date, "vaccination", subject),
            makeEvent(`${v.id}-next`, v.next_date, "vaccinationNext", subject),
        ].forEach((e) => e && inRange(e.date) && events.push(e));
    });

    (treatmentsRes.data || []).forEach((t) => {
        const subject = `Клітка ${t.cage_number || "?"} — ${t.drug_name || ""}`;
        [
            makeEvent(t.id, t.date, "treatment", subject),
            makeEvent(`${t.id}-next`, t.next_date, "treatmentNext", subject),
        ].forEach((e) => e && inRange(e.date) && events.push(e));
    });

    (disinfectionsRes.data || []).forEach((d) => {
        const subject = `Клітка ${d.cage_number || "?"} — ${d.product || ""}`;
        [
            makeEvent(d.id, d.disinfection_date, "disinfection", subject),
            makeEvent(`${d.id}-next`, d.next_date, "disinfectionNext", subject),
        ].forEach((e) => e && inRange(e.date) && events.push(e));
    });

    (fatteningRes.data || []).forEach((f) => {
        const subject = `Клітка ${f.cage_number || "?"}`;
        [
            makeEvent(f.id, f.slaughter_date, "slaughterPlanned", subject),
            makeEvent(`${f.id}-done`, f.slaughtered_at, "slaughterActual", subject),
        ].forEach((e) => e && inRange(e.date) && events.push(e));
    });

    (quarantineRes.data || []).forEach((q) => {
        if (!q.is_active) return;
        const subject = q.name || `З клітки ${q.from_cage || "?"}`;
        const e = makeEvent(q.id, q.end_date, "quarantineEnd", subject);
        if (e && inRange(e.date)) events.push(e);
    });

    (weighingsRes.data || []).forEach((w) => {
        const subject = w.rabbit_name || w.litter_label || "Зважування";
        const e = makeEvent(w.id, w.weighing_date, "weighing", subject);
        if (e && inRange(e.date)) events.push(e);
    });

    (salesRes.data || []).forEach((s) => {
        const subject = `Клітка ${s.cage_number || "?"}${s.buyer ? ` — ${s.buyer}` : ""}`;
        const e = makeEvent(s.id, s.sold_at, "sale", subject);
        if (e && inRange(e.date)) events.push(e);
    });

    events.sort((a, b) => a.date.localeCompare(b.date));
    return events;
}

/** Групує події по датах для відображення у вигляді списку днів. */
export function groupEventsByDate(
    events: CalendarEvent[],
): { date: string; events: CalendarEvent[] }[] {
    const map = new Map<string, CalendarEvent[]>();
    events.forEach((e) => {
        const arr = map.get(e.date) || [];
        arr.push(e);
        map.set(e.date, arr);
    });
    return Array.from(map.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, evs]) => ({ date, events: evs }));
}