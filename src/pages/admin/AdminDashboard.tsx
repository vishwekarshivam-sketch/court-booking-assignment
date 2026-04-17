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
  Calendar,
  Shield,
  ShieldOff,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { format } from "date-fns";
import { useAllBookings } from "../../hooks/useAllBookings";
import { useAdminCourts } from "../../hooks/useAdminCourts";
import { useAdminUsers } from "../../hooks/useAdminUsers";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "./AdminDashboard.css";

/* ─── Types ─────────────────────────────────────────────── */
type BookingStatus = "pending" | "approved" | "rejected" | "cancelled";
type Sport = "badminton" | "squash" | "tennis";
type AdminTab = "pending" | "all" | "approved" | "rejected";
type SidebarView = "Overview" | "All Bookings" | "Pending" | "Courts" | "Users";

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
  { key: "pending",  label: "Pending"      },
  { key: "all",      label: "All Bookings" },
  { key: "approved", label: "Approved"     },
  { key: "rejected", label: "Rejected"     },
];

const SPORT_COLOR: Record<Sport, string> = {
  badminton: "#059669",
  squash:    "#ea580c",
  tennis:    "#7c3aed",
};

/* ─── Sub-components ─────────────────────────────────────── */
function SportPill({ sport }: { sport: Sport }) {
  return <span className={`sport-pill ${sport}`}>{sport.charAt(0).toUpperCase() + sport.slice(1)}</span>;
}

function StatusBadge({ status }: { status: BookingStatus }) {
  const icons = {
    approved:  <CheckCircle2 width={12} height={12} />,
    pending:   <Clock width={12} height={12} />,
    rejected:  <XCircle width={12} height={12} />,
    cancelled: <XCircle width={12} height={12} />,
  };
  return (
    <span className={`badge badge-${status}`}>
      {icons[status]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function RejectModal({ booking, onClose, onConfirm }: {
  booking: Booking;
  onClose: () => void;
  onConfirm: (id: string, reason: string) => void;
}) {
  const [reason, setReason]   = useState("");
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
            <p className="modal-subtitle">Provide a reason for the rejection.</p>
          </div>
          <button className="btn-ghost btn-sm" onClick={onClose}><X width={14} height={14} /></button>
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
          <button className="btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn-danger" onClick={handleConfirm} disabled={loading}>
            {loading ? <><span className="spinner-red" /> Rejecting…</> : "Confirm Rejection →"}
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ tab }: { tab: AdminTab }) {
  const copy: Record<AdminTab, { title: string; body: string }> = {
    pending:  { title: "No bookings pending",    body: "All caught up! No requests need your review." },
    all:      { title: "No bookings found",       body: "No booking records exist yet."               },
    approved: { title: "No approved bookings",    body: "No bookings have been approved yet."         },
    rejected: { title: "No rejected bookings",    body: "No bookings have been rejected."             },
  };
  return (
    <div className="empty-state">
      <div className="empty-icon"><Calendar width={26} height={26} /></div>
      <p className="empty-title">{copy[tab].title}</p>
      <p className="empty-body">{copy[tab].body}</p>
    </div>
  );
}

/* ─── Courts Section ─────────────────────────────────────── */
function CourtsSection() {
  const { courts, loading, error, toggleActive } = useAdminCourts();
  const [toggling, setToggling] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "danger"; msg: string } | null>(null);

  const showToast = (type: "success" | "danger", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const handleToggle = async (court: any) => {
    setToggling(court.id);
    const { error } = await toggleActive(court.id, court.is_active);
    setToggling(null);
    if (error) {
      showToast("danger", `Failed to update ${court.name}.`);
    } else {
      showToast("success", `${court.name} is now ${court.is_active ? "disabled" : "enabled"}.`);
    }
  };

  const activeCount   = courts.filter((c: any) => c.is_active).length;
  const disabledCount = courts.filter((c: any) => !c.is_active).length;

  return (
    <>
      {toast && (
        <div className="toast-wrapper">
          <div className={`toast toast-${toast.type}`}>
            {toast.type === "success" ? <CheckCircle2 width={15} height={15} /> : <XCircle width={15} height={15} />}
            {toast.msg}
            <button className="btn-ghost btn-sm" onClick={() => setToast(null)}><X width={13} height={13} /></button>
          </div>
        </div>
      )}

      <div className="admin-page-header">
        <div>
          <p className="page-eyebrow">IIT Bombay · Sports Complex</p>
          <h1 className="page-title">Court<br /><span className="accent">Management.</span></h1>
          <p className="page-subtitle">Enable or disable courts for bookings.</p>
        </div>
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="stat-card">
          <p className="stat-label">Total Courts</p>
          <p className="stat-value">{courts.length}</p>
          <p className="stat-sub">All sports</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Active</p>
          <p className="stat-value">{activeCount}</p>
          <p className="stat-sub">Accepting bookings</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Disabled</p>
          <p className="stat-value stat-value-pending">{disabledCount}</p>
          <p className="stat-sub stat-sub-pending">{disabledCount > 0 ? "Under maintenance" : "All courts active"}</p>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading">Loading courts…</div>
      ) : error ? (
        <div className="admin-error">⚠ Failed to load courts.</div>
      ) : (
        <div className="table-card" style={{ borderTop: "1px solid #e2e8f0", borderRadius: 12 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Court</th>
                <th>Sport</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {courts.map((court: any) => (
                <tr key={court.id}>
                  <td>
                    <span className="court-cell-name">{court.name}</span>
                  </td>
                  <td>
                    <SportPill sport={court.sport} />
                  </td>
                  <td>
                    {court.is_active ? (
                      <span className="badge badge-approved">
                        <CheckCircle2 width={11} height={11} /> Active
                      </span>
                    ) : (
                      <span className="badge badge-cancelled">
                        <XCircle width={11} height={11} /> Disabled
                      </span>
                    )}
                  </td>
                  <td>
                    <button
                      className={court.is_active ? "btn-danger btn-sm" : "btn-accent btn-sm"}
                      onClick={() => handleToggle(court)}
                      disabled={toggling === court.id}
                    >
                      {toggling === court.id ? (
                        <span className="spinner-red" style={{ borderTopColor: court.is_active ? "#dc2626" : "#16a34a" }} />
                      ) : court.is_active ? (
                        <><ToggleLeft width={13} height={13} /> Disable</>
                      ) : (
                        <><ToggleRight width={13} height={13} /> Enable</>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

/* ─── Users Section ──────────────────────────────────────── */
function UsersSection() {
  const { users, loading, error, toggleRole } = useAdminUsers();
  const { profile: currentProfile } = useAuth();
  const [toggling, setToggling]     = useState<string | null>(null);
  const [toast, setToast]           = useState<{ type: "success" | "danger"; msg: string } | null>(null);

  const showToast = (type: "success" | "danger", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const handleToggleRole = async (user: any) => {
    if (user.id === (currentProfile as any)?.id) {
      showToast("danger", "Cannot change your own role.");
      return;
    }
    setToggling(user.id);
    const { error } = await toggleRole(user.id, user.role);
    setToggling(null);
    if (error) {
      showToast("danger", `Failed to update ${user.full_name}.`);
    } else {
      const newRole = user.role === "admin" ? "user" : "admin";
      showToast("success", `${user.full_name} is now ${newRole}.`);
    }
  };

  const adminCount = users.filter((u: any) => u.role === "admin").length;
  const userCount  = users.filter((u: any) => u.role === "user").length;

  return (
    <>
      {toast && (
        <div className="toast-wrapper">
          <div className={`toast toast-${toast.type}`}>
            {toast.type === "success" ? <CheckCircle2 width={15} height={15} /> : <XCircle width={15} height={15} />}
            {toast.msg}
            <button className="btn-ghost btn-sm" onClick={() => setToast(null)}><X width={13} height={13} /></button>
          </div>
        </div>
      )}

      <div className="admin-page-header">
        <div>
          <p className="page-eyebrow">IIT Bombay · Sports Complex</p>
          <h1 className="page-title">User<br /><span className="accent">Management.</span></h1>
          <p className="page-subtitle">View all registered users and manage roles.</p>
        </div>
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="stat-card">
          <p className="stat-label">Total Users</p>
          <p className="stat-value">{users.length}</p>
          <p className="stat-sub">Registered accounts</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Admins</p>
          <p className="stat-value">{adminCount}</p>
          <p className="stat-sub">With admin access</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Students</p>
          <p className="stat-value">{userCount}</p>
          <p className="stat-sub">Standard accounts</p>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading">Loading users…</div>
      ) : error ? (
        <div className="admin-error">⚠ Failed to load users.</div>
      ) : (
        <div className="table-card" style={{ borderTop: "1px solid #e2e8f0", borderRadius: 12 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: any) => {
                const initials = user.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().substring(0, 2);
                const isSelf = user.id === (currentProfile as any)?.id;
                return (
                  <tr key={user.id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar">{initials}</div>
                        <span className="user-name">
                          {user.full_name}
                          {isSelf && <span className="self-tag"> (you)</span>}
                        </span>
                      </div>
                    </td>
                    <td>
                      {user.role === "admin" ? (
                        <span className="badge badge-pending">
                          <Shield width={11} height={11} /> Admin
                        </span>
                      ) : (
                        <span className="badge badge-cancelled">
                          <User width={11} height={11} /> User
                        </span>
                      )}
                    </td>
                    <td className="td-meta">{format(new Date(user.created_at), "d MMM yyyy")}</td>
                    <td>
                      <button
                        className={user.role === "admin" ? "btn-danger btn-sm" : "btn-accent btn-sm"}
                        onClick={() => handleToggleRole(user)}
                        disabled={toggling === user.id || isSelf}
                        title={isSelf ? "Cannot change your own role" : undefined}
                      >
                        {toggling === user.id ? (
                          <span className="spinner-red" />
                        ) : user.role === "admin" ? (
                          <><ShieldOff width={13} height={13} /> Demote</>
                        ) : (
                          <><Shield width={13} height={13} /> Promote</>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function AdminDashboard() {
  const [activeTab,     setActiveTab]     = useState<AdminTab>("pending");
  const [activeSidebar, setActiveSidebar] = useState<SidebarView>("Overview");
  const [rejectTarget,  setRejectTarget]  = useState<any | null>(null);
  const [toast,         setToast]         = useState<{ type: "success" | "danger"; msg: string } | null>(null);

  const { bookings, loading, error, updateBookingStatus } = useAllBookings();
  const { profile } = useAuth();

  const pendingCount  = bookings.filter((b: any) => b.status === "pending").length;
  const approvedCount = bookings.filter((b: any) => b.status === "approved").length;
  const rejectedCount = bookings.filter((b: any) => b.status === "rejected").length;

  const filtered =
    activeTab === "all" ? bookings : bookings.filter((b: any) => b.status === activeTab);

  const showToast = (type: "success" | "danger", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const handleApprove = async (id: string) => {
    const { error } = await updateBookingStatus(id, "approved");
    if (!error) showToast("success", `Booking #${id.substring(0, 8)} approved.`);
    else        showToast("danger",  error.message);
  };

  const handleReject = async (id: string, _reason: string) => {
    const { error } = await updateBookingStatus(id, "rejected");
    if (!error) { setRejectTarget(null); showToast("danger", `Booking #${id.substring(0, 8)} rejected.`); }
    else        showToast("danger", error.message);
  };

  const sidebarItems: { label: SidebarView; icon: React.ReactNode; count?: number }[] = [
    { label: "Overview",     icon: <Home      width={15} height={15} /> },
    { label: "All Bookings", icon: <List      width={15} height={15} /> },
    { label: "Pending",      icon: <Clock     width={15} height={15} />, count: pendingCount },
    { label: "Courts",       icon: <LayoutGrid width={15} height={15} /> },
    { label: "Users",        icon: <User      width={15} height={15} /> },
  ];

  const STATS = [
    { label: "Total Bookings",  value: bookings.length.toString(),   sub: "Lifetime count",    subColor: "positive" },
    { label: "Pending Review",  value: pendingCount.toString(),       sub: "Needs attention",   subColor: "pending"  },
    { label: "Approved",        value: approvedCount.toString(),      sub: `${Math.round((approvedCount / (bookings.length || 1)) * 100)}% approval rate`,  subColor: "positive" },
    { label: "Rejected",        value: rejectedCount.toString(),      sub: `${Math.round((rejectedCount / (bookings.length || 1)) * 100)}% rejection rate`, subColor: "muted"    },
  ];

  /* bookings table — shared between Overview / All Bookings / Pending */
  const showBookingsView = activeSidebar === "Overview" || activeSidebar === "All Bookings" || activeSidebar === "Pending";

  /* auto-set tab when clicking sidebar shortcut */
  const handleSidebarClick = (label: SidebarView) => {
    setActiveSidebar(label);
    if (label === "Pending")      setActiveTab("pending");
    if (label === "All Bookings") setActiveTab("all");
  };

  return (
    <div className="page-bg">
      <Navbar activePage="admin" />

      {toast && (
        <div className="toast-wrapper">
          <div className={`toast toast-${toast.type}`}>
            {toast.type === "success" ? <CheckCircle2 width={15} height={15} /> : <XCircle width={15} height={15} />}
            {toast.msg}
            <button className="btn-ghost btn-sm" onClick={() => setToast(null)}><X width={13} height={13} /></button>
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
              onClick={() => handleSidebarClick(item.label)}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.count !== undefined && item.count > 0 && (
                <span className="sidebar-badge">{item.count}</span>
              )}
            </button>
          ))}
        </aside>

        {/* ── Main ── */}
        <main className="admin-main">

          {/* Courts view */}
          {activeSidebar === "Courts" && <CourtsSection />}

          {/* Users view */}
          {activeSidebar === "Users" && <UsersSection />}

          {/* Bookings view (Overview / All Bookings / Pending) */}
          {showBookingsView && (
            <>
              <div className="admin-page-header">
                <div>
                  <p className="page-eyebrow">IIT Bombay · Sports Complex</p>
                  <h1 className="page-title">Admin<br /><span className="accent">Dashboard.</span></h1>
                  <p className="page-subtitle">Monitor and manage all court booking requests.</p>
                </div>
                <button className="btn-secondary" onClick={() => window.print()}>
                  <Download width={14} height={14} />
                  Export
                </button>
              </div>

              <div className="stat-grid">
                {STATS.map((s) => (
                  <div className="stat-card" key={s.label}>
                    <p className="stat-label">{s.label}</p>
                    <p className={`stat-value${s.subColor === "pending" ? " stat-value-pending" : ""}`}>
                      {s.value}
                    </p>
                    <p className={`stat-sub${s.subColor === "pending" ? " stat-sub-pending" : s.subColor === "muted" ? " stat-sub-muted" : ""}`}>
                      {s.sub}
                    </p>
                  </div>
                ))}
              </div>

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
                  <div className="admin-loading">Loading bookings…</div>
                ) : error ? (
                  <div className="admin-error">⚠ Error loading bookings.</div>
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
                              <td><span className="booking-id">#{b.id.substring(0, 8)}</span></td>
                              <td>
                                <div className="user-cell">
                                  <div className="user-avatar">{initials}</div>
                                  <span className="user-name">{b.profile.full_name}</span>
                                </div>
                              </td>
                              <td>
                                <span className="court-cell-name">{b.court.name}</span>
                                <div style={{ marginTop: 4 }}><SportPill sport={b.court.sport} /></div>
                              </td>
                              <td className="td-date">{format(new Date(b.booking_date), "EEE, d MMM")}</td>
                              <td><span className="slot-mono">{b.slot.start_time.substring(0, 5)} – {b.slot.end_time.substring(0, 5)}</span></td>
                              <td className="td-meta">{format(new Date(b.created_at), "d MMM, h:mm a")}</td>
                              <td><StatusBadge status={b.status} /></td>
                              <td>
                                {b.status === "pending" ? (
                                  <div className="action-btns">
                                    <button className="btn-accent btn-sm" onClick={() => handleApprove(b.id)}>Approve</button>
                                    <button className="btn-danger btn-sm"  onClick={() => setRejectTarget(b)}>Reject</button>
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
            </>
          )}
        </main>
      </div>

      <Footer />

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
