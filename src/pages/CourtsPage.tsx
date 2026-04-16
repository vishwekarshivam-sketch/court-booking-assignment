import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCourts } from "../hooks/useCourts";
import Navbar from "../components/Navbar";
import "./CourtsPage.css";

// ─── Types ──────────────────────────────────────────────────────────────────

type Sport = "badminton" | "squash" | "tennis";

interface Court {
  id: string;
  name: string;
  sport: Sport;
  is_active: boolean;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

const SPORT_ICONS: Record<Sport, JSX.Element> = {
  badminton: (
    /* Shuttlecock: cork base bottom-center, feathers fanning upward */
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Cork base */}
      <ellipse cx="24" cy="40" rx="5" ry="4" stroke="#1D7A4A" strokeWidth="2" fill="none"/>
      {/* Collar line on cork */}
      <line x1="19" y1="37.5" x2="29" y2="37.5" stroke="#1D7A4A" strokeWidth="1.4"/>
      {/* Feather stems — 6 feathers fanning from cork top */}
      <line x1="24" y1="36" x2="10" y2="10" stroke="#1D7A4A" strokeWidth="1.4"/>
      <line x1="24" y1="36" x2="15" y2="7"  stroke="#1D7A4A" strokeWidth="1.4"/>
      <line x1="24" y1="36" x2="21" y2="5"  stroke="#1D7A4A" strokeWidth="1.4"/>
      <line x1="24" y1="36" x2="27" y2="5"  stroke="#1D7A4A" strokeWidth="1.4"/>
      <line x1="24" y1="36" x2="33" y2="7"  stroke="#1D7A4A" strokeWidth="1.4"/>
      <line x1="24" y1="36" x2="38" y2="10" stroke="#1D7A4A" strokeWidth="1.4"/>
      {/* Feather blades — elongated ovals along each stem */}
      <ellipse cx="12" cy="13" rx="3.5" ry="7" transform="rotate(-55 12 13)" stroke="#1D7A4A" strokeWidth="1.4" fill="none"/>
      <ellipse cx="16" cy="9"  rx="3.5" ry="7" transform="rotate(-35 16 9)"  stroke="#1D7A4A" strokeWidth="1.4" fill="none"/>
      <ellipse cx="21" cy="7"  rx="3.5" ry="7" transform="rotate(-12 21 7)"  stroke="#1D7A4A" strokeWidth="1.4" fill="none"/>
      <ellipse cx="27" cy="7"  rx="3.5" ry="7" transform="rotate(12 27 7)"   stroke="#1D7A4A" strokeWidth="1.4" fill="none"/>
      <ellipse cx="32" cy="9"  rx="3.5" ry="7" transform="rotate(35 32 9)"   stroke="#1D7A4A" strokeWidth="1.4" fill="none"/>
      <ellipse cx="36" cy="13" rx="3.5" ry="7" transform="rotate(55 36 13)"  stroke="#1D7A4A" strokeWidth="1.4" fill="none"/>
      {/* Ring connecting feather tips */}
      <path d="M10 10 Q12 5 18 4 Q24 3 30 4 Q36 5 38 10" stroke="#1D7A4A" strokeWidth="1.3" fill="none"/>
    </svg>
  ),
  squash: (
    /* Squash racket + small rubber ball */
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Racket head (rounder than badminton) */}
      <ellipse cx="21" cy="17" rx="11" ry="13" stroke="#1A3A6B" strokeWidth="2" fill="none"/>
      {/* Strings horizontal */}
      <line x1="11" y1="14" x2="31" y2="14" stroke="#1A3A6B" strokeWidth="0.9" opacity="0.7"/>
      <line x1="10" y1="17" x2="32" y2="17" stroke="#1A3A6B" strokeWidth="0.9" opacity="0.7"/>
      <line x1="11" y1="20" x2="31" y2="20" stroke="#1A3A6B" strokeWidth="0.9" opacity="0.7"/>
      <line x1="13" y1="11" x2="29" y2="11" stroke="#1A3A6B" strokeWidth="0.9" opacity="0.7"/>
      <line x1="13" y1="23" x2="29" y2="23" stroke="#1A3A6B" strokeWidth="0.9" opacity="0.7"/>
      {/* Strings vertical */}
      <line x1="15" y1="5" x2="15" y2="29" stroke="#1A3A6B" strokeWidth="0.9" opacity="0.7"/>
      <line x1="18" y1="4" x2="18" y2="30" stroke="#1A3A6B" strokeWidth="0.9" opacity="0.7"/>
      <line x1="21" y1="4" x2="21" y2="30" stroke="#1A3A6B" strokeWidth="0.9" opacity="0.7"/>
      <line x1="24" y1="4" x2="24" y2="30" stroke="#1A3A6B" strokeWidth="0.9" opacity="0.7"/>
      <line x1="27" y1="5" x2="27" y2="29" stroke="#1A3A6B" strokeWidth="0.9" opacity="0.7"/>
      {/* Throat */}
      <path d="M16 30 L21 34 L26 30" stroke="#1A3A6B" strokeWidth="2" fill="none"/>
      {/* Handle */}
      <line x1="21" y1="34" x2="21" y2="45" stroke="#1A3A6B" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Squash ball (small solid black rubber ball) */}
      <circle cx="38" cy="10" r="4" fill="#1A3A6B" opacity="0.85"/>
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
  return (
    <div className="court-card">
      <div className={`court-card__header court-card__header--${court.sport}`}>
        {SPORT_ICONS[court.sport]}
      </div>

      <div className="court-card__body">
        <p className="court-card__name">{court.name}</p>
        <SportPill sport={court.sport} />
      </div>

      <div className="court-card__footer">
        <div className="court-card__availability">
          <span className="availability-dot" />
          <span className="availability-label">
            Available to book
          </span>
        </div>

        <button
          className="btn-accent btn-sm"
          onClick={() => onBook(court)}
        >
          Book
        </button>
      </div>
    </div>
  );
};

// ─── Navbar ──────────────────────────────────────────────────────────────────

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
  const { courts, loading, error, retry } = useCourts(activeTab === "all" ? null : activeTab);
  const navigate = useNavigate();

  const handleBook = (court: Court) => {
    navigate(`/courts/${court.id}`);
  };

  return (
    <div className="page-root">
      <Navbar activePage="courts" />

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
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6B7A99' }}>Loading courts…</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'red', marginBottom: '0.5rem' }}>Failed to load courts: {String(error)}</p>
            <button className="btn-accent btn-sm" onClick={retry}>Retry</button>
          </div>
        ) : courts.length > 0 ? (
          <div className="courts-grid">
            {courts.map((court: any) => (
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
