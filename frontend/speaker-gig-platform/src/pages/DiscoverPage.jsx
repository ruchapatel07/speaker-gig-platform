import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { gigsAPI } from "../api/api";

const FALLBACK_GIGS = [
  {
    _id: "1",
    title: "AI Leadership Summit 2026",
    location: "Bangalore, India",
    date: "20 Oct 2026",
    category: "Technology",
    match: 92,
    honorarium: "₹50,000 + Travel",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&q=80",
    description: "Looking for recognized engineering and product leaders to present on frontier AI models and LLM agent architectures.",
  },
  {
    _id: "2",
    title: "Future of Work Conference",
    location: "Mumbai, India",
    date: "15 Nov 2026",
    category: "Leadership",
    match: 87,
    honorarium: "₹35,000",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80",
    description: "Seeking speakers on hybrid workplace management, employee burnout prevention, and modern organizational leadership.",
  },
  {
    _id: "3",
    title: "Global Innovation Forum",
    location: "Delhi, India",
    date: "05 Dec 2026",
    category: "Innovation",
    match: 81,
    honorarium: "Travel & Stay",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80",
    description: "Cross-disciplinary gathering of venture capitalists, startup founders, and innovators discussing breakthrough technologies.",
  },
  {
    _id: "4",
    title: "Digital Marketing Expo",
    location: "Pune, India",
    date: "12 Jan 2027",
    category: "Marketing",
    match: 76,
    honorarium: "₹40,000",
    image: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=600&q=80",
    description: "Masterclasses on growth marketing, conversion rate optimization, and AI-driven creative workflows.",
  },
  {
    _id: "5",
    title: "Startup Founders Meet",
    location: "Hyderabad, India",
    date: "22 Feb 2027",
    category: "Business",
    match: 71,
    honorarium: "Honorary Keynote",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&q=80",
    description: "Intimate networking and panels for seed and Series A founders discussing product-market fit and bootstrapping.",
  },
  {
    _id: "6",
    title: "Women in Tech Summit",
    location: "Chennai, India",
    date: "08 Mar 2027",
    category: "Technology",
    match: 68,
    honorarium: "₹45,000 + Travel",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80",
    description: "Celebrating diversity and excellence in tech with focus on cloud architecture, cybersecurity, and data science.",
  },
];

const CATEGORIES = ["All", "Technology", "Leadership", "Innovation", "Marketing", "Business", "Health", "Education"];

export default function DiscoverPage({ onNavigate, onLogout }) {
  const { token } = useAuth();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedGig, setSelectedGig] = useState(null);
  const [proposalPitch, setProposalPitch] = useState("");
  const [appliedGigs, setAppliedGigs] = useState([]);
  const [applicationSuccess, setApplicationSuccess] = useState("");
  const [allGigs, setAllGigs] = useState(FALLBACK_GIGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gigsAPI
      .list({}, token)
      .then((data) => {
        if (data.gigs && data.gigs.length > 0) setAllGigs(data.gigs);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const filteredGigs = allGigs.filter((gig) => {
    const matchesQuery =
      gig.title.toLowerCase().includes(query.toLowerCase()) ||
      gig.location.toLowerCase().includes(query.toLowerCase()) ||
      gig.category.toLowerCase().includes(query.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || gig.category === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  const handleApply = (e) => {
    e.preventDefault();
    if (!selectedGig) return;
    const gigId = selectedGig._id || selectedGig.id;
    setAppliedGigs([...appliedGigs, gigId]);
    setApplicationSuccess(`Application submitted for "${selectedGig.title}"!`);
    setTimeout(() => {
      setApplicationSuccess("");
      setSelectedGig(null);
      setProposalPitch("");
    }, 1800);
  };

  return (
    <div className="app-layout">
      <Sidebar activePage="discover" onNavigate={onNavigate} onLogout={onLogout} />

      <main className="app-main">
        <div className="app-main-header">
          <div>
            <h1>Find Gigs</h1>
            <p>Explore speaking opportunities and apply directly to organizers.</p>
          </div>
        </div>

        {applicationSuccess && (
          <div className="field-success" style={{ marginTop: "16px", display: "flex", width: "100%", justifyContent: "space-between" }}>
            <span>✓ {applicationSuccess}</span>
            <button className="link-btn" onClick={() => onNavigate("applications")} style={{ marginLeft: "12px" }}>
              View Applications →
            </button>
          </div>
        )}

        <input
          type="text"
          placeholder="Search events by title, city, or topic..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="discover-search"
        />

        <div className="filter-chips">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`filter-chip ${selectedCategory === cat ? "filter-chip-active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ color: "#94a3b8", padding: "32px 0", textAlign: "center" }}>
            Loading opportunities…
          </div>
        ) : (
          <>
            <p className="discover-count">Showing {filteredGigs.length} opportunities</p>

            <div className="discover-list">
              {filteredGigs.map((gig) => {
                const gigId = gig._id || gig.id;
                const hasApplied = appliedGigs.includes(gigId);
                return (
                  <div key={gigId} className="discover-card">
                    {gig.image ? (
                      <img
                        src={gig.image}
                        alt={gig.title}
                        className="discover-card-image"
                        style={{ objectFit: "cover", flexShrink: 0 }}
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "block";
                        }}
                      />
                    ) : null}
                    <div
                      className="discover-card-image"
                      style={{ display: gig.image ? "none" : "block", flexShrink: 0 }}
                    />
                    <div className="discover-card-body">
                      <h3>{gig.title}</h3>
                      <p>📍 {gig.location} &nbsp;•&nbsp; 📅 {gig.date} &nbsp;•&nbsp; 🏷️ {gig.category}</p>
                      <p style={{ color: "#4f46e5", fontWeight: 500, marginTop: "4px" }}>
                        Honorarium: {gig.honorarium}
                      </p>
                    </div>
                    <span className="discover-card-match">{gig.match}% Match</span>
                    <button
                      className={`btn btn-sm ${hasApplied ? "btn-ghost" : "btn-outline"}`}
                      onClick={() => setSelectedGig(gig)}
                    >
                      {hasApplied ? "Applied ✓" : "View Details"}
                    </button>
                  </div>
                );
              })}

              {filteredGigs.length === 0 && (
                <p className="discover-empty">
                  No gigs found matching your search. Try adjusting the category or search keywords.
                </p>
              )}
            </div>
          </>
        )}

        {/* Modal for viewing gig and submitting application */}
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
              <form onSubmit={handleApply}>
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
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <span className="status-pill status-applied">{selectedGig.category}</span>
                    <span className="dashboard-gig-match">{selectedGig.match}% Match</span>
                    <span className="status-pill status-review">💰 {selectedGig.honorarium}</span>
                  </div>

                  <p style={{ color: "#334155", fontSize: "14px", lineHeight: "1.6" }}>
                    {selectedGig.description}
                  </p>

                  <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "10px", fontSize: "13px" }}>
                    <p><strong>Venue / Location:</strong> {selectedGig.location}</p>
                    <p style={{ marginTop: "4px" }}><strong>Event Date:</strong> {selectedGig.date}</p>
                    {selectedGig.organizer && (
                      <p style={{ marginTop: "4px" }}><strong>Organizer:</strong> {selectedGig.organizer}</p>
                    )}
                  </div>

                  <div className="form-field" style={{ marginTop: "4px" }}>
                    <label style={{ fontWeight: 600, color: "#334155" }}>
                      Your Pitch / Talk Abstract (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={proposalPitch}
                      onChange={(e) => setProposalPitch(e.target.value)}
                      placeholder="Briefly outline why you're a great fit for this session..."
                      className="discover-search"
                      style={{ marginTop: "6px" }}
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setSelectedGig(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={appliedGigs.includes(selectedGig._id || selectedGig.id)}
                  >
                    {appliedGigs.includes(selectedGig._id || selectedGig.id) ? "Already Applied" : "Submit Application"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
