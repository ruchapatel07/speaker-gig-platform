import React, { useState } from "react";
import { authAPI } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Login({ onNavigate, onLoginSuccess }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot password modal state
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [resetForm, setResetForm] = useState({ email: "", newPassword: "", confirmPassword: "" });
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const fillAccount = (email, password) => {
    setForm({ email, password });
    setErrors({});
    setServerError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!form.password) {
      newErrors.password = "Password is required";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const data = await authAPI.login({
        email: form.email.trim(),
        password: form.password,
      });
      login(data);
      onLoginSuccess?.();
    } catch (err) {
      setServerError(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetError("");
    setResetSuccess("");

    if (!resetForm.email.trim()) {
      setResetError("Email is required");
      return;
    }
    if (!resetForm.newPassword) {
      setResetError("New password is required");
      return;
    }
    if (resetForm.newPassword.length < 6) {
      setResetError("Password must be at least 6 characters");
      return;
    }
    if (resetForm.newPassword !== resetForm.confirmPassword) {
      setResetError("Passwords do not match");
      return;
    }

    setResetLoading(true);
    try {
      const res = await authAPI.resetPassword({
        email: resetForm.email.trim(),
        newPassword: resetForm.newPassword,
      });
      setResetSuccess(res.message || "Password updated successfully!");
      setForm((prev) => ({ ...prev, email: resetForm.email.trim(), password: resetForm.newPassword }));
      setTimeout(() => {
        setIsResetOpen(false);
        setResetSuccess("");
        setResetForm({ email: "", newPassword: "", confirmPassword: "" });
      }, 1600);
    } catch (err) {
      setResetError(err.message || "Unable to reset password.");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form-side">
        <div className="auth-form-wrap">
          <div className="navbar-logo" onClick={() => onNavigate("landing")}>
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

          <h1>Welcome Back!</h1>
          <p className="auth-subtitle">Login to your account</p>

          {serverError && (
            <div className="server-error">
              <p>{serverError}</p>
              {serverError.toLowerCase().includes("no account found") && (
                <p style={{ marginTop: "6px", fontSize: "12px", color: "#b91c1c" }}>
                  Need an account? Click <strong>Create Account</strong> below to register.
                </p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-field">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={errors.email ? "input-error" : ""}
              />
              {errors.email && <p className="field-error">{errors.email}</p>}
            </div>

            <div className="form-field">
              <div className="form-field-header">
                <label>Password</label>
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => {
                    setResetForm((prev) => ({ ...prev, email: form.email }));
                    setResetError("");
                    setResetSuccess("");
                    setIsResetOpen(true);
                  }}
                >
                  Forgot Password?
                </button>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={errors.password ? "input-error" : ""}
                  style={{ paddingRight: "40px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    fontSize: "14px",
                    color: "#64748b",
                    padding: "4px",
                  }}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && <p className="field-error">{errors.password}</p>}
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Quick Account autofill buttons */}
          <div
            style={{
              marginTop: "16px",
              padding: "14px",
              background: "#f8fafc",
              border: "1px solid #f1f5f9",
              borderRadius: "10px",
              fontSize: "12px",
              color: "#475569",
            }}
          >
            <p style={{ fontWeight: 600, color: "#1e293b", marginBottom: "8px" }}>
              Quick Fill Accounts:
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontWeight: 500, color: "#0f172a" }}>patelrucha278@gmail.com</span>
                  <p style={{ color: "#94a3b8", fontSize: "11px" }}>Password: password123</p>
                </div>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  style={{ marginTop: 0 }}
                  onClick={() => fillAccount("patelrucha278@gmail.com", "password123")}
                >
                  Autofill
                </button>
              </div>

              <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontWeight: 500, color: "#0f172a" }}>testspeaker@example.com</span>
                  <p style={{ color: "#94a3b8", fontSize: "11px" }}>Password: password123</p>
                </div>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  style={{ marginTop: 0 }}
                  onClick={() => fillAccount("testspeaker@example.com", "password123")}
                >
                  Autofill
                </button>
              </div>
            </div>
          </div>

          <p className="auth-switch">
            Don't have an account?{" "}
            <button className="link-btn" onClick={() => onNavigate("register")}>Create Account</button>
          </p>
        </div>
      </div>
      <div className="auth-visual-side" />

      {/* Forgot / Reset Password Modal */}
      {isResetOpen && (
        <div className="modal-backdrop" onClick={() => setIsResetOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Reset Your Password</h2>
              <button
                className="modal-close-btn"
                onClick={() => setIsResetOpen(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleResetPassword}>
              <div className="modal-body">
                <p style={{ fontSize: "13px", color: "#64748b" }}>
                  Enter your registered account email and set a new password.
                </p>

                {resetError && <p className="server-error" style={{ margin: 0 }}>{resetError}</p>}
                {resetSuccess && <p className="field-success" style={{ margin: 0, width: "100%" }}>✓ {resetSuccess}</p>}

                <div className="form-field">
                  <label>Account Email</label>
                  <input
                    type="email"
                    value={resetForm.email}
                    onChange={(e) => setResetForm({ ...resetForm, email: e.target.value })}
                    placeholder="Enter your registered email"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>New Password (min 6 characters)</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={resetForm.newPassword}
                      onChange={(e) => setResetForm({ ...resetForm, newPassword: e.target.value })}
                      placeholder="Enter new password"
                      required
                      style={{ paddingRight: "40px" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        fontSize: "14px",
                        color: "#64748b",
                        padding: "4px",
                      }}
                    >
                      {showNewPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                <div className="form-field">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={resetForm.confirmPassword}
                    onChange={(e) => setResetForm({ ...resetForm, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setIsResetOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={resetLoading}
                >
                  {resetLoading ? "Updating..." : "Save New Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
