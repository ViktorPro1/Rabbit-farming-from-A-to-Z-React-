import { supabase } from "../lib/supabase";

export type CalendarEventType =
    | "mating"
    | "matingControl"
    | "expectedBirth"
    | "paddockMating"
    | "paddockControl"
    | "paddockExpectedBirth"
    | "kindling"
    | "paddockKindling"
    | "weaning"
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
                "id, mating_date, control_date, expected_birth, female_cage, male_cage, is_archived",
            )
            .eq("user_id", userId),
        supabase
            .from("paddock_matings")
            .select("id, mating_date, control_date, expected_birth, paddock_id")
            .eq("user_id", userId),
        supabase
            .from("litters")
            .select(
                "id, birth_date, weaned_date, mother_id, father_id, litter_mating_date, litter_control_date, litter_expected_birth",
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

    (matingsRes.data || []).forEach((m) => {
        if (m.is_archived === true) return;
        const subject = `Клітка ${m.female_cage || "?"} × ${m.male_cage || "?"}`;
        [
            makeEvent(m.id, m.mating_date, "mating", subject),
            makeEvent(m.id, m.control_date, "matingControl", subject),
            makeEvent(m.id, m.expected_birth, "expectedBirth", subject),
        ].forEach((e) => e && inRange(e.date) && events.push(e));
    });

    (paddockMatingsRes.data || []).forEach((m) => {
        const subject = `Вольєр`;
        [
            makeEvent(m.id, m.mating_date, "paddockMating", subject),
            makeEvent(m.id, m.control_date, "paddockControl", subject),
            makeEvent(m.id, m.expected_birth, "paddockExpectedBirth", subject),
        ].forEach((e) => e && inRange(e.date) && events.push(e));
    });

    (littersRes.data || []).forEach((l) => {
        const subject = "Окріл";
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