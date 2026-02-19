// "use client";

// import { useState } from "react";

// export default function TenantLoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleLogin = async () => {
//     setError("");

//     const res = await fetch("/api/tenant/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ email, password }),
//     });

//     const data = await res.json();

//     if (!data.success) {
//       setError(data.message);
//       return;
//     }

//     // Redirect after successful login
//     window.location.href = "/tenant";
//   };

//   return (
//     <div className="max-w-md mx-auto p-8">
//       <h1 className="text-2xl font-bold mb-4">Tenant Login</h1>

//       <input
//         className="w-full border p-2 rounded mb-4"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />

//       <input
//         className="w-full border p-2 rounded mb-4"
//         placeholder="Password"
//         type="password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />

//       {error && <p className="text-red-600 mb-4">{error}</p>}

//       <button
//   type="button"          // ← ADD THIS
//   className="w-full bg-blue-600 text-white p-2 rounded"
//   onClick={handleLogin}
// >
//   Login
// </button>

//     </div>
//   );
// }
"use client";

import { useState } from "react";

export default function TenantLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

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
      setLoading(false);
      return;
    }

    window.location.href = "/tenant";
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/superadmin.jpg"
          alt="MrLandlord Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl p-8 border border-gray-100">

          {/* Logo + Header */}
          <div className="mb-8 text-center flex flex-col items-center">
            <img
              src="/Mrlandlord.ca_FAW .svg"
              alt="MrLandlord Logo"
              className="h-14 md:h-28 w-auto mb-4"
            />

            <h1 className="text-lg font-semibold text-gray-900">
              Tenant Login
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Access your rental dashboard
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          {/* Inputs */}
          <div className="space-y-4">
            <input
              type="email"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-50 shadow-md"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
