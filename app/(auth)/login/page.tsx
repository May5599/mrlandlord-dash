"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const login = useMutation(api.companyAdmins.loginCompanyAdmin);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // const handleLogin = async () => {
  //   setError("");
  //   setLoading(true);

  //   try {
  //     const res = await login({
  //       email,
  //       passwordHash: password,
  //     });

  //     // localStorage.setItem("admin_token", res.token);
  //     document.cookie = `company_admin_token=${res.token}; path=/`;

  //     router.push("/dashboard");
  //   } catch {
  //     setError("Invalid email or password");
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const handleLogin = async () => {
  setError("");
  setLoading(true);

  try {
    const res = await login({
      email,
      passwordHash: password,
    });

    document.cookie = `company_admin_token=${res.token}; path=/`;
    router.push("/dashboard");
  } catch {
    setError("Invalid email or password");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-sm border w-[380px]">
        <h1 className="text-2xl font-semibold mb-2">Company Login</h1>
        <p className="text-gray-500 mb-6">
          Sign in to manage your properties
        </p>

        <input
          className="w-full border p-2 rounded mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-2 rounded mb-4"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-600 text-sm mb-3">{error}</p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </div>
    </div>
  );
}
