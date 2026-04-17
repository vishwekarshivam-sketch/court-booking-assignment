import { useState } from "react";
import { User, LogOut, Settings, CheckCircle2, Clock, XCircle, Calendar, ChevronRight } from "lucide-react";
import "./ProfilePage.css";

const RECENT_BOOKINGS = [
  { id: "BK-0041", court: "Badminton Court 1", sport: "Badminton", date: "Apr 17, 2026", slot: "10:00 – 11:00", status: "approved" },
  { id: "BK-0038", court: "Squash Court A",    sport: "Squash",    date: "Apr 15, 2026", slot: "07:00 – 08:00", status: "approved" },
  { id: "BK-0035", court: "Tennis Court 1",    sport: "Tennis",    date: "Apr 14, 2026", slot: "16:00 – 17:00", status: "pending"  },
  { id: "BK-0031", court: "Badminton Court 2", sport: "Badminton", date: "Apr 12, 2026", slot: "09:00 – 10:00", status: "rejected" },
];

const SPORT_STATS = [
  { sport: "Badminton", sessions: 14, color: "#0F5C30", bg: "#E8F5EE" },
  { sport: "Squash",    sessions: 7,  color: "#1A3A6B", bg: "#E8EEF8" },
  { sport: "Tennis",    sessions: 5,  color: "#7A5000", bg: "#FFF3D6" },
];
const TOTAL = SPORT_STATS.reduce((a, s) => a + s.sessions, 0);

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`cb-badge cb-badge-${status}`}>
    <span className="cb-badge-dot" />
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"bookings" | "stats">("bookings");

  return (
    <div className="cb-root">
      {/* Navbar */}
      <nav className="cb-nav">
        <div className="cb-logo">Court<span>Book</span></div>
        <div className="cb-nav-links">
          <a className="cb-nav-link">Courts</a>
          <a className="cb-nav-link">My Bookings</a>
          <a className="cb-nav-link">Schedule</a>
        </div>
        <div className="cb-nav-right">
          <div className="cb-avatar cb-avatar-active">SS</div>
          <span className="cb-name">Shivam</span>
        </div>
      </nav>

      <div className="cb-page">
        <div className="cb-profile-layout">
          {/* Left — Profile card */}
          <aside className="cb-profile-aside">
            <div className="cb-profile-card">
              <div className="cb-profile-avatar">SS</div>
              <div className="cb-profile-name">Shivam Sharma</div>
              <div className="cb-profile-email">25b3015@iitb.ac.in</div>
              <div className="cb-profile-role-pill">Student · IITB</div>

              <div className="cb-divider" />

              <div className="cb-profile-stat-row">
                <div className="cb-profile-stat">
                  <span className="cb-profile-stat-val">26</span>
                  <span className="cb-profile-stat-label">Total Bookings</span>
                </div>
                <div className="cb-profile-stat-sep" />
                <div className="cb-profile-stat">
                  <span className="cb-profile-stat-val">3</span>
                  <span className="cb-profile-stat-label">This Month</span>
                </div>
              </div>

              <div className="cb-divider" />

              <nav className="cb-profile-nav">
                <button className="cb-profile-nav-item active">
                  <User width={15} height={15} />
                  Profile
                </button>
                <button className="cb-profile-nav-item">
                  <Calendar width={15} height={15} />
                  My Bookings
                </button>
                <button className="cb-profile-nav-item">
                  <Settings width={15} height={15} />
                  Preferences
                </button>
                <button className="cb-profile-nav-item cb-logout">
                  <LogOut width={15} height={15} />
                  Sign Out
                </button>
              </nav>
            </div>
          </aside>

          {/* Right — Main content */}
          <div className="cb-profile-main">
            {/* Info Card */}
            <div className="cb-card cb-info-card">
              <div className="cb-card-header">
                <span className="cb-card-title">Account Info</span>
                <button className="cb-btn-secondary cb-btn-sm">Edit Profile</button>
              </div>
              <div className="cb-info-grid">
                <div className="cb-info-row">
                  <span className="cb-info-label">Full Name</span>
                  <span className="cb-info-val">Shivam Sharma</span>
                </div>
                <div className="cb-info-row">
                  <span className="cb-info-label">Email</span>
                  <span className="cb-info-val">25b3015@iitb.ac.in</span>
                </div>
                <div className="cb-info-row">
                  <span className="cb-info-label">Roll Number</span>
                  <span className="cb-info-val cb-mono">25B3015</span>
                </div>
                <div className="cb-info-row">
                  <span className="cb-info-label">Department</span>
                  <span className="cb-info-val">Electrical Engineering</span>
                </div>
                <div className="cb-info-row">
                  <span className="cb-info-label">Year</span>
                  <span className="cb-info-val">1st Year UG</span>
                </div>
                <div className="cb-info-row">
                  <span className="cb-info-label">Member Since</span>
                  <span className="cb-info-val">January 2025</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="cb-tabs">
              <button
                className={`cb-tab${activeTab === "bookings" ? " active" : ""}`}
                onClick={() => setActiveTab("bookings")}
              >
                Recent Bookings
              </button>
              <button
                className={`cb-tab${activeTab === "stats" ? " active" : ""}`}
                onClick={() => setActiveTab("stats")}
              >
                Sport Stats
              </button>
            </div>

            {/* Bookings table */}
            {activeTab === "bookings" && (
              <div className="cb-card">
                <table className="cb-table">
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Court</th>
                      <th>Date</th>
                      <th>Slot</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RECENT_BOOKINGS.map((b) => (
                      <tr key={b.id}>
                        <td><span className="cb-booking-id">#{b.id}</span></td>
                        <td>
                          <span className="cb-court-name">{b.court}</span>
                          <span className={`sport-pill ${b.sport.toLowerCase()}`}>{b.sport}</span>
                        </td>
                        <td className="cb-meta">{b.date}</td>
                        <td><span className="cb-mono">{b.slot}</span></td>
                        <td><StatusBadge status={b.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="cb-table-footer">
                  <button className="cb-btn-ghost">
                    View all bookings <ChevronRight width={14} height={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Sport stats */}
            {activeTab === "stats" && (
              <div className="cb-stats-section">
                <div className="cb-stat-cards-row">
                  <div className="cb-stat-card">
                    <div className="cb-stat-label">Total Sessions</div>
                    <div className="cb-stat-val">{TOTAL}</div>
                    <div className="cb-stat-sub">All time</div>
                  </div>
                  <div className="cb-stat-card">
                    <div className="cb-stat-label">Approved</div>
                    <div className="cb-stat-val" style={{ color: "#1D7A4A" }}>21</div>
                    <div className="cb-stat-sub" style={{ color: "#1D7A4A" }}>+3 this month</div>
                  </div>
                  <div className="cb-stat-card">
                    <div className="cb-stat-label">Pending</div>
                    <div className="cb-stat-val" style={{ color: "#D4900A" }}>2</div>
                    <div className="cb-stat-sub" style={{ color: "#D4900A" }}>Awaiting review</div>
                  </div>
                </div>

                <div className="cb-card cb-sport-breakdown">
                  <div className="cb-card-header">
                    <span className="cb-card-title">Sport Breakdown</span>
                  </div>
                  {SPORT_STATS.map((s) => (
                    <div key={s.sport} className="cb-sport-row">
                      <span className={`sport-pill ${s.sport.toLowerCase()}`}>{s.sport}</span>
                      <div className="cb-sport-bar-wrap">
                        <div
                          className="cb-sport-bar"
                          style={{
                            width: `${(s.sessions / TOTAL) * 100}%`,
                            background: s.color,
                          }}
                        />
                      </div>
                      <span className="cb-sport-count">{s.sessions} sessions</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
