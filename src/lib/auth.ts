// lib/auth.ts

const TOKEN_KEY = "auth_token";

/**
 * Get auth token from localStorage (client-only safe)
 */
export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Decode JWT safely
 */
const decodeToken = (token: string) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

/**
 * Check if token is expired (JWT only)
 */
export const isTokenExpired = (): boolean => {
  const token = getToken();
  if (!token) return true;

  const decoded = decodeToken(token);
  if (!decoded?.exp) return false; // if not JWT, skip expiry check

  return Date.now() > decoded.exp * 1000;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;

  if (isTokenExpired()) {
    localStorage.removeItem(TOKEN_KEY); // ❌ do NOT redirect here
    return false;
  }

  return true;
};

/**
 * Save token
 */
export const setToken = (token: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Logout user and redirect to login
 */
export const logout = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(TOKEN_KEY);

  window.location.replace("/login");
};