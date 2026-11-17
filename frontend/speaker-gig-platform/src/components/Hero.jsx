import React from "react";
import speakerPhoto from "../assets/speaker.jpg";

export default function Hero({ onNavigate }) {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>
          Find Your Next <span className="highlight">Speaking Opportunity</span>
        </h1>
        <p>
          SpeakerGig connects professional speakers with event organizers looking
          for the right voice. Build your profile, discover gigs, and grow your reach.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary btn-lg" onClick={() => onNavigate("register")}>
            Join as a Speaker
          </button>
          <button className="btn btn-ghost btn-lg" onClick={() => onNavigate("login")}>
            Login
          </button>
        </div>
      </div>
      <img src={speakerPhoto} alt="Speaker presenting on stage" className="hero-visual" />
    </section>
  );
}