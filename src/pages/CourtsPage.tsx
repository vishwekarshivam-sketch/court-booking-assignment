import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCourts } from "../hooks/useCourts";
import Navbar from "../components/Navbar";
import HeroSlideshow from "../components/HeroSlideshow";
import Footer from "../components/Footer";
import "./CourtsPage.css";

type Sport = "badminton" | "squash" | "tennis";
type FilterTab = "all" | Sport;

interface Court {
  id: string;
  name: string;
  sport: Sport;
  is_active: boolean;
}

const SPORT_COLOR: Record<Sport, string> = {
  badminton: "#059669",
  squash:    "#ea580c",
  tennis:    "#7c3aed",
};

const SportIcon: React.FC<{ sport: Sport; color: string }> = ({ sport, color }) => {
  if (sport === "badminton") return (
    /* refined shuttlecock: curved cork and elegant feathers */
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      {/* cork - the bottom part */}
      <path d="M12 24 C12 28, 20 28, 20 24 L20 22 C20 21, 12 21, 12 22 Z" stroke={color} strokeWidth="1.6" fill={color} fillOpacity="0.1"/>
      <path d="M12 22 L20 22" stroke={color} strokeWidth="1.2" opacity="0.6"/>
      {/* feathers - central skeleton and main spread */}
      <path d="M16 22 L16 5" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M13 21.5 L8 7" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M19 21.5 L24 7" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
      {/* top feather edges - creates the shuttlecock silhouette */}
      <path d="M16 5 C12 5, 8 7, 8 7 C10 12, 12 18, 13 21" stroke={color} strokeWidth="1.2" fill="none"/>
      <path d="M16 5 C20 5, 24 7, 24 7 C22 12, 20 18, 19 21" stroke={color} strokeWidth="1.2" fill="none"/>
      {/* cross threads */}
      <path d="M10 15 Q16 14 22 15" stroke={color} strokeWidth="0.8" opacity="0.5"/>
      <path d="M11.5 10 Q16 9 20.5 10" stroke={color} strokeWidth="0.8" opacity="0.5"/>
    </svg>
  );
  if (sport === "squash") return (
    /* squash racquet: upright oval head, grid strings, short throat, handle */
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      {/* head — upright oval */}
      <ellipse cx="16" cy="12" rx="7" ry="9" stroke={color} strokeWidth="1.4" fill="none"/>
      {/* vertical strings */}
      <line x1="12" y1="4"  x2="12" y2="20" stroke={color} strokeWidth="0.7" opacity="0.7"/>
      <line x1="16" y1="3"  x2="16" y2="21" stroke={color} strokeWidth="0.7" opacity="0.7"/>
      <line x1="20" y1="4"  x2="20" y2="20" stroke={color} strokeWidth="0.7" opacity="0.7"/>
      {/* horizontal strings */}
      <line x1="9"  y1="8"  x2="23" y2="8"  stroke={color} strokeWidth="0.7" opacity="0.7"/>
      <line x1="9"  y1="12" x2="23" y2="12" stroke={color} strokeWidth="0.7" opacity="0.7"/>
      <line x1="9"  y1="16" x2="23" y2="16" stroke={color} strokeWidth="0.7" opacity="0.7"/>
      {/* throat */}
      <line x1="13" y1="21" x2="14" y2="24" stroke={color} strokeWidth="1.3"/>
      <line x1="19" y1="21" x2="18" y2="24" stroke={color} strokeWidth="1.3"/>
      {/* handle */}
      <line x1="14" y1="24" x2="13" y2="30" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="18" y1="24" x2="19" y2="30" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="13" y1="30" x2="19" y2="30" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
  /* tennis ball */
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="9" stroke={color} strokeWidth="1.5"/>
      <path d="M11 8.5Q16 16 11 23.5" stroke={color} strokeWidth="1.2" fill="none"/>
      <path d="M21 8.5Q16 16 21 23.5" stroke={color} strokeWidth="1.2" fill="none"/>
    </svg>
  );
};

const CourtCard: React.FC<{ court: Court; onBook: (c: Court) => void }> = ({ court, onBook }) => {
  const [hovered, setHovered] = useState(false);
  const available = court.is_active;
  const color = available ? SPORT_COLOR[court.sport] : "#333333";
  const courtNum = court.name.match(/\d+/)?.[0] ?? "1";
  const MAX_SLOTS = 10;
  const slots = available ? MAX_SLOTS : 0;

  return (
    <div
      className={`court-card${available ? " court-card--available" : " court-card--full"}`}
      style={{ "--sport-color": color } as React.CSSProperties}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => available && onBook(court)}
    >
      <div className="court-card__bg-num">{courtNum}</div>

      <div className="court-card__header-row">
        <SportIcon sport={court.sport} color={color} />
        <span className="court-card__sport-label" style={{ color, background: available ? `${color}18` : "#f4f6f9" }}>
          {court.sport}
        </span>
      </div>

      <div className="court-card__name" style={{ color: available ? "#0f172a" : "#94a3b8" }}>
        {court.name.toUpperCase()}
      </div>

      <div>
        <div className="avail-bar-track">
          <div
            className="avail-bar-fill"
            style={{
              width: available ? `${Math.min((slots / MAX_SLOTS) * 100, 100)}%` : "0%",
              background: color,
            }}
          />
        </div>
        <div className="avail-meta">
          <span className="avail-slots" style={{ color: available ? "#888888" : "#333333" }}>
            {available ? `${slots} slots today` : "Fully booked"}
          </span>
          {!available && <span className="avail-full-tag">FULL</span>}
        </div>
      </div>

      <button
        className={`court-card__btn${!available ? " court-card__btn--disabled" : ""}`}
        style={available && hovered ? { background: "#1a2744", color: "#ffffff" } : {}}
        onClick={(e) => { e.stopPropagation(); available && onBook(court); }}
        disabled={!available}
      >
        {available ? "BOOK COURT →" : "UNAVAILABLE"}
      </button>
    </div>
  );
};

const TABS: { value: FilterTab; label: string }[] = [
  { value: "all",       label: "All Sports" },
  { value: "badminton", label: "Badminton"  },
  { value: "squash",    label: "Squash"     },
  { value: "tennis",    label: "Tennis"     },
];

const CourtsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const { courts, loading, error, retry } = useCourts(activeTab === "all" ? null : activeTab);
  const navigate = useNavigate();

  const handleBook = (court: Court) => navigate(`/courts/${court.id}`);

  const total = courts.length;
  const open  = courts.filter((c: any) => c.is_active).length;

  return (
    <div className="page-root">
      <Navbar activePage="courts" />

      <HeroSlideshow />

      {/* Stat strip */}
      <div className="stat-strip">
        <div className="stat-strip__inner">
          <div className="stat-item">
            <div className="stat-value">{open}/{total}</div>
            <div className="stat-label">Courts Available</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">3</div>
            <div className="stat-label">Sports</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            <div className="stat-label">Last Updated</div>
          </div>
        </div>
      </div>

      <main className="page-shell">
        {/* Hero */}
        <p className="page-eyebrow">IIT Bombay · Sports Complex</p>
        <h1 className="page-hero-title">
          BOOK A<br />
          <span className="accent">COURT.</span>
        </h1>

        {/* Tabs */}
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

        {loading ? (
          <div className="page-loading">Loading courts…</div>
        ) : error ? (
          <div className="page-error">
            <div>⚠ Failed to load courts</div>
            <button className="btn-retry" onClick={retry}>RETRY</button>
          </div>
        ) : courts.length > 0 ? (
          <>
            <div className="courts-count">
              {courts.length} courts · {courts.filter((c: any) => c.is_active).length} available
            </div>
            <div className="courts-grid">
              {courts.map((court: any) => (
                <div key={court.id} className="courts-grid__cell">
                  <CourtCard court={court} onBook={handleBook} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-state__title">NO COURTS FOUND</div>
            <p className="empty-state__body">No courts match the selected filter.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CourtsPage;
