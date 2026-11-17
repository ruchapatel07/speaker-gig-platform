import React from "react";

// TODO: replace with real numbers from your API
const STATS = [
  { value: "1,240+", label: "Verified Speakers" },
  { value: "560+", label: "Events Hosted" },
  { value: "2,340+", label: "Applications Sent" },
  { value: "420+", label: "Active Subscriptions" },
];

export default function Stats() {
  return (
    <section id="stats" className="stats-section">
      <div className="stats-grid">
        {STATS.map((s) => (
          <div key={s.label} className="stat-card">
            <p className="stat-value">{s.value}</p>
            <p className="stat-label">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}