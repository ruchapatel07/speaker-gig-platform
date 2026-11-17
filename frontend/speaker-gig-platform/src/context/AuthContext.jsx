/* oxlint-disable react/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("speakergig_token") || null;
    } catch {
      return null;
    }
  });
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("speakergig_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem("speakergig_token", token);
    } else {
      localStorage.removeItem("speakergig_token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("speakergig_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("speakergig_user");
    }
  }, [user]);

  const login = (authData) => {
    setToken(authData.token);
    setUser(authData.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

