// // "use client";

// // import { useParams } from "next/navigation";
// // import { useQuery } from "convex/react";
// // import { api } from "@/convex/_generated/api";
// // import { useEffect, useState } from "react";
// // import { Id } from "@/convex/_generated/dataModel";


// // type TenantSession = {
// //   valid: boolean;
// //   token: string;
// // };

// // export default function TenantMaintenanceDetails() {
// //   const { id } = useParams<{ id: string }>();
// //   const [session, setSession] = useState<TenantSession | null>(null);

// //   useEffect(() => {
// //     async function load() {
// //       const res = await fetch("/api/tenant/get-session", {
// //         credentials: "include",
// //       });
// //       const data = await res.json();

// //       if (!data.valid || !data.token) {
// //         window.location.href = "/tenant/login";
// //         return;
// //       }

// //       setSession(data);
// //     }

// //     load();
// //   }, []);

// //   const request = useQuery(
// //     api.tenantMaintenance.getMyRequestById,
// //    session
// //   ? { token: session.token, id: id as Id<"maintenance"> }
// //   : "skip"

// //   );

// //   if (!session || !request) {
// //     return <p className="p-6">Loading…</p>;
// //   }

// //   return (
// //     <div className="max-w-3xl mx-auto p-6">
// //       <h1 className="text-2xl font-semibold mb-2">
// //         {request.title}
// //       </h1>

// //       <p className="text-gray-600 mb-6">
// //         {request.description}
// //       </p>

// //       <div className="space-y-3">
// //         <div>
// //           <strong>Status:</strong>{" "}
// //           <span className="capitalize">{request.status}</span>
// //         </div>

// //         <div>
// //           <strong>Category:</strong> {request.category}
// //         </div>

// //         <div>
// //           <strong>Severity:</strong> {request.severity}
// //         </div>

// //         <div>
// //           <strong>Schedule:</strong>{" "}
// //           {request.scheduledDate ? (
// //             <>
// //               {request.scheduledDate}{" "}
// //               {request.scheduledTimeFrom}–{request.scheduledTimeTo}
// //             </>
// //           ) : (
// //             <span className="text-gray-500">
// //               Waiting for landlord
// //             </span>
// //           )}
// //         </div>

// //         <div>
// //           <strong>Vendor:</strong>{" "}
// //           {request.assignedVendorId
// //             ? "Assigned"
// //             : "Not assigned yet"}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// "use client";

// import MaintenanceImage from "@/components/MaintenanceImage";

// import { useParams } from "next/navigation";
// import { useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { useEffect, useState } from "react";
// import { Id } from "@/convex/_generated/dataModel";

// type TenantSession = {
//   valid: boolean;
//   token: string;
// };

// export default function TenantMaintenanceDetails() {
//   const { id } = useParams<{ id: string }>();
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

//   const request = useQuery(
//     api.tenantMaintenance.getMyRequestById,
//     session
//       ? { token: session.token, id: id as Id<"maintenance"> }
//       : "skip"
//   );

//   if (!session || !request) {
//     return (
//       <div className="p-10">
//         <p className="text-gray-500">Loading request details...</p>
//       </div>
//     );
//   }

//   const getStatusStyle = (status: string) => {
//     switch (status) {
//       case "open":
//         return "bg-yellow-100 text-yellow-800";
//       case "scheduled":
//         return "bg-blue-100 text-blue-800";
//       case "completed":
//         return "bg-green-100 text-green-800";
//       case "cancelled":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-700";
//     }
//   };

//   return (
//     <div className="space-y-10">

//       {/* HERO */}
//       <div className="relative overflow-hidden rounded-3xl shadow-xl">
//         <div className="absolute inset-0">
//           {/* <img
//             src="/superadmin.jpg"
//             alt="Maintenance Background"
//             className="w-full h-full object-cover"
//           /> */}
//           <div className="absolute inset-0 bg-indigo-900" />
//         </div>

//         <div className="relative z-10 p-10 text-white">
//           <h1 className="text-3xl font-semibold">
//             {request.title}
//           </h1>

//           <div className="mt-4">
//             <span
//               className={`px-4 py-1 rounded-full text-sm font-medium capitalize ${getStatusStyle(
//                 request.status
//               )}`}
//             >
//               {request.status}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* DETAILS CARD */}
//       <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100 space-y-8">

//         {/* Description */}
//         <div>
//           <h2 className="text-lg font-semibold mb-2">
//             Description
//           </h2>
//           <p className="text-gray-600 leading-relaxed">
//             {request.description}
//           </p>
//         </div>

//         {/* Info Grid */}
//         <div className="grid md:grid-cols-2 gap-6">

//           <div className="bg-gray-50 rounded-2xl p-6 border">
//             <h3 className="font-semibold mb-4">
//               Request Details
//             </h3>

//             <div className="space-y-3 text-gray-700">
//               <p>
//                 <span className="font-medium">Category:</span>{" "}
//                 {request.category}
//               </p>

//               <p>
//                 <span className="font-medium">Severity:</span>{" "}
//                 {request.severity}
//               </p>

//               <p>
//                 <span className="font-medium">Vendor:</span>{" "}
//                 {request.assignedVendorId
//                   ? "Assigned"
//                   : "Not assigned yet"}
//               </p>
//             </div>
//           </div>

//           <div className="bg-gray-50 rounded-2xl p-6 border">
//             <h3 className="font-semibold mb-4">
//               Schedule
//             </h3>

//             {request.scheduledDate ? (
//               <p className="text-gray-700">
//                 📅 {request.scheduledDate}{" "}
//                 {request.scheduledTimeFrom}–{request.scheduledTimeTo}
//               </p>
//             ) : (
//               <p className="text-gray-400">
//                 Waiting for landlord to schedule
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Images Section (if exist) */}
//         {request.images && request.images.length > 0 && (
//           <div>
//             <h2 className="text-lg font-semibold mb-4">
//               Uploaded Images
//             </h2>

//             {/* <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//               {request.images.map((img: string, index: number) => (
//                 <img
//                   key={index}
//                   src={img}
//                   alt="Maintenance"
//                   className="rounded-xl shadow border object-cover h-32 w-full"
//                 />
//               ))}
//             </div> */}

//              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//                         {maintenance.images.map((storageId: string) => (
//                           <div
//               key={storageId}
//               className="relative h-64 w-full rounded-xl overflow-hidden border bg-gray-100 shadow-sm"
//             >
//               <MaintenanceImage storageId={storageId} />
//             </div>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }

"use client";

import MaintenanceImage from "@/components/MaintenanceImage";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";

type TenantSession = {
  valid: boolean;
  token: string;
};

export default function TenantMaintenanceDetails() {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<TenantSession | null>(null);

  /* -----------------------------
     LOAD TENANT SESSION
  ----------------------------- */
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

  /* -----------------------------
     FETCH REQUEST
  ----------------------------- */
  const request = useQuery(
    api.tenantMaintenance.getMyRequestById,
    session && id
      ? { token: session.token, id: id as Id<"maintenance"> }
      : "skip"
  );

  /* -----------------------------
     LOADING STATE
  ----------------------------- */
  if (!session || request === undefined) {
    return (
      <div className="p-10">
        <p className="text-gray-500">Loading request details...</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="p-10">
        <p className="text-red-500">Request not found.</p>
      </div>
    );
  }

  /* -----------------------------
     STATUS STYLE
  ----------------------------- */
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

  /* -----------------------------
     UI
  ----------------------------- */
  return (
    <div className="space-y-10">

      {/* HERO SECTION */}
      <div className="relative overflow-hidden rounded-3xl shadow-xl">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-indigo-900" />
        </div>

        <div className="relative z-10 p-10 text-white">
          <h1 className="text-3xl font-semibold">
            {request.title}
          </h1>

          <div className="mt-4">
            <span
              className={`px-4 py-1 rounded-full text-sm font-medium capitalize ${getStatusStyle(
                request.status
              )}`}
            >
              {request.status}
            </span>
          </div>
        </div>
      </div>

      {/* DETAILS CARD */}
      <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100 space-y-8">

        {/* Description */}
        <div>
          <h2 className="text-lg font-semibold mb-2">
            Description
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {request.description}
          </p>
        </div>

        {/* INFO GRID */}
        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-gray-50 rounded-2xl p-6 border">
            <h3 className="font-semibold mb-4">
              Request Details
            </h3>

            <div className="space-y-3 text-gray-700">
              <p>
                <span className="font-medium">Category:</span>{" "}
                {request.category}
              </p>

              <p>
                <span className="font-medium">Severity:</span>{" "}
                {request.severity}
              </p>

              <p>
                <span className="font-medium">Vendor:</span>{" "}
                {request.assignedVendorId
                  ? "Assigned"
                  : "Not assigned yet"}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 border">
            <h3 className="font-semibold mb-4">
              Schedule
            </h3>

            {request.scheduledDate ? (
              <p className="text-gray-700">
                📅 {request.scheduledDate}{" "}
                {request.scheduledTimeFrom}–{request.scheduledTimeTo}
              </p>
            ) : (
              <p className="text-gray-400">
                Waiting for landlord to schedule
              </p>
            )}
          </div>
        </div>

        {/* IMAGES SECTION */}
        {request.images && request.images.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Uploaded Images
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {request.images.map((storageId: string) => (
                <div
                  key={storageId}
                  className="relative h-64 w-full rounded-xl overflow-hidden border bg-gray-100 shadow-sm"
                >
                  <MaintenanceImage storageId={storageId} />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}