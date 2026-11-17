import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

const INITIAL_NOTIFICATIONS = [
  { id: 1, title: "Your application was accepted!", detail: "AI Leadership Summit 2026 confirmed your keynote presentation.", time: "2h ago", type: "Applications", unread: true },
  { id: 2, title: "New gig matches your profile", detail: "Future of Work Conference has an opening for Leadership topics.", time: "5h ago", type: "Applications", unread: true },
  { id: 3, title: "Your application is under review", detail: "Global Innovation Forum screening is in progress.", time: "1d ago", type: "Applications", unread: false },
  { id: 4, title: "Your subscription renewal notice", detail: "Your Basic Plan will renew on 1st of next month.", time: "2d ago", type: "Unread", unread: false },
  { id: 5, title: "You have a new speaking invitation", detail: "Women in Tech Summit organizers invited you to join a panel discussion.", time: "3d ago", type: "Invitations", unread: true },
];

const TABS = ["All", "Unread", "Invitations", "Applications"];

export default function NotificationsPage({ onNavigate, onLogout }) {
  const [tab, setTab] = useState("All");
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const toggleRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  const filtered =
    tab === "All"
      ? notifications
      : tab === "Unread"
      ? notifications.filter((n) => n.unread)
      : notifications.filter((n) => n.type === tab);

  return (
    <div className="app-layout">
      <Sidebar activePage="notifications" onNavigate={onNavigate} onLogout={onLogout} />

      <main className="app-main">
        <div className="app-main-header">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
            <div>
              <h1>Notifications</h1>
              <p>Stay updated with alerts, responses, and event invitations.</p>
            </div>
            {notifications.length > 0 && (
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  className="link-btn"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                  style={{ opacity: unreadCount === 0 ? 0.5 : 1 }}
                >
                  Mark All Read
                </button>
                <span style={{ color: "#cbd5e1" }}>•</span>
                <button
                  className="link-btn"
                  onClick={clearAll}
                  style={{ color: "#94a3b8" }}
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="applications-tabs">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`applications-tab ${tab === t ? "applications-tab-active" : ""}`}
            >
              {t} {t === "Unread" && unreadCount > 0 ? `(${unreadCount})` : ""}
            </button>
          ))}
        </div>

        <div className="notifications-list">
          {filtered.map((n) => (
            <div
              key={n.id}
              className={`notification-item ${n.unread ? "notification-unread" : ""}`}
              style={{ cursor: "pointer" }}
              onClick={() => toggleRead(n.id)}
            >
              <span className="notification-icon">
                {n.type === "Invitations" ? "✉️" : n.type === "Applications" ? "🎯" : "🔔"}
              </span>
              <div className="notification-body">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <p className="notification-title">{n.title}</p>
                  {n.unread && (
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: "#4f46e5",
                        display: "inline-block",
                      }}
                    />
                  )}
                </div>
                <p className="notification-detail">{n.detail}</p>
              </div>
              <span className="notification-time">{n.time}</span>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="discover-empty">No notifications found.</p>
          )}
        </div>
      </main>
    </div>
  );
}
