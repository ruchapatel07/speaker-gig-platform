import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import HowItWorks from "../components/HowItWorks";

export default function LandingPage({ onNavigate }) {
  return (
    <div className="landing-page">
      <Navbar onNavigate={onNavigate} />
      <Hero onNavigate={onNavigate} />
      <Stats />
      <HowItWorks />

      <footer className="landing-footer">
        <p>© {new Date().getFullYear()} SpeakerGig. All rights reserved.</p>
      </footer>
    </div>
  );
}