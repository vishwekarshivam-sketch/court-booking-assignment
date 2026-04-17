import { useState } from "react";
import { Plus, LayoutGrid, Calendar, Clock, CheckCircle2, ChevronRight } from "lucide-react";
import "./CourtsPage.css";

const SPORTS = ["All Sports", "Badminton", "Squash", "Tennis"];

const COURTS = [
  { id: "CT-001", name: "Badminton Court 1", sport: "Badminton", slotsToday: 8, status: "available" },
  { id: "CT-002", name: "Badminton Court 2", sport: "Badminton", slotsToday: 3, status: "available" },
  { id: "CT-003", name: "Badminton Court 3", sport: "Badminton", slotsToday: 0, status: "full" },
  { id: "CT-004", name: "Squash Court A",    sport: "Squash",    slotsToday: 5, status: "available" },
  { id: "CT-005", name: "Squash Court B",    sport: "Squash",    slotsToday: 0, status: "full" },
  { id: "CT-006", name: "Tennis Court 1",    sport: "Tennis",    slotsToday: 11, status: "available" },
  { id: "CT-007", name: "Tennis Court 2",    sport: "Tennis",    slotsToday: 6, status: "available" },
  { id: "CT-008", name: "Tennis Court 3",    sport: "Tennis",    slotsToday: 2, status: "available" },
];

const SportIcon = ({ sport }: { sport: string }) => {
  if (sport === "Badminton") return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="10" r="7" stroke="#0F5C30" strokeWidth="2"/>
      <path d="M18 17v12" stroke="#0F5C30" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M13 21h10" stroke="#0F5C30" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
  if (sport === "Squash") return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect x="6" y="6" width="24" height="24" rx="4" stroke="#1A3A6B" strokeWidth="2"/>
      <circle cx="18" cy="18" r="5" stroke="#1A3A6B" strokeWidth="2"/>
    </svg>
  );
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="12" stroke="#7A5000" strokeWidth="2"/>
      <path d="M10 10 Q18 18 26 10" stroke="#7A5000" strokeWidth="1.5" fill="none"/>
      <path d="M10 26 Q18 18 26 26" stroke="#7A5000" strokeWidth="1.5" fill="none"/>
    </svg>
  );
};

export default function CourtsPage() {
  const [activeSport, setActiveSport] = useState("All Sports");

  const filtered = COURTS.filter(
    (c) => activeSport === "All Sports" || c.sport === activeSport
  );

  return (
    <div className="cb-root">
      {/* Navbar */}
      <nav className="cb-nav">
        <div className="cb-logo">Court<span>Book</span></div>
        <div className="cb-nav-links">
          <a className="cb-nav-link active">Courts</a>
          <a className="cb-nav-link">My Bookings</a>
          <a className="cb-nav-link">Schedule</a>
        </div>
        <div className="cb-nav-right">
          <div className="cb-avatar">SS</div>
          <span className="cb-name">Shivam</span>
        </div>
      </nav>

      {/* Page */}
      <div className="cb-page">
        <div className="cb-page-header">
          <div>
            <h1 className="cb-page-title">Book a Court</h1>
            <p className="cb-page-sub">Select a sport and pick an available court to get started.</p>
          </div>
          <button className="cb-btn-primary">
            <Calendar width={16} height={16} />
            View Schedule
          </button>
        </div>

        {/* Sport Filter Tabs */}
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

        {/* Courts Grid */}
        <div className="cb-courts-grid">
          {filtered.map((court) => (
            <div key={court.id} className={`cb-court-card ${court.status === "full" ? "full" : ""}`}>
              <div className={`cb-court-header sport-${court.sport.toLowerCase()}`}>
                <SportIcon sport={court.sport} />
              </div>
              <div className="cb-court-body">
                <span className="cb-court-name">{court.name}</span>
                <span className={`sport-pill ${court.sport.toLowerCase()}`}>{court.sport}</span>
              </div>
              <div className="cb-court-footer">
                <span className={`cb-avail ${court.status}`}>
                  <span className="cb-avail-dot" />
                  {court.status === "available"
                    ? `${court.slotsToday} slots today`
                    : "Fully booked"}
                </span>
                {court.status === "available" ? (
                  <button className="cb-btn-accent cb-btn-sm">
                    Book <ChevronRight width={13} height={13} />
                  </button>
                ) : (
                  <button className="cb-btn-secondary cb-btn-sm" disabled>
                    Full
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="cb-empty">
            <LayoutGrid width={24} height={24} />
            <p className="cb-empty-title">No courts found</p>
            <p className="cb-empty-body">Try selecting a different sport.</p>
          </div>
        )}
      </div>
    </div>
  );
}
