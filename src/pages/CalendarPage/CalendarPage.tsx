import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import {
  loadCalendarEvents,
  groupEventsByDate,
  type CalendarEvent,
  type CalendarEventType,
} from "../../services/calendarService";
import { logError } from "../../lib/logError";
import { todayKyiv, addDaysISO } from "../../utils/kyivDate";
import "./CalendarPage.css";

interface Props {
  session: Session;
}

type RangeOption = "week" | "month" | "twoMonths";

const RANGE_DAYS: Record<RangeOption, number> = {
  week: 7,
  month: 30,
  twoMonths: 60,
};

const WEEKDAYS_UA = [
  "неділя",
  "понеділок",
  "вівторок",
  "середа",
  "четвер",
  "п'ятниця",
  "субота",
];

const MONTHS_UA = [
  "січня",
  "лютого",
  "березня",
  "квітня",
  "травня",
  "червня",
  "липня",
  "серпня",
  "вересня",
  "жовтня",
  "листопада",
  "грудня",
];

const MONTHS_NOMINATIVE = [
  "Січень",
  "Лютий",
  "Березень",
  "Квітень",
  "Травень",
  "Червень",
  "Липень",
  "Серпень",
  "Вересень",
  "Жовтень",
  "Листопад",
  "Грудень",
];

const WEEKDAYS_SHORT = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "НД"];

type EventCategory =
  | "breeding"
  | "birth"
  | "nestbox"
  | "weaning"
  | "health"
  | "hygiene"
  | "weighing"
  | "sales";

// Порядок тут визначає порядок рисок під числом
const CATEGORIES: { key: EventCategory; label: string }[] = [
  { key: "breeding", label: "Злучки" },
  { key: "birth", label: "Окроли" },
  { key: "nestbox", label: "Маточник" },
  { key: "weaning", label: "Відлучення" },
  { key: "health", label: "Здоров'я" },
  { key: "hygiene", label: "Дезінфекція" },
  { key: "weighing", label: "Зважування" },
  { key: "sales", label: "Забій і продаж" },
];

const CATEGORY_BY_TYPE: Record<CalendarEventType, EventCategory> = {
  mating: "breeding",
  matingControl: "breeding",
  paddockMating: "breeding",
  paddockControl: "breeding",
  expectedBirth: "birth",
  paddockExpectedBirth: "birth",
  kindling: "birth",
  paddockKindling: "birth",
  nestbox: "nestbox",
  nestboxRemoval: "nestbox",
  paddockNestbox: "nestbox",
  weaning: "weaning",
  weaningExpected: "weaning",
  paddockWeaning: "weaning",
  vaccination: "health",
  vaccinationNext: "health",
  treatment: "health",
  treatmentNext: "health",
  quarantineEnd: "health",
  disinfection: "hygiene",
  disinfectionNext: "hygiene",
  weighing: "weighing",
  weighingReminder: "weighing",
  slaughterPlanned: "sales",
  slaughterActual: "sales",
  sale: "sales",
};

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

// month тут від 0 до 11, як у Date
function toISO(year: number, month: number, day: number): string {
  return `${year}-${pad2(month + 1)}-${pad2(day)}`;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

// Прибрано toISODate: toISOString() дає UTC, і з 00:00 до ~03:00 за Києвом
// "сьогодні" було вчорашньою датою. Тепер усі дати рахуються за Києвом
// через утиліти з src/utils/kyivDate.ts.

function formatDayHeader(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00");
  const today = todayKyiv();
  const tomorrow = addDaysISO(today, 1);
  const day = d.getDate();
  const month = MONTHS_UA[d.getMonth()];
  const weekday = WEEKDAYS_UA[d.getDay()];
  let prefix = "";
  if (isoDate === today) prefix = "Сьогодні — ";
  else if (isoDate === tomorrow) prefix = "Завтра — ";
  return `${prefix}${day} ${month} (${weekday})`;
}

export default function CalendarPage({ session }: Props) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<RangeOption>("month");
  const [activeTypes, setActiveTypes] = useState<Set<string> | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "month">("list");
  const [cursor, setCursor] = useState(() => {
    const [y, m] = todayKyiv().split("-").map(Number);
    return { year: y, month: m - 1 };
  });
  const [monthEvents, setMonthEvents] = useState<CalendarEvent[]>([]);
  const [monthLoading, setMonthLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const navigate = useNavigate();

  const load = useCallback(() => {
    setLoading(true);
    const today = todayKyiv();
    const from = addDaysISO(today, -3);
    const to = addDaysISO(today, RANGE_DAYS[range]);
    loadCalendarEvents(session.user.id, from, to)
      .then(setEvents)
      .catch((err) => logError("CalendarPage.load", err))
      .finally(() => setLoading(false));
  }, [session.user.id, range]);

  useEffect(() => {
    // Патерн завантаження даних у ефекті (fetch on mount / on deps change) —
    // офіційний приклад React ("You Might Not Need an Effect").
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  // Події за весь відкритий місяць (і минулі, і майбутні дні) для сітки
  useEffect(() => {
    if (viewMode !== "month") return;
    let cancelled = false;
    const from = toISO(cursor.year, cursor.month, 1);
    const to = toISO(
      cursor.year,
      cursor.month,
      daysInMonth(cursor.year, cursor.month),
    );
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMonthLoading(true);
    loadCalendarEvents(session.user.id, from, to)
      .then((data) => {
        if (!cancelled) setMonthEvents(data);
      })
      .catch((err) => logError("CalendarPage.loadMonth", err))
      .finally(() => {
        if (!cancelled) setMonthLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [viewMode, cursor, session.user.id]);

  const filteredEvents = activeTypes
    ? events.filter((e) => activeTypes.has(e.type))
    : events;

  const groups = groupEventsByDate(filteredEvents);

  const uniqueTitles = Array.from(
    new Map(events.map((e) => [e.type, e.title])).entries(),
  );

  const toggleType = (type: string) => {
    setActiveTypes((prev) => {
      const base = prev ?? new Set(events.map((e) => e.type));
      const next = new Set(base);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  // Для кожної дати: які категорії подій у ній є (у порядку CATEGORIES)
  const categoriesByDate = useMemo(() => {
    const map = new Map<string, Set<EventCategory>>();
    monthEvents.forEach((e) => {
      const set = map.get(e.date) ?? new Set<EventCategory>();
      set.add(CATEGORY_BY_TYPE[e.type]);
      map.set(e.date, set);
    });
    return map;
  }, [monthEvents]);

  const selectedEvents = selectedDate
    ? monthEvents.filter((e) => e.date === selectedDate)
    : [];

  const shiftMonth = (delta: number) => {
    setSelectedDate(null);
    setCursor((prev) => {
      const d = new Date(prev.year, prev.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  // Понеділок = 0
  const firstWeekday =
    (new Date(cursor.year, cursor.month, 1).getDay() + 6) % 7;
  const totalDays = daysInMonth(cursor.year, cursor.month);
  const monthCells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];
  const todayISO = todayKyiv();

  return (
    <div className="calendar-page-wrap">
      <div className="calendar-page-header">
        <h1 className="calendar-page-title">📅 Календар господарства</h1>
        <div className="calendar-page-actions">
          <button
            className="calendar-page-back-btn"
            onClick={() => navigate("/registry")}
          >
            {"⬅"} Мої кролики
          </button>
          <button
            className="calendar-page-back-btn"
            onClick={() =>
              setViewMode((v) => (v === "list" ? "month" : "list"))
            }
          >
            {viewMode === "list" ? "Календар" : "Список"}
          </button>
        </div>
      </div>

      {viewMode === "month" && (
        <div className="calendar-month">
          <div className="calendar-month-nav">
            <button
              className="calendar-month-nav-btn"
              onClick={() => shiftMonth(-1)}
              aria-label="Попередній місяць"
            >
              {"‹"}
            </button>
            <div className="calendar-month-title">
              {MONTHS_NOMINATIVE[cursor.month]} {cursor.year}
            </div>
            <button
              className="calendar-month-nav-btn"
              onClick={() => shiftMonth(1)}
              aria-label="Наступний місяць"
            >
              {"›"}
            </button>
          </div>

          <div className="calendar-month-weekdays">
            {WEEKDAYS_SHORT.map((w, i) => (
              <div
                key={w}
                className={
                  i === 6
                    ? "calendar-month-weekday calendar-month-weekday--sun"
                    : "calendar-month-weekday"
                }
              >
                {w}
              </div>
            ))}
          </div>

          <div className="calendar-month-grid">
            {monthCells.map((day, i) => {
              if (day === null) {
                return (
                  <div key={`empty-${i}`} className="calendar-month-cell" />
                );
              }
              const iso = toISO(cursor.year, cursor.month, day);
              const isSunday = i % 7 === 6;
              const classes = ["calendar-month-cell", "calendar-month-day"];
              if (isSunday) classes.push("calendar-month-day--sun");
              if (iso === todayISO) classes.push("calendar-month-day--today");
              if (iso === selectedDate)
                classes.push("calendar-month-day--selected");
              return (
                <button
                  key={iso}
                  className={classes.join(" ")}
                  onClick={() => setSelectedDate(iso)}
                >
                  <span className="calendar-month-day-num">{day}</span>
                  {categoriesByDate.has(iso) && (
                    <span className="calendar-month-marks">
                      {CATEGORIES.filter((c) =>
                        categoriesByDate.get(iso)?.has(c.key),
                      ).map((c) => (
                        <span
                          key={c.key}
                          className={`calendar-month-mark calendar-month-mark--${c.key}`}
                        />
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="calendar-month-legend">
            {CATEGORIES.map((c) => (
              <span key={c.key} className="calendar-month-legend-item">
                <span
                  className={`calendar-month-legend-dot calendar-month-mark--${c.key}`}
                />
                {c.label}
              </span>
            ))}
          </div>

          {monthLoading && (
            <div className="calendar-page-loading">Завантаження подій…</div>
          )}

          {selectedDate && (
            <div className="calendar-month-details">
              <div className="calendar-month-details-title">
                {formatDayHeader(selectedDate)}
              </div>
              {selectedEvents.length === 0 ? (
                <div className="calendar-month-details-empty">
                  Подій цього дня немає.
                </div>
              ) : (
                <div className="calendar-page-events">
                  {selectedEvents.map((event) => (
                    <button
                      key={`${event.type}-${event.id}`}
                      className="calendar-page-event"
                      onClick={() => navigate(event.path)}
                    >
                      <span className="calendar-page-event-icon">
                        {event.icon}
                      </span>
                      <span className="calendar-page-event-text">
                        <span className="calendar-page-event-title">
                          {event.title}
                        </span>
                        <span className="calendar-page-event-subject">
                          {event.subject}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {viewMode === "list" && (
        <>
          <div className="calendar-page-range-switch">
            <button
              className={
                range === "week"
                  ? "calendar-page-range-btn calendar-page-range-btn--active"
                  : "calendar-page-range-btn"
              }
              onClick={() => setRange("week")}
            >
              Тиждень
            </button>
            <button
              className={
                range === "month"
                  ? "calendar-page-range-btn calendar-page-range-btn--active"
                  : "calendar-page-range-btn"
              }
              onClick={() => setRange("month")}
            >
              Місяць
            </button>
            <button
              className={
                range === "twoMonths"
                  ? "calendar-page-range-btn calendar-page-range-btn--active"
                  : "calendar-page-range-btn"
              }
              onClick={() => setRange("twoMonths")}
            >
              2 місяці
            </button>
          </div>

          {uniqueTitles.length > 0 && (
            <div className="calendar-page-filters">
              {uniqueTitles.map(([type, title]) => {
                const isActive = activeTypes ? activeTypes.has(type) : true;
                return (
                  <button
                    key={type}
                    className={
                      isActive
                        ? "calendar-page-filter-chip calendar-page-filter-chip--active"
                        : "calendar-page-filter-chip"
                    }
                    onClick={() => toggleType(type)}
                  >
                    {title}
                  </button>
                );
              })}
            </div>
          )}

          {loading ? (
            <div className="calendar-page-loading">Завантаження подій…</div>
          ) : groups.length === 0 ? (
            <div className="calendar-page-empty">
              Подій у вибраному діапазоні немає.
            </div>
          ) : (
            <div className="calendar-page-days">
              {groups.map((group) => (
                <div className="calendar-page-day" key={group.date}>
                  <div className="calendar-page-day-header">
                    {formatDayHeader(group.date)}
                  </div>
                  <div className="calendar-page-events">
                    {group.events.map((event) => (
                      <button
                        key={`${event.type}-${event.id}`}
                        className="calendar-page-event"
                        onClick={() => navigate(event.path)}
                      >
                        <span className="calendar-page-event-icon">
                          {event.icon}
                        </span>
                        <span className="calendar-page-event-text">
                          <span className="calendar-page-event-title">
                            {event.title}
                          </span>
                          <span className="calendar-page-event-subject">
                            {event.subject}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
