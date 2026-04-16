import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  X,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { useMyBookings } from "../hooks/useMyBookings";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import Navbar from "../components/Navbar";
import "./MyBookings.css";

/* ─── Types ─────────────────────────────────────────────── */
type BookingStatus = "pending" | "approved" | "rejected" | "cancelled";
type Sport = "badminton" | "squash" | "tennis";
type TabKey = "all" | "pending" | "approved" | "rejected";

interface Booking {
  id: string;
  court_id: string;
  slot_id: string;
  booking_date: string;
  status: BookingStatus;
  created_at: string;
  court: { name: string; sport: Sport };
  slot: { start_time: string; end_time: string };
}

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

/* ─── Sub-components ─────────────────────────────────────── */
function SportPill({ sport }: { sport: Sport }) {
  return (
    <span className={`sport-pill ${sport}`}>
      {sport.charAt(0).toUpperCase() + sport.slice(1)}
    </span>
  );
}

function StatusBadge({ status }: { status: BookingStatus }) {
  const icons: Record<string, React.ReactNode> = {
    approved: <CheckCircle2 width={12} height={12} />,
    pending: <Clock width={12} height={12} />,
    rejected: <XCircle width={12} height={12} />,
    cancelled: <XCircle width={12} height={12} />,
  };
  const labels: Record<string, string> = {
    approved: "Approved",
    pending: "Pending",
    rejected: "Rejected",
    cancelled: "Cancelled",
  };
  return (
    <span className={`badge badge-${status}`}>
      {icons[status] || icons['pending']}
      {labels[status] || "Unknown"}
    </span>
  );
}

function CancelModal({
  booking,
  onClose,
  onConfirm,
}: {
  booking: Booking;
  onClose: () => void;
  onConfirm: (id: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const handleConfirm = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', booking.id);
    
    setLoading(false);
    if (!error) {
      onConfirm(booking.id);
    } else {
      alert(error.message);
    }
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Cancel Booking</h2>
            <p className="modal-subtitle">This action cannot be undone.</p>
          </div>
          <button className="btn-ghost" onClick={onClose}>
            <X width={16} height={16} />
          </button>
        </div>
        <div className="modal-summary">
          <div className="summary-row">
            <span className="summary-label">Booking ID</span>
            <span className="summary-value summary-mono">#{booking.id.substring(0, 8)}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Court</span>
            <span className="summary-value">{booking.court.name}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Slot</span>
            <span className="summary-value summary-mono">
              {booking.slot.start_time.substring(0, 5)} – {booking.slot.end_time.substring(0, 5)}
            </span>
          </div>
        </div>
        <div className="alert-danger" style={{ marginTop: 16 }}>
          <XCircle width={15} height={15} />
          Are you sure you want to cancel this booking request?
        </div>
        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose} disabled={loading}>
            Keep Booking
          </button>
          <button
            className="btn-danger"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-red" /> Cancelling…
              </>
            ) : (
              "Cancel Booking"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ tab }: { tab: TabKey }) {
  const copy: Record<TabKey, { title: string; body: string }> = {
    all: {
      title: "No bookings yet",
      body: "You haven't made any court bookings. Reserve a court to get started.",
    },
    pending: {
      title: "No pending bookings",
      body: "All your booking requests have been reviewed.",
    },
    approved: {
      title: "No approved bookings",
      body: "None of your bookings have been approved yet.",
    },
    rejected: {
      title: "No rejected bookings",
      body: "Great! None of your bookings have been rejected.",
    },
  };
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Calendar width={28} height={28} />
      </div>
      <p className="empty-title">{copy[tab].title}</p>
      <p className="empty-body">{copy[tab].body}</p>
      <Link to="/courts" className="btn-primary" style={{ textDecoration: "none", marginTop: 4 }}>
        <Plus width={15} height={15} />
        New Booking
      </Link>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function MyBookings() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const { bookings, loading, error } = useMyBookings();
  useAuth();
  const [cancelTarget, setCancelTarget] = useState<any | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const pendingCount = bookings.filter((b: any) => b.status === "pending").length;

  const filtered =
    activeTab === "all"
      ? bookings.filter((b: any) => b.status !== 'cancelled')
      : bookings.filter((b: any) => b.status === activeTab);

  const handleCancelSuccess = (_id: string) => {
    setCancelTarget(null);
    setSuccessMsg("Booking cancelled successfully.");
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div className="page-bg">
      <Navbar activePage="my-bookings" />

      {/* ── Success Toast ── */}
      {successMsg && (
        <div className="toast-wrapper">
          <div className="toast-success">
            <CheckCircle2 width={15} height={15} />
            {successMsg}
            <button className="btn-ghost btn-sm" onClick={() => setSuccessMsg(null)}>
              <X width={13} height={13} />
            </button>
          </div>
        </div>
      )}

      <div className="page-shell">
        {/* ── Page Title Row ── */}
        <div className="page-top-row">
          <div>
            <h1 className="page-title">My Bookings</h1>
            <p className="page-subtitle">Track and manage all your court reservations.</p>
          </div>
          <Link to="/courts" className="btn-primary" style={{ textDecoration: "none" }}>
            <Plus width={15} height={15} />
            New Booking
          </Link>
        </div>

        {/* ── Tabs ── */}
        <div className="tabs-bar">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`tab-item${activeTab === t.key ? " active" : ""}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
              {t.key === "pending" && pendingCount > 0 && (
                <span className="tab-count">{pendingCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── Table or Empty ── */}
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>Loading your bookings...</div>
        ) : error ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'red' }}>Error loading bookings.</div>
        ) : filtered.length === 0 ? (
          <EmptyState tab={activeTab} />
        ) : (
          <div className="table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Court</th>
                  <th>Date</th>
                  <th>Slot</th>
                  <th>Status</th>
                  <th>Booked On</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b: any) => (
                  <tr key={b.id}>
                    <td>
                      <span className="booking-id">#{b.id.substring(0, 8)}</span>
                    </td>
                    <td>
                      <span className="court-cell-name">{b.court.name}</span>
                      <div style={{ marginTop: 4 }}>
                        <SportPill sport={b.court.sport} />
                      </div>
                    </td>
                    <td className="td-date">{format(new Date(b.booking_date), "EEE, d MMM yyyy")}</td>
                    <td>
                      <span className="slot-mono">{b.slot.start_time.substring(0, 5)} – {b.slot.end_time.substring(0, 5)}</span>
                    </td>
                    <td>
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="td-meta">{format(new Date(b.created_at), "d MMM, h:mm a")}</td>
                    <td>
                      <div className="row-actions">
                        {b.status === "pending" && (
                          <button
                            className="btn-danger btn-sm"
                            onClick={() => setCancelTarget(b)}
                          >
                            Cancel
                          </button>
                        )}
                        {b.status === "approved" && (
                          <span className="badge badge-approved" style={{ fontSize: '11px' }}>Approved</span>
                        )}
                        {b.status === "rejected" && (
                          <Link to={`/courts/${b.court_id}`} className="btn-ghost btn-sm" style={{ textDecoration: "none" }}>
                            Rebook
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {cancelTarget && (
        <CancelModal
          booking={cancelTarget}
          onClose={() => setCancelTarget(null)}
          onConfirm={handleCancelSuccess}
        />
      )}
    </div>
  );
}
