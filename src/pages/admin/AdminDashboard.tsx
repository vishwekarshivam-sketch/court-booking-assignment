import React, { useState } from "react";
import {
  LayoutGrid,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  Home,
  List,
  User,
  X,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { useAllBookings } from "../../hooks/useAllBookings";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import "./AdminDashboard.css";

/* ─── Types ─────────────────────────────────────────────── */
type BookingStatus = "pending" | "approved" | "rejected" | "cancelled";
type Sport = "badminton" | "squash" | "tennis";
type AdminTab = "pending" | "all" | "approved" | "rejected";

interface Booking {
  id: string;
  court_id: string;
  user_id: string;
  booking_date: string;
  status: BookingStatus;
  created_at: string;
  profile: { full_name: string };
  court: { name: string; sport: Sport };
  slot: { start_time: string; end_time: string };
}

const ADMIN_TABS: { key: AdminTab; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "all", label: "All Bookings" },
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
  const icons = {
    approved: <CheckCircle2 width={12} height={12} />,
    pending: <Clock width={12} height={12} />,
    rejected: <XCircle width={12} height={12} />,
    cancelled: <XCircle width={12} height={12} />,
  };
  return (
    <span className={`badge badge-${status}`}>
      {icons[status] || icons['pending']}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function RejectModal({
  booking,
  onClose,
  onConfirm,
}: {
  booking: Booking;
  onClose: () => void;
  onConfirm: (id: string, reason: string) => void;
}) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    onConfirm(booking.id, reason);
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Reject Booking</h2>
            <p className="modal-subtitle">
              Provide a reason for the rejection.
            </p>
          </div>
          <button className="btn-ghost" onClick={onClose}>
            <X width={16} height={16} />
          </button>
        </div>

        <div className="modal-summary">
          <div className="summary-row">
            <span className="summary-label">Booking</span>
            <span className="summary-value summary-mono">#{booking.id.substring(0, 8)}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Student</span>
            <span className="summary-value">{booking.profile.full_name}</span>
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

        <div className="form-group" style={{ marginTop: 16 }}>
          <label className="form-label">Rejection Reason (Optional)</label>
          <textarea
            className="form-textarea"
            placeholder="e.g. Court maintenance scheduled on this date."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
          />
        </div>

        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            className="btn-danger"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-red" /> Rejecting…
              </>
            ) : (
              <>
                <XCircle width={14} height={14} />
                Confirm Rejection
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ tab }: { tab: AdminTab }) {
  const copy: Record<AdminTab, { title: string; body: string }> = {
    pending: { title: "No bookings pending", body: "All caught up! No requests need your review." },
    all: { title: "No bookings found", body: "No booking records exist yet." },
    approved: { title: "No approved bookings", body: "No bookings have been approved yet." },
    rejected: { title: "No rejected bookings", body: "No bookings have been rejected." },
  };
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Calendar width={26} height={26} />
      </div>
      <p className="empty-title">{copy[tab].title}</p>
      <p className="empty-body">{copy[tab].body}</p>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("pending");
  const { bookings, loading, error, updateBookingStatus } = useAllBookings();
  const { profile } = useAuth();
  const [rejectTarget, setRejectTarget] = useState<any | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "danger"; msg: string } | null>(null);
  const [activeSidebar, setActiveSidebar] = useState<string>("Overview");

  const pendingCount = bookings.filter((b: any) => b.status === "pending").length;
  const approvedCount = bookings.filter((b: any) => b.status === "approved").length;
  const rejectedCount = bookings.filter((b: any) => b.status === "rejected").length;

  const filtered =
    activeTab === "all"
      ? bookings
      : bookings.filter((b: any) => b.status === activeTab);

  const showToast = (type: "success" | "danger", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const handleApprove = async (id: string) => {
    const { error } = await updateBookingStatus(id, "approved");
    if (!error) {
      showToast("success", `Booking #${id.substring(0, 8)} approved successfully.`);
    } else {
      showToast("danger", error.message);
    }
  };

  const handleReject = async (id: string, _reason: string) => {
    const { error } = await updateBookingStatus(id, "rejected");
    if (!error) {
      setRejectTarget(null);
      showToast("danger", `Booking #${id.substring(0, 8)} has been rejected.`);
    } else {
      showToast("danger", error.message);
    }
  };

  const sidebarItems = [
    { label: "Overview", icon: <Home width={15} height={15} /> },
    { label: "All Bookings", icon: <List width={15} height={15} /> },
    { label: "Pending", icon: <Clock width={15} height={15} />, count: pendingCount },
    { label: "Courts", icon: <LayoutGrid width={15} height={15} /> },
    { label: "Users", icon: <User width={15} height={15} /> },
  ];

  const STATS = [
    { label: "Total Bookings", value: bookings.length.toString(), sub: "Lifetime count", subColor: "positive" },
    { label: "Pending Review", value: pendingCount.toString(), sub: "Needs attention", subColor: "pending" },
    { label: "Approved", value: approvedCount.toString(), sub: `${Math.round((approvedCount / (bookings.length || 1)) * 100)}% approval rate`, subColor: "positive" },
    { label: "Rejected", value: rejectedCount.toString(), sub: `${Math.round((rejectedCount / (bookings.length || 1)) * 100)}% rejection rate`, subColor: "muted" },
  ];

  return (
    <div className="page-bg">
      <Navbar activePage="admin" />

      {/* ── Toast ── */}
      {toast && (
        <div className="toast-wrapper">
          <div className={`toast toast-${toast.type}`}>
            {toast.type === "success" ? (
              <CheckCircle2 width={15} height={15} />
            ) : (
              <XCircle width={15} height={15} />
            )}
            {toast.msg}
            <button className="btn-ghost btn-sm" onClick={() => setToast(null)}>
              <X width={13} height={13} />
            </button>
          </div>
        </div>
      )}

      <div className="admin-layout">
        {/* ── Sidebar ── */}
        <aside className="sidebar">
          <div className="sidebar-section-label">Navigation</div>
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              className={`sidebar-item${activeSidebar === item.label ? " active" : ""}`}
              onClick={() => setActiveSidebar(item.label)}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.count !== undefined && item.count > 0 && (
                <span className="sidebar-badge">{item.count}</span>
              )}
            </button>
          ))}
        </aside>

        {/* ── Main Content ── */}
        <main className="admin-main">
          {/* Page Title */}
          <div className="admin-page-header">
            <div>
              <h1 className="page-title">Dashboard</h1>
              <p className="page-subtitle">Monitor and manage all court booking requests.</p>
            </div>
            <button className="btn-secondary" onClick={() => window.print()}>
              <Download width={14} height={14} />
              Export
            </button>
          </div>

          {/* ── Stat Cards ── */}
          <div className="stat-grid">
            {STATS.map((s) => (
              <div className="stat-card" key={s.label}>
                <p className="stat-label">{s.label}</p>
                <p
                  className={`stat-value${
                    s.subColor === "pending" ? " stat-value-pending" : ""
                  }`}
                >
                  {s.value}
                </p>
                <p
                  className={`stat-sub${
                    s.subColor === "pending"
                      ? " stat-sub-pending"
                      : s.subColor === "muted"
                      ? " stat-sub-muted"
                      : ""
                  }`}
                >
                  {s.sub}
                </p>
              </div>
            ))}
          </div>

          {/* ── Tabs + Table ── */}
          <div className="table-section">
            <div className="table-section-header">
              <div className="tabs-bar">
                {ADMIN_TABS.map((t) => (
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
            </div>

            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center' }}>Loading all bookings...</div>
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
                      <th>Student</th>
                      <th>Court</th>
                      <th>Date</th>
                      <th>Slot</th>
                      <th>Submitted</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((b: any) => {
                      const initials = b.profile.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().substring(0, 2);
                      return (
                        <tr key={b.id}>
                          <td>
                            <span className="booking-id">#{b.id.substring(0, 8)}</span>
                          </td>
                          <td>
                            <div className="user-cell">
                              <div className="user-avatar">{initials}</div>
                              <span className="user-name">{b.profile.full_name}</span>
                            </div>
                          </td>
                          <td>
                            <span className="court-cell-name">{b.court.name}</span>
                            <div style={{ marginTop: 4 }}>
                              <SportPill sport={b.court.sport} />
                            </div>
                          </td>
                          <td className="td-date">{format(new Date(b.booking_date), "EEE, d MMM")}</td>
                          <td>
                            <span className="slot-mono">{b.slot.start_time.substring(0, 5)} – {b.slot.end_time.substring(0, 5)}</span>
                          </td>
                          <td className="td-meta">{format(new Date(b.created_at), "d MMM, h:mm a")}</td>
                          <td>
                            <StatusBadge status={b.status} />
                          </td>
                          <td>
                            {b.status === "pending" ? (
                              <div className="action-btns">
                                <button
                                  className="btn-accent btn-sm"
                                  onClick={() => handleApprove(b.id)}
                                >
                                  <CheckCircle2 width={13} height={13} />
                                  Approve
                                </button>
                                <button
                                  className="btn-danger btn-sm"
                                  onClick={() => setRejectTarget(b)}
                                >
                                  <XCircle width={13} height={13} />
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className="td-meta">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {rejectTarget && (
        <RejectModal
          booking={rejectTarget}
          onClose={() => setRejectTarget(null)}
          onConfirm={handleReject}
        />
      )}
    </div>
  );
}
