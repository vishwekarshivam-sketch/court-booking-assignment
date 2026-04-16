import React, { useState } from "react";
import {
  LayoutGrid,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  Download,
  Home,
  List,
  User,
  X,
  ChevronRight,
} from "lucide-react";
import "./AdminDashboard.css";

/* ─── Types ─────────────────────────────────────────────── */
type BookingStatus = "pending" | "approved" | "rejected";
type Sport = "badminton" | "squash" | "tennis";
type AdminTab = "pending" | "all" | "approved" | "rejected";

interface Booking {
  id: string;
  courtName: string;
  sport: Sport;
  userName: string;
  userInitials: string;
  date: string;
  slot: string;
  status: BookingStatus;
  submittedAt: string;
}

/* ─── Mock Data ──────────────────────────────────────────── */
const BOOKINGS_MOCK: Booking[] = [
  {
    id: "BK-0041",
    courtName: "Badminton Court 1",
    sport: "badminton",
    userName: "Arjun Mehta",
    userInitials: "AM",
    date: "Fri, 18 Apr",
    slot: "07:00 – 08:00",
    status: "pending",
    submittedAt: "Today, 9:12 AM",
  },
  {
    id: "BK-0040",
    courtName: "Squash Court 2",
    sport: "squash",
    userName: "Priya Nair",
    userInitials: "PN",
    date: "Fri, 18 Apr",
    slot: "10:00 – 11:00",
    status: "pending",
    submittedAt: "Today, 8:55 AM",
  },
  {
    id: "BK-0039",
    courtName: "Tennis Court A",
    sport: "tennis",
    userName: "Rohan Verma",
    userInitials: "RV",
    date: "Thu, 17 Apr",
    slot: "15:00 – 16:00",
    status: "approved",
    submittedAt: "Yesterday, 4:30 PM",
  },
  {
    id: "BK-0038",
    courtName: "Badminton Court 2",
    sport: "badminton",
    userName: "Sneha Joshi",
    userInitials: "SJ",
    date: "Thu, 17 Apr",
    slot: "08:00 – 09:00",
    status: "approved",
    submittedAt: "Yesterday, 2:15 PM",
  },
  {
    id: "BK-0037",
    courtName: "Tennis Court B",
    sport: "tennis",
    userName: "Kunal Shah",
    userInitials: "KS",
    date: "Wed, 16 Apr",
    slot: "12:00 – 13:00",
    status: "rejected",
    submittedAt: "16 Apr, 11:00 AM",
  },
  {
    id: "BK-0036",
    courtName: "Squash Court 1",
    sport: "squash",
    userName: "Divya Rao",
    userInitials: "DR",
    date: "Wed, 16 Apr",
    slot: "17:00 – 18:00",
    status: "pending",
    submittedAt: "16 Apr, 9:40 AM",
  },
];

const STATS = [
  { label: "Total Bookings", value: "284", sub: "+12 this week", subColor: "positive" },
  { label: "Pending Review", value: "8", sub: "Needs attention", subColor: "pending" },
  { label: "Approved", value: "231", sub: "81% approval rate", subColor: "positive" },
  { label: "Rejected", value: "45", sub: "16% rejection rate", subColor: "muted" },
];

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
  };
  return (
    <span className={`badge badge-${status}`}>
      {icons[status]}
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
    setTimeout(() => {
      setLoading(false);
      onConfirm(booking.id, reason);
    }, 1000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Reject Booking</h2>
            <p className="modal-subtitle">
              Optionally provide a reason for {booking.userName}.
            </p>
          </div>
          <button className="btn-ghost" onClick={onClose}>
            <X width={16} height={16} />
          </button>
        </div>

        <div className="modal-summary">
          <div className="summary-row">
            <span className="summary-label">Booking</span>
            <span className="summary-value summary-mono">#{booking.id}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Student</span>
            <span className="summary-value">{booking.userName}</span>
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
  const [bookings, setBookings] = useState<Booking[]>(BOOKINGS_MOCK);
  const [rejectTarget, setRejectTarget] = useState<Booking | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "danger"; msg: string } | null>(null);
  const [activeSidebar, setActiveSidebar] = useState<string>("Overview");

  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  const filtered =
    activeTab === "all"
      ? bookings
      : bookings.filter((b) => b.status === activeTab);

  const showToast = (type: "success" | "danger", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const handleApprove = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "approved" } : b))
    );
    showToast("success", `Booking #${id} approved successfully.`);
  };

  const handleReject = (id: string, _reason: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "rejected" } : b))
    );
    setRejectTarget(null);
    showToast("danger", `Booking #${id} has been rejected.`);
  };

  const sidebarItems = [
    { label: "Overview", icon: <Home width={15} height={15} /> },
    { label: "All Bookings", icon: <List width={15} height={15} /> },
    { label: "Pending", icon: <Clock width={15} height={15} />, count: pendingCount },
    { label: "Courts", icon: <LayoutGrid width={15} height={15} /> },
    { label: "Users", icon: <User width={15} height={15} /> },
  ];

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
              <a href="/my-bookings" className="nav-link">
                <Calendar width={14} height={14} />
                My Bookings
              </a>
              <a href="/admin" className="nav-link active">
                <Home width={14} height={14} />
                Dashboard
              </a>
              <a href="/admin/courts" className="nav-link">
                <LayoutGrid width={14} height={14} />
                Manage Courts
              </a>
            </div>
          </div>
          <div className="navbar-right">
            <span className="nav-admin-badge">Admin</span>
            <span className="nav-name">Dr. Kavitha Iyer</span>
            <div className="avatar avatar-primary">KI</div>
          </div>
        </div>
      </nav>

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

          <div className="sidebar-section-label" style={{ marginTop: 20 }}>
            Management
          </div>
          <a href="/admin/courts" className="sidebar-item">
            <LayoutGrid width={15} height={15} />
            <span>Manage Courts</span>
            <ChevronRight width={13} height={13} style={{ marginLeft: "auto", opacity: 0.4 }} />
          </a>
        </aside>

        {/* ── Main Content ── */}
        <main className="admin-main">
          {/* Page Title */}
          <div className="admin-page-header">
            <div>
              <h1 className="page-title">Dashboard</h1>
              <p className="page-subtitle">Monitor and manage all court booking requests.</p>
            </div>
            <button className="btn-secondary">
              <Download width={14} height={14} />
              Export CSV
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

            {filtered.length === 0 ? (
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
                    {filtered.map((b) => (
                      <tr key={b.id}>
                        <td>
                          <span className="booking-id">#{b.id}</span>
                        </td>
                        <td>
                          <div className="user-cell">
                            <div className="user-avatar">{b.userInitials}</div>
                            <span className="user-name">{b.userName}</span>
                          </div>
                        </td>
                        <td>
                          <span className="court-cell-name">{b.courtName}</span>
                          <div style={{ marginTop: 4 }}>
                            <SportPill sport={b.sport} />
                          </div>
                        </td>
                        <td className="td-date">{b.date}</td>
                        <td>
                          <span className="slot-mono">{b.slot}</span>
                        </td>
                        <td className="td-meta">{b.submittedAt}</td>
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
                    ))}
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
