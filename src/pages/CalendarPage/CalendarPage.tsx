import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import {
  loadCalendarEvents,
  groupEventsByDate,
  type CalendarEvent,
} from "../../services/calendarService";
import { logError } from "../../lib/logError";
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

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function formatDayHeader(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00");
  const today = toISODate(new Date());
  const tomorrow = toISODate(new Date(Date.now() + 86400000));
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
  const navigate = useNavigate();

  const load = useCallback(() => {
    setLoading(true);
    const today = new Date();
    const from = toISODate(new Date(today.getTime() - 3 * 86400000));
    const to = toISODate(
      new Date(today.getTime() + RANGE_DAYS[range] * 86400000),
    );
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

  return (
    <div className="calendar-page-wrap">
      <div className="calendar-page-header">
        <h1 className="calendar-page-title">📅 Календар господарства</h1>
        <button
          className="calendar-page-back-btn"
          onClick={() => navigate("/registry")}
        >
          {"⬅"} Мої кролики
        </button>
      </div>

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
    </div>
  );
}
