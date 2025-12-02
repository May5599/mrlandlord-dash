"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import PropertiesNav from "../PropertiesNav";
import { useMemo } from "react";

export default function ScorePage() {
  const properties = useQuery(api.properties.getAllProperties) ?? [];
  const units = useQuery(api.units.getAllUnits) ?? [];
  const tenants = useQuery(api.tenants.getAllTenants) ?? [];

  // ============================================
  // SECTION 1: KPI CALCULATIONS (Option D)
  // ============================================

  const totalRentCollected = tenants
    .filter((t) => t.status === "active")
    .reduce((sum, t) => sum + t.rentAmount, 0);

  const leaseExpiringSoon = tenants.filter((t) => {
    if (!t.leaseEnd) return false;
    const leaseEndDate = new Date(t.leaseEnd);
    if (isNaN(leaseEndDate.getTime())) return false;

    const diffDays =
      (leaseEndDate.getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24);

    return diffDays > 0 && diffDays <= 45;
  }).length;

  const vacantUnitsCount = units.filter((u) => u.status === "vacant").length;

  const avgRent =
    units.length > 0
      ? Math.round(
          units.reduce((sum, u) => sum + u.baseRent, 0) / units.length
        )
      : 0;

  const estimatedVacancyLoss =
    vacantUnitsCount * avgRent; // Simple version for now

  // ============================================
  // SECTION 2: PROPERTY PERFORMANCE TABLE (Option B)
  // ============================================

  const propertyScores = useMemo(() => {
    return properties.map((p) => {
      const propUnits = units.filter((u) => u.propertyId === p._id);
      const occupied = propUnits.filter((u) => u.status === "occupied");
      const vacant = propUnits.filter((u) => u.status === "vacant");

      const occupancyRate =
        propUnits.length > 0 ? occupied.length / propUnits.length : 0;

      const avgPropertyRent =
        propUnits.length > 0
          ? Math.round(
              propUnits.reduce((sum, u) => sum + u.baseRent, 0) /
                propUnits.length
            )
          : 0;

      const totalRent = occupied.reduce((sum, u) => sum + u.baseRent, 0);

      // Normalize for scoring
      const maxRent = 5000; // arbitrary max normalization point
      const rentScore = Math.min(avgPropertyRent / maxRent, 1);

      const vacancyPenalty =
        propUnits.length > 0 ? vacant.length / propUnits.length : 0;

      const score =
        occupancyRate * 0.6 + rentScore * 0.3 + (1 - vacancyPenalty) * 0.1;

      return {
        property: p,
        occupancyRate,
        avgPropertyRent,
        totalRent,
        vacant: vacant.length,
        score: Math.round(score * 100),
      };
    });
  }, [properties, units]);

  // ============================================
  // RENDER UI
  // ============================================

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-2">Property Performance & Score</h1>
      <p className="text-gray-500 mb-6">
        View portfolio performance, revenue insights, and occupancy health.
      </p>

      <PropertiesNav />

      {/* SECTION 1 — KPI CARDS */}
      <div className="grid grid-cols-4 gap-6 my-6">
        <KpiCard title="Total Rent Collected" value={`$${totalRentCollected}`} />
        <KpiCard title="Lease Expiring Soon" value={leaseExpiringSoon} />
        <KpiCard title="Vacant Units" value={vacantUnitsCount} />
        <KpiCard title="Vacancy Cost (Est.)" value={`$${estimatedVacancyLoss}`} />
      </div>

      {/* SECTION 3 — CHART PLACEHOLDERS */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <ChartPlaceholder title="Revenue by Property" />
        <ChartPlaceholder title="Occupancy Trend" />
      </div>

      {/* SECTION 2 — SCORING TABLE */}
      <div className="bg-white border rounded-xl shadow-sm">
        <table className="w-full text-left">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="p-3">Property</th>
              <th className="p-3">Occupancy Rate</th>
              <th className="p-3">Avg Rent</th>
              <th className="p-3">Total Rent</th>
              <th className="p-3">Vacancies</th>
              <th className="p-3">Score</th>
            </tr>
          </thead>

          <tbody>
            {propertyScores.map((row) => (
              <tr
                key={row.property._id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-3">{row.property.name}</td>
                <td className="p-3">{Math.round(row.occupancyRate * 100)}%</td>
                <td className="p-3">${row.avgPropertyRent}</td>
                <td className="p-3">${row.totalRent}</td>
                <td className="p-3">{row.vacant}</td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      row.score >= 80
                        ? "bg-green-100 text-green-700"
                        : row.score >= 50
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {row.score} / 100
                  </span>
                </td>
              </tr>
            ))}

            {propertyScores.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="p-6 text-center text-gray-400"
                >
                  No property data to score.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* -------------------- COMPONENTS -------------------- */

function KpiCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="p-5 bg-white border rounded-xl shadow-sm">
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className="text-2xl font-bold mt-2">{value}</h3>
    </div>
  );
}

function ChartPlaceholder({ title }: { title: string }) {
  return (
    <div className="bg-white border rounded-xl p-6 h-[260px] flex justify-center items-center text-gray-400">
      {title} coming soon…
    </div>
  );
}
