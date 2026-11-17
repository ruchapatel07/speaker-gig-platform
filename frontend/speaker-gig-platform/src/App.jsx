import React, { useState } from "react";
import "./App.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProfilePage from "./pages/ProfilePage";
import DashboardPage from "./pages/DashboardPage";
import DiscoverPage from "./pages/DiscoverPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import MyGigsPage from "./pages/MyGigsPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import NotificationsPage from "./pages/NotificationsPage";

const PROTECTED_PAGES = [
  "profile",
  "dashboard",
  "discover",
  "applications",
  "mygigs",
  "subscription",
  "notifications",
];

function AppContent() {
  const [page, setPage] = useState("landing");
  const { isAuthenticated, logout } = useAuth();

  const handleNavigate = (targetPage) => {
    if (PROTECTED_PAGES.includes(targetPage) && !isAuthenticated) {
      setPage("login");
      return;
    }
    setPage(targetPage);
  };

  const handleLoginSuccess = () => {
    setPage("dashboard");
  };

  const handleLogout = () => {
    logout();
    setPage("landing");
  };

  return (
    <>
      {page === "landing" && <LandingPage onNavigate={handleNavigate} />}
      {page === "login" && <Login onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />}
      {page === "register" && <Register onNavigate={handleNavigate} />}
      {page === "profile" && <ProfilePage onNavigate={handleNavigate} onLogout={handleLogout} />}
      {page === "dashboard" && <DashboardPage onNavigate={handleNavigate} onLogout={handleLogout} />}
      {page === "discover" && <DiscoverPage onNavigate={handleNavigate} onLogout={handleLogout} />}
      {page === "applications" && <ApplicationsPage onNavigate={handleNavigate} onLogout={handleLogout} />}
      {page === "mygigs" && <MyGigsPage onNavigate={handleNavigate} onLogout={handleLogout} />}
      {page === "subscription" && <SubscriptionPage onNavigate={handleNavigate} onLogout={handleLogout} />}
      {page === "notifications" && <NotificationsPage onNavigate={handleNavigate} onLogout={handleLogout} />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}