import { API_BASE_URL } from "./config";

export async function login(username: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    credentials: "include", // if using cookies
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json(); // token or user data
}
