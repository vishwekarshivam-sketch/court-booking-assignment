import { useState } from "react";
import { Plus, LayoutGrid, Clock, CheckCircle2, List, X, AlertTriangle } from "lucide-react";
import "./AdminCourtsPage.css";

interface Court {
  id: string;
  name: string;
  sport: "Badminton" | "Squash" | "Tennis";
  slotRange: string;
  slotCount: number;
  active: boolean;
}

const INITIAL_COURTS: Court[] = [
  { id: "CT-001", name: "Badminton Court 1", sport: "Badminton", slotRange: "07:00 – 21:00", slotCount: 14, active: true  },
  { id: "CT-002", name: "Badminton Court 2", sport: "Badminton", slotRange: "07:00 – 21:00", slotCount: 14, active: true  },
  { id: "CT-003", name: "Badminton Court 3", sport: "Badminton", slotRange: "08:00 – 20:00", slotCount: 12, active: true  },
  { id: "CT-004", name: "Squash Court A",    sport: "Squash",    slotRange: "07:00 – 21:00", slotCount: 14, active: true  },
  { id: "CT-005", name: "Squash Court B",    sport: "Squash",    slotRange: "08:00 – 21:00", slotCount: 13, active: false },
  { id: "CT-006", name: "Tennis Court 1",    sport: "Tennis",    slotRange: "06:00 – 22:00", slotCount: 16, active: true  },
  { id: "CT-007", name: "Tennis Court 2",    sport: "Tennis",    slotRange: "06:00 – 22:00", slotCount: 16, active: true  },
  { id: "CT-008", name: "Tennis Court 3",    sport: "Tennis",    slotRange: "07:00 – 19:00", slotCount: 12, active: false },
];

type Tab = "active" | "inactive";

export default function AdminCourtsPage() {
  const [courts, setCourts] = useState<Court[]>(INITIAL_COURTS);
  const [activeTab, setActiveTab] = useState<Tab>("active");
  const [pendingDeactivate, setPendingDeactivate] = useState<Court | null>(null);

  const filtered = courts.filter((c) =>
    activeTab === "active" ? c.active : !c.active
  );

  const handleToggle = (court: Court, newVal: boolean) => {
    if (!newVal) {
      setPendingDeactivate(court);
    } else {
      setCourts((prev) =>
        prev.map((c) => (c.id === court.id ? { ...c, active: true } : c))
      );
    }
  };

  const confirmDeactivate = () => {
    if (!pendingDeactivate) return;
    setCourts((prev) =>
      prev.map((c) =>
        c.id === pendingDeactivate.id ? { ...c, active: false } : c
      )
    );
    setPendingDeactivate(null);
  };

  return (
    <div className="cb-root">
      {/* Navbar */}
      <nav className="cb-nav">
        <div className="cb-logo">Court<span>Book</span></div>
        <div className="cb-nav-links">
          <a className="cb-nav-link">Courts</a>
          <a className="cb-nav-link">My Bookings</a>
          <a className="cb-nav-link active">Dashboard</a>
          <a className="cb-nav-link active">Manage Courts</a>
        </div>
        <div className="cb-nav-right">
          <div className="cb-avatar">AD</div>
          <span className="cb-name">Admin</span>
        </div>
      </nav>

      <div className="cb-layout">
        {/* Sidebar */}
        <aside className="cb-sidebar">
          <div className="cb-sidebar-label">Main</div>
          <div className="cb-sidebar-item">
            <LayoutGrid width={16} height={16} />
            Overview
          </div>
          <div className="cb-sidebar-item">
            <List width={16} height={16} />
            All Bookings
          </div>
          <div className="cb-sidebar-item">
            <Clock width={16} height={16} />
            Pending
            <span className="cb-sidebar-badge">7</span>
          </div>
          <div className="cb-sidebar-item active">
            <LayoutGrid width={16} height={16} />
            Courts
          </div>
        </aside>

        {/* Main */}
        <main className="cb-main">
          <div className="cb-page-header">
            <div>
              <h1 className="cb-page-title">Manage Courts</h1>
              <p className="cb-page-sub">Control court visibility and availability</p>
            </div>
            <button className="cb-btn-primary">
              <Plus width={16} height={16} />
              Add Court
            </button>
          </div>

          <div className="cb-tabs">
            <button
              className={`cb-tab${activeTab === "active" ? " active" : ""}`}
              onClick={() => setActiveTab("active")}
            >
              Active Courts
            </button>
            <button
              className={`cb-tab${activeTab === "inactive" ? " active" : ""}`}
              onClick={() => setActiveTab("inactive")}
            >
              Inactive
            </button>
          </div>

          <div className="cb-card">
            <div className="cb-card-header">
              <span className="cb-card-title">All Courts</span>
              <span className="cb-card-meta">{filtered.length} court{filtered.length !== 1 ? "s" : ""} shown</span>
            </div>
            <table className="cb-table">
              <thead>
                <tr>
                  <th>Court</th>
                  <th>Sport</th>
                  <th>Slots Available</th>
                  <th>Daily Capacity</th>
                  <th>Status</th>
                  <th>Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((court) => (
                  <tr key={court.id} className={!court.active ? "cb-row-inactive" : ""}>
                    <td>
                      <span className="cb-court-name">{court.name}</span>
                      <span className="cb-court-id">#{court.id}</span>
                    </td>
                    <td>
                      <span className={`sport-pill ${court.sport.toLowerCase()}`}>
                        {court.sport}
                      </span>
                    </td>
                    <td>
                      <span className="cb-slot-range">{court.slotRange}</span>
                      <span className="cb-slot-count">{court.slotCount} slots/day</span>
                    </td>
                    <td className="cb-mono">{court.slotCount} sessions</td>
                    <td>
                      <span className={`cb-status-text ${court.active ? "active" : "inactive"}`}>
                        <span className="cb-status-dot" />
                        {court.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <label className="cb-toggle">
                        <input
                          type="checkbox"
                          checked={court.active}
                          onChange={(e) => handleToggle(court, e.target.checked)}
                        />
                        <span className="cb-toggle-slider" />
                      </label>
                    </td>
                    <td>
                      <div className="cb-actions">
                        <button className="cb-btn-ghost cb-btn-sm">View Slots</button>
                        {court.active ? (
                          <button
                            className="cb-btn-danger cb-btn-sm"
                            onClick={() => setPendingDeactivate(court)}
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            className="cb-btn-accent cb-btn-sm"
                            onClick={() => handleToggle(court, true)}
                          >
                            Activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Deactivate Confirmation Modal */}
      {pendingDeactivate && (
        <div className="cb-modal-overlay" onClick={() => setPendingDeactivate(null)}>
          <div className="cb-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cb-modal-header">
              <div>
                <div className="cb-modal-title">Deactivate Court</div>
                <div className="cb-modal-sub">
                  Deactivating &ldquo;{pendingDeactivate.name}&rdquo;
                </div>
              </div>
              <button className="cb-modal-close" onClick={() => setPendingDeactivate(null)}>
                <X width={18} height={18} />
              </button>
            </div>
            <div className="cb-alert-warning">
              <AlertTriangle width={16} height={16} />
              Students will not be able to book this court until it is reactivated.
            </div>
            <div className="cb-modal-footer">
              <button className="cb-btn-ghost" onClick={() => setPendingDeactivate(null)}>
                Cancel
              </button>
              <button className="cb-btn-danger" onClick={confirmDeactivate}>
                Deactivate Court
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
