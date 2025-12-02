// "use client";

// import { useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { useEffect, useState } from "react";
// import { Id } from "@/convex/_generated/dataModel";

// export default function TenantDashboard() {
//   const [tenantId, setTenantId] = useState<Id<"tenants"> | null>(null);

//   useEffect(() => {
//     const idFromStorage = localStorage.getItem("tenantId");

//     if (!idFromStorage) {
//       window.location.href = "/tenant/login";
//       return;
//     }

//     setTenantId(idFromStorage as Id<"tenants">);
//   }, []);

//   const tenant = useQuery(
//     api.tenants.getTenantById,
//     tenantId ? { id: tenantId } : "skip"
//   );

//   if (!tenant) return <p>Loading...</p>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-semibold mb-4">Tenant Dashboard</h1>

//       <div className="bg-white p-6 rounded-xl shadow-sm max-w-xl">
//         <p><strong>Name:</strong> {tenant.name}</p>
//         <p><strong>Email:</strong> {tenant.email}</p>
//         <p><strong>Unit:</strong> {tenant.unitId}</p>
//         <p><strong>Status:</strong> {tenant.status}</p>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";

export default function TenantDashboard() {
  const [tenantId, setTenantId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("tenantId");
    if (!id) {
      window.location.href = "/tenant/login";
    } else {
      setTenantId(id);
    }
  }, []);

  if (!tenantId) return null;

  return (
    <div className="p-8">
      <h1 className="text-2xl">Tenant Dashboard</h1>
    </div>
  );
}

