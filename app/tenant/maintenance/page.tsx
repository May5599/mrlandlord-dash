"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

type TenantSession = {
  valid: boolean;
  token: string;
};

export default function TenantMaintenanceList() {
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

  const requests = useQuery(
    api.tenantMaintenance.getMyRequests,
    session ? { token: session.token } : "skip"
  );

  if (!session || !requests) {
    return <p className="p-6">Loading…</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">
          My Maintenance Requests
        </h1>

        <Link
          href="/tenant/maintenance/new"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          New Request
        </Link>
      </div>

      {requests.length === 0 && (
        <p className="text-gray-500">
          No maintenance requests submitted yet.
        </p>
      )}

      <div className="space-y-4">
        {requests.map((r) => (
          <Link
            key={r._id}
            href={`/tenant/maintenance/${r._id}`}
            className="block border rounded p-4 hover:bg-gray-50"
          >
            <div className="flex justify-between">
              <h2 className="font-medium">{r.title}</h2>
              <span className="capitalize text-sm">
                {r.status}
              </span>
            </div>

            <p className="text-sm text-gray-500 mt-1">
              {r.category} • {r.severity}
            </p>

            {r.scheduledDate ? (
              <p className="text-sm mt-2">
                📅 {r.scheduledDate} {r.scheduledTimeFrom}–{r.scheduledTimeTo}
              </p>
            ) : (
              <p className="text-sm mt-2 text-gray-400">
                Not scheduled yet
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
