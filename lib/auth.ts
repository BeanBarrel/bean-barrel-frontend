// lib/auth.ts
import { API_BASE_URL } from "./config";

const AUTH_KEY = "auth"; // localStorage key

// Login function
export async function login(username: string, password: string) {
  console.log("[Auth] Attempting login for user:", username);
  console.log("[Auth] API Base URL:", API_BASE_URL);
  
  const credentials = btoa(`${username}:${password}`); // base64 encode
  console.log("[Auth] Credentials encoded");

  const endpoint = `${API_BASE_URL}api/secure/hello`;
  console.log("[Auth] Calling endpoint:", endpoint);

  try {
    const res = await fetch(endpoint, {
      headers: {
        "Authorization": `Basic ${credentials}`,
      },
    });

    console.log("[Auth] Response status:", res.status);
    console.log("[Auth] Response ok:", res.ok);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("[Auth] Login failed:", errorText);
      throw new Error("Login failed");
    }

    const responseData = await res.text();
    console.log("[Auth] Response data:", responseData);

    // Save credentials for future requests
    localStorage.setItem(AUTH_KEY, credentials);
    console.log("[Auth] Credentials saved to localStorage");

    return { username };
  } catch (error) {
    console.error("[Auth] Login error:", error);
    throw error;
  }
}

// Logout function
export function logout() {
  console.log("[Auth] Logging out...");
  localStorage.removeItem(AUTH_KEY);
  console.log("[Auth] Credentials removed from localStorage");
  window.location.href = "/login";
}

// Helper for authenticated fetch
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  if (typeof window === "undefined") {
    throw new Error("fetchWithAuth can only be used in the browser");
  }

  const credentials = localStorage.getItem(AUTH_KEY);
  console.log("[Auth] fetchWithAuth - Has credentials:", !!credentials);
  
  if (!credentials) throw new Error("Not authenticated");

  const fullUrl = `${API_BASE_URL}${url}`;
  console.log("[Auth] fetchWithAuth - Calling:", fullUrl);
  console.log("[Auth] fetchWithAuth - Method:", options.method || "GET");
  if (options.body) {
    console.log("[Auth] fetchWithAuth - Body:", options.body);
  }

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        ...options.headers,
        "Authorization": `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
    });

    console.log("[Auth] fetchWithAuth - Response status:", response.status);

    if (!response.ok) {
      const text = await response.text();
      console.error("[Auth] fetchWithAuth - Error:", text);
      throw new Error(`Request failed: ${response.status} - ${text}`);
    }

    const data = await response.json();
    console.log("[Auth] fetchWithAuth - Success, data received");
    return data;
  } catch (error) {
    console.error("[Auth] fetchWithAuth - Error:", error);
    throw error;
  }
}