import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { gigsAPI, statsAPI } from "../api/api";

const FALLBACK_GIGS = [
  {
    _id: "1",
    title: "AI Leadership Summit 2026",
    location: "Bangalore, India",
    date: "20 Oct 2026",
    match: 92,
    category: "Technology",
    description: "Keynote speaking opportunity on frontier AI systems, developer ecosystems, and enterprise automation.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80",
  },
  {
    _id: "2",
    title: "Future of Work Conference",
    location: "Mumbai, India",
    date: "15 Nov 2026",
    match: 87,
    category: "Leadership",
    description: "Panel discussion on remote collaboration, AI tools, and culture for modern high-performance teams.",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80",
  },
  {
    _id: "3",
    title: "Global Innovation Forum",
    location: "Delhi, India",
    date: "05 Dec 2026",
    match: 81,
    category: "Innovation",
    description: "Fireside chat discussing breakthrough tech trends, venture capital, and scaling global technology startups.",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80",
  },
];

const FALLBACK_STATS = {
  applications: 12,
  accepted: 4,
  invitations: 2,
  applicationsLeft: 3,
};

export default function DashboardPage({ onNavigate, onLogout }) {
  const { user, token } = useAuth();
  const [selectedGig, setSelectedGig] = useState(null);
  const [gigs, setGigs] = useState(FALLBACK_GIGS);
  const [stats, setStats] = useState(FALLBACK_STATS);
  const [loadingGigs, setLoadingGigs] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const displayName = user?.fullName ? user.fullName.split(" ")[0] : "Speaker";

  useEffect(() => {
    gigsAPI
      .list({ limit: 3 }, token)
      .then((data) => {
        if (data.gigs && data.gigs.length > 0) setGigs(data.gigs.slice(0, 3));
      })
      .catch(() => {})
      .finally(() => setLoadingGigs(false));
  }, [token]);

  useEffect(() => {
    statsAPI
      .get(token)
      .then((data) => setStats(data))
      .catch(() => {})
      .finally(() => setLoadingStats(false));
  }, [token]);

  const statCards = [
    { label: "Applications", value: stats.applications, sub: "Total Applied" },
    { label: "Accepted", value: stats.accepted, sub: "Gigs Accepted" },
    { label: "Invitations", value: stats.invitations, sub: "New Invitations" },
  ];

  return (
    <div className="app-layout">
      <Sidebar activePage="dashboard" onNavigate={onNavigate} onLogout={onLogout} />

      <main className="app-main">
        <div className="app-main-header">
          <div>
            <h1>{getGreeting()}, {displayName}! 👋</h1>
            <p>Find your next speaking opportunity and manage active proposals.</p>
          </div>
        </div>

        <div className="dashboard-stats">
          {statCards.map((s) => (
            <div
              key={s.label}
              className="dashboard-stat-card"
              style={{ cursor: "pointer" }}
              onClick={() => onNavigate("applications")}
            >
              <p className="dashboard-stat-value">
                {loadingStats ? "—" : s.value}
              </p>
              <p className="dashboard-stat-label">{s.label}</p>
              <p className="dashboard-stat-sub">{s.sub}</p>
            </div>
          ))}
          <div
            className="dashboard-stat-card dashboard-stat-highlight"
            style={{ cursor: "pointer" }}
            onClick={() => onNavigate("subscription")}
          >
            <p className="dashboard-stat-label-light">Remaining</p>
            <p className="dashboard-stat-value-light">
              {loadingStats ? "—" : stats.applicationsLeft}
            </p>
            <p className="dashboard-stat-sub-light">Applications Left (Click to upgrade)</p>
          </div>
        </div>

        <div className="dashboard-section-header">
          <h2>Recommended For You</h2>
          <button className="link-btn" onClick={() => onNavigate("discover")}>View All</button>
        </div>

        {loadingGigs ? (
          <div style={{ color: "#94a3b8", padding: "32px 0", textAlign: "center" }}>
            Loading gigs…
          </div>
        ) : (
          <div className="dashboard-gigs-grid">
            {gigs.map((gig) => (
              <div key={gig._id || gig.id} className="dashboard-gig-card">
                <img
                  src={gig.image}
                  alt={gig.title}
                  className="dashboard-gig-image"
                  style={{ objectFit: "cover", width: "100%", height: "145px", display: "block" }}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "block";
                  }}
                />
                <div
                  className="dashboard-gig-image"
                  style={{ display: "none", height: "145px" }}
                />
                <div className="dashboard-gig-body">
                  <span className="dashboard-gig-match">{gig.match}% Match</span>
                  <h3>{gig.title}</h3>
                  <p>📍 {gig.location}</p>
                  <p>📅 {gig.date}</p>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setSelectedGig(gig)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for viewing gig details */}
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
                {selectedGig.image && (
                  <img
                    src={selectedGig.image}
                    alt={selectedGig.title}
                    style={{
                      width: "100%",
                      height: "160px",
                      objectFit: "cover",
                      borderRadius: "10px",
                      marginBottom: "12px",
                    }}
                  />
                )}
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <span className="dashboard-gig-match">{selectedGig.match}% Profile Match</span>
                  <span className="status-pill status-applied">{selectedGig.category}</span>
                </div>
                <p style={{ color: "#334155", lineHeight: "1.6", fontSize: "14px" }}>
                  {selectedGig.description}
                </p>
                <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "8px", fontSize: "13px" }}>
                  <p><strong>Location:</strong> {selectedGig.location}</p>
                  <p style={{ marginTop: "4px" }}><strong>Event Date:</strong> {selectedGig.date}</p>
                  {selectedGig.organizer && (
                    <p style={{ marginTop: "4px" }}><strong>Organizer:</strong> {selectedGig.organizer}</p>
                  )}
                </div>
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
                  onClick={() => {
                    setSelectedGig(null);
                    onNavigate("discover");
                  }}
                >
                  Explore in Discover
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
