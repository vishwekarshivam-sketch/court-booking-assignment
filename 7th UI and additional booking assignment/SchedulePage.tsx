import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, Clock, CheckCircle2, XCircle } from "lucide-react";
import "./SchedulePage.css";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TIME_SLOTS = [
  "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
  "19:00", "20:00",
];

const SPORTS = ["All", "Badminton", "Squash", "Tennis"];

type BookingStatus = "mine" | "booked" | "available";

interface Slot {
  status: BookingStatus;
  by?: string;
}

// Seeded mock data: [day 0-6][time 0-13] → Slot
function generateSchedule(): Slot[][] {
  const seed: Record<string, Slot> = {
    "0-2": { status: "mine" },
    "0-5": { status: "booked", by: "Rahul S." },
    "1-0": { status: "booked", by: "Priya K." },
    "1-7": { status: "mine" },
    "2-3": { status: "booked", by: "Arun M." },
    "2-9": { status: "booked", by: "Neha P." },
    "3-1": { status: "mine" },
    "3-6": { status: "booked", by: "Dev R." },
    "4-4": { status: "booked", by: "Kiran T." },
    "4-11": { status: "mine" },
    "5-2": { status: "booked", by: "Sneha L." },
    "5-8": { status: "booked", by: "Raj V." },
    "6-0": { status: "booked", by: "Ananya S." },
    "6-5": { status: "mine" },
  };
  return Array.from({ length: 7 }, (_, d) =>
    Array.from({ length: 14 }, (_, t) => seed[`${d}-${t}`] ?? { status: "available" })
  );
}

const SCHEDULE = generateSchedule();

// Generate current week's dates
function getWeekDates(offset = 0) {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - now.getDay() + 1 + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export default function SchedulePage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [activeSport, setActiveSport] = useState("All");
  const [hoveredSlot, setHoveredSlot] = useState<{ day: number; time: number } | null>(null);
  const weekDates = getWeekDates(weekOffset);
  const today = new Date();

  const isToday = (date: Date) =>
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth();

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

  const getWeekLabel = () => {
    const start = weekDates[0];
    const end = weekDates[6];
    return `${formatDate(start)} – ${formatDate(end)}`;
  };

  return (
    <div className="cb-root">
      {/* Navbar */}
      <nav className="cb-nav">
        <div className="cb-logo">Court<span>Book</span></div>
        <div className="cb-nav-links">
          <a className="cb-nav-link">Courts</a>
          <a className="cb-nav-link">My Bookings</a>
          <a className="cb-nav-link active">Schedule</a>
        </div>
        <div className="cb-nav-right">
          <div className="cb-avatar">SS</div>
          <span className="cb-name">Shivam</span>
        </div>
      </nav>

      <div className="cb-page">
        {/* Header */}
        <div className="cb-page-header">
          <div>
            <h1 className="cb-page-title">Court Schedule</h1>
            <p className="cb-page-sub">View availability across all courts for the week.</p>
          </div>
          <div className="cb-week-nav">
            <button className="cb-week-btn" onClick={() => setWeekOffset((o) => o - 1)}>
              <ChevronLeft width={16} height={16} />
            </button>
            <span className="cb-week-label">
              <Calendar width={14} height={14} />
              {weekOffset === 0 ? "This week" : weekOffset === 1 ? "Next week" : getWeekLabel()}
            </span>
            <button className="cb-week-btn" onClick={() => setWeekOffset((o) => o + 1)}>
              <ChevronRight width={16} height={16} />
            </button>
          </div>
        </div>

        {/* Sport Filter */}
        <div className="cb-tabs">
          {SPORTS.map((s) => (
            <button
              key={s}
              className={`cb-tab${activeSport === s ? " active" : ""}`}
              onClick={() => setActiveSport(s)}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="cb-legend">
          <span className="cb-legend-item mine"><span className="cb-legend-dot" />My booking</span>
          <span className="cb-legend-item booked"><span className="cb-legend-dot" />Taken</span>
          <span className="cb-legend-item available"><span className="cb-legend-dot" />Available</span>
        </div>

        {/* Schedule Grid */}
        <div className="cb-schedule-card">
          {/* Header row */}
          <div className="cb-schedule-grid">
            <div className="cb-time-label-header" />
            {weekDates.map((date, i) => (
              <div key={i} className={`cb-day-header${isToday(date) ? " today" : ""}`}>
                <span className="cb-day-name">{DAYS[i]}</span>
                <span className="cb-day-date">{date.getDate()}</span>
              </div>
            ))}
          </div>

          {/* Time rows */}
          <div className="cb-schedule-rows">
            {TIME_SLOTS.map((time, t) => (
              <div key={t} className="cb-schedule-grid cb-time-row">
                <div className="cb-time-label">{time}</div>
                {SCHEDULE.map((daySlots, d) => {
                  const slot = daySlots[t];
                  const isHovered = hoveredSlot?.day === d && hoveredSlot?.time === t;
                  return (
                    <div
                      key={d}
                      className={`cb-slot-cell ${slot.status}${isHovered ? " hovered" : ""}`}
                      onMouseEnter={() => setHoveredSlot({ day: d, time: t })}
                      onMouseLeave={() => setHoveredSlot(null)}
                    >
                      {slot.status === "mine" && (
                        <span className="cb-slot-tag mine">You</span>
                      )}
                      {slot.status === "booked" && isHovered && (
                        <span className="cb-slot-tag booked">{slot.by}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Summary Row */}
        <div className="cb-schedule-summary">
          <div className="cb-summary-card">
            <CheckCircle2 width={18} height={18} color="#1D7A4A" />
            <div>
              <span className="cb-summary-val">3</span>
              <span className="cb-summary-label">My bookings this week</span>
            </div>
          </div>
          <div className="cb-summary-card">
            <Clock width={18} height={18} color="#D4900A" />
            <div>
              <span className="cb-summary-val" style={{ color: "#D4900A" }}>47</span>
              <span className="cb-summary-label">Slots available today</span>
            </div>
          </div>
          <div className="cb-summary-card">
            <XCircle width={18} height={18} color="#B52A2A" />
            <div>
              <span className="cb-summary-val" style={{ color: "#B52A2A" }}>10</span>
              <span className="cb-summary-label">Taken slots today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
