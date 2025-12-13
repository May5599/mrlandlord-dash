// "use client";

// import { useMutation } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { useSearchParams } from "next/navigation";
// import { useState } from "react";

// export default function VerifyOtpPage() {
//   const params = useSearchParams();
//   const email = params.get("email") || "";

//   const verifyOtp = useMutation(api.tenantsAuth.verifyOtp);
//   const [otp, setOtp] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleVerify = async () => {
//     setLoading(true);
//     setMessage("");

//     const res = await verifyOtp({ email, otp });

//     if (!res.success) {
//       setMessage(res.message || "Invalid code");
//       setLoading(false);
//       return;
//     }

//     // Set session
//     await fetch("/api/tenant/set-session", {
//       method: "POST",
//       body: JSON.stringify({ token: res.token }),
//     });

//     window.location.href = "/tenant/dashboard";
//   };

//   return (
//     <div className="p-8 max-w-md mx-auto">
//       <h1 className="text-xl font-semibold mb-4">Enter OTP</h1>

//       <input
//         className="w-full border p-2 rounded mb-4"
//         placeholder="6 digit OTP"
//         maxLength={6}
//         value={otp}
//         onChange={(e) => setOtp(e.target.value)}
//       />

//       {message && <p className="text-red-600">{message}</p>}

//       <button
//         onClick={handleVerify}
//         disabled={otp.length !== 6 || loading}
//         className="w-full bg-indigo-600 text-white p-2 rounded"
//       >
//         {loading ? "Verifying..." : "Verify Code"}
//       </button>
//     </div>
//   );
// }
