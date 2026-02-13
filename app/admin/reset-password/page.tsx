

// "use client";
// export const dynamic = "force-dynamic";

// import { useState, FormEvent, useEffect } from "react";
// import { fetchMutation } from "convex/nextjs";
// import { api } from "@/convex/_generated/api";
// import { useSearchParams, useRouter } from "next/navigation";

// export default function ResetPasswordPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const token = searchParams.get("token");

//   const [newPassword, setNewPassword] =
//     useState<string>("");
//   const [confirmPassword, setConfirmPassword] =
//     useState<string>("");
//   const [error, setError] = useState<string>("");
//   const [message, setMessage] = useState<string>("");
//   const [loading, setLoading] =
//     useState<boolean>(false);

//   useEffect(() => {
//     if (!token) {
//       setError("Invalid reset link.");
//     }
//   }, [token]);

//   async function handleSubmit(
//     event: FormEvent<HTMLFormElement>
//   ): Promise<void> {
//     event.preventDefault();

//     if (!token) return;

//     if (newPassword.length < 6) {
//       setError("Password must be at least 6 characters.");
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     setError("");
//     setLoading(true);

//     try {
//       await fetchMutation(
//         api.superAdmins.resetPassword,
//         {
//           token,
//           newPassword,
//         }
//       );

//       setMessage(
//         "Password reset successful. Redirecting..."
//       );

//       setTimeout(() => {
//         router.push("/admin/login");
//       }, 2000);
//     } catch {
//       setError(
//         "Invalid or expired reset link."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-6 rounded-xl shadow w-96">
//         <h1 className="text-xl font-semibold mb-4">
//           Reset Password
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

//         <form onSubmit={handleSubmit}>
//           <input
//             type="password"
//             className="border p-2 w-full mb-3 rounded"
//             placeholder="New Password"
//             value={newPassword}
//             onChange={(e) =>
//               setNewPassword(e.target.value)
//             }
//             required
//           />

//           <input
//             type="password"
//             className="border p-2 w-full mb-4 rounded"
//             placeholder="Confirm Password"
//             value={confirmPassword}
//             onChange={(e) =>
//               setConfirmPassword(e.target.value)
//             }
//             required
//           />

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-indigo-600 text-white py-2 rounded disabled:opacity-50"
//           >
//             {loading
//               ? "Updating..."
//               : "Reset Password"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
"use client";

import { Suspense } from "react";
import ResetPasswordPage from "./ResetPasswordPage";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordPage />
    </Suspense>
  );
}
