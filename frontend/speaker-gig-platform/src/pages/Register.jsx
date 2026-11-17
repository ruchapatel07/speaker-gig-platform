import React, { useState } from "react";
import { authAPI } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Register({ onNavigate }) {
  const { login } = useAuth();
  const [form, setForm] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName?.trim()) newErrors.fullName = "Full name is required";
    if (!form.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!form.location?.trim()) newErrors.location = "Location is required";
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
      const data = await authAPI.register({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        location: form.location.trim(),
      });

      if (data?.token) {
        login(data);
        onNavigate("dashboard");
      } else {
        try {
          const loginData = await authAPI.login({
            email: form.email.trim(),
            password: form.password,
          });
          login(loginData);
          onNavigate("dashboard");
        } catch {
          onNavigate("login");
        }
      }
    } catch (err) {
      setServerError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const FIELDS = [
    { name: "fullName", label: "Full Name", placeholder: "Enter your full name", type: "text" },
    { name: "email", label: "Email", placeholder: "Enter your email", type: "email" },
    { name: "password", label: "Password", placeholder: "Create your password", type: "password" },
    { name: "confirmPassword", label: "Confirm Password", placeholder: "Confirm your password", type: "password" },
    { name: "location", label: "Location", placeholder: "Enter your location (e.g. Bangalore, Mumbai)", type: "text" },
  ];

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

          <h1>Create Your Account</h1>
          <p className="auth-subtitle">Join thousands of professional speakers</p>

          {serverError && <p className="server-error">{serverError}</p>}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {FIELDS.map((f) => {
              const isPasswordField = f.type === "password";
              const isConfirm = f.name === "confirmPassword";
              const isVisible = isConfirm ? showConfirmPassword : showPassword;
              const toggleVisible = isConfirm
                ? () => setShowConfirmPassword(!showConfirmPassword)
                : () => setShowPassword(!showPassword);

              return (
                <div className="form-field" key={f.name}>
                  <label>{f.label}</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={isPasswordField ? (isVisible ? "text" : "password") : f.type}
                      name={f.name}
                      value={form[f.name] || ""}
                      onChange={handleChange}
                      placeholder={f.placeholder}
                      className={errors[f.name] ? "input-error" : ""}
                      style={isPasswordField ? { paddingRight: "40px" } : {}}
                    />
                    {isPasswordField && (
                      <button
                        type="button"
                        onClick={toggleVisible}
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
                        title={isVisible ? "Hide password" : "Show password"}
                      >
                        {isVisible ? "🙈" : "👁️"}
                      </button>
                    )}
                  </div>
                  {errors[f.name] && <p className="field-error">{errors[f.name]}</p>}
                </div>
              );
            })}
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{" "}
            <button className="link-btn" onClick={() => onNavigate("login")}>Login</button>
          </p>
        </div>
      </div>
      <div className="auth-visual-side" />
    </div>
  );
}
