import React, { useState } from "react";
import {
  Plus,
  Calendar,
  LayoutGrid,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRight,
  X,
} from "lucide-react";
import "./MyBookings.css";

/* ─── Types ─────────────────────────────────────────────── */
type BookingStatus = "pending" | "approved" | "rejected";
type Sport = "badminton" | "squash" | "tennis";
type TabKey = "all" | BookingStatus;

interface Booking {
  id: string;
  courtName: string;
  sport: Sport;
  date: string;
  slot: string;
  status: BookingStatus;
  bookedOn: string;
  rejectionReason?: string;
}

/* ─── Mock Data ──────────────────────────────────────────── */
const BOOKINGS: Booking[] = [
  {
    id: "BK-0041",
    courtName: "Badminton Court 1",
    sport: "badminton",
    date: "Fri, 18 Apr 2025",
    slot: "07:00 – 08:00",
    status: "approved",
    bookedOn: "16 Apr, 9:12 AM",
  },
  {
    id: "BK-0039",
    courtName: "Squash Court 2",
    sport: "squash",
    date: "Thu, 17 Apr 2025",
    slot: "10:00 – 11:00",
    status: "pending",
    bookedOn: "15 Apr, 4:30 PM",
  },
  {
    id: "BK-0037",
    courtName: "Tennis Court A",
    sport: "tennis",
    date: "Wed, 16 Apr 2025",
    slot: "15:00 – 16:00",
    status: "rejected",
    bookedOn: "14 Apr, 2:05 PM",
    rejectionReason: "Court maintenance scheduled on this date.",
  },
  {
    id: "BK-0035",
    courtName: "Badminton Court 2",
    sport: "badminton",
    date: "Mon, 14 Apr 2025",
    slot: "08:00 – 09:00",
    status: "approved",
    bookedOn: "12 Apr, 11:00 AM",
  },
  {
    id: "BK-0031",
    courtName: "Squash Court 1",
    sport: "squash",
    date: "Sat, 12 Apr 2025",
    slot: "12:00 – 13:00",
    status: "pending",
    bookedOn: "11 Apr, 7:45 AM",
  },
  {
    id: "BK-0028",
    courtName: "Tennis Court B",
    sport: "tennis",
    date: "Thu, 10 Apr 2025",
    slot: "17:00 – 18:00",
    status: "rejected",
    bookedOn: "9 Apr, 3:20 PM",
    rejectionReason: "Slot already reserved by another team.",
  },
];

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
  const icons: Record<BookingStatus, React.ReactNode> = {
    approved: <CheckCircle2 width={12} height={12} />,
    pending: <Clock width={12} height={12} />,
    rejected: <XCircle width={12} height={12} />,
  };
  const labels: Record<BookingStatus, string> = {
    approved: "Approved",
    pending: "Pending",
    rejected: "Rejected",
  };
  return (
    <span className={`badge badge-${status}`}>
      {icons[status]}
      {labels[status]}
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
  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onConfirm(booking.id);
    }, 1000);
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
            <span className="summary-value summary-mono">#{booking.id}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Court</span>
            <span className="summary-value">{booking.courtName}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Slot</span>
            <span className="summary-value summary-mono">{booking.slot}</span>
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
      <a href="/courts" className="btn-primary" style={{ textDecoration: "none", marginTop: 4 }}>
        <Plus width={15} height={15} />
        New Booking
      </a>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function MyBookings() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [bookings, setBookings] = useState<Booking[]>(BOOKINGS);
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  const filtered =
    activeTab === "all"
      ? bookings
      : bookings.filter((b) => b.status === activeTab);

  const handleCancel = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    setCancelTarget(null);
    setSuccessMsg("Booking cancelled successfully.");
    setTimeout(() => setSuccessMsg(null), 4000);
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
              <a href="/courts" className="nav-link">
                <LayoutGrid width={14} height={14} />
                Courts
              </a>
              <a href="/my-bookings" className="nav-link active">
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
          <a href="/courts" className="btn-primary" style={{ textDecoration: "none" }}>
            <Plus width={15} height={15} />
            New Booking
          </a>
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
        {filtered.length === 0 ? (
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
                {filtered.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <span className="booking-id">#{b.id}</span>
                    </td>
                    <td>
                      <span className="court-cell-name">{b.courtName}</span>
                      <div style={{ marginTop: 4 }}>
                        <SportPill sport={b.sport} />
                      </div>
                      {b.status === "rejected" && b.rejectionReason && (
                        <div className="rejection-reason">{b.rejectionReason}</div>
                      )}
                    </td>
                    <td className="td-date">{b.date}</td>
                    <td>
                      <span className="slot-mono">{b.slot}</span>
                    </td>
                    <td>
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="td-meta">{b.bookedOn}</td>
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
                          <button className="btn-ghost btn-sm">
                            <ArrowRight width={13} height={13} />
                            Details
                          </button>
                        )}
                        {b.status === "rejected" && (
                          <a href="/courts" className="btn-ghost btn-sm" style={{ textDecoration: "none" }}>
                            Rebook
                          </a>
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
          onConfirm={handleCancel}
        />
      )}
    </div>
  );
}
