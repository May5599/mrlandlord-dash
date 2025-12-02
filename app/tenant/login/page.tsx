"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function TenantLoginPage() {
  const requestOtp = useMutation(api.tenantsAuth.requestOtp);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
  console.log("Send OTP clicked");

  try {
    setLoading(true);
    console.log("Before requestOtp");

    await requestOtp({ email });

    console.log("After requestOtp");
    window.location.href = `/tenant/login/verify?email=${email}`;
  } catch (err) {
    console.log("ERROR:", err);
    if (err instanceof Error) {
      alert(err.message);
    } else {
      alert("Something went wrong");
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Tenant Login</h1>

      <input
        className="w-full border p-2 rounded mb-4"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={handleSend}
        disabled={!email || loading}
        className="w-full bg-indigo-600 text-white p-2 rounded disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send Login Code"}
      </button>
    </div>
  );
}
