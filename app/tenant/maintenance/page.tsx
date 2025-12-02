"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default function TenantMaintenancePage() {
  const [tenantId, setTenantId] = useState<Id<"tenants"> | null>(null);

  useEffect(() => {
  const stored = localStorage.getItem("tenantId");

  // If missing → redirect
  if (!stored) {
    window.location.href = "/tenant/login";
    return;
  }

  // Convex IDs are always long alphanumeric strings (no spaces)
  const isValidConvexId = /^[a-zA-Z0-9_-]{10,}$/.test(stored);

  if (!isValidConvexId) {
    localStorage.removeItem("tenantId");
    window.location.href = "/tenant/login";
    return;
  }

  setTenantId(stored as Id<"tenants">);
}, []);


  // 1. ALWAYS call useQuery, but skip until tenantId exists
  const tenant = useQuery(
    api.tenants.getTenantById,
    tenantId ? { id: tenantId } : "skip"
  );

  const createRequest = useMutation(api.maintenance.createRequest);

  const [data, setData] = useState({
    title: "",
    description: "",
    priority: "medium",
  });

  // 2. Loading state
  if (!tenantId) return <p>Loading tenant...</p>;
  if (tenant === undefined) return <p>Loading tenant data...</p>;

  // 3. Submit maintenance request
  const handleSubmit = async () => {
    if (!tenant) return alert("Tenant not loaded yet.");

    await createRequest({
      tenantId: tenant._id,
      propertyId: tenant.propertyId,
      unitId: tenant.unitId,
      title: data.title,
      description: data.description,
      priority: data.priority,
      images: [],
    });

    alert("Maintenance request submitted!");
    setData({ title: "", description: "", priority: "medium" });
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold mb-4">Request Maintenance</h1>
      <p className="text-gray-600 mb-6">
        Submit an issue directly to your property manager.
      </p>

      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <input
          className="w-full border p-2 rounded mb-4"
          placeholder="Issue Title"
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
        />

        <textarea
          className="w-full border p-2 rounded mb-4"
          placeholder="Describe the issue..."
          rows={4}
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
        />

        <select
          className="w-full border p-2 rounded mb-4"
          value={data.priority}
          onChange={(e) => setData({ ...data, priority: e.target.value })}
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>

        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 text-white p-2 rounded"
        >
          Submit Request
        </button>
      </div>
    </div>
  );
}
