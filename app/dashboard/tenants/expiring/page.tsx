"use client";

import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import TenantsNav from "../TenantsNav";

export default function ExpiringLeasesPage() {
  const tenants = useQuery(api.tenants.getAllTenants) ?? [];
  const properties = useQuery(api.properties.getAllProperties) ?? [];
  const units = useQuery(api.units.getAllUnits) ?? [];

  // Today + 60 days
  const now = new Date();
  const sixtyDaysFromNow = new Date();
  sixtyDaysFromNow.setDate(now.getDate() + 60);

  // Filter leases ending in next 60 days
  const expiringLeases = useMemo(() => {
    return tenants.filter((t) => {
      if (!t.leaseEnd) return false;

      const endDate = new Date(t.leaseEnd);
      return endDate >= now && endDate <= sixtyDaysFromNow;
    });
  }, [tenants]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-2">Expiring Leases</h1>
      <p className="text-gray-600 mb-6">
        Leases ending within the next <span className="font-medium">60 days</span>.
      </p>

      <TenantsNav />

      <div className="bg-white mt-6 rounded-xl border shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-3 text-left">Tenant</th>
              <th className="p-3">Property</th>
              <th className="p-3">Unit</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Email</th>
              <th className="p-3">Lease Ends</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {expiringLeases.map((t) => {
              const property = properties.find((p) => p._id === t.propertyId);
              const unit = units.find((u) => u._id === t.unitId);

              return (
                <tr key={t._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">
                    <a
                      className="text-indigo-600 hover:underline"
                      href={`/dashboard/tenants/${t._id}`}
                    >
                      {t.name}
                    </a>
                  </td>
                  <td className="p-3">{property?.name ?? "-"}</td>
                  <td className="p-3">{unit?.unitNumber ?? "-"}</td>
                  <td className="p-3">{t.phone}</td>
                  <td className="p-3">{t.email}</td>
                  <td className="p-3">{t.leaseEnd}</td>
                  <td className="p-3 text-right">
                    <a
                      href={`/dashboard/tenants/${t._id}`}
                      className="text-indigo-600"
                    >
                      View
                    </a>
                  </td>
                </tr>
              );
            })}

            {expiringLeases.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="p-6 text-center text-gray-500"
                >
                  No expiring leases found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
