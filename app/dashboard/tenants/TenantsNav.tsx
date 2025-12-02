"use client";

import { usePathname } from "next/navigation";

const baseTabs = [
  { name: "Overview", href: "/dashboard/tenants" },
  { name: "All Tenants", href: "/dashboard/tenants/all" },
  { name: "Add Tenant", href: "/dashboard/tenants/new" },
  { name: "Expiring Leases", href: "/dashboard/tenants/expiring" },
  { name: "Late Payments", href: "/dashboard/tenants/late" },
];

export default function TenantsNav() {
  const pathname = usePathname();

  const tabs = [...baseTabs];

  const pathParts = pathname.split("/"); // ['', 'dashboard', 'tenants', 'abc123']

  const lastPart = pathParts[3];

  const isTenantProfile =
    pathname.startsWith("/dashboard/tenants/") &&
    pathParts.length === 4 &&
    !["all", "new", "expiring", "late", ""].includes(lastPart);

  if (isTenantProfile) {
    tabs.push({
      name: "Tenant Profile",
      href: pathname,
    });
  }

  return (
    <div className="flex gap-4 mb-6 border-b pb-2">
      {tabs.map((tab) => {
        const active = pathname === tab.href;

        return (
          <a
            key={tab.href}
            href={tab.href}
            className={`px-3 py-1 rounded ${
              active
                ? "bg-indigo-600 text-white"
                : "text-gray-600 hover:text-indigo-600"
            }`}
          >
            {tab.name}
          </a>
        );
      })}
    </div>
  );
}
