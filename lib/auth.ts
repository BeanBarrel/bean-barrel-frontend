// lib/auth.ts
import { API_BASE_URL } from "./config";

const AUTH_KEY = "auth"; // localStorage key

// Login function
export async function login(username: string, password: string) {
  const credentials = btoa(`${username}:${password}`); // base64 encode
console.log("Tesing testing:", API_BASE_URL);
  // Test login by calling a protected endpoint
  const res = await fetch(`api/secure/hello`, {
    headers: {
      "Authorization": `Basic ${credentials}`,
    },
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  // Save credentials for future requests
  localStorage.setItem(AUTH_KEY, credentials);

  return { username };
}

// Logout function
export function logout() {
  localStorage.removeItem(AUTH_KEY);
  window.location.href = "/login";
}

// Helper for authenticated fetch
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  if (typeof window === "undefined") {
    throw new Error("fetchWithAuth can only be used in the browser");
  }

  const credentials = localStorage.getItem(AUTH_KEY);
  if (!credentials) throw new Error("Not authenticated");

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      "Authorization": `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Request failed: ${response.status} - ${text}`);
  }

  return response.json();
}
