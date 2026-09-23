/**
 * Admin authentication service.
 *
 * Logs the admin in against POST /api/auth/login, keeps the returned JWT in
 * localStorage and exposes it for authorized API requests.
 */

const resolveApiBaseUrl = () => {
  const configured = import.meta.env.VITE_API_BASE_URL;
  const isLocalhostUrl = (value) => /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/?$/i.test(value || '');

  if (!configured || isLocalhostUrl(configured)) {
    return import.meta.env.DEV ? '' : window.location.origin;
  }

  return configured.replace(/\/$/, '');
};

const API_BASE_URL = resolveApiBaseUrl();
const TOKEN_KEY = 'nd_admin_token';

export function getAdminToken() {
  return window.localStorage.getItem(TOKEN_KEY);
}

export function isAdminAuthenticated() {
  return Boolean(getAdminToken());
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Login failed (${res.status})`);
  }
  if (!data.token) {
    throw new Error('Login response did not include a token.');
  }
  window.localStorage.setItem(TOKEN_KEY, data.token);
  return data.token;
}

export function logout() {
  window.localStorage.removeItem(TOKEN_KEY);
}
