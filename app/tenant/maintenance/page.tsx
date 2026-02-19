// "use client";

// import { useEffect, useState } from "react";
// import { useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import Link from "next/link";

// type TenantSession = {
//   valid: boolean;
//   token: string;
// };

// export default function TenantMaintenanceList() {
//   const [session, setSession] = useState<TenantSession | null>(null);

//   useEffect(() => {
//     async function load() {
//       const res = await fetch("/api/tenant/get-session", {
//         credentials: "include",
//       });
//       const data = await res.json();

//       if (!data.valid || !data.token) {
//         window.location.href = "/tenant/login";
//         return;
//       }

//       setSession(data);
//     }

//     load();
//   }, []);

//   const requests = useQuery(
//     api.tenantMaintenance.getMyRequests,
//     session ? { token: session.token } : "skip"
//   );

//   if (!session || !requests) {
//     return <p className="p-6">Loading…</p>;
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-semibold">
//           My Maintenance Requests
//         </h1>

//         <Link
//           href="/tenant/maintenance/new"
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           New Request
//         </Link>
//       </div>

//       {requests.length === 0 && (
//         <p className="text-gray-500">
//           No maintenance requests submitted yet.
//         </p>
//       )}

//       <div className="space-y-4">
//         {requests.map((r) => (
//           <Link
//             key={r._id}
//             href={`/tenant/maintenance/${r._id}`}
//             className="block border rounded p-4 hover:bg-gray-50"
//           >
//             <div className="flex justify-between">
//               <h2 className="font-medium">{r.title}</h2>
//               <span className="capitalize text-sm">
//                 {r.status}
//               </span>
//             </div>

//             <p className="text-sm text-gray-500 mt-1">
//               {r.category} • {r.severity}
//             </p>

//             {r.scheduledDate ? (
//               <p className="text-sm mt-2">
//                 📅 {r.scheduledDate} {r.scheduledTimeFrom}–{r.scheduledTimeTo}
//               </p>
//             ) : (
//               <p className="text-sm mt-2 text-gray-400">
//                 Not scheduled yet
//               </p>
//             )}
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

type TenantSession = {
  valid: boolean;
  token: string;
};

export default function TenantMaintenanceList() {
  const [session, setSession] = useState<TenantSession | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/tenant/get-session", {
        credentials: "include",
      });
      const data = await res.json();

      if (!data.valid || !data.token) {
        window.location.href = "/tenant/login";
        return;
      }

      setSession(data);
    }

    load();
  }, []);

  const requests = useQuery(
    api.tenantMaintenance.getMyRequests,
    session ? { token: session.token } : "skip"
  );

  if (!session || !requests) {
    return (
      <div className="p-10">
        <p className="text-gray-500">Loading maintenance requests...</p>
      </div>
    );
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "open":
        return "bg-yellow-100 text-yellow-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-10">

      {/* HERO HEADER */}
      <div className="relative overflow-hidden rounded-3xl shadow-xl">

        <div className="absolute inset-0">
          {/* <img
            src="/superadmin.jpg"
            alt="Maintenance Background"
            className="w-full h-full object-cover"
          /> */}
          <div className="absolute inset-0 bg-indigo-900" />
        </div>

        <div className="relative z-10 p-10 text-white flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold">
              My Maintenance Requests
            </h1>
            <p className="mt-2 text-indigo-100">
              Track and manage issues in your unit.
            </p>
          </div>

          <Link
            href="/tenant/maintenance/new"
            className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-medium shadow hover:bg-indigo-50 transition"
          >
            + New Request
          </Link>
        </div>
      </div>

      {/* EMPTY STATE */}
      {requests.length === 0 && (
        <div className="bg-white rounded-2xl shadow-md p-10 text-center border border-gray-100">
          <p className="text-gray-500">
            You have not submitted any maintenance requests yet.
          </p>

          <Link
            href="/tenant/maintenance/new"
            className="inline-block mt-6 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
          >
            Submit First Request
          </Link>
        </div>
      )}

      {/* REQUEST LIST */}
      <div className="space-y-5">
        {requests.map((r) => (
          <Link
            key={r._id}
            href={`/tenant/maintenance/${r._id}`}
            className="block bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition"
          >
            <div className="flex justify-between items-start">

              <div>
                <h2 className="text-lg font-semibold">
                  {r.title}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {r.category} • {r.severity}
                </p>
              </div>

              <span
                className={`px-3 py-1 text-xs rounded-full capitalize font-medium ${getStatusStyle(
                  r.status
                )}`}
              >
                {r.status}
              </span>
            </div>

            {r.scheduledDate ? (
              <p className="text-sm mt-4 text-gray-700">
                📅 {r.scheduledDate} {r.scheduledTimeFrom}–{r.scheduledTimeTo}
              </p>
            ) : (
              <p className="text-sm mt-4 text-gray-400">
                Not scheduled yet
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
