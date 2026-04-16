import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ChevronRight,
  Clock,
  CheckCircle2,
  X,
  Calendar,
  LayoutGrid,
} from "lucide-react";
import { format, addDays } from "date-fns";
import { useAvailableSlots } from "../hooks/useAvailableSlots";
import { useMakeBooking } from "../hooks/useMakeBooking";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import "./CourtDetail.css";

/* ─── Types ─────────────────────────────────────────────── */
type Sport = "badminton" | "squash" | "tennis";
type SlotStatus = "available" | "booked" | "selected";

interface Slot {
  id: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

interface Court {
  id: string;
  name: string;
  sport: Sport;
}

interface DateChip {
  label: string;
  dateStr: string;
  dateObj: Date;
}

interface BookingConfirmModalProps {
  court: Court;
  slot: Slot;
  selectedDate: DateChip;
  onClose: () => void;
  onConfirm: () => void;
}

/* ─── Helper ────────────────────────────────────────────── */
function generateDates(): DateChip[] {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = addDays(today, i);
    return {
      label: i === 0 ? "Today" : format(d, "EEE"),
      dateStr: format(d, "yyyy-MM-dd"),
      dateObj: d,
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
  const { makeBooking, loading: submitting, error } = useMakeBooking();

  const handleConfirm = async () => {
    const { error: bookingError } = await makeBooking({
      courtId: court.id,
      slotId: slot.id,
      date: selectedDate.dateStr
    });
    
    if (!bookingError) {
      onConfirm();
    }
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

        {error && <div className="alert-warning" style={{ color: 'red', marginBottom: 16 }}>{error}</div>}

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
              {format(selectedDate.dateObj, "EEEE, MMMM do")}
            </span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Slot</span>
            <span className="summary-value summary-mono">
              {slot.start_time.substring(0, 5)} – {slot.end_time.substring(0, 5)}
            </span>
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
  const { courtId } = useParams();
  const navigate = useNavigate();
  const { profile, user, signOut } = useAuth();
  
  const [court, setCourt] = useState<Court | null>(null);
  const DATES = generateDates();
  const [activeDateIdx, setActiveDateIdx] = useState(0);
  const selectedDate = DATES[activeDateIdx];
  
  const { slots, loading: slotsLoading, error: slotsError } = useAvailableSlots(courtId, selectedDate.dateStr);
  
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    async function fetchCourt() {
      if (!courtId) return;
      const { data, error } = await supabase.from('courts').select('*').eq('id', courtId).single();
      if (!error) setCourt(data);
    }
    fetchCourt();
  }, [courtId]);

  const handleDateChange = (idx: number) => {
    setActiveDateIdx(idx);
    setSelectedSlot(null);
  };

  const handleSlotClick = (slot: Slot) => {
    if (!slot.is_available) return;
    setSelectedSlot((prev) => (prev?.id === slot.id ? null : slot));
  };

  const handleConfirm = () => {
    setShowModal(false);
    setConfirmed(true);
    setSelectedSlot(null);
    // Optionally redirect to My Bookings after some time
    setTimeout(() => navigate('/my-bookings'), 2000);
  };

  const name = profile?.full_name || user?.email || "User";
  const initials = name.split(" ").map((n: string) => n[0]).join("").toUpperCase().substring(0, 2);

  if (!court) return <div style={{ padding: '2rem' }}>Loading court details...</div>;

  return (
    <div className="page-bg">
      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="navbar-left">
            <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
              Court<span className="logo-accent">Book</span>
            </Link>
            <div className="nav-links">
              <Link to="/courts" className="nav-link active">
                <LayoutGrid width={14} height={14} />
                Courts
              </Link>
              <Link to="/my-bookings" className="nav-link">
                <Calendar width={14} height={14} />
                My Bookings
              </Link>
              {profile?.role === 'admin' && <Link to="/admin" className="nav-link">Admin</Link>}
            </div>
          </div>
          <div className="navbar-right" style={{ cursor: 'pointer' }} onClick={() => { if(confirm("Sign out?")) signOut(); }}>
            <span className="nav-name">{name}</span>
            <div className="avatar">{initials}</div>
          </div>
        </div>
      </nav>

      <div className="page-shell">
        {/* ── Breadcrumb ── */}
        <div className="breadcrumb">
          <Link to="/courts" className="breadcrumb-link">Courts</Link>
          <ChevronRight width={13} height={13} className="breadcrumb-sep" />
          <span className="breadcrumb-current">{court.name}</span>
        </div>

        {/* ── Court Header ── */}
        <div className="court-header-card">
          <div className={`court-icon-zone ${court.sport}`}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              {court.sport === "badminton" && (
                <circle cx="20" cy="20" r="14" stroke="#1D7A4A" strokeWidth="2.5" fill="none" />
              )}
              {court.sport === "squash" && (
                <rect x="8" y="8" width="24" height="24" rx="3" stroke="#1A3A6B" strokeWidth="2.5" fill="none" />
              )}
              {court.sport === "tennis" && (
                <circle cx="20" cy="20" r="14" stroke="#8A5E00" strokeWidth="2.5" fill="none" />
              )}
            </svg>
          </div>
          <div className="court-header-body">
            <h1 className="court-name">{court.name}</h1>
            <div className="court-meta">
              <SportPill sport={court.sport} />
              <span className="court-location">IIT Bombay Sports Complex</span>
            </div>
          </div>
          <div className="court-availability-badge">
            <span className="avail-dot" />
            Available for booking
          </div>
        </div>

        {/* ── Confirmed toast ── */}
        {confirmed && (
          <div
            className="alert-success"
            style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}
          >
            <CheckCircle2 width={16} height={16} />
            Booking request submitted! It's pending admin approval. Redirecting...
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
                <span className="date-chip-date">{format(d.dateObj, "d MMM")}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ── Slot Grid ── */}
        <section className="section">
          <h2 className="section-title">Available Slots</h2>
          {slotsLoading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Loading slots...</div>
          ) : slotsError ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>Error loading slots.</div>
          ) : (
            <div className="slot-grid">
              {slots.map((slot) => {
                const isSelected = selectedSlot?.id === slot.id;
                const state = !slot.is_available ? "booked" : isSelected ? "selected" : "available";
                
                return (
                  <button
                    key={slot.id}
                    className={`slot ${state}`}
                    onClick={() => handleSlotClick(slot)}
                    disabled={state === "booked"}
                  >
                    <span className="slot-time">
                      {slot.start_time.substring(0, 5)}–{slot.end_time.substring(0, 5)}
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
          )}

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
                  ? `Confirm Booking — ${selectedSlot.start_time.substring(0, 5)} to ${selectedSlot.end_time.substring(0, 5)}`
                  : "Select a slot to continue"}
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* ── Modal ── */}
      {showModal && selectedSlot && (
        <BookingConfirmModal
          court={court}
          slot={selectedSlot}
          selectedDate={selectedDate}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}
