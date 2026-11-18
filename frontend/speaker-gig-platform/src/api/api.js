// Resolve API Base URL from environment (Vite) with fallback to local development
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const cleanBaseUrl = rawBaseUrl.replace(/\/+$/, "");
const API_BASE_URL = cleanBaseUrl.endsWith("/api")
  ? cleanBaseUrl
  : `${cleanBaseUrl}/api`;

async function request(endpoint, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export const authAPI = {
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  resetPassword: (payload) => request("/auth/reset-password", { method: "POST", body: payload }),
};

export const profileAPI = {
  get: (token) => request("/profile", { token }),
  update: (payload, token) => request("/profile", { method: "PUT", body: payload, token }),
};

export const gigsAPI = {
  list: (params, token) =>
    request(`/gigs?${new URLSearchParams(params || {})}`, { token }),
  get: (id, token) => request(`/gigs/${id}`, { token }),
  create: (payload, token) => request("/gigs", { method: "POST", body: payload, token }),
  update: (id, payload, token) => request(`/gigs/${id}`, { method: "PUT", body: payload, token }),
  delete: (id, token) => request(`/gigs/${id}`, { method: "DELETE", token }),
};

export const statsAPI = {
  get: (token) => request("/stats", { token }),
};

export const healthAPI = {
  check: () => request("/health"),
};
