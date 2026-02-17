

"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import MaintenanceNav from "../MaintenanceNav";
import { Id } from "@/convex/_generated/dataModel";
import { useSessionToken } from "@/hooks/useSessionToken";

export default function AllMaintenanceRequests() {
  /* ----------------------------------------------------------
     AUTH (CUSTOM SESSION TOKEN)
  ----------------------------------------------------------- */
  const token = useSessionToken();
  const isReady = !!token;

  /* ----------------------------------------------------------
     QUERIES (COMPANY SCOPED)
  ----------------------------------------------------------- */
  const requests =
    useQuery(
      api.maintenance.getAllRequests,
      isReady ? { token } : "skip"
    ) ?? [];

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

  /* ----------------------------------------------------------
     MUTATIONS
  ----------------------------------------------------------- */
  const deleteRequest = useMutation(api.maintenance.deleteRequest);

  /* ---------------------------------------
        FILTER STATE
  --------------------------------------- */
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | string>("all");
  const [filterPriority, setFilterPriority] = useState<"all" | string>("all");
  const [filterProperty, setFilterProperty] = useState<
    "all" | Id<"properties">
  >("all");

  /* ---------------------------------------
        FILTERED REQUESTS
  --------------------------------------- */
  const filtered = useMemo(() => {
    return requests.filter((r) => {
      const property = properties.find((p) => p._id === r.propertyId);
      const unit = units.find((u) => u._id === r.unitId);

      const matchesSearch =
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase()) ||
        property?.name.toLowerCase().includes(search.toLowerCase()) ||
        unit?.unitNumber.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        filterStatus === "all" || r.status === filterStatus;

      const matchesPriority =
        filterPriority === "all" || r.priority === filterPriority;

      const matchesProperty =
        filterProperty === "all" || r.propertyId === filterProperty;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesProperty
      );
    });
  }, [
    requests,
    search,
    filterStatus,
    filterPriority,
    filterProperty,
    properties,
    units,
  ]);

  /* ---------------------------------------
        DELETE HANDLER
  --------------------------------------- */
  const handleDelete = async (id: Id<"maintenance">) => {
    if (!isReady) return;
    if (!confirm("Delete this request?")) return;

    await deleteRequest({
      token,
      id,
    });
  };

  /* ---------------------------------------
        UI
  --------------------------------------- */
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-2">
        All Maintenance Requests
      </h1>
      <p className="text-gray-600 mb-6">
        View and manage all maintenance issues across properties.
      </p>

      <MaintenanceNav />

      {!isReady ? (
        <p className="text-gray-500 mt-6">Loading maintenance requests…</p>
      ) : (
        <>
          {/* FILTERS */}
          <div className="bg-white border shadow-sm rounded-xl p-4 mb-6 flex flex-wrap gap-4">
            {/* SEARCH */}
            <input
              className="border rounded p-2 w-64"
              placeholder="Search title, unit, property..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* FILTER PROPERTY */}
            <select
              className="border p-2 rounded"
              value={filterProperty}
              onChange={(e) =>
                setFilterProperty(
                  e.target.value === "all"
                    ? "all"
                    : (e.target.value as Id<"properties">)
                )
              }
            >
              <option value="all">All Properties</option>
              {properties.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>

            {/* STATUS */}
            <select
              className="border p-2 rounded"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Any Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            {/* PRIORITY */}
            <select
              className="border p-2 rounded"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="all">Any Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* TABLE */}
          <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Property</th>
                  <th className="p-3">Unit</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Severity</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Created</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((req) => {
                  const property = properties.find(
                    (p) => p._id === req.propertyId
                  );
                  const unit = units.find((u) => u._id === req.unitId);

                  return (
                    <tr
                      key={req._id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-3 font-medium">{req.title}</td>
                      <td className="p-3">{property?.name ?? " "}</td>
                      <td className="p-3">{unit?.unitNumber ?? " "}</td>
                      <td className="p-3 capitalize">{req.category}</td>

                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            req.severity === "emergency"
                              ? "bg-red-100 text-red-700"
                              : req.severity === "high"
                              ? "bg-orange-100 text-orange-700"
                              : req.severity === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {req.severity}
                        </span>
                      </td>

                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            req.status === "open"
                              ? "bg-orange-100 text-orange-700"
                              : req.status === "in-progress"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>

                      <td className="p-3">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </td>

                      <td className="p-3 text-right">
                        <a
                          href={`/dashboard/maintenance/${req._id}`}
                          className="text-indigo-600 mr-4"
                        >
                          View
                        </a>

                        <button
                          onClick={() => handleDelete(req._id)}
                          className="text-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center p-6 text-gray-400"
                    >
                      No maintenance requests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

