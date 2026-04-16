import React, { useState } from "react";
import {
  ChevronRight,
  Clock,
  CheckCircle2,
  X,
  Calendar,
  LayoutGrid,
} from "lucide-react";
import "./CourtDetail.css";

/* ─── Types ─────────────────────────────────────────────── */
type Sport = "badminton" | "squash" | "tennis";
type SlotStatus = "available" | "booked" | "selected";

interface Slot {
  id: string;
  startTime: string;
  endTime: string;
  status: SlotStatus;
}

interface Court {
  id: string;
  name: string;
  sport: Sport;
  location: string;
}

interface BookingConfirmModalProps {
  court: Court;
  slot: Slot;
  selectedDate: DateChip;
  onClose: () => void;
  onConfirm: () => void;
}

interface DateChip {
  label: string;
  date: string;
  dateObj: Date;
}

/* ─── Mock Data ──────────────────────────────────────────── */
const COURT: Court = {
  id: "bc-1",
  name: "Badminton Court 1",
  sport: "badminton",
  location: "Sports Complex, Block A",
};

function generateDates(): DateChip[] {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const today = new Date();
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return {
      label: i === 0 ? "Today" : days[d.getDay()],
      date: `${d.getDate()} ${months[d.getMonth()]}`,
      dateObj: d,
    };
  });
}

function generateSlots(dateIndex: number): Slot[] {
  const bookedMap: Record<number, number[]> = {
    0: [0, 2, 5],
    1: [1, 3],
    2: [0, 1, 4, 5],
    3: [],
    4: [2, 3, 5],
  };
  const booked = bookedMap[dateIndex] ?? [];
  return Array.from({ length: 12 }, (_, i) => {
    const hour = 6 + i;
    const pad = (n: number) => String(n).padStart(2, "0");
    return {
      id: `slot-${i}`,
      startTime: `${pad(hour)}:00`,
      endTime: `${pad(hour + 1)}:00`,
      status: booked.includes(i) ? "booked" : "available",
    };
  });
}

/* ─── Sub-components ─────────────────────────────────────── */
function SportPill({ sport }: { sport: Sport }) {
  return (
    <span className={`sport-pill ${sport}`}>
      {sport.charAt(0).toUpperCase() + sport.slice(1)}
    </span>
  );
}

function BookingConfirmModal({
  court,
  slot,
  selectedDate,
  onClose,
  onConfirm,
}: BookingConfirmModalProps) {
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onConfirm();
    }, 1400);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Confirm Booking</h2>
            <p className="modal-subtitle">
              Review your booking details before submitting.
            </p>
          </div>
          <button className="modal-close btn-ghost" onClick={onClose}>
            <X width={16} height={16} />
          </button>
        </div>

        <div className="modal-summary">
          <div className="summary-row">
            <span className="summary-label">Court</span>
            <span className="summary-value">{court.name}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Sport</span>
            <span className="summary-value">
              <SportPill sport={court.sport} />
            </span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Date</span>
            <span className="summary-value">
              {selectedDate.label === "Today" ? "Today" : selectedDate.label},{" "}
              {selectedDate.date}
            </span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Slot</span>
            <span className="summary-value summary-mono">
              {slot.startTime} – {slot.endTime}
            </span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Duration</span>
            <span className="summary-value">1 hour</span>
          </div>
        </div>

        <div className="alert-warning" style={{ marginTop: 16 }}>
          <Clock width={15} height={15} />
          Your booking will be pending until approved by an admin.
        </div>

        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={handleConfirm}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="spinner" />
                Submitting…
              </>
            ) : (
              <>
                <CheckCircle2 width={15} height={15} />
                Submit Booking Request
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function CourtDetail() {
  const DATES = generateDates();
  const [activeDateIdx, setActiveDateIdx] = useState(0);
  const [slots, setSlots] = useState<Slot[]>(() => generateSlots(0));
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleDateChange = (idx: number) => {
    setActiveDateIdx(idx);
    setSelectedSlot(null);
    setSlots(generateSlots(idx));
  };

  const handleSlotClick = (slot: Slot) => {
    if (slot.status === "booked") return;
    setSelectedSlot((prev) => (prev?.id === slot.id ? null : slot));
  };

  const handleConfirm = () => {
    setShowModal(false);
    setConfirmed(true);
    setSelectedSlot(null);
  };

  const getSlotState = (slot: Slot): SlotStatus => {
    if (slot.status === "booked") return "booked";
    if (selectedSlot?.id === slot.id) return "selected";
    return "available";
  };

  return (
    <div className="page-bg">
      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="navbar-left">
            <span className="logo">
              Court<span className="logo-accent">Book</span>
            </span>
            <div className="nav-links">
              <a href="/courts" className="nav-link active">
                <LayoutGrid width={14} height={14} />
                Courts
              </a>
              <a href="/my-bookings" className="nav-link">
                <Calendar width={14} height={14} />
                My Bookings
              </a>
            </div>
          </div>
          <div className="navbar-right">
            <span className="nav-name">Arjun Mehta</span>
            <div className="avatar">AM</div>
          </div>
        </div>
      </nav>

      <div className="page-shell">
        {/* ── Breadcrumb ── */}
        <div className="breadcrumb">
          <a href="/courts" className="breadcrumb-link">Courts</a>
          <ChevronRight width={13} height={13} className="breadcrumb-sep" />
          <span className="breadcrumb-current">{COURT.name}</span>
        </div>

        {/* ── Court Header ── */}
        <div className="court-header-card">
          <div className={`court-icon-zone ${COURT.sport}`}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              {COURT.sport === "badminton" && (
                <circle cx="20" cy="20" r="14" stroke="#1D7A4A" strokeWidth="2.5" fill="none" />
              )}
              {COURT.sport === "squash" && (
                <rect x="8" y="8" width="24" height="24" rx="3" stroke="#1A3A6B" strokeWidth="2.5" fill="none" />
              )}
              {COURT.sport === "tennis" && (
                <circle cx="20" cy="20" r="14" stroke="#8A5E00" strokeWidth="2.5" fill="none" />
              )}
            </svg>
          </div>
          <div className="court-header-body">
            <h1 className="court-name">{COURT.name}</h1>
            <div className="court-meta">
              <SportPill sport={COURT.sport} />
              <span className="court-location">{COURT.location}</span>
            </div>
          </div>
          <div className="court-availability-badge">
            <span className="avail-dot" />
            Available today
          </div>
        </div>

        {/* ── Confirmed toast ── */}
        {confirmed && (
          <div
            className="alert-success"
            style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 0 }}
          >
            <CheckCircle2 width={16} height={16} />
            Booking request submitted! It's pending admin approval.
            <button
              className="btn-ghost btn-sm"
              style={{ marginLeft: "auto" }}
              onClick={() => setConfirmed(false)}
            >
              <X width={13} height={13} />
            </button>
          </div>
        )}

        {/* ── Date Picker ── */}
        <section className="section">
          <h2 className="section-title">Select Date</h2>
          <div className="date-chips">
            {DATES.map((d, i) => (
              <button
                key={i}
                className={`date-chip${activeDateIdx === i ? " active" : ""}`}
                onClick={() => handleDateChange(i)}
              >
                <span className="date-chip-day">{d.label}</span>
                <span className="date-chip-date">{d.date}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ── Slot Grid ── */}
        <section className="section">
          <h2 className="section-title">Available Slots</h2>
          <div className="slot-grid">
            {slots.map((slot) => {
              const state = getSlotState(slot);
              return (
                <button
                  key={slot.id}
                  className={`slot ${state}`}
                  onClick={() => handleSlotClick(slot)}
                  disabled={state === "booked"}
                >
                  <span className="slot-time">
                    {slot.startTime}–{slot.endTime}
                  </span>
                  <span className="slot-status">
                    {state === "selected"
                      ? "Selected"
                      : state === "booked"
                      ? "Booked"
                      : "Free"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ── Action Bar ── */}
          <div className="slot-action-bar">
            <div className="slot-legend">
              <span className="legend-item">
                <span className="legend-box selected-box" /> Selected
              </span>
              <span className="legend-item">
                <span className="legend-box available-box" /> Available
              </span>
              <span className="legend-item">
                <span className="legend-box booked-box" /> Booked
              </span>
            </div>
            <div className="slot-actions">
              {selectedSlot && (
                <button
                  className="btn-ghost"
                  onClick={() => setSelectedSlot(null)}
                >
                  Clear
                </button>
              )}
              <button
                className="btn-primary"
                disabled={!selectedSlot}
                onClick={() => selectedSlot && setShowModal(true)}
              >
                {selectedSlot
                  ? `Confirm Booking — ${selectedSlot.startTime} to ${selectedSlot.endTime}`
                  : "Select a slot to continue"}
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* ── Modal ── */}
      {showModal && selectedSlot && (
        <BookingConfirmModal
          court={COURT}
          slot={selectedSlot}
          selectedDate={DATES[activeDateIdx]}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}
