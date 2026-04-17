import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ChevronRight,
  Clock,
  CheckCircle2,
  X,
} from "lucide-react";
import { format, addDays } from "date-fns";
import { useAvailableSlots } from "../hooks/useAvailableSlots";
import { useMakeBooking } from "../hooks/useMakeBooking";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
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
                SUBMITTING
              </>
            ) : (
              "CONFIRM BOOKING →"
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
  useAuth();
  
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

  const SPORT_COLOR: Record<Sport, string> = {
    badminton: "#059669",
    squash:    "#ea580c",
    tennis:    "#7c3aed",
  };

  if (!court) return (
    <div style={{ minHeight: '100vh', background: '#0d0d0d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "var(--font-data)", fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#444' }}>
      Loading court…
    </div>
  );

  return (
    <div className="page-bg">
      <Navbar activePage="courts" />

      <div className="page-shell">
        {/* ── Breadcrumb ── */}
        <div className="breadcrumb">
          <Link to="/courts" className="breadcrumb-link">Courts</Link>
          <ChevronRight width={13} height={13} className="breadcrumb-sep" />
          <span className="breadcrumb-current">{court.name}</span>
        </div>

        {/* ── Court Header ── */}
        <div className="court-header-card" style={{ "--sport-color": SPORT_COLOR[court.sport] } as React.CSSProperties}>
          <div className="court-icon-zone">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              {court.sport === "badminton" && (
                <>
                  {/* cork — rounded base, tilted */}
                  <path d="M5 24 Q4 30 9 32 Q15 34 16 29 L14 22 Q10 21 5 24 Z" stroke={SPORT_COLOR[court.sport]} strokeWidth="1.3" fill="none"/>
                  {/* feather 1 — leftmost */}
                  <path d="M11 23 Q8 15 13 6 Q16 10 14 20 Z" stroke={SPORT_COLOR[court.sport]} strokeWidth="1.2" fill="none"/>
                  {/* feather 2 */}
                  <path d="M13 22 Q12 13 19 5 Q22 9 18 19 Z" stroke={SPORT_COLOR[court.sport]} strokeWidth="1.2" fill="none"/>
                  {/* feather 3 */}
                  <path d="M15 21 Q18 12 25 6 Q27 11 21 18 Z" stroke={SPORT_COLOR[court.sport]} strokeWidth="1.2" fill="none"/>
                  {/* feather 4 — rightmost */}
                  <path d="M16 20 Q22 12 31 10 Q31 15 24 19 Z" stroke={SPORT_COLOR[court.sport]} strokeWidth="1.2" fill="none"/>
                </>
              )}
              {court.sport === "squash" && (
                <>
                  {/* upright oval head */}
                  <ellipse cx="18" cy="13" rx="8" ry="10" stroke={SPORT_COLOR[court.sport]} strokeWidth="1.4" fill="none"/>
                  {/* vertical strings */}
                  <line x1="13" y1="4"  x2="13" y2="22" stroke={SPORT_COLOR[court.sport]} strokeWidth="0.7" opacity="0.7"/>
                  <line x1="18" y1="3"  x2="18" y2="23" stroke={SPORT_COLOR[court.sport]} strokeWidth="0.7" opacity="0.7"/>
                  <line x1="23" y1="4"  x2="23" y2="22" stroke={SPORT_COLOR[court.sport]} strokeWidth="0.7" opacity="0.7"/>
                  {/* horizontal strings */}
                  <line x1="10" y1="9"  x2="26" y2="9"  stroke={SPORT_COLOR[court.sport]} strokeWidth="0.7" opacity="0.7"/>
                  <line x1="10" y1="13" x2="26" y2="13" stroke={SPORT_COLOR[court.sport]} strokeWidth="0.7" opacity="0.7"/>
                  <line x1="10" y1="17" x2="26" y2="17" stroke={SPORT_COLOR[court.sport]} strokeWidth="0.7" opacity="0.7"/>
                  {/* throat */}
                  <line x1="14" y1="23" x2="15" y2="26" stroke={SPORT_COLOR[court.sport]} strokeWidth="1.3"/>
                  <line x1="22" y1="23" x2="21" y2="26" stroke={SPORT_COLOR[court.sport]} strokeWidth="1.3"/>
                  {/* handle */}
                  <line x1="15" y1="26" x2="14" y2="33" stroke={SPORT_COLOR[court.sport]} strokeWidth="2" strokeLinecap="round"/>
                  <line x1="21" y1="26" x2="22" y2="33" stroke={SPORT_COLOR[court.sport]} strokeWidth="2" strokeLinecap="round"/>
                  <line x1="14" y1="33" x2="22" y2="33" stroke={SPORT_COLOR[court.sport]} strokeWidth="1.5" strokeLinecap="round"/>
                </>
              )}
              {court.sport === "tennis" && (
                <>
                  <circle cx="18" cy="18" r="10" stroke={SPORT_COLOR[court.sport]} strokeWidth="1.5" />
                  <path d="M13 11Q18 18 13 25" stroke={SPORT_COLOR[court.sport]} strokeWidth="1.2" fill="none" />
                  <path d="M23 11Q18 18 23 25" stroke={SPORT_COLOR[court.sport]} strokeWidth="1.2" fill="none" />
                </>
              )}
            </svg>
          </div>
          <div className="court-header-body">
            <h1 className="court-name">{court.name.toUpperCase()}</h1>
            <div className="court-meta">
              <SportPill sport={court.sport} />
              <span className="court-location">IIT Bombay · Sports Complex</span>
            </div>
          </div>
          <div className="court-availability-badge">
            <span className="avail-dot" />
            Available
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
            <div style={{ padding: '2rem', textAlign: 'center', fontFamily: "var(--font-data)", fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#444' }}>Loading slots…</div>
          ) : slotsError ? (
            <div style={{ padding: '2rem', textAlign: 'center', fontFamily: "var(--font-data)", fontSize: '11px', color: '#ff4d4d' }}>⚠ Error loading slots.</div>
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
                  ? `BOOK ${selectedSlot.start_time.substring(0, 5)}–${selectedSlot.end_time.substring(0, 5)} →`
                  : "SELECT A SLOT"}
              </button>
            </div>
          </div>
        </section>
      </div>

      <Footer />

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
