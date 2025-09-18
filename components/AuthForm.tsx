"use client";

import { useState } from "react";
import { login } from "@/lib/auth";

export default function AuthForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const user = await login(username, password);
      console.log("Logged in:", user);
      // redirect to dashboard
      window.location.href = "/dashboard";
    } catch (err) {
      alert("Invalid credentials");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white shadow rounded-lg space-y-4">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
        Login
      </button>
    </form>
  );
}
