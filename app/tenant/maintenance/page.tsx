// "use client";

// import { useEffect, useState } from "react";
// import { useQuery, useMutation } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { Id } from "@/convex/_generated/dataModel";

// export default function TenantMaintenancePage() {
//   const [tenantId, setTenantId] = useState<Id<"tenants"> | null>(null);

//   useEffect(() => {
//   const stored = localStorage.getItem("tenantId");

//   // If missing → redirect
//   if (!stored) {
//     window.location.href = "/tenant/login";
//     return;
//   }

//   // Convex IDs are always long alphanumeric strings (no spaces)
//   const isValidConvexId = /^[a-zA-Z0-9_-]{10,}$/.test(stored);

//   if (!isValidConvexId) {
//     localStorage.removeItem("tenantId");
//     window.location.href = "/tenant/login";
//     return;
//   }

//   setTenantId(stored as Id<"tenants">);
// }, []);


//   // 1. ALWAYS call useQuery, but skip until tenantId exists
//   const tenant = useQuery(
//     api.tenants.getTenantById,
//     tenantId ? { id: tenantId } : "skip"
//   );

//   const createRequest = useMutation(api.maintenance.createRequest);

//   const [data, setData] = useState({
//     title: "",
//     description: "",
//     priority: "medium",
//   });

//   // 2. Loading state
//   if (!tenantId) return <p>Loading tenant...</p>;
//   if (tenant === undefined) return <p>Loading tenant data...</p>;

//   // 3. Submit maintenance request
//   const handleSubmit = async () => {
//     if (!tenant) return alert("Tenant not loaded yet.");

//     await createRequest({
//       tenantId: tenant._id,
//       propertyId: tenant.propertyId,
//       unitId: tenant.unitId,
//       title: data.title,
//       description: data.description,
//       priority: data.priority,
//       images: [],
//     });

//     alert("Maintenance request submitted!");
//     setData({ title: "", description: "", priority: "medium" });
//   };

//   return (
//     <div className="max-w-xl">
//       <h1 className="text-2xl font-semibold mb-4">Request Maintenance</h1>
//       <p className="text-gray-600 mb-6">
//         Submit an issue directly to your property manager.
//       </p>

//       <div className="bg-white p-6 rounded-xl border shadow-sm">
//         <input
//           className="w-full border p-2 rounded mb-4"
//           placeholder="Issue Title"
//           value={data.title}
//           onChange={(e) => setData({ ...data, title: e.target.value })}
//         />

//         <textarea
//           className="w-full border p-2 rounded mb-4"
//           placeholder="Describe the issue..."
//           rows={4}
//           value={data.description}
//           onChange={(e) => setData({ ...data, description: e.target.value })}
//         />

//         <select
//           className="w-full border p-2 rounded mb-4"
//           value={data.priority}
//           onChange={(e) => setData({ ...data, priority: e.target.value })}
//         >
//           <option value="low">Low Priority</option>
//           <option value="medium">Medium Priority</option>
//           <option value="high">High Priority</option>
//         </select>

//         <button
//           onClick={handleSubmit}
//           className="w-full bg-indigo-600 text-white p-2 rounded"
//         >
//           Submit Request
//         </button>
//       </div>
//     </div>
//   );
// }



"use client";

import { useState, useEffect } from "react";
import { fetchQuery, fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export default function MaintenancePage() {
  const [session, setSession] = useState<any>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    severity: "",
    location: "",
    accessPreference: "",
    allowEntry: true,
    images: [],
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/tenant/get-session", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      if (!data.valid) {
        window.location.href = "/tenant/login";
        return;
      }

      setSession(data);
    }

    load();
  }, []);

  if (!session) return <p>Loading...</p>;

  // Helpers
  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    if (!form.title || !form.description || !form.category || !form.severity) {
      alert("Please fill all required fields");
      return;
    }

    const result = await fetchMutation(api.maintenance.createMaintenance, {
      propertyId: session.propertyId,
      unitId: session.unitId,
      tenantId: session.tenantId,

      title: form.title,
      description: form.description,
      


      category: form.category,
      severity: form.severity,
      location: form.location,

      accessPreference: form.accessPreference,
      allowEntry: form.allowEntry,
      // priority: form.severity,

      images: form.images,
    });

    alert("Request submitted");
    window.location.href = "/tenant/dashboard";
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-semibold mb-6">Submit Maintenance Request</h1>

      <div className="space-y-4">

        {/* title */}
        <input
          type="text"
          placeholder="Short title"
          className="w-full border p-2 rounded"
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
        />

        {/* description */}
        <textarea
          placeholder="Describe the issue"
          className="w-full border p-2 rounded h-28"
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
        />

        {/* Category */}
        <select
          className="w-full border p-2 rounded"
          value={form.category}
          onChange={(e) => updateField("category", e.target.value)}
        >
          <option value="">Select category</option>
          <option value="plumbing">Plumbing</option>
          <option value="electrical">Electrical</option>
          <option value="hvac">Heating and cooling</option>
          <option value="appliances">Appliances</option>
          <option value="ventilation">Ventilation</option>
          <option value="bathroom">Bathroom</option>
          <option value="kitchen">Kitchen</option>
          <option value="windows">Windows</option>
          <option value="doors">Doors</option>
          <option value="other">Other</option>
        </select>

        {/* severity */}
        <select
          className="w-full border p-2 rounded"
          value={form.severity}
          onChange={(e) => updateField("severity", e.target.value)}
        >
          <option value="">Severity level</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="emergency">Emergency</option>
        </select>

        {/* location */}
        <select
          className="w-full border p-2 rounded"
          value={form.location}
          onChange={(e) => updateField("location", e.target.value)}
        >
          <option value="">Where is the problem</option>
          <option value="kitchen">Kitchen</option>
          <option value="bathroom">Bathroom</option>
          <option value="bedroom">Bedroom</option>
          <option value="living room">Living room</option>
          <option value="hallway">Hallway</option>
          <option value="balcony">Balcony</option>
        </select>

        {/* access preference */}
        <select
          className="w-full border p-2 rounded"
          value={form.accessPreference}
          onChange={(e) => updateField("accessPreference", e.target.value)}
        >
          <option value="">Select access preference</option>
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
          <option value="evening">Evening</option>
          <option value="anytime">Any time</option>
          <option value="appointment">By appointment</option>
        </select>

        {/* allow entry */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.allowEntry}
            onChange={(e) => updateField("allowEntry", e.target.checked)}
          />
          Allow maintenance to enter if you are away
        </label>

        {/* images */}
        <input
          type="file"
          multiple
          className="w-full border p-2 rounded"
          onChange={(e) => {
  const fileList = e.target.files;
  if (!fileList) return;

  const files = Array.from(fileList).map((f) =>
    URL.createObjectURL(f)
  );

  updateField("images", files);
}}

        />

        <button
          onClick={handleSubmit}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit Request
        </button>
      </div>
    </div>
  );
}
