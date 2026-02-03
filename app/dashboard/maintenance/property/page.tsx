"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import MaintenanceNav from "../MaintenanceNav";
import Link from "next/link";
import { useSessionToken } from "@/hooks/useSessionToken";

export default function PropertyWiseMaintenancePage() {
  /* ----------------------------------------------------------
     AUTH (CUSTOM SESSION TOKEN)
  ----------------------------------------------------------- */
  const token = useSessionToken();
  const isReady = !!token;

  /* ----------------------------------------------------------
     QUERIES (COMPANY SCOPED)
  ----------------------------------------------------------- */
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

  const requests =
    useQuery(
      api.maintenance.getAllRequests,
      isReady ? { token } : "skip"
    ) ?? [];

  /* ----------------------------------------------------------
     GROUP REQUESTS BY PROPERTY
  ----------------------------------------------------------- */
  const grouped = properties.map((property) => {
    const propertyUnits = units.filter(
      (u) => u.propertyId === property._id
    );

    const propertyRequests = requests.filter((r) =>
      propertyUnits.some((u) => u._id === r.unitId)
    );

    return {
      property,
      requests: propertyRequests,
    };
  });

  /* ----------------------------------------------------------
     UI
  ----------------------------------------------------------- */
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-2">
        Property Wise Maintenance
      </h1>
      <p className="text-gray-600 mb-6">
        View all maintenance requests for each property.
      </p>

      <MaintenanceNav />

      {!isReady ? (
        <p className="text-gray-500 mt-6">
          Loading maintenance data…
        </p>
      ) : (
        <div className="mt-6 space-y-8">
          {grouped.map(({ property, requests }) => (
            <div
              key={property._id}
              className="bg-white border rounded-xl shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold mb-3">
                {property.name}
              </h2>

              {requests.length === 0 ? (
                <p className="text-gray-500">
                  No maintenance requests yet.
                </p>
              ) : (
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Title</th>
                      <th className="text-left p-2">Unit</th>
                      <th className="text-left p-2">Priority</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Category</th>
                      <th className="text-left p-2">Severity</th>
                      <th className="text-left p-2">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {requests.map((req) => {
                      const unit = units.find(
                        (u) => u._id === req.unitId
                      );

                      return (
                        <tr
                          key={req._id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="p-2">{req.title}</td>
                          <td className="p-2">
                            {unit?.unitNumber ?? "—"}
                          </td>
                          <td className="p-2 capitalize">
                            {req.priority}
                          </td>
                          <td className="p-2 capitalize">
                            {req.status}
                          </td>
                          <td className="p-2 capitalize">
                            {req.category}
                          </td>
                          <td className="p-2 capitalize">
                            {req.severity}
                          </td>
                          <td className="p-2">
                            <Link
                              href={`/dashboard/maintenance/${req._id}`}
                              className="text-indigo-600 hover:underline"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
