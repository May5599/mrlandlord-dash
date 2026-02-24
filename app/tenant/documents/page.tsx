

// "use client";

// import { useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { useSessionToken } from "@/hooks/useSessionToken";
// import MaintenanceImage from "@/components/MaintenanceImage";

// type TenantDocument = {
//   type: "photo_id" | "pay_stub" | "credit_report";
//   uploadedAt: number;
//   storageId: string;
// };

// export default function TenantDocumentsPage() {
//   const token = useSessionToken();
//   const isReady = !!token;


//   const [tenantId, setTenantId] = useState<string | null>(null);

// useEffect(() => {
//   async function load() {
//     const res = await fetch("/api/tenant/get-session", {
//       credentials: "include",
//     });

//     const session = await res.json();

//     if (session.valid) {
//       setTenantId(session.tenantId);
//     }
//   }

//   load();
// }, []);
//   const profile = useQuery(
//   api.tenants.getTenantApplicationProfile,
//   isReady ? { token, tenantId } : "skip"
// );

//   if (profile === undefined) {
//     return (
//       <div className="p-8 max-w-5xl mx-auto animate-pulse space-y-6">
//         <div className="h-6 w-64 bg-gray-200 rounded" />
//         <div className="grid md:grid-cols-3 gap-6">
//           {Array.from({ length: 3 }).map((_, i) => (
//             <div key={i} className="h-64 bg-gray-200 rounded-2xl" />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   if (!profile) {
//     return (
//       <div className="p-8 max-w-3xl mx-auto text-center">
//         <h2 className="text-xl font-semibold">
//           No application found
//         </h2>
//       </div>
//     );
//   }

//   const documents: TenantDocument[] = profile.documents ?? [];

//   return (
//     <div className="max-w-6xl mx-auto p-8 space-y-10">
//       <div>
//         <h1 className="text-3xl font-semibold">
//           My Submitted Documents
//         </h1>
//         <p className="text-gray-500 mt-2">
//           All documents submitted as part of your rental application
//         </p>
//       </div>

//       {documents.length > 0 ? (
//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {documents.map((doc) => (
//             <div
//               key={doc.storageId}
//               className="group bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
//             >
//               <div className="relative h-52 bg-gray-100">
//                 <MaintenanceImage storageId={doc.storageId} />
//               </div>

//               <div className="p-4 space-y-2">
//                 <p className="text-sm font-semibold capitalize">
//                   {doc.type.replace(/_/g, " ")}
//                 </p>

//                 <p className="text-xs text-gray-500">
//                   Uploaded on{" "}
//                   {new Date(doc.uploadedAt).toLocaleDateString()}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="bg-gray-50 border rounded-2xl p-10 text-center">
//           No documents uploaded yet
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import MaintenanceImage from "@/components/MaintenanceImage";
import { useSessionToken } from "@/hooks/useSessionToken";

type TenantDocument = {
  type: "photo_id" | "pay_stub" | "credit_report";
  uploadedAt: number;
  storageId: string;
};

export default function TenantDocumentsPage() {
  const token = useSessionToken();
  const [tenantId, setTenantId] = useState<Id<"tenants"> | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/tenant/get-session", {
        credentials: "include",
      });

      const session = await res.json();

      if (session.valid) {
        setTenantId(session.tenantId as Id<"tenants">);
      }
    }

    load();
  }, []);

  const profile = useQuery(
    api.tenants.getTenantApplicationProfile,
    token && tenantId ? { token, tenantId } : "skip"
  );

  if (profile === undefined) {
    return (
      <div className="p-8 max-w-5xl mx-auto animate-pulse space-y-6">
        <div className="h-6 w-64 bg-gray-200 rounded" />
        <div className="grid md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-8 max-w-3xl mx-auto text-center">
        <h2 className="text-xl font-semibold">
          No application found
        </h2>
      </div>
    );
  }

  const documents: TenantDocument[] = profile.documents ?? [];

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-10">
      <div>
        <h1 className="text-3xl font-semibold">
          My Submitted Documents
        </h1>
        <p className="text-gray-500 mt-2">
          All documents submitted as part of your rental application
        </p>
      </div>

      {documents.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {documents.map((doc) => (
            <div
              key={doc.storageId}
              className="group bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="relative h-52 bg-gray-100">
                <MaintenanceImage storageId={doc.storageId} />
              </div>

              <div className="p-4 space-y-2">
                <p className="text-sm font-semibold capitalize">
                  {doc.type.replace(/_/g, " ")}
                </p>

                <p className="text-xs text-gray-500">
                  Uploaded on{" "}
                  {new Date(doc.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 border rounded-2xl p-10 text-center">
          No documents uploaded yet
        </div>
      )}
    </div>
  );
}