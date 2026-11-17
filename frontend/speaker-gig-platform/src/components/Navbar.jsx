import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ onNavigate }) {
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-inner">

        {/* Logo */}
        <div className="navbar-logo" onClick={() => onNavigate("landing")}>
          <span className="logo-mark">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z"
                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              />
              <path
                d="M19 11a7 7 0 0 1-14 0M12 19v3"
                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="logo-text">
            Speaker<span className="logo-text-accent">Gig</span>
          </span>
        </div>

        {/* Nav links */}
        <nav className="navbar-links">
          <a
            href="#"
            className="navbar-link-active"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("landing");
            }}
          >
            Home
          </a>
          <a
            href="#stats"
            onClick={(e) => {
              if (isAuthenticated) {
                e.preventDefault();
                onNavigate("discover");
              }
            }}
          >
            Find Gigs
          </a>
          <a href="#how-it-works">How It Works</a>
          <a
            href="#pricing"
            onClick={(e) => {
              if (isAuthenticated) {
                e.preventDefault();
                onNavigate("subscription");
              }
            }}
          >
            Pricing
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <button
                className="btn btn-outline"
                onClick={() => onNavigate("profile")}
              >
                {user?.fullName ? user.fullName.split(" ")[0] : "Profile"}
              </button>
              <button
                className="btn btn-primary"
                onClick={() => onNavigate("dashboard")}
              >
                Go to Dashboard →
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-outline"
                onClick={() => onNavigate("login")}
              >
                Login
              </button>
              <button
                className="btn btn-primary"
                onClick={() => onNavigate("register")}
              >
                Sign Up
              </button>
            </>
          )}
        </div>

      </div>
    </header>
  );
}
