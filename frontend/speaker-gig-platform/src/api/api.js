const API_BASE_URL = "http://localhost:5000/api";

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
};

export const statsAPI = {
  get: (token) => request("/stats", { token }),
};
