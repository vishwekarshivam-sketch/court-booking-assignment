import React, { useState } from "react";

// ─── Raw Athletic Design System ─────────────────────────────────────────────
// Background:   #0d0d0d (page), #111111 (surface), #1a1a1a (elevated)
// Border:       #222222 (default), #2e2e2e (hover), #e5ff00 (focus/selected)
// Text:         #f0f0f0 (primary), #888888 (secondary), #444444 (muted)
// Accent:       #e5ff00 (electric yellow-green) — used ONLY for interactive
// Sport colors: badminton #4dff91, squash #ff9f4d, tennis #ff4d91 (secondary, used sparingly)
// Error/full:   #ff4d4d
// Fonts:        Bebas Neue (display), DM Sans (body/labels), DM Mono (data/slots)
// Radius:       2px — hard-edged, never rounded
// ────────────────────────────────────────────────────────────────────────────

type Sport = "badminton" | "squash" | "tennis";
type FilterTab = "all" | Sport;

interface Court {
  id: string;
  name: string;
  sport: Sport;
  availableSlots: number;
}

const COURTS: Court[] = [
  { id: "1", name: "Badminton Court 1", sport: "badminton", availableSlots: 5 },
  { id: "2", name: "Badminton Court 2", sport: "badminton", availableSlots: 0 },
  { id: "3", name: "Badminton Court 3", sport: "badminton", availableSlots: 3 },
  { id: "4", name: "Squash Court 1",    sport: "squash",    availableSlots: 2 },
  { id: "5", name: "Squash Court 2",    sport: "squash",    availableSlots: 0 },
  { id: "6", name: "Tennis Court 1",    sport: "tennis",    availableSlots: 7 },
];

const SPORT_ACCENT: Record<Sport, string> = {
  badminton: "#4dff91",
  squash:    "#ff9f4d",
  tennis:    "#ff4d91",
};

const SPORT_LABEL: Record<Sport, string> = {
  badminton: "Badminton",
  squash:    "Squash",
  tennis:    "Tennis",
};

// Minimal SVG sport icons — line-art only, same stroke color passed in
const SportIcon: React.FC<{ sport: Sport; color: string }> = ({ sport, color }) => {
  if (sport === "badminton") return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="22" r="4.5" stroke={color} strokeWidth="1.5"/>
      <line x1="16" y1="17.5" x2="16" y2="7" stroke={color} strokeWidth="1.5"/>
      <line x1="16" y1="7" x2="11.5" y2="11" stroke={color} strokeWidth="1.2"/>
      <line x1="16" y1="7" x2="20.5" y2="11" stroke={color} strokeWidth="1.2"/>
      <line x1="16" y1="10" x2="11" y2="15" stroke={color} strokeWidth="1"/>
      <line x1="16" y1="10" x2="21" y2="15" stroke={color} strokeWidth="1"/>
    </svg>
  );
  if (sport === "squash") return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect x="7" y="7" width="18" height="18" rx="1.5" stroke={color} strokeWidth="1.5"/>
      <line x1="7" y1="16" x2="25" y2="16" stroke={color} strokeWidth="1"/>
      <line x1="16" y1="7" x2="16" y2="25" stroke={color} strokeWidth="1"/>
      <circle cx="16" cy="16" r="2" fill={color}/>
    </svg>
  );
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="8.5" stroke={color} strokeWidth="1.5"/>
      <path d="M11.5 10Q16 16 11.5 22" stroke={color} strokeWidth="1.2" fill="none"/>
      <path d="M20.5 10Q16 16 20.5 22" stroke={color} strokeWidth="1.2" fill="none"/>
    </svg>
  );
};

// ─── Navbar ──────────────────────────────────────────────────────────────────

const Navbar: React.FC = () => (
  <nav style={{
    position: "sticky",
    top: 0,
    zIndex: 50,
    background: "#0d0d0d",
    borderBottom: "1px solid #1a1a1a",
    fontFamily: "var(--font-body)",
  }}>
    <div style={{
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 24px",
      height: "56px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}>
      {/* Logo */}
      <div style={{
        fontFamily: "var(--font-display)",
        fontSize: "22px",
        letterSpacing: "3px",
        color: "#f0f0f0",
      }}>
        COURT<span style={{ color: "#e5ff00" }}>BOOK</span>
      </div>

      {/* Nav links */}
      <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
        {[
          { label: "Courts", href: "/courts", active: true },
          { label: "My Bookings", href: "/my-bookings", active: false },
          { label: "Schedule", href: "/schedule", active: false },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: link.active ? "#f0f0f0" : "#444",
              textDecoration: "none",
              borderBottom: link.active ? "2px solid #e5ff00" : "2px solid transparent",
              paddingBottom: "2px",
              transition: "color 150ms",
            }}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* User */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "#888", letterSpacing: "0.5px" }}>
          Aditya K.
        </span>
        <div style={{
          width: "30px",
          height: "30px",
          background: "#1a1a1a",
          border: "1px solid #2e2e2e",
          borderRadius: "2px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-data)",
          fontSize: "10px",
          color: "#e5ff00",
          letterSpacing: "1px",
          fontWeight: 500,
        }}>
          AK
        </div>
      </div>
    </div>
  </nav>
);

// ─── Stat ticker strip ───────────────────────────────────────────────────────

const StatStrip: React.FC<{ courts: Court[] }> = ({ courts }) => {
  const total    = courts.length;
  const open     = courts.filter((c) => c.availableSlots > 0).length;
  const slots    = courts.reduce((a, c) => a + c.availableSlots, 0);

  const stats = [
    { label: "Courts Available", value: `${open}/${total}` },
    { label: "Total Slots Today", value: slots },
    { label: "Sports", value: 3 },
    { label: "Last Updated", value: "10:42 AM" },
  ];

  return (
    <div style={{
      borderBottom: "1px solid #1a1a1a",
      background: "#0d0d0d",
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 24px",
        display: "flex",
        gap: "0",
      }}>
        {stats.map((s, i) => (
          <div key={s.label} style={{
            padding: "14px 32px 14px 0",
            marginRight: "32px",
            borderRight: i < stats.length - 1 ? "1px solid #1a1a1a" : "none",
            paddingRight: "32px",
          }}>
            <div style={{
              fontFamily: "var(--font-data)",
              fontSize: "18px",
              fontWeight: 500,
              color: "#e5ff00",
              letterSpacing: "-0.5px",
              lineHeight: 1,
            }}>
              {s.value}
            </div>
            <div style={{
              fontFamily: "var(--font-body)",
              fontSize: "9px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#444",
              marginTop: "4px",
            }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Court Card ──────────────────────────────────────────────────────────────

const CourtCard: React.FC<{ court: Court; onBook: (c: Court) => void }> = ({ court, onBook }) => {
  const available = court.availableSlots > 0;
  const accent    = SPORT_ACCENT[court.sport];
  const [hovered, setHovered] = useState(false);

  // Court number extracted from name
  const courtNum = court.name.match(/\d+/)?.[0] ?? "1";

  return (
    <div
      style={{
        background: hovered && available ? "#141414" : "#111111",
        border: `1px solid ${hovered && available ? "#2e2e2e" : "#1a1a1a"}`,
        borderTop: `3px solid ${available ? accent : "#222"}`,
        borderRadius: "2px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "0",
        transition: "background 150ms, border-color 150ms",
        cursor: available ? "pointer" : "default",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background court number */}
      <div style={{
        position: "absolute",
        fontFamily: "var(--font-display)",
        fontSize: "80px",
        color: "#f0f0f0",
        opacity: 0.03,
        right: "16px",
        bottom: "-8px",
        lineHeight: 1,
        userSelect: "none",
        pointerEvents: "none",
        letterSpacing: "-2px",
      }}>
        {courtNum}
      </div>

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
        <SportIcon sport={court.sport} color={available ? accent : "#333"} />
        <span style={{
          fontFamily: "var(--font-data)",
          fontSize: "9px",
          letterSpacing: "2px",
          textTransform: "uppercase",
          color: available ? accent : "#333",
          fontWeight: 500,
        }}>
          {SPORT_LABEL[court.sport]}
        </span>
      </div>

      {/* Court name */}
      <div style={{
        fontFamily: "var(--font-display)",
        fontSize: "26px",
        letterSpacing: "1.5px",
        color: available ? "#f0f0f0" : "#333",
        lineHeight: 1,
        marginBottom: "16px",
      }}>
        {court.name.toUpperCase()}
      </div>

      {/* Availability bar */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{
          height: "2px",
          background: "#1a1a1a",
          borderRadius: "1px",
          overflow: "hidden",
          marginBottom: "8px",
        }}>
          <div style={{
            height: "100%",
            width: available ? `${Math.min((court.availableSlots / 10) * 100, 100)}%` : "0%",
            background: accent,
            transition: "width 400ms ease",
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{
            fontFamily: "var(--font-data)",
            fontSize: "11px",
            color: available ? "#888" : "#333",
            letterSpacing: "0.5px",
          }}>
            {available ? `${court.availableSlots} slots today` : "Fully booked"}
          </span>
          {!available && (
            <span style={{
              fontFamily: "var(--font-data)",
              fontSize: "9px",
              letterSpacing: "2px",
              color: "#ff4d4d",
              textTransform: "uppercase",
            }}>
              FULL
            </span>
          )}
        </div>
      </div>

      {/* CTA */}
      {available ? (
        <button
          onClick={() => onBook(court)}
          style={{
            background: hovered ? "#e5ff00" : "transparent",
            color: hovered ? "#0d0d0d" : "#e5ff00",
            border: "1px solid #e5ff00",
            borderRadius: "2px",
            fontFamily: "var(--font-display)",
            fontSize: "14px",
            letterSpacing: "2px",
            padding: "10px 0",
            width: "100%",
            cursor: "pointer",
            transition: "background 150ms, color 150ms",
          }}
        >
          BOOK COURT →
        </button>
      ) : (
        <button
          disabled
          style={{
            background: "transparent",
            color: "#2e2e2e",
            border: "1px solid #1a1a1a",
            borderRadius: "2px",
            fontFamily: "var(--font-display)",
            fontSize: "14px",
            letterSpacing: "2px",
            padding: "10px 0",
            width: "100%",
            cursor: "not-allowed",
          }}
        >
          UNAVAILABLE
        </button>
      )}
    </div>
  );
};

// ─── Filter Tabs ─────────────────────────────────────────────────────────────

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
    console.log("Book court", court.id);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0d0d0d; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#0d0d0d" }}>
        <Navbar />
        <StatStrip courts={COURTS} />

        <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>

          {/* Page header */}
          <div style={{ marginBottom: "40px" }}>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "10px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#444",
              marginBottom: "8px",
            }}>
              IIT Bombay · Sports Complex
            </p>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(48px, 6vw, 80px)",
              letterSpacing: "3px",
              color: "#f0f0f0",
              lineHeight: 0.95,
            }}>
              BOOK A<br />
              <span style={{ color: "#e5ff00" }}>COURT.</span>
            </h1>
          </div>

          {/* Filter tabs */}
          <div style={{
            display: "flex",
            gap: "0",
            marginBottom: "32px",
            borderBottom: "1px solid #1a1a1a",
          }}>
            {TABS.map((tab) => {
              const active = activeTab === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  style={{
                    background: "transparent",
                    border: "none",
                    borderBottom: active ? "2px solid #e5ff00" : "2px solid transparent",
                    color: active ? "#f0f0f0" : "#444",
                    fontFamily: "var(--font-body)",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    padding: "12px 24px 14px",
                    cursor: "pointer",
                    marginBottom: "-1px",
                    transition: "color 150ms, border-color 150ms",
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Count */}
          <div style={{
            fontFamily: "var(--font-data)",
            fontSize: "10px",
            letterSpacing: "2px",
            color: "#444",
            textTransform: "uppercase",
            marginBottom: "20px",
          }}>
            {filtered.length} courts · {filtered.filter(c => c.availableSlots > 0).length} available
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1px",
              background: "#1a1a1a",
              border: "1px solid #1a1a1a",
            }}>
              {filtered.map((court) => (
                <div key={court.id} style={{ background: "#0d0d0d" }}>
                  <CourtCard court={court} onBook={handleBook} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: "center",
              padding: "80px 24px",
              border: "1px solid #1a1a1a",
            }}>
              <div style={{
                fontFamily: "var(--font-display)",
                fontSize: "32px",
                color: "#2e2e2e",
                letterSpacing: "2px",
                marginBottom: "8px",
              }}>
                NO COURTS FOUND
              </div>
              <div style={{
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                color: "#444",
              }}>
                No courts match the selected filter.
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default CourtsPage;
