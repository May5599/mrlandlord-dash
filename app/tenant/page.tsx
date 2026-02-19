// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// type TenantSession = {
//   valid: boolean;
//   token: string;
//   tenant?: {
//     name?: string;
//   };
// };

// export default function TenantHomePage() {
//   const router = useRouter();
//   const [session, setSession] = useState<TenantSession | null>(null);

//   useEffect(() => {
//     async function load() {
//       const res = await fetch("/api/tenant/get-session", {
//         credentials: "include",
//       });

//       const data = await res.json();

//       if (!data.valid) {
//         router.push("/tenant/login");
//         return;
//       }

//       setSession(data);
//     }

//     load();
//   }, [router]);

//   if (!session) return <p className="p-8">Loading...</p>;

//   const tenantName = session.tenant?.name ?? "";

//   return (
//     <div className="p-8 max-w-6xl mx-auto">
//       {/* DASHBOARD HERO */}
//       <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 p-10 text-white shadow-lg">
//         <div className="relative z-10">
//           <h1 className="text-3xl font-semibold">
//             Welcome{tenantName ? `, ${tenantName}` : ""}
//           </h1>

//           <p className="mt-2 text-indigo-100 max-w-xl">
//             Your tenant dashboard. Manage maintenance requests and stay updated
//             on work happening in your unit.
//           </p>

//           <div className="mt-6 flex gap-4">
//             <button
//               onClick={() => router.push("/tenant/maintenance")}
//               className="bg-white text-indigo-700 px-6 py-3 rounded-lg font-medium shadow hover:bg-indigo-50 transition"
//             >
//               Open Dashboard
//             </button>
//           </div>
//         </div>

//         {/* subtle background decoration */}
//         <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
//         <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-2xl" />
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type TenantSession = {
  valid: boolean;
  token: string;
  tenant?: {
    name?: string;
  };
};

export default function TenantHomePage() {
  const router = useRouter();
  const [session, setSession] = useState<TenantSession | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/tenant/get-session", {
        credentials: "include",
      });

      const data = await res.json();

      if (!data.valid) {
        router.push("/tenant/login");
        return;
      }

      setSession(data);
    }

    load();
  }, [router]);

  if (!session) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  const tenantName = session.tenant?.name ?? "";

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">

      {/* HERO SECTION */}
      <div className="relative overflow-hidden rounded-3xl shadow-2xl">

        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/superadmin.jpg"
            alt="Property Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-indigo-900/70" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-12 text-white">

          {/* Logo Mark */}
          <div className="mb-6">
            <img
              src="/Mrlandlord.ca_FAW .svg"
              alt="MrLandlord Logo"
              className="h-10 w-auto opacity-90"
            />
          </div>

          <h1 className="text-4xl font-semibold tracking-tight">
            Welcome{tenantName ? `, ${tenantName}` : ""}
          </h1>

          <p className="mt-4 text-indigo-100 max-w-xl text-lg">
            Manage your maintenance requests, payments, and stay updated
            on everything happening in your rental unit.
          </p>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => router.push("/tenant/maintenance")}
              className="bg-white text-indigo-700 px-6 py-3 rounded-xl font-medium shadow-lg hover:bg-indigo-50 transition"
            >
              View Maintenance
            </button>

            <button
              onClick={() => router.push("/tenant/payments")}
              className="bg-indigo-500/30 backdrop-blur px-6 py-3 rounded-xl font-medium border border-white/30 hover:bg-indigo-500/40 transition"
            >
              View Payments
            </button>
          </div>
        </div>
      </div>

      {/* QUICK ACTION CARDS */}
      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-2">
            Maintenance
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            Submit and track maintenance requests.
          </p>
          <button
            onClick={() => router.push("/tenant/maintenance")}
            className="text-indigo-600 font-medium hover:underline"
          >
            Open →
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-2">
            Payments
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            Review rent history and upcoming dues.
          </p>
          <button
            onClick={() => router.push("/tenant/payments")}
            className="text-indigo-600 font-medium hover:underline"
          >
            View →
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-2">
            Documents
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            Access lease agreements and notices.
          </p>
          <button
            onClick={() => router.push("/tenant/documents")}
            className="text-indigo-600 font-medium hover:underline"
          >
            Access →
          </button>
        </div>

      </div>
    </div>
  );
}

