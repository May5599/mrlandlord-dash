

// "use client";

// import { useState, FormEvent } from "react";
// import { fetchMutation } from "convex/nextjs";
// import { api } from "@/convex/_generated/api";
// import { useRouter } from "next/navigation";

// export default function AdminLoginPage() {
//   const router = useRouter();

//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const [error, setError] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);
//   const [resetMode, setResetMode] = useState<boolean>(false);
//   const [message, setMessage] = useState<string>("");

//   async function handleLogin(
//     event: FormEvent<HTMLFormElement>
//   ): Promise<void> {
//     event.preventDefault();

//     setError("");
//     setMessage("");
//     setLoading(true);

//     try {
//       const res = await fetchMutation(
//         api.superAdmins.login,
//         {
//           email: email.trim(),
//           passwordHash: password,
//         }
//       );

//       document.cookie =
//         "super_admin_token=" +
//         res.token +
//         "; path=/; SameSite=Strict";

//       router.push("/admin");
//     } catch {
//       setError("Invalid email or password");
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleResetRequest(
//     event: FormEvent<HTMLFormElement>
//   ): Promise<void> {
//     event.preventDefault();

//     setError("");
//     setMessage("");
//     setLoading(true);

//     try {
//       await fetchMutation(
//         api.superAdmins.requestPasswordReset,
//         {
//           email: email.trim(),
//         }
//       );

//       setMessage(
//         "If the email exists, a reset link has been sent."
//       );
//     } catch {
//       setError("Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-6 rounded-xl shadow w-96">
//         <h1 className="text-xl font-semibold mb-4">
//           Super Admin {resetMode ? "Reset Password" : "Login"}
//         </h1>

//         {error !== "" && (
//           <p className="text-red-600 text-sm mb-3">
//             {error}
//           </p>
//         )}

//         {message !== "" && (
//           <p className="text-green-600 text-sm mb-3">
//             {message}
//           </p>
//         )}

//         <form
//           onSubmit={
//             resetMode
//               ? handleResetRequest
//               : handleLogin
//           }
//         >
//           <input
//             type="email"
//             className="border p-2 w-full mb-3 rounded"
//             placeholder="Email"
//             value={email}
//             onChange={(e) =>
//               setEmail(e.target.value)
//             }
//             required
//           />

//           {!resetMode && (
//             <input
//               type="password"
//               className="border p-2 w-full mb-4 rounded"
//               placeholder="Password"
//               value={password}
//               onChange={(e) =>
//                 setPassword(e.target.value)
//               }
//               required
//             />
//           )}

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-indigo-600 text-white py-2 rounded disabled:opacity-50"
//           >
//             {loading
//               ? "Please wait..."
//               : resetMode
//               ? "Send Reset Link"
//               : "Login"}
//           </button>
//         </form>

//         <button
//           onClick={() => {
//             setResetMode(!resetMode);
//             setError("");
//             setMessage("");
//           }}
//           className="mt-4 text-sm text-indigo-600 underline"
//         >
//           {resetMode
//             ? "Back to login"
//             : "Forgot password?"}
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, FormEvent } from "react";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [resetMode, setResetMode] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetchMutation(api.superAdmins.login, {
        email: email.trim(),
        passwordHash: password,
      });

      document.cookie =
        "super_admin_token=" +
        res.token +
        "; path=/; SameSite=Strict";

      router.push("/admin");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetRequest(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      await fetchMutation(api.superAdmins.requestPasswordReset, {
        email: email.trim(),
      });

      setMessage("If the email exists, a reset link has been sent.");
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      
      {/* Background Image */}
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
              className="h-14 md:h-28 w-auto mb-3"
            />

            <h1 className="text-lg font-semibold text-gray-900">
              Super Admin Portal
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              {resetMode
                ? "Reset your password"
                : "Sign in to manage your platform"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          {/* Success Message */}
          {message && (
            <div className="mb-4 p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg">
              {message}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={resetMode ? handleResetRequest : handleLogin}
            className="space-y-4"
          >
            <input
              type="email"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {!resetMode && (
              <input
                type="password"
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-50 shadow-md"
            >
              {loading
                ? "Please wait..."
                : resetMode
                ? "Send Reset Link"
                : "Login"}
            </button>
          </form>

          {/* Toggle Reset Mode */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setResetMode(!resetMode);
                setError("");
                setMessage("");
              }}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition"
            >
              {resetMode ? "Back to login" : "Forgot password?"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
