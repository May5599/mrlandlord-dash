


"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import TenantsNav from "../TenantsNav";
import { useParams, useRouter } from "next/navigation";
import { useSessionToken } from "@/hooks/useSessionToken";
import MaintenanceImage from "@/components/MaintenanceImage";

export default function TenantDetailPage() {
  const router = useRouter();
  const { id } = useParams();

  const tenantId = id as Id<"tenants">;

  const token = useSessionToken();
  const isReady = !!token;

  /* ======================================================
     QUERIES
  ====================================================== */

  const tenant =
    useQuery(
      api.tenants.getTenantById,
      isReady ? { token, tenantId } : "skip"
    ) ?? null;

  const tenantProfile =
    useQuery(
      api.tenants.getTenantApplicationProfile,
      isReady ? { token, tenantId } : "skip"
    ) ?? null;

  const properties =
    useQuery(
      api.properties.getAllProperties,
      isReady ? { token } : "skip"
    ) ?? [];

  const units =
    useQuery(
      api.units.getAllUnits,
      isReady ? { token } : "skip"
    ) ?? [];

  /* ======================================================
     MUTATIONS
  ====================================================== */

  const moveOutTenant = useMutation(api.tenants.moveOutTenant);
  const deleteTenant = useMutation(api.tenants.deleteTenant);

  if (!tenant) {
    return <div className="p-8">Loading tenant…</div>;
  }

  const property = properties.find((p) => p._id === tenant.propertyId);
  const unit = units.find((u) => u._id === tenant.unitId);

  /* ======================================================
     ACTIONS
  ====================================================== */

  const handleMoveOut = async () => {
    if (!token || !confirm("Mark tenant as moved out?")) return;

    await moveOutTenant({
      token,
      tenantId: tenant._id,
      unitId: tenant.unitId,
    });

    alert("Tenant marked as vacated.");
  };

  const handleDelete = async () => {
    if (!token || !confirm("Delete this tenant?")) return;

    await deleteTenant({
      token,
      tenantId: tenant._id,
    });

    router.push("/dashboard/tenants/all");
  };

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="p-8 space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold">
          {tenant.name}
        </h1>
        <p className="text-gray-500">
          Tenant profile, lease details and application records
        </p>
      </div>

      <TenantsNav />

      {/* MAIN GRID */}
      <div className="grid grid-cols-3 gap-6">

        {/* BASIC INFO */}
        <div className="bg-white p-6 border rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">
            Basic Details
          </h2>

          <div className="space-y-2 text-sm">
            <p><strong>Email:</strong> {tenant.email}</p>
            <p><strong>Phone:</strong> {tenant.phone}</p>

            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`px-3 py-1 text-xs rounded-full ${
                  tenant.status === "active"
                    ? "bg-green-100 text-green-700"
                    : tenant.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                {tenant.status}
              </span>
            </p>
          </div>

          {tenant.status === "active" && (
            <button
              onClick={handleMoveOut}
              className="mt-6 w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-xl transition"
            >
              Mark as Move-Out
            </button>
          )}

          <button
            onClick={handleDelete}
            className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl transition"
          >
            Delete Tenant
          </button>
        </div>

        {/* LEASE INFO */}
        <div className="bg-white p-6 border rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">
            Lease Information
          </h2>

          <div className="space-y-2 text-sm">
            <p><strong>Lease Start:</strong> {tenant.leaseStart}</p>
            <p><strong>Lease End:</strong> {tenant.leaseEnd ?? "—"}</p>
            <p><strong>Rent:</strong> ${tenant.rentAmount}</p>
            <p><strong>Deposit:</strong> ${tenant.deposit}</p>
            <p><strong>Frequency:</strong> {tenant.rentFrequency}</p>

            <hr className="my-3" />

            <p><strong>Property:</strong> {property?.name ?? "—"}</p>
            <p><strong>Unit:</strong> {unit?.unitNumber ?? "—"}</p>
          </div>
        </div>

        {/* APPLICATION SUMMARY */}
        <div className="bg-white p-6 border rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4">
            Application Summary
          </h2>

          {tenantProfile ? (
            <div className="space-y-2 text-sm">
              <p>
                <strong>Completed:</strong>{" "}
                {tenantProfile.applicationCompleted
                  ? "Yes"
                  : "No"}
              </p>

              <p>
                <strong>Employment:</strong>{" "}
                {tenantProfile.employmentStatus ?? "—"}
              </p>

              <p>
                <strong>Income:</strong>{" "}
                {tenantProfile.monthlyIncome
                  ? `$${tenantProfile.monthlyIncome}`
                  : "—"}
              </p>

              <p>
                <strong>Occupants:</strong>{" "}
                {tenantProfile.occupants?.length ?? 0}
              </p>

              <p>
                <strong>Pets:</strong>{" "}
                {tenantProfile.pets?.length ?? 0}
              </p>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">
              No application profile found
            </p>
          )}
        </div>
      </div>

      {/* DOCUMENTS SECTION FULL WIDTH */}
      <div className="bg-white p-8 border rounded-2xl shadow-sm">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            Application Documents
          </h2>

          {tenantProfile?.documents?.length ? (
            <span className="text-sm text-gray-500">
              {tenantProfile.documents.length} document(s)
            </span>
          ) : null}
        </div>

        {tenantProfile?.documents?.length ? (
          <div className="grid md:grid-cols-4 gap-6">
            {tenantProfile.documents.map((doc: any, i: number) => (
              <div
                key={i}
                className="border rounded-xl overflow-hidden bg-gray-50 hover:shadow-md transition"
              >
                <div className="relative h-40 bg-white">
                  <MaintenanceImage storageId={doc.storageId} />
                </div>

                <div className="p-4">
                  <p className="font-medium capitalize text-sm">
                    {doc.type.replace("_", " ")}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    Uploaded:{" "}
                    {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-sm">
            No application documents uploaded
          </div>
        )}
      </div>

    </div>
  );
}