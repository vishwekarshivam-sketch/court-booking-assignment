import React, { useState } from "react";
import "./CourtsPage.css";

// ─── Types ──────────────────────────────────────────────────────────────────

type Sport = "badminton" | "squash" | "tennis";

interface Court {
  id: string;
  name: string;
  sport: Sport;
  availableSlots: number; // 0 = fully booked
}

// ─── Mock data ───────────────────────────────────────────────────────────────

const COURTS: Court[] = [
  { id: "1", name: "Badminton Court 1", sport: "badminton", availableSlots: 5 },
  { id: "2", name: "Badminton Court 2", sport: "badminton", availableSlots: 0 },
  { id: "3", name: "Badminton Court 3", sport: "badminton", availableSlots: 3 },
  { id: "4", name: "Squash Court 1",    sport: "squash",    availableSlots: 2 },
  { id: "5", name: "Squash Court 2",    sport: "squash",    availableSlots: 0 },
  { id: "6", name: "Tennis Court 1",    sport: "tennis",    availableSlots: 7 },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

const SPORT_ICONS: Record<Sport, JSX.Element> = {
  badminton: (
    // Shuttlecock-inspired icon
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="24" r="5" stroke="#1D7A4A" strokeWidth="1.8" fill="none"/>
      <line x1="18" y1="19" x2="18" y2="8" stroke="#1D7A4A" strokeWidth="1.8"/>
      <line x1="18" y1="8" x2="13" y2="12" stroke="#1D7A4A" strokeWidth="1.4"/>
      <line x1="18" y1="8" x2="23" y2="12" stroke="#1D7A4A" strokeWidth="1.4"/>
      <line x1="18" y1="11" x2="12" y2="16" stroke="#1D7A4A" strokeWidth="1.2"/>
      <line x1="18" y1="11" x2="24" y2="16" stroke="#1D7A4A" strokeWidth="1.2"/>
    </svg>
  ),
  squash: (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="9" y="9" width="18" height="18" rx="3" stroke="#1A3A6B" strokeWidth="1.8" fill="none"/>
      <line x1="9" y1="18" x2="27" y2="18" stroke="#1A3A6B" strokeWidth="1.2"/>
      <line x1="18" y1="9" x2="18" y2="27" stroke="#1A3A6B" strokeWidth="1.2"/>
      <circle cx="18" cy="18" r="2.5" fill="#1A3A6B"/>
    </svg>
  ),
  tennis: (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="18" r="9" stroke="#7A5000" strokeWidth="1.8" fill="none"/>
      <path d="M13 11.5 Q18 18 13 24.5" stroke="#7A5000" strokeWidth="1.4" fill="none"/>
      <path d="M23 11.5 Q18 18 23 24.5" stroke="#7A5000" strokeWidth="1.4" fill="none"/>
    </svg>
  ),
};

const SPORT_LABELS: Record<Sport, string> = {
  badminton: "Badminton",
  squash: "Squash",
  tennis: "Tennis",
};

interface SportPillProps {
  sport: Sport;
}

const SportPill: React.FC<SportPillProps> = ({ sport }) => (
  <span className={`sport-pill sport-pill--${sport}`}>{SPORT_LABELS[sport]}</span>
);

interface CourtCardProps {
  court: Court;
  onBook: (court: Court) => void;
}

const CourtCard: React.FC<CourtCardProps> = ({ court, onBook }) => {
  const available = court.availableSlots > 0;

  return (
    <div className={`court-card${!available ? " court-card--full" : ""}`}>
      <div className={`court-card__header court-card__header--${court.sport}`}>
        {SPORT_ICONS[court.sport]}
      </div>

      <div className="court-card__body">
        <p className="court-card__name">{court.name}</p>
        <SportPill sport={court.sport} />
      </div>

      <div className="court-card__footer">
        <div className="court-card__availability">
          <span className={`availability-dot${available ? "" : " availability-dot--full"}`} />
          <span className={`availability-label${available ? "" : " availability-label--full"}`}>
            {available ? `${court.availableSlots} slots today` : "Fully booked"}
          </span>
        </div>

        {available ? (
          <button
            className="btn-accent btn-sm"
            onClick={() => onBook(court)}
          >
            Book
          </button>
        ) : (
          <button className="btn-secondary btn-sm" disabled>
            Book
          </button>
        )}
      </div>
    </div>
  );
};

// ─── Navbar ──────────────────────────────────────────────────────────────────

const Navbar: React.FC = () => (
  <nav className="navbar">
    <div className="navbar__inner">
      <div className="navbar__logo">
        <span className="logo-court">Court</span>
        <span className="logo-book">Book</span>
      </div>

      <div className="navbar__links">
        <a href="/courts" className="nav-link nav-link--active">Courts</a>
        <a href="/my-bookings" className="nav-link">My Bookings</a>
        <a href="/schedule" className="nav-link">Schedule</a>
      </div>

      <div className="navbar__user">
        <span className="navbar__name">Aditya K.</span>
        <div className="navbar__avatar">AK</div>
      </div>
    </div>
  </nav>
);

// ─── Tab bar ─────────────────────────────────────────────────────────────────

type FilterTab = "all" | Sport;

const TABS: { value: FilterTab; label: string }[] = [
  { value: "all",       label: "All Sports" },
  { value: "badminton", label: "Badminton"  },
  { value: "squash",    label: "Squash"     },
  { value: "tennis",    label: "Tennis"     },
];

// ─── Page ────────────────────────────────────────────────────────────────────

const CourtsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const filtered = activeTab === "all"
    ? COURTS
    : COURTS.filter((c) => c.sport === activeTab);

  const handleBook = (court: Court) => {
    // TODO: navigate to /courts/:id
    console.log("Book court", court.id);
  };

  return (
    <div className="page-root">
      <Navbar />

      <main className="page-shell">
        {/* Page header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Book a Court</h1>
            <p className="page-subtitle">Select a sport and pick an available court to get started.</p>
          </div>
        </div>

        {/* Sport filter tabs */}
        <div className="tabs-bar">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              className={`tab-item${activeTab === tab.value ? " tab-item--active" : ""}`}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Court grid */}
        {filtered.length > 0 ? (
          <div className="courts-grid">
            {filtered.map((court) => (
              <CourtCard key={court.id} court={court} onBook={handleBook} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p className="empty-state__title">No courts found</p>
            <p className="empty-state__body">No courts match the selected filter.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CourtsPage;
