import React from "react";

const STEPS = [
  { number: "01", title: "Create Your Profile", description: "Showcase your expertise, past talks, and topics you speak on so organizers can find you." },
  { number: "02", title: "Discover Gigs", description: "Browse speaking opportunities filtered by location, category, date, and experience level." },
  { number: "03", title: "Apply & Get Invited", description: "Apply directly or respond to invitations from event organizers looking for your expertise." },
  { number: "04", title: "Speak & Grow", description: "Deliver your talk, build your reputation, and unlock more opportunities over time." },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="how-it-works">
      <div className="section-header">
        <h2>How It Works</h2>
        <p>From profile to podium in four simple steps.</p>
      </div>

      <div className="steps-grid">
        {STEPS.map((step) => (
          <div key={step.number} className="step-card">
            <span className="step-number">{step.number}</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}