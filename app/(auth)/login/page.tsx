// "use client";

// import { useState } from "react";
// import { useMutation } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const router = useRouter();
//   const login = useMutation(api.companyAdmins.loginCompanyAdmin);

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // const handleLogin = async () => {
//   //   setError("");
//   //   setLoading(true);

//   //   try {
//   //     const res = await login({
//   //       email,
//   //       passwordHash: password,
//   //     });

//   //     // localStorage.setItem("admin_token", res.token);
//   //     document.cookie = `company_admin_token=${res.token}; path=/`;

//   //     router.push("/dashboard");
//   //   } catch {
//   //     setError("Invalid email or password");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };


//   const handleLogin = async () => {
//   setError("");
//   setLoading(true);

//   try {
//     const res = await login({
//       email,
//       passwordHash: password,
//     });

//     document.cookie = `company_admin_token=${res.token}; path=/`;
//     router.push("/dashboard");
//   } catch {
//     setError("Invalid email or password");
//   } finally {
//     setLoading(false);
//   }
// };
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="bg-white p-8 rounded-xl shadow-sm border w-[380px]">
//         <h1 className="text-2xl font-semibold mb-2">Company Login</h1>
//         <p className="text-gray-500 mb-6">
//           Sign in to manage your properties
//         </p>

//         <input
//           className="w-full border p-2 rounded mb-3"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <input
//           type="password"
//           className="w-full border p-2 rounded mb-4"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         {error && (
//           <p className="text-red-600 text-sm mb-3">{error}</p>
//         )}

//         <button
//           onClick={handleLogin}
//           disabled={loading}
//           className="w-full bg-indigo-600 text-white py-2 rounded"
//         >
//           {loading ? "Signing in..." : "Login"}
//         </button>
//       </div>
//     </div>
//   );
// }
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

      {/* Card */}
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
              Company Admin Login
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Sign in to manage your properties
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
