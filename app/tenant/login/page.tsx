"use client";

import { useState } from "react";

export default function TenantLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    const res = await fetch("/api/tenant/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!data.success) {
      setError(data.message);
      return;
    }

    // Redirect after successful login
    window.location.href = "/tenant/dashboard";
  };

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Tenant Login</h1>

      <input
        className="w-full border p-2 rounded mb-4"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full border p-2 rounded mb-4"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <button
  type="button"          // ← ADD THIS
  className="w-full bg-blue-600 text-white p-2 rounded"
  onClick={handleLogin}
>
  Login
</button>

    </div>
  );
}
