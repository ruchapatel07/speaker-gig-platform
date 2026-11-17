import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

const INITIAL_APPLICATIONS = [
  {
    id: 1,
    event: "AI Leadership Summit 2026",
    date: "20 Oct 2026",
    location: "Bangalore",
    status: "Applied",
    appliedOn: "12 Oct 2026",
    topic: "Autonomous AI Agents in Healthcare",
    reviewerFeedback: "Under initial screening by programming committee.",
  },
  {
    id: 2,
    event: "Future of Work Conference",
    date: "15 Nov 2026",
    location: "Mumbai",
    status: "Under Review",
    appliedOn: "05 Oct 2026",
    topic: "Async Remote Cultures & Team Resilience",
    reviewerFeedback: "Passed first round. Secondary review with track chairs.",
  },
  {
    id: 3,
    event: "Global Innovation Forum",
    date: "05 Dec 2026",
    location: "Delhi",
    status: "Accepted",
    appliedOn: "28 Sep 2026",
    topic: "Next-Gen Web Standards and Performance",
    reviewerFeedback: "Congratulations! Keynote slot confirmed on Main Stage.",
  },
  {
    id: 4,
    event: "Tech Innovators Meet",
    date: "10 Jan 2027",
    location: "Hyderabad",
    status: "Rejected",
    appliedOn: "20 Sep 2026",
    topic: "Microservices Scalability Pitfalls",
    reviewerFeedback: "Slots for this category were filled before submission.",
  },
];

const TABS = ["All", "Applied", "Under Review", "Accepted", "Rejected"];

const STATUS_CLASS = {
  Applied: "status-applied",
  "Under Review": "status-review",
  Accepted: "status-accepted",
  Rejected: "status-rejected",
};

export default function ApplicationsPage({ onNavigate, onLogout }) {
  const [tab, setTab] = useState("All");
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  const [selectedApp, setSelectedApp] = useState(null);

  const filtered =
    tab === "All" ? applications : applications.filter((a) => a.status === tab);

  const handleWithdraw = (id) => {
    if (window.confirm("Are you sure you want to withdraw this application?")) {
      setApplications(applications.filter((a) => a.id !== id));
      setSelectedApp(null);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar activePage="applications" onNavigate={onNavigate} onLogout={onLogout} />

      <main className="app-main">
        <div className="app-main-header">
          <div>
            <h1>My Applications</h1>
            <p>Track the status of your applications and reviews.</p>
          </div>
        </div>

        <div className="applications-tabs">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`applications-tab ${tab === t ? "applications-tab-active" : ""}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="applications-table-wrap">
          <table className="applications-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Date</th>
                <th>Location</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td>
                    <strong>{a.event}</strong>
                    <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                      Topic: {a.topic}
                    </div>
                  </td>
                  <td>{a.date}</td>
                  <td>{a.location}</td>
                  <td>
                    <span className={`status-pill ${STATUS_CLASS[a.status]}`}>{a.status}</span>
                  </td>
                  <td>
                    <button
                      className="link-btn"
                      onClick={() => setSelectedApp(a)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <p className="discover-empty">No applications in this category.</p>
          )}
        </div>

        {/* Modal for viewing application details */}
        {selectedApp && (
          <div className="modal-backdrop" onClick={() => setSelectedApp(null)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{selectedApp.event}</h2>
                <button
                  className="modal-close-btn"
                  onClick={() => setSelectedApp(null)}
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span className={`status-pill ${STATUS_CLASS[selectedApp.status]}`}>
                    {selectedApp.status}
                  </span>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>
                    Applied on: {selectedApp.appliedOn}
                  </span>
                </div>

                <div>
                  <label style={{ fontSize: "12px", color: "#64748b", display: "block" }}>Proposed Topic</label>
                  <p style={{ fontWeight: 600, color: "#0f172a", marginTop: "2px" }}>{selectedApp.topic}</p>
                </div>

                <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "10px", fontSize: "13px" }}>
                  <p><strong>Event Date:</strong> {selectedApp.date}</p>
                  <p style={{ marginTop: "4px" }}><strong>Location:</strong> {selectedApp.location}</p>
                  <p style={{ marginTop: "8px", color: "#475569" }}>
                    <strong>Reviewer Notes:</strong> {selectedApp.reviewerFeedback}
                  </p>
                </div>
              </div>
              <div className="modal-footer">
                {selectedApp.status !== "Accepted" && (
                  <button
                    type="button"
                    className="btn btn-ghost"
                    style={{ color: "#ef4444" }}
                    onClick={() => handleWithdraw(selectedApp.id)}
                  >
                    Withdraw Application
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setSelectedApp(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
