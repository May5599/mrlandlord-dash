"use client";

import { api } from "@/convex/_generated/api";
// import {} from "@/convex/_generated/dataModel"; // remove entirely
import { useQuery } from "convex/react";
import { useState } from "react";
import PropertiesNav from "../PropertiesNav";

export default function RentAndAvailabilityPage() {
  const properties = useQuery(api.properties.getAllProperties) ?? [];
  const units = useQuery(api.units.getAllUnits) ?? [];
  const tenants = useQuery(api.tenants.getAllTenants) ?? [];

  // ---------------------------------------------------
  // Summary Stats
  // ---------------------------------------------------
  const vacantUnits = units.filter((u) => u.status === "vacant").length;
  const occupiedUnits = units.filter((u) => u.status === "occupied").length;

  const avgRent =
    units.length > 0
      ? Math.round(units.reduce((sum, u) => sum + u.baseRent, 0) / units.length)
      : 0;

  // Lease ending soon (safe check)
  // Lease ending soon (safe check)
const expiringSoon = tenants.filter((t) => {
  if (!t.leaseEnd) return false;

  const leaseEndDate = new Date(t.leaseEnd as string);
  if (isNaN(leaseEndDate.getTime())) return false;

  const days =
    (leaseEndDate.getTime() - new Date().getTime()) /
    (1000 * 60 * 60 * 24);

  return days > 0 && days <= 45;
}).length;


  // ---------------------------------------------------
  // Filters
  // ---------------------------------------------------
  const [propertyFilter, setPropertyFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [rentMin, setRentMin] = useState<string>("");
  const [rentMax, setRentMax] = useState<string>("");

  const filtered = units.filter((u) => {
    const matchesProperty =
      propertyFilter === "all" || u.propertyId === propertyFilter;

    const matchesType = typeFilter === "all" || u.type === typeFilter;

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

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-2">Rent & Availability</h1>
      <p className="text-gray-500 mb-6">
        Analyze rent trends and track availability across your units.
      </p>

      <PropertiesNav />

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-4 gap-6 my-6">
        <SummaryCard title="Vacant Units" value={vacantUnits} color="blue" />
        <SummaryCard title="Occupied Units" value={occupiedUnits} color="green" />
        <SummaryCard title="Average Rent" value={`$${avgRent}`} color="purple" />
        <SummaryCard title="Expiring Soon" value={expiringSoon} color="orange" />
      </div>

      {/* FILTERS */}
      <div className="bg-white border rounded-xl p-5 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
        {/* Property Filter */}
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

        {/* Type */}
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

        {/* Status */}
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

        {/* Rent */}
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

      {/* CHARTS */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <ChartPlaceholder title="Rent Distribution" />
        <ChartPlaceholder title="Availability Timeline" />
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
                  : "—";

              return (
                <tr
                  key={unit._id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-3">{unit.unitNumber}</td>
                  <td className="p-3">{property?.name ?? "—"}</td>
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

/* ---------------- SMALL COMPONENTS ---------------- */

function SummaryCard({
  title,
  value,
}: {
  title: string;
  value: number | string;
  color: string;
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

function ChartPlaceholder({ title }: { title: string }) {
  return (
    <div className="bg-white border rounded-xl p-6 h-[260px] flex justify-center items-center text-gray-400">
      {title} coming soon…
    </div>
  );
}
