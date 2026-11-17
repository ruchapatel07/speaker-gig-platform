import React from "react";

const NAV_ITEMS = [
  { key: "profile", label: "Profile" },
  { key: "dashboard", label: "Dashboard" },
  { key: "discover", label: "Find Gigs" },
  { key: "applications", label: "Applications" },
  { key: "mygigs", label: "My Gigs" },
  { key: "subscription", label: "Subscription" },
  { key: "notifications", label: "Notifications" },
];

export default function Sidebar({ activePage, onNavigate, onLogout }) {
  return (
    <aside className="app-sidebar">
      <div className="sidebar-logo">
        <span className="logo-mark">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M19 11a7 7 0 0 1-14 0M12 19v3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="logo-text">
          Speaker<span className="logo-text-accent">Gig</span>
        </span>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            className={`sidebar-link ${activePage === item.key ? "sidebar-link-active" : ""}`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <button className="sidebar-link sidebar-logout" onClick={onLogout}>
        Logout
      </button>
    </aside>
  );
}