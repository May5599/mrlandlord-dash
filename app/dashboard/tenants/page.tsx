// "use client";

// import { api } from "@/convex/_generated/api";
// import { useQuery } from "convex/react";
// import TenantsNav from "./TenantsNav";


// export default function TenantsOverview() {
//   const tenants = useQuery(api.tenants.getAllTenants) ?? [];

//   // Stats
//   const total = tenants.length;
//   const active = tenants.filter((t) => t.status === "active").length;
//   const vacated = tenants.filter((t) => t.status === "vacated").length;
//   const pending = tenants.filter((t) => t.status === "pending").length;

//   const avgRent =
//     tenants.length > 0
//       ? Math.round(
//           tenants.reduce((sum, t) => sum + (t.rentAmount ?? 0), 0) /
//             tenants.length
//         )
//       : 0;

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-semibold mb-2">Tenants Overview</h1>
//       <p className="text-gray-600 mb-6">
//         Track tenant occupancy, lease performance, and rent activity.
//       </p>

//       <TenantsNav />
      

    

//       {/* Stats */}
//       <div className="grid grid-cols-4 gap-6 mb-8">
//         <StatCard title="Total Tenants" value={total} />
//         <StatCard title="Active" value={active} />
//         <StatCard title="Vacated" value={vacated} />
//         <StatCard title="Pending Move-in" value={pending} />
//         <StatCard title="Avg Rent" value={`$${avgRent}`} />
//       </div>

//       {/* Placeholder for charts */}
//       <div className="bg-white border rounded-xl p-6">
//         <h2 className="text-lg font-medium mb-2">Lease Overview</h2>
//         <p className="text-gray-500">Charts coming soon...</p>
//       </div>
//     </div>
//   );
// }

// /* -------------------------------------------------------
//    STAT CARD — TYPE SAFE, NO ANY
// -------------------------------------------------------- */
// function StatCard({
//   title,
//   value,
// }: {
//   title: string;
//   value: number | string;
// }) {
//   return (
//     <div className="bg-white border rounded-xl p-5">
//       <p className="text-gray-500 text-sm">{title}</p>
//       <h3 className="text-2xl font-semibold mt-2">{value}</h3>
//     </div>
//   );
// }
"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useSessionToken } from "@/hooks/useSessionToken";
import TenantsNav from "./TenantsNav";

export default function TenantsOverview() {
  const token = useSessionToken();
  const isReady = !!token;

  const tenants =
    useQuery(
      api.tenants.getAllTenants,
      isReady ? { token } : "skip"
    ) ?? [];

  // Stats
  const total = tenants.length;
  const active = tenants.filter(t => t.status === "active").length;
  const vacated = tenants.filter(t => t.status === "vacated").length;
  const pending = tenants.filter(t => t.status === "pending").length;

  const avgRent =
    tenants.length > 0
      ? Math.round(
          tenants.reduce((sum, t) => sum + (t.rentAmount ?? 0), 0) /
            tenants.length
        )
      : 0;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-2">Tenants Overview</h1>
      <p className="text-gray-600 mb-6">
        Track tenant occupancy, lease performance, and rent activity.
      </p>

      <TenantsNav />

      <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Tenants" value={total} />
        <StatCard title="Active" value={active} />
        <StatCard title="Vacated" value={vacated} />
        <StatCard title="Pending Move-in" value={pending} />
        <StatCard title="Avg Rent" value={`$${avgRent}`} />
      </div>

      <div className="bg-white border rounded-xl p-6">
        <h2 className="text-lg font-medium mb-2">Lease Overview</h2>
        <p className="text-gray-500">Charts coming soon...</p>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) {
  return (
    <div className="bg-white border rounded-xl p-5">
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className="text-2xl font-semibold mt-2">{value}</h3>
    </div>
  );
}
