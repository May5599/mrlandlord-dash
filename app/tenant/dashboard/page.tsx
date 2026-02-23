

// "use client";

// import { useEffect, useState } from "react";
// import { api } from "@/convex/_generated/api";
// import { fetchQuery } from "convex/nextjs";

// export default function TenantDashboard() {
//   const [data, setData] = useState<any>(null);

// useEffect(() => {
//   async function load() {
//     // Step 1   verify session
//     const res = await fetch("/api/tenant/get-session", {
//       method: "GET",
//       credentials: "include",
//     });

//     const session = await res.json();

//     if (!session.valid) {
//       window.location.href = "/tenant/login";
//       return;
//     }

//     // Step 2   fetch dashboard data USING TOKEN
//     const d = await fetchQuery(api.tenantsDashboard.getTenantDashboard, {
//       token: session.token,
//     });

//     setData(d);
//   }

//   load();
// }, []);

//   if (!data) return <p>Loading...</p>;

//   return (
//     <div>
//       <h1 className="text-2xl font-semibold mb-6">Tenant Dashboard</h1>

//       {/* Profile Incomplete Reminder */}
//       {!data.profileComplete && (
//         <div className="p-4 mb-6 bg-blue-50 border border-blue-300 rounded-md">
//           <h3 className="font-semibold text-blue-800">Complete Your Profile</h3>
//           <p className="text-blue-700 text-sm mt-1">
//             Please fill out your tenant profile so your property manager has your important details.
//           </p>

//           <a
//             href="/tenant/profile"
//             className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//           >
//             Fill Profile
//           </a>
//         </div>
//       )}

//       <div className="space-y-4">
//         <div>
//           <h2 className="text-lg font-bold">Welcome, {data.name}</h2>
//         </div>

//         <div className="p-4 bg-white shadow rounded border">
//           <h3 className="font-semibold">Lease Details</h3>
//           <p>
//             Rent: ${data.rentAmount} / {data.rentFrequency}
//           </p>
//           <p>Lease Start: {data.leaseStart}</p>
//           <p>Lease End: {data.leaseEnd || "Not provided"}</p>
//         </div>

//         <div className="p-4 bg-white shadow rounded border">
//           <h3 className="font-semibold">Property</h3>
//           <p>Unit: {data.unitNumber}</p>
//           <p>Address: {data.propertyAddress}</p>
//         </div>

//         <div className="p-4 bg-white shadow rounded border">
//           <h3 className="font-semibold">Contact Info</h3>
//           <p>Email: {data.email}</p>
//           <p>Phone: {data.phone}</p>
//         </div>

//         <button
//           className="text-red-600 hover:underline mt-4"
//           onClick={async () => {
//             await fetch("/api/tenant/logout", { method: "POST" });
//             window.location.href = "/tenant/login";
//           }}
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";

export default function TenantDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/tenant/get-session", {
        method: "GET",
        credentials: "include",
      });

      const session = await res.json();

      if (!session.valid) {
        window.location.href = "/tenant/login";
        return;
      }

      const d = await fetchQuery(
        api.tenantsDashboard.getTenantDashboard,
        { token: session.token }
      );

      setData(d);
    }

    load();
  }, []);

  if (!data) {
    return (
      <div className="p-10">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">

      {/* HERO SECTION */}
      <div className="relative overflow-hidden rounded-3xl shadow-xl">

        <div className="absolute inset-0">
          {/* <img
            src="/superadmin.jpg"
            alt="Property Background"
            className="w-full h-full object-cover"
          /> */}
          <div className="absolute inset-0 bg-indigo-900" />
        </div>

        <div className="relative z-10 p-10 text-white">
          <h1 className="text-3xl font-semibold">
            Welcome, {data.name}
          </h1>

          <p className="mt-2 text-indigo-100">
            Manage your lease, payments and maintenance requests.
          </p>
        </div>
      </div>

      {/* PROFILE REMINDER */}
      {!data.profileComplete && (
        <div className="p-5 bg-blue-50 border border-blue-200 rounded-2xl">
          <h3 className="font-semibold text-indigo-800">
            Complete Your Profile
          </h3>

          <p className="text-blue-700 text-sm mt-1">
            Please fill out your tenant profile so your property manager has your details.
          </p>

          <a
            href="/tenant/profile"
            className="inline-block mt-4 px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
          >
            Fill Profile
          </a>
        </div>
      )}

      {/* GRID LAYOUT */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Lease Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">
            Lease Details
          </h3>

          <div className="space-y-2 text-gray-700">
            <p>
              <span className="font-medium">Rent:</span> ${data.rentAmount} / {data.rentFrequency}
            </p>
            <p>
              <span className="font-medium">Lease Start:</span> {data.leaseStart}
            </p>
            <p>
              <span className="font-medium">Lease End:</span>{" "}
              {data.leaseEnd || "Not provided"}
            </p>
          </div>
        </div>

        {/* Property Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">
            Property
          </h3>

          <div className="space-y-2 text-gray-700">
            <p>
              <span className="font-medium">Unit:</span> {data.unitNumber}
            </p>
            <p>
              <span className="font-medium">Address:</span> {data.propertyAddress}
            </p>
          </div>
        </div>

        {/* Contact Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 md:col-span-2">
          <h3 className="text-lg font-semibold mb-4">
            Contact Info
          </h3>

          <div className="grid md:grid-cols-2 gap-4 text-gray-700">
            <p>
              <span className="font-medium">Email:</span> {data.email}
            </p>
            <p>
              <span className="font-medium">Phone:</span> {data.phone}
            </p>
          </div>
        </div>
      </div>

      {/* Logout */}
      <div>
        <button
          className="text-red-600 hover:underline"
          onClick={async () => {
            await fetch("/api/tenant/logout", { method: "POST" });
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>

    </div>
  );
}
