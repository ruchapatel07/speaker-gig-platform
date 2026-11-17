import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

const CONFIRMED_GIGS = [
  {
    id: 1,
    title: "Global AI & Cloud Summit 2026",
    topic: "Building Resilient Agentic Systems in Production",
    date: "14 Nov 2026",
    time: "10:30 AM - 11:30 AM",
    location: "Bangalore International Exhibition Centre",
    stage: "Main Stage A",
    expectedAudience: "850+ Attendees",
    status: "Upcoming",
    materialsSubmitted: true,
  },
  {
    id: 2,
    title: "Fintech Leaders Conclave 2026",
    topic: "Next-Gen Security & Scalable Microservices",
    date: "28 Nov 2026",
    time: "02:00 PM - 03:00 PM",
    location: "Mumbai Convention Hall, Bandra",
    stage: "Fintech Track B",
    expectedAudience: "500+ Attendees",
    status: "Upcoming",
    materialsSubmitted: false,
  },
  {
    id: 3,
    title: "Asia Tech Symposium 2026",
    topic: "The Future of Web Performance and Modern UX",
    date: "15 Sep 2026",
    time: "11:00 AM - 12:00 PM",
    location: "Hyderabad Tech City Auditorium",
    stage: "Auditorium 1",
    expectedAudience: "600 Attendees",
    status: "Completed",
    materialsSubmitted: true,
  },
];

export default function MyGigsPage({ onNavigate, onLogout }) {
  const [tab, setTab] = useState("All");
  const [selectedGig, setSelectedGig] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");

  const filteredGigs =
    tab === "All"
      ? CONFIRMED_GIGS
      : CONFIRMED_GIGS.filter((g) => g.status === tab);

  const upcomingCount = CONFIRMED_GIGS.filter((g) => g.status === "Upcoming").length;
  const completedCount = CONFIRMED_GIGS.filter((g) => g.status === "Completed").length;

  const handleUploadMaterials = (e) => {
    e.preventDefault();
    setUploadMessage("Slides uploaded successfully!");
    setTimeout(() => {
      setUploadMessage("");
      setSelectedGig(null);
    }, 1500);
  };

  return (
    <div className="app-layout">
      <Sidebar activePage="mygigs" onNavigate={onNavigate} onLogout={onLogout} />

      <main className="app-main">
        <div className="app-main-header">
          <div>
            <h1>My Gigs</h1>
            <p>Manage your confirmed speaking engagements and session details.</p>
          </div>
        </div>

        <div className="dashboard-stats" style={{ marginTop: "20px" }}>
          <div className="dashboard-stat-card">
            <p className="dashboard-stat-value">{CONFIRMED_GIGS.length}</p>
            <p className="dashboard-stat-label">Total Gigs</p>
            <p className="dashboard-stat-sub">All-time confirmed</p>
          </div>
          <div className="dashboard-stat-card">
            <p className="dashboard-stat-value">{upcomingCount}</p>
            <p className="dashboard-stat-label">Upcoming</p>
            <p className="dashboard-stat-sub">Scheduled talks</p>
          </div>
          <div className="dashboard-stat-card">
            <p className="dashboard-stat-value">{completedCount}</p>
            <p className="dashboard-stat-label">Completed</p>
            <p className="dashboard-stat-sub">Delivered sessions</p>
          </div>
          <div className="dashboard-stat-card dashboard-stat-highlight">
            <p className="dashboard-stat-label-light">Next Gig</p>
            <p className="dashboard-stat-value-light" style={{ fontSize: "20px", marginTop: "8px" }}>
              14 Nov
            </p>
            <p className="dashboard-stat-sub-light">Bangalore (Main Stage A)</p>
          </div>
        </div>

        <div className="applications-tabs" style={{ marginTop: "28px" }}>
          {["All", "Upcoming", "Completed"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`applications-tab ${tab === t ? "applications-tab-active" : ""}`}
            >
              {t} ({t === "All" ? CONFIRMED_GIGS.length : t === "Upcoming" ? upcomingCount : completedCount})
            </button>
          ))}
        </div>

        <div className="mygigs-grid">
          {filteredGigs.map((gig) => (
            <div key={gig.id} className="mygig-card">
              <div className="mygig-info">
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <span
                    className={`status-pill ${
                      gig.status === "Upcoming" ? "status-accepted" : "status-applied"
                    }`}
                  >
                    {gig.status}
                  </span>
                  {gig.materialsSubmitted ? (
                    <span style={{ fontSize: "12px", color: "#059669" }}>✓ Slides Ready</span>
                  ) : (
                    <span style={{ fontSize: "12px", color: "#d97706" }}>⚠️ Slides Pending</span>
                  )}
                </div>
                <h3>{gig.title}</h3>
                <p style={{ fontSize: "14px", color: "#334155", marginTop: "4px", fontWeight: "500" }}>
                  Topic: {gig.topic}
                </p>
                <div className="mygig-meta">
                  <span>📅 {gig.date}</span>
                  <span>⏰ {gig.time}</span>
                  <span>📍 {gig.location}</span>
                  <span>🎤 {gig.stage}</span>
                  <span>👥 {gig.expectedAudience}</span>
                </div>
              </div>
              <div className="mygig-actions">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => setSelectedGig(gig)}
                >
                  Manage Session
                </button>
              </div>
            </div>
          ))}

          {filteredGigs.length === 0 && (
            <p className="discover-empty">No gigs found in this category.</p>
          )}
        </div>

        {/* Modal for managing gig / uploading slides */}
        {selectedGig && (
          <div className="modal-backdrop" onClick={() => setSelectedGig(null)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{selectedGig.title}</h2>
                <button
                  className="modal-close-btn"
                  onClick={() => setSelectedGig(null)}
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <div>
                  <p style={{ fontSize: "13px", color: "#64748b" }}>Topic</p>
                  <p style={{ fontWeight: 600, color: "#0f172a" }}>{selectedGig.topic}</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <p style={{ fontSize: "12px", color: "#64748b" }}>Date & Time</p>
                    <p style={{ fontSize: "13px", fontWeight: 500 }}>{selectedGig.date} • {selectedGig.time}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: "12px", color: "#64748b" }}>Stage / Location</p>
                    <p style={{ fontSize: "13px", fontWeight: 500 }}>{selectedGig.stage}</p>
                  </div>
                </div>

                <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "14px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155", display: "block", marginBottom: "6px" }}>
                    Session Slides / Presentation deck
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.ppt,.pptx"
                    style={{
                      border: "1px dashed #cbd5e1",
                      borderRadius: "8px",
                      padding: "16px",
                      width: "100%",
                      fontSize: "13px",
                    }}
                  />
                  <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
                    Accepted formats: PDF, PPTX (max 25MB)
                  </p>
                </div>

                {uploadMessage && (
                  <p style={{ color: "#059669", fontSize: "13px", fontWeight: 500 }}>
                    {uploadMessage}
                  </p>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setSelectedGig(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUploadMaterials}
                >
                  Save & Submit Slides
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

