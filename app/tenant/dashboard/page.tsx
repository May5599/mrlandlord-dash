

"use client";

import { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";

export default function TenantDashboard() {
  const [data, setData] = useState<any>(null);

useEffect(() => {
  async function load() {
    // Step 1 — verify session
    const res = await fetch("/api/tenant/get-session", {
      method: "GET",
      credentials: "include",
    });

    const session = await res.json();

    if (!session.valid) {
      window.location.href = "/tenant/login";
      return;
    }

    // Step 2 — fetch dashboard data USING TOKEN
    const d = await fetchQuery(api.tenantsDashboard.getTenantDashboard, {
      token: session.token,
    });

    setData(d);
  }

  load();
}, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Tenant Dashboard</h1>

      {/* Profile Incomplete Reminder */}
      {!data.profileComplete && (
        <div className="p-4 mb-6 bg-blue-50 border border-blue-300 rounded-md">
          <h3 className="font-semibold text-blue-800">Complete Your Profile</h3>
          <p className="text-blue-700 text-sm mt-1">
            Please fill out your tenant profile so your property manager has your important details.
          </p>

          <a
            href="/tenant/profile"
            className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Fill Profile
          </a>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold">Welcome, {data.name}</h2>
        </div>

        <div className="p-4 bg-white shadow rounded border">
          <h3 className="font-semibold">Lease Details</h3>
          <p>
            Rent: ${data.rentAmount} / {data.rentFrequency}
          </p>
          <p>Lease Start: {data.leaseStart}</p>
          <p>Lease End: {data.leaseEnd || "Not provided"}</p>
        </div>

        <div className="p-4 bg-white shadow rounded border">
          <h3 className="font-semibold">Property</h3>
          <p>Unit: {data.unitNumber}</p>
          <p>Address: {data.propertyAddress}</p>
        </div>

        <div className="p-4 bg-white shadow rounded border">
          <h3 className="font-semibold">Contact Info</h3>
          <p>Email: {data.email}</p>
          <p>Phone: {data.phone}</p>
        </div>

        <button
          className="text-red-600 hover:underline mt-4"
          onClick={async () => {
            await fetch("/api/tenant/logout", { method: "POST" });
            window.location.href = "/tenant/login";
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
