import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import { profileAPI } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage({ onNavigate, onLogout }) {
  const { token, user } = useAuth();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    industry: "Technology",
    experience: "",
    languages: "",
    bio: "",
    photoUrl: "",
  });
  const [photoPreview, setPhotoPreview] = useState("https://i.pravatar.cc/120?img=12");
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await profileAPI.get(token);
        setForm({
          fullName: data.fullName || user?.fullName || "",
          industry: data.industry || "Technology",
          experience: data.experience || "",
          languages: data.languages || "",
          bio: data.bio || "",
          photoUrl: data.photoUrl || "",
        });
        if (data.photoUrl) {
          setPhotoPreview(data.photoUrl);
        }
      } catch (err) {
        // If profile fetch fails (e.g. backend offline), fallback gracefully using context user
        if (user?.fullName) {
          setForm((prev) => ({ ...prev, fullName: user.fullName }));
        }
        setServerError(err.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    }
    if (token) {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, [token, user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setForm((prev) => ({ ...prev, photoUrl: reader.result }));
        setSaved(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.experience.trim()) newErrors.experience = "Experience is required";
    if (!form.languages.trim()) newErrors.languages = "Add at least one language";
    if (!form.bio.trim()) {
      newErrors.bio = "Bio is required";
    } else if (form.bio.trim().length < 20) {
      newErrors.bio = "Bio should be at least 20 characters";
    }
    return newErrors;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setServerError("");
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      if (token) {
        await profileAPI.update(form, token);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      setServerError(err.message || "Unable to save profile.");
    }
  };

  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar activePage="profile" onNavigate={onNavigate} onLogout={onLogout} />
        <main className="app-main">
          <p style={{ padding: "40px", color: "#64748b" }}>Loading profile details...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar activePage="profile" onNavigate={onNavigate} onLogout={onLogout} />

      <main className="app-main">
        <div className="app-main-header">
          <div>
            <h1>My Profile</h1>
            <p>Build a strong speaker profile to get discovered by event organizers.</p>
          </div>
        </div>

        {serverError && <p className="server-error">{serverError}</p>}

        <div className="profile-card">
          <div className="profile-photo-block">
            <img
              src={photoPreview}
              alt="Profile"
              className="profile-photo"
            />
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handlePhotoUpload}
            />
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Change Photo
            </button>
          </div>

          <form className="profile-form" onSubmit={handleSave} noValidate>
            <div className="profile-form-grid">
              <div className="form-field">
                <label>Full Name</label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Sarah Jenkins"
                  className={errors.fullName ? "input-error" : ""}
                />
                {errors.fullName && <p className="field-error">{errors.fullName}</p>}
              </div>

              <div className="form-field">
                <label>Industry</label>
                <select name="industry" value={form.industry} onChange={handleChange}>
                  <option>Technology</option>
                  <option>Marketing</option>
                  <option>Finance</option>
                  <option>Healthcare</option>
                  <option>Education</option>
                  <option>Leadership</option>
                </select>
              </div>

              <div className="form-field">
                <label>Experience</label>
                <input
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  placeholder="e.g. 5+ Years, 40+ Keynotes"
                  className={errors.experience ? "input-error" : ""}
                />
                {errors.experience && <p className="field-error">{errors.experience}</p>}
              </div>

              <div className="form-field">
                <label>Languages</label>
                <input
                  name="languages"
                  value={form.languages}
                  onChange={handleChange}
                  placeholder="e.g. English, Spanish"
                  className={errors.languages ? "input-error" : ""}
                />
                {errors.languages && <p className="field-error">{errors.languages}</p>}
              </div>
            </div>

            <div className="form-field">
              <label>Bio / Speaker Statement</label>
              <textarea
                name="bio"
                rows={4}
                value={form.bio}
                onChange={handleChange}
                placeholder="Highlight your domain expertise, signature talks, and speaking style..."
                className={errors.bio ? "input-error" : ""}
              />
              {errors.bio && <p className="field-error">{errors.bio}</p>}
            </div>

            <div className="profile-form-actions">
              {saved && <span className="field-success">Profile saved successfully!</span>}
              <button type="submit" className="btn btn-primary">
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
