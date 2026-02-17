
"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useState, useMemo } from "react";
import PropertiesNav from "../PropertiesNav";
import { useSessionToken } from "@/hooks/useSessionToken";

export default function RentAndAvailabilityPage() {
  const token = useSessionToken();
  const isReady = !!token;

  /* -------------------- Queries -------------------- */

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

  const tenants =
    useQuery(
      api.tenants.getAllTenants,
      isReady ? { token } : "skip"
    ) ?? [];

  /* -------------------- Time Snapshot -------------------- */

  const now = useMemo(() => Date.now(), []);

  /* -------------------- Summary Stats -------------------- */

  const vacantUnits = units.filter((u) => u.status === "vacant").length;
  const occupiedUnits = units.filter((u) => u.status === "occupied").length;

  const avgRent =
    units.length > 0
      ? Math.round(
          units.reduce((sum, u) => sum + u.baseRent, 0) /
            units.length
        )
      : 0;

  const expiringSoon = tenants.filter((t) => {
    if (!t.leaseEnd) return false;

    const leaseEnd = new Date(t.leaseEnd).getTime();
    if (Number.isNaN(leaseEnd)) return false;

    const days = (leaseEnd - now) / (1000 * 60 * 60 * 24);
    return days > 0 && days <= 45;
  }).length;

  /* -------------------- Filters -------------------- */

  const [propertyFilter, setPropertyFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rentMin, setRentMin] = useState("");
  const [rentMax, setRentMax] = useState("");

  const filtered = units.filter((u) => {
    const matchesProperty =
      propertyFilter === "all" || u.propertyId === propertyFilter;

    const matchesType =
      typeFilter === "all" || u.type === typeFilter;

    const matchesStatus =
      statusFilter === "all" || u.status === statusFilter;

    const matchesRentMin =
      rentMin === "" || u.baseRent >= Number(rentMin);

    const matchesRentMax =
      rentMax === "" || u.baseRent <= Number(rentMax);

    return (
      matchesProperty &&
      matchesType &&
      matchesStatus &&
      matchesRentMin &&
      matchesRentMax
    );
  });

  const unitTypes = [...new Set(units.map((u) => u.type))];

  /* -------------------- UI -------------------- */

  if (!isReady) {
    return (
      <div className="p-8 text-gray-400">
        Loading rent & availability…
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-2">
        Rent & Availability
      </h1>
      <p className="text-gray-500 mb-6">
        Analyze rent trends and track availability across your units.
      </p>

      <PropertiesNav />

      {/* SUMMARY */}
      <div className="grid grid-cols-4 gap-6 my-6">
        <SummaryCard title="Vacant Units" value={vacantUnits} />
        <SummaryCard title="Occupied Units" value={occupiedUnits} />
        <SummaryCard title="Average Rent" value={`$${avgRent}`} />
        <SummaryCard title="Expiring Soon" value={expiringSoon} />
      </div>

      {/* FILTERS */}
      <div className="bg-white border rounded-xl p-5 shadow-sm mb-6 flex flex-wrap gap-4">
        <select
          className="border p-2 rounded"
          value={propertyFilter}
          onChange={(e) => setPropertyFilter(e.target.value)}
        >
          <option value="all">All Properties</option>
          {properties.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          {unitTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Any Status</option>
          <option value="occupied">Occupied</option>
          <option value="vacant">Vacant</option>
          <option value="maintenance">Maintenance</option>
        </select>

        <input
          placeholder="Min Rent"
          className="border p-2 rounded w-28"
          value={rentMin}
          onChange={(e) => setRentMin(e.target.value)}
        />

        <input
          placeholder="Max Rent"
          className="border p-2 rounded w-28"
          value={rentMax}
          onChange={(e) => setRentMax(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-xl shadow-sm">
        <table className="w-full text-left">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="p-3">Unit</th>
              <th className="p-3">Property</th>
              <th className="p-3">Type</th>
              <th className="p-3">Rent</th>
              <th className="p-3">Status</th>
              <th className="p-3">Availability</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((unit) => {
              const property = properties.find(
                (p) => p._id === unit.propertyId
              );

              const tenant = tenants.find(
                (t) => t._id === unit.currentTenantId
              );

              const availability =
                unit.status === "vacant"
                  ? "Available Now"
                  : tenant?.leaseEnd
                  ? `Ends: ${tenant.leaseEnd}`
                  : " ";

              return (
                <tr
                  key={unit._id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-3">{unit.unitNumber}</td>
                  <td className="p-3">
                    {property?.name ?? " "}
                  </td>
                  <td className="p-3">{unit.type}</td>
                  <td className="p-3">${unit.baseRent}</td>
                  <td className="p-3">
                    <StatusBadge status={unit.status} />
                  </td>
                  <td className="p-3">{availability}</td>
                </tr>
              );
            })}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="p-6 text-center text-gray-400"
                >
                  No units found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- Components ---------------- */

function SummaryCard({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) {
  return (
    <div className="p-5 bg-white border rounded-xl shadow-sm">
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className="text-2xl font-bold mt-2">{value}</h3>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    occupied: "bg-green-100 text-green-700",
    vacant: "bg-blue-100 text-blue-700",
    maintenance: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span className={`px-3 py-1 text-xs rounded-full ${map[status]}`}>
      {status}
    </span>
  );
}
