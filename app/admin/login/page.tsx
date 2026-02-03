"use client";

import { useState } from "react";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    setError("");

    try {
      const res = await fetchMutation(api.superAdmins.login, {
        email,
        passwordHash: password, // hashing later
      });

      document.cookie = `super_admin_token=${res.token}; path=/`;

      router.push("/admin");
    } catch (err) {
      setError("Invalid email or password");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow w-96">
        <h1 className="text-xl font-semibold mb-4">Super Admin Login</h1>

        {error && (
          <p className="text-red-600 text-sm mb-3">{error}</p>
        )}

        <input
          className="border p-2 w-full mb-3 rounded"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-2 w-full mb-4 rounded"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 text-white py-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
}
