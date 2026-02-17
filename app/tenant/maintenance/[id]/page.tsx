"use client";

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

  const request = useQuery(
    api.tenantMaintenance.getMyRequestById,
   session
  ? { token: session.token, id: id as Id<"maintenance"> }
  : "skip"

  );

  if (!session || !request) {
    return <p className="p-6">Loading…</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-2">
        {request.title}
      </h1>

      <p className="text-gray-600 mb-6">
        {request.description}
      </p>

      <div className="space-y-3">
        <div>
          <strong>Status:</strong>{" "}
          <span className="capitalize">{request.status}</span>
        </div>

        <div>
          <strong>Category:</strong> {request.category}
        </div>

        <div>
          <strong>Severity:</strong> {request.severity}
        </div>

        <div>
          <strong>Schedule:</strong>{" "}
          {request.scheduledDate ? (
            <>
              {request.scheduledDate}{" "}
              {request.scheduledTimeFrom}–{request.scheduledTimeTo}
            </>
          ) : (
            <span className="text-gray-500">
              Waiting for landlord
            </span>
          )}
        </div>

        <div>
          <strong>Vendor:</strong>{" "}
          {request.assignedVendorId
            ? "Assigned"
            : "Not assigned yet"}
        </div>
      </div>
    </div>
  );
}
