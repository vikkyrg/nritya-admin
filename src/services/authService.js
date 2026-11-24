import api from './api';

const TOKEN_KEY = 'nd_admin_token';

export function getAdminToken() {
  return window.localStorage.getItem(TOKEN_KEY);
}

export function isAdminAuthenticated() {
  return Boolean(getAdminToken());
}

export async function login(email, password) {
  try {
    const res = await api.post('/auth/login', { email, password });
    const token = res.data?.token;
    if (token) {
      window.localStorage.setItem(TOKEN_KEY, token);
    }
    return token;
  } catch (error) {
    const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
    throw new Error(message);
  }
}

export function logout() {
  window.localStorage.removeItem(TOKEN_KEY);
}
