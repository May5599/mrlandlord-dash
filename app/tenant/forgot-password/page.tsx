"use client";

import { useState } from "react";
import Link from "next/link";

export default function TenantForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/tenant/request-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src="/superadmin.jpg" alt="Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/55" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl p-8 border border-gray-100">
          <div className="mb-8 text-center flex flex-col items-center">
            <img src="/Mrlandlord.ca_FAW .svg" alt="MrLandlord Logo" className="h-14 md:h-28 w-auto mb-4" />
            <h1 className="text-lg font-semibold text-gray-900">Forgot Password</h1>
            <p className="text-sm text-gray-500 mt-1">Enter your email to receive a reset link</p>
          </div>

          {sent ? (
            <div className="text-center space-y-4">
              <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg">
                If that email exists, a reset link has been sent. Check your inbox.
              </div>
              <Link href="/tenant/login" className="text-sm text-indigo-600 hover:underline">
                Back to Login
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">{error}</div>
              )}
              <input
                type="email"
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <button
                onClick={handleSubmit}
                disabled={loading || !email}
                className="w-full py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-50 shadow-md"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
              <div className="text-center">
                <Link href="/tenant/login" className="text-sm text-gray-500 hover:text-indigo-600">
                  Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
