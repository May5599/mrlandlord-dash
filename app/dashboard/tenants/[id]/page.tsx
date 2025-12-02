"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import TenantsNav from "../TenantsNav";
import { useParams, useRouter } from "next/navigation";

export default function TenantDetailPage() {
  const router = useRouter();
  const { id } = useParams(); // tenant ID from URL

  const tenantId = id as Id<"tenants">;

  // Fetch tenant + properties + units
  const tenant = useQuery(api.tenants.getTenantById, { id: tenantId });
  const properties = useQuery(api.properties.getAllProperties) ?? [];
  const units = useQuery(api.units.getAllUnits) ?? [];

  const moveOutTenant = useMutation(api.tenants.moveOutTenant);
  const deleteTenant = useMutation(api.tenants.deleteTenant);

  if (!tenant) {
    return <div className="p-8">Loading tenant…</div>;
  }

  const property = properties.find((p) => p._id === tenant.propertyId);
  const unit = units.find((u) => u._id === tenant.unitId);

  /* ----------------------------------------------------------
     MOVE OUT HANDLER
  ----------------------------------------------------------- */
  const handleMoveOut = async () => {
    if (!confirm("Mark tenant as moved out?")) return;

    await moveOutTenant({
      tenantId: tenant._id,
      unitId: tenant.unitId,
    });

    alert("Tenant marked as vacated.");
  };

  /* ----------------------------------------------------------
     DELETE HANDLER
  ----------------------------------------------------------- */
  const handleDelete = async () => {
    if (!confirm("Delete this tenant?")) return;
    await deleteTenant({ id: tenant._id });
    router.push("/dashboard/tenants/all");
  };

  /* ----------------------------------------------------------
     UI
  ----------------------------------------------------------- */
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-1">Tenant Profile</h1>
      <p className="text-gray-500 mb-6">Full tenant information and history</p>

      <TenantsNav />

      <div className="grid grid-cols-3 gap-6 mt-6">
        
        {/* LEFT SIDE: BASIC INFO */}
        <div className="col-span-1 bg-white p-6 border rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Basic Details</h2>

          <p><strong>Name:</strong> {tenant.name}</p>
          <p><strong>Phone:</strong> {tenant.phone}</p>
          <p><strong>Email:</strong> {tenant.email}</p>
          {tenant.dob && <p><strong>DOB:</strong> {tenant.dob}</p>}
          <p className="mt-2">
            <strong>Status:</strong>{" "}
            <span
              className={`px-3 py-1 text-xs rounded-full ${
                tenant.status === "active"
                  ? "bg-green-100 text-green-700"
                  : tenant.status === "pending-movein"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-300 text-gray-700"
              }`}
            >
              {tenant.status}
            </span>
          </p>

          <button
            onClick={handleMoveOut}
            className="mt-4 w-full bg-orange-600 text-white py-2 rounded"
          >
            Mark as Move-Out
          </button>

          <button
            onClick={handleDelete}
            className="mt-2 w-full bg-red-600 text-white py-2 rounded"
          >
            Delete Tenant
          </button>
        </div>

        {/* MIDDLE: LEASE INFO */}
        <div className="col-span-1 bg-white p-6 border rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Lease Information</h2>

          <p><strong>Lease Start:</strong> {tenant.leaseStart}</p>
          <p><strong>Lease End:</strong> {tenant.leaseEnd ?? "—"}</p>
          <p><strong>Rent:</strong> ${tenant.rentAmount}</p>
          <p><strong>Deposit:</strong> ${tenant.deposit}</p>
          <p><strong>Frequency:</strong> {tenant.rentFrequency}</p>

          <div className="mt-4">
            <p><strong>Property:</strong> {property?.name ?? "—"}</p>
            <p><strong>Unit:</strong> {unit?.unitNumber ?? "—"}</p>
          </div>
        </div>

        {/* RIGHT SIDE: NOTES & DOCUMENTS */}
        <div className="col-span-1 bg-white p-6 border rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Notes</h2>

          {tenant.notes && tenant.notes.length > 0 ? (
            tenant.notes.map((n, i) => (
              <div key={i} className="mb-3 p-3 border rounded bg-gray-50">
                <p className="text-sm">{n.message}</p>
                <p className="text-xs text-gray-500 mt-1">{n.createdAt}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No notes yet</p>
          )}

          <button
            className="mt-3 w-full bg-indigo-600 text-white py-2 rounded"
            onClick={() =>
              router.push(`/dashboard/tenants/${tenant._id}/notes`)
            }
          >
            Add Note
          </button>

          <h2 className="text-lg font-semibold mt-8 mb-4">Documents</h2>

          {tenant.documents && tenant.documents.length > 0 ? (
            tenant.documents.map((d, i) => (
              <div key={i} className="mb-3 p-3 border rounded bg-gray-50">
                <p className="font-medium">{d.type}</p>
                <a className="text-blue-600 text-sm" href={d.url} target="_blank">
                  View Document
                </a>
                <p className="text-xs text-gray-500 mt-1">{d.uploadedAt}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No documents uploaded</p>
          )}

          <button
            className="mt-3 w-full bg-indigo-600 text-white py-2 rounded"
            onClick={() =>
              router.push(`/dashboard/tenants/${tenant._id}/documents`)
            }
          >
            Upload Document
          </button>
        </div>
      </div>
    </div>
  );
}
